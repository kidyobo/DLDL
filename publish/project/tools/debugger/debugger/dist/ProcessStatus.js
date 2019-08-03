"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ToolClient_1 = require("./ToolClientServer/ToolClient");
var DukRequestQueue = (function () {
    function DukRequestQueue() {
        this.requests = [];
    }
    DukRequestQueue.prototype.clear = function () {
        this.requests = [];
    };
    DukRequestQueue.prototype.push = function (req) {
        this.requests.push(req);
    };
    DukRequestQueue.prototype.pop = function () {
        if (this.requests.length == 0)
            return null;
        var o = this.requests[0];
        this.requests.splice(0, 1);
        return o;
    };
    return DukRequestQueue;
}());
var ProcessStatus = (function () {
    function ProcessStatus() {
        this._frameIdsMapper = {};
        this._isRunning = false;
        this._break_point = 0;
        this._toolClient = new ToolClient_1.ToolClient(null);
        this._requestQueue = new DukRequestQueue();
        this._pausing = false;
    }
    Object.defineProperty(ProcessStatus, "ins", {
        get: function () {
            if (this._ins == null) {
                this._ins = new ProcessStatus();
            }
            return this._ins;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProcessStatus.prototype, "requestQueue", {
        get: function () {
            return this._requestQueue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProcessStatus.prototype, "toolClient", {
        get: function () {
            return this._toolClient;
        },
        set: function (val) {
            this._toolClient = (val === null) ? new ToolClient_1.ToolClient(null) : val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProcessStatus.prototype, "isRunning", {
        get: function () {
            return this._isRunning;
        },
        set: function (val) {
            this._isRunning = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProcessStatus.prototype, "breakPoint", {
        get: function () {
            return this._break_point;
        },
        set: function (bp) {
            this._break_point = bp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProcessStatus.prototype, "pausing", {
        get: function () {
            return this._pausing;
        },
        set: function (flag) {
            this._pausing = flag;
        },
        enumerable: true,
        configurable: true
    });
    ProcessStatus.prototype.clearFrameMap = function () {
        this._frameIdsMapper = {};
    };
    ProcessStatus.prototype.setFrameMap = function (v8frame, dukFrame) {
        this._frameIdsMapper[v8frame] = dukFrame;
    };
    ProcessStatus.prototype.dukFrame = function (v8frame) {
        var dukframe = this._frameIdsMapper[v8frame];
        if (dukframe == null) {
            dukframe = 0;
        }
        return dukframe;
    };
    return ProcessStatus;
}());
ProcessStatus._ins = null;
exports.ProcessStatus = ProcessStatus;
//# sourceMappingURL=ProcessStatus.js.map