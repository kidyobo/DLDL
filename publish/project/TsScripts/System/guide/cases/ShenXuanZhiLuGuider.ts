import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'
import { ShenXuanZhiLuPanel } from 'System/pinstance/hall/ShenXuanZhiLuPanel'
import { KeyWord } from 'System/constants/KeyWord'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'

export class ShenXuanZhiLuGuider extends FunctionGuider {


    constructor() {
        super(EnumGuide.ShenXuan, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(PinstanceHallView)];
    }

    protected fillSteps(): void {
        this._addStep(EnumGuide.ShenXuan_OpenPinstanceHallView, this._onStepOpenShenXuanZhiLu);
        this._addStep(EnumGuide.ShenXuan_ClickEnter, this._onStepClickEnter);
        this.m_activeFrame = EnumGuide.ShenXuan_OpenPinstanceHallView;
    }

    private _onStepOpenShenXuanZhiLu(step: EnumGuide) {
        // 先检查是否已打开PinstanceHallView
        let pinstanceHallView = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
        if (pinstanceHallView != null) {
            // 已经打开PinstanceHallView了，确保打开强化页签
            pinstanceHallView.switchTabFormById(KeyWord.OTHER_FUNCTION_SXZL);
        } else {
            this.guideOnActBtn(KeyWord.ACT_FUNC_PINSTANCEHALL);
        }
    }

    private _onStepClickEnter(step: EnumGuide) {
        let panel = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView).getTabFormByID(KeyWord.OTHER_FUNCTION_SXZL) as ShenXuanZhiLuPanel;
        if (panel != null) {
            let item = panel.btnEnter;
            if (null != item) {
                G.ViewCacher.functionGuideView.guideOn(item, EnumGuideArrowRotation.left, { x: -120, y: 0 });
            }
        }
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.ShenXuan_OpenPinstanceHallView == step) {
            G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_SXZL);
            return true;
        } else if (EnumGuide.ShenXuan_ClickEnter == step) {
            let view = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
            if (null != view) {
                let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_SXZL) as ShenXuanZhiLuPanel;
                if (panel != null && panel.isOpened) {
                    panel.onEnterPinstance();
                    return true;
                }
            }
        }
        return false;
    }
}