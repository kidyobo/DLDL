import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
 /**
 * 猎户座
 */
export class JiuZhuanXingGongCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_JZXG);
        this.data.setDisplayName('圣柱台');
    }
    
    handleClick() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_RICHANG_HD)
    }
}
