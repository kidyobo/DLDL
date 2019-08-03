﻿export class Util {
    private static hexToBinMap = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100', '5': '0101', '6': '0110', '7': '0111'
        , '8': '1000', '9': '1001', 'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101', 'e': '1110', 'f': '1111'
    };
    static isUndefined(o: any): boolean {
        return o === null || typeof (o) === 'undefined';
    }
    static isArray(o: any): boolean {
        if (!o) return false;
        if (typeof (o) !== 'object') return false;
        return o instanceof Array;
    }
    static isNaN(o: any): boolean {
        return isNaN(o);
    }
    static toBoolean(o: any): boolean {
        if (!o) return false;
        else return true;
    }
    static toNumber(o: any): number {
        if (typeof (o) === 'number') {
            return o;
        }
        else if (typeof (o) === 'string') {
            return Number(o);
        }
        else {
            return 0;
        }
    }
    static toDouble(bigendian_ieee: string): number {
        let bin_ieee = this.hexToBinString(bigendian_ieee);
        let sign = Number(bin_ieee[0]);
        let p = 0;
        for (let i = 1; i < 12; i++) {
            let v = bin_ieee.charAt(i) == '0' ? 0 : 1;
            p = 2 * p + v;
        }
        let m = 0;
        for (let i = 12; i < 64; i++) {
            let v = bin_ieee.charAt(i) == '0' ? 0 : 1;
            m += v * Math.pow(2, (11 - i));
        }

        if (p > 0 && p < 2047) {
            return Math.pow(-1, sign) * Math.pow(2, p - 1023) * (1 + m);
        }
        else {
            return Math.pow(-1, sign) * Math.pow(2, -1022) * m;
        }
    }
    private static hexToBinString(hex: string): string {
        let rt = '';
        hex = hex.toLowerCase();
        for (let i = 0; i < hex.length; i++) {
            let c = hex.charAt(i);
            rt += this.hexToBinMap[c];
        }
        return rt;
    }
    private static log_seq: number = 0;
    static log(flag, s) {
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
    }
}