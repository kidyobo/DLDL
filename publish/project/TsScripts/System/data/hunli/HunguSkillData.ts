import { Global as G } from "System/global";
import { Macros } from "../../protocol/Macros";
import { FightingStrengthUtil } from "../../utils/FightingStrengthUtil";
import ThingData from "../thing/ThingData";
import { ThingItemData } from "../thing/ThingItemData";

export class HunguSkillData {

    private skillData: { [id: number]: { [level: number]: GameConfig.SkillConfigM } } = null;
    private hunguSkillData: { [part: number]: { [drop: number]: GameConfig.HunGuSkillFZConfigM } } = {};
    private materialIds: number[] = [];
    private skillIds: number[] = [];


    onCfgReady() {
        this.setHunguSkillData();
    }

    private setHunguSkillData(): void {
        let cfgs: GameConfig.HunGuSkillFZConfigM[] = G.Cfgmgr.getCfg("data/HunGuSkillFZConfigM.json") as GameConfig.HunGuSkillFZConfigM[];
        for (let cfg of cfgs) {
            if (this.hunguSkillData[cfg.m_iEquipPart] == null) {
                this.hunguSkillData[cfg.m_iEquipPart] = {};
            }
            this.hunguSkillData[cfg.m_iEquipPart][cfg.m_iDropLevel] = cfg;
        }
    }

    public addMaterialId(data: GameConfig.EquipConfigM) {
        if (data.m_iID % 10 == 1) return;
        this.materialIds.push(data.m_iID);
        this.skillIds.push(Math.floor(data.m_iFunctionID / 100));
    }

    /**
     * 获取武魂表里的二次封装数据
     * @param part 
     * @param drop 
     */
    public getHunguSkillData(part: number, drop: number) {
        return this.hunguSkillData[part][drop];
    }

    public isHunguSkillPanelTipMark(): boolean {
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        if (equipDatas == null)
            return false;
        for (let i = 0, con = G.DataMgr.hunliData.HUNGU_COUNT; i < con; i++) {
            let equip = equipDatas[i];
            if (equip == null) continue;
            if (this.onceHunguTipmark(equip))
                return true;
        }
        return false;
    }

    /**
     * 一个装备位是否有红点
     */
    public onceHunguTipmark(data: ThingItemData): boolean {
        if (data == null) return false;
        if (data.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_uiFengZhuangLevel == 0) return false;
        if (data.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_stSkillFZ.m_iItemID > 0) return false;

        let skillData = this.getHunguSkillData(data.config.m_iEquipPart, data.config.m_iDropLevel);
        if (!skillData) return false;

        let count = skillData.m_stCostItemList.length;
        for (let i = 0; i < count; i++) {
            let has = G.DataMgr.thingData.getThingNum(skillData.m_stCostItemList[i].m_iItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            if (has >= skillData.m_stCostItemList[i].m_iItemNumber) {
                return true;
            }
        }
        return false;
    }

    /**
     *  获取当前技能数据
     */
    public getCurrentSkillDatas(): [GameConfig.SkillConfigM, number][] {
        let datas: [GameConfig.SkillConfigM, number][] = [];
        let skilllevelData = this.getSkillLevelData();
        for (let i = 0, count = this.skillIds.length; i < count; i++) {
            let skilldata = this.getSkillData(this.skillIds[i], skilllevelData[this.skillIds[i]]);
            if (skilldata == null) {
                uts.logError("技能id不存在 id:" + this.skillIds[i].toString() + skilllevelData[this.skillIds[i]].toString() + "level:" + skilllevelData[this.skillIds[i]].toString());
            }
            datas[i] = [skilldata, skilllevelData[this.skillIds[i]]]
        }
        datas.sort((a: [GameConfig.SkillConfigM, number], b: [GameConfig.SkillConfigM, number]) => {
            return b[1] - a[1];
        });
        return datas;
    }

    /**
     * 获取背包中的所有技能石
     */
    public getAllMaterialData(index: number): ThingItemData[] {
        let materials: ThingItemData[] = [];

        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let equipData = equipDatas[index];
        if (equipData == null) return materials;
        let skill = this.getHunguSkillData(equipData.config.m_iEquipPart, equipData.config.m_iDropLevel);
        if (!skill) return materials;

        for (let i = 0, con = skill.m_stCostItemList.length; i < con; i++) {
            let thingdata = new ThingItemData();
            thingdata.config = ThingData.getThingConfig(skill.m_stCostItemList[i].m_iItemID);
            thingdata.data = {} as Protocol.ContainerThingInfo;
            thingdata.data.m_iNumber = G.DataMgr.thingData.getThingNum(skill.m_stCostItemList[i].m_iItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            if (thingdata.data.m_iNumber > 0)
                materials.push(thingdata);
        }
        return materials;
    }

    public getHunguSkillPanelFight(): number {
        let allfight = 0;
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        for (let i = 0; i < G.DataMgr.hunliData.HUNGU_COUNT; i++) {
            let equipData = equipDatas[i];
            if (equipData == null) continue;
            if (equipData.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_stSkillFZ.m_iItemID == 0) continue;
            let skill = this.getHunguSkillData(equipData.config.m_iEquipPart, equipData.config.m_iDropLevel);
            if (!skill) continue;
            if (i < G.DataMgr.hunliData.HUNGU_COUNT_NORMAL)
                allfight += this.getHunguPropMultiplyRandomProp(skill.m_astProp)[1];
            else
                allfight += this.getSpecialHunguPropMultiplyRandomProp(skill.m_astProp)[1];
        }
        return allfight;
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

    public getAllMaterialId(): number[] {
        return this.materialIds;
    }

    private getAllSkillId(): number[] {
        return this.skillIds;
    }

    /**
     * 获取技能表里的技能数据
     * @param skillid 技能id/100
     * @param level 等级
     */
    public getSkillData(skillid: number, level: number) {
        if (this.skillData == null) {
            this.skillData = {};
            let datas = G.DataMgr.skillData.getRebirthSkill();
            let count = datas.length;
            for (let i = 0; i < count; i++) {
                let data = datas[i];
                let id = Math.floor(data.m_iSkillID / 100);
                if (this.skillData[id] == null)
                    this.skillData[id] = {};
                this.skillData[id][data.m_ushSkillLevel] = data;
            }
        }
        if (level == 0)
            level = 1;
        return this.skillData[skillid][level];
    }


    /**
     * 获取当前技能等级数据
     */
    private getSkillLevelData(): { [skillid: number]: number } {
        let datas: { [skillid: number]: number } = {};
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        for (let i = 0; i < G.DataMgr.hunliData.HUNGU_COUNT; i++) {
            let equipdata = equipDatas[i];
            if (equipdata == null) continue;
            let materialId = equipdata.data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo.m_stSkillFZ.m_iItemID;
            if (materialId > 0) {
                let materialdata = ThingData.getThingConfig(materialId);
                let skillid = Math.floor(materialdata.m_iFunctionID / 100);
                let level = this.getHunguSkillData(equipdata.config.m_iEquipPart, equipdata.config.m_iDropLevel);
                if (!level) continue;
                if (datas[skillid] == null)
                    datas[skillid] = level.m_iSkillLevel;
                else
                    datas[skillid] += level.m_iSkillLevel;
            }
        }
        //处理一下，避免空值
        for (let i = 0, con = this.materialIds.length; i < con; i++) {
            let skillid = this.skillIds[i];
            if (datas[skillid] == null)
                datas[skillid] = 0;
        }
        return datas;
    }
}