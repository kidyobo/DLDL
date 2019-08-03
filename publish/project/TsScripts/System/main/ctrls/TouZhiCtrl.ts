import { Global as G } from 'System/global'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { FuncBtnState } from 'System/constants/GameEnum'
import { TzjhGetView } from 'System/touzi/TzjhGetView'
import { ActivityData } from 'System/data/ActivityData'
import { VipView, VipTab } from 'System/vip/VipView';
import TouziView from '../../touzi/TouziView';
/**
 *投资
 *
 */
export class TouZhiCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_TOUZILICAI);
        this.data.setDisplayName('投资理财');
    }

    onStatusChange(): void {

        this.data.state = FuncBtnState.Invisible;
        let tzjhInfo = G.DataMgr.activityData.sevenDayFundData;
        let today = G.SyncTime.getDateAfterStartServer();

        //没有投资，
        if (tzjhInfo.m_ucNumber == 0) {//投资0种
            this.updateStatusNotTZ(today);
        } else {
            this.updateStatusHasTZ(today);
        }
    }

    private updateStatusNotTZ(today: number) {
        //大于7天，不显示
        if (today > Macros.MAX_JUHSA_ACT_DAY) {
            this.data.state = FuncBtnState.Invisible;
        } else {
            this.data.state = FuncBtnState.Normal;
        }
        this.data.tipCount = 0;
    }


    private updateStatusHasTZ(today: number) {
            if (G.DataMgr.activityData.sevenDayHaveTipMarkCanShow()) {
                this.data.tipCount = 1;
                this.data.state = FuncBtnState.Normal;
            } else {
                this.data.tipCount = 0;
                if (today > Macros.MAX_JUHSA_ACT_DAY) {
                    this.data.state = FuncBtnState.Invisible;
                    for (let i = 1; i <= ActivityData.sevenDayTypeCount; i++) {
                        let hasTZData = G.DataMgr.activityData.getSevenDayTZDataByType(i);
                        if (hasTZData != null && hasTZData.m_uiGetFlag != 127) {
                            this.data.state = FuncBtnState.Normal;
                            break;
                        }
                    }
                } else {
                    this.data.state = FuncBtnState.Normal;
                }
            }
    }

    handleClick() {
        // G.Uimgr.createForm<TzjhGetView>(TzjhGetView).open();
        G.Uimgr.createForm<TouziView>(TouziView).open();
    }
}
