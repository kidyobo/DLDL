import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { FirstRechargeView } from 'System/activity/view/FirstRechargeView'

/**
 * 首充达成可以领奖自动弹窗指引
 */
export class RechargeReachGuider extends BaseGuider {
    constructor() {
        super(EnumGuide.RechargeReach, 0, EnumGuiderQuestRule.PauseAbsolutely, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(FirstRechargeView)];
    }

    processRequiredParams() {
    }

    protected _initSteps() {
        this._addStep(EnumGuide.RechargeReach_OpenShouChong, this._onStepOpenShouChong);
        this.m_activeFrame = EnumGuide.RechargeReach_OpenShouChong;
    }

    private _onStepOpenShouChong(step: EnumGuide) {
        if (!G.DataMgr.firstRechargeData.isNotShowFirstRechargeIcon()) {
            G.Uimgr.createForm<FirstRechargeView>(FirstRechargeView).open();
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