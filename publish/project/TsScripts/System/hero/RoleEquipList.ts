import { KeyWord } from 'System/constants/KeyWord'
import { ThingItemData } from 'System/data/thing/ThingItemData';
import { IconItem } from "System/uilib/IconItem";

export class RoleEquipList {
    /**iconItem*/
    iconItem: IconItem;

    /**物品的数据。*/
    thingData: ThingItemData;

    /**所在的容器ID。*/
    containerID: number = 0;

    /**格子槽位。*/
    itemIndex: number = 0;

    /**
    * 重置。
    *
    */
    reset(): void {      
        this.thingData = null;       
    }
}

