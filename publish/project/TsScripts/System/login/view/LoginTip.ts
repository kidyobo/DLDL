import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'


export class LoginTip extends CommonForm {

    /**提示信息*/
    private infoText: UnityEngine.UI.Text = null;
    /**确定按钮*/
    private sureBt: UnityEngine.GameObject = null;
    private callback: (state: MessageBoxConst) => void = null;
    private infoShow: string;
    private isBtShow: boolean = false;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    open(info: string, btShow: boolean, callback: (state: MessageBoxConst) => void = null) {
        this.infoShow = info;
        this.isBtShow = btShow;
        this.callback = callback;
        super.open();
    }

    layer(): UILayer {
        return UILayer.MessageBox;
    }
    
    protected resPath(): string {
        return UIPathData.LoginTip;
    }

    protected initElements() {
        this.infoText = this.elems.getText("infoText");
        this.sureBt = this.elems.getElement("sureBt");              
    }

    protected initListeners() {
        this.addClickListener(this.sureBt, this.onClickSureBt);
    }
    protected onOpen() {
        this.updateView();
    }

    private updateView() {
        this.infoText.text = this.infoShow;
        if (this.isBtShow) {
            this.sureBt.SetActive(true);
        } else {
            this.sureBt.SetActive(false);
        }
    }

    protected onClose() {
    }


    private onClickSureBt() {
        this.close();
        this.doCall(MessageBoxConst.yes);
    }


    private doCall(choice: MessageBoxConst) {
        if (null != this.callback) {
            this.callback(choice);
        }
    }
}

