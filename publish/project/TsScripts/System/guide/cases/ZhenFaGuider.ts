import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { FunctionGuider } from 'System/guide/cases/FunctionGuider';
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView';
import { HeroView } from 'System/hero/view/HeroView';
import { ZhenFaView } from "System/hero/view/ZhenFaView";

/**魔瞳引导 */
export class ZhenFaGuider extends FunctionGuider {

    constructor() {
        super(EnumGuide.ZhenFaActive, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(HeroView)];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.ZhenFaActive_OpenView, this._onStepClickAction);
        this._addStep(EnumGuide.ZhenFaActive_ClickPanelBtn, this._onStepClickPanelBtn);
        this._addStep(EnumGuide.ZhenFaActive_ClickClose, this._onStepClickClose);
        this.m_activeFrame = EnumGuide.HunGuActive_ClickAction;
    }
    private _onStepClickAction(step: EnumGuide) {
        let view = G.Uimgr.getForm<HeroView>(HeroView);
        if (view != null) {
            view.switchTabFormById(KeyWord.HERO_SUB_TYPE_FAZHEN);
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
            view.open(KeyWord.HERO_SUB_TYPE_FAZHEN);
        } 
    }

    private _onStepClickPanelBtn(step: EnumGuide) {
        let view = G.Uimgr.getForm<HeroView>(HeroView);
        if (view != null) {
            let panel = view.getTabFormByID(KeyWord.HERO_SUB_TYPE_FAZHEN) as ZhenFaView;
            if (panel != null && panel.isOpened) {
                G.ViewCacher.functionGuideView.guideOn(panel.btnBegin, EnumGuideArrowRotation.left, { x: 24, y: 0 });
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
        if (step == EnumGuide.ZhenFaActive_OpenView) {
            G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.HERO_SUB_TYPE_FAZHEN)
            return true;
        }
        else if (step == EnumGuide.ZhenFaActive_ClickPanelBtn) {
            let view = G.Uimgr.getForm<HeroView>(HeroView);
            if (null != view) {
                let panel = view.getTabFormByID(KeyWord.HERO_SUB_TYPE_FAZHEN) as ZhenFaView;
                if (panel != null && panel.isOpened) {
                    panel.onBeginClick();
                    return true;
                }
            }
        }
        else if (step == EnumGuide.ZhenFaActive_ClickClose) {
            let view = G.Uimgr.getForm<HeroView>(HeroView);
            if (null != view) {
                view.close();
                return true;
            }
        } 
        return false;
    }
}