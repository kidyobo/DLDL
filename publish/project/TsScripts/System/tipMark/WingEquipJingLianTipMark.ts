import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

export class WingEquipJingLianTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_ROLE_EQUIP];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_EQUIP_ENHANCE, KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN];
        this.concernedZhufuTypes = [KeyWord.HERO_SUB_TYPE_YUYI];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN;
    }

    protected doCheck(): boolean {
        return TipMarkUtil.isShowWingEquipStrengthTipMark();
    }

    get TipName(): string {
        return '羽翼提升';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN);
    }
}