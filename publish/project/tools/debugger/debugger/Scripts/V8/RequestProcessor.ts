import { ProcessStatus } from '../ProcessStatus'
import { WrapperUtil } from './WrapperUtil'
import { DukMsg } from '../TargetConnection/Common'
import { ScriptsMgr } from '../ScriptsMgr'
import { Util } from '../Util';
import * as vn from './V8Notify'

let MAX_FRAMES = 10; // bug...

export class RequestProcessor {
    private handlers: { [index: string]: RequestHandler } = null;
    constructor() {
        this.regHandlers();
    }

    handle(request): RequestHdrRt {
        let key = request.command.toLowerCase();
        let handler = this.handlers[key];
        if (handler) {
            return handler.handle(request);
        }
        else {
            throw new Error('Unknown command "' + request.command + '" in request');
        }
    }

    private regHandlers() {
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
    }
}


interface RequestHdrRt {
    dukMsgs: DukMsg[];
    events: vn.V8Event[];
    response: vn.V8Response;
}

class RequestHandler {
    static get emptyRt(): RequestHdrRt {
        return { dukMsgs: [], events: [], response: null };
    }
    handle(request): RequestHdrRt {
        return null;
    }
}

class SuspendRequestHandler extends RequestHandler {
    handle(request): RequestHdrRt {
        let rt = RequestHandler.emptyRt;
        rt.response = new vn.SuspendResponse(request);
        let cmd = 'Pause';
        rt.dukMsgs.push({ request: cmd });
        ProcessStatus.ins.requestQueue.push({ request: cmd });
        ProcessStatus.ins.pausing = true;
        return rt;
    }
}

class ContinueRequestHandler extends RequestHandler {
    handle(request): RequestHdrRt {
        let rt = RequestHandler.emptyRt;
        rt.response = new vn.ContinueResponse(request);

        let args = request.arguments;
        let stepaction = (args && args.stepaction) ? args.stepaction : '';
        let stepcount = (args && args.stepcount) ? args.stepcount : 1;
        let stepmapnames = { 'in': 'StepInto', 'next': 'StepOver', 'out': 'StepOut' };
        let dukaction = stepmapnames[stepaction];
        if (dukaction) {
            for (let i = 0; i < stepcount; i++) {
                rt.dukMsgs.push({ request: dukaction });
                ProcessStatus.ins.requestQueue.push({ request: dukaction });
            }
        }
        else {
            let cmd = 'Resume';
            rt.dukMsgs.push({ request: cmd });
            ProcessStatus.ins.requestQueue.push({ request: cmd });
        }
        ProcessStatus.ins.pausing = false;

        return rt;
    }
}

class SetBreakPointRequestHandler extends RequestHandler {
    handle(request): RequestHdrRt {
        let rt = RequestHandler.emptyRt;
        rt.response = new vn.SetBreakPointResponse(request);

        let args = request.arguments;
        let dukLine = WrapperUtil.v8LineToDukLine(args.line);
        let cmd = 'AddBreak';
        rt.dukMsgs.push({ request: cmd, args: [ScriptsMgr.getScriptShortName(args.target), dukLine] });
        ProcessStatus.ins.requestQueue.push({ request: cmd, v8Response: rt.response });

        return rt;
    }
}

class ChangeBreakPointRequestHandler extends RequestHandler {
    handle(request): RequestHdrRt {
        let rt = RequestHandler.emptyRt;
        let bkp = ProcessStatus.ins.toolClient.breakPoints.getPoint(request.arguments.breakpoint);
        if (bkp == null)
            return rt;

        bkp.ignoreCount = request.arguments.ignoreCount ? request.arguments.ignoreCount : 0;
        bkp.condition = request.arguments.condition ? request.arguments.condition : '';
        bkp.enabled = request.arguments.enabled ? request.arguments.enabled : false;

        //need do  -- disable , enable
        rt.response = new vn.ChangeBreakPointResponse(request)

        return rt;
    }
}

class ClearBreakPointRequestHandler extends RequestHandler {
    handle(request): RequestHdrRt {
        let rt = RequestHandler.emptyRt;
        rt.response = new vn.ClearBreakPointResponse(request);

        let bp = ProcessStatus.ins.toolClient.breakPoints.getPoint(request.arguments.breakpoint);
        if (bp === null) {
            Util.log('[error]', 'error in ClearBreakPointResponse, not find bp:' + request.arguments.breakpoint);
            return rt;
        }
        let cmd = 'DelBreak';
        rt.dukMsgs.push({ request: cmd, args: [bp.duk_id] });
        ProcessStatus.ins.requestQueue.push({ request: cmd, v8Response: rt.response });
        ProcessStatus.ins.toolClient.breakPoints.clearPoint(rt.response.body.breakpoints[0]);

        return rt;
    }
}

class DisconnectRequestHandler extends RequestHandler {
}

class SetExceptionBreakRequestHandler extends RequestHandler {
}

class ListBreakpointsRequestHandler extends RequestHandler {
}

class BacktraceRequestHandler extends RequestHandler {
    handle(request): RequestHdrRt {
        let rt = RequestHandler.emptyRt;
        let response = new vn.BacktraceResponse(request);

        rt.dukMsgs.push({ request: "GetCallStack" });
        for (let i = 0; i < MAX_FRAMES; i++) {
            rt.dukMsgs.push({ request: "GetLocals", args: [-(i + 1)] });
        }
        for (let d of rt.dukMsgs) {
            ProcessStatus.ins.requestQueue.push({ request: d.request, args: d.args, v8Response: response });
        }

        return rt;
    }
}

class SetVariableValueRequestHandler extends RequestHandler {
}

class EvaluateRequestHandler extends RequestHandler {
    handle(request): RequestHdrRt {
        let rt = RequestHandler.emptyRt;
        let response = new vn.EvaluateResponse(request);

        let exp = request.arguments.expression;
        let v8frame = request.arguments.frame;
        let isglobal = request.arguments.global;
        let dukframe = ProcessStatus.ins.dukFrame(v8frame);
        let cmd = 'Eval';
        rt.dukMsgs.push({ request: cmd, args: [exp, dukframe] });
        ProcessStatus.ins.requestQueue.push({ request: cmd, v8Response: response });

        return rt;
    }
}

class LookupRequestHandler extends RequestHandler {
    handle(request): RequestHdrRt {
        let rt = RequestHandler.emptyRt;
        let response = new vn.LookupResponse(request);

        for (let varref of request.arguments.handles) {
            let refobj = ProcessStatus.ins.toolClient.frameValueRefs.getObjectByRef(varref);
            if (!refobj) {
                Util.log('[error]', 'cannot find refobj:' + varref);
                continue;
            }
            if (typeof (refobj.obj) !== 'object') {
                Util.log('[error]', 'the refobj must is object:' + refobj);
                continue;
            }

            let cmd = 'GetObjPropDescRange';
            rt.dukMsgs.push({ request: cmd, args: [refobj.obj, 0, 0x7fffffff] });
            ProcessStatus.ins.requestQueue.push({ request: cmd, v8Response: response, additional: refobj });
        }

        (response as vn.LookupResponse).varCount = rt.dukMsgs.length;

        return rt;
    }
}

class ChangeLiveRequestHandler extends RequestHandler {
}

class ScriptsRequestHandler extends RequestHandler {
    handle(request): RequestHdrRt {
        let rt = RequestHandler.emptyRt;
        rt.response = new vn.ScriptsResponse(request);
        return rt;
    }
}