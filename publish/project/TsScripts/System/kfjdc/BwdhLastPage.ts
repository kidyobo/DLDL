import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { EnumBwdhPage } from 'System/kfjdc/BiWuDaHuiPanel'
import { BuffData } from 'System/data/BuffData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { BwdhCompetitionPage } from 'System/kfjdc/BwdhCompetitionPage'
import { KfjdcData } from 'System/data/KfjdcData'

export class BwdhLastPage extends BwdhCompetitionPage {

    constructor() {
        super(EnumBwdhPage.Last);
    }

    onBiWuDaHuiChange(opType: number) {
        let kfjdcData = G.DataMgr.kfjdcData;
        let finalData = kfjdcData.m_finalData;
        if (finalData) {
            let allProgress: number[] = [];
            let gameData = finalData.m_stGameInfo;

            let week = G.SyncTime.serverDate.getDay();
            if (week >= 1 && week <= 5) {
                // 周6前显示上一赛季的 全是已结束
                allProgress = KfjdcData.ProgressSeq.concat();
            } else {
                // 周六打晋级赛
                // 周日打半决赛、季军赛、冠军赛
                let l = KfjdcData.ProgressSeq.length;
                let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
                for (let i = 0; i < l; i++) {
                    if (KfjdcData.ProgressSeq[i] < gameData.m_iProgress || now > gameData.m_uiEndTime) {
                        allProgress.push(KfjdcData.ProgressSeq[i]);
                    } else {
                        break;
                    }
                }
            }

            this.updateList(allProgress.reverse());
        }
    }
}