import { EnumEffectRule, EnumGuildStoreFilterRule } from 'System/constants/GameEnum';
import { ThingData } from 'System/data/thing/ThingData';
import { ThingItemData } from 'System/data/thing/ThingItemData';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { EnumGuildFuncSubTab } from 'System/guild/view/GuildFuncPanel';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager';
import { TipFrom } from 'System/tip/view/TipsView';
import { DropDownCtrl } from 'System/uilib/DropDownCtrl';
import { IconItem, ArrowType } from 'System/uilib/IconItem';
import { List, ListItem } from 'System/uilib/List';
import { TabSubForm } from 'System/uilib/TabForm';
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from 'System/utils/ColorUtil';
import { DataFormatter } from 'System/utils/DataFormatter';
import { GameIDUtil } from 'System/utils/GameIDUtil';
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { UIUtils } from 'System/utils/UIUtils';
import { KeyWord } from '../../constants/KeyWord';
import { LimitSelectedItem } from '../../ItemPanels/LimitSelectedItem';

class GuildStoreFilterType {
    rule: EnumGuildStoreFilterRule;
    desc: string;

    constructor(rule: EnumGuildStoreFilterRule, desc: string) {
        this.rule = rule;
        this.desc = desc;
    }
}

export class GuildStoreSubPanel extends TabSubForm {


    private readonly MinDisplayCnt = 12;
    //单次捐献最大数量
    private readonly maxSelectedCnt = Macros.MAX_GUILD_STORE_IN_NUM;
    private curSelectedCnt = 0;
    private static readonly filterTypes: number[] = [0, Macros.GUILD_STORE_LOG_INTO, Macros.GUILD_STORE_LOG_TAKEOUT];

    //左侧面板
    private listDonate: List;
    private listDataDonate: ThingItemData[] = [];
    private donateItems: IconItem[] = [];

    // private settingDrop: DropDownCtrl;
    private filterDrop: DropDownCtrl;

    private btnSort: UnityEngine.GameObject;
    private btnDestroy: UnityEngine.GameObject;
    private btnCancelDestroy: UnityEngine.GameObject;

    private labelDestroy: UnityEngine.UI.Text;

    private filterTypes: GuildStoreFilterType[] = [];
    private settingTypes: GuildStoreFilterType[] = [];

    //右侧面板
    private donatePanel: UnityEngine.GameObject;
    private recordPanel: UnityEngine.GameObject;
    private tabGroup: UnityEngine.UI.ActiveToggleGroup;

    private btnDonate: UnityEngine.GameObject;
    private listThing: List;
    private listDataThing: ThingItemData[] = [];
    private thingItems: IconItem[] = [];
    private btnAll: UnityEngine.GameObject;
    private labelAll: UnityEngine.UI.Text;
    private textCurDonateValue: UnityEngine.UI.Text;
    private textDonateValue: UnityEngine.UI.Text;
    private txtEquipNumber: UnityEngine.UI.Text;
    private selectedMap: { [guidKey: string]: boolean } = {};
    private isSelectAll: boolean = false;

    private logFilterDrop: UnityEngine.UI.Dropdown;
    private listLog: List;
    private infos: Protocol.CSFMTKillerOneInfo[];

    /**是否摧毁模式*/
    private isDestroyMode: boolean = false;

    private itemIcon_Normal: UnityEngine.GameObject;

    private colorName: string[] = ["蓝色", "紫色", "橙色", "金色", "红色", "青色"];
    private colors: number[] = [KeyWord.COLOR_BLUE, KeyWord.COLOR_PURPLE, KeyWord.COLOR_ORANGE, KeyWord.COLOR_GOLD, KeyWord.COLOR_RED, KeyWord.COLOR_PINK];
    private color2Index: { [color: number]: number } = null;

    private thingSelectedPanel: GuildStorSelectedPanel;
    private btnSetting: UnityEngine.GameObject;
    private btnAllSelected: UnityEngine.GameObject;

    constructor() {
        super(EnumGuildFuncSubTab.store);
    }

    protected resPath(): string {
        return UIPathData.GuildStoreView;
    }

    protected initElements() {
        super.initElements();
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        //左侧面板
        this.listDonate = this.elems.getUIList('listDonate');
        this.listDonate.Count = Macros.MAX_GUILD_STROE_GRID_COUNT;

        // this.settingDrop = new DropDownCtrl();
        // this.settingDrop.setComponents(this.elems.getElement("settingDrop"));
        this.filterDrop = new DropDownCtrl();
        this.filterDrop.setComponents(this.elems.getElement("filterDrop"));

        this.filterTypes.push(new GuildStoreFilterType(EnumGuildStoreFilterRule.all, '所有'));
        this.filterTypes.push(new GuildStoreFilterType(EnumGuildStoreFilterRule.allEquip, '所有装备'));
        for (let i = EnumGuildStoreFilterRule.equipLvMin; i <= EnumGuildStoreFilterRule.equipLvMax; i++) {
            this.filterTypes.push(new GuildStoreFilterType(i, uts.format('{0}', KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, i))));
        }

        let cnt = this.filterTypes.length;
        let filterOptions: string[] = [];
        let settingOptions: string[] = [];
        for (let i = 0; i < cnt; i++) {
            filterOptions.push(this.filterTypes[i].desc);
            //if (EnumGuildStoreFilterRule.all != this.filterTypes[i].rule) 
            {
                this.settingTypes.push(this.filterTypes[i]);
                settingOptions.push(this.filterTypes[i].desc);
            }
        }
        this.filterDrop.addOptions(filterOptions);
        // this.settingDrop.addOptions(settingOptions);

        this.btnSort = this.elems.getElement('btnSort');
        this.btnDestroy = this.elems.getElement('btnDestroy');
        this.btnCancelDestroy = this.elems.getElement('btnCancelDestroy');
        this.labelDestroy = this.elems.getText('labelDestroy');

        //右侧面板
        this.tabGroup = this.elems.getToggleGroup("tabGroup");
        this.donatePanel = this.elems.getElement("donatePanel");
        this.btnDonate = this.elems.getElement('btnDonate');
        this.listThing = this.elems.getUIList("list2");
        this.btnAll = this.elems.getElement("btnSelectAll");
        this.labelAll = this.elems.getText("labelAll");
        this.textCurDonateValue = this.elems.getText("textCurDonateValue");
        this.textDonateValue = this.elems.getText("textDonateValue");
        this.txtEquipNumber = this.elems.getText("txtEquipNumber");
        this.recordPanel = this.elems.getElement("recordPanel");
        this.logFilterDrop = this.elems.getDropdown("logFilterDrop");
        this.listLog = this.elems.getUIList("listLog");

        this.thingSelectedPanel = new GuildStorSelectedPanel();
        this.thingSelectedPanel.setComponents(this.elems.getElement("selectedPanel"), this.colorName)
        this.btnSetting = this.elems.getElement("btnSetting");
        this.btnAllSelected = this.elems.getElement("btnAllSelected");
        if (this.color2Index == null) {
            this.color2Index = {};
            this.color2Index[KeyWord.COLOR_BLUE] = 0;
            this.color2Index[KeyWord.COLOR_PURPLE] = 1;
            this.color2Index[KeyWord.COLOR_ORANGE] = 2;
            this.color2Index[KeyWord.COLOR_GOLD] = 3;
            this.color2Index[KeyWord.COLOR_RED] = 4;
        }
    }

    protected initListeners() {
        // this.settingDrop.onValueChanged = delegate(this, this.onSettingDropValueChanged);
        this.filterDrop.onValueChanged = delegate(this, this.onFilterDropValueChanged);
        this.logFilterDrop.onValueChanged = delegate(this, this.onLogFilterDropValueChanged);

        this.addToggleGroupListener(this.tabGroup, this.onTabGroupClick);
        this.addListClickListener(this.listDonate, this.onClickDonateList);
        this.listDonate.onVirtualItemChange = delegate(this, this.onDonateListChange);
        this.addListClickListener(this.listThing, this.onClickThingList);


        this.addClickListener(this.btnDonate, this.onClickBtnDonate);
        this.addClickListener(this.btnSort, this.onClickBtnSort);
        this.addClickListener(this.btnDestroy, this.onClickBtnDestroy);
        this.addClickListener(this.btnCancelDestroy, this.onClickBtnCancelDestroy);
        this.addClickListener(this.btnAll, this.onClickBtnAll);

        this.addClickListener(this.btnSetting, this.onClickBtnSetting);
        this.addClickListener(this.btnAllSelected, this.onClickAllSelected);

        this.thingSelectedPanel.onClickCall = delegate(this, this.onClickConfirm);

    }

    protected onOpen() {
        this.tabGroup.Selected = 0;
        this.setDistroyMode(false);

        this.updateThingList();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildStoreRequest());
        //仓库记录
        this.elems.setDropdownSortingOrder(this.logFilterDrop, this.sortingOrder + 9);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildStoreGetRecordListRequest());
    }

    protected onClose() {
    }

    onGuildStoreChanged(): void {
        this.checkManageBtns();

        // 捐献设置
        // let index = 0;
        // let guildDepotInfo: Protocol.GuildStoreInfo = G.DataMgr.guildData.guildDepotInfo;
        // if (null != guildDepotInfo) {
        //     let len = this.settingTypes.length;
        //     for (let i = 0; i < len; i++) {
        //         if (this.settingTypes[i].rule == guildDepotInfo.m_ucLimitStage) {
        //             index = i;
        //             break;
        //         }
        //     }
        // }
        // this.settingDrop.OptionIndex = index;

        this.updateDonateList();
        this.updateThingList();
        // this.txtEquipNumber.text = uts.format("{0}/{1}", G.DataMgr.guildData.guildStoreDonateTimers, this.maxSelectedCnt);
    }

    onGuildGradeChanged() {
        // 自己的宗门职位变化，需要
        this.checkManageBtns();
    }

    private onTabGroupClick(index: number) {
        this.donatePanel.SetActive(index == 0);
        this.recordPanel.SetActive(index == 1);
        if (index == 1) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildStoreGetRecordListRequest());
        }
    }

    private checkManageBtns() {
        let isManager = G.DataMgr.guildData.isManager;
        this.btnDestroy.gameObject.SetActive(isManager);
        this.btnSort.gameObject.SetActive(isManager);
        // this.settingDrop.gameObject.SetActive(isManager);
        this.btnSetting.SetActive(isManager);
    }

    private updateDonateList(): void {
        let guildData = G.DataMgr.guildData;
        let cnt: number = 0;
        if (null != guildData.guildDepotInfo && null != guildData.guildDepotInfo.m_stItemList) {
            cnt = guildData.guildDepotInfo.m_stItemList.length;
        }

        this.listDataDonate.length = 0;

        for (let i = 0; i < cnt; i++) {
            let guildStoreItem = guildData.guildDepotInfo.m_stItemList[i];
            if (0 == guildStoreItem.m_uiItemID) {
                continue;
            }

            let itemData: ThingItemData = new ThingItemData();
            itemData.config = ThingData.getThingConfig(guildStoreItem.m_uiItemID);
            itemData.data = {} as Protocol.ContainerThingInfo;
            itemData.data.m_iThingID = guildStoreItem.m_uiItemID;
            itemData.data.m_iNumber = guildStoreItem.m_uiCount;
            itemData.data.m_stThingProperty = guildStoreItem.m_stThingProperty;
            itemData.data.m_usPosition = i;
            itemData.containerID = Macros.CONTAINER_TYPE_GUILDSTORE;
            this.listDataDonate.push(itemData);
        }

        // cnt = this.listDataDonate.length;

        // let oldItemCnt = this.donateItems.length;
        // let showItemCnt = this.listDonate.Count;
        // for (let i = 0; i < showItemCnt; i++) {
        //     let listItem = this.listDonate.GetItem(i);
        //     let iconItem: IconItem;
        //     if (i < oldItemCnt) {
        //         iconItem = this.donateItems[i];
        //     } else {
        //         this.donateItems.push(iconItem = new IconItem());
        //         iconItem.effectRule = EnumEffectRule.none;
        //         iconItem.setUsualIconByPrefab(this.itemIcon_Normal, listItem.findObject("icon"));
        //     }

        //     if (i < cnt) {
        //         iconItem.updateByThingItemData(this.listDataDonate[i]);
        //         listItem.Selectable = true;
        //     } else {
        //         iconItem.updateByThingItemData(null);
        //         listItem.Selectable = false;
        //     }
        //     iconItem.updateIcon();
        // }

        // if (cnt == 0) {
        //     this.listDonate.Selected = -1;
        // }
        this.listDonate.Refresh();
    }


    private updateThingList(): void {
        this.listDataThing.length = 0;

        let hunguDropLevel: number = -1;
        let hunguColor: number = -1;
        let equipShowLevel: number = -1;
        let equipColor: number = -1;

        let guildDepotInfo: Protocol.GuildStoreInfo = G.DataMgr.guildData.guildDepotInfo;
        if (null != guildDepotInfo) {
            hunguDropLevel = guildDepotInfo.m_ucHunGuDropLevel;
            hunguColor = guildDepotInfo.m_ucHunGuColor;
            equipShowLevel = guildDepotInfo.m_ucEquipDropLevel;
            equipColor = guildDepotInfo.m_ucEquipColor;
        }
        let filterValue = this.filterTypes[this.filterDrop.OptionIndex].rule;
        let rawDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
        if (rawDatas) {
            for (let positionKey in rawDatas) {
                let bagItemData = rawDatas[positionKey];
                if (bagItemData.data == null)
                    continue;
                let thingConfig: GameConfig.ThingConfigM = bagItemData.config;
                if (thingConfig.m_uiGuildSell > 0 && !GameIDUtil.isBindingThing(bagItemData.data.m_iThingID, bagItemData.data.m_stThingProperty)) {
                    if (GameIDUtil.isHunguEquipID(thingConfig.m_iID)) {
                        if (thingConfig.m_ucColor < hunguColor)
                            continue;
                        if (thingConfig.m_iDropLevel < hunguDropLevel)
                            continue;
                    }
                    else if (GameIDUtil.isEquipmentID(thingConfig.m_iID)) {
                        if (thingConfig.m_ucColor < equipColor)
                            continue;
                        if (thingConfig.m_ucStage < equipShowLevel)
                            continue;
                    }
                    if (EnumGuildStoreFilterRule.all != filterValue) {
                        if (EnumGuildStoreFilterRule.allEquip == filterValue) {
                            if (GameIDUtil.isHunguEquipID(thingConfig.m_iID)) continue;
                            if (!GameIDUtil.isEquipmentID(thingConfig.m_iID)) continue;
                        }
                        else {
                            if (!GameIDUtil.isHunguEquipID(thingConfig.m_iID)) continue;
                            if (GameIDUtil.getEquipStageById(thingConfig.m_iID) < filterValue) continue;
                        }
                    }
                    this.listDataThing.push(bagItemData);
                }
            }
        }

        let cnt = this.listDataThing.length;
        let displayCnt = cnt;
        if (displayCnt < this.MinDisplayCnt) {
            displayCnt = this.MinDisplayCnt;
        }

        this.listThing.Count = displayCnt;
        let oldIconCnt = this.thingItems.length;
        for (let i = 0; i < displayCnt; i++) {
            let iconItem: IconItem;
            let listItem = this.listThing.GetItem(i);
            if (i < oldIconCnt) {
                iconItem = this.thingItems[i];
            } else {
                this.thingItems.push(iconItem = new IconItem());
                iconItem.effectRule = EnumEffectRule.none;
                iconItem.arrowType = ArrowType.bag;
                iconItem.setUsualIconByPrefab(this.itemIcon_Normal, listItem.findObject("icon"));
            }
            if (i < cnt) {
                iconItem.updateByThingItemData(this.listDataThing[i]);
                listItem.Selectable = true;
            } else {
                iconItem.updateByThingItemData(null);
                listItem.Selectable = false;
            }
            iconItem.updateIcon();
        }
        this.listThing.Selecteds = null;
        this.onListSelectedChanged();
    }

    updateLogList() {
        let filterType = GuildStoreSubPanel.filterTypes[this.logFilterDrop.value];
        let m_stItemList: Protocol.GuildStoreLog[] = G.DataMgr.guildData.guildRecordList.m_stItemList;

        let len: number = 0;
        if (null != m_stItemList) {
            len = m_stItemList.length;
        }

        let logStrs: string[] = [];
        for (let i: number = len - 1; i >= 0; i--) {
            let guildStoreLog: Protocol.GuildStoreLog = m_stItemList[i] as Protocol.GuildStoreLog;
            if (0 != filterType && guildStoreLog.m_ucType != filterType) {
                continue;
            }
            if (guildStoreLog.m_ucItemCnt > 0) {
                for (let storeThing of guildStoreLog.m_stItem) {
                    logStrs.push(this.toLogStr(guildStoreLog, storeThing));
                }
            }
            else {
                logStrs.push(this.toLogStr(guildStoreLog, null));
            }
        }
        let cnt = logStrs.length;
        this.listLog.Count = cnt;
        for (let i = 0; i < cnt; i++) {
            ElemFinder.findText(this.listLog.GetItem(i).gameObject, 'textLog').text = logStrs[i];
            ElemFinder.findObject(this.listLog.GetItem(i).gameObject, 'normal0').SetActive(i % 2 == 0);
            ElemFinder.findObject(this.listLog.GetItem(i).gameObject, 'normal1').SetActive(i % 2 == 1);
        }
    }

    private onClickDonateList(index: number) {
        if (!this.isDestroyMode) {
            let tipData = this.donateItems[index].getTipData();
            if (null != tipData) {
                G.ViewCacher.tipsView.open(tipData, TipFrom.guildStore);
            }
            this.listDonate.Selected = -1;
        }
        else {
            let sels = this.listDonate.Selecteds;
            if (sels.length > Macros.MAX_GUILD_STORE_IN_NUM) {
                sels.splice(Macros.MAX_GUILD_STORE_IN_NUM, 1);
                this.listDonate.GetItem(index).Selected = false;
                G.TipMgr.addMainFloatTip(uts.format("单次最多销毁{0}个", Macros.MAX_GUILD_STORE_IN_NUM));
            }
        }
    }

    private onDonateListChange(item: ListItem) {
        let iconItem = item.data.iconItem as IconItem;
        if (this.listDataDonate == null) return;
        let data = this.listDataDonate[item.Index];
        if (!item.data.iconItem) {
            let parent = item.findObject('icon');
            iconItem = new IconItem();
            iconItem.effectRule = EnumEffectRule.none;
            iconItem.arrowType = ArrowType.bag;
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, parent);
            item.data.iconItem = iconItem;
        }
        this.donateItems[item.Index] = item.data.iconItem;
        if (data != null && data.data.m_iThingID > 0) {
            iconItem.updateByThingItemData(data);
            item.Selectable = true;
        } else {
            iconItem.updateByThingItemData(null);
            item.Selectable = false;
        }
        iconItem.updateIcon();
    }

    private isDonateTip = false;
    private onClickThingList(index: number) {
        if (this.listThing.GetItem(index).Selected == false) {
            this.onListSelectedChanged();
        }
        else {
            this.tryClickThingList(MessageBoxConst.yes, true, index);
            // if (this.maxSelectedCnt - G.DataMgr.guildData.guildStoreDonateTimers == 0) {
            //     this.listThing.GetItem(index).Selected = false;
            //     G.TipMgr.showConfirm("今日捐赠次数已用尽", ConfirmCheck.noCheck, '确定');
            // }
            // else {
            // this.listThing.GetItem(index).Selected = false;
            // if (!this.isDonateTip) {
            //     G.TipMgr.showConfirm(uts.format("今日还可捐赠{0}件伙伴装备、魂骨装备，是否继续选择？", this.maxSelectedCnt - G.DataMgr.guildData.guildStoreDonateTimers),
            //         ConfirmCheck.withCheck, '确定|取消', delegate(this, this.tryClickThingList, index));
            // }
            // else {
            //     this.tryClickThingList(MessageBoxConst.yes, true, index);
            // }
            // }
        }
    }

    private tryClickThingList(status: MessageBoxConst, isCheckSelected: boolean, index: number) {
        if (status == MessageBoxConst.yes) {
            this.isDonateTip = isCheckSelected;
            let sels = this.listThing.Selecteds;
            if (sels.length > this.maxSelectedCnt /* - G.DataMgr.guildData.guildStoreDonateTimers */) {
                sels.splice(this.maxSelectedCnt /* - G.DataMgr.guildData.guildStoreDonateTimers */, 1);
                this.listThing.GetItem(index).Selected = false;
                G.TipMgr.addMainFloatTip(uts.format("单次最多捐赠{0}件装备", this.maxSelectedCnt));
            }
            else {
                this.listThing.GetItem(index).Selected = true;
            }
            this.onListSelectedChanged();
        }

    }

    private onClickConfirm(val: number[]) {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildStoreSetLimitstage(val[0], this.colors[val[1]], val[2], this.colors[val[3]]));
    }

    // private onSettingDropValueChanged(value: number) {
    //     let stage = this.settingTypes[value].rule;
    //     // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildStoreSetLimitstage(stage));
    // }

    private onFilterDropValueChanged(value: number) {
        // this.updateDonateList();
        this.updateThingList();
    }

    private onClickBtnDonate() {
        let selecteds = this.listThing.Selecteds;
        let selectedCnt = 0;
        if (null != selecteds) {
            selectedCnt = selecteds.length;
        }
        selectedCnt = Math.min(selectedCnt, this.listDataThing.length);

        if (selectedCnt > 0) {
            let arr: Protocol.ContainerThing[] = [];
            for (let i = 0; i < selectedCnt; i++) {
                let itemData = this.listDataThing[selecteds[i]];
                let vo = {} as Protocol.ContainerThing;
                vo.m_iThingID = itemData.data.m_iThingID;
                vo.m_iNumber = itemData.data.m_iNumber;
                vo.m_usPosition = itemData.data.m_usPosition;
                arr.push(vo);
            }
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildStoreIntoRequest(arr));
        } else {
            G.TipMgr.addMainFloatTip('请勾选需要捐献的物品');
        }
    }

    private onClickBtnSort() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildStoreSortRequest());
    }

    private onClickBtnDestroy() {
        if (this.isDestroyMode) {
            // 当前在摧毁模式中
            let selecteds = this.listDonate.Selecteds;
            if (null == selecteds || selecteds.length == 0) {
                G.TipMgr.addMainFloatTip('未选择任何物品');
                this.setDistroyMode(false);
            } else {
                G.TipMgr.showConfirm(G.DataMgr.langData.getLang(268), ConfirmCheck.noCheck, '摧毁|取消', delegate(this, this.onConfirmDestroy));
            }
        } else {
            // 进入摧毁模式
            this.setDistroyMode(true);
        }
    }

    /**确定摧毁*/
    private onConfirmDestroy(status: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == status) {
            let selecteds = this.listDonate.Selecteds;
            if (null != selecteds) {
                let things: Protocol.ContainerThing[] = [];
                for (let idx of selecteds) {
                    let thingVo: Protocol.ContainerThing = {} as Protocol.ContainerThing;
                    thingVo.m_iThingID = this.listDataDonate[idx].data.m_iThingID;
                    thingVo.m_iNumber = this.listDataDonate[idx].data.m_iNumber;
                    thingVo.m_usPosition = this.listDataDonate[idx].data.m_usPosition;
                    things.push(thingVo);
                }
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildStoreDeleteRequest(things));
            } else {
                G.TipMgr.addMainFloatTip('未选择任何物品');
            }
        }
        this.setDistroyMode(false);
    }

    private onClickBtnCancelDestroy() {
        this.setDistroyMode(false);
    }

    private setDistroyMode(isDestroyMode: boolean) {
        this.isDestroyMode = isDestroyMode;
        this.labelDestroy.text = this.isDestroyMode ? '确认摧毁' : '摧毁物品';
        this.updataBtnStatus(!this.isDestroyMode);
        if (isDestroyMode) {
            // 开启多选
            this.listDonate.MultipleChoice = true;
            // 显示取消摧毁按钮
            this.btnCancelDestroy.SetActive(true);
            //仓库全选
            this.btnAllSelected.SetActive(true);
        } else {
            this.listDonate.MultipleChoice = false;
            this.btnCancelDestroy.SetActive(false);
            this.btnAllSelected.SetActive(false);
        }
    }

    private updataBtnStatus(show: boolean) {
        UIUtils.setButtonClickAble(this.btnDonate, show);
        UIUtils.setButtonClickAble(this.btnSort, show);
    }

    private onLogFilterDropValueChanged(value: number) {
        this.updateLogList();
    }

    private toLogStr(recordInfo: Protocol.GuildStoreLog, thingInfo: Protocol.GuildStoreThing): string {
        let timeStr: string = DataFormatter.second2mmddmm(recordInfo.m_uiTime);
        let itemStr: string = '';

        if (null != thingInfo) {
            let thingConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(thingInfo.m_iThingID);
            if (thingConfig != null) {
                itemStr = uts.format('{0}X{1}。', TextFieldUtil.getColorText(thingConfig.m_szName, Color.getColorById(thingConfig.m_ucColor)), thingInfo.m_iThingNumber);
            }
        }

        let str: string;
        let name = TextFieldUtil.getColorText(recordInfo.m_szNickName, Color.GREEN);

        switch (recordInfo.m_ucType) {
            case Macros.GUILD_STORE_LOG_TAKEOUT:
                str = TextFieldUtil.getColorText(uts.format('{0} {1}{3}了{2}', timeStr, name, itemStr, '兑换'), Color.DEFAULT_WHITE);
                break;
            case Macros.GUILD_STORE_LOG_INTO:
                str = TextFieldUtil.getColorText(uts.format('{0} {1}{3}了{2}', timeStr, name, itemStr, '捐献'), Color.DEFAULT_WHITE);
                break;
            default:
        }
        return str;
    }

    private onClickBtnAll() {
        if (this.isSelectAll) {
            this.listThing.Selected = -1;
        } else {
            let cnt = this.listDataThing.length;
            cnt = Math.min(cnt, this.maxSelectedCnt /* - G.DataMgr.guildData.guildStoreDonateTimers */);
            let vals: number[] = [];
            for (let i = 0; i < cnt; i++) {
                vals.push(i);
            }
            this.listThing.Selecteds = vals;
            if (cnt >= this.maxSelectedCnt)
                G.TipMgr.addMainFloatTip(uts.format("单次最多捐赠{0}件装备", this.maxSelectedCnt));
        }
        this.onListSelectedChanged();
        // G.TipMgr.addMainFloatTip(uts.format("每天最多捐赠{0}件装备", this.maxSelectedCnt));
    }

    private onClickBtnSetting() {
        let data: Protocol.GuildStoreInfo = G.DataMgr.guildData.guildDepotInfo;
        if (data == null) return;
        this.thingSelectedPanel.onOpen(data.m_ucHunGuDropLevel - 3, this.color2Index[data.m_ucHunGuColor], data.m_ucEquipDropLevel - 3, this.color2Index[data.m_ucEquipColor]);
    }

    private onClickAllSelected() {
        let con = this.listDataDonate.length;
        //单次可操作物品数量有限制
        con = Math.min(con, Macros.MAX_GUILD_STORE_IN_NUM);
        let vals: number[] = [];
        for (let i = 0; i < con; i++) {
            vals.push(i);
        }
        this.listDonate.Selecteds = vals;
    }

    /**更新全选按钮状态*/
    private onListSelectedChanged(): void {
        let selecteds = this.listThing.Selecteds;
        let selectedCnt = 0;
        let selectCount = 0;
        if (null != selecteds) {
            selectedCnt = selecteds.length;
        }
        selectedCnt = Math.min(selectedCnt, this.listDataThing.length);
        this.isSelectAll = selectedCnt == this.listDataThing.length && this.listDataThing.length > 0;
        this.labelAll.text = this.isSelectAll ? '取消全选' : '全选';

        let sellVal = 0;
        for (let i = 0; i < selectedCnt; i++) {
            let itemData = this.listDataThing[selecteds[i]];
            let thingConfig: GameConfig.ThingConfigM = itemData.config;
            let itemCount = itemData.data.m_iNumber;
            selectCount += itemCount;
            if (thingConfig.m_uiGuildSell) {
                sellVal += thingConfig.m_uiGuildSell * itemCount;
            }
        }
        this.textDonateValue.text = uts.format(TextFieldUtil.getColorText(sellVal.toString(), Color.GREEN));
        this.textCurDonateValue.text = uts.format(TextFieldUtil.getColorText(DataFormatter.cutWan(G.DataMgr.heroData.guildDonateCur).toString(), Color.GREEN));
    }
}

class GuildStorSelectedPanel {

    private gameObject: UnityEngine.GameObject;

    private btnCancel: UnityEngine.GameObject;
    private btnConfirm: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;

    private hunguDropLevelItem: LimitSelectedItem;
    private hunguColorItem: LimitSelectedItem;
    private equipShowLevelItem: LimitSelectedItem;
    private equipColorItem: LimitSelectedItem;

    onClickCall: (info: number[]) => {};

    setComponents(go: UnityEngine.GameObject, colors: string[]) {
        this.gameObject = go;
        this.btnCancel = ElemFinder.findObject(go, "buttonNode/btnCancel");
        this.btnConfirm = ElemFinder.findObject(go, "buttonNode/btnConfirm");
        this.mask = ElemFinder.findObject(go, "mask");

        this.hunguDropLevelItem = new LimitSelectedItem();
        this.hunguColorItem = new LimitSelectedItem();
        this.equipShowLevelItem = new LimitSelectedItem();
        this.equipColorItem = new LimitSelectedItem();
        this.hunguDropLevelItem.setComponents(ElemFinder.findObject(go, "Scroll/Viewport/Content/hunguDropLevelItem"));
        this.hunguColorItem.setComponents(ElemFinder.findObject(go, "Scroll/Viewport/Content/hunguColorItem"));
        this.equipShowLevelItem.setComponents(ElemFinder.findObject(go, "Scroll/Viewport/Content/equipDropLevelItem"));
        this.equipColorItem.setComponents(ElemFinder.findObject(go, "Scroll/Viewport/Content/equipColorItem"));
        this.hunguDropLevelItem.setTitleName("魂骨年份选择");
        this.hunguColorItem.setTitleName("魂骨颜色选择");
        this.equipShowLevelItem.setTitleName("装备阶级选择");
        this.equipColorItem.setTitleName("装备颜色选择");
        this.hunguDropLevelItem.setDropLevelList(18, 0, 2);
        this.hunguColorItem.setListName(colors, 6);
        this.equipShowLevelItem.setDropLevelList(18, 1, 2);
        this.equipColorItem.setListName(colors, 5);

        Game.UIClickListener.Get(this.btnCancel).onClick = delegate(this, this.onClickCancel);
        Game.UIClickListener.Get(this.btnConfirm).onClick = delegate(this, this.onClickConfirm);
        Game.UIClickListener.Get(this.mask).onClick = delegate(this, this.onClose);
    }

    onClose() {
        this.gameObject.SetActive(false);
    }

    onOpen(hunguDropLevel: number, hunguColor: number, equipShowLevel: number, equipColor: number) {
        this.gameObject.SetActive(true);
        this.hunguDropLevelItem.setSelectedIndex(hunguDropLevel);
        this.hunguColorItem.setSelectedIndex(hunguColor);
        this.equipShowLevelItem.setSelectedIndex(equipShowLevel);
        this.equipColorItem.setSelectedIndex(equipColor);
    }

    private onClickCancel() {
        this.onClose();
    }

    private onClickConfirm() {
        this.onClose();
        this.invokeClickConfirm();
    }

    private invokeClickConfirm() {
        if (this.onClickCall != null) {
            this.onClickCall(this.getCurrentInfo());
        }
    }

    private getCurrentInfo(): number[] {
        let info: number[] = [];
        info[0] = this.hunguDropLevelItem.getSelctedIndex() + 3;
        info[1] = this.hunguColorItem.getSelctedIndex();
        info[2] = this.equipShowLevelItem.getSelctedIndex() + 3;
        info[3] = this.equipColorItem.getSelctedIndex();
        return info;
    }
}
