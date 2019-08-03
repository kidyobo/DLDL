import { EnumGuide } from 'System/constants/GameEnum';
import { Global as G } from 'System/global';
import { KeyWord } from '../constants/KeyWord';
import { HunguMergeData } from '../data/hunli/HunguMergeData';
import { ThingItemData } from '../data/thing/ThingItemData';
import UIPathData from '../data/UIPathData';
import { ActivityRuleView } from '../diandeng/ActivityRuleView';
import { HunguSelectView } from '../hunli/HunguSelectView';
import { PropertyItemDoubleListNode } from '../ItemPanels/PropertyItemNode';
import { ConsumeMaterialItem } from '../ItemPanels/ConsumeMaterialItem';
import { CircleIconType, IconModelItem } from '../ItemPanels/IconModelItem';
import { TitleItemNode } from '../ItemPanels/TitleItemNode';
import { GameObjectGetSet, TextGetSet, UILayer } from '../uilib/CommonForm';
import { FixedList } from '../uilib/FixedList';
import { GroupList } from '../uilib/GroupList';
import { IconItem } from '../uilib/IconItem';
import { ListItem, List } from '../uilib/List';
import { TabSubFormCommon } from '../uilib/TabFormCommom';
import { ElemFinder } from '../uilib/UiUtility';
import { Color } from '../utils/ColorUtil';
import { FightingStrengthUtil } from '../utils/FightingStrengthUtil';
import { TextFieldUtil } from '../utils/TextFieldUtil';
import { TipFrom } from '../tip/view/TipsView';
import { ConfirmCheck, MessageBoxConst } from '../tip/TipManager';


class HunguMergeItem {
    private iconitem: IconModelItem;
    private effectNode: GameObjectGetSet;
    private goIcon: GameObjectGetSet;
    private tipMark: GameObjectGetSet;

    setComponents(go: UnityEngine.GameObject, itemIcon_Model: UnityEngine.GameObject) {
        this.effectNode = new GameObjectGetSet(ElemFinder.findObject(go, "effectNode"));
        this.tipMark = new GameObjectGetSet(ElemFinder.findObject(go, "tipMark"));
        this.goIcon = new GameObjectGetSet(ElemFinder.findObject(go, "icon"));

        this.iconitem = new IconModelItem();
        this.iconitem.setIconByPrefab(itemIcon_Model, this.goIcon.gameObject);
        this.iconitem.setIconType(CircleIconType.HunguMerge);
        this.iconitem.closeStarLevelFlag();
        this.iconitem.hideStarLevelFlag();
        this.iconitem.hideBackground();
    }

    updata(data: ThingItemData, tipMark: boolean) {
        this.iconitem.setHunguEquipIcon(data);
        this.iconitem.updateIconShow();
        this.iconitem.selectedClose();

        this.tipMark.SetActive(tipMark);
    }

    hdieEffect() {
        this.effectNode.SetActive(false);
    }

    showEffect() {
        this.effectNode.SetActive(true);
    }


    hideSelected() {
        this.iconitem.selectedClose();
    }

    showSelected() {
        this.iconitem.selectedOpen();
    }
}

/**
 * 魂骨材料item
 */
class HunguMaterialItem {
    private goIcon: GameObjectGetSet;
    private iconitem: IconModelItem;
    private effectNode: GameObjectGetSet;
    private tipMark: GameObjectGetSet;

    setComponents(go: UnityEngine.GameObject, itemIcon_Model: UnityEngine.GameObject) {
        this.goIcon = new GameObjectGetSet(ElemFinder.findObject(go, "icon"));
        this.tipMark = new GameObjectGetSet(ElemFinder.findObject(go, "tipMark"));

        this.iconitem = new IconModelItem();
        this.iconitem.setIconByPrefab(itemIcon_Model, this.goIcon.gameObject);
        this.iconitem.setIconType(CircleIconType.HunguMerge);
        this.iconitem.closeStarLevelFlag();
        this.iconitem.hideStarLevelFlag();
        this.iconitem.hideBackground();
    }

    updata(data: ThingItemData, tipMark: boolean) {
        this.iconitem.setHunguEquipIcon(data);
        this.iconitem.updateIconShow();
        this.iconitem.selectedClose();

        this.tipMark.SetActive(tipMark);
    }

    hdieEffect() {
        this.effectNode.SetActive(false);
    }

    showEffect() {
        this.effectNode.SetActive(true);
    }


    hideSelected() {
        this.iconitem.selectedClose();
    }

    showSelected() {
        this.iconitem.selectedOpen();
    }
}
/**
 * 魂骨升华
 */
export class HunguMergePanel extends TabSubFormCommon {
    private btnRuler: UnityEngine.GameObject;
    private txtProbability: TextGetSet;
    private txtDescribe: TextGetSet;

    private hunguGroupList: GroupList;

    private equipList: FixedList;
    materialList: List;

    private toggleCanCompound: UnityEngine.UI.ActiveToggle;
    private iconPreview: GameObjectGetSet;
    private effectNode: GameObjectGetSet;
    private succendEffectNode: GameObjectGetSet;
    private defeatedEffectNode: GameObjectGetSet;

    /**右侧节点标题 （名字+战斗力） */
    private itemNodeTitle: TitleItemNode;
    /**右侧节点上边的属性节点 */
    private NodeAttribute: PropertyItemDoubleListNode;
    private randAttList: List;
    /**右侧节点下边的消耗封装 */
    public itemConsumeMaterial: ConsumeMaterialItem;

    private itemIcon_Normal: UnityEngine.GameObject;
    private itemIcon_Model: UnityEngine.GameObject;
    private previewEquipItem: IconItem;
    private hunguEquipItems: HunguMergeItem[] = [];
    private hunguMaterialItems: HunguMaterialItem[] = [];


    private curMergeGroupDatas: { [prop: number]: GameConfig.HunGuMergeM[] }
    private curMergeData: GameConfig.HunGuMergeM;
    private curEquipIndex: number = -1;
    private curMaterialIndex: number = -1;

    /**一级索引*/
    private curfirstSelectedIndex: number = 0;
    private curfirstSelectedId: number = 0;
    /**二级索引*/
    private cursecondSelectedIndex: number = 0;

    private mergeData: HunguMergeData;
    guideListItem: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HUNGUN_MERGE);
    }
    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.HunguMergePanel;
    }
    protected initElements() {
        this.mergeData = G.DataMgr.hunliData.hunguMergeData;

        this.btnRuler = this.elems.getElement("btnRuler");
        this.txtProbability = new TextGetSet(this.elems.getText("txtProbability"));
        this.txtDescribe = new TextGetSet(this.elems.getText("txtDescribe"));
        this.hunguGroupList = this.elems.getUIGroupList("hunguGroupList");
        this.equipList = this.elems.getUIFixedList("equipList");
        this.materialList = this.elems.getUIList("materialList");
        this.toggleCanCompound = this.elems.getActiveToggle("togCanCompound");
        this.iconPreview = new GameObjectGetSet(this.elems.getElement("iconPreview"));
        this.effectNode = new GameObjectGetSet(this.elems.getElement("effectNode"));
        this.succendEffectNode = new GameObjectGetSet(this.elems.getElement("succendEffectNode"));
        this.defeatedEffectNode = new GameObjectGetSet(this.elems.getElement("defeatedEffectNode"));
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.itemIcon_Model = this.elems.getElement("itemIcon_Model");

        this.previewEquipItem = new IconItem();
        this.previewEquipItem.setUsualIconByPrefab(this.itemIcon_Normal, this.iconPreview.gameObject);
        this.previewEquipItem.closeStarLevelFlag();
        this.previewEquipItem.setTipFrom(TipFrom.normal);
        for (let i = 0, con = this.equipList.Count; i < con; i++) {
            let equip = new HunguMergeItem();
            equip.setComponents(this.equipList.GetItem(i).gameObject, this.itemIcon_Model);
            this.hunguEquipItems.push(equip);
        }
        this.materialList.Count = this.mergeData.mergeMaterialMaxNumber;
        for (let i = 0; i < this.mergeData.mergeMaterialMaxNumber; i++) {
            let material = new HunguMaterialItem();
            material.setComponents(this.materialList.GetItem(i).gameObject, this.itemIcon_Model);
            this.hunguMaterialItems.push(material);
        }

        this.itemNodeTitle = new TitleItemNode();
        this.itemNodeTitle.setComponents(this.elems.getElement("nodeTitleItem"));
        this.NodeAttribute = new PropertyItemDoubleListNode();
        this.NodeAttribute.setComponents(this.elems.getElement("attributeListItem"));
        this.NodeAttribute.setFirstColor(Color.WHITE)
        this.randAttList = this.elems.getUIList("randAttList");
        this.itemConsumeMaterial = new ConsumeMaterialItem();
        this.itemConsumeMaterial.setComponents(this.elems.getElement("consumeMaterialItem"), this.itemIcon_Normal);

    }

    protected initListeners() {
        this.addClickListener(this.btnRuler, this.onClickRuler)
        // this.previewEquipItem.actionOnClickItem = delegate(this, this.onClickPreviewEquip);
        this.addListClickListener(this.equipList, this.onClickEquipList);
        this.addListClickListener(this.materialList, this.onClickMaterialList);
        this.hunguGroupList.onClickItem = delegate(this, this.onClickHunguGroupItem);
        this.toggleCanCompound.onValueChanged = delegate(this, this.onToggleChange);
        this.itemConsumeMaterial.onClick = delegate(this, this.onClickMerge);
        this.mergeData.onChangeAddEquip = delegate(this, this.onAddEquipChange);
    }

    protected onOpen() {
        this.closeTitleFight();
        this.closeEffect();
        for (let i = 0, len = this.equipList.Count; i < len; i++) {
            this.hunguEquipItems[i].hideSelected();
        }
        //初始选中第一个 
        this.toggleCanCompound.isOn = true;
        this.resetList();
        if (G.GuideMgr.isGuiding(EnumGuide.HunGuShengHua)) {
            G.DataMgr.hunliData.hunguMergeData.autoAppendEquipByDrop(4, 100);
            this.updatePanel();

        }
        G.GuideMgr.processGuideNext(EnumGuide.HunGuShengHua, EnumGuide.HunGuShengHuaOpenPanel);
    }

    protected onClose() {
        this.resetEquipList();
        this.resetMaterialList();
    }

    private onClickRuler() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(483), "玩法说明");
    }

    // private onClickPreviewEquip() {
    //     G.ViewCacher.tipsView.open(this.previewEquipItem.getTipData(), TipFrom.equip);
    // }

    private onClickHunguGroupItem(index: number) {
        this.curfirstSelectedIndex = index;
        let subList = this.hunguGroupList.GetSubList(index);
        if (subList)
            subList.Selected = 0;
        this.cursecondSelectedIndex = 0;
        this.resetEquipList();
        this.resetMaterialList();
        this.updatePanel();
    }



    private onToggleChange(ison: boolean) {
        this.curfirstSelectedIndex = 0;
        this.cursecondSelectedIndex = 0;
        this.resetList();
    }

    /**点击升华 */
    public onClickMerge() {
        G.ViewCacher.functionGuideView.setGuideDes(false);
        G.GuideMgr.processGuideNext(EnumGuide.HunGuShengHua, EnumGuide.HunGuShengHuaClickBtnConfirm);

        // let porf = G.DataMgr.heroData.profession;
        // let curProf = this.mergeData.getCurrenProf();
        // if (porf != 0 && porf != curProf) {
        //     //非本职业
        //     G.TipMgr.showConfirm("您当前升华的魂骨不是本职业的，是否继续升华?", ConfirmCheck.noCheck, '确定|取消', (state: MessageBoxConst) => {
        //         if (state == MessageBoxConst.yes) {
        //             this.sendMergeMessage();
        //         }
        //     });
        // }
        // else {
        //     this.sendMergeMessage();
        // }

        this.sendMergeMessage();
    }

    private onAddEquipChange() {
        this.updatePanel();
    }

    private updatePanel() {
        this.refreshData();
        if (this.curMergeGroupDatas == null) {
            G.TipMgr.addMainFloatTip("没有可升华物品!");
            this.toggleCanCompound.isOn = false;
            return;
        }
        if (this.curMergeGroupDatas[this.curfirstSelectedId] == null)
            return;

        this.curMergeData = this.curMergeGroupDatas[this.curfirstSelectedId][this.cursecondSelectedIndex];

        if (this.curMergeData == null) {
            this.curfirstSelectedId = 0;
            this.cursecondSelectedIndex = 0;
            this.updatePanel();
            return;
        }

        let minamxLevel = this.mergeData.getCurLowEquipMinMaxLevel();
        let prof = this.mergeData.getCurrentEquipProf(this.curMergeData.m_ucTargetQuality);
        let mindata = this.mergeData.getHunguEquipData(this.curMergeData.m_ucEquipPart, this.curMergeData.m_ucTargetQuality,
            KeyWord.COLOR_GOLD, minamxLevel[0], prof);
        let maxdata = this.mergeData.getHunguEquipData(this.curMergeData.m_ucEquipPart, this.curMergeData.m_ucTargetQuality,
            this.curMergeData.m_ucTargetColour, minamxLevel[1], prof);

        if (mindata == null) {
            // uts.logErrorReportWithStack("@jackson>>>>>>>>>>" +
            //     uts.format("{0}__{1}__{2}__{3}", this.curMergeData.m_ucEquipPart, this.curMergeData.m_ucTargetQuality, minamxLevel[0], prof));
            return;
        }

        this.refreshList();
        this.refreshIconPreview(maxdata);
        this.refreshEquipList();
        this.refreshMaterialList();
        this.refreshTitle(mindata);
        this.refreshAttribute(mindata, maxdata);
        this.refreshRandAtt();
        this.refreshMaterial();
    }

    private curFirstDatas: number[] = [];

    private refreshData() {
        if (this.toggleCanCompound.isOn) {
            this.curMergeGroupDatas = G.DataMgr.hunliData.hunguMergeData.getCanMergeGroupData();
            this.curFirstDatas = G.DataMgr.hunliData.hunguMergeData.getGroupCanFirstDatas();
        }
        else {
            this.curMergeGroupDatas = G.DataMgr.hunliData.hunguMergeData.getAllMergeGroupData();
            this.curFirstDatas = G.DataMgr.hunliData.hunguMergeData.getGroupAllFirstDatas();
        }
        this.curfirstSelectedId = this.curFirstDatas[this.curfirstSelectedIndex];
    }


    /**刷新左侧列表 */
    private refreshList() {
        this.hunguGroupList.Count = this.curFirstDatas.length;
        let data = this.curMergeGroupDatas[this.curfirstSelectedId];
        if (data == null) return;

        for (let i = 0, con = this.curFirstDatas.length; i < con; i++) {
            let labelItem = this.hunguGroupList.GetItem(i);
            let isMerge = G.DataMgr.hunliData.hunguMergeData.isOneQualityMerge(this.curFirstDatas[i]);
            let name = KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, this.curFirstDatas[i]);
            let colorname = TextFieldUtil.getColorText(name, isMerge ? Color.GREEN : Color.GREY);
            let labelText = labelItem.findText('citem/normal/txtName');
            labelText.text = colorname;
            colorname = TextFieldUtil.getColorText(name, isMerge ? Color.GREEN : Color.WHITE);
            labelText = labelItem.findText('citem/selected/txtName');
            labelText.text = colorname;
            let tipmark = labelItem.findObject("citem/tipMark");
            tipmark.SetActive(isMerge);
        }

        //刷新子列表
        let subList = this.hunguGroupList.GetSubList(this.curfirstSelectedIndex);
        subList.Count = data.length;
        if (!subList.onClickItem) {
            subList.onClickItem = delegate(this, this.onClickMergeItem);
        }
        if (!subList.onVirtualItemChange) {
            subList.onVirtualItemChange = delegate(this, this.onVirtualItemChange);
        }
        this.hunguGroupList.Refresh();
        subList.Refresh();
    }

    private onClickMergeItem(index: number) {
        this.cursecondSelectedIndex = index;
        this.resetEquipList();
        this.resetMaterialList();
        this.updatePanel();
    }

    private onVirtualItemChange(listitem: ListItem): void {
        let index = listitem._index;
        let norName = ElemFinder.findText(listitem.gameObject, "normal/name");
        let sleName = ElemFinder.findText(listitem.gameObject, "selected/name");
        let tipmark = ElemFinder.findObject(listitem.gameObject, "tipMark");

        let data = this.curMergeGroupDatas[this.curfirstSelectedId][index];
        if (data == null)
            return;
        let quality = KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, this.curMergeGroupDatas[this.curfirstSelectedId][index].m_ucTargetQuality);
        let part = KeyWord.getDesc(KeyWord.GROUP_HUNGU_EQUIP_PART, this.curMergeGroupDatas[this.curfirstSelectedId][index].m_ucEquipPart);
        let name = quality.replace("魂骨", part);
        if (this.mergeData.isOneEquipMerge(this.curMergeGroupDatas[this.curfirstSelectedId][index].m_iID)) {
            //绿色
            norName.text = TextFieldUtil.getColorText(name, Color.GREEN);
            sleName.text = TextFieldUtil.getColorText(name, Color.GREEN);
            tipmark.SetActive(true);
        }
        else {
            norName.text = TextFieldUtil.getColorText(name, Color.GREY);
            sleName.text = TextFieldUtil.getColorText(name, Color.WHITE);
            tipmark.SetActive(false);
        }
    }

    private onClickEquipList(index: number) {
        this.curEquipIndex = index;
        if (this.mergeData.curMergeEquipDatas[index] == null) {
            let selePanel = G.Uimgr.createForm<HunguSelectView>(HunguSelectView);
            selePanel.open(index, this.mergeData.curMergeEquipDatas[index], this.id, this.curMergeData.m_iID, 1);
            selePanel.onClickCloseCall = delegate(this, this.onSelectedPanelCloseCall);
            //设置选中
            for (let i = 0, len = this.equipList.Count; i < len; i++) {
                this.hunguEquipItems[i].hideSelected();
            }
            this.hunguEquipItems[index].showSelected();
        }
        else {
            this.mergeData.curMergeEquipDatas[index] = null;
            this.updatePanel();
        }
    }

    private onSelectedPanelCloseCall() {
        if (this.mergeData.curMergeEquipDatas[this.curEquipIndex] == null)
            this.hunguEquipItems[this.curEquipIndex].hideSelected();
        else
            this.hunguEquipItems[this.curEquipIndex].showSelected();
    }

    onClickMaterialList(index: number) {
        this.curMaterialIndex = index;
        if (this.mergeData.curMergeMaterialDatas[index] == null) {
            let selePanel = G.Uimgr.createForm<HunguSelectView>(HunguSelectView);
            if (selePanel != null) {
                if (G.GuideMgr.isGuiding(EnumGuide.HunGuShengHua))
                    selePanel.open(index, this.mergeData.curMergeMaterialDatas[index], this.id, this.curMergeData.m_iID, 3);
                else
                    selePanel.open(index, this.mergeData.curMergeMaterialDatas[index], this.id, this.curMergeData.m_iID, 2);
                selePanel.onClickCloseCall = delegate(this, this.onSelectedPanelCloseCallMaterial);
            }
            //设置选中
            for (let i = 0, len = this.equipList.Count; i < len; i++) {
                this.hunguMaterialItems[i].hideSelected();
            }
            this.hunguMaterialItems[index].showSelected();
        }
        else {
            this.mergeData.curMergeMaterialDatas[index] = null;
            this.updatePanel();
        }
    }

    private onSelectedPanelCloseCallMaterial() {
        if (this.mergeData.curMergeMaterialDatas[this.curMaterialIndex] == null)
            this.hunguMaterialItems[this.curMaterialIndex].hideSelected();
        else
            this.hunguMaterialItems[this.curMaterialIndex].showSelected();
    }

    private isFirstOpen = true;
    /**
     * 重置列表（列表切换筛选 和 可升华数据变化）
     */
    private resetList() {
        //初始默认为 0 0  列表变化规则 子列表向下递进，如果无则选第一个  父列表向下递进，如果无，则第一个
        this.refreshData();
        if (this.curMergeGroupDatas == null) {
            G.TipMgr.addMainFloatTip("没有可升华物品!");
            this.toggleCanCompound.isOn = false;
            return;
        }
        if (this.curfirstSelectedIndex in this.curFirstDatas) {
            let data = this.curMergeGroupDatas[this.curfirstSelectedId];
            if (data[this.cursecondSelectedIndex] == null) {
                //子节点消失
                this.cursecondSelectedIndex = 0;
            }
        }
        else {
            //父节点消失
            this.curfirstSelectedIndex = 0;
            this.cursecondSelectedIndex = 0;
        }
        this.curfirstSelectedId = this.curFirstDatas[this.curfirstSelectedIndex];
        this.resetEquipList();
        this.resetMaterialList();

        this.refreshList();
        if (this.isFirstOpen) {
            this.hunguGroupList.Selected = -1;
            this.isFirstOpen = false;
        }
        else {
            this.hunguGroupList.Selected = this.curfirstSelectedIndex;
            let subList = this.hunguGroupList.GetSubList(this.curfirstSelectedIndex);
            if (subList) {
                subList.Selected = this.cursecondSelectedIndex;
            }
        }
        this.updatePanel();
    }



    /**刷新预览图标 */
    private refreshIconPreview(data: GameConfig.ThingConfigM) {
        //获取当前材料的最低的星级
        this.previewEquipItem.updateById(data.m_iID);
        this.previewEquipItem.updateIcon();
        let percent: number = this.mergeData.getMergePercent(this.curMergeData.m_iID);
        this.txtProbability.text = uts.format("{0}%", percent);
        if (this.mergeData.isMergeEquipFinish()) {
            let level = this.mergeData.getCurLowEquipMinMaxLevel();
            let levelstr = "";
            level[1] = 10;
            if (level[0] == level[1])
                levelstr = level[0].toString();
            else
                levelstr = uts.format("{0}~{1}", level[0], level[1]);
            this.txtDescribe.text = uts.format("{0}%获得{1}星青色魂骨", percent, TextFieldUtil.getColorText(levelstr, Color.GREEN));
            this.previewEquipItem.setIconAlpha(1);
        }
        else {
            this.txtDescribe.text = "升华可获得青色魂骨";
            this.previewEquipItem.setIconAlpha(0.5);
        }
    }

    /**刷新装备材料（中间那两个） */
    private refreshEquipList() {
        let mat = this.mergeData.getCanAddEquip(this.curMergeData.m_iID);
        let tip = mat.length > 0;
        let iscanmerge = this.mergeData.isOneEquipMerge(this.curMergeGroupDatas[this.curfirstSelectedId][this.cursecondSelectedIndex].m_iID)
        for (let i = 0; i < this.mergeData.mergeEquipMaxNumber; i++) {
            this.hunguEquipItems[i].updata(this.mergeData.curMergeEquipDatas[i], tip && iscanmerge && this.mergeData.curMergeEquipDatas[i] == null);
        }
    }

    /**刷新装备辅助材料（中间那八个） */
    private refreshMaterialList() {
        let mat = this.mergeData.getCanAddMaterials();
        let tip = mat.length > 0;
        let iscanmerge = this.mergeData.isOneEquipMerge(this.curMergeGroupDatas[this.curfirstSelectedId][this.cursecondSelectedIndex].m_iID)
        let percent: number = this.mergeData.getMergePercent(this.curMergeData.m_iID);
        for (let i = 0; i < this.mergeData.mergeMaterialMaxNumber; i++) {
            this.hunguMaterialItems[i].updata(this.mergeData.curMergeMaterialDatas[i], tip && iscanmerge && this.mergeData.curMergeMaterialDatas[i] == null && percent < 100);
        }
    }

    private resetEquipList() {
        this.mergeData.curMergeEquipDatas = [];
    }

    private resetMaterialList() {
        this.mergeData.curMergeMaterialDatas = [];
    }

    private refreshTitle(data: GameConfig.ThingConfigM) {
        this.itemNodeTitle.setTitleName(data.m_szName);
        let fight = FightingStrengthUtil.calStrength(data.m_astBaseProp);
        this.itemNodeTitle.setFighting(fight);
    }

    private refreshAttribute(minCfg: GameConfig.ThingConfigM, maxCfg: GameConfig.ThingConfigM) {
        //属性范围
        this.NodeAttribute.clearAttribute();
        for (let i = 0, con = minCfg.m_astBaseProp.length; i < con; i++) {
            this.NodeAttribute.addAttribute(minCfg.m_astBaseProp[i].m_ucPropId, minCfg.m_astBaseProp[i].m_ucPropValue);
        }
        for (let i = 0, con = maxCfg.m_astBaseProp.length; i < con; i++) {
            this.NodeAttribute.addScendAttribute(maxCfg.m_astBaseProp[i].m_ucPropId, maxCfg.m_astBaseProp[i].m_ucPropValue);
        }
        this.NodeAttribute.updateAttributeNodeShow();
    }

    private refreshRandAtt() {
        //随机属性固定显示10星的
        let prof = this.mergeData.getCurrentEquipProf(this.curMergeData.m_ucTargetQuality);
        let roundData = this.mergeData.getHunguEquipData(this.curMergeData.m_ucEquipPart, this.curMergeData.m_ucTargetQuality, this.curMergeData.m_ucTargetColour, 10, prof);
        let data = this.mergeData.getHunguEquipRandPropBuId(roundData.m_iRandProbID);
        this.randAttList.Count = data.m_astRandPropAtt.length;
        for (let i = 0, con = data.m_astRandPropAtt.length; i < con; i++) {
            let cfg = data.m_astRandPropAtt[i];
            let txtName = ElemFinder.findText(this.randAttList.GetItem(i).gameObject, "txtName");
            let des = uts.format("{0}:{1}%~{2}%", KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, cfg.m_ucPropId), cfg.m_iPropValueMin / 100, cfg.m_iPropValueMax / 100);
            txtName.text = TextFieldUtil.getColorText(des, Color.getColorById(cfg.m_ucColor));
        }
    }

    /**右下角那个材料 */
    private refreshMaterial() {


        this.itemConsumeMaterial.updateByMaterialItemData(this.curMergeData.m_iConsumableID, this.curMergeData.m_iConsumableNumber);
        if (!this.mergeData.isMergeEquipFinish()) {
            this.itemConsumeMaterial.setDescribeActive(true);
            this.itemConsumeMaterial.setFirstButtonAction(false);
            this.itemConsumeMaterial.setDescribe(TextFieldUtil.getColorText("请放入升华的魂骨", Color.GREY));
        }
        else {
            //物品放入完毕 判断材料
            if (this.itemConsumeMaterial.getMaterialSatisfy()) {
                //材料满足
                this.itemConsumeMaterial.setDescribeActive(false);
                this.itemConsumeMaterial.setFirstButtonAction(true);
            }
            else {
                //材料不够
                this.itemConsumeMaterial.setDescribeActive(true);
                this.itemConsumeMaterial.setFirstButtonAction(false);
                let num = this.itemConsumeMaterial.getMaterialNumber();
                let des = uts.format("升华所需要材料{0}/{1}", num[0].toString(), num[1].toString());
                this.itemConsumeMaterial.setDescribe(TextFieldUtil.getColorText(des, Color.GREY));
            }
        }
    }

    private sendMergeMessage() {
        this.mergeData.sendMergeRequest(this.curMergeData.m_iID);
    }

    /**
     * 升华失败响应
     */
    public mergeDefeatedResponse() {
        //失败特效
        this.playEffect();
        this.playDefeatedEffect();
        this.addTimer("playEffectEnd", 1000, 1, delegate(this, this.effectPlayEnd));
    }

    /**
     * 升华成功响应
     */
    public mergeSuccendResponse() {
        //成功特效
        this.playEffect();
        this.playSuccendEffect();
        this.addTimer("playEffectEnd", 1000, 1, delegate(this, this.effectPlayEnd));
    }

    /**
     * 通用特效
     */
    private playEffect() {
        for (let i = 0; i < this.mergeData.mergeEquipMaxNumber; i++) {
            let item = this.mergeData.curMergeEquipDatas[i];
            if (item != null) {
                this.hunguEquipItems[i].showEffect();
            }
        }
        this.effectNode.SetActive(true);
    }

    private playSuccendEffect() {
        this.succendEffectNode.SetActive(true);
        G.TipMgr.addMainFloatTip("升华成功");
    }

    private playDefeatedEffect() {
        this.defeatedEffectNode.SetActive(true);
        G.TipMgr.addMainFloatTip("升华失败");
    }

    private effectPlayEnd() {
        this.closeEffect();
        this.resetList();
    }

    private closeEffect() {
        for (let i = 0; i < this.mergeData.mergeEquipMaxNumber; i++) {
            this.hunguEquipItems[i].hdieEffect();
        }
        this.defeatedEffectNode.SetActive(false);
        this.succendEffectNode.SetActive(false);
        this.effectNode.SetActive(false);
    }
    
}

