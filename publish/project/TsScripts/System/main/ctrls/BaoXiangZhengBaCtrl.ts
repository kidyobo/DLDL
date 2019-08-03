import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
/**
* 宝箱争霸
*/
export class BaoXiangZhengBaCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_BXZB);
        this.data.setDisplayName('宝箱争霸');
    }

    handleClick() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_RICHANG_HD, 0, 0, 15);
    }
}
