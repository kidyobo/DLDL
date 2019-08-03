import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { BigSkillShowView, TeQuanBuyPanelType } from 'System/vip/BigSkillShowView'

export class ZuanShiTeQuanCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_DIAMONDS_VIP);
        this.data.setDisplayName('钻石VIP');
    }

    onStatusChange() {
        let stage_HuangJin = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_2);
        let stage_ZuanShi = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3);
        if (stage_HuangJin >= 0 && stage_ZuanShi < 0) {
            this.data.state = FuncBtnState.Normal;
        } else {
            this.data.state = FuncBtnState.Invisible;
        }
    }

    handleClick() {
        G.Uimgr.createForm<BigSkillShowView>(BigSkillShowView).open(TeQuanBuyPanelType.ZuanShi);
    }
}