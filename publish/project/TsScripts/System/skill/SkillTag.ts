/**
* 技能状态标记。
* @author teppei
* 
*/
export class SkillTag {
    /**默认状态，表示全效果。*/
    static DEFAULT: number = 0;

    /**开始冷却。*/
    static START_CD: number = 2;

    /**播放攻击动作的标记。*/
    static PLAY_ACTION: number = 4;

    /**播放攻击特效的标记。*/
    static PLAY_EFFECT: number = 8;

    /**播放音效的标记。*/
    static PLAY_SOUND: number = 16;

    /**震屏标记。*/
    static SHAKE_SCREEN: number = 32;

    static getTag(startCD: boolean, playAction: boolean, playEffect: boolean, playSound: boolean, shakeScreen: boolean): number {
        let result: number = 1;
        if (startCD) {
            result |= SkillTag.START_CD;
        }
        if (playAction) {
            result |= SkillTag.PLAY_ACTION;
        }
        if (playEffect) {
            result |= SkillTag.PLAY_EFFECT;
        }
        if (playSound) {
            result |= SkillTag.PLAY_SOUND;
        }
        if (shakeScreen) {
            result |= SkillTag.SHAKE_SCREEN;
        }

        return result;
    }

    /**
     * 是否需要开始冷却。
     * @param tag
     * @return 
     * 
     */
    static canStartCD(tag: number): boolean {
        return (0 == tag || 0 != (tag & SkillTag.START_CD));
    }

    /**
     * 是否可以播放攻击动作。
     * @param tag
     * @return 
     * 
     */
    static canPlayAction(tag: number): boolean {
        return (0 == tag || 0 != (tag & SkillTag.PLAY_ACTION));
    }

    /**
     * 是否可以播放攻击特效。
     * @param tag
     * @return 
     * 
     */
    static canPlayEffect(tag: number): boolean {
        return (0 == tag || 0 != (tag & SkillTag.PLAY_EFFECT));
    }

    /**
     * 是否可以播放攻击音效。
     * @param tag
     * @return 
     * 
     */
    static canPlaySound(tag: number): boolean {
        return (0 == tag || 0 != (tag & SkillTag.PLAY_SOUND));
    }

    /**
     * 是否可以播放震屏。
     * @param tag
     * @return 
     * 
     */
    static canShakeScreen(tag: number): boolean {
        return (0 == tag || 0 != (tag & SkillTag.SHAKE_SCREEN));
    }
}
