import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { EnumGuide } from 'System/constants/GameEnum'
import { VipView, VipTab } from 'System/vip/VipView'

export class PrivilegeOverdueView extends CommonForm {
    private btnBuy: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;

    private openLevel = 0;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.PrivilegeOverdueView;
    }

    protected initElements() {
        this.btnBuy = this.elems.getElement('btnBuy');
        this.btnClose = this.elems.getElement('btnClose');
    }

    protected initListeners() {
        this.addClickListener(this.btnBuy, this.onClickBtnBuy);
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.elems.getElement('mask'), this.onClickBtnClose);
    }

    protected onClose() {
        G.GuideMgr.processGuideNext(EnumGuide.PrivilegeOverdue, EnumGuide.GuideCommon_None);
    }

    open(level = 0) {
        this.openLevel = level;
        super.open();
    }

    private onClickBtnClose() {
        this.close();
    }

    private onClickBtnBuy() {
        this.close();
        G.Uimgr.createForm<VipView>(VipView).open(VipTab.ZunXiang);
    }
}