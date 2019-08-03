import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { MapSceneConfig } from 'System/data/scene/MapSceneConfig'
import { SceneData } from 'System/data/scenedata'
import { GateInfo } from 'System/data/scene/GateInfo'
import { NPCInfo } from 'System/data/scene/NPCInfo'
import { NPCData } from 'System/data/NPCData'
import { MapView } from "System/map/view/MapView"
import { Compatible } from "System/Compatible"
/**
 * 地图数据的处理
 * @author fygame
 * 
 */
export class SceneConfigLoadUtil extends EventDispatcher {
    /**当前加载的数据的配置相关*/
    private m_loadingConfigs: MapSceneConfig[];

    /**场景数据*/
    public m_sceneData: SceneData;

    /**
     * 构造函数 
     * @param rm
     * 
     */
    constructor() {
        super();
        this.m_sceneData = G.DataMgr.sceneData;
        this.m_loadingConfigs = new Array<MapSceneConfig>();
    }

    /**
     * 通过场景id和map id设置场景 ，会通过资源管理器去取
     * 这个函数主要是两个地方去调用
     * 一个是切换场景
     * 一个是点击世界地图上某个场景，当然如果点击的是本场景是不会加载bin数据的
     * @param sceneID
     * 
     */
    loadSceneConfigData(sceneID: number): void {
        let loadConfig: MapSceneConfig = this._getLoadConfigBySceneID(sceneID);
        loadConfig.isRscFinished = false;
        let id = G.DataMgr.sceneData.getSceneRescourceID(sceneID);
        // 检查是否有地编优化数据refine.ref
        let mapDataUrl: string = uts.format('map/data/{0}.bytes', sceneID);
        let smallResUrl = G.ModuleMgr.SceneModule.loader.getSceneSmallMap(id);
        let group = [];
        if (smallResUrl != null) {
            group.push(smallResUrl);
        }
        group.push(mapDataUrl);
        let request = Game.ResLoader.CreateAssetsRequest(Game.AssetPriority.High2, group);
        Game.ResLoader.BeginAssetRequest(request, delegate(this, this.onLoadMapData, loadConfig, group));
    }
    private retry(r: boolean, loadConfig, group) {
        if (r) {
            let request = Game.ResLoader.CreateAssetsRequest(Game.AssetPriority.High2, group);
            Game.ResLoader.BeginAssetRequest(request, delegate(this, this.onLoadMapData, loadConfig, group));
        }
        else {
            UnityEngine.Application.Quit();
        }
    }
    private onLoadMapData(request: Game.AssetRequest, loadConfig: MapSceneConfig, group) {
        if (request.error != null) {
            uts.logWarning("地编加载失败r:" + request.error);
            Game.FixedMessageBox.Show("场景加载失败，可能是网络抖动，请重试", delegate(this, this.retry, loadConfig, group));
            return;
        }
        let asset: Game.Asset = request.mainAsset;
        // 解析数据
        Compatible.loadMapData(loadConfig, asset.textAsset.bytes);

        // 同时将npc表演怪的数据添加进去
        let actorNpcIds: number[] = NPCData.getNpcActorMonsterListByScene(loadConfig.sceneID);
        if (actorNpcIds) {
            let actorNpcConfigs: GameConfig.ActorMonsterM[], i: number, len: number, anc: GameConfig.ActorMonsterM, npcInfo: NPCInfo;
            for (let npcId of actorNpcIds) {
                actorNpcConfigs = NPCData.getNpcActorMonsters(npcId);
                len = actorNpcConfigs.length;
                for (i = 0; i < len; i++) {
                    anc = actorNpcConfigs[i];
                    // npc表演怪的ID自增1000倍
                    let npc = new NPCInfo();
                    npc.sceneID = anc.m_iSceneID;
                    npc.x = anc.m_iPositionX;
                    npc.y = anc.m_iPositionY;
                    npc.npcID = npcId * 1000 + i;
                    loadConfig.npcInfos.push(npc);
                }
            }
        }

        //解析完后需要进行一些缓存处理等
        this.m_sceneData.cacheData(loadConfig);
        loadConfig.isRscFinished = true;

        this._checkLoadFinished();
    }

    public _getLoadConfigBySceneID(sceneID: number): MapSceneConfig {
        for (let config of this.m_loadingConfigs) {
            if (config.sceneID == sceneID) {
                return config;
            }
        }
        let ret: MapSceneConfig = new MapSceneConfig();
        ret.sceneID = sceneID;
        ret.resourceID = this.m_sceneData.getSceneRescourceID(sceneID);
        this.m_loadingConfigs.push(ret);
        return ret;
    }

    private _checkLoadFinished(): void {
        //当加载的是本场景data的时候才需要进行更新数据
        for (let i: number = this.m_loadingConfigs.length - 1; i >= 0; i--) {
            let config: MapSceneConfig = this.m_loadingConfigs[i];
            if (config.isRscFinished) {
                this.m_loadingConfigs.splice(i, 1);
                // 已经处理完成了
                if (config.sceneID != this.m_sceneData.curSceneID) {
                    let mapView = G.Uimgr.getForm<MapView>(MapView);
                    if (mapView != null) {
                        mapView.onLoadMapConfig(config);
                    }
                }
                //加载解析完后会派发一个消息，告诉别人这个场景的数据已经加载完成
                //当然派发出去后也只有两个地方会用到
                //一个是切换场景后
                //一个是加载世界地图
                G.ModuleMgr.SceneModule.onMapDataComplete(config.sceneID);//派发地图数据加载完成的消息
            }
        }
    }
}