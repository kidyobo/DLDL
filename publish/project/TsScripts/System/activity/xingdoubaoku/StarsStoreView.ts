import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { BagModule } from 'System/bag/BagModule'
import { BagPanel } from 'System/bag/view/BagPanel'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { TgbjData } from 'System/data/TgbjData'
import { Macros } from 'System/protocol/Macros'
import { TgbjStoreItemData } from 'System/data/TgbjStoreItemData'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { List, ListItem } from "System/uilib/List"
import { IconItem } from "System/uilib/IconItem"
import { TipFrom } from 'System/tip/view/TipsView'
import { EnumEffectRule } from 'System/constants/GameEnum'

export class StarsStoreView extends CommonForm {
    static MAX_CAPACITY: number = 100;

    private static _PAGE_SIZE: number = 42;

    /**返回按钮。*/
    private m_btnBack: UnityEngine.GameObject;

    /**整理按钮。*/
    private m_btnSort: UnityEngine.GameObject;

    /**全部取出按钮。*/
    private m_btnFetchAll: UnityEngine.GameObject;

    /**炼化按钮。*/
    private m_btnLh: UnityEngine.GameObject;

    /**对背包模块的引用*/
    protected m_bagModule: BagModule;

    /**拥有积分*/
    private txtJifen: UnityEngine.UI.Text;

    private allItemList: List;

    private mask: UnityEngine.GameObject;

    private btnSort: UnityEngine.GameObject;
    private btnPutOutAll: UnityEngine.GameObject;
    /**取出按钮，单/多选显示*/
    private listData: TgbjStoreItemData[];

    private itemIcon_Normal: UnityEngine.GameObject;
    private storeIconItems: IconItem[] = [];
    private btnClose: UnityEngine.GameObject;
    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.StarsStoreView;
    }
    protected onClose() {

    }

    protected initElements(): void {
        this.btnClose = this.elems.getElement("btnClose");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.txtJifen = this.elems.getText("txtJifen");
        //背包格子
        this.allItemList = this.elems.getUIList("allItemList");
        this.allItemList.Count = StarsStoreView.MAX_CAPACITY;
        this.allItemList.onVirtualItemChange = delegate(this, this.showBagUI)

        this.mask = this.elems.getElement("mask");
        this.btnSort = this.elems.getElement("btnSort");
        this.btnPutOutAll = this.elems.getElement("btnPutOutAll");
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onMaskClick);
        this.addClickListener(this.btnSort, this._onClickBtnSort);
        this.addClickListener(this.btnPutOutAll, this._onClickBtnFetchAll);
        this.addClickListener(this.btnClose, this.onMaskClick);
    }

    protected onOpen() {
        this.allItemList.SetSlideAppearRefresh();
        // 拉取星斗宝库仓库
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_LIST, Macros.CONTAINER_TYPE_STARLOTTERY));
    }

    private onMaskClick() {
        this.close();
    }


    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    onStarsStoreChange(type: number): void {
        if (!this.isOpened || type != Macros.CONTAINER_TYPE_STARLOTTERY) {
            return;
        }
        // 刷新仓库
        let tgbjData: TgbjData = G.DataMgr.tgbjData;
        let rawDatas: { [pos: number]: ThingItemData } = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_STARLOTTERY);

        if (null == this.listData) {
            this.listData = new Array<TgbjStoreItemData>(StarsStoreView.MAX_CAPACITY);
            for (let i: number = 0; i < StarsStoreView.MAX_CAPACITY; i++) {
                this.listData[i] = new TgbjStoreItemData();
            }
            tgbjData.storeListData = this.listData;
        }
        // 更新所有格子
        let itemData: TgbjStoreItemData = new TgbjStoreItemData();
        for (let i = 0; i < StarsStoreView.MAX_CAPACITY; i++) {
            itemData = this.listData[i];
            itemData.itemData = rawDatas[i];
            if (null != itemData.itemData) {
                itemData.isLh = tgbjData.isInLh(itemData.itemData);
            }
            else {
                itemData.isLh = false;
            }
        }
        // 刷新容量      
        let colorText: string = TextFieldUtil.getColorText(G.DataMgr.thingData.getCurStarsStorePosNum().toString(), Color.GREEN) + TextFieldUtil.getColorText('/' + StarsStoreView.MAX_CAPACITY, Color.BEIGE);
        this.txtJifen.text = TextFieldUtil.getColorText(uts.format('容量：{0}', colorText), Color.DEFAULT_WHITE);

        this.allItemList.Refresh();
    }


    /**
   * 显示背包的UI
   * @param bagList
   */
    private showBagUI(item: ListItem): void {
        let iconItem = item.data.iconItem as IconItem;
        if (this.listData == null) return;
        let data = this.listData[item.Index];
        if (!item.data.iconItem) {
            let parent = item.findObject('content');
            iconItem = new IconItem();
            iconItem.effectRule = EnumEffectRule.none;
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, parent);
            //iconItem.showBg = false;
            iconItem.setTipFrom(TipFrom.starStore);
            item.data.iconItem = iconItem;
        }
        iconItem.updateByThingItemData(data.itemData);
        iconItem.updateIcon();
    }



    private _onClickBtnSort(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_SORT, Macros.CONTAINER_TYPE_STARLOTTERY));
    }

    private _onClickBtnFetchAll(): void {
        this._fetchAll();
    }

    private _fetchAll(): void {
        let canFetchAll: boolean = true;
        let posNum: number = G.DataMgr.thingData.getCurStarsStorePosNum();
        if (posNum <= 0) {
            return;
        }
        // 检查背包格子数量
        let num: number = posNum - G.DataMgr.thingData.getBagRemainNum();
        if (num > 0) {
            // 背包格子不够
            canFetchAll = false;
            if (G.DataMgr.thingData.bagCapacity + num > BagPanel.MAX_CAPACITY) {
                G.TipMgr.addMainFloatTip('宝贝太多，背包放不下啦。');
            }
            else {
                G.TipMgr.addMainFloatTip(uts.format('您的背包空格子不足啦，需要新开{0}个格子。', num));
                G.ModuleMgr.bagModule.onUnlockBagAndDosth(num, delegate(this, this._fetchAll));
            }
        }
        if (canFetchAll) {
            let idList: number[] = new Array<number>();
            let posList: number[] = new Array<number>();
            let numList: number[] = new Array<number>();
            if (this.listData == null) return;
            for (let itemData of this.listData) {
                if (null == itemData.itemData) {
                    continue;
                }
                idList.push(itemData.itemData.config.m_iID);
                posList.push(itemData.itemData.data.m_usPosition);
                numList.push(itemData.itemData.data.m_iNumber);
            }
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSwapContainerMsg(Macros.CONTAINER_TYPE_STARLOTTERY, idList, posList, numList, Macros.CONTAINER_TYPE_ROLE_BAG, Macros.UNDEFINED_CONTAINER_POSITION));
        }
    }
}