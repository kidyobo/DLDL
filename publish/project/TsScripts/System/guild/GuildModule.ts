import { ActHomeView } from "System/activity/actHome/ActHomeView";
import { MingJiangData } from "System/data/MingJiangData";
import { MonsterData } from "System/data/MonsterData";
import { EventDispatcher } from "System/EventDispatcher";
import { Global as G } from "System/global";
import { GuildTools } from "System/guild/GuildTools";
import { GuildApplicationView } from "System/guild/view/GuildApplicationView";
import { GuildEnterPanel } from "System/guild/view/GuildEnterPanel";
import { GuildExchangeView } from "System/guild/view/GuildExchangeView";
import { EnumGuildJingPaiSubTab } from "System/guild/view/GuildJingPaiPanel";
import { GuildStoreSubPanel } from "System/guild/view/GuildStoreSubPanel";
import { GuildView } from "System/guild/view/GuildView";
import { EnumMainViewChild, MainView } from "System/main/view/MainView";
import { MapId } from "System/map/MapId";
import { BossView } from "System/pinstance/boss/BossView";
import { MingJiangRankView } from "System/pinstance/boss/MingJiangRankView";
import { PinstanceOperateView } from "System/pinstance/PinstanceOperateView";
import { ErrorId } from "System/protocol/ErrorId";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { ConfirmCheck, MessageBoxConst } from "System/tip/TipManager";
import { CompareUtil } from "System/utils/CompareUtil";
import { InvitingPlayerView } from "System/team/InvitingPlayerView";

/**
 * 该类为宗门功能控制器
 *
 */
export class GuildModule extends EventDispatcher {
    constructor() {
        super();
        this.addNetListener(Macros.MsgID_Guild_Notify, this._onGuildNotify);
        this.addNetListener(Macros.MsgID_Guild_CS_Response, this._onGuildResponse);
        this.addNetListener(Macros.MsgID_Guild_ChangedNotify, this.onGuildChangedNotify);
        this.addNetListener(Macros.MsgID_Guild_PVP_CS_Response, this.onGuildPvPResponse);
        this.addNetListener(Macros.MsgID_Guild_CROSSPVP_CS_Response, this.onGuildCrossPvpCsResponse);
    }

    private _onGuildNotify(notify: Protocol.Guild_Notify): void {
        // 新申请
        if (Macros.GUILD_NOTIFY_PROCESS_APPLY == notify.m_usType) {
            this._processGuildGradeChange();
        }
        //宗门申请列表通知
        else if (notify.m_usType == Macros.GUILD_NOTIFY_APPLY_GUILD_LIST) {
            G.DataMgr.guildData.auiGuildIDArray = notify.m_stValue.m_stApplyNotity.m_auiGuildIDArray;
            let guildView = G.Uimgr.getForm<GuildView>(GuildView);
            if (guildView != null) {
                guildView.onGuildListChanged();
            }
        }
        else if (notify.m_usType == Macros.GUILD_NOTIFY_MONEY) {
            G.DataMgr.guildData.guildAbstract.m_uiGuildMoney = notify.m_stValue.m_stMoneyNotify.m_uiMoney;
            let guildView = G.Uimgr.getForm<GuildView>(GuildView);
            if (guildView != null) {
                guildView.onGuildInfoChanged();
            }
        }
        //被踢
        else if (notify.m_usType == Macros.GUILD_NOTIFY_KICK_OUT) {
            this._processQuitGuild();
            G.TipMgr.addMainFloatTip('你已经被逐出宗门');
            let guildView = G.Uimgr.getForm<GuildView>(GuildView);
            if (guildView != null) {
                guildView.onGuildInfoChanged();
            }
            G.MainBtnCtrl.setBtnGuildChatStatus();
        }
        //解散
        else if (notify.m_usType == Macros.GUILD_NOTIFY_DISMISS) {
            this._processQuitGuild();
            G.TipMgr.addMainFloatTip('您的宗门已被宗主解散了');
            let guildView = G.Uimgr.getForm<GuildView>(GuildView);
            if (guildView != null) {
                guildView.onGuildInfoChanged();
            }
            G.MainBtnCtrl.setBtnGuildChatStatus();
        }
        else if (Macros.GUILD_NOTIFY_GRADE_CHANGE == notify.m_usType) {
            // 宗门职称变化
            let gradeChangeNtf: Protocol.Guild_RoleGradeChange_Notify = notify.m_stValue.m_stGradeChangeNotify;
            if (CompareUtil.isRoleIDEqual(G.DataMgr.heroData.roleID, gradeChangeNtf.m_stTargetRoleID)) {
                // 自己的职位发生变化
                G.DataMgr.guildData.grade = gradeChangeNtf.m_usGrade;
                G.DataMgr.heroData.guildGrade = gradeChangeNtf.m_usGrade;
                this._processGuildGradeChange();
            }
            let guildView = G.Uimgr.getForm<GuildView>(GuildView);
            if (guildView != null) {
                guildView.onGuildInfoChanged();
            }
            // 通知场景刷新角色头顶信息
            G.ModuleMgr.unitModule.onGuildGradeChange(gradeChangeNtf.m_stTargetRoleID, gradeChangeNtf.m_usGrade);
        }
        else if (Macros.GUILD_NOTIFY_TREASURE_HUNT_STEP_CHANGE == notify.m_usType) {
            let n = notify.m_stValue.m_stGuildTreasureHuntStepChangeNotify
            G.DataMgr.guildData.updateExploreInfo(n.m_stCommonData, n.m_stPersonalData);
        }
        else if (Macros.GUILD_NOTIFY_ZZHC_BOSSLEVEL == notify.m_usType) {
            // notify.m_stValue.m_stZZHCBossLevelNotify;
        }
    }

    /**
     * 宗门总协议回复
     * @param msg
     *
     */
    private _onGuildResponse(response: Protocol.Guild_CS_Response): void {
        if (ErrorId.EQEC_Success != response.m_iResultID) {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResultID));
            /** 10773 出价不合法,无法竞拍*/
            if (response.m_iResultID == 10773) {
                let guildView = G.Uimgr.getForm<GuildView>(GuildView);
                if (response.m_usType == Macros.GUILD_PAIMAI_BUY_GUILD) {
                    G.DataMgr.guildData.updatePaiMaiGuild(response.m_stValue.m_stPaiMaiBuyGuild);
                    if (guildView != null) {
                        guildView.onGuildPaiMaiInfoChanged(response.m_usType);
                    }
                } else if (response.m_usType == Macros.GUILD_PAIMAI_BUY_WORLD) {
                    G.DataMgr.guildData.updatePaiMaiWorld(response.m_stValue.m_stPaiMaiBuyWorld);
                    if (guildView != null) {
                        guildView.onGuildPaiMaiInfoChanged(response.m_usType);
                    }
                }
            }


            if (Macros.GUILD_MJTZ_RAISE == response.m_usType) {
                G.DataMgr.mingJiangData.buffRemainTime = MingJiangData.MAX_ADD_BUFF_TIME;
            }
            if (Macros.GUILD_STORE_DELETE != response.m_usType &&
                Macros.GUILD_STORE_TAKEOUT != response.m_usType &&
                Macros.GUILD_STORE_INTO != response.m_usType) {
                return;
            }
        }

        let guildView: GuildView = G.Uimgr.getForm<GuildView>(GuildView);
        switch (response.m_usType) {
            //查看帮派列表
            case Macros.GUILD_GET_GUILD_LIST:
                G.DataMgr.guildData.m_stGuildList = response.m_stValue.m_stGetGuildList.m_stGuildList;
                if (guildView != null) {
                    guildView.onGuildListChanged();
                }
                break;

            //创建宗门
            case Macros.GUILD_CREATE_GUILD:
                G.TipMgr.addMainFloatTip('您已成功创建了宗门！', Macros.PROMPTMSG_TYPE_MIDDLE);

                let heroData = G.DataMgr.heroData;
                heroData.guildId = response.m_stValue.m_stCreteGuild.m_uiGuildID;
                heroData.guildName = response.m_stValue.m_stCreteGuild.m_szGuildName;
                heroData.guildGrade = Macros.GUILD_GRADE_CHAIRMAN;
                heroData.guildJoinTime = Math.floor(G.SyncTime.getCurrentTime() / 1000);

                //关闭宗门创建面板
                G.Uimgr.closeForm(GuildEnterPanel);
                // 直接打开宗门面板
                if (guildView != null) {
                    guildView.onGuildEnterSuccess();
                    guildView.onGuildInfoChanged();
                }
                G.GuideMgr.tipMarkCtrl.onGuildGiftChange();
                G.MainBtnCtrl.setBtnGuildChatStatus();
                break;

            //查看宗门成员列表
            case Macros.GUILD_GET_GUILD_MEMBER_LIST_INFO:
                G.DataMgr.guildData.updateGuildMemberList(response.m_stValue.m_stMyMemberResponse.m_stGuildMemberList);

                if (guildView != null) {
                    guildView.onGuildMembersChanged();
                }

                let invitingPlayerView = G.Uimgr.getForm<InvitingPlayerView>(InvitingPlayerView);
                if (invitingPlayerView != null) {
                    invitingPlayerView.onRefreshMyGuildData();
                }
                break;

            //查看设申请者列表
            case Macros.GUILD_GET_GUILD_CHECK_LIST_INFO:
                let applicationInfos: Protocol.GuildApplicantInfo[] = response.m_stValue.m_stApplicantListResponse.m_stApplicantList.m_astApplicantInfo;
                G.DataMgr.guildData.applicationInfoList = applicationInfos;

                this.processApplicationChanged();
                break;

            //批准拒绝的要刷新重拉
            case Macros.GUILD_CHECK_JOIN:
                let applyListCache: Protocol.GuildApplicantInfo[] = G.DataMgr.guildData.applicationInfoList;

                if (applyListCache != null) {
                    let count: number = applyListCache.length;
                    for (let i: number = 0; i < count; i++) {
                        if (CompareUtil.isRoleIDEqual(applyListCache[i].m_stRoleID, response.m_stValue.m_stApproveResponse.m_stTargetRoleID)) {
                            applyListCache.splice(i, 1);
                            break;
                        }
                    }
                }

                this.processApplicationChanged();

                // 拉取新的成员列表
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.fetchGuildMembers());
                break;

            //宗门基本信息
            case Macros.GUILD_GET_GUILD_ABSTRACT_INFO:
                G.DataMgr.guildData.guildAbstract = response.m_stValue.m_stGetGuildAbstractInfo;
                // 拉到职位了，处理职位变化
                this._processGuildGradeChange();
                if (guildView != null) {
                    guildView.onGuildInfoChanged();
                }
                G.GuideMgr.tipMarkCtrl.onGuildGiftChange();
                break;

            //指派职位
            case Macros.GUILD_SET_POSITION:
                let updateGradeResp = response.m_stValue.m_stUpdateGradeResponse;
                G.DataMgr.guildData.processSetPosition(updateGradeResp.m_stTargetRoleID, updateGradeResp.m_ushGuildGrade);
                if (guildView != null) {
                    guildView.onGuildMembersChanged();
                }
                break;

            //踢人
            case Macros.GUILD_DROP_OUT:
                G.DataMgr.guildData.processKickMember(response.m_stValue.m_stKickRoleID);
                if (guildView != null) {
                    guildView.onGuildMembersChanged();
                }
                break;

            //申请
            case Macros.GUILD_JOIN_GUILD:
                let applyResponse: Protocol.Guild_Apply_Response = response.m_stValue.m_stApplyResponse;
                if (Macros.GUILD_APPLY_CODE_APPLY == applyResponse.m_ucCode) {
                    // 自己申请加入宗门成功
                    G.DataMgr.heroData.guildId = applyResponse.m_uiGuildID;
                    if (guildView != null) {
                        guildView.onGuildEnterSuccess();
                    }
                }
                break;

            //退出
            case Macros.GUILD_QUIT_GUILD:
                this._processQuitGuild();
                G.TipMgr.addMainFloatTip('你已经退出宗门');
                guildView = G.Uimgr.getForm<GuildView>(GuildView);
                if (guildView != null) {
                    guildView.onGuildInfoChanged();
                }
                break;

            //设置消息
            case Macros.GUILD_SET_INFO:
                if (G.DataMgr.guildData.guildAbstract) {
                    G.DataMgr.guildData.guildAbstract.m_szDeclaration = response.m_stValue.m_stUpdateTextResponse.m_szNitce;
                }
                if (guildView != null) {
                    guildView.onGuildInfoChanged();
                }
                break;

            // 捐献
            case Macros.GUILD_DONATE_MONEY:
                let doonateResp: Protocol.Guild_Donate_Response = response.m_stValue.m_stDonateResponse;
                G.DataMgr.guildData.updateDonate(doonateResp);
                G.TipMgr.addMainFloatTip('捐献成功！', -1, 1);

                if (guildView != null) {
                    guildView.onGuildDonateChanged();
                }
                break;

            //解散宗门
            case Macros.GUILD_DISMISS_GUILD:
                this._processQuitGuild();
                break;

            // 领取宗门等级礼包
            case Macros.GUILD_GET_LEVEL_GIFT:
                G.DataMgr.guildData.guildAbstract.m_ucLevelGiftGet = response.m_stValue.m_stLevelGiftRsp.m_ucGetLevel;
                break;

            // 宗门日常礼包
            case Macros.GUILD_GET_DAY_GIFT:
                G.DataMgr.guildData.guildAbstract.m_ucDayGiftGet = response.m_stValue.m_stDayGiftRsp.m_ucGetDay;
                if (guildView != null) {
                    guildView.onDailyGiftChanged();
                }
                G.GuideMgr.tipMarkCtrl.onGuildGiftChange();
                break;

            // 宗门仓库列表更新
            case Macros.GUILD_STORE_LIST:
                G.DataMgr.guildData.guildDepotInfo = response.m_stValue.m_stStoreListRsp.m_stStore;
                G.DataMgr.guildData.guildStoreDonateTimers = response.m_stValue.m_stStoreListRsp.m_usGuildStoreDonateTimes;
                if (guildView != null) {
                    guildView.onGuildStoreChanged();
                }
                break;

            // 宗门仓库物品审批申请
            case Macros.GUILD_STORE_ASSIGN:
                G.DataMgr.guildData.guildDepotInfo = response.m_stValue.m_stStoreAssignRsp.m_stStore;

                if (guildView != null) {
                    guildView.onGuildStoreChanged();
                }
                break;

            // 宗门自动加入
            case Macros.GUILD_SET_AUTO_JOIN:
                G.DataMgr.guildData.guildAbstract.m_ucAutoJoin = response.m_stValue.m_ucAutoJoin;
                if (guildView != null) {
                    guildView.onGuildInfoChanged();
                }

                break;

            // 宗门寻宝
            case Macros.GUILD_GET_XUNBAO_LIST:
                G.DataMgr.guildData.m_stXunBaoData = response.m_stValue.m_stGetXunBaoListRsp.m_stXunBaoData;
                G.DataMgr.guildData.m_auiXunBaoHelpCount = response.m_stValue.m_stGetXunBaoListRsp.m_auiXunBaoHelpCount;
                G.DataMgr.guildData.m_uiAccConsume = response.m_stValue.m_stGetXunBaoListRsp.m_uiAccConsume;
                break;

            //寻宝协助
            case Macros.GUILD_XUNBAO_HELP:
                G.DataMgr.guildData.m_stXunBaoData = response.m_stValue.m_stXunBaoHelpRsp.m_stXunBaoData;
                G.DataMgr.guildData.m_auiXunBaoHelpCount = response.m_stValue.m_stXunBaoHelpRsp.m_auiXunBaoHelpCount;
                break;

            //仓库存入
            case Macros.GUILD_STORE_INTO:
                if (ErrorId.EQEC_Success == response.m_iResultID) {
                    G.TipMgr.addMainFloatTip('捐献成功');
                }
                G.DataMgr.guildData.guildStoreDonateTimers = response.m_stValue.m_stStoreIntoRsp.m_usGuildStoreDonateTimes;
                G.DataMgr.guildData.guildDepotInfo = response.m_stValue.m_stStoreIntoRsp.m_stStore;

                if (guildView != null) {
                    guildView.onGuildStoreChanged();
                }
                break;

            //仓库取出
            case Macros.GUILD_STORE_TAKEOUT:
                G.DataMgr.guildData.guildDepotInfo = response.m_stValue.m_stStoreTakeOutRsp.m_stStore;
                if (ErrorId.EQEC_Success == response.m_iResultID) {
                    G.TipMgr.addMainFloatTip(G.DataMgr.langData.getLang(59));
                }
                if (guildView != null) {
                    guildView.onGuildStoreChanged();
                }
                G.Uimgr.closeForm(GuildExchangeView);
                break;

            //仓库日志拉取
            case Macros.GUILD_STORE_LOG_LIST:
                G.DataMgr.guildData.guildRecordList = response.m_stValue.m_stStoreLogListRsp.m_stStoreLog;
                if (guildView != null) {
                    guildView.onGuildStoreLogChanged();
                }
                break;

            //仓库删除
            case Macros.GUILD_STORE_DELETE:
                G.DataMgr.guildData.guildDepotInfo = response.m_stValue.m_stStoreDelRsp.m_stStore;
                G.DataMgr.guildData.cleanDepotDestroyThing();
                if (ErrorId.EQEC_Success == response.m_iResultID) {
                    G.TipMgr.addMainFloatTip(G.DataMgr.langData.getLang(58));
                }
                if (guildView != null) {
                    guildView.onGuildStoreChanged();
                }
                break;

            case Macros.GUILD_NOTIFY_CALL_BOSS:
                //宗门召唤
                let m_stGuildCallBossRsp: Protocol.GuildCallBossResponse = response.m_stValue.m_stGuildCallBossRsp;
                let monsterConfig: GameConfig.MonsterConfigM = MonsterData.getMonsterConfig(m_stGuildCallBossRsp.m_uiBossID);
                if (monsterConfig && monsterConfig.m_usLevel <= G.DataMgr.heroData.level) {
                    if (G.DataMgr.sceneData.curPinstanceID != MapId.WORLD_BOSS_PINSTANCE) {
                        let confirmInfo: string = G.DataMgr.langData.getLang(61, monsterConfig.m_szMonsterName, m_stGuildCallBossRsp.m_szNickName);
                        G.TipMgr.showConfirm(confirmInfo, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onCallMemberTip, m_stGuildCallBossRsp.m_uiBossID));
                    }
                }
                break;

            case Macros.GUILD_STORE_SET_LIMITSTAGE:
                G.DataMgr.guildData.guildDepotInfo.m_ucHunGuDropLevel = response.m_stValue.m_stStoreLimit.m_ucHunGuDropLevel;
                G.DataMgr.guildData.guildDepotInfo.m_ucHunGuColor = response.m_stValue.m_stStoreLimit.m_ucHunGuColor;
                G.DataMgr.guildData.guildDepotInfo.m_ucEquipDropLevel = response.m_stValue.m_stStoreLimit.m_ucEquipDropLevel;
                G.DataMgr.guildData.guildDepotInfo.m_ucEquipColor = response.m_stValue.m_stStoreLimit.m_ucEquipColor;

                if (guildView != null) {
                    guildView.onGuildStoreChanged();
                }
                break;

            case Macros.GUILD_NOTIFY_CALL_FMTBOSS:
                let fmtBossResp = response.m_stValue.m_stGuildCallFMTBossRsp;
                let str: string;
                if (MapId.isDgBossMapId(fmtBossResp.m_iSceneID)) {
                    str = uts.format('宗主{0}召唤你前往黑洞塔地宫第{1}层', fmtBossResp.m_szNickName, MapId.getDgBossLayer(fmtBossResp.m_iSceneID));
                }
                else {
                    let cfg: GameConfig.FMTCfgM = G.DataMgr.fmtData.getFmtCfgBySceneId(fmtBossResp.m_iSceneID);
                    str = uts.format('宗主{0}召唤你前往野外BOSS', fmtBossResp.m_szNickName, cfg.m_iLayer);
                }
                G.TipMgr.showConfirm(str, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onCallMemberTip1, fmtBossResp.m_iSceneID, fmtBossResp.m_stUnitPosition));
                break;

            case Macros.GUILD_NOTIFY_CALL_ZPFM:
                GuildTools.responseCallZpfm(response);
                break;
            case Macros.GUILD_NOTIFY_CALL_XZFM:
                let xzfmBossRsp = response.m_stValue.m_stGuildCallXZFMNotify;
                //let confirmInfo: string = uts.format('宗主{0}召唤你前往击杀远古BOSS', xzfmBossRsp.m_szNickName);
                //G.TipMgr.showConfirm(confirmInfo, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onCallMemberXZFMTip, xzfmBossRsp.m_iFloor));
                break;

            case Macros.GUILD_MONEY_RANK_LIST:
                //宗门资金排行
                G.DataMgr.guildData.m_ucMoneyRankGet = response.m_stValue.m_stMoneyRankListRsp.m_ucMoneyRankGet;
                G.DataMgr.guildData.m_stMoneyRankList = response.m_stValue.m_stMoneyRankListRsp;
                if (guildView != null) {
                    guildView.onGuildRankChanged();
                }
                break;

            case Macros.GUILD_MONEY_RANK_GET:
                //宗门资金排行  -  领取
                G.DataMgr.guildData.m_ucMoneyRankGet = response.m_stValue.m_stMoneyRankGetRsp.m_ucMoneyRankGet;
                G.DataMgr.guildData.m_stMoneyRankGet = response.m_stValue.m_stMoneyRankGetRsp;
                if (guildView != null) {
                    guildView.onGuildRankChanged();
                }
                break;

            case Macros.GUILD_TREASURE_HUNT_GET_INFO:
                G.DataMgr.guildData.setExploreInfo(response.m_stValue.m_stGuildTreasureHuntGetInfoResponse);
                if (guildView != null) {
                    guildView.onGuildExploreChanged();
                }
                break;

            case Macros.GUILD_TREASURE_HUNT_EVENT_OP:
            case Macros.GUILD_TREASURE_HUNT_GET_REWARD:
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildExploreOpenRequest());
                break;

            case Macros.GUILD_ZZHC_PANNLE_LIST:
                G.DataMgr.guildData.MonsterPanelInfo = response.m_stValue.m_stZZHCPannelRsp;
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfLingDiPanelRequest());
                break;

            case Macros.GUILD_ZZHC_BOSS_FEED:
                G.DataMgr.guildData.updateMonsterFeedInfo(response.m_stValue.m_stZZHCBossFeedRsp);
                if (guildView != null) {
                    guildView.onGuildMonsterFeedUpdate();
                }
                break;

            case Macros.GUILD_ZZHC_GIFT_GET:
                G.DataMgr.guildData.updateMonsterGiftInfo(response.m_stValue.m_stZZHCGiftGetRsp);

                if (guildView != null) {
                    guildView.onGuildMonsterRewardUpdate();
                }
                break;

            case Macros.GUILD_PAIMAI_OPEN_GUILD:
                //宗门竞拍
                G.DataMgr.guildData.setPaiMaiGuild(response.m_stValue.m_stPaiMaiOpenGuild);
                if (guildView != null) {
                    guildView.onGuildPaiMaiInfoChanged(response.m_usType);
                }
                break;

            case Macros.GUILD_PAIMAI_OPEN_WORLD:
                //世界竞拍

                G.DataMgr.guildData.setPaiMaiWorld(response.m_stValue.m_stPaiMaiOpenWorld);
                if (guildView != null) {
                    guildView.onGuildPaiMaiInfoChanged(response.m_usType);
                }
                break;

            case Macros.GUILD_PAIMAI_BUY_GUILD:
                //宗门竞拍-购买
                // uts.log(" 宗门竞拍-购买    " + JSON.stringify(response.m_stValue.m_stPaiMaiBuyGuild));
                G.DataMgr.guildData.updatePaiMaiGuild(response.m_stValue.m_stPaiMaiBuyGuild);
                if (guildView != null) {
                    guildView.onGuildPaiMaiInfoChanged(response.m_usType);
                }


                break;

            case Macros.GUILD_PAIMAI_BUY_WORLD:
                //世界竞拍--购买
                // uts.log(" 世界竞拍--购买    " + JSON.stringify(response.m_stValue.m_stPaiMaiBuyWorld));
                G.DataMgr.guildData.updatePaiMaiWorld(response.m_stValue.m_stPaiMaiBuyWorld);
                if (guildView != null) {
                    guildView.onGuildPaiMaiInfoChanged(response.m_usType);
                }
                break;

            case Macros.GUILD_PAIMAI_SELF:
                //我的竞拍
                //uts.log(" 我的竞拍  " + JSON.stringify(response.m_stValue.m_stPaiMaiSelf));
                G.DataMgr.guildData.updatePaiMaiSelf(response.m_stValue.m_stPaiMaiSelf);
                if (guildView != null) {
                    guildView.onGuildPaiMaiInfoChanged(response.m_usType);
                }
                break;

            case Macros.GUILD_PAIMAI_INGORE:
                //忽略GUILD_PAIMAI_NEWNTF
                G.DataMgr.guildData.updatePaiMaiSelf(response.m_stValue.m_stPaiMaiIngore);
                if (guildView != null) {
                    guildView.onGuildPaiMaiInfoChanged(response.m_usType);
                }
                break;
            case Macros.GUILD_PAIMAI_NEWNTF:
                //宗门新物品上架提示
                let openTab: EnumGuildJingPaiSubTab;
                let type = response.m_stValue.m_iPaiMaiNewNtf;
                if (type == Macros.GUILD_PAIMAI_GUILD_PROSESS) {
                    openTab = EnumGuildJingPaiSubTab.guild;
                    G.DataMgr.runtime.curPaiMaiType = Macros.GUILD_PAIMAI_BUY_GUILD;
                } else if (type == Macros.GUILD_PAIMAI_WORLD_PROSESS) {
                    openTab = EnumGuildJingPaiSubTab.world;
                    G.DataMgr.runtime.curPaiMaiType = Macros.GUILD_PAIMAI_BUY_WORLD;
                }
                G.DataMgr.runtime.paiMaiHaveData = true;
                G.DataMgr.runtime.paiMaiNeedTip = true;
                G.NoticeCtrl.checkPaiMai(openTab);
                G.GuideMgr.tipMarkCtrl.onGuildPaiMaiChange();
                break;

            case Macros.GUILD_MJTZ_OPEN:
                {
                    G.DataMgr.mingJiangData.updateMJPanelInfo(response.m_stValue.m_stMJTZOpenRsp);
                    //排行榜打开状态下直接刷新排行榜
                    let mjRankView2 = G.Uimgr.getForm<MingJiangRankView>(MingJiangRankView);
                    let isRefreshPage = true;
                    if (mjRankView2) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMingJiangRankViewRequest(G.DataMgr.mingJiangData.curPage + 1));
                        isRefreshPage = false;
                    }

                    let bossView = G.Uimgr.getForm<BossView>(BossView);
                    if (bossView) bossView.updateMingJiangPanel(isRefreshPage);
                }
                break;

            case Macros.GUILD_MJTZ_LIST_RANK:
                G.DataMgr.mingJiangData.updateMJRankInfo(response.m_stValue.m_stMJTZListRankRsp);
                let mjRankView = G.Uimgr.getForm<MingJiangRankView>(MingJiangRankView);
                if (mjRankView) mjRankView.update();
                break;

            case Macros.GUILD_MJTZ_GET_GIFT:
                {
                    G.DataMgr.mingJiangData.updateRewardStatus(response.m_stValue.m_stMJTZGetGiftRsp.m_uiGiftFlag);

                    let bossView = G.Uimgr.getForm<BossView>(BossView);
                    if (bossView) bossView.updateMingJiangRewardStatus();
                    G.ActBtnCtrl.update(false);
                }
                break;

            case Macros.GUILD_MJTZ_RAISE:
                {
                    G.DataMgr.mingJiangData.buffRemainTime = response.m_stValue.m_ucMJTZRaiseRsp;
                    G.TipMgr.addMainFloatTip('全体宗门成员已获得鼓舞！');

                    let bossView = G.Uimgr.getForm<BossView>(BossView);
                    if (bossView) bossView.updateMingJiangBuffLabel();
                }
                break;

            case Macros.GUILD_MJTZ_ACT_NOTFY:
                {
                    let bossView = G.Uimgr.getForm<BossView>(BossView);
                    if (bossView) bossView.updateMingJiangByNotify();
                }
                break;
        }

        G.MainBtnCtrl.update(false);
    }

    private onGuildChangedNotify(notify: Protocol.Guild_ChangedNotify) {
        let oldGuildId = G.DataMgr.heroData.guildId;
        G.ModuleMgr.unitModule.onGuildChanged(notify.m_iUnitID, notify.m_stGuildInfo);
        if (oldGuildId <= 0 && G.DataMgr.heroData.guildId > 0) {
            // 说明自己的申请宗门被批准了
            let guildView = G.Uimgr.getForm<GuildView>(GuildView);
            if (guildView != null) {
                guildView.onGuildEnterSuccess();
            }
        }
    }

    /**处理离开宗门*/
    private _processQuitGuild(): void {
        G.DataMgr.heroData.guildId = 0;
        G.DataMgr.heroData.guildName = '';
        G.DataMgr.heroData.guildGrade = 0;

        // 关闭所有宗门相关的对话框
        G.Uimgr.closeForm(GuildView);
        G.Uimgr.closeForm(GuildApplicationView);
        G.Uimgr.closeForm(GuildExchangeView);
        G.Uimgr.closeForm(GuildStoreSubPanel);

        G.GuideMgr.tipMarkCtrl.onGuildGiftChange();

        // 需要刷新副本里的召集按钮
        this._checkSummon();

        // 关闭宗门团队副本相关的面板
        //this.dispatchEvent(Events.OpenCloseGuildTeamFbDialog, DialogCmd.close);
        //this.dispatchEvent(Events.OpenCloseGuildTeamFbMapDialog, DialogCmd.close);
        //this.dispatchEvent(Events.OpenCloseGuildTeamFbBossDialog, DialogCmd.close);
    }

    private processApplicationChanged() {
        let guildView = G.Uimgr.getForm<GuildView>(GuildView);
        if (guildView != null) {
            guildView.onApplicationChanged();
        }

        let guildApplicationView = G.Uimgr.getForm<GuildApplicationView>(GuildApplicationView);
        if (guildApplicationView != null) {
            guildApplicationView.onApplicationChanged();
        }
        G.GuideMgr.tipMarkCtrl.onGuildApplyChange();
    }

    /**
     * 处理宗门职称变化。
     *
     */
    private _processGuildGradeChange(): void {
        if (G.DataMgr.guildData.isHasPos) {
            // 宗主或副宗主拉取申请者列表
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.fetchApplicantListRequest());
        }
        let guildView = G.Uimgr.getForm<GuildView>(GuildView);
        if (guildView != null) {
            guildView.onGuildGradeChanged();
        }

        this._checkSummon();
    }

    private _checkSummon() {
        //G.ViewCacher.mainView.fmtBossCtrl.onGuildGradeChanged();
        let pinstanceOperateView = G.Uimgr.getChildForm<PinstanceOperateView>(MainView, EnumMainViewChild.pinstanceOperate);
        if (null != pinstanceOperateView) {
            pinstanceOperateView.onGuildGradeChanged();
        }
    }

    private onCallMemberTip(status: MessageBoxConst, isCheckSelected: boolean, bossId: number): void {
        if (MessageBoxConst.yes == status) {
            G.ActionHandler.gotoWorldBoss(bossId);
        }
    }

    private onCallMemberTip1(status: MessageBoxConst, isCheckSelected: boolean, sceneId: number, position: Protocol.UnitPosition) {
        if (MessageBoxConst.yes == status) {
            G.Mapmgr.goToPos(sceneId, position.m_uiX, position.m_uiY, true);
        }
    }

    private onCallMemberXZFMTip(status: MessageBoxConst, isCheckSelected: boolean, layer: number) {
        if (MessageBoxConst.yes == status) {
            G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_XZFM, layer, 0);
        }
    }

    onCurrencyChange(id: number) {
        let guildView = G.Uimgr.getForm<GuildView>(GuildView);
        if (guildView != null) {
            guildView.onCurrencyChange(id);
        }
    }


    /**
     * 宗门战跨服返回
     * @param	msg
     */
    onGuildCrossPvpCsResponse(response: Protocol.Guild_CROSSPVP_CS_Response): void {
        if (Macros.GUILD_PVP_PANEL_INFO == response.m_usType) {
            G.DataMgr.activityData.guildPvpData.setData(response.m_stValue.m_stGuildPVPInfoRes);
        }
        else if (Macros.GUILD_PVP_DO_REWARD == response.m_usType) {
            G.TipMgr.addMainFloatTip('领取奖励成功');
            G.DataMgr.activityData.guildPvpData.afterGetReward();
        }

        let view = G.Uimgr.getForm<ActHomeView>(ActHomeView);
        if (view != null) {
            view.updateGuildPVPPanel();
        }
    }

    /**
     * 宗门PVP活动响应
     * @param msg
     *
     */
    onGuildPvPResponse(response: Protocol.Guild_PVP_CS_Response): void {
        if (Macros.GUILD_PVP_PANEL_INFO == response.m_usType) {
            G.DataMgr.activityData.guildPvpData.setData(response.m_stValue.m_stGuildPVPInfoRes);
        }
        else if (response.m_usType == Macros.GUILD_PVP_DO_REWARD) {
            G.TipMgr.addMainFloatTip('领取奖励成功');
            G.DataMgr.activityData.guildPvpData.afterGetReward();
        }

        let view = G.Uimgr.getForm<ActHomeView>(ActHomeView);
        if (view != null) {
            view.updateGuildPVPPanel();
        }
    }

    eraseAll() {

    }

    wakeUp() {

    }
}
