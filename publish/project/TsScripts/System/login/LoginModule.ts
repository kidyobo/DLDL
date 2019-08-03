import { KaiFuHuoDongView } from 'System/activity/kaifuhuodong/KaiFuHuoDongView';
import { KaiFuChongBangView } from './../activity/kaiFuChongBang/KaiFuChongBangView';
import { TanBaoView } from './../tanbao/TanBaoView';
import { ReportType } from "System/channel/ChannelDef";
import { Constants } from "System/constants/Constants";
import { EnumCrossErrorCode, EnumKfhdBossType, EnumLoginStatus, UnitCtrlType, EnumKuafuPvpStatus } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { EventDispatcher } from "System/EventDispatcher";
import { Events } from "System/Events";
import { Global as G } from "System/global";
import { LoginTip } from "System/login/view/LoginTip";
import { LoginView } from "System/login/view/LoginView";
import { NoticeView } from "System/login/view/NoticeView";
import { ErrorId } from "System/protocol/ErrorId";
import { Macros } from "System/protocol/Macros";
import { EnumNetId } from "System/protocol/NetHandler";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { MessageBoxConst } from "System/tip/TipManager";
import { ConfirmCheck } from "System/tip/TipManager";
import { WaitingView } from "System/uilib/WaitingView";
import { HeroController } from "System/unit/hero/HeroController";
import { CompareUtil } from "System/utils/CompareUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { PinstanceIDUtil } from "System/utils/PinstanceIDUtil";
import { ZXingView } from "System/login/view/ZXingView"
import { CreateRoleView20 } from "Diff/view/CreateRoleView20";
import { UIPathData } from 'System/data/UIPathData'
import { CaiLiaoFuBenPanel } from 'System/pinstance/selfChallenge/CaiLiaoFuBenPanel'

let CreateRoleView = CreateRoleView20;
let scenePath = "scene/CreateCharacter.unity";
let sceneID = "CreateCharacter";
export class LoginModule extends EventDispatcher {
    private role: HeroController;
    /**是否首次登录。*/
    private isFirstLogin: boolean = true;
    /**登录定时器*/
    private loginTimer: Game.Timer;
    /**登录次数*/
    private loginTimes: number = 0;
    /**服务器是否已满*/
    private serverIsFull: boolean = false;

    constructor() {
        super();
        this.addNetListener(Macros.MsgID_Account_ListRole_Response, this.onListRoleResponse);
        this.addNetListener(Macros.MsgID_Account_CreateRole_Response, this.onCreateRoleResponse);
        this.addNetListener(Macros.MsgID_LoginServer_Response, this.onLoginServerResponse);
        this.addNetListener(Macros.MsgID_LogoutServer_Notify, this._onLogoutServerNotify);
        this.addNetListener(Macros.MsgID_AfterLoginData_Notify, this._onAfterLoginNotify);
        this.addNetListener(Macros.MsgID_ZeroRefreshData_Notify, this._onZeroRefreshNotify);
        this.addNetListener(Macros.MsgID_SystemSetting_Notify, this.onSystemSettingChangeNotify);
        this.addNetListener(Macros.MsgID_ServerParameter_Notify, this.onServerParameterNotify);
    }
    private async: UnityEngine.AsyncOperation;
    private onLoad(assetRequest: Game.AssetRequest) {
        if (assetRequest.error != null) {
            G.ModuleMgr.loadingModule.setActive(false);
            uts.logWarning("Login加载失败:" + "  error:" + assetRequest.error);
            return;
        }
        this.async = UnityEngine.SceneManager.LoadSceneAsync(sceneID);
        Game.Invoker.BeginInvoke(G.Root, null, 0, delegate(this, this.waitCreateScene));
    }
    private waitCreateScene() {
        if (this.async.isDone) {
            G.ModuleMgr.loadingModule.setActive(false);
            this.async = null;
            G.Uimgr.createForm<any>(CreateRoleView).open();
        }
        else {
            Game.Invoker.BeginInvoke(G.Root, null, 0, delegate(this, this.waitCreateScene));
        }
    }
    /**开服时间变更*/
    private onServerParameterNotify(notify: Protocol.ServerParameter_Notify) {
        G.SyncTime.m_uiServerStartTime = notify.m_stValue.m_uiSvrStartTime;
        G.ActBtnCtrl.update(false);

    }
    /**
     * 收到拉取角色列表response。
     * @param body
     */
    private onListRoleResponse(body: Protocol.ListRole_Account_Response): void {
        uts.log('收到拉取角色列表response');
        if (ErrorId.EQEC_Success == body.m_uiResultID) {
            let gameParas = G.DataMgr.gameParas;
            let clientid = body.m_stLianYunPlatInfo.m_iClient;
            if (clientid == 9) {
                gameParas.zxingPCLogin = false;
                gameParas.zxingToken = body.m_stLianYunPlatInfo.m_uiTokenID;
                gameParas.zxingSession = body.m_stLianYunPlatInfo.m_uiSessionID;
                var data = {
                    "token": gameParas.zxingToken, "session": gameParas.zxingSession, "id": gameParas.serverID, "ip": gameParas.serverIp, "port": gameParas.serverPort, "name": gameParas.serverName
                    , "gameid": Game.Config.gameid, "channelid": Game.PCStreamingSetting.channelID
                };
                var str = JSON.stringify(data);
                G.Uimgr.createForm<ZXingView>(ZXingView).open(str, true, '扫一扫登陆', '请打开移动端，在登陆界面点击左侧扫一扫按钮登陆游戏');
                let loginView = G.Uimgr.getForm<LoginView>(LoginView);
                if (loginView != null) {
                    // 此时仅显示提示框，让他自己点登录游戏
                    loginView.setLoginBtnEnabled(true);
                }
            }
            else if (clientid == 8) {
                G.ModuleMgr.netModule.closeConnect();
                //电脑和手机都会收到8
                if (gameParas.zxingMobileLogin) {
                    let loginView = G.Uimgr.getForm<LoginView>(LoginView);
                    if (loginView != null) {
                        // 此时仅显示提示框，让他自己点登录游戏
                        loginView.setLoginBtnEnabled(true);
                    }
                }
                else {
                    gameParas.resetZXINGInfo();
                    //从res里面得到所有数据，然后重连服务器
                    gameParas.uin = body.m_uiUin;
                    gameParas.worldID = body.m_shWorldID;
                    gameParas.platformType = body.m_stLianYunPlatInfo.m_usType;
                    gameParas.isAdult = body.m_stLianYunPlatInfo.m_iIsAdult;
                    gameParas.platTime = body.m_stLianYunPlatInfo.m_iPlatTime;
                    gameParas.serverID = body.m_shWorldID;
                    gameParas.username = body.m_stLianYunPlatInfo.m_szPlatNameStr;
                    gameParas.sign = body.m_stLianYunPlatInfo.m_ucPlatSignStr;
                    G.ModuleMgr.netModule.closeConnect();
                    G.ModuleMgr.netModule.connect(0);
                    let form = G.Uimgr.getForm<ZXingView>(ZXingView);
                    if (form != null) {
                        form.close();
                    }
                }
            }
            else {
                if (body.m_ucNumber > 0) {
                    // 有角色，直接进入游戏
                    uts.log("list role success: uin=" + body.m_uiUin + ", num=" + body.m_ucNumber + ", worldID=" + body.m_shWorldID + ", nickName=" + body.m_astRoleSummary[0].m_szNickName);
                    gameParas.worldID = body.m_shWorldID;
                    gameParas.roleID = body.m_astRoleSummary[0].m_stRoleID;
                    gameParas.country = body.m_astRoleSummary[0].m_cCountry;
                    gameParas.prof = body.m_astRoleSummary[0].m_cProfession;
                    gameParas.gender = body.m_astRoleSummary[0].m_cGender;
                    this.afterRoleReady();
                } else {
                    // 没有角色,打开创建角色场景
                    if (this.serverIsFull) {
                        //新用户满服就不能进入该服了
                        this.showLoginServerTip("该服务器人数已满,请换一个服务器吧");
                        return;
                    }
                    uts.log("list role success: uin=" + body.m_uiUin + ", num=" + body.m_ucNumber);
                    // 没有角色，显示创角
                    var createRoleRes = [];
                    createRoleRes.push(UIPathData.CreateRoleView);
                    createRoleRes.push(scenePath);
                    let request = Game.ResLoader.CreateAssetsRequest(Game.AssetPriority.High1, createRoleRes);
                    G.ModuleMgr.loadingModule.setActive(true, true);
                    G.ModuleMgr.loadingModule.loadRequest(request, 0, 1, delegate(this, this.onLoad), null);
                }
            }
        } else {
            uts.log("list role failed: rstid=" + body.m_uiResultID);
            let msg = G.DataMgr.errorData.getErrorStringById(body.m_uiResultID);
            if (body.m_uiResultID == ErrorId.EQEC_Login_InvalidVersionL) {
                G.TipMgr.showConfirm(msg, ConfirmCheck.noCheck, '确定', delegate(this, this.onReloadGame));
            }
            else if (body.m_uiResultID == ErrorId.EQEC_Login_InvalidVersionH) {
                G.TipMgr.showConfirm(msg, ConfirmCheck.noCheck, '重试|取消', delegate(this, this.onReloginGame), 60);
            }
            else {
                if (body.m_uiResultID != ErrorId.EQEC_UinInBlackList)
                    msg = uts.format('拉取角色列表失败，请重新登录！(resultid:{0})', body.m_uiResultID);
                G.TipMgr.showConfirm(msg, ConfirmCheck.noCheck, '确定');
            }
            let loginView = G.Uimgr.getForm<LoginView>(LoginView);
            if (loginView != null) {
                // 此时仅显示提示框，让他自己点登录游戏
                loginView.setLoginBtnEnabled(true);
            }
        }
    }

    private onReloadGame() {
        G.reloadGame(false);
    }

    private onReloginGame(state: MessageBoxConst) {
        if (state == MessageBoxConst.yes) {
            let loginView = G.Uimgr.getForm<LoginView>(LoginView);
            if (loginView != null) {
                loginView.clickLoginGame();
            }
        }
    }

    /**
    * 创建角色成功后的逻辑
    * @param msg
    */
    private onCreateRoleResponse(body: Protocol.CreateRole_Account_Response): void {
        uts.log("create role response!-------------------------------------------------------------------------------------------");
        let gameParas = G.DataMgr.gameParas;
        if (body.m_uiResultID == 0) {
            uts.log("onCreateRoleResponse success, m_stRoleID=" + JSON.stringify(body.m_stRoleID));
            G.Uimgr.createForm<LoginTip>(LoginTip).open('正在进入游戏，请稍候...', false);
            gameParas.worldID = body.m_iWorldID;
            gameParas.roleID = body.m_stRoleID;
            gameParas.country = body.m_cCountry;
            this.afterRoleReady();
            G.DataMgr.runtime.isNewRole = true;
        }
        else {
            uts.log("onCreateRoleResponse fail, m_uiResultID=" + body.m_uiResultID);
            let errorText: string;
            if (ErrorId.EQEC_Dirty_Word == body.m_uiResultID) {
                errorText = '敏感字符，请换个名字';
            } else if (ErrorId.EQEC_NameConflict == body.m_uiResultID) {
                errorText = '名字已被使用，请换个名字';
            } else {
                errorText = '创建角色失败，请重试';
            }
            G.Uimgr.closeForm(LoginTip);
            G.TipMgr.showConfirm(errorText, ConfirmCheck.noCheck, '确定');
        }
    }

    /**
     * 角色准备就绪。
     */
    public afterRoleReady(): void {
        // 先读取玩家配置
        G.DataMgr.settingData.readSetting();
        this.loginTimes = 0;
        this.doLogin();
    }

    private doLogin() {
        // 登录游戏
        this.loginTimes++;
        uts.log(uts.format('开始登录(第{0}次)...', this.loginTimes));
        // 使用1个3s定时器，如果没有回包则再发1次
        if (null == this.loginTimer) {
            this.loginTimer = new Game.Timer("loginTimer", Constants.LoginTimeout, 1, delegate(this, this.onLoginTimer));
        } else {
            this.loginTimer.ResetTimer(Constants.LoginTimeout, 1, delegate(this, this.onLoginTimer));
        }
        let gameParas = G.DataMgr.gameParas;
        let systemData = G.DataMgr.systemData;
        let cmd = ProtocolUtil.getLogin(systemData.loginReason, systemData.tmploginEnterType.m_cEnterType, systemData.tmploginEnterType.m_iPara1,
            systemData.tmploginEnterType.m_iPara2, gameParas.skipStory, gameParas.platformType, gameParas.clientType, gameParas.isAdult,
            gameParas.platTime, gameParas.serverID, gameParas.username, gameParas.sign, G.ChannelSDK.ChannelID, UnityEngine.SystemInfo.deviceUniqueIdentifier);
        G.ModuleMgr.netModule.sendMsg(cmd);
    }

    private onLoginTimer(timer: Game.Timer) {
        uts.log('登录超时！');
        if (this.loginTimes >= 1) {
            // 最多尝试3次
            if (Macros.LOGINOUT_REAZON_NORMAL == G.DataMgr.systemData.loginReason) {
                // 登录本服失败
                G.Uimgr.createForm<LoginTip>(LoginTip).open('登录超时，请重新登录！', true);
            } else {
                // 跨服登录失败
                this.onCrossFailed(null, EnumCrossErrorCode.loginTimeout);
            }
        } else {
            this.doLogin();
        }
    }

    private onLoginServerResponse(body: Protocol.LoginServer_Response): void {
        if (null != this.loginTimer) {
            this.loginTimer.Stop();
            this.loginTimer = null;
        }
        if (ErrorId.EQEC_Success == body.m_uiResultID) {
            // 登录成功
            if (G.DataMgr.gameParas.myWorldID == -1) {
                G.DataMgr.gameParas.myWorldID = body.m_uiWorldID;
            }
            let runtime = G.DataMgr.runtime;
            runtime.loginStatus = EnumLoginStatus.logined;
            runtime.resetWhenLogin();

            let isFirstLogin: boolean = false;
            if (this.isFirstLogin) {
                isFirstLogin = true;
                this.isFirstLogin = false;
            }

            G.SyncTime.m_uiServerStartTime = body.m_uiServerStartTime;
            //合服时间
            G.SyncTime.m_uiServerMergeTime = body.m_uiServerMergeTime;
            // 同步服务器时间
            let head = G.ModuleMgr.netModule.MessageHead;
            G.SyncTime.setServerTime(head.m_uiTimeStamp_High, head.m_uiTimeStamp_Low);

            let afterOpenDay = G.SyncTime.getDateAfterStartServer();
            uts.log("登录成功，worldID=" + body.m_uiWorldID +
                ", unitID = " + body.m_stRoleInfo.m_stUnitInfo.m_iUnitID +
                ", sceneID=" + body.m_uiSceneID + ', sceneIdx=' + body.m_uiSceneIdx +
                ", pinstanceID=" + body.m_uiPinstanceID + ', pinstanceIdx=' + body.m_uiPinstanceIdx +
                ', ServerStartTime=' + body.m_uiServerStartTime +
                ', afterOpenDay=' + afterOpenDay);

            // 记录登录参数
            let gameParas = G.DataMgr.gameParas;
            // 记录登入轨迹
            gameParas.worldID = body.m_uiWorldID;

            G.DataMgr.systemData.writeLoginType(G.DataMgr.systemData.loginReason);

            G.Mapmgr.newMapWidthPixel = G.Mapmgr.mapWidth = body.m_uiWidthPixels;
            G.Mapmgr.newMapHeightPixel = G.Mapmgr.mapHeight = body.m_uiHeightPixels;

            G.DataMgr.sceneData.curSceneID = body.m_uiSceneID;
            G.DataMgr.sceneData.curPinstanceID = body.m_uiPinstanceID;
            G.DataMgr.sceneData.curSceneIndex = body.m_uiSceneIdx;
            G.DataMgr.sceneData.curPinstanceIndex = body.m_uiPinstanceIdx;

            this.updateHeroData(body);

            G.DataMgr.guildData.updateGuildInfo(body.m_stGuildInfo);
            G.DataMgr.skillData.updateSkillSet(body.m_stSkillFetterSet);
            G.DataMgr.skillData.updateGotSkills(body.m_stSkillList);
            G.DataMgr.zhufuData.updateGotSkills(body.m_stSkillList);
            G.DataMgr.cdData.initCdDatum(body.m_stCooldownList); // 必须在设置完skillMainData之后调用
            // 初始化集结令冷却
            G.DataMgr.localCdData.lastJijieAt = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000);
            G.DataMgr.systemData.onlyOneTimeAllLifeBits = body.m_uiFristOpenFunc;
            G.DataMgr.systemData.canOpenTagBits = body.m_uiCanOpenTag;
            G.DataMgr.systemData.dayOperateBits = body.m_uiDayOperateRecord;
            G.DataMgr.npcSellData.updateBoughtCount(body.m_stSpecialItemList);
            G.DataMgr.petData.setfollowPet(body.m_stBeautyInfo);
            //vip月卡相关信息更新
            G.DataMgr.heroData.upDateVipMonthLevel(body.m_iVIPMonthLevel, body.m_auiVIPMonthTimeOut);
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.BOSS_SUMMON_PANEL));
            // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BFQD, Macros.BFQD_ACT_CHARGE_REWARD_PANEL));
            // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BFQD, Macros.BFQD_ACT_LOGIN_REWARD_PANEL));
            // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BFXYACT, Macros.ACTIVITY_FMT_LIST));
            // 道宫
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getJiuXingRequest(Macros.JIUXING_OPEN_PANEL));
            //合服了拉去合服的
            if (G.SyncTime.m_uiServerMergeTime > 0) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_QTDL_OPEN_PANEL));
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_LJCZ_OPEN_PANEL));
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_LJXF_OPEN_PANEL));
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_ZCM_OPEN_PANNEL));
            }
            if (G.SyncTime.getDateAfterStartServer() <= Macros.MAX_JUHSA_ACT_DAY) {
                //拉去7日累计充值
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KF7DAY_LJCZ_OPEN));
            }

            // 拉取宗门排行 红点，不拉没有
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQueryRequest(Macros.GUILD_MONEY_RANK_LIST));
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenSuperVIP_REQUEST(Macros.MsgID_OpenSuperVIP_Request));

            //拉取连冲返利，获取周数
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KF_LCFL_OPEN));
            //元宝翻倍
            //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.YUANBAO_DOUBLE_PANEL));
            //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.HAPPY_CHARGE_VIP_PANEL));
            //全民(｡･∀･)ﾉﾞ嗨
            // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_QMHD, Macros.ACTIVITY_QMHD_PANEL));
            // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HJXN_CHARGE, Macros.ACTIVITY_HJXN_CHARGE_PANNEL));
            // 首次登录需要预处理一些数据
            if (isFirstLogin) {

                G.DataMgr.sceneData.processNav();
                // 预处理跨场景寻路
                G.DataMgr.sceneData.initCrossPathData();
                //初始化心跳处理,发送同步时间请求
                G.ModuleMgr.netModule.startSyncTime();
            }
            ///////////////////////// 下面开始各项异步数据的拉取，需要注意跨服的情况下不要拉取 /////////////////////////

            if (Macros.LOGINOUT_REAZON_CROSSPIN != G.DataMgr.systemData.loginReason) {
                // 跨服情况下不拉取异步数据
                let netModule = G.ModuleMgr.netModule;
                // 上报当前的服务器信息
                netModule.sendMsg(ProtocolUtil.getCrossWorldInfoReportRequest(gameParas.domain, gameParas.serverIp, gameParas.serverPort, gameParas.serverID));
                // 获取装备数据
                netModule.sendMsg(ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_LIST, 0));

                //拉取祝福系统信息
                netModule.sendMsg(ProtocolUtil.getListZhufInfoRequest());

                //拉取邮件列表
                netModule.sendMsg(ProtocolUtil.getMailFetchListRequestMsg());
                // 在该处拉取好友数据
                netModule.sendMsg(ProtocolUtil.getFetchGameFriendRequest());

                //// 拉取VIP数据
                if (G.DataMgr.heroData.curVipLevel > 0) {
                    netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_LIST, 0));
                }
                netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_MONTH_LIST, 0));
                netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_SPECIAL_LIST, 0));
                // 拉取所有活动进度
                netModule.sendMsg(ProtocolUtil.getListActivityRequest());

                // 拉取称号信息
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTitleActiveChangeRequest(Macros.TITLE_LIST_DATA));
                // 拉去极速挑战的信息
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_GET_RANKTIMEINFO, Macros.PINSTANCE_ID_BPXD));
                //获取个人竞技数据
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenPvpPanelRequest());

                //获取跨服BOSS活动数据
                // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_KFNS, Macros.ACTIVITY_KFNS_OPEN));

                //拉取探宝数据
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSkyLotteryOpenPanelRequest(1));

                //第一次上线处理（只处理一次）
                if (isFirstLogin) {
                    //G.DataMgr.vipData.requestVPlanData();

                    // 拉取美人数据
                    netModule.sendMsg(ProtocolUtil.getOpenPetPanelRequest());

                    //首充礼包请求
                    netModule.sendMsg(ProtocolUtil.getSCGetInfoRequest());

                    //拉取成就数据请求
                    netModule.sendMsg(ProtocolUtil.getAchiGetRequest());

                    //星环数据请求
                    netModule.sendMsg(ProtocolUtil.getOpenMagicCubePannelRequest());

                    //宝物数据请求
                    netModule.sendMsg(ProtocolUtil.getFabaoPanelRequest());

                    //宝石数据
                    // netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HISTORICAL_REMAINS, Macros.HISTORICAL_REMAINS_PANEL));

                    // 活跃度
                    netModule.sendMsg(ProtocolUtil.getHydOperateRequest(Macros.HYD_OPERATE_LIST));

                    // 世界boss
                    // netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDBOSS, Macros.ACTIVITY_WORLD_BOSS_LIST));

                    //血战黑洞 （远古）
                    netModule.sendMsg(ProtocolUtil.getXZFMRequest(Macros.XZFM_PANEL));//Macros.ACTIVITY_ID_XZFM,

                    // 拉取在线礼包，因为跨服后在线是不计算的，所以每次都要拉取
                    // netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_ONLINEGIFT, Macros.ONLINEGIFTACT_SHOW));
                    // 拉取资源找回
                    netModule.sendMsg(ProtocolUtil.getTimeBoxPannelRequest());

                    // 春节活动请求
                    //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLLECT_EXCHANGE, Macros.ACTIVITY_SJDH_PANNEL));

                    // 开服活动请求
                    netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.CHALLENGE_BOSS_OPEN_PANEL, EnumKfhdBossType.world));
                    netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.CHALLENGE_BOSS_OPEN_PANEL, EnumKfhdBossType.fengMoTa));
                    netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.CHALLENGE_BOSS_OPEN_PANEL, EnumKfhdBossType.diGong));

                    // 金卡数据请求
                    netModule.sendMsg(ProtocolUtil.getMonthCardRequest(Macros.MONTH_CARD_OPEN_PANEL));

                    // // 投资计划数据
                    // netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_JUHSACT, Macros.JUHS_OPENPANEL));

                    //跨服领地战数据
                    netModule.sendMsg(ProtocolUtil.getKfLingDiPanelRequest());

                    // //连续返利数据请求
                    // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_LXFL, Macros.ACTIVITY_LXFL_OPEN));

                    // //落日森林数据请求
                    // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_FOREST_BOSS, Macros.ACTIVITY_FOREST_BOSS_OPEN));

                    //宗门神兽数据
                    netModule.sendMsg(ProtocolUtil.getGuildMonsterPanelRequest());
                    //名将面板数据
                    netModule.sendMsg(ProtocolUtil.getMingJiangPanelRequest());

                    // 封神榜
                    //netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_PVP_BASE, Macros.ACTIVITY_KFJDC_LIST));

                    // 庆典活动每日首充
                    //netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_DAILY_FIRST_RECHARGE, Macros.DAILY_FIRST_RECHARGE_PANEL));

                    ///**开服活动累计充值*/
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.LJCZ_OPEN_PANEL));

                    // 开服团购
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFSCTGGetInfoRequest());

                    //每日直购礼包
                    netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.ZGLB_OPEN_PANEL));

                    ////鲜花排行榜
                    //netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CROSS_FLOWER_RANK, Macros.ACTIVITY_KFXHB_LIST, Macros.CROSS_RANK_TYPE_XHB_GIRL));
                    //netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CROSS_FLOWER_RANK, Macros.ACTIVITY_KFXHB_LIST, Macros.CROSS_RANK_TYPE_XHB_BOY));

                    //G.DataMgr.activityData.ttbz.refreshData();
                    let afterOpenDay = G.SyncTime.getDateAfterStartServer();

                    if (afterOpenDay > Constants.CORSS_GUILD_PVP_START_DAY) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildCrossPvpCSRequest(Macros.GUILD_PVP_PANEL_INFO));
                    }
                    else {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildPvpDataRequest(Macros.GUILD_PVP_PANEL_INFO));
                    }

                    //拉去每日目标奖励状态
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFMRMBGetInfoRequest());
                    let sendMsgCount = afterOpenDay > 7 ? 7 : afterOpenDay;
                    for (let i = 1; i <= sendMsgCount; i++) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFQMCBGetInfoRequest(i, G.DataMgr.kaifuActData.getKaifuChongbangType()[i - 1]));
                    }

                    //星斗宝库数据
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getStarsOpenPanelRequest());
                    //消费排行榜
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_126CROSSCHARGE, Macros.Act126_PANEL));

                }
            }
            this.afterLogin();

            // 因为没有切线了，所以肯定是首次登录成功
            G.ModuleMgr.bagModule.onLoginSuccessfully(isFirstLogin);
            G.ModuleMgr.SceneModule.onLoginSuccessfully(isFirstLogin);
            if (G.DataMgr.runtime.isNewRole) G.ChannelSDK.report(ReportType.ACTIVITION);
            if (G.DataMgr.runtime.isNewRole) G.ChannelSDK.report(ReportType.CREATEROLE);
            G.ChannelSDK.report(ReportType.LOGIN);
            G.ModuleMgr.heroModule.processCurrencyChange(0);
            if (G.IsIOSPlatForm) {
                //注册ios本地推送的消息
                G.DataMgr.iosNotifyData.addNotifyToIosPushCenter();
            }
            //设置内网平台名称（方便测试平台功能）
            let platName = G.DataMgr.systemData.ossTestPlatName;
            if (defines.has('TESTUIN') && platName != '') {
                let config = G.DataMgr.systemData.getPlatQQConfigByPlatName(platName);
                if (config == null) {
                    uts.log('请查看News表里qq客服表的平台名称,输入正确的平台名');
                } else {
                    G.DataMgr.systemData.ossTestPlatId = config.m_iPlatformID;
                    G.DataMgr.systemData.ossTestChannel = config.m_szChannelID;
                }
            }
            G.DataMgr.funcLimitData.initFuncState();
            uts.gc();
        } else {
            // 登录失败
            uts.log("登录失败，错误码：" + body.m_uiResultID);
            if (Macros.LOGINOUT_REAZON_NORMAL == G.DataMgr.systemData.loginReason) {
                G.Uimgr.createForm<LoginTip>(LoginTip).open(G.DataMgr.errorData.getErrorStringById(body.m_uiResultID), true, delegate(this, this.onLoginNormalFailedConfirm));
            }
            else {
                // 跨服登录失败（比如队长离开副本），去掉转圈
                this.onCrossFailed(G.DataMgr.errorData.getErrorStringById(body.m_uiResultID), 0);
            }
        }
    }

    private onLoginNormalFailedConfirm(state: MessageBoxConst) {
        if (MessageBoxConst.yes == state) {
            if (G.Uimgr.getForm(LoginView) == null) {
                G.reloadGame(false);
            }
        }
    }

    private _onLogoutServerNotify(body: Protocol.LogoutServer_Notify): void {
        let isMe = CompareUtil.isRoleIDEqual(body.m_stRoleID, G.DataMgr.heroData.roleID);
        uts.log('LogoutServer_Notify, uin = ' + body.m_stRoleID.m_uiUin + ', reason = ' + body.m_iReason);
        if (body.m_iReason == ErrorId.EQEC_Logout_Relogin) {
            this.cancelCross();
        }
        else {
            if (isMe) {
                // 被T下线
                G.DataMgr.runtime.loginStatus = EnumLoginStatus.kickedOut;
                G.TipMgr.showConfirm(body.m_iReason > 0 ? G.DataMgr.errorData.getErrorStringById(body.m_iReason) : '你被服务器踢下线了', ConfirmCheck.noCheck, '确定',
                    delegate(this, this.onSelfKickOffConfirm));
            }
        }
    }

    /**
	* 弹窗确定的回调函数，用于返回选区页面。
	* @param args
	* @param state
	*
	*/
    private onSelfKickOffConfirm(state: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == state) {
            // 点确定重新回选区页面
            G.reloadGame(false);
        }
    }

    private updateHeroData(loginBody: Protocol.LoginServer_Response): void {
        let heroData = G.DataMgr.heroData;
        heroData.roleCreateTime = loginBody.m_uiCreateTime;
        let roleInfo: Protocol.RoleInfo = loginBody.m_stRoleInfo;
        heroData.updateRoleID(roleInfo.m_stID);
        let upos: Protocol.UnitPosition = roleInfo.m_stUnitInfo.m_stUnitMovement.m_stCurrentPosition;
        heroData.setPosition(upos.m_uiX, upos.m_uiY);
        heroData.unitType = UnitCtrlType.hero;
        heroData.lifeConsume = loginBody.m_uiLifeConsume;
        G.DataMgr.heroData.curVipLevel = G.DataMgr.vipData.getVipLevelByMoney(loginBody.m_uiLifeConsume);

        heroData.renameCd = loginBody.m_iModifyNameTime;
        // uts.logError(heroData.renameCd.toString());

        let svrPath = roleInfo.m_stUnitInfo.m_stUnitMovement.m_stPath.m_astPosition;
        let svrPathLen: number = svrPath.length;
        if (svrPathLen > 0) {
            if (null == heroData.path) {
                heroData.path = [];
            }
            for (let i: number = 0; i < svrPathLen; i++) {
                heroData.path.push(new UnityEngine.Vector2(svrPath[i].m_uiX, svrPath[i].m_uiY));
            }
        } else {
            heroData.path = null;
        }
        heroData.gender = roleInfo.m_stBaseProfile.m_cGender;
        heroData.name = roleInfo.m_stBaseProfile.m_szNickName;
        //登陆时存放一次玩家的姓名 等级
        G.ServerData.setPlayerData('heroName', roleInfo.m_stBaseProfile.m_szNickName);
        G.ServerData.setPlayerData('heroLevel', roleInfo.m_stBaseProfile.m_usLevel.toString());
        heroData.profession = roleInfo.m_stBaseProfile.m_cProfession;
        heroData.isGM = roleInfo.m_stBaseProfile.m_cGMType == Macros.GMType_None ? false : true;
        heroData.guildId = loginBody.m_stGuildInfo.m_uiGuildID;
        heroData.guildGrade = loginBody.m_stGuildInfo.m_ucGrade;
        heroData.m_usShowTitleID = loginBody.m_stShowFixTitleInfo.m_usShowTitleID;
        // 这里后台数据库有数据冗余，要根据id来判断宗门名字是否存在
        if (heroData.guildId <= 0) {
            heroData.guildName = "";
        }
        else {
            heroData.guildName = loginBody.m_stGuildInfo.m_szGuildName;
        }

        heroData.avatarList = roleInfo.m_stAvatarList;

        var unitInfo: Protocol.UnitInfo = roleInfo.m_stUnitInfo;
        heroData.unitID = unitInfo.m_iUnitID;
        heroData.direction = unitInfo.m_stUnitMovement.m_iDirection;
        heroData.unitStatus = unitInfo.m_uiUnitStatus;

        heroData.updateUnitAttributes(unitInfo.m_stUnitAttribute);

        heroData.zoneID = loginBody.m_iZoneID;
        heroData.uniqueTitle2 = loginBody.m_stShowFixTitleInfo.m_usID; // 唯一称号

        //更新所有货币
        heroData.updateNewCurrencyInfoList(loginBody.m_stCurrencyInfoList);

        heroData.updateChargeMoney(loginBody.m_iChargeMoney);

        // 更新伙伴离线时间
        heroData.offlineTime = loginBody.m_ucTotalOfflineTime;

        heroData.createTime = loginBody.m_uiCreateTime;

        G.DataMgr.equipStrengthenData.ItemMergeCache.setHeroLevel(heroData.level);
    }

    /**
	* 登陆之后数据返回
	* @param msg
	*
	*/
    private _onAfterLoginNotify(body: Protocol.AfterLoginData_Notify): void {
        let afterLoginData = body.m_stAfterLoginData;
        uts.log('当前时区：' + afterLoginData.m_cLocatZoneTime);
        G.DataMgr.runtime.chatCheckCrc = afterLoginData.m_ucCheck;
        G.SyncTime.timeZone = afterLoginData.m_cLocatZoneTime;
        G.DataMgr.funcLimitData.openTimeFunc = afterLoginData.m_stFunctionActList;
        G.DataMgr.systemData.linkInfo = afterLoginData.m_stLinkInfo;
        G.DataMgr.heroData.roleProp = afterLoginData.m_cRoleType;
        G.DataMgr.heroData.pkMode = afterLoginData.m_stPKInfo.m_ucPKStaus;
        G.DataMgr.heroData.pkValue = afterLoginData.m_stPKInfo.m_cPKVal;
        G.DataMgr.heroData.armyID = afterLoginData.m_ucArmyID;
        G.DataMgr.heroData.teamId = afterLoginData.m_iTeamID;
        G.DataMgr.heroData.dressList = afterLoginData.m_stDressImageList;
        G.DataMgr.juyuanData.setId(afterLoginData.m_iJuYuanInfo);
        G.DataMgr.heroData.juYuanId = afterLoginData.m_iJuYuanInfo;
        //武缘寻宝信息
        G.DataMgr.petData.treasureHuntInfo = afterLoginData.m_stWYTreasureHuntInfo;
        //结婚系统相关
        G.DataMgr.heroData.mateName = afterLoginData.m_stLoverInfo.m_stBaseProfile.m_szNickName;
        G.DataMgr.heroData.lover = afterLoginData.m_stLoverInfo;
        G.DataMgr.petData.updatePets(afterLoginData.m_stBeautyInfo.m_astBeautyInfo);
        //G.DataMgr.cityMasterRoleinfo = afterLoginData.m_stCityKingInfo;//雕像数据
        G.DataMgr.skillData.setFazeData(afterLoginData.m_stFazeInfo);
        G.DataMgr.zhufuData.setData(afterLoginData.m_stCSHeroSubList);
        // 守护神
        G.DataMgr.shieldGodData.updateShieldData(afterLoginData.m_stShieldGodList);
        G.DataMgr.heroData.shieldId = afterLoginData.m_stShieldGodList.m_iShowID;

        this._handleZeroRefreshData(body.m_stZeroRefreshData, false);

        let hero = G.UnitMgr.hero;
        if (hero) {
            hero.checkShield();
        }
        // 装备锻造
        G.DataMgr.equipStrengthenData.updateWashStage(afterLoginData.m_stEquipWashStageInfo);
        //装备位强化
        G.DataMgr.equipStrengthenData.setEquipSlotData(afterLoginData.m_stEquipSlotInfoList);
        //装备位套装
        G.DataMgr.equipStrengthenData.slotSuitInfo = uts.deepcopy(afterLoginData.m_stSlotSuitInfo, G.DataMgr.equipStrengthenData.slotSuitInfo, true);

        //装备收集
        G.DataMgr.equipStrengthenData.equipSuitInfo = uts.deepcopy(afterLoginData.m_stEquipSuitInfo, G.DataMgr.equipStrengthenData.equipSuitInfo, true);
        //G.NoticeCtrl.checkEquipCollect();
        G.DataMgr.zhufuData.xueMaiData = afterLoginData.m_stCrazyBloodInfo;

        G.DataMgr.activityData.levelGiftData.setGetlevel(afterLoginData.m_usLevelBag);
        G.DataMgr.activityData.levelGiftData.initNotGetLvs(afterLoginData.m_usLevelBag);
        //拉取伙伴光印数据
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetZhenTuRequest(Macros.BEAUTY_ZT_LIST));
        // 拉取斗兽
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getShenShouRequest(Macros.SHENSHOU_OP_PANEL, 0, 0));
        //上次下线时间
        G.DataMgr.systemData.m_uiLastLogoutTime = afterLoginData.m_uiLastLogoutTime;
        G.DataMgr.systemData.m_uilastLoginTime = afterLoginData.m_uiLastLoginTime;
        G.DataMgr.systemData.firstLoginToday = !G.SyncTime.isSameDay(G.DataMgr.systemData.m_uilastLoginTime, Math.floor(G.SyncTime.getCurrentTime() / 1000));

        G.ViewCacher.mainView.onSkillChange(0);
        G.ViewCacher.mainView.onExperienceSkillIcon();
        this.dispatchEvent(Events.updateJuYanInfo);
        G.ModuleMgr.unitModule.onHunYinChange();
        //魂力
        let hunliData = G.DataMgr.hunliData;
        let hunliInfo = afterLoginData.m_stHunLiInfo;
        hunliData.level = hunliInfo.m_ucHunLiLevel;
        hunliData.hunliNode = hunliInfo.m_ucHunLiSubLevel;
        hunliData.conditionInfo = hunliInfo.m_stCurConditionList;
        // hunliData.killbossCount = hunliInfo.m_ucHunHuanCount;
        // hunliData.bossList = hunliInfo.m_aiHunHuanConditions;
        hunliData.hunhuanProgress = hunliInfo.m_uiHunHuanProgress;
        hunliData.hunhuanId = hunliInfo.m_uiHunHuanID;
        //已经晋升过的魂环
        hunliData.hunhuanLevelInfoList = hunliInfo.m_stHunHuanInfoList;
        hunliData.levelUpCount = hunliInfo.m_ucHunHuanInfoCount;
        hunliData.initialize();
        hunliData.hunguStrengeData.setSeverConfig(afterLoginData.m_stHunGuSlotInfoList);
        hunliData.hunGuXiLianData.setSeverConfig(afterLoginData.m_stHunGuSlotInfoList);
        hunliData.hunGuXiLianData.updateXiLianStageInfo(afterLoginData.m_stSlotWashStageInfo);
        G.DataMgr.equipStrengthenData.setSlotRefineLevel(afterLoginData.m_stHunGuSlotInfoList);
        //let elementModule: ElementModule = G.module.getModule(EnumModuleName.ElementModule) as ElementModule;
        //elementModule.updateAllTitle();
        ////这时候hero已经创建好了手动刷一下
        //this.Hero.refreshLoverName();
        //this.Hero.updateHeroBattleTitle();
        //if (this.Hero != null) {
        //    this.Hero.showName();
        //    if (this.Hero.pet != null) {
        //        this.Hero.pet.refreshFollowedNameColor();
        //    }
        //}

        //let npc: StatueNPC = elementModule.getElement(StatueNPC.ID) as StatueNPC;
        //if (npc != null) {
        //    npc.updateMode();
        //}

        // 检查守护神
        G.UnitMgr.hero.checkShield();
        G.DataMgr.activityData.m_stPreviewRewardInfo = afterLoginData.m_stPreviewRewardInfo;
        G.ViewCacher.mainView.newFuncPreCtrl.updateView();
        if (!G.DataMgr.pinstanceData.isReady) {
            G.DataMgr.pinstanceData.isReady = true;
            G.GuideMgr.onPinstanceDataReady();
        }
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_CROSS_ZZZD)) {
            //跨服夺宝拉取数据
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CROSS_ZZZD, Macros.CZJXZD_OPEN_PANNEL));
        }
        //每日登录的时候如果功能开启就弹七日目标（一天弹一次）
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_7GOAL_KFCB) && G.DataMgr.systemData.firstLoginToday) {
            G.Uimgr.createForm<KaiFuHuoDongView>(KaiFuHuoDongView).open(KeyWord.OTHER_FUNCTION_7GOAL_KFCB);
        }
    }

    private _onZeroRefreshNotify(body: Protocol.ZeroRefreshData_Notify): void {
        this._handleZeroRefreshData(body.m_stZeroRefreshData, true);
    }

    private _handleZeroRefreshData(data: Protocol.ZeroRefreshDataInfo, fromZeroRefresh: boolean): void {
        // 同步服务器时间
        let head = G.ModuleMgr.netModule.MessageHead;
        G.SyncTime.setServerTime(head.m_uiTimeStamp_High, head.m_uiTimeStamp_Low);

        G.DataMgr.tgbjData.flag = data.m_stSkyLotteryData.m_uiGiftFlag;
        G.DataMgr.tgbjData.freeNum = data.m_stSkyLotteryData.m_ucFreeTimes;
        G.DataMgr.tgbjData.totalNum = data.m_stSkyLotteryData.m_iLotteryDropTimes;
        let tanBaoView = G.Uimgr.getForm<TanBaoView>(TanBaoView);
        if (tanBaoView != null) {
            tanBaoView.updateBox();
        }

        //招财猫数据拉取
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KF_LUCKYCAT_OPEN_PANNEL));
      
        G.DataMgr.pinstanceData.updataAllPinstanceHome(data.m_stPinHomeData);
        // G.DataMgr.pinstanceData.fsdData = data.m_stFSDData;
        G.DataMgr.systemData.dayOperateBits = data.m_uiDayOperateRecord;
        G.DataMgr.activityData.kaifuSignData.updateProgress(data.m_stOpenSvrSignListRsp.m_iGetTag, data.m_stOpenSvrSignListRsp.m_ucMaxLoginDays);
        //更新签到数据
        G.DataMgr.activityData.dailySignData.updateSignData(data.m_stSignQry);
        //7天投资
        G.DataMgr.activityData.sevenDayFundData = uts.deepcopy(data.m_stSevenDayFundData, G.DataMgr.activityData.sevenDayFundData, true);
        //装备炼体消耗
        G.DataMgr.equipStrengthenData.slotLTUpCostInfo = uts.deepcopy(data.m_stSlotLTUpCostInfo, G.DataMgr.equipStrengthenData.slotLTUpCostInfo, true);
        // 红包有礼
        G.DataMgr.kaifuActData.updateHongBaoYouLi(data.m_stKaiFuXFFLData);
        //7天累充
        G.DataMgr.kaifuActData.updatekf7DayLC(data.m_st7DayLJCZInfo);
        //连充返利
        G.DataMgr.kaifuActData.updatekfLCFL(data.m_stCSKFLCFLInfo);
        //消费返利
        G.DataMgr.kaifuActData.updateKFXFFLInfo(data.m_stKaiFuXFLBInfo);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_KFNS, Macros.ACTIVITY_KFNS_OPEN));

        //G.DataMgr.activityData.scValue = uts.deepcopy(data.m_stSCData, G.DataMgr.activityData.scValue, true);
        //G.DataMgr.activityData.dailyConsumeIdDic = null;
        //G.DataMgr.activityData.dailyChargeIdDic = null;
        //G.DataMgr.activityData.clearSellNetDic();
        //G.DataMgr.activityData.jinjieRiData = uts.deepcopy(data.m_stJinJieRiData, G.DataMgr.activityData.jinjieRiData, true);
        //G.DataMgr.activityData.updateYbwlDate(data.m_stYBWLData);

        ////////////////////////////// 下面的前台自己刷新 ////////////////////////////
        //一元夺宝
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.YYDB_OPEN_PANEL));

        // 拉取宗门信息
        if (G.DataMgr.heroData.guildId > 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.fetchGuildAbstract());
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildExploreOpenRequest());
        }

        // 首充礼包请求
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSCGetInfoRequest());

        ///**开服活动累计充值*/
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.LJCZ_OPEN_PANEL));

        // // 开服签到
        // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_OPENSIGN, Macros.ACTIVITY_OPENSVR_SIGN_LIST));

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KFZZZD_OPEN_PANEL));

        // //刷新在线奖励领取面板
        // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_ONLINEGIFT, Macros.ONLINEGIFTACT_SHOW));

        //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMonthCardRequest(Macros.MONTH_CARD_OPEN_PANEL));
        ////兼容苏强的BUG，过天没有推投资计划数据下来
        //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_JUHSACT, Macros.JUHS_OPENPANEL));
        ////封神榜
        //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_PVP_BASE, Macros.ACTIVITY_KFJDC_LIST));
        //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_DAILYCONSUME_CONSUME, Macros.CONSUME_RANK_PANEL));
        ///**请求排行榜数据*/
        //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_DAILYCONSUME_CONSUME, Macros.CONSUME_RANK_LIST_GET));
        //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_DAILYCONSUME_CONSUME, Macros.DAILY_CONSUME_PANEL));

        //G.DataMgr.vipData.requestVPlanData();
        // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLLECT_EXCHANGE, Macros.ACTIVITY_SJDH_PANNEL));

        //进阶返回
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.STAGEDAY_OPEN_PANEL));
        //个人副本
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, Macros.PINSTANCE_ID_PRIVATE_BOSS));
        // 经验副本
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, Macros.PINSTANCE_ID_SHNS));
        //材料副本
        for (let i = 0; i < CaiLiaoFuBenPanel.CLFBTypeListCount; i++) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, CaiLiaoFuBenPanel.CLFBPinstanceIds[i]));
        }
        // 伙伴副本
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, Macros.PINSTANCE_ID_WYFB));
        // 强化副本
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, Macros.PINSTANCE_ID_WST));
        //神选之路
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, Macros.PINSTANCE_ID_SXZL));

        // vip副本
        let pids = PinstanceIDUtil.TeQuanFuBenIDs;
        for (let pid of pids) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, pid));
        }
        // 能力叛乱
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWangHouJiangXiangRequest(Macros.CROSS_WHJX_PANNLE, 0));

        // 斗兽
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSxPkPanelRequest());
        // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLOSSEUM, Macros.COLOSSEUM_ACT_OPEN));
        //婚姻
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMarryRequest(Macros.HY_LIST_XIANYUAN));
        //婚姻副本
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, Macros.PINSTANCE_ID_FUQI));
        ////金玉满堂
        //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(ActivityId.JYMT, Macros.ACTIVITY_BBGS_OPEN_PANEL));

        // 伙伴远征
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWyyzPanelRequest());
        // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SPRING_LOGIN, Macros.ACTIVITY_SPRING_LOGIN_PANEL));
        // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SPRING_CHARGE, Macros.ACTIVITY_SPRING_CHARGE_PANEL));
        // //盛典宝箱奖励
        // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SDBX, Macros.ACTIVITY_SDBX_OPEN_PANEL));
        //祈福
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getQifuRequest(Macros.QIFU_OPEN_PANEL));
        // //拉取boss之家信息
        // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HOME_BOSS_ACT, Macros.ACTIVITY_HOME_BOSS_OPEN));

        // //火热世界杯
        // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDCUP, Macros.ACTIVITY_WORLDCUP_PANEL));
        // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDCUPCHAMPION, Macros.ACTIVITY_WORLDCUP_CHAMPION_PANEL));
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.STAGEDAT_RANK_OPEN_PANEL));
        // //限时秒杀面板数据
        // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_RUSH_PURCHASE, Macros.ACT_RUSH_PURCHASE_PANEL));
        // 拉取比武大会
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleCommonRequest(Macros.CROSS_SINGLE_OPEN));
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleNotifyRequest(Macros.CROSS_SINGLE_FINAL_OPEN));
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSaiJiPanelRequest());
        G.DataMgr.funcLimitData.updateFuncStates();

        //发送过天消息
        this.dispatchEvent(Events.ServerOverDay);
        G.ActBtnCtrl.update(false);
        G.MainBtnCtrl.update(false);
        G.NoticeCtrl.checkFuLiDaTing();
        G.GuideMgr.tipMarkCtrl.onChangeDay();
        G.GuideMgr.tipMarkCtrl.onEquipLiantiChange();
        G.DataMgr.taskRecommendData.onLogin();

    }

    /////////////////////////////////////////////// 跨服 ///////////////////////////////////////////////

    crossServer(serverid: number, domain: string, ip: string, port: number) {
        if ('' == ip || 0 == port) {
            // 如果服务器刚起来，这时候立马sync role会得到空的，这里当跨服失败处理
            this.onCrossFailed(null, EnumCrossErrorCode.ipNone);
            return;
        }
        let enterType: number = G.DataMgr.systemData.tmploginEnterType.m_cEnterType;
        uts.log('开始跨服：' + domain + '|' + ip + ':' + port + ', enterType = ' + enterType);
        // 取消采集
        G.ViewCacher.collectionBar.cancelByPrepareID(0);
        // 停止走路等
        G.ActionHandler.beAGoodBaby(true, true, true, true, true);
        // 开始转圈圈
        G.ModuleMgr.loadingModule.setActive(true);

        // 连接目标Socket
        let crossParas = G.DataMgr.crossParas;
        crossParas.worldId = serverid;
        crossParas.domain = domain;
        crossParas.serverIp = ip;
        crossParas.serverPort = port;
        G.ModuleMgr.netModule.connectCross();
    }

    onCrossFailed(errorDesc: string, errorCode: number) {
        // 跨服失败
        uts.log('跨服失败.');
        G.TipMgr.showConfirm(errorDesc ? errorDesc : ('跨服失败，请稍候再试。错误码：' + errorCode), ConfirmCheck.noCheck, '确定');
        G.ModuleMgr.kfModule.onCrossFailed();
        this.cancelCross();
    }

    /**
     * 返回原服
     */
    cancelCross() {
        let netId = G.ModuleMgr.netModule.NetId;
        if (EnumNetId.cross == netId) {
            uts.log('返回原服...');
            G.ModuleMgr.netModule.closeConnect();
            // 开始转圈圈
            G.ModuleMgr.loadingModule.setActive(true);
            // 连接原服
            G.DataMgr.systemData.setLoginEnterParam(Macros.LOGINOUT_REAZON_NORMAL, 0, 0, 0);
            //回本服目标服id填0
            G.ModuleMgr.netModule.connect(3);
        } else {
            if (G.DataMgr.sceneData.isEnterSceneComplete) {
                G.ModuleMgr.loadingModule.setActive(false);
            }
        }
        // 解冻功能
        G.DataMgr.runtime.isAllFuncLocked = false;
        // 清掉状态
        G.DataMgr.kfjdcData.myStatus = EnumKuafuPvpStatus.none;
        G.DataMgr.kf3v3Data.myStatus = EnumKuafuPvpStatus.none;
    }

    /**
     * 后台事件响应
     * @param msg
     *
     */
    private onSystemSettingChangeNotify(notify: Protocol.SystemSetting_Notify): void {
        G.DataMgr.systemData.setSystemInfo(notify.m_stSystemSettingList);
    }

    afterLogin() {
        this.setActive(false);
        G.Uimgr.closeForm(CreateRoleView);
        G.Uimgr.closeForm(LoginTip);
        if (null == G.Uimgr.getForm<WaitingView>(WaitingView)) {
            // 如果没有显示断线重连就显示loading板，因为在场景中断线重连，重新进场景的时候不要显示loading板
            G.ModuleMgr.loadingModule.setActive(true);
        }
        G.ModuleMgr.loadingModule.enableRandomTip();
    }

    setActive(show: boolean) {
        if (show) {
            //先检查公告是否有更新
            let hasNoticeUpdate: boolean = false;
            if (G.IsIosTiShenEnv) {
                //ios提审服永远不自动打开公告面板
                hasNoticeUpdate = false;
            } else {
                let noticeNowCtrlTime: number = 0;
                let noticeLastCtrlTime = UnityEngine.PlayerPrefs.GetInt("lastNoticeOpenTime", 0);
                if (G.ChannelSDK.gonggao_CtrlTime != '') {
                    //之后的做和最新的公告做比较,时间变化就显示
                    noticeNowCtrlTime = Math.floor((DataFormatter.getTimeByTimeStr(G.ChannelSDK.gonggao_CtrlTime) / 1000));
                    hasNoticeUpdate = noticeNowCtrlTime > noticeLastCtrlTime;
                    //将该次公告时间记录到本地
                    UnityEngine.PlayerPrefs.SetInt("lastNoticeOpenTime", noticeNowCtrlTime);
                }
                else if (noticeLastCtrlTime == 0) {
                    //第一次进入游戏
                    hasNoticeUpdate = true;
                }
            }
            if (hasNoticeUpdate) {
                //系统公告有更新,自动打开公告界面,隐藏主界面ui,并且不是ios提审环境
                G.Uimgr.createForm<NoticeView>(NoticeView).open();
            }
            let loginView = G.Uimgr.getForm<LoginView>(LoginView);
            if (loginView == null) {
                G.Uimgr.createForm<LoginView>(LoginView).open(hasNoticeUpdate);
            } else {
                loginView.updateMainPanel(hasNoticeUpdate);
            }
        }
        else {
            G.AudioMgr.stopBgm();
            G.Uimgr.closeForm(NoticeView);
            G.Uimgr.closeForm(LoginView);
            G.ViewCacher.serverSelectView.close();
        }
    }

    cacheSet(): boolean {
        if (G.ServerData.Count == 0) {
            this.showLoginServerTip('请检查,没有一个服务器');
            return false;
        }
        let gameParas = G.DataMgr.gameParas;
        //存放玩家账号
        let skipNone = false;
        if (defines.has('TESTUIN')) {
            UnityEngine.PlayerPrefs.SetString("userName", gameParas.uin.toString());
            // 测试模式下，可能会手动修改serverID，会导致data为null
            skipNone = true;
        }
        let data = G.ServerData.getServerDataById(gameParas.serverID, gameParas.serverIp);
        if (data != null) {
            //内网自己人不管什么状态都可以进
            if (!G.ServerData.isNeiWangOssTest) {
                this.serverIsFull = data.isFull;
                if (data.isMaintenance) {
                    this.showLoginServerTip('服务器正在维护中,请稍后再来或者换一个服务器');
                    return false;
                }
            } else {
                this.serverIsFull = false;
            }
            //存放最新登陆的数据
            G.ServerData.setLastNewLoginData('serverId', data.serverId.toString());
            G.ServerData.setLastNewLoginData('serverIp', data.serverIp);
            //存放账号对应信息,结构为('account_serverId_name')来存放玩家在每个服务器的数据
            G.ServerData.setPlayerData('serverId', data.serverId.toString());
            G.ServerData.setPlayerData('serverIp', data.serverIp);
            G.ServerData.lastSelectedServer = data;
        } else if (!skipNone) {
            G.Uimgr.createForm<LoginTip>(LoginTip).open('服务器在列表里找不到,请换一个服务器或者稍后在来', true);
            return false;
        }
        return true;
    }

    private showLoginServerTip(showStr: string) {
        G.Uimgr.createForm<LoginTip>(LoginTip).open(showStr, true);
        let loginView = G.Uimgr.getForm<LoginView>(LoginView);
        if (loginView != null) {
            loginView.setLoginBtnEnabled(true);
        }
    }



    loginGame() {
        G.DataMgr.gameParas.resetZXINGInfo();
        G.DataMgr.gameParas.platformType = G.ChannelSDK.PlatformType;
        if (!this.cacheSet()) return;
        G.ModuleMgr.netModule.connect(0);
    }

    loginGameForZXingPC() {
        if (!this.cacheSet()) return;
        G.DataMgr.gameParas.resetZXINGInfo();
        G.DataMgr.gameParas.zxingPCLogin = true;
        G.ModuleMgr.netModule.connect(0);
    }

    loginGameForZXingMobile(session, token) {
        let gameParas = G.DataMgr.gameParas;
        gameParas.resetZXINGInfo();
        gameParas.zxingMobileLogin = true;
        gameParas.zxingSession = session;
        gameParas.zxingToken = token;
        gameParas.platformType = G.ChannelSDK.PlatformType;
        if (!this.cacheSet()) return;
        G.ModuleMgr.netModule.connect(0);
    }
}
export default LoginModule;