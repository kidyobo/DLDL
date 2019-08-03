import { Global as G } from 'System/global'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { KeyWord } from 'System/constants/KeyWord'
import { ActivityData } from 'System/data/ActivityData'
import { FuncBtnState } from 'System/constants/GameEnum'
import { FengMoTaView } from 'System/pinstance/fmt/FengMoTaView'

export class FengMoTaCtrl extends BaseFuncIconCtrl {
    constructor() {
        super(KeyWord.ACT_FUNCTION_FMT);
        this.data.setDisplayName('黑洞塔');
    }

    handleClick() {
        // 需要检查准入条件
        G.Uimgr.createForm<FengMoTaView>(FengMoTaView).open();
    }
}
