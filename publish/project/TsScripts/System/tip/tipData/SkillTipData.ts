import { TipType } from 'System/constants/GameEnum'
import { ITipData } from 'System/tip/tipData/ITipData'
/**
* 技能Tip的数据结构。
* @author teppei
* 
*/
export class SkillTipData implements ITipData {
    readonly tipDataType: TipType = TipType.SKILL_TIP;

    /**存放Tip显示的数据源*/
    skillConfig: GameConfig.SkillConfigM;

    /**是否预览的（无视学习与否）*/
    isPreview: boolean;

    setTipData(skillConfig: GameConfig.SkillConfigM, isPreview: boolean = false): void {
        this.skillConfig = skillConfig;
        this.isPreview = isPreview;
    }
}
