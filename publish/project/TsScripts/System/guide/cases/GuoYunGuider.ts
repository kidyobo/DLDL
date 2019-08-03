import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { BoatView } from 'System/activity/view/BoatView'
import { KeyWord } from 'System/constants/KeyWord'

export class GuoYunGuider extends BaseGuider {
    constructor() {
        super(EnumGuide.GuoYun, 0, EnumGuiderQuestRule.NoPause, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(BoatView)];
    }

    processRequiredParams() {
    }

    protected _initSteps(): void {
        this._addStep(EnumGuide.GuoYun_Active, this._onStepActive);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.GuoYun_Active;
    }

    private _onStepActive(step: EnumGuide) {
        this.onGuideStepFinished(step);
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    end() {
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.GuideCommon_None == step) {
            let view = G.Uimgr.getForm<BoatView>(BoatView);
            if (null != view) {
                return view.force(this.type, step);
            }
        }
        return false;
    }
}