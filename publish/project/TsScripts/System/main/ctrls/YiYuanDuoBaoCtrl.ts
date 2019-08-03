import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { YiYuanDuoBaoView } from 'System/activity/YunYingHuoDong/YiYuanDuoBaoView'
import { GameIdDef } from 'System/channel/GameIdDef'
/**
* 一元夺宝
*/
export class YiYuanDuoBaoCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_YIYUANDUOBAO);
        this.data.setDisplayName('一元夺宝');
        this.data.needBg = false;
    }

    onStatusChange() {
        let time = 1531324800000;
        if (G.SyncTime.getCurrentTime() >= time) {
            this.data.state = FuncBtnState.Invisible;
            return;
        }

        this.data.state = FuncBtnState.Normal;
        let data = G.DataMgr.activityData.kfYiYuanDuoBaoData;
        if (data != null) {
            if (data.m_ucGetStatus == Macros.CHARGE_AWARD_WAIT_GET) {
                this.data.tipCount = 1;
            } else {
                this.data.tipCount = 0;
            }
        }
    }

    handleClick() {
        let time = 1531324800000;
        if (G.SyncTime.getCurrentTime() >= time) {
            this.data.state = FuncBtnState.Invisible;
            return;
        }
        G.Uimgr.createForm<YiYuanDuoBaoView>(YiYuanDuoBaoView).open();
    }
}