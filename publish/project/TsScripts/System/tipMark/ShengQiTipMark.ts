import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

/**
 * 宝物。
 */
export class ShengQiTipMark extends BaseTipMark {
    private isActive = false;
    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_ANQI];
        this.sensitiveToFabao = true;
        this.activeByFunc = KeyWord.BAR_FUNCTION_ANQI;
        this.concernedCurrencys = [KeyWord.MONEY_TONGQIAN_ID];
    }

    protected doCheck(): boolean {
        let fabaoData = G.DataMgr.fabaoData;
        let result = fabaoData.canAnyFabaoActiveOrUp();
        if (result == 1) {
            this.isActive = true;
            return true;
        }
        else {
            this.isActive = false;
            if (result == 2) {
                return true;
            }
            return false;
        }
    }

    get TipName(): string {
        return this.isActive ? '暗器激活' : '暗器提升';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_ANQI);
    }
}