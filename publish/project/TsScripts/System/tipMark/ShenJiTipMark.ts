import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

/**
 * 圣印。
 */
export class ShenJiTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.OTHER_FUNCTION_LLJH];
        this.concernedZhufuTypes = [KeyWord.HERO_SUB_TYPE_LEILING];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_LLJH;
    }

    protected doCheck(): boolean {
        return G.DataMgr.zhufuData.isShowZhuFuTipMark(KeyWord.HERO_SUB_TYPE_LEILING);
    }

    get TipName(): string {
        return '鬼影迷踪提升';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_LLJH);
    }
}