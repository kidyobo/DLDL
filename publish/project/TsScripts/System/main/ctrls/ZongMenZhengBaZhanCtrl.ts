import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
/**
* 宗门争霸战
*/
export class ZongMenZhengBaZhanCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_ZPQYH);
        this.data.setDisplayName('宗门争霸战');
    }

    handleClick() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNC_KFZMZ);
    }
}
