import { KeyWord } from "System/constants/KeyWord";
export class SkillUtil {
    /**
 * 判断该技能是否为单体攻击技能 
 * @param skill
 * @return 
 * 
 */
    public static isSingleAttack(skill: GameConfig.SkillConfigM): boolean {
        let rangeType = skill.m_stSkillCastArea.m_ucRangeType;
        return rangeType == KeyWord.SKILL_RANGE_TYPE_SINGLE || rangeType == 0;//0的情况就是表格中没有填
    }
}
export default SkillUtil;