import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { HideType } from 'System/constants/GameEnum'
import { NetModule } from 'System/net/NetModule'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { PinstanceData } from 'System/data/PinstanceData'
import { DeputySetting } from 'System/skill/DeputySetting'
import { ThingData } from 'System/data/thing/ThingData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'

/**
 * 系统数据。
 * @author teppei
 *
 */
export class SystemData {
    /** 主角升级的时间 */
    updateTime: number = 0;
    /** 登录原因 */
    loginReason = 0;
    /** 尝试登录的类型和参数。 */
    tmploginEnterType: Protocol.LoginEnterType;
    /** 当前登录状态下的登录类型和参数 */
    crtLoginEnterType: Protocol.LoginEnterType;
    /** 系统设置数据列表。 */
    systemSettingList: number[];
    /** 是否已经初始化过设置信息 */
    initSetter: boolean = false;
    /** 第一次显示精灵 */
    firshShowLingBao: boolean = false;
    /** 是否第一次登陆游戏 */
    firshEnterGame: boolean = true;
    /** 第一次登陆的时间 */
    firshEnterGameTime: number = -1;
    /** 角色的注册时间 */
    roleZhuceTime: number = 0;
    /** 神装收集奖励状态 */
    rewardGodEquipDay: number = -1;
    /** 超神装收集奖励状态(已经废弃) */
    rewardGod2EquipDay: number = -1;

    /** 限次表 */
    private m_limitMap: { [pinstanceID: number]: number };

    private m_purdahs: number[] = new Array<number>();

    linkInfo: Protocol.LinkWorldInfo;

    /**上次下线时间*/
    m_uiLastLogoutTime: number;
    /**上次登陆的时间*/
    m_uilastLoginTime: number = 0;
    /**上次登陆的服务器ip,端口*/
    lastLoginIp: string = "";

    /**某个功能只操作一次的功能标记（第一步）如：有没有资格领取某礼包*/
    canOpenTagBits: number = 0;

    dayOperateBits = 0;

    offGuajiInfo: Protocol.CSOffGuajiInfo;

    /**判断今天是否是第一次登陆 */
    firstLoginToday:boolean = false;
    firstPay:boolean = false;
   
    private guaJiCfgs: GameConfig.FMTGuajiCfgM[];
    private lv2guaJiCfg: { [lv: number]: GameConfig.FMTGuajiCfgM } = {};

    /**内网测试平台名称*/
    ossTestPlatName: string = '';
    ossTestPlatId: number = 0;
    ossTestChannel: string = '';

    /**
     * 构造函数
     *
     */
    constructor() {
        this.tmploginEnterType = {} as Protocol.LoginEnterType;
        this.crtLoginEnterType = {} as Protocol.LoginEnterType;
        this.m_limitMap = {};
        this.systemSettingList = [0, 0, 0, 0, 0, 0];
    }

    onCfgReady() {
        this.setNewsConfig();
        this.setQQCustomConfig();
        this.setGuaJiConfigs();
    }

    get GuajiLeftTime(): number {
        let guajiInfo = G.DataMgr.systemData.offGuajiInfo;
        let leftTime = 0;
        if (null != guajiInfo) {
            leftTime = guajiInfo.m_iEnableTime;
        }
        return leftTime;
    }

    /**
     * 设置登录参数。
     * @param enterType
     * @param para1
     * @param para2
     *
     */
    setLoginEnterParam(loginReason: number, enterType: number, para1: number, para2: number): void {
        this.loginReason = loginReason;
        this.tmploginEnterType.m_cEnterType = enterType;
        this.tmploginEnterType.m_iPara1 = para1;
        this.tmploginEnterType.m_iPara2 = para2;
    }

    /**
     * 写入正式的登录参数。
     *
     */
    writeLoginType(loginReason: number): void {
        this.crtLoginEnterType.m_cEnterType = this.tmploginEnterType.m_cEnterType;
        this.crtLoginEnterType.m_iPara1 = this.tmploginEnterType.m_iPara1;
        this.crtLoginEnterType.m_iPara2 = this.tmploginEnterType.m_iPara2;
    }

    ///////////////////////////////////////////////////// 次数限制 /////////////////////////////////////////////////////

    /**
     * 更新活动已经完成的次数
     * @param response
     *
     */
    updateUseTimes(response: Protocol.ListActivityLimit_Response): void {
        // 先重置原有数据
        for (let key in this.m_limitMap) {
            this.m_limitMap[key] = 0;
        }

        let len: number = response.m_ucNumber;
        let finishTimeInfo: Protocol.ActivityFinishTimes;
        for (let i: number = 0; i < len; ++i) {
            finishTimeInfo = response.m_stFinishTimes[i];
            if (finishTimeInfo.m_iID <= 0) {
                continue;
            }
            this.m_limitMap[finishTimeInfo.m_iID] = finishTimeInfo.m_iFinishTimes;
        }
    }

    updateOnePinstanceTime(pinstanceID: number, leftTime: number): void {
        this.m_limitMap[pinstanceID] = this.getPinstanceTotalTimes(PinstanceData.getConfigByID(pinstanceID)) - leftTime;
    }

    /**获取副本已完成次数*/
    getFinishTime(id: number): number {
        let times = this.m_limitMap[id];
        if (undefined == times) {
            times = 0;
        }
        return times;
    }

    /**
     * 获取副本的总次数
     * @param config
     * @return
     *
     */
    getPinstanceTotalTimes(config: GameConfig.PinstanceConfigM): number {
        let vipTimes = 0;
        let vipData = G.DataMgr.vipData;
        if (Macros.PINSTANCE_ID_DIGONG == config.m_iPinstanceID) {
            vipTimes = vipData.getVipParaValue(KeyWord.VIP_PARA_DIGONG_NUM, G.DataMgr.heroData.curVipLevel);
        }
        return vipTimes + config.m_ucEnterTimes + vipData.getReserveTime(config.m_iPinstanceID);
    }


    /**获取副本剩余次数*/
    getPinstanceLeftTimes(config: GameConfig.PinstanceConfigM): number {
        let times = this.getPinstanceTotalTimes(config) - this.getFinishTime(config.m_iPinstanceID);
        if (times >= 0) {
            return times;
        }
        return 0;
    }

    isCrtLoginTypeCrossSvr(): boolean {
        return KeyWord.NAVIGATION_CROSS_PIN == this.crtLoginEnterType.m_cEnterType || KeyWord.NAVIGATION_CROSS_PVP == this.crtLoginEnterType.m_cEnterType ||
            KeyWord.NAVIGATION_CROSS_FINAL == this.crtLoginEnterType.m_cEnterType || KeyWord.NAVIGATION_CROSS_ACT == this.crtLoginEnterType.m_cEnterType;
    }

    ///////////////////////////////////////////////////// 公告配置 /////////////////////////////////////////////////////

    /**
     * 设置公告配置。
     * @param configs
     *
     */
    private m_newsConfig: { [plat: number]: { [customChannelId: string]: GameConfig.NewsConfigM } } = {};
    private newConfigs: GameConfig.NewsConfigM[] = [];
    private setNewsConfig(): void {
        let configs: GameConfig.NewsConfigM[] = G.Cfgmgr.getCfg('data/NewsConfigM.json') as GameConfig.NewsConfigM[];
        this.newConfigs = configs;
        for (let config of configs) {
            let cfgChannelId = config.m_szChannelID == '' ? '0' : config.m_szChannelID;
            let platId = config.m_ucPlatformID;
            if (this.m_newsConfig[platId] == null) {
                this.m_newsConfig[platId] = {};
            }
            this.m_newsConfig[platId][cfgChannelId] = config;
        }
    }

    /**通过平台id,渠道号获取相应的公告配置*/
    getNewsConfigByPlatChannelId(plat: number, customChannelId: string): GameConfig.NewsConfigM {
        if (this.m_newsConfig[plat] == null) {
            return this.newConfigs[0];
        }
        return this.m_newsConfig[plat][customChannelId];
    }

    /////////////////////////////////////////////////////客服QQ/////////////////////////////////////////////////////

    private m_qqConfig: { [plat: number]: { [customChannelId: string]: GameConfig.QQGroupShowConfigM } } = {};
    private qqConfig: { [platName: string]: GameConfig.QQGroupShowConfigM } = {};
    private setQQCustomConfig() {
        this.qqConfig = {};
        let configs: GameConfig.QQGroupShowConfigM[] = G.Cfgmgr.getCfg('data/QQGroupShowConfigM.json') as GameConfig.QQGroupShowConfigM[];
        for (let config of configs) {
            if (this.m_qqConfig[config.m_iPlatformID] == null) {
                this.m_qqConfig[config.m_iPlatformID] = {};
            }
            this.m_qqConfig[config.m_iPlatformID][config.m_szChannelID] = config;
            this.qqConfig[config.m_szPlatformName] = config;
        }
    }

    getPlatQQConfigByPlatName(platName: string): GameConfig.QQGroupShowConfigM {
        if (this.qqConfig[platName] == null) {
            return null;
        }
        return this.qqConfig[platName];
    }

    getPlatName(plat: number, channelId: string): string {
        let str: string = '';
        if (this.m_qqConfig[plat] != null && this.m_qqConfig[plat][channelId] != null) {
            return this.m_qqConfig[plat][channelId].m_szPlatformName;
        }
        return null;
    }


    getCustomQQStr(plat: number, channelId: string) {
        let str: string = '';
        if (this.m_qqConfig[plat] != null && this.m_qqConfig[plat][channelId] != null) {
            str = this.m_qqConfig[plat][channelId].m_szContent;
        }
        return str;
    }

    // todo
    setSystemInfo(settingList: Protocol.SystemSettingList): void {
        this.initSetter = true;
        for (let i: number = 0; i < settingList.m_ucNumber; i++)
            this.systemSettingList[i] = settingList.m_ucValueList[i];

        //let info: string = settingList.m_szCacheValue;
        //if (StringUtil.isEmpty(info)) {
        //    this.seve(); //第一次登陆游戏，直接保存一些配置信息
        //    this.firshEnterGameTime = UnityEngine.Time.realtimeSinceStartup;
        //    this.roleZhuceTime = Mgr.ins.syncTime.getCurrentTime() / 1000;
        //    return;
        //}
        //this.firshEnterGame = false; //已经有数据了,表示不是第一次登陆游戏

        //let infos: [] = info.split(':');
        //let items: [] = infos[0].split('_'); //剧情
        //for (let id of items)
        //    this.addPurdah(id);

        //if (isEaString(infos[1]))
        //    infos[1] = '0_0_0_0_0_0_0_0_0';

        //let hides: [] = infos[1].split('_');
        //for (let j: number = 0; j < hides.length; j++) {
        //    this.setHideState(j, toBoolean(hides[j]));
        //}

        //if (!isEaString(infos[2])) //第二列
        //{
        //    let sett: [] = infos[2].split('_');
        //    this.firshShowLingBao = sett[0] == '1'; //精灵是否第一次提示过
        //    this.rewardGodEquipDay = int(sett[1] == null ? -1 : sett[1]) //领取的天数
        //    this.rewardGod2EquipDay = int(sett[2] == null ? -1 : sett[2]) //领取的天数
        //}
    }

    // todo
    ///** 隐藏称号状态 */
    //getHideTitleState(): boolean {
    //    if (Mgr.ins.sheildMgr.hideAllTitle)
    //        return true;
    //    return toBoolean(this.m_hides[0]);
    //}

    ///** 隐藏翅膀状态 */
    //getHideWingState(): boolean {
    //    return toBoolean(this.m_hides[1]);
    //}

    ///** 隐藏伙伴状态 */
    //getHidePetState(): boolean {
    //    return toBoolean(this.m_hides[2]);
    //}

    //addPurdah(id: number): void {
    //    if (id != 0 && !this.isPurdah(id)) {
    //        let cfg: GameConfig.StoryTriggerCfgM = StoryModule.cfg.getTrigger(id);
    //        if (cfg == null)
    //            return;
    //        let infos: [] = cfg.m_ucEndHideNPC.split('_');
    //        for (let i: number = 0; i < infos.length; i++)
    //            this.elementModule.addHideNpcIds(int(infos[i]));

    //        infos = cfg.m_ucEndShowNPC.split('_');
    //        for (i = 0; i < infos.length; i++)
    //            this.elementModule.removeHideNpcIds(int(infos[i]));
    //        this.m_purdahs.push(id);

    //        sendMsg(ProtocolUtil.getSystemSettingChangeRequest());
    //    }
    //}

    /**
     * 是否已经播放完成剧情
     * @param id 剧情ID
     * @return
     *
     */
    isPurdah(id: number): boolean {
        return this.m_purdahs.indexOf(id) != -1;
    }

    private _onlyOneTimeAllLifeBits: number = 0;
    /**
	* 某个功能只操作一次的功能标记（第二步）如：可以领取某礼包 == true
	* @param id
	*
	*/
    canDoAllLifeFinal(id: number): boolean {
        return (this.onlyOneTimeAllLifeBits & id) == 0;
    }
   /**
    * 是否可以膜拜
    * @param id
    */
    canMoBai(id: number): boolean {
        return (this.dayOperateBits & id) == 0;
    }
    /**
     * 魂环是否可以激活
     * @param id
     */
    //canActiveHunHuan(id: number): boolean {
    //    let canActiveIndex = G.DataMgr.hunliData.isActiveHunHuanIndex;
    //    return (canActiveIndex & id) == 0;
    //}

    /**某个功能只操作一次的功能标记（第二步）如：是否领取过某礼包*/
    get onlyOneTimeAllLifeBits(): number {
        return this._onlyOneTimeAllLifeBits;
    }

    set onlyOneTimeAllLifeBits(value: number) {
        if (this._onlyOneTimeAllLifeBits != value) {
            this._onlyOneTimeAllLifeBits = value;
        }
    }

    private setGuaJiConfigs() {
        this.guaJiCfgs = G.Cfgmgr.getCfg('data/FMTGuajiCfgM.json') as GameConfig.FMTGuajiCfgM[];
    }

    getGuaJiCfg(lv: number): GameConfig.FMTGuajiCfgM {
        let cfg = this.lv2guaJiCfg[lv];
        if (!cfg) {
            for (let c of this.guaJiCfgs) {
                if (c.m_iLevelMin <= lv && lv < c.m_iLevelMax) {
                    cfg = c;
                    break;
                }
            }
            if (!cfg) {
                cfg = this.guaJiCfgs[this.guaJiCfgs.length - 1];
            }
            this.lv2guaJiCfg[lv] = cfg;
        }
        return cfg;
    }

}
