import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { BossView } from 'System/pinstance/boss/BossView'
 /**
 * 世界boss时段活动
 */
export class WorldBossCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_WORLDBOSS);
        this.data.setDisplayName('世界魔王');
    }
    
    handleClick() {
        G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_WORLDBOSS);
    }
}
