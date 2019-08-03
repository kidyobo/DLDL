import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { ShenZhuangShouJiView } from 'System/szsj/ShenZhuangShouJiView'
import { EquipCollectPanel } from 'System/equip/EquipCollectPanel'
import { GetZhufuView } from 'System/guide/GetZhufuView'

export class ShenZhuangShouJiGuider extends FunctionGuider {
    constructor(index: number) {
        super(EnumGuide.ShenZhuangShouJi, index, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(ShenZhuangShouJiView)];
    }

    processRequiredParams() {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.ShenZhuangShouJi_ClickEntrance, this._onStepClickEquip);
        //this._addStep(EnumGuide.ShenZhuangShouJi_ClickEnter, this._onStepClickEnter);
        this._addStep(EnumGuide.ShenZhuangShouJi_ClickActive, this._onStepClickActive);
        this._addStep(EnumGuide.ShenZhuangShouJi_ClickTakeOn, this._onStepClickTakeOn);
        this._addStep(EnumGuide.ShenZhuangShouJi_ClickClose, this._onStepClickClose);
    }

    private _onStepClickEquip(step: EnumGuide): void {
        // 先检查是否已打开EquipView
        let equipView = G.Uimgr.getForm<ShenZhuangShouJiView>(ShenZhuangShouJiView);
        if (equipView != null && equipView.isOpened) {
            // 已经打开EquipView了，确保打开强化页签
            equipView.switchTabFormById(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION);
        }
        //else {
        //    // 没有打开则引导点击强化按钮
        //    G.ViewCacher.functionGuideView.guideOn(G.ActBtnCtrl.equipCollectObj, EnumGuideArrowRotation.left, { x: -180, y: 0 });
        //}
    }
    //private _onStepClickEnter(step: EnumGuide): void {
    //    let panel = G.Uimgr.getSubFormByID<EquipCollectPanel>(ShenZhuangShouJiView, KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION);
    //    G.ViewCacher.functionGuideView.guideOn(panel.btnProperty, EnumGuideArrowRotation.bottom, { x: 0, y: 0 });
    //}

    private _onStepClickActive(step: EnumGuide): void {
        let panel = G.Uimgr.getSubFormByID<EquipCollectPanel>(ShenZhuangShouJiView, KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION);
        G.ViewCacher.functionGuideView.guideOn(panel.btnActive, EnumGuideArrowRotation.top, { x: 0, y: 30 }, null);
    }

    private _onStepClickTakeOn(step: EnumGuide): void {
        let getZhufuView = G.Uimgr.getForm<GetZhufuView>(GetZhufuView);
        if (null != getZhufuView) {
            G.ViewCacher.functionGuideView.guideOn(getZhufuView.content, EnumGuideArrowRotation.right, { x: 82, y: -260 }, [getZhufuView.btnEquip], false);
        } else {
            this.onGuideStepFinished(step);
        }
    }

    private _onStepClickClose(step: EnumGuide): void {
        let equipView = G.Uimgr.getForm<ShenZhuangShouJiView>(ShenZhuangShouJiView);
        //强化面板有可能还没打开
        if (equipView != null) {
            this.guideOnBtnReturn(equipView.returnBt);
        } else {
            this.onGuideStepFinished(step);
        }
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.ShenZhuangShouJi_ClickTakeOn == step) {
            let getZhufuView = G.Uimgr.getForm<GetZhufuView>(GetZhufuView);
            if (null != getZhufuView) {
                return getZhufuView.force(this.type, step);
            }
        } if (EnumGuide.ShenZhuangShouJi_ClickEntrance == step) {
            G.Uimgr.createForm<ShenZhuangShouJiView>(ShenZhuangShouJiView).open(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION);
            return true;
        } else {
            let equipView = G.Uimgr.getForm<ShenZhuangShouJiView>(ShenZhuangShouJiView);
            if (null != equipView) {
                if (EnumGuide.ShenZhuangShouJi_ClickActive == step) {
                    let panel = equipView.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION) as EquipCollectPanel;
                    if (null != panel && panel.isOpened) {
                        return panel.force(this.type, step);
                    }
                } else if (EnumGuide.ShenZhuangShouJi_ClickClose == step) {
                    return equipView.force(this.type, step);
                }
            }
        }
        return false;
    }
}