export class MyUserInfo {
    uin: number; // 我们游戏自己的uin
    openAAS: boolean; // 是否开启放沉迷
    openCharge: boolean; // 是否开启支付
    sign: string; // 我们游戏自己的用户sign
    username: string; // 平台的用户名
    token: string; // 平台的token
    gameId: string; // 平台的gameId
    lastsvrid: number; // 拉uin时的服务器id
    svrusername: string; // server下发的平台username
    channelId: string; // 渠道id
    login_time: number; // 
    login_sid: string; //
    sessionId: string;
    yyb_platform: string; // qq/wx
    yyb_paytoken: string; // 
    yyb_pf: string;//
    yyb_pfkey: string;//
    org_username: string; //原始用户名
    pay_ext: string;
    sandbox: string;
    sdk_version: string;
    payurl: string;
    constructor() {
        this.uin = 0;
        this.openAAS = false;
        this.openCharge = true;
        this.sign = 'empty';
        this.username = 'empty';
        this.token = 'empty';
        this.gameId = 'empty';
        this.lastsvrid = 0;
        this.svrusername = 'empty';
        this.channelId = 'empty';
        this.login_time = 0;
        this.login_sid = 'empty';
        this.sessionId = 'empty';
        this.org_username = '';
        this.pay_ext = 'empty';
        this.yyb_platform = 'empty';
        this.yyb_paytoken = 'empty';
        this.yyb_pf = 'empty';
        this.yyb_pfkey = 'empty';
        this.sandbox = '0';
        this.sdk_version = 'empty';
        this.payurl = '';
    }
}