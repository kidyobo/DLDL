import { Global as G } from 'System/global'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { ThingData } from 'System/data/thing/ThingData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { SkillData } from 'System/data/SkillData'
import { GameIDType } from 'System/constants/GameEnum'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { PetChecker } from 'System/data/pet/PetChecker'
import { Color } from 'System/utils/ColorUtil'

/**
 * 散仙数据管理器。
 * @author xiaojialin
 *
 */
export class PetData {
    static readonly LabelDesc: string[] = ['精英', '完美', '传说', '史诗', '神话'];
    static readonly petTitle: string[] = ['【疾风】', '【新月】', '【曜日】', '【深渊】', '【混沌】'];
    static readonly petTitleTip: string[] = ['疾风', '新月', '曜日', '深渊', '混沌'];
    static readonly petTitleColors: string[] = [Color.ITEM_BLUE, Color.ITEM_PURPLE, Color.ITEM_ORANGE, Color.ITEM_GOLD, Color.ITEM_RED];

    /** 第一次获取伙伴的ID */
    static GET_FIRSH_PET_ID: number = 40000001;

    /**每个伙伴身上的装备数*/
    static EQUIP_NUM_PER_PET: number = 6;
    /**每半颗星星算一阶*/
    static MaxStageLevel: number = 100;

    static EquipParts: number[] = [KeyWord.EQUIP_PARTCLASS_ARMET, KeyWord.EQUIP_PARTCLASS_NECKLACE, KeyWord.EQUIP_PARTCLASS_ARMOUR,
    KeyWord.EQUIP_PARTCLASS_BANGLE, KeyWord.EQUIP_PARTCLASS_BINHUN, KeyWord.EQUIP_PARTCLASS_BRACELET];

    private static maxJushenLevel: number = 0;

    /**散仙配置表*/
    private static m_petConfig: { [id: number]: GameConfig.BeautyAttrM } = {};
    /**寻宝配置表*/
    private static m_petXunBaoConfig: { [id: number]: GameConfig.WYTreasureHuntCfgM } = {};
    /**散仙强化数据*/
    private static m_enhanceConfig: { [id: number]: { [stage: number]: GameConfig.BeautyStageM } } = {};
    /**缘分配置*/
    private static m_yuanfenConfig: { [id: number]: { [fateType: number]: { [level: number]: GameConfig.HongYanFateConfigM } } } = {};
    /**伙伴装备套装预览*/
    private static m_petStageToEquipSetMap: GameConfig.BeautyEquipSuitPreViewM[];
    ///**神力配置*/
    //private static m_petSoulConfig: { [id: number]: { [juhnlv: number]: GameConfig.HongYanJuShenConfigM } } = {};
    /**觉醒配置*/
    private static m_awakenConfig: { [id: number]: { [level: number]: GameConfig.BeautyAwakeCfgM } } = {};

    private static m_labelMap: { [labelId: number]: number[] } = {};

    private static m_posToPetMap: { [posIdx: number]: number } = {};

    private static nuQiSkillId2YuanFenCfg: { [nqSkilId: number]: GameConfig.HongYanFateConfigM } = {};

    private static nuQiSkillId2PetId: { [nqSkilId: number]: number } = {};

    maxLabel = 0;

    private m_allPetID: number[] = [];

    /**出战散仙*/
    private m_followPet: Protocol.NewBeautyInfo;

    /**武缘寻宝信息*/
    treasureHuntInfo: Protocol.WYTreasureHuntInfo;

    /**所有散仙*/
    private petInfoMap: { [id: number]: PetChecker } = {};

    /**当前伙伴选择数据*/
    currentHongYanData: Protocol.NewBeautyInfo;

    //////////////////////////////////////////// 散仙配置 ////////////////////////////////////////////

    /** 
     * 设置散仙配置数据。
     * @param config
     *
     */
    private setPetConfig(): void {
        let config: GameConfig.BeautyAttrM[] = G.Cfgmgr.getCfg('data/BeautyAttrM.json') as GameConfig.BeautyAttrM[];
        let temp: number[];
        let petInfo: Protocol.NewBeautyInfo;
        for (let pet of config) {
            if (pet.m_iID > 0) {
                PetData.m_petConfig[pet.m_iID] = pet;
                this.m_allPetID.push(pet.m_iID);
            }

            if (pet.m_uiLabelID > this.maxLabel) {
                this.maxLabel = pet.m_uiLabelID;
            }

            temp = PetData.m_labelMap[pet.m_uiLabelID];
            if (temp == null) {
                PetData.m_labelMap[pet.m_uiLabelID] = temp = [];
            }
            temp.push(pet.m_iID);

            let pos: number = Math.floor(pet.m_uiEquipPosition / Macros.BEAUTY_EQUIP_NUMBER);
            PetData.m_posToPetMap[pos] = pet.m_iID;

            PetData.nuQiSkillId2PetId[Math.floor(pet.m_uiSkillID / 100)] = pet.m_iID;
        }
    }

    private setPetXunBaoData(): void {
        let data: GameConfig.WYTreasureHuntCfgM[] = G.Cfgmgr.getCfg('data/WYTreasureHuntCfgM.json') as GameConfig.WYTreasureHuntCfgM[];
        for (let config of data) {
            PetData.m_petXunBaoConfig[config.m_iID] = config;
        }
    }
    static getPetXunBaoData(petID: number): GameConfig.WYTreasureHuntCfgM {
        return PetData.m_petXunBaoConfig[petID];
    }

    static getPetConfigByPetID(id: number): GameConfig.BeautyAttrM {
        return PetData.m_petConfig[id];
    }

    static getPetIdByNuQiSkillId(nuQiSkillId: number): number {
        return PetData.nuQiSkillId2PetId[Math.floor(nuQiSkillId / 100)];
    }

    getFollowPet(): Protocol.NewBeautyInfo {
        return this.m_followPet;
    }

    getNqSkill(petID: number = 0): number {
        let pet: Protocol.NewBeautyInfo;
        if (petID == 0) {
            pet = this.m_followPet;
        }
        else {
            pet = this.getPetInfo(petID);
        }

        if (pet == null) {
            return 0;
        }
        else {
            //查看功法等级
            let gf: number = pet.m_astFateList[KeyWord.BEAUTY_FATE_TYPE_KF - 1].m_iLevel;
            if (gf > 0) {
                let gfConfig: GameConfig.HongYanFateConfigM = PetData.getYuanfenConfig(pet.m_iBeautyID, KeyWord.BEAUTY_FATE_TYPE_KF, gf);
                return gfConfig.m_uiSkillID;
            }
            else {
                return PetData.getPetConfigByPetID(pet.m_iBeautyID).m_uiSkillID;
            }
        }
    }

    setfollowPet(pet: Protocol.NewBeautyInfo): void {
        if (pet.m_iBeautyID != 0) {
            this.m_followPet = pet;
        }
        else {
            this.m_followPet = null;
        }

    }

    setFollowPetByID(id: number): void {
        if (id == 0) {
            this.m_followPet = null;
        } else if (this.petInfoMap[id]) {
            this.m_followPet = this.petInfoMap[id].info;
            let hero = G.UnitMgr.getRoleByUIN(G.DataMgr.heroData.roleID.m_uiUin);
            if (hero.pet) {
                hero.pet.Data.petAwakeCnt = this.getPetInfo(id).m_stAwake.m_ucLevel;
                hero.pet.onUpdateNameboard(null); //更新伙伴
            }

        }
    }

    updatePet(newPet: Protocol.NewBeautyInfo): void {
        if (this.m_followPet != null && this.m_followPet.m_iBeautyID == newPet.m_iBeautyID) {
            this.setfollowPet(newPet);
        }
        let pet = this.petInfoMap[newPet.m_iBeautyID];
        if (null != pet) {
            pet.update(newPet);
            PetData._updateSkill(pet.info);
        }
    }

    updatePetAwakenData(awakenData: Protocol.AwakeStrengthenRsp) {
        this.petInfoMap[awakenData.m_iStrengthenBeautyID].info.m_stAwake.m_ucLevel = awakenData.m_ucLevel;
        this.petInfoMap[awakenData.m_iStrengthenBeautyID].info.m_stAwake.m_usLuck = awakenData.m_usLuck;
        let hero = G.UnitMgr.getRoleByUIN(G.DataMgr.heroData.roleID.m_uiUin);
        if (hero.pet) {
            if (this.m_followPet.m_iBeautyID == awakenData.m_iStrengthenBeautyID) {
                this.setFollowPetByID(awakenData.m_iStrengthenBeautyID);
            }
            hero.pet.onUpdateNameboard(null); //更新伙伴
        }
    }

    getPet(id: number): PetChecker {
        return this.petInfoMap[id];
    }

    getPetInfo(id: number): Protocol.NewBeautyInfo {
        if (!this.petInfoMap[id]) return null;
        return this.petInfoMap[id].info;
    }

    private setEnhanceData(): void {
        let data: GameConfig.BeautyStageM[] = G.Cfgmgr.getCfg('data/BeautyStageM.json') as GameConfig.BeautyStageM[];
        for (let config of data) {
            if (PetData.m_enhanceConfig[config.m_iID] == null) {
                PetData.m_enhanceConfig[config.m_iID] = {};
            }

            PetData.m_enhanceConfig[config.m_iID][config.m_iStage] = config;
        }
    }

    static getEnhanceConfig(petID: number, stage: number): GameConfig.BeautyStageM {
        if (!PetData.m_enhanceConfig[petID]) {
            if (defines.has('_DEBUG')) {
                uts.assert(false, '没有伙伴配置表:' + petID);
            }
        }
        return PetData.m_enhanceConfig[petID][stage];
    }

    private setYuanfenConfig(): void {
        let data: GameConfig.HongYanFateConfigM[] = G.Cfgmgr.getCfg('data/HongYanFateConfigM.json') as GameConfig.HongYanFateConfigM[];
        for (let config of data) {
            if (PetData.m_yuanfenConfig[config.m_iID] == null) {
                PetData.m_yuanfenConfig[config.m_iID] = {};
            }

            if (PetData.m_yuanfenConfig[config.m_iID][config.m_ucFateType] == null) {
                PetData.m_yuanfenConfig[config.m_iID][config.m_ucFateType] = {};
            };

            PetData.m_yuanfenConfig[config.m_iID][config.m_ucFateType][config.m_iLevel] = config;
            if (KeyWord.BEAUTY_FATE_TYPE_KF == config.m_ucFateType) {
                PetData.nuQiSkillId2YuanFenCfg[config.m_uiSkillID] = config;
            }
        }
    }

    static getYuanFenCfgByNuQiSkillId(nuQiSkillId: number): GameConfig.HongYanFateConfigM {
        return PetData.nuQiSkillId2YuanFenCfg[nuQiSkillId];
    }

    static getYuanfenConfig(pet: number, type: number, lv: number): GameConfig.HongYanFateConfigM {
        return PetData.m_yuanfenConfig[pet][type][lv];
    }

    isPetActive(id: number): boolean {
        let pet: Protocol.NewBeautyInfo = this.getPetInfo(id);
        if (pet != null) {
            return pet.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET;
        }

        return false;
    }

    getAllPetID(): number[] {
        return this.m_allPetID;
    }

    static getPetIdByLabel(label: number): number[] {
        return PetData.m_labelMap[label];
    }

    updatePets(pets: Protocol.NewBeautyInfo[]) {
        for (let info of pets) {
            let pet = this.petInfoMap[info.m_iBeautyID];
            if (!pet) {
                pet = new PetChecker();
                this.petInfoMap[info.m_iBeautyID] = pet;
            }
            pet.update(info);
            PetData._updateSkill(info);
        }
    }

    static getEquipListByPet(id: number): ThingItemData[] {
        let data: ThingItemData[] = new Array<ThingItemData>(Macros.BEAUTY_EQUIP_NUMBER);
        let equipObject: { [position: number]: ThingItemData } = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_BEAUTY_EQUIP);
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(id);
        for (let i: number = 0; i < Macros.BEAUTY_EQUIP_NUMBER; i++) {
            data[i] = equipObject[config.m_uiEquipPosition + i];
        }

        return data;
    }

    private static _updateSkill(pet: Protocol.NewBeautyInfo): void {
        let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(pet.m_iBeautyID);
        if (config == null) {
            uts.logError('pet config not found: ' + pet.m_iBeautyID);
            return;
        }
        if (config.m_uiSkillID > 0) {
            let skilldate = SkillData.getSkillConfig(config.m_uiSkillID);
            if (skilldate != null)
                skilldate.completed = 1;
        }

        let gf: number = pet.m_astFateList[KeyWord.BEAUTY_FATE_TYPE_KF - 1].m_iLevel;
        let gfConfig: GameConfig.HongYanFateConfigM = PetData.getYuanfenConfig(pet.m_iBeautyID, KeyWord.BEAUTY_FATE_TYPE_KF, gf);
        if (gfConfig != null && gfConfig.m_uiSkillID > 0) {
            SkillData.getSkillConfig(gfConfig.m_uiSkillID).completed = 1;
        }
    }

    /**获取伙伴显示阶级*/
    static getPetStage(confStage: number, petID: number = 0): number {
        if (petID != 0) {
            let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petID);
            uts.assert(null != config, 'stage = ' + confStage + ', petID = ' + petID);
            if (confStage >= config.m_uiStage) {
                return Math.floor(config.m_uiStage / 10);
            }
        }
        return Math.floor((confStage - 1) / 10) + 1;
    }

    /**获取伙伴显示星级*/
    static getPetStar(confStage: number): number {
        return Math.floor(((confStage - 1) % 10) / 2);
    }

    /**
     * 根据伙伴装备位置判断是在哪个伙伴身上 
     * @param pos
     * @return 
     * 
     */
    static getPetIDByEquipPos(pos: number): number {
        pos = Math.floor(pos / Macros.BEAUTY_EQUIP_NUMBER);
        return PetData.m_posToPetMap[pos];
    }

    private setSuitPreviewData(): void {
        let data: GameConfig.BeautyEquipSuitPreViewM[] = G.Cfgmgr.getCfg('data/BeautyEquipSuitPreViewM.json') as GameConfig.BeautyEquipSuitPreViewM[];
        PetData.m_petStageToEquipSetMap = data;
        PetData.m_petStageToEquipSetMap.sort(this._sortSuitPreviewConfig);
    }

    private _sortSuitPreviewConfig(a: GameConfig.BeautyEquipSuitPreViewM, b: GameConfig.BeautyEquipSuitPreViewM): number {
        return a.m_iStage - b.m_iStage;
    }

    static getEquipSetPriviewConfig(stage: number): GameConfig.BeautyEquipSuitPreViewM {
        return PetData.m_petStageToEquipSetMap[stage - 1];
    }

    canKfSkillUp(petid: number, needProp: boolean = false): boolean {
        let pet = this.petInfoMap[petid];
        if (pet == null) {
            if (needProp) {
                G.TipMgr.addMainFloatTip('伙伴尚未激活');
            }
            return false;
        }
        return pet.canUpgradeSkill(needProp);
    }

    static getJushenStage(lv: number): number {
        if (lv >= PetData.maxJushenLevel) {
            return Math.floor(lv / 5);
        }
        else {
            return Math.floor(lv / 5) + 1;
        }
    }

    static getJushenStar(lv: number): number {
        if (lv >= PetData.maxJushenLevel) {
            return 5;
        }
        else {
            return Math.floor(lv % 5);
        }
    }

    /**
     * 获取指定阶级以上伙伴数量 
     * @param stage
     * @return 
     * 
     */
    getPetNumByStage(stage: number): number {
        let cnt: number = 0;
        for (let idKey in this.petInfoMap) {
            let pet = this.petInfoMap[idKey].info;
            if (pet.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET && PetData.getPetStage(pet.m_uiStage, pet.m_iBeautyID) >= stage) {
                cnt++;
            }
        }

        return cnt;
    }

    /**
     * 获取穿齐指定套装的伙伴数量 
     * @param stage
     * @return 
     * 
     */
    getWearingSetNum(stage: number): number {
        let cnt: number = 0;
        for (let idKey in this.petInfoMap) {
            let pet = this.petInfoMap[idKey].info;
            if (G.DataMgr.thingData.getWearingPetSuitNum(pet.m_iBeautyID, stage) > 0) {
                cnt++;
            }
        }

        return cnt;
    }

    getActivedPets(): Protocol.NewBeautyInfo[] {
        let pets: Protocol.NewBeautyInfo[] = [];
        for (let idKey in this.petInfoMap) {
            let pet = this.petInfoMap[idKey].info;
            if (pet.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
                pets.push(pet);
            }
        }

        return pets;
    }

    onCfgReady() {
        this.setPetConfig();
        this.setYuanfenConfig();
        this.setEnhanceData();
        this.setSuitPreviewData();
        // this.setJuShenCfg();
        this.setPetFeishengConfig();
        this.setPetZhenTuConfig();
        this.setPetZhenTuUpLvConfig();
        this.setPetAwakenConfig();
        this.setPetXunBaoData();
    }

    /**
     * 所有伙伴中是否存在可以激活
     */
    isAllPetExistCanActive() {
        let allPetID: number[] = this.getAllPetID();
        for (let petID of allPetID) {
            let pet: Protocol.NewBeautyInfo = this.getPetInfo(petID);
            if (null != pet && pet.m_ucStatus == Macros.GOD_LOAD_AWARD_WAIT_GET) {
                return true;
            }
        }
        return false;
    }

    /**
     * 所有伙伴中是否存在功法可升级
     */
    isAllPetExistCanSkillUp() {
        let allPetID: number[] = this.getAllPetID();
        for (let petID of allPetID) {
            if (this.canKfSkillUp(petID, false)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 所有伙伴中是否存在可强化的
     */
    isAllPetExistCanJinJie(): boolean {
        let allPetID: number[] = this.getAllPetID();
        for (let petID of allPetID) {
            if (this.isOnePetCanJinJie(petID)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 是否可以强化一个伙伴
     */
    isOnePetCanJinJie(curPetId: number): boolean {
        let pet = this.petInfoMap[curPetId];
        return pet != null && pet.canJinJie();
    }

    /**
   * 所有伙伴中是否存在可聚神
   */
    isAllPetCanJuShen(): boolean {
        let allPetID: number[] = this.getAllPetID();
        for (let petID of allPetID) {
            if (this.isOnePetCanJuShen(petID)) {
                return true;
            }
        }
        return false;
    }

    isOnePetCanJuShen(curPetId: number): boolean {
        let pet = this.petInfoMap[curPetId];
        return pet != null && pet.canJuShen();
    }

    isOnePetCanAwaken(curPetId: number): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_WUYUAN_AWAKE))
            return false;
        let pet = this.petInfoMap[curPetId];
        return pet != null && pet.canAwaken();
    }

    isAllPetCanAwaken(): number {
        let allPetID: number[] = this.getAllPetID();
        for (let petID of allPetID) {
            if (this.isPetActive(petID) && this.isOnePetCanAwaken(petID)) {
                return petID;
            }
        }
        return 0;
    }

    /**
     * 一个伙伴是否可以穿戴更好的装备
     * @param petInfo
     */
    isOnePetCanWearBetterEquip(petInfo: Protocol.NewBeautyInfo): boolean {
        if (!petInfo) return false;
        let pet = this.petInfoMap[petInfo.m_iBeautyID];
        return pet != null && pet.canWearBetterEquip();
    }

    /**
   * 能够得到更好的伙伴装备
   */
    isAllPetExistBetterEquip(): boolean {
        for (let idKey in this.petInfoMap) {
            let pet = this.petInfoMap[idKey].info;
            if (pet.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET && this.isOnePetCanWearBetterEquip(pet)) {
                return true;
            }
        }
        return false;
    }

    getPetEquipPartByIndex(index: number): number {
        return PetData.EquipParts[index];
    }

    getPetEquipPartIndexByType(type: number): number {
        return PetData.EquipParts.indexOf(type);
    }

    /**飞升配置*/
    private static m_feiShengConfig: { [m_iID: number]: { [m_iLv: number]: GameConfig.HongYanJuShenConfigM } };
    /**最低可飞升的炼神等级*/
    private static m_canFeishengLv: { [m_iID: number]: number };


    private setPetFeishengConfig(): void {
        let data: GameConfig.HongYanJuShenConfigM[] = G.Cfgmgr.getCfg('data/HongYanJuShenConfigM.json') as GameConfig.HongYanJuShenConfigM[];
        PetData.maxJushenLevel = 0;
        PetData.m_feiShengConfig = {};
        PetData.m_canFeishengLv = {};
        for (let config of data) {
            if (PetData.m_feiShengConfig[config.m_iID] == null) {
                PetData.m_feiShengConfig[config.m_iID] = {};
            }
            PetData.m_feiShengConfig[config.m_iID][config.m_iJuHunLv] = config;

            if (config.m_iJuHunLv > PetData.maxJushenLevel) {
                PetData.maxJushenLevel = config.m_iJuHunLv;
            }

            if (config.m_iFSConsumID > 0) {
                if (PetData.m_canFeishengLv[config.m_iID] == null) {
                    PetData.m_canFeishengLv[config.m_iID] = config.m_iJuHunLv;
                }
                else {
                    if (PetData.m_canFeishengLv[config.m_iID] > config.m_iJuHunLv) {
                        PetData.m_canFeishengLv[config.m_iID] = config.m_iJuHunLv;
                    }
                }
            }
        }
    }


    /**
	 *飞升配置 
	 * @param petID
	 * @param lv
	 * 
	 */
    static getFeishengConfig(petID: number, lv: number): GameConfig.HongYanJuShenConfigM {
        if (!PetData.m_feiShengConfig[petID]) {
            uts.assert(false, '没有伙伴飞升配置表:' + petID);
        }
        return PetData.m_feiShengConfig[petID][lv];
    }
    /**
     * 最低可飞升等级
     * @param id
     * @return 
     * 
     */
    static getCanFeishengLv(id: number): number {
        return PetData.m_canFeishengLv[id];
    }

    /**
     * 当前物品是否比所有伙伴中，同部位的要好
     */
    isBetterThanAllPetEquip(itemConfig: GameConfig.ThingConfigM, fight: number): boolean {
        for (let idKey in this.petInfoMap) {
            let pet = this.petInfoMap[idKey];
            if (pet.isBetterEquip(itemConfig, fight)) {
                return true;
            }
        }
        return false;
    }
    /**
     *当前武缘装备是否有伙伴可以穿戴
     */
    isEquipCanTakeOn(m_ucRequiredLevel: number): boolean {
        for (let idKey in this.petInfoMap) {
            let pet = this.petInfoMap[idKey];
            if (pet && pet.info.m_stAwake.m_ucLevel >= m_ucRequiredLevel) {
                return true
            }
        }
        return false;
    }
    clearCheckCache() {
        for (let key in this.petInfoMap) {
            this.petInfoMap[key].clearCache();
        }
    }

    //////////////////////////////伙伴光印///////////////////////////////
    /**光印的数量*/
    zhenTuCount: number = 0;
    private zhenTuConfiMap: { [type: number]: GameConfig.BeautyZTJHCfgM } = {};
    private setPetZhenTuConfig() {
        let data: GameConfig.BeautyZTJHCfgM[] = G.Cfgmgr.getCfg('data/BeautyZTJHCfgM.json') as GameConfig.BeautyZTJHCfgM[];
        this.zhenTuCount = data.length;
        for (let cfg of data) {
            this.zhenTuConfiMap[cfg.m_iID] = cfg;
        }
    }

    getZhenTuConfigByType(type: number) {
        return this.zhenTuConfiMap[type];
    }

    petZhenTuMaxLv = 0;
    petZhenTuInfo: Protocol.BeautyZTRspValue;
    private zhenTuUpLvConfigMap: { [type: number]: { [lv: number]: GameConfig.BeautyZTUpLvCfgM } } = {};
    private setPetZhenTuUpLvConfig() {
        let data: GameConfig.BeautyZTUpLvCfgM[] = G.Cfgmgr.getCfg('data/BeautyZTUpLvCfgM.json') as GameConfig.BeautyZTUpLvCfgM[];
        for (let cfg of data) {
            if (this.zhenTuUpLvConfigMap[cfg.m_iID] == null) {
                this.zhenTuUpLvConfigMap[cfg.m_iID] = {};
            }
            this.zhenTuUpLvConfigMap[cfg.m_iID][cfg.m_ucLv] = cfg;
            if (cfg.m_ucLv > this.petZhenTuMaxLv) {
                this.petZhenTuMaxLv = cfg.m_ucLv;
            }
        }
    }

    getPetZhenTuUpLvConfig(type: number, lv: number): GameConfig.BeautyZTUpLvCfgM {
        return this.zhenTuUpLvConfigMap[type][lv];
    }

    updatePetZhenTuInfo(info: Protocol.BeautyZTRspValue) {
        this.petZhenTuInfo = info;
    }

    updatePetZhenTuInfoById(id: number, lv: number, lucky: number) {
        this.petZhenTuInfo.m_stList.m_stInfo[id - 1].m_ucLevel = lv;
        this.petZhenTuInfo.m_stList.m_stInfo[id - 1].m_ucLucky = lucky;
    }

    /**
     * 得到光印的状态
     * @param type 从1开始的
     */
    getZhenTuActiveStatus(type: number): number {
        //  GOD_LOAD_AWARD_CANT_GET  GOD_LOAD_AWARD_WAIT_GET  GOD_LOAD_AWARD_DONE_GET
        if (this.petZhenTuInfo != null) {
            let len = this.petZhenTuInfo.m_stList.m_ucNum;
            //已激活
            if (this.petZhenTuInfo.m_stList.m_stInfo[type - 1].m_ucLevel > 0) {
                return Macros.GOD_LOAD_AWARD_DONE_GET;
            }
            //不可激活
            let config = this.getZhenTuConfigByType(type);
            for (let i = 0; i < config.m_iPosCnt; i++) {
                let peInfo: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(config.m_szPosInfo[i].m_iBeautyID);
                let hasActive = (null != peInfo && peInfo.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET);
                if (!hasActive) {
                    return Macros.GOD_LOAD_AWARD_CANT_GET;
                }
            }
            //可激活
            return Macros.GOD_LOAD_AWARD_WAIT_GET;
        }
        //不可激活
        return Macros.GOD_LOAD_AWARD_CANT_GET;
    }


    /**
     * 光印是否可以显示红点
     */
    petZhenTuCanShowTipMark(): boolean {

        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_PET_ZHENTU)) {
            return false;
        }

        let needMinCount = 999;
        if (this.petZhenTuInfo == null) return false;
        for (let i = 0; i < this.zhenTuCount; i++) {
            let stauts = this.getZhenTuActiveStatus(i + 1);
            //可以激活
            if (stauts == Macros.GOD_LOAD_AWARD_WAIT_GET) {
                return true;
            }
            let lv = this.petZhenTuInfo.m_stList.m_stInfo[i].m_ucLevel;

            let config = this.getPetZhenTuUpLvConfig(i + 1, lv + 1);

            if (config != null && config.m_iConsumNum != 0 && stauts == Macros.GOD_LOAD_AWARD_DONE_GET && config.m_iConsumNum < needMinCount) {
                needMinCount = config.m_iConsumNum;
            }
        }
        //材料都一样，随便取个
        let config = this.getPetZhenTuUpLvConfig(1, 2);
        let has = G.DataMgr.thingData.getThingNum(config.m_iConsumID, Macros.CONTAINER_TYPE_ROLE_BAG, false)
        if (has >= needMinCount) {
            return true;
        }
        return false;
    }

    /**
     * 阵图是否可以显示红点
     */
    petXunBaoCanShowTipMark(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_PET_XUNBAO)) {
            return false;
        }
        return this.treasureHuntInfo.m_iBeautyID == 0;
    }


    getPetModleID(petId: number, feishengCount: number) {
        let modelId: string;
        if (feishengCount > 0) {
            let config: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petId);
            //飞升配置表中长度
            let feiShenCfgLen = config.m_stFSInfo.length;
            let index = feishengCount > feiShenCfgLen ? (feiShenCfgLen - 1) : (feishengCount - 1);
            let fsModelId = config.m_stFSInfo[index].m_uiModelID;
            modelId = fsModelId.toString();
        } else {
            let stageConfig: GameConfig.BeautyStageM = PetData.getEnhanceConfig(petId, 1);
            modelId = stageConfig.m_iModelID.toString();
        }
        return modelId;
    }


    private setPetAwakenConfig() {
        let data: GameConfig.BeautyAwakeCfgM[] = G.Cfgmgr.getCfg('data/BeautyAwakeCfgM.json') as GameConfig.BeautyAwakeCfgM[];
        for (let config of data) {
            if (PetData.m_awakenConfig[config.m_iID] == null) {
                PetData.m_awakenConfig[config.m_iID] = {};
            }
            PetData.m_awakenConfig[config.m_iID][config.m_ucLv] = config;
        }
    }

    getPetAwakenCfg(petId: number, level: number) {
        return PetData.m_awakenConfig[petId][level];
    }

}
