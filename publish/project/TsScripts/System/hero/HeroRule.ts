import { Macros } from 'System/protocol/Macros';
import { HeroAttItemData } from 'System/hero/HeroAttItemData';
import { KeyWord } from 'System/constants/KeyWord';

export class HeroRule {
    /** 装备名称集合 */
    static EQUIP_OTHER_LIST: Array<string> = ['装备1', '装备2', '装备3', '装备4'];

    /** 怒气最大值 */
    static SP_MAX: number = 200;

    /**角色面板属性macroId数组*/
    static HERO_PANEL_ATT_MACRO_ID_ARR: Array<number> = [Macros.EUAI_MAXHP, Macros.EUAI_GOD_POWER, Macros.EUAI_PHYATK, Macros.EUAI_DEFENSE,
    Macros.EUAI_GOAL, Macros.EUAI_DODGE, Macros.EUAI_CRITICAL, Macros.EUAI_TOUGHNESS, Macros.EUAI_BREAK_ATT, Macros.EUAI_BREAK_DEF,
    Macros.EUAI_CRITICAL_HURT, Macros.EUAI_BLOCK_RATE, Macros.EUAI_SPEED, Macros.EUAI_HURTEXTRA,
    Macros.EUAI_DEFPRESS, Macros.EUAI_ATKPRESS];

    /**功能ID分页*/
    static FUN_ID_TABS: number[] = [0, KeyWord.HERO_SUB_TYPE_ZUOQI, KeyWord.HERO_SUB_TYPE_WUHUN, KeyWord.HERO_SUB_TYPE_FAZHEN, KeyWord.HERO_SUB_TYPE_LEILING];

    /**升阶最大等级*/
    static stageUpMaxLevel: number = 10;

    static sortAttListData(a: HeroAttItemData, b: HeroAttItemData): number {
        if (a.addVal == 0 && b.addVal != 0) {
            return 1;
        }
        else if (a.addVal != 0 && b.addVal == 0) {
            return -1;
        }
        let configIndex: number = a.configIndex - b.configIndex;
        if (configIndex != 0) {
            return configIndex;
        }
        return HeroRule.HERO_PANEL_ATT_MACRO_ID_ARR.indexOf(a.macroId) - HeroRule.HERO_PANEL_ATT_MACRO_ID_ARR.indexOf(b.macroId);
    }
}

