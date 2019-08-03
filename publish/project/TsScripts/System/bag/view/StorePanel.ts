import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { Global as G } from "System/global"
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
import { BagView, EnumBagTab } from 'System/bag/view/BagView'
import { BagPanel } from 'System/bag/view/BagPanel'

export class StorePanel extends TabSubForm {

    /**当前选中的索引（tab切换：背包，仓库）*/
    private bagSelectIndex: number = 0;
    /**当前选中的索引（tab切换：背包，仓库）*/
    private storeSelectIndex: number = 0;
    /**背包所有的格子（解锁，未解锁）*/
    private listDataBag: BagItemData[];
    /**仓库所有的格子（解锁，未解锁）*/
    private listDataStore: BagItemData[];
   
    /**背包全部Item的父物体*/
    private bagListCtrl: List;
    /**仓库全部Item的父物体*/
    private storeListCtrl: List;

    /**仓库的整理*/
    private btnStoreClear: UnityEngine.GameObject = null;
    /**仓库的取出*/
    private btnTakeOut: UnityEngine.GameObject = null;
    /**仓库时，背包的整理按钮*/
    private btnBagClear: UnityEngine.GameObject = null;
    /**背包的放入*/
    private btnPutIn: UnityEngine.GameObject = null;
    /**放入按钮多选效果*/
    private selectPutIn: UnityEngine.GameObject = null;
    /**取出按钮多选效果*/
    private selectTakeOut: UnityEngine.GameObject = null;
    private itemIcon_Normal: UnityEngine.GameObject;
  

    /**打开背包要展示的物品id*/
    private openItemId: number = 0;

    private typeTab: UnityEngine.UI.ActiveToggleGroup;

    constructor() {
        super(EnumBagTab.store);
    }

  
    protected resPath(): string {
        return UIPathData.StorePanel;
    }
    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
       
        this.btnStoreClear = this.elems.getElement('btnStoreClear');
        this.btnTakeOut = this.elems.getElement('btnTakeOut');
        this.btnBagClear = this.elems.getElement('btnBagClear');
        this.btnPutIn = this.elems.getElement('btnPutIn');
       

        this.bagListCtrl = this.elems.getUIList('allItemList');

        this.storeListCtrl = this.elems.getUIList('storeItemList');
        //设置背包克隆160个
        this.bagListCtrl.Count = BagView.MAX_CAPACITY;

        this.bagListCtrl.onVirtualItemChange = delegate(this, this.showBagUI);

        //设置仓库要克隆的格子个数
        this.storeListCtrl.Count = BagView.MAX_CAPACITY_CK;

        this.storeListCtrl.onVirtualItemChange = delegate(this, this.showStoreUI);

        this.selectPutIn = this.elems.getElement('selectPutIn');
        this.selectTakeOut = this.elems.getElement('selectTakeOut');
        this.typeTab = this.elems.getToggleGroup("typeTab");
    }
    protected initListeners(): void {
      
      
        this.addClickListener(this.btnStoreClear, this.onStoreClear);
        this.addClickListener(this.btnTakeOut, this.onTakeOut);
      
        this.addClickListener(this.btnBagClear, this.onBagClear);
        this.addClickListener(this.btnPutIn, this.onPutIn);
       
      
        this.addListClickListener(this.bagListCtrl, this.onBagItemClick);
        this.addListClickListener(this.storeListCtrl, this.onstoreItemClick);
        this.addToggleGroupListener(this.typeTab, this.onClickTypeTab);
    }

    open(itemId: number = 0) {
        if (!G.ActionHandler.checkCrossSvrUsable(true)) {
            return;
        }
        this.openItemId = itemId;
        super.open();
    }

   
    protected onOpen() {
        this.bagListCtrl.SetSlideAppearRefresh();
        this.storeListCtrl.SetSlideAppearRefresh();

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
        }

        if (itemIdx >= 0) {
            this.bagListCtrl.ScrollByAxialRow(Math.floor(itemIdx / 5));
        } else {
            this.bagListCtrl.ScrollTop();
        }

        this.updataStoreView();
       
    }

    protected onClose() {
        // this.avatar.destroy(0);
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
            if (null != this.listDataBag[i].thingData && this.listDataBag[i].thingData.config.m_iID == this.openItemId) {
                itemIdx = i;
                break;
            }
        }
        return itemIdx;
    }

    /**
   * 背包切换，全部，装备，技能，材料，其他显示
   * @param index
   */
    private onClickTypeTab(index: number) {
        this.bagListCtrl.SetSlideAppearRefresh();
        this.bagSelectIndex = index;
        this.bagListCtrl.ScrollTop();
        this.showBagTab(BagPanel.bagClass[index]);
    }


    /**
    * 仓库切换，全部，装备，技能，材料，其他显示
    * @param index
    */
    private onStoreTab(index: number): void {
        this.storeSelectIndex = index;
        this.storeListCtrl.ScrollTop();
        this.showStoreTab(index);
    }

    /**
    * 背包整理
    */
    private onBagClear(): void {
        G.ModuleMgr.bagModule.sortBag();
    }

    /**
     * 仓库整理
     */
    private onStoreClear(): void {
        G.ModuleMgr.bagModule.sortStore();
    }

    /**
     * 放入仓库
     */
    private onPutIn(): void {
        let arr = this.bagListCtrl.Selecteds;
        let candidates = [];
        let failedCount = 0;  // 道具本身不能放入仓库的数量
        let putCount = 0;  // 已经放入仓库的数量
        let noRemainCount = 0; // 因仓库格子不够不能放入仓库的数量
        let remainCount = G.DataMgr.thingData.getStoreRemainNum();
        for (let i = 0; i < arr.length; i++) {
            let itemData = this.listDataBag[arr[i]];
            if (itemData.thingData == null) {
                continue;
            }
            if (itemData.thingData.config.m_ucIsStore == 0) {
                failedCount++;
                continue;
            }
            
            if (putCount < remainCount) {
                G.ModuleMgr.bagModule.swapThing(Macros.CONTAINER_TYPE_ROLE_BAG, itemData.thingData.data, Macros.CONTAINER_TYPE_ROLE_STORE, Macros.UNDEFINED_CONTAINER_POSITION);
                putCount++;
            } else {
                noRemainCount++;
                break;
            }
        }

        if (noRemainCount) {
            G.TipMgr.addMainFloatTip('仓库已满，部分物品无法放入');
        } else if (failedCount > 0) {
            G.TipMgr.addMainFloatTip('部分物品不能存入仓库');
        }
        this.bagListCtrl.MultipleChoice = !this.bagListCtrl.MultipleChoice;
        this.selectPutIn.SetActive(this.bagListCtrl.MultipleChoice);
    }

    /**
     * 取出背包
     */
    private onTakeOut(): void {
        let temp: BagItemData[];
        let arr = this.storeListCtrl.Selecteds;
        for (let i = 0; i < arr.length; i++) {
            let index = arr[i];
            if (this.listDataStore[index].thingData == null) continue;
            if (Macros.CONTAINER_TYPE_ROLE_STORE == this.listDataStore[index].containerID) {
                if (arr.length > G.DataMgr.thingData.getBagRemainNum()) {
                    G.TipMgr.addMainFloatTip('背包已满，不能放入物品');
                }
                else if (this.listDataStore[index].thingData.config.m_ucIsStore == 0) {
                    G.TipMgr.addMainFloatTip('该物品不能存入仓库');
                }
                else {
                    G.ModuleMgr.bagModule.swapThing(Macros.CONTAINER_TYPE_ROLE_STORE, this.listDataStore[index].thingData.data, Macros.CONTAINER_TYPE_ROLE_BAG, Macros.UNDEFINED_CONTAINER_POSITION);
                }
            }
        }
        this.storeListCtrl.MultipleChoice = !this.storeListCtrl.MultipleChoice;
        this.selectTakeOut.SetActive(this.storeListCtrl.MultipleChoice);
    }

    /**
     * 关闭返回
     */
    private onReturn(): void {
        this.close();
    }

    ////////////////////////////////////////////////////////////////////////

 

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
    }

    /**
    * 显示仓库的UI
    * @param bagList
    */
    private showStoreUI(item: ListItem): void {
        let iconItem = item.data.storeiconItem as IconItem;
        let data =this.listDataStore[item.Index];
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


  
    /////////////////////////背包操作///////////////////////////////////////

    /**
     * 背包点击
     * @param index
     */
    private onBagItemClick(index: number): void {
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
            this.extendContainerTo(this.listDataBag[index], Macros.CONTAINER_TYPE_ROLE_BAG);
        }
    }

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


 
    private _sortByPosition(a: number, b: number): number {
        return a - b;
    }

    updataView(type: number) {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.updataBagView();
        } else if (type == Macros.CONTAINER_TYPE_ROLE_STORE) {
            this.updataStoreView();
        }
    }

    /**刷新背包格子*/
     updataBagView(): void {
         this.showBagTab(BagPanel.bagClass[this.bagSelectIndex]);
    }
    /**刷新仓库格子*/
     updataStoreView(): void {
        this.showStoreTab(this.storeSelectIndex);
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
            this.listDataBag = new Array<BagItemData>(BagView.MAX_CAPACITY);
            for (i = 0; i < BagView.MAX_CAPACITY; i++) {
                this.listDataBag[i] = new BagItemData();
                this.listDataBag[i].containerID = Macros.CONTAINER_TYPE_ROLE_BAG;
            }
        }
        // 先重置所有格子，锁定
        for (i = 0; i < BagView.MAX_CAPACITY; i++) {
            this.listDataBag[i].reset(); // reset之后可以显示一个锁，用于数据未初始化的情况
            this.listDataBag[i].itemIndex = i;
        }
        if (G.DataMgr.thingData.bagCapacity >= BagView.DEFAULT_CAPACITY) {
            // 数据已经正确初始化，初始化各个格子的数据
            // 先初始化所有格子的解锁状态
            for (i = 0; i < BagView.MAX_CAPACITY; i++) {
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

            //if (this.bagListCtrl != null) {
            //    if (this.bagSelectIndex == 0) {
            //        this.showBagUI(this.listDataBag);
            //    } else {
            //        this.showBagUI(this.listDataBag);
            //    }
            //}

            this.bagListCtrl.Refresh();
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
}