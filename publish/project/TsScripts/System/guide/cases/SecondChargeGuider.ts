import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule, EnumThingID } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { SecondChargeView } from 'System/activity/view/SecondChargeView'
import { KeyWord } from 'System/constants/KeyWord'

export class SecondChargeGuider extends BaseGuider {
    constructor(index: number) {
        super(EnumGuide.SecondCharge, index, EnumGuiderQuestRule.PauseAbsolutely, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(SecondChargeView)];
    }

    processRequiredParams() {
    }

    protected _initSteps() {
        this._addStep(EnumGuide.SecondCharge_Open, this._onStepOpen);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.SecondCharge_Open;
    }

    private _onStepOpen(step: EnumGuide) {
        if (G.DataMgr.thingData.getThingNum(EnumThingID.SecondChargeItem1) > 0 || G.DataMgr.thingData.getThingNum(EnumThingID.SecondChargeItem2) > 0) {
            G.Uimgr.createForm<SecondChargeView>(SecondChargeView).open();
        } else {
            G.GuideMgr.cancelGuide(this.type);
        }     
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.GuideCommon_None == step) {
            G.Uimgr.closeForm(SecondChargeView);
        }
        return false;
    }

    end() {
    }
}