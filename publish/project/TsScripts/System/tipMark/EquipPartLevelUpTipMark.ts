import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

export class EquipPartLevelUpTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [ Macros.CONTAINER_TYPE_ROLE_EQUIP];
        this.concernedCurrencys = [KeyWord.MONEY_TONGQIAN_ID];
    }

    protected doCheck(): boolean {
        //强化
        let isShow = G.DataMgr.equipStrengthenData.IsAllEquipExistCanLevelUp();
        return isShow;
    }

    get TipName(): string {
        return '装备升级';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIP_SLOTLVUP);
    }
}