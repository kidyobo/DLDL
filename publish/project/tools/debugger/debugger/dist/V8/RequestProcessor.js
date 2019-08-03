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
var WrapperUtil_1 = require("./WrapperUtil");
var ScriptsMgr_1 = require("../ScriptsMgr");
var Util_1 = require("../Util");
var vn = require("./V8Notify");
var MAX_FRAMES = 10; // bug...
var RequestProcessor = (function () {
    function RequestProcessor() {
        this.handlers = null;
        this.regHandlers();
    }
    RequestProcessor.prototype.handle = function (request) {
        var key = request.command.toLowerCase();
        var handler = this.handlers[key];
        if (handler) {
            return handler.handle(request);
        }
        else {
            throw new Error('Unknown command "' + request.command + '" in request');
        }
    };
    RequestProcessor.prototype.regHandlers = function () {
        this.handlers =
            {
                "continue": new ContinueRequestHandler(),
                "setbreakpoint": new SetBreakPointRequestHandler(),
                "changebreakpoint": new ChangeBreakPointRequestHandler(),
                "clearbreakpoint": new ClearBreakPointRequestHandler(),
                "disconnect": new DisconnectRequestHandler(),
                "setexceptionbreak": new SetExceptionBreakRequestHandler(),
                "listbreakpoints": new ListBreakpointsRequestHandler(),
                "backtrace": new BacktraceRequestHandler(),
                "setvariablevalue": new SetVariableValueRequestHandler(),
                "evaluate": new EvaluateRequestHandler(),
                "lookup": new LookupRequestHandler(),
                "scripts": new ScriptsRequestHandler(),
                "suspend": new SuspendRequestHandler(),
                "changelive": new ChangeLiveRequestHandler(),
            };
    };
    return RequestProcessor;
}());
exports.RequestProcessor = RequestProcessor;
var RequestHandler = (function () {
    function RequestHandler() {
    }
    Object.defineProperty(RequestHandler, "emptyRt", {
        get: function () {
            return { dukMsgs: [], events: [], response: null };
        },
        enumerable: true,
        configurable: true
    });
    RequestHandler.prototype.handle = function (request) {
        return null;
    };
    return RequestHandler;
}());
var SuspendRequestHandler = (function (_super) {
    __extends(SuspendRequestHandler, _super);
    function SuspendRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SuspendRequestHandler.prototype.handle = function (request) {
        var rt = RequestHandler.emptyRt;
        rt.response = new vn.SuspendResponse(request);
        var cmd = 'Pause';
        rt.dukMsgs.push({ request: cmd });
        ProcessStatus_1.ProcessStatus.ins.requestQueue.push({ request: cmd });
        ProcessStatus_1.ProcessStatus.ins.pausing = true;
        return rt;
    };
    return SuspendRequestHandler;
}(RequestHandler));
var ContinueRequestHandler = (function (_super) {
    __extends(ContinueRequestHandler, _super);
    function ContinueRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContinueRequestHandler.prototype.handle = function (request) {
        var rt = RequestHandler.emptyRt;
        rt.response = new vn.ContinueResponse(request);
        var args = request.arguments;
        var stepaction = (args && args.stepaction) ? args.stepaction : '';
        var stepcount = (args && args.stepcount) ? args.stepcount : 1;
        var stepmapnames = { 'in': 'StepInto', 'next': 'StepOver', 'out': 'StepOut' };
        var dukaction = stepmapnames[stepaction];
        if (dukaction) {
            for (var i = 0; i < stepcount; i++) {
                rt.dukMsgs.push({ request: dukaction });
                ProcessStatus_1.ProcessStatus.ins.requestQueue.push({ request: dukaction });
            }
        }
        else {
            var cmd = 'Resume';
            rt.dukMsgs.push({ request: cmd });
            ProcessStatus_1.ProcessStatus.ins.requestQueue.push({ request: cmd });
        }
        ProcessStatus_1.ProcessStatus.ins.pausing = false;
        return rt;
    };
    return ContinueRequestHandler;
}(RequestHandler));
var SetBreakPointRequestHandler = (function (_super) {
    __extends(SetBreakPointRequestHandler, _super);
    function SetBreakPointRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SetBreakPointRequestHandler.prototype.handle = function (request) {
        var rt = RequestHandler.emptyRt;
        rt.response = new vn.SetBreakPointResponse(request);
        var args = request.arguments;
        var dukLine = WrapperUtil_1.WrapperUtil.v8LineToDukLine(args.line);
        var cmd = 'AddBreak';
        rt.dukMsgs.push({ request: cmd, args: [ScriptsMgr_1.ScriptsMgr.getScriptShortName(args.target), dukLine] });
        ProcessStatus_1.ProcessStatus.ins.requestQueue.push({ request: cmd, v8Response: rt.response });
        return rt;
    };
    return SetBreakPointRequestHandler;
}(RequestHandler));
var ChangeBreakPointRequestHandler = (function (_super) {
    __extends(ChangeBreakPointRequestHandler, _super);
    function ChangeBreakPointRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangeBreakPointRequestHandler.prototype.handle = function (request) {
        var rt = RequestHandler.emptyRt;
        var bkp = ProcessStatus_1.ProcessStatus.ins.toolClient.breakPoints.getPoint(request.arguments.breakpoint);
        if (bkp == null)
            return rt;
        bkp.ignoreCount = request.arguments.ignoreCount ? request.arguments.ignoreCount : 0;
        bkp.condition = request.arguments.condition ? request.arguments.condition : '';
        bkp.enabled = request.arguments.enabled ? request.arguments.enabled : false;
        //need do  -- disable , enable
        rt.response = new vn.ChangeBreakPointResponse(request);
        return rt;
    };
    return ChangeBreakPointRequestHandler;
}(RequestHandler));
var ClearBreakPointRequestHandler = (function (_super) {
    __extends(ClearBreakPointRequestHandler, _super);
    function ClearBreakPointRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClearBreakPointRequestHandler.prototype.handle = function (request) {
        var rt = RequestHandler.emptyRt;
        rt.response = new vn.ClearBreakPointResponse(request);
        var bp = ProcessStatus_1.ProcessStatus.ins.toolClient.breakPoints.getPoint(request.arguments.breakpoint);
        if (bp === null) {
            Util_1.Util.log('[error]', 'error in ClearBreakPointResponse, not find bp:' + request.arguments.breakpoint);
            return rt;
        }
        var cmd = 'DelBreak';
        rt.dukMsgs.push({ request: cmd, args: [bp.duk_id] });
        ProcessStatus_1.ProcessStatus.ins.requestQueue.push({ request: cmd, v8Response: rt.response });
        ProcessStatus_1.ProcessStatus.ins.toolClient.breakPoints.clearPoint(rt.response.body.breakpoints[0]);
        return rt;
    };
    return ClearBreakPointRequestHandler;
}(RequestHandler));
var DisconnectRequestHandler = (function (_super) {
    __extends(DisconnectRequestHandler, _super);
    function DisconnectRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DisconnectRequestHandler;
}(RequestHandler));
var SetExceptionBreakRequestHandler = (function (_super) {
    __extends(SetExceptionBreakRequestHandler, _super);
    function SetExceptionBreakRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SetExceptionBreakRequestHandler;
}(RequestHandler));
var ListBreakpointsRequestHandler = (function (_super) {
    __extends(ListBreakpointsRequestHandler, _super);
    function ListBreakpointsRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListBreakpointsRequestHandler;
}(RequestHandler));
var BacktraceRequestHandler = (function (_super) {
    __extends(BacktraceRequestHandler, _super);
    function BacktraceRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BacktraceRequestHandler.prototype.handle = function (request) {
        var rt = RequestHandler.emptyRt;
        var response = new vn.BacktraceResponse(request);
        rt.dukMsgs.push({ request: "GetCallStack" });
        for (var i = 0; i < MAX_FRAMES; i++) {
            rt.dukMsgs.push({ request: "GetLocals", args: [-(i + 1)] });
        }
        for (var _i = 0, _a = rt.dukMsgs; _i < _a.length; _i++) {
            var d = _a[_i];
            ProcessStatus_1.ProcessStatus.ins.requestQueue.push({ request: d.request, args: d.args, v8Response: response });
        }
        return rt;
    };
    return BacktraceRequestHandler;
}(RequestHandler));
var SetVariableValueRequestHandler = (function (_super) {
    __extends(SetVariableValueRequestHandler, _super);
    function SetVariableValueRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SetVariableValueRequestHandler;
}(RequestHandler));
var EvaluateRequestHandler = (function (_super) {
    __extends(EvaluateRequestHandler, _super);
    function EvaluateRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EvaluateRequestHandler.prototype.handle = function (request) {
        var rt = RequestHandler.emptyRt;
        var response = new vn.EvaluateResponse(request);
        var exp = request.arguments.expression;
        var v8frame = request.arguments.frame;
        var isglobal = request.arguments.global;
        var dukframe = ProcessStatus_1.ProcessStatus.ins.dukFrame(v8frame);
        var cmd = 'Eval';
        rt.dukMsgs.push({ request: cmd, args: [exp, dukframe] });
        ProcessStatus_1.ProcessStatus.ins.requestQueue.push({ request: cmd, v8Response: response });
        return rt;
    };
    return EvaluateRequestHandler;
}(RequestHandler));
var LookupRequestHandler = (function (_super) {
    __extends(LookupRequestHandler, _super);
    function LookupRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LookupRequestHandler.prototype.handle = function (request) {
        var rt = RequestHandler.emptyRt;
        var response = new vn.LookupResponse(request);
        for (var _i = 0, _a = request.arguments.handles; _i < _a.length; _i++) {
            var varref = _a[_i];
            var refobj = ProcessStatus_1.ProcessStatus.ins.toolClient.frameValueRefs.getObjectByRef(varref);
            if (!refobj) {
                Util_1.Util.log('[error]', 'cannot find refobj:' + varref);
                continue;
            }
            if (typeof (refobj.obj) !== 'object') {
                Util_1.Util.log('[error]', 'the refobj must is object:' + refobj);
                continue;
            }
            var cmd = 'GetObjPropDescRange';
            rt.dukMsgs.push({ request: cmd, args: [refobj.obj, 0, 0x7fffffff] });
            ProcessStatus_1.ProcessStatus.ins.requestQueue.push({ request: cmd, v8Response: response, additional: refobj });
        }
        response.varCount = rt.dukMsgs.length;
        return rt;
    };
    return LookupRequestHandler;
}(RequestHandler));
var ChangeLiveRequestHandler = (function (_super) {
    __extends(ChangeLiveRequestHandler, _super);
    function ChangeLiveRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ChangeLiveRequestHandler;
}(RequestHandler));
var ScriptsRequestHandler = (function (_super) {
    __extends(ScriptsRequestHandler, _super);
    function ScriptsRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScriptsRequestHandler.prototype.handle = function (request) {
        var rt = RequestHandler.emptyRt;
        rt.response = new vn.ScriptsResponse(request);
        return rt;
    };
    return ScriptsRequestHandler;
}(RequestHandler));
//# sourceMappingURL=RequestProcessor.js.map