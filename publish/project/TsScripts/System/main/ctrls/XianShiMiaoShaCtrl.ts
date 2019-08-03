import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { XianShiMiaoShaView } from 'System/activity/YunYingHuoDong/XianShiMiaoShaView'
import { Macros } from 'System/protocol/Macros'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'



export class XianShiMiaoShaCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNC_XHMS);
        this.data.setDisplayName('限时秒杀');
        this.data.checkActivityIds = [Macros.ACTIVITY_ID_RUSH_PURCHASE];

    }
    onStatusChange() {
        //let data = G.DataMgr.activityData.sbcjData;
        //if (data == null)
        //    return;
        //if (G.DataMgr.activityData.canGetShenBingRew()) {
        //    this.data.tipCount = 1;
        //}
        //else {
        //    this.data.tipCount = 0;
        //}
    }

    handleClick() {
        G.Uimgr.createForm<XianShiMiaoShaView>(XianShiMiaoShaView).open();
    }
}