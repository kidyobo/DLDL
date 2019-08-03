import { Global as G } from 'System/global'
import { ConfirmCheck } from 'System/tip/TipManager'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { HeroData } from 'System/data/RoleData'
import { MonsterData } from 'System/data/MonsterData'

/**
 * 黑洞塔数据
 * @author lyl
 */
export class FmtData {
    /**黑洞塔boss推荐高等级0只*/
    private readonly FmtHighMinCnt = 0;
    /**黑洞塔boss推荐低等级6只*/
    private readonly FmtLowMinCnt = 8;

    private _fmtArr: GameConfig.FMTCfgM[];
    private _fmtDic: { [layer: number]: GameConfig.FMTCfgM } = {};
    private _fmtBossDic: { [bossId: number]: Protocol.CSFMTBossOneInfo } = {};
    /**野生boss(也就是现在有三层的那个落日森林) 可获得经验的怪物数量*/
    m_iKillMonsterNumber: number = 0;
    /**野生boss(也就是现在有三层的那个落日森林) 可击杀boss数量*/
    m_iKillBossNumber: number = 0;
    _BossHomeCostDic: { [layer: number]: GameConfig.HomeBossCostCfgM } = {};
    private maxLayer: number = 0;
    /**BOSS引导信息*/
    bossGuideInfo: Protocol.SceneInfoBossGuide;
    /**黑洞塔层当前选中index*/
    layerSelectIndex: number = 0;
    /**需要寻路的黑洞塔BOSSID*/
    pathFmtBossId: number = 0;

    fmtBossIds: number[] = [];

    private _fmtSceneDic: { [sceneId: number]: GameConfig.FMTCfgM } = {};
    private _fmtBossConfigDic: { [bossId: number]: GameConfig.FMTCfgM } = {};

    private _diGongBossCfgs: GameConfig.FMTCfgM[] = [];

    /**是否刷新提示黑洞塔*/
    isRefreshTips: boolean = true;

    /**地宫疲劳值*/
    diGongFatigue: Protocol.SceneInfoProcess;

    onCfgReady(): void {
        this._fmtArr = G.Cfgmgr.getCfg('data/FMTCfgM.json') as GameConfig.FMTCfgM[];
        for (let config of this._fmtArr) {
            this._fmtDic[config.m_iLayer] = config;
            this._fmtSceneDic[config.m_iSceneID] = config;
            for (let bossDropInfo of config.m_astBossDropList) {
                if (bossDropInfo.m_iBossID) {
                    this._fmtBossConfigDic[bossDropInfo.m_iBossID] = config;
                    //this.fmtBossIds.push(bossDropInfo.m_iBossID);
                }
            }
            this._fmtBossConfigDic[config.m_iBigBossId] = config;
            if (config.m_iBigBossId > 0) {
                this._diGongBossCfgs.push(config);
            }
            this.maxLayer = Math.max(config.m_iLayer, this.maxLayer);
        }

        this._fmtArr.sort(this.sort1);

        // 表格里面已经排好序了，这里就不排序了，否则有些boss的等级是一样的，这样会导致排序结果不稳定
        //this.fmtBossIds.sort(delegate(this, this.sortFmtBossId));

        let bossHomeconfig: GameConfig.HomeBossCostCfgM[] = G.Cfgmgr.getCfg('data/HomeBossCostCfgM.json') as GameConfig.HomeBossCostCfgM[];
        for (let config of bossHomeconfig) {
            this._BossHomeCostDic[config.m_iFloor] = config;
        }
    }

    private sort1(a: GameConfig.FMTCfgM, b: GameConfig.FMTCfgM) {
        return a.m_iLayer - b.m_iLayer;
    }

    //private sortFmtBossId(a: number, b: number): number {
    //    let monsterCfgA = MonsterData.getMonsterConfig(a);
    //    let monsterCfgB = MonsterData.getMonsterConfig(b);
    //    return monsterCfgA.m_usLevel - monsterCfgB.m_usLevel;
    //}

    /**用场景ID获取黑洞塔配置表*/
    getFmtCfgBySceneId(sceneId: number): GameConfig.FMTCfgM {

        return this._fmtSceneDic[sceneId];
    }

    /**用BOSSID获取黑洞塔配置表*/
    getFmtCfgByBossId(bossId: number): GameConfig.FMTCfgM {
        return this._fmtBossConfigDic[bossId];
    }

    /**更新黑洞塔数据*/
    updateFmtInfo(resp: Protocol.CSFMTListRsp): number[] {
        let reborns: number[] = [];
        for (let oneInfo of resp.m_astBossList) {
            let oldInfo = this._fmtBossDic[oneInfo.m_iBossID];
            let oldIsDead = undefined == oldInfo || (1 == oldInfo.m_ucIsDead && oldInfo.m_uiFreshTime > 0);
            if (oldIsDead && (0 == oneInfo.m_ucIsDead || oneInfo.m_uiFreshTime == 0)) {
                reborns.push(oneInfo.m_iBossID);
            }
            this._fmtBossDic[oneInfo.m_iBossID] = oneInfo;
        }
        this.m_iKillMonsterNumber = resp.m_iKillMonsterNumber;
        this.m_iKillBossNumber = resp.m_iKillBossNumber;
        G.DataMgr.taskRecommendData.onTaoFaChange();
        return reborns;
    }

    /**获取一个BOSS信息*/
    getBossOneInfo(bossId: number): Protocol.CSFMTBossOneInfo {
        return this._fmtBossDic[bossId];
    }

    /**黑洞塔层数数组*/
    get fmtArr(): GameConfig.FMTCfgM[] {
        return this._fmtArr;
    }

    /**是否在黑洞塔地图*/
    isFmtScene(sceneId: number): boolean {
        let cfg: GameConfig.FMTCfgM = this.getFmtCfgBySceneId(sceneId);
        return Boolean(cfg);
    }

    /** 获取第一个推荐挑战的地宫boss的id */
    getFirstRecommandDiGongBoss(): number {
        let level = G.DataMgr.heroData.level;
        let hunliLevel = G.DataMgr.hunliData.level;
        for (let config of this._diGongBossCfgs) {
            let bossOneInfo = this.getBossOneInfo(config.m_iBigBossId);
            if (bossOneInfo && (0 == bossOneInfo.m_ucIsDead || 0 == bossOneInfo.m_uiFreshTime) && level >= config.m_iBigExhibitionLevel && hunliLevel >= config.m_iBigBossHunliLimit) {
                return config.m_iBigBossId;
            }
        }
        return 0;
    }

    /** 获取需要弹窗的地宫boss的id */
    getDiGongTipBoss(): number {
        let candidates = this.getDiGongTipCandidates();
        for (let config of candidates) {
            let bossOneInfo = this.getBossOneInfo(config.m_iBigBossId);
            if (bossOneInfo && (0 == bossOneInfo.m_ucIsDead || 0 == bossOneInfo.m_uiFreshTime)) {
                return config.m_iBigBossId;
            }
        }

        return 0;
    }

    isDiGongBossInCandidates(bossId: number): boolean {
        let candidates = this.getDiGongTipCandidates();
        for (let config of candidates) {
            if (config.m_iBigBossId == bossId) {
                return true;
            }
        }
        return false;
    }

    private getDiGongTipCandidates(): GameConfig.FMTCfgM[] {
        // 118级及以下的玩家推送小于等于自身等级的2层
        // 118级（不包含）以上的玩家推送小于等于自身等级的1层
        let level = G.DataMgr.heroData.level;
        let considerCnt = 1;
        if (level <= 118) {
            considerCnt = 2;
        }
        let len = this._diGongBossCfgs.length;
        let cnt = 0;
        let result: GameConfig.FMTCfgM[] = [];
        for (let i = len - 1; i >= 0; i--) {
            let config = this._diGongBossCfgs[i];
            if (level >= config.m_iBigExhibitionLevel) {
                result.push(config);
                cnt++;
                if (cnt >= considerCnt) {
                    break;
                }
            }
        }

        return result;
    }

    getFmtBossReciveCount(): number {
        let now = Math.round(G.SyncTime.getCurrentTime() / 1000);
        let count: number = 0;
        for (let layerKey in this._fmtDic) {
            let config = this._fmtDic[layerKey];
            for (let boss of config.m_astBossDropList) {
                let bossOneInfo: Protocol.CSFMTBossOneInfo = this.getBossOneInfo(boss.m_iBossID);
                if (bossOneInfo && (0 == bossOneInfo.m_ucIsDead || bossOneInfo.m_uiFreshTime < now)) {
                    count++;
                }
            }
        }
        return count;
    }

    /** 推荐战斗力 */
    getSuggestLayer(): number {
        let heroData: HeroData = G.DataMgr.heroData;
        for (let i: number = this.fmtArr.length - 1; i >= 0; i--) {
            if (heroData.fight >= this.fmtArr[i].m_iFightPower)
                return this.fmtArr[i].m_iLayer;
        }
        return 1;
    }

    getDiGongSugguestBoss(): GameConfig.FMTCfgM {
        let fmtArr = this.fmtArr;
        let len: number = fmtArr.length;
        let now = Math.round(G.SyncTime.getCurrentTime() / 1000);
        for (let i: number = 0; i < len; i++) {
            let config = fmtArr[i];
            if (config.m_iBigBossId) {
                let bossInfo = G.DataMgr.fmtData.getBossOneInfo(config.m_iBigBossId);
                if (null != bossInfo) {
                    if (bossInfo.m_ucIsDead == 0 || bossInfo.m_uiFreshTime < now) {
                        return config;
                    }
                }
            }
        }
        return fmtArr[0];
    }

    getFmtSugguestBoss(): number {
        let myLv = G.DataMgr.heroData.level;

        let len = this.fmtBossIds.length;
        let highIds: number[] = [];
        let highCnt = 0;
        let lowIds: number[] = [];
        let lowCnt = 0;
        for (let i = len - 1; i >= 0; i--) {
            let bossId = this.fmtBossIds[i];
            let monsterCfg = MonsterData.getMonsterConfig(bossId);
            if (myLv < monsterCfg.m_usLevel) {
                // 等级比自身高
                highIds.unshift(bossId);
                highCnt++;
            } else {
                // 等级比自身高的不足，加入等级比自身低的
                lowIds.push(bossId);
                lowCnt++;
            }
        }

        //// 找出最接近自身等级的5只boss，优先取高3只和低2只
        //let lowGetCnt = 0;
        //if (lowCnt < this.FmtLowMinCnt) {
        //    lowGetCnt = lowCnt;
        //} else {
        //    if (highCnt >= this.FmtHighMinCnt) {
        //        lowGetCnt = this.FmtLowMinCnt;
        //    } else {
        //        lowGetCnt = Math.min(lowCnt, this.FmtHighMinCnt + this.FmtLowMinCnt - highCnt);
        //    }
        //}
        //let highGetCnt = Math.min(highCnt, this.FmtHighMinCnt + this.FmtLowMinCnt - lowGetCnt);

        // 只取低等级的6只
        let lowGetCnt = Math.min(this.FmtLowMinCnt, lowCnt);
        let highGetCnt = 0;

        let ids = lowIds.slice(0, lowGetCnt);
        for (let i = 0; i < highGetCnt; i++) {
            ids.push(highIds[i]);
        }

        let showBossIndex = -1;
        let minRefreshTime = 0;

        let count = ids.length;
        for (let i = 0; i < count; i++) {
            let bossId = ids[i];
            let bossInfo = this.getBossOneInfo(bossId);
            if (null != bossInfo) {
                if (0 == bossInfo.m_ucIsDead || 0 == bossInfo.m_uiFreshTime) {
                    showBossIndex = i;
                    break;
                } else if (0 == minRefreshTime || bossInfo.m_uiFreshTime < minRefreshTime) {
                    minRefreshTime = bossInfo.m_uiFreshTime;
                    showBossIndex = i;
                }
            }
        }

        if (showBossIndex < 0) {
            showBossIndex = 0;
        }

        return ids[showBossIndex];
    }
}