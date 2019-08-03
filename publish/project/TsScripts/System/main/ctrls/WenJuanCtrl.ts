import { wenjuanData } from 'System/data/activities/wenjuanData';
import { WenJuanView } from 'System/activity/wenjuandiaocha/WenJuanView';
import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
export class WenJuanCtrl extends BaseFuncIconCtrl {
    constructor() {
        super(KeyWord.ACT_FUNCTION_WENJUAN);
        this.data.setDisplayName('调查问卷');
    }
    onStatusChange() {
        if (G.DataMgr.wenjuanData.isFirstJoin(1<<Macros.SURVEY_GIFT)&&G.DataMgr.wenjuanData.isShow) {
                this.data.state = FuncBtnState.Normal;
        }else{
            this.data.state = FuncBtnState.Invisible;
        }
    }

    handleClick() {
        if (!G.ActionHandler.checkCrossSvrUsable(true)) {
            return;
        }
        G.Uimgr.createForm<WenJuanView>(WenJuanView).open();
    }
}