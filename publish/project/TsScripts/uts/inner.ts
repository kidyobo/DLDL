// 这个模块不能被import，是被cs层调用，对应的声明文件是uts/declare/uts.d.ts
declare function require(path: string);
declare function __is_cs_object(o: any): boolean;
declare function __msearch(a, b, c, d);
declare function __bugReport(s: string);
declare function __format(fmt: string, ...args): string;
declare function __read_alltext(path: string): string;
declare function __workSpace(): string;
declare function __bytes2lstr(csbytes): any;
declare function __co_yield_reg(co, type, value);
declare function __reg_global(key: string, o: any);
declare function __parse_bjson(src: any): any;

declare module Duktape {
    export function modSearch(a, b, c, d);
    export function gc();
    export function immgc();
    export function fin(prototype, fun);
    export function backtrace();

    export const isJsc: boolean;
    export const version: number;
    export const hasBJson: boolean;
    
    export class Thread {
        constructor(f: any);
        static yield(arg: any): any;
        static resume(t: Thread, ...args): any;
    }
}

//other private function
function __static_extends(sub, base) {
    for (var p in base) if (base.hasOwnProperty(p)) sub[p] = base[p];
}
Duktape.modSearch = function (a, b, c, d) {
    return __msearch(a, b, c, d);
}