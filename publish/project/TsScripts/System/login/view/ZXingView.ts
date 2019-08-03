import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { Global as G } from 'System/global'
import { LoginView } from "System/login/view/LoginView";
export class ZXingView extends CommonForm {
    private icon: UnityEngine.UI.RawImage = null;
    private tex: UnityEngine.Texture2D;
    private encodeStr: string;
    private closeConnectFlag: boolean;
    private title: string;
    private tips: string;
    private closeCallback: () => void = null;
    layer(): UILayer {
        return UILayer.MessageBox;
    }

    open(text: string, closeConnectFlag: boolean, title: string, tips: string, closeCallback: () => void = null) {
        this.encodeStr = text;
        this.closeConnectFlag = closeConnectFlag;
        this.title = title;
        this.tips = tips;
        this.closeCallback = closeCallback;
        super.open();
    }

    protected resPath(): string {
        return UIPathData.ZXingView;
    }

    protected initElements() {
        this.icon = this.elems.getRawImage("icon");
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement("BT_Close"), this.onClickClose);
        this.addClickListener(this.icon.gameObject, this.onClickIcon);
    }

    protected onOpen() {
        uts.log(this.encodeStr);
        this.elems.getText("title").text = this.title;
        this.elems.getText("tips").text = this.tips;
        if (this.closeConnectFlag) {
            this.addTimer("delayclose", 120000, 1, this.onClickClose);
        }
        this.tex = Game.Barcode.EncodeString(this.encodeStr);
        this.icon.texture = this.tex;
    }

    protected onClose() {
        if (this.tex != null) {
            UnityEngine.GameObject.DestroyImmediate(this.tex);
            this.tex = null;
        }

        if (this.closeCallback) {
            this.closeCallback();
        }
    }

    private onClickClose() {
        if (this.closeConnectFlag) {
            G.ModuleMgr.netModule.closeConnect();
        }
        this.close();
    }

    private onClickIcon() {
        if (defines.has("DEVELOP") && this.closeConnectFlag) {
            G.ModuleMgr.netModule.closeConnect();
            this.close();
            let loginView = G.Uimgr.getForm<LoginView>(LoginView);
            if (loginView != null) {
                loginView.loginGameByZXING();
            }
        }
    }
}