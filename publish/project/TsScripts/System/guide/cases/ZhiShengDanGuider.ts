import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { FirstRechargeView } from 'System/activity/view/FirstRechargeView'
import { KeyWord } from 'System/constants/KeyWord'

export class ZhiShengDanGuider extends BaseGuider {
    constructor(index: number) {
        super(EnumGuide.ZhiShengDan, index, EnumGuiderQuestRule.PauseAbsolutely, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(FirstRechargeView)];
    }

    processRequiredParams() {
    }

    protected _initSteps() {
        this._addStep(EnumGuide.ZhiShengDan_OpenFirstRecharge, this._onStepOpenFirstRecharge);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.ZhiShengDan_OpenFirstRecharge;
    }

    private _onStepOpenFirstRecharge(step: EnumGuide) {
        if (!G.DataMgr.firstRechargeData.isNotShowFirstRechargeIcon()) {
            G.Uimgr.createForm<FirstRechargeView>(FirstRechargeView).open();
        } else {
            G.GuideMgr.cancelGuide(this.type);
        }     
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.GuideCommon_None == step) {
            G.Uimgr.closeForm(FirstRechargeView);
        }
        return false;
    }

    end() {
    }
}