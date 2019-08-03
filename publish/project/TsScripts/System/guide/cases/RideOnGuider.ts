import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { RideOnGuideView } from 'System/guide/RideOnGuideView'

export class RideOnGuider extends BaseGuider {

    constructor() {
        super(EnumGuide.RideOn, 0, EnumGuiderQuestRule.PauseAbsolutely, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return null;
    }

    processRequiredParams() {
    }

    protected _initSteps(): void {
        this._addStep(EnumGuide.RideOn_OpenView, this._onStepOpenView);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.RideOn_OpenView;
    }

    private _onStepOpenView(step: EnumGuide): void {
        // 直接弹开面板
        G.Uimgr.createForm<RideOnGuideView>(RideOnGuideView).open();
    }

    end(): void {
        G.Uimgr.closeForm(RideOnGuideView);
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        return true;
    }
}
