import { EnumRewardState } from 'System/constants/GameEnum'
/**
* 连续签到奖励数据。
* @author teppei
* 
*/
export class SignGiftItemData {
    /**累计次数*/
    count: number = 0;

    /**状态*/
    state: EnumRewardState = EnumRewardState.NotReach;

    /**奖励列表*/
    gifts: GameConfig.GiftItemInfo[];

    constructor(config: GameConfig.GiftBagConfigM, state: number) {
        this.count = config.m_iParameter;
        this.gifts = config.m_astGiftThing;
        this.state = state;
    }
}
