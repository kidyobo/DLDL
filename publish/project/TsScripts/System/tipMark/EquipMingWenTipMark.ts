import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

export class EquipMingWenTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_ROLE_EQUIP];
        this.concernedFunctions = [KeyWord.OTHER_FUNCTION_EQUIP_MOUNT];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_EQUIP_MOUNT;
        this.sensitiveToRebirth = true;
    }

    protected doCheck(): boolean {
        //宝石
        if (G.DataMgr.equipStrengthenData.isCanInsertOrReplaceDiamond()) {
            return true;
        }
       
        return false;
    }

    get TipName(): string {
        return '魔石镶嵌';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIP_MOUNT);
    }
}