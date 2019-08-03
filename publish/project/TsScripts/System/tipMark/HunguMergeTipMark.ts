import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { HunGuXiLianPanel } from 'System/hungu/HunGuXiLianPanel';
import { TipMarkUtil } from './TipMarkUtil';

export class HunguMergeTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.OTHER_FUNCTION_HUNGU_WASH];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_HUNGU_WASH;
        this.sensitiveToHunGuXiLian = true;
    }

    protected doCheck(): boolean {
        return TipMarkUtil.isHunguMergeShowTipMark();
    }

    get TipName(): string {
        return '魂骨升华';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGUN_MERGE);
    }
}