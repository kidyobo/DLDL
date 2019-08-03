import { Global as G } from 'System/global'
import { ConfirmCheck } from 'System/tip/TipManager'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'

export class WangHouJiangXiangCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_WANGHOUJIANGXIANG);
        this.data.setDisplayName('能力叛乱');
    }

    onStatusChange() {
    }

    handleClick() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_WANGHOUJIANGXIANG);
    }
}