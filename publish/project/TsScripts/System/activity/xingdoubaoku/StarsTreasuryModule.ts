import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { ErrorId } from 'System/protocol/ErrorId'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { StarsTreasuryView } from "System/activity/xingdoubaoku/StarsTreasuryView";

/**
 * 星斗抽奖模块。
 *
 * 本文件代码由模板生成，你可能需要继续修改其他代码文件（比如EnumModuleName）才能正常使用。
 *
 * @author teppei
 *
 */
export class StarsTreasuryModule extends EventDispatcher {

    constructor() {
        super();
        this.addNetListener(Macros.MsgID_StarLottery_Response, this.onStarLotteryResponse);
    }

    /**
     * 星斗宝库抽奖回复
     * @param msg
     */
    private onStarLotteryResponse(msg: Protocol.StarLottery_Response): void {
        if (ErrorId.EQEC_Success != msg.m_iResultID) {
            // 探宝失败
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(msg.m_iResultID));
        }
        else {
            if (msg.m_ucType == Macros.STAR_LOTTERY_PANEL) {
                //星空宝库面板
                this.starPanel(msg.m_stValue.m_stPanel);
            }
            else if (msg.m_ucType == Macros.STAR_LOTTERY_OPERATE) {
                //星空宝库抽奖操作
                this.starOperate(msg.m_stValue.m_stOperateRsp);
            }
            else if (msg.m_ucType == Macros.STAR_LOTTERY_LIST_RECORD) {
                //星空宝库查询抽奖记录
                this.starListRecore(msg.m_stValue.m_stListRecordRsp);
            }
            else if (msg.m_ucType == Macros.STAR_LOTTERY_GET_TOP_PRIZE) {
                //星斗宝库领取头奖
                this.starGetTopPrize(msg.m_stValue.m_stTopPrizeRsp);
            }
            else if (msg.m_ucType == Macros.STAR_LOTTERY_CHOOSE_TOP_PRIZE) {
                this.starSelectedTopPrizeCfg(msg.m_stValue.m_stChooseTopPrizeRsp);
            }
            else if (msg.m_ucType == Macros.STAR_LOTTERY_TOP_PRIZE_CFG) {
                //星斗宝获取头奖奖励配置
                this.starGetTopPrizeCfg(msg.m_stValue.m_stTopPrizeCfgRsp);
            }
            else if (msg.m_ucType == Macros.STAR_LOTTERY_HONGBAO_HISTORY) {
                //星斗宝获取头奖奖励配置
                this.starHongbaoRankCfg(msg.m_stValue.m_stHongBaoHistoryHistoryRsp);
            }
            else if (msg.m_ucType == Macros.STAR_LOTTERY_HONGBAO_ENTRY) {
                //星斗宝获红包分红
                G.DataMgr.starsData.applyChange(1);
                let starsView = G.Uimgr.getForm<StarsTreasuryView>(StarsTreasuryView);
                if (starsView != null && starsView.isOpened)
                    starsView.applyChange();

                G.ActBtnCtrl.update(false);
            }
            else if (msg.m_ucType == Macros.STAR_LOTTERY_SERVER_COST_NOTIFY) {
                //星斗宝获全服金额
                this.starServerCost(msg.m_stValue.m_uiServerCost);
            }
        }
    }

    /**
     * 星空宝库面板打开
     * @param msg
     */
    private starPanel(msg: Protocol.StarLotteryPanel) {
        G.DataMgr.starsData.openPanel();
        G.DataMgr.starsData.applyChange(msg.m_ucHongBaoEntry);
        G.DataMgr.starsData.diamondChange(msg.m_uiRoleCost);
        G.DataMgr.starsData.freeTimeChange(msg.m_uiNexFreeTime);

        G.DataMgr.starsData.setlotteryConfig(msg);

        let starsView = G.Uimgr.getForm<StarsTreasuryView>(StarsTreasuryView);
        if (starsView != null && starsView.isOpened) {
            starsView.starPanelResponse();
            starsView.applyChange();
        }
        G.ActBtnCtrl.update(false);
    }
    /**
     * 星空宝库抽奖操作
     * @param msg
     */
    private starOperate(msg: Protocol.StarLotteryOperateRsp) {
        G.DataMgr.starsData.diamondChange(msg.m_uiRoleCost);
        G.DataMgr.starsData.freeTimeChange(msg.m_uiNexFreeTime);

        let starsView = G.Uimgr.getForm<StarsTreasuryView>(StarsTreasuryView);
        if (starsView != null && starsView.isOpened)
            starsView.starOperateResponse(msg);

        G.ActBtnCtrl.update(false);
    }
    /**
     * 星空宝库查询抽奖记录
     * @param msg
     */
    private starListRecore(msg: Protocol.StarLotteryListRecordRsp) {
        let starsView = G.Uimgr.getForm<StarsTreasuryView>(StarsTreasuryView);
        if (starsView != null && starsView.isOpened)
            starsView.starListRecoreResponse(msg);
    }
    /**
     * 星斗宝库领取头奖
     * @param msg
     */
    private starGetTopPrize(msg: Protocol.StarLotteryGetTopPrizeRsp) {
        let starsView = G.Uimgr.getForm<StarsTreasuryView>(StarsTreasuryView);
        if (starsView != null && starsView.isOpened)
            starsView.starGetTopPrizeResponse(msg);
    }

    /**
     * 星斗宝库获取选择头奖信息
     * @param msg
     */
    private starGetTopPrizeCfg(msg: Protocol.StarLotteryTopPrizeCfgRsp) {
        let starsView = G.Uimgr.getForm<StarsTreasuryView>(StarsTreasuryView);
        if (starsView != null && starsView.isOpened)
            starsView.starGetTopPrizeCfgResponse(msg);
    }

    /**
     * 星斗宝库选择头奖信息之后
     * @param msg
     */
    private starSelectedTopPrizeCfg(msg: Protocol.StarLotteryChooseTopPrizeRsp) {
        let starsView = G.Uimgr.getForm<StarsTreasuryView>(StarsTreasuryView);
        if (starsView != null && starsView.isOpened)
            starsView.starChooseTopPrizeResponse(msg);
    }

    /**
     * 星斗宝库红包排行信息
     * @param msg
     */
    private starHongbaoRankCfg(msg: Protocol.StarLotteryRankHistoryRsp) {
        let starsView = G.Uimgr.getForm<StarsTreasuryView>(StarsTreasuryView);
        if (starsView != null && starsView.isOpened) {
            G.DataMgr.starsData.diamondChange(msg.m_uiCost);
            starsView.starHongbaoRankCfgResponse(msg);
        }
    }

    /**
     * 星斗宝库总消费
     * @param num
     */
    private starServerCost(num: number) {
        let starsView = G.Uimgr.getForm<StarsTreasuryView>(StarsTreasuryView);
        if (starsView != null && starsView.isOpened)
            starsView.starServerCost(num);
    }
}
