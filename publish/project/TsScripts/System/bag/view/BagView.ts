import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { TabForm } from "System/uilib/TabForm";
import { UIPathData } from "System/data/UIPathData";
import { PropertyView } from "System/hero/view/PropertyView";
import { ZhuFuBaseView } from 'System/hero/view/ZhuFuBaseView'
import { RideView } from "System/jinjie/view/RideView";
import { TitleView } from "System/hero/view/TitleView";
import { ArtifactView } from "System/jinjie/view/ArtifactView";
import { ZhenFaView } from "System/hero/view/ZhenFaView";
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ThingData } from 'System/data/thing/ThingData'
import { EnumGuide } from 'System/constants/GameEnum'
import { BagPanel } from 'System/bag/view/BagPanel'
import { StorePanel } from 'System/bag/view/StorePanel'
import { CurrencyTip } from 'System/uilib/CurrencyTip'


export enum EnumBagTab {
    bag = 1,
    store = 2,
}

//该面板为其他子面板的父面板
export class BagView extends TabForm implements IGuideExecutor {

    /** 背包开始的格子数量 */
    static DEFAULT_CAPACITY: number = 70;
    /** 背包最大格子数量 */
    static MAX_CAPACITY: number = 210;
    /** 仓库开始的格子数量*/
    static DEFAULT_CAPACITY_CK: number = 25;
    /** 仓库最大格子数量*/
    static MAX_CAPACITY_CK: number = 100;

    btnReturn: UnityEngine.GameObject;
    /**关闭*/
    private btnClose: UnityEngine.GameObject = null;
    private openTab: EnumBagTab;

    private openItemId: number = 0;
    private currencyTip: CurrencyTip;

    constructor() {
        super(KeyWord.BAR_FUNCTION_BAG, BagPanel, StorePanel);
        this._cacheForm = true;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.BagView;
    }

    protected initElements(): void {
        super.initElements();

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("currencyTip"));

        this.btnReturn = this.elems.getElement('btnReturn');
        this.btnClose = this.elems.getElement('btnClose');
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.btnReturn, this.onBtnReturn);
        this.addClickListener(this.btnClose, this.onBtnReturn);
    }

    protected onOpen() {
        super.onOpen();
        // 更新页签
        this.switchTabFormById(this.openTab, this.openItemId);

        this.updataMoney();
    }

    open(openTab: EnumBagTab = EnumBagTab.bag, itemId: number = 0) {
        this.openTab = openTab;
        this.openItemId = itemId;
        super.open();
    }



    /**
     * 关闭返回按钮
     */
    private onBtnReturn(): void {
        this.close();
    }

    updataView(type: number) {
        let bagPanel = this.getTabFormByID(EnumBagTab.bag) as BagPanel;
        let storePanel = this.getTabFormByID(EnumBagTab.store) as StorePanel;

        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            if (bagPanel.isOpened) {
                bagPanel.updataBagView();
            }
            if (storePanel.isOpened) {
                storePanel.updataBagView();
            }
        } else if (type == Macros.CONTAINER_TYPE_ROLE_STORE) {
            if (bagPanel.isOpened) {
                bagPanel.updataBagView();
            }
            if (storePanel.isOpened) {
                storePanel.updataStoreView();
            }
        } else if (type == Macros.CONTAINER_TYPE_ROLE_EQUIP) {
            if (bagPanel.isOpened) {
                bagPanel.updataBagView();
            }
        }
    }

    updataMoney() {
        this.currencyTip.updateMoney();
        let bagPanel = this.getTabFormByID(EnumBagTab.bag) as BagPanel;
        if (bagPanel.isOpened) {
            bagPanel.updateMoney();
        }
    }

    getFirstBagItem(id: number): UnityEngine.GameObject {
        let bagPanel = this.getTabFormByID(EnumBagTab.bag) as BagPanel;
        if (bagPanel.isOpened) {
            return bagPanel.getFirstBagItem(id);
        }
        return null;
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.UseItem_ClickClose == step) {
            this.onBtnReturn();
            return true;
        }
        return false;
    }
}
export default BagView;