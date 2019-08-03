import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { UIPathData } from 'System/data/UIPathData'
import { EquipBasePanel } from 'System/equip/EquipBasePanel'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { EquipUtils } from 'System/utils/EquipUtils'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { HeroData } from 'System/data/RoleData'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { ThingData } from 'System/data/thing/ThingData'
import { VipData } from 'System/data/VipData'
import { AutoBuyInfo } from 'System/data/business/AutoBuyInfo'
import { EnumGuide } from 'System/constants/GameEnum'
import { Macros } from 'System/protocol/Macros'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { Constants } from 'System/constants/Constants'
import { Color } from 'System/utils/ColorUtil'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { IconItem, ArrowType } from 'System/uilib/IconItem'
import { MaterialItemData } from 'System/data/vo/MaterialItemData'
import { EquipEnhanceAttItemData } from 'System/data/thing/EquipEnhanceAttItemData'
import { EnumEquipRule } from 'System/data/thing/EnumEquipRule'
import { UIUtils } from 'System/utils/UIUtils'
import { UiElements } from 'System/uilib/UiElements'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { TipType } from 'System/constants/GameEnum'
import { List } from "System/uilib/List";
import { EquipView } from 'System/equip/EquipView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { BatBuyView } from "System/business/view/BatBuyView"
import { UIEffect, EffectType } from "System/uiEffect/UIEffect"
import { FanXianBasePanel } from 'System/equip/FanXianBasePanel'

/**
 * 凡界套面板
 */
export class FanJieTaoPanel extends FanXianBasePanel  {

    constructor() {
        super(KeyWord.OTHER_FUNCTION_FANXIAN_FANJIE);
    }


    protected initElements() {
        super.initElements();
    }

    protected initListeners() {
        super.initListeners();
       
    }

    protected onOpen() {
        super.onOpen();
    }

    protected onClose() {
        super.onClose();
    }



}



