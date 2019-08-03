import { TipType } from 'System/constants/GameEnum'
import { ITipData } from 'System/tip/tipData/ITipData'
/**
* 道具类Tip的数据结构。
* @author teppei
* 
*/
export class ItemTipData implements ITipData {
    readonly tipDataType: TipType = TipType.ITEM_TIP;

    configData: GameConfig.ThingConfigM;
    thingInfo: Protocol.ContainerThingInfo;
    isWearing = false;
    /**是否显示装备对比*/
    isDuibi = false;
    /**所在容器类型*/
    containerID: number = 0;
    bagPos: number = 0;
    /**具体哪个美人ID|祝福类关键字*/
    petOrZhufuId = 0;
    /**是否是预览五彩装备*/
    isPreviewWuCaiEquip: boolean = false;
    wingEquipLv = 0;
    /**附魂预览*/
    isPrevFuHun: boolean = false;

    /**
     * 存入tip显示数据 
     * @param dataArg - 第一个参数位置为ThingConfig_Flash数据类型
     * 								第二个参数位置为ThingProperty数据类型，可以为null
     * 								第三个参数是物品数量，Int类型
     * 								第四个参数是声望名称，String类型
     * 								第五个参数是声望登记，int类型
     * 								第七个参数是是否显示限购信息，boolean类型，true表示需要显示
     * 								第八个参数是商品的商店ID，该参数专门给商店物品使用
     * 								第九个参数是宝石共鸣属性加成，专门给镶嵌在装备上的宝石使用
     */
    setTipData(config: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo = null): void {
        this.configData = config;
        this.thingInfo = thingInfo;
    }
}
