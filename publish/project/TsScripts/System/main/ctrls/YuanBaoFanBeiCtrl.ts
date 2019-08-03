import { ActHomeView } from 'System/activity/actHome/ActHomeView';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'; 
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';
import { YuanBaoFanBeiView } from 'System/activity/newKaiFuAct/YuanBaoFanBeiView';

/**
* 元宝翻倍
*/
export class YuanBaoFanBeiCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_YUANBAOFANBEI);
        this.data.setDisplayName('元宝翻倍');
    }

    onStatusChange() {
        if (TipMarkUtil.yuanBaoFanBeiTipMark()) {
            this.data.tipCount = 1;
        }
        else {
            this.data.tipCount = 0;
        }
    }

    handleClick() {
        G.Uimgr.createForm<YuanBaoFanBeiView>(YuanBaoFanBeiView).open();
    }
}
