import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState, EnumGuide } from 'System/constants/GameEnum'
import { FuLiDaTingView } from 'System/activity/fldt/FuLiDaTingView'
import { LvUpGiftGuider } from 'System/guide/cases/LvUpGiftGuider'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

/**福利大厅*/
export class FuLiDaTingCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_FLDT);
        this.data.setDisplayName('福利大厅');
        this.data.subTabs = /*FuLiDaTingView.FUNC_IDS*/[];
    }

    onStatusChange() {
        // 首先检查签到
        let activityData = G.DataMgr.activityData;
        let kfhdData = G.DataMgr.kfhdData;

        if (TipMarkUtil.dailySign() || // 每日签到
            TipMarkUtil.onlineGift() || // 领在线礼包
            TipMarkUtil.levelGift() || // 升级礼包
            TipMarkUtil.ziYuanZhaoHui() || // 资源找回
            TipMarkUtil.jiHuoMa()) { //激活码
            this.data.tipCount = 1;
        } else {
            this.data.tipCount = 0;
        }
    }

    handleClick() {
        let guider = G.GuideMgr.getCurrentGuider(EnumGuide.LvUpGift) as LvUpGiftGuider;
        let openTab = 0;
        if (null != guider) {
            openTab = KeyWord.OTHER_FUNCTION_SJLB;
        }
        G.Uimgr.createForm<FuLiDaTingView>(FuLiDaTingView).open(openTab);
    }
}
