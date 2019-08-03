/**
 * 斗罗
 */
import { Global as G } from 'System/global'
import { Msg, ReportType, ResultType } from 'System/channel/ChannelDef'
import { JavaCaller } from 'System/utils/JavaCaller'
import { ChannelHandler } from 'System/channel/handlers/ChannelHandler'

export class DouluoPlatHandler extends ChannelHandler {
    private baseurl: string = 'http://dl.yxg.fygame.com/dldl/';
    protected initIosSDK() {
    }

    protected onIosLoginSucess(str: string) {
    }

    protected baseUrlInfo(fromIp: boolean): { baseurl: string, channelTag: string } {
        return { baseurl: this.baseurl, channelTag: 'dl_' };
    }

    protected onLoginSuccess(msg: Msg) {
        this.user.username = msg.userid;
        this.user.token = msg.token;
        this.user.channelId = this.ChannelID;
    }

    get ChannelID(): string {
        return JavaCaller.callRetString('getChannelId');
    }

    protected payOrder(orderjson: any, cfg: GameConfig.ChargeGiftConfigM, coin: number) {
        let roleLevel = G.DataMgr.heroData.level == null ? 0 : G.DataMgr.heroData.level;
        let params = {
            orderId: orderjson.orderid
            , serverId: G.DataMgr.gameParas.serverID.toString()
            , price: coin.toString()
            , productId: cfg.m_iProductID.toString()
            , productName: cfg.m_szProductName.toString()
            , productDesc: cfg.m_szProductDesc.toString()
            , productNumber: '1'
            , roleLevel: roleLevel.toString()
            , roleName: G.DataMgr.heroData.name
            , roleId: G.DataMgr.gameParas.uin.toString()
            , serverName: G.DataMgr.gameParas.serverName
            , extension: ''
            , vip: G.DataMgr.heroData.curVipLevel.toString()
        };
        uts.log('payOrder:' + JSON.stringify(params));
        JavaCaller.callRetInt('doPay', JSON.stringify(params));
    }

    protected reportData(type: ReportType) {
        let needtype = type == ReportType.LOGIN || type == ReportType.CREATEROLE || type == ReportType.LEVELUP || type == ReportType.EXITGAME || type == ReportType.Memory;
        if (!needtype)
            return;

        let roleLevel = G.DataMgr.heroData.level == null ? 0 : G.DataMgr.heroData.level;

        let roleLevelIMTime = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        if (type == ReportType.CREATEROLE) roleLevelIMTime = G.DataMgr.heroData.createTime;
        else if (type == ReportType.LEVELUP) roleLevelIMTime = G.DataMgr.runtime.levelUpLastTime;

        let params = {
            dataType: type
            , serverId: G.DataMgr.gameParas.serverID.toString()
            , serverName: G.DataMgr.gameParas.serverName
            , roleId: G.DataMgr.gameParas.uin.toString()
            , roleName: G.DataMgr.heroData.name
            , roleLevel: roleLevel.toString()
            , roleCTime: G.DataMgr.heroData.createTime.toString()
            , roleLevelIMTime: roleLevelIMTime.toString()
            , vip: G.DataMgr.heroData.curVipLevel.toString()
        };

        uts.log("report:" + JSON.stringify(params));
        JavaCaller.callRetInt('dataReport', JSON.stringify(params));
    }

    get canHideLoginButton(): boolean {
        return false;
    }

    protected onExit(msg: Msg) {
        if (msg.result == ResultType.OK) {
            UnityEngine.Application.Quit();
        }
    }

    quit() {
        if (JavaCaller.callRetBoolean('isShowExitDialog')) {
            JavaCaller.callRetInt('exit');
        }
        else {
            super.quit();
        }
    }

    protected confirmQuitApp() {
        JavaCaller.callRetInt('exit');
        UnityEngine.Application.Quit();
    }

    start() {
        JavaCaller.callRetInt('startGame');
    }

    destory() {
        JavaCaller.callRetInt('destoryGame');
    }
}