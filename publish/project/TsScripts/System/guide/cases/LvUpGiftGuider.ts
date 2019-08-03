import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { FuLiDaTingView } from 'System/activity/fldt/FuLiDaTingView'
import { LvUpGiftPanel } from 'System/activity/fldt/LvUpGiftPanel'
import { KeyWord } from 'System/constants/KeyWord'

export class LvUpGiftGuider extends FunctionGuider {
    private lv = 0;
    constructor(lv: number) {
        super(EnumGuide.LvUpGift, 0, true);
        this.lv = lv;
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(FuLiDaTingView)];
    }

    protected fillSteps() {
        this._addStep(EnumGuide.LvUpGift_OpenLvUpGift, this._onStepOpenLvUpGift);
        this._addStep(EnumGuide.LvUpGift_ClickGet, this._onStepClickGet);
        this._addStep(EnumGuide.LvUpGift_ClickClose, this._onStepClickClose);
    }

    private _onStepOpenLvUpGift(step: EnumGuide): void {
        G.Uimgr.createForm<FuLiDaTingView>(FuLiDaTingView).open(KeyWord.OTHER_FUNCTION_SJLB);
    }

    private _onStepClickGet(step: EnumGuide): void {
        let lvUpGiftView = G.Uimgr.getSubFormByID<LvUpGiftPanel>(FuLiDaTingView, KeyWord.OTHER_FUNCTION_SJLB);
        if (lvUpGiftView) {
            let item = lvUpGiftView.getCanGetItem(this.lv);
            if (null != item) {
                G.ViewCacher.functionGuideView.guideOn(item.btnGetReward, EnumGuideArrowRotation.left, { x: -80, y: 0 });
            } else {
                this.onGuideStepFinished(step);
            }
        }
    }

    private _onStepClickClose(step: EnumGuide): void {
        this.guideOnBtnReturn(G.Uimgr.getForm<FuLiDaTingView>(FuLiDaTingView).btnReturn);
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.LvUpGift_OpenLvUpGift == step) {
            G.Uimgr.createForm<FuLiDaTingView>(FuLiDaTingView).open(KeyWord.OTHER_FUNCTION_SJLB);
            return true;
        } else {
            let view = G.Uimgr.getForm<FuLiDaTingView>(FuLiDaTingView);
            if (null != view) {
                if (EnumGuide.LvUpGift_ClickGet == step) {
                    let lvUpGiftView = view.getTabFormByID(KeyWord.OTHER_FUNCTION_SJLB) as LvUpGiftPanel;
                    if (null != lvUpGiftView && lvUpGiftView.isOpened) {
                        return view.force(this.type, step);
                    }
                } else if (EnumGuide.LvUpGift_ClickClose == step) {
                    return view.force(this.type, step);
                }
            }
        }
        
        return false;
    }
}