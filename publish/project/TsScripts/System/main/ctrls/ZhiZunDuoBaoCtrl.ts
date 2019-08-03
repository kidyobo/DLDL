import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { ZhiZunDuoBaoView } from 'System/activity/YunYingHuoDong/ZhiZunDuoBaoView'

/**
* 本服至尊夺宝
* @author
*/
export class ZhiZunDuoBaoCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_ZZZD);
        this.data.setDisplayName('至尊夺宝');
        this.data.checkActivityIds = [Macros.ACTIVITY_ID_ZZZD];
    }

    handleClick(): void {
        G.Uimgr.createForm<ZhiZunDuoBaoView>(ZhiZunDuoBaoView).open();
    }
}