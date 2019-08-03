/**
* 锁仙台副本Item的Vo。
* 
* 本文件代码由模板生成，你可能需要继续修改其他代码文件才能正常使用。
* 
* @author teppei
* 
*/
export class SxtItemData {
    /**副本配置。*/
    config: GameConfig.PinstanceConfigM;

    /**难度配置。*/
    diffConfig: GameConfig.PinstanceDiffBonusM;

    /**等级是否符合需求。*/
    isLvMeet: boolean;

    /**剩余完成次数。*/
    leftTimes: number = 0;

    /**是否今日已通。*/
    isTodayPassed: boolean;

    /**是否终生首通。*/
    isLifePassed: boolean;

    /**战斗力是否符合要求。*/
    isZdlMeet: boolean;
}
