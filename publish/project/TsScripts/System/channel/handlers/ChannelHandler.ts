import {
    IChannelHandler,
    Msg,
    MsgType,
    PlatUrlCfg,
    ReportType,
    ResultType,
    PlatformCfg,
    PayExtensionFlag,
} from "System/channel/ChannelDef";
import { GameIdDef } from "System/channel/GameIdDef";
import { MyUserInfo } from "System/channel/handlers/MyUserInfo";
import { Compatible } from "System/Compatible";
import { EnumLoadUrl, EnumLoginStatus } from "System/constants/GameEnum";
import { Global as G, Global } from "System/global";
import { LoginView } from "System/login/view/LoginView";
import { ConfirmCheck, MessageBoxConst } from "System/tip/TipManager";
import { JavaCaller } from "System/utils/JavaCaller";
import { SafeJson } from "System/utils/SafeJson";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { TimeoutFlag } from "System/utils/TimeoutUtil";
import { UrlUtil } from "System/utils/UrlUtil";
import { AndroidPlatFormUrlCfg } from 'System/channel/AndroidPlatFormUrlCfg'
import { IosPlatFormUrlCfg } from 'System/channel/IosPlatFormUrlCfg'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from "../../constants/KeyWord";
import { WinPlatFormUrlCfg } from "../WinPlatFormUrlCfg";
import { ZXingView } from "../../login/view/ZXingView";
import { FyGameLoginView } from 'System/FygameLogin/FyGameLoginView'
import { StringUtil } from "../../utils/StringUtil";
import { FyGamePay } from "./FyGamePay/FyGamePay";

class PayInfo {
    orderId: string = '';
    payType: string = '';
    currency: string = '';
    price: string = '';
}

export class ChannelHandler implements IChannelHandler {

    user: MyUserInfo = new MyUserInfo();
    private loginedNextCall: (result: number) => void = null;
    private delayLoginTimer: Game.Timer = null;
    private delayReportTimer: Game.Timer = null;
    /**西游平台需要获取两次uin,需要缓存*/
    protected isNewUser: boolean = false;
    protected getUinTryTimes: number = 0;
    protected getOrderIdTryTimes: number = 0;
    protected paying = new TimeoutFlag();
    private isNeedRefreshServer: boolean = false;
    protected getOrderAppendParams(): { [index: string]: any } { return {}; }
    protected get serverListFromSdk(): boolean { return false }
    protected onPayEnd(msg: Msg) { }
    protected onExitLogout(msg: Msg) { }
    protected onServerList(msg: Msg) { }
    protected onChangeAccount(msg: Msg) { }
    protected get needReInitSdk(): boolean { return false; }
    protected get needForceLogin(): boolean { return false; }
    protected onInitSuccess(msg: Msg) { }
    protected accountChanged(msg: Msg): boolean { return true; }
    protected get userNeedURIEncode(): boolean { return true; }
    protected payInfo: PayInfo = new PayInfo();

    /////////////////////////////登录界面按钮操作//////////////////////////////////
    protected hideLoginButton() {
        let loginView = G.Uimgr.getForm<LoginView>(LoginView);
        if (loginView != null) loginView.hideLoginButton();
    }
    protected showLoginButton() {
        let loginView = G.Uimgr.getForm<LoginView>(LoginView);
        if (loginView != null) loginView.showLoginButton();
    }
    private timeOutShowHideLoginButton() {
        this.hideLoginButton();
        new Game.Timer('showloginbtn', 20 * 1000, 1, delegate(this, this.onBtnHideTimeout))
    }
    private onBtnHideTimeout(timer) {
        this.showLoginButton();
    }
    /////////////////////////////////////////获取url///////////////////////////////////
    get payKey(): string {
        return '#FYGAMEMOBILE#2017#PAYCOMMONKEY154@^$^%(*9183098abaccde';
    }
    get loginKey(): string {
        return '#FYGAMEMOBILE#2017#COMMONKEY24@^$^%(*9183098abcdhghhde';
    }

    isShowFloatIcon(): boolean {
        return this.getPlatformCfg().isFyGameLogin;
    }

    isShowBtnRecord(): boolean {
        return this.getPlatformCfg().hasRecordFunction;
    }

    private getPlatformCfg(): PlatformCfg {
        if (G.IsAndroidPlatForm) {
            return AndroidPlatFormUrlCfg[G.AppCfg.Gameid];
        }
        else if (G.IsWindowsPlatForm) {
            return WinPlatFormUrlCfg[G.AppCfg.Gameid];
        }
        else {
            return IosPlatFormUrlCfg[G.AppCfg.Gameid];
        }
    }

    protected baseUrlInfo(fromIp: boolean): { baseurl: string, channelTag: string } {
        let cfg = this.getPlatformCfg();
        let urlcfg = cfg.urlcfg;
        if (cfg.urlcfgsByChannel != null) {
            let url = cfg.urlcfgsByChannel[this.ChannelID];
            if (url != null) {
                urlcfg = url;
            }
        }
        return urlcfg;
    }

    protected payUrl(fromIp: boolean): string {
        let baseinfo = this.getBaseInfo(fromIp);
        return baseinfo.baseurl + baseinfo.channelTag + 'getorderid.php?user_name={user_name}&server={server}&coin={coin}&uin={uin}&time={time}&sign={sign}&userid={userid}&productid={productid}&productname={productname}&productdesc={productdesc}&rolename={rolename}&servername={servername}&rolelevel={rolelevel}&pid={pid}&channel={channel}&extension={pay_ext}&pay_type={pay_type}&openid={org_username}&device_id={device_id}';
    }
    protected loginUrl(fromIp: boolean): string {
        let baseinfo = this.getBaseInfo(fromIp);
        return baseinfo.baseurl + baseinfo.channelTag + 'login.php?user_name={user_name}&server={server}&token={token}&time={time}&sign={sign}&sid={sid}&openid={org_username}&sdk_version={sdk_version}&channel={channel}&session_id={session_id}&sdk={channel}&logintype={yybplatform}&sandbox={sandbox}';
    }
    protected svrListUrl(fromIp: boolean): string {
        let baseinfo = this.getBaseInfo(fromIp);
        return baseinfo.baseurl + baseinfo.channelTag + 'svrlist.php';
    }
    protected dirtyUrl(fromIp: boolean): string {
        let baseinfo = this.getBaseInfo(fromIp);
        return baseinfo.baseurl + baseinfo.channelTag + 'dirty.php?str={str}&time={time}&sign={sign}';
    }

    private getBaseInfo(fromIp: boolean): { baseurl: string, channelTag: string } {
        // 先查表
        let urlBaseInfo = this.getUrlByConfig(fromIp);
        if (urlBaseInfo) return urlBaseInfo;
        // 表里没有再看看platHandler里面有没有
        return this.baseUrlInfo(fromIp);
    }

    //通过表格获取url
    private getUrlByConfig(fromIp: boolean): { baseurl: string, channelTag: string } {
        if (!G.IsIOSPlatForm) return null;
        let data = G.DataMgr.dabaoData.getIosDaBaoDataByGameId(G.AppCfg.Gameid);
        if (!data) return null;
        let urlTag: PlatUrlCfg = {
            baseurl: data.m_szBaseUrl
            , ipfmt: data.m_szIpfmt
            , ips: [data.m_szIps]
            , channelTag: data.m_szChannelTag
        };
        return this.getUrls(fromIp, urlTag);
    }

    protected getUrls(fromIp: boolean, urls: PlatUrlCfg): { baseurl: string, channelTag: string } {
        let rtUrls = { baseurl: urls.baseurl, channelTag: urls.channelTag };
        if (fromIp && urls.ips.length > 0) {
            let index = Math.floor(urls.ips.length * Math.random());
            rtUrls = { baseurl: uts.format(urls.ipfmt, urls.ips[index]), channelTag: urls.channelTag };
        }
        return rtUrls;
    }

    ///////////////////////////////////////sdkOnMessage////////////////////////////////////////////////////////////
    onMessage(msg: Msg) {
        if (msg.msgtype != MsgType.REQUESTSERVERS) {
            uts.log("ChannelHandler Msg:= " + JSON.stringify(msg));
        }
        //具体操作
        if (msg.msgtype == MsgType.INIT_SDK) {
            this.onInitSDK(msg);
        }
        else if (msg.msgtype == MsgType.LOGIN) {
            Game.MemValueRegister.RegString('sdk:logincache', JSON.stringify(msg));
            Game.MemValueRegister.RegBool('sdk:firstlogin', true);
            this.onLogin(msg);
        }
        else if (msg.msgtype == MsgType.PAY) {
            this.paying.stop();
            this.onPay(msg);
        }
        else if (msg.msgtype == MsgType.LOGOUT) {
            this.onLogout(msg);
        }
        else if (msg.msgtype == MsgType.EXIT) {
            this.onExit(msg);
        }
        else if (msg.msgtype == MsgType.ANTIADDICTION) {
            this.onAntiaddiction(msg);
        }
        else if (msg.msgtype == MsgType.PAYEND) {
            this.onPayEnd(msg);
        }
        else if (msg.msgtype == MsgType.EXITLOGOUT) {
            this.onExitLogout(msg);
        }
        else if (msg.msgtype == MsgType.REQUESTSERVERS) {
            this.onServerList(msg);
            if (G.ServerData.xiyouServerListHasFinshSetting || G.ServerData.isNeiWangOssTest) {
                this.startAutoSelectServerAndGetUin();
            }
        }
        else if (msg.msgtype == MsgType.CHANGEACCOUNT) {
            this.onChangeAccount(msg);
        }
        else if (msg.msgtype == MsgType.UPDATERECORDSTATE) {
            if (G.ViewCacher.mainView != null) {
                G.ViewCacher.mainView.updateRecordBtnState(msg.result);
            }
        }
    }

    canSwitchLogin(): boolean {
        return G.SdkCaller.hasLogout();
    }

    switchLogin() {
        G.ChannelSDK.setLogoutFlag(true);
        G.reloadGame(false);
    }

    serVerListFromSDK(): boolean {
        return this.serverListFromSdk;
    }

    start() {
        G.SdkCaller.start();
    };
    destory() {
        G.SdkCaller.destory();
    };

    get PlatformType(): number {
        return G.AppCfg.Plat * 10000 + G.AppCfg.Gameid;
    }

    setLogoutFlag(needLogout: boolean) {
        Game.MemValueRegister.RegBool('sdkneedlogout', needLogout);
    }

    checkApk(nextcall: () => void) {
        nextcall();
    }

    ///////////////////////////////////////login/////////////////////////////////////////////
    login(callback: (result: number) => void) {
        uts.log('ChannelHandler login game');
        this.loginedNextCall = callback;
        this.stopTimer(this.delayLoginTimer);
        // gm 登录其他人账号处理
        if (this.gmLoginOther()) return;
        this.timeOutShowHideLoginButton();
        this.delayLoginTimer = new Game.Timer('sdk login', 1, 1, delegate(this, this.delayLogin));
    }

    private delayLogin(timer: Game.Timer) {
        this.delayLoginTimer = null;
        if (this.getPlatformCfg().isFyGameLogin) {
            G.Uimgr.createForm<FyGameLoginView>(FyGameLoginView).open();
        } else {
            if (!G.SdkCaller.sdkIsInit()) { //还没初始化
                uts.log('delayLogin:init sdk');
                this.initSdk();
            }
            else if (!G.SdkCaller.sdkIsLogined()) { //还没有登录或者强制登录
                uts.log('delayLogin:dologin');
                if (this.needReInitSdk) this.initSdk();
                G.SdkCaller.doLogin();
            }
            else if (this.needForceLogin) {
                uts.log('delayLogin:every time dologin');
                G.SdkCaller.doLogin();
            }
            else if (!this.needLogout()) { //当前是登录状态同时不需要登出操作
                let smsg = Game.MemValueRegister.GetString('sdk:logincache');
                uts.log('delayLogin:dologin use cached');
                let msg = SafeJson.parse(smsg) as Msg;
                if (msg == null) {
                    this.tipReLogin('解析logout消息失败，请重试！');
                    return;
                }
                this.onLogin(msg);
            }
            else {//当前是登录状态同时需要登出操作
                uts.log('delayLogin:dologout');
                this.setLogoutFlag(false);
                G.SdkCaller.doLoginOut();
            }
        }
    }

    loginGame(callback: () => void) {
        uts.log('Channel Handler CallBack');
        if (G.DataMgr.gameParas.uin != 0) {
            this.getUinCallBack(callback);
        }
        else {
            this.reLogin();
        }
    }

    private getUinCallBack(callback: () => void) {
        if (this.serverChanged()) {
            uts.log('getUin');
            this.getUin(callback);
        }
        else {
            uts.log('callBack');
            callback();
        }
    }

    quit() {
        if (G.SdkCaller.isShowExitDialog()) {
            G.SdkCaller.exit();
        } else {
            G.TipMgr.showConfirm('确定要退出游戏？', ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmQuit));
        }
    }

    get LogoId(): number {
        return G.AppCfg.Gameid;
    }
    get GonggaoChannelID(): string {
        return G.AppCfg.Gameid.toString();
    }
    get ChannelID(): string {
        let channelId = G.SdkCaller.getChannelId();
        if (channelId == null || channelId == "") {
            channelId = G.AppCfg.Gameid.toString();
        }
        return channelId;
    }
    getServerListUrl(fromIp: boolean): string {
        if (defines.has('TEST_APK'))
            return this.testSvrListUrl(fromIp);
        else
            return this.svrListUrl(fromIp);
    }
    getDirtyUrl(fromIp: boolean): string {
        return this.dirtyUrl(fromIp);
    }
    refreshPayState() {
    }
    get canHideLoginButton(): boolean { return true; }

    protected initSdk() {
        G.SdkCaller.initSdk();
    }

    protected testSvrListUrl(fromIp: boolean): string {
        return this.svrListUrl(fromIp);
    }

    protected onExit(msg: Msg) {
        this.report(ReportType.EXITGAME);
        if (msg.result == ResultType.OK) {
            UnityEngine.Application.Quit();
        }
    }

    protected onAntiaddiction(msg: Msg) {
    }

    protected onInitSDK(msg: Msg) {
        if (msg.result == ResultType.OK) {
            uts.log('onInitSDK:dologin');
            this.onInitSuccess(msg);
            G.SdkCaller.doLogin();
        }
        else {
            this.showLoginButton();
            this.tipReLogin('初始化异常，请重试！');
            uts.log("初始化sdk异常，请退出重试！详情：" + JSON.stringify(msg));
            this.notifyLogin(-1);
        }
    }
    protected onLogin(msg: Msg) {
        if (msg.result == ResultType.OK) {
            let isInGame = G.DataMgr.runtime.loginStatus == EnumLoginStatus.logined || G.DataMgr.runtime.isCreatingRole;
            let needReload = isInGame && this.accountChanged(msg);
            if (needReload) {
                // 在游戏运行中收到sdk登录成功消息，都是sdk用户中心切换账号行为，这时要退出到游戏登录界面（应用宝除外）
                G.reloadGame(false);
            }
            this.user.login_time = Math.floor(new Date().getTime() / 1000);
            this.onLoginSuccess(msg);
            Compatible.setBuglyUserId(this.user.username != null ? String(this.user.username) : 'unkown');
            if (!this.serverListFromSdk && !isInGame) {
                this.startAutoSelectServerAndGetUin();
            }
        }
        else {
            this.showLoginButton();
            this.onLoginFailure(msg);
            this.tipReLogin("登录错误，请重试！");
        }
    }

    protected onLoginFailure(msg: Msg) {
        G.DataMgr.gameParas.uin = 0;
    }

    protected onLoginSuccess(msg: Msg) {
        this.user.username = msg.userid;
        this.user.token = msg.token;
        this.user.channelId = this.ChannelID;
    }

    protected onLogout(msg: Msg) {
        uts.log('onLogout, loginStatus:' + G.DataMgr.runtime.loginStatus);
        this.report(ReportType.EXITGAME);
        if (G.DataMgr.runtime.loginStatus != EnumLoginStatus.logined) {
            uts.log('onLogout:dologin');
            this.hideLoginButton();
            G.SdkCaller.doLogin();
        }
        else {
            G.reloadGame(false);
        }
    }

    protected needLogout(): boolean {
        return Game.MemValueRegister.GetBool('sdkneedlogout');
    }

    private reLogin() {
        uts.log('relogin game');
        this.login(this.loginedNextCall);
    }

    private startAutoSelectServerAndGetUin() {
        UnityEngine.PlayerPrefs.SetString('userName', this.user.username);
        this.autoSelectServer();
        this.getUin(null);
    }

    private autoSelectServer() {
        let view = G.Uimgr.getForm<LoginView>(LoginView);
        if (view != null) {
            view.begainAutoSelectServer();
        }
    }

    protected getCoin(cfg: GameConfig.ChargeGiftConfigM): number {
        let coin = cfg.m_iChargeRMB;
        if (defines.has('TEST_APK')) {
            coin = 1;
        }
        return coin;
    }
    protected tipReLogin(msg: string) {
        G.TipMgr.showConfirm(msg, ConfirmCheck.noCheck, '重试', delegate(this, this.onTipReLogin));
    }
    private onTipReLogin() {
        this.reLogin();
    }
    private abort(msg: string) {
        G.TipMgr.showConfirm(msg, ConfirmCheck.noCheck, '退出', delegate(this, this.onExitGame));
    }
    private onExitGame() {
        UnityEngine.Application.Quit();
    }
    protected tip(msg: string) {
        G.TipMgr.showConfirm(msg, ConfirmCheck.noCheck, '关闭', null);
    }
    private notifyLogin(result: number) {
        if (this.loginedNextCall != null) {
            this.loginedNextCall(result);
        }
    }
    private stopTimer(timer: Game.Timer) {
        if (timer != null) {
            timer.Stop();
        }
    }
    private onConfirmQuit(state: MessageBoxConst, isCheckSelected: boolean) {
        if (state == MessageBoxConst.yes) {
            this.confirmQuitApp();
        }
    }
    protected confirmQuitApp() {
        this.report(ReportType.EXITGAME2);
        UnityEngine.Application.Quit();
    }
    protected get systemInfo(): string {
        let nettype = UnityEngine.Application.internetReachability == UnityEngine.NetworkReachability.ReachableViaLocalAreaNetwork ? 'wifi' : '3G/4G';
        let sysinfo = Compatible.getSystemInfo();
        let size = Compatible.getCurScreenResolution();
        return 'platformtype=' + this.PlatformType
            + '&mobile=' + sysinfo.deviceModel + '_' + Compatible.getDeviceInfo().cpu_abi
            + '&screensize=' + size.width + 'x' + size.height
            + '&osversion=' + sysinfo.operatingSystem
            + '&nettype=' + nettype
            + '&deviceid=' + UnityEngine.SystemInfo.deviceUniqueIdentifier
            + '&appversion=' + UnityEngine.Application.version;
    }
    private serverChanged(): boolean {
        return this.user.lastsvrid != G.DataMgr.gameParas.serverID;
    }
    private gmLoginOther(): boolean {
        if (!Game.MemValueRegister.GetBool('loginother'))
            return false;
        let sign = Game.MemValueRegister.GetString('loginother:sign');
        let time = Game.MemValueRegister.GetString('loginother:time');
        let uin = Game.MemValueRegister.GetString('loginother:uin');
        let server = Game.MemValueRegister.GetString('loginother:server');
        let openid = Game.MemValueRegister.GetString('loginother:openid');
        let serverdata = G.ServerData.getServerDataById(Number(server), '');
        let loginView = G.Uimgr.getForm<LoginView>(LoginView);
        if (loginView != null) {
            loginView.setGameParas(serverdata);
        }
        this.user.username = openid;
        this.user.uin = Number(uin);
        this.user.sign = sign;
        this.setGameParas(1, Number(time), sign);
        this.notifyLogin(1);
        Game.MemValueRegister.RegBool('loginother', false);
        return true;
    }

    supportPCApp(): boolean {
        return false;
    }

    /////////////////////////////////获取uin////////////////////////////////////////////

    private getUin(callback: () => void) {
        let isNotverifysvr = !Game.MemValueRegister.GetBool('sdk:firstlogin');
        let url = this.getFactLoginUrl(isNotverifysvr);
        uts.log('get uin url:' + url);
        UrlUtil.loadTextFromFullUrl(url, delegate(this, this.onGetUin, this.user.login_time, callback), EnumLoadUrl.GetUinTimeOut);
    }

    protected getFactLoginUrl(isNotverifysvr: boolean) {
        let org_username = this.user.org_username != '' ? this.user.org_username : this.user.username;
        this.user.lastsvrid = G.DataMgr.gameParas.serverID;
        let svrid = G.DataMgr.gameParas.serverID.toString();
        let time = String(this.user.login_time);
        let fromIp = this.getUinTryTimes > 0;
        let url = this.loginUrl(fromIp).replace('{user_name}', this.userNeedURIEncode ? encodeURIComponent(this.user.username) : this.user.username)
            .replace(/{server}/g, svrid)
            .replace(/{token}/g, encodeURIComponent(this.user.token))
            .replace(/{time}/g, time)
            .replace(/{sign}/g, this.getUinParamSign(time))
            .replace(/{sid}/g, this.user.login_sid)
            .replace(/{sdk_version}/g, this.user.sdk_version)
            .replace(/{channel}/g, this.user.channelId == "empty" ? G.ChannelSDK.NewChannelId : this.user.channelId)
            .replace(/{org_username}/g, org_username)
            .replace(/{session_id}/g, this.user.sessionId)
            .replace(/{yybplatform}/g, this.user.yyb_platform)
            .replace(/{sandbox}/g, this.user.sandbox);
        if (isNotverifysvr) {
            url = url + '&notverifysvr=1';
        }
        return url + '&' + this.systemInfo;
    }

    private onGetUin(error: string, content: string, platTime: number, callback: () => void) {
        if (error != null) {
            uts.logWarning('get uin error:' + error);
            if (++this.getUinTryTimes < EnumLoadUrl.GetUinTryTimes) {
                this.getUin(callback);
            }
            else {
                this.showLoginButton();
                G.DataMgr.gameParas.uin = 0;
                this.getUinTryTimes = 0;
                this.tipReLogin('获取用户UIN网络异常，请重新登录！');
            }
            return;
        }
        uts.log('uin content:' + content);
        let json = SafeJson.parse(content);
        if (json == null) {
            this.tipReLogin('解析用户UIN异常，请重新登录！详情：' + content);
            return;
        }
        let loginData = json as PlatCommomData.LoginData;
        if (loginData.errcode != 0) {
            this.onGetUinFailure(content, loginData);
            return;
        }
        this.user.uin = loginData.uin;
        this.user.payurl = loginData.payurl;
        this.user.openAAS = loginData.aas == 1;
        this.user.openCharge = loginData.charge == 1;
        this.user.sign = loginData.sign;
        //如果openid是empty需要重新自动选服
        this.isNeedRefreshServer = this.user.username == "empty";
        //有的平台是在此处获取username,openid由服务器下发的
        this.onGetUinSuccess(loginData);
        Game.MemValueRegister.RegBool('sdk:firstlogin', false);
        this.setGameParas(loginData.isadult, platTime, loginData.sign);
        G.DataMgr.gameParas.forbidvoice = Number(json.forbidvoice) === 1; // 语音sdk稳定后删除
        G.DataMgr.iosNotifyData.isRegisterApplePush = loginData.iosNoPush == 1 ? false : true; //是否注册ios消息推送,防止有一次出现卡住游戏登陆的情况
        this.isNewUser = this.serverListFromSdk ? this.isNewUser : (loginData.isnewbie == 1);//西游平台(用第一次getuin的数据)
        G.DataMgr.heroData.isNewPlayer = this.isNewUser;
        this.isNewUser ? this.hideLoginButton() : this.showLoginButton();
        this.notifyLogin(this.isNewUser ? 1 : 0);
        uts.log('最终getuin:' + this.user.uin);
        if (this.isNeedRefreshServer && !this.isNewUser) {
            uts.log("重新自动选服");
            this.autoSelectServer();
        }
        if (callback != null) {
            callback();
        }
    }

    protected onGetUinSuccess(uinjson: PlatCommomData.LoginData) {
        if (uinjson.username) {
            this.user.username = uinjson.username;
        } else if (uinjson.userid) {
            this.user.username = uinjson.userid.toString();
        }
    }

    protected setGameParas(isadult: number, platTime: number, sign: string) {
        G.DataMgr.gameParas.uin = this.user.uin;
        G.DataMgr.gameParas.platTime = platTime;
        G.DataMgr.gameParas.sign = sign;
        G.DataMgr.gameParas.username = this.user.username;
        UnityEngine.PlayerPrefs.SetString("userName", G.DataMgr.gameParas.username);
    }

    protected onGetUinFailure(content: string, loginData: PlatCommomData.LoginData) {
        this.showLoginButton();
        G.DataMgr.gameParas.uin = 0;
        uts.log('获取用户UIN异常，请重新登录！详情:' + content);
        if (loginData.errmsg == null || loginData.errmsg == undefined || loginData.errmsg == '') {
            this.tipReLogin('获取用户UIN异常，请重新登录！详情:' + content);
        }
        else {
            this.tip(loginData.errmsg);
        }
    };
    protected getUinParamSign(time: string): string {
        let sign = '';
        sign += this.user.username;
        sign += G.DataMgr.gameParas.serverID.toString();
        sign += this.user.token;
        sign += time;
        sign += this.loginKey;
        return Game.Tools.Md5(sign);
    }

    /////////////////////////////////////支付///////////////////////////////////////////
    pay(productId: number, pay_type: string = '-1', willuse_orderid: string = '', qrcode: boolean = false) {
        uts.log("click pay");
        if (G.IsWindowsPlatForm && !this.getPlatformCfg().isFygamePay) {
            let p = G.DataMgr.gameParas;
            var data = {
                "productid": productId, "uin": p.uin, "serverid": p.serverID, "servername": p.serverName,
                "gameid": Game.Config.gameid, "channelid": Game.PCStreamingSetting.channelID,
                "name": G.DataMgr.heroData.name, "level": G.DataMgr.heroData.level,
            };
            var str = JSON.stringify(data);
            G.Uimgr.createForm<ZXingView>(ZXingView).open(str, false, '扫一扫支付', '请打开移动端，在登陆界面点击左侧扫一扫按钮完成支付');
            return;
        }

        if (!this.user.openCharge) {
            this.tip("充值入口暂时关闭！");
            return;
        }

        if (this.paying.value) {
            G.TipMgr.addMainFloatTip('正在充值中，请稍候！');
            return;
        }
        this.paying.start(5000);

        let cfg = G.DataMgr.payData.getCfgById(productId);
        if (!cfg) {
            G.TipMgr.showConfirm(uts.format("error:{0}", productId), ConfirmCheck.noCheck, '确定');
            return;
        }
        let coin = this.getCoin(cfg);
        uts.log('pay coin:' + coin);

        if (!this.getPlatformCfg().needGetorder) {
            this.payOrder({ orderid: '', payurl: this.user.payurl }, cfg, coin);
            return;
        }

        let gameParas = Global.DataMgr.gameParas;
        let user_name = '';
        if (this.user.username == 'empty') {
            user_name = this.userNeedURIEncode ? encodeURIComponent(gameParas.username) : gameParas.username;
        } else {
            user_name = this.userNeedURIEncode ? encodeURIComponent(this.user.username) : this.user.username;
        }
        let uin = this.user.uin > 0 ? this.user.uin.toString() : gameParas.uin.toString();

        let coingold = (coin * 10).toFixed(0); // 发给我们自己服务器的是元宝数量
        let svrid = G.DataMgr.gameParas.serverID.toString();
        let time = Math.floor(new Date().getTime() / 1000);
        let sign = '';
        sign += user_name;
        sign += svrid;
        sign += coingold;
        sign += uin;
        sign += time;
        sign += this.payKey;
        sign = Game.Tools.Md5(sign);

        let org_username = this.user.org_username != '' ? this.user.org_username : this.user.username;
        let serverName = G.DataMgr.gameParas.serverName;
        let roleName = G.DataMgr.heroData.name;
        let roleLevel = G.DataMgr.heroData.level;
        let fromIp = this.getOrderIdTryTimes > 0;

        let url = this.payUrl(fromIp).replace('{user_name}', user_name)
            .replace(/{server}/g, svrid)
            .replace(/{coin}/g, coingold)
            .replace(/{uin}/g, uin)
            .replace(/{time}/g, time.toString())
            .replace(/{sign}/g, sign)
            .replace(/{userid}/g, user_name)
            .replace(/{productid}/g, productId.toString())
            .replace(/{productname}/g, encodeURIComponent(cfg.m_szProductName))
            .replace(/{productdesc}/g, encodeURIComponent(cfg.m_szProductDesc))
            .replace(/{token}/g, encodeURIComponent(this.user.token))
            .replace(/{rolename}/g, encodeURIComponent(roleName))
            .replace(/{rolelevel}/g, roleLevel.toString())
            .replace(/{servername}/g, encodeURIComponent(serverName))
            .replace(/{channel}/g, this.user.channelId == "empty" ? G.ChannelSDK.NewChannelId : this.user.channelId)
            .replace(/{org_username}/g, org_username)
            .replace(/{pay_type}/g, pay_type)
            .replace(/{pay_ext}/g, this.user.pay_ext);

        if (willuse_orderid != '') {
            url += '&orderid=' + willuse_orderid;
        }

        if (qrcode) { // 二维码支付
            url += '&qrcode=1';
        }

        if (G.IsAndroidPlatForm) {
            url = url.replace(/{device_id}/g, '1');
        } else if (G.IsIOSPlatForm) {
            url = url.replace(/{device_id}/g, '2');
        } else if (G.IsWindowsPlatForm) {
            url = url.replace(/{device_id}/g, '3');
        }

        this.payInfo.payType = pay_type == '1' ? 'alipay' : 'weixinpay';

        let appendParams = this.getOrderAppendParams();
        for (let k in appendParams) {
            url = url.replace(k, appendParams[k]);
        }
        url = url.replace(/{pid}/g, 'empty');
        uts.log('get order url:' + url);
        UrlUtil.loadTextFromFullUrl(url, delegate(this, this.onGetOrder, productId), EnumLoadUrl.GetOrderIdTimeOut);
    }

    private onGetOrder(error: string, content: string, productId: number) {
        if (error != null) {
            uts.logWarning('get order error:' + error);
            if (++this.getOrderIdTryTimes < EnumLoadUrl.GetOrderIdTryTimes) {
                this.pay(productId);
            }
            else {
                this.getOrderIdTryTimes = 0;
                this.tip("获取交易订单网络异常，请稍候重试！");
            }
            return;
        }

        uts.log('on get order:' + content);
        let json = SafeJson.parse(content);
        if (json == null || (json.errcode !== 0 && json.errcode !== '0')) {
            this.tip("获取交易订单出错！详情:" + content);
            return;
        }

        let cfg = G.DataMgr.payData.getCfgById(productId);
        let coin = this.getCoin(cfg);
        this.payOrder(json, cfg, coin);
    }

    protected payOrder(orderjson: any, cfg: GameConfig.ChargeGiftConfigM, coin: number) {
        let serverId = G.DataMgr.gameParas.serverID.toString();
        let uin = G.DataMgr.gameParas.uin.toString();
        let params = {
            orderId: orderjson.orderid.toString()
            , serverId: serverId
            , price: coin.toString()
            , productId: cfg.m_iProductID.toString()
            , productName: cfg.m_szProductName.toString()
            , productDesc: cfg.m_szProductDesc.toString()
            , productNumber: '1'
            , roleLevel: G.DataMgr.heroData.level == null ? "0" : G.DataMgr.heroData.level.toString()
            , roleName: G.DataMgr.heroData.name
            , roleId: uin
            , serverName: G.DataMgr.gameParas.serverName
            , payurl: orderjson.payurl != null ? orderjson.payurl : ''
            , vip: G.DataMgr.heroData.curVipLevel.toString()
            , ratio: this.getPlatformCfg().rate != null ? this.getPlatformCfg().rate : '10'
            , currency: this.getPlatformCfg().currency != null ? this.getPlatformCfg().currency : ''
            , extension: orderjson.extension != null ? orderjson.extension : this.makePayExtension(serverId, orderjson.orderid, uin, this.user.username)
            , userName: G.DataMgr.gameParas.username
            , yuanbao: cfg.m_iChargeCount.toString()
        };

        this.payInfo.orderId = params.orderId;
        this.payInfo.currency = params.currency;
        this.payInfo.price = params.price;

        uts.log('payOrder:' + JSON.stringify(params));
        if (this.getPlatformCfg().isFygamePay) {
            FyGamePay.Ins.doPay(orderjson, cfg, JSON.stringify(params), this.paying, delegate(this, this.pay));
        } else {
            G.SdkCaller.doPay(JSON.stringify(params), orderjson.payinfo);
        }
    }

    protected makePayExtension(serverid: string, orderid: string, uin: string, userid: string): string {
        let extflag = this.getPlatformCfg().payExtensionFlag;
        if (extflag == null)
            return '';

        if (extflag & PayExtensionFlag.USEJSON) {
            let ext = {};
            if (extflag & PayExtensionFlag.SERVER) {
                ext['server'] = serverid;
            }
            if (extflag & PayExtensionFlag.UIN) {
                ext['uin'] = uin;
            }
            if (extflag & PayExtensionFlag.ORDERID) {
                ext['orderid'] = orderid;
            }
            if (extflag & PayExtensionFlag.USERID) {
                ext['userid'] = userid;
            }
            if (extflag & PayExtensionFlag.DEVICEID) {
                let deviceInfo = Compatible.getDeviceInfo();
                ext['imeio'] = deviceInfo.imei;
                ext['imei'] = deviceInfo.imei;
                ext['mac'] = deviceInfo.mac.toUpperCase();
                ext['idfa'] = deviceInfo.idfa;
            }
            if (extflag & PayExtensionFlag.ISIOS) {
                ext['ios'] = G.IsIOSPlatForm ? 1 : 0;
                ext['is_andriod'] = G.IsAndroidPlatForm ? 1 : 0;
            }
            if (extflag & PayExtensionFlag.CHANNEL) {
                ext['channel'] = this.user.channelId == "empty" ? G.ChannelSDK.NewChannelId : this.user.channelId;
            }
            if (extflag & PayExtensionFlag.APPVER) {
                ext['client_ver'] = UnityEngine.Application.version;
            }
            return SafeJson.stringify(ext);
        } else {
            let ext = '';
            if (extflag & PayExtensionFlag.SERVER) {
                ext = serverid;
            }
            if (extflag & PayExtensionFlag.UIN) {
                if (ext != '') ext += '|';
                ext += uin;
            }
            if (extflag & PayExtensionFlag.ORDERID) {
                if (ext != '') ext += '|';
                ext += orderid;
            }
            if (extflag & PayExtensionFlag.USERID) {
                if (ext != '') ext += '|';
                ext += userid;
            }
            if (extflag & PayExtensionFlag.ISIOS) {
                if (ext != '') ext += '|';
                ext += (G.IsIOSPlatForm ? 1 : 0);
            }
            if (extflag & PayExtensionFlag.DEVICEID) {
                if (ext != '') ext += '|';
                let deviceInfo = Compatible.getDeviceInfo();
                if (G.IsAndroidPlatForm) {
                    ext += deviceInfo.imei;
                } else {
                    ext += deviceInfo.idfa;
                }
            }
            return ext;
        }
    }

    protected onPay(msg: Msg) {
        if (msg.result == ResultType.OK) {
            uts.log('pay ok!');
            if (G.IsIOSPlatForm && this.getPlatformCfg().isFygamePay) {
                uts.log("进行发货步骤");
                G.DataMgr.payRecepitData.saveRecepit(JSON.stringify(msg));
                if (msg.payServerId == G.DataMgr.gameParas.serverID.toString() && msg.payUin == G.DataMgr.gameParas.uin.toString()) {
                    this.notifyToServerSendGood(msg);
                }
            }
        }
        else if (msg.result == ResultType.WAIT) {
            uts.log('waitting pay!');
        }
        else if (msg.result == ResultType.CANCEL) {
            uts.log('支付被取消！详情：' + JSON.stringify(msg));
        }
        else {
            uts.log('支付发生异常！详情：' + JSON.stringify(msg));
        }
    }

    ///////////////////////////////日志上报/////////////////////////////////////////////
    report(type: ReportType, appendData: any = null) {
        uts.log('sdk report');
        if (type == ReportType.LOGIN) {
            this.stopTimer(this.delayReportTimer);
            this.delayReportTimer = new Game.Timer('delay report', 500, 1, delegate(this, this.reportDataWhenLogin, type, appendData));
        }
        else if (type == ReportType.CREATINGROLE && G.DataMgr.runtime.isCreatingRole) {
            let key = 'sdk.reportcreating:' + G.DataMgr.gameParas.username + '_sid:' + G.DataMgr.gameParas.serverID;
            if (!Game.MemValueRegister.GetBool(key)) {
                Game.MemValueRegister.RegBool(key, true);
                this.reportData(type, appendData);
            }
        }
        else {
            this.reportData(type, appendData);
        }
    }

    private reportDataWhenLogin(timer: Game.Timer, type: ReportType, appendData: any) {
        this.delayReportTimer = null;
        if (G.DataMgr.runtime.loginStatus == EnumLoginStatus.logined) {
            this.reportData(type, appendData);
        }
    }

    protected reportData(type: ReportType, appendData: any) {
        let roleLevelIMTime = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        if (type == ReportType.CREATEROLE) {
            roleLevelIMTime = G.DataMgr.heroData.createTime;
        }
        else if (type == ReportType.LEVELUP) {
            roleLevelIMTime = G.DataMgr.runtime.levelUpLastTime;
        }

        let power = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT);
        if (power == null) power = 0;

        let exp = G.DataMgr.heroData.getProperty(Macros.EUAI_CUREXP);
        if (exp == null) exp = 0;

        let genders = {};
        genders[KeyWord.GENERTYPE_NOLIMIT] = '无';
        genders[KeyWord.GENDERTYPE_BOY] = '男';
        genders[KeyWord.GENDERTYPE_GIRL] = '女';
        let gender = genders[G.DataMgr.heroData.gender];

        //全部tostring一下吧,oc代码还必须知道具体什么类型才能强转,保证传进去全是string
        let params = {
            dataType: type.toString()
            , serverId: G.DataMgr.gameParas.serverID.toString()
            , serverName: G.DataMgr.gameParas.serverName
            , roleId: G.DataMgr.gameParas.uin.toString()
            , roleName: G.DataMgr.heroData.name
            , roleLevel: G.DataMgr.heroData.level == null ? "0" : G.DataMgr.heroData.level.toString()
            , roleCTime: G.DataMgr.heroData.createTime.toString()
            , roleLevelIMTime: roleLevelIMTime.toString()
            , roleCoin: G.DataMgr.heroData.gold.toString()
            , power: power.toString()
            , vip: G.DataMgr.heroData.curVipLevel.toString()
            , experience: exp.toString()
            , roleMoney: G.DataMgr.heroData.tongqian.toString()
            , chargeMoney: G.DataMgr.heroData.curChargeMoney.toString()
            , partyName: G.DataMgr.guildData.guildName != '' ? G.DataMgr.guildData.guildName : '无'
            , gender: gender
            , professionId: G.DataMgr.heroData.profession.toString()

            // 支付相关的上报
            , orderId: this.payInfo.orderId
            , payType: this.payInfo.payType
            , currency: this.payInfo.currency
            , price: this.payInfo.price
        };
        uts.log("report:" + JSON.stringify(params));
        G.SdkCaller.reportData(JSON.stringify(params));
    }


    //////////////////////////////登录和注册账号检验///////////////////////////////////////////////
    startCheckUserAccount(userName: string, userPassWord: string) {
        this.getCheckUrl(userName, userPassWord);
    }
    startRegisterUser(userName: string, userPassWord: string) {
        this.getResgisterUrl(userName, userPassWord);
    }


    //登录系统是单独的,和svrlist分开的,全部通用这一个
    private registerUrl(fromIp: boolean): string {
        let baseinfo = this.getBaseInfo(fromIp);
        return baseinfo.baseurl + baseinfo.channelTag + 'reg.php';
    }
    private checkPassWordUrl(fromIp: boolean): string {
        let baseinfo = this.getBaseInfo(fromIp);
        return baseinfo.baseurl + baseinfo.channelTag + 'check.php';
    }

    //注册账号
    private getResgisterTryTimes: number = 0;
    private getResgisterUrl(userName: string, userPassWord: string) {
        let fromIp = this.getResgisterTryTimes > 0;
        let url = this.registerUrl(fromIp);
        let postData = this.getLoginRegisterPostData(userName, userPassWord);
        uts.log("注册userName:=" + userName + " orginPwd:=" + userPassWord + " url:= " + url + " postdata：= " + postData);
        UrlUtil.loadTextFromFullUrl(url, delegate(this, this.onGetResgister, userName, userPassWord), 5, postData);
    }
    private onGetResgister(error: string, content: string, userName: string, userPassWord: string) {
        if (error != null) {
            uts.logWarning('get check error:' + error);
            if (++this.getResgisterTryTimes < 3) {
                this.getResgisterUrl(userName, userPassWord);
            }
            else {
                this.getResgisterTryTimes = 0;
                this.tip("注册失败，请稍候重试！");
            }
            return;
        }
        uts.log('on get register:' + content);
        let json = JSON.parse(content);
        if (json == null || (json.errcode !== 0 && json.errcode !== '0')) {
            this.tip("注册失败！详情:" + json.errmsg);
            return;
        }
        //注册成功了,保存账号和密码到本地
        G.DataMgr.fygameLoginData.saveUserAccountAndPassWord(userName, userPassWord);
        //然后进入登录校验
        this.getCheckUrl(userName, userPassWord);
    }
    //登录密码检验
    private getCheckUrlTryTimes: number = 0;
    private getCheckUrl(userName: string, userPassWord: string) {
        let fromIp = this.getCheckUrlTryTimes > 0;
        let url = this.checkPassWordUrl(fromIp);
        let postData = this.getLoginCheckPostData(userName, userPassWord);
        uts.log("登录userName:=" + userName + " orginPwd:=" + userPassWord + " url:= " + url + " postdata：= " + postData);
        UrlUtil.loadTextFromFullUrl(url, delegate(this, this.onGetCheck, userName, userPassWord), 5, postData);
    }
    private onGetCheck(error: string, content: string, userName: string, userPassWord: string) {
        if (error != null) {
            uts.logWarning('get check error:' + error);
            if (++this.getCheckUrlTryTimes < 3) {
                this.getCheckUrl(userName, userPassWord);
            }
            else {
                this.getCheckUrlTryTimes = 0;
                this.tip("账号检查异常，请稍候重试！");
            }
            return;
        }
        uts.log('on get check:' + content);
        let json = JSON.parse(content);
        if (json == null || (json.errcode !== 0 && json.errcode !== '0')) {
            this.tip("账号检查出错！详情:" + json.errmsg);
            return;
        }
        //每次登录成功就存储一次账号和密码
        G.DataMgr.fygameLoginData.saveUserAccountAndPassWord(userName, userPassWord);
        //密码校验成功了,关闭fygame登录面板
        G.Uimgr.closeForm(FyGameLoginView);
        //设置token和time
        //接下来进入channelsdk loginSucess流程
        let data = {
            msgtype: MsgType.LOGIN,
            result: ResultType.OK,
            userid: userName,
            token: json.token,
            login_time: json.time
        };
        this.onLogin(data as Msg);
    }
    //获取postData
    private getLoginCheckPostData(userName: string, userPassWord: string): string {
        return this.getPostData(userName, userPassWord, this.checkKey);
    }
    private getLoginRegisterPostData(userName: string, userPassWord: string): string {
        return this.getPostData(userName, userPassWord, this.regKey);
    }
    private get regKey(): string {
        return '#FYGAMEMOBILE#2018#accountKEY24@^$^%(*9183098abcdh22g3hhd';
    }
    private get checkKey(): string {
        return '#FYGAMEMOBILE#2018#checkKEY128@^$^%(*9183098abacc13adfah6';
    }
    private getPostData(userName: string, userPassWord: string, key: string, ): string {
        let pwd = Game.Tools.Md5(Game.Tools.Md5(userPassWord));
        let time = Math.floor(new Date().getTime() / 1000);
        let v = "1";
        let sign = '';
        sign += userName;
        sign += pwd;
        sign += time;
        sign += v;
        sign += key;
        sign = Game.Tools.Md5(sign);
        let postData = uts.format("user_name={0}&pwd={1}&time={2}&v={3}&sign={4}", userName, pwd, time, v, sign);
        return postData;
    }


    //////////////////////////////////支付////////////////////////////////////////////////
    //发货
    protected sendGoodTryTimes: number = 0;

    protected sendGoodUrl(fromIp: boolean): string {
        let baseinfo = this.getBaseInfo(fromIp);
        return baseinfo.baseurl + baseinfo.channelTag + 'gpay.php?user_name={user_name}&server={server}&coin={coin}&productid={productid}&orderid={orderid}&uin={uin}&time={time}&token={token}&sign={sign}&bundleid={bundleid}';
    }

    get sendGoodKey(): string {
        return '#FYGAMEMOBILE#2017#PAYCOMMONKEY154@^$^%(*9183098abaccde';
    }

    notifyToServerSendGood(msg: Msg) {
        if (msg == null) {
            uts.log("像服务器请求发货的数据为空,本次请求失败");
            return;
        }
        let time = Math.floor(new Date().getTime() / 1000);
        let sign = '';
        sign += msg.payUserName;
        sign += msg.payServerId;
        sign += msg.payCoin;
        sign += msg.payProductId;
        sign += msg.payOrderId;
        sign += msg.payUin;
        sign += time;
        sign += msg.payReceipt;
        sign += this.sendGoodKey;
        sign = Game.Tools.Md5(sign);
        let fromIp = this.sendGoodTryTimes > 0;
        let url = this.sendGoodUrl(fromIp)
            .replace('{user_name}', encodeURIComponent(msg.payUserName))
            .replace(/{server}/g, msg.payServerId)
            .replace(/{coin}/g, msg.payCoin)
            .replace(/{productid}/g, msg.payProductId)
            .replace(/{orderid}/g, msg.payOrderId)
            .replace(/{uin}/g, msg.payUin)
            .replace(/{time}/g, time.toString())
            .replace(/{token}/g, encodeURIComponent(msg.payReceipt))
            .replace(/{sign}/g, sign)
            .replace(/{bundleid}/g, UnityEngine.Application.identifier);
        uts.log('send good url:' + url);
        UrlUtil.loadTextFromFullUrl(url, delegate(this, this.onSendGood, msg), 10);
    }

    private onSendGood(error: string, content: string, msg: Msg) {
        if (error != null) {
            uts.logWarning('send Good error:' + error);
            if (++this.sendGoodTryTimes < 2) {
                this.notifyToServerSendGood(msg);
            }
            else {
                this.sendGoodTryTimes = 0;
                uts.log("发放道具失败,可能是网络异常");
            }
            return;
        }
        uts.log('send Good content:' + content);
        let json = SafeJson.parse(content);
        if (json == null || json.errcode != 0 || json.errcode != '0') {
            uts.log("发放道具失败：= " + content);
            return;
        }
        //接下来进行删除本地订单的操作
        G.DataMgr.payRecepitData.removeRecepit(json.orderid);
    }



}