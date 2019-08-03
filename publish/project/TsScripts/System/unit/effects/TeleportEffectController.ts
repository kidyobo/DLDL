import { Global as G } from "System/global";
import { GateInfo } from 'System/data/scene/GateInfo'
import { KeyWord } from 'System/constants/KeyWord'
import { TopTitleEnum } from "System/unit/TopTitle/TopTitleEnum"
import { TopTitleContainer } from "System/unit/TopTitle/TopTitleContainer"
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { Color } from 'System/utils/ColorUtil'
import { Constants } from "System/constants/Constants"
export class TeleportEffectController {
    private effectObj: UnityEngine.GameObject;
    //特效名字板
    private nameBoard: TopTitleContainer;

    protected effectAssetRequest: Game.AssetRequest;

    private tpInfo: GateInfo;

    public x: number;
    public y: number;
    private _active: boolean = true;
    private path: string = null;
    private loaded = false;

    private index: number;
    constructor(tpInfo: GateInfo) {
        this.x = tpInfo.x;
        this.y = tpInfo.y;
        this.tpInfo = tpInfo;
        let tpConfig: GameConfig.TeleportConfigM = G.DataMgr.sceneData.getTeleportConfig(tpInfo.gateID);
        this.path = tpConfig.m_szTransportEffect1;

        let pos = G.getCacheV3(G.serverPixelXToLocalPositionX(this.x), 0, G.serverPixelYToLocalPositionY(this.y));
        this.index=G.addToRangeLoader(delegate(this, this.check), pos, Constants.LoadWidth, Constants.LoadHeight);
    }

    private check(active: boolean) {
        if (this.loaded) {
            this.setActive(active);
        }
        else {
            this._active = active;
            this.loaded = true;
            this.effectAssetRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Normal1, uts.format('effect/other/{0}.prefab', this.path));
            Game.ResLoader.BeginAssetRequest(this.effectAssetRequest, delegate(this, this.afterLoadEffect));
        }
    }

    private afterLoadEffect(request: Game.AssetRequest) {
        this.effectAssetRequest = null;
        if (request.error != null) {
            uts.logWarning(request.error);
            return;
        }
        this.effectObj = request.mainAsset.Instantiate(G.EffectRoot, false);
        this.effectObj.name = 'tp_' + this.tpInfo.gateID;
        Game.ThreeDTools.PutOnNavMesh(this.effectObj.transform, G.serverPixelXToLocalPositionX(this.x), 0, G.serverPixelYToLocalPositionY(this.y));
        this.effectObj.SetActive(this._active);

        let tpConfig: GameConfig.TeleportConfigM = G.DataMgr.sceneData.getTeleportConfig(this.tpInfo.gateID);
        if (KeyWord.TRANS_NORMAL != tpConfig.m_ucType || tpConfig.m_szName == '') {
            return;
        }

        if (null == this.nameBoard) {
            this.nameBoard = new TopTitleContainer(this.effectObj.transform);
            let v3 = G.cacheVec3;
            v3.Set(0, 40 / G.CameraSetting.xMeterScale, 0);
            this.nameBoard.containerRoot.offset = v3;
            this.nameBoard.setActive(this._active);
        }
        this.nameBoard.setTextTopTitleValue(1, TextFieldUtil.getColorText(tpConfig.m_szName, Color.NAME_WHITE));
    }

    public setActive(value: boolean) {
        if (value != this._active) {
            this._active = value;
            if (this.effectObj != null) {
                this.effectObj.SetActive(value);
            }
            if (this.nameBoard != null) {
                this.nameBoard.setActive(value);
            }
        }
    }

    public destroy() {
        G.RemoveRangeLoader(this.index);
        if (null != this.effectObj) {
            UnityEngine.GameObject.Destroy(this.effectObj);
            this.effectObj = null;
        }
        
        if (null != this.nameBoard) {
            this.nameBoard.destroy(false);
            this.nameBoard = null;
        }

        if (this.effectAssetRequest != null) {
            this.effectAssetRequest.Abort();
            this.effectAssetRequest = null;
        }
    }
}
export default TeleportEffectController;