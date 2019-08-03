import { Global as G } from 'System/global'
import { EnumRewardState } from 'System/constants/GameEnum'

export class CollectExchangeItemData {
    /** 兑换次数 */
    exchangeCount: number = 0;

    cfg: GameConfig.CollectExchangeActCfgM;

    constructor(cfg: GameConfig.CollectExchangeActCfgM) {
        this.cfg = cfg;
    }

    /** 领取状态 (0-未达成，1-达成，2-已领取) */
    get rewardState(): EnumRewardState {
        if (this.exchangeCount >= this.cfg.m_uiTime)
            return EnumRewardState.HasGot;

        let caiLiaoList = this.cfg.m_stCaiLiaoList;
        let thingData = G.DataMgr.thingData;
        for (let item of caiLiaoList) {
            if (thingData.getThingNum(item.m_uiID, 0, true) < item.m_uiCount)
                return EnumRewardState.NotReach;
        }
        return EnumRewardState.NotGot;
    }
}