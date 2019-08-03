import { BagPanel } from 'System/bag/view/BagPanel';
import { BagView, EnumBagTab } from 'System/bag/view/BagView';
import { DecomposeView } from "System/bag/view/DecomposeView";
import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { FunctionGuider } from 'System/guide/cases/FunctionGuider';
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView';
import { HunGuPanel } from 'System/hunli/HunGuPanel';

/**魂骨分解引导 */
export class HunGuDecomposeGuider extends FunctionGuider {

    readonly guideThingId: number = 111101021;
    constructor() {
        super(EnumGuide.HunGuDecompose, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(BagView)];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.HunGuDecOpenBagPanel, this._onStepClickAction);
        this._addStep(EnumGuide.HunGuDecClickDecBtn, this._onStepClickDecBtn);
        this._addStep(EnumGuide.HunGuDecClickListItem, this._onStepClickListItem);
        this._addStep(EnumGuide.HunGuDecClickConfirmBtn, this._onStepClickConfirmBtn);
        this.m_activeFrame = EnumGuide.HunGuDecOpenBagPanel;
    }
    private _onStepClickAction(step: EnumGuide) {
        let view = G.Uimgr.getForm<BagView>(BagView);
        if (view != null) {
            let panel = view.getTabFormByID(EnumBagTab.bag);
            if (panel != null && panel.isOpened) {
                //进行第二步
            }
        } else {
            G.ViewCacher.functionGuideView.guideOn(
                G.MainBtnCtrl.getFuncBtn(KeyWord.BAR_FUNCTION_BAG ),
                EnumGuideArrowRotation.left,
                { x: -10, y: -8 }, [], true, { x: 0, y: -0.1 }
            );
        }
    }

    private _onStepClickDecBtn(step: EnumGuide) {
        let view = G.Uimgr.getForm<BagView>(BagView);
        if (view != null) {
            let panel = view.getTabFormByID(EnumBagTab.bag) as BagPanel;
            if (panel != null && panel.isOpened) {
                G.ViewCacher.functionGuideView.guideOn(panel.btnDecompose, EnumGuideArrowRotation.left, { x: -30, y: 0 });
            }
        }
    }

    private _onStepClickListItem(step: EnumGuide) {
        let view = G.Uimgr.getForm<DecomposeView>(DecomposeView);
        if (view != null && view.isOpened) {
            if (view.getListItemByThingId(this.guideThingId)) {
                G.ViewCacher.functionGuideView.guideOn(view.getListItemByThingId(111101021).gameObject, EnumGuideArrowRotation.right, { x: 35, y: -42 }, [], true, { x: 0.56, y: -0.56 }, { x: 0, y: 0 }, true);
            } else {
                G.GuideMgr.cancelGuide(EnumGuide.HunGuDecompose);
            }
        }
    }

    private _onStepClickConfirmBtn(step: EnumGuide) {
        let view = G.Uimgr.getForm<DecomposeView>(DecomposeView);
        if (view != null && view.isOpened) {
            G.ViewCacher.functionGuideView.guideOn(view.btnConfirm, EnumGuideArrowRotation.right, { x: 200, y: 0 });
        }
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (step == EnumGuide.HunGuDecOpenBagPanel) {
            G.Uimgr.createForm<BagView>(BagView).open()
            return true;
        }
        else if (step == EnumGuide.HunGuDecClickDecBtn) {
            let view = G.Uimgr.getForm<BagView>(BagView);
            if (null != view) {
                let panel = view.getTabFormByID(EnumBagTab.bag) as HunGuPanel;
                if (panel != null && panel.isOpened) {
                    G.Uimgr.createForm<DecomposeView>(DecomposeView).open();
                    return true;
                }
            }
        } else if (step == EnumGuide.HunGuDecClickListItem) {
            let view = G.Uimgr.getForm<DecomposeView>(DecomposeView);
            if (view != null && view.isOpened) {
                view.onBagListItem(view.getListItemByThingId(this.guideThingId).Index);
                return true;
            }
        } else if (step == EnumGuide.HunGuDecClickConfirmBtn) {
            let view = G.Uimgr.getForm<DecomposeView>(DecomposeView);
            if (null != view) {
                view.onBtnConfirm();
                return true;
            }
        } 
        return false;
    }
}