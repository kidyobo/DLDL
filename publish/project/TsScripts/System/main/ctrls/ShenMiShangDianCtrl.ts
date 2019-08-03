import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { ShenMiShangDianView } from 'System/activity/view/ShenMiShangDianView'
import { Macros } from 'System/protocol/Macros'

/**
* 神秘商店
* @author 
*/
export class ShenMiShangDianCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_HSSTORE);
        this.data.setDisplayName('神秘商店');
        this.data.checkActivityIds = [Macros.ACTIVITY_ID_BLACK_STORE];
    }


    onStatusChange() {
    }


    handleClick() {
        G.Uimgr.createForm<ShenMiShangDianView>(ShenMiShangDianView).open();
    }
}