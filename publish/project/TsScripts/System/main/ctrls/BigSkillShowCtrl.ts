import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { BigSkillShowView, TeQuanBuyPanelType } from 'System/vip/BigSkillShowView'

export class BigSkillShowCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_GOLD_VIP);
        this.data.setDisplayName('大招展示');
    }

    onStatusChange() {
        let stage = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_2);
        if (stage >= 0) {
            this.data.state = FuncBtnState.Invisible;
        } else {
            this.data.state = FuncBtnState.Normal;
        }
    }

    handleClick() {
        G.Uimgr.createForm<BigSkillShowView>(BigSkillShowView).open(TeQuanBuyPanelType.HuangJin);
    }
}