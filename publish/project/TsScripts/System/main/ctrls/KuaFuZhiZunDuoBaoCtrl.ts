import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { KuaFuZhiZunDuoBaoView } from 'System/activity/YunYingHuoDong/KuaFuZhiZunDuoBaoView'

/**
* 跨服至尊夺宝
* @author
*/
export class KuaFuZhiZunDuoBaoCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_CROSS_ZZZD);
        this.data.setDisplayName('跨服夺宝');
        this.data.checkActivityIds = [Macros.ACTIVITY_ID_CROSS_ZZZD];
    }
    onStatusChange() {
        this.data.tipCount =  (G.DataMgr.activityData.isGetJojinReward&&G.DataMgr.firstRechargeData.scValue.m_uiSCValue == 1000)==true?1:0;
    }
    handleClick() {
        G.Uimgr.createForm<KuaFuZhiZunDuoBaoView>(KuaFuZhiZunDuoBaoView).open();
    }
}