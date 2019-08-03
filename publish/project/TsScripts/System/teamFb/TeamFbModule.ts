import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { PinstanceData } from 'System/data/PinstanceData'
import { ErrorId } from 'System/protocol/ErrorId'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { MainUIEffectView } from 'System/main/MainUIEffectView'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'
import { ZuDuiFuBenPanel } from 'System/pinstance/hall/ZuDuiFuBenPanel'
import { Events } from 'System/Events'
import { XianLvFuBenPanel } from 'System/Marry/XianLvFuBenPanel'
import { InvitingConfirmView } from 'System/team/InvitingConfirmView'


/**
 * 锁仙台模块。
 *
 * 本文件代码由模板生成，你可能需要继续修改其他代码文件（比如EnumModuleName）才能正常使用。
 *
 * @author teppei
 *
 */
export class TeamFbModule extends EventDispatcher {

    private static readonly COUNT_DOWN: number = 5;
    private readonly TeamTickKey = '1';

    /**倒计时特效ID。*/
    private m_countDownID: number = 0;

    private countDownTimer: Game.Timer;

    private teamTickTimer: Game.Timer;

    constructor() {
        super();
        this.addNetListener(Macros.MsgID_CROSS_CS_Response, this._onCrossCsResponse);
    }

    private _onCrossCsResponse(response: Protocol.Cross_CS_Response): void {
        if (Macros.CROSS_GET_TEAMLIST == response.m_usType
            || Macros.CROSS_CREATE_TEAM == response.m_usType
            || Macros.CROSS_JOIN_TEAM == response.m_usType
            || Macros.CROSS_KICK_TEAM == response.m_usType
            || Macros.CROSS_EXIT_TEAM == response.m_usType
            || Macros.CROSS_SET_TEAM == response.m_usType
            || Macros.CROSS_READY_TEAM == response.m_usType
            || Macros.CROSS_START_PINSTANCE == response.m_usType
            || (Macros.CROSS_SYN_ROLE == response.m_usType && KeyWord.NAVIGATION_CROSS_PIN == response.m_stValue.m_stCSCrossSynRoleRes.m_ucSynType)
            || Macros.CROSS_GET_RMB_GETINFO == response.m_usType
            || Macros.CROSS_RECRUIT_TEAM == response.m_usType
        ) {
            let myTeam: Protocol.Cross_OneTeam;
            if (ErrorId.EQEC_Success != response.m_iResultID) {
                G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResultID));

                if (ErrorId.EQEC_TRANS_PINCROSS_FAIL == response.m_iResultID || ErrorId.EQEC_TRANS_GUOYUN == response.m_iResultID || -1 == response.m_iResultID) {
                    // 进入副本失败，退出队伍
                    myTeam = G.DataMgr.sxtData.myTeam;
                    if (null != myTeam) {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossQuitTeamRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID));
                    }
                    // 离开副本解冻所有功能
                    G.ModuleMgr.loginModule.cancelCross();
                }
            }
            else {
                let zdfbPanel = G.Uimgr.getSubFormByID<ZuDuiFuBenPanel>(PinstanceHallView, KeyWord.OTHER_FUNCTION_ZDFB);
                let xianLvPanel = G.Uimgr.getForm<XianLvFuBenPanel>(XianLvFuBenPanel);
                if (Macros.CROSS_GET_TEAMLIST == response.m_usType) {
                    // 拉取副本队伍列表
                    G.DataMgr.sxtData.updateTeamList(response.m_stValue.m_stCSCrossGetTeamListRes);
                    if (null != zdfbPanel) {
                        zdfbPanel.updateByGetTeamList();
                    }
                  
                    if (null != xianLvPanel) {
                        xianLvPanel.updateByGetTeamList();
                    }
                }
                else if (Macros.CROSS_CREATE_TEAM == response.m_usType) {
                    // 创建队伍，包括自己和别人
                    G.DataMgr.sxtData.updateByCreateJoinSetReadyStart(response.m_stValue.m_stCSCrossCreateTeamRes.m_stTeam);
                    if (null != zdfbPanel) {
                        zdfbPanel.updateByCreateJoinSetReadyStart();
                    }
                    //if (null != fsdPanel) {
                    //    fsdPanel.updateByCreateJoinSetReadyStart();
                    //}
                    if (null != xianLvPanel) {
                        xianLvPanel.updateByCreateJoinSetReadyStart();
                    }
                    this._checkMyTeam();
                }
                else if (Macros.CROSS_JOIN_TEAM == response.m_usType) {
                    // 加入队伍，包括自己和别人
                    G.DataMgr.sxtData.updateByCreateJoinSetReadyStart(response.m_stValue.m_stCSCrossJoinTeamRes.m_stTeam);
                    if (defines.has('_DEBUG')) {
                        uts.assert(response.m_stValue.m_stCSCrossJoinTeamRes.m_stTeam.m_uiPinstanceID > 0, '艹，副本ID还能是0？');
                    }
                    if (null != zdfbPanel) {
                        zdfbPanel.updateByCreateJoinSetReadyStart();
                    }
                  
                    if (null != xianLvPanel) {
                        xianLvPanel.updateByCreateJoinSetReadyStart();
                    }
                    this._checkMyTeam();

                    if (!G.DataMgr.sxtData.amICaptain()) {
                        myTeam = G.DataMgr.sxtData.myTeam;
                        // 普通队员自动准备
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossTeamReadyRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID));
                    }
                }
                else if (Macros.CROSS_KICK_TEAM == response.m_usType) {
                    // 踢出队伍，包括自己和别人
                    G.DataMgr.sxtData.updateByKickQuitTeam(response.m_stValue.m_stCSCrossKickTeamRes.m_stTeam);
                    if (null != zdfbPanel) {
                        zdfbPanel.updateByKickQuitTeam();
                    }
                   
                    if (null != xianLvPanel) {
                        xianLvPanel.updateByKickQuitTeam();
                    }
                    this._checkMyTeam();
                }
                else if (Macros.CROSS_EXIT_TEAM == response.m_usType) {
                    // 退出队伍，包括自己和别人
                    G.DataMgr.sxtData.updateByKickQuitTeam(response.m_stValue.m_stCSCrossExitTeamRes.m_stTeam);
                    if (null != zdfbPanel) {
                        zdfbPanel.updateByKickQuitTeam();
                    }
                   
                    if (null != xianLvPanel) {
                        xianLvPanel.updateByKickQuitTeam();
                    }
                    this._checkMyTeam();
                }
                else if (Macros.CROSS_SET_TEAM == response.m_usType) {
                    // 设置队伍
                    G.DataMgr.sxtData.updateByCreateJoinSetReadyStart(response.m_stValue.m_stCSCrossSetTeamRes.m_stTeam);
                    if (defines.has('_DEBUG')) {
                        uts.assert(response.m_stValue.m_stCSCrossSetTeamRes.m_stTeam.m_uiPinstanceID > 0, '艹，副本ID还能是0？');
                    }
                    if (null != zdfbPanel) {
                        zdfbPanel.updateByCreateJoinSetReadyStart();
                    }
                   
                    if (null != xianLvPanel) {
                        xianLvPanel.updateByCreateJoinSetReadyStart();
                    }
                }
                else if (Macros.CROSS_READY_TEAM == response.m_usType) {
                    // 准备
                    G.DataMgr.sxtData.updateByCreateJoinSetReadyStart(response.m_stValue.m_stCSCrossReadyTeamRes.m_stTeam);
                    if (defines.has('_DEBUG')) {
                        uts.assert(response.m_stValue.m_stCSCrossReadyTeamRes.m_stTeam.m_uiPinstanceID > 0, '艹，副本ID还能是0？');
                    }
                    if (null != zdfbPanel) {
                        zdfbPanel.updateByCreateJoinSetReadyStart();
                    }
                   
                    if (null != xianLvPanel) {
                        xianLvPanel.updateByCreateJoinSetReadyStart();
                    }
                }
                else if (Macros.CROSS_START_PINSTANCE == response.m_usType) {
                    // 开始挑战
                    // 设置等待同步数据
                    // 取出队长，查看是否与队长同线
                    myTeam = G.DataMgr.sxtData.myTeam;
                    if (defines.has('_DEBUG')) {
                        uts.assert(null != myTeam, '收到START RESP时必须有队伍！');
                    }
                    // 与队长不在同一服，需要等待同步数据
                    let captain: Protocol.Cross_OneTeamMem = G.DataMgr.sxtData.captain;
                    G.DataMgr.sxtData.waitSyncRole = (captain.m_szDomain != G.DataMgr.gameParas.domain || captain.m_szIP != G.DataMgr.gameParas.serverIp || captain.m_uiPort != G.DataMgr.gameParas.serverPort);
                    let amICaptain: boolean = G.DataMgr.sxtData.amICaptain();
                    // 更新队伍信息
                    G.DataMgr.sxtData.updateByCreateJoinSetReadyStart(response.m_stValue.m_stCSCrossStartPinRes.m_stTeam);
                    if (defines.has('_DEBUG')) {
                        uts.assert(response.m_stValue.m_stCSCrossStartPinRes.m_stTeam.m_uiPinstanceID > 0, '艹，副本ID还能是0？');
                    }

                    // 后台已经解散队伍了，这里把我的队伍清掉
                    G.DataMgr.sxtData.myTeam = null;
                    this._checkMyTeam();
                    // 关闭锁仙台对话框
                    G.Uimgr.closeForm(PinstanceHallView);

                    // 检查是否死了
                    if (G.DataMgr.heroData.isAlive) {
                        if (amICaptain) {
                            // 队长取消5秒延时
                            if (null != this.countDownTimer) {
                                this.countDownTimer.Stop();
                                this.countDownTimer = null;
                            }
                        }
                        else {
                            // 不是队长的话5秒后进副本
                            if (null == this.countDownTimer) {
                                this.countDownTimer = new Game.Timer("team countdown",TeamFbModule.COUNT_DOWN * 1000, 1, delegate(this, this._onCountDown));
                            } else {
                                this.countDownTimer.ResetTimer(TeamFbModule.COUNT_DOWN * 1000, 1, delegate(this, this._onCountDown));
                            }
                        }
                        // 开始5秒倒计时
                        this.m_countDownID = G.ViewCacher.mainUIEffectView.playCountDown(TeamFbModule.COUNT_DOWN);
                        // 开始转圈圈
                        //this.dispatchEvent(Events.ShowOrHideLoading, true, SceneLoading.IMG_KF, SceneLoading.RULE_KF, 5000);

                        // 关闭所有对话框
                        G.Uimgr.closeAllForKuaFu();
                        // 冻结所有功能
                        G.DataMgr.runtime.isAllFuncLocked = true;
                    }
                }
                else if (Macros.CROSS_SYN_ROLE == response.m_usType) {
                    // 同步需要跨服的玩家数据
                    G.DataMgr.sxtData.waitSyncRole = false;
                }
                else if (Macros.CROSS_GET_RMB_GETINFO == response.m_usType) {
                    //G.DataMgr.rmbData.exhcangeInfo = uts.deepcopy(response.m_stValue.m_stCSRMBGetInfoRes, G.DataMgr.rmbData.exhcangeInfo, true);
                    //this.dispatchEvent(Events.updateRmbExhcangeInfo);
                }

                else if (Macros.CROSS_RECRUIT_TEAM == response.m_usType) {
                    let info = response.m_stValue.m_stCSCrossRecruitTeamRes;
                    if (!G.DataMgr.sxtData.myTeam && !G.DataMgr.runtime.inviteNotTip && G.DataMgr.sceneData.curPinstanceID == 0) {
                        G.Uimgr.createForm<InvitingConfirmView>(InvitingConfirmView).open(info)
                    }
                  
                }
            }
        }
    }

    private _onCountDown(timer: Game.Timer) {
        if (G.DataMgr.sxtData.waitSyncRole || !G.DataMgr.heroData.isAlive) {
            // 取消转圈
            G.ModuleMgr.loadingModule.setActive(false);
            return;
        }

        let captain: Protocol.Cross_OneTeamMem = G.DataMgr.sxtData.captain;
        if (captain.m_szDomain == G.DataMgr.gameParas.domain && captain.m_szIP == G.DataMgr.gameParas.serverIp && captain.m_uiPort == G.DataMgr.gameParas.serverPort) {
            // 跟队长在同一个服，直接进副本
            G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_CROSS_PIN, captain.m_stRoleID.m_uiUin, captain.m_stRoleID.m_uiSeq);
        }
        else {
            // 与队长不在同一个服，需要切线，开始切线
            G.DataMgr.systemData.setLoginEnterParam(Macros.LOGINOUT_REAZON_CROSSPIN, KeyWord.NAVIGATION_CROSS_PIN, captain.m_stRoleID.m_uiUin, captain.m_stRoleID.m_uiSeq);
            G.ModuleMgr.loginModule.crossServer(captain.m_usWorldID, captain.m_szDomain, captain.m_szIP, captain.m_uiPort);
        }
    }

    private _checkMyTeam(): void {
        let sxtData = G.DataMgr.sxtData;
        let myTeam: Protocol.Cross_OneTeam = sxtData.myTeam;
        if (null != myTeam && sxtData.amICaptain()) {
            if (null == this.teamTickTimer) {
                this.teamTickTimer = new Game.Timer(this.TeamTickKey, 1000, 0, this.onTick);
            }
        }
        else {
            if (null != this.teamTickTimer) {
                this.teamTickTimer.Stop();
                this.teamTickTimer = null;
            }
        }
    }

    joinSxtTeam(pinstanceID: number, info: Protocol.Cross_SimpleOneTeam): void {
        if (!this.checkBeforeMakeTeam(pinstanceID)) {
            return;
        }
        // 判断是否可加入
        let config: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(pinstanceID);
        if (config.m_ucPlayerHigh <= info.m_ucTeamMemNum) {
            // 人数超限
            G.TipMgr.addMainFloatTip('队伍人数已满。');
            return;
        }

        if (info.m_uiFight > G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT)) {
            // 战斗力不达标
            G.TipMgr.addMainFloatTip('您的战斗力不符合队伍要求。');
            return;
        }

        // 检查是否需要密码
        if (null != info.m_szPassword && '' != info.m_szPassword) {
            // 弹出验证密码
            uts.assert(false, '没有密码啦~');
            return;
        }

        // 加入队伍前必须先退出真队伍
        G.ActionHandler.leaveTeam();

        // 加入队伍
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossJoinTeamRequest(pinstanceID, info.m_uiTeamID, G.DataMgr.gameParas.domain, G.DataMgr.gameParas.serverIp, G.DataMgr.gameParas.serverPort));

        let isTeamDungeon: boolean = PinstanceIDUtil.ZuDuiFuBenIDs.indexOf(pinstanceID) != -1;
        if (isTeamDungeon) {
            G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(KeyWord.OTHER_FUNCTION_ZDFB);
        }
    }

    checkBeforeMakeTeam(pinstanceID: number): boolean {
        // 加入队伍前先检查是否在副本中
        if (G.DataMgr.sceneData.curPinstanceID > 0) {
            G.TipMgr.addMainFloatTip('您当前正在副本中，请先离开副本。');
            return false;
        }

        let config: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(pinstanceID);
        // 检查副本等级
        if (config.m_iLevelLow > G.DataMgr.heroData.level) {
            G.TipMgr.addMainFloatTip('您的等级不符合副本要求。');
            return false;
        }

        // 检查副本次数
        if (!PinstanceIDUtil.isZuDuiFuBen(pinstanceID)&&config.m_ucEnterTimes > 0 && G.DataMgr.systemData.getPinstanceLeftTimes(config) <= 0) {
            G.TipMgr.addMainFloatTip('您今天的次数已用完，请明天再来挑战。');
            return false;
        }

        return G.ActionHandler.checkMatchingStatus(true);
    }

    private onTick(timer: Game.Timer) {
        let sxtData = G.DataMgr.sxtData;
        let myTeam: Protocol.Cross_OneTeam = sxtData.myTeam;
        if (null != myTeam) {
            // 检查是否满员
            if (1 == myTeam.m_ucAutoStart && sxtData.amICaptain()) {
                let pinstanceConfig: GameConfig.PinstanceConfigM = PinstanceData.getConfigByID(myTeam.m_uiPinstanceID);
                if (myTeam.m_ucTeamMemNum >= pinstanceConfig.m_ucPlayerHigh) {
                    let isAllReady = true;
                    // 第一位是队长，不需要看是否准备好
                    for (let i: number = 1; i < myTeam.m_ucTeamMemNum; i++) {
                        let memInfo = myTeam.m_astTeamInfo[i];
                        if (0 == memInfo.m_ucIsReady) {
                            isAllReady = false;
                            break;
                        }
                    }

                    if (isAllReady) {
                        // 全部准备好了，自动开始
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossStartPinRequest(myTeam.m_uiPinstanceID, myTeam.m_uiTeamID));
                    }
                }
            }
        }
    }
}
