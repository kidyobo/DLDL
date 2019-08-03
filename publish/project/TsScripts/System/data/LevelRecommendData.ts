import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'

export class LevelRecommendData {
    lvCfgArray: GameConfig.LevelRecommendCfgM[];
    fightCfgArray: GameConfig.LevelRecommendCfgM[];
    onCfgReady() {
        let cfgs = G.Cfgmgr.getCfg('data/LevelRecommendCfgM.json') as GameConfig.LevelRecommendCfgM[];
        this.lvCfgArray = [];
        this.fightCfgArray = [];
        for (let cfg of cfgs) {
            if (cfg.m_iOperationType == KeyWord.RECOMMEND_TYPE_OPENPANEL||cfg.m_iOperationType == KeyWord.RECOMMEND_TYPE_GOTONPC||cfg.m_iOperationType == KeyWord.RECOMMEND_TYPE_PINSTANCE) {
                this.lvCfgArray.push(cfg);
            } else if (cfg.m_iOperationType == KeyWord.RECOMMEND_TYPE_FIGHT_OPENPANEL) {
                this.fightCfgArray.push(cfg);
            }
        }
    }
}