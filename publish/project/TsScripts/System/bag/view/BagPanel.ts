import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { Global as G } from "System/global"
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { ITipData } from 'System/tip/tipData/ITipData'
import { Macros } from 'System/protocol/Macros'
import { HeroData } from 'System/data/RoleData'
import { BagItemData } from 'System/bag/BagItemData'
import { ThingData } from "System/data/thing/ThingData"
import { ThingItemData } from "System/data/thing/ThingItemData"
import { GameIDUtil } from "System/utils/GameIDUtil"
import { BagModule } from "System/bag/BagModule"
import { ConfirmCheck } from 'System/tip/TipManager'
import { KeyWord } from "System/constants/KeyWord"
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { IconItem, ArrowType } from "System/uilib/IconItem"
import { ItemTipData } from "System/tip/tipData/ItemTipData"
import { TipFrom } from 'System/tip/view/TipsView'
import { UIPathData } from "System/data/UIPathData"
import { PetData } from "System/data/pet/PetData"
import { TipType, EnumGuide, GameIDType, EnumEffectRule } from "System/constants/GameEnum"
import { List, ListItem } from "System/uilib/List"
import { FixedList } from "System/uilib/FixedList"
import { UseItemGuider } from 'System/guide/cases/UseItemGuider'
import { TabSubForm } from 'System/uilib/TabForm'
import { DecomposeView } from 'System/bag/view/DecomposeView'
import { ItemTipBase } from 'System/tip/view/ItemTipBase'
import { BatchUseView } from "System/bag/view/BatchUseView"
import { UIUtils } from 'System/utils/UIUtils'
import { ItemMergeView } from 'System/Merge/ItemMergeView'
import { CurrencyTip } from 'System/uilib/CurrencyTip'
import { ElemFinder } from 'System/uilib/UiUtility'
import { BagView, EnumBagTab } from 'System/bag/view/BagView'


/*/////////////////////背包界面///////////////////////*/

/**左边的仓库 */
export class StorePanelLeft {

    public isOpen: boolean = false;

    /**当前选中的索引（tab切换：背包，仓库）*/
    private storeSelectIndex: number = 0;
    /**仓库所有的格子（解锁，未解锁）*/
    private listDataStore: BagItemData[];
    /**仓库全部Item的父物体*/
    private storeListCtrl: List;

    /**仓库的整理*/
    private btnStoreClear: UnityEngine.GameObject = null;
    /**仓库的取出*/
    private btnTakeOut: UnityEngine.GameObject = null;

    /**背包的放入*/
    private btnPutIn: UnityEngine.GameObject = null;

    /**放入按钮多选效果*/
    private selectPutIn: UnityEngine.GameObject = null;
    /**取出按钮多选效果*/
    private selectTakeOut: UnityEngine.GameObject = null;

    private btnClose: UnityEngine.GameObject = null;

    //private onClickCloseCallBake: () => void;
    //private onClickOpenCallBake: () => void;

    private itemIcon_Normal: UnityEngine.GameObject;

    private gameObject: UnityEngine.GameObject;


    setComponent(go: UnityEngine.GameObject, itemIconPrefab: UnityEngine.GameObject) {
        this.gameObject = go;

        this.storeListCtrl = ElemFinder.getUIList(ElemFinder.findObject(go, "storePanle/storeItemList"));
        this.storeListCtrl.SetSlideAppearRefresh();
        this.btnTakeOut = ElemFinder.findObject(go, "btnTakeOut");
        this.btnStoreClear = ElemFinder.findObject(go, "btnStoreClear");
        this.btnClose = ElemFinder.findObject(go, "bg/btnClose");

        this.itemIcon_Normal = itemIconPrefab;

        //设置仓库要克隆的格子个数
        this.storeListCtrl.Count = BagView.MAX_CAPACITY_CK;

        this.storeListCtrl.onVirtualItemChange = delegate(this, this.showStoreUI);
        this.storeListCtrl.onClickItem = delegate(this, this.onstoreItemClick);

        Game.UIClickListener.Get(this.btnTakeOut).onClick = delegate(this, this.onClickTakeOut);
        Game.UIClickListener.Get(this.btnStoreClear).onClick = delegate(this, this.onClickStoreClear);
        Game.UIClickListener.Get(this.btnClose).onClick = delegate(this, this.onClickClose);

        this.showStoreTab(0);

    }

    //public addCloseCallBack(callback: () => void) {
    //    this.onClickCloseCallBake = callback;
    //}

    //public addOpenCallBack(callback: () => void) {
    //    this.onClickOpenCallBake = callback;
    //}

    private showStoreUI(item: ListItem) {
        let iconItem = item.data.storeiconItem as IconItem;
        let data = this.listDataStore[item.Index];
        let bagItem = this.listDataStore[item.Index];
        if (!item.data.storeiconItem) {
            let parent = item.findObject('bagBg');
            iconItem = new IconItem();
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, parent);
            iconItem.showBg = true;
            iconItem.arrowType = ArrowType.bag;
            iconItem.isCompareAllPetEquip = true;
            iconItem.effectRule = EnumEffectRule.none;
            item.data.storeiconItem = iconItem;
        }
        iconItem.updateByThingItemData(data.thingData);
        iconItem.updateIcon();
        bagItem.iconItem = iconItem;
        //背包是否锁定
        let bagLock = item.findObject('bagLock');
        if (data.isLocked) {
            bagLock.SetActive(true);
        } else {
            bagLock.SetActive(false);
        }
    }

    public openStore() {
        if (this.isOpen == false) {
            this.gameObject.SetActive(true);
            this.isOpen = true;
            this.storeListCtrl.SetSlideAppearRefresh();
            this.showStoreTab(0);
            //this.doOpenCallBack();
        }
    }

    public closeStore() {
        if (this.isOpen) {
            this.gameObject.SetActive(false);
            this.isOpen = false;
            //this.doCloseCallBack();
        }
    }

    public updateView() {
        this.showStoreTab(0);
    }

    /**取出 */
    private onClickTakeOut() {

    }

    /**整理 */
    private onClickStoreClear() {
        G.ModuleMgr.bagModule.sortStore();
    }

    /**关闭 */
    private onClickClose() {
        this.closeStore();
    }

    ///**执行关闭回调 */
    //private doCloseCallBack() {
    //    if (this.onClickCloseCallBake != null)
    //        this.onClickCloseCallBake();
    //}

    ///**执行打开回调 */
    //private doOpenCallBack() {
    //    if (this.onClickOpenCallBake != null)
    //        this.onClickOpenCallBake();
    //}

    /**
     * 仓库点击
     * @param index
     */
    private onstoreItemClick(index: number): void {
        //背包格子不是钻石解锁（即已经解锁的格子）
        if (this.listDataStore[index].unlockType != BagItemData.UNLOCK_TYPE_GOLD) {
            //背包格子有数据，显示数据
            if (this.listDataStore[index].thingData != null) {
                //如果是多选，不能弹出详细信息框                 
                if (!this.storeListCtrl.MultipleChoice) {
                    let tipData = this.listDataStore[index].iconItem.getTipData();

                    G.ViewCacher.tipsView.open(tipData, TipFrom.takeOut);

                    //确保弹出物品信息面板，不现实选中状态
                    this.storeListCtrl.Selected = -1;
                }
            }
            //显示全部物品的页面-没有物品
            else {
                //确保弹出物品信息面板，不现实选中状态
                this.storeListCtrl.Selected = -1;
            }
            //显示全部物品的页面-格子未解锁
        } else {
            this.storeListCtrl.Selected = -1;
            //G.TipMgr.showConfirm("解锁背包格子", ConfirmCheck.noCheck, '确定');
            this.extendContainerTo(this.listDataStore[index], Macros.CONTAINER_TYPE_ROLE_STORE);
        }
    }

    /**
    * 仓库数据处理  
    */
    private showStoreTab(tabIndex: number): void {
        let tabKey: number = tabIndex;
        let rawDatas: { [position: number]: ThingItemData } = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_STORE);
        let i: number;
        if (null == this.listDataStore) {
            this.listDataStore = new Array<BagItemData>(BagView.MAX_CAPACITY_CK);
            for (i = 0; i < BagView.MAX_CAPACITY_CK; i++) {
                this.listDataStore[i] = new BagItemData();
                this.listDataStore[i].containerID = Macros.CONTAINER_TYPE_ROLE_STORE;
            }
        }
        // 先重置所有格子，锁定
        for (i = 0; i < BagView.MAX_CAPACITY_CK; i++) {
            this.listDataStore[i].reset(); // reset之后可以显示一个锁，用于数据未初始化的情况
            this.listDataStore[i].itemIndex = i;
        }
        if (G.DataMgr.thingData.storeCapacity >= BagView.DEFAULT_CAPACITY_CK) {
            // 数据已经正确初始化，初始化各个格子的数据
            // 先初始化所有格子的解锁状态
            for (i = 0; i < BagView.MAX_CAPACITY_CK; i++) {
                if (i >= G.DataMgr.thingData.storeCapacity) {
                    this.listDataStore[i].unlockType = BagItemData.UNLOCK_TYPE_GOLD;
                }
                else {
                    this.listDataStore[i].isLocked = false;
                }
            }
            // 接下来初始化已解锁的格子数据
            let rawObj: ThingItemData;
            //表示默认的全部显示tabKey == 0
            if (tabKey == 0) {
                // 全部页签按照服务器位置显示
                for (i = 0; i < G.DataMgr.thingData.storeCapacity; i++) {
                    rawObj = rawDatas[i];
                    if (null != rawObj) {
                        this.listDataStore[i].thingData = rawObj;
                        this.listDataStore[i].thingData.containerID = Macros.CONTAINER_TYPE_ROLE_STORE;
                    }
                }
            }
            else {
                //其他页签紧凑显示，不可拖动
                let itemPosList: number[] = new Array<number>();
                for (let posStr in rawDatas) {
                    // 进行过滤
                    rawObj = rawDatas[posStr];
                    //物品类型
                    if (tabIndex == rawObj.config.m_iBagClass) {
                        itemPosList.push(parseInt(posStr));
                    }
                    itemPosList.sort(this._sortByPosition);
                    for (i = itemPosList.length - 1; i >= 0; i--) {
                        rawObj = rawDatas[itemPosList[i]];
                        this.listDataStore[i].thingData = rawObj;
                        this.listDataStore[i].thingData.containerID = Macros.CONTAINER_TYPE_ROLE_STORE;
                    }
                }
            }
            //if (this.bagListCtrl != null) {
            //    this.showStoreUI(this.listDataStore);
            //}
            this.storeListCtrl.Refresh();
        }
    }

    /**
     * 扩展容器至某个格子。
     * @param extendToPos 扩展之后背包/仓库最后一个有效格子的位置。
     *
     */
    private extendContainerTo(slotItemData: BagItemData, containerType: number): void {
        if (!G.ModuleMgr.bagModule.checkContainerDataInit(containerType, true)) {
            return;
        }
        let capacity: number = G.ModuleMgr.bagModule.getContainerCapacity(containerType);
        let extendToPos: number = slotItemData.itemIndex;
        let spaceNum: number = extendToPos - capacity + 1;
        if (spaceNum < 1) {
            if (defines.has('_DEBUG')) {
                uts.assert(false, '扩容格子数错误！');
            }
            return;
        }
        if (BagItemData.UNLOCK_TYPE_GOLD == slotItemData.unlockType) {
            // 钻石解锁
            G.ModuleMgr.bagModule.extendContainerByYuanbao(containerType, spaceNum);
        }
    }

    private _sortByPosition(a: number, b: number): number {
        return a - b;
    }
}

export class BagPanel extends TabSubForm implements IGuideExecutor {

    public static readonly bagClass = [0, KeyWord.BAG_CLASS_EQUIP, KeyWord.BAG_CLASS_ITEM, KeyWord.BAG_CLASS_MATERIAL, KeyWord.BAG_CLASS_OTHER];

    private equipIconItem: IconItem = null;
    /**容器的属主，定义在协议中*/
    private m_containerType = Macros.CONTAINER_TYPE_ROLE_BAG;
    /** 背包开始的格子数量 */
    static DEFAULT_CAPACITY: number = 70;
    /** 背包最大格子数量 */
    static MAX_CAPACITY: number = 210;
    /**当前选中的索引（tab切换：背包，仓库）*/
    private bagSelectIndex: number = 0;
    /**背包所有的格子（解锁，未解锁）*/
    private listDataBag: BagItemData[];

    /**背包全部Item的父物体*/
    private bagListCtrl: List;

    /**背包的整理*/
    private btnBagClear: UnityEngine.GameObject = null;
    /**背包一键出售*/
    btnDecompose: UnityEngine.GameObject = null;
    /**合成*/
    private btnMerge: UnityEngine.GameObject = null;
    /**使用*/
    btnUse: UnityEngine.GameObject = null;
    /**丢弃按钮*/
    private btnDestroy: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;

    private openItemId: number = 0;

    /**物品*/
    private thingInfo: UnityEngine.GameObject;

    private equipInfo: UnityEngine.GameObject;
    /**tip数据*/
    private itemTipBase: ItemTipBase;
    private tipPanel: UnityEngine.GameObject;

    private curSelectedItemData: ThingItemData;

    private mainTimeCheck: boolean = false;

    private curSelectIndex: number = -1;
    /**是否是使用按钮|丢弃*/
    private isUseItme: boolean = true;

    private autoRefreshIdx = -1;

    private typeTab: UnityEngine.UI.ActiveToggleGroup;

    private rightPanelNode: UnityEngine.GameObject;
    private leftPanelNode: UnityEngine.GameObject;
    private storePanel: StorePanelLeft;
    /**魂币显示*/
    private currencyTip: CurrencyTip;
    /**仓库是否打开*/
    private isStoreOpen: boolean = false;
    private btnCloseTip: UnityEngine.GameObject;
    private btnCloseBag1: UnityEngine.GameObject;
    private btnCloseBag2: UnityEngine.GameObject;

    constructor() {
        super(EnumBagTab.bag);
    }


    protected resPath(): string {
        return UIPathData.BagPanel;
    }
    protected initElements(): void {
        this.rightPanelNode = this.elems.getElement("right");


        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        //左侧tip信息
        this.thingInfo = this.elems.getElement("thingInfo");
        this.equipInfo = this.elems.getElement("equipInfo");

        this.tipPanel = this.elems.getElement("tip");
        this.btnCloseTip = this.elems.getElement("closeTip");

        this.itemTipBase = new ItemTipBase();
        this.itemTipBase.setBaseInfoComponents(this.elems.getUiElements('baseInfo'), this.itemIcon_Normal);
        this.itemTipBase.setThingInfoComponents(this.thingInfo);
        this.itemTipBase.setEquipInfoComponents(this.equipInfo, this.elems.getUiElements('equipInfo'));

        this.btnBagClear = this.elems.getElement('btnBagClear');
        this.btnDecompose = this.elems.getElement('btnDecompose');
        this.btnMerge = this.elems.getElement('btnMerge');
        this.btnUse = this.elems.getElement('btnUse');
        this.btnDestroy = this.elems.getElement("btnDestroy");
        //  this.txtUse = this.elems.getText("txtUse");

        this.bagListCtrl = this.elems.getUIList('allItemList');
        //设置背包克隆160个
        this.bagListCtrl.Count = BagPanel.MAX_CAPACITY;
        this.bagListCtrl.onVirtualItemChange = delegate(this, this.showBagUI);

        this.typeTab = this.elems.getToggleGroup("typeTab");

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("currencyTip"));
        this.btnCloseBag1 = ElemFinder.findObject(this.rightPanelNode, "bg/btnClose1");
        this.btnCloseBag2 = ElemFinder.findObject(this.rightPanelNode, "bg/btnClose2");

        //左边仓库初始化
        this.leftPanelNode = this.elems.getElement("left");
        this.storePanel = new StorePanelLeft();
        this.storePanel.setComponent(this.leftPanelNode, this.itemIcon_Normal);
        //this.storePanel.addCloseCallBack(this.actionCloseStore);
        //this.storePanel.addOpenCallBack(this.actionOpenStore);

        this.storePanel.isOpen = true;
        this.storePanel.closeStore();
    }
    protected initListeners(): void {
        this.addClickListener(this.btnBagClear, this.onBagClear);
        this.addClickListener(this.btnDecompose, this.onBtnDecompose);
        this.addClickListener(this.btnMerge, this.onBtnMerge);
        this.addClickListener(this.btnUse, this.onBtnUse);
        this.addClickListener(this.btnDestroy, this.onBtnDestroy);
        this.addClickListener(this.btnCloseTip, this.onClickCloseTip);
        this.addListClickListener(this.bagListCtrl, this.onBagItemClick);
        this.addToggleGroupListener(this.typeTab, this.onClickTypeTab);

        this.addClickListener(this.btnCloseBag1, this.onClickClose);
        this.addClickListener(this.btnCloseBag2, this.onClickClose);
    }

    protected onOpen() {
        this.tipPanel.SetActive(false);
        UIUtils.setButtonClickAble(this.btnDestroy, false);
        UIUtils.setButtonClickAble(this.btnUse, false);
        this.bagListCtrl.SetSlideAppearRefresh();

        let funcLimitData = G.DataMgr.funcLimitData;
        //this.btnMerge.SetActive(funcLimitData.isFuncEntranceVisible(KeyWord.BAR_FUNCTION_HECHEN));

        let isGuiding = G.GuideMgr.isGuiding(EnumGuide.UseItem);
        if (isGuiding) {
            // 如果正在引导，显示全部
            let guider = G.GuideMgr.getCurrentGuider(EnumGuide.UseItem) as UseItemGuider;
            this.openItemId = guider.itemId;
        }

        if (0 != BagPanel.bagClass[this.bagSelectIndex]) {
            // 如果正在引导，显示全部
            this.typeTab.Selected = 0;
        } else {
            this.updataBagView();
        }

        let itemIdx = -1;
        if (this.openItemId > 0) {
            itemIdx = this.getFirstIdxInBag(this.openItemId);
            if (itemIdx < 0) {
                // 这个恶心的再充礼包在玩家充值后会自动变成另一个id，所以要重新检查一下
                let itemCfg = ThingData.getThingConfig(this.openItemId);
                if (KeyWord.ITEM_FUNCTION_RECHARGE_BOX == itemCfg.m_ucFunctionType) {
                    itemIdx = this.getFirstIdxInBag(itemCfg.m_iFunctionID);
                }
            }
        }

        if (itemIdx >= 0) {
            this.bagListCtrl.ScrollByAxialRow(Math.floor(itemIdx / 6));
            this.bagListCtrl.Selected = itemIdx;
            this.autoRefreshIdx = itemIdx;
        } else {
            this.bagListCtrl.ScrollTop();
        }
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.UseItem, EnumGuide.UseItem_ClickBag);
        G.GuideMgr.processGuideNext(EnumGuide.HunGuDecompose, EnumGuide.HunGuDecOpenBagPanel);
        this.addTimer("1", 1000, 0, this.onTimer);

        this.updateMoney();

        this.storePanel.closeStore();
    }

    protected onClose() {
        G.GuideMgr.processGuideNext(EnumGuide.UseItem, EnumGuide.UseItem_ClickClose);
        this.curSelectIndex = -1;

    }

    private onClickClose() {
        let bagView = G.Uimgr.getForm<BagView>(BagView);
        if (bagView != null)
            bagView.close();
    }

    private onBtnDestroy() {
        //丢弃
        G.ModuleMgr.bagModule.destoryTarget(this.listDataBag[this.curSelectIndex], Macros.CONTAINER_TYPE_ROLE_BAG);
    }

    /**关闭tip界面 */
    private onClickCloseTip() {
        if (this.tipPanel.activeSelf) {
            this.tipPanel.SetActive(false);
        } else if (this.leftPanelNode.activeSelf) {
            this.leftPanelNode.SetActive(false);
            this.storePanel.isOpen = false;
        } else {
            this.close();
        }

    }

    open(itemId = 0) {
        this.openItemId = itemId;
        super.open();
    }

    private onTimer(): void {
        this.itemTipBase.onCheckTime();
    }


    getFirstBagItem(id: number): UnityEngine.GameObject {
        let itemIdx = this.getFirstIdxInBag(id);
        if (itemIdx >= 0) {
            let item = this.bagListCtrl.GetItem(itemIdx);
            if (null != item) {
                return item.gameObject;
            }
        }
        return null;
    }

    private getFirstIdxInBag(id: number) {
        let itemIdx = -1;
        let cnt = this.listDataBag.length;
        for (let i = 0; i < cnt; i++) {
            if (null != this.listDataBag[i].thingData && this.listDataBag[i].thingData.config.m_iID == id) {
                itemIdx = i;
                break;
            }
        }
        return itemIdx;
    }

    /**
     * 背包分类
     * @param index
     */
    private onClickTypeTab(index: number) {
        this.bagListCtrl.SetSlideAppearRefresh();
        this.bagSelectIndex = index;
        this.bagListCtrl.ScrollTop();
        this.bagListCtrl.Selected = -1;
        this.tipPanel.SetActive(false);
        this.showBagTab(BagPanel.bagClass[index]);
    }

    /**
    * 使用按钮
    */
    private onBtnUse() {

        let thingConfig: GameConfig.ThingConfigM = this.curSelectedItemData.config;
        //使用
        if (this.isUseItme) {
            if ((thingConfig.m_ucCanBatUse & KeyWord.ITEM_USE_METHOD_BATUSE) != 0 && this.curSelectedItemData.data.m_iNumber > 1) {
                G.Uimgr.createForm<BatchUseView>(BatchUseView).open(this.curSelectedItemData);
            } else {
                G.ModuleMgr.bagModule.useThing(this.curSelectedItemData.config, this.curSelectedItemData.data);
            }
            G.GuideMgr.processGuideNext(EnumGuide.UseItem, EnumGuide.UseItem_ClickUse);
        } else {
            //丢弃
            //  G.ModuleMgr.bagModule.destoryTarget(this.listDataBag[this.curSelectIndex], Macros.CONTAINER_TYPE_ROLE_BAG);
            UIUtils.setButtonClickAble(this.btnUse, false);
        }

    }

    /**
    * 一键分解
    */
    private onBtnDecompose(): void {
        G.Uimgr.createForm<DecomposeView>(DecomposeView).open();
    }

    /**合成 --> 仓库 */
    private onBtnMerge(): void {
        this.leftPanelNode.SetActive(true);
        if (this.tipPanel.activeSelf == true)
            this.tipPanel.SetActive(false);
        this.storePanel.openStore();
        //G.Uimgr.createForm<ItemMergeView>(ItemMergeView).open();
    }

    /**
    * 背包整理
    */
    private onBagClear(): void {
        G.ModuleMgr.bagModule.sortBag();
        this.isStoreOpen = !this.isStoreOpen;
    }

    /**仓库关闭 */
    private actionCloseStore() {
        //标记改变
        this.isStoreOpen = false;
        //按钮改变
    }

    /**仓库开启 */
    private actionOpenStore() {
        //标记改变
        this.isStoreOpen = true;
        //按钮改变
    }

    /**
     * 放入仓库
     */
    private onPutIn(): void {
        let arr = this.bagListCtrl.Selecteds;
        for (let i = 0; i < arr.length; i++) {
            let index = arr[i];
            if (this.listDataBag[index].thingData == null) continue;
            if (Macros.CONTAINER_TYPE_ROLE_BAG == this.listDataBag[index].containerID) {
                if (arr.length > G.DataMgr.thingData.getStoreRemainNum()) {
                    G.TipMgr.addMainFloatTip('仓库已满，不能放入物品');
                }
                else if (this.listDataBag[index].thingData.config.m_ucIsStore == 0) {
                    G.TipMgr.addMainFloatTip('该物品不能存入仓库');
                }
                else {
                    G.ModuleMgr.bagModule.swapThing(Macros.CONTAINER_TYPE_ROLE_BAG, this.listDataBag[index].thingData.data, Macros.CONTAINER_TYPE_ROLE_STORE, Macros.UNDEFINED_CONTAINER_POSITION);
                }
            }
        }
        this.bagListCtrl.MultipleChoice = !this.bagListCtrl.MultipleChoice;

    }

    /**
     * 关闭返回
     */
    private onReturn(): void {
        this.close();
    }

    /**
     * 显示背包的UI
     * @param bagList
     */
    private showBagUI(item: ListItem): void {
        let iconItem = item.data.iconItem as IconItem;
        let data = this.listDataBag[item.Index];
        let bagItem = this.listDataBag[item.Index];
        if (!item.data.iconItem) {
            let parent = item.findObject('bagBg');
            iconItem = new IconItem();
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, parent);
            iconItem.showBg = true;
            iconItem.arrowType = ArrowType.bag;
            iconItem.isCompareAllPetEquip = true;
            iconItem.effectRule = EnumEffectRule.none;
            item.data.iconItem = iconItem;
        }
        iconItem.updateByThingItemData(data.thingData);
        iconItem.updateIcon();
        bagItem.iconItem = iconItem;
        //背包是否锁定
        let bagLock = item.findObject('bagLock');

        if (data.isLocked) {
            bagLock.SetActive(true);
        } else {
            bagLock.SetActive(false);
        }

        if (item.Index == this.autoRefreshIdx && item.Index == this.bagListCtrl.Selected) {
            this.autoRefreshIdx = -1;
            this.onBagItemClick(item.Index);
        }
    }

    /**
     * 根据是否过期，显示按钮
     */
    private updataBtnUseLabel(thingData: BagItemData) {
        let data = thingData.thingData.data;
        if (null != data && data.m_stThingProperty.m_iPersistTime > 0) {
            //已经过期
            if (data.m_stThingProperty.m_iPersistTime < G.SyncTime.getCurrentTime() / 1000) {
                //  this.txtUse.text = "丢弃";
                this.isUseItme = false;
                UIUtils.setButtonClickAble(this.btnUse, false);
            } else {
                //即将过期
                // this.txtUse.text = "使用";
                this.isUseItme = true;
                // UIUtils.setButtonClickAble(this.btnUse, true);
            }
        }
        else {
            // this.txtUse.text = "使用";
            this.isUseItme = true;
            // UIUtils.setButtonClickAble(this.btnUse, true);
        }
    }


    /**
     * 背包点击
     * @param index
     */
    private onBagItemClick(index: number): void {
        if (this.storePanel.isOpen == false) {
            //仓库关闭状态
            this.onClickBagItemCloseStore(index);
        }
        else {
            //仓库开启状态
            this.onClickBagItemOpenStore(index);
        }
    }

    /**
     * 点击背包格子 仓库关闭
     * @param index
     */
    private onClickBagItemCloseStore(index: number) {
        this.curSelectIndex = index;
        //背包格子不是钻石解锁（即已经解锁的格子）
        let itemData = this.listDataBag[index];
        if (itemData.unlockType != BagItemData.UNLOCK_TYPE_GOLD) {
            //背包格子有数据，显示数据
            if (itemData.thingData != null) {
                //如果是多选，不能弹出详细信息框Tip     
                if (!this.bagListCtrl.MultipleChoice) {
                    let tipData = itemData.iconItem.getTipData();
                    this.equipIconItem = new IconItem();
                    this.tipPanel.SetActive(true);

                    UIUtils.setButtonClickAble(this.btnDestroy, true);
                    UIUtils.setButtonClickAble(this.btnUse.gameObject, true);
                    this.updataBtnUseLabel(itemData);

                    let itemTipdata = tipData as ItemTipData;
                    if (itemData.thingData.config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING) {
                        itemTipdata.wingEquipLv = itemData.thingData.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stStrong.m_uiStrongProgress;
                    }
                    this.itemTipBase.updateInfo(itemTipdata);
                    //确保弹出物品信息面板，不显示选中状态
                    this.bagListCtrl.Selected = index;
                    this.curSelectedItemData = itemData.thingData;
                    G.DataMgr.runtime.__tip_id = itemData.thingData.config.m_iID;
                }
            }
            else {
                //确保弹出物品信息面板，不显示选中状态
                this.bagListCtrl.Selected = -1;
                this.tipPanel.SetActive(false);
            }
            //显示全部物品的页面-格子未解锁
        } else {
            this.bagListCtrl.Selected = -1;
            this.onExtendContainer(itemData);
        }
        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.UseItem, EnumGuide.UseItem_ClickItem);

    }

    /**
     * 点击背包格子 仓库开启
     * @param index
     */
    private onClickBagItemOpenStore(index: number): void {
        //背包格子不是钻石解锁（即已经解锁的格子）
        if (this.listDataBag[index].unlockType != BagItemData.UNLOCK_TYPE_GOLD) {
            //背包格子有数据，显示数据
            if (this.listDataBag[index].thingData != null) {
                //如果是多选，不能弹出详细信息框Tip     
                if (!this.bagListCtrl.MultipleChoice) {
                    let tipData = this.listDataBag[index].iconItem.getTipData();


                    G.ViewCacher.tipsView.open(tipData, TipFrom.putIn);

                    //确保弹出物品信息面板，不显示选中状态
                    this.bagListCtrl.Selected = -1;
                }
            }
            else {
                //确保弹出物品信息面板，不显示选中状态
                this.bagListCtrl.Selected = -1;
            }
            //显示全部物品的页面-格子未解锁
        } else {
            this.bagListCtrl.Selected = -1;
            this.onExtendContainer(this.listDataBag[index]);
        }
    }

    private _sortByPosition(a: number, b: number): number {
        return a - b;
    }

    updataView(type: number) {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.updataBagView();
        }
    }

    /**刷新背包格子*/
    updataBagView(): void {
        this.showBagTab(BagPanel.bagClass[this.bagSelectIndex]);
        if (this.curSelectIndex != -1 && this.listDataBag[this.curSelectIndex].thingData != null) {
            let tipData = this.listDataBag[this.curSelectIndex].iconItem.getTipData();
            let itemTipdata = tipData as ItemTipData;
            if (itemTipdata != null) {
                this.itemTipBase.updateInfo(itemTipdata);
            }
            this.curSelectedItemData = this.listDataBag[this.curSelectIndex].thingData;
        } else {
            UIUtils.setButtonClickAble(this.btnUse, false);
            UIUtils.setButtonClickAble(this.btnDestroy, false);
            this.tipPanel.SetActive(false);
            this.bagListCtrl.Selected = -1;
        }

        this.storePanel.updateView();
    }

    /**
    * 背包数据处理  
    */
    private showBagTab(tabIndex: number): void {
        let isBinding: boolean;
        let rawDatas: { [position: number]: ThingItemData } = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
        /**特定面板是否打开*/
        let i: number;
        if (null == this.listDataBag) {
            this.listDataBag = new Array<BagItemData>(BagPanel.MAX_CAPACITY);
            for (i = 0; i < BagPanel.MAX_CAPACITY; i++) {
                this.listDataBag[i] = new BagItemData();
                this.listDataBag[i].containerID = Macros.CONTAINER_TYPE_ROLE_BAG;
            }
        }
        // 先重置所有格子，锁定
        for (i = 0; i < BagPanel.MAX_CAPACITY; i++) {
            this.listDataBag[i].reset(); // reset之后可以显示一个锁，用于数据未初始化的情况
            this.listDataBag[i].itemIndex = i;
        }
        if (G.DataMgr.thingData.bagCapacity >= BagPanel.DEFAULT_CAPACITY) {
            // 数据已经正确初始化，初始化各个格子的数据
            // 先初始化所有格子的解锁状态
            for (i = 0; i < BagPanel.MAX_CAPACITY; i++) {
                if (i >= G.DataMgr.thingData.bagCapacity) {
                    this.listDataBag[i].unlockType = BagItemData.UNLOCK_TYPE_GOLD;
                }
                else {
                    this.listDataBag[i].isLocked = false;
                }
            }
            // 接下来初始化已解锁的格子数据
            let rawObj: ThingItemData;
            //表示默认的全部显示tabKey == 0
            if (tabIndex == 0) {
                // 全部页签按照服务器位置显示
                for (i = 0; i < G.DataMgr.thingData.bagCapacity; i++) {
                    rawObj = rawDatas[i];
                    if (null != rawObj) {
                        this.listDataBag[i].thingData = rawObj;
                        this.listDataBag[i].thingData.containerID = Macros.CONTAINER_TYPE_ROLE_BAG;
                        isBinding = GameIDUtil.isBingThingByContainerInfo(rawObj.config.m_iID, rawObj.data);
                        this.listDataBag[i].canDrag = true;
                        this.listDataBag[i].canUse = true;
                    }
                }
            }
            else {
                //其他页签紧凑显示，不可拖动
                let itemPosList: number[] = new Array<number>();
                for (let posStr in rawDatas) {
                    // 进行过滤
                    rawObj = rawDatas[posStr];
                    //物品类型
                    if (tabIndex == rawObj.config.m_iBagClass) {
                        itemPosList.push(parseInt(posStr));
                    }
                    itemPosList.sort(this._sortByPosition);
                    for (i = itemPosList.length - 1; i >= 0; i--) {
                        rawObj = rawDatas[itemPosList[i]];
                        this.listDataBag[i].thingData = rawObj;
                        this.listDataBag[i].thingData.containerID = Macros.CONTAINER_TYPE_ROLE_BAG;
                        this.listDataBag[i].canUse = true;
                    }
                }
            }

            this.bagListCtrl.Refresh();
        }
    }

    /**
     * 点击锁定状态的格子进行容器扩容。
     *
     */
    private onExtendContainer(slotItemData: BagItemData): void {
        if (!G.ModuleMgr.bagModule.checkContainerDataInit(this.m_containerType, true)) {
            return;
        }
        let capacity: number = G.ModuleMgr.bagModule.getContainerCapacity(this.m_containerType);
        let extendToPos: number = slotItemData.itemIndex;
        let spaceNum: number = extendToPos - capacity + 1;
        if (spaceNum < 1) {
            if (defines.has('_DEBUG')) {
                uts.assert(false, '扩容格子数错误！');
            }
            return;
        }
        if (BagItemData.UNLOCK_TYPE_GOLD == slotItemData.unlockType) {
            // 钻石解锁
            G.ModuleMgr.bagModule.extendContainerByYuanbao(this.m_containerType, spaceNum);
        }
    }

    updateMoney() {
        this.currencyTip.updateMoney();
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, itemId: number): boolean {
        if (EnumGuide.UseItem_ClickItem == step) {
            let itemIdx = this.getFirstIdxInBag(itemId);
            if (itemIdx >= 0) {
                this.bagListCtrl.Selected = itemIdx;
                this.onBagItemClick(itemIdx);
                return true;
            }
        }
        return false;
    }
}