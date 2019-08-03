import { Global as G } from 'System/global'
import { EnumStoreID, EnumKfhdBossType, EnumKfhdBossStatus, UnitCtrlType } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { KfhdBossVo } from 'System/data/vo/KfhdBossVo'
import { KfhdCollectData, EnumKfhdCollectState } from 'System/data/vo/KfhdCollectData'
import { SyncTime } from 'System/net/SyncTime'
import { JjrRewardsItemData } from 'System/data/JjrRewardsItemData'
import { DataFormatter } from 'System/utils/DataFormatter'
import { MarketItemData } from "./vo/MarketItemData";

/**
 * 开服活动
 * @author jesse
 *
 */
export class KfhdData {

    /**是否点击过特惠礼包面板*/
    isHasClickTeHuiLiBaoGroup: boolean = false;


    static readonly BaoDianBigTypes: number[] = [KeyWord.BAODIAN_MAIN_PBQY, KeyWord.BAODIAN_MAIN_LHCQ, KeyWord.BAODIAN_MAIN_CFZJ];
    static readonly THLB_OPEN_DAY = 7;

    /**特惠礼包id*/
    private thlbGiftIdMap: { [day: number]: MarketItemData[] } = {};

    /** 集字送好礼 */
    collectWordDatas: KfhdCollectData[] = [];
    private collectWordIdMap: { [id: number]: KfhdCollectData } = {};

    /** boss类型配置表集合 */
    private bossTypeMap: { [type: number]: KfhdBossVo[] } = {};
    /** boss 数据 */
    private bossIdMap: { [id: number]: KfhdBossVo } = {};

    /**开服首充团购配置*/
    private groupBuyCfgMap: { [condition1: number]: { [condition2: number]: GameConfig.KFSCTGCfgM[] } } = {};
    /**开服首充团购条件2表*/
    private getGroupBuyConditionMap: { [condition1: number]: number[] } = {};
    /**开服首充团购数据*/
    private m_groupBuyInfo: Protocol.KFSCTGData;

    ///** 开服至尊争夺 */
    //kfzzzd: Protocol.ZZZDOpenPanelRsp;
    /**进阶日面板数据*/
    JJRPanelInfo: Protocol.StageDayInfo;
    /**进阶日奖励数据*/
    JJRRewardInfo: Protocol.StageDayInfo;
    _JjrRewardsItems: JjrRewardsItemData[];

    m_jinJieRiConfig: { [id: number]: GameConfig.StageDayCfgM };
    private m_todayRewardList: GameConfig.StageDayCfgM[];

    jinJieRankInfo: Protocol.StageDayRankPannel;

    private jinJieType2CtrlType: { [jinJieType: number]: UnitCtrlType } = {};

    /**宝典*/
    private baoDianCfgTypeMap: { [type: number]: GameConfig.BaoDianCfgM[] } = {};
    private baoDianCfgIdMap: { [type: number]: GameConfig.BaoDianCfgM } = {};
    private baoDianStatusMap: { [id: number]: number } = {};
    private baoDianFinishMap: { [type: number]: number } = {};
    private baoDianAllConfig: GameConfig.BaoDianCfgM[] = [];

    constructor() {
        this.jinJieType2CtrlType[KeyWord.STAGEDAY_BEAUTY] = UnitCtrlType.pet;
        this.jinJieType2CtrlType[KeyWord.STAGEDAY_LINGYU] = UnitCtrlType.zhenfa;
        this.jinJieType2CtrlType[KeyWord.STAGEDAY_FAQI] = UnitCtrlType.faqi;
        this.jinJieType2CtrlType[KeyWord.STAGEDAY_SQ] = UnitCtrlType.shengqi; 
    }

    onCfgReady(): void {
        this.setCollectWordActCfgs();
        this.setBossCfgs();
        this.setGroupBuyConfigs();
        this.setJjrConfig();
        this.setBaoDianConfigs();
    }

    /////////////////////////////////////////////// 特惠礼包 ///////////////////////////////////////////////

    initTeHuiLiBao() {
        let storeIDs = [EnumStoreID.TEHUILIBAO_DAY_1, EnumStoreID.TEHUILIBAO_DAY_2, EnumStoreID.TEHUILIBAO_DAY_3, EnumStoreID.TEHUILIBAO_DAY_4,
        EnumStoreID.TEHUILIBAO_DAY_5, EnumStoreID.TEHUILIBAO_DAY_6, EnumStoreID.TEHUILIBAO_DAY_7];

        for (let i = storeIDs.length - 1; i >= 0; i--) {
            this.thlbGiftIdMap[i + 1] = G.DataMgr.npcSellData.getMallListByType(storeIDs[i]);
        }
    }


    getTeHuiLiBaoSelectedId(): number {
        let thlbMarketData = this.getTeHuiLiBaoMarketData();
        if (thlbMarketData != null) {
            for (let marketItem of thlbMarketData) {
                if (marketItem.sellLimitData.getRestCount() > 0) {
                    return marketItem.sellConfig.m_iItemID;
                }
            }
        }
        return 0;
    }


    teHuiLiBaoTipMark(): boolean {
        if (this.isHasClickTeHuiLiBaoGroup) {
            return false;
        } else {
            let thlbMarketData = this.getTeHuiLiBaoMarketData();
            if (thlbMarketData != null) {
                let count: number = 0;
                for (let marketItem of thlbMarketData) {
                    if (marketItem.sellLimitData.getRestCount() > 0) {
                        return true;
                    }
                }
            }
            return false;
        }
    }

    getTeHuiLiBaoMarketData(): MarketItemData[] {
        let startDay = G.SyncTime.getDateAfterStartServer();
        startDay = Math.min(KfhdData.THLB_OPEN_DAY, startDay);
        return this.thlbGiftIdMap[startDay];
    }

    getTehuiLiBaoId(index: number): number {
        let marketData = this.getTeHuiLiBaoMarketData();
        if (marketData == null) return 0;
        return marketData[index].sellConfig.m_iItemID;
    }

    /////////////////////////////////////////////// 集字送好礼 ///////////////////////////////////////////////

    /** 开服活动  集字 活动配置表 */
    private setCollectWordActCfgs() {
        let configs: GameConfig.CollectWordActCfgM[] = G.Cfgmgr.getCfg('data/CollectWordActCfgM.json') as GameConfig.CollectWordActCfgM[];

        let item: KfhdCollectData;
        for (let cfg of configs) {
            let cnt = cfg.m_stCaiLiaoList.length;
            for (let i = cnt - 1; i >= 0; i--) {
                if (cfg.m_stCaiLiaoList[i].m_uiCaiLiaoID == 0) {
                    cfg.m_stCaiLiaoList.splice(i, 1);
                }
            }
            item = new KfhdCollectData(cfg);
            this.collectWordDatas.push(item);
            this.collectWordIdMap[cfg.m_iID] = item;
        }

        this.collectWordDatas.sort(this.sortFunc);
    }
    private sortFunc(a: KfhdCollectData, b: KfhdCollectData) {
        if (a.cfg.m_uiType == b.cfg.m_uiType) {
            return a.cfg.m_iID - b.cfg.m_iID;
        }
        return a.cfg.m_uiType == KeyWord.CHANGE_SERVER ? -1 : 1;
    }
    
    /**
     * 更新集字送好礼全服领奖数据
     * @param data
     *
     */
    updateJzshlServerData(m_iServerChangeNums: number): void {
        for (let itemVo of this.collectWordDatas) {
            if (itemVo.cfg.m_uiType == KeyWord.CHANGE_SERVER) {
                //类型2的时候是全服兑换，更新兑换次数
                itemVo.exchangeCount = m_iServerChangeNums;
            }
        }
    }

    /**集字送好礼是否可领取*/
    canGetJiZiSongHaoLi(): boolean {
        //集字活动
        for (let data of this.collectWordDatas) {
            if (data.rewardState == EnumKfhdCollectState.reached) {
                return true;
            }
        }
        return false;
    }

    /////////////////////////////////////////////// boss ///////////////////////////////////////////////

    /** 开服活动 boss 活动配置表 */
    private setBossCfgs(): void {
        let cfgs = G.Cfgmgr.getCfg('data/ChallengeBossCfgM.json') as GameConfig.ChallengeBossCfgM[];

        this.bossTypeMap[EnumKfhdBossType.world] = [];
        this.bossTypeMap[EnumKfhdBossType.fengMoTa] = [];
        this.bossTypeMap[EnumKfhdBossType.diGong] = [];
        for (let cfg of cfgs) {
            let vo = new KfhdBossVo();
            vo.cfg = cfg;
            let typeList = this.bossTypeMap[cfg.m_ucBossType];
            typeList.push(vo);
            this.bossIdMap[cfg.m_iID] = vo;
        }
    }

    /**
     * 更新boss 数据
     * @param data
     *
     */
    updateBossData(value: Protocol.BossActInfoRsp): void {
        let datas: Protocol.NewBossActInfo[] = value.m_stBossInfoList;
        for (let data of datas) {
            let item = this.bossIdMap[data.m_uiBossID];
            if (item != null)
                item.status = data.m_ucStatus;
        }
    }

    /**
     * 获取boss 列表
     * @param type boss类型
     * @return
     *
     */
    getBossList(type: EnumKfhdBossType): KfhdBossVo[] {
        return this.bossTypeMap[type];
    }

    getBossRewardCount(type: EnumKfhdBossType): number {
        let count: number = 0;
        //世界BOSS
        let worldBossList = this.getBossList(type);
        for (let k: number = 0; k < worldBossList.length; k++) {
            if (worldBossList[k].status == EnumKfhdBossStatus.reached) {
                count++;
            }
        }
        return count;
    }

    /////////////////////////////////////////////// 首充团购 ///////////////////////////////////////////////

    private setGroupBuyConfigs(): void {
        let cfgs = G.Cfgmgr.getCfg('data/KFSCTGCfgM.json') as GameConfig.KFSCTGCfgM[];
        for (let cfg of cfgs) {
            let map1 = this.groupBuyCfgMap[cfg.m_iCondition1];
            if (null == map1) {
                this.groupBuyCfgMap[cfg.m_iCondition1] = map1 = {};
                this.getGroupBuyConditionMap[cfg.m_iCondition1] = [];
            }
            let list = map1[cfg.m_iCondition2];
            if (null == list) {
                map1[cfg.m_iCondition2] = list = [];
                this.getGroupBuyConditionMap[cfg.m_iCondition1].push(cfg.m_iCondition2);
            }
            list.push(cfg);
        }
    }

    getGroupBuyConfigs(condition1: number, condition2: number): GameConfig.KFSCTGCfgM[] {
        return this.groupBuyCfgMap[condition1][condition2];
    }

    getGroupBuyCondition2(condition1: number): number[] {
        return this.getGroupBuyConditionMap[condition1];
    }

    /**
     *  首充团购  
     * @param data
     * 
     */
    updateGroupBuyInfo(data: Protocol.KFSCTGData): void {
        this.m_groupBuyInfo = data;
    }

    canGetShouChongTuanGou(): boolean {
        if (null != this.m_groupBuyInfo) {
            for (let i: number = 0; i < this.m_groupBuyInfo.m_ucRewardNumber; i++) {
                if (this.m_groupBuyInfo.m_aucRewardStatus[i] == Macros.KF_ACT_STATUS_ARIVE) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 获取团购后台数据 
     * @return 
     * 
     */
    getGroupBuyInfoData(): Protocol.KFSCTGData {
        return this.m_groupBuyInfo;
    }

    /////////////////////////////////////////////// 通用 ///////////////////////////////////////////////

    ///**
    // *活动时间
    // * @return
    // *
    // */
    //get activityTime(): string {
    //    let syncTime: SyncTime = G.SyncTime;
    //    let sTime: number = syncTime.getDateAfterSpecifiedTime(0);
    //    let eTime: number = syncTime.getDateAfterSpecifiedTime(this._day);

    //    return getLang(72, DataFormatter.second2yyyymmdd(sTime), DataFormatter.second2yyyymmdd(eTime));
    //}

    /**
     *活动开始到结束时间
     * @return
     *
     */
    getActivityBeginToOverTime(): string {
        let syncTime: SyncTime = G.SyncTime;
        let beginTime: number = G.SyncTime.m_uiServerStartTime;
        let overTime: number = beginTime + 6 * 24 * 3600;
        return G.DataMgr.langData.getLang(72, DataFormatter.second2yyyymmdd(beginTime), DataFormatter.second2yyyymmdd(overTime));
    }

    /**
     *结束剩余时间
     * @return
     *
     */
    getDowncountTime(): string {
        let syncTime: SyncTime = G.SyncTime;
        let time: number = (7 - syncTime.getDateAfterStartServer()) * 24 * 3600;
        let coundTime: number = syncTime.getServerZeroLeftTime() + time;
        return G.DataMgr.langData.getLang(73, DataFormatter.second2day(coundTime));
    }

    /////////////////////////////////////////////// 进阶日 ///////////////////////////////////////////////

    /** 获取进阶日配置表*/
    getJJRRewardCfgs(): JjrRewardsItemData[] {
        return this._JjrRewardsItems;
    }

    /**更新进阶日面板数据*/
    updateJJRPanelData(m_stStageDayPanelRsp: Protocol.StageDayInfo): void {
        this.JJRPanelInfo = m_stStageDayPanelRsp;
    }

    /**可以领取进阶日奖励*/
    canGetJinJieRiReward(): boolean {
        if (this.JJRPanelInfo) {
            for (let oneDayState of this.JJRPanelInfo.m_stOneStatusList) {
                if (oneDayState.m_ucStatus == 2) {
                    return true;
                }
            }
        }
        return false;
    }

    updateJJRRewardlData(m_stGetStageDayRewardRsp: Protocol.StageDayInfo): void {
        this.JJRRewardInfo = m_stGetStageDayRewardRsp;
    }

    /**设置进阶日配置*/
    private setJjrConfig(): void {
        let data: GameConfig.StageDayCfgM[] = G.Cfgmgr.getCfg('data/StageDayCfgM.json') as GameConfig.StageDayCfgM[];
        this.m_jinJieRiConfig = {};
        for (let config of data) {
            this.m_jinJieRiConfig[config.m_iID] = config;
        }
    }

    /**
     *获取进阶日 配置
     *
     */
    getJjrConfig(id: number): GameConfig.StageDayCfgM {
        return this.m_jinJieRiConfig[id];
    }

    getJjrDayConfig(Type: number): GameConfig.StageDayCfgM[] {
        this.m_todayRewardList = new Array<GameConfig.StageDayCfgM>();
        for (let key in this.m_jinJieRiConfig) {
            let config = this.m_jinJieRiConfig[key];
            if (config.m_ucType == Type) {
                this.m_todayRewardList.push(config);
            }
        }
        this.m_todayRewardList.sort(this._sortType);
        return this.m_todayRewardList;
    }

    private _sortType(a: GameConfig.StageDayCfgM, b: GameConfig.StageDayCfgM): number {
        if (a.m_iID > b.m_iID)
            return 1
        if (b.m_iID < a.m_iID)
            return -1
        return 0
    }

    public updateJinJieRankData(rsp: Protocol.StageDayRankPannel) {
        this.jinJieRankInfo = rsp;
    }

    /**
     * 根据进阶日类型取得模型类型
     * @param jinJieType
     */
    getUnitTypeByJinJieType(jinJieType: number): UnitCtrlType {
        let t = this.jinJieType2CtrlType[jinJieType];
        uts.assert(undefined != t, 'not support type: ' + jinJieType);
        return t;
    }

    ///////////////////////////////////////// 宝典 /////////////////////////////////////////

    private setBaoDianConfigs(): void {
        let cfgs: GameConfig.BaoDianCfgM[] = G.Cfgmgr.getCfg('data/BaoDianCfgM.json') as GameConfig.BaoDianCfgM[];
        this.baoDianAllConfig = cfgs;
        for (let config of cfgs) {
            let cfgArr = this.baoDianCfgTypeMap[config.m_iType];
            if (undefined == cfgArr) {
                this.baoDianCfgTypeMap[config.m_iType] = cfgArr = [];
            }
            cfgArr.push(config);
            this.baoDianCfgIdMap[config.m_iID] = config;
            this.baoDianStatusMap[config.m_iID] = 0;
            this.baoDianFinishMap[config.m_iType] = 0;
        }
    }

    getBaoDianConfigsByType(type: number): GameConfig.BaoDianCfgM[] {
        return this.baoDianCfgTypeMap[type];
    }

    getBaoDianAllConfigs(): GameConfig.BaoDianCfgM[] {
        return this.baoDianAllConfig;
    }

    getBaoDianConfigById(id: number): GameConfig.BaoDianCfgM {
        return this.baoDianCfgIdMap[id];
    }

    updateBaoDianStatus(response: Protocol.BaoDian_Response) {
        for (let i = 0; i < response.m_iCount; i++) {
            let oneStatus = response.m_stStautsList[i];
            let oldStatus = this.baoDianStatusMap[oneStatus.m_iID];
            this.baoDianStatusMap[oneStatus.m_iID] = oneStatus.m_iStatus;
            if (oneStatus.m_iStatus != oldStatus) {
                let cfg = this.getBaoDianConfigById(oneStatus.m_iID);
                let oldCnt = this.baoDianFinishMap[cfg.m_iType];
                if (undefined == oldCnt) {
                    oldCnt = 0;
                }
                let newCnt = oldCnt;
                if (oneStatus.m_iStatus != 0) {
                    newCnt++;
                } else {
                    newCnt--;
                }
                this.baoDianFinishMap[cfg.m_iType] = Math.max(0, newCnt);
            }
        }
    }

    getBaoDianFinishCnt(type: number): number {
        return this.baoDianFinishMap[type];
    }

    getBaoDianStatus(id: number) {
        let status = this.baoDianStatusMap[id];
        if (undefined == status) {
            status = 0;
        }

        return status;
    }

    getRecommenedId(): number {
        let count = KfhdData.BaoDianBigTypes.length;
        for (let i = 0; i < count; i++) {
            let type = KfhdData.BaoDianBigTypes[i];
            let cfgsArr = this.getBaoDianConfigsByType(type);
            let len = cfgsArr.length;
            for (let j = 0; j < len; j++) {
                let id = cfgsArr[j].m_iID;
                if (0 == this.getBaoDianStatus(id)) {
                    return id;
                }
            }
        }
        return 0;
    }

    isAllBaoDianFinished(): boolean {
        let count = KfhdData.BaoDianBigTypes.length;
        for (let i = 0; i < count; i++) {
            let type = KfhdData.BaoDianBigTypes[i];
            let cfgsArr = this.getBaoDianConfigsByType(type);
            if (this.getBaoDianFinishCnt(type) < cfgsArr.length) {
                return false;
            }
        }
        return true;
    }
}
