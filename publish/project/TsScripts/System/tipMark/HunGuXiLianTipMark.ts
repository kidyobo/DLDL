import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { HunGuXiLianPanel } from 'System/hungu/HunGuXiLianPanel';

export class HunGuXiLianTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_HUNGU_EQUIP];
        this.concernedFunctions = [KeyWord.OTHER_FUNCTION_HUNGU_WASH];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_HUNGU_WASH;
        this.sensitiveToHunGuXiLian = true;
    }
    
    protected doCheck(): boolean {
        return /*!HunGuXiLianPanel.isOpenedThisLanding &&*/ G.DataMgr.hunliData.hunGuXiLianData.hunGuXiLianTipMark();
    }

    get TipName(): string {
        return '魂骨洗炼';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGU_WASH);
    }
}