import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { GameObjectGetSet, TextGetSet, UILayer } from 'System/uilib/CommonForm';
import { FixedList } from 'System/uilib/FixedList';
import { List } from 'System/uilib/List';
import { HunguSkillData } from '../data/hunli/HunguSkillData';
import { SkillData } from '../data/SkillData';
import ThingData from '../data/thing/ThingData';
import { ThingItemData } from '../data/thing/ThingItemData';
import { PropertyListNode } from '../ItemPanels/PropertyItemNode';
import { TitleItemNode } from '../ItemPanels/TitleItemNode';
import { Macros } from '../protocol/Macros';
import { ProtocolUtil } from '../protocol/ProtocolUtil';
import { TabSubFormCommon } from '../uilib/TabFormCommom';
import { ElemFinder } from '../uilib/UiUtility';
import { Color } from '../utils/ColorUtil';
import { RegExpUtil } from '../utils/RegExpUtil';
import { TextFieldUtil } from '../utils/TextFieldUtil';
import { MaterialSelectView } from './MaterialSelectView';
import { IconModelItem } from '../ItemPanels/IconModelItem';
import { UIUtils } from '../utils/UIUtils';
import { ActivityRuleView } from '../diandeng/ActivityRuleView';

export class HunguBijouItem {
    private index: number;
    private goIconNode: GameObjectGetSet;
    private imgIcon: UnityEngine.GameObject;
    private btnAdd: GameObjectGetSet;
    private map: GameObjectGetSet;
    private txtFlagDes: TextGetSet;
    private txtSkillLevel: TextGetSet;
    private tipMark: GameObjectGetSet;
    private selected: GameObjectGetSet;

    private iconItem: IconModelItem;

    setComponents(go: UnityEngine.GameObject, itemicon: UnityEngine.GameObject, index: number) {
        this.index = index;
        this.goIconNode = new GameObjectGetSet(ElemFinder.findObject(go, "iconnode/imgIcon"));
        this.imgIcon = ElemFinder.findObject(go, "iconnode/imgIcon");
        this.btnAdd = new GameObjectGetSet(ElemFinder.findObject(go, "btnAdd"));
        this.map = new GameObjectGetSet(ElemFinder.findObject(go, "iconnode/map"));
        this.txtFlagDes = new TextGetSet(ElemFinder.findText(go, "describeNode/txtFlagDes"));
        this.txtSkillLevel = new TextGetSet(ElemFinder.findText(go, "describeNode/txtSkillLevel"));
        this.tipMark = new GameObjectGetSet(ElemFinder.findObject(go, "tipMark"));
        this.selected = new GameObjectGetSet(ElemFinder.findObject(go, "selected"));

        this.iconItem = new IconModelItem();
        this.iconItem.setIconByPrefab(itemicon, this.imgIcon)
        this.iconItem.selectedClose();

        this.setSelested(false);
    }

    refreshItem(equipdata: ThingItemData = null) {
        if (equipdata == null) {
            //未装备 锁
            this.btnAdd.SetActive(false);
            this.tipMark.SetActive(false);
            this.txtFlagDes.text = "未装备";
            this.txtSkillLevel.text = "";
        }
        else {
            //已装备
            let intensify = equipdata.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_uiFengZhuangLevel > 0;
            if (!intensify) {
                //未封装 锁
                this.btnAdd.SetActive(false);
                this.tipMark.SetActive(false);
                this.txtFlagDes.text = "未封装";
                this.txtSkillLevel.text = "";
            }
            else {
                let materialId = equipdata.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_stSkillFZ.m_iItemID;
                let skilldata = G.DataMgr.hunliData.hunguSkillData.getHunguSkillData(equipdata.config.m_iEquipPart, equipdata.config.m_iDropLevel);
                if (materialId > 0) {
                    let data = ThingData.getThingConfig(materialId);
                    let skill = SkillData.getSkillConfig(data.m_iFunctionID);
                    //已镶嵌
                    this.btnAdd.SetActive(false);
                    this.tipMark.SetActive(false);
                    this.txtFlagDes.text = TextFieldUtil.getColorText(skill.m_szSkillName, Color.getColorById(skill.m_ucSkillColor));
                    this.txtSkillLevel.text = TextFieldUtil.getColorText(uts.format("{0}级", skilldata.m_iSkillLevel), Color.GREEN);
                }
                else { 
                    //未镶嵌才会有红点和提示镶嵌按钮  有足够的材料才显示红点，加号一直显示
                    let tipmark = G.DataMgr.hunliData.hunguSkillData.onceHunguTipmark(equipdata);
                    this.btnAdd.SetActive(false);
                    this.tipMark.SetActive(tipmark);
                    this.txtFlagDes.text = TextFieldUtil.getColorText("注入技能", Color.ORANGE);
                    this.txtSkillLevel.text = "";
                }
            }
        }
        this.iconItem.setHunguEquipIcon(equipdata);
        this.iconItem.updateIconShow();
    }

    public setSelested(sel: boolean) {
        this.selected.SetActive(sel);
    }
}

export class HunguSkillItem {
    private gameObject: UnityEngine.GameObject;
    private imgIcon: UnityEngine.UI.RawImage;
    private txtSkillName: TextGetSet;
    private txtSkillLevel: TextGetSet;
    private txtSkillDes: TextGetSet;


    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.imgIcon = ElemFinder.findRawImage(go, "iconnode/imgIcon");
        this.txtSkillName = new TextGetSet(ElemFinder.findText(go, "txtSkillName"));
        this.txtSkillLevel = new TextGetSet(ElemFinder.findText(go, "txtSkillLevel"));
        this.txtSkillDes = new TextGetSet(ElemFinder.findText(go, "txtSkillDes"));
    }

    refreshItem(data: [GameConfig.SkillConfigM, number]) {
        UIUtils.setGrey(this.gameObject, data[1] == 0, true);

        G.ResourceMgr.loadIcon(this.imgIcon, data[0].m_iSkillIcon.toString());
        this.txtSkillName.text = TextFieldUtil.getColorText(data[0].m_szSkillName, Color.getColorById(data[0].m_ucSkillColor));
        this.txtSkillLevel.text = data[1] == 0 ? "未激活" : uts.format("{0}级", data[0].m_ushSkillLevel)
        this.txtSkillDes.text = RegExpUtil.xlsDesc2Html(data[0].m_szDescription);
    }
}

export class HunguSkillPanel extends TabSubFormCommon {
    private itemicon: UnityEngine.GameObject;

    //左侧
    private hunguList: FixedList;
    private hunguListItems: HunguBijouItem[] = [];
    private describeNode: GameObjectGetSet;
    private skillShowNode: GameObjectGetSet;
    // private colorNode: GameObjectGetSet;
    // private imgColors: UnityEngine.UI.Image[] = [];
    private iconNode: GameObjectGetSet;
    private imgSkillIcon: UnityEngine.UI.RawImage;
    private txtSkillName: TextGetSet;
    private txtSkillLevel: TextGetSet;
    private btnRuler: UnityEngine.GameObject;

    //右侧
    private titleItemNode: TitleItemNode;
    private skillList: List;
    private skillListItems: HunguSkillItem[] = [];

    //属性
    private btnProperty: UnityEngine.GameObject;
    private propertyNode: GameObjectGetSet;
    private propTitleItemNode: TitleItemNode;
    private propertyListNode: PropertyListNode;


    private hunguSkillData: HunguSkillData = null;
    private curEquipData: ThingItemData = null;
    private curSelected: number = -1;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HUNGU_SKILL);
    }
    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.HunguSkillPanel;
    }
    protected initElements() {
        this.hunguSkillData = G.DataMgr.hunliData.hunguSkillData;

        this.itemicon = this.elems.getElement("itemIcon_Model");
        this.hunguList = this.elems.getUIFixedList("hunguList");
        for (let i = 0; i < G.DataMgr.hunliData.HUNGU_COUNT; i++) {
            this.hunguListItems[i] = new HunguBijouItem();
            this.hunguListItems[i].setComponents(this.hunguList.GetItem(i).gameObject, this.itemicon, i);
            // this.hunguListItems[i].onClickAddCall = delegate(this, this.onClickHungu);
        }
        this.describeNode = new GameObjectGetSet(this.elems.getElement("describeNode"));
        this.skillShowNode = new GameObjectGetSet(this.elems.getElement("skillShowNode"));
        // this.colorNode = new GameObjectGetSet(this.elems.getElement("colorNode"));
        // for (let i = 0; i < 8; i++) {
        //     this.imgColors[i] = ElemFinder.findImage(this.colorNode.gameObject, "imgColor" + i.toString());
        // }
        this.iconNode = new GameObjectGetSet(this.elems.getElement("iconNode"));
        this.imgSkillIcon = this.elems.getRawImage("imgSkillIcon");
        this.txtSkillName = new TextGetSet(this.elems.getText("txtSkillName"));
        this.txtSkillLevel = new TextGetSet(this.elems.getText("txtSkillLevel"));
        this.btnRuler = this.elems.getElement("btnRuler");

        this.titleItemNode = new TitleItemNode();
        this.titleItemNode.setComponents(this.elems.getElement("titleItemNode"));
        this.skillList = this.elems.getUIList("skillList");

        this.btnProperty = this.elems.getElement("btnProperty");
        this.propertyNode = new GameObjectGetSet(this.elems.getElement("propertyNode"));
        this.propTitleItemNode = new TitleItemNode();
        this.propTitleItemNode.setComponents(this.elems.getElement("propTitleItemNode"));
        this.propertyListNode = new PropertyListNode();
        this.propertyListNode.setComponents(this.elems.getElement("propertyListNode"));

        this.titleItemNode.setTitleName("技能列表");
    }

    protected initListeners() {
        this.addClickListener(this.btnProperty, this.onClickProperty);
        this.addClickListener(ElemFinder.findObject(this.propertyNode.gameObject, "mask"), this.onCloseProperty);
        this.addListClickListener(this.hunguList, this.onClickHungu);
        this.addClickListener(this.btnRuler, this.onClickRuler);
    }

    protected onOpen() {
        this.setCenterDescribeShow(true);
        this.updatePanel();
    }

    protected onClose() {

    }

    private onClickProperty() {
        this.propertyNode.SetActive(true);
        this.propTitleItemNode.setTitleName("魂骨属性");
        this.propTitleItemNode.setFighting(this.hunguSkillData.getHunguSkillPanelFight());
        this.propertyListNode.setTitle("");
        this.propertyListNode.setFirstColor(Color.GREEN);
        this.propertyListNode.clearProperty();
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        for (let i = 0; i < G.DataMgr.hunliData.HUNGU_COUNT; i++) {
            let equipData = equipDatas[i];
            if (equipData == null) continue;
            if (equipData.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_stSkillFZ.m_iItemID == 0) continue;
            let skill = this.hunguSkillData.getHunguSkillData(equipData.config.m_iEquipPart, equipData.config.m_iDropLevel);
            let data = this.hunguSkillData.getHunguPropMultiplyRandomProp(skill.m_astProp)[0];
            for (let j = 0, con = data.length; j < con; j++) {
                this.propertyListNode.addProperty(data[j].m_ucPropId, data[j].m_iPropValue);
            }
        }
        this.propertyListNode.refreshPropertyNode();
    }

    private onCloseProperty() {
        this.propertyNode.SetActive(false);
    }

    private onClickRuler() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(490), "玩法说明");
    }

    private onClickHungu(index: number) {
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        this.curSelected = index;
        this.curEquipData = equipDatas[this.curSelected];

        if (this.curEquipData == null) {
            //未装备
            G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGUN);
        }
        else {
            let intensify = this.curEquipData.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_uiFengZhuangLevel > 0;
            if (!intensify) {
                //未封装
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGUN_FZ);
            }
            else {
                //已封装
                if (this.curEquipData.config.m_iDropLevel < 7) {
                    G.TipMgr.addMainFloatTip("八百年以上魂骨可铸魂");
                }
                else {
                    //获取所有材料数据
                    let materials = this.hunguSkillData.getAllMaterialData(index);
                    let selectPanel = G.Uimgr.createForm<MaterialSelectView>(MaterialSelectView);
                    if (selectPanel != null) {
                        let equipData = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP)[index];
                        let skillData = this.hunguSkillData.getHunguSkillData(equipData.config.m_iEquipPart, equipData.config.m_iDropLevel);
                        this.setCenterDescribeShow(false);
                        selectPanel.onClickCloseCall = delegate(this, this.onClickSelectClose);
                        selectPanel.onClickMaterialCall = delegate(this, this.onClickSelectMaterial);
                        selectPanel.onClickConfirmCall = delegate(this, this.onClickSelectConfig);
                        selectPanel.onClickDemountCall = delegate(this, this.onClickSelectDemount);
                        selectPanel.open(materials, skillData, equipData);
                    }
                    this.hunguListItems[index].setSelested(true);
                }
            }
        }
    }

    private onClickSelectClose() {
        this.setCenterDescribeShow(true);
        //清除选中
        for (let i = 0, con = this.hunguList.Count; i < con; i++) {
            this.hunguListItems[i].setSelested(false);
        }
    }

    private onClickSelectMaterial(material: ThingItemData) {
        if (material == null) {
            this.refreshCenterNode(0);
        }
        else {
            this.refreshCenterNode(material.config.m_iID);
        }
    }

    private onClickSelectConfig(material: ThingItemData, equipData: ThingItemData) {
        //注意 这个material不是背包里的，是整合过的一个数据
        let skill = this.hunguSkillData.getHunguSkillData(equipData.config.m_iEquipPart, equipData.config.m_iDropLevel)
        if (material.data.m_iNumber >= skill.m_stCostItemList[0].m_iItemNumber) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHunguSkillFZRequest(equipData.config.m_iEquipPart - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN, Macros.EQUIP_HUNGU_SKILL_FZ, material.config.m_iID));
            let selectPanel = G.Uimgr.createForm<MaterialSelectView>(MaterialSelectView);
            if (selectPanel != null && selectPanel.isOpened) {
                selectPanel.close();
            }
        }
        else {
            G.TipMgr.addMainFloatTip("数量不足!");
        }
    }

    private onClickSelectDemount(data: ThingItemData) {

    }

    updatePanel() {
        this.refreshHunguList();
        this.refreshSkill();
    }

    private refreshHunguList() {
        this.setTitleFight(this.hunguSkillData.getHunguSkillPanelFight());
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        for (let i = 0; i < G.DataMgr.hunliData.HUNGU_COUNT; i++) {
            let data = equipDatas[i];
            let item = this.hunguListItems[i];
            item.refreshItem(data);
        }
    }

    private refreshSkill() {
        this.titleItemNode.setFighting(this.hunguSkillData.getHunguSkillPanelFight());
        let datas = this.hunguSkillData.getCurrentSkillDatas();
        this.skillList.Count = datas.length;
        for (let i = 0, con = datas.length; i < con; i++) {
            if (this.skillListItems[i] == null) {
                this.skillListItems[i] = new HunguSkillItem();
                this.skillListItems[i].setComponents(this.skillList.GetItem(i).gameObject);
            }
            this.skillListItems[i].refreshItem(datas[i]);
        }
    }

    private setCenterDescribeShow(isshow: boolean) {
        this.describeNode.SetActive(isshow);
        this.skillShowNode.SetActive(!isshow);
    }

    private refreshCenterNode(materialId: number) {
        // let data = this.hunguSkillData.getAllMaterialId();
        // let normal = new UnityEngine.Color(1, 1, 1, 1);
        // let lucency = new UnityEngine.Color(1, 1, 1, 0.5);
        // for (let i = 0, con = data.length; i < con; i++) {
        //     this.imgColors[i].color = data[i] == materialId ? normal : lucency;
        // }

        if (materialId == 0) {
            this.txtSkillName.text = "未镶嵌";
            this.txtSkillLevel.text = "";
            this.iconNode.SetActive(false);
        }
        else {
            let data = ThingData.getThingConfig(materialId);
            let skill = SkillData.getSkillConfig(data.m_iFunctionID);
            this.txtSkillName.text = skill.m_szSkillName;
            let skilldata = this.hunguSkillData.getHunguSkillData(this.curEquipData.config.m_iEquipPart, this.curEquipData.config.m_iDropLevel);
            this.txtSkillLevel.text = uts.format("{0}级", skilldata.m_iSkillLevel);
            G.ResourceMgr.loadIcon(this.imgSkillIcon, skill.m_iSkillIcon.toString(), -1);
            this.iconNode.SetActive(true);
        }
    }
}

