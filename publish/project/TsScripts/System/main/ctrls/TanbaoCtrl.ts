import { Global as G } from 'System/global'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { FuncBtnState } from 'System/constants/GameEnum'
import { TanBaoView } from 'System/tanbao/TanBaoView'
/**
 * 探宝
 *
 */
export class TanbaoCtrl extends BaseFuncIconCtrl {
    constructor() {
        super(KeyWord.ACT_FUNCTION_TGBJ);
        this.data.setDisplayName('魂骨抽奖');
    }
    onStatusChange() {
        let tgbjData = G.DataMgr.tgbjData;
        let num = G.DataMgr.thingData.getThingNum(TanBaoView.TGBJ_JBF, Macros.CONTAINER_TYPE_ROLE_BAG, false)+G.DataMgr.thingData.getThingNum(TanBaoView.HUNGU_BINGJBF, Macros.CONTAINER_TYPE_ROLE_BAG, false)+G.DataMgr.thingData.getThingNum(TanBaoView.HUNGU_JBF, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        this.data.tipCount = ((tgbjData.isCanGetReward() || tgbjData.isHasCount() || num >= 1) == true ? 1 : 0);
    }

    handleClick() {
        G.Uimgr.createForm<TanBaoView>(TanBaoView).open();
    }
}
