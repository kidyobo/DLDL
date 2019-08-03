import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { ItemMergeItemBasePanel } from 'System/Merge/ItemMergeItemBasePanel'

export class ItemMergeEquipPanel extends ItemMergeItemBasePanel {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_MERGE_EQUIP);
    }
    // [KeyWord.MERGER_CLASS1_PET, KeyWord.MERGER_CLASS1_EQUIP, KeyWord.MERGER_CLASS1_STRONG_ITEM];
    protected onOpen() {
        this.curTab = KeyWord.MERGER_CLASS1_EQUIP;
        super.onOpen();
    }
}