import { Global as G } from 'System/global'
import { ConfirmCheck } from 'System/tip/TipManager'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { FanLiDaTingView } from 'System/activity/fanLiDaTing/FanLiDaTingView'
import { Macros } from 'System/protocol/Macros'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { ActivityData } from 'System/data/ActivityData'

/**
* 返利大厅图标
* @author lyl
*/
export class FanLiDaTingCtrl extends BaseFuncIconCtrl {

    /**7天累计充值7天后的*/
    private readonly MaxDayLeiChong = 7;

    constructor() {
        super(KeyWord.ACT_FUNC_FLDT);
        this.data.setDisplayName('每日充值');
    }

    onStatusChange() {
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNC_FLDT)) {
            this.data.state = FuncBtnState.Normal;
        } else {
            this.data.state = FuncBtnState.Invisible;
        }
        if (this.fanLiDaTingTipMark || this.teHuiLiBaoTipMark || this.jinJieRiTipMark || this.XaiFeiFanLiTipMark
            || TipMarkUtil.DanBiChongZhiCanGet()//单笔充值
            || TipMarkUtil.XunHuanChongZhiCanGet()
            || TipMarkUtil.MeiRiLiBaoCanGet()) {
            this.data.tipCount = 1;
        } else {
            this.data.tipCount = 0;
        }
    }

    handleClick() {
        G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open();
    }

    /**累计充值相关*/
    private get fanLiDaTingTipMark() {
        let count = G.GuideMgr.tipMarkCtrl.fanLiDaTingTipMark.ShowTip ? 1 : 0;
        return count > 0;
    }

    /**特惠礼包*/
    private get teHuiLiBaoTipMark() {
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_KFHD_THLB)) {
            return G.DataMgr.kfhdData.teHuiLiBaoTipMark();
        } else {
            return false;
        }
    }

    /**进阶日相关*/
    private get jinJieRiTipMark() {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JJR_DUIHUAN_AFTER7DAY)) {
            return false;
        }
        return G.DataMgr.kfhdData.canGetJinJieRiReward();
    }

    /**每日礼包*/
    private get DailyGiftTipMark() {
        return G.DataMgr.vipData.getCanGetDailyGift();
    }

    /**消费返利*/
    private get XaiFeiFanLiTipMark() {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_XIAOFEIFANLI)) {
            return false;
        }
        return G.DataMgr.kaifuActData.isShowXFFLTipMark();
    }

    /**循环充值 */
    private get XunHuanChongZhiTipMark() {
        return TipMarkUtil.XunHuanChongZhiCanGet()//循环充值
    }

    private updateTouziTipMark() {
        return G.DataMgr.activityData.sevenDayHaveTipMarkCanShow();
    }

}