import { Global as G } from 'System/global'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { FuncBtnState, EnumThingID } from 'System/constants/GameEnum'
import { SecondChargeView } from 'System/activity/view/SecondChargeView'

/**
 * 一元首充
 */
export class SecondChargeCtrl extends BaseFuncIconCtrl {
    constructor() {
        super(KeyWord.ACT_FUNCTION_SECONDCHARGE);
        this.data.setDisplayName('次充礼包');
    }

    onStatusChange() {
        let thingData = G.DataMgr.thingData;
        if (thingData.getThingNum(EnumThingID.SecondChargeItem1) > 0) {
            this.data.state = FuncBtnState.Normal;
            this.data.tipCount = 0;
        } else if (thingData.getThingNum(EnumThingID.SecondChargeItem2) > 0) {
            this.data.state = FuncBtnState.Normal;
            this.data.tipCount = 1;
        } else {
            this.data.state = FuncBtnState.Invisible;
        }
    }

    handleClick() {
        if (!G.ActionHandler.checkCrossSvrUsable(true)) {
            return;
        }
        G.Uimgr.createForm<SecondChargeView>(SecondChargeView).open();
    }

}