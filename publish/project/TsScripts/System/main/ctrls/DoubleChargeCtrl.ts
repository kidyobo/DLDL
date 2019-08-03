import { FuncBtnState } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { Global as G } from "System/global";
import { BaseFuncIconCtrl } from "System/main/BaseFuncIconCtrl";
import { DoubleChargeView } from "System/pay/DoubleChargeView";

/**
 * 充值
 *
 */
export class DoubleChargeCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_DOUBLE_CHARGE);
        this.data.setDisplayName('双倍充值');
    }

    onStatusChange() {
        this.data.state = G.DataMgr.doubleChargeData.canShow() ? FuncBtnState.Normal : FuncBtnState.Invisible;
        // 显示数字图标
        this.data.tipCount = G.DataMgr.doubleChargeData.hasReward() ? 1 : 0;
    }

    handleClick() {
        G.Uimgr.createForm<DoubleChargeView>(DoubleChargeView).open();
    }
}
