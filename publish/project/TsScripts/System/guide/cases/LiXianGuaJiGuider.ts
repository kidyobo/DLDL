import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { SystemSettingView } from 'System/setting/SystemSettingView'
import { KeyWord } from 'System/constants/KeyWord'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'

/**
 * 每次登录检查没有离线时间时的引导。
 */
export class LiXianGuaJiGuider extends BaseGuider {
    private confirmId = 0;

    constructor() {
        super(EnumGuide.LiXianGuaJi, 0, EnumGuiderQuestRule.PauseAbsolutely, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(SystemSettingView)];
    }

    processRequiredParams() {
    }

    protected _initSteps() {
        this._addStep(EnumGuide.LiXianGuaJi_OpenConfirm, this._onStepOpenConfirm);
        this._addStep(EnumGuide.LiXianGuaJi_OpenSystemSetting, null);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.LiXianGuaJi_OpenConfirm;
    }

    private _onStepOpenConfirm(step: EnumGuide) {
        let str: string = '';
        let leftTime = G.DataMgr.systemData.GuajiLeftTime;
        if (leftTime == 0) {
            str = '您的离线挂机时间已耗尽,是否前往补充？';
        } else {
            str = '您的离线挂机时间已不足一小时,是否前往补充?';
        }
        this.confirmId = G.TipMgr.showConfirm(str, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmCheck));
        this.onGuideStepFinished(step);
    }

    private onConfirmCheck(state: MessageBoxConst, isCheckSelected: boolean) {
        if (MessageBoxConst.yes == state) {
            G.Uimgr.createForm<SystemSettingView>(SystemSettingView).open();
        } else {
            G.GuideMgr.cancelGuide(this.type);
        }
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        // 本引导不强制执行，直接退出
        return false;
    }

    end() {
        if (this.confirmId > 0) {
            G.TipMgr.closeConfirm(this.confirmId);
        }
        if (EnumGuide.GuideCommon_None == this.getCrtStep()) {
            G.Uimgr.closeForm(SystemSettingView);
        }
    }
}