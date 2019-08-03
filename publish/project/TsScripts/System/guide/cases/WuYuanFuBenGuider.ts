import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'
import { WuYuanFuBenPanel } from 'System/pinstance/selfChallenge/WuYuanFuBenPanel'
import { KeyWord } from 'System/constants/KeyWord'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'

export class WuYuanFuBenGuider extends FunctionGuider {
    private diff: number = 1;
    private skipGuideActIcon = false;

    constructor(diff: number = 1, skipGuideActIcon: boolean = false) {
        super(EnumGuide.HuoBanFuBen, 0, true);
        this.diff = diff;
        this.skipGuideActIcon = skipGuideActIcon;
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(PinstanceHallView)];
    }

    protected fillSteps(): void {
        this._addStep(EnumGuide.HuoBanFuBen_OpenPinstanceHallView, this._onStepOpenWuYuanFuBen);
        this._addStep(EnumGuide.HuoBanFuBen_OpenHuoBanFuBenPanel, this._onStepOpenHuoBanFuBenPanel);
        this._addStep(EnumGuide.HuoBanFuBen_ClickEnter, this._onStepClickEnter);
        this.m_activeFrame = EnumGuide.HuoBanFuBen_OpenPinstanceHallView;
    }

    private _onStepOpenWuYuanFuBen(step: EnumGuide) {
        // 先检查是否已打开PinstanceHallView
        let pinstanceHallView = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
        if (pinstanceHallView != null) {
            // 已经打开PinstanceHallView了，确保打开强化页签
            pinstanceHallView.switchTabFormById(KeyWord.OTHER_FUNCTION_WYFB, this.diff);
        } else {
            if (this.skipGuideActIcon) {
                G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_WYFB, this.diff);
            } else {
                this.guideOnActBtn(KeyWord.ACT_FUNC_PINSTANCEHALL);
            }
        }
    }

    private _onStepOpenHuoBanFuBenPanel(step: EnumGuide) {
        let view = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
        if (view != null) {
            view.switchTabFormById(KeyWord.OTHER_FUNCTION_WYFB, this.diff);
        }
    }

    private _onStepClickEnter(step: EnumGuide) {
        let panel = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView).getTabFormByID(KeyWord.OTHER_FUNCTION_WYFB) as WuYuanFuBenPanel;
        //let item = panel.getItem(this.diff);
        if (panel != null) {
            let item = panel.getButton();
            if (null != item) {
                // 如果有这个diff的item，就直接指上去，没有的话就等
                G.ViewCacher.functionGuideView.guideOn(item, EnumGuideArrowRotation.left, { x: -60, y: 0 });
            }
        }
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.HuoBanFuBen_OpenPinstanceHallView == step) {
            G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_WYFB, this.diff);
            return true;
        } else if (EnumGuide.HuoBanFuBen_ClickEnter == step) {
            let view = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
            if (null != view) {
                let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_WYFB) as WuYuanFuBenPanel;
                if (panel != null && panel.isOpened) {
                    return panel.force(this.type, step, this.diff);
                }
            }
        }
        return false;
    }
}