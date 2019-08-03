module defines {
    let defines = {};
    export function add(define: string) {
        defines[define] = true;
    }
    export function has(define: string): boolean {
        return defines[define] == true;
    }
}
//register global
uts.regGlobal('defines', defines);
