import { KeyWord } from "System/constants/KeyWord"
import { Macros } from 'System/protocol/Macros'
import { ThingData } from 'System/data/thing/ThingData'
import { GameIDType } from 'System/constants/GameEnum'
import { ZhufuData } from 'System/data/ZhufuData'
import { CompareUtil } from 'System/utils/CompareUtil'
import { Global as G } from 'System/global'

export class GameIDUtil {

    private static subType2CtnId: { [subType: number]: number } = {};

    private static equipPart2subType: { [equipType: number]: number } = {};

    private static funcId2subType: { [funcId: number]: number } = {};

    private static subType2FuncId: { [subType: number]: number } = {};
    private static subType2enhanceFuncId: { [subType: number]: number } = {};

    private static subType2partGroup: { [subType: number]: number } = {};

    static initStaticMaps() {
        GameIDUtil.subType2CtnId[KeyWord.HERO_SUB_TYPE_MEIREN] = Macros.CONTAINER_TYPE_HEROSUB_LINGSHOU;
        GameIDUtil.subType2CtnId[KeyWord.HERO_SUB_TYPE_YUYI] = Macros.CONTAINER_TYPE_HEROSUB_YUYI;
        GameIDUtil.subType2CtnId[KeyWord.HERO_SUB_TYPE_ZUOQI] = Macros.CONTAINER_TYPE_HEROSUB_ZUOQI;
        GameIDUtil.subType2CtnId[KeyWord.HERO_SUB_TYPE_JINGLING] = Macros.CONTAINER_TYPE_HEROSUB_JINGLING;
        GameIDUtil.subType2CtnId[KeyWord.HERO_SUB_TYPE_WUHUN] = Macros.CONTAINER_TYPE_HEROSUB_WUHUN;
        GameIDUtil.subType2CtnId[KeyWord.HERO_SUB_TYPE_FAZHEN] = Macros.CONTAINER_TYPE_HEROSUB_FAZHEN;
        GameIDUtil.subType2CtnId[KeyWord.HERO_SUB_TYPE_LEILING] = Macros.CONTAINER_TYPE_HEROSUB_LEILING;
        GameIDUtil.subType2CtnId[KeyWord.HERO_SUB_TYPE_HUOJING] = Macros.CONTAINER_TYPE_HEROSUB_HUOJING;
        GameIDUtil.subType2CtnId[KeyWord.HERO_SUB_TYPE_ZHANLING] = Macros.CONTAINER_TYPE_HEROSUB_ZHANLING;
        GameIDUtil.subType2CtnId[KeyWord.HERO_SUB_TYPE_TIANZHU] = Macros.CONTAINER_TYPE_HEROSUB_ZHANLING;

        for (let i = KeyWord.LS_EQUIP_PARTCLASS_MIN; i <= KeyWord.LS_EQUIP_PARTCLASS_MAX; i++) {
            GameIDUtil.equipPart2subType[i] = KeyWord.HERO_SUB_TYPE_MEIREN;
        }

        for (let i = KeyWord.YY_EQUIP_PARTCLASS_MIN; i <= KeyWord.YY_EQUIP_PARTCLASS_MAX; i++) {
            GameIDUtil.equipPart2subType[i] = KeyWord.HERO_SUB_TYPE_YUYI;
        }

        for (let i = KeyWord.ZQ_EQUIP_PARTCLASS_MIN; i <= KeyWord.ZQ_EQUIP_PARTCLASS_MAX; i++) {
            GameIDUtil.equipPart2subType[i] = KeyWord.HERO_SUB_TYPE_ZUOQI;
        }

        for (let i = KeyWord.FZ_EQUIP_PARTCLASS_MIN; i <= KeyWord.FZ_EQUIP_PARTCLASS_MAX; i++) {
            GameIDUtil.equipPart2subType[i] = KeyWord.HERO_SUB_TYPE_FAZHEN;
        }

        for (let i = KeyWord.JL_EQUIP_PARTCLASS_MIN; i <= KeyWord.JL_EQUIP_PARTCLASS_MAX; i++) {
            GameIDUtil.equipPart2subType[i] = KeyWord.HERO_SUB_TYPE_JINGLING;
        }

        for (let i = KeyWord.WH_EQUIP_PARTCLASS_MIN; i <= KeyWord.WH_EQUIP_PARTCLASS_MAX; i++) {
            GameIDUtil.equipPart2subType[i] = KeyWord.HERO_SUB_TYPE_WUHUN;
        }

        for (let i = KeyWord.LL_EQUIP_PARTCLASS_MIN; i <= KeyWord.LL_EQUIP_PARTCLASS_MAX; i++) {
            GameIDUtil.equipPart2subType[i] = KeyWord.HERO_SUB_TYPE_LEILING;
        }

        GameIDUtil.funcId2subType[KeyWord.OTHER_FUNCTION_ZQJH] = KeyWord.HERO_SUB_TYPE_ZUOQI;
        GameIDUtil.funcId2subType[KeyWord.ACT_FUNCTION_MRBZ] = KeyWord.HERO_SUB_TYPE_SHENGLING;
        GameIDUtil.funcId2subType[KeyWord.OTHER_FUNCTION_WHJH] = KeyWord.HERO_SUB_TYPE_WUHUN;
        GameIDUtil.funcId2subType[KeyWord.OTHER_FUNCTION_JLJH] = KeyWord.HERO_SUB_TYPE_JINGLING;
        GameIDUtil.funcId2subType[KeyWord.OTHER_FUNCTION_FZJH] = KeyWord.HERO_SUB_TYPE_FAZHEN;
        GameIDUtil.funcId2subType[KeyWord.OTHER_FUNCTION_LLJH] = KeyWord.HERO_SUB_TYPE_LEILING;
        GameIDUtil.funcId2subType[KeyWord.OTHER_FUNCTION_HJJH] = KeyWord.HERO_SUB_TYPE_HUOJING;
        GameIDUtil.funcId2subType[KeyWord.OTHER_FUNCTION_ZLJH] = KeyWord.HERO_SUB_TYPE_ZHANLING;
        GameIDUtil.funcId2subType[KeyWord.OTHER_FUNCTION_YYQH] = KeyWord.HERO_SUB_TYPE_YUYI;

        GameIDUtil.subType2FuncId[KeyWord.HERO_SUB_TYPE_ZUOQI] = KeyWord.OTHER_FUNCTION_ZQJH;
        GameIDUtil.subType2FuncId[KeyWord.HERO_SUB_TYPE_YUYI] = KeyWord.ACT_FUNCTION_MRBZ;
        GameIDUtil.subType2FuncId[KeyWord.HERO_SUB_TYPE_FAZHEN] = KeyWord.OTHER_FUNCTION_FZJH;
        GameIDUtil.subType2FuncId[KeyWord.HERO_SUB_TYPE_WUHUN] = KeyWord.OTHER_FUNCTION_WHJH;
        GameIDUtil.subType2FuncId[KeyWord.HERO_SUB_TYPE_LEILING] = KeyWord.OTHER_FUNCTION_LLJH;

        GameIDUtil.subType2enhanceFuncId[KeyWord.HERO_SUB_TYPE_MEIREN] = KeyWord.OTHER_FUNCTION_MRQH;
        GameIDUtil.subType2enhanceFuncId[KeyWord.HERO_SUB_TYPE_WUHUN] = KeyWord.OTHER_FUNCTION_WHQH;
        GameIDUtil.subType2enhanceFuncId[KeyWord.HERO_SUB_TYPE_FAZHEN] = KeyWord.OTHER_FUNCTION_FZQH;
        GameIDUtil.subType2enhanceFuncId[KeyWord.HERO_SUB_TYPE_JINGLING] = KeyWord.OTHER_FUNCTION_JLQH;
        GameIDUtil.subType2enhanceFuncId[KeyWord.HERO_SUB_TYPE_YUYI] = KeyWord.OTHER_FUNCTION_YYQH;
        GameIDUtil.subType2enhanceFuncId[KeyWord.HERO_SUB_TYPE_ZUOQI] = KeyWord.OTHER_FUNCTION_ZQQH;
        GameIDUtil.subType2enhanceFuncId[KeyWord.HERO_SUB_TYPE_LEILING] = KeyWord.OTHER_FUNCTION_LLQH;
        GameIDUtil.subType2enhanceFuncId[KeyWord.HERO_SUB_TYPE_HUOJING] = KeyWord.OTHER_FUNCTION_HJQH;
        GameIDUtil.subType2enhanceFuncId[KeyWord.HERO_SUB_TYPE_ZHANLING] = KeyWord.OTHER_FUNCTION_ZLQH;
        GameIDUtil.subType2enhanceFuncId[KeyWord.HERO_SUB_TYPE_SHENGLING] = KeyWord.OTHER_FUNCTION_SLQH;

        GameIDUtil.subType2partGroup[KeyWord.HERO_SUB_TYPE_MEIREN] = KeyWord.GROUP_LS_EQUIP_PART;
        GameIDUtil.subType2partGroup[KeyWord.HERO_SUB_TYPE_WUHUN] = KeyWord.GROUP_WH_EQUIP_PART;
        GameIDUtil.subType2partGroup[KeyWord.HERO_SUB_TYPE_FAZHEN] = KeyWord.GROUP_FZ_EQUIP_PART;
        GameIDUtil.subType2partGroup[KeyWord.HERO_SUB_TYPE_JINGLING] = KeyWord.GROUP_JL_EQUIP_PART;
        GameIDUtil.subType2partGroup[KeyWord.HERO_SUB_TYPE_YUYI] = KeyWord.GROUP_YY_EQUIP_PART;
        GameIDUtil.subType2partGroup[KeyWord.HERO_SUB_TYPE_ZUOQI] = KeyWord.GROUP_ZQ_EQUIP_PART;
        GameIDUtil.subType2partGroup[KeyWord.HERO_SUB_TYPE_LEILING] = KeyWord.GROUP_LL_EQUIP_PART;
    }

    static getHeroSubTypeByFuncID(funcId: number): number {
        return GameIDUtil.funcId2subType[funcId];
    }

    static getFuncIdBySubType(type: number): number {
        return GameIDUtil.subType2FuncId[type];
    }

    static getEnhanceFuncIdBySubType(type: number): number {
        return GameIDUtil.subType2enhanceFuncId[type];
    }

    static getEquipPartGroupBySubType(type: number): number {
        return GameIDUtil.subType2partGroup[type];
    }

    /**
     *  通过子系统类型取得对应的容器
     * @param type
     *
     */
    static getContainerIDBySubtype(type: number): number {
        return GameIDUtil.subType2CtnId[type];
    }

    static getSubTypeByEquip(equipPart: number): number {
        return GameIDUtil.equipPart2subType[equipPart];
    }

    static getContainerIDByEquipPart(equipPart: number): number {
        if (equipPart >= KeyWord.HUNGU_EQUIP_PARTCLASS_MIN && equipPart <= KeyWord.HUNGU_EQUIP_PARTCLASS_MAX) {
            return Macros.CONTAINER_TYPE_HUNGU_EQUIP;
        }

        if (equipPart >= KeyWord.BEAUTY_EQUIP_PARTCLASS_MIN && equipPart <= KeyWord.BEAUTY_EQUIP_PARTCLASS_MAX) {
            return Macros.CONTAINER_TYPE_BEAUTY_EQUIP;
        }

        let subType = GameIDUtil.getSubTypeByEquip(equipPart);
        return GameIDUtil.getContainerIDBySubtype(subType);
    }

    /**
	* 是否被动技能效果ID。
	* @param id 
	*
	*/
    static isPassiveSkillEffect(id: number): boolean {
        return id >= KeyWord.SKILL_EFFECT_PASSIVE_BASEID && id < KeyWord.SKILL_EFFECT_PASSIVE_MAXID;
    }

    static isDropID(id: number): boolean {
        return (id >= KeyWord.DROP_CONFIG_BASE_ID && id < KeyWord.DROP_CONFIG_MAX_ID);
    }

    /**
     * 是否npcID
     * @param id 
     *
     */
    static isNPCID(id: number): boolean {
        return (id >= KeyWord.NPC_CONFIG_BASE_ID && id < KeyWord.NPC_CONFIG_MAX_ID);
    }

    /**
     * 判断是否可以放入背包的物品，包括道具、装备、时装和晶核。
     * @param id 要检查的ID。: number 如果该ID对应可以放入背包的物品
     *
     */
    static isBagThingID(id: number): boolean {
        return GameIDUtil.isThingID(id)
            || GameIDUtil.isEquipmentID(id)
            || GameIDUtil.isAvatarID(id)
            || GameIDUtil.isDiamondID(id);
    }

    static isThingID(id: number): boolean {
        return (id >= KeyWord.ITEM_CONFIG_BASE_ID && id <= KeyWord.ITEM_CONFIG_MAX_ID);
    }

    static isMonsterID(id: number): boolean {
        return (id >= KeyWord.MONSTER_CONFIG_BASE_ID && id <= KeyWord.MONSTER_CONFIG_MAX_ID);
    }

    /**
     * 判断当前id是不是技能ID
     * @param id 
     *
     */
    static isSkillID(id: number): boolean {
        return (id >= KeyWord.SKILL_CONFIG_BASE_ID && id <= KeyWord.SKILL_CONFIG_MAX_ID);
    }

    /**
     * 判断当前id是不是技能ID
     * @param id 
     *
     */
    static isBuffID(id: number): boolean {
        return (id >= KeyWord.BUFF_CONFIG_BASE_ID && id <= KeyWord.BUFF_CONFIG_MAX_ID);
    }

    /**
     * 判断当前id是不是时装的ID范围
     * @param id 
     *
     */
    static isAvatarID(id: number): boolean {
        return (id >= KeyWord.AVATAR_CONFIG_BASE_ID && id <= KeyWord.AVATAR_CONFIG_MAX_ID);
    }

    /**
     * 判断当前id是不是装备的ID范围
     * @param id 
     *
     */
    static isEquipmentID(id: number): boolean {
        return GameIDUtil.isRoleEquipID(id) || GameIDUtil.isOtherEquipID(id) || GameIDUtil.isPetEquipID(id) || GameIDUtil.isHunguEquipID(id);
    }

    /**
     * 是否是角色装备
     * @param id 
     *
     */
    static isRoleEquipID(id: number): boolean {
        return (id >= KeyWord.EQUIP_CONFIG_BASE_ID && id <= KeyWord.EQUIP_CONFIG_MAX_ID);
    }

    /**
     * 是否是转生装备
     * @param id
     */
    static isHunguEquipID(id: number): boolean {
        return (id >= KeyWord.REBIRTH_EQUIP_CONFIG_BASE_ID && id <= KeyWord.REBIRTH_EQUIP_CONFIG_MAX_ID);
    }

    /**
     * 是否是祝福系统的装备
     * @param id 
     *
     */
    static isOtherEquipID(id: number): boolean {
        return (id >= KeyWord.ZHUFU_EQUIP_CONFIG_BASE_ID && id <= KeyWord.ZHUFU_EQUIP_CONFIG_MAX_ID);
    }

    /**
     * 是否是伙伴装备
     * @param id 
     *
     */
    static isPetEquipID(id: number): boolean {
        return (id >= KeyWord.BEAUTY_EQUIP_CONFIG_BASE_ID && id <= KeyWord.BEAUTY_EQUIP_CONFIG_MAX_ID);
    }


    /**
     * 判断当前是否是钻石，包括非绑定钻石和绑定钻石。
     * @param id 
     *
     */
    static isYuanbaoID(id: number): boolean {
        return GameIDUtil.isYuanbaoNonBindID(id) || GameIDUtil.isYuanbaoBindID(id);
    }

    /**
     * 判断当前是否是非绑定钻石。
     * @param id 
     *
     */
    static isYuanbaoNonBindID(id: number): boolean {
        return KeyWord.MONEY_YUANBAO_ID == id;
    }

    /**
     * 判断当前是否绑定钻石。
     * @param id 
     *
     */
    static isYuanbaoBindID(id: number): boolean {
        return KeyWord.MONEY_YUANBAO_BIND_ID == id;
    }

    /**
     * 是否战勋。: number
     *
     */
    static isPvpExploitID(id: number): boolean {
        return KeyWord.PVP_EXPLOIT_ID == id;
    }

    /**
     *  判断当前是否是经验
     * @param id 
     *
     */
    static isExperience(id: number): boolean {
        if (id == KeyWord.EXPERIENCE_THING_ID || id == KeyWord.EXPERIENCE_LEVEL_THING_ID) {
            return true;
        }

        return false;
    }

    /**
     * 判断指定ID是否是宝镜积分。
     * @param id 
     *
     */
    static isSkyBonusID(id: number): boolean {
        if (KeyWord.SKY_BONUS_ID == id) {
            return true;
        }

        return false;
    }
    /** 是不是百服庆典ID */
    static isBfqdBonusID(id: number): boolean {
        return KeyWord.BFQD_THING_ID == id;
    }
    /** 是不是百服庆典ID */
    static isJiuXingBonusID(id: number): boolean {
        return KeyWord.XINGHUN_THING_ID == id;
    }
    /**
     * 判断是不是贡献度id
     * @param id 
     *
     */
    static isContributionID(id: number): boolean {
        if (id == KeyWord.GUILD_CONTRIBUTE_ID) {
            return true;
        }

        return false;
    }

    /**
     * 判断当前id是不是晶核的ID范围
     * @param id 
     *
     */
    static isDiamondID(id: number): boolean {
        return (id >= KeyWord.DIAMOND_CONFIG_BASE_ID && id <= KeyWord.DIAMOND_CONFIG_MAX_ID);
    }

    static getEquipIDType(id: number): GameIDType {
        if (GameIDUtil.isRoleEquipID(id)) {
            return GameIDType.ROLE_EQUIP;
        }
        if (GameIDUtil.isPetEquipID(id)) {
            return GameIDType.PET_EQUIP;
        }
        if (GameIDUtil.isHunguEquipID(id)) {
            return GameIDType.REBIRTH_EQUIP;
        }
        if (GameIDUtil.isOtherEquipID(id)) {
            return GameIDType.OTHER_EQUIP;
        }
        return GameIDType.INVALID;
    }

    /**
     * 判断id是不是特殊物品的ID
     * @param id 
     *
     */
    static isSpecialID(id: number): boolean {
        return id >= KeyWord.SPECIAL_ITEM_BASE && id <= KeyWord.SPECIAL_ITEM_MAX;
    }

    /**
     *判断是否是副本
     * @param pid 副本id: number
     *
     */
    static isPinstanceID(id: number): boolean {
        return (id >= KeyWord.PINSTANCE_CONFIG_BASE_ID && id <= KeyWord.PINSTANCE_CONFIG_MAX_ID);
    }

    static isQuestID(id: number): boolean {
        return (id >= KeyWord.QUEST_CONFIG_BASE_ID && id <= KeyWord.QUEST_CONFIG_MAX_ID);
    }

    /**是否是猎魂ID*/
    static isLhID(id: number): boolean {
        return (id >= KeyWord.LIEHUN_CONFIG_BASE_ID && id <= KeyWord.LIEHUN_CONFIG_MAX_ID);
    }

    /**
     * 是否为人（机器人）
     * @param roleId
     * @param isMatchRobert  机器人是否算在范围里: number 
     * 
     */
    static isRoidIsPeople(roleId: Protocol.RoleID, isMatchRobert: boolean = true): boolean {
        if (isMatchRobert) {
            return roleId && roleId.m_uiSeq > 0 || roleId.m_uiUin > 0;
        }
        return roleId && roleId.m_uiSeq > 0 && roleId.m_uiUin > 0;
    }

    /**获取显示货币金额*/
    static getShowMoney(val: number, moneyId: number = 0): number {
        if (moneyId == KeyWord.RMB_THING_ID) {
            val = val / 10;
        }
        return val;
    }

    /**获取装备阶级*/
    static getEquipStageById(id: number): number {
        let equipConfig = ThingData.getThingConfig(id);
        if (!equipConfig) {
            return 0;
        }
        if (GameIDUtil.isOtherEquipID(id)) {
            let type: number = GameIDUtil.getSubTypeByEquip(equipConfig.m_iEquipPart);
            return ZhufuData.getZhufuStage(equipConfig.m_ucRequiredLevel, type);
        }

        if (GameIDUtil.isPetEquipID(id)) {
            //如果是伙伴就除以10，向上取整。
            return Math.ceil(equipConfig.m_ucRequiredLevel / 10);
        }
        if (GameIDUtil.isHunguEquipID(id)) {
            return equipConfig.m_iDropLevel;
        }
        //如果是其他装备。
        return equipConfig.m_ucRequiredLevel;
    }

    static isBingThingByContainerInfo(id: number, thingInfo: Protocol.ContainerThingInfo): boolean {
        let thingProp: Protocol.ThingProperty;
        if (null != thingInfo) {
            thingProp = thingInfo.m_stThingProperty;
        }
        return GameIDUtil.isBindingThing(id, thingProp);
    }

    /**
    * 判断物品是否为绑定
    * @param	id
    * @return
    */
    static isBindingThing(id: number, thingProp: Protocol.ThingProperty = null): boolean {
        if (null != thingProp) {
            return KeyWord.BIND_STATUS_BINDED == thingProp.m_ucBindStatus;
        }
        let itemConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(id);
        return KeyWord.BIND_TYPE_PICK == itemConfig.m_ucBindType;
    }

    /**是否是自己*/
    public static isSelf(roleId: Protocol.RoleID): boolean {
        return CompareUtil.isRoleIDEqual(roleId, G.DataMgr.heroData.roleID)
    }

    /**获取伙伴装备阶级*/
    public static petEquipStage(equipId: number): number {
        let equipConfig: GameConfig.EquipConfigM = ThingData.getThingConfig(equipId);
        return Math.floor(equipConfig.m_ucRequiredLevel / 10) + 1;
    }

    /**
     * 装备id升过一位，为兼容后台遗漏处理，此接口用于新老id的转换
     * @param iThingID
     */
    public static getNewEquipId(iThingID: number): number {
        if (iThingID >= 20000001 && iThingID <= 29999999) {
            // 2101 2 231 的装备ID升级后变为 2101 02 231 
            // 2101 2231 ->21010 2231
            return Math.floor(iThingID / 10000) * 100000 + (iThingID % 10000);
        }
        return iThingID;
    }

}