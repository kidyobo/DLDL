import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

export class WingTipMark extends BaseTipMark {
    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_ROLE_EQUIP];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_EQUIP_ENHANCE, KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL, KeyWord.OTHER_FUNCTION_EQUIP_WASH, KeyWord.OTHER_FUNCTION_EQUIP_MOUNT];
        this.concernedZhufuTypes = [KeyWord.HERO_SUB_TYPE_YUYI];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_YYQH;
    }

    protected doCheck(): boolean {
        return G.DataMgr.zhufuData.isShowZhuFuTipMark(KeyWord.HERO_SUB_TYPE_YUYI);
    }

    get TipName(): string {
        return '翅膀提升';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_YYQH);
    }
}