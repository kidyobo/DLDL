import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
/**
 * 平台数据。
 * @author teppei
 *
 */
export class PlatformData {
    /** 平台数据集合 */
    private m_platformInfoList: { [platType: number]: PlatformInfo };

    /**
     * 得到link共享服务器的几个平台的ID
     * @see EnumLinkPlat
     * @return
     *
     */
    static getLinkPlatID(): number {
        return PlatformData.getLinkPaltIDByServerID(G.DataMgr.gameParas.serverID);
    }

    static getLinkPaltIDByServerID(serverId: number): number {
        let platID: number = 0;
        return platID;
    }

    getPlatformInfo(type: number): PlatformInfo {
        let info: PlatformInfo;
        if (this.m_platformInfoList == null) {
            this.m_platformInfoList = {};
        }
        return this.m_platformInfoList[type];
    }

    /**
 *获取平台称号ID
 * @param type
 * @return
 *
 */
    public getPlatTitleID(): number {
        return 0;
    }
}

export class PlatformInfo {
    /** 平台类型 */
    type: number = 0;
    /** 官网 */
    homeUrl: string;
    /** 客服中心 */
    kfServiceUrl: string;
    /** 论坛 */
    bbsUrl: string;
    /** 充值 */
    plaUrl: string;
    /** 登录器 */
    dlqUrl: string = '';
    /** CDKey */
    cdkey: string = '';
    /** 手机大礼包路径 */
    sjdlbUrl: string = '';
    /**反沉迷链接*/
    aasUrl: string = '';

    qq: string;

    constructor(type: number) {
        this.type = type;
    }
}