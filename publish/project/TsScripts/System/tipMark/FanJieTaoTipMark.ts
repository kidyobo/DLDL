import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

/**
 * 凡界套。
 */
export class FanJieTaoTipMark extends BaseTipMark {
    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_FANXIAN, KeyWord.OTHER_FUNCTION_FANXIAN_FANJIE];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_FANXIAN_FANJIE;
    }

    protected doCheck(): boolean {
        return TipMarkUtil.fanXianTaoCanActive(KeyWord.SLOT_SUIT_TYPE_1);
    }

    get TipName(): string {
        return '凡界套装';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_FANXIAN_FANJIE);
    }
}