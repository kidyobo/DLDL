import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

export class RebirthEquipSuitTipMark extends BaseTipMark {
    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_HUNGU_EQUIP];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_REBIRTH];
        this.activeByFunc = KeyWord.BAR_FUNCTION_REBIRTH;
        this.concernedCurrencys = [KeyWord.MONEY_ID_HUNLI];
        this.sensitiveToRebirth = true;
    }

    protected doCheck(): boolean {
        return TipMarkUtil.isHunhuanActive();
        /*G.DataMgr.equipStrengthenData.canWearBetterRebirthEquip();*/
       
    }

    get TipName(): string {
        return '魂环提升';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNHUAN);
    }
}