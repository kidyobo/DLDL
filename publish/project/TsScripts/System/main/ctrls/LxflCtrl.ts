import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'


export class LxflCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_LXFL);
        this.data.setDisplayName('连续返利');
        this.data.checkActivityIds = [Macros.ACTIVITY_ID_LXFL];
    }
    onStatusChange() {
        let lxflData = G.DataMgr.activityData.lxflData;
        let bFlag: boolean = false;
        if (lxflData && lxflData.m_stDayList) {
            for (let i = 0; i < lxflData.m_stDayList.length; i++) {
                if (lxflData.m_stDayList[i].m_ucGetStatus == Macros.CHARGE_AWARD_WAIT_GET) {
                    bFlag = true;
                    break;
                }
            }
            if (!bFlag) {
                for (let i = 0; i < lxflData.m_stAccList.length; i++) {
                    if (lxflData.m_stAccList[i].m_ucGetStatus == Macros.CHARGE_AWARD_WAIT_GET) {
                        bFlag = true;
                        break;
                    }
                }
            }
        }

        this.data.tipCount = bFlag ? 1 : 0;
    }

    handleClick() {
        G.DataMgr.activityData.lxflFlag = true;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_LXFL, Macros.ACTIVITY_LXFL_OPEN));
    }
}