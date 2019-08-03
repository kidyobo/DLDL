import { UnitCtrlType } from "System/constants/GameEnum";
import { UIUtils } from "System/utils/UIUtils";

//不同于ResLoader，该类封装了资源加载和路径等信息
export class ResourceManager {
    constructor() {
    }
    public getUnitUrlByID(unitType: UnitCtrlType, modelIdStr: string, forDisplay: boolean): string {
        if (UnitCtrlType.none == unitType || null == modelIdStr) {
            return null;
        }
        let url = "";
        if (unitType <= 0 || unitType == UnitCtrlType.hero || unitType == UnitCtrlType.role) {
            // 角色
            url = uts.format('model/hero/{0}/{0}.prefab', modelIdStr);
        } else if (unitType == UnitCtrlType.pet) {
            // 美人
            url = uts.format('model/pet/{0}/{0}.prefab', modelIdStr);
        } else if (unitType == UnitCtrlType.npc) {
            // npc
            url = uts.format('model/npc/{0}/{0}.prefab', modelIdStr);
        } else if (unitType == UnitCtrlType.monster) {
            // 怪物
            url = uts.format('model/monster/{0}/{0}.prefab', modelIdStr);
        } else if (unitType == UnitCtrlType.boss) {
            // boss
            url = uts.format('model/boss/{0}/{0}.prefab', modelIdStr);
        } else if (unitType == UnitCtrlType.collection) {
            // 采集物
            url = uts.format('model/collection/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.wing) {
            // 翅膀
            if (forDisplay) {
                modelIdStr += "b";
            }
            url = uts.format('model/wing/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.shengling) {
            // 圣灵
            if (forDisplay) {
                modelIdStr += "b";
            }
            url = uts.format('model/shengling/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.ride) {
            // 坐骑
            url = uts.format('model/ride/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.weapon) {
            // 武器
            if (forDisplay) {
                modelIdStr += "b";
            }
            url = uts.format('model/weapon/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.wuhun) {
            // 武魂，即环绕主角的龙和剑鞘
            if (forDisplay) {
                modelIdStr += "b";
            }
            url = uts.format('model/wuhun/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.zhenfa) {
            // 圣印
            if (forDisplay) {
                modelIdStr += "b";
            }
            url = uts.format('model/zhenfa/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.shenji) {
            // 真迹
            url = uts.format('model/shenji/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.shieldGod) {
            // 守护神
            url = uts.format('model/shield/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.faqi) {
            // 神盾
            if (forDisplay) {
                modelIdStr += "b";
            }
            url = uts.format('model/faqi/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.chenghao) {
            // 称号
            url = uts.format('model/chenghao/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.lingbao) {
            // 精灵
            url = uts.format('model/lingbao/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.guoyunGoods) {
            // 国运车
            url = uts.format('model/guoyun/guoyun_{0}/guoyun_{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.dropThing) {
            // 掉落物
            url = uts.format('model/dropThing/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.shengqi) {
            //宝物
            if (forDisplay) {
                modelIdStr += "b";
            }
            url = uts.format('model/shengqi/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.fenghuang) {
            //凤凰
            url = uts.format('model/fenghuang/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.anqi) {
            //暗器
            url = uts.format('model/anqi/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.hunhuan) {
            //魂环
            url = uts.format('model/hunhuan/{0}/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.buff) {
            // buff
            url = uts.format('model/buff/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.petskillUIEffect) {
            // 伙伴技能立绘
            url = uts.format('model/petskillUIEffect/{0}.prefab', modelIdStr);
        }
        else if (unitType == UnitCtrlType.anqiskillUIEffect) {
            // 暗器技能立绘
            url = uts.format('effect/anqi/{0}ef.prefab', modelIdStr);
        }
        else {
            url = modelIdStr;
        }
        return url;
    }
    /*
    加载的对象（target）必须要被持续引用着，直到不需要使用为止
    */
    public loadModel(target: UnityEngine.GameObject, unitType: UnitCtrlType, modelIdStr: string, sortingOrder: number, readConfigData: boolean = true): void {
        let url = this.getUnitUrlByID(unitType, modelIdStr, true);
        let oldData: any = (target as any).userdata;
        if (oldData != null) {
            let name = oldData.name;
            if (name == url) {
                let obj = oldData.obj as UnityEngine.GameObject;
                if (obj && unitType == UnitCtrlType.reactive) {
                    obj.SetActive(false);
                    obj.SetActive(true);
                }
                else if (obj) {
                    if (!obj.activeSelf) {
                        obj.SetActive(true);
                    }
                }
                return;
            }
            let request = oldData.request;
            if (request) {
                request.Abort();
                oldData.request = null;
            }
            let obj = oldData.obj;
            if (obj) {
                UnityEngine.GameObject.Destroy(obj);
                oldData.obj = null;
            }
        }
        if (url != null) {
            let request = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Normal1, url);
            let data: any = {};
            data.request = request;
            data.name = url;
            (target as any).userdata = data;
            Game.ResLoader.BeginAssetRequest(request, delegate(this, this.onLoadModel, target, sortingOrder, readConfigData ? modelIdStr : null, data));
        }
        else {
            (target as any).userdata = null;
        }
    }
    private onLoadModel(assetRequest: Game.AssetRequest, target: UnityEngine.GameObject, sortingOrder: number, modelIdStr: string, data) {
        data.request = null;
        if (assetRequest.error != null) {
            uts.logWarning("loadModel加载失败:" + "  error:" + assetRequest.error);
            return;
        }
        if (target.Equals(null)) {
            return;
        }
        //重新将子节点绑定
        let imageObj = assetRequest.mainAsset.Instantiate(target.transform, false);
        if (sortingOrder > 0) {
            Game.Tools.SetSortingOrder(imageObj, sortingOrder);
        }
        let layer = target.layer;
        if (layer > 0) {
            Game.Tools.SetRendererLayer(imageObj, layer);
        }
        if (modelIdStr != null) {
            UIUtils.setModelScale(imageObj, modelIdStr);
        }
        data.obj = imageObj;
    }
    /*
    加载的对象（target）必须要被持续引用着，直到不需要使用为止
    */
    public loadIcon(target: UnityEngine.UI.RawImage, iconPath: string, defaultIconStyle: number = -1): void {

        this.loadImage(target, iconPath == null ? null : uts.format('icon/{0}.png', iconPath), defaultIconStyle);
    }
    /*
    加载的对象（target）必须要被持续引用着，直到不需要使用为止
    */
    public loadImage(target: UnityEngine.UI.RawImage, imgPath: string, defaultIconStyle: number = -1): void {
        if (target == null || target.Equals(null)) {
            uts.logWarning('RawImage not exist: ' + imgPath);
            return;
        }
        let gameObject = target.gameObject;
        let oldData: any = (target as any).userdata;
        if (oldData != null) {
            let name = oldData.name;
            if (name == imgPath) {
                return;
            }
            let request = oldData.request;
            if (request != null)
                request.Abort();
            let asset = oldData.asset as Game.Asset;
            if (asset != null) {
                asset.RemoveLinkObject(gameObject);
            }
        }
        if (imgPath != null) {
            //设置默认Icon
            //defaultIconStyle
            let request: Game.AssetRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Normal1, imgPath);
            let data: any = {};
            data.request = request;
            data.name = imgPath;
            (target as any).userdata = data;
            Game.ResLoader.BeginAssetRequest(request, delegate(this, this.onLoadImage, target, data, gameObject));
            if (!request.isDone) {
                target.enabled = false;
            }
        }
        else {
            target.enabled = false;
            (target as any).userdata = null;
        }
    }
    private onLoadImage(assetRequest: Game.AssetRequest, target: UnityEngine.UI.RawImage, data, gameObject) {
        data.request = null;
        if (assetRequest.error != null) {
            uts.logWarning("loadImage加载失败:" + "  error:" + assetRequest.error);
            return;
        }
        if (gameObject.Equals(null)) {
            return;
        }
        //重新将子节点绑定
        let asset = assetRequest.mainAsset;
        if (!asset) {
            let s = 'RES::onLoadImage ';
            if (assetRequest.ToString != null) {
                s += ' obj.name = ' + assetRequest.ToString();
            }
            s += ' keylist = ';
            for (let k in assetRequest) {
                s += k + ',';
            }
            let argLen = arguments.length;
            s += ' arglen = ' + argLen;
            for (let i = 0, n = argLen; i < n; i++) {
                let arg = arguments[i];
                for (let k in arg) {
                    s += k + ',';
                }
            }
            uts.bugReport(s);
        }
        asset.AddLinkObject(gameObject);
        data.asset = asset;
        target.texture = asset.texture;
        target.enabled = true;
    }
}
export default ResourceManager;