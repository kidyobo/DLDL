import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'

/**
*动态物品数据
*/
export class DynamicThingData {
    private m_dynamicThings: { [id: number]: GameConfig.DynamicThingM } = {};

    onCfgReady() {
        let dataList: GameConfig.DynamicThingM[] = G.Cfgmgr.getCfg('data/DynamicThingM.json') as GameConfig.DynamicThingM[];
        for (let cfg of dataList) {
            this.m_dynamicThings[cfg.m_iID] = cfg;
        }
    }

    /**
    *根据相应的赛季获取对应的物品
    */
    getDynamicThingByID(id: number): GameConfig.DynamicThingDrop {
        let index = G.DataMgr.zhufuData.getSaiJiCur();
        if (this.m_dynamicThings[id] && this.m_dynamicThings[id].m_astDropList[index]) {
            return this.m_dynamicThings[id].m_astDropList[index];
        }
        return null; 
    }
}