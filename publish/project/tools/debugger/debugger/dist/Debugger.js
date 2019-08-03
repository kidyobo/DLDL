"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var V8protocol_1 = require("./V8/V8protocol");
var ToolClientServer_1 = require("./ToolClientServer/ToolClientServer");
var TargetConnection_1 = require("./TargetConnection/TargetConnection");
var SingleProcess_1 = require("./SingleProcess");
var ProcessStatus_1 = require("./ProcessStatus");
// error frames
var a = { "seq": 39, "request_seq": 35, "type": "response", "command": "backtrace", "success": true, "body": { "fromFrame": 0, "toFrame": 7, "totalFrames": 7, "frames": [{ "type": "frame", "index": 0, "line": 80, "column": 0, "func": { "scriptId": 862, "name": "log" }, "arguments": [], "locals": [{ "name": "o", "value": { "ref": 1, "type": "string", "value": "拉取角色列表..." } }] }, { "type": "frame", "index": 1, "line": 58, "column": 0, "func": { "scriptId": 429, "name": "" }, "arguments": [], "locals": [{ "name": "isSuccess", "value": { "ref": 20, "type": "boolean", "value": true, "className": "", "text": "" } }, { "name": "gameParas", "value": { "ref": 25, "type": "undefined", "value": null, "className": "", "text": "" } }, { "name": "cmd", "value": { "ref": 26, "type": "undefined", "value": null, "className": "", "text": "" } }] }, { "type": "frame", "index": 2, "line": 23, "column": 0, "func": { "scriptId": 862, "name": "" }, "arguments": [], "locals": [{ "name": "nargs", "value": { "ref": 22, "type": "object", "value": "0000000034fd70c0", "className": "Array", "text": "" } }, { "name": "i", "value": { "ref": 23, "type": "number", "value": 0, "className": "", "text": "" } }, { "name": "n", "value": { "ref": 24, "type": "number", "value": 0, "className": "", "text": "" } }] }, { "type": "frame", "index": 3, "line": 215, "column": 0, "func": { "scriptId": 482, "name": "" }, "arguments": [], "locals": [{ "name": "id", "value": { "ref": 27, "type": "number", "value": 0, "className": "", "text": "" } }, { "name": "isSuccess", "value": { "ref": 28, "type": "boolean", "value": true, "className": "", "text": "" } }, { "name": "reason", "value": { "ref": 29, "type": "number", "value": 0, "className": "", "text": "" } }, { "name": "hostCount", "value": { "ref": 4, "type": "number", "value": 2, "className": "", "text": "" } }, { "name": "i", "value": { "ref": 5, "type": "number", "value": 2, "className": "", "text": "" } }, { "name": "socket", "value": { "ref": 6, "type": "object", "value": "000000004fe9fe50", "className": "", "text": "" } }, { "name": "errorCnt", "value": { "ref": 30, "type": "undefined", "value": null, "className": "", "text": "" } }] }, { "type": "frame", "index": 4, "line": 23, "column": 0, "func": { "scriptId": 862, "name": "" }, "arguments": [], "locals": [{ "name": "nargs", "value": { "ref": 31, "type": "object", "value": "0000000034fd6f80", "className": "Array", "text": "" } }, { "name": "i", "value": { "ref": 11, "type": "number", "value": 0, "className": "", "text": "" } }, { "name": "n", "value": { "ref": 32, "type": "number", "value": 0, "className": "", "text": "" } }] }, { "type": "frame", "index": 5, "line": 71, "column": 0, "func": { "scriptId": 482, "name": "" }, "arguments": [], "locals": [{ "name": "isSuccess", "value": { "ref": 33, "type": "boolean", "value": true, "className": "", "text": "" } }, { "name": "reason", "value": { "ref": 34, "type": "number", "value": 0, "className": "", "text": "" } }] }, { "type": "frame", "index": 6, "line": 23, "column": 0, "func": { "scriptId": 862, "name": "" }, "arguments": [], "locals": [{ "name": "nargs", "value": { "ref": 35, "type": "object", "value": "0000000034fd5680", "className": "Array", "text": "" } }, { "name": "i", "value": { "ref": 36, "type": "number", "value": 0, "className": "", "text": "" } }, { "name": "n", "value": { "ref": 37, "type": "number", "value": 0, "className": "", "text": "" } }] }] }, "refs": [{ "handle": 862, "id": 862, "type": "script", "name": "C:\\client-src\\client\\trunk\\project\\TsScripts\\.dist\\uts\\uts.js", "lineOffset": 0, "columnOffset": 0, "lineCount": 0, "sourceStart": "", "sourceLength": 0, "scriptType": 2, "compilationType": 0, "context": { "ref": 0 }, "text": "" }, { "handle": 429, "id": 429, "type": "script", "name": "C:\\client-src\\client\\trunk\\project\\TsScripts\\.dist\\System\\net\\NetModule.js", "lineOffset": 0, "columnOffset": 0, "lineCount": 0, "sourceStart": "", "sourceLength": 0, "scriptType": 2, "compilationType": 0, "context": { "ref": 0 }, "text": "" }, { "handle": 482, "id": 482, "type": "script", "name": "C:\\client-src\\client\\trunk\\project\\TsScripts\\.dist\\System\\protocol\\NetHandler.js", "lineOffset": 0, "columnOffset": 0, "lineCount": 0, "sourceStart": "", "sourceLength": 0, "scriptType": 2, "compilationType": 0, "context": { "ref": 0 }, "text": "" }], "running": false };
var App = (function () {
    function App() {
        this.clientServer = null;
        this.targetClient = null;
        this.toolClient = null;
        this.v8 = new V8protocol_1.V8Protocol();
    }
    App.prototype.run = function () {
        var _this = this;
        console.log('uts debugger');
        var optTargetHost = '127.0.0.1';
        var optTargetPort = 9091;
        var optJsonProxyPort = 9093;
        var startScript = '';
        for (var i = 2; i < process.argv.length; i++) {
            var arg = process.argv[i];
            if (arg == '--debug-brk=')
                optJsonProxyPort = Util_1.Util.toNumber(arg[i + 1]);
            else if (arg == '--target-host=')
                optTargetHost = arg[i + 1];
            else if (arg == '--target-port=')
                optTargetPort = Util_1.Util.toNumber(arg[i + 1]);
            else if (/.js$/.test(arg))
                startScript = arg;
        }
        console.log('');
        console.log('Effective options:');
        console.log('  --target-host:       ' + optTargetHost);
        console.log('  --target-port:       ' + optTargetPort);
        console.log('  --debug-brk:         ' + optJsonProxyPort);
        console.log('  startScript:         ' + startScript);
        console.log('');
        SingleProcess_1.SingleProcess.ins.check('127.0.0.1', optJsonProxyPort, function (flag, client) {
            if (flag === 'running') {
                client.write(startScript + "#");
                Util_1.Util.log('[common]', startScript);
                setTimeout(function () {
                    client.destroy();
                }, 5000);
            }
            else {
                client.destroy();
                var thisScript = process.argv[1];
                var thisScriptPath = thisScript.substring(0, thisScript.replace('/', '\\').lastIndexOf('\\'));
                // set start script and wait other process setting
                _this.v8.setStartScript(startScript);
                SingleProcess_1.SingleProcess.ins.enterMutex(optJsonProxyPort, function (startScript) { _this.v8.setStartScript(startScript); });
                // waiting for vstool connect
                _this.clientServer = new ToolClientServer_1.ToolClientServer(optJsonProxyPort, function (data) { return _this.onFromToolClientMsg(data); });
                _this.clientServer.run();
                // connect to duk target server
                _this.targetClient = new TargetConnection_1.TargetConnection(optTargetHost, optTargetPort, function (msg) { _this.onFromDukTargetMsg(msg); });
                _this.targetClient.run();
            }
        });
    };
    App.prototype.sendToTargetMsg = function (msg) {
        this.targetClient.sendMsg(msg);
    };
    App.prototype.onFromToolClientMsg = function (data) {
        try {
            if (data.type == 'start') {
                this.v8.startProcess(data.client);
            }
            else if (data.type == 'close' || data.type == 'error') {
                this.resumeTargetSimulateDetach();
            }
            else if (data.type == 'data') {
                var msgs = this.v8.processRequest(data.data);
                for (var _i = 0, msgs_1 = msgs; _i < msgs_1.length; _i++) {
                    var msg = msgs_1[_i];
                    this.sendToTargetMsg(msg);
                }
            }
            return 0;
        }
        catch (e) {
            console.log(e);
            this.sendToClientMsg(this.v8, {
                notify: '_Error',
                args: ['Failed to handle input json message: ' + e]
            });
            return -1;
        }
    };
    App.prototype.onFromDukTargetMsg = function (msg) {
        if (msg.notify === '_Connected') {
            // todo...
            // 1. 是由vs启动的，则等待5秒，如果没连上则resume
            // 2. 非vs启动，如果无vs连接，则resume
            // 3. 非vs启动，如果有vs连接，如果断点列表，则向target设置断点，再resume
        }
        else if (msg.notify === '_Error' || msg.notify === '_Disconnecting') {
            Util_1.Util.log('[comm]', 'target disconnecting!');
        }
        else {
            this.sendToClientMsg(this.v8, msg);
        }
    };
    App.prototype.resumeTargetSimulateDetach = function () {
        // clear all breakpoint from target server
        var bps = ProcessStatus_1.ProcessStatus.ins.toolClient.breakPoints;
        for (var i = 0, n = bps.count; i < n; i++) {
            var bp = bps.getPointByIndex(i);
            this.sendToTargetMsg({ request: 'DelBreak', args: [bp.duk_id] });
        }
        // resume target server
        this.sendToTargetMsg({ request: 'Resume' });
    };
    App.prototype.sendToClientMsg = function (v8, msg) {
        try {
            var rt = v8.processResponse(msg);
            if (rt == V8protocol_1.ResponseRt.Detaching) {
                this.targetClient.close();
            }
            ;
        }
        catch (e) {
            console.log('Failed to write JSON in writeJsonSafe, ignoring: ' + e);
        }
    };
    return App;
}());
new App().run();
//# sourceMappingURL=Debugger.js.map