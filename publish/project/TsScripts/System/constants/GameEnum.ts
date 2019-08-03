export enum EnumLoginStatus {
    none,
    logined,
    kickedOut,
    disconnected,
}

export enum EnumNetError {
    connectError = 100,
    disconnected = 200,
    kickOut = 300,
    autoReconnectError = 400,
    listRoleError = 500,
    loginTimeout = 600,
}

export enum EnumCrossErrorCode {
    tcpFailed = -1000,
    loginTimeout = -2000,
    ipNone = -3000,
}

export enum EnumProductID {
    GoldPrivilege = 88012,
    DiamondPrivilege = 88011,
}

export enum EnumLoadUrl {
    ServerListTimeOut = 20,
    GetUinTimeOut = 20,
    GetOrderIdTimeOut = 20,
    ServerListTryTimes = 3,
    GetUinTryTimes = 3,
    GetOrderIdTryTimes = 3,
    NotifyPayTimeout = 20,
    NotifyPayTryTimes = 3,
}

export enum EnumActivateState {
    none = 0,
    activated,
    canActivate,
    cannotActivate,
}

export enum EnumMonsterRule {
    none = 0,
    /**仅指定id的怪物*/
    onlySpecified,
    /**指定id的怪物优先*/
    specifiedFirst,
}

export enum EnumAutoUse {
    none = 0,
    /**正常使用物品*/
    NormalUse,
    /**地宫密钥*/
    DiGongMiYao,
}

export enum EnumTargetValidation {
    ok = 0,
    /**无目标*/
    noTarget,
    /**非法目标，比如npc等无法攻击的目标*/
    invalidTarget,
    /**非目标标的，比如非任务指定标的*/
    notTarget,
    /**目标已死亡*/
    deadTarget,
    /**黑名单中*/
    blackNameList,
    /**安全区中*/
    safty,
}

export enum EnumGuildStoreFilterRule {
    all = 0,
    equipLvMin = 5,
    equipLvMax = 19,
    allEquip = 99,
}

export enum EnumChoice {
    undefined = 0,
    yes = 1,
    no,
}

export enum EnumBloodType {
    green = 1,
    red,
}

export enum EnumKuafuPvpStatus {
    none = 0,
    queue,
    start,
    notify,
}


export enum ActivityPlan {
    /**计划A*/
    PlanA = 0,
    /**计划B*/
    PlanB = 1,
    /**其他*/
    Other = -1,
}
export enum EnumDir2D {
    RIGHT_DOWN = 1,
    RIGHT = 2,
    UP_RIGHT = 3,
    UP = 4,
    LEFT_UP = 5,
    LEFT = 6,
    DOWN_LEFT = 7,
    DOWN = 8,
}

export enum EnumPetId {
    ALi = 40000012,
}

export enum EnumDurationType {
    /**在指定的时间段前面。*/
    Before = 1,
    /**在指定的时间段之间。*/
    InDuration,
    /**在指定的时间段后面。*/
    After,
}

export enum TeleportId {
    /**新手玩家出场跳跃起点*/
    freshMemTp0 = 301,
    freshMemTp1 = 302,
    freshMemTp2 = 304,
}

export enum EnumKfhdBossType {
    world = 1,
    fengMoTa = 2,
    diGong = 3,
}

export enum EnumKfhdBossStatus {
    noReached = 0,
    reached = 1,
    hasGot = 2,
}

export enum EnumEffectRule {
    /**禁用特效*/
    none = 0,
    /**蓝紫橙红金粉*/
    normal,
    /**在normal的基础上，加上仅可以领取奖励的限制*/
    reward,
}

export enum EnumImageID {
    /**雷云豹*/
    LeiYunBao = 11111,

    /**紫耀天星*/
    ZiYaoTianXing = 13113,
}

export enum MenuNodeKey {
    /////////////////////////////////////// 陨石 ///////////////////////////////////////

    /**升级猎魂。*/
    CRYSTAL_UPGRADE = 1,

    /**装备猎魂。*/
    CRYSTAL_EQUIP = 2,

    /**锁定猎魂。*/
    CRYSTAL_LOCK = 3,

    /**解锁猎魂。*/
    CRYSTAL_UNLOCK = 4,

    /**卸下猎魂。*/
    CRYSTAL_OFF = 5,

    /**分解猎魂。*/
    CRYSTAL_DECOMPOSE = 6,

    /////////////////////////////////////// 背包 ///////////////////////////////////////

    /**背包出售。*/
    BAG_SELL = 11,

    /**背包展示。*/
    BAG_SHOW = 12,

    /**背包使用。*/
    BAG_USE = 13,

    /**背包批量使用。*/
    BAG_BAT_USE = 14,

    /**背包交易所。*/
    BAG_AUCTION = 15,

    /////////////////////////////////////好友//////////////////////////////////////////
    /**查看信息*/
    ROLE_INFO = 16,

    /**私聊*/
    ROLE_TALK = 17,

    /**组队*/
    ROLE_TEAM = 18,

    /**拉黑*/
    ROLE_BLACK = 19,

    /**移除名单*/
    ROLE_DELECT = 20,

    /**复制名字*/
    ROLE_COPYNAME = 21,

    /**查看位置*/
    ROLE_POSITION = 22,

    /**添加好友*/
    ROLE_ADD_FRIEND = 23,

    /**添加仇人*/
    ROLE_ADD_ENEMY = 24,

    /**设置副宗主*/
    GUILD_SET_VICE = 25,

    /**撤销副宗主*/
    GUILD_REVOKE_VICE = 26,

    /**踢出帮派*/
    GUILD_KICK = 27,

    /**国家解除职务*/
    COUNTRY_REVOKE = 28,

    /**离队*/
    TEAM_LEAVE = 29,

    /**踢人*/
    TEAM_KICK = 30,

    /**设为队长*/
    TEAM_CAPTAIN = 31,

    /**装备卸下*/
    TAKE_OFF = 32,

    /**装备强化*/
    EQUIP_EHANCE = 33,

    /**宗门仓库申请*/
    GUILD_APPLY = 34,
    /**宗门仓库兑换*/
    GUILD_GET = 35,
    /**宗门仓库分配*/
    GUILD_ALLOT = 36,

    /**赠送鲜花*/
    ROLE_FLOWER = 37,
    /**宗门仓库捐献*/
    GUILD_DONATE = 38,

    /**装备交换*/
    EQUIP_CHANGE = 39,
    /**宗门仓库销毁物品*/
    GUILD_DISPOSE = 40,

    /**熔炼*/
    BAG_RONGLIAN = 41,

    /**猎魂分解*/
    LH_DECOMPOSE = 42,
    /**猎魂升级*/
    LH_LEVELUP = 43,
    /**猎魂锁定*/
    LH_LOCK = 44,
    /**猎魂解锁*/
    LH_UNLOCK = 45,

    /**猎魂装备*/
    LH_EQUIP = 46,
}

/**活动显示类型*/
export enum ActivityShowType {
    /** 周几的活动 */
    DAY = 1,
    /** 开服前几天活动,周几开启 */
    OPEN_SEVER = 2,
    /** 开服第几天开启 */
    END_SEVER = 3,
    /** 开服后第几天 周几开启*/
    START_SEVER = 4,
    /** 开服后第几天一定开启*/
    SELECT_SEVER = 5,
    /** 运营活动 */
    YUN_YING = 6,
}

export enum EnumActState {
    /**正在运行中*/
    RUNNING = 0,
    /**将要运行，未运行*/
    GOTORUN = 1,
    /**已经运行过了*/
    HAVERAN = 2,
}

export enum FuncBtnState {
    /**正常可用状态*/
    Normal = 0,

    /**闪烁状态*/
    Shining,

    /**不可见状态*/
    Invisible,
}

export enum EnumBuyAutoUse {
    /**自动使用该道具，相当于购买之后自动双击使用。*/
    USE_ITEM = 1,

    /**自动在宗门中使用穿云箭。*/
    USE_CYJ = 2,

    /**使用千里传音符。*/
    USE_QLCYF = 4,

    /**使用合成卷轴。*/
    USE_FORMULAR = 5,
}

/**
* Buff枚举类。
*
* @author teppei
*
*/
export enum EnumBuff {
    /**旋风斩（1级）。*/
    XUANFENGZHAN = 51002401,

    /**泡温泉*/
    BATH_BUFF = 51004601,

    /**虚空免战*/
    XK_NOWAR_BUFF = 51073701,

    /**搬运buff*/
    CARRY_BUFF = 51005201,

    /**石化buff*/
    STONE_BUFF = 51003101,

    /**旗子buff*/
    QIZI_BUFF = 51024001,

    /**西洋棋-加速*/
    ZLQJ_JIASU = 51024101,

    /**boss归属者*/
    BossOwnner = 51028901,
}

export enum TipType {
    /** 普通文字描述Tip*/
    TEXT_TIP = 1,

    /**消耗品，任务物品Tip*/
    ITEM_TIP = 2,

    /** 技能Tip*/
    SKILL_TIP = 3,

    /** 日常任务Tip*/
    QUEST_TIP = 5,

    /** BuffTip*/
    BUFF_TIP = 6,

    /** 聚源系统 */
    JU_YUAN = 7,

    /** 聚源系统等级 */
    JU_YUAN_LEVEL = 8,

    /**伙伴装备*/
    PET_EQUIP_TIP = 11,

    /** 时装  */
    DRESS_TIP = 15,

    /** 聚源系统升级条件 */
    JU_YUAN_LEVEL_CONDITION = 16,

    /**3D模型tip*/
    MODEL_TIP = 17,

    /** 精灵 */
    LING_BAO = 18,

    /** 规则说明 */
    RULE_TIP = 19,

    /** 伙伴特权浮窗 */
    VIP_CARD_PET_TIP = 20,

    /** 猎魂魂珠浮窗 */
    LH_TIP = 21,
}

/**
* <TIP所在背包类型>枚举类。
*/
export enum EnumTipBagType {
    /**<通用类型>。*/
    COMMON_TYPE = 0,
    /**<背包类型>。*/
    BAG_TYPE = 1,
    /**<宗门仓库类型>。*/
    GUILD_DEPOT_TYPE = 2,
    /**伙伴装备*/
    PET_EQUIP = 3,
}

/**
* 商店ID枚举类，参考Stars.NPC.Sell.xls。
* @author xiaojialin
*
*/
export enum EnumStoreID {
    /**钻石商城。*/
    MALL_YUANBAO = 1000,
    /**绑定钻石商城。*/
    MALL_YUANBAOBIND = 1001,
    /**荣誉商城。*/
    MALL_HONNOR = 1002,
    /**声望商城。*/
    MALL_REPUTATION = 1003,
    /**功勋商城。*/
    MALL_PVP_EXPLOIT = 1004,
    /**幻化商城*/
    MALL_HUANHUA = 1005,
    /**神秘商店*/
    MYSTICAL_STORE = 1006,
    /**VIP商城*/
    MALL_VIP = 1007,
    /**商店ID为兑换商城。*/
    EXCHANGE_STORE = 1090,
    /**商店ID为历练商人。*/
    ENERGY_SELLER = 100123,
    /**商店ID为宗门商城。*/
    GUILD_STORE = 1010,
    /**商店id为仙灵之店（国家战勋商店）*/
    XIANLINGZHIDIAN = 1086,
    /**商店id为仙蕴宝藏（国家钻石商店）*/
    XIANYUNBAOZANG = 1085,
    /**天宫宝镜商城。*/
    TGBJSHOP = 1070,
    /**灵狐仙府。*/
    LINGHUXIANFU = 1087,
    /**用于自动购买的商城*/
    AUTOBUY = 1041,
    /**限时抢购。*/
    XIANSHIQIANGGOU = 1042,
    /**随身商店。*/
    SUISHEN = 1060,
    /**7天折扣商店，真正的商店代码要用这个加上开服天数除7的余数*/
    QTZK = 1100,
    /**充值反馈积分商城*/
    CZFK = 1200,
    /**跨服角斗场积分商店。*/
    KFJDCJF = 1010,
    /**宗门团队副本商店。*/
    ZPTDFB = 1300,
    /**神秘商店1（仙元）*/
    SM_STORE_1 = 1250,
    /**神秘商店2（神源）*/
    SM_STORE_2 = 1251,
    /**神秘商店3（战勋）*/
    SM_STORE_3 = 1252,
    /**副本商店*/
    DUNGEON = 1020,
    /**特惠礼包*/
    TEHUILIBAO_DAY_1 = 1021,
    TEHUILIBAO_DAY_2 = 1072,
    TEHUILIBAO_DAY_3 = 1073,
    TEHUILIBAO_DAY_4 = 1074,
    TEHUILIBAO_DAY_5 = 1075,
    TEHUILIBAO_DAY_6 = 1076,
    TEHUILIBAO_DAY_7 = 1077,
    /**魔帝宝库兑换商店ID*/
    MDBK_ID = 1022,
    /** 转盘兑换 */
    ZPDH_ID = 1023,
    /** 百服庆典兑换ID*/
    BFQD_ID = 1024,
    /**神魂商店*/
    SHSX_ID = 1009,
    /**战魂商店*/
    ZhanHun = 1028,
    /**伙伴碎片*/
    WuYuanSuiPian = 1108,
    /**限时特卖*/
    XianShiTeMai = 1109,
    /**特卖商店*/
    Mall_TeMai = 1030,
    /**斗兽币商店*/
    SiXiangBi = 1029,
    /**五折商店*/
    WuZhe = 1080,
    /**五折商店2*/
    WuZheII = 1081,
    /**历练商店*/
    LiLian = 1088,
    /**远征商店*/
    YuanZheng = 1089,
    /**回购商店 */
    HuiGou = 1091,
    /**名将商店*/
    MingJiang = 1025,
    /**婚姻商城*/
    Marry = 1042,
    /**盛典宝箱*/
    Ceremony = 1043,
    /**兑换神圣装备箱子商城*/
    STORE_REBORN = 1044,
}


export enum UnitCtrlType {
    /**未定义*/
    none = 0,
    /**主角*/
    hero = 1,
    /**其他玩家*/
    role = 2,
    /**怪物*/
    monster = 3,
    /**npc*/
    npc = 4,
    /**掉落物*/
    dropThing = 5,
    /**采集物*/
    collection = 6,
    /**美人*/
    pet = 7,
    /**精灵*/
    lingbao = 8,
    /**宝物*/
    faqi = 9,
    /**国运美人*/
    guoyunGoods = 10,
    /**翅膀*/
    wing = 11,
    /**坐骑*/
    ride = 12,
    /**神器*/
    weapon = 13,
    /**圣印*/
    zhenfa = 14,
    /**称号*/
    chenghao = 15,
    /**宝物*/
    shengqi = 16,
    /**凤凰*/
    fenghuang = 17,
    /**暗器*/
    anqi = 18,
    /**buff*/
    buff,
    /**其他*/
    other,
    /**真迹*/
    shenji,
    /**BOSS*/
    boss,
    /**圣灵*/
    shengling,
    /**守护神-宝宝形态*/
    shieldGod,
    /**转生脚底*/
    hunhuan,
    reactive,
    /**伙伴技能立绘*/
    petskillUIEffect,
    /**暗器技能立绘*/
    anqiskillUIEffect,
    /**武魂，即环绕在主角的龙和剑鞘*/
    wuhun,
}

export enum HideType {
    ALL = -1,
    TITLE = 0,
    WING = 1,
    PETS = 2,
    FRIEND_ROLE = 3,
    ENEMY_ROLE = 4,
    SKILL_EFFECT = 5,
    SCENE_EFFECT = 6,
    MONSTER = 7,
}

export enum RegionType {
    Circle = 1,
    Rectangle = 2
}

/**
* 场景id枚举，温泉请使用Macros.BATHE_SCENE_ID
* @author teppei
*
*/
export enum SceneID {
    /** 剧情地图 */
    STORY = 201,

    /**江南豪门。*/
    JIANGNANHAOMEN = 1,

    /**重华城 主城。*/
    CHONGHUACHENG = 3,

    /**千瀑川。*/
    QIANPUCHUAN = 7,

    /**海中桃源。*/
    HAIZHONGTAOYUAN = 9,

    /**大漩涡。*/
    DAXUANWO = 8,

    /**深海龙宫。*/
    SHENHAILONGGONG = 10,

    /**福神争霸*/
    FU_SHEN_ZHENG_BA = 240,

    /**准备区。*/
    ZHUNBEIQU = 19,

    /**边境的场景ID。*/
    BIANJING = 174,

    /**答题副本*/
    DATI = 181,

    /**宗门争霸战场景*/
    ZPQYH = 104,

    /**阵营战*/
    ZYZ = 103,

    /**元神战场*/
    YSZC = 236,

    /**人民币战场地图ID*/
    RMB_ZHAN_CHANG = 221,

    DiGongBossMin = 224,
    DiGongBossMax = 235,
}

export enum QuestAction {
    accept = 1,
    abandon = 3,
    complete = 5,
}

export enum QuestID {
    /**国家频道聊天支线任务*/
    countryChat = 1003016,
    level62 = 1001129,
    level75 = 1001163,
    weiduan = 1003013,
}

/**
* 任务状态的枚举。
* @author teppei
*
*/
export enum EnumQuestState {
    Unacceptable = 1,

    Acceptable = 2,

    Doing = 3,

    Completing = 4,

    Completed = 5,

    Canceled = 6,

    /**可领取额外奖励（门派任务用）。*/
    ExtraReward = 7,
}

export enum NPCQuestState {
    /**没有任何任务*/
    noQuest = 0,
    /**有任务完成*/
    complete = 1,
    /**有任务可接*/
    receive = 2,
    /**有任务正在做*/
    doing = 3,
    /**有任务但是有等级限制*/
    limit = 4,
}

export enum TransportType {
    none = 0,
    jump,
    transport,
}

export enum PathingState {
    CANNOT_REACH = 0,  // 无法到达
    CAN_REACH = 1,  // 可以通过寻路到达
    REACHED = 2,  // 已经到达
    BUSY = 3,  // 繁忙状态不可移动
}

export enum PositionState {
    VALID = 0,  // 目标点合法
    BLOCKED = 1,  // 与目标点之间存在阻挡
    VALID_DIS_BUT_INVALID_ANGLE = 2,  // 在施法距离内，但角度非法
    OUT_OF_DIS = 3,  // 超出施法距离
}

export enum FindPosStrategy {
    /**指定坐标，不做任何变动*/
    Specified = 0,
    /**若指定坐标不合法，则尝试寻找周边一个合法的坐标*/
    MakeSureValid,
    /**每次都寻找周边一个适合攻击的坐标*/
    FindSuitableAround,
}

export enum HeroGotoType {
    NONE = 1,  // 无特定类型
    PICK_MONSTER = 2,  // 采集
    ATTACK = 3,  // 攻击
    GET_SINGLE_DROP = 4, // 拾取单个掉落物
    GET_MULTI_DROP = 5,  // 拾取多个掉落物
    ATTACK_AND_HANGUP = 6,  // 攻击并自动战斗
}

/**
* 通知区域
*/
export enum EnumInformType {
    /**私聊*/
    PRIVATE_CHAT = 0,

    /**vip*/
    VIP = 1,

    /**活跃度*/
    LIVENESS = 2,

    /**邮件*/
    EMAIL = 3,

    /**vip月卡*/
    VIP_MONTH = 4,

    /**神力榜*/
    pPkRankVal = 5,

    /**聊天*/
    CHAT = 6,

    /**神凰秘境有终生奖励可领取*/
    SHOU_HU_NV_SHEN_CAN_GET_REWARD = 7,

    /** 精灵过期 */
    LING_BAO_OVER = 8,

    /** 金卡 */
    VIP_CARD = 9,
    /** 红包 */
    REDBAG = 10,

    BAOJUAN = 11,
    /** VIP特权 */
    VIP_PANEL = 12,
}

/**
* 任务超链接、按钮类型。
* @author teppei
*
*/
export enum EnumQuestLinkType {
    /**寻路到指定NPC超链接。*/
    NPC_LINK = 1,

    /**寻路到目标位置超链接。*/
    TARGET_LINK = 2,

    /**打开任务对话框超链接。*/
    QUESTTITLE_LINK = 3,

    /**做任务超链接。*/
    DOQUEST = 5,

    /**打开支线任务领奖的对话框。*/
    OPEN_QUEST_DIALOG = 6,

    /**打开任务树按钮。*/
    OPENTREE = 10,

    /**传送到NPC按钮。*/
    TRANSPORT2NPC = 11,

    /**传送到目标位置按钮。*/
    TRANSPORT2TARGET = 12,

    /**副本追踪*/
    PINSTANCE_LINK = 13,

    /**	立刻完成每日任务 */
    DAY_QUESTPANEL_QUICK_ONEKEY_COMPLETE = 14,

    /**飞到黑洞塔*/
    FMT = 15,

    /**活动大厅*/
    ACTIVE_DIALOG = 16,

    /**伙伴面板*/
    PET_DIALOG = 17,

    /**每日必做*/
    MRBZ = 18,

    /**首充*/
    SC = 19,

    /**祈福*/
    QF = 20,

    /**领取宝卷*/
    LQBJ = 21,

    /**宝卷任务*/
    BJRW = 22,
}

export enum EnumDoQuestFor {
    normal = 0,
    progressReach,
    manually,
}

export enum EnumRewardState {
    /**已领取(灰态)*/
    HasGot = 0,

    /**未领取(常态)*/
    NotGot = 1,

    /**未到达*/
    NotReach = 2,
}
/**
* 物品ID枚举类。
*
* @author teppei
*
*/
export enum EnumThingID {
    /**千里传音符。*/
    QLCYF = 10064010,

    /**普通经验丹（绑定）。*/
    PTJYD = 10011011,

    /**高级经验丹（绑定）。*/
    GJJYD = 10011021,

    /**超级经验丹（绑定）。*/
    CJJYD = 10011031,

    /**vip体验卡*/
    TRIAL_VIP = 10018011,

    /**洗炼石。*/
    XILIANSHI = 220034,

    /**锻造锁*/
    XILIANSUO = 10321021,

    /**锻造神石*/
    FUHUNSHENSHI = 10321030,

    /**天降福神宝箱。*/
    TJFSBX = 10079011,

    /**经验卡20w*/
    EXP_20W = 10808031,

    /**经验卡100w*/
    EXP_50W = 10808041,

    /**装备强化石*/
    ZBQHS = 10002011,

    /**生命补充包。*/
    ShengMingBuChongBao = 10080011,

    /**伙伴成长石*/
    WYJJS = 10218011,

    /**脱机外挂卡 */
    TJWGK = 10410021,

    /**一元大礼包*/
    YiYuanDaLiBao = 10274011,

    /**地宫密钥*/
    DiGongMiYao = 10401011,

    /**需要再充值的物品id*/
    SecondChargeItem1 = 10274021,

    /**再充值后可使用的物品id*/
    SecondChargeItem2 = 10274031,

    /**一元夺宝卷*/
    YiYuanDuoBaoQuan = 10405011,

    /**伙伴通用碎片*/
    WuYuanSuiPian = 10224011,

    /**世界boss奖励劵(非绑)*/
    WorldBossReward = 10554010,

    /**世界boss奖励劵(绑定)*/
    WorldBossRewardBin = 10554011,

}

export enum GameIDType {
    INVALID = 0,    // 无效ID
    ITEM = 1,    // 道具
    ROLE_EQUIP = 2,    // 装备
    OTHER_EQUIP = 3,	   //其他所有装备
    SKILL = 4,    // 技能
    SPECIAL_THING = 5,    // 特殊物品(经验/金钱/声明/法力/历练等)
    PET_EQUIP = 6,              // 散仙
    DIAMOND = 7,              // 晶核
    MONSTER = 8,    // 怪物
    AVATAR = 9,    // 时装
    PINSTANCE = 10,    // 副本
    NPC = 11,    // npc
    QUEST = 12,    // 任务
    SCENE = 13,    // 场景
    DROP = 14,  // 掉落
    /**Buff。*/
    BUFF = 16,
    /**猎魂类型*/
    LH = 17,
    REBIRTH_EQUIP = 18,    // 转生装备

}


export enum EnumSceneID {
    /**江南豪门。*/
    JIANGNANHAOMEN = 1,

    /**重华城 主城。*/
    CHONGHUACHENG = 3,

    /**千瀑川。*/
    QIANPUCHUAN = 7,

    /**海中桃源。*/
    HAIZHONGTAOYUAN = 9,

    /**大漩涡。*/
    DAXUANWO = 8,

    /**深海龙宫。*/
    SHENHAILONGGONG = 10,

    /**福神争霸*/
    FU_SHEN_ZHENG_BA = 240,

    /**温泉场景。*/
    WENQUAN = 18,
    /**准备区。*/
    ZHUNBEIQU = 19,

    /**边境的场景ID。*/
    BIANJING = 174,

    /**答题副本 */
    DATI = 181,

    /**虚空战场一层。*/
    XKZC_F1 = 185,

    /**虚空战场二层。*/
    XKZC_F2 = 186,

    /**虚空战场三层。*/
    XKZC_F3 = 187,

    /**宗门争霸战场景*/
    ZPQYH = 104,

    /**阵营战 */
    ZYZ = 103,

    /**元神战场 */
    YSZC = 236
}

/**活跃度Tab*/
export enum EnumHydTab {
    Pinstance = 1,
    Activity = 2,
    BOSS = 3,
    FENGMO = 4,
    PK = 5,
    MALL = 6,
}

/**
	 * <星环规则>枚举类。
	 * Code generated by Bat&Perl.
	 *
	 * @author Administrator
	 *
	 */
export enum EnumMagicCubeRule {
    /**<星环品质1>。*/
    QUALITY_1 = 1,
    /**<星环品质2>。*/
    QUALITY_2 = 2,
    /**<星环品质3>。*/
    QUALITY_3 = 3,
    /**<星环品质4>。*/
    QUALITY_4 = 4,
    /**<星环品质5>。*/
    QUALITY_5 = 5,
    /**列表数量*/
    LIST_MAX_NUM = 5,
}


/**
 * 怪物ID。
 * @author teppei
 *
 */
export enum EnumMonsterID {
    /**帝者之路Boss的起始ID（按层数加1，例如第1层为WuShenTanBase+1）。*/
    WuShenTanBase = 30310000,

    /**星环秘境Boss的起始ID（按层数加1，例如第1层为ZhuRongJiTanBase+1）。*/
    ZhuRongJiTanBase = 30290000,

    /**伙伴副本boss的起始id(按层数加1，例如第1层为WuYuanBenBase+1)*/
    WuYuanBenBase = 31310001,

    /**特权副本boss的起始id(按层数加1，例如第1层为TeQuanBossBase+1)*/
    TeQuanBossBase1 = 31390001,
    TeQuanBossBase2 = 31400001,
    TeQuanBossBase3 = 31410001,

    /**血战黑洞bossID 两只怪物 31420001 31420002*/
    xzfmBossID = 31420000,//31420000,

    /**世界boss - 刀的神器怪物ID*/
    WorldBossSQDaoMin = 31500001,
    WorldBossSQDaoMax = 31500020,

    /**世界boss - 枪的神器怪物ID*/
    WorldBossSQQiangMin = 31510001,
    WorldBossSQQiangMax = 31510020,
}

export enum EnumPinstanceRule {
    /**<夫妻副本掉落方案ID>。*/
    COUPLE_DROP_ID = 60006001,

    /**<帝者之路排行榜最大数量>。*/
    WST_ALL_RANK_MAX_COUNT = 10,

    /**<帝者之路本层排行榜最大数量>。*/
    WST_LAYER_RANK_MAX_COUNT = 3,

    /**<神选之路排行榜最大数量>。*/
    SXZL_ALL_RANK_MAX_COUNT = 10,

}

export enum EnumGuiderQuestRule {
    NoPause = 0,

    /**绝对暂停任务。*/
    PauseAbsolutely,

    /**激活时暂停任务。*/
    PauseIfActive,
}

export enum EnumGuideStartResult {
    failed = 0,
    success,
    waitViewClosed,
}

/**
* 教学引导类型枚举类。
*
* @author teppei
*
*/
export enum EnumGuide {

    GuideCommon_None = 1,

    /**获得新装备。*/
    GetEquip,
    GetEquip_OpenView,

    /**获得新角色装备。*/
    GetHeroEquip,
    GetHeroEquip_OpenView,

    /**获得物品。*/
    GetThing,
    GetThing_OpenView,

    /**获得新祝福。*/
    GetZhufu,
    GetZhufu_OpenView,

    /**学习新技能。*/
    GetSkill,
    GetSkill_OpenView,

    /**上坐骑指引。*/
    RideOn,
    RideOn_OpenView,

    /**功能解锁*/
    FunctionUnlock,
    FunctionUnlock_OpenView,
    FunctionUnlock_PlayAnim,

    FunctionGuide_OpenView,
    //FunctionGuide_OpenMainFuncBar,
    FunctionGuide_ClickHero,

    /**使用指引*/
    UseItem,
    UseItem_ClickBag,
    UseItem_ClickItem,
    UseItem_ClickUse,
    UseItem_ClickClose,

    /**装备强化指引*/
    EquipEnhance,
    EquipEnhance_ClickEquip,
    EquipEnhance_ClickAutoEnhance,
    EquipEnhance_ClickClose,

    /**装备位升级指引*/
    EquipSlotLvUp,
    EquipSlotLvUp_ClickEquip,
    EquipSlotLvUp_ClickAutoLvUp,
    EquipSlotLvUp_ClickClose,

    /**装备升阶指引*/
    EquipUpLevel,
    EquipUpLevel_ClickEquip,
    EquipUpLevel_ClickAutoUpLevel,
    EquipUpLevel_ClickClose,

    /**坐骑强化指引*/
    MountEnhance,
    MountEnhance_ClickAutoEnhance,
    MountEnhance_ClickClose,

    /**国运指引*/
    GuoYun,
    GuoYun_Active,

    /**技能升级指引*/
    SkillUp,
    SkillUp_ClickSkill,
    SkillUp_ClickUp,
    SkillUp_ClickClose,

    /**神力指引*/
    JuYuan,
    JuYuan_ClickJuYuan,
    JuYuan_ClickUp,
    JuYuan_ClickClose,

    /**等级礼包指引*/
    LvUpGift,
    LvUpGift_OpenLvUpGift,
    LvUpGift_ClickGet,
    LvUpGift_ClickClose,

    /**伙伴指引*/
    Pet,
    Pet_OpenGetZhufuView,
    Pet_ClickGet,
    Pet_OpenPetView,
    Pet_ClickJinJie,
    Pet_ClickClose,

    /**宗门指引*/
    Guild,
    Guild_OpenGuildView,
    Guild_ClickApply,
    Guild_ClickClose,

    /**祈福指引*/
    QiFu,
    QiFu_OpenQiFuView,
    QiFu_ClickQiFu,
    QiFu_ClickClose,

    /**每日签到指引*/
    DailySign,
    DailySign_OpenDailySign,

    /**离线挂机指引*/
    LiXianGuaJi,
    LiXianGuaJi_OpenConfirm,
    LiXianGuaJi_OpenSystemSetting,

    /**过期物品提示指引*/
    OverDue,
    OverDue_OpenOverDuePanel,

    /**特权过期指引*/
    PrivilegeOverdue,
    PrivilegeOverdue_OpenOverduePanel,

    /**每日签到指引*/
    ActTip,
    ActTip_OpenView,

    /**欢迎指引*/
    Welcome,
    Welcome_OpenView,

    /**首充指引*/
    ShouChong,
    ShouChong_OpenShouChong,

    /**首充达成自动弹窗指引*/
    RechargeReach,
    RechargeReach_OpenShouChong,

    /**每日首充达成自动弹窗指引*/
    DailyRechargeReach,
    DailyRechargeReach_OpenShouChong,

    /**离线挂机结算指引*/
    LiXianGuaJiStat,
    LiXianGuaJiStat_OpenView,

    /**获得离线挂机卡指引*/
    GetLiXianGuaJiKa,
    GetLiXianGuaJiKa_OpenSystemSetting,
    GetLiXianGuaJiKa_ClickAddTime,
    GetLiXianGuaJiKa_ClickClose,

    /**经验副本指引*/
    JingYanFuBen,
    JingYanFuBen_OpenView,
    JingYanFuBen_ClickEnter,

    /**强化副本指引*/
    QiangHuaFuBen,
    QiangHuaFuBen_OpenView,
    QiangHuaFuBen_ClickEnter,

    /**变强指引*/
    BianQiang,
    BianQiang_Click,

    /**剧情副本指引*/
    JuQingFuBen = 1000,  // 剧情副本用了3个
    JuQingFuBen_OpenJuQingFuBen,
    JuQingFuBen_ClickEnter,

    /**圣灵强化指引*/
    ShengLingEnhance = 1100,  // 圣灵用了2个
    ShengLingEnhance_ClickShengLing,
    ShengLingEnhance_ClickAutoEnhance,
    ShengLingEnhance_ClickTakeOn,
    ShengLingEnhance_ClickClose,

    /**黑洞塔指引*/
    FengMoTa = 1200,  // 也有2次
    FengMoTa_OpenFengMoTa,
    FengMoTa_ClickEnter,

    /**领取直升丹指引*/
    ZhiShengDan = 1300,  // 也有2次
    ZhiShengDan_OpenFirstRecharge,

    /**材料副本指引*/
    CaiLiaoFuBen = 1400,  // 材料副本用了2个
    CaiLiaoFuBen_OpenCaiLiaoFuBen,
    CaiLiaoFuBen_ClickEnter,

    /**神装收集指引*/
    ShenZhuangShouJi = 1500,  // 神装收集用了多次
    ShenZhuangShouJi_ClickEntrance,
    //ShenZhuangShouJi_ClickEnter,
    ShenZhuangShouJi_ClickActive,
    ShenZhuangShouJi_ClickTakeOn,
    ShenZhuangShouJi_ClickClose,

    /**伙伴副本指引*/
    WuYuanFuBen = 1600,
    WuYuanFuBen_OpenWuYuanFuBen,
    WuYuanFuBen_ClickEnter,

    /**伙伴指引*/
    PetActivate = 1700,
    PetActivate_OpenGetZhufu,
    PetActivate_ClickAction,
    PetActivate_OpenPetView,
    PetActivate_ClickActivate,
    PetActivate_ClickClose,
    PetActivate_FlyIcon,

    /**武魂指引*/
    WuHunActivate = 1800,
    WuHunActivate_OpenHunLiView,
    WuHunActivate_ClickActivate1,//领取
    WuHunActivate_ClickActivate2,//进阶
    WuHunActivate_ClickClose,
    WuHunActivate_OpenGetZhufu,
    WuHunActivate_ClickAction,
  
   // WuHunActivate_FlyIcon,

    /**个人Boss指引*/
    PersonBossActive = 1900,
    PersonBossActive_ClickAction,
    PersonBossActive_EnterPinstance,//进入副本

    /**国家（地宫）Boss指引*/
    DiGongBossActive = 2000,
    DiGongBossActive_ClickAction,
    DiGongBossActive_OpenDiGongPanel,
    DiGongBossActive_EnterPinstance,//进入副本

    /**魂骨指引*/
    HunGuActive = 2100,
    HunGuActive_ClickAction,
    HunGuActive_SelectEquipGrid,
    HunGuActive_ClickEquip,
    HunGuActive_ClickClose,

    /**魂环指引*/
    HunHuanActive = 2200,
    HunHuanActive_ClickAction,
    HunHuanActive_ClickActiveBtn,//注入
    HunHuanActive_ClickActiveBtn1,//激活 和 注入 是同一个按钮 
    HunHuanActive_ClickClose,

    /**伙伴副本指引*/
    HuoBanFuBen = 2300,
    HuoBanFuBen_OpenPinstanceHallView,
    HuoBanFuBen_OpenHuoBanFuBenPanel,
    HuoBanFuBen_ClickEnter,

    /**魔瞳指引*/
    ZhenFaActive = 2400,
    ZhenFaActive_OpenView,//heroView
    ZhenFaActive_ClickPanelBtn,
    ZhenFaActive_ClickClose,

    /**玄天功指引*/
    XuanTianGongActive = 2500,
    XuanTianGongActive_OpenView,//heroView
    XuanTianGongActive_ClickPanelBtn,
    XuanTianGongActive_ClickClose,

    /**鬼影迷踪指引*/
    MiZongActive = 2600,
    MiZongActive_OpenView,//heroView
    MiZongActive_OpenPanel,//ShenJiView
    MiZongActive_ClickPanelBtn,
    MiZongActive_ClickClose,

    /**控鹤擒龙指引*/
    QinLongActive = 2700,
    QinLongActive_OpenView,//heroView
    QinLongActive_ClickPanelBtn,
    QinLongActive_ClickClose,

    /**神选之路指引*/
    ShenXuan = 2800,
    ShenXuan_OpenPinstanceHallView,
    ShenXuan_ClickEnter,

    /**魂力进阶指引 */
    HunLiJinJie = 2900,
    HunLiJinJie_OpenHunLiPanel,

    /**战力卡点提示指引*/
    FightTip = 3000,
    FightTip_ClickTask,
    /**魂骨分解指引 */
    HunGuDecompose = 3100,
    HunGuDecOpenBagPanel,
    HunGuDecClickDecBtn,
    HunGuDecClickListItem,
    HunGuDecClickConfirmBtn,
    /**世界聊天指引*/
    ChatWorld = 3200,
    ChatWorldClickOpenView,
    ChatWorldClickSendBtn,
    /**魂骨升华指引*/
    HunGuShengHua = 3300,
    HunGuShengHuaOpenPanel,
    HunGuShengHuaClickMaterialList,
    HunguShengHuaSelectMaterial,
    HunGuShengHuaClickBtnConfirm,
    HunGuShengHuaClickBtnClose,

    /**使用直升丹指引*/
    UseZhiShengDan = 8000,  // 也有多次，用等级做index的，所以占的段可能比较多
    UseZhiShengDan_OpenConfirm,

    /**伙伴收集展示*/
    DisplayPet = 9000,
    DisplayPet_OpenView,

    /**赛季收集展示*/
    DisplaySaiJi = 9100,
    DisplaySaiJi_OpenView,

    /**次充指引*/
    SecondCharge = 10000,  // 多次
    SecondCharge_Open,

    /**普通弹窗。*/
    CommonOpenView = 11000,
    CommonOpenView_OpenView,
}

export enum EnumKfhdRule {
    /**<世界BOSS类型>。*/
    WORLD_BOSS_TYPE = 1,
    /**<黑洞塔BOSS类型>。*/
    FMT_BOSS_TYPE = 2,
    /**<跨服BOSS类型>。*/
    KUAFU_BOSS_TYPE = 4,
    /**<返利大厅累计充值开始天数>。*/
    REBATE_HALL_RECHARGE_BEGING_DAY = 8,

}


export enum EnumXXDDRule {
    /**<点灯>。*/
    LIGHT_TAB = 1,

    /**<祈福>。*/
    RANK_TAB = 2,

    /**全服记录类型*/
    RECORD_ALL_TYPE = 0,

    /**个人记录类型*/
    RECORD_SELF_TYPE = 1,

    /**<星星点灯展示道具掉落方案>。*/
    REWARD_SHOW_ID = 60403115,

}


/**婚姻面板*/
export enum EnumMarriage {
    RING_1 = 10435011,
    RING_2 = 10435021,
    RING_3 = 10435031,
    FLOWER_1 = 10114011,
    FLOWER_2 = 10114021,
    FLOWER_3 = 10114031,
    FLOWER_4 = 10114041,
    HONGNIANG_NPC = 100201,
    SHIZHUANG = 105,
}


/**vip特权显示阶级*/
export enum VipTeQuanShowType {
    baiyin = 1,
    huangjin = 2,
    zuanshi = 3,
}

export enum EnumMingJiangState {
    NOGUILD, NOTOPEN, OPEN
}
