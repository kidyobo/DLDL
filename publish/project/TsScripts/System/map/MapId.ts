import { Macros } from 'System/protocol/Macros';
import { SceneID } from 'System/constants/GameEnum'
import { Global } from '../global';

/**
 * 地图ID
 * @author jesse
 *
 */
export class MapId {
    /** 隐藏称号的副本 */
    static readonly HIDE_TITLE_PINSTANCE: number[] = [Macros.PINSTANCE_ID_RMBZC];

    /** 世界Boss副本ID */
    static readonly WORLD_BOSS_PINSTANCE: number = 300041;

    /** 精灵副本 */
    static readonly PINSTANCE_LINGBAO: number = 300055;
    
    static readonly GRJJ_MAP: number[] = [Macros.PINSTANCE_ID_PVP, Macros.PINSTANCE_ID_DIBANG, Macros.PINSTANCE_ID_TIANBANG];
    /** 宗门秘境 */
    static readonly ZMMJ_LIST: number[] = [194, 195, 196, 197, 198];
    /** 主城地图ID */
    static readonly ZHU_CHENG: number = 3;
    /**
     * 是否是BOSS地图
     * @param sceneID	地图编号
     * @return
     *
     */
    static isZMMJMapId(sceneID: number): boolean {
        return MapId.ZMMJ_LIST.indexOf(sceneID) != -1;
    }

    /**
     * 是否是地宫BOSS地图
     * @param sceneID	地图编号
     * @return
     *
     */
    static isDgBossMapId(sceneID: number): boolean {
        return sceneID >= SceneID.DiGongBossMin && sceneID <= SceneID.DiGongBossMax;
    }

    /**
     * 获取地图所在地宫的层数
     * @param	sceneID
     * @return
     */
    static getDgBossLayer(sceneID: number): number {
        return sceneID - SceneID.DiGongBossMin + 3;
    }


    /**
     * 是否确认个人竞技地图
     * @param curPinstanceID
     * @return
     *
     */
    static isGRJJMapId(curPinstanceID: number): boolean {
        return MapId.GRJJ_MAP.indexOf(curPinstanceID) != -1;
    }
    /**是否是落日森林 */
    static isLuori(){
       let sceneid = Global.DataMgr.sceneData.curSceneID;
       return  Global.DataMgr.sceneData.getSceneInfo(sceneid).config.m_szSceneName == '落日森林'; 
    }
    /**
     * 是否在福神争霸地图
     * @param	sceneID
     * @return
     */
    static isFXZDMapId(sceneID: number): boolean {
        return sceneID == SceneID.FU_SHEN_ZHENG_BA;
    }

    /**
     * 是否需要自动将右上角活动按钮收起来
     * @param sceneId
     * @param pinstanceId
     */
    static needAutoCloseActBtnCtrl(sceneId: number, pinstanceId: number) {
        return pinstanceId > 0 || MapId.isDgBossMapId(sceneId)
    }
}
