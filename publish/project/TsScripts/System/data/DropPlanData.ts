import { Global as G } from 'System/global'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { ThingData } from 'System/data/thing/ThingData'
import { KeyWord } from "System/constants/KeyWord";
/**
* 掉落方案数据。
* @author xiaojialin
* 
*/
export class DropPlanData {
    /**掉落方案配置数据映射表。*/
    private static m_dropConfigMap: { [dropID: number]: GameConfig.DropConfigM };

    onCfgReady(): void {
        let dataList: GameConfig.DropConfigM[] = G.Cfgmgr.getCfg('data/DropConfigM.json') as GameConfig.DropConfigM[];
        DropPlanData.m_dropConfigMap =[];
        for (let dropPlanConfig of dataList) {
            DropPlanData.m_dropConfigMap[dropPlanConfig.m_uiDropID] = dropPlanConfig;
        }
    }

    /**
     * 查询指定掉落方案ID对应的配置。
     * @param dropPlanID 指定的掉落方案ID。
     * @return 指定掉落方案ID对应的配置。
     * 
     */
    static getDropPlanConfig(dropPlanID: number): GameConfig.DropConfigM {

        let dropCfg = DropPlanData.m_dropConfigMap ? DropPlanData.m_dropConfigMap[dropPlanID] : null;

        if (dropCfg.m_ucDropType == KeyWord.DROP_TYPE_NEST_SAIJI) {
            let index = G.DataMgr.zhufuData.getSaiJiCur();
            dropCfg = this.getDropPlanConfig(dropCfg.m_astDropThing[index].m_iDropID);
        }
        return dropCfg;
    }
}
