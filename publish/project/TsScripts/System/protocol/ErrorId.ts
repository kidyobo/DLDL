/**
* 错误码集合(defined in Errno.config.xml.xml)
* @author TsClassMaker@
* @exports
**/
export enum ErrorId {
    /**成功*/
    EQEC_Success = 0, 

    /**空对象指针*/
    EQEC_NullObjPtr = 1, 

    /**消息中存在非法字段!*/
    EQEC_InvalidParam = 2, 

    /**参数无效!*/
    EQEC_InvalidArgument = 3, 

    /**宗门数据库操作失败*/
    EQEC_Guild_DBFailed = 4, 

    /**找不到配置项*/
    EQEC_Config_NullConfigItem = 5, 

    /**系统繁忙，请稍后再试！*/
    EQEC_RoleDB_SqlExecuteFailed = 6, 

    /**未找到角色信息*/
    EQEC_RoleDB_RoleNotFound = 7, 

    /**数据库操作失败*/
    EQEC_Friend_DBFailed = 8, 

    /**非法配置*/
    EQEC_Invalid_Configuration = 9, 

    /**非法空间索引*/
    EQEC_Invalid_Space_Index = 10, 

    /**错误Uin*/
    EQEC_Invalid_Uin = 11, 

    /**未知错误*/
    EQEC_Default = 12, 

    /**服务器正忙，请稍后重试！*/
    EQEC_ServerBusy = 13, 

    /**服务器正忙，请稍后重试！*/
    EQEC_Server_Error = 14, 

    /**服务器正忙，请稍后重试！*/
    EQEC_Operate_Timeout = 15, 

    /**您没有权限进行此类操作哦。*/
    EQEC_No_Permission = 16, 

    /**操作太快啦，要不您先歇会？*/
    EQEC_Request_Too_Frequently = 17, 

    /**您呼叫的对象目前已下线！*/
    EQEC_Role_Offline = 18, 

    /**登录错误！*/
    EQEC_Login_Default = 19, 

    /**服务器人满啦，满啦！等待几分钟后再重新尝试吧^^*/
    EQEC_Login_NoSpace = 20, 

    /**登出游戏都出错！*/
    EQEC_Logout_Default = 21, 

    /**人一倒霉啊，移动都出错。*/
    EQEC_Move_Default = 22, 

    /**人一倒霉啊，攻击都出错。*/
    EQEC_Cast_Default = 23, 

    /**人一倒霉啊，跳转都出错。*/
    EQEC_Transport_Default = 24, 

    /**任务出错啦！*/
    EQEC_Quest_Default = 25, 

    /**哎呀，副本出错啦！*/
    EQEC_Pinstance_Default = 26, 

    /**NPC正在忙呢，稍等一会哟，亲。*/
    EQEC_NPC_Default = 27, 

    /**伙伴好象出了点问题，等会儿再试试！*/
    EQEC_Pet_Default = 28, 

    /**组队失败*/
    EQEC_Team_Default = 29, 

    /**快捷键设置错误*/
    EQEC_Shortcut_Default = 30, 

    /**没有相应的权限*/
    EQEC_Guild_NoPrivilege = 32, 

    /**扣除宗门创建符失败*/
    EQEC_Guild_FailedDelCreateGuildItem = 33, 

    /**寄售失败!*/
    EQEC_SellFailed = 34, 

    /**亲，这条线不能进入竞技场哦。请切换到1线进入竞技场吧。*/
    EQEC_PVP_PINSTANCE_NOZONE = 10248, 

    /**副本已满，请稍后再来尝试吧。*/
    EQEC_PVP_PINSTANCE_ROLE_MAXNUM = 10249, 

    /**错误的复活类型*/
    EQEC_Revival_InvalidRevivalType = 39, 

    /**回购失败*/
    EQEC_NPC_BuyBack_Error = 40, 

    /**拾取速度过快*/
    EQEC_Pickup_More_Quick = 41, 

    /**没有足够的货币来升级此技能！*/
    EQEC_Operate_Skill_Wrong_ItemlNum = 10245, 

    /**职业不满足要求*/
    EQEC_Operate_Skill_Wrong_Profession = 10246, 

    /**亲，今天的日常任务已经领取完了，明天再来吧。*/
    EQEC_Daily_Quest_TooMany = 10247, 

    /**亲，道具已经过期*/
    EQEC_ITEM_TIMEOUT = 10259, 

    /**财神爷, 一次兑换最多 %d 魂币哦, 请分成多次兑换吧~~*/
    EQEC_Gold_UpLimit = 10287, 

    /**不能移动物品位置*/
    EQEC_PET_THINGMOVED = 10289, 

    /**亲，这个道具已经过期了*/
    EQEC_ITEM_NOTRANSPORTITEM = 10252, 

    /**个人账户支付失败: 请访问 <u><a href="http://aq.qq.com/qbjz" target="_blank">http://aq.qq.com/qbjz</a></u>查看详情. 您设置了Q币Q点保护, 此业务不支持验证密保. 如需支付, 请暂时允许消费后重新尝试.*/
    EQEC_Need_MBA = 10292, 

    /**等级不够*/
    EQEC_Operate_Skill_Wrong_Level = 10243, 

    /**此账号由于%s原因被封号*/
    EQEC_Kick_Reason = 10294, 

    /**此账号被游戏管理员封号！*/
    EQEC_OSS_FORBIDDEN = 10295, 

    /**对不起，您要查询的好友跟你不在同一条线上或已经离线哟*/
    EQEC_Friend_NotSameZone = 10258, 

    /**该功能还未开放, 敬请期待~~*/
    EQEC_Module_Disabled = 10290, 

    /**亲，操作太频繁了，请稍后再试吧。*/
    EQEC_Operate_Busy = 10299, 

    /**此账号已经被禁言了！详细信息请访问游戏官网公告。*/
    EQEC_Forbid_Talking = 10293, 

    /**#M;%s#不符合副本进入等级*/
    EQEC_Pinstance_SomeBody_Cannot_Enter = 10285, 

    /**亲，你的寄售数量已经达到最大提单数了。*/
    EQEC_PER_ROLE_MAX_PSB_NUMBER = 10303, 

    /**您的帐号已在其它地方登录，连接已断开！*/
    EQEC_RE_LOGIN = 10296, 

    /**物品下架失败*/
    EQEC_CancelMy_Fail = 10298, 

    /**副本不能传送*/
    EQEC_ITEM_TRANSPORT_INPINSTANCE = 10307, 

    /**战斗状态不能传送*/
    EQEC_ITEM_TRANSPORT_INFIGHT = 10308, 

    /**等级已到达上限并且经验已满，无法获得经验。*/
    EQEC_Attribute_Level_EXP_ReachMax = 10310, 

    /**长老人数已达到上限*/
    EQEC_GUILD_TOOMANY_ELDER = 10311, 

    /**副宗主人数已达到上限*/
    EQEC_GUILD_TOOMANY_VICECHAIRMAN = 10312, 

    /**管理员人数已达到上限*/
    EQEC_GUILD_TOOMANY_ADMINISTRATOR = 10313, 

    /**亲，需要对方在线哦*/
    EQEC_GUILD_TARGET_NOTONLINE = 10314, 

    /**需要对方为副宗主*/
    EQEC_GUILD_TARGET_GRADE_TOOLOW = 10315, 

    /**您的经验已达上限。*/
    EQEC_EatBook_Max_Experience = 10316, 

    /**您的经验已达上限，无法再获得经验。*/
    EQEC_EatBookFail_Max_Experience = 10317, 

    /**对不起，该副本所需要队伍人数与你队伍人数不符*/
    EQEC_TEAM_NUMBER_WRONG = 10320, 

    /**你正在排队系统中排其他副本，不能进入*/
    EQEC_IN_PINSTANCE_QUEUE = 10321, 

    /**本副本只允许单人进入!*/
    EQEC_Pinstance_SingleRoleLimit = 10325, 

    /**你申请了太多宗门*/
    EQEC_GUILD_APPLY_TOOMANY = 10326, 

    /**您已提交申请，请耐心等待*/
    EQEC_GUILD_APPLY_ACCEPT = 10327, 

    /**您已撤销申请*/
    EQEC_GUILD_APPLY_WITHDRAW = 10328, 

    /**副本里不能发起组队请求*/
    EQEC_TEAM_IN_PINSTANCE = 10332, 

    /**兑换平台受限*/
    EQEC_CDK_ERROR_FIVE = 49998, 

    /**您得到了治疗!*/
    EQEC_NPC_HEALOK = 10335, 

    /**#HD;%s#活动已经开启*/
    EQEC_ACTIVITY_START = 10343, 

    /**你的物品使用失败！*/
    EQEC_CAN_NOT_FLIGHT = 10348, 

    /**物品已通过邮件发放*/
    EQEC_BAGFULL_SENDMAIL = 10350, 

    /**抱歉，您的背包暂时无法使用，请联系客服人员处理！*/
    EQEC_BAG_LOCKED = 10352, 

    /**您的历练不足，无法升级技能啦！*/
    EQEC_Operate_Skill_Energy_Limit = 10359, 

    /**您的宗门贡献度不足，无法升级技能啦！*/
    EQEC_Operate_Skill_Contribution_Limit = 10360, 

    /**材料不足*/
    EQEC_Limit_Item = 10361, 

    /**抱歉，您的%s不足%d%s*/
    EQEC_THING_NOT_ENOUGH = 10378, 

    /**抱歉，您的货币不足%s*/
    EQEC_MONEY_NOT_ENOUGH = 10379, 

    /**服务器已满，请至其他服务器注册*/
    EQEC_CANNOT_CREATE_ROLE = 10508, 

    /**亲，背包满了，请清理背包后再来扫荡！*/
    EQEC_SWEEP_FULL_PKG = 10509, 

    /**亲，扫荡次数用完啦，买起吧！*/
    EQEC_SWEEP_COUNT_NOT_ENOUGH = 10510, 

    /**亲，不够钱扫荡啦，充个值吧！*/
    EQEC_SWEEP_MONEY_NOT_ENOUGH = 10511, 

    /**亲，这个副本要先通一次关才可以扫荡哟！*/
    EQEC_SWEEP_PIN_NOT_PASS = 10512, 

    /**亲，扫荡次数到上限了，不能再买啦！*/
    EQEC_SWEEP_COUNT_IS_ENOUGH = 10513, 

    /**一种类型的猎魂只能装备一个*/
    EQEC_CRYSTAL_EQUIP_ONE = 10516, 

    /**猎魂背包已满，请清理后再继续*/
    EQEC_CRYSTAL_CONTAINER_FULL = 10517, 

    /**#M;%s#运气奇佳，通过猎魂获得#I=%d# !*/
    EQEC_CRYSTAL_LUCKY = 10519, 

    /**#M;%s#历尽千辛万苦终于将#I=%d#升级到了#O;%d级# !*/
    EQEC_CRYSTAL_LEVEL_UP = 10520, 

    /**亲，#M;%s# 正在扫荡中，不能进副本哟！*/
    EQEC_SWEEP_ING = 10523, 

    /**亲，恭喜你扫荡完成了！*/
    EQEC_SWEEP_FINISH = 10524, 

    /**#M;%s#神力爆发，激活了#HD;%s##HD;%s#获得大量属性提升！！！*/
    EQEC_STARTHRONE_STRATUMNOTIFY = 10531, 

    /**#M;%s#神力爆发，激活了整个#HD;%s#，能力爆棚！！！*/
    EQEC_STARTHRONE_CONSTELLATIONNOTIFY = 10532, 

    /**恭喜#M;[%s]#在#HD;【竞技场】#中势不可挡，已经获得 #O;%d# 连胜！！*/
    EQEC_PVP_TIMES_MSG = 10534, 

    /**恭喜#M;[%s]#在#HD;【称霸九州】#中势不可挡，已经获得 #O;%d# 连胜！！*/
    EQEC_CROSS_PVP_TIMES_MSG = 10535, 

    /**对不起，本次登录已失效，请从主页重新登录！*/
    EQEC_LOGINKEY_FAILED = 10536, 

    /**您的伙伴品阶不足无法升级*/
    EQEC_PETSTAR_TOOLOW = 10537, 

    /**亲，你必须在购买该物品的商人才可以退款哦*/
    EQEC_CANNOTTUIKUAN = 10538, 

    /**宗门BOSS已召唤，过一会儿再来试试吧*/
    EQEC_GUILDBOSS_EXIST = 10541, 

    /**该宗门召唤BOSS次数已用完，请明天再来*/
    EQEC_GUILDBOSS_NO_TIMS = 10544, 

    /**你的副本次数用完了*/
    EQEC_Pinstance_JoinCount_Full = 10550, 

    /**亲，今天的门派任务已经领取完了，明天再来吧。*/
    EQEC_Prof_Quest_TooMany = 10556, 

    /**请先完成已经领取的门派任务哦，亲。*/
    EQEC_ProfAccepted = 10557, 

    /**哎呀，今天的门派任务已经发放完啦，要不您明天再来领取吧？*/
    EQEC_ProfTooMuch = 10558, 

    /**亲，今天的皇榜任务已经领取完了，明天再来吧。*/
    EQEC_HuangBang_Quest_TooMany = 10559, 

    /**请先完成已经领取的皇榜任务哦，亲。*/
    EQEC_HuangBangAccepted = 10560, 

    /**哎呀，今天的皇榜任务已经发放完啦，要不您明天再来领取吧？*/
    EQEC_HuangBangTooMuch = 10561, 

    /**亲，已经在一个副本中，不能进入另一个副本*/
    EQEC_Pintance_Trans_In_One_Instance = 10566, 

    /**亲，今天的宗门任务已经领取完了，明天再来吧。*/
    EQEC_GuildDaily_Quest_TooMany = 10567, 

    /**请先完成已经领取的宗门任务哦，亲。*/
    EQEC_GuildDailyAccepted = 10568, 

    /**哎呀，今天的宗门任务已经发放完啦，要不您明天再来领取吧？*/
    EQEC_GuildDailyTooMuch = 10569, 

    /**亲，今天的前线任务已经领取完了，明天再来吧。*/
    EQEC_FrontLine_Quest_TooMany = 10570, 

    /**请先完成已经领取的前线任务哦，亲。*/
    EQEC_FrontLineAccepted = 10571, 

    /**哎呀，今天前线任务已经发放完啦，要不您明天再来领取吧？*/
    EQEC_FrontLineTooMuch = 10572, 

    /**亲，今天的护送任务已经领取完了，明天再来吧。*/
    EQEC_GuoYun_Quest_TooMany = 10573, 

    /**请先完成已经领取的护送任务哦，亲。*/
    EQEC_GuoYunAccepted = 10574, 

    /**哎呀，今天护送任务已经发放完啦，要不您明天再来领取吧？*/
    EQEC_GuoYunTooMuch = 10575, 

    /**我国的#M;%s#在#CJ;[%s]#击杀了#C=0xe6363e;%s#的#ZW;%s##M;%s#！*/
    EQEC_PVPKILL_BROADCAST = 10576, 

    /**我国的#ZW;%s##M;%s#在#CJ;[%s]#被#C=0xe6363e;%s#的#M;%s#击杀！*/
    EQEC_PVPBEKILL_BROADCAST = 10577, 

    /**亲，先完成护送战车再进入副本吧！*/
    EQEC_Pinstance_Have_GuoYun_Quest = 10578, 

    /**#M;%s#鸿运当头，在%s中获得惊世大礼#I=%d# !*/
    EQEC_Drop_Perfect_Thing = 10579, 

    /**不同国家不能添加！*/
    EQEC_Friend_NotSameCountry = 10580, 

    /**猎魂背包满了，亲!*/
    EQEC_Country_Yingling_Crystal_Bag_Full = 10581, 

    /**战斗状态中，不允许此操作*/
    EQEC_TRANS_FIGHTING = 10582, 

    /**副本中，不允许此操作*/
    EQEC_TRANS_PINISTANCE = 10583, 

    /**定身或昏迷状态中，不允许此操作*/
    EQEC_TRANS_NOMOVE = 10584, 

    /**目标在副本中，不允许此操作*/
    EQEC_TRANS_TARGET_PINISTANCE = 10585, 

    /**目标不在线，不允许此操作*/
    EQEC_TRANS_TARGET_NOTONLINE = 10586, 

    /**抽奖失败！*/
    EQEC_LOTTERY_ERROR = 10587, 

    /**目标场景受保护，不允许此操作*/
    EQEC_TRANS_TARGET_NOTALLOW = 10588, 

    /**亲，请先学习上一级的合成配方。*/
    EQEC_CANT_USED_MEGER = 10589, 

    /**背包格子不足，不能领取礼包。*/
    EQEC_CANT_GET_START_ACTIVITY_GIFT = 10590, 

    /**护送状态中，不允许此操作！*/
    EQEC_TRANS_GUOYUN = 10591, 

    /**开服排名活动排行版在开服第一天零点之后可以查看。*/
    EQEC_START_ACTIVITY_RANK_NONE = 10592, 

    /**开服排名活动排行版正在构建，奖励会发放到邮件中，请注意查收*/
    EQEC_START_ACTIVITY_RANK_DOING = 10593, 

    /**开服排名活动排行版还没有构建，暂时不能领取奖励*/
    EQEC_START_ACTIVITY_RANK_NO_GET = 10594, 

    /**背包格子数不足，不能自动合成物品。*/
    EQEC_START_ITEM_AUTO_MERGER_GRID_LACK = 10595, 

    /**宗门保卫战即将开始，活动结束后再召唤吧！*/
    EQEC_CANT_CREATE_BOSS_WHEN_ACTIVITY = 10596, 

    /**请，你已经学会该合成配方了。*/
    EQEC_START_ITEM_MERGER_USED_BEFORE = 10597, 

    /**副本已结束，不能使用桃和杀。*/
    EQEC_PINSTACE_END_CAN_USE_TAOSHA_BUFF = 10598, 

    /**#M;%s%s#在阵营战中大开杀戒，已经#O;%d#连杀！*/
    EQEC_CAMP_BATTLE_CONTINUE_KILL = 10599, 

    /**宗门群英斗活动已经结束*/
    EQEC_GUILD_PVPBATTLE_END = 10600, 

    /**与目标不是同一个宗门，不允许此操作*/
    EQEC_TRANS_NOT_SAME_GUILD = 10601, 

    /**目标无护送任务，不允许此操作*/
    EQEC_TRANS_NOT_HAVE_GUOYUN = 10602, 

    /**#M;%s#的#O;%d#连杀被#M;%s#终结*/
    EQEC_CAMP_END_KILL = 10603, 

    /**该福地已经被其他玩家占据！*/
    EQEC_LANGYAFUDI_ERROR = 10604, 

    /**剩余聚宝点不足*/
    EQEC_FCJB_POINT_LESS_ERROR = 10605, 

    /**兑换次数用尽了*/
    EQEC_FCJB_COUNT_LESS_ERROR = 10606, 

    /**灵狐仙府活动未开启*/
    EQEC_LHXF_NOT_RUNNING_ERROR = 10607, 

    /**您扣除了：%s*/
    EQEC_DELETE_ONE_THING = 10608, 

    /**您扣除了：%s x%d*/
    EQEC_DELETE_MORE_THING = 10609, 

    /**您获得了：%s*/
    EQEC_GET_ONE_THING = 10610, 

    /**您获得了：%s x%d*/
    EQEC_GET_MORE_THING = 10611, 

    /**您获得了：%d %s*/
    EQEC_GET_MORE_CURRENCY = 10612, 

    /**您扣除了：%d %s*/
    EQEC_DELETE_MORE_CURRENCY = 10613, 

    /**亲，请预留足够背包格子，再分解物品！*/
    EQEC_ERR_CODE_10614 = 10614, 

    /**背包空间不足，购买的物品已发送到邮件，请领取。*/
    EQEC_ERR_CODE_10615 = 10615, 

    /**物品被移动，寄售失败！*/
    EQEC_ERR_CODE_10616 = 10616, 

    /**伙伴身上命格满了，不可穿戴*/
    EQEC_ERR_CODE_10617 = 10617, 

    /**命格背包满了，不可脱卸*/
    EQEC_ERR_CODE_10618 = 10618, 

    /**一个伙伴不能穿戴两个相同命格*/
    EQEC_ERR_CODE_10619 = 10619, 

    /**此副本不允许一键完成*/
    EQEC_ERR_CODE_10620 = 10620, 

    /**不在国王选举期间，不能选举。*/
    EQEC_ERR_CODE_10621 = 10621, 

    /**你支持的人不是候选人。*/
    EQEC_ERR_CODE_10622 = 10622, 

    /**等级不足，不能加入宗门*/
    EQEC_ERR_CODE_10623 = 10623, 

    /**对不起，您没有权限参与此活动！*/
    EQEC_ERR_CODE_10624 = 10624, 

    /**您已经获得了这个造型*/
    EQEC_ERR_CODE_10625 = 10625, 

    /**你还没有获得该形象。*/
    EQEC_ERR_CODE_10626 = 10626, 

    /**恭喜获得星语心愿活动祈福奖励 #I=210001;%d#*/
    EQEC_ERR_CODE_10627 = 10627, 

    /**您的等级不足%d级，无法进入该场景！*/
    EQEC_ERR_CODE_10628 = 10628, 

    /**亲，今天的虚空任务已经领取完了，明天再来吧。*/
    EQEC_XuKong_Quest_TooMany = 10629, 

    /**请先完成已经领取的虚空任务哦，亲。*/
    EQEC_XuKongAccepted = 10630, 

    /**哎呀，今天的虚空任务已经发放完啦，要不您明天再来领取吧？*/
    EQEC_XuKongTooMuch = 10631, 

    /**结算时间不允许决斗，请在00:30 后再来 !*/
    EQEC_ERR_CODE_10632 = 10632, 

    /**在九州众生的努力之下累计充值突破#O;%d万钻石#，充值大礼包奖励大幅提升！*/
    EQEC_ERR_CODE_10635 = 10635, 

    /**#C=0xe6363e;%s#的#M;%s#在世界杯竞猜活动中为#C=0xe6363e;<%s>#投注#O;%d万#！*/
    EQEC_ERR_CODE_10636 = 10636, 

    /**#I=%d#已经被抢购一空啦 !*/
    EQEC_GROUPBUY_NO_STOCK = 10637, 

    /**您来晚了，奖励已经被领取光了！*/
    EQEC_QTB_NO_REWARD = 10638, 

    /**亲，您已经有这个伙伴了*/
    EQEC_PET_CARD_USED = 10639, 

    /**副本队伍个数已满，请加入未满的队伍吧！*/
    EQEC_CROSSPIN_ISFULL = 10640, 

    /**跨服战服满了，请稍后再试！*/
    EQEC_CROSSPIN_CACHEISFULL = 10641, 

    /**跨服传送出错，玩家状态不对！*/
    EQEC_TRANS_PINCROSS_FAIL = 10642, 

    /**亲，您已经激活这个宝物了*/
    EQEC_FAQI_CARD_USED = 10643, 

    /**亲，间隔15秒才可以招募一次。*/
    EQEC_TDXM_CD = 10644, 

    /**亲，队伍人员满了，请加入其他队伍。*/
    EQEC_TDXM_JOIN_FULL = 10645, 

    /**亲，您的羽翼未激活，无法使用羽翼形象卡！*/
    EQEC_WING_CARD_NOT_USED = 10646, 

    /**您本日的协助次数已耗尽，无法加入队伍。*/
    EQEC_TDXM_JOIN_HELP = 10647, 

    /**您参与了其他宗门的副本，不能再参与该活动了。*/
    EQEC_ZPFM_JOIN_AGAIN = 10648, 

    /**背包已满，奖励已通过邮件发送。*/
    EQEC_BAG_FULL_MAIL_AWARD = 10649, 

    /**#M;%s#鸿运当头，#HD;开启宝箱#获得惊世大礼#I=%d# x%d !*/
    EQEC_Drop_Perfect_Thing_Chest = 10650, 

    /**有其他玩家正在副本里，请稍后再进入BOSS副本。*/
    EQEC_GUILD_TDFB_PK_ING = 10651, 

    /**加入宗门第一天，不能申请战利品，请您明天再申请。*/
    EQEC_GUILD_TDFB_APPLY = 10652, 

    /**活动已经结束！*/
    EQEC_ACT_IS_OVER = 10653, 

    /**您已经使用了替身娃娃，不能参与活动。*/
    EQEC_TSWW_JOIN = 10654, 

    /**背包密码错误，请重新输入！*/
    EQEC_BAG_PASSWORD_ERROR = 10655, 

    /**密码连续输错5次，已被锁定，请联系客服解锁！*/
    EQEC_BAG_PASSWORD_ERROR_FIVE_TIMES = 10656, 

    /**背包锁定中，请先解锁！*/
    EQEC_BAG_WAS_LOCKED = 10657, 

    /**对不起，只有本国战力第1的宗门才有资格参加！*/
    EQEC_CROSSCITY_RANK = 10658, 

    /**对不起，只有加入宗门满8小时才有资格参加！*/
    EQEC_CROSSCITY_MEMTIME = 10659, 

    /**对不起，贵宗门没有报名参加城战！*/
    EQEC_CROSSCITY_NOCITY = 10660, 

    /**对不起，加入宗门第1天不能领取礼包，明天再来吧！*/
    EQEC_CROSSCITY_NOGIFT = 10661, 

    /**对不起，您的VIP等级太低了！*/
    EQEC_VIP_LEVEL_TOO_LOW = 10662, 

    /**本次刷新%d次，消耗魂币%d点*/
    EQEC_GuoYunRefreshSuccess = 10663, 

    /**本次刷新%d次，消耗魂币%d点，由于魂币不足停止*/
    EQEC_GuoYunRefreshFail = 10664, 

    /**当前战车已经是最高等级啦*/
    EQEC_GuoYunRefreshDoNothing = 10665, 

    /**请先清除冷却时间！*/
    EQEC_DiBang_Time_Limit = 10666, 

    /**来迟了，BOSS已被其他玩家搞死！*/
    EQEC_DiBang_Boss_Killed_Already = 10667, 

    /**您的宗门没占领其他战旗，不能采集战旗！*/
    EQEC_Guild_PVPBATTLE_Tip1 = 10668, 

    /**您今日采集宝箱数量已达上限*/
    EQEC_CAN_NOT_COLLECT = 10669, 

    /**该物品申请人数已达上限，无法再申请了!*/
    EQEC_GUILD_STORE_APPLY_MORE = 10670, 

    /**不刷了，这个战车就是你要的！*/
    EQEC_GuoYunRefreshReject = 10671, 

    /**可使用数已满，请提升等阶后再使用！*/
    EQEC_ERR_CODE_10672 = 10672, 

    /**跨服宗门战报名宗门数已满, 下次早点来!*/
    EQEC_Guild_Apply_Full = 10673, 

    /**宗门战必须在活动当天才能报名!*/
    EQEC_Guild_Day_Apply = 10674, 

    /**宗门战已报名已截止!*/
    EQEC_Guild_Stop_Apply = 10675, 

    /**宗门等级不足, 不能报名!*/
    EQEC_Guild_Level_Invalid = 10676, 

    /**必须是宗主和副宗主才能报名宗门战!*/
    EQEC_Guild_Grade_Invalid = 10677, 

    /**宗门排行没有达到报名条件!*/
    EQEC_Guild_Rank_Invalid = 10678, 

    /**对不起，非仙侣关系不能组队。*/
    EQEC_Team_Not_Couple = 10679, 

    /**您的宗门排名太低，无法参加宗门战*/
    EQEC_Guild_No_Apply = 10680, 

    /**太累了，请等会儿再吆喝！*/
    EQEC_PPSTROE_CALL_TIME = 10681, 

    /**月卡只能在到期前5天内才能进行续费*/
    EQEC_ERR_CODE_10682 = 10682, 

    /**本次免费刷新%d次！*/
    EQEC_GuoYunRefreshFree = 10683, 

    /**跨服宗门战跨服失败!*/
    EQEC_Guild_World_Invalid = 10684, 

    /**跨服宗门战比赛已结束.*/
    EQEC_Guild_Battle_Complete = 10685, 

    /**你此次所在阵营为【#C=0xFF890B;%s#】*/
    EQEC_Camp_Battle_Enter = 10686, 

    /**恭喜#M;%s#成为【#C=0xFF890B;%s#】之首，即将带领其族走向胜利！*/
    EQEC_Camp_Battle_GetTop = 10687, 

    /**您的等级未达到采集物最低采集等级!*/
    EQEC_Collect_Level_Limit = 10688, 

    /**祝贺#M;%s#将神力提升至#C=0xFF890B;%s#，加成了#O;%d#战力，实力爆增，太令人羡慕了！*/
    EQEC_JUYUAN_CHUQI = 10689, 

    /**祝贺#M;%s#将神力提升至#C=0xFF890B;%s#，加成了#O;%d#战力，实力爆增，太令人羡慕了！*/
    EQEC_JUYUAN_ZHONGQI = 10690, 

    /**祝贺#M;%s#将神力提升至#C=0xFF890B;%s#，加成了#O;%d#战力，实力爆增，太令人羡慕了！*/
    EQEC_JUYUAN_HOUQI = 10691, 

    /**祝贺#M;%s#将神力提升至#C=0xFF890B;%s#，加成了#O;%d#战力，实力爆增，太令人羡慕了！*/
    EQEC_JUYUAN_DIANFENG = 10692, 

    /**灵宝过期弹窗通知*/
    EQEC_LINGBAO_TIP = 10693, 

    /**该法阵部位已激活，无法使用*/
    EQEC_ERR_CODE_10694 = 10694, 

    /**你已经拥有%s ，无法再购买*/
    EQEC_LINGBAO_10695 = 10695, 

    /**伙伴功法等级不足，无法使用*/
    EQEC_BEAUTY_FATE_TIP_10696 = 10696, 

    /**无可用的灵宝可续时*/
    EQEC_ERR_LINGBAO_ADDTIME = 10697, 

    /**恭喜#M;%s#成功闯过第#O;%d# 层，荣登#C=0xe6363e;装备副本挑战榜#第#O;%d#名。*/
    EQEC_Pin_All_Top = 10698, 

    /**#M;%s#成功通关海神试炼第#O;%d#层！*/
    EQEC_Pin_Level_Top = 10699, 

    /**#M;%s#将#O;坐骑#进阶到#O;%d# 阶，战力暴增，实在太令人羡慕了。*/
    EQEC_HeroSub_Type_ZuoQi = 10700, 

    /**#M;%s#将#O;神器#进阶到#O;%d# 阶，战力暴增，实在太令人羡慕了。*/
    EQEC_HeroSub_Type_WuHun = 10701, 

    /**#M;%s#将#O;羽翼#进阶到#O;%d# 阶，战力暴增，实在太令人羡慕了。*/
    EQEC_HeroSub_Type_YuYi = 10702, 

    /**#M;%s#将伙伴#C=0xe6363e;%s#，进阶到#O;%d#阶，战力暴增，实在太令人羡慕了。*/
    EQEC_Beauty_StageUp = 10703, 

    /**#M;%s#玩家全身装备达到强化#O;+%d#了,战力大幅度飙升，实在是吊炸天了*/
    EQEC_Equip_Level_All = 10704, 

    /**亲，等级70或VIP1以上才可以创建宗门哦！*/
    EQEC_RoleORVIP_LEVEL_LOW = 10705, 

    /**#M;%s#有钱任性，大手一挥，洒下一片红包雨，快来抢啊！！！*/
    EQEC_HBHD_FHB = 10706, 

    /**亲，今天的卷轴任务已经领取完了，明天再来吧。*/
    EQEC_JuanZhou_Quest_TooMany = 10707, 

    /**请先完成已经领取的卷轴任务哦，亲。*/
    EQEC_JuanZhouAccepted = 10708, 

    /**哎呀，今天的卷轴任务已经发放完啦，要不您明天再来领取吧？*/
    EQEC_JuanZhouTooMuch = 10709, 

    /**#M;%s#在地榜竞技击败#O;%s#, 夺取其神职属性！*/
    EQEC_GRJJC_DB = 10710, 

    /**#M;%s#在天榜竞技击败#O;%s#, 夺取其神职属性！*/
    EQEC_GRJJC_TB = 10711, 

    /**#M;%s#玩家在#O;%s#BOSS身上挖出#I=%d;%d#宝物！*/
    EQEC_WORLDBOSS_DIG = 10712, 

    /**#C=0x76EE00;宗门:##M;%s#获得了#C=0x76EE00;宗门争霸战胜利#，全体成员获得#C=0xFFFF00;称号：威震天下，战力暴增！#*/
    EQEC_GuildPVP_Winner = 10713, 

    /**恭喜#M;%s#成功闯过第#O;%d# 层，荣登#C=0xe6363e;经验副本挑战榜#第#O;%d#名。*/
    EQEC_Pin_All_Top_SHNV = 10714, 

    /**恭喜#M;%s#成功占领#C=0xe6363e;装备副本挑战榜#最多单层第一名，荣获全服唯一称号 #O;善战之魂# ，太令人羡慕了。*/
    EQEC_Pin_Most_Top_WST = 10715, 

    /**#M;%s#玩家祈福出现暴击，获得#O;%s#经验。*/
    EQEC_QiFu_BaoJi_JingYan = 10716, 

    /**#M;%s#玩家祈福出现暴击，获得#O;%s#魂币。*/
    EQEC_QiFu_BaoJi_TongQian = 10717, 

    /**#M;%s#玩家祈福出现暴击，获得#O;%s#绑定钻石。*/
    EQEC_QiFu_BaoJi_LingLi = 10718, 

    /**续时成功*/
    EQEC_ERR_LINGBAO_xushi = 10719, 

    /**#M;%s#成功挑战VIP副本后，幸运挖出#I=%d;%d#宝物！*/
    EQEC_VIP_PIN_DIG = 10720, 

    /**各路豪侠齐心协力在#C=0xe6363e;%s#地图除掉了魔化的女主播，掉落了大量珍惜宝物还有360手机实物大奖哦，快快开抢~*/
    EQEC_KILL_TRANS_ROLE = 10721, 

    /**#M;%s#人品大爆发，从魔化女主播遗落的宝藏内摸出了#I=%d;%d#*/
    EQEC_PICK_TRANS_ROLE_DROP = 10722, 

    /**#M;%s#玩家在%d时%d分兑换了#O;%d#元#O;人民币#，参与rmb战场获取人民币。*/
    EQEC_RMB_Exchange = 10723, 

    /**#O;至尊夺宝#目前前三名玩家为#O;%s#、#O;%s#、#O;%s#，竞争非常激烈！#O;%s#究竟花落谁家，真是让人非常期待啊!*/
    EQEC_ZZZD_Notify = 10724, 

    /**#M;%s#将#O;紫极魔瞳#进阶到#O;%d# 阶，战力暴增，实在太令人羡慕了。*/
    EQEC_HeroSub_Type_FAZHEN = 10725, 

    /**伙伴已激活。*/
    EQEC_BEAUTY_HAS_OWN = 10726, 

    /**副本未开启，请在规定时间内挑战*/
    EQEC_Pin_Time_Limit = 10727, 

    /**恭喜#M;%s#暂列#C=0xe6363e;极限挑战#第一名，凌晨3点结算排行奖励将获得#I=%d;%d#。*/
    EQEC_JSTZ_Pin_First = 10728, 

    /**挑战次数不足，无法挑战*/
    EQEC_JSTZ_CISHU_Limit = 10729, 

    /**恭喜#M;%s#暂列#C=0xe6363e;极限挑战#第一名，凌晨3点结算排行奖励将获得#I=%d;%d# #I=%d;%d#。*/
    EQEC_JSTZ_Pin_First2 = 10730, 

    /**圣器已激活。*/
    EQEC_SQ_HAS_OWN = 10731, 

    /**#M;%s#将#O;鬼影迷踪#进阶到#O;%d# 阶，战力暴增，实在太令人羡慕了。*/
    EQEC_HeroSub_Type_ZUJI = 10732, 

    /**#C=0x76EE00;宗门:##M;%s#获得了#C=0x76EE00;跨服宗门争霸战胜利#，全体成员获得#C=0xFFFF00;称号：威震天下，战力暴增！#*/
    EQEC_GuildCrossPVP_Winner = 10733, 

    /**您的宗门已占领该圣兽，无法重复占领*/
    EQEC_GuildCrossPVP_Owner = 10734, 

    /**恭喜#M;%s#在乾坤炉中提炼了#I=%d;%d#，使用金丹可获得武极兑换券！*/
    EQEC_QKL_DUIHUAN_GIFT = 10735, 

    /**#M;%s#壕气冲天，获得#C=0xe6363e;海量道具#奖励！*/
    EQEC_LCACT_GET_GIFT = 10736, 

    /**您来晚了，已经卖完了...*/
    EQEC_CrossYG_AllMax = 10737, 

    /**剩余次数不足。*/
    EQEC_CrossYG_NotEnogh = 10738, 

    /**坐骑卡使用次数已达上限*/
    EQEC_Mount_Image_MaxTime = 10739, 

    /**正在跨服中*/
    EQEC_Role_Crossing = 10740, 

    /**装备强化等级不足*/
    EQEC_Diamond_Up_Error = 10741, 

    /**亲爱的玩家, 珍珑棋局当前报名人数太多,请稍后再报名!*/
    EQEC_ZLQJ_GROUP_MAX = 10742, 

    /**亲爱的玩家, 珍珑棋局当前报名人数太少,请重新报名!*/
    EQEC_ZLQJ_GROUP_LESS = 10743, 

    /**请不要重复报名哦!*/
    EQEC_ZLQJ_GROUP_REPEAT = 10744, 

    /**恭喜#M;%s#成功闯过第#O;%d# 层，荣登#C=0xe6363e;伙伴副本挑战榜#第#O;%d#名。*/
    EQEC_Pin_All_Top_WYFB = 10745, 

    /**#M;%s#将#O;青龙坐骑#进阶到#O;%d# 阶，战力暴增，实在太令人羡慕了。*/
    EQEC_SEASON_QINGLONG = 10760, 

    /**#M;%s#将#O;朱雀坐骑#进阶到#O;%d# 阶，战力暴增，实在太令人羡慕了。*/
    EQEC_SEASON_ZHUQUE = 10761, 

    /**#M;%s#将#O;白虎坐骑#进阶到#O;%d# 阶，战力暴增，实在太令人羡慕了。*/
    EQEC_SEASON_BAIHU = 10762, 

    /**#M;%s#将#O;玄武坐骑#进阶到#O;%d# 阶，战力暴增，实在太令人羡慕了。*/
    EQEC_SEASON_XUANWU = 10763, 

    /**有其他玩家正在副本里，请稍后再进入！*/
    EQEC_GUILD_TREASURE_HUNT_BOSS_PK_ING = 10764, 

    /**一天只能修改一次名字，请24小时后再来！*/
    EQEC_Modify_Name_Time = 10765, 

    /**宗门拍卖中,只能竞拍本宗门商品!*/
    EQEC_Guild_PaiMai_Not_Same_Guild = 10766, 

    /**不存在该商品,请重新竞拍!*/
    EQEC_Guild_PaiMai_No_Item = 10767, 

    /**该商品所属的宗门解散了,不能竞拍!*/
    EQEC_Guild_PaiMai_No_Guild = 10768, 

    /**商品已售出,无法竞拍!*/
    EQEC_Guild_PaiMai_Selled = 10769, 

    /**商品已转入世界竞拍,无法竞拍!*/
    EQEC_Guild_PaiMai_In_World = 10770, 

    /**商品还未转入世界竞拍,无法竞拍!*/
    EQEC_Guild_PaiMai_NotIn_World = 10771, 

    /**商品已流拍,无法竞拍*/
    EQEC_Guild_PaiMai_Item_Lost = 10772, 

    /**出价不合法,无法竞拍*/
    EQEC_Guild_PaiMai_Price = 10773, 

    /**身份证格式错误！*/
    EQEC_Identity_Card_Num_Error = 10774, 

    /**您的身份证未成年， 将受防沉迷限制，请重新填写！*/
    EQEC_Identity_Card_Num_Invalid = 10775, 

    /**比赛结束了, 请选择其他比赛!*/
    EQEC_KFJDC_FINAL_GAME = 10776, 

    /**稍后重登录*/
    EQEC_Login_Delay = 10777, 

    /**登录超时*/
    EQEC_PCLogin_TimeOut = 10778, 

    /**登录验证失败*/
    EQEC_PCLogin_Sign = 10779, 

    /**其他玩家正在采集*/
    EQEC_Cast_Skill_Pick_Other_Role = 10780, 

    /**#M;%s#鸿运当头，在#CJ;%s#获得惊世大礼#I=%d# x%d !*/
    EQEC_Drop_Perfect_Thing_Pick = 10781, 

    /**魂力等级不够！*/
    EQEC_Equip_Rebirth_Times_Limit = 10782, 

    /**您的抽奖背包剩余空间不足，请先清理后再来！*/
    EQEC_STAR_LOTTERY_BAG_FULL = 10783, 

    /**此魂骨属性更适合于器魂师使用！*/
    EQEC_HUNGU_PROF_ERROR_1 = 10784, 

    /**此魂骨属性更适合于兽魂师使用！*/
    EQEC_HUNGU_PROF_ERROR_2 = 10785, 

    /**您的挑战次数已用完！*/
    EQEC_MULTY_BOSS_TIMES_LIMIT = 10786, 

    /**玄天功需要达到%d阶才可以使用！*/
    EQEC_JIUXING_DRUG = 10787, 

    /**奖励点数已满无法使用！*/
    EQEC_MULTY_BOSS_POINT_FULL = 10788, 

    /**抽奖仓库空位不足%d个！*/
    EQEC_SKY_LOTTERY_BAG_FULL = 10789, 

    /**%s*/
    EQEC_String = 10001, 

    /**该角色已经登录，请下线后再操作*/
    EQEC_SessionExist = 10002, 

    /**这个名字已经被使用啦，请换个名字吧！*/
    EQEC_NameConflict = 10003, 

    /**创建的角色数量满啦！*/
    EQEC_RoleNumberLimit = 10004, 

    /**您的木有受邀参加本次测试，不能创建游戏角色哒，请先申请测试资格。*/
    EQEC_NotInWhiteList = 10005, 

    /**您的号被禁止登录游戏，详细信息请访问游戏官网公告。*/
    EQEC_UinInBlackList = 10006, 

    /**擦，账户密码不正确，不会吧？不是吧？不好吧？请重新输入吧（注意大小写）*/
    EQEC_Login_Passwd = 10007, 

    /**此QQ号码已被冻结啊已冻结！详细信息请访问游戏官网公告。*/
    EQEC_Login_Freeze = 10008, 

    /**版本已更新，请重新登录。*/
    EQEC_Login_InvalidVersionL = 10009, 

    /**服务器正在更新中，请稍候再试！*/
    EQEC_Login_InvalidVersionH = 10010, 

    /**对不起，您的帐号出现异常状况，详细信息请访问游戏官网。*/
    EQEC_Logout_Evil = 10011, 

    /**连接已断开，请刷新重试。*/
    EQEC_Logout_Kickoff = 10012, 

    /**您的登陆ip已经被封，请联系客服查询*/
    EQEC_Logout_BlackIP = 10013, 

    /**重新登录！*/
    EQEC_Logout_Relogin = 10014, 

    /**太长时间不动被踢下线了啊，重新登录下吧~*/
    EQEC_Logout_Unactive = 10015, 

    /**服务器将在 #O;%s# 秒后停止服务*/
    EQEC_Server_Maintence = 10016, 

    /**此路不通，请稍后再试！*/
    EQEC_Move_NoPath = 10017, 

    /**超出攻击距离啦，要不您再靠近点？*/
    EQEC_Cast_OutDistance = 10018, 

    /**冷却中，请稍候再操作！*/
    EQEC_Cast_CoolDown = 10019, 

    /**怒气值不足*/
    EQEC_Cast_NeedJingYuan = 10020, 

    /**角色已经创建！*/
    EQEC_NotHaveOldName = 10021, 

    /**怒气值不足*/
    EQEC_Cast_NeedMana = 10023, 

    /**前置任务没有完成哟！*/
    EQEC_Quest_Prequest = 10024, 

    /**任务栏已满，请先完成已经领取的任务吧^^*/
    EQEC_Quest_TooMany = 10026, 

    /**副本超时啦，重开一个呗*/
    EQEC_Pinstance_Timeout = 10027, 

    /**副本已经开始啦，不能进入了。*/
    EQEC_Pinstance_Started = 10028, 

    /**副本已经结束啦，不能进入了。*/
    EQEC_Pinstance_Completed = 10029, 

    /**呃……商人不要这种物品，要不您去别处看看？*/
    EQEC_NPC_NOT_SELLABLE = 10030, 

    /**呃……您没有足够的货币购买该物品，努力赚钱哦。*/
    EQEC_NPC_MONEY_NOT_ENOUGH = 10031, 

    /**呃……您的声望不符合购买该物品的条件，努力哦。*/
    EQEC_NPC_REPUTATION_NOT_ENOUGH = 10032, 

    /**呃……您没有足够的货币支付修理费，努力赚钱哦。*/
    EQEC_NPC_REPAIRCOST_NOT_ENOUGH = 10033, 

    /**呃……您有部分装备无法修理，抱歉啊。*/
    EQEC_NPC_Equip_Damage = 10034, 

    /**呃……您今日已经购买了足够多的该物品*/
    EQEC_NPC_BuyLimit = 10035, 

    /**您的伙伴太多啦！太多啦！太多啦！*/
    EQEC_Pet_REACH_MAX = 10036, 

    /**您已经拥有该伙伴了！*/
    EQEC_Pet_Already_Have = 10037, 

    /**#M;%s#激活了%s品质伙伴#I=%d#，战力暴增！*/
    EQEC_Pet_Get_New = 10038, 

    /**销售火爆，您买的东西已被横扫一空啦！*/
    EQEC_NPC_ZoneBuyLimit = 10039, 

    /**下手有点晚，对方已有队伍啦！*/
    EQEC_Team_Already_Has_Team = 10059, 

    /**队伍人数已经满啦！*/
    EQEC_Team_Team_Is_FULL = 10060, 

    /**对方拒绝!*/
    EQEC_Team_Role_Refuse = 10061, 

    /**对方不在线！*/
    EQEC_Team_Role_Offline = 10062, 

    /**队长不允许邀请其他人！*/
    EQEC_Team_No_Privilige = 10063, 

    /**请不要重复申请！*/
    EQEC_Team_Same_Request = 10064, 

    /**队伍已经不存在！*/
    EQEC_Team_No_Team = 10065, 

    /**你已经有队伍了!*/
    EQEC_Team_Already_In_Team = 10066, 

    /**您不在队伍中!*/
    EQEC_Team_Not_In_Team = 10067, 

    /**无法提升为队长*/
    EQEC_Team_Set_Captain_Fail = 10068, 

    /**队伍已经不存在!*/
    EQEC_Team_Not_Exist = 10069, 

    /**组队等级不符！*/
    EQEC_Team_Level_Limit = 10070, 

    /**组队职业不符！*/
    EQEC_Team_Profession_Limit = 10071, 

    /**无法跟随*/
    EQEC_Team_Cannot_Follow = 10072, 

    /**不同国家不能组队!*/
    EQEC_Team_Not_Same_Country = 10073, 

    /**好友在副本中，不能发起组队请求!*/
    EQEC_Team_Friend_in_Pinstance = 10074, 

    /**您的兑换频率太快，请稍后再试！*/
    EQEC_CDK_ERROR_FOUR = 50003, 

    /**您已使用过相同类型的序列号！*/
    EQEC_CDK_ERROR_SAME_GIFTID = 50004, 

    /**职业不符*/
    EQEC_Operate_Skill_Prof_Dismatch = 10077, 

    /**您的魂币不足，无法升级技能啦！*/
    EQEC_Operate_Skill_Gold_Limit = 10078, 

    /**您的经验不足，无法升级技能啦！*/
    EQEC_Operate_Skill_EXP_Limit = 10079, 

    /**您的等级不足%d级，无法升级技能啦！*/
    EQEC_Operate_Skill_Level_Limit = 10080, 

    /**无效的序列号。*/
    EQEC_CDK_ERROR_ONE = 50000, 

    /**前置技能没有学*/
    EQEC_Operate_Skill_PreSkill = 10082, 

    /**技能不存在*/
    EQEC_Operate_Skill_Not_Exist = 10083, 

    /**你已经学会这个技能了，不用再学。*/
    EQEC_Operate_Skill_Studied = 10084, 

    /**错误的技能ID*/
    EQEC_Operate_Skill_Wrong_SkillID = 10088, 

    /**错误的操作*/
    EQEC_Operate_Skill_Wrong_Operate = 10089, 

    /**兑换游戏世界受限*/
    EQEC_CDK_ERROR_SIX = 49999, 

    /**你必须要更靠近NPC才能与之交流。*/
    EQEC_Operate_Skill_Far_NPC = 10091, 

    /**#M;%s# 不在附近。*/
    EQEC_Operate_Role_Far_NPC = 10092, 

    /**系统繁忙，请稍后再试！*/
    EQEC_SYS_BUSY = 50002, 

    /**材料不足哦，亲！*/
    EQEC_Cast_Skill_Consumable_Limit = 10094, 

    /**技能被打断*/
    EQEC_Cast_Skill_Interrupt = 10096, 

    /**需要指定目标*/
    EQEC_Cast_Skill_Need_Target = 10098, 

    /**技能净化效果失败*/
    EQEC_Cast_Skill_CleanDebuff_Fail = 10099, 

    /**你的职业不符合。*/
    EQEC_Cast_Skill_Profession_Limit = 10100, 

    /**你还没有学会这个技能。*/
    EQEC_Cast_Skill_Not_Study = 10101, 

    /**你的等级不符合。*/
    EQEC_Cast_Skill_Level_Limit = 10102, 

    /**该技能只能用于采集*/
    EQEC_Cast_Skill_Pick_Only = 10103, 

    /**没有相关任务*/
    EQEC_Cast_Skill_Quest_Related = 10104, 

    /**错误目标*/
    EQEC_Cast_Skill_Wrong_Target = 10105, 

    /**性别不符*/
    EQEC_Cast_Skill_Gender_Dismatch = 10106, 

    /**亲，您的背包剩余空位不足哦！*/
    EQEC_Bag_Full = 10108, 

    /**亲，您的背包剩余空位不足，需要%d个空位哦！*/
    EQEC_Bag_Need_More_Slots = 10109, 

    /**亲，您的仓库剩余空空位不足哦！*/
    EQEC_Store_Full = 10110, 

    /**当日邀请码已满*/
    EQEC_InviteKey_Full = 10111, 

    /**邀请码失效*/
    EQEC_InviteKey_Invalid = 10112, 

    /**邀请者下线*/
    EQEC_Inviter_Logout = 10113, 

    /**错误的邀请码*/
    EQEC_InviteKey_Wrong = 10114, 

    /**当前经验已经达到最大值，请手动升级*/
    EQEC_Attribute_Experience_ReachMax = 10115, 

    /**所需当前经验值不足*/
    EQEC_Attribute_Experience_NotEnough = 10116, 

    /**角色级别已经达到最大值*/
    EQEC_Attribute_Level_ReachMax = 10117, 

    /**无法使用物品*/
    EQEC_Item_NoEffect = 10118, 

    /**无需使用*/
    EQEC_Item_Attribute_Full = 10119, 

    /**物品使用需要目标*/
    EQEC_Item_Need_Target = 10120, 

    /**物品目标错误*/
    EQEC_Item_Wrong_Target = 10121, 

    /**物品必须在指定的位置使用*/
    EQEC_Item_Area_Limited = 10122, 

    /**您的等级不足，无法使用该物品*/
    EQEC_Item_Level_Limited = 10123, 

    /**物品不存在*/
    EQEC_Item_Not_Exist = 10124, 

    /**你的%s已满，不能再增加了*/
    EQEC_Item_Reputation_Limit = 10125, 

    /**您的等级已超出使用范围，无法使用此道具*/
    EQEC_Item_Level_Up_Limited = 10126, 

    /**已经有更高级别Buff在使用*/
    EQEC_Buff_LowBuffLevel = 10127, 

    /**序列号已被使用！*/
    EQEC_CDK_ERROR_TWO = 50001, 

    /**晕迷状态下无法进行操作*/
    EQEC_Buff_Coma = 10129, 

    /**Buff不存在*/
    EQEC_Buff_NotExist = 10130, 

    /**Buff操作不允许*/
    EQEC_Buff_OperationForbid = 10131, 

    /**正在Buff定身状态*/
    EQEC_Buff_Freeze = 10132, 

    /**正在Buff无敌状态*/
    EQEC_Buff_Strong = 10133, 

    /**正在Buff沉默状态*/
    EQEC_Buff_Silence = 10134, 

    /**复活目标已下线或者不在同线！*/
    EQEC_Revival_TargetOffZone = 10136, 

    /**剩余金钱不足*/
    EQEC_Revival_GoldNotEnough = 10137, 

    /**复活目标不处于死亡状态*/
    EQEC_Revival_TargetNotDead = 10138, 

    /**操作者不处于活跃状态*/
    EQEC_Revival_OperatorNotAlive = 10139, 

    /**操作者与被复活者不在一个场景中*/
    EQEC_Revival_SceneConflict = 10140, 

    /**操作者不是队友*/
    EQEC_Revival_NotTeammate = 10142, 

    /**死亡状态，不可进行该操作*/
    EQEC_In_Dead_Status = 10143, 

    /**战斗状态，不可进行该操作*/
    EQEC_In_Fight_Status = 10144, 

    /**本副本允许#O;%d - %d#人进入!*/
    EQEC_Pinstance_RoleLimit = 10149, 

    /**请让队长来开启这个副本吧!*/
    EQEC_Pinstance_Need_Captain = 10150, 

    /**只允许等级#O;%d - %d#者进入这个副本哦!*/
    EQEC_Pinstance_LevelLimit = 10152, 

    /**#O;%d#级以后才能进入这个副本哦，亲!*/
    EQEC_Pinstance_LevelMinLimit = 10153, 

    /**15级以上不能删除*/
    EQEC_RoleDB_LevelTooHigh = 10154, 

    /**收件人找不到啦！*/
    EQEC_MAIL_RECEIVER_NOT_FOUND = 10164, 

    /**符合条件的商品没有啦，要不您再挑点别的？*/
    EQEC_PSD_NotFound = 10165, 

    /**商品数量不足, 请刷新再试*/
    EQEC_PSD_NotEnough = 10166, 

    /**钱不够哦！*/
    EQEC_Money_NotEnough = 10167, 

    /**寄售成功!*/
    EQEC_SellOK = 10169, 

    /**此物品不能被寄售!*/
    EQEC_Cannot_PaiPai = 10170, 

    /**您不是对方的好友!*/
    EQEC_Friend_NotInTaget = 10171, 

    /**不能添加自己啊！*/
    EQEC_Friend_AddSelf = 10172, 

    /**TA已经是您的列表里了！*/
    EQEC_Friend_AlreadyFriends = 10173, 

    /**列表数目已到上限！*/
    EQEC_Friend_NumberLimit = 10174, 

    /**你所添加的玩家与你不同服或不在线，不能添加！*/
    EQEC_Friend_NotSameWorld = 10175, 

    /**你删除的玩家不在列表里！*/
    EQEC_Friend_NotFriends = 10176, 

    /**目标已下线，添加失败！*/
    EQEC_Friend_TargetOffline = 10177, 

    /**宗门名字中含有不合适的字*/
    EQEC_Guild_DirtyGuildName = 10178, 

    /**宗门宣言中含有不合适的字*/
    EQEC_Guild_DirtyDeclaration = 10179, 

    /**您已经拥有宗门了。*/
    EQEC_Guild_AlreadyHasGuild = 10180, 

    /**未达到创建宗门的级别（26级）*/
    EQEC_Guild_LevelTooLow = 10181, 

    /**不拥有任何宗门*/
    EQEC_Guild_NotHasGuild = 10182, 

    /**宗门个数达到服务器上限*/
    EQEC_Guild_GuildNumberExceed = 10183, 

    /**同名宗门已经存在，换个名字吧！*/
    EQEC_Guild_SameNameExist = 10184, 

    /**邀请队列已满，请稍后再试*/
    EQEC_Guild_InviteRequestExceed = 10185, 

    /**该宗门人数已满，达到主建筑承载上限*/
    EQEC_Guild_MemberNumberExceed = 10186, 

    /**你没有邀请他人加入宗门的权限*/
    EQEC_Guild_CanNotInvite = 10187, 

    /**你邀请的朋友不在线，赶紧叫TA上线吧。*/
    EQEC_Guild_InviteeOffline = 10188, 

    /**对方已经收到你的邀请了，请等待回应。*/
    EQEC_Guild_RepeatedInvite = 10189, 

    /**对方似乎不想现在加入宗门，以后再尝试？*/
    EQEC_Guild_InvitationRefused = 10190, 

    /**你是宗主哦，不能退出宗门，可以先转让宗主身份。*/
    EQEC_Guild_ChairmanQuit = 10191, 

    /**你已经申请了加入其它宗门，不要三心二意哈。*/
    EQEC_Guild_ApplicationExist = 10192, 

    /**无管理员在线，暂时无人审批你的请求*/
    EQEC_Guild_ApproversOffline = 10193, 

    /**这个申请已被其他管理员处理或者已经放太长时间了，无需处理。*/
    EQEC_Guild_ApplicationOver = 10194, 

    /**很抱歉，他们拒绝了你的申请，也许是因为你太靓了？*/
    EQEC_Guild_ApplicationRefused = 10195, 

    /**他们的管理员不知道在干啥，这么长时间都没来处理，建议你重新申请。*/
    EQEC_Guild_ApplicationTimeout = 10196, 

    /**这个宗门不在招募成员了，换一个试试？*/
    EQEC_Guild_RecruitingClosed = 10197, 

    /**该宗门的申请队列已满，请稍后再试*/
    EQEC_Guild_ApplicantExceed = 10198, 

    /**不是宗主，无权操作*/
    EQEC_Guild_NotChairman = 10199, 

    /**背包中没有宗门创建符*/
    EQEC_Guild_NoCreateGuildItem = 10200, 

    /**不在同一个宗门*/
    EQEC_Guild_NoSameGuild = 10201, 

    /**没有这个职位*/
    EQEC_Guild_NoGrade = 10202, 

    /**不能踢有踢人权限的角色*/
    EQEC_Guild_CanNotKick = 10203, 

    /**目标角色已经有宗门，不能邀请*/
    EQEC_Guild_TargetHasGuild = 10204, 

    /**您的输入中包含了不合适的内容，请检查一下。*/
    EQEC_Dirty_Word = 10205, 

    /**宗门仓库已满*/
    EQEC_Guild_Store_Full = 10206, 

    /**宗门仓库中此物品已不存在*/
    EQEC_Guild_Store_NoThing = 10207, 

    /**该物品的阶数低于宗门设定值*/
    EQEC_Guild_Store_LimitStage = 10208, 

    /**您加入宗门时间不满12小时，不能申请仓库物品！*/
    EQEC_Guild_Store_LimitTakeOut = 10209, 

    /**这么贵重的物品只能随身携带啦，不能放入仓库哦。*/
    EQEC_Cannot_Store = 10223, 

    /**您先坐下喝口水，该频道聊天还需要%d秒冷却时间呢。*/
    EQEC_Chat_CD = 10224, 

    /**请先完成已经领取的日常任务哦，亲。*/
    EQEC_DailyAccepted = 10225, 

    /**哎呀，今天的日常任务已经发放完啦，要不您明天再来领取吧？*/
    EQEC_DailyTooMuch = 10226, 

    /**哎呀，您的金钱将超过可携带上限，要不您先花点儿？*/
    EQEC_Special_Max_Money_Copper = 10229, 

    /**处于不健康游戏时间，不能领取（完成）任务*/
    EQEC_UnHealthy_Quest = 10230, 

    /**经验值超过上限，请使用后再加经验*/
    EQEC_Specila_Max_Experience = 10231, 

    /**队友处于下线状态*/
    EQEC_TeamMember_Logout = 10233, 

    /**队友处于死亡状态*/
    EQEC_TeamMember_Dead = 10234, 

    /**申请人已经有宗门*/
    EQEC_Guild_ApplicantHasGuild = 10239, 


}
