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
import { TabSubForm } from 'System/uilib/TabForm'
import { FixedList } from 'System/uilib/FixedList'
import { EnumEffectRule } from 'System/constants/GameEnum'
import { GroupList } from 'System/uilib/GroupList'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

class ShengLingPropItem {

    private txtName: UnityEngine.UI.Text;
    private txtValue: UnityEngine.UI.Text;

    setCommponets(go: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtValue = ElemFinder.findText(go, "txtValue");
    }

    update(data: GameConfig.EquipPropAtt, active: boolean, index: number, data2: GameConfig.EquipSlotSuitUpAtt) {
        let nameColor = active ? "E1FFFF" : Color.GREY;
        let valueColor = active ? Color.GREEN : Color.GREY;
        this.txtName.text = TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, data.m_ucPropId), nameColor);
        if (data2 == null) {
            this.txtValue.text = TextFieldUtil.getColorText(data.m_ucPropValue + "", valueColor);
        } else {
            this.txtValue.text = TextFieldUtil.getColorText((data.m_ucPropValue - data2.m_astPropAtt[index].m_ucPropValue) + "", valueColor);
        }
    }




}


/**
 * 装备位升灵
 */
export class ShengLingPanel extends TabSubForm {
    private readonly FirstTitleLabels: string[] = ["套装"];

    /**属性显示默认取1级的*/
    private readonly DefaultPropLV = 1;
    /**套装类型-凡 仙*/
    private readonly TZKeyWords: number[] = [KeyWord.SLOT_SUIT_TYPE_1, KeyWord.SLOT_SUIT_TYPE_2];

    //EquipStrengthenData.TZKeyWords
    private groupList: GroupList;
    private propList1: List;
    private propList2: List;
    private propList3: List;
    private propList4: List;
    private txtSkillDes1: UnityEngine.UI.Text;
    private txtSkillDes2: UnityEngine.UI.Text;
    private txtSkillDes3: UnityEngine.UI.Text;
    private txtSkillDes4: UnityEngine.UI.Text;
    private txtTitle1: UnityEngine.UI.Text;
    private txtTitle2: UnityEngine.UI.Text;
    private txtTitle3: UnityEngine.UI.Text;
    private txtTitle4: UnityEngine.UI.Text;

    private txtFullLv: UnityEngine.UI.Text;
   

    private itemIcon_Normal: UnityEngine.GameObject;
    private btnUp: UnityEngine.GameObject;


    private curMaterialIconItem: IconItem;
    //材料
    private MaterialItemData1: MaterialItemData = new MaterialItemData();

    private propItems1: ShengLingPropItem[] = [];
    private propItems2: ShengLingPropItem[] = [];
    private propItems3: ShengLingPropItem[] = [];
    private propItems4: ShengLingPropItem[] = [];

    private taoZhuangType: number = 1;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_FANXIAN_SHENGLING);
    }

    protected resPath(): string {
        return UIPathData.ShengLingPanel;
    }

    protected initElements() {
        super.initElements();

        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        //激活前2个装备
        this.curMaterialIconItem = new IconItem();
        this.curMaterialIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement("icon"));
        this.curMaterialIconItem.setTipFrom(TipFrom.normal);
        this.btnUp = this.elems.getElement("btnUp");
        //文本
        this.txtSkillDes1 = this.elems.getText("txtSkillDes1");
        this.txtSkillDes2 = this.elems.getText("txtSkillDes2");
        this.txtSkillDes3 = this.elems.getText("txtSkillDes3");
        this.txtSkillDes4 = this.elems.getText("txtSkillDes4");

        this.txtTitle1 = this.elems.getText("txtTitle1");
        this.txtTitle2 = this.elems.getText("txtTitle2");
        this.txtTitle3 = this.elems.getText("txtTitle3");
        this.txtTitle4 = this.elems.getText("txtTitle4");

        this.txtFullLv = this.elems.getText("txtFullLv");
        

        this.groupList = this.elems.getUIGroupList("groupList");
        this.propList1 = this.elems.getUIList("propList1");
        this.propList2 = this.elems.getUIList("propList2");
        this.propList3 = this.elems.getUIList("propList3");
        this.propList4 = this.elems.getUIList("propList4");

    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnUp, this.onClickUp);
        this.addListClickListener(this.groupList, this.onGroupListClick);

    }

    protected onOpen() {
        super.onOpen();
        this.createPetList();
        this.updatePanel();
        this.groupList.Selected = 0;
        this.groupList.GetSubList(0).Selected = 0;
    }

    protected onClose() {
        super.onClose();
        G.DataMgr.runtime.slotSuitPart = -1;
    }

    private onGroupListClick(index: number) {

    }

    private onClickUp() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getEquipEnhanceRequest(0, Macros.EQUIP_SLOTSUIT_UP, this.taoZhuangType));
    }


    updatePanel(isDataChange: boolean = false) {
        let slotSuitInfo = G.DataMgr.equipStrengthenData.slotSuitInfo;
        let lv = slotSuitInfo.m_ucSuitLv[this.taoZhuangType - 1];
      //  this.txtLv.text = lv > 0 ? "当前等级"+lv + "级" : "";
        let config = G.DataMgr.equipStrengthenData.getEquipSlotSuitUpConfig(this.taoZhuangType, lv + 1);
        if (config) {
            this.MaterialItemData1.id = config.m_iConsumID;
            this.MaterialItemData1.need = config.m_iConsumNum;
            this.MaterialItemData1.has = G.DataMgr.thingData.getThingNum(this.MaterialItemData1.id, Macros.CONTAINER_TYPE_ROLE_BAG, false)
            this.curMaterialIconItem.updateByMaterialItemData(this.MaterialItemData1);
            this.curMaterialIconItem.updateIcon();
            this.txtFullLv.text = "";
        } else {
            this.txtFullLv.text = "已满级";
            this.curMaterialIconItem.updateByMaterialItemData(null);
            this.curMaterialIconItem.updateIcon();
        }
        UIUtils.setButtonClickAble(this.btnUp, config && this.MaterialItemData1.has >= this.MaterialItemData1.need);
        this.updatePropList();

        if (isDataChange) {
            this.createPetList();
        }
       
    }


    private createPetList() {
        this.groupList.Count = this.FirstTitleLabels.length;
        let petData = G.DataMgr.petData;

        for (let i: number = 0; i < this.groupList.Count; i++) {
            let labelItem = this.groupList.GetItem(i);
            let labelText = labelItem.findText('catalog/normal/text');
            labelText.text = this.FirstTitleLabels[i];
            labelText = labelItem.findText('catalog/selected/text');
            labelText.text = this.FirstTitleLabels[i];
            let subList = this.groupList.GetSubList(i);
            subList.Count = EquipStrengthenData.TZKeyWords.length;
            subList.onClickItem = delegate(this, this.onClickGroupItem);
            let hasTip = false;
            for (let j = 0; j < subList.Count; j++) {
                let item = subList.GetItem(j);
                let secondText = item.findText('txtItem');
                secondText.text = KeyWord.getDesc(KeyWord.GROUP_SLOT_SUIT_TYPE, EquipStrengthenData.TZKeyWords[j]);
                let subTip = G.DataMgr.equipStrengthenData.getEuipSlotSuitCanUpLv(TipMarkUtil.TaoZhuangTypes[j]);

                if (!hasTip) {
                    hasTip = subTip;
                }
                let subTipMark = item.findObject('tipMark');
                subTipMark.SetActive(subTip);
            }
            let mainTipMark = labelItem.findObject("catalog/tipMark");
            mainTipMark.SetActive(hasTip);
        }
    }

    private onClickGroupItem(index: number) {
        this.taoZhuangType = (index + 1);
        this.updatePanel();
    }


    private updatePropList() {
        let activeCount = G.DataMgr.equipStrengthenData.getEquipSlotSuitActiveCount(this.taoZhuangType);
        let config = G.DataMgr.equipStrengthenData.getEquipSlotSuitUpConfig(this.taoZhuangType, 1);
        let config2 = G.DataMgr.equipStrengthenData.getEquipSlotSuitUpConfig(this.taoZhuangType, 2);
        if (config) {
            let data1 = config.m_stUpAtt[0];
            let data2 = config.m_stUpAtt[1];
            this.updateOnePartPanel(activeCount, data1, this.txtTitle1, this.txtSkillDes1, this.propList1, this.propItems1,1);
            this.updateOnePartPanel(activeCount, data2, this.txtTitle2, this.txtSkillDes2, this.propList2,this.propItems2,1);
        }
       
        if (config2) {
            let data1 = config2.m_stUpAtt[0];
            let data2 = config2.m_stUpAtt[1];
            this.updateOnePartPanel(activeCount, data1, this.txtTitle3, this.txtSkillDes3, this.propList3, this.propItems3,2, config.m_stUpAtt[0]);
            this.updateOnePartPanel(activeCount, data2, this.txtTitle4, this.txtSkillDes4, this.propList4, this.propItems4, 2,config.m_stUpAtt[1]);
        }
    }


    private updateOnePartPanel(
        activeCount: number,
        data: GameConfig.EquipSlotSuitUpAtt,
        txtTitle: UnityEngine.UI.Text,
        txtSkillDes: UnityEngine.UI.Text,
        propList: List,
        propItems: ShengLingPropItem[], qhLv: number, data2: GameConfig.EquipSlotSuitUpAtt = null)
    {
        let skillconfig = SkillData.getSkillConfig(data.m_iSkillID);
        let slotSuitInfo = G.DataMgr.equipStrengthenData.slotSuitInfo;
        let lv = slotSuitInfo.m_ucSuitLv[this.taoZhuangType - 1];

        let titleStr = KeyWord.getDesc(KeyWord.GROUP_SLOT_SUIT_TYPE, EquipStrengthenData.TZKeyWords[this.taoZhuangType - 1]);
        titleStr += activeCount >= data.m_ucPartNum ? uts.format("({0}重 已激活)", qhLv) : uts.format("({0}重 {1}/{2})", qhLv, activeCount, data.m_ucPartNum);
        txtTitle.text = titleStr;
        propList.Count = data.m_astPropAtt.length;
        for (let i = 0; i < propList.Count; i++) {
            if (propItems[i] == null) {
                let item = propList.GetItem(i).gameObject;
                propItems[i] = new ShengLingPropItem();
                propItems[i].setCommponets(item);
            }
            propItems[i].update(data.m_astPropAtt[i], activeCount >= data.m_ucPartNum, i, data2);
        }

        if (activeCount >= data.m_ucPartNum) {
            txtSkillDes.text = RegExpUtil.xlsDesc2Html(skillconfig.m_szDescription);
        } else {
            txtSkillDes.text = TextFieldUtil.getColorText(RegExpUtil.xlsDesc2Html(skillconfig.m_szDescription), Color.GREY);
        }
    }









}



