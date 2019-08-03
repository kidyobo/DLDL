import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { Macros } from 'System/protocol/Macros'
import { Global as G } from "System/global"
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { KeyWord } from 'System/constants/KeyWord'
import { TabForm } from "System/uilib/TabForm"
import { EnumGuide } from 'System/constants/GameEnum'
import { FanJieTaoPanel } from 'System/equip/FanJieTaoPanel'
import { XianJieTaoPanel } from 'System/equip/XianJieTaoPanel'
import { ShengLingPanel } from 'System/equip/ShengLingPanel'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'


/**父面板*/
export class FanXianTaoView extends TabForm implements IGuideExecutor {
    
    /**返回按钮*/
    btnClose: UnityEngine.GameObject = null;
    private openTabId = 0;

    constructor() {
        super(KeyWord.BAR_FUNCTION_FANXIAN, FanJieTaoPanel, XianJieTaoPanel, ShengLingPanel);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.FanXianTaoView;
    }
    protected initElements() {
        super.initElements();
        this.btnClose = this.elems.getElement("btnClose");
    }
    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnClose, this.close);
        this.addClickListener(this.elems.getElement("mask"), this.close);
    }
    protected onOpen() {
        super.onOpen();
        let cnt = this.tabIds.length;
        for (let i = 0; i < cnt; i++) {
            let isShow = G.DataMgr.funcLimitData.isFuncEntranceVisible(this.tabIds[i]);
            this.tabGroup.GetToggle(i).gameObject.SetActive(isShow);
        }
        this.switchTabFormById(this.openTabId);
        this.updataTipMark();
    }

    protected onClose() {
        super.onClose();
    }

    open(openTabId = 0) {
        this.openTabId = openTabId;
        super.open();
    }
    
    updataTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_FANXIAN_FANJIE, TipMarkUtil.fanXianTaoCanActive(KeyWord.SLOT_SUIT_TYPE_1));
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_FANXIAN_XIANJIE, TipMarkUtil.fanXianTaoCanActive(KeyWord.SLOT_SUIT_TYPE_2));
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_FANXIAN_SHENGLING, TipMarkUtil.shengLianCanUpLv());
    }
    
   

   



    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        //if (EnumGuide.EquipEnhance_ClickClose == step || EnumGuide.EquipSlotLvUp_ClickClose == step ||
        //    EnumGuide.EquipUpLevel_ClickClose == step || EnumGuide.ShenZhuangShouJi_ClickClose == step) {
        //    this.close();
        //    return true;
        //}
        return false;
    }
}
