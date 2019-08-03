import { Global as G } from 'System/global'
import { EnumMagicCubeRule } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { HeroData } from 'System/data/RoleData'
import { ZhufuData } from 'System/data/ZhufuData'

/**
 * 星环数据管理
 * @author lyl
 */
export class MagicCubeData {
    private _magicCubeBaseConfig: { [configId: number]: GameConfig.MagicCubeBaseCfgM };
    private _magicCubeFbConfig: { [configId: number]: GameConfig.MagicCubeFBCfgM };
    private _magicCubeInfo: Protocol.MagicCubeInfo;

    /**星环最大等级*/
    magicCubeMaxLevel: number = 0;
    /**是否请求升级中*/
    isReqestingLevelUp: boolean = false;



    /**检查开启星环副本道具数量是否足够*/
    checkReachItemCount(): boolean {
        let itemId: number = Macros.MAGICCUBE_OPEN_ITEMID;
        let hasCount: number = G.DataMgr.thingData.getThingNum(itemId, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        let needCount: number = Macros.MAGICCUBE_OPEN_ITEM_COUNT;
        let reachNeedCount: boolean = hasCount >= needCount;
        return reachNeedCount;
    }

    /**获取星环副本剩余次数*/
    getPinstanceLeftCount(): number {
        let heroData: HeroData = G.DataMgr.heroData;
        let vipCount: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_OPEN_MAGICCUBE, heroData.curVipLevel);
        //let leftCount: number = Macros.MAGICCUBE_FREE_TIMES + vipCount - this.magicCubeInfo.m_ucTimes;
        return 0;
    }



    /**获取星环下一提升等级*/
    getNextLevelUpLevel(): boolean {
        if (!this.hasData()) {
            return false;
        }
        let nextLevel: number = Math.ceil(this.magicCubeInfo.m_uiLevel / 10) * 10 + 1;
        let nextMagicCubeBaseConfig = this.getMagicCubeBaseConfig(nextLevel);

        //材料
        if (nextMagicCubeBaseConfig != null) {
            let id = nextMagicCubeBaseConfig.m_iConsumableID;
            let need = nextMagicCubeBaseConfig.m_iConsumableNumber;
            let has = G.DataMgr.thingData.getThingNum(id, Macros.CONTAINER_TYPE_ROLE_BAG, false);

            let data =  this.magicCubeInfo;
            if (data) {
                let curStage = ZhufuData.getZhufuStage(data.m_uiLevel, KeyWord.OTHER_FUNCTION_MAGICCUBE);
                if (curStage < ZhufuData.ZhuFuLimitTipMarkStage) {
                    return (has >= need && has != 0);
                } else {
                    return has >= nextMagicCubeBaseConfig.m_iConsumableNumber * ((nextMagicCubeBaseConfig.m_uiLuckUp - data.m_uiLucky) / 10);
                }
            }
        }
        return false;
    }




    ///**获取星环下一提升等级*/
    //getNextLevelUpLevel(): number {     
    //    if (!this.hasData()) {
    //        return 0;
    //    }     
    //    let heroData: HeroData = G.DataMgr.heroData;
    //    let leftExp: number = heroData.soulExp;
    //    let nextLevel: number = this.magicCubeInfo.m_uiLevel;
    //    for (let i: number = nextLevel; i < this.magicCubeMaxLevel; i++) {
    //        nextLevel = i;
    //        let magicCubeBaseConfig: GameConfig.MagicCubeBaseCfgM = this.getMagicCubeBaseConfig(i);
    //        if (leftExp >= magicCubeBaseConfig.m_uiMagicCubeExp) {
    //            leftExp -= magicCubeBaseConfig.m_uiMagicCubeExp;
    //            nextLevel = Math.min(nextLevel + 1, this.magicCubeMaxLevel);
    //            //改成一键升一级
    //            break;
    //        }
    //        else {
    //            break;
    //        }
    //    }       
    //    return nextLevel;
    //}

    /**星环是否可以升级*/
    canLevelUp(): boolean {
        if (!this.hasData()) {
            return false;
        }
        return this.getNextLevelUpLevel();
    }

    /**是否有星环数据*/
    hasData(): boolean {
        return this.magicCubeInfo && this.magicCubeInfo.m_uiLevel > 0 && G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_MAGICCUBE);
    }

    /**初始化星环配置表*/
    setMagicCubeBaseConfig(): void {

        let data: GameConfig.MagicCubeBaseCfgM[] = G.Cfgmgr.getCfg('data/MagicCubeBaseCfgM.json') as GameConfig.MagicCubeBaseCfgM[];
        this._magicCubeBaseConfig = {};

        for (let config of data) {
            this._magicCubeBaseConfig[config.m_iID] = config;

            this.magicCubeMaxLevel = Math.max(this.magicCubeMaxLevel, config.m_iID);
        }
    }

    /**初始化星环副本表*/
    setMagicCubeFbConfig(): void {

        let data: GameConfig.MagicCubeFBCfgM[] = G.Cfgmgr.getCfg('data/MagicCubeFBCfgM.json') as GameConfig.MagicCubeFBCfgM[];
        this._magicCubeFbConfig = {};

        for (let config of data) {
            this._magicCubeFbConfig[config.m_iID] = config;
        }
    }

    /**
     * 获取星环基础配置表
     * @param	level   星环等级
     * @return
     */
    getMagicCubeBaseConfig(level: number): GameConfig.MagicCubeBaseCfgM {
        return this._magicCubeBaseConfig[level] as GameConfig.MagicCubeBaseCfgM
    }

    /**
     * 获取星环副本表
     * @param	level   星环等级
     * @return
     */
    getMagicCubeFbConfig(level: number): GameConfig.MagicCubeFBCfgM {
        return this._magicCubeFbConfig[level] as GameConfig.MagicCubeFBCfgM
    }

    /**获取最大魂值*/
    getMaxSoulValue(): number {
        let heroData: HeroData = G.DataMgr.heroData;
        return heroData.getProperty(Macros.EUAI_MAXHP);
    }

    /**更新星环信息*/
    updateMagicCubeInfo(m_stMagicCubeInfo: Protocol.MagicCubeInfo): void {
        this._magicCubeInfo = m_stMagicCubeInfo;
    }

    /**星环信息*/
    get magicCubeInfo(): Protocol.MagicCubeInfo {
        return this._magicCubeInfo;
    }

    public onCfgReady() {
        this.setMagicCubeBaseConfig();
        this.setMagicCubeFbConfig();
    }
}
