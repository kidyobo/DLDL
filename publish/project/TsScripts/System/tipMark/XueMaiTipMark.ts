import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

export class XueMaiTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.OTHER_FUNCTION_CRAZYBLOOD];
        this.sensitiveToXueMai = true;
        this.activeByFunc = KeyWord.OTHER_FUNCTION_CRAZYBLOOD;
    }

    protected doCheck(): boolean {
        return G.DataMgr.zhufuData.checkXueMaiCanUp();
    }

    get TipName(): string {
        return '神力提升';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_CRAZYBLOOD);
    }
}