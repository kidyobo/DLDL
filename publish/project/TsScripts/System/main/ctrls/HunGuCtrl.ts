import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { HunGuView } from 'System/hungu/HunGuView'

export class HunGuCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_HUNGU);
        this.data.setDisplayName('魂骨');
    }

    onStatusChange() {
        let tipMarkCtrl = G.GuideMgr.tipMarkCtrl;
        this.data.tipCount = (
            tipMarkCtrl.rebirthEquipTipMark.ShowTip//魂骨装备
            || tipMarkCtrl.hunguIntensifyTipMark.ShowTip//封装
            || tipMarkCtrl.hunGuShengJiTipMark.ShowTip//升级
            || tipMarkCtrl.hunGuStrengTipMark.ShowTip//强化
            || tipMarkCtrl.hunGuXiLianTipMark.ShowTip
            || tipMarkCtrl.hunGuSkillTipMark.ShowTip
            // || tipMarkCtrl.hunguMergeTipMark.ShowTip//升华
        ) ? 1 : 0;
    }

    handleClick() {
        G.Uimgr.createForm<HunGuView>(HunGuView).open();
    }
}