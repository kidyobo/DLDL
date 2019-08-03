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


class FanXianPropItem {

    private txtName: UnityEngine.UI.Text;
    private txtValue: UnityEngine.UI.Text;

    setCommponets(go: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtValue = ElemFinder.findText(go, "txtValue");
    }

    update(data: GameConfig.EquipPropAtt, active: boolean) {
        let nameColor = active ? "E1FFFF" : Color.GREY;
        let valueColor = active ? Color.GREEN : Color.GREY;
        this.txtName.text = TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, data.m_ucPropId), nameColor);
        this.txtValue.text = TextFieldUtil.getColorText(data.m_ucPropValue + "", valueColor);
    }

}


/**
 * 装备位套装面板
 */
export abstract class FanXianBasePanel extends EquipBasePanel {
    /**属性显示默认取1级的*/
    private  DefaultPropLV = 1;

    protected itemIcon_Normal: UnityEngine.GameObject;
    protected beforeActive: UnityEngine.GameObject;
    protected afterActive: UnityEngine.GameObject;
    protected txtFight: UnityEngine.UI.Text;
    protected txtDes: UnityEngine.UI.Text; 
    protected txtAdd: UnityEngine.UI.Text;
    protected txtCurAdd: UnityEngine.UI.Text;
    protected btnActive: UnityEngine.GameObject;

    protected propList1: List;
    protected propList2: List;
    protected txtSkillDes1: UnityEngine.UI.Text;
    protected txtSkillDes2: UnityEngine.UI.Text;
    protected txtTitel1: UnityEngine.UI.Text;
    protected txtTitel2: UnityEngine.UI.Text;

    protected imgDes1: UnityEngine.GameObject;
    protected imgDes2: UnityEngine.GameObject;

    //激活前2个装备+2个材料+1个激活后
    protected curEquipIconItem: IconItem;
    protected nextEquipIconItem: IconItem;
    protected icon0IconItem: IconItem;
    protected icon1IconItem: IconItem;
    protected activeIconItem: IconItem;
    //材料
    private MaterialItemData1: MaterialItemData = new MaterialItemData();
    private MaterialItemData2: MaterialItemData = new MaterialItemData();

    private propItems1: FanXianPropItem[] = [];
    private propItems2: FanXianPropItem[] = [];

    /**装备数据*/
    private EquipItemDatas: ThingItemData[] = [];
    /**套装类型*/
    private taoZhuangType: number = 0;

    /**当前选择的装备*/
    private selectEquip: ThingItemData;
    private firstSelectIndex: number = -1;

    private iconZi: UnityEngine.UI.Image;
    private ziAtals: Game.UGUIAltas;

    protected resPath(): string {
        return UIPathData.FanXianPanel;
    }

    protected initElements() {
        super.initElements();
        this.initEquipList(ArrowType.none);

        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        //激活前2个装备
        this.curEquipIconItem = new IconItem();
        this.curEquipIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement("curEquip"));
        this.curEquipIconItem.setTipFrom(TipFrom.normal);
        //this.curEquipIconItem.arrowType = ArrowType.equipMingWen;
        this.curEquipIconItem.arrowType = ArrowType.equipMingWen;
        this.curEquipIconItem.isNeedShowArrow = false;
        this.curEquipIconItem.needWuCaiColor = true;
        this.curEquipIconItem.needForceShowWuCaiColor = true;

        this.nextEquipIconItem = new IconItem();
        this.nextEquipIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement("nextEquip"));
        //this.nextEquipIconItem.arrowType = ArrowType.equipMingWen;
        this.nextEquipIconItem.needWuCaiColor = true;
        this.nextEquipIconItem.arrowType = ArrowType.equipMingWen;
        this.nextEquipIconItem.isNeedShowArrow = false;
        this.nextEquipIconItem.needWuCaiColor = true;
        this.nextEquipIconItem.needForceShowWuCaiColor = true;


       // this.nextEquipIconItem.setTipFrom(TipFrom.normal);
        //2个材料
        this.icon0IconItem = new IconItem();
        this.icon0IconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement("icon0"));
        this.icon0IconItem.setTipFrom(TipFrom.normal);



        this.icon1IconItem = new IconItem();
        this.icon1IconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement("icon1"));
        this.icon1IconItem.setTipFrom(TipFrom.normal);
        //1个激活后
        this.activeIconItem = new IconItem();
        this.activeIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement("activeIcon"));
        this.activeIconItem.setTipFrom(TipFrom.normal);

        this.activeIconItem.arrowType = ArrowType.equipMingWen;
        this.activeIconItem.isNeedShowArrow = false;
        this.activeIconItem.needWuCaiColor = true;
        this.activeIconItem.needForceShowWuCaiColor = true;

      //  this.activeIconItem.needWuCaiColor = true;

        this.beforeActive = this.elems.getElement("beforeActive");
        this.afterActive = this.elems.getElement("afterActive");
        this.btnActive = this.elems.getElement("btnActive");
        //文本
        this.txtFight = this.elems.getText("txtFight");
        this.txtDes = this.elems.getText("txtDes"); 
        this.txtAdd = this.elems.getText("txtAdd");
        this.txtCurAdd = this.elems.getText("txtCurAdd");
        this.txtSkillDes1 = this.elems.getText("txtSkillDes1");
        this.txtSkillDes2 = this.elems.getText("txtSkillDes2");
        this.txtTitel1 = this.elems.getText("txtTitel1");
        this.txtTitel2 = this.elems.getText("txtTitel2");

        this.imgDes1 = this.elems.getElement("imgDes1");
        this.imgDes2 = this.elems.getElement("imgDes2");

        this.propList1 = this.elems.getUIList("propList1");
        this.propList2 = this.elems.getUIList("propList2");

        let v = G.Uimgr.getForm<FanXianTaoView>(FanXianTaoView);
        this.taoZhuangType = EquipStrengthenData.TZKeyWords[v.TabIds.indexOf(this.id)];

        this.iconZi = this.elems.getImage("iconZi");
        this.ziAtals = this.elems.getElement("ziAtals").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.iconZi.sprite = this.ziAtals.Get(this.taoZhuangType + "");

        this.imgDes1.SetActive(this.taoZhuangType == KeyWord.SLOT_SUIT_TYPE_1);
        this.imgDes2.SetActive(this.taoZhuangType == KeyWord.SLOT_SUIT_TYPE_2);
    }

    protected initListeners() {
        super.initListeners(); 
        this.addClickListener(this.btnActive, this.onClickActive);
        this.addClickListener(this.elems.getElement("btnRule"), this.onClickRule);
    }

    protected onOpen() {
        super.onOpen();
        this.updateEquipList();
        this.firstSelectIndex = G.DataMgr.equipStrengthenData.getFirstCanActiveEquipSlotSuit(this.taoZhuangType);
        this.equipList.Selected = this.firstSelectIndex;
        this.selectEquip = this.EquipItemDatas[this.firstSelectIndex];
        this.updatePanel();
    }

    protected onClose() {
        super.onClose();
        G.DataMgr.runtime.slotSuitPart = -1;
    }

    private onClickRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(413), '玩法说明');
    }

    protected onClickEquipList(index: number) {
        this.selectEquip = this.EquipItemDatas[index];
        this.updatePanel();
    }


    private onClickActive() {
        let equipPart = this.selectEquip.config.m_iEquipPart;
        let partIndex = EquipUtils.getEquipIdxByPart(equipPart);
        let config = G.DataMgr.equipStrengthenData.getEquipSlotSuitConfig(this.taoZhuangType, equipPart);
        if (config.m_iCondType == KeyWord.SLOT_SUIT_COND_EQUIPUP && this.selectEquip.config.m_ucStage < config.m_iCondValue) {
            G.TipMgr.addMainFloatTip("装备进阶到极品宝器后才能激活凡界套装属性");
            return;
        }
        G.DataMgr.runtime.slotSuitPart = partIndex;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipEnhanceRequest(partIndex, Macros.EQUIP_SLOTSUIT_ACT, this.taoZhuangType));
    }

    private updateEquipList() {
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


    updatePanel() {
        if (this.selectEquip == null) return;
        //是否激活
        let equipPart = this.selectEquip.config.m_iEquipPart;
        let hasActive = EquipUtils.getEquipSlotSuitIsActive(equipPart, this.taoZhuangType);
        let type1Active = EquipUtils.getEquipSlotSuitIsActive(equipPart, KeyWord.SLOT_SUIT_TYPE_1);
        this.beforeActive.SetActive(!hasActive);
        this.afterActive.SetActive(hasActive);

        let slotSuitInfo = G.DataMgr.equipStrengthenData.slotSuitInfo;
        this.DefaultPropLV = slotSuitInfo.m_ucSuitLv[this.taoZhuangType - 1];
        this.DefaultPropLV = Math.max(this.DefaultPropLV, 1);
        let config = G.DataMgr.equipStrengthenData.getEquipSlotSuitConfig(this.taoZhuangType, equipPart);
        //没有激活
        if (!hasActive) {
            //图标显示
            this.curEquipIconItem.updateByThingItemData(this.selectEquip);
            this.curEquipIconItem.updateIcon();
            this.nextEquipIconItem.updateByThingItemData(this.selectEquip);
            this.nextEquipIconItem.updateIcon();

           
            this.MaterialItemData1.id = config.m_iConsumID;
            this.MaterialItemData1.need = config.m_iConsumNum;
            this.MaterialItemData1.has = G.DataMgr.thingData.getThingNum(this.MaterialItemData1.id, Macros.CONTAINER_TYPE_ROLE_BAG, false)

            this.MaterialItemData2.id = config.m_iConsumID2;
            this.MaterialItemData2.need = config.m_iConsumNum2;
            this.MaterialItemData2.has = G.DataMgr.thingData.getThingNum(this.MaterialItemData2.id, Macros.CONTAINER_TYPE_ROLE_BAG, false)

            this.icon0IconItem.updateByMaterialItemData(this.MaterialItemData1);
            this.icon0IconItem.updateIcon();
            this.icon1IconItem.updateByMaterialItemData(this.MaterialItemData2);
            this.icon1IconItem.updateIcon();

            let add = 0;
            if (this.taoZhuangType > 1) {
                let prewConfig = G.DataMgr.equipStrengthenData.getEquipSlotSuitConfig(this.taoZhuangType - 1, equipPart);
                add = prewConfig.m_iPropValue;
            } 

            this.txtAdd.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, config.m_ucPropName) + ":" + (config.m_iPropValue-add);
        } else {
            //激活
            this.activeIconItem.updateByThingItemData(this.selectEquip);
            this.activeIconItem.updateIcon();

            this.txtCurAdd.text = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, config.m_ucPropName) + ":" + config.m_iPropValue;

        }


        if (config.m_iCondType == KeyWord.SLOT_SUIT_COND_EQUIPUP && this.MaterialItemData1.has >= this.MaterialItemData1.need && this.MaterialItemData2.has >= this.MaterialItemData2.need) {
            UIUtils.setButtonClickAble(this.btnActive, true);
        } else if (config.m_iCondType == KeyWord.SLOT_SUIT_COND_SUITUP && type1Active && this.MaterialItemData1.has >= this.MaterialItemData1.need && this.MaterialItemData2.has >= this.MaterialItemData2.need) {
            UIUtils.setButtonClickAble(this.btnActive, true);
        } else {
            UIUtils.setButtonClickAble(this.btnActive, false);
        }

        this.updatePropList();

        this.updateEquipList();
       
    }



    private updateFight() {
        let fight = 0;
        let activePropAtt:GameConfig.EquipPropAtt[] = [];
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null) return 0;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            if (dataList[i] == null) continue;
            let equipPart = dataList[i].config.m_iEquipPart;
            let hasActive = EquipUtils.getEquipSlotSuitIsActive(equipPart, this.taoZhuangType);
            if (hasActive) {
                let equipCfg = G.DataMgr.equipStrengthenData.getEquipSlotSuitConfig(this.taoZhuangType, equipPart);
                let propAtt = {} as GameConfig.EquipPropAtt;
                propAtt.m_ucPropId = equipCfg.m_ucPropName;
                propAtt.m_ucPropValue = equipCfg.m_iPropValue;
                activePropAtt.push(propAtt);
            }
        }
        fight += FightingStrengthUtil.calStrength(activePropAtt);

        let activeCount = G.DataMgr.equipStrengthenData.getEquipSlotSuitActiveCount(this.taoZhuangType);
        let config = G.DataMgr.equipStrengthenData.getEquipSlotSuitUpConfig(this.taoZhuangType, this.DefaultPropLV);
        if (config) {
            let data1 = config.m_stUpAtt[0];
            let data2 = config.m_stUpAtt[1];
            if (activeCount >= data2.m_ucPartNum) {
                fight += FightingStrengthUtil.calStrength(data2.m_astPropAtt);

            } else if (activeCount >= data1.m_ucPartNum) {
                fight += FightingStrengthUtil.calStrength(data1.m_astPropAtt);
            } 
        }
        this.txtFight.text = fight.toString();
    }


    private updatePropList() {
        let activeCount = G.DataMgr.equipStrengthenData.getEquipSlotSuitActiveCount(this.taoZhuangType);
        let config = G.DataMgr.equipStrengthenData.getEquipSlotSuitUpConfig(this.taoZhuangType, this.DefaultPropLV);
        if (config) {
            let data1 = config.m_stUpAtt[0];
            let data2 = config.m_stUpAtt[1];
            this.updateOnePartPanel(activeCount, data1, this.txtTitel1, this.txtSkillDes1, this.propList1, this.propItems1);
            this.updateOnePartPanel(activeCount, data2, this.txtTitel2, this.txtSkillDes2, this.propList2, this.propItems2);
        }
        this.updateFight();
    }


    private updateOnePartPanel(
        activeCount: number,
        data: GameConfig.EquipSlotSuitUpAtt,
        txtTitle: UnityEngine.UI.Text,
        txtSkillDes: UnityEngine.UI.Text,
        propList: List,
        propItems: FanXianPropItem[]) {
        let skillconfig = SkillData.getSkillConfig(data.m_iSkillID);
        let slotSuitInfo = G.DataMgr.equipStrengthenData.slotSuitInfo;
        let lv = slotSuitInfo.m_ucSuitLv[this.taoZhuangType - 1];
        let titleStr = KeyWord.getDesc(KeyWord.GROUP_SLOT_SUIT_TYPE, EquipStrengthenData.TZKeyWords[this.taoZhuangType - 1]);
        titleStr += lv > 0 ? lv + "重" : "";
        titleStr += activeCount >= data.m_ucPartNum ? "(已激活)" : uts.format("({0}/{1})", activeCount, data.m_ucPartNum);
        txtTitle.text = titleStr;
        propList.Count = data.m_astPropAtt.length;
        for (let i = 0; i < propList.Count; i++) {
            if (propItems[i] == null) {
                let item = propList.GetItem(i).gameObject;
                propItems[i] = new FanXianPropItem();
                propItems[i].setCommponets(item);
            }
            propItems[i].update(data.m_astPropAtt[i], activeCount >= data.m_ucPartNum);
        }

        if (activeCount >= data.m_ucPartNum) {
            txtSkillDes.text = RegExpUtil.xlsDesc2Html(skillconfig.m_szDescription);
        } else {
            txtSkillDes.text = TextFieldUtil.getColorText(RegExpUtil.xlsDesc2Html(skillconfig.m_szDescription), Color.GREY);
        }
    }



}



