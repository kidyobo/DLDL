import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { Global as G } from 'System/global'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ConfirmCheck, MessageBoxConst } from "System/tip/TipManager"
import { RegExpUtil } from "System/utils/RegExpUtil"


enum ShowPanelType {
    Login = 0,
    Register = 1,
    xieYi = 2,
}

/**轻松游登录系统*/
export class FyGameLoginView extends CommonForm {

    //////////////////////ui////////////////////////
    /**注册面板*/
    private sign_Panel: UnityEngine.GameObject;
    private input_SignUser: UnityEngine.UI.InputField;
    private input_SignPassword: UnityEngine.UI.InputField;
    private input_SignPasswordSecond: UnityEngine.UI.InputField;
    private toggle_signAgree: UnityEngine.UI.ActiveToggle;
    private btn_signAgree: UnityEngine.GameObject;
    private btn_signResgister: UnityEngine.GameObject;
    private btn_signReturn: UnityEngine.GameObject;
    /**登录面板*/
    private login_Panel: UnityEngine.GameObject;
    private input_LoginUser: UnityEngine.UI.InputField;
    private input_LoginPassword: UnityEngine.UI.InputField;
    private btn_Login: UnityEngine.GameObject;
    private btn_OneKeyLogin: UnityEngine.GameObject;
    private btn_LoginRegister: UnityEngine.GameObject;
    /**协议面板*/
    private agreement_Panel: UnityEngine.GameObject;
    private btnAgreement_Return: UnityEngine.GameObject;
    //////////////////////data/////////////////////////
    private userName: string = '';
    private userPassWord: string = '';
    private userPassWordSecond: string = '';


    private isAutoLogin: boolean = true;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    open(isAutoLogin: boolean = true) {
        this.isAutoLogin = isAutoLogin;
        super.open();
    }

    layer(): UILayer {
        return UILayer.Pay;
    }

    protected resPath(): string {
        return UIPathData.FyGameLoginView;
    }

    protected initElements() {
        //注册界面
        this.sign_Panel = this.elems.getElement('RegisterPanel');
        this.input_SignUser = ElemFinder.findInputField(this.sign_Panel, 'user_input');
        this.input_SignPassword = ElemFinder.findInputField(this.sign_Panel, 'password_input');
        this.input_SignPasswordSecond = ElemFinder.findInputField(this.sign_Panel, 'password_input1');
        this.toggle_signAgree = ElemFinder.findActiveToggle(this.sign_Panel, 'toggle');
        this.btn_signAgree = ElemFinder.findObject(this.sign_Panel, 'btnrule');
        this.btn_signResgister = ElemFinder.findObject(this.sign_Panel, 'btn_register');
        this.btn_signReturn = ElemFinder.findObject(this.sign_Panel, 'btn_return');
        //登录界面
        this.login_Panel = this.elems.getElement('LoginPanel');
        this.input_LoginUser = ElemFinder.findInputField(this.login_Panel, 'user_input');
        this.input_LoginPassword = ElemFinder.findInputField(this.login_Panel, 'password_input');
        this.btn_Login = ElemFinder.findObject(this.login_Panel, 'btn_login');
        this.btn_OneKeyLogin = ElemFinder.findObject(this.login_Panel, 'btn_yiJianLogin');
        this.btn_LoginRegister = ElemFinder.findObject(this.login_Panel, 'btn_zhuce');
        //用户协议界面
        this.agreement_Panel = this.elems.getElement('xieYiPanel');
        this.btnAgreement_Return = ElemFinder.findObject(this.agreement_Panel, 'btn_return');
    }

    protected initListeners() {
        //登录界面
        this.addClickListener(this.btn_Login, this.onClickBtnLogin);
        this.addClickListener(this.btn_OneKeyLogin, this.onClickBtnOneKeyLogin);
        this.addClickListener(this.btn_LoginRegister, this.onClickBtnLoginRegister);
        //注册界面
        this.addClickListener(this.btn_signResgister, this.onClickBtnSignRegister);
        this.addClickListener(this.btn_signAgree, this.onClickBtnAgree);
        this.addClickListener(this.btn_signReturn, this.onClickBtnSignReturn);
        this.input_LoginPassword.contentType = UnityEngine.UI.InputField.ContentType.Password;
        this.input_SignPassword.contentType = UnityEngine.UI.InputField.ContentType.Password;
        this.input_SignPasswordSecond.contentType = UnityEngine.UI.InputField.ContentType.Password;
        //协议界面
        this.addClickListener(this.btnAgreement_Return, this.onClickBtnAgreeReturn);
    }


    protected onOpen() {
        this.showPanel(ShowPanelType.Login);
        let userName = G.DataMgr.fygameLoginData.getLastTimeLoginUser();
        if (userName != null) {
            //有登录过的账号
            this.userName = userName;
            this.userPassWord = G.DataMgr.fygameLoginData.getPassWordByUserName(this.userName);
            this.input_LoginUser.text = this.userName;
            this.input_LoginPassword.text = this.userPassWord;
            if (this.isAutoLogin) {
                this.login();
            }         
        }
    }

    protected onClose() {
    }

    /////////////////////登录面板/////////////////////////
    private onClickBtnLogin() {
        this.userName = this.input_LoginUser.text;
        this.userPassWord = this.input_LoginPassword.text;
        this.userName = this.getRegStr(this.userName);
        this.userPassWord = this.getRegStr(this.userPassWord);
        this.login();
    }


    private getRegStr(value: string) {
        value = RegExpUtil.getKeyBoardEnterStr(value);
        value = RegExpUtil.removeAllBlanks(value);
        return value;
    }


    private login() {
        if (!this.checkInputPass) return;
        //前端检验通过,开始后端检验
        G.ChannelSDK.startCheckUserAccount(this.userName, this.userPassWord);
    }

    private get checkInputPass(): boolean {
        if (this.userName == '') {
            this.tip('用户名为空,请输入用户名');
            return false;
        }
        if (this.userName.length > 20) {
            this.tip('用户名太长');
            return false;
        }
        if (this.userPassWord == '') {
            this.tip('密码为空,请输入密码');
            return false;
        }
        let data = G.DataMgr.fygameLoginData;
        let checkUserName = data.checkIsIllegal(this.userName);
        if (checkUserName != '') {
            this.tip('用户名包含不允许的字符,用户名只能是A-Z,a-z,0-9,@,_这些字符');
            return false;
        }
        let checkPassWord = data.checkIsIllegal(this.userPassWord);
        if (checkPassWord != '') {
            this.tip('密码包含不允许的字符,密码只能是A-Z,a-z,0-9,@,_这些字符');
            return false;
        }
        return true;
    }


    private onClickBtnOneKeyLogin() {
        this.userName = G.DataMgr.fygameLoginData.getRandomUserName();
        this.userPassWord = G.DataMgr.fygameLoginData.getRandomUserPassWord();
        if (!this.checkInputPass) {
            G.TipMgr.showConfirm("随机账号有问题,请重试", ConfirmCheck.noCheck, '确定', delegate(this, this.onConfirmTry));
            return;
        }
        G.ChannelSDK.startRegisterUser(this.userName, this.userPassWord);
    }



    private onConfirmTry(stage: MessageBoxConst, isCheckSelected: boolean): void {
        if (stage == MessageBoxConst.yes) {
            this.onClickBtnOneKeyLogin();
        }
    }


    private onClickBtnLoginRegister() {
        this.showPanel(ShowPanelType.Register);
    }

    /////////////////////注册面板/////////////////////////
    private onClickBtnSignRegister() {
        this.userName = this.input_SignUser.text;
        this.userPassWord = this.input_SignPassword.text;
        this.userPassWordSecond = this.input_SignPasswordSecond.text;
        this.userName = this.getRegStr(this.userName);
        this.userPassWord = this.getRegStr(this.userPassWord);
        this.userPassWordSecond = this.getRegStr(this.userPassWordSecond);
        if (!this.checkInputPass) return;
        if (this.userPassWord != this.userPassWordSecond) {
            this.tip("两次密码输入不一致");
            return;
        }
        if (!this.toggle_signAgree.isOn) {
            this.tip("请阅读用户协议并同意");
            return;
        }
        G.ChannelSDK.startRegisterUser(this.userName, this.userPassWord);
    }

    private onClickBtnAgree() {
        this.showPanel(ShowPanelType.xieYi);
    }

    private onClickBtnSignReturn() {
        this.showPanel(ShowPanelType.Login);
    }

    ///////////////////////用户协议面板///////////////////
    private onClickBtnAgreeReturn() {
        this.showPanel(ShowPanelType.Register);
    }

    /////////////////////////通用////////////////////////

    private showPanel(type: number) {
        if (type == ShowPanelType.Login) {
            this.login_Panel.SetActive(true);
            this.sign_Panel.SetActive(false);
            this.agreement_Panel.SetActive(false);
        }
        else if (type == ShowPanelType.Register) {
            this.login_Panel.SetActive(false);
            this.sign_Panel.SetActive(true);
            this.agreement_Panel.SetActive(false);
        }
        else if (type == ShowPanelType.xieYi) {
            this.login_Panel.SetActive(false);
            this.sign_Panel.SetActive(false);
            this.agreement_Panel.SetActive(true);
        }
    }


    private tip(msg: string) {
        G.TipMgr.showConfirm(msg, ConfirmCheck.noCheck, '关闭', null);
    }
}


