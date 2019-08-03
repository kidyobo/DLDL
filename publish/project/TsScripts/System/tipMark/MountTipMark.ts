﻿import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'

export class MountTipMark extends BaseTipMark {
    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG, Macros.CONTAINER_TYPE_ROLE_EQUIP];
        this.concernedFunctions = [KeyWord.BAR_FUNCTION_EQUIP_ENHANCE, KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL, KeyWord.OTHER_FUNCTION_EQUIP_WASH, KeyWord.OTHER_FUNCTION_EQUIP_MOUNT];
        this.concernedZhufuTypes = [KeyWord.HERO_SUB_TYPE_ZUOQI];
        this.activeByFunc = KeyWord.OTHER_FUNCTION_ZQJH;
    }

    protected doCheck(): boolean {
        return G.DataMgr.zhufuData.isShowZhuFuTipMark(KeyWord.HERO_SUB_TYPE_ZUOQI);
    }

    get TipName(): string {
        return '坐骑提升';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_ZQQH);
    }
}