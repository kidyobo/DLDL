import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

/**
 * 圣印（紫极魔瞳）。
 */
export class ZhenFaTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.OTHER_FUNCTION_FAZHEN];
        this.concernedZhufuTypes = [KeyWord.HERO_SUB_TYPE_FAZHEN];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_FZJH;
    }

    protected doCheck(): boolean {
        return G.DataMgr.zhufuData.isShowZhuFuTipMark(KeyWord.HERO_SUB_TYPE_FAZHEN);
    }

    get TipName(): string {
        return '紫极魔瞳提升';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_FZQH);
    }
}