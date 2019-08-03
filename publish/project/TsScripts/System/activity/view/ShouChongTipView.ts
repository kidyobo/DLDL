import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { CommonForm, UILayer } from 'System/uilib/CommonForm';
import { FirstRechargeView } from './FirstRechargeView';

export class ShouChongTipView extends CommonForm {
    private btnReturn: UnityEngine.GameObject;
    private content: UnityEngine.GameObject;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
        this._cacheForm = true;
    }

    layer(): UILayer {
        return UILayer.Base;
    }

    protected resPath(): string {
        return UIPathData.ShouChongTipView;
    }

    protected onOpen() {
        let obj = G.ActBtnCtrl.getFuncBtn(KeyWord.ACT_FUNCTION_FIRSTCHARGE);
        if (obj != null) {
            let v3 = G.cacheVec3;
            Game.Tools.GetGameObjectPosition(obj, v3);
            //调整位置,
            Game.Tools.SetGameObjectPosition(this.content, v3.x, v3.y, 0);
            Game.Tools.GetGameObjectLocalPosition(this.content, v3);
            Game.Tools.SetGameObjectLocalPosition(this.content, v3.x - 80, v3.y - 200, 0);
        }
        G.GuideMgr.processGuideNext(EnumGuide.CommonOpenView, EnumGuide.CommonOpenView_OpenView);
        G.GuideMgr.processGuideNext(EnumGuide.CommonOpenView, EnumGuide.GuideCommon_None);
        // G.GuideMgr.processGuideNext(EnumGuide.ShouChong, EnumGuide.ShouChong_OpenShouChong);
    }

    protected onClose() {
    }

    protected initElements(): void {
        this.btnReturn = this.elems.getElement('btnReturn');
        this.content = this.elems.getElement("content");
    }

    protected initListeners(): void {
        this.addClickListener(this.content, this.onClickBtnRecharge);
        this.addClickListener(this.btnReturn, this.onclickBtnReturn);
    }

    private onClickBtnRecharge() {
        this.close();
        G.Uimgr.createForm<FirstRechargeView>(FirstRechargeView).open();
    }

    private onclickBtnReturn() {
        this.close();
    }

    showContent() {
        this.content.SetActive(true);
    }

    hideContent() {
        this.content.SetActive(false);
    }

}