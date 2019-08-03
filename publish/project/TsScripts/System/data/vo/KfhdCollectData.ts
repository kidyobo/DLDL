import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'

export enum EnumKfhdCollectState {
    noReach = 0, 
    reached, 
    hasGot, 
}

export class KfhdCollectData {
    /** 兑换次数 */
    exchangeCount: number = 0;

    cfg: GameConfig.CollectWordActCfgM;

    constructor(cfg: GameConfig.CollectWordActCfgM) {
        this.cfg = cfg;
    }

    /** 领取状态 (0-未达成，1-达成，2-已领取) */
    get rewardState(): EnumKfhdCollectState {
        if (this.exchangeCount >= this.cfg.m_uiTime)
            return EnumKfhdCollectState.hasGot;

        let caiLiaoList: GameConfig.CWCaiLiaoItem[] = this.cfg.m_stCaiLiaoList;
        let thingData = G.DataMgr.thingData;
        for (let item of caiLiaoList) {
            let things = thingData.getBagItemById(item.m_uiCaiLiaoID, true, item.m_uiCaiLiaoCount);
            if (things.length < item.m_uiCaiLiaoCount)
                return EnumKfhdCollectState.noReach;
        }
        if (this.cfg.m_uiType == KeyWord.CHANGE_SERVER) {
            let day: number = G.SyncTime.getDateAfterStartServer();
            return this.cfg.m_iDay == day ? EnumKfhdCollectState.reached : EnumKfhdCollectState.noReach;
        }
        return EnumKfhdCollectState.reached;
    }
}
