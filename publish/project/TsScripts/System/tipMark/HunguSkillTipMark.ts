import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { HunGuXiLianPanel } from 'System/hungu/HunGuXiLianPanel';
import { TipMarkUtil } from './TipMarkUtil';

export class HunguSkillTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_HUNGU_EQUIP];
        this.concernedFunctions = [KeyWord.OTHER_FUNCTION_HUNGU_SKILL];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_HUNGU_SKILL;
    }

    protected doCheck(): boolean {
        return TipMarkUtil.isHunguSkillShowTipMark();
    }

    get TipName(): string {
        return '魂骨技能';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGU_SKILL);
    }
}