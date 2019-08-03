import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { FengMoTaView } from 'System/pinstance/fmt/FengMoTaView'
import { KeyWord } from 'System/constants/KeyWord'
import { Constants } from 'System/constants/Constants'

export class FengMoTaGuider extends FunctionGuider {
    private bossId = 0;
    constructor(index: number, bossId: number) {
        super(EnumGuide.FengMoTa, index, true);
        this.bossId = bossId;
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(FengMoTaView)];
    }

    protected fillSteps(): void {
        this._addStep(EnumGuide.FengMoTa_OpenFengMoTa, this._onStepOpenFengMoTa);
        this._addStep(EnumGuide.FengMoTa_ClickEnter, this._onStepClickEnter);
    }

    private _onStepOpenFengMoTa(step: EnumGuide) {
        let fengMoTaView = G.Uimgr.getForm<FengMoTaView>(FengMoTaView);
        if (fengMoTaView!=null) {
            // 黑洞塔已经打开
            this.onGuideStepFinished(step);
        } else {
            this.guideOnActBtn(KeyWord.ACT_FUNCTION_FMT);
        }
    }

    private _onStepClickEnter(step: EnumGuide): void {
        let fengMoTaView = G.Uimgr.getForm<FengMoTaView>(FengMoTaView);
        if (null != fengMoTaView) {
            let layerItem = fengMoTaView.getLayerItem(Constants.FengMoTaGuiderLayer);
            let bossItem = fengMoTaView.getBossItem(this.bossId);
            if (null != bossItem) {
                let targetPos = bossItem.transform.position;
                G.ViewCacher.functionGuideView.guideOn(bossItem, EnumGuideArrowRotation.top, { x: 0, y: 60 }, [layerItem]);
            } else {
                G.ViewCacher.functionGuideView.guideOn(fengMoTaView.btnGo, EnumGuideArrowRotation.left, { x: -80, y: 0 }, [layerItem]);
            }            
        }
    }

    protected _onStepFinished(step: EnumGuide) {
    }

    protected _forceStep(step: EnumGuide): boolean {
        let view = G.Uimgr.getForm<FengMoTaView>(FengMoTaView);

        if (EnumGuide.FengMoTa_OpenFengMoTa == step) {
            if (null == view) {
                G.Uimgr.createForm<FengMoTaView>(FengMoTaView).open();
            }
            return true;          
        }
        if (null != view) {
            if (EnumGuide.FengMoTa_ClickEnter == step) {
                return view.force(this.type, step, this.bossId);
            } 
        }
        return false;
    }
}