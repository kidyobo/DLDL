import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { SystemSettingView } from 'System/setting/SystemSettingView'
import { KeyWord } from 'System/constants/KeyWord'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'

/**
 * 获得离线挂机卡的引导。
 */
export class GetLiXianGuaJiKaGuider extends FunctionGuider {
    constructor() {
        super(EnumGuide.GetLiXianGuaJiKa, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(SystemSettingView)];
    }

    processRequiredParams() {
    }

    protected fillSteps() {
        this._addStep(EnumGuide.GetLiXianGuaJiKa_OpenSystemSetting, this._onStepOpenSystemSetting);
        this._addStep(EnumGuide.GetLiXianGuaJiKa_ClickAddTime, this._onStepClickAddTime);
        this._addStep(EnumGuide.GetLiXianGuaJiKa_ClickClose, this._onStepClickClose);
    }

    private _onStepOpenSystemSetting(step: EnumGuide): void {
        G.Uimgr.createForm<SystemSettingView>(SystemSettingView).open();
    }

    private _onStepClickAddTime(step: EnumGuide): void {
        let view = G.Uimgr.getForm<SystemSettingView>(SystemSettingView);
        let btnBuyTime = view.getElement("btnBuyTime");
        G.ViewCacher.functionGuideView.guideOn(btnBuyTime, EnumGuideArrowRotation.top, { x: 0, y: 30 }, [view.getElement("offline")]);
    }

    private _onStepClickClose(step: EnumGuide): void {
        let view = G.Uimgr.getForm<SystemSettingView>(SystemSettingView);
        this.guideOnBtnReturn(view.getElement("btnClose"));
    }

    protected _forceStep(step: EnumGuide): boolean {
        let view = G.Uimgr.getForm<SystemSettingView>(SystemSettingView);
        if (null != view) {
            if (EnumGuide.GetLiXianGuaJiKa_ClickAddTime == step) {
                return view.force(this.type, step);
            } else if (EnumGuide.GetLiXianGuaJiKa_ClickClose == step) {
                return view.force(this.type, step);
            }
        }
        return false;
    }
}