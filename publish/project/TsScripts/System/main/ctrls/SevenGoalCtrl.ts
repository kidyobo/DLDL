import { Global as G } from 'System/global'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { KeyWord } from 'System/constants/KeyWord'
import { ActivityData } from 'System/data/ActivityData'
import { Macros } from 'System/protocol/Macros'
import { FuncBtnState, EnumKfhdBossType } from 'System/constants/GameEnum'
import { SevenDayView } from 'System/activity/fldt/sevenDayLogin/SevenDayView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

/**
 * 七日目标
 */
export class SevenGoalCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_7GOAL);
        this.data.setDisplayName('七日目标');
        this.data.subTabs = /*SevenDayView.panelKeyWord*/[];
    }

    onStatusChange() {
        for (let i = 0; i < 7; i++) {
            let showStatus = this.updateSubTabTipMark(i);
            if (showStatus) {
                this.data.tipCount = 1;
                return;
            } 
        }
        this.data.tipCount = 0;
    }

    handleClick() {
        G.Uimgr.createForm<SevenDayView>(SevenDayView).open(KeyWord.OTHER_FUNCTION_7GOAL_KFCB);
    }




    //tab页红点
    private updateSubTabTipMark(dayIndex: number): boolean{

        let RANK_TYPE_INDEX1 = G.DataMgr.kaifuActData.getKaifuChongbangType();
        //每日签到
        let allCanGetDay = G.DataMgr.activityData.kaifuSignData.canSignDay();
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_QTDLJ) &&allCanGetDay.indexOf(dayIndex) >= 0) {
            return true;
        }
        //每日目标
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_7GOAL_DAILY)&&G.DataMgr.activityData.needTipMark(Macros.ICON_FLDT, Macros.TAB_STATUS_2)) {
        //if (TipMarkUtil.dailyGoal(dayIndex + 1)) {
            return true;
        }
        //开服冲榜
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_7GOAL_KFCB) &&G.DataMgr.kaifuActData.canGetKaiFuChongBang(RANK_TYPE_INDEX1[dayIndex])) {
            return true;
        }
        return false;
    }

}

