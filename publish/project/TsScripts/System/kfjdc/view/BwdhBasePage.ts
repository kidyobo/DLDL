import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { EnumBwdhPage } from 'System/kfjdc/BiWuDaHuiPanel'
import { BuffData } from 'System/data/BuffData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'

export abstract class BwdhBasePage extends TabSubForm {

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleCommonRequest(Macros.CROSS_SINGLE_OPEN));
        this.onBiWuDaHuiChange(0);
    }

    abstract onActDataChange(id: number);
    abstract onBiWuDaHuiChange(opType: number);
}