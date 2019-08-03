import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'
import { JuQingFuBenPanel } from 'System/pinstance/hall/JuQingFuBenPanel'
import { KeyWord } from 'System/constants/KeyWord'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'

export class JuQingFuBenGuider extends FunctionGuider {
    private layer: number = 0;
    private skipGuideActIcon = false;

    constructor(layer: number, skipGuideActIcon: boolean) {
        super(EnumGuide.JuQingFuBen, layer, true);
        this.layer = layer;
        this.skipGuideActIcon = skipGuideActIcon;
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(PinstanceHallView)];
    }

    protected fillSteps(): void {
        this._addStep(EnumGuide.JuQingFuBen_OpenJuQingFuBen, this._onStepOpenJuQingFuBen);
        this._addStep(EnumGuide.JuQingFuBen_ClickEnter, this._onStepClickEnter);
    }

    private _onStepOpenJuQingFuBen(step: EnumGuide) {
        // 先检查是否已打开PinstanceHallView
        let pinstanceHallView = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
        if (pinstanceHallView!=null) {
            // 已经打开PinstanceHallView了，确保打开强化页签
            pinstanceHallView.switchTabFormById(KeyWord.OTHER_FUNCTION_JQFB);
        } else {
            if (this.skipGuideActIcon) {
                G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_JQFB, this.layer);
            } else {
                this.guideOnActBtn(KeyWord.ACT_FUNC_PINSTANCEHALL);
            }
        }
    }

    private _onStepClickEnter(step: EnumGuide): void {
        let panel = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView).getTabFormByID(KeyWord.OTHER_FUNCTION_JQFB) as JuQingFuBenPanel;

        G.ViewCacher.functionGuideView.guideOn(panel.getItem(this.layer), EnumGuideArrowRotation.right, { x: 200, y: -335 });
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.JuQingFuBen_OpenJuQingFuBen == step) {
            G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_JQFB, this.layer);
            return true;
        } else if (EnumGuide.JuQingFuBen_ClickEnter == step) {
            let panel = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView).getTabFormByID(KeyWord.OTHER_FUNCTION_JQFB) as JuQingFuBenPanel;
            if (null != panel) {
                return panel.force(this.type, step, this.layer);
            }
        }
        return false;
    }
}