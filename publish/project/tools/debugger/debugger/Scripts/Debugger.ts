import fs = require('fs');
import { Util } from './Util';
import { V8Protocol, ResponseRt } from './V8/V8protocol'
import { ToolClientServer, ClientData } from './ToolClientServer/ToolClientServer'
import { ToolClient } from './ToolClientServer/ToolClient'
import { TargetConnection } from './TargetConnection/TargetConnection'
import { DukMsg } from './TargetConnection/Common'
import { SingleProcess } from "./SingleProcess";
import { ProcessStatus } from "./ProcessStatus";

// error frames
var a = { "seq": 39, "request_seq": 35, "type": "response", "command": "backtrace", "success": true, "body": { "fromFrame": 0, "toFrame": 7, "totalFrames": 7, "frames": [{ "type": "frame", "index": 0, "line": 80, "column": 0, "func": { "scriptId": 862, "name": "log" }, "arguments": [], "locals": [{ "name": "o", "value": { "ref": 1, "type": "string", "value": "拉取角色列表..." } }] }, { "type": "frame", "index": 1, "line": 58, "column": 0, "func": { "scriptId": 429, "name": "" }, "arguments": [], "locals": [{ "name": "isSuccess", "value": { "ref": 20, "type": "boolean", "value": true, "className": "", "text": "" } }, { "name": "gameParas", "value": { "ref": 25, "type": "undefined", "value": null, "className": "", "text": "" } }, { "name": "cmd", "value": { "ref": 26, "type": "undefined", "value": null, "className": "", "text": "" } }] }, { "type": "frame", "index": 2, "line": 23, "column": 0, "func": { "scriptId": 862, "name": "" }, "arguments": [], "locals": [{ "name": "nargs", "value": { "ref": 22, "type": "object", "value": "0000000034fd70c0", "className": "Array", "text": "" } }, { "name": "i", "value": { "ref": 23, "type": "number", "value": 0, "className": "", "text": "" } }, { "name": "n", "value": { "ref": 24, "type": "number", "value": 0, "className": "", "text": "" } }] }, { "type": "frame", "index": 3, "line": 215, "column": 0, "func": { "scriptId": 482, "name": "" }, "arguments": [], "locals": [{ "name": "id", "value": { "ref": 27, "type": "number", "value": 0, "className": "", "text": "" } }, { "name": "isSuccess", "value": { "ref": 28, "type": "boolean", "value": true, "className": "", "text": "" } }, { "name": "reason", "value": { "ref": 29, "type": "number", "value": 0, "className": "", "text": "" } }, { "name": "hostCount", "value": { "ref": 4, "type": "number", "value": 2, "className": "", "text": "" } }, { "name": "i", "value": { "ref": 5, "type": "number", "value": 2, "className": "", "text": "" } }, { "name": "socket", "value": { "ref": 6, "type": "object", "value": "000000004fe9fe50", "className": "", "text": "" } }, { "name": "errorCnt", "value": { "ref": 30, "type": "undefined", "value": null, "className": "", "text": "" } }] }, { "type": "frame", "index": 4, "line": 23, "column": 0, "func": { "scriptId": 862, "name": "" }, "arguments": [], "locals": [{ "name": "nargs", "value": { "ref": 31, "type": "object", "value": "0000000034fd6f80", "className": "Array", "text": "" } }, { "name": "i", "value": { "ref": 11, "type": "number", "value": 0, "className": "", "text": "" } }, { "name": "n", "value": { "ref": 32, "type": "number", "value": 0, "className": "", "text": "" } }] }, { "type": "frame", "index": 5, "line": 71, "column": 0, "func": { "scriptId": 482, "name": "" }, "arguments": [], "locals": [{ "name": "isSuccess", "value": { "ref": 33, "type": "boolean", "value": true, "className": "", "text": "" } }, { "name": "reason", "value": { "ref": 34, "type": "number", "value": 0, "className": "", "text": "" } }] }, { "type": "frame", "index": 6, "line": 23, "column": 0, "func": { "scriptId": 862, "name": "" }, "arguments": [], "locals": [{ "name": "nargs", "value": { "ref": 35, "type": "object", "value": "0000000034fd5680", "className": "Array", "text": "" } }, { "name": "i", "value": { "ref": 36, "type": "number", "value": 0, "className": "", "text": "" } }, { "name": "n", "value": { "ref": 37, "type": "number", "value": 0, "className": "", "text": "" } }] }] }, "refs": [{ "handle": 862, "id": 862, "type": "script", "name": "C:\\client-src\\client\\trunk\\project\\TsScripts\\.dist\\uts\\uts.js", "lineOffset": 0, "columnOffset": 0, "lineCount": 0, "sourceStart": "", "sourceLength": 0, "scriptType": 2, "compilationType": 0, "context": { "ref": 0 }, "text": "" }, { "handle": 429, "id": 429, "type": "script", "name": "C:\\client-src\\client\\trunk\\project\\TsScripts\\.dist\\System\\net\\NetModule.js", "lineOffset": 0, "columnOffset": 0, "lineCount": 0, "sourceStart": "", "sourceLength": 0, "scriptType": 2, "compilationType": 0, "context": { "ref": 0 }, "text": "" }, { "handle": 482, "id": 482, "type": "script", "name": "C:\\client-src\\client\\trunk\\project\\TsScripts\\.dist\\System\\protocol\\NetHandler.js", "lineOffset": 0, "columnOffset": 0, "lineCount": 0, "sourceStart": "", "sourceLength": 0, "scriptType": 2, "compilationType": 0, "context": { "ref": 0 }, "text": "" }], "running": false };

class App {
    private clientServer: ToolClientServer = null;
    private targetClient: TargetConnection = null;
    private toolClient: ToolClient = null;
    private v8 = new V8Protocol();

    run() {
        console.log('uts debugger');

        let optTargetHost = '127.0.0.1';
        let optTargetPort = 9091;
        let optJsonProxyPort = 9093;
        let startScript = '';
        for (let i = 2; i < process.argv.length; i++) {
            let arg = process.argv[i];
            if (arg == '--debug-brk=') optJsonProxyPort = Util.toNumber(arg[i + 1]);
            else if (arg == '--target-host=') optTargetHost = arg[i + 1];
            else if (arg == '--target-port=') optTargetPort = Util.toNumber(arg[i + 1]);
            else if (/.js$/.test(arg)) startScript = arg;
        }

        console.log('');
        console.log('Effective options:');
        console.log('  --target-host:       ' + optTargetHost);
        console.log('  --target-port:       ' + optTargetPort);
        console.log('  --debug-brk:         ' + optJsonProxyPort);
        console.log('  startScript:         ' + startScript);
        console.log('');

        SingleProcess.ins.check('127.0.0.1', optJsonProxyPort, (flag, client) => {
            if (flag === 'running') {
                client.write(startScript + "#");
                Util.log('[common]', startScript);
                setTimeout(() => {
                    client.destroy();
                }, 5000);
            }
            else {
                client.destroy();

                let thisScript = process.argv[1];
                let thisScriptPath = thisScript.substring(0, thisScript.replace('/', '\\').lastIndexOf('\\'));

                // set start script and wait other process setting
                this.v8.setStartScript(startScript);
                SingleProcess.ins.enterMutex(optJsonProxyPort, (startScript) => { this.v8.setStartScript(startScript); });

                // waiting for vstool connect
                this.clientServer = new ToolClientServer(optJsonProxyPort, (data: ClientData): number => { return this.onFromToolClientMsg(data); });
                this.clientServer.run();

                // connect to duk target server
                this.targetClient = new TargetConnection(optTargetHost, optTargetPort, (msg: DukMsg) => { this.onFromDukTargetMsg(msg); });
                this.targetClient.run();
            }
        });
    }

    private sendToTargetMsg(msg: DukMsg) {
        this.targetClient.sendMsg(msg);
    }

    private onFromToolClientMsg(data: ClientData): number {
        try {
            if (data.type == 'start') {
                this.v8.startProcess(data.client);
            }
            else if (data.type == 'close' || data.type == 'error') {
                this.resumeTargetSimulateDetach();
            }
            else if (data.type == 'data') {
                let msgs = this.v8.processRequest(data.data);
                for (let msg of msgs) {
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
    }

    private onFromDukTargetMsg(msg: DukMsg) {
        if (msg.notify === '_Connected') {
            // todo...
            // 1. 是由vs启动的，则等待5秒，如果没连上则resume
            // 2. 非vs启动，如果无vs连接，则resume
            // 3. 非vs启动，如果有vs连接，如果断点列表，则向target设置断点，再resume
        }
        else if (msg.notify === '_Error' || msg.notify === '_Disconnecting') {
            Util.log('[comm]', 'target disconnecting!');
        }
        else {
            this.sendToClientMsg(this.v8, msg);
        }
    }

    private resumeTargetSimulateDetach() {
        // clear all breakpoint from target server
        let bps = ProcessStatus.ins.toolClient.breakPoints;
        for (let i = 0, n = bps.count; i < n; i++) {
            let bp = bps.getPointByIndex(i);
            this.sendToTargetMsg({ request: 'DelBreak', args: [bp.duk_id] });
        }
        // resume target server
        this.sendToTargetMsg({ request: 'Resume' });
    }

    private sendToClientMsg(v8: V8Protocol, msg: DukMsg) {
        try {
            let rt = v8.processResponse(msg);
            if (rt == ResponseRt.Detaching) {
                this.targetClient.close();
            };
        } catch (e) {
            console.log('Failed to write JSON in writeJsonSafe, ignoring: ' + e);
        }
    }
}

new App().run();