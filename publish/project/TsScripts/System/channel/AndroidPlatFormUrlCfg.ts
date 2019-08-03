import { GameIdDef } from "System/channel/GameIdDef";
import { PlatUrlCfg, PlatformCfg, PayExtensionFlag } from 'System/channel/ChannelDef'


export const AndroidPlatFormUrlCfg: { [gameid: number]: PlatformCfg } = {}

//douluo
AndroidPlatFormUrlCfg[GameIdDef.SLKGL] = {
    urlcfg: { baseurl: 'http://dl.yxg.fygame.com/dldl/', ipfmt: 'http://{0}/dldl/', ips: ['134.175.146.249'], channelTag: 'dl_' }
    , payExtensionFlag: PayExtensionFlag.USEJSON | PayExtensionFlag.ISIOS | PayExtensionFlag.DEVICEID | PayExtensionFlag.CHANNEL | PayExtensionFlag.APPVER
    , needGetorder: true
};

//douluo
AndroidPlatFormUrlCfg[GameIdDef.DLDL] = {
    urlcfg: { baseurl: 'http://dl2.yxg.fygame.com/dldl/', ipfmt: 'http://{0}/dldl/', ips: [], channelTag: 'dl2_' }
    , urlcfgsByChannel: { // 配置不同渠道对应的服务器地址
        '123': { baseurl: 'http://dl3.yxg.fygame.com/dldl/', ipfmt: 'http://{0}/dldl/', ips: ['106.52.204.17'], channelTag: 'dl3_' } //拇指包
    }
    , payExtensionFlag: PayExtensionFlag.USEJSON | PayExtensionFlag.ISIOS | PayExtensionFlag.DEVICEID | PayExtensionFlag.CHANNEL | PayExtensionFlag.APPVER
    , needGetorder: true
};
                                                           
//7477
AndroidPlatFormUrlCfg[GameIdDef.C7477_DLDL] = {
    urlcfg: { baseurl: 'http://dl.7477.fygame.com/dldl7477/', ipfmt: 'http://{0}/dldl7477/', ips: ['106.75.166.232'], channelTag: '7477_' }
    , payExtensionFlag: PayExtensionFlag.ORDERID
    , needGetorder: true
};                                                       
                                                        
//douluo - axsdk
AndroidPlatFormUrlCfg[GameIdDef.ASDK_DLDL] = {
    urlcfg: { baseurl: 'http://dl.zn.fygame.com/dldl/', ipfmt: 'http://{0}/dldl/', ips: ['39.108.6.205'], channelTag: 'asdk_' }
    , payExtensionFlag: PayExtensionFlag.SERVER
    , needGetorder: false
};


//douluo - axsdk + fypay
AndroidPlatFormUrlCfg[GameIdDef.ASDK_FYPAY_DLDL] = {
    urlcfg: { baseurl: 'http://dl.zn.fygame.com/dldl/', ipfmt: 'http://{0}/dldl/', ips: ['39.108.6.205'], channelTag: 'asdk2_' }
    , payExtensionFlag: PayExtensionFlag.NONE
    , currency: 'CNY'
    , needGetorder: true
    , isFygamePay: true
};