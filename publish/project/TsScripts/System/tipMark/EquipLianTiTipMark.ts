import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

/**
 * 装备炼体
 */
export class EquipLianTiTipMark extends BaseTipMark {
  
    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_FANXIAN, KeyWord.OTHER_FUNCTION_EQUIP_LIANTI];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_EQUIP_LIANTI;
        this.concernedCurrencys = [KeyWord.MONEY_TONGQIAN_ID, KeyWord.MONEY_YUANBAO_ID];
        this.sensitiveToEquipLianti = true;
    }

    protected doCheck(): boolean {
        return TipMarkUtil.equipLianTi();
    }

    get TipName(): string {
        return '装备炼体';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIP_LIANTI);
    }
}