import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { XXDDMainView } from 'System/diandeng/XXDDMainView'
import { Macros } from 'System/protocol/Macros'

/**跨服点灯活动*/
export class XXDDCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_DDL);
        this.data.setDisplayName('星星点灯');
        this.data.checkActivityIds = [Macros.ACTIVITY_ID_CROSS_DDL];
    }

    handleClick() {
        G.Uimgr.createForm<XXDDMainView>(XXDDMainView).open();
    }
}