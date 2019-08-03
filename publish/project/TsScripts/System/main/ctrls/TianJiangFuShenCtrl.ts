import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
 /**
 * 天降福神
 */
export class TianJiangFushenCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_TIANJIANGFUSHEN);
        this.data.setDisplayName('天降福神');
    }
    
    handleClick() {
    }
}
