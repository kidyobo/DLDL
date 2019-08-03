import { KeyWord } from 'System/constants/KeyWord';
import { ThingData } from "System/data/thing/ThingData";
import { Global as G } from "System/global";
import { HunGuCollectPanel } from 'System/hunli/HunGuCollectPanel';
import { Macros } from 'System/protocol/Macros';
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil';
import { PinstanceData } from "../PinstanceData";
import { ThingItemData } from "../thing/ThingItemData";
import { HunguIntensifyData } from "./HunguIntensifyData";
import { HunguMergeData } from "./HunguMergeData";
import { HunguStrengData } from "./HunguStrengData";
import { HunGuXiLianData } from "./HunGuXiLianData";
import { HunguSkillData } from './HunguSkillData';
import { HunguCreateData } from './HunguCreateData';

export class HunLiData {
    readonly HUNGU_SJ_MAXDROPLEVEL = 10;
    readonly HUNGU_COUNT: number = 9;
    readonly HUNGU_COUNT_NORMAL: number = 6;
    readonly HUNGU_COUNT_SPECIAL: number = 3;
    readonly HUNLI_LEVEL_MAX: number = 9;
    private m_hunliCfg: { [level: number]: { [node: number]: GameConfig.HunLiConfigM } } = {};
    private m_arrayHunhuanCfg: GameConfig.HunHuanConfigM[] = [];
    private m_hunhuanCfgByLevel: { [level: number]: GameConfig.HunHuanConfigM } = {};
    /**魂骨装备位配置 */
    private m_hunguSlotLvMap: { [part: number]: { [level: number]: GameConfig.HunGuSlotUpLvM } } = {};
    private m_hunguSlotDropLevelMap: { [part: number]: { [dropLevel: number]: GameConfig.HunGuSlotUpLvM } } = {};
    /**魂环晋升 */
    private m_hunhuanLevelUpCfgById: { [id: number]: { [level: number]: GameConfig.HunHuanLevelUpConfigM } } = {};

    hunhuanJinShengLevel: number = 0;
    /**晋升的魂环id */
    hunhuanJinShengIds: number[];
    hunhuanJinShengId: number;
    /**晋升的魂环对应的等级 */
    hunhuanJinShengInfo: Protocol.HunHuanLevelUpRsp;
    /**可以晋升的最大数量 */
    canJinShengMaxNum: number;

    hunhuanLevelInfoList: Protocol.HunHuanOneInfo[];
    levelUpCount: number;

    Hungu_Index2Part: { [index: number]: number[] } = {};
    /**魂力等级*/
    level: number = -1;
    conditionInfo: Protocol.HunLiLevelOne[] = [];
    //魂环索引
    isActiveHunHuanIndex: number;
    //魂力注入度
    hunhuanProgress: number = 0;
    //当前激活的魂环id
    hunhuanId: number = 0;


    hunguStrengeData: HunguStrengData = new HunguStrengData();
    hunGuXiLianData: HunGuXiLianData = new HunGuXiLianData();
    hunguMergeData: HunguMergeData = new HunguMergeData();
    hunguIntensifyData: HunguIntensifyData = new HunguIntensifyData();
    hunguSkillData: HunguSkillData = new HunguSkillData();
    hunguCreateData: HunguCreateData = new HunguCreateData();



    //魂力的子节点
    hunliNode: number = -1;
    hunliSubLevel: number = -1;
    onCfgReady(): void {
        this.setHunLiConfig();
        this.setHunHuanConfig();
        this.sethunhuanLevelUpConfig();
        this.initAssistConfig();
        this.setHunGuEquipSlotConfig();
        this.hunguStrengeData.onCfgReady();
        this.hunGuXiLianData.onCfgReady();
        this.hunguMergeData.onCfgReady();
        this.hunguIntensifyData.onCfgReady();
        this.hunguSkillData.onCfgReady();
        this.hunguCreateData.onCfgReady();
    }

    initialize() {
        let hero = G.UnitMgr.getRoleByUIN(G.DataMgr.heroData.roleID.m_uiUin);
        hero.onUpdateNameboard(null);//更新玩家
    }
    private setHunLiConfig(): void {
        let cfgs: GameConfig.HunLiConfigM[] = G.Cfgmgr.getCfg("data/HunLiConfigM.json") as GameConfig.HunLiConfigM[];
        for (let cfg of cfgs) {
            if (this.m_hunliCfg[cfg.m_ucLevel] == null) {
                this.m_hunliCfg[cfg.m_ucLevel] = {};
            }
            this.m_hunliCfg[cfg.m_ucLevel][cfg.m_ucStage] = cfg;
        }
    }

    private setHunHuanConfig(): void {
        let cfgs: GameConfig.HunHuanConfigM[] = G.Cfgmgr.getCfg("data/HunHuanConfigM.json") as GameConfig.HunHuanConfigM[];
        for (let cfg of cfgs) {
            this.m_arrayHunhuanCfg.push(cfg);
            this.m_hunhuanCfgByLevel[cfg.m_iRequireHunLiLevel] = cfg;
        }
        this.m_arrayHunhuanCfg.sort(this.sortHunhuanConfig);
    }

    /**
	 *魂骨升级
	 * @param config
	 * 
	 */
    private setHunGuEquipSlotConfig(): void {
        let configs = G.Cfgmgr.getCfg('data/HunGuSlotUpLvM.json') as GameConfig.HunGuSlotUpLvM[];
        for (let cfg of configs) {
            let subMap = this.m_hunguSlotLvMap[cfg.m_iEquipPart];

            if (!subMap) {
                this.m_hunguSlotLvMap[cfg.m_iEquipPart] = subMap = {};
            }
            subMap[cfg.m_usLevel] = cfg;

            let subMap1 = this.m_hunguSlotDropLevelMap[cfg.m_iEquipPart];
            if (!subMap1) {
                this.m_hunguSlotDropLevelMap[cfg.m_iEquipPart] = subMap1 = {};
            }
            subMap1[cfg.m_ucLimitDropLevel] = cfg;
        }
    }

    /**通过魂骨 部位和等级取部位配置 */
    public getHunGuEquipSlotConfigByPartAndLv(part: number, lv: number): GameConfig.HunGuSlotUpLvM {
        let subMap = this.m_hunguSlotLvMap[part];
        if (subMap) {
            return subMap[lv];
        }
        return null;
    }

    /**通过魂骨 部位和品质取部位配置 */
    public getHunGuEquipSlotConfigByPartAndDropLevel(part: number, dropLevel: number): GameConfig.HunGuSlotUpLvM {
        let subMap = this.m_hunguSlotDropLevelMap[part];
        if (subMap) {
            return subMap[dropLevel];
        }
        return null;
    }

    /**
     * 一个魂骨是否可以升级
     * @param part 装备位 100-108
     */
    isOnceHunguSJ(part: number): boolean {
        let hunguDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let data = hunguDatas[part - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN];
        if (data == null) return false;
        let lv = G.DataMgr.equipStrengthenData.getSlotRegineLv(part - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN);
        if (lv < G.DataMgr.heroData.level) {
            let dropLevel = data.config.m_iDropLevel;
            if (dropLevel > this.HUNGU_SJ_MAXDROPLEVEL) dropLevel = this.HUNGU_SJ_MAXDROPLEVEL;
            let cfg = this.getHunGuEquipSlotConfigByPartAndDropLevel(data.config.m_iEquipPart, dropLevel);
            if (cfg == null) return false;
            let max = 0;
            if (lv < 499) {
                max = cfg.m_iOneKeyMaxLv - 1;
            } else {
                max = cfg.m_iOneKeyMaxLv + 1;
            }
            if (lv < max) {//没有升级到最大限制等级
                cfg = this.getHunGuEquipSlotConfigByPartAndLv(data.config.m_iEquipPart, lv + 1);
                if (cfg == null) return false;
                if (G.DataMgr.heroData.tongqian >= cfg.m_astCost[0].m_iNumber) {//有足够的金币
                    let num = G.DataMgr.thingData.getThingNum(cfg.m_astCost[1].m_iItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false)
                    if (num >= cfg.m_astCost[1].m_iNumber) {//有足够的材料
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 魂骨升级红点
     */
    isHunguSJPanelMark(): boolean {
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        if (equipDatas == undefined || equipDatas == null) return false;
        for (let i = 0; i < G.DataMgr.hunliData.HUNGU_COUNT; i++) {
            let data = equipDatas[i];
            if (data == null) continue;
            let lv = G.DataMgr.equipStrengthenData.getSlotRegineLv(i);
            if (lv < G.DataMgr.heroData.level) {
                let dropLevel = data.config.m_iDropLevel;
                if (dropLevel > this.HUNGU_SJ_MAXDROPLEVEL) dropLevel = this.HUNGU_SJ_MAXDROPLEVEL;
                let cfg = this.getHunGuEquipSlotConfigByPartAndDropLevel(data.config.m_iEquipPart, dropLevel);
                if (cfg == null) continue;
                let max = 0;
                if (lv < 499) {
                    max = cfg.m_iOneKeyMaxLv - 1;
                } else {
                    max = cfg.m_iOneKeyMaxLv + 1;
                }
                if (lv < max) {//没有升级到最大限制等级
                    cfg = this.getHunGuEquipSlotConfigByPartAndLv(data.config.m_iEquipPart, lv + 1);
                    if (cfg == null) continue;
                    if (G.DataMgr.heroData.tongqian >= cfg.m_astCost[0].m_iNumber) {//有足够的金币
                        let num = G.DataMgr.thingData.getThingNum(cfg.m_astCost[1].m_iItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false)
                        if (num >= cfg.m_astCost[1].m_iNumber) {//有足够的材料
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    /** 
     * 魂环晋升
    */
    private sethunhuanLevelUpConfig(): void {
        let cfgs: GameConfig.HunHuanLevelUpConfigM[] = G.Cfgmgr.getCfg("data/HunHuanLevelUpConfigM.json") as GameConfig.HunHuanLevelUpConfigM[];
        for (let cfg of cfgs) {
            if (this.m_hunhuanLevelUpCfgById[cfg.m_iID] == null) {
                this.m_hunhuanLevelUpCfgById[cfg.m_iID] = {};
            }
            let maps = this.m_hunhuanLevelUpCfgById[cfg.m_iID];
            if (maps[cfg.m_iLevel] == null) {
                maps[cfg.m_iLevel] = cfg;
            }

        }
    }

    private initAssistConfig() {
        this.setEquipPartConfig();
        this.initColor();
        this.initEquipClass();
    }

    private indexColor: { [Color: number]: number }
    private indexColorString: { [color: number]: string }

    private initColor() {
        this.indexColor = {};
        this.indexColor[0] = 0;
        this.indexColor[102] = 1;
        this.indexColor[103] = 2;
        this.indexColor[104] = 3;
        this.indexColor[105] = 4;
        this.indexColor[106] = 5;
        this.indexColor[107] = 6;

        this.indexColorString = {};
        this.indexColorString[0] = "";
        this.indexColorString[KeyWord.COLOR_BLUE] = "49B9FFFF";
        this.indexColorString[KeyWord.COLOR_PURPLE] = "CE49FFFF";
        this.indexColorString[KeyWord.COLOR_ORANGE] = "FF842BFF";
        this.indexColorString[KeyWord.COLOR_GOLD] = "FFED26FF";
        this.indexColorString[KeyWord.COLOR_RED] = "FF4949FF";
        this.indexColorString[KeyWord.COLOR_PINK] = "73e5b4";
    }


    private initEquipClass() {
        for (let i = 0; i < this.HUNGU_COUNT; i++) {
            //500   520
            let mainClass = [KeyWord.HUNGU_EQUIP_MAINCLASS_MIN + i, KeyWord.HUNGU_EQUIP_MAINCLASS_MIN + i + 20];
            this.Hungu_Index2Part[i] = mainClass;
        }
    }

    getSelectedIndexForColor(color: number): number {
        return this.indexColor[color];
    }

    getQualityIndexForColor(color: number): string {
        return this.indexColorString[color];
    }

    private numberToPart: { [number: number]: number };
    private setEquipPartConfig() {
        this.numberToPart = {};
        let count = KeyWord.HUNGU_EQUIP_PARTCLASS_MAX - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN;
        for (let i = 0; i < count; i++) {
            this.numberToPart[i] = i + KeyWord.HUNGU_EQUIP_PARTCLASS_MIN;
        }
    }

    private sortHunhuanConfig(a: GameConfig.HunHuanConfigM, b: GameConfig.HunHuanConfigM) {
        return a.m_iRequireHunLiLevel - b.m_iRequireHunLiLevel;
    }

    /**
     * 获取魂力信息
     * @param level 魂力等级
     * @param node 节点等级
     */
    getHunLiConfigByLevel(level: number, node: number): GameConfig.HunLiConfigM {
        let cfg = this.m_hunliCfg[level];
        if (cfg) {
            return cfg[node];
        }
        return null;
    }

    /**
     * 获取魂力信息
     * @param index 节点位置 0 1 2 3 4 
     */
    getHunLiConfigByIndex(index: number): GameConfig.HunLiConfigM {
        let level = Math.ceil((index + 1) / 3);
        let subLevel = index % 3 + 1;
        return this.getHunLiConfigByLevel(level, subLevel);
    }

    /**
     * 获取魂力等级 和 魂力子等级
     * @param index 1-25
     */
    getHunliLevelAndSubLevel(index: number): [number, number] {
        let lv: [number, number] = [0, 0];
        lv[0] = Math.ceil(index / 3);
        lv[1] = (index - 1) % 3 + 1;
        return lv;
    }

    /**
     * 获取当前正在做的魂力档次 
     * 从1开始
     */
    getNextIndex(): number {
        // 0 0 1   1 1 2  1 2 3  1 3 4
        return (Math.max(this.level, 1) - 1) * 3 + this.hunliNode + 1;
    }

    /**
     * 获取当前正在做的魂力等级
     * 1-9
     */
    getNextHunliLevel(): number {
        let index = this.getNextIndex();
        return Math.ceil(index / 3);
    }

    /**
     *  获取当前正在做的魂力节点等级
     *  1-3
     */
    getNextHunliSubLevel(): number {
        let index = this.getNextIndex();
        return (index - 1) % 3 + 1;
    }

    /**
     * 获取当前正在做的魂力信息
     */
    getNextHunliConfig(): GameConfig.HunLiConfigM {
        let index = this.getNextIndex();
        let curHunliLevel = Math.ceil(index / 3);
        let curHunliSubLevel = (index - 1) % 3 + 1;
        return this.getHunLiConfigByLevel(curHunliLevel, curHunliSubLevel);
    }

    /**
     * 获取魂力条件完成数值
     * @param condType 类型
     * @param confg 数据
     */
    getHunliConditionNumber(condType: number, confg: GameConfig.HunLiConditionClient): number {
        let condNumber = 0;
        switch (condType) {
            case KeyWord.HUNLI_CONDITION_PIN_PASS:
                condNumber = 1;
                break;
            case KeyWord.HUNLI_CONDITION_KILL_BOSS:
                condNumber = confg.m_iValue2;
                break;
            case KeyWord.HUNLI_CONDITION_SUIT_COLLECT:
                condNumber = confg.m_iValue2;
                break;
            case KeyWord.HUNLI_CONDITION_GOD_POWER:
                break;
            case KeyWord.HUNLI_CONDITION_QUESTION_FINISH:
                condNumber = 1;
                break;
            case KeyWord.HUNLI_CONDITION_HUNGU_EQUIP:
                condNumber = confg.m_iValue3;
                break;
        }
        return condNumber;
    }

    /**
     * 获取魂力当前任务跳转 (-1无效信息  0未达成  1已达成)
     */
    getHunliCurrentTask(): [number, number, number] {
        let returnInfo: [number, number, number] = [-1, -1, -1];
        let data = this.getHunLiConfigByLevel(this.level + 1, this.hunliNode);
        if (data == null) return null;
        let count = data.m_astConditionList.length;
        let curData = this.conditionInfo[this.getNextHunliSubLevel() - 1].m_astConditionFinish;
        for (let i = 0; i < count; i++) {
            let item = curData[i];
            //去除已领取
            if (item.m_ucRewardGet == 2) {
                returnInfo[i] = 1;
                continue;
            }
            //判断是否完成
            //达成条件转换
            let condNumber: number = -1;
            switch (data.m_astConditionList[i].m_ucType) {
                case KeyWord.HUNLI_CONDITION_PIN_PASS:
                    condNumber = 1;
                    break;
                case KeyWord.HUNLI_CONDITION_KILL_BOSS:
                    condNumber = data.m_astConditionList[i].m_iValue2;
                    break;
                case KeyWord.HUNLI_CONDITION_SUIT_COLLECT:
                    condNumber = data.m_astConditionList[i].m_iValue2;
                    break;
                case KeyWord.HUNLI_CONDITION_QUESTION_FINISH:
                    condNumber = 1;
                    break;
            }
            if (item.m_iFinishParam < condNumber) {
                returnInfo[i] = 0;
            }
            else {
                returnInfo[i] = 1;
            }
        }
        return returnInfo;
    }

    getHunHuanConfigByIndex(index: number): GameConfig.HunHuanConfigM {
        return this.m_arrayHunhuanCfg[index];
    }

    getHunHuanConfigByLevel(level: number): GameConfig.HunHuanConfigM {
        let cfg = this.m_hunhuanCfgByLevel[level];
        if (cfg == null) {
            uts.logError("魂环表配置出错：ID为 " + level);
            return null;
        }
        return this.m_hunhuanCfgByLevel[level];
    }

    getHunHuanConfigById(id: number): GameConfig.HunHuanConfigM {
        for (let cfg of this.m_arrayHunhuanCfg) {
            if (cfg.m_iID == id) {
                return cfg;
            }
        }
        return null;
    }

    getHunhuanIndexById(id: number): number {
        for (let cfg of this.m_arrayHunhuanCfg) {
            if (cfg.m_iID == id) {
                return this.m_arrayHunhuanCfg.indexOf(cfg);
            }
        }
        return -1;
    }

    getHunHuanLevelUpById(id: number, level: number): GameConfig.HunHuanLevelUpConfigM {
        let maps = this.m_hunhuanLevelUpCfgById[id];
        if (maps == null) {
            return;
        }
        let cfg = maps[level];
        if (cfg == null) {
            return;
        }
        return cfg;
    }

    /**
     * 当前进度完成百分比
     */
    getHunliProgress(): number {
        let result: number = 0;
        let confg = this.getNextHunliConfig();
        let count = confg.m_astConditionList.length;
        let nextSubNode = this.getNextHunliSubLevel();
        for (let i = 0; i < count; i++) {
            let finishParam = this.conditionInfo[nextSubNode - 1].m_astConditionFinish[i].m_ucRewardGet;
            if (finishParam == 2) {
                result++
            }
        }
        return result / count;
    }

    /**
     * 获取装备为id
     * @param index 
     */
    getEquipPartFromIndex(index: number) {
        return this.numberToPart[index];
    }



    /**
     * 魂骨随机属性（六件）
     */
    getHunguRandomProp(): { [id: number]: number } {
        return this.getAllRandomProp(0, this.HUNGU_COUNT_NORMAL);
    }

    /**
     * 特殊魂骨随机属性（三件）
     */
    getSpecialHunguRandomProp(): { [id: number]: number } {
        return this.getAllRandomProp(this.HUNGU_COUNT_NORMAL, this.HUNGU_COUNT);
    }

    /**
     * 获得随机属性
     */
    private getAllRandomProp(min: number, max: number): { [id: number]: number } {
        let rawObj: ThingItemData;
        let rawDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);

        let randomProps: { [id: number]: number } = {};
        let randomPropsArray = [];
        let randomPropLen = 0;

        for (let i = min; i < max; i++) {
            rawObj = rawDatas[i];

            if (rawObj == null) continue;
            let randAttr = rawObj.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_stRandAttr;
            let randLen = randAttr.m_aiPropAtt.length;
            let randProp = randAttr.m_aiPropAtt;
            for (let j = 0; j < randLen; j++) {
                if (randomProps[randProp[j].m_ucPropId] == null) {
                    randomProps[randProp[j].m_ucPropId] = randProp[j].m_iPropValue;
                    randomPropsArray[randomPropLen] = randProp[j].m_ucPropId;
                    randomPropLen++;
                }
                else {
                    randomProps[randProp[j].m_ucPropId] += randProp[j].m_iPropValue;
                }
            }
        }
        return randomProps;
    }

    /**
     * 获得随机属性(不包含其中一个)
     * 计算单魂骨战斗力时使用
     * @param once 
     */
    private getAllRandomPropExceptOnce(once: number): { [id: number]: number } {
        let rawObj: ThingItemData;
        let rawDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);

        let randomProps: { [id: number]: number } = {};

        let min = -1;
        let max = -1;
        if (this.isNormerHunguEquip(once + KeyWord.HUNGU_EQUIP_PARTCLASS_MIN)) {
            min = 0;
            max = 6;
        }
        else {
            min = 6;
            max = 9;
        }

        for (let i = min; i < max; i++) {
            rawObj = rawDatas[i];
            if (rawObj == null) continue;
            if (i == once) continue;
            let randAttr = rawObj.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_stRandAttr;
            let randLen = randAttr.m_aiPropAtt.length;
            let randProp = randAttr.m_aiPropAtt;
            for (let j = 0; j < randLen; j++) {
                if (randomProps[randProp[j].m_ucPropId] == null) {
                    randomProps[randProp[j].m_ucPropId] = randProp[j].m_iPropValue;
                }
                else {
                    randomProps[randProp[j].m_ucPropId] += randProp[j].m_iPropValue;
                }
            }
        }
        return randomProps;
    }

    /**
    * 获取单个魂骨战力
    * @param equip 魂骨装备数据 
    */
    getHunguEquipBasicFight(config: GameConfig.ThingConfigM): number {
        let allFight = 0;
        for (let i = 0, con = config.m_astBaseProp.length; i < con; i++) {
            let item = config.m_astBaseProp[i];
            allFight += FightingStrengthUtil.calStrengthByOneProp(item.m_ucPropId, item.m_ucPropValue);
        }
        return allFight;
    }

    /**
     * 获取单个魂骨战力
     * @param equip 魂骨装备数据 
     */
    getHunguEquipFight(config: GameConfig.ThingConfigM, data: Protocol.ContainerThingInfo) {
        if (this.isNormerHunguEquip(config.m_iEquipPart))
            return this.getNormerHunguFight(config, data.m_stThingProperty.m_stSpecThingProperty);
        else
            return this.getSpaceHunguFight(config, data.m_stThingProperty.m_stSpecThingProperty);
    }

    /**
    * 获取单个魂骨战力（同上，参数不同）
    * @param equip 魂骨装备数据 
    */
    getHunguEquipFightS(config: GameConfig.ThingConfigM, data: Protocol.SpecThingProperty) {
        if (this.isNormerHunguEquip(config.m_iEquipPart))
            return this.getNormerHunguFight(config, data);
        else
            return this.getSpaceHunguFight(config, data);
    }

    /**
     * 获取普通魂骨战力
     * @param equip 
     */
    private getNormerHunguFight(config: GameConfig.ThingConfigM, data: Protocol.SpecThingProperty): number {
        return this.calHunguEquipFight(config, data, 0, this.HUNGU_COUNT_NORMAL);
    }

    /**
     * 
     * @param equip 获取特殊魂骨战力
     */
    private getSpaceHunguFight(config: GameConfig.ThingConfigM, data: Protocol.SpecThingProperty): number {
        return this.calHunguEquipFight(config, data, this.HUNGU_COUNT_NORMAL, this.HUNGU_COUNT);
    }

    private calHunguEquipFight(config: GameConfig.ThingConfigM, data: Protocol.SpecThingProperty, min: number, max: number): number {
        let allFight: number = 0;
        let rawDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let attDatas: GameConfig.EquipPropAtt[] = [];
        let dicAttdatas: { [id: number]: number } = {};
        //普通魂骨 遍历属性
        for (let i = min; i < max; i++) {
            let data = rawDatas[i];
            if (config.m_iEquipPart == i + KeyWord.HUNGU_EQUIP_PARTCLASS_MIN) {
                attDatas = FightingStrengthUtil.mergeProp(attDatas, config.m_astBaseProp);
            }
            else {
                if (data == null) continue;
                attDatas = FightingStrengthUtil.mergeProp(attDatas, data.config.m_astBaseProp);
            }
        }

        let attcount = attDatas.length;
        for (let i = 0; i < attcount; i++) {
            if (dicAttdatas[attDatas[i].m_ucPropId] == null) {
                dicAttdatas[attDatas[i].m_ucPropId] = attDatas[i].m_ucPropValue;
            }
            else {
                dicAttdatas[attDatas[i].m_ucPropId] += attDatas[i].m_ucPropValue;
            }
        }

        //计算随机战力
        let randoms = data.m_stHunGuEquipInfo.m_stRandAttr.m_aiPropAtt;

        //处理一下随机属性

        //自己的随机属性对所有属性的增幅
        let dicrandoms: { [id: number]: number } = {};
        let listrandons: number[] = [];
        let randomcount = data.m_stHunGuEquipInfo.m_stRandAttr.m_ucNum;
        for (let i = 0; i < randomcount; i++) {
            if (dicrandoms[randoms[i].m_ucPropId] == null) {
                dicrandoms[randoms[i].m_ucPropId] = randoms[i].m_iPropValue;
                listrandons.push(randoms[i].m_ucPropId);
            }
            else {
                dicrandoms[randoms[i].m_ucPropId] += randoms[i].m_iPropValue;
            }
        }
        for (let i = 0, count = listrandons.length; i < count; i++) {
            let id = listrandons[i];
            let propData = dicAttdatas[id];
            let ran = dicrandoms[id];
            if (propData != null) {
                allFight += FightingStrengthUtil.calStrengthByOneProp(id, propData * (ran / 10000));
            }
        }
        //剩余所有随机属性对自己的增幅
        let allrandomAtt = this.getAllRandomPropExceptOnce(config.m_iEquipPart - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN);
        for (let i = 0, count = config.m_astBaseProp.length; i < count; i++) {
            let propData = config.m_astBaseProp[i];
            let random = allrandomAtt[propData.m_ucPropId];
            if (random != null) {
                allFight += FightingStrengthUtil.calStrengthByOneProp(propData.m_ucPropId, propData.m_ucPropValue * (random / 10000));
            }
        }

        //加基础战斗力 
        let attbase = config.m_astBaseProp;
        let attCount = attbase.length;
        for (let i = 0; i < attCount; i++) {
            let propData = attbase[i];
            allFight += FightingStrengthUtil.calStrengthByOneProp(propData.m_ucPropId, propData.m_ucPropValue);
        }
        return allFight;
    }

    /**
     * 计算魂力战力
     * @param level 
     */
    calFightVlaueByLevel(): number {
        let fightValue = 0;
        let data = this.m_hunliCfg[this.level];
        if (data == null)
            return 0;
        let props = data[this.hunliNode].m_astProp;
        for (let prop of props) {
            if (prop.m_ucPropId == 0) {
                continue;
            }
            if (prop.m_iPropValue != null) {
                fightValue += FightingStrengthUtil.calStrengthByOneProp(prop.m_ucPropId, prop.m_iPropValue);
            }
        }
        return fightValue;
    }

    /**
     * 是否是普通魂骨（仅限魂骨装备判断）
     * @param part 装备位 100-108
     */
    private isNormerHunguEquip(part: number): boolean {
        return part < KeyWord.HUNGU_EQUIP_PARTCLASS_MIN + this.HUNGU_COUNT_NORMAL;
    }

    getNormalHunguAllPropAndFighting(): [GameConfig.EquipPropAtt[], number] {
        return this.calHunguAllProp(0, this.HUNGU_COUNT_NORMAL);
    }

    getSpaceHunguAllPropAndFighting(): [GameConfig.EquipPropAtt[], number] {
        return this.calHunguAllProp(this.HUNGU_COUNT_NORMAL, this.HUNGU_COUNT);
    }

    private calHunguAllProp(min: number, max: number): [GameConfig.EquipPropAtt[], number] {
        let returnData: [GameConfig.EquipPropAtt[], number] = [[], 0];
        let hunguDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);

        //属性数据
        let normalProps: { [id: number]: number } = {};
        let normalPropsArray = [];
        let normalPropLen = 0;

        //战斗力
        let allFight = 0;

        for (let i = min; i < max; i++) {
            let hunguItemData = hunguDatas[i];
            if (hunguItemData == null) continue;

            let baseProp = hunguItemData.config.m_astBaseProp;
            let len = baseProp.length;

            //魂骨属性数据处理
            for (let j = 0; j < len; j++) {
                if (normalProps[baseProp[j].m_ucPropId] == null) {
                    normalProps[baseProp[j].m_ucPropId] = baseProp[j].m_ucPropValue;
                    normalPropsArray[normalPropLen] = baseProp[j].m_ucPropId;
                    normalPropLen++;
                }
                else {
                    normalProps[baseProp[j].m_ucPropId] += baseProp[j].m_ucPropValue;
                }
            }
        }
        let randomProps = this.getAllRandomProp(min, max);

        //计算所有随机属性相乘
        for (let j = 0; j < normalPropLen; j++) {
            let id = normalPropsArray[j];
            if (randomProps[id] != null) {
                normalProps[id] = Math.floor(normalProps[id] * (1 + randomProps[id] / 10000));
            }
            allFight += FightingStrengthUtil.calStrengthByOneProp(id, normalProps[id]);
            returnData[0].push({ "m_ucPropId": id, "m_ucPropValue": normalProps[id] });
        }

        returnData[1] = allFight;
        return returnData;
    }

    /**
     * 一个魂骨颜色是否符合
     * @param part 装备位 100-108
     */
    isOnceHunguColor(part: number) {
        let hunguDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let data = hunguDatas[part - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN];
        if (data == null) return false;
        return data.config.m_ucColor >= KeyWord.COLOR_RED;
    }

    /**
     * 魂力面板红点
     */
    isShowMark(): boolean {
        //获取下一级的条件
        // let confg = this.getHunLiConfigByLevel(this.level + 1, this.hunliNode);
        let confg = this.getNextHunliConfig();
        if (confg == null) return false;
        let len = confg.m_astConditionList.length;
        //条件的判断
        for (let i = 0; i < len; i++) {
            let subl = this.getNextHunliSubLevel() - 1;
            let item = this.conditionInfo[subl].m_astConditionFinish[i];
            //0未领  2已领
            if (item.m_ucRewardGet == 2) continue;

            //达成条件转换
            let condNumber: number = -1;
            let isfight = false;
            switch (confg.m_astConditionList[i].m_ucType) {
                case KeyWord.HUNLI_CONDITION_PIN_PASS:
                    //判断副本对应的boss战力是否符合
                    let data = PinstanceData.getDiffBonusData(confg.m_astConditionList[i].m_iValue1, confg.m_astConditionList[i].m_iValue2);
                    if (data.m_iFightPower <= G.DataMgr.heroData.fight && confg.m_iRequireLevel <= G.DataMgr.heroData.level) {
                        return true;
                    }
                    condNumber = 1;
                    break;
                case KeyWord.HUNLI_CONDITION_KILL_BOSS:
                    condNumber = confg.m_astConditionList[i].m_iValue2;
                    break;
                case KeyWord.HUNLI_CONDITION_SUIT_COLLECT:
                    condNumber = confg.m_astConditionList[i].m_iValue2;
                    break;
                case KeyWord.HUNLI_CONDITION_GOD_POWER:
                    break;
                case KeyWord.HUNLI_CONDITION_QUESTION_FINISH:
                    condNumber = 1;
                    break;
                case KeyWord.HUNLI_CONDITION_HUNGU_EQUIP:
                    condNumber = confg.m_astConditionList[i].m_iValue3;
                    break;
            }
            //判断完成
            if (item.m_iFinishParam >= condNumber)
                return true;
        }
        //领取条件
        if (confg.m_iRequireLevel > G.DataMgr.heroData.level) return false;
        //进阶的判断
        return this.getHunliProgress() == 1 ? true : false
    }

    /**
     * 魂环激活穿戴
     */
    showHunHuanMark() {
        //判断背包中是否有该物品
        if (this.level > 0) {
            let config;
            if (this.hunhuanId > 0) {
                config = this.getHunHuanConfigById(this.hunhuanId);
                if (this.level == 9 && config.m_iRequireHunLiLevel == 9) {
                    return;
                } else {
                    config = this.getHunHuanConfigById(this.hunhuanId + 1);
                    let has = G.DataMgr.thingData.getThingNum(config.m_iConsumeID, Macros.CONTAINER_TYPE_ROLE_BAG, false)
                    if (has > 0 && this.level >= config.m_iRequireHunLiLevel) { return true; }
                    else { return false; }
                }

            } else {
                config = this.getHunHuanConfigByLevel(1);
                let has = G.DataMgr.thingData.getThingNum(config.m_iConsumeID, Macros.CONTAINER_TYPE_ROLE_BAG, false)
                if (has > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    /**得到可以晋升的魂环 */
    canLevelUp(): number {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_HUNHUAN)) {
            return -1;
        }
        //已经激活每一个魂环是否晋升过 如果晋升过则判断等级
        let hasHaiShen = G.DataMgr.heroData.haishenhunli;
        let needHaiShen: number;
        if (this.hunhuanId > 0) {
            let activeHunHuanCfg = this.getHunHuanConfigById(this.hunhuanId);
            for (let i = 0; i < activeHunHuanCfg.m_iRequireHunLiLevel; i++) {
                let config = this.getHunHuanConfigByIndex(i);
                if (config != null) {
                    if (this.hunhuanLevelInfoList[i].m_ucLevel < 27) {
                        let levelUpConfig = this.getHunHuanLevelUpById(config.m_iID, this.hunhuanLevelInfoList[i].m_ucLevel + 1);
                        needHaiShen = levelUpConfig.m_iCost;
                        if (hasHaiShen >= needHaiShen) {
                            return i + 1;
                        }
                    }
                }
            }
        } else {
            return 0;
        }
    }
    /**当前激活的魂环数量 */
    activeHunhuanNum() {
        let hunhunNum: number = 0;
        if (this.hunhuanId > 0) {
            hunhunNum = Math.floor(this.hunhuanId % 10);
        }
        return hunhunNum;
    }
    /**魂骨收集红点 */
    hunGuCollectTipMark(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION)) return false;
        let equipSuitInfo = G.DataMgr.equipStrengthenData.equipSuitInfo;
        for (let i = 0; i < HunGuCollectPanel.YearsCount; i++) {
            let cfg = ThingData.getGodEquipCfgs(i + 1)[0];
            let stage = equipSuitInfo.m_ucStage;
            let num = equipSuitInfo.m_ucNum;

            let canActiveCount: number = this.getHunGuCollectCount(ThingData.getGodEquipCfgs(i + 1));
            let tipMark: boolean = ((stage == 0 || stage == cfg.m_iGrade) && num != HunGuCollectPanel.MaxCollectHunGuCount && canActiveCount >= num + 2) ||
                (num == HunGuCollectPanel.MaxCollectHunGuCount && stage == cfg.m_iGrade - 1 && canActiveCount >= HunGuCollectPanel.MinCollectHunGuCount);
            if (tipMark) return true;
        }

        return false;
    }
    /**
     * 获取已收集魂骨数量
     * @param cfg
     */
    getHunGuCollectCount(cfg: GameConfig.GetEquipCfgM[]): number {
        let count = 0;
        let equipItemDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        if (!equipItemDatas) return count;
        let hunliData = G.DataMgr.hunliData;
        for (let i = 0; i < hunliData.HUNGU_COUNT; i++) {
            let itemdata = equipItemDatas[i];
            let config = cfg[i]
            if (itemdata != null) {
                if (itemdata.config.m_iDropLevel > config.m_iGrade) {
                    count++;
                } else if (itemdata.config.m_iDropLevel == config.m_iGrade && itemdata.config.m_ucColor >= config.m_iColor) {
                    count++;
                }
            }
        }
        return count;
    }
}
