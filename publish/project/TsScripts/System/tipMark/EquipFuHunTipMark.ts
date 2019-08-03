import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { EquipFuHunPanel } from 'System/equip/EquipFuHunPanel'

export class EquipFuHunTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_ROLE_EQUIP];
        this.concernedFunctions = [KeyWord.OTHER_FUNCTION_EQUIP_WASH];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_EQUIP_WASH;
        this.sensitiveToEquipFuHun = true;
    }
    
    protected doCheck(): boolean {
        return !EquipFuHunPanel.isOpenedThisLanding;
    }

    get TipName(): string {
        return '装备洗炼';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIP_WASH);
    }
}