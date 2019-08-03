import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { SkillData } from 'System/data/SkillData'
import { Macros } from 'System/protocol/Macros'

/**
 * 自动挂机配置。
 * @author xiaojialin
 *
 */
export class DeputySetting {

    readonly ZhiYeSkillCount = 4;

    /**是否默认设置。*/
    isDefault: boolean = true;

    /**是否开启自动组队*/
    isTeamEnabled: boolean;

    /**是否开启自动反击。*/
    isAutoFightBack: boolean;

    /**是否自动买血包*/
    isAutoBuyMedicine: boolean;

    /**是否使用怒气*/
    isAutoUseNuqi: boolean;

    /**是否开启角色死亡后原地复活。*/
    isRoleReviveEnabled: boolean;

    /**自动使用伙伴技能*/
    isAutoUseWy: boolean;

    /**是否使用定点挂机*/
    isFixedPoint: boolean;

    /**存储的自动施放的战斗技能ID的列表。*/
    autoSkillIDList: number[] = [];

    m_stAutoAnalyze: Protocol.AutoAnalyze;

    /**boss关注表*/
    private followBossMap: { [bossId: number]: boolean } = {};
    private followCnt = 0;
    isFollowBossDirty = false;

    constructor() {
        this.m_stAutoAnalyze = {} as Protocol.AutoAnalyze;
    }

    /**
     * 重置自动挂机设置为默认值。
     * @param 职业类型。
     *
     */
    setDefault(): void {
        this.isDefault = true;

        this.isTeamEnabled = true;
        this.isRoleReviveEnabled = false;
        this.isAutoUseNuqi = false;
        this.isAutoUseWy = true;
        this.isAutoFightBack = false;
        this.isAutoBuyMedicine = false;
        this.isFixedPoint = false;

        this.isAutoAnalyze = false;

        this.m_stAutoAnalyze.m_ucDefaultFlag = 0;
        this.m_stAutoAnalyze.m_ucStage = 1;
        this.m_stAutoAnalyze.m_ucQuality = KeyWord.COLOR_BLUE;

        this.autoSkillIDList = [];
        let profSkills = G.DataMgr.skillData.getSkillsByProf(G.DataMgr.heroData.profession);
        let normalSkills = profSkills[KeyWord.SKILL_BRANCH_ROLE_ZY];
        for (let i = 0; i < this.ZhiYeSkillCount; i++) {
            let skillCfg = normalSkills[i];
            this.autoSkillIDList.push(Math.floor(skillCfg.m_iSkillID/100));
        }
    }

    /**是否自动分解*/
    get isAutoAnalyze(): boolean {
        return 0 != this.m_stAutoAnalyze.m_ucDefaultFlag;
    }

    set isAutoAnalyze(value: boolean) {
        this.m_stAutoAnalyze.m_ucDefaultFlag = value ? 1 : 0;
    }

    initFollowBoss(attention: Protocol.BossAttention) {
        this.followBossMap = {};
        for (let i = 0; i < attention.m_ucNumber; i++) {
            let bossId = attention.m_iValue[i];
            this.followBossMap[bossId] = true;
        }
        this.followCnt = attention.m_ucNumber;
    }

    canFollowBoss(bossId: number): boolean {
        let cnt = 0;
        for (let bossIdKey in this.followBossMap) {
            cnt++;
        }
        return cnt < Macros.MAX_BOSS_ATTENTION_NUMBER;
    }

    followBoss(bossId: number, yesOrNo: boolean) {
        if (yesOrNo) {
            if (!this.followBossMap[bossId]) {
                this.followBossMap[bossId] = true;
                this.followCnt++;
            }
        } else {
            if (this.followBossMap[bossId]) {
                delete this.followBossMap[bossId];
                this.followCnt--;
            }
        }
        this.isFollowBossDirty = true;
    }

    get FollowCnt(): number {
        return this.followCnt;
    }

    isBossFollowed(bossId: number): boolean {
        return true == this.followBossMap[bossId];
    }

    setBossAttention(attention: Protocol.BossAttention) {
        let cnt = 0;
        if (attention.m_iValue) {
            attention.m_iValue.length = 0;
        } else {
            attention.m_iValue = [];
        }
        for (let bossIdKey in this.followBossMap) {
            attention.m_iValue.push(parseInt(bossIdKey));
            cnt++;
        }
        attention.m_ucNumber = cnt;
        this.isFollowBossDirty = false;
    }
}
