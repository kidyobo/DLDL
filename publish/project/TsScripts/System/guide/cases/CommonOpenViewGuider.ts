import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { CommonForm } from "System/uilib/CommonForm"
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'

export class CommonOpenViewGuider extends BaseGuider {
    private formClass: any;
    private formOpenId: number;
    constructor(index: number, formClass: any) {
        super(EnumGuide.CommonOpenView, index, EnumGuiderQuestRule.PauseAbsolutely, true);
        this.formClass = formClass;
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(this.formClass)];
    }

    processRequiredParams(...args) {
        if (args.length > 0) {
            this.formOpenId = args[0];
        }
    }

    protected _initSteps() {
        this._addStep(EnumGuide.CommonOpenView_OpenView, this._onStepCommonOpenView);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.CommonOpenView_OpenView;
    }

    private _onStepCommonOpenView(step: EnumGuide) {
        // 直接弹开面板
        G.Uimgr.createForm<CommonForm>(this.formClass).open(this.formOpenId);
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        // 本引导不强制执行，直接退出
        return false;
    }

    end() {
        if (EnumGuide.GuideCommon_None == this.getCrtStep()) {
            G.Uimgr.closeForm(this.formClass);
        }
    }
}