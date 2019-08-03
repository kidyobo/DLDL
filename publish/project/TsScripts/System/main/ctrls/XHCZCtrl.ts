import { XHCZView } from 'System/activity/view/XHCZView';
import { FuncBtnState } from 'System/constants/GameEnum';
import { KeyWord } from "System/constants/KeyWord";
import { Global as G } from 'System/global';
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl';
import { TipMarkUtil } from "System/tipMark/TipMarkUtil";
/**
 * 循环充值
 */
export class XHCZCtrl extends BaseFuncIconCtrl {
    constructor() {
        super(KeyWord.OTHER_FUNCTION_XUNHUANCHONGZHI);
        this.data.setDisplayName('循环充值');
    }

    onStatusChange() {
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_XUNHUANCHONGZHI)) {
            this.data.state = FuncBtnState.Normal;
        } else {
            this.data.state = FuncBtnState.Invisible;
        }
        if (TipMarkUtil.XunHuanChongZhiCanGet()) {
            this.data.tipCount = 1;
        } else {
            this.data.tipCount = 0;
        }
    }

    handleClick() {
        G.Uimgr.createForm<XHCZView>(XHCZView).open();
    }

}