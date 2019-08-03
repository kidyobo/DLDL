import { Global as G } from 'System/global'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { FuncBtnState } from 'System/constants/GameEnum'
import { MallView } from 'System/business/view/MallView'
/**
 * 商城
 *
 */
export class ShangChengCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_MALL);
        this.data.setDisplayName('商城');
    }

    handleClick() {
        G.Uimgr.createForm<MallView>(MallView).open();
    }
}
