import { GateInfo } from 'System/data/scene/GateInfo';
import { NPCInfo } from 'System/data/scene/NPCInfo';
import { ShadeInfo } from 'System/data/scene/ShadeInfo';

/**
 * 地图bin数据
 * @author teppei
 * 
 */
export class MapSceneConfig {
    sceneID: number = 0;

    resourceID: number = 0;

    isRscFinished: boolean;

    /**当前地图地图高度*/
    curMapHeight: number = 0;

    /**当前地图地图宽度*/
    curMapWidth: number = 0;

    /**传送点配置数组*/
    gateInfos: GateInfo[] = [];

    /**npc配置数组*/
    npcInfos: NPCInfo[] = [];

    /**
     * 根据传送点ID获取传送点信息。
     * @param id 传送点ID。
     * @return 
     * 
     */
    getGateInfoByID(id: number): GateInfo {
        for (let gateInfo of this.gateInfos) {
            if (id == gateInfo.gateID) {
                return gateInfo;
            }
        }

        return null;
    }
}
