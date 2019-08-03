import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { JuYuanView } from 'System/juyuan/JuYuanView'

export class JuYuanGuider extends FunctionGuider {
    constructor() {
        super(EnumGuide.JuYuan, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(JuYuanView)];
    }

    processRequiredParams() {
    }

    protected fillSteps() {
        //this._addStep(EnumGuide.FunctionGuide_OpenMainFuncBar, this._onStepOpenMainFuncBar);
        this._addStep(EnumGuide.JuYuan_ClickJuYuan, this._onStepClickJuYuan);
        this._addStep(EnumGuide.JuYuan_ClickUp, this._onStepClickUp);
        this._addStep(EnumGuide.JuYuan_ClickClose, this._onStepClickClose);
    }

    private _onStepOpenMainFuncBar(step: EnumGuide) {
        this.doGuideOpenMainFuncBar(step, JuYuanView);
    }

    private _onStepClickJuYuan(step: EnumGuide): void {
        //let juYuanView = G.Uimgr.getForm<JuYuanView>(JuYuanView);
        //// 先检查是否已打开EquipView
        //if (juYuanView!=null) {
        //    // 已经打开EquipView了，确保打开强化页签
        //    this.onGuideStepFinished(EnumGuide.JuYuan_ClickJuYuan);
        //} else {
        //    // 没有打开则引导点击神力按钮
        //    this.guideOnMainFuncBtn(KeyWord.BAR_FUNCTION_JU_YUAN);
        //}

        G.Uimgr.createForm<JuYuanView>(JuYuanView).open();
    }

    private _onStepClickUp(step: EnumGuide): void {
        let view = G.Uimgr.getForm<JuYuanView>(JuYuanView);
        G.ViewCacher.functionGuideView.guideOn(view.btn_break, EnumGuideArrowRotation.top, { x: 0, y: 30 });

    }

    private _onStepClickClose(step: EnumGuide): void {
        this.guideOnBtnReturn(G.Uimgr.getForm<JuYuanView>(JuYuanView).btn_close);
    }

    protected _forceStep(step: EnumGuide) {
        if (EnumGuide.JuYuan_ClickUp == step || EnumGuide.JuYuan_ClickClose == step) {
            let view = G.Uimgr.getForm<JuYuanView>(JuYuanView);
            if (null != view) {
                return view.force(this.type, step);
            }
        }
        return false;
    }
}