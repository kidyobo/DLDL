"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScriptsMgr_1 = require("../ScriptsMgr");
var Util_1 = require("../Util");
var RequestDataCombiner_1 = require("./RequestDataCombiner");
var ResponseDataPacker_1 = require("./ResponseDataPacker");
var RequestProcessor_1 = require("./RequestProcessor");
var ProcessStatus_1 = require("../ProcessStatus");
var WrapperUtil_1 = require("./WrapperUtil");
var vn = require("./V8Notify");
/**
    剩余问题列表：
    、RequestDataProcess中有bug，会组合出一个非法包
    、将剩余的立即处理的response修改成等待reply
    、ChangeBreakPointRequestHandler中disable 和 enable 的处理
    、变量中 NodeExpressionType， NodePropertyType 的填充

    结构优化
        把和duk连接的部分独立处理
        把和vside连接的部分独立处理
        把duk协议处理和v8协议处理物理分离
        把scriptsmgr、breakpoints内置于主对象中
        两个进程间的通讯如何确保顺序执行，如何有效传递启动脚本的路径
        如何确保可以彻底删除duk的breakpoints（准确的记录）
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
var ResponseRt;
(function (ResponseRt) {
    ResponseRt[ResponseRt["Ok"] = 0] = "Ok";
    ResponseRt[ResponseRt["UnknowScript"] = -1] = "UnknowScript";
    ResponseRt[ResponseRt["Detaching"] = -2] = "Detaching";
    ResponseRt[ResponseRt["RequestAndReplyNotInPair"] = -3] = "RequestAndReplyNotInPair";
})(ResponseRt = exports.ResponseRt || (exports.ResponseRt = {}));
var V8Protocol = (function () {
    function V8Protocol() {
        this.requestDataCombiner = new RequestDataCombiner_1.RequestDataCombiner();
        this.responseDataPacker = new ResponseDataPacker_1.ResponseDataPacker();
        this.requestProcessor = new RequestProcessor_1.RequestProcessor();
        this.client = null;
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
    V8Protocol.prototype.startProcess = function (client) {
        this.requestDataCombiner.clear();
        this.responseDataPacker.clear();
        this.client = client;
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
        var requests = this.requestDataCombiner.combine(data);
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
                    this.client.send(this.responseDataPacker.pack(evt));
                }
                if (rt.response) {
                    this.client.send(this.responseDataPacker.pack(rt.response));
                }
            }
            catch (e) {
                var response = new vn.ExceptionResponse(request);
                response.success = false;
                response.message = e.toString();
                this.client.send(this.responseDataPacker.pack(response));
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
        Util_1.Util.log('[t->s]', JSON.stringify(msg));
        if (msg.notify === 'Status' && msg.args) {
            ProcessStatus_1.ProcessStatus.ins.isRunning = msg.args[NotifyStatusArgs.break] == 0;
            if (!ProcessStatus_1.ProcessStatus.ins.isRunning && !ProcessStatus_1.ProcessStatus.ins.pausing) {
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
                var breakEvent = new vn.BreakEvent(WrapperUtil_1.WrapperUtil.dukLineToV8Line(line), 0, script);
                this.client.send(this.responseDataPacker.pack(breakEvent));
            }
        }
        else if (msg.notify === 'Detaching') {
            if (msg.args && msg.args.length > 0)
                Util_1.Util.log('[common]', 'Detaching reason:' + msg.args[0]);
            return ResponseRt.Detaching;
        }
        else if (!Util_1.Util.isUndefined(msg.reply) || !Util_1.Util.isUndefined(msg.error)) {
            var req = ProcessStatus_1.ProcessStatus.ins.requestQueue.pop();
            if (req == null) {
                Util_1.Util.log('[error]', 'duk request and reply not in pairs!');
                return ResponseRt.RequestAndReplyNotInPair;
            }
            if (req.request === 'AddBreak') {
                var dukbpid = msg.args[0];
                var response = req.v8Response;
                ProcessStatus_1.ProcessStatus.ins.toolClient.breakPoints.bindPoint(response.breakPoint, msg.reply ? dukbpid : -1);
            }
            else if (req.request === 'DelBreak') {
                //let response = req.v8Response as vn.ClearBreakPointResponse;
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
                    this.client.send(this.responseDataPacker.pack(response));
                }
            }
            else if (req.request === 'Eval') {
                var response = req.v8Response;
                if (!msg.reply || msg.args[0] === 1)
                    response.error(msg.reply ? msg.args[1] : 'ReferenceError: ' + response.varName + ' is not defined');
                else
                    response.combine(msg.args[1]);
                this.client.send(this.responseDataPacker.pack(response));
            }
            else if (req.request === 'GetObjPropDescRange') {
                var response = req.v8Response;
                response.addVarVal(req.additional, msg.args);
                if (response.isComplete) {
                    response.combine();
                    this.client.send(this.responseDataPacker.pack(response));
                }
            }
            else if (req.request === 'Pause') {
            }
        }
        ResponseRt.Ok;
    };
    V8Protocol.prototype.responseVersion = function () {
        var head = 'Type: connect\r\nUts-Debugger-Version: 0.1\r\nContent-Length: 0\r\n\r\n';
        Util_1.Util.log('[s->c]', head);
        this.client.send(head);
    };
    return V8Protocol;
}());
exports.V8Protocol = V8Protocol;
//# sourceMappingURL=V8protocol.js.map