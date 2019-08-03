import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { FuncBtnState } from 'System/constants/GameEnum'
import { ItemMergeView } from 'System/Merge/ItemMergeView'

export class ItemMergeCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.BAR_FUNCTION_HECHEN);
        this.data.setDisplayName('合成');
    }

    onStatusChange() {
        this.data.tipCount = G.GuideMgr.tipMarkCtrl.itemMergeTipMark.ShowTip ? 1 : 0;
    }

    handleClick() {
        G.Uimgr.createForm<ItemMergeView>(ItemMergeView).open();
    }
}