import { Global as G } from "System/global"

export class FightTipData{
    private fightRewardCfg: GameConfig.FightPointGuideConfigM[];
    filterCfg: GameConfig.FightPointGuideConfigM[] = [];
    //功能开启提醒
    isOnOpen:boolean = false;
    onCfgReady() {
        this.fightRewardCfg = G.Cfgmgr.getCfg('data/FightPointGuideConfigM.json') as GameConfig.FightPointGuideConfigM[];
        this.filterData();
    }
    /**过滤掉没有开启的功能 */
   private filterData() {
        for (let cfg of this.fightRewardCfg) {
            if (G.DataMgr.funcLimitData.isFuncEntranceVisible(cfg.m_iKeyword)) {
                this.filterCfg.push(cfg);
            }
        }
    }
}