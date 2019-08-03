import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { AchievementData } from 'System/data/AchievementData'
import { SevenDayView } from 'System/activity/fldt/sevenDayLogin/SevenDayView'
import { MathUtil } from "System/utils/MathUtil"

export class KaifuActivityData {
    /***连冲返利类型3个*/
    private readonly lcflTypeCount: number = 3;
    /**7天一循环*/
    static readonly WeekDayCount = 7;
    /**连充返利最大4周，之后算0周循环*/
    static readonly MaxWeekLianChongFanLi = 4;

    /**全民冲榜*/
    private m_quanminRankDict: { [key: number]: GameConfig.KFQMCBCfgM };

    private m_qmTypeToDay: { [key: number]: number };

    /**每日目标配置*/
    private m_dailyGoalDict: { [key: number]: GameConfig.KFMRMBCfgM[] };

    /**每日目标*/
    private m_dailyGoalInfo: Protocol.CSKFMRMBGetInfo[] = [];

    /**全民冲榜*/
    private m_quanminRankInfo: { [key: number]: boolean };

    /**套装*/
    private m_suitRewardsCfgs: GameConfig.KFJBTZCfgM[];

    private m_XfhdCount: number = 0;
    private m_XFPHBCount: number = 0;

    /**开服冲榜数据*/
    kaifuChongBangInfo: { [type: number]: Protocol.KFQMCBGetInfo_Response } = {};

    /**红包有礼*/
    hongBaoYouLiInfo: Protocol.CSKaiFuXFFLInfo;

    /**开服7天累充*/
    kf7DayLJCZInfo: Protocol.CS7DayLJCZInfo;
    /***开服连冲返利*/
    kfLCFLInfo: Protocol.CSKFLCFLInfo;

    /**消费返利*/
    xfflInfo: Protocol.KaiFuXFLBInfo;

    /**单笔充值*/
    danBiCzInfo: Protocol.CSAct124Info;

    /**循环充值*/
    xunHuanCzInfo: Protocol.CSAct125Info;

    /**直购礼包*/
    meiRiLiBaoInfo: Protocol.ZGLBOpenRsp;

    constructor() {
        this.m_quanminRankInfo = {};
    }

    setSuitRewards(data: GameConfig.KFJBTZCfgM[]): void {
        this.m_suitRewardsCfgs = data;
    }

    getSuitRewardsCfg(): GameConfig.KFJBTZCfgM[] {
        return this.m_suitRewardsCfgs;
    }

    onCfgReady() {
        this.setQuanMinRankCfg();
        this.setDailyGoalCfg();
        this.setkfxfflConfig();
        this.setkfChargeRebateConfig();
        // this.setkfCZKHVIPGetConfig();
    }

    private kfType: number[] = [];
    private setQuanMinRankCfg(): void {
        let data: GameConfig.KFQMCBCfgM[] = G.Cfgmgr.getCfg('data/KFQMCBCfgM.json') as GameConfig.KFQMCBCfgM[];
        this.m_quanminRankDict = {};
        this.m_qmTypeToDay = {};
        let list: GameConfig.KFQMCBCfgM[];
        for (let i: number = 0; i < data.length; i++) {
            this.m_quanminRankDict[data[i].m_iID] = data[i];
            this.m_qmTypeToDay[data[i].m_ucRankType] = data[i].m_ucDay;
            if (data[i].m_ucType == KeyWord.KFQMCB_TYPE_PAIHANG1) {
                this.kfType.push(data[i].m_ucRankType);
            }
        }
    }

    /**
     *得到开服冲榜排行类型
     */
    getKaifuChongbangType() {
        return this.kfType;
    }

    onGetKFCBInfoResponse(response: Protocol.KFQMCBGetInfo_Response) {
        this.kaifuChongBangInfo[response.m_ucRankType] = response;
        let view = G.Uimgr.getForm<SevenDayView>(SevenDayView);
        if (view != null) {
            view.updateAllTipMarks();
        }
    }

    onGetKFCBRewardResponse(response: Protocol.KFQMCBGetReward_Response) {
        for (let type in this.kaifuChongBangInfo) {
            let data = this.kaifuChongBangInfo[type].m_stRewardInfo;
            let isFound = false;
            for (let oneInfo of data) {
                if (oneInfo.m_iID == response.m_iID) {
                    oneInfo.m_ucState = 2;
                    isFound = true;
                    break;
                }
            }
            if (isFound) {
                break;
            }
        }
    }


    canGetKaiFuChongBang(type: number): boolean {
        let kaifuchongbang = this.getKaifuChongbangData();
        let kfcbInfo = kaifuchongbang[type];
        if (null != kfcbInfo) {
            for (let i = 0; i < 3; i++) {
                if (kfcbInfo.m_stRewardInfo[i].m_ucState == Macros.KF_ACT_STATUS_ARIVE) {
                    return true;
                }
            }
        }

        return false;
    }

    getKaifuChongbangData(): { [type: number]: Protocol.KFQMCBGetInfo_Response } {
        return this.kaifuChongBangInfo;
    }


    /**
     * 全民冲榜当前的配置 
     * @param day
     * @return 
     * 
     */
    getQuanMinRankCfgsByID(id: number): GameConfig.KFQMCBCfgM {
        return this.m_quanminRankDict[id];
    }

    getQmRankDayByType(type: number): number {
        if (type == KeyWord.RANK_TYPE_LEVEL) {
            return 1;
        }
        else {
            return this.m_qmTypeToDay[type];
        }
    }

    getJJRDayByType(type: number): number {
        if (type == KeyWord.RANK_TYPE_LEVEL) {
            return 1;
        }
        else {
            return this.m_qmTypeToDay[type];
        }
    }

    setDailyGoalCfg(): void {
        let data: GameConfig.KFMRMBCfgM[] = G.Cfgmgr.getCfg('data/KFMRMBCfgM.json') as GameConfig.KFMRMBCfgM[];
        this.m_dailyGoalDict = {};
        let list: GameConfig.KFMRMBCfgM[];
        for (let i: number = 0; i < data.length; i++) {
            list = this.m_dailyGoalDict[data[i].m_ucDay];

            if (list == null) {
                this.m_dailyGoalDict[data[i].m_ucDay] = list = new Array<GameConfig.KFMRMBCfgM>();
            }
            list.push(data[i]);
        }
    }

    getDailyGoalCfgsByDay(day: number): GameConfig.KFMRMBCfgM[] {
        if (day > Macros.MAX_KFSCTG_OPEN_DAYS) {
            day = Macros.MAX_KFSCTG_OPEN_DAYS;
        }
        return this.m_dailyGoalDict[day];
    }


    canGetReward(day: number): boolean {
        if (this.m_dailyGoalInfo != null) {
            for (let info of this.m_dailyGoalInfo) {
                if (info.m_ucDay == day && info.m_ucDay <= G.SyncTime.getDateAfterStartServer()) {
                    for (let states of info.m_stStatusList) {
                        if (states.m_ucStatus == Macros.KF_ACT_STATUS_ARIVE) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    /**
     * 每日目标
     * @param data
     * 
     */
    updateDailyGoalInfo(data: Protocol.CSKFMRMBGetInfo[]): void {
        this.m_dailyGoalInfo = data;
    }

    /**
     * 每日目标
     * @param data
     * 
     */
    updateDailyGoalGet(data: Protocol.CSKFMRMBOneStatus): void {
        if (this.m_dailyGoalInfo != null) {
            for (let info of this.m_dailyGoalInfo) {
                for (let states of info.m_stStatusList) {
                    if (states.m_uiID == data.m_uiID) {
                        states.m_ucStatus = data.m_ucStatus;
                    }
                }
            }
        }
    }

    /**
     * 得到每日目标奖励状态
     * @param id
     */
    getDailyGoalStatus(id: number): Protocol.CSKFMRMBOneStatus {
        if (this.m_dailyGoalInfo != null) {

            for (let info of this.m_dailyGoalInfo) {
                for (let states of info.m_stStatusList) {
                    if (states.m_uiID == id) {
                        return states;
                    }
                }
            }
        }
        return null;
    }


    updateQuanminRankInfo(rank: number, isActive: boolean): void {
        this.m_quanminRankInfo[rank] = isActive;
    }

    getQuanminRankStatus(rank: number): boolean {
        return this.m_quanminRankInfo[rank];
    }

    isQqcmActive(): boolean {
        for (let key in this.m_quanminRankInfo) {
            if (this.m_quanminRankInfo[key]) {
                return true;
            }
        }
        return false;
    }


    /**获取消费送好礼可领取数量*/
    getXfhdCount(): number {
        let m_sDailyConsumePanel: Protocol.DailyConsumeRsp = G.DataMgr.activityData.m_sDailyConsumePanel;
        if (!m_sDailyConsumePanel) {
            return 0;
        }
        let tempCount: number = 0
        let config: GameConfig.DailyConsumeActCfgM[] = G.DataMgr.activityData.getDailyConsumeConfigArr(G.DataMgr.activityData.m_sDailyConsumePanel.m_ucDay);
        for (let j of config) {
            if (j.m_iCondition1 <= G.DataMgr.activityData.m_sDailyConsumePanel.m_ulConsume &&
                !G.DataMgr.activityData.getDailyConsumeIsGet(j.m_iID)) {
                tempCount++
            }
        }
        return tempCount;
    }


    /**获取消费排行榜可领取数量*/
    getXFPHBCount(): number {
        let count: number = 0;
        let m_stConsumeRankPanel: Protocol.ConsumeRankInfoRsp = G.DataMgr.activityData.m_stConsumeRankPanel;
        if (m_stConsumeRankPanel) {
            if (!m_stConsumeRankPanel.m_ucFlag && m_stConsumeRankPanel.m_uiMyConsume > 0) {
                count++;
            }
        }
        return count;
    }

    ///////////////////////////////// 红包有礼 /////////////////////////////////

    updateHongBaoYouLi(info: Protocol.CSKaiFuXFFLInfo) {
        this.hongBaoYouLiInfo = info;
    }

    /**领取红包的天数*/
    private readonly getHongBaoDay = 7;
    hasHongBaoYouLiToGet(): boolean {
        if (G.SyncTime.getDateAfterStartServer() > this.getHongBaoDay) {
            if (null != this.hongBaoYouLiInfo && this.hongBaoYouLiInfo.m_ucNumber > 0) {
                let getBit = this.hongBaoYouLiInfo.m_ucGet;
                for (let i = 0; i < this.hongBaoYouLiInfo.m_ucNumber; i++) {
                    let c = this.hongBaoYouLiInfo.m_aiConsume[i];
                    if (c > 0 && 0 == (getBit & (1 << i))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }


    //开服7天累计充值
    updatekf7DayLC(info: Protocol.CS7DayLJCZInfo) {
        this.kf7DayLJCZInfo = info;

    }

    /**
     * 开服7天有奖励可以领取
     */
    getCanGetRewardIndex(): number {
        if (this.kf7DayLJCZInfo != null) {
            for (let i = 0; i < this.kf7DayLJCZInfo.m_ucNumber; i++) {
                if (!MathUtil.checkPosIsReach(i, this.kf7DayLJCZInfo.m_uiGetBitMap) && this.kf7DayLJCZInfo.m_uiLJZCValue >= this.kf7DayLJCZInfo.m_stList[i].m_iCondition) {
                    return i;
                }
            }
        }
        return -1;
    }

    /**是否有奖励可以领取 */
    getCanReward(): boolean {
        if (this.hongBaoYouLiInfo == null) return false;
        let cnt = this.hongBaoYouLiInfo.m_ucNumber;
        let info = this.hongBaoYouLiInfo;
        //0000 0000    0111 1111
        if (cnt > 0) {
            for (let i = 0; i < cnt; i++) {
                if (info.m_aiConsume[i] > 0) {
                    if ((info.m_ucGet & (1 << i)) == 0) {
                        //未领取
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
    * 开服7天奖励索引
    * 可领取 返回
    * 不可领取，最近一个消费
    */
    getRewardIndex(): number {
        if (this.kf7DayLJCZInfo != null) {
            let canGetIndex = -1;
            let hasGetIndex = -1;
            for (let i = 0; i < this.kf7DayLJCZInfo.m_ucNumber; i++) {
                if (this.kf7DayLJCZInfo.m_uiLJZCValue >= this.kf7DayLJCZInfo.m_stList[i].m_iCondition) {
                    hasGetIndex = i;
                    if (!MathUtil.checkPosIsReach(i, this.kf7DayLJCZInfo.m_uiGetBitMap)) {
                        //有可领取
                        canGetIndex = i;
                        break;
                    }
                }
            }
            //没有
            if (canGetIndex < 0) {
                canGetIndex = hasGetIndex + 1 >= this.kf7DayLJCZInfo.m_ucNumber ? this.kf7DayLJCZInfo.m_ucNumber - 1 : hasGetIndex + 1;
            }
            return canGetIndex;
        } else {
            return 0;
        }

    }


    //////////////////////////开服连充/////////////////////////////////////

    /**
     * 开服连冲返利
     * @param info
     */
    updatekfLCFL(info: Protocol.CSKFLCFLInfo) {
        this.kfLCFLInfo = info;
        this.setConfig();
    }

    //  private kflcConfig: { [type: number]: Protocol.KFLCFLCfg_Server[] } = {};


    private newKflcConfigs: { [week: number]: { [type: number]: Protocol.KFLCFLCfg_Server[] } } = {};
    private setConfig() {
        if (this.kfLCFLInfo != null) {
            //   this.kflcConfig = {};
            this.newKflcConfigs = {};
            for (let config of this.kfLCFLInfo.m_stCfgList) {
                //if (this.kflcConfig[config.m_iType] == null) {
                //    this.kflcConfig[config.m_iType] = [];
                //}
                //this.kflcConfig[config.m_iType].push(config);

                if (this.newKflcConfigs[config.m_iWeek] == null) {
                    this.newKflcConfigs[config.m_iWeek] = {};
                }

                if (this.newKflcConfigs[config.m_iWeek][config.m_iType] == null) {
                    this.newKflcConfigs[config.m_iWeek][config.m_iType] = [];
                }
                this.newKflcConfigs[config.m_iWeek][config.m_iType].push(config);
            }
        }
    }

    getConfigByType(week: number, type: number) {
        if (this.newKflcConfigs[week]) {
            return this.newKflcConfigs[week][type];
        }
        return null;

    }

    /**
     * 得到开始结束时间
     * @param type
     */
    getStartAndEndTime(week: number, type: number): number[] {
        let startEnd: number[] = [];
        let config = this.getConfigByType(week, type);
        if (config != null) {
            startEnd.push(config[0].m_iStartTime);
            startEnd.push(config[0].m_iEndTime);
            return startEnd;
        }
        return [0, 0];

    }


    /**
     * 得到开始到结束的时间间隔
     * @param type
     */
    getStartToEndDayCount(week: number, type: number): number {
        let config = this.getConfigByType(week, type);
        if (config != null) {
            let startTime = config[0].m_iStartTime;
            let endTime = config[0].m_iEndTime;
            return (endTime - startTime + 1);
        }
        return 0
    }

    /**
     * 得到开始到结束充值金额数组
     * @param type
     */
    getStartToEndCZValue(week: number, type: number): number[] {
        let czValue: number[] = [];
        let config = this.getConfigByType(week, type);
        if (config != null) {
            let startTime = config[0].m_iStartTime;
            let endTime = config[0].m_iEndTime;
            let len = endTime - startTime + 1;
            for (let i = 0; i < len; i++) {
                czValue.push(this.kfLCFLInfo.m_aiCZValue[startTime + i - 1]);
            }
            return czValue;
        }
        return [0];

    }

    /**
     * 得到开始到结束，满足条件的数量
     * @param type
     */
    getStartToEndCZCount(week: number, type: number): number {
        let count = 0;
        let data = this.getStartToEndCZValue(week, type);
        let config = this.getConfigByType(week, type);
        if (config != null) {
            for (let i = 0; i < data.length; i++) {
                if (data[i] >= config[0].m_iCondition1) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
   * 判断今天是否充值过足够金额
   * @param today
   */
    getTodayHasPay(today: number): number {
        return this.kfLCFLInfo.m_aiCZValue[today - 1];
    }

    /**
     * 也签内是否显示红点
     * @param type
     */
    canShowTipMarkByType(week: number, type: number) {
        let configs = this.getConfigByType(week, type);
        if (configs != null) {
            let canGetCount = this.getStartToEndCZCount(week, type);
            let bitMap = this.kfLCFLInfo.m_aiRewardBit[type - 1];
            for (let i = 0; i < configs.length; i++) {
                let isGet: boolean = MathUtil.checkPosIsReach(configs[i].m_iID - 1, bitMap);
                if (!isGet && canGetCount >= configs[i].m_iCondition2) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     *开服活动图标是否显示红点
     */
    isShowLcflTipMark() {
        let week = this.kfLCFLInfo.m_iWeek;
        for (let i = 1; i <= this.lcflTypeCount; i++) {
            if (this.canShowTipMarkByType(week, i)) {
                return true;
            }
        }
        return false;
    }



    /////////////////////////////消费返利//////////////////////////////////


    private kfxfflConfig: { [type: number]: { [day: number]: GameConfig.KFXFLBCfgM[] } } = {};
    private setkfxfflConfig() {
        let data: GameConfig.KFXFLBCfgM[] = G.Cfgmgr.getCfg('data/KFXFLBCfgM.json') as GameConfig.KFXFLBCfgM[];
        for (let cfg of data) {
            if (this.kfxfflConfig[cfg.m_ucGiftType] == null) {
                this.kfxfflConfig[cfg.m_ucGiftType] = {};
            }
            if (this.kfxfflConfig[cfg.m_ucGiftType][cfg.m_ucDay] == null) {
                this.kfxfflConfig[cfg.m_ucGiftType][cfg.m_ucDay] = [];
            }
            this.kfxfflConfig[cfg.m_ucGiftType][cfg.m_ucDay].push(cfg);
        }

    }

    getkfxfflConfigByType(type: number, day: number) {
        return this.kfxfflConfig[type][day];
    }


    /**
     * 开服消费返利
     * @param info
     */
    updateKFXFFLInfo(info: Protocol.KaiFuXFLBInfo) {
        this.xfflInfo = info;
    }

    /**循环分割时间7*/
    private readonly actMacDay = 7;

    getCurXFFConfigs(): GameConfig.KFXFLBCfgM[] {
        let openServerDay: number = G.SyncTime.getDateAfterStartServer();
        let type = KeyWord.FLDT_TYPE_KFXFFL;
        let day = openServerDay;
        if (openServerDay > 14) {
            type = KeyWord.FLDT_TYPE_LOOPXFFL;
            day = openServerDay % this.actMacDay;
            if (day == 0) {
                day = 7;
            }
        }
        return G.DataMgr.kaifuActData.getkfxfflConfigByType(type, day);
    }

    /**
     * 是否显示消费返利红点
     */
    isShowXFFLTipMark() {
        if (this.xfflInfo) {
            let configs = this.getCurXFFConfigs();
            for (let cfg of configs) {
                if (this.xfflInfo.m_iConsume >= cfg.m_uiRechargeLimit && !MathUtil.checkPosIsReach(cfg.m_ucLevel, this.xfflInfo.m_ucGet)) {
                    return true;
                }
            }
        }
        return false;
    }

    ///////////////////////////充值狂欢-折扣//////////////////////////CZKHVIPGetConfig

    private kfChargeRebateConfigs: GameConfig.CZKHRebateConfigM[];
    private kfChargeRebateMapCfgs: { [charge: number]: GameConfig.CZKHRebateConfigM[] }
    kfChargeCountArr: number[] = [];
    private setkfChargeRebateConfig() {
        this.kfChargeRebateConfigs = G.Cfgmgr.getCfg('data/CZKHRebateConfigM.json') as GameConfig.CZKHRebateConfigM[];
        this.kfChargeRebateMapCfgs = {};

        for (let cfg of this.kfChargeRebateConfigs) {
            if (this.kfChargeRebateMapCfgs[cfg.m_iChargeCount] == null) {
                this.kfChargeRebateMapCfgs[cfg.m_iChargeCount] = [];
                this.kfChargeCountArr.push(cfg.m_iChargeCount);
            }
            this.kfChargeRebateMapCfgs[cfg.m_iChargeCount].push(cfg);
        }
    }

    getkfChargeRebateConfig(chargeCount: number): GameConfig.CZKHRebateConfigM[] {
        return this.kfChargeRebateMapCfgs[chargeCount];
    }



    /////////////////////////////充值狂欢-VIP专属//////////////////////////
    ///**vip专属奖励位*/
    //vipzsRewardFlag: number = 0;
    //kfCZKHVIPGetConfigs: GameConfig.CZKHVIPGetConfigM[];
    //private kfCZKHVIPGetMapTypeCfgs: { [type: number]: GameConfig.CZKHVIPGetConfigM[] }
    //private kfCZKHVIPGetMapIDCfgs: { [id: number]: GameConfig.CZKHVIPGetConfigM }

    //private setkfCZKHVIPGetConfig() {
    //    this.kfCZKHVIPGetConfigs = G.Cfgmgr.getCfg('data/CZKHVIPGetConfigM.json') as GameConfig.CZKHVIPGetConfigM[];

    //    uts.log(this.kfCZKHVIPGetConfigs);
    //    this.kfCZKHVIPGetMapTypeCfgs = {};
    //    this.kfCZKHVIPGetMapIDCfgs = {};
    //    for (let cfg of this.kfCZKHVIPGetConfigs) {
    //        if (this.kfCZKHVIPGetMapTypeCfgs[cfg.m_VIPType] == null) {
    //            this.kfCZKHVIPGetMapTypeCfgs[cfg.m_VIPType] = [];
    //        }
    //        this.kfCZKHVIPGetMapTypeCfgs[cfg.m_VIPType].push(cfg);
    //        this.kfCZKHVIPGetMapIDCfgs[cfg.m_iID] = cfg;
    //    }
    //}

    //getkfCZKHVIPGetConfigByType(type: number): GameConfig.CZKHVIPGetConfigM[] {
    //    return this.kfCZKHVIPGetMapTypeCfgs[type];
    //}

    //getkfCZKHVIPGetConfigByID(id: number): GameConfig.CZKHVIPGetConfigM {
    //    return this.kfCZKHVIPGetMapIDCfgs[id];
    //}


    //vipZhuanShuCanGetReward() {
    //    let isShow = false;
    //    let flag = G.DataMgr.kaifuActData.vipzsRewardFlag;
    //    let state = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3);
    //    let zsVIPCfg = this.getkfCZKHVIPGetConfigByType(KeyWord.KFACTIVITY_GET_SUPERVIP)[0];
    //    if (state >= 0 && ((1 << (zsVIPCfg.m_iID - 1) & flag) == 0)) {
    //        isShow = true;
    //    }
    //    if (isShow)
    //        return true;
    //    let configs = this.getkfCZKHVIPGetConfigByType(KeyWord.KFACTIVITY_GET_VIP);
    //    let vipLv = G.DataMgr.heroData.curVipLevel;
    //    for (let i = 0; i < configs.length; i++) {
    //        if (vipLv >= configs[i].m_ilevel && (1 << (configs[i].m_iID - 1) & flag) == 0) {
    //            return true;
    //        }
    //    }
    //    return false;
    //}


}
