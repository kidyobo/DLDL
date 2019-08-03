import { Global as G } from 'System/global'
import { EnumGuide, EnumGuiderQuestRule } from 'System/constants/GameEnum'
import { BaseGuider } from 'System/guide/cases/BaseGuider'
import { FunctionUnlockView } from 'System/guide/FunctionUnlockView'

export class FunctionUnlockGuider extends BaseGuider {
    private funcCfgs: GameConfig.NPCFunctionLimitM[] = [];

    constructor() {
        super(EnumGuide.FunctionUnlock, 0, EnumGuiderQuestRule.PauseAbsolutely, false);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return null;
    }

    processRequiredParams(funcCfgs: GameConfig.NPCFunctionLimitM[]) {
        for (let cfg of funcCfgs) {
            if (this.funcCfgs.indexOf(cfg) >= 0) {
                continue;
            }
            this.funcCfgs.push(cfg);
        }
    }

    protected _initSteps(): void {
        this._addStep(EnumGuide.FunctionUnlock_OpenView, this._onStepOpenView);
        this._addStep(EnumGuide.GuideCommon_None, null);
        this.m_activeFrame = EnumGuide.FunctionUnlock_OpenView;
    }

    private _onStepOpenView(step: EnumGuide): void {
        // 直接弹开面板
        G.Uimgr.createForm<FunctionUnlockView>(FunctionUnlockView).open();
    }

    end(): void {
        G.Uimgr.closeForm(FunctionUnlockView);
        this.funcCfgs.length = 0;
    }

    protected _onStepFinished(step: EnumGuide) {

    }

    protected _forceStep(step: EnumGuide): boolean {
        return true;
    }

    getNextFuncCfg(): GameConfig.NPCFunctionLimitM {
        if (this.funcCfgs.length > 0) {
            return this.funcCfgs.pop();
        }
        return null;
    }
}
