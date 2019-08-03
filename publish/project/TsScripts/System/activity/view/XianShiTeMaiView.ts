import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { DataFormatter } from 'System/utils/DataFormatter'
import { KeyWord } from 'System/constants/KeyWord'
import { List } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { MarketItemData } from 'System/data/vo/MarketItemData'
import { DropPlanData } from 'System/data/DropPlanData'
import { UIUtils } from 'System/utils/UIUtils'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { EnumStoreID } from 'System/constants/GameEnum'

class XianShiTeMaiItem extends ListItemCtrl {
    private textPrice: UnityEngine.UI.Text;
    private btnBuy: UnityEngine.GameObject;
    private labelBtnBuy: UnityEngine.UI.Text;

    private list: List;
    private icons: IconItem[] = [];

    private itemData: MarketItemData;

    setComponents(go: UnityEngine.GameObject) {
        this.textPrice = ElemFinder.findText(go, 'priceBg/textPrice');
        this.btnBuy = ElemFinder.findObject(go, 'btnBuy');
        this.labelBtnBuy = ElemFinder.findText(this.btnBuy, 'Text');
        this.list = ElemFinder.getUIList(ElemFinder.findObject(go, 'list'));
        Game.UIClickListener.Get(this.btnBuy).onClick = delegate(this, this.onClickBtnBuy);
    }

    update(itemData: MarketItemData) {
        this.itemData = itemData;
        this.textPrice.text = uts.format('{0}钻石', itemData.sellConfig.m_astExchange[0].m_iExchangeValue);
        let dropCfg = DropPlanData.getDropPlanConfig(itemData.itemConfig.m_iFunctionID);
        this.list.Count = dropCfg.m_ucDropThingNumber;
        let oldIconCnt = this.icons.length;
        for (let i = 0; i < dropCfg.m_ucDropThingNumber; i++) {
            let iconItem: IconItem;
            if (i < oldIconCnt) {
                iconItem = this.icons[i];
            } else {
                this.icons.push(iconItem = new IconItem());
                iconItem.setUsuallyIcon(this.list.GetItem(i).gameObject);
                iconItem.setTipFrom(TipFrom.normal);
            }
            iconItem.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
            iconItem.updateIcon();
        }

        if (0 == itemData.sellLimitData.getRestCount()) {
            this.labelBtnBuy.text = '已购买';
            UIUtils.setButtonClickAble(this.btnBuy, false);
        } else {
            this.labelBtnBuy.text = '立即抢购';
            UIUtils.setButtonClickAble(this.btnBuy, true);
        }
    }

    private onClickBtnBuy() {
        let sellConfig = this.itemData.sellConfig;
        G.ModuleMgr.businessModule.directBuy(sellConfig.m_iItemID, 1, sellConfig.m_iStoreID, sellConfig.m_astExchange[0].m_iExchangeID, 1, false, 0);
    }
}

export class XianShiTeMaiView extends CommonForm {
    private readonly TimerKey = '1';

    private btnClose: UnityEngine.GameObject;

    private list: List;
    private items: XianShiTeMaiItem[] = [];

    private textCountDown: UnityEngine.UI.Text;

    constructor() {
        super(KeyWord.ACT_FUNCTION_XIANSHITEMAI);
    }
    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.XianShiTeMaiView;
    }
    protected initElements(): void {
        this.btnClose = this.elems.getElement('btnClose');

        this.textCountDown = this.elems.getText('textCountDown');

        this.list = this.elems.getUIList('list');
    }
    protected initListeners(): void {
        this.addClickListener(this.elems.getElement('mask'), this.onClickBtnClose);
        this.addClickListener(this.btnClose, this.onClickBtnClose);
    }

    protected onOpen() {
        this.onSellLimitDataChange();
        this.onCountDownTimer(null);
        this.addTimer(this.TimerKey, 1000, 0, this.onCountDownTimer);
    }

    protected onClose() {
    }

    onSellLimitDataChange() {
        let itemDatas = G.DataMgr.npcSellData.getMallListByType(EnumStoreID.XianShiTeMai);
        // 筛出当天的
        let cnt = itemDatas.length;
        let d = G.SyncTime.getDateAfterStartServer();
        for (let i = cnt - 1; i >= 0; i--) {
            let itemData = itemDatas[i];
            if (itemData.sellLimitData.sellLimitConfig.m_iStartTime != d) {
                itemDatas.splice(i, 1);
            }
        }
        cnt = itemDatas.length;

        this.list.Count = cnt;
        let oldItemCnt = this.items.length;
        for (let i = 0; i < cnt; i++) {
            let item: XianShiTeMaiItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new XianShiTeMaiItem());
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            item.update(itemDatas[i]);
        }
    }

    onServerOverDay() {
        let d = G.SyncTime.getDateAfterStartServer();
        let npcSellData = G.DataMgr.npcSellData;
        if (npcSellData.XianShiTeMaiDays.indexOf(d) < 0) {
            this.close();
        } 
    }

    private onCountDownTimer(timer: Game.Timer) {
        let t = G.SyncTime.getNextTime(0, 0, 0) - G.SyncTime.getCurrentTime();
        this.textCountDown.text = uts.format('今日特卖倒计时：{0}', TextFieldUtil.getColorText(DataFormatter.second2hhmmss(Math.round(t / 1000)), Color.RED));
    }

    private onClickBtnClose() {
        this.close();
    }
}