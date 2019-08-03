import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { ActHomeView } from 'System/activity/actHome/ActHomeView'
/**
* 西洋棋时段活动
*/
export class ZhenLongQiJuCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_ZLQJ);
        this.data.setDisplayName('西洋棋');
    }

    handleClick() {
        G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.OTHER_FUNCTION_ZLQJ);
    }
}
