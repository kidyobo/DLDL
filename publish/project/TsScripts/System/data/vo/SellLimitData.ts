import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { Constants } from 'System/constants/Constants'

/**
 * 限购数据，封装了一些限购数据的通用处理逻辑。
 * @author xiaojialin
 * 
 */
export class SellLimitData {
    /**限购物品的ID。*/
    id: number = 0;

    /**限购配置。*/
    sellLimitConfig: GameConfig.NPCSellLimitConfigM;

    /**vip开售等级，从1开始。这类物品的普通限购必须为0。*/
    vipSellLevel: number = 0;

    /**当前vip等级额外增加的购买数。Constants.NO_LIMIT表示不限购。*/
    vipLimit: number = 0;

    /**已购买数。*/
    boughtCount: number = 0;

    /**终身购买数。*/
    lifeBoughtCount: number = 0;

    /**全服已购买数。*/
    globalBought: number = 0;

    /**是否已经开始售卖。*/
    hasStarted: boolean;

    constructor(pSellLimitConfig: GameConfig.NPCSellLimitConfigM) {
        this.id = pSellLimitConfig.m_iThingID;
        this.sellLimitConfig = pSellLimitConfig;

        // 有些物品并没有限购配置，像开服特卖限量，是另一个配置。
        if (null != pSellLimitConfig) {
            // 过滤无效的vip限购
            let vipIndex: number = -1;
            let vipLimitData: number[] = pSellLimitConfig.m_aiNumberPerDayVIP;
            for (let i: number = 0; i < Macros.MAX_VIP_LEVEL; i++) {
                if (vipLimitData[i] > 0) {
                    vipIndex = i;
                    break;
                }
            }

            if (vipIndex < 0) {
                // 将无效数据置空，表示该商品限购跟vip无关
                pSellLimitConfig.m_aiNumberPerDayVIP = null;
            }

            // 确定vip开售等级
            if (0 == pSellLimitConfig.m_iNumberPerDay && null != pSellLimitConfig.m_aiNumberPerDayVIP) {
                this.vipSellLevel = vipIndex + 1;
            }
        }

        // 默认均开始售卖
        this.hasStarted = true;
    }

    /**
     * 查询剩余购买量，Constants.NO_LIMIT表示不限购。
     * @return 剩余购买量，Constants.NO_LIMIT表示不限购。
     * 
     */
    getRestCount(): number {
        let selfLimitNum: number = Constants.NO_LIMIT;
        let globalLimitNum: number = Constants.NO_LIMIT;
        let lifeLimitNum: number = Constants.NO_LIMIT;
        if (null != this.sellLimitConfig)  // 有限购
        {
            if (this.sellLimitConfig.m_iLimitNum > 0) {
                globalLimitNum = this.sellLimitConfig.m_iLimitNum - this.globalBought;
            }

            // 查看终身限购
            if (this.sellLimitConfig.m_iNumberLife > 0) {
                lifeLimitNum = this.sellLimitConfig.m_iNumberLife - this.lifeBoughtCount;
            }

            let escapeBuyCount: boolean;
            if (0 != this.vipSellLevel) {
                // 没有普通限购，只有vip额外购买数
                //if(G.DataMgr.heroData.curVipMonthLevel < this.vipSellLevel)
                if (G.DataMgr.heroData.curVipLevel < this.vipSellLevel) {
                    // vip等级不够，不显示可购买数
                    selfLimitNum = 0;
                    escapeBuyCount = true;
                }
            }

            if (!escapeBuyCount && this.sellLimitConfig.m_iNumberPerDay > 0) {
                selfLimitNum = this.sellLimitConfig.m_iNumberPerDay - this.boughtCount;
                if (this.vipLimit < Constants.NO_LIMIT) {
                    selfLimitNum += this.vipLimit;
                }
            }

            if (globalLimitNum < 0) {
                globalLimitNum = 0;
            }

            if (lifeLimitNum < 0) {
                lifeLimitNum = 0;
            }

            if (selfLimitNum < 0) {
                selfLimitNum = 0;
            }
        }

        return Math.min(selfLimitNum, globalLimitNum, lifeLimitNum);
    }
}
