import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { EquipView } from 'System/equip/EquipView'

export class EnhanceCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_EQUIP_ENHANCE);
        this.data.setDisplayName('装备');
    }

    onStatusChange() {
        let tipMarkCtrl = G.GuideMgr.tipMarkCtrl;
        if ( tipMarkCtrl.equipEnhanceTipMark.ShowTip || tipMarkCtrl.equipFuHunTipMark.ShowTip || tipMarkCtrl.equipLianQiTipMark.ShowTip ||
            /*tipMarkCtrl.equipMingWenTipMark.ShowTip ||*/ tipMarkCtrl.equipUpLevelTipMark.ShowTip || tipMarkCtrl.equipPartLevelUpTipMark.ShowTip ||
            /*tipMarkCtrl.wingEquipJingLianTipMark.ShowTip ||*/ G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION) &&
            G.DataMgr.equipStrengthenData.getEquipCollectCurrentCanActiveStage()) {
            this.data.tipCount = 1;
        } else {
            this.data.tipCount = 0;
        }
    }

    handleClick() {
        G.Uimgr.createForm<EquipView>(EquipView).open();
    }
}