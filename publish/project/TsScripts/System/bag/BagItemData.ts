import { ThingItemData } from 'System/data/thing/ThingItemData';
import { IconItem } from "System/uilib/IconItem";

/**
 * 背包Item的绑定数据。
 * @author teppei
 *
 */
export class BagItemData {
    ///**
    // * 解锁类型为在线解锁。
    // */
    //static UNLOCK_TYPE_ONLINE: number = 1;

    /**解锁类型为钻石解锁。*/
    static UNLOCK_TYPE_GOLD: number = 2;

    /**是否锁定。*/
    isLocked: boolean;

    /**解锁类型，包括在线解锁和钻石解锁。*/
    unlockType: number = 0;

    /**格子槽位。*/
    itemIndex: number = 0;

    /**物品的数据。*/
    thingData: ThingItemData;

    /**所在的容器ID。*/
    containerID: number = 0;

    /**是否可以拖拽。*/
    canDrag: boolean;

    /**是否可以使用*/
    canUse: boolean = true;

    /**iconItem*/
    iconItem: IconItem;



    /**
     * 重置。
     *
     */
    reset(): void {
        this.isLocked = true;
        this.unlockType = 0;
        this.itemIndex = 0;
        this.thingData = null;
        this.canDrag = false;
        this.canUse = true;
    }
}
