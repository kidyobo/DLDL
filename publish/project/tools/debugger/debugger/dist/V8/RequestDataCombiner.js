"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 对来自客户端工具发来的请求进行组包
 */
var Util_1 = require("../Util");
var RequestDataCombiner = (function () {
    function RequestDataCombiner() {
        this.endToken = '\r\n\r\n';
        this.recvPackLenPatt = /Content-Length:\s+(\d+)/;
        this.recv = '';
    }
    RequestDataCombiner.prototype.combine = function (data) {
        this.recv += data.toString('utf8');
        var reqs = new Array();
        while (true) {
            var pos = this.recv.indexOf(this.endToken);
            if (pos < 0)
                break;
            var arr = this.recvPackLenPatt.exec(this.recv);
            var datasize = Number(arr[1]);
            var pkgpos = pos + this.endToken.length;
            if (this.recv.length < pkgpos + datasize)
                break;
            var pkg = this.recv.substr(pkgpos, datasize);
            Util_1.Util.log('[c->s]', pkg);
            reqs.push(JSON.parse(pkg));
            this.recv = this.recv.substr(pkgpos + datasize);
        }
        return reqs;
    };
    RequestDataCombiner.prototype.clear = function () {
        this.recv = '';
    };
    return RequestDataCombiner;
}());
exports.RequestDataCombiner = RequestDataCombiner;
//# sourceMappingURL=RequestDataCombiner.js.map