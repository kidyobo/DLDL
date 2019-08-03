import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

export class SkillTipMark extends BaseTipMark {
    private skillId = 0;
    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_SKILL, KeyWord.OTHER_FUNCTION_SKILL_JIBAN];
        this.concernedCurrencys = [KeyWord.MONEY_TONGQIAN_ID];
        this.sensitiveToHeroLv = true;
        this.sensitiveToPet = true;
        this.sensitiveToSkill = true;
    }

    protected doCheck(): boolean {
        let skillData = G.DataMgr.skillData;
        let skills = skillData.getCanStudyOrUpgradeSkills(KeyWord.SKILL_BRANCH_ROLE_NQ, 1);
        let len = skills.length;
        if (len == 0) {
            //被动技能
            skills = skillData.getCanStudyOrUpgradeSkills(KeyWord.SKILL_BRANCH_ROLE_BD, 1);
            len = skills.length;
        }

        if (len == 0 && G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_SKILL_JIBAN)) {
            skills = skillData.getCanStudyOrUpgradeSkills(KeyWord.SKILL_BRANCH_ROLE_FETTER, 1);
            len = skills.length;
        }

        if (len > 0) {
            this.skillId = skills[0];
            return true;
        }

        return false;
    }

    get TipName(): string {
        return '技能提升';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_SKILL, 0, 0, this.skillId);
    }
}