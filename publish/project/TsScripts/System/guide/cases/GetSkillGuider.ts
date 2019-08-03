import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { SkillUnlockView } from 'System/guide/SkillUnlockView'

export class GetSkillGuider extends BaseGuider {
    private skillIds: number[] = [];

    constructor() {
        super(EnumGuide.GetSkill, 0, EnumGuiderQuestRule.PauseAbsolutely, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return null;
    }

    processRequiredParams(skillIds: number[]) {
        for (let id of skillIds) {
            if (this.skillIds.indexOf(id) >= 0) {
                continue;
            }
            this.skillIds.push(id);
        }
    }

    protected _initSteps(): void {
        this._addStep(EnumGuide.GetSkill_OpenView, this._onStepOpenView);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.GetSkill_OpenView;
    }

    private _onStepOpenView(step: EnumGuide): void {
        // 直接弹开面板
        G.Uimgr.createForm<SkillUnlockView>(SkillUnlockView).open();
    }

    end(): void {
        G.Uimgr.closeForm(SkillUnlockView);
        this.skillIds.length = 0;
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        return true;
    }

    getNextSkillId(): number {
        if (this.skillIds.length > 0) {
            return this.skillIds.pop();
        }
        return 0;
    }
}
