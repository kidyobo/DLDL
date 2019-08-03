import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

export class EquipUpLevelTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_ROLE_EQUIP];
        this.concernedFunctions = [KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL;
    }

    protected doCheck(): boolean {
        //进阶
        let upLevelEquip = G.DataMgr.equipStrengthenData.getCanUpLevelEquip(1);
        if (upLevelEquip != null) {
            if (upLevelEquip.length > 0) return true;
        }
       
        return false;
    }

    get TipName(): string {
        return '装备进阶';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL);
    }
}