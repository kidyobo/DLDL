﻿import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ErrorId } from 'System/protocol/ErrorId'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { KfData } from 'System/data/KfData'
import { Constants } from 'System/constants/Constants'
import { ActHomeView } from 'System/activity/actHome/ActHomeView'
import { ZhenLongQiJuPanel } from 'System/activity/actHome/ZhenLongQiJuPanel'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { ZhenLongQiJuData } from 'System/data/activities/ZhenLongQiJuData'

/**
 * 跨服活动模块。
 *
 * 本文件代码由模板生成，你可能需要继续修改其他代码文件（比如EnumModuleName）才能正常使用。
 * Code generated by Bat&Perl.
 *
 * @author teppei
 *
 */
export class KfModule extends EventDispatcher {
    private readonly TimerKey = '1';

    /**倒计时特效ID。*/
    private m_countDownID: number = 0;

    /**倒计时*/
    private tickTimer: Game.Timer;

    private m_needEnterKf = false;


    constructor() {
        super();
        this.addNetListener(Macros.MsgID_CROSS_CS_Response, this._onCrossCsResponse); //显示或关闭对话框
    }

    ///////////////////////////////////////// 事件管理 /////////////////////////////////////////

    tryJoinKfAct(actID: number, para2: number = 0, timeExtraParam: number = 0): void {
        // 跨服组队排队中不能进入其他副本
        if (!G.Mapmgr.canSpecialTransport(KeyWord.NAVIGATION_CROSS_ACT)) {
            return;
        }

        if (actID != Macros.ACTIVITY_ID_WORLDBOSS) {
            let actConfig: GameConfig.ActivityConfigM = G.DataMgr.activityData.getActivityConfig(actID);
            // 如果活动需要进入副本的话进行检验
            if (actConfig.m_aiEnterInstanceID.length > 0 && !G.ActionHandler.canEnterPinstance(actConfig.m_aiEnterInstanceID[0], 0, true, true)) {
                return;
            }
        }

        G.DataMgr.kfData.saveParas(actID, para2);

        // 开始5秒倒计时
        //this.m_countDownID = m_manager.mainEffectCtrl.showTimerEffect(KfData.COUNT_DOWN);
        // 开始转圈圈
        G.ModuleMgr.loadingModule.setActive(true);
        // 关闭所有对话框
        G.Uimgr.closeAllForKuaFu();
        // 冻结所有功能
        G.DataMgr.runtime.isAllFuncLocked = true;

        // 需要跨服
        this.m_needEnterKf = true;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSynRoleCsRequest(actID, para2));

        // 加一个8s等CROSS_SYN_ROLE_CS超时
        if (null == this.tickTimer) {
            this.tickTimer = new Game.Timer(this.TimerKey, 8000, 1, delegate(this, this.onSyncRoleCsTimer));
        } else {
            this.tickTimer.ResetTimer(8000, 1, delegate(this, this.onSyncRoleCsTimer));
        }
    }

    private _onCrossCsResponse(response: Protocol.Cross_CS_Response): void {
        if (Macros.CROSS_SYN_ROLE_CS == response.m_usType
            || (Macros.CROSS_SYN_ROLE == response.m_usType && KeyWord.NAVIGATION_CROSS_ACT == response.m_stValue.m_stCSCrossSynRoleRes.m_ucSynType)
            || Macros.CROSS_RMBZC_START == response.m_usType
            || Macros.CROSS_WHJX_PANNLE == response.m_usType
            || Macros.CROSS_WHJX_BUY == response.m_usType
            || Macros.CROSS_WHJX_APPLY_PK == response.m_usType
            || Macros.CROSS_WHJX_APPLY_NTF == response.m_usType
            || Macros.CROSS_WHJX_APPLY_DEAL == response.m_usType
            || Macros.CROSS_WHJX_CDCLEAN == response.m_usType
            || Macros.CROSS_ZLQJ_PANNEL == response.m_usType
            || Macros.CROSS_ZLQJ_SIGNUP == response.m_usType
            || Macros.CROSS_ZLQJ_START == response.m_usType) {
            if (ErrorId.EQEC_Success != response.m_iResultID) {
                if (ErrorId.EQEC_CROSSPIN_CACHEISFULL == response.m_iResultID) {
                    // 服务器刚起来的时候立马跨服会收到无数次Sync Role，这是后台的bug，但跨服向来都是后台的弱项，我就不为难他们了，这里不显示这个傻逼错误码哈哈
                    G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResultID));
                }
                
                this.quitJoinKfAct();
            }
            else {
                if (Macros.CROSS_SYN_ROLE_CS == response.m_usType) {
                    // 收到请求数据回复后开始倒计时
                    let linkInfo: Protocol.LinkWorldInfo = response.m_stValue.m_stCSSynRoleCSRes.m_stLinkInfo;
                    uts.log('[CROSS RESP]SYN ROLE CS - ' + linkInfo.m_szDomain + '|' + linkInfo.m_szIP + ':' + linkInfo.m_uiPort + ',' + linkInfo.m_uiWorldID);
                    // 同步连服数据
                    G.DataMgr.systemData.linkInfo = linkInfo;
                    if (null == this.tickTimer) {
                        this.tickTimer = new Game.Timer(this.TimerKey, Constants.KuaFuCountDown * 1000, 1, delegate(this, this.onCountDownTimer));
                    } else {
                        this.tickTimer.ResetTimer(Constants.KuaFuCountDown * 1000, 1, delegate(this, this.onCountDownTimer));
                    }

                    if (G.DataMgr.kfData.actID == Macros.ACTIVITY_ID_WORLDBOSS) {
                        uts.log(" 进入跨服   ");
                        this._doEnterKf();
                    }

                }
                else if (Macros.CROSS_SYN_ROLE == response.m_usType) {
                    // 同步需要跨服的玩家数据
                    uts.log('[CROSS RESP]SYN ROLE');
                    G.DataMgr.kfData.waitSyncRole = false;
                    this._doEnterKf();
                }
                else if (Macros.CROSS_RMBZC_START == response.m_usType) {
                    // 跨服RMB战场开始
                    this.tryJoinKfAct(Macros.ACTIVITY_ID_RMBZC, 0, 0);
                }
                else if (Macros.CROSS_WHJX_PANNLE == response.m_usType) {
                    let resp = response.m_stValue.m_stWHJXPannelRsp;
                    let whjxData = G.DataMgr.activityData.whjxData;
                    whjxData.panelInfo = resp;
                    whjxData.panelUpdateAt = UnityEngine.Time.realtimeSinceStartup;

                    //uts.log('CROSS_WHJX_PANNLE: ' + JSON.stringify(resp));
                    let view = G.Uimgr.getForm<ActHomeView>(ActHomeView);
                    if (null != view) {
                        view.onWangHouJiangXiangResp(response);
                    }
                }
                else if (Macros.CROSS_WHJX_BUY == response.m_usType) {
                    let resp = response.m_stValue.m_stWHJXBuyRsp;
                    //uts.log('CROSS_WHJX_BUY: ' + JSON.stringify(resp));
                    G.DataMgr.activityData.whjxData.updateBuyInfo(resp);
                    let view = G.Uimgr.getForm<ActHomeView>(ActHomeView);
                    if (null != view) {
                        view.onWangHouJiangXiangResp(response);
                    }
                }
                else if (Macros.CROSS_WHJX_APPLY_PK == response.m_usType) {
                    let resp = response.m_stValue.m_stWHJXApplyPKRsp;
                    //uts.log('CROSS_WHJX_APPLY_PK: ' + JSON.stringify(resp));
                    if (Macros.WHJX_APPLY_RESULT_NONE == resp.m_iResult) {
                        // 对方接受挑战
                        this.tryJoinKfAct(Macros.ACTIVITY_ID_WHJX, resp.m_iTypeID);
                        G.TipMgr.addMainFloatTip('对方接受挑战，即将开始对决...');
                    } else if (Macros.WHJX_APPLY_RESULT_WIN == resp.m_iResult) {
                        // 直接占领，重新拉取面板信息
                        G.TipMgr.addMainFloatTip('恭喜您成功占领' + KeyWord.getDesc(KeyWord.GROUP_WHJX_TYPE, resp.m_iTypeID));
                    } else if (Macros.WHJX_APPLY_RESULT_WAITING == resp.m_iResult) {
                        // 其他玩家正在挑战
                        G.TipMgr.addMainFloatTip('其他玩家正在挑战，请稍候...');
                    } else if (Macros.WHJX_APPLY_RESULT_ACTEND == resp.m_iResult) {
                        // 活动已结束
                        G.TipMgr.addMainFloatTip('活动已结束');
                    } else if (Macros.WHJX_APPLY_RESULT_APPLYAGAIN == resp.m_iResult) {
                        // 重复申请
                        G.TipMgr.addMainFloatTip('请勿重复申请！');
                    }
                    let view = G.Uimgr.getForm<ActHomeView>(ActHomeView);
                    if (null != view) {
                        view.onWangHouJiangXiangResp(response);
                    }
                }
                else if (Macros.CROSS_WHJX_APPLY_NTF == response.m_usType) {
                    let ntf = response.m_stValue.m_stWHJXApplyNtfRsp;
                    //uts.log('CROSS_WHJX_APPLY_NTF: ' + JSON.stringify(ntf));
                    G.TipMgr.showConfirm(uts.format('{0}向您发起了挑战，是否迎战？', ntf.m_szName) + TextFieldUtil.getColorText('(拒绝迎战将直接丢失宝座)', Color.RED),
                        ConfirmCheck.noCheck, '迎战|谦让', delegate(this, this.onWhjxConfirm, ntf.m_iTypeID), Macros.WHJX_MAX_APPLY_WAIT_TIME, 1);
                }
                else if (Macros.CROSS_WHJX_APPLY_DEAL == response.m_usType) {
                    let resp = response.m_stValue.m_stHWJXApplyDealRsp;
                    //uts.log('CROSS_WHJX_APPLY_DEAL: ' + JSON.stringify(resp));
                    if (1 == resp.m_iOpVal && resp.m_iTypeID > 0) {
                        this.tryJoinKfAct(Macros.ACTIVITY_ID_WHJX, resp.m_iTypeID);
                    }
                    let view = G.Uimgr.getForm<ActHomeView>(ActHomeView);
                    if (null != view) {
                        view.onWangHouJiangXiangResp(response);
                    }
                }
                else if (Macros.CROSS_WHJX_CDCLEAN == response.m_usType) {
                    let resp = response.m_stValue.m_stWHJXCDCleanRsp;
                    //uts.log('CROSS_WHJX_CDCLEAN: ' + JSON.stringify(resp));
                    G.DataMgr.activityData.whjxData.updateCleanCd(resp);
                    let view = G.Uimgr.getForm<ActHomeView>(ActHomeView);
                    if (null != view) {
                        view.onWangHouJiangXiangResp(response);
                    }
                }
                else if (Macros.CROSS_ZLQJ_PANNEL == response.m_usType) {
                    // 西洋棋拉取面板
                    let resp = response.m_stValue.m_stZLQJPannelRsp;
                    uts.log('CROSS_ZLQJ_PANNEL: ' + JSON.stringify(resp));
                    G.DataMgr.activityData.zlqjData.panelResp = resp;
                    let panel = G.Uimgr.getSubFormByID<ZhenLongQiJuPanel>(ActHomeView, KeyWord.OTHER_FUNCTION_ZLQJ);
                    if (null != panel) {
                        panel.onPanelResp();
                    }
                }
                else if (Macros.CROSS_ZLQJ_SIGNUP == response.m_usType) {
                    // 西洋棋排队，点按钮收到一次，超时没有组队成功会收到一次
                    let resp = response.m_stValue.m_stZLQJSignupRsp;
                    uts.log('CROSS_ZLQJ_SIGNUP: ' + JSON.stringify(resp));
                    let zlqjData = G.DataMgr.activityData.zlqjData;
                    zlqjData.panelResp = resp;
                    zlqjData.countDownTime = ZhenLongQiJuData.CountDownSeconds;
                    let panel = G.Uimgr.getSubFormByID<ZhenLongQiJuPanel>(ActHomeView, KeyWord.OTHER_FUNCTION_ZLQJ);
                    if (null != panel) {
                        panel.onPanelResp();
                    }
                    if (0 == resp.m_iStatus) {
                        G.TipMgr.addMainFloatTip('匹配失败，请稍后再试！');
                    }
                }
                else if (Macros.CROSS_ZLQJ_START == response.m_usType) {
                    // 西洋棋开始
                    let resp = response.m_stValue.m_iZLQJStartRsp;
                    uts.log('CROSS_ZLQJ_START: ' + resp);
                    G.DataMgr.activityData.zlqjData.groupId = resp;
                    this.tryJoinKfAct(Macros.ACTIVITY_ID_ZLQJ, resp);
                }

                G.ActBtnCtrl.update(false);
            }
        }
    }

    private onWhjxConfirm(state: MessageBoxConst, isCheckSelected: boolean, type: number): void {
        if (MessageBoxConst.yes == state) {
            // 迎战
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWangHouJiangXiangRequest(Macros.CROSS_WHJX_APPLY_DEAL, 1, type));
        } else {
            // 认输二次确认
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWangHouJiangXiangRequest(Macros.CROSS_WHJX_APPLY_DEAL, 0, type));
        }
    }

    private onSyncRoleCsTimer(timer: Game.Timer) {
        // 超时没有收到回复，认定跨服失败
        this.quitJoinKfAct();
        G.TipMgr.addMainFloatTip('跨服失败，请稍候再试。');
    }

    private onCountDownTimer(timer: Game.Timer) {
        this.tickTimer = null;
        this._doEnterKf();
    }

    private _doEnterKf(): void {
        if (!this.m_needEnterKf) {
            return;
        }
        this.m_needEnterKf = false;
        let kfData: KfData = G.DataMgr.kfData;

        if (kfData.waitSyncRole || !G.DataMgr.heroData.isAlive) {
            // 取消转圈
            this.quitJoinKfAct();
            return;
        }

        if (kfData.actID != Macros.ACTIVITY_ID_WORLDBOSS) {
            // 如果活动需要进副本则进行检验
            let actConfig: GameConfig.ActivityConfigM = G.DataMgr.activityData.getActivityConfig(kfData.actID);
            if (actConfig.m_aiEnterInstanceID.length > 0 && !G.ActionHandler.canEnterPinstance(actConfig.m_aiEnterInstanceID[0], 0, true, true)) {
                // 取消转圈
                this.quitJoinKfAct();
                return;
            }
        }

        uts.log('request cross svr!');
        // 检查是否需要跨服
        if (G.DataMgr.systemData.linkInfo.m_uiWorldID != G.DataMgr.gameParas.worldID) {
            G.DataMgr.systemData.setLoginEnterParam(Macros.LOGINOUT_REAZON_CROSSPIN, KeyWord.NAVIGATION_CROSS_ACT, kfData.actID, kfData.para2);
            let linkInfo: Protocol.LinkWorldInfo = G.DataMgr.systemData.linkInfo;
            G.ModuleMgr.loginModule.crossServer(linkInfo.m_uiWorldID, linkInfo.m_szDomain, linkInfo.m_szIP, linkInfo.m_uiPort);
        }
        else {
            // 直接前往
            uts.log(" 直接前往   kfData.actID "+kfData.actID + "    kfData.para2 " + kfData.para2);
            G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_CROSS_ACT, kfData.actID, kfData.para2);
        }
    }

    quitJoinKfAct(): void {
        this.clearCrossState();
        G.ModuleMgr.loginModule.cancelCross();
    }

    onCrossFailed() {
        this.clearCrossState();
    }

    private clearCrossState() {
        this.m_needEnterKf = false;
        // 清除倒计时
        if (null != this.tickTimer) {
            this.tickTimer.Stop();
            this.tickTimer = null;
        }
    }
}
