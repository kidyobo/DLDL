import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { FunctionGuider } from 'System/guide/cases/FunctionGuider';
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView';
import { HunHuanPanel } from 'System/hunli/HunHuanPanel';
import { HunLiView } from 'System/hunli/HunLiView';

/**魂环引导 */
export class HunHuanGuider extends FunctionGuider {

    constructor() {
        super(EnumGuide.HunHuanActive, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(HunLiView)];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.HunHuanActive_ClickAction, this._onStepClickAction);
        this._addStep(EnumGuide.HunHuanActive_ClickActiveBtn, this._onStepClickActiveBtn);//点击魂环面板上的注入按钮
        this._addStep(EnumGuide.HunHuanActive_ClickActiveBtn1, this._onStepClickActiveBtn);//点击魂环面板上的激活按钮
        this._addStep(EnumGuide.HunHuanActive_ClickClose, this._onStepClickClose);
        this.m_activeFrame = EnumGuide.HunGuActive_ClickAction;
    }
    private _onStepClickAction(step: EnumGuide) {
        let view = G.Uimgr.getForm<HunLiView>(HunLiView);
        if (view != null) {
            view.switchTabFormById(KeyWord.OTHER_FUNCTION_HUNHUAN);
        } else {
            G.ViewCacher.functionGuideView.guideOn(G.MainBtnCtrl.btnPet, EnumGuideArrowRotation.left, { x: -10, y: -8 }, [], true, { x: 0, y: -0.1 });
        }
    }

    private _onStepClickActiveBtn(step: EnumGuide) {
        let view = G.Uimgr.getForm<HunLiView>(HunLiView);
        if (view != null) {
            let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNHUAN) as HunHuanPanel;
            if (panel != null && panel.isOpened) {
                G.ViewCacher.functionGuideView.guideOn(panel.btnGo.gameObject, EnumGuideArrowRotation.left, { x: -120, y: 0 });
            }
        }
    }


    private _onStepClickClose(step: EnumGuide) {
        let view = G.Uimgr.getForm<HunLiView>(HunLiView);
        if (view != null && view.isOpened) {
            this.guideOnBtnReturn(view.btnReturn);
        }
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (step == EnumGuide.HunHuanActive_ClickAction) {
            G.Uimgr.createForm<HunLiView>(HunLiView).open(KeyWord.OTHER_FUNCTION_HUNHUAN)
            return true;
        }
        else if (step == EnumGuide.HunHuanActive_ClickActiveBtn) {
            let view = G.Uimgr.getForm<HunLiView>(HunLiView);
            if (null != view) {
                let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNHUAN) as HunHuanPanel;
                if (panel != null && panel.isOpened) {
                    panel.onClickZhuRu();
                    return true;
                }
            }
        }
        else if (step == EnumGuide.HunHuanActive_ClickActiveBtn1) {
            let view = G.Uimgr.getForm<HunLiView>(HunLiView);
            if (null != view) {
                let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNHUAN) as HunHuanPanel;
                if (panel != null && panel.isOpened) {
                    panel.onClickActive();
                    return true;
                }
            }
        }
        else if (step == EnumGuide.HunHuanActive_ClickClose) {
            let view = G.Uimgr.getForm<HunLiView>(HunLiView);
            if (null != view && view.isOpened) {
                view.close();
                return true;
            }
        }
        return false;
    }
}