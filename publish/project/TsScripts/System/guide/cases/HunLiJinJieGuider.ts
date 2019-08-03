import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { FunctionGuider } from 'System/guide/cases/FunctionGuider';
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView';
import { HunLiPanel } from 'System/hunli/HunLiPanel';
import { HunLiView } from 'System/hunli/HunLiView';

/**魂力进阶引导 */
export class HunLiJinJieGuider extends FunctionGuider {

    constructor() {
        super(EnumGuide.HunLiJinJie, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(HunLiView)];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.HunLiJinJie_OpenHunLiPanel, this._onStepClickAction);
        this.m_activeFrame = EnumGuide.HunLiJinJie_OpenHunLiPanel;
    }
    private _onStepClickAction(step: EnumGuide) {
        let view = G.Uimgr.getForm<HunLiView>(HunLiView);
        if (view != null) {
            view.switchTabFormById(KeyWord.OTHER_FUNCTION_ZHUANSHENG);
        } else {
            G.ViewCacher.functionGuideView.guideOn(G.MainBtnCtrl.btnPet, EnumGuideArrowRotation.left, { x: -10, y: -8 }, [], true, { x: 0, y: -0.1 });
        }
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (step == EnumGuide.HunLiJinJie_OpenHunLiPanel) {
            let view = G.Uimgr.getForm<HunLiView>(HunLiView);
            if (null != view) {
                let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_ZHUANSHENG) as HunLiPanel;
                if (panel != null && panel.isOpened) {
                    panel.hunLiJinJieGuiderFunc();
                    return true;
                }
            }
        }
        return false;
    }
}