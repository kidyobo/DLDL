import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { JjrExchangeGridItemData } from 'System/data/activities/JjrExchangeGridItemData'

export class JjrExchangeItemData {
    rewardVec: RewardIconItemData[];
    rewardGridVec: JjrExchangeGridItemData[];

    cfg: GameConfig.JPDDHActCfgM;
    canExchange: boolean = false;
}
