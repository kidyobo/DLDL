import { ThingData } from 'System/data/thing/ThingData'

/**
 * 热门道具数据
 * @author Luka
 * 
 */
export class HotItemData {  
    //道具配置
    itemConfig: GameConfig.ThingConfigM;
    //物品数据
    private _itemInfo: GameConfig.DropThingM;
    /**奖励物品ID，可以是普通物品，也可以是特殊物品的ID，比如货币。*/
    id: number = 0;


    /**道具名称*/
    get itemName(): string {
        if (this.itemConfig) {
            return this.itemConfig.m_szName;
        }
        return '';
    }
    /**道具ID*/
    get itemID(): number {
        if (this.itemConfig) {
            return this.itemConfig.m_iID;
        }
        return 0;
    }

    /**道具信息*/
    set itemInfo(value: GameConfig.DropThingM) {
        this._itemInfo = value;
        this.itemConfig = ThingData.getThingConfig(this._itemInfo.m_iDropID);
    }

    get itemInfo(): GameConfig.DropThingM {
        return this._itemInfo;
    }
}
