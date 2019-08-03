import { ThingItemData } from 'System/data/thing/ThingItemData'

/**
 * 天宫宝镜仓库Item数据。
 * @author teppei
 * 
 */
export class TgbjStoreItemData {
    /**格子数据。*/
    itemData: ThingItemData;

    /**是否已放入待炼化列表。*/
    isLh: boolean = false;
}
