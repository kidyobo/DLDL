import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { MainMarryView } from 'System/Marry/MainMarryView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'


export class MainMarryCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_XIANYUAN);
        this.data.setDisplayName('婚姻');
    }

    onStatusChange() {
        if (G.DataMgr.heroData.mateName != '') {
            this.data.tipCount = TipMarkUtil.HunYin() ? 1 : 0;
        } else {
            this.data.tipCount = 0;
        }   
    }

    handleClick() {
        G.Uimgr.createForm<MainMarryView>(MainMarryView).open();
    }
}