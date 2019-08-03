export class DRManager {
    private _recvObjects = {};
    private _sendObjects = {};
    constructor() {
        let asset = Game.ResLoader.LoadAsset('net/ss.bytes');
        Game.DataR.release();
        let rt = Game.DataR.init(uts.bytes2lstr(asset.textAsset.bytes), 0xffff);
        asset.ReleaseImmediate(false);
        if (rt != 0) {
            uts.bugReport('load ss.bytes failed:' + rt);
        }
        uts.log('load ss.bytes ok!');
    }
    unpack(buf: any, buflen: number, obj: {}): number {
        return Game.DataR.unpack(buf, buflen, obj);
    }
    pack(obj: {}): number {
        return Game.DataR.pack(obj);
    }
    packBuf(): any {
        return Game.DataR.packBuf();
    }
    error(): string {
        return Game.DataR.getError();
    }
    msgid(buf: any, buflen: number) {
        return Game.DataR.cmdId(buf, buflen);
    }
    release() {
        Game.DataR.release();
    }
    getRecvObject(cmdid: number) {
        let obj = this._recvObjects[cmdid];
        if (obj == null) {
            obj = {};
            this._recvObjects[cmdid] = obj;
        }
        return obj;
    }
    getSendObject(cmdid: number) {
        let obj = this._sendObjects[cmdid];
        return obj;
    }
    saveSendObject(cmdid: number, obj: any) {
        this._sendObjects[cmdid] = obj;
    }
}