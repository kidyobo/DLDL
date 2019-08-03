export enum MsgType {
    NONE = 0,
    INIT_SDK = 1,
    CHG_PWS = 2,
    LOGIN = 3,
    LOGOUT = 4,
    PAY = 5,
    ANTIADDICTION = 6,//防沉迷
    VERSIONUPDATE = 7,//游戏版本检查
    EXIT = 8, //游戏退出通知
    USERCENTER = 10, //用户中心
    PAYEND = 11,  // 支付结束
    PUSH_RECEIVE = 12,
    EXITLOGOUT = 13,
    LOADINGCOMPLETE = 14,
    REQUESTSERVERS = 15, //获取服务器列表
    ALIFRIENDMSG = 16, //阿里发送好友消息
    SHAREMSG = 17, //分享
    REQUESTNOTICES = 18, //拉取公告
    GIFT = 19, // cdkey兑换的礼品
    USERDETAIL = 20, //QQ用户详情
    CHANGEACCOUNT = 21, //QQ异账号
    FACEBOOKFRIENDS = 22, //facebook好友列表
    FACEBOOKINVITABLEFRIENDS = 23,//facebook可邀请列表
    FACEBOOKINVITE = 24,// facebook好友邀请结果
    IMAGEUPLOAD = 25, //图片上传结果
    UPDATERECORDSTATE = 26,//刷新录像状态
    MAXCHANNEL = 10000,
}

export enum ResultType {
    OK = 0,
    CANCEL = 1,
    WAIT = 2,
    CLOSEPAY = 3,
    PAYUNKOWN = 4, // 应用宝-需要查询是否到账
    WAKEUP_NEEDUSERLOGIN = 5, //应用宝-异账号需要重新登录
    PAYEND = 6, // 支付结束
    COMMFAIL = -1,
    GETTOKENFAIL = -2,
    PAYTOKENINVALID = -3, // 应用宝-需要重新登录
    EXCEPTIONJSON = -1000,
}

export enum ExitType {
    CUSTOMEXIT = 1,
    SDKEXIT = 2,
}

export interface Msg {
    msgtype: MsgType;
    result?: number;
    status?: number;
    data?: any;
    openid?: string;
    username?: string;
    userid?: string;
    token?: string;
    gameId?: string;
    channelId?: string;
    exitType?: ExitType;
    uid?: string;
    login_time?: number; // 
    timeStamp?: number;
    login_sid?: string; //
    login_sign?: string;
    servers?: string;
    sid?: string;
    area_id?: string;
    sdk_version?: string;
    suid?: string;
    userStatus?: number;
    platform?: string;
    sessionId?: string;
    access_token?: string;
    pay_token?: string;
    pf?: string;
    pf_key?: string;
    productId?: number;
    payType?: string;
    orderId?: string;
    [index: string]: string | number | boolean;
    //收货专用
    payUserName?: string;
    payServerId?: string;
    payCoin?: string;
    payProductId?: string;
    payOrderId?: string;
    payUin?: string;
    payReceipt?: string;
    payTxid?: string;
}

export enum ReportType {
    OTHER = -1,
    SDKLoginSucess = 0,
    LOGIN = 1,
    CREATEROLE = 2,
    LEVELUP = 3,
    EXITGAME = 4,
    PAY = 5,
    CREATINGROLE = 6, // 该值在西游平台对应的是5
    ACTIVITION = 7, // 首次激活
    NEWCOMEGUIDE = 8, // 新手引导
    REALNAMEREG = 9, // 实名验证
    REALNAMEREGBEGIN = 10, // 新手引导开始
    REALNAMEREGEND = 11, // 新手引导开始
    CHAT = 12, // 聊天上报
    SELECTSERVER = 13, //选择服务器
    EnterPinstance = 14, //进入副本
    LeavePinstance = 15, //退出副本
    VIPLEVELUP = 16, //vip升级
    Memory = 17, //ios存储数据用,app退出不能回调回来,需要在objct_c里上报
    SERVERS = 18,
    EXITGAME2 = 19,
    RechargeGetMoney = 20,//用户充值得到的钱
}

export interface IChannelHandler {
    start();
    login(callback: (result: number) => void);
    setLogoutFlag(needLogout: boolean);
    pay(productId: number);
    report(type: ReportType);
    onMessage(msg: Msg);
    loginGame(callback: () => void);
    quit();
    canSwitchLogin(): boolean;
    switchLogin();
    serVerListFromSDK(): boolean;
    checkApk(nextcall: () => void);
    destory();
    getServerListUrl(fromIp: boolean): string;
    getDirtyUrl(fromIp: boolean): string;
    supportPCApp(): boolean;
    refreshPayState();
    readonly payKey: string;
    readonly loginKey: string;
    readonly GonggaoChannelID: string;
    readonly ChannelID: string;
    readonly LogoId: number;
    readonly PlatformType: number;
    notifyToServerSendGood(msg: Msg);
    //登录系统
    startCheckUserAccount(userName: string, userPassWord: string);
    startRegisterUser(userName: string, userPassWord: string);
    isShowFloatIcon(): boolean;
    isShowBtnRecord(): boolean;   //录屏按钮
}


export interface PlatUrlCfg {
    baseurl: string, ipfmt: string, ips: string[], channelTag: string
}

export enum PayExtensionFlag {
    NONE = 0,
    USEJSON = 1,
    SERVER = 2,
    UIN = 4,
    ORDERID = 8,
    USERID = 16,
    DEVICEID = 32,
    ISIOS = 64,
    CHANNEL = 128,                    
    APPVER = 256,
}

export interface PlatformCfg {
    urlcfgsByChannel?: {[index:string]:PlatUrlCfg};
    urlcfg: PlatUrlCfg;
    needGetorder: boolean;
    payExtensionFlag?: PayExtensionFlag;
    productIdFormat?: string;
    currency?: string;
    rate?: string;
    isFyGameLogin?: boolean;//是自己的sdk
    isFygamePay?: boolean; //自己的支付系统
    hasRecordFunction?: boolean;//有录屏功能
}