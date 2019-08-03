/**
* 背包格子的数据
* @author fygame
*
*/
export class ThingItemData {
    /**物品配置。*/
    config: GameConfig.ThingConfigM;

    /**物品动态数据。*/
    data: Protocol.ContainerThingInfo;

    /**所在的容器ID。*/
    containerID: number = 0;

    zdl = -1;

    reset(): void {
        this.data = null;
        this.config = null;
        this.containerID = 0;
    }
}
