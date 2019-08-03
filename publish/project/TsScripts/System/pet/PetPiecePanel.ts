import { Global as G } from 'System/global'
import { NestedSubForm } from 'System/uilib/NestedForm'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { EnumStoreID, EnumThingID } from 'System/constants/GameEnum'
import { NPCSellData } from 'System/data/NPCSellData'
import { MarketItemData } from 'System/data/vo/MarketItemData'
import { MallBaseItem } from 'System/business/view/MallBaseItem'
import { PriceBar } from 'System/business/view/PriceBar'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'

class PetPieceItem extends MallBaseItem {
    private limitText: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        super.setComponents(go, itemIcon_Normal);

        this.limitText = ElemFinder.findObject(go, 'limitText');
    }

    update(vo: MarketItemData) {
        super.update(vo);

        if (vo.sellConfig.m_iSaleCondVal > 0 && !G.DataMgr.petData.isPetActive(vo.sellConfig.m_iSaleCondVal)) {
            this.limitText.SetActive(true);
            //this.btnBuy.SetActive(false);
        }
        else {
            this.limitText.SetActive(false);
            //this.btnBuy.SetActive(true);
        }
    }
}

export class PetPiecePanel extends NestedSubForm {
    private readonly CurrencyCnt = 5;

    private list: List;
    private items: PetPieceItem[] = [];
    private currencyBars: PriceBar[] = [];

    private itemIcon_Normal: UnityEngine.GameObject;

    private mallItemDatas: MarketItemData[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_PET_SUIPIAN);

        let npcSellData: NPCSellData = G.DataMgr.npcSellData;
        this.mallItemDatas = npcSellData.getMallListByType(EnumStoreID.WuYuanSuiPian);
    }

    protected resPath(): string {
        return UIPathData.PetPieceView;
    }

    protected initElements() {
        this.list = this.elems.getUIList('list');
        this.list.Count = this.mallItemDatas.length;
        let cids: number[] = [];
        for (let d of this.mallItemDatas) {
            let cid = d.sellConfig.m_astExchange[0].m_iExchangeID;
            if (cids.indexOf(cid) < 0) {
                cids.push(cid);
            }
        }
        // 当前货币
        for (let i = 0; i < this.CurrencyCnt; i++) {
            let cbar = new PriceBar();
            cbar.setComponents(this.elems.getElement('currencyBar' + i));
            cbar.setCurrencyID(cids[i]);
            this.currencyBars[i] = cbar;
        }
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
    }

    protected initListeners() {
    }

    protected onOpen() {
        let cnt = this.mallItemDatas.length;
        let oldItemCnt = this.items.length;
        for (let i = 0; i < cnt; i++) {
            let item: PetPieceItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items[i] = item = new PetPieceItem();
                item.setComponents(this.list.GetItem(i).gameObject, this.itemIcon_Normal);
            }
            item.update(this.mallItemDatas[i]);
        }

        this.onContainerChange(Macros.CONTAINER_TYPE_ROLE_BAG);
    }

    protected onClose() {
    }

    onContainerChange(type: number) {
        if (Macros.CONTAINER_TYPE_ROLE_BAG) {
            for (let i = 0; i < this.CurrencyCnt; i++) {
                let cbar = this.currencyBars[i];
                cbar.setPrice(G.DataMgr.getOwnValueByID(cbar.currency));
            }
        }
    }

    //onSellLimitDataChange() {
    //    this._updateStoreData(this.curStoreId, false);
    //}
}