"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var ResponseDataPacker = (function () {
    function ResponseDataPacker() {
        this.packPatt = 'Content-Length: <pkglen>\r\n\r\n<pkg>';
        this.recv = '';
    }
    ResponseDataPacker.prototype.pack = function (response) {
        var pkg = response.toJSONString();
        var s = this.packPatt.replace('<pkglen>', pkg.length.toString()).replace('<pkg>', pkg);
        if (response.islog)
            Util_1.Util.log('[s->c]', pkg);
        return s;
    };
    ResponseDataPacker.prototype.clear = function () {
        this.recv = '';
    };
    return ResponseDataPacker;
}());
exports.ResponseDataPacker = ResponseDataPacker;
//# sourceMappingURL=ResponseDataPacker.js.map