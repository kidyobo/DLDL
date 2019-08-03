import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { SkillData } from 'System/data/SkillData'
import { KeyWord } from 'System/constants/KeyWord'

export class ExpeditionPetOne {
    id = 0;
    hpPct = PetExpeditionData.FullHpPct;
    stage = 0;
    feiSheng = 0;
}

export class PetExpeditionData {
    static readonly FullHpPct = 10000;
    static readonly PageSize = 6;
    static readonly SkillCnt = 3;
    static readonly MonsterIds = [31470001, 31470002];

    public isFirstOpen = true;

    private id2cfg: { [level: number]: GameConfig.WYYZLevelCfgM } = {};
    private pet2cfg: { [id: number]: GameConfig.WYYZPetCfgM } = {};

    info: Protocol.WYYZ_Pannel_Response;
    private pet2Info: { [id: number]: Protocol.CSWYYZSelfPetOne } = {};
    private levelPet2Info: { [id: number]: Protocol.CSWYYZLevelPetOne } = {};
    private skillId2petId: { [id: number]: number } = {};
    private nqSkillId2petId: { [id: number]: number } = {};

    onCfgReady() {
        let levelCfgs = G.Cfgmgr.getCfg('data/WYYZLevelCfgM.json') as GameConfig.WYYZLevelCfgM[];
        for (let cfg of levelCfgs) {
            this.id2cfg[cfg.m_iID] = cfg;
        }

        let petCfgs = G.Cfgmgr.getCfg('data/WYYZPetCfgM.json') as GameConfig.WYYZPetCfgM[];
        for (let cfg of petCfgs) {
            this.pet2cfg[cfg.m_iID] = cfg;
            this.skillId2petId[cfg.m_iTSSkill] = cfg.m_iID;
            this.skillId2petId[cfg.m_iPGSkill] = cfg.m_iID;
            this.skillId2petId[cfg.m_iBuff] = cfg.m_iID;
            this.nqSkillId2petId[cfg.m_iTSSkill] = cfg.m_iID;
        }
    }

    updateByPanel(resp: Protocol.WYYZ_Pannel_Response) {
        this.info = resp;
        let self = this.info.m_stSelfPetList;
        for (let i = 0; i < self.m_iCount; i++) {
            let o = self.m_stList[i];
            if (o.m_iPetID > 0) {
                this.pet2Info[o.m_iPetID] = o;
                this.processSkill(o.m_iPetID, o.m_iPercent);
            }
        }

        this.levelPet2Info = {};
        let opponent = this.info.m_stLevelList.m_stList[this.info.m_iTGLevel];
        if (null != opponent) {
            for (let i = 0; i < opponent.m_stPetList.m_iCount; i++) {
                let o = opponent.m_stPetList.m_stList[i];
                this.levelPet2Info[o.m_iPetID] = o;
            }
        }
    }

    updateByBattleResult(resultInfo: Protocol.SceneInfoResultWYYZ) {
        if (this.info) {
            let myUnitId = G.DataMgr.heroData.unitID;
            for (let i = 0; i < resultInfo.m_ucSelfPetCnt; i++) {
                let p = resultInfo.m_stSelfPetList[i];
                this.updatePetHpPct(p.m_iPetID, myUnitId, p.m_iPercent);
            }

            for (let i = 0; i < resultInfo.m_ucLevelPetCnt; i++) {
                let p = resultInfo.m_stLevelPetList[i];
                this.updatePetHpPct(p.m_iPetID, 0, p.m_iPercent);
            }
        }
    }

    /**
     * 检查死亡伙伴自动下阵
     */
    checkAutoNotFight(): number[] {
        if (this.info) {
            let l = this.info.m_stFightPetList.m_aiPetID;
            let len = l.length;
            let out: number[];
            for (let i = 0; i < len; i++) {
                let petId = l[i];
                if (petId > 0) {
                    let petInfo = this.getFightPetInfo(petId);
                    if (null != petInfo && petInfo.m_iPercent == 0) {
                        if (!out) {
                            out = l.concat();
                        }
                        out[i] = 0;
                    }
                }
            }
            return out;
        }
        return null;
    }

    updateByBuyBuff(resp: Protocol.WYYZ_BuyBuff_Response) {
        if (null != this.info) {
            this.info.m_iBuffBit = resp.m_iBuffBit;
        }
    }

    updateBySetFight(resp: Protocol.WYYZ_FightSet_Response) {
        if (null != this.info) {
            this.info.m_stFightPetList = resp.m_stSelfFightList;
        }
    }

    updateByGetReward(resp: Protocol.WYYZ_GetReward_Response) {
        if (null != this.info) {
            this.info.m_iTGRewardBit = resp.m_iTGRewardBit;
        }
    }

    private processSkill(petId: number, hpPct: number) {
        // 伙伴阵亡了，需要禁用技能
        let yzPetCfg = this.getWyyzPetConfig(petId);
        let skill = SkillData.getSkillConfig(yzPetCfg.m_iTSSkill);
        skill.m_ucForbidden = 0 == hpPct ? 1 : 0;
    }

    updatePetHpPct(petId: number, masterUnitId: number, hpPct: number) {
        if (G.DataMgr.heroData.unitID == masterUnitId) {
            this.processSkill(petId, hpPct);
            let p = this.getFightPetInfo(petId);
            if (null == p) {
                // 说明这只伙伴是第一次出阵的，之前后台没记录其血量百分比
                p = { m_iPetID: petId, m_iPercent: PetExpeditionData.FullHpPct } as Protocol.CSWYYZSelfPetOne;
                this.pet2Info[petId] = p;
            }
            p.m_iPercent = hpPct;
        } else {
            let p = this.getLevelPetInfo(petId);
            if (null != p) {
                p.m_iPercent = hpPct;
            }
        }
    }

    getFightPetSkills(): number[] {
        let skillIds: number[] = [];
        if (null != this.info) {
            let p = this.info.m_stFightPetList.m_aiPetID;
            for (let petId of p) {
                if (petId > 0) {
                    let yzPetCfg = this.getWyyzPetConfig(petId);
                    skillIds.push(yzPetCfg.m_iTSSkill);
                }
            }
        }
        return skillIds;
    }

    getPetIdBySkillId(skillId: number): number {
        return this.skillId2petId[skillId];
    }

    /**
     * 根据远征怒气技能id获取对应的伙伴id
     * @param skillId
     */
    getPetIdByYznqSkillId(skillId: number): number {
        return this.nqSkillId2petId[skillId];
    }

    getPetOne(petId: number): ExpeditionPetOne {
        let petInfo = G.DataMgr.petData.getPetInfo(petId);
        let yzPetInfo = this.getFightPetInfo(petId);
        let itemData = new ExpeditionPetOne();
        itemData.id = petId;
        if (null != petInfo) {
            itemData.stage = petInfo.m_uiStage;
            itemData.feiSheng = petInfo.m_stFeiSheng.m_ucNum;
        }
        if (null != yzPetInfo) {
            itemData.hpPct = yzPetInfo.m_iPercent;
        }
        return itemData;
    }

    getLevelPetOne(petId: number): ExpeditionPetOne {
        let yzPetInfo = this.getLevelPetInfo(petId);
        let itemData = new ExpeditionPetOne();
        itemData.id = petId;
        if (null != yzPetInfo) {
            itemData.stage = yzPetInfo.m_iPetLV;
            itemData.feiSheng = yzPetInfo.m_iFSCnt;
            itemData.hpPct = yzPetInfo.m_iPercent;
        }
        return itemData;
    }

    isMyPetDead(petId: number): boolean {
        let petOne = this.getPetOne(petId);
        if (null != petOne && petOne.hpPct == 0) {
            return true;
        }
        return false;
    }

    getWyyzLevelConfig(id: number): GameConfig.WYYZLevelCfgM {
        return this.id2cfg[id];
    }

    getWyyzPetConfig(id: number): GameConfig.WYYZPetCfgM {
        return this.pet2cfg[id];
    }

    getFightPetInfo(petId: number): Protocol.CSWYYZSelfPetOne {
        return this.pet2Info[petId];
    }

    getLevelPetInfo(petId: number): Protocol.CSWYYZLevelPetOne {
        return this.levelPet2Info[petId];
    }

    getFightIndex(petId: number): number {
        if (null != this.info) {
            let l = this.info.m_stFightPetList.m_aiPetID;
            let len = l.length;
            for (let i = 0; i < len; i++) {
                if (l[i] == petId) {
                    return i;
                }
            }
        }
        return -1;
    }

    canDo(): boolean {
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_PET_EXPEDITION) && null != this.info) {
            if (this.info.m_iTGLevel < Macros.MAX_WYYZ_LEVEL) {
                let cfg = this.getWyyzLevelConfig(this.info.m_iTGLevel + 1);
                return G.DataMgr.petData.getActivedPets().length >= cfg.m_iNum;
            }
        }

        return false;
    }

    isHavePetAlive(): boolean {
        let activedPets = G.DataMgr.petData.getActivedPets();
        for (let cfg of activedPets) {
            if (!this.isMyPetDead(cfg.m_iBeautyID)) {
                return true;
            }
        }

        return false;
    }

    isHaveGiftCanGet(): boolean {
        if (this.info) {
            let pageCnt = Math.ceil(Macros.MAX_WYYZ_LEVEL / PetExpeditionData.PageSize);
            for (let i = 1; i <= pageCnt; i++) {
                if (0 == (this.info.m_iTGRewardBit & 1 << (i * PetExpeditionData.PageSize - 1))) {
                    if (this.info.m_iTGLevel >= i * PetExpeditionData.PageSize)
                        return true;
                }
            }
        }

        return false;
    }
}