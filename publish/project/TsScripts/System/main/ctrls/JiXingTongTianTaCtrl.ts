import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
/**
* 星球之巅（元梦战场）
*/
export class JiXingTongTianTaCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_JXTTT);
        this.data.setDisplayName('星球之巅');
    }

    handleClick() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_RICHANG_HD, 0, 0, 18);
    }
}
