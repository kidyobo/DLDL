import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { RankView } from 'System/rank/RankView'

export class RankCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_RANK);
        this.data.setDisplayName('排行榜');
    }

    handleClick() {
        G.Uimgr.createForm<RankView>(RankView).open();
    }
}