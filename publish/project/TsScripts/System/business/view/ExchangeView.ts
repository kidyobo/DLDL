import { BatBuyView } from "System/business/view/BatBuyView";
import { MallBaseItem } from "System/business/view/MallBaseItem";
import { PriceBar } from "System/business/view/PriceBar";
import { EnumGuide, UnitCtrlType } from "System/constants/GameEnum";
import { EnumStoreID } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { NPCSellData } from "System/data/NPCSellData";
import { UIPathData } from "System/data/UIPathData";
import { MarketItemData } from "System/data/vo/MarketItemData";
import { Global as G } from "System/global";
import { TipFrom } from "System/tip/view/TipsView";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { IconItem } from "System/uilib/IconItem";
import { List, ListItem } from "System/uilib/List";
import { ElemFinder, ElemFinderMySelf } from "System/uilib/UiUtility";
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar";
import { Color } from "System/utils/ColorUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { ThingUtil } from "System/utils/ThingUtil";
import { UIUtils } from "System/utils/UIUtils";
import { Macros } from "System/protocol/Macros";
import { RegExpUtil } from "System/utils/RegExpUtil"
import { NumInput } from "System/uilib/NumInput"
import { CurrencyTip } from 'System/uilib/CurrencyTip'
import ThingData from "../../data/thing/ThingData";

class MallItem extends MallBaseItem {

    private limitText: UnityEngine.UI.Text;
    private hotFlagGo: UnityEngine.GameObject;
    private newFlagGo: UnityEngine.GameObject;
    private itemObj: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        super.setComponents(go, itemIcon_Normal);
        this.limitText = ElemFinder.findText(go, 'limitText');
        this.hotFlagGo = ElemFinder.findObject(go, 'hotFlag');
        this.newFlagGo = ElemFinder.findObject(go, 'newFlag');
        this.itemObj = go;

    }

    update(vo: MarketItemData) {
        super.update(vo);
        if (vo == null) return;
        // 是否热销
        if (0 != vo.sellConfig.m_ucIsRecommend) {
            // 热卖
            this.hotFlagGo.SetActive(true);
            this.newFlagGo.SetActive(false);
        }
        else if (0 != vo.sellConfig.m_ucIsNew) {
            // 新
            this.hotFlagGo.SetActive(false);
            this.newFlagGo.SetActive(true);
        }
        else {
            this.hotFlagGo.SetActive(false);
            this.newFlagGo.SetActive(false);
        }
        if (null != vo.sellLimitData) {
            // 有限购
            let restCount: number = vo.sellLimitData.getRestCount();
            this.limitText.text = uts.format('可兑换{0}个', TextFieldUtil.getColorText(restCount.toString(), (restCount > 0 ? Color.GREEN : Color.RED)));
        }
        else {
            this.limitText.text = '';
        }
    }
}

export class ExchangeView extends CommonForm {
    //声望商城改成魂骨兑换了
    private static readonly MAX_COUNT = 100;
    private readonly TABS: EnumStoreID[] = [EnumStoreID.MALL_REPUTATION, EnumStoreID.MALL_HONNOR/*, EnumStoreID.LiLian, EnumStoreID.STORE_REBORN*/];
    private readonly TabNames: string[] = ['魂骨兑换', '荣誉兑换', /*'宗门兑换', '转生商店'*/];

    /**右上角的魂币显示*/
    private currencyTip: CurrencyTip;

    private btnReturn: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private tabGroupList: List;
    private list: List;
    private costBar: PriceBar;
    private hasBar: PriceBar;
    static itemIcon_Normal: UnityEngine.GameObject;
    private openStoreId: EnumStoreID = EnumStoreID.MALL_REPUTATION;
    private openId: number = 0;
    private curStoreId: EnumStoreID = 0;
    private m_currencyID: number = 0;
    private mallItemDatas: MarketItemData[] = [];
    private selectedItemData: MarketItemData;
    private btn_recharge: UnityEngine.GameObject;
    private btn_buy: UnityEngine.GameObject;
    //新增右侧信息
    private iconItem: IconItem;
    private imgIcon: UnityEngine.GameObject;
    private txtName: UnityEngine.UI.Text;
    private txtType: UnityEngine.UI.Text;
    private txtLimit: UnityEngine.UI.Text;
    private txtDes: UnityEngine.UI.Text;
    private txtGetInfo: UnityEngine.UI.Text;
    private txtCanGet: UnityEngine.UI.Text;
    private numInput: NumInput;
    private btnMax: UnityEngine.GameObject;

    private curSelectedIndex: number = -1;

    constructor() {
        super(KeyWord.BAR_FUNCTION_EXCHANGE);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.ExchangeView;
    }

    protected initElements() {
        ExchangeView.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("currencyTip"));

        this.btnReturn = this.elems.getElement('btnReturn');
        this.mask = this.elems.getElement('mask');
        this.tabGroupList = this.elems.getUIList('tabList');
        this.list = this.elems.getUIList('list');
        // 当前货币
        this.hasBar = new PriceBar();
        this.hasBar.setComponents(this.elems.getElement('hasBar'));
        this.costBar = new PriceBar();
        this.costBar.setComponents(this.elems.getElement("costBar"));

        this.list.onVirtualItemChange = delegate(this, this.showStoreUI);
        this.btn_recharge = this.elems.getElement("btn_recharge");
        this.btn_buy = this.elems.getElement("btn_buy");

        this.imgIcon = this.elems.getElement("imgItem");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(ExchangeView.itemIcon_Normal, this.imgIcon);
        this.txtName = this.elems.getText("txtName");
        this.txtType = this.elems.getText("txtType");
        this.txtLimit = this.elems.getText("txtLimit");
        this.txtDes = this.elems.getText("txtDes");
        this.txtGetInfo = this.elems.getText("txtGetInfo");
        this.txtCanGet = this.elems.getText("txtLabel");
        this.numInput = new NumInput();
        this.numInput.setComponents(this.elems.getElement("numInput"));
        this.numInput.onValueChanged = delegate(this, this.onNumInputValueChanged);
        this.btnMax = this.elems.getElement("btnMax");
    }

    protected initListeners() {
        this.addListClickListener(this.list, this.onClickList);
        this.addClickListener(this.btnReturn, this.onClickReturnBtn);
        this.addClickListener(this.mask, this.onClickReturnBtn);
        this.addListClickListener(this.tabGroupList, this.onTabGroupClick);
        this.addClickListener(this.btn_recharge, this.onClickReChargeBt);
        this.addClickListener(this.btn_buy, this.onClickBtnBuy);
        this.addClickListener(this.btnMax, this.onClickBtnMax);
    }

    protected onOpen() {
        this.tabGroupList.Count = this.TABS.length;
        for (let i = 0; i < this.TABS.length; i++) {
            let item = this.tabGroupList.GetItem(i);
            let normalText = item.findText('normal/Text');
            let selectedText = item.findText('selected/Text');
            let str = this.TabNames[i];
            normalText.text = str;
            selectedText.text = str;
        }

        let openIndex = this.TABS.indexOf(this.openStoreId);
        this.tabGroupList.Selected = openIndex;

        this.onTabGroupClick(openIndex);
        this.tabGroupList.ScrollByAxialRow(openIndex);
        //默认选中第一个商品
        this.onClickList(0);
        this.onUpdateMoney();
    }

    protected onClose() {
        G.GuideMgr.processGuideNext(EnumGuide.OverDue, EnumGuide.GuideCommon_None);
    }

    open(openStoreId: EnumStoreID = 0, openId: number = 0) {
        this.openStoreId = openStoreId;
        this.openId = openId;
        super.open();
    }

    onUpdateMoney() {
        if (this.currencyTip != null) {
            this.currencyTip.updateMoney();
        }
    }

    private onClickReChargeBt() {
        G.ActionHandler.go2Pay();
    }

    private onClickBtnBuy(): void {
        this.selectedItemData.needRemind = false;
        let sellConfig = this.selectedItemData.sellConfig;
        let currencyid = this.m_currencyID;
        if (this.curStoreId == EnumStoreID.MALL_REPUTATION) {
            //声望商店改成魂骨商店了，货币id换成表里的物品id
            currencyid = this.selectedItemData.sellConfig.m_astExchange[0].m_iExchangeID;
        }
        G.ModuleMgr.businessModule.directBuy(this.selectedItemData.sellConfig.m_iItemID, this.numInput.num, this.selectedItemData.sellConfig.m_iStoreID,
            currencyid, sellConfig.m_ucAmount, false, 0);
    }

    private onNumInputValueChanged(num: number): void {
        this.curSelectedIndex = num;
        // 更新总价
        let price: number = this.getPrice(num, true);
        let hasNumber = -1;
        let needNumber = this.selectedItemData.sellConfig.m_astExchange[0].m_iExchangeValue;

        if (this.curStoreId == EnumStoreID.MALL_REPUTATION) {
            //声望商店改成魂骨商店了，货币id换成表里的物品id
            hasNumber = G.DataMgr.thingData.getThingNum(this.selectedItemData.sellConfig.m_astExchange[0].m_iExchangeID, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        }
        else {
            hasNumber = G.DataMgr.getOwnValueByID(this.m_currencyID);//G.ActionHandler.getLackNum(this.m_currencyID, price, false);
        }
        this.costBar.setPrice(price, hasNumber >= needNumber ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH, null);
        this.hasBar.setPrice(hasNumber);
    }

    private initNumInputCount(): void {
        let ceil: number = 0;
        if (null != this.selectedItemData.sellLimitData) {
            ceil = this.selectedItemData.sellLimitData.getRestCount();
        }
        else {
            ceil = ExchangeView.MAX_COUNT;
        }
        let canBuyCount = Math.floor(G.DataMgr.getOwnValueByID(this.m_currencyID) / this.getPrice(1, true));
        ceil = Math.min(canBuyCount > 0 ? canBuyCount : 1, ceil);

        this.numInput.setRange(1, ceil, 1, this.numInput.num);
    }

    private onClickBtnMax(): void {
        this.numInput.num = this.numInput.maxNum;
    }

    private onClickList(index: number): void {
        this.list.Selected = index;
        this.selectedItemData = this.mallItemDatas[index];
        this.numInput.num = 1;

        if (this.selectedItemData != null) {
            this.initNumInputCount();

            this.iconItem.updateByItemConfig(this.selectedItemData.itemConfig);
            this.iconItem.updateIcon();

            this.txtName.text = this.selectedItemData.itemConfig.m_szName;
            this.txtName.color = Color.toUnityColor(Color.getColorById(this.selectedItemData.itemConfig.m_ucColor));
            this.txtType.text = uts.format("类型：{0}", RegExpUtil.xlsDesc2Html(this.selectedItemData.itemConfig.m_szUse));
            this.txtLimit.text = uts.format("要求等级：{0}级", this.selectedItemData.itemConfig.m_ucRequiredLevel);
            this.txtDes.text = RegExpUtil.xlsDesc2Html(this.selectedItemData.itemConfig.m_szDesc);
            this.txtGetInfo.text = RegExpUtil.xlsDesc2Html(this.selectedItemData.itemConfig.m_szSpecDesc);
            if (this.selectedItemData.sellLimitData != null) {
                let restCnt = this.selectedItemData.sellLimitData.getRestCount();
                this.txtCanGet.text = uts.format("可兑换：{0}个", TextFieldUtil.getColorText(restCnt.toString(), restCnt > 0 ? Color.GREEN : Color.RED));
            } else {
                this.txtCanGet.text = uts.format("不限购");
            }
            this.onUpdateMoneyShow();
        }
    }

    private onTabGroupClick(index: number): void {
        G.AudioMgr.playBtnClickSound();
        let storeID = this.TABS[index];
        let isDiffTab = storeID != this.curStoreId;
        this.curStoreId = storeID;
        this.list.SetSlideAppearRefresh();
        this._updateStoreData(storeID, isDiffTab);
        if (isDiffTab) {
            this.list.ScrollTop();
        }
        // 更新货币
        this.m_currencyID = G.DataMgr.npcSellData.getExcIDByStoreID(storeID);
        //默认选中第一个商品
        this.onClickList(0);
        //TODO...
        this.onUpdateMoneyShow();
    }

    private showStoreUI(item: ListItem) {
        let mallItem = item.data.mallItem as MallItem;
        let data = this.mallItemDatas[item.Index];
        if (!item.data.mallItem) {
            mallItem = new MallItem();
            mallItem.setComponents(item.gameObject, ExchangeView.itemIcon_Normal);
            item.data.mallItem = mallItem;
        }
        mallItem.update(data);
    }


    //分为展示普通商品和特卖商品
    private _updateStoreData(storeId: EnumStoreID, isDiffTab: boolean): void {
        let npcSellData: NPCSellData = G.DataMgr.npcSellData;
        this.mallItemDatas = npcSellData.getMallListByType(storeId);
        let dayAfterKaiFu: number = G.SyncTime.getDateAfterStartServer();
        let datas: MarketItemData[] = [];
        for (let i = 0; i < this.mallItemDatas.length; i++) {
            let config = this.mallItemDatas[i];
            let data = G.DataMgr.npcSellData.getNPCSellLimitDataById(config.sellConfig.m_iStoreID, config.sellConfig.m_iItemID);
            if (data != null) {
                let limitConfig = data.sellLimitConfig;
                if (limitConfig.m_iEndTime != 0 && (dayAfterKaiFu < limitConfig.m_iStartTime || dayAfterKaiFu > limitConfig.m_iEndTime)) {
                    continue;
                }
            }
            datas.push(config);
        }
        this.mallItemDatas = datas;
        this.list.Count = this.mallItemDatas.length;
        this.list.Refresh();
    }

    private getPrice(num: number, isDiscount: boolean = true): number {
        let currencyid = this.m_currencyID;
        if (this.curStoreId == EnumStoreID.MALL_REPUTATION) {
            //声望商店改成魂骨商店了，货币id换成表里的物品id
            currencyid = this.selectedItemData.sellConfig.m_astExchange[0].m_iExchangeID;
        }
        let price: number = G.DataMgr.npcSellData.getPriceByID(this.selectedItemData.sellConfig.m_iItemID, 0, this.curStoreId, currencyid, num, false, false, isDiscount);
        return price;
    }

    private onClickReturnBtn() {
        this.close();
    }


    onUpdateMoneyShow(): void {
        let data = this.selectedItemData = this.mallItemDatas[this.list.Selected];
        let excID = data.sellConfig.m_astExchange[0].m_iExchangeID;
        let num = G.DataMgr.npcSellData.getPriceByID(data.itemConfig.m_iID, 0, data.sellConfig.m_iStoreID, excID, 1, false);
        //let price = this.getPrice(num, true);
        this.costBar.setCurrencyID(excID, true);
        this.costBar.setPrice(num, 0 == G.ActionHandler.getLackNum(excID, num, false) ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH, null);
        this.hasBar.setCurrencyID(excID, true);
        this.hasBar.setPrice(G.DataMgr.getOwnValueByID(excID));

        //let price = this.getPrice(this.numInput.num, true);
        //this.costBar.setCurrencyID(this.m_currencyID, true);
        //this.costBar.setPrice(price, 0 == G.ActionHandler.getLackNum(this.m_currencyID, price, false) ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH, null);
        //this.hasBar.setCurrencyID(this.m_currencyID, true);
        //this.hasBar.setPrice(G.DataMgr.getOwnValueByID(this.m_currencyID));

    }

    onContainerChange() {
        this.list.Refresh();
        this.onNumInputValueChanged(this.curSelectedIndex);
    }

    onSellLimitDataChange() {
        this._updateStoreData(this.curStoreId, false);
    }
}