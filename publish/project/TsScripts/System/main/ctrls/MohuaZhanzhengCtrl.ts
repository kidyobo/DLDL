import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
/**
* 魔化战争
*/
export class MohuaZhanzhengCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNC_MHZZ);
        this.data.setDisplayName('魔化战争');
    }

    handleClick() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNC_MHZZ);
    }
}
