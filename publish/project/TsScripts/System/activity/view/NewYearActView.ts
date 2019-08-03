import { CurrencyTip } from './../../uilib/CurrencyTip';
import { JuBaoPenView } from './../YunYingHuoDong/JuBaoPenView';
import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { TabForm } from "System/uilib/TabForm"
import { UIPathData } from "System/data/UIPathData"
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ThingData } from 'System/data/thing/ThingData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { GeRenBossPanel } from 'System/activity/YunYingHuoDong/GeRenBossPanel'
import { KuaFuNianShouPanel } from 'System/activity/YunYingHuoDong/KuaFuNianShouPanel'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { SpringLeiJiChongZhiView } from 'System/activity/chunjiehuodong/SpringLeiJiChongZhiView'
import { ChunJieDengLuPanel } from 'System/activity/view/ChunJieDengLuPanel'
import { RewardIconItemData } from "System/data/vo/RewardIconItemData";
import { CeremonyBoxView } from 'System/activity/view/CeremonyBoxView';
import { QuanMingHaiQiPanel } from 'System/activity/view/QuanMingHaiQiPanel'
import { CollectExchangePanel } from 'System/activity/view/CollectExchangePanel'
import { ChongZhiZheKouPanel } from 'System/activity/view/ChongZhiZheKouPanel'


//该面板为其他子面板的父面板
export class NewYearActView extends TabForm {
    private openTabId: number = 0;
    private currencyTip:CurrencyTip;
    constructor() {
        super(KeyWord.ACT_FUNCTION_YUNYINGHUODONG1, GeRenBossPanel, KuaFuNianShouPanel, ChunJieDengLuPanel,
            QuanMingHaiQiPanel,JuBaoPenView, SpringLeiJiChongZhiView, CeremonyBoxView, CollectExchangePanel, ChongZhiZheKouPanel);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.NewYearActView;
    }

    protected initElements(): void {
        super.initElements();
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.elems.getElement("btnReturn"), this.onBtnReturn);
        this.addClickListener(this.elems.getElement("mask"), this.onBtnReturn);
        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("CurrencyTip"));
    }

    onContainerChange(type: number) {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.updateZheKouChongZhiPanel();
        }
    }

    /**
     * 
     * @param openTab 即各个panel的id
     */
    open(openTabId: number = KeyWord.OTHER_FUNCTION_GERENHUODONGBOSS) {
        this.openTabId = openTabId;

        super.open();
    }
    protected onClose(){
        G.ViewCacher.mainView.setViewEnable(true);
    }
    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        let activityData = G.DataMgr.activityData;
        let funcLimitData = G.DataMgr.funcLimitData;
        let idLen = this.tabIds.length;
        for (let i = 0; i < idLen; i++) {
            let funId = this.tabIds[i];
            // 先判断页签功能是否开启
            let isShow = funcLimitData.isFuncEntranceVisible(funId);
            // 再判断活动
            if (isShow) {
                if (funId == KeyWord.OTHER_FUNCTION_KUAFUHUODONGBOSS) {
                    let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
                    let data = G.DataMgr.activityData.newYearData.kfnsInfo;
                    if (data != null) {
                        let time = Math.max(0, data.m_uiActEndTime - now);
                        isShow = time > 0 ? true : false;
                    }
                    else {
                        isShow = false;
                    }
                }
                else {
                    let activityId = activityData.getActIdByFuncId(funId);
                    isShow = activityData.isActivityOpen(activityId);
                }
            }
            this.tabGroup.GetToggle(i).gameObject.SetActive(isShow);

            if (funId == this.openTabId && !isShow) {
                // 指定的页签不能显示
                this.openTabId = 0;
            }
            this.updateTabAngle();

        }
        this.switchTabFormById(this.openTabId);
        this.checkCollectExchangeTipMark();
        this.checkGeRenBossTipMark();
        this.checkKuaFuBossTipMark();
        this.ChunJieLeiJiTipMark();
        this.checkDailyLotteryTipMark();
        this.checkChunJieDengLuMark();
        this.checkExchangeTipMark();
        this.checkQMHQTipMark();
        this.lianXuChongZhiTipMark();
        this.checkChongZhiZheKouTIpMark();
        this.ceremonyBoxTipMark();
        this.cheackJuBaoPen()//聚宝盆
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_KFNS, Macros.ACTIVITY_KFNS_OPEN));
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLLECT_EXCHANGE, Macros.ACTIVITY_SJDH_PANNEL));
        this.onUpdateMoney();
    }
    /**更新小原点显示*/
    public updateTabAngle(): void {
        let activityData = G.DataMgr.activityData;
    }
    onUpdateMoney() {
        if (this.currencyTip != null) {
            this.currencyTip.updateMoney();
        }
    }
    /**更新充值折扣角标*/
    checkChongZhiZheKouTIpMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_CHONGZHIZHEKOU, G.DataMgr.activityData.isCZZKCanGetRewardCount() > 0);
    }

    /**更新收集兑换角标*/
    checkCollectExchangeTipMark(): void {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_COLLECT_EXCHANGE, TipMarkUtil.collectExchange());
    }

    /**更新每日抽奖角标*/
    private checkDailyLotteryTipMark() {
        //this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_DAILY_LOTTERY, TipMarkUtil.dailyLottery());
    }

    /**更新个人BOSS角标*/
    private checkGeRenBossTipMark(): void {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_GERENHUODONGBOSS, TipMarkUtil.geRenBossTipMark());
    }

    /**更新跨服年兽角标*/
    private checkKuaFuBossTipMark(): void {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_KUAFUHUODONGBOSS, TipMarkUtil.kuaFuNianShouTipMark());
    }

    /**更新累计充值角标*/
    private ChunJieLeiJiTipMark(): void {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_LEIJICHONGZHI, TipMarkUtil.cjhdljcz());
    }
    /**更新累计功能角标*/
    private checkChunJieDengLuMark(): void {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_DENGRUJIANGLI, G.DataMgr.activityData.newYearData.isChunJieLoginTipMark());
    }
    /**连续充值角标*/
    private lianXuChongZhiTipMark(): void {
        //this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_LIANXUCHONGZHI, TipMarkUtil.lianXuChongZhiTipMark());
    }

    //更新跨服BOSS活动
    updateKuaFuBoss(): void {
        let kuaFuBossPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_KUAFUHUODONGBOSS) as KuaFuNianShouPanel;
        if (KuaFuNianShouPanel != null && kuaFuBossPanel.isOpened) {
            kuaFuBossPanel.updateView();
        }
        this.checkKuaFuBossTipMark();
    }
    //连续充值
    updateLianXuChongZhi(): void {
        //let lianXuChongZhiPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_LIANXUCHONGZHI) as LianXuChongZhiPanel;
        //if (lianXuChongZhiPanel != null && lianXuChongZhiPanel.isOpened) {

        //    lianXuChongZhiPanel.updatePanel();
        //}
        //this.lianXuChongZhiTipMark();
    }


    //更新盛典宝箱活动
    updateCeremonyBox(): void {
        let ceremonyBoxPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_MEREONYBOX) as CeremonyBoxView;
        if (KuaFuNianShouPanel != null && ceremonyBoxPanel.isOpened) {
            ceremonyBoxPanel.update();
        }

        this.ceremonyBoxTipMark();
    }

    ceremonyBoxTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_MEREONYBOX, TipMarkUtil.ceremonyBoxTipMark());

    }

    /**
     * 关闭返回按钮
     */
    private onBtnReturn(): void {
        this.close();
    }

    ////////////////////////////累计充值///////////////////////////
    updateLeiJieChongZhiPanel() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_LEIJICHONGZHI) as SpringLeiJiChongZhiView;
        if (view.isOpened) {
            view.updatePanel();
        }
        //this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_LEIJICHONGZHI, G.DataMgr.activityData.newYearData.iscjhdShowLoginTipMark());
        this.ChunJieLeiJiTipMark();
    }
    ////////////////////////////折扣充值///////////////////////////
    updateZheKouChongZhiPanel() {
        //let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_CHARGE_REBATE) as SpringZheKouChongZhiView;
        //if (view.isOpened) {
        //    view.updatePanel();
        //}

    }
    updaterChunJieDengluPanel() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_DENGRUJIANGLI) as ChunJieDengLuPanel;
        if (view.isOpened) {
            view.updatePanel();
        }
        this.checkChunJieDengLuMark();
    }



    ////////////////////////收集兑换////////////////////////////////////////

    onCollectExchangeChanged() {
        this.checkCollectExchangeTipMark();
        let collectPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_COLLECT_EXCHANGE) as CollectExchangePanel;
        if (collectPanel != null && collectPanel.isOpened) {
            collectPanel.onCollectExchangeChanged();
        }
    }

    ////////////////////////每日抽奖////////////////////////////////////////

    //onDailyLotteryChanged(rsp: Protocol.DaylyLotteryRsp) {
    //    this.checkDailyLotteryTipMark();
    //    let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_DAILY_LOTTERY) as SpringZhuanPanPanel;
    //    if (panel != null && panel.isOpened) {
    //        panel.onDailyLotteryChanged(rsp);
    //    }
    //}

    /**
  *更新 阶级
  */
    updateNewYearStagePanel() {
        //let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_NEWYEARStAGE_SMALL) as NewYearStagePanel;
        //if (view.isOpened) {
        //    view.updatePanel();
        //}
        //this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_NEWYEARStAGE_SMALL, G.DataMgr.activityData.newYearData.isShowStageTipMark());
    }

    updateNewYearChargePanel() {
        //let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_NEWYEARCHARGE_SMALL) as NewYearChargePanel;
        //if (view.isOpened) {
        //    view.updatePanel();
        //}
        //this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_NEWYEARCHARGE_SMALL, G.DataMgr.activityData.newYearData.isShowChargeTipMark());
    }


    updateChongZhiZheKouPanel() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_CHONGZHIZHEKOU) as ChongZhiZheKouPanel;
        if (view.isOpened) {
            view.updatePanel();
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_CHONGZHIZHEKOU, G.DataMgr.activityData.isCZZKCanGetRewardCount() > 0);
    }

    /**
    *更新Vip
    */
    updateNewYearLoginPanel() {
        //let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_NEWYEARVIP_SMALL) as NewYearLoginPanel;
        //if (view.isOpened) {
        //    view.updatePanel();
        //}

        //this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_NEWYEARVIP_SMALL, G.DataMgr.activityData.newYearData.isShowLoginTipMark());
    }

    updatePanel() {
        this.updateNewYearChargePanel();
        this.updateNewYearLoginPanel();
        this.updateNewYearStagePanel();
        this.updateChongZhiZheKouPanel();
    }

    /**
     * 每次送花成功后，跟新打开的界面
     */
    sendMsgToUpdateRankPanel() {
        //if (G.DataMgr.runtime.qrjCurOpenTabId == KeyWord.OTHER_FUNCTION_QRJ_FUKEDIGUO) {
        //    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_QRJPHB, Macros.ACTIVITY_QRJPHB_LIST_RANK, KeyWord.QRJPHB_RANK_SEND));
        //} else {
        //    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_QRJPHB, Macros.ACTIVITY_QRJPHB_LIST_RANK, KeyWord.QRJPHB_RANK_RECV));
        //}
    }

    /**
     * 跟新鲜花排行显示
     */
    updateFlowersRankPanel() {
        //let currentForm = this.getCurrentTab();
        //if (currentForm != null && currentForm.isOpened) {
        //    let view = currentForm as QRJFlowerRankBase;
        //    if (view.updatePanel) {
        //        view.updatePanel();
        //    }
        //}
    }

    updateQRJZPanel() {
        //let form = this.getTabFormByID(KeyWord.OTHER_FUNCTION_QRJ_ZHUANZHUANLE);
        //if (form != null && form.isOpened) {
        //    let view = form as QrjZpView;
        //    view.onUpdatePanel();
        //}
    }

    //updateQRJZPDrawPanel(data: Protocol.ActQRJZPDrawRsp) {
    //    let form = this.getTabFormByID(KeyWord.OTHER_FUNCTION_QRJ_ZHUANZHUANLE);
    //    if (form != null && form.isOpened) {
    //        let view = form as QrjZpView;
    //        let itemDatas: RewardIconItemData[] = [];
    //        let bagItemCnt = data.m_iItemList.length;
    //        let isAdd: boolean = false;
    //        for (let i = 0; i < bagItemCnt; i++) {
    //            for (let j = 0, len = itemDatas.length; j < len; j++) {
    //                if (data.m_iItemList[i].m_iItemID == itemDatas[j].id) { //堆叠
    //                    itemDatas[j].number += data.m_iItemList[i].m_iItemCount;
    //                    isAdd = true;
    //                    break;
    //                }
    //            }
    //            if (isAdd) {
    //                isAdd = false;
    //                continue;
    //            }
    //            let itemInfo = data.m_iItemList[i];
    //            let itemData = new RewardIconItemData();
    //            itemData.id = itemInfo.m_iItemID;
    //            itemData.number = itemInfo.m_iItemCount;
    //            itemDatas.push(itemData);
    //        }

    //        view.onUpdateDraw(data);
    //        view.onUpdateReward(itemDatas, data.m_iItemList.length, data.m_iCount);
    //        view.onUpdateMembers(0);
    //        view.onUpdateMembers(1);
    //    }
    //}

    onSellLimitDataChange() {
        //let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_QRJ_DADUIHUAN) as QingRenJieExchangePanel;
        //if (panel.isOpened) {
        //    panel.updateView();
        //}
        //this.checkExchangeTipMark();
    }

    /**更新情人节兑换角标*/
    private checkExchangeTipMark(): void {
        //this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_QRJ_DADUIHUAN, TipMarkUtil.qingRenJieExchange());
    }


    ////////////////////////////全民(｡･∀･)ﾉﾞ嗨起///////////////////////////
    updateQuanMingHaiQiPanel() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_QUANMING_HAIQI) as QuanMingHaiQiPanel;
        if (view.isOpened) {
            view.updatePanel();
        }
        this.checkQMHQTipMark();
    }

    /**全民(｡･∀･)ﾉﾞ嗨起角标*/
    private checkQMHQTipMark(): void {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_QUANMING_HAIQI, TipMarkUtil.qmhqTipMark());
    }
     ////////////////////////////每日聚宝///////////////////////////
     private cheackJuBaoPen(){
        this.setTabTipMarkById(KeyWord.ACT_FUNCTION_JBP, TipMarkUtil.jubaoTipmark());
     }
    updateJuBaoPanel(){
        let view = this.getTabFormByID(KeyWord.ACT_FUNCTION_JBP) as JuBaoPenView;
        if (view.isOpened) {
            view.updateView();
        }
        this.cheackJuBaoPen();
     }
     updateListData(response: Protocol.JBPOneStatus){
        let view = this.getTabFormByID(KeyWord.ACT_FUNCTION_JBP) as JuBaoPenView;
        if (view.isOpened) {
            view.updateListData(response);
        }
     }
}
