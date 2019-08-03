import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
 /**
 * 泡温泉
 */
export class PaoWenQuanCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_PAOWENQUAN);
        this.data.setDisplayName('泡温泉');
        this.data.checkActivityIds = [Macros.ACTIVITY_ID_BATHE];
        this.data.checkSceneId = Macros.BATHE_SCENE_ID;
    }
    
    handleClick() {
    }
}
