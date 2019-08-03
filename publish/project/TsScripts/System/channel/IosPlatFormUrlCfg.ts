import { GameIdDef } from "System/channel/GameIdDef";
import { PlatUrlCfg, PlatformCfg, PayExtensionFlag } from 'System/channel/ChannelDef'


export const IosPlatFormUrlCfg: { [gameid: number]: PlatformCfg } = {}


IosPlatFormUrlCfg[GameIdDef.DOULUO_SLKGL] = {
    urlcfg: { baseurl: 'http://dl.yxg.fygame.com/dldl/', ipfmt: 'http://{0}/dldl/', ips: ['134.175.146.249'], channelTag: 'dlios_' }
    , payExtensionFlag: PayExtensionFlag.USEJSON | PayExtensionFlag.ISIOS | PayExtensionFlag.DEVICEID | PayExtensionFlag.CHANNEL | PayExtensionFlag.APPVER
    , needGetorder: true
    , hasRecordFunction: true
};


IosPlatFormUrlCfg[GameIdDef.DOULUO_ZIYOU] = {
    urlcfg: { baseurl: 'http://dl.zn.fygame.com/dldl/', ipfmt: 'http://{0}/dldl/', ips: ['134.175.146.249'], channelTag: 'fya_' }
    , payExtensionFlag: PayExtensionFlag.USEJSON | PayExtensionFlag.ISIOS | PayExtensionFlag.DEVICEID | PayExtensionFlag.CHANNEL | PayExtensionFlag.APPVER
    , needGetorder: true
    , isFyGameLogin: true
    , isFygamePay: true
};                                            


IosPlatFormUrlCfg[GameIdDef.DOULUO_ZIYOU1] = {
    urlcfg: { baseurl: 'http://dl.zn.fygame.com/dldl/', ipfmt: 'http://{0}/dldl/', ips: ['134.175.146.249'], channelTag: 'fya_' }
    , payExtensionFlag: PayExtensionFlag.USEJSON | PayExtensionFlag.ISIOS | PayExtensionFlag.DEVICEID | PayExtensionFlag.CHANNEL | PayExtensionFlag.APPVER
    , needGetorder: true
    , isFyGameLogin: true
    , isFygamePay: true
};
                              

IosPlatFormUrlCfg[GameIdDef.DOULUO_ZIYOU2] = {
    urlcfg: { baseurl: 'http://dl.zn.fygame.com/dldl/', ipfmt: 'http://{0}/dldl/', ips: ['134.175.146.249'], channelTag: 'fya_' }
    , payExtensionFlag: PayExtensionFlag.USEJSON | PayExtensionFlag.ISIOS | PayExtensionFlag.DEVICEID | PayExtensionFlag.CHANNEL | PayExtensionFlag.APPVER
    , needGetorder: true
    , isFyGameLogin: true
    , isFygamePay: true
};


