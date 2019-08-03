import { Global as G } from "System/global"
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { NoticeView } from "System/login/view/NoticeView"
import { UIPathData } from "System/data/UIPathData"
import { ConfirmCheck } from 'System/tip/TipManager'
import { MessageBoxConst } from 'System/tip/TipManager'
import { LoginTip } from 'System/login/view/LoginTip'
import { ServerOneData } from 'System/data/ServerData'
import { UIUtils } from 'System/utils/UIUtils'
import { Macros } from "System/protocol/Macros"
import { ReportType } from "System/channel/ChannelDef"
import { AndroidAssetLoader } from "../../utils/AndroidAssetLoader";
import { FyGameLoginView } from 'System/FygameLogin/FyGameLoginView'
//登录窗口
export class LoginView extends CommonForm {

    mainPanel: UnityEngine.GameObject;
    private btn_selectServer: UnityEngine.GameObject;
    private btn_gongGao: UnityEngine.GameObject;
    private btn_loginGame: UnityEngine.GameObject;
    private versionText: UnityEngine.UI.Text;
    private accountInputField: UnityEngine.UI.InputField;
    private svrIdInputField: UnityEngine.UI.InputField;
    private platNameInput: UnityEngine.UI.InputField;
    private serverNameText: UnityEngine.UI.Text;
    private normalStage: UnityEngine.GameObject;
    private fireStage: UnityEngine.GameObject;
    private request: Game.AssetRequest;
    private selctedServerArea: UnityEngine.GameObject;
    private logoRawImage: UnityEngine.UI.RawImage;
    private saoma: UnityEngine.GameObject;
    private btn_saoma: UnityEngine.GameObject;
    private saomaImage: UnityEngine.UI.RawImage;
    private bt_back: UnityEngine.GameObject;
    private topaddictionText: UnityEngine.UI.Text;
    private copyrightText: UnityEngine.UI.Text;
    private hideMainPanel: boolean = false;
    private backPanel: UnityEngine.UI.RawImage;

    //fygame平台icon
    private float_Icon: UnityEngine.GameObject;

    open(hideMainPanel: boolean = false) {
        this.hideMainPanel = hideMainPanel;
        super.open();
    }

    updateMainPanel(hideMainPanel: boolean = false) {
        if (!this.isOpened) return;
        this.mainPanel.SetActive(!hideMainPanel);
    }

    hideLoginButton() {
        this.setLoginGameAreaActive(false);
    }

    showLoginButton() {
        this.setLoginGameAreaActive(true);
    }

    private setLoginGameAreaActive(active: boolean = true) {
        if (!this.isOpened) return;
        this.btn_loginGame.SetActive(active);
        this.selctedServerArea.SetActive(active);
    }

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.LoginView;
    }

    protected initElements() {
        this.mainPanel = this.elems.getElement("MainPanel");
        this.btn_selectServer = this.elems.getElement("ChangeServerBt");
        this.btn_gongGao = this.elems.getElement("btn_notice");
        this.btn_loginGame = this.elems.getElement("LoginGameBt");
        this.accountInputField = this.elems.getInputField("countInputField");
        this.svrIdInputField = this.elems.getInputField("svrIdInputField");
        this.platNameInput = this.elems.getInputField("platInput");
        this.versionText = this.elems.getText("Version");
        this.normalStage = this.elems.getElement('serverStageNormal');
        this.fireStage = this.elems.getElement('serverStageHuoBao');
        this.selctedServerArea = this.elems.getElement('SelectServerObj');
        this.logoRawImage = this.elems.getRawImage('logo');
        this.saoma = this.getElement("saoma");
        this.btn_saoma = this.getElement("btn_saoma");
        this.saomaImage = this.elems.getRawImage("saomaImage");
        this.bt_back = this.getElement("bt_back");
        this.serverNameText = this.elems.getText("serverName");
        this.topaddictionText = this.elems.getText('topaddiction');
        this.copyrightText = this.elems.getText('copyright');
        this.backPanel = this.elems.getRawImage('backPanel');
        this.backPanel.color = new UnityEngine.Color(0, 0, 0, 0);
        this.float_Icon = this.elems.getElement("btn_floatIcon");
        if (AndroidAssetLoader.exists(AndroidAssetLoader.loginPageAssetPath)) { //渠道包二次打包自定义的assets/loginpage.jpg
            AndroidAssetLoader.loadImage(AndroidAssetLoader.loginPageAssetPath, this.backPanel, this.backPanel.gameObject, delegate(this, this.onLoadBackImg))
        } else {
            this.backPanel.color = new UnityEngine.Color(1, 1, 1, 1);
        }
    }

    private onLoadBackImg(img: { texture: UnityEngine.Texture }) {
        (img as UnityEngine.UI.RawImage).color = new UnityEngine.Color(1, 1, 1, 1);
    }

    protected initListeners() {
        this.addClickListener(this.btn_selectServer, this.onClickChangeServerBt);
        this.addClickListener(this.btn_gongGao, this.onClickNoticeBt);
        this.addClickListener(this.btn_loginGame, this.onClickLoginGameBt);
        this.addClickListener(this.elems.getElement('canClickArea'), this.onClickChangeServerBt);
        if (defines.has('TESTUIN')) {
            this.accountInputField.onValueChanged = delegate(this, this.onAccountInputChange);
            this.platNameInput.onValueChanged = delegate(this, this.onPlatInputChange);
        }
        this.addClickListener(this.btn_saoma, this.onSaomaClick);
        this.addClickListener(this.bt_back, this.disableShaoMaStatus);
        this.addClickListener(this.float_Icon, this.onClickBtnFloatIcon);
    }


    protected onOpen() {
        this.updateMainPanel(this.hideMainPanel);
        this.accountInputField.gameObject.SetActive(defines.has('TESTUIN'));
        this.svrIdInputField.gameObject.SetActive(defines.has('TESTUIN'));
        this.platNameInput.gameObject.SetActive(defines.has('TESTUIN'));
        this.setLoginBtnEnabled(true);
        // 设置版权信息
        if (G.ChannelSDK.copyrightDesc == null) { //为了美观的处理
            this.topaddictionText.text = "";
            this.copyrightText.text = G.ChannelSDK.addictionDesc;
        }
        else {
            this.topaddictionText.text = G.ChannelSDK.addictionDesc;
            this.copyrightText.text = G.ChannelSDK.copyrightDesc;
        }
        if (defines.has('TESTUIN')) {
            let account = UnityEngine.PlayerPrefs.GetString("userName", '');
            if (account == '') {
                account = (Math.round(Math.random() * 90000) + 10000).toString();
            }
            this.accountInputField.text = account;
        }
        this.versionText.text = uts.format("版本：{0}({1})", UnityEngine.Application.version,
            Game.ResLoader.assetbundleVersion);
        this.loadLogo();
        if (G.IsEditor || G.IsWindowsPlatForm || defines.has('DEVELOP')) {
            this.begainAutoSelectServer();
        } else {
            if (G.ServerData.lastSelectedServer != null) {
                this.setGameParas(G.ServerData.lastSelectedServer);
            }
        }
        //这个条件暂时不用
        //if (Game.Tools.version >= 8) {

        //}
        if (!G.IsWindowsPlatForm && !G.IsEditor) {
            if (G.ChannelSDK.supportPCApp || G.DataMgr.settingData.IsEnableSaoma) {
                this.btn_saoma.SetActive(true);
            }
        }
        this.float_Icon.SetActive(G.ChannelSDK.ShowFloatIcon);
    }

    protected onClose() {
    }


    protected onDestroy() {
        if (this.request) {
            this.request.Abort();
        }
    }


    private onClickBtnFloatIcon() {
        G.Uimgr.createForm<FyGameLoginView>(FyGameLoginView).open(false);
    }

    private onPlatInputChange(value: string) {
        G.DataMgr.systemData.ossTestPlatName = value;
    }

    private onAccountInputChange(value: string) {
        //存放玩家账号
        UnityEngine.PlayerPrefs.SetString('userName', value);
        this.begainAutoSelectServer();
    }

    /**判断是否需要自动选择服务器*/
    begainAutoSelectServer() {
        if (G.ServerData.Count == 0) {
            G.Uimgr.createForm<LoginTip>(LoginTip).open('请检查,服务器列表没有一个服务器！', true);
            return;
        }
        let selectedServer = G.ServerData.getAutoSelectServer();
        if (selectedServer != null) {
            this.setGameParas(selectedServer);
        } else {
            this.serverNameText.text = '所有服务器都在维护中';
        }
    }

    setGameParas(data: ServerOneData) {
        G.DataMgr.gameParas.serverID = data.serverId;
        G.DataMgr.gameParas.worldID = data.serverId;
        G.DataMgr.gameParas.serverIp = data.serverIp;
        G.DataMgr.gameParas.serverPort = data.serverPort;
        G.DataMgr.gameParas.serverName = data.serverName;
        this.serverNameText.text = data.serverName;
        data.isHot ? this.setServerHotStage() : this.setServerNormalStage();
        this.setLoginBtnEnabled(true);
        G.ChannelSDK.report(ReportType.SELECTSERVER);
    }

    private setServerHotStage() {
        this.setServerStageActive(false, true);
    }

    private setServerNormalStage() {
        this.setServerStageActive(true, false);
    }

    private setServerStageActive(isNormal: boolean, isFire: boolean) {
        this.normalStage.SetActive(isNormal);
        this.fireStage.SetActive(isFire);
    }


    private onClickLoginGameBt() {
        this.clickLoginGame();
    }

    clickLoginGame() {
        if (!this.isOpened) return;
        //登录游戏按钮
        G.AudioMgr.playBtnClickSound();
        this.getTestData();
        if (G.IsWindowsPlatForm) {
            this.setLoginBtnEnabled(false);
            G.ModuleMgr.loginModule.loginGameForZXingPC();
        }
        else {
            G.ChannelSDK.loginGame(delegate(this, this.loginGame));
        }
    }
    loginGameByZXING() {
        G.DataMgr.gameParas.resetZXINGInfo();
        G.ChannelSDK.loginGame(delegate(this, this.loginGame));
    }

    private getTestData() {
        if (defines.has('TESTUIN')) {
            let account = this.accountInputField.text;
            G.DataMgr.gameParas.uin = parseInt(account);
            let svrId = parseInt(this.svrIdInputField.text);
            if (svrId > 0) {
                G.DataMgr.gameParas.serverID = svrId;
                G.DataMgr.gameParas.worldID = svrId;
            }
        }
    }

    setLoginBtnEnabled(value: boolean) {
        UIUtils.setButtonClickAble(this.btn_loginGame, value);
    }


    private loginGame() {
        this.setLoginBtnEnabled(false);
        G.ModuleMgr.loginModule.loginGame();
        //禁用按钮，防止重复点击，socket连接失败、list role失败后均需恢复
    }

    private onClickChangeServerBt() {
        //点击换服
        this.mainPanel.SetActive(false);
        G.ViewCacher.serverSelectView.open();
    }

    private onClickNoticeBt() {
        //公告按钮
        this.mainPanel.SetActive(false);
        G.Uimgr.createForm<NoticeView>(NoticeView).open();
    }

    private loadLogo() {
        if (AndroidAssetLoader.exists(AndroidAssetLoader.logoAssetPath)) { // 渠道包二次打包自定义的assets/logo.png
            AndroidAssetLoader.loadImage(AndroidAssetLoader.logoAssetPath, this.logoRawImage, this.logoRawImage.gameObject, delegate(this, this.onLoadLogoImg));
        } else {
            this.request = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.High1, uts.format('channel/logo/{0}.png', G.ChannelSDK.LogoId));
            Game.ResLoader.BeginAssetRequest(this.request, delegate(this, this.onLoadLogo));
        }
    }

    private onLoadLogoImg(img: { texture: UnityEngine.Texture }) { //渠道包二次打包自定义的assets/logo.png
        (img as UnityEngine.UI.RawImage).SetNativeSize();
    }

    private onLoadLogo(request: Game.AssetRequest) {
        if (request.error != null) {
            return;
        }
        this.logoRawImage.texture = request.mainAsset.texture;
        this.logoRawImage.SetNativeSize();
    }

    private forceUpdateRes() {
        Game.MemValueRegister.RegBool('abres:forceupdate', true);
        G.reloadGame(false);
    }

    private onSaomaClick() {
        let saomacom: Game.Barcode;
        if (Game.Barcode) {
            let btype = Game.Barcode.GetType();
            let t = new UnityEngine.Type();
            btype.InvokeMember = t.InvokeMember;
            btype.InvokeMember("isQuit", UnityEngine.BindingFlags.NonPublic | UnityEngine.BindingFlags.Static | UnityEngine.BindingFlags.SetField, null, null, [false]);
            saomacom = this.saoma.GetComponent(btype) as Game.Barcode;
            if (!saomacom) {
                saomacom = this.saoma.AddComponent(btype) as Game.Barcode;
            }
        }
        if (!saomacom) {
            return;
        }
        this.saoma.SetActive(true);
        this.saomaImage.texture = saomacom.texture;
        saomacom.imageTransform = this.saomaImage.transform;
        saomacom.onGetResult = delegate(this, this.onGetSaoMa);
    }

    private onGetSaoMa(str: string) {
        this.saoma.SetActive(false);
        this.setLoginBtnEnabled(false);
        this.getTestData();
        var data = null;
        try {
            data = JSON.parse(str);
        }
        catch (e) {
        }
        uts.log("str:" + str);
        let gameParas = G.DataMgr.gameParas;
        if (data != null) {
            if (data.productid) {
                if (gameParas.uin <= 0) {
                    this.disableShaoMaStatus();
                    G.Uimgr.createForm<LoginTip>(LoginTip).open('请等待，尚未成功连接到服务器', true);
                    return;
                }
                gameParas.worldID = data.serverid;
                gameParas.serverID == data.serverid
                gameParas.serverName = data.servername;
                G.DataMgr.heroData.name = data.name;
                G.DataMgr.heroData.setProperty(Macros.EUAI_LEVEL, data.level);
                //支付
                //先验证是否允许通过扫描
                if (data.gameid == Game.Config.gameid && data.channelid == G.ChannelSDK.ChannelID) {
                    if (gameParas.uin = data.uin) {
                        this.disableShaoMaStatus();
                        G.ChannelSDK.pay(data.productid);
                    }
                    else {
                        this.disableShaoMaStatus();
                        G.Uimgr.createForm<LoginTip>(LoginTip).open('PC端账号与本地账号不相同，请确定登陆了相同账号', true);
                    }
                }
                else {
                    this.disableShaoMaStatus();
                    G.Uimgr.createForm<LoginTip>(LoginTip).open('请确定是否登陆了与PC端相同的账号', true);
                }
            }
            else {
                gameParas.serverID = data.id;
                gameParas.worldID = data.id;
                gameParas.serverIp = data.ip;
                gameParas.serverPort = data.port;
                gameParas.serverName = data.name;
                //登陆
                //先验证是否允许通过扫描
                if (data.gameid == Game.Config.gameid && data.channelid == G.ChannelSDK.ChannelID) {
                    if (data.session != 0 && data.token != 0) {
                        G.ChannelSDK.loginGame(delegate(this, this.onRealSaoMaLogin, data.session, data.token));
                    }
                }
                else {
                    this.disableShaoMaStatus();
                    G.Uimgr.createForm<LoginTip>(LoginTip).open('PC端和手机设备不匹配，请确定是否安装了正确的PC版本', true);
                }
            }
        }
    }
    private onRealSaoMaLogin(session, token) {
        G.ModuleMgr.loginModule.loginGameForZXingMobile(session, token);
    }
    public isShaoMaStatus() {
        return this.saoma.activeSelf;
    }
    public disableShaoMaStatus() {
        this.saoma.SetActive(false);
        this.setLoginBtnEnabled(true);
    }
}