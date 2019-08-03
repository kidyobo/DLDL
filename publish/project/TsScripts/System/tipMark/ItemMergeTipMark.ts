import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { ItemMergeView } from 'System/Merge/ItemMergeView'
import { TipMarkUtil } from "System/tipMark/TipMarkUtil"

export class ItemMergeTipMark extends BaseTipMark {

    constructor() {
        super(false);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_ROLE_EQUIP, Macros.CONTAINER_TYPE_HUNGU_EQUIP];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_HECHEN];
        this.activeByFunc = KeyWord.BAR_FUNCTION_HECHEN;
        this.sensitiveToHeroLv = true;
    }

    protected doCheck(): boolean {
        for (let i = 0; i < ItemMergeView.TABS1.length; i++) {
            // 显示圆点
            let hasTip = G.DataMgr.equipStrengthenData.canItemMergeByType(ItemMergeView.TABS1[i])
                || TipMarkUtil.isShowWingEquipMergeTipMark()
                || TipMarkUtil.isHunguCreateShowTipMark();
            if (hasTip) {
                return true;
            }
        }
        return false;
    }

    get TipName(): string {
        return '合成提升';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_HECHEN);
    }
}