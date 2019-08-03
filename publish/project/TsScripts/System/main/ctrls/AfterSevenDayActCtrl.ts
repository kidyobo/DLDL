import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'; 
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';
import { AfterSevenDayActView } from 'System/activity/fanLiDaTing/AfterSevenDayActView';
import { KaifuActivityData } from 'System/data/KaifuActivityData'
import { FuncBtnState } from 'System/constants/GameEnum'

/**
* 7日后7天活动
*/
export class AfterSevenDayActCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_7DAYACT);
        this.data.setDisplayName('7日活动');
      
    }

    onStatusChange() {
        if (G.DataMgr.kaifuActData.isShowLcflTipMark()//连冲返利
            || TipMarkUtil.sevenDayLeiChongReward(false)) {
            this.data.tipCount = 1;
        } else {
            this.data.tipCount = 0;
        }
        this.data.state = FuncBtnState.Shining;
    }


    handleClick() {
        G.Uimgr.createForm<AfterSevenDayActView>(AfterSevenDayActView).open();
    }


    get IconId(): number {
        let today = G.SyncTime.getDateAfterStartServer();
        let limitTaoZhuangConfig = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.OTHER_FUNCTION_7DAYACT_TAOZHUANG);
        let limitPetJiPanConfig = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.OTHER_FUNCTION_7DAYACT_PETJIPAN);
        //uts.log("  today  " + today + "  taozhuang   " + limitTaoZhuangConfig.m_ucStartDate + "    " + limitTaoZhuangConfig.m_ucEndDate);
        //uts.log("  today  " + today + "  pet   " + limitPetJiPanConfig.m_ucStartDate + "    " + limitPetJiPanConfig.m_ucEndDate);
        if (today >= limitTaoZhuangConfig.m_ucStartDate && today <= limitTaoZhuangConfig.m_ucEndDate) {
            return KeyWord.OTHER_FUNCTION_7DAYACT_TAOZHUANG;
        } else if (today >= limitPetJiPanConfig.m_ucStartDate && today <= limitPetJiPanConfig.m_ucEndDate){
            return KeyWord.OTHER_FUNCTION_7DAYACT_PETJIPAN;
        } else {
            return KeyWord.OTHER_FUNCTION_7DAYACT_PETJIPAN;
        }
    }
}
