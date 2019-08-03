import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { DailyRechargeView } from 'System/activity/view/DailyRechargeView'

export class DailyRechargeCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_DAYRECHARGE);
        this.data.setDisplayName("每日首充");
    }

    onStatusChange() {
        if (G.DataMgr.firstRechargeData.isNotShowMrczIcon()) {
            this.data.state = FuncBtnState.Invisible;
        }
        else {
            if (G.DataMgr.firstRechargeData.isHasDailyRechargeCanGet()) {
                this.data.tipCount = 1;
            }
            else {
                this.data.tipCount = 0;
            }
            this.data.state = FuncBtnState.Normal;
        }
    }

    handleClick() {
        G.Uimgr.createForm<DailyRechargeView>(DailyRechargeView).open();
    }
}
