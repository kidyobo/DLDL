import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TipMarkUtil } from './TipMarkUtil';

/**魂骨升级
 */
export class HunGuShengJiTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_HUNGU_EQUIP];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_REBIRTH,KeyWord.OTHER_FUNCTION_HUNGU_SLOT_LVUP];
        this.concernedCurrencys = [KeyWord.MONEY_TONGQIAN_ID];
        this.activeByFunc = KeyWord.BAR_FUNCTION_REBIRTH;
    }

    protected doCheck(): boolean {
        return TipMarkUtil.isHunguSJShowTipMark();
    }

    get TipName(): string {
        return "魂骨升级";
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGU_SLOT_LVUP);
    }
}