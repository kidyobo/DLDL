import { VipData } from 'System/data/VipData'
/**
 *排行榜行组件的数据
 * @author bondzheng
 *
 */
export class RankListItemData {
    /**排名*/
    order: number = 0;

    /**排行信息*/
    rankInfo: Protocol.OneRankInfo;

    get vipLevel(): number {
        if (this.rankInfo) {
            let m_uiChargeVal: number = this.rankInfo.m_stBaseProfile.m_uiChargeVal;
            let vipLevelByRechargeValue: number = VipData.getVipLevelByRechargeValue(m_uiChargeVal);
            return vipLevelByRechargeValue;
        }
        else {
            return 0;
        }
    }
}
