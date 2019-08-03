import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { ActHomeView } from 'System/activity/actHome/ActHomeView'
/**
* 比武大会初赛
*/
export class BiWuDaHuiPreCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_BIWUDAHUI_PRE);
        this.data.setDisplayName('比武初赛');
    }

    handleClick() {
        G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.OTHER_FUNCTION_BIWUDAHUI);
    }
}
