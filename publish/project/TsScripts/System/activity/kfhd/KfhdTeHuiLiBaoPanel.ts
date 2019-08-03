import { KfhdBasePanel } from 'System/activity/kfhd/KfhdBasePanel';
import { UnitCtrlType } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { DropPlanData } from 'System/data/DropPlanData';
import { ThingData } from 'System/data/thing/ThingData';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { MessageBoxConst } from 'System/tip/TipManager';
import { TipFrom } from 'System/tip/view/TipsView';
import { IconItem } from 'System/uilib/IconItem';
import { List } from 'System/uilib/List';
import { Color } from 'System/utils/ColorUtil';
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { UIUtils } from 'System/utils/UIUtils';
import { PriceBar } from "../../business/view/PriceBar";
import { MarketItemData } from "../../data/vo/MarketItemData";
import { ZhufuData } from "../../data/ZhufuData";

export class KfhdTeHuiLiBaoPanel extends KfhdBasePanel {
    private tabGroup: UnityEngine.UI.ActiveToggleGroup;

    private list: List;
    private listItems: IconItem[] = [];

    private modelCtn: UnityEngine.GameObject;
    private modelCtnWeapon: UnityEngine.GameObject;
    private modelCtnMR: UnityEngine.GameObject;
    private modelCtnFZ: UnityEngine.GameObject;
    private curModelCtn: UnityEngine.GameObject;

    private btnGet: UnityEngine.GameObject;
    private labelGet: UnityEngine.UI.Text;

    private textCost: UnityEngine.UI.Text;
    private textRemainTime: UnityEngine.UI.Text;

    private xjBar: PriceBar;
    private yjBar: PriceBar;

    private openGiftId = 0;
    private unitType = 0;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_KFHD_THLB);
    }

    protected resPath(): string {
        return UIPathData.KfhdTeHuiLiBaoView;
    }

    protected initElements() {
        this.tabGroup = this.elems.getToggleGroup('tabGroup');

        // 奖励列表
        this.list = this.elems.getUIList('list');

        this.textCost = this.elems.getText('textCost');
        this.textRemainTime = this.elems.getText('textRemainTime');

        this.modelCtn = this.elems.getElement('modelCtnN');
        this.modelCtnWeapon = this.elems.getElement('modelCtnWeapon');
        this.modelCtnMR = this.elems.getElement('modelCtnMR');
        this.modelCtnFZ = this.elems.getElement('modelCtnFazhen');

        this.xjBar = new PriceBar();
        this.yjBar = new PriceBar();
        this.xjBar.setComponents(this.elems.getElement('xianjia'));
        this.yjBar.setComponents(this.elems.getElement('yuanjia'));
        this.xjBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID);
        this.yjBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID);

        this.btnGet = this.elems.getElement('btnGet');
        this.labelGet = this.elems.getText('labelGet');
    }

    protected initListeners() {
        this.addToggleGroupListener(this.tabGroup, this.onToggleGroup);
        this.addClickListener(this.btnGet, this.onClickBtnGet);
    }

    protected onOpen() {
        if (0 == this.openGiftId) {
            this.openGiftId = G.DataMgr.kfhdData.getTeHuiLiBaoSelectedId();
        }
        if (this.openGiftId > 0) {
            let thlbMarkerDatas = G.DataMgr.kfhdData.getTeHuiLiBaoMarketData();
            let canSelected = 0;
            if (thlbMarkerDatas != null) {
                let len = thlbMarkerDatas.length;
                for (let i = 0; i < len; i++) {
                    let item = thlbMarkerDatas[i];
                    if (item.sellConfig.m_iItemID == this.openGiftId) {
                        canSelected = i;
                        break;
                    }
                }
            }
            this.tabGroup.Selected = canSelected;
        }
        else {
            this.tabGroup.Selected = 0;
        }
    }

    protected onClose() {
        G.DataMgr.kfhdData.isHasClickTeHuiLiBaoGroup = true;
        G.ActBtnCtrl.update(false);
    }

    open(giftId = 0) {
        this.openGiftId = giftId;
        super.open();
    }

    onSellLimitDataChange() {
        this.updateBtnGet();
    }

    private updateSelected(): void {
        // 奖励列表
        let selectedIdx = this.tabGroup.Selected;
        let marketDatas = G.DataMgr.kfhdData.getTeHuiLiBaoMarketData();
        if (marketDatas == null) return;
        let curMarketData = marketDatas[selectedIdx];
        let giftId = curMarketData.sellConfig.m_iItemID;
        let giftCfg = ThingData.getThingConfig(giftId);
        let dropCfg = DropPlanData.getDropPlanConfig(giftCfg.m_iFunctionID);
        this.list.Count = dropCfg.m_ucDropThingNumber;
        let oldItemCnt = this.listItems.length;
        let iconItem: IconItem;
        for (let i = 0; i < dropCfg.m_ucDropThingNumber; i++) {
            if (i < oldItemCnt) {
                iconItem = this.listItems[i];
            } else {
                this.listItems.push(iconItem = new IconItem());
                iconItem.setTipFrom(TipFrom.normal);
                iconItem.setUsuallyIcon(this.list.GetItem(i).gameObject);
            }
            iconItem.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
            iconItem.updateIcon();
        }

        //奖励描述
        this.textCost.text = uts.format('花费{0}可获得{1}',
            TextFieldUtil.getYuanBaoText(curMarketData.sellConfig.m_astExchange[0].m_iExchangeValue),
            TextFieldUtil.getColorText(giftCfg.m_szName, Color.GOLD));

        this.yjBar.setPrice(curMarketData.sellConfig.m_iMaxPrice);
        this.xjBar.setPrice(curMarketData.sellConfig.m_astExchange[0].m_iExchangeValue);

        this.updateBtnGet();

        this._setRewardView(curMarketData);
    }

    private _setRewardView(curMarketData: MarketItemData) {

        if (this.curModelCtn != null) this.curModelCtn.SetActive(false);

        this.unitType = ZhufuData.getUnitTypeByZFType(curMarketData.sellConfig.m_iModelType);
        let modelID = curMarketData.sellConfig.m_iModelID.toString();

        switch (this.unitType) {
            case UnitCtrlType.weapon:
                modelID += "_" + G.DataMgr.heroData.profession;
                this.curModelCtn = this.modelCtnWeapon;
                break;
            case UnitCtrlType.pet:
                this.curModelCtn = this.modelCtnMR;
                break;
            case UnitCtrlType.zhenfa:
                this.curModelCtn = this.modelCtnFZ;
                break;
            default:
                this.curModelCtn = this.modelCtn;
                break;
        }

        this.curModelCtn.SetActive(true);

        G.ResourceMgr.loadModel(this.curModelCtn, this.unitType,
            modelID, this.sortingOrder);
    }

    private updateBtnGet(): void {
        let selectedIdx = this.tabGroup.Selected;
        let marketDatas = G.DataMgr.kfhdData.getTeHuiLiBaoMarketData();
        if (marketDatas == null) return;
        let curMarketData = marketDatas[selectedIdx];
        let giftId = curMarketData.sellConfig.m_iItemID;
        if (curMarketData.sellLimitData.getRestCount() <= 0) {
            UIUtils.setButtonClickAble(this.btnGet, false);
            this.labelGet.text = '已领取';
        }
        else {
            UIUtils.setButtonClickAble(this.btnGet, true);
            this.labelGet.text = '领取礼包';
        }

        let remainCount = curMarketData.sellLimitData.getRestCount();
        let maxCount = curMarketData.sellLimitData.sellLimitConfig.m_iNumberPerDay;
        this.textRemainTime.text = uts.format('今日可购：{0}/{1}',
            TextFieldUtil.getColorText(remainCount.toString(), remainCount > 0 ? Color.GREEN : Color.RED),
            TextFieldUtil.getColorText(maxCount.toString(), Color.WHITE));
    }

    private onToggleGroup(index: number) {
        this.updateSelected();
    }

    private onClickBtnGet() {
        this.doBuy();
    }



    private doBuy(): void {
        let selectedIdx = this.tabGroup.Selected;
        let marketDatas = G.DataMgr.kfhdData.getTeHuiLiBaoMarketData();
        if (marketDatas == null) return;
        let curMarketData = marketDatas[selectedIdx];

        G.ModuleMgr.businessModule.directBuy(curMarketData.sellConfig.m_iItemID, 1, curMarketData.sellConfig.m_iStoreID);
    }

    onServerOverDay() {

    }
}