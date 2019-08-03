import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { FunctionGuider } from 'System/guide/cases/FunctionGuider';
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView';
import { HeroView } from 'System/hero/view/HeroView';
import { JiuXingView } from 'System/jiuxing/JiuXingView';

/**玄天功引导 */
export class XuanTianGongGuider extends FunctionGuider {

    constructor() {
        super(EnumGuide.XuanTianGongActive, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(HeroView)];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.XuanTianGongActive_OpenView, this._onStepClickAction);
        this._addStep(EnumGuide.XuanTianGongActive_ClickPanelBtn, this._onStepClickPanelBtn);
        this._addStep(EnumGuide.XuanTianGongActive_ClickClose, this._onStepClickClose);
        this.m_activeFrame = EnumGuide.XuanTianGongActive_OpenView;
    }
    private _onStepClickAction(step: EnumGuide) {
        let view = G.Uimgr.getForm<HeroView>(HeroView);
        if (view != null) {
            view.switchTabFormById(KeyWord.BAR_FUNCTION_JIUXING);
        } else {
            G.MainBtnCtrl.update(true);
            if (!G.MainBtnCtrl.IsOpened) {
                G.MainBtnCtrl.onClickBtnSwitcher();
            }
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
    private _onStepOpenPanel(step: EnumGuide) {
        let view = G.Uimgr.getForm<HeroView>(HeroView);
        if (view != null) {
            view.open(KeyWord.BAR_FUNCTION_JIUXING);
        } 
    }

    private _onStepClickPanelBtn(step: EnumGuide) {
        let view = G.Uimgr.getForm<HeroView>(HeroView);
        if (view != null) {
            let panel = view.getTabFormByID(KeyWord.BAR_FUNCTION_JIUXING) as JiuXingView;
            if (panel != null && panel.isOpened) {
                G.ViewCacher.functionGuideView.guideOn(panel.m_btnEnhance, EnumGuideArrowRotation.left, { x: 0, y: 0 });
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
        if (step == EnumGuide.XuanTianGongActive_OpenView) {
            G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.BAR_FUNCTION_JIUXING)
            return true;
        }
        else if (step == EnumGuide.XuanTianGongActive_ClickPanelBtn) {
            let view = G.Uimgr.getForm<HeroView>(HeroView);
            if (null != view) {
                let panel = view.getTabFormByID(KeyWord.BAR_FUNCTION_JIUXING) as JiuXingView;
                if (panel != null && panel.isOpened) {
                    panel.onBtnEnhanceClick();
                    return true;
                }
            }
        }
        else if (step == EnumGuide.XuanTianGongActive_ClickClose) {
            let view = G.Uimgr.getForm<HeroView>(HeroView);
            if (null != view) {
                view.close();
                return true;
            }
        } 
        return false;
    }
}