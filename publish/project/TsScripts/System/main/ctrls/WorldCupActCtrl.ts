import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { WorldCupActView } from 'System/activity/worldCupAct/WorldCupActView'
import { Macros } from 'System/protocol/Macros'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'



export class WorldCupActCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_WORLDCUP);
        this.data.setDisplayName('火热世界杯');
        this.data.checkActivityIds = [Macros.ACTIVITY_ID_WORLDCUP, Macros.ACTIVITY_ID_WORLDCUPCHAMPION];
    }
    onStatusChange() {
        //if (G.DataMgr.activityData.canGetExChangeShop()) {
        //    this.data.tipCount = 1;
        //}
        //else {
        //    this.data.tipCount = 0;
        //}
    }

    handleClick() {
        G.Uimgr.createForm<WorldCupActView>(WorldCupActView).open();
    }
}