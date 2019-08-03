
//import fygame.modules.data.xmlData.EquipSlotUpLv_Flash;
import { ThingItemData } from 'System/data/thing/ThingItemData'

/**
 * <装备位>Item的Vo。
 * 
 */
export class EquipSlotLvItemData {
    /**
     *物品数据 
     */
    public thingItemData: ThingItemData;
    /**
     *装备位等级 
     */
    public slotLv: number;
    /**
     *部位 
     */
    public part: number;
    /**
     *下级配置 
     */
     public nextConfig: GameConfig.EquipSlotUpLvM;

}

