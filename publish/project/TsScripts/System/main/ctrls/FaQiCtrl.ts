import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { FaQiView } from 'System/faqi/FaQiiView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

export class FaQiCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_FAQI);
        this.data.setDisplayName('领域');
    }

    onStatusChange() {
        //uts.log(TipMarkUtil.faQi() +'  TipMarkUtil.faQi()');
        this.data.tipCount = TipMarkUtil.faQi() ? 1 : 0;
    }

    handleClick() {
        G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_FAQI);
    }
}