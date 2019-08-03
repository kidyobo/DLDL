import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { JuBaoPenView } from 'System/activity/YunYingHuoDong/JuBaoPenView'

/**
* 聚宝盆
* @author
*/
export class JuBaoPenCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_JBP);
        this.data.setDisplayName('聚宝盆');
        this.data.checkActivityIds = [Macros.ACTIVITY_ID_JU_BAO_PENG];
    }

    onStatusChange() {
        if (G.DataMgr.activityData.jbpStatusValue != null) {
            let count = 0;
            let dataList = G.DataMgr.activityData.jbpStatusValue.m_stData;
            for (let item of dataList) {
                if (item.m_uiCfgID > 0 && item.m_ucStatus == 2) {
                    count++;
                    break;
                }
            }
            this.data.tipCount = count;
        } else {
            this.data.tipCount = 0;
        }
    }

    handleClick() {
        G.Uimgr.createForm<JuBaoPenView>(JuBaoPenView).open();
    }
}