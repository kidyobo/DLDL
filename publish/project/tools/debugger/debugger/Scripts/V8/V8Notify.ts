import { ProcessStatus } from '../ProcessStatus'
import { ValueRef } from '../ToolClientServer/FrameValueRefs'
import { ScriptsMgr } from '../ScriptsMgr'
import { WrapperUtil } from './WrapperUtil'
import { Util } from '../Util'


let ONEFRAMEARGS_COUNT = 4;
enum BreakFrameArgs {
    script,
    function,
    line,
    pc,
}

let ONEPROPDESCARGS_COUNT = 3;
enum PropDescArgs {
    flag,
    name,
    value,
}

export class V8Notify {
    protected static next_response_seq = 0;
    protected seq = 0;
    protected type = '';
    protected command = undefined;
    public success = true;
    public message = undefined;
    public body = undefined;
    public error_details = undefined;
    protected refs = [];
    public running = false;
    public islog = true;

    constructor() {
        this.seq = V8Notify.next_response_seq++;
        this.running = ProcessStatus.ins.isRunning;
    }
    toJSONString(): string {
        return "";
    }
}

export class V8Response extends V8Notify {
    protected type = 'response';
    public request_seq = 0;
    constructor(request) {
        super();
        this.request_seq = request.seq;
        this.command = request.command;
    }
    failed(err: string) {
    }
    toJSONString(): string {
        let res = {
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
        }
        return JSON.stringify(res);
    }
}

export class ScriptsResponse extends V8Response {
    constructor(request) {
        super(request);
        this.running = false;
        this.success = true;
        this.islog = false;
        this.refs = [];
        this.body = ScriptsMgr.getScripts();
    }
}

export class BacktraceResponse extends V8Response {
    private rawFrames: Array<any> = [];
    private rawLocals: Array<any> = [];
    constructor(request) {
        super(request);
    }
    addFrames(args: Array<any>) {
        this.rawFrames = args;
    }
    addLocals(args: Array<any>) {
        if (Util.isUndefined(args)) return;
        this.rawLocals.push(args);
    }
    combine() {
        this.success = true;
        this.running = false;
        if (this.rawFrames === null || this.rawLocals === null) {
            this.default();
            return;
        }

        ProcessStatus.ins.clearFrameMap();
        let frameCount = this.rawFrames.length / ONEFRAMEARGS_COUNT;
        let frames = [];
        for (let frameidx = 0, v8frame = 0; frameidx < frameCount; frameidx++) {
            let script = this.rawFrames[frameidx * ONEFRAMEARGS_COUNT + BreakFrameArgs.script];
            let fun = this.rawFrames[frameidx * ONEFRAMEARGS_COUNT + BreakFrameArgs.function];
            let line = WrapperUtil.dukLineToV8Line(this.rawFrames[frameidx * ONEFRAMEARGS_COUNT + BreakFrameArgs.line]);
            let frame = { type: "frame", index: v8frame, line: line, column: 0, func: { scriptId: -1, name: "" }, arguments: [], locals: [] };

            frame.func.scriptId = ScriptsMgr.getScriptId(ScriptsMgr.makeFullPath(script));
            if (frame.func.scriptId < 0)
                continue;

            ProcessStatus.ins.setFrameMap(v8frame++, -(frameidx + 1));
            frame.func.name = fun;

            let locals = [];
            let curframeLocals = this.rawLocals[frameidx];
            if (curframeLocals) {
                for (let varidx = 0, n = (curframeLocals.length / 2); varidx < n; varidx++) {
                    let varname = curframeLocals[2 * varidx + 0];
                    let varval = curframeLocals[2 * varidx + 1];
                    let varobj = WrapperUtil.makeV8LocalVar(v8frame, varname, varname, varval);
                    locals.push(varobj);
                }
            }
            frame.locals = locals;
            frames.push(frame);
        }
        this.body = { fromFrame: 0, toFrame: frames.length, totalFrames: frames.length, frames: frames };

        let refsset = {};
        let refs = [];
        for (let i = 0; i < frames.length; i++) {
            let scriptId = frames[i].func.scriptId;
            let scriptobj = ScriptsMgr.getScriptById(scriptId);
            if (scriptobj != null && !refsset[scriptId]) {
                refsset[scriptId] = true;
                refs.push(scriptobj);
            }
        }
        this.refs = refs;
    }

    private default() {
        this.body = {
            fromFrame: 0, toFrame: 1, totalFrames: 1,
            frames: [{ type: "frame", index: 0, line: 0, column: 0, func: { scriptId: 1 }, arguments: [], locals: [] }]
        };
        this.refs = [ScriptsMgr.getScriptById(1)];
    }
}

export class ContinueResponse extends V8Response {
    constructor(request) {
        super(request);
        this.body = undefined;
        this.refs = undefined;
        this.success = true;
        this.running = true;
    }
}

export class SetBreakPointResponse extends V8Response {
    private _breakPoint: number = -1;
    constructor(request) {
        super(request);
        this.success = true;
        this.running = true;
        this.refs = [];

        let args = request.arguments;
        let nb = ProcessStatus.ins.toolClient.breakPoints.addPoint(args.target, args.line, args.column, args.condition);
        this.body = nb.toJSON();
        this._breakPoint = nb.id;
    }
    get breakPoint(): number {
        return this._breakPoint;
    }
}

export class ChangeBreakPointResponse extends V8Response {
    constructor(request) {
        super(request);
        this.success = true;
        this.running = true;
        this.refs = undefined;
        this.body = undefined;
    }
}

export class ClearBreakPointResponse extends V8Response {
    constructor(request) {
        super(request);
        this.success = true;
        this.running = true;
        this.refs = undefined;
        this.body = { breakpoints: [request.arguments.breakpoint] };
    }
}

export class SuspendResponse extends V8Response {
    constructor(request) {
        super(request);
        this.success = true;
        this.running = false;
        this.refs = undefined;
        this.body = undefined;
    }
}

export class EvaluateResponse extends V8Response {
    private _exp: string = null;
    private _v8frame: number = -1;
    constructor(request) {
        super(request);
        this._exp = request.arguments.expression;
        this._v8frame = request.arguments.frame;
    }
    get varName(): string {
        return this._exp;
    }
    error(message: string) {
        this.message = message;
        this.success = false;
        this.running = ProcessStatus.ins.isRunning;
        this.body = undefined;
        this.refs = undefined;
    }
    combine(varval: any) {
        this.refs = [];
        this.running = ProcessStatus.ins.isRunning;
        let varobj = WrapperUtil.makeV8EvalVar(this._v8frame, this.varName, this.varName, varval);
        this.body = varobj;
    }
}

export class LookupResponse extends V8Response {
    private _varCount: number = 0;
    private varList: Array<{ refobj: ValueRef, descs: any }> = [];
    constructor(request) {
        super(request);
    }
    set varCount(val: number) {
        this._varCount = val;
    }
    addVarVal(refobj: ValueRef, descs: any) {
        this.varList.push({ refobj: refobj, descs: descs });
    }
    get isComplete(): boolean {
        return this.varList.length == this._varCount;
    }
    combine() {
        this.body = {};
        for (let node of this.varList) {
            this.body[node.refobj.ref] = { handle: node.refobj.ref, type: node.refobj.obj.type, className: node.refobj.obj.className };
            let properties = [];
            for (let i = 0, ds = node.descs; i < ds.length / ONEPROPDESCARGS_COUNT; i++) {
                let flag = ds[i * ONEPROPDESCARGS_COUNT + PropDescArgs.flag];
                let name = ds[i * ONEPROPDESCARGS_COUNT + PropDescArgs.name];
                let value = ds[i * ONEPROPDESCARGS_COUNT + PropDescArgs.value];
                if (!(/^[\w\.]+$/.test(name))) continue;
                let varobj = WrapperUtil.makeV8LookupVar(node.refobj.frameidx, name, node.refobj.name + '.' + name, value);
                properties.push(varobj);
            }
            this.body[node.refobj.ref].properties = properties;
        }
    }
}

export class ExceptionResponse extends V8Response {
    constructor(request) {
        super(request);
    }
}

export class V8Event extends V8Notify {
    protected type = 'event';
    protected event = '';
    toJSONString(): string {
        let res = {
            seq: this.seq,
            type: this.type,
            event: this.event,
            success: this.success,
            running: this.running,
            body: this.body,
            refs: this.refs,
        }
        return JSON.stringify(res);
    }
}

export class BreakEvent extends V8Event {
    protected event = 'break';
    constructor(line: number, col: number, script: string) {
        super();
        this.success = undefined;
        this.running = undefined;
        this.refs = undefined;
        let scriptObj = ScriptsMgr.getScript(script);
        if (scriptObj === null) {
            Util.log('[error]', 'in BreakEvent error!');
        }
        let id = ProcessStatus.ins.toolClient.breakPoints.findPointId(line, col, scriptObj.id);
        if (id < 0) {
            id = ProcessStatus.ins.toolClient.breakPoints.addVirtualPoint(line, col, scriptObj.id).id;
        }
        ProcessStatus.ins.breakPoint = id;
        this.body = { sourceLine: line, sourceColumn: col, script: ScriptsMgr.getScript(script), breakpoints: [id] };
    }
}

export class ExceptionEvent extends V8Event {
    protected event = 'exception';
    constructor() {
        super();
        this.success = undefined;
        this.running = undefined;

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
}
