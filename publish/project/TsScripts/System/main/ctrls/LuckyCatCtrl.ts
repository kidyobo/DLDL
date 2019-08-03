import { LuckyCatView } from './../../activity/luckyCat/LuckyCatView';
import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'

export class LuckyCatCtrl extends BaseFuncIconCtrl {
    constructor() {
        super(KeyWord.ACT_FUNCTION_KF_ZHAOCAIMAO);
        this.data.setDisplayName('招财猫');
    }

    onStatusChange() {
        //招财猫增加开服天数限制
        let severDay = G.SyncTime.getDateAfterStartServer();
        let severLimit:boolean = false;
        let curLevel = G.DataMgr.heroData.curVipLevel;
        let needLevel:number = 0;
        if (G.DataMgr.luckyCatData.drawInfo[0]) {
            severLimit = (severDay >= G.DataMgr.luckyCatData.drawInfo[0].m_iStartDay&&severDay <= G.DataMgr.luckyCatData.drawInfo[0].m_iEndDay);
            needLevel = G.DataMgr.luckyCatData.drawInfo[0].m_uiVipLvel;
        }
        if (severLimit) {
            this.data.state = FuncBtnState.Normal;
        } else {
            this.data.state = FuncBtnState.Invisible;
        }
        //添加VIP限制
        let limt = curLevel >= needLevel;
        this.data.tipCount = G.DataMgr.luckyCatData.drawNeedPay <= G.DataMgr.heroData.gold && G.DataMgr.luckyCatData.drawNeedPay != -1 &&limt? 1 : 0;
    }

    handleClick() {
        G.Uimgr.createForm<LuckyCatView>(LuckyCatView).open();
    }
}