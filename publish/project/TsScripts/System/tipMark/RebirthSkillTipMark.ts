import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

export class RebirthSkillTipMark extends BaseTipMark {
    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_REBIRTH];
        this.sensitiveToSkill = true;
        this.sensitiveToRebirth = true;
    }

    protected doCheck(): boolean {
        //let skillData = G.DataMgr.skillData;
        //return skillData.canUpgradeRebirthSkill();
        return false;
    }

    get TipName(): string {
        return '转生技能提升';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_ZHUANSHENG_JINENG);
    }
}