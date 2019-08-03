import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { Global as G } from "System/global";
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIPathData } from "System/data/UIPathData"
import { List, ListItem } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { Macros } from 'System/protocol/Macros'
import { BuffInfoData } from 'System/buff/BuffInfoData'
import { DataFormatter } from 'System/utils/DataFormatter'
import { UnitController } from 'System/unit/UnitController'
import { UnitUtil } from 'System/utils/UnitUtil'
import { BuffIconItem } from 'System/uilib/BuffIconItem'

class BuffListItemData {
    id: number = 0;
    name: string;
    desc: string;
    iconName: string;
    leftTime: number = 0;
    value: number = 0;
    layer = 0;
}

class BuffListItem extends ListItemCtrl {
    private iconItem: BuffIconItem;
    private textName: UnityEngine.UI.Text;
    private textDesc: UnityEngine.UI.Text;
    private textCountDown: UnityEngine.UI.Text;

    private oldBuffId: number = 0;

    setComponents(go: UnityEngine.GameObject) {
        this.iconItem = new BuffIconItem();
        this.iconItem.setUsual(go);
        this.textName = ElemFinder.findText(go, 'textName');
        this.textDesc = ElemFinder.findText(go, 'textDesc');
        this.textCountDown = ElemFinder.findText(go, 'textCountDown');
    }

    update(itemData: BuffListItemData) {
        if (this.oldBuffId != itemData.id) {
            this.oldBuffId = itemData.id;

            this.textDesc.text = itemData.desc;

            this.iconItem.updateByIconName(itemData.iconName);
            this.iconItem.updateIcon();
        }
        let name = itemData.name;
        if (itemData.layer > 1) {
            name += '×' + itemData.layer;
        }
        this.textName.text = name;
        this.updateCountDown(itemData);
    }

    updateCountDown(itemData: BuffListItemData) {
        if (itemData.leftTime > 0) {
            this.textCountDown.text = DataFormatter.second2day(itemData.leftTime);
        } else if (itemData.value > 0) {
            if (itemData.value > 10000) {
                this.textCountDown.text = uts.format('总量：{0}万', (itemData.value / 10000).toFixed(1));
            } else {
                this.textCountDown.text = uts.format('总量：{0}', itemData.value);
            }
        } else {
            this.textCountDown.text = '';
        }
    }
}

export class BuffListView extends CommonForm {
    private mask: UnityEngine.GameObject;

    private list: List;
    private items: BuffListItem[] = [];
    private itemDatas: BuffListItemData[] = [];

    private unitCtrl: UnitController;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.BuffListView;
    }

    protected onOpen() {
        this.updateView();
    }

    protected onClose() {
        this.removeCountDownTimer();
    }

    protected initElements(): void {
        this.mask = this.elems.getElement('mask');
        this.list = this.elems.getUIList('list');
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onClickMask);
    }

    open(unitCtrl: UnitController) {
        this.unitCtrl = unitCtrl;
        super.open();
    }

    onBuffChanged(unitID: number) {
        if (null == this.unitCtrl || this.unitCtrl.Data.unitID != unitID) {
            return;
        }
        this.updateView();
    }

    onHeroDataChanged(unitID: number) {
        if (null == this.unitCtrl || this.unitCtrl.Data.unitID != unitID) {
            return;
        }
        // 更新血包
        if (UnitUtil.isRole(this.unitCtrl)) {
            let hpStoreValue = this.unitCtrl.Data.getProperty(Macros.EUAI_HPSTORE);
            let hpStoreIdx = -1;
            let cnt = this.itemDatas.length;
            for (let i = 0; i < cnt; i++) {
                let itemData = this.itemDatas[i];
                if (itemData.id == Macros.EUAI_HPSTORE) {
                    hpStoreIdx = i;
                    break;
                }
            }

            let needRefreshList = false;
            if (hpStoreValue > 0) {
                let item: BuffListItem;
                let itemData: BuffListItemData;
                if (hpStoreIdx >= 0) {
                    item = this.items[hpStoreIdx];
                    itemData = this.itemDatas[hpStoreIdx];
                    itemData.value = hpStoreValue;
                    // 原本就有的血包，只是更新它就好
                    item.updateCountDown(itemData);
                } else {
                    let itemData = this.getHpStoreItemData(hpStoreValue);
                    this.itemDatas.unshift(itemData);
                    needRefreshList = true;
                }
            } else {
                if (hpStoreIdx >= 0) {
                    this.itemDatas.splice(hpStoreIdx, 1);
                    needRefreshList = true;
                }
            }

            if (needRefreshList) {
                this.refreshList();
            }
        }
    }

    private updateView() {
        this.itemDatas.length = 0;

        // 处理血包
        if (UnitUtil.isRole(this.unitCtrl)) {
            let hpStoreValue = this.unitCtrl.Data.getProperty(Macros.EUAI_HPSTORE);
            if (hpStoreValue > 0) {
                let itemData = this.getHpStoreItemData(hpStoreValue);
                this.itemDatas.push(itemData);
            }
        }

        // 再处理buff
        let now = UnityEngine.Time.realtimeSinceStartup;
        let dataList = this.unitCtrl.buffProxy.buffDataList;
        let allBuffIds = dataList.getAllBuffId();
        let cnt = allBuffIds.length;
        for (let i = 0; i < cnt; i++) {
            let itemData = new BuffListItemData();
            let buffInfoData = dataList.getBuffInfoData(allBuffIds[i]);
            itemData.id = buffInfoData.config.m_uiBuffID;
            itemData.name = buffInfoData.config.m_szBuffIconName;
            itemData.desc = buffInfoData.config.m_szBuffDescription;
            itemData.iconName = buffInfoData.config.m_uiBuffIconID.toString();
            itemData.layer = buffInfoData.buffInfo.m_ucBuffPileLayer;

            if (1 == buffInfoData.config.m_ucIsShowTime && buffInfoData.buffInfo.m_iBuffRemainTime > 0) {
                itemData.leftTime = Math.round((buffInfoData.beginTime + buffInfoData.buffInfo.m_iBuffRemainTime) / 1000 - now);
            } else {
                itemData.leftTime = 0;
            }
            this.itemDatas.push(itemData);
        }
        this.refreshList();
    }

    private refreshList() {
        let cnt = this.itemDatas.length;
        this.list.Count = cnt;
        let oldItemCnt = this.items.length;
        let needCountDown: boolean = false;
        for (let i = 0; i < cnt; i++) {
            let item: BuffListItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new BuffListItem());
                item.setComponents(this.list.GetItem(i).gameObject);
            }

            let itemData = this.itemDatas[i];
            item.update(itemData);

            if (itemData.leftTime > 0) {
                needCountDown = true;
            }
        }

        if (needCountDown) {
            this.addTimer("1", 1000, 0, this.onCountDownTimer);
        } else {
            this.removeCountDownTimer();
        }
    }

    private getHpStoreItemData(hpStoreValue: number): BuffListItemData {
        let itemData = new BuffListItemData();
        itemData.id = Macros.EUAI_HPSTORE;
        itemData.name = '生命包';
        itemData.desc = '每10秒恢复一次生命\n等级越高，每次恢复生命值越高';
        itemData.iconName = '51000432';
        itemData.value = hpStoreValue;
        return itemData;
    }

    private onCountDownTimer(timer: Game.Timer) {
        let cnt = this.itemDatas.length;
        let callCount = timer.CallCountDelta;

        for (let i = 0; i < cnt; i++) {
            let itemData = this.itemDatas[i];
            if (itemData.leftTime > 0) {
                itemData.leftTime -= callCount;
                let item: BuffListItem = this.items[i];
                item.updateCountDown(itemData);
            }
        }
    }

    private removeCountDownTimer() {
        this.removeTimer("1");
    }

    private onClickMask() {
        this.close();
    }
}