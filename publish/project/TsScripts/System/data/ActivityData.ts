import { TianMingBangRewardView } from './../pinstance/selfChallenge/TianMingBangRewardView';
import { Constants } from "System/constants/Constants";
import { EnumDurationType } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { DailySignData } from "System/data/activities/DailySignData";
import { KaifuSignData } from "System/data/activities/KaifuSignData";
import { LevelGiftData } from "System/data/activities/LevelGiftData";
import { OfflineExpData } from "System/data/activities/OfflineExpData";
import { OnlineGiftData } from "System/data/activities/OnlineGiftData";
import { BossZhaoHuanData } from "System/data/activities/BossZhaoHuanData";
import { WhjxData } from "System/data/activities/WhjxData";
import { ZhenLongQiJuData } from "System/data/activities/ZhenLongQiJuData";
import { GuildPvpData } from "System/data/GuildPvpData";
import { MonsterData } from "System/data/MonsterData";
import { HeroData } from "System/data/RoleData";
import { HddtDailyActItemData } from "System/data/vo/HddtDailyActItemData";
import { XxddData } from "System/data/XxddData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { CompareUtil } from "System/utils/CompareUtil";
import { BossHomeData } from 'System/pinstance/boss/BossHomePanel'
import { ZhufuData } from 'System/data/ZhufuData'
import { NewYearData } from "System/data/NewYearData";
import { CollectExchangeItemData } from 'System/data/vo/CollectExchangeItemData'
import { ActivityShowType, EnumRewardState, ActivityPlan } from "System/constants/GameEnum";

export class ActivityData {
    /**开服7天后，一些功能放返利*/
    static KAIFU2FANLIDAY: number = 7;

    public guildPvpData: GuildPvpData = new GuildPvpData();
    private m_funcId2actId: { [actId: number]: number } = {};

    /**活动配置信息*/
    private m_activityConfigs: GameConfig.ActivityConfigM[];

    /**活动大厅配置*/
    private _actHomeConfigs: { [type: number]: GameConfig.ActHomeConfigM[] | { [type: number]: GameConfig.ActHomeConfigM[] } | { [type: number]: { [day: number]: GameConfig.ActHomeConfigM[] } } };
    private actHomeCfgMap: { [id: number]: GameConfig.ActHomeConfigM } = {};

    /**时间限制配置表。*/
    private m_timeLimitMap: { [id: number]: GameConfig.TimeLimitConfigM } = {};

    /**
     * [活动id， 活动配置数据]对
     */
    private m_dataMap: { [id: number]: GameConfig.ActivityConfigM } = {};

    /**活动状态映射表，活动ID为键，活动状态为值。*/
    m_activityStatusMap: { [id: number]: Protocol.ActivityStatus } = {};

    private dayCfgsMap: { [key: string]: GameConfig.ActHomeConfigM[] } = {}

    /**活动提示记录，记录了所有提示过的活动，防止重复提示，活动关闭后清除记录。*/
    private m_activityPrompLog: { [id: number]: boolean } = {};

    /**活动面板上的各项活动状态表。*/
    private m_actPanelStatusMap: { [index: number]: number } = {};

    /**部分活动状态变化通知*/
    private m_tabStatue: Protocol.IconStatusOne[];
    /**急速挑战*/
    private m_jstz: { [m_iID: number]: GameConfig.JSTZM } = {};
    /**急速挑战排名*/
    private m_jstzRank: { [m_iDay: number]: { [condition: number]: GameConfig.JSTZRankM } } = {};

    /**连续返利配置*/
    private m_LxflConfigs: { [type: number]: { [m_iID: number]: GameConfig.LXFLActCfgM } } = {};

    private m_isReady: boolean;
    get isReady(): boolean {
        return this.m_isReady;
    }

    /**星星点灯*/
    public xxdd: XxddData = new XxddData();

    /**每日签到数据*/
    dailySignData: DailySignData = new DailySignData();

    /**开服签到数据*/
    kaifuSignData: KaifuSignData = new KaifuSignData();

    /**等级礼包数据*/
    levelGiftData: LevelGiftData = new LevelGiftData();

    /**在线礼包数据。*/
    onlineGiftData: OnlineGiftData = new OnlineGiftData();

    /**BOSS召唤数据*/
    BOSSZhanHuanData: BossZhaoHuanData = new BossZhaoHuanData();
    /**离线经验数据*/
    offlineExpData: OfflineExpData = new OfflineExpData();

    /**西洋棋数据*/
    zlqjData: ZhenLongQiJuData = new ZhenLongQiJuData();

    /**国运数据存储器*/
    guoyunData: Protocol.DBGuoYunData;

    /**跨服boss的信息*/
    kuafuBossData: Protocol.SMZTOpenPannelRes;

    /**所有世界boss信息*/
    m_stBigBossList: Protocol.CSBigBossList;
    m_bigBossInfoDic: { [id: number]: Protocol.CSBossOneInfo } = {};

    /**祈福数据*/
    private m_qifuConfig: GameConfig.QiFuConfigM[] = [];

    /**七天登陆数据*/
    private _sevenDayArr: GameConfig.SevenDayCfgM[] = [];
    /**聚划算配置表字典*/
    private _jhsDic: { [id: number]: GameConfig.JUHSActCfgM };
    /**投资计划数据*/
    tzjhInfo: Protocol.JUHSOpenPannelRsp;
    private _tzjhCount: number = 0;
    /**进阶日活动*/
    private m_jinJieRiDayDic: { [type: number]: GameConfig.StageDayCfgM[] };
    private m_jinJieRiConfigx: { [id: number]: GameConfig.StageDayCfgM };

    /**消费面板数据*/
    m_stConsumeRankPanel: Protocol.ConsumeRankInfoRsp;
    /**消费排行榜数据*/
    m_stConsumeRankList: Protocol.ConsumeRankListRsp;
    m_sDailyConsumePanel: Protocol.DailyConsumeRsp;
    m_consumeRankActCfgs: GameConfig.ConsumeRankActCfgM[];

    /**消费送好礼配置表字典*/
    private _dailyConsumeDic: { [id: number]: GameConfig.DailyConsumeActCfgM[] } = {};

    /**充值送好礼配置表字典*/
    private _dailyChargeDic: { [id: number]: GameConfig.DailyConsumeActCfgM } = {};

    private dailyConsumeIdDic: { [id: number]: boolean } = {};

    /**聚宝盆 活动状态*/
    jbpStatusValue: Protocol.JBPOpenPanelInfo;
    /**至尊争夺服务器数据*/
    zzzdData: Protocol.ZZZDOpenPanelRsp;
    /** 至尊争夺跨服数据 */
    czzzzdData: Protocol.CZActOpenPannel;
    /**开服争夺服务器数据*/
    kfzzzdData: Protocol.ZZZDOpenPanelRsp;
    /**限时秒杀服务器数据*/
    xsmsData: Protocol.RushPurchasePanel
    /**开服争夺是否开启*/
    kfzzzdIsOpen: boolean = false;
    sdbxPanelInfo: Protocol.SDBXActPanelRsp;

    newYearData: NewYearData = new NewYearData();
    //private m_ZZZDCharge_Flashs: GameConfig.ZZZDChargeM[];

    /**武极大兑换*/
    private _jpddhVec: GameConfig.JPDDHActCfgM[];
    /**天下大兑换*/
    private _txddhVec: GameConfig.JPDDHActCfgM[];

    private m_cdkeyGiftMap: { [id: number]: GameConfig.CDKeyGiftConfigM } = {};

    whjxData: WhjxData = new WhjxData();

    //一元夺宝
    kfYiYuanDuoBaoData: Protocol.YYDBInfoRsp = null;
    /**7天投资数据*/
    sevenDayFundData: Protocol.SevenDayFundData = null;
    /**7天投资配置*/
    private sevenDayFundConfig: { [id: number]: GameConfig.SevenDayFundCfgM };
    /**7天投资某一种所有配置**/
    private sevenDayFundAllConfigs: { [type: number]: GameConfig.SevenDayFundCfgM[] };
    /**7天投资奖励数量7*/
    static readonly sevenDayCanGetCount: number = 7;
    /***7天投资类型数量3**/
    static readonly sevenDayTypeCount = 3;

    /**进阶日数据*/
    //public jinjieRiData: Protocol.JJRData;

    /**连续返利*/
    lxflData: Protocol.CSLXFLInfo;
    lxflFlag: boolean = false;

    //火热世界杯
    worldCupPanelData: Protocol.WCupPanelRsp;
    worldCupRankData: Protocol.WCupRankRsp;

    //火热世界杯冠军之路
    worldCupChampionPanelData: Protocol.WCupChampionPanelRsp;

    /** 收集兑换 */
    collectWordDatas: CollectExchangeItemData[] = [];
    CollectExchangeInfo: Protocol.SJDHActRsp;
    /**用于收集兑换的材料id*/
    collectMaterialIds: number[] = [];
    private collectWordIdMap: { [id: number]: CollectExchangeItemData } = {};
    qiFuListInfo: Protocol.QiFuListInfo;
    /**经验祈福是否已领取 */
    isGetQiFuExp: boolean = false;

    /**跨服夺宝中的参与奖是否已经领取 */
    isGetJojinReward:boolean = false;
    
    //功能预览数据
    m_stPreviewRewardInfo: Protocol.DBPreviewRewardInfo;

    /**神秘商店id */
    strotId:number = 0;
    /**神秘商店下次刷新时间 */
    nextRefreshTime:number = 0;
    /**神秘商店已刷新次数 */
    refreshTimes:number = 0;
    constructor() {
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_WORLDBOSS] = Macros.ACTIVITY_ID_WORLDBOSS;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_BOSS] = Macros.ACTIVITY_ID_WORLDBOSS;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_JXTTT] = Macros.ACTIVITY_ID_YMZC;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_GUOYUN] = Macros.ACTIVITY_ID_GUOYUN;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_ZHENYINGZHAN] = Macros.ACTIVITY_ID_CAMPBATTLE;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_ZPQYH] = Macros.ACTIVITY_ID_GUILDPVPBATTLE;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_NANMANRUQIN] = Macros.ACTIVITY_ID_SOUTHERNMAN; //末日终结者
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_TIANJIANGFUSHEN] = Macros.ACTIVITY_ID_TIANJIANGFUSHEN;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_DATI] = Macros.ACTIVITY_ID_QUESTIONACTIVITY;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_HAQX] = Macros.ACTIVITY_ID_HAQXACT;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_TDXM] = Macros.ACTIVITY_ID_TDXM;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_YBWL] = Macros.ACTIVITY_ID_YBWL;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_ZPFM] = Macros.ACTIVITY_ID_ZPFM;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_HLTB] = Macros.ACTIVITY_ID_HLTB;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_XYZP] = Macros.ACTIVITY_ID_XYZP;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_HLZP] = Macros.ACTIVITY_ID_HLZP;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_RRHAPPY] = Macros.ACTIVITY_ID_RRHAPPY;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_JZXG] = Macros.ACTIVITY_ID_JZXG; //猎户座
        //this.m_funcId2actId[KeyWord.ACT_FUNCTION_KFJDC] = Macros.ACTIVITY_ID_PVP_BASE; //跨服角斗场
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_BIWUDAHUI] = Macros.ACTIVITY_ID_PVP_BASE; //比武大会
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_BIWUDAHUI_PRE] = Macros.ACTIVITY_ID_PVP_BASE; //比武大会初赛
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_BIWUDAHUI_FNL] = Macros.ACTIVITY_ID_PVP_FINAL; //比武大会决赛
        this.m_funcId2actId[KeyWord.OTHER_FUNC_KFZMZ] = Macros.ACTIVITY_ID_CROSS_GUILDPVPBATTLE; //跨服宗门战
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_MYKXB] = Macros.ACTIVITY_ID_MYKXB;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_PAOWENQUAN] = Macros.ACTIVITY_ID_BATHE; //温泉
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_HSSB] = Macros.ACTIVITY_ID_DOUBLE_GUOYUN; //活动区的护送双倍按钮
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_DYZSPIN] = Macros.ACTIVITY_ID_DYZSPIN;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_7GOAL_KFCB] = Macros.ACTIVITY_ID_KFCB;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_COMSUME] = Macros.ACTIVITY_ID_DAILYCONSUME_CONSUME;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_SMZT] = Macros.ACTIVITY_ID_SHENMOZHETIAN;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_CROSSSVRBOSS] = Macros.ACTIVITY_ID_SHENMOZHETIAN;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_SBSG] = Macros.ACTIVITY_ID_MULTIPLE_EXP;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_BXZB] = Macros.ACTIVITY_ID_BXZB;  //宝箱争霸
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_YSZC] = Macros.ACTIVITY_ID_YSZC;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_TTBZ] = Macros.ACTIVITY_ID_TTZF;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_HLFP] = Macros.ACTIVITY_ID_HLFP;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_DDL] = Macros.ACTIVITY_ID_CROSS_DDL;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_JQ_REDBAG] = Macros.ACTIVITY_ID_CHARGE_REDBAG;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_CZTH] = Macros.ACTIVITY_ID_PREFER_CHARGE;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_CROSSYG] = Macros.ACTIVITY_ID_CROSSYUNGOU;
        //this.m_funcId2actId[KeyWord.ACT_FUNCTION_KFJDC] = Macros.ACTIVITY_ID_PVP_BASE;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_LHJ] = Macros.ACTIVITY_ID_LHJ;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_YBWL] = Macros.ACTIVITY_ID_YBWL;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_JINYUMANTANG] = Macros.ACTIVITY_ID_BU_BU_GAO_SHENG;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_RMBZC] = Macros.ACTIVITY_ID_RMBZC;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_HH_BATTLE] = Macros.ACTIVITY_ID_RMBZC;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_TOUZILICAI] = Macros.ACTIVITY_ID_JUHSACT;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_DDL] = Macros.DDL_ACT_LIGHT;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_CROSS3V3] = Macros.ACTIVITY_ID_PVP_MULTI;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_SWZC] = Macros.ACTIVITY_ID_SWZC;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_ZLQJ] = Macros.ACTIVITY_ID_ZLQJ;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_WANGHOUJIANGXIANG] = Macros.ACTIVITY_ID_WHJX;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_ZZHC] = Macros.ACTIVITY_ID_ZZHCMAIN;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_ZZHC_WC] = Macros.ACTIVITY_ID_ZZHCSUB;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_MEREONYBOX] = Macros.ACTIVITY_ID_SDBX;//盛典宝箱
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_QUANMING_HAIQI] = Macros.ACTIVITY_ID_QMHD;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_LEIJICHONGZHI] = Macros.ACTIVITY_ID_SPRING_CHARGE;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_DENGRUJIANGLI] = Macros.ACTIVITY_ID_SPRING_LOGIN;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_GERENHUODONGBOSS] = Macros.ACTIVITY_ID_GRBOSS;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_COLLECT_EXCHANGE] = Macros.ACTIVITY_ID_COLLECT_EXCHANGE;
        this.m_funcId2actId[KeyWord.OTHER_FUNC_MHZZ] = Macros.ACTIVITY_ID_MHZZ;
        this.m_funcId2actId[KeyWord.OTHER_FUNCTION_CHONGZHIZHEKOU] = Macros.ACTIVITY_ID_HJXN_CHARGE;
        this.m_funcId2actId[KeyWord.ACT_FUNCTION_JBP] = Macros.ACTIVITY_ID_JU_BAO_PENG; //聚宝盆
    }

    /**
    * 根据活动ID获取对应的功能ID。
    * @param activityID
    * @return
    *
    */
    getFuncIDByActID(activityID: number): number {
        for (let funcIdKey in this.m_funcId2actId) {
            if (activityID == this.m_funcId2actId[funcIdKey]) {
                return parseInt(funcIdKey);
            }
        }
        if (defines.has('_DEBUG')) {
            uts.assert(false, '找不到对应的活动功能：' + activityID);
        }
        return 0;
    }

    getActIdByFuncId(funcId: number): number {
        let actId = this.m_funcId2actId[funcId];

        if (undefined == actId) {
            actId = 0;
        }
        return actId;
    }

    onCfgReady() {
        this.setActivityConfigs();
        this.setActHomeConfig();
        this.setTimeLimitConfigs();
        this.setQifuConfigs();
        this.setJstzCfg_Flash();
        this.setJstzRankCfg_Flash();
        this.setSevenDayCfg();
        this.setJhsCfgs();
        this.setJjrConfigx();
        this.setJPDDHConfig();
        this.setCDKeyGiftConfigs();
        this.whjxData.onCfgReady();
        this.setSevenDayFundConfigs();
        //this.setWorldCupCfg();
        this.setWorldCupIndexCfg();
        this.newYearData.onCfgReady();
        this.setAllPeopleHiCfg();
        this.setHiPointRewardCfg();
        this.setLxflCfgs();
        this.setCollectWordActCfgs()
    }

    private setActivityConfigs() {
        let dataList: GameConfig.ActivityConfigM[] = G.Cfgmgr.getCfg('data/ActivityConfigM.json') as GameConfig.ActivityConfigM[];
        let config: GameConfig.ActivityConfigM;
        let len: number = 0;
        for (let i: number = dataList.length - 1; i >= 0; i--) {
            config = dataList[i];
            // 过滤掉未激活和平台受限制的
            if (0 == config.m_iID) {
                dataList.splice(i, 1);

                continue;
            }

            // 清除无效数组
            len = config.m_aiEnterInstanceID.length;
            for (let j: number = len - 1; j >= 0; j--) {
                if (0 == config.m_aiEnterInstanceID[j]) {
                    config.m_aiEnterInstanceID.splice(j, 1);
                }
            }

            this.m_dataMap[config.m_iID] = config;
        }

        this.m_activityConfigs = dataList;
    }

    /**
    * 初始化活动状态数据。
    * @param data 活动状态原始数据。
    * @param giftModule 礼包模块的引用。
    *
    */
    setActivityStatusList(data: Protocol.ActivityStatus[]): void {
        for (let activityStatus of data) {
            this.updateActivityStatus(activityStatus);
        }

        this.m_isReady = true;
    }

    /**
    * 更新某个活动的状态。
    * @param newStatus 新的活动状态。
    *
    */
    updateActivityStatus(newStatus: Protocol.ActivityStatus): boolean {
        if (null == this.m_activityStatusMap) {
            return false;
        }

        let oldStatus: Protocol.ActivityStatus = this.m_activityStatusMap[newStatus.m_iID];
        if (null != oldStatus && CompareUtil.isActivityStatusEqual(oldStatus, newStatus)) {
            // 没有改变直接返回
            return false;
        }
        this.m_activityStatusMap[newStatus.m_iID] = newStatus;
        // 如果活动关闭了，清除其弹出记录
        if (null != this.m_activityPrompLog && !this.shouldPrompt(newStatus.m_iID)) {
            this.m_activityPrompLog[newStatus.m_iID] = false;
            delete this.m_activityPrompLog[newStatus.m_iID];
        }

        return true;
    }

    /**
     * 查询指定活动的状态。
     * @param activityID 指定的活动ID。
     * @return 指定的活动状态。
     *
     */
    getActivityStatus(activityID: number): Protocol.ActivityStatus {
        return this.m_activityStatusMap ? this.m_activityStatusMap[activityID] : null;
    }

    /**
     * 获取活动的结束时间。当前不在运行中的活动返回0。
     * @param activityID
     * @return
     *
     */
    getActivityEndTime(activityID: number): number {
        let activityStatus: Protocol.ActivityStatus = this.getActivityStatus(activityID);
        if (null == activityStatus || Macros.ACTIVITY_STATUS_RUNNING != activityStatus.m_ucStatus) {
            // 活动未开始
            return 0;
        }

        return activityStatus.m_iEndTime;
    }

    /**
    * 查询目前可以参加的活动数量。
    * @return 目前可以参加的活动数量。
    *
    */
    get availableActivityCount(): number {
        let count: number = 0;
        let activityStatus: Protocol.ActivityStatus;
        for (let activityConfig of this.m_activityConfigs) {
            // 过滤掉未开启的
            if (!activityConfig.m_ucIsActived) {
                continue;
            }
            activityStatus = this.getActivityStatus(activityConfig.m_iID)
            if (null == activityStatus) {
                continue;
            }

            if (KeyWord.ACTIVITY_TYPE_NORMAL == activityConfig.m_ushActivityType) {
                if (Macros.ACTIVITY_STATUS_UNOPEN == activityStatus.m_ucStatus) {
                    // 日常活动2表示可以参与
                    count++;
                }
            }
            else if (KeyWord.ACTIVITY_TYPE_PVPBOSS != activityConfig.m_ushActivityType && KeyWord.ACTIVITY_TYPE_WORLDBOSS != activityConfig.m_ushActivityType && this.isActivityOpen(activityConfig.m_iID) && Macros.ACTIVITY_STATUS_FINISH != activityStatus.m_ucStatus) {
                // 开服活动
                count++;
            }
        }
        return count;
    }

    /**
     * 查询指定的活动是否已经开启
     * @param activityID 活动啊ID。
     *
     */
    isActivityOpen(activityID: number): boolean {
        let activityStatus: Protocol.ActivityStatus = this.getActivityStatus(activityID);
        
        return null != activityStatus && Macros.ACTIVITY_STATUS_RUNNING == activityStatus.m_ucStatus;
    }

    shouldPrompt(activityID: number): boolean {
        let actConfig: GameConfig.ActivityConfigM = this.getActivityConfig(activityID);
        if (actConfig == null) {
            uts.log('找不到活动配置：' + activityID);
            return false;
        }
        // 检查活动配置
        if (0 == actConfig.m_ucNeedWinPrompt) {
            return false;
        }

        // 检查提示等级
        if (actConfig.m_ucPromptLevel > 0 && G.DataMgr.heroData.level < actConfig.m_ucPromptLevel) {
            return false;
        }

        // 活动未开始不提示
        if (!this.isActivityOpen(activityID)) {
            return false;
        }

        // 活动已经提示过了也不提示
        if (null != this.m_activityPrompLog && this.m_activityPrompLog[activityID]) {
            return false;
        }

        // 超过45分钟不再提示
        let status: Protocol.ActivityStatus = this.getActivityStatus(activityID);

        if (Math.floor(G.SyncTime.getCurrentTime() / 1000) - status.m_iStartTime > 2700) {
            // 超过45分钟不提示
            return false;
        }

        // 功能未开启不可用
        let actFuncId: number = this.getFuncIDByActID(activityID);
        if (actFuncId > 0) {
            if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(actFuncId)) {
                return false;
            }
        }

        // 某些活动有特殊需求，比如跟任务有关系的
        if (Macros.ACTIVITY_ID_GUOYUN == activityID && !G.DataMgr.questData.canAcceptShip(G.DataMgr.questData.guoyunConsignerNpcID, G.DataMgr.heroData, true)) {
            return false;
        }
        //在副本里不提示
        if (G.DataMgr.sceneData.curPinstanceID > 0) {
            return false;
        }

        // 已经在活动中了也不提示
        if (actConfig.m_iEnterSceneID == G.DataMgr.sceneData.curSceneID) {
            return false;
        }
        else {
            for (let pid of actConfig.m_aiEnterInstanceID) {
                if (pid > 0 && pid == G.DataMgr.sceneData.curPinstanceID) {
                    return false;
                }
            }
        }

        return true;
    }

    shouldRemind(activityID: number): boolean {
        // 活动未开始不提示
        if (!this.isActivityOpen(activityID)) {
            return false;
        }

        // 超过45分钟不再提示
        let status: Protocol.ActivityStatus = this.getActivityStatus(activityID);
        if (null == status || 1 == status.m_ucMoreThan45Min) {
            return false;
        }

        return true;
    }

    /**
     * 记录活动已经提示过了。
     * @param activityID
     *
     */
    logPromp(activityID: number): void {
        if (null == this.m_activityPrompLog) {
            this.m_activityPrompLog = {};
        }
        this.m_activityPrompLog[activityID] = true;
    }

    /**
     * 获取需要提示的活动ID。
     * @return
     *
     */
    getPromptActivityID(): number {
        for (let activityConf of this.m_activityConfigs) {
            if (this.shouldPrompt(activityConf.m_iID)) {
                if (Macros.ACTIVITY_ID_KFNS != activityConf.m_iID || this.newYearData.getKfnsBossState()) {
                    return activityConf.m_iID;
                }
            }
        }

        return 0;
    }

    /**
     * 查询指定活动的配置。
     * @param activityID 指定的活动ID。
     * @return 指定的活动配置。
     *
     */
    getActivityConfig(activityID: number): GameConfig.ActivityConfigM {
        return this.m_dataMap[activityID];
    }

    /**
    * 更新活动面板上的状态数据。
    * @param info
    *
    */
    updateActivityPanelInfo(infoList: Protocol.ActivityPanelInfo[]): void {
        for (let info of infoList) {
            if (0 == info.m_iIndex) {
                continue;
            }
            this.m_actPanelStatusMap[info.m_iIndex] = info.m_ucCompleteCnt;
        }
    }

    getDailyActHomeCfgs() {
        let syncTime = G.SyncTime;
        let day: number = syncTime.serverDate.getDay();
        let now = syncTime.getCurrentTime();
        let activityData: ActivityData = G.DataMgr.activityData;
        let actList: GameConfig.ActHomeConfigM[] = activityData.getActHomeCfgList(day);
        let itemData: HddtDailyActItemData;
        let actCfg: GameConfig.ActHomeConfigM;
        let timeLimitConfig: GameConfig.TimeLimitConfigM;

        let listDatas: HddtDailyActItemData[] = [];

        let indexList: number[] = [];
        let cnt = actList.length;
        for (let i = 0; i < cnt; i++) {
            actCfg = actList[i];

            if (indexList.indexOf(actCfg.m_iIndex) >= 0) {
                continue;
            }

            let cfg: GameConfig.ActivityConfigM = activityData.getActivityConfig(actCfg.m_iID);
            if (null == cfg || cfg.m_ucIsActived == 0) {
                continue;
            }

            let status = activityData.getActivityStatus(actCfg.m_iID);
            if (null == status) {
                continue;
            }

            itemData = new HddtDailyActItemData();
            itemData.config = actCfg;
            itemData.status = status;


            timeLimitConfig = activityData.getTimeLimitConfigByID(cfg.m_iTimeLimitID);
            if (timeLimitConfig == null) continue;
            let startTime = timeLimitConfig.m_aOpenTimeStamps[actCfg.m_ucTimeId - 1];
            let endTime = timeLimitConfig.m_aCloseTimeStamps[actCfg.m_ucTimeId - 1];
            let durType = G.SyncTime.getDurationType(startTime, endTime, now);

            itemData.durationType = durType;
            itemData.updateSortStatus();
            listDatas.push(itemData);
            indexList.push(actCfg.m_iIndex);
        }

        listDatas.sort(delegate(this, this._sortListData));
        return listDatas;
    }

    /**
     * 排序
     * @param data1
     * @param data2
     * @return
     *
     */
    private _sortListData(data1: HddtDailyActItemData, data2: HddtDailyActItemData): number {
        if (data1.sortStatus != data2.sortStatus) {
            return data1.sortStatus - data2.sortStatus;
        }
        else {
            return data1.config.m_ucPos - data2.config.m_ucPos;
        }
    }

    setTabStatue(data: Protocol.TabStatus_Change_Notify): void {
        this.m_tabStatue = data.m_stIconList;
    }

    getTabStatue(type: number): Protocol.IconStatusOne {
        return this.m_tabStatue[type];
    }

    /**
     * 后台推送的是否有小红点
     * @param type
     * @param subIndex
     */
    needTipMark(type: number, subIndex: number): boolean {
        let tabStatus = G.DataMgr.activityData.getTabStatue(type);
        return !!tabStatus.m_stTabStatusList[subIndex];
    }

    /**
	* 活动大厅配置
	* @param data
	*
	*/
    private setActHomeConfig(): void {
        let configs: GameConfig.ActHomeConfigM[] = G.Cfgmgr.getCfg('data/ActHomeConfigM.json') as GameConfig.ActHomeConfigM[];

        this._actHomeConfigs = {};
        this._actHomeConfigs[ActivityShowType.DAY] = {};
        this._actHomeConfigs[ActivityShowType.OPEN_SEVER] = {};
        this._actHomeConfigs[ActivityShowType.END_SEVER] = {};
        this._actHomeConfigs[ActivityShowType.START_SEVER] = {};
        this._actHomeConfigs[ActivityShowType.SELECT_SEVER] = {};
        this._actHomeConfigs[ActivityShowType.YUN_YING] = [];

        let day: number = 0;
        let dataList: GameConfig.ActHomeConfigM[];
        for (let cfg of configs) {
            this.actHomeCfgMap[cfg.m_iID] = cfg;
            let typeInfo: string[] = cfg.m_szShowType.split('_');
            let type = parseInt(typeInfo[0]);
            if (type == ActivityShowType.DAY) {
                let dataObject = this._actHomeConfigs[ActivityShowType.DAY] as { [type: number]: GameConfig.ActHomeConfigM[] };
                day = cfg.m_ucDay % 7;
                dataList = dataObject[day];

                if (dataList == null) {
                    dataObject[day] = dataList = new Array<GameConfig.ActHomeConfigM>();
                }

                dataList.push(cfg);
            }
            else if (type == ActivityShowType.OPEN_SEVER) {
                let dataObject = this._actHomeConfigs[ActivityShowType.OPEN_SEVER] as { [type: number]: GameConfig.ActHomeConfigM[] };
                day = parseInt(typeInfo[1]);
                dataList = dataObject[day];
                if (dataList == null) {
                    dataObject[day] = dataList = new Array<GameConfig.ActHomeConfigM>();
                }

                dataList.push(cfg);
            }
            else if (type == ActivityShowType.END_SEVER) {
                let dataObject = this._actHomeConfigs[ActivityShowType.END_SEVER] as { [type: number]: { [day: number]: GameConfig.ActHomeConfigM[] } };
                if (dataObject[typeInfo[1]] == null) {
                    dataObject[typeInfo[1]] = {};
                }
                day = cfg.m_ucDay % 7;
                dataList = dataObject[typeInfo[1]][day];

                if (dataList == null) {
                    dataObject[typeInfo[1]][day] = dataList = new Array<GameConfig.ActHomeConfigM>();
                }

                dataList.push(cfg);
            }
            else if (type == ActivityShowType.START_SEVER) {
                let dataObject = this._actHomeConfigs[ActivityShowType.START_SEVER] as { [type: number]: { [day: number]: GameConfig.ActHomeConfigM[] } };
                if (dataObject[typeInfo[1]] == null) {
                    dataObject[typeInfo[1]] = {};
                }
                day = cfg.m_ucDay % 7;
                dataList = dataObject[typeInfo[1]][day];

                if (dataList == null) {
                    dataObject[typeInfo[1]][day] = dataList = new Array<GameConfig.ActHomeConfigM>();
                }

                dataList.push(cfg);
            }
            else if (type == ActivityShowType.SELECT_SEVER) {
                let dataObject = this._actHomeConfigs[ActivityShowType.SELECT_SEVER] as { [type: number]: GameConfig.ActHomeConfigM[] };
                if (dataObject[typeInfo[1]] == null) {
                    dataObject[typeInfo[1]] = new Array<GameConfig.ActHomeConfigM>();
                }
                dataList = dataObject[typeInfo[1]];
                dataList.push(cfg);
            }
            else if (type == ActivityShowType.YUN_YING) {
                let dataList = this._actHomeConfigs[ActivityShowType.YUN_YING] as GameConfig.ActHomeConfigM[];
                dataList.push(cfg);
            }
        }
    }

    getActHomeCfg(id: number): GameConfig.ActHomeConfigM {
        return this.actHomeCfgMap[id];
    }

    /**
    * 获得某天的活动列表配置
    * @param day
    * @return
    *
         */
    getActHomeCfgList(day: number): GameConfig.ActHomeConfigM[] {
        let startServerDay: number = G.SyncTime.getDateAfterStartServer();
        let cacheKey = startServerDay * 10 + day;
        let dataList = this.dayCfgsMap[cacheKey];
        if (dataList) {
            return dataList;
        }

        dataList = this._actHomeConfigs[ActivityShowType.DAY][day] as GameConfig.ActHomeConfigM[];
        dataList = dataList.concat();

        let dataOjbect0 = this._actHomeConfigs[ActivityShowType.OPEN_SEVER] as { [type: number]: GameConfig.ActHomeConfigM[] };
        for (let keyday in dataOjbect0) {
            if (startServerDay <= parseInt(keyday)) {
                dataList = dataList.concat(dataOjbect0[keyday]);
            }
        }
        let dataOjbect1 = this._actHomeConfigs[ActivityShowType.END_SEVER] as { [type: number]: { [day: number]: GameConfig.ActHomeConfigM[] } };
        for (let keyday in dataOjbect1) {
            if (startServerDay >= parseInt(keyday)) {
                let arr = dataOjbect1[keyday][day];
                if (arr)
                    dataList = dataList.concat(arr);
            }
        }
        let dataOjbect2 = this._actHomeConfigs[ActivityShowType.START_SEVER] as { [type: number]: { [day: number]: GameConfig.ActHomeConfigM[] } };
        for (let keyday in dataOjbect2) {
            if (startServerDay <= parseInt(keyday)) {
                let arr = dataOjbect2[keyday][day];
                if (arr)
                    dataList = dataList.concat(arr);
            }
        }
        let dataOjbect3 = this._actHomeConfigs[ActivityShowType.SELECT_SEVER] as { [type: number]: GameConfig.ActHomeConfigM[] };
        let arr = dataOjbect3[startServerDay];
        if (arr)
            dataList = dataList.concat(arr);

        let funcLimitData = G.DataMgr.funcLimitData;
        for (let i: number = dataList.length - 1; i >= 0; i--) {
            let cfg = dataList[i];
            if (cfg.m_iID == Macros.ACTIVITY_ID_GUILDPVPBATTLE) {
                if (startServerDay > Constants.CORSS_GUILD_PVP_START_DAY) {
                    dataList.splice(i, 1);
                    continue;
                }
            }

            if (cfg.m_iFunctionId > 0 && !funcLimitData.isFuncMatchPlatform(cfg.m_iFunctionId)) {
                dataList.splice(i, 1);
                continue;
            }
        }
        this.dayCfgsMap[cacheKey] = dataList;
        return dataList;
    }



    /**七天登录展示配置表*/
    setSevenDayCfg(): void {
        let configs: GameConfig.SevenDayCfgM[] = G.Cfgmgr.getCfg('data/SevenDayCfgM.json') as GameConfig.SevenDayCfgM[];
        for (let config of configs) {
            this._sevenDayArr.push(config);
        }
    }

    /**七天登录展示配置表*/
    sevenDayArr(): GameConfig.SevenDayCfgM[] {
        return this._sevenDayArr;
    }
    /////////////////////////////////////////////// 收集兑换 ///////////////////////////////////////////////

    private setCollectWordActCfgs() {
        let configs = G.Cfgmgr.getCfg('data/CollectExchangeActCfgM.json') as GameConfig.CollectExchangeActCfgM[];

        let item: CollectExchangeItemData;
        for (let cfg of configs) {
            let cnt = cfg.m_stCaiLiaoList.length;
            for (let i = cnt - 1; i >= 0; i--) {
                let mid = cfg.m_stCaiLiaoList[i].m_uiID;
                if (mid == 0) {
                    cfg.m_stCaiLiaoList.splice(i, 1);
                } else if (this.collectMaterialIds.indexOf(mid) < 0) {
                    this.collectMaterialIds.push(mid);
                }
            }
            item = new CollectExchangeItemData(cfg);
            this.collectWordDatas.push(item);
            this.collectWordIdMap[cfg.m_iID] = item;
        }
    }

    /**
     * 收集兑换
     * @param data
     *
     */
    updateCollectExchange(data: Protocol.SJDHActRsp): void {
        this.CollectExchangeInfo = data;
        let exchangeList: number[] = data.m_stList;
        for (let i: number = 0; i < data.m_ucCount; i++) {
            if (i < this.collectWordDatas.length) {
                let itemVo = this.collectWordIdMap[i + 1];
                if (itemVo != null) {
                    itemVo.exchangeCount = exchangeList[i];
                }
            }
        }
    }

    updateCollectExchangeWarn(SJDHActWarnRsp: number) {
        this.CollectExchangeInfo.m_uiWarnSelect = SJDHActWarnRsp;
    }


    /**收集兑换礼是否可领取*/
    canGetCollectExchange(): boolean {
        if (this.isActivityOpen(Macros.ACTIVITY_ID_COLLECT_EXCHANGE)) {
            let length = this.collectWordDatas.length;
            for (let i = 0; i < length; i++) {
                if (this.collectWordDatas[i].rewardState == EnumRewardState.NotGot && 0 == (this.CollectExchangeInfo.m_uiWarnSelect & 1 << i)) {

                    return true;
                }
            }
        }
        return false;
    }
    ///////////////////////////////////////// 时间限制 /////////////////////////////////////////

    /**
     * 设置时间箱子配置。
     * @param configs
     *
     */
    private setTimeLimitConfigs(): void {
        let configs: GameConfig.TimeLimitConfigM[] = G.Cfgmgr.getCfg('data/TimeLimitConfigM.json') as GameConfig.TimeLimitConfigM[];

        let reg = /[, | |:]+/;
        for (let config of configs) {
            this.m_timeLimitMap[config.m_iID] = config;
            config.m_aOpenTimeStamps = [];
            config.m_aCloseTimeStamps = [];
            // 过滤无效字段
            for (let i: number = config.m_dtOpenTimes.length - 1; i >= 0; i--) {
                let t = config.m_dtOpenTimes[i];
                if ('' == t) {
                    config.m_dtOpenTimes.splice(i, 1);
                }
            }
            for (let i: number = config.m_dtCloseTimes.length - 1; i >= 0; i--) {
                let t = config.m_dtCloseTimes[i];
                if ('' == config.m_dtCloseTimes[i]) {
                    config.m_dtCloseTimes.splice(i, 1);
                }
            }
            for (let i: number = config.m_dtOpenTimes.length - 1; i >= 0; i--) {
                let t = config.m_dtOpenTimes[i];
                let strArr = t.split(reg);
                let th = parseInt(strArr[0]);
                let tm = parseInt(strArr[1]);
                let ts = parseInt(strArr[2]);
                config.m_aOpenTimeStamps[i] = th * 3600 + tm * 60 + ts;
            }
            for (let i: number = config.m_dtCloseTimes.length - 1; i >= 0; i--) {
                let t = config.m_dtCloseTimes[i];
                let strArr = t.split(reg);
                let th = parseInt(strArr[0]);
                let tm = parseInt(strArr[1]);
                let ts = parseInt(strArr[2]);
                config.m_aCloseTimeStamps[i] = th * 3600 + tm * 60 + ts;
            }
        }
    }

    /**
     * 获取指定ID的时间限制配置。
     * @param id
     * @return
     *
     */
    getTimeLimitConfigByID(id: number): GameConfig.TimeLimitConfigM {
        return this.m_timeLimitMap[id];
    }

    /**竞技场未领取的奖励数 （0无 1有可领 查看奖励 */
    get everydayAndRankReward(): number {
        if (this.allrankRewardCont + this.RankReward > 0)
            return 1;
        return 0;
    }

    /**可领取的排名奖励数 （每日奖励）*/
    get allrankRewardCont(): number {
        let heroData: HeroData = G.DataMgr.heroData;
        let count: number = 0;
        if (!heroData.isGetRankReward && (heroData.myPpkRankVal > 0) && heroData.rewardRank > 0) {
            count++;
        }
        return count;
    }
    /**排行可领奖励数 （0无 1有可领 达成奖励）  */
    get RankReward(): number {
        let heroData = G.DataMgr.heroData;
        for (let i = 0; i < 10; i++) {
            let config = G.DataMgr.pinstanceData.getTianMingBangConfigByIndex(i);
            let mayRank = G.DataMgr.heroData.myPpkRankVal;

            let isGetReward = (heroData.canGetMaxReward(1 << (config.m_iID - 1)) && mayRank <= config.m_iHighRank && mayRank > 0);

            if (isGetReward)
                return i;
        }
        return 0;
    }
    ///////////////////////////////////////// 国运 /////////////////////////////////////////

    updateGuoyunByRefresh(refresh: Protocol.GuoYunRefreshRsp): void {
        if (null != this.guoyunData) {
            this.guoyunData.m_ucRefreshFreeNum = refresh.m_ucRefreshFreeNum;
            this.guoyunData.m_iCurrentQuestLevel += refresh.m_cLevelChange;
        }
    }

    ///////////////////////////////////////// boss /////////////////////////////////////////
    /**今日挖宝总次数*/
    todayWaBaoAllCount: number = 0;
    /**今日世界boss已领奖次数*/
    allScriptCnt = 0;
    /**世界boss遗留次数*/
    leftCnt = 0;
    updateWorldBoss(resp: Protocol.WorldBossListRsp): void {
        this.m_stBigBossList = resp.m_stBigBossList;
        this.todayWaBaoAllCount = resp.m_iAllDigCnt;
        this.allScriptCnt = resp.m_iAllScriptCnt;
        this.leftCnt = resp.m_iLevelCnt;
        for (let bossOneInfo of this.m_stBigBossList.m_astBossList) {
            this.m_bigBossInfoDic[bossOneInfo.m_iBossID] = bossOneInfo;
        }
    }

    /**获取BOSS信息*/
    getOneBossInfo(bossId: number): Protocol.CSBossOneInfo {
        return this.m_bigBossInfoDic[bossId];
    }

    get bossList(): Protocol.CSBigBossList {
        return this.m_stBigBossList;
    }

    /**世界boss可挖宝数量*/
    get worldBossBoxCount(): number {
        if (this.m_stBigBossList == null) {
            return 0;
        }

        let count: number = 0;
        let bigBossList: Protocol.CSBossOneInfo[] = this.m_stBigBossList.m_astBossList;
        for (let vo of bigBossList) {
            if (Boolean(vo.m_ucIsDead) && vo.m_iGetRewardCnt == 0) {
                count += 1;
            }
        }
        return count;
    }

    ///////////////////////////////////////// 活动面板 /////////////////////////////////////////

    setQifuConfigs(): void {
        let configs: GameConfig.QiFuConfigM[] = G.Cfgmgr.getCfg('data/QiFuConfigM.json') as GameConfig.QiFuConfigM[];
        this.m_qifuConfig = configs;
    }

    getQifuConfig(type: number, level: number, leftTimes: number = 1, isFree: boolean = false): GameConfig.QiFuConfigM {
        for (let config of this.m_qifuConfig) {
            if (type == 3) {
                if (config.m_ucType == type && config.m_iLevelLowerLimit <= level && config.m_iLevelUpperLimit >= level) {
                    if (!isFree && config.m_uiPrice != 0)
                        return config;
                    else if (isFree)
                        return config;
                }
            } else {
                if (config.m_ucType == type && config.m_ucNumber == leftTimes && config.m_iLevelLowerLimit <= level && config.m_iLevelUpperLimit >= level) {
                    if (!isFree && config.m_uiPrice != 0)
                        return config;
                    else if (isFree)
                        return config;
                }
            }
        }
        return null;
    }
    //////////////////////////////急速竞技////////////////////////////////

    private jstzDataCount = 0;
    /**
     * 极速挑战配置表
     * @param	dataConfig
     * @param	data
     * @param	cfgs
     */
    setJstzCfg_Flash(): void {
        let cfgs: GameConfig.JSTZM[] = G.Cfgmgr.getCfg('data/JSTZM.json') as GameConfig.JSTZM[];
        for (let cfg of cfgs) {
            this.m_jstz[cfg.m_iID] = cfg;
            this.jstzDataCount++;
        }
    }

    /**
     * 极速挑战排行版配置表
     * @param	dataConfig
     * @param	data
     * @param	cfgs
     */
    setJstzRankCfg_Flash(): void {
        let cfgs: GameConfig.JSTZRankM[] = G.Cfgmgr.getCfg('data/JSTZRankM.json') as GameConfig.JSTZRankM[];
        let i: number = 0;
        for (let cfg of cfgs) {
            if (this.m_jstzRank[cfg.m_iDay] == null)
                this.m_jstzRank[cfg.m_iDay] = {};

            for (i = cfg.m_iCondition1; i <= cfg.m_iCondition2; i++) {
                this.m_jstzRank[cfg.m_iDay][i] = cfg;
            }
        }
    }

    /**连续返利配置表
    */
    private setLxflCfgs() {
        let cfgs = G.Cfgmgr.getCfg('data/LXFLActCfgM.json') as GameConfig.LXFLActCfgM[];
        for (let cfg of cfgs) {
            if (this.m_LxflConfigs[cfg.m_iType] == null) {
                this.m_LxflConfigs[cfg.m_iType] = {};
            }
            this.m_LxflConfigs[cfg.m_iType][cfg.m_iID] = cfg;
        }
    }

    getLxflByCondition1AndCondition2(type: number, condition1: number, condition2: number): GameConfig.LXFLActCfgM {
        let configs = this.m_LxflConfigs[type];
        for (let key in configs) {
            let itemData = configs[key];
            if (itemData.m_iCondition1 == condition1 && itemData.m_iCondition2 == condition2) {
                return itemData;
            }
        }
    }
    getLxflByID(type: number, id: number): GameConfig.LXFLActCfgM {
        return this.m_LxflConfigs[type][id];
    }

    /**
     * 获取急速挑战配置表
     * @param	day	配置表天数
     * @return
     */
    getJstzCfg_Flash(day: number): GameConfig.JSTZM {
        let index = this.getJstzCurrentIndex(day);
        return this.m_jstz[index];
    }

    /**
     * 获取极速挑战排行版配置表
     * @param	day  配置表天数
     * @param	rank	排行名次
     * @return
     */
    getJstzRankCfg_Flash(day: number, rank: number): GameConfig.JSTZRankM {
        let index = this.getJstzCurrentIndex(day);
        return this.m_jstzRank[index][rank];
    }

    getJstzCurrentIndex(day: number): number {
        let index = day;
        //最后七条数据轮换
        if (day > this.jstzDataCount) {
            index = (day - (this.jstzDataCount - 7)) % 7;
            index += (this.jstzDataCount - 7);
        }
        return index;
    }

    /**设置消费赠好礼配置*/
    setDailyConsumeConfig(): void {
        let cfgs: GameConfig.DailyConsumeActCfgM[] = G.Cfgmgr.getCfg('data/DailyConsumeActCfgM.json') as GameConfig.DailyConsumeActCfgM[];
        this._dailyConsumeDic = {};
        for (let act of cfgs) {
            let arr = this._dailyConsumeDic[act.m_iCondition2];
            if (!arr) {
                this._dailyConsumeDic[act.m_iCondition2] = arr = new Array<GameConfig.DailyConsumeActCfgM>();
            }
            arr.push(act);
        }
    }

    /**获取消费送好礼配置表数组*/
    getDailyConsumeConfigArr(day: number): GameConfig.DailyConsumeActCfgM[] {
        return this._dailyConsumeDic[day];
    }

    /**获取消费送好礼是否已领取*/
    getDailyConsumeIsGet(id: number): boolean {
        return this.dailyConsumeIdDic[id];
    }

    /**获取聚划算配置表*/
    getJhsConfig(id: number): GameConfig.JUHSActCfgM {
        return this._jhsDic[id];
    }

    /**聚划算配置表*/
    setJhsCfgs(): void {
        let configs: GameConfig.JUHSActCfgM[] = G.Cfgmgr.getCfg('data/JUHSActCfgM.json') as GameConfig.JUHSActCfgM[];
        this._jhsDic = {};

        for (let config of configs) {
            this._jhsDic[config.m_iID] = config;
        }
    }

    /**更新投资计划数据*/
    updateJhsData(m_stJUHSOpenPannel: Protocol.JUHSOpenPannelRsp): void {
        this.tzjhInfo = m_stJUHSOpenPannel;
        this._tzjhCount = 0;
        for (let oneInfo of this.tzjhInfo.m_stOneDataList) {
            let isCanGet: boolean = this.isCanGetByDay(oneInfo.m_ucDay);
            if (isCanGet) {
                this.tzjhCount = 1;
                return;
            }
        }
        if (this._tzjhCount == 0) {
            this.tzjhCount = this._tzjhCount;
        }
    }

    /**是否有一天可领取*/
    isCanGetByDay(day: number): boolean {
        let oneInfo: Protocol.JUHSActOneData;
        if (this.tzjhInfo.m_stOneDataList.length == 0) {
            return false;
        }
        let canGet: boolean = false;
        if (day <= this.tzjhInfo.m_stOneDataList.length) {
            oneInfo = this.tzjhInfo.m_stOneDataList[day - 1];
        }
        if (oneInfo) {
            if (oneInfo.m_ucGetNormal == 1) {
                canGet = true;
            }
            else if (oneInfo.m_ucGetOnLine == 1) {
                canGet = true;
            }
            else if (oneInfo.m_ucGetVIP == 1) {
                canGet = true;
            }
        }
        return canGet;
    }

    /**投资计划今天是否全部已领取*/
    isTodayAllGet(): boolean {
        if (!this.tzjhInfo.m_ucDay) {
            return false;
        }
        let allGet: boolean = true;
        if (this.tzjhInfo) {
            let oneInfo: Protocol.JUHSActOneData = this.tzjhInfo.m_stOneDataList[this.tzjhInfo.m_ucDay - 1];
            if (oneInfo) {
                if (oneInfo.m_ucGetNormal != 2) {
                    allGet = false;
                }
                else if (oneInfo.m_ucGetOnLine != 2) {
                    allGet = false;
                }
                else if (oneInfo.m_ucGetVIP != 2) {
                    allGet = false;
                }
            }
        }
        return allGet;
    }

    /**投资计划可领取数量*/
    get tzjhCount(): number {
        return this._tzjhCount;
    }

    set tzjhCount(value: number) {
        this._tzjhCount = value;
        // this.dispatchEvent(Events.UpdateShortCutFunctionBar);
    }

    /**
     *进阶日活动
     * @param data
     *
     */
    setJjrConfigx(): void {
        let data: GameConfig.StageDayCfgM[] = G.Cfgmgr.getCfg('data/StageDayCfgM.json') as GameConfig.StageDayCfgM[];
        this.m_jinJieRiConfigx = {};
        this.m_jinJieRiDayDic = {};
        for (let config of data) {
            this.m_jinJieRiConfigx[config.m_iID] = config;
            if (!this.m_jinJieRiDayDic[config.m_iDay]) {
                this.m_jinJieRiDayDic[config.m_iDay] = new Array<GameConfig.StageDayCfgM>();
            }
            this.m_jinJieRiDayDic[config.m_iDay].push(config);
        }
        for (let key in this.m_jinJieRiDayDic) {
            let vec = this.m_jinJieRiDayDic[key];
            vec.sort(this._sortType);
        }
    }

    getJjrDayConfig(day: number): GameConfig.StageDayCfgM[] {
        return this.m_jinJieRiDayDic[day];
    }

    private _sortType(a: GameConfig.StageDayCfgM, b: GameConfig.StageDayCfgM): number {
        return a.m_uiOrder - b.m_uiOrder;
    }

    /**获取今日进节日类型*/
    private getTodayJJRType(): number {
        let JJRPanelInfo = G.DataMgr.kfhdData.JJRPanelInfo;
        if (!JJRPanelInfo) {
            return 0
        }
        let today = G.SyncTime.getDateAfterStartServer();
        let curDay = (today - 1) % KeyWord.STAGEDAY_TYPE_MAX + 1;
        let typeDatas: GameConfig.StageDayCfgM[] = G.DataMgr.activityData.getJjrDayConfig(curDay);
        if (typeDatas == null || typeDatas.length == 0)
            return 0;

        return typeDatas[0].m_ucType;
    }

    /**
     * 当前界面是否显示进阶跳转的按钮
     * @param panelId
     */
    isShowJJRGotoBtn(panelId: number) {
        if (G.DataMgr.funcLimitData.isFuncAvailable(panelId)) return false;
        let panel2JJRType = ZhufuData.getJJRTypeByPanelKeyword(panelId);
        return panel2JJRType == this.getTodayJJRType();
    }

    ////////////////////////////////////// 聚宝盆 ///////////////////////////////////////////


    updateJBPStatusGot(cfgID: number): void {
        if (this.jbpStatusValue != null) {
            for (let status of this.jbpStatusValue.m_stData) {
                if (status.m_uiCfgID == cfgID) {
                    status.m_ucStatus = Macros.GOD_LOAD_AWARD_DONE_GET;
                    return;
                }
            }
        }
    }


    ////////////////////////////////////////////////武极，天下兑换/////////////////////////////////////

    /**设置极品大兑换配置表*/
    private setJPDDHConfig(): void {
        let configs: GameConfig.JPDDHActCfgM[] = G.Cfgmgr.getCfg('data/JPDDHActCfgM.json') as GameConfig.JPDDHActCfgM[];
        this._jpddhVec = new Array<GameConfig.JPDDHActCfgM>();
        this._txddhVec = new Array<GameConfig.JPDDHActCfgM>();
        for (let config of configs) {
            if (config.m_ucExchangeType == KeyWord.WJ_EXCHANGE) {
                this._jpddhVec.push(config);
            }
            else if (config.m_ucExchangeType == KeyWord.TX_EXCHANGE) {
                this._txddhVec.push(config);
            }
        }
    }



    /**武极大兑换配置表数组*/
    get jpddhVec(): GameConfig.JPDDHActCfgM[] {
        return this._jpddhVec;
    }

    /**武极兑换可领取数量*/
    jjrExchangeCanGetCount(): number {
        let canExchange: boolean = false;
        let count: number = 0;
        let today: number = G.SyncTime.getDateAfterStartServer();
        let openDay: number = Math.floor(G.DataMgr.constData.getValueById(KeyWord.PARAM_WJ_EXCHANGE_OPEN_DAY));
        if (today >= openDay) {
            for (let listItemVo of this.jpddhVec) {
                canExchange = true;
                let rewardVec: GameConfig.JPDDHItem[] = listItemVo.m_stCostItemList;
                for (let exchangeItemVo of rewardVec) {
                    if (exchangeItemVo.m_iID && exchangeItemVo.m_iCount) {
                        let num: number = G.DataMgr.thingData.getThingNumInsensitiveToBind(exchangeItemVo.m_iID);
                        if (num < exchangeItemVo.m_iCount) {
                            canExchange = false;
                            break;
                        }
                    }
                }
                if (canExchange) {
                    count++;
                }
            }
        }
        return count;
    }

    /**天下大兑换配置表数组*/
    get txddhVec(): GameConfig.JPDDHActCfgM[] {
        return this._txddhVec;
    }

    /**天下兑换可领取数量*/
    txExchangeCanGetCount(): number {
        let canExchange: boolean = false;
        let count: number = 0;
        let today: number = G.SyncTime.getDateAfterStartServer();
        let openDay: number = Math.floor(G.DataMgr.constData.getValueById(KeyWord.PARAM_TX_EXCHANGE_OPEN_DAY));
        if (today >= openDay) {
            for (let listItemVo of this.txddhVec) {
                canExchange = true;
                let rewardVec: GameConfig.JPDDHItem[] = listItemVo.m_stCostItemList;
                for (let exchangeItemVo of rewardVec) {
                    if (exchangeItemVo.m_iID && exchangeItemVo.m_iCount) {
                        let num: number = G.DataMgr.thingData.getThingNumInsensitiveToBind(exchangeItemVo.m_iID);
                        if (num < exchangeItemVo.m_iCount) {
                            canExchange = false;
                            break;
                        }
                    }
                }
                if (canExchange) {
                    count++;
                }
            }
        }
        return count;
    }

    ///////////////////////////////////////// CDKey活动 /////////////////////////////////////////

    /**
     * 设置CDKey礼包配置。
     * @param configs
     *
     */
    private setCDKeyGiftConfigs(): void {
        let configs: GameConfig.CDKeyGiftConfigM[] = G.Cfgmgr.getCfg('data/CDKeyGiftConfigM.json') as GameConfig.CDKeyGiftConfigM[];
        this.m_cdkeyGiftMap = {};
        for (let config of configs) {
            // 过滤掉无效的奖品
            for (let i: number = config.m_stThing.length - 1; i >= 0; i--) {
                if (0 == config.m_stThing[i].m_iThingID) {
                    config.m_stThing.splice(i, 1);
                }
            }
            this.m_cdkeyGiftMap[config.m_iGiftID] = config;
        }
    }

    getCDKeyGiftConfig(id: number): GameConfig.CDKeyGiftConfigM {
        return this.m_cdkeyGiftMap[id];
    }


    ////////////////////////////7天投资计划///////////////////////
    private setSevenDayFundConfigs(): void {
        let configs: GameConfig.SevenDayFundCfgM[] = G.Cfgmgr.getCfg('data/SevenDayFundCfgM.json') as GameConfig.SevenDayFundCfgM[];
        this.sevenDayFundConfig = {};
        this.sevenDayFundAllConfigs = {};
        for (let config of configs) {
            this.sevenDayFundConfig[config.m_ucFundID] = config;
            if (!this.sevenDayFundAllConfigs[config.m_ucFundType]) {
                this.sevenDayFundAllConfigs[config.m_ucFundType] = new Array<GameConfig.SevenDayFundCfgM>();
            }
            this.sevenDayFundAllConfigs[config.m_ucFundType].push(config);
        }

        for (let key in this.sevenDayFundAllConfigs) {
            let vec = this.sevenDayFundAllConfigs[key];
            vec.sort(this.sortTouZiType);
        }
    }

    getSevenDayFundAllConfigs(): { [type: number]: GameConfig.SevenDayFundCfgM[] } {
        return this.sevenDayFundAllConfigs;
    }

    getSevenDayFundConfig(id: number): GameConfig.SevenDayFundCfgM {
        return this.sevenDayFundConfig[id];
    }

    private sortTouZiType(a: GameConfig.SevenDayFundCfgM, b: GameConfig.SevenDayFundCfgM): number {
        return a.m_ucFundID - b.m_ucFundID;
    }


    /**
     * 7天投资的是否投资过
     * @param type
     */
    getSevenDayTZDataByType(type: number): Protocol.SevenDayFundOne {
        if (this.sevenDayFundData.m_ucNumber == 0) {
            return null;
        } else {
            for (let i = 0; i < this.sevenDayFundData.m_ucNumber; i++) {
                if (this.sevenDayFundData.m_stOneDataList[i].m_ucCfgType == type) {
                    return this.sevenDayFundData.m_stOneDataList[i];
                }
            }
        }
        return null;
    }


    sevenDayHaveTipMarkCanShow() {
        for (let i = 1; i <= ActivityData.sevenDayTypeCount; i++) {
            if (this.sevenDayOneTypeCanShowTip(i)) {
                return true;
            }
        }
        return false;
    }

    /**
    * 7天登陆中的一种类型是否可以显示红点
    * @param type
    */
    sevenDayOneTypeCanShowTip(keyword: number): boolean {
        let hasTZData = G.DataMgr.activityData.getSevenDayTZDataByType(keyword);
        if (hasTZData != null) {
            let sevenDayFundData = G.DataMgr.activityData.sevenDayFundData;
            let rewardConfig = G.DataMgr.activityData.getSevenDayFundAllConfigs()[keyword];
            for (let i = 0; i < ActivityData.sevenDayCanGetCount; i++) {
                //击杀boss数量>=限制条件
                if (keyword == KeyWord.SEVEN_DAY_FUND_TYPE_1) {
                    if (sevenDayFundData.m_iBossKillNum >= rewardConfig[i].m_iCondition && ((1 << (rewardConfig[i].m_ucFundID - 1) & hasTZData.m_uiGetFlag) == 0)) {
                        return true;
                    }
                } else {
                    if ((G.DataMgr.heroData.level >= rewardConfig[i].m_iCondition) &&
                        ((1 << (rewardConfig[i].m_ucFundID - 1) & hasTZData.m_uiGetFlag) == 0)
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }



    ///**
    // * 7天登陆中的一种类型是否可以显示红点
    // * @param type
    // */
    //sevenDayOneTypeCanShowTip(type: number): number {
    //    let configs = this.getSevenDayFundAllConfigs()[type];
    //    let count = 0;
    //    //投资过
    //    for (let i = 0; i < this.sevenDayFundData.m_ucNumber; i++) {
    //        let oneDataList = this.sevenDayFundData.m_stOneDataList[i];
    //        if (this.sevenDayFundData.m_stOneDataList[i].m_ucCfgType == type) {
    //            //等级投资，跟天数相关
    //            if (type == KeyWord.SEVEN_DAY_FUND_TYPE_1) {
    //                //购买后的第几天
    //                let afterBuyDay = G.SyncTime.getDateAfterSpecifiedTime(oneDataList.m_uiBuyTime * 1000);
    //                for (let i = 0; i < 7; i++) {
    //                    if (afterBuyDay == configs[i].m_iCondition && ((1 << (configs[i].m_ucFundID - 1) & oneDataList.m_uiGetFlag) == 0)) {
    //                        count++;
    //                    }
    //                }
    //            } else {
    //                //钻石，战力，跟等级相关
    //                for (let i = 0; i < 7; i++) {
    //                    if ((G.DataMgr.heroData.level >= configs[i].m_iCondition) &&
    //                        ((1 << (configs[i].m_ucFundID - 1) & oneDataList.m_uiGetFlag) == 0)
    //                    ) {
    //                        count++
    //                    }
    //                }
    //            }
    //        }
    //    }
    //    return count;

    //}

    /**
     * 获取已刷新的等级最低的世界BOSS
     */
    getWorldBossSugguestId(): number {
        let bossList = this.bossList;
        if (null != bossList) {
            let now = Math.round(G.SyncTime.getCurrentTime() / 1000);

            let cnt = bossList.m_iBossNum;
            let bossInfo: Protocol.CSBossOneInfo;
            let bossCfg: GameConfig.ZYCMCfgM;
            for (let i: number = 0; i < cnt; i++) {
                let bossInfo = bossList.m_astBossList[i];
                if (bossInfo.m_ucIsDead == 0 || bossInfo.m_uiFreshTime < now) {
                    return bossInfo.m_iBossID;
                }
            }
        }

        return 0;
    }


    /**
     * 获取指定活动开启的星期值。
     * @param activityID
     * @return
     *
     */
    getActivityDays(activityID: number): number[] {
        var activityConfig: GameConfig.ActivityConfigM = this.getActivityConfig(activityID);
        var timeLimitConfig: GameConfig.TimeLimitConfigM = this.m_timeLimitMap[activityConfig.m_iTimeLimitID];
        var days: string[] = timeLimitConfig.m_szOpenWeekDay.split(',');
        var result: number[] = [];

        for (let day of days) {
            result.push(this.getMappedDay(Number(day)));
        }
        result.sort(this._sortByDay);
        return result;
    }

    /**
		 * 根据表格配的星期几映射活动星期值。
		 * @param weekValue
		 * @return
		 *
		 */
    getMappedDay(weekValue: number): number {
        return weekValue % 7;// 把周日用0表示
    }

    private _sortByDay(a: number, b: number): number {
        if (0 == a || 0 == b) return b - a;
        return a - b;
    }


    /**
     * @description 根据活动ID获取当天开启时间
     * @private
     * @returns {number}
     */
    getTodayOpenTime(actID: number, day: number = -1): string {
        let weekDay = day > 0 ? day : G.SyncTime.tmpDate.getDay();
        let actHomeConfigs = G.DataMgr.activityData.getActHomeCfgList(weekDay);
        for (let temp of actHomeConfigs) {
            if (temp.m_iID == actID) return temp.m_szTime;
        }

        return '';
    }

    getTimeDurationType(actID: number, day: number = -1): EnumDurationType {
        let weekDay = day > 0 ? day : G.SyncTime.tmpDate.getDay();
        let actHomeConfigs = G.DataMgr.activityData.getActHomeCfgList(weekDay);
        let actHomeCfg: GameConfig.ActHomeConfigM;
        for (let temp of actHomeConfigs) {
            if (temp.m_iID == actID) {
                actHomeCfg = temp;
                break;
            }
        }

        let cfg = this.getActivityConfig(actID);
        let timeLimitConfig = this.getTimeLimitConfigByID(cfg.m_iTimeLimitID);

        let startTime = timeLimitConfig.m_aOpenTimeStamps[actHomeCfg.m_ucTimeId - 1];
        let endTime = timeLimitConfig.m_aCloseTimeStamps[actHomeCfg.m_ucTimeId - 1];

        let syncTime = G.SyncTime;
        return syncTime.getDurationType(startTime, endTime, syncTime.getCurrentTime());
    }


    ////////////////////////////////新的开服活动，元宝翻倍//////////////////

    /**元宝翻倍 充值额度*/
    m_uiChargeValue: number;

    /**元宝翻倍 可领取额度*/
    m_uiRewardValue: number;

    updateYuanBaoFanBeiData(chongzhiValu: number, hasGetCount: number) {
        this.m_uiChargeValue = chongzhiValu;
        this.m_uiRewardValue = hasGetCount;
    }

    get getYuanBaoFanBeiChargeValue() {
        return this.m_uiChargeValue;
    }
    get getYuanBaoFanBeiRewardValue() {
        return this.m_uiRewardValue;
    }


    /////////////////////boss之家////////////////////////

    private isHasInitBossHomeDataFinsh: boolean = false;
    getHasBossRefreshByFloor(floor: number): boolean {
        this.setBossHomeDataInit();
        let vipLv = G.DataMgr.heroData.curVipLevel;
        if (vipLv < 2 || !G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_HOME_BOSS_ACT)) {
            return false;
        }
        let hasBossRefresh = this.checkHasBossLiveAndLowerHeroLv(this.bossHomeListData[floor]);
        if (floor == 1) {
            return vipLv >= 2 && hasBossRefresh;
        }
        else if (floor == 2) {
            return vipLv >= 4 && hasBossRefresh;
        }
        else if (floor == 3) {
            return vipLv >= 6 && hasBossRefresh;
        }
        else if (floor == 4) {
            return vipLv >= 8 && hasBossRefresh;
        }
        else if (floor == 5) {
            return vipLv >= 9 && hasBossRefresh;
        }
        return false;
    }


    private checkHasBossLiveAndLowerHeroLv(datas: BossHomeData[]): boolean {
        if (datas == null || datas == undefined) return false;
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            let heroLv = G.DataMgr.heroData.level;
            if (!data.isDead && data.refreshTime == 0 && ((Math.abs(data.bossLv - heroLv) <= 10) || heroLv > data.bossLv)) {
                return true;
            }
        }
        return false;
    }

    /**boss之家列表*/
    bossHomeData: Protocol.SmallBossOneInfo[] = [];
    bossHomeTicketTime: number[] = [];
    bossHomeBugTicketNumber: number = 0;
    bossHomeListData: { [ceng: number]: BossHomeData[] } = {};
    setBossHomeDataInit(forceRefresh: boolean = false) {
        if (null == this.bossHomeData || (this.isHasInitBossHomeDataFinsh && !forceRefresh))
            return;
        let listData = this.bossHomeData;
        this.bossHomeListData = [];
        for (let i = 0; i < listData.length; i++) {
            let data = listData[i];
            let bossConfig = MonsterData.getBossConfigById(data.m_iBossID);
            let monsterConfig = MonsterData.getMonsterConfig(data.m_iBossID);
            if (bossConfig != null && monsterConfig != null) {
                let itemData = new BossHomeData();
                //怪物表
                itemData.headIconId = monsterConfig.m_iHeadID;
                itemData.bossName = monsterConfig.m_szMonsterName;
                itemData.modelId = monsterConfig.m_szModelID;
                itemData.bossLv = monsterConfig.m_usLevel;
                itemData.modelFloder = monsterConfig.m_ucModelFolder;
                itemData.fight = monsterConfig.m_iFightPoint;
                //后台
                itemData.isDead = data.m_ucIsDead != 1;
                itemData.refreshTime = data.m_uiFreshTime;
                itemData.bossId = data.m_iBossID;
                //斩妖除魔
                itemData.rewardsId = bossConfig.m_iItemID;
                itemData.floor = bossConfig.m_iFloor;
                itemData.lowestVipLv = bossConfig.m_iLevel;
                itemData.dropThingId = bossConfig.m_iDropID;
                itemData.isOpen = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_HOME_BOSS_ACT);
                if (this.bossHomeListData[bossConfig.m_iFloor] == null) {
                    this.bossHomeListData[bossConfig.m_iFloor] = [];
                }
                this.bossHomeListData[bossConfig.m_iFloor].push(itemData);
            } else {
                uts.log("没有该boss的配置,id为:= " + data.m_iBossID);
            }
        }
        this.isHasInitBossHomeDataFinsh = true;
    }


    //////////////////////////////全民嗨起/////////////////////////////////

    allPeopleHiCfgs: GameConfig.AllPeopleHiConfigM[];
    private allPeopleHiId2CfgMap: { [id: number]: GameConfig.AllPeopleHiConfigM };
    private setAllPeopleHiCfg(): void {
        this.allPeopleHiCfgs = G.Cfgmgr.getCfg('data/AllPeopleHiConfigM.json') as GameConfig.AllPeopleHiConfigM[];
        this.allPeopleHiId2CfgMap = {};
        for (let cfg of this.allPeopleHiCfgs) {
            this.allPeopleHiId2CfgMap[cfg.m_iID] = cfg;
        }
    }

    getAllPeopleHiCfg(id: number) {
        return this.allPeopleHiId2CfgMap[id];
    }


    hiPointRewardCfgs: GameConfig.HiPointConfigConfigM[];
    private hiPointRewardId2CfgMap: { [id: number]: GameConfig.HiPointConfigConfigM };
    private setHiPointRewardCfg(): void {
        this.hiPointRewardCfgs = G.Cfgmgr.getCfg('data/HiPointConfigConfigM.json') as GameConfig.HiPointConfigConfigM[];
        this.hiPointRewardId2CfgMap = {};
        for (let cfg of this.hiPointRewardCfgs) {
            this.hiPointRewardId2CfgMap[cfg.m_iID] = cfg;
        }
    }

    getHiPointRewardCfg(id: number) {
        return this.hiPointRewardId2CfgMap[id];
    }

    /**全民嗨点*/
    qMHDActPanelInfo: Protocol.QMHDActPanelRsp;
    updateQMHDActPanelRsp(info: Protocol.QMHDActPanelRsp) {
        this.qMHDActPanelInfo = info;
    }

    udateQMHDActRewardBitFlag(bitFlay: number) {
        this.qMHDActPanelInfo.m_uiBitFlag = bitFlay;
    }

    getQMHDCount(id: number) {
        if (this.qMHDActPanelInfo) {
            for (let i = 0; i < this.qMHDActPanelInfo.m_ucCount; i++) {
                if (this.qMHDActPanelInfo.m_stActiveHDList[i].m_uiActiveID == id) {
                    return this.qMHDActPanelInfo.m_stActiveHDList[i].m_uiTimes;
                }
            }
        }
        return 0;
    }


    //////////////////////////////火热世界杯/////////////////////////////////

    countryIndexId2CfgMap: { [id: number]: GameConfig.WorldCupIndexCfgM } = {};
    scoreIndexId2CfgMap: { [id: number]: GameConfig.WorldCupIndexCfgM } = {};
    private setWorldCupIndexCfg() {
        let configs: GameConfig.WorldCupIndexCfgM[] = G.Cfgmgr.getCfg('data/WorldCupIndexCfgM.json') as GameConfig.WorldCupIndexCfgM[];
        for (let cfg of configs) {
            //国家
            if (cfg.m_iType == 1) {
                this.countryIndexId2CfgMap[cfg.m_iID] = cfg;
            }
            //比分
            else if (cfg.m_iType == 2) {
                this.scoreIndexId2CfgMap[cfg.m_iID] = cfg;
            }
        }
    }

    /**世界杯冠军之路比赛配置字典 */
    worldCupChampionId2CfgMap: { [id: number]: Protocol.WorldCupChampionConfig_Server };
    setWorldCupChampionCfgMap() {
        this.worldCupChampionId2CfgMap = {};
        for (let i = 0; i < this.worldCupChampionPanelData.m_ucItemCount; i++) {
            let configData = this.worldCupChampionPanelData.m_stGetCfgList[i];
            this.worldCupChampionId2CfgMap[configData.m_iID] = configData;
        }
    }
    //////////////////充值折扣///////////////////////////
    /**每1W领取2000*/
    static readonly MINGETVALUE = 2000;

    chongzhiValue: number = 0;
    hasGetCount: number = 0;
    updateChongZhiZheKouData(chongzhiValu: number, hasGetCount: number) {
        this.chongzhiValue = chongzhiValu;
        this.hasGetCount = hasGetCount;
    }

    get getChongZhiZheKouValue() {
        return this.chongzhiValue;
    }
    get getChongZhiZheKouCount() {
        return this.hasGetCount;
    }

    isCZZKCanGetRewardCount() {
        let leftValue = this.chongzhiValue - this.hasGetCount * ActivityData.MINGETVALUE;
        return Math.floor(leftValue / ActivityData.MINGETVALUE);
    }
}