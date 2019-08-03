import { BatBuyView } from 'System/business/view/BatBuyView';
import { MallBaseItem } from 'System/business/view/MallBaseItem';
import { EnumStoreID } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { KfhdData } from 'System/data/KfhdData';
import { NPCSellData } from 'System/data/NPCSellData';
import { UIPathData } from "System/data/UIPathData";
import { MarketItemData } from 'System/data/vo/MarketItemData';
import { Global as G } from 'System/global';
import { IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';
import { NumInput } from "System/uilib/NumInput";
import { TabSubForm } from 'System/uilib/TabForm';
import { UiElements } from 'System/uilib/UiElements';
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from 'System/utils/ColorUtil';
import { RegExpUtil } from "System/utils/RegExpUtil";
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { UIUtils } from 'System/utils/UIUtils';
import { PriceBar } from "../business/view/PriceBar";

export class MeiRiXianGouItem extends MallBaseItem {

    private limitText: UnityEngine.UI.Text;
    private btnBuy: UnityEngine.GameObject;
    private gamobject: UnityEngine.GameObject;
    setComponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        super.setComponents(go, itemIcon_Normal);

        this.gamobject = go;
        this.limitText = ElemFinder.findText(go, 'limitText');

        this.btnBuy = ElemFinder.findObject(go, 'btnBuy');
        Game.UIClickListener.Get(this.gamobject).onClick = delegate(this, this.onClickBtnBuy);
    }

    update(vo: MarketItemData, btnEnable: boolean = true) {
        super.update(vo);
        if (null != vo.sellLimitData) {
            // 有限购
            let restCount: number = vo.sellLimitData.getRestCount();
            this.limitText.text = uts.format('限购 {0} 个', TextFieldUtil.getColorText(restCount.toString(), (restCount > 0 ? Color.GREEN : Color.RED)));
            // 更新按钮状态
            UIUtils.setButtonClickAble(this.gamobject, restCount > 0);
        }
        else {
            this.limitText.text = '';
            // 更新按钮状态
            UIUtils.setButtonClickAble(this.gamobject, true);
        }
        //7天开服，过期的天数可看不可买
        if (!btnEnable) {
            UIUtils.setButtonClickAble(this.gamobject, false);
        }
    }

    _setOriginPrice(vo: MarketItemData) {
        this.yjBar.setCurrencyID(vo.sellConfig.m_astExchange[0].m_iExchangeID, true);
        this.yjBar.setPrice(vo.sellConfig.m_iMaxPrice, PriceBar.COLOR_NORMAL);
    }

    protected onClickBtnBuy(): void {
        this.itemData.needRemind = false;
        let sellConfig = this.itemData.sellConfig;
        if (sellConfig.m_iStoreID == EnumStoreID.Marry && G.DataMgr.heroData.mateName == "") {
            G.TipMgr.addMainFloatTip('没结婚不能购买婚姻商城的商品');
            return;
        }
        G.Uimgr.createForm<BatBuyView>(BatBuyView).open(sellConfig.m_iItemID, 1, sellConfig.m_iStoreID, sellConfig.m_astExchange[0].m_iExchangeID, sellConfig.m_ucAmount);
    }

}

/**购买展示面板 */
class BuyExhibitionPanel {
    //新增右侧信息
    private iconItem: IconItem;
    private imgIcon: UnityEngine.GameObject;                //装备图标
    private txtName: UnityEngine.UI.Text;                   //装备名字
    private txtType: UnityEngine.UI.Text;                   //装备类型
    private txtLimit: UnityEngine.UI.Text;                  //装备限制
    private txtDes: UnityEngine.UI.Text;                    //装备描述
    private txtGetInfo: UnityEngine.UI.Text;                //装备来源信息
    private txtCanBuyNumber: UnityEngine.UI.Text;           //可购买数量
    private numInput: NumInput;                             //数量输入框（-___+）
    private btnMax: UnityEngine.GameObject;                 //最大按钮

    private costBar: PriceBar;                              //总价
    private hasBar: PriceBar;                               //拥有
    private btnBuy: UnityEngine.GameObject;                //购买按钮

    private curMarketData: MarketItemData;


    setComponents(uiElems: UiElements, itemicon: UnityEngine.GameObject) {

        this.imgIcon = uiElems.getElement("imgItem");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(itemicon, this.imgIcon);
        this.txtName = uiElems.getText("txtName");
        this.txtType = uiElems.getText("txtType");
        this.txtLimit = uiElems.getText("txtLimit");
        this.txtDes = uiElems.getText("txtDes");
        this.txtGetInfo = uiElems.getText("txtGetInfo");
        this.txtCanBuyNumber = uiElems.getText("txtLabel");
        this.numInput = new NumInput();
        this.numInput.setComponents(uiElems.getElement("numInput"));
        this.numInput.onValueChanged = delegate(this, this.onNumInputValueChanged);
        this.btnMax = uiElems.getElement("btnMax");

        let costBarTra = uiElems.getElement("costBar");
        if (null != costBarTra) {
            this.costBar = new PriceBar();
            this.costBar.setComponents(costBarTra.gameObject);
        }
        let hasBarTra = uiElems.getElement("hasBar");
        if (null != hasBarTra) {
            this.hasBar = new PriceBar();
            this.hasBar.setComponents(hasBarTra.gameObject);
        }

        this.btnBuy = uiElems.getElement("btnBuy");


        Game.UIClickListener.Get(this.btnBuy).onClick = delegate(this, this.onClickBuy);
        Game.UIClickListener.Get(this.btnMax).onClick = delegate(this, this.onClickMax);
    }

    /**
     * 更新显示
     * @param marketData
     */
    updatePanel(marketData: MarketItemData) {
        this.curMarketData = marketData;
        let cfg = marketData.itemConfig;
        this.iconItem.updateByItemConfig(cfg);
        this.iconItem.updateIcon();
        this.txtName.text = cfg.m_szName;
        this.txtName.color = Color.toUnityColor(Color.getColorById(cfg.m_ucColor));
        this.txtType.text = uts.format("类型：{0}", RegExpUtil.xlsDesc2Html(cfg.m_szUse));
        this.txtLimit.text = uts.format("要求等级：{0}级", cfg.m_ucRequiredLevel);
        this.txtDes.text = RegExpUtil.xlsDesc2Html(cfg.m_szDesc);
        this.txtGetInfo.text = RegExpUtil.xlsDesc2Html(cfg.m_szSpecDesc);

        if (marketData.sellLimitData != null) {
            let restCnt = marketData.sellLimitData.getRestCount();
            this.numInput.setRange(0, restCnt);
            this.txtCanBuyNumber.text = uts.format("可兑换：{0}个", TextFieldUtil.getColorText(restCnt.toString(), restCnt > 0 ? Color.GREEN : Color.RED));
        }
        else {
            this.numInput.setRange(0, 50);
            this.txtCanBuyNumber.text = uts.format("不限购");
        }
        this.numInput.num = 1;
        this.onNumInputValueChanged(this.numInput.num);
    }

    /**
    * 更新总价显示
    * @param num
    */
    private onNumInputValueChanged(num: number): void {
        // 更新总价
        let currencuId = this.curMarketData.sellConfig.m_astExchange[0].m_iExchangeID;
        let price: number = this.getPrice(num, true);
        this.costBar.setPrice(price, 0 == G.ActionHandler.getLackNum(currencuId, price, false) ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH, null);
        this.hasBar.setPrice(G.DataMgr.getOwnValueByID(currencuId));
        this.costBar.setCurrencyID(currencuId);
        this.hasBar.setCurrencyID(currencuId);
    }

    /**
     * 获取总价
     * @param num
     * @param isDiscount
     */
    private getPrice(num: number, isDiscount: boolean = true): number {
        let price = this.curMarketData.sellConfig.m_iMaxPrice;
        let exchange = this.curMarketData.sellConfig.m_astExchange[0].m_iExchangeValue;
        //price = Math.floor(price * this.curMarketData.sellConfig.m_iDiscount / 10);
        //let sumprice = price * num;
        return exchange * num;
    }

    /**点击购买按钮*/
    private onClickBuy() {
        let sellCfg = this.curMarketData.sellConfig;
        if (sellCfg.m_iStoreID == EnumStoreID.Marry && G.DataMgr.heroData.mateName == "") {
            G.TipMgr.addMainFloatTip('没结婚不能购买婚姻商城的商品');
            return;
        }
        G.ModuleMgr.businessModule.directBuy(sellCfg.m_iItemID, this.numInput.num, sellCfg.m_iStoreID, sellCfg.m_astExchange[0].m_iExchangeID, sellCfg.m_ucAmount, false, 0);
    }

    /**点击最大 */
    private onClickMax(): void {
        this.numInput.num = this.numInput.maxNum;
    }
}

class MarketSimpItem {
    private gameObject: UnityEngine.GameObject;

    private imgIcon: UnityEngine.GameObject;
    protected iconItem: IconItem;
    private txtName: UnityEngine.UI.Text;
    /**今日价格*/
    private todayBar: PriceBar;
    /**原价*/
    private txtMaxBar: UnityEngine.UI.Text;
    private newFlag: UnityEngine.GameObject;
    private txtDiscount: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        this.gameObject = go;
        this.imgIcon = ElemFinder.findObject(go, "icon");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(itemIcon_Normal, ElemFinder.findObject(go, 'icon'));
        //this.iconItem.setTipFrom(TipFrom.normal);

        this.txtName = ElemFinder.findText(go, "txtName");
        this.todayBar = new PriceBar();
        this.todayBar.closeOnClick();
        this.todayBar.setComponents(ElemFinder.findObject(go, "priceNode/todayBar"));
        this.txtMaxBar = ElemFinder.findText(go, "priceNode/txtMaxBar");

        this.newFlag = ElemFinder.findObject(go, 'discountNode/newFlag');
        this.txtDiscount = ElemFinder.findText(go, "discountNode/txtDiscount");
    }

    update(marketData: MarketItemData) {
        let cfg = marketData.itemConfig;

        this.iconItem.updateByItemConfig(cfg);
        this.iconItem.updateIcon();
        this.txtName.text = cfg.m_szName;
        this.txtName.color = Color.toUnityColor(Color.getColorById(cfg.m_ucColor));

        this.todayBar.setCurrencyID(marketData.sellConfig.m_astExchange[0].m_iExchangeID);
        //this.todayBar.setPrice(Math.floor(marketData.sellConfig.m_iMaxPrice * marketData.sellConfig.m_iDiscount / 10));
        this.todayBar.setPrice(marketData.sellConfig.m_astExchange[0].m_iExchangeValue);

        this.txtMaxBar.text = uts.format("原价{0}", marketData.sellConfig.m_iMaxPrice);

        this.txtDiscount.text = uts.format("{0}折", marketData.sellConfig.m_iDiscount);
    }
}

/**
 * 每日限购面板
 * @author jesse
 */
export class JjrMrxgPanel extends TabSubForm {
    private static readonly MAX_COUNT = 100;

    private list: List;                                     //商品列表
    private marketDates: MarketItemData[] = null;           //商品列表数据
    private itemIcon_Normal: UnityEngine.GameObject;        //商品item预制体
    private marketSimps: MarketSimpItem[] = [];             //单个商品类型 组

    private selectedItemData: MarketItemData;               //当前选中的商品数据
    private exhibitionPanel: BuyExhibitionPanel;            //展示面板

    private openIdx = 0;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_JJR_MRXG);
    }

    protected resPath(): string {
        return UIPathData.JjrMrxgPanel;
    }

    protected initElements(): void {
        this.list = this.elems.getUIList("list");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.exhibitionPanel = new BuyExhibitionPanel();
        this.exhibitionPanel.setComponents(this.elems.getUiElements("buyPanel"), this.itemIcon_Normal);
    }

    protected initListeners(): void {
        this.addListClickListener(this.list, this.onClickList);
    }

    open(index: number) {
        //this.openIdx = index;
        super.open();
    }

    protected onOpen() {
        this.openIdx = 0;
        this.updatePanel();
    }

    protected onClose() {
    }

    onSellLimitDataChange() {
        this.updatePanel();
    }

    /**刷新页面 */
    private updatePanel(): void {
        //获取数据
        let kfhdData: KfhdData = G.DataMgr.kfhdData;
        if (kfhdData.JJRPanelInfo == null)
            return;

        let npcSellData: NPCSellData = G.DataMgr.npcSellData;
        this.marketDates = npcSellData.getMallLimitList();

        let cnt = 0;
        if (this.marketDates != null) {
            cnt = this.marketDates.length;
        }
        //更新list信息
        this.list.Count = cnt;
        for (let i = 0; i < cnt; i++) {
            let item = this.list.GetItem(i);
            if (this.marketSimps[i] == null) {
                this.marketSimps[i] = new MarketSimpItem();
                this.marketSimps[i].setComponents(item.gameObject, this.itemIcon_Normal);
            }
            this.marketSimps[i].update(this.marketDates[i]);
        }
        //右侧信息
        this.onClickList(this.openIdx);
    }

    /**
     * 点击list
     * @param index
     */
    private onClickList(index: number): void {
        this.openIdx = index;
        this.list.Selected = index;
        let cfg = this.marketDates[index];
        //if (cfg == null) {
        //    if (!this.hasTimer("updatePanel"))
        //        this.addTimer("updatePanel", 100, -1, this.callBackUpdatePanel);
        //    return;
        //}
        //else {
        //    if (this.hasTimer("updatePanel"))
        //        this.removeTimer("updatePanel");
        //}
        //更新右侧面板信息
        this.exhibitionPanel.updatePanel(cfg);
    }

    //private callBackUpdatePanel(timer: Game.Timer) {
    //    this.updatePanel();
    //}
}

