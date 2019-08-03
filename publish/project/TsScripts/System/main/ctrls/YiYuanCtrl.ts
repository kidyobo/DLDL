import { Global as G } from 'System/global'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { KeyWord } from 'System/constants/KeyWord'
import { ActivityData } from 'System/data/ActivityData'
import { Macros } from 'System/protocol/Macros'
import { FuncBtnState, EnumKfhdBossType } from 'System/constants/GameEnum'
import { FirstRechargeView } from 'System/activity/view/FirstRechargeView'

/**
 * 一元首充
 */
export class YiYuanCtrl extends BaseFuncIconCtrl {
    constructor() {
        super(KeyWord.ACT_FUNCTION_FIRSTCHARGE);
        this.data.setDisplayName('一元首充');
    }

    onStatusChange() {
        if (/*G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_SZSJ) &&*/ !G.DataMgr.firstRechargeData.isNotShowFirstRechargeIcon()) {
            this.data.state = FuncBtnState.Normal;
            if (G.DataMgr.firstRechargeData.isHasFirstRechargeCanGet())
                this.data.tipCount = 1;
            else 
                this.data.tipCount = 0;
        } else {
            this.data.state = FuncBtnState.Invisible;
        }
    }

    handleClick() {
        if (!G.ActionHandler.checkCrossSvrUsable(true)) {
            return;
        }
        G.Uimgr.createForm<FirstRechargeView>(FirstRechargeView).open();
    }

}

