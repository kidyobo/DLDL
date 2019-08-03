import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TipMarkUtil } from './TipMarkUtil';

export class HunguStrengTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_HUNGU_EQUIP];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_REBIRTH, KeyWord.OTHER_FUNCTION_HUNGUN_STRENG];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_HUNGUN_STRENG;
    }

    protected doCheck(): boolean {
        //强化
        return TipMarkUtil.isHunguStrengShowTipMark();
    }

    get TipName(): string {
        return '魂骨强化';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGUN_STRENG);
    }
}