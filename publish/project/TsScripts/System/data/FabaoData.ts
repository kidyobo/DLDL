import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { PetData } from 'System/data/pet/PetData'
import { StringUtil } from 'System/utils/StringUtil'
import { SkillData } from 'System/data/SkillData'
import { ZhufuData } from 'System/data/ZhufuData'
import { FightingStrengthUtil } from '../utils/FightingStrengthUtil';

/**
 * 宝物
 *
 */
export class FabaoData {
    private m_astFaBaoList: { [id: number]: Protocol.CSFaBaoInfo } = {};
    public showID: number;

    private _fabaoIdArr: number[];
    private _fabaoDic: { [id: number]: GameConfig.FaBaoCfgM };
    private _fabaoLevelDic: { [id: number]: GameConfig.FaBaoLevelCfgM[] };
    private _fabaoXQDic: { [id: number]: GameConfig.FaBaoXiangqianCfgM };
    public _fabaoSkills: GameConfig.FaBaoSkillCfgM[];
    public _fabaoSkillDic: { [id: number]: GameConfig.FaBaoSkillCfgM };

    public activeCount: number;
    /**
     *宝物配置 数据
     */
    private m_faqiDic: { [idLvKey: string]: GameConfig.FaQiCfgM };
    private m_faqiIdArr: number[];
    faqiMaxLevel: number = 0;

    private m_faqiData: Protocol.FaQiInfo[];

    /**宝物注魂配置*/
    private m_faqiSoulConfig: { [id: number]: { [lv: number]: GameConfig.FaQiZhuHunCfgM } };

    /**注魂最高等级*/
    maxFaqisoulLevel: number = 0;

    /**当前出战宝物*/
    wearingFaqi: number = 0;

    /**当前要找回祝福值的宝物id*/
    zhuiHuiFaQiId: number = 0;

    public readonly anqiMaxLevel: number = 100;

    static MAX_FaQiNum: number = 8;

    onCfgReady(): void {
        this.setFabaoConfig();
        this.setFaqiConfig();
        this.setFaqiZhuhunCfg();
    }

    /**检查一个宝物是否能提升*/
    checkOneFabaoCanLevelUpNew(id: number): boolean {
        let showUpIma: boolean = false;
        let fabaoInfo: Protocol.CSFaBaoInfo = this.getFabaoData(id);
        if (fabaoInfo) {
            //let cfg: GameConfig.FaBaoCfgM = this.getFabaoConfig(id, 1);
            //let relateBeauty: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(cfg.m_uiPetID);
            //if (relateBeauty == null || relateBeauty.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET) {
            //    return false;
            //}

            //let nextLvCfg: GameConfig.FaBaoCfgM = this.getFabaoConfig(id, fabaoInfo.m_usLevel + 1);
            //if (nextLvCfg) {
            //    //let itemCount: number = G.DataMgr.thingData.getThingNum(nextLvCfg.m_iConsumableID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            //    let itemCount: number = G.DataMgr.heroData.tongqian;
            //    showUpIma = itemCount >= nextLvCfg.m_iConsumableNumber;
            //}
        }
        return showUpIma;
    }
    /**
    * 一个宝物是否可以激活（镶嵌）
    * @param id
    */
    canFabaoActive(id: number): boolean {
        let config = this.getFabaoConfig(id);
        let severData = this.getFabaoData(id);

        if (!config) {
            uts.logErrorReport("法宝ID：" + id + "不存在");
            return false;
        }
        let con = config.m_stAccessItemList.length;
        for (let index = 0; index < con; index++) {
            if (severData != null) {
                if (severData.m_aiActiveConsume[index] == 1) {
                    //已经镶嵌过
                    return false;
                }
                else {
                    //未镶嵌
                    if (G.DataMgr.thingData.getThingNum(config.m_stAccessItemList[index].m_iID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= config.m_stAccessItemList[index].m_iNumber)
                        return true;
                }
            }
            else {
                if (G.DataMgr.thingData.getThingNum(config.m_stAccessItemList[index].m_iID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= config.m_stAccessItemList[index].m_iNumber)
                    return true;
            }
        }
        return false;
    }

    /**
    * 一个宝物是否可以激活
    * @param id
    */
    canFabaoActiveS(id: number): boolean {
        let config = this.getFabaoConfig(id);
        if (!config) {
            uts.logErrorReport("法宝ID：" + id + "不存在");
            return false;
        }
        // let severData = this.getFabaoData(id);
        let data = this.getFabaoConfig(id);

        let isCan = true;
        for (let i = 0, count = data.m_stAccessItemList.length; i < count; i++) {
            let itemdata = data.m_stAccessItemList[i];
            if (itemdata.m_iID == 0) continue;
            let has = G.DataMgr.thingData.getThingNum(itemdata.m_iID, Macros.CONTAINER_TYPE_ROLE_BAG, false)
            if (has < itemdata.m_iNumber) {
                isCan = false;
                break;
            }
        }
        return isCan;
        // if (G.DataMgr.fabaoData.isActivateGather(id)) {
        //     //收集中 都满足 激活
        //     let isCan = true;
        //     //判断四个（最多）条件
        //     for (let i = 0; i < data.m_stAccessItemList.length; i++) {
        //         let no = severData.m_aiActiveConsume[i] == 0
        //         if (no) {
        //             isCan = false;
        //             break;
        //         }
        //     }
        //     return isCan;
        // }
        // return false;
    }

    canFabaoUp(id: number): boolean {
        let data = this.getFabaoData(id);
        if (data.m_usLevel == G.DataMgr.fabaoData.anqiMaxLevel) {
            return false;
        }
        if (data) {
            let thingData = G.DataMgr.thingData;
            let config = this.getFabaoLevelConfig(id, data.m_usLevel);
            let baoshicount = 0;
            for (let i = 0; i < 4; i++) {
                if (data.m_aiXQID[i] == 0) {
                    if (thingData.getThingNum(config.m_astXiangQian[i].m_iID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= config.m_astXiangQian[i].m_iCount) {
                        return true;
                    }
                }
                else {
                    baoshicount++;
                }
            }
            if (config.m_iConsumableID != 0) {
                if (baoshicount == 4 && thingData.getThingNum(config.m_iConsumableID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= config.m_iConsumableNumber)
                    return true;
            }
        }
        return false;
    }

    canAnyFabaoActiveOrUp(): number {
        let thingData = G.DataMgr.thingData;
        for (let id of this.fabaoIdArr) {
            let data = this.getFabaoData(id);
            if (data) {
                if (data.m_usLevel == G.DataMgr.fabaoData.anqiMaxLevel) {
                    continue;
                }
                let config = this.getFabaoLevelConfig(id, data.m_usLevel);
                let baoshicount = 0;
                for (let i = 0; i < 4; i++) {
                    if (data.m_aiXQID[i] == 0) {
                        if (thingData.getThingNum(config.m_astXiangQian[i].m_iID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= config.m_astXiangQian[i].m_iCount) {
                            return 2;
                        }
                    }
                    else {
                        baoshicount++;
                    }
                }
                if (config.m_iConsumableID != 0) {
                    if (baoshicount == 4 && thingData.getThingNum(config.m_iConsumableID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= config.m_iConsumableNumber)
                        return 2;
                }
            }
            else {
                let config = this.getFabaoConfig(id);
                let con = config.m_stAccessItemList.length;
                for (let index = 0; index < con; index++) {
                    if (G.DataMgr.thingData.getThingNum(config.m_stAccessItemList[index].m_iID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= config.m_stAccessItemList[index].m_iNumber)
                        return 1;
                }
            }
        }
        return 0;
    }

    /**是否有宝物数据*/
    hasData(): boolean {
        return G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.BAR_FUNCTION_ANQI)
    }

    setFabaoConfig(): void {
        let dataList: GameConfig.FaBaoCfgM[] = G.Cfgmgr.getCfg('data/FaBaoCfgM.json') as GameConfig.FaBaoCfgM[];
        dataList.sort(this._sortFaBaoConfig);
        this._fabaoIdArr = new Array<number>();
        this._fabaoDic = {};
        this._fabaoLevelDic = {};
        this._fabaoXQDic = {};
        this._fabaoSkillDic = {};
        for (let config of dataList) {
            this._fabaoDic[config.m_iID] = config;
            this._fabaoIdArr.push(config.m_iID);
            this._fabaoLevelDic[config.m_iID] = [];
        }
        let dataList2: GameConfig.FaBaoLevelCfgM[] = G.Cfgmgr.getCfg('data/FaBaoLevelCfgM.json') as GameConfig.FaBaoLevelCfgM[];

        for (let config of dataList2) {
            let arr = this._fabaoLevelDic[config.m_iID];
            if (arr) {
                arr[config.m_iLevel] = config;
            }
        }

        let dataList3: GameConfig.FaBaoXiangqianCfgM[] = G.Cfgmgr.getCfg('data/FaBaoXiangqianCfgM.json') as GameConfig.FaBaoXiangqianCfgM[];

        for (let config of dataList3) {
            this._fabaoXQDic[config.m_iID] = config;
        }

        this._fabaoSkills = G.Cfgmgr.getCfg('data/FaBaoSkillCfgM.json') as GameConfig.FaBaoSkillCfgM[];
        for (let config of this._fabaoSkills) {
            this._fabaoSkillDic[config.m_iCount] = config;
        }
    }
    private _sortFaBaoConfig(a: GameConfig.FaBaoCfgM, b: GameConfig.FaBaoCfgM): number {
        return a.m_iPaixu - b.m_iPaixu;
    }

    setFabaoInfoList(data: Protocol.CSFaBaoInfo[]): void {
        this.m_astFaBaoList = {};
        for (let item of data) {
            this.m_astFaBaoList[item.m_ucID] = item;
        }
        this.activeCount = data.length;
    }

    setFabaoShowID(id: number): void {
        this.showID = id;
    }

    updateFabaoInfoList(id: number, data: Protocol.CSFaBaoInfo): void {
        if (!this.m_astFaBaoList[id]) {
            this.activeCount++;
        }
        this.m_astFaBaoList[id] = data;
    }

    /**
     * 获得宝物数据
     * 没有操作就没有数据
     * @param id
     *
     */
    getFabaoData(id: number): Protocol.CSFaBaoInfo {
        return this.m_astFaBaoList[id];
    }

    /**
     * 获得宝物配置
     * @param id
     * @return
     *
     */
    getFabaoConfig(id: number): GameConfig.FaBaoCfgM {
        let data = this._fabaoDic[id];
        return data;
    }

    /**
 * 获得宝物配置
 * @param id
 * @return
 *
 */
    getFabaoLevelConfig(id: number, level: number): GameConfig.FaBaoLevelCfgM {
        let arr = this._fabaoLevelDic[id];
        return arr[level];
    }


    /**
     * 获得宝物数据
     * @param id
     * @return
     *
     */
    getFabaoXQData(id: number): GameConfig.FaBaoXiangqianCfgM {
        return this._fabaoXQDic[id];
    }

    /**宝物ID数组*/
    get fabaoIdArr(): number[] {
        return this._fabaoIdArr;
    }

    getAllFaBaoFighting(): number {
        let allFight = 0;
        for (let i = 0, count = this._fabaoIdArr.length; i < count; i++) {
            let item = this.getFabaoData(this._fabaoIdArr[i]);
            if (item == null) continue;
            allFight += this.getFaBaoFighting(this._fabaoIdArr[i]);
        }
        return allFight;
    }

    getFaBaoFighting(id: number): number {
        //战斗力有三个地方需要加上 基础属性 + 进阶属性 + 镶嵌的宝石属性
        let allFight = 0;
        //基础属性
        let baseData = this.getFabaoConfig(id);
        let severData = this.getFabaoData(id);
        //进阶属性
        let upgradeData = this.getFabaoLevelConfig(id, severData != null ? severData.m_usLevel : 0);
        let basicProps = baseData.m_astAddedProp;
        let addProps = upgradeData.m_astAddedProp;

        let propIndex: number[] = [];
        let propDic: { [id: number]: number } = {};
        for (let data of basicProps) {
            if (!propDic[data.m_ucPropName]) {
                propDic[data.m_ucPropName] = 0;
                propIndex.push(data.m_ucPropName);
            }
            propDic[data.m_ucPropName] += data.m_iPropValue;
        }
        if (severData != null) {
            //加宝石属性
            for (let data of severData.m_aiXQID) {
                if (data != 0) {
                    let config = this.getFabaoXQData(data);
                    for (let i = 0; i < config.m_astAddedProp.length; i++) {
                        propDic[config.m_astAddedProp[i].m_ucPropName] += config.m_astAddedProp[i].m_iPropValue;
                    }
                }
            }
            //加进阶属性
            for (let data of addProps) {
                propDic[data.m_ucPropName] += data.m_iPropValue;
            }
        }
        //计算战斗力
        for (let i = 0, count = propIndex.length; i < count; i++) {
            let itemdata = propDic[propIndex[i]];
            if (itemdata == null) continue;
            allFight += FightingStrengthUtil.calStrengthByOneProp(propIndex[i], itemdata);
        }
        return allFight;
    }

    setFaqiConfig(): void {
        let dataList: GameConfig.FaQiCfgM[] = G.Cfgmgr.getCfg('data/FaQiCfgM.json') as GameConfig.FaQiCfgM[];

        this.m_faqiIdArr = new Array<number>();
        this.m_faqiDic = {};
        //dataList.sort(this._sortFaqiConfig);
        let config: GameConfig.FaQiCfgM;
        for (let i: number = 0; i < dataList.length; i++) {
            config = dataList[i];
            this.m_faqiDic[StringUtil.marriageLine(config.m_iID, config.m_iFaQiLv)] = config;
            if (this.m_faqiIdArr.indexOf(config.m_iID) == -1) {
                this.m_faqiIdArr.push(config.m_iID);
            }
            this.faqiMaxLevel = Math.max(this.faqiMaxLevel, config.m_iFaQiLv);
        }
    }

    private _sortFaqiConfig(a: GameConfig.FaQiCfgM, b: GameConfig.FaQiCfgM): number {
        return a.m_ucSort - b.m_ucSort;
    }

    getFaqiData(id: number): Protocol.FaQiInfo {
        if (id > 0 && this.m_faqiData != null) {
            return this.m_faqiData[id - 1];
        }
        return null;
    }

    /**根据法器配置获得法器下标*/
    getFaQiIndex(faQiata: Protocol.FaQiInfo): number {
        let faQiConfig: { [type: number]: number } = {};
        let data = this.m_faqiData;
        let index = 0;
        if (data != null) {
            for (let cfg of data) {
                faQiConfig[cfg.m_iID] = index;
                index++;
            }
            return faQiConfig[faQiata.m_iID];
        }
        return 0;
    }
    getFaqiConfig(id: number, lv: number): GameConfig.FaQiCfgM {
        let fixLv: number = lv > 0 ? lv : 1;

        if (id > 0 && this.m_faqiDic != null) {
            let key: string = StringUtil.marriageLine(id, fixLv);
            return this.m_faqiDic[key];
        }

        return null;
    }

    setFaqiInfoList(notify: Protocol.FaQiList_Notify): void {
        this.m_faqiData = notify.m_stFaQiList.m_astFaQiList;
        this.wearingFaqi = notify.m_stFaQiList.m_iShowID;
    }

    updateByReponse(response: Protocol.FaQiOperate_Response): void {
        if (this.m_faqiData != null) {
            let data: Protocol.FaQiInfo = this.m_faqiData[response.m_stFaQiInfo.m_iID - 1];
            data.m_ucLayer = response.m_stFaQiInfo.m_ucLayer;
            data.m_uiWish = response.m_stFaQiInfo.m_uiWish;
            data.m_ucStatus = response.m_stFaQiInfo.m_ucStatus;
            this.m_faqiData[response.m_stFaQiInfo.m_iID - 1] = data;
        }

        if (response.m_iType == Macros.FAQI_OP_CHANGE_IMAGE) {
            this.wearingFaqi = response.m_stFaQiInfo.m_iID;
        }
    }

    get faqiIdArr(): number[] {
        return this.m_faqiIdArr;
    }

    /**能够强化宝物*/
    canStrengthFaqi(): boolean {
        for (let i = 0; i < 8; i++) {
            let faqiId = this.faqiIdArr[i];
            if (faqiId > 0) {
                if (this.canStrengthOneFaqi(faqiId)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**能够升级宝物技能*/
    canSkillLevelUpFaqi(): boolean {
        for (let i = 0; i < 8; i++) {
            let faqiId = this.faqiIdArr[i];
            if (faqiId > 0) {
                if (this.canSkillLevelUpOneFaqi(faqiId)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 一个宝物是否可以强化
     * 能强化，且强化材料>=所需
     * @param faqiId
     */
    canStrengthOneFaqi(faqiId: number): boolean {
        let data: Protocol.FaQiInfo = this.getFaqiData(faqiId);
        if (null != data) {
            //没激活的直接false
            if (data.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET) return false;
            let curConfig = this.getFaqiConfig(faqiId, data.m_ucLayer);
            let nextConfig = this.getFaqiConfig(faqiId, data.m_ucLayer + 1);
            let id = curConfig.m_iConsumableID;
            if (nextConfig != null) {
                let has = G.DataMgr.thingData.getThingNum(id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                let need = curConfig.m_iConsumableNumber;

                let curStage = data.m_ucLayer;
                if (curStage < ZhufuData.ZhuFuLimitTipMarkStage) {
                    return (has >= need && has != 0);
                } else {
                    return has >= nextConfig.m_iConsumableNumber * ((nextConfig.m_iLuckyUp - data.m_uiWish) / 10);
                }
            }
        }

        return false;
    }

    /**
     * 宝物技能是否可以升级
     * 且材料满足,且技能升级条件满足
     * @param faqiId
     */
    canSkillLevelUpOneFaqi(faqiId: number) {
        let data: Protocol.FaQiInfo = this.getFaqiData(faqiId);
        if (null != data) {
            //没激活的直接false
            if (data.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET) return false;
            let curConfig = this.getFaqiConfig(faqiId, data.m_ucLayer);
            let m_skillConfig = G.DataMgr.skillData.getStudiedSkillBySerial(curConfig.m_iSkillID);
            if (m_skillConfig == null) {
                m_skillConfig = SkillData.getSkillConfig(curConfig.m_iSkillID);
            }
            if (((m_skillConfig.nextLevel.m_iSkillID) <= (G.DataMgr.fabaoData.getFaqiConfig(faqiId, data.m_ucLayer).m_iSkillID)) && SkillData.canSkillUp(m_skillConfig.m_iSkillID)) {
                return true;
            }
        }
        return false;
    }
    /**
     * 一个法器是否可以激活
     * @param id
     */
    canFaqiActive(id: number): boolean {
        if (this.m_faqiData != null) {
            let data: Protocol.FaQiInfo = this.m_faqiData[id - 1];
            let thingData = G.DataMgr.thingData
            let faQiId = thingData.getCardIdByShenQiId(id);
            let count = thingData.getThingNumInsensitiveToBind(faQiId);
            if (null != data && (data.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET || count > 0 && data.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET)) {
                return true;
            }
        }
        return false;
    }

    getActivatedFaQiIds(): number[] {
        let out: number[] = [];
        if (this.m_faqiData != null) {
            for (let oneInfo of this.m_faqiData) {
                if (oneInfo.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
                    out.push(oneInfo.m_iID);
                }
            }
        }
        return out;
    }

    canFaqiZhuhun(id: number): boolean {
        if (this.m_faqiData != null) {
            let data: Protocol.FaQiInfo = this.m_faqiData[id - 1];
            let config: GameConfig.FaQiZhuHunCfgM = this.getFaqiZhuhunCfg(id, data.m_stZhuHunInfo.m_uiLevel + 1);
            if (data.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET &&
                config != null &&
                G.DataMgr.thingData.getThingNum(config.m_iConsumableID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= config.m_iConsumableNumber) {
                return true;
            }
        }

        return false;
    }

    setFaqiZhuhunCfg(): void {
        let dataList: GameConfig.FaQiZhuHunCfgM[] = G.Cfgmgr.getCfg('data/FaQiZhuHunCfgM.json') as GameConfig.FaQiZhuHunCfgM[];

        this.m_faqiSoulConfig = {};
        this.maxFaqisoulLevel = 0;
        for (let config of dataList) {
            if (this.m_faqiSoulConfig[config.m_iFaQiID] == null) {
                this.m_faqiSoulConfig[config.m_iFaQiID] = {};
            }

            this.m_faqiSoulConfig[config.m_iFaQiID][config.m_iZhuHunLv] = config;

            if (config.m_iZhuHunLv > this.maxFaqisoulLevel) {
                this.maxFaqisoulLevel = config.m_iZhuHunLv;
            }
        }
    }

    getFaqiZhuhunCfg(id: number, lv: number): GameConfig.FaQiZhuHunCfgM {
        return this.m_faqiSoulConfig[id][lv];
    }

    getFaqiZhuhunStage(lv: number): number {
        if (lv >= this.maxFaqisoulLevel) {
            return Math.floor(this.maxFaqisoulLevel / 5);
        }
        else {
            return Math.floor(lv / 5) + 1;
        }
    }

    getFaqiZhuhunStar(lv: number): number {
        if (lv >= this.maxFaqisoulLevel) {
            return 5;
        }
        else {
            return Math.floor(lv % 5);
        }
    }

    /**获得技能信息 */
    getSkillData(index: number): GameConfig.FaBaoSkillCfgM {
        return this._fabaoSkillDic[index];
    }

    /**
     * 是否激活
     * @param id 
     */
    isActivate(id: number): boolean {
        let data: Protocol.CSFaBaoInfo = this.getFabaoData(id);
        if (data == null) {
            return false;
        }
        else {
            return data.m_ucHaveActive == 0 ? false : true;
        }
    }

    /**
     * 是否开始收集
     * @param id 
     */
    isActivateGather(id: number): boolean {
        let data: Protocol.CSFaBaoInfo = this.getFabaoData(id);
        return data != null;
    }
}
