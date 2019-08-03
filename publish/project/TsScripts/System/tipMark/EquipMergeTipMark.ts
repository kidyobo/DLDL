import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { ItemMergeView } from 'System/Merge/ItemMergeView'

/**
 * 装备合成（伙伴+祝福）
 */
export class EquipMergeTipMark extends BaseTipMark {
    private gotoPetTab: boolean = true;
    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_BEAUTY_EQUIP];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_BEAUTY, KeyWord.OTHER_FUNCTION_MRQH,
            
        ];
        this.sensitiveToPet = true;
        this.activeByFunc = KeyWord.BAR_FUNCTION_BEAUTY;
       

    }

    protected doCheck(): boolean {
        let isShow = false;
        let petData = G.DataMgr.petData;
        //if (G.DataMgr.equipStrengthenData.canItemMergeByType(KeyWord.MERGER_CLASS1_EQUIP)) {
        //    this.gotoPetTab = false;
        //    isShow= true;
        //} else

        if (!petData.isAllPetExistBetterEquip() && G.DataMgr.equipStrengthenData.canItemMergeByType(KeyWord.MERGER_CLASS1_PET)) {
            this.gotoPetTab = true;
            isShow = true;
        }
        return isShow;
    }

    get TipName(): string {
        return '装备合成';
    }

    action() {
        // 打开装备合成
        if (this.gotoPetTab) {
            G.Uimgr.createForm<ItemMergeView>(ItemMergeView).open(KeyWord.MERGER_CLASS1_PET);
        } else {
            G.Uimgr.createForm<ItemMergeView>(ItemMergeView).open(KeyWord.MERGER_CLASS1_EQUIP);
        }

      
    }
}