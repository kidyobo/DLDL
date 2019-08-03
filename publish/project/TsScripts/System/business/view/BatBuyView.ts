import { KaiFuHuoDongView } from './../../activity/kaifuhuodong/KaiFuHuoDongView';
import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { IconItem } from 'System/uilib/IconItem'
import { PriceBar } from 'System/business/view/PriceBar'
import { BeautyEquipListItemData } from 'System/data/vo/BeautyEquipListItemData'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { GroupList } from 'System/uilib/GroupList'
import { ElemFinder } from 'System/uilib/UiUtility'
import { TipFrom } from 'System/tip/view/TipsView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { EnumStoreID, EnumAutoUse } from 'System/constants/GameEnum'
import { NumInput } from 'System/uilib/NumInput'
import { KeyWord } from 'System/constants/KeyWord'
import { MarketItemData } from 'System/data/vo/MarketItemData'
import { CurrencyIcon } from 'System/uilib/CurrencyIcon'

export class BatBuyView extends CommonForm {

    /**最大数量。*/
    static readonly MAX_COUNT: number = 100;
    private readonly excGroups: number[] = [KeyWord.MONEY_YUANBAO_ID, KeyWord.MONEY_YUANBAO_BIND_ID];
    private readonly storeGroups: EnumStoreID[] = [EnumStoreID.MALL_YUANBAO, EnumStoreID.MALL_YUANBAOBIND];

    private btnClose: UnityEngine.GameObject;
    private iconItem: IconItem;
    private textName: UnityEngine.UI.Text;
    /**当前货币类型 0钻石 1绑钻*/
    private curGoldType: number;
    /**单价*/
    private singlePriceBar: PriceBar;
    /**总价*/
    private totalCostBar: PriceBar;
    /**拥有*/
    private hasBar: PriceBar;
    /**数量输入*/
    private numInput: NumInput;
    private btnMax: UnityEngine.GameObject;

    /**货币选择*/
    private chooseExcGo: UnityEngine.GameObject;
    private toggleGroupExc: UnityEngine.UI.ActiveToggleGroup;
    private toggleYuanbaoGo: UnityEngine.GameObject;
    private toggleYuanbaoBindGo: UnityEngine.GameObject;

    private btnBuy: UnityEngine.GameObject;

    private openId = 0;
    private openNumber = 0;
    private openStoreId: EnumStoreID = 0;
    private openAmount = 0;
    private openAutoUse = 0;
    private maxCount = 0;
    /**是否仅显示一种货币类型*/
    private openOnlyOneExcType: boolean = false;

    /**打开时要显示的商品。*/
    private m_openGoodsData: MarketItemData;

    /**当前选中的商店id*/
    private selectedStoreId: EnumStoreID = 0;
    private selectedExcId: number = 0;

    /**特权提示面板*/
    //private _cardTipPanel: VipCardTipPanel;
    private _cardCfg: GameConfig.MonthCardBaseM;
    private _cardDiscountCfg: GameConfig.CardDiscountCfgM;
    private _canBuyCount: number = 0;
    protected itemIcon_Normal: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    constructor() {
        super(0);
    }
    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.BatBuyView;
    }
    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.btnClose = this.elems.getElement('btnClose');
        this.mask = this.elems.getElement("mask");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement('icon'));
        this.iconItem.setTipFrom(TipFrom.normal);

        this.textName = this.elems.getText('textName');

        this.singlePriceBar = new PriceBar();
        this.singlePriceBar.setComponents(this.elems.getElement('singlePrice'));

        this.totalCostBar = new PriceBar();
        this.totalCostBar.setComponents(this.elems.getElement('totalCost'));

        this.hasBar = new PriceBar();
        this.hasBar.setComponents(this.elems.getElement('hasBar'));

        this.numInput = new NumInput();
        this.numInput.setComponents(this.elems.getElement('numInput'));
        this.numInput.onValueChanged = delegate(this, this.onNumInputValueChanged);
        this.btnMax = this.elems.getElement('btnMax');

        this.chooseExcGo = this.elems.getElement('chooseExc');
        this.toggleGroupExc = this.elems.getToggleGroup('toggleGroupExc');
        this.toggleYuanbaoGo = this.elems.getElement('toggleYuanbao');
        this.toggleYuanbaoBindGo = this.elems.getElement('toggleYuanbaoBind');

        this.btnBuy = this.elems.getElement('btnBuy');
    }
    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.mask, this.onClickBtnClose);
        this.addClickListener(this.btnMax, this.onClickBtnMax);
        this.addClickListener(this.btnBuy, this.onClickBtnBuy);
        this.addToggleGroupListener(this.toggleGroupExc, this.onExcGroupChange);
    }

    protected onOpen() {
        let sellData = G.DataMgr.npcSellData;
        // this.kaiFuHuoDongView = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        if (this.openStoreId == 0) {
            // 没有指定哪一个商店，则默认钻石商店
            let storeIds = sellData.getStoreListByItemID(this.openId);
            if (storeIds.indexOf(EnumStoreID.MALL_YUANBAO) >= 0) {
                this.openStoreId = EnumStoreID.MALL_YUANBAO;
            } else if (storeIds.indexOf(EnumStoreID.MALL_YUANBAOBIND) >= 0) {
                this.openStoreId = EnumStoreID.MALL_YUANBAOBIND;
            } else {
                this.openStoreId = storeIds[0];
            }
        }
        this.selectedStoreId = this.openStoreId;

        // 在没有指定货币，或者货币为绑定钻石或非绑定钻石，且未声明指使用一种货币，则显示货币选择组件
        let needChooseExc = false;
        if ((this.selectedExcId == 0 || this.selectedExcId == KeyWord.MONEY_YUANBAO_ID || this.selectedExcId == KeyWord.MONEY_YUANBAO_BIND_ID) && !this.openOnlyOneExcType) {
            let _goodsDataYB: MarketItemData = sellData.getMarketDataByItemId(this.openId, EnumStoreID.MALL_YUANBAO, KeyWord.MONEY_YUANBAO_ID, this.openAmount);
            let _goodsDataBindYB: MarketItemData = sellData.getMarketDataByItemId(this.openId, EnumStoreID.MALL_YUANBAOBIND, KeyWord.MONEY_YUANBAO_BIND_ID, this.openAmount);

            needChooseExc = null != _goodsDataYB && null != _goodsDataBindYB;
        }

        this.chooseExcGo.SetActive(needChooseExc);
        if (needChooseExc) {
            if (0 == this.selectedExcId || this.selectedExcId == KeyWord.MONEY_YUANBAO_ID) {
                // 优先选中钻石支付
                this.toggleGroupExc.Selected = 0;
            } else {
                this.toggleGroupExc.Selected = 1;
            }
            this.onExcGroupChange(this.toggleGroupExc.Selected);
        }
        else {
            this.updateSellInfo();
        }

        this.numInput.num = this.openNumber;
        this.refreshHaveCost();
    }

    protected onClose() {
       
    }

    /**点击最大数量按钮事件的响应函数。*/
    private onClickBtnMax(): void {
        if (this.openStoreId == G.DataMgr.activityData.strotId) {
            this.numInput.num = this.maxCount;
        }else{
            this.numInput.num = this.numInput.maxNum;
        }
    }

    /**点击确定按钮事件的响应函数。*/
    private onClickBtnBuy(): void {
        if(this.openStoreId == G.DataMgr.activityData.strotId){
            G.ModuleMgr.businessModule.directBuy(this.m_openGoodsData.sellConfig.m_iItemID, this.numInput.num, this.openStoreId, this.selectedExcId, this.openAmount, false, this.openAutoUse);
        }else{
            G.ModuleMgr.businessModule.directBuy(this.m_openGoodsData.sellConfig.m_iItemID, this.numInput.num, this.m_openGoodsData.sellConfig.m_iStoreID, this.selectedExcId, this.openAmount, false, this.openAutoUse);
        }
        this.close();
        //奶总需求，特权卡购买物品不关闭购买面板
        //if (!this.cardTipPanel.isShowing) {
        //    close();
        //}
    }

    private onNumInputValueChanged(num: number): void {
        // 更新总价
        let price: number = this.getPrice(num, true);
        if (this.openStoreId == G.DataMgr.activityData.strotId) {
            this.totalCostBar.setPrice(price, 0 == G.ActionHandler.getLackNum(this.selectedExcId, price, false) ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH, null);
        }else{
            this.totalCostBar.setPrice(price, 0 == G.ActionHandler.getLackNum(this.selectedExcId, price, false) ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH, null);
        }
    }

    /**更新当前拥有货币 */
    private refreshHaveCost() {
        this.hasBar.setCurrencyID(this.totalCostBar.currency, true);
        this.hasBar.setPrice(G.DataMgr.getOwnValueByID(this.totalCostBar.currency));
    }

    private onExcGroupChange(index: number): void {
        this.curGoldType = index;
        this.selectedStoreId = this.storeGroups[index];
        this.selectedExcId = this.excGroups[index];
        this.updateSellInfo();
        this.refreshHaveCost();
    }

    /**
     * 打开批量购买对话框
     * @param id 物品id
     * @param number 购买数量
     * @param storeID 商店id，0表示默认钻石商城
     * @param excID 货币id，0表示默认钻石
     * @param autoUse 是否自动使用，1表自动使用
     * @param showGetFrom 是否显示获取途径
     * @param onlyOneExcType 是否只显示一种支付方式
     */
    open(id: number, number: number, storeID: EnumStoreID = 0, excID = 0, amount = 0, autoUse: EnumAutoUse = EnumAutoUse.none, onlyOneExcType: boolean = false,maxCount:number =0) {
        this.openId = id;
        this.openNumber = Math.max(1, number);
        this.openStoreId = storeID;
        this.selectedExcId = excID;
        this.openAmount = amount;
        this.openAutoUse = autoUse;
        this.openOnlyOneExcType = onlyOneExcType;
        this.maxCount = maxCount;
        super.open();
    }

    onUpdateMoneyShow() {
        this.updateSellInfo();
    }

    /**更新购买信息*/
    private updateSellInfo(): void {
        this.m_openGoodsData = G.DataMgr.npcSellData.getMarketDataByItemId(this.openId, this.selectedStoreId, this.selectedExcId, this.openAmount);
        if (0 == this.selectedExcId) {
            this.selectedExcId = this.m_openGoodsData.sellConfig.m_astExchange[0].m_iExchangeID;
        }
        //this.showCardTipPanel(Boolean(this._cardCfg), cardType);

        // 这个函数在每次外界调用showOrCloseDialog(true)的时候都会调用
        // 不论当前是否已经显示，因此通常的做法是在下面编写关于面板刷新的代码
        this.iconItem.updateByMarketItemData(this.m_openGoodsData);
        this.iconItem.updateIcon();

        this.textName.text = this.m_openGoodsData.itemConfig.m_szName;
        this.textName.color = Color.toUnityColor(Color.getColorById(this.m_openGoodsData.itemConfig.m_ucColor));

        // 单价
        this.singlePriceBar.setCurrencyID(this.selectedExcId, true);
        let price: number = this.getPrice(1, false);
        this.singlePriceBar.setPrice(price, 0 == G.ActionHandler.getLackNum(this.selectedExcId, price, false) ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH, null);

        this.totalCostBar.setCurrencyID(this.selectedExcId, true);

        let hasMoney: number = G.DataMgr.getOwnValueByID(this.selectedExcId);
        this._canBuyCount = Math.floor(hasMoney / this.getPrice(1, true));
        this._canBuyCount = Math.max(1, this._canBuyCount);

        this.initNumInputCount();

        //this._updateGetMethodList();
    }

    private getPrice(num: number, isDiscount: boolean = true): number {
        let price:number;
        if (this.openStoreId == G.DataMgr.activityData.strotId){
            price = G.DataMgr.npcSellData.getPriceByID(this.m_openGoodsData.sellConfig.m_iItemID, 0, this.openStoreId, this.selectedExcId, num, false, false, isDiscount);
        }else{
           price = G.DataMgr.npcSellData.getPriceByID(this.m_openGoodsData.sellConfig.m_iItemID, 0, this.selectedStoreId, this.selectedExcId, num, false, false, isDiscount);

        }
        return price;
    }

    private initNumInputCount(): void {
        let ceil: number = 0
        if (null != this.m_openGoodsData.sellLimitData) {
            ceil = this.m_openGoodsData.sellLimitData.getRestCount();
        }
        else {
            ceil = BatBuyView.MAX_COUNT;
        }
        ceil = Math.min(this._canBuyCount, ceil);

        this.numInput.setRange(1, ceil, 1, this.numInput.num);
    }

    private onClickBtnClose() {
        this.close();
    }
}