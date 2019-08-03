import { ActHomeView } from 'System/activity/actHome/ActHomeView';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';

/**
* 活动大厅
*/
export class ActHomeCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNC_ACTHOME);
        this.data.setDisplayName('竞技大厅');
        this.data.subTabs = ActHomeView.TABS;
    }

    onStatusChange() {
        let activityData = G.DataMgr.activityData;
        if (TipMarkUtil.siXiangDouShouChang() || TipMarkUtil.tianMingBang() ||
            TipMarkUtil.kuaFuZongMenZhan() || TipMarkUtil.KuaFu3V3Reward() ||
            TipMarkUtil.wangHouJiangXiang() || TipMarkUtil.hasKfLingDiReward()|| TipMarkUtil.biWuDaHui()) {
            this.data.tipCount = 1;
        }
        else {
            this.data.tipCount = 0;
        }
    }

    handleClick() {
        G.Uimgr.createForm<ActHomeView>(ActHomeView).open();
    }
}
