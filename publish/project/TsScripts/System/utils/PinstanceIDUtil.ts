import { Macros } from 'System/protocol/Macros';

/**
 * 为几个特殊的副本做的专门处理——副本面板与任务面板不互斥。
 * 奇珍阁ID直接使用Macros.JEWELTOWER_PINSTANCE_ID。
 *  
 * @author fygame
 * 
 */
export class PinstanceIDUtil {
    /**修炼殿堂副本id。*/
    static ShenMuChuanChengIDs: number[] = [];

    /**组队副本副本id。*/
    static ZuDuiFuBenIDs: number[] = [ Macros.PINSTANCE_ID_SHENGQI,Macros.PINSTANCE_ID_ZFZB/**, Macros.PINSTANCE_ID_SHENDUN*/];

    /**夫妻副本副本id。*/
    static FuQiFuBenIDs: number[] = [Macros.PINSTANCE_ID_FUQI];

    /**特权副本ID。*/
    static TeQuanFuBenIDs: number[] = [Macros.PINSTANCE_ID_ZRJT_1, Macros.PINSTANCE_ID_ZRJT_2, Macros.PINSTANCE_ID_ZRJT_3];

    /**天神殿副本数*/
    static FaShenDianNum: number = 10;

    /**
     * 是否副本大厅里的副本。
     * @param id
     * @return 
     * 
     */
    static isPinstanceHallPins(id: number): boolean {
        return Macros.PINSTANCE_ID_JDYJ == id ||
            PinstanceIDUtil.ShenMuChuanChengIDs.indexOf(id) >= 0 || PinstanceIDUtil.ZuDuiFuBenIDs.indexOf(id) >= 0 || PinstanceIDUtil.TeQuanFuBenIDs.indexOf(id) >= 0 || PinstanceIDUtil.isFsdPins(id);
    }


    /**
    * 是否个人竞技里的副本。
    * @param id
    * @return 
    * 
    */
    static isGrjjPins(id: number): boolean {
        return Macros.PINSTANCE_ID_WST == id || Macros.PINSTANCE_ID_SHNS == id;
    }
    /**
    * 是否组队副本。
    * @param id
    * @return 
    * 
    */
    static isZuDuiFuBen(id: number): boolean {
        for (let i = 0; i < PinstanceIDUtil.ZuDuiFuBenIDs.length; i++) {
            if (PinstanceIDUtil.ZuDuiFuBenIDs[i] == id) {
                return true;
            }
        }
        return false;
    }

    /**
     * 是否跨服组队副本，包括修炼殿堂和组队副本。
     * @param id
     * @return 
     * 
     */
    static isCrossTeamPins(id: number): boolean {
        return PinstanceIDUtil.ShenMuChuanChengIDs.indexOf(id) >= 0 || PinstanceIDUtil.ZuDuiFuBenIDs.indexOf(id) >= 0 || PinstanceIDUtil.isFsdPins(id);
    }

    static isFsdPins(id: number): boolean {
        return id == Macros.PINSTANCE_ID_SHENDUN;
    }

    static isKfjdc(id: number): boolean {
        return Macros.PINSTANCE_ID_SINGLEPVP == id || Macros.PINSTANCE_ID_SINGLEPVP_FINALID == id;
    }

    /**是否在人民币副本*/
    static isRmbZcPin(id: number): boolean {
        return Macros.PINSTANCE_ID_RMBZC == id;
    }

    /**
     * 是否跨服3v3副本
     * @param id
     */
    static isKf3v3(id: number): boolean {
        return Macros.PINSTANCE_ID_MULTIPVP == id;
    }


     /**
     * 是否神力副本
     * @param id
     */
    static isJuYuan(id: number): boolean {
        return Macros.PINSTANCE_ID_JUYUAN == id;
    }

    /**是否宝石试炼副本*/
    static isMinWenShiLian(id: number): boolean {
        return Macros.PINSTANCE_ID_HISTORICAL_REMAINS == id;
    }
}
