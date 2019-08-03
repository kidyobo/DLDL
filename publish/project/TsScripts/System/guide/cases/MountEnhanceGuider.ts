import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { HeroView } from 'System/hero/view/HeroView'
import { RideView } from 'System/jinjie/view/RideView'
import { JinjieView } from 'System/jinjie/view/JinjieView'

export class MountEnhanceGuider extends FunctionGuider {
    constructor() {
        super(EnumGuide.MountEnhance, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(HeroView)];
    }

    protected fillSteps() {
        this._addStep(EnumGuide.FunctionGuide_ClickHero, this._onStepClickHero);
        this._addStep(EnumGuide.MountEnhance_ClickAutoEnhance, this._onStepClickAutoEnhance);
        this._addStep(EnumGuide.MountEnhance_ClickClose, this._onStepClickClose);
    }

    private _onStepClickHero(step: EnumGuide): void {
        //this.guideOnClickHeroHead(KeyWord.HERO_SUB_TYPE_ZUOQI);
        G.Uimgr.createForm<JinjieView>(JinjieView).open();
    }

    private _onStepClickAutoEnhance(step: EnumGuide): void {
        let mountView = G.Uimgr.getSubFormByID<RideView>(JinjieView, KeyWord.HERO_SUB_TYPE_ZUOQI);
        G.ViewCacher.functionGuideView.guideOn(mountView.BT_Auto, EnumGuideArrowRotation.top, { x: 0, y: 30 });
    }

    private _onStepClickClose(step: EnumGuide): void {
        this.guideOnBtnReturn(G.Uimgr.getForm<JinjieView>(JinjieView).btnReturn);
    }

    protected _forceStep(step: EnumGuide): boolean {
        let view = G.Uimgr.getForm<JinjieView>(JinjieView);
        if (null != view) {
            if (EnumGuide.MountEnhance_ClickAutoEnhance == step) {
                let rideView = view.getTabFormByID(KeyWord.HERO_SUB_TYPE_ZUOQI) as RideView;
                if (null != rideView && rideView.isOpened) {
                    return rideView.force(this.type, step);
                }
            } else if (EnumGuide.MountEnhance_ClickClose == step) {
                return view.force(this.type, step);
            }
        }
        return false;
    }
}