import { Global as G } from 'System/global'
import { StringUtil } from "System/utils/StringUtil"
import { KeyWord } from "System/constants/KeyWord"
import { MathUtil } from "System/utils/MathUtil"
export class GuideTipData {
    private dataList: GameConfig.GuideTipConfigM[];
    onCfgReady(): void {
        this.dataList = G.Cfgmgr.getCfg('data/GuideTipConfigM.json') as GameConfig.GuideTipConfigM[];
    }
    getRandomString(): string {
        let max = this.dataList.length;
        let str = this.dataList[Math.floor(Math.random() * max)].m_szContent;
        return str;
    }
}