import { Global as G } from 'System/global'
import { CommonForm, UILayer, GameObjectGetSet, TextGetSet } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { DataFormatter } from 'System/utils/DataFormatter'
import { PetData } from 'System/data/pet/PetData'
import { UiElements } from "System/uilib/UiElements";
import { UnitCtrlType, GameIDType, SceneID } from 'System/constants/GameEnum'

class PetSkillDisplay {
    private skillHeadTrans: UnityEngine.GameObject;
    private skillNameTrans: UnityEngine.GameObject;
    //下面两个存特效
    private skillHeadTx: UnityEngine.GameObject;
    private skillNameTx: UnityEngine.GameObject;

    //存特效id
    private oldSkillId = 0;

    private gameObject: GameObjectGetSet;
    private elems: UiElements;

    setComponents(go: GameObjectGetSet, elems: UiElements = null) {
        this.gameObject = go;
        this.skillHeadTrans = ElemFinder.findObject(go.gameObject, 'head');
        this.skillNameTrans = ElemFinder.findObject(go.gameObject, 'skillName');
        if (elems) {
            this.elems = elems;
        }

    }
    //显示技能头像
    showHead(skillId: number) {
        G.ResourceMgr.loadModel(this.skillHeadTrans, UnitCtrlType.petskillUIEffect, "tx" + skillId, 0);
        this.gameObject.SetActive(true);
    }

    showName(skillId: number) {
        G.ResourceMgr.loadModel(this.skillNameTrans, UnitCtrlType.petskillUIEffect, skillId.toString(), 0);
    }

    hide(skillId: number = 0) {
        this.gameObject.SetActive(false);
    }
}

export class MainUIEffectView extends CommonForm {

    public static isShowcountDownTimer = false;
    private readonly PetSkillTimerKey = 'petSkill';
    private readonly PetSkillOtherTimerKey = 'petSkillOther';
    private readonly anqiSkillTimerKey = 'anqiSkill';


    private readonly PetSkillSeconds = 2000;

    /**地宫提示一个3个点点点*/
    private readonly DiGongTipDotCount = 3;
    private readonly DiGongTipTimerKey = '2';

    private readonly BuffTimerKey = '3';

    /**副本倒计时*/
    private pinstanceTimeGo: GameObjectGetSet;
    private textPinLabel: TextGetSet;
    private textPinCountDown: TextGetSet;
    private totalPinTimeSecond: number = 0;
    private textPinLabelStr: string;

    /**屏幕中间倒计时*/
    private countDownGo: GameObjectGetSet;
    private countDownText: TextGetSet;
    private totalCountDownSecond: number = 0;
    private countDownId: number = 0;

    private lvUpRequest: Game.AssetRequest;
    private lvUpAnimObj: GameObjectGetSet;

    private completeQuestRequest: Game.AssetRequest;
    private completeQuestAnimObj: GameObjectGetSet;

    private acceptQuestRequest: Game.AssetRequest;
    private acceptQuestAnimObj: GameObjectGetSet;

    private hangup: GameObjectGetSet;
    private resumeHangup = false;

    private pathing: GameObjectGetSet;
    private shoe: GameObjectGetSet;
    private resumePathing = false;

    private petSkill: PetSkillDisplay;
    private petSkillOther: PetSkillDisplay;
    private anqiSkill: GameObjectGetSet;
    private anqiSkillNode: GameObjectGetSet;


    private skillAtals: Game.UGUIAltas;
    private headAtals: Game.UGUIAltas;

    private diGongTip: GameObjectGetSet;
    private diGongTipDots: GameObjectGetSet[] = [];
    private crtDotCount = 0;

    private diGongWyTip: GameObjectGetSet;

    private buffCountDown: GameObjectGetSet;
    private textBuffCountDown: TextGetSet;
    private buffId = 0;
    private buffSeconds = 0;

    private xfxLv = 0;

    private skillId = 0;

    private txtPinstanceTitle: TextGetSet;
    private pinstanceTitleBg: GameObjectGetSet;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    protected onOpen() {
    }

    protected onClose() {

    }

    layer(): UILayer {
        return UILayer.MainUIEffect;
    }
    protected resPath(): string {
        return UIPathData.MainUIEffectView;
    }
    protected initElements(): void {
        this.pinstanceTimeGo = new GameObjectGetSet(this.elems.getElement('pinstanceTime'));
        this.textPinLabel = new TextGetSet(this.elems.getText('textPinLabel'));
        this.textPinCountDown = new TextGetSet(this.elems.getText('textPinCountDown'));
        this.pinstanceTimeGo.SetActive(false);

        this.countDownGo = new GameObjectGetSet(this.elems.getElement('countDown'));
        this.countDownText = new TextGetSet(this.elems.getText('textCountDown'));
        this.countDownGo.SetActive(false);

        this.hangup = new GameObjectGetSet(this.elems.getElement('hangup'));
        this.hangup.SetActive(false);
        this.pathing = new GameObjectGetSet(this.elems.getElement('pathing'));
        this.shoe = new GameObjectGetSet(this.elems.getElement('shoe'));
        this.pathing.SetActive(false);

        let petSkillGo = new GameObjectGetSet(this.elems.getElement('petSkill'));
        this.petSkill = new PetSkillDisplay();
        this.petSkill.setComponents(petSkillGo, this.elems);
        this.petSkill.hide();

        let petSkillOtherGo = new GameObjectGetSet(this.elems.getElement('petSkillOther'));
        this.petSkillOther = new PetSkillDisplay();
        this.petSkillOther.setComponents(petSkillOtherGo);
        this.petSkillOther.hide();

        this.skillAtals = this.elems.getUGUIAtals("petskillAtals");
        this.headAtals = this.elems.getUGUIAtals("headAtals");

        this.diGongTip = new GameObjectGetSet(this.elems.getElement('diGongTip'));
        this.diGongTip.SetActive(false);
        for (let i = 0; i < this.DiGongTipDotCount; i++) {
            let dot = new GameObjectGetSet(this.elems.getElement('diGongTipDot' + i));
            this.diGongTipDots.push(dot);
        }

        this.diGongWyTip = new GameObjectGetSet(this.elems.getElement('diGongWyTip'));
        this.diGongWyTip.SetActive(false);

        this.buffCountDown = new GameObjectGetSet(this.elems.getElement('buffCountDown'));
        this.textBuffCountDown = new TextGetSet(this.elems.getText('textBuffCountDown'));
        this.buffCountDown.SetActive(false);

        this.anqiSkill = new GameObjectGetSet(this.elems.getElement('anqiSkill'));
        this.anqiSkillNode = new GameObjectGetSet(this.elems.getElement('anqiSkillNode'));

        let funcLimitCfg = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.OTHER_FUNCTION_TRANSPORT);
        if (null != funcLimitCfg) {
            this.xfxLv = funcLimitCfg.m_ucLevel;
        }
        this.txtPinstanceTitle = new TextGetSet(this.elems.getText('txtPinstanceTitle'));
        this.pinstanceTitleBg = new GameObjectGetSet(this.elems.getElement('pinstanceTitleBg'));
    }
    protected initListeners(): void {
        this.addClickListener(this.shoe.gameObject, this.onClickShoe);
    }

    private onClickShoe() {
        G.Mapmgr.continuePathing(true);
        if (G.DataMgr.runtime.isWaitTransprotResponse) {
            G.ModuleMgr.deputyModule.startEndHangUp(false);
        }
    }

    /**
     * 显示副本名称
     * @param title
     * @param duration 显示时间
     * @param hideDuration 渐变消失时间
     */
    showPinstanceTitle(title: string, duration: number) {
        this.pinstanceTitleBg.SetActive(true);
        this.txtPinstanceTitle.text = title;
        Game.Invoker.BeginInvoke(this.pinstanceTitleBg.gameObject, "hide", duration, delegate(this,  this.hidePinstanceTitle));
    }

    private hidePinstanceTitle(): void{
        this.pinstanceTitleBg.SetActive(false);
    }


    /**
     * 副本倒计时。
     * @param label
     * @param seconds
     */
    playPinstanceTime(label: string, seconds: number) {

        this.totalPinTimeSecond = seconds;
        this.textPinLabelStr = label;
        //this.textPinLabel.text = label;
        //this.textPinCountDown.text = DataFormatter.second2hhmmss(seconds);
        //this.textPinLabel.text = uts.format("{0}{1}", label, DataFormatter.second2hhmmss(seconds));
        this.pinstanceTimeGo.SetActive(true);
        this.addTimer("pinCountDownTimer", 1000, seconds, this.onPinCountDownTimer);
    }

    stopPinstanceTime(hideUI: boolean) {
        if (hideUI) {
            if (null != this.pinstanceTimeGo) {
                this.pinstanceTimeGo.SetActive(false);
            }
        }
        this.removeTimer("pinCountDownTimer");
    }

    private onPinCountDownTimer(timer: Game.Timer) {
        this.totalPinTimeSecond -= timer.CallCountDelta;
        if (this.totalPinTimeSecond <= 0) {
            this.stopPinstanceTime(false);
        } else {
            this.textPinCountDown.text = DataFormatter.second2hhmmss(this.totalPinTimeSecond);
            this.textPinLabel.text = this.textPinLabelStr + DataFormatter.second2hhmmss(this.totalPinTimeSecond);
        }
    }

    /**
     * 屏幕中间的倒计时
     * @param totalSecond
     */
    playCountDown(totalSecond: number): number {
        this.totalCountDownSecond = totalSecond;
        this.countDownText.text = totalSecond.toString();
        this.countDownGo.SetActive(true);
        MainUIEffectView.isShowcountDownTimer = true;
        this.addTimer("countDownTimer", 1000, totalSecond, this.onCountDownTimer);
        return ++this.countDownId;
    }

    stopCountDown(id: number) {
        if (id <= 0 || id == this.countDownId) {
            this.removeTimer("countDownTimer");
            this.countDownGo.SetActive(false);
            MainUIEffectView.isShowcountDownTimer = false;
        }
    }

    private onCountDownTimer(timer: Game.Timer) {
        this.totalCountDownSecond -= timer.CallCountDelta;
        if (this.totalCountDownSecond <= 0) {
            this.stopCountDown(0);
        } else {
            this.countDownText.text = this.totalCountDownSecond.toString();
        }
    }

    playLvUpAnim() {
        if (null != this.lvUpAnimObj) {
            if (!this.lvUpAnimObj.activeSelf) {
                this.doPlayLvUpAnim();
            }
            return;
        }
        if (null != this.lvUpRequest) {
            return;
        }
        this.lvUpRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Normal1, 'effect/sequenceAnim/sjcgry.prefab');
        Game.ResLoader.BeginAssetRequest(this.lvUpRequest, delegate(this, this.onLvUpAnimLoaded));
    }

    private onLvUpAnimLoaded(request: Game.AssetRequest) {
        this.lvUpRequest = null;
        if (request.error != null) {
            uts.logWarning("loadGameObject加载失败:" + "  error:" + request.error);
            return;
        }
        this.lvUpAnimObj = new GameObjectGetSet(request.mainAsset.Instantiate(this.form.transform, false));
        this.doPlayLvUpAnim();
    }
    private doPlayLvUpAnim() {
        Game.Invoker.BeginInvoke(G.Root, 'doPlayLvUpAnim', 0.5, delegate(this, this.lateActiveLvUpAnim));
    }
    private lateActiveLvUpAnim() {
        this.lvUpAnimObj.SetActive(true);
        Game.Invoker.BeginInvoke(this.lvUpAnimObj.gameObject, '1', 0.95, delegate(this, this.onLvUpAnimExit));
    }

    private onLvUpAnimExit() {
        this.lvUpAnimObj.SetActive(false);
    }

    playQuestCompleteEffect() {
        if (null != this.completeQuestAnimObj) {
            if (!this.completeQuestAnimObj.activeSelf) {
                this.doPlayCompleteQuestAnim();
            }
            return;
        }
        if (null != this.completeQuestRequest) {
            return;
        }
        this.completeQuestRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Normal1, 'effect/sequenceAnim/rwwctx.prefab');
        Game.ResLoader.BeginAssetRequest(this.completeQuestRequest, delegate(this, this.onQuestCompleteLoaded));
    }

    private onQuestCompleteLoaded(request: Game.AssetRequest) {
        this.completeQuestRequest = null;
        if (request.error != null) {
            uts.logWarning("loadGameObject加载失败:" + "  error:" + request.error);
            return;
        }
        this.completeQuestAnimObj = new GameObjectGetSet(request.mainAsset.Instantiate(this.form.transform, false));
        this.doPlayCompleteQuestAnim();
    }

    private doPlayCompleteQuestAnim() {
        this.completeQuestAnimObj.SetActive(true);
        Game.Invoker.BeginInvoke(this.completeQuestAnimObj.gameObject, '1', 1, delegate(this, this.onQuestCompleteAnimExit));
    }

    private onQuestCompleteAnimExit() {
        this.completeQuestAnimObj.SetActive(false);
    }

    playQuestAcceptEffect() {
        if (null != this.acceptQuestAnimObj) {
            if (!this.acceptQuestAnimObj.activeSelf) {
                this.doPlayAcceptQuestAnim();
            }
            return;
        }
        if (null != this.acceptQuestRequest) {
            return;
        }
        this.acceptQuestRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Normal1, 'effect/sequenceAnim/questAccept.prefab');
        Game.ResLoader.BeginAssetRequest(this.acceptQuestRequest, delegate(this, this.onQuestAcceptLoaded));
    }

    private onQuestAcceptLoaded(request: Game.AssetRequest) {
        this.acceptQuestRequest = null;
        if (request.error != null) {
            uts.logWarning("loadGameObject加载失败:" + "  error:" + request.error);
            return;
        }
        this.acceptQuestAnimObj = new GameObjectGetSet(request.mainAsset.Instantiate(this.form.transform, false));
        this.doPlayAcceptQuestAnim();
    }

    private doPlayAcceptQuestAnim() {
        this.acceptQuestAnimObj.SetActive(true);
        Game.Invoker.BeginInvoke(this.acceptQuestAnimObj.gameObject, '1', 1, delegate(this, this.onQuestAcceptAnimExit));
    }

    private onQuestAcceptAnimExit() {
        this.acceptQuestAnimObj.SetActive(false);
    }

    playHangupEffect() {
        if (this.pathing.activeSelf) {
            this.stopPathingEffect();
            this.resumePathing = true;
        }
        this.hangup.SetActive(true);
    }

    stopHangupEffect() {
        this.hangup.SetActive(false);
        this.resumeHangup = false;
    }

    playPathingEffect() {
        if (this.hangup.activeSelf) {
            this.stopHangupEffect();
            this.resumeHangup = true;
        }
        this.pathing.SetActive(true);
        this.shoe.SetActive(G.DataMgr.heroData.level >= this.xfxLv);
    }

    stopPathingEffect() {
        this.pathing.SetActive(false);
        this.resumePathing = false;
    }

    showPetSkill(skillCfg: GameConfig.SkillConfigM, isOther: boolean) {
        let skillId = skillCfg.m_iSkillID;
        if (KeyWord.SKILL_BRANCH_WYYZ == skillCfg.m_ucSkillBranch) {
            let petId = G.DataMgr.petExpeditionData.getPetIdBySkillId(skillCfg.m_iSkillID);
            skillId = PetData.getPetConfigByPetID(petId).m_uiSkillID;
        }

        let skillImgId = Math.floor(skillId / 100);
        this.skillId = skillImgId;
        if (isOther) {
            //this.petSkillOther.show(headSprite, nameSprite);
            //this.addTimer(this.PetSkillOtherTimerKey, this.PetSkillSeconds, 1, this.onPetSkillOtherTimer); 
        } else {
            //this.petSkill.show(headSprite, nameSprite);
            this.petSkill.showHead(skillImgId);
            this.addTimer(this.PetSkillTimerKey, 0.5, 1, this.onPetShowSkillName);
        }
    }

    private onPetShowSkillName() {
        this.petSkill.showName(this.skillId);
        this.addTimer(this.PetSkillTimerKey, this.PetSkillSeconds, 1, this.onPetSkillTimer);
    }
    private onPetSkillTimer(timer: Game.Timer) {
        this.petSkill.hide(this.skillId);
    }

    showAnqiSkill(skillCfg: GameConfig.SkillConfigM) {
        let skillId = skillCfg.m_iSkillID;
        let skillImgId = Math.floor(skillId / 100);
        this.anqiSkillNode.SetActive(true);
        //暗器技能
        G.ResourceMgr.loadModel(this.anqiSkill.gameObject, UnitCtrlType.anqiskillUIEffect, skillImgId.toString(), 0);
        this.addTimer(this.anqiSkillTimerKey, 1200, 1, this.onAnqiShowSkillName);
    }

    private onAnqiShowSkillName() {
        this.anqiSkillNode.SetActive(false);
    }



    private onPetSkillOtherTimer(timer: Game.Timer) {
        this.petSkillOther.hide();
    }

    showOrHideDiGongTip(isShow: boolean) {
        if (this.diGongTip.activeSelf == isShow) {
            return;
        }
        this.diGongTip.SetActive(isShow);
        if (isShow) {
            // 隐藏伙伴提示
            this.showOrHideDiGongWyTip(false);
            this.showDots(0);
            this.addTimer(this.DiGongTipTimerKey, 1000, 0, this.onDiGongTipTimer);
        } else {
            this.removeTimer(this.DiGongTipTimerKey);
        }
    }

    private onDiGongTipTimer(timer: Game.Timer) {
        this.showDots(++this.crtDotCount % (this.DiGongTipDotCount + 1));
    }

    private showDots(count: number) {
        for (let i = 0; i < this.DiGongTipDotCount; i++) {
            this.diGongTipDots[i].SetActive(i < count);
        }
    }

    showOrHideDiGongWyTip(isShow: boolean) {
        if (this.diGongWyTip.activeSelf == isShow) {
            return;
        }
        this.diGongWyTip.SetActive(isShow);
    }

    showBuffCountDown(id: number, seconds: number) {
        if (seconds > 0) {
            this.buffId = id;
            this.buffSeconds = seconds;
            this.textBuffCountDown.text = seconds.toString();
            this.buffCountDown.SetActive(true);
            this.addTimer(this.BuffTimerKey, 1000, seconds, this.onBuffTimer);
        } else if (this.buffId == id || id == 0) {
            this.buffId = 0;
            this.buffCountDown.SetActive(false);
            this.removeTimer(this.BuffTimerKey);
        }
    }

    private onBuffTimer(timer: Game.Timer) {
        this.buffSeconds -= timer.CallCountDelta;
        if (this.buffSeconds > 0) {
            this.textBuffCountDown.text = this.buffSeconds.toString();
        } else {
            this.buffCountDown.SetActive(false);
            this.removeTimer(this.BuffTimerKey);
        }
    }

    private onFinished() {
        this.buffCountDown.SetActive(false);
    }
}