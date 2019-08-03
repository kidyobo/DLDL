import { Global as G } from 'System/global'
import { EnumTgbjRule } from 'System/tanbao/EnumTgbjRule'
import { MarketItemData } from 'System/data/vo/MarketItemData'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { EnumStoreID } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { List } from "System/uilib/List"
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { TipFrom } from 'System/tip/view/TipsView'

class TanBaoExchangeItem extends ListItemCtrl {

    private txtName: UnityEngine.UI.Text;
    private txtJifen: UnityEngine.UI.Text;
    private parent: UnityEngine.GameObject;
    private btnBuy: UnityEngine.GameObject;
    private iconItem: IconItem;
    private iconPrefab: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject, prefab: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, 'txtName');
        this.txtJifen = ElemFinder.findText(go, 'xianjia/txtJifen');
        this.parent = ElemFinder.findObject(go, 'content');
        this.btnBuy = ElemFinder.findObject(go, 'btnBuy');
        this.iconPrefab = prefab;

        if (this.iconItem == null) {
            this.iconItem = new IconItem();
            this.iconItem.setUsualIconByPrefab(this.iconPrefab, this.parent);
            this.iconItem.setTipFrom(TipFrom.normal);
        }
       
    }

    update(vo: MarketItemData, myJifen: number) {
        let color = Color.getColorById(vo.itemConfig.m_ucColor);
        this.txtName.text = TextFieldUtil.getColorText(vo.itemConfig.m_szName, color);
      
        // 现价
        let price: number = G.DataMgr.npcSellData.getPriceByID(vo.itemConfig.m_iID, 0, vo.sellConfig.m_iStoreID, KeyWord.SKY_BONUS_ID, 1, false)
        this.txtJifen.text = price.toString();
        this.txtJifen.color = Color.toUnityColor(myJifen >= price ? Color.GREEN : Color.RED);
        this.iconItem.updateByMarketItemData(vo);
        this.iconItem.updateIcon();
        Game.UIClickListener.Get(this.btnBuy).onClick = delegate(this, this.onClickBuy,vo);
    }


    private onClickBuy(vo: MarketItemData) {
        if (null != vo) {
            vo.needRemind = false;
            G.Uimgr.createForm<BatBuyView>(BatBuyView).open(vo.sellConfig.m_iItemID, 1, vo.sellConfig.m_iStoreID);
        }
    }
}


export class TanBaoExchangeView extends CommonForm{

    private _goodsData: MarketItemData[] = [];
    private btnReturn: UnityEngine.GameObject;
    private list: List;
    private txtCurJifen: UnityEngine.UI.Text;
    private itemIcon_Normal: UnityEngine.GameObject;

    private exchangeItem: TanBaoExchangeItem[] = [];
    private btnClose: UnityEngine.GameObject;
    constructor() {
        super(KeyWord.ACT_FUNCTION_TGBJ);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.TanBaoExchangeView;
    }

    protected initElements(): void {
        this.btnClose = this.elems.getElement("btnClose");
        this.btnReturn = this.elems.getElement("btnReturn");
        this.list = this.elems.getUIList("list");
        this.txtCurJifen = this.elems.getText("txtCurJifen");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
    }

    protected initListeners(): void {
        this.addClickListener(this.btnReturn, this.onClickReturn);
        this.addClickListener(this.btnClose, this.onClickReturn);
     
    }

  
    protected onOpen() {
        this._updateView();
    }
    protected onClose() {
       
    }

    private onClickReturn() {
        this.close();
    }

     _onUpdateMoneyShow(): void {
        this._updateView();
    }

     private _updateView(): void {
         let myJifen = G.DataMgr.heroData.skyBonus;
         this.txtCurJifen.text = myJifen.toString();

        this._goodsData = G.DataMgr.npcSellData.getMallListByType(EnumStoreID.MDBK_ID);
        this.list.Count = this._goodsData.length;
        for (let i = 0; i < this._goodsData.length; i++) {
            let data = this._goodsData[i];
            let itemGo = this.list.GetItem(i).gameObject;
            if (this.exchangeItem[i] == null) {
                this.exchangeItem[i] = new TanBaoExchangeItem();
                this.exchangeItem[i].setComponents(itemGo, this.itemIcon_Normal);
            }             
            this.exchangeItem[i].update(this._goodsData[i], myJifen);
        }
    }    
}
