import { Global as G } from 'System/global'
import { KeyWord } from "System/constants/KeyWord"

export class NewFuncPreData {
    public list: GameConfig.NPCFunctionPreviewM[]  ;
    onCfgReady() {
        //这个在转表时候已经按照等级排序过，这里不再排序了
        this.list = G.Cfgmgr.getCfg('data/NPCFunctionPreviewM.json') as GameConfig.NPCFunctionPreviewM[];
    }
    public getCurLevelSuitConfig(level: number) {
        for (let config of this.list) {
            if (config.m_iLevel > level) {
                return config;
            }
        }
    }
}