export class ZhuRongJiTanItemData {
    config: GameConfig.PinstanceConfigM;

    diffConfig: GameConfig.PinstanceDiffBonusM;

    bossConfig: GameConfig.MonsterConfigM;

    /**是否VIP等级受限。*/
    isVIPLimited: boolean;

    /**是否终生首通。*/
    isLifePassed: boolean;

    /**是否今日首通。*/
    isTodayPassed: boolean;
}
