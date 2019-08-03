import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { SpecialTeQuanView } from 'System/vip/SpecialTeQuanView'

/**
* 特殊特权
*/

export class SpeicialTeQuanCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_SPECIAL_PRI);
        this.data.setDisplayName('特殊特权');
    }

    onStatusChange() {
        let vipData = G.DataMgr.vipData;
        let k = vipData.getSpecialPriKeyByDay(G.SyncTime.getDateAfterStartServer());
        if (vipData.hasBuySpecialPri(k)) {
            this.data.state = FuncBtnState.Normal;
        } else {
            this.data.state = FuncBtnState.Shining;
        }
    }

    handleClick() {
        G.Uimgr.createForm<SpecialTeQuanView>(SpecialTeQuanView).open();
    }


    get IconId(): number {
        return Number(uts.format('{0}{1}', KeyWord.ACT_FUNCTION_SPECIAL_PRI, G.SyncTime.getDateAfterStartServer()));     
    }
}