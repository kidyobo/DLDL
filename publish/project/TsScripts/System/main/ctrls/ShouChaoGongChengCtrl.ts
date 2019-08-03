import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl';
import { Macros } from 'System/protocol/Macros';
/**
* 魂兽入侵
*/
export class ShouChaoGongChengCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_NANMANRUQIN);
        this.data.setDisplayName('魂兽入侵');
        this.data.checkActivityIds = [Macros.ACTIVITY_ID_SOUTHERNMAN];
    }

    handleClick() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_RICHANG_HD, 0, 0, 19);
    }
}
