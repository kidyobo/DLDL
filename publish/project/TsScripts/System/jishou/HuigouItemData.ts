import { ThingItemData } from 'System/data/thing/ThingItemData'

export class HuigouItemData {
    config: GameConfig.ThingConfigM;
    itemID: number = 0;//物品id
    price: number = 0;//价格
    classId: number = 0;
    exChangeID: number = 0;//货币id
    limitCount: number = 0;//当前限次
    buy: number = 0;//已买
    has: number = 0;//拥有
    seq: number = 0;//排序
    hjCount: number = 0;//黄金限次
    zsCount: number = 0;//钻石限次
}
