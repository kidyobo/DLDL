import { TipMarkCtrl } from 'System/tipMark/TipMarkCtrl';
import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { NewYearActView } from 'System/activity/view/NewYearActView'
import { Macros } from 'System/protocol/Macros'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'


export class NewYearActCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_YUNYINGHUODONG1);
        this.data.setDisplayName('新春狂欢');
        //this.data.checkActivityIds = [Macros.ACTIVITY_ID_GRBOSS,/* Macros.ACTIVITY_ID_KFNS,*/ Macros.ACTIVITY_ID_COLLECT_EXCHANGE,
        //  Macros.ACTIVITY_ID_SPRING_LOGIN, Macros.ACTIVITY_ID_SPRING_CHARGE, Macros.ACTIVITY_ID_DAILY_LOTTERY, Macros.ACTIVITY_ID_CHARGE_REBATE];
    }
    onStatusChange() {
        let checkActivityIds: number[] = [Macros.ACTIVITY_ID_GRBOSS,/* Macros.ACTIVITY_ID_KFNS,*/
            Macros.ACTIVITY_ID_SPRING_LOGIN, Macros.ACTIVITY_ID_SPRING_CHARGE, Macros.ACTIVITY_ID_QMHD,
            Macros.ACTIVITY_ID_HJXN_CHARGE, Macros.ACTIVITY_ID_COLLECT_EXCHANGE,Macros.ACTIVITY_ID_SDBX,Macros.ACTIVITY_ID_JU_BAO_PENG];

        let hideState = false;
        for (let i = 0; i < checkActivityIds.length; i++) {
            if (G.DataMgr.activityData.isActivityOpen(checkActivityIds[i])) {
                hideState = true;
                break;
            } 
        }
        if (!hideState) {
            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            let data = G.DataMgr.activityData.newYearData.kfnsInfo;
            if (data != null) {
                let time = Math.max(0, data.m_uiActEndTime - now);
                if (time > 0) {
                    hideState = true;
                }
                else {
                    hideState = false;
                }
            }
        }

        if (hideState) {
            this.data.state = FuncBtnState.Normal;
        }
        else {
            this.data.state = FuncBtnState.Invisible;
        }


        if (TipMarkUtil.geRenBossTipMark()
            || TipMarkUtil.kuaFuNianShouTipMark()
            || TipMarkUtil.collectExchange()
            || TipMarkUtil.qmhqTipMark()
            || TipMarkUtil.cjhdljcz()
            || G.DataMgr.activityData.newYearData.isChunJieLoginTipMark()
            || G.DataMgr.activityData.isCZZKCanGetRewardCount() > 0
            || TipMarkUtil.ceremonyBoxTipMark()
            || TipMarkUtil.jubaoTipmark()
        ) {
            this.data.tipCount = 1;
        }
        else {
            this.data.tipCount = 0;
        }
    }

    handleClick() {
        if (!G.ActionHandler.checkCrossSvrUsable(true)) {
            return;
        }
        G.Uimgr.createForm<NewYearActView>(NewYearActView).open();
    }
}