import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { PriceBar } from 'System/business/view/PriceBar'
import { EnumStoreID, EnumKuafuPvpStatus } from 'System/constants/GameEnum'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { DataFormatter } from 'System/utils/DataFormatter'
import { KuaFu3v3RewardView } from 'System/activity/actHome/KuaFu3v3RewardView'
import { KuaFu3v3RankView } from 'System/activity/actHome/KuaFu3v3RankView'
import { KuaFu3v3StageView } from 'System/activity/actHome/KuaFu3v3StageView'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { KuaFu3v3RuleView } from 'System/activity/actHome/KuaFu3v3RuleView'
import { MallView } from 'System/business/view/MallView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { ActHomeView } from 'System/activity/actHome/ActHomeView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView';
import { UnitCtrlType } from "System/constants/GameEnum";

export class KuaFu3v3Panel extends TabSubForm {

    private readonly PunishTimerKey = '1';
    private readonly MatchingTimerKey = '2';

    private readonly CountDownSeconds = 60;

    private textActTime: UnityEngine.UI.Text;

    //private medalBg: UnityEngine.GameObject;
    //private medal: UnityEngine.UI.Image;
    //private medalAltas: Game.UGUIAltas;
    //private textMedalLv: UnityEngine.UI.Text;

    //private textStage: UnityEngine.UI.Text;
    //private progressBar: UnityEngine.GameObject;
    private progress: UnityEngine.UI.Image;
    private textProgress: UnityEngine.UI.Text;

    private textTimes: UnityEngine.UI.Text;

    private btnRule: UnityEngine.GameObject;

    private btnReward: UnityEngine.GameObject;
    private rewardTipMark: UnityEngine.GameObject;

    private btnRank: UnityEngine.GameObject;
    private btnStore: UnityEngine.GameObject;
    private btnStart: UnityEngine.GameObject;
    private labelBtnStart: UnityEngine.UI.Text;

    private matchingGo: UnityEngine.GameObject;
    //private textCountDown: UnityEngine.UI.Text;

    private punishGo: UnityEngine.GameObject;
    private textPunish: UnityEngine.UI.Text;
    private stagesGo: UnityEngine.GameObject;
    private stagesItem: UnityEngine.GameObject[] = [];
    private zhanHunBar: PriceBar;
    private normalGo: UnityEngine.GameObject;

    private leftBg: UnityEngine.GameObject;
    private leftBgStartPoint: UnityEngine.GameObject;
    private leftBgEndPoint: UnityEngine.GameObject;

    private rightBg: UnityEngine.GameObject;
    private rightBgStartPoint: UnityEngine.GameObject;
    private rightBgEndPoint: UnityEngine.GameObject;

    private centerGoStartPoint: UnityEngine.GameObject;
    private centerGoEndPoint: UnityEngine.GameObject;

    private matchingSuccess: UnityEngine.GameObject;
    private matching: UnityEngine.GameObject;

    private punishTime = 0;
    ///**匹配倒计时*/
    //private countDownTime = 0;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_CROSS3V3);
        this.closeSound = null;
    }

    protected resPath(): string {
        return UIPathData.KuaFu3v3View;
    }

    protected initElements() {
        this.textActTime = this.elems.getText('textActTime');

        //this.medalBg = this.elems.getElement('medalBg');
        //this.medal = this.elems.getImage('medal');
        //this.medalAltas = this.elems.getElement('medalAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        //this.textMedalLv = this.elems.getText('textMedalLv');

        //this.textStage = this.elems.getText('textStage');
        //this.progressBar = this.elems.getElement('progressBar');
        this.progress = this.elems.getImage('progress');
        this.textProgress = this.elems.getText('textProgress');
        this.textTimes = this.elems.getText('textTimes');

        this.btnRule = this.elems.getElement('btnRule');

        this.btnReward = this.elems.getElement('btnReward');
        this.rewardTipMark = this.elems.getElement('rewardTipMark');

        this.btnRank = this.elems.getElement('btnRank');
        this.btnStore = this.elems.getElement('btnStore');
        this.btnStart = this.elems.getElement('btnStart');
        this.labelBtnStart = this.elems.getText('labelBtnStart');

        this.matchingGo = this.elems.getElement('matchingGo');
        //this.matchingGo.SetActive(false);
        //this.textCountDown = this.elems.getText('textCountDown');

        this.punishGo = this.elems.getElement('punishGo');
        this.punishGo.SetActive(false);
        this.textPunish = this.elems.getText('textPunish');

        this.textActTime.text = G.DataMgr.langData.getLang(345);
        this.stagesGo = this.elems.getElement('stages');
        for (let i = 0; i < 6; i++) {
            this.stagesItem.push(ElemFinder.findObject(this.stagesGo, "stage" + i));
            if (this.stagesItem[i].activeSelf)
                this.stagesItem[i].SetActive(false);
        }
        this.normalGo = this.elems.getElement('normalGo');

        this.leftBg = this.elems.getElement('leftBg');
        this.leftBgStartPoint = this.elems.getElement('leftBgStartPoint');
        this.leftBgEndPoint = this.elems.getElement('leftBgEndPoint');
        this.rightBg = this.elems.getElement('rightBg');
        this.rightBgStartPoint = this.elems.getElement('rightBgStartPoint');
        this.rightBgEndPoint = this.elems.getElement('rightBgEndPoint');
        this.centerGoStartPoint = this.elems.getElement('centerGoStartPoint');
        this.centerGoEndPoint = this.elems.getElement('centerGoEndPoint');
        this.matchingSuccess = this.elems.getElement('matchingSuccess');
        this.matching = this.elems.getElement('matching');

        this.zhanHunBar = new PriceBar();
        this.zhanHunBar.setComponents(this.elems.getElement('zhanHunBar'));
        this.zhanHunBar.setCurrencyID(KeyWord.WARSOUL_THING_ID);
    }

    protected initListeners() {
        this.addClickListener(this.btnRule, this.onClickBtnRule);
        this.addClickListener(this.btnReward, this.onClickBtnReward);
        this.addClickListener(this.btnRank, this.onClickBtnRank);
        this.addClickListener(this.btnStore, this.onClickBtnStore);
        this.addClickListener(this.btnStart, this.onClickBtnStart);

        //this.addClickListener(this.medalBg, this.onClickTextStage);
        this.addClickListener(this.stagesGo, this.onClickTextStage);
        //this.addClickListener(this.textStage.gameObject, this.onClickTextStage);
    }

    protected onOpen() {

        let time = 0.5;
        Tween.TweenPosition.Begin(this.leftBg, time, this.leftBgEndPoint.transform.position, true);
        Tween.TweenPosition.Begin(this.rightBg, time, this.rightBgEndPoint.transform.position, true);
        Tween.TweenPosition.Begin(this.normalGo, time, this.centerGoEndPoint.transform.position, true);
        if (this.matchingSuccess.activeSelf) this.matchingSuccess.SetActive(false);
        this.updateView();
    }

    protected onClose() {

        let time = 0.5;
        Tween.TweenPosition.Begin(this.leftBg, time, this.leftBgStartPoint.transform.position, true);
        Tween.TweenPosition.Begin(this.rightBg, time, this.rightBgStartPoint.transform.position, true);
        Tween.TweenPosition.Begin(this.normalGo, time, this.centerGoStartPoint.transform.position, true);
    }

    private updateView() {
        let kf3v3Data = G.DataMgr.kf3v3Data;
        let info = kf3v3Data.pvpV3Info;
        let score = 0;
        let grade = 1;
        let punishTime = 0;
        let dayTime = 0;
        if (null != info) {
            score = info.m_uiScore;
            grade = info.m_uiGrade;
            punishTime = info.m_iPunishTime;
            dayTime = info.m_uiDayTime;
        }
        let nextConfig = kf3v3Data.getConfByLevel(grade + 1);
        let config = kf3v3Data.getConfByLevel(grade);
        // 段位名称
        //this.textStage.text = kf3v3Data.getStageName(grade);

        for (let i = 0; i < 6; i++) {
            if (i == config.m_iStage) {
                if (!this.stagesItem[i].activeSelf) {
                    this.stagesItem[i].SetActive(true);
                }
            } else {
                if (this.stagesItem[i].activeSelf) {
                    this.stagesItem[i].SetActive(false);
                }
            }
        }

        //this.medal.sprite = this.medalAltas.Get(config.m_iStage.toString());
        //if (config.m_iLv > 0) {
        //    this.textMedalLv.text = config.m_iLv.toString();
        //    this.textMedalLv.gameObject.SetActive(true);
        //} else {
        //    this.textMedalLv.gameObject.SetActive(false);
        //}
        // 进度
        let nextVal = score;
        if (null != nextConfig) {
            nextVal = nextConfig.m_iScore;
        }
        this.textProgress.text = uts.format('{0}/{1}', score, nextVal);
        this.progress.fillAmount = nextVal > 0 ? score / nextVal : 0;
        // 次数
        this.textTimes.text = dayTime.toString();
        // 战魂
        this.zhanHunBar.setPrice(G.DataMgr.heroData.zhanHun);
        if (punishTime > 0) {
            let now = Math.round(G.SyncTime.getCurrentTime() / 1000);
            this.punishTime = punishTime - now;
        }
        else {
            this.punishTime = 0;
        }
        if (this.punishTime > 0) {
            this.addTimer(this.PunishTimerKey, 1000, this.punishTime, this.onPunishTimer);
        } else {
            this.removeTimer(this.PunishTimerKey);
        }
        this.onPunishTimer(null);
        // 更新匹配按钮
        this.updateMatchBtnState();
        // 如果正在匹配，显示倒计时
        if (kf3v3Data.isMathing) {
            this.checkMatchCountDown();
        } else {
            this.onMatchingCanceled();
        }
        // 更新奖励按钮红点
        this.rewardTipMark.SetActive(TipMarkUtil.KuaFu3V3Reward());
    }

    private onPunishTimer(timer: Game.Timer) {
        this.punishTime -= null != timer ? timer.CallCountDelta : 0;
        if (this.punishTime > 0) {
            this.textPunish.text = /*G.DataMgr.langData.getLang(360,*/ DataFormatter.second2hhmmss(this.punishTime)/*)*/;
            if (!this.punishGo.activeSelf)
                this.punishGo.SetActive(true);
            if (this.normalGo.activeSelf)
                this.normalGo.SetActive(false);
        }
        else {
            this.removeTimer(this.PunishTimerKey);
            if (this.punishGo.activeSelf)
                this.punishGo.SetActive(false);
            if (!this.normalGo.activeSelf)
                this.normalGo.SetActive(true);
            this.updateMatchBtnState();
        }
    }

    /**更新匹配按钮状态*/
    private updateMatchBtnState() {
        let isOpen = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_PVP_MULTI);
        isOpen = isOpen && this.punishTime <= 0;
        UIUtils.setButtonClickAble(this.btnStart, isOpen);
    }

    private onClickBtnRule() {
       // G.Uimgr.createForm<KuaFu3v3RuleView>(KuaFu3v3RuleView).open();
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(484), '玩法说明');
    }

    private onClickBtnReward() {
       G.Uimgr.createForm<KuaFu3v3RewardView>(KuaFu3v3RewardView).open();
    }

    private onClickBtnRank() {
      
        G.Uimgr.createForm<KuaFu3v3RankView>(KuaFu3v3RankView).open();
    }

    private onClickBtnStore() {
        G.Uimgr.createForm<MallView>(MallView).open(EnumStoreID.ZhanHun);
        G.Uimgr.bindCloseCallback(MallView, ActHomeView, this.id);
    }

    private onClickBtnStart() {
        if (G.DataMgr.kf3v3Data.myStatus == EnumKuafuPvpStatus.queue) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleCommonRequest(Macros.CROSS_MULTI_EXIT));
        }
        else if (G.DataMgr.kf3v3Data.myStatus == EnumKuafuPvpStatus.none) {
            if (G.DataMgr.sxtData.myTeam || G.DataMgr.teamData.hasTeam) {
                G.TipMgr.showConfirm(G.DataMgr.langData.getLang(348), ConfirmCheck.noCheck, "参加|取消", delegate(this, this.onConfirmExitTeam));
            }
            else {
                this.requestMatch();
            }
        }
    }

    /**确定购买*/
    private onConfirmExitTeam(status: MessageBoxConst, isCheckSelected: boolean) {
        if (MessageBoxConst.yes == status) {
            G.ActionHandler.leaveTeam();
            this.requestMatch();
        }
    }

    /**请求匹配*/
    private requestMatch() {
        // 检查进副本条件
        if (!G.ActionHandler.canEnterPinstance(Macros.PINSTANCE_ID_MULTIPVP, 0, true, true)) {
            // 无法进入
            return;
        }
        uts.log('3v3请求排队...');
        let gameParas = G.DataMgr.gameParas;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCross3v3JoinRequest(gameParas.domain, gameParas.serverIp, gameParas.serverPort));
    }

    /**更新活动状态*/
    onActDataChange() {
        this.updateMatchBtnState();
    }

    onKuaFu3v3DataChanged() {
        this.updateView();
    }

    onMatchingStarted() {
        this.checkMatchCountDown();
    }

    onMatchingCanceled() {
        //this.countDownTime = this.CountDownSeconds;
        //this.matchingGo.SetActive(false);
        Tween.TweenPosition.Begin(this.matchingGo, 0.5, this.centerGoStartPoint.transform.position, true);
        Tween.TweenPosition.Begin(this.normalGo, 0.5, this.centerGoEndPoint.transform.position, true);
        //if (!this.normalGo.activeSelf) {
        //    this.normalGo.SetActive(true);
          
        //}
        this.labelBtnStart.text = '开始匹配';
    }

    //匹配成功
    onMatchingSuccess() {
        if (!this.matchingSuccess.activeSelf) this.matchingSuccess.SetActive(true);
        if (this.matching.activeSelf) this.matching.SetActive(false);
        G.ResourceMgr.loadModel(this.centerGoEndPoint, UnitCtrlType.other, "effect/uitx/jingjichang/pipeicg.prefab", this.sortingOrder + 2);
    }

    private checkMatchCountDown() {
        let time = 0.5;
        Tween.TweenPosition.Begin(this.leftBg, time, this.leftBgEndPoint.transform.position, true);
        let tween = Tween.TweenPosition.Begin(this.rightBg, time, this.rightBgEndPoint.transform.position, true);
        tween.onFinished = delegate(this, this.onCheckMatchCountDown);

    }

    private onCheckMatchCountDown(): void {
        //this.matchingGo.SetActive(true);
        Tween.TweenPosition.Begin(this.matchingGo, 0.5, this.centerGoEndPoint.transform.position, true);
        Tween.TweenPosition.Begin(this.normalGo, 0.5, this.centerGoStartPoint.transform.position, true);
        if (this.matching.activeSelf) this.matching.SetActive(true);
        //if (this.normalGo.activeSelf) {
        //    //this.normalGo.SetActive(false);
           
        //}
        this.labelBtnStart.text = '取消匹配';
        //this.onMatchingTimer(null);
        //this.addTimer(this.MatchingTimerKey, 1000, 0, this.onMatchingTimer);
    }

    //private onMatchingTimer(timer: Game.Timer) {
    //    if (this.countDownTime <= 0) {
    //        this.countDownTime = this.CountDownSeconds;
    //    }
    //    this.countDownTime -= null != timer ? timer.CallCountDelta : 0;
    //    if (this.countDownTime < 0) {
    //        this.countDownTime = 0;
    //    }
    //    this.textCountDown.text = uts.format('正在匹配中({0})...', this.countDownTime);
    //}

    private onClickTextStage() {
        G.Uimgr.createForm<KuaFu3v3StageView>(KuaFu3v3StageView).open();
    }
}