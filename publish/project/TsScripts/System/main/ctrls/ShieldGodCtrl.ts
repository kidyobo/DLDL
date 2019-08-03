import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { ShieldGodView } from 'System/shield/ShieldGodView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

export class ShieldGodCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_SHIELDGOD);
        this.data.setDisplayName('魂兽');
    }

    onStatusChange() {
        if (TipMarkUtil.shieldGod()) {
            this.data.tipCount = 1;
        } else {
            this.data.tipCount = 0;
        }
    }

    handleClick() {
        G.Uimgr.createForm<ShieldGodView>(ShieldGodView).open();
    }
}