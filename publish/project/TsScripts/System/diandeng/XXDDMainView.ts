import { EnumXXDDRule } from 'System/constants/GameEnum'
import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { TabForm } from "System/uilib/TabForm"
import { UIPathData } from "System/data/UIPathData"
import { KeyWord } from 'System/constants/KeyWord'
import { XXDDLightPanel } from 'System/diandeng/XXDDLightPanel'
import { XXDDRankPanel } from 'System/diandeng/XXDDRankPanel'
import { CurrencyTip } from 'System/uilib/CurrencyTip'
import { MainView } from "System/main/view/MainView";

/**
 *星星点灯/跨服点灯
 *
 */
export class XXDDMainView extends TabForm {

    private openTab: number = EnumXXDDRule.LIGHT_TAB;
    private currencyTip: CurrencyTip;

    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;


    constructor() {
        super(KeyWord.ACT_FUNCTION_DDL, XXDDLightPanel, XXDDRankPanel);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.XXDDMainView;
    }

    protected initElements(): void {
        super.initElements();
        this.mask = this.elems.getElement("mask");
        this.btnClose = this.elems.getElement("btnClose");

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("CurrencyTip"));
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.mask, this.onBtnClose);
        this.addClickListener(this.btnClose, this.onBtnClose);
    }
    //EnumXXDDRule.RANK_TAB
    open(openTab: EnumXXDDRule = EnumXXDDRule.LIGHT_TAB, openParam: any = null) {

        this.openTab = openTab;
        super.open();
    }

    protected onOpen() {
        super.onOpen();
        G.ViewCacher.mainView.setViewEnable(false);
        // 更新页签
        this.switchTabFormById(this.openTab);
        //更新魂币
        this.onUpdateMoney();
    }

    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
    }

    private onBtnClose() {
        this.close();
    }

  

    updateXXDDLightInfo(data: Protocol.DDLOpenPanelRsp) {
        let xxLightPanel = this.getTabFormByID(EnumXXDDRule.LIGHT_TAB) as XXDDLightPanel;
        if (xxLightPanel.isOpened) {
            xxLightPanel.updateView(data);
        }
    }

    updateXXDDRankInfo(data: Protocol.DDLOpenRankPanelRsp) {
        let xxRankPanel = this.getTabFormByID(EnumXXDDRule.RANK_TAB) as XXDDRankPanel;
        if (xxRankPanel.isOpened) {
            xxRankPanel.updateXXDDRankInfo(data);
        }

        let xxLightPanel = this.getTabFormByID(EnumXXDDRule.LIGHT_TAB) as XXDDLightPanel;
        if (xxLightPanel.isOpened) {
            xxLightPanel.updateReachRewardInfo(data);
        }
    }

    onServerOverDay() {
        let xxLightPanel = this.getTabFormByID(EnumXXDDRule.LIGHT_TAB) as XXDDLightPanel;
        if (xxLightPanel.isOpened) {
            xxLightPanel.onServerOverDay();
        }
    }

    onUpdateMoney() {
        if (this.currencyTip != null) {
            this.currencyTip.updateMoney();
        }
    }

}
