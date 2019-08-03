import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

/**
 * 升灵，凡 仙 的强化。
 */
export class ShengLingTipMark extends BaseTipMark {
  
    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_FANXIAN, KeyWord.OTHER_FUNCTION_FANXIAN_SHENGLING];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_FANXIAN_SHENGLING;
    }

    protected doCheck(): boolean {
        return TipMarkUtil.shengLianCanUpLv();
    }

    get TipName(): string {
        return '升灵套装';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_FANXIAN_SHENGLING);
    }
}