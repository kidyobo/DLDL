"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ProcessStatus_1 = require("../ProcessStatus");
var ScriptsMgr_1 = require("../ScriptsMgr");
var WrapperUtil_1 = require("./WrapperUtil");
var Util_1 = require("../Util");
var ONEFRAMEARGS_COUNT = 4;
var BreakFrameArgs;
(function (BreakFrameArgs) {
    BreakFrameArgs[BreakFrameArgs["script"] = 0] = "script";
    BreakFrameArgs[BreakFrameArgs["function"] = 1] = "function";
    BreakFrameArgs[BreakFrameArgs["line"] = 2] = "line";
    BreakFrameArgs[BreakFrameArgs["pc"] = 3] = "pc";
})(BreakFrameArgs || (BreakFrameArgs = {}));
var ONEPROPDESCARGS_COUNT = 3;
var PropDescArgs;
(function (PropDescArgs) {
    PropDescArgs[PropDescArgs["flag"] = 0] = "flag";
    PropDescArgs[PropDescArgs["name"] = 1] = "name";
    PropDescArgs[PropDescArgs["value"] = 2] = "value";
})(PropDescArgs || (PropDescArgs = {}));
var V8Notify = (function () {
    function V8Notify() {
        this.seq = 0;
        this.type = '';
        this.command = undefined;
        this.success = true;
        this.message = undefined;
        this.body = undefined;
        this.error_details = undefined;
        this.refs = [];
        this.running = false;
        this.islog = true;
        this.seq = V8Notify.next_response_seq++;
        this.running = ProcessStatus_1.ProcessStatus.ins.isRunning;
    }
    V8Notify.prototype.toJSONString = function () {
        return "";
    };
    return V8Notify;
}());
V8Notify.next_response_seq = 0;
exports.V8Notify = V8Notify;
var V8Response = (function (_super) {
    __extends(V8Response, _super);
    function V8Response(request) {
        var _this = _super.call(this) || this;
        _this.type = 'response';
        _this.request_seq = 0;
        _this.request_seq = request.seq;
        _this.command = request.command;
        return _this;
    }
    V8Response.prototype.failed = function (err) {
    };
    V8Response.prototype.toJSONString = function () {
        var res = {
            seq: this.seq,
            request_seq: this.request_seq,
            type: this.type,
            command: this.command,
            success: this.success,
            body: this.body,
            message: this.message,
            refs: this.refs,
            error_details: this.error_details,
            running: this.running,
        };
        return JSON.stringify(res);
    };
    return V8Response;
}(V8Notify));
exports.V8Response = V8Response;
var ScriptsResponse = (function (_super) {
    __extends(ScriptsResponse, _super);
    function ScriptsResponse(request) {
        var _this = _super.call(this, request) || this;
        _this.running = false;
        _this.success = true;
        _this.islog = false;
        _this.refs = [];
        _this.body = ScriptsMgr_1.ScriptsMgr.getScripts();
        return _this;
    }
    return ScriptsResponse;
}(V8Response));
exports.ScriptsResponse = ScriptsResponse;
var BacktraceResponse = (function (_super) {
    __extends(BacktraceResponse, _super);
    function BacktraceResponse(request) {
        var _this = _super.call(this, request) || this;
        _this.rawFrames = [];
        _this.rawLocals = [];
        return _this;
    }
    BacktraceResponse.prototype.addFrames = function (args) {
        this.rawFrames = args;
    };
    BacktraceResponse.prototype.addLocals = function (args) {
        if (Util_1.Util.isUndefined(args))
            return;
        this.rawLocals.push(args);
    };
    BacktraceResponse.prototype.combine = function () {
        this.success = true;
        this.running = false;
        if (this.rawFrames === null || this.rawLocals === null) {
            this.default();
            return;
        }
        ProcessStatus_1.ProcessStatus.ins.clearFrameMap();
        var frameCount = this.rawFrames.length / ONEFRAMEARGS_COUNT;
        var frames = [];
        for (var frameidx = 0, v8frame = 0; frameidx < frameCount; frameidx++) {
            var script = this.rawFrames[frameidx * ONEFRAMEARGS_COUNT + BreakFrameArgs.script];
            var fun = this.rawFrames[frameidx * ONEFRAMEARGS_COUNT + BreakFrameArgs.function];
            var line = WrapperUtil_1.WrapperUtil.dukLineToV8Line(this.rawFrames[frameidx * ONEFRAMEARGS_COUNT + BreakFrameArgs.line]);
            var frame = { type: "frame", index: v8frame, line: line, column: 0, func: { scriptId: -1, name: "" }, arguments: [], locals: [] };
            frame.func.scriptId = ScriptsMgr_1.ScriptsMgr.getScriptId(ScriptsMgr_1.ScriptsMgr.makeFullPath(script));
            if (frame.func.scriptId < 0)
                continue;
            ProcessStatus_1.ProcessStatus.ins.setFrameMap(v8frame++, -(frameidx + 1));
            frame.func.name = fun;
            var locals = [];
            var curframeLocals = this.rawLocals[frameidx];
            if (curframeLocals) {
                for (var varidx = 0, n = (curframeLocals.length / 2); varidx < n; varidx++) {
                    var varname = curframeLocals[2 * varidx + 0];
                    var varval = curframeLocals[2 * varidx + 1];
                    var varobj = WrapperUtil_1.WrapperUtil.makeV8LocalVar(v8frame, varname, varname, varval);
                    locals.push(varobj);
                }
            }
            frame.locals = locals;
            frames.push(frame);
        }
        this.body = { fromFrame: 0, toFrame: frames.length, totalFrames: frames.length, frames: frames };
        var refsset = {};
        var refs = [];
        for (var i = 0; i < frames.length; i++) {
            var scriptId = frames[i].func.scriptId;
            var scriptobj = ScriptsMgr_1.ScriptsMgr.getScriptById(scriptId);
            if (scriptobj != null && !refsset[scriptId]) {
                refsset[scriptId] = true;
                refs.push(scriptobj);
            }
        }
        this.refs = refs;
    };
    BacktraceResponse.prototype.default = function () {
        this.body = {
            fromFrame: 0, toFrame: 1, totalFrames: 1,
            frames: [{ type: "frame", index: 0, line: 0, column: 0, func: { scriptId: 1 }, arguments: [], locals: [] }]
        };
        this.refs = [ScriptsMgr_1.ScriptsMgr.getScriptById(1)];
    };
    return BacktraceResponse;
}(V8Response));
exports.BacktraceResponse = BacktraceResponse;
var ContinueResponse = (function (_super) {
    __extends(ContinueResponse, _super);
    function ContinueResponse(request) {
        var _this = _super.call(this, request) || this;
        _this.body = undefined;
        _this.refs = undefined;
        _this.success = true;
        _this.running = true;
        return _this;
    }
    return ContinueResponse;
}(V8Response));
exports.ContinueResponse = ContinueResponse;
var SetBreakPointResponse = (function (_super) {
    __extends(SetBreakPointResponse, _super);
    function SetBreakPointResponse(request) {
        var _this = _super.call(this, request) || this;
        _this._breakPoint = -1;
        _this.success = true;
        _this.running = true;
        _this.refs = [];
        var args = request.arguments;
        var nb = ProcessStatus_1.ProcessStatus.ins.toolClient.breakPoints.addPoint(args.target, args.line, args.column, args.condition);
        _this.body = nb.toJSON();
        _this._breakPoint = nb.id;
        return _this;
    }
    Object.defineProperty(SetBreakPointResponse.prototype, "breakPoint", {
        get: function () {
            return this._breakPoint;
        },
        enumerable: true,
        configurable: true
    });
    return SetBreakPointResponse;
}(V8Response));
exports.SetBreakPointResponse = SetBreakPointResponse;
var ChangeBreakPointResponse = (function (_super) {
    __extends(ChangeBreakPointResponse, _super);
    function ChangeBreakPointResponse(request) {
        var _this = _super.call(this, request) || this;
        _this.success = true;
        _this.running = true;
        _this.refs = undefined;
        _this.body = undefined;
        return _this;
    }
    return ChangeBreakPointResponse;
}(V8Response));
exports.ChangeBreakPointResponse = ChangeBreakPointResponse;
var ClearBreakPointResponse = (function (_super) {
    __extends(ClearBreakPointResponse, _super);
    function ClearBreakPointResponse(request) {
        var _this = _super.call(this, request) || this;
        _this.success = true;
        _this.running = true;
        _this.refs = undefined;
        _this.body = { breakpoints: [request.arguments.breakpoint] };
        return _this;
    }
    return ClearBreakPointResponse;
}(V8Response));
exports.ClearBreakPointResponse = ClearBreakPointResponse;
var SuspendResponse = (function (_super) {
    __extends(SuspendResponse, _super);
    function SuspendResponse(request) {
        var _this = _super.call(this, request) || this;
        _this.success = true;
        _this.running = false;
        _this.refs = undefined;
        _this.body = undefined;
        return _this;
    }
    return SuspendResponse;
}(V8Response));
exports.SuspendResponse = SuspendResponse;
var EvaluateResponse = (function (_super) {
    __extends(EvaluateResponse, _super);
    function EvaluateResponse(request) {
        var _this = _super.call(this, request) || this;
        _this._exp = null;
        _this._v8frame = -1;
        _this._exp = request.arguments.expression;
        _this._v8frame = request.arguments.frame;
        return _this;
    }
    Object.defineProperty(EvaluateResponse.prototype, "varName", {
        get: function () {
            return this._exp;
        },
        enumerable: true,
        configurable: true
    });
    EvaluateResponse.prototype.error = function (message) {
        this.message = message;
        this.success = false;
        this.running = ProcessStatus_1.ProcessStatus.ins.isRunning;
        this.body = undefined;
        this.refs = undefined;
    };
    EvaluateResponse.prototype.combine = function (varval) {
        this.refs = [];
        this.running = ProcessStatus_1.ProcessStatus.ins.isRunning;
        var varobj = WrapperUtil_1.WrapperUtil.makeV8EvalVar(this._v8frame, this.varName, this.varName, varval);
        this.body = varobj;
    };
    return EvaluateResponse;
}(V8Response));
exports.EvaluateResponse = EvaluateResponse;
var LookupResponse = (function (_super) {
    __extends(LookupResponse, _super);
    function LookupResponse(request) {
        var _this = _super.call(this, request) || this;
        _this._varCount = 0;
        _this.varList = [];
        return _this;
    }
    Object.defineProperty(LookupResponse.prototype, "varCount", {
        set: function (val) {
            this._varCount = val;
        },
        enumerable: true,
        configurable: true
    });
    LookupResponse.prototype.addVarVal = function (refobj, descs) {
        this.varList.push({ refobj: refobj, descs: descs });
    };
    Object.defineProperty(LookupResponse.prototype, "isComplete", {
        get: function () {
            return this.varList.length == this._varCount;
        },
        enumerable: true,
        configurable: true
    });
    LookupResponse.prototype.combine = function () {
        this.body = {};
        for (var _i = 0, _a = this.varList; _i < _a.length; _i++) {
            var node = _a[_i];
            this.body[node.refobj.ref] = { handle: node.refobj.ref, type: node.refobj.obj.type, className: node.refobj.obj.className };
            var properties = [];
            for (var i = 0, ds = node.descs; i < ds.length / ONEPROPDESCARGS_COUNT; i++) {
                var flag = ds[i * ONEPROPDESCARGS_COUNT + PropDescArgs.flag];
                var name_1 = ds[i * ONEPROPDESCARGS_COUNT + PropDescArgs.name];
                var value = ds[i * ONEPROPDESCARGS_COUNT + PropDescArgs.value];
                if (!(/^[\w\.]+$/.test(name_1)))
                    continue;
                var varobj = WrapperUtil_1.WrapperUtil.makeV8LookupVar(node.refobj.frameidx, name_1, node.refobj.name + '.' + name_1, value);
                properties.push(varobj);
            }
            this.body[node.refobj.ref].properties = properties;
        }
    };
    return LookupResponse;
}(V8Response));
exports.LookupResponse = LookupResponse;
var ExceptionResponse = (function (_super) {
    __extends(ExceptionResponse, _super);
    function ExceptionResponse(request) {
        return _super.call(this, request) || this;
    }
    return ExceptionResponse;
}(V8Response));
exports.ExceptionResponse = ExceptionResponse;
var V8Event = (function (_super) {
    __extends(V8Event, _super);
    function V8Event() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'event';
        _this.event = '';
        return _this;
    }
    V8Event.prototype.toJSONString = function () {
        var res = {
            seq: this.seq,
            type: this.type,
            event: this.event,
            success: this.success,
            running: this.running,
            body: this.body,
            refs: this.refs,
        };
        return JSON.stringify(res);
    };
    return V8Event;
}(V8Notify));
exports.V8Event = V8Event;
var BreakEvent = (function (_super) {
    __extends(BreakEvent, _super);
    function BreakEvent(line, col, script) {
        var _this = _super.call(this) || this;
        _this.event = 'break';
        _this.success = undefined;
        _this.running = undefined;
        _this.refs = undefined;
        var scriptObj = ScriptsMgr_1.ScriptsMgr.getScript(script);
        if (scriptObj === null) {
            Util_1.Util.log('[error]', 'in BreakEvent error!');
        }
        var id = ProcessStatus_1.ProcessStatus.ins.toolClient.breakPoints.findPointId(line, col, scriptObj.id);
        if (id < 0) {
            id = ProcessStatus_1.ProcessStatus.ins.toolClient.breakPoints.addVirtualPoint(line, col, scriptObj.id).id;
        }
        ProcessStatus_1.ProcessStatus.ins.breakPoint = id;
        _this.body = { sourceLine: line, sourceColumn: col, script: ScriptsMgr_1.ScriptsMgr.getScript(script), breakpoints: [id] };
        return _this;
    }
    return BreakEvent;
}(V8Event));
exports.BreakEvent = BreakEvent;
var ExceptionEvent = (function (_super) {
    __extends(ExceptionEvent, _super);
    function ExceptionEvent() {
        var _this = _super.call(this) || this;
        _this.event = 'exception';
        _this.success = undefined;
        _this.running = undefined;
        return _this;
        /*
        JToken body = message["body"];
        Line = (int?)body["sourceLine"];
        Column = (int?)body["sourceColumn"];
        Uncaught = (bool)body["uncaught"];
        ExceptionId = (int)body["exception"]["handle"];
        Description = (string)body["exception"]["text"];
        TypeName = GetExceptionType(body);
        ExceptionName = GetExceptionName(message);
        ErrorNumber = GetExceptionCodeRef(body);

        JToken script = body["script"];
        if (script != null) {
            var scriptId = (int)script["id"];
            var fileName = (string)script["name"];
            Module = new NodeModule(scriptId, fileName);
        }
        */
    }
    return ExceptionEvent;
}(V8Event));
exports.ExceptionEvent = ExceptionEvent;
//# sourceMappingURL=V8Notify.js.map