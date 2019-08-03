export class TzjhGetItemData {
    type: number = 0;
    day: number = 0;
    rewardCfg: GameConfig.DropConfigM;
    /**领取状态 0未达成，1达成，2已领取*/
    state: number = 0;
}
