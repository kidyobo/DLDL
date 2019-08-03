import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { FunctionGuider } from 'System/guide/cases/FunctionGuider';
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView';

/**战力卡点提示引导 */
export class FightTipGuider extends FunctionGuider {
    private funcName: number = 0;
    constructor(index: number, funcName: number) {
        super(EnumGuide.FightTip, index, true);
        this.funcName = funcName;
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.FightTip_ClickTask, this._onStepClickAction);//点击主界面世界Boss按钮，这个会打开个人boss面板
    }
    private _onStepClickAction(step: EnumGuide) {
        G.GuideMgr.processGuideNext(EnumGuide.FightTip, EnumGuide.FightTip_ClickTask);

        let qid: number = G.DataMgr.funcLimitData.getFuncLimitConfig(this.funcName).m_ucAcceptQuest;
        if (G.DataMgr.questData.isQuestInDoingList(qid)) {
            G.ViewCacher.mainView.taskTrackList.guideOnQuest(qid);
        } 
    }

    protected _forceStep(step: EnumGuide): boolean {
        return false;
    }
}