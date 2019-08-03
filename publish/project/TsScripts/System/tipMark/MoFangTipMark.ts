import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

export class MoFangTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.OTHER_FUNCTION_MAGICCUBE];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_MAGICCUBE;
    }

    protected doCheck(): boolean {
        return G.DataMgr.magicCubeData.canLevelUp();
    }

    get TipName(): string {
        return '控鹤擒龙';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_MAGICCUBE);
    }
}