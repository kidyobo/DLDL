import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { ShengQiView } from 'System/shengqi/ShengQiView'

export class ShengQiCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_ANQI);
        this.data.setDisplayName('暗器');
    }

    onStatusChange() {
        this.data.tipCount = G.GuideMgr.tipMarkCtrl.shengQiTipMark.ShowTip ? 1 : 0;
    }

    handleClick() {
        G.Uimgr.createForm<ShengQiView>(ShengQiView).open();
    }
}