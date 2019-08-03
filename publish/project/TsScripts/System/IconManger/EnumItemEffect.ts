import { KeyWord } from 'System/constants/KeyWord'
import { EnumRewardState } from 'System/constants/GameEnum'
/**
* 物品特效规则的枚举类。
* 
* @author teppei
* 
*/	
export class EnumItemEffect {
    /**
    * 蓝、紫、橙、红物品都有特效。
    */
    static ALL: number = 0;

    /**
    * 禁用特效。
    */
    static NONE: number = 1;

    /**
    * 奖励物品只有橙、红物品才需要特效。(现在其实和all一样）；
    */
    static REWARD: number = 2;

    /**
    * 检查指定的特效规则下，指定颜色的物品是否需要特效。
    * @param effectRule
    * @param color
    * @return 
    * 
    */
    static isNeedEffect(effectRule: number, color: number, state: number = 1): boolean {
        if (state == EnumRewardState.HasGot) {
            return false;
        }
        if (EnumItemEffect.NONE == effectRule) {
            return false;
        }
        if ((EnumItemEffect.ALL == effectRule || EnumItemEffect.REWARD == effectRule) && (KeyWord.COLOR_WHITE == color || KeyWord.COLOR_GREEN == color)) {
            return false;
        }
        return true;
    }
}