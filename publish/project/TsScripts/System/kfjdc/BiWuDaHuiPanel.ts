import { Global as G } from 'System/global'
import { UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { TabForm } from 'System/uilib/TabForm'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { BwdhPreliminaryPage } from 'System/kfjdc/BwdhPreliminaryPage'
import { BwdhBasePage } from 'System/kfjdc/view/BwdhBasePage'
import { BwdhLastPage } from 'System/kfjdc/BwdhLastPage'
import { BwdhCurrentListPage } from 'System/kfjdc/BwdhCurrentListPage'
import { BwdhCurrentFinalPage } from 'System/kfjdc/BwdhCurrentFinalPage'
import { BwdhMapPage } from 'System/kfjdc/BwdhMapPage'
import { BwdhChampionPage } from 'System/kfjdc/BwdhChampionPage'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { BwdhChampionBetView } from 'System/kfjdc/view/BwdhChampionBetView'

export enum EnumBwdhPage {
    Preliminary = 1,
    Last,
    Current_List,
    Current_Final,
    Map,
    Champion
}

export class BiWuDaHuiPanel extends TabForm {
    private btnSupport: UnityEngine.GameObject;
    private supportTipMark: UnityEngine.GameObject;
    private btnRule: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_BIWUDAHUI, BwdhPreliminaryPage, BwdhLastPage, BwdhCurrentListPage, BwdhCurrentFinalPage, BwdhMapPage, BwdhChampionPage);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.BiWuDaHuiView;
    }

    protected initElements() {
        super.initElements();
        this.btnSupport = this.elems.getElement('btnSupport');
        this.supportTipMark = this.elems.getElement('supportTipMark');
        this.supportTipMark.SetActive(false);
        this.btnRule = this.elems.getElement('btnRule');
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnSupport, this.onClickBtnSupport);
        this.addClickListener(this.btnRule, this.onClickBtnRule);
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleNotifyRequest(Macros.CROSS_SINGLE_FINAL_OPEN));
    }

    protected onClose() {
    }

    onActDataChange(id: number) {
        this.onBiWuDaHuiChange(0);

        let currentTab = this.getCurrentTab() as BwdhBasePage;
        if (null != currentTab && currentTab.isOpened) {
            currentTab.onActDataChange(id);
        }
    }

    onBiWuDaHuiChange(opType: number) {
        let kfjdcData = G.DataMgr.kfjdcData;
        let finalData = kfjdcData.m_finalData;
        if (!finalData) {
            return;
        }
        let gameData = finalData.m_stGameInfo;
        let progress = gameData.m_iProgress;

        let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        let showLast = false, showCurrentFinal = false;
        let week = G.SyncTime.serverDate.getDay();
        if (week >= 1 && week <= 5) {
            // 显示上一赛季
            showLast = gameData.m_iGameCount > 0;
            showCurrentFinal = true;
        } else if (week == 6) {
            // 周六
            showLast = gameData.m_iProgress > KeyWord.KFJDC_FINAL_PROGRESS_32TO16;
            showCurrentFinal = false;
        } else {
            // 周日
            showLast = true;
            showCurrentFinal = gameData.m_iProgress > KeyWord.KFJDC_FINAL_PROGRESS_4TO2 || (gameData.m_iProgress == 0 && now > gameData.m_uiEndTime);
        }

        this.tabGroup.GetToggle(EnumBwdhPage.Last - 1).gameObject.SetActive(showLast);
        this.tabGroup.GetToggle(EnumBwdhPage.Current_List - 1).gameObject.SetActive(!showCurrentFinal);
        this.tabGroup.GetToggle(EnumBwdhPage.Current_Final - 1).gameObject.SetActive(showCurrentFinal);

        let selected = this.tabGroup.Selected;
        if (selected == EnumBwdhPage.Last - 1) {
            if (!showLast) {
                this.switchTabFormById(showCurrentFinal ? EnumBwdhPage.Current_Final : EnumBwdhPage.Current_List);
            }
        } if (selected == EnumBwdhPage.Current_List - 1) {
            if (!showCurrentFinal) {
                this.switchTabFormById(EnumBwdhPage.Current_Final);
            }
        } else if (selected == EnumBwdhPage.Current_Final - 1) {
            if (showCurrentFinal) {
                this.switchTabFormById(EnumBwdhPage.Current_List);
            }
        } else if (selected < 0) {
            let week = G.SyncTime.serverDate.getDay();
            if (week >= 1 && week <= 5) {
                // 周一至周五默认显示初赛
                this.switchTabFormById(EnumBwdhPage.Preliminary);
            } else {
                // 周六周日显示决赛
                this.switchTabFormById(showCurrentFinal ? EnumBwdhPage.Current_Final : EnumBwdhPage.Current_List);
            }
        }

        let currentTab = this.getCurrentTab() as BwdhBasePage;
        if (null != currentTab && currentTab.isOpened) {
            currentTab.onBiWuDaHuiChange(opType);
        }

        this.setTabTipMarkById(EnumBwdhPage.Preliminary, kfjdcData.canGetRankReward() || kfjdcData.canDoPri());
        this.setTabTipMarkById(EnumBwdhPage.Last, kfjdcData.canGetBetReward());

        let finalIng = kfjdcData.canDoFnl();
        if (showCurrentFinal) {
            this.setTabTipMarkById(EnumBwdhPage.Current_Final, finalIng);
        } else {
            this.setTabTipMarkById(EnumBwdhPage.Current_List, finalIng);
        }

        // 冠军押注红点
        this.supportTipMark.SetActive(kfjdcData.canGetChampionSupportReward());
    }

    private onClickBtnSupport() {
        G.Uimgr.createForm<BwdhChampionBetView>(BwdhChampionBetView).open();
    }

    private onClickBtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(438), '比武大会');
    }
}