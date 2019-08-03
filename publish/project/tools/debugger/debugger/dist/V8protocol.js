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
var BreakPoint_1 = require("./BreakPoint");
var ScriptsMgr_1 = require("./ScriptsMgr");
var Util_1 = require("./Util");
var ProcessStatus_1 = require("../ProcessStatus");
/**
    剩余问题列表：
    、RequestDataProcess中有bug，会组合出一个非法包
    、将剩余的立即处理的response修改成等待reply
    、ChangeBreakPointRequestHandler中disable 和 enable 的处理
    、变量中 NodeExpressionType， NodePropertyType 的填充

    整个结构太乱了，大脑一片糊，清醒时再整理下吧
        把和duk连接的部分独立处理
        把和vside连接的部分独立处理
        把duk协议处理和v8协议处理物理分离
        把scriptsmgr、breakpoints内置于主对象中
        两个进程间的通讯如何确保顺序执行，即如何有效传递启动脚本的路径
        如何确保可以彻底删除duk的breakpoints（准备的记录）
*/
var MAX_FRAMES = 10;
var NotifyStatusArgs;
(function (NotifyStatusArgs) {
    NotifyStatusArgs[NotifyStatusArgs["break"] = 0] = "break";
    NotifyStatusArgs[NotifyStatusArgs["script"] = 1] = "script";
    NotifyStatusArgs[NotifyStatusArgs["function"] = 2] = "function";
    NotifyStatusArgs[NotifyStatusArgs["line"] = 3] = "line";
    NotifyStatusArgs[NotifyStatusArgs["pc"] = 4] = "pc";
})(NotifyStatusArgs || (NotifyStatusArgs = {}));
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
var ClassType;
(function (ClassType) {
    ClassType[ClassType["UNUSED"] = 0] = "UNUSED";
    ClassType[ClassType["ARGUMENTS"] = 1] = "ARGUMENTS";
    ClassType[ClassType["ARRAY"] = 2] = "ARRAY";
    ClassType[ClassType["BOOLEAN"] = 3] = "BOOLEAN";
    ClassType[ClassType["DATE"] = 4] = "DATE";
    ClassType[ClassType["ERROR"] = 5] = "ERROR";
    ClassType[ClassType["FUNCTION"] = 6] = "FUNCTION";
    ClassType[ClassType["JSON"] = 7] = "JSON";
    ClassType[ClassType["MATH"] = 8] = "MATH";
    ClassType[ClassType["NUMBER"] = 9] = "NUMBER";
    ClassType[ClassType["OBJECT"] = 10] = "OBJECT";
    ClassType[ClassType["REGEXP"] = 11] = "REGEXP";
    ClassType[ClassType["STRING"] = 12] = "STRING";
    ClassType[ClassType["GLOBAL"] = 13] = "GLOBAL";
    ClassType[ClassType["OBJENV"] = 14] = "OBJENV";
    ClassType[ClassType["DECENV"] = 15] = "DECENV";
    ClassType[ClassType["BUFFER"] = 16] = "BUFFER";
    ClassType[ClassType["POINTER"] = 17] = "POINTER";
    ClassType[ClassType["THREAD"] = 18] = "THREAD";
    ClassType[ClassType["ARRAYBUFFER"] = 19] = "ARRAYBUFFER";
    ClassType[ClassType["DATAVIEW"] = 20] = "DATAVIEW";
    ClassType[ClassType["INT8ARRAY"] = 21] = "INT8ARRAY";
    ClassType[ClassType["UINT8ARRAY"] = 22] = "UINT8ARRAY";
    ClassType[ClassType["UINT8CLAMPEDARRAY"] = 23] = "UINT8CLAMPEDARRAY";
    ClassType[ClassType["INT16ARRAY"] = 24] = "INT16ARRAY";
    ClassType[ClassType["UINT16ARRAY"] = 25] = "UINT16ARRAY";
    ClassType[ClassType["INT32ARRAY"] = 26] = "INT32ARRAY";
    ClassType[ClassType["UINT32ARRAY"] = 27] = "UINT32ARRAY";
    ClassType[ClassType["FLOAT32ARRAY"] = 28] = "FLOAT32ARRAY";
    ClassType[ClassType["FLOAT64ARRAY"] = 29] = "FLOAT64ARRAY";
})(ClassType || (ClassType = {}));
var NodeExpressionType;
(function (NodeExpressionType) {
    NodeExpressionType[NodeExpressionType["None"] = 0] = "None";
    NodeExpressionType[NodeExpressionType["Property"] = 1] = "Property";
    NodeExpressionType[NodeExpressionType["Function"] = 2] = "Function";
    NodeExpressionType[NodeExpressionType["Boolean"] = 4] = "Boolean";
    NodeExpressionType[NodeExpressionType["Private"] = 8] = "Private";
    NodeExpressionType[NodeExpressionType["Expandable"] = 16] = "Expandable";
    NodeExpressionType[NodeExpressionType["ReadOnly"] = 32] = "ReadOnly";
    NodeExpressionType[NodeExpressionType["String"] = 64] = "String";
})(NodeExpressionType || (NodeExpressionType = {}));
var NodePropertyType;
(function (NodePropertyType) {
    NodePropertyType[NodePropertyType["Normal"] = 0] = "Normal";
    NodePropertyType[NodePropertyType["Field"] = 1] = "Field";
    NodePropertyType[NodePropertyType["Constant"] = 2] = "Constant";
    NodePropertyType[NodePropertyType["Callbacks"] = 3] = "Callbacks";
    NodePropertyType[NodePropertyType["Handler"] = 4] = "Handler";
    NodePropertyType[NodePropertyType["Interceptor"] = 5] = "Interceptor";
    NodePropertyType[NodePropertyType["Transition"] = 6] = "Transition";
    NodePropertyType[NodePropertyType["Nonexistent"] = 7] = "Nonexistent";
})(NodePropertyType || (NodePropertyType = {}));
var WrapperUtil = (function () {
    function WrapperUtil() {
    }
    // duk line from 1...n, v8 line from 0...n-1
    WrapperUtil.v8LineToDukLine = function (v8line) {
        return v8line + 1;
    };
    WrapperUtil.dukLineToV8Line = function (dukline) {
        return dukline - 1;
    };
    WrapperUtil.makeV8LocalVar = function (v8frame, varname, fullvarname, varval) {
        var rtvar = this.makev8Var(v8frame, varname, fullvarname, varval);
        var v8var = { name: rtvar.name, value: { ref: rtvar.ref, type: rtvar.type, value: rtvar.value, className: rtvar.className, text: rtvar.text } };
        return v8var;
    };
    WrapperUtil.makeV8EvalVar = function (v8frame, varname, fullvarname, varval) {
        var rtvar = this.makev8Var(v8frame, varname, fullvarname, varval);
        var v8var = { handle: rtvar.ref, type: rtvar.type, value: rtvar.value, text: rtvar.text, className: rtvar.className };
        return v8var;
    };
    WrapperUtil.makeV8LookupVar = function (v8frame, varname, fullvarname, varval) {
        return this.makev8Var(v8frame, varname, fullvarname, varval);
    };
    WrapperUtil.makev8Var = function (v8frame, varname, fullvarname, varval) {
        var vartype = typeof (varval);
        var varref = FrameValueRefs.ins.getRef(ProcessStatus_1.ProcessStatus.ins.breakPoint, v8frame, fullvarname, varval);
        var varobj = { ref: varref, name: varname, type: "", value: NaN, text: "", className: "", propertyType: 0, attributes: 0 };
        if (vartype === 'number' || vartype === 'string' || vartype === 'boolean') {
            varobj.type = vartype;
            varobj.value = varval;
        }
        else if (vartype === 'object') {
            if (!varval) {
                varobj.type = 'undefined';
                varobj.value = null;
            }
            else if (varval.type === 'object') {
                varobj.type = varval.type;
                if (varval.class === ClassType.ARRAY) {
                    varobj.type = 'object';
                    varobj.className = 'Array';
                }
                else if (varval.class === ClassType.FUNCTION) {
                    varobj.type = 'function';
                }
                else if (varval.class === ClassType.OBJECT) {
                    varobj.type = 'object';
                }
                else if (varval.class === ClassType.REGEXP) {
                    varobj.type = 'regexp';
                }
                varobj.value = varval.pointer;
            }
            else if (varval.type === 'number') {
                if (!Util_1.Util.isUndefined(varval.value)) {
                    varobj.value = varval.value;
                }
                else if (!Util_1.Util.isUndefined(varval.data)) {
                    varobj.value = Util_1.Util.toDouble(varval.data);
                }
                else {
                    console.log("makev8Var failed (varval.type==number) varval:", varval);
                }
            }
            else if (varval.type === 'undefined' || varval.type === 'null') {
                varobj.type = varval.type;
                varobj.value = null;
            }
            else {
                console.log("makev8Var failed (unknown varval.type) varobj:", varobj);
            }
        }
        else {
            console.log("makev8Var failed (unknown vartype:" + vartype + "), varobj:", varobj);
        }
        return varobj;
    };
    return WrapperUtil;
}());
exports.WrapperUtil = WrapperUtil;
var FrameValueRefs = (function () {
    function FrameValueRefs() {
        this.refs = {};
        this.refmappers = {};
    }
    Object.defineProperty(FrameValueRefs, "ins", {
        get: function () {
            if (this._ins == null) {
                this._ins = new FrameValueRefs();
            }
            return this._ins;
        },
        enumerable: true,
        configurable: true
    });
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
FrameValueRefs._ins = null;
FrameValueRefs.next_ref = 1;
var WaitDukReply = (function () {
    function WaitDukReply() {
        this.requests = [];
    }
    Object.defineProperty(WaitDukReply, "ins", {
        get: function () {
            if (this.ins_ == null) {
                this.ins_ = new WaitDukReply();
            }
            return this.ins_;
        },
        enumerable: true,
        configurable: true
    });
    WaitDukReply.prototype.clear = function () {
        this.requests = [];
    };
    WaitDukReply.prototype.push = function (req) {
        this.requests.push(req);
    };
    WaitDukReply.prototype.pop = function () {
        if (this.requests.length == 0)
            return null;
        var o = this.requests[0];
        this.requests.splice(0, 1);
        return o;
    };
    return WaitDukReply;
}());
WaitDukReply.ins_ = null;
var ProcessStatus = (function () {
    function ProcessStatus() {
        this._frameIdsMapper = {};
        this._isRunning = false;
        this._break_point = 0;
    }
    Object.defineProperty(ProcessStatus_1.ProcessStatus, "ins", {
        get: function () {
            if (this._ins == null) {
                this._ins = new ProcessStatus_1.ProcessStatus();
            }
            return this._ins;
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
    return ProcessStatus;
}());
ProcessStatus._ins = null;
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
            var line = WrapperUtil.dukLineToV8Line(this.rawFrames[frameidx * ONEFRAMEARGS_COUNT + BreakFrameArgs.line]);
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
                    var varobj = WrapperUtil.makeV8LocalVar(v8frame, varname, varname, varval);
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
var SetBreakPointResponse = (function (_super) {
    __extends(SetBreakPointResponse, _super);
    function SetBreakPointResponse(request) {
        var _this = _super.call(this, request) || this;
        _this._breakPoint = -1;
        _this.success = true;
        _this.running = true;
        _this.refs = [];
        var args = request.arguments;
        var nb = BreakPoint_1.BreakPointsMgr.ins.addPoint(args.target, args.line, args.column, args.condition);
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
        var varobj = WrapperUtil.makeV8EvalVar(this._v8frame, this.varName, this.varName, varval);
        this.body = varobj;
    };
    return EvaluateResponse;
}(V8Response));
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
                var varobj = WrapperUtil.makeV8LookupVar(node.refobj.frameidx, name_1, node.refobj.name + '.' + name_1, value);
                properties.push(varobj);
            }
            this.body[node.refobj.ref].properties = properties;
        }
    };
    return LookupResponse;
}(V8Response));
var ExceptionResponse = (function (_super) {
    __extends(ExceptionResponse, _super);
    function ExceptionResponse(request) {
        return _super.call(this, request) || this;
    }
    return ExceptionResponse;
}(V8Response));
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
        var id = BreakPoint_1.BreakPointsMgr.ins.findPointId(line, col, scriptObj.id);
        if (id < 0) {
            id = BreakPoint_1.BreakPointsMgr.ins.addVirtualPoint(line, col, scriptObj.id).id;
        }
        ProcessStatus_1.ProcessStatus.ins.breakPoint = id;
        _this.body = { sourceLine: line, sourceColumn: col, script: ScriptsMgr_1.ScriptsMgr.getScript(script), breakpoints: [id] };
        return _this;
    }
    return BreakEvent;
}(V8Event));
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
var RequestDataProcess = (function () {
    function RequestDataProcess() {
        this.recv = '';
    }
    RequestDataProcess.prototype.combineRequests = function (data) {
        this.recv += data.toString('utf8');
        var reqs = new Array();
        while (true) {
            var pos = this.recv.indexOf(RequestDataProcess.endToken);
            if (pos < 0)
                break;
            var arr = RequestDataProcess.recvPackLenPatt.exec(this.recv);
            var datasize = Number(arr[1]);
            var pkgpos = pos + RequestDataProcess.endToken.length;
            if (this.recv.length < pkgpos + datasize)
                break;
            var pkg = this.recv.substr(pkgpos, datasize);
            Util_1.Util.log('[c->s]', pkg);
            reqs.push(JSON.parse(pkg));
            this.recv = this.recv.substr(pkgpos + datasize);
        }
        return reqs;
    };
    RequestDataProcess.prototype.clear = function () {
        this.recv = '';
    };
    return RequestDataProcess;
}());
RequestDataProcess.endToken = '\r\n\r\n';
RequestDataProcess.recvPackLenPatt = /Content-Length:\s+(\d+)/;
var ResponseDataProcess = (function () {
    function ResponseDataProcess() {
        this.recv = '';
    }
    ResponseDataProcess.prototype.sendResponse = function (clientSocket, response) {
        var pkg = response.toJSONString();
        var s = ResponseDataProcess.packPatt.replace('<pkglen>', pkg.length.toString()).replace('<pkg>', pkg);
        if (response.islog)
            Util_1.Util.log('[s->c]', pkg);
        clientSocket.write(s);
    };
    ResponseDataProcess.prototype.clear = function () {
        this.recv = '';
    };
    return ResponseDataProcess;
}());
ResponseDataProcess.packPatt = 'Content-Length: <pkglen>\r\n\r\n<pkg>';
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
var ContinueRequestHandler = (function (_super) {
    __extends(ContinueRequestHandler, _super);
    function ContinueRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContinueRequestHandler.prototype.handle = function (request) {
        var rt = RequestHandler.emptyRt;
        rt.response = new ContinueResponse(request);
        var args = request.arguments;
        var stepaction = (args && args.stepaction) ? args.stepaction : '';
        var stepcount = (args && args.stepcount) ? args.stepcount : 1;
        var stepmapnames = { 'in': 'StepInto', 'next': 'StepOver', 'out': 'StepOut' };
        var dukaction = stepmapnames[stepaction];
        if (dukaction) {
            for (var i = 0; i < stepcount; i++) {
                rt.dukMsgs.push({ request: dukaction });
                WaitDukReply.ins.push({ request: dukaction });
            }
        }
        else {
            rt.dukMsgs.push({ request: "Resume" });
            WaitDukReply.ins.push({ request: rt.dukMsgs[0].request });
        }
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
        rt.response = new SetBreakPointResponse(request);
        var args = request.arguments;
        var dukLine = WrapperUtil.v8LineToDukLine(args.line);
        rt.dukMsgs.push({ request: "AddBreak", args: [ScriptsMgr_1.ScriptsMgr.getScriptShortName(args.target), dukLine] });
        WaitDukReply.ins.push({ request: 'AddBreak', v8Response: rt.response });
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
        var bkp = BreakPoint_1.BreakPointsMgr.ins.getPoint(request.arguments.breakpoint);
        if (bkp == null)
            return rt;
        bkp.ignoreCount = request.arguments.ignoreCount ? request.arguments.ignoreCount : 0;
        bkp.condition = request.arguments.condition ? request.arguments.condition : '';
        bkp.enabled = request.arguments.enabled ? request.arguments.enabled : false;
        //need do  -- disable , enable
        rt.response = new ChangeBreakPointResponse(request);
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
        rt.response = new ClearBreakPointResponse(request);
        var bp = BreakPoint_1.BreakPointsMgr.ins.getPoint(request.arguments.breakpoint);
        if (bp === null) {
            Util_1.Util.log('[error]', 'error in ClearBreakPointResponse, not find bp:' + request.arguments.breakpoint);
            return rt;
        }
        rt.dukMsgs.push({ request: 'DelBreak', args: [bp.duk_id] });
        WaitDukReply.ins.push({ request: 'DelBreak' });
        BreakPoint_1.BreakPointsMgr.ins.clearPoint(request.arguments.breakpoint);
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
        var response = new BacktraceResponse(request);
        rt.dukMsgs.push({ request: "GetCallStack" });
        for (var i = 0; i < MAX_FRAMES; i++) {
            rt.dukMsgs.push({ request: "GetLocals", args: [-(i + 1)] });
        }
        for (var _i = 0, _a = rt.dukMsgs; _i < _a.length; _i++) {
            var d = _a[_i];
            WaitDukReply.ins.push({ request: d.request, args: d.args, v8Response: response });
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
        var response = new EvaluateResponse(request);
        var exp = request.arguments.expression;
        var v8frame = request.arguments.frame;
        var isglobal = request.arguments.global;
        var dukframe = ProcessStatus_1.ProcessStatus.ins.dukFrame(v8frame);
        rt.dukMsgs.push({ request: 'Eval', args: [exp, dukframe] });
        WaitDukReply.ins.push({ request: 'Eval', v8Response: response });
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
        var response = new LookupResponse(request);
        for (var _i = 0, _a = request.arguments.handles; _i < _a.length; _i++) {
            var varref = _a[_i];
            var refobj = FrameValueRefs.ins.getObjectByRef(varref);
            if (!refobj) {
                Util_1.Util.log('[error]', 'cannot find refobj:' + varref);
                continue;
            }
            if (typeof (refobj.obj) !== 'object') {
                Util_1.Util.log('[error]', 'the refobj must is object:' + refobj);
                continue;
            }
            rt.dukMsgs.push({ request: 'GetObjPropDescRange', args: [refobj.obj, 0, 0x7fffffff] });
            WaitDukReply.ins.push({ request: 'GetObjPropDescRange', v8Response: response, additional: refobj });
        }
        response.varCount = rt.dukMsgs.length;
        return rt;
    };
    return LookupRequestHandler;
}(RequestHandler));
var ScriptsRequestHandler = (function (_super) {
    __extends(ScriptsRequestHandler, _super);
    function ScriptsRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScriptsRequestHandler.prototype.handle = function (request) {
        var rt = RequestHandler.emptyRt;
        rt.response = new ScriptsResponse(request);
        return rt;
    };
    return ScriptsRequestHandler;
}(RequestHandler));
var SuspendRequestHandler = (function (_super) {
    __extends(SuspendRequestHandler, _super);
    function SuspendRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SuspendRequestHandler.prototype.handle = function (request) {
        var rt = RequestHandler.emptyRt;
        rt.response = new SuspendResponse(request);
        rt.dukMsgs.push({ request: 'Pause' });
        WaitDukReply.ins.push({ request: rt.dukMsgs[0].request });
        return rt;
    };
    return SuspendRequestHandler;
}(RequestHandler));
var ChangeLiveRequestHandler = (function (_super) {
    __extends(ChangeLiveRequestHandler, _super);
    function ChangeLiveRequestHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ChangeLiveRequestHandler;
}(RequestHandler));
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
var ResponseRt;
(function (ResponseRt) {
    ResponseRt[ResponseRt["Ok"] = 0] = "Ok";
    ResponseRt[ResponseRt["UnknowScript"] = -1] = "UnknowScript";
    ResponseRt[ResponseRt["Detaching"] = -2] = "Detaching";
    ResponseRt[ResponseRt["RequestAndReplyNotInPair"] = -3] = "RequestAndReplyNotInPair";
})(ResponseRt = exports.ResponseRt || (exports.ResponseRt = {}));
var V8Protocol = (function () {
    function V8Protocol() {
        this.reqDataProcess = new RequestDataProcess();
        this.resDataProcess = new ResponseDataProcess();
        this.requestProcessor = new RequestProcessor();
        this.clientSocket = null;
        this.startScript = '';
    }
    V8Protocol.prototype.setStartScript = function (startScript) {
        startScript = startScript.replace(/\//g, '\\');
        this.startScript = startScript.substr(0, startScript.lastIndexOf('\\'));
    };
    /**
     * set debug-client-tool socket, and start script files
     * @param s
     */
    V8Protocol.prototype.startProcess = function (s) {
        this.reqDataProcess.clear();
        this.resDataProcess.clear();
        WaitDukReply.ins.clear();
        BreakPoint_1.BreakPointsMgr.ins.clear();
        FrameValueRefs.ins.clear();
        this.clientSocket = s;
        this.tryInitScripts();
        this.responseVersion();
    };
    V8Protocol.prototype.tryInitScripts = function () {
        var _this = this;
        if (this.startScript != '') {
            Util_1.Util.log('[common]', this.startScript);
            ScriptsMgr_1.ScriptsMgr.initScripts(this.startScript);
        }
        else {
            setTimeout(function () {
                _this.tryInitScripts();
            }, 500);
        }
    };
    /**
     * recv data from debug-client-tool, pre process, return target Server need json
     * convert v8 protocol -> duk json protocol
     * @param data
     */
    V8Protocol.prototype.processRequest = function (data) {
        var dukmsgs = new Array();
        var requests = this.reqDataProcess.combineRequests(data);
        for (var _i = 0, requests_1 = requests; _i < requests_1.length; _i++) {
            var request = requests_1[_i];
            try {
                if (!request.type) {
                    throw new Error('Type not specified');
                }
                if (request.type != 'request') {
                    throw new Error("Illegal type '" + request.type + "' in request");
                }
                if (!request.command) {
                    throw new Error('Command not specified');
                }
                var rt = this.requestProcessor.handle(request);
                for (var _a = 0, _b = rt.dukMsgs; _a < _b.length; _a++) {
                    var d = _b[_a];
                    dukmsgs.push(d);
                }
                for (var _c = 0, _d = rt.events; _c < _d.length; _c++) {
                    var evt = _d[_c];
                    this.resDataProcess.sendResponse(this.clientSocket, evt);
                }
                if (rt.response) {
                    this.resDataProcess.sendResponse(this.clientSocket, rt.response);
                }
            }
            catch (e) {
                var response = new ExceptionResponse(request);
                response.success = false;
                response.message = e.toString();
                this.resDataProcess.sendResponse(this.clientSocket, response);
                console.log(e.stack || e);
            }
        }
        return dukmsgs;
    };
    /**
     * targetServer send msg to debug-client-tool
     * convert duk protocol -> v8 protocol
     * @param msg
     */
    V8Protocol.prototype.processResponse = function (msg) {
        if (msg.notify === 'Status' && ProcessStatus_1.ProcessStatus.ins.isRunning) {
        }
        else {
            Util_1.Util.log('[t->s]', JSON.stringify(msg));
        }
        if (msg.notify === 'Status' && msg.args) {
            ProcessStatus_1.ProcessStatus.ins.isRunning = msg.args[NotifyStatusArgs.break] == 0;
            if (!ProcessStatus_1.ProcessStatus.ins.isRunning) {
                var shortname = msg.args[NotifyStatusArgs.script];
                if (typeof (shortname) === 'object') {
                    shortname = ScriptsMgr_1.ScriptsMgr.getScriptShortName(1);
                }
                var line = msg.args[NotifyStatusArgs.line];
                if (line == 0)
                    line = 1;
                var script = ScriptsMgr_1.ScriptsMgr.makeFullPath(shortname);
                if (!ScriptsMgr_1.ScriptsMgr.hasScript(script)) {
                    Util_1.Util.log('[error]', 'no find script :' + script);
                    return ResponseRt.UnknowScript;
                }
                var breakEvent = new BreakEvent(WrapperUtil.dukLineToV8Line(line), 0, script);
                this.resDataProcess.sendResponse(this.clientSocket, breakEvent);
            }
        }
        else if (msg.notify === 'Detaching') {
            return ResponseRt.Detaching;
        }
        else if (!Util_1.Util.isUndefined(msg.reply) || !Util_1.Util.isUndefined(msg.error)) {
            var req = WaitDukReply.ins.pop();
            if (req == null) {
                Util_1.Util.log('[error]', 'duk request and reply not in pairs!');
                return ResponseRt.RequestAndReplyNotInPair;
            }
            if (req.request === 'AddBreak') {
                var dukbpid = msg.args[0];
                if (msg.reply)
                    BreakPoint_1.BreakPointsMgr.ins.bindPoint(req.v8Response.breakPoint, dukbpid);
            }
            else if (req.request === 'GetCallStack') {
                var response = req.v8Response;
                if (msg.reply)
                    response.addFrames(msg.args);
            }
            else if (req.request === 'GetLocals') {
                var v8frameidx = -1 - req.args[0];
                var response = req.v8Response;
                if (msg.reply)
                    response.addLocals(msg.args);
                if (v8frameidx === MAX_FRAMES - 1) {
                    response.combine();
                    this.resDataProcess.sendResponse(this.clientSocket, response);
                }
            }
            else if (req.request === 'Eval') {
                var response = req.v8Response;
                if (!msg.reply || msg.args[0] === 1)
                    response.error(msg.reply ? msg.args[1] : 'ReferenceError: ' + response.varName + ' is not defined');
                else
                    response.combine(msg.args[1]);
                this.resDataProcess.sendResponse(this.clientSocket, response);
            }
            else if (req.request === 'GetObjPropDescRange') {
                var response = req.v8Response;
                response.addVarVal(req.additional, msg.args);
                if (response.isComplete) {
                    response.combine();
                    this.resDataProcess.sendResponse(this.clientSocket, response);
                }
            }
        }
        ResponseRt.Ok;
    };
    V8Protocol.prototype.responseVersion = function () {
        var head = 'Type: connect\r\nUts-Debugger-Version: 0.1\r\nContent-Length: 0\r\n\r\n';
        Util_1.Util.log('[s->c]', head);
        this.clientSocket.write(head);
    };
    return V8Protocol;
}());
exports.V8Protocol = V8Protocol;
//# sourceMappingURL=V8protocol.js.map