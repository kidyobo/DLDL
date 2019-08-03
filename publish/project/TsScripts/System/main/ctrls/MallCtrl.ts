import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { MallView } from 'System/business/view/MallView'
import { EnumStoreID } from 'System/constants/GameEnum'

export class MallCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_MALL);
        this.data.setDisplayName('商城');
    }

    handleClick() {
        G.Uimgr.createForm<MallView>(MallView).open(EnumStoreID.MALL_YUANBAO);
    }
}