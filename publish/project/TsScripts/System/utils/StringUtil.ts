export class StringUtil {
    static isEmpty(str: string): boolean {
        return str == null || str == '';
    }

    static marriageLine(...args): string {
        return args.join('_');
    }

    static getArgs(...args): any[] {

        if (args.length == 1) {
            return args[0];
        }
        return args;
    }

    static getFixLengthNumStr(num: number, minLen: number): string {
        let ret = num.toString();
        let nlen = ret.length;
        if (nlen < minLen) {
            for (let i = minLen - nlen - 1; i >= 0; i--) {
                ret += ' ';
            }
        }
        return ret;
    }

    static parseParams(str: string): any {
        let o = {};
        let arr = str.split('&');
        let reg: RegExp = new RegExp(/([^=]+)=(.+)/);
        for (let a of arr) {
            let r = reg.exec(a);
            if (r) {
                let k = r[1];
                let v = r[2];
                o[k] = v;
            }
        }
        let jsonStr = JSON.stringify(o);
        let data = JSON.parse(jsonStr);
        return data != null ? data : {};
    }
}
