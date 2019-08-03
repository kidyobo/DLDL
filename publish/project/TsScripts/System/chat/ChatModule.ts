import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { ActionHandler } from 'System/ActionHandler'
import { ChannelData } from 'System/chat/ChannelData'
import { ChannelMsgData } from 'System/chat/ChannelMsgData'
import { ChannelStyle } from 'System/chat/ChannelStyle'
import { FuncLimitData } from 'System/data/FuncLimitData'
import { HeroData } from 'System/data/RoleData'
import { MonsterData } from 'System/data/MonsterData'
import { PinstanceData } from 'System/data/PinstanceData'
import { RoleAbstract } from 'System/data/vo/RoleAbstract'
import { SkillData } from 'System/data/SkillData'
import { ThingData } from 'System/data/thing/ThingData'
import { PathingState, FindPosStrategy, QuestID } from 'System/constants/GameEnum'
import { ErrorId } from 'System/protocol/ErrorId'
import { Macros } from 'System/protocol/Macros'
import { SceneModule } from 'System/scene/SceneModule'
import { Color } from 'System/utils/ColorUtil'
import { CompareUtil } from 'System/utils/CompareUtil'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { SpecialCharUtil } from 'System/utils/SpecialCharUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { UnitController } from 'System/unit/UnitController'
import { ChannelClean } from 'System/chat/ChannelClean'
import { IChatComm } from 'System/chat/IChatComm'
import { FriendView, FriendViewTab } from 'System/friend/FriendView'
import { FriendPanel } from 'System/friend/FriendPanel'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { SkillTipData } from 'System/tip/tipData/SkillTipData'
import { TipFrom } from 'System/tip/view/TipsView'
import { TanBaoView } from 'System/tanbao/TanBaoView'
import { EquipView } from 'System/equip/EquipView'
import { VipView, VipTab } from 'System/vip/VipView'
import { FirstRechargeView } from 'System/activity/view/FirstRechargeView'
import { JishouView } from 'System/jishou/JishouView'
import { GuildView } from 'System/guild/view/GuildView'
import { PetView } from 'System/pet/PetView'
import { HeroView } from 'System/hero/view/HeroView'
import { JinjieView } from 'System/jinjie/view/JinjieView'
import { JuYuanView } from 'System/juyuan/JuYuanView'
import { FloatShowType } from 'System/floatTip/FloatTip'
import { KuaiSuShengJiView } from 'System/activity/view/KuaiSuShengJiView'
import { PetData } from 'System/data/pet/PetData'
import { TanBaoExchangeView } from 'System/tanbao/TanBaoExchangeView'
import { TanBaoStoreView } from 'System/tanbao/TanBaoStoreView'
import { LuckyWheelView } from 'System/activity/view/LuckyWheelView'
import { XXDDMainView } from 'System/diandeng/XXDDMainView'
import { JuBaoPenView } from 'System/activity/YunYingHuoDong/JuBaoPenView'
import { RoleMenuView, MenuPanelType } from 'System/main/view/RoleMenuView'
import { FanLiDaTingView } from 'System/activity/fanLiDaTing/FanLiDaTingView'
import { ZhiZunDuoBaoView } from 'System/activity/YunYingHuoDong/ZhiZunDuoBaoView'
import { KaiFuZhiZunDuoBaoView } from 'System/activity/YunYingHuoDong/KaiFuZhiZunDuoBaoView'
import { ReportType } from 'System/channel/ChannelDef'
import { MainMarryView } from 'System/Marry/MainMarryView'
import { SendFlowerView } from 'System/Marry/SendFlowerView'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { Profiler } from '../utils/Profiler';
import { JavaCaller } from '../utils/JavaCaller';
import { FpsRecorder } from '../utils/FpsRecorder';
import { BossView } from 'System/pinstance/boss/BossView'
import { XianShiMiaoShaView } from 'System/activity/YunYingHuoDong/XianShiMiaoShaView'
import { BossTipView } from 'System/tip/view/BossTipView'
import { StarsTreasuryView } from "System/activity/xingdoubaoku/StarsTreasuryView";
import { DailyRechargeView } from '../activity/view/DailyRechargeView';


/**
* 聊天模块
* @author teppei
*
*/
export class ChatModule extends EventDispatcher {

    /**超链接规则。*/
    private static uExp: RegExp = /U=(\d+)/;
    private static regExp: RegExp = /#((?:C=(?:\b0[xX][0-9a-fA-F]+\b|\d+)|U=\d+|[Ii]=\d+|SQ=\d+|CC=\d+|ZP|GJ|M|F|GW|XT|CJ|ZW|HD|DJ=\d+|WL=\d+|DL=\d+|WN=\d+|MN=\d+|DN=\d+|TN=\d+|URL=[^;#]+|O)(?:,(?:C=(?:\d+|\b0[xX][0-9a-fA-F]+\b)|U=\d+|[Ii]=\d+))*)(?:;([^#]*))?#/;
    /**聊天时间戳映射表。*/
    private m_chatTimeMap: { [channelId: number]: number };
    private m_itemTipData: ItemTipData = new ItemTipData();
    private m_skillTipData: SkillTipData = new SkillTipData();
    /**链接相关的角色信息。*/
    private m_linkRoleAbstract: RoleAbstract;

    constructor() {
        super();
        this.m_linkRoleAbstract = new RoleAbstract();
        this.m_chatTimeMap = {};
        this.addNetListener(Macros.MsgID_Chat_Response, this._onChatResponse);
        this.addNetListener(Macros.MsgID_Chat_Notify, this._onChatNotify);
        this.addNetListener(Macros.MsgID_GameMaster_Response, this._onGMChatResponse);
        this.addNetListener(Macros.MsgID_GameMaster_Notify, this._onGMChatNotify);
        this.addNetListener(Macros.MsgID_PromptMsg_Notify, this._onPromptMessageNotify);
        this.addNetListener(Macros.MsgID_GetThingPropertyByGuid_Response, this._onGetThingPropertyByGuidResponse);
        //GM回复
        this.addNetListener(Macros.MsgID_AddGMQA_Response, this.onGetOssAdvanceResponse);
        this.addNetListener(Macros.MsgID_ListGMQA_Response, this.onGetGmListResponse);
        this.addNetListener(Macros.MsgID_FlashGMQA_Notify, this.onGetGmNotify);
    }


    /**gm图标通知*/
    private onGetGmNotify(notify: Protocol.CSFlashGMQA_Notify) {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOssGMList());
    }


    /**GMList的回复*/
    private onGetGmListResponse(response: Protocol.CSListGMQA_Response) {
        this.setOssGmTimes(response.m_stList.m_stQAList);
    }


    private setOssGmTimes(list: Protocol.DBGMQAOneDataCli[]) {
        let times: number = 0;
        for (let i = 0; i < list.length; i++) {
            if (list[i].m_iAnswerTime <= 0) {
                times++;
            }
        }
        G.DataMgr.heroData.ossGmTimes = times;
    }


    /**提意见反馈的响应*/
    private onGetOssAdvanceResponse(response: Protocol.CSAddGMQA_Response) {
        this.setOssGmTimes(response.m_stList.m_stQAList);
        if (response.m_iResult == 0) {
            G.TipMgr.addMainFloatTip("发送成功,谢谢反馈");
        } else {
            G.TipMgr.addMainFloatTip("发送失败,请在次发送");
        }
    }


    /**
     * 查看他人道具响应
     * @param msg
     *
     */
    private _onGetThingPropertyByGuidResponse(response: Protocol.GetThingProperty_Response): void {
        if (response.m_iThingID == 0) {
            G.TipMgr.addMainFloatTip('目标道具已消失！');
            return;
        }
        let config: GameConfig.ThingConfigM = ThingData.getThingConfig(response.m_iThingID);
        if (null == this.m_itemTipData) {
            this.m_itemTipData = new ItemTipData();
        }
        let data = { m_iThingID: response.m_iThingID, m_stThingProperty: response.m_stThingProperty } as Protocol.ContainerThingInfo;
        this.m_itemTipData.setTipData(config, data);
        G.ViewCacher.tipsView.open(this.m_itemTipData, TipFrom.normal);
    }

    /**
     * 执行了超链接处理
     * @param data
     *
     */
    doLinkAction(msgData: ChannelMsgData): void {
        let isRole: boolean = false;
        if (Macros.MSGDATATYPE_ROLE_INFO == msgData.data.m_ucType) {
            if (CompareUtil.isRoleIDEqual(msgData.data.m_stValue.m_stRoleInfo.m_stRoleId, G.DataMgr.heroData.roleID)) {
                return;
            }
            // 角色信息
            this.m_linkRoleAbstract.adaptFromMsgRoleInfo(msgData.data.m_stValue.m_stRoleInfo);
            isRole = true;
        }
        if (isRole) {
            G.ViewCacher.roleMenuView.open(this.m_linkRoleAbstract, MenuPanelType.fromChat);
            return;
        }
        let value: Protocol.ChatMsgDataValue = msgData.data.m_stValue;
        switch (msgData.type) {
            case Macros.MSGDATATYPE_PROP:
                // 查看道具
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getThingPropertyByGuidRequest(value.m_stPropThing.m_stRoleId, value.m_stPropThing.m_stThingGUID));
                break;
            case Macros.MSGDATATYPE_THING:
                // 静态道具
                if (GameIDUtil.isBagThingID(value.m_stThing.m_iThingID)) {
                    // 背包物品
                    let itemConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(value.m_stThing.m_iThingID);
                    this.m_itemTipData.setTipData(itemConfig, null);
                    G.ViewCacher.tipsView.open(this.m_itemTipData, TipFrom.normal);
                }
                else if (GameIDUtil.isSkillID(value.m_stThing.m_iThingID)) {
                    // 技能
                    let skillConfig: GameConfig.SkillConfigM = SkillData.getSkillConfig(value.m_stThing.m_iThingID);
                    this.m_skillTipData.setTipData(skillConfig, false);
                    G.ViewCacher.tipsView.open(this.m_skillTipData, TipFrom.normal);
                }
                else if (GameIDUtil.isLhID(value.m_stThing.m_iThingID)) {
                    // 猎魂
                    //let lhCfg: GameConfig.CrystalConfigM = G.DataMgr.lhData.getCfgById(value.m_stThing.m_iThingID);
                    //if (null == this._lhTipData) {
                    //    this._lhTipData = new LhTipData();
                    //}
                    //LhTipData(this._lhTipData).lhGridVo.lhCfg = lhCfg;
                    //LhTipData(this._lhTipData).lhGridVo.bagType = EnumLhRule.BAG_STORE_TYPE;
                    //TipMgr.showTip(ui, this._lhTipData, -1, 52, ui.height);
                }
                break;

            case Macros.MSGDATATYPE_GUILDCREATE:
                // 加入宗门
                if (G.DataMgr.guildData.canJoinGuild(true)) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildJoinRequest(value.m_ucGuildId, Macros.GUILD_APPLY_CODE_APPLY));
                }
                break;
            case Macros.MSGDATATYPE_GUOYUN:
                // 国运求救
                let guoyunHelpRoleID: Protocol.RoleID = value.m_stGuoYunHelp.m_stRoleId;
                if (this._canAnswerCyj(msgData, guoyunHelpRoleID, KeyWord.NAVIGATION_GUOYUN)) {
                    //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSpecialTransportRequest(KeyWord.NAVIGATION_GUOYUN, guoyunHelpRoleID.m_uiUin, guoyunHelpRoleID.m_uiSeq));
                }
                break;
            case Macros.MSGDATATYPE_COUNTRY_CHAT_SEND_POS:
                // 国家穿云箭
                let countryHelpRoleID: Protocol.RoleID = value.m_stCountryHelp.m_stRoleId;
                if (this._canAnswerCyj(msgData, countryHelpRoleID, KeyWord.NAVIGATION_COUNTRY_SEND_POS)) {
                    //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSpecialTransportRequest(KeyWord.NAVIGATION_COUNTRY_SEND_POS, countryHelpRoleID.m_uiUin, countryHelpRoleID.m_uiSeq));
                }
                break;
            case Macros.MSGDATATYPE_GUILD_CHAT_SEND_POS:
                // 宗门穿云箭
                let guildHelpRoleID: Protocol.RoleID = value.m_stGuildHelp.m_stRoleId;
                if (this._canAnswerCyj(msgData, guildHelpRoleID, KeyWord.NAVIGATION_GUILD_SEND_POS)) {
                    G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_GUILD_SEND_POS, guildHelpRoleID.m_uiUin, guildHelpRoleID.m_uiSeq);
                }
                break;
            case Macros.MSGDATATYPE_GUILD_JIJIELING:
                // 宗门集结令
                G.Mapmgr.goToPos(value.m_stGuildJJL.m_uiSceneID, value.m_stGuildJJL.m_stPos.m_uiX, value.m_stGuildJJL.m_stPos.m_uiY, false, true);
                break;
            case Macros.MSGDATATYPE_SKYLOTTERY:
                // 魔帝宝库
                G.Uimgr.createForm<TanBaoView>(TanBaoView).open();
                break;
            case Macros.MSGDATATYPE_TREASURE_PANEL:
                // 魔帝宝库兑换
                G.Uimgr.createForm<TanBaoStoreView>(TanBaoStoreView).open();
                break;
            case Macros.MSGDATATYPE_MJLOTTERY:
                // 天宫秘镜
                G.Uimgr.createForm<TanBaoView>(TanBaoView).open();
                break;
            case Macros.MSGDATATYPE_EQUIPSTRENG:
                // 装备强化
                G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE);
                break;
            case Macros.MSGDATATYPE_EQUIPUPCOLOR:
                // 装备颜色
                G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL);
                break;
            case Macros.MSGDATATYPE_DIAMONDINSERT:
            case Macros.MSGDATATYPE_EQUIPSUHUN:
                // 宝石镶嵌
                G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIP_MOUNT);
                break;
            case Macros.MSGDATATYPE_EQUIPLQ_PANEL:
                //装备斩魔
                G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIPLQ);
                break;
            case Macros.MSGDATATYPE_XUKONGZHANCHANG:
                // 虚空战场
                //G.ActionHandler.executeFunction(KeyWord.ACT_FUNCTION_XKZC);
                break;
            case Macros.MSGDATATYPE_SHILIANZHIDI:
                // 试炼之地
                //this.dispatchEvent(Events.OpenCloseSlzdDialog, DialogCmd.open);
                break;
            case Macros.MSGDATATYPE_CHARGE_REWARD:
                //充值奖励领取面板
                break;
            case Macros.MSGDATATYPE_VIP_PANEL:
                // 打开VIP面板
                G.Uimgr.createForm<VipView>(VipView).open(VipTab.Reward);
                break;
            case Macros.MSGDATATYPE_FIRST_CHARGE:
                //首冲礼包面板
                break;
            case Macros.MSGDATATYPE_ROLE_SC_GET:
                //终生首充礼包面板
                if (!G.DataMgr.firstRechargeData.isNotShowFirstRechargeIcon()) {
                    G.Uimgr.createForm<FirstRechargeView>(FirstRechargeView).open();
                }
                break;
            case Macros.MSGDATATYPE_DAILY_CHARGE:
                //每日首冲面板
                if (G.SyncTime.getDateAfterStartServer() >= 8) {
                    G.Uimgr.createForm<DailyRechargeView>(DailyRechargeView).open();
                } else {
                    G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open(KeyWord.OTHER_FUNCTION_LEICHONGFANLI);
                }
                break;
            case Macros.MSGDATATYPE_SC_GET:
                // 打开每日首充礼包面板
                if (G.SyncTime.getDateAfterStartServer() >= 8) {
                    G.Uimgr.createForm<DailyRechargeView>(DailyRechargeView).open();
                } else {
                    G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open(KeyWord.OTHER_FUNCTION_LEICHONGFANLI);
                }
                break;
            case Macros.MSGDATATYPE_PPSTORECALL:
                // 打开交易所面板
                G.Uimgr.createForm<JishouView>(JishouView).open();
                break;
            case Macros.MSGDATATYPE_MONTHVIP_PANEL:
                //打开月卡面板
                G.Uimgr.createForm<VipView>(VipView).open(VipTab.ZunXiang);
                break;
            case Macros.MSGDATATYPE_GROUPBUY:
                // 打开团购页面
                //this.dispatchEvent(Events.OpenCloseKfhdDialog, DialogCmd.open, EnumNewKfhdTab.GROUP_BUY);
                break;
            case Macros.MSGDATATYPE_JBP_INFO:
                //聚宝盆
                if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_JU_BAO_PENG)) {
                    G.Uimgr.createForm<JuBaoPenView>(JuBaoPenView).open();
                }
                break;
            case Macros.MSGDATATYPE_MC_FINAL:
                // 比武大会
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_BIWUDAHUI);
                break;
            case Macros.MSGDATATYPE_URL:
                // 打开指定页面
                //let request: URLRequest = new URLRequest('http://' + msgData.url);
                //navigateToURL(request, '_blank');
                break;
            case Macros.MSGDATATYPE_GRJJC:
                {
                    //个人竞技
                    if (msgData.data.m_stValue.m_ucGRJJType == Macros.GRJJC_TYPE_TMB) {
                        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_TIANMINGBANG);
                    }
                    else if (msgData.data.m_stValue.m_ucGRJJType == Macros.GRJJC_TYPE_DB) {
                        //G.form<SelfChallengeView>(SelfChallengeView).open(KeyWord.OTHER_FUNCTION_DBJJ);
                    }
                    else if (msgData.data.m_stValue.m_ucGRJJType == Macros.GRJJC_TYPE_TB) {
                        //G.form<SelfChallengeView>(SelfChallengeView).open(KeyWord.OTHER_FUNCTION_TBJJ);
                    }
                    else if (msgData.data.m_stValue.m_ucGRJJType == Macros.GRJJC_TYPE_JSTZ) {
                        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_JSTZ);
                    }
                    break;
                }

            // 招募队友
            case Macros.MSGDATATYPE_RECRUIT_TEAM_INFO:
                let info: Protocol.Cross_SimpleOneTeam = {} as Protocol.Cross_SimpleOneTeam;
                info.m_szPassword = value.m_stRecruitTeamInfo.m_szPassword;
                info.m_szRoleName = value.m_stRecruitTeamInfo.m_szRoleName;
                info.m_ucAutoStart = value.m_stRecruitTeamInfo.m_ucAutoStart;
                info.m_ucTeamMemNum = value.m_stRecruitTeamInfo.m_ucTeamMemNum;
                info.m_uiFight = value.m_stRecruitTeamInfo.m_uiFight;
                info.m_uiTeamID = value.m_stRecruitTeamInfo.m_uiTeamID;
                info.m_usWorldID = value.m_stRecruitTeamInfo.m_usWorldID;
                if (PinstanceIDUtil.isZuDuiFuBen(value.m_stRecruitTeamInfo.m_uiPinstanceID) && G.DataMgr.heroData.level < info.m_uiFight) {
                    G.TipMgr.addMainFloatTip("等级不足，无法加入！");
                    return;
                }
                G.ModuleMgr.teamFbModule.joinSxtTeam(value.m_stRecruitTeamInfo.m_uiPinstanceID, info);
                break;
            //帝者之路和守护女神
            case Macros.MSGDATATYPE_PINSTANCE_INFO:
                let pinstanceID: number = msgData.data.m_stValue.m_stPinstanceInfo.m_uiPinstanceID;
                // 检查是否在副本中
                let crtPinstanceID: number = G.DataMgr.sceneData.curPinstanceID;
                if (crtPinstanceID > 0) {
                    G.TipMgr.addMainFloatTip('您当前正在副本中，请先离开副本');
                }
                else {
                    G.ActionHandler.handlePinstance(pinstanceID, 0);
                }
                break;
            case Macros.MSGDATATYPE_MONTHVIP_PANEL:
                //月卡激活
                //this.dispatchEvent(Events.OpenCloseVipMonthDialog, DialogCmd.toggle);
                break;
            case Macros.MSGDATATYPE_GUILD_XB:
                //宗门寻宝
                //G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_GUILD, 0, 0, 0, EnumGuildTab.TRUESURE);
                break;
            case Macros.MSGDATATYPE_SEND_FLOWER:
                //送花
                let roleInfo = msgData.data.m_stValue.m_stRoleInfo;
                if (roleInfo != null) {
                    G.Uimgr.createForm<SendFlowerView>(SendFlowerView).open(roleInfo.m_szNickName, roleInfo.m_stRoleId);
                }
                break;
            case Macros.MSGDATATYPE_GETPET:
            case Macros.MSGDATATYPE_BEAUTY_STAGEUP:
                //伙伴激活
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_PET_JINJIE);
                break;
            case Macros.MSGDATATYPE_MOUNTUPLEVEL:
                G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.HERO_SUB_TYPE_ZUOQI);
                break;
            case Macros.MSGDATATYPE_FAZHEN:
                //魔瞳
                // G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.HERO_SUB_TYPE_FAZHEN);
                if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_FZJH)) {
                    G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_FZJH);
                }
                else {
                    G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_SXZL);
                }
                break;
            case Macros.MSGDATATYPE_ZUJI:
                //迷踪
                // G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.HERO_SUB_TYPE_LEILING);
                if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_LLJH)) {
                    G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_LLJH);
                }
                else {
                    G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_SXZL);
                }
                break;
            case Macros.MSGDATATYPE_MAGIC:
                //控鹤擒龙
                if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_MAGICCUBE)) {
                    G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_MAGICCUBE);
                }
                else {
                    G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_SXZL);
                }
                break;
            case Macros.MSGDATATYPE_WUHUNUPLEVEL:
                G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.HERO_SUB_TYPE_WUHUN);
                break;
            case Macros.MSGDATATYPE_WINGSTRENG:
                G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN);
                break;
            case Macros.MSGDATATYPE_IMAGE:
                //幻化面板
                let zhufuType: number = G.DataMgr.zhufuData.getImageConfig(msgData.data.m_stValue.m_uiImageID).m_iZhuFuID;
                if (
                    zhufuType == KeyWord.HERO_SUB_TYPE_FAZHEN ||
                    zhufuType == KeyWord.HERO_SUB_TYPE_LEILING ||
                    zhufuType == KeyWord.HERO_SUB_TYPE_SHENGLING) {
                    G.Uimgr.createForm<HeroView>(HeroView).open(zhufuType, 1);
                }
                else if (zhufuType == KeyWord.HERO_SUB_TYPE_YUYI) {
                    G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN);
                }
                else if (zhufuType == KeyWord.HERO_SUB_TYPE_ZUOQI) {
                    G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.HERO_SUB_TYPE_ZUOQI);
                }
                else if (zhufuType == KeyWord.HERO_SUB_TYPE_WUHUN) {
                    G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.HERO_SUB_TYPE_WUHUN);
                }
                else {
                    G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.OTHER_FUNCTION_DRESS);
                }
                break;

            //祈福链接
            case Macros.MSGDATATYPE_QIFU_PANEL:
                G.ActionHandler.executeFunction(KeyWord.ACT_FUNCTION_QIFU);
                //G.Uimgr.createForm<KuaiSuShengJiView>(KuaiSuShengJiView).open();
                break;
            case Macros.MSGDATATYPE_WORLDBOSS_PANEL:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_WORLDBOSS);
                break;
            case Macros.MSGDATATYPE_FENGMOTA_PANEL:
                G.ActionHandler.executeFunction(KeyWord.ACT_FUNCTION_FMT, value.m_uiFMTBossID);
                break;
            case Macros.MSGDATATYPE_FMT_BOSS_PANEL:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_DI_BOSS, value.m_uiFTMBigBossID);
                break;
            case Macros.MSGDATATYPE_WORLDBOSS_DIG:
                //BOSS挖宝
                let bossID: number = msgData.data.m_stValue.m_uiWorldBossID;
                let bossConfgVo: GameConfig.ZYCMCfgM = MonsterData.getBossConfigById(bossID);
                if (bossConfgVo.m_iIMonsterType == KeyWord.GROUP_ZYCM_BOSS_BIG) {
                    //世界boss
                    G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_WORLDBOSS, bossID);
                }
                else if (bossConfgVo.m_iIMonsterType == KeyWord.GROUP_ZYCM_CROSS_BOSS_SMALL) {
                    //跨服boss
                    G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_CROSSSVRBOSS, bossID);
                }
                break;
            case Macros.MSGDATATYPE_REDBAG:
                //this.dispatchEvent(Events.showCloseRedbagDialog, DialogCmd.open);
                break;
            case Macros.MSGDATATYPE_JUYUAN_STAGEUP:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_JU_YUAN);
                break;
            //宗门争霸
            case Macros.MSGDATATYPE_GUILDPVP_PANEL:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNC_KFZMZ);
                break;
            //结婚面板
            case Macros.MSGDATATYPE_MARRY:
                if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.BAR_FUNCTION_XIANYUAN)) {
                    G.Uimgr.createForm<MainMarryView>(MainMarryView).open();
                }
                else {
                    G.TipMgr.addMainFloatTip(uts.format('升级到{0}级可开启婚姻', G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.BAR_FUNCTION_XIANYUAN).m_ucLevel));
                }
                break;
            case Macros.MSGDATATYPE_POSITION:
                let canReach: PathingState = G.Mapmgr.goToPos(value.m_stPosition.m_uiSceneID, value.m_stPosition.m_stPos.m_uiX, value.m_stPosition.m_stPos.m_uiY, true, true, FindPosStrategy.Specified, 0, true);
                if (canReach == PathingState.CANNOT_REACH) {
                    G.Mapmgr.goToPos(value.m_stPosition.m_uiSceneID, value.m_stPosition.m_stPos.m_uiX, value.m_stPosition.m_stPos.m_uiY, false, true, FindPosStrategy.Specified, 0, true);
                }
                break;
            //开服活动累计充值
            case Macros.MSGDATATYPE_KFLJCZ:
                break;
            //返利大厅累计充值
            case Macros.MSGDATATYPE_LJCZ:
                G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open(KeyWord.OTHER_FUNCTION_DAILY_LEICHONGFANLI);
                break;
            case Macros.MSGDATATYPE_DUANWU:
                if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.ACT_FUNCTION_DWHD, true)) {
                    //this.dispatchEvent(Events.showDuanwuDialog, DialogCmd.toggle);
                }
                break;
            case Macros.MSGDATATYPE_ZZZD:
                if (msgData.data.m_stValue.m_uiZZZDType == 2) {
                    if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.ACT_FUNCTION_ZZZD, true)) {
                        G.Uimgr.createForm<FanLiDaTingView>(ZhiZunDuoBaoView).open();
                    }
                }
                else if (msgData.data.m_stValue.m_uiZZZDType == 1) {
                    if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.ACT_FUNCTION_KF_ZZZD, true)) {
                        G.Uimgr.createForm<KaiFuZhiZunDuoBaoView>(KaiFuZhiZunDuoBaoView).open();
                    }
                }
                break;
            case Macros.MSGDATATYPE_XYZP_JOIN:
                if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_XYZP)) {
                    G.Uimgr.createForm<LuckyWheelView>(LuckyWheelView).open();
                }
                else {
                    G.TipMgr.addMainFloatTip('活动已经结束')
                }
                break;
            case Macros.MSGDATATYPE_HLZP_JOIN:
                //欢乐转盘
                //this.dispatchEvent(Events.showHlzpDislog, DialogCmd.toggle);
                break;
            case Macros.MSGDATATYPE_HLFP_INFO:
                //欢乐翻牌
                if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_HLFP)) {
                    //this.dispatchEvent(Events.showHlfpDialog, DialogCmd.open);
                }
                break;
            case Macros.MSGDATATYPE_HFLJCZ:
                //this.dispatchEvent(Events.showHfhdDislog, DialogCmd.toggle, EnumHfhdTab.CHARGE_REWARD);
                break;
            case Macros.MSGDATATYPE_EQUIPWASH:
                //锻造
                G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIP_WASH);
                break;
            case Macros.MSGDATATYPE_DDL:
                //星星点灯
                G.Uimgr.createForm<XXDDMainView>(XXDDMainView).open();
                break;
            case Macros.MSGDATATYPE_BFQD_DRAW:
                if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_BFQD)) {
                    //this.dispatchEvent(Events.showBfqdDialog, DialogCmd.open);
                }
                else {
                    G.TipMgr.addMainFloatTip('活动已经结束')
                }
                break;
            //case Macros.MSGDATATYPE_WJ_EXCHANGE:
            //    //武极兑换
            //    G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open(FanLiDaTingTab.wuJiExchange);
            //    break;
            //case Macros.MSGDATATYPE_TX_EXCHANGE:
            //    //天下兑换
            //    G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open(FanLiDaTingTab.tianXiaExchange);
            //    break;
            case Macros.MSGDATATYPE_LCACT_PANEL:
                //this.dispatchEvent(Events.ShowCloseCzthDialog, DialogCmd.open);
                break;
            case Macros.MSGDATATYPE_XSYG_PANEL:
                //this.dispatchEvent(Events.showXsygDialog, DialogCmd.toggle);
                break;
            case Macros.MSGDATATYPE_LHJ_JOIN:
                //老虎机
                //this.dispatchEvent(Events.OpenCloseYYLMainDialog, DialogCmd.toggle);
                break;
            case Macros.MSGDATATYPE_CHARGE_REDBAG:
                if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_CHARGE_REDBAG)) {
                    //this.dispatchEvent(Events.showRedbag1Dialog, DialogCmd.open);
                }
                else {
                    G.TipMgr.addMainFloatTip('活动已经结束');
                }
                break;
            case Macros.MSGDATATYPE_CRYSTAL:
                //猎魂
                //this.dispatchEvent(Events.showLHDialog, DialogCmd.open);
                break;
            case Macros.MSGDATATYPE_YBWL_JOIN:
                //this.dispatchEvent(Events.OpenCloseYbwlDlg, DialogCmd.toggle);
                break;
            case Macros.MSGDATATYPE_BBGS_PANEL:
                //this.dispatchEvent(Events.OpenCloseJymtDialog, DialogCmd.open);
                break;
            case Macros.MSGDATATYPE_DRESSPROP:
                G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION);
                break;
            case Macros.MSGDATATYPE_GUILDCROSSPVP_PANEL:
                // 宗门跨服战
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNC_KFZMZ);
                break;
            case Macros.MSGDATATYPE_OPEN_PANEL:
                G.ActionHandler.executeFunction(msgData.data.m_stValue.m_iOpenPanelID);
                break;
            case Macros.MSGDATATYPE_GUILD_TREASURE_HUNT:
                // 宗门探险
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_GUILD_EXPLORE);
                break;
            case Macros.MSGDATATYPE_XZFM_HELP:
                //宗门求助
                G.Uimgr.createForm<BossView>(BossView).open(KeyWord.ACT_FUNCTION_XZFM, msgData.data.m_stValue.m_iXZFMFloor);
                break;
            case Macros.MSGDATATYPE_RUSH_PURCHASE:
                G.Uimgr.createForm<XianShiMiaoShaView>(XianShiMiaoShaView).open();
                break;
            case Macros.MSGDATATYPE_STAR_LOTTERY:
                G.ActionHandler.executeFunction(KeyWord.ACT_FUNCTION_STARSTREASURY);
                break;
            case Macros.MSGDATATYPE_HUNGU_FZ:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGUN_FZ);
                break;
            case Macros.MSGDATATYPE_JIUXING:
                //玄天宫
                if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.BAR_FUNCTION_JIUXING)) {
                    G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_JIUXING);
                }
                else {
                    G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_SXZL);
                }
                break;
            case Macros.MSGDATATYPE_HUNLI_PANEL:
                //魂力
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_ZHUANSHENG);
                break;
            default:
                break;
        }
    }

    /**
     * 是否可以响应穿云箭。
     * @param msgData
     * @return
     *
     */
    private _canAnswerCyj(msgData: ChannelMsgData, roleID: Protocol.RoleID, navType: number): boolean {
        if (G.DataMgr.heroData.roleID.m_uiUin == roleID.m_uiUin) {
            // 自己点击无效
            return false;
        }
        let actionDesc: string;
        if (Macros.MSGDATATYPE_GUOYUN == msgData.type) {
            actionDesc = '前去救驾';
        }
        else if (Macros.MSGDATATYPE_COUNTRY_CHAT_SEND_POS == msgData.type) {
            actionDesc = '前往会师';
        }
        else if (Macros.MSGDATATYPE_GUILD_CHAT_SEND_POS == msgData.type) {
            actionDesc = '前往救援';
        }
        else {
            actionDesc = '响应';
        }

        // 判断链接是否过期，5分钟失效
        if (Math.round(UnityEngine.Time.realtimeSinceStartup * 1000) - msgData.time >= 300000) {
            G.TipMgr.addMainFloatTip(uts.format('请求已过期，无法{0}', actionDesc));
            return false;
        }

        return G.Mapmgr.canFly2Role(actionDesc, navType);
    }

    /**
     * 添加一个道具
     * @param itemName
     * @param guid
     *
     */
    appendPetText(petConfig: GameConfig.BeautyAttrM, guid: Protocol.ThingGUID): void {
        //if (null == this.m_chatPannel) {
        //    return;
        //}
        //this.m_chatPannel.appendPet(petConfig, guid);
    }

    /**
     * 添加一个道具
     * @param itemName
     * @param guid
     *
     */
    appendItemText(config: GameConfig.ThingConfigM, guid: Protocol.ThingGUID): void {
        G.ViewCacher.chatView.appendItem(config, guid, true);
        let friendPanel = G.Uimgr.getSubFormByID<FriendPanel>(FriendView, FriendViewTab.FriendPanel);
        if (friendPanel != null) {
            friendPanel.appendItem(config, guid, true);
        }
    }



    processInputText(data: ChannelData): void {
        let displayMsg = data.displayMsg;
        if (displayMsg.indexOf(' ') == 0) {
            // 第一个字符不允许是空格
            displayMsg = RegExpUtil.trimBlanks(displayMsg);
        }
        data.displayMsg = displayMsg;

        // 检查超链接是否有效
        let occupiedIdxMap: { [idx: number]: 1 } = {};
        let validIdxMap: { [linkIdx: number]: 1 } = {};
        let displayMsgLen: number = displayMsg.length;
        let searchPos: number;
        let len: number = data.listMsgData.length;
        let channelMsgData: ChannelMsgData;
        for (let i: number = 0; i < len; i++) {
            channelMsgData = data.listMsgData[i];
            if (Macros.MSGDATATYPE_MAX != channelMsgData.type) {
                searchPos = 0;
                while (searchPos < displayMsgLen) {
                    let idx: number = displayMsg.indexOf(channelMsgData.msg, searchPos);
                    if (idx < 0) {
                        // 此链接已经被破坏
                        break;
                    } else {
                        if (1 == occupiedIdxMap[idx]) {
                            // 这个超链接已被占用，继续查找
                            searchPos = idx + channelMsgData.msg.length;
                        } else {
                            // 找到链接了
                            occupiedIdxMap[idx] = 1;
                            validIdxMap[i] = 1;
                            channelMsgData.startIndex = idx;
                            channelMsgData.endIndex = idx + channelMsgData.msg.length;
                            break;
                        }
                    }
                }
            }
        }
        // 删除被玩家破坏的链接			
        for (let i: number = len - 1; i >= 0; i--) {
            if (1 != validIdxMap[i]) {
                data.listMsgData.splice(i, 1);
            }
        }
        if (data.listMsgData.length > Macros.MAX_MSGDATA_NUM) {
            data.listMsgData.length = Macros.MAX_MSGDATA_NUM;
        }
    }

    /**
     * 发送消息
     * @param data
     *
     */
    sendChat(data: ChannelData, fromComm: IChatComm): void {
        if (this.handleClientGM(data.displayMsg)) {
            return;
        }

        //综合发送的是世界频道的消息
        if (data.id == Macros.CHANNEL_MAX) {
            data.id = Macros.CHANNEL_WORLD;
        }
        if (G.DataMgr.heroData.isGM && data.displayMsg.length > 2 && data.displayMsg.substr(0, 2) == '//') {
            let ret = this.sendGM(data.displayMsg);

            let gmData: ChannelData = new ChannelData();
            gmData.id = Macros.CHANNEL_SYSTEM;
            let style: ChannelStyle = G.DataMgr.chatData.getStyle(Macros.CHANNEL_SYSTEM);
            gmData.displayMsg = data.displayMsg;
            let msgData: ChannelMsgData = new ChannelMsgData();
            msgData.type = Macros.MSGDATATYPE_MAX;
            msgData.msg = data.displayMsg;
            gmData.listMsgData.push(msgData);

            // 存入接收的信息
            G.DataMgr.chatData.saveChannelData(gmData);

            // 刷新显示 
            fromComm.appendText(gmData, false);
            if (null != ret) {
                this.appendSystemMsg(ret, false);
            }

            // 清空输入框
            fromComm.clearInput();
            // 关闭
            G.ViewCacher.chatView.close();
            return;
        }

        // 聊天GM不检查等级
        let channelStyle: ChannelStyle = G.DataMgr.chatData.getStyle(data.id);
        let isChatGM: boolean = 0 != (G.DataMgr.systemData.canOpenTagBits & Macros.OSS_WAIT_ISGM);

        // 首先检查等级
        if (!isChatGM && channelStyle.minLv > G.DataMgr.heroData.level) {
            this.appendSystemMsg(uts.format('您还不到{0}级，不能使用{1}频道', channelStyle.minLv, channelStyle.name), false, true);
            return;
        }
        // 其次检查CD
        if (channelStyle.cd > 0) {
            let lastChatAt: number = this.m_chatTimeMap[data.id];
            let now: number = G.SyncTime.getCurrentTime();
            if (lastChatAt > 0) {
                let leftCd: number = channelStyle.cd - now + lastChatAt;
                if (leftCd > 0) {
                    let str = uts.format('{0}秒后才可以继续使用{1}频道', Math.ceil(leftCd / 1000), channelStyle.name);
                    this.appendSystemMsg(str, false, true);
                    return;
                }
            }

            this.m_chatTimeMap[data.id] = now;
        }

        if (data.id == Macros.CHANNEL_GUILD) {
            //如果没有加入宗门
            if (G.DataMgr.heroData.guildId <= 0) {
                this.appendSystemMsg('没有加入宗门，没法使用宗门频道', false, true);
                return;
            }
        }

        if (data.id == Macros.CHANNEL_TEAM) {
            if (!G.DataMgr.teamData.hasTeam) {
                this.appendSystemMsg('没有加入队伍，没法使用队伍频道', false, true);
                return;
            }
        }
        if (data.id == Macros.CHANNEL_SPEAKER) {
            let myMonthLevel: number = G.DataMgr.heroData.curVipLevel;
            let myFreeTimes: number = G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_FREE_SPEAKER, myMonthLevel);
            let cost: number = G.DataMgr.constData.getValueById(KeyWord.BUY_SPEAKER_PRICE);
            let limitLevel: number = G.DataMgr.constData.getValueById(KeyWord.CHANNEL_SPEAKER_OPEN_LEVEL);
            let leftTimes: number = myFreeTimes;
            if (G.DataMgr.vipData.listInfo != null) {
                leftTimes = myFreeTimes - G.DataMgr.vipData.listInfo.m_ucSpeakerNum;
            }
            if (G.DataMgr.heroData.level < limitLevel) {
                this.appendSystemMsg(uts.format('您的等级不满{0}级，无法使用喇叭！', limitLevel), false, true);
            }
            else if (leftTimes <= 0) {
                let str: string;
                if (myMonthLevel <= 0) {
                    str = '您不是VIP，没有免费次数可以使用。';
                }
                else {
                    str = uts.format('您的{0}次免费次数已全部用完了！', myFreeTimes);
                }
                str += uts.format('是否花费{0}购买喇叭的使用权？', TextFieldUtil.getYuanBaoText(cost));
                G.TipMgr.showConfirm(str, ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onBuySpeaker, data, fromComm, cost));
                return;
            }
            else {
                this.appendSystemMsg(uts.format('您已使用了一次喇叭，当前喇叭的使用次数剩余{0}次', leftTimes - 1), false, true);
            }
        }

        //消息上报用
        G.DataMgr.runtime.chatType = data.id;
        G.DataMgr.runtime.chatMsg = data.displayMsg;
        G.ChannelSDK.report(ReportType.CHAT);

        //发送消息
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getChatRequest(data, G.DataMgr.runtime.chatCheckCrc));

        //清空输入框
        fromComm.clearInput();
    }

    handleClientGM(msg: string): boolean {
        const showtestdlg_gm = "//f96a3f2f85";
        const showlogpanel_gm = "//fygame@666";
        const showfps_gm = "//showfps";
        const copyfps_gm = "//copyfps";
        const showprofiler_gm = "//showprofiler";
        const freecamera_gm = "//freecamera";
        const testerrorstack = "//testerrorstack";
        const saoma = "//saoma";
        let handled = true;
        if (G.DataMgr.heroData.isGM) {
            if (msg == freecamera_gm) {
                G.freecamera = true;
            }
        }
        if (msg == showtestdlg_gm) {
            G.MainBtnCtrl.btnTest.SetActive(true);
        }
        else if (msg == saoma) {
            G.DataMgr.settingData.IsEnableSaoma = !G.DataMgr.settingData.IsEnableSaoma;
            G.DataMgr.settingData.writeSetting();
        }
        else if (msg == showlogpanel_gm) {
            let outputpanel = UnityEngine.GameObject.Find("/outputPanel");
            if (outputpanel != null) {
                let elems = outputpanel.GetComponent(Game.ElementsMapper.GetType()) as Game.ElementsMapper;
                elems.GetElement('btnShow').SetActive(true);
                elems.GetElement('pswpanel').SetActive(false);
                elems.GetElement('frame').SetActive(true);
            }
        }
        else if (msg == showfps_gm) {
            let old = G.Root.GetComponent(Game.FPS.GetType());
            if (!old) {
                let cur = G.Root.AddComponent(Game.FPS.GetType()) as Game.FPS;
                FpsRecorder.startRecord(cur);
            }
        }
        else if (msg == showprofiler_gm) {
            Profiler.isopen = true;
        }
        else if (msg == copyfps_gm) {
            FpsRecorder.copyToClipboard();
        }
        else if (msg == testerrorstack) {
            let abc = null;
            uts.log(abc.a.b);
        }
        else {
            handled = false;
        }
        return handled;
    }

    private _onBuySpeaker(stage: MessageBoxConst, isCheckSelected: boolean, data: ChannelData, fromComm: IChatComm, cost: number): void {
        if (MessageBoxConst.yes == stage) {
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, cost, true)) {
                // 发送消息
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getChatRequest(data, G.DataMgr.runtime.chatCheckCrc));
                // 清空输入框
                fromComm.clearInput();
            }
        }
    }

    /**
     * 发送gm消息
     * @param data
     *
     */
    sendGM(gmText: string): string {
        // 前台gm命令
        let testActReg = /\/\/testact (\d+)/;
        let regArr: RegExpExecArray = testActReg.exec(gmText);
        if (null != regArr) {
            G.DataMgr.runtime.__testact = true;
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGMMsg(uts.format('//activity {0} 2', regArr[1])));
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGMMsg(uts.format('//activity {0} 1', regArr[1])));
            return null;
        } else if (gmText == '//targetinfo') {
            //let target: UnitController = G.ModuleMgr.unitModule.SelectedUnit;
            //if (target != null && target.Data != null) {
            //    let msg: string = 'targetUnitID=' + target.Data.unitID + ', msg: string = 'targetUnitID= ' + target.Data.unitID + ', msg: string = 'targetUnitID=' + target.Data.unitID + ', msg: string = 'targetUnitID= ' + target.Data.unitID + ', msg: string = 'targetUnitID=' + target.Data.unitID + ';
            //    return msg;
            //}
            //return null;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGMMsg(gmText));
        return null;
    }

    /**
     * 发送消息响应
     * @param msg
     *
     */
    private _onChatResponse(body: Protocol.Chat_Response): void {
        if (ErrorId.EQEC_Success != body.m_ushResultID) {
            // 私聊如果对方下线了则进行提示
            if (ErrorId.EQEC_Role_Offline == body.m_ushResultID) {
                //let p2pDlg: P2pChatDialog = this._getP2pChatDialog(response.m_stPrivateRoleID);
                //if (null != p2pDlg && p2pDlg.isShowing) {
                //    p2pDlg.alertOffline();
                //}
            }
            else {
                G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(body.m_ushResultID));
            }
        }
    }

    public _onChatNotify(body: Protocol.Chat_Notify): void {
        // 防止玩家通过WPE使用假频道说话
        if (null == G.DataMgr.chatData.getStyle(body.m_ucChannel)) {
            return;
        }
        if (body.m_ucChannel != Macros.CHANNEL_SPEAKER && G.DataMgr.friendData.isBlack(body.m_stRoleID)) {
            // 丢掉黑名单中的信息
            return;
        }
        let isFromResp: boolean = CompareUtil.isRoleIDEqual(body.m_stRoleID, G.DataMgr.heroData.roleID);
        if (!isFromResp && Macros.CHANNEL_CHUANWEN != body.m_ucChannel && Macros.CHANNEL_SYSTEM != body.m_ucChannel) {
            // 屏蔽他人广告
            if (ChannelClean.isAdMsg(body.m_szMessage)) {
                return;
            }
        }
        if (Macros.CHANNEL_SYSTEM == body.m_ucChannel) {
            // 处理gm指令的返回值
            this.handleGMMsg(body.m_szMessage);
        }
        let data: ChannelData = new ChannelData();
        data.id = body.m_ucChannel;
        data.displayMsg = body.m_szMessage;
        // 如果是我自己说的话的response，那么就标记isFromResp为true
        data.isFromResp = isFromResp;
        uts.deepcopy(body.m_stRoleID, data.roleAbstract.roleID);
        uts.deepcopy(body.m_stDestRoleID, data.dstRoleAbstract.roleID);
        if (isFromResp) {
            // 这是我主动发起的聊天
            data.roleAbstract.nickName = G.DataMgr.heroData.name;
            data.roleAbstract.prof = G.DataMgr.heroData.profession;
            data.roleAbstract.gender = G.DataMgr.heroData.gender;
            data.roleAbstract.lv = G.DataMgr.heroData.level;
            data.roleAbstract.vipLv = G.DataMgr.heroData.curVipLevel;
            data.isChatGM = 0 != (G.DataMgr.systemData.canOpenTagBits & Macros.OSS_WAIT_ISGM);
            data.roleAbstract.isOnline = true;
            //data.plat360VLevel = G.DataMgr.heroData.m_ucPlat360VLevel;
        }
        else {
            // 他人发起的
            data.roleAbstract.nickName = body.m_szNickName;
            data.roleAbstract.prof = body.m_cProfession;
            data.roleAbstract.gender = body.m_cGender;
            data.roleAbstract.lv = body.m_usLevel;
            data.roleAbstract.vipLv = body.m_ucVipLevel;
            data.isChatGM = 1 == body.m_ucGMTag;
            data.roleAbstract.isOnline = body.m_ucZoneID != 0;
            //data.plat360VLevel = notify.m_ucPlat360VLevel;
        }
        if (Macros.CHANNEL_PRIVATE == body.m_ucChannel) {
            // 私聊记录被聊者信息
            if (isFromResp) {
                // 这是我主动发起的聊天
                data.dstRoleAbstract.nickName = body.m_szNickName;
                data.dstRoleAbstract.prof = body.m_cProfession;
                data.dstRoleAbstract.gender = body.m_cGender;
                data.dstRoleAbstract.lv = body.m_usLevel;
                data.roleAbstract.isOnline = body.m_ucZoneID != 0;
            }
            else {
                // 他人发起的
                data.dstRoleAbstract.nickName = G.DataMgr.heroData.name;
                data.dstRoleAbstract.prof = G.DataMgr.heroData.profession;
                data.dstRoleAbstract.gender = G.DataMgr.heroData.gender;
                data.dstRoleAbstract.lv = G.DataMgr.heroData.level;
                data.dstRoleAbstract.isOnline = true;
            }
        }
        if (body.m_astMsgData != null && body.m_astMsgData[0].m_ucType == Macros.MSGDATATYPE_SEND_FLOWER) {
            //送花需要前台自己存放送花数据
            body.m_astMsgData[0].m_stValue.m_stRoleInfo = {} as Protocol.MsgRoleInfo;
            body.m_astMsgData[0].m_stValue.m_stRoleInfo.m_szNickName = body.m_szNickName;
            body.m_astMsgData[0].m_stValue.m_stRoleInfo.m_stRoleId = body.m_stRoleID;
        }
        this._decodeTextFormat(data, body.m_astMsgData);
        this._onReceiveData(data);
        if (Macros.CHANNEL_PRIVATE == body.m_ucChannel) {
            // 私聊对象加入最近联系人
            if (body.m_szNickName == G.DataMgr.heroData.name) {
                return;
            }
            if (isFromResp) {
                G.DataMgr.friendData.addRecentContract(body.m_stDestRoleID, body.m_szNickName, body.m_usLevel, body.m_cGender, body.m_cProfession);
            }
            else {
                G.DataMgr.friendData.addRecentContract(body.m_stRoleID, body.m_szNickName, body.m_usLevel, body.m_cGender, body.m_cProfession);
            }
        }
    }

    /**
     * 解析信息格式
     * @param data
     * @param msgDatas
     *
     */
    private _decodeTextFormat(data: ChannelData, msgDatas: Protocol.MsgData[] = null): void {
        let displayText: string = '';
        let tmpData: ChannelMsgData;
        let msgData: Protocol.MsgData;

        let result: RegExpExecArray; // 模式匹配结果
        let formatResult: RegExpExecArray; // 格式匹配结果
        let formatMatchedStr: string;
        let formattedStr: string;
        let formatValue: number = 0;

        let loopFlag: boolean = true;
        let subIndex: number = 0;
        let tmpStr: string = data.displayMsg;
        let startIndex: number = 0;
        let endIndex: number = 0;
        while (loopFlag) {
            // exec的返回是一个数组，其中元素 0 包含完全匹配的子字符串，其他元素（1 到 n）包含与正则表达式中的括号组相匹配的子字符串
            // index -- 匹配的子字符串在字符串中的字符位置
            // input -- 字符串 (str)
            result = ChatModule.regExp.exec(tmpStr);
            if (null == result) {
                // 没有匹配到模式
                loopFlag = false;
                tmpData = new ChannelMsgData();
                // 这是普通文本
                tmpData.msg = tmpStr;
                tmpData.data.m_ucType = tmpData.type = Macros.MSGDATATYPE_MAX;
                data.listMsgData.push(tmpData);

                displayText += tmpStr;
            }
            else {
                // 匹配到模式
                if (tmpStr.length == result[0].length) {
                    // 正行都被匹配
                    loopFlag = false;
                }
                else {
                    // 只是一部分
                    if (result.index > 0) {
                        // 放入前面的，没有模式描述，不需要格式化\
                        // 这是普通文本
                        tmpData = new ChannelMsgData();
                        tmpData.msg = tmpStr.substring(0, result.index);
                        tmpData.data.m_ucType = tmpData.type = Macros.MSGDATATYPE_MAX;
                        data.listMsgData.push(tmpData);
                        startIndex += tmpData.msg.length;
                        displayText += tmpData.msg;
                    }

                    subIndex = result.index + result[0].length;
                    if (subIndex < tmpStr.length) {
                        // 继续匹配剩下的
                        tmpStr = tmpStr.substr(subIndex);
                    }
                    else {
                        // 已经到行尾了，直接解析下一行
                        loopFlag = false;
                    }
                }

                // 解析格式
                tmpData = new ChannelMsgData();
                formatMatchedStr = result[1]; // 匹配的模式描述
                formattedStr = result[2]; // 匹配的被描述文本，可能是undefined

                // 优先解析超链接
                formatResult = ChatModule.uExp.exec(formatMatchedStr);
                if (null != formatResult) {
                    // 匹配到超链接模式
                    formatValue = parseInt(formatResult[1]);
                    msgData = msgDatas[formatValue];

                    if (Macros.MSGDATATYPE_GUILD_JIJIELING == msgData.m_ucType) {
                        // 宗门集结令增加一些文字
                        let jijielingText: string = '我在';
                        let vSceneID: number = msgData.m_stValue.m_stGuildJJL.m_uiSceneID;
                        if (vSceneID > 0) {
                            jijielingText += G.DataMgr.sceneData.getSceneName(vSceneID);
                        }
                        jijielingText += '发布了宗门集结令，';

                        let jjlData: ChannelMsgData = new ChannelMsgData();
                        jjlData.msg = jijielingText;
                        jjlData.data.m_ucType = jjlData.type = Macros.MSGDATATYPE_MAX;
                        data.listMsgData.push(jjlData);
                        startIndex += jijielingText.length;
                        displayText += jijielingText;
                    }

                    // 这是超链接数据
                    if (Macros.MSGDATATYPE_PET == msgData.m_ucType) {
                        // 散仙不需要下划线
                        tmpData.type = Macros.MSGDATATYPE_MAX;
                        this._decodeMsgData(msgData, tmpData);
                    }
                    else {
                        tmpData.type = msgData.m_ucType;
                        tmpData.data = uts.deepcopy(msgData, tmpData.data);
                        this._decodeMsgData(msgData, tmpData);
                    }
                    tmpData.startIndex = startIndex;
                    tmpData.endIndex = startIndex + tmpData.msg.length - 1;
                    startIndex = tmpData.endIndex + 1;
                    data.listMsgData.push(tmpData);
                }
                else {
                    // 匹配URL模式
                    formatResult = RegExpUtil.urlExp.exec(formatMatchedStr);
                    if (null != formatResult) {
                        let url: string = formatResult[1];
                        if (null != formattedStr) {
                            tmpData.msg = formattedStr;
                        }
                        else {
                            tmpData.msg = url;
                        }
                        tmpData.type = Macros.MSGDATATYPE_URL;
                        tmpData.url = url;
                        startIndex += tmpData.msg.length;
                        data.listMsgData.push(tmpData);
                    }
                    else {
                        // 匹配物品模式
                        formatResult = RegExpUtil.idExp.exec(formatMatchedStr);
                        if (null != formatResult) {
                            // 匹配到物品模式
                            formatValue = parseInt(formatResult[1]); // 第二个括号里面是物品ID
                            if (GameIDUtil.isSpecialID(formatValue)) {
                                // 这是货币
                                tmpData.msg = KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, formatValue);
                                tmpData.color = Color.getCurrencyColor(formatValue);

                                // 分号后面可以携带货币数量，也可以不携带
                                if (null != formattedStr) {
                                    // 有分号，那么最后1个括号匹配的就是货币数量
                                    tmpData.msg = formattedStr + tmpData.msg;
                                }
                            }
                            else if (GameIDUtil.isBagThingID(formatValue)) {
                                let thingConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(formatValue);
                                if (null != thingConfig) {
                                    tmpData.msg = '[' + thingConfig.m_szName + ']';
                                    tmpData.color = Color.getColorById(thingConfig.m_ucColor);
                                }
                                else {
                                    tmpData.msg = '[物品' + formatValue + ']';
                                    tmpData.color = Color.WHITE;
                                }

                                // 分号后面可以携带物品数量，也可以不携带
                                if (null != formattedStr) {
                                    // 有分号，那么最后1个括号匹配的就是货币数量
                                    tmpData.msg += '×' + formattedStr;
                                }
                            }
                            else if (GameIDUtil.isMonsterID(formatValue)) {
                                // 怪物ID
                                tmpData.msg = MonsterData.getMonsterConfig(formatValue).m_szMonsterName;
                                tmpData.color = Color.MONSTER;
                            }
                            else if (GameIDUtil.isSkillID(formatValue)) {
                                // 技能ID
                                let skillConfig: GameConfig.SkillConfigM = SkillData.getSkillConfig(formatValue);
                                tmpData.msg = skillConfig.m_szSkillName;
                                tmpData.color = Color.getColorById(skillConfig.m_ucSkillColor);
                            }
                            else {
                                if (defines.has('_DEBUG')) {
                                    uts.assert(false, '不受支持的ID：' + formatValue);
                                }
                            }
                        }
                        else {
                            // 再匹配神器
                            formatResult = RegExpUtil.sqExp.exec(formatMatchedStr);
                            if (null != formatResult) {
                            }
                            else {
                                // 再匹配翅膀等级
                                formatResult = RegExpUtil.wingLvExp.exec(formatMatchedStr);
                                if (null != formatResult) {
                                    let wingLv: number = parseInt(formatResult[1]);
                                    tmpData.msg = SpecialCharUtil.getMountJieDeng(wingLv);
                                    tmpData.color = Color.OTHER;
                                }
                                else {
                                    formatResult = RegExpUtil.dressLvExp.exec(formatMatchedStr);
                                    if (null != formatResult) {
                                        let dressLv: number = parseInt(formatResult[1]);
                                        tmpData.msg = SpecialCharUtil.getDressJieDeng(dressLv);
                                        tmpData.color = Color.OTHER;
                                    }

                                    else {
                                        // 再匹配翅膀模型
                                        formatResult = RegExpUtil.wingNameExp.exec(formatMatchedStr);
                                        if (null != formatResult) {
                                        }
                                        else {
                                            // 匹配其他模式，这些模式都是仅仅对文本进行修饰
                                            if (defines.has('_DEBUG')) {
                                                uts.assert(null != formattedStr, '不符合富文本CS规则：' + data.displayMsg);
                                            }

                                            // 再匹配预定义颜色
                                            formatResult = RegExpUtil.fixedColorExp.exec(formatMatchedStr);
                                            if (null != formatResult) {
                                                tmpData.color = RegExpUtil.getColor(formatResult);
                                            }
                                            else {
                                                // 优先匹配颜色模式
                                                formatResult = RegExpUtil.colorExp.exec(formatMatchedStr);
                                                if (null != formatResult) {
                                                    // 这是简单的具备颜色描述的普通文本
                                                    tmpData.color = formatResult[1];
                                                }
                                                else {
                                                    // 匹配男角色名称模式
                                                    //formatResult = RegExpUtil.menExp.exec(formatMatchedStr);
                                                    if (formatMatchedStr == RegExpUtil.menExp) {
                                                        tmpData.color = Color.BOY;
                                                    }
                                                    else {
                                                        // 匹配女角色名称模式
                                                        if (formatMatchedStr == RegExpUtil.femaleExp) {
                                                            tmpData.color = Color.GIRL;
                                                        }
                                                        else {
                                                            // 匹配宗门模式
                                                            formatResult = RegExpUtil.guildExp.exec(formatMatchedStr);
                                                            if (null != formatResult) {
                                                                tmpData.color = Color.GUILD;
                                                            }
                                                            else {
                                                                // 匹配国家模式
                                                                formatResult = RegExpUtil.countryExp.exec(formatMatchedStr);
                                                                if (null != formatResult) {
                                                                    tmpData.color = Color.COUNTRY;
                                                                }
                                                                else {
                                                                    // 匹配怪物模式
                                                                    formatResult = RegExpUtil.monsterExp.exec(formatMatchedStr);
                                                                    if (null != formatResult) {
                                                                        tmpData.color = Color.MONSTER;
                                                                    }
                                                                    else {
                                                                        // 匹配系统模式
                                                                        formatResult = RegExpUtil.systemExp.exec(formatMatchedStr);
                                                                        if (null != formatResult) {
                                                                            tmpData.color = Color.SYSTEM;
                                                                        }
                                                                        else {
                                                                            // 匹配场景模式
                                                                            formatResult = RegExpUtil.sceneExp.exec(formatMatchedStr);
                                                                            if (null != formatResult) {
                                                                                tmpData.color = Color.SCENE;
                                                                            }
                                                                            else {
                                                                                // 匹配职位模式
                                                                                formatResult = RegExpUtil.jobExp.exec(formatMatchedStr);
                                                                                if (null != formatResult) {
                                                                                    tmpData.color = Color.JOB;
                                                                                }
                                                                                else {
                                                                                    // 匹配活动模式
                                                                                    formatResult = RegExpUtil.activityExp.exec(formatMatchedStr);
                                                                                    if (null != formatResult) {
                                                                                        tmpData.color = Color.ACTIVITY;
                                                                                    }
                                                                                    else {
                                                                                        // 匹配其他模式
                                                                                        formatResult = RegExpUtil.otherExp.exec(formatMatchedStr);
                                                                                        if (null != formatResult) {
                                                                                            tmpData.color = Color.OTHER;
                                                                                        }
                                                                                        else {
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            // 这类
                                            tmpData.msg = formattedStr;
                                        }
                                    }
                                }
                            }
                        }
                        tmpData.type = Macros.MSGDATATYPE_MAX;
                        startIndex += tmpData.msg.length;
                        data.listMsgData.push(tmpData);
                    }
                }
                displayText += tmpData.msg;
            }
        }
        data.displayMsg = displayText;
    }

    private _decodeMsgData(data: Protocol.MsgData, out: ChannelMsgData): void {
        let type: number = data.m_ucType;
        let text: string;
        let color: string;
        if (Macros.MSGDATATYPE_ROLE_INFO == type) {
            // 角色
            let roleInfo: Protocol.MsgRoleInfo = data.m_stValue.m_stRoleInfo;
            text = roleInfo.m_szNickName;
            color = KeyWord.GENDERTYPE_BOY == roleInfo.m_ucGender ? Color.BOY : Color.GIRL; // 这个字段表示性别
        }
        else if (Macros.MSGDATATYPE_THING == type) {
            // 物品
            let thingId: number = data.m_stValue.m_stThing.m_iThingID;
            if (GameIDUtil.isSkillID(thingId)) {
                // 技能
                let skillConfig: GameConfig.SkillConfigM = SkillData.getSkillConfig(thingId);
                if (null != skillConfig) {
                    text = skillConfig.m_szSkillName;
                    color = Color.getColorById(skillConfig.m_ucSkillColor);
                }
                else {
                    text = '[技能' + thingId + ']';
                }
            }
            else if (GameIDUtil.isSpecialID(thingId)) {
                text = '[' + KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, thingId) + ']';
                color = Color.getCurrencyColor(thingId);
            }
            //if (GameIDUtil.isLhID(thingId)) {
            //    //let lhCfg: GameConfig.CrystalConfigM = G.DataMgr.lhData.getCfgById(thingId);
            //    //if (null != lhCfg) {
            //    //    text = '[' + lhCfg.m_szCrystalName + SpecialCharUtil.getHanNum(EnumLhRule.getStageByColor(lhCfg.m_iCrystalColor)) + '阶' + ']';
            //    //    color = Color.getColorById(lhCfg.m_iCrystalColor);
            //    //}
            //    //else {
            //    //    text = '[猎魂' + thingId + ']';
            //    //}
            //    //text = '[猎魂' + thingId + ']';
            //    text = "";
            //}

            else {
                let thingConfig: GameConfig.ThingConfigM = ThingData.getThingConfig(thingId);
                if (null != thingConfig) {
                    text = '[' + thingConfig.m_szName + ']';
                    color = Color.getColorById(thingConfig.m_ucColor);
                }
                else {
                    text = '[物品' + thingId + ']';
                }
            }
        }
        else if (Macros.MSGDATATYPE_PROP == type) {
            // 道具或物品
            let propInfo: Protocol.MsgDataPropThing = data.m_stValue.m_stPropThing;
            let thingConfig2: GameConfig.ThingConfigM = ThingData.getThingConfig(propInfo.m_iThingID);
            if (null != thingConfig2) {
                text = '[' + thingConfig2.m_szName + ']';
                color = Color.getColorById(thingConfig2.m_ucColor);
            }
            else {
                text = '[物品' + propInfo.m_iThingID + ']';
            }
        }
        else if (Macros.MSGDATATYPE_PET == type) {
            // 散仙
            let petInfo: Protocol.MsgDataPropThing = data.m_stValue.m_stPetInfo;
            let petConfig: GameConfig.BeautyAttrM = PetData.getPetConfigByPetID(petInfo.m_iThingID);
            if (null != petConfig) {
                text = '[' + petConfig.m_szBeautyName + ']';
                color = Color.ORANGE;
            }
            else {
                text = '[ 伙伴' + petInfo.m_iThingID + ']';
            }
        }
        else if (Macros.MSGDATATYPE_VOICE_INFO == type) {
            // 不处理
            text = '';
        }
        else if (Macros.MSGDATATYPE_DRESSLEVELUP == type) {
            // 时装升级
            text = '我也要升级';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_ENTER_GUILD_ZONE == type) {
            //进入宗门领地
            text = '马上前往';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_CHAT_DICE == type) {
            // 骰子
            text = '[骰子' + data.m_stValue.m_ucDiceNum + ']';
        }
        else if (Macros.MSGDATATYPE_GUOYUN == type) {
            // 国运求救
            text = '我要救TA';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_COUNTRY_CHAT_SEND_POS == type) {
            // 国家穿云箭
            text = '一起上';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_GUILD_CHAT_SEND_POS == type) {
            // 宗门穿云箭
            text = '我去救援';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_GUILD_JIJIELING == type) {
            // 宗门集结令
            text = '前往相会';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_GUILDCREATE == type) {
            // 创建宗门
            text = '申请加入';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_SKYLOTTERY == type) {
            // 魔帝宝库
            text = '我也要探宝';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_TREASURE_PANEL == type) {
            // 兑换
            text = '我也要兑换';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_MJLOTTERY == type) {
            // 天宫秘镜
            text = '我也要探宝';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_EQUIPSTRENG == type) {
            // 装备强化
            text = '我也要强化';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_EQUIPWASH == type) {
            // 装备锻造
            text = '我也要锻造';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_EQUIPUPCOLOR == type) {
            // 装备颜色
            text = '我也要升阶';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_GETPET == type) {
            // 散仙招募
            text = '我也要激活';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_MOUNTUPLEVEL == type || Macros.MSGDATATYPE_WUHUNUPLEVEL == type || Macros.MSGDATATYPE_WINGSTRENG == type || Macros.MSGDATATYPE_BEAUTY_STAGEUP == type) {
            //|| Macros.MSGDATATYPE_FAZHEN == type || Macros.MSGDATATYPE_ZUJI == type
            // 坐骑等级
            text = '我要进阶';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_EQUIPUPLEVEL == type) {
            // 装备升级
            text = '我也要升级';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_DIAMONDINSERT == type) {
            // 宝石镶嵌
            text = '我也要镶嵌';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_DIAMONDMERGE == type) {
            // 宝石合成
            text = '我也要合成';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_STARMERGE == type) {
            // 星石合成
            text = '我也要合成';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_PETJWELMERGE == type) {
            // 散仙宝石合成
            text = '我也要合成';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_PETSTRONG == type) {
            // 散仙强化
            text = '我也要强化';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_XUKONGZHANCHANG == type) {
            // 虚空战场
            text = '虚空战场';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_SHILIANZHIDI == type) {
            // 试炼之地
            text = '试炼之地';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_VIP_PANEL == type) {
            // 打开VIP面板
            text = '我也要成为VIP';
            color = Color.VIP;
        }
        else if (Macros.MSGDATATYPE_FIRST_CHARGE == type) {
            // 打开首充礼包面板
            text = '我也要领取';
            color = Color.VIP;
        }
        else if (Macros.MSGDATATYPE_DAILY_CHARGE == type) {
            // 打开每日首充礼包面板
            text = '我也要领取';
            color = Color.VIP;
        }
        else if (Macros.MSGDATATYPE_CHARGE_REWARD == type || Macros.MSGDATATYPE_MERGE_CHARGE == type) {
            // 打开VIP达成礼包面板
            text = '我也要领取';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_GROUPBUY == type) {
            // 打开团购面板
            text = '我也要团购';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_JBP_INFO == type || Macros.MSGDATATYPE_YBWL_JOIN == type) {
            // 打开聚宝盆面板
            text = '我也要领取';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_MC_FINAL == type) {
            // 比武大会决赛
            text = '现在就去';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_TXXM_JOIN == type) {
            text = '马上支援';
            color = Color.GREEN;
        }
        else if (Macros.MSGDATATYPE_JSCL_INFO == type) {
            text = '我也要领取';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_YBWL_JOIN == type) {
            text = '我也要领取';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_HLZP_JOIN == type) {
            text = '我也要参加';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_XYZP_JOIN == type) {
            text = '我也要参加';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_HLFP_INFO == type) {
            text = '我也要参加';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_HLTB_JOIN == type) {
            text = '我也要探宝';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_MOUNTSUHUN == type) {
            text = '我也要修灵';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_WINGSUHUN == type) {
            text = '我也要炼羽';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_EQUIPSUHUN == type) {
            text = '我也要雕琢';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_POSITION == type) {
            text = '我要前往';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_ZZZD == type) {
            text = '我也要参与';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_DUANWU == type) {
            text = '我也要参与';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_PINSTANCE_INFO == type) {
            let rti: Protocol.MsgDataPinstanceInfo = data.m_stValue.m_stPinstanceInfo;
            let pconf: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(rti.m_uiPinstanceID);
            if (defines.has('_DEBUG')) {
                uts.assert(null != pconf, '艹，招募队友哪个副本啊艹！');
            }
            //				text = pconf.m_szName;
            if (rti.m_uiPinstanceID == Macros.PINSTANCE_ID_WST || rti.m_uiPinstanceID == Macros.PINSTANCE_ID_SHNS) {
                text = '我要上榜';
            }
            else if (rti.m_uiPinstanceID == Macros.PINSTANCE_ID_ZRJT_1 || rti.m_uiPinstanceID == Macros.PINSTANCE_ID_ZRJT_2 || rti.m_uiPinstanceID == Macros.PINSTANCE_ID_ZRJT_3) {
                text = '我要挑战';
            }
            else {
                text = pconf.m_szName;
            }

            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_RECRUIT_TEAM_INFO == type) {
            if (data.m_stValue.m_stRecruitTeamInfo.m_uiPinstanceID != Macros.PINSTANCE_ID_FUQI) {
                text = '我要加入';
                color = Color.ORANGE;
            }
        }
        else if (Macros.MSGDATATYPE_SC_GET == type) {
            text = '我也要领取';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_ROLE_SC_GET == type) {
            text = '我也要领取';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_SEND_FLOWER == type) {
            text = '回赠';
            color = Color.GREEN;
        }
        else if (Macros.MSGDATATYPE_GUILD_XB == type) {
            text = '我也要领取';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_PPSTORECALL == type) {
            text = '我要购买';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_MONTHVIP_PANEL == type) {
            text = '我也要';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_JUYUAN_STAGEUP == type) {
            text = '我也要提升';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_WORLDBOSS_PANEL == type || Macros.MSGDATATYPE_FENGMOTA_PANEL == type || Macros.MSGDATATYPE_FMT_BOSS_PANEL == type) {
            text = '前往夺取';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_REDBAG == type) {
            text = '我也发红包';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_GRJJC == type) {
            if (data.m_stValue.m_ucGRJJType == Macros.GRJJC_TYPE_TMB) {
                text = '我也要争夺';
            }
            else if (data.m_stValue.m_ucGRJJType == Macros.GRJJC_TYPE_JSTZ) {
                text = '我也要挑战';
            }
            else {
                text = '我也要神职';
            }
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_WORLDBOSS_DIG == type) {
            text = '我要挖宝';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_GUILDPVP_PANEL == type) {
            text = '我要争霸';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_QIFU_PANEL == type) {
            text = '我要祈福';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_IMAGE == type) {
            text = '我要幻化';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_MARRY == type) {
            text = '我要结婚';
            color = Color.ORANGE;
        }
        //else if (Macros.MSGDATATYPE_KFLJCZ == type) {
        //    text = '我要领取';
        //    color = Color.ORANGE;
        //}
        else if (Macros.MSGDATATYPE_LJCZ == type) {
            text = '我要领取';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_HFLJCZ == type) {
            text = '我要领取';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_DDL == type) {
            text = '我也要祈福';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_BFQD_DRAW == type) {
            text = '我要参加';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_WJ_EXCHANGE == type) {
            text = '我也要兑换';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_TX_EXCHANGE == type) {
            text = '我也要兑换';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_LCACT_PANEL == type) {
            text = '我也要领取';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_XSYG_PANEL == type) {
            text = '我也要云购';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_LHJ_JOIN == type) {
            text = '我也摇摇';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_EQUIPLQ_PANEL == type) {
            text = '我也要附魔';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_CRYSTAL == type) {
            text = '我也要猎魂';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_CHARGE_REDBAG == type) {
            text = '我也要红包';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_BBGS_PANEL == type) {
            text = '我也要参加';
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_DRESSPROP == type) {
            // 装备收集
            let dressInfo: Protocol.MsgDataDressProp = data.m_stValue.m_stDressProp;
            let cfg: GameConfig.DressImageConfigM = ThingData.getDressImageConfig(dressInfo.m_uiThingId);
            text = cfg.m_szModelName;
            color = Color.ORANGE;
        }
        else if (Macros.MSGDATATYPE_XZFM_HELP == type) {
            text = '立即前往';
            color = Color.ORANGE;
        }
        else {
            // 默认都是我也要
            text = '我也要';
            color = Color.ORANGE;
        }
        out.msg = text;

        if (null != color) {
            out.color = color;
        }
    }

    private _onReceiveData(data: ChannelData): void {
        if (data.id == Macros.CHANNEL_CHUANWEN) {
            data.id = Macros.CHANNEL_SYSTEM;
        }
        let time: number = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000);
        let noRecord: boolean;
        for (let msgData of data.listMsgData) {
            msgData.time = time;
            if (Macros.MSGDATATYPE_CHAT_DICE == msgData.data.m_ucType) {
                noRecord = true;
            }
        }
        // 存入数据
        if (data.isFromResp && !noRecord) {
            // 自己的发言存入记录
            G.DataMgr.chatData.saveChannelData(data);
        }
        G.DataMgr.chatData.addChatData(data);


        // 刷新显示
        if (Macros.CHANNEL_PRIVATE != data.id) {
            if (data.id == Macros.CHANNEL_NEARBY) {
                if (G.ViewCacher.popWordView.isOpened) {
                    G.ViewCacher.popWordView.addPopWord(uts.format("[00FF00]{0}[-]:{1}", data.roleAbstract.nickName, data.toRichText()), data.roleAbstract.vipLv);
                }
            }

            // 贵族不在面板显示   
            G.ViewCacher.chatView.appendText(data, false);
            G.ViewCacher.mainView.mainChatCtrl.appendText(data, false);
            if (data.id == Macros.CHANNEL_SPEAKER) {
                let showInfo = "/icon" + data.roleAbstract.nickName + "说:" + data.toRichText();
                G.TipMgr.addMainFloatTip(showInfo, FloatShowType.LaBa);
            }
        }
        if (Macros.CHANNEL_GUILD == data.id) {
            //if (null != this.m_guildChatDialog && this.m_guildChatDialog.isShowing) {
            //    this.m_guildChatDialog.appendText(data);
            //}
            //else if (data.roleAbstract.roleID.m_uiUin > 0 && G.DataMgr.heroData.uin != data.roleAbstract.roleID.m_uiUin) {
            //    m_manager.remindIconCtrl.showOrHideGuildChat(true);
            //}
        }
        else if (Macros.CHANNEL_PRIVATE == data.id) {
            let ra: RoleAbstract = data.isFromResp ? data.dstRoleAbstract : data.roleAbstract;
            uts.log("charModule: data: " + JSON.stringify(ra));
            let friendPanel = G.Uimgr.getSubFormByID<FriendPanel>(FriendView, FriendViewTab.FriendPanel);
            if (friendPanel != null) {
                friendPanel.appendText(data, false);
            }
            let friendView = G.Uimgr.getForm<FriendView>(FriendView);
            if (friendView == null) {
                //在按钮加提示
                if (!CompareUtil.isRoleIDEqual(ra.roleID, G.DataMgr.heroData.roleID)) {
                    G.ViewCacher.mainView.mainChatCtrl.friendChatHint(ra);
                }
            }
        }
    }

    private isRefuseMessage(roleID: Protocol.RoleID): boolean {
        //勾选了拒绝陌生人消息，且对方不是朋友时不弹出图标
        if (!G.DataMgr.settingData.IsAcceptAnomous && !G.DataMgr.friendData.isMyFriend(roleID)) {
            return true;
        }
        return false;
    }

    /**
     * gm指令响应
     * @param msg
     *
     */
    private _onGMChatResponse(body: Protocol.GameMaster_Response): void {
        this.appendSystemMsg(uts.format('GM: {0}', body.m_ushResultID), false);
    }

    /**
     * 显示怪物信息，测试用
     * @param msg
     *
     */
    private _onShowMonsterInfo(msg: string): void {
        //if (null == this.m_chatPannel) {
        //    return;
        //}
        let data: ChannelData = new ChannelData();
        data.id = Macros.CHANNEL_SYSTEM;
        let tmpData: ChannelMsgData = new ChannelMsgData();
        tmpData.msg = msg;
        tmpData.type = Macros.MSGDATATYPE_MAX;
        data.listMsgData.push(tmpData);
        // 存入数据
        G.DataMgr.chatData.addChatData(data);

        // 刷新显示 
    }

    /**
    * 怪物喊话。
    * @param msg
    *
    */
    private _onMonsterTalk(msg: string): void {
        //if (null == this.m_chatPannel) {
        //    return;
        //}
        let data: ChannelData = new ChannelData();
        data.id = Macros.CHANNEL_CHUANWEN;
        let tmpData: ChannelMsgData = new ChannelMsgData();
        tmpData.msg = msg;
        tmpData.type = Macros.MSGDATATYPE_MAX;
        data.listMsgData.push(tmpData);
        // 刷新显示 
        G.ViewCacher.chatView.appendText(data, false);
        G.ViewCacher.mainView.mainChatCtrl.appendText(data, false);
    }

    /**
    * 系统消息频道
    * @param msg
    *
    */
    appendSystemMsg(msg: string, needRecord: boolean, force: boolean = false, msgDatas: Protocol.MsgData[] = null): void {
        // GM消息		
        let data: ChannelData = new ChannelData();
        data.id = Macros.CHANNEL_SYSTEM;
        data.displayMsg = msg;
        this._decodeTextFormat(data, msgDatas);
        // 存入数据
        if (needRecord) {
            G.DataMgr.chatData.addChatData(data);
        }
        // 刷新显示
        G.ViewCacher.chatView.appendText(data, force);
        G.ViewCacher.mainView.mainChatCtrl.appendText(data, force, false);
    }

    /**
     * oss消息(系统消息频道)
     * @param msg
     *
     */
    appendOssMsg(msg: string): void {
        // GM消息		
        let data: ChannelData = new ChannelData();
        data.id = Macros.CHANNEL_SYSTEM;
        data.displayMsg = msg;
        this._decodeTextFormat(data, null);
        // 刷新显示
        G.ViewCacher.chatView.appendText(data, false);
        G.ViewCacher.mainView.mainChatCtrl.appendText(data, false, true);
    }

    /**
    * gm消息
    * @param msg
    *
    */
    private _onGMChatNotify(body: Protocol.GameMaster_Notify): void {
        //if (null == this.m_chatPannel) {
        //    return;
        //}
        let data: ChannelData;
        let tmpData: ChannelMsgData;

        if (body.m_cSystemMessageType == Macros.GM_TYPE_WARNING) {
            G.TipMgr.addMainFloatTip(body.m_szSystemMessage);
        }
        else {
            // GM消息或脚本日志	
            data = new ChannelData();
            data.id = Macros.CHANNEL_SYSTEM;
            data.displayMsg = body.m_szSystemMessage;
            this._decodeTextFormat(data, null);
            // 存入数据(先暂时注释,有需要在打开)
            G.DataMgr.chatData.addChatData(data);


            // 刷新显示
            G.ViewCacher.chatView.appendText(data, false);
            G.ViewCacher.mainView.mainChatCtrl.appendText(data, false, false);
            if (body.m_cSystemMessageType == Macros.GM_TYPE_COMMAND) {
                this.handleGMMsg(body.m_szSystemMessage);
            }
        }
    }

    private _onPromptMessageNotify(body: Protocol.PromptMessageNotify): void {
        // 检查是否需要屏蔽
        // if (Macros.OSS_MSG_TAG == body.m_uiTypeValue) {
        //        if (Macros.LOGINOUT_REAZON_CROSSPIN == G.DataMgr.systemData.crtLoginoutReason && Macros.PLAT_FORM_LINK_1 == G.DataMgr.gameParas.platformType && PlatformData.getLinkPlatID() != PlatformData.getLinkPaltIDByServerID(m_manager.gameParas.worldID)) {
        //            return;
        //        }
        // }

        if (ErrorId.EQEC_Move_NoPath == body.m_iID) {
            G.DataMgr.runtime.isWaitTransprotResponse = false;
        }
        let errorMessage: string = G.DataMgr.errorData.getErrorStringById(body.m_iID);
        let paraNum: number = body.m_stParaList.m_ucNumber;
        //if (Macros.PROMPTMSG_TYPE_EFFECT == body.m_ucType) {
        //    let num: number = 0;
        //    let arrx: string[] = errorMessage.split('%d').join('%s').split('%s');
        //    let lenx: number = arrx.length;
        //    let paramx: Protocol.PromptParameter;
        //    for (let j: number = 0; j < lenx; j++) {
        //        if (j < paraNum) {
        //            paramx = body.m_stParaList.m_astParameter[j];
        //            if (paramx.m_ucType == Macros.PROMPTMSG_EFFECT_MARRY1) {
        //                num = EnumFlowerRule.FLOWER_NUM_99;
        //            }
        //            else if (paramx.m_ucType == Macros.PROMPTMSG_EFFECT_MARRY2) {
        //                num = EnumFlowerRule.FLOWER_NUM_999;
        //            }
        //        }
        //    }
        //    // 播放特效
        //    this.dispatchEvent(Events.OpenCloseFlowerEffectDialog, num, DialogCmd.open);
        //}
        let str: string;
        if (paraNum > 0) {
            let arr: string[] = errorMessage.split('%d').join('%s').split('%s');
            let curr: number = 0;
            str = '';
            let len: number = arr.length;
            let param: Protocol.PromptParameter;
            for (let i: number = 0; i < len; i++) {
                if (i < paraNum) {
                    param = body.m_stParaList.m_astParameter[i];
                    if (Macros.PROMPT_PARAMETER_TYPE_INTEGER == param.m_ucType) {
                        str += arr[i] + param.m_stValue.m_iParameter;
                    }
                    else if (Macros.PROMPT_PARAMETER_TYPE_STRING == param.m_ucType) {
                        str += arr[i] + param.m_stValue.m_szParameter;
                    }
                }
                else {
                    str += arr[i];
                }
            }
        }
        else {
            str = errorMessage;
        }
        if (body.m_ucType == Macros.RPOMPTMSG_TYPE_SYSTEM) {
            if (Macros.OSS_MSG_TAG == body.m_uiTypeValue) {
                this.appendOssMsg(str);
            }
            else {
                this.appendSystemMsg(str, true);
            }
        }
        else {
            if (body.m_ucType == Macros.PROMPTMSG_TYPE_MIDDLE) {
                //此处return,以前页游是显示两条,目前规则显示一条即可,所以在Thingdata处理即可
                return;
            }
            if (body.m_ucType == Macros.PROMPTMSG_TYPE_MONSTER_COMMING) {

                let str: string;
                str = '';
                let param: Protocol.PromptParameter;
                if (paraNum > 0) {
                    for (let i: number = 0; i < body.m_stParaList.m_astParameter.length; i++) {
                        param = body.m_stParaList.m_astParameter[i];
                        if (Macros.PROMPT_PARAMETER_TYPE_INTEGER == param.m_ucType) {
                            str += param.m_stValue.m_iParameter;
                        }
                        else if (Macros.PROMPT_PARAMETER_TYPE_STRING == param.m_ucType) {
                            str += param.m_stValue.m_szParameter;
                        }
                    }
                }

                let cfg = MonsterData.getMonsterConfig(body.m_uiTypeValue);
                let bosstipview = G.Uimgr.getForm<BossTipView>(BossTipView);
                if (bosstipview != null && cfg != null) {
                    bosstipview.updatePanel(cfg.m_iHeadID, str);
                }
            } else {
                G.TipMgr.addMainFloatTip(RegExpUtil.xlsDesc2Html(str), body.m_ucType, body.m_uiTypeValue);

            }
        }
        //    if (str.indexOf('背包剩余空位") != -1)
        //UIUtils.checkGotoRongLianPanel(G.DataMgr.thingData.getBagRemainNum());


    }

    /**
     * 拷贝名字到聊天框
     * @param name
     *
     */
    copyNameToChat(name: string): void {
        //if (null == this.m_chatPannel) {
        //    return;
        //}

        //this.m_chatPannel.copyNameToChat(name);
    }

    private handleGMMsg(message: string) {
        let typeend = message.indexOf('|');
        if (typeend < 0) return;

        let msgtype = message.substr(0, typeend);
        if (msgtype == 'SYSTEMLOGIN') { // GM 登录其他用户账号
            let segments = message.split('|');
            let sign = segments[1];
            let time = segments[2];
            let uin = segments[3];
            let server = segments[4];

            let openid = segments[5]; // 防止openid中包含|分割符
            for (let i = 6; i < segments.length; i++) openid += ('|' + segments[i]);

            Game.MemValueRegister.RegBool('loginother', true);
            Game.MemValueRegister.RegString('loginother:sign', sign);
            Game.MemValueRegister.RegString('loginother:time', time);
            Game.MemValueRegister.RegString('loginother:uin', uin);
            Game.MemValueRegister.RegString('loginother:server', server);
            Game.MemValueRegister.RegString('loginother:openid', openid);

            G.reloadGame(false);
        }
    }
}