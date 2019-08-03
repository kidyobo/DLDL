import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { HunLiView } from 'System/hunli/HunLiView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { PetView } from 'System/pet/PetView'

export class HunLiCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_BEAUTY);
        this.data.setDisplayName('伙伴');
    }
    onStatusChange() {
        //魂力 魂骨 魂环
        //this.data.tipCount = (G.GuideMgr.tipMarkCtrl.rebirthTipMark.ShowTip
        //    || G.GuideMgr.tipMarkCtrl.rebirthEquipSuitTipMark.ShowTip
        //    || G.GuideMgr.tipMarkCtrl.rebirthEquipTipMark.ShowTip
        //    || G.GuideMgr.tipMarkCtrl.rebirthSkillTipMark.ShowTip) ? 1 : 0;
        //伙伴
        this.data.tipCount = (G.GuideMgr.tipMarkCtrl.petTipMark.ShowTipMarkOnPet || TipMarkUtil.petExpedition()) ? 1 : 0;
    }
    handleClick() {
        //G.Uimgr.createForm<HunLiView>(HunLiView).open();
        if (!G.ActionHandler.checkCrossSvrUsable(true, KeyWord.BAR_FUNCTION_BEAUTY)) {
            return;
        }
        G.Uimgr.createForm<PetView>(PetView).open();
    }
}