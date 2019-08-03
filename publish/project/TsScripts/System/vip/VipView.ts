import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { PayView } from "System/pay/PayView";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';
import { UILayer } from "System/uilib/CommonForm";
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { TabForm } from "System/uilib/TabForm";
import { PrivilegeMainPanel } from "System/vip/PrivilegeMainPanel";
import { VipRewardPanel } from "System/vip/VipRewardPanel";
import TouziView from '../touzi/TouziView';
import { ActivityData } from '../data/ActivityData';

export enum VipTab {
    ZunXiang = 1,
    Reward = 2,
    TeQuan = 3,
    ChongZhi = 4
}

export class VipView extends TabForm {
    private currencyTip: CurrencyTip;

    private openTabId: number = 0;
    private openVipLv: number = 0;
    private otherKeyword: number = 0;
    private subKeyword: number = 0;

    constructor() {
        super(KeyWord.ACT_FUNC_FLDT, PayView, PrivilegeMainPanel, VipRewardPanel, TouziView);
    }

    layer(): UILayer {
        return UILayer.Pay;
    }

    protected resPath(): string {
        return UIPathData.VipView;
    }

    /**指定打开vip等级*/
    open(openTabId: number = 2, openVipLv: number = -1, otherKeyword: number = 0, subKeyword: number = 0) {
        this.openTabId = openTabId;
        this.openVipLv = openVipLv;
        this.otherKeyword = otherKeyword;
        this.subKeyword = subKeyword;
        super.open();
    }

    protected onOpen() {
        this.onUpdateMoney();
        //充值 尊享 福利 三个面板没有限制，一直开启的
        for (let i = 0; i < this.getTabCount(); i++) {
            let id = this.tabIds[i];
            if (id == KeyWord.ACT_FUNCTION_TOUZILICAI) {
                //投资计划
                // this.tabGroup.GetToggle(i).gameObject.SetActive(G.DataMgr.funcLimitData.isFuncEntranceVisible(id));
                let tzjhInfo = G.DataMgr.activityData.sevenDayFundData;
                let today = G.SyncTime.getDateAfterStartServer();
                let isshow = false;
                if (tzjhInfo.m_ucNumber == 0) {
                    isshow = today <= Macros.MAX_JUHSA_ACT_DAY;
                }
                else {
                    if (G.DataMgr.activityData.sevenDayHaveTipMarkCanShow() || today <= Macros.MAX_JUHSA_ACT_DAY) {
                        isshow = true;
                    }
                    else {
                        if (today > Macros.MAX_JUHSA_ACT_DAY) {
                            for (let i = 1; i <= ActivityData.sevenDayTypeCount; i++) {
                                let hasTZData = G.DataMgr.activityData.getSevenDayTZDataByType(i);
                                if (hasTZData != null && hasTZData.m_uiGetFlag != 127) {
                                    isshow = true;
                                }
                            }
                        }
                    }
                }
                this.tabGroup.GetToggle(i).gameObject.SetActive(isshow);
            }
        }

        if (this.openTabId == VipTab.ChongZhi) {
            //充值面板某些时候需要回弹面板，要传这些参数
            this.switchTabFormById(this.openTabId, this.otherKeyword, this.subKeyword);
        } else {
            this.switchTabFormById(this.openTabId, this.openVipLv);
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_MONTH_LIST, 0));
        G.GuideMgr.processGuideNext(EnumGuide.CommonOpenView, EnumGuide.CommonOpenView_OpenView);//上线弹窗

        this.updateTipMark();
    }


    protected onClose() {
        G.GuideMgr.processGuideNext(EnumGuide.CommonOpenView, EnumGuide.GuideCommon_None);
    }

    protected initElements() {
        super.initElements();

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("currencyTip"));
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.elems.getElement("btnClose"), this.close);
    }

    private updateTipMark() {
        let len: number = this.getTabCount();
        for (let i = 0; i < len; i++) {
            let form = this.getTabFormByIndex(i);
            let panelId: number = form.Id;
            let isShow: boolean = false;
            if (panelId == VipTab.ChongZhi) {
                //充值
                isShow = false;
            }
            else if (panelId == VipTab.ZunXiang) {
                //尊享
                isShow = TipMarkUtil.vipReward();
            }
            else if (panelId == VipTab.Reward) {
                //vip奖励
                isShow = G.DataMgr.vipData.getVipDaChengCanGetCount() > 0;
            }
            else if (panelId == KeyWord.ACT_FUNCTION_TOUZILICAI) {
                //投资计划
                isShow = this.getTouziPanelTipMark();
            }
            // 显示红点
            this.setTabTipMark(i, isShow);
        }
    }

    onUpdateMoney() {
        if (this.currencyTip != null) {
            this.currencyTip.updateMoney();
        }
    }

    /**
     * vip充值面板
     */
    updatePayPanel() {
        let payView = this.getTabFormByID(VipTab.ChongZhi) as PayView;
        if (payView != null && payView.isOpened) {
            payView.updatePanel();
        }
    }

    /**
     * vip尊享面板
     */
    updateZunxiangPanel() {
        let vipZunXiangPanel = this.getTabFormByID(VipTab.ZunXiang) as PrivilegeMainPanel;
        if (vipZunXiangPanel != null && vipZunXiangPanel.isOpened) {
            vipZunXiangPanel.updateByBuyResp();
        }
        this.setTabTipMarkById(VipTab.ZunXiang, TipMarkUtil.vipReward());
    }

    /**
     * vip奖励面板 
     * vip等级变化，奖励状态变化
     */
    updateRewardPanel() {
        let vipRewardPanel = this.getTabFormByID(VipTab.Reward) as VipRewardPanel;
        if (vipRewardPanel != null && vipRewardPanel.isOpened) {
            vipRewardPanel.refreshPanel();
        }
        this.setTabTipMarkById(VipTab.Reward, G.DataMgr.vipData.getVipDaChengCanGetCount() > 0);
    }

    updateTouziPanel() {
        let touziPanel = this.getTabFormByID(KeyWord.ACT_FUNCTION_TOUZILICAI) as TouziView;
        if (touziPanel != null && touziPanel.isOpened) {
            touziPanel.updateTzPanel();
        }
        this.setTabTipMarkById(KeyWord.ACT_FUNCTION_TOUZILICAI, this.getTouziPanelTipMark());
    }

    /**
     * 投资计划页签红点
     */
    private getTouziPanelTipMark(): boolean {
        let tzjhInfo = G.DataMgr.activityData.sevenDayFundData;
        if (tzjhInfo.m_ucNumber == 0) {
            return false;
        } else {
            return G.DataMgr.activityData.sevenDayHaveTipMarkCanShow();
        }
    }

    // updataPayData() {
    //     let payView = this.getTabFormByID(VipTab.ChongZhi) as PayView;
    //     if (payView != null && payView.isOpened) {
    //         payView.updataPayData();
    //     }
    // }
















    ///////////////////////通用面板///////////////////////////////

    private onClickBtnReacharge(): void {
        // this.close();
        // G.Uimgr.createForm<PayView>(PayView).open();
        this.switchTabFormById(VipTab.ChongZhi);
    }

    /**
     * vip奖励面板
     */
    private onVipRewardPanelChange() {
        let vipRewardPanel = this.getTabFormByID(VipTab.Reward) as VipRewardPanel;
        if (vipRewardPanel != null && vipRewardPanel.isOpened) {
            vipRewardPanel.refreshPanel();
        }
        this.setTabTipMarkById(VipTab.Reward, G.DataMgr.vipData.getVipDaChengCanGetCount() > 0);
    }



    /////////////////////////////充值面板//////////////////////////////////////////




}