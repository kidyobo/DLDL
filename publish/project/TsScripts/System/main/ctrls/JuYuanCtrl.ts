import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { JuYuanView } from 'System/juyuan/JuYuanView'

export class JuYuanCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_JU_YUAN);
        this.data.setDisplayName('神力');
    }

    onStatusChange() {
        this.data.state = G.GuideMgr.tipMarkCtrl.juYuanTipMark.ShowTip ? FuncBtnState.Shining : FuncBtnState.Normal;
        if (G.GuideMgr.tipMarkCtrl.juYuanTipMark.ShowTip) {
            this.data.tipCount = 1;
        } else {
            this.data.tipCount = 0;
        }
       
    }

    handleClick() {
        G.Uimgr.createForm<JuYuanView>(JuYuanView).open();
    }
}