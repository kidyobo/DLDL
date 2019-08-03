import { IChannelHandler, ReportType, Msg } from "System/channel/ChannelDef";
import { Global as G } from "System/global";
import { FacotoryUtils } from "System/utils/FactoryUtils";
import { AdictionDesc, CopyrightDescs } from "System/channel/Copyrights";
import { ChannelHandler } from 'System/channel/handlers/ChannelHandler'
import { DevelopHandler } from "System/channel/handlers/fengyue/DevelopHandler"
import { GameIdDef } from "System/channel/GameIdDef"
import { UrlUtil } from 'System/utils/UrlUtil'
import { SafeJson } from "../utils/SafeJson";
import { ZXingView } from "System/login/view/ZXingView"
//import { AjxxPlatHandler } from "System/channel/handlers/ajxx/AjxxPlatHandler";
export class AppConfig { // 外网有读取不到 Game.Config.productName 的bug, 先这样处理下
    private remoteResUrl: string = '';
    private plat: number = 0;
    private gameid: number = 0;
    private apkpath: string = '';
    private bundleId: string = '';
    private productName: string = '';
    constructor() {
        this.remoteResUrl = Game.Config.remoteResUrl;
        this.plat = Game.Config.plat;
        this.gameid = Game.Config.gameid;
        this.apkpath = Game.Config.apkpath;
        this.bundleId = Game.Config.bundleId;
        this.productName = Game.Config.productName;
    }
    get RemoteResUrl(): string { return this.remoteResUrl; }
    get Plat(): number {
        let channelPlat = this.plat;
        let testChannelPlat = G.DataMgr.systemData.ossTestPlatId;
        if (defines.has('TESTUIN') && testChannelPlat != 0) {
            channelPlat = testChannelPlat;
        }
        return channelPlat;
    }
    get Gameid(): number { return this.gameid; }
    get Apkpath(): string { return this.apkpath; }
    get BundleId(): string { return this.bundleId; }
    // ProductName 有版本兼容，老的apk/ipa中该字段没有wrap出来，从2018年1月12号该字段被加入，使用时需要判断是否为undefined
    get ProductName(): string { return this.productName; }
}

export class ChannelSDK {
    private channel;
    private regist() {
        let gameId = G.AppCfg.Gameid;
        if (gameId == GameIdDef.ZSZL || gameId == GameIdDef.ZSZL_PLAT_TEST || gameId == GameIdDef.ZSZL_PLAT_CDN_TEST) {
            this.channel = new DevelopHandler();
        } else {
            this.channel = new ChannelHandler();
        }
    }
    constructor() {
        this.regist();
    }
    checkApk(nextcall: () => void) {
        if (!G.IsAndroidPlatForm) {
            nextcall();
        }
        else {
            this.curHandler.checkApk(nextcall);
        }
    }
    start() {
        if (!G.IsWindowsPlatForm) {
            this.curHandler.start();
        }
    }
    login(callback: (result: number) => void) {
        if (!G.IsWindowsPlatForm) {
            this.curHandler.login(callback);
        }
    }
    setLogoutFlag(needLogout: boolean) {
        this.curHandler.setLogoutFlag(needLogout);
    }
    loginGame(callback: any) {
        this.curHandler.loginGame(callback);
    }
    pay(productId: number) {
        this.curHandler.pay(productId);
    }
    onMessage(msg) {
        this.curHandler.onMessage(msg);
    }
    canSwitchLogin(): boolean {
        return this.curHandler.canSwitchLogin();
    }
    switchLogin() {
        return this.curHandler.switchLogin();
    }
    serVerListFromSdk(): boolean {
        if (!G.IsWindowsPlatForm) {
            return this.curHandler.serVerListFromSDK();
        }
        return false;
    }
    report(type: ReportType) {
        if (!G.IsWindowsPlatForm) {
            this.curHandler.report(type);
        }
        
        if (type == ReportType.RechargeGetMoney) {
            let form = G.Uimgr.getForm<ZXingView>(ZXingView);
            if (form != null && form.isOpened) {
                form.close();
            }
        }
    }
    quit() {
        this.curHandler.quit();
    }
    destory() {
        this.curHandler.destory();
    }
    get GonggaoChannelID(): string {
        return this.curHandler.GonggaoChannelID;
    }
    get ChannelID(): string {
        if (G.IsWindowsPlatForm) {
            return Game.PCStreamingSetting.channelID;
        }
        return this.curHandler.ChannelID;
    }
    //主要用老getUin和getOrder用
    get NewChannelId(): string {
        let channelId = this.ChannelID;
        if (channelId != '0') return channelId;
        let gameId = String(G.AppCfg.Gameid);
        if (G.IsAndroidPlatForm) {
            return "android" + gameId;
        } else if (G.IsIOSPlatForm) {
            return "ios" + gameId;
        } else if (G.IsWindowsPlatForm) {
            return "windows" + gameId;
        }
        return gameId;
    }
    get ShowFloatIcon(): boolean {
        return this.curHandler.isShowFloatIcon();
    }

    get ShowBtnRecord(): boolean {
        return this.curHandler.isShowBtnRecord();  
    }

    get PlatformType(): number {
        return this.curHandler.PlatformType;
    }
    getServerListUrl(fromIp: boolean): string {
        return this.curHandler.getServerListUrl(fromIp) + '?appversion=' + UnityEngine.Application.version;
    }
    getDirtyUrl(fromIp: boolean): string {
        return this.curHandler.getDirtyUrl(fromIp);
    }
    refreshPayState() {
        this.curHandler.refreshPayState();
    }
    get LoginKey(): string {
        return this.curHandler.loginKey;
    }
    get LogoId(): number {
        return this.curHandler.LogoId;
    }
    get addictionDesc(): string {
        return AdictionDesc;
    }
    get copyrightDesc(): string {
        return CopyrightDescs[G.AppCfg.Gameid];
    }
    private get curHandler(): IChannelHandler {
        return this.channel;
    }
    get supportPCApp(): boolean {
        return this.curHandler.supportPCApp();
    }
    //支付发货
    sendGoodToPlayer(data: Msg) {
        this.curHandler.notifyToServerSendGood(data);
    }
    ///////////////////////fygame登录系统////////////////////////////
    startCheckUserAccount(userName: string, userPassWord: string) {
        this.curHandler.startCheckUserAccount(userName.toLowerCase(), userPassWord.toLowerCase());
    }
    startRegisterUser(userName: string, userPassWord: string) {
        this.curHandler.startRegisterUser(userName.toLowerCase(), userPassWord.toLowerCase());
    }
    ///////////////////////////准备公告//////////////////////////////
    gonggao_Content = '';
    gonggao_Time = '';
    gonggao_CtrlTime = '';
    onPlatNoticePrepare(callback: () => void) {
        let url = G.AppCfg.RemoteResUrl + "assets/gonggao/" + G.AppCfg.Plat + "_" + this.GonggaoChannelID + ".txt?v=" + G.SyncTime.getCurrentTime();
        uts.log("gonggaoUrl:= " + url);
        UrlUtil.loadTextFromFullUrl(url, delegate(this, this.onLoadGongGao, callback), 3);
    }
    private onLoadGongGao(error: string, content: string, callback) {
        if (error != null) {
            uts.log("拉取公告失败error:= " + error);
            this.gonggao_Content = uts.format('亲爱的玩家，欢迎来到游戏！[plat:{0},channel:{1}]', G.AppCfg.Plat, this.GonggaoChannelID);
            this.gonggao_Time = '';
            this.gonggao_CtrlTime = '';
            callback(null);
            return;
        }
        content = content.replace(/'/g, '"');
        let data = SafeJson.parse(content);
        if (data == null) {
            uts.log("解析公告失败: " + content);
            callback(null);
            return;
        }
        this.gonggao_Content = data.m_szContent == null ? "" : data.m_szContent;
        this.gonggao_Time = data.m_szDate == null ? "" : data.m_szDate;
        this.gonggao_CtrlTime = data.m_szCtrlDate == null ? "" : data.m_szCtrlDate;
        callback(null);
    }
}