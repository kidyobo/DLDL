import { GameIdDef } from "System/channel/GameIdDef";
import { PlatUrlCfg, PlatformCfg, PayExtensionFlag } from 'System/channel/ChannelDef'

export const WinPlatFormUrlCfg: { [gameid: number]: PlatformCfg } = {}

WinPlatFormUrlCfg[GameIdDef.ASDK_FYPAY_DLDL] = {
    urlcfg: { baseurl: 'http://dl.zn.fygame.com/dldl/', ipfmt: 'http://{0}/dldl/', ips: ['39.108.6.205'], channelTag: 'asdk3_' }
    , payExtensionFlag: PayExtensionFlag.NONE
    , currency: 'CNY'
    , needGetorder: true
    , isFygamePay: true
};