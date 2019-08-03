import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { SystemSettingView } from 'System/setting/SystemSettingView'
import { KeyWord } from 'System/constants/KeyWord'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { ThingIDUtil } from 'System/utils/ThingIDUtil'
import { ThingData } from 'System/data/thing/ThingData'
import { FirstRechargeView } from 'System/activity/view/FirstRechargeView'
import { FuncBtnState, EnumThingID } from 'System/constants/GameEnum'
import { SecondChargeView } from 'System/activity/view/SecondChargeView'

/**
 * 升级后进行经验丹的引导。
 */
export class UseZhiShengDanGuider extends BaseGuider {
    private lv = 0;
    private confirmId = 0;

    constructor(lv: number) {
        super(EnumGuide.UseZhiShengDan, lv, EnumGuiderQuestRule.PauseAbsolutely, false);
        this.lv = lv;
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.ViewCacher.messageBox];
    }

    processRequiredParams() {
    }

    protected _initSteps() {
        this._addStep(EnumGuide.UseZhiShengDan_OpenConfirm, this._onStepOpenConfirm);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.UseZhiShengDan_OpenConfirm;
    }

    private _onStepOpenConfirm(step: EnumGuide) {
        let id = ThingIDUtil.getZhiShengDanId(this.lv);
        let itemDatas = G.DataMgr.thingData.getBagItemById(id);
        if (itemDatas.length > 0) {
            let cfg = ThingData.getThingConfig(id);
            this.confirmId = G.TipMgr.showConfirm(uts.format('您已达到使用经验直升丹的最佳等级，将为您自动使用，直升{0}级！', (this.lv + 1)), ConfirmCheck.noCheck, '确定', delegate(this, this.onConfirmCheck));
            this.onGuideStepFinished(step);
        } else {
            if (this.lv==69) {
                if (G.DataMgr.heroData.curChargeMoney <= 0) {
                    G.Uimgr.createForm<FirstRechargeView>(FirstRechargeView).open();
                }
            } else if (this.lv == 89) {
                if (G.DataMgr.heroData.curChargeMoney <= 0) {
                    G.Uimgr.createForm<FirstRechargeView>(FirstRechargeView).open();
                } else {
                    let thingData = G.DataMgr.thingData;
                    if (thingData.getThingNum(EnumThingID.SecondChargeItem1) > 0 || thingData.getThingNum(EnumThingID.SecondChargeItem2) > 0) {
                        G.Uimgr.createForm<SecondChargeView>(SecondChargeView).open();
                    }
                }
            }
            G.GuideMgr.cancelGuide(this.type);
        }
    }

    private onConfirmCheck(state: MessageBoxConst, isCheckSelected: boolean) {
        let id = ThingIDUtil.getZhiShengDanId(this.lv);
        let itemDatas = G.DataMgr.thingData.getBagItemById(id);
        if (itemDatas.length > 0) {
            let itemData = itemDatas[0];
            G.ModuleMgr.bagModule.useThing(itemData.config, itemData.data, 1, true);
        }
        this.onGuideStepFinished(EnumGuide.GuideCommon_None);
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        this.onConfirmCheck(MessageBoxConst.yes, false);
        return true;
    }

    end() {
        if (this.confirmId > 0) {
            G.TipMgr.closeConfirm(this.confirmId);
        }
    }
}