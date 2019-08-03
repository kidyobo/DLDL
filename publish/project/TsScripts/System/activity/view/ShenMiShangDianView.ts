import { UnitCtrlType, EnumActState, EnumAutoUse } from 'System/constants/GameEnum';
import { BaseAvatar } from 'System/unit/avatar/BaseAvatar';
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { List, ListItem } from 'System/uilib/List'
import { MarketItemData } from 'System/data/vo/MarketItemData'
import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Color } from 'System/utils/ColorUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { DataFormatter } from 'System/utils/DataFormatter'
import { EnumStoreID } from 'System/constants/GameEnum'
import { DropPlanData } from 'System/data/DropPlanData'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { IconItem } from 'System/uilib/IconItem'
import { PriceBar } from 'System/business/view/PriceBar'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { TipFrom } from 'System/tip/view/TipsView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'

enum EnumSmsdRule {
    SHOW_DROP_ID = 60165024,
}

class SmsdItem extends ListItemCtrl {

    private rewardIconItem: IconItem;
    /**是否需要显示原价价格条*/
    private m_needYj: boolean = true;
    /**是否需要显示现价价格条*/
    private m_needXj: boolean = true;
    /**原价条*/
    private m_yjBar: PriceBar;
    /**现价条*/
    private m_xjBar: PriceBar;
    private btn_Buy: UnityEngine.GameObject;
    private data: MarketItemData;
    private shopItemNameText: UnityEngine.UI.Text;
    // private NextRefreshTimeText: UnityEngine.UI.Text;
    private discount:UnityEngine.UI.Text;
    private limitCountText:UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        this.rewardIconItem = new IconItem();
        this.rewardIconItem.setUsualIconByPrefab(itemIcon_Normal, ElemFinder.findObject(go, 'icon'));
        this.rewardIconItem.setTipFrom(TipFrom.normal);
        let xianJiaObj = ElemFinder.findObject(go, 'xianjia');
        //现价
        if (this.m_needXj) {
            this.m_xjBar = new PriceBar();
            this.m_xjBar.setComponents(xianJiaObj);
            this.m_xjBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID);
        }
        //原价现价
        let yuanJiaObj = ElemFinder.findObject(go, 'yuanjia');
        if (this.m_needYj) {
            this.m_yjBar = new PriceBar();
            this.m_yjBar.setComponents(yuanJiaObj);
            this.m_yjBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID);
        }
        this.discount = ElemFinder.findText(go,'discount/txtDiscount')
        this.btn_Buy = ElemFinder.findObject(go, 'btnBuy');
        this.limitCountText = ElemFinder.findText(this.btn_Buy,'Text');
        Game.UIClickListener.Get(this.btn_Buy).onClick = delegate(this, this.onBtnBuy);
        Game.UIClickListener.Get(go).onClick = delegate(this, this.onBtnBuy);
        this.shopItemNameText = ElemFinder.findText(go, 'nameText');
        // this.NextRefreshTimeText = ElemFinder.findText(go, 'limitText');
    }

    update(data: MarketItemData,index:number) {
        this.data = data;
        this.rewardIconItem.updateByMarketItemData(this.data);
        this.rewardIconItem.updateIcon();
        this.shopItemNameText.text = TextFieldUtil.getColorText(this.data.itemConfig.m_szName, Color.getColorById(this.data.itemConfig.m_ucColor));
        let excID = this.data.sellConfig.m_astExchange[0].m_iExchangeID;
        let yuanjia = G.DataMgr.npcSellData.getPriceByID(this.data.itemConfig.m_iID, 0, this.data.sellConfig.m_iStoreID, excID, 1, true);
        let xianjia = G.DataMgr.npcSellData.getPriceByID(this.data.itemConfig.m_iID, 0, this.data.sellConfig.m_iStoreID, excID, 1, false);
        let has = G.DataMgr.getOwnValueByID(excID);
        if (this.data.sellConfig) {
            let yuanjia1 = this.data.sellConfig.m_iMaxPrice;
            let xianjia1 = this.data.sellConfig.m_astExchange[0].m_iExchangeValue;
            this.setPrices(excID, yuanjia1, xianjia1, has);
        }
        //折扣率
        this.discount.text = uts.format('{0}折',this.data.sellConfig.m_iDiscount)
        if (null != this.data.sellLimitData) {
            let curCount = this.data.sellLimitData.boughtCount;
            let maxCount = this.data.sellLimitData.sellLimitConfig.m_iNumberPerDay;
            // this.NextRefreshTimeText.text = TextFieldUtil.getColorText(uts.format("{0}/{1}", curCount.toString(), maxCount.toString()), Color.GREEN);
            if (this.data.sellLimitData.getRestCount() > 0) {
                this.limitCountText.text = uts.format("限购{0}/{1}", curCount.toString(), maxCount.toString());
            }else{
                this.limitCountText.text = uts.format("售完");
            }
            UIUtils.setButtonClickAble(this.btn_Buy, this.data.sellLimitData.getRestCount() > 0);
        }
        else {
            // this.NextRefreshTimeText.text = "";
            this.limitCountText.text = '售完';
            UIUtils.setButtonClickAble(this.btn_Buy, true);
        }
    }

    private setPrices(excID: number, yuanjia: number, xianjia: number, has: number): void {
        //现价
        if (this.m_needXj) {
            this.m_xjBar.setCurrencyID(excID, true);
            if (has < xianjia) {
                this.m_xjBar.setPrice(xianjia, PriceBar.COLOR_CUSTOMER, Color.TAB_SELECT);
            }
            else {
                this.m_xjBar.setPrice(xianjia, PriceBar.COLOR_CUSTOMER, Color.TAB_SELECT);
            }
        }
        //原价
        if (this.m_needYj) {
            this.m_yjBar.setCurrencyID(excID, true);
            this.m_yjBar.setPrice(yuanjia, PriceBar.COLOR_CUSTOMER, Color.TAB_SELECT);
        }
    }


    private onBtnBuy() {
        let itemData: MarketItemData = new MarketItemData();
        let excID = this.data.sellConfig.m_astExchange[0].m_iExchangeID;
        G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.data.sellConfig.m_iItemID, 1,
            G.DataMgr.activityData.strotId,excID,0,EnumAutoUse.none,true,this.data.sellLimitData.sellLimitConfig.m_iNumberPerDay-this.data.sellLimitData.boughtCount);
    }



}


export class ShenMiShangDianView extends CommonForm {

    private shopList: List;

    private m_allRandomGoods: MarketItemData[];
    /**下次刷新价格*/
    private m_price: number = 0;
    /**刷新花费提示*/
    private m_refreshFlag: boolean = false;
    /**随机商店刷新时间*/
    private m_npcRandomStoreCfg: GameConfig.NPCRandomStoreCfgM;
    // private rewardList: List;
    private listData: MarketItemData[] = new Array<MarketItemData>();
    private tfCost: UnityEngine.UI.Text;
    private tfLeftCount: UnityEngine.UI.Text;
    /**立即刷新按钮*/
    private btnRefresh: UnityEngine.GameObject;
    private tfLeftTime: UnityEngine.UI.Text;
    private tfNextRefreshTime: UnityEngine.UI.Text;

    private itemIcon_Normal: UnityEngine.GameObject;

    //基础价格
    private baseCountMoney:number;
    //最大次数
    private maxCount:number;
    //累加价格
    private addPrice:number;
    open() {
        super.open();
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.ShenMiShangDianView;
    }

    protected initElements() {
        this.btnRefresh = this.elems.getElement('btn_refersh');
        this.tfNextRefreshTime = this.elems.getText('nextReferTime');
        this.tfCost = this.elems.getText('nextCost');
        this.tfLeftCount = this.elems.getText('leftTime');
        this.tfLeftTime = this.elems.getText('tfLeftTime');
        // this.rewardList = this.elems.getUIList('rewardList');
        this.shopList = this.elems.getUIList('mallList');
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        
    }

    protected initListeners() {
        this.addClickListener(this.btnRefresh, this.onBtnRefreshClick);
        this.addClickListener(this.elems.getElement('btn_return'), this.close);
        this.addClickListener(this.elems.getElement('mask'), this.close);
    }


    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        this.addTimer('checkTimer', 1000, 0, this.onTimer);
        this.baseCountMoney =  G.DataMgr.constData.getValueById(KeyWord.PARAM_ACT63_REFRESH_PRICE);
        this.maxCount = G.DataMgr.constData.getValueById(KeyWord.PARAM_ACT63_REFRESH_TIMES_MAX);
        this.addPrice = G.DataMgr.constData.getValueById(KeyWord.PARAM_ACT63_REFRESH_ADD_PRICE)
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BLACK_STORE,Macros.Act63_PANEL));
       
        //刷出珍稀道具
        // let dropPlanConfig: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(EnumSmsdRule.SHOW_DROP_ID);
        // this.rewardList.Count = dropPlanConfig.m_ucDropThingNumber;
        // for (let i = 0; i < dropPlanConfig.m_ucDropThingNumber; i++) {
        //     let iconItem = new IconItem();
        //     iconItem.setTipFrom(TipFrom.normal);
        //     iconItem.setUsuallyIcon(this.rewardList.GetItem(i).gameObject);
        //     iconItem.updateByDropThingCfg(dropPlanConfig.m_astDropThing[i]);
        //     iconItem.updateIcon();
        // }
    }

    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
        this.removeTimer('checkTimer');
    }


    /**
    *刷新的响应处理函数
    * @param e
    *
    */
    private onBtnRefreshClick(): void {
        if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.m_price, true)) {
            let str: string = uts.format('购买需要花费{0}, 是否继续？', TextFieldUtil.getYuanBaoText(this.m_price));
            if (this.m_refreshFlag) {
                this.onBuy();
            }
            else {
                G.TipMgr.showConfirm(str, ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onContinueBuy));
            }
        }
    }
 

    private onBuy(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BLACK_STORE,Macros.Act63_REFRESH));
    }

    private onContinueBuy(state: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == state) {
            this.m_refreshFlag = isCheckSelected;
            this.onBuy();
        }
    }


    updateGoodsList(list: Protocol.NPCStoreRandomThingInfo): void {
        this.listData.length = 0;
        for (let item of this.m_allRandomGoods) {
            if (item.itemConfig!=null) {
                //概率为1W的东西必显示
                if (list.m_iThingID.indexOf(item.itemConfig.m_iID) >= 0) {
                    this.listData.push(item);
                }
            }
        }
        // 刷新购买条件限制
        let itemData: MarketItemData;
        let len: number = list.m_iThingID.length;
        this.shopList.Count = len;
        for (let i = 0; i < len; i++) {
            itemData = this.listData[i];
            itemData.isCondLimited = !G.DataMgr.npcSellData.isBuyConditionMeet(itemData.sellConfig, false);
            itemData.canBuy = G.DataMgr.npcSellData.canBuy(itemData.sellConfig.m_iItemID);
            let smsdItem = new SmsdItem();
            smsdItem.setComponents(this.shopList.GetItem(i).gameObject, this.itemIcon_Normal);
            smsdItem.update(itemData,i);
        }
        this.m_price = list.m_uiPrice;
        let price = this.baseCountMoney;
        let str;
        if (G.DataMgr.activityData.refreshTimes<=this.maxCount) {
            if (G.DataMgr.activityData.refreshTimes>0) {
                price += this.addPrice*G.DataMgr.activityData.refreshTimes;
            }
            str = TextFieldUtil.getColorText(uts.format('下次刷新消耗：{0}钻石', price), Color.TAB_SELECT);
        }else{
            str = '次数已用完！';
        }
        this.m_price = price;
        this.tfCost.text = str;
        let leftCountStr = this.maxCount - G.DataMgr.activityData.refreshTimes;
        this.tfLeftCount.text = TextFieldUtil.getColorText(uts.format('剩余刷新次数：{0}次', leftCountStr), Color.TAB_SELECT);
    }
    /**刷新商店id */
    updateStoreId(num:number) {
       this.m_allRandomGoods = G.DataMgr.npcSellData.getMallListByType(G.DataMgr.activityData.strotId);
       this.m_npcRandomStoreCfg = G.DataMgr.npcSellData.getNpcRandomStoreCfg(G.DataMgr.activityData.strotId);
       UIUtils.setButtonClickAble(this.btnRefresh.gameObject, G.DataMgr.activityData.refreshTimes<this.maxCount);
        if (G.DataMgr.activityData.strotId != 0) {
            if (num == Macros.Act63_PANEL) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getExchangeStoreOpenRequest(G.DataMgr.activityData.strotId, G.DataMgr.npcSellData.getNpcIDByStoreID(G.DataMgr.activityData.strotId)));
            }else if(num == Macros.Act63_REFRESH){
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getExchangeStoreRefreshRequest(G.DataMgr.activityData.strotId, G.DataMgr.npcSellData.getNpcIDByStoreID(G.DataMgr.activityData.strotId)));
            }
        }
    }

    private onTimer(timer: Game.Timer): void {
        //显示时间
        let activityEndTime = G.DataMgr.activityData.getActivityEndTime(Macros.ACTIVITY_ID_BLACK_STORE);

        let curtime = Math.floor(G.SyncTime.getCurrentTime() / 1000);

        let timeDiff = activityEndTime - curtime;
        if (timeDiff > 0) {
            this.tfLeftTime.text = uts.format('活动剩余时间：{0}',
                TextFieldUtil.getColorText(DataFormatter.second2day(timeDiff), Color.GREEN));
        }
        else {
            this.tfLeftTime.text = '';
        }

        //下次自动刷新时间
        let nextTime: number = 0;
        let zero: number = 0;
        zero = nextTime = Math.floor( G.SyncTime.getNextTime(0, 0, 0) / 1000);
        //下一个刷新时间在配置表中的索引
        let nextTimeStage: number = 0;
        let hour: number = 0;
        let min: number = 0;
        if (this.m_npcRandomStoreCfg != null) {
            for (let i: number = 0; i < this.m_npcRandomStoreCfg.m_dtRefreshTimes.length; i++) {
                let time = DataFormatter.translateTime2Time(this.m_npcRandomStoreCfg.m_dtRefreshTimes[i]);
                let times: number = Math.floor(G.SyncTime.getNextTime(parseInt(time[0]), parseInt(time[1]), parseInt(time[2])) / 1000);
                if (nextTime >= times) {
                    nextTime = Math.floor(G.SyncTime.getNextTime(parseInt(time[0]), parseInt(time[1]), parseInt(time[2])) / 1000);
                    nextTimeStage = i;
                    hour = parseInt(time[0]);
                    min = parseInt(time[1]);
                }
            }
            let content: string;
            if (nextTime == zero) {
                content = '00:00';
            }
            else {
                // content = String(this.m_npcRandomStoreCfg.m_dtRefreshTimes[nextTimeStage]).substr(0, String(this.m_npcRandomStoreCfg.m_dtRefreshTimes[nextTimeStage]).length - 3);
            }
            let timeStr = DataFormatter.second2mmddmm(G.DataMgr.activityData.nextRefreshTime);
            this.tfNextRefreshTime.text = uts.format('下次自动刷新时间：{0}', TextFieldUtil.getColorText(timeStr.toString(), Color.GREEN));
        }
    }


}