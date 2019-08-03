import { EnumGuide, GameIDType } from 'System/constants/GameEnum';
import { ThingItemData } from "System/data/thing/ThingItemData";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from 'System/global';
import { HunGuPanel } from 'System/hunli/HunGuPanel';
import { Macros } from 'System/protocol/Macros';
import { ItemTipData } from 'System/tip/tipData/ItemTipData';
import { ItemTipBase } from 'System/tip/view/ItemTipBase';
import { CommonForm, UILayer, TextGetSet } from "System/uilib/CommonForm";
import { ArrowType, IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';
import { ListItemCtrl } from 'System/uilib/ListItemCtrl';
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from "System/utils/ColorUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { GameIDUtil } from "../utils/GameIDUtil";
import { KeyWord } from '../constants/KeyWord';
import { ConfirmCheck, MessageBoxConst } from '../tip/TipManager';
import { HunGuView } from '../hungu/HunGuView';

export class HunguEquipItem extends ListItemCtrl {
    private iconRoot: UnityEngine.GameObject;
    private txtName: UnityEngine.UI.Text;
    private txtFight: UnityEngine.UI.Text;
    private txtButtonName: UnityEngine.UI.Text;
    btnEquip: UnityEngine.GameObject;

    public iconItem: IconItem;
    onClickButton: (index: number) => void;
    private index: number = -1;

    setComponents(go: UnityEngine.GameObject, itemIcon_normal: UnityEngine.GameObject, index: number, id: number = 0) {
        this.index = index;

        this.iconRoot = ElemFinder.findObject(go, "icon");
        this.txtName = ElemFinder.findText(go, "name");
        this.txtFight = ElemFinder.findText(go, "fight");
        this.txtButtonName = ElemFinder.findText(go, "btnEquip/txtButtonName");
        this.btnEquip = ElemFinder.findObject(go, "btnEquip");

        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(itemIcon_normal, this.iconRoot);

        Game.UIClickListener.Get(this.btnEquip).onClick = delegate(this, this.onEquipClick);
    }

    /**
     * 
     * @param equipData 
     * @param isHunguType 魂骨类型 0无意义 1显示星级 2显示概率
     */
    update(equipData: ThingItemData, isHunguType: number = 0) {
        this.iconItem.updateByThingItemData(equipData);
        this.iconItem.updateIcon();
        let color = Color.getColorById(equipData.config.m_ucColor);
        let equipName = TextFieldUtil.getColorText(equipData.config.m_szName, color);
        if (GameIDUtil.isHunguEquipID(equipData.config.m_iID)) {
            if (isHunguType == 1) {
                let starlevel = uts.format("{0}星", TextFieldUtil.NUMBER_LIST[equipData.config.m_ucStage]);;
                equipName = uts.format("{0}   {1}", equipName, starlevel);
                this.txtFight.text = uts.format("基础战斗力 {0}", G.DataMgr.hunliData.getHunguEquipBasicFight(equipData.config));
                this.iconItem.closeStarLevelFlag();
            }
            else if (isHunguType == 2) {
                let probability = uts.format("{0}%", equipData.config.m_ucStage);;
                equipName = uts.format("{0}   {1}", equipName, probability);
                this.txtFight.text = uts.format("基础战斗力 {0}", G.DataMgr.hunliData.getHunguEquipBasicFight(equipData.config));
                this.iconItem.closeStarLevelFlag();
                //判断是否已装备 放入 取出
                if (G.DataMgr.hunliData.hunguMergeData.isMaterialInMaterialList(equipData)) {
                    this.setButtonName("取出");
                }
                else {
                    this.setButtonName("放入");
                }
            }
            else {
                this.txtFight.text = uts.format("战斗力 {0}", G.DataMgr.hunliData.getHunguEquipFight(equipData.config, equipData.data));
                this.iconItem.openStarLevelFlag();
            }
        }
        else {
            this.txtFight.text = uts.format("战斗力 {0}", equipData.zdl.toString());
            this.iconItem.openStarLevelFlag();
        }
        this.txtName.text = equipName;

    }

    onEquipClick() {
        if (this.onClickButton != null) {
            this.onClickButton(this.index);
        }
    }

    setButtonName(name: string) {
        this.txtButtonName.text = name;
    }
}

export class HunguSelectView extends CommonForm {
    private equipData: ThingItemData;
    private equipIndex: number;

    private txtTitle: TextGetSet;
    private txtSubhead: TextGetSet;
    private txtOwnTipFlag: TextGetSet;
    private list: List;
    private itemIcon_Normal: UnityEngine.GameObject;
    private closeMask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;
    private tipPanel: UnityEngine.GameObject;
    private itemTipBase: ItemTipBase;

    private tipPanelOwn: UnityEngine.GameObject;
    private itemTipBaseOwn: ItemTipBase;

    private equipItems: HunguEquipItem[] = [];
    private equipDatas: ThingItemData[] = [];
    private selected: number = 0;
    private tipData: ItemTipData = new ItemTipData();

    guideBtn: UnityEngine.GameObject;
    private btnLine: UnityEngine.GameObject;
    private functionId: number;
    private args: any[];

    onClickCloseCall: () => void;

    constructor() {
        super(0);
    }

    /**
     * 
     * @param index 标记打开的位置
     * @param equipData 当前装备信息
     * @param functionId 功能面板
     * @param args 额外参数
     */
    open(index: number, equipData: ThingItemData, functionId: number, ...args) {
        this.equipData = equipData;
        this.equipIndex = index;
        this.functionId = functionId;
        this.args = args;
        super.open();
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.HunguSelectView;
    }

    protected initElements() {
        super.initElements();
        this.txtTitle = new TextGetSet(this.elems.getText("txtTitle"));
        this.txtSubhead = new TextGetSet(this.elems.getText("txtSubhead"));
        this.txtOwnTipFlag = new TextGetSet(this.elems.getText("txtOwnTipFlag"));
        this.list = this.elems.getUIList("equipList");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.closeMask = this.elems.getElement("closeMask");
        this.btnClose = this.elems.getElement("btnClose");
        this.tipPanel = this.elems.getElement("tipPanel");
        this.itemTipBase = new ItemTipBase();
        this.itemTipBase.setBaseInfoComponents(this.elems.getUiElements('baseInfo'), this.itemIcon_Normal);
        this.itemTipBase.setThingInfoComponents(this.elems.getElement("thingInfo"));
        this.itemTipBase.setEquipInfoComponents(this.elems.getElement("equipInfo"), this.elems.getUiElements('equipInfo'));

        this.tipPanel.SetActive(false);

        this.tipPanelOwn = this.elems.getElement("tipPanelOwn");
        this.itemTipBaseOwn = new ItemTipBase();
        this.itemTipBaseOwn.setBaseInfoComponents(this.elems.getUiElements('baseInfoOwn'), this.itemIcon_Normal);
        this.itemTipBaseOwn.setThingInfoComponents(this.elems.getElement("thingInfoOwn"));
        this.itemTipBaseOwn.setEquipInfoComponents(this.elems.getElement("equipInfoOwn"), this.elems.getUiElements('equipInfoOwn'));
        this.tipPanelOwn.SetActive(false);

        this.btnLine = this.elems.getElement("btnLine");
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.closeMask, this.onCloseClick);
        this.addClickListener(this.btnClose, this.onCloseClick);
        this.list.onClickItem = delegate(this, this.onListClick);
        Game.UIClickListener.Get(this.btnLine).onClick = delegate(this, this.onClickLine);
    }


    protected onOpen() {
        if (this.functionId == KeyWord.OTHER_FUNCTION_HUNGUN_MERGE) {
            this.setTitleName("材料添加");
            this.setFlagName("已添加");
        }
        else {
            this.setTitleName("魂骨装备");
            this.setFlagName("已装备");
        }
        this.findEquipsInBag();
        this.updatePanel();
        this.list.Selected = 0;
        this.onListClick(0);

        if (this.equipData == null) {
            this.tipPanelOwn.SetActive(false);
        }
        else {
            this.tipPanelOwn.SetActive(true);
            let ownTipDate = new ItemTipData();
            ownTipDate.setTipData(this.equipData.config, this.equipData.data);
            this.itemTipBaseOwn.updateInfo(ownTipDate);
        }
        G.GuideMgr.processGuideNext(EnumGuide.HunGuShengHua, EnumGuide.HunGuShengHuaClickMaterialList);
        G.GuideMgr.processGuideNext(EnumGuide.HunGuActive, EnumGuide.HunGuActive_SelectEquipGrid);
    }

    protected onClose() {
        this.setSubhead("");
        G.GuideMgr.processGuideNext(EnumGuide.HunGuActive, EnumGuide.HunGuActive_ClickEquip);
        G.GuideMgr.processGuideNext(EnumGuide.HunGuShengHua, EnumGuide.HunguShengHuaSelectMaterial);
        if (this.onClickCloseCall != null)
            this.onClickCloseCall();
        let hungupanel = G.Uimgr.getSubFormByID(HunGuView, KeyWord.OTHER_FUNCTION_HUNGUN) as HunGuPanel;
        if (hungupanel != null && hungupanel.isOpened) {
            hungupanel.setEquipSelected();
        }
    }

    private onCloseClick() {
        this.close();
    }

    private onListClick(index: number) {
        this.selected = index;
        let equip = this.equipDatas[index];
        if (equip) {
            this.tipData.setTipData(equip.config, equip.data);
            this.itemTipBase.updateInfo(this.tipData);
            this.tipPanel.SetActive(true);
        }
    }

    private onClickLine() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS);
        // if (this.equipIndex < G.DataMgr.hunliData.HUNGU_COUNT_NORMAL) {
        //     //普通魂骨 个人boss
        //     G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS);
        // }
        // else {
        //     //外附魂骨 抽奖
        //     G.ActionHandler.executeFunction(KeyWord.ACT_FUNCTION_STARSTREASURY);
        // }
        this.close();
    }

    private findEquipsInBag() {
        if (this.functionId == KeyWord.OTHER_FUNCTION_HUNGUN) {
            //魂骨界面打开
            let rawObjs = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.REBIRTH_EQUIP, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            let cnt = rawObjs.length;
            for (let i = 0; i < cnt; i++) {
                let rawObj = rawObjs[i];
                if (rawObj.config.m_ucProf != 0 && rawObj.config.m_ucProf != G.DataMgr.heroData.profession) continue;
                if (G.DataMgr.hunliData.Hungu_Index2Part[this.equipIndex].indexOf(rawObj.config.m_iMainClass) > -1) {
                    this.equipDatas.push(rawObj);
                }
            }
            this.equipDatas.sort(this.sortEquipData);
        }
        else if (this.functionId == KeyWord.OTHER_FUNCTION_HUNGUN_MERGE) {
            //升华有两个筛选,一个是魂骨装备,一个是填充材料
            let mergeid = this.args[0] as number;
            let opentype = this.args[1] as number;
            if (opentype == 1) {
                //魂骨装备
                this.equipDatas = G.DataMgr.hunliData.hunguMergeData.getCanAddEquip(mergeid);
                this.equipDatas.sort((a: ThingItemData, b: ThingItemData) => {
                    if (a.config.m_ucProf != b.config.m_ucProf) {
                        //职业不同
                        if (a.config.m_ucProf == G.DataMgr.heroData.profession)
                            return -1;
                        else if (b.config.m_ucProf == G.DataMgr.heroData.profession)
                            return 2;
                        else
                            return 1;
                    }
                    else {
                        //星级
                        return b.config.m_ucStage - a.config.m_ucStage;
                    }
                });
            }
            else if (opentype == 2) {
                //填充材料
                this.equipDatas = G.DataMgr.hunliData.hunguMergeData.getCanAddMaterials();
                this.equipDatas.sort((a: ThingItemData, b: ThingItemData) => {
                    if (b.config.m_ucStage == a.config.m_ucStage) {
                        return a.config.m_iDropLevel - b.config.m_iDropLevel;
                    }
                    //星级
                    return b.config.m_ucStage - a.config.m_ucStage;
                });
                let mergeData = G.DataMgr.hunliData.hunguMergeData;
                this.setSubhead(uts.format("当前概率：{0}% 还可放入材料数：{1}", mergeData.getMergePercent(this.args[0]), mergeData.mergeMaterialMaxNumber - mergeData.getMergeMaterialNumber()));
            }
            else if (opentype == 3) {
                //升华引导特殊材料
                this.equipDatas = G.DataMgr.hunliData.hunguMergeData.getGuideMaterials();
                let mergeData = G.DataMgr.hunliData.hunguMergeData;
                this.setSubhead(uts.format("当前概率：{0}% 还可放入材料数：{1}", mergeData.getMergePercent(this.args[0]), mergeData.mergeMaterialMaxNumber - mergeData.getMergeMaterialNumber()));
            }

        }
    }

    private sortEquipData(a: ThingItemData, b: ThingItemData): number {
        return b.zdl - a.zdl;
    }

    private updatePanel() {
        this.list.Count = this.equipDatas.length;
        this.list.Selected = this.selected;
        for (let i = 0; i < this.list.Count; i++) {
            if (this.equipItems[i] == null) {
                this.equipItems[i] = new HunguEquipItem();
                this.equipItems[i].setComponents(this.list.GetItem(i).gameObject, this.itemIcon_Normal, i);
                this.equipItems[i].iconItem.arrowType = ArrowType.bag;
            }
            let equipData = this.equipDatas[i];
            if (this.functionId == KeyWord.OTHER_FUNCTION_HUNGUN_MERGE) {
                let opentype = this.args[1] as number;
                this.equipItems[i].update(equipData, opentype);
                if (opentype == 1) {
                    if (this.equipData == null)
                        this.equipItems[i].setButtonName("加入");
                    else
                        this.equipItems[i].setButtonName("替换");
                }

            }
            else {
                this.equipItems[i].update(equipData);
                this.equipItems[i].setButtonName("装备");
            }
            this.equipItems[i].onClickButton = delegate(this, this.onClickListButton);
        }
        if (this.list.Count > 0) {
            this.guideBtn = this.equipItems[0].btnEquip;
        }
    }

    private onClickListButton(index: number) {
        if (this.functionId == KeyWord.OTHER_FUNCTION_HUNGUN) {
            //魂骨界面打开
            G.ActionHandler.takeOnEquip(this.equipDatas[index], 0);
            this.close();
        }
        else if (this.functionId == KeyWord.OTHER_FUNCTION_HUNGUN_MERGE) {
            let mergeData = G.DataMgr.hunliData.hunguMergeData;
            //升华有两个筛选,一个是魂骨装备,一个是填充材料
            let mergeid = this.args[0] as number;
            let opentype = this.args[1] as number;
            if (opentype == 1) {
                //魂骨升华界面打开
                let data = this.equipDatas[index];
                if (data.config.m_ucProf != G.DataMgr.heroData.profession && data.config.m_ucProf != 0 /**&& mergeData.isShowMergeProfMessage == false*/) {
                    G.TipMgr.showConfirm("您选择的不是本职业魂骨，升华后原有红色魂骨将会消失，是否继续", ConfirmCheck.noCheck, '是|否',
                        (stage: MessageBoxConst, isCheckSelected: boolean) => {
                            if (MessageBoxConst.yes == stage) {
                                // mergeData.isShowMergeProfMessage = isCheckSelected;
                                this.addMergeEquip(index);
                            }
                        });
                }
                else if (mergeData.isShowMergeMessage == false && mergeData.isShowMergeProfMessage == false) {
                    G.TipMgr.showConfirm("升华后原有红色魂骨将会消失，是否继续", ConfirmCheck.autoCheck, '是|否', delegate(this, this.onMergeConfirmClick, index));
                }
                else {
                    this.addMergeEquip(index);
                }
            }
            else if (opentype == 2) {
                let data = this.equipDatas[index];
                if (mergeData.isMaterialInMaterialList(data)) {
                    mergeData.removeMaterial(data);
                }
                else {
                    mergeData.addMaterial(data, mergeid);
                }
                //刷新文字显示
                this.setSubhead(uts.format("当前概率：{0}% 还可放入材料数：{1}", mergeData.getMergePercent(mergeid), mergeData.mergeMaterialMaxNumber - mergeData.getMergeMaterialNumber()));
                mergeData.addEquipCfgChange();
                this.equipItems[index].update(data, 2);
            }
            else if (opentype == 3) {
                this.setSubhead(uts.format("当前概率：{0}% 还可放入材料数：{1}", mergeData.getMergePercent(mergeid), mergeData.mergeMaterialMaxNumber - mergeData.getMergeMaterialNumber()));
                mergeData.addMaterial(this.equipDatas[index], mergeid);
                mergeData.addEquipCfgChange();
                this.close();
            }
        }
    }

    private onMergeConfirmClick(stage: number, isCheckSelected: boolean, index: number): void {
        if (MessageBoxConst.yes == stage) {
            G.DataMgr.hunliData.hunguMergeData.isShowMergeMessage = isCheckSelected;
            this.addMergeEquip(index);
        }
    }

    private addMergeEquip(index: number) {
        G.DataMgr.hunliData.hunguMergeData.curMergeEquipDatas[this.equipIndex] = this.equipDatas[index];
        G.DataMgr.hunliData.hunguMergeData.addEquipCfgChange();
        this.close();
    }

    private setTitleName(name: string) {
        this.txtTitle.text = name;
    }

    public setSubhead(des: string) {
        this.txtSubhead.text = des;
    }

    private setFlagName(name: string) {
        this.txtOwnTipFlag.text = name;
    }

    guiddeOnClickBtn() {
        this.equipItems[0].onEquipClick();
        G.GuideMgr.processGuideNext(EnumGuide.HunGuActive, EnumGuide.HunGuActive_ClickEquip);
        G.GuideMgr.processGuideNext(EnumGuide.HunGuShengHua, EnumGuide.HunguShengHuaSelectMaterial);
        this.close();
    }

}