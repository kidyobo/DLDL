import { LeiJiChongZhiView } from 'System/activity/fanLiDaTing/LeiJiChongZhiView';
import { XiaoFeiFanliPanel } from 'System/activity/fanLiDaTing/XiaoFeiFanliPanel';
import { KfhdTeHuiLiBaoPanel } from 'System/activity/kfhd/KfhdTeHuiLiBaoPanel';
import { LeiChongFanLiView } from 'System/activity/kfhd/LeiChongFanLiView';
import { KeyWord } from 'System/constants/KeyWord';
//import { JjrRewardsPanel } from 'System/jinjieri/JjrRewardsPanel'
//import { JinJieRankPanel } from 'System/jinjieri/JinJieRankPanel'
import { KfhdData } from 'System/data/KfhdData';
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from 'System/global';
import { FanLiDaTingJJRRankPanel } from 'System/jinjieri/FanLiDaTingJJRRankPanel';
import { JjrMrxgPanel } from 'System/jinjieri/JjrMrxgPanel';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';
import { UILayer } from "System/uilib/CommonForm";
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { TabForm } from "System/uilib/TabForm";
import { VipDailyRewardPanel } from 'System/vip/VipDailyRewardPanel';
import { KfDanBiChongZhiPanel } from '../kfhd/KfDanBiChongZhiPanel';
import { KfXunHuanChongZhiPanel } from '../kfhd/KfXunHuanChongZhiPanel';
import { MeiRiLiBaoView } from '../YunYingHuoDong/MeiRiLiBaoView';

//该面板为其他子面板的父面板
export class FanLiDaTingView extends TabForm {
    private currencyTip: CurrencyTip;

    private labelTabSelected: UnityEngine.UI.Text;
    private labelTabNormal: UnityEngine.UI.Text;

    private tabType: number = 0;

    private openTabId: number = 0;
    private subValue: number = 0;

    constructor() {
        super(KeyWord.ACT_FUNC_FLDT, LeiJiChongZhiView, LeiChongFanLiView, XiaoFeiFanliPanel, FanLiDaTingJJRRankPanel, KfhdTeHuiLiBaoPanel, /**JjrMrxgPanel,*/
            KfDanBiChongZhiPanel, KfXunHuanChongZhiPanel, MeiRiLiBaoView)//, VipDailyRewardPanel);//,FanLiDaTingJJRRewardPanel
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.FanLiDaTingView;
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.elems.getElement("btnReturn"), this.onBtnReturn);
        this.addClickListener(this.elems.getElement("mask"), this.onBtnReturn);
        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("CurrencyTip"));
    }

    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        let cnt = this.tabIds.length;
        let funcLimitData = G.DataMgr.funcLimitData;
        let openSvrDay = G.SyncTime.getDateAfterStartServer();
        for (let i = 0; i < cnt; i++) {
            let funcId = this.getTabFormByIndex(i).Id;
            let isShow = funcLimitData.isFuncEntranceVisible(funcId);
            if (isShow) {
                if (KeyWord.OTHER_FUNCTION_DAILY_LEICHONGFANLI == funcId) {
                    let data = G.DataMgr.leiJiRechargeData.ljczInfo;
                    //合服不开
                    if (data != null && data.m_iType == 0) {
                        isShow = false;
                    }
                }
            }

            this.tabGroup.GetToggle(i).gameObject.SetActive(isShow);
        }
        this.switchTabFormById(this.openTabId, this.subValue);
        //刷新小红点
        this.updateLeiJiChongZhiTipMark();
        this.checkThlbTipMark();
        this.checkJinJieFanLiTipMark();
        //this.checkDailyRewardTipMark();
        //消费返利
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_XIAOFEIFANLI, G.DataMgr.kaifuActData.isShowXFFLTipMark());
        this.updateXunHuanCzTipMark();
        this.updateDanBiCzTipMark();
        //更新魂币
        this.onUpdateMoney();
        this.updateMeirilibaoPanel();
    }


    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
    }


    open(openTabId: number = 0, subValue: number = 0) {
        this.openTabId = openTabId;
        this.subValue = subValue;
        super.open();
    }


    private onBtnReturn(): void {
        this.close();
    }

    /**直购礼包 */
    updateMeirilibaoPanel() {
        this.setTabTipMarkById(KeyWord.ACT_FUNCTION_ZHIGOULIBAO, TipMarkUtil.MeiRiLiBaoCanGet());
        let meiripanel = this.getTabFormByID(KeyWord.ACT_FUNCTION_ZHIGOULIBAO) as MeiRiLiBaoView;
        if (meiripanel != null && meiripanel.isOpened) {
            meiripanel.updateView();
        }
    }



    //////////////////////////////累计充值//////////////////////////////////////

    onLeiJiChongZhiChange() {
        this.updateLeiJiChongZhiTipMark();
        let leiJiChongZhiPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_DAILY_LEICHONGFANLI) as LeiJiChongZhiView;
        if (leiJiChongZhiPanel != null && leiJiChongZhiPanel.isOpened) {
            leiJiChongZhiPanel.updateView();
        } else {
            let leiChongFanLiView = this.getTabFormByID(KeyWord.OTHER_FUNCTION_LEICHONGFANLI) as LeiChongFanLiView;
            if (leiChongFanLiView != null && leiChongFanLiView.isOpened) {
                leiChongFanLiView.onKfhdRechargeChanged();
            }
        }
    }


    /**累计充值小红点*/
    private updateLeiJiChongZhiTipMark() {

        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_LEICHONGFANLI, TipMarkUtil.leiChongFanLi());
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_DAILY_LEICHONGFANLI, TipMarkUtil.dailyLeiJiChongZhi());

    }



    //////////////////////////////////特惠礼包////////////////////////////////////

    onSellLimitDataChange() {
        this.checkThlbTipMark();
        let thlbPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_KFHD_THLB) as KfhdTeHuiLiBaoPanel;
        if (thlbPanel.isOpened) {
            thlbPanel.onSellLimitDataChange();
        } else {
            let mrxgPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_JJR_MRXG) as JjrMrxgPanel;
            if (mrxgPanel.isOpened) {
                mrxgPanel.onSellLimitDataChange();
            }
        }
    }

    /**特惠礼包小红点*/
    private checkThlbTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_KFHD_THLB, G.DataMgr.kfhdData.teHuiLiBaoTipMark());
    }


    ////////////////////////////////进阶日（进阶返利/特惠礼包）////////////////////////////////

    _updatePanel() {
        this.checkJinJieFanLiTipMark();
        let jjrRankPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_JJR_RANK_AFTER7DAY) as FanLiDaTingJJRRankPanel;
        if (jjrRankPanel != null && jjrRankPanel.isOpened) {
            jjrRankPanel.updateRewardList();
        }
    }

    private checkJinJieFanLiTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_JJR_RANK_AFTER7DAY, G.DataMgr.kfhdData.canGetJinJieRiReward());
    }

    updataViewReward() {
        this.checkJinJieFanLiTipMark();
        let jjrRankPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_JJR_RANK_AFTER7DAY) as FanLiDaTingJJRRankPanel;
        if (jjrRankPanel != null && jjrRankPanel.isOpened) {
            jjrRankPanel.updataViewReward();
        }
    }

    onJinJieRankChange() {
        let jjrRankPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_JJR_RANK_AFTER7DAY) as FanLiDaTingJJRRankPanel;
        if (jjrRankPanel != null && jjrRankPanel.isOpened) {
            jjrRankPanel.onJinJieRankChange();
        }
    }

    /**每日限购*/
    onJinJieRiSellLimitDataChange() {
        let mrxgPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_JJR_MRXG) as JjrMrxgPanel;
        if (mrxgPanel != null && mrxgPanel.isOpened) {
            mrxgPanel.onSellLimitDataChange();
        }
    }

    /**刷新进阶日groupName*/
    private updataTab() {
        let today = 0;
        let serverMergeTime = G.SyncTime.getDateAfterMergeServer();
        if (serverMergeTime > 0) {
            today = serverMergeTime;
        } else {
            today = G.SyncTime.getDateAfterStartServer();
        }

        if (this.kfhdData.JJRPanelInfo) {
            //活动页签
            let activityDate: number = Math.floor(G.DataMgr.constData.getValueById(KeyWord.PARAMETER_JJR_OPEN_DAY));
            if (today >= activityDate) {
                this.tabType = this.kfhdData.JJRPanelInfo.m_ucType;
            }
        }
        let label = this.getTabStringByJjrType(this.kfhdData.JJRPanelInfo.m_ucType);
        this.labelTabNormal.text = label;
        this.labelTabSelected.text = label;
    }


    private getTabStringByJjrType(type: number): string {
        switch (type) {
            case KeyWord.STAGEDAY_STRENG:
                return "强化进阶";
            case KeyWord.STAGEDAY_SQ:
                return "神器进阶";
            case KeyWord.STAGEDAY_LINGYU:
                return "圣印进阶";
            case KeyWord.STAGEDAY_HORSE:
                return "坐骑进阶";
            case KeyWord.STAGEDAY_BEAUTY:
                return "伙伴成长";
            case KeyWord.STAGEDAY_FAQI:
                return "宝物进阶";
            case KeyWord.STAGEDAY_SHENJI:
                return "真迹进阶";
            default:
                return "";
        }
    }

    get kfhdData(): KfhdData {
        return G.DataMgr.kfhdData;
    }

    onUpdateMoney() {
        if (this.currencyTip != null) {
            this.currencyTip.updateMoney();
        }
    }

    ///////////////////////////////每日登陆礼包//////////////////////////////////

    onVipDailyRewardChange() {
        //this.checkDailyRewardTipMark();
        let dailyRewardPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_VIPDAILYREWARD) as VipDailyRewardPanel;
        if (dailyRewardPanel != null && dailyRewardPanel.isOpened) {
            dailyRewardPanel.updateView();
        }
    }

    //private checkDailyRewardTipMark() {
    //    this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_VIPDAILYREWARD, G.DataMgr.vipData.getCanGetDailyGift());
    //}

    //////////////////////////////////////消费返利///////////////////////////////////////
    onUpdateXFFLPanel() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_XIAOFEIFANLI, G.DataMgr.kaifuActData.isShowXFFLTipMark());
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_XIAOFEIFANLI) as XiaoFeiFanliPanel;
        if (view != null && view.isOpened) {
            view.updateView();
        }

    }
    //原开服活动 当开服活动关闭出现在返利大厅中
    /////////////////////单笔充值///////////////////
    updateDanBiChongZhiPanel() {
        let danbiCzPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_DANBICHONGZHI) as KfDanBiChongZhiPanel;
        if (danbiCzPanel != null && danbiCzPanel.isOpened) {
            danbiCzPanel.updateView();
        }
        this.updateDanBiCzTipMark();
    }

    private updateDanBiCzTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_DANBICHONGZHI, TipMarkUtil.DanBiChongZhiCanGet());
    }

    ///////////////////循环充值////////////////////
    updateXunHuanChongZhiPanel() {
        let xunHuanCzPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_XUNHUANCHONGZHI) as KfXunHuanChongZhiPanel;
        if (xunHuanCzPanel != null && xunHuanCzPanel.isOpened) {
            xunHuanCzPanel.updateView();
        }
        this.updateXunHuanCzTipMark();
    }

    private updateXunHuanCzTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_XUNHUANCHONGZHI, TipMarkUtil.XunHuanChongZhiCanGet());
    }

}
export default FanLiDaTingView;