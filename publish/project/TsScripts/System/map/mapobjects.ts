import { MapCameraSetting as CameraSetting } from "System/map/mapCameraSetting";
import { Global as G } from "System/global";
interface MapObjectCfg {
    path: string;
    pos: [number, number, number];
    scale: [number, number, number];
    rot: [number, number, number, number];
}
interface MapObjectsCfg {
    ver: number;
    objects: Array<MapObjectCfg>;
}

export class MapObjects {
    private objectsPathPatt: string = 'map/config/{0}/objects.bytes';
    private mapId: number;
    private cfg: MapObjectsCfg;
    private request: Game.AssetRequest;
    load(mapid: number) {
        this.mapId = mapid;
        let path = uts.format(this.objectsPathPatt, this.mapId);
        if (Game.ResLoader.Exist(path)) {
            this.request = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Low1, path);
            Game.ResLoader.BeginAssetRequest(this.request, delegate(this, this.onLoadConfig));
        }
    }

    unLoad() {
        if (this.request) {
            this.request.Abort();
            this.request = null;
        }
    }
    private onLoadConfig(assetRequest: Game.AssetRequest, caller) {
        if (assetRequest.error != null) {
            uts.logWarning("loadConfig加载失败:" + "  error:" + assetRequest.error);
            return;
        }
        var str=assetRequest.mainAsset.textAsset.text;
        if (str == null || str == '')
            return;
        this.cfg = JSON.parse(str);
        let len = this.cfg.objects.length;
        for (let i = 0; i < len; i++) {
            let objinfo = this.cfg.objects[i];
            G.UnitMgr.processScriptEffect(objinfo.path, new UnityEngine.Vector3(objinfo.pos[0], objinfo.pos[1], objinfo.pos[2]), new UnityEngine.Quaternion(objinfo.rot[0], objinfo.rot[1], objinfo.rot[2], objinfo.rot[3])
                , new UnityEngine.Vector3(objinfo.scale[0], objinfo.scale[1], objinfo.scale[2]), true);
        }
    }
}