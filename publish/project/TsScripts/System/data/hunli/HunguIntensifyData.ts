import { Global as G } from "System/global";
import { KeyWord } from "../../constants/KeyWord";
import { Macros } from "../../protocol/Macros";
import { FightingStrengthUtil } from "../../utils/FightingStrengthUtil";
import { ThingItemData } from "../thing/ThingItemData";


export class HunguIntensifyData {
    readonly HUNGU_COUNT: number = 9;
    readonly HUNGU_COUNT_NORMAL: number = 6;
    readonly HUNGU_COUNT_SPECIAL: number = 3;
    private m_hunguFZCfgByPart: { [part: number]: { [level: number]: GameConfig.HunGuFZConfigM } } = {};
    private m_hunguTZCfgByPart: { [part: number]: GameConfig.HunGuTZConfigM[] } = {};

    onCfgReady() {
        this.setHunHuanFZConfig();
        this.setHunHuanTZConfig();
    }

    /**
     * 魂骨封装数据
     */
    private setHunHuanFZConfig(): void {
        let cfgs: GameConfig.HunGuFZConfigM[] = G.Cfgmgr.getCfg("data/HunGuFZConfigM.json") as GameConfig.HunGuFZConfigM[];
        for (let cfg of cfgs) {
            if (this.m_hunguFZCfgByPart[cfg.m_iEquipPart] == null) {
                this.m_hunguFZCfgByPart[cfg.m_iEquipPart] = {};
            }
            let maps = this.m_hunguFZCfgByPart[cfg.m_iEquipPart];
            if (maps[cfg.m_iDropLevel] == null) {
                maps[cfg.m_iDropLevel] = cfg;
            }
        }
    }

    /**
     * 魂骨套装数据
     */
    private setHunHuanTZConfig(): void {
        let cfgs: GameConfig.HunGuTZConfigM[] = G.Cfgmgr.getCfg("data/HunGuTZConfigM.json") as GameConfig.HunGuTZConfigM[];
        for (let cfg of cfgs) {
            if (this.m_hunguTZCfgByPart[cfg.m_iDropLevel] == null) {
                this.m_hunguTZCfgByPart[cfg.m_iDropLevel] = [];
            }
            let maps = this.m_hunguTZCfgByPart[cfg.m_iDropLevel];
            maps.push(cfg);
        }
    }

    /**
     * 获取魂骨封装数据
     * @param part 装备位
     * @param level 档次（1-11）
     */
    getHunGuFZCfg(part: number, level: number) {
        let maps = this.m_hunguFZCfgByPart[part];
        if (maps == null) {
            uts.logError(uts.format("@jaocson  检查魂骨装备位“{0}”，是否正确。。。", KeyWord.getDesc(KeyWord.GROUP_HUNGU_EQUIP_PART, part)));
        }
        let cfg = maps[level];
        if (cfg == null) {
            uts.logError(uts.format("@jaocson  检查魂骨装备位“{0}”，对应的等级{1}是否正确。。。", KeyWord.getDesc(KeyWord.GROUP_HUNGU_EQUIP_PART, part), level));
        }
        return cfg;
    }

    /**
     * 获取魂骨封装面板总战力
     */
    getHunguFZAllFighting(): number {
        let allFight: number = 0;
        allFight += this.getHunguSuitFighting();
        allFight += this.getHunguFZFighting();
        return allFight;
    }
    /**
     * 魂骨套装的战斗力
     */
    private getHunguSuitFighting(): number {
        let allFight: number = 0;
        //套装战斗力
        //获取所有阶  例如：1阶    2阶
        let drops = this.getHunguEquipAllDrop();
        let dropscount = drops.length;
        for (let i = 0; i < dropscount; i++) {
            //同阶装备位  例如：1阶 1 3 4     2阶 2 5 
            let droppart = this.getSuitIndexFormDrop(drops[i]);
            if (droppart == null) continue;
            let dropnum = droppart.length;
            //套装属性  例如：1阶套装属性
            let equippart = this.getHunGuTZCfg(drops[i]);
            let equipnum = equippart.length;
            //比较数量关系 是否满足套装件数
            for (let j = 0; j < equipnum; j++) {
                if (dropnum >= equippart[j].m_iNumber) {
                    //加属性
                    for (let k = 0; k < equippart[j].m_astProp.length; k++) {
                        allFight += FightingStrengthUtil.calStrengthByOneProp(equippart[j].m_astProp[k].m_ucPropId, equippart[j].m_astProp[k].m_iPropValue);
                    }
                }
            }
        }
        return allFight;
    }

    /**
     * 获取魂骨套装数据
     * @param drop 档次
     */
    getHunGuTZCfg(drop: number): GameConfig.HunGuTZConfigM[] {
        let maps = this.m_hunguTZCfgByPart[drop];
        if (maps == null) {
            uts.logError(uts.format("@jaocson  检查魂骨档次“{0}”，是否正确。。。", drop));
        }
        return maps;
    }

    /**
     * 获取同档次的装备
     * @param drop 档次
     */
    getSuitIndexFormDrop(drop: number): number[] {
        let dicSuitIndexFormLevel: { [level: number]: number[] } = {};
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let count = this.HUNGU_COUNT_NORMAL;
        for (let i = 0; i < count; i++) {
            if (equipDatas[i] == null) continue;
            if (equipDatas[i].data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_uiFengZhuangLevel == 0) continue;

            let drop = equipDatas[i].config.m_iDropLevel;
            if (dicSuitIndexFormLevel[drop] == null) {
                dicSuitIndexFormLevel[drop] = [];
            }
            dicSuitIndexFormLevel[drop].push(i);
        }
        return dicSuitIndexFormLevel[drop];
    }

    /**
     * 获取所有阶数
     */
    private getHunguEquipAllDrop(): number[] {
        let drops: number[] = [];
        let map: { [drop: number]: number[] } = {};
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        for (let i = 0; i < this.HUNGU_COUNT_NORMAL; i++) {
            let itemdata = equipDatas[i];
            if (itemdata == null) continue;
            if (map[itemdata.config.m_iDropLevel] == null) {
                map[itemdata.config.m_iDropLevel] = [];
                drops.push(itemdata.config.m_iDropLevel);
            }
        }
        return drops;
    }

    /**
     * 魂骨封装战斗力
     */
    private getHunguFZFighting(): number {
        let ctnSize = this.HUNGU_COUNT;
        let rawDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);

        let rawObj: ThingItemData;

        //属性数据
        let normalProps: { [id: number]: number } = {};
        let normalPropsArray = [];
        let normalPropLen = 0;
        let specialProps: { [id: number]: number } = {};
        let specialPropsArray = [];
        let specialPropLen = 0;

        let randomProps = G.DataMgr.hunliData.getHunguRandomProp();
        let specialRandomProps = G.DataMgr.hunliData.getSpecialHunguRandomProp();

        //战斗力
        let allFight = 0;

        for (let i = 0; i < ctnSize; i++) {
            rawObj = rawDatas[i];
            if (rawObj == null) continue;
            let isintensify = rawObj.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_uiFengZhuangLevel == 0 ? false : true;
            if (!isintensify) continue;

            let p = this.getHunGuFZCfg(rawObj.config.m_iEquipPart, rawObj.config.m_iDropLevel).m_astProp;// rawObj.config.m_astBaseProp;
            let len = p.length;

            if (i < this.HUNGU_COUNT_NORMAL) {
                //魂骨属性数据处理
                for (let j = 0; j < len; j++) {
                    if (normalProps[p[j].m_ucPropId] == null) {
                        normalProps[p[j].m_ucPropId] = p[j].m_iPropValue;
                        normalPropsArray[normalPropLen] = p[j].m_ucPropId;
                        normalPropLen++;
                    }
                    else {
                        normalProps[p[j].m_ucPropId] += p[j].m_iPropValue;
                    }
                }
            }
            else {
                //外附魂骨数据
                for (let j = 0; j < len; j++) {
                    if (specialProps[p[j].m_ucPropId] == null) {
                        specialProps[p[j].m_ucPropId] = p[j].m_iPropValue;
                        specialPropsArray[specialPropLen] = p[j].m_ucPropId;
                        specialPropLen++;
                    }
                    else {
                        specialProps[p[j].m_ucPropId] += p[j].m_iPropValue;
                    }
                }
            }
        }
        //计算所有随机属性相乘
        let normalAtt: GameConfig.EquipPropAtt[] = [];
        let specialAtt: GameConfig.EquipPropAtt[] = [];
        for (let j = 0; j < normalPropLen; j++) {
            let id = normalPropsArray[j];
            if (randomProps[id] != null) {
                normalProps[id] = Math.floor(normalProps[id] * (1 + randomProps[id] / 10000));
            }
            normalAtt[j] = { "m_ucPropId": id, "m_ucPropValue": normalProps[id] };

        }
        allFight += FightingStrengthUtil.calStrength(normalAtt);

        for (let j = 0; j < specialPropLen; j++) {
            let id = specialPropsArray[j];
            if (specialRandomProps[id] != null) {
                specialProps[id] = Math.floor(specialProps[id] * (1 + specialRandomProps[id] / 10000));
            }
            specialAtt[j] = { "m_ucPropId": id, "m_ucPropValue": specialProps[id] };
        }
        allFight += FightingStrengthUtil.calStrength(specialAtt);
        return allFight;
    }

    /**
     * 一个魂骨是否可以封装
     * @param part 装备位 100-108
     */
    isOnceHunguFZ(part: number) {
        let hunguDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        if (hunguDatas) {
            let data = hunguDatas[part - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN];
            if (data == null) return false;
            if (data.config.m_ucColor < KeyWord.COLOR_RED) return false;
            if (data.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_uiFengZhuangLevel > 0) return false;

            let fzData = this.getHunGuFZCfg(part, data.config.m_iDropLevel);
            let has = G.DataMgr.thingData.getThingNum(fzData.m_iItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            return has >= fzData.m_iItemNumber;
        } else {
            return false;
        }
    }

    /**
     * 是否有可以封装的魂骨
     */
    isHunguFZPanelMark(): boolean {
        for (let i = 0; i < G.DataMgr.hunliData.HUNGU_COUNT; i++) {
            let iscan = this.isOnceHunguFZ(i + KeyWord.HUNGU_EQUIP_PARTCLASS_MIN);
            if (iscan)
                return true;
        }
        return false;
    }

    /**
     * 封装属性*随机属性（普通魂骨）
     * @param normalAtt 封装属性
     */
    getHunguPropMultiplyRandomProp(normalAtt: GameConfig.HunGuFZAbility[]): [GameConfig.HunGuFZAbility[], number] {
        let retuval: [GameConfig.HunGuFZAbility[], number] = [[], 0];
        let fight = 0;
        let randomProps = G.DataMgr.hunliData.getHunguRandomProp();
        let count = normalAtt.length;
        for (let i = 0; i < count; i++) {
            let id = normalAtt[i].m_ucPropId;
            let item: GameConfig.HunGuFZAbility;
            if (randomProps[id] != null) {
                item = {
                    "m_ucPropId": normalAtt[i].m_ucPropId,
                    "m_iPropValue": Math.floor(normalAtt[i].m_iPropValue * (1 + randomProps[id] / 10000))
                };
            }
            else {
                item = {
                    "m_ucPropId": normalAtt[i].m_ucPropId,
                    "m_iPropValue": normalAtt[i].m_iPropValue
                };
            }
            retuval[0].push(item);
            fight += FightingStrengthUtil.calStrengthByOneProp(item.m_ucPropId, item.m_iPropValue);
        }
        retuval[1] = fight;
        return retuval;
    }

    /**
     * 封装属性*随机属性（外附魂骨）
     * @param normalAtt 封装属性
     */
    getSpecialHunguPropMultiplyRandomProp(normalAtt: GameConfig.HunGuFZAbility[]): [GameConfig.HunGuFZAbility[], number] {
        let retuval: [GameConfig.HunGuFZAbility[], number] = [[], 0];
        let fight = 0;
        let randomProps = G.DataMgr.hunliData.getSpecialHunguRandomProp();
        let count = normalAtt.length;
        for (let i = 0; i < count; i++) {
            let id = normalAtt[i].m_ucPropId;
            let item: GameConfig.HunGuFZAbility;
            if (randomProps[id] != null) {
                item = {
                    "m_ucPropId": normalAtt[i].m_ucPropId,
                    "m_iPropValue": Math.floor(normalAtt[i].m_iPropValue * (1 + randomProps[id] / 10000))
                };
            }
            else {
                item = {
                    "m_ucPropId": normalAtt[i].m_ucPropId,
                    "m_iPropValue": normalAtt[i].m_iPropValue
                };
            }
            retuval[0].push(item);
            fight += FightingStrengthUtil.calStrengthByOneProp(item.m_ucPropId, item.m_iPropValue);
        }

        retuval[1] = fight;
        return retuval;
    }
}