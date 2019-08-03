import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { MessageBoxConst, ConfirmCheck} from 'System/tip/TipManager'
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { PriceBar } from "System/business/view/PriceBar";
import { NumInput } from "System/uilib/NumInput"
import { EnumStoreID } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";

export class MessageBox extends CommonForm {

    private readonly BtnTextRegExp: RegExp = /(.*)￥(\d+):(\d+)/;

    private info: UnityEngine.UI.Text = null;
    private toggleNoPrompt: UnityEngine.UI.ActiveToggle = null;
    private btnGos: UnityEngine.GameObject[] = [];
    private btnLabels: UnityEngine.UI.Text[] = [];
    private btnSLabels: UnityEngine.UI.Text[] = [];
    private btnCostGos: UnityEngine.GameObject[] = [];
    private textCosts: UnityEngine.UI.Text[] = [];
    private btnX: UnityEngine.GameObject;
    private bg1: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;
    //购买次数
    private buyCount: UnityEngine.GameObject;
    private buyInfo: UnityEngine.GameObject;
    private txtCost: UnityEngine.GameObject;
    private txtHas:UnityEngine.GameObject;
    private costBar: PriceBar;
    private hasBar: PriceBar;
    private m_currencyID: number = 0;
    numInput: NumInput;
    private isShowBuyCount: boolean;
    private btnMax:UnityEngine.GameObject;

    private content: string;
    private check: ConfirmCheck;
    private btnTextArr: string[];
    private btnCostIds: number[] = [];
    private btnCostNums: number[] = [];
    private callback: (state: MessageBoxConst, isCheckSelected: boolean) => void = null;
    private counter: number = 0;
    private defaultButton: number = 0;
    private showX = false;
    private readonly TABS: EnumStoreID[] = [EnumStoreID.MALL_YUANBAO, EnumStoreID.MALL_YUANBAOBIND];
    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.MessageBox;
    }
    protected resPath(): string {
        return UIPathData.MessageBox;
    }
    protected initElements() {
        this.info = this.elems.getText("infoText");
        let confirmBtn = this.elems.getElement("btnConfirm");
        let cancelBtn = this.elems.getElement("btnCancel");
        this.bg1 = this.elems.getElement("border1");
        this.bg2 = this.elems.getElement("border2");

        this.btnGos.push(confirmBtn, cancelBtn);
        this.btnLabels.push(ElemFinder.findText(confirmBtn, 'Text'), ElemFinder.findText(cancelBtn, 'Text'));
        this.btnSLabels.push(ElemFinder.findText(confirmBtn, 'TextS'), ElemFinder.findText(cancelBtn, 'TextS'));
        this.btnCostGos.push(ElemFinder.findObject(confirmBtn, 'cost'), ElemFinder.findObject(cancelBtn, 'cost'));
        this.textCosts.push(ElemFinder.findText(this.btnCostGos[0], 'textCost'), ElemFinder.findText(this.btnCostGos[1], 'textCost'));
        this.toggleNoPrompt = this.elems.getActiveToggle("toggle");
        this.toggleNoPrompt.isOn = false;
        this.btnX = this.elems.getElement('btnX');

        this.buyCount = this.elems.getElement('buyCount');

        this.hasBar = new PriceBar();
        this.hasBar.setComponents(ElemFinder.findObject(this.buyCount, 'txtHas/hasBar'));
        this.costBar = new PriceBar();
        this.costBar.setComponents(ElemFinder.findObject(this.buyCount, 'txtCost/costBar'));
        this.numInput = new NumInput();
        this.numInput.setComponents(ElemFinder.findObject(this.buyCount, 'buyInfo/numInput'));
        this.btnMax = ElemFinder.findObject(this.buyCount, 'buyInfo/btnMax');
       
        this.buyInfo = ElemFinder.findObject(this.buyCount, 'buyInfo');
        this.txtCost = ElemFinder.findObject(this.buyCount, 'txtCost/costBar');
        this.txtHas = ElemFinder.findObject(this.buyCount, 'txtHas');
    }
    protected initListeners() {
        this.addClickListener(this.btnGos[0], this.onClickConfirmBt);
        this.addClickListener(this.btnGos[1], this.onClickCancelBt);
        this.addClickListener(this.btnX, this.onClickBtnX);
        this.addClickListener(this.elems.getElement('mask'), this.onClickBtnX);
    }
   
    open(info: string, style: ConfirmCheck, btText: string, callback: (state: MessageBoxConst, isCheckSelected: boolean) => void = null, counter: number, defaultButton: number = 0, showX = false,isShowBuyCount=false) {
        this.content = info;
        this.check = style;
        this.defaultButton = defaultButton;
        this.btnTextArr = btText.split('|');
        let cnt = this.btnTextArr.length;
        this.btnCostIds.length = cnt;
        this.btnCostNums.length = cnt;
        for (let i = 0; i < cnt; i++) {
            let t = this.btnTextArr[i];
            let result = this.BtnTextRegExp.exec(t);
            if (null != result) {
                this.btnTextArr[i] = result[1];
                this.btnCostIds[i] = parseInt(result[2]);
                this.btnCostNums[i] = parseInt(result[3]);
            } else {
                this.btnCostIds[i] = 0;
                this.btnCostNums[i] = 0;
            }
        }
        this.counter = counter;
        this.callback = callback;
        this.showX = showX;
        this.isShowBuyCount = isShowBuyCount;
        super.open();
    }
    protected onOpen() {
        if (this.isShowBuyCount) {
           this.buyTimeClik();
        }
        this.info.text = this.content;//文本框的内容
        this.toggleNoPrompt.isOn = false;
        this.buyCount.SetActive(this.isShowBuyCount);
        //根据btText长度判断界面有几个按钮
        let btnCnt = this.btnTextArr.length;
        for (let i: number = 0; i < 2; i++) {
            if (i < btnCnt) {
                // 如果需要显示货币
                if (this.btnCostIds[i] > 0) {
                    this.textCosts[i].text = this.btnCostNums[i].toString();
                    this.btnCostGos[i].SetActive(true);
                    this.btnSLabels[i].text = this.btnTextArr[i];
                    this.btnSLabels[i].gameObject.SetActive(true);
                    this.btnLabels[i].gameObject.SetActive(false);
                } else {
                    this.btnCostGos[i].SetActive(false);
                    this.btnSLabels[i].gameObject.SetActive(false);
                    this.btnLabels[i].text = this.btnTextArr[i];
                    this.btnLabels[i].gameObject.SetActive(true);
                }
                this.btnGos[i].SetActive(true);
            }
            else {
                this.btnGos[i].SetActive(false);
            }
        }
        if (this.counter > 0) {
            //有倒计时 
            let textLabel: UnityEngine.UI.Text;
            if (this.btnCostIds[this.defaultButton] > 0) {
                textLabel = this.btnSLabels[this.defaultButton];
            } else {
                textLabel = this.btnLabels[this.defaultButton];
            }
            textLabel.text = uts.format('{0}({1})', this.btnTextArr[this.defaultButton], this.counter);
            this.addTimer("1", 1000, this.counter, this.onUpdateTimer);
        }
        if (this.check == ConfirmCheck.noCheck) {
            this.toggleNoPrompt.gameObject.SetActive(false);
        }
        else {
            this.toggleNoPrompt.gameObject.SetActive(true);
            if (ConfirmCheck.autoCheck == this.check) {
                this.toggleNoPrompt.SetOn();
            }
        }
        this.bg1.SetActive(this.showX);
        this.bg2.SetActive(!this.showX);
        this.btnX.SetActive(this.showX);
    }
    private onUpdateTimer(timer: Game.Timer) {
        let leftTime = this.counter - timer.CallCount;
        if (leftTime <= 0) {
            this.close();
            this.doCall(0 == this.defaultButton ? MessageBoxConst.yes : MessageBoxConst.no);
        } else {
            let textLabel: UnityEngine.UI.Text;
            if (this.btnCostIds[this.defaultButton] > 0) {
                textLabel = this.btnSLabels[this.defaultButton];
            } else {
                textLabel = this.btnLabels[this.defaultButton];
            }
            textLabel.text = uts.format('{0}({1})', this.btnTextArr[this.defaultButton], leftTime);
        }
    }

    protected onClose() {
    }

    private onClickConfirmBt() {
        //点击确定按钮
        G.AudioMgr.playBtnClickSound();
        this.close();
        this.doCall(MessageBoxConst.yes);
    }

    private onClickCancelBt() {
        //点击取消按钮
        G.AudioMgr.playBtnClickSound();
        this.close();
        this.doCall(MessageBoxConst.no);
    }

    onUpdateMoneyShow(prices:number): void {
        let price = this.getPrice(this.numInput.num,prices);
        this.costBar.setCurrencyID(this.m_currencyID, true);
        this.costBar.setPrice(price, 0 == G.ActionHandler.getLackNum(this.m_currencyID, price, false) ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH, null);
        this.hasBar.setCurrencyID(this.m_currencyID, true);
        this.hasBar.setPrice(G.DataMgr.getOwnValueByID(this.m_currencyID));
    }

    private onNumInputValueChanged(num: number, prices: number): void {
        // 更新总价
        let price: number = this.getPrice(num, prices);
        this.costBar.setPrice(price, 0 == G.ActionHandler.getLackNum(this.m_currencyID, price, false) ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH, null);
        this.hasBar.setPrice(G.DataMgr.getOwnValueByID(this.m_currencyID));
    }
    private getPrice(num: number, prices:number): number {
        let price: number = num * prices;
        return price;
    }
    private onClickBtnMax(): void {
        this.numInput.num = this.numInput.maxNum;
    }
    private buyTimeClik():void {
        //获取的 拥有的绑定元宝
        let ownYuanBaoBing = G.DataMgr.getOwnValueByID(KeyWord.MONEY_YUANBAO_BIND_ID);
        //获取的 购买一次需要的元宝数量
        let costYuanBao = G.DataMgr.constData.getValueById(KeyWord.BUY_PVPRANK_PRICE);
        //如果没获取到数据,return
        if (null == ownYuanBaoBing || null == costYuanBao) return;
        //购买一次需要的绑定元宝数量
        let costYuanBaoBing = costYuanBao;
        this.numInput.num = 1;
        let leftCount = 5 - G.DataMgr.heroData.myPPkRemindTimes;
        if (leftCount == 0) {
            this.numInput.setRange(1, 1, 1, this.numInput.num);
        } else {
            this.numInput.setRange(1, leftCount, 1, this.numInput.num);
        }
        let storeID: number;
        if (ownYuanBaoBing >= costYuanBaoBing) {
            this.numInput.onValueChanged = delegate(this, this.onNumInputValueChanged, costYuanBaoBing);
            storeID = this.TABS[1];
            this.m_currencyID = G.DataMgr.npcSellData.getExcIDByStoreID(storeID);
            this.onUpdateMoneyShow(costYuanBaoBing);
        } else {
            this.numInput.onValueChanged = delegate(this, this.onNumInputValueChanged, costYuanBao);
            storeID = this.TABS[0];
            this.m_currencyID = G.DataMgr.npcSellData.getExcIDByStoreID(storeID);
            this.onUpdateMoneyShow(costYuanBao);
       }
        Game.UIClickListener.Get(this.btnMax).onClick = delegate(this, this.onClickBtnMax);
        
    }
    private onClickBtnX() {
        // 点右上角xx，直接关闭界面，不做回调
        this.close();
        this.doCall(MessageBoxConst.x);
    }
    private doCall(choice: MessageBoxConst) {
        if (null != this.callback) {
            let isCheckSelected: boolean = this.toggleNoPrompt.isOn;
            let callback = this.callback;
            this.callback = null;
            callback(choice, isCheckSelected);
        }
    }
}

