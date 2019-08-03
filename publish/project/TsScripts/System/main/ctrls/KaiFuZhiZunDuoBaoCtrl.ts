import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { KaiFuZhiZunDuoBaoView } from 'System/activity/YunYingHuoDong/KaiFuZhiZunDuoBaoView'


/**
* 开服至尊夺宝
* @author
*/
export class KaiFuZhiZunDuoBaoCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_KF_ZZZD);
        this.data.setDisplayName('开服夺宝');
    }

    onStatusChange() {
        if (G.DataMgr.activityData.kfzzzdIsOpen) {
            this.data.state = FuncBtnState.Normal;
        }
        else {
            this.data.state = FuncBtnState.Invisible;
        }
    }

    handleClick() {
        G.Uimgr.createForm<KaiFuZhiZunDuoBaoView>(KaiFuZhiZunDuoBaoView).open();
    }
}