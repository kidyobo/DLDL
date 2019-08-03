import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
 /**
 * 阵营战
 */
export class ZhenYingZhanCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_ZHENYINGZHAN);
        this.data.setDisplayName('阵营战');
        this.data.checkActivityIds = [Macros.ACTIVITY_ID_CAMPBATTLE];
    }

    handleClick() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_RICHANG_CL);
    }
}
