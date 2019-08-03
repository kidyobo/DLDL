import { GameIDType } from 'System/constants/GameEnum'
import { ThingItemData } from 'System/data/thing/ThingItemData'

/**所有装备的缓冲-为性能优化 */
export class EquipsCache {
    private caches: { [containerType: number]: { equips: { [equipType: number]: ThingItemData[] } } } = {}

    getCacheEquips(equipType: GameIDType, containerId: number, returnCopy: boolean): ThingItemData[] {
        let cache = this.caches[containerId];

        if (!cache) return null;

        let equips = cache.equips[equipType];

        if (!equips) return null;

        if (returnCopy)
            return equips.concat();
        else
            return equips;
    }
    cacheEquips(equipType: GameIDType, containerId: number, equips: ThingItemData[]) {
        if (!this.caches[containerId]) {
            this.caches[containerId] = { equips: {} };
        }
        this.caches[containerId].equips[equipType] = equips.concat();
    }
    clearCache(containerId: number) {
        if (this.caches[containerId]) {
            this.caches[containerId].equips = {};
        }
    }
}