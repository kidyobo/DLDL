import { Global as G } from "System/global";
import { GameIDType } from "../../constants/GameEnum";
import { KeyWord } from "../../constants/KeyWord";
import { HunguMergePanel } from "../../hungu/HunguMergePanel";
import { HunGuView } from "../../hungu/HunGuView";
import { Macros } from "../../protocol/Macros";
import { ProtocolUtil } from "../../protocol/ProtocolUtil";
import { ThingItemData } from "../thing/ThingItemData";
import { Color } from "../../utils/ColorUtil";
import { coroutine } from "../../../uts/coroutine";

export class HunguMergeData {

    private hunguEquipMap: { [part: number]: { [drop: number]: { [color: number]: { [level: number]: { [prof: number]: GameConfig.ThingConfigM } } } } } = {};
    private hunguMergeMapById: { [id: number]: GameConfig.HunGuMergeM } = {};
    private hunguMergeMap: { [part: number]: { [drop: number]: { [color: number]: GameConfig.HunGuMergeM } } } = {};
    private hunguMergeData: GameConfig.HunGuMergeM[] = [];
    private hunguMergeGroupData: { [prop: number]: GameConfig.HunGuMergeM[] } = {};
    private hunguFirstGroupDatas: number[] = [];
    private hunguCanFirstGroupDatas: number[] = [];
    private hunguEquipRandProp: { [part: number]: { [level: number]: GameConfig.HunGuEquipRandPropM } } = {};
    private hunguEquipRandPropById: { [id: number]: GameConfig.HunGuEquipRandPropM } = {};


    curMergeEquipDatas: ThingItemData[] = [];
    curMergeMaterialDatas: ThingItemData[] = [];

    //加点限制，减小查找的压力，取第一行的值
    private minColor: number = 0;
    private minQuality: number = 0;
    mergeEquipMaxNumber: number = 2;
    mergeMaterialMaxNumber: number = 8;

    isShowMergeMessage: boolean = false;
    isShowMergeProfMessage: boolean = false;

    onCfgReady() {
        this.setHunguMergeData();
        this.setHunguRandPropData();
    }

    ////////////////////////本地数据初始化//////////////////////////////////
    /**
     * 魂骨升华表 数据
     */
    private setHunguMergeData(): void {
        let data: GameConfig.HunGuMergeM[] = G.Cfgmgr.getCfg('data/HunGuMergeM.json') as GameConfig.HunGuMergeM[];

        for (let equipData of data) {
            this.hunguMergeData.push(equipData);
            //装备位 + 掉落档次(年代) + 颜色(品质) + 星级
            let part = equipData.m_ucEquipPart;
            let drop = equipData.m_ucTargetQuality;
            let color = equipData.m_ucTargetColour;
            if (this.hunguMergeMap[part] == null) {
                this.hunguMergeMap[part] = {};
            }
            if (this.hunguMergeMap[part][drop] == null) {
                this.hunguMergeMap[part][drop] = {};
            }
            this.hunguMergeMap[part][drop][color] = equipData;
            this.hunguMergeMapById[equipData.m_iID] = equipData;

            if (this.hunguMergeGroupData[drop] == null) {
                this.hunguMergeGroupData[drop] = [];
                this.hunguFirstGroupDatas.push(drop);
            }
            this.hunguMergeGroupData[drop].push(equipData);
        }
        this.hunguMergeData.sort((a: GameConfig.HunGuMergeM, b: GameConfig.HunGuMergeM): number => {
            return a.m_iID - b.m_iID;
        });

        for (var key in this.hunguMergeGroupData) {
            let data = this.hunguMergeGroupData[key];
            data.sort((a: GameConfig.HunGuMergeM, b: GameConfig.HunGuMergeM): number => {
                return a.m_ucEquipPart - b.m_ucEquipPart;
            });
        }
        this.hunguFirstGroupDatas.sort((a: number, b: number): number => {
            return a - b;
        });
        this.minColor = this.hunguMergeData[0].m_stMaterial[0].m_iColour;
        this.minQuality = this.hunguMergeData[0].m_stMaterial[0].m_iQuality;
    }

    /**
     * 魂骨随机属性表
     */
    private setHunguRandPropData() {
        let cfgs: GameConfig.HunGuEquipRandPropM[] = G.Cfgmgr.getCfg('data/HunGuEquipRandPropM.json') as GameConfig.HunGuEquipRandPropM[];
        for (let cfg of cfgs) {
            if (this.hunguEquipRandProp[cfg.m_iEquipPart] == null) {
                this.hunguEquipRandProp[cfg.m_iEquipPart] = {};
            }
            this.hunguEquipRandProp[cfg.m_iEquipPart][cfg.m_iLevel] = cfg;
            this.hunguEquipRandPropById[cfg.m_iID] = cfg;
        }
    }

    /**
     * 魂骨基础逻辑表 数据（在thingdata里边取值）
     * @param equipData 
     */
    public addHunguEquipToMap(equipData: GameConfig.ThingConfigM) {
        //装备位 + 掉落档次(年代) + 颜色(品质) + 星级
        let part = equipData.m_iEquipPart;
        let drop = equipData.m_iDropLevel;
        let color = equipData.m_ucColor;
        let level = equipData.m_ucStage;
        let prof = equipData.m_ucProf;

        if (this.hunguEquipMap[part] == null) {
            this.hunguEquipMap[part] = {};
        }
        if (this.hunguEquipMap[part][drop] == null) {
            this.hunguEquipMap[part][drop] = {};
        }
        if (this.hunguEquipMap[part][drop][color] == null) {
            this.hunguEquipMap[part][drop][color] = {};
        }
        if (this.hunguEquipMap[part][drop][color][level] == null) {
            this.hunguEquipMap[part][drop][color][level] = {};
        }
        this.hunguEquipMap[part][drop][color][level][prof] = equipData;
    }

    /////////////////////////////////状态变化///////////////////////////////////////////
    onChangeAddEquip: () => void;
    /**材料的临时数据变化 */
    public addEquipCfgChange() {
        if (this.onChangeAddEquip != null)
            this.onChangeAddEquip();
    }

    /**
     * 魂骨升华响应（服务器）
     * @param msg 服务器数据
     */
    public onHunguMergeResponse(msg: Protocol.HunGuMerge_Response) {
        let hunguMergePanel = G.Uimgr.getSubFormByID(HunGuView, KeyWord.OTHER_FUNCTION_HUNGUN_MERGE) as HunguMergePanel;
        if (hunguMergePanel != null && hunguMergePanel.isOpened) {
            if (msg.m_ushResultID == 0) {
                //失败
                hunguMergePanel.mergeDefeatedResponse();
            }
            else if (msg.m_ushResultID == 1) {
                //成功
                hunguMergePanel.mergeSuccendResponse();
            }
        }
    }

    public sendMergeRequest(id: number) {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHunguMergeRequest(id, this.getMergeRequestInfo()));
    }

    ///////////////////////////////////处理数据/////////////////////////////////////////////
    /**
     * 获取魂骨装备数据（装备表里的数据）
     * @param part 装备位
     * @param drop 掉落档次
     * @param color 颜色
     * @param level 星级（stage）
     * @param prof 职业
     */
    public getHunguEquipData(part: number, drop: number, color: number, level: number, prof: number): GameConfig.ThingConfigM {
        if (drop < 4)
            prof = 0;
        return this.hunguEquipMap[part][drop][color][level][prof];
    }

    /**
     * 获取升华的数据
     */
    public getAllMergeData(): GameConfig.HunGuMergeM[] {
        return this.hunguMergeData;
    }

    public getOneMergeDataById(id: number) {
        return this.hunguMergeMapById[id];
    }

    public getHunguEquipRandProp(part: number, level: number) {
        return this.hunguEquipRandProp[part][level];
    }

    public getHunguEquipRandPropBuId(id: number) {
        return this.hunguEquipRandPropById[id];
    }

    /**
     * 获取可以升华的数据
     */
    public getCanMergeData(): GameConfig.HunGuMergeM[] {
        //只筛选魂骨的数量，有两件就可以升华（同年代，不考虑材料）
        let canMerge: GameConfig.HunGuMergeM[] = [];
        for (let i = 0, con = this.hunguMergeData.length; i < con; i++) {
            if (this.isHaveMergeEquip(this.hunguMergeData[i].m_iID))
                canMerge.push(this.hunguMergeData[i]);
        }
        return canMerge;
    }

    public getAllMergeGroupData(): { [prop: number]: GameConfig.HunGuMergeM[] } {
        return this.hunguMergeGroupData;
    }

    public getCanMergeGroupData(): { [prop: number]: GameConfig.HunGuMergeM[] } {
        this.hunguCanFirstGroupDatas = [];
        //只筛选魂骨的数量，有两件就可以升华（同年代，不考虑材料）
        let canMerge: { [prop: number]: GameConfig.HunGuMergeM[] } = null;
        for (let i = 0, con = this.hunguMergeData.length; i < con; i++) {
            if (this.isHaveMergeEquip(this.hunguMergeData[i].m_iID)) {
                if (canMerge == null)
                    canMerge = {};
                if (canMerge[this.hunguMergeData[i].m_ucTargetQuality] == null) {
                    this.hunguCanFirstGroupDatas.push(this.hunguMergeData[i].m_ucTargetQuality);
                    canMerge[this.hunguMergeData[i].m_ucTargetQuality] = [];
                }
                canMerge[this.hunguMergeData[i].m_ucTargetQuality].push(this.hunguMergeData[i]);
            }
        }
        if (canMerge) {
            //排序
            for (var key in canMerge) {
                let data = canMerge[key];
                data.sort((a: GameConfig.HunGuMergeM, b: GameConfig.HunGuMergeM): number => {
                    return a.m_ucEquipPart - b.m_ucEquipPart;
                });
            }
        }
        return canMerge;
    }

    public getGroupAllFirstDatas() {
        return this.hunguFirstGroupDatas;
    }

    public getGroupCanFirstDatas() {
        this.hunguCanFirstGroupDatas.sort((a: number, b: number): number => {
            return a - b;
        });
        return this.hunguCanFirstGroupDatas;
    }

    /**
     * 获取可以添加的信息
     */
    public getCanAddEquip(id: number): ThingItemData[] {
        let cfgs: ThingItemData[] = [];
        //当前选中id，在面板里需要赋值的
        let data = this.getOneMergeDataById(id);
        let item = data.m_stMaterial[0];
        let hunguEquips = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.REBIRTH_EQUIP, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        let prof = -1;
        //获取职业
        for (let j = 0; j < this.mergeEquipMaxNumber; j++) {
            let matCfg = this.curMergeEquipDatas[j];
            if (matCfg == null) continue;
            prof = matCfg.config.m_ucProf;
            break;
        }
        for (let i = 0, con = hunguEquips.length; i < con; i++) {
            let equipCfg = hunguEquips[i];

            if (prof != -1) {
                if (equipCfg.config.m_ucProf != prof)
                    continue;
            }
            if (data.m_ucEquipPart == equipCfg.config.m_iEquipPart && item.m_iQuality == equipCfg.config.m_iDropLevel && item.m_iColour == equipCfg.config.m_ucColor) {
                //符合条件 再排除已经选中
                let iscanadd = true;
                for (let j = 0; j < this.mergeEquipMaxNumber; j++) {
                    let matCfg = this.curMergeEquipDatas[j];
                    if (matCfg == null) continue;
                    if (matCfg.data.m_stThingProperty.m_stGUID == equipCfg.data.m_stThingProperty.m_stGUID) {
                        iscanadd = false;
                        break;
                    }
                }
                if (iscanadd == false) continue;
                for (let j = 0; j < this.mergeMaterialMaxNumber; j++) {
                    let matCfg = this.curMergeMaterialDatas[j];
                    if (matCfg == null) continue;
                    if (matCfg.data.m_stThingProperty.m_stGUID == equipCfg.data.m_stThingProperty.m_stGUID) {
                        iscanadd = false;
                        break;
                    }
                }
                if (iscanadd) {
                    cfgs.push(equipCfg);
                }
            }
        }
        return cfgs;
    }

    /**
     * 获取可以添加的材料魂骨
     */
    public getCanAddMaterials(): ThingItemData[] {
        let cfgs: ThingItemData[] = [];
        //当前选中id，在面板里需要赋值的
        let hunguEquips = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.REBIRTH_EQUIP, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        //筛选所有金色魂骨,不区分职业
        for (let i = 0, con = hunguEquips.length; i < con; i++) {
            let equipCfg = hunguEquips[i];
            if (KeyWord.COLOR_RED == equipCfg.config.m_ucColor) {
                //符合条件 再排除已经选中
                let iscanadd = true;
                for (let j = 0; j < this.mergeEquipMaxNumber; j++) {
                    let matCfg = this.curMergeEquipDatas[j];
                    if (matCfg == null) continue;
                    if (matCfg.data.m_stThingProperty.m_stGUID == equipCfg.data.m_stThingProperty.m_stGUID) {
                        iscanadd = false;
                        break;
                    }
                }
                // if (iscanadd == false) continue;
                //材料的不筛选
                // for (let j = 0; j < this.mergeMaterialMaxNumber; j++) {
                //     let matCfg = this.curMergeMaterialDatas[j];
                //     if (matCfg == null) continue;
                //     if (matCfg.data.m_stThingProperty.m_stGUID == equipCfg.data.m_stThingProperty.m_stGUID) {
                //         iscanadd = false;
                //         break;
                //     }
                // }
                if (iscanadd) {
                    cfgs.push(equipCfg);
                }
            }
        }
        return cfgs;
    }

    public getGuideMaterials(): ThingItemData[] {
        let cfgs: ThingItemData[] = [];
        let hunguEquips = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.REBIRTH_EQUIP, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        for (let i = 0, con = hunguEquips.length; i < con; i++) {
            //给所有装备分类
            let equipCfg = hunguEquips[i];
            //特殊材料id
            if (equipCfg.config.m_iID == 117411041) {
                for (let j = 0; j < this.mergeEquipMaxNumber; j++) {
                    if (this.curMergeEquipDatas[j] == null) {
                        return cfgs;
                    }
                    if (this.curMergeEquipDatas[j].data.m_stThingProperty.m_stGUID != equipCfg.data.m_stThingProperty.m_stGUID) {
                        cfgs.push(equipCfg);
                        return cfgs;
                    }
                }
            }
        }
        return cfgs;
    }

    /**
     * 自动添加装备
     * @param drop 掉落档次（魂骨年代）
     * @param part 装备位
     */
    public autoAppendEquipByDrop(drop: number, part: number) {
        let hunguEquips = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.REBIRTH_EQUIP, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        let num = 0;
        for (let i = 0, con = hunguEquips.length; i < con; i++) {
            //给所有装备分类
            let equipCfg = hunguEquips[i];
            if (drop == equipCfg.config.m_iDropLevel && part == equipCfg.config.m_iEquipPart && equipCfg.config.m_ucColor == this.minColor) {
                this.curMergeEquipDatas.push(equipCfg);
                num++;
                if (num >= 2)
                    return;
            }
        }
    }

    /**
     * 自动添加装备
     * @param id 魂骨id
     */
    public autoAppendEquipById() {
        let hunguEquips = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.REBIRTH_EQUIP, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        let num = 0;
        for (let i = 0, con = hunguEquips.length; i < con; i++) {
            //给所有装备分类
            let equipCfg = hunguEquips[i];
            //特殊材料id
            if (equipCfg.config.m_iID == 117411041) {
                this.curMergeEquipDatas.push(equipCfg);
                num++;
                if (num >= 4)
                    return;
            }
        }
    }


    /**是否有装备可以升华(升华页签的红点) */
    public isEquipMerge(): boolean {
        for (let i = 0, con = this.hunguMergeData.length; i < con; i++) {
            if (this.isOneEquipMerge(this.hunguMergeData[i].m_iID))
                return true;
        }
        return false;
    }

    /**
     * 一个装备是否可以升华
     * @param id 
     */
    public isOneEquipMerge(id: number): boolean {
        //材料 + 特殊材料
        let ismatEquip = this.isHaveMergeEquip(id);
        let data = this.getOneMergeDataById(id);
        let mun = G.DataMgr.thingData.getThingNum(data.m_iConsumableID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        let ismatNum = mun >= data.m_iConsumableNumber;
        return ismatEquip && ismatNum;
    }

    /**
     * 是否有可升华的魂骨
     * @param id 
     */
    public isHaveMergeEquip(id: number): boolean {
        //装备材料是否符合要求 两个基础魂骨
        //取第一个材料，暂时不考虑不同材料的情况
        let data = this.getOneMergeDataById(id);
        let item = data.m_stMaterial[0];
        let num = this.getHunguEquipNumber(data.m_ucEquipPart, item.m_iQuality, item.m_iColour);
        for (let i = 0, con = num.length; i < con; i++) {
            if (num[i] >= 2) {
                return true;
            }
        }
        return false
    }


    /**
     * 一个年代是否有可合成的
     * @param drop
     */
    public isOneQualityMerge(drop: number): boolean {
        let data = this.getAllMergeGroupData()[drop];
        if (data != null) {
            let con = data.length;
            for (let i = 0; i < con; i++) {
                if (this.isOneEquipMerge(data[i].m_iID))
                    return true;
            }
        }
        return false;
    }

    /**
     * 魂骨是否装填完毕
     */
    public isMergeEquipFinish(): boolean {
        if (this.curMergeEquipDatas == null) {
            return false;
        }
        else {
            for (let i = 0; i < this.mergeEquipMaxNumber; i++) {
                let data = this.curMergeEquipDatas[i];
                if (data == null)
                    return false;
            }
        }
        return true;
    }

    public isMaterialInMaterialList(equip: ThingItemData): boolean {
        for (let i = 0; i < this.mergeMaterialMaxNumber; i++) {
            let cfg = this.curMergeMaterialDatas[i];
            if (cfg == null) continue;
            if (cfg.data.m_stThingProperty.m_stGUID == equip.data.m_stThingProperty.m_stGUID)
                return true;
        }
        return false;
    }

    public addMaterial(equip: ThingItemData, id: number) {
        if (this.getMergePercent(id) >= 100) {
            G.TipMgr.addMainFloatTip("成功率已达100%");
            return;
        }
        for (let i = 0; i < this.mergeMaterialMaxNumber; i++) {
            if (this.curMergeMaterialDatas[i] == null) {
                this.curMergeMaterialDatas[i] = equip;
                return;
            }
        }
        G.TipMgr.addMainFloatTip("数量已满");
    }

    public removeMaterial(equip: ThingItemData) {
        for (let i = 0; i < this.mergeMaterialMaxNumber; i++) {
            if (this.curMergeMaterialDatas[i] == null) continue;
            if (this.curMergeMaterialDatas[i].data.m_stThingProperty.m_stGUID == equip.data.m_stThingProperty.m_stGUID)
                this.curMergeMaterialDatas[i] = null;
        }
    }

    /**
     * 获取合成概率（80% 会返回 80）
     */
    public getMergePercent(id: number): number {
        let pro = 0;
        let data = this.getOneMergeDataById(id);
        //基础概率 /100
        if (this.getMergeEquiplNumber() == this.mergeEquipMaxNumber)
            pro = data.m_iSuccessRate / 100;
        //材料概率
        for (let i = 0; i < this.mergeMaterialMaxNumber; i++) {
            let item = this.curMergeMaterialDatas[i];
            if (item == null) continue;
            pro += this.getOnecMaterialHungPercent(item);
        }
        return pro;
    }

    public getOnecMaterialHungPercent(thingdata: ThingItemData): number {
        return thingdata.config.m_ucStage;
    }

    public getMergeEquiplNumber(): number {
        let num = 0;
        for (let i = 0; i < this.mergeEquipMaxNumber; i++) {
            if (this.curMergeEquipDatas[i] != null)
                num++;
        }
        return num;
    }
    public getMergeMaterialNumber(): number {
        let num = 0;
        for (let i = 0; i < this.mergeMaterialMaxNumber; i++) {
            if (this.curMergeMaterialDatas[i] != null)
                num++;
        }
        return num;
    }

    /**
     * 获取魂骨装备数量(背包中)
     * @param part 装备位
     * @param drop 掉落档次
     * @param color 颜色
     */
    private getHunguEquipNumber(part: number, drop: number, color: number): [number, number, number] {
        let num: [number, number, number] = [0, 0, 0];
        let hunguEquips = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.REBIRTH_EQUIP, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        for (let i = 0, con = hunguEquips.length; i < con; i++) {
            let equipCfg = hunguEquips[i];
            if (part == equipCfg.config.m_iEquipPart && drop == equipCfg.config.m_iDropLevel && color == equipCfg.config.m_ucColor) {
                if (equipCfg.config.m_ucProf == 0)
                    num[0]++;
                else if (equipCfg.config.m_ucProf == 1)
                    num[1]++;
                else if (equipCfg.config.m_ucProf == 2)
                    num[2]++;
            }
        }
        return num;
    }


    private setValidHungEquipInBag(): ThingItemData[] {
        let datas: ThingItemData[] = [];
        let hunguEquips = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.REBIRTH_EQUIP, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        for (let i = 0, con = hunguEquips.length; i < con; i++) {
            let equipCfg = hunguEquips[i];
            if (equipCfg.config.m_iDropLevel >= this.minQuality && equipCfg.config.m_ucColor >= this.minColor) {
                datas.push(equipCfg);
            }
        }
        return datas;
    }

    /**
     * 获取当前的材料最小和最大星级
     * （用来显示随机的星级）
     */
    public getCurLowEquipMinMaxLevel(): [number, number] {
        let min = 100;
        let max = -1;
        for (let i = 0; i < this.mergeEquipMaxNumber; i++) {
            let item = this.curMergeEquipDatas[i];
            if (item != null) {
                if (min > item.config.m_ucStage) {
                    min = item.config.m_ucStage;
                }
                if (max < item.config.m_ucStage) {
                    max = item.config.m_ucStage;
                }
            }
        }
        if (max < 0) {
            //没有东西
            return [1, 1];
        }
        return [min, max];
    }

    /**
     * 获取当前可合成的职业
     */
    public getCurrentEquipProf(drop: number): number {
        for (let i = 0; i < this.mergeEquipMaxNumber; i++) {
            if (this.curMergeEquipDatas[i] != null)
                return this.curMergeEquipDatas[i].config.m_ucProf;
        }
        if (drop == 1 || drop == 2 || drop == 3) {
            return 0;
        }
        else {
            let prof = G.DataMgr.heroData.profession;
            if (prof == 0)
                prof = 1;
            return prof;
        }
    }

    public getCurrenProf() {
        for (let i = 0; i < this.mergeEquipMaxNumber; i++) {
            if (this.curMergeEquipDatas[i] != null)
                return this.curMergeEquipDatas[i].config.m_ucProf;
        }
        return 0;
    }

    /**
     * 获取发送协议的数据
     */
    public getMergeRequestInfo(): Protocol.SimpleContainerThingObjList {
        let info = {} as Protocol.SimpleContainerThingObjList;
        info.m_astSimpleContainerThingInfo = [];
        for (let i = 0; i < this.mergeEquipMaxNumber; i++) {
            info.m_astSimpleContainerThingInfo[i] = {} as Protocol.SimpleContainerThingInfo;
            let item = info.m_astSimpleContainerThingInfo[i];
            if (this.curMergeEquipDatas[i] != null) {
                item.m_iNumber = this.curMergeEquipDatas[i].data.m_iNumber;
                item.m_iThingID = this.curMergeEquipDatas[i].data.m_iThingID;
                item.m_usPosition = this.curMergeEquipDatas[i].data.m_usPosition;
            }
        }
        for (let i = 0; i < this.mergeMaterialMaxNumber; i++) {
            let index = i + this.mergeEquipMaxNumber;
            info.m_astSimpleContainerThingInfo[index] = {} as Protocol.SimpleContainerThingInfo;
            let item = info.m_astSimpleContainerThingInfo[index];
            if (this.curMergeMaterialDatas[i] != null) {
                item.m_iNumber = this.curMergeMaterialDatas[i].data.m_iNumber;
                item.m_iThingID = this.curMergeMaterialDatas[i].data.m_iThingID;
                item.m_usPosition = this.curMergeMaterialDatas[i].data.m_usPosition;
            }
        }
        info.m_iThingNumber = this.mergeEquipMaxNumber + this.mergeMaterialMaxNumber;
        return info;
    }
}