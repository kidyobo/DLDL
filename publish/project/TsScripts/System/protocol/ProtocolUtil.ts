import { EnumStoreID } from 'System/constants/GameEnum';
import { ChannelData } from "System/chat/ChannelData";
import { ChannelMsgData } from "System/chat/ChannelMsgData";
import { ThingItemData } from "System/data/thing/ThingItemData";
import { Global as G, Global } from "System/global";
import { ErrorId } from "System/protocol/ErrorId";
import { Macros } from "System/protocol/Macros";
import { SendMsgUtil } from "System/protocol/SendMsgUtil";
import { SkillReqParam } from "System/skill/SkillReqParam";
import { UnitController } from "System/unit/UnitController";
import { StringUtil } from "System/utils/StringUtil";
import { Compatible } from '../Compatible';
import { SafeJson } from '../utils/SafeJson';

/**
 * 协议填充工具类。
 */
export class ProtocolUtil {

    static FakeSkillDeltaRandoms: number[];
    static LastFakeSkillTargetUnitId = 1;

    static getListRole(worldID: number, uin: number, platformType: number, client: number, isAdult: number, platTime: number, serverID: number, username: string, platSignStr: string, szChannelID: string, token: number = 0, session: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getListRole_Account_Request();
        msg.m_stMsgHead.m_uiUin = uin;
        let request: Protocol.ListRole_Account_Request = msg.m_msgBody;
        request.m_shWorldID = worldID;
        request.m_uiUin = uin;
        request.m_stLianYunPlatInfo.m_uiTokenID = token;
        request.m_stLianYunPlatInfo.m_uiSessionID = session;
        ProtocolUtil.makePlatKeyInfo(request.m_stLianYunPlatInfo, platformType, client, isAdult, platTime, serverID, username, platSignStr, szChannelID);
        return msg;
    }


    static getCreateRole(worldID: number, uin: number, profession: number, gender: number, nickName: string, country: number, platformType: number, client: number, isAdult: number, platTime: number, serverID: number, userName: string, platSighStr: string, szChannelID: string, deviceId: string): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCreateRole_Account_Request();
        msg.m_stMsgHead.m_uiUin = uin;
        let request: Protocol.CreateRole_Account_Request = msg.m_msgBody;
        request.m_uiUin = uin;
        request.m_shWorldID = worldID;
        request.m_cProfession = profession;
        request.m_cGender = gender;
        request.m_szNickName = nickName;
        request.m_cCountry = country;
        request.m_szDeviceUID = deviceId;
        request.m_stInviteRoleID = { m_uiUin: 0, m_uiSeq: 0 };
        this.makeDeviceInfo(request.m_stDeviceInfo);
        this.makePlatKeyInfo(request.m_stLianYunPlatInfo, platformType, client, isAdult, platTime, serverID, userName, platSighStr, szChannelID);
        return msg;
    }

    static makePlatKeyInfo(platKeyInfo: Protocol.LianYunPlatKeyInfo, platformType: number, client: number, isAdult: number, platTime: number, serverID: number, username: string, platSignStr: string, szChannelID: string): void {
        platKeyInfo.m_usType = platformType;
        platKeyInfo.m_iClient = client;
        platKeyInfo.m_iIsAdult = isAdult;
        platKeyInfo.m_iPlatTime = platTime;
        platKeyInfo.m_iServerID = serverID;
        platKeyInfo.m_szPlatNameStr = username;
        platKeyInfo.m_ucPlatSignStr = platSignStr;
        platKeyInfo.m_szChannelID = szChannelID;
    }

    static getLogin(reason: number, enterType: number, para1: number, para2: number, para3: number, platformType: number, client: number, isAdult: number, platTime: number, serverID: number, username: string, platSignStr: string, szChannelID: string, deviceId: string): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getLoginServer_Request();
        let request: Protocol.LoginServer_Request = msg.m_msgBody;
        request.m_stRoleID = G.DataMgr.gameParas.roleID;
        ProtocolUtil.makePlatKeyInfo(request.m_stLianYunPlatInfo, platformType, client, isAdult, platTime, serverID, username, platSignStr, szChannelID);
        request.m_stEnterType.m_cEnterType = enterType;
        request.m_stEnterType.m_iPara1 = para1;
        request.m_stEnterType.m_iPara2 = para2;
        request.m_stEnterType.m_iPara3 = para3;
        request.m_ucReason = reason;
        request.m_ucClientType = client;
        request.m_szDeviceUID = deviceId;
        this.makeDeviceInfo(request.m_stDeviceInfo);
        return msg;
    }

    private static makeDeviceInfo(deviceInfo: Protocol.DeviceInfo) {
        let info = Compatible.getDeviceInfo();
        deviceInfo.m_szStrAndroid = info.id;
        deviceInfo.m_szStrDeviceBrand = info.brand;
        deviceInfo.m_szStrDeviceType = info.device;
        deviceInfo.m_szStrIdfa = info.idfa;
        deviceInfo.m_szStrIemi = info.imei;
        deviceInfo.m_szStrMac = info.mac;
        deviceInfo.m_iIsAndriod = Global.IsAndroidPlatForm ? 1 : 0;
        deviceInfo.m_szClientVersion = UnityEngine.Application.version;
        uts.log('deviceInfo:' + SafeJson.stringify(deviceInfo));
    }

    /**
     * 登出请求。
     * @param reason
     * @return
     *
     */
    static getLogout(toServer: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getLogoutServer_Request();
        let request: Protocol.LogoutServer_Request = msg.m_msgBody as Protocol.LogoutServer_Request;

        request.m_stRoleID = G.DataMgr.gameParas.roleID;
        request.m_ucReason = 0;
        request.m_usCrossSvrId = toServer;

        return msg;
    }

    /**
	*发送同步时间请求
	* @param roleID
	* @return
	*
	*/
    static getSyncTimeRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getSyncTime_Request();

        //发送同步时间请求
        let request: Protocol.SyncTime_Request = msg.m_msgBody as Protocol.SyncTime_Request;

        if (null != G.DataMgr.gameParas.roleID) {
            // Socket建立连接后会定时发送心跳包，此时未登录没有RoleID
            request.m_stRoleID = G.DataMgr.gameParas.roleID;
        }

        return msg;
    }

    /**
     * 发送客户端响应服务器，用于计算
     * @param roleID
     * @param serverTimeLow
     * @param serverTimeHigh
     * @return
     *
     */
    static getSecondClientSyncTimeRequest(low: number, high: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getSyncTime_Client_Request();

        let request: Protocol.SyncTime_Client_Request = msg.m_msgBody as Protocol.SyncTime_Client_Request;

        request.m_uiClientTime_low = low;
        request.m_uiClientTime_high = high;

        return msg;
    }

    static getOperateContainerMsg(opType: number, idType: number, thingID: number = 0, thingPosition: number = 0, thingCount: number = 0, targetUnitID: number = -1): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getOperateContainer_Request();
        let request: Protocol.OperateContainer_Request = msg.m_msgBody as Protocol.OperateContainer_Request;

        request.m_iTargetUnitID = targetUnitID;
        request.m_ucOperate = opType;
        request.m_stContainerID.m_ucContainerType = idType;
        request.m_stContainerID.m_stOwnerID = uts.deepcopy(G.DataMgr.heroData.roleID, request.m_stContainerID.m_stOwnerID);
        ProtocolUtil.setContainerThing(request.m_stContainerThing, thingID, thingPosition, thingCount);

        return msg;
    }

    private static setContainerThing(containerThing: Protocol.ContainerThing, thingID: number, thingPosition: number, thingCount: number): void {
        containerThing.m_iThingID = thingID;
        containerThing.m_usPosition = thingPosition;
        containerThing.m_iNumber = thingCount;
    }

    /**
	* 拉取祝福系统的信息
	*/
    static getListZhufInfoRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getHeroSub_List_Request();
        return msg;
    }

    /**
     * 宗门捐献的协议。
     * @param copperNum
     * @param goldNum
     * @return
     *
     */
    static getGuildContriutionRequest(type: number, num: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_DONATE_MONEY;
        request.m_stValue.m_stDonateRequest.m_ucType = type;
        request.m_stValue.m_stDonateRequest.m_uiCount = num;

        return msg;
    }

    /**
	* 拉取成员所在宗门的概要信息
	* @param roleId 角色Id 协议信息
	*
	*/
    static fetchGuildAbstract(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();
        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_GET_GUILD_ABSTRACT_INFO;

        return msg;
    }

    /**
	* 获取设置宗门职位请求信息
	* @param operatorId - 设置者
	* @param gradeId - 职位Id
	* @return
	*
	*/
    static getGuildGradeSetRequest(targetID: Protocol.RoleID, gradeId: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_SET_POSITION;
        request.m_stValue.m_stUpdateGradeRequest.m_stTargetRoleID = targetID;
        request.m_stValue.m_stUpdateGradeRequest.m_ushGuildGrade = gradeId;

        return msg;
    }

    /**
     * 获取宗门踢人请求
     * @param operatorId - 操作者
     * @param memberId - 被踢成员
     * @return
     *
     */
    static getKickGuildMemberRequest(memberId: Protocol.RoleID): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_DROP_OUT;
        request.m_stValue.m_stKickRoleID = memberId;

        return msg;
    }

    /**
     * 拉取仓库物品列表
     * @param type
     * @param num
     * @return
     *
     */
    static getGuildStoreRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_STORE_LIST;

        return msg;
    }

    /**
     * 退出宗门请求
     * @param roleId - 拉取者
     *
     */
    static getGuildQuitRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_QUIT_GUILD;

        return msg;
    }

    /**
     *宗门解散请求
     *
     */
    static getGuildDisbandRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_DISMISS_GUILD;

        return msg;
    }

    /**仓库取出*/
    static getGuildStoreTakeOutRequest(thingArr: Protocol.ContainerThing[], targetID: Protocol.RoleID): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_STORE_TAKEOUT;
        request.m_stValue.m_stStoreTakeOutReq.m_stItem = thingArr;
        request.m_stValue.m_stStoreTakeOutReq.m_ucItemCnt = thingArr.length;
        request.m_stValue.m_stStoreTakeOutReq.m_stTargetID = targetID;
        return msg;
    }

    /**仓库摧毁物品*/
    static getGuildStoreDeleteRequest(thing: Protocol.ContainerThing[]): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_STORE_DELETE;
        request.m_stValue.m_stStoreDelReq.m_stItemList = thing;
        request.m_stValue.m_stStoreDelReq.m_ucItemCnt = thing.length;
        return msg;
    }

    /**拉取仓库日志列表*/
    static getGuildStoreGetRecordListRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_STORE_LOG_LIST;

        return msg;
    }

    /**
     * 仓库设置捐献阶数
     * @param roleID
     * @return
     *
     */
    static getGuildStoreSetLimitstage(hunguDropLevel: number, hunguColor: number, equipDropLevel: number, equipColor: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();
        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_STORE_SET_LIMITSTAGE;
        request.m_stValue.m_stStoreLimit.m_ucHunGuDropLevel = hunguDropLevel;
        request.m_stValue.m_stStoreLimit.m_ucHunGuColor = hunguColor;
        request.m_stValue.m_stStoreLimit.m_ucEquipDropLevel = equipDropLevel;
        request.m_stValue.m_stStoreLimit.m_ucEquipColor = equipColor;
        return msg;
    }

    /**仓库存入*/
    static getGuildStoreIntoRequest(donateVec: Protocol.ContainerThing[]): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_STORE_INTO;
        request.m_stValue.m_stStoreIntoReq.m_stItem = donateVec;
        if (donateVec) {
            request.m_stValue.m_stStoreIntoReq.m_ucItemNums = donateVec.length;
        }

        return msg;
    }

    /**仓库整理*/
    static getGuildStoreSortRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_STORE_SORT;

        return msg;
    }

    /**
     * 获取创建宗门请求信息
     * @param roleId - 人物id
     * @param guildName - 宗门名称
     * @param guildDescription - 宗门描述
     * @return 协议信息
     *
     */
    static getGuildCreateRequest(guildName: string, guildNotice: string): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_CREATE_GUILD;
        request.m_stValue.m_stCreteGuild.m_szGuildName = guildName;
        request.m_stValue.m_stCreteGuild.m_szNitce = guildNotice;

        return msg;
    }

    static getGuildSetInfoRequest(declaretion: string): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_SET_INFO;
        request.m_stValue.m_stUpdateTextRequest.m_szNitce = declaretion;

        return msg;
    }

    static getGuildJoinSetRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();
        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_SET_AUTO_JOIN;
        request.m_stValue.m_ucAutoJoin = type;
        return msg;
    }

    /**
     * 处理加入宗门申请
     * @param roleId - 批注人Id
     * @param operation - 1 同意，0 拒绝
     * @param applicantList - 申请者列表
     * @return
     *
     */
    static getGuildApproveApplicantList(operation: number, applicantList: Protocol.GuildApplicantInfo[]): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_CHECK_JOIN;
        request.m_stValue.m_stApproveRequest.m_cOperation = operation;
        request.m_stValue.m_stApproveRequest.m_stApplicantList.m_astApplicantInfo = applicantList;
        if (applicantList) {
            request.m_stValue.m_stApproveRequest.m_stApplicantList.m_ushNumber = applicantList.length;
        }

        return msg;
    }

    /**
     * 每日宝箱领取
     * @return
     *
     */
    static getGuildDayBxRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();
        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_GET_DAY_GIFT;

        return msg;
    }

    /**
     * 拉取成员所在宗门的成员信息
     * @param roleId - 角色Id
     * @return 协议信息
     *
     */
    static fetchGuildMembers(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_GET_GUILD_MEMBER_LIST_INFO;

        return msg;
    }

    /**
     * 拉取宗门列表
     * @param roleId - 玩家信息
     * @param guildName - 宗门名称
     * @return 协议信息
     *
     */
    static getGuildQueryRequest(type: number, param: number = 0, id: number = 0, price: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();
        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = type;
        request.m_stValue.m_ucMoneyRankGet = param;

        request.m_stValue.m_stPaiMaiBuyGuild.m_uiGuildID = param;
        request.m_stValue.m_stPaiMaiBuyGuild.m_uiID = id;
        request.m_stValue.m_stPaiMaiBuyGuild.m_uiPrice = price;

        request.m_stValue.m_stPaiMaiBuyWorld.m_uiGuildID = param;
        request.m_stValue.m_stPaiMaiBuyWorld.m_uiID = id;
        request.m_stValue.m_stPaiMaiBuyWorld.m_uiPrice = price;
        request.m_stValue.m_iPaiMaiIngoreID = param;

        return msg;
    }


    /**
     * 获取加入宗门请求/撤销申请宗门/拉取已申请的宗门列表
     *	GUILD_APPLY_CODE_WITHDRAW://撤销申请
     *	GUILD_APPLY_CODE_ASKNOTIFY://获取notify
     *	GUILD_APPLY_CODE_APPLY://申请加入宗门
     * @param	guildId
     * @param	applyCode
     * @return
     */
    static getGuildJoinRequest(guildId: number = 0, applyCode: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;

        request.m_usType = Macros.GUILD_JOIN_GUILD;
        request.m_stValue.m_stApplyRequest.m_ucCode = applyCode;
        request.m_stValue.m_stApplyRequest.m_uiGuildID = guildId;

        return msg;
    }


    /**
     * 获取宗门神兽面板信息
     * @param	guildId
     * @param	applyCode
     * @return
     */
    static getGuildMonsterPanelRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();
        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_ZZHC_PANNLE_LIST;
        return msg;
    }


    /**
     * 宗门神兽喂养协议
     * @param	guildId
     * @param	applyCode
     * @return
     */
    static getGuildMonsterFeedRequest(num: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();
        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_ZZHC_BOSS_FEED;
        request.m_stValue.m_iZZHCBossFeed = num;
        return msg;
    }

    /**
    *远古战场宗门召集协议
    */
    static getXZFMGuildCallRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();
        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_CALL_XZFM;
        request.m_stValue.m_iXZFMCallType = 1;
        return msg;
    }


    /**
     * 宗门神兽领奖协议
     * @param	guildId
     * @param	applyCode
     * @return
     */
    static getGuildMonsterRewardRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();
        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_ZZHC_GIFT_GET;
        request.m_stValue.m_ucZZHCGiftGet = type;
        return msg;
    }

    /**
     * 拉取名将面板
     */
    static getMingJiangPanelRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();
        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_MJTZ_OPEN;

        return msg;
    }

    /**
     * 拉取名将排行面板
     */
    static getMingJiangRankViewRequest(page: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();
        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_MJTZ_LIST_RANK;
        request.m_stValue.m_ucMJTZListRank = page;

        return msg;
    }

    /**
     * 名将奖励
     */
    static getMingJiangRewardRequest(index: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();
        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_MJTZ_GET_GIFT;
        request.m_stValue.m_ucMJTZGetGift = index;

        return msg;
    }

    /**
     * 名将鼓舞
     */
    static getMingJiangBuffRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();
        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_MJTZ_RAISE;

        return msg;
    }


    /**
	* 获取拉取活动信息请求的消息。 拉取活动信息请求的消息。
	*/
    static getListActivityRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getListActivity_Request();
        return msg;
    }

    /**
	*称号激活请求
	* @param roleID
	* @param titleID
	*/
    static getTitleActiveChangeRequest(operate: number, showTitleID: number = 0, isDress: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getTitle_ActiveChange_Request();
        let request: Protocol.Title_ActiveChange_Request = msg.m_msgBody as Protocol.Title_ActiveChange_Request;
        request.m_usType = operate;
        if (operate == Macros.TITLE_SET_SHOW) {
            request.m_stValue.m_stSetTitleReq.m_usSetTitleID = showTitleID;
            request.m_stValue.m_stSetTitleReq.m_usSetType = isDress;
        }
        return msg;
    }

    //发送移动请求
    static getMovePositionResquest(posList: Array<Protocol.UnitPosition>, seq: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getMovePosition_Request();
        let request: Protocol.MovePosition_Request = msg.m_msgBody as Protocol.MovePosition_Request;
        request.m_stRoleID = G.DataMgr.heroData.roleID;
        request.m_stDstPath.m_iNumber = posList.length;
        request.m_stDstPath.m_astPosition = posList;
        request.m_ushSeq = seq;
        return msg;
    }
    //发送技能请求
    static getCastSkillResquest(unitID: number, skillParam: Protocol.CastSkillParameter, skillTarget: Protocol.SkillTarget, skillEffectTargets: Protocol.SkillEffectTargetList): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCastSkill_Request();
        let request: Protocol.CastSkill_Request = msg.m_msgBody as Protocol.CastSkill_Request;
        request.m_ushCasterUnitID = unitID;
        request.m_stCastSkillParamerter = uts.deepcopy(skillParam, request.m_stCastSkillParamerter);
        request.m_stEffectTargetList = uts.deepcopy(skillEffectTargets, request.m_stEffectTargetList);
        request.m_stSkillTarget = uts.deepcopy(skillTarget, request.m_stSkillTarget);
        return msg;
    }
    /**
     * 拉取任务进度。
     */
    static getListProgressResquestMsg(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getListProgress_Request();
        let request: Protocol.ListProgress_Request = msg.m_msgBody as Protocol.ListProgress_Request;

        request.m_stRoleID = G.DataMgr.gameParas.roleID;

        return msg;
    }
    /**
     * 操作某个人物。
     * @param m_iQuestID
     * @param questOperation
     * @param param
     */
    static getOperateOneQuestRequestMsg(m_iQuestID: number, questOperation: number, param: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getOperateQuest_Request();
        let request: Protocol.OperateQuest_Request = msg.m_msgBody as Protocol.OperateQuest_Request;

        request.m_stRoleID = G.DataMgr.gameParas.roleID;
        request.m_iQuestID = m_iQuestID;
        request.m_ucQuestOperation = questOperation;
        request.m_uiParam = param;
        return msg;
    }

    /**
     * 门派/前线/皇榜任务面板操作的协议。
     * @param questType
     * @param opType
     * @param param
     *
     */
    static getQuestPanelRequest(questType: number, opType: number, param: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getQuestPanel_Request();

        let request: Protocol.QuestPanel_Request = msg.m_msgBody as Protocol.QuestPanel_Request;
        request.m_usQuestType = questType;
        request.m_usType = opType;
        request.m_stValue.m_stUplevelType = param;

        return msg;
    }

    static getItemTransportRequest(sceneID: number, type: number, npcID = 0, x = 0, y = 0, keepAway = 0, questFeedBack = 0, extraType = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getItemTransport_Request();
        let request: Protocol.ItemTransport_Request = msg.m_msgBody as Protocol.ItemTransport_Request;

        request.m_iSceneID = sceneID;
        request.m_ucTransportType = type;
        //if (type == Macros.ITEMTRANSPORT_TYPE_FLIGHT_NPC) {
        //    request.m_stPositionInfo.m_iNPCID = npcID;
        //}
        //else if (type == Macros.ITEMTRANSPORT_TYPE_FLIGHT_POSITION) {
        //    request.m_stPositionInfo.m_stUnitPosition.m_uiX = x;
        //    request.m_stPositionInfo.m_stUnitPosition.m_uiY = y;
        //}
        request.m_stPositionInfo.m_iNPCID = npcID;
        request.m_stPositionInfo.m_stUnitPosition.m_uiX = x;
        request.m_stPositionInfo.m_stUnitPosition.m_uiY = y;
        request.m_iRdmRadius = keepAway;
        request.m_iQuestFeedback = questFeedBack;
        request.m_ucExtraType = extraType;

        return msg;
    }

    /**
     * 特殊传送的请求，比如南蛮入侵，需要用到寻路表。
     * @param type
     * @param para1
     * @param para2
     */
    static getSpecialTransportRequest(type: number, para1: number = 0, para2: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getSpecialTransport_Request();

        let request: Protocol.SpecialTransport_Request = msg.m_msgBody as Protocol.SpecialTransport_Request;
        request.m_stEnterType.m_cEnterType = type;
        request.m_stEnterType.m_iPara1 = para1;
        request.m_stEnterType.m_iPara2 = para2;

        return msg;
    }

    /**
	* 申请添加好友列表信息
	* @param roleId - 玩家标识ID
	* @param targetRoleId - 被加玩家标识ID
	* @return
	*
	*/
    static getApplyFriendRequest(targetRoleId: Protocol.RoleID): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getFriend_Apply_Request();
        let request: Protocol.Friend_Apply_Request = msg.m_msgBody as Protocol.Friend_Apply_Request;

        request.m_stOperatorRoleID = G.DataMgr.gameParas.roleID;
        request.m_stTargetRoleID = targetRoleId;

        return msg;
    }


    /**
     * 发送获取游戏好友列表信息
     * @param roldid - 玩家标识ID
     * @return
     *
     */
    static getFetchGameFriendRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getFriend_FetchGameFriend_Request();
        let request: Protocol.Friend_FetchGameFriend_Request = msg.m_msgBody as Protocol.Friend_FetchGameFriend_Request;
        request.m_stRoleID = G.DataMgr.gameParas.roleID;
        request.m_cFlag = 0; // 后台要求
        return msg;
    }


    /**
	* 发送添加好友列表信息
	* @param roleId - 玩家标识ID
	* @param targetRoleId - 被加玩家标识ID
	* @return
	*
	*/
    static getAddFriendRequest(targetRoleId: Protocol.RoleID, type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getFriend_Add_Request();
        let request: Protocol.Friend_Add_Request = msg.m_msgBody as Protocol.Friend_Add_Request;
        request.m_stOperatorRoleID = G.DataMgr.gameParas.roleID;
        request.m_stTargetRoleID = targetRoleId;
        request.m_ucType = type;
        return msg;
    }

    /**
    * 发送好友查询请求
    * @param roleId - 玩家Id
    * @param friendName - 玩家名称
    * @return
    *
    */
    static getFriendsQueryRequest(friendName: string): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getFriend_Search_Request();
        let request: Protocol.Friend_Search_Request = msg.m_msgBody as Protocol.Friend_Search_Request;
        request.m_stRoleID = G.DataMgr.gameParas.roleID;
        request.m_szNickName = friendName;
        return msg;
    }

    /**
	* 发送获取游戏好友详细信息列表信息
	* @param roleId - 玩家标识ID
	* @param targetRoleId - 被加玩家标识ID
	* @return
	*
	*/
    static getFriendRoleInfoRequest(targetRoleId: Protocol.RoleID, rankType: number = 0, worldID: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getFriend_RoleInfo_Request();
        let request: Protocol.Friend_RoleInfo_Request = msg.m_msgBody as Protocol.Friend_RoleInfo_Request;

        request.m_stOperatorRoleID = G.DataMgr.gameParas.roleID;
        request.m_stTargetRoleID = targetRoleId;
        request.m_ucTransData = rankType;
        request.m_usWorldID = worldID;

        return msg;
    }


    /**
	* 发送删除好友列表信息
	* @param roleId - 玩家标识ID
	* @param targetRoleId - 被加玩家标识ID
	* @return
	*
	*/
    static getDeleteFriendRequest(targetRoleId: Protocol.RoleID, type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getFriend_Delete_Request();
        let request: Protocol.Friend_Delete_Request = msg.m_msgBody as Protocol.Friend_Delete_Request;
        request.m_stOperatorRoleID = G.DataMgr.gameParas.roleID;
        request.m_stTargetRoleID = targetRoleId;
        request.m_ucType = type;
        return msg;
    }

    /**
    * 拉取最近联系人在线信息
    * @param roleId - 玩家Id
    * @param infoList - 最近联系人信息
    * @return
    *
    */
    static getFriendsContactInfo(infoList: Protocol.GameFriendInfo[]): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getFriend_Contact_Request();
        let contactList: Protocol.ContactList = {} as Protocol.ContactList;
        contactList.m_astContactInfo = [];
        contactList.m_ushNumber = infoList.length;
        let tempContactInfo: Protocol.ContactInfo;
        for (let i: number = 0; i < contactList.m_ushNumber; ++i) {
            tempContactInfo = {} as Protocol.ContactInfo;
            tempContactInfo.m_stRoleID = infoList[i].m_stRoleID;
            tempContactInfo.m_szNickName = infoList[i].m_szNickName;
            contactList.m_astContactInfo.push(tempContactInfo);
        }
        let request: Protocol.Friend_Contact_Request = msg.m_msgBody as Protocol.Friend_Contact_Request;
        request.m_stRoleID = G.DataMgr.gameParas.roleID;
        request.m_stContactList = contactList;
        return msg;
    }

    /**
     * 获取日常操作的请求。
     * @param type
     * @return
     *
     */
    static getDailyOperateRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getDayOperate_Request();
        let request: Protocol.DayOperate_Request = msg.m_msgBody as Protocol.DayOperate_Request;

        request.m_uiType = type;

        return msg;
    }

    /**
	*队伍操作
	* @param roleID
	* @param operation
	* @param teamID
	* @param dstRoleID
	* @param result
	* @param name
	* @return
	*
	*/
    static getTeamOperateRequestMsg(operation: number, dstRoleID: Protocol.RoleID = null, teamID: Protocol.TEAMID = null, CanOtherJoin: boolean = false, MemberCanInvite: boolean = false): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getOperateTeam_Request();

        let request: Protocol.OperateTeam_Request = msg.m_msgBody as Protocol.OperateTeam_Request;
        request.m_ucOperation = operation;

        if (null != dstRoleID) {
            request.m_stDstRoleID.m_uiSeq = dstRoleID.m_uiSeq;
            request.m_stDstRoleID.m_uiUin = dstRoleID.m_uiUin;
        }

        if (teamID != null) {
            request.m_stTeamID = teamID;
            request.m_stTeamRestriction.m_ucCanOtherJoin = CanOtherJoin ? 1 : 0;
            request.m_stTeamRestriction.m_ucMemberCanInvite = MemberCanInvite ? 1 : 0;
        }
        return msg;
    }

    /**
    * 得到查询副本动态菜单的请求
    * @param roleID
    * @param ownerID 有可能是副本ID, NPCID, MonserID...
    * @return
    *
    */
    static getListMenuRequest(ownerID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getListMenu_Request();
        let request: Protocol.ListMenu_Request = msg.m_msgBody as Protocol.ListMenu_Request;
        request.m_iOwnerID = ownerID;
        return msg;
    }


    /**
    *  客户端向服务器请求点击某个菜单项
    * @param ownerID
    * @param menuNodeInx
    * @param unitID 只有获取怪物身上的菜单的时候才需要，一般都只要0就可以了
    * @return
    *
    */
    static getClickMenuRequest(ownerID: number, menuNodeInx: number, unitID: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getClickMenu_Request();
        let request: Protocol.ClickMenu_Request = msg.m_msgBody as Protocol.ClickMenu_Request;
        request.m_iOwnerID = ownerID;
        request.m_iExtraParam = unitID;
        request.m_ucMenuNodeIndex = menuNodeInx;
        return msg;
    }

    /**
     *
     * @param uin
     * @param idType
     * @param signID
     * @param thingID
     * @param thingPosition
     * @param thingCount
     * @param idTypeDst
     * @param signIDDst
     * @param thingPositionDst
     * @param slot 用于散仙下标
     * @return
     *
     */
    static getSwapContainerMsg(idType: number, thingIDs: number[], thingPositions: number[], thingCounts: number[], idTypeDst: number, thingPositionDst: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getSwapContainer_Request();
        let request: Protocol.SwapContainer_Request = msg.m_msgBody as Protocol.SwapContainer_Request;
        request.m_stSrcContainerID.m_ucContainerType = idType;
        request.m_stSrcContainerID.m_stOwnerID = G.DataMgr.gameParas.roleID;
        if (defines.has('_DEBUG')) {
            uts.assert(thingIDs.length == thingPositions.length && thingPositions.length == thingCounts.length);
        }
        request.m_stSrcThingList.m_iThingNumber = thingIDs.length;
        request.m_stSrcThingList.m_astThing = new Array<Protocol.ContainerThing>();
        for (let i: number = thingIDs.length - 1; i >= 0; i--) {
            request.m_stSrcThingList.m_astThing.push(ProtocolUtil.getContainerThing(thingIDs[i], thingPositions[i], thingCounts[i]));
        }
        request.m_stDstContainerID.m_ucContainerType = idTypeDst;
        request.m_stDstContainerID.m_stOwnerID = G.DataMgr.gameParas.roleID;
        request.m_ucDstPosition = thingPositionDst;
        return msg;

    }

    protected static getContainerThing(id: number, pos: number, count: number): Protocol.ContainerThing {
        let containerThing: Protocol.ContainerThing = {} as Protocol.ContainerThing;
        containerThing.m_iThingID = id;
        containerThing.m_usPosition = pos;
        containerThing.m_iNumber = count;

        return containerThing;
    }

    /**
    * 拉取副本中的怪物聚落信息。
    * @return
    *
    */
    static getMonstersInPinstance(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGetNpcPostionList_Request();

        // 虽然名字叫GetNpc，但它真的是找怪物的啊，找benjamin吧
        let request: Protocol.GetNpcPostionList_Request = msg.m_msgBody as Protocol.GetNpcPostionList_Request;

        return msg;
    }

    /**
     * 获取NPC传送请求协议。
     * @param npcID NPC传送代理ID。
     * @param targetID NPC传送目标ID。
     * @return NPC传送请求协议。
     *
     */
    static getNPCTransportRequestMsg(npcID: number, targetID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getNPCTransport_Request();
        let request: Protocol.NPCTransport_Request = msg.m_msgBody as Protocol.NPCTransport_Request;

        request.m_iNPCID = npcID;
        request.m_iTransportPointID = targetID;

        return msg;
    }

    /**
     * 获取取得活动限次信息的请求
     * @param roleID
     * @return
     *
     */
    static getListActivityLimitRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getListActivityLimit_Request();
        let request: Protocol.ListActivityLimit_Request = msg.m_msgBody as Protocol.ListActivityLimit_Request;
        request.m_stRoleID = G.DataMgr.gameParas.roleID;

        return msg;
    }

    /**
     * 治疗玩家
     * @param roleId 玩家ID
     * @return
     *
     */
    static getHealRequest(npcid: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getNPCBehaviour_Request();
        let request: Protocol.NPCBehaviour_Request = msg.m_msgBody as Protocol.NPCBehaviour_Request;

        request.m_stRoleID = G.DataMgr.gameParas.roleID;
        request.m_ucBehaviourID = Macros.NPC_BEHAVIOUR_HEAL;
        request.m_iNPCID = npcid;

        return msg;
    }

    /**
         * 获取假的释放技能Response。
         * @param skillReqParam
         * @return
         *
         */
    static getFakeCastSkillResponse(skill: GameConfig.SkillConfigM, skillReqParam: SkillReqParam): Protocol.CastSkill_Response {
        let body: Protocol.CastSkill_Response = {} as Protocol.CastSkill_Response;
        body.m_stCastSkillParamerter = uts.deepcopy(skillReqParam.skillParam, body.m_stCastSkillParamerter, true);
        body.m_stSkillTarget = uts.deepcopy(skillReqParam.skillTarget, body.m_stSkillTarget, true);
        body.m_stSkillTargetList = uts.deepcopy(skillReqParam.skillTargets.effectTargets, body.m_stSkillTargetList, true);
        body.m_stUACList = {} as Protocol.UACList;
        body.m_stUACList.m_ucCasterNumber = 0;
        body.m_stUACList.m_astCasterUAC = [];
        body.m_stUACList.m_astCasterUAC.length = 0;
        body.m_stUACList.m_ucTargetNumber = 1;
        body.m_stUACList.m_astTargetUAC = [];
        body.m_stUACList.m_astTargetUAC.length = 1;
        let uac: Protocol.UnitAttributeChanged = {} as Protocol.UnitAttributeChanged;
        // 一共砍6刀
        let crtHp = skillReqParam.attackTarget.Data.getProperty(Macros.EUAI_CURHP);
        if (ProtocolUtil.LastFakeSkillTargetUnitId != skillReqParam.skillTarget.m_iUnitID) {
            ProtocolUtil.FakeSkillDeltaRandoms = [-0.09334, -0.06334, -0.03334, 0.03334, 0.06334, 0.09334];
        }
        let hpRate = 0.16666;
        let floatCnt = ProtocolUtil.FakeSkillDeltaRandoms.length;
        if (floatCnt > 0) {
            let floaIdx = Math.floor(Math.random() * floatCnt);
            let floatDelta = ProtocolUtil.FakeSkillDeltaRandoms.splice(floaIdx, 1)[0];
            hpRate += floatDelta;
        }
        let hpDelta: number = Math.ceil(skillReqParam.attackTarget.Data.getProperty(Macros.EUAI_MAXHP) * hpRate);
        if (hpDelta > crtHp) {
            hpDelta = crtHp;
        }
        skill.m_astSkillEffect[0].m_iEffectValue;
        let llHp: number = Math.max(0, crtHp - hpDelta);
        uac.m_allCurrentValue = [];
        uac.m_allCurrentValue.push(llHp);
        let llHpDelta: number = -hpDelta;
        uac.m_allDeltaValue = [];
        uac.m_allDeltaValue.push(llHpDelta);
        uac.m_iCasterUnitID = G.DataMgr.heroData.unitID;
        uac.m_iUnitID = skillReqParam.attackTarget.Data.unitID;
        uac.m_ucNumber = 1;
        uac.m_uiEffectMask = Macros.EffectMask_None;
        uac.m_uiMask = 1 << Macros.EUAI_CURHP;
        uac.m_uiMask64 = 0;
        if (llHp <= 0) {
            // 死了
            uac.m_uiUnitStatus = 0;
        }
        else {
            // 还活着
            uac.m_uiUnitStatus = Macros.EUS_ALIVE;
        }
        body.m_stUACList.m_astTargetUAC[0] = uac;

        body.m_ushCasterUnitID = G.DataMgr.heroData.unitID;
        body.m_ushResultID = ErrorId.EQEC_Success;

        return body;
    }

    static getFakeCastSkillNotify(attacker: UnitController, skillConfig: GameConfig.SkillConfigM, skillReqParam: SkillReqParam): Protocol.CastSkill_Notify {
        let body: Protocol.CastSkill_Notify = {} as Protocol.CastSkill_Notify;

        body.m_iOwnerUnitID = 0;
        body.m_iUnitID = attacker.Data.unitID;
        body.m_stCastSkillParamerter = skillReqParam.skillParam;
        body.m_stSkillTarget = skillReqParam.skillTarget;
        body.m_stSkillTargetList = skillReqParam.skillTargets.effectTargets;
        body.m_stUACList = {} as Protocol.UACList;
        body.m_stUACList.m_astCasterUAC = [];
        body.m_stUACList.m_astCasterUAC.length = 0;
        body.m_stUACList.m_astTargetUAC = [];
        body.m_stUACList.m_astTargetUAC.length = 1;
        body.m_stUACList.m_ucCasterNumber = 0;
        body.m_stUACList.m_ucTargetNumber = 1;

        let uac: Protocol.UnitAttributeChanged = {} as Protocol.UnitAttributeChanged;
        // 只做血量变化，而且是显示上的，实际不掉血
        let hpDelta: number = Math.floor(skillReqParam.attackTarget.Data.getProperty(Macros.EUAI_MAXHP) * .01);
        let llHp: number = G.DataMgr.heroData.getProperty(Macros.EUAI_CURHP);
        uac.m_allCurrentValue = [];
        uac.m_allCurrentValue.push(llHp);
        let llHpDelta: number = -hpDelta;
        uac.m_allDeltaValue = [];
        uac.m_allDeltaValue.push(llHpDelta);
        uac.m_iCasterUnitID = attacker.Data.unitID;
        uac.m_iUnitID = G.DataMgr.heroData.unitID;
        uac.m_ucNumber = 1;
        uac.m_uiEffectMask = Macros.EffectMask_None;
        uac.m_uiMask = 1 << Macros.EUAI_CURHP;
        uac.m_uiMask64 = 0;
        uac.m_uiUnitStatus = G.DataMgr.heroData.unitStatus;
        body.m_stUACList.m_astTargetUAC[0] = uac;

        body.m_ucCastStatus = Macros.CASTSKILL_STATUS_END;

        return body;
    }

    /**
     * 请求传送。
     * @param targetID
     * @param questID
     * @return
     *
     */
    static getTransportResquestMsg(targetID: number, questID: number, questReason: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getTransport_Request();
        let request: Protocol.Transport_Request = msg.m_msgBody as Protocol.Transport_Request;
        request.m_stRoleID = G.DataMgr.heroData.roleID;
        request.m_iTransportPointID = targetID;
        request.m_iQuestID = questID;
        request.m_ucQuestType = questReason;
        return msg;
    }

    /**
	* 拉取指定场景怪物列表。
	* @param sceneID
	* @return
	*
	*/
    static getSceneMonsterRequest(sceneID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCSGetSceneMonsterRequest();
        let request: Protocol.CSGetSceneMonsterRequest = msg.m_msgBody as Protocol.CSGetSceneMonsterRequest;
        request.m_iSceneID = sceneID;
        return msg;
    }

    static getRevivalRequestMsg(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getRevival_Request();
        let request: Protocol.Revival_Request = msg.m_msgBody as Protocol.Revival_Request;
        request.m_stOperatorID = G.DataMgr.heroData.roleID;
        request.m_stTargetID = G.DataMgr.heroData.roleID;
        request.m_ucRevivalType = type;
        return msg;
    }

    /**
	* 获取容器扩容的协议消息。
	* @param uin qq号码
	* @param signID
	* @param idType 容器类型ID，可以为背包（<code>Macros.CONTAINER_TYPE_ROLE_BAG</code>）或仓库（<code>Macros.CONTAINER_TYPE_ROLE_STORE</code>）。
	* @param spaceNum 欲购买的格子数量。
	* @return 容器扩容的协议消息。
	*
	*/
    static getExtendContainerMsg(idType: number, spaceNum: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getContainerBuySpace_Request();
        let request: Protocol.ContainerBuySpace_Request = msg.m_msgBody as Protocol.ContainerBuySpace_Request;

        request.m_stContainerID.m_ucContainerType = idType;
        request.m_stContainerID.m_stOwnerID = G.DataMgr.gameParas.roleID;
        request.m_ushSpaceNum = spaceNum;

        return msg;
    }

    /**
	* 拾取掉落物品请求消息
	* @param unitID
	* @return
	*
	*/
    static getDropThingRequest(unitID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGetDroppedThing_Request();
        let request: Protocol.GetDroppedThing_Request = msg.m_msgBody as Protocol.GetDroppedThing_Request;

        request.m_iUnitID = unitID;

        return msg;
    }

    /**
	* 获取消息请求
	* @param data
	* @return
	*
	*/
    static getChatRequest(data: ChannelData, check: string): Protocol.FyMsg {

        let msg: Protocol.FyMsg = SendMsgUtil.getChat_Request();
        let request: Protocol.Chat_Request = msg.m_msgBody as Protocol.Chat_Request;
        request.m_ucChannel = data.id;
        request.m_stRoleID = G.DataMgr.gameParas.roleID;
        request.m_ucCheck = check;
        if (request.m_ucChannel == Macros.CHANNEL_PRIVATE) {
            request.m_stPrivateRoleID = data.roleAbstract.roleID;
        }
        request.m_ucMsgDataNum = 0;
        request.m_astMsgData.length = 0;
        let msgData: Protocol.MsgData;
        let channelMsgData: ChannelMsgData;
        let msgStr: string = data.displayMsg;
        let offset: number = 0;
        let start: number = 0;
        for (let i: number = data.listMsgData.length - 1; i >= 0; i--) {
            channelMsgData = data.listMsgData[i];
            request.m_ucMsgDataNum++;
            request.m_astMsgData.unshift(channelMsgData.data);
            msgStr = msgStr.substring(0, channelMsgData.startIndex) + '#U=' + i + '#' + msgStr.substring(channelMsgData.endIndex + 1);
        }
        request.m_szMessage = msgStr;
        return msg;
    }

    /**
	* 发送gm指令
	* @param uin
	* @param gm
	* @return
	*
	*/
    static getGMMsg(gm: string): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGameMaster_Request();
        let request: Protocol.GameMaster_Request = msg.m_msgBody as Protocol.GameMaster_Request;
        request.m_stRoleID = G.DataMgr.heroData.roleID;
        request.m_cCommandType = 0;
        request.m_szCommand = gm;

        return msg;
    }


    static getEquipEnhanceRequest(equipPart: number, type: number, actDress: number = 0, num: number = 0, stage: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();
        let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
        request.m_stContainerID.m_ucContainerType = Macros.CONTAINER_TYPE_ROLE_EQUIP;
        request.m_ucEquipPart = equipPart;
        request.m_usType = type;
        request.m_stValue.m_stSuitAct.m_ucActDress = actDress;
        request.m_stValue.m_stSuitAct.m_ucNum = num;
        request.m_stValue.m_stSuitAct.m_ucStage = stage;
        request.m_stValue.m_ucSlotSuitUpType = actDress;
        request.m_stValue.m_ucSlotLianTiUp = actDress;
        request.m_stValue.m_ucSlotLTSBAct = actDress;

        return msg;
    }

    static getHunguFZRequest(equipPart: number, type: number, actDress: number = 0, num: number = 0, stage: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();
        let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
        request.m_stContainerID.m_ucContainerType = Macros.CONTAINER_TYPE_HUNGU_EQUIP;
        request.m_ucEquipPart = equipPart;
        request.m_usType = type;
        request.m_stValue.m_stSuitAct.m_ucActDress = actDress;
        request.m_stValue.m_stSuitAct.m_ucNum = num;
        request.m_stValue.m_stSuitAct.m_ucStage = stage;
        request.m_stValue.m_ucSlotSuitUpType = actDress;
        request.m_stValue.m_ucSlotLianTiUp = actDress;
        request.m_stValue.m_ucSlotLTSBAct = actDress;

        return msg;
    }

    static getHunguSkillFZRequest(equipPart: number, type: number, materialid: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();
        let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
        request.m_stContainerID.m_ucContainerType = Macros.CONTAINER_TYPE_HUNGU_EQUIP;
        request.m_ucEquipPart = equipPart;
        request.m_usType = type;
        request.m_stValue.m_iHunGuSkillFZ = materialid;
        return msg;
    }

    /**
	* 打开面板拉取散仙信息
	* @return
	*
	*/
    static getOpenPetPanelRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getOpenBeautyPannel_Request();
        let request: Protocol.OpenBeautyPannel_Request = msg.m_msgBody as Protocol.OpenBeautyPannel_Request;

        return msg;
    }

    /**
	* 取得坐骑的请求
	* @param state
	* @return
	*
	*/
    static getMountRideRequst(state: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getMountRideChange_Request();

        let request: Protocol.MountRideChange_Request = msg.m_msgBody as Protocol.MountRideChange_Request;
        request.m_ucMountRide = state;
        return msg;
    }

    /**
	* 获取拉取商城全服限量信息请求的消息。
	* @return 拉取商城全服限量信息请求的消息。
	*
	*/
    static getNpcStoreLimitListRequst(storeID: number): Protocol.FyMsg {
        if (defines.has('_DEBUG')) {
            uts.assert(storeID > 0, '艹！商店ID不能为0！');
        }
        let msg: Protocol.FyMsg = SendMsgUtil.getNPCStoreLimitList_Request();

        let request: Protocol.NPCStoreLimitList_Request = msg.m_msgBody as Protocol.NPCStoreLimitList_Request;
        request.m_iStoreID = storeID;
        return msg;
    }

    /**
	* 发送物品交易信息
	* @param roleId -
	* @param npcId - NPC编号
	* @param itemPosition - 物品在售卖列表的位置
	* @param packAmount - 物品的打包数量
	* @param itemCount - 物品数量
	* @param itemId - 物品Id
	* @param excID - 指定的支付货币ID，默认为0，表示表里配置的第一种货币ID。
	* @return 请求信息
	*/
    static getBuyItemRequest(npcId: number, itemPosition: number, packAmount: number, itemCount: number, itemId: number, excID: number, storeID: number, autoUse: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getNPCBehaviour_Request();
        let request: Protocol.NPCBehaviour_Request = msg.m_msgBody as Protocol.NPCBehaviour_Request;

        request.m_stRoleID = G.DataMgr.heroData.roleID;
        request.m_iNPCID = npcId;
        request.m_ucBehaviourID = Macros.NPC_BEHAVIOUR_BUY;
        request.m_stThing.m_iNumber = itemCount;
        request.m_stThing.m_iThingID = itemId;
        request.m_stThing.m_usPosition = itemPosition;
        request.m_ucAmount = packAmount;
        request.m_iExchangeID = excID;
        request.m_iStoreID = storeID;
        request.m_ucAutoUse = autoUse;

        return msg;
    }

    /**
          * 魂骨洗炼
          * @param equipPart
          * @param type
          * @return
          *
          */
    static getHunGuXiLianRequest(equipPart: number, type: number, num: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();

        let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
        request.m_stContainerID.m_ucContainerType = Macros.CONTAINER_TYPE_HUNGU_EQUIP;
        request.m_ucEquipPart = equipPart;
        request.m_usType = type;
        request.m_stValue.m_ucHunGuSlotWash = num;
        request.m_stValue.m_ucHunGuSlotWashBuy = num;
        return msg;
    }

    /**
   *  魂骨洗炼锁定
   * @param equipPart
   * @param lockFlag
   * @return
   *
   */
    static getHunGuWashLockChangeRequest(equipPart: number, lockFlag: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();
        let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
        request.m_stContainerID.m_ucContainerType = Macros.CONTAINER_TYPE_HUNGU_EQUIP;
        request.m_ucEquipPart = equipPart;
        request.m_usType = Macros.EQUIP_HUNGU_WASH_LOCK;
        request.m_stValue.m_ucHunGuSlotWashLockReq = lockFlag;
        return msg;
    }


    /**
          * 装备锻造
          * @param equipPart
          * @param type
          * @return
          *
          */
    static getEquipRefineRequest(equipPart: number, type: number, num: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();

        let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
        request.m_stContainerID.m_ucContainerType = Macros.CONTAINER_TYPE_ROLE_EQUIP;
        request.m_ucEquipPart = equipPart;
        request.m_usType = type;
        request.m_stValue.m_ucEquipWash = num;
        request.m_stValue.m_ucDiamondWashCnt = num;
        request.m_stValue.m_ucWashBuy = num;

        return msg;
    }

    /**
    *  锻造锁定
    * @param equipPart
    * @param lockFlag
    * @return
    *
    */
    static getEquipWashLockChangeRequest(equipPart: number, lockFlag: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();
        let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
        request.m_stContainerID.m_ucContainerType = Macros.CONTAINER_TYPE_ROLE_EQUIP;
        request.m_ucEquipPart = equipPart;
        request.m_usType = Macros.EQUIP_WASH_LOCK;
        request.m_stValue.m_ucWashLockReq = lockFlag;
        return msg;
    }

    /**
     * 锻造保存
     * @param equipPart
     * @param index
     * @return
     *
     */
    static getSaveRefineResultRequest(equipPart: number, index: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();

        let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
        request.m_stContainerID.m_ucContainerType = Macros.CONTAINER_TYPE_ROLE_EQUIP;
        request.m_ucEquipPart = equipPart;
        request.m_usType = Macros.EQUIP_SAVE_WASH_RESULT;
        request.m_stValue.m_ucEquipWashResultPos = index;
        return msg;
    }

    /**
     * 镶嵌宝石
     * @param equipPart
     * @param pos
     * @param id
     * @return
     *
     */
    static getDiamondInsertRequest(containerID: number, pos: number, slot: number, id: number, basPos: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();

        let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
        request.m_stContainerID.m_ucContainerType = containerID;
        request.m_ucEquipPart = pos;
        request.m_usType = Macros.EQUIP_DIAMOND_MOUNT;
        request.m_stValue.m_stDiamondMount.m_ucHolePos = slot;
        request.m_stValue.m_stDiamondMount.m_iDiamondID = id;
        request.m_stValue.m_stDiamondMount.m_usPosition = basPos;
        return msg;
    }

    /**
     * 宝石拔出
     * @param equipPart
     * @param pos
     * @return
     *
     */
    static getDiamondPulloutRequest(containerID: number, pos: number, slot: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();

        let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
        request.m_stContainerID.m_ucContainerType = containerID;
        request.m_ucEquipPart = pos;
        request.m_usType = Macros.EQUIP_DIAMOND_UNMOUNT;
        request.m_stValue.m_ucDiamondUnMountPos = slot;
        return msg;
    }

    ///**
    // * 宝石升级
    // * @param equipPart
    // * @param pos
    // * @return
    // *
    // */
    //static getDiamondUplevelRequest(containerID: number, pos: number, slot: number): Protocol.FyMsg {
    //    let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();

    //    let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
    //    request.m_stContainerID.m_ucContainerType = containerID;
    //    request.m_ucEquipPart = pos;
    //    request.m_usType = Macros.EQUIP_DIAMOND_UPLEVEL;
    //    request.m_stValue.m_ucHolePos = slot;
    //    return msg;
    //}

    /**
     * 宝石升级
     * @param equipPart
     * @param pos
     * @return
     *
     */
    static getDiamondUplevelRequest(containerID: number, pos: number, tings: Protocol.ContainerThing[], count: number, holePos: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();

        let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
        request.m_stContainerID.m_ucContainerType = containerID;
        request.m_ucEquipPart = pos;
        request.m_usType = Macros.EQUIP_DIAMOND_UPLEVEL;
        // request.m_stValue.m_stDiamondUpLevel = upReq;
        request.m_stValue.m_stDiamondUpLevel.m_stSrcThingList.m_astThing = tings;
        request.m_stValue.m_stDiamondUpLevel.m_stSrcThingList.m_iThingNumber = count;
        request.m_stValue.m_stDiamondUpLevel.m_ucHolePos = holePos;
        return msg;
    }


    /**
     * 装备斩魔请求
     * @param equipPart
     * @param pos
     * @return
     *
     */
    static getEquipLqRequest(part: number, perfect: boolean, luck: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();

        let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
        request.m_ucEquipPart = part;
        request.m_stContainerID.m_ucContainerType = Macros.CONTAINER_TYPE_ROLE_EQUIP;
        request.m_usType = Macros.EQUIP_LQ_UPLEVEL;
        request.m_stValue.m_stLQReq.m_ucProtect = perfect ? 1 : 0;
        request.m_stValue.m_stLQReq.m_iItemID = luck;
        return msg;
    }
    /**
	* @param roleID
	* @param position
	* @return
	*
	*/
    static getEnterPinstanceRequest(npcID: number, pintanceID: number, isRetry: boolean = false, difficulty: number = 0, jump: number = 0, cost: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getPinstanceEnter_Request();
        let request: Protocol.PinstanceEnter_Request = msg.m_msgBody as Protocol.PinstanceEnter_Request;

        request.m_iNPCID = npcID;
        request.m_iPinstanceID = pintanceID;
        request.m_ucRetryTag = isRetry ? 1 : 0;
        request.m_ucDiff = difficulty;
        request.m_ucJump = jump;
        request.m_ucIsCost = cost;

        return msg;
    }
    /**
	* 退出副本的请求
	* @param roleID
	* @return
	*
	*/
    static getQuitPinstanceRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getPinstanceQuit_Request();
        let request: Protocol.PinstanceQuit_Request = msg.m_msgBody as Protocol.PinstanceQuit_Request;

        request.m_stRoleID = G.DataMgr.gameParas.roleID;

        return msg;
    }
    /**
	* 拉取宗门申请列表请求
	*
	*/
    static fetchApplicantListRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_GET_GUILD_CHECK_LIST_INFO;

        return msg;
    }

    /**
	* 散仙出战
	* @param petID 0 表示将当前散仙休息
	* @return
	*
	*/
    static getPetBattleRequest(petID: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getBeautyBattle_Request();
        let request: Protocol.BeautyBattle_Request = msg.m_msgBody as Protocol.BeautyBattle_Request;
        request.m_iBeautyID = petID;

        return msg;
    }

    /**
     * 散仙强化
     * @param petID
     * @return
     *
     */
    static getPetEnhanceRequest(petID: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getBeautyStageUp_Request();
        let request: Protocol.BeautyStageUp_Request = msg.m_msgBody as Protocol.BeautyStageUp_Request;
        request.m_iBeautyID = petID;

        return msg;
    }
    /**
     * 伙伴觉醒
     * @param type
     * @param petId
     */
    static getPetAwakenRequest(type: number, petId: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getBeautyAwake_Request();
        let request: Protocol.BeautyAwake_Request = msg.m_msgBody as Protocol.BeautyAwake_Request;
        request.m_ucType = type;
        request.m_stValue.m_iStrengthenBeautyID = petId;
        return msg;
    }

    /**
     *
     * @param petID
     * @param type 0 聚神 1飞升
     */
    static getPetShuhunRequest(petID: number, type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getBeautyJuShen_Request();
        let request: Protocol.BeautyJuShen_Request = msg.m_msgBody as Protocol.BeautyJuShen_Request;

        request.m_iBeautyID = petID;
        request.m_bIsFeiSheng = type;
        return msg;
    }

    /**
	* 伙伴功法升级
	* @param petID
	* @return
	*
	*/
    static getPetGongfaReequest(petID: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getBeautyKF_Request();
        let request: Protocol.BeautyKF_Request = msg.m_msgBody as Protocol.BeautyKF_Request;
        request.m_iBeautyID = petID;

        return msg;
    }

    /**
	* 激活伙伴
	* @param petID
	* @return
	*
	*/
    static getActivePetRequest(petID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getBeautyActive_Request();
        let request: Protocol.BeautyActive_Request = msg.m_msgBody as Protocol.BeautyActive_Request;
        request.m_iBeautyID = petID;
        return msg;
    }


    /**
	* 神力面板详情拉取请求
	* @param role	角色ID
	* @return 		返回消息体
	*
	*/
    static getJuyuanInfo(role: Protocol.RoleID = null): Protocol.FyMsg {
        role = G.DataMgr.heroData.roleID;
        let msg: Protocol.FyMsg = SendMsgUtil.getJuYuan_Request();
        let request: Protocol.JuYuan_Request = msg.m_msgBody as Protocol.JuYuan_Request;
        request.m_stRoleID = role;
        return msg;
    }

    /**
    * 神力突破
    * @return 	返回消息体
    *
    */
    static getJuYuanUpgradeRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getJuYuanUpgrade_Request();
        let request: Protocol.JuYuanUpgrade_Request = msg.m_msgBody as Protocol.JuYuanUpgrade_Request;
        return msg;
    }


    /**
    * 副本一键完成操作请求。
    * @param pinstanceID
    * @param isOne
    * @return
    *
    */
    static getOneKeyGetRequest(pinstanceID: number, isOne: boolean, para = 0): Protocol.FyMsg {
        uts.log('getOneKeyGetRequest, pinstanceID = ' + pinstanceID + ', isOne = ' + isOne + ', para' + para);
        let msg: Protocol.FyMsg = SendMsgUtil.getVIPOneKeyGet_Request();
        let request: Protocol.VIPOneKeyGet_Request = msg.m_msgBody as Protocol.VIPOneKeyGet_Request;
        request.m_iID = pinstanceID;
        request.m_ucType = isOne ? 1 : 0;
        request.m_ucPara = para;
        return msg;
    }
    /**
	* 拉取副本信息。
	* @param pinId
	* @return
	*
	*/
    static getPinstanceHomeRequest(type: number, pinId: number, listIds: number[] = null, giftLv: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getPinstanceHomeRequest();
        let request: Protocol.PinstanceHomeRequest = msg.m_msgBody as Protocol.PinstanceHomeRequest;
        request.m_iPinID = pinId;
        request.m_usType = type;
        request.m_stValue.m_iGetGiftLv = giftLv;
        request.m_stValue.m_iGetRankPin = pinId;
        request.m_stValue.m_ucNanDu = giftLv;
        request.m_stValue.m_ucFreshNanDu = giftLv;
        if (null != listIds) {
            request.m_stValue.m_stListAll.m_iPinID = listIds.concat();
            request.m_stValue.m_stListAll.m_ucNum = listIds.length;
        }

        return msg;
    }

    /**
    * 获取查询伙伴远征的协议。
    * @param pinstanceID
    * @return
    *
    */
    static getWyyzPanelRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getWYYZ_Pannel_Request();
        return msg;
    }

    /**
    * 获取购买伙伴远征buff的协议。
    * @param pinstanceID
    * @return
    *
    */
    static getWyyzBuyBuffRequest(buffIndex: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getWYYZ_BuyBuff_Request();
        let request: Protocol.WYYZ_BuyBuff_Request = msg.m_msgBody as Protocol.WYYZ_BuyBuff_Request;
        request.m_iBit = buffIndex;
        return msg;
    }

    /**
    * 获取设置伙伴远征阵容的协议。
    * @param pinstanceID
    * @return
    *
    */
    static getWyyzFightSetRequest(pets: number[]): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getWYYZ_FightSet_Request();
        let request: Protocol.WYYZ_FightSet_Request = msg.m_msgBody as Protocol.WYYZ_FightSet_Request;
        request.m_stSelfFightList.m_aiPetID = pets;
        return msg;
    }

    /**
    * 获取领取伙伴远征全通奖励的协议。
    * @param pinstanceID
    * @return
    *
    */
    static getWyyzGetRewardRequest(level: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getWYYZ_GetReward_Request();
        let request: Protocol.WYYZ_GetReward_Request = msg.m_msgBody as Protocol.WYYZ_GetReward_Request;
        request.m_ucLevel = level;
        return msg;
    }

    /**
    * 获取伙伴远征PK的协议。
    * @param pinstanceID
    * @return
    *
    */
    static getWyyzPKRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getWYYZ_PK_Request();
        let request: Protocol.WYYZ_PK_Request = msg.m_msgBody as Protocol.WYYZ_PK_Request;
        return msg;
    }

    /**
    * 获取伙伴远征释放技能的协议。
    * @param pinstanceID
    * @return
    *
    */
    static getWyyzSkillRequest(petId: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getWYYZ_Skill_Request();
        let request: Protocol.WYYZ_Skill_Request = msg.m_msgBody as Protocol.WYYZ_Skill_Request;
        request.m_iPetID = petId;
        return msg;
    }

    /**
    * 获取查看某跨服副本队伍列表的协议。
    * @param pinstanceID
    * @return
    *
    */
    static getCrossGetTeamListRequest(pinstanceID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_GET_TEAMLIST;
        request.m_stValue.m_stCSCrossGetTeamListReq.m_uiPinstanceID = pinstanceID;

        return msg;
    }

    /**
     * 获取创建跨服副本队伍的协议。
     * @param pinstanceID
     * @return
     *
     */
    static getCrossCreateTeamRequest(pinstanceID: number, pswd: string, autoStart: boolean, lvLimit: number, domain: string, ip: string, port: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_CREATE_TEAM;
        request.m_stValue.m_stCSCrossCreateTeamReq.m_uiPinstanceID = pinstanceID;
        request.m_stValue.m_stCSCrossCreateTeamReq.m_szPassword = pswd;
        request.m_stValue.m_stCSCrossCreateTeamReq.m_ucAutoStart = autoStart ? 1 : 0;
        request.m_stValue.m_stCSCrossCreateTeamReq.m_uiFight = lvLimit;
        request.m_stValue.m_stCSCrossCreateTeamReq.m_szDomain = domain;
        request.m_stValue.m_stCSCrossCreateTeamReq.m_szIP = ip;
        request.m_stValue.m_stCSCrossCreateTeamReq.m_uiPort = port;
        return msg;
    }

    /**
     * 获取加入跨服副本队伍的协议。
     * @param pinstanceID
     * @return
     *
     */
    static getCrossJoinTeamRequest(pinstanceID: number, teamID: number, domain: string, ip: string, port: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_JOIN_TEAM;
        request.m_stValue.m_stCSCrossJoinTeamReq.m_uiPinstanceID = pinstanceID;
        request.m_stValue.m_stCSCrossJoinTeamReq.m_uiTeamID = teamID;
        request.m_stValue.m_stCSCrossJoinTeamReq.m_szDomain = domain;
        request.m_stValue.m_stCSCrossJoinTeamReq.m_szIP = ip;
        request.m_stValue.m_stCSCrossJoinTeamReq.m_uiPort = port;

        return msg;
    }

    /**
     * 获取退出跨服副本队伍的协议。
     * @param pinstanceID
     * @return
     *
     */
    static getCrossQuitTeamRequest(pinstanceID: number, teamID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_EXIT_TEAM;
        request.m_stValue.m_stCSCrossExitTeamReq.m_uiPinstanceID = pinstanceID;
        request.m_stValue.m_stCSCrossExitTeamReq.m_uiTeamID = teamID;
        return msg;
    }

    /**
     * 获取跨服副本队伍踢人的协议。
     * @param pinstanceID
     * @return
     *
     */
    static getCrossKickTeamRequest(pinstanceID: number, teamID: number, kickRoleID: Protocol.RoleID): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_KICK_TEAM;
        request.m_stValue.m_stCSCrossKickTeamReq.m_uiPinstanceID = pinstanceID;
        request.m_stValue.m_stCSCrossKickTeamReq.m_uiTeamID = teamID;
        request.m_stValue.m_stCSCrossKickTeamReq.m_stRoleID = kickRoleID;
        return msg;
    }

    /**
     * 获取设置跨服副本队伍的协议。
     * @param pinstanceID
     * @return
     *
     */
    static getCrossSetTeamRequest(pinstanceID: number, teamID: number, autoStart: number, fight: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_SET_TEAM;
        request.m_stValue.m_stCSCrossSetTeamReq.m_uiPinstanceID = pinstanceID;
        request.m_stValue.m_stCSCrossSetTeamReq.m_uiTeamID = teamID;
        request.m_stValue.m_stCSCrossSetTeamReq.m_ucAutoStart = autoStart;
        request.m_stValue.m_stCSCrossSetTeamReq.m_uiFight = fight;
        return msg;
    }

    /**
     * 获取跨服副本招募队友的协议。
     * @param pinstanceID
     * @return
     *
     */
    static getCrossRecruitTeamRequest(pinstanceID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_RECRUIT_TEAM;
        request.m_stValue.m_stCSCrossRecruitTeamReq.m_uiType = Macros.RECRUITTEAM_TYPE_WORLD;
        request.m_stValue.m_stCSCrossRecruitTeamReq.m_uiPinstanceID = pinstanceID;
        return msg;
    }

    /**
     * 获取跨服副本队伍准备的协议。
     * @param pinstanceID
     * @return
     *
     */
    static getCrossTeamReadyRequest(pinstanceID: number, teamID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_READY_TEAM;
        request.m_stValue.m_stCSCrossReadyTeamReq.m_uiPinstanceID = pinstanceID;
        request.m_stValue.m_stCSCrossReadyTeamReq.m_uiTeamID = teamID;
        request.m_stValue.m_stCSCrossReadyTeamReq.m_ucReady = 1;
        return msg;
    }

    /**
     * 获取跨服副本队伍开始挑战的协议。
     * @param pinstanceID
     * @return
     *
     */
    static getCrossStartPinRequest(pinstanceID: number, teamID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_START_PINSTANCE;
        request.m_stValue.m_stCSCrossStartPinReq.m_uiPinstanceID = pinstanceID;
        request.m_stValue.m_stCSCrossStartPinReq.m_uiTeamID = teamID;
        return msg;
    }

    /**
     * 登录上报自己的服务器相关信息协议
     * @return
     *
     */
    static getCrossWorldInfoReportRequest(domain: string, ip: string, port: number, worldID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_WORLDINFO_REPORT;

        let info: Protocol.LinkWorldInfo = request.m_stValue.m_stCSWorldInfoReportReq.m_stInfo;
        info.m_szDomain = domain;
        info.m_szIP = ip;
        info.m_uiPort = port;
        info.m_uiWorldID = worldID;

        return msg;
    }

    /**
     * 祝福进阶请求
     * @param type
     * @return
     *
     */
    static getZfjjRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getHeroSub_Wish_Request();
        let request: Protocol.HeroSub_Wish_Request = msg.m_msgBody as Protocol.HeroSub_Wish_Request;

        request.m_ucType = type;

        return msg;
    }

    /**
     * 祝福系统化形
     * @param type
     * @param id
     * @return
     *
     */
    static getZhufuChangeRequest(type: number, id: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getHeroSub_Show_Request();
        let request: Protocol.HeroSub_Show_Request = msg.m_msgBody as Protocol.HeroSub_Show_Request;
        request.m_ucType = type;
        request.m_uiImageID = id;
        return msg;
    }

    /**
	* 合成请求。
	* @return
	*id 目标ID
	* UUM 目标数量
	*/
    static getItemMergeRequest(id: number = 0, num: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getItemMerge_Request();
        let request: Protocol.ItemMerge_Request = msg.m_msgBody as Protocol.ItemMerge_Request;
        request.m_uiTargetID = id;
        request.m_uiTargetNum = num;
        return msg;
    }

    /**
     * 魂骨升华请求
     * @param id 升华物品id
     */
    static getHunguMergeRequest(id: number, info: Protocol.SimpleContainerThingObjList) {
        let msg: Protocol.FyMsg = SendMsgUtil.getHunGuMerge_Request();
        let request: Protocol.HunGuMerge_Request = msg.m_msgBody as Protocol.HunGuMerge_Request;
        request.m_usType = Macros.HUNGU_OP_UPCOLOR;
        request.m_stValue.m_stHunGuUpColorReq.m_iTargetID = id;
        request.m_stValue.m_stHunGuUpColorReq.m_stContainerThingObjList = info;
        return msg;
    }

    static getHunguCreateRequest(id: number, info: Protocol.SimpleContainerThingObjList) {
        let msg: Protocol.FyMsg = SendMsgUtil.getHunGuMerge_Request();
        let request: Protocol.HunGuMerge_Request = msg.m_msgBody as Protocol.HunGuMerge_Request;
        request.m_usType = Macros.HUNGU_OP_CREATE;
        request.m_stValue.m_stHunGuCreateReq.m_iTargetID = id;
        request.m_stValue.m_stHunGuCreateReq.m_stContainerThingObjList = info;
        return msg;
    }


    /**
    * 获取参加活动信息请求的消息。
    * @param activityID 活动ID。
    * @param command 操作码。
    * @param param 附加参数。
    * @return 参加活动信息请求的消息。
    *
    */
    static getDoActivityRequest(activityID: number, command: number, param: number = 0, ...args): Protocol.FyMsg {

        args = StringUtil.getArgs(args);
        let msg: Protocol.FyMsg = SendMsgUtil.getDoActivity_Request();
        let request: Protocol.DoActivity_Request = msg.m_msgBody as Protocol.DoActivity_Request;
        request.m_iID = activityID;
        request.m_ucCommand = command;
        switch (activityID) {
            case Macros.ACTIVITY_ID_SDBX:
                //盛典宝箱达成奖励
                if (command == Macros.ACTIVITY_SDBX_OPEN_PANEL) {
                    request.m_stParam.m_ucSDBXOpenPanel = param;
                } else if (command == Macros.ACTIVITY_SDBX_GET_REWARD) {
                    request.m_stParam.m_uiSDBXGetReward = param;
                }
                break;
            case Macros.ACTIVITY_ID_JZXG:
                {
                    if (command == Macros.JZXG_ACT_BUY) {
                        request.m_stParam.m_ucJZXGBuy = param;
                    }
                    break;
                }
            case Macros.ACTIVITY_ID_DUANWU:
                if (command == Macros.DUANWU_ACT_EXCHANGE) {
                    request.m_stParam.m_ucDuanWuExchange = param;
                }
                else if (command == Macros.DUANWU_ACT_GET_REWARD) {
                    request.m_stParam.m_ucDuanWuGetBit = param;
                }
                else if (command == Macros.ZYJ_CZFL_GET_REWARD) {
                    request.m_stParam.m_ucZYJ_CZFLGetReq = param;
                }
                break;
            case Macros.ACTIVITY_ID_BFQD:
                if (command == Macros.BFQD_ACT_DRAW)
                    request.m_stParam.m_ucBFQDDraw = param;
                else if (command == Macros.BFQD_ACT_CHARGE_REWARD)
                    request.m_stParam.m_ucBFQDChargeReward = param;
                break;
            case Macros.ACTIVITY_ID_FESTIVAL_CONSUME://图腾消费回馈
                if (command == Macros.FESTIVAL_CONSUME_GET)
                    request.m_stParam.m_uiFestivalConsumeGet = param;
                break;
            case Macros.ACTIVITY_ID_FESTIVAL_CHARGE://图腾充值回馈
                if (command == Macros.FESTIVAL_CHARGE_GET)
                    request.m_stParam.m_ucFestivalChargeGet = param;
                break;
            case Macros.ACTIVITY_ID_TTZF://图腾祝福
                if (command == Macros.TTZF_ACT_GET_REWARD) {
                    request.m_stParam.m_ucTTZFGetReward = param;
                }
                else if (command == Macros.TTZF_ACT_WISH) {
                    request.m_stParam.m_ucTTZFWish = param;
                }
                break;
            case Macros.ACTIVITY_ID_REDBAG:
                if (command == Macros.SEND_REDBAG)//发红包
                {
                    request.m_stParam.m_stSendRedBag.m_ucRedBagLv = param;
                    request.m_stParam.m_stSendRedBag.m_ucRedBagType = args[0];
                }
                else if (command == Macros.GRAB_REDBAG)//强红包
                {
                    request.m_stParam.m_iRedBagId = param;
                }
                else if (command == Macros.SEE_REDBAG_INFO)//查看红包信息
                {
                    request.m_stParam.m_iSeeRedBagId = param;
                }

                break;
            case Macros.ACTIVITY_ID_HISTORICAL_REMAINS:
                if (command == Macros.HISTORICAL_REMAINS_PANEL) {
                    request.m_stParam.m_ucHistoricalRemainsPanel = param;
                }
                else if (command == Macros.HISTORICAL_REMAINS_BUY_MAGIC_DICE_TIMES) {
                    request.m_stParam.m_ucBuyMagicDiceTimes = param;
                }
                else if (command == Macros.HISTORICAL_REMAINS_GOTO_POS) {
                    request.m_stParam.m_ucGotoPos = param;
                }
                else if (command == Macros.HISTORICAL_REMAINS_RESET_TIMES) {
                    request.m_stParam.m_ucResetTimes = param;
                }
                else if (command == Macros.HISTORICAL_REMAINS_THROW_DICE) {
                    request.m_stParam.m_stThrowDice.m_ucType = param;
                    request.m_stParam.m_stThrowDice.m_ucNumber = args[0];
                }
                else if (command == Macros.HISTORICAL_REMAINS_ONE_KEY_FINISH) {
                    request.m_stParam.m_ucHROneKeyFinish = param;
                }
                else if (command == Macros.HISTORICAL_GET_STAGEPASS_GIFT) {
                    request.m_stParam.m_ucHRGetStagePassGift = param;
                }
                break;
            case Macros.ACTIVITY_ID_BATHE:
                if (command == Macros.ACTIVITY_BATHE_REQ) {
                    request.m_stParam.m_stBatheReq.m_ucOperatTpye = param;
                    request.m_stParam.m_stBatheReq.m_stRoleID = args[0];
                }
                break;

            case Macros.ACTIVITY_ID_GUOYUN:
                request.m_stParam.m_ucGuoYunRefreshTpye = param;
                request.m_stParam.m_ucGuoYunOperateType = param;
                request.m_stParam.m_uiGuoYunList = 0;
                break;

            case Macros.ACTIVITY_ID_JU_BAO_PENG:
                if (command == Macros.ACTIVITY_JBP_OPEN_PANEL) {
                    request.m_stParam.m_ucJBPOpenPanel = param;
                }
                else if (command == Macros.ACTIVITY_JBP_GET_REWARD) {
                    request.m_stParam.m_uiJBPGetReward = param;
                }
                break;

            case Macros.ACTIVITY_ID_XINGYUAN:
                if (command == Macros.XINGYUAN_CONTRIBUTE) {
                    request.m_stParam.m_stXingYuanContribute.m_uiParam = param;
                    request.m_stParam.m_stXingYuanContribute.m_ucType = args[0];
                }
                else if (command == Macros.XINGYUAN_GET_PRIZE) {
                    request.m_stParam.m_iXingYuanGetPrize = param;
                }
                break;

            case Macros.ACTIVITY_ID_JUHSACT:
                if (Macros.JUHS_BUY == command) {
                    request.m_stParam.m_ucJUHSBuyID = param;
                }
                else if (Macros.JUHS_GET == command) {
                    request.m_stParam.m_stJUHSAGetReq.m_ucDay = args[0];
                    request.m_stParam.m_stJUHSAGetReq.m_ucType = args[1];
                    request.m_stParam.m_stJUHSAGetReq.m_ucJUHSGetID = param;
                }
                break;

            case Macros.ACTIVITY_ID_HAQXACT:
                request.m_stParam.m_stHAQXOperateReq.m_ucType = param;
                break;
            case Macros.ACTIVITY_ID_TDXM:
                if (command == Macros.TDXM_CREATE) {
                    request.m_stParam.m_ucTDXMCreate = param;
                }
                else if (command == Macros.TDXM_JOIN) {
                    request.m_stParam.m_stTDXMJoin = args[0] as Protocol.RoleID;
                }
                else if (command == Macros.TDXM_START) {
                    request.m_stParam.m_ucTDXMStart = param;
                }
                else if (command == Macros.TDXM_PANNEL) {
                    request.m_stParam.m_ucTDXMPannel = param;
                }
                break;
            case Macros.ACTIVITY_ID_YBWL:
                if (command == Macros.ACTIVITY_YBWL_BUY) {
                    request.m_stParam.m_stYBWLBuyReq.m_uiValue = param;
                }
                else if (command == Macros.ACTIVITY_YBWL_GET_REWARD) {
                    request.m_stParam.m_stYBWLGetReq.m_ucDay = param;
                }
                break;
            case Macros.ACTIVITY_ID_HLFP:
                if (Macros.ACT_HLFP_GET == command) {
                    request.m_stParam.m_ucHLFPGet = param;
                }
                else if (Macros.ACT_HLFP_REFRESH == command) {
                    request.m_stParam.m_ucHLFPRefresh = param;
                }
                break;

            case Macros.ACTIVITY_ID_XYZP:
                if (command == Macros.XYZP_DRAW) {
                    request.m_stParam.m_ucXYZPDraw = param;
                }
                else if (command == Macros.XYZP_GET_GIFT) {
                    request.m_stParam.m_uiXYZPGetGift = param;
                }
                break;

            case Macros.ACTIVITY_ID_HLZP:
                if (command == Macros.HLZP_DRAW) {
                    request.m_stParam.m_ucHLZPDraw = param;
                }
                break;

            case Macros.ACTIVITY_ID_HLTB:
                if (command == Macros.HLTB_DRAW) {
                    request.m_stParam.m_stHLTBDrawReq.m_ucType = param;
                    request.m_stParam.m_stHLTBDrawReq.m_ucCount = args[0];
                }
                break;
            case Macros.ACTIVITY_ID_RRHAPPY:
                if (command == Macros.ACTIVITY_RR_CHARE_LIST) {
                    request.m_stParam.m_ucRRChargeListReq = param;
                }
                else if (command == Macros.ACTIVITY_RR_CHARE_GET) {
                    request.m_stParam.m_ucRRChargeGetReq = param;
                }
                break;
            case Macros.ACTIVITY_ID_WORLDBOSS:
                if (Macros.ACTIVITY_WORLD_BOSS_REWARD == command) {
                    request.m_stParam.m_uiWorldBossReward = param;
                }
                else if (Macros.ACTIVITY_WORLD_BOSS_ATTENT == command) {
                    request.m_stParam.m_stBossAttentReq.m_uiBossID = param;
                    request.m_stParam.m_stBossAttentReq.m_ucAttent = args[0];
                }
                else if (Macros.ACTIVITY_WORLD_BOSS_ALERT == command) {
                    request.m_stParam.m_ucWorldBossAlert = param;
                }
                else if (Macros.ACTIVITY_WORLD_BOSS_GUILDCALL == command) {
                    request.m_stParam.m_uiBossGuildCall = param;
                }
                break;
            case Macros.ACTIVITY_ID_TMDCB:
                if (Macros.ACTIVITY_TMDCB_LIST == command) {
                    request.m_stParam.m_ucTMDCBListReq = param;
                }
                else if (Macros.ACTIVITY_TMDCB_BUY == command) {
                    request.m_stParam.m_uiTMDCBBuyIndex = param;
                }
                break;
            case Macros.ACTIVITY_ID_DAILYCONSUME_CONSUME:
                if (Macros.DAILY_CONSUME_PANEL == command) {
                    request.m_stParam.m_ucDailyConsumePanel = param;
                }
                else if (Macros.DAILY_CONSUME_GET == command) {
                    request.m_stParam.m_ucDailyConsumeGet = param;
                }
                else if (Macros.CONSUME_RANK_GET_REWARD == command) {
                    request.m_stParam.m_uiConsumeRankGetReward = param;
                }
                break;
            //case Macros.ACTIVITY_ID_CONSUME_RANK:
            //if (Macros.CONSUME_RANK_PANEL == command)
            //{
            //request.m_stParam.m_ucConsumeRankPanel = param;
            //}
            //else if (Macros.CONSUME_RANK_LIST_GET == command)
            //{
            //request.m_stParam.m_uiConsumeRankGetRankList = param;
            //}
            //break;
            case Macros.ACTIVITY_ID_CZSHL:
                if (Macros.ACTIVITY_CZSHL_LIST == command) {
                    request.m_stParam.m_ucCZSHLListReq = param;
                }
                else if (Macros.ACTIVITY_CZSHL_GET == command) {
                    request.m_stParam.m_uiCZSHLGetIndex = param;
                }
                break;
            case Macros.ACTIVITY_ID_JPDDH:
                if (Macros.ACTIVITY_JIPINDADUIHUAN == command) {
                    request.m_stParam.m_uiJiPinDaDuiHuanID = param;
                }
                break;
            //case Macros.ACTIVITY_ID_JINJIERI:
            //    if (Macros.JJR_GET_REWARD == command) {
            //        request.m_stParam.m_stJJRRewardCfg.m_ucMainType = param;
            //        request.m_stParam.m_stJJRRewardCfg.m_uiRewardCfgID = args[0];
            //    }
            //    break;

            case Macros.ACTIVITY_ID_RECHARGEEXCHANGE:
                if (Macros.RECHARGE_EXCHANGE_GET == command) {
                    request.m_stParam.m_uiRechargeExchangeID = param;
                }
                break;
            case Macros.ACTIVITY_ID_DISCOUT:
                if (Macros.LIMIT_TIME_DISCOUNT_BUY == command) {
                    request.m_stParam.m_stDiscountBuy.m_ucCount = param;
                    request.m_stParam.m_stDiscountBuy.m_stBuyList = args[0];
                }
                else if (Macros.LIMIT_TIME_DISCOUNT_PANNEL == command) {
                }
                break;
            case Macros.ACTIVITY_ID_CROSS_FLOWER_RANK:
                if (Macros.ACTIVITY_KFXHB_LIST == command) {
                    request.m_stParam.m_ucKFXHBListReq = param;
                }
                else if (Macros.ACTIVITY_KFXHB_GET_REWARD == command) {
                    request.m_stParam.m_ucKFXHBGetReq = param;
                }
                break;
            case Macros.ACTIVITY_ID_BFXYACT:
                {
                    request.m_stParam.m_ucFMTGuildCallReq = param;
                    break;
                }
            //case Macros.ACTIVITY_ID_PVP_BASE:
            //    {
            //        request.m_stParam.m_ucKFJDCGetReach = param;
            //        break;
            //    }
            case Macros.ACTIVITY_ID_SHENMOZHETIAN:
                {
                    if (Macros.ACTIVITY_CROSS_BOSS_LIST == command) {
                        request.m_stParam.m_stCrossBossReq = param;
                    }
                    else if (Macros.ACTIVITY_CROSS_BOSS_REWARD == command) {
                        request.m_stParam.m_uiCrossBossReward = param;
                    }
                    break;
                }
            case Macros.ACTIVITY_ID_CROSS_DDL:
                if (Macros.DDL_ACT_LIGHT == command) {
                    request.m_stParam.m_uiIndexId = param;
                }
                break;
            case Macros.ACTIVITY_ID_PREFER_CHARGE:
                if (Macros.PREFER_CHARGE_GET == command) {
                    request.m_stParam.m_stPreferChargeGet.m_ucType = param;
                    request.m_stParam.m_stPreferChargeGet.m_uiID = args[0];
                }
                break;
            case Macros.ACTIVITY_ID_CROSSYUNGOU:
                if (Macros.CROSS_YUNGOU_ACT_BUY == command) {
                    request.m_stParam.m_stCrossYunGouBuy.m_uiID = param;
                    request.m_stParam.m_stCrossYunGouBuy.m_ucType = args[0];
                }
                break;
            case Macros.ACTIVITY_ID_LHJ:
                if (Macros.LHJ_TRUN == command) {
                    request.m_stParam.m_ucLHJTurn = param;
                }
                break;
            case Macros.ACTIVITY_ID_BU_BU_GAO_SHENG:
                if (Macros.ACTIVITY_BBGS_GET_REWARD == command) {
                    request.m_stParam.m_uiBBGSGetReward = param;
                }
                break;
            case Macros.ACTIVITY_ID_COLOSSEUM:
                if (Macros.COLOSSEUM_ACT_ON_BATTLE == command) {
                    request.m_stParam.m_stColosseumOnBattle.m_ucSSCout = param;
                    request.m_stParam.m_stColosseumOnBattle.m_astBattleSSList = args[0];
                }
                else if (Macros.COLOSSEUM_ACT_GET_GRADE_REWARD == command) {
                    request.m_stParam.m_uiColosseumGetGradeReward = param;
                }
                break;
            case Macros.ACTIVITY_ID_HOME_BOSS_ACT:
                if (Macros.ACTIVITY_HOME_BOSS_ADDTIME == command) {
                    request.m_stParam.m_iHomeBossAddTimeID = param;
                }
                break;
            case Macros.ACTIVITY_ID_WORLDCUP:
                if (Macros.ACTIVITY_WORLDCUP_BET_WIN == command) {
                    request.m_stParam.m_stWCupBetWin.m_iID = param;
                    request.m_stParam.m_stWCupBetWin.m_iBetNum = args[0];
                    request.m_stParam.m_stWCupBetWin.m_iType = args[1];
                }
                else if (Macros.ACTIVITY_WORLDCUP_BET_SCORE == command) {
                    request.m_stParam.m_stWCupBetScore.m_iID = param;
                    request.m_stParam.m_stWCupBetScore.m_aiBetNum = args[0];
                    request.m_stParam.m_stWCupBetScore.m_ucScoreNum = args[1];
                }
                break;
            case Macros.ACTIVITY_ID_SPRING_CHARGE:
                //春节活动_充值奖励
                if (Macros.ACTIVITY_SPRING_CHARGE_REWARD == command) {
                    request.m_stParam.m_uiSpringChargeGetReward.m_ucType = param;
                    request.m_stParam.m_uiSpringChargeGetReward.m_uiCfgID = args[0];
                }
                break;
            case Macros.ACTIVITY_ID_SPRING_LOGIN:
                //春节活动_登录奖励
                if (Macros.ACTIVITY_SPRING_LOGIN_REWARD == command) {
                    request.m_stParam.m_uiSpringLoginGetReward.m_ucType = param;
                    request.m_stParam.m_uiSpringLoginGetReward.m_uiCfgID = args[0];
                }
                break;
            case Macros.ACTIVITY_ID_WORLDCUPCHAMPION:
                if (Macros.ACTIVITY_WORLDCUP_CHAMPION_GUESS == command) {
                    request.m_stParam.m_stWCupChampionGuess.m_iID = param;
                    request.m_stParam.m_stWCupChampionGuess.m_iTeamID = args[0];
                }
                break;
            case Macros.ACTIVITY_ID_LXFL:
                if (Macros.ACTIVITY_LXFL_OPEN == command) {

                }
                else if (Macros.ACTIVITY_LXFL_GET == command) {
                    request.m_stParam.m_stLXFLGetReq.m_ucType = param;
                    request.m_stParam.m_stLXFLGetReq.m_ucGetID = args[0];
                }
                break;
            case Macros.ACTIVITY_ID_KFNS:
                if (Macros.ACTIVITY_KFNS_OPEN == command) {
                    request.m_stParam.m_ucKFNSPanel = param;
                }
                break;

            case Macros.ACTIVITY_ID_126CROSSCHARGE:
                if (Macros.Act126_PANEL == command) {
                    request.m_stParam.m_ucAct126Panel = param
                }
                else if (Macros.Act126_GET_REWARD == command) {
                    request.m_stParam.m_ucAct126GetReward = param;
                }
                break;

            case Macros.ACTIVITY_ID_QMHD:
                if (Macros.ACTIVITY_QMHD_REWARD == command) {
                    request.m_stParam.m_uiQMHDGetReward = param;
                }
                break;
            case Macros.ACTIVITY_ID_COLLECT_EXCHANGE:
                if (Macros.ACTIVITY_SJDH_START == command) {
                    request.m_stParam.m_ucSJDHStart = param;
                }
                else if (Macros.ACTIVITY_SJDH_WARN == command) {
                    request.m_stParam.m_uiSJDHWarn = param;
                }
                break;
            case Macros.ACTIVITY_ID_RUSH_PURCHASE:
                if (Macros.ACT_RUSH_PURCHASE_BUY == command) {
                    request.m_stParam.m_uiRushPurchaseID = param;
                }
                break;
            case Macros.ACTIVITY_ID_124DBCZ:
                //单笔充值
                if (Macros.Act124_REWARD == command) {
                    request.m_stParam.m_iAct124Reward = param;
                }
            case Macros.ACTIVITY_ID_125XHCZ:
                //循环充值
                if (Macros.Act125_REWARD == command) {
                    request.m_stParam.m_iAct125Reward = param;
                }
            case Macros.ACTIVITY_ID_BLACK_STORE://神秘商店
                if (Macros.Act63_PANEL == command) {
                    request.m_stParam.m_ucAct63Panel = command;
                } else if (Macros.Act63_PANEL == command) {
                    request.m_stParam.m_ucAct63Refresh = command;
                }
                break;
            default:
                request.m_stParam.m_szBuff = param;
                request.m_stParam.m_uiSign = 0;
                request.m_stParam.m_uiSignDay = param;
                request.m_stParam.m_uiPrizeDay = param;
                request.m_stParam.m_ucOpenSvrSignGetDays = param;
                break;
        }
        return msg;
    }



    /**
     * 获取操作技能的消息。
     * @param skillID 操作的技能ID。
     * @param op 操作类型码。
     * @param studyStep 学习技能的步骤，0升一级，1一撸到底
     * @param validFlag 启用技能标记。
     * @return
     *
     */
    static getOperateSkill(skillID: number, op: number, oneKey: number = 0, validFlag: number = 0, progress: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getOperateSkill_Request();

        let request: Protocol.OperateSkill_Request = msg.m_msgBody as Protocol.OperateSkill_Request;

        if (Macros.OPERATE_SKILL_STUDY == op) {
            request.m_stValue.m_stStudySkill.m_iSkillID = skillID;
            request.m_stValue.m_stStudySkill.m_ucOneKey = oneKey;
            request.m_stValue.m_stStudySkill.m_ucStep = progress;
        } else if (Macros.OPERATE_SKILL_VALID == op) {
            // 启用或不启用技能
            request.m_stValue.m_stValidSkill.m_iSkillID = skillID;
            request.m_stValue.m_stValidSkill.m_ucForbidden = validFlag;
        }
        request.m_ucOperate = op;

        return msg;
    }

    static getSetSkillRequest(skillID: number, pos: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getOperateSkill_Request();

        let request: Protocol.OperateSkill_Request = msg.m_msgBody as Protocol.OperateSkill_Request;
        request.m_ucOperate = Macros.OPERATE_SKILL_SET_FETTER;
        request.m_stValue.m_stSetFetterSkill.m_iSkillID = skillID;
        request.m_stValue.m_stSetFetterSkill.m_ucPos = pos;

        return msg;
    }

    /**拉取成就数据请求*/
    static getAchiGetRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getAchiGet_Request();
        let achiGet_Request: Protocol.AchiGet_Request = msg.m_msgBody as Protocol.AchiGet_Request;
        return msg;
    }

    /**
		 * 获取活跃度操作协议。
		 * @param type
		 * @param param
		 * @return
		 *
		 */
    static getHydOperateRequest(type: number, param: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getHYDOperate_Request();
        let request: Protocol.HYDOperate_Request = msg.m_msgBody as Protocol.HYDOperate_Request;
        request.m_usType = type;
        request.m_stValue.m_ucGetGiftIndex = param;
        request.m_stValue.m_ucList = param;
        request.m_stValue.m_ucGetDayGiftId = param;
        return msg;
    }

    static getRenameRequest(name: string): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getModifyRole_Account_Request();
        let body = msg.m_msgBody as Protocol.ModifyRole_Account_Request;
        body.m_cModifyType = Macros.ROLE_INFO_MODIFY_TYPE_NAME_CARD;
        body.m_cGender = G.DataMgr.heroData.gender;
        body.m_cProfession = G.DataMgr.heroData.profession;
        body.m_stRoleID.m_uiUin = G.DataMgr.heroData.roleID.m_uiUin;
        body.m_stRoleID.m_uiSeq = G.DataMgr.heroData.roleID.m_uiSeq;
        body.m_szNickName = name;
        return msg;
    }

    /**
	* 拉取封神台信息请求
	* @return
	*
	*/
    static getOpenPvpPanelRequest(type: number = 0, macros: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getPVPRank_CS_Request();

        let request: Protocol.PVPRank_CS_Request = msg.m_msgBody as Protocol.PVPRank_CS_Request;
        if (type == Macros.PVPRANK_MOBAI) {
            request.m_usType = Macros.PVPRANK_MOBAI;
            request.m_stValue.m_ucMoBaiRank = macros;
        } else {
            request.m_usType = Macros.PVPRANK_OPEN_PANEL;
            request.m_stValue.m_stCSOpenPanelReq.m_ucType = type;
        }
        return msg;
    }
    /**问卷调查领取请求 */
    static getOpenWenJuanRequest(answerList: Protocol.SurveyAnswer[], count: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getSurvey_Request();
        let request: Protocol.Survey_Request = msg.m_msgBody as Protocol.Survey_Request;
        request.m_astAnswerList = answerList;
        request.m_ucCount = count;
        return msg;
    }

    /**
	* 领取排行奖励请求
	* @return
	*
	*/
    static getRankRewardRequest(type: number = 0, id: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getPVPRank_CS_Request();
        let request: Protocol.PVPRank_CS_Request = msg.m_msgBody as Protocol.PVPRank_CS_Request;
        if (type == Macros.PVPRANK_GET_MAXRANK_REWARD) {
            request.m_usType = Macros.PVPRANK_GET_MAXRANK_REWARD;
            request.m_stValue.m_ucGetMaxRankRewardReq = id;
        } else {
            request.m_usType = Macros.PVPRANK_GET_REWARD;
        }
        return msg;
    }

    /**
     * 宝物相关协议
     * @param id
     * @param type
     * @return
     *
     */
    static getFaqiRequest(id: number, type: number, zhuFuValue: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getFaQiOperate_Request();
        let request: Protocol.FaQiOperate_Request = msg.m_msgBody as Protocol.FaQiOperate_Request;
        request.m_iID = id;
        request.m_iType = type;
        request.m_uiParam = zhuFuValue;
        return msg;
    }

    /**
     * 守护神相关协议
     * @param id
     * @param type
     * @return
     *
     */
    static getShieldGodRequest(id: number, type: number): Protocol.FyMsg {
        let msg = SendMsgUtil.getShieldGodOperate_Request();
        let request = msg.m_msgBody as Protocol.ShieldGodOperate_Request;
        request.m_iID = id;
        request.m_iType = type;
        return msg;
    }


    /**
     * 星环面板请求
     * @return
     *
     */
    static getOpenMagicCubePannelRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getOpenMagicCubePannel_Request();
        let request: Protocol.OpenMagicCubePannel_Request = msg.m_msgBody as Protocol.OpenMagicCubePannel_Request;
        return msg;
    }

    /**
     * 星环升级请求
     * @return
     *
     */
    static getMagicCubeLevelUpRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getMagicCubeLevelUp_Request();
        let request: Protocol.MagicCubeLevelUp_Request = msg.m_msgBody as Protocol.MagicCubeLevelUp_Request;
        return msg;
    }

    /**
	* 选中某人pk
	* @param target 目标，名次
	* @param pet 散仙序号
	* @return
	*
	*/
    static getPvpStartPkRequest(target: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getPVPRank_CS_Request();

        let request: Protocol.PVPRank_CS_Request = msg.m_msgBody as Protocol.PVPRank_CS_Request;
        request.m_usType = Macros.PVPRANK_START_PK;
        request.m_stValue.m_stCSStartPKReq.m_usRankVal = target;

        return msg;
    }

    static getPvpBuyTimeRequest(buyCount: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getPVPRank_CS_Request();

        let request: Protocol.PVPRank_CS_Request = msg.m_msgBody as Protocol.PVPRank_CS_Request;
        request.m_usType = Macros.PVPRANK_BUY_TIMES;
        request.m_stValue.m_ucBuyTimesReq = buyCount;
        return msg;
    }


    /**
	* 法宝升级
	* @param id
	* @return
	*
	*/
    static getFabaoLevelUpRequest(id: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getFaBaoLevelUp_Request();
        let request: Protocol.FaBaoLevelUp_Request = msg.m_msgBody as Protocol.FaBaoLevelUp_Request;
        request.m_iID = id;
        return msg;
    }

    static getFabaoXQRequest(id: number, pos: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getFaBaoXiangQian_Request();
        let request: Protocol.FaBaoXiangQian_Request = msg.m_msgBody as Protocol.FaBaoXiangQian_Request;
        request.m_iID = id;
        request.m_iXQPos = pos;
        return msg;
    }

    static getFabaoHHRequest(id: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getFaBaoShow_Request();
        let request: Protocol.FaBaoShow_Request = msg.m_msgBody as Protocol.FaBaoShow_Request;
        request.m_iID = id;
        return msg;
    }

    /**
    * 法宝拉取
    * @return
    *
    */
    static getFabaoPanelRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getFaBaoPannel_Request();
        let request: Protocol.FaBaoPannel_Request = msg.m_msgBody as Protocol.FaBaoPannel_Request;
        return msg;
    }

    /**
    * 法宝激活
    * @param id 法宝id
    * @param pos 位置 0，1，2，3对应位置 -1对应激活
    */
    static getActiveFabaoRequest(id: number, pos: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getFaBaoActive_Request();
        let request: Protocol.FaBaoActive_Request = msg.m_msgBody as Protocol.FaBaoActive_Request;
        request.m_iID = id;
        request.m_iXQPos = pos;
        return msg;
    }

    /**
     * 法宝打开
     */
    static getFabaoOpenPanel() {
        let msg: Protocol.FyMsg = SendMsgUtil.getFaBaoPannel_Request();
        let request: Protocol.FaBaoPannel_Request = msg.m_msgBody as Protocol.FaBaoPannel_Request;
        request.m_ucTag = Macros.MsgID_FaBaoPannel_Response;
        return msg;
    }


    /**
    * 圣光请求
    * @paramtype
    * @return
    */
    static getJiuXingRequest(type: number, zhuFuValue: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getJiuXing_Request();
        let request: Protocol.JiuXing_Request = msg.m_msgBody as Protocol.JiuXing_Request;
        request.m_usType = type;
        request.m_stValue.m_uiFillReq = zhuFuValue;
        return msg;
    }


    /**
     * 取得vip操作的请求
     * @param type
     * @return
     *
     */
    static getVipOperateRequest(type: number, value: number = 0, level: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getVIPOperate_Request();

        let request: Protocol.VIPOperate_Request = msg.m_msgBody as Protocol.VIPOperate_Request;

        request.m_usType = type;
        request.m_stValue.m_iListData = value;
        request.m_stValue.m_iGetGiftType = value;
        request.m_stValue.m_ucGetVipLevel = value;
        request.m_stValue.m_iMonthBuyLevel = value;
        request.m_stValue.m_iListMonthData = value;
        request.m_stValue.m_ucSpecialPriBuy = value;
        request.m_stValue.m_stGetMonthGiftReq.m_iLevel = level;
        request.m_stValue.m_stGetMonthGiftReq.m_iType = value;
        request.m_stValue.m_iBuyPinstance = value;

        return msg;
    }

    /**
    * 是否获得SVIP
    * @param type
    * @return
    *
    */

    static getOpenSuperVIP_REQUEST(uiTag: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getOpenSuperVIP_Request();
        let request: Protocol.OpenSuperVIP_Request = msg.m_msgBody as Protocol.OpenSuperVIP_Request;
        request.m_uiTag = uiTag;
        return msg;
    }



    /**
	* 幻化培养
	* @param type
	* @param image
	* @return
	*
	*/
    static getHuanHuaPyRequest(type: number, subType: number, image: number): Protocol.FyMsg {

        let msg: Protocol.FyMsg = SendMsgUtil.getDress_Request();
        let request: Protocol.Dress_Request = msg.m_msgBody as Protocol.Dress_Request;
        request.m_usType = Macros.DRESS_TRAIN;
        request.m_stValue.m_stTrainReq.m_ucType = type;
        request.m_stValue.m_stTrainReq.m_ucSubType = subType;
        request.m_stValue.m_stTrainReq.m_uiImageID = image;
        return msg;
    }

    /**
* 幻化飞升
* @param type
* @param image
* @return
*
*/
    static getHuanHuaFSRequest(subType: number, image: number): Protocol.FyMsg {

        let msg: Protocol.FyMsg = SendMsgUtil.getHeroSub_ImageLevel_Request();
        let request: Protocol.HeroSub_ImageLevel_Request = msg.m_msgBody as Protocol.HeroSub_ImageLevel_Request;
        request.m_ucType = subType;
        request.m_uiImageID = image;
        return msg;
    }

    /**
  * 时装强化
  * @param type
  * @param image
  * @return
  *
  */
    static getShiZhuangQHRequest(type: number, image: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getDress_Request();
        let request: Protocol.Dress_Request = msg.m_msgBody as Protocol.Dress_Request;
        request.m_usType = type;
        request.m_stValue.m_uiStrengID = image;
        return msg;
    }


    /**
	* 附近队伍信息
	* @return
	*
	*/
    static getTeamInfoRequest(): Protocol.FyMsg {
        return SendMsgUtil.getListNearTeamInfo_Request();
    }

    /**
	* 时装化形请求
	* @param colorIndex
	* @param imageID
	* @return
	*
	*/
    static getSzhxRequest(colorIndex: number, imageID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getDress_Request();
        let request: Protocol.Dress_Request = msg.m_msgBody as Protocol.Dress_Request;
        request.m_usType = Macros.DRESS_IMAGE_CHANGE;
        request.m_stValue.m_stChangeReq.m_ucColorIndex = colorIndex;
        request.m_stValue.m_stChangeReq.m_uiImageID = imageID;
        return msg;
    }

    /**
    * 拉取时装想象列表
    * @return
    *
    */
    static getSzListRequest(): Protocol.FyMsg {

        let msg: Protocol.FyMsg = SendMsgUtil.getDress_Request();
        let request: Protocol.Dress_Request = msg.m_msgBody as Protocol.Dress_Request;
        request.m_usType = Macros.DRESS_IMAGE_LIST;
        return msg;
    }


    /**
     * 请求修改系统设置
     * @param settingList
     * @return
     *
     */
    static getSystemSettingChangeRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getUpdateSystemSetting_Request();
        let request: Protocol.UpdateSystemSetting_Request = msg.m_msgBody as Protocol.UpdateSystemSetting_Request;
        request.m_stSystemSettingList.m_ucNumber = G.DataMgr.systemData.systemSettingList.length;
        request.m_stSystemSettingList.m_ucValueList = G.DataMgr.systemData.systemSettingList;
        request.m_stSystemSettingList.m_szCacheValue = '';
        return msg;
    }

    /**
    * 祈福相关请求
	* @param type
	* @param id
	* @return
	*
	*/
    static getQifuRequest(type: number, id: number = 0): Protocol.FyMsg {

        let msg: Protocol.FyMsg = SendMsgUtil.getQiFu_Request();
        let request: Protocol.QiFu_Request = msg.m_msgBody as Protocol.QiFu_Request;
        request.m_usType = type;
        request.m_stValue.m_uiQiFuID = id;
        return msg;

    }

    /**
     * 获取资源找回面板信息
     * @return
     *
     */
    static getTimeBoxPannelRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getZYZHPannel_Request();

        let request: Protocol.ZYZHPannel_Request = msg.m_msgBody as Protocol.ZYZHPannel_Request;
        return msg;
    }

    /**
	*  领取资源找回奖励
	* @param isYuanBao
	* @param id
	* @return
	*
	*/
    static getTimeBoxRewardRequest(isYuanBao: number, id: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getZYZHReward_Request();

        let request: Protocol.ZYZHReward_Request = msg.m_msgBody as Protocol.ZYZHReward_Request;
        request.m_bYuanBao = isYuanBao;
        request.m_iID = id;

        return msg;
    }

    /**
	* 发送cdkey兑换的请求
	* @return
	*/
    static getCDKeyExchangeRequest(type: number, cdkey: string): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getChangeCDKey_Request();

        let request: Protocol.ChangeCDKey_Request = msg.m_msgBody as Protocol.ChangeCDKey_Request;
        request.m_iType = type;
        request.m_szCDKey = cdkey;
        return msg;
    }

    /**
	* 获取角色等级礼包
	* @return
	*
	*/
    static getLevelGiftRequest(curLevelGift: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGetLevelBag_Request();
        let request: Protocol.GetLevelBag_Request = msg.m_msgBody as Protocol.GetLevelBag_Request;

        request.m_usLevel = curLevelGift;

        return msg;
    }
    /**
    *请求排行榜信息
    * @param type
    * @param subType
    * @return
    *
    */
    /**
      *请求排行榜信息
      * @param type
      * @param subType
      * @return
      *
      */
    static getRankInfoRequest(type: number, page: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getRefreshRankInfo_Request();
        let request: Protocol.RefreshRankInfo_Request = msg.m_msgBody as Protocol.RefreshRankInfo_Request;
        request.m_ucRankType = type;
        request.m_ucCurPage = page;
        return msg;
    }

    /**
    * 开服活动相关协议
    * @param type
    * @param value
    * @return
    *
    */
    static getMonthCardRequest(type: number, cardType: number = 0): Protocol.FyMsg {

        let msg: Protocol.FyMsg = SendMsgUtil.getMonthCard_Request();
        let request: Protocol.MonthCard_Request = msg.m_msgBody as Protocol.MonthCard_Request;
        request.m_usType = type;
        request.m_stValue.m_ucBuyType = cardType;
        request.m_stValue.m_ucOpenMCPanel = cardType;
        request.m_stValue.m_ucType = cardType;
        request.m_stValue.m_ucTypeByDaily = cardType;
        return msg;
    }



    /**
     * 取得保存自动挂机设置的请求。
     * @param roleAutoDrug 是否开启角色自动嗑药。
     * @param autoPick 是否开启自动拾取。
     * @param roleAutoRevive 是否开启角色自动原地复活。
     * @param roleHpDrugID 角色自动嗑药回血药品ID。
     * @param roleHpRate 角色自动嗑药血量阀值。
     * @param roleMpDrugID 角色自动嗑药回蓝药品ID。
     * @param roleMpRate 角色自动嗑药法力阀值。
     * @param skillIDList 自动释放的技能ID列表。
     * @return 保存自动挂机设置的请求。
     *
     */
    static getSaveDeputySettingRequst(isDefault: boolean, isTeamEnabled: boolean, isRoleReviveEnabled: boolean, isAutoUseNuqi: boolean, isAutoUseWy: boolean, isAutoPickEnabled: boolean, isAutoBuyMedicine: boolean, isFixedPoint: boolean, skillIDList: number[], m_stAutoAnalyze: Protocol.AutoAnalyze): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getAutoBattleSetting_Request();

        let request: Protocol.AutoBattleSetting_Request = msg.m_msgBody as Protocol.AutoBattleSetting_Request;
        let setting: Protocol.AutoBattleSetting = request.m_stAutoBattleSetting;

        setting.m_ucDefaultFlag = isDefault ? 0 : 1;

        if (null == skillIDList) {
            setting.m_stAutoBattleSkill.m_ucValue.length = 0;
            setting.m_stAutoBattleSkill.m_ucNumber = 0;
        }
        else {
            setting.m_stAutoBattleSkill.m_ucValue = skillIDList;
            setting.m_stAutoBattleSkill.m_ucNumber = skillIDList.length;
        }

        let funcFlag: number = 0;
        if (isTeamEnabled) {
            // 自动组队
            funcFlag |= Macros.GJ_AUTO_ADD_TEAM;
        }
        if (isRoleReviveEnabled) {
            // 自动复活
            funcFlag |= Macros.GJ_AUTO_ROLE_RELIVE;
        }
        if (isAutoUseNuqi) {
            // 自动使用怒气
            funcFlag |= Macros.GJ_AUTO_NUQI_SKILL;
        }
        if (isAutoPickEnabled) {
            // 自动拾取
            funcFlag |= Macros.GJ_AUTO_PICKUP_SETTING;
        }
        if (isAutoBuyMedicine) {
            // 自动购买使用生命包
            funcFlag |= Macros.GJ_AUTO_BUY_HP;
        }

        if (isAutoUseWy) {
            funcFlag |= Macros.GJ_AUTO_BEAUTY_SKILL;
        }

        if (isFixedPoint) {
            funcFlag |= Macros.GJ_AUTO_HUANG_UP;
        }

        setting.m_uiBattleFunctionList = funcFlag;

        setting.m_stAutoAnalyze = m_stAutoAnalyze;

        // 已关注boss
        G.DataMgr.deputySetting.setBossAttention(setting.m_stBossAttention);

        return msg;
    }

    /**
     * 视野显示对象屏蔽请求
     * 该协议没有响应，后台通过标签来判断在某种隐藏模式下可以不下发部分协议
     * 优化协议通讯
     * @param hideLevel 按位隐藏
     * @return
     *
     */
    static getHideSightRoleRequset(hideLevel: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getHideSightRole_Request();

        let request: Protocol.HideSightRole_Request = msg.m_msgBody as Protocol.HideSightRole_Request;
        request.m_iHideLevel = hideLevel;

        return msg;
    }

    /**
    * 收取全部附件请求
    * @param roleID
    * @return
    *
    */
    static getMailPickAccessoryRequestMsg(mailID: number): Protocol.FyMsg {

        let msg: Protocol.FyMsg = SendMsgUtil.getMail_PickAccessory_Request();
        let request: Protocol.Mail_PickAccessory_Request = msg.m_msgBody as Protocol.Mail_PickAccessory_Request;
        request.m_stRoleID = G.DataMgr.gameParas.roleID;
        request.m_uiMailID = mailID;
        return msg;
    }

    /**
    * 拉取一封邮件内容请求
    * @param roleID
    * @return
    *
    */
    static getMailFetchMailRequestMsg(mailID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getMail_FetchMail_Request();
        let request: Protocol.Mail_FetchMail_Request = msg.m_msgBody as Protocol.Mail_FetchMail_Request;
        request.m_stRoleID = G.DataMgr.gameParas.roleID;
        request.m_uiMailID = mailID;
        return msg;
    }


    /**
    * 拉取邮件列表请求
    * @param roleID
    */
    static getMailFetchListRequestMsg(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getMail_FetchList_Request();
        let request: Protocol.Mail_FetchList_Request = msg.m_msgBody as Protocol.Mail_FetchList_Request;
        request.m_stRoleID = uts.deepcopy(G.DataMgr.heroData.roleID, request.m_stRoleID);
        return msg;
    }


    /**
    * 天宫宝镜请求。
    * @param type 请求类型。
    * @param value 请求数据。
    * @return
    *
    */
    static getSkyLotteryRequest(operate: number, type: number, value: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getSkyLottery_Request();
        let request: Protocol.SkyLottery_Request = msg.m_msgBody as Protocol.SkyLottery_Request;
        request.m_ucType = operate;
        request.m_ucLotterType = type;
        request.m_stValue.m_usLotteryNum = value;
        request.m_stValue.m_ucListType = value;
        request.m_stValue.m_iNeedCount = value;
        return msg;
    }

    static getSkyLotteryOpenPanelRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getSkyLottery_Request();
        let request: Protocol.SkyLottery_Request = msg.m_msgBody as Protocol.SkyLottery_Request;
        request.m_ucType = Macros.SKYLOTTERY_OPEN_PANEL;
        request.m_ucLotterType = type;
        return msg;
    }

    /**
     * 跨服活动同步数据请求。
     * @param actID
     * @param toWorldID
     * @return
     *
     */
    static getCrossSynRoleCsRequest(actID: number, para: number = 0): Protocol.FyMsg {
        uts.log('send CROSS_SYN_ROLE_CS');
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_SYN_ROLE_CS;
        request.m_stValue.m_stCSSynRoleCSReq.m_uiActID = actID;
        request.m_stValue.m_stCSSynRoleCSReq.m_uiExpandPara = para;

        return msg;
    }

    /**
    * 开服活动相关协议
    * @param type
    * @param value
    * @return
    *
    */
    static getKfhdRequest(type: number, parm: number = 0, parm1: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getKFActInfo_Request();
        let request: Protocol.KFActInfo_Request = msg.m_msgBody as Protocol.KFActInfo_Request;
        request.m_usType = type;
        request.m_stValue.m_ucBossType = parm;
        request.m_stValue.m_uiGetID = parm;
        request.m_stValue.m_ucGetBit = parm;
        request.m_stValue.m_iStageDayId = parm;
        request.m_stValue.m_ucKFXFFLGet = parm;
        request.m_stValue.m_uc7DayLJCZGet = parm;
        request.m_stValue.m_uiKFLCFLGet = parm;
        request.m_stValue.m_ucKFXFLBGet = parm;
        request.m_stValue.m_ucSummonType = parm;
        request.m_stValue.m_stHappyChargeRebateReq.m_uiRebateID = parm;
        request.m_stValue.m_stHappyChargeRebateReq.m_uiCharge = parm1;
        request.m_stValue.m_usSummonWarn = parm;
        //request.m_stValue.m_stHappyChargeVIPPanelReq = parm;
        //request.m_stValue.m_stHappyChargeVIPRewardReq = parm;
        request.m_stValue.m_stHappyChargeRebateReq.m_uiRebateID = parm;
        request.m_stValue.m_stHappyChargeRebateReq.m_uiCharge = parm1;
        request.m_stValue.m_ucZGLBGetReq = parm;
        return msg;
    }

    /**
     * 开服首充团购领取
     * @param rewardID
     * @return
     *
     */
    static getKFSCTGGetRewardRequest(rewardID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getKFSCTGGetReward_Request();
        let request: Protocol.KFSCTGGetReward_Request = msg.m_msgBody as Protocol.KFSCTGGetReward_Request;

        request.m_ucRewardID = rewardID;

        return msg;
    }

    /**
    * 开服首充团购获取信息
    * @return
    *
    */
    static getKFSCTGGetInfoRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getKFSCTGGetInfo_Request();
        let request: Protocol.KFSCTGGetInfo_Request = msg.m_msgBody as Protocol.KFSCTGGetInfo_Request;

        return msg;
    }

    /**
    * 获取跨服宗门争霸战
    * @param type	请求类型
    * @return
    *
    */
    static getGuildCrossPvpCSRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CROSSPVP_CS_Request();
        let request: Protocol.Guild_CROSSPVP_CS_Request = msg.m_msgBody as Protocol.Guild_CROSSPVP_CS_Request;
        request.m_usType = type;
        return msg;
    }
    /**
     * 打开魔化战争面板
     */
    static getMohuaZhanzhengOpenPanelRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getMHZZ_Pannel_Request();
        let requset: Protocol.MHZZ_Pannel_Request = msg.m_msgBody as Protocol.MHZZ_Pannel_Request;
        return msg;
    }

    /**
     * 获取宗门争霸战
     * @param type	请求类型
     * @return
     *
     */
    static getGuildPvpDataRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_PVP_CS_Request();
        let request: Protocol.Guild_PVP_CS_Request = msg.m_msgBody as Protocol.Guild_PVP_CS_Request;
        request.m_usType = type;
        return msg;
    }


    /**
    *
    * @param roleID
    * @param classID 类别, 是一个大类和子类组合的数字
    * @param pageNum 页号
    * @param SortType 排序类型
    * @param SortOrder 排序顺序
    * @param npcId
    * @return
    *
    */
    static getPPStoreSortRequestMsg(classID: number, pageNum: number, SortType: number, SortOrder: number, keyword: string, MinLevel: number, MaxLevel: number, Color: number, npcId: number): Protocol.FyMsg {

        let msg: Protocol.FyMsg = SendMsgUtil.getPPStoreSort_Request();

        let request: Protocol.PPStoreSort_Request = msg.m_msgBody as Protocol.PPStoreSort_Request;
        request.m_iClassID = classID;
        request.m_iPageNo = pageNum;
        request.m_iSortType = SortType;
        request.m_ucSortOrder = SortOrder;
        request.m_szName = keyword;
        request.m_iMinLevel = MinLevel;
        request.m_iMaxLevel = MaxLevel;
        request.m_iColor = Color;
        request.m_iNPCID = npcId;

        return msg;
    }

    /**
     * 请求我的交易所物品列表（roleId：自动添加）
     * @param pageNum 页号
     * @param npcId
     * @return
     *
     */
    static getPPStoreDispMyRequestMsg(pageNum: number, npcId: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getPPStoreDispMy_Request();

        let request: Protocol.PPStoreDispMy_Request = msg.m_msgBody as Protocol.PPStoreDispMy_Request;
        request.m_stRoleID = G.DataMgr.gameParas.roleID;
        request.m_iPageNo = pageNum;
        request.m_iNPCID = npcId;

        return msg;
    }

    /**
     *
     * @param roleID
     * @param PSBNO 取消的单号
     * @param pageNum 页号
     * @param npcId
     * @return
     *
     */
    static getPPStoreCancelMyRequestMsg(PSBNO: Protocol.PSDID, pageNum: number, npcId: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getPPStoreCancelMy_Request();

        let request: Protocol.PPStoreCancelMy_Request = msg.m_msgBody as Protocol.PPStoreCancelMy_Request;
        request.m_stRoleID = G.DataMgr.gameParas.roleID;
        request.m_stPSBID = PSBNO;
        request.m_iPageNo = pageNum;
        request.m_iNPCID = npcId;

        return msg;
    }

    /**
    * 开始交易所物品
    * @param thingID		卖出物品
    * @param position		物品位置
    * @param num			数量
    * @param eachPrice		卖出单价
    * @param expireTime	超时时间(小时)
    * @param npcId			NPC ID
    * @return
    *
    */
    static getPPStoreSell_RequestMsg(thingID: number, position: number, num: number, eachPrice: number, expireTime: number, npcId: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getPPStoreSell_Request();

        let request: Protocol.PPStoreSell_Request = msg.m_msgBody as Protocol.PPStoreSell_Request;
        request.m_stSellThing.m_iThingID = thingID;
        request.m_stSellThing.m_iNumber = num;
        request.m_stSellThing.m_usPosition = position;
        request.m_iEachPrice = eachPrice;
        request.m_iExpireTime = expireTime;
        request.m_iNPCID = npcId;

        return msg;
    }

    /**
    *  获得买入请求 协议消息
    * @param roleID
    * @param psdid : 单号
    * @param num : 物品数量
    * @return
    *
    */
    static getPPStoreBuy_RequestMsg(psdid: Protocol.PSDID, num: number, npcId: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getPPStoreBuy_Request();

        let request: Protocol.PPStoreBuy_Request = msg.m_msgBody as Protocol.PPStoreBuy_Request;
        request.m_stPSDID = psdid;
        request.m_iNumber = num;
        request.m_iNPCID = npcId;

        return msg;
    }

    static getPPStoreGetAllThingNumRequestMsg(classID: number, roleId: Protocol.RoleID): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getPPStoreGetAllThingNum_Request();
        let request: Protocol.PPStoreGetAllThingNum_Request = msg.m_msgBody as Protocol.PPStoreGetAllThingNum_Request;
        request.m_iClassID = classID;
        request.m_stRoleID = roleId;
        return msg;
    }

    /**
    * 拉取首充礼包数据请求
    * @param level
    * @return
    *
    */
    static getSCGetInfoRequest(flag: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getSCGetInfoRequest();

        let request: Protocol.SCGetInfoRequest = msg.m_msgBody as Protocol.SCGetInfoRequest;
        request.m_ucFlag = flag;

        return msg;
    }

    /**
    * 领取首充礼包请求
    * @param flag
    * @return
    *
    */
    static getSCGetRewardRequest(flag: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getSCGetRewardRequest();

        let request: Protocol.SCGetRewardRequest = msg.m_msgBody as Protocol.SCGetRewardRequest;
        request.m_ucGetBit = flag;

        return msg;
    }

    static getChangePkModeRequest(mode: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCSPKStatus_Request();
        let request: Protocol.CSPKStatus_Request = msg.m_msgBody as Protocol.CSPKStatus_Request;

        request.m_ucNewPKStaus = mode;

        return msg;
    }

    /**
	* 查看他人道具请求
	* @param roleId
	* @param guid
	* @return
	*
	*/
    static getThingPropertyByGuidRequest(roleId: Protocol.RoleID, guid: Protocol.ThingGUID): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGetThingProperty_Request();
        let request: Protocol.GetThingProperty_Request = msg.m_msgBody as Protocol.GetThingProperty_Request;
        request.m_stRoleID = roleId;
        request.m_stThingGUID = guid;
        return msg;
    }

    /**
	* 我要变强的数据请求
	* @return
	*
	*/
    static getWybqRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getWYBQ_Get_Request();
        let request: Protocol.WYBQ_Get_Request = msg.m_msgBody as Protocol.WYBQ_Get_Request;
        return msg;
    }

    /**
    * 开服全民冲榜领取
    * @param rewardID
    * @return
    *
    */
    static getKFQMCBGetRewardRequest(id: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getKFQMCBGetReward_Request();
        let request: Protocol.KFQMCBGetReward_Request = msg.m_msgBody as Protocol.KFQMCBGetReward_Request;
        request.m_iID = id;
        return msg;
    }

    /**
    * 开服全民冲榜获取信息
    * @return
    *
    */
    static getKFQMCBGetInfoRequest(day: number, type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getKFQMCBGetInfo_Request();
        let request: Protocol.KFQMCBGetInfo_Request = msg.m_msgBody as Protocol.KFQMCBGetInfo_Request;
        request.m_ucDay = day;
        request.m_ucRankType = type;
        return msg;
    }

    /**获取开服榜玩家信息*/
    static getKFQMCBGetRankRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getKFQMCBGetRoleInfo_Request();
        let request: Protocol.KFQMCBGetRoleInfo_Request = msg.m_msgBody as Protocol.KFQMCBGetRoleInfo_Request;
        request.m_ucRankType = type;
        return msg;
    }

    /**
     * 熔炼装备
     * @return
     *
     */
    static getRonglianEquipRequest(things: Protocol.ContainerThing[]): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();
        let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
        request.m_usType = Macros.EQUIP_MELT;
        request.m_stContainerID.m_ucContainerType = Macros.CONTAINER_TYPE_ROLE_BAG;
        if (things != null) {
            request.m_stValue.m_stMeltList.m_iThingNumber = things.length;
            request.m_stValue.m_stMeltList.m_astThing = things;
        }
        else {
            request.m_stValue.m_stMeltList.m_iThingNumber = 0;
            request.m_stValue.m_stMeltList.m_astThing.length = 0;
        }

        return msg;
    }

    /**
	* 给自己加buff
	* @param	buffID
	* @return
	*/
    static getAddSpeedBuffRequest(buffID: number, quest: boolean, id: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getBuff_Request();
        let request: Protocol.Buff_Request = msg.m_msgBody as Protocol.Buff_Request;
        request.m_iBuffID = buffID;
        request.m_stRoleID = G.DataMgr.gameParas.roleID;
        request.m_ucOperate = Macros.BUFF_OPERATE_ADD;
        request.m_ucType = quest ? 1 : 0;
        request.m_iID = id;
        return msg;
    }


    static getZhufuDanRuquest(type: number, id: number, num: number = 1): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getHeroSub_Drug_Request();
        let request: Protocol.HeroSub_Drug_Request = msg.m_msgBody as Protocol.HeroSub_Drug_Request;

        request.m_ucType = id;
        request.m_ucDrugType = type;
        request.m_ucOpType = num > 1 ? 1 : 0; //操作类型，0 使用，1 批量使用'
        return msg;
    }

    /**
     * 宗门穿云箭
     * @return
     *
     */
    static getGuildCyjRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_SEND_ROLE_POSTION;

        return msg;
    }

    static getFirstOpenRequest(id: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getFirstOpen_Request();
        let request: Protocol.FirstOpen_Request = msg.m_msgBody as Protocol.FirstOpen_Request;
        request.m_uiFristOpenFunc = id;
        return msg;
    }

    /**
    *手动刷新随机物品列表
    * @param storeID
    * @param npcID
    * @return
    *
    */
    static getExchangeStoreRefreshRequest(storeID: number, npcID: number): Protocol.FyMsg {

        let msg: Protocol.FyMsg = SendMsgUtil.getNPCBehaviour_Request();
        let request: Protocol.NPCBehaviour_Request = msg.m_msgBody as Protocol.NPCBehaviour_Request;
        request.m_iStoreID = storeID;
        request.m_iNPCID = npcID;
        request.m_ucBehaviourID = Macros.NPC_BEHAVIOUR_RANDOM_RESET;
        return msg;
    }

    /**
    *获取随机物品列表
    * @param storeID 商店id
    * @param npcID npcId
    * @return
    *
    */
    static getExchangeStoreOpenRequest(storeID: number, npcID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getNPCBehaviour_Request();
        let request: Protocol.NPCBehaviour_Request = msg.m_msgBody as Protocol.NPCBehaviour_Request;
        request.m_iStoreID = storeID;
        request.m_iNPCID = npcID;
        request.m_ucBehaviourID = Macros.NPC_BEHAVIOUR_RANDOM_LIST;
        return msg;
    }

    /**
     * 回购协议
     * @param itemID 物品id
     * @param itemCount 物品数量
     */
    static getHuigouStoreRequest(itemID: number, itemCount: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getNPCBehaviour_Request();
        let request: Protocol.NPCBehaviour_Request = msg.m_msgBody as Protocol.NPCBehaviour_Request;
        request.m_iStoreID = EnumStoreID.HuiGou;
        request.m_stThing.m_iThingID = itemID;
        request.m_stThing.m_iNumber = itemCount;
        request.m_ucBehaviourID = Macros.NPC_BEHAVIOUR_STORE_BUYBACK;
        return msg;
    }

    /**
	* 获取跨服角斗场通用协议。
	* @return
	*
	*/
    static getCrossSingleCommonRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = type;

        return msg;
    }

    /**
     * 获取跨服角斗场拉取面板信息的协议。
     * @return
     *
     */
    static getCrossSingleJoinRequest(domain: string, ip: string, port: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_SINGLE_JOIN;
        request.m_stValue.m_stCSSingleJoinReq.m_szDomain = domain;
        request.m_stValue.m_stCSSingleJoinReq.m_szIP = ip;
        request.m_stValue.m_stCSSingleJoinReq.m_uiPinstanceID = 0;
        request.m_stValue.m_stCSSingleJoinReq.m_uiPort = port;

        return msg;
    }

    /**
     * 获取跨服3V3战场拉取面板信息的协议。
     * @return
     *
     */
    static getCross3v3JoinRequest(domain: string, ip: string, port: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_MULTI_JOIN;
        request.m_stValue.m_stCSMultiJoinReq.m_szDomain = domain;
        request.m_stValue.m_stCSMultiJoinReq.m_szIP = ip;
        request.m_stValue.m_stCSMultiJoinReq.m_uiPinstanceID = 0;
        request.m_stValue.m_stCSMultiJoinReq.m_uiPort = port;

        return msg;
    }

    static getCrossSingleNotifyRequest(type: number, left: number = -1, gameID: number = 0, money: number = 0, roleID: Protocol.RoleID = null): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;

        request.m_usType = type;

        switch (type) {
            case Macros.CROSS_SINGLE_FINAL_BET:
                request.m_stValue.m_stCSSingleFinalBet.m_bLeft = left;
                request.m_stValue.m_stCSSingleFinalBet.m_iGameID = gameID;
                request.m_stValue.m_stCSSingleFinalBet.m_iMoney = money;
                break;
            case Macros.CROSS_SINGLE_FINAL_BETGET:
                request.m_stValue.m_iCSSingleFinalBetGet = gameID;
                break;

            case Macros.CROSS_SINGLE_FINAL_WINBET:
                request.m_stValue.m_stCSSingleFinalWinBet.m_stRoleID = roleID;
                request.m_stValue.m_stCSSingleFinalWinBet.m_iMoney = money;
                break;
        }

        return msg;
    }

    static getWangHouJiangXiangRequest(type: number, value1: number, value2 = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = type;
        request.m_stValue.m_iWHJXPannelReq = value1;
        request.m_stValue.m_iWHJXBuyReq = value1;
        request.m_stValue.m_iWHJXApplyPKReq = value1;
        request.m_stValue.m_stHWJXApplyDealReq.m_iOpVal = value1;
        request.m_stValue.m_stHWJXApplyDealReq.m_iTypeID = value2;

        return msg;
    }

    static getZhenLongQiJuRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = type;

        return msg;
    }

    /**
 * 获取地图上的图标信息
 * @param sceneID
 * @return
 *
 */
    static getIconMonsterRequest(sceneID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCSGetIconMonsterRequest();
        let request: Protocol.CSGetIconMonsterRequest = msg.m_msgBody as Protocol.CSGetIconMonsterRequest;
        request.m_iSceneID = sceneID;
        return msg;
    }

    /**
     * 祝福进阶
     * @param thing
     * @return
     *
     */
    static getZhufuUpColorRequest(thing: ThingItemData): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getZFEquipUpColor_Request();
        let request: Protocol.ZFEquipUpColor_Request = msg.m_msgBody as Protocol.ZFEquipUpColor_Request;
        request.m_stContainerID.m_stOwnerID = G.DataMgr.gameParas.roleID;
        request.m_stContainerID.m_ucContainerType = thing.containerID;
        request.m_stContainerThing.m_iNumber = thing.data.m_iNumber;
        request.m_stContainerThing.m_iThingID = thing.data.m_iThingID;
        request.m_stContainerThing.m_usPosition = thing.data.m_usPosition;
        return msg;
    }


    /**
     * 神力系统
     * @param type
     * @return
     *
     */
    static getXueMaiRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCrazyBlood_Request();
        let request: Protocol.CrazyBlood_Request = msg.m_msgBody as Protocol.CrazyBlood_Request;
        request.m_usType = type;
        return msg;
    }

    /**
     * 宝典
     * @param type
     * @return
     *
     */
    static getBaoDianRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getBaoDian_Request();
        let request: Protocol.BaoDian_Request = msg.m_msgBody as Protocol.BaoDian_Request;
        return msg;
    }

    /**
		 *7日投资计划
		 * @param id
		 * @param type
		 * @return
		 * Macros
		 */
    static getSevenDayFundRequest(macrostype: number, ...args): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getSevenDayFund_Request();
        let request: Protocol.SevenDayFund_Request = msg.m_msgBody as Protocol.SevenDayFund_Request;
        request.m_usType = macrostype;

        if (macrostype == Macros.SEVEN_DAY_FUND_BUY) {
            request.m_stValue.m_ucBuyType = args[0];
        } else {
            request.m_stValue.m_stGetTReq.m_ucGetID = args[0];
            request.m_stValue.m_stGetTReq.m_ucType = args[1];
        }
        return msg;
    }


    /**
     * 开服每日目标领取
     * @param rewardID
     * @return
     *
     */
    static getKFMRMBGetRewardRequest(rewardID: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getKFMRMBGetReward_Request();
        let request: Protocol.KFMRMBGetReward_Request = msg.m_msgBody as Protocol.KFMRMBGetReward_Request;
        request.m_uiID = rewardID;
        return msg;
    }

    /**
     * 开服每日目标获取信息
     * @return
     *
     */
    static getKFMRMBGetInfoRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getKFMRMBGetInfo_Request();
        let request: Protocol.KFMRMBGetInfo_Request = msg.m_msgBody as Protocol.KFMRMBGetInfo_Request;
        return msg;
    }


    /**
     * 合服活动相关协议
     * @param	type
     * @param	parm
     * @return
     */
    static getHfhdRequest(type: number, parm: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getHFActInfo_Request();
        let request: Protocol.HFActInfo_Request = msg.m_msgBody as Protocol.HFActInfo_Request;
        request.m_usType = type;
        request.m_stValue.m_ucHFHDGetBit = parm;
        request.m_stValue.m_ucHFHDGetQTDLReward = parm;
        request.m_stValue.m_ucHFHDLJXFGetBit = parm;
        request.m_stValue.m_ucHFHDZCMReward = parm;
        request.m_stValue.m_ucHFHDBXYLBuyChest = parm;
        request.m_stValue.m_iHFHDBXYLShopExchange = parm;
        return msg;
    }


    /**
    * 对幸运值的操作
    * @param	type
    * @param	operate
    * @return
    */
    static getHeroSubLuckyRequest(type: number, operate: number, zhuFuValue: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getHeroSub_Lucky_Request();
        let request: Protocol.HeroSub_Lucky_Request = msg.m_msgBody as Protocol.HeroSub_Lucky_Request;
        request.m_ucType = type;
        request.m_ucOperate = operate;
        request.m_uiParam = zhuFuValue;
        return msg;
    }

    /**
    * 对星环祝福值的操作
    * @param	type
    * @param	operate
    * @return
    */
    static getMagicCubeLuckyRequest(type: number, zhuFuValue: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getMagicCubePannel_Request();
        let request: Protocol.MagicCubePannel_Request = msg.m_msgBody as Protocol.MagicCubePannel_Request;
        request.m_usType = type;
        request.m_stValue.m_ucKeep = 0;
        request.m_stValue.m_uiFill = zhuFuValue;
        return msg;
    }

    /**
    * 对反馈意见的操作
    * @param	type
    * @param	operate
    * @return
    */
    static getAddOssAdvanceRequest(type: number, des: string): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCSAddGMQA_Request();
        let request: Protocol.CSAddGMQA_Request = msg.m_msgBody as Protocol.CSAddGMQA_Request;
        request.m_shType = type;
        request.m_szQuestion = des;
        return msg;
    }


    /**
    * 请求玩家反馈list
    * @param	type
    * @param	operate
    * @return
    */
    static getOssGMList() {
        let msg: Protocol.FyMsg = SendMsgUtil.getCSListGMQA_Request();
        let request: Protocol.CSListGMQA_Request = msg.m_msgBody as Protocol.CSListGMQA_Request;
        return msg;
    }

    /**
    * 血战黑洞打开面板
    * @param	type
    * @param	operate
    * @return
    */
    static getXZFMRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getXZFM_Request();
        let request: Protocol.XZFM_Request = msg.m_msgBody as Protocol.XZFM_Request;
        request.m_ucType = type;
        // request.m_stValue.m_ucPanel = type;
        return msg;
    }

    static getShenShouRequest(opType: number, id: number, position: number, param = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getShenShouOperate_Request();
        let request: Protocol.ShenShouOperate_Request = msg.m_msgBody as Protocol.ShenShouOperate_Request;
        request.m_iType = opType;
        request.m_iID = id;
        request.m_ucPosition = position;
        request.m_uiParam = param;
        return msg;
    }

    static getSxPkRankRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_COLOSSEUM_RANK;
        request.m_stValue.m_stCSColosseumStartPKReq.m_uiPinstanceID = Macros.PINSTANCE_ID_COLOSSEUM;
        return msg;
    }

    static getSxPkRewardRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_COLOSSEUM_REWARD;
        request.m_stValue.m_stCSColosseumStartPKReq.m_uiPinstanceID = Macros.PINSTANCE_ID_COLOSSEUM;
        return msg;
    }

    static getSxPkPanelRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_COLOSSEUM_PANEL;
        request.m_stValue.m_stCSColosseumStartPKReq.m_uiPinstanceID = Macros.PINSTANCE_ID_COLOSSEUM;
        return msg;
    }

    static getSxPkStartRequest(roleId: Protocol.RoleID, type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_COLOSSEUM_START_PK;
        request.m_stValue.m_stCSColosseumStartPKReq.m_uiPinstanceID = Macros.PINSTANCE_ID_COLOSSEUM;
        request.m_stValue.m_stCSColosseumStartPKReq.m_stRoleId = roleId;
        request.m_stValue.m_stCSColosseumStartPKReq.m_ucType = type;
        return msg;
    }

    /**
     * 伙伴光印
     * @param type  BEAUTY_ZT_LIST/BEAUTY_ZT_ACT/BEAUTY_ZT_UPLV
     */
    static getPetZhenTuRequest(type: number, parm: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getBeautyZhenTu_Request();
        let request: Protocol.BeautyZhenTu_Request = msg.m_msgBody as Protocol.BeautyZhenTu_Request;
        request.m_iType = type;
        request.m_ucID = parm;
        return msg;
    }


	/**
	* 结婚的相关协议
	* @param type 操作类型
	* @param role 目标角色
	* @param para 求婚档次，鲜花档次之类
	* @return
	*
	*/
    static getMarryRequest(type: number, role: Protocol.RoleID = null, para: number = 0, num: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getMarriage_Request();
        let request: Protocol.Marriage_Request = msg.m_msgBody as Protocol.Marriage_Request;
        request.m_usType = type;
        if (role != null) {
            request.m_stRoleID = role;
        }
        if (type == Macros.HY_APPLY_MARRY) {
            request.m_stValue.m_ucAppleyMarryLevel = para;
        }
        else if (type == Macros.HY_DEAL_MARRY) {
            request.m_stValue.m_stDealMarryReq = para;
        }
        else if (type == Macros.HY_DEAL_DIVORCE) {
            request.m_stValue.m_stDealDivorceReq = para;
        }
        else if (type == Macros.HY_GIVEFLOWER) {
            request.m_stValue.m_stGiveFlower.m_iThingID = para;
            request.m_stValue.m_stGiveFlower.m_iNumber = num;
            request.m_stValue.m_stGiveFlower.m_usPosition = Macros.UNDEFINED_CONTAINER_POSITION;
        }
        return msg;
    }

    /**
		 *拉取宗门探险数据
		 * @return
		 *
		 */
    static getGuildExploreOpenRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_TREASURE_HUNT_GET_INFO;

        return msg;
    }
    /**
     *宗门探险事件操作
     * @param diff
     * @return
     *
     */
    static getGuildExploreEventRequest(eventType: number, id: number = 1, diff: number = 0, ...args): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_TREASURE_HUNT_EVENT_OP;
        let eventReq = request.m_stValue.m_stGuildTreasureHuntEventOpRequest;
        eventReq.m_ucOpType = eventType;
        eventReq.m_uiEventID = id;
        eventReq.m_stValue.m_ucDifficulty = diff;
        eventReq.m_stValue.m_ucSelectNo = args[0];
        eventReq.m_stValue.m_stDonation.m_ucType = args[0];
        eventReq.m_stValue.m_stDonation.m_uiNum = args[1];
        eventReq.m_stValue.m_stBossPK.m_uiPinstanceID = Macros.PINSTANCE_ID_GUILD_TREASURE_HUNT;
        eventReq.m_stValue.m_stBossPK.m_uiMonsterID = args[0];

        return msg;
    }
    /**
     *宗门探险领奖
     * @param type
     * @return
     *
     */
    static getGuildExploreEventRewardRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getGuild_CS_Request();

        let request: Protocol.Guild_CS_Request = msg.m_msgBody as Protocol.Guild_CS_Request;
        request.m_usType = Macros.GUILD_TREASURE_HUNT_GET_REWARD;
        let data: Protocol.GuildTreasureHuntGetInfo_Response = G.DataMgr.guildData.exploreInfo;//后台让给他再传回去
        request.m_stValue.m_stGuildTreasureHuntGetRewardRequest.m_iRewardChangeRate = data.m_stPersonalData.m_iPersonalRewardChangeRate;
        request.m_stValue.m_stGuildTreasureHuntGetRewardRequest.m_ucRewardType = type;
        request.m_stValue.m_stGuildTreasureHuntGetRewardRequest.m_uiContribution = data.m_stPersonalData.m_uiContribution;
        request.m_stValue.m_stGuildTreasureHuntGetRewardRequest.m_uiRewardID = data.m_stCommonData.m_ucDifficulty;

        return msg;
    }
    /**
     * 跨服领地战面板协议
     * @param
     * @return
     *
     */
    static getKfLingDiPanelRequest(): Protocol.FyMsg {
        return SendMsgUtil.getZZHC_Pannel_Request();
    }
    /**
     * 跨服领地战奖励协议
     * @param
     * @return
     *
     */
    static getKfLingDiRewardRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getZZHC_Reward_Request();

        let request: Protocol.ZZHC_Reward_Request = msg.m_msgBody as Protocol.ZZHC_Reward_Request;
        request.m_ucType = type;

        return msg;
    }

    /**
    * 跨服领地战攻打目标协议
    * @param
    * @return
    *
    */
    static getKfLingDitargetRequest(type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getZZHC_Recommond_Request();

        let request: Protocol.ZZHC_Recommond_Request = msg.m_msgBody as Protocol.ZZHC_Recommond_Request;
        request.m_iCityID = type;
        uts.log(request.m_iCityID + '请求id');
        return msg;
    }
    /**
     * 双倍充值面板协议
     * @param
     * @return
     *
     */
    static getDoubleChargePanelRequest(): Protocol.FyMsg {
        return SendMsgUtil.getCharge_Rebate_Panel_Request();
    }
    /**
     * 双倍充值奖励协议
     * @param
     * @return
     *
     */
    static getDoubleChargeRewardRequest(value: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getCharge_Rebate_Request();

        let request: Protocol.Charge_Rebate_Request = msg.m_msgBody as Protocol.Charge_Rebate_Request;
        request.m_uiChargeValue = value;

        return msg;
    }
    /**
     * 双倍充值设置档位协议
     * @param
     * @return
     *
     */
    static getDefineDoubleChargeRMBRequest(value: number, isCharge: boolean): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getSet_Charge_Rebate_Request();

        let request: Protocol.Set_Charge_Rebate_Request = msg.m_msgBody as Protocol.Set_Charge_Rebate_Request;
        request.m_uiChargeValue = value;
        request.m_bIsSet = isCharge ? 1 : 0;

        return msg;
    }

    static getAASIdentityRecordRequest(name: string, id: string): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getAASIdentityRecord_Request();

        let request: Protocol.AASIdentityRecord_Request = msg.m_msgBody as Protocol.AASIdentityRecord_Request;
        request.m_szRoleName = name;
        request.m_szIdentifyCardNum = id;

        return msg;
    }

    /**
     * 世界拍卖打开面板
     * @param actId
     */
    static getWorldPaiMaiPanelRequest(actId: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getWorldPaiMai_Pannel_Request();
        let request: Protocol.WorldPaiMai_Pannel_Request = msg.m_msgBody as Protocol.WorldPaiMai_Pannel_Request;
        request.m_iActID = actId;
        return msg;
    }
    /**
   * 世界拍卖竞拍
   * @param actId
   */
    static getWorldPaiMaiBuyRequest(flowID: number, price: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getWorldPaiMai_Buy_Request();
        let request: Protocol.WorldPaiMai_Buy_Request = msg.m_msgBody as Protocol.WorldPaiMai_Buy_Request;
        request.m_iItemFlowID = flowID;
        request.m_uiPrice = price;
        return msg;
    }

    /**跨服招募队友*/
    static getCSCrossRecruitTeamRequest(type: number, pinstanceId: number, roleIDs: Protocol.RoleID[]) {
        let msg: Protocol.FyMsg = SendMsgUtil.getCross_CS_Request();
        let request: Protocol.Cross_CS_Request = msg.m_msgBody as Protocol.Cross_CS_Request;
        request.m_usType = Macros.CROSS_RECRUIT_TEAM;
        request.m_stValue.m_stCSCrossRecruitTeamReq.m_uiType = type;
        request.m_stValue.m_stCSCrossRecruitTeamReq.m_uiPinstanceID = pinstanceId;
        request.m_stValue.m_stCSCrossRecruitTeamReq.m_astRoleID = roleIDs;
        request.m_stValue.m_stCSCrossRecruitTeamReq.m_ucNum = roleIDs.length;
        return msg;
    }


    /**翅膀合成*/
    static getRoleWingCreateRequest(id: number, thingA: Protocol.ContainerThing, thingB: Protocol.ContainerThing, thingC: Protocol.ContainerThing = null) {
        let msg: Protocol.FyMsg = SendMsgUtil.getRoleWing_Request();
        let request: Protocol.RoleWing_Request = msg.m_msgBody as Protocol.RoleWing_Request;
        request.m_ucType = Macros.ROLE_WING_CREATE;
        request.m_stValue.m_stWingCreateReq.m_iID = id;
        request.m_stValue.m_stWingCreateReq.m_stContainerThingA = thingA;
        request.m_stValue.m_stWingCreateReq.m_stContainerThingB = thingB;
        request.m_stValue.m_stWingCreateReq.m_stContainerThingC = thingC;
        return msg;
    }

    /**翅膀强化*/
    static getRoleWingStrengthenRequest() {
        let msg: Protocol.FyMsg = SendMsgUtil.getRoleWing_Request();
        let request: Protocol.RoleWing_Request = msg.m_msgBody as Protocol.RoleWing_Request;
        request.m_ucType = Macros.ROLE_WING_STRENGTHEN;
        //request.m_stValue.m_stWingCreateReq.m_stContainerThingA = {} as Protocol.ContainerThing;
        //request.m_stValue.m_stWingCreateReq.m_stContainerThingB = {} as Protocol.ContainerThing;
        //request.m_stValue.m_stWingCreateReq.m_stContainerThingC = {} as Protocol.ContainerThing;
        return msg;
    }

    /**
    * 对特殊祝福系统的操作
    * @param	type
    * @param	operate
    * @return
*/
    static getHeroSubSpecRequest(type: number, operate: number, parm: number = 0): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getHeroSub_Spec_Request();
        let request: Protocol.HeroSub_Spec_Request = msg.m_msgBody as Protocol.HeroSub_Spec_Request;
        request.m_ucType = type;
        request.m_ucOperate = operate;
        request.m_stValue.m_ucTZMountReq = parm;
        return msg;
    }

    /**
  * 武缘寻宝
  */
    static getPetXunBaoRequest(type: number, beautyID: number, leftBeautyID: number, rightBeautyID: number) {
        let msg: Protocol.FyMsg = SendMsgUtil.getWYTreasureHunt_Request();
        let request: Protocol.WYTreasureHunt_Request = msg.m_msgBody as Protocol.WYTreasureHunt_Request;
        request.m_usType = type;
        let treasureHunt: Protocol.TreasureHuntInfo;
        if (type == Macros.BEAUTY_TREASURE_HUNT_START) {
            treasureHunt = request.m_stValue.m_stTreasureHuntStart
        } else if (type == Macros.BEAUTY_TREASURE_HUNT_END) {
            treasureHunt = request.m_stValue.m_stTreasureHuntEnd
        }
        if (treasureHunt) {
            treasureHunt.m_iBeautyID = beautyID;
            treasureHunt.m_iLeftBeautyID = leftBeautyID;
            treasureHunt.m_iRightBeautyID = rightBeautyID;
        }
        return msg;
    }

    //魂力升级
    static getHunliUpRequest() {
        let msg: Protocol.FyMsg = SendMsgUtil.getHunLi_Request();
        let request: Protocol.HunLi_Request = msg.m_msgBody as Protocol.HunLi_Request;
        request.m_usType = Macros.HUNLI_LEVEL_UP;
        // request.m_stValue.m_ucHunLi = 0;
        return msg;
    }

    //魂力领取奖励
    static getHunliRewardRequest(level: number, subLevel: number, index: number) {
        let msg: Protocol.FyMsg = SendMsgUtil.getHunLi_Request();
        let request: Protocol.HunLi_Request = msg.m_msgBody as Protocol.HunLi_Request;
        request.m_usType = Macros.HUNLI_REWARD;
        request.m_stValue.m_stHunLiRewardReq.m_iHunLiLevel = level;
        request.m_stValue.m_stHunLiRewardReq.m_iHunLiSubLevel = subLevel;
        request.m_stValue.m_stHunLiRewardReq.m_iConditionID = index;
        return msg;
    }

    //魂环穿戴
    static getHunhuanWearRequest(type: number = 0, id: number, level: number = 0) {
        let msg: Protocol.FyMsg = SendMsgUtil.getHunLi_Request();
        let request: Protocol.HunLi_Request = msg.m_msgBody as Protocol.HunLi_Request;
        request.m_usType = type;
        if (type == Macros.HUNLI_HUNHUAN_ZHURU) {
            request.m_stValue.m_stHunHuanZhuRuReq.m_iHunHuanID = id;
        } else if (type == Macros.HUNLI_HUNHUAN_LEVEL_UP) {
            request.m_stValue.m_uiHunHuanLevelUpID = id;
        }
        else {
            request.m_stValue.m_uiHunHuanActiveID = id;
        }
        return msg;
    }

    static getHunguRequest(equipPart: number, type: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getEquipProp_Request();
        let request: Protocol.EquipProp_Request = msg.m_msgBody as Protocol.EquipProp_Request;
        request.m_stContainerID.m_ucContainerType = Macros.CONTAINER_TYPE_HUNGU_EQUIP;
        request.m_ucEquipPart = equipPart;
        request.m_usType = type;
        return msg;
    }

    /**
     * 获取星斗宝库抽奖请求
     * @param equipPart
     * @param type
     */
    static getStarsTreasuryRequest(type: number, num: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getStarLottery_Request();
        let request: Protocol.StarLottery_Request = msg.m_msgBody as Protocol.StarLottery_Request;
        request.m_ucType = type;
        request.m_stValue.m_ucLotteryNum = num;
        return msg;
    }

    /**星斗宝库打开面板请求 */
    static getStarsOpenPanelRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getStarLottery_Request();
        let request: Protocol.StarLottery_Request = msg.m_msgBody as Protocol.StarLottery_Request;
        request.m_ucType = Macros.STAR_LOTTERY_PANEL;
        return msg;
    }

    /**
     * 星空宝库查询抽奖记录
     * @param index 全服抽奖记录（1）,玩家抽奖结果（2）
     */
    static getStarsRecordListRequest(index: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getStarLottery_Request();
        let request: Protocol.StarLottery_Request = msg.m_msgBody as Protocol.StarLottery_Request;
        request.m_ucType = Macros.STAR_LOTTERY_LIST_RECORD;
        request.m_stValue.m_ucListType = index;
        return msg;
    }

    /**
    * 星空宝库领取头奖
    * @param index
    */
    static getStarsGetPrizeRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getStarLottery_Request();
        let request: Protocol.StarLottery_Request = msg.m_msgBody as Protocol.StarLottery_Request;
        request.m_ucType = Macros.STAR_LOTTERY_GET_TOP_PRIZE;
        return msg;
    }

    /**
     * 星空宝库选择头奖
     * @param index
     */
    static getStarsChoosePrizeRequest(index: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getStarLottery_Request();
        let request: Protocol.StarLottery_Request = msg.m_msgBody as Protocol.StarLottery_Request;
        request.m_ucType = Macros.STAR_LOTTERY_CHOOSE_TOP_PRIZE;
        request.m_stValue.m_ucTopPrizeChooseID = index;
        return msg;
    }

    /**
     * 星空宝库获得头奖信息配置
     * @param index
     */
    static getStarsTopPrizeCfgRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getStarLottery_Request();
        let request: Protocol.StarLottery_Request = msg.m_msgBody as Protocol.StarLottery_Request;
        request.m_ucType = Macros.STAR_LOTTERY_TOP_PRIZE_CFG;
        return msg;
    }

    /**
     * 星空宝库分红包请求
     * @param index
     */
    static getStarsHongbaoRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getStarLottery_Request();
        let request: Protocol.StarLottery_Request = msg.m_msgBody as Protocol.StarLottery_Request;
        request.m_ucType = Macros.STAR_LOTTERY_HONGBAO_ENTRY;
        return msg;
    }

    /**
    * 星空宝库红包排行请求
    * @param index
    */
    static getStarsGetRankRequest(): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getStarLottery_Request();
        let request: Protocol.StarLottery_Request = msg.m_msgBody as Protocol.StarLottery_Request;
        request.m_ucType = Macros.STAR_LOTTERY_HONGBAO_HISTORY;
        return msg;
    }

    /**
     * 设置面板状态。
     * @param panelId 面板id。
     * @param status 面板状态(0关闭 1打开)。
     * @return
     *
     */
    static getClientPanelSetRequest(panelId: number, status: number): Protocol.FyMsg {
        let msg: Protocol.FyMsg = SendMsgUtil.getClientPanelSet_Request();
        let request: Protocol.ClientPanelSet_Request = msg.m_msgBody as Protocol.ClientPanelSet_Request;
        request.m_iPanelID = panelId;
        request.m_iStatus = status;
        return msg;
    }

    static getPreviewRewardRequest(keyword: number) {
        let msg: Protocol.FyMsg = SendMsgUtil.getPreviewReward_Request();
        let request: Protocol.PreviewReward_Request = msg.m_msgBody as Protocol.PreviewReward_Request;
        request.m_usKeyword = keyword;
        return msg;
    }

    static getSaiJiPanelRequest() {
        let msg: Protocol.FyMsg = SendMsgUtil.getSaiJiPannel_Request();
        let request: Protocol.SaiJiPannel_Request = msg.m_msgBody as Protocol.SaiJiPannel_Request;
        return msg;
    }


    static getSaiJiActiveRequest(saiJiID: number, showId: number) {
        let msg: Protocol.FyMsg = SendMsgUtil.getSaiJiActive_Request();
        let request: Protocol.SaiJiActive_Request = msg.m_msgBody as Protocol.SaiJiActive_Request;
        request.m_iSaiJiID = saiJiID;
        request.m_iShowID = showId;
        return msg;
    }
}