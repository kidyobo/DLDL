import { UIPathData } from 'System/data/UIPathData';
import { CommonForm, UILayer } from 'System/uilib/CommonForm';
import { Global as G } from 'System/global';
import { TextFieldUtil } from '../../utils/TextFieldUtil';
import { Color } from '../../utils/ColorUtil';

export class MessageTipView extends CommonForm {
    private readonly AutoCloseTimerKey = '1';

    private btnClose: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private btnGo: UnityEngine.GameObject;
    private txtMessage: UnityEngine.UI.Text;
    constructor() {
        super(0);
    }
    layer(): UILayer {
        return UILayer.OnlyTip;
    }
    protected resPath(): string {
        return UIPathData.MessageTipView;
    }
    protected initElements(): void {
        this.btnClose = this.elems.getElement('btnClose');
        this.btnGo = this.elems.getElement('btnGo');
        this.mask = this.elems.getElement('mask');
        this.txtMessage = this.elems.getText('txtMessage');
    }
    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.mask, this.onClickBtnClose);
        this.addClickListener(this.btnGo, this.onClickBtnClose);
    }

    protected onOpen() {
        this.txtMessage.text = G.DataMgr.langData.getLang(478);
        // this.txtMessage.text = uts.format("每天{0}在线即有封测福利礼包领取，必定开出{1}X1，还有机会获得{2}，千万不要错过哦！",
        //     TextFieldUtil.getColorText("19点", Color.ITEM_GOLD),
        //     TextFieldUtil.getColorText("100钻石充值卡", Color.ITEM_PURPLE),
        //     TextFieldUtil.getColorText("【昊天·唐三】", Color.ITEM_PURPLE)
        // );
        this.addTimer(this.AutoCloseTimerKey, 180000, 1, this.onAutoCloseTimer);
    }

    protected onClose() {

    }

    private onAutoCloseTimer(timer: Game.Timer) {
        this.onClickBtnClose();
    }

    private onClickBtnClose() {
        this.close();
    }
}