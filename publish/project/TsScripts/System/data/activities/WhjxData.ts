import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { CompareUtil } from 'System/utils/CompareUtil'

/**
 * 能力叛乱
 */
export class WhjxData {
    static readonly Types: number[] = [KeyWord.WHJX_TYPE_DZSD, KeyWord.WHJX_TYPE_TGRW, KeyWord.WHJX_TYPE_BDRW,
        KeyWord.WHJX_TYPE_QLDJ, KeyWord.WHJX_TYPE_ZQDJ, KeyWord.WHJX_TYPE_XWDJ, KeyWord.WHJX_TYPE_BHDJ];

    panelInfo: Protocol.WHJXPannelInfo = { m_iBuyItemID: 0, m_stZoneData: null, m_stRankData: null, m_iCDCleanCount: 0, m_uiCDTimeStamp: 0, m_uiEndTimeStamp: 0 };
    panelUpdateAt = 0;

    /**等候剩余秒数*/
    beginWaitAt = 0;

    private cfgMap: { [type: number]: GameConfig.WHJXCfgM } = {};

    onCfgReady() {
        let dataList: GameConfig.WHJXCfgM[] = G.Cfgmgr.getCfg('data/WHJXCfgM.json') as GameConfig.WHJXCfgM[];
        for (let cfg of dataList) {
            this.cfgMap[cfg.m_iType] = cfg;
        }
    }

    getCfgByType(type: number): GameConfig.WHJXCfgM {
        return this.cfgMap[type];
    }

    updateBuyInfo(info: Protocol.WHJXBuyInfo) {
        this.panelInfo.m_iBuyItemID = info.m_iBuyItemID;
        this.panelInfo.m_stRankData = info.m_stRankData;
    }

    updateCleanCd(info: Protocol.WHJXCDInfo) {
        this.panelInfo.m_iCDCleanCount = info.m_iCDCleanCount;
        this.panelInfo.m_uiCDTimeStamp = info.m_uiCDTimeStamp;
    }

    getMyType(): number {
        if (null != this.panelInfo) {
            let zoneData = this.panelInfo.m_stZoneData;
            if (null != zoneData) {
                let myRoleID = G.DataMgr.heroData.roleID;
                for (let i = 0; i < zoneData.m_iCount; i++) {
                    let info = zoneData.m_stWHJXRoleList[i].m_stSimRoleInfo;
                    if (CompareUtil.isRoleIDEqual(myRoleID, info.m_stID)) {
                        return WhjxData.Types[i];
                    }
                }
            }
        }
        return 0;
    }

    get hasBuyGift(): boolean {
        return (this.panelInfo.m_iBuyItemID & (1 << Macros.WHJX_BUY_ITEM_BIT_2)) != 0;
    }

    get hasBuyGiftBind(): boolean {
        return (this.panelInfo.m_iBuyItemID & (1 << Macros.WHJX_BUY_ITEM_BIT_1)) != 0;
    }
}