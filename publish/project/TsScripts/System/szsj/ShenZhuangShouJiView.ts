import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { EquipUpLevelPanel } from 'System/equip/EquipUplevelPanel'
import { EquipStrengPanel } from 'System/equip/EquipStrengPanel'
import { InsertDiamondPanel } from 'System/equip/InsertDiamondPanel'
import { EquipPartLevelUpPanel } from 'System/equip/EquipPartLevelUpPanel'
import { EquipZmPanel } from 'System/equip/EquipZmPanel'
import { Macros } from 'System/protocol/Macros'
import { Global as G } from "System/global"
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { KeyWord } from 'System/constants/KeyWord'
import { TabForm } from "System/uilib/TabForm"
import { EnumGuide } from 'System/constants/GameEnum'
import { EquipCollectPanel } from 'System/equip/EquipCollectPanel'
import { ShenZhuangShenQiPanel } from 'System/szsj/ShenZhuangShenQiPanel'
import { CurrencyTip } from 'System/uilib/CurrencyTip'

/**父面板*/
export class ShenZhuangShouJiView extends TabForm implements IGuideExecutor {

    /**返回按钮*/
    returnBt: UnityEngine.GameObject = null;
    private openTabId = 0;

    constructor() {
        //super(KeyWord.ACT_FUNCTION_SZSJ, EquipCollectPanel, ShenZhuangShenQiPanel);
        super(KeyWord.ACT_FUNCTION_SZSJ, EquipCollectPanel);

    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.ShenZhuangShouJiView;
    }
    protected initElements() {
        super.initElements();
        this.returnBt = this.elems.getElement("returnbt");
    }
    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.returnBt, this.close);
        this.addClickListener(this.elems.getElement("mask"), this.close);


    }
    protected onOpen() {
        super.onOpen();
        this.judgeFunctionHasOpen();
        this.switchTabFormById(this.openTabId);
        this.updateTabAngle();
    }

    protected onClose() {
        super.onClose();
        G.GuideMgr.processGuideNext(EnumGuide.ShenZhuangShouJi, EnumGuide.ShenZhuangShouJi_ClickClose);
    }

    open(openTabId = 0) {
        this.openTabId = openTabId;
        super.open();
    }

    /**检查功能是否开启*/
    private judgeFunctionHasOpen() {
        let idLen: number = this.tabIds.length;
        for (let i: number = 0; i < idLen; i++) {
            let funId: number = this.tabIds[i];
            this.tabGroup.GetToggle(i).gameObject.SetActive(0 == funId || G.DataMgr.funcLimitData.isFuncEntranceVisible(funId));
        }
    }
    updateView(type: number) {
        //刷新角标
        this.updateTabAngle();
    }
    onDressChange() {
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION) as EquipCollectPanel;
        if (view.isOpened) {
            view.onDressChange();
        }
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION, G.DataMgr.equipStrengthenData.getEquipCollectCurrentCanActiveStage());
    }



    /**更新小红点显示*/
    private updateTabAngle(): void {
        let len: number = this.getTabCount();
        for (let i = 0; i < len; i++) {
            let form = this.getTabFormByIndex(i);
            let panelId: number = form.Id;
            let ishow: boolean = false;
            if (panelId == KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION) {
                //收集
                ishow = G.DataMgr.equipStrengthenData.getEquipCollectCurrentCanActiveStage();
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_EQUIP_WASH) {
                //锻造
                //ishow = EquipFuHunPanel.isOpenedThisLanding == false;
            }
            // 显示圆点
            this.setTabTipMark(i, ishow);
        }
    }


    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.ShenZhuangShouJi_ClickClose == step) {
            this.close();
            return true;
        }
        return false;
    }
}
