import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule, EnumStoreID, EnumImageID } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { KeyWord } from 'System/constants/KeyWord'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { Macros } from 'System/protocol/Macros'
import { ThingData } from 'System/data/thing/ThingData'
import { WelcomeView } from 'System/welcome/WelcomeView'

 /**
 * 欢迎引导。
 */
export class WelcomeGuider extends BaseGuider {

    private confirmId = 0;

    constructor() {
        super(EnumGuide.Welcome, 0, EnumGuiderQuestRule.PauseAbsolutely, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(WelcomeView)];
    }

    processRequiredParams() {

    }

    protected _initSteps() {
        this._addStep(EnumGuide.Welcome_OpenView, this._onStepOpenView);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.Welcome_OpenView;
    }

    private _onStepOpenView(step: EnumGuide) {
        G.Uimgr.createForm<WelcomeView>(WelcomeView).open();
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        // 本引导不强制执行，直接退出
        return false;
    }

    end() {
        if (EnumGuide.GuideCommon_None == this.getCrtStep()) {
            G.Uimgr.closeForm(WelcomeView);
        }
    }
}