import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { MergeView } from 'System/mergeActivity/MergeView'
import { Macros } from 'System/protocol/Macros'

 /**
 * 活动大厅
 */
export class MergeCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_MREGE);
        this.data.setDisplayName('合服活动');
    }

    onStatusChange() {
        let mergeTime = G.SyncTime.getDateAfterMergeServer();
        //合服前3天显示
        if (mergeTime > 0 && mergeTime <= Macros.MAX_MERGE_ACTIVITY_OPEN_DAYS) {
            this.data.state = FuncBtnState.Normal;
            let hfhdData = G.DataMgr.hfhdData;
            if (hfhdData.isShow3DaySignTipMark() || hfhdData.isShow3DayLeiChongTipMark() ||
                hfhdData.isShow3DayXiaoFeiTipMark() || hfhdData.isShowZhaoCaiMaoTipMark())
            {
                this.data.tipCount = 1;
            } else {
                this.data.tipCount = 0;
            }
        } else {
            this.data.state = FuncBtnState.Invisible;
        }
       
    }
    
    handleClick() {
        G.Uimgr.createForm<MergeView>(MergeView).open();
    }
}
