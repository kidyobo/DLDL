import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { EquipView } from 'System/equip/EquipView'
import { EquipPartLevelUpPanel } from 'System/equip/EquipPartLevelUpPanel'

export class EquipSlotLvUpGuider extends FunctionGuider {
    constructor() {
        super(EnumGuide.EquipSlotLvUp, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(EquipView)];
    }

    processRequiredParams() {
    }

    protected fillSteps() {
        //this._addStep(EnumGuide.FunctionGuide_OpenMainFuncBar, this._onStepOpenMainFuncBar);
        this._addStep(EnumGuide.EquipSlotLvUp_ClickEquip, this._onStepClickEquip);
        this._addStep(EnumGuide.EquipSlotLvUp_ClickAutoLvUp, this._onStepClickAutoLvUp);
        this._addStep(EnumGuide.EquipSlotLvUp_ClickClose, this._onStepClickClose);
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

        G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIP_SLOTLVUP);
    }

    private _onStepClickAutoLvUp(step: EnumGuide): void {
        let lvUpPanel = G.Uimgr.getSubFormByID<EquipPartLevelUpPanel>(EquipView, KeyWord.OTHER_FUNCTION_EQUIP_SLOTLVUP);
        let selectedItem = lvUpPanel.getSelectedItem();
        let focusTargets: UnityEngine.GameObject[];
        if (null != selectedItem) {
            focusTargets = [selectedItem];
        }
        G.ViewCacher.functionGuideView.guideOn(lvUpPanel.btnOneKeyStart, EnumGuideArrowRotation.top, { x: 0, y: 30 }, focusTargets);
    }

    private _onStepClickClose(step: EnumGuide): void {
        let equipView = G.Uimgr.getForm<EquipView>(EquipView);
        this.guideOnBtnReturn(equipView.returnBt);
    }

    protected _forceStep(step: EnumGuide): boolean {
        let equipView = G.Uimgr.getForm<EquipView>(EquipView);
        if (null != equipView) {
            if (EnumGuide.EquipSlotLvUp_ClickAutoLvUp == step) {
                let lvUpPanel = equipView.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_SLOTLVUP) as EquipPartLevelUpPanel;
                if (null != lvUpPanel && lvUpPanel.isOpened) {
                    return lvUpPanel.force(this.type, step);
                }
            } else if (EnumGuide.EquipSlotLvUp_ClickClose == step) {
                return equipView.force(this.type, step);
            }
        }
        return false;
    }
}