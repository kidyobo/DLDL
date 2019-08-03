import { Global as G } from 'System/global'
import { UIUtils } from 'System/utils/UIUtils'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { ThingData } from 'System/data/thing/ThingData'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { HfhdCellItemData } from 'System/data/HfhdCellItemData'

/**
 * 合服对象数据
 * @author jesse
 */
export class HfhdCollectItemData {
    id: number = 0;
    /** 兑换次数 */
    exchangeCount: number = 0;

    maxExchangeCount: number = 0;
    private m_maxNeedItemCount: number = 0;
    cfg: GameConfig.HFCollectWordActCfgM;

    private m_needItems: HfhdCellItemData[];

    constructor(cfg: GameConfig.HFCollectWordActCfgM) {
        this.id = cfg.m_iID;
        this.cfg = cfg;

        this.maxExchangeCount = cfg.m_uiTime;
    }

    get maxNeedItemCount(): number {
        if (this.m_maxNeedItemCount == 0) {
            this.m_needItems = new Array<HfhdCellItemData>();
            let cellItem: HfhdCellItemData;
            let caiLiaoList: GameConfig.HFCWCaiLiaoItem[] = this.cfg.m_stCaiLiaoList;
            for (let i: number = 0; i < caiLiaoList.length; i++) {
                if (caiLiaoList[i].m_uiCaiLiaoID == 0)
                    continue;
                this.m_maxNeedItemCount++;
                cellItem = new HfhdCellItemData();
                //					rewardIconItemData.id = caiLiaoList[i].m_uiCaiLiaoID;
                //					rewardIconItemData.number = caiLiaoList[i].m_uiCaiLiaoCount;

                cellItem.rewardItemnData = new RewardIconItemData();
                cellItem.rewardItemnData.id = caiLiaoList[i].m_uiCaiLiaoID;
                cellItem.rewardItemnData.number = caiLiaoList[i].m_uiCaiLiaoCount;

                cellItem.frame = 1;
                this.m_needItems.push(cellItem);
            }
            this.m_needItems[this.m_needItems.length - 1].frame = 2;
            this.m_maxNeedItemCount++;
            cellItem = new HfhdCellItemData();
            //				rewardIconItemData.id = this.cfg.m_stJiangLiList[0].m_uiJiangLiID;
            //				rewardIconItemData.number = this.cfg.m_stJiangLiList[0].m_uiJiangLiCount;
            cellItem.rewardItemnData = new RewardIconItemData();
            cellItem.rewardItemnData.id = this.cfg.m_stJiangLiList[0].m_uiJiangLiID;
            cellItem.rewardItemnData.number = this.cfg.m_stJiangLiList[0].m_uiJiangLiCount;
            cellItem.frame = 3;
            this.m_needItems.push(cellItem);
        }
        return this.m_maxNeedItemCount;
    }

    /** 需求的道具 */
    get showItems(): HfhdCellItemData[] {
        if (this.maxNeedItemCount == 0)
            return null;
        return this.m_needItems;
    }

    /** 领取状态 (0-未达成，1-达成，2-已领取) */
    get rewardState(): number {
        if (this.exchangeCount >= this.maxExchangeCount)
            return 2;
        let things: ThingItemData[];
        let caiLiaoList: GameConfig.HFCWCaiLiaoItem[] = this.cfg.m_stCaiLiaoList;
        let thingData: ThingData = G.DataMgr.thingData;
        for (let item of caiLiaoList) {
            things = thingData.getBagItemById(item.m_uiCaiLiaoID, true, item.m_uiCaiLiaoCount);
            if (things.length < item.m_uiCaiLiaoCount)
                return 0;
        }

        return 1;
    }
}

