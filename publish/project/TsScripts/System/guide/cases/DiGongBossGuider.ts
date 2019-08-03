import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { FunctionGuider } from 'System/guide/cases/FunctionGuider';
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView';
import { BossView } from 'System/pinstance/boss/BossView';
import { DiGongBossPanel } from 'System/pinstance/boss/DiGongBossPanel';
import { PersonalBossView } from '../../pinstance/boss/PersonalBossView';

/**个人Boss引导 */
export class DiGongBossGuider extends FunctionGuider {

    constructor() {
        super(EnumGuide.DiGongBossActive, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(BossView)];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.DiGongBossActive_ClickAction, this._onStepClickAction);//点击主界面世界Boss按钮
        this._addStep(EnumGuide.DiGongBossActive_OpenDiGongPanel, this._onStepOpenDiGongPanel);
        this._addStep(EnumGuide.DiGongBossActive_EnterPinstance, this._onStepClickBtnGo);
    }
    private _onStepClickAction(step: EnumGuide) {
        let bossView = G.Uimgr.getForm<BossView>(BossView);
        if (bossView != null) {
            // 已经打开PinstanceHallView了，确保打开强化页签
            bossView.switchTabFormById(KeyWord.OTHER_FUNCTION_DI_BOSS);
        } else {
            this.guideOnActBtn(KeyWord.ACT_FUNCTION_BOSS);
        }
    }

    private _onStepOpenDiGongPanel(step: EnumGuide) {
        let bossView = G.Uimgr.getForm<BossView>(BossView);
        if (bossView != null) {
            bossView.switchTabFormById(KeyWord.OTHER_FUNCTION_DI_BOSS);
        }
    }

    private _onStepClickBtnGo(step: EnumGuide) {
        //点击进入 个人boss副本
        let bossView = G.Uimgr.getForm<BossView>(BossView);
        if (bossView != null) {
            let panel = bossView.getTabFormByID(KeyWord.OTHER_FUNCTION_DI_BOSS) as DiGongBossPanel;
            if (panel != null && panel.isOpened) {
                G.ViewCacher.functionGuideView.guideOn(panel.btnGo, EnumGuideArrowRotation.left, { x: -170, y: 0 });
            }
        }
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (step == EnumGuide.DiGongBossActive_ClickAction || step == EnumGuide.DiGongBossActive_OpenDiGongPanel) {
            G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_DI_BOSS)
            return true;
        }
        else if (step == EnumGuide.DiGongBossActive_EnterPinstance) {
            let view = G.Uimgr.getForm<BossView>(BossView);
            if (null != view) {
                let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_DI_BOSS) as PersonalBossView;
                if (null != panel && panel.isOpened) {
                    return panel.force(this.type, step);
                }
            }
        }
        return false;
    }
}