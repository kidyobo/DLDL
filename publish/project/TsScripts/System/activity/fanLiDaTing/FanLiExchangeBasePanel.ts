import { Global as G } from 'System/global'
import { Events } from 'System/Events'
import { ActivityData } from 'System/data/ActivityData'
import { Macros } from 'System/protocol/Macros'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { DropPlanData } from "System/data/DropPlanData"
import { List } from "System/uilib/List"
import { Color } from "System/utils/ColorUtil"
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { MathUtil } from "System/utils/MathUtil"
import { IconItem } from "System/uilib/IconItem"
import { TipFrom } from 'System/tip/view/TipsView'
import { DataFormatter } from "System/utils/DataFormatter"
import { UIUtils } from 'System/utils/UIUtils'
import { JjrExchangeItemData } from 'System/data/activities/JjrExchangeItemData'
import { JjrExchangeGridItemData } from 'System/data/activities/JjrExchangeGridItemData'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'


class FanLiExchangeItem {

    private readonly iconCount = 5;
    private rewardList: UnityEngine.GameObject;
    private btnGet: UnityEngine.GameObject;
    private icons: IconItem[] = [];
    private data: JjrExchangeItemData;

    setCommponents(go: UnityEngine.GameObject, prefab: UnityEngine.GameObject) {
        this.rewardList = ElemFinder.findObject(go, "rewardList");
        this.btnGet = ElemFinder.findObject(go, "btnGet");
        for (let i = 0; i < this.iconCount; i++) {
            let iconRoot = ElemFinder.findObject(this.rewardList, "icon" + i);
            let iconitem = new IconItem();
            iconitem.setUsualIconByPrefab(prefab, iconRoot);
            iconitem.showBg = false;
            iconitem.setTipFrom(TipFrom.normal);
            this.icons.push(iconitem);
        }

        Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onBtnGet);
    }

    update(data: JjrExchangeItemData) {
        this.data = data;
        UIUtils.setButtonClickAble(this.btnGet, data.canExchange);
        for (let i = 0; i < this.iconCount; i++) {
            this.icons[i].updateByRewardIconData(data.rewardVec[i]);
            this.icons[i].updateIcon();
        }
    }

    /**领取*/
    private onBtnGet(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_JPDDH, Macros.ACTIVITY_JIPINDADUIHUAN, this.data.cfg.m_uiID));
    }

}



/**
 *武极兑换
 */
export abstract class FanLiExchangeBasePanel extends TabSubForm {

    private _listData: JjrExchangeItemData[];

    private fanLiExchangeItem: FanLiExchangeItem[] = [];
    private rewardList: List;
    private itemIcon_Normal: UnityEngine.GameObject;

    private back1: UnityEngine.GameObject;
    private back2: UnityEngine.GameObject;

    private type = 0;

    constructor(id: number, type: number) {
        super(id);
        this.type = type;
    }

    protected resPath(): string {
        return UIPathData.FanLiExchangeBasePanel;
    }

    protected initElements() {
        this.rewardList = this.elems.getUIList("rewardList");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.back1 = this.elems.getElement("back1");
        this.back2 = this.elems.getElement("back2");

    }

    protected initListeners() {
    }

    protected onOpen() {
        this.updateView();
    }

    protected onClose() {

    }


    private updateView(): void {
        for (let listItemVo of this.listData) {
            let canExchange: boolean = true;
            listItemVo.rewardGridVec.length = 0;
            let rewardVec: RewardIconItemData[] = listItemVo.rewardVec;
            let len: number = rewardVec.length;
            for (let i: number = 0; i < len; i++) {
                let itemVo: JjrExchangeGridItemData = new JjrExchangeGridItemData();
                itemVo.rewardVo = rewardVec[i];
                if (i < len - 2) {
                    itemVo.type = JjrExchangeGridItemData.TYPE_ADD;
                }
                else {
                    itemVo.type = i == len - 1 ? JjrExchangeGridItemData.TYPE_NONE : JjrExchangeGridItemData.TYPE_EQUAL;
                }

                if (itemVo.type != JjrExchangeGridItemData.TYPE_NONE && canExchange) {
                    let num: number = G.DataMgr.thingData.getThingNumInsensitiveToBind(itemVo.rewardVo.id);
                    if (num < itemVo.rewardVo.number) {
                        canExchange = false;
                    }
                }
                listItemVo.rewardGridVec.push(itemVo);
                listItemVo.canExchange = canExchange;
            }
        }

        let len = this.listData.length;
        this.rewardList.Count = len;
        for (let i = 0; i < len; i++) {
            let item = this.rewardList.GetItem(i);
            if (this.fanLiExchangeItem[i] == null) {
                this.fanLiExchangeItem[i] = new FanLiExchangeItem();
                this.fanLiExchangeItem[i].setCommponents(item.gameObject, this.itemIcon_Normal);
            }
            this.fanLiExchangeItem[i].update(this.listData[i]);
        }


    }

    private sortList(a: JjrExchangeItemData, b: JjrExchangeItemData): number {
        let tmpA: number = a.canExchange ? 0 : 1;
        let tmpB: number = b.canExchange ? 0 : 1;
        return tmpA == tmpB ? a.cfg.m_uiID - b.cfg.m_uiID : tmpA - tmpB;
    }

    /**
     * 背包数据改变
     *
     */
    onBagDataChange(type: number): void {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.updateView();
        }
    }

    private get activityData(): ActivityData {
        return G.DataMgr.activityData;
    }


    get listData(): JjrExchangeItemData[] {
        let j: number = 0;
        let len: number = 0;
        let rewardItemVo: RewardIconItemData;
        let cfgItem: GameConfig.JPDDHItem;
        if (!this._listData) {
            this._listData = new Array<JjrExchangeItemData>();
            let exchangeConfigArr: GameConfig.JPDDHActCfgM[];
            if (this.type == KeyWord.WJ_EXCHANGE) {
                exchangeConfigArr = this.activityData.jpddhVec;

                if (this.back1 != null)
                    this.back1.SetActive(true);
                if (this.back2 != null)
                    this.back2.SetActive(false);
            }
            else if (this.type == KeyWord.TX_EXCHANGE) {
                exchangeConfigArr = this.activityData.txddhVec;
                if (this.back1 != null)
                    this.back1.SetActive(false);
                if (this.back2 != null)
                    this.back2.SetActive(true);
            }
            len = exchangeConfigArr.length;
            for (let i: number = 0; i < len; i++) {
                let cfg: GameConfig.JPDDHActCfgM = exchangeConfigArr[i];
                let itemVo: JjrExchangeItemData = new JjrExchangeItemData();
                itemVo.rewardVec = new Array<RewardIconItemData>();
                itemVo.rewardGridVec = new Array<JjrExchangeGridItemData>();
                itemVo.cfg = cfg;
                let m_stCostItemList: GameConfig.JPDDHItem[] = cfg.m_stCostItemList;
                let length: number = m_stCostItemList.length;
                for (j = 0; j < length; j++) {
                    cfgItem = m_stCostItemList[j];
                    if (cfgItem.m_iID && cfgItem.m_iCount) {
                        rewardItemVo = RewardIconItemData.alloc();
                        rewardItemVo.id = cfgItem.m_iID;
                        rewardItemVo.number = cfgItem.m_iCount;
                        itemVo.rewardVec.push(rewardItemVo);
                    }
                }
                let m_stItemList: GameConfig.JPDDHItem[] = cfg.m_stItemList;
                cfgItem = m_stItemList[0];
                if (cfgItem.m_iID && cfgItem.m_iCount) {
                    rewardItemVo = RewardIconItemData.alloc();
                    rewardItemVo.id = cfgItem.m_iID;
                    rewardItemVo.number = cfgItem.m_iCount;
                    itemVo.rewardVec.push(rewardItemVo);
                }
                this._listData.push(itemVo);
            }
        }
        return this._listData;
    }

}
export default FanLiExchangeBasePanel;