import net = require('net');
import { DukMsg, DVAL_JSON } from './Common'
import { Util } from '../Util';
import { DukCmdMeta } from './DukCmdMeta'

export class DukProtocolEncoder {
    static ins = new DukProtocolEncoder();

    private dval_eom: Buffer = null;
    private dval_req: Buffer = null;
    private dval_rep: Buffer = null;
    private dval_nfy: Buffer = null;
    private dval_err: Buffer = null;

    private constructor() {
        this.dval_eom = this.formatDebugValue(DVAL_JSON.EOM);
        this.dval_req = this.formatDebugValue(DVAL_JSON.REQ);
        this.dval_rep = this.formatDebugValue(DVAL_JSON.REP);
        this.dval_nfy = this.formatDebugValue(DVAL_JSON.NFY);
        this.dval_err = this.formatDebugValue(DVAL_JSON.ERR);
    }

    encode(writer: net.Socket, msg: DukMsg) {
        let first_dval;
        let args_dvalues = this.formatDvalues(msg.args);
        let last_dval = this.dval_eom;
        let cmd;

        if (msg.request) {
            // "request" can be a string or "true"
            first_dval = this.dval_req;
            cmd = this.determineCommandNumber(msg.request, msg.command);
        }
        else if (msg.reply) {
            first_dval = this.dval_rep;
        }
        else if (msg.notify) {
            // "notify" can be a string or "true"
            first_dval = this.dval_nfy;
            cmd = this.determineCommandNumber(msg.notify, msg.command);
        }
        else if (msg.error) {
            first_dval = this.dval_err;
        }
        else {
            throw new Error('Invalid input JSON message: ' + JSON.stringify(msg));
        }

        writer.write(first_dval);
        if (cmd) {
            writer.write(this.formatDebugValue(cmd));
        }
        args_dvalues.forEach((v) => {
            writer.write(v);
        });
        writer.write(last_dval);
    }

    private formatDvalues(args): Array<any> {
        if (!args) {
            return [];
        }
        return args.map((v) => {
            return this.formatDebugValue(v);
        });
    }

    private formatDebugValue(v) {
        let buf, dec, len;
        // See doc/debugger.rst for format description.
        if (typeof v === 'object' && v !== null) {
            // Note: typeof null === 'object', so null special case explicitly
            if (v.type === 'eom') {
                return new Buffer([0x00]);
            } else if (v.type === 'req') {
                return new Buffer([0x01]);
            } else if (v.type === 'rep') {
                return new Buffer([0x02]);
            } else if (v.type === 'err') {
                return new Buffer([0x03]);
            } else if (v.type === 'nfy') {
                return new Buffer([0x04]);
            } else if (v.type === 'unused') {
                return new Buffer([0x15]);
            } else if (v.type === 'undefined') {
                return new Buffer([0x16]);
            } else if (v.type === 'number') {
                dec = new Buffer(v.data, 'hex');
                len = dec.length;
                if (len !== 8) {
                    throw new TypeError('value cannot be converted to dvalue: ' + JSON.stringify(v));
                }
                buf = new Buffer(1 + len);
                buf[0] = 0x1a;
                dec.copy(buf, 1);
                return buf;
            } else if (v.type === 'buffer') {
                dec = new Buffer(v.data, 'hex');
                len = dec.length;
                if (len <= 0xffff) {
                    buf = new Buffer(3 + len);
                    buf[0] = 0x14;
                    buf[1] = (len >> 8) & 0xff;
                    buf[2] = (len >> 0) & 0xff;
                    dec.copy(buf, 3);
                    return buf;
                } else {
                    buf = new Buffer(5 + len);
                    buf[0] = 0x13;
                    buf[1] = (len >> 24) & 0xff;
                    buf[2] = (len >> 16) & 0xff;
                    buf[3] = (len >> 8) & 0xff;
                    buf[4] = (len >> 0) & 0xff;
                    dec.copy(buf, 5);
                    return buf;
                }
            } else if (v.type === 'object') {
                dec = new Buffer(v.pointer, 'hex');
                len = dec.length;
                buf = new Buffer(3 + len);
                buf[0] = 0x1b;
                buf[1] = v.class;
                buf[2] = len;
                dec.copy(buf, 3);
                return buf;
            } else if (v.type === 'pointer') {
                dec = new Buffer(v.pointer, 'hex');
                len = dec.length;
                buf = new Buffer(2 + len);
                buf[0] = 0x1c;
                buf[1] = len;
                dec.copy(buf, 2);
                return buf;
            } else if (v.type === 'lightfunc') {
                dec = new Buffer(v.pointer, 'hex');
                len = dec.length;
                buf = new Buffer(4 + len);
                buf[0] = 0x1d;
                buf[1] = (v.flags >> 8) & 0xff;
                buf[2] = v.flags & 0xff;
                buf[3] = len;
                dec.copy(buf, 4);
                return buf;
            } else if (v.type === 'heapptr') {
                dec = new Buffer(v.pointer, 'hex');
                len = dec.length;
                buf = new Buffer(2 + len);
                buf[0] = 0x1e;
                buf[1] = len;
                dec.copy(buf, 2);
                return buf;
            }
        } else if (v === null) {
            return new Buffer([0x17]);
        } else if (typeof v === 'boolean') {
            return new Buffer([v ? 0x18 : 0x19]);
        } else if (typeof v === 'number') {
            if (Math.floor(v) === v &&     /* whole */
                (v !== 0 || 1 / v > 0) &&  /* not negative zero */
                v >= -0x80000000 && v <= 0x7fffffff) {
                // Represented signed 32-bit integers as plain integers.
                // Debugger code expects this for all fields that are not
                // duk_tval representations (e.g. command numbers and such).
                if (v >= 0x00 && v <= 0x3f) {
                    return new Buffer([0x80 + v]);
                } else if (v >= 0x0000 && v <= 0x3fff) {
                    return new Buffer([0xc0 + (v >> 8), v & 0xff]);
                } else if (v >= -0x80000000 && v <= 0x7fffffff) {
                    return new Buffer([0x10,
                        (v >> 24) & 0xff,
                        (v >> 16) & 0xff,
                        (v >> 8) & 0xff,
                        (v >> 0) & 0xff]);
                } else {
                    throw new Error('internal error when encoding integer to dvalue: ' + v);
                }
            } else {
                // Represent non-integers as IEEE double dvalues
                buf = new Buffer(1 + 8);
                buf[0] = 0x1a;
                buf.writeDoubleBE(v, 1);
                return buf;
            }
        } else if (typeof v === 'string') {
            if (v.length < 0 || v.length > 0xffffffff) {
                // Not possible in practice.
                throw new TypeError('cannot convert to dvalue, invalid string length: ' + v.length);
            }
            if (v.length <= 0x1f) {
                buf = new Buffer(1 + v.length);
                buf[0] = 0x60 + v.length;
                this.writeDebugStringToBuffer(v, buf, 1);
                return buf;
            } else if (v.length <= 0xffff) {
                buf = new Buffer(3 + v.length);
                buf[0] = 0x12;
                buf[1] = (v.length >> 8) & 0xff;
                buf[2] = (v.length >> 0) & 0xff;
                this.writeDebugStringToBuffer(v, buf, 3);
                return buf;
            } else {
                buf = new Buffer(5 + v.length);
                buf[0] = 0x11;
                buf[1] = (v.length >> 24) & 0xff;
                buf[2] = (v.length >> 16) & 0xff;
                buf[3] = (v.length >> 8) & 0xff;
                buf[4] = (v.length >> 0) & 0xff;
                this.writeDebugStringToBuffer(v, buf, 5);
                return buf;
            }
        }

        // Shouldn't come here.
        throw new TypeError('value cannot be converted to dvalue: ' + JSON.stringify(v));
    }

    private writeDebugStringToBuffer(str, buf, off) {
        for (let i = 0, n = str.length; i < n; i++) {
            buf[off + i] = str.charCodeAt(i) & 0xff;  // truncate higher bits
        }
    }

    private determineCommandNumber(cmdName: string | number, cmdNumber) {
        let ret;
        if (typeof cmdName === 'string') {
            ret = DukCmdMeta.debugCommandNumbers[cmdName];
        } else if (typeof cmdName === 'number') {
            ret = cmdName;
        }
        ret = ret || cmdNumber;
        if (typeof ret !== 'number') {
            throw Error('cannot figure out command number for "' + cmdName + '" (' + cmdNumber + ')');
        }
        return ret;
    }
}