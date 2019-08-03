import { Global as G } from 'System/global'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState, EnumKfhdBossType } from 'System/constants/GameEnum'
import { TipMarkUtil } from "System/tipMark/TipMarkUtil"
import { MeiRiLiBaoView } from '../../activity/YunYingHuoDong/MeiRiLiBaoView';
import { KeyWord } from '../../constants/KeyWord';
/**
 * 每日礼包
 */
export class MeiRiLiBaoCtrl extends BaseFuncIconCtrl {
    constructor() {
        super(KeyWord.ACT_FUNCTION_ZHIGOULIBAO);
        this.data.setDisplayName('直购礼包');
    }

    onStatusChange() {
        if (G.IsIosTiShenEnv) {
            this.data.state = FuncBtnState.Invisible;
            return;
        }
        if (TipMarkUtil.MeiRiLiBaoCanGet()) {
            this.data.tipCount = 1;
        } else {
            this.data.tipCount = 0;
        }
    }

    handleClick() {
        G.Uimgr.createForm<MeiRiLiBaoView>(MeiRiLiBaoView).open();
    }

}