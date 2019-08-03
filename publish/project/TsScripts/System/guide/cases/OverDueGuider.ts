import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule, EnumStoreID, EnumImageID } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { KeyWord } from 'System/constants/KeyWord'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { Macros } from 'System/protocol/Macros'
import { ThingData } from 'System/data/thing/ThingData'
import { LingBaoOverDueView } from 'System/lingbaoguoqi/LingBaoOverDueView'

 /**
 * 精灵过期的引导。
 */
export class OverDueGuider extends BaseGuider {

    constructor() {
        super(EnumGuide.OverDue, 0, EnumGuiderQuestRule.PauseAbsolutely, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(LingBaoOverDueView)];
    }

    processRequiredParams() {

    }

    protected _initSteps() {
        this._addStep(EnumGuide.OverDue_OpenOverDuePanel, this._onStepOpenConfirm);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.OverDue_OpenOverDuePanel;
    }

    private _onStepOpenConfirm(step: EnumGuide) {
        let overDueData = G.DataMgr.heroData.overDueData;
        G.Uimgr.createForm<LingBaoOverDueView>(LingBaoOverDueView).open(overDueData.m_stValue.m_uiLingBaoId);
        G.DataMgr.heroData.overDueData = null;
        this.onGuideStepFinished(step);
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        // 本引导不强制执行，直接退出
        return false;
    }

    end() {
    }
}