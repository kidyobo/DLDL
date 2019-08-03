declare function delegate(thisobj: Object, caller: (...args) => any, ...args): (...args) => any;

class AutoGC {
    static gc() {
        this.creatTimer();
        this.innerGC();
    }

    private static readonly interval: number = 5 * 60 * 1000; // 5分钟主动gc一次
    private static gcTimer: Game.Timer = null;
    private static creatTimer() {
        if (this.gcTimer == null && Duktape.immgc) {
            this.gcTimer = new Game.Timer('gc', this.interval, 0, delegate(this, this.onTimer));
        }
    }

    private static onTimer() {
        this.innerGC();
    }

    private static innerGC() {
        if (Duktape.immgc)
            Duktape.immgc();
        else
            Duktape.gc();
    }
}

module uts {
    export function delegate(thisobj: Object, caller: Function, ...args): (...args) => any {
        let d = createDelegate(thisobj, caller, args);
        d.prototype = null;
        arguments = null;
        return d;
    }

    function createDelegate(thisobj: Object, caller: Function, args) {
        return function () {
            try {
                var nargs = [];
                for (let i = 0, n = arguments.length; i < n; i++) {
                    nargs.push(arguments[i]);
                }
                for (let i = 0, n = args.length; i < n; i++) {
                    nargs.push(args[i]);
                }
                return caller.apply(thisobj, nargs);
            } catch (e) {
                BugReport.report(e);
            }
        };
    }

    function getVariablesStr(data: any, deep: number = 0): string {
        let str = '';

        let tabStr = '';
        let i = deep;
        while (i > 0) {
            tabStr += '\t';
            i--;
        }

        for (let key in data) {
            let value = data[key];
            if (typeof (value) === 'function') continue;

            if (!(typeof (value) === 'object')) {
                str += tabStr + key + ':' + data[key] + '\n';
                continue;
            }

            str += tabStr + key + ':\n' + getVariablesStr(value, deep + 1);
        }

        return str;
    }

    export function regGlobal(key: string, obj: any) {
        __reg_global(key, obj);
    }

    export function type(o) {
        var t = typeof (o);
        if (t !== 'object') return t;
        if (!__is_cs_object(o)) return t;
        return 'csobject';
    }

    export function gc() {
        AutoGC.gc();
    }

    export function finalizer(prototype, fun) {
        Duktape.fin(prototype, fun);
    }

    export function bugReport(s: string) {
        __bugReport(s);
    }

    export function log(o) {
        if (defines.has('NOLOG')) return;
        if (type(o) === 'object') {
            Game.Log.log(JSON.stringify(o));
        }
        else {
            Game.Log.log(o);
        }
    }

    export function logs(fmt: string, ...args) {
        if (defines.has('NOLOG')) return;
        Game.Log.log(format(fmt, ...args));
    }

    export function logError(s: string) {
        this.logFailure(s);
    }

    export function logErrorReportWithStack(s: string) {
        BugReport.report(s + "\n" + Duktape.backtrace());
    }

    export function logErrorReport(s: string) {
        Game.Log.logError(s);
    }

    export function logWarning(s: string) {
        Game.Log.logWarning(s);
    }

    export function logSuccess(s: string) {
        if (defines.has('NOLOG')) return;
        log('<color=green>' + s + '</color>');
    }

    export function logFailure(s: string) {
        log('<color=red>' + s + '</color>');
    }

    export function format(fmt: string, ...args): string {
        return fmt.replace(/\{(\d+)\}/g, function (m, i) { return args[i]; });
    }

    export function assert(cond: boolean, msg?: string) {
        if (defines.has('DEVELOP') || defines.has('TEST_APK')) {
            if (cond) return;
            try {
                if (!msg) msg = 'assertion failed!';
                throw new Error(msg);
            }
            catch (e) {
                BugReport.report(e);
            }
        }
    }

    export function deepcopy(o, outo = null, strictArrayLength: boolean = true): any {
        let isarr = o instanceof Array;
        outo = outo ? outo : isarr ? [] : {};
        for (let k in o) {
            let v = o[k];
            let outsub = v;
            if (typeof (v) === 'object') {
                outsub = deepcopy(v, outo[k]);
            }
            outo[k] = outsub;
        }
        if (isarr && strictArrayLength) {
            // 检查数组长度
            let arrLen: number = outo.length;
            let olen: number = o.length;
            if (arrLen > olen) {
                outo.splice(olen);
            }
        }
        return outo;
    }

    export function readAllText(path: string): string {
        return __read_alltext(path);
    }

    export function workSpace(): string {
        return __workSpace();
    }

    export function loadfile(f: string) {
        try {
            require('./' + f);
        }
        catch (e) {
            BugReport.report(e);
        }
    }

    export function bytes2lstr(csbytes): any {
        return __bytes2lstr(csbytes);
    }

    export function isGetterOrSetter(obj: any, k: string): boolean {
        let proto = Object.getPrototypeOf(obj);
        if (proto == null) return false;
        let descriptor = Object.getOwnPropertyDescriptor(proto, k);
        if (descriptor == null) {
            return isGetterOrSetter(proto, k); // 遍历父亲
        }
        return descriptor.get != null || descriptor.set != null;
    }

    export function releaseObject(obj): any {
        for (let k in obj) {
            if (isGetterOrSetter(obj, k)) continue;
            let v = obj[k];
            if (!v) {
                continue;
            }
            if (v instanceof Array) {
                for (let f of v) {
                    if (!f || !f.dispose) break;
                    f.dispose();
                }
                obj[k] = null;
            }
            else {
                if (__is_cs_object(v)) {
                    obj[k] = null;
                }
                else if (v.dispose) {
                    v.dispose();
                }
            }
        }
    }
}

//register global
uts.regGlobal('uts', uts);
uts.regGlobal('delegate', uts.delegate);