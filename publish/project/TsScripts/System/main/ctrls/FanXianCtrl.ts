import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { FanXianTaoView } from 'System/equip/FanXianTaoView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

export class FanXianCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_FANXIAN);
        this.data.setDisplayName('凡仙');
    }

    onStatusChange() {
        let tipMarkCtrl = G.GuideMgr.tipMarkCtrl;
        if (tipMarkCtrl.fanJieTaoTipMark.ShowTip || tipMarkCtrl.xianJieTaoTipMark.ShowTip ||
            tipMarkCtrl.shengLingTipMark.ShowTip || tipMarkCtrl.equipLianTiTipMark.ShowTip) {
            this.data.tipCount = 1;
        } else {
            this.data.tipCount = 0;
        }

        //let show = false;
        //for (let i = 0; i < TipMarkUtil.TaoZhuangTypes.length; i++) {
        //    if (!show) {
        //        show = TipMarkUtil.fanXianTaoCanActive(TipMarkUtil.TaoZhuangTypes[i]);
        //    }
        //}
        //if (!show) {
        //    show = TipMarkUtil.shengLianCanUpLv();
        //}
        //if (show) {
        //    this.data.tipCount = 1;
        //} else {
        //    this.data.tipCount = 0;
        //}
    }

    handleClick() {
        G.Uimgr.createForm<FanXianTaoView>(FanXianTaoView).open();
    }
}