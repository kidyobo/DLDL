import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
/**
* 答题活动
*/
export class DaTiHuoDongCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_DATI);
        this.data.setDisplayName('答题活动');
        this.data.checkActivityIds = [Macros.ACTIVITY_ID_QUESTIONACTIVITY];
        this.data.checkSceneId = G.DataMgr.sceneData.getActVscene(KeyWord.NAVIGATION_QUESTION_ACT_SENCE, Macros.ACTIVITY_ID_QUESTIONACTIVITY);
    }

    handleClick() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_RICHANG_HD, 0, 0, 16);
    }
}
