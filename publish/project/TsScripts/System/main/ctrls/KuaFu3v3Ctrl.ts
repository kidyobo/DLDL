import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { ActHomeView } from 'System/activity/actHome/ActHomeView'
/**
* 跨服3v3时段活动
*/
export class KuaFu3v3Ctrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_CROSS3V3);
        this.data.setDisplayName('跨服3V3');
    }

    handleClick() {
        G.Uimgr.createForm<ActHomeView>(ActHomeView).open(KeyWord.OTHER_FUNCTION_CROSS3V3);
    }
}
