import { Global as G } from 'System/global'
import { MarketItemData } from 'System/data/vo/MarketItemData'
import { KfhdData } from 'System/data/KfhdData'
import { NPCSellData } from 'System/data/NPCSellData'
import { DataFormatter } from 'System/utils/DataFormatter'
import { KeyWord } from 'System/constants/KeyWord'
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { Color } from 'System/utils/ColorUtil'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { TabSubForm } from 'System/uilib/TabForm'
import { UIUtils } from 'System/utils/UIUtils'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { MallBaseItem } from 'System/business/view/MallBaseItem'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { EnumStoreID } from "System/constants/GameEnum"
import { PriceBar } from 'System/business/view/PriceBar';


export class MeiRiXianGouItem extends MallBaseItem {

    private limitText: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        super.setComponents(go, itemIcon_Normal);
        this.limitText = ElemFinder.findText(go, 'limitText');
    }

    update(vo: MarketItemData, btnEnable: boolean = true) {
        super.update(vo);
        if (null != vo.sellLimitData) {
            // 有限购
            let restCount: number = vo.sellLimitData.getRestCount();
            this.limitText.text = uts.format('限购 {0} 个', TextFieldUtil.getColorText(restCount.toString(), (restCount > 0 ? Color.GREEN : Color.RED)));
            // 更新按钮状态
            //UIUtils.setButtonClickAble(this.btnBuy, restCount > 0);
        }
        else {
            this.limitText.text = '';
            // 更新按钮状态
            //UIUtils.setButtonClickAble(this.btnBuy, true);
        }
        //7天开服，过期的天数可看不可买
        if (!btnEnable) {
            //UIUtils.setButtonClickAble(this.btnBuy, false);
        }
    }

    _setOriginPrice(vo: MarketItemData) {
        this.yjBar.setCurrencyID(vo.sellConfig.m_astExchange[0].m_iExchangeID, true);
        this.yjBar.setPrice(vo.sellConfig.m_iMaxPrice, PriceBar.COLOR_NORMAL);
    }
}

/**
 * 每日限购面板
 * @author jesse
 */
export class WzsdPanel extends TabSubForm {

    private list: List;
    private itemIcon_Normal: UnityEngine.GameObject;
    private meiRiXianGouItems: MeiRiXianGouItem[] = [];

    private openIdx = -1;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_WZSD);
    }

    protected resPath(): string {
        return UIPathData.WzsdPaenl;
    }

    protected initElements(): void {
        this.list = this.elems.getUIList("list");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
    }

    protected initListeners(): void {

    }

    open(index: number) {
        this.openIdx = index;
        super.open();
    }

    protected onOpen() {
        this.updatePanel();
    }

    protected onClose() {
    }

    onSellLimitDataChange() {
        this.updatePanel();
    }

    private updatePanel(): void {
        let npcSellData: NPCSellData = G.DataMgr.npcSellData;
        let storeID = EnumStoreID.WuZhe;;
        if (G.SyncTime.getDateAfterStartServer() > 14)
        {
            storeID = EnumStoreID.WuZheII;
        }
        let pageData: MarketItemData[] = npcSellData.getMallListByType(storeID);

        let cnt = 0;
        if (pageData != null) {
            cnt = pageData.length;
        }

        this.list.Count = cnt;
        for (let i = 0; i < cnt; i++) {
            let item = this.list.GetItem(i);
            if (this.meiRiXianGouItems[i] == null) {
                this.meiRiXianGouItems[i] = new MeiRiXianGouItem();
                this.meiRiXianGouItems[i].setComponents(item.gameObject, this.itemIcon_Normal);
            }
            this.meiRiXianGouItems[i].update(pageData[i]);
        }
        this.list.Selected = this.openIdx;
    }
}

