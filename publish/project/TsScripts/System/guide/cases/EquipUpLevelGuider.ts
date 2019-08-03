import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { EquipView } from 'System/equip/EquipView'
import { EquipUpLevelPanel } from 'System/equip/EquipUplevelPanel'

export class EquipUpLevelGuider extends FunctionGuider {
    constructor() {
        super(EnumGuide.EquipUpLevel, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(EquipView)];
    }

    processRequiredParams() {
    }

    protected fillSteps() {
        //this._addStep(EnumGuide.FunctionGuide_OpenMainFuncBar, this._onStepOpenMainFuncBar);
        this._addStep(EnumGuide.EquipUpLevel_ClickEquip, this._onStepClickEquip);
        this._addStep(EnumGuide.EquipUpLevel_ClickAutoUpLevel, this._onStepClickAutoUpLevel);
        this._addStep(EnumGuide.EquipUpLevel_ClickClose, this._onStepClickClose);
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

        G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL);
    }

    private _onStepClickAutoUpLevel(step: EnumGuide): void {
        let upLevelPanel = G.Uimgr.getSubFormByID<EquipUpLevelPanel>(EquipView, KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL);
        // 选中靴子进行进阶
        let selectedItem = upLevelPanel.getSelectedItem(7);
        let focusTargets: UnityEngine.GameObject[];
        if (null != selectedItem) {
            focusTargets = [selectedItem];
        }
        G.ViewCacher.functionGuideView.guideOn(upLevelPanel.m_btnEnhance, EnumGuideArrowRotation.top, { x: 0, y: 30 }, focusTargets);
    }

    private _onStepClickClose(step: EnumGuide): void {
        let equipView = G.Uimgr.getForm<EquipView>(EquipView);
        this.guideOnBtnReturn(equipView.returnBt);
    }

    protected _forceStep(step: EnumGuide): boolean {
        let equipView = G.Uimgr.getForm<EquipView>(EquipView);
        if (null != equipView) {
            if (EnumGuide.EquipUpLevel_ClickAutoUpLevel == step) {
                let upLevelPanel = equipView.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL) as EquipUpLevelPanel;
                if (null != upLevelPanel && upLevelPanel.isOpened) {
                    return upLevelPanel.force(this.type, step);
                }
            } else if (EnumGuide.EquipUpLevel_ClickClose == step) {
                return equipView.force(this.type, step);
            }
        }
        return false;
    }
}