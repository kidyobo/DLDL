import { Global as G } from 'System/global'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { KeyWord } from 'System/constants/KeyWord'
import { FuncBtnState, EnumKfhdBossType } from 'System/constants/GameEnum'
import { KaiFuHuoDongView } from 'System/activity/kaifuhuodong/KaiFuHuoDongView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { ActivityData } from 'System/data/ActivityData'
import { Macros } from 'System/protocol/Macros'

/**
 * 开服活动
 */
export class KaiFuHuoDongCtrl extends BaseFuncIconCtrl {
    constructor() {
        super(KeyWord.ACT_FUNCTION_KFHD);
        this.data.setDisplayName('开服活动');

    }

    onStatusChange() {
        if (TipMarkUtil.shouChongTuanGou()//首冲团购
            || G.DataMgr.kaifuActData.hasHongBaoYouLiToGet()
            || TipMarkUtil.sevenDayLeiChongReward(true)//7天累计充值
            || G.DataMgr.kaifuActData.isShowLcflTipMark()//连冲返利
            || TipMarkUtil.BossZhaoHuan()//BOSS召唤
            || (G.DataMgr.wenjuanData.isFirstJoin(1 << Macros.SURVEY_GIFT) && G.DataMgr.wenjuanData.isShow)
            || this.SevenGoalTipMark()//把7日目标的功能移到这里来了
            //|| this.jinJieRiTipMark//进节日
        ) {
            this.data.tipCount = 1;
        } else {
            this.data.tipCount = 0;
        }

        let curDay = G.SyncTime.getDateAfterStartServer();
        //开服第八天之后且奖励领完活动图标消失
        //if (curDay >= 8 && !G.DataMgr.kaifuActData.hasHongBaoYouLiToGet()) {
        //    this.data.state = FuncBtnState.Invisible;
        //}
        //else {
        //    this.data.state = FuncBtnState.Normal;
        //}
        if (curDay <= 8 /* || !G.DataMgr.kaifuActData.getCanReward() */) {
            this.data.state = FuncBtnState.Normal;
        }
        else {
            this.data.state = FuncBtnState.Invisible;
        }
    }


    handleClick() {
        G.Uimgr.createForm<KaiFuHuoDongView>(KaiFuHuoDongView).open();
    }

    /**进阶日相关*/
    private get jinJieRiTipMark() {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JJR_DUIHUAN)) {
            return false;
        }
        return G.DataMgr.kfhdData.canGetJinJieRiReward();
    }

    private SevenGoalTipMark(): boolean {
        for (let i = 0; i < 7; i++) {
            let showStatus = this.updateSubTabTipMark(i);
            if (showStatus) {
                return true;
            }
        }
        return false;
    }

    //tab页红点
    private updateSubTabTipMark(dayIndex: number): boolean {

        let RANK_TYPE_INDEX1 = G.DataMgr.kaifuActData.getKaifuChongbangType();
        //每日签到
        let allCanGetDay = G.DataMgr.activityData.kaifuSignData.canSignDay();
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_QTDLJ) && allCanGetDay.indexOf(dayIndex) >= 0) {
            return true;
        }
        //每日目标
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_7GOAL_DAILY) && G.DataMgr.activityData.needTipMark(Macros.ICON_FLDT, Macros.TAB_STATUS_2)) {
            //if (TipMarkUtil.dailyGoal(dayIndex + 1)) {
            return true;
        }
        //开服冲榜
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_7GOAL_KFCB) && G.DataMgr.kaifuActData.canGetKaiFuChongBang(RANK_TYPE_INDEX1[dayIndex])) {
            return true;
        }
        return false;
    }
}

