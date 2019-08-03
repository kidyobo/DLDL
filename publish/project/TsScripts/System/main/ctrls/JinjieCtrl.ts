import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { JinjieView } from 'System/jinjie/view/JinjieView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { EquipUtils } from 'System/utils/EquipUtils'

export class JinjieCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_IMPROVE);
        this.data.setDisplayName('进阶');
    }
    onStatusChange() {
        let tipMark = G.GuideMgr.tipMarkCtrl;
        if (tipMark.wingEquipJingLianTipMark.ShowTip || G.DataMgr.zhufuData.isShowZhuFuTipMark(KeyWord.HERO_SUB_TYPE_ZUOQI)
            || G.DataMgr.zhufuData.isShowZhuFuTipMark(KeyWord.HERO_SUB_TYPE_WUHUN)
            || TipMarkUtil.shiZhuangQHTip() > 0 || null != EquipUtils.getFirstCanDressPyInfo() || EquipUtils.canSaijiDressActive()) {
            this.data.tipCount = 1;
        } else {
            this.data.tipCount = 0;
        }
    }

    handleClick() {
        G.Uimgr.createForm<JinjieView>(JinjieView).open();
    }
}