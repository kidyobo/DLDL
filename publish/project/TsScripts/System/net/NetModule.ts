import { Global as G } from 'System/global'
import { GameParas } from 'System/data/GameParas'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { NetHandler, EnumNetId } from 'System/protocol/NetHandler'
import { Macros } from 'System/protocol/Macros'
import { Events } from 'System/Events'
import { EventDispatcher } from 'System/EventDispatcher'
import { EnumLoginStatus, EnumCrossErrorCode, EnumNetError } from 'System/constants/GameEnum'
import { ErrorId } from 'System/protocol/ErrorId'
import { Constants } from 'System/constants/Constants'
import { ConfirmCheck } from 'System/tip/TipManager'
import { MessageBoxConst } from 'System/tip/TipManager'
import { LoginTip } from 'System/login/view/LoginTip'
import { LoginView } from 'System/login/view/LoginView'
import { WaitingView } from 'System/uilib/WaitingView'
import { LuckyWheelView } from 'System/activity/view/LuckyWheelView'

/**
 * 网络模块，处理登录、收发包等。
 */
export class NetModule extends EventDispatcher {
    /**用于本服通信。*/
    private netHandler1: NetHandler;

    private syncTimer: Game.Timer;
    private reconnectTimer: Game.Timer;

    private readonly ConnectDelay = 'ConnectDelay';

    constructor() {
        super();
        this.netHandler1 = new NetHandler();
        this.netHandler1.onConnectCallback = delegate(this, this.onNetConnected1);
        this.netHandler1.onDisconnectCallback = delegate(this, this.onNetDisconnected);
        this.addNetListener(Macros.MsgID_SyncTime_Response, this._onSyncTimeResponse);
    }

    connect(delay: number): void {
        //G.Uimgr.createForm<LoginTip>(LoginTip).open('正在连接服务器，请稍候...', false);
        if (delay > 0) {
            Game.Invoker.BeginInvoke(G.Root, this.ConnectDelay, delay, delegate(this, this.doConnect));
        } else {
            this.doConnect();
        }
    }

    private doConnect() {
        Game.Invoker.EndInvoke(G.Root, this.ConnectDelay);
        G.DataMgr.systemData.setLoginEnterParam(Macros.LOGINOUT_REAZON_NORMAL, 0, 0, 0);
        this.netHandler1.connect(G.DataMgr.gameParas.serverIp, G.DataMgr.gameParas.serverPort, EnumNetId.base);
    }

    closeConnect() {
        this.netHandler1.close();
    }

    private onNetConnected1(isSuccess: boolean): void {
        this.stopReconnectTimer();
        let netId = this.netHandler1.NetId;

        uts.log(uts.format('NetModule::onNetHandlerConnected1, isSuccess = {0}, netId = {1}', isSuccess, netId));
        if (EnumNetId.base == netId) {
            // 这是连接本服
            if (isSuccess) {
                // 重连板子修改文字
                let waitingView = G.Uimgr.getForm<WaitingView>(WaitingView);
                if (null != waitingView) {
                    waitingView.setInfo('请稍候...', 0);
                }
                let gameParas: GameParas = G.DataMgr.gameParas;
                //这里区分是不是windows平台，如果是windows平台，采用二维码登录，response不会立即返回
                if (gameParas.zxingPCLogin) {
                    // 拉取二维码信息
                    uts.log(uts.format('拉取二维码, serverID = {1}, platformType = {2}, clientType = {3}',
                        99999, gameParas.serverID, gameParas.platformType, 9, gameParas.isAdult,
                        gameParas.platTime, gameParas.username, gameParas.sign, G.ChannelSDK.ChannelID));
                    let cmd = ProtocolUtil.getListRole(gameParas.serverID, 99999,
                        gameParas.platformType, 9, gameParas.isAdult,
                        gameParas.platTime, gameParas.serverID, gameParas.username, gameParas.sign, G.ChannelSDK.ChannelID);
                    this.sendMsg(cmd);
                }
                else if (gameParas.zxingMobileLogin) {
                    uts.log(uts.format('扫码登陆，uin = {0}, serverID = {1}, platformType = {2}, clientType = {3}, isAdult = {4}, platTime = {5}, username={6}, sign = {7}, ChannelID = {8}',
                        gameParas.uin, gameParas.serverID, gameParas.platformType, 8, gameParas.isAdult,
                        gameParas.platTime, gameParas.username, gameParas.sign, G.ChannelSDK.ChannelID));
                    let cmd = ProtocolUtil.getListRole(gameParas.serverID, gameParas.uin,
                        gameParas.platformType, 8, gameParas.isAdult,
                        gameParas.platTime, gameParas.serverID, gameParas.username, gameParas.sign, G.ChannelSDK.ChannelID, gameParas.zxingToken, gameParas.zxingSession);
                    this.sendMsg(cmd);
                }
                else {
                    //gameParas.uin = 101146;
                    //gameParas.serverID = 3;
                    //gameParas.platformType = 21100;
                    //gameParas.clientType = 1;
                    //gameParas.isAdult = 0;
                    //gameParas.platTime = 1502792852;
                    //gameParas.username = '280111';
                    //gameParas.sign = 'c1eb1a0f44a29bffe50fd7d4cef41743';
                    // 拉取角色列表
                    let channelID = G.ChannelSDK.ChannelID;
                    uts.log(uts.format('拉取角色列表，uin = {0}, serverID = {1}, platformType = {2}, clientType = {3}, isAdult = {4}, platTime = {5}, username={6}, sign = {7}, ChannelID = {8}',
                        gameParas.uin, gameParas.serverID, gameParas.platformType, gameParas.clientType, gameParas.isAdult,
                        gameParas.platTime, gameParas.username, gameParas.sign, channelID));
                    let cmd = ProtocolUtil.getListRole(gameParas.serverID, gameParas.uin,
                        gameParas.platformType, gameParas.clientType, gameParas.isAdult,
                        gameParas.platTime, gameParas.serverID, gameParas.username, gameParas.sign, channelID);
                    this.sendMsg(cmd);
                }
            } else {
                this.showConnectFail(G.DataMgr.runtime.loginStatus, EnumNetError.connectError);
                let loginView = G.Uimgr.getForm<LoginView>(LoginView);
                if (loginView != null && loginView.isOpened) loginView.showLoginButton();
            }
        } else {
            // 这是跨服
            if (isSuccess) {
                G.ModuleMgr.loginModule.afterRoleReady();
            } else {
                // 跨服连接失败
                uts.log('cross net connect failed.');
                G.ModuleMgr.loginModule.onCrossFailed(null, EnumCrossErrorCode.tcpFailed);
            }
        }
    }

    private onNetDisconnected(): void {
        let oldLoginStatus = G.DataMgr.runtime.loginStatus;
        uts.log('onNetDisconnected, oldLoginStatus = ' + oldLoginStatus);
        G.DataMgr.runtime.loginStatus = EnumLoginStatus.disconnected;
        // 网络断开，停止心跳包
        this.stopReconnectTimer();
        this.showConnectFail(oldLoginStatus, EnumNetError.disconnected);

        let view = G.Uimgr.getForm<LuckyWheelView>(LuckyWheelView);
        if (view != null) {
            view.stopAnimIfPlaying();
        }
    }

    private showConnectFail(oldLoginStatus: EnumLoginStatus, netError: EnumNetError) {
        let loginView = G.Uimgr.getForm<LoginView>(LoginView);
        if (loginView != null) {
            // 登录界面中连接失败，此时仅显示提示框，让他自己点登录游戏
            loginView.setLoginBtnEnabled(true);
            G.Uimgr.createForm<LoginTip>(LoginTip).open(uts.format('连接已断开，请重新登录!({0})', netError), true, null);
        } else if (EnumLoginStatus.kickedOut == oldLoginStatus) {
            G.Uimgr.createForm<LoginTip>(LoginTip).open(uts.format('连接已断开，请重新登录!({0})', EnumNetError.kickOut), true, delegate(this, this.onReconnectFail));
        } else {
            // 显示自动重连
            if (G.DataMgr.runtime.everEnterScene) {
                // 曾经成功进入过场景就自动重连
                if (EnumLoginStatus.logined == oldLoginStatus) {
                    if (null == G.Uimgr.getForm<WaitingView>(WaitingView)) {
                        G.Uimgr.createForm<WaitingView>(WaitingView).open('尝试重连中({0})...', 30, delegate(this, this.onTryAutoConnectTimeout));
                    }
                    // 清理场景
                    G.UnitMgr.clearSceneElements();
                    // 自动重连
                    this.netHandler1.reConnect();
                } else {
                    // 说明已经在断线重连中了，然后连不上，3s后再试
                    if (null == this.reconnectTimer) {
                        this.reconnectTimer = new Game.Timer("reconnect", 3000, 1, delegate(this, this.onReconnectTimer));
                    }
                }
            } else {
                this.onTryAutoConnectTimeout();
            }
        }
    }

    tryReconnectWhenBack() {
        // 曾经成功进入过场景就自动重连
        if (EnumLoginStatus.logined == G.DataMgr.runtime.loginStatus) {
            if (null == G.Uimgr.getForm<WaitingView>(WaitingView)) {
                G.Uimgr.createForm<WaitingView>(WaitingView).open('尝试重连中({0})...', 30, delegate(this, this.onTryAutoConnectTimeout));
            }
            // 清理场景
            G.UnitMgr.clearSceneElements();
            // 自动重连
            this.netHandler1.reConnect();
        }
    }

    private onReconnectTimer(timer: Game.Timer) {
        this.reconnectTimer = null;
        // 自动重连
        this.netHandler1.reConnect();
    }

    private onReconnectFail(value: boolean) {
        if (value) {
            G.reloadGame(false);
        }
        else {
            UnityEngine.Application.Quit();
        }
    }
    private onTryAutoConnectTimeout() {
        this.stopReconnectTimer();
        G.Uimgr.createForm<LoginTip>(LoginTip).open(uts.format('连接已断开，请重新登录!({0})', EnumNetError.autoReconnectError), true, delegate(this, this.onReconnectFail));
    }

    private stopReconnectTimer() {
        if (null != this.reconnectTimer) {
            this.reconnectTimer.Stop();
            this.reconnectTimer = null;
        }
    }

    ///////////////////////////////////////////////// 跨服 /////////////////////////////////////////////////

    /**
     * 建立跨服连接
     */
    connectCross() {
        // 先断开原服连接
        let crossParas = G.DataMgr.crossParas;
        //this.sendMsg(ProtocolUtil.getLogout(crossParas.worldId));
        this.stopReconnectTimer();
        // 再连接跨服
        this.netHandler1.connect(crossParas.serverIp, crossParas.serverPort, EnumNetId.cross);
    }

    /////////////////////////////////////////////// 消息处理 ///////////////////////////////////////////////

    sendMsg(msg: Protocol.FyMsg): void {
        let msgId = msg.m_stMsgHead.m_uiMsgID;
        let runtime = G.DataMgr.runtime;
        if (runtime.loginStatus != EnumLoginStatus.logined && Macros.MsgID_Account_ListRole_Request != msgId && Macros.MsgID_Account_CreateRole_Request != msgId && Macros.MsgID_LoginServer_Request != msgId) {
            return;
        }

        this.netHandler1.send(msg);
        if (Macros.MsgID_SyncTime_Request != msgId && Macros.MsgID_SyncTime_Client_Request != msgId) {
            runtime.lastActiveAt = UnityEngine.Time.realtimeSinceStartup;
        }
    }

    broadcastFakeMsg(msgid: number, body) {
        this.netHandler1.dispatchData(msgid, body);
    }

    /**
	*接收同步时间响应  
	* @param msg
	* 
	*/
    private _onSyncTimeResponse(body: Protocol.SyncTime_Response): void {
        //if (null == G.DataMgr.loginResponse) {
        //    // 登录前不进行后续处理
        //    return;
        //}
        if (body.m_ushResultID == ErrorId.EQEC_Success) {
            // 更新聊天验证码
            G.DataMgr.runtime.chatCheckCrc = body.m_ucCheck;
            let isOverDay = G.SyncTime.setServerTime(body.m_uiServerTime_high, body.m_uiServerTime_low);
            //再次把服务器时间发过去
            this.sendMsg(ProtocolUtil.getSecondClientSyncTimeRequest(body.m_uiServerTime_low, body.m_uiServerTime_high));
            if (isOverDay) {
                this.dispatchEvent(Events.ServerOverDay);
            }
        }
        else {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(body.m_ushResultID));
        }
    }

    startSyncTime(): void {
        this._trySendSyncTimeRequest();
        // 开始进入心跳包计时，2s同步一次时间
        if (null == this.syncTimer) {
            this.syncTimer = new Game.Timer("syncTimer", Constants.HEART_INTERVALTIME, 0, delegate(this, this.onTimer));
        }
    }

    private onTimer(timer: Game.Timer) {
        if (G.DataMgr.runtime.loginStatus == EnumLoginStatus.logined) {
            this._trySendSyncTimeRequest();
        }
    }

    /**
     * 尝试发送同步时间请求
     * 
     */
    private _trySendSyncTimeRequest(): void {
        this.sendMsg(ProtocolUtil.getSyncTimeRequest());
    }

    get NetDelay(): number {
        return this.netHandler1.NetDelay;
    }

    get NetId(): EnumNetId {
        return this.netHandler1.NetId;
    }
    get MessageHead() {
        return this.netHandler1.head;
    }
}