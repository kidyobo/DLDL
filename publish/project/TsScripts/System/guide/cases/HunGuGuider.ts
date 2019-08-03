import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { FunctionGuider } from 'System/guide/cases/FunctionGuider';
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView';
import { HunGuView } from 'System/hungu/HunGuView';
import { HunGuPanel } from 'System/hunli/HunGuPanel';
import { HunguSelectView } from 'System/hunli/HunguSelectView';

/**魂骨引导 */
export class HunGuGuider extends FunctionGuider {

    constructor() {
        super(EnumGuide.HunGuActive, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(HunGuView)];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.HunGuActive_ClickAction, this._onStepClickAction);
        this._addStep(EnumGuide.HunGuActive_SelectEquipGrid, this._onStepSelectEquipGrid);
        this._addStep(EnumGuide.HunGuActive_ClickEquip, this._onStepClickEquip);//点击装备按钮
        this._addStep(EnumGuide.HunGuActive_ClickClose, this._onStepClickClose);
        this.m_activeFrame = EnumGuide.HunGuActive_ClickAction;
    }
    private _onStepClickAction(step: EnumGuide) {
        let view = G.Uimgr.getForm<HunGuView>(HunGuView);
        if (view != null) {
            view.switchTabFormById(KeyWord.OTHER_FUNCTION_HUNGUN);
        } else {
            if (!G.MainBtnCtrl.IsOpened) {
                G.MainBtnCtrl.onClickBtnSwitcher();
            }
            G.ViewCacher.functionGuideView.guideOn(
                G.MainBtnCtrl.getFuncBtn(KeyWord.BAR_FUNCTION_HUNGU),
                EnumGuideArrowRotation.left,
                { x: 20, y: 0 },
                [], true,
                { x: 0, y: 0 },
                { x: 70, y: 70 }
            );
        }
    }

    private _onStepSelectEquipGrid(step: EnumGuide) {
        let view = G.Uimgr.getForm<HunGuView>(HunGuView);
        G.ViewCacher.functionGuideView.setGuideDes(true, "魂骨\n\n斗罗大陆最神秘和珍惜的宝物，佩戴魂骨可巨幅提升战斗力。");
        if (view != null) {
            let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNGUN) as HunGuPanel;
            if (panel != null && panel.isOpened) {
                G.ViewCacher.functionGuideView.guideOn(panel.equipList.GetItem(2).gameObject, EnumGuideArrowRotation.right, { x: 24, y: 0 });
            }
        }
    }

    private _onStepClickEquip(step: EnumGuide) {
        let view = G.Uimgr.getForm<HunguSelectView>(HunguSelectView);
        if (view != null && view.isOpened) {
            if (view.guideBtn)
                G.ViewCacher.functionGuideView.guideOn(view.guideBtn, EnumGuideArrowRotation.left, { x: -30, y: 0 }, [], true, { x: 0, y: 0 }, { x: 0, y: 0 }, true);
        }
    }

    private _onStepClickClose(step: EnumGuide) {
        let view = G.Uimgr.getForm<HunGuView>(HunGuView);
        if (view != null && view.isOpened) {
            G.ViewCacher.functionGuideView.setGuideDes(false);
            this.guideOnBtnReturn(view.btnReturn);
        }
        G.ViewCacher.functionGuideView.setGuideDes(false);
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (step == EnumGuide.HunGuActive_ClickAction) {
            G.ViewCacher.functionGuideView.setGuideDes(true);
            G.Uimgr.createForm<HunGuView>(HunGuView).open(KeyWord.OTHER_FUNCTION_HUNGUN)
            return true;
        }
        else if (step == EnumGuide.HunGuActive_SelectEquipGrid) {
            let view = G.Uimgr.getForm<HunGuView>(HunGuView);
            if (null != view) {
                let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNGUN) as HunGuPanel;
                if (panel != null && panel.isOpened) {
                    panel.onEquipListClick(2);
                    return true;
                }
            }
        } else if (step == EnumGuide.HunGuActive_ClickEquip) {
            let view = G.Uimgr.getForm<HunguSelectView>(HunguSelectView);
            if (view != null && view.isOpened) {
                view.guiddeOnClickBtn();
                return true;
            }
        } else if (step == EnumGuide.HunGuActive_ClickClose) {
            let view = G.Uimgr.getForm<HunGuView>(HunGuView);
            if (null != view) {
                view.close();
                return true;
            }
        } 
        return false;
    }
}