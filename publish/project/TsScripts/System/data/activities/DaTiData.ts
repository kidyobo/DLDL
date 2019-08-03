import { Global as G } from 'System/global'
import { StringUtil } from "System/utils/StringUtil"
import { KeyWord } from "System/constants/KeyWord"
import { MathUtil } from "System/utils/MathUtil"
export class DaTiData {
    private datiConfig: { [id: string]: GameConfig.QuestionActivityConfigM };
    onCfgReady(): void {
        let dataList: GameConfig.QuestionActivityConfigM[] = G.Cfgmgr.getCfg('data/QuestionActivityConfigM.json') as GameConfig.QuestionActivityConfigM[];

        this.datiConfig = {};
        for (let config of dataList) {
            this.datiConfig[config.m_iID] = config;
        }
    }
    getDatiConfig(id: number) {
        return this.datiConfig[id];
    }
}