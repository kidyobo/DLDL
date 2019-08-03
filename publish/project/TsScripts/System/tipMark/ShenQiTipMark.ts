import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

/**
 * 神器。
 */
export class ShenQiTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.OTHER_FUNCTION_WHJH];
        this.concernedZhufuTypes = [KeyWord.HERO_SUB_TYPE_WUHUN];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_WHJH;
    }

    protected doCheck(): boolean {
        return G.DataMgr.zhufuData.isShowZhuFuTipMark(KeyWord.HERO_SUB_TYPE_WUHUN);
    }

    get TipName(): string {
        return '武魂提升';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_WHJH);
    }
}