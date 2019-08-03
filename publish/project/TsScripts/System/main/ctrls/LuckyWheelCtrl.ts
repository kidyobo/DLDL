import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { LuckyWheelView } from 'System/activity/view/LuckyWheelView'

export class LuckyWheelCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_XYZP);
        this.data.setDisplayName('幸运转盘');
        this.data.checkActivityIds = [Macros.ACTIVITY_ID_XYZP];
    }

    handleClick() {
        G.Uimgr.createForm<LuckyWheelView>(LuckyWheelView).open();
    }
}