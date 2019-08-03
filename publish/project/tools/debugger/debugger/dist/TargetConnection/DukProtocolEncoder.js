"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("./Common");
var DukCmdMeta_1 = require("./DukCmdMeta");
var DukProtocolEncoder = (function () {
    function DukProtocolEncoder() {
        this.dval_eom = null;
        this.dval_req = null;
        this.dval_rep = null;
        this.dval_nfy = null;
        this.dval_err = null;
        this.dval_eom = this.formatDebugValue(Common_1.DVAL_JSON.EOM);
        this.dval_req = this.formatDebugValue(Common_1.DVAL_JSON.REQ);
        this.dval_rep = this.formatDebugValue(Common_1.DVAL_JSON.REP);
        this.dval_nfy = this.formatDebugValue(Common_1.DVAL_JSON.NFY);
        this.dval_err = this.formatDebugValue(Common_1.DVAL_JSON.ERR);
    }
    DukProtocolEncoder.prototype.encode = function (writer, msg) {
        var first_dval;
        var args_dvalues = this.formatDvalues(msg.args);
        var last_dval = this.dval_eom;
        var cmd;
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
        args_dvalues.forEach(function (v) {
            writer.write(v);
        });
        writer.write(last_dval);
    };
    DukProtocolEncoder.prototype.formatDvalues = function (args) {
        var _this = this;
        if (!args) {
            return [];
        }
        return args.map(function (v) {
            return _this.formatDebugValue(v);
        });
    };
    DukProtocolEncoder.prototype.formatDebugValue = function (v) {
        var buf, dec, len;
        // See doc/debugger.rst for format description.
        if (typeof v === 'object' && v !== null) {
            // Note: typeof null === 'object', so null special case explicitly
            if (v.type === 'eom') {
                return new Buffer([0x00]);
            }
            else if (v.type === 'req') {
                return new Buffer([0x01]);
            }
            else if (v.type === 'rep') {
                return new Buffer([0x02]);
            }
            else if (v.type === 'err') {
                return new Buffer([0x03]);
            }
            else if (v.type === 'nfy') {
                return new Buffer([0x04]);
            }
            else if (v.type === 'unused') {
                return new Buffer([0x15]);
            }
            else if (v.type === 'undefined') {
                return new Buffer([0x16]);
            }
            else if (v.type === 'number') {
                dec = new Buffer(v.data, 'hex');
                len = dec.length;
                if (len !== 8) {
                    throw new TypeError('value cannot be converted to dvalue: ' + JSON.stringify(v));
                }
                buf = new Buffer(1 + len);
                buf[0] = 0x1a;
                dec.copy(buf, 1);
                return buf;
            }
            else if (v.type === 'buffer') {
                dec = new Buffer(v.data, 'hex');
                len = dec.length;
                if (len <= 0xffff) {
                    buf = new Buffer(3 + len);
                    buf[0] = 0x14;
                    buf[1] = (len >> 8) & 0xff;
                    buf[2] = (len >> 0) & 0xff;
                    dec.copy(buf, 3);
                    return buf;
                }
                else {
                    buf = new Buffer(5 + len);
                    buf[0] = 0x13;
                    buf[1] = (len >> 24) & 0xff;
                    buf[2] = (len >> 16) & 0xff;
                    buf[3] = (len >> 8) & 0xff;
                    buf[4] = (len >> 0) & 0xff;
                    dec.copy(buf, 5);
                    return buf;
                }
            }
            else if (v.type === 'object') {
                dec = new Buffer(v.pointer, 'hex');
                len = dec.length;
                buf = new Buffer(3 + len);
                buf[0] = 0x1b;
                buf[1] = v.class;
                buf[2] = len;
                dec.copy(buf, 3);
                return buf;
            }
            else if (v.type === 'pointer') {
                dec = new Buffer(v.pointer, 'hex');
                len = dec.length;
                buf = new Buffer(2 + len);
                buf[0] = 0x1c;
                buf[1] = len;
                dec.copy(buf, 2);
                return buf;
            }
            else if (v.type === 'lightfunc') {
                dec = new Buffer(v.pointer, 'hex');
                len = dec.length;
                buf = new Buffer(4 + len);
                buf[0] = 0x1d;
                buf[1] = (v.flags >> 8) & 0xff;
                buf[2] = v.flags & 0xff;
                buf[3] = len;
                dec.copy(buf, 4);
                return buf;
            }
            else if (v.type === 'heapptr') {
                dec = new Buffer(v.pointer, 'hex');
                len = dec.length;
                buf = new Buffer(2 + len);
                buf[0] = 0x1e;
                buf[1] = len;
                dec.copy(buf, 2);
                return buf;
            }
        }
        else if (v === null) {
            return new Buffer([0x17]);
        }
        else if (typeof v === 'boolean') {
            return new Buffer([v ? 0x18 : 0x19]);
        }
        else if (typeof v === 'number') {
            if (Math.floor(v) === v &&
                (v !== 0 || 1 / v > 0) &&
                v >= -0x80000000 && v <= 0x7fffffff) {
                // Represented signed 32-bit integers as plain integers.
                // Debugger code expects this for all fields that are not
                // duk_tval representations (e.g. command numbers and such).
                if (v >= 0x00 && v <= 0x3f) {
                    return new Buffer([0x80 + v]);
                }
                else if (v >= 0x0000 && v <= 0x3fff) {
                    return new Buffer([0xc0 + (v >> 8), v & 0xff]);
                }
                else if (v >= -0x80000000 && v <= 0x7fffffff) {
                    return new Buffer([0x10,
                        (v >> 24) & 0xff,
                        (v >> 16) & 0xff,
                        (v >> 8) & 0xff,
                        (v >> 0) & 0xff]);
                }
                else {
                    throw new Error('internal error when encoding integer to dvalue: ' + v);
                }
            }
            else {
                // Represent non-integers as IEEE double dvalues
                buf = new Buffer(1 + 8);
                buf[0] = 0x1a;
                buf.writeDoubleBE(v, 1);
                return buf;
            }
        }
        else if (typeof v === 'string') {
            if (v.length < 0 || v.length > 0xffffffff) {
                // Not possible in practice.
                throw new TypeError('cannot convert to dvalue, invalid string length: ' + v.length);
            }
            if (v.length <= 0x1f) {
                buf = new Buffer(1 + v.length);
                buf[0] = 0x60 + v.length;
                this.writeDebugStringToBuffer(v, buf, 1);
                return buf;
            }
            else if (v.length <= 0xffff) {
                buf = new Buffer(3 + v.length);
                buf[0] = 0x12;
                buf[1] = (v.length >> 8) & 0xff;
                buf[2] = (v.length >> 0) & 0xff;
                this.writeDebugStringToBuffer(v, buf, 3);
                return buf;
            }
            else {
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
    };
    DukProtocolEncoder.prototype.writeDebugStringToBuffer = function (str, buf, off) {
        for (var i = 0, n = str.length; i < n; i++) {
            buf[off + i] = str.charCodeAt(i) & 0xff; // truncate higher bits
        }
    };
    DukProtocolEncoder.prototype.determineCommandNumber = function (cmdName, cmdNumber) {
        var ret;
        if (typeof cmdName === 'string') {
            ret = DukCmdMeta_1.DukCmdMeta.debugCommandNumbers[cmdName];
        }
        else if (typeof cmdName === 'number') {
            ret = cmdName;
        }
        ret = ret || cmdNumber;
        if (typeof ret !== 'number') {
            throw Error('cannot figure out command number for "' + cmdName + '" (' + cmdNumber + ')');
        }
        return ret;
    };
    return DukProtocolEncoder;
}());
DukProtocolEncoder.ins = new DukProtocolEncoder();
exports.DukProtocolEncoder = DukProtocolEncoder;
//# sourceMappingURL=DukProtocolEncoder.js.map