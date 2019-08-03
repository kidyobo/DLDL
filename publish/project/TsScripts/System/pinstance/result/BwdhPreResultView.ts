import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { UILayer } from "System/uilib/CommonForm";
import { NestedForm } from "System/uilib/NestedForm";
import { UIUtils } from "System/utils/UIUtils";
import { BwdhStars } from 'System/kfjdc/view/BwdhStars'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KfjdcData } from 'System/data/KfjdcData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'

export class BwdhPreResultView extends NestedForm {

    private readonly StarsCnt = 10;

    private panelBack: UnityEngine.GameObject;

    private titleSuccess: UnityEngine.GameObject;
    private titleFail: UnityEngine.GameObject;
    private animSuccess: UnityEngine.GameObject;

    private stage: UnityEngine.GameObject;
    private stars = new BwdhStars();
    private stageEffect: UnityEngine.GameObject;
    private upEffect: UnityEngine.GameObject;

    private xjbh: UnityEngine.UI.Text;
    private textCrtScore: UnityEngine.UI.Text;
    private changedStars: UnityEngine.GameObject;
    private changedStarsArr: UnityEngine.GameObject[] = [];
    private starArrow: UnityEngine.GameObject;

    private dwbh: UnityEngine.UI.Text;
    private textStage0: UnityEngine.UI.Text;
    private stageArrow: UnityEngine.GameObject;
    private textStage1: UnityEngine.UI.Text;

    private hdjl: UnityEngine.GameObject;
    private rewardList: List;
    private icons: IconItem[] = [];

    private btnOk: UnityEngine.GameObject;

    private resultInfo: Protocol.SinglePVPReward;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Result;
    }

    protected resPath(): string {
        return UIPathData.BwdhPreResultView;
    }

    protected initElements() {
        this.panelBack = this.elems.getElement('bg');
        this.titleSuccess = this.elems.getElement('titleSuccess');
        this.titleFail = this.elems.getElement('titleFail');
        this.animSuccess = this.elems.getElement('animSuccess');

        this.stage = this.elems.getElement('stage');
        this.stageEffect = this.elems.getElement('stageEffect');
        this.upEffect = this.elems.getElement('upEffect');
        this.upEffect.SetActive(false );
        let bigStage = this.elems.getImage('bigStage');
        let smallStage = this.elems.getImage('smallStage');

        let bigStageAltas = this.elems.getElement('bigStageAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        let smallStageAltas = this.elems.getElement('smallStageAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this.stars.setComponents(this.elems.getElement('stars5'), this.elems.getElement('stars4'), this.elems.getElement('stars3'),
            bigStage, smallStage, bigStageAltas, smallStageAltas, this.elems.getElement('final'));

        this.xjbh = this.elems.getText('xjbh');
        this.changedStars = this.elems.getElement('changedStars');
        for (let i = 0; i < this.StarsCnt; i++) {
            this.changedStarsArr.push(ElemFinder.findObject(this.changedStars, i.toString()));
        }
        this.textCrtScore = this.elems.getText('textCrtScore');
        this.starArrow = this.elems.getElement('starArrow');

        this.dwbh = this.elems.getText('dwbh');
        this.textStage0 = this.elems.getText('stage0');
        this.stageArrow = this.elems.getElement('stageArrow');
        this.textStage1 = this.elems.getText('stage1');

        this.hdjl = this.elems.getElement('hdjl');
        this.rewardList = this.elems.getUIList('rewardList');

        this.btnOk = this.elems.getElement('btnOk');
    }

    protected initListeners() {
        this.addClickListener(this.btnOk, this.onClickBtnOk);
    }

    open(result: Protocol.SinglePVPReward) {
        this.resultInfo = result;
        super.open();
    }
    protected onOpen() {
        let isSuccess = 1 == this.resultInfo.m_ucResult;
        UIUtils.setGrey(this.panelBack, !isSuccess, false, false);

        // 结果
        this.titleSuccess.SetActive(this.resultInfo.m_ucResult == 1);
        this.titleFail.SetActive(this.resultInfo.m_ucResult != 1);
        //this.animSuccess.SetActive(isSuccess);

        let maxGrade = KfjdcData.RANK_DESC_LIST.length;

        let gradeScoreInfo = this.resultInfo.m_stGradeScoreInfo;
        let newGrade: number = gradeScoreInfo.m_uiNewGrade;
        let oldGrade: number = gradeScoreInfo.m_uiOldGrade;
        let newScore: number = gradeScoreInfo.m_uiNewScore;
        let oldScore: number = gradeScoreInfo.m_uiOldScore;

        this.stars.setGrade(oldGrade, oldScore);
        if (newGrade == oldGrade) {
            // 没有升降阶
            this.stageEffect.SetActive(false)

            if (newGrade < maxGrade) {
                // 显示星星
                this.stars.setScore(oldScore, newScore, gradeScoreInfo.m_ucNewScoreMax);
            } else {
                // 显示积分
                this.stars.setGrade(newGrade, newScore);
            }
        } else if (newGrade > oldGrade) {
            // 升阶
            this.stars.setScore(oldScore, gradeScoreInfo.m_ucOldScoreMax, gradeScoreInfo.m_ucOldScoreMax);
            this.stageEffect.SetActive(true);
            this.upEffect.SetActive(true);

            Game.Invoker.BeginInvoke(this.stageEffect, 'starEffect', 1, delegate(this, this.onStarEffectEnd, gradeScoreInfo));
        } else {
            // 降阶
            if (oldGrade < maxGrade) {
                // 从王者争霸降下来，原来没有星星只有积分，故不需要星星
                this.stars.setScore(oldScore, gradeScoreInfo.m_uiOldScore, gradeScoreInfo.m_ucOldScoreMax);
            }
            Game.Invoker.BeginInvoke(this.stageEffect, 'stageEffect', 1, delegate(this, this.onStageEffectEnd, gradeScoreInfo));
        }

        //达到顶级，显示积分
        if (newGrade >= maxGrade) {
            // 已到顶级称号显示当前积分
            this.xjbh.text = '当前积分：';
            this.textCrtScore.text = newScore.toString();
            this.textCrtScore.gameObject.SetActive(true);
            this.changedStars.SetActive(false);
            this.starArrow.SetActive(false);
            this.stageArrow.SetActive(true);

            // 显示积分
            this.dwbh.text = '积分变化：';
            this.textStage0.text = oldScore.toString();
            this.textStage1.text = newScore.toString();
        }
        else {
            // 没到顶级称号则显示当前星级
            this.xjbh.text = '星级变化：';
            this.textCrtScore.gameObject.SetActive(false);
            let halfStarsCnt = this.StarsCnt / 2;
            for (let i = 0; i < halfStarsCnt; i++) {
                let s = this.changedStarsArr[i];
                if (i < gradeScoreInfo.m_ucOldScoreMax) {
                    UIUtils.setGrey(s, i >= oldScore);
                    s.SetActive(true);
                } else {
                    s.SetActive(false);
                }
            }
            for (let i = 0; i < halfStarsCnt; i++) {
                let s = this.changedStarsArr[i + halfStarsCnt];
                if (i < gradeScoreInfo.m_ucNewScoreMax) {
                    UIUtils.setGrey(s, i >= newScore);
                    s.SetActive(true);
                } else {
                    s.SetActive(false);
                }
            }
            this.changedStars.SetActive(true);
            this.starArrow.SetActive(true);

            // 不显示积分
            this.dwbh.text = '段位变化：';
            let oldGradeStr = KfjdcData.RANK_DESC_LIST[oldGrade - 1];
            let newGradeStr = KfjdcData.RANK_DESC_LIST[newGrade - 1];
            this.textStage0.text = oldGradeStr;
            this.textStage1.text = newGradeStr;
            this.stageArrow.SetActive(true);
        }

        //刷新奖励
        let rewards = this.resultInfo.m_stThingList;
        if (rewards.m_ucNum > 0) {
            this.hdjl.SetActive(true);
        }
        this.rewardList.Count = rewards.m_ucNum;
        let oldIconCnt = this.icons.length;
        for (let i = 0; i < rewards.m_ucNum; i++) {
            let icon: IconItem;
            if (i < oldIconCnt) {
                icon = this.icons[i];
            } else {
                this.icons[i] = icon = new IconItem();
                icon.setTipFrom(TipFrom.normal);
                icon.setUsuallyIcon(this.rewardList.GetItem(i).gameObject);
            }
            icon.updateById(rewards.m_astThing[i].m_uiThingID, rewards.m_astThing[i].m_uiThingNum);
            icon.updateIcon();
        }
    }
    protected onClose() {
    }

    private onStarEffectEnd(gradeScoreInfo: Protocol.GradeScoreInfo) {
        this.stars.setScore(gradeScoreInfo.m_uiNewScore, gradeScoreInfo.m_uiNewScore, gradeScoreInfo.m_ucNewScoreMax);
        this.stageEffect.SetActive(true);
        Game.Invoker.BeginInvoke(this.stageEffect, 'stageEffect', 1, delegate(this, this.onStageEffectEnd, gradeScoreInfo));
    }

    private onStageEffectEnd(gradeScoreInfo: Protocol.GradeScoreInfo) {
        this.stageEffect.SetActive(false);
        this.stars.setGrade(gradeScoreInfo.m_uiNewGrade, gradeScoreInfo.m_uiNewScore);
        if (gradeScoreInfo.m_uiNewGrade < KfjdcData.RANK_DESC_LIST.length) {
            this.stars.setScore(gradeScoreInfo.m_uiNewScore, gradeScoreInfo.m_uiNewScore, gradeScoreInfo.m_ucNewScoreMax);
        } else {
            this.stars.setScore(0, 0, 0);
        }
    }

    private onClickBtnOk() {
        G.ModuleMgr.pinstanceModule.onClickQuitPinstance(true);
        this.close();
    }
}