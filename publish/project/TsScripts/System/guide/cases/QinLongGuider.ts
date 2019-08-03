import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { FunctionGuider } from 'System/guide/cases/FunctionGuider';
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView';
import { HeroView } from 'System/hero/view/HeroView';
import { MagicCubeView } from 'System/magicCube/MagicCubeView';

/**控鹤擒龙引导 */
export class QinLongGuider extends FunctionGuider {

    constructor() {
        super(EnumGuide.QinLongActive, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(HeroView)];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.QinLongActive_OpenView, this._onStepClickAction);
        this._addStep(EnumGuide.QinLongActive_ClickPanelBtn, this._onStepClickPanelBtn);
        this._addStep(EnumGuide.QinLongActive_ClickClose, this._onStepClickClose);
    }
    private _onStepClickAction(step: EnumGuide) {
        let view = G.Uimgr.getForm<HeroView>(HeroView);
        if (view != null) {
            view.switchTabFormById(KeyWord.OTHER_FUNCTION_MAGICCUBE);
        } else {
            G.MainBtnCtrl.update(true);
            if (G.MainBtnCtrl.IsOpened) {
                G.ViewCacher.functionGuideView.guideOn(
                    G.MainBtnCtrl.getFuncBtn(KeyWord.BAR_FUNCTION_ROLE),
                    EnumGuideArrowRotation.left,
                    { x: 20, y: 0 },
                    [], true,
                    { x: 0, y: 0 },
                    { x: 70, y: 70 }
                );
            } else {
                G.MainBtnCtrl.onClickBtnSwitcher();
                G.ViewCacher.functionGuideView.guideOn(
                    G.MainBtnCtrl.getFuncBtn(KeyWord.BAR_FUNCTION_ROLE),
                    EnumGuideArrowRotation.left,
                    { x: 20, y: 0 },
                    [], true,
                    { x: 0, y: 0 },
                    { x: 70, y: 70 }
                );
            }
        }
    }
    private _onStepOpenPanel(step: EnumGuide) {
        let view = G.Uimgr.getForm<HeroView>(HeroView);
        if (view != null) {
            view.switchTabFormById(KeyWord.OTHER_FUNCTION_MAGICCUBE);
        } 
    }

    private _onStepClickPanelBtn(step: EnumGuide) {
        let view = G.Uimgr.getForm<HeroView>(HeroView);
        if (view != null) {
            let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_MAGICCUBE) as MagicCubeView;
            if (panel != null && panel.isOpened) {
                G.ViewCacher.functionGuideView.guideOn(panel.btnStart, EnumGuideArrowRotation.left, { x: 0, y: 0 });
            }
        } 
    }

    private _onStepClickClose(step: EnumGuide) {
        let view = G.Uimgr.getForm<HeroView>(HeroView);
        if (view != null && view.isOpened) {
            this.guideOnBtnReturn(view.btnReturn);
        }
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (step == EnumGuide.QinLongActive_OpenView) {
            G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.OTHER_FUNCTION_MAGICCUBE)
            return true;
        }
        else if (step == EnumGuide.QinLongActive_ClickPanelBtn) {
            let view = G.Uimgr.getForm<HeroView>(HeroView);
            if (null != view) {
                let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_MAGICCUBE) as MagicCubeView;
                if (panel != null && panel.isOpened) {
                    panel.onBtnStart();
                    return true;
                }
            }
        }
        else if (step == EnumGuide.QinLongActive_ClickClose) {
            let view = G.Uimgr.getForm<HeroView>(HeroView);
            if (null != view) {
                view.close();
                return true;
            }
        } 
        return false;
    }
}