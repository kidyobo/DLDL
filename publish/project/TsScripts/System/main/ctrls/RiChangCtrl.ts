import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { RiChangView } from 'System/richang/RiChangView'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

/**
* 日常
*/
export class RiChangCtrl extends BaseFuncIconCtrl {
    constructor() {
        super(KeyWord.ACT_FUNCTION_DAILY);
        this.data.setDisplayName('日常');
    }
    onStatusChange() {
        this.data.tipCount = (G.DataMgr.taskRecommendData.RedTipCount>0 || TipMarkUtil.saiJiViewTipMark())?1:0;
    }
    handleClick() {
        G.Uimgr.createForm<RiChangView>(RiChangView).open();
    }
}
