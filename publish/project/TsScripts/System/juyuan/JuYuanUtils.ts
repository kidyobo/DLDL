import { Global as G } from 'System/global'
import { HeroData } from 'System/data/RoleData'
import { ZhufuData } from 'System/data/ZhufuData'
import { Color } from 'System/utils/ColorUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { PropInfoVo } from 'System/data/vo/PropInfoVo'
import { JuyuanRule } from 'System/juyuan/JuyuanRule'
import { JuyuanData } from 'System/data/JuyuanData'
import { PetData } from 'System/data/pet/PetData'
import { Macros } from 'System/protocol/Macros'

export class JuYuanUtils {
    static isFullCfg(cfg: GameConfig.JuYuanCfgM): boolean {
        if (cfg == null)
            return false;
        if (cfg.m_iType < JuyuanRule.MAX_JUYUAN_TYPE)
            return false;
        if (cfg.m_iLevel < JuyuanRule.MAX_JUYUAN_LEVEL)
            return false;

        return true;
    }



    /** 组合神力境界的名称 */
    static getCellName(cfg: GameConfig.JuYuanCfgM): string {
        let mgr: JuyuanData = G.DataMgr.juyuanData;
        let type: number = mgr.type;
        let level: number = mgr.level;
        if (cfg.m_iType == type) {
            if (JuyuanRule.MAX_JUYUAN_TYPE == type && mgr.isFullLevel())
                return cfg.m_ucName;

            return JuyuanRule.getJuYuanName(cfg.m_ucName, level);
        }

        return cfg.m_ucName;
    }

    /**
    * 是否可以突破或者挑战
    * @param cfg
    * @param showTips
    * @return
    *
    */
    static isUpgradeGrey(cfg: GameConfig.JuYuanCfgM, showTips: boolean = false): boolean {
        //功能限制不可提升
        let funcOk = G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_JU_YUAN);
        if (!funcOk) {
            return false;
        }
        if (cfg == null)
            return false;
        if (cfg.m_iPinstanceID > 0)
            return true;

        if (G.DataMgr.thingData.getThingNum(cfg.m_iItemId, Macros.CONTAINER_TYPE_ROLE_BAG, false) < G.DataMgr.juyuanData.getNextCfg().m_iCount)
            return false;

        for (let item of cfg.m_astCondition) {
            if (item.m_iType == 0)
                continue;
            //战斗力
            else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_JSZDL) {
                if (G.DataMgr.heroData.fight < item.m_iConditionVal) {
                    return false;
                }
            }
            /*
            //道具数量
            let itemCount: number = G.DataMgr.heroData.tongqian;
            if (itemCount < cfg.m_iCount) {
                return false;
            }
            for (let item of cfg.m_astCondition) {
                if (item.m_iType == 0)
                    continue;

                if (G.DataMgr.thingData.getThingNum(cfg.m_iItemId, Macros.CONTAINER_TYPE_ROLE_BAG, false) < G.DataMgr.juyuanData.getNextCfg().m_iCount)
                    return false;
                //角色等级         
                if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_JSDJ) {
                    if (G.DataMgr.heroData.level < item.m_iConditionVal) {
                        return false;
                    }
                }
                //祝福等级
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_ZFXTJJ) {
                    let needLevelStage: number = ZhufuData.getZhufuStage(item.m_iConditionVal, KeyWord.HERO_SUB_TYPE_ZUOQI);
                    let zhufuData = G.DataMgr.zhufuData.getData(item.m_iCondition);
                    if (zhufuData == null) {
                        return false;
                    }
                    let curStage: number = ZhufuData.getZhufuStage(zhufuData.m_ucLevel, item.m_iCondition);
                    if (curStage < needLevelStage) {
                        return false;
                    }
                }
                //强化等级
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_ZBQHDJ) {
                    let strongLevel: number = G.DataMgr.equipStrengthenData.getEquipStrengthenLevelCount(item.m_iConditionVal);
                    if (strongLevel < item.m_iNumber) {
                        return false;
                    }
                }
                //神力_装备进阶
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_ZBJJSZ) {
                    let diamonondNums: number = G.DataMgr.equipStrengthenData.getGodEquipCount(item.m_iConditionVal);
                    if (diamonondNums < item.m_iNumber) {
                        return false;
                    }
                }
                //强化 总等级
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_QHDJ) {
                    let sumLevel: number = G.DataMgr.equipStrengthenData.getAllEquipStrengthenMinLevel();
                    if (sumLevel < item.m_iConditionVal) {
                        return false;
                    }
                }
                //宝石等级
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_MWDJ) {
                    let diamonondNums = G.DataMgr.equipStrengthenData.getAllInsertDiamondLevel();
                    if (diamonondNums < item.m_iConditionVal) {
                        return false;
                    }
                }
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_MWXQDJ) {
                    //宝石等级的数量
                    let diamonondNums = G.DataMgr.equipStrengthenData.getAllInsertDiamondCount(item.m_iConditionVal);
                    if (diamonondNums < item.m_iNumber) {
                        return false;
                    }
                }
                //战斗力
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_JSZDL) {
                    if (G.DataMgr.heroData.fight < item.m_iConditionVal) {
                        return false;
                    }
                }
                //通关副本层数
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_FBCS) {
                    let pinststanceNum: number = G.DataMgr.pinstanceData.isCompleteStage(item.m_iCondition);
                    if (pinststanceNum < item.m_iConditionVal) {
                        return false;
                    }
                }
                //伙伴等级
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_HYXTJJ) {
                    let beautyData = G.DataMgr.petData.getPetInfo(item.m_iCondition);
                    if (beautyData == null) {
                        return false
                    }
                    if (beautyData.m_uiStage < item.m_iConditionVal) {
                        return false;
                    }
                }
                //伙伴成长数量
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_RYZBJJSZ) {
                    let cnt: number = G.DataMgr.petData.getPetNumByStage(item.m_iConditionVal);
                    if (cnt < item.m_iNumber) {
                        return false;
                    }
                }
                //伙伴装备数量
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_HYZBSL) {
                    let cnt: number = G.DataMgr.thingData.getWearingPetEquipByStage(item.m_iConditionVal);
                    if (cnt < item.m_iNumber) {
                        return false;
                    }
                }
                //伙伴套装数量
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_HYTZSL) {
                    let cnt: number = G.DataMgr.petData.getWearingSetNum(item.m_iConditionVal);
                    if (cnt < item.m_iNumber) {
                        return false;
                    }
                }
                //收集伙伴数量
                else if (item.m_iType == KeyWord.JUYUAN_COND_TYPE_HYSJSL) {
                    let cnt: number = G.DataMgr.petData.getActivedPets().length;
                    if (cnt < item.m_iNumber) {
                        return false;
                    }
                }
            }
                */
            return true;
        }
    }


    static getModeId(modelId: number): number {
        let heroData: HeroData = G.DataMgr.heroData;
        return modelId * 100 + heroData.profession * 10 + heroData.gender;
    }


}
