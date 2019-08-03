import { Global as G } from 'System/global'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { EnumEquipRule } from 'System/data/thing/EnumEquipRule'
import { InsertDiamondList } from 'System/equip/InsertDiamondList'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { ThingData } from 'System/data/thing/ThingData'
import { StringUtil } from 'System/utils/StringUtil'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { MergeTreeData } from 'System/data/vo/MergeTreeData'
import { EquipUtils } from 'System/utils/EquipUtils'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { Profiler } from 'System/utils/Profiler'
import { GameIDType } from 'System/constants/GameEnum'

export class ItemMergeCache {
    private inited: boolean = false;
    private cfg: { [id: number]: GameConfig.ItemMergeM };
    private materialIdMapMergeId: { [materialId: number]: number } = {};
    private merges: { [id: number]: { materials: { [materialId: number]: { neednum: number, curnum: number } }, canNum: number, num: number, lvlLimit: number, stageRel: boolean, } } = {};
    private lastEquipStage = 0;
    private lastWeaponStage = 0;
    private lastHeroLevel = 0;
    private lastArmorStage = 0;
    private lastOrnamentsStage = 0;
    private equipStageRelations: number[] = [];
    private heroLevelRelations: { [index: number]: number[] } = {};
    private markTipCnts: { rootCnt: number, mainClass: { [mainclassId: number]: { cnt: number, subclass: { [subclassId: number]: number } } } } = { rootCnt: 0, mainClass: {} };
    constructor(cfg: { [id: number]: GameConfig.ItemMergeM }) {
        this.cfg = cfg;
        this.init();
    }
    setHeroLevel(heroLevel: number) {
        this.lastHeroLevel = heroLevel;
    }
    updateHeroLevel(heroLevel: number) {
        let merges = this.merges;
        for (let level = this.lastHeroLevel; level <= heroLevel; level++) {
            let refs = this.heroLevelRelations[level];
            if (!refs) continue;
            for (let i = 0, n = refs.length; i < n; i++) {
                let id = refs[i];
                let merge = merges[id];
                if (merge.num == 0) continue;
                let lastHasMarkTip = merge.canNum > 0;
                merge.canNum = merge.num;
                this.resetMarkTip(id, lastHasMarkTip, merge.canNum > 0);
            }
        }
        this.lastHeroLevel = heroLevel;
    }

    updateCurEquipStage() {

        let curEquipStage = this.getCurEquipStageLevel();
        let curWeaponStage = this.getCurWearWeaponStage();
        //防具|饰品
        let curArmorStage = this.getCurArmorStage();
        let curOrnamentsStage = this.getCurOrnamentsStage();
        for (let i = 0, n = this.equipStageRelations.length; i < n; i++) {
            let id = this.equipStageRelations[i];
            let merge = this.merges[id];


            if (merge.num == 0) continue;

            let isWeaponMat: boolean;
            isWeaponMat = this.isWeaponStageMat(merge);

            //是否是强化石
            let cfg = G.DataMgr.equipStrengthenData.getItemMergeConfig(id);
            if (this.isQiangHuaShi(cfg.m_iID)) {
                //强化石
                if (!this.isQiangHuaShiCanMerge(cfg.m_iID)) {
                    continue;
                }
            } else if (this.isMergeZhongJiZhanShi(cfg.m_iID)) {
                //中级斩石
                if (!this.isZhongJiZSCanMerge(cfg.m_iID)) {
                    continue;
                }
            } else if (EquipStrengthenData.isArmorSJS(cfg.m_iProductId)) {
                //防具
                if (merge.lvlLimit > curArmorStage) {
                    continue;
                }
            } else if (EquipStrengthenData.isOrnamentsSJS(cfg.m_iProductId)) {
                //饰品
                if (merge.lvlLimit > curOrnamentsStage) {
                    continue;
                }
            }
            //else if (!isWeaponMat) {
            //    if (merge.lvlLimit > curEquipStage) {
            //        continue;
            //    }
            //}
            else {
                if (merge.lvlLimit > curWeaponStage) {
                    continue;
                }
            }

            let lastHasMarkTip = merge.canNum > 0;
            merge.canNum = merge.num;
            this.resetMarkTip(id, lastHasMarkTip, merge.canNum > 0);
        }
        this.lastWeaponStage = curWeaponStage;
        this.lastEquipStage = curEquipStage;
        this.lastArmorStage = curArmorStage;
        this.lastOrnamentsStage = curOrnamentsStage;
    }

    updateMaterial(materialId: number) {
        materialId = materialId & 0xfffffffe;
        let mergeId = this.materialIdMapMergeId[materialId];
        if (!mergeId) return;
        let merge = this.merges[mergeId];
        let lastHasMarkTip = merge.canNum > 0;
        let mats = merge.materials;
        let curMatInfo = mats[materialId];
        let needNum = curMatInfo.neednum;
        let canMergedNum = G.DataMgr.thingData.getThingNum(materialId, Macros.CONTAINER_TYPE_ROLE_BAG, false) / needNum;
        curMatInfo.curnum = canMergedNum;

        let num = Number.MAX_VALUE;
        for (let matid in mats) {
            let mat = mats[matid];
            if (mat.curnum < num) num = mat.curnum;
        }

        num = Math.floor(num);
        merge.num = num;
        merge.canNum = num;

        let limitLevel: number = 0;

        if (!EquipStrengthenData.isWeaponSJS(materialId)) {
            //如果不是装备升阶石
            if (this.isQiangHuaShi(mergeId)) {
                //强化石
                // limitLevel = G.DataMgr.heroData.avatarList.m_ucStrengLevel;
                limitLevel = G.DataMgr.hunliData.hunguStrengeData.getHunguMaxLevel();
            } else if (this.isMergeZhongJiZhanShi(mergeId)) {
                //中级斩石
                limitLevel = G.DataMgr.thingData.curAllMinZhanMolv;
            }
            else if (EquipStrengthenData.isArmorSJS(materialId)) {
                //防具
                limitLevel = this.lastArmorStage;
            } else if (EquipStrengthenData.isOrnamentsSJS(materialId)) {
                //饰品
                limitLevel = this.lastOrnamentsStage;
            }
            else {
                limitLevel = merge.stageRel ? this.lastEquipStage : this.lastHeroLevel;
            }
        } else {
            //装备升阶石
            limitLevel = merge.stageRel ? this.lastWeaponStage : this.lastHeroLevel;
        }
        merge.canNum = merge.lvlLimit > limitLevel ? 0 : num;
        this.resetMarkTip(mergeId, lastHasMarkTip, merge.canNum > 0);
    }


    /**
     * 得到当前穿戴武器的阶级
     */
    getCurWearWeaponStage(): number {
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null) return 0;

        let oneData = dataList[EquipUtils.getEquipIdxByPart(KeyWord.EQUIP_PARTCLASS_WEAPON)];
        if (oneData) {
            return oneData.config.m_ucStage;
        }
        return 1;
    }

    getCanMergeNum(id: number): number {
        return this.merges[id].canNum;
    }

    hasMarkTip(): boolean {
        return this.markTipCnts.rootCnt > 0;
    }

    hasMarkTipInMainClass(mainClass: number): boolean {
        return this.markTipCnts.mainClass[mainClass].cnt > 0;
    }
    hasMarkTipInSubClass(mainClass: number, subClass: number): boolean {
        return this.markTipCnts.mainClass[mainClass].subclass[subClass] > 0;
    }
    private init() {
        if (this.inited) return;

        let idsMap = this.materialIdMapMergeId;
        let merges = this.merges;
        for (let id in this.cfg) {
            let cfg = this.cfg[id];

            // 建立小红点更新的树结构（从总的小红点到大类红点到子类红点）
            let mainClass = this.markTipCnts.mainClass[cfg.m_iMainClass];
            if (!mainClass) {
                mainClass = { cnt: 0, subclass: {} };
                this.markTipCnts.mainClass[cfg.m_iMainClass] = mainClass;
            }
            mainClass.subclass[cfg.m_iClass] = 0;

            // 建立和等级限制相关的映射表
            let stageRel = this.isEquipStageRelation(cfg);
            if (stageRel) {
                this.equipStageRelations.push(cfg.m_iID);
            }
            else {
                let levelRefs = this.heroLevelRelations[cfg.m_iLevelLimit];
                if (!levelRefs) {
                    levelRefs = [];
                    this.heroLevelRelations[cfg.m_iLevelLimit] = levelRefs;
                }
                levelRefs.push(cfg.m_iID);
            }

            // 建立和材料相关的映射表
            let mergeinfo = merges[id];
            if (!mergeinfo) {
                mergeinfo = { materials: {}, canNum: 0, num: 0, lvlLimit: cfg.m_iLevelLimit, stageRel: stageRel };
                merges[id] = mergeinfo;
            }

            for (let i = 0, n = cfg.m_astSuffData.length; i < n; i++) {
                let cfgmats = cfg.m_astSuffData[i];
                let matid = cfgmats.m_iSuffID & 0xfffffffe;
                idsMap[matid] = cfg.m_iID;
                let mats = mergeinfo.materials[matid];
                if (!mats) {
                    mats = { neednum: 0, curnum: 0 };
                    mergeinfo.materials[matid] = mats;
                }
                mats.neednum += cfgmats.m_iSuffNumber;
            }
        }

        this.inited = true;
    }

    private resetMarkTip(mergeId: number, lastHasMarkTip: boolean, hasMarkTip: boolean) {
        if (lastHasMarkTip == hasMarkTip) return;

        let cfg = this.cfg[mergeId];
        let subClassId = cfg.m_iClass;
        let mainClass = this.markTipCnts.mainClass[cfg.m_iMainClass];
        let subClass = mainClass.subclass;
        if (hasMarkTip) {
            if (subClass[subClassId] == 0) {
                if (mainClass.cnt == 0) this.markTipCnts.rootCnt++;
                mainClass.cnt++;
            }
            subClass[subClassId]++;
        }
        else {
            subClass[subClassId]--;
            if (subClass[subClassId] == 0) {
                mainClass.cnt--;
                if (mainClass.cnt == 0) this.markTipCnts.rootCnt--;
            }
        }
    }
    private isEquipStageRelation(cfg: GameConfig.ItemMergeM): boolean {
        return cfg.m_iMainClass == KeyWord.MERGER_CLASS1_STRONG_ITEM &&
            (cfg.m_iClass == KeyWord.MERGER_CLASS2_STRONG_ITEM_JZTZ ||
                cfg.m_iClass == KeyWord.MERGER_CLASS2_STRONG_ITEM_HZTZ ||
                cfg.m_iClass == KeyWord.MERGER_CLASS2_STRONG_ITEM_FZTZ ||
                cfg.m_iClass == KeyWord.MERGER_CLASS2_STRONG_ITEM_QHS ||
                this.isMergeZhongJiZhanShi(cfg.m_iID)
            );

    }

    private getCurEquipStageLevel(): number {
        let curEquipStage = G.DataMgr.thingData.curEquipStageExceptWeapon - 1;
        return curEquipStage <= 0 ? 1 : curEquipStage;
    }

    /**当前防具的阶级*/
    private getCurArmorStage(): number {
        let curStage = G.DataMgr.thingData.curArmorStage - 1;
        return curStage <= 0 ? 1 : curStage;
    }
    /**当前饰品的阶级*/
    private getCurOrnamentsStage(): number {
        let curStage = G.DataMgr.thingData.curOrnamentsStage - 1;
        return curStage <= 0 ? 1 : curStage;
    }

    private isWeaponStageMat(merge: any): boolean {
        let metId: number = 0;
        //在当前的合成信息里面判断是否是武器进阶石头 ；
        for (let j in merge.materials) {
            let metId: number = parseInt(j);
            if (Math.floor(metId / 1000) == 10419) {
                return true;
            }
        }
        return false;
    }

    ///////////////////强化石需要全身强化大于+20才能合成超级强化石

    /**
     * 是否是强化石
     * @param id
     */
    private isQiangHuaShi(id: number) {
        return id == 1;//表中的id编号
    }

    /**强化石需要全身强化大于+20才能合成超级强化石*/
    private readonly QHSMIXUPLV = 29;
    private isQiangHuaShiCanMerge(id: number): boolean {
        //改魂骨强化等级啦
        return (this.isQiangHuaShi(id) && G.DataMgr.hunliData.hunguStrengeData.getHunguMaxLevel() >= this.QHSMIXUPLV);
        //return (this.isQiangHuaShi(id) && G.DataMgr.heroData.avatarList.m_ucStrengLevel >= this.QHSMIXUPLV)
    }

    ///////////////////斩石需要全身斩石大于+6才能合成中级斩石，高级斩石无限制

    /**
     * 是否是合成中级斩石
     * @param id
     */
    private isMergeZhongJiZhanShi(id: number) {
        return id == 84;//表中的id编号
    }

    private readonly ZJZSMINLV = 6;
    private isZhongJiZSCanMerge(id: number): boolean {
        return (this.isMergeZhongJiZhanShi(id) && G.DataMgr.thingData.curAllMinZhanMolv >= this.ZJZSMINLV)
    }


}

/**
 * 最小可强化，祝福值最大
 */
class MinLvCanStrengthenData {
    //装备列表第几个
    index: number;
    data: ThingItemData;
    //祝福值
    nowLucky: number;
}


export class EquipStrengthenData {

    /**凡，仙，套装*/
    static readonly TZKeyWords: number[] = [KeyWord.SLOT_SUIT_TYPE_1, KeyWord.SLOT_SUIT_TYPE_2];

    /**s升阶（颜色）配置*/
    private m_upColorConfig: { [id: number]: GameConfig.EquipUpColorM };

    /**全身装备强化加成配置*/
    private m_bodyStrengthenConfig: GameConfig.EquipAllBodyStrengPropM[];

    /**全身颜色套装*/
    private m_bodySetsConfig: { [grade: number]: GameConfig.EquipAllColorPropM[] };

    /**祝福系统升阶符配置*/
    private m_zhufuUpColorConfig: { [consumableID: number]: GameConfig.ZFEquipUpColorM[] };

    /**锻造属性，二维，【属性】【级别】*/
    private m_refineConfig: { [attrType: number]: { [wishLevel: number]: GameConfig.EquipWishM } };

    private wishRandomMap: { [equipType: number]: { [level: number]: GameConfig.EquipWishRandomM } } = {};

    /**宝石属性配置*/
    private m_diamondConfigs: { [diamondID: number]: GameConfig.DiamondPropM };

    /**伙伴装备套装属性*/
    private m_petEquipSuitConfigs: { [id: number]: GameConfig.BeautySuitPropM };

    /**斩魔配置表字典*/
    private _zmCfgDic: { [partIDKey: string]: GameConfig.EquipLQM };

    private m_EquipStageConditionCfgs: { [equipPart: number]: GameConfig.EquipStageConditionM } = {};

    /**最小全身强化等级*/
    static readonly MIN_BODY_STRENG: number = 3;

    /**最小全身宝石强化等级*/
    static readonly MIN_BODY_DIAMOND: number = 3;

    /**全身宝石数目*/
    static readonly BODY_DIAMOND_NUM: number = 26;

    /**最大强化等级*/
    static readonly MAX_STRENG_LEVEL: number = 50;

    /**最大宝石等级*/
    static readonly MAX_DIAMOND_LEVEL: number = 10;

    /**装备基本属性倍率*/
    static readonly EQUIP_BASEPROP_LEVEL: number = 10;

    /**最大锻造条数*/
    static readonly MAX_REFINE_NUM: number = 7;

    /**锻造孔开放阶级，0表示用钻石*/
    static readonly RefineSlotOpenStages: number[] = [1, 1, 6, 6, 7, 7, 0];

    static readonly RefineCostParams: number[] = [1, 1, 2, 2, 3, 3, 3];

    /**最大斩魔等级*/
    static MAX_ZM_LEVEL: number = 0;

    /**装备收集label页签数量*/
    static readonly EQUIP_COLLECT_LABEL_NUM: number = 5;

    /**物品合成配置*/
    private m_itemMergeConfig: { [id: number]: GameConfig.ItemMergeM };

    /** */
    private m_itemMergeCache: ItemMergeCache = null;

    /**合成的树状结构*/
    private m_mergeTreeData: { [id: number]: MergeTreeData[] };

    /**
	 *装备位配置 
	 */
    private m_equipSlotLvMap: { [equipPart: number]: { [level: number]: GameConfig.EquipSlotUpLvM } } = {};
    /***装备部位等级 [装备位（0，1，...）-装备位等级 */
    private m_equipSlotInfoList: Protocol.ContainerSlotInfo[] = [];
    /**
     *装备位强化配置
     */
    private m_equipStrengthenMap: { [equipPart: number]: { [id: number]: GameConfig.EquipSlotStrengthenM } } = {};

    /**激活套装数据*/
    activeSuitInfo: Protocol.EquipSuitAct = null;
    /**登陆时获取套装收集进度*/
    equipSuitInfo: Protocol.EquipSuitInfo = null;

    washStageInfo: Protocol.EquipWashStage;

    /**装备位套装信息*/
    slotSuitInfo: Protocol.SlotSuitInfo = null;

    /**装备位炼体升级消耗信息*/
    slotLTUpCostInfo: Protocol.SlotLTUpCostInfo = null;

    get ItemMergeCache(): ItemMergeCache {
        return this.m_itemMergeCache;
    }

    get bodyStrengthConfig(): GameConfig.EquipAllBodyStrengPropM[] {
        return this.m_bodyStrengthenConfig;
    }

    private setBodyStrengthenConfig(): void {
        let data: GameConfig.EquipAllBodyStrengPropM[] = G.Cfgmgr.getCfg('data/EquipAllBodyStrengPropM.json') as GameConfig.EquipAllBodyStrengPropM[];
        this.m_bodyStrengthenConfig = data;
        this.m_bodyStrengthenConfig.sort(this._sortBodyStrengthenConfig);
    }

    private _sortBodyStrengthenConfig(a: GameConfig.EquipAllBodyStrengPropM, b: GameConfig.EquipAllBodyStrengPropM): number {
        return a.m_ucStrengLevel - b.m_ucStrengLevel;
    }

    private _sortBodyDiamondConfig(a: GameConfig.DiamondAllBodyMountPropM, b: GameConfig.DiamondAllBodyMountPropM): number {
        return a.m_ucLevel - b.m_ucLevel;
    }

    private setEquipUpColorConfig(): void {
        let data: GameConfig.EquipUpColorM[] = G.Cfgmgr.getCfg('data/EquipUpColorM.json') as GameConfig.EquipUpColorM[];
        this.m_upColorConfig = {};
        for (let config of data) {
            this.m_upColorConfig[Math.floor(config.m_iID / 10)] = config;
        }
    }

    private setColorSetsConfig(): void {
        let equipStrengthenData: GameConfig.EquipAllColorPropM[] = G.Cfgmgr.getCfg('data/EquipAllColorPropM.json') as GameConfig.EquipAllColorPropM[];
        this.m_bodySetsConfig = {};

        for (let config of equipStrengthenData) {
            if (this.m_bodySetsConfig[config.m_iGrade] == null) {
                this.m_bodySetsConfig[config.m_iGrade] = new Array<GameConfig.EquipAllColorPropM>()
            }
            this.m_bodySetsConfig[config.m_iGrade].push(config);
        }
        //this.m_bodySetsConfig.sort(this._sortColorSetsConfig);

    }

    private _sortColorSetsConfig(a: GameConfig.EquipAllColorPropM, b: GameConfig.EquipAllColorPropM): number {
        return a.m_ucNum - b.m_ucNum;
    }

    private setDiamondConfig(): void {
        let data: GameConfig.DiamondPropM[] = G.Cfgmgr.getCfg('data/DiamondPropM.json') as GameConfig.DiamondPropM[];
        this.m_diamondConfigs = {};
        for (let cfg of data) {
            this.m_diamondConfigs[cfg.m_uiDiamondID] = cfg;
        }
    }

    getDiamondConfig(id: number): GameConfig.DiamondPropM {
        return this.m_diamondConfigs[(id | 0x1)];
    }

    private _sortDiamondPropConfig(a: GameConfig.DiamondPropM, b: GameConfig.DiamondPropM): number {
        return a.m_iPropValue - b.m_iPropValue;
    }

    getUpColorConfig(id: number): GameConfig.EquipUpColorM {
        return this.m_upColorConfig[Math.floor(id / 10)];
    }

    getBodyStrengthenConfigByLevel(lv: number): GameConfig.EquipAllBodyStrengPropM {
        if (lv < EquipStrengthenData.MIN_BODY_STRENG || lv > EquipStrengthenData.MAX_STRENG_LEVEL) {
            return null;
        }
        else {
            return this.m_bodyStrengthenConfig[lv - EquipStrengthenData.MIN_BODY_STRENG];
        }
    }

    getNextBodyStrengthenConfig(lv: number): GameConfig.EquipAllBodyStrengPropM {
        if (lv < EquipStrengthenData.MIN_BODY_STRENG) {
            return this.m_bodyStrengthenConfig[0];
        }
        else if (lv >= EquipStrengthenData.MAX_STRENG_LEVEL) {
            //满级的时候都是显示顶级的数据
            return this.m_bodyStrengthenConfig[EquipStrengthenData.MAX_STRENG_LEVEL - EquipStrengthenData.MIN_BODY_STRENG];
        }
        else {
            return this.m_bodyStrengthenConfig[lv + 1 - EquipStrengthenData.MIN_BODY_STRENG];
        }
    }

    getColorSetsConfig(): GameConfig.EquipAllColorPropM[] {
        return null;
        //  return this.m_bodySetsConfig;
    }

    getColorSetConfigByNum(grade: number): GameConfig.EquipAllColorPropM[] {
        return this.m_bodySetsConfig[grade];
    }


    //getColorSetConfigByNum(num: number): GameConfig.EquipAllColorPropM {
    //    let l: number = this.m_bodySetsConfig.length;
    //    for (let i: number = 0; i < l; i++) {
    //        if (num < this.m_bodySetsConfig[i].m_ucNum) {
    //            if (i == 0) {
    //                return null;
    //            }
    //            else {
    //                return this.m_bodySetsConfig[i - 1];
    //            }
    //        }
    //    }
    //    return this.m_bodySetsConfig[l - 1];
    //}

    /**
    * 根据装备equipPart获得强化等级
    * @param data
    *
    */
    static getEquipLevel(equipPart: number, isGetNextStrengLv: boolean = false): number {
        let slotInfo = G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(equipPart - 100);
        if (slotInfo) {
            if (isGetNextStrengLv) {
                return slotInfo.m_usStrengthenLv < this.MAX_STRENG_LEVEL ? (slotInfo.m_usStrengthenLv + 1) : this.MAX_STRENG_LEVEL;
            } else {
                return slotInfo.m_usStrengthenLv;
            }
        } else {
            return 0;
        }

        ////装备id的第六七位表示强化等级
        // return Math.floor(id / 10) % 100;
    }
    /**
     * 根据装备id获得阶级
     * @param id
     */
    static getEquipUpLevel(id: number): number {
        return Math.floor(id / 10) % 100;
    }

    /**
    * 根据当前id获取强化到指定级别级的id
    * @param id
    *
    */
    static getBestEquipID(id: number, level: number = 0): number {
        if (level == 0) {
            level = EquipStrengthenData.MAX_STRENG_LEVEL;
        }

        let n: number = id % 10;
        return Math.floor(id / 1000) * 1000 + level * 10 + n;
    }

    /**
     * 获取一件装备等级
     * @return
     *
     */
    private getOneEquipStrengthenLevel(data: ThingItemData): number {
        if (data == null)
            return 0;
        let level: number = 0;

        level = EquipStrengthenData.getEquipLevel(data.config.m_iEquipPart);
        return level;
    }

    /**
     * 获取装备总等级
     * @return
     *
     */
    getAllEquipStrengthenLevelSum(): number {
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        let level: number = 0;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            level += this.getOneEquipStrengthenLevel(dataList[i]);
        }
        return level;
    }

    /**
     * 获取强化装备的数量
     * @return
     *
     */
    getEquipStrengthenLevelCount(level: number): number {
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null)
            return 0;

        let count: number = 0;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            if (dataList[i] == null)
                continue;
            let equipIdx = EquipUtils.getEquipIdxByPart(dataList[i].config.m_iEquipPart);
            let strengthenLv = this.getEquipSlotOneDataByPart(equipIdx).m_usStrengthenLv;
            if (strengthenLv >= level)
                count++;
        }
        return count;
    }

    getGodEquipCount(color: number): number {
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null)
            return 0;
        let level: number = 0;
        let count: number = 0;
        let equipData: ThingItemData;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            if (dataList[i] == null)
                continue;
            equipData = dataList[i]
            if (equipData.config.m_ucColor >= color)
                count++;
        }
        return count;
    }

    getCurEquipCollectProgress(): { [colorType: number]: number } {
        let m_color = KeyWord.COLOR_PURPLE;
        let progress: { [colorType: number]: number } = {};
        progress[m_color] = this.getGodEquipCount(m_color);

        if (this.getGodEquipCount(m_color) >= EquipUtils.All_EQUIP_NUM) {
            //神装达到
            progress = {};
            m_color = KeyWord.COLOR_ORANGE;
            progress[m_color] = this.getGodEquipCount(m_color);
        }
        if (this.getGodEquipCount(m_color) >= EquipUtils.All_EQUIP_NUM) {
            //超神达到
            progress = {};
            m_color = KeyWord.COLOR_GOLD;
            progress[m_color] = this.getGodEquipCount(m_color);
        }
        if (this.getGodEquipCount(m_color) >= EquipUtils.All_EQUIP_NUM) {
            //武级达到
            progress = {};
            m_color = KeyWord.COLOR_RED;
            progress[m_color] = this.getGodEquipCount(m_color);
        }
        if (this.getGodEquipCount(m_color) >= EquipUtils.All_EQUIP_NUM) {
            //天下达到
            progress = {};
            m_color = KeyWord.COLOR_PINK;
            progress[m_color] = this.getGodEquipCount(m_color);
        }
        return progress;
    }

    /**
    * 获取全身装备的最小等级
    * @return
    *
    */
    getAllEquipStrengthenMinLevel(): number {
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null)
            return 0;
        let minLevel: number = 99;
        let level: number = 0;
        let data: ThingItemData;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            data = dataList[i];
            if (!data) {
                minLevel = 0;
                break;
            }
            level = EquipStrengthenData.getEquipLevel(data.config.m_iEquipPart);
            minLevel = Math.min(level, minLevel);
        }
        return minLevel;
    }

    /**
    * 获取全身宝石总等级
    * @return
    *
    */
    getAllInsertDiamondLevel(): number {
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null)
            return 0;
        let level: number = 0;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            level += this.getOneEquipInsertDiamondLevel(dataList[i]);
        }
        return level;
    }

    /**
    * 获取全身宝石总数量
    * @return
    *
    */
    getAllInsertDiamondCount(level: number): number {
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null)
            return 0;
        let id: number = 0;
        let count: number = 0;
        let data: ThingItemData;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            data = dataList[i];
            if (data == null)
                continue;
            let diamondIDs: number[] = data.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stDiamond.m_aiDiamondID;
            for (let j: number = 0; j < InsertDiamondList.DIAMOND_NUM; j++) {
                id = diamondIDs[j];
                if (id > 0 && EquipStrengthenData.getEquipLevel(data.config.m_iEquipPart) >= level)
                    count++;
            }
        }
        return count;
    }

    /**
     * 获取一件装备宝石的等级
     * @param data
     * @return
     *
     */
    private getOneEquipInsertDiamondLevel(data: ThingItemData): number {
        if (data == null)
            return 0;
        let id: number = 0;
        let level: number = 0;
        //把各个等级的宝石数目记下来
        for (let i: number = 0; i < InsertDiamondList.DIAMOND_NUM; i++) {
            id = data.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stDiamond.m_aiDiamondID[i];
            if (id > 0)
                level += EquipStrengthenData.getEquipLevel(data.config.m_iEquipPart);
        }
        return level;
    }

    static getKeyWordByEuai(value: number): number {

        // 生命 
        if (value == Macros.EUAI_MAXHP) {
            return KeyWord.EQUIP_PROP_HP;
        }
        if (value == Macros.EUAI_MAXMP) {
            return KeyWord.EQUIP_PROP_MP;
        }
        if (value == Macros.EUAI_CRITICAL) {
            return KeyWord.EQUIP_PROP_CRITICAL;
        }
        if (value == Macros.EUAI_TOUGHNESS) {
            return KeyWord.EQUIP_PROP_TOUGHNESS;
        }
        if (value == Macros.EUAI_PHYATK) {
            return KeyWord.EQUIP_PROP_PHYSIC_ATTACK;
        }
        if (value == Macros.EUAI_MAGATK) {
            return KeyWord.EQUIP_PROP_MAGIC_ATTACK;
        }
        if (value == Macros.EUAI_DEFENSE) {
            return KeyWord.EQUIP_PROP_DEFENSE;
        }
        if (value == Macros.EUAI_DODGE) {
            return KeyWord.EQUIP_PROP_DODGE;
        }
        if (value == Macros.EUAI_GOAL) {
            return KeyWord.EQUIP_PROP_GOAL;
        }
        if (value == Macros.EUAI_DEFPRESS) {
            return KeyWord.EQUIP_PROP_DEFENSE_PRESS;
        }
        if (value == Macros.EUAI_ATKPRESS) {
            return KeyWord.EQUIP_PROP_ATTACK_PRESS;
        }
        if (value == Macros.EUAI_MAGICRESIST) {
            return KeyWord.EQUIP_PROP_MAGICRESIST;
        }
        if (value == Macros.EUAI_MAX_SOUL) {
            return KeyWord.EQUIP_PROP_SOUL_ATTACK;
        }
        if (value == Macros.EUAI_HURTEXTRA) {
            return KeyWord.EQUIP_PROP_HURT_EXTRA;
        }
        if (value == Macros.EUAI_CRITICAL_HURT) {
            return KeyWord.EQUIP_PROP_CRITICAL_HURT;
        }
        if (value == Macros.EUAI_SPEED) {
            return KeyWord.EQUIP_PROP_SPEED;
        }

        if (value == Macros.EUAI_THROUGH) {
            return KeyWord.EQUIP_PROP_THROUGH;
        }

        return 0;
    }

    private setZhufuUpColorConfig(): void {
        let data: GameConfig.ZFEquipUpColorM[] = G.Cfgmgr.getCfg('data/ZFEquipUpColorM.json') as GameConfig.ZFEquipUpColorM[];
        this.m_zhufuUpColorConfig = {};
        for (let config of data) {
            if (this.m_zhufuUpColorConfig[config.m_iConsumableID] == null) {
                this.m_zhufuUpColorConfig[config.m_iConsumableID] = new Array<GameConfig.ZFEquipUpColorM>();
            }
            this.m_zhufuUpColorConfig[config.m_iConsumableID].push(config);
        }
    }

    getZfUpColorConfig(id: number): GameConfig.ZFEquipUpColorM[] {
        id = Math.floor(id / 10) * 10;
        return this.m_zhufuUpColorConfig[id];
    }

    private RefineStage2SlotOpenNums: { [stage: number]: number };

    private setEquipRefineConfig(): void {
        let data: GameConfig.EquipWishM[] = G.Cfgmgr.getCfg('data/EquipWishM.json') as GameConfig.EquipWishM[];
        this.m_refineConfig = {};
        for (let config of data) {
            if (this.m_refineConfig[config.m_ucAttrType] == null) {
                this.m_refineConfig[config.m_ucAttrType] = {};
            }

            this.m_refineConfig[config.m_ucAttrType][config.m_ucWishLevel] = config;
        }

        this.RefineStage2SlotOpenNums = {};
        this.RefineStage2SlotOpenNums[1] = 2;
        this.RefineStage2SlotOpenNums[6] = 4;
        this.RefineStage2SlotOpenNums[7] = 6;

    }


    /////////////////////////附魂/////////////////////////////
    /**
     * 通过装备阶级，获取附魂免费开启的数量
     * @param equipStage
     */
    getRefineOpenNums(equipStage: number) {
        let maxNum = 0;
        for (let stage in this.RefineStage2SlotOpenNums) {
            let num = this.RefineStage2SlotOpenNums[stage];
            if (equipStage >= parseInt(stage) && maxNum < num) {
                maxNum = num;
            }
        }
        return maxNum;
    }


    getRefineConfig(type: number, level: number): GameConfig.EquipWishM {
        let data = this.m_refineConfig[type];
        if (data) {
            return data[level];
        }
        else {
            return null;
        }
    }

    wishRandomMaxStar: { [part: number]: { [lv: number]: number } }
    wishRandomMaxAttrs: { [part: number]: { [lv: number]: number[] } }
    private setEquipWishRandomConfig(): void {
        let cfgs = G.Cfgmgr.getCfg('data/EquipWishRandomM.json') as GameConfig.EquipWishRandomM[];
        this.wishRandomMaxStar = {};
        this.wishRandomMaxAttrs = {};
        for (let config of cfgs) {
            if (this.wishRandomMap[config.m_ucEquipPart] == null) {
                this.wishRandomMap[config.m_ucEquipPart] = {};
            }
            this.wishRandomMap[config.m_ucEquipPart][config.m_ucStage] = config;

            if (this.wishRandomMaxStar[config.m_ucEquipPart] == null) {
                this.wishRandomMaxStar[config.m_ucEquipPart] = {};
            }
            for (let i = 0; i < config.m_ausProb.length; i++) {
                let prop = config.m_ausProb[i];
                if (prop == 10000) {
                    this.wishRandomMaxStar[config.m_ucEquipPart][config.m_ucStage] = i;
                }
            }

            if (this.wishRandomMaxAttrs[config.m_ucEquipPart] == null) {
                this.wishRandomMaxAttrs[config.m_ucEquipPart] = {};
            }
            this.wishRandomMaxAttrs[config.m_ucEquipPart][config.m_ucStage] = config.m_aucPropName;
        }
    }

    getWishRandomCfg(equipPart: number, level: number): GameConfig.EquipWishRandomM {
        let typeMap = this.wishRandomMap[equipPart];
        if (null != typeMap) {
            return typeMap[level];
        }
        return null;
    }


    getWishRandomMaxProp(equipPart: number, lv: number): number[] {
        let props: number[] = [];
        let partCfg = this.wishRandomMaxAttrs[equipPart];
        if (partCfg) {
            props = partCfg[lv];
        }
        return props;
    }

    getWishRandomMaxStar(equipPart: number, lv: number): number {
        let star = 0;
        let maxStar = this.wishRandomMaxStar;
        let partMaxStars = maxStar[equipPart];
        if (partMaxStars) {
            star = partMaxStars[lv];
        }
        return star;
    }

    private setPetEquipSuitConfigs(): void {
        let data: GameConfig.BeautySuitPropM[] = G.Cfgmgr.getCfg('data/BeautySuitPropM.json') as GameConfig.BeautySuitPropM[];
        this.m_petEquipSuitConfigs = {};
        for (let config of data) {
            this.m_petEquipSuitConfigs[config.m_uiID] = config;
        }
    }

    getPetEquipSuitConfig(id: number): GameConfig.BeautySuitPropM {
        return this.m_petEquipSuitConfigs[id];
    }

    /**初始化装备斩魔配置表*/
    private setEquipLQCfg(): void {
        let configs: GameConfig.EquipLQM[] = G.Cfgmgr.getCfg('data/EquipLQM.json') as GameConfig.EquipLQM[];
        let key: string;
        this._zmCfgDic = {};
        for (let config of configs) {
            key = StringUtil.marriageLine(config.m_ucEquipPart, config.m_iID);
            EquipStrengthenData.MAX_ZM_LEVEL = Math.max(EquipStrengthenData.MAX_ZM_LEVEL, config.m_iID);
            this._zmCfgDic[key] = config;
        }
    }

    /**获取装备斩魔配置表*/
    getEquipLqCfg(equipPart: number, level: number): GameConfig.EquipLQM {
        let key: string;
        key = StringUtil.marriageLine(equipPart, level);
        return this._zmCfgDic[key];
    }


    private setItemMergeConfig(): void {
        let data: GameConfig.ItemMergeM[] = G.Cfgmgr.getCfg('data/ItemMergeM.json') as GameConfig.ItemMergeM[];
        this.m_itemMergeConfig = {};
        this.m_mergeTreeData = {};
        for (let config of data) {
            this.m_itemMergeConfig[config.m_iID] = config;
        }
        this.m_itemMergeCache = new ItemMergeCache(this.m_itemMergeConfig);
    }


    getItemMergeConfig(id: number): GameConfig.ItemMergeM {
        return this.m_itemMergeConfig[id];
    }

    getMergeTreeDate(cls: number, needFilter: boolean): Array<MergeTreeData> {
        if (this.m_mergeTreeData[cls] == null) {
            this.m_mergeTreeData[cls] = this.getTreeDataByClass(cls);
        }
        let result: Array<MergeTreeData> = [];
        let returnItem1: MergeTreeData;
        let lv: number = G.DataMgr.heroData.level;
        for (let item1 of this.m_mergeTreeData[cls]) {
            returnItem1 = null;
            for (let item2 of item1.items) {
                if (lv < this.getItemMergeConfig(item2.classID).m_iLevelLimit) {
                    continue;
                }
                if (!needFilter || this.getCanItemMergeNum(item2.classID) > 0) {
                    if (returnItem1 == null) {
                        returnItem1 = new MergeTreeData();
                        returnItem1.items = [];
                        returnItem1.classID = item1.classID;
                        returnItem1.self = item1.self;
                        returnItem1.opened = false;
                    }
                    returnItem1.items.push(item2);
                }
            }
            if (returnItem1 != null) {
                result.push(returnItem1);
            }
        }
        return result;
    }

    private getTreeDataByClass(cls: number): Array<MergeTreeData> {
        let result: Array<MergeTreeData> = [];
        let type: number[] = new Array<number>();
        let allID: Array<Array<number>> = new Array<Array<number>>();
        for (let idKey in this.m_itemMergeConfig) {
            let config = this.m_itemMergeConfig[idKey];
            if (config.m_iMainClass == cls) {
                if (type.indexOf(config.m_iClass) < 0) {
                    type.push(config.m_iClass);
                    allID.push(new Array<number>());
                }
                allID[type.indexOf(config.m_iClass)].push(config.m_iID);
            }
        }
        let returnItem1: MergeTreeData[] = [];
        let returnItem2: MergeTreeData;

        for (let i: number = 0; i < type.length; i++) {
            returnItem1[i] = new MergeTreeData();
            returnItem1[i].items = [];
            returnItem1[i].classID = type[i];
            returnItem1[i].self = KeyWord.getDesc(this._getMergeClass2GroupByClass1(cls), type[i]);
            returnItem1[i].opened = false;
            let l: number = allID[i].length;
            for (let j: number = 0; j < l; j++) {
                returnItem2 = new MergeTreeData();
                returnItem2.items = null;
                returnItem2.classID = allID[i][j];
                returnItem2.self = '';
                returnItem2.array = this.getItemMergeConfig(allID[i][j]).m_iArray;
                returnItem2.opened = false;
                returnItem1[i].items.push(returnItem2);
            }
            returnItem1[i].items.sort(this.sortMergeTreeData);
            result.push(returnItem1[i]);
        }
        return result;
    }

    private sortMergeTreeData(a: MergeTreeData, b: MergeTreeData) {
        if (a.array > b.array) {
            return 1;
        }
        else if (a.array == b.array) {
            return 0;
        }
        else {
            return -1;
        }
    }

    private _getMergeClass2GroupByClass1(cls1: number): number {
        let cls2: number = 0;
        if (cls1 == KeyWord.MERGER_CLASS1_JEWEL) {
            cls2 = KeyWord.GROUP_MERGER_CLASS2_JEWEL;
        }
        else if (cls1 == KeyWord.MERGER_CLASS1_EQUIP) {
            cls2 = KeyWord.GROUP_MERGER_CLASS2_EQUIP;
        }
        else if (cls1 == KeyWord.MERGER_CLASS1_STRONG_ITEM) {
            cls2 = KeyWord.GROUP_MERGER_CLASS2_STRONG_ITEM;
        }
        else if (cls1 == KeyWord.MERGER_CLASS1_PET) {
            cls2 = KeyWord.GROUP_MERGER_CLASS2_PET;
        }

        return cls2;
    }

    getCanItemMergeNum(id: number): number {
        return this.m_itemMergeCache.getCanMergeNum(id);
        /*
        let config: GameConfig.ItemMergeM = this.getItemMergeConfig(id);
        let canMergeNum: number = 10000;
        let num: number = 0;

        //大类是合成材料，小类是图纸（进阶石）
        if (config.m_iMainClass == KeyWord.MERGER_CLASS1_STRONG_ITEM &&
            (config.m_iClass == KeyWord.MERGER_CLASS2_STRONG_ITEM_JZTZ ||
                config.m_iClass == KeyWord.MERGER_CLASS2_STRONG_ITEM_HZTZ ||
                config.m_iClass == KeyWord.MERGER_CLASS2_STRONG_ITEM_FZTZ
            )) {
            let curEquipStageExceptWeapon = G.DataMgr.thingData.curEquipStageExceptWeapon - 1;
            curEquipStageExceptWeapon = curEquipStageExceptWeapon <= 0 ? 1 : curEquipStageExceptWeapon;
            if (config.m_iLevelLimit > curEquipStageExceptWeapon) {
                return 0;
            }
        }

        if (config.m_iLevelLimit > G.DataMgr.heroData.level) {
            return 0;
        }
        for (let i: number = 0; i < config.m_astSuffData.length; i++) {
            if (config.m_astSuffData[i].m_iSuffID != 0) {
                if (i > 0 && config.m_astSuffData[i].m_iSuffID == config.m_astSuffData[i - 1].m_iSuffID) {
                    num += config.m_astSuffData[i].m_iSuffNumber;
                }
                else {
                    num = config.m_astSuffData[i].m_iSuffNumber;
                }

                let cnt: number = Math.floor(G.DataMgr.thingData.getThingNum(config.m_astSuffData[i].m_iSuffID, Macros.CONTAINER_TYPE_ROLE_BAG, false) / num);
                if (cnt < canMergeNum) {
                    canMergeNum = cnt;
                }
            }
        }

        return canMergeNum;
        */
    }

    canItemMergeByType(cls: number = 0): boolean {
        if (cls == KeyWord.MERGER_CLASS1_STRONG_ITEM && !G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_MERGE_MATERIAL)) {
            return false;
        }
        return this.m_itemMergeCache.hasMarkTipInMainClass(cls);
    }

    onCfgReady(): void {
        this.setBodyStrengthenConfig();
        this.setEquipUpColorConfig();
        this.setColorSetsConfig();
        this.setEquipRefineConfig();
        this.setEquipWishRandomConfig();
        this.setDiamondConfig();
        this.setZhufuUpColorConfig();
        this.setItemMergeConfig();
        this.setEquipLQCfg();
        this.setPetEquipSuitConfigs();
        this.setEquipStageConditionCfgs();
        this.setEquipSlotConfig();
        this.setEquipSlotStrengthenConfig();
        this.setEquipDiamondMountConfig();
        this.setEquipFinalPropConfig();
        this.setEquipSlotSuitConfig();
        this.setEquipSlotSuitUpConfig();
        this.setWingStrengthCfg();
        this.setWingCreateCfg();
        this.setEquipLianTiConfig();
        this.setEquipLianTiSBConfig();
        this.setRebirthSuitCfg();
        this.setRebirthRefineCfg();
        this.setRebirthRefineSuitCfg();
    }




    /////////////////装备强化////////////////////

    /**
     *装备强化配置设置
     * @param config
     */
    public setEquipSlotStrengthenConfig(): void {
        let configs = G.Cfgmgr.getCfg("data/EquipSlotStrengthenM.json") as GameConfig.EquipSlotStrengthenM[];
        for (let cfg of configs) {
            let subMap = this.m_equipStrengthenMap[cfg.m_iEquipPart];
            if (!subMap) {
                this.m_equipStrengthenMap[cfg.m_iEquipPart] = subMap = {};
            }
            if (subMap[0] == null) {
                subMap[0] = null;
            }
            subMap[cfg.m_iID] = cfg;
        }
    }
    /**
     *通过装备部位获取装备位强化配置 
     * @param part
     * 
     */
    public getEquipStrengthenConfigByPart(part: number, isGetNextStreng: boolean = false): GameConfig.EquipSlotStrengthenM {
        let subMap = this.m_equipStrengthenMap[part];
        if (subMap) {
            if (isGetNextStreng) {
                return this.getNextEquipStrengthenConfigByPart(part);
            } else {
                let partIdx = EquipUtils.getEquipIdxByPart(part);
                let lv = this.getEquipSlotOneDataByPart(partIdx).m_usStrengthenLv;
                return subMap[lv];
            }
        }
        return null;
    }

    /**
     *通过装备部位获取装备位强化下一级配置 
     * @param part
     * 
     */
    public getNextEquipStrengthenConfigByPart(part: number): GameConfig.EquipSlotStrengthenM {
        let subMap = this.m_equipStrengthenMap[part];
        if (subMap) {
            let partIdx = EquipUtils.getEquipIdxByPart(part);
            let lv = this.getEquipSlotOneDataByPart(partIdx).m_usStrengthenLv + 1;
            return subMap[lv < EquipStrengthenData.MAX_STRENG_LEVEL ? lv : EquipStrengthenData.MAX_STRENG_LEVEL];
        }
    }

    //public getNextEquipStrengthenData(part: number): ThingItemData {
    //    let config = this.getNextEquipStrengthenConfigByPart(part);
    //    let itemData = new ThingItemData();
    //    itemData.config = config;
    //    itemData.data = 
    //}

    /**得到可强化*/
    getCanStrengthEquip(num: number = 0): number[] {
        let result: number[] = [];
        let level: number = 0;
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null) return null;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            if (dataList[i] == null)
                continue;

            let id = this.getOneEquipCanStrenth(dataList[i]);
            if (id > 0) {
                result.push(id);
                if (num > 0 && result.length >= num) {
                    break;
                }
            }
        }
        return result;
    }

    /**
     * 得到穿戴装备中，能强化
     * 并且强化等级最低的的数组
     * 排序规则 祝福值相同-装备位顺序
     * 不同，祝福值多的在前面  
     */
    getMinCanStrengthDataList(): MinLvCanStrengthenData[] {
        let minLv = this.getCanStrengthMinLv();
        let level = 0;
        let minLvEquips: MinLvCanStrengthenData[] = [];
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null) return null;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            if (dataList[i] == null)
                continue;
            let id = this.getOneEquipCanStrenth(dataList[i]);
            if (id > 0) {
                let partIdx = dataList[i].config.m_iEquipPart % KeyWord.EQUIP_PARTCLASS_MIN;
                level = this.getEquipSlotOneDataByPart(partIdx).m_usStrengthenLv;
                if (minLv == level) {
                    let minEquip = new MinLvCanStrengthenData();
                    minEquip.data = dataList[i];
                    minEquip.index = i;
                    minEquip.nowLucky = dataList[i].data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stStrong.m_uiStrongProgress;
                    minLvEquips.push(minEquip);
                }
            }
        }
        minLvEquips.sort(this.sortListData);
        return minLvEquips;
    }

    /**
    * 排序
    * @param data1
    * @param data2
    * @return
    *
    */
    private sortListData(data1: MinLvCanStrengthenData, data2: MinLvCanStrengthenData): number {
        if (data1.nowLucky != data2.nowLucky) {
            return data2.nowLucky - data1.nowLucky;
        }
        else {
            return data1.index - data2.index;
        }
    }

    /**
     *得到可强化的最小等级
     */
    getCanStrengthMinLv(): number {
        let level = 0;
        let minlevel: number = 99;
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null) return minlevel;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            if (dataList[i] == null)
                continue;
            let id = this.getOneEquipCanStrenth(dataList[i]);
            if (id > 0) {
                let partIdx = dataList[i].config.m_iEquipPart % KeyWord.EQUIP_PARTCLASS_MIN;
                let level = this.getEquipSlotOneDataByPart(partIdx).m_usStrengthenLv;

                if (minlevel > level) {
                    minlevel = level;
                }
            }
        }
        return minlevel;
    }


    /**
     * 指定装备是否可以强化
     * @param equipData
     */
    getOneEquipCanStrenth(equipData: ThingItemData): number {
        if (equipData != null) {
            let partIdx = equipData.config.m_iEquipPart % KeyWord.EQUIP_PARTCLASS_MIN;
            let level = this.getEquipSlotOneDataByPart(partIdx).m_usStrengthenLv;
            if (level < EquipStrengthenData.MAX_STRENG_LEVEL) {
                let equipId = equipData.config.m_iID;
                let equipStrengthenConfig = this.getNextEquipStrengthenConfigByPart(equipData.config.m_iEquipPart);
                if (equipStrengthenConfig != null) {
                    let materialId = equipStrengthenConfig.m_uiConsumableID;
                    let materialNeed = equipStrengthenConfig.m_uiConsumableNumber;
                    let materialHave = G.DataMgr.thingData.getThingNum(materialId, Macros.CONTAINER_TYPE_ROLE_BAG, false);
                    if (materialHave >= materialNeed) {
                        return equipId;
                    }
                }
            }
        }
        return 0;
    }

    /**得到可升阶*/
    getCanUpLevelEquip(num: number = 0): number[] {
        let result: number[] = new Array<number>();
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null) return null;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            if (dataList[i] == null)
                continue;
            let equipConfig: GameConfig.EquipUpColorM = G.DataMgr.equipStrengthenData.getUpColorConfig(dataList[i].config.m_iID);
            if (equipConfig == null)
                continue;
            //if (dataList[i].config.m_ucStage >= KeyWord.EQUIP_STAGE_3) {
            let equipId = dataList[i].config.m_iID;
            let materialId = equipConfig.m_iConsumableID;
            let materialNeed = equipConfig.m_iConsumableNumber;
            let materialHave = G.DataMgr.thingData.getThingNum(materialId, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            if (materialHave >= materialNeed) {
                result.push(equipId);
                if (num > 0 && result.length >= num) {
                    break;
                }
            }
            //}
        }
        return result;
    }

    /**
     * 指定装备是否可以升阶级
     * @param equipData
     */
    getOneEquipCanUpLevel(equipData: ThingItemData): number {
        if (equipData != null) {
            //let equipConfig: GameConfig.EquipUpColorM = this.getUpColorConfig(equipData.config.m_iID);
            // if (equipData.config.m_ucStage >= KeyWord.EQUIP_STAGE_3) {
            let equipConfig: GameConfig.EquipUpColorM = this.getUpColorConfig(equipData.config.m_iID);
            if (equipConfig == null) return 0;
            let equipId = equipData.config.m_iID;
            let materialId = equipConfig.m_iConsumableID;
            let materialNeed = equipConfig.m_iConsumableNumber;
            let materialHave = G.DataMgr.thingData.getThingNum(materialId, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            if (materialHave >= materialNeed) {
                return equipId;
            }
            // }
        }
        return 0;
    }



    /**
     * 所有穿戴装备是否可以斩魔（附魔）
     */
    canZhanMoInAllEquip(): boolean {
        let can: boolean = false;
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null) return;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            if (dataList[i] == null) continue;
            can = this.isEquipGold(dataList[i]);
            if (can) {
                return true;
            }
        }
        return false;
    }

    /**
     * 得到一个装备中宝石的最小等级
     */
    private getOneEquipInsertDiamondLv(data: ThingItemData): number {
        let diamondIds = this.getOneEquipInsertDiamondID(data);
        let minLv = 999;
        for (let i = 0; i < diamondIds.length; i++) {
            let lv = EquipUtils.getDiamondLevel(diamondIds[i]);
            if (lv < minLv) {
                minLv = lv;
            }
        }
        return minLv;
    }


    /**
     * 得到一件装备中，镶嵌宝石类型.只存放等级最小的
     * @param data
     */
    private getOneEquipInsertDiamondType(data: ThingItemData): { [type: number]: number } {
        let diamondIds = this.getOneEquipInsertDiamondID(data);
        let typeLv: { [type: number]: number } = {};
        for (let i = 0; i < diamondIds.length; i++) {
            let cfg: GameConfig.DiamondPropM = G.DataMgr.equipStrengthenData.getDiamondConfig(diamondIds[i]);
            let lv = EquipUtils.getDiamondLevel(diamondIds[i]);
            if (typeLv[cfg.m_ucPropId] == null || typeLv[cfg.m_ucPropId] > lv) {
                typeLv[cfg.m_ucPropId] = lv;
            }
        }
        return typeLv;
    }

    /**
   * 得到一件装备中,镶嵌的宝石ID
   * @param data
   */
    private getOneEquipInsertDiamondID(data: ThingItemData): number[] {
        if (data == null)
            return null;
        let id: number = 0;
        let level: number = 0;
        let thingIDs: number[] = [];
        for (let i: number = 0; i < InsertDiamondList.DIAMOND_NUM; i++) {
            id = data.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stDiamond.m_aiDiamondID[i];
            if (id > 0) {
                thingIDs.push(id);
            }
        }
        return thingIDs;
    }
    /////////////////////////////////////////////////////////////////////////////

    /**
     * 是否可以镶嵌或替换宝石
     */
    isCanInsertOrReplaceDiamond(): boolean {
        let canInsert: boolean = false;
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null) return false;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            if (dataList[i] == null) continue;
            canInsert = this.isOneEquipCanInsert(dataList[i]);
            if (canInsert) {
                return true;
            }
        }
        return false;
    }


    /**
    * 一个装备是否可以镶嵌，替换
    * 只要能穿，且比身上高的，就提示
    * @param data
    */
    isOneEquipCanInsert(data: ThingItemData): boolean {
        if (data == null)
            return false;
        for (let i: number = 0; i < InsertDiamondList.DIAMOND_NUM; i++) {
            if (this.oneSlotCanInsert(data, i)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 一个魂骨装备比较品质（在个人副本中，比较身上的品质）
     * @param equipId 
     */
    isHunguEquipAtPersonal(equipId: number): boolean {
        if (!GameIDUtil.isHunguEquipID(equipId)) return false;

        //先比品质 再比星级
        let data = ThingData.getThingConfig(equipId);
        //职业限制
        let prof = data.m_ucProf;
        if (prof != 0 && prof != G.DataMgr.heroData.profession) return false;
        let equipDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let hunguEquip = equipDatas[data.m_iEquipPart - KeyWord.HUNGU_EQUIP_PARTCLASS_MIN];
        if (hunguEquip == null) return true;
        if (data.m_iDropLevel > hunguEquip.config.m_iDropLevel) {
            return true;
        }
        else if (data.m_iDropLevel == hunguEquip.config.m_iDropLevel) {
            if (data.m_ucStage > hunguEquip.config.m_ucStage) return true;
        }
        return false;
    }

    /**
     * 一个装备，某个槽 是否可以镶嵌或替换或升级
     * @param equipData
     * @param index
     * @param butLvUp 是否排除升级
     */
    oneSlotCanInsert(data: ThingItemData, index: number, butLvUp: boolean = false): boolean {
        if (G.DataMgr.hunliData.level >= EquipUtils.SLOT_OPEN_LEVEL[index]) {
            let id = data.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stDiamond.m_aiDiamondID[index];
            //装备对应位置宝石属性
            let propId = G.DataMgr.equipStrengthenData.getEquipDiamondMount(data.config.m_iEquipPart).m_ucPropId[index];
            //得到背包中指定类型最大的
            let lv = G.DataMgr.thingData.getDiamondMaxLevelByType(propId, data);
            //没镶嵌且有能镶嵌的||已经镶嵌宝石的等级
            if ((id <= 0 && lv > 0) || (lv > EquipUtils.getDiamondLevel(id))) {
                return true;
            }
            if (!butLvUp) {
                //可以升级
                if (id > 0 && G.DataMgr.thingData.isOneDaimondCanLvUp(id, data)) {
                    return true;
                }
            }
        }
        return false;
    }


    /**
     * 一个装备是否有未镶嵌孔
     * @param data
     */
    private oneEquipHaveEmptyPos(data: ThingItemData): boolean {
        if (data == null)
            return false;
        let id: number = 0;
        for (let i: number = 0; i < InsertDiamondList.DIAMOND_NUM; i++) {
            if (G.DataMgr.hunliData.level >= EquipUtils.SLOT_OPEN_LEVEL[i]) {
                id = data.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stDiamond.m_aiDiamondID[i];
                if (id <= 0) {
                    return true;
                }
            }
        }
        return false;
    }
    ////////////////////////////////////////////////////////////////////

    /**检查装备是否可以斩魔（附魔）*/
    isEquipGold(data: ThingItemData): boolean {
        if (data == null) return false;
        let crtEquipConfig = data.config;
        if (crtEquipConfig && crtEquipConfig.m_ucColor >= KeyWord.COLOR_GOLD) {
            let crtLevel = data.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stLQ.m_ucLQLevel;
            let nextEquipLqCfg: GameConfig.EquipLQM = this.getEquipLqCfg(crtEquipConfig.m_iEquipPart, crtLevel + 1);
            if (nextEquipLqCfg == null) return false;
            let materialId = nextEquipLqCfg.m_iConsumableID;
            let materialHave = G.DataMgr.thingData.getThingNum(materialId, Macros.CONTAINER_TYPE_ROLE_BAG, false);
            if (materialHave >= nextEquipLqCfg.m_iConsumableNumber) {
                return true;
            }
        }
        return false;
    }

    /**
     * 所有装备中是否有可以升级的
     */
    IsAllEquipExistCanLevelUp(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_EQUIP_SLOTLVUP)) return false;
        let can: boolean = false;
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null) return false;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            if (dataList[i] == null) continue;
            can = this.oneEquipPartIsCanLevelUp(dataList[i]);
            if (can) {
                return true;
            }
        }
        return false;
    }

    /**
   * 一个装备是否可以升级
   */
    oneEquipPartIsCanLevelUp(data: ThingItemData): boolean {
        if (data == null) return false;
        let equipPos = data.data.m_usPosition;
        let equipPart = equipPos + KeyWord.EQUIP_MAINCLASS_MIN;
        let m_selectedEquipSlotInfo = G.DataMgr.equipStrengthenData.getEquipSlotOneDataByPart(equipPos);

        if (m_selectedEquipSlotInfo == null) return false;

        if (m_selectedEquipSlotInfo.m_iSlotLv >= G.DataMgr.heroData.level) {
            //强化等级不能超过主角等级！
            return false;
        }

        let m_nextEquipSlotConfig = G.DataMgr.equipStrengthenData.getEquipSlotConfigByPartAndLv(equipPart, m_selectedEquipSlotInfo.m_iSlotLv + 1);
        if (m_nextEquipSlotConfig == null) {
            //当前装备已达到最高等级！
            return false;
        }

        if (m_nextEquipSlotConfig.m_ucLimitColor > 0 && (data.config.m_ucColor < m_nextEquipSlotConfig.m_ucLimitColor)) {
            //当前品质的装备已达到最高等级
            return false;
        }
        return G.DataMgr.heroData.tongqian >= m_nextEquipSlotConfig.m_iConsumableNumber;
    }



    private setEquipStageConditionCfgs(): void {
        let dataList: GameConfig.EquipStageConditionM[] = G.Cfgmgr.getCfg('data/EquipStageConditionM.json') as GameConfig.EquipStageConditionM[];
        for (let cfg of dataList) {
            this.m_EquipStageConditionCfgs[cfg.m_ucEquipPart] = cfg;
        }
    }

    getEquipStageConditionCfg(equipPart: number): GameConfig.EquipStageConditionM {
        return this.m_EquipStageConditionCfgs[equipPart];
    }

    /////////////////装备升级////////////////////

    /**
	 *装备位配置设置 
	 * @param config
	 * 
	 */
    public setEquipSlotConfig(): void {
        let configs = G.Cfgmgr.getCfg('data/EquipSlotUpLvM.json') as GameConfig.EquipSlotUpLvM[];
        for (let cfg of configs) {
            let subMap = this.m_equipSlotLvMap[cfg.m_iEquipPart];
            if (!subMap) {
                this.m_equipSlotLvMap[cfg.m_iEquipPart] = subMap = {};
            }
            subMap[cfg.m_usLevel] = cfg;
        }
    }
    /**
     *通过装备部位和等级取部位配置 
     * @param part
     * @param lv
     * 
     */
    public getEquipSlotConfigByPartAndLv(part: number, lv: number): GameConfig.EquipSlotUpLvM {
        let subMap = this.m_equipSlotLvMap[part];
        if (subMap) {
            return subMap[lv];
        }
        return null;
    }


    public setEquipSlotData(data: Protocol.EquipSlotInfoList): void {
        this.m_equipSlotInfoList = [];
        for (let i: number = 0; i < data.m_usSlotNumber; i++) {
            this.m_equipSlotInfoList[i] = data.m_astSlot[i];
        }
    }
    public setEquipSlotLevelData(data: Protocol.EquipSlotInfoList): void {
        for (let i: number = 0; i < data.m_usSlotNumber; i++) {
            this.m_equipSlotInfoList[i].m_iSlotLv = data.m_astSlot[i].m_iSlotLv;
        }
    }

    updateWashStage(washStageInfo: Protocol.EquipWashStage) {
        if (washStageInfo.m_ucLv == 0) {
            washStageInfo.m_ucLv = 1;
        }
        this.washStageInfo = washStageInfo;
    }
    /**
     *设置单个装备位置等级，一般是装备升级以后回复设置 
     * @param part 装备位置
     * @param oneData 等级
     * 
     */
    setEquipSlotOneData(part: number, oneData: Protocol.ContainerSlotInfo): void {
        this.m_equipSlotInfoList[part].m_iSlotLv = oneData.m_iSlotLv;
    }
    /**
     *设置单个装备位置等级，一般是装备强化以后回复设置 
     * @param part 装备位置
     * @param oneData 强化
     * 
     */
    setEquipStrengthenLv(part: number, oneData: Protocol.ContainerSlotInfo): void {
        this.m_equipSlotInfoList[part].m_usStrengthenLv = oneData.m_usStrengthenLv;
    }

    /**
     * 设置单个装备位，激活套装类型
     * @param part
     * @param suitType
     */
    setEquipSlotSuitType(part: number, suitType: number): void {
        this.m_equipSlotInfoList[part].m_ucSuitType = suitType;
    }

    /**
    * 设置单个装备位,装备炼体的等级
    * @param part
    * @param suitType
    */
    setEquipLianTiLv(part: number, lv: number, luckValue: number): void {
        this.m_equipSlotInfoList[part].m_ucLianTiLv = lv;
        this.m_equipSlotInfoList[part].m_uiLianTiLuck = luckValue;
    }

    /**
   * 设置单个装备位,装备炼体神宝的数量
   * @param part
   * @param suitType
   */
    setEquipLianTiSBNum(part: number, pos: number, num: number): void {
        this.m_equipSlotInfoList[part].m_aucLTSB[pos] = num;
    }




    /**
     *所有装备位数据 
     * @return 
     * 
     */
    public get equipSlotList(): { [part: number]: Protocol.ContainerSlotInfo } {
        return this.m_equipSlotInfoList;
    }
    /**
     * part 0-1-2-3...   
     *通过装备位取对应位置的等级 
     * @param part 装备位0开始
     * 
     */
    public getEquipSlotOneDataByPart(part: number): Protocol.ContainerSlotInfo {
        return this.m_equipSlotInfoList[part];
    }

    /**
     * 装备是否终极进阶过
     * @param pos
     */
    public isEquipHadFinalUpLv(pos: number, isOther: boolean = false): boolean {
        //表示精灵，婚戒
        if (pos < 0) return false;
        if (isOther) {
            return G.DataMgr.otherPlayerData.cacheRoleInfo.m_stEquipSlotInfoList.m_astSlot[pos].m_ucSlotStage > 0
        } else {
            return this.m_equipSlotInfoList[pos].m_ucSlotStage > 0;
        }
    }

    /**
     * 当前阶级时装是否已经激活
     * @param curSelectStage
     */
    isCurrentEquipCollectShiZHuangHasActive(curSelectStage: number): boolean {
        let colorList: GameConfig.EquipAllColorPropM[] = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(curSelectStage);
        let imageList = G.DataMgr.heroData.dressList.m_astImageList;
        if (imageList == null || colorList == null) return false;
        for (let i = 0; i < G.DataMgr.heroData.dressList.m_ucNumber; i++) {
            if (imageList[i].m_uiImageID == EquipUtils.subStringEquipCollectDressImgId(colorList[colorList.length - 1].m_iDressID)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 装备收集大也签，是否显示红点
     * @param index
     */
    getEquipCollectLabelTipMark(index: number) {
        let subIndexs: number[] = [];
        subIndexs = EquipUtils.EQUIP_COLLECT_TITLE_ARRAY[index];
        for (let i = 0; i < subIndexs.length; i++) {
            let index = subIndexs[i];
            if (this.getEquipStageCanActiveType(index) > 0) {
                return true;
            }
        }
        return false;
    }


    /**
     * 得到装备收集对应阶级是否可以激活
     * @param curSelectStage
     */
    getEquipStageCanActiveType(curSelectStage: number): number {
        let data = this.equipSuitInfo;
        //表示数据还没有
        if (data == null) {
            return -1;
        }
        //当前已经收集数量
        let numComplete = G.DataMgr.thingData.getEquipSuitsCount(curSelectStage);
        let colorList: GameConfig.EquipAllColorPropM[] = G.DataMgr.equipStrengthenData.getColorSetConfigByNum(curSelectStage);
        //查看时装列表中是否有当前阶级，有说明已经激活，this.curSelectStage++
        if (curSelectStage < data.m_ucStage) {
            return -1;
        }
        else if (curSelectStage == data.m_ucStage) {
            //当前选择的阶级 = 服务端存储的阶级
            if (this.isCurrentEquipCollectShiZHuangHasActive(data.m_ucStage) && data.m_ucNum == 8) {
                //是否已经激活了时装
                return -1;
            }
            //没有激活时装
            for (let i = 0; i < colorList.length; i++) {
                //当前收集的>=限制
                if ((numComplete >= colorList[i].m_ucNum) && (data.m_ucNum < colorList[i].m_ucNum || data.m_ucNum == 8)) {
                    return curSelectStage;
                }
            }
        }
        else {
            //当前选择的阶级 > 服务端存储的阶级
            //如果当前选择-服务端>1,表示不可激活，等于1，先判断服务端阶级是否激活时装，没激活时装=>不可激活，激活时装=>判断收集进度
            let value = curSelectStage - data.m_ucStage;
            if (value > 1) {
                return -1;
            } else {
                //一次都没有激活
                if (data.m_ucStage == 0 && numComplete >= colorList[0].m_ucNum) {
                    return 1;
                }
                else if (this.isCurrentEquipCollectShiZHuangHasActive(data.m_ucStage) == true && numComplete >= colorList[0].m_ucNum && data.m_ucNum == 8) {
                    //当前已激活，下一阶未激活
                    return curSelectStage;
                }
            }
        }
        return -1;
    }


    /**
     * 得到装备收集，当前能激活的类型
     */
    getEquipCollectCurrentCanActiveStage(): boolean {

        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION)) {
            return false;
        }

        for (let i = 1; i <= ThingData.maxEquipStage; i++) {
            if (this.getEquipStageCanActiveType(i) > 0) {
                return true;
            }
        }
        return false;
    }


    ////////////////////装备宝石///////////////////

    private equipPart2DiamondMount: { [equipType: number]: GameConfig.DiamondMountM } = {};
    /**
   *装备位对应宝石配置
   * 
   */
    public setEquipDiamondMountConfig(): void {
        let configs = G.Cfgmgr.getCfg('data/DiamondMountM.json') as GameConfig.DiamondMountM[];
        for (let cfg of configs) {
            this.equipPart2DiamondMount[cfg.m_iEquipPart] = cfg;
        }
    }
    /**
     *得到装备位对应宝石配置
     * @param part
     * @param lv
     * 
     */
    public getEquipDiamondMount(equipPos: number): GameConfig.DiamondMountM {
        return this.equipPart2DiamondMount[equipPos];
    }

    //////////////////////////////装备终极进阶/////////////////////////

    private equipFinalConfigMap: { [equipPart: number]: GameConfig.EquipFinalPropM } = {};

    private setEquipFinalPropConfig(): void {
        let configs: GameConfig.EquipFinalPropM[] = G.Cfgmgr.getCfg('data/EquipFinalPropM.json') as GameConfig.EquipFinalPropM[];
        for (let cfg of configs) {
            this.equipFinalConfigMap[cfg.m_iEquipPart] = cfg;
        }
    }

    getEquipFinalPropConfigByEquipPart(equipPart: number) {
        return this.equipFinalConfigMap[equipPart];
    }

    //////////////////////凡仙 装备位套装//////////////////////////////

    private equipSlotSuitConfigMap: { [type: number]: { [equipPart: number]: GameConfig.EquipSlotSuitActM } } = {};
    private setEquipSlotSuitConfig(): void {
        let configs: GameConfig.EquipSlotSuitActM[] = G.Cfgmgr.getCfg('data/EquipSlotSuitActM.json') as GameConfig.EquipSlotSuitActM[];
        for (let cfg of configs) {
            let typeMap = this.equipSlotSuitConfigMap[cfg.m_ucType];
            if (!typeMap) {
                this.equipSlotSuitConfigMap[cfg.m_ucType] = typeMap = {};
            }
            typeMap[cfg.m_iEquipPart] = cfg;
        }
    }

    getEquipSlotSuitConfig(type: number, equipPart: number) {
        let typeMap = this.equipSlotSuitConfigMap[type];
        if (typeMap) {
            return typeMap[equipPart];
        }
        return null;
    }

    //////////////////////凡仙 装备位套装   强化//////////////////////////////
    private equipEquipSlotSuitUpConfigMap: { [type: number]: { [lv: number]: GameConfig.EquipSlotSuitUpM } } = {};
    private setEquipSlotSuitUpConfig(): void {
        let configs: GameConfig.EquipSlotSuitUpM[] = G.Cfgmgr.getCfg('data/EquipSlotSuitUpM.json') as GameConfig.EquipSlotSuitUpM[];
        for (let cfg of configs) {
            if (this.equipEquipSlotSuitUpConfigMap[cfg.m_ucType] == null) {
                this.equipEquipSlotSuitUpConfigMap[cfg.m_ucType] = {};
            }
            this.equipEquipSlotSuitUpConfigMap[cfg.m_ucType][cfg.m_ucLv] = cfg;
        }
    }

    getEquipSlotSuitUpConfig(type: number, lv: number) {
        let typeMap = this.equipEquipSlotSuitUpConfigMap[type];
        if (typeMap) {
            return typeMap[lv];
        }
        return null;
    }

    getEquipSlotSuitActiveCount(type: number) {
        let count = 0;
        let slotList = this.equipSlotList;
        for (let info in slotList) {
            if (slotList[info].m_ucSuitType >= type) {
                count++;
            }
        }
        return count;
    }

    /**
     * 获得第一个能激活的装备位索引
     * @param type
     */
    getFirstCanActiveEquipSlotSuit(type: number) {
        let dataList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (dataList == null) return 0;
        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            if (dataList[i] == null) continue;
            if (this.getOneEquipSlotSuitCanActive(dataList[i], type)) {
                return i;
            }
        }
        return 0;
    }


    /**
     * 一个装备位 套装是否可以激活
     * @param equipData
     * @param type 1-凡界套 2-仙界套
     */
    getOneEquipSlotSuitCanActive(equipData: ThingItemData, type: number) {
        if (equipData == null) return false;
        let equipPart = equipData.config.m_iEquipPart;
        //套装激活配置
        let config = G.DataMgr.equipStrengthenData.getEquipSlotSuitConfig(type, equipPart);
        if (config.m_iCondType == KeyWord.SLOT_SUIT_COND_EQUIPUP && equipData.config.m_ucStage >= config.m_iCondValue) {
            //一个装备位的信息
            let slotInfo = this.getEquipSlotOneDataByPart(EquipUtils.getEquipIdxByPart(equipPart));
            return (config.m_iConsumNum != 0 && slotInfo.m_ucSuitType < KeyWord.SLOT_SUIT_TYPE_1 &&
                G.DataMgr.thingData.getThingNum(config.m_iConsumID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= config.m_iConsumNum &&
                G.DataMgr.thingData.getThingNum(config.m_iConsumID2, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= config.m_iConsumNum2
            )
        } else if (config.m_iCondType == KeyWord.SLOT_SUIT_COND_SUITUP) {
            //一个装备位的信息
            let slotInfo = this.getEquipSlotOneDataByPart(EquipUtils.getEquipIdxByPart(equipPart));
            return (slotInfo && config.m_iConsumNum != 0 && slotInfo.m_ucSuitType == KeyWord.SLOT_SUIT_TYPE_1 && slotInfo.m_ucSuitType <= config.m_iCondValue &&
                G.DataMgr.thingData.getThingNum(config.m_iConsumID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= config.m_iConsumNum &&
                G.DataMgr.thingData.getThingNum(config.m_iConsumID2, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= config.m_iConsumNum2
            )
        } else {
            return false;
        }
    }


    getEuipSlotSuitCanUpLv(type: number) {
        if (this.slotSuitInfo) {
            let lv = this.slotSuitInfo.m_ucSuitLv[type - 1];
            let config = G.DataMgr.equipStrengthenData.getEquipSlotSuitUpConfig(type, lv + 1);
            return (config && G.DataMgr.thingData.getThingNum(config.m_iConsumID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= config.m_iConsumNum)
        }
        return false;

    }

    //////////////////////////////装备炼体////////////////////////////
    /**银两可强化次数*/
    equipLianTiYingLiangMaxCount = -1;
    /**绑定元宝强化次数*/
    equipLianTiBindGoldMaxCount = -1;

    private equipLianTiConfigMap: { [equipPart: number]: { [lv: number]: GameConfig.EquipSlotLianTiM } } = {};
    private setEquipLianTiConfig(): void {
        let configs: GameConfig.EquipSlotLianTiM[] = G.Cfgmgr.getCfg('data/EquipSlotLianTiM.json') as GameConfig.EquipSlotLianTiM[];
        for (let cfg of configs) {
            if (this.equipLianTiConfigMap[cfg.m_iEquipPart] == null) {
                this.equipLianTiConfigMap[cfg.m_iEquipPart] = {};
            }
            this.equipLianTiConfigMap[cfg.m_iEquipPart][cfg.m_ucLv] = cfg;

            if (this.equipLianTiYingLiangMaxCount < 0) {
                this.equipLianTiYingLiangMaxCount = cfg.m_iTQLimit;
            }
            if (this.equipLianTiBindGoldMaxCount < 0) {
                this.equipLianTiBindGoldMaxCount = cfg.m_iBindYBLimit;
            }
        }
    }

    getEquipLianTiConfig(equipPart: number, lv: number) {
        if (this.equipLianTiConfigMap[equipPart]) {
            return this.equipLianTiConfigMap[equipPart][lv];
        }
        return null;
    }

    /**神宝数量*/
    static MaxGemstoneCount: number = 5;
    private equipLianTiSBConfigMap: { [equipPart: number]: GameConfig.EquipSlotLTSBM } = {};
    private setEquipLianTiSBConfig(): void {
        let configs: GameConfig.EquipSlotLTSBM[] = G.Cfgmgr.getCfg('data/EquipSlotLTSBM.json') as GameConfig.EquipSlotLTSBM[];
        for (let cfg of configs) {
            this.equipLianTiSBConfigMap[cfg.m_ucID] = cfg;
        }
    }

    getEquipLianTiSBConfig(part: number) {
        return this.equipLianTiSBConfigMap[part];
    }

    /**选择方式3种*/
    static readonly MaxToggleSelectType = 3;
    /**
     * 某个装备位置
     * 炼体是否可以升级
     * @param equipData
     */
    oneEquipLianTiCanLvUp(equipPart: number) {
        for (let i = 0; i < EquipStrengthenData.MaxToggleSelectType; i++) {
            if (this.oneEquipLianTiCanLvUpByType(equipPart, i + 1, false)) {
                return true;
            }
        }
        return false;
    }

	/**
     * 炼体可以强化
     * @param equipPart 装备位
     * @param type 消耗类型，1铜钱，2绑元，3道具
     * @param checkYB 是否需要检查钻石可强化（自动强化时需要，小红点提示不需要）
     */
    oneEquipLianTiCanLvUpByType(equipPart: number, type: number, checkYB: boolean): boolean {
        let partIndex = equipPart % KeyWord.EQUIP_PARTCLASS_MIN;
        let equipSlotInfo = this.getEquipSlotOneDataByPart(partIndex);
        let nextCfg = this.getEquipLianTiConfig(equipPart, equipSlotInfo.m_ucLianTiLv + 1);
        if (nextCfg == null) return false;
        let heroData = G.DataMgr.heroData;
        let costInfo = this.slotLTUpCostInfo;

        //有下一级配置
        switch (type) {
            case 1:
                return (((this.equipLianTiYingLiangMaxCount - costInfo.m_ucTongQian) > 0 && heroData.tongqian >= nextCfg.m_iTongQian));
            case 2:
                return checkYB ? (((this.equipLianTiBindGoldMaxCount - costInfo.m_ucBindYB) > 0 && heroData.gold >= nextCfg.m_iBindYB)) : false;
            case 3:
                return (G.DataMgr.thingData.getThingNum(nextCfg.m_iItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= nextCfg.m_iItemNum);
            default:
                return false;
        }
    }

    /**
     * 一个装备位，是否可以激活神宝
     * @param equipPart
     */
    oneEquipLianTiCanActiveSB(equipPart: number) {
        let equipSlotInfo = this.getEquipSlotOneDataByPart(equipPart % KeyWord.EQUIP_PARTCLASS_MIN);
        let lv = equipSlotInfo.m_ucLianTiLv;
        for (let i = 0; i < EquipStrengthenData.MaxGemstoneCount; i++) {
            let cfg = this.getEquipLianTiSBConfig(i + 1);
            //某个位置激活次数
            let activeCount = this.lianTiSBPosLv(equipPart, i);
            if (activeCount == 0 && lv >= cfg.m_ucUseLevel && G.DataMgr.thingData.getThingNum(cfg.m_iItemID, Macros.CONTAINER_TYPE_ROLE_BAG, false) >= cfg.m_iItemNum) {
                return true;
            }
        }
        return false;
    }

    /**
     * 某个装备位，第N个孔神宝的激活次数
     * @param equipData
     * @param pos
     */
    lianTiSBPosLv(equipPart: number, pos: number): number {
        let partIndex = equipPart % KeyWord.EQUIP_PARTCLASS_MIN;
        let equipSlotInfo = this.getEquipSlotOneDataByPart(partIndex);
        return (equipSlotInfo && equipSlotInfo.m_ucLTSBNum > 0) ? equipSlotInfo.m_aucLTSB[pos] : 0;
    }

    /**
     * 炼体是否存在可以升级或者激活
     */
    isLianTiCanLvUpOrActive() {
        for (let equipPart = KeyWord.EQUIP_PARTCLASS_MIN; equipPart < KeyWord.EQUIP_PARTCLASS_MAX; equipPart++) {
            if (this.oneEquipLianTiCanLvUp(equipPart) || this.oneEquipLianTiCanActiveSB(equipPart)) {
                return true;
            }
        }
        return false;
    }


    ///////////////////////武器升阶石， 装备升阶石，饰品升阶石//////////////////////////////

    static readonly ArmorEquipNum = 4;
    /**是否防具装备*/
    static isArmorEquip(part: number) {
        return part == KeyWord.EQUIP_PARTCLASS_HAT
            || part == KeyWord.EQUIP_PARTCLASS_CLOTH
            || part == KeyWord.EQUIP_PARTCLASS_TROUSER
            || part == KeyWord.EQUIP_PARTCLASS_SHOE;

    }

    static readonly OrnamentsEquipNum = 3;
    /**是否饰品装备*/
    static isOrnamentsEquip(part: number) {
        return part == KeyWord.EQUIP_PARTCLASS_NECKCHAIN
            || part == KeyWord.EQUIP_PARTCLASS_RING
            || part == KeyWord.EQUIP_PARTCLASS_CHAIN;
    }


    private static readonly WeaponIdRange = 10419;
    private static readonly ArmorIdRange = 10418;
    private static readonly OrnamentsIdRange = 10412;
    /**是否是武器进阶石*/
    static isWeaponSJS(id: number) {
        return Math.floor(id / 1000) == this.WeaponIdRange;
    }
    /**是否是装备升阶石*/
    static isArmorSJS(id: number) {
        return Math.floor(id / 1000) == this.ArmorIdRange;
    }
    /**是否是饰品升阶石*/
    static isOrnamentsSJS(id: number) {
        return Math.floor(id / 1000) == this.OrnamentsIdRange;
    }

    ///////////////////////////////////////翅膀装备/////////////////

    private wingStrengthCfgMap: { [thingId: number]: { [lv: number]: GameConfig.WingStrengthM } };
    private setWingStrengthCfg() {
        let configs: GameConfig.WingStrengthM[] = G.Cfgmgr.getCfg('data/WingStrengthM.json') as GameConfig.WingStrengthM[];
        this.wingStrengthCfgMap = {};
        for (let cfg of configs) {
            if (this.wingStrengthCfgMap[cfg.m_iID] == null) {
                this.wingStrengthCfgMap[cfg.m_iID] = {};
            }
            this.wingStrengthCfgMap[cfg.m_iID][cfg.m_iLv] = cfg;
        }
    }

    getWingStrengthCfg(thingId: number, lv: number) {
        if (this.wingStrengthCfgMap[thingId]) {
            return this.wingStrengthCfgMap[thingId][lv];
        }
        return null;
    }

    //翅膀合成相关
    private wingCreateCfgMap: { [id: number]: GameConfig.WingCreateM };
    wingCreateCfgs: GameConfig.WingCreateM[];
    private setWingCreateCfg() {
        this.wingCreateCfgs = G.Cfgmgr.getCfg('data/WingCreateM.json') as GameConfig.WingCreateM[];
        this.wingCreateCfgMap = {};
        for (let cfg of this.wingCreateCfgs) {
            this.wingCreateCfgMap[cfg.m_iID] = cfg;
        }
    }

    getWingCreateCfg(id: number) {
        return this.wingCreateCfgMap[id];
    }

    /**
     * 获得材料位是否上锁
     * @param id
     */
    getWingCreateMaterialNeedNums(id: number): number[] {
        let needMaterialNum: number[] = [0, 0, 0];
        let cfg = this.wingCreateCfgMap[id];
        if (cfg) {
            if (cfg.m_astMaterialA && cfg.m_astMaterialA.length > 0) {
                needMaterialNum[0] = cfg.m_astMaterialA.length;
            }
            if (cfg.m_astMaterialB && cfg.m_astMaterialB.length > 0) {
                needMaterialNum[1] = cfg.m_astMaterialB.length;
            }
            if (cfg.m_astMaterialC && cfg.m_astMaterialC.length > 0) {
                needMaterialNum[2] = cfg.m_astMaterialC.length;
            }
        }
        return needMaterialNum;
    }

    /**
     * 获取翅膀装备的颜色
     * @param thingCfg
     * @param thingInfo
     * @param prevviewLv
     */
    getWingEquipColor(thingCfg: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo, prevviewLv: number = 0) {

        if (prevviewLv == 0 && (!thingInfo || !thingInfo.m_stThingProperty || !thingInfo.m_stThingProperty.m_stSpecThingProperty ||
            !thingInfo.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo)
        )
            return 0;

        let color = 0;
        if (thingCfg.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING) {
            //翅膀颜色获取
            let lv = 0;
            if (thingInfo) {
                lv = thingInfo.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stStrong.m_uiStrongProgress
            } else if (prevviewLv > 0) {
                //预览等没有动态属性时显示指定等级的
                lv = prevviewLv;
            }
            let wingStrengthCfg = G.DataMgr.equipStrengthenData.getWingStrengthCfg(thingCfg.m_iID, lv);
            if (wingStrengthCfg)
                color = wingStrengthCfg.m_iColor;
        }
        return color;
    }

    private roleWingCreateRsp: Protocol.RoleWingCreateRsp;
    updateRoleWingCreateRsp(info: Protocol.RoleWingCreateRsp) {
        this.roleWingCreateRsp = info;
    }

    getRoleWingCreateRsp() {
        return this.roleWingCreateRsp;
    }

    oneWingEquipCanMerge(id: number) {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_MERGE_WING))
            return false;
        let cfg = this.wingCreateCfgMap[id];
        if (!cfg)
            return false;

        let needNumArry = this.getWingCreateMaterialNeedNums(id);
        let materials: GameConfig.WingMaterial[][] = [cfg.m_astMaterialA, cfg.m_astMaterialB, cfg.m_astMaterialC];
        let subOks: boolean[] = [false, false, false];
        //材料ABC
        for (let i = 0; i < materials.length; i++) {
            let mater = materials[i];
            //材料位锁住的
            if (needNumArry[i] == 0) {
                continue;
            }

            //材料ABC中的某一个
            for (let j = 0; j < mater.length; j++) {
                let data = mater[j];
                if (G.DataMgr.thingData.getThingNum(data.m_iId, 0, false) >= data.m_iNum) {
                    subOks[i] = true;
                    break;
                }
            }
        }

        for (let i = 0; i < needNumArry.length; i++) {
            if (needNumArry[i] == 0)
                continue;
            //只要存在一种不满足的就无法合成
            if (!subOks[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * 是否显示翅膀合成的红点
     */
    isShowWingEquipMergeTipMark() {
        for (let cfg of this.wingCreateCfgs) {
            if (this.oneWingEquipCanMerge(cfg.m_iID))
                return true;
        }
        return false;
    }



    getWingModelIdByWingEquip(equipId: number, equipLv: number): number {
        let cfg = this.getWingStrengthCfg(equipId, equipLv);
        if (!cfg)
            return 0;
        return cfg.m_iModelID;
    }

    isShowWingEquipStrengthTipMark() {
        let equipList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
        if (!equipList)
            return false;

        let wingEquip = equipList[KeyWord.EQUIP_PARTCLASS_WING - KeyWord.EQUIP_PARTCLASS_MIN];
        if (!wingEquip || !wingEquip.data || !wingEquip.data.m_stThingProperty)
            return false;

        let equipId = wingEquip.config.m_iID;
        let lv = wingEquip.data.m_stThingProperty.m_stSpecThingProperty.m_stEquipInfo.m_stStrong.m_uiStrongProgress;
        let cfg = this.getWingStrengthCfg(equipId, lv);
        if (!cfg)
            return false;

        let nextCfg = this.getWingStrengthCfg(equipId, lv + 1);
        if (!nextCfg)
            return false;

        return G.DataMgr.thingData.getThingNum(nextCfg.m_iConsumeID, 0, false) >= nextCfg.m_iConsumeNum;
    }


    /////////////////////////////////转生装备相关////////////////////////////
    ///转生套装属性
    private grade2RebirthSuitMap: { [grade: number]: GameConfig.RebirthSuitCfgM }
    public maxRebirthSuitCount = 0;
    private setRebirthSuitCfg() {
        let cfgs = G.Cfgmgr.getCfg('data/RebirthSuitCfgM.json') as GameConfig.RebirthSuitCfgM[];
        this.maxRebirthSuitCount = cfgs.length;
        this.grade2RebirthSuitMap = {};
        for (let cfg of cfgs) {
            this.grade2RebirthSuitMap[cfg.m_iGrade] = cfg;
        }
    }

    getRebirthSuitCfg(grade: number) {
        return this.grade2RebirthSuitMap[grade];
    }


    ///转生精炼
    private partLv2RebirthRefineMap: { [part: number]: { [lv: number]: GameConfig.RebirthRefineCfgM } }
    private rebirthTimes2RefineLvMap: { [rebirthTimes: number]: number }
    private setRebirthRefineCfg() {
        let cfgs = G.Cfgmgr.getCfg('data/RebirthRefineCfgM.json') as GameConfig.RebirthRefineCfgM[];
        this.partLv2RebirthRefineMap = {};
        this.rebirthTimes2RefineLvMap = {};
        for (let cfg of cfgs) {
            if (!this.partLv2RebirthRefineMap[cfg.m_iEquipPart]) {
                this.partLv2RebirthRefineMap[cfg.m_iEquipPart] = {};
            }
            this.partLv2RebirthRefineMap[cfg.m_iEquipPart][cfg.m_iLevel] = cfg;

            if (!this.rebirthTimes2RefineLvMap[cfg.m_ucRequiredLevel]) {
                this.rebirthTimes2RefineLvMap[cfg.m_ucRequiredLevel] = cfg.m_iLevel;
            } else if (cfg.m_iLevel > this.rebirthTimes2RefineLvMap[cfg.m_ucRequiredLevel]) {
                this.rebirthTimes2RefineLvMap[cfg.m_ucRequiredLevel] = cfg.m_iLevel;
            }
        }

    }

    getRebirthRefineCfg(part: number, lv: number) {
        if (this.partLv2RebirthRefineMap[part]) {
            return this.partLv2RebirthRefineMap[part][lv];
        }
        return null;
    }

    getRebirthRefineMaxLvCanUp(rebirthTimes: number) {
        return this.rebirthTimes2RefineLvMap[rebirthTimes];
    }

    ///精炼套装属性
    private lv2RebirthRefineSuitMap: { [lv: number]: GameConfig.EquipPropAtt[] }
    private setRebirthRefineSuitCfg() {
        let cfgs = G.Cfgmgr.getCfg('data/RebirthRefineSuitCfgM.json') as GameConfig.RebirthRefineSuitCfgM[];
        this.lv2RebirthRefineSuitMap = {};
        for (let cfg of cfgs) {
            this.lv2RebirthRefineSuitMap[cfg.m_iLevel] = cfg.m_astPropAtt
        }
    }

    getRebirthRefineSuitCfg(lv: number) {
        return this.lv2RebirthRefineSuitMap[lv];
    }

    /**
     * 检查转生装备数据是否合法
     * @param data
     */
    checkHunguEquipInfo(data: Protocol.ContainerThingInfo): boolean {
        if (!data || !data.m_stThingProperty ||
            !data.m_stThingProperty.m_stSpecThingProperty ||
            !data.m_stThingProperty.m_stSpecThingProperty.m_stHunGuEquipInfo
        )
            return false
        return true;
    }

    /**转生装备精炼最大300级*/
    static readonly maxRibirthEquipRefine = 12;
    /**转生装备全身最低等级*/
    private curRebirthEquipMinLv = 0;
    private rebirthLv2Count: { [lv: number]: number };
    private updateRebirthEquipInfo() {
        this.rebirthLv2Count = {};
        for (let i = 0; i <= EquipStrengthenData.maxRibirthEquipRefine; i++) {
            this.rebirthLv2Count[i + 1] = 0;
        }

        for (let i: number = 0; i < EnumEquipRule.EQUIP_ENHANCE_COUNT; i++) {
            let lv = this.getSlotRegineLv(i);
            //大于鞋子的部位是，婚戒和精灵

            for (let j = 0; j < lv; j++) {
                this.rebirthLv2Count[j + 1] += 1;
            }
        }

        for (let i = 0; i <= EquipStrengthenData.maxRibirthEquipRefine; i++) {
            if (this.rebirthLv2Count[i + 1] != EnumEquipRule.EQUIP_ENHANCE_COUNT) {
                this.curRebirthEquipMinLv = (i + 1);
                break;
            }
        }

    }

    /**转生装备套装所在等级*/
    get rebirthSuitMinLv() {
        return this.curRebirthEquipMinLv - 1 < 0 ? 0 : this.curRebirthEquipMinLv - 1;
    }

    getRebirthSuitCountByLv(lv: number) {
        return this.rebirthLv2Count[lv];
    }

    private slotIndex2RefinelLvMap: { [index: number]: number }

    setSlotRefineLevel(info: Protocol.HunGuEquipSlotInfoList) {
        this.slotIndex2RefinelLvMap = {};
        for (let i = 0; i < info.m_usSlotNumber; i++) {
            let lv = info.m_astSlot[i].m_iSlotLv;
            this.slotIndex2RefinelLvMap[i] = lv;
        }
        this.updateRebirthEquipInfo();
    }
    updateSlotRefineLevel(index: number, lv: number) {
        this.slotIndex2RefinelLvMap[index] = lv;
        this.updateRebirthEquipInfo();
    }

    getSlotRegineLv(index: number) {
        return this.slotIndex2RefinelLvMap[index];
    }

    /////////////////转生精炼红点///////////

    oneRebirthEquipRefineShowTipMark(equip: ThingItemData) {
        if (!equip)
            return false;
        let part = equip.config.m_iEquipPart;
        let lv = this.getSlotRegineLv(part % KeyWord.HUNGU_EQUIP_PARTCLASS_MIN);
        let cfg = this.getRebirthRefineCfg(part, lv + 1);
        if (!cfg)
            return false;

        if (cfg.m_ucRequiredLevel > 0 /*G.DataMgr.rebirthData.rebirthTimes*/)
            return false;

        return G.DataMgr.thingData.getThingNum(cfg.m_iConsumableID, 0, false) >= cfg.m_iConsumableNumber;
    }

    isShowRebirthRefineTipMark(): boolean {
        let ctnSize = ThingData.All_EQUIP_NUM - 2;
        let rawDatas = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        for (let i = 0; i < ctnSize; i++) {
            if (this.oneRebirthEquipRefineShowTipMark(rawDatas[i])) {
                return true;
            }
        }
        return false;
    }


    canWearBetterRebirthEquip(): boolean {
        let rt = false;
        let thingData = G.DataMgr.thingData;
        let equipObject = thingData.getContainer(Macros.CONTAINER_TYPE_HUNGU_EQUIP);
        let allEquipInBag = thingData.getAllEquipInContainer(GameIDType.REBIRTH_EQUIP, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        let rebirthLevel = G.DataMgr.hunliData.level;
        let profession = G.DataMgr.heroData.profession;
        for (let i = 0; i < 8; i++) {
            let equipPart = KeyWord.HUNGU_EQUIP_PARTCLASS_HEAD + i;
            //穿戴，比较更好的
            if (equipObject != null && equipObject[i] != null) {
                let eo = equipObject[i];
                for (let j = allEquipInBag.length - 1; j >= 0; j--) {
                    let equip = allEquipInBag[j];
                    let equipConfig = equip.config;
                    let prof = equipConfig.m_ucProf;
                    if ((prof == 0 || (prof == profession)) && equipConfig.m_iEquipPart == equipPart && equipConfig.m_ucRebirthLevel <= rebirthLevel) {
                        if (equip.zdl > eo.zdl) {
                            rt = true;
                            break;
                        }
                    }
                }
                if (rt) break;
            }
            else {
                //没穿，找背包中有没有
                for (let j = allEquipInBag.length - 1; j >= 0; j--) {
                    let equipConfig = allEquipInBag[j].config;
                    let prof = equipConfig.m_ucProf;
                    if ((prof == 0 || (prof == profession)) && equipConfig.m_iEquipPart == equipPart && equipConfig.m_ucRebirthLevel <= rebirthLevel) {
                        rt = true;
                        break;
                    }
                }
                if (rt) break;
            }
        }
        return rt;
    }
    /**转生 剑默认装备*/
    static readonly RebirthEquipSword = [101101001, 100601001, 100701001, 100801001, 100201001, 100301001, 100401001, 100501001];
    /**转生 刀默认装备*/
    static readonly RebirthEquipKnife = [103101001, 100601001, 100701001, 100801001, 100201001, 100301001, 100401001, 100501001];









}