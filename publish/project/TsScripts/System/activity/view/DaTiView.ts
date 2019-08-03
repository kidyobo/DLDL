import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { IconItem } from 'System/uilib/IconItem'
import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { TipFrom } from 'System/tip/view/TipsView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { HeroController } from "System/unit/hero/HeroController"
import { MapSceneConfig } from "System/data/scene/MapSceneConfig"
import { Color } from "System/utils/ColorUtil";
import { MathUtil } from "System/utils/MathUtil"
export class DaTiView extends CommonForm {
    /**当前状态*/
    private m_state: number = 0;

    /**对玩家的引用*/
    private m_hero: HeroController;

    /**场景*/
    private m_sceneConfig: MapSceneConfig;

    /**答案1区域面板*/
    private leftPanel: UnityEngine.GameObject;

    /**答案2区域面板*/
    private rightPanel: UnityEngine.GameObject;

    private question: UnityEngine.UI.Text;

    private selectLeft: UnityEngine.GameObject;

    private selectRight: UnityEngine.GameObject;

    private answerLeft: UnityEngine.UI.Text;
    private answerRight: UnityEngine.UI.Text;

    private leftCorrect: UnityEngine.GameObject;
    private leftWrong: UnityEngine.GameObject;
    private rightWrong: UnityEngine.GameObject;
    private rightCorrect: UnityEngine.GameObject;
    private remain: UnityEngine.UI.Text;
    private correct: UnityEngine.UI.Text;
    private leftTime: UnityEngine.UI.Text;
    private notify: Protocol.QuestionActivity_Notify;
    constructor() {
        super(1);
    }

    layer(): UILayer {
        return UILayer.Base;
    }

    protected resPath(): string {
        return UIPathData.DaTiView;
    }

    protected initElements() {
        this.remain = this.elems.getText("remain");
        this.correct = this.elems.getText("correct");
        this.leftTime = this.elems.getText("leftTime");
        this.leftPanel = this.elems.getElement("leftPanel");
        this.rightPanel = this.elems.getElement("rightPanel");

        this.question = this.elems.getText("question");

        this.selectLeft = this.elems.getElement("selectLeft");
        this.selectRight = this.elems.getElement("selectRight");

        this.answerLeft = this.elems.getText("answerLeft");
        this.answerRight = this.elems.getText("answerRight");

        this.leftCorrect = this.elems.getElement("leftCorrect");
        this.leftWrong = this.elems.getElement("leftWrong");
        this.rightWrong = this.elems.getElement("rightWrong");
        this.rightCorrect = this.elems.getElement("rightCorrect");
        this.addTimer("updatePosTimer", 100, 0,this.onUpdatePos);
    }

    open(cache: Protocol.QuestionActivity_Notify) {
        this.notify = cache;
        super.open();
    }

    protected initListeners() {
        this.addClickListener(this.leftPanel, this._onClickLeft);
        this.addClickListener(this.rightPanel, this._onClickRight);
    }
    protected onOpen() {
        this.m_hero = G.UnitMgr.hero;

        this.m_sceneConfig = G.DataMgr.sceneData.curSceneConfig;
        this.updateView(this.notify);
    }
    protected onClose() {
    }
    updateView(notify: Protocol.QuestionActivity_Notify): void {
        this.m_state = notify.m_ucType;
        let leftTimeCount = 0;
        if (notify.m_ucType == Macros.QUESTION_ACTIVITY_NTF_PREPARE) {
            this.question.text = '答题活动马上开始';
            this.answerLeft.text = "";
            this.answerRight.text = "";
            this.selectLeft.SetActive(false);
            this.selectRight.SetActive(false);

            leftTimeCount = notify.m_stActivityInfo.m_stPrepareInfo.m_uiPrepareTime;

            this.leftCorrect.SetActive(false);
            this.leftWrong.SetActive(false);
            this.rightCorrect.SetActive(false);
            this.rightWrong.SetActive(false);

            this.remain.text = "第 0/30 题";
            this.correct.text = uts.format('答对题目: {0}', TextFieldUtil.getColorText('0', Color.GREEN));
        }
        else if (notify.m_ucType == Macros.QUESTION_ACTIVITY_NTF_QEUSTION) {
            let config = G.DataMgr.daTiData.getDatiConfig(notify.m_stActivityInfo.m_stQuestionInfo.m_uiQuestionID);

            this.question.text = config.m_szSubject;
            this.answerLeft.text = config.m_szAnswerLeft;
            this.answerRight.text = config.m_szAnswerRight;

            leftTimeCount = notify.m_stActivityInfo.m_stQuestionInfo.m_uiLeftTime;
            
            this.remain.text = uts.format('第 {0}/30 题', (notify.m_stActivityInfo.m_stQuestionInfo.m_uiQuestionCount).toString());
            this.correct.text = uts.format('答对题目: {0}', TextFieldUtil.getColorText(notify.m_stActivityInfo.m_stQuestionInfo.m_stRoleAccInfo.m_uiAccCount.toString(),Color.GREEN));
            this.leftCorrect.SetActive(false);
            this.leftWrong.SetActive(false);
            this.rightCorrect.SetActive(false);
            this.rightWrong.SetActive(false);

            this._updateHeroPos();
        }
        else if (notify.m_ucType == Macros.QUESTION_ACTIVITY_NTF_ANSWER) {
            let config = G.DataMgr.daTiData.getDatiConfig(notify.m_stActivityInfo.m_stAnswerInfo.m_uiQuestionID);


            this.question.text = config.m_szSubject;
            this.answerLeft.text = config.m_szAnswerLeft;
            this.answerRight.text = config.m_szAnswerRight;


            if (notify.m_stActivityInfo.m_stAnswerInfo.m_bAnswer == 1) {
                this.leftCorrect.SetActive(true);
                this.leftWrong.SetActive(false);
                this.rightCorrect.SetActive(false);
                this.rightWrong.SetActive(true);
                if (notify.m_stActivityInfo.m_stAnswerInfo.m_bCorrect > 0) {
                    this.selectLeft.SetActive(true);
                    this.selectRight.SetActive(false);
                }
            }
            else {
                this.leftCorrect.SetActive(false);
                this.leftWrong.SetActive(true);
                this.rightCorrect.SetActive(true);
                this.rightWrong.SetActive(false);
                if (notify.m_stActivityInfo.m_stAnswerInfo.m_bCorrect > 0) {
                    this.selectLeft.SetActive(false);
                    this.selectRight.SetActive(true);
                }
            }

            leftTimeCount = notify.m_stActivityInfo.m_stAnswerInfo.m_uiLeftTime;
            this.remain.text = uts.format('第 {0}/30 题',(notify.m_stActivityInfo.m_stAnswerInfo.m_uiQuestionCount).toString());
            this.correct.text = uts.format('答对题目: {0}', TextFieldUtil.getColorText(notify.m_stActivityInfo.m_stAnswerInfo.m_stRoleAccInfo.m_uiAccCount.toString(),Color.GREEN)) ;

            //m_manager.mainEffectCtrl.playDatiEffect(Boolean(notify.m_stActivityInfo.m_stAnswerInfo.m_bCorrect > 0));
        }

        this.leftTime.text = leftTimeCount.toString();
        let del = delegate(this, this._onTimer);

        this.addTimer("1", leftTimeCount * 1000, 1, del, 1000, del);
    }

    private _updateHeroPos(): void {
        if (this.m_hero.getPixelPosition().x < Math.floor(this.m_sceneConfig.curMapWidth / 2)) {
            this.selectLeft.SetActive(true);
            this.selectRight.SetActive(false);
        }
        else {
            this.selectLeft.SetActive(false);
            this.selectRight.SetActive(true);
        }
    }

    private onUpdatePos(): void {
        if (this.m_state == Macros.QUESTION_ACTIVITY_NTF_QEUSTION) {
            this._updateHeroPos();
        }
    }

    private _onTimer(timer: Game.Timer): void {
        this.leftTime.text = Math.floor(timer.LeftTime / 1000).toString();
    }

    private _onClickLeft(): void {
        if (this.m_state == Macros.QUESTION_ACTIVITY_NTF_QEUSTION) {
            let curSceneID: number = G.DataMgr.sceneData.curSceneID;
            let mx: number = Math.floor(this.m_sceneConfig.curMapWidth / 4) + MathUtil.randomBetweenTwoNumbers(-250, 250);
            let my: number = Math.floor(this.m_sceneConfig.curMapHeight * 2 / 3) + MathUtil.randomBetweenTwoNumbers(-50, 150);
            G.Mapmgr.goToPos(curSceneID, mx, my, false);
            this._updateHeroPos();
        }
    }

    private _onClickRight(): void {
        if (this.m_state == Macros.QUESTION_ACTIVITY_NTF_QEUSTION) {
            let curSceneID: number = G.DataMgr.sceneData.curSceneID;
            let mx: number = Math.floor(this.m_sceneConfig.curMapWidth * 3 / 4) + MathUtil.randomBetweenTwoNumbers(-250, 250);
            let my: number = Math.floor(this.m_sceneConfig.curMapHeight * 2 / 3) + MathUtil.randomBetweenTwoNumbers(-50, 150);
            G.Mapmgr.goToPos(curSceneID, mx, my, false);
            //this._updateHeroPos();
        }
    }
}