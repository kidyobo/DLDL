import { Global as G } from 'System/global'

/**
 * 礼包表。
 * @author teppei
 * 
 */
export class GiftGroupData {
    m_GiftsByType: { [type: number]: GameConfig.GiftBagConfigM[] };

    constructor() {
        this.m_GiftsByType = {};
    }

    onCfgReady(): void {
        let dataList: GameConfig.GiftBagConfigM[] = G.Cfgmgr.getCfg('data/GiftBagConfigM.json') as GameConfig.GiftBagConfigM[];
        for (let config of dataList) {
            if (config.m_ucGiftType == 0) {
                continue;
            }
            config.m_astGiftThing.length = config.m_ucGiftThingNumber;

            if (this.m_GiftsByType[config.m_ucGiftType] == null) {
                this.m_GiftsByType[config.m_ucGiftType] = new Array<GameConfig.GiftBagConfigM>();
            }
            this.m_GiftsByType[config.m_ucGiftType].push(config);
        }

        for (let typeKey in this.m_GiftsByType) {
            let listOfGift = this.m_GiftsByType[typeKey];
            listOfGift.sort(this.sort);
        }
    }

    private sort(x: GameConfig.GiftBagConfigM, y: GameConfig.GiftBagConfigM): number {
        if (x.m_iParameter > y.m_iParameter) {
            return 1;
        }
        else if (x.m_iParameter < y.m_iParameter) {
            return -1;
        }
        else {
            return 0;
        }
    }

    /**
     * 获取指定类型的礼包列表 
     * @param type
     * @return 
     * 
     */
    getListDataByType(type: number): GameConfig.GiftBagConfigM[] {
        return this.m_GiftsByType[type];
    }

    /**
     * 通过礼包类型和参数查找礼包配置 
     * @param type
     * @param param
     * @return 
     * 
     */
    getGiftBagConfigByTypeAndParam(type: number, param: number): GameConfig.GiftBagConfigM {
        let gifts: GameConfig.GiftBagConfigM[] = this.m_GiftsByType[type];
        if (defines.has('_DEBUG')) {
            uts.assert(gifts != null, '获取礼包配置为空');
        }
        for (let item of gifts) {
            if (item.m_iParameter == param) {
                return item;
            }
        }
        return null;
    }
}
