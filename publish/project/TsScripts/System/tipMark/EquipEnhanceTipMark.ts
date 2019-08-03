import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

export class EquipEnhanceTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_ROLE_EQUIP];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_EQUIP_ENHANCE, KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE;
    }

    protected doCheck(): boolean {
        //强化
        let equipData = G.DataMgr.equipStrengthenData.getCanStrengthEquip(1);
        if (equipData != null)
            return equipData.length > 0;
        else
            return false;
    }

    get TipName(): string {
        return '装备强化';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE);
    }
}