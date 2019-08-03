import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'

export class JjrExchangeGridItemData {
    /**加号*/
    static TYPE_ADD: number = 1;
    /**等号*/
    static TYPE_EQUAL: number = 2;
    /**等号*/
    static TYPE_NONE: number = 3;

    rewardVo: RewardIconItemData;
    type: number = 0;
}
