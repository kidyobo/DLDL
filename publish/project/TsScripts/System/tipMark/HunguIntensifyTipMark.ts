import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TipMarkUtil } from './TipMarkUtil';

/**魂骨封装
 */
export class HunguIntensifyTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_HUNGU_EQUIP];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_REBIRTH];
        this.activeByFunc = KeyWord.BAR_FUNCTION_REBIRTH;
    }

    protected doCheck(): boolean {
        return TipMarkUtil.isHunguFZShowTipMark();
    }

    get TipName(): string {
        return "魂骨封装";
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGUN_FZ);
    }
}