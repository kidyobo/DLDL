import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

export class FanLiDaTingTipMark extends BaseTipMark {

    constructor() {
        super(false);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.ACT_FUNC_FLDT];
        this.concernedCurrencys = [KeyWord.MONEY_YUANBAO_ID];
        this.activeByFunc = KeyWord.ACT_FUNC_FLDT;
    }

    protected doCheck(): boolean {

        if (TipMarkUtil.leiChongFanLi() || TipMarkUtil.dailyLeiJiChongZhi() || G.DataMgr.activityData.jjrExchangeCanGetCount() > 0 || G.DataMgr.activityData.txExchangeCanGetCount() > 0) {
            return true;
        }
        return false;
    }

    get TipName(): string {
        return '';
    }

    action() {
      
    }
}