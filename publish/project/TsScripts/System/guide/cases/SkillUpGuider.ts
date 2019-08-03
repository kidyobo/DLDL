import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { SkillView } from 'System/skill/view/SkillView'
import { BasicSkillPanel } from 'System/skill/view/BasicSkillPanel'

export class SkillUpGuider extends FunctionGuider {
    constructor() {
        super(EnumGuide.SkillUp, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(SkillView)];
    }

    processRequiredParams() {
    }

    protected fillSteps() {
        //this._addStep(EnumGuide.FunctionGuide_OpenMainFuncBar, this._onStepOpenMainFuncBar);
        this._addStep(EnumGuide.SkillUp_ClickSkill, this._onStepClickSkill);
        this._addStep(EnumGuide.SkillUp_ClickUp, this._onStepClickUp);
        this._addStep(EnumGuide.SkillUp_ClickClose, this._onStepClickClose);
    }

    private _onStepOpenMainFuncBar(step: EnumGuide) {
        this.doGuideOpenMainFuncBar(step, SkillView);
    }

    private _onStepClickSkill(step: EnumGuide): void {
        //// 先检查是否已打开SkillView
        //let skillView = G.Uimgr.getForm<SkillView>(SkillView);
        //if (skillView!=null) {
        //    this.onGuideStepFinished(step);
        //} else {
        //    // 没有打开则引导点击技能按钮
        //    this.guideOnMainFuncBtn(KeyWord.BAR_FUNCTION_SKILL);
        //}

        G.Uimgr.createForm<SkillView>(SkillView).open();
    }

    private _onStepClickUp(step: EnumGuide): void {
        let view = G.Uimgr.getSubFormByID<BasicSkillPanel>(SkillView, KeyWord.OTHER_FUNCTION_SKILL_BASIC);
        if (null != view) {
            let selectedIcon = view.getSelectedIcon();
            //let focusTargets = [view.rightGo];
            let focusTargets = null;
            if (null != selectedIcon) {
                focusTargets = [selectedIcon];
            } 
            G.ViewCacher.functionGuideView.guideOn(view.BT_UpgradeAll, EnumGuideArrowRotation.top, { x: 0, y: 30 }, focusTargets);
        }
    }

    private _onStepClickClose(step: EnumGuide): void {
        this.guideOnBtnReturn(G.Uimgr.getForm<SkillView>(SkillView).btnReturn);
    }

    protected _forceStep(step: EnumGuide): boolean {
        let view = G.Uimgr.getForm<SkillView>(SkillView);
        if (null != view) {
            if (EnumGuide.SkillUp_ClickUp == step) {
                let basicPanel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_SKILL_BASIC) as BasicSkillPanel;
                if (null != basicPanel && basicPanel.isOpened) {
                    return basicPanel.force(this.type, step);
                }
            } else if (EnumGuide.SkillUp_ClickClose == step) {
                return view.force(this.type, step);
            }
        }
        return false;
    }
}