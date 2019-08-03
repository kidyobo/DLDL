import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { FunctionGuider } from 'System/guide/cases/FunctionGuider';
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView';
import { HunGuView } from 'System/hungu/HunGuView';
import { HunguSelectView } from 'System/hunli/HunguSelectView';
import { HunguMergePanel } from '../../hungu/HunguMergePanel';

/**魂骨升华引导 */
export class HunGuShengHuaGuider extends FunctionGuider {

    constructor() {
        super(EnumGuide.HunGuShengHua, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(HunGuView)];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.HunGuShengHuaOpenPanel, this._onStepOpenPanel);
        this._addStep(EnumGuide.HunGuShengHuaClickMaterialList, this._onStepClickMaterialList);
        this._addStep(EnumGuide.HunguShengHuaSelectMaterial, this._onStepSelectMaterial);
        this._addStep(EnumGuide.HunGuShengHuaClickBtnConfirm, this._onStepClickBtnConfirm);//点击升华按钮
        this._addStep(EnumGuide.HunGuShengHuaClickBtnClose, this._onStepClickClose);
        this.m_activeFrame = EnumGuide.HunGuActive_ClickAction;
    }
    private _onStepOpenPanel(step: EnumGuide) {
        let view = G.Uimgr.getForm<HunGuView>(HunGuView);
        G.ViewCacher.functionGuideView.setGuideDes(true, "魂骨升华\n\n魂骨升华可将红色魂骨提升成青色魂骨，升华后将大幅提升战力。");
        if (view != null) {
            view.switchTabFormById(KeyWord.OTHER_FUNCTION_HUNGUN_MERGE);
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

    private _onStepClickMaterialList(step: EnumGuide) {
        let view = G.Uimgr.getForm<HunGuView>(HunGuView);
        if (G.DataMgr.hunliData.hunguMergeData.getGuideMaterials().length == 0) {
            G.GuideMgr.cancelGuide(EnumGuide.HunGuShengHua);
        } else {
            if (view != null) {
                let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNGUN_MERGE) as HunguMergePanel;
                if (panel != null && panel.isOpened) {
                    if (panel.materialList.GetItem(0).gameObject)
                        G.ViewCacher.functionGuideView.guideOn(panel.materialList.GetItem(0).gameObject,
                            EnumGuideArrowRotation.left,
                            { x: 24, y: -36 }, [], true,
                            { x: 0.56, y: -0.55 },
                            { x: 0, y: 0 },
                            true
                        );
                }
            }
        }


    }

    private _onStepSelectMaterial(step: EnumGuide) {
        let view = G.Uimgr.getForm<HunguSelectView>(HunguSelectView);
        if (view != null && view.isOpened) {
            if (view.guideBtn)
                G.ViewCacher.functionGuideView.guideOn(view.guideBtn, EnumGuideArrowRotation.left, { x: -30, y: 0 }, [], true, { x: 0, y: 0 }, { x: 0, y: 0 }, true);
        }
    }

    private _onStepClickBtnConfirm(step: EnumGuide) {
        let view = G.Uimgr.getForm<HunGuView>(HunGuView);
        if (view != null) {
            let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNGUN_MERGE) as HunguMergePanel;
            if (panel != null && panel.isOpened) {
                G.ViewCacher.functionGuideView.guideOn(panel.itemConsumeMaterial.btnFirst, EnumGuideArrowRotation.left, { x: -170, y: 0 });
            }
        }
    }

    private _onStepClickClose(step: EnumGuide) {
        let view = G.Uimgr.getForm<HunGuView>(HunGuView);
        if (view != null && view.isOpened) {
            G.ViewCacher.functionGuideView.setGuideDes(false);
            this.guideOnBtnReturn(view.btnReturn);
        }
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (step == EnumGuide.HunGuShengHuaOpenPanel) {
            G.ViewCacher.functionGuideView.setGuideDes(true, "魂骨升华\n\n魂骨升华可将红色魂骨提升成青色魂骨，升华后将大幅提升战力。");
            G.Uimgr.createForm<HunGuView>(HunGuView).open(KeyWord.OTHER_FUNCTION_HUNGUN_MERGE)
            return true;
        }
        else if (step == EnumGuide.HunGuShengHuaClickMaterialList) {
            let view = G.Uimgr.getForm<HunGuView>(HunGuView);
            if (null != view) {
                let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNGUN_MERGE) as HunguMergePanel;
                if (panel != null && panel.isOpened) {
                    panel.onClickMaterialList(0);
                    return true;
                }
            }
        }
        else if (step == EnumGuide.HunguShengHuaSelectMaterial) {
            let view = G.Uimgr.getForm<HunguSelectView>(HunguSelectView);
            if (view != null && view.isOpened) {
                view.guiddeOnClickBtn();
                return true;
            }
        }
        else if (step == EnumGuide.HunGuShengHuaClickBtnConfirm) {
            let view = G.Uimgr.getForm<HunGuView>(HunGuView);
            if (null != view) {
                let panel = view.getTabFormByID(KeyWord.OTHER_FUNCTION_HUNGUN_MERGE) as HunguMergePanel;
                if (panel != null && panel.isOpened) {
                    panel.onClickMerge();
                    return true;
                }
            }
        }
        else if (step == EnumGuide.HunGuShengHuaClickBtnClose) {
            let view = G.Uimgr.getForm<HunGuView>(HunGuView);
            if (null != view) {
                view.close();
                return true;
            }
        } 
        return false;
    }
}