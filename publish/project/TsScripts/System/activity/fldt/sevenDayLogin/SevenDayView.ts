import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { TabForm } from "System/uilib/TabForm"
import { UIPathData } from "System/data/UIPathData"
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ThingData } from 'System/data/thing/ThingData'
import { EnumGuide } from 'System/constants/GameEnum'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { SevenDayLoginPanel } from 'System/activity/fldt/sevenDayLogin/SevenDayLoginPanel'
import { EveryDayTargetView } from 'System/activity/fldt/sevenDayLogin/EveryDayTargetView'
import { BaoDianItemView } from 'System/activity/view/BaoDianItemView'
import { KaiFuChongBangView } from 'System/activity/kaiFuChongBang/KaiFuChongBangView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { UIUtils } from 'System/utils/UIUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { CurrencyTip } from 'System/uilib/CurrencyTip'
import { MainView } from "System/main/view/MainView"
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'

//该面板为其他子面板的父面板
export class SevenDayView extends TabForm {

    /**右上角的魂币显示*/
    private currencyTip: CurrencyTip;

    private readonly maxDayNum = 7;

    private RANK_TYPE_INDEX1: number[] = [];

    //   private readonly tabStrs: string[] = ['等级冲榜', '坐骑冲榜', '圣印冲榜', '神盾冲榜', '神器冲榜', '真迹冲榜', '星环冲榜'];
    //private dayTypeAtals: Game.UGUIAltas;
    //冲榜的按钮显示
    private txtTab: UnityEngine.UI.Text;
    private imgTab: UnityEngine.UI.Text;
    private btnReturn: UnityEngine.GameObject;
    private openTabId: number = 0;
    private selectDay: number = 0;
    private tabDays: UnityEngine.UI.ActiveToggleGroup;
    /**是否是首次打开*/
    private isFirstOpen: boolean = true;

    private tabDayObjs: UnityEngine.GameObject[] = [];

    private dayTipMarks: UnityEngine.GameObject[] = [];

    private tabStrMaps: { [type: number]: string } = {};
    private txtShengYuTime: UnityEngine.UI.Text;
    private m_restTime: number = 0;

    constructor() {
        super(KeyWord.ACT_FUNCTION_7GOAL, SevenDayLoginPanel, EveryDayTargetView, KaiFuChongBangView, BaoDianItemView);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.SevenDayView;
    }

    protected initElements(): void {
        super.initElements();
        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("CurrencyTip"));
        this.btnReturn = this.elems.getElement('btnReturn');
        this.tabDays = this.elems.getToggleGroup("tabDays");
        this.txtShengYuTime = this.elems.getText("txtShengYuTime");
        //this.dayTypeAtals = this.elems.getElement("dayTypeAtals").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.txtTab = this.elems.getText("txtTab");
        this.imgTab = this.elems.getText("imgTab");
        //天数tab
        for (let i = 0; i < this.maxDayNum; i++) {
            let obj = ElemFinder.findObject(this.tabDays.gameObject, i.toString());
            let dayTipMark = ElemFinder.findObject(this.tabDays.gameObject, i + "/tipMark");
            this.tabDayObjs.push(obj);
            this.dayTipMarks.push(dayTipMark);
        }
        this.RANK_TYPE_INDEX1 = G.DataMgr.kaifuActData.getKaifuChongbangType();

        //等级冲榜，伙伴进阶，玄天功比试，魂骨战力榜，坐骑冲榜，，装备强化榜
        this.tabStrMaps[KeyWord.RANK_TYPE_LEVEL] = "等级冲榜";
        this.tabStrMaps[KeyWord.RANK_TYPE_HONGYAN] = "伙伴进阶榜";
        this.tabStrMaps[KeyWord.RANK_TYPE_JIUXING] = "玄天功比试";
        this.tabStrMaps[KeyWord.RANK_TYPE_HUNGU] = "魂骨战力榜";
        this.tabStrMaps[KeyWord.RANK_TYPE_ZQ] = "坐骑冲榜";
        this.tabStrMaps[KeyWord.RANK_TYPE_FZ] = "紫极魔瞳榜";
        this.tabStrMaps[KeyWord.RANK_TYPE_STRENGTH] = "强化冲榜";
        this.tabStrMaps[KeyWord.RANK_TYPE_HUNHUAN] = "魂环冲榜";
        //this.tabStrMaps[KeyWord.RANK_TYPE_BATTLE] = "战力冲榜";

        this.tabStrMaps[KeyWord.RANK_TYPE_DIAMOND] = "魔石冲榜";

        //this.tabStrMaps[KeyWord.RANK_TYPE_YY] = "翅膀冲榜";
        //this.tabStrMaps[KeyWord.RANK_TYPE_WH] = "神器冲榜";
        //this.tabStrMaps[KeyWord.RANK_TYPE_FZ] = "圣印冲榜";
        //this.tabStrMaps[KeyWord.RANK_TYPE_LL] = "真迹冲榜";

        //this.tabStrMaps[KeyWord.RANK_TYPE_JUYUAN] = "神力冲榜";
        //this.tabStrMaps[KeyWord.RANK_TYPE_FAQI] = "神盾冲榜";
        //this.tabStrMaps[KeyWord.RANK_TYPE_MAGIC] = "星环冲榜";

    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.btnReturn, this.onBtnReturn);
        this.addClickListener(this.elems.getElement("mask"), this.onBtnReturn);
        this.addToggleGroupListener(this.tabDays, this.onTabDayClick);

    }

    open(openTabId: number = 0, selectDay: number = 1) {
        this.openTabId = openTabId;
        this.selectDay = selectDay;
        super.open();
    }

    onUpdateMoney() {
        if (this.currencyTip != null) {
            this.currencyTip.updateMoney();
        }
    }

    protected onOpen() {
        
        G.ViewCacher.mainView.setViewEnable(false);
        this.onUpdateMoney();
        let afterOpenDay = G.SyncTime.getDateAfterStartServer();
        this.selectDay = afterOpenDay;

        let funcLimitData = G.DataMgr.funcLimitData;
        let cnt = this.tabIds.length;
        for (let i = 0; i < cnt; i++) {
            let funcId = this.tabIds[i];
            let isShow = funcLimitData.isFuncEntranceVisible(funcId);
            this.tabGroup.GetToggle(i).gameObject.SetActive(isShow);
        }

        // 最大登陆时间
        if (this.selectDay > 7) {
            this.selectDay = 7;
        }

        let sendMsgCount = afterOpenDay > 7 ? 7 : afterOpenDay;
        for (let i = 1; i <= sendMsgCount; i++) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFQMCBGetInfoRequest(i, this.RANK_TYPE_INDEX1[i - 1]));
        }
        //tab页排行的名字根据天数不同
        this.txtTab.text = this.tabStrMaps[this.RANK_TYPE_INDEX1[this.selectDay - 1]];
        this.imgTab.text = this.tabStrMaps[this.RANK_TYPE_INDEX1[this.selectDay - 1]];
        //this.imgTab.sprite = this.dayTypeAtals.Get("tab" + this.selectDay);

        //打开界面默认选择天数
        this.tabDays.Selected = (this.selectDay - 1);
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(this.openTabId)) {
            this.switchTabFormById(this.openTabId, this.selectDay);
        }
        this.updateAllTipMarks();

        for (let i = 0; i < this.maxDayNum; i++) {
            UIUtils.setGrey(this.tabDayObjs[i], i < this.selectDay - 1);
        }

        //这里的7为开放天数
        this.m_restTime = G.SyncTime.getServerZeroLeftTime();
        let day = G.SyncTime.getDateAfterStartServer() % 7;
        day = day == 0 ? 7 : day;
        this.m_restTime += (7 - day) * 86400;
        
        this.addTimer("1", 1000, 0, this.onTimer);
        //拉每日目标的，要不红点没有
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFMRMBGetInfoRequest());

        G.GuideMgr.processGuideNext(EnumGuide.CommonOpenView, EnumGuide.CommonOpenView_OpenView);
    }

    private onTimer(): void {
        this.m_restTime--;
        if (this.m_restTime <= 0) {
            this.txtShengYuTime.text = '剩余时间：' + TextFieldUtil.getColorText('已结束', Color.RED);
            this.removeTimer("1");
        }
        else {
            this.txtShengYuTime.text =  TextFieldUtil.getColorText('剩余时间:' + DataFormatter.second2day(this.m_restTime), Color.GREEN);
        }
    }

    getSelectDay() {
        return this.selectDay;
    }

    updateAllTipMarks() {
        this.updatSevenDayTipMarks();
        this.updateDayTipMark(this.selectDay - 1);
    }

    /**
     * 天数页签红点
     */
    updatSevenDayTipMarks() {
        //开服前的天数置灰
        for (let i = 0; i < this.maxDayNum; i++) {
            let showStatus = this.updateSubTabTipMark(i);
            this.dayTipMarks[i].SetActive(showStatus);
            if (showStatus) {
                UIUtils.setGrey(this.dayTipMarks[i], false);
            }
        }
    }


    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
        G.GuideMgr.processGuideNext(EnumGuide.CommonOpenView, EnumGuide.GuideCommon_None);
    }

    /**
     * 关闭返回按钮
     */
    private onBtnReturn(): void {
        this.close();
    }

    private onTabDayClick(index: number) {
        this.tabDays.GetToggle(index).isOn = true;
        if (!this.isFirstOpen) {
            this.selectDay = index + 1;
        }
        this.isFirstOpen = false;

        if (this.openedIndex < 0 || this.selectDay < 0) {
            return;
        }
        let showToggel = this.selectDay <= G.SyncTime.getDateAfterStartServer();
        if (showToggel) {
            this.switchTabFormById(this.tabIds[this.openedIndex], this.selectDay);
        } else {
            //if (this.openedIndex == 2) {
            //    //没开的冲榜，不显示冲榜
            //    this.switchTabFormById(this.tabIds[0], this.selectDay);
            //} else {
                this.switchTabFormById(this.tabIds[this.openedIndex], this.selectDay);
            //}
        }

        //let funcId = this.tabIds[2];
        //let isShow = G.DataMgr.funcLimitData.isFuncEntranceVisible(funcId);
        //this.tabGroup.GetToggle(2).gameObject.SetActive(showToggel && isShow);
        // this.txtTab.text = this.tabStrs[this.selectDay - 1];
        this.txtTab.text = this.tabStrMaps[this.RANK_TYPE_INDEX1[this.selectDay - 1]];
        this.imgTab.text = this.tabStrMaps[this.RANK_TYPE_INDEX1[this.selectDay - 1]];
        //this.imgTab.sprite = this.dayTypeAtals.Get("tab" + this.selectDay);
        this.updateDayTipMark(index);
    }



    updateKaiFuChongBangView() {
        let kaifuchongbang = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7GOAL_KFCB) as KaiFuChongBangView;
        if (kaifuchongbang.isOpened) {
            kaifuchongbang.updateView();
        }
    }

    onGetKFCBRankResponse(response: Protocol.KFQMCBGetRoleInfo_Response) {
        let kaifuchongbang = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7GOAL_KFCB) as KaiFuChongBangView;
        if (kaifuchongbang.isOpened) {
            kaifuchongbang.onGetRoleResponse(response);
        }
    }


    onGetKFCBRewardResponse(response: Protocol.KFQMCBGetReward_Response) {
        let kaifuchongbang = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7GOAL_KFCB) as KaiFuChongBangView;
        if (kaifuchongbang.isOpened) {
            kaifuchongbang.onGetRewardResponse(response);
        }
        this.updateAllTipMarks();
    }

    onGetKFCBInfoResponse(response: Protocol.KFQMCBGetInfo_Response) {
        let kaifuchongbang = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7GOAL_KFCB) as KaiFuChongBangView;
        if (kaifuchongbang.isOpened) {
            kaifuchongbang.onGetInfoResponse(response);
        }
    }


    updateEveryDayTargetPanel() {
        //更新每日状态，显示红点
        //  this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_7GOAL_DAILY, TipMarkUtil.dailyGoal(this.selectDay));
        this.updateAllTipMarks();
        let everyDayTarget = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7GOAL_DAILY) as EveryDayTargetView;
        if (everyDayTarget.isOpened) {
            everyDayTarget.updateEveryDayTargetPanel();
        }
    }


    onSellLimitDataChange() {
        let kaifuchongbang = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7GOAL_KFCB) as KaiFuChongBangView;
        if (kaifuchongbang.isOpened) {
            kaifuchongbang.onSellLimitDataChange();
        }
    }

    onBaoDianResponse() {
        let baodianView = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7GOAL_FENGYUEBAODIAN) as BaoDianItemView;
        if (baodianView.isOpened) {
            baodianView.updateBaoDianView();
        }
    }


    //天数红点
    updateDayTipMark(dayIndex: number) {
        //每日签到
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_QTDLJ, G.DataMgr.activityData.kaifuSignData.canSignDay().indexOf(dayIndex) >= 0);

        //每日目标
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_7GOAL_DAILY, TipMarkUtil.dailyGoal(dayIndex + 1));

        //开服冲榜
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_7GOAL_KFCB, G.DataMgr.kaifuActData.canGetKaiFuChongBang(this.RANK_TYPE_INDEX1[dayIndex]));


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
        let isShow = G.DataMgr.funcLimitData.isFuncEntranceVisible(this.tabIds[2]);
        if (isShow && G.DataMgr.kaifuActData.canGetKaiFuChongBang(this.RANK_TYPE_INDEX1[dayIndex])) {
            return true;
        }
        return false;

    }


    getAwardResponse() {
        if (this.selectDay == 7) return;
        this.onTabDayClick(this.selectDay);
    }




}