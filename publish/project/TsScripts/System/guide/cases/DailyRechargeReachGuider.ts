import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { DailyRechargeView } from 'System/activity/view/DailyRechargeView'
import { KeyWord } from 'System/constants/KeyWord'

/**
 * 首充达成可以领奖自动弹窗指引
 */
export class DailyRechargeReachGuider extends BaseGuider {
    constructor() {
        super(EnumGuide.DailyRechargeReach, 0, EnumGuiderQuestRule.PauseAbsolutely, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(DailyRechargeView)];
    }

    processRequiredParams() {
    }

    protected _initSteps() {
        this._addStep(EnumGuide.DailyRechargeReach_OpenShouChong, this._onStepOpenShouChong);
        this.m_activeFrame = EnumGuide.DailyRechargeReach_OpenShouChong;
    }

    private _onStepOpenShouChong(step: EnumGuide) {
        if (G.DataMgr.firstRechargeData.isHasDailyRechargeCanGet() && G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_DAYRECHARGE)) {
            G.Uimgr.createForm<DailyRechargeView>(DailyRechargeView).open();
        } else {
            G.GuideMgr.cancelGuide(this.type);
        }
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        return true;
    }

    end() {
    }
}