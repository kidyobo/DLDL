import { Global as G } from 'System/global'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { DropPlanData } from 'System/data/DropPlanData'
import { QuestData } from 'System/data/QuestData'
import { ThingData } from 'System/data/thing/ThingData'
import { Color } from 'System/utils/ColorUtil'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { PropInfoVo } from 'System/data/vo/PropInfoVo'
import { ModelData } from 'System/data/ModelData'
import { BagView, EnumBagTab } from "System/bag/view/BagView"
import { DecomposeView } from "System/bag/view/DecomposeView"

export class UIUtils {
    private static nextShowGotoRongLianPanelTime: number = 30 * 1000;

    static setButtonClickAble(element: UnityEngine.GameObject, clickAble: boolean) {
        let obj = Game.UIClickListener.Get(element);
        if (obj) {
            obj.enabled = clickAble;
            UIUtils.setGrey(element, !clickAble);
        }
    }

    /**
     * 将GameObject设置或取消灰色材质。
     * @param go
     * @param isGrey
     * @param includeInactive
     */
    static setGrey(go: UnityEngine.GameObject, isGrey: boolean, includeText: boolean = false, includeInactive: boolean = false) {
        let material: UnityEngine.Material = null;

        if (isGrey) {
            material = G.MaterialMgr.greyMat;
        }

        let images: UnityEngine.UI.Image[] = go.GetComponentsInChildren(UnityEngine.UI.Image.GetType(), includeInactive) as UnityEngine.UI.Image[];
        let len = Game.ArrayHelper.GetArrayLength(images);
        for (let i: number = 0; i < len; i++) {
            let img = Game.ArrayHelper.GetArrayValue(images, i) as UnityEngine.UI.Image;
            img.material = material;
        }

        let rawImgs: UnityEngine.UI.RawImage[] = go.GetComponentsInChildren(UnityEngine.UI.RawImage.GetType(), includeInactive) as UnityEngine.UI.RawImage[];
        len = Game.ArrayHelper.GetArrayLength(rawImgs);
        for (let i: number = 0; i < len; i++) {
            let rawImg = Game.ArrayHelper.GetArrayValue(rawImgs, i) as UnityEngine.UI.RawImage;
            rawImg.material = material;
        }

        if (includeText) {
            let texts: UnityEngine.UI.Text[] = go.GetComponentsInChildren(UnityEngine.UI.Text.GetType(), includeInactive) as UnityEngine.UI.Text[];
            len = Game.ArrayHelper.GetArrayLength(texts);
            for (let i: number = 0; i < len; i++) {
                let text = Game.ArrayHelper.GetArrayValue(texts, i) as UnityEngine.UI.RawImage;
                text.material = material;
            }
        }
    }

    static setRawImageGrey(rawImg: UnityEngine.UI.RawImage, isGrey: boolean) {
        let material: UnityEngine.Material = null;

        if (isGrey) {
            material = G.MaterialMgr.greyMat;
        }
        rawImg.material = material;
    }

    /**
     * 掉落物过滤其他职业的物品
     * @param dropId	掉落ID
     * @param prof		职业 (默认表示主角)
     * @return			物品集合
     *
     */
    static getDropRewardList(dropId: number, prof: number = -1): GameConfig.DropThingM[] {
        let dropConfig: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(dropId);
        let dropThingList: GameConfig.DropThingM[] = dropConfig.m_astDropThing;
        if (dropConfig.m_ucIsDropByProf == 0) {
            return dropThingList;
        }
        if (prof == -1) {
            prof = G.DataMgr.heroData.profession;
        }
        let dataList: GameConfig.DropThingM[] = new Array<GameConfig.DropThingM>();
        let item: GameConfig.DropThingM;
        let itemCfg: GameConfig.ThingConfigM;
        for (let i: number = 0; i < dropConfig.m_ucDropThingNumber; i++) {
            item = dropThingList[i];
            if (GameIDUtil.isSpecialID(item.m_iDropID)) {
                dataList.push(dropThingList[i]);
            }
            else {
                itemCfg = ThingData.getThingConfig(dropThingList[i].m_iDropID);
                if (itemCfg.m_ucProf != KeyWord.PROFTYPE_COMMON && itemCfg.m_ucProf != prof) {
                    continue;
                }
                dataList.push(dropThingList[i]);
            }

        }
        return dataList;
    }

    /**
     * 获取添加属性
     * @param a2
     * @param a1
     * @return
     *
     */
    static getAddProp(a2: GameConfig.EquipPropAtt[], a1: GameConfig.EquipPropAtt[] = null): string[] {
        let prof: number = G.DataMgr.heroData.profession;
        if (a2 == null)
            return null;
        let datas: string[] = [];
        let value: number = 0;
        for (let i: number = 0; i < a2.length; i++) {
            let att: GameConfig.EquipPropAtt = a2[i];
            if (att.m_ucPropId <= 0)
                continue;
            if (att.m_ucPropValue != null) {
                let vo: PropInfoVo = new PropInfoVo();
                vo.id = att.m_ucPropId;
                vo.value = value = a1 == null ? att.m_ucPropValue : att.m_ucPropValue - a1[i].m_ucPropValue;
                datas.push(vo.toName(prof));
            }
        }
        return datas;
    }

    static getPropList(list: GameConfig.EquipPropAtt[], isShow: boolean = true): string[] {
        let datas: string[] = [];
        let prof: number = G.DataMgr.heroData.profession;
        for (let i: number = 0; i < list.length; i++) {
            let att: GameConfig.EquipPropAtt = list[i];
            if (att.m_ucPropId <= 0)
                continue;
            let vo: PropInfoVo = new PropInfoVo();
            vo.id = att.m_ucPropId;
            vo.value = isShow ? att.m_ucPropValue : 0;
            datas.push(vo.toName(prof));
        }
        return datas;

    }
    /**
     * 重新设置模型大小 参考BossBasePanel
     * @param obj 加载模型回掉
     * @param modelParent 模型挂载父节点
     * @param bossId 
     */
    static setModelScale(obj: UnityEngine.GameObject, modelID: string) {
        let modelCfg = ModelData.getModelConfig(modelID);
        if (null != modelCfg) {
            let t = obj.transform;
            let scale = modelCfg.m_uiScale == 0 ? 1 : modelCfg.m_uiScale / 100;
            let xOffset = modelCfg.m_xOffset / 100;
            let yOffset = modelCfg.m_yOffset / 100;
            if (scale != 1) {
                t.localScale = G.getCacheV3(scale, scale, scale);
            }
            if (xOffset != 0 || yOffset != 0) {
                t.localPosition = G.getCacheV3(xOffset, yOffset, 0);
            }
            if (modelID.indexOf('_') > -1) {
                t.localRotation = UnityEngine.Quaternion.Euler(-90,0,0);
            }
        }
    }
}