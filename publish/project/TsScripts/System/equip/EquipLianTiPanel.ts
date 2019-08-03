import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { UIPathData } from 'System/data/UIPathData'
import { EquipBasePanel } from 'System/equip/EquipBasePanel'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { EquipUtils } from 'System/utils/EquipUtils'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { HeroData } from 'System/data/RoleData'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { ThingData } from 'System/data/thing/ThingData'
import { VipData } from 'System/data/VipData'
import { AutoBuyInfo } from 'System/data/business/AutoBuyInfo'
import { EnumGuide } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { Constants } from 'System/constants/Constants'
import { Color } from 'System/utils/ColorUtil'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { IconItem, ArrowType } from 'System/uilib/IconItem'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { EquipEnhanceAttItemData } from 'System/data/thing/EquipEnhanceAttItemData'
import { EnumEquipRule } from 'System/data/thing/EnumEquipRule'
import { UIUtils } from 'System/utils/UIUtils'
import { UiElements } from 'System/uilib/UiElements'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { TipType } from 'System/constants/GameEnum'
import { List } from "System/uilib/List";
import { FanXianTaoView } from 'System/equip/FanXianTaoView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { BatBuyView } from "System/business/view/BatBuyView"
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"
import { SkillData } from "System/data/SkillData"
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { EnumEffectRule } from 'System/constants/GameEnum'



class LianTiStrengthPropItem {

    private txtType: UnityEngine.UI.Text;
    private txtCurValue: UnityEngine.UI.Text;
    private txtNextValue: UnityEngine.UI.Text;
    private objJianTou: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.txtType = ElemFinder.findText(go, "txtType");
        this.txtCurValue = ElemFinder.findText(go, "txtCurValue");
        this.txtNextValue = ElemFinder.findText(go, "txtNextValue");
        this.objJianTou = ElemFinder.findObject(go, "objJianTou");
    }

    update(curData: GameConfig.EquipPropAtt, nextData: GameConfig.EquipPropAtt) {
        //curData 为null表示0级，取下一级数
        let name = TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, curData ? curData.m_ucPropId : nextData.m_ucPropId), Color.PropWHITE);
        let curValue = TextFieldUtil.getColorText((curData ? curData.m_ucPropValue : 0).toString(), Color.PropGreen);
        let nextValue = TextFieldUtil.getColorText(nextData ? (nextData.m_ucPropValue).toString() : "", Color.GREEN);
        this.txtType.text = name;
        this.txtCurValue.text = curValue;
        this.txtNextValue.text = nextValue;
        this.objJianTou.SetActive(nextData != null);
    }
}


class LianTiPropItem {

    private txtName: UnityEngine.UI.Text;
    private txtValue: UnityEngine.UI.Text;

    setCommponets(go: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtValue = ElemFinder.findText(go, "txtValue");
    }

    update(data: GameConfig.EquipPropAtt, active: boolean = true) {
        let nameColor = active ? "E1FFFF" : Color.GREY;
        let valueColor = active ? Color.GREEN : Color.GREY;
        this.txtName.text = TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, data.m_ucPropId), nameColor);
        this.txtValue.text = TextFieldUtil.getColorText(data.m_ucPropValue + "", valueColor);
    }

}


/**
 * 装备位练体
 */
export class EquipLianTiPanel extends EquipBasePanel {

    /**自动强化时间间隔*/
    private readonly deltaTime: number = 100;

    private readonly PROPSORT: number[] = [KeyWord.EQUIP_PROP_HP, KeyWord.EQUIP_PROP_PHYSIC_ATTACK, KeyWord.EQUIP_PROP_DEFENSE,
    KeyWord.EQUIP_PROP_MAGIC_ATTACK, KeyWord.EQUIP_PROP_MAGICRESIST, KeyWord.EQUIP_PROP_GOAL,
    KeyWord.EQUIP_PROP_DODGE, KeyWord.EQUIP_PROP_CRITICAL, KeyWord.EQUIP_PROP_TOUGHNESS]

    /**炼体宝石数量5个*/
    private readonly MaxGemstoneCount = 5;



    private btnRule: UnityEngine.GameObject;
    private btnStart: UnityEngine.GameObject;
    private btnAuto: UnityEngine.GameObject;

    private txtName: UnityEngine.UI.Text;
    private txtSlider: UnityEngine.UI.Text;
    private txtFight: UnityEngine.UI.Text;
    private txtAutoLabel: UnityEngine.UI.Text;
    private txtFull: UnityEngine.UI.Text;
    private txtCurStatus: UnityEngine.UI.Text;
    private txtNextStatus: UnityEngine.UI.Text;


    private strenghList: List;
    private propList: List;

    private equipIconItem: IconItem;
    private equipIcon: UnityEngine.GameObject;

    private slider: UnityEngine.UI.Slider;

    /**宝石*/
    private objStones: UnityEngine.GameObject[] = [];
    private gemstone: UnityEngine.GameObject;
    /**激活按钮*/
    private btnActives: UnityEngine.GameObject[] = [];
    private objActive: UnityEngine.GameObject;
    private iconItems: IconItem[] = [];

    /**toggle选择*/
    private selectGroup: UnityEngine.UI.ActiveToggleGroup;
    private txtConditions: UnityEngine.UI.Text[] = [];
    private txtHaves: UnityEngine.UI.Text[] = [];


    /**装备数据*/
    private EquipItemDatas: ThingItemData[] = [];
    /**当前选择的装备*/
    private selectEquip: ThingItemData = null;
    private firstSelectIndex: number = 0;
    /**消耗类型，1铜钱，2绑元，3道具*/
    private curSelectCoseType: number = 0;

    /**炼体属性*/
    private lianTiStrengthPropItems: LianTiStrengthPropItem[] = [];

    /**所有的属性汇总*/
    private m_allProps: GameConfig.EquipPropAtt[];

    private LianTiPropItem: LianTiPropItem[] = [];

    /**自动强化*/
    private m_isAuto: boolean = false;
    /**自动强化时间*/
    private m_autoTime: number = 0;

    private oldLv: number = -1;
    private oldSelectPartIndex: number = -1;
    private oldLuckValue: number = 0;

    private materialId: number = 0;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_EQUIP_LIANTI);
    }

    protected resPath(): string {
        return UIPathData.EquipLianTiPanel;
    }

    protected initElements() {
        super.initElements();
        this.initEquipList(ArrowType.equipLianTi);

        this.btnRule = this.elems.getElement("btnRule");
        this.btnStart = this.elems.getElement("btnStart");
        this.btnAuto = this.elems.getElement("btnAuto");

        this.txtName = this.elems.getText("txtName");
        this.txtSlider = this.elems.getText("txtSlider");
        this.txtFight = this.elems.getText("txtFight");
        this.txtAutoLabel = this.elems.getText("txtAutoLabel");
        this.txtFull = this.elems.getText("txtFull");
        this.txtCurStatus = this.elems.getText("txtCurStatus");
        this.txtNextStatus = this.elems.getText("txtNextStatus");

        this.strenghList = this.elems.getUIList("strenghList");
        this.propList = this.elems.getUIList("propList");

        this.equipIcon = this.elems.getElement("equipIcon");
        this.equipIconItem = new IconItem();
        this.equipIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.equipIcon);
        this.equipIconItem.setTipFrom(TipFrom.normal);

        this.slider = this.elems.getSlider("slider");

        this.gemstone = this.elems.getElement("gemstone");
        this.objActive = this.elems.getElement("objActive");
        for (let i = 0; i < this.MaxGemstoneCount; i++) {
            let item = ElemFinder.findObject(this.gemstone, "stoneItem" + i);
            this.objStones.push(item);

            let iconItem = new IconItem();
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, item);
            iconItem.setTipFrom(TipFrom.normal);
            this.iconItems.push(iconItem);

            let btnActive = ElemFinder.findObject(this.objActive, "btnActive" + i);
            this.btnActives.push(btnActive);

            Game.UIClickListener.Get(btnActive).onClick = delegate(this, this.onClickActive, i);
        }


        this.selectGroup = this.elems.getToggleGroup("selectGroup");
        for (let i = 0; i < EquipStrengthenData.MaxToggleSelectType; i++) {
            let item = ElemFinder.findObject(this.selectGroup.gameObject, "item" + i);
            let txtCondition = ElemFinder.findText(item, "txtCondition0");
            let txtHave = ElemFinder.findText(item, "txtHave0");

            this.txtConditions.push(txtCondition);
            this.txtHaves.push(txtHave);
        }



    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnRule, this.onClickRule);
        this.addClickListener(this.btnStart, this.onClickStart);
        this.addClickListener(this.btnAuto, this.onClickAuto);
        this.addToggleGroupListener(this.selectGroup, this.onClickToggle);

        Game.UIClickListener.Get(this.txtConditions[2].gameObject).onClick = delegate(this, this.onClickText);
    }

    protected onOpen() {
        super.onOpen();
        //更新装备列表
        this.updateEquipList();
        //默认选择
        this.firstSelectIndex = this.getFirstSelectIndex();
        this.equipList.Selected = this.firstSelectIndex;
        this.selectEquip = this.EquipItemDatas[this.firstSelectIndex];
        //初始老的等级，选择位置，用于自动强化中断
        let equipSlotInfo = G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(this.firstSelectIndex);
        this.oldLv = equipSlotInfo.m_ucLianTiLv;
        this.oldSelectPartIndex = this.firstSelectIndex;
        this.oldLuckValue = equipSlotInfo.m_uiLianTiLuck;
        //更新右侧属性
        this.updateRightProp();
        this.updatePanel();
        //默认按钮灰的
        this.selectGroup.Selected = 0;
        this.onClickToggle(0);

    }

    protected onClose() {
        super.onClose();
        this.m_isAuto = false;
        this.stopAuto();
        this.selectGroup.Selected = 0;
    }

    private onClickText() {
        if (this.materialId > 0) {
            let item = new IconItem();
            item.updateById(this.materialId);
            G.ViewCacher.tipsView.open(item.getTipData(), TipFrom.normal);
        }
    }

    private onClickRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(416), '玩法说明');
    }

    private onClickToggle(index: number) {
        this.curSelectCoseType = index + 1;
        if (this.selectEquip == null) return;
    }

    private onClickStart() {
        if (this.onClickCheck()) {
            let partIndex = this.selectEquip.config.m_iEquipPart % KeyWord.EQUIP_PARTCLASS_MIN;
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipEnhanceRequest(partIndex, Macros.EQUIP_SLOTLIANTI_UP, this.curSelectCoseType));
        }
    }

    private onClickAuto() {
        if (this.onClickCheck()) {
            if (this.m_isAuto) {
                this.stopAuto();
            }
            else {
                this.startAuto();
            }
        }
    }

    private onClickActive(index: number) {
        let partIndex = this.selectEquip.config.m_iEquipPart % KeyWord.EQUIP_PARTCLASS_MIN;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipEnhanceRequest(partIndex, Macros.EQUIP_SLOTLTSB_ACT, index + 1));
    }

    protected onClickEquipList(index: number) {

        let equipSlotInfo = G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(index);
        this.oldLv = equipSlotInfo.m_ucLianTiLv;
        this.oldSelectPartIndex = index;
        this.oldLuckValue = equipSlotInfo.m_uiLianTiLuck;

        this.selectEquip = this.EquipItemDatas[index];
        this.updatePanel(false);
    }


    updateEquipList() {
        let rawDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        let i: number;
        this.EquipItemDatas.length = 0;
        let rawObj: ThingItemData;
        for (i = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
            rawObj = rawDatas[i];
            this.EquipItemDatas.push(rawObj);
        }
        for (let i = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
            this.equipIcons[i].updateByThingItemData(rawDatas[i]);
            this.equipIcons[i].updateIcon();
        }
    }


    updatePanel(dataChange: boolean = true) {
        let equipStrengthenData = G.DataMgr.equipStrengthenData;
        //选择装备图标
        this.equipIconItem.updateByThingItemData(this.selectEquip);
        this.equipIconItem.updateIcon();

        if (this.selectEquip != null) {
            let equipPart = this.selectEquip.config.m_iEquipPart;
            let partIndex = equipPart % KeyWord.EQUIP_PARTCLASS_MIN;
            let equipSlotInfo = equipStrengthenData.getEquipSlotOneDataByPart(partIndex);
            let lv = equipSlotInfo.m_ucLianTiLv;

            //祝福值飘字
            if (this.oldLuckValue != equipSlotInfo.m_uiLianTiLuck && this.oldLv == lv) {
                let tipStr = "祝福值+" + (equipSlotInfo.m_uiLianTiLuck - this.oldLuckValue).toString();
                G.TipMgr.addPosTextMsg(tipStr, Color.GREEN, this.txtSlider.gameObject.transform, 0, 10);
            }
            this.oldLuckValue = equipSlotInfo.m_uiLianTiLuck;
            //自动中断
            if (this.oldLv != lv || partIndex != this.oldSelectPartIndex) {
                this.stopAuto();
                this.oldLv = lv;
                this.oldSelectPartIndex = partIndex;
            }


            //强化属性
            let curCfg = equipStrengthenData.getEquipLianTiConfig(equipPart, lv);
            let nextCfg = equipStrengthenData.getEquipLianTiConfig(equipPart, lv + 1);
            let len = curCfg ? curCfg.m_stPropAtt.length : nextCfg.m_stPropAtt.length;
            this.strenghList.Count = len;
            for (let i = 0; i < this.strenghList.Count; i++) {
                if (this.lianTiStrengthPropItems[i] == null) {
                    let item = this.strenghList.GetItem(i).gameObject;
                    this.lianTiStrengthPropItems[i] = new LianTiStrengthPropItem();
                    this.lianTiStrengthPropItems[i].setComponents(item);
                }
                this.lianTiStrengthPropItems[i].update(curCfg ? curCfg.m_stPropAtt[i] : null, nextCfg ? nextCfg.m_stPropAtt[i] : null)
            }

            this.txtName.text = (curCfg ? curCfg.m_szShowStage : "") + TextFieldUtil.getColorText(" " + this.selectEquip.config.m_szName, Color.getColorById(this.selectEquip.config.m_ucColor));
            this.txtCurStatus.text = (curCfg ? curCfg.m_szShowStage : "");
            this.txtNextStatus.text = (nextCfg ? nextCfg.m_szShowStage : "已满级");


            if (nextCfg) {
                this.btnStart.gameObject.SetActive(true);
                this.btnAuto.gameObject.SetActive(true);
                this.selectGroup.gameObject.SetActive(true);
                this.txtFull.text = "";
                //toggle 消耗显示
                let thingCfg = ThingData.getThingConfig(nextCfg.m_iItemID);
                let has = G.DataMgr.thingData.getThingNum(nextCfg.m_iItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                this.materialId = nextCfg.m_iItemID;

                this.txtConditions[0].text = "魂币:" + nextCfg.m_iTongQian;
                this.txtConditions[1].text = "钻石:" + nextCfg.m_iBindYB;
                this.txtConditions[2].text = thingCfg.m_szName + ":" + nextCfg.m_iItemNum;
                this.txtHaves[0].text = "次数:" + TextFieldUtil.getColorText((equipStrengthenData.equipLianTiYingLiangMaxCount - equipStrengthenData.slotLTUpCostInfo.m_ucTongQian).toString(), Color.GREEN);
                this.txtHaves[1].text = "次数:" + TextFieldUtil.getColorText((equipStrengthenData.equipLianTiBindGoldMaxCount - equipStrengthenData.slotLTUpCostInfo.m_ucBindYB).toString(), Color.GREEN);
                this.txtHaves[2].text = "现有:" + TextFieldUtil.getColorText(has.toString(), Color.GREEN);

                this.selectGroup.gameObject.SetActive(true);

                let curLuckValue = equipSlotInfo.m_uiLianTiLuck;
                let maxLuckValue = nextCfg ? nextCfg.m_iLuck : -1;
                this.txtSlider.text = maxLuckValue >= 0 ? uts.format("祝 福 值  {0}/{1}", curLuckValue, maxLuckValue) : "已 满 级"
                this.slider.value = maxLuckValue >= 0 ? curLuckValue / maxLuckValue : 1;
                if (this.m_isAuto) {
                    let time: number = G.SyncTime.getCurrentTime();
                    if (time - this.m_autoTime > this.deltaTime) {
                        this.m_autoTime = time;
                        this.onBtnStart();
                    }
                    else {
                        this.addTimer("strength", this.deltaTime, 1, this.onTimer);
                    }
                }

            } else {
                this.btnStart.gameObject.SetActive(false);
                this.btnAuto.gameObject.SetActive(false);
                this.selectGroup.gameObject.SetActive(false);
                this.txtFull.text = "已满级";
                this.txtSlider.text = "已 满 级";
                this.slider.value = 1;
            }

            //let show: boolean = G.DataMgr.equipStrengthenData.oneEquipLianTiCanLvUpByType(equipPart, this.curSelectCoseType);
            //this.updateBtnStatus(show && !this.m_isAuto, show);

            this.updateBtnStatus(!this.m_isAuto, true);

        }

        if (dataChange) {
            this.updateRightProp();
            this.updateEquipList();
        }

        this.updateTopSB();
    }


    private updateRightProp() {
        let equipStrengthenData = G.DataMgr.equipStrengthenData;
        //重置清空
        this.m_allProps = [];
        for (let i = 0; i < this.PROPSORT.length; i++) {
            this.m_allProps[i] = { m_ucPropId: this.PROPSORT[i], m_ucPropValue: 0 };
        }

        //每件装备的
        for (let i = 0; i < KeyWord.EQUIP_PARTCLASS_MAX - KeyWord.EQUIP_PARTCLASS_MIN; i++) {
            let equipPart = KeyWord.EQUIP_PARTCLASS_MIN + i;
            let equipSlotInfo = equipStrengthenData.getEquipSlotOneDataByPart(i);
            let lianTiCfg = G.DataMgr.equipStrengthenData.getEquipLianTiConfig(equipPart, equipSlotInfo.m_ucLianTiLv);
            if (lianTiCfg) {
                this.mergeProp(lianTiCfg.m_stPropAtt);
            }

            //炼体神宝激活了
            for (let j = 0; j < this.MaxGemstoneCount; j++) {
                if (equipStrengthenData.lianTiSBPosLv(equipPart, j) > 0) {
                    let cfg = G.DataMgr.equipStrengthenData.getEquipLianTiSBConfig(j + 1);
                    this.mergeProp(cfg.m_stPropAtt);
                }
            }
        }

        this.propList.Count = this.m_allProps.length;
        for (let i = 0; i < this.propList.Count; i++) {
            let item = this.propList.GetItem(i).gameObject;
            if (this.LianTiPropItem[i] == null) {
                this.LianTiPropItem[i] = new LianTiPropItem();
                this.LianTiPropItem[i].setCommponets(item);
            }
            this.LianTiPropItem[i].update(this.m_allProps[i])
        }
        this.txtFight.text = FightingStrengthUtil.calStrength(this.m_allProps).toString();
    }


    private mergeProp(prop: GameConfig.EquipPropAtt[]): void {
        for (let i: number = 0; i < prop.length; i++) {
            for (let j: number = 0; j < this.m_allProps.length; j++) {
                if (this.m_allProps[j].m_ucPropId == prop[i].m_ucPropId) {
                    this.m_allProps[j].m_ucPropValue += prop[i].m_ucPropValue;
                    break;
                }
            }
        }
    }


    private updateTopSB() {
        if (this.selectEquip == null) return;

        let equipPart = this.selectEquip.config.m_iEquipPart;
        let equipStrengthenData = G.DataMgr.equipStrengthenData;
        let equipSlotInfo = equipStrengthenData.getEquipSlotOneDataByPart(equipPart % KeyWord.EQUIP_PARTCLASS_MIN);
        let lv = equipSlotInfo.m_ucLianTiLv;

        for (let i = 0; i < this.MaxGemstoneCount; i++) {
            let cfg = G.DataMgr.equipStrengthenData.getEquipLianTiSBConfig(i + 1);
            //某个位置激活次数
            let activeCount = G.DataMgr.equipStrengthenData.lianTiSBPosLv(equipPart, i);
            let show = lv >= cfg.m_ucUseLevel && G.DataMgr.thingData.getThingNum(cfg.m_iItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= cfg.m_iItemNum;
            this.iconItems[i].updateById(cfg.m_iItemID);
            this.iconItems[i].filterType = activeCount > 0 ? IconItem.NoNeedFILTER_GRAY : IconItem.FILTER_GRAY;
            this.iconItems[i].effectRule = activeCount > 0 ? EnumEffectRule.normal : EnumEffectRule.none;
            this.iconItems[i].updateIcon();
            this.btnActives[i].SetActive(show && activeCount == 0);
        }
    }


    private getFirstSelectIndex() {
        let equipStrengthenData = G.DataMgr.equipStrengthenData;
        //先检查激活
        for (let i = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
            let equipData = this.EquipItemDatas[i];
            if (equipData == null)
                continue;
            let equipPart = equipData.config.m_iEquipPart;
            if (equipStrengthenData.oneEquipLianTiCanActiveSB(equipPart)) {
                return i;
            }
        }
        //再检查可升级
        for (let i = 0; i < ThingData.All_EQUIP_NUM - 2; i++) {
            let equipData = this.EquipItemDatas[i];
            if (equipData == null)
                continue;
            let equipPart = equipData.config.m_iEquipPart;
            if (equipStrengthenData.oneEquipLianTiCanLvUp(equipPart)) {
                return i;
            }
        }
        //最后默认武器第一个
        return 0;
    }

    ///////////////自动强化//////////////////////////

    private startAuto(): void {
        if (!this.m_isAuto) {
            this.m_isAuto = true;
            UIUtils.setButtonClickAble(this.btnStart, false);
            this.txtAutoLabel.text = "停止强化";
            this.onBtnStart();
        }
    }

    private stopAuto(): void {
        if (this.m_isAuto) {
            this.m_isAuto = false;
            UIUtils.setButtonClickAble(this.btnStart, true);
            this.txtAutoLabel.text = "自动强化";
        }
        this.removeTimer("strength");
    }


    private onBtnStart(): void {
        if (this.selectEquip == null) return;
        let equipStrengthenData = G.DataMgr.equipStrengthenData;
        let equipPart = this.selectEquip.config.m_iEquipPart;
        let partIndex = equipPart % KeyWord.EQUIP_PARTCLASS_MIN;
        let equipSlotInfo = equipStrengthenData.getEquipSlotOneDataByPart(partIndex);
        let nextCfg = equipStrengthenData.getEquipLianTiConfig(equipPart, equipSlotInfo.m_ucLianTiLv + 1);
        if (nextCfg) {
            if (G.DataMgr.equipStrengthenData.oneEquipLianTiCanLvUpByType(equipPart, this.curSelectCoseType, true)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipEnhanceRequest(partIndex, Macros.EQUIP_SLOTLIANTI_UP, this.curSelectCoseType));
            } else {
                this.stopAuto();
                G.TipMgr.addMainFloatTip("条件不满足");
                //  this.updateBtnStatus(false, false);
            }
        } else {
            this.stopAuto();
            G.TipMgr.addMainFloatTip("炼体已满级");
            //  this.updateBtnStatus(false, false);
        }
    }

    private onTimer(): void {
        this.m_autoTime = G.SyncTime.getCurrentTime();
        this.onBtnStart();
    }


    private updateBtnStatus(startStatus: boolean, autoStatus: boolean) {
        UIUtils.setButtonClickAble(this.btnStart, startStatus);
        UIUtils.setButtonClickAble(this.btnAuto, autoStatus);
    }


    private onClickCheck(): boolean {

        if (this.selectEquip == null) return false;

        let equipStrengthenData = G.DataMgr.equipStrengthenData;
        let equipPart = this.selectEquip.config.m_iEquipPart;
        let partIndex = equipPart % KeyWord.EQUIP_PARTCLASS_MIN;
        let equipSlotInfo = equipStrengthenData.getEquipSlotOneDataByPart(partIndex);
        let nextCfg = equipStrengthenData.getEquipLianTiConfig(equipPart, equipSlotInfo.m_ucLianTiLv + 1);

        if (nextCfg == null) {
            G.TipMgr.addMainFloatTip("装备炼体等级已满级");
            return false;
        }

        let heroData = G.DataMgr.heroData;
        let costInfo = equipStrengthenData.slotLTUpCostInfo;

        let can: boolean = true;
        switch (this.curSelectCoseType) {
            case 1:
                if ((equipStrengthenData.equipLianTiYingLiangMaxCount - costInfo.m_ucTongQian) <= 0) {
                    G.TipMgr.addMainFloatTip("魂币强化次数已用完");
                    can = false;
                } else if (heroData.tongqian < nextCfg.m_iTongQian) {
                    G.TipMgr.addMainFloatTip("魂币数量不足");
                    can = false;
                }
                break;
            case 2:
                if ((equipStrengthenData.equipLianTiBindGoldMaxCount - costInfo.m_ucBindYB) <= 0) {
                    G.TipMgr.addMainFloatTip("钻石强化次数已用完");
                    can = false;
                } else if (heroData.gold < nextCfg.m_iBindYB) {
                    G.TipMgr.addMainFloatTip("钻石数量不足");
                    can = false;
                }
                break;
            case 3:
                if (G.DataMgr.thingData.getThingNum(nextCfg.m_iItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false) < nextCfg.m_iItemNum) {
                    G.TipMgr.addMainFloatTip("强化材料不足");
                    can = false;
                }
                break;
        }
        return can;
    }
}



