import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
 /**
 * 护送双倍
 */
export class HuSongShuangBeiCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HSSB);
        this.data.setDisplayName('护送双倍');
    }
    
    handleClick() {
        if (G.DataMgr.questData.canAcceptShip(G.DataMgr.questData.guoyunConsignerNpcID, G.DataMgr.heroData, true, true, false)) {
            G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_RICHANG_CL);
        }
    }
}
