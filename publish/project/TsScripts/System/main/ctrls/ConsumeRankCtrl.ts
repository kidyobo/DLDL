import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { ConsumeRankView } from 'System/activity/view/ConsumeRankView'

/**
* 跨服消费排行榜
* @author
*/
export class ConsumeRankCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_CROSS_ZZZD);
        this.data.setDisplayName('消费排行');
        this.data.checkActivityIds = [Macros.ACTIVITY_ID_126CROSSCHARGE];
    }

    onStatusChange() {
        this.data.tipCount = G.DataMgr.consumeRankData.canGetJoinReward() == 1 ? 1: 0;
    }

    handleClick(): void {
        G.Uimgr.createForm<ConsumeRankView>(ConsumeRankView).open();
    }
}