import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'
import { ShenHuangMiJingPanel } from 'System/pinstance/selfChallenge/ShenHuangMiJingPanel'
import { KeyWord } from 'System/constants/KeyWord'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { ShowGoldVipFunctionView } from 'System/guide/ShowGoldVipFunctionView'

export class JingYanFuBenGuider extends FunctionGuider {
    constructor() {
        super(EnumGuide.JingYanFuBen, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(ShowGoldVipFunctionView)];
    }

    protected fillSteps(): void {
        this._addStep(EnumGuide.JingYanFuBen_OpenView, this._onStepOpenJingYanFuBenView);
        this._addStep(EnumGuide.JingYanFuBen_ClickEnter, this._onStepClickEnter);
    }

    private _onStepOpenJingYanFuBenView(step: EnumGuide) {
        // 先检查是否已打开PinstanceHallView
        //let pinstanceHallView = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
        //if (pinstanceHallView != null) {
        //    // 已经打开PinstanceHallView了，确保打开强化页签
        //    pinstanceHallView.switchTabFormById(KeyWord.OTHER_FUNCTION_SHMJ);
        //} else {
        //    if (this.skipGuideActIcon) {
        //        G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_SHMJ);
        //    } else {
        //        this.guideOnActBtn(KeyWord.ACT_FUNC_PINSTANCEHALL);
        //    }
        //}
        //G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_SHMJ);
        let status5 = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_2);
        //let status6 = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3);
        if (status5 >= 0 /*|| status6 >= 0*/) {
            G.GuideMgr.processGuideNext(EnumGuide.JingYanFuBen, EnumGuide.JingYanFuBen_OpenView);
        } else {
            G.Uimgr.createForm<ShowGoldVipFunctionView>(ShowGoldVipFunctionView).open();
        }
    }

    private _onStepClickEnter(step: EnumGuide): void {
        let status5 = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_2);
        let status6 = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3);
        if (status5 >= 0 || status6 >= 0) {
            G.GuideMgr.processGuideNext(EnumGuide.JingYanFuBen, EnumGuide.JingYanFuBen_ClickEnter);
        } else {
            let view = G.Uimgr.getForm<ShowGoldVipFunctionView>(ShowGoldVipFunctionView) as ShowGoldVipFunctionView;
            G.DataMgr.pinstanceData.isGuilder = true;
            G.ViewCacher.functionGuideView.guideOn(view.btnEnter, EnumGuideArrowRotation.top, { x: 0, y: 0 }, [], false, { x: 0, y: 0 });
        }
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.JingYanFuBen_OpenView == step) {
            G.Uimgr.createForm<ShowGoldVipFunctionView>(ShowGoldVipFunctionView).open();
            return true;
        } else if (EnumGuide.JingYanFuBen_ClickEnter == step) {
            //let panel = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView).getTabFormByID(KeyWord.OTHER_FUNCTION_SHMJ) as ShenHuangMiJingPanel;
            //if (null != panel) {
            //    return panel.force(this.type, step);
            //}
            let view = G.Uimgr.getForm<ShowGoldVipFunctionView>(ShowGoldVipFunctionView) as ShowGoldVipFunctionView;
            if (null != view && view.isOpened) view._onBtnEnter();
        }
        return false;
    }
}