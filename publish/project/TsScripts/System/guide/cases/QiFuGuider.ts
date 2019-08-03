import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { KuaiSuShengJiView } from 'System/activity/view/KuaiSuShengJiView'
import { KeyWord } from 'System/constants/KeyWord'
import { Constants } from 'System/constants/Constants'

export class QiFuGuider extends FunctionGuider {

    constructor() {
        super(EnumGuide.QiFu, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(KuaiSuShengJiView)];
    }

    protected fillSteps(): void {
        this._addStep(EnumGuide.QiFu_OpenQiFuView, this._onStepOpenQiFuView);
        this._addStep(EnumGuide.QiFu_ClickQiFu, this._onStepClickQiFu);
        this._addStep(EnumGuide.QiFu_ClickClose, this._onStepClickClose);
    }

    private _onStepOpenQiFuView(step: EnumGuide) {
        // 直接弹开面板
        G.Uimgr.createForm<KuaiSuShengJiView>(KuaiSuShengJiView).open();
    }

    private _onStepClickQiFu(step: EnumGuide): void {
        let view = G.Uimgr.getForm<KuaiSuShengJiView>(KuaiSuShengJiView);
        G.ViewCacher.functionGuideView.guideOn(view.btnQiFuExp, EnumGuideArrowRotation.top, { x: 0, y: 30 });
    }

    private _onStepClickClose(step: EnumGuide): void {
        this.guideOnBtnReturn(G.Uimgr.getForm<KuaiSuShengJiView>(KuaiSuShengJiView).btnClose);
    }

    protected _forceStep(step: EnumGuide): boolean {
        let view = G.Uimgr.getForm<KuaiSuShengJiView>(KuaiSuShengJiView);
        if (null != view) {
            return view.force(this.type, step);
        }
        return false;
    }
}