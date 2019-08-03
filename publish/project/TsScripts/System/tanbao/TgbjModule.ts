import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { TgbjData } from 'System/data/TgbjData'
import { ErrorId } from 'System/protocol/ErrorId'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TanBaoView } from "System/tanbao/TanBaoView"

/**
 * 天宫宝镜模块。
 *
 * 本文件代码由模板生成，你可能需要继续修改其他代码文件（比如EnumModuleName）才能正常使用。
 *
 * @author teppei
 *
 */
export class TgbjModule extends EventDispatcher {

    constructor() {
        super();

        this.addNetListener(Macros.MsgID_SkyLottery_Response, this._onSkyLotteryResponse);
    }


    private _onSkyLotteryResponse(msg: Protocol.SkyLottery_Response): void {
        let response: Protocol.SkyLottery_Response = msg;
        if (ErrorId.EQEC_Success != response.m_iResultID) {
            // 探宝失败
            // G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_iResultID));
        }
        else {
            let tgbjData: TgbjData = G.DataMgr.tgbjData;
            if (Macros.SKYLOTTERY_LIST_RECORD == response.m_ucType) {
                // 拉取探宝记录
                G.DataMgr.tgbjData.outTime = response.m_uiTimeOut;
                //今日累计抽奖次数
                let recordRsp: Protocol.SkyLotteryListRecordRsp = response.m_stValue.m_stListRecordRsp;
                G.DataMgr.tgbjData.totalNum = recordRsp.m_stSkyLotteryData.m_iLotteryDropTimes;
                G.DataMgr.tgbjData.freeNum = recordRsp.m_stSkyLotteryData.m_ucFreeTimes;
                G.DataMgr.tgbjData.flag = recordRsp.m_stSkyLotteryData.m_uiGiftFlag;
                if (Macros.SKYLOTTERY_SERVER_RECORD_TYPE == recordRsp.m_ucListType || Macros.SKYLOTTERY_SERVER_BUY_RECORD_TYPE == recordRsp.m_ucListType) {
                    // 幸运榜
                    // 过滤空数据
                    for (let i: number = recordRsp.m_astRecordList.length - 1; i >= 0; i--) {
                        if (0 == recordRsp.m_astRecordList[i].m_aiThingID) {
                            recordRsp.m_astRecordList.splice(i, 1);
                        }
                    }
                    tgbjData.updateAllRecord(recordRsp, response.m_ucLotterType);
                    //  this.dispatchEvent(Events.updateTgbjLotteryInfo);

                    let tanBaoView = G.Uimgr.getForm<TanBaoView>(TanBaoView);
                    if (tanBaoView != null) {
                        tanBaoView.updateAllRecord();
                    }
                }
                else {
                    // 探宝记录
                    if (defines.has('_DEBUG')) {
                        uts.assert(false, '自己的探宝记录是每次抽奖后维护的，不用拉取！');
                    }
                }
            }
            else if (Macros.SKYLOTTERY_OPERATE == response.m_ucType) {
                // 探宝操作
                G.DataMgr.tgbjData.outTime = response.m_uiTimeOut;
                let operateRsp: Protocol.SkyLotteryOperateRsp = response.m_stValue.m_stOperateRsp;
                tgbjData.addOneLotteryRecord(operateRsp, response.m_ucLotterType);
                G.DataMgr.tgbjData.totalNum = operateRsp.m_stSkyLotteryData.m_iLotteryDropTimes;
                G.DataMgr.tgbjData.freeNum = operateRsp.m_stSkyLotteryData.m_ucFreeTimes;
                G.DataMgr.tgbjData.flag = operateRsp.m_stSkyLotteryData.m_uiGiftFlag;
                // this.dispatchEvent(Events.tgbjLotteryCompelete);

                let tanBaoView = G.Uimgr.getForm<TanBaoView>(TanBaoView);
                if (tanBaoView != null) {
                    tanBaoView.onLotteryCompelete();
                }
            }
            else if (Macros.SKYLOTTERY_EXTRA_REWARD == response.m_ucType) {
                G.DataMgr.tgbjData.totalNum = response.m_stValue.m_stExtraRewardRsp.m_stSkyLotteryData.m_iLotteryDropTimes;
                G.DataMgr.tgbjData.freeNum = response.m_stValue.m_stExtraRewardRsp.m_stSkyLotteryData.m_ucFreeTimes;
                G.DataMgr.tgbjData.flag = response.m_stValue.m_stExtraRewardRsp.m_stSkyLotteryData.m_uiGiftFlag;
                //次数奖励
                let tanBaoView = G.Uimgr.getForm<TanBaoView>(TanBaoView);
                if (tanBaoView != null) {
                    tanBaoView.updateBox();
                }
            }
            else if (Macros.SKYLOTTERY_OPEN_PANEL == response.m_ucType) {
                G.DataMgr.tgbjData.freeNum = response.m_stValue.m_stPanel.m_stSkyLotteryData.m_ucFreeTimes;
                G.DataMgr.tgbjData.skyLotteryConfig = response.m_stValue.m_stPanel.m_stSkyLotteryItemCfgList;
                G.DataMgr.tgbjData.lotteryExchangeCfg = response.m_stValue.m_stPanel.m_stExchangeItemCfgList;
                //次数奖励
                let tanBaoView = G.Uimgr.getForm<TanBaoView>(TanBaoView);
                if (tanBaoView != null) {
                    tanBaoView.updateLotteryZone();
                }
            }
        }
    }
}
