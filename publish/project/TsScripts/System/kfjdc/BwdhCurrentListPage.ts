import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { EnumBwdhPage } from 'System/kfjdc/BiWuDaHuiPanel'
import { BuffData } from 'System/data/BuffData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { BwdhCompetitionPage } from 'System/kfjdc/BwdhCompetitionPage'

export class BwdhCurrentListPage extends BwdhCompetitionPage {

    constructor() {
        super(EnumBwdhPage.Current_List);
    }

    onBiWuDaHuiChange(opType: number) {
        let kfjdcData = G.DataMgr.kfjdcData;
        let finalData = kfjdcData.m_finalData;
        if (finalData) {
            let gameData = finalData.m_stGameInfo;
            let allProgress: number[] = [gameData.m_iProgress > 0 ? gameData.m_iProgress : KeyWord.KFJDC_FINAL_PROGRESS_32TO16];
            this.updateList(allProgress);
        }
    }
}