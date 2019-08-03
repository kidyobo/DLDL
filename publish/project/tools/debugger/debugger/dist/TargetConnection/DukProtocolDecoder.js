"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events = require("events");
var fs = require("fs");
var Common_1 = require("./Common");
var DukMsgDecoder_1 = require("./DukMsgDecoder");
/**
 * 负责将从网络接收的Duk二进制数据解码成可读的Json对象
 */
var DukProtocolDecoder = (function (_super) {
    __extends(DukProtocolDecoder, _super);
    function DukProtocolDecoder(inputStream, protocolVersion, rawDumpFileName, textDumpFileName, textDumpFilePrefix, hexDumpConsolePrefix, textDumpConsolePrefix) {
        var _this = _super.call(this) || this;
        _this.readableNumberValue = true;
        _this.closed = false; // stream is closed/broken, don't parse anymore
        _this.inputStream = null;
        _this.bytes = 0;
        _this.dvalues = 0;
        _this.messages = 0;
        _this.requests = 0;
        _this.prevBytes = 0;
        _this.bytesPerSec = 0;
        _this.statsTimer = null;
        _this.dukMsgDecoder = new DukMsgDecoder_1.DukMsgDecoder();
        _this.inputStream = inputStream;
        var buf = new Buffer(0); // accumulate data
        var msg = []; // accumulated message until EOM
        var versionIdentification;
        var statsInterval = 2000;
        var statsIntervalSec = statsInterval / 1000;
        _this.statsTimer = setInterval(function () {
            _this.bytesPerSec = (_this.bytes - _this.prevBytes) / statsIntervalSec;
            _this.prevBytes = _this.bytes;
            _this.emit('stats-update');
        }, statsInterval);
        var consume = function (n) {
            var tmp = new Buffer(buf.length - n);
            buf.copy(tmp, 0, n);
            buf = tmp;
        };
        inputStream.on('data', function (data) {
            var i, n, x, v, gotValue, len, t, tmpbuf, verstr;
            var prettyMsg;
            if (_this.closed || !_this.inputStream) {
                console.log('Ignoring incoming data from closed input stream, len ' + data.length);
                return;
            }
            _this.bytes += data.length;
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
                    _this.emit('transport-error', 'Parse error (version identification too long), dropping connection');
                    _this.close();
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
                        _this.emit('protocol-version', {
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
                gotValue = false; // used to flag special values like undefined
                if (x >= 0xc0) {
                    // 0xc0...0xff: integers 0-16383
                    if (buf.length >= 2) {
                        v = ((x - 0xc0) << 8) + buf[1];
                        consume(2);
                    }
                }
                else if (x >= 0x80) {
                    // 0x80...0xbf: integers 0-63
                    v = x - 0x80;
                    consume(1);
                }
                else if (x >= 0x60) {
                    // 0x60...0x7f: strings with length 0-31
                    len = x - 0x60;
                    if (buf.length >= 1 + len) {
                        v = new Buffer(len);
                        buf.copy(v, 0, 1, 1 + len);
                        v = _this.bufferToDebugString(v);
                        consume(1 + len);
                    }
                }
                else {
                    switch (x) {
                        case 0x00:
                            v = Common_1.DVAL_JSON.EOM;
                            consume(1);
                            break;
                        case 0x01:
                            v = Common_1.DVAL_JSON.REQ;
                            consume(1);
                            break;
                        case 0x02:
                            v = Common_1.DVAL_JSON.REP;
                            consume(1);
                            break;
                        case 0x03:
                            v = Common_1.DVAL_JSON.ERR;
                            consume(1);
                            break;
                        case 0x04:
                            v = Common_1.DVAL_JSON.NFY;
                            consume(1);
                            break;
                        case 0x10:
                            if (buf.length >= 5) {
                                v = buf.readInt32BE(1);
                                consume(5);
                            }
                            break;
                        case 0x11:
                            if (buf.length >= 5) {
                                len = buf.readUInt32BE(1);
                                if (buf.length >= 5 + len) {
                                    v = new Buffer(len);
                                    buf.copy(v, 0, 5, 5 + len);
                                    v = _this.bufferToDebugString(v);
                                    consume(5 + len);
                                }
                            }
                            break;
                        case 0x12:
                            if (buf.length >= 3) {
                                len = buf.readUInt16BE(1);
                                if (buf.length >= 3 + len) {
                                    v = new Buffer(len);
                                    buf.copy(v, 0, 3, 3 + len);
                                    v = _this.bufferToDebugString(v);
                                    consume(3 + len);
                                }
                            }
                            break;
                        case 0x13:
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
                        case 0x14:
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
                        case 0x15:
                            v = { type: 'unused' };
                            consume(1);
                            break;
                        case 0x16:
                            v = { type: 'undefined' };
                            gotValue = true; // indicate 'v' is actually set
                            consume(1);
                            break;
                        case 0x17:
                            v = null;
                            gotValue = true; // indicate 'v' is actually set
                            consume(1);
                            break;
                        case 0x18:
                            v = true;
                            consume(1);
                            break;
                        case 0x19:
                            v = false;
                            consume(1);
                            break;
                        case 0x1a:
                            if (buf.length >= 9) {
                                v = new Buffer(8);
                                buf.copy(v, 0, 1, 9);
                                v = { type: 'number', data: v.toString('hex') };
                                if (_this.readableNumberValue) {
                                    // The value key should not be used programmatically,
                                    // it is just there to make the dumps more readable.
                                    v.value = buf.readDoubleBE(1);
                                }
                                consume(9);
                            }
                            break;
                        case 0x1b:
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
                        case 0x1c:
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
                        case 0x1d:
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
                        case 0x1e:
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
                            _this.emit('transport-error', 'Parse error, dropping connection');
                            _this.close();
                    }
                }
                if (typeof v === 'undefined' && !gotValue) {
                    break;
                }
                msg.push(v);
                _this.dvalues++;
                // Could emit a 'debug-value' event here, but that's not necessary
                // because the receiver will just collect statistics which can also
                // be done using the finished message.
                if (v === Common_1.DVAL_JSON.EOM) {
                    _this.messages++;
                    if (textDumpFileName || textDumpConsolePrefix) {
                        prettyMsg = _this.prettyDebugMessage(msg);
                        if (textDumpFileName) {
                            fs.appendFileSync(textDumpFileName, (textDumpFilePrefix || '') + prettyMsg + '\n');
                        }
                        if (textDumpConsolePrefix) {
                            console.log(textDumpConsolePrefix + prettyMsg);
                        }
                    }
                    _this.emit('debug-message', _this.dukMsgDecoder.decode(msg));
                    msg = []; // new object, old may be in circulation for a while
                }
            }
        });
        // Not all streams will emit this.
        inputStream.on('error', function (err) {
            _this.emit('transport-error', err);
            _this.close();
        });
        // Not all streams will emit this.
        inputStream.on('close', function () {
            _this.close();
        });
        return _this;
    }
    DukProtocolDecoder.prototype.close = function () {
        if (this.closed)
            return;
        this.closed = true;
        if (this.statsTimer) {
            clearInterval(this.statsTimer);
            this.statsTimer = null;
        }
        this.emit('transport-close');
    };
    DukProtocolDecoder.prototype.bufferToDebugString = function (buf) {
        var cp = [];
        var i, n;
        for (i = 0, n = buf.length; i < n; i++) {
            cp[i] = String.fromCharCode(buf[i]);
        }
        return cp.join('');
    };
    DukProtocolDecoder.prototype.prettyDebugMessage = function (msg) {
        return msg.map(this.prettyDebugValue).join(' ');
    };
    /* Pretty print a dvalue.  Useful for dumping etc. */
    DukProtocolDecoder.prototype.prettyDebugValue = function (x) {
        if (typeof x === 'object' && x !== null) {
            if (x.type === 'eom') {
                return 'EOM';
            }
            else if (x.type === 'req') {
                return 'REQ';
            }
            else if (x.type === 'rep') {
                return 'REP';
            }
            else if (x.type === 'err') {
                return 'ERR';
            }
            else if (x.type === 'nfy') {
                return 'NFY';
            }
        }
        return JSON.stringify(x);
    };
    return DukProtocolDecoder;
}(events.EventEmitter));
exports.DukProtocolDecoder = DukProtocolDecoder;
//# sourceMappingURL=DukProtocolDecoder.js.map