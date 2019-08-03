import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { BossView } from 'System/pinstance/boss/BossView'
 /**
 * 跨服boss时段活动
 */
export class KuaFuBossCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_CROSSSVRBOSS);
        this.data.setDisplayName('跨服魔王');
    }
    
    handleClick() {
        G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_CROSSSVRBOSS);
    }
}
