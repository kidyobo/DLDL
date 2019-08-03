import { Global as G } from 'System/global'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { PetData } from 'System/data/pet/PetData'
import { ThingData } from 'System/data/thing/ThingData'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { EquipUtils } from 'System/utils/EquipUtils'
import { DataFormatter } from 'System/utils/DataFormatter'

export class FightingStrengthUtil {

    /**附魔基础属性2条，后3条真神什么的取历史最大的配置*/
    private static readonly LianQiBaseProCount = 2;

    /**战斗力参数列表*/
    private static dicStrength: { [equipPropId: number]: number };

    /**
     * 计算装备的战斗力,只能是装备，不能是坐骑,时装
     * 战斗力取整规则为，每个属性计算后向下取整后再相加
     * @param config 装备静态属性
     * @param data 装备动态属性
     * @param previewLv 预览等级，翅膀合成没有动态数据
     * @return 返回-1为初始化失败，-2输入数据不完整，-3不是装备
     *
     */
    static getStrengthByEquip(config: GameConfig.ThingConfigM, data: Protocol.SpecThingProperty, previewLv: number = 0, ispreviewFuHun: boolean = false, isGetNextStreng: boolean = false, isGetNextPartLv: boolean = false): number {
        if (null == config) {
            // 静态数据不能为空
            return -2;
        }
        let fight: number = 0;

        //翅膀装备
        if (config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING) {
            let lv = 0;
            if (previewLv > 0) {
                lv = previewLv;
            } else if (data && data.m_stEquipInfo) {
                lv = data.m_stEquipInfo.m_stStrong.m_uiStrongProgress;
            }
            let wingStrengthCfg = G.DataMgr.equipStrengthenData.getWingStrengthCfg(config.m_iID, lv);
            if (!wingStrengthCfg)
                return 0;
            return FightingStrengthUtil.calStrength(wingStrengthCfg.m_astPropAtt);
        }

        //魂骨 暂时不考虑随机属性
        if (GameIDUtil.isHunguEquipID(config.m_iID)) {
            //不能用这个了。。。魂骨战力是会变的
            // return this.calStrength(config.m_astBaseProp);
            return G.DataMgr.hunliData.getHunguEquipFightS(config, data);
        }

        if (GameIDUtil.isRoleEquipID(config.m_iID)) {
            if (config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_LINGBAO) {
                return G.DataMgr.lingbaoData.getLingBaoCfg(config.m_iID).m_iFight * G.DataMgr.heroData.fight / 10000;
            }
        }

        let heroLv = EquipStrengthenData.EQUIP_BASEPROP_LEVEL;

        //如果不是角色装备，不用角色等级
        let strengthenData = G.DataMgr.equipStrengthenData;
        let isRoleEquip = GameIDUtil.isRoleEquipID(config.m_iID);
        for (let i: number = 0; i < config.m_astBaseProp.length; i++) {
            if (config.m_astBaseProp[i].m_ucPropId != null) {
                let value = config.m_astBaseProp[i].m_ucPropValue;
                //装备位等级
                if (isRoleEquip) {
                    let equipPartLv = EquipUtils.getEquipSlotLvByEquipPart(config.m_iEquipPart);
                    if (equipPartLv > 0) {
                        let equipSlotConfig;
                        if (isGetNextPartLv) {
                            equipSlotConfig = strengthenData.getEquipSlotConfigByPartAndLv(config.m_iEquipPart, equipPartLv + 1);
                            if (!equipSlotConfig) {//没有下一级配置数据
                                equipSlotConfig = strengthenData.getEquipSlotConfigByPartAndLv(config.m_iEquipPart, equipPartLv);
                            }
                        } else {
                            equipSlotConfig = strengthenData.getEquipSlotConfigByPartAndLv(config.m_iEquipPart, equipPartLv);
                        }
                        value += equipSlotConfig.m_astPropAtt[i].m_ucPropValue;
                    }
                }

                fight += FightingStrengthUtil.calStrengthByOneProp(config.m_astBaseProp[i].m_ucPropId, Math.floor(value * heroLv / EquipStrengthenData.EQUIP_BASEPROP_LEVEL));
            }
        }
        let strengthenConfig = G.DataMgr.equipStrengthenData.getEquipStrengthenConfigByPart(config.m_iEquipPart, isGetNextStreng);
        if (strengthenConfig != null) {
            for (let i: number = 0; i < strengthenConfig.m_astProp.length; i++) {
                if (strengthenConfig.m_astProp[i].m_ucPropId != null) {
                    fight += FightingStrengthUtil.calStrengthByOneProp(strengthenConfig.m_astProp[i].m_ucPropId, strengthenConfig.m_astProp[i].m_ucPropValue);
                }
            }
        }

        if (config.m_stExtProp.m_ucPropId != null) {
            fight += FightingStrengthUtil.calStrengthByOneProp(config.m_stExtProp.m_ucPropId, config.m_stExtProp.m_ucPropValue);
        }
        let part: number = config.m_iEquipPart;
        let configs: GameConfig.DiamondPropM[];
        if (data != null) {
            let id: number = 0;
            if (data.m_stZhuFuEquipInfo != null) {
                let randAttr: Protocol.RandAttrInfo = data.m_stZhuFuEquipInfo.m_stRandAttr;
                for (let i: number = 0; i < randAttr.m_ucNum; i++) {
                    id = EquipStrengthenData.getKeyWordByEuai(randAttr.m_aiPropAtt[i].m_ucPropId);
                    fight += FightingStrengthUtil.calStrengthByOneProp(id, randAttr.m_aiPropAtt[i].m_iPropValue);
                }
            }
            if (null != data.m_stEquipInfo) {
                let zmLevel: number = data.m_stEquipInfo.m_stLQ.m_ucLQLevel;
                let zmOldMaxLevel: number = data.m_stEquipInfo.m_stLQ.m_ucMaxLQLevel;

                if (zmLevel > 0) {
                    //当前附魔等级。如果小于历史最大的，只取前2条属性，后3条取历史最大的
                    let equipLqCfg: GameConfig.EquipLQM = strengthenData.getEquipLqCfg(config.m_iEquipPart, zmLevel);
                    let equipOldMaxLqCfg: GameConfig.EquipLQM = strengthenData.getEquipLqCfg(config.m_iEquipPart, zmOldMaxLevel);

                    if (equipLqCfg) {
                        let m_astPropAtt: GameConfig.EquipPropAtt[] = equipLqCfg.m_astPropAtt;
                        //当前强化的>=历史最大的
                        if (zmLevel >= zmOldMaxLevel) {
                            for (let att of m_astPropAtt) {
                                if (att.m_ucPropId != null) {
                                    fight += FightingStrengthUtil.calStrengthByOneProp(att.m_ucPropId, att.m_ucPropValue);
                                }
                            }
                        } else {
                            //当前的小于历史的，当前2条
                            for (let i = 0; i < FightingStrengthUtil.LianQiBaseProCount; i++) {
                                if (m_astPropAtt[i].m_ucPropId != null) {
                                    // uts.log("   基础2条    " + fight);
                                    fight += FightingStrengthUtil.calStrengthByOneProp(m_astPropAtt[i].m_ucPropId, m_astPropAtt[i].m_ucPropValue);
                                }
                            }
                            //+历史最大3条
                            if (equipOldMaxLqCfg) {
                                let oldMaxPropAtt: GameConfig.EquipPropAtt[] = equipOldMaxLqCfg.m_astPropAtt;
                                for (let i = FightingStrengthUtil.LianQiBaseProCount; i < oldMaxPropAtt.length; i++) {
                                    if (m_astPropAtt[i].m_ucPropId != null) {
                                        //  uts.log("   真神3条    " + fight);
                                        fight += FightingStrengthUtil.calStrengthByOneProp(oldMaxPropAtt[i].m_ucPropId, oldMaxPropAtt[i].m_ucPropValue);
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }


        let props: GameConfig.EquipPropAtt[] = [];
        if (data && data.m_stEquipInfo && data.m_stEquipInfo.m_stWash) {
            //表示预览的
            if (ispreviewFuHun) {
                let equipPart = config.m_iEquipPart;
                let lv = strengthenData.washStageInfo.m_ucLv;
                let propsArr = strengthenData.getWishRandomMaxProp(equipPart, lv);
                let star = strengthenData.getWishRandomMaxStar(equipPart, lv);

                //循环2次 策划要求
                for (let j = 0; j < 2; j++) {
                    for (let i = 0; i < propsArr.length; i++) {
                        let id = propsArr[i];
                        if (id > 0) {
                            let config = G.DataMgr.equipStrengthenData.getRefineConfig(id, star + 1);
                            let prop: GameConfig.EquipPropAtt = {} as GameConfig.EquipPropAtt;
                            prop.m_ucPropId = id;
                            prop.m_ucPropValue = config.m_iPropValue;
                            props.push(prop);
                        }
                    }
                }

            } else {
                let washInfo = data.m_stEquipInfo.m_stWash;
                for (let i: number = 0; i < EquipStrengthenData.MAX_REFINE_NUM; i++) {
                    let config = G.DataMgr.equipStrengthenData.getRefineConfig(washInfo.m_astAttr[i].m_ucPropId, washInfo.m_astAttr[i].m_ucWashLevel);
                    if (config) {
                        let prop: GameConfig.EquipPropAtt = {} as GameConfig.EquipPropAtt;
                        prop.m_ucPropId = washInfo.m_astAttr[i].m_ucPropId;
                        prop.m_ucPropValue = config.m_iPropValue;
                        props.push(prop);
                    }
                }

            }
            fight += FightingStrengthUtil.calStrength(props);
        }
        return fight;
    }

    /**
     *计算一组属性的战斗力属性
     * @param equipProps
     * @return
     *
     */
    static calStrength(equipProps: GameConfig.EquipPropAtt[]): number {
        let strength: number = 0;
        for (let prop of equipProps) {
            if (prop.m_ucPropValue == 0) {
                continue;
            }
            if (prop.m_ucPropValue != null) {
                strength += FightingStrengthUtil.calStrengthByOneProp(prop.m_ucPropId, prop.m_ucPropValue);
            }
        }
        return strength;
    }

    /**
     * 把属性b的值合到属性a里面
     * @param a
     * @param b
     * @return
     *
     */
    static mergeProp(a: GameConfig.EquipPropAtt[], b: GameConfig.EquipPropAtt[]): GameConfig.EquipPropAtt[] {
        let l: number = b.length;
        let isNew: boolean;
        for (let i: number = 0; i < l; i++) {
            if (b[i].m_ucPropValue == 0) {
                continue;
            }

            isNew = true;
            let c: number = a.length;
            for (let j: number = 0; j < c; j++) {
                if (a[j].m_ucPropId == b[i].m_ucPropId) {
                    a[j].m_ucPropValue += b[i].m_ucPropValue;
                    isNew = false;
                    break;
                }
            }

            if (isNew) {
                a.push({} as GameConfig.EquipPropAtt);
                a[c].m_ucPropId = b[i].m_ucPropId;
                a[c].m_ucPropValue = b[i].m_ucPropValue;
            }
        }

        return a;
    }

    static calStrengthByOneProp(id: number, value: number): number {
        if (id == 0 || value == 0) {
            return 0;
        }
        else {
            return Math.floor(value * FightingStrengthUtil.getOnePropFightValue(id) / 100);
            //增伤减伤计算用通用的方式
            // if (id == KeyWord.EQUIP_PROP_ATTACK_PRESS || id == KeyWord.EQUIP_PROP_DEFENSE_PRESS) {
            //     return Math.floor(value * (G.DataMgr.heroData.level * 20 + FightingStrengthUtil.getOnePropFightValue(id)) / 100);
            // }
            // else {
            //     return Math.floor(value * FightingStrengthUtil.getOnePropFightValue(id) / 100);
            // }
        }
    }

    /**
     * 初始化战斗力系数列表
     *
     */
    static initStrengthMap(): void {
        FightingStrengthUtil.dicStrength = {};

        // 生命
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_HP] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_MAXHP_RATE);

        //爆伤
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_CRITICAL_HURT] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_CRITICAL_HURT_RATE);

        // 爆击
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_CRITICAL] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_CRITICAL_RATE);

        // 韧性
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_TOUGHNESS] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_TOUGHNESS_RATE);

        // 攻击
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_PHYSIC_ATTACK] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_PHYATK_RATE);

        // 仙术
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_MAGIC_ATTACK] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_MAGATK_RATE);

        // 物理防御
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_DEFENSE] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_DEFENSE_RATE);

        // 闪避
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_DODGE] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_DODGE_RATE);

        // 命中
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_GOAL] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_GOAL_RATE);

        //伤害加成
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_ATTACK_PRESS] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_ATKPRESS_RATE);

        //伤害减免
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_DEFENSE_PRESS] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_DEFPRESS_RATE);

        //破击
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_BREAK_ATT] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_BREAK_ATT);
        //抗破
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_BREAK_DEF] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_BREAK_DEF);

        //真神
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_TRUEGOD_RATE] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_TRUEGOD_RATE);
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_TRUEGOD_ATT] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_TRUEGOD_ATT);
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_TRUEGOD_DEF] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_TRUEGOD_DEF);

        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_BREAK_DEF_RATE] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_BREAK_DEF_RATE);
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_BREAK_DEF_PER] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_BREAK_DEF_PER);

        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_GOAL_EXT] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_GOAL_EXT);
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_DODGE_EXT] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_DODGE_EXT);
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_CRITICAL_EXT] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_CRITICAL_EXT);
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_TOUGHNESS_EXT] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_TOUGHNESS_EXT);
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_BLOCK_RATE] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_BLOCK_RATE);
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_BREAKBLOCK_RATE] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_BREAKBLOCK_RATE);

        //青龙白虎朱雀抗性
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_MAGICRESIST] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_MAGICRESIST_RATE);

        //伤害
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_HURT_EXTRA] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_HURTEXTRA_RATE);

        //破甲
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_THROUGH] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_THROUGH_RATE);

        // 速度
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_SPEED] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_SPEED_RATE);
        // 神圣之力
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_GOD_POWER] = G.DataMgr.constData.getValueById(KeyWord.FIGHT_GOD_POWER);
        // 魂值
        FightingStrengthUtil.dicStrength[KeyWord.EQUIP_PROP_SOUL_ATTACK] = G.DataMgr.constData.getValueById(KeyWord.PARAM_SOULVALUE_RATE);
    }

    private static getOnePropFightValue(propId: number): number {
        let value = FightingStrengthUtil.dicStrength[propId];
        return undefined != value ? value : 0;
    }

    ///////////////////////////////////////////// 副本战力 /////////////////////////////////////////////

    /**
     * 当前副本的难度或者当前百层塔的层数所推荐的战力对应的属性推荐值。
     * @param pinstanceDiffConfig
     * @param attrId
     * @return
     *
     */
    static getRecommendAttrValue(pinstanceDiffConfig: GameConfig.PinstanceDiffBonusM, attrId: number): number {
        let result: number = 0;
        if (KeyWord.EQUIP_PROP_HP == attrId) {
            result = pinstanceDiffConfig.m_iFightPower * .78 / 7 / .04;
        }
        else if (KeyWord.EQUIP_PROP_PHYSIC_ATTACK == attrId) {
            result = pinstanceDiffConfig.m_iFightPower * .78 / 7 / .12;
        }
        else if (KeyWord.EQUIP_PROP_MAGIC_ATTACK == attrId) {
            result = pinstanceDiffConfig.m_iFightPower * .78 / 7 / .24;
        }
        else if (KeyWord.EQUIP_PROP_DEFENSE == attrId) {
            result = pinstanceDiffConfig.m_iFightPower * .78 / 7 / .14;
        }
        else if (KeyWord.EQUIP_PROP_MAGICRESIST == attrId) {
            result = pinstanceDiffConfig.m_iFightPower * .78 / 7 / .4;
        }
        else if (KeyWord.EQUIP_PROP_GOAL == attrId || KeyWord.EQUIP_PROP_DODGE == attrId) {
            result = pinstanceDiffConfig.m_iFightPower * .78 / 7 / 2;
        }
        else {
            if (defines.has('_DEBUG')) {
                uts.assert(false, '不受支持的属性：' + attrId);
            }
            result = 0;
        }

        return result / 2;
    }

    static getDressFight(data: Protocol.DressOneImageInfo): number {
        let result: number = 0;
        let config: GameConfig.DressImageConfigM = ThingData.getDressImageConfig(data.m_uiImageID);

        if (config != null) {
            result = FightingStrengthUtil.calStrength(config.m_astProp) * data.m_uiAddNum;
        }

        return result;
    }

    static getPetAttr(pet: Protocol.NewBeautyInfo, props: GameConfig.BeautyPropAtt[], isOther: boolean = false, otherPet: Protocol.DBBeautyInfo = null): GameConfig.BeautyPropAtt[] {
        let propNum: number = 0;
        let i: number = 0;

        //先计算基础属性
        let strongConfig: GameConfig.BeautyStageM;
        let soulConfig: GameConfig.HongYanJuShenConfigM;

        if (isOther) {
            strongConfig = PetData.getEnhanceConfig(otherPet.m_iBeautyID, otherPet.m_uiStage == 0 ? 1 : otherPet.m_uiStage);
        }
        else {
            strongConfig = PetData.getEnhanceConfig(pet.m_iBeautyID, pet.m_uiStage == 0 ? 1 : pet.m_uiStage);
        }

        for (i = 0; i < strongConfig.m_astAttrList.length; i++) {
            propNum = FightingStrengthUtil._mergePetProp(props, propNum, strongConfig.m_astAttrList[i].m_ucPropId, strongConfig.m_astAttrList[i].m_iPropValue);
        }

        ///////////////////////////计算聚神属性////////////////////////////////////////////

        if (isOther) {
            soulConfig = PetData.getFeishengConfig(otherPet.m_iBeautyID, otherPet.m_stJuShen.m_uiLevel);
        }
        else {
            soulConfig = PetData.getFeishengConfig(pet.m_iBeautyID, pet.m_stJuShen.m_uiLevel);
        }

        if (soulConfig != null) {
            for (i = 0; i < soulConfig.m_astProp.length; i++) {
                propNum = FightingStrengthUtil._mergePetProp(props, propNum, soulConfig.m_astProp[i].m_ucPropId, soulConfig.m_astProp[i].m_iPropValue);
            }
        }
        //飞升次数
        let m_ucNum = pet.m_stFeiSheng.m_ucNum;
        for (let i = 0; i < m_ucNum; i++) {
            if (isOther) {
                strongConfig = PetData.getEnhanceConfig(otherPet.m_iBeautyID, otherPet.m_stFeiSheng.m_usStage[i]);
                soulConfig = PetData.getFeishengConfig(otherPet.m_iBeautyID, otherPet.m_stFeiSheng.m_usFSLv[i]);
            }
            else {
                strongConfig = PetData.getEnhanceConfig(pet.m_iBeautyID, pet.m_stFeiSheng.m_usStage[i]);
                soulConfig = PetData.getFeishengConfig(pet.m_iBeautyID, pet.m_stFeiSheng.m_usFSLv[i]);
            }

            for (let i = 0; i < strongConfig.m_astAttrList.length; i++) {
                propNum = FightingStrengthUtil._mergePetProp(props, propNum, strongConfig.m_astAttrList[i].m_ucPropId, strongConfig.m_astAttrList[i].m_iPropValue);
            }

            if (soulConfig != null) {
                for (let i = 0; i < soulConfig.m_astProp.length; i++) {
                    propNum = FightingStrengthUtil._mergePetProp(props, propNum, soulConfig.m_astProp[i].m_ucPropId, soulConfig.m_astProp[i].m_iPropValue);
                }
            }
        }


        //分别取出三个缘分属性，先算百分比加成nfenConfig(pet.m_iBeautyID, KeyWord.BEAUTY_FATE_TYPE_SQ, pet.m_astFateList[KeyWord.BEAUTY_FATE_TYPE_SQ - 1].m_iLevel));
        let yyConfig: GameConfig.HongYanFateConfigM;
        if (isOther) {
            yyConfig = PetData.getYuanfenConfig(otherPet.m_iBeautyID, KeyWord.BEAUTY_FATE_TYPE_KF, otherPet.m_astFateList[KeyWord.BEAUTY_FATE_TYPE_KF - 1].m_iLevel);
        }
        else {
            yyConfig = PetData.getYuanfenConfig(pet.m_iBeautyID, KeyWord.BEAUTY_FATE_TYPE_KF, pet.m_astFateList[KeyWord.BEAUTY_FATE_TYPE_KF - 1].m_iLevel);
        }
        let prop: GameConfig.BeautyFatePropAtt;

        if (yyConfig != null) {
            for (prop of yyConfig.m_astAttrList) {
                if (prop.m_ucPropId > 0 && prop.m_ucPercent > 0) {
                    propNum = FightingStrengthUtil._mergePetProp(props, propNum, prop.m_ucPropId, prop.m_iPropValue, true);
                }
            }
        }

        //再算不加成的
        if (yyConfig != null) {
            for (prop of yyConfig.m_astAttrList) {
                if (prop.m_ucPropId > 0 && prop.m_ucPercent == 0) {
                    propNum = FightingStrengthUtil._mergePetProp(props, propNum, prop.m_ucPropId, prop.m_iPropValue);
                }
            }
        }

        //最后算装备的
        let equipObject: { [position: number]: ThingItemData };
        let otherEquipList: Protocol.ContainerThing[];
        if (!isOther) {
            equipObject = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
        }
        else {
            otherEquipList = G.DataMgr.otherPlayerData.cacheRoleInfo.m_stBeautyContainerList.m_astThingInfo;
        }
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(isOther ? otherPet.m_iBeautyID : pet.m_iBeautyID);
        let pos: number = 0;
        let equipConfig: GameConfig.ThingConfigM;
        let equipData: Protocol.ContainerThingInfo;
        let suit: number = 0;
        let suitNum: number = 0;
        for (i = 0; i < Macros.BEAUTY_EQUIP_NUMBER; i++) {
            pos = config.m_uiEquipPosition + i;
            equipConfig = null;
            equipData = null;
            if (isOther) {
                for (let thing of otherEquipList) {
                    if (pos == thing.m_usPosition) {
                        equipConfig = ThingData.getThingConfig(thing.m_iThingID);
                        break;
                    }
                }
            }
            else if (equipObject != null && equipObject[pos] != null) {
                equipConfig = equipObject[pos].config;
                equipData = equipObject[pos].data;
            }

            if (equipConfig != null) {
                let basePropLen = equipConfig.m_astBaseProp.length;
                for (let j: number = 0; j < basePropLen; j++) {
                    propNum = FightingStrengthUtil._mergePetProp(props, propNum, equipConfig.m_astBaseProp[j].m_ucPropId, equipConfig.m_astBaseProp[j].m_ucPropValue);
                }
                let strengthConfig = G.DataMgr.equipStrengthenData.getEquipStrengthenConfigByPart(equipConfig.m_iEquipPart);
                let propLen = strengthConfig != null ? strengthConfig.m_astProp.length : 0;
                for (let j: number = 0; j < propLen; j++) {
                    propNum = FightingStrengthUtil._mergePetProp(props, propNum, strengthConfig.m_astProp[j].m_ucPropId, strengthConfig.m_astProp[j].m_ucPropValue);
                }

                //计算额外属性
                propNum = FightingStrengthUtil._mergePetProp(props, propNum, equipConfig.m_stExtProp.m_ucPropId, equipConfig.m_stExtProp.m_ucPropValue);

                if (equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_ARMET ||
                    equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_ARMOUR ||
                    equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BANGLE ||
                    equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_NECKLACE) {
                    suit = equipConfig.m_ucWYSuitID;
                }
            }

            if (equipData != null && null != equipData.m_stThingProperty.m_stSpecThingProperty) {
                let randAttr: Protocol.RandAttrInfo = equipData.m_stThingProperty.m_stSpecThingProperty.m_stZhuFuEquipInfo.m_stRandAttr;
                for (let j: number = 0; j < randAttr.m_ucNum; j++) {
                    propNum = FightingStrengthUtil._mergePetProp(props, propNum, EquipStrengthenData.getKeyWordByEuai(randAttr.m_aiPropAtt[j].m_ucPropId), randAttr.m_aiPropAtt[j].m_iPropValue);
                }
            }
        }

        if (suit > 0 && pet != null) {
            let has: number = G.DataMgr.thingData.getWearingPetSuitNum(pet.m_iBeautyID, suit);
            if (has > 0) {
                let suitConfig: GameConfig.BeautySuitPropM = G.DataMgr.equipStrengthenData.getPetEquipSuitConfig(suit);
                for (i = 0; i < has; i++) {
                    propNum = FightingStrengthUtil._mergePetProp(props, propNum, suitConfig.m_astPropAtt[i].m_ucPropId, suitConfig.m_astPropAtt[i].m_ucPropValue);
                }
            }
        }



        //后面的要清空
        for (i = propNum; i < props.length; i++) {
            props[i].m_ucPropId = props[i].m_iPropValue = 0;
        }

        return props;
    }

    private static _mergePetProp(props: GameConfig.BeautyPropAtt[], propNum: number, prop: number, value: number, isRate: boolean = false): number {
        if (prop == 0 || prop == undefined) {
            return propNum;
        }

        let isUsed: boolean = false;
        for (let j: number = 0; j < propNum; j++) {
            if (props[j].m_ucPropId == prop) {
                if (isRate) {
                    props[j].m_iPropValue += Math.floor(props[j].m_iPropValue * value / 100);
                }
                else {
                    props[j].m_iPropValue += value;
                }
                isUsed = true;
                break;
            }
        }

        if (!isUsed && !isRate) {
            if (propNum >= props.length) {
                props.push({} as GameConfig.BeautyPropAtt);
            }

            props[propNum].m_ucPropId = prop;
            props[propNum].m_iPropValue = value;
            propNum++;
        }

        return propNum;
    }
    /**
     * 计算散仙战斗力
     * @param pet
     * @return
     *
     */
    static calPetFight(attrList: GameConfig.BeautyPropAtt[]): number {
        let fight: number = 0;

        for (let prop of attrList) {
            let oneFight: number = FightingStrengthUtil.calStrengthByOneProp(prop.m_ucPropId, prop.m_iPropValue);
            fight += oneFight;
        }

        return fight;
    }


    /**
    * 计算圣器战斗力
    * @param pet
    * @return
    *
    */
    static calFaBaoFight(attrList: GameConfig.FaBaoLayerAttr[]): number {
        let fight: number = 0;

        for (let prop of attrList) {
            let oneFight: number = FightingStrengthUtil.calStrengthByOneProp(prop.m_ucPropName, prop.m_iPropValue);
            fight += oneFight;
        }

        return fight;
    }
}
