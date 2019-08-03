import { Global as G } from 'System/global'
import { IconItem } from 'System/uilib/IconItem'
import { PriceBar } from 'System/business/view/PriceBar'
import { ElemFinder } from 'System/uilib/UiUtility'
import { MarketItemData } from 'System/data/vo/MarketItemData'
import { TipFrom } from 'System/tip/view/TipsView'
import { Color } from 'System/utils/ColorUtil'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { EnumStoreID, EnumAutoUse } from 'System/constants/GameEnum'

export class MallBaseItem {

    protected iconItem: IconItem;
    protected nameText: UnityEngine.UI.Text;
    /**现价*/
    protected xjBar: PriceBar;
    /**原价*/
    protected yjBar: PriceBar;

    protected itemData: MarketItemData;

    /**折扣*/
    protected txtDiscount: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(itemIcon_Normal, ElemFinder.findObject(go, 'icon'));
        this.iconItem.setTipFrom(TipFrom.none);

        this.nameText = ElemFinder.findText(go, 'nameText');
        this.txtDiscount = ElemFinder.findText(go, "discount/txtDiscount")

        let xjTransform = go.transform.Find('xianjia');
        if (null != xjTransform) {
            this.xjBar = new PriceBar();
            this.xjBar.setComponents(xjTransform.gameObject);
            this.xjBar.closeOnClick();
        }
        let yjTransform = go.transform.Find('yuanjia');
        if (null != yjTransform) {
            this.yjBar = new PriceBar();
            this.yjBar.setComponents(yjTransform.gameObject);
            this.yjBar.closeOnClick();
        }
    }

    protected _setOriginPrice(vo: MarketItemData): void {
        let excID = vo.sellConfig.m_astExchange[0].m_iExchangeID;
        this.yjBar.setCurrencyID(excID, true);
        let yuanjia: number = G.DataMgr.npcSellData.getPriceByID(vo.itemConfig.m_iID, 0, vo.sellConfig.m_iStoreID, excID, 1, true);
        this.yjBar.setPrice(yuanjia, PriceBar.COLOR_NORMAL);
    }

    update(vo: MarketItemData): void {
        this.itemData = vo;
        // 更新图标
        this.iconItem.updateByMarketItemData(vo);
        this.iconItem.updateIcon();
        if (vo == null) return;
        // 商品名字
        if (vo.itemConfig != null) {
            this.nameText.text = vo.itemConfig.m_szName;
            this.nameText.color = Color.toUnityColor(Color.getColorById(vo.itemConfig.m_ucColor));
            if (vo.sellConfig != null && vo.sellConfig.m_iDiscount > 0) {
                if (this.txtDiscount != null) {
                    this.txtDiscount.text = vo.sellConfig.m_iDiscount + "折";
                    this.txtDiscount.transform.parent.gameObject.SetActive(true);
                }
            } else {
                if (this.txtDiscount != null) {
                    this.txtDiscount.transform.parent.gameObject.SetActive(false);
                }
            }

            let excID: number = vo.sellConfig.m_astExchange[0].m_iExchangeID;

            // 现价
            if (null != this.xjBar) {
                this.xjBar.setCurrencyID(excID, true);
                let xianjia: number = G.DataMgr.npcSellData.getPriceByID(vo.itemConfig.m_iID, 0, vo.sellConfig.m_iStoreID, excID, 1, false);
                let has: number = G.DataMgr.getOwnValueByID(excID);
                if (has < xianjia) {
                    this.xjBar.setPrice(xianjia, PriceBar.COLOR_CUSTOMER, Color.RED);
                }
                else {
                    this.xjBar.setPrice(xianjia, PriceBar.COLOR_CUSTOMER, Color.GREEN);
                }
            }

            // 原价
            if (null == this.yjBar) return;
            this._setOriginPrice(vo);
        }
    }
}