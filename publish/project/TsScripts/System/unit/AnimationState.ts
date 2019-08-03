import { KeyWord } from "System/constants/KeyWord";
export class AnimationState{
    private keyList = {
    };
    constructor() {
        this.keyList[KeyWord.SKILL_Attack1] = "attack1";
        this.keyList[KeyWord.SKILL_Attack2] = "attack2";
        this.keyList[KeyWord.SKILL_Attack3] = "attack3";
        this.keyList[KeyWord.SKILL_Attack4] = "attack4";
        this.keyList[KeyWord.SKILL_1] = "skill1";
        this.keyList[KeyWord.SKILL_2] = "skill2";
        this.keyList[KeyWord.SKILL_3] = "skill3";
        this.keyList[KeyWord.SKILL_4] = "skill4";
        this.keyList[KeyWord.SKILL_5] = "skill5";
        this.keyList[KeyWord.SKILL_COLLECT] = "pick";
        this.keyList[KeyWord.SKILL_ATTACK] = "attack1";
    }

    public getSkillAction(skill: GameConfig.SkillConfigM): string{
        let str = this.keyList[skill.m_ucAttackAction];
        if (str == null) {
            uts.logWarning("skill action error:" + skill.m_iSkillID + "  skill.m_ucAttackAction:" + skill.m_ucAttackAction);
        }
        return str;
    }
}
export default AnimationState;