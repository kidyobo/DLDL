import { Global } from "../global";
import { Macros } from "../protocol/Macros";

/**
 * 游戏参数变量。
 */
export class GameParas {
    uin: number = 0;
     /**自己的worldid，仅在第一次登陆时赋值*/
     myWorldID: number = -1;
    /**-1表示尚未拉取角色信息数据，假如玩家在2服创号，后来2服合到1服，那么worldID将变为1*/
    worldID: number = 1;
    platformType: number = 0;
    get clientType(): number {
        if (Global.IsAndroidPlatForm) return Macros.LOGIN_CLINT_TYPE_ANDROID;
        else if(Global.IsIOSPlatForm) return Macros.LOGIN_CLINT_TYPE_IOS;
        else if(Global.IsWindowsPlatForm) return Macros.LOGIN_CLINT_TYPE_PC;
        else return Macros.LOGIN_CLINT_TYPE_OHTER;
    }
    isAdult: number = 1;
    platTime: number = 0;
    /**这是玩家的创角服务器id，合服后不等同于当前所在服务器id*/
    serverID: number = 0;
    serverName: string = '';
    username: string = '';
    sign: string = '';

    domain: string = '';
    serverIp: string = '';
    serverPort: number = 0;

    roleID: Protocol.RoleID;
    country: number = 0;
    prof: number = 2;
    gender: number = 0;

    /**跳过剧情，0是不跳过，1跳过。*/
    skipStory: number = 0;

    // 语音是否关闭
    forbidvoice: boolean = false;

    //扫码登陆保存的信息
    zxingSession: number = 0;
    zxingToken: number = 0;
    zxingPCLogin: boolean = false;
    zxingMobileLogin: boolean = false;
    constructor() {
        this.reset();
    }

    private reset() {
        this.uin = 0;
        this.worldID = 1;
        this.platformType = 0;
        this.isAdult = 1;
        this.platTime = 0;
        this.serverID = UnityEngine.PlayerPrefs.GetInt("serverId", 0);
        this.username = '';
        this.sign = '';
    }

    public resetZXINGInfo() {
        this.zxingSession = 0;
        this.zxingToken = 0;
        this.zxingPCLogin = false;
        this.zxingMobileLogin = false;
    }
}