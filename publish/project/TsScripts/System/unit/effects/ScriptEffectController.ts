import { Global as G } from "System/global";
import { GateInfo } from 'System/data/scene/GateInfo'
import { KeyWord } from 'System/constants/KeyWord'
import { TopTitleEnum } from "System/unit/TopTitle/TopTitleEnum"
import { TopTitleContainer } from "System/unit/TopTitle/TopTitleContainer"
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { Color } from 'System/utils/ColorUtil'
import { Constants } from "System/constants/Constants"
export class ScriptEffectController {
    private effectObj: UnityEngine.GameObject;

    protected effectAssetRequest: Game.AssetRequest;
    private _active: boolean = true;
    public effectName: string = null;
    private position: UnityEngine.Vector3;
    private qu: UnityEngine.Quaternion;
    private scale: UnityEngine.Vector3;
    private loaded = false;
    private index: number;

    constructor(effectName: string, position: UnityEngine.Vector3, qu: UnityEngine.Quaternion, scale: UnityEngine.Vector3,factor: number = 1) {
        this.position = position;
        this.qu = qu;
        this.scale = scale;
        this.effectName = effectName;

        this.index = G.addToRangeLoader(delegate(this, this.check), this.position, Constants.LoadWidth * factor, Constants.LoadHeight * factor);
    }
    private check(active: boolean) {
        if (this.loaded) {
            this.setActive(active);
        }
        else {
            this._active = active;
            this.loaded = true;
            this.effectAssetRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Normal1, this.effectName);
            Game.ResLoader.BeginAssetRequest(this.effectAssetRequest, delegate(this, this.afterLoadEffect));
        }
    }

    private afterLoadEffect(request: Game.AssetRequest) {
        this.effectAssetRequest = null;
        if (request.error != null) {
            uts.logWarning("loadScriptEffect加载失败:" + "  error:" + request.error);
            return;
        }
        this.effectObj = request.mainAsset.Instantiate(G.EffectRoot, true);
        let transform = this.effectObj.transform;

        transform.position = this.position;
        transform.rotation = this.qu;
        if (this.scale) {
            transform.localScale = this.scale;
        }
        this.effectObj.SetActive(this._active);
    }

    public setActive(value: boolean) {
        if (value != this._active) {
            this._active = value;
            if (this.effectObj != null) {
                this.effectObj.SetActive(value);
            }
        }
    }

    public destroy() {
        G.RemoveRangeLoader(this.index);
        if (null != this.effectObj) {
            UnityEngine.GameObject.Destroy(this.effectObj);
            this.effectObj = null;
        }
        
        if (this.effectAssetRequest != null) {
            this.effectAssetRequest.Abort();
            this.effectAssetRequest = null;
        }
    }
}
export default ScriptEffectController;