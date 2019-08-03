import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule, EnumStoreID, EnumImageID } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { KeyWord } from 'System/constants/KeyWord'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { Macros } from 'System/protocol/Macros'
import { ThingData } from 'System/data/thing/ThingData'
import { PrivilegeOverdueView } from 'System/guide/PrivilegeOverdueView'

 /**
 * 特权卡过期引导。
 */
export class PrivilegeOverdueGuider extends BaseGuider {
    constructor() {
        super(EnumGuide.PrivilegeOverdue, 0, EnumGuiderQuestRule.PauseAbsolutely, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(PrivilegeOverdueView)];
    }

    processRequiredParams() {
    }

    protected _initSteps() {
        this._addStep(EnumGuide.PrivilegeOverdue_OpenOverduePanel, this._onStepOpenOverdue);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.PrivilegeOverdue_OpenOverduePanel;
    }

    private _onStepOpenOverdue(step: EnumGuide) {
        let level = G.DataMgr.heroData.privilegeOverdueLv;
        if (level > 0) {
            G.Uimgr.createForm<PrivilegeOverdueView>(PrivilegeOverdueView).open(level);
            G.DataMgr.heroData.privilegeOverdueLv = 0;
            this.onGuideStepFinished(step);
        } else {
            G.GuideMgr.cancelGuide(this.type);
        }
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        // 本引导不强制执行，直接退出
        return false;
    }

    end() {
        if (EnumGuide.GuideCommon_None == this.getCrtStep()) {
            G.Uimgr.closeForm(PrivilegeOverdueView);
        }
    }
}