import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { UILayer } from 'System/uilib/CommonForm'
import { TabForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { DailySignPanel } from 'System/activity/fldt/dailySign/DailySignPanel'
import { OnlineGiftPanel } from 'System/activity/fldt/OnlineGiftPanel'
import { LvUpGiftPanel } from 'System/activity/fldt/LvUpGiftPanel'
import { SuperVipView } from 'System/activity/fldt/SuperVipView'
import { BossZhaoHuanView } from 'System/activity/fldt/BossZhaoHuanView'
import { ResourceBackPanel } from 'System/activity/fldt/ResourceBackPanel'
import { ActivateCodePanel } from 'System/activity/fldt/ActivateCodePanel'
import { EnumGuide } from 'System/constants/GameEnum'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { CurrencyTip } from 'System/uilib/CurrencyTip'
import { MainView } from "System/main/view/MainView";

export class FuLiDaTingView extends TabForm implements IGuideExecutor {

    btnReturn: UnityEngine.GameObject;
    private currencyTip: CurrencyTip;
    private openTab = 0;

    constructor() {
        super(KeyWord.ACT_FUNCTION_FLDT, DailySignPanel, OnlineGiftPanel, SuperVipView, LvUpGiftPanel, ResourceBackPanel, ActivateCodePanel);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.FuLiDaTingView;
    }

    open(openTab: number = 0) {
        this.openTab = openTab;
        super.open();
    }

    ///////////////////////////////////////// 面板打开 /////////////////////////////////////////
    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        super.onOpen();
        let openIndex = -1;
        let firstOpenedIndex = -1;
        let openSvrDay = G.SyncTime.getDateAfterStartServer();
        // 判断页签显示与否
        let cnt = this.tabIds.length;
        for (let i = 0; i < cnt; i++) {
            let isShow = G.DataMgr.funcLimitData.isFuncAvailable(this.tabIds[i]);
            let funcId = this.tabIds[i];
            if (isShow) {
                if (KeyWord.OTHER_FUNCTION_JHMDH == funcId) {
                    //ios提审服还要隐藏激活码功能
                    isShow = !G.IsIosTiShenEnv;
                }
            }
            if (isShow) {
                this.tabGroup.GetToggle(i).gameObject.SetActive(true);
                if (this.tabIds[i] == this.openTab) {
                    openIndex = i;
                } else if (firstOpenedIndex < 0) {
                    firstOpenedIndex = i;
                }
            } else {
                this.tabGroup.GetToggle(i).gameObject.SetActive(false);
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
        // 更新角标
        this.updateSignJb();
        this.updateOnlineJb();
        this.updateLevelUpJb();
        this.updateResouceBackJb();
        this.updateActiveCodePanelJb();
        //更新魂币
        this.onUpdateMoney();
        // 拉取活动数据
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFSCTGGetInfoRequest());
    }

    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
        super.onClose();
        G.GuideMgr.processGuideNext(EnumGuide.LvUpGift, EnumGuide.LvUpGift_ClickClose);
        G.GuideMgr.processGuideNext(EnumGuide.DailySign, EnumGuide.GuideCommon_None);
    }

    protected initElements() {
        super.initElements();
        this.btnReturn = this.elems.getElement('btnReturn');
        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("CurrencyTip"));
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnReturn, this.close);
        this.addClickListener(this.elems.getElement('mask'), this.close);
    }


    /**更新每日签到角标*/
    private updateSignJb(): void {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_MRQD, TipMarkUtil.dailySign());
    }

    /**更新在线礼包角标*/
    private updateOnlineJb(): void {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_ZXJL, TipMarkUtil.onlineGift());
    }

    /**更新升级礼包角标*/
    private updateLevelUpJb(): void {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_SJLB, TipMarkUtil.levelGift());
    }


    /**更新资源找回角标*/
    private updateResouceBackJb(): void {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_ZYZH, TipMarkUtil.ziYuanZhaoHui());
    }

    /**更新激活码小红点*/
    private updateActiveCodePanelJb() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_JHMDH, TipMarkUtil.jiHuoMa());
    }

    /**
	* 更新每日签到。
	* @param response
	* @param drawn
	*
	*/
    updateSignByResp(response: Protocol.DoActivity_Response): void {
        let signPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_MRQD) as DailySignPanel;
        if (signPanel != null && signPanel.isOpened) {
            signPanel.updateByResp(response);
        }
        this.updateSignJb();
    }

    /**更新在线礼包*/
    updateOnlineGift(): void {
        let onlineGiftPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_ZXJL) as OnlineGiftPanel;
        if (onlineGiftPanel != null && onlineGiftPanel.isOpened) {
            onlineGiftPanel.updateView();
        }
        // 更新在线礼包角标
        this.updateOnlineJb();
    }

    /**更新升级礼包*/
    updateLevelGiftBagByRes(): void {
        let lvUpGiftPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_SJLB) as LvUpGiftPanel;
        if (lvUpGiftPanel != null && lvUpGiftPanel.isOpened) {
            lvUpGiftPanel.updateView();
        }
        // 更新角标
        this.updateLevelUpJb();
    }

    /**更新资源找回*/
    updateResouceBackByResp() {
        let resourceBackPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_ZYZH) as ResourceBackPanel;
        if (resourceBackPanel != null && resourceBackPanel.isOpened) {
            resourceBackPanel.updateView();
        }
        this.updateResouceBackJb();
    }

    /**更新激活码*/
    updateActiveCodePanel() {
        let activeCodePanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_JHMDH) as ActivateCodePanel;
        if (activeCodePanel != null && activeCodePanel.isOpened) {
            activeCodePanel.updateBtnStage();
        }
        this.updateActiveCodePanelJb();
    }

    onUpdateMoney() {
        if (this.currencyTip != null) {
            this.currencyTip.updateMoney();
        }
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.LvUpGift_ClickClose == step) {
            this.close();
            return true;
        }
        return false;
    }
}