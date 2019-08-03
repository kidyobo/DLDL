import { Global as G } from "System/global";
import { KeyWord } from "../../constants/KeyWord";
import { Macros } from "../../protocol/Macros";
import { FightingStrengthUtil } from "../../utils/FightingStrengthUtil";
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { EnumThingID } from 'System/constants/GameEnum'

export class HunGuXiLianData {
    //魂骨强化的数据，还有就是装备位操作的相关数据也放这里了，上一级的hunlidata太乱了，就不放那里了，装备升级的相关在EquipStrengthenData这里

    ///**装备位强化配置 */
    //private hunguEquipStrengthenMap: { [equipPart: number]: { [id: number]: GameConfig.HunGuSlotStrengthenM } } = {};

    /**洗炼材料id*/
    readonly XiLianMatId: number = 10270011;
    readonly XiLianCostHunBi: number[] = [0, 1, 1, 2, 2, 3, 3, 3];

    /**装备位相关的后台所有数据 */
    private severConfig: Protocol.HunGuEquipSlotInfoList;

    private readonly STRENG_LEVEL_MAX = 50;
    public readonly STRENG_LEVEL_CAHNGE = 29;
    /**强化石id，10002020*/
    public readonly QHSID = 10002010;

    /**洗炼信息*/
    m_stStageInfo: Protocol.SlotWashStage;
    private wishRandomMap: { [equipType: number]: { [level: number]: GameConfig.HunGuWashRandomM } } = {};
    /**洗炼属性，二维，【属性】【级别】*/
    private wishPropConfig: { [attrType: number]: { [wishLevel: number]: GameConfig.HunGuWashM } };

    onCfgReady() {
        // this.setEquipSlotStrengthenConfig();
        this.setHunGuWishRandomConfig();
        this.setHunGuPropConfig();
    }

    wishRandomMaxStar: { [part: number]: { [lv: number]: number } }
    wishRandomMaxAttrs: { [part: number]: { [lv: number]: number[] } }
    private setHunGuWishRandomConfig(): void {
        let cfgs = G.Cfgmgr.getCfg('data/HunGuWashRandomM.json') as GameConfig.HunGuWashRandomM[];
        this.wishRandomMaxStar = {};
        this.wishRandomMaxAttrs = {};
        for (let config of cfgs) {
            if (this.wishRandomMap[config.m_ucEquipPart] == null) {
                this.wishRandomMap[config.m_ucEquipPart] = {};
            }
            this.wishRandomMap[config.m_ucEquipPart][config.m_ucLevel] = config;

            if (this.wishRandomMaxStar[config.m_ucEquipPart] == null) {
                this.wishRandomMaxStar[config.m_ucEquipPart] = {};
            }
            for (let i = 0; i < config.m_ausProb.length; i++) {
                let prop = config.m_ausProb[i];
                if (prop == 10000) {
                    this.wishRandomMaxStar[config.m_ucEquipPart][config.m_ucLevel] = i;
                }
            }

            if (this.wishRandomMaxAttrs[config.m_ucEquipPart] == null) {
                this.wishRandomMaxAttrs[config.m_ucEquipPart] = {};
            }
            this.wishRandomMaxAttrs[config.m_ucEquipPart][config.m_ucLevel] = config.m_aucPropName;
        }
    }

    //private RefineStage2SlotOpenNums: { [stage: number]: number };

    private setHunGuPropConfig(): void {
        let data: GameConfig.HunGuWashM[] = G.Cfgmgr.getCfg('data/HunGuWashM.json') as GameConfig.HunGuWashM[];
        this.wishPropConfig = {};
        for (let config of data) {
            if (this.wishPropConfig[config.m_ucAttrType] == null) {
                this.wishPropConfig[config.m_ucAttrType] = {};
            }
            this.wishPropConfig[config.m_ucAttrType][config.m_ucWishLevel] = config;
        }
        //this.RefineStage2SlotOpenNums = {};
        //this.RefineStage2SlotOpenNums[1] = 2;
        //this.RefineStage2SlotOpenNums[6] = 4;
        //this.RefineStage2SlotOpenNums[7] = 6;

    }
    /**
     * 拿魂骨洗炼概率表配置
     * @param equipPart
     * @param level
     */
    getWishRandomCfg(equipPart: number, level: number): GameConfig.HunGuWashRandomM {
        let typeMap = this.wishRandomMap[equipPart];
        if (null != typeMap) {
            return typeMap[level];
        }
        return null;
    }

    /**
     * 拿魂骨洗炼属性表配置
     * @param type
     * @param level
     */
    getWishPropConfig(type: number, level: number): GameConfig.HunGuWashM {
        let data = this.wishPropConfig[type];
        if (data) {
            return data[level];
        }
        else {
            return null;
        }
    }
    /**
     *装备强化配置设置
     * @param config
     */
    public setEquipSlotStrengthenConfig(): void {
        //let configs = G.Cfgmgr.getCfg("data/HunGuSlotStrengthenM.json") as GameConfig.HunGuSlotStrengthenM[];
        //for (let cfg of configs) {
        //    let subMap = this.hunguEquipStrengthenMap[cfg.m_iEquipPart];
        //    if (!subMap) {
        //        this.hunguEquipStrengthenMap[cfg.m_iEquipPart] = subMap = {};
        //    }
        //    if (subMap[0] == null) {
        //        subMap[0] = null;
        //    }
        //    subMap[cfg.m_iID] = cfg;
        //}
    }

    public setSeverConfig(cfg: Protocol.HunGuEquipSlotInfoList) {
        this.severConfig = cfg;
    }

    public updataHunGuXiLianConfig(part: number, m_astAttr: Protocol.SlotWashPropCfgList[]) {
        let m_stWash: Protocol.WashSlotInfo = this.severConfig.m_astSlot[part].m_stWash;
        m_stWash.m_astAttr = m_astAttr[0].m_aszPropCfg;
    }

    public updataHunGuXiLianLockConfig(part: number,m_ucLockInfo: number) {
        let m_stWash: Protocol.WashSlotInfo = this.severConfig.m_astSlot[part].m_stWash;
        m_stWash.m_ucLockInfo = m_ucLockInfo;
    }

    public updataHunGuXiLianBuyNumConfig(part: number, m_ucBuyNum: number) {
        let m_stWash: Protocol.WashSlotInfo = this.severConfig.m_astSlot[part].m_stWash;
        m_stWash.m_ucBuyNum = m_ucBuyNum;
    }

    updateXiLianStageInfo( m_stStageInfo: Protocol.SlotWashStage) {
       
        if (m_stStageInfo.m_ucLv == 0) {
            m_stStageInfo.m_ucLv = 1;
        }
        this.m_stStageInfo = m_stStageInfo;
    }

    public updateSeverConfig(part: number, data: Protocol.HunGuStrengRsp) {
        this.severConfig.m_astSlot[part].m_usStrengthenLv = data.m_usStrengthenLv;

        if (data.m_usStrengthenLv = this.STRENG_LEVEL_CAHNGE) {
            this.updateMaterial();
        }
    }

    public hasEquip() {
        let rawDatas: { [position: number]: ThingItemData } = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        if (!rawDatas)
            return false;
        for (let i = 0; i < 9; i++) {
            let itemData = rawDatas[i];
            if (itemData)
                return true;
        }
        return false;
    }

    public hunGuXiLianTipMark(): boolean {
        let rawDatas: { [position: number]: ThingItemData } = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        if (!rawDatas)
            return false;

        for (let i = 0; i < 9; i++) {
           let itemData = rawDatas[i];
            if (this.oneHunGuCanXiLian(itemData))
                return true;
        }
        return false;
    }

    oneHunGuCanXiLian(data: ThingItemData) {
        if (!data)
            return false;
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_HUNGU_WASH))
            return false;
    
        let partIdx = data.config.m_iEquipPart % KeyWord.HUNGU_EQUIP_PARTCLASS_MIN;
        let hunGuInfo: Protocol.HunGuContainerSlotInfo = this.getEquipSlotOneDataByPart(partIdx);
        if (!hunGuInfo)
            return false;
        let openCount: number = 0;
        let lockCount: number = 0;
        let lockFlag: number = hunGuInfo.m_stWash.m_ucLockInfo;
        //7格个洗炼条
        for (let j = 0; j < Macros.MAX_SLOT_WASH_PROP_NUM; j++) {
            //购买的格子数
            let bugNum = hunGuInfo.m_stWash.m_ucBuyNum;
            //已经开启的格子
            if (j < (2 + (bugNum != undefined ? bugNum : 0))) {
                openCount++;
                let astAttr = hunGuInfo.m_stWash.m_astAttr[j];
                let propId = astAttr.m_ucPropId;
                if (propId > 0) {//已洗炼
                    let isLock = ((lockFlag % 2) > 0);
                    if (isLock) {
                        lockCount++;
                    }
                } 
            }
            lockFlag = Math.floor(lockFlag / 2);
        }
      
        let thingData = G.DataMgr.thingData;
        let need = this.XiLianCostHunBi[openCount];
        return (thingData.getThingNum(EnumThingID.XILIANSUO, 0, false) >= lockCount
            && G.DataMgr.thingData.getThingNum(this.XiLianMatId, 0, false) >= need)
    }


    /**
     *通过装备序列获取装备位强化配置 
     * @param index
     * @param isGetNextStreng 是否是下一级（可能是null，null为满级）
     */
    public getConfigByIndex(index: number, isGetNextStreng: boolean = false): GameConfig.HunGuSlotStrengthenM {
        //let part = index + KeyWord.HUNGU_EQUIP_PARTCLASS_MIN;
        //let subMap = this.hunguEquipStrengthenMap[part];
        //if (subMap) {
        //    let lv = this.getEquipSlotOneDataByPart(index).m_usStrengthenLv;

        //    if (isGetNextStreng) {
        //        return subMap[lv + 1];
        //    } else {
        //        return subMap[lv];
        //    }
        //}
        return null;
    }

    /**
     *通过装备位获取装备位强化配置 
     * @param part
     * @param isGetNextStreng 是否是下一级（可能是null，null为满级）
     */
    public getConfigByPart(part: number, isGetNextStreng: boolean = false): GameConfig.HunGuSlotStrengthenM {
        return this.getConfigByIndex(part - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN, isGetNextStreng);
    }

    /**
     * 获取装备位对应的数据(后台数据)
     * @param index 
     */
    public getEquipSlotOneDataByPart(index: number): Protocol.HunGuContainerSlotInfo {
        return this.severConfig.m_astSlot[index];
    }

    /**
     * 获取装备索引对应的等级(后台数据)
     * @param index 
     */
    public getEquipLevelByIndex(index: number): number {
        return this.severConfig.m_astSlot[index].m_usStrengthenLv;
    }

    /**
     * 指定魂骨装备是否可以强化
     * @param equipData
     */
    public isCanStreng(equipData: GameConfig.ThingConfigM): boolean {
        if (equipData != null) {
            let partIdx = equipData.m_iEquipPart % KeyWord.HUNGU_EQUIP_PARTCLASS_MIN;
            let level = this.getEquipSlotOneDataByPart(partIdx).m_usStrengthenLv;
            if (level < this.STRENG_LEVEL_MAX) {
                let equipStrengthenConfig = this.getConfigByPart(equipData.m_iEquipPart, true);
                if (equipStrengthenConfig != null) {
                    let materialId = equipStrengthenConfig.m_uiConsumableID;
                    let materialNeed = equipStrengthenConfig.m_uiConsumableNumber;
                    let materialHave = G.DataMgr.thingData.getThingNum(materialId, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                    return materialHave >= materialNeed;
                }
            }
        }
        return false;
    }

    /**
     * 是否有可强化的魂骨
     */
    public isHaveCanStreng(): boolean {
        let hunguDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        for (let i = 0; i < G.DataMgr.hunliData.HUNGU_COUNT; i++) {
            let cfg = hunguDatas[i];
            if (cfg == null) continue;

            if (this.isCanStrengByIndex(i))
                return true;
        }
        return false;
    }

    /**
     * 魂骨强化页签红点
     */
    public isShowTipMark(): boolean {
        return this.isHaveCanStreng();
    }

    /**
     * 通过索引判断是否可以强化
     * @param index 索引位 （位置上必须有装备，这里没有做判断，请传入有效数据）
     */
    private isCanStrengByIndex(index: number): boolean {
        let level = this.getEquipSlotOneDataByPart(index).m_usStrengthenLv;
        if (level < this.STRENG_LEVEL_MAX) {
            let equipStrengthenConfig = this.getConfigByIndex(index, true);
            if (equipStrengthenConfig != null) {
                let materialId = equipStrengthenConfig.m_uiConsumableID;
                let materialNeed = equipStrengthenConfig.m_uiConsumableNumber;
                let materialHave = G.DataMgr.thingData.getThingNum(materialId, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                return materialHave >= materialNeed;
            }
        }
        return false;

    }

    /**
     * 计算面板战斗力
     */
    public calHunguStrengFighting(): number {
        let allfighting = 0;
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        if (dataList == null) return null;
        for (let i: number = 0; i < G.DataMgr.hunliData.HUNGU_COUNT; i++) {
            if (dataList[i] == null)
                continue;

            let data = this.getConfigByIndex(i);
            if (data == null) continue;

            let att = data.m_astProp;
            for (let j = 0, con = att.length; j < con; j++) {
                allfighting += FightingStrengthUtil.calStrengthByOneProp(att[j].m_ucPropId, att[j].m_ucPropValue);
            }
        }
        return allfighting;
    }

    public getHunguMinLevel(): number {
        let min = this.STRENG_LEVEL_MAX;
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        if (dataList == null) return null;
        for (let i: number = 0; i < G.DataMgr.hunliData.HUNGU_COUNT; i++) {
            if (dataList[i] == null)
                continue;

            let level = this.getEquipLevelByIndex(i);
            min = Math.min(min, level);
        }
        return min;
    }

    /**
     * 获取装备最大的等级
     * （合成时会用到-强化石）
     */
    public getHunguMaxLevel(): number {
        let max = -1;
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        if (dataList == null) return null;
        for (let i: number = 0; i < G.DataMgr.hunliData.HUNGU_COUNT; i++) {
            if (dataList[i] == null)
                continue;

            let level = this.getEquipLevelByIndex(i);
            max = Math.max(max, level);
        }
        return max;
    }

    /**刷新合成材料 */
    private updateMaterial() {
        G.DataMgr.equipStrengthenData.ItemMergeCache.updateMaterial(this.QHSID);
    }
}