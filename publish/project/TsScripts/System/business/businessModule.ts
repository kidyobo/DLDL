import { FanLiDaTingView } from "System/activity/fanLiDaTing/FanLiDaTingView";
import { SevenDayView } from "System/activity/fldt/sevenDayLogin/SevenDayView";
import { AfterSevenDayActView } from "System/activity/fanLiDaTing/AfterSevenDayActView";
import { LuckyExchangeView } from "System/activity/view/LuckyExchangeView";
import { ShenMiShangDianView } from "System/activity/view/ShenMiShangDianView";
import { XianShiTeMaiView } from "System/activity/view/XianShiTeMaiView";
import { BatBuyView } from "System/business/view/BatBuyView";
import { JinJieRiBatBuyView } from "System/business/view/JinJieRiBatBuyView";
import { MallView } from "System/business/view/MallView";
import { Constants } from "System/constants/Constants";
import { EnumAutoUse, EnumStoreID } from "System/constants/GameEnum";
import { EnumBuyAutoUse } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { ThingData } from "System/data/thing/ThingData";
import { ThingItemData } from "System/data/thing/ThingItemData";
import { MarketItemData } from "System/data/vo/MarketItemData";
import { SellLimitData } from "System/data/vo/SellLimitData";
import { EventDispatcher } from "System/EventDispatcher";
import { Global as G } from "System/global";
import { MergeView } from "System/mergeActivity/MergeView";
import { BossView } from "System/pinstance/boss/BossView";
import { DiGongBossPanel } from "System/pinstance/boss/DiGongBossPanel";
import { JishouView } from "System/jishou/JishouView";
import { ErrorId } from "System/protocol/ErrorId";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { TanBaoView } from "System/tanbao/TanBaoView";
import { ConfirmCheck } from "System/tip/TipManager";
import { MessageBoxConst } from "System/tip/TipManager";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { ExchangeView } from 'System/business/view/ExchangeView';
import { KuaiSuShengJiView } from "System/activity/view/KuaiSuShengJiView"
import { KaiFuHuoDongView } from "System/activity/kaifuhuodong/KaiFuHuoDongView";

/**
 * 交易模块，比如商城，npx售卖等
 * @author teppei
 *
 */
export class BusinessModule extends EventDispatcher {
    constructor() {
        super();

        // 购买了历练道具，要更新前台的限购数量
        this.addNetListener(Macros.MsgID_SpecialItemListChanged_Notify, this._onSellLimitRefresh);

        this.addNetListener(Macros.MsgID_NPCBehaviour_Response, this._onNPCBehaviourResponse);
        this.addNetListener(Macros.MsgID_NPCStoreLimitList_Response, this._onNpcStoreLimitListResponse);
    }

    onCurrencyChange(id: number) {
        let mallView = G.Uimgr.getForm<MallView>(MallView);
        if (mallView != null) {
            mallView.onUpdateMoneyShow();
        }

        let exchangeView = G.Uimgr.getForm<ExchangeView>(ExchangeView);
        if (exchangeView != null) {
            exchangeView.onUpdateMoneyShow();
        }

        let batBuyView = G.Uimgr.getForm<BatBuyView>(BatBuyView);
        if (batBuyView != null) {
            batBuyView.onUpdateMoneyShow();
        }


        let tanBaoView = G.Uimgr.getForm<TanBaoView>(TanBaoView);
        if (tanBaoView != null) {
            tanBaoView._onUpdateMoneyShow();
        }
    }

    onSellLimitChange() {
        let mallView = G.Uimgr.getForm<MallView>(MallView);
        if (mallView != null) {
            mallView.onSellLimitDataChange();
        }

        let view = G.Uimgr.getForm<LuckyExchangeView>(LuckyExchangeView);
        if (view != null) {
            view.updateView();
        }

        let jinRiTeHuiView = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
        if (jinRiTeHuiView != null) {
            jinRiTeHuiView.onSellLimitDataChange();
        }

        let jinJieRiView = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
        if (jinJieRiView != null) {
            jinJieRiView.onSellLimitDataChange();
        }

        let sevenDayView = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        if (sevenDayView != null) {
            sevenDayView.onSellLimitDataChange();
        }
        //合服
        let hefuView = G.Uimgr.getForm<MergeView>(MergeView);
        if (hefuView != null) {
            hefuView.onSellLimitDataChange();
        }
        // 限时特卖
        let xianShiTeMai = G.Uimgr.getForm<XianShiTeMaiView>(XianShiTeMaiView);
        if (xianShiTeMai != null) {
            xianShiTeMai.onSellLimitDataChange();
        }

        let afterSevenDayView = G.Uimgr.getForm<AfterSevenDayActView>(AfterSevenDayActView);
        if (afterSevenDayView != null) {
            afterSevenDayView.onSellLimitDataChange();
        }

        let jinJieRiBatBuyView = G.Uimgr.getForm<JinJieRiBatBuyView>(JinJieRiBatBuyView);
        if (jinJieRiBatBuyView != null) {
            jinJieRiBatBuyView.updateView();
        }

        let jishouView = G.Uimgr.getForm<JishouView>(JishouView);
        if (jishouView != null) {
            jishouView.onSellLimitDataChange();
        }

        G.ActBtnCtrl.update(false);
    }

    /**
     * 售卖限购更新通知的响应函数。
     *
     */
    private _onSellLimitRefresh(notify: Protocol.SpecialItemListChanged_Notify): void {
        // 更新限购商品数量信息
        G.DataMgr.npcSellData.updateBoughtCount(notify.m_stSpecialItemList);
    }

    /**
     * 打开充值页面。
     * @param needConfirm 是否需要弹出确认框，传false直接弹出充值页面。
     * @param confirmText 确认文字，传空字符串则使用默认文字。
     * @param chargeValue 充值金额，可选。
     * @param chargeVip 充值VIP等级，可选。
     *
     */
    queryCharge(confirmText: string) {
        G.TipMgr.showConfirm(confirmText, ConfirmCheck.noCheck, "确定|取消", delegate(this, this._continueRecharge));
    }

    private _continueRecharge(state: MessageBoxConst, isCheckSelected: boolean) {
        let kuaisushengjiView = G.Uimgr.getForm<KuaiSuShengJiView>(KuaiSuShengJiView);
        let fanlidatingView = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
        if (MessageBoxConst.yes == state) {
            if (kuaisushengjiView != null) {
                kuaisushengjiView.close();
            } else if (fanlidatingView != null) {
                fanlidatingView.close();
            }

            G.ActionHandler.go2Pay();
        }
    }

    /**
     * 打开购买商城物品确认框事件的响应函数。
     * @param itemData 购买的物品配置。
     * @param quantity 购买数量，默认为1。当为续费操作时，忽略购买数量，采用默认值1。
     * @param amount 表示几组，同一个id可能配了单卖、10个打包卖、20打包卖等，需指明购买的是哪种类型，默认0表示单卖。
     * @param popBuyConfirm 是否弹出购买确认对话框，默认为是。
     *
     */
    directBuy(id: number, quantity = 1, storeID = 0, excID = 0, amount = 0, popBuyConfirm = true, autoUse = 0): void {
        let itemData: MarketItemData = G.DataMgr.npcSellData.getMarketDataByItemId(id, storeID, excID, amount);

        if (defines.has('_DEBUG')) {
            uts.assert(null != itemData, '不存在的商品：' + id + '|' + storeID + '|' + excID);
        }

        if (!this.checkBuyCondition(itemData.sellConfig, quantity)) {
            return;
        }

        // 因为钻石和铜钱具有绑定非绑定之分，所以要重新校正
        excID = itemData.getExc(excID).m_iExchangeID;

        let cost: number = G.DataMgr.npcSellData.getPriceByID(itemData.sellConfig.m_iItemID, 0, itemData.sellConfig.m_iStoreID, excID, quantity, false, false, true);
        // 检查货币
        if (0 != G.ActionHandler.getLackNum(excID, cost, true)) {
            return;
        }

        if (popBuyConfirm) {
            let thingConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(itemData.sellConfig.m_iItemID);
            G.TipMgr.showConfirm(uts.format('确定花费{0}{1}购买{2}个{3}吗？', cost, KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, excID), quantity, thingConfig.m_szName),
                ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onBuyConfirm, itemData.sellConfig, quantity, excID, autoUse));
        }
        else {
            this._onBuyConfirm(MessageBoxConst.yes, true, itemData.sellConfig, quantity, excID, autoUse);
        }
    }

    private _onBuyConfirm(state: MessageBoxConst, isCheckSelected: boolean, sellConfig: GameConfig.NPCSellConfigM, num: number, excID: number, autoUse: number): void {
        if (MessageBoxConst.yes == state) {
            this._buyNpcItem(sellConfig, num, excID, autoUse);
        }
    }

    private _onNpcStoreLimitListResponse(response: Protocol.NPCStoreLimitList_Response): void {
        if (ErrorId.EQEC_Success == response.iResultID) {
            G.DataMgr.npcSellData.updateGlobalLimit(response);
        }
        else {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.iResultID));
        }
    }

    private _autoUseThing(autoUse: number, id: number, number: number): void {
        if (EnumBuyAutoUse.USE_ITEM == autoUse) {
            let itemList: ThingItemData[] = G.DataMgr.thingData.getBagItemById(id, false, 1);
            if (null != itemList && itemList.length > 0) {
                let itemData: ThingItemData = itemList[0];
                G.ModuleMgr.bagModule.useThing(itemData.config, itemData.data, number);
            }
        }
    }

    /**获取服务器消息*/
    private _onNPCBehaviourResponse(response: Protocol.NPCBehaviour_Response) {
        if (ErrorId.EQEC_Success != response.m_uiResultID) {
            // 出现异常
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_uiResultID));
            return;
        }
        switch (response.m_ucBehaviourID) {
            case Macros.NPC_BEHAVIOUR_BUY:
                if (response.m_ucAutoUse == EnumAutoUse.NormalUse) {
                    // 自动使用
                    this._autoUseThing(response.m_ucAutoUse, response.m_stThing.m_iThingID, response.m_stThing.m_iNumber);
                } else if (response.m_ucAutoUse == EnumAutoUse.DiGongMiYao) {
                    let diGongBossPanel = G.Uimgr.getSubFormByID<DiGongBossPanel>(BossView, KeyWord.OTHER_FUNCTION_DI_BOSS);
                    if (null != diGongBossPanel) {
                        diGongBossPanel.autoUseMiYao();
                    }
                }

                // 买了物品之后飞图标
                // if (EnumStoreID.GUILD_STORE == response.m_iStoreID && m_manager.dlgMgr.isDialogShowing(EnumDialogName.GuildMainDialog)) {
                //    //宗门商店
                //    G.ModuleMgr.netModule.sendMsg(Protocol.fetchGuildAbstract());
                //}
                if (G.DataMgr.activityData.strotId == response.m_iStoreID) {
                    let view = G.Uimgr.getForm<ShenMiShangDianView>(ShenMiShangDianView);
                    if (view != null) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getExchangeStoreOpenRequest(G.DataMgr.activityData.strotId, G.DataMgr.npcSellData.getNpcIDByStoreID(G.DataMgr.activityData.strotId)));
                    }
                }
                else if (EnumStoreID.MDBK_ID == response.m_iStoreID) {
                    G.DataMgr.tgbjData.addOneExchangeRecord(response.m_stThing);
                }
                else if (EnumStoreID.STORE_REBORN == response.m_iStoreID) {
                    let view = G.Uimgr.getForm<ExchangeView>(ExchangeView);
                    if (view != null) {
                        view.onUpdateMoneyShow();
                    }
                }
                // 检查是否全球限购商品，如果是的话需要重拉限购数据
                let sellLimitData: SellLimitData = G.DataMgr.npcSellData.getNPCSellLimitDataById(response.m_iStoreID, response.m_stThing.m_iThingID);
                if (null != sellLimitData && (0 != sellLimitData.sellLimitConfig.m_iStartTime || 0 != sellLimitData.sellLimitConfig.m_iEndTime)) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getNpcStoreLimitListRequst(response.m_iStoreID));
                }
                break;
            case Macros.NPC_BEHAVIOUR_RANDOM_LIST:
            case Macros.NPC_BEHAVIOUR_RANDOM_RESET:
                let view = G.Uimgr.getForm<ShenMiShangDianView>(ShenMiShangDianView);
                if (view != null) {
                    view.updateGoodsList(response.m_stRandomThingInfo);
                }
                break;

            default:
                break;
        }
    }

    /**
     * 检查购买条件是否满足，包括检查声望、日限购/日限购。
     * @param buyItemInfo 物品的售卖配置
     * @param itemCount 购买数量
     * @return 如果人物声望、限购满足购买条件则返回<CODE>true</CODE>，否则返回<CODE>false</CODE>。
     *
     */
    checkBuyCondition(buyItemInfo: GameConfig.NPCSellConfigM, itemCount: number): boolean {
        if (null == buyItemInfo) {
            G.TipMgr.addMainFloatTip('物品售卖信息异常');
            return false;
        }

        if (itemCount <= 0) {
            // 数量必须大于0
            G.TipMgr.addMainFloatTip('请输入正确的购买数量');
            return false;
        }

        // 检查购买条件
        if (!G.DataMgr.npcSellData.isBuyConditionMeet(buyItemInfo, true)) {
            return false;
        }

        // 检查vip等级和日限购
        let limitInfo: SellLimitData = G.DataMgr.npcSellData.getNPCSellLimitDataById(buyItemInfo.m_iStoreID, buyItemInfo.m_iItemID);
        if (limitInfo) {
            //if(limitInfo.vipSellLevel > G.DataMgr.heroData.curVipMonthLevel)
            if (limitInfo.vipSellLevel > G.DataMgr.heroData.curVipLevel) {
                G.TipMgr.addMainFloatTip(uts.format('只有达到{0}', TextFieldUtil.getVipText(limitInfo.vipSellLevel, 0)));
                return false;
            }
            let restCount: number = limitInfo.getRestCount();
            // 日限量
            if (restCount <= 0) {
                G.TipMgr.addMainFloatTip('您的购买数量已经用完了。');
                return false;  // 达到购买上限了直接返回
            }
            else if (restCount < Constants.NO_LIMIT) // Constants.NO_LIMIT表示不限量
            {
                if (restCount < itemCount) {
                    // G.TipMgr.addMainFloatTip(uts.format('只能购买{0}个，请修改数量。', restCount));
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 购买NPC商品事件的响应函数。
     * @param itemID 购买的物品ID。
     * @param storeID 商店ID。
     * @param excID 支付货币ID。
     * @param buyNum 购买数量，默认为1。
     *
     */
    private _onBuyNpcStoreItem(itemID: number, storeID: number = 0, excID: number = 0, buyNum: number = 1, autoUse: number = 0): void {
        let itemSellConfig: GameConfig.NPCSellConfigM = G.DataMgr.npcSellData.getNPCSellDataByItemId(itemID, storeID, excID);
        if (null == itemSellConfig || !this.checkBuyCondition(itemSellConfig, 1)) {
            return;
        }

        // 校正默认参数
        if (0 == storeID) {
            storeID = itemSellConfig.m_iStoreID;
        }
        if (0 == excID) {
            excID = itemSellConfig.m_astExchange[0].m_iExchangeID;
        }

        let cost: number = G.DataMgr.npcSellData.getPriceByID(itemSellConfig.m_iItemID, 0, storeID, excID, buyNum, false, false, true);

        if (0 == G.ActionHandler.getLackNum(excID, cost, true)) {
            this._buyNpcItem(itemSellConfig, buyNum, excID, autoUse);
        }
    }

    private _buyNpcItem(sellConfig: GameConfig.NPCSellConfigM, number: number, excID: number, autoUse: number): void {
        let npcID: number = G.DataMgr.npcSellData.getNpcIDByStoreID(sellConfig.m_iStoreID);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getBuyItemRequest(npcID, sellConfig.m_ucSequence, sellConfig.m_ucAmount, number, sellConfig.m_iItemID, excID, sellConfig.m_iStoreID, autoUse));
    }
}
