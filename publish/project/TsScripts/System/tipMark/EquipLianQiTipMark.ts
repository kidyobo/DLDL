import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

export class EquipLianQiTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_ROLE_EQUIP];
        this.concernedFunctions = [KeyWord.OTHER_FUNCTION_EQUIPLQ];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_EQUIPLQ;
    }

    protected doCheck(): boolean {
        // 斩魔（附魔）
        if (G.DataMgr.equipStrengthenData.canZhanMoInAllEquip()) {
            return true;
        }
       
        return false;
    }

    get TipName(): string {
        return '装备附魔';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIPLQ);
    }
}