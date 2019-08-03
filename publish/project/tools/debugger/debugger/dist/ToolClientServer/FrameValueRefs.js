"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FrameValueRefs = (function () {
    function FrameValueRefs() {
        this.refs = {};
        this.refmappers = {};
    }
    FrameValueRefs.prototype.clear = function () {
        this.refs = {};
        this.refmappers = {};
    };
    FrameValueRefs.prototype.getRef = function (breakpoint, frameidx, name, obj) {
        var key = breakpoint + '|' + frameidx + '|' + name;
        var refobj = this.refs[key];
        if (refobj == null) {
            refobj = { ref: FrameValueRefs.next_ref++, breakpoint: breakpoint, frameidx: frameidx, name: name, obj: obj };
            this.refs[key] = refobj;
            this.refmappers[refobj.ref] = refobj;
        }
        return refobj.ref;
    };
    FrameValueRefs.prototype.getObjectByRef = function (ref) {
        return this.refmappers[ref];
    };
    return FrameValueRefs;
}());
FrameValueRefs.next_ref = 1;
exports.FrameValueRefs = FrameValueRefs;
//# sourceMappingURL=FrameValueRefs.js.map