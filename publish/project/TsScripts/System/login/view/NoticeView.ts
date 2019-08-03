import { Global as G } from "System/global"
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { LoginView } from "System/login/view/LoginView"
import { UIPathData } from "System/data/UIPathData"
import { KeyWord } from 'System/constants/KeyWord'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { SpecialCharUtil } from 'System/utils/SpecialCharUtil'
import { RegExpUtil } from 'System/utils/RegExpUtil'

//公告窗口
export class NoticeView extends CommonForm {

    /**确定按钮*/
    private btn_sure: UnityEngine.GameObject;
    /**公告内容*/
    private contentText: UnityEngine.UI.UIText;


    open() {
        super.open();
    }

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.NoticeView;
    }

    protected onOpen() {
        this.clearPanel();
        if (G.IsIosTiShenEnv || G.ChannelSDK.gonggao_Content == '') {
            this.contentText.text = "亲爱的玩家,欢迎来到游戏";
            return;
        }
        this.contentText.text = G.ChannelSDK.gonggao_Content + '\n';
        this.contentText.ProcessText();
    }


    protected onClose() {

    }

    protected initElements() {
        this.btn_sure = this.elems.getElement("sureBt");
        this.contentText = this.elems.getUIText("contentText");
    }

    protected initListeners() {
        this.addClickListener(this.btn_sure, this.onClickSureBt);
        this.addClickListener(this.elems.getElement('mask'), this.onClickSureBt);
    }

    private onClickSureBt() {
        let view = G.Uimgr.getForm<LoginView>(LoginView);
        if (view != null) {
            view.mainPanel.SetActive(true);
        }
        this.close();
    }

    private clearPanel() {
        this.contentText.text = "";
    }
}
