"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = (function () {
    function Util() {
    }
    Util.isUndefined = function (o) {
        return o === null || typeof (o) === 'undefined';
    };
    Util.isArray = function (o) {
        if (!o)
            return false;
        if (typeof (o) !== 'object')
            return false;
        return o instanceof Array;
    };
    Util.isNaN = function (o) {
        return isNaN(o);
    };
    Util.toBoolean = function (o) {
        if (!o)
            return false;
        else
            return true;
    };
    Util.toNumber = function (o) {
        if (typeof (o) === 'number') {
            return o;
        }
        else if (typeof (o) === 'string') {
            return Number(o);
        }
        else {
            return 0;
        }
    };
    Util.toDouble = function (bigendian_ieee) {
        var bin_ieee = this.hexToBinString(bigendian_ieee);
        var sign = Number(bin_ieee[0]);
        var p = 0;
        for (var i = 1; i < 12; i++) {
            var v = bin_ieee.charAt(i) == '0' ? 0 : 1;
            p = 2 * p + v;
        }
        var m = 0;
        for (var i = 12; i < 64; i++) {
            var v = bin_ieee.charAt(i) == '0' ? 0 : 1;
            m += v * Math.pow(2, (11 - i));
        }
        if (p > 0 && p < 2047) {
            return Math.pow(-1, sign) * Math.pow(2, p - 1023) * (1 + m);
        }
        else {
            return Math.pow(-1, sign) * Math.pow(2, -1022) * m;
        }
    };
    Util.hexToBinString = function (hex) {
        var rt = '';
        hex = hex.toLowerCase();
        for (var i = 0; i < hex.length; i++) {
            var c = hex.charAt(i);
            rt += this.hexToBinMap[c];
        }
        return rt;
    };
    Util.log = function (flag, s) {
        this.log_seq++;
        if (flag === '[c->s]') {
            console.log(this.log_seq + flag + ':' + s);
        }
        else if (flag === '[s->c]') {
            console.log(this.log_seq + flag + ':' + s);
        }
        else if (flag === '[s->t]') {
            console.log(this.log_seq + flag + ':' + s);
        }
        else if (flag === '[t->s]') {
            console.log(this.log_seq + flag + ':' + s);
        }
        else {
            console.log(this.log_seq + flag + ':' + s);
        }
    };
    return Util;
}());
Util.hexToBinMap = {
    '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100', '5': '0101', '6': '0110', '7': '0111',
    '8': '1000', '9': '1001', 'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101', 'e': '1110', 'f': '1111'
};
Util.log_seq = 0;
exports.Util = Util;
//# sourceMappingURL=Util.js.map