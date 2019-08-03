import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros';
import { KeyWord } from 'System/constants/KeyWord';

/**
 * 属性工具。
 * @author teppei
 * 
 */
export class PropUtil {
    /**
     * 获取指定属性ID对应的宏定义。
     * @param attrId
     * @return 
     * 
     */
    static getPropMacrosByPropId(attrId: number): number {
        if (KeyWord.EQUIP_PROP_MAGIC_ATTACK == attrId) {
            return Macros.EUAI_MAGATK;
        }
        else if (KeyWord.EQUIP_PROP_SPEED == attrId) {
            return Macros.EUAI_SPEED;
        }
        else if (KeyWord.EQUIP_PROP_THROUGH == attrId) {
            return Macros.EUAI_THROUGH;
        }
        else if (KeyWord.EQUIP_PROP_MP == attrId) {
            return Macros.EUAI_MAXMP;
        }
        else if (KeyWord.EQUIP_PROP_ATTACK_PRESS == attrId) {
            return Macros.EUAI_ATKPRESS;
        }
        else if (KeyWord.EQUIP_PROP_GOAL == attrId) {
            return Macros.EUAI_GOAL;
        }
        else if (KeyWord.EQUIP_PROP_CRITICAL_HURT == attrId) {
            return Macros.EUAI_CRITICAL_HURT;
        }
        else if (KeyWord.EQUIP_PROP_DEFENSE == attrId) {
            return Macros.EUAI_DEFENSE;
        }
        else if (KeyWord.EQUIP_PROP_MAGICRESIST == attrId) {
            return Macros.EUAI_MAGICRESIST;
        }
        else if (KeyWord.EQUIP_PROP_HP == attrId) {
            return Macros.EUAI_MAXHP;
        }
        else if (KeyWord.EQUIP_PROP_HURT_EXTRA == attrId) {
            return Macros.EUAI_HURTEXTRA;
        }
        else if (KeyWord.EQUIP_PROP_CRITICAL == attrId) {
            return Macros.EUAI_CRITICAL;
        }
        else if (KeyWord.EQUIP_PROP_DEFENSE_PRESS == attrId) {
            return Macros.EUAI_DEFPRESS;
        }
        else if (KeyWord.EQUIP_PROP_DODGE == attrId) {
            return Macros.EUAI_DODGE;
        }
        else if (KeyWord.EQUIP_PROP_TOUGHNESS == attrId) {
            return Macros.EUAI_TOUGHNESS;
        }
        else if (KeyWord.EQUIP_PROP_PHYSIC_ATTACK == attrId) {
            return Macros.EUAI_PHYATK;
        }
        else if (KeyWord.EQUIP_PROP_SOUL_ATTACK == attrId) {
            return Macros.EUAI_MAX_SOUL;
        }
        else if (KeyWord.EQUIP_PROP_BLOOD_ATTACK == attrId) {
            return Macros.EUAI_MAX_BLOOD;
        }
        else {
            return 0;
        }
    }

    /**
     * 获取指定宏定义对应的属性ID。
     * @param attrId
     * @return 
     * 
     */
    static getPropIdByPropMacros(attrId: number): number {
        if (Macros.EUAI_MAGATK == attrId) {
            return KeyWord.EQUIP_PROP_MAGIC_ATTACK;
        }
        else if (Macros.EUAI_SPEED == attrId) {
            return KeyWord.EQUIP_PROP_SPEED;
        }
        else if (Macros.EUAI_THROUGH == attrId) {
            return KeyWord.EQUIP_PROP_THROUGH;
        }
        else if (Macros.EUAI_MAXMP == attrId) {
            return KeyWord.EQUIP_PROP_MP;
        }
        else if (Macros.EUAI_ATKPRESS == attrId) {
            return KeyWord.EQUIP_PROP_ATTACK_PRESS;
        }
        else if (Macros.EUAI_GOAL == attrId) {
            return KeyWord.EQUIP_PROP_GOAL;
        }
        else if (Macros.EUAI_CRITICAL_HURT == attrId) {
            return KeyWord.EQUIP_PROP_CRITICAL_HURT;
        }
        else if (Macros.EUAI_DEFENSE == attrId) {
            return KeyWord.EQUIP_PROP_DEFENSE;
        }
        else if (Macros.EUAI_MAGICRESIST == attrId) {
            return KeyWord.EQUIP_PROP_MAGICRESIST;
        }
        else if (Macros.EUAI_MAXHP == attrId) {
            return KeyWord.EQUIP_PROP_HP;
        }
        else if (Macros.EUAI_HURTEXTRA == attrId) {
            return KeyWord.EQUIP_PROP_HURT_EXTRA;
        }
        else if (Macros.EUAI_CRITICAL == attrId) {
            return KeyWord.EQUIP_PROP_CRITICAL;
        }
        else if (Macros.EUAI_DEFPRESS == attrId) {
            return KeyWord.EQUIP_PROP_DEFENSE_PRESS;
        }
        else if (Macros.EUAI_DODGE == attrId) {
            return KeyWord.EQUIP_PROP_DODGE;
        }
        else if (Macros.EUAI_TOUGHNESS == attrId) {
            return KeyWord.EQUIP_PROP_TOUGHNESS;
        }
        else if (Macros.EUAI_PHYATK == attrId) {
            return KeyWord.EQUIP_PROP_PHYSIC_ATTACK;
        }
        else if (Macros.EUAI_MAX_SOUL == attrId) {
            return KeyWord.EQUIP_PROP_SOUL_ATTACK;
        }
        else if (Macros.EUAI_MAX_BLOOD == attrId) {
            return KeyWord.EQUIP_PROP_BLOOD_ATTACK;
        }
        else if (Macros.EUAI_BREAK_ATT == attrId) {
            return KeyWord.EQUIP_PROP_BREAK_ATT;
        }
        else if (Macros.EUAI_BREAK_DEF == attrId) {
            return KeyWord.EQUIP_PROP_BREAK_DEF;
        }
        else if (Macros.EUAI_GOD_POWER == attrId) {
            return KeyWord.EQUIP_PROP_GOD_POWER;
        }
        else if (Macros.EUAI_BLOCK_RATE == attrId) {
            return KeyWord.EQUIP_PROP_BLOCK_RATE;
        }
        else {
            return 0;
        }
    }

    /**
    * 根据属性id去tip内容 
    * @param prop
    * @return 
    * 
    */
    static getTipByMacroId(macroId: number): string {
        let tip: string = '';
        if (macroId == Macros.EUAI_MAXHP) {
            tip = '生命值为0时角色死亡，可通过补血药品回复生命值';
        }
        else if (macroId == Macros.EUAI_MAXMP) {
            tip = '怒气值';
        }
        else if (macroId == Macros.EUAI_PHYATK) {
            tip = '对怪物造成伤害的能力';
        }
        else if (macroId == Macros.EUAI_MAGATK) {
            tip = '对玩家造成伤害的能力';
        }
        else if (macroId == Macros.EUAI_DEFENSE) {
            tip = '普防越高，受到怪物的伤害越低';
        }
        else if (macroId == Macros.EUAI_MAGICRESIST) {
            tip = '属防越高,受到人物造成的伤害越低';
        }
        else if (macroId == Macros.EUAI_GOAL) {
            tip = '命中高于对方闪避时必然命中对方';
        }
        else if (macroId == Macros.EUAI_DODGE) {
            tip = '闪避高于对方命中越高则闪避概率越大';
        }
        else if (macroId == Macros.EUAI_CRITICAL) {
            tip = '暴击高于对方抗暴越高则暴击概率越大';
        }
        else if (macroId == Macros.EUAI_TOUGHNESS) {
            tip = '抗暴高于对方暴击越高则被暴击的概率越小';
        }
        else if (macroId == Macros.EUAI_ATKPRESS) {
            tip = '伤害加深：大幅提高造成伤害的比例';
        }
        else if (macroId == Macros.EUAI_DEFPRESS) {
            tip = '伤害减免：大幅减少受到伤害的比例';
        }
        else if (macroId == Macros.EUAI_HURTEXTRA) {
            tip = '技能攻击时伤害增加的固定值';
        }
        else if (macroId == Macros.EUAI_SPEED) {
            tip = '移动速度：步行的移动速度';
        }
        else if (macroId == Macros.EUAI_CRITICAL_HURT) {
            tip = '暴伤越高，暴击时附加的伤害越高';
        }
        else if (macroId == Macros.EUAI_THROUGH) {
            tip = '技能攻击时，忽视对方普防或属防的固定值';
        }
        else if (macroId == Macros.EUAI_SOUL) {
            tip = '魂值可以抵消受到的部分伤害，每10秒自动恢复一定量的魂值';
        }
        else if (macroId == Macros.EUAI_MAX_BLOOD) {
            tip = '精血可用来释放神力技能提升人物能力';
        }
        else if (macroId == Macros.EUAI_MAX_SOUL) {
            tip = G.DataMgr.langData.getLang(19);
        }
        return tip;
    }

    //用获propid取属性文本
    static getPropStrByPropId(propid: number): string {
        return KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propid);
    }

    static getFaqiProps(faQiCfg: GameConfig.FaQiCfgM, soulCfg: GameConfig.FaQiZhuHunCfgM, outArr: GameConfig.EquipPropAtt[], outMap: { [propId: number]: GameConfig.EquipPropAtt }) {
        if (null != faQiCfg) {
            this.mergeProps(faQiCfg.m_astAddedProp, outArr, outMap);
        }
        if (null != soulCfg) {
            this.mergeProps(soulCfg.m_astProp, outArr, outMap);
        }
    }

    static isFaQiEffectedByHalo(propId: number, ssCfg1: GameConfig.ShenShouCfgM, ssCfg2: GameConfig.ShenShouCfgM) {
        if (propId > 0) {
            if (null != ssCfg1) {
                for (let p of ssCfg1.m_astHalo) {
                    if (propId == p.m_ucPropId) {
                        return ssCfg1;
                    }
                }
            }
            if (null != ssCfg2) {
                for (let p of ssCfg2.m_astHalo) {
                    if (propId == p.m_ucPropId) {
                        return ssCfg2;
                    }
                }
            }
        }
        return null;
    }

    static mergeProps(props: GameConfig.EquipPropAtt[], outArr: GameConfig.EquipPropAtt[], outMap: { [propId: number]: GameConfig.EquipPropAtt }) {
        for (let p of props) {
            let propValue = outMap[p.m_ucPropId];
            if (null == propValue) {
                outMap[p.m_ucPropId] = propValue = { m_ucPropId: p.m_ucPropId, m_ucPropValue: p.m_ucPropValue };
                outArr.push(propValue);
            } else {
                propValue.m_ucPropValue += p.m_ucPropValue;
            }
        }
    }
    private static percentPropDic: { [id: number]: number };
    static isPercentProp(prop: number) {
        if (!this.percentPropDic) {
            this.percentPropDic = {};
            this.percentPropDic[KeyWord.EQUIP_PROP_TRUEGOD_RATE] = 1;
            this.percentPropDic[KeyWord.EQUIP_PROP_REBOUND_TATE] = 1;
            this.percentPropDic[KeyWord.EQUIP_PROP_SUCK_BLOOD_RATE] = 1;
            this.percentPropDic[KeyWord.EQUIP_PROP_TOUGHNESS_EXT] = 1;
            this.percentPropDic[KeyWord.EQUIP_PROP_BLOCK_RATE] = 1;
            this.percentPropDic[KeyWord.EQUIP_PROP_BREAKBLOCK_RATE] = 1;
            this.percentPropDic[KeyWord.EQUIP_PROP_BREAK_DEF_RATE] = 1;
            this.percentPropDic[KeyWord.EQUIP_PROP_BREAK_DEF_PER] = 1;
            this.percentPropDic[KeyWord.EQUIP_PROP_HP_RESTORE_ADD] = 1;
            this.percentPropDic[KeyWord.EQUIP_PROP_EXP_ADD] = 1;
            this.percentPropDic[KeyWord.EQUIP_PROP_GOAL_EXT] = 1;
            this.percentPropDic[KeyWord.EQUIP_PROP_DODGE_EXT] = 1;
        }
        return this.percentPropDic[prop] ? true : false;
    }
}
