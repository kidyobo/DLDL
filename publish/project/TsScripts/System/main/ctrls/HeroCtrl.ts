import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { HeroView } from 'System/hero/view/HeroView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

export class HeroCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_ROLE);
        this.data.setDisplayName('角色');
    }
    onStatusChange() {
        let tipMark = G.GuideMgr.tipMarkCtrl;
        this.data.tipCount = (
            /**tipMark.rebirthEquipSuitTipMark.ShowTip || tipMark.rebirthTipMark.ShowTip || tipMark.rebirthSkillTipMark.ShowTip || tipMark.rebirthEquipTipMark.ShowTip || tipMark.mountTipMark.ShowTip || tipMark.juYuanTipMark.getJuYuanTip() || tipMark.juYuanTipMark.ShowTip || tipMark.shenQiTipMark.ShowTip|| tipMark.wingTipMark.ShowTip*/
            // TipMarkUtil.shiZhuangQHTip() > 0||
            G.DataMgr.thingData.isLingbaoTipmark()||//灵宝
            TipMarkUtil.chengHao() ||//称号培养
            G.DataMgr.jiuXingData.canLevelUpJiuXing() || G.DataMgr.jiuXingData.canLevelUpSkill()||//玄天功
            tipMark.zhenFaTipMark.ShowTip ||//紫极魔瞳
            tipMark.moFangTipMark.ShowTip ||//控鹤擒龙
            tipMark.shenJiTipMark.ShowTip||//战力成长
            G.DataMgr.fightTipData.isOnOpen) ? 1 : 0;//鬼影迷踪
    }

    handleClick() {
        G.Uimgr.createForm<HeroView>(HeroView).open();
    }
}