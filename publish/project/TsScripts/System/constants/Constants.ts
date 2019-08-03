import { TeleportId } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'

export class Constants {
    static LoadWidth = 25;

    static LoadHeight = 35;

    static readonly ZhuChengDefaultPosX = 2111;
    static readonly ZhuChengDefaultPosY = 2537;

    /*上马距离*/
    static readonly AutoRideMinDinstance = 500;
    /**野外场景中人数超过10人自动屏蔽所有玩家*/
    static readonly AutoHideRolesMin = 10;

    /**登录10s超时*/
    static readonly LoginTimeout = 30000;

    /***冲刺距离上限*/
    static readonly ApproachMax = 250;

    /***冲刺距离下限*/
    static readonly ApproachMin = 80;

    static HitFeelingDelay = 0;

    /**开服第3天可关注boss*/
    static readonly BossFollowMinDay = 3;

    /**随从间距比例参数*/
    static readonly AttendantKeepAwayScale = .7;
    static readonly AttendantKeepAwayScaleMoving = .24;

    /**被打或打我现身6秒*/
    static AppearHoldTimeByHit = 6;

    static readonly ResultCountDownMin = 10;
    static readonly ResultCountDownMax = 30;

    /**召集绑钻价格系数*/
    static readonly SummonBindRate = 1;

    /**上下马间隔0.6秒*/
    static readonly RideOnGap = 0.6;

    /**黑洞塔boss引导最低等级*/
    static readonly FengMoTaGuideMinLv = 75;

    /**黑洞塔boss引导最高等级*/
    static readonly FengMoTaGuideMaxLv = 76;

    /**打人的等级下限*/
    static readonly AttackRoleMinLv = 40;

    /**第一只武缘的id*/
    static readonly FirstPetId = 40000011;

    /**跨服倒计时*/
    static readonly KuaFuCountDown = 5;

    /**75级后在右侧显示黑洞塔boss引导*/
    static readonly FmtBossGuideLv = 75;

    /**60s后自动托管游戏*/
    static readonly AutoRunTimeout = 60;

    /**10s后自动执行指引*/
    static AutoGuideTimeout = 10;

    /**10s后自动执行各操作*/
    static AutoDoTimeout = 5;

    /**5s后指引做任务*/
    static GuideQuestTimeout = 5;

    /**黑洞塔引导1层*/
    static readonly FengMoTaGuiderLayer = 1;

    /**地宫魔王提示的最低等级*/
    static readonly DiGongTipMinLevel = 75;

    /**心跳请求时间，每隔2s检查一次*/
    static readonly HEART_INTERVALTIME: number = 2000;

    /**传送点合法范围距离。*/
    static TELEPORT_VALID_DISTANCE: number = 70;

    /**可以砍的距离，这是一个经验值。*/
    static readonly FIGHT_DISTANCE: Array<number> = [-25, 35, -70, 70];

    /**延迟信号值。*/
    static DelaySignal: Array<number> = [50, 100];

    /**非攻击情况下寻路的距离。*/
    static CAST_DISTANCE: number = 100;

    /**寻路到boss的距离*/
    static BOSS_DISTANCE = 300;

    /**群攻距离，与策划约定的只要攻击距离大于这个值即为群攻。*/
    static LONG_CAST_DISTANCE: number = 200;

    static readonly TOLERANCE: number = 5;

    /**点击世界地图的时间间隔*/
    static readonly CLICKMAP_INTERVAL: number = 500;

    /**拾取时间间隔。*/
    static readonly PICKUP_CD: number = 200;

    /**集结令冷却时间为2分钟。*/
    static readonly JIJIE_CD: number = 120000;

    /**60级后取消升级任务完成后自动去做任务。*/
    static readonly LVUP_QUEST_NO_CONTINUE_LV: number = 270;

    /**显示推荐等级任务*/
    static readonly SHOW_RECOMMEND_LV: number = 65;

    /**聊天最多发送3个链接*/
    static readonly MAX_CHAT_LINK_COUNT: number = 3;

    /**国运刷新的价格。*/
    static readonly GUOYUN_YUANBAO_REFRESH_START: number = 50000;

    /**神舟名字*/
    static readonly NVSHEN_NAME: string[] = ['先锋战车', '强袭战车', '毁灭战车', '光辉战车', '荣耀战车'];

    /**无限量购买。*/
    static readonly NO_LIMIT: number = 99999;

    /**加入宗门等级限制。*/
    static readonly GUILD_JOIN_MIN_LV: number = 20;

    /**最大时装附魔级别*/
    static readonly MAX_DRESS_FM_LEVEL: number = 5;

    //共鸣属性加成
    static readonly GONGMIMG_5: number = 5;
    static readonly GONGMING_6: number = 15;
    static readonly GONGMING_7: number = 30;
    static readonly GONGMING_8: number = 50;

    /**连斩cd*/
    static readonly LZ_CD: number = 60;

    /**封神台基本次数。*/
    static readonly FENGSHEN_BASIC_TIMES: number = 15;

    /**普通跳跃技能的耗时，单位毫秒。*/
    static readonly NORMAL_JUMP_TIME: number = 0.66;

    /**BUFF图标尺寸。*/
    static readonly BUFF_ICON_SIZE_SMALL: number = 18;

    /** 永久 */
    static readonly S_YONGJIU: string = '永久';

    static readonly ID_LIST_JI_1: number[] = [10056, 10076, 10075, 10283, 10284, 10285];
    static readonly ID_LIST_JIE_3: number[] = [10160, 10243];
    static readonly ID_LIST_JIE_1: number[] = [10294, 10295, 10299, 10294, 10295, 13510, 10348];
    static readonly ID_LIST_CENG_1: number[] = [10244];

    /** 游戏中数值的倍率 */
    static readonly VALUE_RATIO: number = 10000;

    /** ~键的最远选择距离 */
    static readonly MAX_SELECT_DIR: number = 800;
    /** 飘血的高度最大偏移值 */
    static readonly MIN_MONSTER_FLOAT_OFFSET: number = 130;
    /** 最大主角的等级 */
    static readonly MAX_HERO_LEVEL: number = 300;
    /** 装备升级等级 */
    static readonly EQUIP_UPDATE_LEVELS: number[] = [5, 9, 15, 20, 25, 30];
    /** 技能引导前的任务 */
    static readonly SKILL_GUILD: number = 1001069;
    /**任务引导最高等级*/
    static readonly QUEST_GUIDE_MAX_LV: number = 1;
    /** 任务每一环钻石价格 */
    static readonly QUEST_GOLDEN: number = 1;
    /** 显示祝福面板特效 */
    static readonly SHOW_ZHUFU_EFFECT: boolean = false;

    /** RMB道具ID列表 */
    static readonly RMB_ITEM_ID_LIST: number[] = [10277011, 10277021, 10277031, 10277041, 10277051];

    /** 极速挑战最大的开服时间15天 */
    MAX_JSTZ_DAY: number = 15;

    /** 宗门PVP跨服奖励掉落列表 */
    static GUILD_PVP_CROSS_REWARD_LIST: number[] = [60165027, 60165028, 60165029, 60165030, 60165031, 60165032, 60165033, 60165034];
    /** 宗门战第几天开始跨服 */
    static CORSS_GUILD_PVP_START_DAY: number = 7;

    /** 极速挑战最大的开服时间15天 */
    static readonly MAX_JSTZ_DAY: number = 15;

    static readonly FresheMemTps: number[] = [TeleportId.freshMemTp0, TeleportId.freshMemTp1, TeleportId.freshMemTp2];

    /**小鸡副本第几次后开始收费*/
    static readonly XiaoJiChargesNum = 1;

    /**宗门技能相差不能超过5级*/
    static readonly GuildSkillMaxMinGap = 5;

    /**神器最大阶数*/
    static readonly ShengQiMaxLevel = 7;
    /**世界杯最低奖池数量*/
    static readonly WorldCupMinRewPoolNum = 2000;
    /**世界杯单个比分最大投注数*/
    static readonly WorldCupOneScoreMaxBet = 50000;
    /**伙伴最大觉醒等级*/
    static readonly petMaxAwakenLevel = 4;
    /**世界BOSS最大比玩家等级大多少级才弹窗*/
    static readonly BossHeroMaxMinLevelGap = 20;

    static readonly EquipParts: number[] = [KeyWord.EQUIP_PARTCLASS_WEAPON, KeyWord.EQUIP_PARTCLASS_NECKCHAIN,
    KeyWord.EQUIP_PARTCLASS_RING, KeyWord.EQUIP_PARTCLASS_CHAIN,
    KeyWord.EQUIP_PARTCLASS_HAT, KeyWord.EQUIP_PARTCLASS_CLOTH,
    KeyWord.EQUIP_PARTCLASS_TROUSER, KeyWord.EQUIP_PARTCLASS_SHOE,
    KeyWord.EQUIP_PARTCLASS_WING, KeyWord.EQUIP_PARTCLASS_WEDDINGRING];

    static readonly ButtonEffectPath = 'effect/uitx/dianji/dianjigx.prefab';
}