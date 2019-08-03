import { SellLimitData } from 'System/data/vo/SellLimitData'
import { GameIDUtil } from 'System/utils/GameIDUtil'

/**
 * 商城物品数据。
 * @author xiaojialin
 * 
 */
export class MarketItemData {
    /**商品的普通配置。*/
    itemConfig: GameConfig.ThingConfigM;

    /**
     * 商品的普通售卖配置。因为同一个商品ID，可以存在两个Tab，因此可能有两个NPCSellConfig_Flash，仅商城页签不同。
     * 对于既在vip页签里，又在其他页签里的物品，指的是其他页签的配置。对于只在vip页签里的物品，sellConfig和vipSellConfig一样
     * 都是vip页签的配置。
     */
    sellConfig: GameConfig.NPCSellConfigM;

    /**
     * 商品的vip售卖配置。因为同一个商品ID，可以存在两个Tab，因此可能有两个NPCSellConfig_Flash，仅商城页签不同。
     * 对于只在普通页签里的物品，这一项为空。对于只在vip页签里的物品，sellConfig和vipSellConfig一样
     * 都是vip页签的配置。
     */
    vipSellConfig: GameConfig.NPCSellConfigM;

    /**限购数据。*/
    sellLimitData: SellLimitData;

    /**仅<CODE>MarketHotItem</CODE>使用，表示是否展开详细信息。*/
    isOpen: boolean;

    /**
     * 仅<CODE>MarketHotItem</CODE>使用，表示最受欢迎商品在列表中的位置。
     * 默认为0，表示位于列表中间。1表示列表中唯一一个，2表示列表中第一个，3表示最后一个。
     */
    posType: number = 0;

    /**仅预览时装使用，表示是否穿上。*/
    isPutOn: boolean;

    /**是否受到购买条件限制，比如宗门商店的物品是否受到天机府等级的限制。*/
    isCondLimited: boolean;

    /**是否需要提醒光效（目前商城有用到）。*/
    needRemind: boolean;

    /**是否可以买，比如兑换商城中如果已经有更好的装备了就不能再买。*/
    canBuy: boolean;

    /**默认排序。*/
    defaultSeq: number = 0;

    /**
     * 获取与指定货币ID匹配的售价信息。
     * @param excID
     * @return 
     * 
     */
    getExc(excID: number = 0): GameConfig.Exchange {
        if (0 == excID) {
            return this.sellConfig.m_astExchange[0];
        }

        // 先进行严格搜索
        let exc: GameConfig.Exchange;
        for (exc of this.sellConfig.m_astExchange) {
            if (excID == exc.m_iExchangeID) {
                return exc;
            }
        }

        // 对于钻石和铜钱不区分绑定与否
        if (GameIDUtil.isYuanbaoID(excID)) {
            for (exc of this.sellConfig.m_astExchange) {
                if (GameIDUtil.isYuanbaoID(exc.m_iExchangeID)) {
                    return exc;
                }
            }
        }

        return null;
    }
}
