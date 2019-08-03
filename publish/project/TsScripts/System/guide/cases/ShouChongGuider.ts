import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { ShouChongTipView } from 'System/activity/view/ShouChongTipView'

export class ShouChongGuider extends BaseGuider {
    constructor() {
        super(EnumGuide.ShouChong, 0, EnumGuiderQuestRule.NoPause, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(ShouChongTipView)];
    }

    processRequiredParams() {
    }

    protected _initSteps() {
        this._addStep(EnumGuide.ShouChong_OpenShouChong, this._onStepOpenShouChong);
        this.m_activeFrame = EnumGuide.ShouChong_OpenShouChong;
    }

    private _onStepOpenShouChong(step: EnumGuide) {
        if (!G.DataMgr.firstRechargeData.isNotShowFirstRechargeIcon()) {
            G.Uimgr.createForm<ShouChongTipView>(ShouChongTipView).open();
        } else {
            G.GuideMgr.cancelGuide(this.type);
        }     
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        return true;
    }

    end() {
    }
}