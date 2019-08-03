import { Global as G } from 'System/global'
import { MinHeap } from 'System/map/cross/MinHeap'
import { Teleport } from 'System/map/cross/Teleport'
import { SceneUnit } from 'System/map/cross/SceneUnit'
import { PinstanceData } from 'System/data/PinstanceData'

/**
 * 负责跨场景寻路 
 * @author fygame
 * 
 */
export class CrossPath {
    minHeap: MinHeap;

    /**存放跨场景用的数据*/
    private m_scenes: { [sceneID: number]: SceneUnit };

    /**
     * 构造函数 
     * 
     */
    constructor() {
        this.minHeap = new MinHeap();
    }

    /**
     * 更新 
     * @param m_sceneTeleportMap
     * 
     */
    initCrossPathData(sceneTeleportMap: { [sceneID: number]: GameConfig.TeleportConfigM[] }): void {
        this.m_scenes = {};

        let sceneID: number;
        let sceneConfig: GameConfig.SceneConfigM;
        let relatedPids: number[];
        let pinstanceConfig: GameConfig.PinstanceConfigM;
        let teleportList: GameConfig.TeleportConfigM[];
        for (let i in sceneTeleportMap) {
            sceneID = parseInt(i);
            teleportList = sceneTeleportMap[sceneID];
            sceneConfig = G.DataMgr.sceneData.getSceneInfo(sceneID).config;
            relatedPids = PinstanceData.getPinstancesBySceneId(sceneID);

            // 在指定的Zone上创建场景
            this._createSceneUnit(sceneID, teleportList);
        }
    }

    private _createSceneUnit(vSceneID: number, teleportConfigs: GameConfig.TeleportConfigM[]): void {
        let sceneUnit: SceneUnit = new SceneUnit();
        sceneUnit.vSceneId = vSceneID;//需要用到当前场景的id
        let teleports: Teleport[] = new Array<Teleport>();
        let tp: Teleport;

        for (let teleportCfg of teleportConfigs) {
            tp = new Teleport();
            tp.id = teleportCfg.m_iID;  // 传送点的ID
            tp.vSceneId = vSceneID;  // 当前场景id

            // 确定目的场景的场景ID
            tp.targetVSceneID = teleportCfg.m_iTargetScene;

            teleports.push(tp);
        }
        sceneUnit.teleports = teleports;
        this.m_scenes[vSceneID] = sceneUnit;
    }

    /**
     * 得到跨场景寻路数据 
     * @param beginUnit
     * @param endUnit
     * @return 
     * 
     */
    findCrossPathByUnit(beginUnit: Teleport, endUnit: Teleport): Teleport[] {
        let path: Teleport[] = this.findCrossPathByID(beginUnit.vSceneId, endUnit.vSceneId);
        return path;
    }

    /**
     * 寻找跨场景寻路 
     * @param beginSceneId
     * @param endSceneId
     * @return 
     * 
     */
    findCrossPathByID(beginVSceneId: number, endVSceneId: number): Teleport[] {
        //起点：
        this.minHeap.initialize();

        let tmpSceneUnit: SceneUnit;
        for (let sceneIDKey in this.m_scenes) {
            this.m_scenes[sceneIDKey].reset();
        }

        let currentUnit: SceneUnit = this.m_scenes[beginVSceneId];

        if (currentUnit == null) {
            return null;
        }
        //同个场景
        if (beginVSceneId == endVSceneId) {
            return null;
        }
        //begin不放入闭合列表
        if (currentUnit.teleports.length <= 0) {
            return null;
        }

        let item: Teleport;
        let currentWPU: Teleport;
        let currentValue: number = 0;

        while (1) {
            currentUnit.bClosed = true;//被遍历过

            for (item of currentUnit.teleports)//遍历所有的传送点
            {
                tmpSceneUnit = this.m_scenes[item.targetVSceneID];//寻找当前传送点对应的目的场景
                if (tmpSceneUnit == null ||
                    (tmpSceneUnit != null && tmpSceneUnit.bClosed))//如果已经到达过则跳过
                {
                    continue;
                }
                item.parent = currentWPU;

                item.iValueF = currentValue + 1;
                if (tmpSceneUnit.bOpened) {
                    this.minHeap.updateWayPointUnit(item);
                    continue;
                }

                tmpSceneUnit.bOpened = true;
                //列入开放列表
                this.minHeap.PushHeap(item);
            }

            currentWPU = this.minHeap.PopHeap();
            if (currentWPU == null) {
                //找不到
                return null;
            }

            if (currentWPU.targetVSceneID == endVSceneId) {
                //找到
                break;
            }

            currentValue = currentWPU.iValueF;
            currentUnit = this.m_scenes[currentWPU.targetVSceneID];

        }
        let path: Teleport[] = new Array<Teleport>();
			
        path.unshift(currentWPU);
        while (currentWPU.parent) {
            path.unshift(currentWPU.parent);
            currentWPU = currentWPU.parent;
        }
        return path;
    }

}
