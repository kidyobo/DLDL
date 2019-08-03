import { Global as G } from 'System/global'
import { SkillData } from 'System/data/SkillData'
import { ThingData } from 'System/data/thing/ThingData'
import { KeyWord } from 'System/constants/KeyWord'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { Macros } from "System/protocol/Macros"
import { ZhufuData } from 'System/data/ZhufuData'

/**
* ...
* @author jesse
*/
export class JiuXingData {
    maxLevel: number = 0;
    private levelList: { [key: number]: GameConfig.JiuXingConfigM } = {};
    skillList = [];
    level: number = 1;
    activateSkills = [];
    activateLevels: { [key: number]: any } = {};
    /**祝福清空时间*/
    luckyQingKongTime: number = 0;
    /**现在的祝福值*/
    currentLuckyValue: number = 0;
    /**衰减的祝福值*/
    shuaiJianValue: number = 0;

    private m_faqiIdArr: number[];

    static stageLvs: number[] = [];

    /**祝福阶级*/
    m_ucLayer: number = 0;

    onCfgReady() {
        this.setCfgs();
    }


    updateSkillInfo(level: number): void {
        let skillId: number = 0;
        let cfg: GameConfig.JiuXingConfigM;
        for (let i: number = 1; i <= level; i++) {
            cfg = this.levelList[i];
            if (cfg != null) {
                skillId = cfg.m_uiSkillID;
            }
            if (skillId > 0 && this.activateSkills.indexOf(skillId) == -1) {
                this.activateSkills.push(skillId);
            }
        }
    }


    setCfgs(): void {
        let configs: GameConfig.JiuXingConfigM[] = G.Cfgmgr.getCfg('data/JiuXingConfigM.json') as GameConfig.JiuXingConfigM[];
        this.m_faqiIdArr = new Array<number>();
        let levelList: { [key: number]: GameConfig.JiuXingConfigM } = {};
        let maxLevel: number = 0;
        let skillList = [];
        let activateLevels = [];
        let cfg: GameConfig.JiuXingConfigM;
        for (cfg of configs) {
            JiuXingData.stageLvs.push(cfg.m_iID);
            levelList[cfg.m_iID] = cfg;
            maxLevel = Math.max(maxLevel, cfg.m_iID);
            if (this.m_faqiIdArr.indexOf(cfg.m_iID) == -1) {
                this.m_faqiIdArr.push(cfg.m_iID);
            }
        }
        for (let i: number = 1; i <= maxLevel; i++) {
            cfg = levelList[i];
            if (cfg != null) {
                if (cfg.m_uiSkillID > 0 && skillList.indexOf(cfg.m_uiSkillID) == -1) {
                    skillList.push(cfg.m_uiSkillID);
                    activateLevels[cfg.m_uiSkillID] = cfg.m_iID;
                }
            }
        }
        this.levelList = levelList;
        this.skillList = skillList;
        this.maxLevel = maxLevel;
        this.activateLevels = activateLevels;
    }

    getCfg(level: number): GameConfig.JiuXingConfigM {
        return this.levelList[level];
    }

    setDataUpgrade(data: Protocol.JiuXingList): void {
        this.level = data.m_usLevel;
        this.setLuckyData(data);
        this.m_ucLayer = Math.floor(this.level / 10 + 1);
        this.updateSkillInfo(this.level);
    }

    setLuckyData(data: Protocol.JiuXingList) {
        this.luckyQingKongTime = data.m_uiLuckyTime;
        this.currentLuckyValue = data.m_uiLucky;
        this.shuaiJianValue = data.m_uiSaveLucky;
    }

    setDataPanel(data: Protocol.JiuXingList): void {
        this.level = data.m_usLevel;
        this.m_ucLayer = Math.floor(this.level / 10 + 1);
        this.setLuckyData(data);
        this.updateSkillInfo(this.level);
    }

    /** 检查动作栏图标是否升级 */
    isSubbarUpState(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.BAR_FUNCTION_JIUXING)) {
            return false;
        }
        let cfg: GameConfig.JiuXingConfigM = this.getCfg(this.level);
        if (null == cfg) {
            return false;
        }
        let jxBonus: number = G.DataMgr.heroData.jxBonus;

        if (jxBonus >= cfg.m_uiLuckUp) {
            return true;
        }
        for (let skillId of this.skillList) {
            if (this.isSkillUp(skillId)) {
                return true;
            }
        }
        return false;
    }

    isSkillUp(skillId: number): boolean {
        let skillConfig: GameConfig.SkillConfigM = G.DataMgr.skillData.getStudiedSkillBySerial(skillId);
        if (skillConfig == null) {
            skillConfig = SkillData.getSkillConfig(skillId);
        }
        if (skillConfig.completed && skillConfig.nextLevel == null) {
            return false;
        }
        let skillStudy: GameConfig.SkillStudy;
        if (skillConfig.completed) {
            skillStudy = skillConfig.nextLevel.m_stSkillStudy;
            if (skillStudy == null)
                skillStudy = skillConfig.m_stSkillStudy;
        }
        else {
            skillStudy = skillConfig.m_stSkillStudy;
        }
        let thingConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(skillStudy.m_iStudyItem);
        let thingNum: number = G.DataMgr.thingData.getThingNum(thingConfig.m_iID, 0, false);
        if (thingNum >= skillStudy.m_iStudyItemNum) {
            if (skillConfig.completed) {
                return true
            }
            else {
                if (this.activateSkills.indexOf(skillConfig.m_iSkillID) != -1) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * （九星）玄天功是否可以升级
     */
    canLevelUpJiuXing(): boolean {
        //如果功能没开启
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.BAR_FUNCTION_JIUXING)) {
            return false;
        }
        let nowIdx = this.getNowIndex();
        let nextCfg: GameConfig.JiuXingConfigM = this.getCfg(this.jiuXingIdArr[nowIdx + 1]);
        if (nextCfg != null) {
            let has = G.DataMgr.thingData.getThingNum(nextCfg.m_iConsumableID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            let need = nextCfg.m_iConsumableNumber;
            let curStage = this.m_ucLayer;
            if (curStage < ZhufuData.ZhuFuLimitTipMarkStage) {
                return (has >= need && has != 0);
            } else {
                return has >= nextCfg.m_iConsumableNumber * ((nextCfg.m_uiLuckUp - this.currentLuckyValue) / 10);
            }
        } else {
            return false;
        }
    }

    //九星是否可以升级技能
    canLevelUpSkill() {
        //如果功能没开启
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.BAR_FUNCTION_JIUXING)) {
            return false;
        }
        let length = this.skillList.length;
        for (let i = 0; i < length; i++) {
            let skillId: number = this.skillList[i];
            let skillConfig: GameConfig.SkillConfigM = G.DataMgr.skillData.getStudiedSkillBySerial(skillId);
            if (skillConfig == null) {
                skillConfig = SkillData.getSkillConfig(skillId);
            }
            if (skillConfig == null) return false;
            if (skillConfig.completed && skillConfig.nextLevel == null) {
                return false;
            }
            let skillStudy: GameConfig.SkillStudy;
            if (skillConfig.completed) {
                skillStudy = skillConfig.nextLevel.m_stSkillStudy;
            }
            else {
                skillStudy = skillConfig.m_stSkillStudy;
            }
            if (skillStudy == null) continue;
            let thingConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(skillStudy.m_iStudyItem);
            let thingNum: number = G.DataMgr.thingData.getThingNum(thingConfig.m_iID, 0, false);
            if (thingNum >= skillStudy.m_iStudyItemNum) {
                if (skillConfig.completed) {
                    return true;
                }
                else {
                    return G.DataMgr.jiuXingData.activateSkills.indexOf(skillConfig.m_iSkillID) != -1;
                }
            }
        }
        return false;
    }

    getNowIndex() {
        let index: number = 0;
        for (let i = 0; i < JiuXingData.stageLvs.length; i++) {
            if (this.level <= JiuXingData.stageLvs[i]) {
                index = i;
                break;
            }
        }
        return index;
    }



    get jiuXingIdArr(): number[] {
        return this.m_faqiIdArr;
    }

}
