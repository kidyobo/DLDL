import { Global as G } from 'System/global'
import { StringUtil } from "System/utils/StringUtil"
import { KeyWord } from "System/constants/KeyWord"
import { MathUtil } from "System/utils/MathUtil"
import { FuLiDaTingView } from "System/activity/fldt/FuLiDaTingView"
import { VipData } from "System/data/VipData"

export class LeiJiRechargeData {

    private REBATE_HALL_RECHARGE_BEGING_DAY: number = 8;

    /**累计充值*/
    ljczInfo: Protocol.LJCZInfo;

    //当月累计充值
    monthLjcaNum: number;

    curCzNum: number;

    static isOneOpen = false;

    /**
     * 获取累计充值可领取数量
     * @param	is8_14day   是否检查8~14天
     * @return
     */
    getLjczCount(is8_14day: boolean): number {
        let count: number = 0;
        if (this.ljczInfo) {
            if (is8_14day && (this.ljczInfo.m_iType == KeyWord.LJCZ_TYPE_START && this.ljczInfo.m_iDay < this.REBATE_HALL_RECHARGE_BEGING_DAY)) {
                return count;
            }
            let kfljRechargeCfgArr = G.DataMgr.firstRechargeData.getSclbConfArrByTDL(KeyWord.GIFT_TYPE_LC,this.ljczInfo.m_iType, this.ljczInfo.m_iDay);
            if (kfljRechargeCfgArr) {
                for (let config of kfljRechargeCfgArr) {
                    let isGet: boolean = MathUtil.checkPosIsReach(config.m_ucLevel - 1, this.ljczInfo.m_usGetBitMap);

                    let canGet: boolean = this.ljczInfo.m_uiLJZCValue >= config.m_uiRechargeLimit;
                    if (!isGet && canGet) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    updateLjczData(m_stOpenLJCZPanelRsp: Protocol.LJCZInfo): void {
        this.ljczInfo = m_stOpenLJCZPanelRsp;
    }

    //当月累计充值
    updateMonthLjcaData(MonthLjcaDataNum:number ):void 
    {
        this.monthLjcaNum = MonthLjcaDataNum;
        if (this.monthLjcaNum >= 30000 && G.AppCfg.Plat == KeyWord.PLAT_FORM_TYPE_ZIYUN && !VipData.isOldSvip) {
            VipData.isOldSvip = true;
            G.Uimgr.createForm<FuLiDaTingView>(FuLiDaTingView).open(KeyWord.OTHER_FUNCTION_CJVIP);
        }
    }

    //本次充值

    updateCurCzNum(_curCzNum:number ): void 
    {
        this.curCzNum = _curCzNum;
        if (G.AppCfg.Plat != KeyWord.PLAT_FORM_TYPE_ZIYUN)
            return;

        if (this.ljczInfo.m_uiLJZCValue >= 6480 && !VipData.isOldSvip)
        {
            VipData.isOldSvip = true;
            G.Uimgr.createForm<FuLiDaTingView>(FuLiDaTingView).open(KeyWord.OTHER_FUNCTION_CJVIP);
            return;
        }

        if ((this.curCzNum >= 980 || G.DataMgr.heroData.curChargeMoney >= 980) && !VipData.isOldSvip)
        {
            if (LeiJiRechargeData.isOneOpen == false)
            {
                LeiJiRechargeData.isOneOpen = true;
                G.Uimgr.createForm<FuLiDaTingView>(FuLiDaTingView).open(KeyWord.OTHER_FUNCTION_CJVIP);
            }
            
        }
    }

  

}