import { Global as G } from 'System/global'
import { SceneData } from 'System/data/scenedata'
import { HeroRule } from 'System/hero/HeroRule'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'

export class MainData {

    xgnShowState: boolean = true;
    teamShowState: boolean = true;
    xgnProgress: number = 0;
    xgnConfig: GameConfig.NewFeatPreConfigM;

    private m_passs: GameConfig.NewFeatPreConfigM[] = new Array<GameConfig.NewFeatPreConfigM>();
    private m_configs: GameConfig.NewFeatPreConfigM[];

    private m_xgnPass: boolean = false;
    getCurrentXgn(): GameConfig.NewFeatPreConfigM {
        if (this.m_xgnPass)
            return null;
        if (!this.m_configs)
            this.m_configs = G.DataMgr.funcLimitData.getFuncPreData();
        let config: GameConfig.NewFeatPreConfigM;
        for (let i: number = 0; i < this.m_configs.length; i++) {
            config = this.m_configs[i];
            if (!this._isPredictionPass(config)) {
                while (this.m_passs.length > 0) {
                    this.m_configs.splice(this.m_configs.indexOf(this.m_passs.pop()), 1);
                }
                return config;
            }
            this.m_passs.push(config);
        }
        //直接销毁
        this.m_passs.length = 0;
        this.m_passs = null;
        this.m_configs.length = 0;
        this.m_configs = null;
        this.m_xgnPass = true;
        return null;
    }

   
    private _isPredictionPass(func: GameConfig.NewFeatPreConfigM): boolean {

        this.xgnProgress = G.DataMgr.heroData.getProperty(Macros.EUAI_LEVEL);
        if (func.m_uiLevel > 0 && this.xgnProgress >= func.m_uiLevel) {
            // 这个m_uiLevel表示最大显示等级
            return true;
        }
        if (func.m_uiType == KeyWord.OTHER_FUNCTION_SLQH) {
            let zhufu = G.DataMgr.zhufuData.getData(KeyWord.HERO_SUB_TYPE_SHENGLING);
            if (zhufu) {
                let Lv: number = zhufu.m_ucLevel;
                this.xgnProgress = (Lv - 1) / HeroRule.stageUpMaxLevel + 1;
                if (this.xgnProgress >= func.m_uiConditionValue) {
                    return true;
                }
            }
            else {
                return false;
            }
        }
        else if (func.m_uiType == KeyWord.OTHER_FUNCTION_JU_YUAN) {
            this.xgnProgress = 0;
            let juyuanType: number = G.DataMgr.juyuanData.type;
            if (juyuanType >= 3) {
                return true;
            }
        }
        //神器的预告如果已经充过值了就过了
        else if (func.m_uiType == KeyWord.OTHER_FUNCTION_WHJH) {
            if (G.DataMgr.heroData.curChargeMoney > 0) {
                return true;
            }
        }
        else if (func.m_uiType == KeyWord.OTHER_FUNCTION_YYQH) {
            // 灵翼强化在玩家点过灵翼进阶后才过
            if (!G.DataMgr.funcLimitData.needGuildWing) {
                return true;
            }
        }
        
        return false;
    }

    isShowXgnPanel(xgnCfg: GameConfig.NewFeatPreConfigM): boolean {
        if (xgnCfg.m_uiType == KeyWord.OTHER_FUNCTION_YYQH && G.DataMgr.heroData.level < G.DataMgr.funcLimitData.wingPredictLv) {
            return false;
        }
        let sceneData: SceneData = G.DataMgr.sceneData;
        if (sceneData.getSceneInfo(sceneData.curSceneID).config.m_ucShowXgnPreview == 0)
            return false;
        if (this.xgnShowState) {
            this.xgnConfig = xgnCfg;
            return true;
        }
        else if (this.xgnConfig != xgnCfg) {
            this.xgnConfig = xgnCfg;
            this.xgnShowState = true; //如果有新的新功能开启,默认再次打开
            return true;
        }
        return false;
    }
}
