import { Global as G } from 'System/global'

export class RankCacheData {
    rankType: number = 0;
    rankSubType: number = 0;
    cacheData: Protocol.RefreshRankInfo_Response;
    cacheTime: number = 0;
}


/**
 *排行榜配置 
 * @author bondzheng
 * 
 */
export class RankData {
    /**所有排行榜信息*/
    private m_arrRankInfos: GameConfig.RankConfInfoM[];

    private _rankConfigDic: { [type: number]: GameConfig.RankConfInfoM };

    private m_cacheData: RankCacheData[];

    onCfgReady(): void {
        let dataList: GameConfig.RankConfInfoM[] = G.Cfgmgr.getCfg('data/RankConfInfoM.json') as GameConfig.RankConfInfoM[];
        this.m_arrRankInfos = dataList;
        this._rankConfigDic = {};
        for (let config of dataList) {
            this._rankConfigDic[config.m_iRankType] = config;
        }
        this.m_arrRankInfos.sort(this._sortRankConfig);
    }

    private _sortRankConfig(a: GameConfig.RankConfInfoM, b: GameConfig.RankConfInfoM): number {
        return a.m_iSequence - b.m_iSequence;
    }

    getConfigsByType(type: number): GameConfig.RankConfInfoM {
        return this._rankConfigDic[type];
    }

    /**
     * 返回所有排行榜配置 
     * @param catalog
     * @return 
     * 
     */
    getAllConfigs(): GameConfig.RankConfInfoM[] {
        let configs: GameConfig.RankConfInfoM[] = new Array<GameConfig.RankConfInfoM>();
        for (let config of this.m_arrRankInfos) {
            if (config.m_iCorrelationFunction == 0 || G.DataMgr.funcLimitData.isFuncAvailable(config.m_iCorrelationFunction)) {
                configs.push(config);
            }
        }
        return configs;
    }

    /**
     *根据类型取得排行榜的缓存数据 
     * @param type
     * @param checkTime 是否检查时间。
     * @param currentTime
     * @return 
     * 
     */
    getCacheByType(type: number, checkTime: boolean, currentTime: number): Protocol.RefreshRankInfo_Response {
        if (null == this.m_cacheData) {
            return null;
        }

        let l: number = this.m_cacheData.length;
        for (let i: number = 0; i < l; i++) {
            if (this.m_cacheData[i].rankType == type && (!checkTime || currentTime - this.m_cacheData[i].cacheTime < 120000)) {
                //缓存时间是2分钟，12万毫秒
                return this.m_cacheData[i].cacheData;
            }
        }

        return null;
    }

    /**
     *把排行榜数据缓存起来 
     * @param type
     * @param subType
     * @param currentTime
     * @param msg
     * 
     */
    saveCacheData(type: number, currentTime: number, response: Protocol.RefreshRankInfo_Response): void {
        if (null == this.m_cacheData) {
            this.m_cacheData = new Array<RankCacheData>();
        }

        let l: number = this.m_cacheData.length;
        for (let i: number = 0; i < l; i++) {
            if (this.m_cacheData[i].rankType == type) {
                this.m_cacheData[i].cacheData = response;
                this.m_cacheData[i].cacheTime = currentTime;
                return;
            }
        }

        let data: RankCacheData = new RankCacheData();
        data.rankType = type;
        data.cacheTime = currentTime;
        data.cacheData = response;
        this.m_cacheData.push(data);
    }
}
