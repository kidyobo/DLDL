import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { XianShiTeMaiView } from 'System/activity/view/XianShiTeMaiView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { EnumStoreID, FuncBtnState } from 'System/constants/GameEnum'

 /**
 * 限时特卖
 */
export class XianShiTeMaiCtrl extends BaseFuncIconCtrl {
    /**本次登录仅显示一次红点*/
    private needTip = true;

    constructor() {
        super(KeyWord.ACT_FUNCTION_XIANSHITEMAI);
        this.data.setDisplayName('限时特卖');
    }

    onStatusChange() {
        let d = G.SyncTime.getDateAfterStartServer();
        let npcSellData = G.DataMgr.npcSellData;
        if (npcSellData.XianShiTeMaiDays.indexOf(d) >= 0) {
            let tipCount = 0;
            if (this.needTip) {
                let itemDatas = G.DataMgr.npcSellData.getMallListByType(EnumStoreID.XianShiTeMai);
                for (let itemData of itemDatas) {
                    if (itemData.sellLimitData.sellLimitConfig.m_iStartTime == d && itemData.sellLimitData.getRestCount() > 0) {
                        tipCount = 1;
                        break;
                    }
                }
            }
            this.data.tipCount = tipCount;
            this.data.state = FuncBtnState.Normal;
        } else {
            this.data.state = FuncBtnState.Invisible;
        }
    }
    
    handleClick() {
        G.Uimgr.createForm<XianShiTeMaiView>(XianShiTeMaiView).open();
        if (this.data.tipCount > 0) {
            // 刷新去掉红点
            this.needTip = false;
            G.ActBtnCtrl.update(false);
        }
    }
}
