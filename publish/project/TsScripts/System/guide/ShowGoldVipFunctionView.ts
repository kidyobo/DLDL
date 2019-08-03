import { EnumGuide } from "System/constants/GameEnum";
import { UnitCtrlType } from "System/constants/GameEnum";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { EnumEffectRule } from 'System/constants/GameEnum'


/**告诉玩家 黄金VIP 的作用*/
export class ShowGoldVipFunctionView extends CommonForm {

    btnEnter: UnityEngine.GameObject;
    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.ShowGoldVipFunctionView;
    }

    protected initElements() {
        this.btnEnter = this.elems.getElement("btnEnter");
    }

    protected initListeners() {
        this.addClickListener(this.btnEnter, this._onBtnEnter);
    }
    protected onOpen() {
        G.GuideMgr.processGuideNext(EnumGuide.JingYanFuBen, EnumGuide.JingYanFuBen_OpenView);

    }
    protected onClose() {

    }

    _onBtnEnter(): void {
        G.ModuleMgr.pinstanceModule.tryEnterShenHuangMiJing();
        G.GuideMgr.processGuideNext(EnumGuide.JingYanFuBen, EnumGuide.JingYanFuBen_ClickEnter);
        this.close();
    }
}