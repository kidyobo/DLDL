export class DVAL_JSON {
    static readonly EOM = { type: 'eom' };
    static readonly REQ = { type: 'req' };
    static readonly REP = { type: 'rep' };
    static readonly ERR = { type: 'err' };
    static readonly NFY = { type: 'nfy' };
}

export interface DukMsg {
    args?: Array<any>;
    request?: string;
    command?: string;
    notify?: string;
    reply?: boolean;
    error?: boolean;
}