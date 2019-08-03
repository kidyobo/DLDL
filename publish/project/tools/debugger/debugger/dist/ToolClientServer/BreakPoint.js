"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BreakPoint = (function () {
    function BreakPoint() {
        this.enabled = true;
        this.condition = '';
        this.ignoreCount = 0;
        this.duk_id = -1;
        this.virtual = false;
    }
    BreakPoint.prototype.toJSON = function () {
        return {
            breakpoint: this.id, script_id: this.scriptId, line: this.line, column: this.column, actual_locations: [{ line: this.line, column: this.column, script_id: this.scriptId }]
        };
    };
    return BreakPoint;
}());
exports.BreakPoint = BreakPoint;
var BreakPoints = (function () {
    function BreakPoints() {
        this.breakPoints = [];
    }
    BreakPoints.prototype.addVirtualPoint = function (scriptId, line, column) {
        var bkp = this.addPoint(scriptId, line, column);
        bkp.virtual = true;
        return bkp;
    };
    BreakPoints.prototype.addPoint = function (scriptId, line, column, condition) {
        for (var i = 0; i < this.breakPoints.length; i++) {
            var b = this.breakPoints[i];
            if (b.scriptId === scriptId && b.line === line && b.column === column) {
                this.breakPoints.splice(i, 1);
                break;
            }
        }
        var nb = new BreakPoint();
        nb.scriptId = scriptId;
        nb.line = line;
        nb.column = column;
        nb.condition = condition ? condition : '';
        nb.id = BreakPoints.next_id++;
        this.breakPoints.push(nb);
        return nb;
    };
    BreakPoints.prototype.clearPoint = function (id) {
        for (var i = 0; i < this.breakPoints.length; i++) {
            var b = this.breakPoints[i];
            if (b.id === id) {
                this.breakPoints.splice(i, 1);
                break;
            }
        }
    };
    BreakPoints.prototype.getPoint = function (id) {
        for (var i = 0; i < this.breakPoints.length; i++) {
            var b = this.breakPoints[i];
            if (b.id === id) {
                return b;
            }
        }
        return null;
    };
    BreakPoints.prototype.clear = function () {
        this.breakPoints = [];
    };
    BreakPoints.prototype.bindPoint = function (id, dukbpid) {
        var bp = this.getPoint(id);
        if (bp == null) {
            console.log('not find bp no in bindPoint, id:' + id + ', duk_id' + dukbpid);
            return;
        }
        bp.duk_id = dukbpid;
    };
    BreakPoints.prototype.findPointId = function (line, column, scriptId) {
        for (var i = 0; i < this.breakPoints.length; i++) {
            var b = this.breakPoints[i];
            if (b.scriptId === scriptId && b.line === line && b.column === column) {
                return b.id;
            }
        }
        return -1;
    };
    Object.defineProperty(BreakPoints.prototype, "count", {
        get: function () {
            return this.breakPoints.length;
        },
        enumerable: true,
        configurable: true
    });
    BreakPoints.prototype.getPointByIndex = function (idx) {
        return this.breakPoints[idx];
    };
    return BreakPoints;
}());
BreakPoints.next_id = 1;
exports.BreakPoints = BreakPoints;
//# sourceMappingURL=BreakPoint.js.map