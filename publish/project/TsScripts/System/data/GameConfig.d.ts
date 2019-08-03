declare module GameConfig {
    /**
    * AHBonusConfig(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class AHBonusConfig {
        /**物品的id*/
        m_iId: number;

        /**物品的数量*/
        m_iNum: number;

        /**对应图标id的tips*/
        m_szIconTips: string;
    }

    /**
    * AccessItem(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class AccessItem {
        /**激活物品ID*/
        m_iID: number;

        /**激活物品数量*/
        m_iNumber: number;
    }

    /**
    * 成就属性加成配置(defined in xml\Achievement.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class AchiAttrConfigM {
        /**成就点*/
        m_uiAchiValeTotal: number;

        /**附加的属性列表*/
        m_stAchiAttr: Array<AchiPropAtt>;
    }

    /**
    * 客户端成就属性配置(defined in xml\Achievement.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class AchiConfigM {
        /**成就唯一ID*/
        m_iID: number;

        /**成就名字*/
        m_szName: string;

        /**大类*/
        m_ucMainType: number;

        /**子类*/
        m_ucSubType: number;

        /**条件类型*/
        m_ucQuestType: number;

        /**条件参数*/
        m_uiQuestPara: number;

        /**条件完成值*/
        m_uiQuestValue: number;

        /**奖励成就点*/
        m_uiAchiVale: number;

        /**描述*/
        m_szDesc: string;
    }

    /**
    * AchiPropAtt(defined in xml\Achievement.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class AchiPropAtt {
        /**属性id*/
        m_ucPropId: number;

        /**属性值*/
        m_iPropValue: number;
    }

    /**
    * ActHomeConfigM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ActHomeConfigM {
        /**活动开启的时间，周一到周日*/
        m_ucDay: number;

        /**活动显示类型1.周几开启，2开服前几天开启*/
        m_szShowType: string;

        /**活动ID*/
        m_iID: number;

        /**活动开启的等级*/
        m_iLevel: number;

        /**该活动的排序位置*/
        m_ucPos: number;

        /**该活动的索引,唯一标识*/
        m_iIndex: number;

        /**活动名称*/
        m_szName: string;

        /**活动时间*/
        m_szTime: string;

        /**活动时间ID*/
        m_ucTimeId: number;

        /**活动奖励信息配置*/
        m_BonusInfo: Array<AHBonusConfig>;

        /**活动规则*/
        m_szRuleDesc: string;

        /**功能ID*/
        m_iFunctionId: number;

        /**图标资源*/
        m_szIconRes: string;
    }

    /**
    * ActIconOrderM(defined in xml\NPC.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ActIconOrderM {
        /**0功能名字*/
        m_iID: number;

        /**0类型*/
        m_iArea: number;

        /**0排序*/
        m_iOrder: number;

        /**仅指定平台显示*/
        m_szPlatformNames: string;

        /**0是否是活动图标*/
        m_iActIcon: number;

        /**0图标类型*/
        m_iType: number;
    }

    /**
    * ActivityConfigM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ActivityConfigM {
        
        m_iID: number;

        m_ushActivityType: number;

        m_iEnterSceneID: number;

        /**关联副本ID*/
        m_aiEnterInstanceID: Array<number>;

        m_szName: string;

        /**是否需要跨服*/
        m_ucIsKF: number;

        m_ucIsActived: number;

        m_iTimeLimitID: number;

        m_iPlatformLimitID: number;

        m_szRuleDesc: string;

        /**是否需要前台弹窗提示*/
        m_ucNeedWinPrompt: number;

        /**前台弹窗提示等级*/
        m_ucPromptLevel: number;

        /**是否在动作栏显示图标*/
        m_ucShowBarIcon: number;
    }

    /**
    * ActivityPanelConfigM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ActivityPanelConfigM {
        /**活动ID,未在Activity.xls中配置的其他活动，从1000开始*/
        m_iID: number;

        /**活动开启的等级*/
        m_iLevel: number;

        /**关联的功能,对应npc表中*/
        m_iFuncId: number;

        /**帮助搜索关键字*/
        m_iHelpSearchId: number;

        /**活动面板类型，每日固定活动(1)/每日时段活动(2)/每周时段活动(3)*/
        m_ucType: number;

        /**该活动的排序位置*/
        m_ucPostion: number;

        /**该活动的索引,唯一标识*/
        m_iIndex: number;

        /**活动对应的副本id，若是有限次的，必须有副本id;其他情况可以为0*/
        m_iPinstanceID: number;

        /**关联的任务类型*/
        m_ucQuestType: number;

        /**活动名称*/
        m_szName: string;

        /**活动时间*/
        m_szTime: string;

        /**活动时间ID*/
        m_ucTimeId: number;

        /**可参与次数*/
        m_ucLimitCnt: number;

        /**活动奖励信息配置*/
        m_BonusInfo: Array<BonusConfig>;

        m_BonusSearch: Array<number>;
    }

    /**
    * ActorMonsterM(defined in xml\NPC.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ActorMonsterM {
        /**NPC编号*/
        m_iNpcID: number;

        /**所在场景*/
        m_iSceneID: number;

        /**坐标x*/
        m_iPositionX: number;

        /**坐标y*/
        m_iPositionY: number;
    }

    /**
    * 附加技能效果(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class AddSkillEffects {
        
        m_iEffectType: number;

        m_iEffectValue: number;
    }

    /**
    * 登录广告(defined in xml\Resources.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class AdsShowConfigM {
        /**序号*/
        m_iID: number;

        /**弹出方式*/
        m_iType: string;

        /**弹出起始等级*/
        m_iLevel: number;

        /**弹出顺序*/
        m_iNumber: number;

        /**是否跟随开服,0不跟随，1跟随*/
        m_ucFKF: number;

        /**是否开服互斥,0不互斥，1互斥*/
        m_ucKFHC: number;

        /**开启日期*/
        m_szOpenDay: string;

        /**结束日期*/
        m_szCloseDay: string;

        /**宣传图片id*/
        m_iPicId: number;
    }

    /**
    * AllPeopleHiCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class AllPeopleHiCfgItem {
        /**物品ID*/
        m_iItemID: number;

        /**物品个数*/
        m_iItemCount: number;
    }

    /**
    * AllPeopleHiConfigM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class AllPeopleHiConfigM {
        /**0ID*/
        m_iID: number;

        /**0排序*/
        m_iOrderID: number;

        /**0活动ID*/
        m_iActID: number;

        /**0功能ID*/
        m_iFuncID: number;

        /**0关键字*/
        m_ucType: number;

        /**0关键字描述*/
        m_iKeywordsDesc: string;

        /**0类型索引*/
        m_iTypeIndex: number;

        /**0完成标准*/
        m_uiTimes: number;

        /**0奖励的活跃度*/
        m_ucGiveAct: number;
    }

    /**
    * AncientQuestConfigM(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class AncientQuestConfigM {
        /**任务ID*/
        m_iQuestID: number;

        /**任务总数*/
        m_uiQuestTotal: number;

        /**任务类型*/
        m_ucTaskType: number;

        /**任务目标*/
        m_uiTaskTarget: number;

        /**0任务节点*/
        m_uiTaskConditions: number;

        /**0杀怪积分*/
        m_uiTaskValue1: number;

        /**0杀人积分*/
        m_uiTaskValue2: number;

        /**0奖励ID*/
        m_uiAwardID: number;

        /**0奖励数量*/
        m_uiAwardNumber: number;

        /**0任务名字*/
        m_szName: string;

        /**0节点文字*/
        m_szText: string;
    }

    /**
    * ArenaMaxRankRewardCfgM(defined in xml\ArenaGuard.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ArenaMaxRankRewardCfgM {
        /**唯一配置ID*/
        m_iID: number;

        /**最小排名*/
        m_iLowRank: number;

        /**最大排名*/
        m_iHighRank: number;

        /**奖励物品个数*/
        m_stItemList: Array<ArenaMaxRankRewardItem>;
    }

    /**
    * ArenaMaxRankRewardItem(defined in xml\ArenaGuard.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ArenaMaxRankRewardItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iNumber: number;
    }

    /**
    * 战力属性与相关功能映射表配置(defined in xml\NPC.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class Attr2FuncM {
        /**属性ID*/
        m_iAttrID: number;

        /**关联的功能数量*/
        m_ucFuncNumber: number;

        /**功能ID的数组*/
        m_astFunction: Array<AttrFunc>;
    }

    /**
    * 属性对应的功能(defined in xml\NPC.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class AttrFunc {
        /**功能的ID*/
        m_iFuncID: number;

        /**功能描述*/
        m_szFuncDesc: string;
    }

    /**
    * BFQDCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BFQDCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * BFQDChargeM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BFQDChargeM {
        /**唯一配置ID*/
        m_iID: number;

        /**0充值额度*/
        m_uiChargeValue: number;

        /**0掉落方案*/
        m_iDropID: number;
    }

    /**
    * BFQDDrawCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BFQDDrawCfgM {
        /**唯一配置ID*/
        m_iID: number;

        /**0出现概率*/
        m_iProb: number;

        /**0物品ID*/
        m_iItemID: number;

        /**0物品数量*/
        m_iItemCount: number;

        /**0是否记录*/
        m_ucRecord: number;
    }

    /**
    * BFQDRankM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BFQDRankM {
        /**0唯一配置ID*/
        m_iID: number;

        /**0条件1*/
        m_iCondition1: number;

        /**0条件2*/
        m_iCondition2: number;

        /**0条件3*/
        m_iCondition3: number;

        /**模型名字*/
        m_szModelName: string;

        /**0模型类型*/
        m_iModelType: number;

        /**0模型ID*/
        m_iModelID: number;

        /**0武器ID*/
        m_iWeaponID: number;

        /**0物品总数*/
        m_iItemCount: number;

        /**物品列表*/
        m_stItemList: Array<BFQDCfgItem>;
    }

    /**
    * BOSSActCfgItem(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BOSSActCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * BXFLItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BXFLItem {
        /**物品ID*/
        m_uiID: number;

        /**物品个数*/
        m_uiCount: number;
    }

    /**
    * BaoDianCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BaoDianCfgM {
        /**0唯一配置ID*/
        m_iID: number;

        /**0显示顺序*/
        m_iSeq: number;

        /**0类型*/
        m_iType: number;

        /**0功能ID*/
        m_iFunctionID: number;

        /**0功能数值*/
        m_iFunctionValue: number;

        /**0说明*/
        m_szShow: string;
    }

    /**
    * 红颜配置(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BeautyAttrM {
        /**散仙ID*/
        m_iID: number;

        /**激活条件*/
        m_iCondition: number;

        /**0装备位起点（以8为隔）*/
        m_uiEquipPosition: number;

        /**武缘品质*/
        m_ucColor: number;

        /**关联圣器*/
        m_ucFaBaoType: number;

        m_szBeautyName: string;

        /**品质对应的可进阶上限*/
        m_uiStage: number;

        /**怒气技能ID*/
        m_uiSkillID: number;

        /**飞升次数限制*/
        m_iFSCntLimit: number;

        /**飞升的基础信息*/
        m_stFSInfo: Array<FSBaseInfo>;

        /**显示说明*/
        m_szShowDesc: string;

        /**0展示图标id*/
        m_uiShowIconID: number;

        /**0显示页签*/
        m_uiLabelID: number;

        m_uiRange: number;

        m_uiListPicId: number;

        /**单挑星级*/
        m_uiSolo: number;

        /**辅助星级*/
        m_uiAuxiliary: number;

        /**群攻星级*/
        m_uiAttack: number;

        /**0PK星级*/
        m_uiPk: number;

        /**0回血星级*/
        m_uiBlood: number;

        /**武器模型ID*/
        m_iModelID: number;

        /**特效名称*/
        m_iEffectName: number;

        /**0寻宝展示id*/
        m_uiXunBaoShowID: number;

        /**0寻宝掉落id*/
        m_uiXunBaoDropID: number;
    }

    /**
    * 武缘觉醒(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BeautyAwakeCfgM {
        /**0武缘ID  */
        m_iID: number;

        /**0觉醒等级*/
        m_ucLv: number;

        /**0觉醒经验 */
        m_iAwakeExp: number;

        /**0祝福值下限 废弃*/
        m_ucLuckdown: number;

        /**0祝福值上限 废弃*/
        m_ucLuckup: number;

        /**0祝福材料ID*/
        m_iConsumableID: number;

        /**0祝福材料数量*/
        m_iConsumeNum: number;

        /**0突破材料ID*/
        m_iByongID: number;

        /**0突破材料数量*/
        m_iByongNumber: number;

        /**0升阶属性*/
        m_astFixProp: Array<BeautyPropAtt>;

        /**0升阶属性*/
        m_astProp: Array<BeautyPropAtt>;
    }

    /**
    * BeautyEquipSuitInfo(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BeautyEquipSuitInfo {
        /**装备ID*/
        m_iId: number;
    }

    /**
    * 红颜缘分配置(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BeautyEquipSuitPreViewM {
        /**武缘阶级*/
        m_iStage: number;

        /**套装装备信息*/
        m_astEquipInfo: Array<BeautyEquipSuitInfo>;

        /**获取途径*/
        m_szSpecDesc: string;
    }

    /**
    * BeautyFatePropAtt(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BeautyFatePropAtt {
        /**属性id*/
        m_ucPropId: number;

        /**是否加百分比*/
        m_ucPercent: number;

        /**属性值*/
        m_iPropValue: number;
    }

    /**
    * BeautyPropAtt(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BeautyPropAtt {
        /**属性id*/
        m_ucPropId: number;

        /**属性值*/
        m_iPropValue: number;
    }

    /**
    * BeautySkillInfo(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BeautySkillInfo {
        /**技能ID*/
        m_uiID: number;
    }

    /**
    * 红颜进阶配置(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BeautyStageM {
        /**0红颜Id*/
        m_iID: number;

        /**0阶级*/
        m_iStage: number;

        /**0材料ID*/
        m_iConsumableID: number;

        /**0限制材料数组*/
        m_stLimitIDList: Array<OneIntElement>;

        /**0材料数量*/
        m_iConsumableNumber: number;

        /**0提升概率*/
        m_iGaiLv: number;

        /**0祝福值上限*/
        m_iLucky: number;

        /**0升阶属性*/
        m_astAttrList: Array<BeautyPropAtt>;

        /**0模型ID*/
        m_iModelID: number;

        /**散仙技能*/
        m_astSkillList: Array<BeautySkillInfo>;
    }

    /**
    * BeautySuitPartDesc(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BeautySuitPartDesc {
        /**套装部位说明*/
        m_aszDesc: string;
    }

    /**
    * BeautySuitPropM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BeautySuitPropM {
        /**套装ID*/
        m_uiID: number;

        /**名字*/
        m_szName: string;

        /**套装属性*/
        m_astPropAtt: Array<EquipPropAtt>;

        /**套装部位说明*/
        m_aszPartDesc: Array<BeautySuitPartDesc>;
    }

    /**
    * 武缘阵图激活(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BeautyZTJHCfgM {
        /**阵图ID*/
        m_iID: number;

        /**阵图名称*/
        m_szName: string;

        /**位置总数*/
        m_iPosCnt: number;

        /**位置武缘信息*/
        m_szPosInfo: Array<BeautyZTPosInfo>;
    }

    /**
    * 武缘阵图位置信息(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BeautyZTPosInfo {
        /**武缘ID*/
        m_iBeautyID: number;
    }

    /**
    * 武缘阵图强化(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BeautyZTUpLvCfgM {
        /**0阵图ID  */
        m_iID: number;

        /**0阵图等级*/
        m_ucLv: number;

        /**0材料1ID */
        m_iConsumID: number;

        /**0材料数量*/
        m_iConsumNum: number;

        /**0祝福值  */
        m_ucLuck: number;

        /**0升阶属性*/
        m_astProp: Array<BeautyPropAtt>;
    }

    /**
    * 血脉配置(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BloodCfgM {
        /**阶级ID*/
        m_iID: number;

        /**0精血经验*/
        m_uiBloodExp: number;

        /**0激活技能1*/
        m_iActiveSkillID1: number;

        /**0激活技能2*/
        m_iActiveSkillID2: number;

        /**0材料ID*/
        m_iConsumableID: number;

        /**0材料数量*/
        m_iConsumableNumber: number;

        /**0精血回复*/
        m_uiRecover: number;

        /**0固定属性*/
        m_astFixAttrList: Array<EquipPropAtt>;

        /**0升阶属性*/
        m_astAttrList: Array<EquipPropAtt>;
    }

    /**
    * BonusConfig(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BonusConfig {
        /**奖励类型,物品的id*/
        m_iType: number;

        /**此物品在此活动中的价值*/
        m_ucStarNum: number;

        /**若是非单一物品类的奖励，则填图标id，并填下面的tips*/
        m_iIconId: number;

        /**对应图标id的tips*/
        m_iIconTips: string;
    }

    /**
    * BossDropInfo(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BossDropInfo {
        /**BossID*/
        m_iBossID: number;

        /**Boss掉落ID*/
        m_iBossDropID: number;
    }

    /**
    * BuBuGaoShengActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BuBuGaoShengActCfgM {
        /**唯一配置ID*/
        m_iID: number;

        /**0活动天数*/
        m_iActivityDays: number;

        /**条件1*/
        m_iCondition1: number;

        /**物品数量*/
        m_iItemCount: number;

        /**奖励物品个数*/
        m_stItemList: Array<BuBuGaoShengCfgItem>;
    }

    /**
    * BuBuGaoShengCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BuBuGaoShengCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * BuffConfigM(defined in xml\Buff.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BuffConfigM {
        /**Buff ID*/
        m_uiBuffID: number;

        /**图标名称*/
        m_szBuffIconName: string;

        /**描述*/
        m_szBuffDescription: string;

        /**是否显示时间*/
        m_ucIsShowTime: number;

        /**显示位置*/
        m_ucDisplayPosition: number;

        /**手动取消*/
        m_ucCancel: number;

        /**图标ID*/
        m_uiBuffIconID: number;

        /**特效*/
        m_szBuffSpecialEffect: string;

        /**特效绑定位置*/
        m_ucBindingPosition: number;

        /**ChangeAvatar*/
        m_szChangeAvatar: string;

        /**时装变身头部*/
        m_uiHeadAvata: number;

        /**时装变身身体*/
        m_uiBodyAvata: number;

        /**时装变身武器*/
        m_uiEquipAvata: number;

        m_astBuffEffect: Array<BuffEffect>;

        /**同id下，是否累加时间*/
        m_ucAddTime: number;

        /**识别ID*/
        m_iIdentifyID: number;

        /**互斥类型*/
        m_ucBuffType: number;

        /**Buff 等级*/
        m_ucBuffLevel: number;

        /**类型*/
        m_ucType: number;
    }

    /**
    * BuffEffect(defined in xml\Buff.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class BuffEffect {
        /**效果类型*/
        m_iBuffEffectType: number;

        /**作用概率*/
        m_ushBuffEffectProbility: number;

        /**数据类型*/
        m_ucDataType: number;

        /**效果值*/
        m_iBuffEffectValue: number;

        /**作用对象*/
        m_ucBuffEffectObject: number;
    }

    /**
    * CDKEY礼包表(defined in xml\Platform.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CDKeyGiftConfigM {
        /**礼包id*/
        m_iGiftID: number;

        /**礼包名称*/
        m_szName: string;

        /**礼包物品*/
        m_stThing: Array<CDKeyGiftThing>;
    }

    /**
    * CDKEY礼包表的物品结构(defined in xml\Platform.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CDKeyGiftThing {
        /**物品id*/
        m_iThingID: number;

        /**物品数量*/
        m_iThingNum: number;
    }

    /**
    * CEItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CEItem {
        /**物品ID*/
        m_uiID: number;

        /**物品个数*/
        m_uiCount: number;
    }

    /**
    * CWCaiLiaoItem(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CWCaiLiaoItem {
        /**材料ID*/
        m_uiCaiLiaoID: number;

        /**材料个数*/
        m_uiCaiLiaoCount: number;
    }

    /**
    * CWJiangLiItem(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CWJiangLiItem {
        /**奖励ID*/
        m_uiJiangLiID: number;

        /**奖励个数*/
        m_uiJiangLiCount: number;
    }

    /**
    * CZKHRebateConfigM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CZKHRebateConfigM {
        /**0物品ID*/
        m_iItemID: number;

        /**0物品数量*/
        m_iItemNum: number;

        /**0充值券所在档位*/
        m_iChargeCount: number;

        /**0额外元宝数量*/
        m_iDiscountRate: number;

        /**条件1*/
        m_iCondition1: number;

        /**条件2*/
        m_iCondition2: number;

        /**位置*/
        m_ucPosition: number;
    }

    /**
    * CZSHLActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CZSHLActCfgM {
        /**唯一配置ID*/
        m_iID: number;

        /**条件1*/
        m_iCondition1: number;

        /**条件2*/
        m_iCondition2: number;

        /**兑换次数*/
        m_iTime: number;

        /**物品总数*/
        m_iItemCount: number;

        /**奖励物品个数*/
        m_stItemList: Array<CZSHLCfgItem>;
    }

    /**
    * CZSHLCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CZSHLCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * CZTHActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CZTHActCfgM {
        /**0唯一配置ID*/
        m_iID: number;

        /**0充值天数*/
        m_iRechargeDays: number;

        /**0充值额度*/
        m_iChargeValue: number;

        /**物品列表*/
        m_stItemList: Array<CZTHItem>;
    }

    /**
    * CZTHDailyCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CZTHDailyCfgM {
        /**0唯一配置ID*/
        m_iID: number;

        /**0活动天数*/
        m_iActivityDays: number;

        /**0充值额度*/
        m_iChargeValue: number;

        /**物品列表*/
        m_stItemList: Array<CZTHItem>;
    }

    /**
    * CZTHItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CZTHItem {
        /**物品ID*/
        m_iID: number;

        /**个数*/
        m_iCount: number;
    }

    /**
    * CameraAnimM(defined in xml\Client.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CameraAnimM {
        /**触发方式*/
        m_triggerType: number;

        /**参数ID*/
        m_triggerParam: number;

        /**资源路径*/
        m_resDir: string;

        /**是否启用*/
        m_isEnabled: number;

        /**动画名称*/
        m_animName: string;

        /**背景音乐*/
        m_music: string;
    }

    /**
    * CardDiscountCfgM(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CardDiscountCfgM {
        /**0等级*/
        m_iID: number;

        /**0折扣*/
        m_ucDiscount: number;

        /**0月卡类型*/
        m_ucType: number;

        /**0阶级*/
        m_uiStage: number;

        /**0星数*/
        m_uiStars: number;

        /**0道具对应的经验*/
        m_uiOneExp: number;

        /**0升级经验*/
        m_uiLevelUpExp: number;

        /**0升级属性*/
        m_astAttrList: Array<EquipPropAtt>;
    }

    /**
    * CarnivalCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CarnivalCfgM {
        /**0开启日期*/
        m_iDay: number;

        /**0顺序*/
        m_iID: number;

        /**0物品名称*/
        m_iItemID: number;

        /**0物品个数*/
        m_iItemCount: number;

        /**0出现概率*/
        m_iProb: number;

        /**0图标边框颜色*/
        m_iIconColor: number;

        /**0是否记录*/
        m_iRecord: number;
    }

    /**
    * ChallengeBossCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ChallengeBossCfgM {
        /**BOSSID*/
        m_iID: number;

        /**0BOSS类型*/
        m_ucBossType: number;

        /**物品总数*/
        m_iItemCount: number;

        /**奖励物品个数*/
        m_stItemList: Array<BOSSActCfgItem>;

        /**显示用掉落ID*/
        m_iDisplayDropId: number;

        /**控制封魔悬赏角标显示*/
        m_iDisplayLevel: number;
    }

    /**
    * 充值送礼(defined in xml\GiftCenter.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ChargeGiftConfigM {
        /**0渠道类型*/
        m_iChannlID: number;

        /**0充值RMB*/
        m_iChargeRMB: number;

        /**0充值货币1ID*/
        m_iChargeID: number;

        /**0充值货币1数量*/
        m_iChargeCount: number;

        /**0返还货币1ID*/
        m_iPresentID: number;

        /**0返还货币1数量*/
        m_iPresentCount: number;

        /**0首次充值返还货币1ID*/
        m_iFirstPresentID: number;

        /**0首次充值返还货币1数量*/
        m_iFirstPresentCount: number;

        /**0物品ID*/
        m_iProductID: number;

        /**0物品名称*/
        m_szProductName: string;

        /**0物品描述*/
        m_szProductDesc: string;
    }

    /**
    * ChatBubbleM(defined in xml\Client.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ChatBubbleM {
        /**是否启用*/
        m_isEnabled: number;

        /**对象ID*/
        m_ID: number;

        /**起始等级*/
        m_limitMin: number;

        /**结束等级*/
        m_limitMax: number;

        /**内容*/
        m_value: string;

        /**持续时间*/
        m_maintain: number;

        /**初始化时间*/
        m_initTime: number;

        /**切换时间*/
        m_nextTime: number;
    }

    /**
    * ClientDefaultM(defined in xml\Client.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ClientDefaultM {
        /**键*/
        m_szName: string;

        /**值*/
        m_szValue: string;
    }

    /**
    * ClientMonsterConfigM(defined in xml\Monster.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ClientMonsterConfigM {
        /**怪物ID*/
        m_iMonsterID: number;

        /**所在场景*/
        m_iSceneID: number;

        /**坐标x*/
        m_iPositionX: number;

        /**坐标y*/
        m_iPositionY: number;
    }

    /**
    * CollectExchangeActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CollectExchangeActCfgM {
        /**0唯一配置ID*/
        m_iID: number;

        /**0开服兑换次数*/
        m_uiTime: number;

        /**兑换奖励物品个数*/
        m_stCaiLiaoList: Array<CEItem>;

        /**奖励物品个数*/
        m_stJiangLiList: Array<CEItem>;
    }

    /**
    * CollectWordActCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CollectWordActCfgM {
        /**唯一配置*/
        m_iID: number;

        /**0兑换类型*/
        m_uiType: number;

        /**0开服第几天*/
        m_iDay: number;

        /**最大可兑换次数*/
        m_uiTime: number;

        /**兑换奖励物品个数*/
        m_stCaiLiaoList: Array<CWCaiLiaoItem>;

        /**奖励物品个数*/
        m_stJiangLiList: Array<CWJiangLiItem>;
    }

    /**
    * ColosseumCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ColosseumCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * ColosseumGradeM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ColosseumGradeM {
        /**0唯一配置ID,段位*/
        m_iID: number;

        /**0段位名称*/
        m_szName: string;

        /**大段位*/
        m_iStage: number;

        /**小段位*/
        m_iLv: number;

        /**0提升段位所积分*/
        m_iScore: number;

        /**0每天前3场奖励（胜）*/
        m_iReward: number;

        /**0段位达成奖励，掉落ID*/
        m_iReachDropID: number;

        /**0物品总数*/
        m_iItemCount: number;

        /**物品列表*/
        m_stItemList: Array<ColosseumCfgItem>;

        /**0货币上限*/
        m_iMoneyLimit: number;
    }

    /**
    * ColosseumPowerM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ColosseumPowerM {
        /**0唯一配置ID,段位*/
        m_iID: number;

        /**0四象之力等级*/
        m_iLevel: number;

        /**0出站类型*/
        m_iBattleType: number;

        /**0战胜对手后恢复百分比*/
        m_iRecover: number;

        /**0克制青龙*/
        m_iRes1Dragon: number;

        /**0克制白虎*/
        m_iRes2Tiger: number;

        /**0克制朱雀*/
        m_iRes3Phoenix: number;

        /**0克制玄武*/
        m_iRes4Turtle: number;

        /**0位置加载，前锋*/
        m_iSlot1Forward: number;

        /**0位置加载，中坚*/
        m_iSlot2Center: number;

        /**0位置加载，后阵*/
        m_iSlot3Behind: number;

        /**0位置加载，援军*/
        m_iSlot4Support: number;
    }

    /**
    * ColosseumRankM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ColosseumRankM {
        /**0唯一配置ID,排名*/
        m_iID: number;

        /**0积分效率*/
        m_iProfit: number;
    }

    /**
    * ConchBuyConfigM(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ConchBuyConfigM {
        /**摇的次数*/
        m_iTimes: number;

        /**需要的元宝数*/
        m_iNeedCopper: number;

        /**获得的铜钱数*/
        m_iGetShell: number;
    }

    /**
    * ConsumeRankActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ConsumeRankActCfgM {
        /**0流水号*/
        m_iID: number;

        /**消费最低额度要求*/
        m_iConsumeLimit: number;

        /**开始名次*/
        m_iBeginRank: number;

        /**结束名次*/
        m_iEndRank: number;

        /**活动开启第几天领取*/
        m_iDays: number;

        /**道具数量*/
        m_iItemCount: number;

        /**总共多少天奖励类型*/
        m_stItemList: Array<DAILYCONSUMEGiveItem>;
    }

    /**
    * CountryCrystalAtt(defined in xml\chongmai.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CountryCrystalAtt {
        /**星魂ID*/
        m_uiID: number;
    }

    /**
    * 国家摘星台配置客户端(defined in xml\chongmai.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CountryLotteryConfigM {
        /**摘星奖励位置*/
        m_ucPos: number;

        /**摘星奖励物品的id*/
        m_iThingId: number;

        /**摘星奖励物品的数量*/
        m_iThingNum: number;

        /**摘星物品图标id*/
        m_iIconId: number;

        /**摘星物品tips*/
        m_iTips: string;
    }

    /**
    * CountryMedalConfigM(defined in xml\chongmai.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CountryMedalConfigM {
        /**勋章类型*/
        m_iMedalType: number;

        /**勋章名称*/
        m_szMedalName: string;

        /**折扣*/
        m_iMedalZK: number;

        /**勋章时效*/
        m_iMedalTime: number;
    }

    /**
    * 国家英灵之魂配置客户端(defined in xml\chongmai.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CountryYingLingConfigM {
        /**英雄ID*/
        m_ucHeroID: number;

        /**星魂ID*/
        m_astCrystal: Array<CountryCrystalAtt>;

        /**英雄名*/
        m_iHeroName: string;
    }

    /**
    * Cross3V3CfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class Cross3V3CfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * Cross3V3GradeM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class Cross3V3GradeM {
        /**0唯一配置ID,段位*/
        m_iID: number;

        /**模型名字*/
        m_szName: string;

        /**大段位*/
        m_iStage: number;

        /**小段位*/
        m_iLv: number;

        /**0提升段位所积分*/
        m_iScore: number;

        /**0段位功勋奖励（胜）*/
        m_iReward1: number;

        /**0段位功勋奖励（败）*/
        m_iReward2: number;

        /**0掉落方案ID（胜）*/
        m_iWinDropID: number;

        /**0掉落方案名（败）*/
        m_iLoseDropID: number;

        /**0物品总数*/
        m_iItemCount: number;

        /**物品列表*/
        m_stItemList: Array<Cross3V3CfgItem>;
    }

    /**
    * Cross3V3SeasonM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class Cross3V3SeasonM {
        /**0唯一配置ID*/
        m_iID: number;

        /**0开始排名*/
        m_iBeginTop: number;

        /**0结束排名*/
        m_iEndTop: number;

        /**0物品总数*/
        m_iItemCount: number;

        /**物品列表*/
        m_stItemList: Array<Cross3V3CfgItem>;
    }

    /**
    * Cross3V3WinM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class Cross3V3WinM {
        /**0唯一配置ID，胜场*/
        m_iID: number;

        /**胜场次数*/
        m_iWinCount: number;

        /**0物品总数*/
        m_iItemCount: number;

        /**物品列表*/
        m_stItemList: Array<Cross3V3CfgItem>;
    }

    /**
    * CrossSingleM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CrossSingleM {
        /**唯一配置ID*/
        m_iID: number;

        /**大段位*/
        m_iStage: number;

        /**小段位*/
        m_iLv: number;

        /**提升段位所需积分*/
        m_iScore: number;

        /**每日领取功勋值*/
        m_iRewardNum: number;

        /**首次达成段位奖励掉落方案id*/
        m_iDropID: number;

        /**段位属性*/
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * CrystalConfigM(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CrystalConfigM {
        
        m_iCrystalID: number;

        m_iLevel: number;

        m_iNextLevelID: number;

        m_szCrystalName: string;

        m_iCrystalColor: number;

        m_iCrystalType: number;

        /**是否可以装备*/
        m_ucEquipment: number;

        /**分解能量*/
        m_iDecomPower: number;

        /**升级能量*/
        m_iPower: number;

        /**0显示升级经验*/
        m_iDisplayPower: number;

        /**0属性*/
        m_astAttrList: Array<EquipPropAtt>;

        /**图标ID*/
        m_iIconId: number;

        m_szTips: string;
    }

    /**
    * CrystalExpM(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class CrystalExpM {
        /**0区间ID*/
        m_iIntervalID: number;

        /**0等级区间*/
        m_iLvInterval: number;

        /**0魂池上限*/
        m_iSoulCap: number;
    }

    /**
    * DAILYCONSUMEGiveItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class DAILYCONSUMEGiveItem {
        /**物品ID*/
        m_iID: number;

        /**个数*/
        m_iCount: number;
    }

    /**
    * DWReachM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class DWReachM {
        /**0唯一配置ID*/
        m_iID: number;

        /**0达成条件*/
        m_iCondition: number;

        /**0全服可领取次数*/
        m_iCount: number;

        /**0掉落ID*/
        m_iDropId: number;

        /**0展示图标ID*/
        m_iIconID: number;
    }

    /**
    * DailyConsumeActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class DailyConsumeActCfgM {
        /**0流水号*/
        m_iID: number;

        /**消费额度*/
        m_iCondition1: number;

        /**活动开启第几天领取*/
        m_iCondition2: number;

        /**道具数量*/
        m_iItemCount: number;

        /**总共多少天奖励类型*/
        m_stItemList: Array<DAILYCONSUMEGiveItem>;
    }

    /**
    * DiamondAllBodyMountPropM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class DiamondAllBodyMountPropM {
        /**全身需要同时镶嵌的等级*/
        m_ucLevel: number;

        /**全身强化后的额外属性*/
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * DiamondMountM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class DiamondMountM {
        /**装备部位*/
        m_iEquipPart: number;

        /**属性名*/
        m_ucPropId: Array<number>;
    }

    /**
    * DiamondPropM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class DiamondPropM {
        /**宝石id*/
        m_uiDiamondID: number;

        /**属性名*/
        m_ucPropId: number;

        /**属性值*/
        m_iPropValue: number;

        /**进度值*/
        m_uiProp1process: number;
    }

    /**
    * DisableClass(defined in xml\Scene.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class DisableClass {
        /**场景禁用的道具大类或子类*/
        m_iClass: number;
    }

    /**
    * DressImageConfigM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class DressImageConfigM {
        /**显示类型*/
        m_ucShowType: number;

        /**性别*/
        m_ucGender: number;

        /**职业*/
        m_ucProf: number;

        /**时装形象id*/
        m_uiImageId: number;

        /**0材料ID*/
        m_iConsumeID: number;

        /**此形象可叠加上限*/
        m_uiAddNum: number;

        /**时装模型信息*/
        m_stModel: Array<DressModelInfo>;

        /**时装模型名称, 最大支持8个中文*/
        m_szModelName: string;

        /**此形象可应用的最低等级*/
        m_uiMinLevel: number;

        /**按钮文字, 最大支持8个中文*/
        m_szButtonName: string;

        /**背包图标ID*/
        m_szIconID: number;

        /**是否是限时时装*/
        m_ucTime: number;

        /**附加属性*/
        m_astProp: Array<EquipPropAtt>;

        /**时装描述*/
        m_szDesc: string;

        /**获取途径*/
        m_szSpecDesc: string;

        /**颜色*/
        m_ucColor: number;

        /**强化开启,1开启，0未开启*/
        m_bCanStreng: number;
    }

    /**
    * DressModelInfo(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class DressModelInfo {
        /**0模型id*/
        m_iID: number;

        /**0模型颜色*/
        m_iColor: number;

        /**0激活阶数*/
        m_iGrade: number;
    }

    /**
    * DressQHM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class DressQHM {
        /**0ID*/
        m_iID: number;

        /**0等级*/
        m_iLevel: number;

        /**0材料ID*/
        m_iConsumID: number;

        /**0材料数量*/
        m_iConsumNum: number;

        /**0升阶属性*/
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * DropConfigM(defined in xml\Item.Drop.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class DropConfigM {
        /**掉落方案ID*/
        m_uiDropID: number;

        /**掉落方式*/
        m_ucDropType: number;

        /**是否按职业掉落*/
        m_ucIsDropByProf: number;

        /**掉落物品个数*/
        m_ucDropThingNumber: number;

        m_astDropThing: Array<DropThingM>;
    }

    /**
    * DropThingM(defined in xml\Item.Drop.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class DropThingM {
        
        m_iDropID: number;

        m_uiDropNumber: number;
    }

    /**
    * 动态道具(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class DynamicThingDrop {
        /**0物品ID1*/
        m_iItemID: number;

        /**0境界等级1*/
        m_iLevel: number;
    }

    /**
    * 动态道具(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class DynamicThingM {
        /**0物品ID*/
        m_iID: number;

        /**0类型*/
        m_iType: number;

        /**0判断数量*/
        m_iIfCount: number;

        /**0掉落列表*/
        m_astDropList: Array<DynamicThingDrop>;
    }

    /**
    * EquipAllBodyStrengPropM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipAllBodyStrengPropM {
        /**全身需要同时强化到的等级*/
        m_ucStrengLevel: number;

        /**发光特效*/
        m_iEffectMode: number;

        /**全身强化后的额外属性*/
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * EquipAllColorPropM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipAllColorPropM {
        /**品阶*/
        m_iGrade: number;

        /**颜色*/
        m_iColor: number;

        /**激活数量*/
        m_ucNum: number;

        /**套装时装id*/
        m_iDressID: number;

        /**时装模型*/
        m_iModeId: number;

        /**套装属性*/
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * EquipConfigM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipConfigM {
        /**ID*/
        m_iID: number;

        /**名字*/
        m_szName: string;

        /**装备部位*/
        m_iEquipPart: number;

        /**背包里物品类型*/
        m_iBagClass: number;

        /**堆叠上限*/
        m_ucPileMax: number;

        /**大类*/
        m_iMainClass: number;

        /**子类*/
        m_iSubClass: number;

        /**掉落档次*/
        m_iDropLevel: number;

        /**使用级别下限*/
        m_ucRequiredLevel: number;

        /**阶级*/
        m_ucStage: number;

        /**随机属性*/
        m_iRandProbID: number;

        /**颜色*/
        m_ucColor: number;

        /**职业限制*/
        m_ucProf: number;

        /**性别限制*/
        m_ucGender: number;

        /**绑定类型*/
        m_ucBindType: number;

        /**是否可存入仓库*/
        m_ucIsStore: number;

        /**是否可丢弃*/
        m_ucIsDestroy: number;

        /**强化等级*/
        m_ucQHLv: number;

        /**需要魂力等级*/
        m_ucHunLiLevel: number;

        /**0说明*/
        m_szDesc: string;

        /**基础属性*/
        m_astBaseProp: Array<EquipPropAtt>;

        /**强化属性*/
        m_astProp: Array<EquipPropAtt>;

        /**额外专有属性*/
        m_stExtProp: EquipPropAtt;

        /**材料ID*/
        m_uiConsumableID: number;

        /**材料数量*/
        m_uiConsumableNumber: number;

        /**祝福值上限，达到此值，必然升级*/
        m_uiLucky: number;

        /**熔炼信息值*/
        m_uiMeltInfo: number;

        /**宗门仓库捐赠价格*/
        m_uiGuildSell: number;

        /**宗门仓库兑换价格*/
        m_uiGuildBuy: number;

        /**图标ID*/
        m_szIconID: string;

        /**地表图标ID*/
        m_iGroundIconID: number;

        /**模型ID*/
        m_iModelID: number;

        /**拍卖行一级分类*/
        m_ucAuctionClass1: number;

        /**拍卖行二级分类*/
        m_ucAuctionClass2: number;

        /**拍卖行三级分类*/
        m_ucAuctionClass3: number;

        /**拍卖行是否强制显示，1是显示*/
        m_ucAuctionForceShow: number;

        /**功能类型*/
        m_ucFunctionType: number;

        /**使用技能ID*/
        m_iFunctionID: number;

        /**使用技能对应数值*/
        m_iFunctionValue: number;

        /**特效名称*/
        m_iEffectName: number;

        /**是否取消随机属性*/
        m_ucNoRandProp: number;

        /**武缘套装ID*/
        m_ucWYSuitID: number;

        /**0使用转生下限*/
        m_ucRebirthLevel: number;

        /**0是否可以融合*/
        m_ucIsMerge: number;

        /**特殊描述*/
        m_szSpecDesc: string;

        /**产出*/
        m_szOutput: string;

        /**用途*/
        m_szUse: string;

        /**是否可交易*/
        m_ucIsBusiness: number;

        /**是否可卖店*/
        m_ucIsSellable: number;

        /**卖出价格*/
        m_iSellPrice: number;

        /**卖出价格ID*/
        m_iSellMoneyID: number;

        /**有效期类型*/
        m_ucPersistTimeType: number;

        /**有效期*/
        m_iPersistTime: number;

        /**是否自动使用,0不使用*/
        m_ucIsAutoUse: number;

        /**使用次数*/
        m_iUseTimes: number;

        /**特定目标ID*/
        m_iTargetID: number;

        /**能否批量使用*/
        m_ucCanBatUse: number;

        /**跨服时能否使用*/
        m_ucKFUse: number;
    }

    /**
    * EquipFinalPropM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipFinalPropM {
        /**装备位*/
        m_iEquipPart: number;

        /**消耗材料*/
        m_iConsumID: number;

        /**材料数量*/
        m_iConsumNum: number;

        /**获取途径描述*/
        m_szDesc: string;

        /**跳转功能*/
        m_iFunc: number;

        /**属性*/
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * EquipLQM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipLQM {
        /**0炼器等级*/
        m_iID: number;

        /**0装备部位*/
        m_ucEquipPart: number;

        /**0材料数量*/
        m_iConsumableNumber: number;

        /**0材料ID*/
        m_iConsumableID: number;

        /**0消耗的保护材料数量*/
        m_iNums: number;

        /**0保护材料ID*/
        m_iProtectID: number;

        /**0提升概率*/
        m_usRate: number;

        /**0返还加成材料ID*/
        m_iRestoreID: number;

        /**0返还券加成几率*/
        m_usRestoreProb: number;

        /**0掉级范围起始*/
        m_ucRangeMin: number;

        /**0掉级范围结束*/
        m_ucRangeMax: number;

        /**炼器属性*/
        m_astPropAtt: Array<EquipPropAtt>;

        /**0属性加成百分比(客户端显示用)*/
        m_iAttrAddPercent: number;
    }

    /**
    * EquipPartMap(defined in xml\Common.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipPartMap {
        /**装备位*/
        m_iPartId: number;

        /**对应的等级*/
        m_iPartLevel: number;
    }

    /**
    * EquipPropAtt(defined in xml\Common.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipPropAtt {
        
        m_ucPropId: number;

        m_ucPropValue: number;
    }

    /**
    * EquipSlotLTSBM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipSlotLTSBM {
        /**位置*/
        m_ucID: number;

        /**神宝名字*/
        m_szShowName: string;

        /**消耗类型*/
        m_iItemID: number;

        /**激活道具数量*/
        m_iItemNum: number;

        /**激活所需炼体等级*/
        m_ucUseLevel: number;

        /**属性信息*/
        m_stPropAtt: Array<EquipPropAtt>;
    }

    /**
    * EquipSlotLianTiM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipSlotLianTiM {
        /**等级*/
        m_ucLv: number;

        /**显示阶数*/
        m_szShowStage: string;

        /**装备部位*/
        m_iEquipPart: number;

        /**消耗银两*/
        m_iTongQian: number;

        /**银两次数*/
        m_iTQLimit: number;

        /**消耗绑元*/
        m_iBindYB: number;

        /**绑元次数*/
        m_iBindYBLimit: number;

        /**道具ID*/
        m_iItemID: number;

        /**道具数量*/
        m_iItemNum: number;

        /**祝福值上限*/
        m_iLuck: number;

        /**属性信息*/
        m_stPropAtt: Array<EquipPropAtt>;
    }

    /**
    * EquipSlotStrengthenM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipSlotStrengthenM {
        /**0强化等级*/
        m_iID: number;

        /**0装备位*/
        m_iEquipPart: number;

        /**0消耗道具id*/
        m_uiConsumableID: number;

        /**0消耗数量*/
        m_uiConsumableNumber: number;

        /**祝福值上限，达到此值，必然升级*/
        m_uiLucky: number;

        /**祝福值下限，超过此值，就按概率触发暴击升级*/
        m_uiMinLucky: number;

        /**触发暴击升级的概率基值*/
        m_usRate: number;

        /**强化属性*/
        m_astProp: Array<EquipPropAtt>;
    }

    /**
    * EquipSlotSuitActM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipSlotSuitActM {
        /**套装类型*/
        m_ucType: number;

        /**装备位*/
        m_iEquipPart: number;

        /**消耗类型*/
        m_iConsumID: number;

        /**消耗数量*/
        m_iConsumNum: number;

        /**消耗类型2*/
        m_iConsumID2: number;

        /**消耗数量2*/
        m_iConsumNum2: number;

        /**激活条件*/
        m_iCondType: number;

        /**激活参数*/
        m_iCondValue: number;

        /**属性类型*/
        m_ucPropName: number;

        /**属性值*/
        m_iPropValue: number;
    }

    /**
    * EquipSlotSuitUpAtt(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipSlotSuitUpAtt {
        /**需激活套装装备位数量*/
        m_ucPartNum: number;

        /**激活技能id*/
        m_iSkillID: number;

        /**装备位强化属性*/
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * EquipSlotSuitUpM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipSlotSuitUpM {
        /**套装类型*/
        m_ucType: number;

        /**套装等级*/
        m_ucLv: number;

        /**消耗类型*/
        m_iConsumID: number;

        /**消耗数量*/
        m_iConsumNum: number;

        /**属性信息*/
        m_stUpAtt: Array<EquipSlotSuitUpAtt>;
    }

    /**
    * EquipSlotUpLvM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipSlotUpLvM {
        /**升级等级*/
        m_usLevel: number;

        /**装备位*/
        m_iEquipPart: number;

        /**铜钱消耗数量*/
        m_iConsumableNumber: number;

        /**消耗货币类型*/
        m_iConsumableID: number;

        /**装备位强化属性*/
        m_astPropAtt: Array<EquipPropAtt>;

        /**装备颜色限制*/
        m_ucLimitColor: number;

        /**当前一键升级能到的最高等级,0无限制*/
        m_iOneKeyMaxLv: number;
    }

    /**
    * EquipStageConditionM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipStageConditionM {
        /**0装备部位*/
        m_ucEquipPart: number;

        /**0神装升级条件*/
        m_iLevelUpID1: number;

        /**0超神升级条件*/
        m_iLevelUpID2: number;

        /**0武极升级条件*/
        m_iLevelUpID3: number;

        /**0升级条件*/
        m_iLevelUpID4: number;
    }

    /**
    * EquipUpColorM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipUpColorM {
        /**装备ID*/
        m_iID: number;

        /**升级目标装备*/
        m_iLevelUpID: number;

        /**材料数量*/
        m_iConsumableNumber: number;

        /**材料ID*/
        m_iConsumableID: number;
    }

    /**
    * EquipUpgradeColorM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipUpgradeColorM {
        /**装备ID*/
        m_iEquipID: number;

        /**升级目标装备*/
        m_iLevelUpID: number;

        /**消耗货币类型*/
        m_iCostType: number;

        /**消耗数量*/
        m_iCostNumber: number;

        /**材料数量*/
        m_iConsumableNumber: number;

        /**材料ID*/
        m_iConsumableID: number;

        /**升级属性*/
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * EquipUpgradeLevelM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipUpgradeLevelM {
        /**装备ID*/
        m_iEquipID: number;

        /**升级目标装备*/
        m_iLevelUpID: number;

        /**消耗货币类型*/
        m_iCostType: number;

        /**消耗数量*/
        m_iCostNumber: number;

        /**材料数量*/
        m_iConsumableNumber: number;

        /**材料ID*/
        m_iConsumableID: number;

        /**升级属性*/
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * EquipWishRandomM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipWishRandomM {
        /**装备部位*/
        m_ucEquipPart: number;

        /**附魂等级*/
        m_ucStage: number;

        /**幸运值*/
        m_usLucky: number;

        /**属性类型*/
        m_aucPropName: Array<number>;

        /**概率*/
        m_ausProb: Array<number>;
    }

    /**
    * EquipWishM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class EquipWishM {
        /**0装备部位*/
        m_ucEquipPart: number;

        /**属性类型*/
        m_ucAttrType: number;

        /**洗练星级*/
        m_ucWishLevel: number;

        /**颜色*/
        m_ucColor: number;

        /**洗练属性值*/
        m_iPropValue: number;
    }

    /**
    * 客户端错误码配置(defined in xml\Errno.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ErrnoConfigM {
        /**错误码识别名*/
        m_szName: string;

        /**错误码值*/
        m_uiValue: number;

        /**中文描述*/
        m_szDescriptionZH: string;

        /**英文描述*/
        m_szDescriptionEN: string;

        /**类型*/
        m_ucType: number;
    }

    /**
    * 交换物品(defined in xml\NPC.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class Exchange {
        
        m_iExchangeID: number;

        m_iExchangeValue: number;
    }

    /**
    * 封魔塔(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FMTCfgM {
        /**封魔塔层数*/
        m_iLayer: number;

        /**推荐战力*/
        m_iFightPower: number;

        /**封魔塔每层的boss信息*/
        m_astBossDropList: Array<BossDropInfo>;

        /**野怪掉落方案ID*/
        m_iMonsterDropID: number;

        /**场景ID*/
        m_iSceneID: number;

        /**魂力等级限制*/
        m_iHunliLimit: number;

        /**BigBossID*/
        m_iBigBossId: number;

        /**BigBoss掉落ID*/
        m_iBigBossDropId: number;

        /**BigBoss掉落ID 2*/
        m_iBigBossDropId2: number;

        /**BigBoss场景ID*/
        m_iBigBossSceneID: number;

        /**地宫大boss弹窗等级*/
        m_iBigExhibitionLevel: number;

        /**野外boss魂力等级限制*/
        m_iBigBossHunliLimit: number;
    }

    /**
    * 离线挂机(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FMTGuajiCfgM {
        /**0挂机点ID*/
        m_iID: number;

        /**0等级下限*/
        m_iLevelMin: number;

        /**0等级上限*/
        m_iLevelMax: number;

        /**0怪物编号*/
        m_iMonsterID: number;

        /**0目的地X坐标*/
        m_iPositionX: number;

        /**0目的地Y坐标*/
        m_iPositionY: number;

        /**0场景ID*/
        m_iSceneID: number;
    }

    /**
    * 飞升基础信息(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FSBaseInfo {
        /**原技能索引*/
        m_uiOldSKillIndex: number;

        /**飞升后技能id*/
        m_uiSkillID: number;

        /**飞升后模型id*/
        m_uiModelID: number;
    }

    /**
    * 法宝(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FaBaoCfgM {
        /**0宝物类型*/
        m_iID: number;

        /**0宝物名称*/
        m_szName: string;

        /**0排序*/
        m_iPaixu: number;

        /**0图标*/
        m_iIconID: number;

        /**0模型ID*/
        m_iModelID: number;

        /**0激活物品配置*/
        m_stAccessItemList: Array<AccessItem>;

        /**升级属性*/
        m_astAddedProp: Array<FaBaoLayerAttr>;

        /**0来源*/
        m_szLaiyuan: string;
    }

    /**
    * FaBaoLayerAttr(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FaBaoLayerAttr {
        /**属性*/
        m_ucPropName: number;

        /**属性值*/
        m_iPropValue: number;
    }

    /**
    * 法宝等级(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FaBaoLevelCfgM {
        /**0宝物类型*/
        m_iID: number;

        /**0宝物等级*/
        m_iLevel: number;

        /**0升阶材料ID*/
        m_iConsumableID: number;

        /**0升阶材料数量*/
        m_iConsumableNumber: number;

        /**0激活技能ID*/
        m_iSkillID: number;

        /**升级属性*/
        m_astXiangQian: Array<FaBaoXiangqian>;

        /**升级属性*/
        m_astAddedProp: Array<FaBaoLayerAttr>;
    }

    /**
    * 法宝镶嵌(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FaBaoSkillCfgM {
        /**0需求的宝物数量*/
        m_iCount: number;

        /**0宝物技能ID*/
        m_iSkillID: number;
    }

    /**
    * FaBaoXiangqian(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FaBaoXiangqian {
        /**物品ID*/
        m_iID: number;

        /**物品数量*/
        m_iCount: number;
    }

    /**
    * 法宝镶嵌(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FaBaoXiangqianCfgM {
        /**0宝物类型*/
        m_iID: number;

        /**升级属性*/
        m_astAddedProp: Array<FaBaoLayerAttr>;
    }

    /**
    * 法器(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FaQiCfgM {
        /**0法器类型*/
        m_iID: number;

        /**法器名称*/
        m_szName: string;

        /**0法器等级*/
        m_iFaQiLv: number;

        /**0排序*/
        m_ucSort: number;

        /**0材料数量*/
        m_iConsumableNumber: number;

        /**0材料ID*/
        m_iConsumableID: number;

        /**0特殊 优先消耗 材料ID*/
        m_iSpecialID: number;

        /**0祝福值上限*/
        m_iLuckyUp: number;

        /**0激活材料数量*/
        m_iActNumber: number;

        /**0激活材料ID*/
        m_iActID: number;

        /**0技能ID*/
        m_iSkillID: number;

        /**升级属性*/
        m_astAddedProp: Array<EquipPropAtt>;

        /**0动画模型ID*/
        m_iModelID: number;
    }

    /**
    * 法器注魂(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FaQiZhuHunCfgM {
        /**0法器类型*/
        m_iFaQiID: number;

        /**0法器注魂等级*/
        m_iZhuHunLv: number;

        /**0材料数量*/
        m_iConsumableNumber: number;

        /**0材料ID*/
        m_iConsumableID: number;

        /**0升级上限*/
        m_iLuckyUp: number;

        /**升级属性*/
        m_astProp: Array<EquipPropAtt>;
    }

    /**
    * FaZeConfigM(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FaZeConfigM {
        /**ID*/
        m_iID: number;

        /**0法则类型*/
        m_uiType: number;

        /**法则名称*/
        m_szName: string;

        /**0法则等级*/
        m_ushLevel: number;

        /**0职业*/
        m_ucJob: number;

        /**0技能ID*/
        m_iSkillID: number;

        /**效果数量*/
        m_iEffectNumber: number;

        /**附加技能效果*/
        m_astAddSkillEffect: Array<AddSkillEffects>;

        /**附加属性*/
        m_astProp: Array<EquipPropAtt>;
    }

    /**
    * FaZhenActive(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FaZhenActive {
        /**激活类型*/
        m_ucActiveType: number;

        /**条件值*/
        m_ucActiveKey: number;
    }

    /**
    * FaZhenConfigM(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FaZhenConfigM {
        /**ID*/
        m_iID: number;

        /**法阵名称*/
        m_szName: string;

        /**法阵模型id*/
        m_iModelID: number;

        /**附加属性*/
        m_astProp: Array<EquipPropAtt>;
    }

    /**
    * FaZhenPartConfigM(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FaZhenPartConfigM {
        /**ID*/
        m_iID: number;

        /**0部位*/
        m_uiPart: number;

        /**0激活道具ID*/
        m_iItemID: number;

        /**0数量*/
        m_iItemNum: number;

        /**附加属性*/
        m_astProp: Array<EquipPropAtt>;
    }

    /**
    * FaZhenSkillConfigM(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FaZhenSkillConfigM {
        /**0技能id*/
        m_iSkillID: number;

        /**法阵激活条件*/
        m_astActive: Array<FaZhenActive>;
    }

    /**
    * FengCaiJuBaoActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FengCaiJuBaoActCfgM {
        /**唯一配置ID*/
        m_iID: number;

        /**物品数量*/
        m_iItemCount: number;

        /**奖励物品个数*/
        m_stItemList: Array<FengCaiJuBaoCfgItem>;
    }

    /**
    * FengCaiJuBaoCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FengCaiJuBaoCfgItem {
        /**物品ID*/
        m_iID: number;

        /**一次兑换个数*/
        m_iCount: number;

        /**需要积分个数*/
        m_iNeed: number;

        /**每日限兑次数*/
        m_iMax: number;
    }

    /**
    * 提示引导(defined in xml\SystemParameters.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FightPointGuideConfigM {
        /**0显示顺序*/
        m_ucDisplayOrder: number;

        /**0系统名字*/
        m_szName: string;

        /**0对应关键字*/
        m_iKeyword: number;

        /**0战力提升星级*/
        m_iStarLevel: number;

        /**0文本描述*/
        m_szText: string;

        /**0所需道具*/
        m_stItemList: Array<FightPointGuideItem>;

        /**0跳转*/
        m_iGoto: number;
    }

    /**
    * FightPointGuideItem(defined in xml\SystemParameters.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FightPointGuideItem {
        /**物品ID*/
        m_iId: number;
    }

    /**
    * FlowerRankCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FlowerRankCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iNum: number;
    }

    /**
    * FlowerRankCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FlowerRankCfgM {
        /**唯一配置*/
        m_uiID: number;

        /**排行榜类型*/
        m_ucType: number;

        /**奖励性别*/
        m_cGender: string;

        /**达成标准*/
        m_uiCondition: number;

        /**奖励物品列表*/
        m_stItemList: Array<FlowerRankCfgItem>;
    }

    /**
    * 落日森林BOSS(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ForestBossCfgM {
        /**0ID*/
        m_iID: number;

        /**0开始日期*/
        m_iStartDay: number;

        /**0结束日期*/
        m_iEndDay: number;

        /**0怪物ID*/
        m_MonsterID: number;

        /**0怪物类型*/
        m_iIMonsterType: number;

        /**0掉落*/
        m_iItemID: Array<number>;

        /**0奖励目标职业*/
        m_iProf: Array<number>;
    }

    /**
    * FundGiveItem(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class FundGiveItem {
        /**物品ID*/
        m_iID: number;

        /**个数*/
        m_iCount: number;
    }

    /**
    * GetEquipCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GetEquipCfgM {
        /**装备ID*/
        m_iEquipId: number;

        /**职业*/
        m_iProf: number;

        /**颜色*/
        m_iColor: number;

        /**品阶*/
        m_iGrade: number;

        /**功能跳转*/
        m_iFunction: number;

        /**跳转类型*/
        m_szLine: string;

        /**获取描述*/
        m_szGetDescription: string;
    }

    /**
    * GiftBagConfigM(defined in xml\Item.Drop.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GiftBagConfigM {
        /**礼包类型*/
        m_ucGiftType: number;

        /**领取礼包参数*/
        m_iParameter: number;

        /**礼包中物品个数*/
        m_ucGiftThingNumber: number;

        m_astGiftThing: Array<GiftItemInfo>;

        /**礼包价值描述*/
        m_iGiftValue: number;

        /**额外礼包触发类型*/
        m_ucExtraGiftType: number;

        /**额外礼包触发值*/
        m_ucExtraGiftValue: number;

        /**额外物品列表*/
        m_astExtraGift: Array<GiftItemInfo>;
    }

    /**
    * GiftItemInfo(defined in xml\Common.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GiftItemInfo {
        /**附件物品ID*/
        m_iThingID: number;

        /**附件物品数量*/
        m_iThingNumber: number;
    }

    /**
    * GroupBuyCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GroupBuyCfgM {
        /**流水号*/
        m_uiId: number;

        /**开服第几天*/
        m_ucDay: number;

        /**出售的物品ID*/
        m_uiItemID: number;

        /**单组出售数量*/
        m_ucItemCount: number;

        /**团购的期数*/
        m_ucBuyType: number;

        /**原价*/
        m_usPrimaryPrice: number;

        /**现价*/
        m_usBuyPrice: number;

        /**全服库存数量*/
        m_usStockCount: number;

        /**系统最大购买数*/
        m_usSysBuyCount: number;

        /**个人每日限购数量*/
        m_usBuyCount: number;

        /**各阶段折扣信息*/
        m_astSaleOffInfo: Array<SaleOffInfoM>;
    }

    /**
    * GroupPinLevelDropCfgM(defined in xml\Pinstance.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GroupPinLevelDropCfgM {
        /**0排序*/
        m_iOrderID: number;

        /**副本ID*/
        m_iPinstanceID: number;

        /**0玩家等级*/
        m_iLevel: number;

        /**0掉落id*/
        m_stDropList: Array<GroupPinLevelDropID>;

        /**0展示奖励*/
        m_stShowList: Array<GroupPinLevelDropShow>;
    }

    /**
    * GroupPinLevelDropID(defined in xml\Pinstance.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GroupPinLevelDropID {
        /**展示奖励*/
        m_iID: number;
    }

    /**
    * GroupPinLevelDropShow(defined in xml\Pinstance.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GroupPinLevelDropShow {
        /**展示奖励*/
        m_iID: number;

        /**奖励数量*/
        m_iNum: number;
    }

    /**
    * 指引Tip配置(defined in xml\Resources.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GuideTipConfigM {
        /**列表内容 最大128个字*/
        m_szContent: string;
    }

    /**
    * 客户端家族等级配置(defined in xml\GuildArea.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GuildLevelM {
        /**0家族等级*/
        m_uchGuildLv: number;

        /**0人数上限*/
        m_uchMan: number;

        /**0升级经验*/
        m_uiXP: number;

        /**0每日宝箱*/
        m_uiDayBX: number;

        /**0每日宝箱消耗*/
        m_uiDayCost: number;

        /**0等级宝箱*/
        m_uiLvBX: number;

        /**0等级宝箱消耗*/
        m_uiLBCost: number;

        /**0帮派buff*/
        m_uiLvBuff: number;
    }

    /**
    * 宗门资金排名奖励(defined in xml\GuildArea.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GuildMoneyRankM {
        /**0名次*/
        m_iRanking: number;

        /**0绑元奖励*/
        m_iAcer: number;

        /**0宗主奖励*/
        m_iLeaderAward: number;

        /**0宗主永久称号*/
        m_iBigAward: number;
    }

    /**
    * 宗派拍卖(defined in xml\GuildArea.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GuildPaiMaiCfgItem {
        /**0物品1ID*/
        m_iID: number;

        /**0每组个数*/
        m_iCountPerSets: number;

        /**0组数*/
        m_iSetsCount: number;

        /**0一口价*/
        m_iMaxPrice: number;
    }

    /**
    * 宗派拍卖(defined in xml\GuildArea.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GuildPaiMaiCfgM {
        /**0活动ID*/
        m_iActID: number;

        /**0第X周*/
        m_iWeek: number;

        /**0排名*/
        m_iRank: number;

        /**0功能ID*/
        m_iFunID: number;

        /**0事件ID*/
        m_iEventID: number;

        /**0物品ID数*/
        m_iItemCount: number;

        /**0物品*/
        m_stItemList: Array<GuildPaiMaiCfgItem>;
    }

    /**
    * 宗派寻宝奖励(defined in xml\GuildArea.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GuildTreasureHuntBonus {
        /**奖励类型*/
        m_uiType: number;

        /**奖励数量*/
        m_uiCount: number;
    }

    /**
    * 宗派寻宝捐赠事件(defined in xml\GuildArea.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GuildTreasureHuntDonationCost {
        /**捐赠数量*/
        m_uiNum: number;

        /**消耗体力数*/
        m_uiCost: number;
    }

    /**
    * 客户端宗派寻宝事件(defined in xml\GuildArea.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GuildTreasureHuntEventM {
        /**事件ID*/
        m_iID: number;

        /**类型*/
        m_uiType: number;

        /**名称*/
        m_szName: string;

        /**难度*/
        m_uiDifficulty: number;

        /**目标*/
        m_uiTarget: number;

        /**目标数量*/
        m_uiTargetNum: number;

        /**捐赠*/
        m_astDonation: Array<GuildTreasureHuntDonationCost>;

        /**选择描述1*/
        m_szSelectDes1: string;

        /**选择描述2*/
        m_szSelectDes2: string;
    }

    /**
    * 宗派寻宝节点(defined in xml\GuildArea.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GuildTreasureHuntPoint {
        /**序号*/
        m_uiNum: number;

        /**类型*/
        m_uiType: number;

        /**时间*/
        m_iTime: number;

        /**权重*/
        m_uiWeight: number;
    }

    /**
    * 客户端宗派寻宝流程控制(defined in xml\GuildArea.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GuildTreasureHuntProcessM {
        /**流程ID*/
        m_iID: number;

        /**难度*/
        m_uiDifficluty: number;

        /**名称*/
        m_szName: string;

        /**奖励*/
        m_astBonus: Array<GuildTreasureHuntBonus>;

        /**特殊奖励类型*/
        m_uiSBonusType: number;

        /**特殊奖励数量*/
        m_uiSBonusNum: number;

        /**节点个数*/
        m_uiPointCount: number;

        /**节点*/
        m_astPoint: Array<GuildTreasureHuntPoint>;

        /**开启等级*/
        m_iOpenLevel: number;

        /**开启消耗物品ID*/
        m_iOpenCostID: number;

        /**开启消耗物品数量*/
        m_iOpenCostNum: number;
    }

    /**
    * 宗门资金排名奖励(defined in xml\GuildArea.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class GuildZZHCBossM {
        /**0神兽等级*/
        m_iLevel: number;

        /**0本级消耗精魄*/
        m_iExpend: number;

        /**0buffid*/
        m_iBuffId: number;

        /**0Monster*/
        m_iMonsterId: number;
    }

    /**
    * HFBXYLDropCfgM(defined in xml\MergeActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HFBXYLDropCfgM {
        /**0唯一ID*/
        m_iID: number;

        /**0物品ID*/
        m_iItemID: number;

        /**0掉落物概率*/
        m_iDropProb: number;

        /**0物品数量*/
        m_iItemCount: number;

        /**0保护值*/
        m_iLowerLimit: number;
    }

    /**
    * HFBXYLShopCfgM(defined in xml\MergeActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HFBXYLShopCfgM {
        /**0道具ID*/
        m_iID: number;

        /**0道具数量*/
        m_iCount: number;

        /**0价格*/
        m_iPrice: number;
    }

    /**
    * HFCWCaiLiaoItem(defined in xml\MergeActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HFCWCaiLiaoItem {
        /**材料ID*/
        m_uiCaiLiaoID: number;

        /**材料个数*/
        m_uiCaiLiaoCount: number;
    }

    /**
    * HFCWJiangLiItem(defined in xml\MergeActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HFCWJiangLiItem {
        /**奖励ID*/
        m_uiJiangLiID: number;

        /**奖励个数*/
        m_uiJiangLiCount: number;
    }

    /**
    * HFCollectWordActCfgM(defined in xml\MergeActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HFCollectWordActCfgM {
        /**唯一配置*/
        m_iID: number;

        /**最大可兑换次数*/
        m_uiTime: number;

        /**兑换奖励物品个数*/
        m_stCaiLiaoList: Array<HFCWCaiLiaoItem>;

        /**奖励物品个数*/
        m_stJiangLiList: Array<HFCWJiangLiItem>;
    }

    /**
    * HFLJCZCfgM(defined in xml\MergeActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HFLJCZCfgM {
        /**0天数*/
        m_iID: number;

        /**0充值额度*/
        m_uiRechargeLimit: number;

        /**限制ID*/
        m_uiDropID: number;
    }

    /**
    * HFLJXFCfgM(defined in xml\MergeActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HFLJXFCfgM {
        /**0天数*/
        m_iID: number;

        /**0消费额度*/
        m_uiConsumeLimit: number;

        /**限制ID*/
        m_uiDropID: number;
    }

    /**
    * HFSevenSignActCfgM(defined in xml\MergeActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HFSevenSignActCfgM {
        /**唯一配置. 天数*/
        m_iID: number;

        /**道具数量*/
        m_uiItemCount: number;

        /**道具信息*/
        m_stItemList: Array<SevenSignItem>;
    }

    /**
    * HFZhaoCaiMaoCfgM(defined in xml\MergeActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HFZhaoCaiMaoCfgM {
        /**0唯一配置ID*/
        m_iID: number;

        /**0条件1*/
        m_iCondition1: number;

        /**0条件2*/
        m_iCondition2: number;

        /**物品数量下限*/
        m_iMin: number;

        /**物品数量上限*/
        m_iMax: number;
    }

    /**
    * HLFPActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HLFPActCfgM {
        /**同色类型（1-5）,6为杂色，1为最好*/
        m_ucType: number;

        /**对应同色的掉落方案id*/
        m_iDropID: number;

        /**图标名称*/
        m_szItemIcon: string;

        /**礼包名称*/
        m_szIconName: string;
    }

    /**
    * HLZPActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HLZPActCfgM {
        /**ID*/
        m_iID: number;

        /**0位置*/
        m_ucPosition: number;

        /**0物品1ID*/
        m_iItem1ID: number;

        /**0物品1数量*/
        m_iItem1Count: number;
    }

    /**
    * HYDAccumulateCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HYDAccumulateCfgM {
        /**唯一配置ID*/
        m_ucID: number;

        /**关键字,对应的积累类型*/
        m_ucType: number;

        /**当前类型下，对应的索引（副本是副本id，任务是任务类型，物品是物品id)*/
        m_uiTypeIndex: number;

        /**排序ID*/
        m_ucOrderID: number;

        /**页签类型*/
        m_uiPageType: number;

        /**标题说明*/
        m_szTitle: string;

        /**主要产出说明*/
        m_szRewardDesc: string;

        /**对应的功能ID*/
        m_iFuncID: number;

        /**对应的功能等级ID*/
        m_iFuncIDLevel: number;

        /**对应的活动ID*/
        m_iActID: number;

        /**是否推荐*/
        m_iIsBest: number;

        /**参与条件*/
        m_szJoinDesc: string;

        /**活动说明*/
        m_szRuleDesc: string;

        /**完成标准,副本、物品是对应的次数，物品是数量，时间是单位秒。根据各类型，有不同的含义*/
        m_uiTimes: number;

        /**奖励的活跃度*/
        m_ucGiveActNum: number;

        /**奖励的物品列表*/
        m_stRewardList: Array<HYDRewardInfo>;

        /**显示用的物品列表*/
        m_stShowList: Array<HYDRewardInfo>;

        /**继续参加*/
        m_bTakePart: number;

        /**是否需要红点*/
        m_bIsRedDot: number;
    }

    /**
    * HYDDailyRewardCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HYDDailyRewardCfgM {
        /**唯一配置ID*/
        m_ucID: number;

        /**当天已积累的活跃度*/
        m_uiActNum: number;

        /**奖励的物品列表*/
        m_stRewardList: Array<HYDRewardInfo>;
    }

    /**
    * HYDRewardInfo(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HYDRewardInfo {
        /**当前活跃度能领取的奖励物品id*/
        m_uiThingId: number;

        /**当前活跃度能领取的奖励物品数量*/
        m_uiThingNum: number;
    }

    /**
    * HYDTotalRewardCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HYDTotalRewardCfgM {
        /**唯一配置ID*/
        m_ucID: number;

        /**达到的活跃度总值*/
        m_ucTotalNum: number;

        /**本阶奖励的属性ID，不累加*/
        m_ucPropId: number;

        /**本阶奖励的属性数量，不累加*/
        m_iPropValue: number;
    }

    /**
    * HiPointConfigConfigM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HiPointConfigConfigM {
        /**0流水号ID*/
        m_iID: number;

        /**0达到的额度*/
        m_icCondition: number;

        /**0品数量*/
        m_iItemCount: number;

        /**0奖励列表*/
        m_stRewordList: Array<AllPeopleHiCfgItem>;
    }

    /**
    * HistoricalRemainsCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HistoricalRemainsCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * HistoricalRemainsCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HistoricalRemainsCfgM {
        /**唯一配置ID*/
        m_iID: number;

        /**0层数*/
        m_iStage: number;

        /**等级条件*/
        m_iLimitLv: number;

        /**显示图标*/
        m_iIcon: number;

        /**类型*/
        m_iType: number;

        /**物品数量*/
        m_iItemCount: number;

        /**奖励物品个数*/
        m_stItemList: Array<HistoricalRemainsCfgItem>;

        /**通关价格*/
        m_iPrice: number;

        /**重置到位置0的价格*/
        m_iResetPrice: number;

        /**层礼包*/
        m_iLayerGift: number;
    }

    /**
    * BOSS之家消耗(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HomeBossCostCfgM {
        /**0副本层数*/
        m_iFloor: number;

        /**0消耗货币价格*/
        m_iPrice: number;

        /**0门票ID*/
        m_iTicketID: number;

        /**0门票数量*/
        m_iTicketNum: number;

        /**0门票数量*/
        m_uiTicketTime: number;
    }

    /**
    * 红颜属性丹配置(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HongYanDrugConfigM {
        /**0等级*/
        m_iID: number;

        /**0类型*/
        m_ucType: number;

        /**0开启技能ID*/
        m_iItemID: number;

        /**0材料1ID*/
        m_iLevelMax: number;

        /**属性*/
        m_astAttrList: Array<BeautyPropAtt>;
    }

    /**
    * 红颜缘分配置(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HongYanFateConfigM {
        /**0红颜ID*/
        m_iID: number;

        /**0缘分类型*/
        m_ucFateType: number;

        /**0缘分等级*/
        m_iLevel: number;

        /**0条件*/
        m_iCondition: number;

        /**0条件值*/
        m_iConditionValue: number;

        /**技能ID*/
        m_uiSkillID: number;

        /**属性*/
        m_astAttrList: Array<BeautyFatePropAtt>;
    }

    /**
    * 武缘聚魂(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HongYanJuShenConfigM {
        /**0武缘ID*/
        m_iID: number;

        /**0武缘聚魂等级*/
        m_iJuHunLv: number;

        /**0所需武缘等级下限*/
        m_iLimitStage: number;

        /**0材料数量*/
        m_iConsumableNumber: number;

        /**0材料ID*/
        m_iConsumableID: number;

        /**0材料2数量*/
        m_iConsumNum2: number;

        /**0材料2ID*/
        m_iConsumID2: number;

        /**0飞升材料数量*/
        m_iFSConsumNum: number;

        /**0飞升材料ID*/
        m_iFSConsumID: number;

        /**0升级上限*/
        m_iLuckyUp: number;

        /**升级属性*/
        m_astProp: Array<BeautyPropAtt>;
    }

    /**
    * 红颜系统装备对应表(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HongyanEquipMapM {
        /**0等级*/
        m_iID: number;

        /**对应数组*/
        m_astEquipPartList: Array<EquipPartMap>;
    }

    /**
    * HunGuCreateMaterial(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuCreateMaterial {
        /**0质量*/
        m_iQuality: number;

        /**0颜色*/
        m_iColour: number;

        /**0加成*/
        m_iAddition: number;
    }

    /**
    * HunGuCreateM(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuCreateM {
        /**ID*/
        m_iID: number;

        /**0成品穿戴部位*/
        m_ucEquipPart: number;

        /**0成品年代*/
        m_ucTargetQuality: number;

        /**0成品颜色*/
        m_ucTargetColour: number;

        /**0特殊材料ID*/
        m_iConsumableID: number;

        /**0特殊材料所需数量*/
        m_iConsumableNumber: number;

        /**属性类型*/
        m_stMaterial: Array<HunGuCreateMaterial>;

        /**0默认成功率*/
        m_iSuccessRate: number;
    }

    /**
    * HunGuEquipColorCount(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuEquipColorCount {
        /**颜色*/
        m_ucColor: number;

        m_ucNumber: number;
    }

    /**
    * HunGuEquipRandPropAtt(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuEquipRandPropAtt {
        
        m_ucPropId: number;

        m_iPropValueMin: number;

        m_iPropValueMax: number;

        /**概率,万分比*/
        m_iGaiLv: number;

        /**颜色*/
        m_ucColor: number;
    }

    /**
    * HunGuEquipRandPropM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuEquipRandPropM {
        /**唯一id*/
        m_iID: number;

        /**装备部位*/
        m_iEquipPart: number;

        /**等级*/
        m_iLevel: number;

        /**随机类型*/
        m_ucRandomType: number;

        /**属性条目数量*/
        m_iCount: number;

        /**属性条数*/
        m_astCount: Array<HunGuEquipColorCount>;

        /**最大随机属性条数*/
        m_astRandPropAtt: Array<HunGuEquipRandPropAtt>;
    }

    /**
    * HunGuEquipUpLvCost(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuEquipUpLvCost {
        /**物品ID*/
        m_iItemID: number;

        /**消耗数量*/
        m_iNumber: number;
    }

    /**
    * HunGuFZAbility(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuFZAbility {
        /**类型*/
        m_ucPropId: number;

        /**数值*/
        m_iPropValue: number;
    }

    /**
    * 魂骨封装客户端配置(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuFZConfigM {
        /**装备部位*/
        m_iEquipPart: number;

        /**掉落档次*/
        m_iDropLevel: number;

        /**消耗物品ID*/
        m_iItemID: number;

        /**消耗物品数量*/
        m_iItemNumber: number;

        /**获得属性*/
        m_astProp: Array<HunGuFZAbility>;
    }

    /**
    * HunGuMergeMaterial(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuMergeMaterial {
        /**0质量*/
        m_iQuality: number;

        /**0颜色*/
        m_iColour: number;

        /**0加成*/
        m_iAddition: number;
    }

    /**
    * HunGuMergeM(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuMergeM {
        /**ID*/
        m_iID: number;

        /**0成品穿戴部位*/
        m_ucEquipPart: number;

        /**0成品年代*/
        m_ucTargetQuality: number;

        /**0成品颜色*/
        m_ucTargetColour: number;

        /**0特殊材料ID*/
        m_iConsumableID: number;

        /**0特殊材料所需数量*/
        m_iConsumableNumber: number;

        /**属性类型*/
        m_stMaterial: Array<HunGuMergeMaterial>;

        /**0默认成功率*/
        m_iSuccessRate: number;
    }

    /**
    * 魂骨封装客户端配置(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuSkillFZConfigM {
        /**装备部位*/
        m_iEquipPart: number;

        /**掉落档次*/
        m_iDropLevel: number;

        /**消耗物品列表*/
        m_stCostItemList: Array<HunGuSkillFZItem>;

        /**技能等级*/
        m_iSkillLevel: number;

        /**获得属性*/
        m_astProp: Array<HunGuFZAbility>;
    }

    /**
    * HunGuSkillFZItem(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuSkillFZItem {
        /**消耗物品ID*/
        m_iItemID: number;

        /**消耗物品数量*/
        m_iItemNumber: number;
    }

    /**
    * HunGuSlotStrengthenM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuSlotStrengthenM {
        /**0强化等级*/
        m_iID: number;

        /**0装备位*/
        m_iEquipPart: number;

        /**0消耗道具id*/
        m_uiConsumableID: number;

        /**0消耗数量*/
        m_uiConsumableNumber: number;

        /**祝福值上限，达到此值，必然升级*/
        m_uiLucky: number;

        /**祝福值下限，超过此值，就按概率触发暴击升级*/
        m_uiMinLucky: number;

        /**触发暴击升级的概率基值*/
        m_usRate: number;

        /**强化属性*/
        m_astProp: Array<EquipPropAtt>;
    }

    /**
    * HunGuSlotUpLvM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuSlotUpLvM {
        /**升级等级*/
        m_usLevel: number;

        /**装备位*/
        m_iEquipPart: number;

        /**装备强化消耗*/
        m_astCost: Array<HunGuEquipUpLvCost>;

        /**装备位强化属性*/
        m_astPropAtt: Array<EquipPropAtt>;

        /**装备等级限制*/
        m_ucLimitDropLevel: number;

        /**当前一键升级能到的最高等级,0无限制*/
        m_iOneKeyMaxLv: number;
    }

    /**
    * HunGuTZAbility(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuTZAbility {
        /**类型*/
        m_ucPropId: number;

        /**数值*/
        m_iPropValue: number;
    }

    /**
    * 魂骨套装客户端配置(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuTZConfigM {
        /**ID*/
        m_iID: number;

        m_szName: string;

        /**掉落档次*/
        m_iDropLevel: number;

        /**套装需要件数*/
        m_iNumber: number;

        /**获得属性*/
        m_astProp: Array<HunGuTZAbility>;
    }

    /**
    * HunGuWashRandomM(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuWashRandomM {
        /**装备部位*/
        m_ucEquipPart: number;

        /**附魂等级*/
        m_ucLevel: number;

        /**幸运值*/
        m_usLucky: number;

        /**属性类型*/
        m_aucPropName: Array<number>;

        /**概率*/
        m_ausProb: Array<number>;
    }

    /**
    * HunGuWashM(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunGuWashM {
        /**0装备部位*/
        m_ucEquipPart: number;

        /**属性类型*/
        m_ucAttrType: number;

        /**洗练星级*/
        m_ucWishLevel: number;

        /**颜色*/
        m_ucColor: number;

        /**洗练属性值*/
        m_iPropValue: number;
    }

    /**
    * 魂环客户端配置(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunHuanConfigM {
        /**魂环ID*/
        m_iID: number;

        m_szName: string;

        /**需求魂力等级*/
        m_iRequireHunLiLevel: number;

        /**消耗物品ID*/
        m_iConsumeID: number;

        /**消耗物品数量*/
        m_iConsumeNumber: number;

        /**激活最大进度*/
        m_iConditionValue: number;

        /**激活条件连接*/
        m_iConditionLink: number;

        /**模型ID*/
        m_iModelID: number;

        /**获得属性*/
        m_astProp: Array<HunLiAbility>;

        /**对应BossID*/
        m_iBossID: number;
    }

    /**
    * HunHuanLevelProp(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunHuanLevelProp {
        /**类型*/
        m_ucPropId: number;

        /**数值*/
        m_iPropValue: number;
    }

    /**
    * 魂环晋升客户端配置(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunHuanLevelUpConfigM {
        /**ID*/
        m_iID: number;

        m_szName: string;

        /**等级*/
        m_iLevel: number;

        /**花费*/
        m_iCost: number;

        /**获得属性*/
        m_astProp: Array<HunHuanLevelProp>;
    }

    /**
    * HunLiAbility(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunLiAbility {
        /**类型*/
        m_ucPropId: number;

        /**数值*/
        m_iPropValue: number;
    }

    /**
    * HunLiConditionClient(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunLiConditionClient {
        /**0附加条件类型*/
        m_ucType: number;

        /**0附加条件值1*/
        m_iValue1: number;

        /**0附加条件值2*/
        m_iValue2: number;

        /**0附加条件值3*/
        m_iValue3: number;

        /**0奖励ID*/
        m_iRewardID: number;

        /**0奖励数量*/
        m_iRewardNum: number;

        /**跳转链接*/
        m_iLink: number;
    }

    /**
    * 魂力客户端配置(defined in xml\Birth.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class HunLiConfigM {
        /**魂力等级*/
        m_ucLevel: number;

        /**魂力子等级*/
        m_ucStage: number;

        /**需求等级*/
        m_iRequireLevel: number;

        m_szName: string;

        /**激活功能*/
        m_iActivieFuntion: number;

        /**0武魂模型*/
        m_iModel: number;

        /**条件列表*/
        m_astConditionList: Array<HunLiConditionClient>;

        /**获得属性*/
        m_astProp: Array<HunLiAbility>;

        m_szDesc1: string;

        m_szDesc2: string;

        m_szDesc3: string;

        m_szDesc4: string;
    }

    /**
    * IOS打包(defined in xml\Dabao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class IOSDabaoM {
        /**GameID*/
        m_iGameID: number;

        /**PlatlID*/
        m_iPlatlID: number;

        /**BaseUrl*/
        m_szBaseUrl: string;

        /**Ipfmt*/
        m_szIpfmt: string;

        /**Ips*/
        m_szIps: string;

        /**ChannelTag*/
        m_szChannelTag: string;
    }

    /**
    * IOS推送配置(defined in xml\Resources.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class IOSPushMsgConfigM {
        /**0序号*/
        m_iId: number;

        /**0时间*/
        m_iHour: number;

        /**0分*/
        m_iMinute: number;

        /**0标题*/
        m_szTitle: string;

        /**0内容*/
        m_szContent: string;
    }

    /**
    * ItemBuyGuildDesc(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ItemBuyGuildDesc {
        /**0说明*/
        m_szName: string;

        /**0途径*/
        m_uiSys: number;

        /**0页签*/
        m_uiTitle: number;
    }

    /**
    * ItemBuyGuildM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ItemBuyGuildM {
        /**0物品ID*/
        m_iID: number;

        /**0引导*/
        m_astDesc: Array<ItemBuyGuildDesc>;
    }

    /**
    * ItemMergeM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ItemMergeM {
        /**配置唯一ID*/
        m_iID: number;

        /**合成物品ID*/
        m_iProductId: number;

        m_astSuffData: Array<OneSuffData>;

        /**页签大类*/
        m_iMainClass: number;

        /**功能页签*/
        m_iClass: number;

        /**合成的等级限制*/
        m_iLevelLimit: number;

        /**排序*/
        m_iArray: number;
    }

    /**
    * JJCRankRewardConfigM(defined in xml\JJCRankReward.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JJCRankRewardConfigM {
        /**唯一标识*/
        m_iID: number;

        /**排行下限*/
        m_iPaiHangMin: number;

        /**排行上限*/
        m_iPaiHangMax: number;

        /**奖励掉落方案*/
        m_iDropID: number;

        /**0获得的称号ID*/
        m_iChenghaoID: number;
    }

    /**
    * JJRCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JJRCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * JJRRewardConfigM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JJRRewardConfigM {
        /**唯一配置ID*/
        m_iID: number;

        /**类别*/
        m_ucMainType: number;

        /**条件1*/
        m_iCondition1: number;

        m_szTips: string;

        /**物品总数*/
        m_iItemCount: number;

        /**奖励物品个数*/
        m_stItemList: Array<JJRCfgItem>;
    }

    /**
    * JJRTimeConfigM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JJRTimeConfigM {
        
        m_iID: number;

        /**自然日*/
        m_ucDate: number;

        /**活动1*/
        m_ucAct1: number;

        /**活动2*/
        m_ucAct2: number;

        /**活动3*/
        m_ucAct3: number;

        /**活动4*/
        m_ucAct4: number;

        /**活动5*/
        m_ucAct5: number;
    }

    /**
    * JPDDHActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JPDDHActCfgM {
        /**唯一配置*/
        m_uiID: number;

        /**类型*/
        m_ucExchangeType: number;

        /**兑换物品个数*/
        m_stCostItemList: Array<JPDDHItem>;

        /**奖励物品个数*/
        m_stItemList: Array<JPDDHItem>;
    }

    /**
    * JPDDHItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JPDDHItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * JSTZCfgItem(defined in xml\TianDiJingJi.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JSTZCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * JSTZRankM(defined in xml\TianDiJingJi.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JSTZRankM {
        /**0唯一配置ID*/
        m_iID: number;

        /**0开服天数*/
        m_iDay: number;

        /**0条件1*/
        m_iCondition1: number;

        /**0条件2*/
        m_iCondition2: number;

        /**0物品总数*/
        m_iItemCount: number;

        /**物品列表*/
        m_stItemList: Array<JSTZCfgItem>;

        /**0称号档次*/
        m_uiClass: number;

        /**极限挑战称号属性*/
        m_astAttrList: Array<TianDiPropAtt>;
    }

    /**
    * JSTZM(defined in xml\TianDiJingJi.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JSTZM {
        /**0唯一配置ID*/
        m_iID: number;

        /**0物品总数*/
        m_iItemCount: number;

        /**物品列表*/
        m_stItemList: Array<JSTZCfgItem>;

        /**0怪物ID*/
        m_iMonsterID: number;

        /**0X偏移值*/
        m_iX: number;

        /**0Y偏移值*/
        m_iY: number;

        /**0BOSS攻略*/
        m_iSXY: number;

        /**0BOSS攻略*/
        m_szTip: string;
    }

    /**
    * JUHSAGiveItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JUHSAGiveItem {
        /**物品ID*/
        m_iID: number;

        /**个数*/
        m_iCount: number;
    }

    /**
    * JUHSActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JUHSActCfgM {
        /**0流水号*/
        m_iID: number;

        /**0特权标题*/
        m_szTitle: string;

        /**0购买需求的元宝*/
        m_iPrice: number;

        /**0投资说明*/
        m_iShuoMing: string;

        /**0可领取的天数*/
        m_iGiveDays: number;

        /**0购买的按钮tips*/
        m_szKeyTips: string;

        /**总共多少天奖励类型*/
        m_stItemList: Array<JUHSAGiveItem>;
    }

    /**
    * JiuXingConfigM(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JiuXingConfigM {
        
        m_iID: number;

        /**0材料ID*/
        m_iConsumableID: number;

        /**0万能进阶丹*/
        m_iUniversalItem: number;

        /**0材料数量*/
        m_iConsumableNumber: number;

        /**0祝福值上限*/
        m_uiLuckUp: number;

        /**0开启技能ID*/
        m_uiSkillID: number;

        /**0升阶属性名*/
        m_astAttr: Array<JiuXingPropAttr>;
    }

    /**
    * JiuXingPropAttr(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JiuXingPropAttr {
        /**属性*/
        m_iPropName: number;

        /**属性值*/
        m_iPropValue: number;
    }

    /**
    * JuYuanAttr(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JuYuanAttr {
        /**加成属性类型*/
        m_iPropType: number;

        /**激活阶数*/
        m_iPropCondition: number;

        /**加成属性ID*/
        m_iPropAttrID: number;

        /**浮窗名字*/
        m_iPropName: number;
    }

    /**
    * 聚元系统属性表(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JuYuanAttrCfgM {
        /**0ID*/
        m_iID: number;

        /**0升阶属性名*/
        m_astAttr: Array<JuYuanPropAttr>;
    }

    /**
    * JuYuanBlissAttr(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JuYuanBlissAttr {
        /**属性*/
        m_iBlissName: number;

        /**属性值*/
        m_iBlissValue: number;

        /**子系统开启等级*/
        m_iBlissLevel: number;
    }

    /**
    * 聚元系统(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JuYuanCfgM {
        /**0ID*/
        m_iID: number;

        /**0类型*/
        m_iType: number;

        /**0等级*/
        m_iLevel: number;

        /**0名称*/
        m_ucName: string;

        /**0道具ID*/
        m_iItemId: number;

        /**0道具数量*/
        m_iCount: number;

        /**0激活称号ID*/
        m_iTitle: number;

        /**0基础属性ID*/
        m_iAttrID: number;

        /**0挑战副本ID*/
        m_iPinstanceID: number;

        /**0激活模型*/
        m_iModelId: number;

        /**0祝福系统类型*/
        m_astBliss: Array<JuYuanBlissAttr>;

        /**0加成属性类型*/
        m_astAddAttrs: Array<JuYuanAttr>;

        /**0突破条件大类型*/
        m_astCondition: Array<JuYuanCondition>;
    }

    /**
    * JuYuanCondition(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JuYuanCondition {
        /**条件类型*/
        m_iType: number;

        /**子条件*/
        m_iCondition: number;

        /**条件数量*/
        m_iNumber: number;

        /**条件对应的值*/
        m_iConditionVal: number;
    }

    /**
    * JuYuanPropAttr(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class JuYuanPropAttr {
        /**属性*/
        m_iPropName: number;

        /**属性值*/
        m_iPropValue: number;
    }

    /**
    * KFJBTZCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class KFJBTZCfgM {
        /**配置ID*/
        m_iID: number;

        /**0物品ID*/
        m_iItemID: number;

        /**0获取条件描述*/
        m_szDesc: string;
    }

    /**
    * 跨服决斗场(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class KFJDCCfgGift {
        /**0ID*/
        m_iID: number;

        /**0数量*/
        m_iCount: number;
    }

    /**
    * 跨服决斗场(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class KFJDCCfgM {
        /**0奖励类型*/
        m_iType: number;

        /**0名次*/
        m_iPaiming: number;

        /**0物品ID*/
        m_stGiftList: Array<KFJDCCfgGift>;

        /**0注释*/
        m_szTips: string;
    }

    /**
    * 跨服决斗场决赛(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class KFJDCFinalCfgM {
        /**0比赛轮次*/
        m_iRound: number;

        /**0胜利奖*/
        m_iWinReward: number;

        /**0失败奖*/
        m_iLostReward: number;

        /**0奖池基础奖金数量*/
        m_iPoolBaseRewardNum: number;
    }

    /**
    * KFLJCZCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class KFLJCZCfgM {
        /**0天数*/
        m_iID: number;

        /**0类型*/
        m_iType: number;

        /**0充值额度*/
        m_uiRechargeLimit: number;

        /**0掉落物档次*/
        m_ucLevel: number;

        /**限制ID*/
        m_uiDropID: number;
    }

    /**
    * KFLuckyCatActM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class KFLuckyCatActM {
        /**唯一配置ID*/
        m_ucID: number;

        /**开始天数*/
        m_iStartDay: number;

        /**结束天数*/
        m_iEndDay: number;

        /**消耗*/
        m_usConsumeNum: number;

        /**倍数*/
        m_ucMultiple: number;

        /**是否记录*/
        m_ucIsNotice: number;

        /**vip等级限制*/
        m_uiVipLvel: number;
    }

    /**
    * KFMRMBCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class KFMRMBCfgM {
        /**0唯一配置ID*/
        m_iID: number;

        /**0开启日期*/
        m_ucDay: number;

        /**0当天目标id*/
        m_ucType: number;

        /**0关联成就id*/
        m_uiNeedAch: number;

        /**0物品总数*/
        m_iItemCount: number;

        /**物品列表*/
        m_stItemList: Array<TwoIntElement>;

        /**0跳转功能ID*/
        m_iFunction: number;
    }

    /**
    * KFQMCBCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class KFQMCBCfgM {
        /**0唯一配置ID*/
        m_iID: number;

        /**0开启日期*/
        m_ucDay: number;

        /**0结束日期*/
        m_ucEndDay: number;

        /**0类型*/
        m_ucType: number;

        /**0排行类型*/
        m_ucRankType: number;

        /**0条件1*/
        m_iCondition1: number;

        /**0条件2*/
        m_iCondition2: number;

        /**0条件3*/
        m_iCondition3: number;

        /**0物品总数*/
        m_iItemCount: number;

        /**物品列表*/
        m_stItemList: Array<TwoIntElement>;

        /**全民冲榜活动说明*/
        m_szHdTips: string;
    }

    /**
    * KFSCCfgItem(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class KFSCCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * KFSCLBCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class KFSCLBCfgM {
        /**0唯一配置ID*/
        m_uiDropID: number;

        /**0充值额度*/
        m_uiRechargeLimit: number;

        /**0掉落档次*/
        m_ucLevel: number;

        /**0类型*/
        m_ucGiftType: number;

        /**0类型1*/
        m_ucTypeSCLC: number;

        /**0开服天数*/
        m_ucDay: number;

        /**0物品总数*/
        m_iItemCount: number;

        /**奖励物品个数*/
        m_stItemList: Array<KFSCCfgItem>;
    }

    /**
    * KFSCTGCfgItem(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class KFSCTGCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * KFSCTGCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class KFSCTGCfgM {
        /**配置ID*/
        m_iID: number;

        /**条件1，开服第几天*/
        m_iCondition1: number;

        /**条件2，本服当日首充人数*/
        m_iCondition2: number;

        /**条件3，单人当日充值数*/
        m_iCondition3: number;

        /**物品总数*/
        m_iItemCount: number;

        /**奖励物品个数*/
        m_stItemList: Array<KFSCTGCfgItem>;
    }

    /**
    * KFXFLBCfgItem(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class KFXFLBCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * KFXFLBCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class KFXFLBCfgM {
        /**0唯一配置ID*/
        m_uiID: number;

        /**0充值额度*/
        m_uiRechargeLimit: number;

        /**0开服天数*/
        m_ucDay: number;

        /**0掉落档次*/
        m_ucLevel: number;

        /**0类型*/
        m_ucGiftType: number;

        /**0物品总数*/
        m_iItemCount: number;

        /**奖励物品个数*/
        m_stItemList: Array<KFXFLBCfgItem>;
    }

    /**
    * LHJActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class LHJActCfgM {
        /**ID*/
        m_iID: number;

        /**0条件1几率*/
        m_iCondition1: number;

        /**0条件2最小次数*/
        m_iCondition2: number;

        /**0物品1ID*/
        m_iItem1ID: number;

        /**0物品1数量*/
        m_iItem1Count: number;

        /**老虎机连斩物品数量*/
        m_stItemList: Array<DAILYCONSUMEGiveItem>;
    }

    /**
    * LXFLActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class LXFLActCfgM {
        /**0ID*/
        m_iID: number;

        /**0类型 累计天数 or 当天*/
        m_iType: number;

        /**0充值金额*/
        m_iCondition1: number;

        /**0天数*/
        m_iCondition2: number;

        /**0奖励*/
        m_stItemList: Array<BXFLItem>;
    }

    /**
    * 语言包(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class LangCfgM {
        /**0id*/
        m_iID: number;

        /**内容*/
        m_astContent: string;
    }

    /**
    * LevelRecommendCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class LevelRecommendCfgM {
        /**唯一配置ID*/
        m_ucID: number;

        /**排序ID*/
        m_ucSortID: number;

        /**名称*/
        m_szName: string;

        /**操作类型*/
        m_iOperationType: number;

        /**功能类型*/
        m_iFunctionType: number;

        /**vip参数*/
        m_iIsRecommend: number;

        /**购买价格参数*/
        m_iCostParam: number;
    }

    /**
    * 灵宝配置表(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class LingBaoCfgM {
        /**id*/
        m_iID: number;

        /**战斗力*/
        m_iFight: number;

        /**装备ID*/
        m_iEquipId: number;

        /**加时道具*/
        m_iAddTimeItem: number;

        /**装备来源*/
        m_sSourceInfo: string;

        /**提示信息*/
        m_sTipInfo: string;
    }

    /**
    * 加载页(defined in xml\joke.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class LoadingPageConfigM {
        /**图片id*/
        m_iImageID: number;

        /**等级限制*/
        m_iLevelLimit: number;

        /**时间限制（开服前X天）*/
        m_iTimeLimit: number;

        /**开启日期*/
        m_szStartDate: string;

        /**结束日期*/
        m_szEndtDate: string;
    }

    /**
    * LotteryExchangeCfgM(defined in xml\Lottery.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class LotteryExchangeCfgM {
        /**序号ID*/
        m_iID: number;

        /**所需次数*/
        m_iNubmer: number;

        /**奖励物品*/
        m_stItemList: Array<LotteryExchangeItem>;
    }

    /**
    * LotteryExchangeItem(defined in xml\Lottery.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class LotteryExchangeItem {
        /**奖励物品个数*/
        m_iItemId: number;

        /**奖励个数*/
        m_iItemNumber: number;
    }

    /**
    * LotteryLHConfigM(defined in xml\Lottery.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class LotteryLHConfigM {
        /**物品ID*/
        m_iThingId: number;

        /**炼化值*/
        m_iPrice: number;
    }

    /**
    * 名将挑战(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class MJTZCfgM {
        /**0关卡ID*/
        m_iID: number;

        /**0BOSS序号*/
        m_iBossIndex: number;

        /**0击杀奖励掉落方案*/
        m_iRewardDrop: number;
    }

    /**
    * 魔方配置(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class MagicCubeBaseCfgM {
        /**等级ID*/
        m_iID: number;

        /**0材料ID*/
        m_iConsumableID: number;

        /**0万能进阶丹*/
        m_iUniversalItem: number;

        /**0材料数量*/
        m_iConsumableNumber: number;

        /**0祝福值上限*/
        m_uiLuckUp: number;

        /**0魂值经验*/
        m_uiMagicCubeExp: number;

        /**0减伤比例*/
        m_uiDeratePercent: number;

        /**0升阶属性*/
        m_astAttrList: Array<EquipPropAtt>;
    }

    /**
    * 魔方副本配置(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class MagicCubeFBCfgM {
        /**等级ID*/
        m_iID: number;

        /**0对应模型*/
        m_uiMode: number;

        /**0显示的比例*/
        m_uiShowSize: number;
    }

    /**
    * MeltPropM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class MeltPropM {
        /**熔炼等级*/
        m_ucLevel: number;

        /**熔炼值*/
        m_uiMeltValue: number;

        /**全身强化后的额外属性*/
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * ModelUIScaleM(defined in xml\ModelUIScale.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ModelUIScaleM {
        /**模型ID*/
        m_modelID: string;

        /**X偏移*/
        m_xOffset: number;

        /**Y偏移*/
        m_yOffset: number;

        /**模型缩放*/
        m_uiScale: number;
    }

    /**
    * MonsterAITalkM(defined in xml\Monster.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class MonsterAITalkM {
        
        m_iID: number;

        m_szContent: string;
    }

    /**
    * MonsterAIM(defined in xml\Monster.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class MonsterAIM {
        
        m_iID: number;

        m_szBirthEffect: string;

        m_szDeadEffect: string;
    }

    /**
    * MonsterConfigM(defined in xml\Monster.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class MonsterConfigM {
        /**怪物ID*/
        m_iMonsterID: number;

        /**怪物等级*/
        m_usLevel: number;

        /**模型ID*/
        m_szModelID: string;

        /**单位缩放比例，百分比*/
        m_ucUnitScale: number;

        /**头像ID*/
        m_iHeadID: number;

        /**怪物名字*/
        m_szMonsterName: string;

        /**怪物身份*/
        m_bDignity: number;

        /**阵营*/
        m_ucCampID: number;

        /**对应采集技能*/
        m_iCollectionSkill: number;

        m_ucIsBeSelected: number;

        m_ucIsDisplayName: number;

        m_iDeadTime: number;

        /**是否可直接采集*/
        m_bIsGatherDirect: number;

        /**M地图上显示标志*/
        m_iSmapIcon: number;

        /**是否显示百分比*/
        m_ucShowHPPercent: number;

        /**生命*/
        m_iHP: number;

        /**人形ID*/
        m_iHumanID: number;

        /**配置血条数目*/
        m_usHPColorNumber: number;

        /**初始朝向*/
        m_bInitDirection: number;

        /**前台怪技能*/
        m_iSkillID: number;

        /**模型目录*/
        m_ucModelFolder: number;

        /**0推荐战力*/
        m_iFightPoint: number;

        /**0死亡模式*/
        m_iDeadMode: number;

        /**0神圣之力*/
        m_iGodPower: number;
    }

    /**
    * MonthCardBackCfgM(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class MonthCardBackCfgM {
        /**0天数*/
        m_iID: number;

        /**0月卡类型*/
        m_ucType: number;

        /**0道具上限*/
        m_uiItemLimit: number;

        /**0赠送比例*/
        m_uiGivePer: number;
    }

    /**
    * MonthCardBaseM(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class MonthCardBaseM {
        
        m_iID: number;

        /**0购买价格*/
        m_uiPrice: number;

        /**0系统类型*/
        m_uiFunctionName: number;

        /**0形象ID*/
        m_uiImageID: number;

        /**0武器ID*/
        m_uiWeaponID: number;

        /**0对应的道具ID*/
        m_uiItemId: number;

        /**0每日礼包(掉落ID)*/
        m_uiDailyGiftId: number;

        /**0体验卡赠送的物品ID*/
        m_uiECGiftID: number;

        /**0体验卡赠送的物品数量*/
        m_uiECGiftNumber: number;

        /**0达成礼包*/
        m_uiDCGiftID: number;

        /**0二次达成礼包*/
        m_uiTYGiftID: number;

        /**0广告词*/
        m_szMessage: string;
    }

    /**
    * NPC属性配置(defined in xml\NPC.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class NPCConfigM {
        
        m_iNPCID: number;

        m_szNPCModelID: string;

        m_szNPCName: string;

        m_szNPCDesignation: string;

        m_iNPCHeadPortrait: number;

        m_ucFunctionNumber: number;

        m_astNPCFunction: Array<NPCFunction>;

        m_szTalking1: string;

        m_szTalking2: string;

        m_szTalking3: string;

        m_szSpeaking1: string;

        m_szSpeaking2: string;

        m_szSpeaking3: string;
    }

    /**
    * NPC功能(defined in xml\NPC.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class NPCFunction {
        
        m_ucFunction: number;

        m_iParam: number;
    }

    /**
    * NPCFunctionLimitM(defined in xml\NPC.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class NPCFunctionLimitM {
        
        m_ucFunctionClass: number;

        /**父功能*/
        m_iParentName: number;

        m_iName: number;

        /**用于显示的功能名称*/
        m_szDisplayName: string;

        /**小地图上所属类型*/
        m_ucType: number;

        /**开服第几天开启*/
        m_ucStartDate: number;

        /**开服第几天结束*/
        m_ucEndDate: number;

        m_ucLevel: number;

        /**领取该任务后开启功能*/
        m_ucAcceptQuest: number;

        /**完成该任务后开启功能*/
        m_ucCompleteQuest: number;

        /**是否需要角色主动激活，0否, 1是, 同其他激活条件互斥*/
        m_ucNeedAct: number;

        /**是否一直显示，不管是否已开启*/
        m_ucAlwaysShow: number;

        m_szDisableMsg: string;

        /**是否显示解锁提示*/
        m_ucShowUnlockTip: number;

        /**模型id*/
        m_iModelID: number;

        /**跨服是否开放，0不开放，1开放*/
        m_ucIsCrossOpen: number;

        /**通关副本激活*/
        m_iPinstanceID: number;

        /**通关副本难度*/
        m_iPinstanceDiff: number;
    }

    /**
    * NPCFunctionPreviewM(defined in xml\NPC.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class NPCFunctionPreviewM {
        /**0功能等级*/
        m_iLevel: number;

        /**0功能关键字*/
        m_iFunctionName: number;

        /**0功能描述*/
        m_szDesc: string;

        /**0奖励道具ID*/
        m_iItemID: number;

        /**0奖励数量*/
        m_iItemCount: number;

        /**名字*/
        m_szName: string;
    }

    /**
    * npc商店中的刷新随机物品的配置信息(defined in xml\NPC.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class NPCRandomStoreCfgM {
        /**对应商店ID*/
        m_iStoreId: number;

        /**固定刷新时间*/
        m_dtRefreshTimes: Array<string>;
    }

    /**
    * 商店配置(defined in xml\NPC.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class NPCSellConfigM {
        
        m_iStoreID: number;

        m_iItemID: number;

        m_ucSequence: number;

        m_ucAmount: number;

        m_ucExchangeNumber: number;

        m_astExchange: Array<Exchange>;

        m_ucDiscountRate: number;

        m_iItemTab: number;

        m_iItemSubTab: number;

        m_ucIsRecommend: number;

        m_ucIsNew: number;

        m_iThreeDaysRate: number;

        m_iSevenDaysRate: number;

        m_iThirtyDaysRate: number;

        m_iActivityID: number;

        m_ucProfShow: number;

        /**出售条件类型*/
        m_iSaleCond: number;

        /**出售条件值*/
        m_iSaleCondVal: number;

        /**此随机物品，刷出来的概率*/
        m_usRefreshProb: number;

        /**原价*/
        m_iMaxPrice: number;

        /**模型类型*/
        m_iModelType: number;

        /**模型ID*/
        m_iModelID: number;

        /**0折扣率*/
        m_iDiscount: number;
    }

    /**
    * NPCSellLimitConfigM(defined in xml\NPC.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class NPCSellLimitConfigM {
        
        m_iStoreID: number;

        m_iThingID: number;

        m_iStartTime: number;

        m_iEndTime: number;

        m_iMergeStartTime: number;

        m_iMergeEndTime: number;

        m_iLimitNum: number;

        m_iNumberPerDay: number;

        m_iNumberLife: number;

        m_aiNumberPerDayVIP: Array<number>;
    }

    /**
    * NPCStoreBuyBackCfgM(defined in xml\NPC.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class NPCStoreBuyBackCfgM {
        /**0物品ID*/
        m_iItemID: number;

        /**0回购大类*/
        m_ucExchange1Class: number;

        /**0回购子类*/
        m_ucExchange2Class: number;

        /**0每组数量*/
        m_iItemNum: number;

        /**0返还ID*/
        m_iExchangeID: number;

        /**0每组返还数量*/
        m_iExchangeNum: number;

        /**0无月卡日限购数量*/
        m_iNonePrivilegeLimit: number;

        /**0白银月卡日限购*/
        m_iPrivilege1Limit: number;

        /**0黄金月卡日限购*/
        m_iPrivilege2Limit: number;

        /**0钻石月卡日限购*/
        m_iPrivilege3Limit: number;

        /**0商店编号*/
        m_iStoreID: number;

        /**0排列顺序*/
        m_iSequence: number;
    }

    /**
    * NavigationCfg_OnHookM(defined in xml\Navigation.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class NavigationCfg_OnHookM {
        
        m_iLevel: number;

        m_iMosterID: number;

        m_iSceneID: number;

        /**坐标x*/
        m_iPositionX: number;

        /**坐标y*/
        m_iPositionY: number;
    }

    /**
    * NavigationConfigM(defined in xml\Navigation.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class NavigationConfigM {
        
        m_iNavigationType: number;

        m_iQuestID: number;

        m_szPositionName: string;

        m_iSceneID: number;

        m_iNPCID: number;

        m_stPosition: UnitPosition;
    }

    /**
    * 新功能预览配置(defined in xml\Resources.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class NewFeatPreConfigM {
        /**引导顺序*/
        m_uiID: number;

        /**引导类型*/
        m_uiType: number;

        /**达成条件*/
        m_szCondition: string;

        /**条件值*/
        m_uiConditionValue: number;

        /**显示等级*/
        m_uiLevel: number;

        /**名称图片*/
        m_uiNameIcon: string;

        /**模型ID*/
        m_uiModelId: number;

        /**是否需要显示按钮*/
        m_szButtonName: string;

        /**获取途径*/
        m_szWay: string;

        /**相关属性*/
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * 版本更新内容配置(defined in xml\Resources.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class NewsConfigM {
        /**平台类型*/
        m_ucPlatformID: number;

        /**用于显示的公告日期*/
        m_szChannelID: string;

        /**用于显示的公告日期*/
        m_szDate: string;

        /**用于显示的版本号*/
        m_szVersion: string;

        /**公告内容 最大128个字*/
        m_szContent: string;

        /**此日期前下线则自动弹出公告*/
        m_szCtrlDate: string;
    }

    /**
    * OneIntElement(defined in xml\Common.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class OneIntElement {
        /**值*/
        m_uiValue: number;
    }

    /**
    * OneSuffData(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class OneSuffData {
        /**材料ID*/
        m_iSuffID: number;

        /**材料数量*/
        m_iSuffNumber: number;
    }

    /**
    * PTFLActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class PTFLActCfgM {
        /**唯一配置ID*/
        m_iID: number;

        /**类型. 1-常规, 2-特殊, 强制弹窗*/
        m_ucType: number;

        /**标题内容*/
        m_szTitle: string;

        /**时间说明*/
        m_szTime: string;

        /**奖励内容*/
        m_szReward: string;

        /**主要宣传内容*/
        m_szContent: string;

        /**超链接内容*/
        m_szLink: string;
    }

    /**
    * PinstanceConfigM(defined in xml\Pinstance.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class PinstanceConfigM {
        /**副本ID*/
        m_iPinstanceID: number;

        /**是否需要跨服*/
        m_ucIsKF: number;

        /**进入副本vip等级*/
        m_ucVIPLevel: number;

        /**一键加成时是否有VIP加成*/
        m_ucIsVIPincrease: number;

        /**等级下限*/
        m_iLevelLow: number;

        /**等级上限*/
        m_iLevelHigh: number;

        /**副本名字*/
        m_szName: string;

        /**关联场景个数*/
        m_ucSceneNumber: number;

        /**关联的场景ID*/
        m_aiSceneID: Array<number>;

        /**人数上限*/
        m_ucPlayerHigh: number;

        /**推荐人数*/
        m_ucPlayerBestNum: number;

        /**副本内是否允许组队*/
        m_bIsTeamable: number;

        /**队伍数量*/
        m_ucTeamNumber: number;

        /**是否显示离开副本*/
        m_ucShowLeave: number;

        /**PVP模式*/
        m_iPVPType: number;

        /**是否使用经验丹*/
        m_ucUseJyd: number;

        /**是否需要选择难度*/
        m_ucDifficulty: number;

        /**复活点复活等待时间*/
        m_iDeadTime: number;

        /**能否原地复活*/
        m_bRevival: number;

        /**是否允许绑定元宝复活*/
        m_bBDYBRevival: number;

        /**是否自动攻击*/
        m_ucIsAutoAttack: number;

        /**进入副本限次*/
        m_ucEnterTimes: number;

        /**副本自动战斗时的传送点序列*/
        m_szGateInfo: string;

        /**副本技能列表*/
        m_stSkillList: Array<OneIntElement>;

        /**是否替换原技能*/
        m_ucIsReplaceSkill: number;

        /**副本加载类型,0正常，1部分无loading，2全部无loading*/
        m_cLoadingType: number;

        /**离开宗门退出副本*/
        m_ucIsOutGuildOutPinstance: number;
    }

    /**
    * PinstanceDiffBonusM(defined in xml\Scene.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class PinstanceDiffBonusM {
        /**副本ID*/
        m_iID: number;

        /**副本名*/
        m_szName: string;

        /**副本难度*/
        m_iDiff: number;

        /**每日首通通关奖励物品*/
        m_stDailyBonus: Array<PinstanceDiffThing>;

        /**终生通关奖励物品*/
        m_stLifeBonus: Array<PinstanceDiffThing>;

        /**开放等级*/
        m_iOpenLevel: number;

        /**推荐战力*/
        m_iFightPower: number;

        /**条件值*/
        m_iConditionValue: number;

        /**前置难度*/
        m_iPreDiff: number;

        /**开放天数*/
        m_iOpenDay: number;

        /**扫荡开启等级*/
        m_iSweepLevel: number;

        /**进入消耗ID*/
        m_iConsumeType: number;

        /**进入消耗数量*/
        m_iConsumeValue: number;

        /**每日限次*/
        m_iLimitTimes: number;

        /**描述*/
        m_szDesc: string;
    }

    /**
    * PinstanceDiffThing(defined in xml\Scene.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class PinstanceDiffThing {
        
        m_iThingId: number;

        m_iThingNum: number;

        /**职业限制*/
        m_iProf: number;
    }

    /**
    * 提示引导(defined in xml\SystemParameters.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class PlayGuideConfigM {
        /**显示的组别*/
        m_ucGroupID: number;

        /**排序*/
        m_ucSort: number;

        /**显示描述*/
        m_szString: string;

        /**奖励标识*/
        m_szAward: string;

        /**提示的类型*/
        m_ucType: number;

        /**提示类型对应的id*/
        m_iID: number;

        /**0功能*/
        m_iFunctionName: number;
    }

    /**
    * PlayerNameM(defined in xml\ModelUIScale.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class PlayerNameM {
        /**名字1*/
        m_name1: string;

        /**名字2*/
        m_name2: string;

        /**名字3*/
        m_name3: string;

        /**名字4*/
        m_name4: string;

        /**名字5*/
        m_name5: string;

        /**名字6*/
        m_name6: string;
    }

    /**
    * PrefixCondition(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class PrefixCondition {
        
        m_ucLevelLowerLimit: number;

        m_ucLevelUpperLimit: number;

        m_ucProfessionLimit: number;
    }

    /**
    * 个人BOSS(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class PrivatBossCfgM {
        /**0ID*/
        m_ucNandu: number;

        /**0怪物ID*/
        m_MonsterID: number;

        /**0怪物类型*/
        m_iIMonsterType: number;

        /**0等级*/
        m_iLevel: number;

        /**战力*/
        m_iFightLimit: number;

        /**0次数限制*/
        m_iTimeLimit: number;

        /**0掉落*/
        m_iItemID: Array<number>;

        /**0奖励目标职业*/
        m_iProf: Array<number>;

        /**0进入等级上限*/
        m_iLevelUp: number;

        /**0区域名称*/
        m_sAreaName: string;
    }

    /**
    * QAM(defined in xml\QA.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QAM {
        /**ID*/
        m_iID: number;

        /**玩法类型*/
        m_usType: number;

        /**是否是常见问题*/
        m_ucIsTopic: number;

        /**问题*/
        m_szQuestion: string;

        /**答案*/
        m_szAnswer: string;
    }

    /**
    * QA_PanelM(defined in xml\QA.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QA_PanelM {
        /**面板名称*/
        m_iPanelName: number;

        /**查询关键字*/
        m_szSearchKey: string;
    }

    /**
    * QKLPFCfgItem(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QKLPFCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * QKLPFConfigM(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QKLPFConfigM {
        
        m_iID: number;

        /**物品数量*/
        m_ucItemCount: number;

        /**需要的物品列表*/
        m_stItemList: Array<QKLPFCfgItem>;

        /**0奖励值*/
        m_uiGetItemCount: number;
    }

    /**
    * QKLXHConfigM(defined in xml\FaBao.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QKLXHConfigM {
        
        m_iID: number;

        /**0消耗炼制值*/
        m_uiConsume: number;

        /**0兑换物品礼包*/
        m_uiGetItemID: number;

        /**物品数量*/
        m_uiGetItemCount: number;
    }

    /**
    * QQ群展示(defined in xml\Resources.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QQGroupShowConfigM {
        /**0平台*/
        m_iPlatformID: number;

        /**0渠道ID*/
        m_szChannelID: string;

        /**平台标记*/
        m_szPlatformName: string;

        /**0内容 最大128个字*/
        m_szContent: string;
    }

    /**
    * QiFuConfigM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QiFuConfigM {
        
        m_iID: number;

        /**类型*/
        m_ucType: number;

        /**祈福次数*/
        m_ucNumber: number;

        /**0等级下限*/
        m_iLevelLowerLimit: number;

        /**0等级上限*/
        m_iLevelUpperLimit: number;

        /**0默认祈福次数*/
        m_uiTime: number;

        /**0购买价格*/
        m_uiPrice: number;

        /**暴击概率*/
        m_uiRate: number;

        /**暴击倍率*/
        m_uiDouble: number;

        /**0奖励类型*/
        m_uiRewardThingID: number;

        /**0奖励值*/
        m_uiRewardValue: number;
    }

    /**
    * QinDianConsumeM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QinDianConsumeM {
        /**0流水号*/
        m_iID: number;

        /**消费最低额度要求*/
        m_iConsumeLimit: number;

        /**开始名次*/
        m_iBeginRank: number;

        /**结束名次*/
        m_iEndRank: number;

        /**道具数量*/
        m_iItemCount: number;

        /**总共多少天奖励类型*/
        m_stItemList: Array<DAILYCONSUMEGiveItem>;
    }

    /**
    * 任务进度值(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QuestConfigM {
        
        m_iQuestID: number;

        m_ucQuestType: number;

        /**任务星级*/
        m_ucQuestLevel: number;

        m_szQuestTitle: string;

        m_szQuestDialogPublished: string;

        m_szQuestDescription: string;

        m_szQuestDialogCompleted: string;

        m_iConsignerNPCID: number;

        m_iAwarderNPCID: number;

        m_iPreQuestID: number;

        m_iNextQuestID: number;

        m_stPrefixCondition: PrefixCondition;

        m_ucQuestNodeNumber: number;

        m_astQuestNodeConfig: Array<QuestNodeConfigCli>;

        m_ucMonsterDropNumber: number;

        m_astMonsterDropConfig: Array<QuestMonsterDropConfigM>;

        m_ucRewardThingNumber: number;

        m_astRewardThingConfig: Array<RewardThing>;

        /**接任务跳*/
        m_szAcceptJump: string;

        /**完成任务跳*/
        m_szFinishJump: string;

        /**排序ID*/
        m_iQuestSortID: number;

        /**大跳的类型*/
        m_ucBigJumpType: number;

        /**是否不自动弹出领奖窗口*/
        m_ucNoPrompGetAward: number;

        /**是否已完成*/
        completed: number;

        /**领取任务后的跳跃序列*/
        acceptJumpSeq: Array<number>;

        /**完成任务后的跳跃序列*/
        finishJumpSeq: Array<number>;

        /**排序权重*/
        pickSortLayer: number;

        /**节点不可自动运行*/
        cannotAutoRunNode: number;

        /**是否组队副本任务*/
        isTeamFbNode: number;
    }

    /**
    * 可飞行的任务(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QuestFlyConfigM {
        
        m_iQuestID: number;
    }

    /**
    * 任务进度值(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QuestGuildConfigM {
        /**章节回目*/
        m_iQuestID: number;

        /**0推荐总数量*/
        m_iRecommendNum: number;

        /**推荐数组*/
        m_astRecommend: Array<RecommendInfo>;

        /**引导对应ID*/
        m_iGuideTipID: number;
    }

    /**
    * QuestMonsterDropConfigM(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QuestMonsterDropConfigM {
        
        m_iMonsterID: number;

        m_iQuestThingID: number;
    }

    /**
    * QuestNodeConfigCli(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QuestNodeConfigCli {
        
        m_ucType: number;

        m_iThingID: number;

        m_shValue: number;

        m_szWord: string;

        m_szName: string;

        /**关联的影响怪物配置索引*/
        monsterDropIndex: number;
    }

    /**
    * 任务进度值(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QuestSectionM {
        /**章节回目*/
        m_iID: number;

        /**章节名称*/
        m_szTitle: string;

        /**章节编号*/
        m_iSectionID: number;

        /**任务编号*/
        m_iTaskID: number;

        /**任务简介*/
        m_szTaskDesc: string;
    }

    /**
    * QuestionActivityConfigM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class QuestionActivityConfigM {
        /**问题索引,唯一标识*/
        m_iID: number;

        /**问题索引,唯一标识*/
        m_szSubject: string;

        /**左边答案*/
        m_szAnswerLeft: string;

        /**右边答案*/
        m_szAnswerRight: string;
    }

    /**
    * RCRecommendCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class RCRecommendCfgM {
        /**唯一配置ID*/
        m_ucID: number;

        /**排序ID*/
        m_ucSortID: number;

        /**分类*/
        m_szType: number;

        /**名称*/
        m_szName: string;

        /**操作类型*/
        m_iOperationType: number;

        /**功能类型*/
        m_iFunctionType: number;

        /**是否推荐*/
        m_iRecommend: number;

        /**功能等级*/
        m_iFunctionLevel: number;

        /**参与条件*/
        m_szJoinDesc: string;

        /**活动说明*/
        m_szRuleDesc: string;

        /**主要产出说明*/
        m_szRewardDesc: string;

        /**是否需要红点*/
        m_bIsRedDot: number;

        /**显示用的物品列表*/
        m_stShowList: Array<HYDRewardInfo>;
    }

    /**
    * 客户端排行榜信息配置(defined in xml\Rank.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class RankConfInfoM {
        
        m_iRankCatalog: number;

        m_iRankType: number;

        m_iOpenLevel: number;

        m_iRankSubType: number;

        m_szKey1: string;

        m_szKey2: string;

        m_szKey3: string;

        m_szKey4: string;

        m_szKey5: string;

        m_iListNumber: number;

        m_iRankNumber: number;

        m_szDiscription: string;

        m_iSequence: number;

        /**关联功能*/
        m_iCorrelationFunction: number;
    }

    /**
    * RebirthRefineCfgM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class RebirthRefineCfgM {
        /**0升级等级*/
        m_iLevel: number;

        /**装备部位*/
        m_iEquipPart: number;

        /**0精炼转生限制*/
        m_ucRequiredLevel: number;

        /**0材料数量*/
        m_iConsumableNumber: number;

        /**0材料ID*/
        m_iConsumableID: number;

        /**转生精炼属性 m_iGaiLv 作废 */
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * RebirthRefineSuitCfgM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class RebirthRefineSuitCfgM {
        /**0升级等级*/
        m_iLevel: number;

        /**精炼套装属性*/
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * RebirthSuitCfgM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class RebirthSuitCfgM {
        /**品阶*/
        m_iGrade: number;

        /**激活数量*/
        m_ucActiveNum: number;

        /**转生套装属性 属性值表示万分比*/
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * RechargeExchageCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class RechargeExchageCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * RechargeExchangeActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class RechargeExchangeActCfgM {
        /**唯一配置*/
        m_iID: number;

        /**条件1-档次*/
        m_iCondition1: number;

        /**条件2-自然日*/
        m_iCondition2: number;

        /**兑换次数*/
        m_uiTime: number;

        /**兑换物品个数*/
        m_stCostItemList: Array<RechargeExchageCfgItem>;

        /**奖励物品个数*/
        m_stItemList: Array<RechargeExchageCfgItem>;
    }

    /**
    * RecommendInfo(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class RecommendInfo {
        /**推荐类型*/
        m_iType: number;

        /**推荐描述*/
        m_sTip: string;
    }

    /**
    * 人形怪配置(defined in xml\RenXing.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class RenXingConfigM {
        /**0形象ID*/
        m_iModelID: number;

        /**0职业*/
        m_ucZhiye: number;

        /**0性别*/
        m_ucSex: number;

        /**0装备*/
        m_iWeaponID: number;

        /**0武魂等级*/
        m_ucWuHunLv: number;

        /**0羽翼等级*/
        m_ucWingLv: number;

        /**0法阵等级*/
        m_ucFazhenLv: number;
    }

    /**
    * 资源预加载表(defined in xml\Resources.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ResourcesConfigM {
        
        m_iConditionType: number;

        m_iConditionID: number;

        m_iResourcesType: number;

        m_szResourcesID: string;

        m_iPriority: number;
    }

    /**
    * RewardThing(defined in xml\Common.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class RewardThing {
        
        m_iThingID: number;

        m_iValue: number;

        m_ushTarget: number;
    }

    /**
    * 角色升级相关数据(defined in xml\RoleAttribute.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class RoleLevelConfigM {
        
        m_usLevel: number;

        m_uiMissPerPoint: number;

        m_uiExpPerMin: number;

        /**经验根据等级修正系数*/
        m_uiExpCorrect: number;

        m_ushExpPerTimeOnline: number;

        m_iExpPerHourOffline: number;

        m_iHpRolePerTick: number;

        m_iMpRolePerTick: number;

        m_iMaxHpOfLevel: number;

        m_iMaxMpOfLevel: number;

        m_uiExperience: number;

        /**战力绿色标准*/
        m_uiGreenStandard: number;

        /**战力蓝色标准*/
        m_uiBlueStandard: number;

        /**战力紫色标准*/
        m_uiPurpleStandard: number;

        /**战力橙色标准*/
        m_uiOrangeStandard: number;

        /**每10秒离线经验*/
        m_iLXJY: number;
    }

    /**
    * SQJJActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SQJJActCfgM {
        /**唯一配置ID*/
        m_iID: number;

        /**主类*/
        m_iMainType: number;

        /**条件1*/
        m_iCondition1: number;

        /**物品数量*/
        m_iItemCount: number;

        /**奖励物品个数*/
        m_stItemList: Array<SQJJCfgItem>;
    }

    /**
    * SQJJCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SQJJCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * SSCGiftCfgM(defined in xml\Item.Drop.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SSCGiftCfgM {
        /**0礼包类型*/
        m_ucGiftType: number;

        /**0天数*/
        m_ucDay: number;

        /**0充值额度*/
        m_uiRechargeLimit: number;

        /**0掉落物档次*/
        m_ucLevel: number;

        /**限制ID*/
        m_uiDropID: number;
    }

    /**
    * SXJJActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SXJJActCfgM {
        /**唯一配置ID*/
        m_iID: number;

        /**主类*/
        m_iMainType: number;

        /**条件1*/
        m_iCondition1: number;

        /**物品数量*/
        m_iItemCount: number;

        /**奖励物品个数*/
        m_stItemList: Array<SXJJCfgItem>;
    }

    /**
    * SXJJCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SXJJCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * 赛季(defined in xml\ZYZH.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SaiJiConfigM {
        /**0赛季ID*/
        m_iSeasonID: number;

        /**0ID*/
        m_iID: number;

        /**0赛季名称*/
        m_szSeasonname: string;

        /**0形象ID*/
        m_iImageID: number;

        /**0对应系统*/
        m_iZhuFuID: number;

        /**0激活道具ID*/
        m_iSutffID: number;

        /**0道具数量*/
        m_iSutffCount: number;

        /**0描述*/
        m_szStuffName: string;

        /**获取*/
        m_stBonusList: Array<SaiJiGather>;

        /**0道具数量*/
        m_iSutffCount2: number;
    }

    /**
    * SaiJiGather(defined in xml\ZYZH.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SaiJiGather {
        /**0获取途经*/
        m_szDes: string;

        /**0图标*/
        m_iIcon: number;

        /**0获取跳转*/
        m_iJump: number;
    }

    /**
    * SaleOffInfoM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SaleOffInfoM {
        
        m_usCount: number;

        m_ucSaleOff: number;

        m_usPrice: number;
    }

    /**
    * SceneConfigM(defined in xml\Scene.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SceneConfigM {
        /**场景ID*/
        m_iSceneID: number;

        /**场景名字*/
        m_szSceneName: string;

        /**场景资源ID*/
        m_iResourceID: number;

        /**所需最低等级*/
        m_ucRequiredLevel: number;

        /**场景音乐*/
        m_iMusicID: number;

        /**PVP模式*/
        m_iPVPModel: number;

        /**复活点复活等待时间*/
        m_iDeadTime: number;

        /**能否原地复活*/
        m_bRevival: number;

        /**场景禁用的道具大类或子类*/
        m_stDisable: Array<DisableClass>;

        /**是否显示图标*/
        m_ucShowLeave: number;

        /**是否显示新功能开启预览*/
        m_ucShowXgnPreview: number;

        /**是否可以传送*/
        m_ucTransfer: number;

        /**是否能传送回城*/
        m_ucBackToCity: number;

        /**是否允许绑定元宝原地复活*/
        m_bBDYBRevival: number;

        /**天气效果*/
        m_iWeatherType: number;

        /**天气程度*/
        m_iWeatherIntense: number;

        /**天气风力*/
        m_iWeatherWind: number;

        /**弹幕速度*/
        m_ucPopWordSpeed: number;

        /**关联的活动ID*/
        m_iRelateActivityID: number;

        /**攻略*/
        m_szStrategy: string;

        /**场景奖励类型最大数量4个*/
        m_astRewardDecList: Array<SceneReward>;

        /**自动隐藏等级*/
        m_ucHideLevel: number;

        /**语音模式*/
        m_ucAudioType: number;

        /**是否自动反击，0否，1是*/
        m_bFightBack: number;

        /**是否死亡惩罚*/
        m_bDeathPunish: number;

        /**魂力等级限制*/
        m_iHunliLimit: number;

        /**关联的父场景ID，副本使用*/
        m_iSceneFather: number;

        /**关联的副本用场景ID，副本使用*/
        m_iScenePin: number;
    }

    /**
    * SceneReward(defined in xml\Common.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SceneReward {
        /**奖励描述*/
        m_ucSceneRewardDec: string;

        /**奖励物品*/
        m_ucSceneRewardList: number;
    }

    /**
    * SevenDayCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SevenDayCfgM {
        /**0登录天数*/
        m_iDay: number;

        /**0模型ID*/
        m_iModeID: number;
    }

    /**
    * SevenDayFundCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SevenDayFundCfgM {
        /**0投资类型*/
        m_ucFundType: number;

        /**0配置ID*/
        m_ucFundID: number;

        /**0投资额度*/
        m_iPrice: number;

        /**0领取条件*/
        m_iCondition: number;

        /**每天奖励类型*/
        m_stItemList: Array<FundGiveItem>;
    }

    /**
    * SevenSignItem(defined in xml\MergeActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SevenSignItem {
        /**材料ID*/
        m_uiItemID: number;

        /**材料个数*/
        m_uiItemCount: number;
    }

    /**
    * 四象神兽(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ShenShouCfgM {
        /**0四象ID*/
        m_uiSeasonID: number;

        /**0四象等级*/
        m_iSeasonLevel: number;

        /**模型ID*/
        m_szModelID: string;

        /**0激活材料ID*/
        m_iActID: number;

        /**0激活材料数量*/
        m_iActNumber: number;

        /**0升级经验*/
        m_iLvXP: number;

        /**0进阶材料ID*/
        m_iConsumableID: number;

        /**0进阶数量*/
        m_iLuckyUp: number;

        /**0突破材料ID*/
        m_iByondID: number;

        /**0突破数量*/
        m_iByondNumber: number;

        /**进阶属性*/
        m_astFixProp: Array<EquipPropAtt>;

        /**升级属性*/
        m_astProp: Array<EquipPropAtt>;

        /**光环属性*/
        m_astHalo: Array<EquipPropAtt>;
    }

    /**
    * 守护神配置(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ShieldGodCfgM {
        /**0品阶*/
        m_shLv: number;

        /**0类型*/
        m_iType: number;

        /**0关联的成就id*/
        m_iActID: number;

        /**0名字*/
        m_szName: string;

        /**0进阶道具ID*/
        m_iUpItemID: number;

        /**0进阶道具数量*/
        m_iUpItemNum: number;

        /**0最小祝福值*/
        m_iLuckvalue: number;

        /**0护盾比例*/
        m_iShieldRatio: number;

        /**0减伤比例*/
        m_iInjuryRaito: number;

        /**属性*/
        m_astProp: Array<EquipPropAtt>;

        /**0死亡cd*/
        m_uiDeadCD: number;

        /**0出战技能*/
        m_iSkillID: number;

        /**0跟随模型*/
        m_iModleID: number;

        /**0战斗特效*/
        m_iWareffect: number;
    }

    /**
    * 技能施放以及作用范围(defined in xml\Skill.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SkillCastArea {
        /**施法目标*/
        m_iSkillTarget: number;

        /**施法距离*/
        m_iCastDistance: number;

        /**施法浮动距离*/
        m_iFloatRange: number;

        /**范围类型*/
        m_ucRangeType: number;

        /**作用范围*/
        m_uiEffectRange: number;

        /**矩形边长*/
        m_uiSideLength: number;

        /**最大作用个数*/
        m_iMaxTargetNumber: number;

        /**攻击次数*/
        m_ucAttackTimes: number;

        /**最佳施法距离（非表格配置，程序计算）*/
        bestDis: number;
    }

    /**
    * 技能客户端配置(defined in xml\Skill.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SkillConfigM {
        
        m_iSkillID: number;

        m_szSkillName: string;

        m_szDescription: string;

        /**技能图标ID*/
        m_iSkillIcon: number;

        /**男人技能特效ID*/
        m_szBoyEffectID: string;

        /**女人技能特效ID*/
        m_szGirlEffectID: string;

        /**怪物受击特效*/
        m_szMonsterHurtEffect: string;

        /**受击特效是否旋转*/
        m_ucIsNeedRotate: number;

        /**角色攻击动作*/
        m_ucAttackAction: number;

        /**弹道特效ID*/
        m_szFlightPathID: string;

        /**客户端表现效果1*/
        m_clientEffect1: number;

        /**客户端表现效果2*/
        m_clientEffect2: number;

        /**客户端表现效果3*/
        m_clientEffect3: number;

        /**技能等级*/
        m_ushSkillLevel: number;

        /**下一级技能ID*/
        m_iNextLevelID: number;

        /**技能系别*/
        m_ucSkillBranch: number;

        /**消耗目标数量*/
        m_iConsumableNumber: number;

        m_stConsumable: Array<SkillConsumableM>;

        /**是否可自动施放*/
        m_ucAutoCast: number;

        /**职业要求*/
        m_ucRequireProf: number;

        m_stSkillStudy: SkillStudy;

        /**前置技能ID*/
        m_iRequiredSkillID: number;

        m_stSkillCastArea: SkillCastArea;

        /**无视打断*/
        m_ucNotInterrupted: number;

        /**特效持续时间*/
        m_effectTime: number;

        /**效果数量*/
        m_iEffectNumber: number;

        m_astSkillEffect: Array<SkillEffectM>;

        /**吟唱时间*/
        m_iPrepareTime: number;

        m_stSkillCollDown: SkillCoolDown;

        /**技能释放优先级.*/
        m_iSkillPriority: number;

        /**是否停止移动*/
        m_ucStopMove: number;

        /**尸体是否击飞*/
        m_ucBodyFly: number;

        /**是否播放受击动作*/
        m_ucUnderAttackAction: number;

        /**音效ID*/
        m_iVoiceID: number;

        /**施法音效ID*/
        m_iCastSkillVoiceID: number;

        /**施法人音音效ID*/
        m_iCastSkillSpeakID: number;

        /**施法动作*/
        m_ucCastAction: number;

        /**战斗力*/
        m_iBattleEffect: number;

        /**是否可用于自动战斗*/
        m_ucAutoBattleSystem: number;

        /**技能颜色*/
        m_ucSkillColor: number;

        /**技能控制类型*/
        m_iSkillCtrType: number;

        /**技能群攻类型*/
        m_iAoeType: number;

        /**技能主被动类型*/
        m_ucSkillType: number;

        /**0是否强制技能间隔*/
        m_bSkillJG: number;

        /**0技能特效释放位置*/
        m_ucCastEffectPos: number;

        /**吟唱特效ID*/
        m_szPrepareEffect: string;

        /**基础属性*/
        m_astPropAtt: Array<EquipPropAtt>;

        /**进度属性*/
        m_astStepProp: Array<EquipPropAtt>;

        /**是否已学*/
        completed: number;

        /**下一级的配置*/
        nextLevel: SkillConfigM;

        /**跳跃距离，如果技能效果里有位移效果的就会有值*/
        jumpDistance: number;

        /**位移方式，如果技能效果里有位移效果的就会有值*/
        specMovieAction: number;

        /**技能进度(不是所有技能都有，坐骑、翅膀技能才有)*/
        progress: number;

        /**技能是否被禁用(1表被禁用，不能计入效果)*/
        m_ucForbidden: number;
    }

    /**
    * 技能消耗(defined in xml\Skill.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SkillConsumableM {
        
        m_iConsumeID: number;

        m_szConsumeName: string;

        m_iConsumeValue: number;
    }

    /**
    * 技能冷却(defined in xml\Skill.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SkillCoolDown {
        
        m_uiSelfCoolDown: number;

        /**公共CD类型*/
        m_ucGCDIncluded: number;

        /**公共冷却时长*/
        m_iGCDTime: number;
    }

    /**
    * 技能效果(defined in xml\Skill.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SkillEffectM {
        
        m_iSkillTarget: number;

        m_iEffectObj: number;

        m_iEffectValue: number;
    }

    /**
    * 羁绊技能配置(defined in xml\Skill.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SkillFetterCfgM {
        /**技能ID*/
        m_iID: number;

        /**技能名称*/
        m_szName: string;

        /**对应技能位*/
        m_ucSkillPart: number;

        /**条件总数*/
        m_iPosCnt: number;

        /**武缘位置信息*/
        m_astPosInfo: Array<SkillFetterPetPosInfo>;
    }

    /**
    * 羁绊技能武缘位置信息(defined in xml\Skill.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SkillFetterPetPosInfo {
        /**武缘ID*/
        m_iBeautyID: number;

        /**武缘等级*/
        m_iBeautyLv: number;
    }

    /**
    * 技能学习(defined in xml\Skill.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SkillStudy {
        
        m_iStudyLevel: number;

        m_iStudyItem: number;

        m_iStudyItemNum: number;

        /**学习门派技能CD*/
        m_iLearnCD: number;

        /**是否允许进度学习技能,0不允许，其他值单次点击消耗值*/
        m_ucAllowStep: number;

        /**起始学习等级（非表格配置，程序计算）*/
        openLv: number;
    }

    /**
    * SkyLotteryConfigM(defined in xml\Lottery.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SkyLotteryConfigM {
        /**开服天数*/
        m_ucOpenDays: number;

        /**抽奖类型,1（天宫宝境），2（天宫秘镜）*/
        m_ucType: number;

        /**序号*/
        m_ucId: number;

        /**物品ID*/
        m_iItemId: number;

        /**物品数量*/
        m_iItemNumber: number;
    }

    /**
    * SpecialPriCfgM(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SpecialPriCfgM {
        /**0特权类型*/
        m_iID: number;

        /**0特权数值*/
        m_aiValue: Array<number>;

        /**0显示类型*/
        m_ucDisplayType: number;
    }

    /**
    * StageDayCfgM(defined in xml\StartActivityGift.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class StageDayCfgM {
        /**0唯一配置ID*/
        m_iID: number;

        /**0第几天开启*/
        m_iDay: number;

        /**0类型*/
        m_ucType: number;

        /**0排序*/
        m_uiOrder: number;

        /**0条件*/
        m_uiCondition: number;

        /**0物品*/
        m_stItemList: Array<TwoIntElement>;

        /**0充值金额*/
        m_uiChargeValue: number;

        /**0开服几天内是否显示*/
        m_iShow: number;

        /**功能跳转*/
        m_iFunction: number;
    }

    /**
    * StarThroneConfigM(defined in xml\chongmai.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class StarThroneConfigM {
        
        m_iStellarID: number;

        m_szStellarName: string;

        m_ucConstellationID: number;

        m_szConstellationName: string;

        m_ucConstellationOpenLevel: number;

        m_ucStratumID: number;

        m_szStratumName: string;

        m_ucLocationID: number;

        m_ucNeedSupernova: number;

        m_ucPropertyType: number;

        m_iPropertyValue: number;

        /**直接升级到本阶最高级所需花费*/
        m_iUpValue: number;
    }

    /**
    * 武缘冒泡(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class StoryBubbleCfgM {
        /**id*/
        m_iID: number;

        /**触发类型*/
        m_iTriggerType: number;

        /**触发数值*/
        m_iTriggerValue: number;

        /**冒泡内容*/
        m_sBubbleContent: string;
    }

    /**
    * 剧情对话表(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class StoryDialogCfgM {
        /**ID*/
        m_iID: number;

        /**出现位置*/
        m_iPosition: number;

        /**头像编号*/
        m_iIcon: string;

        /**人物名称*/
        m_iName: string;

        /**剧情对话*/
        m_iDialog: string;
    }

    /**
    * 剧情引导表(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class StoryGuideCfgM {
        /**ID*/
        m_iID: number;

        /**任务ID*/
        m_iQuestId: number;

        /**任务完成状态*/
        m_iQuestStatus: number;

        /**提交或者接取任务*/
        m_iCtrlQuest: number;

        /**特效最小间隔时间*/
        m_iMinEffectTimer: number;

        /**特效最大间隔时间*/
        m_iMaxEffectTimer: number;

        /**目的地*/
        m_iPosition: string;

        /**播放特效*/
        m_iEffectModel: string;
    }

    /**
    * 剧情步骤表(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class StoryStepCfgM {
        /**ID*/
        m_iID: number;

        /**持续时间,-1表示事件*/
        m_iDelay: number;

        /**对象*/
        m_iTarget: number;

        /**其他特效的需求*/
        m_sOther: string;

        /**播放动作*/
        m_sAction: string;

        /**开始位置坐标*/
        m_sTargetPoint: string;
    }

    /**
    * 剧情时间轴(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class StoryTimelineCfgM {
        /**id*/
        m_iID: number;

        /**剧情时间轴*/
        m_ucTimeline: string;

        /**副本怪物创建*/
        m_ucCreateMonster: string;
    }

    /**
    * 剧情触发表(defined in xml\Quest.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class StoryTriggerCfgM {
        /**id*/
        m_iID: number;

        /**是否跳过剧情*/
        m_iSkip: number;

        /**剧情类型*/
        m_iStoryType: number;

        /**触发类型*/
        m_iTriggerType: number;

        /**触发数值*/
        m_iTriggerValue: number;

        /**开始显示NPC*/
        m_ucStartShowNPC: string;

        /**开始隐藏NPC*/
        m_ucStartHideNPC: string;

        /**结束显示NPC*/
        m_ucEndShowNPC: string;

        /**结束隐藏NPC*/
        m_ucEndHideNPC: string;

        /**剧情组*/
        m_ucGroup: string;

        /**剧情标题*/
        m_ucTitle: string;
    }

    /**
    * SurveyCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SurveyCfgM {
        /**0ID*/
        m_iID: number;

        /**0类型 单选多选*/
        m_iCondition1: number;

        /**0题目*/
        m_szCondition2: string;

        /**0答案1*/
        m_szOption1: string;

        /**0答案2*/
        m_szOption2: string;

        /**0答案3*/
        m_szOption3: string;

        /**0答案4*/
        m_szOption4: string;
    }

    /**
    * 系统提示字串(defined in xml\SystemParameters.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SysTipsConfigM {
        /**tips ID*/
        m_uiID: number;

        /**tips 描述*/
        m_szTips: string;
    }

    /**
    * 系统参数(defined in xml\SystemParameters.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class SystemParameterConfigM {
        /**参数ID*/
        m_iID: number;

        /**参数数值*/
        m_iValue: number;
    }

    /**
    * TDXMActCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class TDXMActCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * TDXMActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class TDXMActCfgM {
        /**唯一配置*/
        m_uiID: number;

        /**自然日*/
        m_ucDate: number;

        /**条件1-天地玄门类型*/
        m_iCondition1: number;

        /**条件2-奖励类别*/
        m_iCondition2: number;

        /**掉落数量*/
        m_uiDropItemCount: number;

        /**物品总数*/
        m_uiItemCount: number;

        /**奖励物品列表*/
        m_stItemList: Array<TDXMActCfgItem>;
    }

    /**
    * TMDCBActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class TMDCBActCfgM {
        /**唯一配置*/
        m_uiID: number;

        /**显示位置排序*/
        m_ucPos: number;

        /**售卖自然日*/
        m_ucDate: number;

        /**商品显示用标价*/
        m_uiShowPrice: number;

        /**商品实际售价*/
        m_uiPrice: number;

        /**物品id*/
        m_uiThingID: number;

        /**限购数量*/
        m_uiLimitNum: number;
    }

    /**
    * TTBZActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class TTBZActCfgM {
        /**唯一配置ID*/
        m_iID: number;

        /**条件1*/
        m_iCondition1: number;

        /**类型*/
        m_ucType: number;

        /**展示图片名字*/
        m_szIconName: string;

        /**物品总数*/
        m_iItemCount: number;

        /**奖励物品个数*/
        m_stItemList: Array<TTBZCfgItem>;
    }

    /**
    * TTBZCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class TTBZCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * TaskRecommendCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class TaskRecommendCfgM {
        /**唯一配置ID*/
        m_ucID: number;

        /**排序ID*/
        m_ucSortID: number;

        /**类型*/
        m_szType: number;

        /**名称*/
        m_szName: string;

        /**操作类型*/
        m_iOperationType: number;

        /**功能类型*/
        m_iFunctionType: number;

        /**显示等级*/
        m_ucFunctionLevel: number;
    }

    /**
    * TeleportConfigM(defined in xml\Scene.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class TeleportConfigM {
        /**传送点ID*/
        m_iID: number;

        /**传送点名字*/
        m_szName: string;

        /**传送点所在场景ID*/
        m_iSceneID: number;

        /**目标所在场景ID*/
        m_iTargetScene: number;

        /**目标传送点*/
        m_iTargetTransportID: number;

        /**特效ID1*/
        m_szTransportEffect1: string;

        m_bNpcTransport: number;

        /**传送点类型*/
        m_ucType: number;
    }

    /**
    * TeleportEffectM(defined in xml\Scene.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class TeleportEffectM {
        /**特效ID*/
        m_szTransportEffectID: string;

        /**特效X偏移*/
        m_iTransportEffectSetX: number;

        /**特效Y偏移*/
        m_iTransportEffectSetY: number;
    }

    /**
    * ThingConfigM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ThingConfigM {
        /**ID*/
        m_iID: number;

        /**名字*/
        m_szName: string;

        /**描述*/
        m_szDesc: string;

        /**特殊描述*/
        m_szSpecDesc: string;

        /**产出*/
        m_szOutput: string;

        /**用途*/
        m_szUse: string;

        /**大类*/
        m_iMainClass: number;

        /**子类*/
        m_iSubClass: number;

        /**堆叠上限*/
        m_ucPileMax: number;

        /**绑定类型*/
        m_ucBindType: number;

        /**颜色*/
        m_ucColor: number;

        /**掉落档次*/
        m_iDropLevel: number;

        /**是否可交易*/
        m_ucIsBusiness: number;

        /**是否可存入仓库*/
        m_ucIsStore: number;

        /**是否可卖店*/
        m_ucIsSellable: number;

        /**是否可丢弃*/
        m_ucIsDestroy: number;

        /**使用级别下限*/
        m_ucRequiredLevel: number;

        /**职业限制*/
        m_ucProf: number;

        /**性别限制*/
        m_ucGender: number;

        /**卖出价格*/
        m_iSellPrice: number;

        /**卖出价格ID*/
        m_iSellMoneyID: number;

        /**有效期类型*/
        m_ucPersistTimeType: number;

        /**有效期*/
        m_iPersistTime: number;

        /**图标ID*/
        m_szIconID: string;

        /**地表图标ID*/
        m_iGroundIconID: number;

        /**背包里物品类型*/
        m_iBagClass: number;

        /**熔炼信息值*/
        m_uiMeltInfo: number;

        /**宗门仓库捐赠价格*/
        m_uiGuildSell: number;

        /**宗门仓库兑换价格*/
        m_uiGuildBuy: number;

        /**是否自动使用,0不使用*/
        m_ucIsAutoUse: number;

        /**使用次数*/
        m_iUseTimes: number;

        /**功能类型*/
        m_ucFunctionType: number;

        /**特定目标ID*/
        m_iTargetID: number;

        /**使用技能ID*/
        m_iFunctionID: number;

        /**使用技能对应数值*/
        m_iFunctionValue: number;

        /**拍卖行一级分类*/
        m_ucAuctionClass1: number;

        /**拍卖行二级分类*/
        m_ucAuctionClass2: number;

        /**拍卖行三级分类*/
        m_ucAuctionClass3: number;

        /**拍卖行是否强制显示，1是显示*/
        m_ucAuctionForceShow: number;

        /**能否批量使用*/
        m_ucCanBatUse: number;

        /**跨服时能否使用*/
        m_ucKFUse: number;

        /**特效名称*/
        m_iEffectName: number;

        /**装备部位*/
        m_iEquipPart: number;

        /**强化等级*/
        m_ucQHLv: number;

        /**基础属性*/
        m_astBaseProp: Array<EquipPropAtt>;

        /**强化属性*/
        m_astProp: Array<EquipPropAtt>;

        /**额外专有属性*/
        m_stExtProp: EquipPropAtt;

        /**材料ID*/
        m_uiConsumableID: number;

        /**材料数量*/
        m_uiConsumableNumber: number;

        /**祝福值上限，达到此值，必然升级*/
        m_uiLucky: number;

        /**是否取消随机属性*/
        m_ucNoRandProp: number;

        /**武缘套装ID*/
        m_ucWYSuitID: number;

        /**模型ID*/
        m_iModelID: number;

        /**阶级*/
        m_ucStage: number;

        /**0使用转生下限*/
        m_ucRebirthLevel: number;

        /**随机属性*/
        m_iRandProbID: number;

        /**需要魂力等级*/
        m_ucHunLiLevel: number;

        /**0是否可以融合*/
        m_ucIsMerge: number;
    }

    /**
    * TianDiJingJiConfigM(defined in xml\TianDiJingJi.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class TianDiJingJiConfigM {
        /**ID*/
        m_uiID: number;

        /**0称号档次*/
        m_uiClass: number;

        /**天地称号*/
        m_szTitle: string;

        /**天地称号属性*/
        m_astAttrList: Array<TianDiPropAtt>;

        /**0怪物ID*/
        m_uiMonsterID: number;
    }

    /**
    * TianDiPropAtt(defined in xml\TianDiJingJi.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class TianDiPropAtt {
        /**属性id*/
        m_ucPropId: number;

        /**属性值*/
        m_ucPropValue: number;
    }

    /**
    * TianZhuMountM(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class TianZhuMountM {
        /**位置*/
        m_ucPos: number;

        /**名字*/
        m_szShowName: string;

        /**镶嵌等级*/
        m_ucLv: number;

        /**激活所需阶级*/
        m_ucNeedGrade: number;

        /**消耗道具id*/
        m_iItemID: number;

        /**消耗道具数量*/
        m_iItemNum: number;

        /**激活技能id*/
        m_iActSkillId: number;

        /**技能说明*/
        m_szSkillDes: string;

        /**属性信息*/
        m_astPropAtt: Array<EquipPropAtt>;
    }

    /**
    * TimeLimitConfigM(defined in xml\TimeLimit.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class TimeLimitConfigM {
        /**id*/
        m_iID: number;

        /**开启周*/
        m_szOpenWeekDay: string;

        /**开启年*/
        m_ushOpenYear: number;

        /**开启月*/
        m_ucOpenMon: number;

        /**开启日*/
        m_ucOpenDay: number;

        /**开启时间*/
        m_dtOpenTime: string;

        /**当天开启时间段起点*/
        m_dtOpenTimes: Array<string>;

        /**当天开启时间段终点*/
        m_dtCloseTimes: Array<string>;

        /**当天开启时间段起点时间戳*/
        m_aOpenTimeStamps: Array<number>;

        /**当天开启时间段终点时间戳*/
        m_aCloseTimeStamps: Array<number>;
    }

    /**
    * 称号列表(defined in xml\Achievement.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class TitleListConfigM {
        /**平台*/
        m_usPlatId: number;

        /**称号 ID*/
        m_ucTitleID: number;

        /**称号类型*/
        m_ucTitleType: number;

        /**称号显示页签*/
        m_ucDisplay: number;

        /**需对应的成就id，0表示同成就无关*/
        m_uiAchiId: number;

        /**称号图片ID*/
        m_uiImageID: number;

        /**称号 名称*/
        m_ucTitleName: string;

        /**0是否按万分比计算属性*/
        m_bIsPercent: number;

        /**附加被动技能属性*/
        m_stPropAtt: Array<EquipPropAtt>;

        /**获取条件的文字说明*/
        m_szDesc: string;

        /**可叠加上限*/
        m_uiAddNum: number;

        /**0材料ID*/
        m_iConsumeID: number;
    }

    /**
    * TwoIntElement(defined in xml\Common.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class TwoIntElement {
        /**第一个值*/
        m_uiOne: number;

        /**第二个值*/
        m_uiTwo: number;
    }

    /**
    * VIPAdCfgM(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class VIPAdCfgM {
        /**VIP等级*/
        m_iVipLv: number;

        /**0模型类型*/
        m_iModelType: number;

        /**0模型ID*/
        m_iModeID: number;

        /**0武器ID*/
        m_iWeaponID: number;

        /**0坐标X*/
        m_iPointX: number;

        /**0坐标Y*/
        m_iPointY: number;

        /**0比例*/
        m_iRate: number;
    }

    /**
    * VIP—BOSS(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class VIPBossCfgM {
        /**0Difficult*/
        m_ucNandu: number;

        /**0怪物ID*/
        m_MonsterID: number;

        /**0怪物类型*/
        m_iIMonsterType: number;

        /**0等级*/
        m_iLevel: number;

        /**0掉落*/
        m_iItemID: Array<number>;

        /**0奖励目标职业*/
        m_iProf: Array<number>;

        /**0进入等级上限*/
        m_iLevelUp: number;

        /**0区域名称*/
        m_sAreaName: string;
    }

    /**
    * VIPFunctionConfigM(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class VIPFunctionConfigM {
        
        m_ucType: number;

        m_ucOpenLevel: number;
    }

    /**
    * VIPMonthParameterConfigM(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class VIPMonthParameterConfigM {
        
        m_uiID: number;

        m_aiValue: Array<number>;

        m_ucDisplayType: number;
    }

    /**
    * VIPParameterConfigM(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class VIPParameterConfigM {
        /**排序*/
        m_iOrder: number;

        /**特权类型 0-3*/
        m_ucPriType: number;

        /**id*/
        m_iID: number;

        m_aiValue: Array<number>;

        /**显示类型*/
        m_ucDisplayType: number;

        /**VIP等级0的数值，单独处理 */
        m_iVIP0: number;

        /**特权说明*/
        m_szDesc: string;
    }

    /**
    * VIPPriHYFuncM(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class VIPPriHYFuncM {
        /**唯一配置ID*/
        m_ucID: number;

        /**排序ID*/
        m_ucOrderID: number;

        /**特权类型 0-3*/
        m_iPriLv: number;

        /**对应的活跃等级*/
        m_iHYLv: number;

        /**对应的活动ID*/
        m_iActID: number;

        /**对应的功能ID*/
        m_iFuncID: number;

        /**对应的功能等级ID*/
        m_iFuncIDLevel: number;

        /**标题说明*/
        m_szTitle: string;

        /**关键字,对应的积累类型*/
        m_ucType: number;

        /**当前类型下，对应的索引（副本是副本id，任务是任务类型，物品是物品id)*/
        m_uiTypeIndex: number;

        /**完成标准,副本、物品是对应的次数，物品是数量，时间是单位秒。根据各类型，有不同的含义*/
        m_uiTimes: number;

        /**奖励的活跃度*/
        m_ucGiveExp: number;

        /**参与条件*/
        m_szJoinDesc: string;

        /**活动说明*/
        m_szRuleDesc: string;
    }

    /**
    * VIPPriHYParamM(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class VIPPriHYParamM {
        /**排序*/
        m_iOrder: number;

        /**特权类型 0-3*/
        m_ucPriType: number;

        /**id*/
        m_iID: number;

        m_aiValue: Array<number>;

        /**显示类型*/
        m_ucDisplayType: number;

        /**特权说明*/
        m_szDesc: string;
    }

    /**
    * VIPRebateM(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class VIPRebateM {
        /**vip等级*/
        m_iVIPLv: number;

        /**双倍达成奖励额度*/
        m_iExtVal: number;

        /**充值返利万分比*/
        m_iReabtePre: number;
    }

    /**
    * VIPShopLimitNumber(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class VIPShopLimitNumber {
        /**0限购*/
        m_uiXiangou: number;

        /**0白银价格*/
        m_uiJiage: number;

        /**0白银折扣*/
        m_uiZhekou: number;
    }

    /**
    * VipReserveTimesM(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class VipReserveTimesM {
        /**需要保留次数的ID，可以是副本ID*/
        m_iID: number;
    }

    /**
    * VipShopCfgM(defined in xml\VIP.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class VipShopCfgM {
        /**0ID*/
        m_iID: number;

        /**0页签*/
        m_ucYeqian: number;

        /**0日期*/
        m_ucDay: number;

        /**物品ID*/
        m_iItemID: number;

        /**物品数量*/
        m_iItemcount: number;

        /**0原价*/
        m_uiYuanJia: number;

        /**0白银限购*/
        m_stBYXiangou: Array<VIPShopLimitNumber>;

        /**0黄金限购*/
        m_stHJXiangou: Array<VIPShopLimitNumber>;

        /**0钻石限购*/
        m_stZSXiangou: Array<VIPShopLimitNumber>;
    }

    /**
    * WHJXCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WHJXCfgItem {
        /**0物品ID*/
        m_iID: number;

        /**0物品个数*/
        m_iCount: number;

        /**0占领时间*/
        m_iCondition: number;
    }

    /**
    * WHJXCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WHJXCfgM {
        /**0唯一配置ID*/
        m_iType: number;

        /**0要求战力*/
        m_iFight: number;

        /**物品列表*/
        m_stItemList: Array<WHJXCfgItem>;
    }

    /**
    * 我要变强-变强等级(defined in xml\BianQiang.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WYBQConfigM {
        /**系统*/
        m_iSystem: number;

        /**等级*/
        m_iLevel: number;

        /**战斗力上限*/
        m_iTop: number;

        /**该等级的战力*/
        m_iGrade: Array<WYBQGrade>;
    }

    /**
    * 战斗力档次(defined in xml\BianQiang.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WYBQGrade {
        /**战力值*/
        m_iValue: number;
    }

    /**
    * 我要变强-提升途径(defined in xml\BianQiang.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WYBQTuJingConfigM {
        /**系统*/
        m_iSystem: number;

        /**小类*/
        m_iSubClass: number;

        /**图标*/
        m_iIcon: number;

        /**描述*/
        m_szMiaoshu: string;

        /**功能类型*/
        m_iFunctionClass: number;

        /**功能*/
        m_iFunctionName: number;

        /**功能值*/
        m_iOtherValue: number;
    }

    /**
    * WYTreasureHuntCfgM(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WYTreasureHuntCfgM {
        /**0寻宝ID*/
        m_iID: number;

        /**美人ID*/
        m_stConditionList: Array<WYXBConditionInfo>;
    }

    /**
    * 武缘ID(defined in xml\Beauty.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WYXBConditionInfo {
        /**显示说明*/
        m_szShowDesc: string;

        /**0武缘界数*/
        m_ucLabel: number;

        /**0武缘阶数*/
        m_iStage: number;
    }

    /**
    * WYYZBuff(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WYYZBuff {
        /**BuffID*/
        m_iID: number;

        /**价格*/
        m_iPrice: number;
    }

    /**
    * WYYZItem(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WYYZItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * 武缘远征 关卡设置(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WYYZLevelCfgM {
        /**0关卡*/
        m_iID: number;

        /**0开启所需武缘数量*/
        m_iNum: number;

        /**奖励物品个数*/
        m_stItemList: Array<WYYZItem>;

        /**Buff个数*/
        m_stBuffList: Array<WYYZBuff>;

        /**0通关宝箱*/
        m_iLevelReward: number;
    }

    /**
    * 武缘远征 武缘匹配(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WYYZPetCfgM {
        /**0散仙ID*/
        m_iID: number;

        /**0被动buff*/
        m_iBuff: number;

        /**0特殊技能*/
        m_iTSSkill: number;

        /**0普攻*/
        m_iPGSkill: number;
    }

    /**
    * WingCreateM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WingCreateM {
        /**0ID*/
        m_iID: number;

        /**名字*/
        m_szName: string;

        /**0合成成功率*/
        m_iSuccessRate: number;

        /**合成结果*/
        m_astProduct: Array<WingProduct>;

        /**合成材料A*/
        m_astMaterialA: Array<WingMaterial>;

        /**合成材料B*/
        m_astMaterialB: Array<WingMaterial>;

        /**合成材料C*/
        m_astMaterialC: Array<WingMaterial>;
    }

    /**
    * WingMaterial(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WingMaterial {
        
        m_iId: number;

        m_iNum: number;
    }

    /**
    * WingProduct(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WingProduct {
        
        m_iCreateWingId: number;

        m_iRate: number;
    }

    /**
    * WingStrengthM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WingStrengthM {
        /**0装备ID*/
        m_iID: number;

        /**0等级*/
        m_iLv: number;

        /**名字*/
        m_szName: string;

        /**属性*/
        m_astPropAtt: Array<EquipPropAtt>;

        /**0颜色*/
        m_iColor: number;

        /**0模型ID*/
        m_iModelID: number;

        /**升级消耗材料ID*/
        m_iConsumeID: number;

        /**升级消耗材料ID*/
        m_iConsumeNum: number;
    }

    /**
    * 世界boss奖励(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WorldBossRewardCfgM {
        /**BossID*/
        m_iBossID: number;

        /**0周期类型*/
        m_iType: number;

        /**0更换日*/
        m_iSwitchDay: number;

        /**0周期日*/
        m_iDay: number;

        /**0显示掉落*/
        m_iShowDrop: number;

        /**0第1掉落*/
        m_iTopDrop: number;

        /**0参与掉落*/
        m_iParticipateDrop: number;
    }

    /**
    * WorldCupIndexCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WorldCupIndexCfgM {
        /**索引类型*/
        m_iType: number;

        /**索引id*/
        m_iID: number;

        /**索引内容*/
        m_szDesc: string;
    }

    /**
    * 世界拍卖(defined in xml\GuildArea.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WorldPaiMaiCfgItem {
        /**0物品1ID*/
        m_iID: number;

        /**0每组个数*/
        m_iCountPerSets: number;

        /**0组数*/
        m_iSetsCount: number;

        /**0一口价*/
        m_iMaxPrice: number;

        /**0概率*/
        m_iProb: number;
    }

    /**
    * 世界拍卖(defined in xml\GuildArea.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class WorldPaiMaiCfgM {
        /**0活动ID*/
        m_iActID: number;

        /**0第X周*/
        m_iWeek: number;

        /**0排名*/
        m_iRank: number;

        /**0功能ID*/
        m_iFunID: number;

        /**0物品ID数*/
        m_iItemCount: number;

        /**0物品*/
        m_stItemList: Array<WorldPaiMaiCfgItem>;
    }

    /**
    * XSYGActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class XSYGActCfgM {
        /**0唯一配置ID*/
        m_iID: number;

        /**0活动天数*/
        m_ucDay: number;

        /**0开始时间*/
        m_dtStartTime: string;

        /**0结束时间*/
        m_dtEndTime: string;

        /**0每次购买单价*/
        m_iCharge: number;

        /**0单人每轮购买上限*/
        m_iRoleLimit: number;

        /**0单平台大奖激活次数*/
        m_iTotalLimit: number;

        /**0大奖价值*/
        m_iPrizeValue: number;

        /**0大奖ID*/
        m_iPrizeID: number;

        /**0大奖数量*/
        m_iPrizeCount: number;

        /**0物品总数*/
        m_iItemCount: number;

        /**物品列表*/
        m_stItemList: Array<XSYGCfgItem>;
    }

    /**
    * XSYGCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class XSYGCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * 血战封魔排名奖励(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class XZFMRankCfgM {
        /**最小排名*/
        m_iRankMin: number;

        /**最大排名*/
        m_iRankMax: number;

        /**展示类型*/
        m_iZhanshiType: number;

        /**展示ID*/
        m_iZhanshiID: number;

        /**掉落*/
        m_iDropID: number;

        /**提示*/
        m_szTips: string;

        /**奖励物品个数*/
        m_stItemList: Array<XZFMRewardItem>;
    }

    /**
    * 血战封魔个人奖励(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class XZFMRewardCfgM {
        /**唯一ID*/
        m_iID: number;

        /**奖励条件积分*/
        m_iRewardValue: number;

        /**奖励物品个数*/
        m_stItemList: Array<XZFMRewardItem>;

        /**提示*/
        m_szTips: string;
    }

    /**
    * XZFMRewardItem(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class XZFMRewardItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * XianYuanPropCfgM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class XianYuanPropCfgM {
        /**等级*/
        m_usLevel: number;

        /**每次点击消耗*/
        m_uiConsumableNum: number;

        /**当前等级属性*/
        m_astProp: Array<EquipPropAtt>;
    }

    /**
    * YSZCActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class YSZCActCfgM {
        /**唯一配置ID*/
        m_iID: number;

        /**类型. 1-排行奖励, 2-积分奖励*/
        m_ucType: number;

        /**条件下限*/
        m_iLimitMin: number;

        /**条件上限*/
        m_iLimitMax: number;

        /**对应掉落方案*/
        m_iDropID: number;

        /**对应的资源名字*/
        m_szIconName: string;
    }

    /**
    * YiBenWanLiActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class YiBenWanLiActCfgM {
        /**类型*/
        m_iType: number;

        /**购买价格*/
        m_iValue: number;

        /**领取时间*/
        m_iPara: number;

        /**奖励物品个数*/
        m_stItemList: Array<YiBenWanLiCfgItem>;
    }

    /**
    * YiBenWanLiCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class YiBenWanLiCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iNumber: number;
    }

    /**
    * ZFEquipMergeM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ZFEquipMergeM {
        /**装备类型*/
        m_iType: number;

        /**装备颜色*/
        m_iColor: number;

        /**装备等级*/
        m_iStage: number;

        /**材料ID*/
        m_iConsumableID: number;

        /**材料数量*/
        m_iConsumableNumber: number;
    }

    /**
    * ZFEquipUpColorM(defined in xml\Thing.Main.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ZFEquipUpColorM {
        /**祝福系统类型*/
        m_iType: number;

        /**装备颜色*/
        m_iColor: number;

        /**装备等级*/
        m_iStage: number;

        /**材料数量*/
        m_iConsumableNumber: number;

        /**材料ID*/
        m_iConsumableID: number;
    }

    /**
    * 斩妖除魔(defined in xml\ZYCM.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ZYCMCfgM {
        /**0怪物ID*/
        m_iID: number;

        /**0开服第几周使用*/
        m_iWeek: number;

        /**0等级*/
        m_iLevel: number;

        /**0怪物类型*/
        m_iIMonsterType: number;

        /**0层数*/
        m_iFloor: number;

        /**0掉落ID*/
        m_iDropID: number;

        /**0双倍掉落ID*/
        m_iDoubleDropID: number;

        /**0额外掉落ID*/
        m_iExtDropID: number;

        /**0价格*/
        m_iPrice: number;

        /**奖励物品*/
        m_iItemID: Array<number>;

        /**0战力上限*/
        m_iFightLimit: number;
    }

    /**
    * ZYJ_CZFLActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ZYJ_CZFLActCfgM {
        /**唯一配置ID*/
        m_iID: number;

        /**条件1*/
        m_iCondition1: number;

        /**物品总数*/
        m_iItemCount: number;

        /**奖励物品个数*/
        m_stItemList: Array<ZYJ_CZFLCfgItem>;
    }

    /**
    * ZYJ_CZFLCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ZYJ_CZFLCfgItem {
        /**物品ID*/
        m_iID: number;

        /**物品个数*/
        m_iCount: number;
    }

    /**
    * 资源找回(defined in xml\ZYZH.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ZYZHCfgM {
        /**ID*/
        m_iID: number;

        /**名字*/
        m_szName: string;
    }

    /**
    * 祝福配置(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ZhuFuConfigM {
        /**0等级*/
        m_iID: number;

        /**0类型*/
        m_ucType: number;

        /**0猎魂开孔数量*/
        m_ucLHCount: number;

        /**0开启技能ID*/
        m_iSkillID: number;

        /**0材料ID*/
        m_iConsumableID: number;

        /**0万能进阶丹*/
        m_iUniversalItem: number;

        /**0限制材料数组*/
        m_stLimitIDList: Array<OneIntElement>;

        /**0材料数量*/
        m_iConsumableNumber: number;

        /**0祝福值上限*/
        m_iLucky: number;

        /**0模型1ID*/
        m_iModelID: number;

        /**0模型1名称*/
        m_szName: string;

        /**0升阶属性*/
        m_astAttrList: Array<EquipPropAtt>;
    }

    /**
    * 祝福属性丹配置(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ZhuFuDrugConfigM {
        /**0等级*/
        m_iID: number;

        /**0类型*/
        m_ucType: number;

        /**0开启阶级*/
        m_uiOpenLevel: number;

        /**0开启技能ID*/
        m_iItemID: number;

        /**0材料1ID*/
        m_iLevelMax: number;

        /**属性*/
        m_astAttrList: Array<EquipPropAtt>;
    }

    /**
    * 祝福系统装备对应表(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ZhuFuEquipMapM {
        /**0等级*/
        m_iID: number;

        /**对应数组*/
        m_astEquipPartList: Array<EquipPartMap>;
    }

    /**
    * ZhuFuImageConfigM(defined in xml\ZhuFuXiTong.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ZhuFuImageConfigM {
        /**时装形象id*/
        m_uiImageId: number;

        /**0对应系统*/
        m_iZhuFuID: number;

        /**0排序ID*/
        m_iSortID: number;

        /**0功能跳转*/
        m_iFuncID: number;

        /**0屏蔽*/
        m_bPingbi: number;

        /**0模型1ID*/
        m_iModelID: number;

        /**0获取条件*/
        m_szCondition: string;

        /**时装模型名称, 最大支持8个中文*/
        m_szModelName: string;

        /**0等级*/
        m_iLevel: number;

        /**此形象可应用的最低等级*/
        m_uiMinLevel: number;

        /**0是否限时*/
        m_ucTime: number;

        /**0培养道具ID*/
        m_iConsumeID: number;

        /**0需要的道具数量*/
        m_iConsumableCount: number;

        /**0掉到多少级*/
        m_iRangeMin: number;

        /**0掉到多少级*/
        m_iRangeMax: number;

        /**0提升概率*/
        m_iGaiLv: number;

        /**附加属性*/
        m_astProp: Array<EquipPropAtt>;
    }

    /**
    * ZpxbActCfgM(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ZpxbActCfgM {
        /**召唤档次，1~3*/
        m_ucSubType: number;

        /**价值，充值元宝数量*/
        m_iValue: number;

        /**召唤Boss的ID*/
        m_iBossID: number;

        /**展示用的Boss掉落方案ID*/
        m_iBossDispDropID: number;

        /**保底物品个数*/
        m_astDrops: Array<ZpxbDropCfgItem>;
    }

    /**
    * ZpxbDropCfgItem(defined in xml\Activity.xml)
    * @author TsClassMaker@
    * @exports
    **/
    export class ZpxbDropCfgItem {
        /**掉落ID*/
        m_iID: number;
    }

    /**
    * UnitPosition(defined in tsClassTmpl.ts.template)
    * @author TsClassMaker@%pcName%
    * @exports
    **/
    export class UnitPosition {
        /**x坐标*/
        m_uiX: number;

        /**y坐标*/
        m_uiY: number;
    }
}
