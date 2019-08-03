import { Global as G } from 'System/global'

export class ConsumeRankData {
    //private dataList: GameConfig.ConsumeRankActCfgM[];

    CSAct126Panel: Protocol.CSAct126Panel;
    rewardNotify: boolean = false;

    onCfgReady(): void {
       // this.dataList = G.Cfgmgr.getCfg('data/ConsumeRankActCfgM.json') as GameConfig.ConsumeRankActCfgM[];
    }

    /**
    * 0-未领取,1-可领取,2-已领取
    */
    canGetJoinReward(): number {
        if (this.rewardNotify) {    //是否有领奖通知
            return 1;
        }

        if (this.CSAct126Panel != null) {
            let status = this.CSAct126Panel.m_ucRewardGet;
            if (status == 0) {
                return this.CSAct126Panel.m_uiConsume >= this.CSAct126Panel.m_stCfgList[this.CSAct126Panel.m_iCfgCount - 1].m_iCondition3 ? 1 : 0;
            }
            else {
                return 2;
            }
        }

        return 0;
    }

}