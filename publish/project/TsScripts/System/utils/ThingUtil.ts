import { ThingData } from 'System/data/thing/ThingData'
import { KeyWord } from 'System/constants/KeyWord'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { Global as G } from 'System/global'
import { PetData } from 'System/data/pet/PetData'



export class ModelData {
    unitType: number = 0;
    modelId: string = '';
    specialType: number = 0;
}

/**物品工具*/
export class ThingUtil {

    /**
    * 返回模型id
    * @param thingId 物品id
    * @return
    *
    */

    static getModelIdByThingType(config: GameConfig.NPCSellConfigM): ModelData {
        let modelData = new ModelData;
        if (config.m_iModelType > 0) {
            //礼包类型的处理方式
            modelData.specialType = UnitCtrlType.other;
            switch (config.m_iModelType) {
                case KeyWord.HERO_SUB_TYPE_ZUOQI:
                    //坐骑
                    modelData.unitType = UnitCtrlType.ride;
                    modelData.modelId = config.m_iModelID.toString();
                    break;
                case KeyWord.HERO_TYPE_BEAUTY:
                    //美人
                    modelData.unitType = UnitCtrlType.pet;
                    modelData.modelId = config.m_iModelID.toString();
                    break;
                case KeyWord.HERO_SUB_TYPE_LEILING:
                    modelData.unitType = UnitCtrlType.shenji;
                    modelData.modelId = config.m_iModelID.toString();
                    break;
                case KeyWord.OTHER_FUNCTION_DRESS:
                    //时装
                    modelData.unitType = UnitCtrlType.hero;
                    modelData.modelId = uts.format('{0}{1}{2}', config.m_iModelID, G.DataMgr.heroData.profession, G.DataMgr.heroData.gender);
                    break;
            }
        }
        else {
            //没配type的去物品表里读取
            let thingConfig = ThingData.getThingConfig(config.m_iItemID);
            if (thingConfig != null) {
                switch (thingConfig.m_ucFunctionType) {
                    case KeyWord.ITEM_FUNCTION_TITLECARD:
                        //称号
                        let config = G.DataMgr.titleData.getDataConfig(thingConfig.m_iFunctionID);
                        modelData.unitType = UnitCtrlType.chenghao;
                        modelData.modelId = config.m_uiImageID.toString();
                        break;
                    case KeyWord.ITEM_FUNCTION_SUBIMAGE:
                        //幻化造型
                        let zhufu = G.DataMgr.zhufuData;
                        let data = zhufu.getImageConfig(zhufu.getImageLevelID(thingConfig.m_iFunctionID, 1));
                        if (data == null) {
                            uts.logWarning("none:" + thingConfig.m_iFunctionID);
                        }
                        if (data.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_ZUOQI) {
                            //坐骑
                            modelData.unitType = UnitCtrlType.ride;
                            modelData.modelId = data.m_iModelID.toString();
                        }
                        else if (data.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_WUHUN) {
                            //神器
                            modelData.unitType = UnitCtrlType.weapon;
                            modelData.modelId = uts.format('{0}_{1}', data.m_iModelID, G.DataMgr.heroData.profession);
                        }
                        else if (data.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_FAZHEN) {
                            //圣印
                            modelData.unitType = UnitCtrlType.zhenfa;
                            modelData.modelId = data.m_iModelID.toString();
                        }
                        else if (data.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_YUYI) {
                            //翅膀
                            modelData.unitType = UnitCtrlType.wing;
                            modelData.modelId = data.m_iModelID.toString();
                        }
                        else if (data.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_LEILING) {
                            //翅膀
                            modelData.unitType = UnitCtrlType.shenji;
                            modelData.modelId = data.m_iModelID.toString();
                        }
                        break;
                    case KeyWord.ITEM_FUNCTION_DRESS_IMAGE:
                        //时装造型
                        modelData.unitType = UnitCtrlType.hero;
                        modelData.modelId = uts.format('{0}{1}{2}', thingConfig.m_iFunctionID, G.DataMgr.heroData.profession, G.DataMgr.heroData.gender);
                        break;
                    case KeyWord.ITEM_JIAOBIAO_FEIMAI:
                        //普通礼包
                        modelData.unitType = UnitCtrlType.other;
                        break;
                    case KeyWord.ITEM_FUNCTION_BEAUTY_CARD:
                        //伙伴
                        modelData.unitType = UnitCtrlType.pet;
                        let petConfig: GameConfig.BeautyStageM = PetData.getEnhanceConfig(thingConfig.m_iFunctionID, 1);
                        modelData.modelId = petConfig.m_iModelID.toString();
                        break;
                }
            }
        }
        return modelData;
    }


}

