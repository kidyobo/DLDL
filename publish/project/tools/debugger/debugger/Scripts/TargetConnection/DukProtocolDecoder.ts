import events = require('events');
import fs = require('fs');
import { DVAL_JSON, DukMsg } from './Common'
import { DukCmdMeta } from './DukCmdMeta'
import { DukMsgDecoder } from './DukMsgDecoder'
/**
 * 负责将从网络接收的Duk二进制数据解码成可读的Json对象
 */
export class DukProtocolDecoder extends events.EventEmitter {
    public readableNumberValue = true;
    private closed: boolean = false; // stream is closed/broken, don't parse anymore
    private inputStream = null;
    private bytes = 0;
    private dvalues = 0;
    private messages = 0;
    private requests = 0;
    private prevBytes = 0;
    private bytesPerSec = 0;
    private statsTimer = null;
    private dukMsgDecoder = new DukMsgDecoder();

    constructor(inputStream,
        protocolVersion,
        rawDumpFileName,
        textDumpFileName,
        textDumpFilePrefix,
        hexDumpConsolePrefix,
        textDumpConsolePrefix) {
        super();

        this.inputStream = inputStream;
        let buf = new Buffer(0);    // accumulate data
        let msg = [];               // accumulated message until EOM
        let versionIdentification;

        let statsInterval = 2000;
        let statsIntervalSec = statsInterval / 1000;
        this.statsTimer = setInterval(() => {
            this.bytesPerSec = (this.bytes - this.prevBytes) / statsIntervalSec;
            this.prevBytes = this.bytes;
            this.emit('stats-update');
        }, statsInterval);

        let consume = (n) => {
            let tmp = new Buffer(buf.length - n);
            buf.copy(tmp, 0, n);
            buf = tmp;
        }

        inputStream.on('data', (data) => {
            let i, n, x, v, gotValue, len, t, tmpbuf, verstr;
            let prettyMsg;

            if (this.closed || !this.inputStream) {
                console.log('Ignoring incoming data from closed input stream, len ' + data.length);
                return;
            }

            this.bytes += data.length;
            if (rawDumpFileName) {
                fs.appendFileSync(rawDumpFileName, data);
            }
            if (hexDumpConsolePrefix) {
                console.log(hexDumpConsolePrefix + data.toString('hex'));
            }

            buf = Buffer.concat([buf, data]);

            // Protocol version handling.  When dumping an output stream, the
            // caller gives a non-null protocolVersion so we don't read one here.
            if (protocolVersion == null) {
                if (buf.length > 1024) {
                    this.emit('transport-error', 'Parse error (version identification too long), dropping connection');
                    this.close();
                    return;
                }

                for (i = 0, n = buf.length; i < n; i++) {
                    if (buf[i] == 0x0a) {
                        tmpbuf = new Buffer(i);
                        buf.copy(tmpbuf, 0, 0, i);
                        consume(i + 1);
                        verstr = tmpbuf.toString('utf-8');
                        t = verstr.split(' ');
                        protocolVersion = Number(t[0]);
                        versionIdentification = verstr;

                        this.emit('protocol-version', {
                            protocolVersion: protocolVersion,
                            versionIdentification: versionIdentification
                        });
                        break;
                    }
                }

                if (protocolVersion == null) {
                    // Still waiting for version identification to complete.
                    return;
                }
            }

            // Parse complete dvalues (quite inefficient now) by trial parsing.
            // Consume a value only when it's fully present in 'buf'.
            // See doc/debugger.rst for format description.

            while (buf.length > 0) {
                x = buf[0];
                v = undefined;
                gotValue = false;  // used to flag special values like undefined

                if (x >= 0xc0) {
                    // 0xc0...0xff: integers 0-16383
                    if (buf.length >= 2) {
                        v = ((x - 0xc0) << 8) + buf[1];
                        consume(2);
                    }
                } else if (x >= 0x80) {
                    // 0x80...0xbf: integers 0-63
                    v = x - 0x80;
                    consume(1);
                } else if (x >= 0x60) {
                    // 0x60...0x7f: strings with length 0-31
                    len = x - 0x60;
                    if (buf.length >= 1 + len) {
                        v = new Buffer(len);
                        buf.copy(v, 0, 1, 1 + len);
                        v = this.bufferToDebugString(v);
                        consume(1 + len);
                    }
                } else {
                    switch (x) {
                        case 0x00: v = DVAL_JSON.EOM; consume(1); break;
                        case 0x01: v = DVAL_JSON.REQ; consume(1); break;
                        case 0x02: v = DVAL_JSON.REP; consume(1); break;
                        case 0x03: v = DVAL_JSON.ERR; consume(1); break;
                        case 0x04: v = DVAL_JSON.NFY; consume(1); break;
                        case 0x10:  // 4-byte signed integer
                            if (buf.length >= 5) {
                                v = buf.readInt32BE(1);
                                consume(5);
                            }
                            break;
                        case 0x11:  // 4-byte string
                            if (buf.length >= 5) {
                                len = buf.readUInt32BE(1);
                                if (buf.length >= 5 + len) {
                                    v = new Buffer(len);
                                    buf.copy(v, 0, 5, 5 + len);
                                    v = this.bufferToDebugString(v);
                                    consume(5 + len);
                                }
                            }
                            break;
                        case 0x12:  // 2-byte string
                            if (buf.length >= 3) {
                                len = buf.readUInt16BE(1);
                                if (buf.length >= 3 + len) {
                                    v = new Buffer(len);
                                    buf.copy(v, 0, 3, 3 + len);
                                    v = this.bufferToDebugString(v);
                                    consume(3 + len);
                                }
                            }
                            break;
                        case 0x13:  // 4-byte buffer
                            if (buf.length >= 5) {
                                len = buf.readUInt32BE(1);
                                if (buf.length >= 5 + len) {
                                    v = new Buffer(len);
                                    buf.copy(v, 0, 5, 5 + len);
                                    v = { type: 'buffer', data: v.toString('hex') };
                                    consume(5 + len);
                                    // Value could be a Node.js buffer directly, but
                                    // we prefer all dvalues to be JSON compatible
                                }
                            }
                            break;
                        case 0x14:  // 2-byte buffer
                            if (buf.length >= 3) {
                                len = buf.readUInt16BE(1);
                                if (buf.length >= 3 + len) {
                                    v = new Buffer(len);
                                    buf.copy(v, 0, 3, 3 + len);
                                    v = { type: 'buffer', data: v.toString('hex') };
                                    consume(3 + len);
                                    // Value could be a Node.js buffer directly, but
                                    // we prefer all dvalues to be JSON compatible
                                }
                            }
                            break;
                        case 0x15:  // unused/none
                            v = { type: 'unused' };
                            consume(1);
                            break;
                        case 0x16:  // undefined
                            v = { type: 'undefined' };
                            gotValue = true;  // indicate 'v' is actually set
                            consume(1);
                            break;
                        case 0x17:  // null
                            v = null;
                            gotValue = true;  // indicate 'v' is actually set
                            consume(1);
                            break;
                        case 0x18:  // true
                            v = true;
                            consume(1);
                            break;
                        case 0x19:  // false
                            v = false;
                            consume(1);
                            break;
                        case 0x1a:  // number (IEEE double), big endian
                            if (buf.length >= 9) {
                                v = new Buffer(8);
                                buf.copy(v, 0, 1, 9);
                                v = { type: 'number', data: v.toString('hex') };

                                if (this.readableNumberValue) {
                                    // The value key should not be used programmatically,
                                    // it is just there to make the dumps more readable.
                                    v.value = buf.readDoubleBE(1);
                                }
                                consume(9);
                            }
                            break;
                        case 0x1b:  // object
                            if (buf.length >= 3) {
                                len = buf[2];
                                if (buf.length >= 3 + len) {
                                    v = new Buffer(len);
                                    buf.copy(v, 0, 3, 3 + len);
                                    v = { type: 'object', 'class': buf[1], pointer: v.toString('hex') };
                                    consume(3 + len);
                                }
                            }
                            break;
                        case 0x1c:  // pointer
                            if (buf.length >= 2) {
                                len = buf[1];
                                if (buf.length >= 2 + len) {
                                    v = new Buffer(len);
                                    buf.copy(v, 0, 2, 2 + len);
                                    v = { type: 'pointer', pointer: v.toString('hex') };
                                    consume(2 + len);
                                }
                            }
                            break;
                        case 0x1d:  // lightfunc
                            if (buf.length >= 4) {
                                len = buf[3];
                                if (buf.length >= 4 + len) {
                                    v = new Buffer(len);
                                    buf.copy(v, 0, 4, 4 + len);
                                    v = { type: 'lightfunc', flags: buf.readUInt16BE(1), pointer: v.toString('hex') };
                                    consume(4 + len);
                                }
                            }
                            break;
                        case 0x1e:  // heapptr
                            if (buf.length >= 2) {
                                len = buf[1];
                                if (buf.length >= 2 + len) {
                                    v = new Buffer(len);
                                    buf.copy(v, 0, 2, 2 + len);
                                    v = { type: 'heapptr', pointer: v.toString('hex') };
                                    consume(2 + len);
                                }
                            }
                            break;
                        default:
                            this.emit('transport-error', 'Parse error, dropping connection');
                            this.close();
                    }
                }

                if (typeof v === 'undefined' && !gotValue) {
                    break;
                }
                msg.push(v);
                this.dvalues++;

                // Could emit a 'debug-value' event here, but that's not necessary
                // because the receiver will just collect statistics which can also
                // be done using the finished message.

                if (v === DVAL_JSON.EOM) {
                    this.messages++;

                    if (textDumpFileName || textDumpConsolePrefix) {
                        prettyMsg = this.prettyDebugMessage(msg);
                        if (textDumpFileName) {
                            fs.appendFileSync(textDumpFileName, (textDumpFilePrefix || '') + prettyMsg + '\n');
                        }
                        if (textDumpConsolePrefix) {
                            console.log(textDumpConsolePrefix + prettyMsg);
                        }
                    }

                    this.emit('debug-message', this.dukMsgDecoder.decode(msg));
                    msg = [];  // new object, old may be in circulation for a while
                }
            }
        });

        // Not all streams will emit this.
        inputStream.on('error', (err) => {
            this.emit('transport-error', err);
            this.close();
        });

        // Not all streams will emit this.
        inputStream.on('close', () => {
            this.close();
        });
    }

    close() {
        if (this.closed)
            return;

        this.closed = true;
        if (this.statsTimer) {
            clearInterval(this.statsTimer);
            this.statsTimer = null;
        }
        this.emit('transport-close');
    }

    private bufferToDebugString(buf) {
        let cp = [];
        let i, n;
        for (i = 0, n = buf.length; i < n; i++) {
            cp[i] = String.fromCharCode(buf[i]);
        }
        return cp.join('');
    }

    private prettyDebugMessage(msg) {
        return msg.map(this.prettyDebugValue).join(' ');
    }

    /* Pretty print a dvalue.  Useful for dumping etc. */
    private prettyDebugValue(x) {
        if (typeof x === 'object' && x !== null) {
            if (x.type === 'eom') {
                return 'EOM';
            } else if (x.type === 'req') {
                return 'REQ';
            } else if (x.type === 'rep') {
                return 'REP';
            } else if (x.type === 'err') {
                return 'ERR';
            } else if (x.type === 'nfy') {
                return 'NFY';
            }
        }
        return JSON.stringify(x);
    }
}

