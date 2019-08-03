import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'
import { DiZheZhiLuPanel } from 'System/pinstance/selfChallenge/DiZheZhiLuPanel'
import { KeyWord } from 'System/constants/KeyWord'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'

export class QiangHuaFuBenGuider extends FunctionGuider {
    constructor(index: number) {
        super(EnumGuide.QiangHuaFuBen, index, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(PinstanceHallView)];
    }

    protected fillSteps(): void {
        this._addStep(EnumGuide.QiangHuaFuBen_OpenView, this._onStepOpenQiangHuaFuBenView);
        this._addStep(EnumGuide.QiangHuaFuBen_ClickEnter, this._onStepClickEnter);
    }

    private _onStepOpenQiangHuaFuBenView(step: EnumGuide) {
        // 先检查是否已打开PinstanceHallView
        //let pinstanceHallView = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
        //if (pinstanceHallView != null) {
        //    // 已经打开PinstanceHallView了，确保打开强化页签
        //    pinstanceHallView.switchTabFormById(KeyWord.OTHER_FUNCTION_SHMJ);
        //} else {
        //    if (this.skipGuideActIcon) {
        //        G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_SHMJ);
        //    } else {
        //        this.guideOnActBtn(KeyWord.ACT_FUNC_PINSTANCEHALL);
        //    }
        //}
        G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_DZZL);
    }

    private _onStepClickEnter(step: EnumGuide): void {
        let panel = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView).getTabFormByID(KeyWord.OTHER_FUNCTION_DZZL) as DiZheZhiLuPanel;
        let item = panel.getItem();
        if (null != item) {
            // 如果有这个diff的item，就直接指上去，没有的话就等
            this.onItemShowUp(item);
        }
    }

    onItemShowUp(item: UnityEngine.GameObject) {
        if (EnumGuide.QiangHuaFuBen_ClickEnter == this.getCrtStep()) {
            G.ViewCacher.functionGuideView.guideOn(item, EnumGuideArrowRotation.right, { x: 200, y: -335 });
        } 
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.QiangHuaFuBen_OpenView == step) {
            G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_DZZL);
            return true;
        } else if (EnumGuide.QiangHuaFuBen_ClickEnter == step) {
            let panel = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView).getTabFormByID(KeyWord.OTHER_FUNCTION_DZZL) as DiZheZhiLuPanel;
            if (null != panel) {
                return panel.force(this.type, step);
            }
        }
        return false;
    }
}