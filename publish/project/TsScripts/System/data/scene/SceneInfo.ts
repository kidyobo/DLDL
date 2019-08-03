import { MapSceneConfig } from 'System/data/scene/MapSceneConfig';

/**
 * 场景数据。
 * @author teppei
 * 
 */
export class SceneInfo {
    /**场景配置。*/
    config: GameConfig.SceneConfigM;
    constructor(config: GameConfig.SceneConfigM) {
        this.config = config;
    }
}
