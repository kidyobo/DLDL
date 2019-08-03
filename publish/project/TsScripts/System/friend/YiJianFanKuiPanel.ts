import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { FriendViewTab } from 'System/friend/FriendView'
import { UIUtils } from 'System/utils/UIUtils'
import { Macros } from 'System/protocol/Macros'

/**意见反馈面板*/
export class YiJianFanKuiPanel extends TabSubForm {

    private input: UnityEngine.UI.InputField;
    private btn_send: UnityEngine.GameObject;
    private content: string = '';
    private lastContent: string = '';

    constructor() {
        super(FriendViewTab.YiJianFanKuiPanel);
    }

    protected resPath(): string {
        return UIPathData.YiJianFanKuiPanel;
    }


    open() {
        super.open();
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOssGMList());
    }


    protected onClose() {

    }


    protected initElements() {
        this.input = this.elems.getInputField("input");
        this.btn_send = this.elems.getElement("btn_send");
    }


    protected initListeners() {
        this.addClickListener(this.btn_send, this.onClickBtnSend);
        this.input.onValueChanged = delegate(this, this.onInputChange);
    }


    private onInputChange(str: string) {
        this.content = str;
    }


    private onClickBtnSend() {
        if (G.DataMgr.heroData.ossGmTimes >= Macros.MAX_GMQA_COUNT) {
            G.TipMgr.addMainFloatTip("超过最大发送封了,等会在来吧");
            return;
        }
        if (this.content == "" || this.content == null) {
            G.TipMgr.addMainFloatTip("发送内容不能为空");
            return;
        }
        if (this.lastContent == this.content) {
            G.TipMgr.addMainFloatTip("不能重复发送");
            return;
        }
        this.lastContent = this.content;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getAddOssAdvanceRequest(0, this.content));
    }

}
