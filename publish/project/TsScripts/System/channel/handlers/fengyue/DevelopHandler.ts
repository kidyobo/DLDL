/**
 * 开发版本  plat:999, gameid:900
 */
import { Global as G } from 'System/global'
import { IChannelHandler, ReportType, Msg, MsgType} from 'System/channel/ChannelDef'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { ChannelHandler } from 'System/channel/handlers/ChannelHandler'
import { GameIdDef } from 'System/channel/GameIdDef'


export class DevelopHandler implements IChannelHandler {
    start() { };
    destory() { };

    startCheckUserAccount(userName: string, userPassWord: string) {

    }
    startRegisterUser(userName: string, userPassWord: string) {

    }
    notifyToServerSendGood(msg: Msg) {

    }
    isShowFloatIcon(): boolean {
        return false;
    }
    isShowBtnRecord(): boolean {
        return false;
    } 


    get PlatformType(): number {
        return Game.Config.plat * 10000 + Game.Config.gameid;
    }

    get CustomChannel(): string {
        return this.ChannelID;
    }

    get payKey(): string {
        return "";
    }

    get loginKey(): string {
        return "";
    }

    refreshPayState() {
    }

    checkApk(nextcall: () => void) {
        nextcall();
    }

    login(callback: (result: number) => void) {
        callback(0);
        uts.log('imei:' + UnityEngine.SystemInfo.deviceUniqueIdentifier);
    }

    pay(productId: number) {
        UnityEngine.Application.OpenURL("http://192.168.1.5/oss/ossphp/index.html");
    }

    setLogoutFlag(needLogout: boolean) { }
    report(type: ReportType) { }
    canSwitchLogin(): boolean { return true; }
    switchLogin() {
        G.reloadGame(false);
    }
    serVerListFromSDK(): boolean { return false; }
    onMessage(msg: Msg) {
        if (msg.msgtype == MsgType.UPDATERECORDSTATE) {
            if (G.ViewCacher.mainView != null) {
                G.ViewCacher.mainView.updateRecordBtnState(msg.result);
            }
        }
    }
    loginGame(callback: () => void) { callback(); }
    quit() {
        UnityEngine.Application.Quit();
        //G.TipMgr.showConfirm('确定要退出游戏？', ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmQuit));
    }
    get LogoId(): number {
        return GameIdDef.ZSZL;
    }
    get ChannelID(): string { return "0"; }
    get GonggaoChannelID(): string { return "0"; }

    getServerListUrl(fromIps: boolean): string {
        if (Game.Config.gameid == GameIdDef.ZSZL_PLAT_TEST || Game.Config.gameid == GameIdDef.ZSZL_PLAT_CDN_TEST) {
            return "http://106.75.130.99/37wan/mobile/svrlist_douluo_test.php";
        }
        else {
            return "http://106.75.130.99/37wan/mobile/svrlist_douluo_neiwang.php";
        }
    }

    getNoticeUrl(fromIps: boolean): string {
        return "";
    }

    getDirtyUrl(fromIp: boolean): string {
        return "";
    }

    supportPCApp(): boolean {
        return true;
    }

    private onConfirmQuit(state: MessageBoxConst, isCheckSelected: boolean) {
        if (state == MessageBoxConst.yes) {
            UnityEngine.Application.Quit();
        }
    }
}
