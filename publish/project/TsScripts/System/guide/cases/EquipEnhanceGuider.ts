import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { EquipView } from 'System/equip/EquipView'
import { EquipStrengPanel } from 'System/equip/EquipStrengPanel'

export class EquipEnhanceGuider extends FunctionGuider {
    constructor() {
        super(EnumGuide.EquipEnhance, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(EquipView)];
    }

    processRequiredParams() {
    }

    protected fillSteps() {
        //this._addStep(EnumGuide.FunctionGuide_OpenMainFuncBar, this._onStepOpenMainFuncBar);
        this._addStep(EnumGuide.EquipEnhance_ClickEquip, this._onStepClickEquip);
        this._addStep(EnumGuide.EquipEnhance_ClickAutoEnhance, this._onStepClickAutoEnhance);
        this._addStep(EnumGuide.EquipEnhance_ClickClose, this._onStepClickClose);
    }

    //private _onStepOpenMainFuncBar(step: EnumGuide) {
    //    this.doGuideOpenMainFuncBar(step, EquipView);
    //}

    private _onStepClickEquip(step: EnumGuide): void {
        //// 先检查是否已打开EquipView
        //let equipView = G.Uimgr.getForm<EquipView>(EquipView);
        //if (equipView!=null) {
        //    // 已经打开EquipView了，确保打开强化页签
        //    equipView.switchTabFormById(KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE);
        //} else {
        //    // 没有打开则引导点击强化按钮
        //    this.guideOnMainFuncBtn(KeyWord.BAR_FUNCTION_EQUIP_ENHANCE);
        //}

        G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE);
    }

    private _onStepClickAutoEnhance(step: EnumGuide): void {
        let strengthenPanel = G.Uimgr.getSubFormByID<EquipStrengPanel>(EquipView, KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE);
        let selectedItem = strengthenPanel.getSelectedItem();
        let focusTargets: UnityEngine.GameObject[];
        if (null != selectedItem) {
            focusTargets = [selectedItem];
        }
        G.ViewCacher.functionGuideView.guideOn(strengthenPanel.btnStart, EnumGuideArrowRotation.top, { x: 0, y: 30 }, focusTargets);
    }

    private _onStepClickClose(step: EnumGuide): void {
        let equipView = G.Uimgr.getForm<EquipView>(EquipView);
        this.guideOnBtnReturn(equipView.returnBt);
    }

    protected _forceStep(step: EnumGuide): boolean {
        let equipView = G.Uimgr.getForm<EquipView>(EquipView);
        if (null != equipView) {
            if (EnumGuide.EquipEnhance_ClickAutoEnhance == step) {
                let strenthenPanel = equipView.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE) as EquipStrengPanel;
                if (null != strenthenPanel && strenthenPanel.isOpened) {
                    return strenthenPanel.force(this.type, step);
                }
            } else if (EnumGuide.EquipEnhance_ClickClose == step) {
                return equipView.force(this.type, step);
            }
        }
        return false;
    }
}