import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { BagView } from 'System/bag/view/BagView'

export class BagCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_BAG);
        this.data.setDisplayName('背包');
    }

    handleClick() {
        G.Uimgr.createForm<BagView>(BagView).open();
    }
}