import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { ConfirmCheck, MessageBoxConst } from "System/tip/TipManager";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { Color } from "System/utils/ColorUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";

export class LiHunView extends CommonForm {

    private infoText: UnityEngine.UI.Text;
    private btn_xieYi: UnityEngine.GameObject;
    private btn_qiangzhi: UnityEngine.GameObject;
    private btn_shizong: UnityEngine.GameObject;
    private m_name: string = '';
    private m_cost: number = 0;


    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    open() {
        super.open();
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.LiHunView;
    }

    protected initElements() {
        this.infoText = this.elems.getText('infoText');
        this.btn_xieYi = this.elems.getElement('btn_xieyi');
        this.btn_qiangzhi = this.elems.getElement('btn_qiangzhi');
        this.btn_shizong = this.elems.getElement('btn_shizong');
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement('btn_close'), this.close);
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.btn_xieYi, this._onTfXyClick);
        this.addClickListener(this.btn_qiangzhi, this._onTfQzClick);
        this.addClickListener(this.btn_shizong, this._onTfSzClick);
    }

    protected onOpen() {
        this.updateView();
    }

    protected onClose() {

    }

    private updateView() {
        this.m_name = G.DataMgr.heroData.mateName;
        let str: string = TextFieldUtil.getColorText("协议离婚：\n", Color.YELLOW) +
            "向对方发出一封休书（需要对方在线）\n" +
            "经对方同意离婚后则可和平离婚\n" +
            TextFieldUtil.getColorText("强行离婚：\n", Color.YELLOW) +
            "可以无需对方同意，无需对方在线，立\n" +
            "即离婚但需要支付" + TextFieldUtil.getColorText("500钻石", Color.GREEN) + "的费用。\n" +
            TextFieldUtil.getColorText("失踪离婚：\n", Color.YELLOW) +
            "如对方失踪多天，可进行申报，经确认后\n" +
            "对方确实" + TextFieldUtil.getColorText("7天", Color.GREEN) + "未登陆过，则判为离婚成功\n" +
            TextFieldUtil.getColorText("离婚惩罚：\n", Color.RED) +
            "离婚后，婚姻系统的属性和情缘值将被" + TextFieldUtil.getColorText("冻结\n", Color.RED);
        this.infoText.text = str;
    }


    ////////////////////////////////////事件处理////////////////////////////////////

    /**
     * 点击协议离婚
     * @param event
     *
     */
    private _onTfXyClick(): void {
        let text: string = "确定要向" + TextFieldUtil.getColorText(this.m_name, Color.GREEN) + "发送解除仙缘协议？";
        this.m_cost = 0;
        G.TipMgr.showConfirm(text, ConfirmCheck.noCheck, "确定|取消", delegate(this, this._onConfirmCallBack, Macros.HY_DIVORCE_PACT));
    }

    /**
     * 点击强制离婚
     * @param e
     *
     */
    private _onTfQzClick(): void {
        this.m_cost = 500;
        let text: string = "确定要花费" + TextFieldUtil.getYuanBaoText(this.m_cost) + "直接解除仙缘？";
        G.TipMgr.showConfirm(text, ConfirmCheck.noCheck, "确定|取消", delegate(this, this._onConfirmCallBack, Macros.HY_DIVORCE_FORCE));
    }

    /**
     * 点击失踪离婚
     * @param e
     *
     */
    private _onTfSzClick(): void {
        this.m_cost = 0;
        let text: string = "确定要申请仙侣失踪解除仙缘？";
        G.TipMgr.showConfirm(text, ConfirmCheck.noCheck, "确定|取消", delegate(this, this._onConfirmCallBack, Macros.HY_DIVORCE_MISSING));
    }


    private _onConfirmCallBack(stage: number, isCheckSelected: boolean = false, type: number): void {
        if (MessageBoxConst.yes == stage) {
            if (G.DataMgr.heroData.gold >= this.m_cost) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMarryRequest(type));
                this.close();
            } else {
                G.TipMgr.showConfirm(uts.format('您的钻石不足{0},请前往充值', this.m_cost), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onClickConfirm));
            }
        }
    }


    private onClickConfirm(state: MessageBoxConst): void {
        if (state == MessageBoxConst.yes) {
            this.close();
            G.ActionHandler.go2Pay();
        }
    }



}
