/**
 * 西游
 */
enum XiYouSdkStatus {
    CODE_ANTIADDICTION_UNKNOWN = 1000019,
    CODE_ANTIADDICTION_JUVENILES = 1000020,
    CODE_ANTIADDICTION_ADULT = 1000021,
}

enum IXiYouSDKCallBack {
    CODE_ANTI_ADDICTION_JUVENILES = 1000020,
    CODE_ANTI_ADDICTION_ADULT = 1000021,
}

import { Global as G } from 'System/global'
import { MsgType, Msg, ReportType, ResultType, PlatUrlCfg } from 'System/channel/ChannelDef'
import { EnumLoginStatus, EnumLoadUrl } from 'System/constants/GameEnum'
import { GuildTools } from 'System/guild/GuildTools'
import { KeyWord } from "System/constants/KeyWord"
import { Macros } from 'System/protocol/Macros'
import { JavaCaller } from 'System/utils/JavaCaller'
import { ChannelHandler } from 'System/channel/handlers/ChannelHandler'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Compatible } from "System/Compatible"
import { UrlUtil } from 'System/utils/UrlUtil'
import { LoginTip } from 'System/login/view/LoginTip'
import { VersionUtil } from 'System/utils/VersionUtil'
import { GameIdDef } from 'System/channel/GameIdDef'
import { StringUtil } from 'System/utils/StringUtil'
import { TimeoutFlag } from 'System/utils/TimeoutUtil'
import { SafeJson } from '../../../utils/SafeJson';

export enum XiyouChannelId {
    XIYOU = 25,
    YINGYONGBAO = 50,
    IOS = 43,
    IQIYI = 48,
    OTHER = 60,
    YUMO = 63,
    EWAN = 44,
    GUANGDIANTONG = 52,
    SANXIANG = 68,
    PAPA = 46,
    JIUZHOU = 65,
    LONGXIAO1 = 306,
    LONGXIAO2 = 307,
    XINJI = 71,
    JIANPO = 74,
    MOHE = 310,
    LINGYOU = 312,
    JD = 313,
    C4399 = 6,
}

abstract class XiyouPlatform {
    protected handler: ChannelHandler = null;
    constructor(handler: ChannelHandler) { this.handler = handler; }
    abstract getUrls(): PlatUrlCfg;
    abstract canSwitchLogin(): boolean;
    abstract switchLogin();
    abstract requestServers();
    abstract get channelID(): string;
    abstract get orderAppendParams(): { [index: string]: any };
    abstract pay(params: string);
    abstract reportData(params: string);
    abstract reportReYunData(params: string);
    abstract start();
    abstract destory();
    abstract initSDK();
}

class XiyouAndroidReyunReporter {
    private static ins: XiyouAndroidReyunReporter = null;
    static getIns(): XiyouAndroidReyunReporter {
        if (this.ins == null) this.ins = new XiyouAndroidReyunReporter();
        return this.ins;
    }

    private sdk = null;
    private constructor() {
        this.sdk = JavaCaller.getJavaObject('com.xiyougame.fygame.sdk.reportproxy.ReyunProxy', null, 'getInstance');
    }
    reportRegister(accountId: string) {
        if (this.sdk == null) return;
        JavaCaller.comCallRetInt(this.sdk, 'setRegisterWithAccountID', accountId);
    }
    reportLogin(accountId: string) {
        if (this.sdk == null) return;
        JavaCaller.comCallRetInt(this.sdk, 'setLoginSuccessBusiness', accountId);
    }
    reportPayStart(transactionId: string, paymentType: string, currencyType: string, currencyAmount: number) {
        if (this.sdk == null) return;
        JavaCaller.comCallRetInt(this.sdk, 'setPaymentStart', JSON.stringify({ transactionId: transactionId, paymentType: paymentType, currencyType: currencyType, currencyAmount: currencyAmount }));
    }
    reportPay(transactionId: string, paymentType: string, currencyType: string, currencyAmount: number) {
        if (this.sdk == null) return;
        JavaCaller.comCallRetInt(this.sdk, 'setPayment', JSON.stringify({ transactionId: transactionId, paymentType: paymentType, currencyType: currencyType, currencyAmount: currencyAmount }));
    }
    reportExit() {
        if (this.sdk == null) return;
        JavaCaller.comCallRetInt(this.sdk, 'exitSdk');
    }
    reportGetOrder(transactionId: string, currencyType: string, currencyAmount: number) {
        if (this.sdk == null) return;
        JavaCaller.comCallRetInt(this.sdk, 'setOrder', JSON.stringify({ transactionId: transactionId, currencyType: currencyType, currencyAmount: currencyAmount }));
    }
}

export class XiyouAndroidPlatform extends XiyouPlatform {
    getUrls(): PlatUrlCfg {
        let channelId = Number(this.channelID);
        uts.log('channelId:' + channelId);
        if (channelId == XiyouChannelId.XIYOU) {
            return { baseurl: 'http://proxy.jytx.xiyou.fygame.com/jytx/', ipfmt: 'http://{0}/jytx/', ips: ['121.46.16.245'], channelTag: '' };
        }
        else {
            return { baseurl: 'http://proxy.jytx.xiyou.fygame.com/jytx/', ipfmt: 'http://{0}/jytx/', ips: ['121.46.16.245'], channelTag: '' };
        }
    }
    canSwitchLogin(): boolean {
        let xiyouSDK = JavaCaller.getJavaObject('com.xiyou.sdk.XiYouGameSDK', null, 'getInstance');
        return JavaCaller.comCallRetBoolean(xiyouSDK, 'hasLogout');
    }
    switchLogin() {
        G.ChannelSDK.setLogoutFlag(true);
        G.reloadGame(false);
    }
    requestServers() {
        JavaCaller.callRetInt('requestServers');
    }
    get channelID() {
        let xiyouSDK = JavaCaller.getJavaObject('com.xiyou.sdk.XiYouGameSDK', null, 'getInstance');
        return JavaCaller.comCallRetString(xiyouSDK, 'getMasterID');
    }
    get orderAppendParams(): { [index: string]: any } {
        return { '{pid}': JavaCaller.callRetInt('getCurrFlag') };
    }
    pay(params: string) {
        JavaCaller.callRetInt('doPay', params);
    }
    reportData(params: string) {
        JavaCaller.callRetInt('dataReport', params);
    }
    reportReYunData(params: string) {

    }
    start() {
        JavaCaller.callRetInt('startGame');
    }
    destory() {
        JavaCaller.callRetInt('destoryGame');
    }
    private reportGDTData(params) {
        JavaCaller.callRetInt('reportGDTData', SafeJson.stringify(params));
    }
    initSDK() {
        JavaCaller.callRetInt('initSdk', '{}');
    }
}

class XiyouIOSPlatform extends XiyouPlatform {
    getUrls(): PlatUrlCfg {
        let gameId = G.AppCfg.Gameid;
        return { baseurl: 'http://proxyios.jytx.xiyou.fygame.com/jytx/', ipfmt: 'http://{0}/jytx/', ips: ['121.46.16.245'], channelTag: 'ios_' };
    }
    canSwitchLogin(): boolean {
        return Game.IosSdk.IosCallStringBySDK("canSwithLogin") == "yes";
    }
    requestServers() {
        Game.IosSdk.IosCallSDkFunc('requestServers', '');
    }
    switchLogin() {
        G.ChannelSDK.setLogoutFlag(true);
        G.reloadGame(false);
    }
    get channelID() {
        return Game.IosSdk.IosCallStringBySDK("masterId");
    }
    get orderAppendParams(): { [index: string]: any } {
        return { '{pid}': Game.IosSdk.IosCallStringBySDK("currerFlag") };
    }
    pay(params: string) {
        Game.IosSdk.IosCallSDkFunc("doPay", params);
    }
    reportData(params: string) {
        Game.IosSdk.IosCallSDkFunc("reportData", params);
    }
    reportReYunData(params: string) {
        Game.IosSdk.IosCallSDkFunc("reportReYunData", params);
    }
    start() {
    }
    destory() {
    }
    initSDK() {
        let params = {
            appId: "104836063562"
            , appKey: "ff4bb94ad72c7f0d91ab4ba45da0be53"
            , appSecret: "kJJUjlQRkiiiBbUbARkqt1XRaIQdj9bT"
        }
        Game.IosSdk.IosCallSDkFunc("initSDK", JSON.stringify(params));
    }
}

class XiyouPayData {
    productName: string = '';
    productId: string = '';
    price: number = 0;
}

export class XiyouPlatHandler extends ChannelHandler {
    protected platsdk: XiyouPlatform = null;
    //热云数据存储(订单号和)
    private payOrderNo: string = '';
    private payOrderNum: number = 0;
    private exiting = new TimeoutFlag();
    private payData = new XiyouPayData();

    constructor() {
        super();
        if (G.IsAndroidPlatForm) {
            this.platsdk = new XiyouAndroidPlatform(this);
        }
        else if (G.IsIOSPlatForm) {
            this.platsdk = new XiyouIOSPlatform(this);
        }
        this.setNewChannelId();
    }

    private newChannelId: { [gameId: number]: string } = {};
    //西游马甲包需要特殊处理的只能用300-315
    private setNewChannelId() {
    }

    private getNewChannelId(): string {
        if (this.newChannelId[G.AppCfg.Gameid] == null) return '';
        return this.newChannelId[G.AppCfg.Gameid];
    }

    get CustomChannel(): string { // 主要是用来公告的
        let cid = Number(this.ChannelID);
        return cid.toString();
    }

    protected initSdk() {
        this.platsdk.initSDK();
    }

    protected onLoginSuccess(msg: Msg) {
        this.user.token = msg.token;
        this.user.username = msg.openid;
        this.onGetDefaultAndLoggedServer();
    }

    //西游平台需要在拉取平台服务器之前去getUin一次来获取defaultServer和最近登陆的服务器
    private onGetDefaultAndLoggedServer() {
        uts.log("++++++++++++onGetDefaultAndLoggedServer++++++++++++");
        let newServer = G.ServerData.getRandomServerToPlat();
        if (newServer == null) {
            G.Uimgr.createForm<LoginTip>(LoginTip).open('服务器还没准备好,请稍后再来', true);
            return;
        }
        G.DataMgr.gameParas.serverID = newServer.serverId;
        let url = this.getFactLoginUrl(false);
        uts.log('第一次获取Uin:' + url);
        UrlUtil.loadTextFromFullUrl(url, delegate(this, this.onLoadDefaultAndLoggedServer), EnumLoadUrl.GetUinTimeOut);
    }

    private onLoadDefaultAndLoggedServer(error: string, content: string) {
        if (error != null) {
            uts.logWarning('get defaultServer error:' + error);
            if (++this.getUinTryTimes < EnumLoadUrl.GetUinTryTimes) {
                this.onGetDefaultAndLoggedServer();
            }
            else {
                this.getUinTryTimes = 0;
                this.showLoginButton();
                G.DataMgr.gameParas.uin = 0;
                this.tipReLogin('获取最近登陆服务器异常，请重新登录！');
            }
            return;
        }
        let loginData = SafeJson.parse(content) as PlatCommomData.LoginData;
        if (loginData == null) {
            this.tipReLogin('解析服务器列表异常，请重新登录！');
            return;
        }
        uts.log("loginData:= " + JSON.stringify(loginData));
        if (loginData == null || loginData.errcode != 0 || loginData.defaultServer == null || loginData.loggedServers == null) {
            if (loginData.errmsg == null || loginData.errmsg == '') {
                this.tipReLogin('获取最近登陆服务器异常，请重新登录！详情:' + content);
                return;
            }
            else {
                this.tip(loginData.errmsg);
            }
        }
        uts.log("需要自动选择并登录的服务器是:= " + loginData.defaultServer.servername);
        this.isNewUser = loginData.isnewbie == 1;
        G.ServerData.setDefaultAndLoggedServer(loginData.defaultServer, loginData.loggedServers);
        //设置完平台defaultServer和LoggedServer了才能去拉去平台服务器列表
        this.platsdk.requestServers();
    }

    setLogoutFlag(needLogout: boolean) {
        Game.MemValueRegister.RegBool('sdkneedlogout', needLogout);
    }

    protected needLogout(): boolean {
        return Game.MemValueRegister.GetBool('sdkneedlogout');
    }

    protected baseUrlInfo(fromIp: boolean): { baseurl: string, channelTag: string } {
        return this.getUrls(fromIp, this.platsdk.getUrls());
    }

    protected onServerList(msg: Msg) {
        if (msg.result == ResultType.OK) {
            G.ServerData.analysisPlatServers(msg.servers);
        }
        else {
            this.againGetServerList();
        }
    }

    private againGetServerList() {
        G.TipMgr.showConfirm('拉取服务器列表异常，请稍候重试！', ConfirmCheck.noCheck, '重试', delegate(this, this.onRerequestServerList));
    }

    private onRerequestServerList() {
        this.platsdk.requestServers();
    }

    protected onGetUinSuccess(uinjson: PlatCommomData.LoginData) {
        if (uinjson.username) {
            this.user.username = uinjson.username;
        } else if (uinjson.userid) {
            this.user.username = uinjson.userid.toString();
        }
    }

    protected onAntiaddiction(msg: Msg) {
        // 只有西游自有买量渠道才做实名认证
        let channelId = Number(this.ChannelID);
        if (channelId == XiyouChannelId.XIYOU) {
            G.DataMgr.gameParas.isAdult = 0;
        }
        else {
            G.DataMgr.gameParas.isAdult = 1;
        }

        if (msg.result != ResultType.OK) {
            uts.logWarning("防沉迷拉取失败：1");
            return;
        }

        let antiaddiction = 0;
        if (msg.userStatus == IXiYouSDKCallBack.CODE_ANTI_ADDICTION_JUVENILES) {
            uts.log("未成年");
        }
        else if (msg.userStatus == IXiYouSDKCallBack.CODE_ANTI_ADDICTION_ADULT) {
            uts.log("已成年");
            G.DataMgr.gameParas.isAdult = 1;
        }
        else {
            uts.logWarning("防沉迷拉取失败：2");
        }
    }

    canSwitchLogin(): boolean {
        return this.platsdk.canSwitchLogin();
    }

    switchLogin() {
        this.platsdk.switchLogin();
    }

    protected get serverListFromSdk(): boolean {
        return true;
    }

    get ChannelID(): string {
        let newChannelId = this.getNewChannelId();
        if (newChannelId != '') return newChannelId;
        return this.platsdk.channelID;
    }

    protected getOrderAppendParams(): { [index: string]: any } {
        return this.platsdk.orderAppendParams;
    }

    protected payOrder(orderjson: any, cfg: GameConfig.ChargeGiftConfigM, coin: number) {
        this.payData.price = coin;
        this.payData.productName = cfg.m_szProductName;
        this.payData.productId = cfg.m_iProductID.toString();

        let params = {
            fixedPay: true
            , productId: cfg.m_iProductID
            , productName: cfg.m_szProductName
            , productDesc: cfg.m_szProductDesc
            , ratio: 10
            , coinName: "元宝"
            , price: Math.floor(coin * 100)
            , buyNum: 1
            , orderId: orderjson.orderid
            , extension: orderjson.extension
        };

        uts.log('payOrder:' + JSON.stringify(params));
        this.platsdk.pay(JSON.stringify(params));

        this.payOrderNo = orderjson.orderid;
        this.payOrderNum = Math.floor(coin * 100);
    }

    protected reportData(type: ReportType) {
        let needtype = type == ReportType.LOGIN || type == ReportType.CREATEROLE || type == ReportType.LEVELUP || type == ReportType.EXITGAME || type == ReportType.Memory;
        if (!needtype)
            return;

        let roleLevelIMTime = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        if (type == ReportType.CREATEROLE) roleLevelIMTime = G.DataMgr.heroData.createTime;
        else if (type == ReportType.LEVELUP) roleLevelIMTime = G.DataMgr.runtime.levelUpLastTime;
        let power = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT);
        if (power == null) power = 0;
        let params = {
            dataType: type
            , serverId: G.DataMgr.gameParas.serverID.toString()
            , serverName: G.DataMgr.gameParas.serverName
            , roleId: G.DataMgr.gameParas.uin
            , roleName: G.DataMgr.heroData.name
            , roleLevel: G.DataMgr.heroData.level == null ? 0 : G.DataMgr.heroData.level
            , roleCTime: G.DataMgr.heroData.createTime
            , roleLevelIMTime: roleLevelIMTime
            , roleCoin: G.DataMgr.heroData.gold
            , power: power
            , vip: G.DataMgr.heroData.curVipLevel
        };

        uts.log("report:" + JSON.stringify(params));
        this.platsdk.reportData(JSON.stringify(params));
    }


    protected onExit(msg: Msg) {
        this.report(ReportType.EXITGAME);
        UnityEngine.Application.Quit();
    }

    quit() {
        if (this.exiting.value) return;
        this.exiting.start(2000);
        JavaCaller.callRetInt('exit');
    }

    start() {
        this.platsdk.start();
    }

    destory() {
        this.platsdk.destory();
    }

    private toSelfType(type: ReportType): number {
        if (type == ReportType.CREATINGROLE) return 5;
        else return type;
    }

    supportPCApp(): boolean {
        return false;
    }

    protected onPay(msg: Msg) {
        super.onPay(msg);
        if (msg.result == ResultType.OK) {
            this.reportPayData();
        }
    }

    private reportPayData() { //今日头条数据上报
        let params = {
            dataType: ReportType.PAY
            , type: '元宝'
            , productName: this.payData.productName
            , productId: this.payData.productId
            , productCount: 1
            , paychannel: 'weixin'
            , currency: 'RMB'
            , is_success: true
            , price: this.payData.price
        };
        this.platsdk.reportData(JSON.stringify(params));
    }
}
