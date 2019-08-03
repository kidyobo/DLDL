import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { List, ListItem } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { KaifuSignItemData } from 'System/data/vo/KaifuSignItemData'
import { UIUtils } from 'System/utils/UIUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { GameIDType } from 'System/constants/GameEnum'
import { ThingData } from 'System/data/thing/ThingData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { WingEquipSelectView } from 'System/Merge/WingEquipSelectView'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { GameIDUtil } from "System/utils/GameIDUtil"
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { UIEffect, EffectType } from 'System/uiEffect/UIEffect'
import { FightingStrengthUtil } from "System/utils/FightingStrengthUtil"
import { UnitCtrlType } from 'System/constants/GameEnum'
import { FixedList } from "System/uilib/FixedList"
import { RegExpUtil } from "System/utils/RegExpUtil";
import { GameObjectGetSet, TextGetSet } from 'System/uilib/CommonForm';

class WingEquipMergeData {
    isWingEquip: boolean = false;
    materialData: MaterialItemData;
    bagData: ThingItemData;
    need: number = 0;
}

export class WingEquipMergePanel extends TabSubForm {

    /**合成结果最多6  个*/
    private readonly Result_MAX_Num = 6;
    private readonly Material_Max_Num = 2;
    /**预览1 10 16  3个等级*/
    private readonly Prevview_Lv_Arr: number[] = [1, 10, 15];

    private readonly OneColorMaxLv: number[] = [6, 14, 25];

    private list: List;
    private itemIcon_Normal: UnityEngine.GameObject;
    private txtTips: UnityEngine.UI.Text;
    private btnMerge: UnityEngine.GameObject;
    private btnPutIn: UnityEngine.GameObject;

    private resultList: FixedList = null;
    private resultListIconItems: IconItem[] = new Array<IconItem>();
    //private resultRoot: UnityEngine.GameObject;
    private materialRoot: UnityEngine.GameObject;


    private locks: UnityEngine.GameObject[] = [];
    private effectRoots: UnityEngine.GameObject[] = [];
    private materialIconItems: IconItem[] = [];
    private txtDesArr: UnityEngine.UI.Text[] = [];

    private selectIndex: number = 0;
    private selectCfg: GameConfig.WingCreateM;

    private thingListA: Protocol.ContainerThing = {} as Protocol.ContainerThing;
    private thingListB: Protocol.ContainerThing = {} as Protocol.ContainerThing;
    private thingListC: Protocol.ContainerThing = {} as Protocol.ContainerThing;

    private WingEquipMergeData: WingEquipMergeData[];

    //特效成功
    private hecjiemian: UnityEngine.GameObject;
    private effectRoot: UnityEngine.GameObject;
    private mergeUIEffect: UIEffect;
    //private text: UnityEngine.GameObject
    //private text1: UnityEngine.UI.Text;

    //新增右侧合成翅膀信息
    private txtWingName: UnityEngine.UI.Text;
    private wingModelRoot: UnityEngine.GameObject;
    private listWingBaseInfo: List;
    private txtWingGetInfo: UnityEngine.UI.Text;
    /**上一次的模型id*/
    private oldModelId: number = 0;
    private txtProf: TextGetSet;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_MERGE_WING);
    }

    protected resPath(): string {
        return UIPathData.WingEquipMergePanel;
    }


    protected initElements() {
        this.list = this.elems.getUIList("list");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.txtTips = this.elems.getText("txtTips");
        this.btnMerge = this.elems.getElement("btnMerge");
        this.btnPutIn = this.elems.getElement("btnPutIn");
        //this.text = this.elems.getElement("Text");
        //this.text.SetActive(false);
        //this.text1 = this.elems.getText("Text1");
        this.resultList = this.elems.getUIFixedList("resultList");
        //this.resultRoot = this.elems.getElement("resultRoot");


        this.materialRoot = this.elems.getElement("materialRoot");
        for (let i = 0; i < this.Material_Max_Num; i++) {
            let item = ElemFinder.findObject(this.materialRoot, "item" + i + "/icon");
            let iconItem = new IconItem();
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, item);
            this.materialIconItems.push(iconItem);

            let lock = ElemFinder.findObject(this.materialRoot, "item" + i + "/lock");
            this.locks.push(lock);

            let text = ElemFinder.findText(this.materialRoot, "item" + i + "/txtDes");
            this.txtDesArr.push(text);

            let effectRoot = ElemFinder.findObject(this.materialRoot, "item" + i + "/effectRoot");
            effectRoot.SetActive(false);
            this.effectRoots.push(effectRoot);

            Game.UIClickListener.Get(item).onClick = delegate(this, this.onClickIcon, i);
        }

        this.wingModelRoot = this.elems.getElement("modelRoot");
        this.txtWingName = this.elems.getText("txtName");
        this.listWingBaseInfo = this.elems.getUIList("baseList");
        this.txtWingGetInfo = this.elems.getText("getInfo");

        this.effectRoot = this.elems.getElement("effectRoot");
        this.hecjiemian = this.elems.getElement("hecjiemian");
        this.mergeUIEffect = new UIEffect();
        this.mergeUIEffect.setEffectPrefab(this.hecjiemian, this.effectRoot);

        this.txtProf = new TextGetSet(this.elems.getText("txtProf"));

    }

    protected initListeners() {
        this.addListClickListener(this.list, this.onClickListItem);
        this.addClickListener(this.btnMerge, this.onClickMerge);
        this.addClickListener(this.btnPutIn, this.onClickPutIn);
        this.addClickListener(this.elems.getElement("btnRule"), this.onClickRule);
        this.resultList.onClickItem = delegate(this, this.onClickResultList);
    }

    private onClickRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(470), '玩法规则');
    }

    private onClickResultList(index: number) {
        let len = this.selectCfg.m_astProduct.length;
        let prevLen = this.Prevview_Lv_Arr.length;
        //取012 3个索引位
        let lvIndex = index % prevLen;
        let thingIndex = Math.floor(index / prevLen);
        if (thingIndex < len) {
            let data = this.selectCfg.m_astProduct[thingIndex];
            let cfg = G.DataMgr.equipStrengthenData.getWingStrengthCfg(data.m_iCreateWingId, this.OneColorMaxLv[lvIndex]);
            if (cfg) {
                if (cfg.m_iModelID != this.oldModelId) {
                    this.oldModelId = cfg.m_iModelID;
                    G.ResourceMgr.loadModel(this.wingModelRoot, UnitCtrlType.wing, cfg.m_iModelID.toString(), this.sortingOrder);
                }
               
                this.updateMergeResult(cfg);
            }
        }
    }

    private onClickMerge() {
        if (!this.selectCfg)
            return;

        if (G.DataMgr.thingData.isBagFull) {
            G.TipMgr.addMainFloatTip("背包已满，无法继续合成！");
            return;
        }

        let containerThings: Protocol.ContainerThing[] = [];
        for (let i = 0; i < this.Material_Max_Num; i++) {
            let containerThing: Protocol.ContainerThing = {} as Protocol.ContainerThing;
            let data = this.WingEquipMergeData[i];
            if (data) {
                if (data.isWingEquip) {

                    if (!data.bagData)
                        return;

                    containerThing.m_iThingID = data.bagData.data.m_iThingID;
                    containerThing.m_iNumber = data.need;
                    containerThing.m_usPosition = data.bagData.data.m_usPosition;
                } else {
                    containerThing.m_iThingID = data.materialData.id;
                    containerThing.m_iNumber = data.need;
                    containerThing.m_usPosition = 0;
                }
            }
            containerThings.push(containerThing);
        }
        let containerThingC: Protocol.ContainerThing = {} as Protocol.ContainerThing;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRoleWingCreateRequest(this.selectCfg.m_iID, containerThings[0], containerThings[1], containerThingC));
    }

    private onClickPutIn() {
        if (!this.selectCfg)
            return;

        for (let i = 0; i < this.Material_Max_Num; i++) {
            let bagDatas = this.getBagMaterials(this.getMaterial(i), i);
            if (bagDatas) {
                this.replacePutInData(i, bagDatas[0]);
            }
        }
    }

    private onClickListItem(index: number) {
        this.selectIndex = index;
        this.resetData();
        this.updatePanel();
        this.autoSelectResultList();
        //this.updateMergeResult(null);
    }


    protected onOpen() {
        this.updatePanel();
        this.list.Selected = 0;
        this.autoSelectResultList();

    }

    private autoSelectResultList() {
        if (G.DataMgr.heroData.profession == KeyWord.PROFTYPE_WARRIOR) {
            this.onClickResultList(0);
            this.resultList.Selected = 0;
        } else {
            this.onClickResultList(3);
            this.resultList.Selected = 3;
        }
    }

    protected onClose() {

    }

    onRoleWingResponse(info: Protocol.RoleWingCreateRsp) {
        this.updatePanel();
        let num = info.m_stGetContainerThingList.m_iThingNumber;
        if (num == 0) {
            G.TipMgr.addMainFloatTip("运气不佳，合成失败！");
        } else {
            this.mergeUIEffect.stopEffect();
            this.mergeUIEffect.playEffect(EffectType.Effect_Normal, true);

            let thingID = info.m_stGetContainerThingList.m_astThing[0].m_iThingID;
            let wingCfg = G.DataMgr.equipStrengthenData.getWingStrengthCfg(thingID, 1);
            //this.updateMergeResult(wingCfg);
            this.autoSelectResultList();
            //if (this.selectIndex > 0) {
            //    let zdlValue = FightingStrengthUtil.calStrength(wingCfg.m_astPropAtt);
            //    G.Uimgr.createForm<GetZhufuView>(GetZhufuView).open(KeyWord.HERO_SUB_TYPE_YUYI, false, wingCfg.m_iModelID, zdlValue);
            //}
        }
    }

    private updatePanel() {
        let wingCreateCfgs = G.DataMgr.equipStrengthenData.wingCreateCfgs;
        if (!wingCreateCfgs)
            return;
       // this.text.SetActive(false);
        this.selectCfg = wingCreateCfgs[this.selectIndex];
       

        //左侧列表
        this.list.Count = wingCreateCfgs.length;
        for (let i = 0; i < this.list.Count; i++) {
            let item = this.list.GetItem(i);
            let cfg = wingCreateCfgs[i];
            let txtNormal = item.findText("normal/text");
            let txtSelected = item.findText("selected/text");
            let tipMark = item.findObject("tipMark");
            txtNormal.text = cfg.m_szName;
            txtSelected.text = cfg.m_szName;
            tipMark.SetActive(G.DataMgr.equipStrengthenData.oneWingEquipCanMerge(cfg.m_iID));
        }

        //选择合成结果
        if (this.selectCfg) {
            let len = this.selectCfg.m_astProduct.length;
            /**值为 ： 3 */
            let prevLen = this.Prevview_Lv_Arr.length;

            for (let i = 0; i < this.Result_MAX_Num; i++) {
                let item = this.resultList.GetItem(i);
                let iconItem = this.resultListIconItems[i];
                if (!iconItem) {
                    iconItem = new IconItem();
                    iconItem.setUsualIconByPrefab(this.itemIcon_Normal, item.findObject("icon"));
                    this.resultListIconItems[i] = iconItem;
                }
                //取012 3个索引位
                let lvIndex = i % prevLen;
                let thingIndex = Math.floor(i / prevLen);
                if (thingIndex < len) {
                    let data = this.selectCfg.m_astProduct[thingIndex];
                    iconItem.updateById(data.m_iCreateWingId, 1);
                } else {
                    iconItem.updateByThingItemData(null);
                }
                iconItem.wingEquipLv = this.Prevview_Lv_Arr[lvIndex];
                iconItem.closeItemCount();
                iconItem.updateIcon();

            }
            this.txtTips.text = uts.format("{0}%", (this.selectCfg.m_iSuccessRate / 100));
        } else {
            this.txtTips.text = "";
        }
        this.updateMaterials();
    }

    private getWingModelId() {
        let id = "5631505";
        switch (this.selectIndex) {
            case 0:
                id = "5631505";
                break;
            case 1:
                id = "5631532";
                break;
            case 2:
                id = "5631518";
                break;
            case 3:
                id = "5631507";
                break;
        }
        return id;
    }

    private updateMergeResult(cfg: GameConfig.WingStrengthM) {
        
        //this.mergeWingIcon.sprite = 
     
        let config = ThingData.getThingConfig(cfg.m_iID);
        if (config) {
            this.txtWingName.text = uts.format("{0}", config.m_szName);
            let selfProf = G.DataMgr.heroData.profession;
            let name = "";
            let color = "";
            if (config.m_ucProf == selfProf) {
                color = Color.GREEN;
            }
            else {
                color = Color.RED;
            }
            if (config.m_ucProf == 1) {
                name = "器魂师";
            }
            else if (config.m_ucProf == 2) {
                name = "兽魂师";
            }
            this.txtProf.text = TextFieldUtil.getColorText(uts.format("职业限制：{0}", name), color);
        }
        this.listWingBaseInfo.Count = cfg == null ? 0 : cfg.m_astPropAtt.length;
        if (this.listWingBaseInfo.Count > 0) {
            let txtBase: UnityEngine.UI.Text = null;
            let txtExtra: UnityEngine.UI.Text = null;
            for (let i = 0; i < this.listWingBaseInfo.Count; i++) {
                txtBase = this.listWingBaseInfo.GetItem(i).findText("txtBase");
                txtExtra = this.listWingBaseInfo.GetItem(i).findText("txtExtra");
                let cfgProp = cfg.m_astPropAtt[i];
                txtBase.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, cfgProp.m_ucPropId);
                txtExtra.text = cfgProp.m_ucPropValue.toString();
            }
        }
        let config1 = ThingData.getThingConfig(this.selectCfg.m_astMaterialA[0].m_iId);
        if (config1) {
            this.txtWingGetInfo.text = RegExpUtil.xlsDesc2Html(config1.m_szSpecDesc);

        }
        else {
            uts.log("翅膀材料物品配置拿不到: id=" + this.selectCfg.m_astMaterialA[0].m_iId);
        }
        if (this.selectCfg.m_astMaterialB[1] != null) {
            //this.text.SetActive(true);
            let cfg0 = ThingData.getThingConfig(this.selectCfg.m_astMaterialB[0].m_iId);
            let cfg1 = ThingData.getThingConfig(this.selectCfg.m_astMaterialB[1].m_iId);
            let resultListIndex = this.resultList.Selected;
            if (resultListIndex > -1 && resultListIndex < 3) {
                this.txtDesArr[1].text = TextFieldUtil.getColorText(cfg0.m_szName, Color.getColorById(cfg0.m_ucColor));
            } else if (resultListIndex > 2) {
                this.txtDesArr[1].text = TextFieldUtil.getColorText(cfg1.m_szName, Color.getColorById(cfg1.m_ucColor));
            }
            //let materialBs = this.selectCfg.m_astMaterialB
            //   this.text1.text = TextFieldUtil.getColorText(uts.format('{0}*{1}或\n{2}*{3}', cfg0.m_szName, materialBs[0].m_iNum, cfg1.m_szName, materialBs[1].m_iNum), Color.GREEN);
        } else {
            this.txtDesArr[1].text = "";
            // this.text1.text = "";
        }
        //this.getInfo.text = 
    }

    private onClickIcon(index: number) {

        if (!this.selectCfg)
            return;

        let needNumArry = G.DataMgr.equipStrengthenData.getWingCreateMaterialNeedNums(this.selectCfg.m_iID);
        if (needNumArry[index] == 1)
            return;
        let wingMaterial = this.getMaterial(index);
        let bagDatas = this.getBagMaterials(wingMaterial, index);
        if (bagDatas && bagDatas.length > 0) {
            G.Uimgr.createForm<WingEquipSelectView>(WingEquipSelectView).open(index, bagDatas);
        } else {
            G.TipMgr.addMainFloatTip("背包中没有可选择道具！");
        }
    }


    private getBagMaterials(data: GameConfig.WingMaterial[], index: number) {
        if (!data)
            return;
        let thingItemDatas: ThingItemData[] = [];
        let thingList: Protocol.ContainerThing;
        switch (index) {
            case 0:
                thingList = this.thingListA;
                break;
            case 1:
                thingList = this.thingListB;
                break;
            case 2:
                thingList = this.thingListC;
                break;
        }

        for (let i = 0; i < data.length; i++) {
            let bagDatas = G.DataMgr.thingData.getBagItemById(data[i].m_iId);
            if (bagDatas) {
                for (let j = 0; j < bagDatas.length; j++) {
                    let data = bagDatas[j];
                    if (data && data.data && thingList && thingList.m_usPosition == data.data.m_usPosition) {
                        continue;
                    }
                    thingItemDatas.push(data);
                }
            }
        }
        return thingItemDatas;
    }


    replacePutInData(pos: number, data: ThingItemData) {

        let containerThing: Protocol.ContainerThing = {} as Protocol.ContainerThing;
        if (data && data.data) {
            containerThing.m_iThingID = data.data.m_iThingID;
            containerThing.m_iNumber = this.getMaterialNeedNum(pos, data.data.m_iThingID);
            containerThing.m_usPosition = data.data.m_usPosition;
        }

        switch (pos) {
            case 0:
                this.thingListA = containerThing;
                break;
            case 1:
                this.thingListB = containerThing;
                break;
            case 2:
                this.thingListC = containerThing;
                break;
        }

        this.updateMaterials();
    }

    private updateMaterials() {
        if (!this.selectCfg)
            return;



        this.WingEquipMergeData = [];

        let equipStrengthenData = G.DataMgr.equipStrengthenData;
        let needNumArry = equipStrengthenData.getWingCreateMaterialNeedNums(this.selectCfg.m_iID);

        for (let i = 0; i < this.Material_Max_Num; i++) {
            this.locks[i].SetActive(needNumArry[i] == 0);
        }

        let dataList = [this.thingListA, this.thingListB/*, this.thingListC*/];
        for (let i = 0; i < this.Material_Max_Num; i++) {
            let thingData = dataList[i];
            let needNum = needNumArry[i];
            if (needNum == 0) {
                this.materialIconItems[i].updateByMaterialItemData(null);
                this.materialIconItems[i].updateIcon();
                this.effectRoots[i].SetActive(false);
                continue;
            }
            //是否已经填充过材料
            let showAddEffect: boolean = false;
            let materialData = new MaterialItemData();
            let justOne = needNum == 1;
            if (justOne || thingData) {
                let thingId: number = justOne ? this.selectCfg.m_astMaterialA[0].m_iId : thingData.m_iThingID;
                let need: number = justOne ? this.selectCfg.m_astMaterialA[0].m_iNum : this.getMaterialNeedNum(i, thingId);
                if (GameIDUtil.isEquipmentID(thingId)) {
                    let bagData: ThingItemData = null;
                    if (justOne) {
                        let bagDatas = G.DataMgr.thingData.getBagItemById(thingId, false, 1);
                        if (bagDatas && bagDatas.length > 0)
                            bagData = bagDatas[0];
                    } else {
                        bagData = G.DataMgr.thingData.getItemDataInContainer(thingData.m_usPosition);
                        //合成出来高级后，在原位置取的，高等级不是材料了
                        if (bagData != null && bagData.config.m_iID != thingData.m_iThingID) {
                            bagData = null;
                        }

                        if (bagData == null) {
                            let bagDatas = G.DataMgr.thingData.getBagItemById(thingId, false, 1);
                            if (bagDatas && bagDatas.length > 0) {
                                bagData = bagDatas[0];
                                thingData.m_usPosition = bagData.data.m_usPosition;
                            }
                        }

                        if (bagData == null) {
                            thingData.m_iThingID = 0;
                        }

                    }
                    this.upateWingEquipMergeData(i, true, null, bagData, need);
                } else {
                    materialData.id = thingId;
                    materialData.need = need;
                    materialData.has = G.DataMgr.thingData.getThingNum(thingId, 0, false);
                    this.upateWingEquipMergeData(i, false, materialData, null, need);
                }
                showAddEffect = (thingId == undefined || thingId == 0);
                this.materialIconItems[i].setTipFrom(justOne ? TipFrom.normal : TipFrom.none);
            }

            ////只有一个材料的直接显示
            //if (needNum == 1) {
            //    let material = this.selectCfg.m_astMaterialA[0];
            //    if (GameIDUtil.isEquipmentID(material.m_iId)) {
            //        let bagData = G.DataMgr.thingData.getBagItemById(material.m_iId, false, 1);
            //        this.upateWingEquipMergeData(i, true, null, bagData[0], material.m_iNum);
            //    } else {
            //        materialData.id = material.m_iId
            //        materialData.need = material.m_iNum;
            //        materialData.has = G.DataMgr.thingData.getThingNum(materialData.id, 0, false);
            //        this.upateWingEquipMergeData(i, false, materialData, null, material.m_iNum);
            //    }
            //    this.materialIconItems[i].setTipFrom(TipFrom.normal);
            //}
            //else if (thingData) {
            //    //2中可选择的时候，显示加号
            //    let need = this.getMaterialNeedNum(i, thingData.m_iThingID);
            //    if (GameIDUtil.isEquipmentID(thingData.m_iThingID)) {
            //        let data = G.DataMgr.thingData.getItemDataInContainer(thingData.m_usPosition);
            //        this.upateWingEquipMergeData(i, true, null, data, need);
            //    } else {
            //        materialData.id = thingData.m_iThingID
            //        materialData.need = this.getMaterialNeedNum(0, thingData.m_iThingID);
            //        materialData.has = G.DataMgr.thingData.getThingNum(thingData.m_iThingID, 0, false);
            //        this.upateWingEquipMergeData(i, false, materialData, null, need);
            //    }
            //    showAddEffect = (thingData.m_iThingID == undefined || thingData.m_iThingID == 0);
            //    this.materialIconItems[i].setTipFrom(TipFrom.none);
            //}
            let showEffect = needNum > 1 && showAddEffect;
            this.effectRoots[i].SetActive(showEffect);
            UIUtils.setButtonClickAble(this.btnMerge, !showEffect);
        }

        //图标的显示
        for (let i = 0; i < this.Material_Max_Num; i++) {
            let data = this.WingEquipMergeData[i];
            if (data) {
             
                if (data.isWingEquip) {
                    this.materialIconItems[i].updateByThingItemData(data.bagData);
                } else {
                    let cfg: GameConfig.ThingConfigM = ThingData.getThingConfig(data.materialData.id);
                    if (cfg)
                        this.txtDesArr[0].text = TextFieldUtil.getColorText(cfg.m_szName, Color.getColorById(cfg.m_ucColor));
                    this.materialIconItems[i].updateByMaterialItemData(data.materialData);
                }
                this.materialIconItems[i].updateIcon();
            }
        }

    }

    private getMaterialNeedNum(pos: number, thingId: number) {
        if (!this.selectCfg)
            return -1;
        let mataril = this.getMaterial(pos);
        for (let i = 0; i < mataril.length; i++) {
            if (Math.floor(thingId / 10) == Math.floor(mataril[i].m_iId) / 10) {
                return mataril[i].m_iNum;
            }
        }
        return -1;
    }


    private getMaterial(pos: number) {
        if (!this.selectCfg)
            return null;
        let matarils = [this.selectCfg.m_astMaterialA, this.selectCfg.m_astMaterialB, this.selectCfg.m_astMaterialC];
        return matarils[pos];
    }

    private getContainerThing(pos: number) {
        let list = [this.thingListA, this.thingListB, this.thingListC];
        return list[pos];
    }



    private upateWingEquipMergeData(index: number, iswingEquip: boolean, material: MaterialItemData, bagData: ThingItemData, need: number = 0) {
        if (this.WingEquipMergeData[index] == null) {
            this.WingEquipMergeData[index] = new WingEquipMergeData();
        }
        if (iswingEquip) {
            this.WingEquipMergeData[index].bagData = bagData;
        } else {
            this.WingEquipMergeData[index].materialData = material;
        }
        this.WingEquipMergeData[index].need = need;
        this.WingEquipMergeData[index].isWingEquip = iswingEquip;
    }

    private resetData() {
        this.thingListA = {} as Protocol.ContainerThing;
        this.thingListB = {} as Protocol.ContainerThing;
        this.thingListC = {} as Protocol.ContainerThing;
    }

    private checkCondition(): boolean {
        if (!this.selectCfg)
            return false;
        let equipStrengthenData = G.DataMgr.equipStrengthenData;
        let needNumArry = equipStrengthenData.getWingCreateMaterialNeedNums(this.selectCfg.m_iID);
        for (let i = 0; i < needNumArry.length; i++) {
            if (needNumArry.length == 0)
                continue;
        }

    }

}