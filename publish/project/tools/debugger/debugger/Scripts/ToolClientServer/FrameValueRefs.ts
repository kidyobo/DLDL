export interface ValueRef {
    ref: number;
    breakpoint: number;
    frameidx: number;
    name: string;
    obj?: any;
}

export class FrameValueRefs {
    private static next_ref = 1;
    private refs: { [index: string]: ValueRef } = {};
    private refmappers: { [index: number]: ValueRef } = {};
    clear() {
        this.refs = {};
        this.refmappers = {};
    }
    getRef(breakpoint: number, frameidx: number, name: string, obj?: any): number {
        let key = breakpoint + '|' + frameidx + '|' + name;
        let refobj = this.refs[key];
        if (refobj == null) {
            refobj = { ref: FrameValueRefs.next_ref++, breakpoint: breakpoint, frameidx: frameidx, name: name, obj: obj };
            this.refs[key] = refobj;
            this.refmappers[refobj.ref] = refobj;
        }
        return refobj.ref;
    }
    getObjectByRef(ref: number): ValueRef {
        return this.refmappers[ref];
    }
}
