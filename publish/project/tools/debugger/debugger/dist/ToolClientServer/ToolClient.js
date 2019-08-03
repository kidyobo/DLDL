"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FrameValueRefs_1 = require("./FrameValueRefs");
var BreakPoint_1 = require("./BreakPoint");
var Util_1 = require("../Util");
var ToolClient = (function () {
    function ToolClient(socket) {
        this._valueRefs = new FrameValueRefs_1.FrameValueRefs();
        this._breakPoints = new BreakPoint_1.BreakPoints();
        this.socket = null;
        this.socket = socket;
    }
    Object.defineProperty(ToolClient.prototype, "frameValueRefs", {
        get: function () {
            return this._valueRefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolClient.prototype, "breakPoints", {
        get: function () {
            return this._breakPoints;
        },
        enumerable: true,
        configurable: true
    });
    ToolClient.prototype.send = function (msg) {
        if (this.socket == null) {
            Util_1.Util.log('[error]', '*client is null when send!');
            return;
        }
        this.socket.write(msg);
    };
    ToolClient.prototype.close = function (reason) {
        if (reason === void 0) { reason = 0; }
        if (this.socket != null) {
            this.socket.destroy();
            this.socket = null;
            Util_1.Util.log('[comm]', '*client close, reason:' + reason);
        }
    };
    ToolClient.prototype.isNull = function () {
        return this.socket === null;
    };
    return ToolClient;
}());
exports.ToolClient = ToolClient;
//# sourceMappingURL=ToolClient.js.map