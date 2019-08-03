import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { FunctionGuider } from 'System/guide/cases/FunctionGuider';
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView';
import { BossView } from 'System/pinstance/boss/BossView';
import { PersonalBossView } from '../../pinstance/boss/PersonalBossView';
import { MultipleBossView } from '../../pinstance/boss/MultipleBossView';

/**个人Boss和多人Boss引导 */
export class PersonalBossGuider extends FunctionGuider {
    constructor(index: number) {
        super(EnumGuide.PersonBossActive, index, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(BossView)];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.PersonBossActive_ClickAction, this._onStepClickAction);//点击主界面世界Boss按钮，这个会打开个人boss面板
        this._addStep(EnumGuide.PersonBossActive_EnterPinstance, this._onStepClickBtnGo);
    }
    private _onStepClickAction(step: EnumGuide) {
        let bossView = G.Uimgr.getForm<BossView>(BossView);
        if (bossView != null) {
            let bossid = G.DataMgr.pinstanceData.getTeachBossIdForIndex(this.index);
            //多人Boss
            if (this.index == 6 || this.index == 7 || this.index == 9) {
                bossView.switchTabFormById(KeyWord.OTHER_FUNCTION_MULTIPLE_BOSS, bossid);
            } else {//个人Boss
                bossView.switchTabFormById(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS, bossid);
            }
        } else {
            this.guideOnActBtn(KeyWord.ACT_FUNCTION_BOSS);
        }
    }


    private _onStepClickBtnGo(step: EnumGuide) {
        //点击进入 个人boss副本
        let view = G.Uimgr.getForm<BossView>(BossView);

        if (null != view) {
            let panel = null;
            //多人Boss
            if (this.index == 6 || this.index == 7 || this.index == 9) {
                panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_MULTIPLE_BOSS) as MultipleBossView;
            } else {//个人Boss
                panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS) as PersonalBossView;
            }
            if (null != panel && panel.isOpened) {
                G.ViewCacher.functionGuideView.setMaskImageColor("00000000");
                G.ViewCacher.functionGuideView.guideOn(panel.btnGo.gameObject, EnumGuideArrowRotation.left, { x: -170, y: 0 });
            }
        }
    }

    protected _forceStep(step: EnumGuide): boolean {
        let bossid = G.DataMgr.pinstanceData.getTeachBossIdForIndex(this.index);
        if (step == EnumGuide.PersonBossActive_ClickAction) {
            //多人Boss
            if (this.index == 6 || this.index == 7 || this.index == 9) {
                G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_MULTIPLE_BOSS, bossid)
            } else {//个人Boss
                G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS, bossid)
            }
            return true;
        }
        else if (step == EnumGuide.PersonBossActive_EnterPinstance) {
            let view = G.Uimgr.getForm<BossView>(BossView);
            if (null != view) {
                let panel = null;
                //多人Boss
                if (this.index == 6 || this.index == 7 || this.index == 9) {
                    panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_MULTIPLE_BOSS) as MultipleBossView;
                } else {//个人Boss
                    panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_PERSONAL_BOSS) as PersonalBossView;
                }

                if (null != panel && panel.isOpened) {
                    return panel.force(this.type, step);
                }
            }
        }
        return false;
    }
}