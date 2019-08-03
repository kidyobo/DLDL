declare module Protocol {
    /**
     * 协议结构定义(工具生成，请勿手动修改)
     * @author TsClassMaker
     * @exports
     */
    export class FyMsg {
        m_stMsgHead: MsgHead;
        
        m_msgBody: any;
    }
    
    /**
     * 协议头结构定义(工具生成，请勿手动修改)
     * @author TsClassMaker
     * @exports
     */
    export class MsgHead {
        m_shMsgVersion: number;
        
        m_uiTimeStamp_Low: number;

        m_uiTimeStamp_High: number;

        m_uiMsgID: number;

        m_uiUin: number;

        m_iFeedback: number;

        m_uiBodyLength: number;
    }

    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AASAddict_Notify {
        /**
         * 在线QQ帐号
         */
        m_uiUin: number;

        /**
         * 在线小时数, 成年人为0
         */
        m_usOnlineHour: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AASIdentityRecord_Request {
        /**
         * 玩家名字
         */
        m_szRoleName: string;

        /**
         * 玩家身份证号码
         */
        m_szIdentifyCardNum: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AASIdentityRecord_Response {
        /**
         * 响应结果
         */
        m_ushResultID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AASIdentity_Notify {
        /**
         * 0 不需要验证 1 需要验证
         */
        m_ucNeedIdentify: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AASSetStatus_Request {
        /**
         * 0表0收益,50表50%,100表100%收益
         */
        m_usType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AchiChange_Notify {
        /**
         * 获得成就值
         */
        m_uiAchiValue: number;

        /**
         * 成就数据
         */
        m_stOneData: CSOneAchiData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSOneAchiData {
        /**
         * 成就ID
         */
        m_uiAchiID: number;

        /**
         * 是否完成
         */
        m_bDone: number;

        /**
         * 进度
         */
        m_uiProsess: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AchiGet_Request {
        /**
         * 占位
         */
        m_ucTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AchiGet_Response {
        /**
         * 结果码
         */
        m_uiResult: number;

        /**
         * 成就数据
         */
        m_stAllData: CSAllAchiData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSAllAchiData {
        /**
         * 获得成就值
         */
        m_uiAchiValue: number;

        /**
         * 个数
         */
        m_usCount: number;

        /**
         * 成就列表
         */
        m_stDataList: Array<CSOneAchiData>;

        /**
         * 最近达成成就数据
         */
        m_stNewestAchiList: NewestAchiList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NewestAchiList {
        /**
         * 达成成就数量
         */
        m_ucCount: number;

        /**
         * 最近成就数据ID列表
         */
        m_aiAchiIDList: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ActivityDataChange_Notify {
        /**
         * 活动id
         */
        m_iID: number;

        /**
         * 活动通知数据
         */
        m_unData: ActivityNotifyData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ActivityNotifyData {
        /**
         * 温泉活动玩家操作变化通知
         */
        m_stBatheOperatNotify: BatheOperatData;

        /**
         * 国运活动信息变化通知
         */
        m_stGuoYunNotify: GuoYunActivityData;

        /**
         * 世界boss死亡信息变化通知
         */
        m_stWorldBossNotify: WorldBossDeathData;

        /**
         * 开服全民冲榜可领取信息变化通知
         */
        m_stQMCBNotify: KFQMCBChangeInfo;

        /**
         * 开服第8消费活动可领取信息变化通知
         */
        m_stConsumNotify: ConsumNotifyInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BatheOperatData {
        /**
         * 释放技能玩家id
         */
        m_stSrcRoleID: RoleID;

        /**
         * 接受技能玩家id
         */
        m_stDesRoleID: RoleID;

        /**
         * 释放技能玩家名字
         */
        m_szSrcRoleName: string;

        /**
         * 接受技能玩家名字
         */
        m_szDesRoleName: string;

        /**
         * 技能操作类型 泼水、抹肥皂、搓背 [1-3]
         */
        m_uiOperatTpye: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleID {
        /**
         * QQ帐号
         */
        m_uiUin: number;

        /**
         * 序号
         */
        m_uiSeq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuoYunActivityData {
        /**
         * 有变化的玩家id
         */
        m_stRoleID: RoleID;

        /**
         * 已接受的国运任务等级 [1,5] 0无效
         */
        m_ucQuestLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WorldBossDeathData {
        /**
         * 死亡bossID
         */
        m_iBossId: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFQMCBChangeInfo {
        /**
         * 排行榜类型,可领取榜的类型
         */
        m_ucRankType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ConsumNotifyInfo {
        /**
         * 通知类型,1是每日消费，2是个人排行达成
         */
        m_ucConsumType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ActivityPannel_Notify {
        /**
         * 活动ID
         */
        m_iActID: number;

        /**
         * 活动类型
         */
        m_iActType: number;

        /**
         * bossID
         */
        m_iBossID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ActivityStatusChange_Notify {
        /**
         * 变化的活动
         */
        m_stActivityStatus: ActivityStatus;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ActivityStatus {
        /**
         * 活动id
         */
        m_iID: number;

        /**
         * 活动开始时间
         */
        m_iStartTime: number;

        /**
         * 活动结束时间
         */
        m_iEndTime: number;

        /**
         * 活动状态，现在是完成的次数
         */
        m_ucDoneTimes: number;

        /**
         * 活动状态
         */
        m_ucStatus: number;

        /**
         * 活动是否进行了45分钟， 0没有  1超过45分钟
         */
        m_ucMoreThan45Min: number;

        /**
         * 下一次活动开始时间
         */
        m_iNextTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AfterLoginData_Notify {
        /**
         * 0点刷新数据
         */
        m_stZeroRefreshData: ZeroRefreshDataInfo;

        /**
         * 登陆尾随数据
         */
        m_stAfterLoginData: AfterLoginDataInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZeroRefreshDataInfo {
        /**
         * 开服每日登陆礼包的数据
         */
        m_stOpenSvrSignListRsp: OpenSvrSignListRsp;

        /**
         * 封神台剩余次数
         */
        m_ucPVPRemainTimes: number;

        /**
         * 封神台已购买次数
         */
        m_ucPVPBuyTimes: number;

        /**
         * 签到，按位存储
         */
        m_stSignQry: SignData;

        /**
         * 服务器当前时间
         */
        m_uiServerTime_low: number;

        /**
         * 服务器当前时间
         */
        m_uiServerTime_high: number;

        /**
         * 聚划算
         */
        m_stJUHSAllData: JUHSAllData;

        /**
         * 玩家每天是否操作过的信息
         */
        m_uiDayOperateRecord: number;

        /**
         * 每日首冲数据
         */
        m_stSCData: SCDataInfo;

        /**
         * 系统进阶日数据
         */
        m_stJinJieRiData: JJRData;

        /**
         * 限时折扣数据
         */
        m_stTimeLimitDiscountData: DiscountPanel;

        /**
         * 副本大厅前台需要的副本数据
         */
        m_stPinHomeData: PinHomeListAllRsp;

        /**
         * 一本万利活动数据
         */
        m_stYBWLData: YBWLRsp;

        /**
         * 七天投资
         */
        m_stSevenDayFundData: SevenDayFundData;

        /**
         * 开服消费返利
         */
        m_stKaiFuXFFLData: CSKaiFuXFFLInfo;

        /**
         * 7天累计充值
         */
        m_st7DayLJCZInfo: CS7DayLJCZInfo;

        /**
         * 活动_开服连充返利
         */
        m_stCSKFLCFLInfo: CSKFLCFLInfo;

        /**
         * 活动_开服消费礼包
         */
        m_stKaiFuXFLBInfo: KaiFuXFLBInfo;

        /**
         * 装备位炼体升级消耗信息
         */
        m_stSlotLTUpCostInfo: SlotLTUpCostInfo;

        /**
         * 天宫宝镜个人数据
         */
        m_stSkyLotteryData: SkyLotteryData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OpenSvrSignListRsp {
        /**
         * 当前玩家已登录的天数
         */
        m_ucMaxLoginDays: number;

        /**
         * 当前已领取的礼包状态，0未领取，1已领取。按位存储,最大支持31天
         */
        m_iGetTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SignData {
        /**
         * 每天的签到结果，按位存储，0位不用
         */
        m_uiDaySignTag: number;

        /**
         * 本月累计的礼包结果，按位存储，0位不用
         */
        m_uiSignPrizeTag: number;

        /**
         * 再领一次标记，0未领取，1已领取
         */
        m_ucDoubleFlag: number;

        /**
         * 本月已补签次数
         */
        m_ucExtraSignCnt: number;

        /**
         * 最后一次签的月份
         */
        m_ucSignMonth: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JUHSAllData {
        /**
         * 是否领取了全部购买的奖励
         */
        m_ucAllGet: number;

        /**
         * 个数
         */
        m_ucNumber: number;

        /**
         * 数据数组
         */
        m_stOneDataList: Array<JUHSOneData>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JUHSOneData {
        /**
         * 配置ID
         */
        m_ucCfgID: number;

        /**
         * 购买时间戳
         */
        m_uiBuyTime: number;

        /**
         * 第几天
         */
        m_ucDay: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SCDataInfo {
        /**
         * 可领取状态 GIFT_TYPE_START_SC 和 GIFT_TYPE_LOOP_SC
         */
        m_ucType: number;

        /**
         * 第几日
         */
        m_ucDay: number;

        /**
         * 按位，领取了第几档
         */
        m_ucGetBitMap: number;

        /**
         * 今日首冲额度
         */
        m_uiSCValue: number;

        /**
         * 是否已经领取终生首充
         */
        m_ucGetRFCBit: number;

        /**
         * 终生首冲时间
         */
        m_uiLifeSCTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JJRData {
        /**
         * 有效的子系统数
         */
        m_ucSubSystemCount: number;

        /**
         * 各奖励状态
         */
        m_stSubSystemInfoList: Array<JJRSubSystemInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JJRSubSystemInfo {
        /**
         * 进阶日类型，1 美人 2 坐骑 3 羽翼 4 精灵 5 武魂 6 法阵
         */
        m_ucMainType: number;

        /**
         * 奖励个数
         */
        m_ucCount: number;

        /**
         * 各奖励状态
         */
        m_stStatusList: Array<JJROneStatus>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JJROneStatus {
        /**
         * 配置ID
         */
        m_uiCfgID: number;

        /**
         * 1.不可领取 2.可领取 3.已领取	见宏GOD_LOAD_AWARD_DONE_GET
         */
        m_ucStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DiscountPanel {
        /**
         * 物品种类
         */
        m_ucCount: number;

        /**
         * 物品种类
         */
        m_stSellingList: Array<SellingItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SellingItem {
        /**
         * 类型
         */
        m_ucType: number;

        /**
         * 物品ID
         */
        m_uiItemID: number;

        /**
         * 唯一ID
         */
        m_uiID: number;

        /**
         * 最大可买数量
         */
        m_uiMaxCanBuyNum: number;

        /**
         * 可购买数量
         */
        m_uiCanBuyNum: number;

        /**
         * 原价
         */
        m_uiPrice: number;

        /**
         * 折扣价
         */
        m_uiDiscountPrice: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinHomeListAllRsp {
        /**
         * 有效数据个数
         */
        m_ucNum: number;

        /**
         * 副本信息数组
         */
        m_stPinInfo: Array<ListPinHomeRsp>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ListPinHomeRsp {
        /**
         * 副本id
         */
        m_iPinId: number;

        /**
         * 是否终生首通, 根据副本难度，按位存储.位置0无效
         */
        m_uiIsLifeFinish: number;

        /**
         * 是否今日首通, 根据副本难度，按位存储.位置0无效
         */
        m_uiIsDayFinish: number;

        /**
         * 历史最大通关层数，没有层数概念的副本，默认为0
         */
        m_uiMaxLevel: number;

        /**
         * 当前已通关层数，没有层数概念的副本，默认为0
         */
        m_uiCurLevel: number;

        /**
         * 副本已重置次数
         */
        m_ucResetNum: number;

        /**
         * 经验副本双倍经验，0没有，1有
         */
        m_ucExpPinDouble: number;

        /**
         * 通关星级  下标1开始取 材料副本等特殊从0开始
         */
        m_aucPassStarLevel: Array<number>;

        /**
         * 副本额外数据类型 太大的数据结构放这里
         */
        m_ucPinExtraType: number;

        /**
         * 副本额外数据信息 太大的数据结构放这里
         */
        m_stPinExtraInfo: PinExtraInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinExtraInfo {
        /**
         * 副本额外信息 占位
         */
        m_ucExtra: number;

        /**
         * 武缘副本额外信息
         */
        m_stWYFBFinishInfo: WYFBFinishInfo;

        /**
         * 个人boss额外信息
         */
        m_stPrivateBossList: PrivateBossList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYFBFinishInfo {
        /**
         * 记录数组个数
         */
        m_ucCount: number;

        /**
         * 终生通关状态
         */
        m_ucLifeStatus: Array<number>;

        /**
         * 每日通关状态
         */
        m_ucDayStatus: Array<number>;

        /**
         * 记录数组个数
         */
        m_ucStageNum: number;

        /**
         * 每关通关次数
         */
        m_ucFinishNum: Array<number>;

        /**
         * 自动恢复体力时间戳
         */
        m_uiAutoTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PrivateBossList {
        /**
         * 个人boss总次数
         */
        m_ucTotalCount: number;

        /**
         * 个人boss下次刷新时间
         */
        m_uiNextRefreshTime: number;

        /**
         * 多人boss总次数
         */
        m_iMultiBossTotalCount: number;

        /**
         * 多人boss下次刷新时间
         */
        m_uiMultiNextRefreshTime: number;

        /**
         * 多人boss购买刷新次数
         */
        m_ucMultiBuyRefreshTimes: number;

        /**
         * 记录数组个数
         */
        m_ucCount: number;

        /**
         * BOSS已打次数信息
         */
        m_astBossLimitInfo: Array<DBBossCountInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBBossCountInfo {
        /**
         * 层数
         */
        m_iNandu: number;

        /**
         * 已打次数
         */
        m_ucFightCount: number;

        /**
         * boss下次刷新时间
         */
        m_uiBossRefreshTime: number;

        /**
         * Vip购买的次数
         */
        m_ucVipBuyTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class YBWLRsp {
        /**
         * 购买的价钱
         */
        m_uiValue: number;

        /**
         * 购买天数，0未购买，1 第1天
         */
        m_ucBuyDays: number;

        /**
         * 当前领取的礼包状态，0未领取，1已领取。按位存储,最大支持32个档位,从第1位开始
         */
        m_iGetTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SevenDayFundData {
        /**
         * 个数
         */
        m_ucNumber: number;

        /**
         * 数据数组
         */
        m_stOneDataList: Array<SevenDayFundOne>;

        /**
         * Boss击杀数量
         */
        m_iBossKillNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SevenDayFundOne {
        /**
         * 配置Type
         */
        m_ucCfgType: number;

        /**
         * 购买时间戳
         */
        m_uiBuyTime: number;

        /**
         * 是否已领取 按位存储 CfgID-1左移
         */
        m_uiGetFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSKaiFuXFFLInfo {
        /**
         * 是否领取过 按位存储
         */
        m_ucGet: number;

        /**
         * 有效数据个数
         */
        m_ucNumber: number;

        /**
         * 7天累计消费
         */
        m_aiConsume: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CS7DayLJCZInfo {
        /**
         * 累积充值数额
         */
        m_uiLJZCValue: number;

        /**
         * 按位，领取了第几档
         */
        m_uiGetBitMap: number;

        /**
         * 有效数据个数
         */
        m_ucNumber: number;

        /**
         * 7天累计充值
         */
        m_stList: Array<CS7DayLJCZOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CS7DayLJCZOne {
        /**
         * 配置ID
         */
        m_iID: number;

        /**
         * 条件
         */
        m_iCondition: number;

        /**
         * 奖励道具个数
         */
        m_ucItemCnt: number;

        /**
         * 道具
         */
        m_stItemList: Array<CS7DayLJCZItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CS7DayLJCZItem {
        /**
         * 道具ID
         */
        m_iItemID: number;

        /**
         * 道具个数
         */
        m_iItemCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSKFLCFLInfo {
        /**
         * 0第几周 0表示循环
         */
        m_iWeek: number;

        /**
         * 奖励类型个数
         */
        m_ucRewardCount: number;

        /**
         * 奖励领取按bit
         */
        m_aiRewardBit: Array<number>;

        /**
         * 充值个数
         */
        m_ucCZCount: number;

        /**
         * 每天充值数
         */
        m_aiCZValue: Array<number>;

        /**
         * 配置个数
         */
        m_ucCfgCount: number;

        /**
         * 配置列表
         */
        m_stCfgList: Array<KFLCFLCfg_Server>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFLCFLCfg_Server {
        /**
         * 0顺序
         */
        m_iID: number;

        /**
         * 0类型
         */
        m_iType: number;

        /**
         * 0第几周 0表示循环
         */
        m_iWeek: number;

        /**
         * 0条件1
         */
        m_iCondition1: number;

        /**
         * 0条件2
         */
        m_iCondition2: number;

        /**
         * 0开始时间
         */
        m_iStartTime: number;

        /**
         * 0结束时间
         */
        m_iEndTime: number;

        /**
         * 0模型类型
         */
        m_iModelType: number;

        /**
         * 0模型ID
         */
        m_iModelID: number;

        /**
         * 0物品总数
         */
        m_iItemCount: number;

        /**
         * 道具
         */
        m_stItemList: Array<KFLCFLtem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFLCFLtem {
        /**
         * 物品ID
         */
        m_iID: number;

        /**
         * 个数
         */
        m_iCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KaiFuXFLBInfo {
        /**
         * 是否领取过 根据档次 按位存储
         */
        m_ucGet: number;

        /**
         * 当天累计消费
         */
        m_iConsume: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SlotLTUpCostInfo {
        /**
         * 铜钱已消耗次数
         */
        m_ucTongQian: number;

        /**
         * 绑元已消耗次数
         */
        m_ucBindYB: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkyLotteryData {
        /**
         * 免费次数
         */
        m_ucFreeTimes: number;

        /**
         * 今日累计抽奖次数
         */
        m_iLotteryDropTimes: number;

        /**
         * 累计抽奖奖励领取标志位
         */
        m_uiGiftFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AfterLoginDataInfo {
        /**
         * 当日在线时间
         */
        m_uiTodayOnlineTime: number;

        /**
         * 上次登录时间
         */
        m_uiLastLoginTime: number;

        /**
         * 上次下线时间
         */
        m_uiLastLogoutTime: number;

        /**
         * 聊天验证码，预留
         */
        m_ucCheck: string;

        /**
         * 联服数据
         */
        m_stLinkInfo: LinkWorldInfo;

        /**
         * 玩家类型，回归玩家/普通玩家
         */
        m_cRoleType: number;

        /**
         * 祝福子系统数据列表
         */
        m_stCSHeroSubList: CSHeroSubList;

        /**
         * PK信息
         */
        m_stPKInfo: PKInfo;

        /**
         * 玩家vip月卡等级,0无vip月卡
         */
        m_iVIPMonthLevel: number;

        /**
         * 玩家vip月卡到期时间
         */
        m_auiVIPMonthTimeOut: Array<number>;

        /**
         * 玩家最后领的是哪个等级
         */
        m_usLevelBag: number;

        /**
         * PVP_ARMY副本中，军团所属
         */
        m_ucArmyID: number;

        /**
         * 当前时区
         */
        m_cLocatZoneTime: number;

        /**
         * 聚元ID
         */
        m_iJuYuanInfo: number;

        /**
         * 玩家拥有的非等级时装的形象数据
         */
        m_stDressImageList: DressImageListInfo;

        /**
         * 玩家的配偶信息
         */
        m_stLoverInfo: RoleLoverInfo;

        /**
         * 玩家红颜列表信息
         */
        m_stBeautyInfo: NewBeautyInfoList;

        /**
         * 玩家法则信息
         */
        m_stFazeInfo: FaZeInfo;

        /**
         * 主城内城主模型信息
         */
        m_stCityKingInfo: GuildPVPSSBattleChairmanValue;

        /**
         * 血脉信息
         */
        m_stCrazyBloodInfo: CrazyBloodInfo;

        /**
         * 已激活功能列表
         */
        m_stFunctionActList: FunctionActList;

        /**
         * 装备位列表
         */
        m_stEquipSlotInfoList: EquipSlotInfoList;

        /**
         * 装备套装数据
         */
        m_stEquipSuitInfo: EquipSuitInfo;

        /**
         * 洗炼阶级
         */
        m_stEquipWashStageInfo: EquipWashStage;

        /**
         * 装备位套装等级信息
         */
        m_stSlotSuitInfo: SlotSuitInfo;

        /**
         * 守护神信息
         */
        m_stShieldGodList: ShieldGodInfoList;

        /**
         * 武缘寻宝信息
         */
        m_stWYTreasureHuntInfo: WYTreasureHuntInfo;

        /**
         * 魂骨装备数据
         */
        m_stHunGuSlotInfoList: HunGuEquipSlotInfoList;

        /**
         * 魂力数据
         */
        m_stHunLiInfo: HunLiInfo;

        /**
         * 魂骨位洗炼阶级
         */
        m_stSlotWashStageInfo: SlotWashStage;

        /**
         * 队伍ID
         */
        m_iTeamID: number;

        /**
         * 功能预览领取奖励信息
         */
        m_stPreviewRewardInfo: DBPreviewRewardInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LinkWorldInfo {
        /**
         * 联服WorldID, 0 表不用联就自己
         */
        m_uiWorldID: number;

        /**
         * 联服的域名
         */
        m_szDomain: string;

        /**
         * 联服的域名IP 
         */
        m_szIP: string;

        /**
         * 联服的侦听端口
         */
        m_uiPort: number;

        /**
         * 服务器开服时间
         */
        m_uiSvrStartTime: number;

        /**
         * 服务器合服时间
         */
        m_uiSvrMergeTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSHeroSubList {
        /**
         * 子模块个数
         */
        m_ucCount: number;

        /**
         * 子模块列表
         */
        m_stModuleList: Array<CSHeroSubData>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSHeroSubData {
        /**
         * 类型 这里极有可能要用到联合体 所以预留Type
         */
        m_ucType: number;

        /**
         * 子模块数据  结构相同的
         */
        m_stSuperInfo: CSHeroSubSuper;

        /**
         * 子模块列表
         */
        m_stUnionInfo: CSHeroSubUnion;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSHeroSubSuper {
        /**
         * 等级
         */
        m_ucLevel: number;

        /**
         * 幸运值
         */
        m_uiLucky: number;

        /**
         * 显示ImageID
         */
        m_uiShowID: number;

        /**
         * 属性丹个数
         */
        m_uiSXDrugCount: number;

        /**
         * 资质丹个数
         */
        m_uiZZDrugCount: number;

        /**
         * 清空祝福时间
         */
        m_uiLuckyTime: number;

        /**
         * 形象个数
         */
        m_ucNumber: number;

        /**
         * 形象列表
         */
        m_astImageList: Array<HeroSubDressOneImage>;

        /**
         * 衰减的幸运值
         */
        m_uiSaveLucky: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeroSubDressOneImage {
        /**
         * 幻化ID
         */
        m_uiImageID: number;

        /**
         * 到期时间
         */
        m_uiTimeOut: number;

        /**
         * 幻化等级
         */
        m_iLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSHeroSubUnion {
        /**
         * 默认占位符
         */
        m_ucReserved: number;

        /**
         * 天珠
         */
        m_stTianZhu: CSHeroSubTianZhu;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSHeroSubTianZhu {
        /**
         * 记录数组个数
         */
        m_ucCnt: number;

        /**
         * 天珠镶嵌等级
         */
        m_ucMountLv: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PKInfo {
        /**
         * PK状态 PK_STATUS
         */
        m_ucPKStaus: number;

        /**
         * 善恶值-100~100
         */
        m_cPKVal: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DressImageListInfo {
        /**
         * 是否隐藏形象,0为显示、1隐藏
         */
        m_bIsHide: number;

        /**
         * 当前形象ID,0为默认形象
         */
        m_uiImageID: number;

        /**
         * 时装形象个数
         */
        m_ucNumber: number;

        /**
         * 时装形象列表
         */
        m_astImageList: Array<DressOneImageInfo>;

        /**
         * 当前形象显示的颜色索引
         */
        m_ucColorIndex: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DressOneImageInfo {
        /**
         * 时装形象列表，不含升阶获得
         */
        m_uiImageID: number;

        /**
         * 时装形象到期时间，0表不会过期
         */
        m_uiTimeOut: number;

        /**
         * 时装形象已叠加次数
         */
        m_uiAddNum: number;

        /**
         * 形象强化等级
         */
        m_ucStrengLv: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleLoverInfo {
        /**
         * 配偶roleid
         */
        m_stID: RoleID;

        /**
         * 配偶的基本信息
         */
        m_stBaseProfile: BaseProfile;

        /**
         * 仙缘系统是否开启，0未开启，其他，开启
         */
        m_ucXYFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BaseProfile {
        
        m_szNickName: string;

        /**
         * 性别
         */
        m_cGender: number;

        /**
         * 职业
         */
        m_cProfession: number;

        /**
         * 网管权限
         */
        m_cGMType: number;

        /**
         * 角色等级
         */
        m_usLevel: number;

        /**
         * 充值数
         */
        m_uiChargeVal: number;

        /**
         * 消费数
         */
        m_uiCosumeSum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NewBeautyInfoList {
        /**
         * 红颜个数
         */
        m_ucNumber: number;

        m_astBeautyInfo: Array<NewBeautyInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NewBeautyInfo {
        /**
         * 红颜配置ID
         */
        m_iBeautyID: number;

        /**
         * 红颜阶级
         */
        m_uiStage: number;

        /**
         * 当前阶级祝福值
         */
        m_uiStageBless: number;

        /**
         * 散仙状态, 共用成就的 GOD_LOAD_AWARD_CANT_GET  GOD_LOAD_AWARD_WAIT_GET  GOD_LOAD_AWARD_DONE_GET
         */
        m_ucStatus: number;

        /**
         * 完成度，只有在未完成时候带这个值
         */
        m_uiDoneCount: number;

        /**
         * 红颜祝福值清空时间
         */
        m_uiBlessClearTime: number;

        /**
         * 属性丹个数
         */
        m_uiSXDrugCount: number;

        /**
         * 资质丹个数
         */
        m_uiZZDrugCount: number;

        /**
         * 缘分数组
         */
        m_astFateList: Array<NewBeautyFateInfo>;

        /**
         * 武缘到期时间
         */
        m_uiTimeOut: number;

        /**
         * 武缘聚神信息
         */
        m_stJuShen: NewBeautyJuShen;

        /**
         * 若该字段不为零 用激活卡激活
         */
        m_iCanUseCard: number;

        /**
         * 飞升信息
         */
        m_stFeiSheng: BeautyFeiSheng;

        /**
         * 觉醒信息
         */
        m_stAwake: BeautyAwake;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NewBeautyFateInfo {
        /**
         * 当前缘分等级
         */
        m_iLevel: number;

        /**
         * 进度(这里暂且只放功法的道具数量)
         */
        m_uiProgress: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NewBeautyJuShen {
        /**
         * 聚神等级
         */
        m_uiLevel: number;

        /**
         * 祝福值
         */
        m_uiWish: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyFeiSheng {
        /**
         * 武缘飞升的计数
         */
        m_ucNum: number;

        /**
         * 武缘飞升时的等级
         */
        m_usStage: Array<number>;

        /**
         * 武缘飞升时的聚神等级
         */
        m_usFSLv: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyAwake {
        /**
         * 觉醒等级
         */
        m_ucLevel: number;

        /**
         * 觉醒进度
         */
        m_usLuck: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaZeInfo {
        /**
         * 已经激活法则个数
         */
        m_ucNumber: number;

        /**
         * 法则数据
         */
        m_stFaZeDataList: Array<FaZeOneData>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaZeOneData {
        /**
         * 法则类型
         */
        m_uiFaZeType: number;

        /**
         * 法则等级
         */
        m_uiFaZeLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildPVPSSBattleChairmanValue {
        /**
         * 宗主的信息
         */
        m_stRoleInfo: RoleInfo;

        /**
         * 宗派名字
         */
        m_szGuildName: string;

        /**
         * 宗主所在的服ID
         */
        m_iCountry: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleInfo {
        
        m_stID: RoleID;

        m_stBaseProfile: BaseProfile;

        m_stUnitInfo: UnitInfo;

        /**
         * 玩家身份标识位图
         */
        m_uiIdentityFlag: number;

        /**
         * 时装列表
         */
        m_stAvatarList: AvatarList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class UnitInfo {
        /**
         * 场景内单位编号
         */
        m_iUnitID: number;

        /**
         * 单位类型
         */
        m_ucUnitType: number;

        m_stUnitMovement: UnitMovement;

        m_stUnitAttribute: UnitAttribute;

        m_uiUnitStatus: number;

        /**
         * 阵营
         */
        m_ucCampID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class UnitMovement {
        /**
         * 当前坐标位置
         */
        m_stCurrentPosition: UnitPosition;

        m_stPath: UnitPath;

        /**
         * 角色方向
         */
        m_iDirection: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class UnitPosition {
        
        m_uiX: number;

        m_uiY: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class UnitPath {
        /**
         * 位置数量
         */
        m_iNumber: number;

        m_astPosition: Array<UnitPosition>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class UnitAttribute {
        /**
         * 属性个数
         */
        m_ucNumber: number;

        m_allValue: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AvatarList {
        /**
         * 数组个数
         */
        m_ucNumber: number;

        m_aiAvatar: Array<number>;

        /**
         * 子系统数组个数
         */
        m_ucSubNum: number;

        m_auiSubLevel: Array<number>;

        /**
         * 最低装备全身强化等级
         */
        m_ucStrengLevel: number;

        /**
         * 时装形象ID
         */
        m_uiDressImageID: number;

        /**
         * 法宝形象ID
         */
        m_uiFabaoShowID: number;

        /**
         * 灵宝形象ID
         */
        m_uiLingBaoID: number;

        /**
         * 法阵形象ID
         */
        m_uiFaZhenID: number;

        /**
         * 最低装备全身颜色
         */
        m_ucColorLevel: number;

        /**
         * 法器形象id
         */
        m_ucFaQiId: number;

        /**
         * 时装形象ID
         */
        m_ucDressColorID: number;

        /**
         * 翅膀ID
         */
        m_uiWingID: number;

        /**
         * 翅膀等级
         */
        m_uiWingLevel: number;

        /**
         * 魂环ID
         */
        m_uiHunHuanID: number;

        /**
         * 魂力等级
         */
        m_ucHunLiLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrazyBloodInfo {
        /**
         * 血脉阶级
         */
        m_ucStage: number;

        /**
         * 当前精血数量
         */
        m_uiBloodValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FunctionActList {
        /**
         * 个数
         */
        m_ucNum: number;

        /**
         * 已激活功能列表
         */
        m_usFuncID: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipSlotInfoList {
        /**
         * 装备位数量
         */
        m_usSlotNumber: number;

        m_astSlot: Array<ContainerSlotInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContainerSlotInfo {
        /**
         * 容器位等级
         */
        m_iSlotLv: number;

        /**
         * 进阶等级
         */
        m_ucSlotStage: number;

        /**
         * 套装类型
         */
        m_ucSuitType: number;

        /**
         * 炼体等级
         */
        m_ucLianTiLv: number;

        /**
         * 炼体神宝数量
         */
        m_ucLTSBNum: number;

        /**
         * 炼体神宝激活数量
         */
        m_aucLTSB: Array<number>;

        /**
         * 炼体等级进度
         */
        m_uiLianTiLuck: number;

        /**
         * 强化等级
         */
        m_usStrengthenLv: number;

        /**
         * 强化进度
         */
        m_usStrengthenLuck: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipSuitInfo {
        /**
         * 套装阶级
         */
        m_ucStage: number;

        /**
         * 数量
         */
        m_ucNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipWashStage {
        /**
         * 阶级等级
         */
        m_ucLv: number;

        /**
         * 进度
         */
        m_usExp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SlotSuitInfo {
        /**
         * 套装类型数量
         */
        m_ucNum: number;

        /**
         * 套装等级信息
         */
        m_ucSuitLv: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShieldGodInfoList {
        /**
         * 个数
         */
        m_ucNum: number;

        /**
         * 守护神信息
         */
        m_astShieldGodList: Array<ShieldGodInfo>;

        /**
         * 守护神当前外置id
         */
        m_iShowID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShieldGodInfo {
        /**
         * 守护神ID
         */
        m_iID: number;

        /**
         * 等阶
         */
        m_shLv: number;

        /**
         * 祝福值
         */
        m_iLuckValue: number;

        /**
         * 护盾耗完时的时间戳
         */
        m_uiDeadTime: number;

        /**
         * 当前护盾值
         */
        m_llShield: number;

        /**
         * 状态, 共用成就的 GOD_LOAD_AWARD_CANT_GET  GOD_LOAD_AWARD_WAIT_GET  GOD_LOAD_AWARD_DONE_GET
         */
        m_ucStatus: number;

        /**
         * 完成度，只有在未完成时候带这个值
         */
        m_uiDoneCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYTreasureHuntInfo {
        /**
         * 武缘寻宝开始时间
         */
        m_uiWYXBStartTime: number;

        /**
         * 寻宝武缘ID
         */
        m_iBeautyID: number;

        /**
         * 剩余免费次数
         */
        m_ucLeftCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuEquipSlotInfoList {
        /**
         * 装备位数量
         */
        m_usSlotNumber: number;

        m_astSlot: Array<HunGuContainerSlotInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuContainerSlotInfo {
        /**
         * 容器位精炼等级
         */
        m_iRefineLv: number;

        /**
         * 容器位等级
         */
        m_iSlotLv: number;

        /**
         * 强化等级
         */
        m_usStrengthenLv: number;

        /**
         * 强化进度
         */
        m_usStrengthenLuck: number;

        /**
         * 洗练系统
         */
        m_stWash: WashSlotInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WashSlotInfo {
        /**
         * 装备洗炼属性锁定信息，每一位标识一个锁定，0(未锁定)，1(锁定)
         */
        m_ucLockInfo: number;

        /**
         * 最多7个洗练属性
         */
        m_astAttr: Array<SlotWashPropCfg>;

        /**
         * 元宝开启洗炼条数
         */
        m_ucBuyNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SlotWashPropCfg {
        /**
         * 属性类型,对应EUAI宏
         */
        m_ucPropId: number;

        /**
         * 洗练星级
         */
        m_ucWashLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunLiInfo {
        /**
         * 魂力等级
         */
        m_ucHunLiLevel: number;

        /**
         * 魂力子等级
         */
        m_ucHunLiSubLevel: number;

        /**
         * 当前阶魂力条件完成信息
         */
        m_stCurConditionList: Array<HunLiLevelOne>;

        /**
         * 已激活的魂环
         */
        m_uiHunHuanID: number;

        /**
         * 魂环注入进度
         */
        m_uiHunHuanProgress: number;

        /**
         * 记录数组个数
         */
        m_ucHunHuanInfoCount: number;

        /**
         * 魂环信息
         */
        m_stHunHuanInfoList: Array<HunHuanOneInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunLiLevelOne {
        /**
         * 记录数组个数
         */
        m_ucConditonCount: number;

        /**
         * 魂力条件和奖励
         */
        m_astConditionFinish: Array<HunLiConditionOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunLiConditionOne {
        /**
         * 奖励是否领取
         */
        m_ucRewardGet: number;

        /**
         * 条件达成参数
         */
        m_iFinishParam: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunHuanOneInfo {
        /**
         * 等级
         */
        m_ucLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SlotWashStage {
        /**
         * 阶级等级
         */
        m_ucLv: number;

        /**
         * 进度
         */
        m_usExp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBPreviewRewardInfo {
        /**
         * 领取信息长度
         */
        m_usCount: number;

        /**
         * 已领取列表 存关键字的值
         */
        m_stRewardList: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AutoBattleSetting_Notify {
        /**
         * 设置信息
         */
        m_stAutoBattleSetting: AutoBattleSetting;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AutoBattleSetting {
        /**
         * 是否默认设置
         */
        m_ucDefaultFlag: number;

        /**
         * 开启功能列表
         */
        m_uiBattleFunctionList: number;

        /**
         * 设置的自动技能ID
         */
        m_stAutoBattleSkill: AutoBattleSkill;

        /**
         * 设置的分解信息
         */
        m_stAutoAnalyze: AutoAnalyze;

        /**
         * boss怪物提醒
         */
        m_stBossAttention: BossAttention;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AutoBattleSkill {
        /**
         * 技能个数
         */
        m_ucNumber: number;

        /**
         * 技能ID
         */
        m_ucValue: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AutoAnalyze {
        /**
         * 是否启用
         */
        m_ucDefaultFlag: number;

        /**
         * 品质
         */
        m_ucQuality: number;

        /**
         * 阶数
         */
        m_ucStage: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BossAttention {
        /**
         * boss数量
         */
        m_ucNumber: number;

        /**
         * boss怪物ID
         */
        m_iValue: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AutoBattleSetting_Request {
        /**
         * 设置信息
         */
        m_stAutoBattleSetting: AutoBattleSetting;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AvatarChange_Notify {
        /**
         * 时装发生变化的unitid
         */
        m_iUnitID: number;

        /**
         * 当前时装列表
         */
        m_stAvatarList: AvatarList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BagPassword_Request {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: BagPasswordRequestVaule;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BagPasswordRequestVaule {
        /**
         * 设置背包二次密码
         */
        m_stBagPasswordStruct: BagPasswordStruct;

        /**
         * 锁定背包 占位，不填
         */
        m_ucLock: number;

        /**
         * 解锁背包
         */
        m_szPassword: string;

        /**
         * 查询背包锁定状态 占位，不填
         */
        m_ucStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BagPasswordStruct {
        /**
         * 背包密码 6位数字 不加密
         */
        m_szPassword: string;

        /**
         * 密保邮箱
         */
        m_szMail: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BagPassword_Response {
        /**
         * 请求操作协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: BagPasswordResponseVaule;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BagPasswordResponseVaule {
        /**
         * 1 设置成功
         */
        m_stBagPasswordSet: number;

        /**
         * 1 设置成功
         */
        m_ucLock: number;

        /**
         * 1 设置成功
         */
        m_ucUnlock: number;

        /**
         * 0无密码 ，1锁定，2未锁定
         */
        m_ucStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BaoDian_Request {
        /**
         * 占位
         */
        m_iTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BaoDian_Response {
        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 响应结果
         */
        m_iCount: number;

        /**
         * 宝典状态列表
         */
        m_stStautsList: Array<BaoDianOneStatus>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BaoDianOneStatus {
        /**
         * 配置ID
         */
        m_iID: number;

        /**
         * 0未完成 1已完成 其他暂时没用到
         */
        m_iStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyActive_Request {
        /**
         * 红颜配置ID
         */
        m_iBeautyID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyActive_Response {
        /**
         * 错误码
         */
        m_iResult: number;

        /**
         * 是否成功
         */
        m_ucSucces: number;

        /**
         * 被激活的红颜信息
         */
        m_stBeautyInfo: NewBeautyInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyAwake_Request {
        /**
         * 协议类型
         */
        m_ucType: number;

        /**
         * 协议体
         */
        m_stValue: BeautyAwakeReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyAwakeReqValue {
        /**
         * 觉醒 武缘ID
         */
        m_iStrengthenBeautyID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyAwake_Response {
        /**
         * 错误码
         */
        m_iResult: number;

        /**
         * 协议类型
         */
        m_ucType: number;

        /**
         * 协议体
         */
        m_stValue: BeautyAwakeRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyAwakeRspValue {
        /**
         * 武缘觉醒
         */
        m_stAwakeStrengthenRsp: AwakeStrengthenRsp;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AwakeStrengthenRsp {
        /**
         * 觉醒 武缘ID
         */
        m_iStrengthenBeautyID: number;

        /**
         * 等级
         */
        m_ucLevel: number;

        /**
         * 当前祝福值
         */
        m_usLuck: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyBattle_Request {
        /**
         * 红颜配置ID, 若设置休息，把红颜ID置为0
         */
        m_iBeautyID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyBattle_Response {
        /**
         * 错误码
         */
        m_iResult: number;

        /**
         * 出战的红颜配置ID
         */
        m_iBeautyID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyDrug_Request {
        /**
         * 红颜配置ID
         */
        m_iBeautyID: number;

        /**
         * HERO_SUB_DRUG_TYPE_CZ成长丹 HERO_SUB_DRUG_TYPE_ZZ资质丹
         */
        m_ucDrugType: number;

        /**
         * 操作类型，0 使用，1 批量使用
         */
        m_ucOpType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyDrug_Response {
        /**
         * 错误码
         */
        m_iResult: number;

        /**
         * 吃丹药的红颜信息
         */
        m_stBeautyInfo: NewBeautyInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyJuShen_Request {
        /**
         * 红颜配置ID
         */
        m_iBeautyID: number;

        /**
         * 是否飞升，0否（聚神），1是（飞升）
         */
        m_bIsFeiSheng: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyJuShen_Response {
        /**
         * 错误码
         */
        m_iResult: number;

        /**
         * 红颜信息
         */
        m_stBeautyInfo: NewBeautyInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyKF_Request {
        /**
         * 红颜配置ID
         */
        m_iBeautyID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyKF_Response {
        /**
         * 错误码
         */
        m_iResult: number;

        /**
         * 使用功法书的红颜信息
         */
        m_stBeautyInfo: NewBeautyInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyStageUp_Request {
        /**
         * 红颜配置ID
         */
        m_iBeautyID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyStageUp_Response {
        /**
         * 错误码
         */
        m_iResult: number;

        /**
         * 是否成功
         */
        m_ucSucces: number;

        /**
         * 被升级的红颜信息
         */
        m_stBeautyInfo: NewBeautyInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyZhenTu_Request {
        /**
         * 阵图配置ID
         */
        m_ucID: number;

        /**
         * BEAUTY_ZT_LIST/BEAUTY_ZT_ACT/BEAUTY_ZT_UPLV
         */
        m_iType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyZhenTu_Response {
        /**
         * 错误码
         */
        m_iResult: number;

        /**
         * 阵图配置ID
         */
        m_ucID: number;

        /**
         * BEAUTY_ZT_LIST/BEAUTY_ZT_ACT/BEAUTY_ZT_UPLV
         */
        m_iType: number;

        /**
         * 协议体
         */
        m_stValue: BeautyZTRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyZTRspValue {
        /**
         * 打开面板
         */
        m_stList: BeautyZTList;

        /**
         * 激活阵图
         */
        m_stActInfo: OneBeautyZTInfo;

        /**
         * 升级阵图
         */
        m_stUpLvInfo: OneBeautyZTInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyZTList {
        /**
         * 阵图数量
         */
        m_ucNum: number;

        /**
         * 当前祝福值
         */
        m_stInfo: Array<OneBeautyZTInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneBeautyZTInfo {
        /**
         * 等级
         */
        m_ucLevel: number;

        /**
         * 当前祝福值
         */
        m_ucLucky: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Buff_Notify {
        /**
         * 单元数量
         */
        m_ucNumber: number;

        m_astBuff: Array<UnitBuff>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class UnitBuff {
        /**
         * 目标对象类型:角色、怪物、散仙
         */
        m_ucUnitType: number;

        /**
         * 目标对象
         */
        m_stRoleID: RoleID;

        /**
         * 目标对象的单元ID
         */
        m_iUnitID: number;

        /**
         * 变更列表
         */
        m_stBuffChangeList: BuffChangeList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BuffChangeList {
        /**
         * 更新数量
         */
        m_ucUpdateBuffNumber: number;

        /**
         * 更新Buff列表
         */
        m_astUpdateBuff: Array<BuffInfo>;

        /**
         * 删除数量
         */
        m_ucDeleteBuffNumber: number;

        /**
         * 删除Buff ID
         */
        m_astDeleteBuffID: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BuffInfo {
        /**
         * Buff ID
         */
        m_iBuffID: number;

        /**
         * 叠加层数
         */
        m_ucBuffPileLayer: number;

        /**
         * 计时类、永久类
         */
        m_ucBuffType: number;

        /**
         * bufff方向
         */
        m_ucBuffDirection: number;

        /**
         * 剩余时间，单位秒，只适用于计时类
         */
        m_iBuffRemainTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Buff_Request {
        /**
         * 发送人
         */
        m_stRoleID: RoleID;

        /**
         * 请求进行操作的Buff
         */
        m_iBuffID: number;

        /**
         * 操作
         */
        m_ucOperate: number;

        /**
         * 操作类型  0表unitid 加速,1表任务加速
         */
        m_ucType: number;

        /**
         * unitid OR 任务ID
         */
        m_iID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Buff_Response {
        /**
         * 错误码
         */
        m_ushResultID: number;

        /**
         * 请求进行操作的Buff
         */
        m_iBuffID: number;

        /**
         * 操作
         */
        m_ucOperate: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BuyBigHpMp_Request {
        /**
         * 购买大红或者大蓝    EUAI_HPSTORE EUAI_MPSTORE
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BuyBigHpMp_Response {
        /**
         * 错误码
         */
        m_ucResultID: number;

        /**
         * 购买大红或者大蓝    EUAI_HPSTORE EUAI_MPSTORE
         */
        m_ucType: number;

        /**
         * 现有大红或者大蓝值
         */
        m_uiValue: number;

        /**
         * 花了多少铜钱
         */
        m_uiTongQian: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSAddGMQA_Request {
        /**
         * 问题类型
         */
        m_shType: number;

        /**
         * 玩家问题内容
         */
        m_szQuestion: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSAddGMQA_Response {
        /**
         * 0成功，其它表示错误码
         */
        m_iResult: number;

        /**
         * 所有本人已提问题列表
         */
        m_stList: DBGMQADataCli;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBGMQADataCli {
        /**
         * 已提问问题个数
         */
        m_ucCount: number;

        /**
         * QA问题列表
         */
        m_stQAList: Array<DBGMQAOneDataCli>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBGMQAOneDataCli {
        /**
         * 问题类型
         */
        m_shType: number;

        /**
         * 提问的时间, 加上ROLEID做为本问题题的唯一标识
         */
        m_iQuestionTime: number;

        /**
         * 玩家问题内容
         */
        m_szQuestion: string;

        /**
         * 回复的时间
         */
        m_iAnswerTime: number;

        /**
         * 管理员问题回复
         */
        m_szAnswer: string;

        /**
         * 是否已经读过了
         */
        m_ucReadTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSAddSpecSkill_Notify {
        /**
         * 技能ID
         */
        m_iSkillID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSBeKilled_Notify {
        /**
         * 对应 KILLED_TYPE 系列宏
         */
        m_iType: number;

        /**
         * 死在哪个场景
         */
        m_iSceneID: number;

        /**
         * 杀手的RoleID
         */
        m_stKillerID: RoleID;

        /**
         * 杀手的名字
         */
        m_szRoleName: string;

        /**
         * 被杀的RoleID
         */
        m_stBeKillerID: RoleID;

        /**
         * 被杀的名字
         */
        m_szBeRoleName: string;

        /**
         * 死的时间
         */
        m_iTime: number;

        /**
         * 杀你的人所在服（跨服封神台此字段有效）
         */
        m_shWorldID: number;

        /**
         * 杀手国属
         */
        m_ucCountry: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSFlashGMQA_Notify {
        /**
         * 预留，不用
         */
        m_ucID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSGetIconMonsterRequest {
        /**
         * 目标场景ID，预留，不传表示玩家当前
         */
        m_iSceneID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSGetIconMonsterResponse {
        /**
         * 场景ID
         */
        m_iSceneID: number;

        /**
         * 怪物个数
         */
        m_ucCount: number;

        /**
         * 怪物ID
         */
        m_astList: Array<OnMonsterInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OnMonsterInfo {
        /**
         * 怪物ID
         */
        m_iID: number;

        /**
         * 坐标X
         */
        m_uiX: number;

        /**
         * 坐标Y
         */
        m_uiY: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSGetSceneMonsterRequest {
        /**
         * 目标场景ID
         */
        m_iSceneID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSGetSceneMonsterResponse {
        /**
         * 目标场景ID
         */
        m_iSceneID: number;

        /**
         * 怪物类型个数
         */
        m_ucCount: number;

        /**
         * 怪物ID
         */
        m_aiID: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSListGMQA_Request {
        /**
         * 预留，不用
         */
        m_ucID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSListGMQA_Response {
        /**
         * 所有本人已提问题列表
         */
        m_stList: DBGMQADataCli;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSMonsterChangeAvatar_Notify {
        /**
         * 怪物UnitID
         */
        m_iUnitID: number;

        /**
         * 散仙怪物UnitID
         */
        m_iPetUnitID: number;

        /**
         * 变化类型 MONSTER_TO_ROLE,MONSTER_TO_PET
         */
        m_ucType: number;

        /**
         * 变化形象的数值
         */
        m_stData: MChangeAvatarData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MChangeAvatarData {
        /**
         * 玩家信息
         */
        m_stRole: MChangeAvatarDataRoleInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MChangeAvatarDataRoleInfo {
        /**
         * 玩家信息
         */
        m_stCacheRole: CacheRoleInfo;

        /**
         * 0表本服，其它表示跨服对手的WorldID
         */
        m_ushWorlID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CacheRoleInfo {
        /**
         * 角色信息
         */
        m_stRoleInfo: RoleInfo;

        /**
         * 装备列表
         */
        m_stThingInfoList: EquipContainerThingInfoList;

        /**
         * 宗派信息
         */
        m_stGuildInfo: GuildInfo;

        /**
         * 技能列表
         */
        m_stSkillList: SkillList;

        /**
         * 玩家显示的固定称号信息
         */
        m_stShowTitleFixInfo: ShowTitleFixList;

        /**
         * 子系统数据
         */
        m_stCSHeroSubList: CSHeroSubList;

        /**
         * 子系统装备数据
         */
        m_stHeroSubContainerList: HeroSubContainerList;

        /**
         * PK信息
         */
        m_stPKInfo: PKInfo;

        /**
         * 玩家拥有的非等级时装的形象数据
         */
        m_stDressImageList: DressImageListInfo;

        /**
         * 所有红颜信息
         */
        m_stDBAllBeautyInfo: DBAllBeautyInfo;

        /**
         * 红颜装备数据
         */
        m_stBeautyContainerList: BeautyContainerList;

        /**
         * 法阵数据
         */
        m_stFaZhenList: DBFaZhenList;

        /**
         * 法宝数据
         */
        m_stFaBaoList: DBFaBaoList;

        /**
         * 魔方等级
         */
        m_uiMagicLevel: number;

        /**
         * 玩家法器数据
         */
        m_stDBFaQiList: DBFaQiList;

        /**
         * 玩家九星数据
         */
        m_stDBJiuXingList: DBJiuXingList;

        /**
         * 角色装备位数据
         */
        m_stEquipSlotInfoList: EquipSlotInfoList;

        /**
         * 角色魂骨装备位数据
         */
        m_stHunGuSlotInfoList: HunGuEquipSlotInfoList;

        /**
         * 角色魂骨装备数据
         */
        m_stHunGuThingObjList: EquipHunGuContainerThingInfoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipContainerThingInfoList {
        /**
         * 物品数量
         */
        m_ucNumber: number;

        m_astThingInfo: Array<ContainerThingInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContainerThingInfo {
        /**
         * 物品ID
         */
        m_iThingID: number;

        /**
         * 物品位置
         */
        m_usPosition: number;

        /**
         * 物品数量
         */
        m_iNumber: number;

        /**
         * 物品可变属性
         */
        m_stThingProperty: ThingProperty;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ThingProperty {
        /**
         * 物品唯一实例ID
         */
        m_stGUID: ThingGUID;

        /**
         * 绑定状态
         */
        m_ucBindStatus: number;

        /**
         * 绑定类型
         */
        m_ucBindType: number;

        /**
         * 颜色
         */
        m_ucColor: number;

        /**
         * 是否可以使用, 0表示不可使用
         */
        m_ucUsable: number;

        /**
         * 使用次数, 0表示不限制使用次数
         */
        m_iUseTimes: number;

        /**
         * 有效时间
         */
        m_iPersistTime: number;

        /**
         * 是否开始计时，0表示未开始，1表示开始
         */
        m_ucTimerStarted: number;

        /**
         * 跟NPC交易的时间, 用于回购和退款
         */
        m_iNPCTradeTime: number;

        /**
         * 跟NPC交易的价格, 用于回购和退款
         */
        m_iNPCTradePrice: number;

        /**
         * 特殊物品的id
         */
        m_ucSpecThingType: number;

        /**
         * 特殊物品属性
         */
        m_stSpecThingProperty: SpecThingProperty;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ThingGUID {
        /**
         * 物品创建时间(秒), 32位可以表示136年, 足够用
         */
        m_iCreateTime: number;

        /**
         * 13位WorldID, 不要直接将这个字段当作WorldID
         */
        m_ucWorldID: number;

        /**
         * 3位ZoneID, 不要直接将这个字段当作ZoneID
         */
        m_ucZoneID: number;

        /**
         * 物品序号
         */
        m_usSequence: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SpecThingProperty {
        
        m_stEquipInfo: EquipInfo;

        /**
         * 祝福属性
         */
        m_stZhuFuEquipInfo: ZhuFuEquipInfo;

        /**
         * 抽奖宝箱属性
         */
        m_stLotteryBoxInfo: LotteryBoxInfo;

        /**
         * 宝石属性
         */
        m_stDiamondProcessInfo: DiamondProcessInfo;

        /**
         * 魂骨装备属性
         */
        m_stHunGuEquipInfo: HunGuEquipInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipInfo {
        /**
         * 强化系统
         */
        m_stStrong: StrongInfo;

        /**
         * 宝石系统
         */
        m_stDiamond: DiamondInfo;

        /**
         * 洗练系统
         */
        m_stWash: WashInfo;

        /**
         * 炼器系统
         */
        m_stLQ: LQInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StrongInfo {
        /**
         * 当前祝福进度
         */
        m_uiStrongProgress: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DiamondInfo {
        /**
         * 宝石孔的数量[0-6]
         */
        m_ucOpen: number;

        /**
         * 宝石的id
         */
        m_aiDiamondID: Array<number>;

        /**
         * 宝石升级进度
         */
        m_aiDiamondIDProcess: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WashInfo {
        /**
         * 装备洗炼属性锁定信息，每一位标识一个锁定，0(未锁定)，1(锁定)
         */
        m_ucLockInfo: number;

        /**
         * 最多7个洗练属性
         */
        m_astAttr: Array<EquipWashPropCfg>;

        /**
         * 元宝开启洗炼条数
         */
        m_ucBuyNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipWashPropCfg {
        /**
         * 属性类型,对应EUAI宏
         */
        m_ucPropId: number;

        /**
         * 洗练星级
         */
        m_ucWashLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LQInfo {
        /**
         * 炼器等级
         */
        m_ucLQLevel: number;

        /**
         * 炼器最高等级
         */
        m_ucMaxLQLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZhuFuEquipInfo {
        /**
         * 随机属性
         */
        m_stRandAttr: RandAttrInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RandAttrInfo {
        /**
         * 随机属性条数
         */
        m_ucNum: number;

        /**
         * 属性是EUAI
         */
        m_aiPropAtt: Array<EquipPropAtt>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipPropAtt {
        
        m_ucPropId: number;

        m_iPropValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LotteryBoxInfo {
        /**
         * 所处掉落方案位置,1-255,0标识没预处理过
         */
        m_ucDropPos: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DiamondProcessInfo {
        /**
         * 宝石当前升级的进度
         */
        m_uiProcess: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuEquipInfo {
        /**
         * 随机属性
         */
        m_stRandAttr: HunGuRandAttrInfo;

        /**
         * 封装等级
         */
        m_uiFengZhuangLevel: number;

        /**
         * 技能封装
         */
        m_stSkillFZ: HunGuSkillFZ;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuRandAttrInfo {
        /**
         * 随机属性条数
         */
        m_ucNum: number;

        /**
         * 属性是EUAI,这个属性值是万分比
         */
        m_aiPropAtt: Array<HunGuEquipPropAtt>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuEquipPropAtt {
        /**
         * 属性ID
         */
        m_ucPropId: number;

        /**
         * 属性值
         */
        m_iPropValue: number;

        /**
         * 颜色
         */
        m_ucColor: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuSkillFZ {
        /**
         * 封装材料 0 表示没有封装
         */
        m_iItemID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildInfo {
        /**
         * 宗派ID
         */
        m_uiGuildID: number;

        /**
         * 宗派名字
         */
        m_szGuildName: string;

        /**
         * 宗派职位
         */
        m_ucGrade: number;

        /**
         * 宗派等级
         */
        m_ucGuildLevel: number;

        /**
         * 宗派资金
         */
        m_uiGuildMoney: number;

        /**
         * 加入宗派时间
         */
        m_uiJoinTime: number;

        /**
         * 宗派Boss等级
         */
        m_usBossLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkillList {
        /**
         * 技能个数
         */
        m_ucNumber: number;

        /**
         * 技能ID数组
         */
        m_stInfo: Array<SkillInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkillInfo {
        /**
         * 技能ID
         */
        m_iSkillID: number;

        /**
         * 技能是否被禁用(1表被禁用，不能计入效果)
         */
        m_ucForbidden: number;

        /**
         * 技能学习进度
         */
        m_usProgress: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShowTitleFixList {
        /**
         * 玩家固定称号的数量 
         */
        m_ucFixTitleNum: number;

        /**
         * 称号id
         */
        m_usID: Array<number>;

        /**
         * 已佩戴的成就称号
         */
        m_usShowTitleID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeroSubContainerList {
        /**
         * 物品数量
         */
        m_ucCount: number;

        m_stList: Array<HeroSubEquipList>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeroSubEquipList {
        /**
         * 容器类型
         */
        m_ucType: number;

        /**
         * 物品数量
         */
        m_ucNumber: number;

        m_astThingInfo: Array<ContainerThingInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBAllBeautyInfo {
        /**
         * 出战红颜ID, 若ID为0,则没有红颜出战
         */
        m_iBattlePetID: number;

        /**
         * 已激活的红颜列表
         */
        m_stBeautyList: DBBeautyList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBBeautyList {
        /**
         * 激活的红颜数量
         */
        m_ucBeautyNumber: number;

        m_astBeautyList: Array<DBBeautyInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBBeautyInfo {
        /**
         * 红颜配置编号
         */
        m_iBeautyID: number;

        /**
         * 红颜阶级
         */
        m_uiStage: number;

        /**
         * 当前阶级祝福值
         */
        m_uiStageBless: number;

        /**
         * 红颜战力
         */
        m_uiPetFight: number;

        /**
         * 红颜祝福值清空时间
         */
        m_uiBlessClearTime: number;

        /**
         * 武缘到期时间
         */
        m_uiTimeOut: number;

        /**
         * 属性丹个数
         */
        m_uiSXDrugCount: number;

        /**
         * 资质丹个数
         */
        m_uiZZDrugCount: number;

        /**
         * 缘分数组
         */
        m_astFateList: Array<BeautyFateInfo>;

        /**
         * 武缘聚神信息
         */
        m_stJuShen: DBBeautyJuShen;

        /**
         * 武缘飞升
         */
        m_stFeiSheng: DBBeautyFeiSheng;

        /**
         * 武缘觉醒
         */
        m_stAwake: DBBeautyAwake;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyFateInfo {
        /**
         * 当前缘分等级
         */
        m_iLevel: number;

        /**
         * 进度(这里暂且只放功法的道具数量)
         */
        m_uiProgress: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBBeautyJuShen {
        /**
         * 聚神等级
         */
        m_uiLevel: number;

        /**
         * 祝福值
         */
        m_uiWish: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBBeautyFeiSheng {
        /**
         * 武缘飞升的计数
         */
        m_ucNum: number;

        /**
         * 武缘飞升时的等级
         */
        m_usStage: Array<number>;

        /**
         * 武缘飞升时的聚神等级
         */
        m_usFSLv: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBBeautyAwake {
        /**
         * 觉醒等级
         */
        m_ucLevel: number;

        /**
         * 觉醒进度
         */
        m_usLuck: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyContainerList {
        /**
         * 物品数量
         */
        m_usNumber: number;

        m_astThingInfo: Array<ContainerThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContainerThing {
        /**
         * 物品ID
         */
        m_iThingID: number;

        /**
         * 物品位置
         */
        m_usPosition: number;

        /**
         * 物品数量
         */
        m_iNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBFaZhenList {
        /**
         * 佩戴法阵的ID，0表示未佩戴任何法阵
         */
        m_ucID: number;

        /**
         * 法阵的个数
         */
        m_ucNumber: number;

        m_astFaZhenList: Array<DBFaZhenOneInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBFaZhenOneInfo {
        /**
         * 法阵是否已经激活
         */
        m_ucIsActive: number;

        /**
         * 法阵部位激活列表，1表示激活，0表示未激活,用位来存(能省一点是一点)
         */
        m_shPart: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBFaBaoList {
        /**
         * Avatar显示法宝ID
         */
        m_ucShowID: number;

        /**
         * 法宝个数
         */
        m_ucNumber: number;

        m_astFaBaoList: Array<DBFaBaoInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBFaBaoInfo {
        /**
         * 法宝ID
         */
        m_ucID: number;

        /**
         * 等级
         */
        m_usLevel: number;

        /**
         * 镶嵌个数
         */
        m_ucXQCnt: number;

        /**
         * 镶嵌列表
         */
        m_aiXQID: Array<number>;

        /**
         * 是否已激活
         */
        m_ucHaveActive: number;

        /**
         * 材料种类
         */
        m_ucAccessCount: number;

        /**
         * 激活材料列表
         */
        m_aiActiveConsume: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBFaQiList {
        /**
         * 形象id
         */
        m_ucShowId: number;

        m_astFaQiList: Array<DBFaQiInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBFaQiInfo {
        /**
         * 等阶
         */
        m_ucLayer: number;

        /**
         * 祝福值
         */
        m_uiWish: number;

        /**
         * 清空时间
         */
        m_uiTimeOut: number;

        /**
         * 注魂信息
         */
        m_stZhuHun: DBFaQiZhuHun;

        /**
         * 衰减的祝福值
         */
        m_uiSaveWish: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBFaQiZhuHun {
        /**
         * 注魂等级
         */
        m_uiLevel: number;

        /**
         * 祝福值
         */
        m_uiWish: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBJiuXingList {
        /**
         * 道宫九星的等级
         */
        m_usLevel: number;

        /**
         * 道宫九星的升级祝福值
         */
        m_uiLucky: number;

        /**
         * 保留祝福值
         */
        m_uiSaveLucky: number;

        /**
         * 祝福时间
         */
        m_uiLuckyTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipHunGuContainerThingInfoList {
        /**
         * 物品数量
         */
        m_iThingNumber: number;

        m_astThingObj: Array<ContainerThingInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSPKStatus_Request {
        /**
         * PK状态 PK_STATUS
         */
        m_ucNewPKStaus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CampBattleKill_Notify {
        /**
         * 杀人书
         */
        m_uiKillCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CastSkill_Notify {
        /**
         * 施展者单位编号
         */
        m_iUnitID: number;

        /**
         * 技能参数
         */
        m_stCastSkillParamerter: CastSkillParameter;

        /**
         * 技能释放阶段
         */
        m_ucCastStatus: number;

        /**
         * 技能释放目标，用于判定技能是否可释放，可能是技能释放位置，也可能是具体的UnitID
         */
        m_stSkillTarget: SkillTarget;

        /**
         * 技能效果目标
         */
        m_stSkillTargetList: SkillEffectTargetList;

        /**
         * 属性变化
         */
        m_stUACList: UACList;

        /**
         * 施展者的属主单位编号
         */
        m_iOwnerUnitID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CastSkillParameter {
        /**
         * 释放技能参数类型
         */
        m_ucType: number;

        /**
         * 释放技能参数值
         */
        m_stValue: CastSkillParameterValue;

        /**
         * 施法角度
         */
        m_ushAngle: number;

        /**
         * 透传字段
         */
        m_ucTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CastSkillParameterValue {
        /**
         * 技能ID
         */
        m_iSkillID: number;

        /**
         * 技能ID
         */
        m_iPrevSkillID: number;

        /**
         * 使用物品时的物品信息
         */
        m_stContainerThing: ContainerThing;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkillTarget {
        /**
         * 目标类型
         */
        m_ushTargetType: number;

        /**
         * 技能目标SceneUnitID
         */
        m_iUnitID: number;

        /**
         * 技能目标位置
         */
        m_stUnitPosition: UnitPosition;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkillEffectTargetList {
        /**
         * 目标个数
         */
        m_ucEffectTargetNumber: number;

        /**
         * 具体的效果目标
         */
        m_astSkillEffectTarget: Array<SkillEffectTarget>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkillEffectTarget {
        /**
         * 效果目标
         */
        m_iUnitID: number;

        /**
         * 技能效果掩码，代表技能作用于该效果目标的技能效果
         */
        m_ucEffectMask: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class UACList {
        /**
         * 施展者数量
         */
        m_ucCasterNumber: number;

        /**
         * 施展者属性变化
         */
        m_astCasterUAC: Array<UnitAttributeChanged>;

        /**
         * 技能有效目标数量
         */
        m_ucTargetNumber: number;

        /**
         * 技能有效目标属性变化
         */
        m_astTargetUAC: Array<UnitAttributeChanged>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class UnitAttributeChanged {
        /**
         * 属性变化UnitID
         */
        m_iUnitID: number;

        m_stRoleID: RoleID;

        m_ucUnitType: number;

        /**
         * 属性掩码
         */
        m_uiMask: number;

        /**
         * 属性掩码
         */
        m_uiMask64: number;

        /**
         * 属性个数
         */
        m_ucNumber: number;

        m_allCurrentValue: Array<number>;

        m_allDeltaValue: Array<number>;

        /**
         * 单位状态
         */
        m_uiUnitStatus: number;

        /**
         * 特殊效果属性掩码
         */
        m_uiEffectMask: number;

        /**
         * 施法者
         */
        m_iCasterUnitID: number;

        /**
         * 施法者类型
         */
        m_iCasterType: number;

        /**
         * 施法者名字
         */
        m_szCasterName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CastSkill_Request {
        /**
         * 施展者单位编号
         */
        m_ushCasterUnitID: number;

        /**
         * 技能参数
         */
        m_stCastSkillParamerter: CastSkillParameter;

        /**
         * 技能释放目标，用于判定技能是否可释放，可能是技能释放位置，也可能是具体的UnitID
         */
        m_stSkillTarget: SkillTarget;

        /**
         * 技能效果目标
         */
        m_stEffectTargetList: SkillEffectTargetList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CastSkill_Response {
        
        m_ushResultID: number;

        /**
         * 施展者单位编号
         */
        m_ushCasterUnitID: number;

        /**
         * 技能参数
         */
        m_stCastSkillParamerter: CastSkillParameter;

        /**
         * 技能释放目标，用于判定技能是否可释放，可能是技能释放位置，也可能是具体的UnitID
         */
        m_stSkillTarget: SkillTarget;

        /**
         * 技能效果目标
         */
        m_stSkillTargetList: SkillEffectTargetList;

        /**
         * 属性变化
         */
        m_stUACList: UACList;

        /**
         * 当前技能熟练度
         */
        m_iProficiency: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ChangeCDKey_Request {
        /**
         * 操作类型，预览(1)、兑换(2)
         */
        m_iType: number;

        /**
         * CDKey
         */
        m_szCDKey: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ChangeCDKey_Response {
        /**
         * 操作成功标识
         */
        m_iResult: number;

        /**
         * 操作类型，预览(1)、兑换(2)
         */
        m_iType: number;

        /**
         * CDKey
         */
        m_szCDKey: string;

        /**
         * 礼品包id
         */
        m_iGiftID: number;

        /**
         * cdkey有效截止时间字符串
         */
        m_szTime: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ChangeMountImage_Request {
        /**
         * 装备所在的容器
         */
        m_stEquipContainerID: ContainerID;

        /**
         * 装备在容器中的位置
         */
        m_ucEquipPosition: number;

        /**
         * 坐骑形象ID
         */
        m_ucImageID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContainerID {
        /**
         * 容器类型
         */
        m_ucContainerType: number;

        /**
         * 属主ID 若ID是int类型的，只用到UIN 例如CONTAINER_TYPE_CHEST
         */
        m_stOwnerID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ChargeMoney_Notify {
        /**
         * RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 玩家充值的总金额
         */
        m_iChargeMoney: number;

        /**
         * 玩家充值的金额
         */
        m_iDeltaMoney: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Charge_Rebate_Panel_Request {
        /**
         * 占位用，不填
         */
        m_ucFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Charge_Rebate_Panel_Response {
        /**
         * 返回结果：0成功，其他失败
         */
        m_iResult: number;

        /**
         * 双倍奖励剩余次数
         */
        m_ucLeftCount: number;

        /**
         * 充值档次个数
         */
        m_ucCount: number;

        /**
         * 状态列表
         */
        m_aiStatusList: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Charge_Rebate_Request {
        /**
         * 充值金额
         */
        m_uiChargeValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Charge_Rebate_Response {
        /**
         * 返回结果：0成功，其他失败
         */
        m_iResult: number;

        /**
         * 充值金额
         */
        m_uiChargeValue: number;

        /**
         * 奖励返回数量
         */
        m_uiReturnNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Chat_Notify {
        /**
         * 发送人
         */
        m_stRoleID: RoleID;

        /**
         * 性别
         */
        m_cGender: number;

        /**
         * 职业
         */
        m_cProfession: number;

        /**
         * 等级
         */
        m_usLevel: number;

        /**
         * VIP等级
         */
        m_ucVipLevel: number;

        /**
         * 发送人昵称
         */
        m_szNickName: string;

        /**
         * 所在场景类型
         */
        m_ucSceneType: number;

        /**
         * 聊天类型
         */
        m_ucChannel: number;

        /**
         * 聊天内容
         */
        m_szMessage: string;

        /**
         * 目标对象
         */
        m_stDestRoleID: RoleID;

        /**
         * 分线
         */
        m_ucZoneID: number;

        /**
         * 聊天子类型,如喇叭分 0:普通喇叭 1:铃铛喇叭
         */
        m_stSubChannelType: number;

        /**
         * 阵营id
         */
        m_iCampID: number;

        /**
         * 超链接长度
         */
        m_ucMsgDataNum: number;

        /**
         * 超链接
         */
        m_astMsgData: Array<MsgData>;

        /**
         * 是不是用来显示的GM管理员 1表示是 
         */
        m_ucGMTag: number;

        /**
         * 禁言状态. 如果玩家是被禁言的, 前台则不需要上报聊天. 0-未禁言, 1-已禁言
         */
        m_ucForbidChat: number;

        /**
         * 魂力等级
         */
        m_ucHunLiLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MsgData {
        /**
         * 类型:表情/道具/散仙/NPC/活动/物品
         */
        m_ucType: number;

        /**
         * 超链具体信息
         */
        m_stValue: ChatMsgDataValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ChatMsgDataValue {
        /**
         * 玩家角色
         */
        m_stRoleInfo: MsgRoleInfo;

        /**
         * 物品 查表能查出来（包含猎魂）
         */
        m_stThing: MsgDataThing;

        /**
         * 道具 查表查不出来，通过guid， thingid 
         */
        m_stPropThing: MsgDataPropThing;

        /**
         * 散仙 信息, 通过guid， thingid
         */
        m_stPetInfo: MsgDataPropThing;

        /**
         * 天宫宝境, 不用填写，默认为0
         */
        m_ucSkyLottery: number;

        /**
         * 国运求救 穿云箭
         */
        m_stGuoYunHelp: MsgDataChuanYunJian;

        /**
         * 宗派求救 穿云箭
         */
        m_stGuildHelp: MsgDataChuanYunJian;

        /**
         * 国家求救 穿云箭
         */
        m_stCountryHelp: MsgDataChuanYunJian;

        /**
         * 场景坐标
         */
        m_stPosition: MsgDataPosition;

        /**
         * 聊天的骰子的点数
         */
        m_ucDiceNum: number;

        /**
         * 创建宗派
         */
        m_ucGuildId: number;

        /**
         * 充值面板
         */
        m_uiChargeNum: number;

        /**
         * 宗派集结令
         */
        m_stGuildJJL: MsgDatatGuildJJL;

        /**
         * 合服活动充值回馈面板链接
         */
        m_uiMergeChargeNum: number;

        /**
         * 队长ID
         */
        m_stCaptainID: RoleID;

        /**
         * 招募队伍信息
         */
        m_stRecruitTeamInfo: MsgDataRecruitTeamInfo;

        /**
         * 副本信息
         */
        m_stPinstanceInfo: MsgDataPinstanceInfo;

        /**
         * Boss信息
         */
        m_uiBossID: number;

        /**
         * 时装属性
         */
        m_stDressProp: MsgDataDressProp;

        /**
         * 创建宗派
         */
        m_ucSendFlower: number;

        /**
         * 寄售吆喝
         */
        m_stPSBID: PSBID;

        /**
         * 红颜信息
         */
        m_stBeautyInfo: MsgDataPropThing;

        /**
         * 个人竞技类型
         */
        m_ucGRJJType: number;

        /**
         * 世界BossID信息
         */
        m_uiWorldBossID: number;

        /**
         * 幻化面板信息
         */
        m_uiImageID: number;

        /**
         * 至尊争夺面板信息，1开服，2运营
         */
        m_uiZZZDType: number;

        /**
         * 封魔塔Boss信息
         */
        m_uiFMTBossID: number;

        /**
         * 封魔塔big Boss信息
         */
        m_uiFTMBigBossID: number;

        /**
         * 打开面板 id
         */
        m_iOpenPanelID: number;

        /**
         * 语音消息信息
         */
        m_stVoiceInfo: MsgDataVoiceInfo;

        /**
         * 血战封魔 呼救 第几层
         */
        m_iXZFMFloor: number;

        /**
         * 技能ID
         */
        m_iSkillID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MsgRoleInfo {
        /**
         * 玩家roleid
         */
        m_stRoleId: RoleID;

        /**
         * 昵称
         */
        m_szNickName: string;

        /**
         * 性别
         */
        m_ucGender: number;

        /**
         * 等级
         */
        m_usLevel: number;

        /**
         * 职业
         */
        m_ucProf: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MsgDataThing {
        /**
         * 物品id
         */
        m_iThingID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MsgDataPropThing {
        /**
         * 物品id
         */
        m_iThingID: number;

        /**
         * 物品所属玩家id
         */
        m_stRoleId: RoleID;

        /**
         * GUID,散仙和道具使用
         */
        m_stThingGUID: ThingGUID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MsgDataChuanYunJian {
        /**
         * 玩家roleid
         */
        m_stRoleId: RoleID;

        /**
         * 玩家当前所在zoneid
         */
        m_ucZoneId: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MsgDataPosition {
        /**
         * 场景坐标
         */
        m_stPos: UnitPosition;

        /**
         * 玩家当前所在场景，副本中不能发此类型
         */
        m_uiSceneID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MsgDatatGuildJJL {
        /**
         * 玩家roleid
         */
        m_stPos: UnitPosition;

        /**
         * 玩家当前所在场景，副本中不能发此类型
         */
        m_uiSceneID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MsgDataRecruitTeamInfo {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 队伍ID
         */
        m_uiTeamID: number;

        /**
         * 队伍已有人数
         */
        m_ucTeamMemNum: number;

        /**
         * 队伍战力需求
         */
        m_uiFight: number;

        /**
         * 是否人满自动开1是自动开
         */
        m_ucAutoStart: number;

        /**
         * 入队密码
         */
        m_szPassword: string;

        /**
         * 队长昵称
         */
        m_szRoleName: string;

        /**
         * 玩家所在区服
         */
        m_usWorldID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MsgDataPinstanceInfo {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MsgDataDressProp {
        /**
         * 物品所属玩家id
         */
        m_stRoleId: RoleID;

        /**
         * 时装id
         */
        m_uiThingId: number;

        /**
         * 玩家拥有的非等级时装的形象数据
         */
        m_stDressImageList: DressImageListInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PSBID {
        /**
         * 创建时间
         */
        m_uiTime: number;

        /**
         * 序号
         */
        m_uiSeq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MsgDataVoiceInfo {
        /**
         * url
         */
        m_szURL: string;

        /**
         * 语音长度
         */
        m_uiMsgTime: number;

        /**
         * url
         */
        m_szText: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Chat_Request {
        /**
         * 发送人
         */
        m_stRoleID: RoleID;

        /**
         * 聊天类型
         */
        m_ucChannel: number;

        /**
         * 悄悄话对象，如果有
         */
        m_stPrivateRoleID: RoleID;

        /**
         * 聊天内容
         */
        m_szMessage: string;

        /**
         * 阵营id
         */
        m_iCampID: number;

        /**
         * 超链接长度
         */
        m_ucMsgDataNum: number;

        /**
         * 超链接
         */
        m_astMsgData: Array<MsgData>;

        /**
         * 聊天验证码，预留
         */
        m_ucCheck: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Chat_Response {
        /**
         * 错误码
         */
        m_ushResultID: number;

        /**
         * 发送人
         */
        m_stRoleID: RoleID;

        /**
         * 所在场景类型
         */
        m_ucSceneType: number;

        /**
         * 聊天类型
         */
        m_ucChannel: number;

        /**
         * 悄悄话对象，如果有
         */
        m_stPrivateRoleID: RoleID;

        /**
         * 悄悄话对象昵称，如果有
         */
        m_szNickName: string;

        /**
         * 聊天内容
         */
        m_szMessage: string;

        /**
         * 分线
         */
        m_ucZoneID: number;

        /**
         * 超链接长度
         */
        m_ucMsgDataNum: number;

        /**
         * 超链接
         */
        m_astMsgData: Array<MsgData>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CityKingChange_Notify {
        /**
         * 城主信息
         */
        m_stCityKingInfo: GuildPVPSSBattleChairmanValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ClickMenu_Request {
        /**
         * 有可能是副本ID, NPCID, MonserID
         */
        m_iOwnerID: number;

        /**
         * 有可能是unitid
         */
        m_iExtraParam: number;

        /**
         * 菜单索引
         */
        m_ucMenuNodeIndex: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ClientPanelSet_Request {
        /**
         * 面板id
         */
        m_iPanelID: number;

        /**
         * 面板状态, 0关闭，1打开
         */
        m_iStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ClientPanelSet_Response {
        /**
         * 结果码
         */
        m_uiResult: number;

        /**
         * 面板id
         */
        m_iPanelID: number;

        /**
         * 面板状态, 0关闭，1打开
         */
        m_iStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CompleteRewardQuest_Request {
        /**
         * 任务类型
         */
        m_ucQuestType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Condition_Invalid_Notify {
        /**
         * 条件不足的类型
         */
        m_ushType: number;

        /**
         * 条件不足的信息
         */
        m_stValue: Condition_Invalid_Value;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Condition_Invalid_Value {
        /**
         * 福神宝箱击杀条件不足. 占位符
         */
        m_ucFSBXNotify: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContainerBuySpace_Request {
        /**
         * 容器属性
         */
        m_stContainerID: ContainerID;

        /**
         * 要购买的格子数
         */
        m_ushSpaceNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContainerChanged_Notify {
        /**
         * 操作结果
         */
        m_ushResultID: number;

        /**
         * 变化原因
         */
        m_ucChangedReason: number;

        /**
         * 容器变化列表
         */
        m_stContainerChanged: ContainerChangedList;

        /**
         * 引发本次操作的UnitID，暂时对Monster掉落有效
         */
        m_iTargetUnitID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContainerChangedList {
        /**
         * 变化的容器数量
         */
        m_iContainerNumber: number;

        m_astContainerChanged: Array<ContainerChanged>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContainerChanged {
        /**
         * 容器属性
         */
        m_stContainerID: ContainerID;

        /**
         * 新增的物品
         */
        m_stAddedThingInfoList: ContainerThingInfoList;

        /**
         * 变化的物品
         */
        m_stDeletedThingList: ContainerThingList;

        /**
         * 可用背包位置数量
         */
        m_ushEnableSpaceNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContainerThingInfoList {
        /**
         * 物品数量
         */
        m_iThingNumber: number;

        m_astThingInfo: Array<ContainerThingInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContainerThingList {
        /**
         * 物品数量
         */
        m_iThingNumber: number;

        m_astThing: Array<ContainerThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CountdownTimer_Notify {
        /**
         * 定时器列表
         */
        m_stCountdownTimerList: CountdownTimerList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CountdownTimerList {
        /**
         * 倒计时个数
         */
        m_ucNumber: number;

        /**
         * 倒计时
         */
        m_astCountdownTimer: Array<CountdownTimer>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CountdownTimer {
        /**
         * 倒计时ID
         */
        m_ushID: number;

        m_szCaption: string;

        /**
         * 秒
         */
        m_ushTotalTime: number;

        /**
         * 秒
         */
        m_ushRemainingTime: number;

        /**
         * 定时器显示类型
         */
        m_ucShowType: number;

        /**
         * 是否暂停
         */
        m_ucPause: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrazyBlood_Request {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: CrazyBloodRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrazyBloodRequestValue {
        /**
         * 打开血脉面板，占位
         */
        m_ucOpen: number;

        /**
         * 提升血脉阶级，占位
         */
        m_ucUpStage: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrazyBlood_Response {
        /**
         * 请求操作协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResult: number;

        /**
         * 协议体
         */
        m_stValue: CrazyBloodResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrazyBloodResponseValue {
        /**
         * 血脉的面板信息
         */
        m_stOpenRsp: CrazyBloodInfo;

        /**
         * 血脉的提升信息
         */
        m_stUpStageRsp: CrazyBloodInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CreateRole_Account_Request {
        /**
         * 登陆态信息
         */
        m_stLianYunPlatInfo: LianYunPlatKeyInfo;

        /**
         * Uin
         */
        m_uiUin: number;

        /**
         * 范围是[0, MAX_WORLD_NUMBER-1]
         */
        m_shWorldID: number;

        m_cProfession: number;

        m_cGender: number;

        m_szNickName: string;

        /**
         * 邀请者RoleID
         */
        m_stInviteRoleID: RoleID;

        /**
         * 国家
         */
        m_cCountry: number;

        /**
         * 客户端类型
         */
        m_ucClientType: number;

        /**
         * 客户端唯一标识 64位字符串
         */
        m_szDeviceUID: string;

        /**
         * 设备信息
         */
        m_stDeviceInfo: DeviceInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LianYunPlatKeyInfo {
        /**
         * 平台账号名字
         */
        m_szPlatNameStr: string;

        /**
         * 登陆类型1网页, 2微端, 和平台协议保持一致用int吧
         */
        m_iClient: number;

        /**
         * 是否是成年玩家 -1 由后端自行做实名验证 0未成年 1成年
         */
        m_iIsAdult: number;

        /**
         * 服务器ID, 和平台协议保持一致用int吧
         */
        m_iServerID: number;

        /**
         * 平台服务器时间戳, 和平台协议保持一致用int吧
         */
        m_iPlatTime: number;

        /**
         * 平台Sign校验字符串
         */
        m_ucPlatSignStr: string;

        /**
         * 平台类型 20170524 修改为int型
         */
        m_usType: number;

        /**
         * 渠道账号
         */
        m_szChannelID: string;

        /**
         * 手机PC登录用
         */
        m_uiTokenID: number;

        /**
         * 手机PC登录用
         */
        m_uiSessionID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DeviceInfo {
        /**
         * IMEI原始值 ios系统允许为空
         */
        m_szStrIemi: string;

        /**
         * MAC原始值转大写
         */
        m_szStrMac: string;

        /**
         * IDFA原始值 IOS
         */
        m_szStrIdfa: string;

        /**
         * Android原始值 Android
         */
        m_szStrAndroid: string;

        /**
         * 设备品牌
         */
        m_szStrDeviceBrand: string;

        /**
         * 设备型号
         */
        m_szStrDeviceType: string;

        /**
         * 是否是安卓: 1安卓  0IOS
         */
        m_iIsAndriod: number;

        m_szClientVersion: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CreateRole_Account_Response {
        
        m_uiResultID: number;

        m_cGender: number;

        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        m_szNickName: string;

        m_stAvatarList: AvatarList;

        m_iWorldID: number;

        /**
         * 国家
         */
        m_cCountry: number;

        /**
         * 角色账号
         */
        m_szUserName: string;

        /**
         * 平台ID 手游一个平台会有多个游戏包 前3位表示平台 后三位表示游戏包ID
         */
        m_iPlatform: number;

        /**
         * 平台账号
         */
        m_szOpenID: string;

        /**
         * 渠道账号
         */
        m_szChannelID: string;

        /**
         * 客户端类型
         */
        m_ucClientType: number;

        /**
         * 客户端唯一标识 64位字符串
         */
        m_szDeviceUID: string;

        /**
         * 设备信息
         */
        m_stDeviceInfo: DeviceInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Cross_CS_Request {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: CrossCSRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrossCSRequestValue {
        /**
         * 跨服_单人PVP打开历届面板
         */
        m_ucCSSingleSessionOpenReq: number;

        /**
         * 跨服_单人PVP打开决赛面板
         */
        m_ucCSSingleFinalOpenReq: number;

        /**
         * 跨服_投注 GameID
         */
        m_stCSSingleFinalBet: SingleFinalBetReq;

        /**
         * 跨服_领取投注奖励 GameID
         */
        m_iCSSingleFinalBetGet: number;

        /**
         * 跨服_冠军投注
         */
        m_stCSSingleFinalWinBet: SingleFinalWinBetReq;

        /**
         * 跨服_领取冠军投注奖励, 默认0
         */
        m_iCSSingleFinalWinBetGet: number;

        /**
         * 占位 跨服_珍珑棋局 面板
         */
        m_iZLQJPannelReq: number;

        /**
         * 占位 跨服_珍珑棋局 报名
         */
        m_iZLQJSignupReq: number;

        /**
         * 占位 跨服_王侯将相 清CD    REQ
         */
        m_iWHJXCDCleanReq: number;

        /**
         * 占位 跨服_王侯将相 打开面板    REQ
         */
        m_iWHJXPannelReq: number;

        /**
         * 礼包ID 跨服_王侯将相 购买礼包    REQ
         */
        m_iWHJXBuyReq: number;

        /**
         * 挑战类型 跨服_王侯将相 申请挑战    REQ GROUP_WHJX_TYPE
         */
        m_iWHJXApplyPKReq: number;

        /**
         * 跨服_王侯将相 处理被挑战  REQ 接受同时发起同步CSSYNROLE协议
         */
        m_stHWJXApplyDealReq: WHJXApplyDeal;

        /**
         * 跨服_查看某副本队伍列表
         */
        m_stCSCrossGetTeamListReq: CSCross_GetTeamList_Request;

        /**
         * 跨服_创建队伍
         */
        m_stCSCrossCreateTeamReq: CSCross_CreateTeam_Request;

        /**
         * 跨服_加入队伍
         */
        m_stCSCrossJoinTeamReq: CSCross_JoinTeam_Request;

        /**
         * 跨服_退出队伍
         */
        m_stCSCrossExitTeamReq: CSCross_ExitTeam_Request;

        /**
         * 跨服_踢出队伍
         */
        m_stCSCrossKickTeamReq: CSCross_KickTeam_Request;

        /**
         * 跨服_招募队友
         */
        m_stCSCrossRecruitTeamReq: CSCross_RecruitTeam_Request;

        /**
         * 跨服_副本准备
         */
        m_stCSCrossReadyTeamReq: CSCross_ReadyTeam_Request;

        /**
         * 跨服_开始副本
         */
        m_stCSCrossStartPinReq: CSCross_StartPin_Request;

        /**
         * 跨服_副本设置
         */
        m_stCSCrossSetTeamReq: CSCross_SetTeam_Request;

        /**
         * 跨服_单人PVP副本排行榜
         */
        m_stCSSingleRankReq: CSSingleRank_Request;

        /**
         * 跨服_参加单人PVP副本
         */
        m_stCSSingleJoinReq: CSSingleJoin_Request;

        /**
         * 跨服_退出单人PVP副本
         */
        m_stCSSingleExitReq: CSSingleExit_Request;

        /**
         * 跨服_购买单人PVP副本次数
         */
        m_stCSSingleBuyReq: CSSingleBuy_Request;

        /**
         * 跨服_单人PVP领取奖励 占位
         */
        m_ucCSSingleReward: number;

        /**
         * 跨服_单人PVP打开面板
         */
        m_stCSSingleOpenReq: CSSingleOpen_Request;

        /**
         * 跨服_玩家信息同步请求(Client)
         */
        m_stCSSynRoleCSReq: CSSynRoleCS_Request;

        /**
         * 跨服_玩家玩家域名IP上报(Client)
         */
        m_stCSWorldInfoReportReq: CSWorldInfoReport_Request;

        /**
         * 跨服_玩家打开城战的板子
         */
        m_stCSCityOpenPanelReq: CSCityOpenPanel_Request;

        /**
         * 跨服_玩家报名城战
         */
        m_stCSCitySignReq: CSCitySign_Request;

        /**
         * 跨服_玩家进入战场请求
         */
        m_stCSCityJoinReq: CSCityJoin_Request;

        /**
         * 跨服_玩家城战领日常奖励
         */
        m_stCSCityGiftReq: CSCityGift_Request;

        /**
         * 跨服_rmb已兑换信息
         */
        m_ucCSRMBGetInfoReq: number;

        /**
         * 跨服_多人按国PVP参加排队
         */
        m_stCSMultiJoinReq: CSMultiJoin_Request;

        /**
         * 跨服_多人按国PVP退出排队
         */
        m_stCSMultiExitReq: CSMultiExit_Request;

        /**
         * 跨服_多人PVP副本排行榜
         */
        m_stCSMultiRankReq: CSMultiRank_Request;

        /**
         * 跨服_四象斗兽面板
         */
        m_stCSColosseumPanelReq: CSColosseumPanel_Request;

        /**
         * 跨服_四象斗兽排行榜
         */
        m_stCSColosseumRankReq: CSColosseumRank_Request;

        /**
         * 跨服_领取四象斗兽排行榜奖励
         */
        m_stCSColosseumRewardReq: CSColosseumReward_Request;

        /**
         * 跨服_四象斗兽开始PK
         */
        m_stCSColosseumStartPKReq: CSColosseumStartPK_Request;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SingleFinalBetReq {
        /**
         * 赛场ID
         */
        m_iGameID: number;

        /**
         * 压左还是右
         */
        m_bLeft: number;

        /**
         * 投注金额
         */
        m_iMoney: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SingleFinalWinBetReq {
        /**
         * 投注冠军
         */
        m_stRoleID: RoleID;

        /**
         * 投注金额
         */
        m_iMoney: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WHJXApplyDeal {
        /**
         * 挑战的类型 GROUP_WHJX_TYPE
         */
        m_iTypeID: number;

        /**
         * 0放弃 1接受挑战
         */
        m_iOpVal: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_GetTeamList_Request {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_CreateTeam_Request {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 队伍战力需求，无需求填 0
         */
        m_uiFight: number;

        /**
         * 是否人满自动开1是自动开
         */
        m_ucAutoStart: number;

        /**
         * 入队密码，无密码填空
         */
        m_szPassword: string;

        /**
         * 玩家所在机器域名
         */
        m_szDomain: string;

        /**
         * 玩家所在域名IP 
         */
        m_szIP: string;

        /**
         * 玩家所在机器侦听端口
         */
        m_uiPort: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_JoinTeam_Request {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 队伍ID
         */
        m_uiTeamID: number;

        /**
         * 玩家所在机器域名
         */
        m_szDomain: string;

        /**
         * 玩家所在域名IP 
         */
        m_szIP: string;

        /**
         * 玩家所在机器侦听端口
         */
        m_uiPort: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_ExitTeam_Request {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 队伍ID
         */
        m_uiTeamID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_KickTeam_Request {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 队伍ID
         */
        m_uiTeamID: number;

        /**
         * 踢这个人角色ID
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_RecruitTeam_Request {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 招募类型, 0世界，1个人
         */
        m_uiType: number;

        /**
         * role个数
         */
        m_ucNum: number;

        /**
         * 召唤的role id
         */
        m_astRoleID: Array<RoleID>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_ReadyTeam_Request {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 队伍ID
         */
        m_uiTeamID: number;

        /**
         * 是否准备1是准备
         */
        m_ucReady: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_StartPin_Request {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 队伍ID
         */
        m_uiTeamID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_SetTeam_Request {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 队伍ID
         */
        m_uiTeamID: number;

        /**
         * 队伍战力需求，无需求填 0 改为等级了
         */
        m_uiFight: number;

        /**
         * 是否人满自动开1是自动开
         */
        m_ucAutoStart: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSingleRank_Request {
        /**
         * 副本ID，不用填，备用
         */
        m_uiPinstanceID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSingleJoin_Request {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 玩家所在机器域名
         */
        m_szDomain: string;

        /**
         * 玩家所在域名IP 
         */
        m_szIP: string;

        /**
         * 玩家所在机器侦听端口
         */
        m_uiPort: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSingleExit_Request {
        /**
         * 副本ID，不用填，备用
         */
        m_uiPinstanceID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSingleBuy_Request {
        /**
         * 买多少次，不用填，备用
         */
        m_uiTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSingleOpen_Request {
        /**
         * 不用填，备用
         */
        m_uiTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSynRoleCS_Request {
        /**
         * 活动ID
         */
        m_uiActID: number;

        /**
         * 要同步到哪个ID，不填先备用
         */
        m_uiToWorldID: number;

        /**
         * 扩展参数，预留，如果是世界Boss活动，填BossID
         */
        m_uiExpandPara: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSWorldInfoReport_Request {
        /**
         * 本服的IP端口信息
         */
        m_stInfo: LinkWorldInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCityOpenPanel_Request {
        /**
         * 备用，不填
         */
        m_ucTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCitySign_Request {
        /**
         * 参加哪个城战，CITY_NAME_宏
         */
        m_ucCityID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCityJoin_Request {
        /**
         * 参加哪个城战，CITY_NAME_宏，备用，不用填
         */
        m_ucCityID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCityGift_Request {
        /**
         * 领哪个城的礼包，CITY_NAME_宏，备用，不用填
         */
        m_ucCityID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSMultiJoin_Request {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 玩家所在机器域名
         */
        m_szDomain: string;

        /**
         * 玩家所在域名IP 
         */
        m_szIP: string;

        /**
         * 玩家所在机器侦听端口
         */
        m_uiPort: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSMultiExit_Request {
        /**
         * 副本ID，不用填，备用
         */
        m_uiPinstanceID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSMultiRank_Request {
        /**
         * 副本ID，不用填，备用
         */
        m_uiPinstanceID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSColosseumPanel_Request {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSColosseumRank_Request {
        /**
         * 副本ID，不用填，备用
         */
        m_uiPinstanceID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSColosseumReward_Request {
        /**
         * 副本ID，不用填，备用
         */
        m_uiPinstanceID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSColosseumStartPK_Request {
        /**
         * 副本ID，不用填，备用
         */
        m_uiPinstanceID: number;

        /**
         * 被PK的玩家role id
         */
        m_stRoleId: RoleID;

        /**
         * 挑战类似，0是普通挑战，1是复仇
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Cross_CS_Response {
        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: CrossCSResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrossCSResponseValue {
        /**
         * 跨服_单人PVP打开历届面板
         */
        m_stCSSingleSessionOpenRsp: CSSessionFirstList;

        /**
         * 跨服_单人PVP打开决赛面板
         */
        m_stCSSingleFinalOpenRsp: CSKFJDCFinalPannelRsp;

        /**
         * 跨服_投注
         */
        m_stCSSingleFinalBetRsp: SingleFinalBetRsp;

        /**
         * 跨服_领取投注奖励
         */
        m_stCSSingleFinalBetGetRsp: SingleFinalBetGetRsp;

        /**
         * 跨服_决赛参赛选手通知
         */
        m_stCSSingleFinalPKNTF: SingleFinalPKNTF;

        /**
         * 跨服_冠军投注
         */
        m_stCSSingleFinalWinBetRsp: SingleFinalWinBetRsp;

        /**
         * 跨服_领取冠军投注奖励
         */
        m_stCSSingleFinalWinBetGetRsp: SingleFinalWinBetGetRsp;

        /**
         * 跨服_珍珑棋局 面板
         */
        m_stZLQJPannelRsp: CSZLQJRoleInfo;

        /**
         * 跨服_珍珑棋局 报名
         */
        m_stZLQJSignupRsp: CSZLQJRoleInfo;

        /**
         * 跨服_珍珑棋局 开始 分组ID CSSynRoleCS中m_uiExpandPara用 LOGINENTERTYPE中ipara2用
         */
        m_iZLQJStartRsp: number;

        /**
         * 跨服_王侯将相 清CD    REQ
         */
        m_stWHJXCDCleanRsp: WHJXCDInfo;

        /**
         * 跨服_王侯将相 打开面板    RSP
         */
        m_stWHJXPannelRsp: WHJXPannelInfo;

        /**
         * 跨服_王侯将相 购买礼包    RSP
         */
        m_stWHJXBuyRsp: WHJXBuyInfo;

        /**
         * 跨服_王侯将相 申请挑战    RSP  收到对方同意PK 前台发起跨服同步协议
         */
        m_stWHJXApplyPKRsp: WHJXApplyPKInfo;

        /**
         * 跨服_王侯将相 通知被挑战  RSP
         */
        m_stWHJXApplyNtfRsp: WHJXApplyNtfInfo;

        /**
         * 跨服_王侯将相 处理被挑战  RSP 发给被挑战者
         */
        m_stHWJXApplyDealRsp: WHJXApplyDeal;

        /**
         * 跨服_查看某副本队伍列表
         */
        m_stCSCrossGetTeamListRes: CSCross_GetTeamList_Response;

        /**
         * 跨服_创建队伍
         */
        m_stCSCrossCreateTeamRes: CSCross_CreateTeam_Response;

        /**
         * 跨服_加入队伍
         */
        m_stCSCrossJoinTeamRes: CSCross_JoinTeam_Response;

        /**
         * 跨服_退出队伍
         */
        m_stCSCrossExitTeamRes: CSCross_ExitTeam_Response;

        /**
         * 跨服_踢出队伍
         */
        m_stCSCrossKickTeamRes: CSCross_KickTeam_Response;

        /**
         * 跨服_副本准备
         */
        m_stCSCrossReadyTeamRes: CSCross_ReadyTeam_Response;

        /**
         * 跨服_开始副本
         */
        m_stCSCrossStartPinRes: CSCross_StartPin_Response;

        /**
         * 跨服_副本设置
         */
        m_stCSCrossSetTeamRes: CSCross_SetTeam_Response;

        /**
         * 跨服_队伍详细信息广播
         */
        m_stCSCrossTeamDetailRes: CSCross_TeamDetail_Response;

        /**
         * 跨服_招募队伍
         */
        m_stCSCrossRecruitTeamRes: CSCross_RecruitTeam_Response;

        /**
         * 跨服_同步玩家数据通知
         */
        m_stCSCrossSynRoleRes: CSCross_SynRole_Response;

        /**
         * 跨服_玩家信息同步请求(Client)
         */
        m_stCSSynRoleCSRes: CSSynRoleCS_Response;

        /**
         * 跨服_单人PVP副本排行榜
         */
        m_stCSSingleRankRes: CSSingleRank_Response;

        /**
         * 跨服_参加单人PVP副本
         */
        m_stCSSingleJoinRes: CSSingleJoin_Response;

        /**
         * 跨服_退出单人PVP副本
         */
        m_stCSSingleExitRes: CSSingleExit_Response;

        /**
         * 跨服_购买单人PVP副本次数
         */
        m_stCSSingleBuyRes: CSSingleBuy_Response;

        /**
         * 跨服_单人PVP开始副本
         */
        m_stCSSingleStartRes: CSCross_StartPin_Response;

        /**
         * 跨服_单人PVP领取奖励
         */
        m_stCSSingleRewardRsp: CSSingleReward_Response;

        /**
         * 跨服_单人PVP打开面板
         */
        m_stCSSingleOpenRes: CSSingleOpen_Response;

        /**
         * 跨服_玩家打开城战的板子
         */
        m_stCSCityOpenPanelRes: CSCityOpenPanel_Response;

        /**
         * 跨服_玩家报名城战
         */
        m_stCSCitySignRes: CSCitySign_Response;

        /**
         * 跨服_玩家进入战场请求
         */
        m_stCSCityJoinRes: CSCityJoin_Response;

        /**
         * 跨服_玩家城战领日常奖励
         */
        m_stCSCityGiftRes: CSCityGift_Response;

        /**
         * 跨服_rmb已兑换信息
         */
        m_stCSRMBGetInfoRes: CSRMBGetInfo_Response;

        /**
         * 跨服_rmb战场开战通知
         */
        m_ucCSRMBZCStartRes: number;

        /**
         * 跨服_宗派战跨服失败消息
         */
        m_usGuildCrossPVPRes: number;

        /**
         * 跨服_多人按国PVP参加排队
         */
        m_stCSMultiJoinRes: CSMultiJoin_Response;

        /**
         * 跨服_多人按国PVP退出排队
         */
        m_stCSMultiExitRes: CSMultiExit_Response;

        /**
         * 跨服_多人PVP副本排行榜
         */
        m_stCSMultiRankRes: CSMultiRank_Response;

        /**
         * 跨服_多人PVP开始副本
         */
        m_stCSMultiStartRes: CSCross_StartPin_Response;

        /**
         * 跨服_四象斗兽面板
         */
        m_stCSColosseumPanelRes: CSColosseumPanel_Response;

        /**
         * 跨服_四象斗兽排行榜
         */
        m_stCSColosseumRankRes: CSColosseumRank_Response;

        /**
         * 跨服_领取四象斗兽排行榜奖励
         */
        m_stCSColosseumRewardRes: CSColosseumReward_Response;

        /**
         * 跨服_四象斗兽开始PK
         */
        m_stCSColosseumStartPKRes: CSColosseumStartPK_Response;

        /**
         * 跨服_四象斗兽请求获取四象币
         */
        m_uiSSColosseumMoneyRes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSessionFirstList {
        /**
         * 当前第几届
         */
        m_iSessionID: number;

        /**
         * 数组个数
         */
        m_iCount: number;

        /**
         * 100届数组
         */
        m_stList: Array<CSSingleSessionOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSingleSessionOne {
        /**
         * 第几届
         */
        m_iSessionID: number;

        /**
         * 生成时间
         */
        m_uiTime: number;

        /**
         * 玩家role id
         */
        m_stRoleId: RoleID;

        /**
         * 角色名
         */
        m_szNickName: string;

        /**
         * 性别
         */
        m_ucGender: number;

        /**
         * 战力
         */
        m_uiFight: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSKFJDCFinalPannelRsp {
        /**
         * 比赛信息
         */
        m_stGameInfo: CSKFJDCFinalPannel;

        /**
         * 投注信息
         */
        m_stBetInfo: CSKFJDCFinalBet;

        /**
         * 投注冠军信息
         */
        m_stWinBetInfo: CSKFJDCFinalWinBet;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSKFJDCFinalPannel {
        /**
         * 比赛进度 参考宏 KFJDC_FINAL_PROGRESS
         */
        m_iProgress: number;

        /**
         * 当前赛程开始时间
         */
        m_uiStartTime: number;

        /**
         * 当前赛程结束时间
         */
        m_uiEndTime: number;

        /**
         * 赛场个数
         */
        m_iGameCount: number;

        /**
         * 赛场个数
         */
        m_stGameList: Array<CSKFJDCFinalGame>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSKFJDCFinalGame {
        /**
         * 赛场ID
         */
        m_iGameID: number;

        /**
         * 参赛玩家
         */
        m_stLeftRole: CliSimSingleOneRank;

        /**
         * 参赛玩家
         */
        m_stRightRole: CliSimSingleOneRank;

        /**
         * 选手A 参考宏 KFJDC_FINAL_PLAYER
         */
        m_ucLeftStatus: number;

        /**
         * 选手B 参考宏 KFJDC_FINAL_PLAYER
         */
        m_ucRightStatus: number;

        /**
         * 压注左边选手总金额
         */
        m_llLeftMoney: number;

        /**
         * 压注右边选手总金额
         */
        m_llRightMoney: number;

        /**
         * 压注左边选手冠军金额
         */
        m_llLeftWinBet: number;

        /**
         * 压注右边选手冠军金额
         */
        m_llRightWinBet: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CliSimSingleOneRank {
        /**
         * 玩家role id
         */
        m_stRoleId: RoleID;

        /**
         * 角色名
         */
        m_szNickName: string;

        /**
         * 名次标识,0-32,1-16,2-8,4-4,8-2,16-1
         */
        m_ucRank: number;

        /**
         * 本轮积分
         */
        m_uiScore: number;

        /**
         * 本轮段位
         */
        m_uiGrade: number;

        /**
         * 角色Avatar
         */
        m_stAvatar: AvatarList;

        /**
         * 性别
         */
        m_ucGender: number;

        /**
         * 职业
         */
        m_ucProf: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSKFJDCFinalBet {
        /**
         * 投注次数
         */
        m_ucBetCount: number;

        /**
         * 投注数组
         */
        m_stBetList: Array<CSKFJDCBetInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSKFJDCBetInfo {
        /**
         * 赛场ID
         */
        m_iGameID: number;

        /**
         * 投注金额
         */
        m_iMoney: number;

        /**
         * 0等待结果 1赢 2输 3平局
         */
        m_bWinStatus: number;

        /**
         * 是否已领取
         */
        m_bGet: number;

        /**
         * 是否投左边
         */
        m_bLeft: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSKFJDCFinalWinBet {
        /**
         * 投注的roleid
         */
        m_stBetWinRoleID: RoleID;

        /**
         * 投注的金额
         */
        m_iBetWinMoney: number;

        /**
         * 可获得分红
         */
        m_iRewardMoney: number;

        /**
         * 等待结果0 赢1 输2 平局3
         */
        m_bWinStatus: number;

        /**
         * 未领取0 已领取1
         */
        m_ucWinBetBit: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SingleFinalBetRsp {
        /**
         * 赛场ID
         */
        m_iGameID: number;

        /**
         * 投注金额
         */
        m_iMoney: number;

        /**
         * 比赛信息
         */
        m_stGameInfo: CSKFJDCFinalPannel;

        /**
         * 投注信息
         */
        m_stBetInfo: CSKFJDCFinalBet;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SingleFinalBetGetRsp {
        /**
         * 赛场ID
         */
        m_iGameID: number;

        /**
         * 投注金额
         */
        m_iMoney: number;

        /**
         * 投注信息
         */
        m_stBetInfo: CSKFJDCFinalBet;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SingleFinalPKNTF {
        /**
         * 比赛进度 参考宏 KFJDC_FINAL_PROGRESS
         */
        m_iProgress: number;

        /**
         * 赛场ID
         */
        m_iGameID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SingleFinalWinBetRsp {
        /**
         * 投注信息
         */
        m_stWinBetInfo: CSKFJDCFinalWinBet;

        /**
         * 比赛信息
         */
        m_stGameInfo: CSKFJDCFinalPannel;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SingleFinalWinBetGetRsp {
        /**
         * 获得分红
         */
        m_iRewardMoney: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSZLQJRoleInfo {
        /**
         * 报名次数
         */
        m_iCount: number;

        /**
         * 报名状态 0未报名 1已报名
         */
        m_iStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WHJXCDInfo {
        /**
         * 元宝清CD次数
         */
        m_iCDCleanCount: number;

        /**
         * CD 时间戳
         */
        m_uiCDTimeStamp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WHJXPannelInfo {
        /**
         * 已购买的道具ID
         */
        m_iBuyItemID: number;

        /**
         * 元宝清CD次数
         */
        m_iCDCleanCount: number;

        /**
         * CD 时间戳
         */
        m_uiCDTimeStamp: number;

        /**
         * 活动结束 时间戳
         */
        m_uiEndTimeStamp: number;

        /**
         * 占领数据
         */
        m_stZoneData: CSWHJXZoneData;

        /**
         * 已报名排行
         */
        m_stRankData: CSWHJXRankData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSWHJXZoneData {
        /**
         * 刷新时间
         */
        m_uiFreshTime: number;

        /**
         * 数据个数
         */
        m_iCount: number;

        /**
         * 占领的玩家数组
         */
        m_stWHJXRoleList: Array<CSWHJXZoneRole>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSWHJXZoneRole {
        /**
         * 占领时间
         */
        m_uiHoleTime: number;

        /**
         * 状态 同WHJX_PK_STATUS
         */
        m_uiStatus: number;

        /**
         * 占领玩家信息
         */
        m_stSimRoleInfo: SimRoleInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SimRoleInfo {
        
        m_stID: RoleID;

        m_stBaseProfile: BaseProfile;

        /**
         * 时装列表
         */
        m_stAvatarList: AvatarList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSWHJXRankData {
        /**
         * 人数
         */
        m_iCount: number;

        /**
         * 报名玩家数组
         */
        m_stWHJXRoleList: Array<CSWHJXRankRole>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSWHJXRankRole {
        /**
         * 玩家
         */
        m_stRoleID: RoleID;

        /**
         * 玩家战力
         */
        m_llFightVal: number;

        /**
         * 玩家名字
         */
        m_szNickName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WHJXBuyInfo {
        /**
         * 已购买的道具ID
         */
        m_iBuyItemID: number;

        /**
         * 已报名排行
         */
        m_stRankData: CSWHJXRankData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WHJXApplyPKInfo {
        /**
         * 挑战的类型 GROUP_WHJX_TYPE
         */
        m_iTypeID: number;

        /**
         * 挑战结果 WHJX_APPLY_RESULT 0挑战成功:直接占领  1对方接受挑战:前端发送跨服同步准备进入PK
         */
        m_iResult: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WHJXApplyNtfInfo {
        /**
         * 挑战者ID
         */
        m_stRoleID: RoleID;

        /**
         * 挑战者名字
         */
        m_szName: string;

        /**
         * 挑战的类型 GROUP_WHJX_TYPE
         */
        m_iTypeID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_GetTeamList_Response {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 队伍数量
         */
        m_usTeamNumber: number;

        /**
         * 队伍数组
         */
        m_astTeamList: Array<Cross_SimpleOneTeam>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Cross_SimpleOneTeam {
        /**
         * 队伍ID
         */
        m_uiTeamID: number;

        /**
         * 队伍已有人数
         */
        m_ucTeamMemNum: number;

        /**
         * 队伍成员数组
         */
        m_astSimpleTeamInfo: Array<Cross_SimpleOneTeamMem>;

        /**
         * 队伍战力需求
         */
        m_uiFight: number;

        /**
         * 是否人满自动开1是自动开
         */
        m_ucAutoStart: number;

        /**
         * 入队密码
         */
        m_szPassword: string;

        /**
         * 队长昵称
         */
        m_szRoleName: string;

        /**
         * 玩家所在区服
         */
        m_usWorldID: number;

        /**
         * 队长角色ID
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Cross_SimpleOneTeamMem {
        /**
         * 性别
         */
        m_ucGender: number;

        /**
         * 职业
         */
        m_ucProfession: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_CreateTeam_Response {
        /**
         * 队伍信息
         */
        m_stTeam: Cross_OneTeam;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Cross_OneTeam {
        /**
         * 队伍ID
         */
        m_uiTeamID: number;

        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 队伍创建时间
         */
        m_uiCreateTime: number;

        /**
         * 玩家战力 改为等级了 字段名不改
         */
        m_uiNeedFight: number;

        /**
         * 是否人满自动开1是自动开
         */
        m_ucAutoStart: number;

        /**
         * 入队密码
         */
        m_szPassword: string;

        /**
         * 队伍成员数量,第一个人是队长。
         */
        m_ucTeamMemNum: number;

        /**
         * 队伍成员数组
         */
        m_astTeamInfo: Array<Cross_OneTeamMem>;

        /**
         * 队长角色ID
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Cross_OneTeamMem {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 昵称
         */
        m_szRoleName: string;

        /**
         * 玩家战力
         */
        m_uiFight: number;

        /**
         * 是否准备，1表示准备
         */
        m_ucIsReady: number;

        /**
         * 玩家所在机器域名
         */
        m_szDomain: string;

        /**
         * 玩家所在域名IP 
         */
        m_szIP: string;

        /**
         * 玩家所在机器侦听端口
         */
        m_uiPort: number;

        /**
         * 玩家所在区服
         */
        m_usWorldID: number;

        /**
         * 性别
         */
        m_ucGender: number;

        /**
         * 职业
         */
        m_ucProfession: number;

        /**
         * 等级
         */
        m_usLevel: number;

        /**
         * 本轮积分
         */
        m_uiScore: number;

        /**
         * 本轮段位
         */
        m_uiGrade: number;

        /**
         * 本轮阵营
         */
        m_ucCamp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_JoinTeam_Response {
        /**
         * 队伍信息
         */
        m_stTeam: Cross_OneTeam;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_ExitTeam_Response {
        /**
         * 队伍信息
         */
        m_stTeam: Cross_OneTeam;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_KickTeam_Response {
        /**
         * 队伍信息
         */
        m_stTeam: Cross_OneTeam;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_ReadyTeam_Response {
        /**
         * 队伍信息
         */
        m_stTeam: Cross_OneTeam;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_StartPin_Response {
        /**
         * 队伍信息
         */
        m_stTeam: Cross_OneTeam;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_SetTeam_Response {
        /**
         * 队伍信息
         */
        m_stTeam: Cross_OneTeam;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_TeamDetail_Response {
        /**
         * 队伍信息
         */
        m_stTeam: Cross_OneTeam;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_RecruitTeam_Response {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 队伍ID
         */
        m_uiTeamID: number;

        /**
         * 队伍已有人数
         */
        m_ucTeamMemNum: number;

        /**
         * 队伍战力需求
         */
        m_uiFight: number;

        /**
         * 是否人满自动开1是自动开
         */
        m_ucAutoStart: number;

        /**
         * 入队密码
         */
        m_szPassword: string;

        /**
         * 队长昵称
         */
        m_szRoleName: string;

        /**
         * 玩家所在区服
         */
        m_usWorldID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCross_SynRole_Response {
        /**
         * 来自区服
         */
        m_usFromWorldID: number;

        /**
         * 目标区服
         */
        m_usToWorldID: number;

        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        /**
         * NAVIGATION_CROSS***
         */
        m_ucSynType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSynRoleCS_Response {
        /**
         * 活动ID
         */
        m_uiActID: number;

        /**
         * 要同步到哪个ID，不填先备用
         */
        m_uiToWorldID: number;

        /**
         * 扩展参数，预留，如果是世界Boss活动，填BossID
         */
        m_uiExpandPara: number;

        /**
         * 联服数据
         */
        m_stLinkInfo: LinkWorldInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSingleRank_Response {
        /**
         * 排行榜玩家个数
         */
        m_ucNumber: number;

        /**
         * 排行榜玩家数据
         */
        m_astList: Array<CliCrossPVPOneRank>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CliCrossPVPOneRank {
        /**
         * 玩家role id
         */
        m_stRoleId: RoleID;

        /**
         * 角色名
         */
        m_szNickName: string;

        /**
         * 性别
         */
        m_ucGender: number;

        /**
         * 职业
         */
        m_cProf: number;

        /**
         * vip等级
         */
        m_ucVipLevel: number;

        /**
         * 等级
         */
        m_usLevel: number;

        /**
         * 积分
         */
        m_uiScore: number;

        /**
         * 段位
         */
        m_uiGrade: number;

        /**
         * 战力
         */
        m_uiFight: number;

        /**
         * 玩家的avataer信息
         */
        m_stAvatarList: AvatarList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSingleJoin_Response {
        /**
         * 副本ID，不用填，备用
         */
        m_uiPinstanceID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSingleExit_Response {
        /**
         * 副本ID，不用填，备用
         */
        m_uiPinstanceID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSingleBuy_Response {
        /**
         * 今日已参加次数
         */
        m_ucTimes: number;

        /**
         * 今日已购买次数
         */
        m_ucBuyTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSingleReward_Response {
        /**
         * 今日已参加次数
         */
        m_ucTimes: number;

        /**
         * 今日已购买次数
         */
        m_ucBuyTimes: number;

        /**
         * 段位
         */
        m_uiGrade: number;

        /**
         * 积分
         */
        m_uiScore: number;

        /**
         * 奖励段位 奖励段位为0时候 不可领取
         */
        m_uiRewardGrade: number;

        /**
         * 奖励是否已领取
         */
        m_bRewardGet: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSSingleOpen_Response {
        /**
         * 今日已参加次数
         */
        m_ucTimes: number;

        /**
         * 今日已购买次数
         */
        m_ucBuyTimes: number;

        /**
         * 段位
         */
        m_uiGrade: number;

        /**
         * 积分
         */
        m_uiScore: number;

        /**
         * 奖励段位 奖励段位为0时候 不可领取
         */
        m_uiRewardGrade: number;

        /**
         * 奖励是否已领取
         */
        m_bRewardGet: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCityOpenPanel_Response {
        /**
         * 本家族报了参加哪个城战
         */
        m_ucCityID: number;

        /**
         * 报名参战的时间
         */
        m_uiTime: number;

        /**
         * 本人加入家族的时间
         */
        m_uiGuildTime: number;

        /**
         * 本人是否领过每日礼包，1表领过
         */
        m_ucGift: number;

        /**
         * 城主个数
         */
        m_ucCount: number;

        /**
         * 三个城主的数据
         */
        m_astRoleList: Array<CrossCacheRoleInfo>;

        /**
         * 三个城的占领时间
         */
        m_aiCaptureTime: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrossCacheRoleInfo {
        /**
         * 玩家大区ID
         */
        m_ushWorldID: number;

        /**
         * 角色信息
         */
        m_stInfo: CacheRoleInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCitySign_Response {
        /**
         * 参加哪个城战，CITY_NAME_宏
         */
        m_ucCityID: number;

        /**
         * 报名参战的时间
         */
        m_uiTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCityJoin_Response {
        /**
         * 参加哪个城战，CITY_NAME_宏
         */
        m_ucCityID: number;

        /**
         * 主服的IP端口信息
         */
        m_stInfo: LinkWorldInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCityGift_Response {
        /**
         * 领哪个城的礼包，CITY_NAME_宏
         */
        m_ucCityID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSRMBGetInfo_Response {
        /**
         * 全服已兑换的rmb
         */
        m_uiTotal: number;

        /**
         * 角色个数个数
         */
        m_ucCount: number;

        /**
         * 本服的兑换记录列表
         */
        m_stGetList: Array<CSRMBGetOneInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSRMBGetOneInfo {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 名字
         */
        m_szNickName: string;

        /**
         * 兑换的数量
         */
        m_uiNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSMultiJoin_Response {
        /**
         * 副本ID，不用填，备用
         */
        m_uiPinstanceID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSMultiExit_Response {
        /**
         * 副本ID，不用填，备用
         */
        m_uiPinstanceID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSMultiRank_Response {
        /**
         * 排行榜玩家个数
         */
        m_ucNumber: number;

        /**
         * 排行榜玩家数据
         */
        m_astList: Array<CliCross3V3PVPOneRank>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CliCross3V3PVPOneRank {
        /**
         * 玩家role id
         */
        m_stRoleId: RoleID;

        /**
         * 角色名
         */
        m_szNickName: string;

        /**
         * 性别
         */
        m_ucGender: number;

        /**
         * 职业
         */
        m_cProf: number;

        /**
         * vip等级
         */
        m_ucVipLevel: number;

        /**
         * 等级
         */
        m_usLevel: number;

        /**
         * 积分
         */
        m_uiScore: number;

        /**
         * 段位
         */
        m_uiGrade: number;

        /**
         * 玩家的avataer信息
         */
        m_stAvatarList: AvatarList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSColosseumPanel_Response {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 随机的可挑战玩家
         */
        m_ucCanNumber: number;

        /**
         * 可挑战玩家列表
         */
        m_astCanList: Array<CanAttackList>;

        /**
         * 我的排名，0表示未上榜
         */
        m_uiMyRank: number;

        /**
         * 四象币,无排名则为0
         */
        m_uiSSCoin: number;

        /**
         * 被挑战记录
         */
        m_ucBeNumber: number;

        /**
         * 被挑战记录
         */
        m_astBeList: Array<BeAttackList>;

        /**
         * 排行榜前面3个玩家
         */
        m_uiNumber: number;

        /**
         * 排行榜玩家数据
         */
        m_astList: Array<CliColosseumOneRank>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CanAttackList {
        /**
         * 玩家role id
         */
        m_stRoleId: RoleID;

        /**
         * 角色名
         */
        m_szNickName: string;

        /**
         * 性别
         */
        m_ucGender: number;

        /**
         * 等级
         */
        m_usLevel: number;

        /**
         * 职业
         */
        m_cProf: number;

        /**
         * 积分
         */
        m_uiScore: number;

        /**
         * 段位
         */
        m_uiGrade: number;

        /**
         * 四象之力等级
         */
        m_uiSSPowerLv: number;

        /**
         * 四象币
         */
        m_uiSSCoin: number;

        /**
         * 上阵四象神兽个数
         */
        m_ucSSCout: number;

        /**
         * 上阵四象神兽列表
         */
        m_astBattleSSList: Array<BattleSSList>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BattleSSList {
        /**
         * 四象类型
         */
        m_ucType: number;

        /**
         * 四象等级
         */
        m_ucLevel: number;

        /**
         * 经验
         */
        m_uiExp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeAttackList {
        /**
         * 玩家role id
         */
        m_stRoleId: RoleID;

        /**
         * 角色名
         */
        m_szNickName: string;

        /**
         * 掠夺的四象币
         */
        m_uiGetSSCoin: number;

        /**
         * 掠夺时间戳
         */
        m_uiTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CliColosseumOneRank {
        /**
         * 玩家role id
         */
        m_stRoleId: RoleID;

        /**
         * 角色名
         */
        m_szNickName: string;

        /**
         * 性别
         */
        m_ucGender: number;

        /**
         * 职业
         */
        m_cProf: number;

        /**
         * 等级
         */
        m_usLevel: number;

        /**
         * 积分
         */
        m_uiScore: number;

        /**
         * 段位
         */
        m_uiGrade: number;

        /**
         * 四象币
         */
        m_uiSSCoin: number;

        /**
         * 玩家的avataer信息
         */
        m_stAvatarList: AvatarList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSColosseumRank_Response {
        /**
         * 排行榜玩家个数
         */
        m_uiNumber: number;

        /**
         * 排行榜玩家数据
         */
        m_astList: Array<CliColosseumOneRank>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSColosseumReward_Response {
        /**
         * 副本ID，不用填，备用
         */
        m_uiPinstanceID: number;

        /**
         * 可领取的四象币
         */
        m_uiGetSSCoin: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSColosseumStartPK_Response {
        /**
         * 副本ID，不用填，备用
         */
        m_uiPinstanceID: number;

        /**
         * 挑战类似，0是普通挑战，1是复仇
         */
        m_ucType: number;

        /**
         * 四象斗兽场被PK的玩家信息
         */
        m_stBeAttackRoleInfo: CanAttackList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrystalContainerChanged_Notify {
        /**
         * 容器类型
         */
        m_cContainerType: number;

        /**
         * 星魂该表列表
         */
        m_stChangedCrystalList: CrystalList;

        /**
         * 原因
         */
        m_ucReason: number;

        /**
         * 炼金师(猎魂)level 1 - 5
         */
        m_iAlchemistLevel: number;

        /**
         * 炼金师(召唤)level 4 - 5
         */
        m_iZhaoHuanLevel: number;

        /**
         * 裂魂经验
         */
        m_iLieHunValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrystalList {
        /**
         * 星魂数量
         */
        m_iNum: number;

        /**
         * 容器格子数量
         */
        m_astCrystal: Array<Crystal>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Crystal {
        /**
         * 星魂ID
         */
        m_iID: number;

        /**
         * 星魂位置
         */
        m_cPos: number;

        /**
         * 是否锁定
         */
        m_cIsLocked: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DayOperate_Request {
        /**
         * 对应 DOT_ 宏
         */
        m_uiType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DayOperate_Response {
        /**
         * 0成功，其它错误码
         */
        m_iResult: number;

        /**
         * 透传回去，对应 DOT_ 宏
         */
        m_uiType: number;

        /**
         * 操作后的状态
         */
        m_uiRecord: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DeleteRole_Account_Request {
        /**
         * 登陆态信息
         */
        m_stLianYunPlatInfo: LianYunPlatKeyInfo;

        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DeleteRole_Account_Response {
        
        m_uiResultID: number;

        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        m_szNickName: string;

        /**
         * 职业
         */
        m_cProfession: number;

        /**
         * 性别
         */
        m_cGender: number;

        /**
         * 等级
         */
        m_iLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DiBang_Request {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: DiBangRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DiBangRequestValue {
        /**
         * 地榜刷新冷却时间 不用赋值
         */
        m_ucRefreshTime: number;

        /**
         * 天榜刷新冷却时间 不用赋值
         */
        m_ucCrossRefreshTime: number;

        /**
         * 不用赋值，默认0
         */
        m_ucType: number;

        /**
         * 不用赋值，默认0
         */
        m_ucCrossType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DiBang_Response {
        /**
         * 请求操作协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: DiBangResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DiBangResponseValue {
        /**
         * 刷新冷却时间 0 失败 1 成功 
         */
        m_ucRefreshTimeResult: number;

        /**
         * 刷新冷却时间 0 失败 1 成功 
         */
        m_ucCrossRefreshTimeResult: number;

        /**
         * 地榜竞技本服数据
         */
        m_stDiBangLocalRsp: DiBangPVPInfo;

        /**
         * 地榜竞技跨服数据
         */
        m_stDiBangCrossRsp: DiBangPVPInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DiBangPVPInfo {
        /**
         * 冷却时间
         */
        m_iReFreshTime: number;

        /**
         * 个数
         */
        m_ucCount: number;

        /**
         * 地榜竞技数据
         */
        m_astDibangBossList: Array<DibangOneInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DibangOneInfo {
        /**
         * 进化次数
         */
        m_iLevelUpTimes: number;

        /**
         * 已击杀玩家数量
         */
        m_iKillRoleNum: number;

        /**
         * 最近被击杀玩家
         */
        m_szLastLoser: string;

        /**
         * 当前占领角色信息
         */
        m_stWinerInfo: RoleInfo;

        /**
         * 最近被击杀玩家战力
         */
        m_iLastLoserFightVal: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DigBoss_Notify {
        /**
         * BOSS ID
         */
        m_uiMonsterID: number;

        /**
         * 掉落方案ID
         */
        m_uiDropID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DigBoss_Request {
        /**
         * 要挖的BOSS ID，传不传都无所谓，预留
         */
        m_uiMonsterID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DigBoss_Response {
        /**
         * 0成功，其它错误码
         */
        m_iResult: number;

        /**
         * 挖到的道具个数
         */
        m_ucCount: number;

        /**
         * 道具信息
         */
        m_stItemList: Array<SimpleItemInfo>;

        /**
         * 已经挖过的次数
         */
        m_ucDigNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SimpleItemInfo {
        /**
         * 道具ID
         */
        m_iID: number;

        /**
         * 道具个数
         */
        m_iCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DoActivity_Request {
        /**
         * 进行活动的id
         */
        m_iID: number;

        /**
         * 操作码
         */
        m_ucCommand: number;

        /**
         * 活动参数
         */
        m_stParam: ActivityParam;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ActivityParam {
        
        m_szBuff: number;

        /**
         * 查询签到列表，置 0 就行
         */
        m_uiSign: number;

        /**
         * 签到请求,自动判断是不是补签
         */
        m_uiSignDay: number;

        /**
         * 领本月累计签到礼包，请求累计天数即可
         */
        m_uiPrizeDay: number;

        /**
         * 双倍领取,默认0，仅是当天的
         */
        m_uiSignDouble: number;

        /**
         * 温泉活动，动作操作请求协议
         */
        m_stBatheReq: BatheSkillOperateReq;

        /**
         * 温泉活动，查询各技能释放次数，置0即可
         */
        m_uiBatheList: number;

        /**
         * 国运活动，刷新类型，对应任务索引2-5
         */
        m_ucGuoYunRefreshTpye: number;

        /**
         * 国运活动，任务过程中的操作请求，护盾（1），呼救（2）
         */
        m_ucGuoYunOperateType: number;

        /**
         * 查询下一次刷新国运任务的信息，置0即可
         */
        m_uiGuoYunList: number;

        /**
         * 世界boss获取列表请求
         */
        m_stWorldBossReq: number;

        /**
         * 世界Boss打开箱子奖励 BOSSID
         */
        m_uiWorldBossReward: number;

        /**
         * 世界Boss设置关注 BOSSID
         */
        m_stBossAttentReq: BossAttentInfo;

        /**
         * 世界Boss设置提醒 是否
         */
        m_ucWorldBossAlert: number;

        /**
         * 世界Boss宗派召集 填BossID
         */
        m_uiBossGuildCall: number;

        /**
         * 开服签到活动领取礼包请求,此字段填领取第几天的礼包
         */
        m_ucOpenSvrSignGetDays: number;

        /**
         * 聚宝盆，打开活动面板，占位
         */
        m_ucJBPOpenPanel: number;

        /**
         * 聚宝盆，领取奖励，配置ID
         */
        m_uiJBPGetReward: number;

        /**
         * 星语心愿活动_打开板子，不传
         */
        m_iXingYuanOpenPanel: number;

        /**
         * 星语心愿活动_贡献,传贡献多少个，不够的自动扣元宝
         */
        m_stXingYuanContribute: XYContributeReq;

        /**
         * 星语心愿活动_拿礼包,拿第几个,传0-5
         */
        m_iXingYuanGetPrize: number;

        /**
         * 星语心愿活动_补拿经验，不传
         */
        m_iXingYuanGetExp: number;

        /**
         * 打开神魔遮天面板
         */
        m_ucSMZTOpenPannel: number;

        /**
         * 聚划算打开面板
         */
        m_ucJUHSOpenPannel: number;

        /**
         * 聚划算购买的配置ID, 若为0表示全部购买
         */
        m_ucJUHSBuyID: number;

        /**
         * 聚划算领取的配置ID
         */
        m_stJUHSAGetReq: JUHSAGetRewardReq;

        /**
         * 黑暗侵袭活动操作请求
         */
        m_stHAQXOperateReq: HeiAnQinXiPinOperateReq;

        /**
         * 黑暗侵袭信息查询,置0，占位
         */
        m_ucHAQXListReq: number;

        /**
         * 充值排行榜 金仙争夺
         */
        m_ucJXZDPannel: number;

        /**
         * 充值排行榜 金仙争夺
         */
        m_ucJXZDRewardGet: number;

        /**
         * 积善成礼，信息查询，占位
         */
        m_ucJSCLList: number;

        /**
         * 积善成礼，领取奖励，配置ID
         */
        m_uiJSCLGetReward: number;

        /**
         * 天地玄门 打开面板，占位
         */
        m_ucTDXMPannel: number;

        /**
         * 天地玄门 创建, 类型
         */
        m_ucTDXMCreate: number;

        /**
         * 天地玄门 开始，占位
         */
        m_ucTDXMStart: number;

        /**
         * 天地玄门 招募，占位
         */
        m_ucTDXMRecuit: number;

        /**
         * 天地玄门 加入, 队长ID
         */
        m_stTDXMJoin: RoleID;

        /**
         * 一本万利打开面板请求，占位
         */
        m_ucYBWLOpenPanel: number;

        /**
         * 一本万利购买请求
         */
        m_stYBWLBuyReq: YBWLBuyReq;

        /**
         * 一本万利礼包领取请求
         */
        m_stYBWLGetReq: YBWLGetRewardReq;

        /**
         * 幸运转盘 打开面板，占位
         */
        m_ucXYZPPannel: number;

        /**
         * 幸运转盘 抽奖 1 或者 10次
         */
        m_ucXYZPDraw: number;

        /**
         * 幸运转盘 领取奖励 参数50 200 500 1000
         */
        m_uiXYZPGetGift: number;

        /**
         * 幸运转盘 大奖记录
         */
        m_ucXYZPRecord : number;

        /**
         * 欢乐探宝 打开面板, 打开面板，占位
         */
        m_ucHLTBPannleReq: number;

        /**
         * 欢乐探宝 抽奖, 数据
         */
        m_stHLTBDrawReq: HLTBDrawReq;

        /**
         * 欢乐翻牌 打开面板，占位
         */
        m_ucHLFPList: number;

        /**
         * 欢乐翻牌 发牌，占位
         */
        m_ucHLFPDeal: number;

        /**
         * 欢乐翻牌 领奖，0:当前奖，1：消耗300元宝最高奖
         */
        m_ucHLFPGet: number;

        /**
         * 欢乐翻牌 换牌, 按位标识，0表示换牌，1表示保留
         */
        m_ucHLFPRefresh: number;

        /**
         * 同庆回归玩家，查询请求
         */
        m_ucRRChargeListReq: number;

        /**
         * 同庆回归玩家，领取充值礼包
         */
        m_ucRRChargeGetReq: number;

        /**
         * 节日充值  面板 占位
         */
        m_ucFestivalChargePanel: number;

        /**
         * 节日充值奖励  领取请求, 配置ID
         */
        m_ucFestivalChargeGet: number;

        /**
         * 节日消费  面板 占位
         */
        m_ucFestivalConsumePanel: number;

        /**
         * 节日消费奖励 领取请求 配置ID
         */
        m_uiFestivalConsumeGet: number;

        /**
         * 圣诞卡片兑换 面板 占位
         */
        m_ucFestivalBoxPanel: number;

        /**
         * 圣诞卡片  兑换 宝箱ID
         */
        m_uiFestivalBoxID: number;

        /**
         * 打开消费赠好礼面板
         */
        m_ucDailyConsumePanel: number;

        /**
         * 消费赠好礼领取奖励请求
         */
        m_ucDailyConsumeGet: number;

        /**
         * 打开消费排行榜面板请求，占位
         */
        m_ucConsumeRankPanel: number;

        /**
         * 领取消费排行奖励请求， 配置ID
         */
        m_uiConsumeRankGetReward: number;

        /**
         * 获取消费排行列表请求，占位
         */
        m_uiConsumeRankGetRankList: number;

        /**
         * 特卖大酬宾，查询请求，不用填，默认0
         */
        m_ucTMDCBListReq: number;

        /**
         * 特卖大酬宾，购买物品的序号
         */
        m_uiTMDCBBuyIndex: number;

        /**
         * 极品大兑换 兑换奖品 配置ID
         */
        m_uiJiPinDaDuiHuanID: number;

        /**
         * 打开充值兑换面板
         */
        m_ucRechargeExchangePanel: number;

        /**
         * 充值兑换奖励配置ID
         */
        m_uiRechargeExchangeID: number;

        /**
         * 充值送豪礼，查询请求，不用填，默认0
         */
        m_ucCZSHLListReq: number;

        /**
         * 充值送豪礼，领取奖励物品的序号
         */
        m_uiCZSHLGetIndex: number;

        /**
         * 进阶日打开面板系统类型 1 美人 2 坐骑 3 羽翼 4 精灵 5 武魂 6 法阵
         */
        m_ucJJRPanelType: number;

        /**
         * 进阶日领取奖励配置
         */
        m_stJJRRewardCfg: JJRGetRewardReq;

        /**
         * 打开限时折扣面板
         */
        m_ucDiscountPanel: number;

        /**
         * 限时折扣购买
         */
        m_stDiscountBuy: DiscountBuy;

        /**
         * 跨服鲜花榜，查男榜就是GENDERTYPE_BOY，女榜就是GENDERTYPE_GIRL
         */
        m_ucKFXHBListReq: number;

        /**
         * 跨服鲜花榜，领取达成礼包请求，领取的礼包id
         */
        m_ucKFXHBGetReq: number;

        /**
         * 封魔塔查询请求，不用填，默认0
         */
        m_ucFMTListReq: number;

        /**
         * 封魔塔宗派召集 填BossID
         */
        m_ucFMTGuildCallReq: number;

        /**
         * 铭文试炼 面板占位
         */
        m_ucHistoricalRemainsPanel: number;

        /**
         * 铭文试炼 投色子 占位
         */
        m_stThrowDice: ThrowTheDice;

        /**
         * 铭文试炼 走到指定位置 占位
         */
        m_ucGotoPos: number;

        /**
         * 购买魔力色子次数 占位
         */
        m_ucBuyMagicDiceTimes: number;

        /**
         * 铭文试炼 重置活动次数 占位
         */
        m_ucResetTimes: number;

        /**
         * 铭文试炼 一键完成副本
         */
        m_ucHROneKeyFinish: number;

        /**
         * 铭文试炼 领取通关奖励,第几层
         */
        m_ucHRGetStagePassGift: number;

        /**
         * 铭文试炼 解锁下一层，占位
         */
        m_ucHRActNextStage: number;

        /**
         * 打开红包面板 占位
         */
        m_ucOpenPanel: number;

        /**
         * 发红包
         */
        m_stSendRedBag: SendRedBagReq;

        /**
         * 抢红包(红包ID)
         */
        m_iRedBagId: number;

        /**
         * 查看红包(红包ID)
         */
        m_iSeeRedBagId: number;

        /**
         * 红包手气榜  占位
         */
        m_ucRedBagRank: number;

        /**
         * 宗派封魔宗派召集 占位
         */
        m_ucZPFMGuildCallReq: number;

        /**
         * 打开庆典消费面板请求，占位
         */
        m_ucQingDianConsumePanel: number;

        /**
         * 每日首充送大礼  面板 占位
         */
        m_ucDailyFirstRechargePanel: number;

        /**
         * 每日首充送大礼  领取请求
         */
        m_ucDailyFirstRechargeGet: number;

        /**
         * rmb战场活动，查询 占位
         */
        m_ucRMBZCList: number;

        /**
         * rmb战场活动，参加 占位
         */
        m_ucRMBZCJoin: number;

        /**
         * rmb战场活动，取消匹配
         */
        m_ucRMBZCCancel: number;

        /**
         * 打开至尊争夺面板请求，占位
         */
        m_ucZZZDChargePanel: number;

        /**
         * 跨服boss获取列表请求
         */
        m_stCrossBossReq: number;

        /**
         * 跨服Boss挖宝，BOSSID
         */
        m_uiCrossBossReward: number;

        /**
         * 打开图腾祝福面板请求，占位
         */
        m_ucTTZFPanel: number;

        /**
         * 图腾祝福请求，0道具祝福，大于0是元宝祝福倍数
         */
        m_ucTTZFWish: number;

        /**
         * 领取图腾祝福奖励请求，配置id
         */
        m_ucTTZFGetReward: number;

        /**
         * rmb战场活动，购买次数,占位
         */
        m_ucRMBZCBuyTime: number;

        /**
         * 跨服点灯-打开点灯面板，占位
         */
        m_ucDDLPanel: number;

        /**
         * 跨服点灯-刷新列表，占位
         */
        m_ucFreshList: number;

        /**
         * 跨服点灯-点灯，(0一键点灯，不是0则下标索引)
         */
        m_uiIndexId: number;

        /**
         * 跨服点灯-打开跨服排行面板,占位
         */
        m_ucDDLRankPanel: number;

        /**
         * 跨服点灯-领取参与奖励,占位
         */
        m_ucDDLGetReward: number;

        /**
         * 打开庆典抽奖面板， 占位
         */
        m_ucBFQDDrawPanel: number;

        /**
         * 抽奖, 次数
         */
        m_ucBFQDDraw: number;

        /**
         * 打开庆典登录奖励面板，占位
         */
        m_ucBFQDLoginPanel: number;

        /**
         * 领取庆典登录奖励，占位
         */
        m_ucBFQDLoginReward: number;

        /**
         * 打开庆典充值奖励面板，占位
         */
        m_ucBFQDChargePanel: number;

        /**
         * 领取庆典充值奖励，第几档次
         */
        m_ucBFQDChargeReward: number;

        /**
         * 打开跨服消费排行榜, 占位
         */
        m_ucBFQDConsumeRank: number;

        /**
         * 打开端午活动面板请求，占位
         */
        m_ucDuanWuPanel: number;

        /**
         * 兑换端午粽子,兑换次数
         */
        m_ucDuanWuExchange: number;

        /**
         * 领取端午兑换达成奖励,配置id
         */
        m_ucDuanWuGetBit: number;

        /**
         * 充值特惠  面板 占位
         */
        m_ucPreferChargePanel: number;

        /**
         * 充值特惠奖励  领取请求
         */
        m_stPreferChargeGet: PreferChargeReq;

        /**
         * 打开跨服云购活动面板请求，占位
         */
        m_ucCrossYunGouPanel: number;

        /**
         * 跨服云购
         */
        m_stCrossYunGouBuy: CrossYunGouBuyReq;

        /**
         * 打开九转星宫面板,占位
         */
        m_ucJZXGOpen: number;

        /**
         * 购买九转星宫奖励倍率
         */
        m_ucJZXGBuy: number;

        /**
         * 打开老虎机面板,占位
         */
        m_ucLHJOpen: number;

        /**
         * 转动老虎机，转几次
         */
        m_ucLHJTurn: number;

        /**
         * 中元节充值返利 打开面板
         */
        m_ucZYJ_CZFLPanelReq: number;

        /**
         * 中元节充值返利 领取请求
         */
        m_ucZYJ_CZFLGetReq: number;

        /**
         * 充值红包 打开面板，占位
         */
        m_ucChargeRedBagPanelReq: number;

        /**
         * 充值红包 领取请求,占位
         */
        m_ucChargeRedBagGetReq: number;

        /**
         * 打开欢乐转盘面板,占位
         */
        m_ucHLZPOpen: number;

        /**
         * 转动欢乐转盘，转几次
         */
        m_ucHLZPDraw: number;

        /**
         * 步步高升，打开活动面板，占位
         */
        m_ucBBGSOpenPanel: number;

        /**
         * 步步高升，领取奖励，配置ID
         */
        m_uiBBGSGetReward: number;

        /**
         * 领取端午登录奖励，占位
         */
        m_ucDWLoginReward: number;

        /**
         * 跨服3v3，打开活动面板，占位
         */
        m_ucCross3V3OpenPanel: number;

        /**
         * 跨服3v3，领取奖励，占位
         */
        m_ucCross3V3GetReward: number;

        /**
         * 四象斗兽场-领取昨日段位奖励，占位
         */
        m_ucColosseumGetReward: number;

        /**
         * 四象斗兽场-购买挑战次数，占位
         */
        m_ucColosseumBuyTime: number;

        /**
         * 四象斗兽场-清空等待CD，占位
         */
        m_ucColosseumClearTime: number;

        /**
         * 四象斗兽场-上阵四象
         */
        m_stColosseumOnBattle: ColosseumOnBattleReq;

        /**
         * 四象斗兽场-获取段位达成奖励，奖励ID
         */
        m_uiColosseumGetGradeReward: number;

        /**
         * 四象斗兽场-打开面板，占位
         */
        m_ucColosseumOpen: number;

        /**
         * BOSS之家 打开面板
         */
        m_ucHomeBossPanel: number;

        /**
         * BOSS之家 增加时间
         */
        m_iHomeBossAddTimeID: number;

        /**
         * 全民嗨点面板 占位
         */
        m_ucQMHDPanel: number;

        /**
         * 全民嗨点面板 领奖
         */
        m_uiQMHDGetReward: number;

        /**
         * 世界杯 面板,占位
         */
        m_iWCupPanel: number;

        /**
         * 世界杯 投注胜负
         */
        m_stWCupBetWin: WCupBetWinReq;

        /**
         * 世界杯 投注比分
         */
        m_stWCupBetScore: WCupBetScoreReq;

        /**
         * 世界杯 查看排行,占位
         */
        m_iWCupRank: number;

        /**
         * 世界杯冠军之路 竞猜队伍
         */
        m_stWCupChampionGuess: WCupChampionGuessReq;

        /**
         * 跨服年兽 打开面板
         */
        m_ucKFNSPanel: number;

        /**
         * 春节登录，活动面板，占位
         */
        m_ucSpringLoginPanel: number;

        /**
         * 春节登录，领取奖励，配置Type，ID
         */
        m_uiSpringLoginGetReward: SpringGetRewardReq;

        /**
         * 春节充值，活动面板，占位
         */
        m_ucSpringChargePanel: number;

        /**
         * 春节充值，领取奖励，配置Type，ID
         */
        m_uiSpringChargeGetReward: SpringGetRewardReq;

        /**
         * 开始兑换奖励，配置ID
         */
        m_ucSJDHStart: number;

        /**
         * 连续返利 打开面板
         */
        m_ucLXFLPanel: number;

        /**
         * 连续返利 领取奖励
         */
        m_stLXFLGetReq: LXFLGetReq;

        /**
         * 收集兑换 定制提醒,按位
         */
        m_uiSJDHWarn: number;

        /**
         * 盛典宝箱面板 占位
         */
        m_ucSDBXOpenPanel: number;

        /**
         * 盛典宝箱 领奖
         */
        m_uiSDBXGetReward: number;

        /**
         * 欢聚小年充值折扣，打开活动面板，占位
         */
        m_ucHJXNChargePanel: number;

        /**
         * 欢聚小年充值折扣 领奖 ，占位
         */
        m_ucHJXNChargeReward: number;

        /**
         * 限时秒杀面板 占位
         */
        m_ucRushPurchasePanel: number;

        /**
         * 限时秒杀面板 购买
         */
        m_uiRushPurchaseID: number;

        /**
         * 落日森林打开面板 占位
         */
        m_ucForestBossPanel: number;

        /**
         * 打开面板
         */
        m_iAct124Pannel: number;

        /**
         * 领取奖励 配置ID
         */
        m_iAct124Reward: number;

        /**
         * 打开面板
         */
        m_iAct125Pannel: number;

        /**
         * 领取奖励 配置ID
         */
        m_iAct125Reward: number;

        /**
         * 打开面板
         */
        m_ucAct63Panel: number;

        /**
         * 刷新
         */
        m_ucAct63Refresh: number;

        /**
         * 打开面板
         */
        m_ucAct126Panel: number;

        /**
         * 领取参与奖励
         */
        m_ucAct126GetReward: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BatheSkillOperateReq {
        /**
         * 技能操作类型 泼水、抹肥皂、搓背 [1-3]
         */
        m_ucOperatTpye: number;

        /**
         * 接受技能玩家id
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BossAttentInfo {
        /**
         * BossID
         */
        m_uiBossID: number;

        /**
         * 是否关注
         */
        m_ucAttent: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XYContributeReq {
        /**
         * 0道具，1元宝
         */
        m_ucType: number;

        /**
         * 个数
         */
        m_uiParam: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JUHSAGetRewardReq {
        /**
         * 配置id
         */
        m_ucJUHSGetID: number;

        /**
         * 领取第几天的礼包，从1开始
         */
        m_ucDay: number;

        /**
         * 领取奖励的类型，JUHS_GET_TYPE_NORMAL，JUHS_GET_TYPE_ONLINE，JUHS_GET_TYPE_VIP
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeiAnQinXiPinOperateReq {
        /**
         * 请求操作的类型，1:雷,2:激励
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class YBWLBuyReq {
        /**
         * 购买的价钱
         */
        m_uiValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class YBWLGetRewardReq {
        /**
         * 领取第几天的礼包，从1开始
         */
        m_ucDay: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HLTBDrawReq {
        /**
         * 奖项类型 1福地HLTB_TYPE_FUDI  2仙境HLTB_TYPE_XIANJING  3飞升HLTB_TYPE_FEISHENG
         */
        m_ucType: number;

        /**
         * 抽奖次数    1  10
         */
        m_ucCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JJRGetRewardReq {
        /**
         * 子系统类型，1 美人 2 坐骑 3 羽翼 4 精灵 5 武魂 6 法阵
         */
        m_ucMainType: number;

        /**
         * 奖励配置ID
         */
        m_uiRewardCfgID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DiscountBuy {
        /**
         * 物品种类
         */
        m_ucCount: number;

        /**
         * 物品种类
         */
        m_stBuyList: Array<DiscountItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DiscountItem {
        /**
         * 物品ID
         */
        m_uiItemID: number;

        /**
         * 物品数量
         */
        m_uiItemNum: number;

        /**
         * 唯一ID
         */
        m_uiID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ThrowTheDice {
        /**
         * 色子类型 1 普通色子 2魔力色子
         */
        m_ucType: number;

        /**
         * 点数
         */
        m_ucNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SendRedBagReq {
        /**
         * 红包类型
         */
        m_ucRedBagType: number;

        /**
         * 红包档次
         */
        m_ucRedBagLv: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PreferChargeReq {
        /**
         * 领取类型,1每日奖励PREFER_CHARGE_TYPE_DAY，2达成奖励PREFER_CHARGE_TYPE_GET
         */
        m_ucType: number;

        /**
         * 领取配置ID
         */
        m_uiID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrossYunGouBuyReq {
        /**
         * 购买类型,即数量CROSS_YUNGOU_BUYT_TYPE1，CROSS_YUNGOU_BUYT_TYPE2
         */
        m_ucType: number;

        /**
         * 购买配置ID
         */
        m_uiID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ColosseumOnBattleReq {
        /**
         * 上阵四象神兽个数
         */
        m_ucSSCout: number;

        /**
         * 上阵四象神兽列表
         */
        m_astBattleSSList: Array<CSBattleSSList>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSBattleSSList {
        /**
         * 四象类型
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WCupBetWinReq {
        /**
         * 投注数量
         */
        m_iBetNum: number;

        /**
         * 比赛id
         */
        m_iID: number;

        /**
         * 胜负类型，世界杯_胜/世界杯_负/世界杯_平
         */
        m_iType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WCupBetScoreReq {
        /**
         * 比赛id
         */
        m_iID: number;

        /**
         * 比分 数量
         */
        m_ucScoreNum: number;

        /**
         * 比分投注，下标为 比分id 0-25，值是投注数量
         */
        m_aiBetNum: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WCupChampionGuessReq {
        /**
         * 场次ID
         */
        m_iID: number;

        /**
         * 竞猜队伍ID
         */
        m_iTeamID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SpringGetRewardReq {
        /**
         * 奖励类型
         */
        m_ucType: number;

        /**
         * 奖励ID
         */
        m_uiCfgID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LXFLGetReq {
        /**
         * LXFL_TYPE_ACC LXFL_TYPE_DAY
         */
        m_ucType: number;

        /**
         * 奖励ID
         */
        m_ucGetID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DoActivity_Response {
        /**
         * 进行活动的id
         */
        m_iID: number;

        /**
         * 操作码
         */
        m_ucCommand: number;

        /**
         * 操作结果
         */
        m_ushResult: number;

        /**
         * 结果数据
         */
        m_unResultData: DoActivityResult;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DoActivityResult {
        /**
         * 显示在线礼包
         */
        m_stOnlineGiftShowResponse: OnlineGiftActivityData;

        /**
         * 获取在线礼包
         */
        m_stOnlineGiftGetResponse: OnlineGiftActivityData;

        /**
         * 签到，按位存储
         */
        m_stSignQry: SignData;

        /**
         * 签到结果及获得道具ID
         */
        m_stSignDay: SignDataThing;

        /**
         * 返回签到结果及获得道具ID
         */
        m_stSignPrize: SignDataThing;

        /**
         * 返回双倍领取及获得道具ID
         */
        m_stSignDouble: SignDataThing;

        /**
         * 温泉活动响应
         */
        m_stBatheRsp: BatheSkillOperateRsp;

        /**
         * 世界boss获取列表响应
         */
        m_stWorldBossRsp: WorldBossListRsp;

        /**
         * 世界Boss打开箱子奖励
         */
        m_stWorldBossRewardRsp: WorldBossRewardRsp;

        /**
         * 世界Boss设置关注
         */
        m_stWorldBossAttentRsp: BossAttentInfo;

        /**
         * 世界设置提醒
         */
        m_ucWorldBossAlertRsp: number;

        /**
         * 世界Boss宗派召集 填BossID
         */
        m_uiBossGuildCallRsp: number;

        /**
         * 世界Boss刷新提醒 填BossID
         */
        m_uiWorldBossReFresh: number;

        /**
         * 温泉活动，各技能释放次数查询响应
         */
        m_stBatheListRsp: DBBatheData;

        /**
         * 国运活动，刷新后新的任务id
         */
        m_stGuoYunRefreshRsp: GuoYunRefreshRsp;

        /**
         * 国运活动，任务过程中的操作请求响应，操作的类型
         */
        m_ucGuoYunOperateRsp: number;

        /**
         * 国运活动，各信息查询响应
         */
        m_stGuoYunListRsp: DBGuoYunData;

        /**
         * 查询收藏礼包查询响应
         */
        m_stDesktopCollectionListRsp: DesktopCollectionData;

        /**
         * 领取收藏礼包查询响应
         */
        m_stDesktopCollectionGetRsp: DesktopCollectionData;

        /**
         * 开服签到活动领取礼包响应
         */
        m_stOpenSvrSignGetRsp: OpenSvrSignGetRsp;

        /**
         * 开服签到活动领取礼包查询响应
         */
        m_stOpenSvrSignListRsp: OpenSvrSignListRsp;

        /**
         * 聚宝盆，打开活动面板，占位
         */
        m_stJBPOpenPanel: JBPOpenPanelInfo;

        /**
         * 聚宝盆，领取奖励，配置ID
         */
        m_stJBPGetReward: JBPGetRewardInfo;

        /**
         * 星语心愿活动_打开板子
         */
        m_stXingYuanOpenPanel: XingYuanDataCli;

        /**
         * 星语心愿活动_贡献
         */
        m_stXingYuanContribute: XingYuanDataCli;

        /**
         * 星语心愿活动_拿礼包
         */
        m_stXingYuanGetPrize: XingYuanDataCli;

        /**
         * 星语心愿活动_补拿经验
         */
        m_stXingYuanGetExp: XingYuanDataCli;

        /**
         * 打开神魔遮天面板
         */
        m_stSMZTOpenPannel: SMZTOpenPannelRes;

        /**
         * 聚划算打开面板响应
         */
        m_stJUHSOpenPannel: JUHSOpenPannelRsp;

        /**
         * 聚划算购买的配置ID, 若为0表示全部购买
         */
        m_stJUHSBuyRsp: JUHSBuyRsp;

        /**
         * 聚划算领取的配置ID
         */
        m_stJUHSGetRsp: JUHSGetRep;

        /**
         * 黑暗侵袭活动操作
         */
        m_stHAQXOperateRsp: HeiAnQinXiPinOperateRsp;

        /**
         * 黑暗侵袭信息落雷使用的剩余cd时长 0-60
         */
        m_ucHAQXRaylCDTime: number;

        /**
         * 充值排行榜 金仙争夺
         */
        m_stJXZDPannel: CZActOpenPannel;

        /**
         * 充值排行榜 金仙争夺 参与奖
         */
        m_ucJXZDGetRsp: number;

        /**
         * 积善成礼，信息查询 响应
         */
        m_stJSCLListInfoRsp: JSCLListInfoRsp;

        /**
         * 积善成礼，领取奖励 响应
         */
        m_stJSCLGetRewardInfoRsp: JSCLGetRewardInfoRsp;

        /**
         * 天地玄门 打开面板，数据
         */
        m_stTDXMPannel: TDXMActInfo;

        /**
         * 天地玄门 创建, 数据
         */
        m_stTDXMCreate: TDXMActInfo;

        /**
         * 天地玄门 开始，数据
         */
        m_stTDXMStart: TDXMActInfo;

        /**
         * 天地玄门 加入, 数据
         */
        m_stTDXMJoin: TDXMActInfo;

        /**
         * 一本万利打开面板响应
         */
        m_stYBWLOpenPanel: YBWLRsp;

        /**
         * 一本万利购买响应
         */
        m_stYBWLBuyRsp: YBWLRsp;

        /**
         * 一本万利获取礼包响应
         */
        m_stYBWLGetRsp: YBWLRsp;

        /**
         * 幸运转盘 打开面板, 数据
         */
        m_stXYZPPannel: XYZPpannelRsp;

        /**
         * 幸运转盘 抽奖，数据
         */
        m_stXYZPDraw: XYZPDrawRsp;

        /**
         * 幸运转盘 领取奖励
         */
        m_stXYZPGetGiftRsp: XYZPGetGiftRsp;

        /**
         * 幸运转盘 大奖记录
         */
        m_stXYZPRecordRsp: XYZPRecordRsp;

        /**
         * 欢乐探宝 打开面板, 数据
         */
        m_stHLTBPannleRsp: HLTBPannleRsp;

        /**
         * 欢乐探宝 抽奖, 数据
         */
        m_stHLTBDrawRsp: HLTBDrawRsp;

        /**
         * 欢乐翻牌 打开面板响应
         */
        m_stHLFPListRsp: HLFPListRsp;

        /**
         * 欢乐翻牌 发牌响应
         */
        m_stHLFPDealRsp: HLFPDealRsp;

        /**
         * 欢乐翻牌 换牌响应
         */
        m_stHLFPRefreshRsp: HLFPRefreshRsp;

        /**
         * 欢乐翻牌 领奖响应 ，0:当前奖，1：消耗300元宝最高奖
         */
        m_ucHLFPGet: number;

        /**
         * 同庆回归玩家，查询请求响应，礼包状态，0:不可领取，1:待领取，2:已领取
         */
        m_ucRRChargeStatus: number;

        /**
         * 同庆回归玩家，领取充值礼包，默认0,不用赋值
         */
        m_ucRRChargeGetRsp: number;

        /**
         * 节日充值  打开面板响应
         */
        m_stFestivalChargePanel: FestivalChargeRsp;

        /**
         * 节日充值  领取奖励响应 0领取成功
         */
        m_stFestivalChargeGet: FestivalChargeRsp;

        /**
         * 节日消费  打开面板响应
         */
        m_stFestivalConsumePanel: FestivalConsumeRsp;

        /**
         * 节日消费  领取奖励响应 0领取成功
         */
        m_stFestivalConsumeGet: FestivalConsumeRsp;

        /**
         * 圣诞卡片兑换 打开面板响应
         */
        m_stFestivalGetBoxPanel: FestivalGetBoxPanel;

        /**
         * 圣诞卡片  兑换 0兑换成功
         */
        m_ucFestivalGetBoxRsp: number;

        /**
         * 打开消费赠好礼面板响应
         */
        m_sDailyConsumePanel: DailyConsumeRsp;

        /**
         * 消费赠好礼领取奖励响应 0领取成功
         */
        m_ucDailyConsumeGet: number;

        /**
         * 打开消费排行榜面板响应
         */
        m_stConsumeRankPanel: ConsumeRankInfoRsp;

        /**
         * 领取消费排行奖励响应 0领取成功
         */
        m_ucConsumeRankGetReward: number;

        /**
         * 获取消费排行榜列表响应
         */
        m_stConsumeRankList: ConsumeRankListRsp;

        /**
         * 特卖大酬宾，查询响应，物品购买信息
         */
        m_stTMDCBListRsp: TMDCBListRsp;

        /**
         * 特卖大酬宾，购买物品响应
         */
        m_stTMDCBBuyRsp: TMDCBBuyRsp;

        /**
         * 充值送豪礼，查询响应，物品领取信息
         */
        m_stCZSHLListRsp: CZSHLListRsp;

        /**
         * 充值送豪礼，领取奖励响应
         */
        m_stCZSHLGetRsp: CZSHLGetRsp;

        /**
         * 打开充值兑换面板响应
         */
        m_stRechargeExchangePanel: RechargeExchangeRsp;

        /**
         * 兑换充值奖励响应
         */
        m_ucRechargeExchangeGet: RechargeExchangeGetRsp;

        /**
         * 系统进阶日，查询响应，物品领取信息
         */
        m_stJJROpenPanelRsp: JJRSubSystemInfo;

        /**
         * 系统进阶日，领取奖励响应
         */
        m_stJJRGetRewardRsp: JJRGetRewardRsp;

        /**
         * 打开限时折扣面板
         */
        m_stDiscountPanel: DiscountPanel;

        /**
         * 限时折扣购买
         */
        m_ucDiscountBuyRsp: number;

        /**
         * 跨服鲜花榜，查询响应
         */
        m_stKFXHBRsp: KFXHBInfoList;

        /**
         * 跨服鲜花榜，领取奖励响应,按位存储，0未领取，1已领取
         */
        m_uiKFXHBGetRsp: number;

        /**
         * 封魔塔查询响应
         */
        m_stFMTListRsp: CSFMTListRsp;

        /**
         * 封魔塔宗派召集 填BossID
         */
        m_uiFMTGuildCallRsp: number;

        /**
         * 铭文试炼 打开面板回复
         */
        m_stHistoricalRemainsPanel: HistoricalRemainsPanelRsp;

        /**
         * 铭文试炼 投色子 回复
         */
        m_stThrowDiceRsp: ThrowDiceRsp;

        /**
         * 铭文试炼 走到指定位置 回复
         */
        m_stGotoPosRsp: GotoPosRsp;

        /**
         * 购买魔力色子次数 回复
         */
        m_stBuyMagicDiceTimesRsp: BuyMagicDiceTimesRsp;

        /**
         * 铭文试炼 重置活动次数 回复
         */
        m_ucResetTimes: number;

        /**
         * 铭文试炼 一键完成副本回复
         */
        m_ucHROneKeyFinish: number;

        /**
         * 铭文试炼 已领取通关奖励,按位存
         */
        m_ucHRGetStagePassGiftRsp: number;

        /**
         * 铭文试炼解锁 面板的数据
         */
        m_stHRActNextStageRsp: HistoricalRemainsPanelRsp;

        /**
         * 打开红包面板 回复
         */
        m_stOpenRedBagResp: OpenRedBagResp;

        /**
         * 发送红包 回复
         */
        m_stSendRedBagResp: SendRedBagResp;

        /**
         * 抢红包 回复
         */
        m_stGrabRedBagResp: GrabRedBagResp;

        /**
         * 查看红包 回复
         */
        m_stSeeRedBagInfoResp: SeeRedBagInfoResp;

        /**
         * 加载红包手气榜 回复
         */
        m_stRedBagRankResp: RedBagRankResp;

        /**
         * 打开庆典消费面板响应
         */
        m_sQingDianConsumePanel: QingDianConsumeRsp;

        /**
         * 每日首充送大礼  打开面板响应
         */
        m_stDailyFirstRechargePanel: DailyFirstRechargeRsp;

        /**
         * 每日首充送大礼  领取奖励响应
         */
        m_ucDailyFirstRechargeGet: number;

        /**
         * rmb战场活动，查询响应
         */
        m_stRMBZCListRsp: RMBZCInfoRsp;

        /**
         * rmb战场活动，查询响应
         */
        m_stRMBZCJoinRsp: RMBZCInfoRsp;

        /**
         * rmb战场活动，查询响应
         */
        m_stRMBZCCancelRsp: RMBZCInfoRsp;

        /**
         * 打开至尊争夺面板响应
         */
        m_stZZZDChargePanelRsp: ZZZDOpenPanelRsp;

        /**
         * 跨服boss获取列表响应
         */
        m_stCrossBossRsp: SMZTOpenPannelRes;

        /**
         * 跨服Boss挖宝
         */
        m_stCrossBossRewardRsp: CrossBossRewardRsp;

        /**
         * 打开图腾祝福面板响应
         */
        m_stTTZFPanelRsp: TTZFOpenPanelRsp;

        /**
         * 执行图腾祝福响应
         */
        m_stTTZFWishRsp: TTZFOpenPanelRsp;

        /**
         * 图腾祝福领取奖励响应
         */
        m_stTTZFGetRewardRsp: TTZFOpenPanelRsp;

        /**
         * rmb战场活动，购买次数响应
         */
        m_stRMBZCBuyTimeRsp: RMBZCInfoRsp;

        /**
         * 打开点灯面板响应
         */
        m_stDDLPanelRsp: DDLOpenPanelRsp;

        /**
         * 刷新列表响应
         */
        m_stDDLFreshRsp: DDLFreshRsp;

        /**
         * 点灯响应
         */
        m_stDDLLightRsp: DDLOnLightRsp;

        /**
         * 点灯跨服排行榜响应
         */
        m_stDDLRankPanelRsp: DDLOpenRankPanelRsp;

        /**
         * 领取参与奖励
         */
        m_ucDDLRewardRsp: number;

        /**
         * 打开庆典抽奖面板响应
         */
        m_stBFQDDrawPanelRsp: BFQDDrawPanelRsp;

        /**
         * 抽奖响应
         */
        m_stBFQDDrawRsp: BFQDDrawRsp;

        /**
         * 打开庆典登录奖励面板响应
         */
        m_ucBFQDLoginPanelRsp: number;

        /**
         * 领取庆典登录奖励响应
         */
        m_ucBFQDLoginRewardRsp: number;

        /**
         * 打开庆典充值奖励面板响应
         */
        m_stBFQDChargePanelRsp: BFQDChargePanelRsp;

        /**
         * 领取庆典充值奖励响应
         */
        m_stBFQDChargeRewardRsp: BFQDChargePanelRsp;

        /**
         * 打开跨服消费排行榜响应
         */
        m_stBFQDConsumeRankRsp: BFQDConsumeRankPanelRsp;

        /**
         * 打开端午活动面板响应
         */
        m_stDuanWuPanelRsp: DuanWuPanelRsp;

        /**
         * 兑换端午粽子响应
         */
        m_stDuanWuExchangeRsp: DuanWuPanelRsp;

        /**
         * 领取端午兑换达成奖励响应 0领取成功
         */
        m_stDWReachGetRsp: DuanWuPanelRsp;

        /**
         * 充值特惠  打开面板响应
         */
        m_stPreferChargePanel: PreferChargeRsp;

        /**
         * 充值特惠  领取奖励响应
         */
        m_stPreferChargeGet: PreferChargeRsp;

        /**
         * 跨服云购  打开面板响应
         */
        m_stCrossYunGouPanel: CrossYunGouRsp;

        /**
         * 跨服云购  购买响应
         */
        m_stCrossYunGouBuy: CrossYunGouRsp;

        /**
         * 九转星宫 打开面板响应
         */
        m_stJZXGOpen: JZXGPanelRsp;

        /**
         * 九转星宫 打开面板响应
         */
        m_stJZXGBuy: JZXGPanelRsp;

        /**
         * 老虎机 打开面板响应
         */
        m_stLHJOpenRsp: LHJpannelRsp;

        /**
         * 老虎机 转动响应
         */
        m_stLHJTrunRsp: LHJDrawRsp;

        /**
         * 老虎机 全服记录响应
         */
        m_stLHJRecordRsp: LHJRecordRsp;

        /**
         * 中元节充值返利  打开面板响应
         */
        m_stZYJ_CZFLPanelRsp: ZYJCZFLDataRsp;

        /**
         * 中元节充值返利  领取奖励响应
         */
        m_stZYJ_CZFLGetRsp: ZYJCZFLDataRsp;

        /**
         * 充值红包 打开面板响应
         */
        m_stCharge_RedBagPanelRsp: ChargeRedBagDataRsp;

        /**
         * 充值红包  领取奖励响应
         */
        m_stCharge_RedBagGetRsp: ChargeRedBagDataRsp;

        /**
         * 欢乐转盘 打开面板响应
         */
        m_stHLZPOpenRsp: HLZPPannelRsp;

        /**
         * 欢乐转盘 转动响应
         */
        m_stHLZPTrunRsp: HLZPDrawRsp;

        /**
         * 欢乐转盘 大奖记录
         */
        m_stHLZPRecordRsp: HLZPRecordRsp;

        /**
         * 步步高升，打开活动面板响应
         */
        m_stBBGSOpenPanel: BBGSInfoRsp;

        /**
         * 步步高升，领取奖励响应
         */
        m_stBBGSGetReward: BBGSInfoRsp;

        /**
         * 领取端午登录奖励响应
         */
        m_ucDWLoginRewardRsp: number;

        /**
         * 打开跨服3V3面板响应
         */
        m_stCROSS3V3ListRsp: Cross3V3ListRsp;

        /**
         * 领取跨服3V3奖励响应
         */
        m_stCROSS3V3GetRewardRsp: Cross3V3ListRsp;

        /**
         * 四象斗兽场-领取昨日段位奖励
         */
        m_stColosseumGetRewardRsp: ColosseumActRsp;

        /**
         * 四象斗兽场-购买挑战次数
         */
        m_stColosseumBuyTimeRsp: ColosseumActRsp;

        /**
         * 四象斗兽场-清空等待CD
         */
        m_stColosseumClearTimeRsp: ColosseumActRsp;

        /**
         * 四象斗兽场-上阵四象神兽
         */
        m_stColosseumOnBattleRsp: ColosseumActRsp;

        /**
         * 四象斗兽场-获取段位达成奖励
         */
        m_stColosseumGetGradeRewardRsp: ColosseumActRsp;

        /**
         * 四象斗兽场-打开面板响应
         */
        m_stColosseumOpenRsp: ColosseumActRsp;

        /**
         * BOSS之家打开面板 BOSS列表
         */
        m_stHomeBossActOpenRsp: HomeBossActOpenRsp;

        /**
         * BOSS之家增加时间
         */
        m_stHomeBossActAddTimeRsp: HomeBossActOpenRsp;

        /**
         * 世界杯 面板
         */
        m_stWCupPanelRsp: WCupPanelRsp;

        /**
         * 世界杯 投注胜负
         */
        m_stWCupBetWinRsp: WCupPanelRsp;

        /**
         * 世界杯 投注比分
         */
        m_stWCupBetScoreRsp: WCupPanelRsp;

        /**
         * 世界杯 查看排行
         */
        m_stWCupRankRsp: WCupRankRsp;

        /**
         * 全民嗨点 面板
         */
        m_stQMHDPanelRsp: QMHDActPanelRsp;

        /**
         * 全民嗨点 领奖
         */
        m_uiQMHDRewardRsp: number;

        /**
         * 世界杯冠军之路 面板
         */
        m_stWCupChampionPanelRsp: WCupChampionPanelRsp;

        /**
         * 世界杯冠军之路 竞猜
         */
        m_stWCupChampionGuess: WCupChampionPanelRsp;

        /**
         * 世界杯冠军之路 领取竞猜奖励
         */
        m_stWCupChampionGet: WCupChampionPanelRsp;

        /**
         * 跨服年兽 打开面板 0boss死亡 1boss存活
         */
        m_stKFNSActOpenRsp: KFNSActOpenRsp;

        /**
         * 春节登录-打开面板响应
         */
        m_stSpringLoginPannelRsp: SpringLoginActRsp;

        /**
         * 春节登录-领取奖励响应
         */
        m_stSpringLoginRewardRsp: SpringLoginActRsp;

        /**
         * 春节充值-打开面板响应
         */
        m_stSpringChargePannelRsp: SpringChargeActRsp;

        /**
         * 春节充值-领取奖励响应
         */
        m_stSpringChargeRewardRsp: SpringChargeActRsp;

        /**
         * 收集兑换 打开面板
         */
        m_stSJDHActPannelRsp: SJDHActRsp;

        /**
         * 收集兑换 开始兑换
         */
        m_stSJDHActStartRsp: SJDHActRsp;

        /**
         * 连续返利 打开面板
         */
        m_stLXFLPanelRsp: CSLXFLInfo;

        /**
         * 连续返利 领取奖励
         */
        m_stLXFLGetRsp: CSLXFLInfo;

        /**
         * 收集兑换 定制提醒
         */
        m_uiSJDHActWarnRsp: number;

        /**
         * 盛典宝箱 面板
         */
        m_stSDBXPanelRsp: SDBXActPanelRsp;

        /**
         * 盛典宝箱 领奖
         */
        m_uiSDBXRewardRsp: number;

        /**
         * 欢聚小年充值折扣-打开面板响应
         */
        m_stHJXNChargePannelRsp: HJXNChargeActRsp;

        /**
         * 欢聚小年充值折扣-领取奖励响应
         */
        m_stHJXNChargeRewardRsp: HJXNChargeActRsp;

        /**
         * 限时秒杀面板
         */
        m_stRushPurchasePanel: RushPurchasePanel;

        /**
         * 限时秒杀面板 购买
         */
        m_stRushPurchaseRsp: RushPurchaseBuyRsp;

        /**
         * 落日森林打开面板
         */
        m_stForestBossActOpenRsp: ForestBossActOpenRsp;

        /**
         * 打开面板
         */
        m_stAct124Pannel: CSAct124Info;

        /**
         * 领取奖励 配置ID
         */
        m_stAct124Reward: CSAct124Info;

        /**
         * 打开面板
         */
        m_stAct125Pannel: CSAct125Info;

        /**
         * 领取奖励 配置ID
         */
        m_stAct125Reward: CSAct125Info;

        /**
         * 打开面板回复
         */
        m_stAct63Panel: CSAct63Panel;

        /**
         * 刷新回复
         */
        m_stAct63RefreshRsp: CSAct63Panel;

        /**
         * 打开面板回复
         */
        m_stAct126Panel: CSAct126Panel;

        /**
         * 领取奖励回复
         */
        m_ucAct126GetRewardRsp: number;

        /**
         * 可领奖励通知
         */
        m_ucAct126RewardNotify: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OnlineGiftActivityData {
        /**
         * 下个礼包的时间
         */
        m_ushNextGift: number;

        /**
         * 已经累积的在线时间
         */
        m_ushOnlineTime: number;

        /**
         * 下次刷新时间
         */
        m_iNextRefreshTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SignDataThing {
        /**
         * 所有的签到结果，按位存储
         */
        m_stSignData: SignData;

        /**
         * 奖励物品列表
         */
        m_stThingList: ContainerThingObjList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContainerThingObjList {
        /**
         * 物品数量
         */
        m_iThingNumber: number;

        m_astThingObj: Array<ContainerThingObj>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContainerThingObj {
        /**
         * 物品实例属性
         */
        m_stInfo: ContainerThingInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BatheSkillOperateRsp {
        /**
         * 技能操作类型 泼水、抹肥皂、搓背 [1-3]
         */
        m_ucOperatTpye: number;

        /**
         * 动作接受玩家id
         */
        m_stRoleId: RoleID;

        /**
         * 玩家已释放技能次数
         */
        m_ucReleaseCnt: number;

        /**
         * 接受玩家已接受技能总次数
         */
        m_uiAllAcceptCnt: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WorldBossListRsp {
        /**
         * 是否设置了刷新提醒
         */
        m_ucAlert: number;

        /**
         * 今日挖宝总次数
         */
        m_iAllDigCnt: number;

        /**
         * 所有Boss 脚本已奖励次数
         */
        m_iAllScriptCnt: number;

        /**
         * 所有世界boss信息
         */
        m_stBigBossList: CSBigBossList;

        /**
         * 遗留次数
         */
        m_iLevelCnt: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSBigBossList {
        
        m_iBossNum: number;

        /**
         * boss数组
         */
        m_astBossList: Array<CSBossOneInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSBossOneInfo {
        /**
         * bossID
         */
        m_iBossID: number;

        /**
         * 是否关注
         */
        m_ucIsAttent: number;

        /**
         * 是否死亡
         */
        m_ucIsDead: number;

        /**
         * 刷新时间
         */
        m_uiFreshTime: number;

        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 击杀者名字
         */
        m_szKillerName: string;

        /**
         * 已挖宝次数, -1表示异常，不能挖宝
         */
        m_iGetRewardCnt: number;

        /**
         * 脚本已奖励次数 0打Boss有奖励 1打Boss没有奖励
         */
        m_iGetScriptCnt: number;

        /**
         * 获得奖励列表
         */
        m_iRoleRewardCnt: number;

        /**
         * 获得奖励列表
         */
        m_stRoleRewardList: Array<CSBossRoleReward>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSBossRoleReward {
        /**
         * bossID
         */
        m_stRoleID: RoleID;

        /**
         * 是否关注
         */
        m_szRoleName: string;

        /**
         * 奖励道具ID
         */
        m_iItemID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WorldBossRewardRsp {
        /**
         * 挖宝的boss Id
         */
        m_uiBossId: number;

        /**
         * 已挖宝次数
         */
        m_iDigNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBBatheData {
        /**
         * 各技能释放次数,技能类型作为下标
         */
        m_auiReleaseCnt: Array<number>;

        /**
         * 已参加温泉活动标识,0 未参加， 1 参加
         */
        m_ucDoneFlag: number;

        /**
         * 温泉活动，释放技能的时间
         */
        m_iReleaseSkillTime: number;

        /**
         * 已接受技能释放总次数
         */
        m_uiAllAcceptCnt: number;

        /**
         * 最近一次参加温泉活动的时间戳
         */
        m_iTimestamp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuoYunRefreshRsp {
        /**
         * 任务id
         */
        m_iQuestId: number;

        /**
         * 本次刷新消耗
         */
        m_iMoneyNum: number;

        /**
         * 已免费刷新任务等级次数
         */
        m_ucRefreshFreeNum: number;

        /**
         * 任务等级变化量,表明升了几级
         */
        m_cLevelChange: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBGuoYunData {
        /**
         * 求救，护盾操作释放时间, 下标是操作类型，0无效
         */
        m_aiOperateTime: Array<number>;

        /**
         * 玩家已劫镖次数
         */
        m_iKillNum: number;

        /**
         * 下一次刷新任务等级需要元宝数
         */
        m_iNextMoneyNum: number;

        /**
         * 当前任务等级 [1,5], 初始状态下任务等级为1
         */
        m_iCurrentQuestLevel: number;

        /**
         * 已免费刷新任务等级次数
         */
        m_ucRefreshFreeNum: number;

        /**
         * 国运候选任务列表
         */
        m_aiQuestId: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DesktopCollectionData {
        /**
         * 是否已经收藏
         */
        m_cHaveCollected: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OpenSvrSignGetRsp {
        /**
         * 领取第几天的礼包
         */
        m_ucGetDays: number;

        /**
         * 当前已领取的礼包状态，0未领取，1已领取。按位存储,最大支持31天
         */
        m_iGetTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JBPOpenPanelInfo {
        /**
         * 累计充值
         */
        m_ulAccCharge: number;

        /**
         * 剩余时间
         */
        m_uiLeftTime: number;

        /**
         * 有效数组个数
         */
        m_ucNumber: number;

        /**
         * 状态数组
         */
        m_stData: Array<JBPOneStatus>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JBPOneStatus {
        /**
         * 配置ID
         */
        m_uiCfgID: number;

        /**
         * 1.不可领取 2.可领取 3.已领取    见宏GOD_LOAD_AWARD_DONE_GET
         */
        m_ucStatus: number;

        /**
         * 条件1
         */
        m_iCondition1: number;

        /**
         * 物品数量
         */
        m_iItemCount: number;

        /**
         * 奖励物品个数
         */
        m_stItemList: Array<CSJBPItem>;

        /**
         * 描述1
         */
        m_szRem1: string;

        /**
         * 描述1
         */
        m_szRem2: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSJBPItem {
        /**
         * 物品ID
         */
        m_iID: number;

        /**
         * 物品个数
         */
        m_iCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JBPGetRewardInfo {
        /**
         * 配置ID
         */
        m_uiCfgID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XingYuanDataCli {
        /**
         * 已捐献值
         */
        m_iContribute: number;

        /**
         * 礼包领取结果，按位存储
         */
        m_ucPrizeTag: number;

        /**
         * 本国今天的许愿星个数
         */
        m_iXingCountry: number;

        /**
         * 经验雨状态0未开启,1开启中,2结束了
         */
        m_ucExpStatus: number;

        /**
         * 今天可补领的次数0-120(结束后才可补领)
         */
        m_ucExpCount: number;

        /**
         * 今天已发的经验雨个数
         */
        m_ucCountryExpCount: number;

        /**
         * 经验雨剩余秒数(经验雨状态开启中才有效)
         */
        m_iLeftTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SMZTOpenPannelRes {
        /**
         * 有效数组个数
         */
        m_ucNumber: number;

        /**
         * 蛇魔遮天boss状态数量
         */
        m_stBossStatusList: Array<SMZTOneBossStatus>;

        /**
         * 下次活动开启时间
         */
        m_uiNextStartTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SMZTOneBossStatus {
        /**
         * boss对应scpritID
         */
        m_iTagID: number;

        /**
         * 跨服BOSS的ID
         */
        m_iBossID: number;

        /**
         * boss死亡状态 0活的  1死的
         */
        m_ucDead: number;

        /**
         * 击杀者名字
         */
        m_szKillerName: string;

        /**
         * 已挖宝次数, -1表示异常，不能挖宝
         */
        m_iGetRewardCnt: number;

        /**
         * 脚本已奖励次数 0打Boss有奖励 1打Boss没有奖励
         */
        m_iGetScriptCnt: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JUHSOpenPannelRsp {
        /**
         * 是否领取了全部购买的奖励
         */
        m_ucAllGet: number;

        /**
         * 购买时间戳,0表示没购买
         */
        m_uiBuyTime: number;

        /**
         * 当前第几天
         */
        m_ucDay: number;

        /**
         * 当前在线时长
         */
        m_iOnLineTime: number;

        /**
         * 有效数据个数, 多少天就多少个
         */
        m_ucNumber: number;

        /**
         * 数据数组
         */
        m_stOneDataList: Array<JUHSActOneData>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JUHSActOneData {
        /**
         * 第几天
         */
        m_ucDay: number;

        /**
         * 常规奖励领取状态，0未达成，1达成，2已领取
         */
        m_ucGetNormal: number;

        /**
         * 领取在线时间奖励领取状态，0未达成，1达成，2已领取
         */
        m_ucGetOnLine: number;

        /**
         * 领取VIP奖励，0未达成，1达成，2已领取
         */
        m_ucGetVIP: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JUHSBuyRsp {
        /**
         * 配置ID
         */
        m_ucCfgID: number;

        /**
         * 购买时间戳
         */
        m_uiBuyTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JUHSGetRep {
        /**
         * 配置ID
         */
        m_ucCfgID: number;

        /**
         * 领取第几天的礼包，从1开始
         */
        m_ucDay: number;

        /**
         * 领取奖励的类型，JUHS_GET_TYPE_NORMAL，JUHS_GET_TYPE_ONLINE，JUHS_GET_TYPE_VIP
         */
        m_ucType: number;

        /**
         * 该奖励领取状态，0未达成，1达成，2已领取
         */
        m_ucGetStatue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeiAnQinXiPinOperateRsp {
        /**
         * 请求操作的类型，1:雷,2:激励
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CZActOpenPannel {
        /**
         * 今日充值
         */
        m_uiCharge: number;

        /**
         * 参与奖励是否领取
         */
        m_ucRewardGet: number;

        /**
         * 子类
         */
        m_uiSubType: number;

        /**
         * 剩余时间
         */
        m_uiEndTime: number;

        /**
         * 是否上榜
         */
        m_uiMyRank: number;

        /**
         * 于前一名差距
         */
        m_uiDisPre: number;

        /**
         * 排名个数
         */
        m_ucRankCount: number;

        /**
         * 排名个数
         */
        m_stRankList: Array<CZActRankInfo>;

        /**
         * 配置个数
         */
        m_iCfgCount: number;

        /**
         * 配置
         */
        m_stCfgList: Array<CrossZZZD_Flash>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CZActRankInfo {
        /**
         * 角色Uin
         */
        m_uiUin: number;

        /**
         * 角色Seq
         */
        m_uiSeq: number;

        /**
         * 角色名字
         */
        m_szName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrossZZZD_Flash {
        /**
         * 0唯一配置ID
         */
        m_iID: number;

        /**
         * 0条件1
         */
        m_iCondition1: number;

        /**
         * 0条件2
         */
        m_iCondition2: number;

        /**
         * 0条件3
         */
        m_iCondition3: number;

        /**
         * 模型名字
         */
        m_szModelName: string;

        /**
         * 0模型类型
         */
        m_iModelType: number;

        /**
         * 0模型ID
         */
        m_iModelID: number;

        /**
         * 0武器ID
         */
        m_iWeaponID: number;

        /**
         * 0物品总数
         */
        m_iItemCount: number;

        /**
         * 物品列表
         */
        m_stItemList: Array<ZZZDCfgItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZZZDCfgItem {
        /**
         * 物品ID
         */
        m_iID: number;

        /**
         * 物品个数
         */
        m_iCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JSCLListInfoRsp {
        /**
         * 累计充值
         */
        m_ulAccConsume: number;

        /**
         * 剩余时间
         */
        m_uiLeftTime: number;

        /**
         * 有效数组个数
         */
        m_ucNumber: number;

        /**
         * 状态数组
         */
        m_stData: Array<JSCLOneStatus>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JSCLOneStatus {
        /**
         * 配置ID
         */
        m_uiCfgID: number;

        /**
         * 1.不可领取 2.可领取 3.已领取    见宏GOD_LOAD_AWARD_DONE_GET
         */
        m_ucStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JSCLGetRewardInfoRsp {
        /**
         * 配置ID
         */
        m_uiCfgID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TDXMActInfo {
        /**
         * 状态 TDXM_STATUS_NONE空  TDXM_STATUS_READY招募  TDXM_STATUS_RUN进行中
         */
        m_ucStatus: number;

        /**
         * 类型 TDXM_TYPE_NONE空  TDXM_TYPE_MINGMEN冥门  TDXM_TYPE_XINGMEN星门
         */
        m_ucType: number;

        /**
         * 剩余时间
         */
        m_iLeftTime: number;

        /**
         * 创建次数
         */
        m_usLeftCreate: number;

        /**
         * 参与次数
         */
        m_usLeftJoin: number;

        /**
         * 成员个数
         */
        m_ucCount: number;

        /**
         * 成员数据
         */
        m_stMembers: Array<TDXMActRole>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TDXMActRole {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 等级
         */
        m_iLevel: number;

        /**
         * 职业
         */
        m_ucProf: number;

        /**
         * 性别
         */
        m_ucGender: number;

        /**
         * 名字
         */
        m_szNickName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XYZPpannelRsp {
        /**
         * 奖池总数
         */
        m_iTotalReward: number;

        /**
         * 成员个数
         */
        m_ucCount: number;

        /**
         * 成员数据
         */
        m_stMembers: Array<XYZPActRole>;

        /**
         * 配置个数
         */
        m_iCfgCount: number;

        /**
         * 配置数据
         */
        m_stCfgList: Array<XYZPActCfg_Flash>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XYZPActRole {
        /**
         * 物品ID
         */
        m_uiItemID: number;

        /**
         * 物品个数
         */
        m_uiItemCount: number;

        /**
         * 名字
         */
        m_szNickName: string;

        /**
         * 几等奖
         */
        m_ucLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XYZPActCfg_Flash {
        /**
         * ID
         */
        m_iID: number;

        /**
         * 0自然日
         */
        m_ucDate: number;

        /**
         * 0位置
         */
        m_ucPosition: number;

        /**
         * 0物品1ID
         */
        m_iItem1ID: number;

        /**
         * 0物品1数量
         */
        m_iItem1Count: number;

        /**
         * 0档次
         */
        m_iGrade: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XYZPDrawRsp {
        /**
         * 抽到的位置 0开始
         */
        m_ucDrawIndex: number;

        /**
         * 个数
         */
        m_ucCount: number;

        /**
         * 抽到物品
         */
        m_stDropItemList: Array<XYZPItemInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XYZPItemInfo {
        /**
         * 物品ID
         */
        m_uiItemID: number;

        /**
         * 物品个数
         */
        m_uiItemCount: number;

        /**
         * 几等奖
         */
        m_ucLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XYZPGetGiftRsp {
        /**
         * 可领奖列表个数
         */
        m_ucCount: number;

        /**
         * 可领奖列表
         */
        m_stGiftListStatus: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XYZPRecordRsp {
        /**
         * 奖池总数
         */
        m_iTotalReward: number;

        /**
         * 成员个数
         */
        m_ucCount: number;

        /**
         * 成员数据
         */
        m_stMembers: Array<XYZPActRole>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HLTBPannleRsp {
        /**
         * 免费CD
         */
        m_uiCDFuDi: number;

        /**
         * 免费CD
         */
        m_uiCDXianJ: number;

        /**
         * 每日显示用掉落ID
         */
        m_uiDayDropID: number;

        /**
         * 每周显示用掉落ID
         */
        m_uiWeekDropID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HLTBDrawRsp {
        /**
         * 奖项类型 1福地HLTB_TYPE_FUDI  2仙境HLTB_TYPE_XIANJING  3飞升HLTB_TYPE_FEISHENG
         */
        m_ucType: number;

        /**
         * 免费CD
         */
        m_uiCD: number;

        /**
         * 抽奖次数
         */
        m_uiDrawCount: number;

        /**
         * 物品个数
         */
        m_ucCount: number;

        /**
         * 奖励物品列表
         */
        m_stItemList: Array<HLTBDrawItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HLTBDrawItem {
        /**
         * 物品ID
         */
        m_uiItemID: number;

        /**
         * 物品个数
         */
        m_uiItemCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HLFPListRsp {
        /**
         * 活动期间，累计消费
         */
        m_ulAccConsume: number;

        /**
         * 活动期间，已领取次数
         */
        m_uiGetTimes: number;

        /**
         * 本局已换牌次数, 超过255，默认为255
         */
        m_ucChangeTimes: number;

        /**
         * 牌的数量 0或MAX_HLFP_CARD_NUM
         */
        m_ucCardCount: number;

        /**
         * 本局牌信息, 根据花色，1-5
         */
        m_acCard: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HLFPDealRsp {
        /**
         * 本局牌的数量 0或MAX_HLFP_CARD_NUM
         */
        m_ucCardCount: number;

        /**
         * 本局牌信息, 根据花色，1-5
         */
        m_acCard: Array<number>;

        /**
         * 本局已换牌次数, 发牌应该为0
         */
        m_ucChangeTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HLFPRefreshRsp {
        /**
         * 本局牌的数量 0或MAX_HLFP_CARD_NUM
         */
        m_ucCardCount: number;

        /**
         * 本局牌信息, 根据花色，1-5
         */
        m_acCard: Array<number>;

        /**
         * 本局已换牌次数
         */
        m_ucChangeTimes: number;

        /**
         * 按位标识，0表示已换牌，1表示保留未换的牌,根据前台请求，直接回前台
         */
        m_ucHLFPRefresh: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FestivalChargeRsp {
        /**
         * 累计充值值
         */
        m_uiAccValue: number;

        /**
         * 个数
         */
        m_ucCount: number;

        /**
         * 已经兑换的配置ID列表
         */
        m_iIDList: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FestivalConsumeRsp {
        /**
         * 累计消费值
         */
        m_uiAccValue: number;

        /**
         * 个数
         */
        m_ucCount: number;

        /**
         * 已经兑换的配置ID列表
         */
        m_iIDList: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FestivalGetBoxPanel {
        /**
         * 个数
         */
        m_ucCount: number;

        /**
         * 兑换列表
         */
        m_stConversionList: Array<ConversionOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ConversionOne {
        /**
         * 兑换配置ID
         */
        m_uiTargetCfgID: number;

        /**
         * 消耗物品配置ID
         */
        m_uiConsumeCfgID: number;

        /**
         * 需要消耗物品个数
         */
        m_uiConsumeNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DailyConsumeRsp {
        /**
         * 活动消费时间(哪天)
         */
        m_ucDay: number;

        /**
         * 累计消费数量
         */
        m_ulConsume: number;

        /**
         * 有效数组个数
         */
        m_ucNumber: number;

        /**
         * 已经领取的配置ID列表
         */
        m_iIDList: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ConsumeRankInfoRsp {
        /**
         * 活动消费时间(哪天)
         */
        m_ucDay: number;

        /**
         * 第一名角色RoleID
         */
        m_stFirstRoleID: RoleID;

        /**
         * 第一名角色BaseProInfo
         */
        m_stFirstBaseProfile: BaseProfile;

        /**
         * 当天自己累计消费数量
         */
        m_uiMyConsume: number;

        /**
         * 我的排名,0表示未上榜
         */
        m_ucMyRank: number;

        /**
         * 是否已经领取了个人达成奖励
         */
        m_ucFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ConsumeRankListRsp {
        /**
         * 当天自己累计消费数量
         */
        m_uiMyConsume: number;

        /**
         * 我的排名,0表示未上榜
         */
        m_ucMyRank: number;

        /**
         * 排行个数
         */
        m_ucCount: number;

        /**
         * 消费排行数据
         */
        m_astComsumeList: Array<OneComsumeInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneComsumeInfo {
        /**
         * RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 角色BaseProInfo
         */
        m_stBaseProfile: BaseProfile;

        /**
         * 当天累计消费数量
         */
        m_uiConsume: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TMDCBListRsp {
        /**
         * 物品数量
         */
        m_ucNum: number;

        /**
         * 已购物品信息
         */
        m_stLimitThingList: Array<TMDCBLimitThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TMDCBLimitThing {
        /**
         * 物品ID
         */
        m_uiThingID: number;

        /**
         * 已购买数量
         */
        m_uiHaveBuyNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TMDCBBuyRsp {
        /**
         * 本次购买物品的序号
         */
        m_uiIndex: number;

        /**
         * 限购物品数量
         */
        m_ucNum: number;

        /**
         * 限购物品信息
         */
        m_stLimitThingList: Array<TMDCBLimitThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CZSHLListRsp {
        /**
         * 活动期间累计充值
         */
        m_ulAccCharge: number;

        /**
         * 物品数量
         */
        m_ucNum: number;

        /**
         * 已经领取物品信息
         */
        m_stCZSHLThingList: Array<CZSHLCfgOneItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CZSHLCfgOneItem {
        /**
         * 配置ID
         */
        m_iID: number;

        /**
         * 已领取数量
         */
        m_iCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CZSHLGetRsp {
        /**
         * 本次领取物品的序号
         */
        m_uiIndex: number;

        /**
         * 已领取物品列表数量
         */
        m_ucNum: number;

        /**
         * 物品信息
         */
        m_stCZSHLThingList: Array<CZSHLCfgOneItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RechargeExchangeRsp {
        /**
         * 列表长度
         */
        m_ucNum: number;

        /**
         * 已兑换信息
         */
        m_stExchangeList: Array<RechargeExchangeList>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RechargeExchangeList {
        /**
         * 配置ID
         */
        m_uiCfgID: number;

        /**
         * 已兑换次数
         */
        m_uiExchangeNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RechargeExchangeGetRsp {
        /**
         * 兑换充值奖励响应 0领取成功
         */
        m_ucRsp: number;

        /**
         * 配置ID
         */
        m_uiCfgID: number;

        /**
         * 已兑换次数
         */
        m_uiExchangeNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JJRGetRewardRsp {
        /**
         * 进阶日类型，1 美人 2 坐骑 3 羽翼 4 精灵 5 武魂 6 法阵
         */
        m_ucMainType: number;

        /**
         * 一个状态，根据配置ID，来判断属于哪个面板吧
         */
        m_stStatus: JJROneStatus;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFXHBInfoList {
        /**
         * 活动期间，自己的累计魅力值
         */
        m_uiOwnCharm: number;

        /**
         * 当天已领取达成礼包信息,按位存储，0未领取，1已领取
         */
        m_uiGetGift: number;

        /**
         * 排行榜类型，男/女
         */
        m_ucType: number;

        /**
         * 帅哥排行榜总人数
         */
        m_ucRankNum: number;

        /**
         * 对应前台请求的性别排行榜
         */
        m_stRankList: Array<KFXHBOneInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFXHBOneInfo {
        /**
         * RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 角色名
         */
        m_szNickName: string;

        /**
         * 性别
         */
        m_cGender: number;

        /**
         * 职业
         */
        m_cProfession: number;

        /**
         * 角色的魅力累计值
         */
        m_uiCharm: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSFMTListRsp {
        /**
         * boss数量
         */
        m_ucBossNum: number;

        /**
         * boss数组
         */
        m_astBossList: Array<CSFMTBossOneInfo>;

        /**
         * 是否地宫Boss复活推送，1表示是地宫boss复活的推送
         */
        m_ucIsDGBossAliveNtf: number;

        /**
         * 复活的推送BossID 前台需要
         */
        m_iAliveNtfBossID: number;

        /**
         * 杀怪数量
         */
        m_iKillMonsterNumber: number;

        /**
         * 杀Boss数量
         */
        m_iKillBossNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSFMTBossOneInfo {
        /**
         * bossID
         */
        m_iBossID: number;

        /**
         * 是否死亡
         */
        m_ucIsDead: number;

        /**
         * 刷新时间
         */
        m_uiFreshTime: number;

        /**
         * 击杀者记录数量
         */
        m_ucKillerNum: number;

        /**
         * 击杀者数组
         */
        m_astKillerList: Array<CSFMTKillerOneInfo>;

        /**
         * boss当前血量
         */
        m_llBossHP: number;

        /**
         * 地宫boss所在场景人数
         */
        m_iRoleNum: number;

        /**
         * 地宫场景里伤害排名
         */
        m_stDGHurtInfo: Array<CSDGHurtInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSFMTKillerOneInfo {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 击杀者名字
         */
        m_szKillerName: string;

        /**
         * 击杀时间
         */
        m_uiTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSDGHurtInfo {
        /**
         * 宗派成员名字
         */
        m_szName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HistoricalRemainsPanelRsp {
        /**
         * 位置
         */
        m_ucPos: number;

        /**
         * 位置状态 0 未完成 1已完成
         */
        m_ucPosStatus: number;

        /**
         * 上次一色子点数
         */
        m_ucPreNumber: number;

        /**
         * 当天活动剩余次数
         */
        m_ucRemainResetTimes: number;

        /**
         * 普通色子剩余次数
         */
        m_ucNDRemainTimes: number;

        /**
         * 魔力色子剩余次数
         */
        m_uiMDRemainTimes: number;

        /**
         * 魔力色子已购买次数
         */
        m_uiMDBuyTimes: number;

        /**
         * 普通色子增加倒计时
         */
        m_uiDiceResetTime: number;

        /**
         * 所有位置首通状态，按位存储 0 未完成 1已完成
         */
        m_uiPosLifeStatus: number;

        /**
         * 当前层数
         */
        m_ucStage: number;

        /**
         * 领取层奖励的标识，按位存储,0未领取，1已领取
         */
        m_ucStagePassGiftFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ThrowDiceRsp {
        /**
         * 点数
         */
        m_ucNumber: number;

        /**
         * 位置
         */
        m_ucPos: number;

        /**
         * 位置状态 0 未完成 1已完成
         */
        m_ucPosStatus: number;

        /**
         * 普通色子剩余次数
         */
        m_ucNDRemainTimes: number;

        /**
         * 魔力色子剩余次数
         */
        m_uiMDRemainTimes: number;

        /**
         * 魔力色子已购买次数
         */
        m_uiMDBuyTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GotoPosRsp {
        /**
         * 点数
         */
        m_ucNumber: number;

        /**
         * 位置
         */
        m_ucPos: number;

        /**
         * 位置状态 0 未完成 1已完成
         */
        m_ucPosStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BuyMagicDiceTimesRsp {
        /**
         * 剩余次数
         */
        m_uiRemainTimes: number;

        /**
         * 魔力色子已购买次数
         */
        m_uiMDBuyTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OpenRedBagResp {
        /**
         * 可发红包总金额
         */
        m_uiTotalAmount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SendRedBagResp {
        /**
         * 红包id
         */
        m_iRedBagId: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GrabRedBagResp {
        /**
         * 红包id
         */
        m_iRedBagId: number;

        /**
         * 发红包角色名
         */
        m_szNickName: string;

        /**
         * 自己抢到多少
         */
        m_uiMySelfRobValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SeeRedBagInfoResp {
        /**
         * 发红包角色名
         */
        m_szNickName: string;

        /**
         * 性别
         */
        m_cGender: number;

        /**
         * 职业
         */
        m_ucProf: number;

        /**
         * 自己抢到多少
         */
        m_uiMySelfRobValue: number;

        /**
         * 红包数量
         */
        m_ucRedBagNum: number;

        /**
         * 红包信息
         */
        m_astRedBagInfo: Array<OneRedBagInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneRedBagInfo {
        /**
         * 角色名
         */
        m_szNickName: string;

        /**
         * 抢到多少
         */
        m_uiRobValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RedBagRankResp {
        /**
         * 榜单数量
         */
        m_ucRankCount: number;

        /**
         * 自己的排名信息
         */
        m_stMyselfRedBagInfo: OneRedBagInfo;

        /**
         * 榜单
         */
        m_astRobValue: Array<OneRedBagInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QingDianConsumeRsp {
        /**
         * 自己累计消费数量
         */
        m_uiMyConsume: number;

        /**
         * 我的排名,0表示未上榜
         */
        m_ucMyRank: number;

        /**
         * 排行个数
         */
        m_ucCount: number;

        /**
         * 庆典消费排行数据
         */
        m_astComsumeList: Array<OneQDComsumeInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneQDComsumeInfo {
        /**
         * RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 角色BaseProInfo
         */
        m_stBaseProfile: BaseProfile;

        /**
         * 当天累计消费数量
         */
        m_uiConsume: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DailyFirstRechargeRsp {
        /**
         * 累计值
         */
        m_uiAccValue: number;

        /**
         * 0.不可领取 1.可领取 2.已领取    见宏CHARGE_AWARD_CANT_GET
         */
        m_ucStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RMBZCInfoRsp {
        /**
         * 当前参与人数
         */
        m_uiTotalNum: number;

        /**
         * 自己参与状态，0未报名，1已报名，2战场已开
         */
        m_ucStatus: number;

        /**
         * 剩余参与次数
         */
        m_ucJoinTimes: number;

        /**
         * 下次购买需要钱数
         */
        m_uiBuyPrice: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZZZDOpenPanelRsp {
        /**
         * 自己累计充值数量
         */
        m_uiMyCharge: number;

        /**
         * 我的排名,0表示未上榜
         */
        m_ucMyRank: number;

        /**
         * 排行个数
         */
        m_ucCount: number;

        /**
         * 至尊争夺板充值排行数据
         */
        m_astChargeList: Array<OneZZZDRankInfo>;

        /**
         * 排行个数
         */
        m_iCfgCount: number;

        /**
         * 当天 至尊争夺板充值排行配置
         */
        m_stCfgList: Array<KFZZZDCfg_Flash>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneZZZDRankInfo {
        /**
         * RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 角色BaseProInfo
         */
        m_stBaseProfile: BaseProfile;

        /**
         * 当天累计充值数量
         */
        m_uiCharge: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFZZZDCfg_Flash {
        /**
         * 0唯一配置ID
         */
        m_iID: number;

        /**
         * 0开启日期
         */
        m_ucDay: number;

        /**
         * 0是否开启
         */
        m_ucOpen: number;

        /**
         * 0条件1
         */
        m_iCondition1: number;

        /**
         * 0条件2
         */
        m_iCondition2: number;

        /**
         * 0条件3
         */
        m_iCondition3: number;

        /**
         * 模型名字
         */
        m_szModelName: string;

        /**
         * 0模型类型
         */
        m_iModelType: number;

        /**
         * 0模型ID
         */
        m_iModelID: number;

        /**
         * 0武器ID
         */
        m_iWeaponID: number;

        /**
         * 0物品总数
         */
        m_iItemCount: number;

        /**
         * 物品列表
         */
        m_stItemList: Array<ZZZDCfgItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrossBossRewardRsp {
        /**
         * 挖宝的boss Id
         */
        m_uiBossId: number;

        /**
         * 已挖宝次数
         */
        m_iDigNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TTZFOpenPanelRsp {
        /**
         * 图腾祝福值
         */
        m_uiZhuFuValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DDLOpenPanelRsp {
        /**
         * 今日已获得的免费次数
         */
        m_ucNums: number;

        /**
         * 可点免费次数
         */
        m_ucFreeTimes: number;

        /**
         * 免费次数截止时间
         */
        m_uiEndTime: number;

        /**
         * 活动期间总点灯次数
         */
        m_usTotalTimes: number;

        /**
         * 已刷新的灯笼数量
         */
        m_ucNum: number;

        /**
         * 灯笼信息
         */
        m_stDLListInfo: Array<NewDLListInfo>;

        /**
         * 全服点灯笼记录列表，顺序排列，最多记录50条
         */
        m_astRecordList: Array<DDLRecord>;

        /**
         * 道具个数
         */
        m_ucItemCount: number;

        /**
         * 道具信息
         */
        m_stItemList: Array<SimItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NewDLListInfo {
        /**
         * 配置ID
         */
        m_iCfgID: number;

        /**
         * 灯笼类型
         */
        m_iType: number;

        /**
         * 灯笼状态  是否被点过
         */
        m_ucState: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DDLRecord {
        /**
         * 玩家昵称
         */
        m_szNickName: string;

        /**
         * 对应的物品id
         */
        m_iThingID: number;

        /**
         * 对应的物品id数量
         */
        m_iThingNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SimItem {
        /**
         * 道具或货币ID
         */
        iItemID: number;

        /**
         * 道具个数
         */
        iItemNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DDLFreshRsp {
        /**
         * 已刷新的灯笼数量
         */
        m_ucNum: number;

        /**
         * 灯笼信息
         */
        m_stDLListInfo: Array<NewDLListInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DDLOnLightRsp {
        /**
         * 记录列表数量
         */
        m_ucNum: number;

        /**
         * 个人点灯笼记录列表，顺序排列，最多记录10条
         */
        m_astRecordList: Array<DDLRecord>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DDLOpenRankPanelRsp {
        /**
         * 是否上榜
         */
        m_uiMyRank: number;

        /**
         * 于前一名差距
         */
        m_uiDisPre: number;

        /**
         * 排名个数
         */
        m_ucRankCount: number;

        /**
         * 排名个数
         */
        m_stRankList: Array<DDLActRankInfo>;

        /**
         * 是否领取达成奖励
         */
        m_ucState: number;

        /**
         * 活动期间总点灯次数
         */
        m_usTotalTimes: number;

        /**
         * 表格配置数
         */
        m_iCfgCount: number;

        /**
         * 表格配置
         */
        m_stCfgList: Array<CrossDDL_Flash>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DDLActRankInfo {
        /**
         * 角色Uin
         */
        m_uiUin: number;

        /**
         * 角色Seq
         */
        m_uiSeq: number;

        /**
         * 角色名字
         */
        m_szName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrossDDL_Flash {
        /**
         * 0唯一配置ID
         */
        m_iID: number;

        /**
         * 0条件1
         */
        m_iCondition1: number;

        /**
         * 0条件2
         */
        m_iCondition2: number;

        /**
         * 0条件3
         */
        m_iCondition3: number;

        /**
         * 模型名字
         */
        m_szModelName: string;

        /**
         * 0模型类型
         */
        m_iModelType: number;

        /**
         * 0模型ID
         */
        m_iModelID: number;

        /**
         * 0武器ID
         */
        m_iWeaponID: number;

        /**
         * 0物品总数
         */
        m_iItemCount: number;

        /**
         * 物品列表
         */
        m_stItemList: Array<DDLCfgItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DDLCfgItem {
        /**
         * 物品ID
         */
        m_iID: number;

        /**
         * 物品个数
         */
        m_iCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BFQDDrawPanelRsp {
        /**
         * 全服庆典抽奖记录列表，顺序排列，最多记录50条
         */
        m_astRecordList: Array<BFQDDrawRecord>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BFQDDrawRecord {
        /**
         * 玩家昵称
         */
        m_szNickName: string;

        /**
         * 对应的物品id
         */
        m_iThingID: number;

        /**
         * 对应的物品id数量
         */
        m_iThingNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BFQDDrawRsp {
        /**
         * 记录列表数量
         */
        m_ucNum: number;

        /**
         * 个人抽奖记录列表，顺序排列
         */
        m_astRecordList: Array<BFQDDrawRecord>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BFQDChargePanelRsp {
        /**
         * 充值金额
         */
        m_uiChargeValue: number;

        /**
         * 充值奖励领取状态(分几个档次)
         */
        m_usChargeRewardStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BFQDConsumeRankPanelRsp {
        /**
         * 消费金额
         */
        m_uiConsumeValue: number;

        /**
         * 是否上榜
         */
        m_uiMyRank: number;

        /**
         * 于前一名差距
         */
        m_uiDisPre: number;

        /**
         * 排名个数
         */
        m_ucRankCount: number;

        /**
         * 排名个数
         */
        m_stRankList: Array<BFQDActRankInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BFQDActRankInfo {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 角色名字
         */
        m_szName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DuanWuPanelRsp {
        /**
         * 个人的兑换次数
         */
        m_uiExchangeNum: number;

        /**
         * 玩家达成奖励领取状态 按位存储
         */
        m_usReachStatus: number;

        /**
         * 长度
         */
        m_ucCount: number;

        /**
         * 全服领取达成信息
         */
        m_astOneReachInfo: Array<OneReachInfo>;

        /**
         * 今日是否领取登录奖励
         */
        m_ucLoginReward: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneReachInfo {
        /**
         * 达成档次
         */
        m_ucBit: number;

        /**
         * 全服已领取达成奖励数
         */
        m_uiCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PreferChargeRsp {
        /**
         * 每日充值数据
         */
        m_stDayList: Array<PreChargeDayData>;

        /**
         * 达成奖励个数
         */
        m_ucCount: number;

        /**
         * 达成奖励数据
         */
        m_stDCList: Array<PreChargeDCData>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PreChargeDayData {
        /**
         * 活动期间每日累计充值
         */
        m_uiAccValue: number;

        /**
         * 每日奖励领取个数
         */
        m_ucDayCount: number;

        /**
         * 每日已经领取的配置ID列表
         */
        m_iDayIDList: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PreChargeDCData {
        /**
         * 配置ID
         */
        m_iDCID: number;

        /**
         * 达成次数
         */
        m_iDCTime: number;

        /**
         * 是否已经领取，0未领取，1已领取
         */
        m_ucGet: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrossYunGouRsp {
        /**
         * 玩家购买次数
         */
        m_uiBuyTimes: number;

        /**
         * 总购买次数
         */
        m_uiTotal: number;

        /**
         * 活动第几天
         */
        m_ucDay: number;

        /**
         * 中奖日志个数
         */
        m_ucLucyCount: number;

        /**
         * 中奖记录
         */
        m_stLucyList: Array<CrossYGRecord>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrossYGRecord {
        /**
         * 物品ID
         */
        m_iItemID: number;

        /**
         * 物品数量
         */
        m_iItemCount: number;

        /**
         * 获奖者名字
         */
        m_szName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JZXGPanelRsp {
        /**
         * 玩家奖励倍率
         */
        m_ucRewardMult: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LHJpannelRsp {
        /**
         * 总转动数
         */
        m_uiTurnValue: number;

        /**
         * 记录数
         */
        m_ucCount: number;

        /**
         * 全服记录
         */
        m_stRecordList: Array<LHJItemInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LHJItemInfo {
        /**
         * 配置ID
         */
        m_iCfgID: number;

        /**
         * 几连斩
         */
        m_ucLevel: number;

        /**
         * 物品ID
         */
        m_iItemID: number;

        /**
         * 物品数量
         */
        m_iItemCount: number;

        /**
         * 额外的物品ID
         */
        m_iExtraItemID: number;

        /**
         * 额外的物品数量
         */
        m_iExtraItemCount: number;

        /**
         * 名字
         */
        m_szNickName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LHJDrawRsp {
        /**
         * 总转动数
         */
        m_uiTurnValue: number;

        /**
         * 转到的物品数组
         */
        m_aiItemList: Array<number>;

        /**
         * 个数
         */
        m_ucCount: number;

        /**
         * 转到的物品记录
         */
        m_stDropItemList: Array<LHJItemInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LHJRecordRsp {
        /**
         * 成员个数
         */
        m_ucCount: number;

        /**
         * 全服转动信息记录
         */
        m_stRecordList: Array<LHJItemInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZYJCZFLDataRsp {
        /**
         * 活动期间充值总额
         */
        m_uiAccValue: number;

        /**
         * 已领取奖励的总数
         */
        m_ucCount: number;

        /**
         * 奖励ID列表
         */
        m_stDCList: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ChargeRedBagDataRsp {
        /**
         * 活动期间充值总额
         */
        m_uiAccValue: number;

        /**
         * 已领取奖励的次数
         */
        m_uiGetCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HLZPPannelRsp {
        /**
         * 剩余抽奖次数
         */
        m_uiDrawTimes: number;

        /**
         * 活动期间消费金额
         */
        m_uiConsume: number;

        /**
         * 记录数
         */
        m_ucCount: number;

        /**
         * 抽奖信息
         */
        m_stRecordList: Array<HLZPDrawRecord>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HLZPDrawRecord {
        /**
         * 物品ID
         */
        m_uiItemID: number;

        /**
         * 物品个数
         */
        m_uiItemCount: number;

        /**
         * 名字
         */
        m_szNickName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HLZPDrawRsp {
        /**
         * 剩余抽奖次数
         */
        m_uiDrawTimes: number;

        /**
         * 抽到的位置 0开始
         */
        m_ucDrawIndex: number;

        /**
         * 个数
         */
        m_ucCount: number;

        /**
         * 抽奖信息
         */
        m_stDropItemList: Array<HLZPDrawRecord>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HLZPRecordRsp {
        /**
         * 记录数
         */
        m_ucCount: number;

        /**
         * 抽奖信息
         */
        m_stRecordList: Array<HLZPDrawRecord>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BBGSInfoRsp {
        /**
         * 当天累计充值
         */
        m_ulAccCharge: number;

        /**
         * 活动开启第几天
         */
        m_ucDay: number;

        /**
         * 有效数组个数
         */
        m_ucNumber: number;

        /**
         * 状态数组
         */
        m_stData: Array<BBGSOneStatus>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BBGSOneStatus {
        /**
         * 配置ID
         */
        m_uiCfgID: number;

        /**
         * 1.不可领取 2.可领取 3.已领取	见宏GOD_LOAD_AWARD_DONE_GET
         */
        m_ucStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Cross3V3ListRsp {
        /**
         * 每日胜利场数
         */
        m_uiDayWinTime: number;

        /**
         * 每日参与场数
         */
        m_uiDayTime: number;

        /**
         * 当前段位
         */
        m_uiGrade: number;

        /**
         * 当前积分
         */
        m_uiScore: number;

        /**
         * 上一次结算段位
         */
        m_uiPreGrade: number;

        /**
         * 本赛季结算时间
         */
        m_iSeasonEndTime: number;

        /**
         * 本赛季礼包领取状态，0未领取，1已领取
         */
        m_ucSeasonGift: number;

        /**
         * 惩罚时间
         */
        m_iPunishTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ColosseumActRsp {
        /**
         * 每日胜利场数
         */
        m_uiDayWinCount: number;

        /**
         * 每日参与场数
         */
        m_uiDayCount: number;

        /**
         * 每日复仇场数
         */
        m_uiRevengeCount: number;

        /**
         * 每日购买次数
         */
        m_uiBuyCount: number;

        /**
         * 当前段位
         */
        m_uiGrade: number;

        /**
         * 当前积分
         */
        m_uiScore: number;

        /**
         * 上一次结算段位
         */
        m_uiPreGrade: number;

        /**
         * 上一次结算段位时间戳
         */
        m_iPreGradeTime: number;

        /**
         * 今日段位礼包领取状态，0未领取，1已领取
         */
        m_ucGiftStatu: number;

        /**
         * 挑战CD时间
         */
        m_iCDTime: number;

        /**
         * 已经领取段位奖励长度
         */
        m_ucNumber: number;

        /**
         * 已经领取段位奖励ID列表
         */
        m_stGradeRewardList: Array<number>;

        /**
         * 上阵四象神兽个数
         */
        m_ucSSCout: number;

        /**
         * 上阵四象神兽列表
         */
        m_astBattleSSList: Array<BattleSSListRsp>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BattleSSListRsp {
        /**
         * 四象类型
         */
        m_ucType: number;

        /**
         * 四象等级
         */
        m_ucLevel: number;

        /**
         * 经验
         */
        m_uiExp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HomeBossActOpenRsp {
        
        m_iBossNum: number;

        /**
         * boss数组
         */
        m_astBossList: Array<SmallBossOneInfo>;

        /**
         * 副本层数
         */
        m_iFloorNum: number;

        /**
         * 时间数组
         */
        m_astFreshTimeList: Array<number>;

        /**
         * 门票购买次数
         */
        m_ucBuyTicketNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SmallBossOneInfo {
        /**
         * bossID
         */
        m_iBossID: number;

        /**
         * 是否死亡
         */
        m_ucIsDead: number;

        /**
         * 刷新时间
         */
        m_uiFreshTime: number;

        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 击杀者名字
         */
        m_szKillerName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WCupPanelRsp {
        /**
         * 正在进行竞猜的比赛数量
         */
        m_ucNum: number;

        /**
         * 竞猜的比赛信息
         */
        m_astGameInfo: Array<WCupOneGameInfo>;

        /**
         * 上轮已结算比赛数量
         */
        m_ucLastNum: number;

        /**
         * 上轮已结算竞猜的比赛信息
         */
        m_astLastGameInfo: Array<WCupOneGameInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WCupOneGameInfo {
        /**
         * 比赛id
         */
        m_iGameID: number;

        /**
         * 状态，过期 1/待结算 2/进行中 3
         */
        m_ucState: number;

        /**
         * 赛果，胜 1/负 2/平 3
         */
        m_iResult: number;

        /**
         * 赛果 比分索引，0-25
         */
        m_iScoreID: number;

        /**
         * 投注开始时间
         */
        m_uiBetStartTime: number;

        /**
         * 投注结束时间
         */
        m_uiBetEndTime: number;

        /**
         * 主队
         */
        m_iMainTeamID: number;

        /**
         * 客队
         */
        m_iVisitTeamID: number;

        /**
         * 主队进球
         */
        m_iMainGoal: number;

        /**
         * 客队进球
         */
        m_iVisitGoal: number;

        /**
         * 胜 总投注数
         */
        m_iWinBet: number;

        /**
         * 负 总投注数
         */
        m_iLoseBet: number;

        /**
         * 平 总投注数
         */
        m_iTieBet: number;

        /**
         * 玩家 胜负 投注类型
         */
        m_iRoleBetType: number;

        /**
         * 玩家 胜负 投注数
         */
        m_iRoleBetNum: number;

        /**
         * 比分 数量
         */
        m_ucScoreNum: number;

        /**
         * 比分 投注信息
         */
        m_astPeiLvInfo: Array<WCupOnePeiLv>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WCupOnePeiLv {
        /**
         * 总投注数
         */
        m_iBetScoreNum: number;

        /**
         * 赔率百分比
         */
        m_iPeiLv: number;

        /**
         * 玩家投注数
         */
        m_iRoleBetNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WCupRankRsp {
        /**
         * 排行榜数量
         */
        m_ucNum: number;

        /**
         * 信息
         */
        m_astWCupRankInfo: Array<WCupOneRankInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WCupOneRankInfo {
        /**
         * 玩家
         */
        m_stRoleID: RoleID;

        /**
         * 玩家获得总返利
         */
        m_uiReward: number;

        /**
         * 名字
         */
        m_szNickName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QMHDActPanelRsp {
        /**
         * 充值额度
         */
        m_iChargeValue: number;

        /**
         * 消费额度
         */
        m_iConsumeValue: number;

        /**
         * 嗨点值
         */
        m_uiHDDegree: number;

        /**
         * 奖励领取按位存储标志
         */
        m_uiBitFlag: number;

        /**
         * 活跃类的个数
         */
        m_ucCount: number;

        /**
         * 活跃类列表
         */
        m_stActiveHDList: Array<ActiveHDItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ActiveHDItem {
        /**
         * 配置ID
         */
        m_uiActiveID: number;

        /**
         * 完成次数
         */
        m_uiTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WCupChampionPanelRsp {
        /**
         * 已经竞猜的比赛数量
         */
        m_ucNum: number;

        /**
         * 竞猜的比赛信息
         */
        m_astGameInfo: Array<DBWCupChampionRoleOneBetInfo>;

        /**
         * 每一轮次的充值数量，初始化最为4轮
         */
        m_ucRoundNum: number;

        /**
         * 每轮期间充值额度信息
         */
        m_astChargeInfo: Array<number>;

        /**
         * 配置个数
         */
        m_ucItemCount: number;

        /**
         * 配置列表
         */
        m_stGetCfgList: Array<WorldCupChampionConfig_Server>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBWCupChampionRoleOneBetInfo {
        /**
         * 比赛id
         */
        m_iGameID: number;

        /**
         * 玩家 投注队伍
         */
        m_iRoleBetTeamID: number;

        /**
         * 是否 结算返利,0否，1已结算
         */
        m_ucHaveGet: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WorldCupChampionConfig_Server {
        /**
         * 0场次
         */
        m_iID: number;

        /**
         * 0轮次
         */
        m_bLunci: number;

        /**
         * 0投注开始时间
         */
        m_uiTouzhuStartTime: number;

        /**
         * 0投注结束时间
         */
        m_uiTouzhuEndTime: number;

        /**
         * 0充值开始时间
         */
        m_uiChongzhiStartTime: number;

        /**
         * 0充值结束时间
         */
        m_uiChongzhiEndTime: number;

        /**
         * 0主队
         */
        m_iMainTeamID: number;

        /**
         * 0客队
         */
        m_iVisitTeamID: number;

        /**
         * 0晋级的队伍
         */
        m_iJinjidui: number;

        /**
         * 0赔率
         */
        m_iPeiLv: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFNSActOpenRsp {
        /**
         * Oss配置的活动结束时间
         */
        m_uiActEndTime: number;

        /**
         * 跨服年兽 打开面板 0boss死亡 1boss存活
         */
        m_bBossAlive: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SpringLoginActRsp {
        /**
         * 累计登录天数
         */
        m_iLoginDay: number;

        /**
         * 礼包领取标志
         */
        m_uiLoginRewardFlag: number;

        /**
         *  配置个数
         */
        m_ucItemCount: number;

        /**
         * 奖励配置列表
         */
        m_stGetCfgList: Array<LoginChargeActCfg_Server>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LoginChargeActCfg_Server {
        /**
         * 0关联页签
         */
        m_ucActType: number;

        /**
         * 0配置ID
         */
        m_iID: number;

        /**
         * 0条件1
         */
        m_iCondition1: number;

        /**
         * 0条件2
         */
        m_iCondition2: number;

        /**
         * 0条件3
         */
        m_iCondition3: number;

        /**
         * 0品数量
         */
        m_iItemCount: number;

        /**
         * 奖励物品个数
         */
        m_stItemList: Array<HJXNCfgItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HJXNCfgItem {
        /**
         * 物品ID
         */
        m_iID: number;

        /**
         * 物品个数
         */
        m_iCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SpringChargeActRsp {
        /**
         * 活动期间累计充值
         */
        m_iChargeValue: number;

        /**
         * 累充礼包领取标志
         */
        m_uiChargeRewardFlag: number;

        /**
         *  配置个数
         */
        m_ucItemCount: number;

        /**
         * 奖励配置列表
         */
        m_stGetCfgList: Array<LoginChargeActCfg_Server>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SJDHActRsp {
        /**
         * 收集兑换记录大小
         */
        m_ucCount: number;

        /**
         * 收集兑换记录大小
         */
        m_stList: Array<number>;

        /**
         * 定制提醒,按位取
         */
        m_uiWarnSelect: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSLXFLInfo {
        /**
         * 当日充值
         */
        m_iDayCharge: number;

        /**
         * 活动第几天 
         */
        m_iDay: number;

        /**
         * 活动剩余时间 
         */
        m_iLeftTime: number;

        /**
         * 累计充值数组长度
         */
        m_ucAccNumber: number;

        /**
         * 累计充值数据列表
         */
        m_stAccList: Array<CSLXFLAccOne>;

        /**
         * 今日充值数组长度
         */
        m_ucDayNumber: number;

        /**
         * 累计充值数据列表
         */
        m_stDayList: Array<CSLXFLDayOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSLXFLAccOne {
        /**
         * 配置ID
         */
        m_ucID: number;

        /**
         * 充值累计天数
         */
        m_ucChargeDays: number;

        /**
         * 领取状态
         */
        m_ucGetStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSLXFLDayOne {
        /**
         * 配置ID
         */
        m_ucID: number;

        /**
         * 领取状态
         */
        m_ucGetStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SDBXActPanelRsp {
        /**
         * 累计购买次数
         */
        m_uiBuyTimes: number;

        /**
         * 当前排名
         */
        m_uiRank: number;

        /**
         * 奖励领取按位存储标志
         */
        m_uiBitFlag: number;

        /**
         * 盛典宝箱购买次数排行
         */
        m_stSDBXRankInfo: DBSDBXRankInfoList;

        /**
         * 奖励配置的个数
         */
        m_ucCount: number;

        /**
         * 配置列表
         */
        m_stSDBXCfgList: Array<SDBXRankConfig_Server>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBSDBXRankInfoList {
        /**
         * 排行榜信息个数
         */
        m_iCount: number;

        /**
         * 排行榜信息
         */
        m_stRankInfoList: Array<SDBXRankInfo>;

        /**
         * 数据有效时间 
         */
        m_uiValidTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SDBXRankInfo {
        /**
         * 玩家购买宝箱数
         */
        m_iCountNum: number;

        /**
         * 角色基本信息
         */
        m_stRoleInfo: RankRoleInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RankRoleInfo {
        
        m_stID: RoleID;

        m_stBaseProfile: BaseProfile;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SDBXRankConfig_Server {
        /**
         * 0配置ID
         */
        m_iID: number;

        /**
         * 0达到的额度
         */
        m_iCondition1: number;

        /**
         * 0达到的额度
         */
        m_iCondition2: number;

        /**
         * 0达成条件
         */
        m_iCondition3: number;

        /**
         * 0品数量
         */
        m_iRewardCount: number;

        /**
         * 0奖励列表
         */
        m_stRewordList: Array<HJXNCfgItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HJXNChargeActRsp {
        /**
         * 活动期间累计充值
         */
        m_iChargeValue: number;

        /**
         * 充值折扣活动奖励领取次数
         */
        m_iGetRewardTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RushPurchasePanel {
        /**
         * 是否在秒杀时间段内 1 秒杀时段
         */
        m_ucOpenStatus: number;

        /**
         * 剩余时间 m_ucOpenStatus = 1 结束时间 m_ucOpenStatus = 0 活动开始时间
         */
        m_uiLeafTime: number;

        /**
         * 限时秒杀个数
         */
        m_ucCount: number;

        /**
         * 限时秒杀列表
         */
        m_stRushPurchaseList: Array<RushPurchaseItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RushPurchaseItem {
        /**
         * ID
         */
        m_uiID: number;

        /**
         * 物品ID
         */
        m_uiItemID: number;

        /**
         * 物品剩余数量
         */
        m_ucTotalCount: number;

        /**
         * 物品限购数量
         */
        m_ucLimitCount: number;

        /**
         * 原价
         */
        m_uiShowPrice: number;

        /**
         * 现价
         */
        m_uiPrice: number;

        /**
         * 是否可购买
         */
        m_ucStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RushPurchaseBuyRsp {
        /**
         * ID
         */
        m_uiID: number;

        /**
         * 物品ID
         */
        m_uiItemID: number;

        /**
         * 是否购买成功
         */
        m_ucBuyStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ForestBossActOpenRsp {
        /**
         * 采集物数量
         */
        m_iCollectNumber: number;

        /**
         * 低阶魂兽
         */
        m_iBoss1Number: number;

        /**
         * 中高阶魂兽
         */
        m_iBoss2Number: number;

        /**
         * 杀怪数量
         */
        m_iKillMonsterNumber: number;

        /**
         * 杀Boss数量
         */
        m_iKillBossNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSAct124Info {
        /**
         * 列表长度
         */
        m_ucListCnt: number;

        /**
         * 数据列表
         */
        m_stList: Array<CSAct124One>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSAct124One {
        /**
         * 配置
         */
        m_stCfg: Act124Cfg_Server;

        /**
         * 达成次数
         */
        m_ucDoneCnt: number;

        /**
         * 奖励次数
         */
        m_ucRewardCnt: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Act124Cfg_Server {
        /**
         * 0唯一配置ID
         */
        m_iID: number;

        /**
         * 0奖励是否每天刷新
         */
        m_ucDayReflash: number;

        /**
         * 0是否开服
         */
        m_ucKaiFu: number;

        /**
         * 0活动第几天
         */
        m_ucDay: number;

        /**
         * 0最高领取次数
         */
        m_ucMax: number;

        /**
         * 0充值额度
         */
        m_uiCondition: number;

        /**
         * 物品总数
         */
        m_iItemCount: number;

        /**
         * 奖励物品个数
         */
        m_stItemList: Array<Act124CfgItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Act124CfgItem {
        /**
         * 物品ID
         */
        m_iID: number;

        /**
         * 物品个数
         */
        m_iCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSAct125Info {
        /**
         * 累计充值
         */
        m_uiChargeValue: number;

        /**
         * 列表长度
         */
        m_ucListCnt: number;

        /**
         * 数据列表
         */
        m_stList: Array<CSAct125One>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSAct125One {
        /**
         * 配置
         */
        m_stCfg: Act125Cfg_Server;

        /**
         * 奖励次数
         */
        m_ucRewardCnt: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Act125Cfg_Server {
        /**
         * 0唯一配置ID
         */
        m_iID: number;

        /**
         * 0奖励是否每天刷新
         */
        m_ucDayReflash: number;

        /**
         * 0是否开服
         */
        m_ucKaiFu: number;

        /**
         * 0活动第几天
         */
        m_ucDay: number;

        /**
         * 0最高领取次数
         */
        m_ucMax: number;

        /**
         * 0充值额度
         */
        m_uiCondition: number;

        /**
         * 物品总数
         */
        m_iItemCount: number;

        /**
         * 奖励物品个数
         */
        m_stItemList: Array<Act125CfgItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Act125CfgItem {
        /**
         * 物品ID
         */
        m_iID: number;

        /**
         * 物品个数
         */
        m_iCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSAct63Panel {
        /**
         * 商店ID
         */
        m_iStoreID: number;

        /**
         * 下次刷新时间
         */
        m_uiNextRefreshTime: number;

        /**
         * 已刷新次数
         */
        m_iRefreshTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSAct126Panel {
        /**
         * 总消费
         */
        m_uiConsume: number;

        /**
         * 参与奖励是否领取
         */
        m_ucRewardGet: number;

        /**
         * 剩余时间
         */
        m_uiEndTime: number;

        /**
         * 是否上榜
         */
        m_uiMyRank: number;

        /**
         * 于前一名差距
         */
        m_uiDisPre: number;

        /**
         * 排名个数
         */
        m_ucRankCount: number;

        /**
         * 排名个数
         */
        m_stRankList: Array<ConsumeActRankInfo>;

        /**
         * 配置个数
         */
        m_iCfgCount: number;

        /**
         * 配置
         */
        m_stCfgList: Array<Act126Cfg_Server>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ConsumeActRankInfo {
        /**
         * 角色Uin
         */
        m_uiUin: number;

        /**
         * 角色Seq
         */
        m_uiSeq: number;

        /**
         * 角色名字
         */
        m_szName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Act126Cfg_Server {
        /**
         * 0唯一配置ID
         */
        m_iID: number;

        /**
         * 0条件1
         */
        m_iCondition1: number;

        /**
         * 0条件2
         */
        m_iCondition2: number;

        /**
         * 0条件3
         */
        m_iCondition3: number;

        /**
         * 0物品总数
         */
        m_iItemCount: number;

        /**
         * 物品列表
         */
        m_stItemList: Array<ZZZDCfgItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Dress_Request {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: DressRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DressRequestValue {
        /**
         * 时装升级请求，不用赋值，默认0
         */
        m_ucLevelType: number;

        /**
         * 时装已获取形象列表, 占位！
         */
        m_ucImageList: number;

        /**
         * 时装形象设置, 形象信息
         */
        m_stChangeReq: DressImageInfo;

        /**
         * 是否隐藏形象,0为显示、1隐藏
         */
        m_bIsHide: number;

        /**
         * 幻化形象培养(包括祝福系统)
         */
        m_stTrainReq: Dress_Train_Request;

        /**
         * 时装强化, 强化的时装形象id
         */
        m_uiStrengID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DressImageInfo {
        /**
         * 形象ID
         */
        m_uiImageID: number;

        /**
         * 颜色索引
         */
        m_ucColorIndex: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Dress_Train_Request {
        /**
         * 形象类型，1-祝福系统，2-时装
         */
        m_ucType: number;

        /**
         * 祝福系统子类型
         */
        m_ucSubType: number;

        /**
         * 形象ID
         */
        m_uiImageID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Dress_Response {
        /**
         * 请求操作协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: DressResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DressResponseValue {
        /**
         * 时装升级后的等级
         */
        m_stUpLevelRsp: DressUpLevelRsp;

        /**
         * 时装已获取形象列表
         */
        m_stImageList: DressImageListInfo;

        /**
         * 时装形象设置 形象信息
         */
        m_stChangeRsp: DressImageInfo;

        /**
         * 是否隐藏形象,0为显示、1隐藏
         */
        m_bIsHide: number;

        /**
         * 幻化形象培养(包括祝福系统)
         */
        m_stTrainRsp: DressTrainRsp;

        /**
         * 时装强化, 强化后的时装信息
         */
        m_stStrengRsp: DressOneImageInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DressUpLevelRsp {
        /**
         * 当前等级 0 无效
         */
        m_uiLevel: number;

        /**
         * 当前时装经验
         */
        m_uiExp: number;

        /**
         * 时装等级变化量 
         */
        m_ucChangeLevel: number;

        /**
         * 时装经验变化量
         */
        m_uiChangeExp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DressTrainRsp {
        /**
         * 形象类型，1-祝福系统，2-时装
         */
        m_ucType: number;

        /**
         * 祝福系统子类型
         */
        m_ucSubType: number;

        /**
         * 形象ID
         */
        m_uiImageID: number;

        /**
         * 幻化形象已叠加次数
         */
        m_uiAddNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EnableWayPoint_Notify {
        
        m_uiSceneID: number;

        m_iTransportPointID: number;

        /**
         * 开启或关闭,1是开启，0是关闭
         */
        m_ucEnable: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EnterRegion_Request {
        
        m_stRoleID: RoleID;

        /**
         * 场景ID
         */
        m_iSceneID: number;

        /**
         * 区域ID
         */
        m_iRegionID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipProp_Request {
        /**
         * 装备协议类型
         */
        m_usType: number;

        /**
         * 装备部位
         */
        m_ucEquipPart: number;

        /**
         * 待操作的容器
         */
        m_stContainerID: ContainerID;

        /**
         * 协议体
         */
        m_stValue: EquipPorpRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipPorpRequestValue {
        /**
         * 装备升阶,本字段不用填写
         */
        m_ucEquipUpColorPart: number;

        /**
         * 装备强化,本字段不用填写
         */
        m_ucEquipStrengReq: number;

        /**
         * 宝石镶嵌
         */
        m_stDiamondMount: DiamondMountReq;

        /**
         * 宝石摘除,摘除的位置 [1-6]
         */
        m_ucDiamondUnMountPos: number;

        /**
         * 宝石升级
         */
        m_stDiamondUpLevel: DiamondUpLevelReq;

        /**
         * 装备熔炼，待熔炼装备在背包汇总的信息
         */
        m_stMeltList: ContainerThingList;

        /**
         * 装备洗炼,请求洗炼的次数，1，10
         */
        m_ucEquipWash: number;

        /**
         * 装备洗炼结果保存的位置
         */
        m_ucEquipWashResultPos: number;

        /**
         * 装备洗炼,洗炼属性的锁定信息变更, 按位表达，0未锁定，1锁定
         */
        m_ucWashLockReq: number;

        /**
         * 装备钻石洗炼,请求洗炼的次数，1，10
         */
        m_ucDiamondWashCnt: number;

        /**
         * 装备洗炼,元宝开启洗炼条，默认0
         */
        m_ucWashBuy: number;

        /**
         * 装备炼器升级
         */
        m_stLQReq: LQReq;

        /**
         * 装备位升级,本字段不用填写
         */
        m_ucEquipSlotUpLv: number;

        /**
         * 装备位一键升级,本字段不用填写
         */
        m_ucEquipSlotOneUpLv: number;

        /**
         * 装备套装激活
         */
        m_stSuitAct: EquipSuitAct;

        /**
         * 装备位套装激活,不用填
         */
        m_ucSlotSuitAct: number;

        /**
         * 装备位套装升级,升级的套装类型
         */
        m_ucSlotSuitUpType: number;

        /**
         * 装备位炼体升级,消耗类型，1铜钱，2绑元，3道具
         */
        m_ucSlotLianTiUp: number;

        /**
         * 装备位炼体激活神宝，激活的位置，1开始
         */
        m_ucSlotLTSBAct: number;

        /**
         * 魂骨封装,本字段不用填写
         */
        m_ucHunGuFZ: number;

        /**
         * 魂骨装备位升级,本字段不用填写
         */
        m_ucHunGuSlotUpLv: number;

        /**
         * 魂骨装备位一键升级,本字段不用填写
         */
        m_ucHunGuSlotOneUpLv: number;

        /**
         * 魂骨装备强化,本字段不用填写
         */
        m_ucHunGuStrengReq: number;

        /**
         * 魂骨位洗炼,请求洗炼的次数，1，10
         */
        m_ucHunGuSlotWash: number;

        /**
         * 魂骨位洗炼结果保存的位置
         */
        m_ucHunGuSlotWashResultPos: number;

        /**
         * 魂骨位洗炼,洗炼属性的锁定信息变更, 按位表达，0未锁定，1锁定
         */
        m_ucHunGuSlotWashLockReq: number;

        /**
         * 魂骨位洗炼,元宝开启洗炼条，默认0
         */
        m_ucHunGuSlotWashBuy: number;

        /**
         * 魂骨技能封装,本字段需要物品ID
         */
        m_iHunGuSkillFZ: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DiamondMountReq {
        /**
         * 宝石的ID
         */
        m_iDiamondID: number;

        /**
         * 宝石镶嵌的位置 [1-6]
         */
        m_ucHolePos: number;

        /**
         * 物品所在背包的位置
         */
        m_usPosition: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DiamondUpLevelReq {
        /**
         * 宝石镶嵌的位置 [1-6]
         */
        m_ucHolePos: number;

        /**
         * 升级消耗源物品列表
         */
        m_stSrcThingList: ContainerThingList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LQReq {
        /**
         * 增加概率的道具ID
         */
        m_iItemID: number;

        /**
         * 是否使用保护道具
         */
        m_ucProtect: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipSuitAct {
        /**
         * 需激活的套装阶级
         */
        m_ucStage: number;

        /**
         * 需激活的数量
         */
        m_ucNum: number;

        /**
         * 是否激活时装，0否，1是。激活时装仅是时装激活，不会同时激活套装
         */
        m_ucActDress: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipProp_Response {
        /**
         * 装备协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 装备部位
         */
        m_ucEquipPart: number;

        /**
         * 待操作的容器
         */
        m_stContainerID: ContainerID;

        /**
         * 协议体
         */
        m_stValue: EquipPorpResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipPorpResponseValue {
        /**
         * 装备升阶后的装备ID
         */
        m_iEquipUpgradeColorID: number;

        /**
         * 装备强化
         */
        m_stEquipStreng: EquipStrengRsp;

        /**
         * 宝石镶嵌
         */
        m_stDiamondMount: EquipDiamondInfo;

        /**
         * 位置前台不用 直接给个宝石总等级前台用
         */
        m_iDiaMondTotalLevel: number;

        /**
         * 宝石升级
         */
        m_stDiamondUpLevel: EquipDiamondInfo;

        /**
         * 物品熔炼
         */
        m_ucMeltRsp: number;

        /**
         * 装备洗炼
         */
        m_stEquipWash: EquipWashRsp;

        /**
         * 装备洗炼结果保存, 最大6个属性
         */
        m_aszEquipWashValue: Array<EquipWashPropCfg>;

        /**
         * 装备洗炼响应,装备洗炼,洗炼属性的锁定信息变更响应, 按位表达，0未锁定，1锁定
         */
        m_ucWashLockRsp: number;

        /**
         * 装备钻石洗炼
         */
        m_stDiamondWash: EquipWashRsp;

        /**
         * 装备洗炼,元宝开启洗炼条，当前已开启多少条
         */
        m_ucWashBuy: number;

        /**
         * 装备炼器
         */
        m_stEquipLQ: EquipLQRsp;

        /**
         * 装备位升级, 该装备位当前等级
         */
        m_iEquipSlotUpLv: number;

        /**
         * 装备位一键升级, 所有装备位信息
         */
        m_stEquipSlotInfoList: EquipSlotInfoList;

        /**
         * 装备套装激活
         */
        m_stSuitAct: EquipSuitAct;

        /**
         * 装备位套装激活,不用填
         */
        m_ucSlotSuitAct: number;

        /**
         * 装备位套装升级,升级的套装类型
         */
        m_stSlotSuitUpRsp: EquipSlotSuitUpRsp;

        /**
         * 装备位炼体升级
         */
        m_stSlotLianTiUpRsp: EquipSlotLTUpRsp;

        /**
         * 装备位炼体激活神宝
         */
        m_stSlotLTSBActRsp: EquipSlotLTSBActRsp;

        /**
         * 魂骨封装 1 封装成功，0封装失败
         */
        m_iHunGuFZLevel: number;

        /**
         * 魂骨装备位升级, 该装备位当前等级
         */
        m_iHunGuSlotUpLv: number;

        /**
         * 魂骨装备位一键升级, 所有装备位信息
         */
        m_stHunGuSlotInfoList: HunGuEquipSlotInfoList;

        /**
         * 魂骨装备强化
         */
        m_stHunGuStreng: HunGuStrengRsp;

        /**
         * 魂骨位洗炼
         */
        m_stHunGuSlotWash: HunGuSlotWashRsp;

        /**
         * 魂骨位洗炼结果保存的位置
         */
        m_ucHunGuSlotWashResult: Array<SlotWashPropCfg>;

        /**
         * 魂骨位洗炼,洗炼属性的锁定信息变更, 按位表达，0未锁定，1锁定
         */
        m_ucHunGuSlotWashLockRsp: number;

        /**
         * 魂骨位洗炼,元宝开启洗炼条，当前已开启多少条
         */
        m_ucHunGuSlotWashBuy: number;

        /**
         * 魂骨技能封装回复
         */
        m_stHunGuSkillFZRsp: HunGuSkillFZRsp;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipStrengRsp {
        /**
         * 强化的等级变化量，0表示没升级，1 表示升级
         */
        m_ucEquipStrengLevelChange: number;

        /**
         * 强化的进度变化量，10表示强化进度10个点
         */
        m_cEquipStrengProgressChange: number;

        /**
         * 装备强化位等级
         */
        m_usStrengthenLv: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipDiamondInfo {
        /**
         * 镶嵌的宝石id
         */
        m_iDiamondID: number;

        /**
         * 镶嵌的宝石位置 [1-6]
         */
        m_ucDiamondPos: number;

        /**
         * 宝石升级进度
         */
        m_uiProcess: number;

        /**
         * 宝石镶总等级
         */
        m_iTotalLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipWashRsp {
        /**
         * 洗炼次数，1，10
         */
        m_ucWashCnt: number;

        /**
         * 保存的洗炼结果的位置，单次洗练，保存位置是0；批量洗炼，保存最优位置[0-9]
         */
        m_ucEquipWashSavedPos: number;

        /**
         * 返回随机出来的数据,最大10条
         */
        m_astEquipPropArry: Array<EquipWashPropCfgList>;

        /**
         * 洗炼阶级
         */
        m_stStageInfo: EquipWashStage;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipWashPropCfgList {
        /**
         * 数组最大值6，数值0，表示无效
         */
        m_aszPropCfg: Array<EquipWashPropCfg>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipLQRsp {
        /**
         * 是否升级，0表示没升级，1 表示升级
         */
        m_ucUpLevel: number;

        /**
         * 当前装备炼器等级
         */
        m_ucLQLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipSlotSuitUpRsp {
        /**
         * 套装类型
         */
        m_ucType: number;

        /**
         * 套装等级
         */
        m_ucLv: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipSlotLTUpRsp {
        /**
         * 消耗类型，1铜钱，2绑元，3道具
         */
        m_ucType: number;

        /**
         * 此消耗类型已消耗次数
         */
        m_ucHaveNum: number;

        /**
         * 当前炼体等级
         */
        m_ucLv: number;

        /**
         * 进度
         */
        m_uiLuck: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EquipSlotLTSBActRsp {
        /**
         * 炼体神宝激活部位
         */
        m_ucPos: number;

        /**
         * 炼体神宝当前数量
         */
        m_ucNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuStrengRsp {
        /**
         * 强化的等级变化量，0表示没升级，1 表示升级
         */
        m_ucHunGuStrengLevelChange: number;

        /**
         * 强化的进度变化量，10表示强化进度10个点
         */
        m_cHunGuStrengProgressChange: number;

        /**
         * 装备强化位等级
         */
        m_usStrengthenLv: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuSlotWashRsp {
        /**
         * 洗炼次数，1，10
         */
        m_ucWashCnt: number;

        /**
         * 保存的洗炼结果的位置，单次洗练，保存位置是0；批量洗炼，保存最优位置[0-9]
         */
        m_ucWashSavedPos: number;

        /**
         * 返回随机出来的数据,最大10条
         */
        m_astWashPropArry: Array<SlotWashPropCfgList>;

        /**
         * 洗炼阶级
         */
        m_stStageInfo: SlotWashStage;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SlotWashPropCfgList {
        /**
         * 数组最大值6，数值0，表示无效
         */
        m_aszPropCfg: Array<SlotWashPropCfg>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuSkillFZRsp {
        /**
         * 材料ID
         */
        m_iItemID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaBaoActive_Request {
        /**
         * 法宝ID
         */
        m_iID: number;

        /**
         * 材料位置 0--(FABAO_ACCESS_ITEM_COUNT-1) -1--激活法宝
         */
        m_iXQPos: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaBaoActive_Response {
        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 法宝ID
         */
        m_iID: number;

        /**
         * 携带的法宝ID
         */
        m_iShowID: number;

        /**
         * 法宝数据
         */
        m_stFaBao: CSFaBaoInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSFaBaoInfo {
        /**
         * 法宝ID
         */
        m_ucID: number;

        /**
         * 等级
         */
        m_usLevel: number;

        /**
         * 镶嵌个数
         */
        m_ucXQCnt: number;

        /**
         * 镶嵌列表
         */
        m_aiXQID: Array<number>;

        /**
         * 是否已激活
         */
        m_ucHaveActive: number;

        /**
         * 材料种类
         */
        m_ucAccessCount: number;

        /**
         * 激活材料列表
         */
        m_aiActiveConsume: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaBaoLevelUp_Request {
        /**
         * 法宝ID
         */
        m_iID: number;

        /**
         * 是否一键升级
         */
        m_bOneKey: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaBaoLevelUp_Response {
        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 法宝ID
         */
        m_iID: number;

        /**
         * 法宝数据
         */
        m_stFaBao: CSFaBaoInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaBaoPannel_Request {
        /**
         * 占位
         */
        m_ucTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaBaoPannel_Response {
        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 法宝数据
         */
        m_stFaBaoList: CSFaBaoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSFaBaoList {
        /**
         * Avatar显示法宝ID
         */
        m_ucShowID: number;

        /**
         * 法宝个数
         */
        m_ucNumber: number;

        m_astFaBaoList: Array<CSFaBaoInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaBaoShow_Request {
        /**
         * 法宝ID
         */
        m_iID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaBaoShow_Response {
        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 携带的法宝ID
         */
        m_iShowID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaBaoXiangQian_Request {
        /**
         * 法宝ID
         */
        m_iID: number;

        /**
         * 镶嵌位置 0--(FABAO_XIANGQIAN_COUNT-1) -1--全部镶嵌
         */
        m_iXQPos: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaBaoXiangQian_Response {
        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 法宝ID
         */
        m_iID: number;

        /**
         * 镶嵌位置 0--(FABAO_XIANGQIAN_COUNT-1) -1--全部镶嵌
         */
        m_iXQPos: number;

        /**
         * 法宝数据
         */
        m_stFaBao: CSFaBaoInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaQiList_Notify {
        /**
         * 法器列表数据
         */
        m_stFaQiList: FaQiInfoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaQiInfoList {
        /**
         * 个数
         */
        m_ucNumber: number;

        m_astFaQiList: Array<FaQiInfo>;

        /**
         * 法器当前外置id
         */
        m_iShowID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaQiInfo {
        /**
         * 法器配置ID
         */
        m_iID: number;

        /**
         * 等阶
         */
        m_ucLayer: number;

        /**
         * 祝福值
         */
        m_uiWish: number;

        /**
         * 衰减的祝福值
         */
        m_uiSaveWish: number;

        /**
         * 清空时间
         */
        m_uiTimeOut: number;

        /**
         * 状态, 共用成就的 GOD_LOAD_AWARD_CANT_GET  GOD_LOAD_AWARD_WAIT_GET  GOD_LOAD_AWARD_DONE_GET
         */
        m_ucStatus: number;

        /**
         * 完成度，只有在未完成时候带这个值
         */
        m_uiDoneCount: number;

        /**
         * 注魂信息
         */
        m_stZhuHunInfo: FaQiZhuHunInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaQiZhuHunInfo {
        /**
         * 注魂等级
         */
        m_uiLevel: number;

        /**
         * 祝福值
         */
        m_uiWish: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaQiOperate_Request {
        /**
         * 操作类型，FAQI_OP_ACT/FAQI_OP_UPLEVEL/FAQI_OP_ZHUHUN
         */
        m_iType: number;

        /**
         * 法器ID
         */
        m_iID: number;

        /**
         * 参数
         */
        m_uiParam: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaQiOperate_Response {
        /**
         * 操作类型，FAQI_OP_ACT/FAQI_OP_UPLEVEL/FAQI_OP_ZHUHUN
         */
        m_iType: number;

        /**
         * 错误码 0 成功
         */
        m_iResult: number;

        /**
         * 法器信息
         */
        m_stFaQiInfo: FaQiInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaZe_Request {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: FaZeRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaZeRequestValue {
        /**
         * 打开法则面板，占位
         */
        m_ucOpenPanel: number;

        /**
         * 法则升级，法则类型
         */
        m_uiValueID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaZe_Response {
        /**
         * 请求操作协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: FaZeResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaZeResponseValue {
        /**
         * 打开面板响应
         */
        m_stOpenPanelRsp: FaZeInfo;

        /**
         * 升级法则等级
         */
        m_ucFazeLevelUpRsp: FaZeOneData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaZhen_PartActive_Notify {
        /**
         * 法阵部位激活通知
         */
        m_stPartActiveNotify: FaZhenListInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaZhenListInfo {
        /**
         * 佩戴法阵的ID，0表示未佩戴任何法阵
         */
        m_ucID: number;

        /**
         * 法阵的个数
         */
        m_ucNumber: number;

        m_astFaZhenList: Array<FaZhenOneInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaZhenOneInfo {
        /**
         * 法阵ID
         */
        m_uiID: number;

        /**
         * 法阵是否已经激活
         */
        m_ucIsActive: number;

        /**
         * 法阵部位的个数
         */
        m_ucNumber: number;

        /**
         * 法阵部位激活列表，1表示激活，0表示未激活
         */
        m_ucPartList: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaZhen_Request {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: FaZhenRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaZhenRequestValue {
        /**
         * 打开法阵面板，占位
         */
        m_ucOpenPanel: number;

        /**
         * 法阵激活，法阵ID
         */
        m_uiActiveID: number;

        /**
         * 法阵幻化，法阵ID
         */
        m_uiImageID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaZhen_Response {
        /**
         * 请求操作协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: FaZhenResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FaZhenResponseValue {
        /**
         * 打开面板响应
         */
        m_stOpenPanelRsp: FaZhenListInfo;

        /**
         * 法阵激活响应
         */
        m_stFaZhenActiveRsp: FaZhenListInfo;

        /**
         * 法阵幻化响应
         */
        m_stFaZhenImageRsp: FaZhenListInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FirstOpen_Notify {
        /**
         * 记录玩家是否已经领过某礼包，按位记录，FST_OPEN 宏
         */
        m_uiFristOpenFunc: number;

        /**
         * 记录玩家是否有资格领取某礼包，按位记录，OSS_WAIT 和上面宏有可能不一致
         */
        m_uiCanOpenTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FirstOpen_Request {
        /**
         * 对应 FST_OPEN 宏
         */
        m_uiFristOpenFunc: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FirstOpen_Response {
        /**
         * 0成功，其它错误码
         */
        m_iResult: number;

        /**
         * 记录玩家是否已经领过某礼包，按位记录，FST_OPEN 宏
         */
        m_uiFristOpenFunc: number;

        /**
         * 记录玩家是否有资格领取某礼包，按位记录，OSS_WAIT 和上面宏有可能不一致
         */
        m_uiCanOpenTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_Add_Request {
        /**
         * 发起添加好友请求的角色ID
         */
        m_stOperatorRoleID: RoleID;

        /**
         * 被添加为好友的角色ID
         */
        m_stTargetRoleID: RoleID;

        /**
         * 被添加为好友的角色昵称
         */
        m_szNickName: string;

        /**
         * 0加好友,1加黑名单,2加宿敌
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_Add_Response {
        /**
         * 请求消息处理结果
         */
        m_ushResultID: number;

        /**
         * 发起添加好友请求的角色ID
         */
        m_stOperatorRoleID: RoleID;

        /**
         * 被添加的好友信息
         */
        m_stGameFriendInfo: GameFriendInfo;

        /**
         * 0加好友,1加黑名单,2加宿敌
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GameFriendInfo {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        m_szNickName: string;

        /**
         * 职业
         */
        m_cProfession: number;

        /**
         * 性别
         */
        m_cGender: number;

        /**
         * 0表示好友不在线，其他表示在线
         */
        m_cZoneID: number;

        /**
         * 亲密度
         */
        m_shAffinity: number;

        /**
         * 加好友的时间，unix时间，单位：秒
         */
        m_uiTime: number;

        /**
         * 所在场景类型
         */
        m_ucSceneType: number;

        /**
         * 基友类型
         */
        m_ucFriendType: number;

        /**
         * 好友战斗力
         */
        m_iBattleEffect: number;

        /**
         * 好友等级
         */
        m_usLevel: number;

        /**
         * 杀这个人次数
         */
        m_ucKillNum: number;

        /**
         * 被这个人杀的次数
         */
        m_ucBeKillNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_Apply_Request {
        /**
         * 发起申请好友请求的角色ID
         */
        m_stOperatorRoleID: RoleID;

        /**
         * 被申请添加为好友的角色ID
         */
        m_stTargetRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_Apply_Response {
        /**
         * 请求消息处理结果
         */
        m_ushResultID: number;

        /**
         * 发起添加好友请求的角色ID
         */
        m_stOperatorRoleID: RoleID;

        /**
         * 被申请添加为好友的角色ID
         */
        m_stTargetRoleID: RoleID;

        /**
         * 申请者的角色信息
         */
        m_stBaseProfile: BaseProfile;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_Contact_Request {
        /**
         * 发起请求的角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 最近联系人列表
         */
        m_stContactList: ContactList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContactList {
        /**
         * 最近联系人中的人数
         */
        m_ushNumber: number;

        /**
         * 最近联系人列表
         */
        m_astContactInfo: Array<ContactInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContactInfo {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        m_szNickName: string;

        /**
         * =0表不在线，其他表示在线
         */
        m_cOnline: number;

        /**
         * 职业
         */
        m_cProfession: number;

        /**
         * 性别
         */
        m_cGender: number;

        /**
         * 级别
         */
        m_shLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_Contact_Response {
        /**
         * 请求消息处理结果
         */
        m_ushResultID: number;

        /**
         * 发起请求的角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 最近联系人列表
         */
        m_stContactList: ContactList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_Delete_Request {
        /**
         * 发起删除好友请求的角色ID
         */
        m_stOperatorRoleID: RoleID;

        /**
         * 被删除的好友的角色ID
         */
        m_stTargetRoleID: RoleID;

        /**
         * 0加好友,1加黑名单,2加宿敌
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_Delete_Response {
        /**
         * 请求消息处理结果
         */
        m_ushResultID: number;

        /**
         * 发起删除好友请求的角色ID
         */
        m_stOperatorRoleID: RoleID;

        /**
         * 被删除的好友的角色ID
         */
        m_stTargetRoleID: RoleID;

        /**
         * 0加好友,1加黑名单,2加宿敌
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_FetchGameFriend_Request {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * flag=1表示由服务器拉?菘獾幕捍妫?0表示来自客户端的请求
         */
        m_cFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_FetchGameFriend_Response {
        /**
         * 请求消息处理结果
         */
        m_ushResultID: number;

        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 与请求中的一致，回传字段
         */
        m_cFlag: number;

        /**
         * 游戏好友列表
         */
        m_stGameFriendList: GameFriendList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GameFriendList {
        /**
         * 游戏好友数目
         */
        m_ushNumber: number;

        /**
         * 游戏好友列表
         */
        m_astGameFriend: Array<GameFriendInfo>;

        /**
         * 游戏宿敌列表数目
         */
        m_ucEnemyNumber: number;

        /**
         * 游戏宿敌列表
         */
        m_astGameEnemy: Array<GameFriendInfo>;

        /**
         * 游戏黑名单列表数目
         */
        m_ucBlackNumber: number;

        /**
         * 游戏黑名单列表
         */
        m_astGameBlack: Array<GameFriendInfo>;

        /**
         * 拉黑的记录
         */
        m_stFriendBlack: FriendBlackInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FriendBlackInfo {
        /**
         * 被拉黑次数
         */
        m_ucBlackTimes: number;

        /**
         * 拉黑次数
         */
        m_ucBeBlackTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_LogInOut_Notify {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        m_szNickName: string;

        /**
         * 职业
         */
        m_cProfession: number;

        /**
         * 级别
         */
        m_shLevel: number;

        /**
         * 1=login, 2=logout
         */
        m_cAction: number;

        /**
         * 登录的zone id
         */
        m_cZoneID: number;

        /**
         * 角色状态信息
         */
        m_uiUnitStatus: number;

        /**
         * 下线角色的好友, 服务器使用
         */
        m_stFriendID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_PetInfo_Request {
        /**
         * 目标ID
         */
        m_stTargetRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_PetInfo_Response {
        /**
         * 结果码
         */
        m_iResultID: number;

        /**
         * 目标ID
         */
        m_stTargetRoleID: RoleID;

        /**
         * 目标名字
         */
        m_szTargetName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_RoleInfo_Request {
        /**
         * 发起请求的角色ID
         */
        m_stOperatorRoleID: RoleID;

        /**
         * 被拉取信息的好友的角色ID
         */
        m_stTargetRoleID: RoleID;

        /**
         * 透传前台字段
         */
        m_ucTransData: number;

        /**
         * 大区ID，如果传了表示查别的服的玩家信息
         */
        m_usWorldID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_RoleInfo_Response {
        /**
         * 请求消息处理结果
         */
        m_ushResultID: number;

        /**
         * 角色缓存数据
         */
        m_stCacheRoleInfo: CacheRoleInfo;

        /**
         * 透传前台字段
         */
        m_ucTransData: number;

        /**
         * 目标所在大区ID
         */
        m_usWorldID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_Search_Request {
        /**
         * 发起查找请求的角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 要查找的角色昵称关键字
         */
        m_szNickName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Friend_Search_Response {
        /**
         * 请求消息处理结果
         */
        m_ushResultID: number;

        /**
         * 发起查找请求的角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 要查找的角色昵称关键字
         */
        m_szNickName: string;

        /**
         * 查找列表
         */
        m_stGameFriendList: GameFriendList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FunctionAct_Request {
        /**
         * 使用的激活卡id
         */
        m_uiThingID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FunctionAct_Response {
        /**
         * 激活结果
         */
        m_uiResult: number;

        /**
         * 需要激活的功能，为0的时候，表示后台主动推送的
         */
        m_uiFunctionID: number;

        /**
         * 已激活功能的列表
         */
        m_stActList: FunctionActList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GameMaster_Notify {
        /**
         * 消息类型，如家园、队伍、全服
         */
        m_cSystemMessageType: number;

        m_szSystemMessage: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GameMaster_Request {
        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        m_cCommandType: number;

        m_szCommand: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GameMaster_Response {
        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        m_ushResultID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GetDroppedThing_Request {
        /**
         * 物品的unitID
         */
        m_iUnitID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GetDroppedThing_Response {
        
        m_ushResultID: number;

        /**
         * 物品的unitID
         */
        m_iUnitID: number;

        /**
         * 玩家当前的坐标
         */
        m_stRolePos: UnitPosition;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GetLevelBag_Request {
        /**
         * 玩家领哪个等级的礼包
         */
        m_usLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GetLevelBag_Response {
        /**
         * 响应结果，0 表成功
         */
        m_ucResultID: number;

        /**
         * 玩家最后领的是哪个等级
         */
        m_usLevelBag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GetNpcPostionList_Request {
        /**
         * 占位，不需初始化
         */
        m_ucPlace: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GetNpcPostionList_Response {
        /**
         * 结果
         */
        m_iResult: number;

        /**
         * 位置数量
         */
        m_ucNumber: number;

        m_astPosition: Array<UnitPosition>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GetPlayerPosRequest {
        /**
         * 玩家ID
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GetPlayerPosResponse {
        /**
         * 玩家ID
         */
        m_stRoleID: RoleID;

        /**
         * 名字
         */
        m_szRoleName: string;

        /**
         * 当前在哪条线 -1表示不在线
         */
        m_cLine: number;

        /**
         * 宏:IS_IN_SCENE,IS_IN_PINISTANCE
         */
        m_ucType: number;

        /**
         * 场景ID或副本ID
         */
        m_iID: number;

        /**
         * 性别
         */
        m_ucGender: number;

        /**
         * 职业
         */
        m_ucProf: number;

        /**
         * 国家
         */
        m_ucCountry: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GetThingProperty_Request {
        /**
         * 物品归属玩家ID
         */
        m_stRoleID: RoleID;

        /**
         * 物品GUID
         */
        m_stThingGUID: ThingGUID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GetThingProperty_Response {
        /**
         * 物品归属玩家ID
         */
        m_stRoleID: RoleID;

        /**
         * 物品ID
         */
        m_iThingID: number;

        /**
         * 物品属性
         */
        m_stThingProperty: ThingProperty;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GroupBuy_Request {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: GroupBuyReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GroupBuyReqValue {
        /**
         * 查询团购信息,本字段不用填写
         */
        m_ucListReq: number;

        /**
         * 购买团购物品
         */
        m_stBuyReq: GroupBuyBuyReq;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GroupBuyBuyReq {
        /**
         * 物品id
         */
        m_uiThingID: number;

        /**
         * 购买的组数，一组可能是大于1的数量
         */
        m_uiThingNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GroupBuy_Response {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: GroupBuyRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GroupBuyRspValue {
        /**
         * 查询团购信息响应
         */
        m_stListRsp: GroupBuyListRsp;

        /**
         * 查询团购信息响应
         */
        m_stBuyRsp: GroupBuySellThingInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GroupBuyListRsp {
        /**
         * 当前的团购期数
         */
        m_ucBuyIndex: number;

        /**
         * 已开服天数
         */
        m_uiStartDays: number;

        /**
         * 物品种类数量
         */
        m_ucThingTypeNum: number;

        /**
         * 当期团购售卖给此玩家的信息
         */
        m_stSellThingInfo: Array<GroupBuySellThingInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GroupBuySellThingInfo {
        /**
         * 物品id
         */
        m_uiThingID: number;

        /**
         * 总卖出数量
         */
        m_uiTotalSellNum: number;

        /**
         * 当天已卖给此玩家数量
         */
        m_uiDayBuyNum: number;

        /**
         * 总共已卖给此玩家数量
         */
        m_uiTotalBuyNum: number;

        /**
         * 玩家累计在此物品上能获得的返利
         */
        m_uiRebate: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuajiNormal_Notify {
        /**
         * 角色离线挂机数据
         */
        m_stCSOffGuajiInfo: CSOffGuajiInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSOffGuajiInfo {
        /**
         * 可用时间
         */
        m_iEnableTime: number;

        /**
         * 使用时间 0表示上次下线没有挂机
         */
        m_iUseTime: number;

        /**
         * 等级提升
         */
        m_iLevelGet: number;

        /**
         * 经验获得
         */
        m_iExpGet: number;

        /**
         * 装备统计数
         */
        m_ucEquipCount: number;

        /**
         * 装备统计
         */
        m_stEquipStat: Array<CSGuajiEquipStat>;

        /**
         * 分解物统计数
         */
        m_ucMetlCount: number;

        /**
         * 分解物
         */
        m_stMetlStat: Array<CSGuajiEquipStat>;

        /**
         * 铜墙获得
         */
        m_iTongqianGet: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSGuajiEquipStat {
        /**
         * 颜色
         */
        m_ucColor: number;

        /**
         * 个数
         */
        m_iCount: number;

        /**
         * 道具ID
         */
        m_iItemID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildPVPRank_Request {
        /**
         * 排行榜类型 占位
         */
        m_ucRankType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildPVPRank_Response {
        /**
         * 结果ID
         */
        m_ucResultID: number;

        /**
         * 拉取宗派群英会个人排行榜
         */
        m_stGuildPVPRankRsp: GuildPVPBattleRank;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildPVPBattleRank {
        /**
         * 排行版长度
         */
        m_ucNum: number;

        /**
         * 排行榜内容
         */
        m_astRankData: Array<GuildPVPRankOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildPVPRankOne {
        /**
         * 排名
         */
        m_iRank: number;

        /**
         * 玩家名字
         */
        m_szRoleName: string;

        /**
         * 宗派名字
         */
        m_szGuildName: string;

        /**
         * 击杀数
         */
        m_iKillNum: number;

        /**
         * 助攻数
         */
        m_iAssistingNum: number;

        /**
         * 死亡数
         */
        m_iDeadNum: number;

        /**
         * 水晶积分
         */
        m_iScore: number;

        /**
         * 个人积分
         */
        m_iPersonScore: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_CROSSPVP_CS_Request {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: GuildCrossPVPCSRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildCrossPVPCSRequestValue {
        /**
         * 查询宗门战面板信息, 站位符
         */
        m_usOpenPanelReq: number;

        /**
         * 领取宗门战奖励请求, 站位符
         */
        m_usDoRewardReq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_CROSSPVP_CS_Response {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: GuildCrossPVPCSResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildCrossPVPCSResponseValue {
        /**
         * 宗派战-结果面板
         */
        m_stGuildPVPInfoRes: GuildPVPBattleInfoRes;

        /**
         * 领取宗门战奖励请求. 返回表示操作成功
         */
        m_ucDoRewardRes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildPVPBattleInfoRes {
        /**
         * 获得天下第一宗的宗门ID
         */
        m_uiGuildID: number;

        /**
         * 宗派名字
         */
        m_szGuildName: string;

        /**
         * 奖励的领取状态. 0-无奖励或者已领取, 1-有奖励未领取
         */
        m_ucRewardState: number;

        /**
         * 比赛结算的时间
         */
        m_uiBattleTime: number;

        /**
         * 当前计算结果的面板人数
         */
        m_usNumber: number;

        /**
         * 宗门结算后宗主,副宗主的人数
         */
        m_stGuildLeaderList: Array<GuildPVPBattleInfo>;

        /**
         * 比赛的下一次开始时间
         */
        m_uiBattleNextTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildPVPBattleInfo {
        /**
         * RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 职位
         */
        m_ucGrade: number;

        /**
         * 角色基本信息
         */
        m_stBaseInfo: BaseProfile;

        /**
         * 时装列表
         */
        m_stAvatarList: AvatarList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_CS_Request {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: GuildCSRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildCSRequestValue {
        /**
         * 占位 查看本宗派信息
         */
        m_ucGetGuildAbstractInfo: number;

        /**
         * 占位 查看宗派列表
         */
        m_ucGetGuildList: number;

        /**
         * 创建宗派请求
         */
        m_stCreteGuild: Create_Guild_Value_Request;

        /**
         * 申请加入宗派请求
         */
        m_stApplyRequest: Guild_Apply_Request;

        /**
         * 占位 退出宗派请求
         */
        m_uchQuitRequest: number;

        /**
         * 查看其他宗派请求 宗派ID
         */
        m_uiOtherRequest: number;

        /**
         * 踢出宗派请求 被踢出者的角色ID
         */
        m_stKickRoleID: RoleID;

        /**
         * 占位 拉取宗派成员请求
         */
        m_uchMyMemberRequest: number;

        /**
         * 设置宗派信息
         */
        m_stUpdateTextRequest: Guild_UpdateText_Request;

        /**
         * 占位 解散宗派
         */
        m_stuchDimissRequest: number;

        /**
         * 设置宗派成员职位
         */
        m_stUpdateGradeRequest: Guild_UpdateGrade_Request;

        /**
         * 捐献
         */
        m_stDonateRequest: Guild_Donate_Request;

        /**
         * 占位 拉取审核列表请求
         */
        m_uchApplicantListRequest: number;

        /**
         * 申请列表审核请求
         */
        m_stApproveRequest: Guild_Approve_Request;

        /**
         * 领取每日礼包 占位
         */
        m_ucDayGiftRequest: number;

        /**
         * 领取等级礼包 占位
         */
        m_ucLevelGiftRequest: number;

        /**
         * 寻宝协助
         */
        m_stXunBaoHelpRequest: GuildXunBaoHelpRequest;

        /**
         * 拉取寻宝列表 占位
         */
        m_ucGetXunBaoList: number;

        /**
         * 宗派寻宝 充值条件达成
         */
        m_ucXunBaoLevel: number;

        /**
         * 占位 宗派聊天发送自己的位置信息
         */
        m_cSendRolePosReq: number;

        /**
         * 仓库申请
         */
        m_stStoreApplyReq: GuildStoreApplyRequest;

        /**
         * 仓库分配 宗主
         */
        m_stStoreAssignReq: GuildStoreAssignRequest;

        /**
         * 占位 拉取仓库物品列表
         */
        m_ucStoreList: number;

        /**
         * 占位 拉取仓库日志列表
         */
        m_ucStoreLogList: number;

        /**
         * 仓库取出
         */
        m_stStoreTakeOutReq: GuildStoreTakeOutRequest;

        /**
         * SS仓库取出
         */
        m_stSSStoreTakeOutReq: SSGuildStoreTakeOutRequest;

        /**
         * 仓库存入
         */
        m_stStoreIntoReq: GuildStoreIntoRequest;

        /**
         * SS仓库存入
         */
        m_stSSStoreIntoReq: SSGuildStoreIntoRequest;

        /**
         * 仓库删除
         */
        m_stStoreDelReq: GuildStoreDelRequest;

        /**
         * SS仓库删除
         */
        m_stSSStoreDelReq: SSGuildStoreDelRequest;

        /**
         * 仓库设置捐献阶数,0是不限制
         */
        m_stStoreLimit: GuildStoreLimit;

        /**
         * 占位 拉排序
         */
        m_ucStoreSort: number;

        /**
         * 设置申请自动加入
         */
        m_ucAutoJoin: number;

        /**
         * 资金排行拉取列表
         */
        m_ucMoneyRankList: number;

        /**
         * 资金排行领取奖励
         */
        m_ucMoneyRankGet: number;

        /**
         * 至尊皇城 宗派页签面板打开 占位
         */
        m_ucZZHCPannel: number;

        /**
         * 至尊皇城 Boss喂养 精魄货币数
         */
        m_iZZHCBossFeed: number;

        /**
         * 至尊皇城 领取奖励 1 2 3 4 四档 ZZHC_GUILD_GIFT_COUNT
         */
        m_ucZZHCGiftGet: number;

        /**
         * 宗派探矿拉取数据请求
         */
        m_stGuildTreasureHuntGetInfoRequest: GuildTreasureHuntGetInfo_Request;

        /**
         * 宗派探矿事件操作请求
         */
        m_stGuildTreasureHuntEventOpRequest: GuildTreasureHuntEventOp_Request;

        /**
         * 宗派探矿领奖请求
         */
        m_stGuildTreasureHuntGetRewardRequest: GuildTreasureHuntGetReward_Request;

        /**
         * 宗派探矿事件通报
         */
        m_stGuildTreasureHuntEventNotify: GuildTreasureHuntEventNotify;

        /**
         * 宗派探矿GM操作
         */
        m_stGuildTreasureHuntGMOpReq: GuildTreasureHuntGMOpReq;

        /**
         * 宗派拍卖 面板 占位
         */
        m_ucPaiMaiOpenGuild: number;

        /**
         * 宗派拍卖 面板 占位
         */
        m_ucPaiMaiOpenWorld: number;

        /**
         * 宗派拍卖 拍
         */
        m_stPaiMaiBuyGuild: PaiMaiBuyReq;

        /**
         * 宗派拍卖 拍
         */
        m_stPaiMaiBuyWorld: PaiMaiBuyReq;

        /**
         * 宗派拍卖 我的 占位
         */
        m_ucPaiMaiSelf: number;

        /**
         * 宗派拍卖 我的 流水ID
         */
        m_iPaiMaiIngoreID: number;

        /**
         * 名将挑战 打开面板 占位
         */
        m_ucMJTZOpen: number;

        /**
         * 名将挑战 查看伤害排行, 关索引 1-5
         */
        m_ucMJTZListRank: number;

        /**
         * 名将挑战 领取礼包 boss 索引1-25
         */
        m_ucMJTZGetGift: number;

        /**
         * 名将挑战 鼓舞 占位
         */
        m_ucMJTZRaise: number;

        /**
         * 名将挑战 同步数据到world
         */
        m_stMJTZSynBossData: MJTZSynBossData;

        /**
         * 名将挑战 同步数据到world
         */
        m_stMJTZSynRoleData: MJTZSynRoleData;

        /**
         * 名将挑战 从world请求数据，创建副本
         */
        m_iMJTZCreatePinGuildID: number;

        /**
         * 名将挑战 从world请求数据，创建副本
         */
        m_stMJTZGMCall: MJTZGMCall;

        /**
         * 宗门召唤血战封魔 类型0宗主和副宗主召唤 1普通的呼救
         */
        m_iXZFMCallType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Create_Guild_Value_Request {
        /**
         * 宗派名字
         */
        m_szGuildName: string;

        /**
         * 公告
         */
        m_szNitce: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_Apply_Request {
        /**
         * 申请加入的宗派ID
         */
        m_uiGuildID: number;

        /**
         * 操作码0加入，1撤销，2要求GUILD_APPLY_CODE_WITHDRAW
         */
        m_ucCode: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_UpdateText_Request {
        /**
         * 公告
         */
        m_szNitce: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_UpdateGrade_Request {
        /**
         * 被修改者的角色ID
         */
        m_stTargetRoleID: RoleID;

        /**
         * 职位级别，取值见枚举GUILD_GRADE_MEMBER
         */
        m_ushGuildGrade: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_Donate_Request {
        /**
         * 捐献类型 GUILD_DONATE_TYPE_ITEM  GUILD_DONATE_TYPE_YUANBAO
         */
        m_ucType: number;

        /**
         * 捐献数量
         */
        m_uiCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_Approve_Request {
        /**
         * 审批者
         */
        m_stOperatorRoleID: RoleID;

        /**
         * 同意/拒绝，取值参见枚举GuildOperation
         */
        m_cOperation: number;

        /**
         * 申请者列表，被审批的人
         */
        m_stApplicantList: GuildApplicantList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildApplicantList {
        /**
         * 个数
         */
        m_ushNumber: number;

        m_astApplicantInfo: Array<GuildApplicantInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildApplicantInfo {
        /**
         * 申请者
         */
        m_stRoleID: RoleID;

        /**
         * 申请者的角色昵称
         */
        m_szNickName: string;

        /**
         * 申请时间，unix时间，单位：秒
         */
        m_uiApplyTime: number;

        /**
         * 职业
         */
        m_cProfession: number;

        /**
         * 性别
         */
        m_chGender: number;

        /**
         * 角色等级
         */
        m_usRoleLevel: number;

        /**
         * 战斗力
         */
        m_iStrength: number;

        /**
         * 累计充值
         */
        m_uiCharge: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildXunBaoHelpRequest {
        /**
         * 等级档次
         */
        m_ucLevel: number;

        /**
         * 角色ID
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreApplyRequest {
        /**
         * 申请的物品ID
         */
        m_uiItemID: number;

        /**
         * 申请的物品数量
         */
        m_uiItemNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreAssignRequest {
        /**
         * 操作的类型，1、允许；0、拒绝
         */
        m_ucType: number;

        /**
         * 操作的物品ID
         */
        m_uiItem: number;

        /**
         * 目标ID
         */
        m_stTargetID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreTakeOutRequest {
        /**
         * 目标ID
         */
        m_stTargetID: RoleID;

        /**
         * 需取出物品的个数
         */
        m_ucItemCnt: number;

        /**
         * 物品
         */
        m_stItem: Array<ContainerThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SSGuildStoreTakeOutRequest {
        /**
         * 目标ID
         */
        m_stTargetID: RoleID;

        /**
         * 需取出物品的个数
         */
        m_ucItemCnt: number;

        /**
         * 物品
         */
        m_stItem: Array<GuildStoreThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreThing {
        /**
         * 物品ID
         */
        m_iThingID: number;

        /**
         * 物品数量
         */
        m_iThingNumber: number;

        /**
         * 物品所在背包的位置
         */
        m_usPosition: number;

        /**
         * 物品可变属性
         */
        m_stThingProperty: ThingProperty;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreIntoRequest {
        /**
         * 物品数量
         */
        m_ucItemNums: number;

        /**
         * 物品
         */
        m_stItem: Array<ContainerThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SSGuildStoreIntoRequest {
        /**
         * 物品数量
         */
        m_ucItemNums: number;

        /**
         * 物品
         */
        m_stItem: Array<GuildStoreThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreDelRequest {
        /**
         * 需删除物品的个数
         */
        m_ucItemCnt: number;

        /**
         * 物品
         */
        m_stItemList: Array<ContainerThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SSGuildStoreDelRequest {
        /**
         * 需删除物品的个数
         */
        m_ucItemCnt: number;

        /**
         * 物品
         */
        m_stItemList: Array<GuildStoreThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreLimit {
        /**
         * 魂骨颜色，0表不限制
         */
        m_ucHunGuColor: number;

        /**
         * 魂骨掉落档次，0表不限制
         */
        m_ucHunGuDropLevel: number;

        /**
         * 装备颜色，0表不限制
         */
        m_ucEquipColor: number;

        /**
         * 装备掉落档次，0表不限制
         */
        m_ucEquipDropLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntGetInfo_Request {
        /**
         * 备用
         */
        m_iRsv: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntEventOp_Request {
        /**
         * 事件ID
         */
        m_uiEventID: number;

        /**
         * 操作类型，GUILD_TREASURE_HUNT_EVENT_OP_QUESTACCEPT等
         */
        m_ucOpType: number;

        /**
         * 协议体
         */
        m_stValue: GuildTreasureHuntEventOpReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntEventOpReqValue {
        /**
         * 开启寻宝，难度等级
         */
        m_ucDifficulty: number;

        /**
         * 接取任务请求，不用填
         */
        m_ucTaskAccept: number;

        /**
         * 捐赠请求
         */
        m_stDonation: DominationPersonalData;

        /**
         * 打boss请求
         */
        m_stBossPK: GuildTreasureHuntBossPKReq;

        /**
         * 选择请求，GUILD_TREASURE_HUNT_SELECT_NONE，GUILD_TREASURE_HUNT_SELECT_NO1，GUILD_TREASURE_HUNT_SELECT_NO2
         */
        m_ucSelectNo: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DominationPersonalData {
        /**
         * 捐赠类型
         */
        m_ucType: number;

        /**
         * 捐赠次数
         */
        m_uiNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntBossPKReq {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 怪物ID
         */
        m_uiMonsterID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntGetReward_Request {
        /**
         * 奖励类型，GUILD_TREASURE_HUNT_REWARD_TYPE_NORMAL(0) 普通奖励，GUILD_TREASURE_HUNT_REWARD_TYPE_SPECIAL(1) 特殊奖励 
         */
        m_ucRewardType: number;

        /**
         * 奖励ID
         */
        m_uiRewardID: number;

        /**
         * 玩家贡献度
         */
        m_uiContribution: number;

        /**
         * 奖励变更系数，千分比，正数表示增加，负数表示减少
         */
        m_iRewardChangeRate: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntEventNotify {
        /**
         * 操作类型，GUILD_TREASURE_HUNT_EVENT_OP_QUESTACCEPT等
         */
        m_ucOpType: number;

        /**
         * 协议体
         */
        m_stValue: GuildTreasureHuntEventNotifyValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntEventNotifyValue {
        /**
         * 任务完成通报，不用填
         */
        m_uiTaskComplete: number;

        /**
         * 结束打boss通报
         */
        m_stBossPKEnd: GuildTreasureHuntBossPKEnd;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntBossPKEnd {
        /**
         * 本次杀怪血量
         */
        m_uiKillBossHP: number;

        /**
         * 宗派ID
         */
        m_uiGuildID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntGMOpReq {
        /**
         * 操作类型
         */
        m_ucOpType: number;

        /**
         * 宗派探矿个人信息
         */
        m_stPersonalData: GuildTreasureHuntPersonalData;

        /**
         * 宗派探矿公共信息
         */
        m_stCommonData: GuildTreasureHuntData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntPersonalData {
        /**
         * 体力
         */
        m_uiPower: number;

        /**
         * 上次体力刷新时间
         */
        m_iLastPowerRefreshTime: number;

        /**
         * 贡献度
         */
        m_uiContribution: number;

        /**
         * 普通奖励状态，KF_ACT_STATUS_NONE(0) 不可领取， KF_ACT_STATUS_ARIVE(1) 可领取， KF_ACT_STATUS_REWARD(2) 已领取
         */
        m_ucRewardStatus: number;

        /**
         * 特殊奖励状态，KF_ACT_STATUS_NONE(0) 不可领取， KF_ACT_STATUS_ARIVE(1) 可领取， KF_ACT_STATUS_REWARD(2) 已领取
         */
        m_ucSpecialRewardStatus: number;

        /**
         * 事件数据
         */
        m_stEventData: GuildTreasureHuntEventPersonalData;

        /**
         * 个人奖励变更系数，千分比，正数表示增加，负数表示减少，只在领奖时使用
         */
        m_iPersonalRewardChangeRate: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntEventPersonalData {
        /**
         * 已完成任务数
         */
        m_uiTaskCompletedNum: number;

        /**
         * 捐献种类数
         */
        m_ucDominationTypeNum: number;

        /**
         * 捐赠数据
         */
        m_astDominationData: Array<DominationPersonalData>;

        /**
         * 选择的编号，GUILD_TREASURE_HUNT_SELECT_NONE，GUILD_TREASURE_HUNT_SELECT_NO1，GUILD_TREASURE_HUNT_SELECT_NO2
         */
        m_ucSelectNo: number;

        /**
         * 已杀怪血量
         */
        m_uiKillMonsterHp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntData {
        /**
         * 难度等级
         */
        m_ucDifficulty: number;

        /**
         * 当前阶段
         */
        m_ucStep: number;

        /**
         * 本阶段开启时间
         */
        m_iStepStartTime: number;

        /**
         * 完成度
         */
        m_uiCompleteness: number;

        /**
         * 排名人数
         */
        m_uiRankNumber: number;

        /**
         * 贡献排名列表
         */
        m_astContributionRank: Array<ContributionRank>;

        /**
         * 当前事件类型
         */
        m_uiEventType: number;

        /**
         * 事件ID
         */
        m_uiEventID: number;

        /**
         * 事件数据
         */
        m_stEventData: GuildTreasureHuntEventData;

        /**
         * 奖励变更系数，千分比，正数表示增加，负数表示减少
         */
        m_iRewardChangeRate: number;

        /**
         * 上次奖励变更系数，千分比，正数表示增加，负数表示减少
         */
        m_iLastRewardChangeRate: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ContributionRank {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 昵称
         */
        m_szNickName: string;

        /**
         * 贡献度
         */
        m_uiContribution: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntEventData {
        /**
         * 任务事件数据
         */
        m_stEventTaskData: EventTaskData;

        /**
         * 捐赠事件数据
         */
        m_stEventDonationData: EventDonationData;

        /**
         * Boss事件数据
         */
        m_stEventBossData: EventBossData;

        /**
         * 选择事件数据
         */
        m_stEventSelectData: EventSelectData;

        /**
         * 移动事件数据
         */
        m_stEventMoveData: EventMoveData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EventTaskData {
        /**
         * 当前任务完成次数
         */
        m_uiTaskCompletedTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EventDonationData {
        /**
         * 当前捐赠数量
         */
        m_uiDonationNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EventBossData {
        /**
         * 当前Boss血量
         */
        m_uiBossHp: number;

        /**
         * 在PK的玩家
         */
        m_stPkRole: RoleID;

        /**
         * pk开始的时间
         */
        m_uiPkTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EventSelectData {
        /**
         * 选项数
         */
        m_ucNum: number;

        /**
         * 各选项票数,索引为(选项类型-1)
         */
        m_auiSelectAcount: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class EventMoveData {
        /**
         * 预留
         */
        m_iResv: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PaiMaiBuyReq {
        /**
         * 宗派ID
         */
        m_uiGuildID: number;

        /**
         * 物品唯一ID
         */
        m_uiID: number;

        /**
         * 出价
         */
        m_uiPrice: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MJTZSynBossData {
        /**
         * Boss 当前血量
         */
        m_llBossCurHp: number;

        /**
         * 玩家当前伤害
         */
        m_llRoleHurt: number;

        /**
         * 玩家roleid
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MJTZSynRoleData {
        /**
         * 玩家伤害
         */
        m_llRoleHurt: number;

        /**
         * 是否是设置更新，0是增加，1是设置
         */
        m_bSet: number;

        /**
         * 玩家roleid
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MJTZGMCall {
        /**
         * 参数1
         */
        m_iPara1: number;

        /**
         * 参数2
         */
        m_iPara2: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_CS_Response {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: GuildCSResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildCSResponseValue {
        /**
         * 获取宗派信息
         */
        m_stGetGuildAbstractInfo: Get_GuildAbstract_Value_Response;

        /**
         * 查看宗派列表
         */
        m_stGetGuildList: Get_GuildList_Value_Response;

        /**
         * 创建宗派响应
         */
        m_stCreteGuild: Create_Guild_Value_Response;

        /**
         * 申请加入宗派响应
         */
        m_stApplyResponse: Guild_Apply_Response;

        /**
         * 退出宗派响应,占位，不填该字段
         */
        m_uchQuitResponse: number;

        /**
         * 查看其他宗派成员响应
         */
        m_stOtherResponse: Guild_Other_Member_Response;

        /**
         * 踢出宗派请求 被踢出者的角色ID
         */
        m_stKickRoleID: RoleID;

        /**
         * 拉取宗派成员
         */
        m_stMyMemberResponse: Guild_My_Member_Response;

        /**
         * 设置宗派信息
         */
        m_stUpdateTextResponse: Guild_UpdateText_Response;

        /**
         * 解散宗派,占位，不填该字段
         */
        m_stuchDimissResponse: number;

        /**
         * 设置宗派成员职位
         */
        m_stUpdateGradeResponse: Guild_UpdateGrade_Response;

        /**
         * 捐献
         */
        m_stDonateResponse: Guild_Donate_Response;

        /**
         * 拉取审核列表响应
         */
        m_stApplicantListResponse: Guild_FetchApplicantList_Response;

        /**
         * 申请列表审核响应
         */
        m_stApproveResponse: Guild_Approve_Response;

        /**
         * 领取每日礼包 占位
         */
        m_stDayGiftRsp: GuildDayGiftResponse;

        /**
         * 领取等级礼包 占位
         */
        m_stLevelGiftRsp: GuildLevelGiftResponse;

        /**
         * 寻宝协助
         */
        m_stXunBaoHelpRsp: GuildXunBaoHelpResponse;

        /**
         * 拉取寻宝列表
         */
        m_stGetXunBaoListRsp: GuildXunBaoListResponse;

        /**
         * 宗派聊天，发送自己的位置信息.不用赋值，默认0
         */
        m_cSendRolePosRsp: number;

        /**
         * 仓库申请
         */
        m_stStoreApplyRsp: GuildStoreApplyResponse;

        /**
         * 仓库分配 宗主
         */
        m_stStoreAssignRsp: GuildStoreAssignResponse;

        /**
         * 拉取仓库物品列表
         */
        m_stStoreListRsp: GuildStoreListResponse;

        /**
         * 拉取仓库日志列表
         */
        m_stStoreLogListRsp: GuildStoreLogListResponse;

        /**
         * 仓库取出
         */
        m_stStoreTakeOutRsp: GuildStoreTakeOutResponse;

        /**
         * 仓库存入
         */
        m_stStoreIntoRsp: GuildStoreIntoResponse;

        /**
         * 仓库删除
         */
        m_stStoreDelRsp: GuildStoreDelResponse;

        /**
         * 仓库设置捐献阶数,0是不限制
         */
        m_stStoreLimit: GuildStoreLimit;

        /**
         * 设置申请自动加入
         */
        m_ucAutoJoin: number;

        /**
         * 宗派召唤BOSS通知
         */
        m_stGuildCallBossRsp: GuildCallBossResponse;

        /**
         * 宗派召唤封魔塔BOSS通知
         */
        m_stGuildCallFMTBossRsp: GuildCallFMTBossResponse;

        /**
         * 宗派召唤宗派封魔通知
         */
        m_stGuildCallZPFMRsp: GuildCallZPFMResponse;

        /**
         * 资金排行拉取列表
         */
        m_stMoneyRankListRsp: GuildMoneyRankListRsp;

        /**
         * 资金排行领取奖励
         */
        m_stMoneyRankGetRsp: GuildMoneyRankGetRsp;

        /**
         * 至尊皇城 宗派页签面板打开
         */
        m_stZZHCPannelRsp: GuildZZHCPannelRsp;

        /**
         * 至尊皇城 Boss喂养 精魄货币数
         */
        m_stZZHCBossFeedRsp: GuildZZHCBossFeedRsp;

        /**
         * 至尊皇城 领取奖励 1 2 3 4 四档 ZZHC_GUILD_GIFT_COUNT
         */
        m_stZZHCGiftGetRsp: GuildZZHCGiftGetRspRsp;

        /**
         * 宗派探矿拉取数据响应
         */
        m_stGuildTreasureHuntGetInfoResponse: GuildTreasureHuntGetInfo_Response;

        /**
         * 宗派探矿事件操作响应
         */
        m_stGuildTreasureHuntEventOpResponse: GuildTreasureHuntEventOp_Response;

        /**
         * 宗派探矿领奖响应
         */
        m_stGuildTreasureHuntGetRewardResponse: GuildTreasureHuntGetReward_Response;

        /**
         * 宗派拍卖 面板 占位
         */
        m_stPaiMaiOpenGuild: PaiMaiOpenGuildRsp;

        /**
         * 宗派拍卖 面板 占位
         */
        m_stPaiMaiOpenWorld: PaiMaiOpenWorldRsp;

        /**
         * 宗派拍卖 拍
         */
        m_stPaiMaiBuyGuild: PaiMaiBuyGuildRsp;

        /**
         * 宗派拍卖 拍
         */
        m_stPaiMaiBuyWorld: PaiMaiBuyWorldRsp;

        /**
         * 宗派拍卖 我的
         */
        m_stPaiMaiSelf: PaiMaiSelfRsp;

        /**
         * 宗派拍卖 我的
         */
        m_stPaiMaiIngore: PaiMaiSelfRsp;

        /**
         * GUILD_PAIMAI_GUILD_PROSESS宗派拍卖 GUILD_PAIMAI_WORLD_PROSESS世界拍卖
         */
        m_iPaiMaiNewNtf: number;

        /**
         * 名将挑战 打开面板
         */
        m_stMJTZOpenRsp: MJTZOpenRsp;

        /**
         * 名将挑战 查看伤害排行
         */
        m_stMJTZListRankRsp: MJTZListRankRsp;

        /**
         * 名将挑战 领取礼包
         */
        m_stMJTZGetGiftRsp: MJTZGetGiftRsp;

        /**
         * 名将挑战 鼓舞,当前已鼓舞次数
         */
        m_ucMJTZRaiseRsp: number;

        /**
         * 名将挑战 从world请求数据，创建副本
         */
        m_stMJTZCreatePinRsp: MJTZCreatePinRsp;

        /**
         * 名将挑战 通知活动变化
         */
        m_stMJTZActChangeNotify: MJTZActChangeNotify;

        /**
         * 宗门召唤血战封魔的通知
         */
        m_stGuildCallXZFMNotify: GuildCallXZFMNotify;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Get_GuildAbstract_Value_Response {
        /**
         * 宗派ID
         */
        m_uiGuildID: number;

        /**
         * 宗派名字
         */
        m_szGuildName: string;

        /**
         * 宗派资金
         */
        m_uiGuildMoney: number;

        /**
         * 宗派累计获得资金总量
         */
        m_uiAccGuildMoney: number;

        /**
         * 宗派战力
         */
        m_uiFightVal: number;

        /**
         * 自动加入设置
         */
        m_ucAutoJoin: number;

        /**
         * 宗派人数
         */
        m_ucMemberNumber: number;

        /**
         * 宗派的等级
         */
        m_ucGuildLevel: number;

        /**
         * 宗派公告
         */
        m_szDeclaration: string;

        /**
         * 领导列表,用于存放族长 副族长列表
         */
        m_stLeaderList: GuildMemberList;

        /**
         * 个人职位
         */
        m_ushGrade: number;

        /**
         * 宗派每日礼包是否领取
         */
        m_ucDayGiftGet: number;

        /**
         * 宗派等级礼包领取到多少级了
         */
        m_ucLevelGiftGet: number;

        /**
         * 资金排行奖励状态 1.不可领取 2.可领取 3.已领取    见宏GOD_LOAD_AWARD_DONE_GET
         */
        m_ucMoneyRankGet: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildMemberList {
        /**
         * 宗派中已有的成员个数
         */
        m_ushNumber: number;

        /**
         * 宗派成员列表
         */
        m_astGuildMemberInfo: Array<GuildMemberInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildMemberInfo {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 角色BaseProInfo
         */
        m_stBaseProfile: BaseProfile;

        /**
         * 玩家Avatar
         */
        m_stAvatarList: AvatarList;

        /**
         * 职位
         */
        m_ucGrade: number;

        /**
         * 当前贡献值
         */
        m_uiCurGongXian: number;

        /**
         * 累计贡献值
         */
        m_uiAccGongXian: number;

        /**
         * 上次登出时间
         */
        m_iLogoutTime: number;

        /**
         * 加入时间时间
         */
        m_iJoinTime: number;

        /**
         * 战斗力
         */
        m_iFightVal: number;

        /**
         * 今日捐献
         */
        m_uiTodayDonate: number;

        /**
         * 累计捐献
         */
        m_uiAccDonate: number;

        /**
         * 是否在线
         */
        m_bOnline: number;

        /**
         * 今日贡献
         */
        m_uiDayGongXian: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Get_GuildList_Value_Response {
        /**
         * 宗派查询列表
         */
        m_stGuildList: GuildQueryList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildQueryList {
        /**
         * 宗派个数
         */
        m_ushNumber: number;

        /**
         * 宗派列表
         */
        m_astGuildInfo: Array<GuildQueryInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildQueryInfo {
        /**
         * 宗派ID
         */
        m_uiGuildID: number;

        /**
         * 宗派名字
         */
        m_szGuildName: string;

        /**
         * 宗派的等级
         */
        m_ushGuildLevel: number;

        /**
         * 族长ID
         */
        m_stChairmanID: RoleID;

        /**
         * 宗主充值数用来换算VIP
         */
        m_uiChairCharge: number;

        /**
         * 族长名字
         */
        m_szChairmanName: string;

        /**
         * 宗派人数
         */
        m_ushMemberNumber: number;

        /**
         * 宗派总战力
         */
        m_uiFightVal: number;

        /**
         * 自动加入
         */
        m_ucAutoJoin: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Create_Guild_Value_Response {
        /**
         * 成功创建的宗派ID
         */
        m_uiGuildID: number;

        /**
         * 宗派名字。如果已有宗派，则返回其名字
         */
        m_szGuildName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_Apply_Response {
        /**
         * 请求消息处理结果
         */
        m_ushResultID: number;

        /**
         * 操作码0加入，1撤销，2要求GUILD_APPLY_CODE_WITHDRAW
         */
        m_ucCode: number;

        /**
         * 申请加入的宗派ID
         */
        m_uiGuildID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_Other_Member_Response {
        /**
         * 宗派ID
         */
        m_uiGuildID: number;

        /**
         * 宗派战力
         */
        m_uiFightVal: number;

        /**
         * 宗派资产
         */
        m_uiGuildMoney: number;

        /**
         * 宗派等级
         */
        m_ucGuildLevel: number;

        /**
         * 宗派名字
         */
        m_szGuildName: string;

        /**
         * 申请者的角色昵称
         */
        m_szMemberList: GuildOtherMemberList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildOtherMemberList {
        /**
         * 成员个数
         */
        m_ucNumber: number;

        /**
         * 成员数组
         */
        m_astNumber: Array<GuildOtherMember>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildOtherMember {
        /**
         * 成员ID
         */
        m_stRoleID: RoleID;

        /**
         * 职位
         */
        m_ucGrade: number;

        /**
         * 等级
         */
        m_usLevel: number;

        /**
         * 战斗力
         */
        m_uiFightVal: number;

        /**
         * 成员名字
         */
        m_szRoleName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_My_Member_Response {
        /**
         * 宗派成员列表
         */
        m_stGuildMemberList: GuildMemberList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_UpdateText_Response {
        /**
         * 公告
         */
        m_szNitce: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_UpdateGrade_Response {
        /**
         * 被修改者的角色ID
         */
        m_stTargetRoleID: RoleID;

        /**
         * 职位级别，取值见枚举GUILD_GRADE_MEMBER
         */
        m_ushGuildGrade: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_Donate_Response {
        /**
         * 捐献类型 GUILD_DONATE_TYPE_ITEM  GUILD_DONATE_TYPE_YUANBAO
         */
        m_ucType: number;

        /**
         * 捐献数量
         */
        m_uiCount: number;

        /**
         * 宗派资产
         */
        m_uiGuildMoney: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_FetchApplicantList_Response {
        /**
         * 申请者列表
         */
        m_stApplicantList: GuildApplicantList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_Approve_Response {
        /**
         * 审批者
         */
        m_stOperatorRoleID: RoleID;

        /**
         * 申请者
         */
        m_stTargetRoleID: RoleID;

        /**
         * 申请者的角色昵称
         */
        m_szTargetNickName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildDayGiftResponse {
        /**
         * 是否领取过每日礼包
         */
        m_ucGetDay: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildLevelGiftResponse {
        /**
         * 等级礼包领取到多少级了
         */
        m_ucGetLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildXunBaoHelpResponse {
        /**
         * 等级档次
         */
        m_ucLevel: number;

        /**
         * 寻宝领取次数
         */
        m_auiXunBaoHelpCount: Array<number>;

        /**
         * 宗派寻宝数据
         */
        m_stXunBaoData: GuildXunBaoData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildXunBaoData {
        /**
         * 宗派中已有的成员个数
         */
        m_ushNumber: number;

        /**
         * 宗派成员列表
         */
        m_astRecordList: Array<GuildXunBaoRecord>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildXunBaoRecord {
        /**
         * 等级档次
         */
        m_ucLevel: number;

        /**
         * 是否以协助
         */
        m_ucHelp: number;

        /**
         * 协助人数
         */
        m_ucHelpCount: number;

        /**
         * 奖励ID
         */
        m_uiDropID: number;

        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 角色昵称
         */
        m_szNickName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildXunBaoListResponse {
        /**
         * 有宗派期间今日累计消费
         */
        m_uiAccConsume: number;

        /**
         * 寻宝领取次数
         */
        m_auiXunBaoHelpCount: Array<number>;

        /**
         * 宗派寻宝数据
         */
        m_stXunBaoData: GuildXunBaoData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreApplyResponse {
        /**
         * 仓库数据
         */
        m_stStore: GuildStoreInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreInfo {
        /**
         * 物品个数
         */
        m_usCount: number;

        /**
         * 物品列表
         */
        m_stItemList: Array<GuildStoreItem>;

        /**
         * 魂骨颜色，0表不限制
         */
        m_ucHunGuColor: number;

        /**
         * 魂骨掉落档次，0表不限制
         */
        m_ucHunGuDropLevel: number;

        /**
         * 装备颜色，0表不限制
         */
        m_ucEquipColor: number;

        /**
         * 装备掉落档次，0表不限制
         */
        m_ucEquipDropLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreItem {
        /**
         * 物品ID
         */
        m_uiItemID: number;

        /**
         * 物品个数
         */
        m_uiCount: number;

        /**
         * 申请着信息
         */
        m_stApplyInfo: GuildItemApplyList;

        /**
         * 物品可变属性
         */
        m_stThingProperty: ThingProperty;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildItemApplyList {
        /**
         * 个数
         */
        m_ushNumber: number;

        /**
         * 一个物品的申请者仓库物品申请者
         */
        m_astApplyInfo: Array<GuildItemApplyInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildItemApplyInfo {
        /**
         * 申请者
         */
        m_stRoleID: RoleID;

        /**
         * 角色名
         */
        m_szNickName: string;

        /**
         * 申请个数
         */
        m_uiItemNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreAssignResponse {
        /**
         * 仓库数据
         */
        m_stStore: GuildStoreInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreListResponse {
        /**
         * 仓库数据
         */
        m_stStore: GuildStoreInfo;

        /**
         * 每天宗派仓库捐献数量
         */
        m_usGuildStoreDonateTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreLogListResponse {
        /**
         * 仓库日志数据
         */
        m_stStoreLog: GuildStoreLogList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreLogList {
        /**
         * 日志个数
         */
        m_usCount: number;

        /**
         * 日志列表
         */
        m_stItemList: Array<GuildStoreLog>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreLog {
        /**
         * 日志的时间
         */
        m_uiTime: number;

        /**
         * 角色名
         */
        m_szNickName: string;

        /**
         * 日志的类型，分配/取出/存入
         */
        m_ucType: number;

        /**
         * 需取出物品的个数
         */
        m_ucItemCnt: number;

        /**
         * 物品
         */
        m_stItem: Array<GuildStoreThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreTakeOutResponse {
        /**
         * 物品
         */
        m_stItem: GuildStoreThing;

        /**
         * 仓库数据
         */
        m_stStore: GuildStoreInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreIntoResponse {
        /**
         * 物品数量
         */
        m_ucItemNums: number;

        /**
         * 物品
         */
        m_stItem: Array<GuildStoreThing>;

        /**
         * 仓库数据
         */
        m_stStore: GuildStoreInfo;

        /**
         * 每天宗派仓库捐献数量
         */
        m_usGuildStoreDonateTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildStoreDelResponse {
        /**
         * 需删除物品的个数
         */
        m_ucItemCnt: number;

        /**
         * 物品
         */
        m_stItemList: Array<GuildStoreThing>;

        /**
         * 仓库数据
         */
        m_stStore: GuildStoreInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildCallBossResponse {
        /**
         * 召唤者名字
         */
        m_szNickName: string;

        /**
         * BossID
         */
        m_uiBossID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildCallFMTBossResponse {
        /**
         * 目的场景
         */
        m_iSceneID: number;

        /**
         * 召唤者名字
         */
        m_szNickName: string;

        /**
         * 坐标点
         */
        m_stUnitPosition: UnitPosition;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildCallZPFMResponse {
        /**
         * 副本ID
         */
        m_iPinstanceID: number;

        /**
         * 召唤者名字
         */
        m_szNickName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildMoneyRankListRsp {
        /**
         * World宗派资金排行榜
         */
        m_stGuildMoneyRank: DBWorldGuildMoneyRank;

        /**
         * 昨日排名
         */
        m_ucYestodyRank: number;

        /**
         * 资金排行奖励状态 1.不可领取 2.可领取 3.已领取    见宏GOD_LOAD_AWARD_DONE_GET
         */
        m_ucMoneyRankGet: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBWorldGuildMoneyRank {
        /**
         * 刷新时间
         */
        m_iRewardTime: number;

        /**
         * 排行个数
         */
        m_iRankCount: number;

        /**
         * 排行数据
         */
        m_stRankList: Array<DBWorldGuildMoneyOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBWorldGuildMoneyOne {
        /**
         * 宗门ID
         */
        m_uiGuildID: number;

        /**
         * 宗派名字
         */
        m_szGuildName: string;

        /**
         * RoleID
         */
        m_stLeaderID: RoleID;

        /**
         * 宗主名字
         */
        m_szLeaderName: string;

        /**
         * 累计资金
         */
        m_iAccMoney: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildMoneyRankGetRsp {
        /**
         * 资金排行奖励状态 1.不可领取 2.可领取 3.已领取    见宏GOD_LOAD_AWARD_DONE_GET
         */
        m_ucMoneyRankGet: number;

        /**
         * 领取到的绑定元宝
         */
        m_iBindYBCnt: number;

        /**
         * 领取到的称号ID 只宗主有
         */
        m_iTitleID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildZZHCPannelRsp {
        /**
         * Boss喂养信息
         */
        m_stBossFeed: GuildZZHCBossFeedRsp;

        /**
         * 奖励领取信息
         */
        m_stGiftGet: GuildZZHCGiftGetRspRsp;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildZZHCBossFeedRsp {
        /**
         * 本次喂养值
         */
        m_iFeedValue: number;

        /**
         * 当前Boss等级
         */
        m_iBossLevel: number;

        /**
         * 当前Boss经验
         */
        m_iBossExp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildZZHCGiftGetRspRsp {
        /**
         * 领取奖励的类型
         */
        m_iGetType: number;

        /**
         * 今日贡献
         */
        m_uiDayGongXian: number;

        /**
         * 状态数组 见宏GOD_LOAD_AWARD_DONE_GET
         */
        m_aucStatus: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntGetInfo_Response {
        /**
         * 宗派探矿公共信息
         */
        m_stCommonData: GuildTreasureHuntData;

        /**
         * 宗派探矿个人信息
         */
        m_stPersonalData: GuildTreasureHuntPersonalData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntEventOp_Response {
        /**
         * 事件ID
         */
        m_uiEventID: number;

        /**
         * 操作类型，GUILD_TREASURE_HUNT_EVENT_OP_QUESTACCEPT等
         */
        m_ucOpType: number;

        /**
         * 协议体
         */
        m_stValue: GuildTreasureHuntEventOpRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntEventOpRspValue {
        /**
         * 开启寻宝响应数据
         */
        m_stStartInfo: GuildTreasureHuntStartRsp;

        /**
         * 接取的任务ID
         */
        m_uiTaskID: number;

        /**
         * 捐赠响应数据
         */
        m_stDonation: DominateOpRsp;

        /**
         * 打boss响应
         */
        m_stBossPK: BossPKOpRsp;

        /**
         * 选择响应
         */
        m_stSelect: SelectOpRsp;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntStartRsp {
        /**
         * 宗派探矿公共信息
         */
        m_stCommonData: GuildTreasureHuntData;

        /**
         * 宗派探矿个人信息
         */
        m_stPersonalData: GuildTreasureHuntPersonalData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DominateOpRsp {
        /**
         * 个人捐献种类数
         */
        m_ucDominationTypeNum: number;

        /**
         * 捐赠数据
         */
        m_astDominationData: Array<DominationPersonalData>;

        /**
         * 捐赠数据
         */
        m_stThisTimeDominationData: DominationPersonalData;

        /**
         * 宗派当前捐赠数量
         */
        m_uiGuildTotalDonationNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BossPKOpRsp {
        /**
         * 副本ID
         */
        m_uiPinstanceID: number;

        /**
         * 怪物ID
         */
        m_uiMonsterID: number;

        /**
         * 怪物血量
         */
        m_uiBossHP: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SelectOpRsp {
        /**
         * 选择的编号，GUILD_TREASURE_HUNT_SELECT_NO1，GUILD_TREASURE_HUNT_SELECT_NO2
         */
        m_ucSelectNo: number;

        /**
         * 宗派当前选择事件数据
         */
        m_stEventSelectData: EventSelectData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntGetReward_Response {
        /**
         * 奖励类型，GUILD_TREASURE_HUNT_REWARD_TYPE_NORMAL(0) 普通奖励，GUILD_TREASURE_HUNT_REWARD_TYPE_SPECIAL(1) 特殊奖励 
         */
        m_ucRewardType: number;

        /**
         * 奖励ID
         */
        m_uiRewardID: number;

        /**
         * 普通奖励状态，KF_ACT_STATUS_NONE(0) 不可领取， KF_ACT_STATUS_ARIVE(1) 可领取， KF_ACT_STATUS_REWARD(2) 已领取
         */
        m_ucRewardStatus: number;

        /**
         * 玩家贡献度
         */
        m_uiContribution: number;

        /**
         * 奖励变更系数，千分比，正数表示增加，负数表示减少
         */
        m_iRewardChangeRate: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PaiMaiOpenGuildRsp {
        /**
         * 拍卖的物品个数
         */
        m_iCount: number;

        /**
         * 拍卖的物品
         */
        m_stList: Array<PaiMaiItemOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PaiMaiItemOne {
        /**
         * 流水ID 每个宗派唯一的
         */
        m_iID: number;

        /**
         * 活动ID
         */
        m_iActID: number;

        /**
         * 宗派ID
         */
        m_uiGuildID: number;

        /**
         * 到期时间
         */
        m_uiTime: number;

        /**
         * 物品ID
         */
        m_iItemID: number;

        /**
         * 物品个数
         */
        m_iItemCount: number;

        /**
         * 一口价
         */
        m_iMaxPrice: number;

        /**
         * 当前价
         */
        m_iCurPrice: number;

        /**
         * 宗派名 为空时前端显示活动名
         */
        m_szGuildName: string;

        /**
         * 物品状态
         */
        m_ucStatus: number;

        /**
         * 忽略ID 每个宗派唯一的
         */
        m_iIngoreID: number;

        /**
         * 当前出价玩家roleid
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PaiMaiOpenWorldRsp {
        /**
         * 拍卖的物品个数
         */
        m_iCount: number;

        /**
         * 拍卖的物品
         */
        m_stList: Array<PaiMaiItemOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PaiMaiBuyGuildRsp {
        /**
         * 出价
         */
        m_stBuyReq: PaiMaiBuyReq;

        /**
         * 物品信息
         */
        m_stItem: PaiMaiItemOne;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PaiMaiBuyWorldRsp {
        /**
         * 出价
         */
        m_stBuyReq: PaiMaiBuyReq;

        /**
         * 物品信息
         */
        m_stItem: PaiMaiItemOne;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PaiMaiSelfRsp {
        /**
         * 拍卖的物品个数
         */
        m_iCount: number;

        /**
         * 拍卖的物品
         */
        m_stList: Array<PaiMaiItemOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MJTZOpenRsp {
        /**
         * boss数量
         */
        m_iBossCnt: number;

        /**
         * boss信息
         */
        m_stBossInfo: Array<RoleInfo>;

        /**
         * 当前宗门挑战boss索引 1 - 25
         */
        m_ucCurBossIndex: number;

        /**
         * 通关状态
         */
        m_uiPassFlag: number;

        /**
         * 鼓舞次数
         */
        m_ucRaiseCnt: number;

        /**
         * 礼包领取状态,按位，0未领取，1已领取
         */
        m_uiGetGift: number;

        /**
         * 已挑战时长
         */
        m_uiHaveTime: number;

        /**
         * 宗门ID
         */
        m_uiFastGuildID: number;

        /**
         * 最快的 进度
         */
        m_ucFastBossIndex: number;

        /**
         * 下次活动开始时间
         */
        m_uiNextStartTime: number;

        /**
         * 关卡重置的时间
         */
        m_uiStageTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MJTZListRankRsp {
        /**
         * 当前名将币总产量
         */
        m_iMJBTotal: number;

        /**
         * 当前自己可得名将币
         */
        m_iMJBSelf: number;

        /**
         * 当前自己排名，0是未上榜
         */
        m_iRank: number;

        /**
         * 排行榜个数
         */
        m_ucNum: number;

        /**
         * 榜单数据
         */
        m_stInfo: Array<MJTZOneRank>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MJTZOneRank {
        /**
         * 玩家
         */
        m_stRoleID: RoleID;

        /**
         * 玩家总伤害
         */
        m_llHurt: number;

        /**
         * 名字
         */
        m_szNickName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MJTZGetGiftRsp {
        /**
         * Boss 索引1-25
         */
        m_ucBossIndex: number;

        /**
         * 领取礼包,按位，已领取状态，0未领取，1已领取
         */
        m_uiGiftFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MJTZCreatePinRsp {
        /**
         * 当前挑战的boss 等级, 1-25
         */
        m_ucBossLv: number;

        /**
         * 当前挑战的boss 剩余血量
         */
        m_llBossHp: number;

        /**
         * 宗门id
         */
        m_iGuildID: number;

        /**
         * boss数据
         */
        m_stBossInfo: DBMJTZBossOne;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBMJTZBossOne {
        /**
         * 角色数据是否更新
         */
        m_bRefresh: number;

        /**
         * 角色信息
         */
        m_stRoleInfo: RoleInfo;

        /**
         * 技能列表
         */
        m_stSkillList: SkillList;

        /**
         * 宗派信息
         */
        m_stGuildInfo: GuildInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MJTZActChangeNotify {
        /**
         * 变化类型，1是关卡结束，2是活动结束
         */
        m_ucType: number;

        /**
         * 宗门id
         */
        m_uiGuildID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildCallXZFMNotify {
        /**
         * 第几层
         */
        m_iFloor: number;

        /**
         * 召唤者名字
         */
        m_szNickName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_ChangedNotify {
        /**
         * 角色单位ID
         */
        m_iUnitID: number;

        /**
         * 角色宗派信息
         */
        m_stGuildInfo: GuildInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_Notify {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: GuildNotityValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildNotityValue {
        /**
         * 宗派申请列表通知
         */
        m_stApplyNotity: Guild_Apply_Notify;

        /**
         * 加入宗派通知
         */
        m_stGuildJoinNotify: Guild_Join_Notify;

        /**
         * 申请已转发给xx处理的通知
         */
        m_stProcessApplyNotify: Guild_ProcessApply_Notify;

        /**
         * 踢出宗派通知
         */
        m_stKickRoleNotify: Guild_KickRole_Notify;

        /**
         * 职位改变通知
         */
        m_stGradeChangeNotify: Guild_RoleGradeChange_Notify;

        /**
         * 宗派解散通知，不填，占位
         */
        m_ucDismissNotify: number;

        /**
         * 宗派资产通知
         */
        m_stMoneyNotify: Guild_Money_Notify;

        /**
         * 宗派解散通知 Svr To Svr
         */
        m_stDismissSSNotify: Guild_Dismiss_SS_Notify;

        /**
         * 宗派等级通知
         */
        m_stGuildLevelNotify: GuildLevelSSNotify;

        /**
         * 宗派探矿步骤变更通知
         */
        m_stGuildTreasureHuntStepChangeNotify: GuildTreasureHuntStepChangeNotify;

        /**
         * 宗派至尊皇城神兽等级通知
         */
        m_stZZHCBossLevelNotify: GuildZZHCBossLevelSSNotify;

        /**
         * 新来拍卖商品通知
         */
        m_stPaiMaiNewNotify: GuildPaiMaiNewSSNotify;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_Apply_Notify {
        /**
         * 通知给谁
         */
        m_stRoleID: RoleID;

        /**
         * 申请的宗派个数
         */
        m_ucNumber: number;

        /**
         * 申请宗派id数组
         */
        m_auiGuildIDArray: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_Join_Notify {
        /**
         * 通知给谁
         */
        m_stRole: RoleID;

        /**
         * 宗派ID
         */
        m_uiGuildID: number;

        /**
         * 宗派资金
         */
        m_uiGuildMoney: number;

        /**
         * 宗派等级
         */
        m_ucGuildLevel: number;

        /**
         * 宗派名字
         */
        m_szGuildName: string;

        /**
         * 加入宗派后, 当前宗派是否有群英会权益
         */
        m_ucGuildPVPGrade: number;

        /**
         * 加入宗派时间
         */
        m_uiJoinTime: number;

        /**
         * 宗派Boss等级
         */
        m_usBossLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_ProcessApply_Notify {
        /**
         * 申请者
         */
        m_stApplicantRoleID: RoleID;

        /**
         * 批准者
         */
        m_stApproverRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_KickRole_Notify {
        /**
         * 被踢的角色
         */
        m_stTargetRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_RoleGradeChange_Notify {
        /**
         * 职位
         */
        m_usGrade: number;

        /**
         * 被修改的角色
         */
        m_stTargetRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_Money_Notify {
        /**
         * 成员列表
         */
        m_stDismissRoleList: GuildDismissRoleList;

        /**
         * 资产
         */
        m_uiMoney: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildDismissRoleList {
        /**
         * 个数
         */
        m_ucNumber: number;

        /**
         * 成员数组
         */
        m_stRoleID: Array<RoleID>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_Dismiss_SS_Notify {
        /**
         * 成员列表
         */
        m_stDismissRoleList: GuildDismissRoleList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildLevelSSNotify {
        /**
         * 宗派等级
         */
        m_ucLevel: number;

        /**
         * 成员列表
         */
        m_stDismissRoleList: GuildDismissRoleList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildTreasureHuntStepChangeNotify {
        /**
         * 通知给谁
         */
        m_stRole: RoleID;

        /**
         * 宗派探矿公共信息
         */
        m_stCommonData: GuildTreasureHuntData;

        /**
         * 宗派探矿个人信息
         */
        m_stPersonalData: GuildTreasureHuntPersonalData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildZZHCBossLevelSSNotify {
        /**
         * 成员列表
         */
        m_stDismissRoleList: GuildDismissRoleList;

        /**
         * Boss等级
         */
        m_iBossLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildPaiMaiNewSSNotify {
        /**
         * GUILD_PAIMAI_GUILD_PROSESS宗派拍卖 GUILD_PAIMAI_WORLD_PROSESS世界拍卖
         */
        m_iProsess: number;

        /**
         * 成员列表
         */
        m_stDismissRoleList: GuildDismissRoleList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_PVP_CS_Request {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: GuildPVPCSRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildPVPCSRequestValue {
        /**
         * 查询宗门战面板信息, 站位符
         */
        m_usOpenPanelReq: number;

        /**
         * 领取宗门战奖励请求, 站位符
         */
        m_usDoRewardReq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Guild_PVP_CS_Response {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: GuildPVPCSResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildPVPCSResponseValue {
        /**
         * 宗派战-结果面板
         */
        m_stGuildPVPInfoRes: GuildPVPBattleInfoRes;

        /**
         * 领取宗门战奖励请求. 返回表示操作成功
         */
        m_ucDoRewardRes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HFActInfo_Request {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: HFRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HFRequestValue {
        /**
         * 打开合服活动累计充值面板，占位
         */
        m_ucHFHDOpenLJCZPanel: number;

        /**
         * 领取合服活动累计充值奖励，档次ID
         */
        m_ucHFHDGetBit: number;

        /**
         * 打开合服活动累计消费面板，占位
         */
        m_ucHFHDOpenLJXFPanel: number;

        /**
         * 领取合服活动累计消费奖励，档次ID
         */
        m_ucHFHDLJXFGetBit: number;

        /**
         * 打开合服活动_七天登陆面板，占位
         */
        m_ucHFHDOpenQTDLPanel: number;

        /**
         * 领取合服活动_七天登陆奖励，配置ID
         */
        m_ucHFHDGetQTDLReward: number;

        /**
         * 合服活动_至尊夺宝打开面板 占位
         */
        m_ucHFHDHFZZDBPannel: number;

        /**
         * 合服活动 招财猫打开面板 占位
         */
        m_ucHFHDZCMPannel: number;

        /**
         * 合服活动 招财猫领取奖励 配置ID
         */
        m_ucHFHDZCMReward: number;

        /**
         * 合服活动 宝箱有礼打开面板 占位
         */
        m_ucHFHDBXYLOpenPannle: number;

        /**
         * 合服活动 宝箱有礼购买宝箱 次数
         */
        m_ucHFHDBXYLBuyChest: number;

        /**
         * 合服活动 宝箱有礼商店兑换 道具ID
         */
        m_iHFHDBXYLShopExchange: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HFActInfo_Response {
        /**
         * 请求操作协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 合服第几天, 合服当天算1天
         */
        m_iMergeDay: number;

        /**
         * 协议体
         */
        m_stValue: HFResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HFResponseValue {
        /**
         * 打开合服活动_累计充值面板响应
         */
        m_stHFHDOpenLJCZPanelRsp: HFLJCZInfo;

        /**
         * 领取合服活动_累计充值奖励响应
         */
        m_stHFHDGetLJCZRewardRsp: HFLJCZInfo;

        /**
         * 打开合服活动累计消费面板
         */
        m_stHFHDOpenLJXFPanelRsp: HFLJXFInfo;

        /**
         * 领取合服活动累计消费奖励
         */
        m_stHFHDGetLJXFRewardRsp: HFLJXFInfo;

        /**
         * 打开合服活动_七天签到面板
         */
        m_stHFHDOpenQTDLPanelRsp: HFQDTLInfo;

        /**
         * 领取合服活动_七天签到奖励
         */
        m_stHFHDGetQTDLReward: HFQDTLInfo;

        /**
         * 合服活动_至尊夺宝打开面板
         */
        m_stHFHDHFZZDBPannel: ZZZDOpenPanelRsp;

        /**
         * 合服活动 招财猫打开面板
         */
        m_stHFHDZCMPannel: HFZCMInfo;

        /**
         * 合服活动 招财猫领取奖励
         */
        m_stHFHDZCMReward: HFZCMRewardRsp;

        /**
         * 合服活动 宝箱有礼打开面板
         */
        m_ucHFHDBXYLOpenPannle: HFBXYLInfo;

        /**
         * 合服活动 宝箱有礼购买宝箱
         */
        m_ucHFHDBXYLBuyChest: HFBXYLBuyRsp;

        /**
         * 合服活动 宝箱有礼商店兑换
         */
        m_ucHFHDBXYLShopExchange: HFBXYLInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HFLJCZInfo {
        /**
         * 累积充值数额
         */
        m_uiLJZCValue: number;

        /**
         * 按位，领取了第几档. 由于已实现了, 所以不改名了
         */
        m_ucGetBitMap: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HFLJXFInfo {
        /**
         * 累积消费数额
         */
        m_uiLJXFValue: number;

        /**
         * 按位，领取了第几档. 由于已实现了, 所以不改名了
         */
        m_ucGetBitMap: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HFQDTLInfo {
        /**
         * 角色登陆签到信息. 按位取. 从1开始
         */
        m_iSignFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HFZCMInfo {
        /**
         * 合服期间累计充值
         */
        m_uiAccCharge: number;

        /**
         * 按位，领取了第几档
         */
        m_ucGetBitMap: number;

        /**
         * 记录数量
         */
        m_ucCount: number;

        /**
         * 记录数量
         */
        m_stRecordList: Array<HFZCMRecord>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HFZCMRecord {
        /**
         * 名字
         */
        m_szName: string;

        /**
         * 数量
         */
        m_iValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HFZCMRewardRsp {
        /**
         * 本次返利
         */
        m_iCurReward: number;

        /**
         * 招财猫数据
         */
        m_stZCMInfo: HFZCMInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HFBXYLInfo {
        /**
         * 免费总次数
         */
        m_iBuyCount: number;

        /**
         * 当前积分
         */
        m_iCurScore: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HFBXYLBuyRsp {
        /**
         * 获得
         */
        m_stList: SimItemList;

        /**
         * 宝箱有礼数据
         */
        m_stBXYLInfo: HFBXYLInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SimItemList {
        /**
         * 道具个数
         */
        m_ucCount: number;

        /**
         * 道具信息
         */
        m_astList: Array<SimItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HYDOperate_Request {
        /**
         * 活跃度操作协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: HYDOperateReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HYDOperateReqValue {
        /**
         * 活跃度查询协议请求，此字段不用填,默认0即可
         */
        m_ucList: number;

        /**
         * 活跃度领取礼包请求，领取礼包的对应索引位置
         */
        m_ucGetGiftIndex: number;

        /**
         * 活跃度领取每日累计礼包请求，领取礼包的对应索引位置
         */
        m_ucGetDayGiftId: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HYDOperate_Response {
        /**
         * 响应结果
         */
        m_ushResultID: number;

        /**
         * 活跃度操作协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: HYDOperateRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HYDOperateRspValue {
        /**
         * 活跃度查询协议响应
         */
        m_stListDataRsp: HYDOperateListRsp;

        /**
         * 返回玩家已经领取的礼包信息
         */
        m_stGiftInfo: HYDOperateGetGiftRsp;

        /**
         * 返回玩家每日已经领取的礼包信息
         */
        m_stDayGiftInfo: HYDOperateGetDayGiftRsp;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HYDOperateListRsp {
        /**
         * 当天已领取各项活跃度奖励信息，按位存储，1是已领取，0是未领取
         */
        m_ucGetDayGiftFlag: number;

        /**
         * 玩家已经领取的礼包信息，按位标识(位置0无意义)，1标识已领取，0 标识未领取
         */
        m_szHaveGetGiftInfo: Array<number>;

        /**
         * 玩家当天的累计活跃度
         */
        m_uiDailyActNum: number;

        /**
         * 玩家总共累积活跃度
         */
        m_uiTotalActNum: number;

        /**
         * 玩家各项活跃度的完成进度
         */
        m_stProgressInfo: Array<HYDProgressInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HYDProgressInfo {
        /**
         * 进度数，0xfffffff表示这个活跃度已经拿满，显示为已完成即可
         */
        m_uiNum: number;

        /**
         * 活跃度唯一索引
         */
        m_ucID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HYDOperateGetGiftRsp {
        /**
         * 当天已领取各项活跃度奖励信息，按位存储，1是已领取，0是未领取
         */
        m_szGetOneGiftFlag: Array<number>;

        /**
         * 本次领取礼包的对应索引位置
         */
        m_ucGetGiftIndex: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HYDOperateGetDayGiftRsp {
        /**
         * 当天已领取各项活跃度奖励信息，按位存储，1是已领取，0是未领取
         */
        m_ucGetDayGiftFlag: number;

        /**
         * 本次领取礼包的对应索引位置
         */
        m_ucGetGiftIndex: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeroSub_Drug_Request {
        /**
         * 子系统类型
         */
        m_ucType: number;

        /**
         * HERO_SUB_DRUG_TYPE_CZ成长丹 HERO_SUB_DRUG_TYPE_ZZ资质丹
         */
        m_ucDrugType: number;

        /**
         * 操作类型，0 使用，1 批量使用
         */
        m_ucOpType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeroSub_ImageChange_Notify {
        /**
         * 形象id
         */
        m_uiImageId: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeroSub_ImageLevel_Request {
        /**
         * 子系统类型
         */
        m_ucType: number;

        /**
         * 设置化形的ID
         */
        m_uiImageID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeroSub_List_Request {
        /**
         * 占位
         */
        m_ucTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeroSub_List_Response {
        /**
         * 响应结果
         */
        m_iResult: number;

        /**
         * 数据列表
         */
        m_stList: CSHeroSubList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeroSub_Lucky_Request {
        /**
         * 子系统类型
         */
        m_ucType: number;

        /**
         * 操作类型，1保留幸运值，2补满幸运值
         */
        m_ucOperate: number;

        /**
         * 购买多少幸运值
         */
        m_uiParam: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeroSub_One_Notify {
        /**
         * 响应结果
         */
        m_iResult: number;

        /**
         * Req的MsgID
         */
        m_iReqMsgID: number;

        /**
         * 数据
         */
        m_stData: CSHeroSubData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeroSub_Show_Request {
        /**
         * 子系统类型
         */
        m_ucType: number;

        /**
         * 设置化形的ID
         */
        m_uiImageID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeroSub_Spec_Request {
        /**
         * 子系统类型
         */
        m_ucType: number;

        /**
         * 操作类型
         */
        m_ucOperate: number;

        /**
         * 协议体
         */
        m_stValue: HeroSubSpecReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeroSubSpecReqValue {
        /**
         * 子系统，天珠镶嵌, 镶嵌的位置
         */
        m_ucTZMountReq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HeroSub_Wish_Request {
        /**
         * 子系统类型
         */
        m_ucType: number;

        /**
         * 是否自动购买 加了超级丹 优先级低于自动购买
         */
        m_ucAutoBuy: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HideSightRole_Request {
        /**
         * 按位隐藏
         */
        m_iHideLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HideSight_Notify {
        /**
         * 0是显示视野，1是隐藏视野
         */
        m_iFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HideUI_Notify {
        /**
         * 0表示关闭，1表示显示
         */
        m_ucShow: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuMerge_Request {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: HunGuMergeRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuMergeRequestValue {
        /**
         * 魂骨升华
         */
        m_stHunGuUpColorReq: HunGuUpColorReq;

        /**
         * 魂骨新合成
         */
        m_stHunGuCreateReq: HunGuCreateReq;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuUpColorReq {
        /**
         * 合成目标物品id
         */
        m_iTargetID: number;

        /**
         * 带过来的物品信息列表
         */
        m_stContainerThingObjList: SimpleContainerThingObjList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SimpleContainerThingObjList {
        /**
         * 物品数量
         */
        m_iThingNumber: number;

        m_astSimpleContainerThingInfo: Array<SimpleContainerThingInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SimpleContainerThingInfo {
        /**
         * 物品ID
         */
        m_iThingID: number;

        /**
         * 物品位置
         */
        m_usPosition: number;

        /**
         * 物品数量
         */
        m_iNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuCreateReq {
        /**
         * 合成目标物品id
         */
        m_iTargetID: number;

        /**
         * 带过来的物品信息列表
         */
        m_stContainerThingObjList: SimpleContainerThingObjList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuMerge_Response {
        /**
         * 响应结果 0合成失败 1合成成功
         */
        m_ushResultID: number;

        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: HunGuMergeResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuMergeResponseValue {
        /**
         * 魂骨升华
         */
        m_stHunGuUpColorRsp: HunGuUpColorRsp;

        /**
         * 魂骨新合成
         */
        m_stHunGuCreateRsp: HunGuCreateRsp;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuUpColorRsp {
        /**
         * 升华后装备物品
         */
        m_stContainerThing: ContainerThingObj;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunGuCreateRsp {
        /**
         * 合成后装备物品
         */
        m_stContainerThing: ContainerThingObj;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunLi_Request {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: HunLiReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunLiReqValue {
        /**
         * 魂力升级
         */
        m_stHunLiLevelReq: HunLiLevelUpReq;

        /**
         * 魂力奖励
         */
        m_stHunLiRewardReq: HunLiRewardReq;

        /**
         * 魂环注入
         */
        m_stHunHuanZhuRuReq: HunHuanZhuRuReq;

        /**
         * 魂环激活
         */
        m_uiHunHuanActiveID: number;

        /**
         * 魂环升级
         */
        m_uiHunHuanLevelUpID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunLiLevelUpReq {
        /**
         * 魂力等级
         */
        m_iHunLiLevel: number;

        /**
         * 魂力子等级
         */
        m_iHunLiSubLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunLiRewardReq {
        /**
         * 魂力等级
         */
        m_iHunLiLevel: number;

        /**
         * 魂力子等级
         */
        m_iHunLiSubLevel: number;

        /**
         * 条件 第几个
         */
        m_iConditionID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunHuanZhuRuReq {
        /**
         * 配置ID
         */
        m_iHunHuanID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunLi_Response {
        /**
         * 错误码
         */
        m_iResult: number;

        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: HunLiRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunLiRspValue {
        /**
         * 魂力回复
         */
        m_stHunLiRsp: HunLiPannelInfo;

        /**
         * 魂力奖励 回复
         */
        m_stHunLiRewardRsp: HunLiPannelInfo;

        /**
         * 魂力条件达成通知
         */
        m_stHunLiFinishNotify: HunLiPannelInfo;

        /**
         * 魂环注入
         */
        m_stHunHuanZhuRuRsp: HunHuanZhuRuRsp;

        /**
         * 魂环激活
         */
        m_uiHunHuanActiveID: number;

        /**
         * 魂环升级回复
         */
        m_stHunHuanLevelUpRsp: HunHuanLevelUpRsp;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunLiPannelInfo {
        /**
         * 魂力信息
         */
        m_stHunLiInfo: HunLiInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunHuanZhuRuRsp {
        /**
         * 配置ID
         */
        m_iHunHuanID: number;

        /**
         * 注入进度
         */
        m_iProgressValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HunHuanLevelUpRsp {
        /**
         * 配置ID
         */
        m_iHunHuanID: number;

        /**
         * 等级
         */
        m_ucLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ImageOverDue_Response {
        /**
         * 回复类型
         */
        m_usType: number;

        /**
         * 结构
         */
        m_stValue: Image_OverDue_Notify;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Image_OverDue_Notify {
        /**
         * 灵宝形象id
         */
        m_uiLingBaoId: number;

        /**
         * 武缘形象id
         */
        m_uiBeautyId: number;

        /**
         * 子系统形象id
         */
        m_uiHeroSubImageId: number;

        /**
         * 时装形象id
         */
        m_uiDressId: number;

        /**
         * 极限挑战称号等级
         */
        m_uiTitleLv: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class InterruptSkill_Request {
        /**
         * 保留字段
         */
        m_ucReserved: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ItemMerge_Request {
        /**
         * 合成目标物品id
         */
        m_uiTargetID: number;

        /**
         * 合成目标物品数量
         */
        m_uiTargetNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ItemMerge_Response {
        /**
         * 响应结果，合成的目标物品id
         */
        m_uiTargetID: number;

        /**
         * 响应结果，合成的目标物品数量
         */
        m_uiTargetNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ItemTransport_Request {
        /**
         * 传送道具类型
         */
        m_ucTransportType: number;

        /**
         * 目标传送场景
         */
        m_iSceneID: number;

        /**
         * 部分传送需要传送到固定位置或者NPC附近
         */
        m_stPositionInfo: ItemTransportParameter;

        /**
         * 给前台的透传字段，为了前台在跳转时自动打开任务面板
         */
        m_iQuestFeedback: number;

        /**
         * 给前台的透传字段，跳跃类型(TRANS_TYPE_宏)
         */
        m_ucExtraType: number;

        /**
         * 随机半径
         */
        m_iRdmRadius: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ItemTransportParameter {
        /**
         * 固定位置
         */
        m_stUnitPosition: UnitPosition;

        /**
         * NPC附近
         */
        m_iNPCID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ItemTransport_Response {
        /**
         * 结果
         */
        m_iResult: number;

        /**
         * 回传给前台的跳转NPCID
         */
        m_iNPCID: number;

        /**
         * 玩家在有vip飞行限次的时候，已用免费飞行次数。无vip或无限制飞的时候，值是0
         */
        m_ucFlightNum: number;

        /**
         * 给前台的透传字段，为了前台在跳转时自动打开任务面板
         */
        m_iQuestFeedback: number;

        /**
         * 给前台的透传字段，跳跃类型(TRANS_TYPE_宏)
         */
        m_ucExtraType: number;

        /**
         * (TRANS_TYPE_时)后台确定的坐标
         */
        m_stUnitPosition: UnitPosition;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JiuXing_Request {
        /**
         * 道宫九星的类型
         */
        m_usType: number;

        /**
         * 道宫九星内容消息体
         */
        m_stValue: JiuXingRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JiuXingRequestValue {
        /**
         * 道宫九星-打开面板 占位
         */
        m_ucOpenPanelRequest: number;

        /**
         * 道宫九星-请求升级
         */
        m_stUpgradeRequest: JiuXingReqUpgrade;

        /**
         * 祝福值保留 占位
         */
        m_ucKeepReq: number;

        /**
         * 祝福值补满 需补满的数值
         */
        m_uiFillReq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JiuXingReqUpgrade {
        /**
         * 传道宫九星的类型值
         */
        m_ucType: number;

        /**
         * 是否自动购买 加了超级丹 优先级低于自动购买
         */
        m_ucAutoBuy: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JiuXing_Response {
        /**
         * 道宫九星的类型
         */
        m_usType: number;

        /**
         * 道宫九星内容消息体
         */
        m_stValue: JiuXingResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JiuXingResponseValue {
        /**
         * 道宫九星-面板信息响应
         */
        m_stOpenPanelResponse: JiuXingList;

        /**
         * 道宫九星-升级响应信息
         */
        m_stUpgradeLevelResponse: JiuXingList;

        /**
         * 祝福值保留 响应信息
         */
        m_stKeepRsp: JiuXingList;

        /**
         * 祝福值补满 响应信息
         */
        m_stFillRsp: JiuXingList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JiuXingList {
        /**
         * 道宫九星的等级
         */
        m_usLevel: number;

        /**
         * 当前祝福值
         */
        m_uiLucky: number;

        /**
         * 保留祝福值
         */
        m_uiSaveLucky: number;

        /**
         * 祝福时间
         */
        m_uiLuckyTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JuYuanNotify {
        /**
         * 聚元的消息类型
         */
        m_stData: JuYuanInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JuYuanInfo {
        /**
         * 聚元的类型
         */
        m_ucType: number;

        /**
         * 聚元等级
         */
        m_ucLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JuYuanUpgrade_Request {
        /**
         * 占位
         */
        m_ucTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JuYuanUpgrade_Response {
        /**
         * 操作返回值
         */
        m_iResultID: number;

        /**
         * 聚元的消息类型
         */
        m_stData: JuYuanInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JuYuan_Request {
        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class JuYuan_Response {
        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        m_stData: JuYuanInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFActInfo_Request {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: KFRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFRequestValue {
        /**
         * 打开挑战BOSS面板，Boss类型
         */
        m_ucBossType: number;

        /**
         * 领取挑战BOSS奖励，配置ID
         */
        m_uiGetID: number;

        /**
         * 打开至尊争夺面板，占位
         */
        m_ucZZZDOpenPanel: number;

        /**
         * 打开累计充值面板，占位
         */
        m_ucOpenLJCZPanel: number;

        /**
         * 领取累计充值奖励，档次ID
         */
        m_ucGetBit: number;

        /**
         * 打开进阶日活动面板，占位
         */
        m_ucOpenKFJJRPanel: number;

        /**
         * 领取进阶日活动奖励，配置ID
         */
        m_iStageDayId: number;

        /**
         * 打开一元夺宝，占位
         */
        m_ucYYDBOpenPanel: number;

        /**
         * 一元夺宝领取充值奖励，占位
         */
        m_ucYYDBGetGift: number;

        /**
         * 一元夺宝参与，占位
         */
        m_ucYYDBJoin: number;

        /**
         * 开服返利 打开面板 占位
         */
        m_ucKFXFFLOpen: number;

        /**
         * 开服返利 领取奖励
         */
        m_ucKFXFFLGet: number;

        /**
         * 7天累计充值 打开面板
         */
        m_uc7DayLJCZOpen: number;

        /**
         * 7天累计充值 领取奖励 配置ID
         */
        m_uc7DayLJCZGet: number;

        /**
         * 活动_开服连充返利 打开面板 占位
         */
        m_uiKFLCFLOpen: number;

        /**
         * 活动_开服连充返利 领取奖励  Type * 10000 + ID
         */
        m_uiKFLCFLGet: number;

        /**
         * 开服返利 打开面板 占位
         */
        m_ucKFXFLBOpen: number;

        /**
         * 开服返利 领取奖励的档次
         */
        m_ucKFXFLBGet: number;

        /**
         * VIP商店 打开面板
         */
        m_ucVIPShopPanel: number;

        /**
         * VIP商店 购买
         */
        m_stVIPShopBuyReq: VIPShopBuyReq;

        /**
         * 开服 BOSS召唤面板 占位
         */
        m_ucBossSummon: number;

        /**
         * 开服 BOSS召唤,召唤类型
         */
        m_ucSummonType: number;

        /**
         * 充值狂欢折扣充值
         */
        m_stHappyChargeRebateReq: HappyChargeRebateReq;

        /**
         * 进阶日排行面板
         */
        m_ucJJRRankPannel: number;

        /**
         * 开服 BOSS召唤,定制提醒
         */
        m_usSummonWarn: number;

        /**
         * 开服 招财猫 打开面板
         */
        m_ucLuckyCatPannelReq: number;

        /**
         * 开服 招财猫 抽奖
         */
        m_ucLuckyCatDrawReq: number;

        /**
         * 直购礼包打开面板
         */
        m_ucZGLBOpenReq: number;

        /**
         * 直购礼包领取礼包,领取id
         */
        m_ucZGLBGetReq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPShopBuyReq {
        /**
         * 购买ID
         */
        m_iID: number;

        /**
         * 数量
         */
        m_iNum: number;

        /**
         * 白银 黄金 钻石特权 VIPPRI_1 VIPPRI_2 VIPPRI_3
         */
        m_iVipLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class HappyChargeRebateReq {
        /**
         * 折扣ID
         */
        m_uiRebateID: number;

        /**
         * 折扣充值额度
         */
        m_uiCharge: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFActInfo_Response {
        /**
         * 请求操作协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: KFResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFResponseValue {
        /**
         * 打开挑战BOSS面板响应
         */
        m_stOpenCBPanelRsp: BossActInfoRsp;

        /**
         * 领取挑战BOSS活动奖励响应
         */
        m_stGetCBRewardRsp: BossActInfoRsp;

        /**
         * 打开至尊争夺板响应
         */
        m_stZZZDOpenPanelRsp: ZZZDOpenPanelRsp;

        /**
         * 打开累计充值面板响应
         */
        m_stOpenLJCZPanelRsp: LJCZInfo;

        /**
         * 领取累计充值奖励响应
         */
        m_stGetLJCZRewardRsp: LJCZInfo;

        /**
         * 打开进阶日活动面板响应
         */
        m_stStageDayPanelRsp: StageDayInfo;

        /**
         * 领取进阶日活动奖励响应
         */
        m_stGetStageDayRewardRsp: StageDayInfo;

        /**
         * 打开一元夺宝响应
         */
        m_stYYDBOpenPanelRsp: YYDBInfoRsp;

        /**
         * 一元夺宝领取充值奖励响应,占位
         */
        m_ucYYDBGetGiftRsp: number;

        /**
         * 一元夺宝参与响应,全服已参与人数
         */
        m_ucYYDBJoinRsp: number;

        /**
         * 开服消费返利 打开面板
         */
        m_stKFXFFLOpenRsp: CSKaiFuXFFLInfo;

        /**
         * 开服消费返利 领取奖励
         */
        m_stKFXFFLGetRsp: CSKaiFuXFFLInfo;

        /**
         * 7天累计充值 打开面板
         */
        m_st7DayLJCZOpen: CS7DayLJCZInfo;

        /**
         * 7天累计充值 领取奖励
         */
        m_st7DayLJCZGet: CS7DayLJCZInfo;

        /**
         * 活动_开服连充返利 打开面板
         */
        m_stKFLCFLOpen: CSKFLCFLInfo;

        /**
         * 活动_开服连充返利 领取奖励
         */
        m_stKFLCFLGet: CSKFLCFLInfo;

        /**
         * 开服消费礼包 打开面板
         */
        m_stKFXFLBOpenRsp: KaiFuXFLBInfo;

        /**
         * 开服消费礼包 领取奖励
         */
        m_stKFXFLBGetRsp: KaiFuXFLBInfo;

        /**
         * VIP商店 打开面板
         */
        m_stVIPShopPanel: VIPShopInfo;

        /**
         * VIP商店 购买
         */
        m_stVIPShopBuyRsp: VIPShopInfo;

        /**
         * 开服 BOSS召唤面板 响应
         */
        m_stBossSummonPanelRsp: BossSummonPanelInfo;

        /**
         * 开服 BOSS召唤 响应
         */
        m_stBossSummonRsp: BossSummonInfo;

        /**
         * 充值狂欢充值折扣
         */
        m_uiChargeNum: number;

        /**
         * 进阶日排行面板响应
         */
        m_stStageDayRankPannel: StageDayRankPannel;

        /**
         * 开服 BOSS召唤 定制提醒响应
         */
        m_usBossSummonWarnRsp: number;

        /**
         * 开服 招财猫打开面板响应
         */
        m_stLuckyCatPannelRsp: LuckyCatOpenPannelRsp;

        /**
         * 开服 招财猫抽奖响应
         */
        m_stLuckyCatDrawRsp: LuckyCatDrawRsp;

        /**
         * 直购礼包打开面板响应
         */
        m_stZGLBOpenRsp: ZGLBOpenRsp;

        /**
         * 直购礼包领取礼包响应
         */
        m_stZGLBGetRsp: ZGLBGetRsp;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BossActInfoRsp {
        /**
         * 数组大小
         */
        m_ucCount: number;

        /**
         * 数组
         */
        m_stBossInfoList: Array<NewBossActInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NewBossActInfo {
        /**
         * BOSSID
         */
        m_uiBossID: number;

        /**
         * 奖励领取状态(0-未达成，1-达成，2-已领取)
         */
        m_ucStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LJCZInfo {
        /**
         * 累积充值数额
         */
        m_uiLJZCValue: number;

        /**
         * 按位，领取了第几档
         */
        m_usGetBitMap: number;

        /**
         * 累积充值时间
         */
        m_iDay: number;

        /**
         * 累积充值类型，LJCZ_TYPE_START，LJCZ_TYPE_LOOP。如果是0表示合服7天中
         */
        m_iType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StageDayInfo {
        /**
         * 进阶日类型
         */
        m_ucType: number;

        /**
         * 今日充值
         */
        m_uiDailyCharge: number;

        /**
         * m_iIDList实际长度
         */
        m_ucNumber: number;

        /**
         * 进阶日列表状态
         */
        m_stOneStatusList: Array<OneStageDayStatus>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneStageDayStatus {
        /**
         * 配置ID
         */
        m_iCfgID: number;

        /**
         * 1.不可领取 2.可领取 3.已领取	见宏GOD_LOAD_AWARD_DONE_GET
         */
        m_ucStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class YYDBInfoRsp {
        /**
         * 充值礼包状态，0未充值，1已充值可领取，2已领取
         */
        m_ucGetStatus: number;

        /**
         * 角色参加夺宝次数
         */
        m_ucJoinNum: number;

        /**
         * 全服参与夺宝人数
         */
        m_ucAllJoinNum: number;

        /**
         * 奖励配置信息
         */
        m_stCfgInfo: YYDBCfgInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class YYDBCfgInfo {
        /**
         * 夺宝奖励,位置0是每人可得奖励，1-4是档次奖励
         */
        m_stGiftCfg: Array<YYDBGifeOneCfg>;

        /**
         * 充值奖励,物品信息
         */
        m_stChargeCfg: Array<GiftItemInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class YYDBGifeOneCfg {
        /**
         * 夺宝奖励,位置0是每人可得奖励，1-4是档次奖励
         */
        m_iThingId: number;

        /**
         * 充值奖励
         */
        m_iThingNum: number;

        /**
         * 条件
         */
        m_iCondition: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GiftItemInfo {
        /**
         * 附件物品ID
         */
        m_iThingID: number;

        /**
         * 附件物品数量
         */
        m_iThingNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPShopInfo {
        /**
         * 第几天奖励
         */
        m_ucDay: number;

        /**
         * 白银特权已购数量
         */
        m_ucCount: number;

        /**
         * 白银特权已购买物品列表
         */
        m_stBuyList: Array<VIPShopItem>;

        /**
         * 黄金特权已购数量
         */
        m_ucHJCount: number;

        /**
         * 黄金特权已购买物品列表
         */
        m_stHJBuyList: Array<VIPShopItem>;

        /**
         * 钻石特权已购数量
         */
        m_ucZSCount: number;

        /**
         * 钻石特权已购买物品列表
         */
        m_stZSBuyList: Array<VIPShopItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPShopItem {
        /**
         * 道具ID
         */
        m_iItemID: number;

        /**
         * 道具个数
         */
        m_iItemCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BossSummonPanelInfo {
        /**
         * 累计充值金额
         */
        m_uiChargeValue: number;

        /**
         * 剩余召唤点数
         */
        m_uiLeftValue: number;

        /**
         * 剩余冷却时间
         */
        m_uiLeftTime: number;

        /**
         * 召唤boss信息
         */
        m_SummonBossList: SummonBossList;

        /**
         * 定制提醒，按位取
         */
        m_usWarnSelect: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SummonBossList {
        /**
         * boss种类数量
         */
        m_iBossTypeNum: number;

        /**
         * boss数组
         */
        m_astBossList: Array<SummonBossInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SummonBossInfo {
        /**
         * boss剩余数量
         */
        m_iBossNumber: number;

        /**
         * bossID
         */
        m_iBossID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BossSummonInfo {
        /**
         * BOSS召唤类型
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StageDayRankPannel {
        /**
         * 我的排名
         */
        m_iMyRank: number;

        /**
         * 使用进阶丹个数
         */
        m_iUsedCount: number;

        /**
         * 差X个进阶丹可上榜
         */
        m_iNeedCost: number;

        /**
         * 今日配置
         */
        m_stCfgInfo: StageDayRankCfg_Server;

        /**
         * 排名个数
         */
        m_iRankCount: number;

        /**
         * 排名个数
         */
        m_stRankList: Array<StageDayRankOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StageDayRankCfg_Server {
        /**
         * 0唯一配置ID
         */
        m_iID: number;

        /**
         * 0第几天开启
         */
        m_iDay: number;

        /**
         * 0是否循环
         */
        m_bLoop: number;

        /**
         * 0类型
         */
        m_ucType: number;

        /**
         * 0参与人数
         */
        m_iNumber: number;

        /**
         * 0保底消耗
         */
        m_iConsume: number;

        /**
         * 0消耗道具ID
         */
        m_iCostItemID: number;

        /**
         * 0物品
         */
        m_stFirstItem: Array<TwoIntElement>;

        /**
         * 0物品
         */
        m_stOtherItem: Array<TwoIntElement>;

        /**
         * 0模型类型
         */
        m_ucModelType: number;

        /**
         * 0模型ID
         */
        m_iModelID: number;

        /**
         * 0模型名字
         */
        m_szModelName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TwoIntElement {
        /**
         * 第一个值
         */
        m_uiOne: number;

        /**
         * 第二个值
         */
        m_uiTwo: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StageDayRankOne {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 角色Name
         */
        m_szName: string;

        /**
         * 今日消耗个数
         */
        m_iCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LuckyCatOpenPannelRsp {
        /**
         * 当前招财猫的记录个数
         */
        m_ucRecordCount: number;

        /**
         * 抽奖记录
         */
        m_astDrawRecord: Array<LuckyCatRecord>;

        /**
         * 抽奖档次
         */
        m_ucDrawLevel: number;

        /**
         * 累计次数 抽中最高奖清0
         */
        m_ucDrawTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LuckyCatRecord {
        /**
         * 获奖者名字
         */
        m_szName: string;

        /**
         * 倍数
         */
        m_ucMultiple: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LuckyCatDrawRsp {
        /**
         * 抽中的 ID
         */
        m_ucDrawedID: number;

        /**
         * 累计次数 抽中最高奖清0
         */
        m_ucDrawTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZGLBOpenRsp {
        /**
         * 已领取记录,从第一位开始取
         */
        m_usGetFlag: number;

        /**
         * 可领取记录,从第一位开始取
         */
        m_usCanFlag: number;

        /**
         * 配置个数
         */
        m_iCfgCount: number;

        /**
         * 配置数据
         */
        m_stCfgList: Array<ZGLBCfg_Server>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZGLBCfg_Server {
        /**
         * 0唯一配置ID
         */
        m_iID: number;

        /**
         * 0充值额度
         */
        m_iCondition: number;

        /**
         * 0充值额度
         */
        m_uiCharge: number;

        /**
         * 0天数
         */
        m_iCondition2: number;

        /**
         * 0循环类型
         */
        m_iType: number;

        /**
         * 0物品总数
         */
        m_uiNum: number;

        /**
         * 奖励物品
         */
        m_stThingList: Array<ZGLBItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZGLBItem {
        /**
         * 物品ID
         */
        m_uiID: number;

        /**
         * 物品个数
         */
        m_uiCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZGLBGetRsp {
        /**
         * 本次领取的id
         */
        m_ucGetID: number;

        /**
         * 领取记录,从第一位开始取
         */
        m_usGetFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFMRMBGetInfo_Request {
        /**
         * 占位
         */
        m_ucTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFMRMBGetInfo_Response {
        /**
         * 响应结果，0 表成功
         */
        m_uiResultID: number;

        /**
         * 面板信息
         */
        m_stCSInfo: Array<CSKFMRMBGetInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSKFMRMBGetInfo {
        /**
         * 第几天
         */
        m_ucDay: number;

        /**
         * 个数
         */
        m_ucCount: number;

        /**
         * 状态列表
         */
        m_stStatusList: Array<CSKFMRMBOneStatus>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSKFMRMBOneStatus {
        /**
         * 配置ID
         */
        m_uiID: number;

        /**
         * 个人状态
         */
        m_ucStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFMRMBGetReward_Request {
        /**
         * 配置ID
         */
        m_uiID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFMRMBGetReward_Response {
        /**
         * 响应结果，0 表成功
         */
        m_uiResultID: number;

        /**
         * 一个状态
         */
        m_stOneStatus: CSKFMRMBOneStatus;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFQMCBGetInfo_Request {
        /**
         * 排行榜类型
         */
        m_ucRankType: number;

        /**
         * 开启日期
         */
        m_ucDay: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFQMCBGetInfo_Response {
        /**
         * 响应结果，0 表成功
         */
        m_uiResultID: number;

        /**
         * 排行榜类型
         */
        m_ucRankType: number;

        /**
         * 第一名信息
         */
        m_stFirst: BaseProfile;

        /**
         * 奖励条数
         */
        m_ucRewardNumber: number;

        /**
         * 奖励状态数据
         */
        m_stRewardInfo: Array<CSOneRewardInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSOneRewardInfo {
        /**
         * 配置ID
         */
        m_iID: number;

        /**
         * 奖励状态信息，0.不可领取 1.可领取 2.已领取
         */
        m_ucState: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFQMCBGetReward_Request {
        /**
         * 配置ID
         */
        m_iID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFQMCBGetReward_Response {
        /**
         * 响应结果，0 表成功
         */
        m_uiResultID: number;

        /**
         * 配置ID
         */
        m_iID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFQMCBGetRoleInfo_Request {
        /**
         * 排行榜类型
         */
        m_ucRankType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFQMCBGetRoleInfo_Response {
        /**
         * 响应结果，0 表成功
         */
        m_uiResultID: number;

        /**
         * 排行榜类型
         */
        m_ucRankType: number;

        /**
         * 我的排名,0表示未上榜
         */
        m_ucMyRank: number;

        /**
         * 我的排名值，0表示未上榜不显示
         */
        m_llMyRankValue: number;

        /**
         * 排行榜个数
         */
        m_ucCount: number;

        /**
         * 排行数据
         */
        m_astRankList: Array<CSOneQMCBRankInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSOneQMCBRankInfo {
        /**
         * 本榜排序主字段
         */
        m_llOrder1: number;

        /**
         * 角色BaseProInfo
         */
        m_stBaseProfile: BaseProfile;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFSCTGGetInfo_Request {
        /**
         * 占位
         */
        m_ucReserved: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFSCTGGetInfo_Response {
        /**
         * 响应结果，0 表成功
         */
        m_ucResultID: number;

        /**
         * 开服首充团购信息
         */
        m_stData: KFSCTGData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFSCTGData {
        /**
         * 开服第几天
         */
        m_ucOpenSvrDays: number;

        /**
         * 本服当日充值人数
         */
        m_uiFirstPayerNum: number;

        /**
         * 本人当日充值数
         */
        m_uiPayerCharge: number;

        /**
         * 奖励条数
         */
        m_ucRewardNumber: number;

        /**
         * 今天的奖励是否已经信息 0.不可领取，1可领取， 2.已领取
         */
        m_aucRewardStatus: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFSCTGGetReward_Request {
        /**
         * 奖励配置ID
         */
        m_ucRewardID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFSCTGGetReward_Response {
        /**
         * 响应结果，0 表成功
         */
        m_ucResultID: number;

        /**
         * 奖励配置ID
         */
        m_ucRewardID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFSCTGSendMsg_Request {
        /**
         * 占位
         */
        m_ucTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ListActivityLimit_Request {
        
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ListActivityLimit_Response {
        /**
         * 活动数目
         */
        m_ucNumber: number;

        /**
         * 各个活动的完成次数
         */
        m_stFinishTimes: Array<ActivityFinishTimes>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ActivityFinishTimes {
        /**
         * 活动ID
         */
        m_iID: number;

        /**
         * 完成次数
         */
        m_iFinishTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ListActivity_Request {
        
        m_ucNoUse: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ListActivity_Response {
        /**
         * 活动个数
         */
        m_ucNumber: number;

        /**
         * 当前活动状态
         */
        m_astActivityStatus: Array<ActivityStatus>;

        /**
         * 活动面板相关活动信息的个数
         */
        m_ucPanelNumber: number;

        /**
         * 所有在活动面板中列出来的活动相关信息，包括日常任务，副本等日常活动的信息
         */
        m_aucActivityPanelInfo: Array<ActivityPanelInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ActivityPanelInfo {
        /**
         * 该活动的索引,唯一标识
         */
        m_iIndex: number;

        /**
         * 该活动已完成的次数，0(未完成过)
         */
        m_ucCompleteCnt: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ListCrystal_Request {
        /**
         * 拉取星魂类型
         */
        m_cType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ListMenu_Request {
        /**
         * 有可能是副本ID, NPCID, MonserID...
         */
        m_iOwnerID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ListMenu_Response {
        /**
         * 有可能是副本ID, NPCID, MonserID...
         */
        m_iOwnerID: number;

        /**
         * 动态菜单列表
         */
        m_stMenuNodeList: MenuNodeList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MenuNodeList {
        /**
         * 菜单显示方式
         */
        m_ucShowType: number;

        m_szMenuCaption: string;

        /**
         * 菜单项个数
         */
        m_ucNumber: number;

        m_astMenuNode: Array<MenuNode>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MenuNode {
        /**
         * 菜单项索引
         */
        m_ucIndex: number;

        /**
         * 是否需要双重确认
         */
        m_ucReConfirm: number;

        /**
         * 是否有特效
         */
        m_cSpecialEffect: number;

        /**
         * 玩法ID
         */
        m_iRoleActivityID: number;

        /**
         * 对应副本ID
         */
        m_iPinstanceID: number;

        m_szCaption: string;

        m_szTips: string;

        /**
         * 二次确认的附加提示信息
         */
        m_szReconfirmInfo: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ListNearTeamInfo_Request {
        /**
         * 保留
         */
        m_ucReserve: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ListNearTeamInfo_Response {
        /**
         * 操作结果
         */
        m_ushResultID: number;

        /**
         * 附近的队伍的数量
         */
        m_ucTeamNum: number;

        /**
         * 附近的队伍的信息
         */
        m_stNearTeamInfo: Array<NearTeamInfo>;

        /**
         * 附近的队伍的玩家数量
         */
        m_ucRoleNum: number;

        /**
         * 附近的玩家信息
         */
        m_stNearRoleInfo: Array<NearRoleInfo>;

        /**
         * 所在队伍角色信息
         */
        m_stMemberList: TeamMemberList;

        /**
         * 所在队伍招募条件
         */
        m_stTeamRestriction: TeamRestriction;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NearTeamInfo {
        /**
         * 队伍的队长的基础信息
         */
        m_stBaseInfo: BaseProfile;

        /**
         * 队长的角色标识
         */
        m_stRoleID: RoleID;

        /**
         * 队长等级
         */
        m_usLevel: number;

        /**
         * 队伍最高等级
         */
        m_usMaxLevel: number;

        /**
         * 队伍平均等级
         */
        m_usAverageLevel: number;

        /**
         * 队伍人数
         */
        m_ucMemberNum: number;

        /**
         * 队长战力
         */
        m_uiCaptainFight: number;

        /**
         * 招募条件
         */
        m_stTeamRestriction: TeamRestriction;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TeamRestriction {
        /**
         * 是否允许队员邀请其他玩家,0否，1可以
         */
        m_ucMemberCanInvite: number;

        /**
         * 是否允许其他玩家加入,0否，1可以
         */
        m_ucCanOtherJoin: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NearRoleInfo {
        /**
         * 角色基本信息
         */
        m_stBaseInfo: BaseProfile;

        /**
         * 目标64位角色标识
         */
        m_stRoleID: RoleID;

        /**
         * 玩家等级
         */
        m_usLevel: number;

        /**
         * 战力
         */
        m_uiFight: number;

        /**
         * 宗派名字
         */
        m_szGuildName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TeamMemberList {
        
        m_ucNumber: number;

        m_astTeamMemberDetail: Array<TeamMemberInfoForNotify>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TeamMemberInfoForNotify {
        
        m_stRoleID: RoleID;

        /**
         * 等级
         */
        m_usLevel: number;

        /**
         * 血量
         */
        m_iHitPoint: number;

        /**
         * 最大血量
         */
        m_iHitPointCapacity: number;

        /**
         * 位置
         */
        m_stPosition: UnitPosition;

        /**
         * 玩家所在的zoneid
         */
        m_ushZoneID: number;

        /**
         * 玩家所在的场景
         */
        m_uiSceneID: number;

        /**
         * 职业
         */
        m_ucProfessionType: number;

        /**
         * 性别
         */
        m_ucGenderType: number;

        m_szNickName: string;

        /**
         * 状态
         */
        m_uiUnitStatus: number;

        /**
         * vip等级
         */
        m_cVIPLevel: number;

        /**
         * 战斗力,目前此数据，仅在获取附近组队信息中的协议有赋值，其他地方后续根据需求，再补充
         */
        m_uiFight: number;

        /**
         * 玩家的avataer信息
         */
        m_stAvatarList: AvatarList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ListProgress_Request {
        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ListProgress_Response {
        
        m_uiResultID: number;

        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        /**
         * 已经完成的任务列表
         */
        m_stCompletedQuestList: CompletedQuestList;

        /**
         * 已领取的任务进度列表
         */
        m_stQuestProgressList: QuestProgressList;

        /**
         * 日常任务完成次数
         */
        m_iDailyCompletedNumber: number;

        /**
         * 当天完成任务次数
         */
        m_iDailyDayCompletedTimes: number;

        /**
         * 下一个日常任务的ID
         */
        m_iNextDailyQuestID: number;

        /**
         * 当天完成门派任务次数
         */
        m_iProfDayCompletedTimes: number;

        /**
         * 宗派日常任务完成次数
         */
        m_iGuildDailyCompletedNumber: number;

        /**
         * 当天完成宗派日常任务次数
         */
        m_iGuildDailyDayCompletedTimes: number;

        /**
         * 下一个宗派日常任务的ID
         */
        m_iNextGuildDailyQuestID: number;

        /**
         * 国运任务完成次数
         */
        m_iGuoYunCompletedNumber: number;

        /**
         * 当天完成国运任务次数
         */
        m_iGuoYunDayCompletedTimes: number;

        /**
         * 下一个国运任务的ID
         */
        m_iNextGuoYunQuestID: number;

        /**
         * 卷轴任务每天完成次数
         */
        m_ucJuanZhouDayCompletedTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CompletedQuestList {
        /**
         * 任务数量
         */
        m_iQuestNumber: number;

        m_astQuestStatus: Array<CompletedQuest>;

        /**
         * 任务组数量
         */
        m_iGroupNumber: number;

        m_astGroupStatus: Array<CompletedQuest>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CompletedQuest {
        /**
         * 任务编号
         */
        m_iQuestID: number;

        /**
         * 任务完成次数
         */
        m_iTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestProgressList {
        /**
         * 任务数量
         */
        m_ucQuestNumber: number;

        /**
         * 角色任务进度信息
         */
        m_stQuestProgress: Array<QuestProgress>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestProgress {
        /**
         * 任务编号
         */
        m_iQuestID: number;

        /**
         * 任务领取时间
         */
        m_iAcceptTime: number;

        /**
         * 任务节点数量
         */
        m_ucNodeNumber: number;

        m_astNodeProgress: Array<QuestNodeProgress>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestNodeProgress {
        /**
         * 任务节点索引
         */
        m_ucQuestProgressIndex: number;

        /**
         * 进度值
         */
        m_shProgressValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ListRole_Account_Request {
        /**
         * 登陆态信息
         */
        m_stLianYunPlatInfo: LianYunPlatKeyInfo;

        /**
         * Uin
         */
        m_uiUin: number;

        /**
         * 用于查询指定世界的角色概要信息
         */
        m_shWorldID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ListRole_Account_Response {
        
        m_uiResultID: number;

        /**
         * Uin
         */
        m_uiUin: number;

        /**
         * 回传
         */
        m_shWorldID: number;

        /**
         * 角色个数
         */
        m_ucNumber: number;

        m_astRoleSummary: Array<RoleSummary>;

        /**
         * 最建议的国家1-3
         */
        m_ucBestCountry: number;

        /**
         * 登陆态信息
         */
        m_stLianYunPlatInfo: LianYunPlatKeyInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleSummary {
        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        m_shWorldID: number;

        m_cProfession: number;

        m_cGender: number;

        m_szNickName: string;

        m_iLevel: number;

        /**
         * 时装列表
         */
        m_stAvatarList: AvatarList;

        /**
         * 国家
         */
        m_cCountry: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LoginServer_Notify {
        /**
         * 角色信息
         */
        m_stRoleInfo: RoleInfo;

        m_iZoneID: number;

        m_uiWorldID: number;

        m_uiSceneID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LoginServer_Request {
        /**
         * 官网登陆态信息
         */
        m_stLianYunPlatInfo: LianYunPlatKeyInfo;

        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        /**
         * 换线登陆信息
         */
        m_stEnterType: LoginEnterType;

        /**
         * 登录原因
         */
        m_ucReason: number;

        /**
         * 客户端类型
         */
        m_ucClientType: number;

        /**
         * 客户端唯一标识 64位字符串
         */
        m_szDeviceUID: string;

        /**
         * 设备信息
         */
        m_stDeviceInfo: DeviceInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LoginEnterType {
        /**
         * 0进入普通zone， 其它见GROUP_NAVIGATION_CLASS
         */
        m_cEnterType: number;

        /**
         * 参数1
         */
        m_iPara1: number;

        /**
         * 参数2
         */
        m_iPara2: number;

        /**
         * 参数3
         */
        m_iPara3: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LoginServer_Response {
        
        m_uiResultID: number;

        /**
         * 角色信息
         */
        m_stRoleInfo: RoleInfo;

        m_iZoneID: number;

        m_uiWorldID: number;

        m_uiSceneID: number;

        /**
         * 场景宽度
         */
        m_uiWidthPixels: number;

        /**
         * 场景高度
         */
        m_uiHeightPixels: number;

        m_uiPinstanceID: number;

        /**
         * 已学会职业技能
         */
        m_stSkillList: SkillList;

        /**
         * 快捷键配置
         */
        m_stShortcutList: ShortcutList;

        /**
         * 冷却列表
         */
        m_stCooldownList: CooldownListClient;

        /**
         * 货币系统
         */
        m_stCurrencyInfoList: CurrencyInfoList;

        /**
         * 时限道具列表
         */
        m_stSpecialItemList: SpecialItemList;

        /**
         * 角色宗派信息
         */
        m_stGuildInfo: GuildInfo;

        /**
         * 玩家充值的总金额
         */
        m_iChargeMoney: number;

        /**
         * 玩家总离线时间
         */
        m_ucTotalOfflineTime: number;

        /**
         * 开服时间
         */
        m_uiServerStartTime: number;

        /**
         * 记录玩家是否已经领过某礼包，按位记录，FST_OPEN 宏
         */
        m_uiFristOpenFunc: number;

        /**
         * 记录玩家是否有资格领取某礼包，按位记录，OSS_WAIT 和上面宏有可能不一致
         */
        m_uiCanOpenTag: number;

        /**
         * 玩家每天是否操作过的信息, 按天清0, 按位记录，DOT_ 宏
         */
        m_uiDayOperateRecord: number;

        /**
         * 玩家显示的固定称号
         */
        m_stShowFixTitleInfo: ShowTitleFixList;

        /**
         * 玩家vip月卡等级,0无vip月卡
         */
        m_iVIPMonthLevel: number;

        /**
         * 玩家vip月卡到期时间
         */
        m_auiVIPMonthTimeOut: Array<number>;

        /**
         * 个人竞技场今日是否领取了奖励
         */
        m_bGetReward: number;

        /**
         * 个人竞技最大排名
         */
        m_iMaxRank: number;

        /**
         * 个人竞技最大排名奖励领取标志位
         */
        m_iMaxRankRewardBit: number;

        /**
         * 玩家出战的红颜信息
         */
        m_stBeautyInfo: NewBeautyInfo;

        /**
         * 创角时间
         */
        m_uiCreateTime: number;

        /**
         * 后台记录的平台名称
         */
        m_szPlatformName: string;

        /**
         * 后台记录的玩家所在的场景索引
         */
        m_uiSceneIdx: number;

        /**
         * 后台记录的玩家所在的副本索引
         */
        m_uiPinstanceIdx: number;

        /**
         * 合服时间
         */
        m_uiServerMergeTime: number;

        /**
         * 累计终生消费
         */
        m_uiLifeConsume: number;

        /**
         * 改名卡当前使用时间
         */
        m_iModifyNameTime: number;

        /**
         * 羁绊技能设置信息
         */
        m_stSkillFetterSet: SkillFetterSet;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShortcutList {
        /**
         * 变化个数
         */
        m_ucNumber: number;

        /**
         * 变化的技能栏槽位
         */
        m_astShortcut: Array<Shortcut>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Shortcut {
        /**
         * 对象ID，包括技能和物品
         */
        m_iThingID: number;

        /**
         * 在技能栏中的新位置
         */
        m_ucSlot: number;

        /**
         * 不可堆叠物品的GUID
         */
        m_stGUID: ThingGUID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CooldownListClient {
        /**
         * 冷却个数
         */
        m_ucNumber: number;

        /**
         * 冷却时间
         */
        m_astCooldown: Array<CooldownClient>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CooldownClient {
        /**
         * 冷却ID：包括公共冷却ID，技能冷却ID，物品冷却ID，任务物品冷却ID
         */
        m_iID: number;

        /**
         * 冷却剩余时间
         */
        m_iLeftTime: number;

        /**
         * 总需要冷却时间
         */
        m_iAllCDTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CurrencyInfoList {
        /**
         * 货币种类
         */
        m_cNum: number;

        /**
         * 货币信息
         */
        m_astCurrencyInfo: Array<CurrencyInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CurrencyInfo {
        /**
         * 货币ID
         */
        m_iCurrencyID: number;

        /**
         * 货币值
         */
        m_llValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SpecialItemList {
        /**
         * 现在列表数目
         */
        m_usNumber: number;

        /**
         * 时限道具列表
         */
        m_astSpecialItemInfo: Array<SpecialItemInfo>;

        /**
         * 终生限购列表数目
         */
        m_usLifeNumber: number;

        /**
         * 终生限购道具列表
         */
        m_astLifeSpecialItemInfo: Array<SpecialItemInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SpecialItemInfo {
        /**
         * 道具id
         */
        m_iThingID: number;

        /**
         * 已经购买的个数
         */
        m_usBought: number;

        /**
         * 商铺ID
         */
        m_iStoreID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkillFetterSet {
        /**
         * 变化个数
         */
        m_ucNum: number;

        /**
         * 设置后的技能id, 0标识默认技能
         */
        m_aiSkillId: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LogoutServer_Notify {
        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        /**
         * 登出原因
         */
        m_iReason: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LogoutServer_Request {
        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        /**
         * 登出原因
         */
        m_ucReason: number;

        /**
         * 跨服的目标服
         */
        m_usCrossSvrId: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LogoutServer_Response {
        
        m_uiResultID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MHZZ_Pannel_Request {
        /**
         * 占位
         */
        m_ucTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MHZZ_Pannel_Response {
        /**
         * 结果码
         */
        m_uiResult: number;

        /**
         * 主服务器信息
         */
        m_stMainSvrInfo: MHZZSvrInfo;

        /**
         * 随从服务器个数
         */
        m_iCount: number;

        /**
         * 随从服务器信息
         */
        m_stSlaveSvrList: Array<MHZZSvrInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MHZZSvrInfo {
        /**
         * 服务器ID
         */
        m_iSvrID: number;

        /**
         * 玩家战力
         */
        m_iRoleFight: number;

        /**
         * 服务器战力第一玩家
         */
        m_stSimRoleInfo: SimRoleInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MagicCubeLevelUp_Request {
        /**
         * 是否自动购买 加了超级丹 优先级低于自动购买
         */
        m_ucAutoBuy: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MagicCubeLevelUp_Response {
        /**
         * 错误码
         */
        m_iResult: number;

        /**
         * 魔方信息
         */
        m_stMagicCubeInfo: MagicCubeInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MagicCubeInfo {
        /**
         * 魔方等级
         */
        m_uiLevel: number;

        /**
         * 当前祝福值
         */
        m_uiLucky: number;

        /**
         * 保留祝福值
         */
        m_uiSaveLucky: number;

        /**
         * 祝福时间
         */
        m_uiLuckyTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MagicCubePannel_Request {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: MagicCubeRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MagicCubeRequestValue {
        /**
         * 祝福值购买,购买的数量
         */
        m_uiFill: number;

        /**
         * 祝福值保留,0 不用填
         */
        m_ucKeep: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MagicCubePannel_Response {
        /**
         * 请求操作协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResult: number;

        /**
         * 协议体
         */
        m_stValue: MagicCubeResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MagicCubeResponseValue {
        /**
         * 祝福值购买
         */
        m_stFillRsp: MagicCubeInfo;

        /**
         * 祝福值保留
         */
        m_stKeepRsp: MagicCubeInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Mail_FetchList_Request {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Mail_FetchList_Response {
        /**
         * 请求消息处理结果
         */
        m_ushResultID: number;

        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 邮件封数
         */
        m_ushMailNumber: number;

        /**
         * 邮件摘要数组
         */
        m_astMailMemo: Array<MailMemo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MailMemo {
        /**
         * 邮件编号，从1开始
         */
        m_uiMailID: number;

        /**
         * 标题
         */
        m_szTitle: string;

        /**
         * 邮件类型  见MAIL_TYPE_SYSTEM_NORMAL
         */
        m_ucMailType: number;

        /**
         * 附件bitmap，bit  见ACCESSORY_BITMAP_TONGQIAN
         */
        m_uiAccessoryBitmap: number;

        /**
         * 生成邮件的时间，unix时间，单位：秒
         */
        m_uiTimestamp: number;

        /**
         * 读取标记，0=未读取，1=已读取。
         */
        m_ucReadFlag: number;

        /**
         * 邮件过期时间 到期自动删除
         */
        m_uiExpireTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Mail_FetchMail_Request {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 邮件编号，从1开始
         */
        m_uiMailID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Mail_FetchMail_Response {
        /**
         * 请求消息处理结果。消息处理成功后，对于无附件的邮件，将其状态置为已读取
         */
        m_ushResultID: number;

        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 邮件编号，从1开始
         */
        m_uiMailID: number;

        /**
         * 邮件内容
         */
        m_stMailContent: MailContent;

        /**
         * 邮件附件信息
         */
        m_stList: SimItemList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MailContent {
        /**
         * 邮件编号，从1开始
         */
        m_uiMailID: number;

        /**
         * 标题
         */
        m_szTitle: string;

        /**
         * 正文
         */
        m_szText: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Mail_ListChange_Notify {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 新邮件封数
         */
        m_ushNewMailNumber: number;

        /**
         * 新邮件描述列表
         */
        m_astNewMailMemo: Array<MailMemo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Mail_MailNumber_Notify {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 未读取的邮件封数
         */
        m_ushMailNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Mail_PickAccessory_Request {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 邮件编号，从1开始
         */
        m_uiMailID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Mail_PickAccessory_Response {
        /**
         * 请求消息处理结果。消息处理成功后，将邮件状态置为已读取
         */
        m_ushResultID: number;

        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 邮件编号，从1开始
         */
        m_uiMailID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Marriage_Request {
        /**
         * 目标对象的roleid, 对自身操作，可默认为0
         */
        m_stRoleID: RoleID;

        /**
         * 操作协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: MarriageReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MarriageReqValue {
        /**
         * 求婚的档次，[1,3]
         */
        m_ucAppleyMarryLevel: number;

        /**
         * 审批求婚,是否接受，0不接受，1接受
         */
        m_stDealMarryReq: number;

        /**
         * 审批协议离婚, 是否接受，0不接受，1接受
         */
        m_stDealDivorceReq: number;

        /**
         * 送花, 所送花的物品id
         */
        m_stGiveFlower: ContainerThing;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Marriage_Response {
        /**
         * 婚姻系统响应结果
         */
        m_usResultID: number;

        /**
         * 目标对象的roleid, 对自身操作，可默认为0
         */
        m_stRoleID: RoleID;

        /**
         * 操作协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: MarriageRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MarriageRspValue {
        /**
         * 婚姻系统状态通知
         */
        m_stStatusNotify: MarriageStatusNotify;

        /**
         * 查询仙缘系统响应,当前的仙缘等级
         */
        m_usXYLevel: number;

        /**
         * 升级仙缘响应,升级后的仙缘等级
         */
        m_usXYUpLevelRsp: number;

        /**
         * 送花响应,赠送人的名字
         */
        m_szGiveRoleName: string;

        /**
         * 婚姻系统求缘面板回复
         */
        m_stPanelList: GameQiuYuanList;

        /**
         * 婚姻系统求缘注册回复
         */
        m_stRegistList: GameQiuYuanList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MarriageStatusNotify {
        /**
         * 当前类型，求婚\审批求婚\申请协议离婚\申请强制离婚\申请失踪离婚\审批协议离婚
         */
        m_usType: number;

        /**
         * 当前发起人roleid
         */
        m_stSenderID: RoleID;

        /**
         * 发起人的基本信息
         */
        m_stSenderBase: BaseProfile;

        /**
         * 当前接收人roleid
         */
        m_stDealID: RoleID;

        /**
         * 接收人的基本信息
         */
        m_stDealBase: BaseProfile;

        /**
         * 结婚相关，求婚的档次，[1,3]
         */
        m_ucMarryLevel: number;

        /**
         * 审批标识，是否接受，0不接受，1接受
         */
        m_ucDealFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GameQiuYuanList {
        /**
         * 婚姻求缘人数
         */
        m_ushNumber: number;

        /**
         * 婚姻求缘列表
         */
        m_astQiuYuanRoleInfo: Array<RoleInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ModifyRole_Account_Request {
        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        m_cProfession: number;

        m_cGender: number;

        m_szNickName: string;

        /**
         * ROLE_INFO_MODIFY_TYPE_NAME_NEW:新创建改名，ROLE_INFO_MODIFY_TYPE_NAME_CARD:改名卡改名
         */
        m_cModifyType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ModifyRole_Account_Response {
        
        m_uiResultID: number;

        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        m_cProfession: number;

        m_cGender: number;

        m_szNickName: string;

        /**
         * ROLE_INFO_MODIFY_TYPE_NAME_NEW:新创建改名，ROLE_INFO_MODIFY_TYPE_NAME_CARD:改名卡改名,ROLE_INFO_MODIFY_TYPE_GENDER:变性
         */
        m_cModifyType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonsterAITalk_Notify {
        /**
         * 场景内单位编号
         */
        m_iUnitID: number;

        /**
         * 聊天内容
         */
        m_uiMsgID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonsterAttr_Notify {
        /**
         * 类型
         */
        m_ucType: number;

        /**
         * 属性值
         */
        m_stAttrValue: MonsterAttrUnion;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonsterAttrUnion {
        /**
         * 怪物名字
         */
        m_stNewName: MonsterAttrName;

        /**
         * 怪物某个int的属性
         */
        m_stNewInt: MonsterAttrInt;

        /**
         * 怪物称号
         */
        m_stNewTitle: MonsterAttrName;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonsterAttrName {
        /**
         * 如果 ID小于等于1000, 表示是 TAG ID, 否则是怪物 ID
         */
        m_iID: number;

        /**
         * 新的怪物名字
         */
        m_szNewName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonsterAttrInt {
        /**
         * 怪物的UnitID
         */
        m_iUnitID: number;

        /**
         * 区分哪个int的属性类型     见MONSTER_ATTR_INT_COUNTRY
         */
        m_iIntType: number;

        /**
         * 该属性的值
         */
        m_iIntValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonsterTalk_Notify {
        /**
         * 场景内单位编号
         */
        m_iUnitID: number;

        /**
         * 聊天内容
         */
        m_szMessage: string;

        /**
         * 1表示只有头上冒字，2表示只有聊天框冒字，3表示头上和聊天框都冒字
         */
        m_ucFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonthCard_Request {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: MonthCardRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonthCardRequestValue {
        /**
         * 打开月卡面板，占位
         */
        m_ucOpenMCPanel: number;

        /**
         * 领取月卡返还奖励，月卡类型
         */
        m_ucType: number;

        /**
         * 领取月卡每日奖励，月卡类型
         */
        m_ucTypeByDaily: number;

        /**
         * 激活月卡，月卡类型(0为一键购买，大于0对应特权卡购买)
         */
        m_ucBuyType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonthCard_Response {
        /**
         * 请求操作协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: MonthCardResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonthCardResponseValue {
        /**
         * 打开月卡面板响应
         */
        m_stOpenMCPanelRsp: MonthCardInfoRsp;

        /**
         * 领取月卡返还奖励响应
         */
        m_stGetMCRewardRsp: NewMonthCardInfo;

        /**
         * 领取月卡每日奖励响应
         */
        m_stGetMCDailyRewardRsp: NewMonthCardInfo;

        /**
         * 激活月卡响应
         */
        m_stBuyCardRsp: MonthCardInfoRsp;

        /**
         * 推送特权卡信息
         */
        m_stPushMsg: PushMonthCardInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonthCardInfoRsp {
        /**
         * 激活的月卡数量
         */
        m_ucNumber: number;

        m_astMonthCardList: Array<NewMonthCardInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NewMonthCardInfo {
        /**
         * 月卡类型
         */
        m_ucType: number;

        /**
         * 月卡返利第几天
         */
        m_uiDays: number;

        /**
         * 月卡到期时间
         */
        m_uiTimeOut: number;

        /**
         * 当前可返还道具数量
         */
        m_uiCurNums: number;

        /**
         * 今日的已购买数量
         */
        m_uiTodayBuy: number;

        /**
         * 是否已领取月卡返还奖励
         */
        m_ucGet: number;

        /**
         * 礼包领取每日礼包标识,0未领取，1领取
         */
        m_ucGiftFlag: number;

        /**
         * 是否购买过
         */
        m_ucBuyFlag: number;

        /**
         * 道具上限天数
         */
        m_uiLimitDays: number;

        /**
         * 特权卡等级
         */
        m_usLevel: number;

        /**
         * 当前等级的祝福值
         */
        m_usBless: number;

        /**
         * 今日是否升星过
         */
        m_ucStarUp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PushMonthCardInfo {
        /**
         * 特权卡类型
         */
        m_ucType: number;

        /**
         * 推送信息类型
         */
        m_ucMsgType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MountRideChange_Request {
        /**
         * 骑乘状态
         */
        m_ucMountRide: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MountRideChange_Response {
        /**
         * 请求消息处理结果
         */
        m_ushResultID: number;

        /**
         * 骑乘状态
         */
        m_ucMountRide: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MovePosition_Notify {
        
        m_iUnitID: number;

        /**
         * 移动效果
         */
        m_ucMoveMode: number;

        m_stUnitMovement: UnitMovement;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MovePosition_Request {
        
        m_ushSeq: number;

        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        m_stDstPath: UnitPath;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MovePosition_Response {
        
        m_ushSeq: number;

        m_uiResultID: number;

        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        m_stCurrentPosition: UnitPosition;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NPCBehaviour_Request {
        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        /**
         * NPC编号
         */
        m_iNPCID: number;

        /**
         * 商店id
         */
        m_iStoreID: number;

        /**
         * 商店出售物品的数量
         */
        m_ucAmount: number;

        /**
         * 行为编号，例如任务对话
         */
        m_ucBehaviourID: number;

        /**
         * 交易物品
         */
        m_stThing: ContainerThing;

        /**
         * ExchangeID,0表第一个，其它表具体某一个
         */
        m_iExchangeID: number;

        /**
         * 后台不用处理，前台使用的，是否需要自动使用购买的道具
         */
        m_ucAutoUse: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NPCBehaviour_Response {
        
        m_uiResultID: number;

        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        /**
         * NPC编号
         */
        m_iNPCID: number;

        /**
         * 商店id
         */
        m_iStoreID: number;

        /**
         * 行为编号
         */
        m_ucBehaviourID: number;

        /**
         * 赎回ID
         */
        m_iBuybackID: number;

        /**
         * 交易物品 
         */
        m_stThing: ContainerThingInfo;

        /**
         * 后台不用处理，前台使用的，是否需要自动使用购买的道具
         */
        m_ucAutoUse: number;

        /**
         * 商店随机物品信息
         */
        m_stRandomThingInfo: NPCStoreRandomThingInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NPCStoreRandomThingInfo {
        /**
         * 额外商品个数
         */
        m_ucNumber: number;

        /**
         * 额外商品信息
         */
        m_iThingID: Array<number>;

        /**
         * 下次刷新价格
         */
        m_uiPrice: number;

        /**
         * 还能刷新次数，-1表示不限次
         */
        m_iRefreshCnt: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NPCStoreLimitList_Request {
        /**
         * 商店id
         */
        m_iStoreID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NPCStoreLimitList_Response {
        /**
         * 结果
         */
        iResultID: number;

        /**
         * 商店id
         */
        m_iStoreID: number;

        /**
         * 从配置信息中获取到的商城限购列表
         */
        m_stThingList: SpecialItemList;

        /**
         * zone上限购物品已购列表
         */
        m_stSpecDiscountItemList: SpecialItemList;

        /**
         * 活动剩余时间，暂时只有在打开灵狐仙府商店用！！！
         */
        m_iLeftTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NPCTransport_Request {
        /**
         * NPCID
         */
        m_iNPCID: number;

        /**
         * 传送点ID
         */
        m_iTransportPointID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class NewCurrencyChanged_Notify {
        
        m_stRoleID: RoleID;

        /**
         * 货币变化
         */
        m_stCurrencyInfo: CurrencyInfo;

        /**
         * 数量变化量, 负数标识减少，正数为增加
         */
        m_iDeltaValue: number;

        /**
         * 变化原因 元宝+flowtype=101表充值
         */
        m_iFlowType: number;

        /**
         * 引发本次操作的UnitID，暂时对Monster掉落有效,默认0
         */
        m_iTargetUnitID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneSightAttriChange_Notify {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 属性类型
         */
        m_ucType: number;

        /**
         * 协议体
         */
        m_stValue: OneSightAttriValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneSightAttriValue {
        /**
         * 国家职位
         */
        m_uiCountryJob: number;

        /**
         * 家族职位
         */
        m_ucGuildGrade: number;

        /**
         * 玩家显示的固定称号
         */
        m_stShowFixTitleInfo: ShowTitleFixList;

        /**
         * 玩家PK信息变化
         */
        m_stPKInfo: PKInfo;

        /**
         * 玩家的属性变化
         */
        m_stAttInfo: RoleSightAttInfo;

        /**
         * 玩家的军团ID变化
         */
        m_ucArmyID: number;

        /**
         * 天地竞技称号ID变化
         */
        m_uiTDTitleID: number;

        /**
         * 聚元ID
         */
        m_iJuYuanInfo: number;

        /**
         * 配偶名称
         */
        m_szLoverNickName: string;

        /**
         * 人民币战场宝箱信息
         */
        m_stRMBZCInfo: RMBZCInfo;

        /**
         * 累计终生消费
         */
        m_uiLifeConsume: number;

        /**
         * 极速挑战称号ID变化
         */
        m_uiJSTZTitle: number;

        /**
         * 守护神id
         */
        m_iShieldGodID: number;

        /**
         * 队伍ID
         */
        m_iTeamID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleSightAttInfo {
        /**
         * 职业
         */
        m_cProf: number;

        /**
         * 性别
         */
        m_cGender: number;

        /**
         * 昵称
         */
        m_szNickName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RMBZCInfo {
        /**
         * 怪物ID
         */
        m_uiMonsterID: number;

        /**
         * 结束时间
         */
        m_uiEndTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OpCrystal_Request {
        /**
         * 星魂操作
         */
        m_iOperateType: number;

        /**
         * 拉取星魂容器类型
         */
        m_cType: number;

        /**
         * 星魂位置数量
         */
        m_iNum: number;

        /**
         * 位置数组
         */
        m_ascPos: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OpCrystal_Response {
        
        m_iOperateType: number;

        m_iResultID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OpenBeautyPannel_Request {
        /**
         * 预留，不用
         */
        m_ucID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OpenBeautyPannel_Response {
        /**
         * 错误码
         */
        m_iResult: number;

        /**
         * 出战红颜ID
         */
        m_iBattleBeautyID: number;

        /**
         * 红颜列表
         */
        m_stBeautyList: NewBeautyInfoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OpenBox_Notify {
        /**
         * 使用物品ID
         */
        m_iThingID: number;

        /**
         * 使用物品数量
         */
        m_iThingCount: number;

        /**
         * 物品类型个数
         */
        m_ucTypeCount: number;

        /**
         * 非背包物品列表
         */
        m_stItemList: Array<OneItemList>;

        /**
         * 背包物品列表
         */
        m_stSrcThingList: ContainerThingObjList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneItemList {
        /**
         * 物品ID
         */
        m_iID: number;

        /**
         * 物品个数
         */
        m_iCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OpenMagicCubePannel_Request {
        /**
         * 预留，不用
         */
        m_ucID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OpenMagicCubePannel_Response {
        /**
         * 错误码
         */
        m_iResult: number;

        /**
         * 魔方信息
         */
        m_stMagicCubeInfo: MagicCubeInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OpenSuperVIP_Request {
        /**
         * 预留，不用传
         */
        m_uiTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OpenSuperVIP_Response {
        /**
         * 需要的元宝数
         */
        m_uiYuanBao: number;

        /**
         * QQ号
         */
        m_uiQQ: number;

        /**
         * 记录玩家是否已经领过某礼包，按位记录，FST_OPEN 宏
         */
        m_uiFristOpenFunc: number;

        /**
         * 记录玩家是否有资格领取某礼包，按位记录，OSS_WAIT 和上面宏有可能不一致
         */
        m_uiCanOpenTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OperateContainer_Request {
        /**
         * 操作
         */
        m_ucOperate: number;

        /**
         * 容器
         */
        m_stContainerID: ContainerID;

        /**
         * 物品
         */
        m_stContainerThing: ContainerThing;

        /**
         * 使用物品的UnitID
         */
        m_iTargetUnitID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OperateQuest_Request {
        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        /**
         * 任务编号
         */
        m_iQuestID: number;

        /**
         * 任务操作
         */
        m_ucQuestOperation: number;

        /**
         * 预留使用的特殊参数，无特殊需要，不用处理
         */
        m_uiParam: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OperateQuest_Response {
        
        m_uiResultID: number;

        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        /**
         * 任务编号
         */
        m_iQuestID: number;

        /**
         * 组任务编号
         */
        m_iGroupID: number;

        /**
         * 任务操作
         */
        m_ucQuestOperation: number;

        /**
         * 日常任务完成次数
         */
        m_iDailyCompletedNumber: number;

        /**
         * 当天日常任务完成次数
         */
        m_iDailyDayCompletedNumber: number;

        /**
         * 下一个日常任务的ID
         */
        m_iNextDailyQuestID: number;

        /**
         * 门派任务完成次数
         */
        m_iProfCompletedNumber: number;

        /**
         * 当天门派任务完成次数
         */
        m_iProfDayCompletedNumber: number;

        /**
         * 宗派日常任务完成次数
         */
        m_iGuildDailyCompletedNumber: number;

        /**
         * 当天完成宗派日常任务次数
         */
        m_iGuildDailyDayCompletedTimes: number;

        /**
         * 下一个宗派日常任务的ID
         */
        m_iNextGuildDailyQuestID: number;

        /**
         * 前线任务完成次数
         */
        m_iFrontLineCompletedNumber: number;

        /**
         * 当天完成前线任务次数
         */
        m_iFrontLineDayCompletedTimes: number;

        /**
         * 当前前线任务目标国家id
         */
        m_iFrontLineDesZoneID: number;

        /**
         * 国运任务完成次数
         */
        m_iGuoYunCompletedNumber: number;

        /**
         * 当天完成国运任务次数
         */
        m_iGuoYunDayCompletedTimes: number;

        /**
         * 下一个国运任务的ID
         */
        m_iNextGuoYunQuestID: number;

        /**
         * 当天完成皇榜任务次数
         */
        m_ucHuangBangDayCompletedTimes: number;

        /**
         * 卷轴任务每天完成次数
         */
        m_ucJuanZhouDayCompletedTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OperateShortcut_Request {
        /**
         * 快捷键类型
         */
        m_ucShortcutType: number;

        /**
         * 变化的技能栏槽位
         */
        m_stShorcutList: ShortcutList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OperateShortcut_Response {
        /**
         * 快捷键类型
         */
        m_ucShortcutType: number;

        /**
         * 操作对象UnitID
         */
        m_iUnitID: number;

        /**
         * 变化的技能栏槽位
         */
        m_stShorcutList: ShortcutList;

        /**
         * 操作结果
         */
        m_ushResultID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OperateSkill_Request {
        /**
         * 操作：学习，设置有效技能
         */
        m_ucOperate: number;

        /**
         * 学习技能参数值
         */
        m_stValue: OperateSkillParameterValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OperateSkillParameterValue {
        /**
         * 学习技能
         */
        m_stStudySkill: ParaStudySkill;

        /**
         * 让技能有效|        无效（不装到身上）
         */
        m_stValidSkill: ParaValidSkill;

        /**
         * 设置羁绊技能
         */
        m_stSetFetterSkill: ParaSetFetterSkill;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ParaStudySkill {
        /**
         * 学习的技能ID
         */
        m_iSkillID: number;

        /**
         * 是否一键升到最高级
         */
        m_ucOneKey: number;

        /**
         * 本次学习技能进度, 0表示不用按进度学习, oneKey优先级高
         */
        m_ucStep: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ParaValidSkill {
        /**
         * 有效技能ID数组，不够的补0
         */
        m_iSkillID: number;

        /**
         * 0表技能有效1表技能无效(摘下来)
         */
        m_ucForbidden: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ParaSetFetterSkill {
        /**
         * 羁绊技能ID,0标识非羁绊技能
         */
        m_iSkillID: number;

        /**
         * 替换位置
         */
        m_ucPos: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OperateSkill_Response {
        /**
         * 单元场景ID
         */
        m_iUnitID: number;

        /**
         * 技能ID
         */
        m_iSkillID: number;

        /**
         * 操作：遗忘或者学习升级
         */
        m_ucOperate: number;

        /**
         * 操作结果
         */
        m_ushResultID: number;

        /**
         * 属性变更，主要是经验和活力值消耗
         */
        m_stUnitAttributeChanged: UnitAttributeChanged;

        /**
         * 这次技能是否有被禁掉0表没禁1表禁掉
         */
        m_ucForbidden: number;

        /**
         * 技能进度
         */
        m_usProgress: number;

        /**
         * 羁绊技能设置信息
         */
        m_stSkillFetterSet: SkillFetterSet;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OperateTeam_Notify {
        /**
         * 自身64位角色标识
         */
        m_stSrcRoleID: RoleID;

        /**
         * 队伍操作：邀请组队，申请入队
         */
        m_ucOperation: number;

        /**
         * 目标64位角色标识
         */
        m_stDstRoleID: RoleID;

        /**
         * 结果
         */
        m_ushResultID: number;

        /**
         * 队伍id
         */
        m_stTeamID: TEAMID;

        /**
         * 队长64位角色标识
         */
        m_stCaptainRoleID: RoleID;

        /**
         * 队伍角色信息
         */
        m_stMemberList: TeamMemberList;

        /**
         * 招募条件
         */
        m_stTeamRestriction: TeamRestriction;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TEAMID {
        /**
         * 队伍创建时间
         */
        m_uiCreateTime: number;

        /**
         * 创建seq
         */
        m_uiSeq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OperateTeam_Request {
        /**
         * 队伍操作：组队，退队, 踢人，改队长, 修改招募条件
         */
        m_ucOperation: number;

        /**
         * 目标队伍ID
         */
        m_stTeamID: TEAMID;

        /**
         * 目标64位角色标识
         */
        m_stDstRoleID: RoleID;

        /**
         * 招募条件
         */
        m_stTeamRestriction: TeamRestriction;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OperateTeam_Response {
        
        m_ushResultID: number;

        /**
         * 队伍操作：组队，退队, 踢人，改队长, 修改招募条件
         */
        m_ucOperation: number;

        /**
         * 目标64位角色标识
         */
        m_stDstRoleID: RoleID;

        /**
         * 目标队伍ID
         */
        m_stTeamID: TEAMID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreBuy_Request {
        /**
         * 更新的单号
         */
        m_stPSDID: PSDID;

        /**
         * 物品数量
         */
        m_iNumber: number;

        /**
         * NPC ID
         */
        m_iNPCID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PSDID {
        /**
         * 创建时间
         */
        m_uiTime: number;

        /**
         * 序号
         */
        m_uiSeq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreBuy_Response {
        /**
         * 错误码
         */
        m_ushResultID: number;

        /**
         * 单号
         */
        m_stPSDID: PSDID;

        /**
         * 物品数量
         */
        m_iNumber: number;

        /**
         * 物品单价
         */
        m_iEachPrice: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreCall_Request {
        /**
         * 单据ID
         */
        m_stID: PSBID;

        /**
         * 物品ID
         */
        m_uiItemID: number;

        /**
         * 物品数量
         */
        m_uiItemCount: number;

        /**
         * 物品单价
         */
        m_uiItemPrice: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreCall_Response {
        /**
         * 错误码
         */
        m_ushResultID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreCancelMy_Request {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 取消的单号
         */
        m_stPSBID: PSBID;

        /**
         * 页号
         */
        m_iPageNo: number;

        /**
         * NPC ID
         */
        m_iNPCID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreCancelMy_Response {
        /**
         * 错误码
         */
        m_ushResultID: number;

        /**
         * 页号
         */
        m_iPageNo: number;

        /**
         * 总页数
         */
        m_iTotalPages: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreDispMy_Request {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 页号
         */
        m_iPageNo: number;

        /**
         * NPC ID
         */
        m_iNPCID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreDispMy_Response {
        /**
         * 错误码
         */
        m_ushResultID: number;

        /**
         * 页号
         */
        m_iPageNo: number;

        /**
         * 总页数
         */
        m_iTotalPages: number;

        /**
         * 单子列表
         */
        m_stPSBInfoList: PSBInfoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PSBInfoList {
        /**
         * 单数
         */
        m_ucPSBNumber: number;

        /**
         * 查询结果
         */
        m_astPSBInfo: Array<PSBInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PSBInfo {
        /**
         * 单据ID
         */
        m_stID: PSBID;

        /**
         * 物品详细信息, 共用邮件附件结构
         */
        m_stAccessoryInfo: AccessoryInfo;

        /**
         * 物品单价
         */
        m_iEachPrice: number;

        /**
         * 超时期限
         */
        m_iExpireTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AccessoryInfo {
        /**
         * 附件的类型
         */
        m_ucAccessoryType: number;

        /**
         * 附件物品ID
         */
        m_iThingID: number;

        /**
         * 附件物品数量
         */
        m_iThingNumber: number;

        /**
         * 附件物品信息
         */
        m_stAccessoryThing: AccessoryThing;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AccessoryThing {
        
        m_stAccessoryThing: AccessoryBag;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class AccessoryBag {
        /**
         * 物品信息
         */
        m_stThingProp: ThingProperty;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreGetAllThingNum_Request {
        /**
         * 类别, 是一个大类和子类组合的数字
         */
        m_iClassID: number;

        /**
         * 请求的角色ID
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreGetAllThingNum_Response {
        /**
         * 错误码
         */
        m_ushResultID: number;

        /**
         * 类别, 是一个大类和子类组合的数字
         */
        m_iClassID: number;

        /**
         * 请求的角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 寄售道具概要信息
         */
        m_astList: PPStotrItemSummList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStotrItemSummList {
        /**
         * 道具个数
         */
        m_uiCount: number;

        /**
         * 道具信息
         */
        m_astList: Array<PPStotrItemSumm>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStotrItemSumm {
        /**
         * 道具或货币ID
         */
        m_iItemID: number;

        /**
         * 道具个数
         */
        m_iItemNum: number;

        /**
         * 最低价
         */
        m_iMinPrice: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreQuery_Request {
        /**
         * 类别, 是一个大类和子类组合的数字
         */
        m_iClassID: number;

        /**
         * 页号
         */
        m_iPageNo: number;

        /**
         * 物品名字
         */
        m_szName: string;

        /**
         * 最低等级
         */
        m_iMinLevel: number;

        /**
         * 最高等级
         */
        m_iMaxLevel: number;

        /**
         * 颜色品质
         */
        m_iColor: number;

        /**
         * NPC ID
         */
        m_iNPCID: number;

        /**
         * 钱柜标志，0默认，1钱柜
         */
        m_ucQueryFalg: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreQuery_Response {
        /**
         * 错误码
         */
        m_ushResultID: number;

        /**
         * 页号
         */
        m_iPageNo: number;

        /**
         * 总页数
         */
        m_iTotalPages: number;

        /**
         * 钱柜标志，0默认，1钱柜
         */
        m_ucQueryFalg: number;

        /**
         * 单子列表
         */
        m_stPSDInfoList: PSDInfoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PSDInfoList {
        /**
         * 单数
         */
        m_ucPSDNumber: number;

        /**
         * 查询结果
         */
        m_astPSDInfo: Array<PSDInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PSDInfo {
        /**
         * 单据ID
         */
        m_stID: PSDID;

        /**
         * 物品详细信息, 共用邮件附件结构
         */
        m_stAccessoryInfo: AccessoryInfo;

        /**
         * 物品单价
         */
        m_iEachPrice: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreSell_Request {
        /**
         * 卖出物品
         */
        m_stSellThing: ContainerThing;

        /**
         * 卖出单价
         */
        m_iEachPrice: number;

        /**
         * 超时时间(小时)
         */
        m_iExpireTime: number;

        /**
         * NPC ID
         */
        m_iNPCID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreSell_Response {
        /**
         * 错误码
         */
        m_ushResultID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PPStoreSort_Request {
        /**
         * 类别, 是一个大类和子类组合的数字
         */
        m_iClassID: number;

        /**
         * 页号
         */
        m_iPageNo: number;

        /**
         * 排序类型 1-按等级，2-按品质，3-按价格
         */
        m_iSortType: number;

        /**
         * 排序顺序，1-默认升序，2-降序
         */
        m_ucSortOrder: number;

        /**
         * 物品名字
         */
        m_szName: string;

        /**
         * 最低等级
         */
        m_iMinLevel: number;

        /**
         * 最高等级
         */
        m_iMaxLevel: number;

        /**
         * 颜色品质
         */
        m_iColor: number;

        /**
         * NPC ID
         */
        m_iNPCID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PVPCampRelationNotify {
        /**
         * 变化者的UnitID
         */
        m_iUnitID: number;

        /**
         * 阵营关系
         */
        m_ucCampRelation: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PVPRank_CS_Request {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: PVPRankCSRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PVPRankCSRequestValue {
        /**
         * 请求打开封神台主面板消息
         */
        m_stCSOpenPanelReq: CSOpen_Panel_Request;

        /**
         * 选中某人开打
         */
        m_stCSStartPKReq: CSStart_PK_Request;

        /**
         * 购买挑战次数
         */
        m_ucBuyTimesReq: number;

        /**
         * 膜拜
         */
        m_ucMoBaiRank: number;

        /**
         * 跨服封神台请求打开封神台主面板消息
         */
        m_stCSCrossOpenPanelReq: CSCrossOpen_Panel_Request;

        /**
         * 跨服封神台英雄榜消息
         */
        m_stCSCrossOpenRankReq: CSCrossOpen_Rank_Request;

        /**
         * 跨服封神台选中某人开打
         */
        m_stCSCrossStartPKReq: CSCrossStart_PK_Request;

        /**
         * 跨服封神台购买挑战次数
         */
        m_ucBuyCrossTimesReq: number;

        /**
         * 跨服封神台领取排名奖励
         */
        m_stCSCrossGetRewardReq: number;

        /**
         * 封神台获取最大排名奖励
         */
        m_ucGetMaxRankRewardReq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSOpen_Panel_Request {
        /**
         * 0默认打开，1挑战目标战力最低筛选
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSStart_PK_Request {
        /**
         * 开打的目标的名次，名次不合理范围内不能打的
         */
        m_usRankVal: number;

        /**
         * 用身上的哪只散仙出战[0-5]
         */
        m_ucPetPos: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCrossOpen_Panel_Request {
        /**
         * 预留
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCrossOpen_Rank_Request {
        /**
         * 预留
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCrossStart_PK_Request {
        /**
         * 跨服封神台开打的目标的名次，名次不合理范围内不能打的
         */
        m_usRankVal: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PVPRank_CS_Response {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: PVPRankCSResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PVPRankCSResponseValue {
        /**
         * 封神台主面板消息
         */
        m_stCSOpenPanelRes: CSOpen_Panel_Response;

        /**
         * 选中某人开打
         */
        m_stCSStartPKRes: CSStart_PK_Response;

        /**
         * 购买挑战次数
         */
        m_stCSBuyTimesRes: CSBuy_Times_Response;

        /**
         * 膜拜
         */
        m_uiOperateRecord: number;

        /**
         * 跨服封神台主面板消息
         */
        m_stCSCrossOpenPanelRes: CSCrossOpen_Panel_Response;

        /**
         * 跨服封神台英雄榜消息
         */
        m_stCSCrossOpenRankRes: CSCrossOpen_Rank_Response;

        /**
         * 跨服封神台选中某人开打
         */
        m_stCSCrossStartPKRes: CSCrossStart_PK_Response;

        /**
         * 跨服封神台购买挑战次数
         */
        m_stCSCrossBuyTimesRes: CSCrossBuy_Times_Response;

        /**
         * 跨服封神台领取排名奖励
         */
        m_stCSCrossGetRewardRes: CSCrossGet_Reward_Response;

        /**
         * 封神台获取最大排名奖励
         */
        m_uiGetMaxRankRewardRes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSOpen_Panel_Response {
        /**
         * 是否领取了奖励
         */
        m_bGetReward: number;

        /**
         * 奖励排名
         */
        m_shRewardRank: number;

        /**
         * 当前排名
         */
        m_shMyRankVal: number;

        /**
         * 剩余次数
         */
        m_shRemainTimes: number;

        /**
         * 已购买的次数
         */
        m_shBuyTimes: number;

        /**
         * 开始Tick的时间戳
         */
        m_uiTickTime: number;

        /**
         * 最多显示Top3的信息给封神台主面板
         */
        m_astTopRole: Array<CacheRoleInfo>;

        /**
         * 挑战或被挑战的日志
         */
        m_stLog: RolePVPLog;

        /**
         * 5个玩家
         */
        m_astRole: Array<OneRolePvpInfoCli>;

        /**
         * 最大排名
         */
        m_iMaxRank: number;

        /**
         * 最大排名奖励 按位存储
         */
        m_iMaxRankRewardBit: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RolePVPLog {
        /**
         * 本记录的属主RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 当前记录的条数
         */
        m_ucCount: number;

        /**
         * 一个玩家存10条日志
         */
        m_astLog: Array<OneRolePVPLog>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneRolePVPLog {
        /**
         * 主动挑战者的RoleID
         */
        m_stCastRoleID: RoleID;

        /**
         * 主动挑战者角色名
         */
        m_szCastNickName: string;

        /**
         * 主动挑战者新名次, 0 表没有名次
         */
        m_usCastRank: number;

        /**
         * 被挑战者的RoleID
         */
        m_stTargetRoleID: RoleID;

        /**
         * 被挑战者角色名
         */
        m_szTargetNickName: string;

        /**
         * 被挑战者国家
         */
        m_ucTargetCountry: number;

        /**
         * 被挑战者新名次, 0 表没有名次
         */
        m_usTargetRank: number;

        /**
         * 挑战时间
         */
        m_iTime: number;

        /**
         * 主动挑战者是否赢：1表示赢
         */
        m_ucWin: number;

        /**
         * 主动挑战者获得的铜钱
         */
        m_uiTongQian: number;

        /**
         * 名次是否有变化：1表示有
         */
        m_ucChange: number;

        /**
         * 被挑战者大区号
         */
        m_usTargetWorldID: number;

        /**
         * 主动挑战者大区号
         */
        m_usCastWorldID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneRolePvpInfoCli {
        /**
         * RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 昵称
         */
        m_szNickName: string;

        /**
         * 性别
         */
        m_cGender: number;

        /**
         * 职业
         */
        m_cProfession: number;

        /**
         * 等级
         */
        m_usLevel: number;

        /**
         * 排名
         */
        m_shRankVal: number;

        /**
         * 战力
         */
        m_iFightVal: number;

        /**
         * 国家
         */
        m_ucCountry: number;

        /**
         * 玩家Avatar
         */
        m_stAvatarList: AvatarList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSStart_PK_Response {
        /**
         * 剩余次数
         */
        m_ucLeftTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSBuy_Times_Response {
        /**
         * 剩余次数
         */
        m_shRemainTimes: number;

        /**
         * 开始Tick的时间戳
         */
        m_uiTickTime: number;

        /**
         * 已购买的次数
         */
        m_shBuyTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCrossOpen_Panel_Response {
        /**
         * 是否领取了奖励
         */
        m_bGetReward: number;

        /**
         * 奖励排名
         */
        m_shRewardRank: number;

        /**
         * 跨服封神台排名
         */
        m_shMyRankVal: number;

        /**
         * 跨服封神台剩余次数
         */
        m_shRemainTimes: number;

        /**
         * 跨服封神台已购买的次数
         */
        m_shBuyTimes: number;

        /**
         * 开始Tick的时间戳
         */
        m_uiTickTime: number;

        /**
         * 跨服封神台显示可打的5人的信息给跨服封神台主面板
         */
        m_astRoleList: Array<CrossRoleInfoRank>;

        /**
         * 跨服封神台挑战或被挑战的日志
         */
        m_stLog: RolePVPLog;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CrossRoleInfoRank {
        /**
         * 最后一次入DB的时间
         */
        m_iLastDBTime: number;

        /**
         * 角色数据最后一次从World更新时间
         */
        m_iLastUpdTime: number;

        /**
         * 跨服英雄榜排名
         */
        m_shRankVal: number;

        /**
         * 角色信息
         */
        m_stCrossRoleInfo: CrossCacheRoleInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCrossOpen_Rank_Response {
        /**
         * 榜单个数
         */
        m_ucCount: number;

        /**
         * 榜单信息
         */
        m_astRoleList: Array<OneCrossRolePvpInfoCli>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneCrossRolePvpInfoCli {
        /**
         * 玩家大区ID
         */
        m_ushWorldID: number;

        /**
         * RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 昵称
         */
        m_szNickName: string;

        /**
         * 性别
         */
        m_cGender: number;

        /**
         * 职业
         */
        m_cProfession: number;

        /**
         * 等级
         */
        m_usLevel: number;

        /**
         * 排名
         */
        m_shRankVal: number;

        /**
         * 战力
         */
        m_iFightVal: number;

        /**
         * 国家
         */
        m_ucCountry: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCrossStart_PK_Response {
        /**
         * 预留，不用填
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCrossBuy_Times_Response {
        /**
         * 跨服封神台剩余次数
         */
        m_shRemainTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSCrossGet_Reward_Response {
        /**
         * 0成功，其它失败
         */
        m_iResult: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinstanceComplete_Notify {
        /**
         * 成功为0, 失败为非零
         */
        m_ushResultID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinstanceEnter_Request {
        /**
         * NPC ID
         */
        m_iNPCID: number;

        /**
         * 副本ID
         */
        m_iPinstanceID: number;

        /**
         * 再刷一次标志，1表示再刷一次
         */
        m_ucRetryTag: number;

        /**
         * 副本难度 改字段类型ush，暂不改字段名，前台不需要改代码
         */
        m_ucDiff: number;

        /**
         * 跳到第多少层(0表不跳)
         */
        m_ucJump: number;

        /**
         * 是否收费(目前只有经验副本有用 0不收费 1 收费)
         */
        m_ucIsCost: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinstanceFinish_Notify {
        /**
         * 面板类型 1 通用面板；2 过关面板；3 击杀boss面板 4 有难度的副本
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: PinstanceResultValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinstanceResultValue {
        /**
         * 副本通用面板
         */
        m_stInfo: PinstanceResult;

        /**
         * 副本过关面板
         */
        m_stPassInfo: PassResult;

        /**
         * 副本击杀boss面板
         */
        m_stKillBossInfo: KillBossResult;

        /**
         * 有难度的副本结算面板
         */
        m_stDiffInfo: DifficultResult;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinstanceResult {
        /**
         * 副本评价结果[1,2,3 或 1,2]
         */
        m_ucWinLevel: number;

        /**
         * 副本是否出现继续按钮
         */
        m_ucBtnContinue: number;

        /**
         * 副本是否出现回城按钮
         */
        m_ucBtnBack: number;

        /**
         * 副本是否出现再来一次按钮
         */
        m_ucBtnRetry: number;

        /**
         * 数字类奖励个数
         */
        m_ucDataNumber: number;

        /**
         * 数字类个数
         */
        m_astData: Array<OneBonusThing>;

        /**
         * 道具类类奖励个数
         */
        m_ucItemNumber: number;

        /**
         * 道具类个数
         */
        m_astItem: Array<OneBonusThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneBonusThing {
        /**
         * 物品ID
         */
        m_iID: number;

        /**
         * 物品数量
         */
        m_iNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PassResult {
        /**
         * 本次通关的副本id
         */
        m_uiPinstanceId: number;

        /**
         * 当前通关数,不能超过255
         */
        m_ucCurrentLevel: number;

        /**
         * 当前所属的关卡，不能超过255
         */
        m_ucCurrentCheckpoint: number;

        /**
         * 历史最大通关数,不能超过255
         */
        m_ucMaxLevel: number;

        /**
         * 总关卡数,不能超过255
         */
        m_ucTotleLevel: number;

        /**
         * 本次通关耗时
         */
        m_uiCurrentTime: number;

        /**
         * 历史最快通关耗时
         */
        m_uiMinTime: number;

        /**
         * 超越全服玩家百分比
         */
        m_ucPercent: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KillBossResult {
        /**
         * 被击杀boss id
         */
        m_iBossId: number;

        /**
         * 击杀boss的玩家的信息
         */
        m_stKillerRole: KillBossRoleInfo;

        /**
         * 输出伤害的玩家排行榜
         */
        m_astDamageRole: Array<KillBossRoleInfo>;

        /**
         * 自己的击杀boss信息
         */
        m_stOwnDamage: KillBossRoleInfo;

        /**
         * 数字类奖励个数
         */
        m_ucDataNumber: number;

        /**
         * 数字类个数
         */
        m_astData: Array<OneBonusThing>;

        /**
         * 道具类类奖励个数
         */
        m_ucItemNumber: number;

        /**
         * 道具类个数
         */
        m_astItem: Array<OneBonusThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KillBossRoleInfo {
        /**
         * 国家id
         */
        m_ucCountryId: number;

        /**
         * 玩家昵称
         */
        m_szNickName: string;

        /**
         * 输出伤害百分比 0-10000，除100显示
         */
        m_ucDamagePercent: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DifficultResult {
        /**
         * 副本结果[0失败，1成功]
         */
        m_ucWinLost: number;

        /**
         * 通关时间，秒
         */
        m_iCostTime: number;

        /**
         * 通关评价1-5
         */
        m_ucResult: number;

        /**
         * 0表没开启,新难度1-5
         */
        m_ucNewDiff: number;

        /**
         * 通关额外经验
         */
        m_iExp: number;

        /**
         * 副本是否出现再来一次按钮
         */
        m_ucBtnRetry: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinstanceHomeRequest {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: PinstanceHomeReqValue;

        /**
         * 操作的副本ID
         */
        m_iPinID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinstanceHomeReqValue {
        /**
         * 默认0，不需要填写
         */
        m_iList: number;

        /**
         * 所需副本列表
         */
        m_stListAll: PinHomeListAllReq;

        /**
         * 默认0，不需要填写
         */
        m_iReset: number;

        /**
         * 领取礼包副本层数
         */
        m_iGetGiftLv: number;

        /**
         * 副本排行信息查询,默认0，不需要填写
         */
        m_iGetRankPin: number;

        /**
         * 副本时间排行信息查询,默认0，不需要填写
         */
        m_iGetRankTimePin: number;

        /**
         * 刷新奔跑吧兄弟副本时间,默认0，不需要填写
         */
        m_iFreshPinTime: number;

        /**
         * 个人bossVIP购买次数
         */
        m_ucNanDu: number;

        /**
         * 个人boss刷新CD
         */
        m_ucFreshNanDu: number;

        /**
         * 多人bossVIP购买刷新次数
         */
        m_ucBuyMultiBossTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinHomeListAllReq {
        /**
         * 有效数据个数
         */
        m_ucNum: number;

        /**
         * 副本id数组
         */
        m_iPinID: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinstanceHomeResponse {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: PinstanceHomeRspValue;

        /**
         * 操作的副本ID
         */
        m_iPinID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinstanceHomeRspValue {
        /**
         * 查询副本信息的响应
         */
        m_stListRsp: ListPinHomeRsp;

        /**
         * 查询副本列表信息的响应
         */
        m_stListAllRsp: PinHomeListAllRsp;

        /**
         * 已重置次数
         */
        m_iResetRsp: number;

        /**
         * 领取礼包副本层数
         */
        m_iGetGiftLvRsp: number;

        /**
         * 查询副本排行信息
         */
        m_stRankPinRsp: RankPinInfo;

        /**
         * 查询奔跑兄弟副本排行信息
         */
        m_stPinTimeRankRsp: PinTimeRankInfo;

        /**
         * 刷新副本时间
         */
        m_stReFreshPinTimeRsp: PinTimeRankInfo;

        /**
         * Vip购买次数响应
         */
        m_stVIPBuyRsp: DBBossCountInfo;

        /**
         * 个人boss刷新CD响应
         */
        m_stFreshBossRsp: DBBossCountInfo;

        /**
         * 多人boss购买刷新次数响应
         */
        m_stBuyMultiBossTimesRsp: ListPinHomeRsp;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RankPinInfo {
        /**
         * 副本有效层数
         */
        m_usPinLvCount: number;

        /**
         * 玩家单层副本最佳通关时间
         */
        m_uiBestTime: Array<number>;

        /**
         * 本层副本最佳通关排名数据
         */
        m_stLevelInfoList: Array<OneLevelInfo>;

        /**
         * 副本总排行个数
         */
        m_ucRankCount: number;

        /**
         * 总排行数据
         */
        m_stRankInfoList: Array<OneAllRankInfo>;

        /**
         * 总排行排名第一的信息
         */
        m_stAllRankFirst: RoleInfo;

        /**
         * 占层最多排行信息
         */
        m_stRankMostInfo: RankMostInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneLevelInfo {
        /**
         * 副本层数
         */
        m_usPinLv: number;

        /**
         * 最佳通关本层玩家个数
         */
        m_ucFrontCount: number;

        /**
         * 最佳通关本层数据
         */
        m_stFrontInfoList: Array<FrontOneInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FrontOneInfo {
        /**
         * RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 名字
         */
        m_szNickName: string;

        /**
         * 最佳通关时间
         */
        m_uiTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneAllRankInfo {
        /**
         * RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 名字
         */
        m_szNickName: string;

        /**
         * 副本层数
         */
        m_usPinLv: number;

        /**
         * 通关时间
         */
        m_uiTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RankMostInfo {
        /**
         * 占层最多第一的信息
         */
        m_stLevelRankFirst: RoleInfo;

        /**
         * 占层排行个数
         */
        m_ucRankCount: number;

        /**
         * 排行数据
         */
        m_stRankInfoList: Array<OneAllRankInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinTimeRankInfo {
        /**
         * 冷却时间
         */
        m_iReFreshTime: number;

        /**
         * 我的通关时间
         */
        m_iMyTime: number;

        /**
         * 我的可通关次数
         */
        m_iMyPKCount: number;

        /**
         * 我的排名，0表示未上榜
         */
        m_iMyRank: number;

        /**
         * 最佳通关本层玩家个数
         */
        m_ucCount: number;

        /**
         * 最佳通关本层数据
         */
        m_stFrontInfoList: Array<OneTimeInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneTimeInfo {
        /**
         * RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 最佳通关时间
         */
        m_uiTime: number;

        /**
         * 名字
         */
        m_szNickName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinstanceQuit_Request {
        
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinstanceRank_Request {
        /**
         * 操作的副本类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: PinRankReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinRankReqValue {
        /**
         * 默认0，不需要填写
         */
        m_ucYMZCReq: number;

        /**
         * 默认0，不需要填写
         */
        m_ucYSZCReq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinstanceRank_Response {
        /**
         * 操作的副本类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: PinRankRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinRankRspValue {
        /**
         * 默认0，不需要填写
         */
        m_stYMZCRsp: PinRankYMZCRsp;

        /**
         * 默认0，不需要填写
         */
        m_stYSZCRsp: PinRankYSZCRsp;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinRankYMZCRsp {
        /**
         * 有效数据个数
         */
        m_ucNum: number;

        /**
         * 副本排行榜信息数组
         */
        m_stPinInfo: Array<PinRankYMZCOneInfo>;

        /**
         * 副本排行榜个人信息
         */
        m_stOwnPinInfo: PinRankYMZCOneInfo;

        /**
         * 排名第一战斗力
         */
        m_uiFight: number;

        /**
         * 排名第一宗门名称
         */
        m_szGuildName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinRankYMZCOneInfo {
        /**
         * RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 名字
         */
        m_szNickName: string;

        /**
         * 楼层
         */
        m_ucGameLv: number;

        /**
         * 击杀
         */
        m_uiKillNum: number;

        /**
         * 职业
         */
        m_ucProfession: number;

        /**
         * 个人积分
         */
        m_uiScore: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinRankYSZCRsp {
        /**
         * 有效数据个数
         */
        m_ucNum: number;

        /**
         * 副本排行榜信息数组
         */
        m_stPinInfo: Array<PinRankYSZCOneInfo>;

        /**
         * 副本排行榜个人信息
         */
        m_stOwnPinInfo: PinRankYSZCOneInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PinRankYSZCOneInfo {
        /**
         * RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 名字
         */
        m_szNickName: string;

        /**
         * 阵营
         */
        m_ucCamp: number;

        /**
         * 击杀人数
         */
        m_uiKillNum: number;

        /**
         * 被杀人数
         */
        m_uiBeKillNum: number;

        /**
         * 个人积分
         */
        m_uiScore: number;

        /**
         * 前台使用，不用赋值
         */
        m_uiRank: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Position_Notify {
        /**
         * 玩家RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 场景ID
         */
        m_iSceneID: number;

        /**
         * 玩家位置
         */
        m_stPosition: UnitPosition;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PreviewReward_Request {
        /**
         * 玩家领哪个功能的礼包
         */
        m_usKeyword: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PreviewReward_Response {
        /**
         * 功能预览领取奖励信息
         */
        m_stPreviewRewardInfo: DBPreviewRewardInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PromptMessageNotify {
        /**
         * 消息ID
         */
        m_iID: number;

        /**
         * 消息显示类型
         */
        m_ucType: number;

        /**
         * 消息所属国家
         */
        m_ucCountry: number;

        /**
         * 特殊类型的值 PROMPTMSG_TYPE_LASTKILL_END PROMPTMSG_TYPE_MONSTER_ONEDEAD
         */
        m_uiTypeValue: number;

        /**
         * 提示参数列表
         */
        m_stParaList: PromptParameterList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PromptParameterList {
        /**
         * 参数个数
         */
        m_ucNumber: number;

        /**
         * 参数数组
         */
        m_astParameter: Array<PromptParameter>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PromptParameter {
        /**
         * 消息参数类型
         */
        m_ucType: number;

        /**
         * 消息参数值
         */
        m_stValue: PromptParameterValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PromptParameterValue {
        /**
         * 整数类型参数
         */
        m_iParameter: number;

        /**
         * 字符串类型参数
         */
        m_szParameter: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QiFu_Request {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: QiFuRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QiFuRequestValue {
        /**
         * 打开祈福面板，占位
         */
        m_ucOpenPanel: number;

        /**
         * 祈福，配置ID
         */
        m_uiQiFuID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QiFu_Response {
        /**
         * 请求操作协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: QiFuResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QiFuResponseValue {
        /**
         * 打开面板响应
         */
        m_stOpenPanelRsp: QiFuListInfo;

        /**
         * 祈福结果
         */
        m_stQiFuRsp: QiFuRspInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QiFuListInfo {
        /**
         * 经验祈福终身是否使用了，0未使用，1使用
         */
        m_ucJingYan: number;

        /**
         * 金币祈福每天免费次数
         */
        m_ucFreeSliver: number;

        /**
         * 祈福类型个数
         */
        m_ucNumber: number;

        m_astQiFuList: Array<QiFuOneInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QiFuOneInfo {
        /**
         * 祈福类型
         */
        m_ucType: number;

        /**
         * 已经祈福次数
         */
        m_ucNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QiFuRspInfo {
        /**
         * 祈福，配置ID
         */
        m_uiQiFuID: number;

        /**
         * 是否暴击，0未暴击，1暴击
         */
        m_ucBaoJi: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QianKunLu_Request {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: QKLRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QKLRequestValue {
        /**
         * 打开祈福面板，占位
         */
        m_ucOpenPanel: number;

        /**
         * 乾坤炉炼制，配置ID
         */
        m_uiLianZhiID: number;

        /**
         * 购买乾坤炉双倍炼制值，占位
         */
        m_ucBuyDouble: number;

        /**
         * 兑换乾坤炉奖励，配置ID
         */
        m_uiDuiHuanID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QianKunLu_Response {
        /**
         * 请求操作协议类型
         */
        m_usType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: QKLResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QKLResponseValue {
        /**
         * 打开面板响应
         */
        m_stOpenPanel: QKLRspInfo;

        /**
         * 乾坤炉炼制，返回炼制值
         */
        m_stQKLRspInfo: QKLLZRspInfo;

        /**
         * 购买乾坤炉双倍炼制值，返回炼制值
         */
        m_stBuyDouble: QKLRspInfo;

        /**
         * 兑换乾坤炉奖励，返回炼制值
         */
        m_stDuiHuan: QKLRspInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QKLRspInfo {
        /**
         * 炼制值
         */
        m_uiLianZhi: number;

        /**
         * 大于0表示有双倍，0表示没有
         */
        m_uiDoubleValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QKLLZRspInfo {
        /**
         * 炼制值信息
         */
        m_stQKLInfo: QKLRspInfo;

        /**
         * 配置ID
         */
        m_uiLianZhiID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanel_Request {
        /**
         * 任务面板请求类型
         */
        m_usType: number;

        /**
         * 任务类型, QUEST_TYPE_PROF、QUEST_TYPE_FRONT_LINE等
         */
        m_usQuestType: number;

        /**
         * 协议体
         */
        m_stValue: QuestPanelReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanelReqValue {
        /**
         * 查询任务面板中的任务信息, 此处不用填值，默认0
         */
        m_ucList: number;

        /**
         * 任务升星操作类型,仅对前线任务、门派任务有效，1、单次升星；2、一键满星。
         */
        m_stUplevelType: number;

        /**
         * 任务刷新操作，仅对皇榜任务有效, 此处不用填值,默认0
         */
        m_ucRefresh: number;

        /**
         * 仅针对门派任务的，获取额外奖励, 此处不用填值,默认0
         */
        m_ucGetExtReward: number;

        /**
         * 皇榜/前线/门派任务的一键完成, 此处不用填值,默认0
         */
        m_iOneKeyQuestId: number;

        /**
         * 虚空任务刷新操作，仅对虚空任务有效, 此处不用填值,默认0
         */
        m_ucXuKongRefresh: number;

        /**
         * 任务的快速一键完成, 此处不用填值,默认0
         */
        m_iQuickOneKey: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanel_Response {
        /**
         * 任务面板响应结果
         */
        m_iResult: number;

        /**
         * 任务面板响应类型
         */
        m_usType: number;

        /**
         * 任务类型, QUEST_TYPE_PROF、QUEST_TYPE_FRONT_LINE等
         */
        m_usQuestType: number;

        /**
         * 协议体
         */
        m_stValue: QuestPanelRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanelRspValue {
        /**
         * 查询任务面板中的任务信息响应
         */
        m_ucListRsp: QuestPanelListRsp;

        /**
         * 任务升星操作类型响应
         */
        m_stUplevelRsp: QuestPanelUpLevelRsp;

        /**
         * 任务刷新操作响应，仅对皇榜任务有效
         */
        m_stRefresh: QuestPanelRefreshRsp;

        /**
         * 仅针对门派任务的, 此处不用填值,默认0
         */
        m_ucGetExtReward: number;

        /**
         * 皇榜/前线/门派任务的一键完成响应, 此处不用填值,默认0
         */
        m_iOneKeyQuestId: number;

        /**
         * 虚空任务刷新操作响应，仅对虚空任务有效
         */
        m_stXuKongRefresh: QuestPanelXuKongRefreshRsp;

        /**
         * 任务的快速一键完成响应, 此处不用填值,默认0
         */
        m_iQuickOneKey: number;

        /**
         * 日常任务保留次数找回
         */
        m_ucDailyKeepTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanelListRsp {
        /**
         * 任务类型
         */
        m_usType: number;

        /**
         * 任务信息
         */
        m_stValue: QuestPanelQuestInfoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanelQuestInfoList {
        /**
         * 查询门派任务信息响应
         */
        m_stProf: QuestPanelProfInfoList;

        /**
         * 查询前线任务信息响应
         */
        m_stFrontLine: QuestPanelFrontLineInfo;

        /**
         * 查询皇榜任务信息响应
         */
        m_stHuangBang: QuestPanelHuangBangInfoList;

        /**
         * 查询虚空任务信息响应
         */
        m_stXuKong: QuestPanelXuKongInfo;

        /**
         * 查询每日任务保留次数信息响应
         */
        m_ucDailyKeepTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanelProfInfoList {
        /**
         * 任务已升星次数,大于255后，默认为255
         */
        m_ucUpLevelCnt: number;

        /**
         * 门派任务额外奖励是否已领取，0未领取；1已领取
         */
        m_ucExtRewardFlag: number;

        /**
         * 列表数量
         */
        m_ucNumber: number;

        /**
         * 任务信息
         */
        m_stInfo: Array<QuestPanelProfInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanelProfInfo {
        /**
         * 任务id
         */
        m_iQuestId: number;

        /**
         * 任务状态  /放弃/已领取奖励
         */
        m_iQuestStatus: number;

        /**
         * 当前星级 [1,5]
         */
        m_ucLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanelFrontLineInfo {
        /**
         * 任务id
         */
        m_iQuestId: number;

        /**
         * 任务状态  /放弃/已领取奖励
         */
        m_iQuestStatus: number;

        /**
         * 当前星级 [1,5]
         */
        m_ucLevel: number;

        /**
         * 当前前线任务目标敌国国家id
         */
        m_ucDestZoneID: number;

        /**
         * 当天已完成前线任务次数
         */
        m_ucDayCompleteCnt: number;

        /**
         * 任务已升星次数,大于255后，默认为255
         */
        m_ucUpLevelCnt: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanelHuangBangInfoList {
        /**
         * 任务已刷新次数,大于255后，默认为255
         */
        m_ucRefreshCnt: number;

        /**
         * 皇榜任务完成次数
         */
        m_iCompletedTimes: number;

        /**
         * 列表数量
         */
        m_ucNumber: number;

        /**
         * 任务信息
         */
        m_stInfo: Array<QuestPanelHuangBangInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanelHuangBangInfo {
        /**
         * 任务id
         */
        m_iQuestId: number;

        /**
         * 任务状态  /放弃/已领取奖励
         */
        m_iQuestStatus: number;

        /**
         * 当前皇榜任务目标国家id
         */
        m_ucDestZoneID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanelXuKongInfo {
        /**
         * 任务已刷新次数,大于255后，默认为255
         */
        m_ucRefreshCnt: number;

        /**
         * 下一个任务id,若身上无任务，则根据此任务id显示在面板上，未接
         */
        m_iNextQuestId: number;

        /**
         * 当天任务完成次数
         */
        m_iCompletedTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanelUpLevelRsp {
        /**
         * 操作类型1、单次升星；2、一键满星
         */
        m_ucType: number;

        /**
         * 升星操作的任务id
         */
        m_iQuestId: number;

        /**
         * 当前星级 [1,5]
         */
        m_ucLevel: number;

        /**
         * 星级变化量, 0升星失败
         */
        m_ucLevelChange: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanelRefreshRsp {
        /**
         * 任务已刷新次数,大于255后，默认为255
         */
        m_ucRefreshCnt: number;

        /**
         * 列表数量
         */
        m_ucNumber: number;

        /**
         * 任务信息
         */
        m_stInfo: Array<QuestPanelHuangBangInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestPanelXuKongRefreshRsp {
        /**
         * 任务已刷新次数,大于255后，默认为255
         */
        m_ucRefreshCnt: number;

        /**
         * 刷新后的虚空任务id
         */
        m_iNextQuestId: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestionActivity_Notify {
        /**
         * 通知类型
         */
        m_ucType: number;

        /**
         * 通知内容
         */
        m_stActivityInfo: QuestionActivityInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestionActivityInfo {
        /**
         * 通知准备
         */
        m_stPrepareInfo: QuestionPrepareInfo;

        /**
         * 通知出题
         */
        m_stQuestionInfo: QuestionQuestionInfo;

        /**
         * 通知答案
         */
        m_stAnswerInfo: QuestionAnswerInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestionPrepareInfo {
        /**
         * 倒计时时间
         */
        m_uiPrepareTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestionQuestionInfo {
        /**
         * 答题剩余时间
         */
        m_uiLeftTime: number;

        /**
         * 题目ID
         */
        m_uiQuestionID: number;

        /**
         * 第几道题
         */
        m_uiQuestionCount: number;

        /**
         * 角色答题累计信息
         */
        m_stRoleAccInfo: QuestionRoleAccInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestionRoleAccInfo {
        /**
         * 累计答对个数
         */
        m_uiAccCount: number;

        /**
         * 累计得到铜钱
         */
        m_uiAccTongQian: number;

        /**
         * 累计得到历练
         */
        m_uiAccLiLian: number;

        /**
         * 累计得到经验
         */
        m_uiAccExp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class QuestionAnswerInfo {
        /**
         * 下次出题时间
         */
        m_uiLeftTime: number;

        /**
         * 题目ID
         */
        m_uiQuestionID: number;

        /**
         * 第几道题
         */
        m_uiQuestionCount: number;

        /**
         * 正确答案
         */
        m_bAnswer: number;

        /**
         * 是否答对
         */
        m_bCorrect: number;

        /**
         * 角色答题累计信息
         */
        m_stRoleAccInfo: QuestionRoleAccInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RecruitAlchemist_Request {
        /**
         * 操作类型,ALCHEMIST_NORMAL_TYPE,ALCHEMIST_EDWARD_TYPE,ALCHEMIST_ITEM_TYPE
         */
        m_iOperateType: number;

        /**
         * 星魂ID, 暂时没用到
         */
        m_iCrystalID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RecruitAlchemist_Response {
        
        m_iResultID: number;

        /**
         * 操作类型
         */
        m_iOperateType: number;

        /**
         * 炼金师(猎魂)level 1 - 5
         */
        m_iAlchemistLevel: number;

        /**
         * 炼金师(召唤)level 1 - 5
         */
        m_iZhaoHuanLevel: number;

        /**
         * 星魂ID
         */
        m_iCrystalID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RefreshDroppedSightInfo_Notify {
        
        m_stDroppedSightInfoList: DroppedSightInfoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DroppedSightInfoList {
        /**
         * 物品数量
         */
        m_ucNumber: number;

        m_astDroppedInfo: Array<DroppedThingInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DroppedThingInfo {
        /**
         * 单元ID
         */
        m_iUnitID: number;

        /**
         * 物品ID
         */
        m_iThingID: number;

        /**
         * 物品数量
         */
        m_iThingNumber: number;

        /**
         * 物品颜色
         */
        m_ucThingColor: number;

        /**
         * 所有者类型 队伍或个人
         */
        m_iOwnerType: number;

        /**
         * 所有者
         */
        m_stRoleID: RoleID;

        /**
         * 所有者
         */
        m_stTeamID: TEAMID;

        /**
         * 拾取类型
         */
        m_iGetType: number;

        /**
         * 出生坐标,即掉落的怪物坐标,前台做动画用
         */
        m_stSrcPos: UnitPosition;

        /**
         * 物品坐标
         */
        m_stCurPos: UnitPosition;

        /**
         * 保留字段
         */
        m_iParam: number;

        /**
         * 提示掉落字段
         */
        m_iTipsTextID: number;

        /**
         * 拾取时提示方式
         */
        m_ucTipsType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RefreshLeavedSightInfo_Notify {
        
        m_stLeavedSightInfoList: LeavedSightInfoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LeavedSightInfoList {
        /**
         * 离开视野单位数量
         */
        m_ushNumber: number;

        m_aiLeaveUnitID: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RefreshMonsterSightInfo_Notify {
        
        m_stMonsterSightInfoList: MonsterSightInfoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonsterSightInfoList {
        /**
         * 怪物个数
         */
        m_ucNumber: number;

        m_astMonsterSightInfo: Array<MonsterSightInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonsterSightInfo {
        /**
         * 单位信息
         */
        m_stUnitSightInfo: UnitSightInfo;

        /**
         * 怪物ID
         */
        m_iMonsterID: number;

        /**
         * 怪物TagID，脚本用的
         */
        m_iMonsterTagID: number;

        /**
         * PVP_ARMY副本中，军团所属
         */
        m_ucArmyID: number;

        /**
         * 这只怪是突然冒出来:复活或新怪
         */
        m_ucIsNew: number;

        /**
         * 怪物附加名字信息
         */
        m_szName: string;

        /**
         * rmb战场宝箱结束时间
         */
        m_uiRMBBoxEndTime: number;

        /**
         * 额外类型
         */
        m_usExtraType: number;

        /**
         * 协议体
         */
        m_stValue: MonsterSightExtraValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class UnitSightInfo {
        /**
         * 单位编号
         */
        m_iUnitID: number;

        /**
         * 单位类型
         */
        m_ucUnitType: number;

        /**
         * 血量
         */
        m_iHP: number;

        /**
         * 法量
         */
        m_iMP: number;

        /**
         * 最大血量
         */
        m_iMaxHP: number;

        /**
         * 最大法量
         */
        m_iMaxMP: number;

        /**
         * 速度
         */
        m_iSpeed: number;

        /**
         * 等级
         */
        m_usLevel: number;

        /**
         * 状态
         */
        m_uiUnitStatus: number;

        /**
         * 阵营
         */
        m_ucCampID: number;

        /**
         * 路径
         */
        m_stUnitMovement: UnitMovement;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonsterSightExtraValue {
        /**
         * 普通怪占位符
         */
        m_ucReserved: number;

        /**
         * 人形怪
         */
        m_stMonsterSightInfoRole: MonsterSightInfoRole;

        /**
         * 随宠怪
         */
        m_stMonsterSightInfoPet: MonsterSightInfoPet;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonsterSightInfoRole {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 角色BaseProInfo
         */
        m_stBaseProfile: BaseProfile;

        /**
         * avatar
         */
        m_stAvatarList: AvatarList;

        /**
         * 角色宗派信息
         */
        m_stGuildInfo: GuildInfo;

        /**
         * 散仙怪UnitID
         */
        m_iPetUnitID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MonsterSightInfoPet {
        /**
         * 主人UnitID
         */
        m_iMasterUnitID: number;

        /**
         * 随宠ID
         */
        m_iPetID: number;

        /**
         * 随宠等级
         */
        m_ushPetLevel: number;

        /**
         * 随宠飞升次数
         */
        m_ucFeiShengCount: number;

        /**
         * 主人名字
         */
        m_szOwnerName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RefreshPetSightInfo_Notify {
        
        m_stPetSightInfoList: PetSightInfoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PetSightInfoList {
        /**
         * 散仙个数
         */
        m_ucNumber: number;

        m_astPetSightInfo: Array<PetSightInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PetSightInfo {
        /**
         * 单位信息
         */
        m_stUnitSightInfo: UnitSightInfo;

        /**
         * 红颜美人ID
         */
        m_iPetID: number;

        /**
         * 主人ID
         */
        m_stOwnerID: RoleID;

        /**
         * 红颜阶数
         */
        m_iPetLayer: number;

        /**
         * 散仙状态
         */
        m_uiPetStatus: number;

        /**
         * 散仙怒气
         */
        m_ucPetRage: number;

        /**
         * 红颜的形象信息
         */
        m_stBeautyImage: BeautyImage;

        /**
         * 飞升次数
         */
        m_ucFSCnt: number;

        /**
         * 觉醒次数
         */
        m_ucAwakeCnt: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BeautyImage {
        /**
         * 兵魂装备ID
         */
        m_uiBinHunID: number;

        /**
         * 手环装备ID
         */
        m_uiBraceletID: number;

        /**
         * 圣器等级
         */
        m_uiSQLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RefreshRankInfo_Request {
        /**
         * 排行榜类型
         */
        m_ucRankType: number;

        /**
         * 当前页
         */
        m_ucCurPage: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RefreshRankInfo_Response {
        /**
         * 结果ID
         */
        m_ucResultID: number;

        /**
         * 榜单列表
         */
        m_stRankList: RankList;

        /**
         * 个人排行榜信息RANK TYPE-1为下标
         */
        m_aucMyRank: Array<number>;

        /**
         * 个人排行榜信息
         */
        m_stRankInfo: OneRankInfo;

        /**
         * 当前页
         */
        m_ucCurPage: number;

        /**
         * 总页数
         */
        m_ucTotalPage: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RankList {
        /**
         * 排行榜类型
         */
        m_ucRankType: number;

        /**
         * 榜的行数
         */
        m_usCount: number;

        /**
         * 排行榜信息
         */
        m_astRankInfo: Array<OneRankInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneRankInfo {
        /**
         * 角色RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 角色BaseProInfo
         */
        m_stBaseProfile: BaseProfile;

        /**
         * 本榜排序主字段
         */
        m_llOrder1: number;

        /**
         * 本榜排序辅字段 前台忽略
         */
        m_llOrder2: number;

        /**
         * 本榜排序辅字段 前台忽略
         */
        m_llOrder3: number;

        /**
         * 排行榜类型
         */
        m_ucType: number;

        /**
         * 附带数据类型
         */
        m_ucExtraType: number;

        /**
         * 带外扩展信息，根据榜单类型不同而不同
         */
        m_stExtraInfo: ExtraInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ExtraInfo {
        /**
         * 保留 不填
         */
        m_ucReserver: number;

        /**
         * 保留 附带角色信息
         */
        m_stRoleInfo: ExtraRoleInfo;

        /**
         * 保留 附带祝福子系统信息
         */
        m_stHeroSubInfo: ExtraHeroSubInfo;

        /**
         * 保留 附带红颜系统信息
         */
        m_stBeautyInfo: ExtraBeautyInfo;

        /**
         * 保留 附带道宫九星系统信息
         */
        m_stJiuXingInfo: ExtraJiuXingInfo;

        /**
         * 保留 附带法器系统信息
         */
        m_stFaQiInfo: ExtraFaQiInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ExtraRoleInfo {
        /**
         * 玩家Avatar
         */
        m_stAvatarList: AvatarList;

        /**
         * 宗派名字
         */
        m_szGuildName: string;

        /**
         * 角色战力
         */
        m_uiFightVal: number;

        /**
         * 聚元系统ID
         */
        m_iJuYuanID: number;

        /**
         * 装备列表
         */
        m_stThingInfoList: EquipContainerThingInfoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ExtraHeroSubInfo {
        /**
         * 子系统战斗力
         */
        m_uiFightVal: number;

        /**
         * 聚元系统ID
         */
        m_iJuYuanID: number;

        /**
         * 子系统当前显示的modelID
         */
        m_uiShowID: number;

        /**
         * 物品数量
         */
        m_ucNumber: number;

        m_astThingInfo: Array<ContainerThingInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ExtraBeautyInfo {
        /**
         * 红颜美人ID
         */
        m_iPetID: number;

        /**
         * 红颜当前阶数
         */
        m_iPetLayer: number;

        /**
         * 红颜总阶数
         */
        m_iTotalLayer: number;

        /**
         * 物品数量
         */
        m_usNumber: number;

        m_astThingInfo: Array<ContainerThingInfo>;

        /**
         * 武缘个数
         */
        m_ucPetCount: number;

        /**
         * 武缘个数
         */
        m_stPetList: Array<ExtraBeautyOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ExtraBeautyOne {
        /**
         * 红颜美人ID
         */
        m_iPetID: number;

        /**
         * 红颜当前阶数
         */
        m_iPetLayer: number;

        /**
         * 红颜飞升次数
         */
        m_ucFSCnt: number;

        /**
         * 红颜当前战力
         */
        m_iFight: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ExtraJiuXingInfo {
        /**
         * 道宫九星技能数量
         */
        m_usNumber: number;

        m_iSkillID: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ExtraFaQiInfo {
        /**
         * 法器形象id
         */
        m_ucShowId: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RefreshRewardQuest_Request {
        /**
         * 任务类型
         */
        m_ucQuestType: number;

        /**
         * 刷新次数: 0为不限制
         */
        m_ucRefreshTimes: number;

        /**
         * 目标颜色
         */
        m_ucRefreshColore: number;

        /**
         * 自动购买
         */
        m_ucIsAutobuy: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RefreshRoleSightInfo_Notify {
        
        m_stRoleSightInfoList: RoleSightInfoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleSightInfoList {
        /**
         * 角色个数
         */
        m_ucNumber: number;

        m_astRoleSightInfo: Array<RoleSightInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleSightInfo {
        /**
         * 单位信息
         */
        m_stUnitSightInfo: UnitSightInfo;

        /**
         * ROLEID
         */
        m_stID: RoleID;

        /**
         * 角色BaseProInfo
         */
        m_stBaseProfile: BaseProfile;

        /**
         * 时装
         */
        m_stAvatarList: AvatarList;

        /**
         * 角色宗派信息
         */
        m_stGuildInfo: GuildInfo;

        /**
         * 玩家显示的固定称号
         */
        m_stShowFixTitleInfo: ShowTitleFixList;

        /**
         * PK信息
         */
        m_stPKInfo: PKInfo;

        /**
         * 跳跃信息
         */
        m_stJumpInfo: Transport_Notify;

        /**
         * PVP_ARMY副本中，军团所属
         */
        m_ucArmyID: number;

        /**
         * 天地称号
         */
        m_uiTDTitleBitMap: number;

        /**
         * 聚元ID
         */
        m_iJuYuanInfo: number;

        /**
         * 玩家当前接受国运任务的等级 [1,5] 0是无效
         */
        m_ucGuoYunLevel: number;

        /**
         * 配偶名称
         */
        m_szLoverNickName: string;

        /**
         * 人民币战场宝箱信息
         */
        m_stRMBZCInfo: RMBZCInfo;

        /**
         * 极限挑战称号
         */
        m_uiJXTZTitle: number;

        /**
         * 守护神id
         */
        m_iShieldGodID: number;

        /**
         * 队伍ID
         */
        m_iTeamID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Transport_Notify {
        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        /**
         * 目的方向
         */
        m_ucDirection: number;

        /**
         * 目的位置
         */
        m_stPosition: UnitPosition;

        /**
         * 跳跃点个数
         */
        m_ucNum: number;

        /**
         * 跳跃点ID
         */
        m_aiID: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RemoveNPC_Notify {
        /**
         * NPC ID
         */
        m_iNPCID: number;

        /**
         * 是否显示 1是显示,0是隐藏
         */
        m_ucShow: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Revival_Request {
        /**
         * 发送请求的角色ID
         */
        m_stOperatorID: RoleID;

        /**
         * 被复活的角色ID
         */
        m_stTargetID: RoleID;

        /**
         * 复活类型，取值参见枚举RevivalType
         */
        m_ucRevivalType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Revival_Response {
        /**
         * 错误码
         */
        m_ushResultID: number;

        /**
         * 发送请求的角色ID
         */
        m_stOperatorID: RoleID;

        /**
         * 被复活的角色ID
         */
        m_stTargetID: RoleID;

        /**
         * 复活类型，取值参见枚举RevivalType
         */
        m_ucRevivalType: number;

        /**
         * 复活后的场景ID
         */
        m_iSceneID: number;

        /**
         * 复活后的坐标
         */
        m_stPosition: UnitPosition;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleReturn_Request {
        /**
         * 回归玩家操作协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: RoleReturnReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleReturnReqValue {
        /**
         * 查询玩家的回归信息，不用赋值，默认0
         */
        m_ucListReq: number;

        /**
         * 获取回归玩家的登录礼包，领取第几天的礼包，1-3
         */
        m_ucLoginDaysReq: number;

        /**
         * 呼朋唤友的礼包，朋友的名字
         */
        m_szFriendNickName: string;

        /**
         * 回归玩家获取充值礼包，不用赋值，默认0
         */
        m_ucGetChargeGiftReq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleReturn_Response {
        /**
         * 响应结果
         */
        m_ushResultID: number;

        /**
         * 回归玩家操作协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: RoleReturnRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleReturnRspValue {
        /**
         * 回归玩家查询协议响应
         */
        m_stListDataRsp: RoleReturnListRsp;

        /**
         * 返回玩家已经领取的礼包信息
         */
        m_stGiftInfoRsp: RoleReturnGetGiftRsp;

        /**
         * 呼朋唤友的礼包，朋友的名字
         */
        m_szFriendNickName: string;

        /**
         * 回归玩家获取充值礼包，不用赋值，默认0
         */
        m_ucGetChargeGiftRsp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleReturnListRsp {
        /**
         * 记录玩家领取回归礼包的记录，从位置1开始，对应第一天。0位置无效
         */
        m_iGetGiftFlag: number;

        /**
         * 玩家回归第几天，超过7天后再登录，此值会重置为1
         */
        m_iReturnDays: number;

        /**
         * 记录回归玩家回馈战友次数，最多一次，超过7天后再登录，会重置为0
         */
        m_cCallCnt: number;

        /**
         * 记录回归玩家领取回归充值礼包的状态，0:不可领取，1:待领取，2:已领取
         */
        m_cChargeGiftStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleReturnGetGiftRsp {
        /**
         * 记录玩家领取回归礼包的记录，从位置1开始，对应第一天。0位置无效
         */
        m_iGetGiftFlag: number;

        /**
         * 领取第几天的礼包，1-3
         */
        m_ucLoginDays: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleWing_Request {
        /**
         * 类型
         */
        m_ucType: number;

        /**
         * CS请求体
         */
        m_stValue: RoleWingReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleWingReqValue {
        /**
         * 翅膀合成
         */
        m_stWingCreateReq: RoleWingCreateReq;

        /**
         * 翅膀强化 只强身上穿的
         */
        m_ucStrengthenReq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleWingCreateReq {
        /**
         * 合成配置ID
         */
        m_iID: number;

        /**
         * 材料A
         */
        m_stContainerThingA: ContainerThing;

        /**
         * 材料B
         */
        m_stContainerThingB: ContainerThing;

        /**
         * 材料C
         */
        m_stContainerThingC: ContainerThing;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleWing_Response {
        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 类型
         */
        m_ucType: number;

        /**
         * CS响应体
         */
        m_stValue: RoleWingRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleWingRspValue {
        /**
         * 翅膀合成
         */
        m_stWingCreateRsp: RoleWingCreateRsp;

        /**
         * 翅膀强化 只强身上穿的
         */
        m_stStrengthenRsp: RoleWingStrengthenRsp;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleWingCreateRsp {
        /**
         * 获得物品
         */
        m_stGetContainerThingList: ContainerThingList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RoleWingStrengthenRsp {
        /**
         * 强化后等级
         */
        m_ucLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SCCanGetRewardNotify {
        /**
         * 类型
         */
        m_stData: SCDataInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SCGetInfoRequest {
        /**
         * 占位用，不填
         */
        m_ucFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SCGetInfoResponse {
        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 类型
         */
        m_stData: SCDataInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SCGetRewardRequest {
        /**
         * 领取的档次，直接发第几档过来
         */
        m_ucGetBit: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SCGetRewardResponse {
        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 类型
         */
        m_stData: SCDataInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SaiJiActive_Request {
        /**
         * 赛季ID
         */
        m_iSaiJiID: number;

        /**
         * 外显ID
         */
        m_iShowID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SaiJiActive_Response {
        /**
         * 结果码
         */
        m_iResult: number;

        /**
         * 赛季ID
         */
        m_iSaiJiID: number;

        /**
         * 外显ID
         */
        m_iShowID: number;

        /**
         * 个人赛季信息
         */
        m_stDBSaiJiInfo: DBSaiJiInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBSaiJiInfo {
        /**
         * 赛季总轮数
         */
        m_ucSaiJiCnt: number;

        /**
         * 赛季轮次信息
         */
        m_astSaiJiList: Array<DBSaiJiOne>;

        /**
         * 最后激活时间 排行榜用
         */
        m_uiLastActiveTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class DBSaiJiOne {
        /**
         * 激活BitMap ID - 1存放
         */
        m_iActiveBitMap: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SaiJiPannel_Request {
        /**
         * 占位
         */
        m_iTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SaiJiPannel_Response {
        /**
         * 结果码
         */
        m_iResult: number;

        /**
         * 个人赛季信息
         */
        m_stDBSaiJiInfo: DBSaiJiInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfo_Notify {
        /**
         * 类型,1右侧信息提示，2伤害面板，3结算面板
         */
        m_ucType: number;

        /**
         * 场景信息
         */
        m_stData: SceneInfoValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoValue {
        /**
         * 右侧信息
         */
        m_stRight: SceneInfoRightList;

        /**
         * 伤害面板
         */
        m_stHurt: SceneInfoHurt;

        /**
         * 结算面板
         */
        m_stResult: SceneInfoResult;

        /**
         * BOSS引导面板
         */
        m_stBossGuide: SceneInfoBossGuide;

        /**
         * 进度信息
         */
        m_stProcess: SceneInfoProcess;

        /**
         * 进度信息
         */
        m_stArtWords: SceneArtWords;

        /**
         * 阵营信息
         */
        m_stCampInfo: SceneInfoCamp;

        /**
         * 双倍经验信息
         */
        m_stDoubleExp: SceneInfoDoubleExp;

        /**
         * 特殊信息
         */
        m_stSpecialInfo: SceneInfoSpecial;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoRightList {
        /**
         * 信息行长度
         */
        m_ucNum: number;

        /**
         * 每行的信息
         */
        m_astData: Array<SceneInfoRight>;

        /**
         * 面板名称
         */
        m_szTitle: string;

        /**
         * 面板tips信息，0标识没有
         */
        m_uiTipsID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoRight {
        /**
         * 类型
         */
        m_ucType: number;

        /**
         * 具体信息
         */
        m_stValue: SceneInfoRightValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoRightValue {
        /**
         * 进度条
         */
        m_stProgress: SceneInfoProgress;

        /**
         * 文本
         */
        m_stText: SceneInfoText;

        /**
         * 倒计时
         */
        m_stCountdown: SceneInfoCountdown;

        /**
         * 分割线,占位，默认0
         */
        m_ucLine: number;

        /**
         * 物品icon
         */
        m_stThing: SceneInfoThingList;

        /**
         * 怪物头像
         */
        m_stMonster: SceneInfoMonsterList;

        /**
         * 按钮
         */
        m_stButton: SceneInfoButtonList;

        /**
         * 挂机经验,需要累加的经验值
         */
        m_uiExp: number;

        /**
         * 排行面板
         */
        m_stRank: SceneInfoRank;

        /**
         * 八门信息
         */
        m_stBMInfo: SceneInfoBMList;

        /**
         * 任务信息
         */
        m_stTaskInfo: SceneTaskInfoRight;

        /**
         * 带血量百分比的怪物头像
         */
        m_stBloodMonster: SceneInfoBloodMonsterList;

        /**
         * 图片
         */
        m_stImage: SceneInfoImage;

        /**
         * 跨服决斗场决赛 右侧面板
         */
        m_stKFJDCFinalRight: KFJDCFinalRight;

        /**
         * 目标坐标
         */
        m_stTargetCoord: SceneTargetCoord;

        /**
         * 角色信息
         */
        m_stRole: SceneInfoRoleList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoProgress {
        /**
         * 进度条标题, 空则表示不需要显示，支持富文本
         */
        m_szTitle: string;

        /**
         * 进度条百分比
         */
        m_ucNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoText {
        /**
         * 文本信息，支持富文本
         */
        m_szString: string;

        /**
         * 是否显示前缀图标,0不显示，1显示
         */
        m_ucIsShow: number;

        /**
         * 场景右侧信息中的文本参数
         */
        m_stParameter: SceneInfoParameter;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoParameter {
        /**
         * 类型
         */
        m_ucTpye: number;

        /**
         * 参数1
         */
        m_uiParameter1: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoCountdown {
        /**
         * 此倒计时的id，该场景唯一
         */
        m_ucTimeID: number;

        /**
         * 文本信息，支持富文本
         */
        m_szTitle: string;

        /**
         * 需要倒计时的总数，单位秒
         */
        m_uiTime: number;

        /**
         * 是否要居中显示
         */
        m_ucIsCenter: number;

        /**
         * 是否暂停
         */
        m_ucPause: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoThingList {
        /**
         * 数量
         */
        m_ucNum: number;

        /**
         * 物品ID
         */
        m_astThing: Array<SceneInfoThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoThing {
        /**
         * 物品ID
         */
        m_uiThingID: number;

        /**
         * 物品数量
         */
        m_uiThingNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoMonsterList {
        /**
         * 数量
         */
        m_ucNum: number;

        /**
         * 怪物的信息
         */
        m_astInfo: Array<SceneInfoOneMonster>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoOneMonster {
        /**
         * 怪物id
         */
        m_uiMonstID: number;

        /**
         * 被击杀状态，0未击杀，1已击杀
         */
        m_ucIsKilled: number;

        /**
         * 坐标x
         */
        m_iPosX: number;

        /**
         * 坐标y
         */
        m_iPosY: number;

        /**
         * 复活时间
         */
        m_iRevaveTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoButtonList {
        /**
         * 数量
         */
        m_ucNum: number;

        /**
         * 按钮类型信息，1退出、2战斗
         */
        m_aucButtonType: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoRank {
        /**
         * 行头第1列标题
         */
        m_szTitle1: string;

        /**
         * 行头第2列标题
         */
        m_szTitle2: string;

        /**
         * 行头第3列标题
         */
        m_szTitle3: string;

        /**
         * 排行榜数量
         */
        m_ucFieldNum: number;

        /**
         * 排行榜最多行数
         */
        m_astField: Array<SceneInfoOneField>;

        /**
         * 自己的信息,空就不显示
         */
        m_stOwnerField: SceneInfoOneField;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoOneField {
        /**
         * 第一列,排名
         */
        m_uiField1: number;

        /**
         * 第二列,文字说明
         */
        m_szField2: string;

        /**
         * 第三列，数量
         */
        m_uiField3: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoBMList {
        /**
         * 一条八门信息
         */
        m_astInfo: Array<SceneInfoOneBM>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoOneBM {
        /**
         * 八门的信息，0是未知，1-8对应八门的类型
         */
        m_uiType: number;

        /**
         * 坐标x
         */
        m_iPosX: number;

        /**
         * 坐标y
         */
        m_iPosY: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneTaskInfoRight {
        /**
         * 任务信息
         */
        m_astRightTaskInfo: Array<RightTaskInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class RightTaskInfo {
        /**
         * 任务名称
         */
        m_szTaskName: string;

        /**
         * 奖励状态信息
         */
        m_szTaskState: string;

        /**
         * 奖励状态(用于客户端特殊处理)
         */
        m_uiRewardState: number;

        /**
         * 任务id
         */
        m_uiTaskId: number;

        /**
         * 奖励信息
         */
        m_stList: SimItemList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoBloodMonsterList {
        /**
         * 数量
         */
        m_ucNum: number;

        /**
         * 怪物的信息
         */
        m_astInfo: Array<SceneInfoOneBloodMonster>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoOneBloodMonster {
        /**
         * 怪物id
         */
        m_uiMonstID: number;

        /**
         * 被击杀状态，0未击杀，1已击杀
         */
        m_ucIsKilled: number;

        /**
         * 坐标x
         */
        m_iPosX: number;

        /**
         * 坐标y
         */
        m_iPosY: number;

        /**
         * 怪物血量百分比
         */
        m_iBloodVolume: number;

        /**
         * 最后一刀的阵营
         */
        m_ucCamp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoImage {
        /**
         * 图片ID
         */
        m_iImageID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFJDCFinalRight {
        /**
         * 左侧玩家RoleID
         */
        m_stLeftRoleID: RoleID;

        /**
         * 右侧玩家RoleID
         */
        m_stRightRoleID: RoleID;

        /**
         * 左侧性别
         */
        m_iLeftGender: number;

        /**
         * 右侧性别
         */
        m_iRightGender: number;

        /**
         * 左侧玩家名字
         */
        m_szLeftName: string;

        /**
         * 右侧玩家名字
         */
        m_szRightName: string;

        /**
         * 左侧玩家胜负 参考宏KFJDC_FINAL_BEG_STATUS
         */
        m_iLeftStatus: number;

        /**
         * 右侧玩家胜负 参考宏KFJDC_FINAL_BEG_STATUS
         */
        m_iRightStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneTargetCoord {
        /**
         * 坐标x
         */
        m_iPosX: number;

        /**
         * 坐标y
         */
        m_iPosY: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoRoleList {
        /**
         * 数量
         */
        m_ucNum: number;

        /**
         * 怪物的信息
         */
        m_astInfo: Array<SceneInfoOneRole>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoOneRole {
        /**
         * 玩家RoleID
         */
        m_stRoleID: RoleID;

        /**
         * 性别
         */
        m_iGender: number;

        /**
         * 职业
         */
        m_iProf: number;

        /**
         * 坐标x
         */
        m_iPosX: number;

        /**
         * 坐标y
         */
        m_iPosY: number;

        /**
         * 角色worldid
         */
        m_iWorldID: number;

        /**
         * 玩家名字
         */
        m_szName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoHurt {
        /**
         * 面板名称
         */
        m_szTitle: string;

        /**
         * 面板类型，1五人面板。2多人面板
         */
        m_ucType: number;

        /**
         * 信息行长度
         */
        m_ucNum: number;

        /**
         * 信息内容
         */
        m_astData: Array<SceneRoleHurt>;

        /**
         * 自己的伤害信息,为空不显示
         */
        m_astOwnerData: SceneRoleHurt;

        /**
         * 额外文字信息，支持富文本
         */
        m_szExtText: string;

        /**
         * 排名奖励信息
         */
        m_astRankRewardInfo: Array<SceneRankRewardInfo>;

        /**
         * 所有玩家的总伤害
         */
        m_llAccHurt: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneRoleHurt {
        /**
         * 玩家信息，支持富文本
         */
        m_szRoleInfo: string;

        /**
         * 玩家伤害值
         */
        m_uiHurtNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneRankRewardInfo {
        /**
         * 排名奖励的文字信息
         */
        m_szRankExtText: string;

        /**
         * 奖励物品列表
         */
        m_stList: SimItemList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoResult {
        /**
         * 结果；0失败，1胜利，2通关奖励,3排名信息,4跨服角斗场奖励信息
         */
        m_ucResult: number;

        /**
         * 场景结算面板数据
         */
        m_stData: SceneInfoResultValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoResultValue {
        /**
         * 失败信息
         */
        m_stFail: SceneResultFail;

        /**
         * 胜利信息
         */
        m_stSuccess: SceneResultSuccess;

        /**
         * 通关信息
         */
        m_stPass: SceneResultPass;

        /**
         * PVP排名信息
         */
        m_stPVPRank: PVPRankResult;

        /**
         * 跨服角斗场奖励信息
         */
        m_stSinlePVPReward: SinglePVPReward;

        /**
         * 活动失败信息
         */
        m_stActFail: SceneResultActFail;

        /**
         * 跨服宗门战结算信息
         */
        m_stGuildCrossPVPResult: GuildCrossPVPResult;

        /**
         * 跨服3V3奖励信息
         */
        m_stMultiPVPReward: MultiPVPReward;

        /**
         * 珍珑棋局
         */
        m_stSceneResultZLQJ: SceneResultZLQJ;

        /**
         * 四象斗兽结算信息
         */
        m_stColosseumPKReward: ColosseumPKReward;

        /**
         * 武缘远征结算信息
         */
        m_stWYYZValue: SceneInfoResultWYYZ;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneResultFail {
        /**
         * 文字信息，支持富文本, 为空不显示
         */
        m_szText: string;

        /**
         * 是否显示挑战下关按钮,0不显示，1显示, 2带倒计时显示
         */
        m_ucShowExit: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneResultSuccess {
        /**
         * 文字信息，支持富文本, 为空不显示
         */
        m_szText: string;

        /**
         * 是否新记录,0不是，1是
         */
        m_ucIsBest: number;

        /**
         * 物品列表
         */
        m_stThingList: SceneInfoThingList;

        /**
         * 耗时，单位秒
         */
        m_uiTime: number;

        /**
         * 当前进度
         */
        m_iCurProsess: number;

        /**
         * 最大进度
         */
        m_iMaxProsess: number;

        /**
         * 是否显示挑战下关按钮,0不显示，1显示, 2带倒计时显示
         */
        m_ucShowNext: number;

        /**
         * 是否显示挑战下关按钮,0不显示，1显示, 2带倒计时显示
         */
        m_ucShowExit: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneResultPass {
        /**
         * 文字信息，支持富文本
         */
        m_szText: string;

        /**
         * 通关耗时，单位秒
         */
        m_uiTime: number;

        /**
         * 死亡次数
         */
        m_uiDeadCnt: number;

        /**
         * 击杀经验
         */
        m_uiKillExp: number;

        /**
         * 通关经验
         */
        m_uiPassExp: number;

        /**
         * 固定奖励的物品列表
         */
        m_stThingList: SceneInfoThingList;

        /**
         * 是否显示挑战下关按钮,0不显示，1显示, 2带倒计时显示
         */
        m_ucShowNext: number;

        /**
         * 是否显示挑战下关按钮,0不显示，1显示, 2带倒计时显示
         */
        m_ucShowExit: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PVPRankResult {
        /**
         * 排行版长度
         */
        m_ucNum: number;

        /**
         * 排行榜内容
         */
        m_astRankData: Array<PVPRankOne>;

        /**
         * 个人排名
         */
        m_iPersonalRank: number;

        /**
         * 个人积分
         */
        m_iPersonalScore: number;

        /**
         * 奖励资金
         */
        m_iRewardMoney: number;

        /**
         * 固定奖励的物品列表
         */
        m_stThingList: SceneInfoThingList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class PVPRankOne {
        /**
         * 排名
         */
        m_iRank: number;

        /**
         * 文字信息1
         */
        m_szTextOne: string;

        /**
         * 文字信息2
         */
        m_szTextTwo: string;

        /**
         * 积分
         */
        m_iScore: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SinglePVPReward {
        /**
         * 比赛阶段, 0表示在产生32强中，1(32-16) ，2(16-8)，3(8-4)，4(4-2)，5(2-1)
         */
        m_ucGameStage: number;

        /**
         * 比赛结果, 失败(0),成功(1)
         */
        m_ucResult: number;

        /**
         * 段位积分信息
         */
        m_stGradeScoreInfo: GradeScoreInfo;

        /**
         * 物品列表
         */
        m_stThingList: SceneInfoThingList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GradeScoreInfo {
        /**
         * 旧的段位, 0代表最低等级段位
         */
        m_uiOldGrade: number;

        /**
         * 旧的积分, 在最高段位以前积分代表星星数
         */
        m_uiOldScore: number;

        /**
         * 旧的段位最大可容纳星星数
         */
        m_ucOldScoreMax: number;

        /**
         * 新的段位
         */
        m_uiNewGrade: number;

        /**
         * 新的积分
         */
        m_uiNewScore: number;

        /**
         * 新的段位最大可容纳星星数
         */
        m_ucNewScoreMax: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneResultActFail {
        /**
         * 文字信息，支持富文本, 为空不显示
         */
        m_szText: string;

        /**
         * 是否新记录,0不是，1是
         */
        m_ucIsBest: number;

        /**
         * 物品列表
         */
        m_stThingList: SceneInfoThingList;

        /**
         * 耗时，单位秒
         */
        m_uiTime: number;

        /**
         * 是否显示挑战下关按钮,0不显示，1显示, 2带倒计时显示
         */
        m_ucShowNext: number;

        /**
         * 是否显示挑战下关按钮,0不显示，1显示, 2带倒计时显示
         */
        m_ucShowExit: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildCrossPVPResult {
        /**
         * 结算的数据条数
         */
        m_ucNum: number;

        /**
         * 结算的数据条数
         */
        m_stResultData: Array<GuildCrossPVPResultValue>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GuildCrossPVPResultValue {
        /**
         * 宗派的排名
         */
        m_ucRank: number;

        /**
         * 宗派名字
         */
        m_szGuildName: string;

        /**
         * 玩家昵称
         */
        m_szChairmanName: string;

        /**
         * 跨服宗派战的积分
         */
        m_uiScore: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MultiPVPReward {
        /**
         * 比赛结果, 失败(0),成功(1)
         */
        m_ucResult: number;

        /**
         * 文字信息1
         */
        m_szTextOne: string;

        /**
         * 文字信息2
         */
        m_szTextTwo: string;

        /**
         * 段位信息
         */
        m_iStage: number;

        /**
         * 总积分
         */
        m_iScore: number;

        /**
         * 增加的积分
         */
        m_iAddScore: number;

        /**
         * 物品数量
         */
        m_ucNum: number;

        /**
         * 物品ID
         */
        m_astThing: Array<MultiPVPThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class MultiPVPThing {
        /**
         * 物品ID
         */
        m_uiThingID: number;

        /**
         * 物品数量
         */
        m_uiThingNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneResultZLQJ {
        /**
         * 标题
         */
        m_szTitle: string;

        /**
         * 个人信息
         */
        m_stSelfInfo: SceneResultZLQJRole;

        /**
         * 珍珑棋局排行个数
         */
        m_ucRankCount: number;

        /**
         * 珍珑棋局排行
         */
        m_stRankList: Array<SceneResultZLQJRole>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneResultZLQJRole {
        
        m_szName: string;

        /**
         * 积分
         */
        m_iScore: number;

        /**
         * 排名
         */
        m_iRank: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ColosseumPKReward {
        /**
         * 比赛结果, 失败(0),成功(1)
         */
        m_ucResult: number;

        /**
         * 文字信息1
         */
        m_szTextOne: string;

        /**
         * 文字信息2
         */
        m_szTextTwo: string;

        /**
         * 段位信息
         */
        m_iStage: number;

        /**
         * 总积分
         */
        m_iScore: number;

        /**
         * 增加的积分
         */
        m_iAddScore: number;

        /**
         * 物品数量
         */
        m_ucNum: number;

        /**
         * 物品ID
         */
        m_astThing: Array<MultiPVPThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoResultWYYZ {
        /**
         * 0失败 1胜利
         */
        m_bWin: number;

        /**
         * 第几个关卡
         */
        m_iLevel: number;

        /**
         * 关卡名字
         */
        m_szLevelName: string;

        /**
         * 奖励道具 失败没有
         */
        m_stReward: SceneInfoThing;

        /**
         * 玩家自身武缘个数
         */
        m_ucSelfPetCnt: number;

        /**
         * 玩家自身武缘个数
         */
        m_stSelfPetList: Array<SceneInfoResultWYYZPet>;

        /**
         * 关卡武缘个数
         */
        m_ucLevelPetCnt: number;

        /**
         * 玩家自身武缘个数
         */
        m_stLevelPetList: Array<SceneInfoResultWYYZPet>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoResultWYYZPet {
        /**
         * 武缘ID
         */
        m_iPetID: number;

        /**
         * 击杀数量
         */
        m_iKillCount: number;

        /**
         * 造成伤害
         */
        m_iHurt: number;

        /**
         * 受到伤害
         */
        m_iBeHurt: number;

        /**
         * 剩余血量万分比
         */
        m_iPercent: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoBossGuide {
        /**
         * 数量
         */
        m_ucNum: number;

        /**
         * 怪物的信息
         */
        m_astBossInfo: Array<BossGuideOneMonster>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class BossGuideOneMonster {
        /**
         * 怪物id
         */
        m_uiMonstID: number;

        /**
         * boss复活剩余时间，0表示boss未死亡
         */
        m_uiTime: number;

        /**
         * 坐标x
         */
        m_iPosX: number;

        /**
         * 坐标y
         */
        m_iPosY: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoProcess {
        /**
         * 最大进度
         */
        m_uiMax: number;

        /**
         * 当前进度
         */
        m_uiCurrent: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneArtWords {
        /**
         * 显示类型
         */
        m_iShowType: number;

        /**
         * 美术字类型
         */
        m_iArtType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoCamp {
        /**
         * 阵营ID
         */
        m_iCamp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoDoubleExp {
        /**
         * 双倍经验激活状态，0未激活，1激活
         */
        m_iStatus: number;

        /**
         * 当前经验数值
         */
        m_uiExp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoSpecial {
        /**
         * 类型
         */
        m_ucType: number;

        /**
         * 具体信息
         */
        m_stValue: SceneInfoSpecialValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneInfoSpecialValue {
        /**
         * 跨服决斗场决赛 选手信息
         */
        m_stKFJDCFinalPlayer: KFJDCFinalPlayer;

        /**
         * 跨服决斗场决赛 倒计时
         */
        m_stKFJDCFinalTime: KFJDCFinalTime;

        /**
         * 跨服决斗场决赛 胜负情况
         */
        m_stKFJDCFinalResult: KFJDCFinalResult;

        /**
         * 组队副本再次挑战
         */
        m_stGroupPinEnterAgain: GroupPinEnterAgain;

        /**
         * 普通面板信息
         */
        m_stSpecailNormalBoard: SpecailNormalBoard;

        /**
         * 副本内怪物死亡特效
         */
        m_stSpecialMonDeadEffect: SpecialMonDeadEffect;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFJDCFinalPlayer {
        /**
         * 左侧玩家UID
         */
        m_iLeftUnitID: number;

        /**
         * 右侧玩家UID
         */
        m_iRightUnitID: number;

        /**
         * 左侧玩家RoleID
         */
        m_stLeftRoleID: RoleID;

        /**
         * 右侧玩家RoleID
         */
        m_stRightRoleID: RoleID;

        /**
         * 左侧性别
         */
        m_iLeftGender: number;

        /**
         * 右侧性别
         */
        m_iRightGender: number;

        /**
         * 左侧职业
         */
        m_iLeftProf: number;

        /**
         * 右侧职业
         */
        m_iRightProf: number;

        /**
         * 左侧玩家名字
         */
        m_szLeftName: string;

        /**
         * 右侧玩家名字
         */
        m_szRightName: string;

        /**
         * 左侧最大血量
         */
        m_iLeftMaxHp: number;

        /**
         * 右侧最大血量
         */
        m_iRightMaxHp: number;

        /**
         * 左侧当前血量
         */
        m_iLeftLeftHp: number;

        /**
         * 右侧当前血量
         */
        m_iRightLeftHp: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFJDCFinalTime {
        /**
         * 倒计时
         */
        m_iTickTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class KFJDCFinalResult {
        /**
         * 胜利玩家RoleID
         */
        m_stWinRoleID: RoleID;

        /**
         * 失败玩家RoleID
         */
        m_stLostRoleID: RoleID;

        /**
         * 胜利掉落方案
         */
        m_iWinDropID: number;

        /**
         * 失败掉落方案
         */
        m_iLostDropID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GroupPinEnterAgain {
        /**
         * 成员个数
         */
        m_iCount: number;

        /**
         * 成员数组
         */
        m_stList: Array<GroupPinEnterAgainOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class GroupPinEnterAgainOne {
        /**
         * 职业
         */
        m_iProf: number;

        /**
         * 性别
         */
        m_iGender: number;

        /**
         * 名字
         */
        m_szName: string;

        /**
         * 状态
         */
        m_iStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SpecailNormalBoard {
        /**
         * 状态
         */
        m_status: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SpecialMonDeadEffect {
        /**
         * 状态
         */
        m_status: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneRightInfo_Notify {
        /**
         * 提示信息列表
         */
        m_stList: SceneRightInfoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneRightInfoList {
        /**
         * 信息组个数
         */
        m_ucNumber: number;

        /**
         * 右边信息数组
         */
        m_astInfo: Array<SceneOneGroupInfo>;

        /**
         * 最后一行特殊显示的提示
         */
        m_aszLastLineInfo: Array<OneField>;

        /**
         * 通关评价
         */
        m_stScore: ScoreInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SceneOneGroupInfo {
        /**
         * Group名字
         */
        m_szCaption: string;

        /**
         * 字段个数
         */
        m_ucFieldNum: number;

        /**
         * 字段列头，空表示不示列头
         */
        m_astFieldTitle: Array<OneField>;

        /**
         * 数据行数
         */
        m_ucDataNum: number;

        /**
         * 字段信息
         */
        m_astFieldData: Array<FieldInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneField {
        
        m_szField: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class FieldInfo {
        /**
         * 颜色
         */
        m_ucColor: number;

        m_aszFieldInfo: Array<OneField>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ScoreInfo {
        /**
         * 最大评价，0表不显示通关评价
         */
        m_ucMaxScore: number;

        /**
         * 当前评价
         */
        m_ucCurScore: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ScriptToClient_Notify {
        /**
         * 操作类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: ScriptNotifyInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ScriptNotifyInfo {
        /**
         * 对菜单的操作类型, 1 关闭菜单
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ServerParameter_Notify {
        /**
         * 参数类型
         */
        m_iType: number;

        /**
         * 协议体
         */
        m_stValue: ServerParameterValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ServerParameterValue {
        /**
         * 开服时间变更
         */
        m_uiSvrStartTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Set_Charge_Rebate_Request {
        /**
         * 充值面额
         */
        m_uiChargeValue: number;

        /**
         * 是否充值，0-否；1-是
         */
        m_bIsSet: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Set_Charge_Rebate_Response {
        /**
         * 返回结果：0成功，其他失败
         */
        m_iResult: number;

        /**
         * 充值面额
         */
        m_uiChargeValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SevenDayFund_Request {
        /**
         * 七天购买协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: SevenDayFundReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SevenDayFundReqValue {
        /**
         * 购买类型
         */
        m_ucBuyType: number;

        /**
         * 奖励领取
         */
        m_stGetTReq: SevenDayFundGetReq;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SevenDayFundGetReq {
        /**
         * 配置Type
         */
        m_ucType: number;

        /**
         * 配置ID
         */
        m_ucGetID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SevenDayFund_Response {
        /**
         * 响应结果
         */
        m_ushResultID: number;

        /**
         * 回归玩家操作协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: SevenDayFundRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SevenDayFundRspValue {
        /**
         * 七天投资购买响应 透传字段
         */
        m_stBuyRsp: SevenDayFundBuyRsp;

        /**
         * 七天投资领取领取 默认0 领取成功
         */
        m_stGetRsp: SevenDayFundGetRsp;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SevenDayFundBuyRsp {
        /**
         * 配置Type
         */
        m_ucBuyType: number;

        /**
         * 七天投资
         */
        m_stSevenDayFundData: SevenDayFundData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SevenDayFundGetRsp {
        /**
         * 配置Type
         */
        m_ucGetType: number;

        /**
         * 七天投资
         */
        m_stSevenDayFundData: SevenDayFundData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShenShouList_Notify {
        /**
         * 神兽列表数据
         */
        m_stShenShouList: ShenShouList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShenShouList {
        
        m_stShenShouInfo: Array<ShenShouInfo>;

        m_astSetFaQiList: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShenShouInfo {
        /**
         * 等阶
         */
        m_uiLayer: number;

        /**
         * 等级
         */
        m_ucLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShenShouOperate_Request {
        /**
         * 操作类型，SHENSHOU_OP_PANEL/SHENSHOU_OP_ACT/SHENSHOU_OP_UPLEVEL/SHENSHOU_OP_SET_FAQI
         */
        m_iType: number;

        /**
         * ID
         */
        m_iID: number;

        /**
         * Position
         */
        m_ucPosition: number;

        /**
         * 额外参数
         */
        m_uiParam: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShenShouOperate_Response {
        /**
         * 操作类型，SHENSHOU_OP_PANEL/SHENSHOU_OP_ACT/SHENSHOU_OP_UPLEVEL/SHENSHOU_OP_SET_FAQI
         */
        m_iType: number;

        /**
         * 错误码 0 成功
         */
        m_iResult: number;

        /**
         * 神兽信息列表
         */
        m_stShenShouList: ShenShouList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShieldGodOperate_Request {
        /**
         * 操作类型，SHIELDGOD_xxxx
         */
        m_iType: number;

        /**
         * 守护神ID
         */
        m_iID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShieldGodOperate_Response {
        /**
         * 操作类型，操作类型，SHIELDGOD_xxxx
         */
        m_iType: number;

        /**
         * 守护神ID
         */
        m_iID: number;

        /**
         * 错误码 0 成功
         */
        m_iResult: number;

        /**
         * 协议体
         */
        m_stValue: ShieldGodOpRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShieldGodOpRspValue {
        /**
         * 激活响应
         */
        m_stActRsp: ShieldGodInfo;

        /**
         * 升级响应
         */
        m_stUpLvRsp: ShieldGodInfo;

        /**
         * 出战的id
         */
        m_iShowID: number;

        /**
         * 列表
         */
        m_stListRsp: ShieldGodInfoList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShowArea_Notify {
        /**
         * 场景编号
         */
        m_uiSceneID: number;

        /**
         * 坐标X
         */
        m_uiX: number;

        /**
         * 坐标Y
         */
        m_uiY: number;

        /**
         * 类型
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShowCountDown_Notify {
        /**
         * 倒计时时间
         */
        m_iCountDown: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ShowEffect_At_Position_Notify {
        /**
         * 坐标位置,移除的时候，默认0，0
         */
        m_stPosition: UnitPosition;

        /**
         * 特效名字
         */
        m_szEffect: string;

        /**
         * 是否要一直运行, 移除的时候，默认0
         */
        m_bisAlwayRun: number;

        /**
         * 角度
         */
        m_ushAngle: number;

        /**
         * 特效状态，0播放，1移除
         */
        m_ucStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkyLottery_Request {
        /**
         * 协议类型
         */
        m_ucType: number;

        /**
         * 抽奖类型,魔帝宝库(1),天宫秘镜(2)
         */
        m_ucLotterType: number;

        /**
         * 协议体
         */
        m_stValue: SkyLotteryRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkyLotteryRequestValue {
        /**
         * 抽奖操作请求次数, 1,10,50
         */
        m_usLotteryNum: number;

        /**
         * 查询类型, 全服抽奖记录（1）,玩家抽奖结果（2）,全服购买记录(10)
         */
        m_ucListType: number;

        /**
         * 所需抽奖次数
         */
        m_iNeedCount: number;

        /**
         * 打开面板请求
         */
        m_ucOpenPanel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkyLottery_Response {
        /**
         * 协议类型
         */
        m_ucType: number;

        /**
         * 抽奖类型
         */
        m_ucLotterType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 积分清零时间
         */
        m_uiTimeOut: number;

        /**
         * 协议体
         */
        m_stValue: SkyLotteryResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkyLotteryResponseValue {
        /**
         * 抽奖操作响应
         */
        m_stOperateRsp: SkyLotteryOperateRsp;

        /**
         * 抽奖结果查询响应
         */
        m_stListRecordRsp: SkyLotteryListRecordRsp;

        /**
         * 次数奖励响应
         */
        m_stExtraRewardRsp: SkyLotteryExtraRewardRsp;

        /**
         * 打开面板回复
         */
        m_stPanel: SkyLotteryPanel;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkyLotteryOperateRsp {
        /**
         * 抽奖操作请求次数, 1,10,50
         */
        m_ucLotteryNum: number;

        /**
         * 抽奖结果
         */
        m_astThingInfo: Array<LotteryThingInfo>;

        /**
         * 中奖的序列号
         */
        m_aiID: Array<number>;

        /**
         * 个人数据
         */
        m_stSkyLotteryData: SkyLotteryData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LotteryThingInfo {
        /**
         * 物品id
         */
        m_iThingID: number;

        /**
         * 物品数量
         */
        m_iThingNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkyLotteryListRecordRsp {
        /**
         * 查询类型, 全服抽奖记录（1）,玩家抽奖结果（2）,全服购买记录(10)
         */
        m_ucListType: number;

        /**
         * 抽奖查询结果，顺序排列，最多记录50条
         */
        m_astRecordList: Array<SkyLotteryRecordList>;

        /**
         * 个人数据
         */
        m_stSkyLotteryData: SkyLotteryData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkyLotteryRecordList {
        /**
         * 玩家ID
         */
        m_stRoleId: RoleID;

        /**
         * 中奖玩家昵称
         */
        m_szNickName: string;

        /**
         * 对应的物品id
         */
        m_aiThingID: number;

        /**
         * 对应的物品id数量
         */
        m_iThingNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkyLotteryExtraRewardRsp {
        /**
         * 奖励ID
         */
        m_iID: number;

        /**
         * 天宫宝镜个人数据
         */
        m_stSkyLotteryData: SkyLotteryData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkyLotteryPanel {
        /**
         * 面板物品数据
         */
        m_stSkyLotteryItemCfgList: Array<SkyLotteryConfig_Server>;

        /**
         * 面板累计奖励
         */
        m_stExchangeItemCfgList: Array<LotteryExchangeCfg_Server>;

        /**
         * 个人数据
         */
        m_stSkyLotteryData: SkyLotteryData;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SkyLotteryConfig_Server {
        /**
         * 优先ID
         */
        m_ucID: number;

        /**
         * BOSS列表
         */
        m_aiBossIDList: Array<number>;

        /**
         * 抽奖类型,1（天宫宝境），2（天宫秘镜）
         */
        m_ucType: number;

        /**
         * 序号
         */
        m_ucSeq: number;

        /**
         * 出现概率
         */
        m_iProb: number;

        /**
         * 物品ID
         */
        m_iItemId: number;

        /**
         * 物品数量
         */
        m_iItemNumber: number;

        /**
         * 抽奖次数
         */
        m_iCount: number;

        /**
         * 是否发布出来，做记录
         */
        m_ucRecordFlag: number;

        /**
         * 显示图标
         */
        m_iIconId: number;

        /**
         * 魂骨角标
         */
        m_iHGicon: number;

        /**
         * 颜色
         */
        m_ucColor: number;

        /**
         * 描述
         */
        m_szTips: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LotteryExchangeCfg_Server {
        /**
         * 版本号ID
         */
        m_iID: number;

        /**
         * 序号Seq
         */
        m_iSeq: number;

        /**
         * 所需次数
         */
        m_iNubmer: number;

        /**
         * 奖励物品
         */
        m_stItemList: Array<LotteryExchangeItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LotteryExchangeItem {
        /**
         * 奖励物品个数
         */
        m_iItemId: number;

        /**
         * 奖励个数
         */
        m_iItemNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SpecialItemListChanged_Notify {
        /**
         * 时限道具列表
         */
        m_stSpecialItemList: SpecialItemList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SpecialThingUsable_Notify {
        /**
         * 物品类型，0 称号
         */
        m_ucThingType: number;

        /**
         * 物品ID
         */
        m_uiThingID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SpecialTransport_Request {
        /**
         * 换线登陆信息
         */
        m_stEnterType: LoginEnterType;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SpecialTransport_Response {
        /**
         * 结果
         */
        m_iResult: number;

        /**
         * 换线登陆信息
         */
        m_stEnterType: LoginEnterType;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLottery_Request {
        /**
         * 协议类型
         */
        m_ucType: number;

        /**
         * 协议体
         */
        m_stValue: StarLotteryRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLotteryRequestValue {
        /**
         * 打开面板
         */
        m_ucPanel: number;

        /**
         * 抽奖操作请求次数, 1,10
         */
        m_ucLotteryNum: number;

        /**
         * 查询类型, 全服抽奖记录（1）,玩家抽奖结果（2）
         */
        m_ucListType: number;

        /**
         * 领取头奖
         */
        m_ucGetTopPrize: number;

        /**
         * 选择头奖
         */
        m_ucTopPrizeChooseID: number;

        /**
         * 分红报名
         */
        m_ucHongBaoEntry: number;

        /**
         * 分红历史记录
         */
        m_ucHongBaoHistory: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLottery_Response {
        /**
         * 协议类型
         */
        m_ucType: number;

        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 协议体
         */
        m_stValue: StarLotteryResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLotteryResponseValue {
        /**
         * 打开面板响应
         */
        m_stPanel: StarLotteryPanel;

        /**
         * 抽奖操作响应
         */
        m_stOperateRsp: StarLotteryOperateRsp;

        /**
         * 抽奖结果查询响应
         */
        m_stListRecordRsp: StarLotteryListRecordRsp;

        /**
         * 领取头奖
         */
        m_stTopPrizeRsp: StarLotteryGetTopPrizeRsp;

        /**
         * 选择头奖
         */
        m_stChooseTopPrizeRsp: StarLotteryChooseTopPrizeRsp;

        /**
         * 获取大奖配置
         */
        m_stTopPrizeCfgRsp: StarLotteryTopPrizeCfgRsp;

        /**
         * 分红报名
         */
        m_ucHongBaoEntry: number;

        /**
         * 分红历史记录
         */
        m_stHongBaoHistoryHistoryRsp: StarLotteryRankHistoryRsp;

        /**
         * 全服消费金额
         */
        m_uiServerCost: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLotteryPanel {
        /**
         * 下次免费时间
         */
        m_uiNexFreeTime: number;

        /**
         * 幸运值
         */
        m_uiLuck: number;

        /**
         * 全服总消费
         */
        m_uiServerCost: number;

        /**
         *  配置个数
         */
        m_ucCfgCount: number;

        /**
         * 奖励配置列表
         */
        m_stConfigList: Array<StarLotteryConfig_Server>;

        /**
         * 大奖物品 每个玩家不一样
         */
        m_stPrizeThingObj: ContainerThingObj;

        /**
         * 分红报名 前台用
         */
        m_ucHongBaoEntry: number;

        /**
         * 玩家消费
         */
        m_uiRoleCost: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLotteryConfig_Server {
        /**
         * 序号
         */
        m_ucId: number;

        /**
         * 物品ID
         */
        m_iItemId: number;

        /**
         * 物品数量
         */
        m_iItemNum: number;

        /**
         * 概率
         */
        m_iProb: number;

        /**
         * 保底次数
         */
        m_iBottom: number;

        /**
         * 是否广播
         */
        m_ucBroadcast: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLotteryOperateRsp {
        /**
         * 抽奖操作请求次数, 1,10
         */
        m_ucLotteryNum: number;

        /**
         * 抽奖结果
         */
        m_astThingInfo: Array<StarLotteryThingInfo>;

        /**
         * 下次免费时间
         */
        m_uiNexFreeTime: number;

        /**
         * 幸运值
         */
        m_uiLuck: number;

        /**
         * 全服总消费
         */
        m_uiServerCost: number;

        /**
         * 玩家消费
         */
        m_uiRoleCost: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLotteryThingInfo {
        /**
         * 物品id
         */
        m_iThingID: number;

        /**
         * 物品数量
         */
        m_iThingNumber: number;

        /**
         * 位置
         */
        m_ucPos: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLotteryListRecordRsp {
        /**
         * 查询类型, 全服抽奖记录（1）,玩家抽奖结果（2）
         */
        m_ucListType: number;

        /**
         * 抽奖查询结果，顺序排列，最多记录50条
         */
        m_astRecordList: Array<StarLotteryRecord>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLotteryRecord {
        /**
         * 中奖玩家昵称
         */
        m_szNickName: string;

        /**
         * 对应的物品id
         */
        m_aiThingID: number;

        /**
         * 对应的物品id数量
         */
        m_iThingNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLotteryGetTopPrizeRsp {
        /**
         * 大奖物品 每个玩家不一样
         */
        m_stPrizeThingObj: ContainerThingObj;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLotteryChooseTopPrizeRsp {
        /**
         * 大奖物品 每个玩家不一样
         */
        m_stPrizeThingObj: ContainerThingObj;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLotteryTopPrizeCfgRsp {
        /**
         *  配置个数
         */
        m_ucCfgCount: number;

        /**
         * 大奖配置列表
         */
        m_stConfigList: Array<StarLotteryTopPrizeConfig_Server>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLotteryTopPrizeConfig_Server {
        /**
         * 序号
         */
        m_ucId: number;

        /**
         * 物品ID
         */
        m_iItemId: number;

        /**
         * 物品数量
         */
        m_iItemNum: number;

        /**
         * 概率
         */
        m_iProb: number;

        /**
         * 是否是首次大奖
         */
        m_ucFirstReward: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLotteryRankHistoryRsp {
        /**
         * 个数
         */
        m_ucCount: number;

        /**
         * 分红历史记录
         */
        m_stRankHistoryList: Array<StarLotteryHistoryOne>;

        /**
         * 本期消费
         */
        m_uiCost: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class StarLotteryHistoryOne {
        /**
         * 获得的分红
         */
        m_iGetMoney: number;

        /**
         * 角色名
         */
        m_szNickName: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Survey_Request {
        /**
         * 问题数量
         */
        m_ucCount: number;

        /**
         * 答题列表
         */
        m_astAnswerList: Array<SurveyAnswer>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SurveyAnswer {
        /**
         * 题目ID
         */
        m_iID: number;

        /**
         * 答案数量
         */
        m_ucCount: number;

        /**
         * 选择答案选项
         */
        m_aiChooseID: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Survey_Response {
        /**
         * 占位
         */
        m_iResult: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SwapContainer_Request {
        /**
         * 源容器
         */
        m_stSrcContainerID: ContainerID;

        /**
         * 源物品列表
         */
        m_stSrcThingList: ContainerThingList;

        /**
         * 目标容器
         */
        m_stDstContainerID: ContainerID;

        /**
         * 目标容器位置
         */
        m_ucDstPosition: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SwapCrystal_Request {
        /**
         * 源位置
         */
        m_cSrcPos: number;

        /**
         * 源星魂容器类型
         */
        m_cSrcType: number;

        /**
         * 目标位置
         */
        m_cDstPos: number;

        /**
         * 目标槽位, 如果为0，则为移动操作
         */
        m_cDstType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SwapCrystal_Response {
        
        m_iResultID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SyncTime_Client_Request {
        /**
         * 客户端当前时间
         */
        m_uiClientTime_low: number;

        /**
         * 客户端当前时间
         */
        m_uiClientTime_high: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SyncTime_Request {
        /**
         * 发送人
         */
        m_stRoleID: RoleID;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SyncTime_Response {
        /**
         * 错误码
         */
        m_ushResultID: number;

        /**
         * 服务器当前时间
         */
        m_uiServerTime_low: number;

        /**
         * 服务器当前时间
         */
        m_uiServerTime_high: number;

        /**
         * 聊天验证码，预留
         */
        m_ucCheck: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SystemSetting_Notify {
        /**
         * 系统设置信息
         */
        m_stSystemSettingList: SystemSettingList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SystemSettingList {
        /**
         * 设置个数
         */
        m_ucNumber: number;

        m_ucValueList: Array<number>;

        /**
         * 设置个数
         */
        m_ucCacheNumber: number;

        m_ucCacheValueList: Array<number>;

        m_szCacheValue: string;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TabStatus_Change_Notify {
        /**
         * 返利大厅页签个数
         */
        m_ucCount: number;

        /**
         * 返利大厅页签状态列表
         */
        m_stIconList: Array<IconStatusOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class IconStatusOne {
        /**
         * 返利大厅页签个数
         */
        m_ucNum: number;

        /**
         * 返利大厅页签状态列表
         */
        m_stTabStatusList: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Title_ActiveChange_Request {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: TitleChangeRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TitleChangeRequestValue {
        /**
         * 设置玩家佩戴称号的请求
         */
        m_stSetTitleReq: SetTitleInfo;

        /**
         * 获取玩家已获得的称号列表 请求默认为0,不用填
         */
        m_ucGetTitleDataReq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SetTitleInfo {
        /**
         * 设置玩家佩戴称号ID,title id
         */
        m_usSetTitleID: number;

        /**
         * 设置穿戴类型，1穿上，0是卸下
         */
        m_usSetType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Title_ActiveChange_Response {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 结果码
         */
        m_usResult: number;

        /**
         * 协议体
         */
        m_stValue: TitleChangeResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TitleChangeResponseValue {
        /**
         * 设置玩家佩戴称号的响应
         */
        m_stSetTitleRsp: TitleChangeListValue;

        /**
         * 查询玩家的称号信息响应
         */
        m_stTitleListRsp: TitleChangeListValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TitleChangeListValue {
        /**
         * 玩家获得的固定称号信息
         */
        m_stFixTitleList: TitleFixInfoList;

        /**
         * 已佩戴称号
         */
        m_usShowTitleID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TitleFixInfoList {
        /**
         * 玩家固定称号的数量 
         */
        m_ucFixTitleNum: number;

        /**
         * 玩家获得的固定称号信息
         */
        m_astFixTitle: Array<TitleFixOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TitleFixOne {
        /**
         * 称号id
         */
        m_usID: number;

        /**
         * 是否显示称号，1不显示，0显示
         */
        m_ucShowFlag: number;

        /**
         * 称号到期时间, 0标识不会过期
         */
        m_uiTimeOut: number;

        /**
         * 已叠加次数
         */
        m_uiAddNum: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Transport_Request {
        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        m_iTransportPointID: number;

        /**
         * 因为任务引发的跳跃
         */
        m_iQuestID: number;

        /**
         * QUEST_JUMP_ACCEPT,QUEST_JUMP_FINISH宏
         */
        m_ucQuestType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Transport_Response {
        
        m_uiResultID: number;

        /**
         * 目的场景
         */
        m_uiSceneID: number;

        /**
         * 场景宽度
         */
        m_uiWidthPixels: number;

        /**
         * 场景高度
         */
        m_uiHeightPixels: number;

        /**
         * 目的副本
         */
        m_uiPinstanceID: number;

        /**
         * 目的方向
         */
        m_ucDirection: number;

        /**
         * 目的位置
         */
        m_stPosition: UnitPosition;

        /**
         * 目的副本所在层数
         */
        m_usPinstancePos: number;

        /**
         * 跳跃点个数
         */
        m_ucNum: number;

        /**
         * 跳跃点ID
         */
        m_aiID: Array<number>;

        /**
         * 给前台的透传字段，跳跃类型(TRANS_TYPE_宏)
         */
        m_ucExtraType: number;

        /**
         * 后台记录的玩家所在的场景索引
         */
        m_uiSceneIdx: number;

        /**
         * 后台记录的玩家所在的副本索引
         */
        m_uiPinstanceIdx: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class UnitAttributeChanged_Notify {
        /**
         * 属性变化
         */
        m_stUAC: UnitAttributeChanged;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class Unit_PlayAction_Notify {
        /**
         * 场景内单位编号
         */
        m_iUnitID: number;

        /**
         * 动作编号
         */
        m_iAction: number;

        /**
         * 方向
         */
        m_ucDirction: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class UpdateProgress_Notify {
        
        m_uiResultID: number;

        /**
         * 64位角色标识
         */
        m_stRoleID: RoleID;

        /**
         * 任务数量
         */
        m_ucQuestNumber: number;

        /**
         * 角色任务进度信息
         */
        m_stQuestProgress: Array<QuestProgress>;

        /**
         * 更新前台日常任务ID
         */
        m_uiDailyQuestID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class UpdateSystemSetting_Request {
        /**
         * 系统设置信息
         */
        m_stSystemSettingList: SystemSettingList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPOneKeyGet_Request {
        /**
         * 要完成的副本ID
         */
        m_iID: number;

        /**
         * 0完成所有，1完成1次
         */
        m_ucType: number;

        /**
         * 参数，镇妖塔用来确定是完成哪一阶
         */
        m_ucPara: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPOneKeyGet_Response {
        /**
         * 错误码 0 成功
         */
        m_iResult: number;

        /**
         * 一键完成的副本ID
         */
        m_iID: number;

        /**
         * 参数，镇妖塔用来确定是完成哪一阶
         */
        m_ucPara: number;

        /**
         * 副本剩余次数
         */
        m_ucTimes: number;

        /**
         * 可获得道具个数
         */
        m_ucItemCnt: number;

        /**
         * 可获得总道具信息
         */
        m_astItems: Array<OneItem_Info>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneItem_Info {
        /**
         * 道具ID
         */
        m_iID: number;

        /**
         * 道具个数
         */
        m_iNumber: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPOneKeyOpen_Request {
        /**
         * 要完成的副本ID
         */
        m_iID: number;

        /**
         * 参数，镇妖塔用来确定是完成哪一阶
         */
        m_ucPara: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPOneKeyOpen_Response {
        /**
         * 错误码 0 成功
         */
        m_iResult: number;

        /**
         * 要完成的副本ID
         */
        m_iID: number;

        /**
         * 参数，镇妖塔用来确定是完成哪一阶
         */
        m_ucPara: number;

        /**
         * 0完成所有，1完成1次
         */
        m_ucType: number;

        /**
         * 副本剩余次数
         */
        m_ucTimes: number;

        /**
         * 单次元宝消耗数
         */
        m_iCost: number;

        /**
         * 可获得总经验
         */
        m_iExp: number;

        /**
         * 可获得道具个数
         */
        m_ucItemCnt: number;

        /**
         * 可获得总道具信息
         */
        m_astItems: Array<OneItem_Info>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPOperate_Request {
        /**
         * VIP操作协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: VIPOperateReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPOperateReqValue {
        /**
         * vip查询协议，不用填，默认0
         */
        m_iListData: number;

        /**
         * vip玩家领取礼包的类型,1(每日礼包)
         */
        m_iGetGiftType: number;

        /**
         * vip玩家领取终生礼包, 领取的对应等级
         */
        m_ucGetVipLevel: number;

        /**
         * vip月卡查询协议，不用填，默认0
         */
        m_iListMonthData: number;

        /**
         * vip月卡购买协议，购买的等级
         */
        m_iMonthBuyLevel: number;

        /**
         * vip月卡领取礼包协议
         */
        m_stGetMonthGiftReq: VIPMonthGetGiftReq;

        /**
         * vip购买副本次数协议，副本id
         */
        m_iBuyPinstance: number;

        /**
         * 特殊特权购买，特权id 1-5
         */
        m_ucSpecialPriBuy: number;

        /**
         * 特殊特权查询，不用填，默认0
         */
        m_ucSpecialPriList: number;

        /**
         * VIP月卡活跃信息查询，不用填，默认0
         */
        m_iVPIPriHYListReq: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPMonthGetGiftReq {
        /**
         * 礼包类型，1、每日礼包；2、最高级终生礼包
         */
        m_iType: number;

        /**
         * 领取的等级
         */
        m_iLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPOperate_Response {
        /**
         * 响应结果
         */
        m_ushResultID: number;

        /**
         * VIP操作协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: VIPOperateRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPOperateRspValue {
        /**
         * vip查询协议响应
         */
        m_stListDataRsp: VIPOperateListRsp;

        /**
         * vip玩家领取礼包的响应
         */
        m_stGetGiftRsp: VIPOperateGetGiftRsp;

        /**
         * vip玩家领取终生礼包的响应
         */
        m_stGetLifeLongGiftRsp: VIPOperateGetLifeLongGiftRsp;

        /**
         * vip月卡查询协议响应
         */
        m_stMonthListDataRsp: VIPOperateMonthInfoRsp;

        /**
         * vip月卡购买协议响应
         */
        m_stMonthBuyRsp: VIPOperateMonthInfoRsp;

        /**
         * vip月卡领取礼包响应
         */
        m_stMonthGetGiftRsp: VIPOperateMonthInfoRsp;

        /**
         * vip购买副本响应
         */
        m_stBuyPinstanceRsp: VIPBuyPinstanceRsp;

        /**
         * 特殊特权购买响应
         */
        m_stSpecialPriBuyRsp: SpecialPriBuyRsp;

        /**
         * 特殊特权查询响应
         */
        m_stSpecialPriListRsp: SpecialPriListRsp;

        /**
         * VIP月卡活跃信息查询响应
         */
        m_stVPIPriHYDataList: VPIPriHYDataList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPOperateListRsp {
        /**
         * vip礼包领取标识，按位标识, 0未领取，1领取,位置0无数据
         */
        m_uiGetFlag: number;

        /**
         * vip的筋斗云已使用次数次数
         */
        m_ucFlightNum: number;

        /**
         * vip的喇叭已使用次数次数
         */
        m_ucSpeakerNum: number;

        /**
         * vip玩家当日已购买的副本次数
         */
        m_stReserveNum: Array<VipReserveTimes>;

        /**
         * Vip玩家领取终生礼包的标识，根据vip等级按位标识, 0未领取，1领取,位置0无数据
         */
        m_iGetLifeLongGiftFlag: number;

        /**
         * vip奖励的充值额度
         */
        m_uiRewardVal: number;

        /**
         * vip等级达成的状态, 按vip等级按位标识，0未达成，1已达成
         */
        m_uiVIPReached: number;

        /**
         * vip技能体验到期时间
         */
        m_uiVIPSkillTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VipReserveTimes {
        /**
         * 副本类型
         */
        m_iType: number;

        /**
         * vip玩家当日已购买的次数
         */
        m_iTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPOperateGetGiftRsp {
        /**
         * vip玩家领取礼包的类型,1(每日礼包)
         */
        m_iGetGiftType: number;

        /**
         * vip玩家领取礼包的状态,按位标识，0已领取，1未领取。位置0无数据
         */
        m_iGetGiftFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPOperateGetLifeLongGiftRsp {
        /**
         * vip玩家领取礼包对应的vip等级
         */
        m_ucLevel: number;

        /**
         * Vip玩家领取终生礼包的标识，根据vip等级按位标识, 0未领取，1领取,位置0无数据
         */
        m_iFlag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPOperateMonthInfoRsp {
        /**
         * vip月卡等级
         */
        m_iLevel: number;

        /**
         * vip月卡每日礼包，根据月卡等级按位标识，0未领取，1领取
         */
        m_iGetFlag: number;

        /**
         * vip月卡终生礼包，根据月卡等级按位标识，0未领取，1领取
         */
        m_iGetLifeLongFlag: number;

        /**
         * vip月卡过期时间
         */
        m_auiTimeOut: Array<number>;

        /**
         * vip月卡等级达成标识，按月卡等级按位标识，0未达成，1已达成
         */
        m_uiHavelevelFlag: number;

        /**
         * vip月卡经验进度
         */
        m_auiExp: Array<number>;

        /**
         * vip技能体验到期时间
         */
        m_uiVIPSkillTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VIPBuyPinstanceRsp {
        /**
         * 副本类型
         */
        m_iType: number;

        /**
         * 当日已购买的副本次数
         */
        m_iTimes: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SpecialPriBuyRsp {
        /**
         * 特权类型，1-5
         */
        m_ucId: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SpecialPriListRsp {
        /**
         * 特权激活状态, 根据特权id按位存，0未激活，1已激活
         */
        m_uiStatus: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VPIPriHYDataList {
        
        m_ucNum: number;

        /**
         * 一个特权的活跃数据
         */
        m_stData: Array<VPIPriHYData>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class VPIPriHYData {
        
        m_usNum: number;

        /**
         * 活跃信息记录，下标为索引，对应策划表中的id
         */
        m_stPriInfo: Array<OneVIPPriHYInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class OneVIPPriHYInfo {
        /**
         * 进度数，0xfffffff表示这个活跃度已经拿满，显示为已完成即可
         */
        m_uiNum: number;

        /**
         * 唯一索引
         */
        m_ucID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYBQ_Get_Request {
        /**
         * 占位
         */
        m_ucChar: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYBQ_Get_Response {
        /**
         * 结果码
         */
        m_iResultID: number;

        /**
         * 数组个数
         */
        m_iNumber: number;

        /**
         * 百分比信息
         */
        m_stTypeValue: Array<WYBQOneTypeValue>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYBQOneTypeValue {
        /**
         * ID，见关键字GROUP_STRONG_TYPE
         */
        m_iID: number;

        /**
         * 百分比值
         */
        m_iValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYTreasureHunt_Request {
        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: WYTreasureHuntReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYTreasureHuntReqValue {
        /**
         * 打开面板,占位
         */
        m_ucTag: number;

        /**
         * 开始寻宝
         */
        m_stTreasureHuntStart: TreasureHuntInfo;

        /**
         * 结束寻宝
         */
        m_stTreasureHuntEnd: TreasureHuntInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TreasureHuntInfo {
        /**
         * 寻宝武缘ID
         */
        m_iBeautyID: number;

        /**
         * 左边协助寻宝武缘ID
         */
        m_iLeftBeautyID: number;

        /**
         * 右边协助寻宝武缘ID
         */
        m_iRightBeautyID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYTreasureHunt_Response {
        /**
         * 错误码
         */
        m_iResult: number;

        /**
         * 协议类型
         */
        m_usType: number;

        /**
         * 协议体
         */
        m_stValue: WYTreasureHuntRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYTreasureHuntRspValue {
        /**
         * 面板回复
         */
        m_stPannelInfo: TreasureHuntPanelInfo;

        /**
         * 开始寻宝
         */
        m_stStartInfo: TreasureHuntPanelInfo;

        /**
         * 结束寻宝
         */
        m_stEndInfo: TreasureHuntPanelInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class TreasureHuntPanelInfo {
        /**
         * 寻宝武缘ID
         */
        m_iBeautyID: number;

        /**
         * 条件ID
         */
        m_iConditionID: number;

        /**
         * 左边协助寻宝武缘ID
         */
        m_iLeftBeautyID: number;

        /**
         * 右边协助寻宝武缘ID
         */
        m_iRightBeautyID: number;

        /**
         * 剩余寻宝时间
         */
        m_uiLeftTime: number;

        /**
         * 剩余寻宝次数
         */
        m_ucLeftCount: number;

        /**
         * 获得物品数量
         */
        m_ucCount: number;

        /**
         * 获得物品
         */
        m_stThingList: Array<ContainerThing>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYYZ_BuyBuff_Request {
        /**
         * 0 1 2 第几个Buff
         */
        m_iBit: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYYZ_BuyBuff_Response {
        /**
         * 结果码
         */
        m_uiResult: number;

        /**
         * 是否购买BuffBit 0Bit 1Bit 2Bit
         */
        m_iBuffBit: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYYZ_FightSet_Request {
        /**
         * 己方武缘信息
         */
        m_stSelfFightList: CSWYYZFightPetList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSWYYZFightPetList {
        /**
         * 定长数组
         */
        m_aiPetID: Array<number>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYYZ_FightSet_Response {
        /**
         * 结果码
         */
        m_uiResult: number;

        /**
         * 己方武缘信息
         */
        m_stSelfFightList: CSWYYZFightPetList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYYZ_GetReward_Request {
        /**
         * 关卡ID
         */
        m_ucLevel: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYYZ_GetReward_Response {
        /**
         * 结果码
         */
        m_uiResult: number;

        /**
         * 关卡ID
         */
        m_ucLevel: number;

        /**
         * 通关奖励用Bit存储 1左移(关卡-1)
         */
        m_iTGRewardBit: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYYZ_PK_Request {
        /**
         * 占位
         */
        m_ucTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYYZ_PK_Response {
        /**
         * 结果码
         */
        m_uiResult: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYYZ_Pannel_Request {
        /**
         * 占位
         */
        m_ucTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYYZ_Pannel_Response {
        /**
         * 结果码
         */
        m_uiResult: number;

        /**
         * 下次刷新时间戳
         */
        m_uiFreshTime: number;

        /**
         * 通关层数
         */
        m_iTGLevel: number;

        /**
         * 玩家排名
         */
        m_iRank: number;

        /**
         * 通关奖励用Bit存储 1左移(关卡-1)
         */
        m_iTGRewardBit: number;

        /**
         * 是否购买BuffBit 0Bit 1Bit 2Bit
         */
        m_iBuffBit: number;

        /**
         * 出战武缘数组
         */
        m_stFightPetList: CSWYYZFightPetList;

        /**
         * 己方武缘信息
         */
        m_stSelfPetList: CSWYYZSelfPetList;

        /**
         * 关卡列表
         */
        m_stLevelList: CSWYYZLevelList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSWYYZSelfPetList {
        /**
         * 己方武缘个数
         */
        m_iCount: number;

        /**
         * 列表
         */
        m_stList: Array<CSWYYZSelfPetOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSWYYZSelfPetOne {
        /**
         * 武缘ID
         */
        m_iPetID: number;

        /**
         * 剩余血量万分比
         */
        m_iPercent: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSWYYZLevelList {
        /**
         * 关卡个数
         */
        m_iCount: number;

        /**
         * 列表
         */
        m_stList: Array<CSWYYZLevelOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSWYYZLevelOne {
        /**
         * 玩家ID
         */
        m_stRoleID: RoleID;

        /**
         * 玩家基本信息
         */
        m_stBasePro: BaseProfile;

        /**
         * 玩家排名
         */
        m_iRank: number;

        /**
         * 关卡武缘信息
         */
        m_stPetList: CSWYYZLevelPetList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSWYYZLevelPetList {
        /**
         * 武缘个数
         */
        m_iCount: number;

        /**
         * 列表
         */
        m_stList: Array<CSWYYZLevelPetOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSWYYZLevelPetOne {
        /**
         * 武缘ID
         */
        m_iPetID: number;

        /**
         * 飞升次数
         */
        m_iFSCnt: number;

        /**
         * 战力
         */
        m_iFight: number;

        /**
         * 剩余血量万分比
         */
        m_iPercent: number;

        /**
         * 武缘等级
         */
        m_iPetLV: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYYZ_Skill_Request {
        /**
         * 武缘ID
         */
        m_iPetID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WYYZ_Skill_Response {
        /**
         * 结果码
         */
        m_uiResult: number;

        /**
         * 武缘ID CD释放成功了前端重置
         */
        m_iPetID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WorldPaiMai_Buy_Request {
        /**
         * 拍卖道具的流水ID
         */
        m_iItemFlowID: number;

        /**
         * 出价
         */
        m_uiPrice: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WorldPaiMai_Buy_Response {
        /**
         * 返回结果：0成功，其他失败
         */
        m_iResult: number;

        /**
         * 拍卖道具的流水ID
         */
        m_iItemFlowID: number;

        /**
         * 出价
         */
        m_uiPrice: number;

        /**
         * 拍卖的物品
         */
        m_stItemInfo: WorldPaiMaiItem;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WorldPaiMaiItem {
        /**
         * 流水ID 每个拍卖道具唯一
         */
        m_iItemFlowID: number;

        /**
         * 活动ID
         */
        m_iActID: number;

        /**
         * 活动流水ID
         */
        m_iActFlowID: number;

        /**
         * 生成时间
         */
        m_uiTime: number;

        /**
         * 结束时间
         */
        m_uiEndTime: number;

        /**
         * 物品ID
         */
        m_iItemID: number;

        /**
         * 物品个数
         */
        m_iItemCount: number;

        /**
         * 一口价
         */
        m_iMaxPrice: number;

        /**
         * 当前价
         */
        m_iCurPrice: number;

        /**
         * 出价玩家
         */
        m_stRoleID: RoleID;

        /**
         * 物品状态Bit
         */
        m_ucStatusBit: number;

        /**
         * 出价次数 用来计算均价 日志用
         */
        m_ucPriceCount: number;

        /**
         * 出价总价格 用来计算均价 日志用
         */
        m_uiTotalPrice: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WorldPaiMai_NewAct_Notify {
        /**
         * 正在进行的活动数
         */
        m_iActCount: number;

        /**
         * 已结束活动
         */
        m_stActLogList: Array<SimWorldPaiMaiAct>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class SimWorldPaiMaiAct {
        /**
         * 活动ID
         */
        m_iActID: number;

        /**
         * 活动流水ID
         */
        m_iActFlowID: number;

        /**
         * 生成时间
         */
        m_uiTime: number;

        /**
         * 结束时间
         */
        m_uiEndTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WorldPaiMai_Pannel_Request {
        /**
         * 活动ID
         */
        m_iActID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WorldPaiMai_Pannel_Response {
        /**
         * 返回结果：0成功，其他失败
         */
        m_iResult: number;

        /**
         * 活动ID
         */
        m_iActID: number;

        /**
         * 生成时间
         */
        m_uiTime: number;

        /**
         * 结束时间
         */
        m_uiEndTime: number;

        /**
         * 上次活动日志
         */
        m_stActLog: WorldPaiMaiAct;

        /**
         * 可拍卖道具数量
         */
        m_iItemCount: number;

        /**
         * 拍卖的物品
         */
        m_stItemList: Array<WorldPaiMaiItem>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WorldPaiMaiAct {
        /**
         * 活动ID
         */
        m_iActID: number;

        /**
         * 活动流水ID
         */
        m_iActFlowID: number;

        /**
         * 扩展ID
         */
        m_iExpendID: number;

        /**
         * 生成时间
         */
        m_uiTime: number;

        /**
         * 结束时间
         */
        m_uiEndTime: number;

        /**
         * 总共可分成元宝
         */
        m_iAllMoney: number;

        /**
         * 分成比例分母
         */
        m_iAllPercent: number;

        /**
         * 参与分成玩家数
         */
        m_iRoleCount: number;

        /**
         * 拍卖的物品
         */
        m_stRoleList: Array<WorldPaiMaiRole>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class WorldPaiMaiRole {
        /**
         * 活动ID
         */
        m_stRoleID: RoleID;

        m_szNickName: string;

        /**
         * 分成比例
         */
        m_iGetPercent: number;

        /**
         * 分成元宝
         */
        m_iGetMoney: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XZFM_Request {
        /**
         * 类型
         */
        m_ucType: number;

        /**
         * CS请求体
         */
        m_stValue: XZFMReqValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XZFMReqValue {
        /**
         * 血战封魔 占位
         */
        m_ucPanel: number;

        /**
         * 血战封魔领取个人奖励
         */
        m_ucRewardID: number;

        /**
         * 血战封魔排行榜
         */
        m_ucRank: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XZFM_Response {
        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 类型
         */
        m_ucType: number;

        /**
         * CS响应体
         */
        m_stValue: XZFMRspValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XZFMRspValue {
        /**
         * 血战封魔 面板
         */
        m_stPanel: XZFMPanel;

        /**
         * 血战封魔领取个人奖励 回复
         */
        m_stRewardRsp: XZFMPanel;

        /**
         * 血战封魔排行榜 回复
         */
        m_stRankRsp: XZFMRankRsp;

        /**
         * 血战封魔 Boss列表
         */
        m_stBossList: XZFMBossList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XZFMPanel {
        /**
         * 全服积分
         */
        m_uiScore: number;

        /**
         * 奖励个数
         */
        m_ucRewardCount: number;

        m_stRewardStatus: Array<number>;

        /**
         * 完成任务数量
         */
        m_uiFinishTaskNum: number;

        /**
         * 血战封魔 Boss列表
         */
        m_stBossList: XZFMBossList;

        /**
         * Boss奖励个数
         */
        m_ucBossRewardCnt: number;

        /**
         * Boss奖励列表
         */
        m_stBossRewardList: Array<CSXZFMBossReward>;

        /**
         * 限时任务数据
         */
        m_stLimitTimeTask: Array<LimitTimeTask>;

        /**
         * 奖励次数
         */
        m_ucPrizeCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XZFMBossList {
        /**
         * BOSS个数
         */
        m_ucBossCount: number;

        m_stBossList: Array<XZFM_BOSS>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XZFM_BOSS {
        /**
         * BossID
         */
        m_iBossID: number;

        /**
         * 状态 0 死亡 1存活
         */
        m_ucStatus: number;

        /**
         * 刷新时间  状态存活时不用管
         */
        m_uiRefreshTime: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSXZFMBossReward {
        /**
         * BossID
         */
        m_iBossID: number;

        /**
         * 奖励次数
         */
        m_iCount: number;

        /**
         * 领取宝箱个数
         */
        m_iBXCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class LimitTimeTask {
        /**
         * 任务下次刷新时间
         */
        m_uiNextRefreshTime: number;

        /**
         * 任务ID
         */
        m_iQuestID: number;

        /**
         * 任务进度
         */
        m_iValue: number;

        /**
         * 当前全服完成总个数
         */
        m_iCompleteNum: number;

        /**
         * 每日任务剩余次数
         */
        m_iLeftTaskCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XZFMRankRsp {
        /**
         * 个人积分
         */
        m_uiMyScore: number;

        /**
         * 我的排名
         */
        m_uiMyRank: number;

        /**
         * 排行个数
         */
        m_ucRankCount: number;

        m_stRankList: Array<XZFM_RankOne>;

        /**
         * 上周前三
         */
        m_ucPreRankCount: number;

        m_stPreRankList: Array<XZFM_RankOne>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class XZFM_RankOne {
        /**
         * 积分
         */
        m_uiScore: number;

        /**
         * 击杀boss数量
         */
        m_uiKillBossNum: number;

        /**
         * 玩家信息
         */
        m_stRoleInfo: RoleInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZFEquipUpColor_Request {
        /**
         * 待升阶装备容器
         */
        m_stContainerID: ContainerID;

        /**
         * 待升阶装备物品
         */
        m_stContainerThing: ContainerThing;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZFEquipUpColor_Response {
        /**
         * 响应结果
         */
        m_ushResultID: number;

        /**
         * 升阶装备容器
         */
        m_stContainerID: ContainerID;

        /**
         * 升阶后装备物品
         */
        m_stContainerThing: ContainerThing;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZYZHPannel_Request {
        /**
         * 占位
         */
        m_ucTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZYZHPannel_Response {
        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 法宝数据
         */
        m_stZYZHList: CSZYZHList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSZYZHList {
        /**
         * 数组个数
         */
        m_ucNumber: number;

        m_astZYZHOneInfo: Array<CSZYZHOneInfo>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSZYZHOneInfo {
        /**
         * 等级
         */
        m_iID: number;

        /**
         * 天数
         */
        m_ucDayCount: number;

        /**
         * 需要元宝
         */
        m_uiNeedMoney: number;

        /**
         * 需要绑定元宝
         */
        m_uiNeedBindMoney: number;

        /**
         * 物品数量
         */
        m_ucCount: number;

        /**
         * 奖励列表
         */
        m_astThingList: Array<CSZYZHOneThing>;

        /**
         * 是否免费找回按钮灰色,1是，0否
         */
        m_bFreeRetrieve: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSZYZHOneThing {
        /**
         * 奖励物品ID
         */
        m_uiThingID: number;

        /**
         * 奖励物品个数
         */
        m_uiThingCount: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZYZHReward_Request {
        /**
         * 资源ID
         */
        m_iID: number;

        /**
         * 是否元宝找回 0 免费找回 1 钻石找回 2 绑钻找回
         */
        m_bYuanBao: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZYZHReward_Response {
        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 资源ID
         */
        m_iID: number;

        /**
         * 是否元宝找回
         */
        m_bYuanBao: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZZHC_Pannel_Request {
        /**
         * 占位
         */
        m_ucTag: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZZHC_Pannel_Response {
        /**
         * 结果码
         */
        m_uiResult: number;

        /**
         * 面板
         */
        m_stPannel: CSZZHCPannelInfo;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSZZHCPannelInfo {
        /**
         * 城市占领数据
         */
        m_stCityData: CSZZHCCityData;

        /**
         * 积分
         */
        m_iScore: number;

        /**
         * 10分奖励是否领取
         */
        m_b1stReward: number;

        /**
         * 20分奖励是否领取
         */
        m_b2ndReward: number;

        /**
         * 40分奖励是否领取
         */
        m_b3rdReward: number;

        /**
         * 是否宗主推荐
         */
        m_bRecommondGrade: number;

        /**
         * 宗主推荐城池
         */
        m_iRecommondCityID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSZZHCCityData {
        /**
         * 城市个数
         */
        m_uiCount: number;

        /**
         * 城市
         */
        m_stRankList: Array<CSZZHCCityOneData>;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSZZHCCityOneData {
        /**
         * 所属宗派ID
         */
        m_uiGuildID: number;

        /**
         * 宗派Boss等级
         */
        m_usBossLevel: number;

        /**
         * 所属宗派名字
         */
        m_szName: string;

        /**
         * 城市名字
         */
        m_szCityName: string;

        /**
         * 宗派宗主 城主
         */
        m_stLeaderRole: CSZZHCCityOneRole;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class CSZZHCCityOneRole {
        /**
         * 角色ID
         */
        m_stRoleID: RoleID;

        /**
         * 角色基础信息
         */
        m_stBaseProfile: BaseProfile;

        /**
         * avatar列表
         */
        m_stAvatarList: AvatarList;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZZHC_Recommond_Request {
        /**
         * 城市ID
         */
        m_iCityID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZZHC_Recommond_Response {
        /**
         * 结果码
         */
        m_uiResult: number;

        /**
         * 是否宗主推荐
         */
        m_bRecommondGrade: number;

        /**
         * 宗主推荐城池
         */
        m_iRecommondCityID: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZZHC_Reward_Request {
        /**
         * 奖励类型
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZZHC_Reward_Response {
        /**
         * 结果码
         */
        m_uiResult: number;

        /**
         * 奖励类型
         */
        m_ucType: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZazenRequest {
        /**
         * 类型
         */
        m_ucType: number;

        /**
         * SS请求体
         */
        m_stValue: ZazenRequestValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZazenRequestValue {
        /**
         * 开始打坐--前台发起--占位
         */
        m_ucStartZazen: number;

        /**
         * 离线时间查询 占位
         */
        m_ucOfflineQuery: number;

        /**
         * 离线经验领取 占位
         */
        m_ucOfflineReward: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZazenResponse {
        /**
         * 响应结果
         */
        m_iResultID: number;

        /**
         * 类型
         */
        m_ucType: number;

        /**
         * SS响应体
         */
        m_stValue: ZazenResponseValue;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZazenResponseValue {
        /**
         * 打坐请求 占位
         */
        m_ucStartZazen: number;

        /**
         * 结束打坐 占位
         */
        m_ucEndZazen: number;

        /**
         * 离线时间查询 可领取经验
         */
        m_uiOfflineQuery: number;

        /**
         * 离线经验领取 领取到的经验
         */
        m_uiOfflineReward: number;

        /**
         * 经验通知
         */
        m_uiNotifyExpValue: number;
        
    }
    /**
     * 协议数据结构(defined in null.xml)
     * @author TsClassMaker
     * @exports
     */
    export class ZeroRefreshData_Notify {
        /**
         * 任务类型
         */
        m_stZeroRefreshData: ZeroRefreshDataInfo;
        
    }
    
}
