import { Constants } from "System/constants/Constants";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { EnumSceneResultId, SceneResultView } from "System/pinstance/result/SceneResultView";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { IconItem } from "System/uilib/IconItem";
import { List, ListItem } from "System/uilib/List";
import { NestedSubForm } from "System/uilib/NestedForm";
import { DataFormatter } from "System/utils/DataFormatter";
import { RegExpUtil } from "System/utils/RegExpUtil";
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { ChallengeAgainConfrimView } from "System/pinstance/ChallengeAgainConfrimView";
import { ThingData } from 'System/data/thing/ThingData'
import { KeyWord } from "System/constants/KeyWord";
import { MainView } from "System/main/view/MainView";
import { GameIDUtil } from 'System/utils/GameIDUtil'

class WorldBossTimeBall {
    private light: UnityEngine.GameObject;
    private effect: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.light = ElemFinder.findObject(go, 'light');
        this.effect = ElemFinder.findObject(go, 'effect');
    }

    update(isLight: boolean, showEffect: boolean) {
        if (isLight) {
            this.light.SetActive(true);
            this.effect.SetActive(false);
        } else if (showEffect) {
            this.light.SetActive(true);
            this.effect.SetActive(false);
            Game.Invoker.BeginInvoke(this.light, 'startEffect', 0.5, delegate(this, this.onStartEffect));
        } else {
            this.light.SetActive(false);
            this.effect.SetActive(false);
        }
    }

    private onStartEffect() {
        this.effect.SetActive(true);
        Game.Invoker.BeginInvoke(this.effect, 'effectEnd', 0.5, delegate(this, this.onEffectEnd));
    }

    private onEffectEnd() {
        this.light.SetActive(false);
        this.effect.SetActive(false);
    }
}

export class SceneResultSuccessPanel extends NestedSubForm {
    /**星星*/
    private readonly starts = 5;
    private successTitleGo: UnityEngine.GameObject;
    private failTitleGo: UnityEngine.GameObject;

    private textDesc: UnityEngine.UI.Text;
    private textUseTime: UnityEngine.UI.Text;
    private betterGo: UnityEngine.GameObject;

    private bossDesc: UnityEngine.GameObject;
    private timeBalls: WorldBossTimeBall[] = [];
    private timeText: UnityEngine.UI.Text;

    private rewardWrapper: UnityEngine.GameObject;
    private rewardList: List;
    private rewardIcons: IconItem[] = [];

    private btnExit: UnityEngine.GameObject;
    private textExitLabel: UnityEngine.UI.Text;
    private btnNext: UnityEngine.GameObject;
    private textNextLabel: UnityEngine.UI.Text;
    private closetxt: UnityEngine.UI.Text;
    private effectOrange: UnityEngine.GameObject;
    private effectGold: UnityEngine.GameObject;
    private resultInfo: Protocol.SceneResultSuccess;
    private isSuccess: boolean;
    private countDownSec: number = 0;
    constructor() {
        super(EnumSceneResultId.success);
    }

    protected resPath(): string {
        return UIPathData.SceneResultSuccessView;
    }

    protected initElements() {
        this.successTitleGo = this.elems.getElement('titleSuccess');
        this.failTitleGo = this.elems.getElement('titleFail');

        this.textDesc = this.elems.getText('desc');
        this.textUseTime = this.elems.getText('useTime');
        this.betterGo = this.elems.getElement('better');

        this.rewardWrapper = this.elems.getElement('rewardWrapper');
        this.rewardList = this.elems.getUIList('rewardList');

        this.btnExit = this.elems.getElement('btnExit');
        this.textExitLabel = this.elems.getText('textExitLabel');

        this.btnNext = this.elems.getElement('btnNext');
        this.textNextLabel = this.elems.getText('textNextLabel');

        this.closetxt = this.elems.getText('closetxt');

        this.bossDesc = this.elems.getElement('bossDesc');
        this.effectOrange = this.elems.getElement('effectOrange');
        this.effectGold = this.elems.getElement('effectGold');

        this.timeText = this.elems.getText('timeText');
        let timeBalls = this.elems.getElement('timeBalls');
        for (let i = 0; i < this.starts; i++) {
            let timeBall = new WorldBossTimeBall();
            timeBall.setComponents(ElemFinder.findObject(timeBalls, i.toString()));
            this.timeBalls.push(timeBall);
        }
    }

    protected initListeners() {
        this.addClickListener(this.btnExit, this.onBtnExitClick);
        this.addClickListener(this.btnNext, this.onBtnNextClick);
        this.addClickListener(this.elems.getElement('mask'), this.onBtnExitClick);
    }

    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        this.successTitleGo.SetActive(this.isSuccess);
        this.failTitleGo.SetActive(!this.isSuccess);
        // 是否新纪录
        this.betterGo.SetActive(0 != this.resultInfo.m_ucIsBest);

        this.textDesc.text = RegExpUtil.xlsDesc2Html(this.resultInfo.m_szText);
        let isPersonalBossScene = Macros.PINSTANCE_ID_PRIVATE_BOSS == G.DataMgr.sceneData.curPinstanceID;
        if (Macros.PINSTANCE_ID_WORLDBOSS == G.DataMgr.sceneData.curPinstanceID) {
            //let activityData = G.DataMgr.activityData;
            ////世界boss次数上限
            //let reserveCnt = G.DataMgr.vipData.getReserveTime(Macros.PINSTANCE_ID_WORLDBOSS);
            //let maxCnt = Macros.MAX_BOSS_DAY_SCRIPT_CNT + reserveCnt + G.DataMgr.activityData.leftCnt;
            //this.timeText.text = uts.format("{0}/{1}", this.resultInfo.m_iCurProsess, maxCnt);

            //let leftCnt = Macros.MAX_BOSS_DAY_SCRIPT_CNT - this.resultInfo.m_iCurProsess;
            //let needEffect = this.resultInfo.m_iCurProsess > this.resultInfo.m_iMaxProsess;
            //for (let i = 0; i < Macros.MAX_BOSS_DAY_SCRIPT_CNT; i++) {
            //    let ball = this.timeBalls[i];
            //    ball.update(i < leftCnt, needEffect && i > leftCnt - 1 && i <= (Macros.MAX_BOSS_DAY_SCRIPT_CNT - this.resultInfo.m_iMaxProsess - 1));
            //}
            this.bossDesc.SetActive(false);

        } else if (Macros.PINSTANCE_ID_PRIVATE_BOSS == G.DataMgr.sceneData.curPinstanceID) {//个人boss
            let activityData = G.DataMgr.activityData;
            let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_PRIVATE_BOSS);
            this.timeText.text = uts.format("{0}/{1}", info.m_stPinExtraInfo.m_stPrivateBossList.m_ucTotalCount, G.DataMgr.constData.getValueById(KeyWord.PARAM_PRIVATE_BOSS_LIMIT_COUNT));
            this.bossDesc.SetActive(true);
        } else {
            this.bossDesc.SetActive(false);
        }

        if (this.resultInfo.m_uiTime > 0) {
            this.textUseTime.text = uts.format('本次消耗时间：{0}', DataFormatter.second2hhmmss(this.resultInfo.m_uiTime));
            this.textUseTime.gameObject.SetActive(true);
        } else {
            this.textUseTime.gameObject.SetActive(false);
        }

        let rewardCnt: number = this.resultInfo.m_stThingList.m_astThing.length;
        if (rewardCnt > 0) {
            this.rewardWrapper.SetActive(true);
            this.rewardList.Count = rewardCnt;
            let rewardItem: ListItem, iconItem: IconItem;
            let oldIconCnt = this.rewardIcons.length;
            for (let i: number = 0; i < rewardCnt; i++) {
                let thing = this.resultInfo.m_stThingList.m_astThing[i];

                rewardItem = this.rewardList.GetItem(i);
                if (i < oldIconCnt) {
                    iconItem = this.rewardIcons[i];
                }
                else {
                    this.rewardIcons[i] = iconItem = new IconItem();
                    iconItem.setUsuallyIcon(rewardItem.gameObject);
                }
                iconItem.updateById(thing.m_uiThingID, thing.m_uiThingNum);
                iconItem.updateIcon();

                if (GameIDUtil.isHunguEquipID(thing.m_uiThingID) || GameIDUtil.isPetEquipID(thing.m_uiThingID) || GameIDUtil.isOtherEquipID(thing.m_uiThingID)) {
                    //魂骨 伙伴 祝福 装备 加特效
                    let iconPrefab = Game.Tools.Instantiate(this.effectGold, rewardItem.gameObject, false) as UnityEngine.GameObject;
                    // iconPrefab.transform.SetParent(this.rewardWrapper.transform);
                    let rect = iconPrefab.GetComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;
                    rect.SetAsLastSibling();
                }
            }
        } else {
            this.rewardWrapper.SetActive(false);
        }

        let showExit: boolean = this.resultInfo.m_ucShowExit != Macros.SCENERESULT_BUT_NONE;
        let showNext: boolean = this.resultInfo.m_ucShowNext != Macros.SCENERESULT_BUT_NONE;
        let showTwo: boolean = showExit && showNext;
        //this.btnExit.gameObject.SetActive(showExit);
        //this.btnNext.gameObject.SetActive(showNext);
        if (showExit && showNext) {
            this.btnExit.SetActive(true);
            this.btnNext.SetActive(true);
            this.closetxt.gameObject.SetActive(false);
        } else {
            this.btnExit.SetActive(false);
            this.btnNext.SetActive(false);
            this.closetxt.gameObject.SetActive(true);
        }

        //this.textExitLabel.text = '退出';
        //this.textNextLabel.text = '继续';
        if (this.resultInfo.m_ucShowExit == Macros.SCENERESULT_BUT_SHOW_TIMER || this.resultInfo.m_ucShowNext == Macros.SCENERESULT_BUT_SHOW_TIMER) {
            // 按钮显示倒计时
            // this.countDownSec = Constants.ResultCountDownMin + Math.round(Math.random() * (Constants.ResultCountDownMax - Constants.ResultCountDownMin));
            // this.addTimer("1", 1000, this.countDownSec, this.onBtnTimer);
            this.updateBtnTime(this.countDownSec);
        } else {
            this.removeTimer("1");
        }

        G.AudioMgr.playSound('sound/ui/uisound_16.mp3');
    }

    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
    }

    open(result: Protocol.SceneResultSuccess, isSuccess: boolean) {
        this.resultInfo = result;
        this.isSuccess = isSuccess;
        super.open();
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onBtnTimer(timer: Game.Timer) {
        let leftTime = this.countDownSec - timer.CallCount;
        if (leftTime <= 0) {
            if (this.resultInfo.m_ucShowExit == Macros.SCENERESULT_BUT_SHOW_TIMER) {
                this.onBtnExitClick();
            } else if (this.resultInfo.m_ucShowNext == Macros.SCENERESULT_BUT_SHOW_TIMER) {
                this.onBtnNextClick();
            }
        } else {
            this.updateBtnTime(leftTime);
        }
    }

    private updateBtnTime(leftTime: number) {
        // this.closetxt.text = uts.format('点击屏幕空白处关闭({0})', leftTime);
        // if (this.resultInfo.m_ucShowExit == Macros.SCENERESULT_BUT_SHOW_TIMER) {
        //     this.textExitLabel.text = uts.format('退出({0})', leftTime);
        // } else if (this.resultInfo.m_ucShowNext == Macros.SCENERESULT_BUT_SHOW_TIMER) {
        //     this.textNextLabel.text = uts.format('继续({0})', leftTime);
        // }
        this.closetxt.text = '点击屏幕空白处关闭';
        if (this.resultInfo.m_ucShowExit == Macros.SCENERESULT_BUT_SHOW_TIMER) {
            this.textExitLabel.text = "退出";
        } else if (this.resultInfo.m_ucShowNext == Macros.SCENERESULT_BUT_SHOW_TIMER) {
            this.textNextLabel.text = "继续";
        }
    }

    private onBtnExitClick() {
        G.ModuleMgr.pinstanceModule.onClickQuitPinstance(true);
        G.Uimgr.closeForm(SceneResultView);
    }

    private onBtnNextClick() {
        if (PinstanceIDUtil.isZuDuiFuBen(G.DataMgr.sceneData.curPinstanceID)) {
            G.Uimgr.createForm<ChallengeAgainConfrimView>(ChallengeAgainConfrimView).open();
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getClickMenuRequest(G.DataMgr.sceneData.curPinstanceID, 1));
        G.Uimgr.closeForm(SceneResultView);


    }
}