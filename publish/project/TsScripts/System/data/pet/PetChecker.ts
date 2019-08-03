import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { CheckerCaches } from 'System/CheckerCaches'
import { PetData } from 'System/data/pet/PetData'
import { ThingData } from 'System/data/thing/ThingData'
import { GameIDType } from 'System/constants/GameEnum'
import { SkillData } from 'System/data/SkillData'
import { Constants } from 'System/constants/Constants'

enum PetCheckerType {
    CanWearBetter = 1
}

/** 对小红点处理做缓冲 */
export class PetChecker {
    info: Protocol.NewBeautyInfo = {} as Protocol.NewBeautyInfo;
    private caches = new CheckerCaches();
    update(info: Protocol.NewBeautyInfo) {
        this.info = info;
        this.clearCache();
    }
    clearCache() {
        this.caches.clear();
    }
    canActive(): boolean {
        return this.info.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET;
    }
    canUpgradeSkill(needProp: boolean): boolean {
        if (this.info.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET) {
            return false;
        }

        let nextLevel = this.info.m_astFateList[KeyWord.BEAUTY_FATE_TYPE_KF - 1].m_iLevel + 1;
        let nextConfig = PetData.getYuanfenConfig(this.info.m_iBeautyID, KeyWord.BEAUTY_FATE_TYPE_KF, nextLevel);
        let skillId = 0;
        if (nextConfig) {
            skillId = nextConfig.m_uiSkillID;
        }
        return SkillData.canStudySkill(skillId, needProp);
    }
    canWearBetterEquip(): boolean {
        let cache = this.caches.get(PetCheckerType.CanWearBetter);
        if (cache.Has) return cache.Value;

        let rt = false;
        let info = this.info;
        if (!info || info.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET)
            return false;
        let thingData = G.DataMgr.thingData;
        let equipObject = thingData.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
        let allEquipInBag = thingData.getAllEquipInContainer(GameIDType.PET_EQUIP, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(info.m_iBeautyID);
        for (let i = 0; i < PetData.EQUIP_NUM_PER_PET; i++) {
            let pos = config.m_uiEquipPosition + i;
            let equipPart = KeyWord.BEAUTY_EQUIP_PARTCLASS_MIN + i;
            //穿戴，比较更好的
            if (equipObject != null && equipObject[pos] != null) {
                let beautyBetterEquip = thingData.getBeautyBetterEquip(equipPart, info, allEquipInBag);
                if (null != beautyBetterEquip) {
                    rt = true;
                    break;
                }
            }
            else {
                //没穿，找背包中有没有
                for (let j = allEquipInBag.length - 1; j >= 0; j--) {
                    let equipConfig = allEquipInBag[j].config;
                    if (equipConfig.m_iEquipPart == equipPart && (equipConfig.m_iFunctionID == 0 || equipConfig.m_iFunctionID == info.m_iBeautyID) && equipConfig.m_ucRequiredLevel <= info.m_uiStage) {
                        if (equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BINHUN || equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BRACELET) {
                            if (equipConfig.m_ucRequiredLevel <= info.m_uiStage) {
                                rt = true;
                                break;
                            }
                        }
                        else {
                            let awakenStage = G.DataMgr.petData.getPetInfo(info.m_iBeautyID).m_stAwake.m_ucLevel;
                            if (equipConfig.m_ucRequiredLevel <= awakenStage) {
                                rt = true;
                                break;
                            }
                        }
                        
                    }
                }
                if (rt) break;
            }
        }

        cache.cache(rt);
        return rt;
    }
    canJinJie(): boolean { // 目测不需要缓冲处理
        if (this.info.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET)
            return false;

        let nextConfig = PetData.getEnhanceConfig(this.info.m_iBeautyID, this.info.m_uiStage + 1);
        if (!nextConfig)
            return false;

        let id = nextConfig.m_iConsumableID;
        let need = nextConfig.m_iConsumableNumber;
        let has = G.DataMgr.thingData.getThingNum(id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        return (has >= need && has != 0);
    }
    canJuShen(): boolean {
        if (this.info.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET)
            return false;

        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_WUYUANFEISHENG)) { // 耗时函数，其余的没啥耗时的了
            return false;
        }

        let info = this.info;
        let curPetId = info.m_iBeautyID;
        let thingData = G.DataMgr.thingData;
        let petCfg = PetData.getPetConfigByPetID(curPetId);

        if (info.m_stJuShen.m_uiLevel >= PetData.getCanFeishengLv(curPetId) && (info.m_stFeiSheng.m_ucNum < petCfg.m_iFSCntLimit)) {
            //可飞升
            let soulConfig = PetData.getFeishengConfig(curPetId, info.m_stJuShen.m_uiLevel);
            if (soulConfig.m_iFSConsumID > 0) {
                let has3 = thingData.getThingNum(soulConfig.m_iFSConsumID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                if (has3 >= soulConfig.m_iFSConsumNum) {
                    return true;
                }
            }

        } else {
            //炼神
            let stage = PetData.getPetStage(info.m_uiStage, info.m_iBeautyID);
            // 聚神几阶
            let num = Math.floor(PetData.getJushenStage(info.m_stJuShen.m_uiLevel));
            if (stage < num) {
                return false;
            }

            let nextSoulConfig: GameConfig.HongYanJuShenConfigM = PetData.getFeishengConfig(curPetId, info.m_stJuShen.m_uiLevel + 1);
            if (nextSoulConfig != null && nextSoulConfig.m_iConsumableID > 0) {
                if (thingData.getThingNum(nextSoulConfig.m_iConsumableID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= nextSoulConfig.m_iConsumableNumber && thingData.getThingNum(nextSoulConfig.m_iConsumID2, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= nextSoulConfig.m_iConsumNum2) {
                    return true;
                }
            }
        }

        return false;
    }

    canAwaken(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_WUYUAN_AWAKE))
            return false;
        let awakeData = this.info.m_stAwake;
        let jueXingData = G.DataMgr.petData.getPetAwakenCfg(this.info.m_iBeautyID, awakeData.m_ucLevel);
        let needConsumId:number = 0;
        let needConsumNum: number = 0;
        if (awakeData.m_usLuck >= jueXingData.m_iAwakeExp) {
            if (awakeData.m_ucLevel >= Constants.petMaxAwakenLevel) {
                return false;
            }
            needConsumId = jueXingData.m_iByongID;
            needConsumNum = jueXingData.m_iByongNumber;
        }
        else {
            needConsumId = jueXingData.m_iConsumableID;
            needConsumNum = jueXingData.m_iConsumeNum;
        }

        let hasNum = G.DataMgr.thingData.getThingNum(needConsumId, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        return hasNum >= needConsumNum;
    }
    /** 该装备比伙伴身上的好 */
    isBetterEquip(itemConfig: GameConfig.ThingConfigM, fight: number): boolean {
        if (this.info.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET)
            return false;

        let info = this.info;
        let petInfo = G.DataMgr.petData.getPetInfo(info.m_iBeautyID);
        let limitLevel = petInfo.m_uiStage;
        let awakenStage = G.DataMgr.petData.getPetInfo(info.m_iBeautyID).m_stAwake.m_ucLevel;
        if (itemConfig.m_iEquipPart != KeyWord.EQUIP_PARTCLASS_BINHUN && itemConfig.m_iEquipPart != KeyWord.EQUIP_PARTCLASS_BRACELET) {
            if (itemConfig.m_ucRequiredLevel > awakenStage)
                return false;
        }
        else {
            if (itemConfig.m_ucRequiredLevel > limitLevel)
                return false;
        }

        if (itemConfig.m_iFunctionID > 0 && info.m_iBeautyID != itemConfig.m_iFunctionID)
            return false;

        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(info.m_iBeautyID);
        let pos = config.m_uiEquipPosition + G.DataMgr.petData.getPetEquipPartIndexByType(itemConfig.m_iEquipPart);
        let curWears = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
        let notWear = curWears == null || curWears[pos] == null;
        if (notWear)
            return true;

        let curWear = curWears[pos];
        return curWear.zdl < fight;

        /* 原始代码
        let pet = this.info;
        if (pet.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
            let equipObject = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
            let petInfo: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(pet.m_iBeautyID);
            let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(pet.m_iBeautyID);
            let pos = 0;
            let limit = petInfo.m_uiStage;
            for (let i: number = 0; i < PetData.EQUIP_NUM_PER_PET; i++) {
                pos = config.m_uiEquipPosition + i;
                //物品使用下限
                if (itemConfig.m_ucRequiredLevel <= limit) {
                    //穿戴，比较更好的
                    if (equipObject != null && equipObject[pos] != null) {
                        //同部位有更好的
                        if (equipObject[pos].config.m_iEquipPart == itemConfig.m_iEquipPart && equipObject[pos].zdl < fight) {
                            //专属
                            if (itemConfig.m_iFunctionID > 0) {
                                if (itemConfig.m_iFunctionID == pet.m_iBeautyID) {
                                    return true;
                                }
                            } else {
                                //通用伙伴装备
                                return true;
                            }
                        }
                    }
                    else {
                        //没穿
                        if (G.DataMgr.petData.getPetEquipPartByIndex(i) == itemConfig.m_iEquipPart) {
                            // m_iFunctionID>0 伙伴专属
                            if (itemConfig.m_iFunctionID > 0) {
                                if (pet.m_iBeautyID == itemConfig.m_iFunctionID) {
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
        */
    }
}