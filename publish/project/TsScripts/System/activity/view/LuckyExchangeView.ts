import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { IconItem } from 'System/uilib/IconItem'
import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { TipFrom } from 'System/tip/view/TipsView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { FixedList } from 'System/uilib/FixedList'
import { List } from 'System/uilib/List'
import { RewardIconItemData } from "System/data/vo/RewardIconItemData"
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { DataFormatter } from "System/utils/DataFormatter"
import { PriceBar } from 'System/business/view/PriceBar'
import { PayView } from 'System/pay/PayView'
import { ThingData } from "System/data/thing/ThingData"
import { Color } from "System/utils/ColorUtil"
import { GameIDUtil } from "System/utils/GameIDUtil"
import { GameIDType, EnumStoreID } from 'System/constants/GameEnum'
import { MarketItemData } from "System/data/vo/MarketItemData"
import { BatBuyView } from "System/business/view/BatBuyView"
import { ElemFinder } from 'System/uilib/UiUtility'

class LuckyExchangeItem {

    private icon: UnityEngine.GameObject;
    private cost: UnityEngine.UI.Text;
    private limit: UnityEngine.UI.Text;
    private BT_Exchange: UnityEngine.GameObject;
    private iconitem: IconItem;

    private data: MarketItemData;

    setComponents(go: UnityEngine.GameObject, prefab: UnityEngine.GameObject) {
        this.icon = ElemFinder.findObject(go, "icon");
        this.cost = ElemFinder.findText(go, "cost");
        this.limit = ElemFinder.findText(go, "limit");
        this.BT_Exchange = ElemFinder.findObject(go, "BT_Exchange");

        this.iconitem = new IconItem();
        this.iconitem.setUsualIconByPrefab(prefab, this.icon);
        this.iconitem.setTipFrom(TipFrom.normal);

        Game.UIClickListener.Get(this.BT_Exchange).onClick = delegate(this, this.onClickExchange)
    }

    update(data: MarketItemData) {
        this.data = data;
        let xyzpBonus = G.DataMgr.heroData.xyzpBonus;
        let count = data.sellConfig.m_astExchange[0].m_iExchangeValue * data.sellConfig.m_ucAmount;
        let boughtCount = data.sellLimitData.boughtCount;
        let maxCount = boughtCount + data.sellLimitData.getRestCount();
        this.cost.text = TextFieldUtil.getColorText(uts.format("积分:{0}\n", count), Color.getReachColor(count <= xyzpBonus));
        this.limit.text = TextFieldUtil.getColorText(uts.format("限购:{0}/{1}", boughtCount, maxCount), Color.getReachColor(boughtCount < maxCount));
        this.iconitem.updateById(data.sellConfig.m_iItemID, data.sellConfig.m_ucAmount);
        this.iconitem.updateIcon();
    }

    private onClickExchange() {
        G.ModuleMgr.businessModule.directBuy(this.data.sellConfig.m_iItemID, this.data.sellConfig.m_ucAmount, this.data.sellConfig.m_iStoreID, KeyWord.XYZP_THING_ID, 0, false);
    }
}

export class LuckyExchangeView extends CommonForm {
    private list: List;
    private itemIcon_Normal: UnityEngine.GameObject;
    private luckyExchangeItems: LuckyExchangeItem[] = [];

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.LuckyExchangeView;
    }
    protected initElements() {
        this.list = this.elems.getUIList("list");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
    }
    protected initListeners() {
        this.addClickListener(this.elems.getElement("mask"), this.close);
        this.addClickListener(this.elems.getElement("btnClose"), this.close);
    }
    protected onOpen() {
        this.updateView();
    }

    public updateView() {
        let xyzpBonus = G.DataMgr.heroData.xyzpBonus;
        let sellDatas = G.DataMgr.npcSellData.getMallListByType(EnumStoreID.ZPDH_ID);
        this.list.Count = sellDatas.length;
        for (let i = 0; i < sellDatas.length; i++) {
            let data = sellDatas[i];
            if (this.luckyExchangeItems[i] == null) {
                let item = this.list.GetItem(i).gameObject;
                this.luckyExchangeItems[i] = new LuckyExchangeItem();
                this.luckyExchangeItems[i].setComponents(item, this.itemIcon_Normal);
            }
            this.luckyExchangeItems[i].update(data);
        }
    }
    protected onClose() {

    }


}