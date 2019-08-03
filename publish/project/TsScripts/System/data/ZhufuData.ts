import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { SkillData } from 'System/data/SkillData'
import { StringUtil } from 'System/utils/StringUtil'
import { HeroData } from 'System/data/RoleData'
import { GameIDType, UnitCtrlType } from "System/constants/GameEnum"
import { BeautyEquipListItemData } from "System/data/vo/BeautyEquipListItemData"
import { FightingStrengthUtil } from "System/utils/FightingStrengthUtil"
import { ThingData } from "System/data/thing/ThingData"
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'


export class ZhufuData {


    /**祝福的装备个数（坐骑，神器，圣印，翅膀）*/
    static All_OTHER_NUM = 10;
    /**祝福系统的关键字*/
    static ZhuFuXiTongKeyWords: number[] = [KeyWord.HERO_SUB_TYPE_FAZHEN, KeyWord.HERO_SUB_TYPE_LEILING, KeyWord.HERO_SUB_TYPE_ZUOQI, KeyWord.HERO_SUB_TYPE_WUHUN];

    /**当前祝福面板打开的VO*/
    currentOtherPanelData: Protocol.CSHeroSubSuper;

    /**后台拉取的数据*/
    private m_data: { [type: number]: Protocol.CSHeroSubSuper };
    /**新增祝福，例如天珠宝*/
    private m_SpecData: { [type: number]: Protocol.CSHeroSubUnion };

    /**配置*/
    private m_config: { [type: number]: { [id: number]: GameConfig.ZhuFuConfigM } };

    /**每个系统的技能列表*/
    private m_skillList: { [type: number]: number[] };

    /**资质丹成长丹配置(类型为索引)*/
    private m_drugConfig: { [type: number]: { [id: number]: GameConfig.ZhuFuDrugConfigM } };

    /**资质丹成长丹配置(id为索引)*/
    private m_drugConfig2: { [id: number]: GameConfig.ZhuFuDrugConfigM };
    /**装备位配置*/
    private m_equipPartConfig: { [id: number]: GameConfig.ZhuFuEquipMapM };


    private m_skillBrachToType: { [skillBranch: number]: number };

    /**仙缘配置*/
    private m_xianyuanConfig: { [level: number]: GameConfig.XianYuanPropCfgM };

    /**现有祝福系统数量*/
    private m_numOfZfType: number = 0;

    /**祝福化形配置*/
    private m_zhufuImageConfig: { [imageId: number]: GameConfig.ZhuFuImageConfigM };
    /**祝福化形的id列表*/
    private m_imageIDs: { [zhufuId: number]: number[] };
    private isSort: boolean = false;
    /**祝福系统最大等级字典*/
    private static _zhuFuMaxLevelDic: { [type: number]: number };
    /**祝福系统猎魂开孔字典*/
    private static _zhuFuLhTypeDic: { [key: string]: GameConfig.ZhuFuConfigM };


    /**神力数据*/
    xueMaiData: Protocol.CrazyBloodInfo;


    /**神力配置*/
    private static m_xuemaiConfigs: GameConfig.BloodCfgM[];

    /**万用进阶丹提示--紫极魔瞳 */
    isWanyongJJDTipForZJMT = false;
    /**万用进阶丹提示--鬼影迷踪 */
    isWanyongJJDTipForGYMZ = false;

    setData(data: Protocol.CSHeroSubList): void {
        this.m_data = {};
        this.m_SpecData = {};
        for (let i: number = 0; i < data.m_ucCount; i++) {
            this.m_data[data.m_stModuleList[i].m_ucType] = data.m_stModuleList[i].m_stSuperInfo;
            this.m_SpecData[data.m_stModuleList[i].m_ucType] = data.m_stModuleList[i].m_stUnionInfo;
        }
    }

    private setConfig(): void {
        let configs: GameConfig.ZhuFuConfigM[] = G.Cfgmgr.getCfg('data/ZhuFuConfigM.json') as GameConfig.ZhuFuConfigM[];
        this.m_config = {};
        this.m_skillList = {};
        ZhufuData._zhuFuMaxLevelDic = {};
        ZhufuData._zhuFuLhTypeDic = {};
        let key: string;
        for (let config of configs) {
            if (this.m_config[config.m_ucType] == null) {
                this.m_config[config.m_ucType] = {};
                this.m_numOfZfType++;
            }
            this.m_config[config.m_ucType][config.m_iID] = config;

            if (config.m_iSkillID > 0) {
                if (this.m_skillList[config.m_ucType] == null) {
                    this.m_skillList[config.m_ucType] = new Array<number>();
                }
                (this.m_skillList[config.m_ucType]).push(config.m_iSkillID);
            }

            if (ZhufuData._zhuFuMaxLevelDic[config.m_ucType] != null) {
                ZhufuData._zhuFuMaxLevelDic[config.m_ucType] = Math.max(ZhufuData._zhuFuMaxLevelDic[config.m_ucType], config.m_iID);
            }
            else {
                ZhufuData._zhuFuMaxLevelDic[config.m_ucType] = config.m_iID;
            }

            key = StringUtil.marriageLine(config.m_ucType, config.m_ucLHCount);
            let crtLevel: number = 0
            if (ZhufuData._zhuFuLhTypeDic[key] == null) {
                crtLevel = 9999;
            }
            else {
                crtLevel = (ZhufuData._zhuFuLhTypeDic[key] as GameConfig.ZhuFuConfigM).m_iID;
            }
            if (crtLevel > config.m_iID) {
                ZhufuData._zhuFuLhTypeDic[key] = config;
            }
        }
    }

    private setDrugConfig(): void {
        let configs: GameConfig.ZhuFuDrugConfigM[] = G.Cfgmgr.getCfg('data/ZhuFuDrugConfigM.json') as GameConfig.ZhuFuDrugConfigM[];
        this.m_drugConfig = {};
        this.m_drugConfig2 = {};
        for (let config of configs) {
            if (this.m_drugConfig[config.m_ucType] == null) {
                this.m_drugConfig[config.m_ucType] = {};
            }

            this.m_drugConfig[config.m_ucType][config.m_iID] = config;
            this.m_drugConfig2[config.m_iItemID] = config;
        }
    }

    private setEquipPartConfig(): void {
        let data: GameConfig.ZhuFuEquipMapM[] = G.Cfgmgr.getCfg('data/ZhuFuEquipMapM.json') as GameConfig.ZhuFuEquipMapM[];
        this.m_equipPartConfig = {};
        for (let config of data) {
            this.m_equipPartConfig[config.m_iID] = config;
        }
    }

    private setXianyuanConfig(): void {
        let configs: GameConfig.XianYuanPropCfgM[] = G.Cfgmgr.getCfg('data/XianYuanPropCfgM.json') as GameConfig.XianYuanPropCfgM[];
        this.m_xianyuanConfig = {};
        let config: GameConfig.XianYuanPropCfgM;
        for (config of configs) {
            this.m_xianyuanConfig[config.m_usLevel] = config;
        }

        //手动组一个0级的
        let config0: GameConfig.XianYuanPropCfgM = {} as GameConfig.XianYuanPropCfgM;
        let config1: GameConfig.XianYuanPropCfgM = this.m_xianyuanConfig[1];
        for (let i: number = 0; i < config1.m_astProp.length; i++) {
            config0.m_astProp = config.m_astProp;
            config0.m_astProp.push({} as GameConfig.EquipPropAtt);
            config0.m_astProp[i].m_ucPropId = config1.m_astProp[i].m_ucPropId;
        }
        this.m_xianyuanConfig[0] = config0;
    }

    private _sortSkill(a: number, b: number): number {
        let configA: GameConfig.SkillConfigM = SkillData.getSkillConfig(a);
        let configB: GameConfig.SkillConfigM = SkillData.getSkillConfig(b);

        if (configA == null) {
            return 1;
        }

        if (configB == null) {
            return -1;
        }

        return configA.m_stSkillStudy.m_iStudyLevel - configB.m_stSkillStudy.m_iStudyLevel;
    }

    getData(type: number): Protocol.CSHeroSubSuper {
        if (this.m_data != null) {
            return this.m_data[type];
        }
        else {
            return null;
        }
    }

    getZhufuNumber(type: number, isZhufuDecrease: boolean): number {
        if (this.m_data != null) {
            let data = this.m_data[type];
            let nextdata: GameConfig.ZhuFuConfigM;
            if (isZhufuDecrease) {
                nextdata = this.getConfig(type, data.m_ucLevel + 10);
            }
            else {
                nextdata = this.getConfig(type, data.m_ucLevel + 1);
            }
            if (nextdata) {
                let luck = nextdata.m_iLucky - data.m_uiLucky;
                let num = Math.ceil(luck / 10) - 1;
                return num;
            }
        }
        return 0;
    }

    getSpecData(type: number): Protocol.CSHeroSubUnion {
        if (this.m_SpecData != null) {
            return this.m_SpecData[type];
        } else {
            return null;
        }
    }

    getConfig(type: number, level: number): GameConfig.ZhuFuConfigM {
        return this.m_config[type][level];
    }

    getConfigs(type: number): { [id: number]: GameConfig.ZhuFuConfigM } {
        return this.m_config[type];
    }

    getSkillList(type: number): number[] {
        return this.m_skillList[type];
    }

    getEquipPartConfig(type: number): GameConfig.ZhuFuEquipMapM {
        return this.m_equipPartConfig[type];
    }

    getXianyuanConfig(level: number): GameConfig.XianYuanPropCfgM {
        return this.m_xianyuanConfig[level];
    }

    updateData(data: Protocol.CSHeroSubData): void {
        if (this.m_data != null) {
            this.m_data[data.m_ucType] = data.m_stSuperInfo;
        }
        if (this.m_SpecData != null) {
            this.m_SpecData[data.m_ucType] = uts.deepcopy(data.m_stUnionInfo, this.m_SpecData[data.m_ucType], true);
        }
    }

    /**
     * 指定类型的祝福系统能否服用丹
     * @param type
     * @return
     *
     */
    canEatCzd(type: number): boolean {
        let data: Protocol.CSHeroSubSuper = this.getData(type);
        if (data == null) return false;
        let czdConfig: GameConfig.ZhuFuDrugConfigM = this.getDrugConfigByType(KeyWord.HERO_SUB_DRUG_TYPE_CZ, type);

        if (data.m_ucLevel < czdConfig.m_uiOpenLevel) {
            G.TipMgr.addMainFloatTip('成长丹功能未开启');
            return false;
        }

        let stage: number = ZhufuData.getZhufuStage(data.m_ucLevel, type);
        if (data.m_uiSXDrugCount >= czdConfig.m_iLevelMax * stage) {
            G.TipMgr.addMainFloatTip('已达本阶成长丹上限');
            return false;
        }

        let czdNum: number = G.DataMgr.thingData.getThingNum(czdConfig.m_iItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        if (czdNum == 0) {
            G.TipMgr.addMainFloatTip('成长丹数量不足');
            return false;
        }

        return true;
    }

    /**
     * 指定类型的祝福系统能否服用资质丹
     * @param type
     * @return
     *
     */
    canEatZzd(type: number): boolean {
        let data: Protocol.CSHeroSubSuper = this.getData(type);
        if (data == null) return false;
        let zzdConfig: GameConfig.ZhuFuDrugConfigM = this.getDrugConfigByType(KeyWord.HERO_SUB_DRUG_TYPE_ZZ, type);

        if (data.m_ucLevel < zzdConfig.m_uiOpenLevel) {
            G.TipMgr.addMainFloatTip('资质丹功能未开启');
            return false;
        }

        let stage: number = ZhufuData.getZhufuStage(data.m_ucLevel, type);
        if (data.m_uiZZDrugCount >= zzdConfig.m_iLevelMax * stage) {
            G.TipMgr.addMainFloatTip('已达本阶资质丹上限');
            return false;
        }

        let zzdNum: number = G.DataMgr.thingData.getThingNum(zzdConfig.m_iItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false)
        if (zzdNum == 0) {
            G.TipMgr.addMainFloatTip('资质丹数量不足');
            return false;
        }

        return true;
    }

    /**
     * 更新技能，在登录或者是学习了某个技能或者是转职更新当前角色的技能
     * @param skillList
     * @param isChangeProfession 是否转职。
     *
     */
    updateGotSkills(gotSkillList: Protocol.SkillList): void {
        if (!this.isSort) {
            //顺便做一下技能类型对系统类型的索引
            this.m_skillBrachToType = {};
            for (let key in this.m_skillList) {
                let skillList: number[] = this.m_skillList[key];
                skillList.sort(this._sortSkill);
                let config: GameConfig.SkillConfigM = SkillData.getSkillConfig(skillList[0]);
                if (config != null)
                    this.m_skillBrachToType[config.m_ucSkillBranch] = parseInt(key);
            }

            this.isSort = true;
        }

        let len: number = gotSkillList.m_ucNumber;
        for (let i: number = 0; i < len; i++) {
            this.updateSkill(gotSkillList.m_stInfo[i].m_iSkillID);
        }
    }

    updateSkill(skillID: number): void {
        let config: GameConfig.SkillConfigM = SkillData.getSkillConfig(skillID);
        if (this.m_skillBrachToType[config.m_ucSkillBranch] != null) {
            config.completed = 1;
            let skillList: number[] = this.m_skillList[this.m_skillBrachToType[config.m_ucSkillBranch]];
            for (let i: number = 0; i < skillList.length; i++) {
                //替换同一级的技能
                if (SkillData.isSameClassSkill(config.m_iSkillID, skillList[i])) {
                    skillList[i] = config.m_iSkillID;
                    break;
                }
            }
            G.ModuleMgr.heroModule.onZhufuDataChange(this.m_skillBrachToType[config.m_ucSkillBranch]);
        }
    }

    /**
     *
     * @param type 成长丹或者资质丹
     * @param id 祝福系统类型
     * @return
     *
     */
    getDrugConfigByType(type: number, id: number): GameConfig.ZhuFuDrugConfigM {
        return this.m_drugConfig[type][id];
    }

    /**
     *
     * @param id 物品id
     * @return
     *
     */
    getDrugConfigByItemID(id: number): GameConfig.ZhuFuDrugConfigM {
        return this.m_drugConfig2[id];
    }

    isZhufuSkill(id: number): boolean {
        let config: GameConfig.SkillConfigM = SkillData.getSkillConfig(id);
        return this.m_skillBrachToType[config.m_ucSkillBranch] != null;
    }

    static getColorByLevel(lv: number): number {
        if (lv < 4) {
            return KeyWord.COLOR_GREEN;
        }
        else if (lv < 7) {
            return KeyWord.COLOR_BLUE;
        }
        else if (lv < 10) {
            return KeyWord.COLOR_PURPLE;
        }
        else if (lv < 13) {
            return KeyWord.COLOR_ORANGE;
        }
        else if (lv < 16) {
            return KeyWord.COLOR_GOLD;
        }
        else {
            return KeyWord.COLOR_RED;
        }
    }

    private setImageConfig(): void {
        let data: GameConfig.ZhuFuImageConfigM[] = G.Cfgmgr.getCfg('data/ZhuFuImageConfigM.json') as GameConfig.ZhuFuImageConfigM[];
        this.m_zhufuImageConfig = {};
        this.m_imageIDs = {};

        for (let config of data) {
            if (config.m_bPingbi == 0) {
                let id = config.m_uiImageId * Macros.ZHUFU_AVATAR_IMAGE_RATE + config.m_iLevel;
                this.m_zhufuImageConfig[id] = config;

                if (this.m_imageIDs[config.m_iZhuFuID] == null) {
                    this.m_imageIDs[config.m_iZhuFuID] = new Array<number>();
                }
                (this.m_imageIDs[config.m_iZhuFuID]).push(id);
            }
        }
    }
    //获取最高级配置
    getFullLevelConfig(zhuFuID: number, imageID: number): GameConfig.ZhuFuImageConfigM {
        let fullConfig: GameConfig.ZhuFuImageConfigM;
        let ids = this.m_imageIDs[zhuFuID];
        let maxLevel = 1;

        for (let id of ids) {     //获取最高等级
            let tempLevel = this.getImageLevel(id)
            let tempImageID = this.getImageUnLevelID(id);
            if (tempImageID != imageID) {
                continue;
            }
            if (maxLevel < tempLevel) {
                maxLevel = tempLevel;
            }
        }

        let id = this.getImageLevelID(imageID, maxLevel)
        fullConfig = this.m_zhufuImageConfig[id];
        return fullConfig;
    }
    //该ID是imageid*1000+level的形式的组合ID
    getImageLevelID(id: number, level: number): number {
        return id * Macros.ZHUFU_AVATAR_IMAGE_RATE + level;
    }
    //该ID是imageid*1000+level的形式的组合ID
    getImageUnLevelID(id: number): number {
        if (id > 10000) {
            return Math.floor(id / Macros.ZHUFU_AVATAR_IMAGE_RATE);
        }
        return id;
    }
    //该ID是imageid*1000+level的形式的组合ID
    getImageLevel(id: number): number {
        if (id > 10000) {
            return id % Macros.ZHUFU_AVATAR_IMAGE_RATE;
        }
        return 0;
    }
    //该ID是imageid*1000+level的形式的组合ID
    getImageConfig(id: number): GameConfig.ZhuFuImageConfigM {
        return this.m_zhufuImageConfig[id];
    }

    getImageID(type: number): number[] {
        return this.m_imageIDs[type];
    }

    /**
     * 是否已经激活
     * @param type
     * @param cfg
     * @return
     *
     */
    isActive(type: number, imageId: number): boolean {
        let data: Protocol.CSHeroSubSuper = this.getData(type);
        if (data == null) return false;
        if (imageId > 10000) {
            let items: Protocol.HeroSubDressOneImage[] = data.m_astImageList;
            if (items != null) {
                for (let item of items) {
                    if (imageId == this.getImageLevelID(item.m_uiImageID, item.m_iLevel))
                        return true;
                }
            }
            return false;
        }
        return data.m_ucLevel >= imageId;
    }

    private spaceRideData: number[] = null;
    isRideSpaceShowTipsMark(): boolean {
        this.spaceRideData = [];
        let index: number[] = [];


        let cfgs: number[] = this.getImageID(KeyWord.HERO_SUB_TYPE_ZUOQI);
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i];
            let unlevelID = this.getImageUnLevelID(cfg);
            if (this.isActive(KeyWord.HERO_SUB_TYPE_ZUOQI, cfg)) {
                this.spaceRideData.push(cfg);
                index.push(unlevelID);
            }
            else {
                if (cfg != 0 && index.indexOf(unlevelID) == -1) {
                    //过滤重复模型
                    index.push(unlevelID);
                    this.spaceRideData.push(this.getImageLevelID(unlevelID, 1));
                }
            }
        }


        let ismask: boolean = false;
        for (let i = 0; i < this.spaceRideData.length; i++) {
            ismask = G.DataMgr.thingData.checkThingIDForZhufu(KeyWord.HERO_SUB_TYPE_ZUOQI, this.spaceRideData[i]);
            if (ismask)
                return true;
        }

        return ismask;
    }

    getTimeItem(type: number, imageId: number): Protocol.HeroSubDressOneImage {
        let data: Protocol.CSHeroSubSuper = this.getData(type);
        if (data == null) return null;
        if (imageId > 10000) {
            let id = this.getImageUnLevelID(imageId);
            let items: Protocol.HeroSubDressOneImage[] = data.m_astImageList;
            if (items != null) {
                for (let item of items) {
                    if (id == item.m_uiImageID)
                        return item;
                }
            }
        }
        return null;
    }

    canImagePy(image: Protocol.HeroSubDressOneImage): boolean {
        if (image != null && image.m_uiTimeOut == 0) {
            let cfg: GameConfig.ZhuFuImageConfigM = this.getImageConfig(this.getImageLevelID(image.m_uiImageID, image.m_iLevel + 1));
            if (cfg && G.DataMgr.thingData.getThingNum(cfg.m_iConsumeID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= cfg.m_iConsumableCount) {
                return true;
            }
        }
        return false;
    }

    isDress(type: number, imageId: number): boolean {
        let data: Protocol.CSHeroSubSuper = this.getData(type);
        if (data == null) return false;
        return data.m_uiShowID == imageId;
    }

    /**获取祝福系统最大等级*/
    static getZhuFuMaxLevel(subType: number): number {
        return ZhufuData._zhuFuMaxLevelDic[subType];
    }

    /**检查圣灵是否可升级*/
    checkShengLingCanUp(): boolean {
        let canUp = false;
        if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.ACT_FUNCTION_MRBZ)) {
            let data: Protocol.CSHeroSubSuper = this.getData(KeyWord.HERO_SUB_TYPE_SHENGLING);
            if (data) {
                let config: GameConfig.ZhuFuConfigM = this.getConfig(KeyWord.HERO_SUB_TYPE_SHENGLING, data.m_ucLevel + 1);
                if (config) {
                    let heroData: HeroData = G.DataMgr.heroData;
                    let reiki: number = heroData.reiki;
                    let m_iLucky: number = config.m_iConsumableNumber;
                    canUp = reiki >= m_iLucky;
                }
            }
        }
        return canUp;
    }

    checkSkillCanUp(type: number): boolean {
        let canUp: boolean = false;
        let funcID: number = GameIDUtil.getFuncIdBySubType(type);
        if (G.DataMgr.funcLimitData.isFuncAvailable(funcID)) {
            let data: Protocol.CSHeroSubSuper = this.getData(type);
            if (data != null) {
                let skills: number[] = this.getSkillList(type);
                if (skills != null) {
                    for (let skillId of skills) {
                        if (SkillData.canSkillUp(skillId)) {
                            canUp = true;
                            break;
                        }
                    }
                }
            }
        }
        return canUp;
    }

    static getZhufuStage(lv: number, type: number): number {
        let maxLevel: number = ZhufuData.getMaxLv(type);
        if (lv >= maxLevel) {
            return Math.floor(maxLevel / 10);
        }
        else {
            return Math.floor((lv - 1) / 10) + 1;
        }
    }

    static getMaxLv(type: number): number {
        let maxLevel: number = 0;
        if (type == KeyWord.OTHER_FUNCTION_MAGICCUBE) {
            maxLevel = G.DataMgr.magicCubeData.magicCubeMaxLevel;
        } else if (type == KeyWord.BAR_FUNCTION_SHIELDGOD) {
            maxLevel = G.DataMgr.shieldGodData.maxLv;
        } else if (type == KeyWord.BAR_FUNCTION_JIUXING) {
            maxLevel = G.DataMgr.jiuXingData.maxLevel;
        } else {
            maxLevel = ZhufuData._zhuFuMaxLevelDic[type];
        }
        return maxLevel;
    }

    static getNextStageLv(lv: number, type: number): number {
        let maxLevel: number = ZhufuData.getMaxLv(type);
        return Math.min((Math.floor((lv - 1) / 10) + 1) * 10 + 1, maxLevel);
    }

    static getMagicCubeStage(lv: number): number {
        let maxLevel: number = G.DataMgr.magicCubeData.magicCubeMaxLevel;
        if (lv >= maxLevel) {
            return Math.floor(maxLevel / 10);
        }
        else {
            return Math.floor((lv - 1) / 10) + 1;
        }
    }


    static getZhufuStar(lv: number, type: number): number {
        let maxLevel: number = ZhufuData._zhuFuMaxLevelDic[type];
        if (lv >= maxLevel) {
            return 10;
        }
        else {
            return Math.floor(lv - 1) % 10;
        }
    }

    static isZhuFuXitongKeyWord(funcName: number): boolean {
        for (let i = 0; i < ZhufuData.ZhuFuXiTongKeyWords.length; i++) {
            if (funcName == ZhufuData.ZhuFuXiTongKeyWords[i]) {
                return true;
            }
        }
        return false;
    }

    private setXuemaiConfig(): void {
        let data: GameConfig.BloodCfgM[] = G.Cfgmgr.getCfg('data/BloodCfgM.json') as GameConfig.BloodCfgM[];
        ZhufuData.m_xuemaiConfigs = data;
    }

    private _sortXuemaiConfig(a: GameConfig.BloodCfgM, b: GameConfig.BloodCfgM): number {
        return a.m_iID - b.m_iID;
    }

    static getXuemaiConfig(id: number): GameConfig.BloodCfgM {
        if (id <= ZhufuData.m_xuemaiConfigs.length) {
            return ZhufuData.m_xuemaiConfigs[id - 1];
        }
        return null;
    }

    /**检查神力是否可以提升*/
    checkXueMaiCanUp(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_CRAZYBLOOD)) {
            return false;
        }
        let costData = new MaterialItemData();
        let blood_id = 10309031;
        let data: Protocol.CrazyBloodInfo = this.xueMaiData;
        let currentConfig = ZhufuData.getXuemaiConfig(data.m_ucStage);
        if (data == null || currentConfig == null) {
            return false;
        }
        let nextConfig = ZhufuData.getXuemaiConfig(data.m_ucStage + 1);
        if (nextConfig == null || data.m_uiBloodValue < currentConfig.m_uiBloodExp) {
            costData.id = blood_id;
            costData.need = 1;
        }
        else {
            costData.id = currentConfig.m_iConsumableID;
            costData.need = currentConfig.m_iConsumableNumber;
        }
        if (costData.id == 0) {
            return false;
        }
        else {
            let has = G.DataMgr.thingData.getThingNumInsensitiveToBind(costData.id);
            return has >= costData.need;
        }
    }

    /**获取猎魂开孔配置表*/
    lhCountZhufuCfg(type: number, count: number): GameConfig.ZhuFuConfigM {
        let key: string;
        key = StringUtil.marriageLine(type, count);
        return ZhufuData._zhuFuLhTypeDic[key];
    }

    onCfgReady(): void {
        this.setConfig();
        this.setDrugConfig();
        this.setEquipPartConfig();
        this.setXianyuanConfig();
        this.setImageConfig();
        this.setXuemaiConfig();
        this.setTianZhuMountCfg();
        this.setSaiJiConfig();
    }

    /**
     * 一个祝福系统是否可以显示小红点
     * @param keyword
     */
    isShowZhuFuTipMark(keyword: number) {
        let isShow = false;
        //功能限制不可提升
        let zhufuData = this.getData(keyword);
        //let visible = Boolean(G.DataMgr.funcLimitData.isFuncAvailable(keyword) && !G.DataMgr.otherPlayerData.isOtherPlayer);
        // let visible = Boolean(G.DataMgr.funcLimitData.isFuncEntranceVisible(keyword) && !G.DataMgr.otherPlayerData.isOtherPlayer);
        if (zhufuData != null && zhufuData.m_ucLevel == 0) {
            return false;
        }
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(GameIDUtil.getFuncIdBySubType(keyword))) {
            //技能可升级 
            isShow = this.checkSkillCanUp(keyword);
            if (isShow) return true;

            //可以强化
            isShow = this.canStrengthZhufuSystem(keyword);
            if (isShow) return true;

            //能够穿戴更好的装备
            isShow = this.canWearBetterEquip(keyword);
            if (isShow) return true;

            //成长丹|资质丹
            isShow = this.cZDOrzZDShowTipMark(keyword, true) || this.cZDOrzZDShowTipMark(keyword, false);
            if (isShow) return true;

            //可以幻化
            isShow = G.DataMgr.thingData.checkThingForZhufu(keyword);
            return isShow;
        }
        return false;
    }

    /**
   * 一个祝福系统是否可以显示小红点
   * @param keyword
   */
    isShowZhuFuCZTipMark(keyword: number) {
        let isShow = false;
        //功能限制不可提升
        let zhufuData = this.getData(keyword);
        if (zhufuData != null && zhufuData.m_ucLevel == 0) {
            return false;
        }
        if (G.DataMgr.funcLimitData.isFuncAvailable(GameIDUtil.getFuncIdBySubType(keyword))) {
            //技能可升级 
            isShow = this.checkSkillCanUp(keyword);
            if (isShow) return true;

            //可以强化
            isShow = this.canStrengthZhufuSystem(keyword);
            if (isShow) return true;

            //能够穿戴更好的装备
            isShow = this.canWearBetterEquip(keyword);
            if (isShow) return true;

            //成长丹|资质丹
            isShow = this.cZDOrzZDShowTipMark(keyword, true) || this.cZDOrzZDShowTipMark(keyword, false);
            return isShow;
        }
        return false;
    }

    /**
     * 成长丹|资质丹 红点提示
     * @param keyword 祝福类型
     * @param keyword 成长丹，资质丹
     */
    cZDOrzZDShowTipMark(keyword: number, isCZD: boolean) {
        let data: Protocol.CSHeroSubSuper = this.getData(keyword);
        if (data != null) {
            let config: GameConfig.ZhuFuDrugConfigM;
            if (isCZD) {
                config = this.getDrugConfigByType(KeyWord.HERO_SUB_DRUG_TYPE_CZ, keyword);

            } else {
                config = this.getDrugConfigByType(KeyWord.HERO_SUB_DRUG_TYPE_ZZ, keyword);
            }
            let thingConfig = ThingData.getThingConfig(config.m_iItemID);
            if (thingConfig == null) {
                //没配置说明没有该设定
                return false;
            }
            let thingNum = G.DataMgr.thingData.getThingNum(thingConfig.m_iID, Macros.CONTAINER_TYPE_ROLE_BAG, false);

            //小于开放等级false
            if (data.m_ucLevel < config.m_uiOpenLevel) {
                return false;
            }

            let stage: number = ZhufuData.getZhufuStage(data.m_ucLevel, keyword);
            if (isCZD) {
                if (thingNum > 0 && (data.m_uiSXDrugCount < (config.m_iLevelMax * stage))) {
                    return true;
                }
            } else {
                if (thingNum > 0 && (data.m_uiZZDrugCount < (config.m_iLevelMax * stage))) {
                    return true;
                }
            }
        }
        return false;
    }


    /**祝福类点从5阶后，开始能升一阶才提示*/
    static readonly ZhuFuLimitTipMarkStage = 5;

    /**
     * 是否可以强化
     * @param keyword
     */
    canStrengthZhufuSystem(keyword: number): boolean {
        //通过vip开启，等级不够不可强化
        var funId: number = GameIDUtil.getEnhanceFuncIdBySubType(keyword);
        var funcLimitConfig: GameConfig.NPCFunctionLimitM = G.DataMgr.funcLimitData.getFuncLimitConfig(funId);
        if (funcLimitConfig != null) {
            var heroData = G.UnitMgr.hero.Data;
            let islimit = heroData.level < funcLimitConfig.m_ucLevel;
            if (islimit) {
                return false;
            }
        }

        let nextConfig: GameConfig.ZhuFuConfigM;
        let data = this.getData(keyword);
        if (data == null) return false;
        if (keyword == KeyWord.HERO_SUB_TYPE_FAZHEN || keyword == KeyWord.HERO_SUB_TYPE_LEILING) {
            nextConfig = this.getConfig(keyword, data.m_ucLevel + 10);
        }
        else {
            nextConfig = this.getConfig(keyword, data.m_ucLevel + 1);
        }

        if (nextConfig != null) {
            let id = nextConfig.m_iConsumableID;
            let need = nextConfig.m_iConsumableNumber;
            let has = G.DataMgr.thingData.getThingNum(id, Macros.CONTAINER_TYPE_ROLE_BAG, false);

            if (keyword == KeyWord.HERO_SUB_TYPE_FAZHEN || keyword == KeyWord.HERO_SUB_TYPE_LEILING) {
                let data = this.getData(keyword);
                if (data) {
                    let curStage = ZhufuData.getZhufuStage(data.m_ucLevel, keyword);
                    if (curStage < ZhufuData.ZhuFuLimitTipMarkStage) {
                        return (has >= need && has != 0);
                    } else {
                        return has >= nextConfig.m_iConsumableNumber * ((nextConfig.m_iLucky - data.m_uiLucky) / 10);
                    }
                }
            } else {
                return (has >= need && has != 0);
            }

        }
    }


    /**
     * 能够穿戴更好的祝福装备
     * @param keyword
     */
    private canWearBetterEquip(keyword: number) {
        //有可穿戴的装备，或有更好的装备
        let data = this.getBagZhufuEquip(keyword);
        let shows: boolean[];
        for (let pos in data) {
            shows = data[pos];
            for (let i = 0; i < shows.length; i++) {
                if (shows[i]) { return true; }
            }
        }
        return false;
    }

    /**
     * 背包中是否有可以穿戴，或者更好的装备
     * @param keyword 
     */
    private getBagZhufuEquip(keyword: number): { [pos: number]: boolean[] } {
        /**背包装备有战斗力高的*/
        let isUpEquip: { [pos: number]: boolean[] } = {};
        let m_equipListData: BeautyEquipListItemData[] = [];
        let containerID = GameIDUtil.getContainerIDBySubtype(keyword);
        let equipObject = G.DataMgr.thingData.getContainer(containerID);
        let data: Protocol.CSHeroSubSuper = this.getData(keyword);
        for (let pos = 0; pos < 4; pos++) {
            //这放外面获取，在比较0号位置的时候，后面部位可穿戴也不被移除，比较（0+i）位置就没数据了
            let allEquipInContainer = G.DataMgr.thingData.getAllEquipInContainer(GameIDType.OTHER_EQUIP);
            if (m_equipListData[pos] == null) {
                m_equipListData[pos] = new BeautyEquipListItemData();
            }
            m_equipListData[pos].thingItemData.containerID = containerID;

            if (equipObject != null) {
                m_equipListData[pos].thingItemData = equipObject[pos];
            } else {
                m_equipListData[pos].thingItemData = null;
            }

            let wearThingData = m_equipListData[pos].thingItemData;
            let fight: number = 0;

            if (wearThingData != null) {
                fight = wearThingData.zdl;
            }
            for (let i: number = allEquipInContainer.length - 1; i >= 0; i--) {
                let equipConfig = allEquipInContainer[i].config;
                if (GameIDUtil.getSubTypeByEquip(equipConfig.m_iEquipPart) != keyword || ThingData.getIndexByEquipPart(equipConfig.m_iEquipPart) != pos) {
                    allEquipInContainer.splice(i, 1);
                }
            }
            for (let thingItemData of allEquipInContainer) {
                let showUp = data != null && thingItemData.config.m_ucRequiredLevel <= data.m_ucLevel && fight < thingItemData.zdl;
                if (isUpEquip[pos] == null) {
                    isUpEquip[pos] = [];
                }
                isUpEquip[pos].push(showUp);
            }
        }
        return isUpEquip;
    }

    static getUnitTypeByZFType(zfType: number): UnitCtrlType {
        switch (zfType) {
            case KeyWord.HERO_SUB_TYPE_ZUOQI:
            case KeyWord.HERO_SUB_TYPE_HUOJING: return UnitCtrlType.ride;
            case KeyWord.HERO_SUB_TYPE_YUYI: return UnitCtrlType.wing;
            case KeyWord.HERO_SUB_TYPE_FAZHEN: return UnitCtrlType.zhenfa;
            case KeyWord.HERO_SUB_TYPE_WUHUN: return UnitCtrlType.weapon;
            case KeyWord.HERO_SUB_TYPE_JINGLING: return UnitCtrlType.lingbao;
            case KeyWord.HERO_SUB_TYPE_LEILING: return UnitCtrlType.shenji;
            case KeyWord.HERO_SUB_TYPE_ZHANLING: return 0;
            case KeyWord.HERO_SUB_TYPE_TIANZHU: return 0;
            case KeyWord.HERO_TYPE_BEAUTY: return UnitCtrlType.pet;
        }
        return 0;
    }

    /**
     * 得到祝福系统升级额外属性
     * @param curValue
     * @param nextValue
     * @param curLuckValue
     * @param nextLuckValue
     */
    static getZhuFuExtraAttr(curValue: number, nextValue, curLuckValue: number, nextLuckValue): number {
        return curValue + nextValue * curLuckValue / nextLuckValue / 2;
    }
    static huanHuaJinJieCompare(a: GameConfig.ZhuFuConfigM, b: GameConfig.ZhuFuConfigM) {
        let zhufuData: ZhufuData = G.DataMgr.zhufuData;
        let showa: boolean = zhufuData.isDress(a.m_ucType, a.m_iID);
        let showb: boolean = zhufuData.isDress(b.m_ucType, b.m_iID);
        let hada: boolean = zhufuData.isActive(a.m_ucType, a.m_iID);
        let hadb: boolean = zhufuData.isActive(b.m_ucType, b.m_iID);
        if (showa) {
            return -1;
        }
        if (showb) {
            return 1;
        }
        if (a.m_iID >= b.m_iID) {
            if (!hada) {
                return 1;
            }
            else if (hada && !hadb) {
                return -1;
            }
            else if (hada && hadb) {
                return 1;
            }
        }
        else {
            if (!hadb) {
                return -1;
            }
            else if (hadb && !hada) {
                return 1;
            }
            else if (hadb && hada) {
                return -1;
            }
        }
        return 0;
    }

    static huanHuaListCompare(a: GameConfig.ZhuFuConfigM, b: GameConfig.ZhuFuConfigM) {
        let zhufuData: ZhufuData = G.DataMgr.zhufuData;
        let showa: boolean = zhufuData.isDress(a.m_ucType, a.m_iID);
        let showb: boolean = zhufuData.isDress(b.m_ucType, b.m_iID);
        let hada: boolean = zhufuData.isActive(a.m_ucType, a.m_iID);
        let hadb: boolean = zhufuData.isActive(b.m_ucType, b.m_iID);
        if (showa) {
            return -1;
        }
        if (showb) {
            return 1;
        }
        if (hada == hadb) {
            if (hada)
                return a.m_iID >= b.m_iID ? -1 : 1;
            else
                return a.m_iID <= b.m_iID ? -1 : 1;
        }
        else {
            return hada ? -1 : 1;
        }
    }

    static huanHuaSpecialCompare(id1: number, id2: number): number {
        let zhufuData: ZhufuData = G.DataMgr.zhufuData;
        let a: GameConfig.ZhuFuImageConfigM = zhufuData.getImageConfig(id1);
        let b: GameConfig.ZhuFuImageConfigM = zhufuData.getImageConfig(id2);
        let zhufuInfoa: Protocol.HeroSubDressOneImage = zhufuData.getTimeItem(a.m_iZhuFuID, id1);
        let zhufuInfob: Protocol.HeroSubDressOneImage = zhufuData.getTimeItem(b.m_iZhuFuID, id2);
        let hada: boolean = zhufuData.isActive(a.m_iZhuFuID, id1);
        let hadb: boolean = zhufuData.isActive(b.m_iZhuFuID, id2);
        let current: number = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        if (zhufuInfoa != null) {
            if (zhufuInfoa.m_uiTimeOut != 0 && zhufuInfoa.m_uiTimeOut <= current) {
                hada = false;
            }
        }
        if (zhufuInfob != null) {
            if (zhufuInfob.m_uiTimeOut != 0 && zhufuInfob.m_uiTimeOut <= current) {
                hadb = false;
            }
        }
        let showa: boolean = zhufuData.isDress(a.m_iZhuFuID, id1);
        let showb: boolean = zhufuData.isDress(b.m_iZhuFuID, id2);
        //每个类型只有一个可佩带
        if (showa) {
            return -1;
        }
        if (showb) {
            return 1;
        }
        if (a.m_iSortID >= b.m_iSortID) {
            if (!hada) {
                return 1;
            }
            else if (hada && !hadb) {
                return -1;
            }
            else if (hada && hadb) {
                return 1;
            }
        }
        else {
            if (!hadb) {
                return -1;
            }
            else if (hadb && !hada) {
                return 1;
            }
            else if (hadb && hada) {
                return -1;
            }
        }
        return 0;
    }

    ///////////////////////////////////天珠镶嵌系统////////////////////////////////
    tianYanMaxNum: number = 0;
    private tianZhuMountMap: { [pos: number]: GameConfig.TianZhuMountM[] };
    private tianZhuMountLvMap: { [pos: number]: { [lv: number]: GameConfig.TianZhuMountM } };
    private setTianZhuMountCfg() {
        let configs: GameConfig.TianZhuMountM[] = G.Cfgmgr.getCfg('data/TianZhuMountM.json') as GameConfig.TianZhuMountM[];
        this.tianZhuMountMap = {};
        this.tianZhuMountLvMap = {};
        for (let cfg of configs) {
            if (this.tianZhuMountMap[cfg.m_ucPos] == null) {
                this.tianZhuMountMap[cfg.m_ucPos] = [];
            }
            this.tianZhuMountMap[cfg.m_ucPos].push(cfg);

            //最大宝珠的数量
            if (this.tianYanMaxNum < cfg.m_ucPos) {
                this.tianYanMaxNum = cfg.m_ucPos;
            }

            if (this.tianZhuMountLvMap[cfg.m_ucPos] == null) {
                this.tianZhuMountLvMap[cfg.m_ucPos] = {};
            }
            this.tianZhuMountLvMap[cfg.m_ucPos][cfg.m_ucLv] = cfg;

        }
    }

    getTianZhuMountCfg(pos: number) {
        return this.tianZhuMountMap[pos];
    }

    getTianZhuMontByLv(pos: number, lv: number) {
        if (this.tianZhuMountLvMap[pos]) {
            return this.tianZhuMountLvMap[pos][lv];
        }
        return null;

    }

    /**
     * 天珠是否可以显示红点
     */
    tianZhuCanShowTipMark() {
        let visible = G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_TIANZHU);
        if (!visible)
            return false;

        let keyword = KeyWord.HERO_SUB_TYPE_TIANZHU;
        let isShow = false;
        //功能限制不可提升
        let zhufuData = this.getData(keyword);

        if ((zhufuData != null && zhufuData.m_ucLevel == 0)) {
            return false;
        }
        if (G.DataMgr.funcLimitData.isFuncAvailable(keyword)) {
            //可以强化
            isShow = this.canStrengthZhufuSystem(keyword);
            if (isShow)
                return true;

            //成长丹(注:移植过来后没有成长丹)
            //isShow = this.cZDOrzZDShowTipMark(keyword, true);
            //return isShow;
        }
        return false;
    }

    /**
     * 获取天珠阶级
     */
    getTianZhuStage() {
        let data = G.DataMgr.zhufuData.getData(KeyWord.HERO_SUB_TYPE_TIANZHU);
        if (data) {
            return ZhufuData.getZhufuStage(data.m_ucLevel, KeyWord.HERO_SUB_TYPE_TIANZHU);
        }
        return 0;
    }


    tianYanCanShowTipMark() {
        for (let i = 0; i < this.tianYanMaxNum; i++) {
            if (this.oneTianYanSkillCanUp(i + 1)) {
                return true;
            }
        }
        return false;
    }

    oneTianYanSkillCanUp(pos: number) {
        let data = this.getData(KeyWord.HERO_SUB_TYPE_TIANZHU);
        let specData = this.getSpecData(KeyWord.HERO_SUB_TYPE_TIANZHU);
        if (!data || !specData)
            return false;

        let lv = specData.m_stTianZhu.m_ucMountLv[pos - 1];
        let nextCfg = this.getTianZhuMontByLv(pos, lv + 1);
        return (nextCfg && data.m_ucLevel >= nextCfg.m_ucNeedGrade && G.DataMgr.thingData.getThingNum(nextCfg.m_iItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= nextCfg.m_iItemNum)
    }



    /**
     * 通过面板类型，获取对应进阶日
     * @param zfType
     */
    static getJJRTypeByPanelKeyword(id: number): number {
        switch (id) {
            case KeyWord.OTHER_FUNCTION_PET_JINJIE:
                return KeyWord.STAGEDAY_BEAUTY;
            case KeyWord.HERO_SUB_TYPE_ZUOQI:
                return KeyWord.STAGEDAY_HORSE;
            case KeyWord.HERO_SUB_TYPE_FAZHEN:
                return KeyWord.STAGEDAY_LINGYU;
            case KeyWord.BAR_FUNCTION_FAQI:
                return KeyWord.STAGEDAY_FAQI;
            case KeyWord.HERO_SUB_TYPE_WUHUN:
                return KeyWord.STAGEDAY_SQ;
            case KeyWord.HERO_SUB_TYPE_LEILING:
                return KeyWord.STAGEDAY_SHENJI;
            case KeyWord.OTHER_FUNCTION_MAGICCUBE:
                return KeyWord.STAGEDAY_MOFANG;
            default:
                return 0;
        }
    }

    public getStageTotalLucky(type: number, toStage: number): number {
        let toLv = (toStage - 1) * 10 + 1;
        let lucky = 0;
        for (let i = toLv - 9; i <= toLv; i++) {
            let cfg = this.getConfig(type, i);
            if (cfg) {
                lucky += cfg.m_iLucky;
            }
        }
        return lucky;
    }

    //--------------赛季外显示---------
    readonly Season_Max_WX_Count: number = 4;
    private saiji2cfgMap: { [seasonID: number]: GameConfig.SaiJiConfigM[] }
    private sjzhufu2cfgMap: { [seasonID: number]: { [zhufuId: number]: GameConfig.SaiJiConfigM } }
    private sjActiveId2CfgMap: { [thingId: number]: GameConfig.SaiJiConfigM };
    private sjImageId2CfgMap: { [imageId: number]: GameConfig.SaiJiConfigM };
    sjPartMap: { [zhufuId: number]: number } = {};
    //赛季时装，武器分男女
    shiZhuangAndWeapons: number[] = [];
    private setSaiJiConfig() {
        let cfgs: GameConfig.SaiJiConfigM[] = G.Cfgmgr.getCfg('data/SaiJiConfigM.json') as GameConfig.SaiJiConfigM[];
        this.saiji2cfgMap = {};
        this.sjzhufu2cfgMap = {};
        this.sjActiveId2CfgMap = {};
        this.sjImageId2CfgMap = {};
        for (let cfg of cfgs) {
            if (!this.saiji2cfgMap[cfg.m_iSeasonID])
                this.saiji2cfgMap[cfg.m_iSeasonID] = [];
            this.saiji2cfgMap[cfg.m_iSeasonID].push(cfg);

            if (!this.sjzhufu2cfgMap[cfg.m_iSeasonID]) {
                this.sjzhufu2cfgMap[cfg.m_iSeasonID] = {};          
            }

            if (this.sjPartMap[cfg.m_iZhuFuID] == null) {
                this.sjPartMap[cfg.m_iZhuFuID] = cfg.m_iID;
            }

            this.sjzhufu2cfgMap[cfg.m_iSeasonID][cfg.m_iZhuFuID] = cfg;

            if (cfg.m_iSutffID > 0) {
                this.sjActiveId2CfgMap[Math.floor(cfg.m_iSutffID / 10)] = cfg;
            }
            this.sjImageId2CfgMap[cfg.m_iImageID] = cfg;

            if (cfg.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_WUHUN
                || cfg.m_iZhuFuID == KeyWord.HERO_TYPE_SAIJISZ
            ) {
                this.shiZhuangAndWeapons.push(cfg.m_iImageID);
            }

        }
    }

    getSaiJiCfgs(seasonID: number) {
        return this.saiji2cfgMap[seasonID];
    }

    getSaiJiCfg(seasonID: number, zhufuId: number) {
        if (!this.sjzhufu2cfgMap[seasonID])
            return null;
        return this.sjzhufu2cfgMap[seasonID][zhufuId];

    }
    /**
     * 通过物品表
     * @param thingId
     */
    getSaiJiCfgByThingId(thingId: number) {
        return this.sjActiveId2CfgMap[Math.floor(thingId/10)];
    }

    /**
     * 通过化形表
     * @param imageId
     */
    getSaiJiCfgByImageId(imageId: number) {
        return this.sjImageId2CfgMap[imageId];
    }

    hasActiveThisWaiXian(cfg: GameConfig.SaiJiConfigM, saiJiId: number) {
        return (1 << (cfg.m_iID - 1) & this.getSaiJiInfo(saiJiId)) > 0;
    }

    /**
     * 此赛季外显是否已经激活
     * @param saijiId
     * @param zhufuId
     */
    hasActiveWX(saijiId: number, zhufuId: number) {
        let cfg = this.getSaiJiCfg(saijiId, zhufuId);
        if (!cfg)
            return false;
        return this.hasActiveThisWaiXian(cfg, saijiId);
    }


    private saiJiInfoMap: { [saiji: number]: number } = {};
    updateSaiJiInfo(saiJiInfo: Protocol.DBSaiJiInfo) {
        this.saiJiInfoMap = {};
        if (saiJiInfo.m_ucSaiJiCnt == 0)
            return;
        for (let i = 0; i < saiJiInfo.m_ucSaiJiCnt; i++) {
            let info = saiJiInfo.m_astSaiJiList[i];
            this.saiJiInfoMap[i+1]= info.m_iActiveBitMap;
        }
    }

    getSaiJiInfo(saiJi: number) {
        return this.saiJiInfoMap[saiJi];
    }

    getSaiJiProgress() {
        let seasonID = this.getSaiJiCur();
        if (seasonID == 0)
            return 0;
        let flag = this.getSaiJiInfo(seasonID);

        let count = 0;
        for (let i = 0; i < this.Season_Max_WX_Count; i++) {
            if ((1 << i & flag) > 0) {
                count++;
            }
        }
        return count;
    }

    /**最大赛季*/
    getSaiJiMax() {
        //let iDay = G.SyncTime.getDateAfterStartServer();
        //// 赛季功能开启起始时间点 2019-07-23 00:00:00
        //let c_StartTime = 1563811200;
        //let timeTick = G.SyncTime.getCurrentTime()/1000;
        //if (timeTick < c_StartTime)
        //    return 0;
        //iDay = Math.min(iDay, ((timeTick - c_StartTime) / 86400 + 1));
        let iDay = G.SyncTime.getSaiJiDateAfterStartServer();
        if (iDay < Macros.SAIJI_START_DAY)
            return 0;
        iDay -= Macros.SAIJI_START_DAY;
        let aiDays: number[] = [Macros.SAIJI_1_4, Macros.SAIJI_2_7, Macros.SAIJI_3_11, Macros.SAIJI_4_14]
        for (let i = 0; i < Macros.SAIJI_LOOP_CNT; i++) {
            if (iDay < aiDays[i]) {
                return i + 1;
            }
            iDay -= aiDays[i];
        }
       return Macros.SAIJI_LOOP_CNT + Math.floor(iDay / Macros.SAIJI_4_14) + 1;
    }



    /**当前第几赛季*/
    getSaiJiCur(): number {
        let saijiMax = this.getSaiJiMax();
        if (saijiMax == 0)
            return 0;
        return (saijiMax - 1) % Macros.SAIJI_LOOP_CNT + 1;
    }


    /**今天到这个赛季结束还剩多少天*/
    getToday2EndLeftDay(): number {
        let svrDay = G.SyncTime.getSaiJiDateAfterStartServer();
        if (svrDay < Macros.SAIJI_START_DAY)
            return 0;

        //最大赛季数
        let max = this.getSaiJiMax();
        let cur = this.getSaiJiCur();
        let aiDays: number[] = [Macros.SAIJI_1_4, Macros.SAIJI_2_7, Macros.SAIJI_3_11, Macros.SAIJI_4_14]

        let leftDay: number = 0;
        if (max == 1) {
            leftDay= Macros.SAIJI_1_4 + Macros.SAIJI_START_DAY - svrDay;
        } else if (max == 2) {
            leftDay = Macros.SAIJI_1_4 + Macros.SAIJI_2_7+ Macros.SAIJI_START_DAY - svrDay;
        } else if (max == 3) {
            leftDay = Macros.SAIJI_1_4 + Macros.SAIJI_2_7 + Macros.SAIJI_3_11+ Macros.SAIJI_START_DAY - svrDay;
        } else if (max == 4) {
            leftDay = Macros.SAIJI_1_4 + Macros.SAIJI_2_7 + Macros.SAIJI_3_11 + Macros.SAIJI_4_14+ Macros.SAIJI_START_DAY - svrDay;
        } else {
            leftDay = cur * Macros.SAIJI_4_14 + Macros.SAIJI_1_4 + Macros.SAIJI_2_7 + Macros.SAIJI_3_11 + Macros.SAIJI_4_14 + Macros.SAIJI_START_DAY - svrDay;
        }
        return leftDay-1;
    }

    //过滤当前赛季未开的化形
    fitterData(cfgId: number): boolean {
        let cfg: GameConfig.ZhuFuImageConfigM = G.DataMgr.zhufuData.getImageConfig(cfgId);
        if (cfg && cfg.m_iFuncID == KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN) {
            let saiJiMax = G.DataMgr.zhufuData.getSaiJiMax();
            let cfgCur = cfg.m_uiImageId % 10;
            return cfgCur <= saiJiMax;
        }
        return true;
    }

     saijiViewTipMark(): boolean {
        let maxSaiji = this.getSaiJiMax();
         maxSaiji = Math.min(maxSaiji, Macros.SAIJI_LOOP_CNT);
         let thingData = G.DataMgr.thingData;
         for (let i = 0; i < maxSaiji; i++) {
             let cfgs = this.getSaiJiCfgs(i + 1);
             if (!cfgs || cfgs.length == 0)
                 continue;
             for (let j = 0; j < cfgs.length; j++) {
                 let cfg = cfgs[j];
                 if (!cfg||cfg.m_iSutffCount == 0)
                     continue;
                 if (!this.hasActiveThisWaiXian(cfg, i + 1) && thingData.getThingNum(cfg.m_iSutffID, 0, false) >= cfg.m_iSutffCount) {
                     return true;
                 }
             }
        }
        return false;
    }
}
