import { Global as G } from 'System/global'
import { EnumBuff, EnumTargetValidation } from 'System/constants/GameEnum'
import { BuffData } from 'System/data/BuffData'
import { Macros } from 'System/protocol/Macros'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { ThingData } from 'System/data/thing/ThingData'
import { ZhufuData } from 'System/data/ZhufuData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { PetData } from 'System/data/pet/PetData'
import { Color } from 'System/utils/ColorUtil'
import { Constants } from 'System/constants/Constants'

/**
 * 技能数据集合。
 */
export class SkillData {
    /**用m_profSkills管理的类型*/
    private static readonly ProfTypesCtn = [KeyWord.SKILL_BRANCH_ROLE_NQ, KeyWord.SKILL_BRANCH_ROLE_ZY, KeyWord.SKILL_BRANCH_ROLE_FETTER];

    static idDict: { [id: number]: GameConfig.SkillConfigM } = {};
    static finalIdMap: { [id: number]: number } = {};

    static validationDescMap: { [v: number]: string } = {};

    /**检查某技能是否具备某效果的缓存*/
    static checkEffectCache: { [key: string]: boolean } = {};

    /**
     * 
     * 记录了某个职业的所有技能，同类型的的技能只记录当前学过的一个，会记录每个技能是否已经学习
     * 这份表是在实时变化的，当技能升级后会更新对应的技能族
     */
    private m_profSkills: { [prof: number]: { [branchID: number]: GameConfig.SkillConfigM[] } } = {};
    /**技能段id - 技能槽位（从0开始）*/
    private shortId2Position: { [shortId: number]: number } = {};

    /**所有被动技能*/
    private m_passiveSKills: GameConfig.SkillConfigM[] = [];

    /**所有宝物技能*/
    private m_faqiSKills: GameConfig.SkillConfigM[] = [];

    /** 九星技能 */
    private m_jiuxingSKills: GameConfig.SkillConfigM[] = [];

    /**宗门技能*/
    private m_guildSKills: GameConfig.SkillConfigM[] = [];


    /**转生技能*/
    private m_rebirthSKills: GameConfig.SkillConfigM[] = [];

    /**
     * 技能类型_主动（类型） + 技能_主动（系别），比如跳跃技能。
     */
    private m_otherActiveSkills: GameConfig.SkillConfigM[] = [];

    /**出生技能，即无职业要求且学习等级为1的普通攻击*/
    private bornSkill: GameConfig.SkillConfigM;

    private experSkillCfgs: GameConfig.SkillConfigM[] = [];

    /**当前职业的普通攻击*/
    private m_normalSkill: { [prof: number]: GameConfig.SkillConfigM[] } = {};

    /**法则信息*/
    private m_fazeInfo: { [fazeType: number]: Protocol.FaZeOneData };

    /**法则配置*/
    private m_fazeConfig: { [job: number]: { [type: number]: { [level: number]: GameConfig.FaZeConfigM } } };

    /**系列对应已学id*/
    private serialMap: { [serialId: number]: number } = {};

    /**最小施法距离*/
    private minCastDistance = 1000;

    static MAX_FAZE_LEVEL: number = 10;

    static MAX_FAZE_TYPE: number = 7;

    isHasGetXueMaiSkill: boolean = false;

    ////////////////////// 羁绊技能 //////////////////////

    private static jiBanCfgMap: { [prof: number]: { [pos: number]: GameConfig.SkillFetterCfgM[] } } = {};
    private static id2JiBanCfg: { [skillId: number]: GameConfig.SkillFetterCfgM } = {};
    private skillSet: Protocol.SkillFetterSet;

    constructor() {
        this.m_normalSkill[KeyWord.PROFTYPE_NONE] = [];
        this.m_normalSkill[KeyWord.PROFTYPE_HUNTER] = [];
        this.m_normalSkill[KeyWord.PROFTYPE_WARRIOR] = [];
        this.m_normalSkill[KeyWord.PROFTYPE_WIZARD] = [];
    }

    onCfgReady(): void {
        SkillData.validationDescMap[EnumTargetValidation.noTarget] = '未选择目标';
        SkillData.validationDescMap[EnumTargetValidation.invalidTarget] = '无法攻击该目标';
        SkillData.validationDescMap[EnumTargetValidation.deadTarget] = '无法攻击该目标';
        SkillData.validationDescMap[EnumTargetValidation.safty] = '不能攻击安全区中的目标';

        let dataList = G.Cfgmgr.getCfg<GameConfig.SkillConfigM>('data/SkillConfigM.json');

        // 更新下一级技能
        for (let config of dataList) {
            if (config.m_iSkillID > 0) {
                SkillData.idDict[config.m_iSkillID] = config;
            }
        }

        for (let config of dataList) {

            if (config.m_iSkillID <= 0) {
                continue;
            }
            if (0 != config.m_iNextLevelID && undefined != config.m_iNextLevelID) {
                config.nextLevel = SkillData.idDict[config.m_iNextLevelID];
            }
            if (SkillData.isBornSkill(config.m_iSkillID)) {
                // 如果该技能学习等级为1，且没有职业要求，则说明是出生技能，用于普通攻击，优先级垫后
                this.bornSkill = config;
            } else if (SkillData.isNormalSkill(config)) {
                // 如果该技能有职业要求，且不可升级，则说明是该职业的普通攻击，优先级高于出生技能
                this.m_normalSkill[config.m_ucRequireProf].push(config);
            }
            if (config.m_iSkillID == Macros.PROF_TYPE_WARRIOR_VIP_SKILL_ID || config.m_iSkillID == Macros.PROF_TYPE_HUNTER_VIP_SKILL_ID) {
                //vip体验技能
                this.experSkillCfgs.push(config);
            }
            if (KeyWord.SKILL_BRANCH_WYYZ == config.m_ucSkillBranch) {
                config.m_ushSkillLevel = 0;
            }

            let branchDict = this.getSkillBranchArr(config);
            if (null != branchDict && config.m_iRequiredSkillID == 0)//不需要前置的技能，也就是每个技能类型中等级最低的技能
            {
                branchDict.push(config);
            }

            // 预处理，提取出跳跃距离
            for (let i: number = config.m_iEffectNumber - 1; i >= 0; i--) {
                if (!config.m_astSkillEffect[i]) {
                    config.m_astSkillEffect.splice(i, 1);
                    uts.logError('技能效果数量错误：' + config.m_iSkillID);
                    continue;
                }
                if (KeyWord.SKILL_EFFECT_POSITION == config.m_astSkillEffect[i].m_iEffectObj ||
                    KeyWord.SKILL_EFFECT_RUSH == config.m_astSkillEffect[i].m_iEffectObj ||
                    KeyWord.SKILL_EFFECT_BLINK == config.m_astSkillEffect[i].m_iEffectObj ||
                    KeyWord.SKILL_EFFECT_JUMPCAST == config.m_astSkillEffect[i].m_iEffectObj) {
                    // 给予20像素的距离保护差值，后台实际上也补偿了20像素
                    config.jumpDistance = config.m_astSkillEffect[i].m_iEffectValue - 20;
                    config.specMovieAction = config.m_astSkillEffect[i].m_iEffectObj;
                    break;
                }
            }
        }

        // 根据游戏的设计，每个职业只有3个普通攻击
        //uts.assert(this.m_normalSkill[KeyWord.PROFTYPE_HUNTER].length == 3);
        //uts.assert(this.m_normalSkill[KeyWord.PROFTYPE_WARRIOR].length == 3);
        //uts.assert(this.m_normalSkill[KeyWord.PROFTYPE_WIZARD].length == 3);

        let jiBanCfgs = G.Cfgmgr.getCfg<GameConfig.SkillFetterCfgM>('data/SkillFetterCfgM.json');
        for (let cfg of jiBanCfgs) {
            SkillData.id2JiBanCfg[cfg.m_iID] = cfg;
            let skillCfg = SkillData.getSkillConfig(cfg.m_iID);
            let profMap = SkillData.jiBanCfgMap[skillCfg.m_ucRequireProf];
            if (null == profMap) {
                SkillData.jiBanCfgMap[skillCfg.m_ucRequireProf] = profMap = {};
            }
            let arr = profMap[cfg.m_ucSkillPart];
            if (null == arr) {
                profMap[cfg.m_ucSkillPart] = arr = [];
            }
            arr.push(cfg);
        }

        for (let profKey in this.m_profSkills) {
            let skills = this.m_profSkills[profKey][KeyWord.SKILL_BRANCH_ROLE_ZY];
            let len = skills.length;
            for (let i = 0; i < len; i++) {
                this.shortId2Position[Math.floor(skills[i].m_iSkillID / 100)] = i;
            }
        }
    }

    private getSkillBranchArr(config: GameConfig.SkillConfigM): GameConfig.SkillConfigM[] {
        let branchArr: GameConfig.SkillConfigM[];
        if (SkillData.ProfTypesCtn.indexOf(config.m_ucSkillBranch) >= 0) {
            //根据职业建立索引
            let profDict = this.m_profSkills[config.m_ucRequireProf];
            if (null == profDict) {
                this.m_profSkills[config.m_ucRequireProf] = profDict = {};
            }

            branchArr = profDict[config.m_ucSkillBranch];
            if (null == branchArr) {
                //根据技能类型建立数组：  主动，被动 等等
                profDict[config.m_ucSkillBranch] = branchArr = new Array<GameConfig.SkillConfigM>();
            }
        }
        else if (config.m_ucSkillBranch == KeyWord.SKILL_BRANCH_ACTIVE) {
            branchArr = this.m_otherActiveSkills;
        }
        else if (config.m_ucSkillBranch == KeyWord.SKILL_BRANCH_ROLE_BD) {
            branchArr = this.m_passiveSKills;
        }
        else if (config.m_ucSkillBranch == KeyWord.SKILL_BRANCH_HUNGU) {
            branchArr = this.m_rebirthSKills;
        }
        else if (config.m_ucSkillBranch == KeyWord.SKILL_BRANCH_FAQI) {
            branchArr = this.m_faqiSKills;
        }
        else if (config.m_ucSkillBranch == KeyWord.SKILL_BRANCH_JIUXING) {
            branchArr = this.m_jiuxingSKills;
        }
        else if (config.m_ucSkillBranch == KeyWord.SKILL_BRANCH_GUILD) {
            branchArr = this.m_guildSKills;
        }
        return branchArr;
    }

    getExperSkillConfig(prof: number): GameConfig.SkillConfigM {
        for (let i = 0; i < this.experSkillCfgs.length; i++) {
            if (this.experSkillCfgs[i].m_ucRequireProf == prof) {
                return this.experSkillCfgs[i];
            }
        }
    }

    static getSkillConfig(id: number): GameConfig.SkillConfigM {
        return SkillData.idDict[id];
    }

    static getJiBanConfig(id: number): GameConfig.SkillFetterCfgM {
        return SkillData.id2JiBanCfg[id];
    }

    static getJiBanSkills(prof: number, part: number): GameConfig.SkillFetterCfgM[] {
        let profMap = SkillData.jiBanCfgMap[prof];
        if (null != profMap) {
            return profMap[part];
        }
        return null;
    }

    static getValidationDesc(v: EnumTargetValidation): string {
        return SkillData.validationDescMap[v];
    }

    /**
	* 判断当前怒气值是否足够用来释放技能。
	* @param skill 技能配置。
	* @return 若怒气值不足则返回<CODE>true</CODE>，否则返回<CODE>false</CODE>。
	* 
	*/
    static isOutOfMP(skillConf: GameConfig.SkillConfigM): boolean {
        if (SkillData.isPetNuQiSkill(skillConf)) {
            let petCtrl = G.UnitMgr.hero.pet;
            if (petCtrl == null || petCtrl.Data.getProperty(Macros.EUAI_RAGE) < skillConf.m_stConsumable[0].m_iConsumeValue) {
                return true;
            }
            return false;
        }

        let heroData = G.DataMgr.heroData;
        for (let i: number = 0; i < skillConf.m_iConsumableNumber; i++) {
            let consumable = skillConf.m_stConsumable[i];
            if (KeyWord.SKILL_CONSUMABLE_TYPE_RAGE == consumable.m_iConsumeID) {
                return heroData.getProperty(Macros.EUAI_RAGE) < consumable.m_iConsumeValue;
            } else if (KeyWord.SKILL_CONSUMABLE_TYPE_BLOOD == consumable.m_iConsumeID) {
                return heroData.getProperty(Macros.EUAI_BLOOD) < consumable.m_iConsumeValue;
            }
        }
        return false;
    }

    processSkills(): void {
        let skillConfig: GameConfig.SkillConfigM;
        let buffConfig: GameConfig.BuffConfigM;
        let effectCfg: GameConfig.SkillEffectM;
        let buffEff: GameConfig.BuffEffect;
        let buffSkill: GameConfig.SkillConfigM;
        let buffRange: number = 0;
        let bestDis: number = 0;
        for (let idKey in SkillData.idDict) {
            skillConfig = SkillData.idDict[idKey];

            if (KeyWord.SKILL_ACTIVE_TYPE != skillConfig.m_ucSkillType || 0 == skillConfig.m_ucRequireProf) {
                // 只处理主动技能
                continue;
            }

            // 计算起始学习等级
            skillConfig.m_stSkillStudy.openLv = SkillData.getFirstSkill(skillConfig).m_stSkillStudy.m_iStudyLevel;

            bestDis = 0;
            // 计算技能的推荐距离，根据效果范围计算
            for (effectCfg of skillConfig.m_astSkillEffect) {
                // 技能效果类型是附加状态的
                if (KeyWord.SKILL_EFFECT_BUFF == effectCfg.m_iEffectObj) {
                    buffConfig = BuffData.getBuffByID(effectCfg.m_iEffectValue);
                    if (Math.floor(EnumBuff.XUANFENGZHAN / 100) == Math.floor(buffConfig.m_uiBuffID / 100)) {
                        // 这几个大招距离近一些
                        bestDis = 50;
                    }
                    else {
                        for (buffEff of buffConfig.m_astBuffEffect) {
                            // Buff类型是调用技能的
                            if (KeyWord.BUFF_EFFECT_CASTSKILL == buffEff.m_iBuffEffectType) {
                                buffSkill = SkillData.idDict[buffEff.m_iBuffEffectValue];
                                buffRange = buffSkill.m_stSkillCastArea.m_uiEffectRange;
                                if (0 == bestDis || buffRange < bestDis) {
                                    // 取最近的距离
                                    bestDis = buffSkill.m_stSkillCastArea.m_uiEffectRange;
                                }
                            }
                        }
                    }
                }
            }

            skillConfig.m_stSkillCastArea.bestDis = bestDis;
        }
    }

    /**
     * 获取指定技能的施放距离。
     * @param skillConfig
     * @return 
     * 
     */
    static getCastDistance(skillConfig: GameConfig.SkillConfigM): number {
        let castDis: number = 0;
        if (skillConfig.jumpDistance > 0) {
            // 跳跃技能直接使用跳跃距离
            castDis = skillConfig.jumpDistance;
        }
        else {
            // 其他距离则取施法距离和最佳距离中的最小者
            if (skillConfig.m_stSkillCastArea.m_iCastDistance > 0 && skillConfig.m_stSkillCastArea.bestDis > 0) {
                castDis = Math.min(skillConfig.m_stSkillCastArea.m_iCastDistance, skillConfig.m_stSkillCastArea.bestDis);
            }
            else {
                castDis = skillConfig.m_stSkillCastArea.m_iCastDistance > 0 ? skillConfig.m_stSkillCastArea.m_iCastDistance : skillConfig.m_stSkillCastArea.bestDis;
            }
        }

        return castDis;
    }

    static getFirstSkill(config: GameConfig.SkillConfigM): GameConfig.SkillConfigM {
        let preConfig: GameConfig.SkillConfigM;
        if (SkillData._isFirstSKill(config)) {
            preConfig = config;
        } else {
            preConfig = SkillData.idDict[config.m_iSkillID - config.m_ushSkillLevel + 1];
        }

        return preConfig;
    }

    static getLastSkill(id: number): GameConfig.SkillConfigM {
        let fid = SkillData.finalIdMap[id];
        if (undefined != fid) {
            return this.getSkillConfig(fid);
        }

        let config: GameConfig.SkillConfigM = this.getSkillConfig(id);
        config = SkillData.getFirstSkill(config);

        let nextCfg: GameConfig.SkillConfigM = SkillData.idDict[config.m_iNextLevelID];
        while (nextCfg != null && nextCfg.m_iNextLevelID != 0) {
            nextCfg = SkillData.idDict[nextCfg.m_iNextLevelID];
        }

        SkillData.finalIdMap[id] = nextCfg.m_iSkillID;

        return nextCfg;
    }

    /**
     * 此接口将废弃，用getStudiedSkillBySerial代替。因凡仙和人鱼不同步，暂且留着
     * @param id
     */
    static getLastStudySkill(id: number): number {
        let cfg: GameConfig.SkillConfigM = SkillData.getLastSkill(id);

        while (cfg != null && !cfg.completed) {
            cfg = SkillData.idDict[cfg.m_iRequiredSkillID];
        }

        if (cfg == null) {
            return 0;
        }

        return cfg.m_iSkillID;
    }

    /**
     * 判断该技能是否为该技能族中的第一个技能
     * @param skillConfig
     * @return 
     * 
     */
    private static _isFirstSKill(skillConfig: GameConfig.SkillConfigM): boolean {
        return skillConfig.m_iRequiredSkillID == 0;
    }

    /**
     * 判断两个技能是不是属于同一个类别 
     * @param skillIDA
     * @param skillIDB
     * @return 
     * 
     */
    static isSameClassSkill(skillIDA: number, skillIDB: number): boolean {
        return this.getSerial(skillIDA) == this.getSerial(skillIDB);
    }

    static getSerial(skillID: number): number {
        return Math.floor((skillID - 1) / 100);
    }

    static isZhiyeSkill(skillId: number): boolean {
        let skill: GameConfig.SkillConfigM = SkillData.idDict[skillId];

        if (skill == null) {
            return false;
        }

        return (KeyWord.SKILL_BRANCH_ROLE_ZY == skill.m_ucSkillBranch || KeyWord.SKILL_BRANCH_ROLE_NQ == skill.m_ucSkillBranch || KeyWord.SKILL_BRANCH_ROLE_BD == skill.m_ucSkillBranch);
    }

    /**
     * 指定技能是否具备某种效果。
     * @param skillId
     * @param effect
     */
    static hasBuffEffect(skillId: number, effect: number): boolean {
        let key = skillId + '|' + effect;
        let result = this.checkEffectCache[key];
        if (undefined != result) {
            return result;
        }

        result = false;
        let skill: GameConfig.SkillConfigM = SkillData.idDict[skillId];
        if (skill) {
            for (let e of skill.m_astSkillEffect) {
                if (KeyWord.SKILL_EFFECT_CLEANDEBUFF == e.m_iEffectObj) {
                    result = true;
                    break;
                }
            }
        }

        this.checkEffectCache[key] = result;
        return result;
    }

    static isActiveSkill(skillId: number): boolean {
        let skill: GameConfig.SkillConfigM = SkillData.idDict[skillId];
        if (skill == null) {
            return false;
        }

        return (KeyWord.SKILL_ACTIVE_TYPE == skill.m_ucSkillType);
    }

    /**
    * 是否是角色职业技能
    * @param skillId
    */
    static isProfessNotSkillUp(skillId: number): boolean {
        let skill: GameConfig.SkillConfigM = SkillData.idDict[skillId];
        if (skill == null) {
            return false;
        }
        return skill.m_ucSkillBranch == KeyWord.SKILL_BRANCH_ROLE_ZY;
    }

    /**
     * 是否是角色可用物品提升技能
     * @param skillId
     */
    static isProfessCanSkillUp(skillId: number): boolean {
        let skill: GameConfig.SkillConfigM = SkillData.idDict[skillId];
        if (skill == null) {
            return false;
        }
        return skill.m_ucSkillBranch == KeyWord.SKILL_BRANCH_ROLE_NQ || skill.m_ucSkillBranch == KeyWord.SKILL_BRANCH_ROLE_BD || skill.m_ucSkillBranch == KeyWord.SKILL_BRANCH_XM;
    }

    /**
     *判断技能是否为被动技能
     * @param SkillId
     * @return 
     * 
     */
    static isPassiveSkill(skillId: number): boolean {
        let skill: GameConfig.SkillConfigM = SkillData.idDict[skillId];

        if (skill == null) {
            return false;
        }
        return skill.m_ucSkillType == KeyWord.SKILL_PASSIVE_TYPE;
    }

    /**
     * 根据技能效果获取对应的属性ID。
     * @param effectID
     * @return 
     * 
     */
    static getPropertyBySkillEffect(effectID: number): number {
        let propertyID: number = 0;
        if (KeyWord.SKILL_EFFECT_PASSIVE_PHYSIC_ATTACK == effectID) {
            propertyID = KeyWord.EQUIP_PROP_PHYSIC_ATTACK;
        }
        else if (KeyWord.SKILL_EFFECT_PASSIVE_MAGIC_ATTACK == effectID) {
            propertyID = KeyWord.EQUIP_PROP_MAGIC_ATTACK;
        }
        else if (KeyWord.SKILL_EFFECT_PASSIVE_CRITICAL == effectID) {
            propertyID = KeyWord.EQUIP_PROP_CRITICAL;
        }
        else if (KeyWord.SKILL_EFFECT_PASSIVE_DEFENSE == effectID) {
            propertyID = KeyWord.EQUIP_PROP_DEFENSE;
        }
        else if (KeyWord.SKILL_EFFECT_PASSIVE_GOAL == effectID) {
            propertyID = KeyWord.EQUIP_PROP_GOAL;
        }
        else if (KeyWord.SKILL_EFFECT_PASSIVE_DODGE == effectID) {
            propertyID = KeyWord.EQUIP_PROP_DODGE;
        }
        else if (KeyWord.SKILL_EFFECT_PASSIVE_TOUGHNESS == effectID) {
            propertyID = KeyWord.EQUIP_PROP_TOUGHNESS;
        }
        else if (KeyWord.SKILL_EFFECT_PASSIVE_HP == effectID) {
            propertyID = KeyWord.EQUIP_PROP_HP;
        }
        else if (KeyWord.SKILL_EFFECT_PASSIVE_MAGICRESIST == effectID) {
            propertyID = KeyWord.EQUIP_PROP_MAGICRESIST;
        }
        else if (KeyWord.SKILL_EFFECT_PASSIVE_HURT == effectID) {
            propertyID = KeyWord.EQUIP_PROP_HURT_EXTRA;
        }
        else if (KeyWord.SKILL_EFFECT_INCREASE == effectID ||
            KeyWord.SKILL_EFFECT_PASSIVE_ATK_SELF_BUFF == effectID ||
            KeyWord.SKILL_EFFECT_PASSIVE_DEAD_SELF_BUFF == effectID ||
            KeyWord.SKILL_EFFECT_PASSIVE_ATK_TARGET_BUFF == effectID ||
            KeyWord.SKILL_EFFECT_REBOUND == effectID ||
            KeyWord.SKILL_EFFECT_DE_DZ_CD == effectID ||
            KeyWord.SKILL_EFFECT_DE_KZ_CD == effectID) {
            propertyID = 0;
        }
        else if (GameIDUtil.isPassiveSkillEffect(effectID)) {
            if (defines.has('_DEBUG')) { uts.assert(false, '无法找到技能效果' + effectID + '对应的属性'); }
        }

        return propertyID;
    }

    /**
     * 获取指定技能的战斗力。
     * @param skillConfig
     * @return 
     * 
     */
    static getZdlBySkill(skillConfig: GameConfig.SkillConfigM): number {
        if (SkillData.isActiveSkill(skillConfig.m_iSkillID)) {
            return skillConfig.m_iBattleEffect;
        }
        else if (SkillData.isPassiveSkill(skillConfig.m_iSkillID)) {
            //有填的就显示策划填的
            if (skillConfig.m_iBattleEffect > 0) {
                return skillConfig.m_iBattleEffect;
            }

            let effect: GameConfig.SkillEffectM;
            let result: number = 0;
            for (let i: number = skillConfig.m_iEffectNumber - 1; i >= 0; i--) {
                effect = skillConfig.m_astSkillEffect[i];
                result += FightingStrengthUtil.calStrengthByOneProp(SkillData.getPropertyBySkillEffect(effect.m_iEffectObj), effect.m_iEffectValue);
            }
            return result;
        }

        return 0;
    }

    static canStudyOrUpgrade(skill: GameConfig.SkillConfigM, needPrompMsg: boolean = true): boolean {
        if (skill.completed) {
            if (0 != skill.m_iNextLevelID) {
                if (SkillData.canStudySkill(skill.m_iNextLevelID, false)) {
                    return true;
                }
            }
        }
        else {
            if (SkillData.canStudySkill(skill.m_iSkillID, false)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检索最小等级
     * @param skills
     */
    static canStudyMinLevel(skills: GameConfig.SkillConfigM[]): number {
        //0-3自动升级 4黄金VIP进  5-9被动技能
        let len = skills.length;
        let minIndex = -1;
        let minSkill: GameConfig.SkillConfigM = null;
        for (let i = 5; i < len; i++) {
            let skill = skills[i];
            if (skill.completed) {
                if (0 != skill.m_iNextLevelID) {
                    if (SkillData.canStudySkill(skill.m_iNextLevelID, false)) {
                        if (minSkill == null) {
                            minSkill = skills[i];
                            minIndex = i;
                        }
                        if (minSkill.m_ushSkillLevel > skill.m_ushSkillLevel) {
                            minSkill = skill;
                            minIndex = i;
                        }
                    }
                }
            }
            else {
                if (SkillData.canStudySkill(skill.m_iSkillID, false)) {
                    return i;
                }
            }
        }
        return minIndex;
    }

    /**
     * 查询指定的技能ID是否可以学习。
     * @param skillId
     * @return 
     * 
     */
    static canStudySkill(skillID: number, needPrompMsg: boolean = true): boolean {
        if (skillID == 0 || undefined == skillID) {
            if (needPrompMsg) {
                G.TipMgr.addMainFloatTip('该技能无法继续升级');
            }
            return false;
        }
        let skillConfig: GameConfig.SkillConfigM = SkillData.getSkillConfig(skillID);
        if (skillConfig == null) {
            return false;
        }

        if (SkillData.isPetNuQiSkill(skillConfig)) {
            // 伙伴怒气技能使用缘分进行判断
            let yuanfenCfg = PetData.getYuanFenCfgByNuQiSkillId(skillID);
            if (yuanfenCfg == null) {
                return false;
            }
            else {

                let petInfo = G.DataMgr.petData.getPetInfo(yuanfenCfg.m_iID);
                if (null == petInfo || petInfo.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET) {
                    return false;
                }
                return SkillData._studyConditionOK(0, yuanfenCfg.m_iCondition, yuanfenCfg.m_iConditionValue, needPrompMsg);
            }
        } else if (KeyWord.SKILL_BRANCH_ROLE_FETTER == skillConfig.m_ucSkillBranch && 1 == skillConfig.m_ushSkillLevel) {
            // 羁绊技能需要伙伴解锁
            let jiBanCfg = this.getJiBanConfig(skillConfig.m_iSkillID);
            let petData = G.DataMgr.petData;
            for (let i = 0; i < jiBanCfg.m_iPosCnt; i++) {
                let p = jiBanCfg.m_astPosInfo[i];
                let petInfo = G.DataMgr.petData.getPetInfo(p.m_iBeautyID);
                if (null == petInfo || petInfo.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET || petInfo.m_uiStage < p.m_iBeautyLv) {
                    return false;
                }
            }
            return true;
        } else if (skillConfig.m_ucSkillBranch == KeyWord.SKILL_BRANCH_GUILD) {
            let guildData = G.DataMgr.skillData.getGuildSkills();
            let curSkillLevel = skillConfig.m_ushSkillLevel;
            let minLevel = guildData[0].m_ushSkillLevel;
            let GuildSkillMaxMinGap = 0;
            let hasSkillNotcompleted = false;
            for (let cfg of guildData) {
                if (cfg.m_ushSkillLevel < minLevel) {
                    minLevel = cfg.m_ushSkillLevel;
                }

                if (cfg.completed == 0) {
                    hasSkillNotcompleted = true;
                }
            }

            if (hasSkillNotcompleted) {
                GuildSkillMaxMinGap = Constants.GuildSkillMaxMinGap - 1;
            }
            else {
                GuildSkillMaxMinGap = Constants.GuildSkillMaxMinGap;
            }
            let studyCondition: GameConfig.SkillStudy = skillConfig.m_stSkillStudy;
            return SkillData._studyConditionOK(0, studyCondition.m_iStudyItem, studyCondition.m_iStudyItemNum, needPrompMsg)
                && (curSkillLevel - minLevel <= GuildSkillMaxMinGap ? true : false);

        } else {
            let studyCondition: GameConfig.SkillStudy;
            if (skillConfig != null) {
                studyCondition = skillConfig.m_stSkillStudy;
            } else {
                return false;
            }
            return SkillData._studyConditionOK(studyCondition.m_iStudyLevel, studyCondition.m_iStudyItem, studyCondition.m_iStudyItemNum, needPrompMsg);
        }
    }

    /**
     * 技能升级各种条件判断 
     * @param level   等级
     * @param money   贝
     * @param exp     经验
     * @param needItem  所需要的物品ID
     * @param needItemNum   所需要的物品数量
     * @param needPrompMsg
     * @return 
     * 
     */
    private static _studyConditionOK(level: number, needItem: number = 0, needItemNum: number = 0, needPrompMsg: boolean = true): boolean {
        //验证等级
        let curLevel: number = G.DataMgr.heroData.level;
        if (curLevel < level) {
            if (needPrompMsg) {
                G.TipMgr.addMainFloatTip(uts.format('您的等级不足{0}级', level));
            }
            return false;
        }
        //需要技能学习物品
        if (0 != needItem && needItemNum > 0) {
            let studyItemNum: number = 0;
            let thingName: string = '';
            if (GameIDUtil.isThingID(needItem)) {
                // 检查物品
                studyItemNum = G.DataMgr.thingData.getThingNum(needItem, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                let thingCfg = ThingData.getThingConfig(needItem);
                if (thingCfg != null) {
                    thingName = ThingData.getThingConfig(needItem).m_szName;
                } else {
                    thingName = "";
                }
            }
            else {
                if (needItem == KeyWord.GUILD_CONTRIBUTE_ID) {
                    //查询宗门贡献度
                    studyItemNum = G.DataMgr.heroData.guildDonateCur;
                    thingName = TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, needItem), Color.getCurrencyColor(needItem))
                }
                if (needItem == KeyWord.MONEY_TONGQIAN_ID) {
                    //魂币
                    studyItemNum = G.DataMgr.heroData.tongqian;
                    thingName = TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, needItem), Color.getCurrencyColor(needItem))
                }
            }

            if (studyItemNum < needItemNum) {
                if (needPrompMsg) {
                    G.TipMgr.addMainFloatTip(uts.format('{0}不足({1}/{2})', thingName,
                        TextFieldUtil.getColorText(studyItemNum.toString(), Color.RED), needItemNum));
                }
                return false;
            }
        }
        return true;
    }

    /**
     * 是否出生技能
     * @param id
     */
    static isBornSkill(id: number) {
        let config = SkillData.getSkillConfig(id);
        return null != config && KeyWord.PROFTYPE_NONE == config.m_ucRequireProf && 1 == config.m_stSkillStudy.m_iStudyLevel;
    }

    /**
     * 是否普攻
     * @param id
     */
    static isNormalSkill(skillCfg: GameConfig.SkillConfigM): boolean {
        return skillCfg.m_ucRequireProf > 0 && 0 == skillCfg.m_iNextLevelID && 1 == skillCfg.m_ushSkillLevel;
    }

    static isPetSkill(skillCfg: GameConfig.SkillConfigM): boolean {
        if (skillCfg == null) return false;
        return skillCfg.m_ucSkillBranch == KeyWord.SKILL_BRANCH_BEAUTY;
    }

    static isGuildSkill(skillCfg: GameConfig.SkillConfigM): boolean {
        if (skillCfg == null) return false;
        return skillCfg.m_ucSkillBranch == KeyWord.SKILL_BRANCH_GUILD;
    }

    static isPetNuQiSkill(skillCfg: GameConfig.SkillConfigM): boolean {
        if (skillCfg == null) {
            uts.log("@jackson:请检查怒气技能...");
            return false;
        }
        return PetData.getPetIdByNuQiSkillId(skillCfg.m_iSkillID) > 0;
    }

    /**
     * 是否是神力技能 
     * @param id
     * @return 
     * 
     */
    static isBloodSkill(id: number): boolean {
        let config: GameConfig.SkillConfigM = SkillData.getSkillConfig(id);
        return config.m_ucSkillBranch == KeyWord.SKILL_BRANCH_XM;
    }

    /**
     * 该技能能否升级 
     * @param id
     * @return 
     * 
     */
    static canSkillUp(id: number): boolean {
        let config: GameConfig.SkillConfigM = SkillData.getSkillConfig(id);
        if (!config) {
            return false;
        }
        if (config.completed && config.nextLevel != null && !config.nextLevel.completed) {
            return SkillData.canStudySkill(config.nextLevel.m_iSkillID, false);
        }
        return false;
    }

    /////////////////////////////////////////////////////// 以下是各类技能 ///////////////////////////////////////////////////////

    setFazeConfig(data: GameConfig.FaZeConfigM[]): void {
        this.m_fazeConfig = {};
        for (let config of data) {
            if (this.m_fazeConfig[config.m_ucJob] == null) {
                this.m_fazeConfig[config.m_ucJob] = {};
            }
            if (this.m_fazeConfig[config.m_ucJob][config.m_uiType] == null) {
                this.m_fazeConfig[config.m_ucJob][config.m_uiType] = {};
            }
            this.m_fazeConfig[config.m_ucJob][config.m_uiType][config.m_ushLevel] = config;
        }
    }

    getFazeConfig(prof: number, type: number, level: number): GameConfig.FaZeConfigM {
        return this.m_fazeConfig[prof][type][level];
    }

    setFazeData(info: Protocol.FaZeInfo): void {
        this.m_fazeInfo = {};
        for (let i: number = 0; i < info.m_ucNumber; i++) {
            this.m_fazeInfo[info.m_stFaZeDataList[i].m_uiFaZeType] = info.m_stFaZeDataList[i];
        }
    }

    getFazeDate(type: number): Protocol.FaZeOneData {
        return this.m_fazeInfo[type];
    }

    updateFazeDate(data: Protocol.FaZeOneData): void {
        this.m_fazeInfo[data.m_uiFaZeType] = data;
    }

    /**
     * 取得对应的技能收到的法则cd减免影响影响 
     * @param skillID
     * @return 
     * 
     */
    getSkillCdEffect(skillID: number): number {
        let prof: number = G.DataMgr.heroData.profession;

        if (prof == KeyWord.PROFTYPE_NONE) {
            return 0;
        }

        let config: GameConfig.FaZeConfigM;
        for (let fazeTypeKey in this.m_fazeInfo) {
            let faze = this.m_fazeInfo[fazeTypeKey];
            config = this.getFazeConfig(prof, faze.m_uiFaZeType, faze.m_uiFaZeLevel);
            if (config.m_iSkillID == Math.floor(skillID / 100)) {
                for (let eff of config.m_astAddSkillEffect) {
                    if (eff.m_iEffectType == KeyWord.SKILL_EFFECT_CUTDOWN_CD) {
                        return eff.m_iEffectValue;
                    }
                }
            }
        }

        return 0;
    }

    /**
     * 通过职业类型取得该职业对应的技能配置 
     * @param prof 职业类型
     * 
     */
    getSkillsByProf(prof: number): { [branchID: number]: GameConfig.SkillConfigM[] } {
        return this.m_profSkills[prof];
    }

    /**
     * 通过职业类型取得该职业对应的技能配置 
     * @param prof 职业类型
     * 
     */
    getActiveSkillsByProf(prof: number): GameConfig.SkillConfigM {
        return this.m_otherActiveSkills[prof];
    }

    getPassiveSkill(): GameConfig.SkillConfigM[] {
        return this.m_passiveSKills;
    }

    getRebirthSkill(): GameConfig.SkillConfigM[] {
        return this.m_rebirthSKills;
    }

    getGuildSkills(): GameConfig.SkillConfigM[] {
        return this.m_guildSKills;
    }

    /**获取出生技能*/
    getBornSkill(): GameConfig.SkillConfigM {
        return this.bornSkill;
    }

    /**
     * 获取职业专属普通攻击
     * @param prof
     */
    getNormalSkills(prof: number): GameConfig.SkillConfigM[] {
        return this.m_normalSkill[prof];
    }

    /**
     * 更新技能，在登录或者是学习了某个技能或者是转职更新当前角色的技能
     * @param skillList
     * @param isChangeProfession 是否转职。
     * 
     */
    updateGotSkills(skillList: Protocol.SkillList): void {
        let len: number = 0;
        let i: number = 0;

        len = skillList.m_ucNumber;
        for (i = len - 1; i >= 0; i--) {
            let skillInfo = skillList.m_stInfo[i];
            let cfg = SkillData.getSkillConfig(skillInfo.m_iSkillID);
            if (cfg == null) {
                // 兼顾已删除的技能老号容错
                skillList.m_stInfo.splice(i, 1);
                skillList.m_ucNumber--;
                continue;
            }
            this._setSkillStudied(skillInfo.m_iSkillID);
            cfg.progress = skillInfo.m_usProgress;
        }
    }

    /**
     * 更新羁绊技能设置
     * @param skillSet
     */
    updateSkillSet(skillSet: Protocol.SkillFetterSet) {
        this.skillSet = skillSet;
    }

    getJiBanSkillReplaced(skill: GameConfig.SkillConfigM): GameConfig.SkillConfigM {
        let position = this.getSkillPosition(skill.m_iSkillID);
        if (null != this.skillSet && position < this.skillSet.m_ucNum) {
            let jiBanId = this.skillSet.m_aiSkillId[position];
            if (jiBanId > 0) {
                return this.getStudiedSkillBySerial(jiBanId);
            }
        }
        return null;
    }

    /**
     * 获取指定角色职业主动技能id的槽位，从0开始。
     * @param skillId
     */
    getSkillPosition(skillId: number): number {
        return this.shortId2Position[Math.floor(skillId / 100)];
    }

    /**
     * 学习一个技能，需要更新当前类型技能的最新等级 
     * @param skillID
     * 
     */
    studySkill(skillID: number): void {
        this._setSkillStudied(skillID);
    }

    private _setSkillStudied(skillID: number): void {
        let config: GameConfig.SkillConfigM = SkillData.idDict[skillID];//当前id的技能配置
        if (config == null) {
            return;
        }

        this.serialMap[SkillData.getSerial(skillID)] = skillID;
        config.completed = 1;//表示已经学习
        if (config.m_stSkillCastArea.m_iCastDistance + config.m_stSkillCastArea.m_iFloatRange < this.minCastDistance) {
            this.minCastDistance = config.m_stSkillCastArea.m_iCastDistance + config.m_stSkillCastArea.m_iFloatRange;
        }

        let branchArr = this.getSkillBranchArr(config);
        if (branchArr) {
            this._trySetSkillStuied(skillID, branchArr)
        }
    }

    private _trySetSkillStuied(skillID: number, inSkills: GameConfig.SkillConfigM[]): boolean {
        let l: number = inSkills.length;
        for (let i: number = 0; i < l; i++) {
            if (inSkills[i].m_iSkillID != skillID && SkillData.isSameClassSkill(skillID, inSkills[i].m_iSkillID)) {
                inSkills[i].completed = 0;
                inSkills[i] = SkillData.idDict[skillID];
                return true;
            }
        }
        return false;
    }

    getStudiedSkillBySerial(skillID: number): GameConfig.SkillConfigM {
        // 查找这个系别的技能是否有学习过
        let id = this.serialMap[SkillData.getSerial(skillID)];
        if (undefined != id) {
            return SkillData.getSkillConfig(id);
        }
        return null;
    }

    /**
     * 得到某个具体职业的攻击范围
     * 取该职业普通攻击的施法距离 
     * @param prof
     * @return 
     * 
     */
    getAttackDis(prof: number): number {
        return (this.m_profSkills[prof][KeyWord.SKILL_BRANCH_ROLE_ZY][0] as GameConfig.SkillConfigM).m_stSkillCastArea.m_iCastDistance;
    }

    /**
     * 获取可以学习的技能。
     * @param num 数量，0表示获取所有。
     * @return 
     * 
     */
    getCanStudyOrUpgradeSkills(skillType: number, num: number = 0): number[] {
        let result: number[] = new Array<number>();

        let prof: number = G.DataMgr.heroData.profession;
        if (prof == KeyWord.PROFTYPE_NONE) {
            return result;
        }

        let skills: GameConfig.SkillConfigM[];
        if (skillType == KeyWord.SKILL_BRANCH_ROLE_BD) {
            skills = this.m_passiveSKills;
        } else if (skillType == KeyWord.SKILL_BRANCH_GUILD) {
            skills = this.m_guildSKills;
        }
        else {
            skills = this.m_profSkills[prof][skillType];
            for (let i = 0, count = skills.length; i < count; i++) {
                if (skills[i].m_iSkillID == Macros.PROF_TYPE_HUNTER_VIP_SKILL_ID || skills[i].m_iSkillID == Macros.PROF_TYPE_WARRIOR_VIP_SKILL_ID) {
                    skills.splice(i, 1);
                    break;
                }
            }
        }

        for (let skill of skills) {
            if (SkillData.canStudyOrUpgrade(skill, false)) {
                if (skill.completed) {
                    result.push(skill.m_iNextLevelID);
                } else {
                    result.push(skill.m_iSkillID);
                }
                if (num > 0 && result.length >= num) {
                    break;
                }
            }
        }

        return result;
    }

    canUpgradeRebirthSkill(): boolean {
        let skills = this.m_rebirthSKills;
        for (let skill of skills) {
            if (SkillData.canSkillUp(skill.m_iSkillID)) {
                return true;
            }
        }
        return false;
    }

    get MinCastDistance(): number {
        return this.minCastDistance;
    }


    /**获取神力技能*/
    getXmSkillConfig(): GameConfig.SkillConfigM {
        let data = G.DataMgr.zhufuData.xueMaiData;
        let skillConfig: GameConfig.SkillConfigM;
        if (data != null && data.m_ucStage > 0) {
            let config = ZhufuData.getXuemaiConfig(data.m_ucStage);
            skillConfig = SkillData.getSkillConfig(config.m_iActiveSkillID1);
        }
        if (skillConfig != null) {
            skillConfig.completed = 1;
            this.isHasGetXueMaiSkill = true;
        }
        else {
            skillConfig = {} as GameConfig.SkillConfigM;
            skillConfig.completed = 0;
        }
        return skillConfig;
    }


}