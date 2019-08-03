﻿import { Global as G } from 'System/global'
import { DataFormatter } from 'System/utils/DataFormatter'
import { KeyWord } from 'System/constants/KeyWord'
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { Color } from 'System/utils/ColorUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { TabSubForm } from 'System/uilib/TabForm'
import { UIUtils } from 'System/utils/UIUtils'
import { GroupList } from 'System/uilib/GroupList'
import { FixedList } from 'System/uilib/FixedList'
import { EquipUtils } from 'System/utils/EquipUtils'
import { ThingData } from 'System/data/thing/ThingData'
import { Macros } from 'System/protocol/Macros'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { IconItem, ArrowType } from 'System/uilib/IconItem'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TouZiBasePanel } from 'System/touzi/TouZiBasePanel'
import { VipTab } from 'System/vip/VipView';


/**
 *战力投资
 */
export class FightTZPanel extends TouZiBasePanel {

    constructor() {
        super(KeyWord.SEVEN_DAY_FUND_TYPE_3);//KeyWord.SEVEN_DAY_FUND_TYPE_3
    }

    protected resPath(): string {
        return UIPathData.TouZiItemPanel;
    }

    protected initElements(): void {
        super.initElements();
    }

    protected initListeners(): void {
        super.initListeners();
      
    }

    protected onOpen() {
        super.onOpen();
        this.tip1.SetActive(true);
    }

    protected onClose() {
        super.onClose();
    }

}

