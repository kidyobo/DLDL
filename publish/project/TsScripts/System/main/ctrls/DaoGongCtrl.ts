import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { JiuXingView } from 'System/jiuxing/JiuXingView'

export class DaoGongCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_JIUXING);
        this.data.setDisplayName('圣光');
    }

    onStatusChange() {
        this.data.tipCount = G.GuideMgr.tipMarkCtrl.daoGongTipMark.ShowTip ? 1 : 0;
    }

    handleClick() {
        G.Uimgr.createForm<JiuXingView>(JiuXingView).open();
    }
}