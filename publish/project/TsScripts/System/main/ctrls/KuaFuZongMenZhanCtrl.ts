import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
 /**
 * 跨服宗门战
 */
export class KuaFuZongMenZhanCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNC_KFZMZ);
        this.data.setDisplayName('跨服宗门争霸');
        this.data.needGuild = true;
    }
    
    handleClick() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNC_KFZMZ);
    }
}
