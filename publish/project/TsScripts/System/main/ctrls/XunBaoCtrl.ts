import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

/**
* 神秘商店
* @author 
*/
export class XunBaoCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_XUNBAO);
        this.data.setDisplayName('寻宝');
    }

    handleClick(): void {
    }

    onStatusChange(): void {
        this.data.tipCount = TipMarkUtil.qiFu() ? 1 : 0;
    }

}