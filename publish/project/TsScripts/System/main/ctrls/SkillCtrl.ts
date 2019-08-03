import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { SkillView } from 'System/skill/view/SkillView'

export class SkillCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_SKILL);
        this.data.setDisplayName('技能');
    }

    onStatusChange() {
        this.data.tipCount = G.GuideMgr.tipMarkCtrl.skillTipMark.ShowTip ? 1 : 0;
    }

    handleClick() {
        G.Uimgr.createForm<SkillView>(SkillView).open();
    }
}