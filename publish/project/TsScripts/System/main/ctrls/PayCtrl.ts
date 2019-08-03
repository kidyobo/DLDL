import { Global as G } from 'System/global'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { FuncBtnState } from 'System/constants/GameEnum'
import { PayView } from 'System/pay/PayView'
import { VipTab, VipView } from "System/vip/VipView"
/**
 * 充值
 *
 */
export class PayCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_CHARGE);
        this.data.setDisplayName('充值');
    }

    handleClick() {
        G.Uimgr.createForm<VipView>(VipView).open(VipTab.ChongZhi);
    }
}
