/**
	 * 开服签到Item的绑定数据。
	 * @author teppei
	 * 
	 */
export class KaifuSignItemData {
    /**不能领取。*/
    static CANNOT_DRAW: number = 1;

    /**可领取。*/
    static CAN_DRAW: number = 2;

    /**已领取。*/
    static DRAWN: number = 3;

    /**奖励配置。*/
    rewardConfig: GameConfig.GiftBagConfigM;

    /**是否已领取。*/
    status: number = 0;
}
