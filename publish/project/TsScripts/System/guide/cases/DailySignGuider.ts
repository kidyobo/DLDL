import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { FuLiDaTingView } from 'System/activity/fldt/FuLiDaTingView'
import { KeyWord } from 'System/constants/KeyWord'

export class DailySignGuider extends BaseGuider {
    constructor() {
        super(EnumGuide.DailySign, 0, EnumGuiderQuestRule.PauseAbsolutely, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(FuLiDaTingView)];
    }

    processRequiredParams() {
    }

    protected _initSteps() {
        this._addStep(EnumGuide.DailySign_OpenDailySign, this._onStepOpenDailySign);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.DailySign_OpenDailySign;
    }

    private _onStepOpenDailySign(step: EnumGuide) {
        G.Uimgr.createForm<FuLiDaTingView>(FuLiDaTingView).open(KeyWord.OTHER_FUNCTION_MRQD);
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.GuideCommon_None == step) {
            G.Uimgr.closeForm(FuLiDaTingView);
        }
        return false;
    }

    end() {
    }
}