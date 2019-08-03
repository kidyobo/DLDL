import { EnumRewardState } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";

export class DoubleChargeData {

    static readonly MAX_REMAIN_TIME: number = 2;
    private _statusList: number[] = [];

    private _remainTime = 0;

    private _curChargeRMB: number = 0;

    get CurChargeRMB(): number {

        return this._curChargeRMB;
    }

    set CurChargeRMB(value: number) {

        this._curChargeRMB = value;
    }
    get RemainTime(): number {
        return this._remainTime;
    }

    set RemainTime(value: number) {
        this._remainTime = value;
    }

    onCfgReady(): void {
    }

    setInfo(res: Protocol.Charge_Rebate_Panel_Response) {
        this.RemainTime = res.m_ucLeftCount;

        //次数用完就不再刷新状态了
        if (res.m_ucLeftCount <= 0) return;
        this.updateStatusList(res.m_aiStatusList);
    }

    updateStatusList(statusList?: number[], chargeValue?: number) {
        if (chargeValue > 0) {
            let shopData = G.DataMgr.payData.ShopData;
            let index = 0;
            for (index; index < shopData.length; index++) {
                if (shopData[index].m_iChargeRMB == chargeValue) break;
            }

            this._statusList[index] = EnumRewardState.HasGot;
            return;
        }

        this._statusList.length = 0;
        for (let i = 0; i < statusList.length; i++) {
            switch (statusList[i]) {
                case 0:
                    this._statusList.push(EnumRewardState.NotReach);
                    break;
                case 1:
                    this._statusList.push(EnumRewardState.NotGot);
                    break;
                case 2:
                    this._statusList.push(EnumRewardState.HasGot);
                    break;
            }
        }
    }

    get StatusList() {
        return this._statusList;
    }

    canShow(): boolean {
        let tabStatus = G.DataMgr.activityData.getTabStatue(Macros.ICON_CHARGE_REBATE);
        return tabStatus.m_stTabStatusList[0] > 0;
    }

    hasReward(): boolean {
        let tabStatus = G.DataMgr.activityData.getTabStatue(Macros.ICON_CHARGE_REBATE);
        return tabStatus.m_stTabStatusList[1] > 0;
    }

    canUse(): boolean {
        return G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.ACT_FUNCTION_DOUBLE_CHARGE) && this.canShow();
    }
}
