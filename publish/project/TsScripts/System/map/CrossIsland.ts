import { Global as G } from 'System/global'
import { MinHeap } from 'System/map/cross/MinHeap'
import { Teleport } from 'System/map/cross/Teleport'
import { SceneUnit } from 'System/map/cross/SceneUnit'

/**
 * 负责跳跃点寻路 
 * @author fygame
 * 
 */
export class CrossIsland {
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
    initCrossIslandData(sceneTeleports: GameConfig.TeleportConfigM[]): void {
        this.m_scenes = {};

        if (sceneTeleports) {
            let sceneData = G.DataMgr.sceneData;
            for (let i = 0, len = sceneTeleports.length; i < len; i++) {
                let tconf = sceneTeleports[i];
                let tpInfo = sceneData.getGateInfo(sceneData.curSceneID, tconf.m_iID);
                let targetTpInfo = sceneData.getGateInfo(sceneData.curSceneID, tconf.m_iTargetTransportID);

                let islandIdx = G.Mapmgr.tileMap.GetIslandIdx(tpInfo.x, tpInfo.y);
                let sceneUnit: SceneUnit = this.m_scenes[islandIdx];
                if (!sceneUnit) {
                    this.m_scenes[islandIdx] = sceneUnit = new SceneUnit();
                }

                sceneUnit.vSceneId = islandIdx;//需要用到当前场景的id
                let teleports: Teleport[] = sceneUnit.teleports;
                if (!teleports) {
                    sceneUnit.teleports = teleports = new Array<Teleport>();
                }
                let tp = new Teleport();
                tp.id = tconf.m_iID;  // 传送点的ID
                tp.vSceneId = islandIdx;  // 当前场景id
                tp.position = new UnityEngine.Vector2(tpInfo.x, tpInfo.y);

                // 确定目的场景的场景ID
                tp.targetVSceneID = G.Mapmgr.tileMap.GetIslandIdx(targetTpInfo.x, targetTpInfo.y);

                teleports.push(tp);
            }
        }
    }

    /**
     * 得到跨场景寻路数据 
     * @param beginUnit
     * @param endUnit
     * @return 
     * 
     */
    findCrossIsland(beginX: number, beginY: number, endX: number, endY: number): Teleport[] {
        let bidx = G.Mapmgr.tileMap.GetIslandIdx(beginX, beginY);
        let eidx = G.Mapmgr.tileMap.GetIslandIdx(endX, endY);
        let path: Teleport[] = this.findCrossIslandByID(bidx, eidx);
        return path;
    }

    /**
     * 寻找跨场景寻路 
     * @param beginSceneId
     * @param endSceneId
     * @return 
     * 
     */
    findCrossIslandByID(beginVSceneId: number, endVSceneId: number): Teleport[] {
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
