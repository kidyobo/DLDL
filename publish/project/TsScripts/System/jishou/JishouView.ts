import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { HuigouPanel } from "System/jishou/HuigouPanel";
import { JishouPanel } from "System/jishou/JishouPanel";
import { SellView } from 'System/jishou/SellView';
import { UILayer } from "System/uilib/CommonForm";
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { TabFormCommom } from "../uilib/TabFormCommom";


export enum EnumJiShouTab {
    Market = KeyWord.OTHER_FUNCTION_BACK,
    Sell = KeyWord.OTHER_FUNCTION_SALE,
    huigou = KeyWord.OTHER_FUNCTION_BUY_BACK,
}

export class JishouView extends TabFormCommom {
    private currencyTip: CurrencyTip;

    private openTab = 0;

    constructor() {
        super(KeyWord.ACT_FUNCTION_JISHOU, JishouPanel, SellView, HuigouPanel);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.JishouView;
    }

    protected initElements(): void {
        super.initElements();
        this.setTabGroupNanme(["购买", "出售", "回购"]);
        this.setTitleName("交易所");
        this.setFightActive(false);

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.getCurrencyTip());
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.getCloseButton(), this.onClickReturnBtn);
        this.addClickListener(this.elems.getElement("mask"), this.onClickReturnBtn);
    }
 
    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    _onBuyResponse(msg: Protocol.PPStoreBuy_Response) {
        let jishouPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_BACK) as JishouPanel;
        if (jishouPanel.isOpened) {
            jishouPanel._onBuyResponse(msg);
        }
    }

    _onStoreQueryResponse(msg: Protocol.PPStoreQuery_Response) {
        let jishouPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_BACK) as JishouPanel;
        if (jishouPanel.isOpened) {
            jishouPanel._onStoreQueryResponse(msg);
        }
    }

    _onStoreGetAllThingNumResponse(msg: Protocol.PPStoreGetAllThingNum_Response) {
        let jishouPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_BACK) as JishouPanel;
        if (jishouPanel.isOpened) {
            jishouPanel._onStoreGetAllThingNumResponse(msg);
        }
    }

    updataMoney(): void {
        let jishouPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_BACK) as JishouPanel;
        if (jishouPanel.isOpened) {
            jishouPanel.updataMoney();
        }
    }

    onMoneyChange() {
        this.currencyTip.updateMoney();
    }

    ///////////////////////////////////////出售////////////////////////////////////////////////
    
    updataSellView(type: number) {
        let sellView = this.getTabFormByID(KeyWord.OTHER_FUNCTION_SALE) as SellView;
        if (sellView.isOpened) {
            sellView.updataView(type);
        }
    }

    onMyStoreQueryResponse(msg: Protocol.PPStoreDispMy_Response) {
        let sellView = this.getTabFormByID(KeyWord.OTHER_FUNCTION_SALE) as SellView;
        if (sellView.isOpened) {
            sellView.onMyStoreQueryResponse(msg);
        }
    }

    onUpdateList(msg: Protocol.PPStoreSell_Response): void {
        let sellView = this.getTabFormByID(KeyWord.OTHER_FUNCTION_SALE) as SellView;
        if (sellView.isOpened) {
            sellView.onUpdateList(msg);
        }
    }

    onCanelResponse(msg: Protocol.PPStoreCancelMy_Response): void {
        let sellView = this.getTabFormByID(KeyWord.OTHER_FUNCTION_SALE) as SellView;
        if (sellView.isOpened) {
            sellView.onCanelResponse(msg);
        }
    }

    _onSellQueryResponse(msg: Protocol.PPStoreQuery_Response): void {
        let sellView = this.getTabFormByID(KeyWord.OTHER_FUNCTION_SALE) as SellView;
        if (sellView.isOpened) {
            sellView._onSellQueryResponse(msg);
        }
    }

    ///////////////////////////////////////回购////////////////////////////////////////////////

    onSellLimitDataChange() {
        let huigouPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_BUY_BACK) as HuigouPanel;
        if (huigouPanel.isOpened) {
            huigouPanel.onSellLimitDataChange();
        } 
    }

    ///////////////////////////////////////// 面板打开 /////////////////////////////////////////

    protected onOpen() {
        super.onOpen();

        let funcLimitData = G.DataMgr.funcLimitData;
        let idLen = this.tabIds.length;
        for (let i = 0; i < idLen; i++) {
            let funId = this.tabIds[i];
            // 先判断页签功能是否开启
            let isShow = funcLimitData.isFuncEntranceVisible(funId);
            // 再判断活动
            this.tabGroup.GetToggle(i).gameObject.SetActive(isShow);

            if (funId == this.openTab && !isShow) {
                // 指定的页签不能显示
                this.openTab = 0;
            }
        }
        
        this.switchTabFormById(this.openTab);
        this.onMoneyChange();
    }

    protected onClose() {
        super.onClose();

    }

    open(openTab = 0) {
        this.openTab = openTab;
        super.open();
    }

    private onClickReturnBtn() {
        this.close();
    }
}
