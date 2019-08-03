import { WenJuanView } from './../wenjuandiaocha/WenJuanView';
import { Global as G } from 'System/global'
import { UILayer } from 'System/uilib/CommonForm'
import { TabForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { Macros } from 'System/protocol/Macros'
import { HongBaoYouLiView } from 'System/activity/view/HongBaoYouLiView'
import { KfhdShouChongTuanGouPanel } from 'System/activity/kfhd/KfhdShouChongTuanGouPanel'
import { SevenLeiChongView } from 'System/activity/kfhd/SevenLeiChongView'
import { LianChongChuPanel } from 'System/activity/kfhd/LianChongChuPanel'
import { LianChongZhongPanel } from 'System/activity/kfhd/LianChongZhongPanel'
import { LianChongGaoPanel } from 'System/activity/kfhd/LianChongGaoPanel'
import { LianChongBasePanel } from 'System/activity/kfhd/LianChongBasePanel'
import { BossZhaoHuanView } from 'System/activity/fldt/BossZhaoHuanView'
import { KaifuActivityData } from 'System/data/KaifuActivityData'
//import { JinJieRankPanel } from 'System/jinjieri/JinJieRankPanel'
//import { JjrRewardsPanel } from 'System/jinjieri/JjrRewardsPanel'
import { ActivityData } from 'System/data/ActivityData'
import { KaiFuJJRRankPanel } from 'System/jinjieri/KaiFuJJRRankPanel'
import { KaiFuJJRewardPanel } from 'System/jinjieri/KaiFuJJRewardPanel'
import { CurrencyTip } from 'System/uilib/CurrencyTip'
import { MainView } from "System/main/view/MainView";
import { SevenDayLoginPanel } from 'System/activity/fldt/sevenDayLogin/SevenDayLoginPanel'
import { EveryDayTargetView } from 'System/activity/fldt/sevenDayLogin/EveryDayTargetView'
import { KaiFuChongBangView } from 'System/activity/kaiFuChongBang/KaiFuChongBangView'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { UIUtils } from 'System/utils/UIUtils'

export class KaiFuHuoDongView extends TabForm {


    private btnClose: UnityEngine.GameObject;
    private currencyTip: CurrencyTip;

    private openTab = 0;
    private openLevel = 0;

    private week: number = 0;


    private wenjuanBg: UnityEngine.GameObject;
    private wenjuanIndex: number = 0;

    private readonly maxDayNum = 7;

    /**是否是首次打开*/
    private isFirstOpen: boolean = true;
    private selectDay: number = 0;
    private RANK_TYPE_INDEX1: number[] = [];

    constructor() {
        super(KeyWord.ACT_FUNCTION_KFHD, KaiFuChongBangView, EveryDayTargetView, SevenDayLoginPanel,
            KfhdShouChongTuanGouPanel, SevenLeiChongView, HongBaoYouLiView, BossZhaoHuanView,
            KaiFuJJRRankPanel, LianChongChuPanel, LianChongZhongPanel, LianChongGaoPanel, WenJuanView);//KaiFuJJRewardPanel, 
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.KaiFuHuoDongView;
    }

    protected initElements(): void {
        super.initElements();
        this.btnClose = this.elems.getElement('btn_close');
        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("CurrencyTip"));
        this.wenjuanBg = this.elems.getElement('wenjuanBg');
        this.wenjuanBg.SetActive(false);


        this.RANK_TYPE_INDEX1 = G.DataMgr.kaifuActData.getKaifuChongbangType();
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.btnClose, this.onclickBtnClose);
        this.addToggleGroupListener(this.tabGroup, this.onClickToggle);
    }

    protected onOpen() {
        super.onOpen();
        G.ViewCacher.mainView.setViewEnable(false);
        let openIndex = -1;
        let firstOpenedIndex = -1;
        let openSvrDay = G.SyncTime.getDateAfterStartServer() % KaifuActivityData.WeekDayCount;
        // 判断页签显示与否
        let cnt = this.tabIds.length;
        for (let i = 0; i < cnt; i++) {
            let isShow = G.DataMgr.funcLimitData.isFuncEntranceVisible(this.tabIds[i]);
            let funcId = this.tabIds[i];
            if (isShow) {
                if (this.tabIds[i] == KeyWord.OTHER_FUNCTION_KFLIANCHONGCHU ||
                    this.tabIds[i] == KeyWord.OTHER_FUNCTION_KFLIANCHONGZHONG ||
                    this.tabIds[i] == KeyWord.OTHER_FUNCTION_KFLIANCHONGGAO ||
                    this.tabIds[i] == KeyWord.ACT_FUNCTION_WENJUAN
                ) {
                    let type = LianChongBasePanel.panelKeyWords.indexOf(this.tabIds[i]) + 1;
                    this.week = G.DataMgr.kaifuActData.kfLCFLInfo.m_iWeek;
                    if (this.tabIds[i] == KeyWord.ACT_FUNCTION_WENJUAN) {
                        this.wenjuanIndex = i;
                    }
                    let startEndTimeArroy = G.DataMgr.kaifuActData.getStartAndEndTime(this.week, type);
                    openSvrDay = openSvrDay == 0 ? KaifuActivityData.WeekDayCount : openSvrDay;
                    let showWenjuan = G.DataMgr.wenjuanData.isFirstJoin(1 << Macros.SURVEY_GIFT) && G.DataMgr.wenjuanData.isShow;
                    let inStartAndEndTime = openSvrDay >= startEndTimeArroy[0] && openSvrDay <= startEndTimeArroy[1];
                    this.tabGroup.GetToggle(i).gameObject.SetActive(inStartAndEndTime || (funcId == KeyWord.OTHER_FUNCTION_KFLIANCHONGCHU && openSvrDay >= startEndTimeArroy[0]) || showWenjuan);
                }

                else {
                    this.tabGroup.GetToggle(i).gameObject.SetActive(true);
                }
                if (this.tabIds[i] == this.openTab) {
                    openIndex = i;
                } else if (firstOpenedIndex < 0) {
                    firstOpenedIndex = i;
                }
            } else {
                this.tabGroup.GetToggle(i).gameObject.SetActive(false);
            }
            let d = G.SyncTime.getDateAfterStartServer();
            if (d >= 8) {
                if (this.tabIds[i] == KeyWord.OTHER_FUNCTION_HONGBAOYOULI) {
                    openIndex = i;
                    this.tabGroup.GetToggle(i).gameObject.SetActive(true);
                }
                else if (this.tabIds[i] == KeyWord.OTHER_FUNCTION_KFHD_SCTG) {
                    this.tabGroup.GetToggle(i).gameObject.SetActive(false);
                }
            }
        }
        // 选中指定的页签
        if (openIndex < 0) {
            openIndex = firstOpenedIndex;
        }
        if (openIndex < 0) {
            openIndex = 0;
        }
        this.tabGroup.Selected = openIndex;

        //更新角标
        this.checkJzshlTipMark();
        this.checkSctgTipMark();
        this.checkHongBaoYouLiTipMark();
        this.update7DayTipMark();
        this.updateLCFLTipMark();
        this.updateBossZHTipMark();
        this.checkJinJieFanLiTipMark();
        this.updateWenjuanTipMark();
        this.updateSevenDayLoginTipMark();
        this.updateSevenDayTargetTipMark();
        this.updateKaiFuChongBangTipMark();
        //更新魂币
        this.onUpdateMoney();


        let afterOpenDay = G.SyncTime.getDateAfterStartServer();
        let sendMsgCount = afterOpenDay > 7 ? 7 : afterOpenDay;
        for (let i = 1; i <= sendMsgCount; i++) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFQMCBGetInfoRequest(i, this.RANK_TYPE_INDEX1[i - 1]));
        }
        //拉每日目标的，要不红点没有
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFMRMBGetInfoRequest());
    }

    open(tab = 0, level = 0) {
       
        this.openTab = tab;
        this.openLevel = level;
        super.open();
    }

    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
    }

    private onclickBtnClose() {
        this.close();
    }

    private onClickToggle(index: number) {
        if (this.wenjuanIndex > 0) {
            if (this.tabGroup.GetToggle(this.wenjuanIndex).isOn == true) {
                this.wenjuanBg.SetActive(true);
            } else {
                this.wenjuanBg.SetActive(false);
            }
        } else {
            this.wenjuanBg.SetActive(false);
        }
        this.switchTabForm(index);
    }


    ////天数红点
    //updateDayTipMark(dayIndex: number) {
    //    //每日签到
    //    this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_QTDLJ, G.DataMgr.activityData.kaifuSignData.canSignDay().indexOf(dayIndex) >= 0);

    //    //每日目标
    //    this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_7GOAL_DAILY, TipMarkUtil.dailyGoal(dayIndex + 1));

    //    //开服冲榜
    //    this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_7GOAL_KFCB, G.DataMgr.kaifuActData.canGetKaiFuChongBang(this.RANK_TYPE_INDEX1[dayIndex]));


    //}

    getSelectDay() {
        return this.selectDay;
    }




    //tab页红点
    private updateSubTabTipMark(dayIndex: number): boolean {

        //每日签到
        let allCanGetDay = G.DataMgr.activityData.kaifuSignData.canSignDay();
        if (allCanGetDay.indexOf(dayIndex) >= 0) {
            return true;
        }
        //每日目标
        if (TipMarkUtil.dailyGoal(dayIndex + 1)) {
            return true;
        }
        //开服冲榜
        let isShow = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_7GOAL_KFCB);
        if (isShow && G.DataMgr.kaifuActData.canGetKaiFuChongBang(this.RANK_TYPE_INDEX1[dayIndex])) {
            return true;
        }
        return false;

    }

    getAwardResponse() {
        if (this.selectDay == 7) return;
        //this.onTabDayClick(this.selectDay);//这里更新

        let sevenDayLoginPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_QTDLJ) as SevenDayLoginPanel;
        if (sevenDayLoginPanel != null) {
            sevenDayLoginPanel.updateView();
        }
        this.updateSevenDayLoginTipMark();
    }

    private updateSevenDayLoginTipMark() {
        //每日签到红点
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_QTDLJ, G.DataMgr.activityData.kaifuSignData.canSign());
    }

    onGetKFCBRankResponse(response: Protocol.KFQMCBGetRoleInfo_Response) {
        let kaifuchongbang = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7GOAL_KFCB) as KaiFuChongBangView;
        if (kaifuchongbang.isOpened) {
            kaifuchongbang.onGetRoleResponse(response);
        }
    }

    updateKaiFuChongBangView() {
        let kaifuchongbang = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7GOAL_KFCB) as KaiFuChongBangView;
        if (kaifuchongbang.isOpened) {
            kaifuchongbang.updateView();
        }
    }
    onGetKFCBRewardResponse(response: Protocol.KFQMCBGetReward_Response) {
        let kaifuchongbang = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7GOAL_KFCB) as KaiFuChongBangView;
        if (kaifuchongbang.isOpened) {
            kaifuchongbang.onGetRewardResponse(response);
        }
        this.updateKaiFuChongBangTipMark();
    }

    private updateKaiFuChongBangTipMark() {
        //开服冲榜红点
        let isShow = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_7GOAL_KFCB);

        let isShow2 = false;
        if (isShow)
            for (let i = 0; i < 7; i++) {
                isShow2 = G.DataMgr.kaifuActData.canGetKaiFuChongBang(this.RANK_TYPE_INDEX1[i]);
                if (isShow2) break;
            }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_7GOAL_KFCB, isShow && isShow2);
    }

    onGetKFCBInfoResponse(response: Protocol.KFQMCBGetInfo_Response) {
        let kaifuchongbang = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7GOAL_KFCB) as KaiFuChongBangView;
        if (kaifuchongbang.isOpened) {
            kaifuchongbang.onGetInfoResponse(response);
        }
    }
    onSellLimitDataChange() {
        let kaifuchongbang = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7GOAL_KFCB) as KaiFuChongBangView;
        if (kaifuchongbang.isOpened) {
            kaifuchongbang.onSellLimitDataChange();
        }
    }

    updateEveryDayTargetPanel() {
        //更新每日状态，显示红点
        //  this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_7GOAL_DAILY, TipMarkUtil.dailyGoal(this.selectDay));
        let everyDayTarget = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7GOAL_DAILY) as EveryDayTargetView;
        if (everyDayTarget.isOpened) {
            everyDayTarget.updateEveryDayTargetPanel();
        }
        this.updateSevenDayTargetTipMark();
    }


    private updateSevenDayTargetTipMark() {
        //每日目标红点
        let show = false;
        for (let i = 0; i < 7; i++) {
            show = TipMarkUtil.dailyGoal(i + 1);
            if (show) break;
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_7GOAL_DAILY, show);
    }


    ////////////////////////集字有礼////////////////////////////////////////

    /**集字好礼小红点*/
    private checkJzshlTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_KFHD_JZSHL, TipMarkUtil.jiZiSongHaoLi());
    }


    ////////////////////////首冲团购//////////////////////////////////////

    onShouChongTuanGouChanged() {
        this.checkSctgTipMark();
        let groupBuyPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_KFHD_SCTG) as KfhdShouChongTuanGouPanel;
        if (groupBuyPanel != null && groupBuyPanel.isOpened) {
            groupBuyPanel.onShouChongTuanGouChanged();
        }
    }


    /**首冲团购小红点*/
    private checkSctgTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_KFHD_SCTG, TipMarkUtil.shouChongTuanGou());
    }


    //////////////////////////////红包有礼///////////////////////////////////////////

    onHongBaoYouLiChanged() {
        this.checkHongBaoYouLiTipMark();
        let hongBaoPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_HONGBAOYOULI) as HongBaoYouLiView;
        if (hongBaoPanel != null && hongBaoPanel.isOpened) {
            hongBaoPanel.updateView();
        }
    }

    /**红包有礼小红点*/
    private checkHongBaoYouLiTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_HONGBAOYOULI, G.DataMgr.kaifuActData.hasHongBaoYouLiToGet());
    }


    //////////////////////////////七日累冲/////////////////////////////////////////////





    //////////////////////////////////连续充值/////////////////////////////////////////

    /////////////////////////7日累冲 每日累计//////////////////////////

    onUpdateSevenDayLCPanel() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7DAYLEICHONG) as SevenLeiChongView;
        if (view != null && view.isOpened) {
            view.updateView();
        }
        this.update7DayTipMark();
    }

    /**更新BOSS召唤*/

    updateBossZhaoHuanPanrl() {
        let BossZhaoHuanPanrl = this.getTabFormByID(KeyWord.OTHER_FUNCTION_BOSS_SUMMON) as BossZhaoHuanView;
        if (BossZhaoHuanPanrl != null && BossZhaoHuanPanrl.isOpened) {
            BossZhaoHuanPanrl.updateView();
        }
        this.updateBossZHTipMark();
    }

    ShowZhaoHuanReward(bossType: number) {
        let BossZhaoHuanPanrl = this.getTabFormByID(KeyWord.OTHER_FUNCTION_BOSS_SUMMON) as BossZhaoHuanView;
        if (BossZhaoHuanPanrl != null && BossZhaoHuanPanrl.isOpened) {
            BossZhaoHuanPanrl.showReward(bossType);
        }
    }

    updateBossZHTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_BOSS_SUMMON, TipMarkUtil.BossZhaoHuan());
    }

    private update7DayTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_7DAYLEICHONG, TipMarkUtil.sevenDayLeiChongReward(true));
    }
    onUpdateMoney() {
        if (this.currencyTip != null) {
            this.currencyTip.updateMoney();
        }
    }


    /////////////////////////////////////////////////////////


    ///////////////////////连充返利//////////////////

    onUpdateLCFLPanel() {
        let currentForm = this.getCurrentTab();
        if (currentForm != null && currentForm.isOpened) {
            let view = currentForm as LianChongBasePanel;
            if (view.updateView) {
                view.updateView();
            }
        }
        this.updateLCFLTipMark();
    }

    private updateLCFLTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_KFLIANCHONGCHU, G.DataMgr.kaifuActData.canShowTipMarkByType(this.week, 1));
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_KFLIANCHONGZHONG, G.DataMgr.kaifuActData.canShowTipMarkByType(this.week, 2));
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_KFLIANCHONGGAO, G.DataMgr.kaifuActData.canShowTipMarkByType(this.week, 3));
    }





    ////////////////////////////////进阶日（进阶返利/特惠礼包）////////////////////////////////

    _updatePanel() {
        this.checkJinJieFanLiTipMark();
        let jjrRankPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_JJR_RANK) as KaiFuJJRRankPanel;
        if (jjrRankPanel != null && jjrRankPanel.isOpened) {
            jjrRankPanel.updateRewardList();
        }
    }

    private checkJinJieFanLiTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_JJR_RANK, G.DataMgr.kfhdData.canGetJinJieRiReward());
    }

    updataViewReward() {
        this.checkJinJieFanLiTipMark();
        let jjrRankPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_JJR_RANK) as KaiFuJJRRankPanel;
        if (jjrRankPanel != null && jjrRankPanel.isOpened) {
            jjrRankPanel.updataViewReward();
        }
    }

    onJinJieRankChange() {
        let jjrRankPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_JJR_RANK) as KaiFuJJRRankPanel;
        if (jjrRankPanel != null && jjrRankPanel.isOpened) {
            jjrRankPanel.onJinJieRankChange();
        }
    }
    ////////////////////////////////调查问卷////////////////////////////////
    updateWenJuanPanel() {
        this.updateWenjuanTipMark();
        G.TipMgr.addMainFloatTip('奖励已发放到邮箱！');
        for (let i = 0; i < this.tabIds.length; i++) {
            if (this.tabIds[i] == KeyWord.ACT_FUNCTION_WENJUAN) {
                let showWenjuan = G.DataMgr.wenjuanData.isFirstJoin(1 << Macros.SURVEY_GIFT) && G.DataMgr.wenjuanData.isShow;
                this.tabGroup.GetToggle(i).gameObject.SetActive(showWenjuan);
                this.tabGroup.Selected = 0;
                return;
            }
        }

    }
    private updateWenjuanTipMark() {
        let showWenjuanTipMark = G.DataMgr.wenjuanData.isFirstJoin(1 << Macros.SURVEY_GIFT) && G.DataMgr.wenjuanData.isShow;
        this.setTabTipMarkById(KeyWord.ACT_FUNCTION_WENJUAN, showWenjuanTipMark);
    }
}






