import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

/**
 * 仙界套。
 */
export class XianJieTaoTipMark extends BaseTipMark {
   
    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_FANXIAN, KeyWord.OTHER_FUNCTION_FANXIAN_XIANJIE];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_FANXIAN_XIANJIE;
    }

    protected doCheck(): boolean {
        return TipMarkUtil.fanXianTaoCanActive(KeyWord.SLOT_SUIT_TYPE_2);
    }

    get TipName(): string {
        return '仙界套装';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_FANXIAN_XIANJIE);
    }
}