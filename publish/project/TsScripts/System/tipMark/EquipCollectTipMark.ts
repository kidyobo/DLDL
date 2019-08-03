import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

export class EquipCollectTipMark extends BaseTipMark {

    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_HUNGU_EQUIP];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_REBIRTH, KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION;
        this.sensitiveToEquipCollect = true;
    }

    protected doCheck(): boolean {
        ////装备收集
        //if (G.DataMgr.equipStrengthenData.getEquipCollectCurrentCanActiveStage()) {
        //    //G.NoticeCtrl.checkEquipCollect();
        //    return true;
        //} else {
        //    return false;
        //}

        return G.DataMgr.hunliData.hunGuCollectTipMark();
    }

    get TipName(): string {
        return '魂骨收集';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION);
    }
}