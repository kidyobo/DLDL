import { Global as G } from 'System/global'
import { KeyWord } from "System/constants/KeyWord"
import { CompareUtil } from 'System/utils/CompareUtil'

export class MonsterData {
    /**
    * [npcid, monsterconfig]
    */
    private static m_dataMap: { [monsterID: number]: GameConfig.MonsterConfigM } = {};

    /**
    * [npcid, clientMonster config list]
    */
    private static m_clientMonsterMap: { [monsterID: number]: GameConfig.ClientMonsterConfigM[] } = {};

    /**[id - boss cfg]*/
    private static _bossIdDic: { [id: number]: GameConfig.ZYCMCfgM } = {};
    private static _type2bossCfgs: { [type: number]: GameConfig.ZYCMCfgM[] } = {};

    /**
    *人形怪 
    */
    private static m_renXingCfgMap: { [modelID: number]: GameConfig.RenXingConfigM } = {};

    /**血战封魔领宝箱最多次数*/
    static readonly XzfmBoxMaxCnt = 3;
    /**血战封魔领奖最多次数*/
    static readonly XzfmGiftMaxCnt = 1;

    /**远古boss相关 */
    private firstAliveAncientBossId = 0;

    static isHasBossRefresh: boolean = false;
    static isFirstOpenPanel: boolean = false;

    private ancientTaskCfgMap: { [id: number]: GameConfig.AncientQuestConfigM } = {};

    ancientBossPanelInfo: Protocol.XZFMPanel;
    private id2ancientBossInfo: { [id: number]: Protocol.XZFM_BOSS } = {};

    public vipBossCfgs: GameConfig.VIPBossCfgM[];

    private worldBossRewardMap: {
        [bossId: number]: {
            [type: number]: { [day: number]: GameConfig.WorldBossRewardCfgM }
        }
    } = {};
    /**保存任意一条世界boss的奖励信息*/
    private oneWorldBossRewardCfg: GameConfig.WorldBossRewardCfgM = null;
    /**世界boss开服奖励结束天数,结束后进入周期更换*/
    startServerRewardOverDay: number = 0;
    /**世界boss周期奖励天数 */
    loopRewardDay: number = 0;

    onCfgReady() {
        this.setMonsterConfig();
        this.setWorldRewardConfig();
        this.setZycmConfig();
        this.setClientMonsterConfigs();
        this.setAncientBossTaskConfigs();
        this.setVipBossCfgs();
    }

    private setMonsterConfig(): void {
        let configs: GameConfig.MonsterConfigM[] = G.Cfgmgr.getCfg('data/MonsterConfigM.json') as GameConfig.MonsterConfigM[];

        for (let cfg of configs) {
            if (cfg.m_iMonsterID != 0) {
                MonsterData.m_dataMap[cfg.m_iMonsterID] = cfg;
            }
        }
    }

    /**
    * 根据id取得怪物配置 
    * @param id
    * @return 
    * 
    */
    static getMonsterConfig(id: number): GameConfig.MonsterConfigM {
        let result: GameConfig.MonsterConfigM = MonsterData.m_dataMap[id];
        if (null == result) {
            uts.logFailure("怪物ID不存在：" + id);
        }
        return result;
    }

    private setWorldRewardConfig(): void {
        let dataList: GameConfig.WorldBossRewardCfgM[] = G.Cfgmgr.getCfg('data/WorldBossRewardCfgM.json') as GameConfig.WorldBossRewardCfgM[];
        for (let cfg of dataList) {
            if (this.oneWorldBossRewardCfg == null) {
                this.oneWorldBossRewardCfg = cfg;
            }
            if (cfg.m_iBossID == this.oneWorldBossRewardCfg.m_iBossID) {
                if (cfg.m_iType == KeyWord.DAY_LOOP_TYPE_1) {
                    this.startServerRewardOverDay++;
                } else if (cfg.m_iType == KeyWord.DAY_LOOP_TYPE_2) {
                    this.loopRewardDay++;
                }
            }
            let bossId = cfg.m_iBossID;
            let rewardType = cfg.m_iType;
            let day = cfg.m_iDay;

            if (this.worldBossRewardMap[bossId] == null) {
                this.worldBossRewardMap[bossId] = {};
            }
            if (this.worldBossRewardMap[bossId][rewardType] == null) {
                this.worldBossRewardMap[bossId][rewardType] = {};
            }
            this.worldBossRewardMap[bossId][rewardType][day] = cfg;
        }
    }
    /**
     * 获取世界boss奖励
     * @param bossId
     * @param rewardType
     * @param day
     */
    public getWorldRewardCfg(bossId: number, rewardType: number, day: number) {
        return this.worldBossRewardMap[bossId][rewardType][day];
    }
    /**获取任意 一条世界Boss奖励信息,其实就是为了拿这条配置的bossId */
    public getOneWorldRewardCfg(): GameConfig.WorldBossRewardCfgM {
        return this.oneWorldBossRewardCfg;
    }

    private setZycmConfig(): void {
        let dataList: GameConfig.ZYCMCfgM[] = G.Cfgmgr.getCfg('data/ZYCMCfgM.json') as GameConfig.ZYCMCfgM[];

        for (let cfg of dataList) {
            MonsterData._bossIdDic[cfg.m_iID] = cfg;
            let a = MonsterData._type2bossCfgs[cfg.m_iIMonsterType];
            if (!a) {
                MonsterData._type2bossCfgs[cfg.m_iIMonsterType] = a = [];
            }
            a.push(cfg);

            for (let i: number = cfg.m_iItemID.length - 1; i >= 0; i--) {
                if (cfg.m_iItemID[i] <= 0) {
                    cfg.m_iItemID.splice(i);
                }
            }
        }
    }

    static getBossCfgsByType(type: number): GameConfig.ZYCMCfgM[] {
        return MonsterData._type2bossCfgs[type];
    }

    /**
     * 获取BOSS配置表
     * @param	monsterId
     * @return
     */
    static getBossConfigById(bossId: number): GameConfig.ZYCMCfgM {
        return MonsterData._bossIdDic[bossId];
    }

    //////////////////////////////////////// 远古boss //////////////////////////////////////////////

    private setAncientBossTaskConfigs(): void {
        let configs = G.Cfgmgr.getCfg('data/AncientQuestConfigM.json') as GameConfig.AncientQuestConfigM[];

        for (let config of configs) {
            this.ancientTaskCfgMap[config.m_iQuestID] = config;
        }
    }

    getAncientBossTaskCfg(id: number): GameConfig.AncientQuestConfigM {
        return this.ancientTaskCfgMap[id];
    }

    updateByXzfmPanel(panelInfo: Protocol.XZFMPanel) {
        this.ancientBossPanelInfo = panelInfo;
        this.updateXzfmBossLive();
    }

    updateByXzfmBossNtf(bossList: Protocol.XZFMBossList) {
        if (null == this.ancientBossPanelInfo) {
            this.ancientBossPanelInfo = {
                m_uiScore: 0, m_ucRewardCount: 0, m_stRewardStatus: null, m_uiFinishTaskNum: 0,
                m_stBossList: bossList, m_ucBossRewardCnt: 0, m_stBossRewardList: null, m_stLimitTimeTask: null, m_ucPrizeCount: 0
            };
        } else {
            this.ancientBossPanelInfo.m_stBossList = bossList;
        }
        this.updateXzfmBossLive();
    }

    canEnterXzfmFloor(bossId: number): boolean {
        let cfgs = MonsterData.getBossCfgsByType(KeyWord.GROUP_XZFM_BOSS);
        for (let cfg of cfgs) {
            if (bossId == cfg.m_iID) {
                return cfg.m_iLevel < G.DataMgr.heroData.level;
            }
        }
        return false;
    }

    private updateXzfmBossLive() {
        let bossList = this.ancientBossPanelInfo.m_stBossList;
        this.firstAliveAncientBossId = 0;
        for (let i = 0; i < bossList.m_ucBossCount; i++) {
            let b = bossList.m_stBossList[i];
            this.id2ancientBossInfo[b.m_iBossID] = b;
            if (b.m_ucStatus == 1) {
                this.firstAliveAncientBossId = b.m_iBossID;
            }
        }
    }

    getAncientBossInfo(id: number): Protocol.XZFM_BOSS {
        return this.id2ancientBossInfo[id];
    }

    getFirstAliveAncientBossId(): number {
        return this.firstAliveAncientBossId;
    }

    ///////////////////////////////////////////// 前台怪 //////////////////////////////////////////
    /**
     * 前台怪的配置。
     * @param configs
     * 
     */
    private setClientMonsterConfigs(): void {
        let configs: GameConfig.ClientMonsterConfigM[] = G.Cfgmgr.getCfg('data/ClientMonsterConfigM.json') as GameConfig.ClientMonsterConfigM[];

        let idList: GameConfig.ClientMonsterConfigM[];
        for (let config of configs) {
            idList = MonsterData.m_clientMonsterMap[config.m_iMonsterID];
            if (null == idList) {
                MonsterData.m_clientMonsterMap[config.m_iMonsterID] = idList = new Array<GameConfig.ClientMonsterConfigM>();
            }
            idList.push(config);
        }
    }

    /**
    * 获取指定id的
    * @param id
    * @return 
    * 
    */
    static getClientMonsters(id: number): GameConfig.ClientMonsterConfigM[] {
        return MonsterData.m_clientMonsterMap[id];
    }

    private setRenXingConfigs(configs: GameConfig.RenXingConfigM[]): void {
        MonsterData.m_renXingCfgMap = {};
        let cfg: GameConfig.RenXingConfigM = null;
        for (cfg of configs) {
            if (cfg != null) {
                MonsterData.m_renXingCfgMap[cfg.m_iModelID] = cfg;
            }
        }
    }

    static getRenXingCfg(id: number): GameConfig.RenXingConfigM {
        return MonsterData.m_renXingCfgMap[id];
    }


    private setVipBossCfgs() {
        this.vipBossCfgs = G.Cfgmgr.getCfg('data/VIPBossCfgM.json') as GameConfig.VIPBossCfgM[];
    }



    ////////////////////////////////远古拍卖//////////////////////////////////

    private worldPaiMaiItemList: Protocol.WorldPaiMaiItem[] = [];

    setWorldPaiMaiItemList(itemList: Protocol.WorldPaiMaiItem[]) {
        this.worldPaiMaiItemList = itemList;
    }

    updateWorldPaiMaiItemList(oneItem: Protocol.WorldPaiMaiItem) {
        if (this.worldPaiMaiItemList && this.worldPaiMaiItemList.length > 0) {
            for (let i = 0; i < this.worldPaiMaiItemList.length; i++) {
                if (this.worldPaiMaiItemList[i].m_iItemFlowID == oneItem.m_iItemFlowID) {
                    this.worldPaiMaiItemList[i] = oneItem;
                    if (this.worldPaiMaiItemList[i].m_iCurPrice == this.worldPaiMaiItemList[i].m_iMaxPrice) {
                        this.worldPaiMaiItemList.splice(i, 1);
                    }
                    break;
                }
            }
        }
    }

    getWorldPaiMaiItemList() {
        return this.worldPaiMaiItemList;
    }


    getMyWorldPaiMaiItemList() {
        let myItemList: Protocol.WorldPaiMaiItem[] = [];
        if (this.worldPaiMaiItemList && this.worldPaiMaiItemList.length > 0) {
            for (let i = 0; i < this.worldPaiMaiItemList.length; i++) {
                if (CompareUtil.isRoleIDEqual(this.worldPaiMaiItemList[i].m_stRoleID, G.DataMgr.heroData.roleID)) {
                    myItemList.push(this.worldPaiMaiItemList[i]);
                }
            }
        }
        return myItemList;
    }

    /**上次记录*/
    worldPaiMaiActRecord: Protocol.WorldPaiMaiAct;
    updatePrevActRecord(worldPaiMaiActRecord: Protocol.WorldPaiMaiAct) {
        this.worldPaiMaiActRecord = worldPaiMaiActRecord;
    }

    getMyPaiMaiRecord() {
        for (let i = 0; i < this.worldPaiMaiActRecord.m_iRoleCount; i++) {
            let roleInfo = this.worldPaiMaiActRecord.m_stRoleList[i];
            if (CompareUtil.isRoleIDEqual(roleInfo.m_stRoleID, G.DataMgr.heroData.roleID)) {
                return roleInfo;
            }
        }
        return null;
    }



}