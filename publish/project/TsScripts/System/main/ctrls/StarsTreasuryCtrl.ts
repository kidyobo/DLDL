import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { EnumStoreID } from 'System/constants/GameEnum'
import { StarsTreasuryView } from "System/activity/xingdoubaoku/StarsTreasuryView";
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

export class StarsTreasuryCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_STARSTREASURY);
        this.data.setDisplayName("星斗宝库");
    }

    onStatusChange() {
        this.data.tipCount = TipMarkUtil.startTreasury() ? 1 : 0;
    }

    handleClick() {
        G.Uimgr.createForm<StarsTreasuryView>(StarsTreasuryView).open();//报名
    }
}