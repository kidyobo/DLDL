import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

export class DaoGongTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_JIUXING];
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.sensitiveToDaoGong = true;
        this.activeByFunc = KeyWord.BAR_FUNCTION_JIUXING;
    }

    protected doCheck(): boolean {
        return G.DataMgr.jiuXingData.canLevelUpJiuXing() || G.DataMgr.jiuXingData.canLevelUpSkill();
    }

    get TipName(): string {
        return '玄天功';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_JIUXING);
    }
}