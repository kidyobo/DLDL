import { ActHomeView } from 'System/activity/actHome/ActHomeView';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';
import { ChongZhiKuangHuanView } from 'System/activity/newKaiFuAct/ChongZhiKuangHuanView';

/**
* 充值狂欢
*/
export class ChongZhiKHCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_CHONGZHIKUANGHUAN);
        this.data.setDisplayName('充值狂欢');
    }

    onStatusChange() {
        this.data.tipCount = TipMarkUtil.vipZhuanShuTipMark()? 1:0;
    }

    handleClick() {
        G.Uimgr.createForm<ChongZhiKuangHuanView>(ChongZhiKuangHuanView).open();
    }
}
