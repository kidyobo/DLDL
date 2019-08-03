import { ToolClient } from './ToolClientServer/ToolClient'
import { V8Response } from './V8/V8Notify'

interface DukRequestNode {
    request: string;
    args?: Array<any>;
    v8Response?: V8Response;
    additional?: any;
}

class DukRequestQueue {
    private requests: Array<DukRequestNode> = [];
    clear() {
        this.requests = [];
    }
    push(req: DukRequestNode) {
        this.requests.push(req);
    }
    pop(): DukRequestNode {
        if (this.requests.length == 0)
            return null;
        let o = this.requests[0];
        this.requests.splice(0, 1);
        return o;
    }
}

export class ProcessStatus {
    private static _ins: ProcessStatus = null;
    static get ins(): ProcessStatus {
        if (this._ins == null) {
            this._ins = new ProcessStatus();
        }
        return this._ins;
    }

    private _frameIdsMapper: { [index: number]: number } = {};
    private _isRunning: boolean = false;
    private _break_point: number = 0;
    private _toolClient: ToolClient = new ToolClient(null);
    private _requestQueue = new DukRequestQueue();
    private _pausing: boolean = false;
    get requestQueue(): DukRequestQueue {
        return this._requestQueue;
    }
    get toolClient(): ToolClient {
        return this._toolClient;
    }
    set toolClient(val: ToolClient) {
        this._toolClient = (val === null) ? new ToolClient(null) : val;
    }
    get isRunning(): boolean {
        return this._isRunning;
    }
    set isRunning(val: boolean) {
        this._isRunning = val;
    }
    get breakPoint(): number {
        return this._break_point;
    }
    set breakPoint(bp: number) {
        this._break_point = bp;
    }
    get pausing(): boolean {
        return this._pausing;
    }
    set pausing(flag: boolean) {
        this._pausing = flag;
    }
    clearFrameMap() {
        this._frameIdsMapper = {};
    }
    setFrameMap(v8frame: number, dukFrame: number) {
        this._frameIdsMapper[v8frame] = dukFrame;
    }
    dukFrame(v8frame: number) {
        let dukframe = this._frameIdsMapper[v8frame];
        if (dukframe == null) {
            dukframe = 0;
        }
        return dukframe;
    }
}