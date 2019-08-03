import net = require("net");
import fs = require('fs');
import { ScriptsMgr } from '../ScriptsMgr';
import { Util } from '../Util';
import { DukMsg } from '../TargetConnection/Common'
import { RequestDataCombiner } from './RequestDataCombiner'
import { ResponseDataPacker } from './ResponseDataPacker'
import { RequestProcessor } from './RequestProcessor'
import { ProcessStatus } from '../ProcessStatus'
import { WrapperUtil } from './WrapperUtil'
import * as vn from './V8Notify'
import { ToolClient } from '../ToolClientServer/ToolClient'

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

let MAX_FRAMES = 10;
enum NotifyStatusArgs {
    break,
    script,
    function,
    line,
    pc,
}

enum NodeExpressionType {
    None = 0,
    Property = 0x1,
    Function = 0x2,
    Boolean = 0x4,
    Private = 0x8,
    Expandable = 0x10,
    ReadOnly = 0x20,
    String = 0x40
}

enum NodePropertyType {
    Normal = 0,
    Field = 1,
    Constant = 2,
    Callbacks = 3,
    Handler = 4,
    Interceptor = 5,
    Transition = 6,
    Nonexistent = 7
}

export enum ResponseRt {
    Ok = 0,
    UnknowScript = -1,
    Detaching = -2,
    RequestAndReplyNotInPair = -3,
}

export class V8Protocol {
    private requestDataCombiner: RequestDataCombiner = new RequestDataCombiner();
    private responseDataPacker: ResponseDataPacker = new ResponseDataPacker();
    private requestProcessor: RequestProcessor = new RequestProcessor();
    private client: ToolClient = null;
    private startScript = '';

    setStartScript(startScript: string) {
        startScript = startScript.replace(/\//g, '\\');
        this.startScript = startScript.substr(0, startScript.lastIndexOf('\\'));
    }

    /**
     * set debug-client-tool socket, and start script files
     * @param s
     */
    startProcess(client: ToolClient) {
        this.requestDataCombiner.clear();
        this.responseDataPacker.clear();
        this.client = client;
        this.tryInitScripts();
        this.responseVersion();
    }

    private tryInitScripts() {
        if (this.startScript != '') {
            Util.log('[common]', this.startScript);
            ScriptsMgr.initScripts(this.startScript);
        }
        else {
            setTimeout(() => {
                this.tryInitScripts();
            }, 500);
        }
    }

    /**
     * recv data from debug-client-tool, pre process, return target Server need json
     * convert v8 protocol -> duk json protocol
     * @param data
     */
    processRequest(data): Array<DukMsg> {
        let dukmsgs = new Array<DukMsg>();
        let requests = this.requestDataCombiner.combine(data);
        for (let request of requests) {
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

                let rt = this.requestProcessor.handle(request);
                for (let d of rt.dukMsgs) {
                    dukmsgs.push(d);
                }

                for (let evt of rt.events) {
                    this.client.send(this.responseDataPacker.pack(evt));
                }

                if (rt.response) {
                    this.client.send(this.responseDataPacker.pack(rt.response));
                }
            }
            catch (e) {
                let response = new vn.ExceptionResponse(request);
                response.success = false;
                response.message = e.toString();
                this.client.send(this.responseDataPacker.pack(response));
                console.log(e.stack || e);
            }
        }
        return dukmsgs;
    }

    /**
     * targetServer send msg to debug-client-tool
     * convert duk protocol -> v8 protocol
     * @param msg
     */
    processResponse(msg: DukMsg): ResponseRt {
        Util.log('[t->s]', JSON.stringify(msg));
        if (msg.notify === 'Status' && msg.args) {
            ProcessStatus.ins.isRunning = msg.args[NotifyStatusArgs.break] == 0;
            if (!ProcessStatus.ins.isRunning && !ProcessStatus.ins.pausing) {
                let shortname = msg.args[NotifyStatusArgs.script];
                if (typeof (shortname) === 'object') {
                    shortname = ScriptsMgr.getScriptShortName(1);
                }

                let line = msg.args[NotifyStatusArgs.line];
                if (line == 0) line = 1;

                let script = ScriptsMgr.makeFullPath(shortname);
                if (!ScriptsMgr.hasScript(script)) {
                    Util.log('[error]', 'no find script :' + script);
                    return ResponseRt.UnknowScript;
                }
                let breakEvent = new vn.BreakEvent(WrapperUtil.dukLineToV8Line(line), 0, script);
                this.client.send(this.responseDataPacker.pack(breakEvent));
            }
        }
        else if (msg.notify === 'Detaching') {
            if (msg.args && msg.args.length > 0)
                Util.log('[common]', 'Detaching reason:' + msg.args[0]);
            return ResponseRt.Detaching;
        }
        else if (!Util.isUndefined(msg.reply) || !Util.isUndefined(msg.error)) {
            let req = ProcessStatus.ins.requestQueue.pop();
            if (req == null) {
                Util.log('[error]', 'duk request and reply not in pairs!');
                return ResponseRt.RequestAndReplyNotInPair;
            }

            if (req.request === 'AddBreak') {
                let dukbpid = msg.args[0];
                let response = req.v8Response as vn.SetBreakPointResponse;
                ProcessStatus.ins.toolClient.breakPoints.bindPoint(response.breakPoint, msg.reply ? dukbpid : -1);
            }
            else if (req.request === 'DelBreak') {
                //let response = req.v8Response as vn.ClearBreakPointResponse;
            }
            else if (req.request === 'GetCallStack') {
                let response = req.v8Response as vn.BacktraceResponse;
                if (msg.reply)
                    response.addFrames(msg.args);
            }
            else if (req.request === 'GetLocals') {
                let v8frameidx = - 1 - req.args[0];
                let response = req.v8Response as vn.BacktraceResponse;
                if (msg.reply)
                    response.addLocals(msg.args);
                if (v8frameidx === MAX_FRAMES - 1) {
                    response.combine();
                    this.client.send(this.responseDataPacker.pack(response));
                }
            }
            else if (req.request === 'Eval') {
                let response = req.v8Response as vn.EvaluateResponse;
                if (!msg.reply || msg.args[0] === 1)
                    response.error(msg.reply ? msg.args[1] : 'ReferenceError: ' + response.varName + ' is not defined');
                else
                    response.combine(msg.args[1]);
                this.client.send(this.responseDataPacker.pack(response));
            }
            else if (req.request === 'GetObjPropDescRange') {
                let response = req.v8Response as vn.LookupResponse;
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
    }

    private responseVersion() {
        let head = 'Type: connect\r\nUts-Debugger-Version: 0.1\r\nContent-Length: 0\r\n\r\n';
        Util.log('[s->c]', head);
        this.client.send(head);
    }
}

