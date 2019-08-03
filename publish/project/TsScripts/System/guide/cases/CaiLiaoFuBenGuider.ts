import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'
import { CaiLiaoFuBenPanel } from 'System/pinstance/selfChallenge/CaiLiaoFuBenPanel'
import { KeyWord } from 'System/constants/KeyWord'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'

export class CaiLiaoFuBenGuider extends FunctionGuider {
    private diff: number = 0;
    private skipGuideActIcon = false;

    constructor(diff: number, skipGuideActIcon: boolean) {
        super(EnumGuide.CaiLiaoFuBen, diff, true);
        this.diff = diff;
        this.skipGuideActIcon = skipGuideActIcon;
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(PinstanceHallView)];
    }

    protected fillSteps(): void {
        this._addStep(EnumGuide.CaiLiaoFuBen_OpenCaiLiaoFuBen, this._onStepOpenCaiLiaoFuBen);
        this._addStep(EnumGuide.CaiLiaoFuBen_ClickEnter, this._onStepClickEnter);
    }

    private _onStepOpenCaiLiaoFuBen(step: EnumGuide) {
        // 先检查是否已打开PinstanceHallView
        let pinstanceHallView = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
        if (pinstanceHallView!=null) {
            // 已经打开PinstanceHallView了，确保打开强化页签
            pinstanceHallView.switchTabFormById(KeyWord.OTHER_FUNCTION_CLFB, this.diff);
        } else {
            if (this.skipGuideActIcon) {
                G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_CLFB, this.diff);
            } else {
                this.guideOnActBtn(KeyWord.ACT_FUNC_PINSTANCEHALL);
            }
        }
    }

    private _onStepClickEnter(step: EnumGuide): void {
        let panel = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView).getTabFormByID(KeyWord.OTHER_FUNCTION_CLFB) as CaiLiaoFuBenPanel;

        G.ViewCacher.functionGuideView.guideOn(panel.btn_enterFuBen, EnumGuideArrowRotation.top, { x: 0, y: 30 });
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.CaiLiaoFuBen_OpenCaiLiaoFuBen == step) {
            G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_CLFB, this.diff);
            return true;
        } else if (EnumGuide.CaiLiaoFuBen_ClickEnter == step) {
            let panel = G.Uimgr.getSubFormByID<CaiLiaoFuBenPanel>(PinstanceHallView, KeyWord.OTHER_FUNCTION_CLFB);
            if (null != panel) {
                return panel.force(this.type, step, this.diff);
            }
        }
        return false;
    }
}