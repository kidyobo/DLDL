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
import { ShopRule } from "../../constants/ShopRule";

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
            this.limitText.text = uts.format('限购{0}个', TextFieldUtil.getColorText(restCount.toString(), (restCount > 0 ? Color.GREEN : Color.RED)));
        }
        else {
            this.limitText.text = '';
        }
    }
}


/**特卖礼包item*/
class TeMaiLiBaoItem {

    private currenyBar: PriceBar;
    private currenyBarObj: UnityEngine.GameObject;
    private btn_buy: UnityEngine.GameObject;
    private modelRootShenQi: UnityEngine.GameObject;
    private modelRootHero: UnityEngine.GameObject;
    private modelRootThing: UnityEngine.GameObject;
    private modelRootRide: UnityEngine.GameObject;
    private modelRootTitle: UnityEngine.GameObject;
    private modelRootZhenFa: UnityEngine.GameObject;
    private modelRootWing: UnityEngine.GameObject;
    private modelRootShenji: UnityEngine.GameObject;
    private iconRoot: UnityEngine.GameObject;
    private iconItem: IconItem;
    private itemData: MarketItemData;
    private roleAvatar: UIRoleAvatar;
    private m_avatarList: Protocol.AvatarList = null;
    private btnBuyText: UnityEngine.UI.Text;
    private iconTitle: UnityEngine.UI.Image;

    setCommonpents(obj: UnityEngine.GameObject) {
        this.currenyBarObj = ElemFinder.findObject(obj, 'currencyBar');
        this.btn_buy = ElemFinder.findObject(obj, 'btn_buy');
        this.btnBuyText = ElemFinder.findText(this.btn_buy, 'Text');
        this.modelRootShenQi = ElemFinder.findObject(obj, 'modelRootShenQi');
        this.modelRootHero = ElemFinder.findObject(obj, 'modelRootHero');
        this.modelRootThing = ElemFinder.findObject(obj, 'modelRootThing');
        this.modelRootRide = ElemFinder.findObject(obj, 'modelRootRide');
        this.modelRootTitle = ElemFinder.findObject(obj, 'modelRootTitle');
        this.modelRootZhenFa = ElemFinder.findObject(obj, 'modelRootZhenFa');
        this.modelRootWing = ElemFinder.findObject(obj, 'modelRootWing');
        this.modelRootShenji = ElemFinder.findObject(obj, 'modelRootShenji');
        this.iconRoot = ElemFinder.findObject(obj, 'iconRoot');
        this.iconTitle = ElemFinder.findImage(obj, 'titleIcon');
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(MallView.itemIcon_Normal, this.iconRoot);
        this.iconItem.setTipFrom(TipFrom.normal);
        this.currenyBar = new PriceBar();
        this.currenyBar.setComponents(this.currenyBarObj);
        Game.UIClickListener.Get(this.btn_buy).onClick = delegate(this, this.onClickBtnBuy);
    }

    update(vo: MarketItemData) {
        if (vo.sellLimitData.lifeBoughtCount >= vo.sellLimitData.sellLimitConfig.m_iNumberLife) {
            UIUtils.setButtonClickAble(this.btn_buy, false);
            this.btnBuyText.text = '已购买';
        } else {
            UIUtils.setButtonClickAble(this.btn_buy, true);
            this.btnBuyText.text = '购买';
        }
        this.itemData = vo;
        let modelData = ThingUtil.getModelIdByThingType(vo.sellConfig);
        if (modelData.specialType != 0) {
            this.iconTitle.sprite = MallView.teMaiAltas.Get(modelData.specialType.toString());
        } else {
            this.iconTitle.sprite = MallView.teMaiAltas.Get(modelData.unitType.toString());
        }
        switch (modelData.unitType) {
            case UnitCtrlType.hero:
                this.m_avatarList = uts.deepcopy(G.DataMgr.heroData.avatarList, this.m_avatarList, true);
                this.m_avatarList.m_uiDressImageID = Number(modelData.modelId);
                if (this.roleAvatar != null) {
                    this.roleAvatar.destroy();
                }
                this.roleAvatar = new UIRoleAvatar(this.modelRootHero.transform, this.modelRootHero.transform);
                this.roleAvatar.hasWing = false;
                this.roleAvatar.setAvataByList(this.m_avatarList, G.DataMgr.heroData.profession, G.DataMgr.heroData.gender);
                this.roleAvatar.m_rebirthMesh.setRotation(12, 0, 0);
                this.roleAvatar.setSortingOrder(MallView.modelSortingOrder);
                MallView.roleAvatar = this.roleAvatar;
                break;
            case UnitCtrlType.weapon:
                this.showModle(modelData.unitType, modelData.modelId, this.modelRootShenQi);
                break;
            case UnitCtrlType.ride:
                this.showModle(modelData.unitType, modelData.modelId, this.modelRootRide);
                break;
            case UnitCtrlType.other:
                let modleId = "flIma9";
                this.showModle(modelData.unitType, uts.format('model/misc/{0}.prefab', modleId), this.modelRootThing);
                break;
            case UnitCtrlType.chenghao:
                this.showModle(modelData.unitType, modelData.modelId, this.modelRootTitle);
                break;
            case UnitCtrlType.zhenfa:
                this.showModle(modelData.unitType, modelData.modelId, this.modelRootZhenFa);
                break;
            case UnitCtrlType.pet:
                this.showModle(modelData.unitType, modelData.modelId, this.modelRootHero);
                break;
            case UnitCtrlType.wing:
                this.showModle(modelData.unitType, modelData.modelId, this.modelRootWing);
                break;
            case UnitCtrlType.shenji:
                this.showModle(modelData.unitType, modelData.modelId, this.modelRootShenji);
                break;
        }
        this.iconItem.updateById(vo.sellConfig.m_iItemID);
        this.iconItem.updateIcon();
        this.currenyBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID);
        this.currenyBar.setPrice(vo.sellConfig.m_astExchange[0].m_iExchangeValue);
    }

    private onClickBtnBuy() {
        let sellConfig = this.itemData.sellConfig;
        G.Uimgr.createForm<BatBuyView>(BatBuyView).open(sellConfig.m_iItemID, 1, sellConfig.m_iStoreID, sellConfig.m_astExchange[0].m_iExchangeID, sellConfig.m_ucAmount);
    }

    /**模型显示*/
    private showModle(unitType: number, modleId: string, modelRoot: UnityEngine.GameObject) {
        G.ResourceMgr.loadModel(modelRoot, unitType, modleId, MallView.modelSortingOrder);
    }
}


export class MallView extends CommonForm {

    private static readonly MAX_COUNT = 100;
    private TABS: EnumStoreID[] = [/*EnumStoreID.Mall_TeMai,*/ EnumStoreID.MALL_YUANBAO, EnumStoreID.MALL_YUANBAOBIND, /*EnumStoreID.ZhanHun*//**, EnumStoreID.MALL_HONNOR */ KeyWord.OTHER_FUNCTION_JJR_MRXG];
    private TabNames: string[] = [/*'特卖商城',*/ '钻石商城', '绑钻商城',/*'战魂商店'*//**, '荣誉商城' */"每日折扣"];

    /**右上角的魂币显示*/
    private currencyTip: CurrencyTip;

    private btnReturn: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private tabGroupList: List;
    private list: List;
    private costBar: PriceBar;
    private hasBar: PriceBar;
    static itemIcon_Normal: UnityEngine.GameObject;
    private openStoreId: EnumStoreID = 0;
    private openId: number = 0;
    private curStoreId: EnumStoreID = 0;
    private curLimitId: number = 0;
    private m_currencyID: number = 0;
    private mallItemDatas: MarketItemData[] = [];
    private selectedItemData: MarketItemData;
    private btn_recharge: UnityEngine.GameObject;
    private btn_buy: UnityEngine.GameObject;
    //特卖商城
    private teMaiList: List;
    static modelSortingOrder: number;
    static roleAvatar: UIRoleAvatar;
    static teMaiAltas: Game.UGUIAltas;
    private titleSd: UnityEngine.GameObject;
    private titleSc: UnityEngine.GameObject;
    private loopWeekDay: number = 1;
    private showStoreIds: number[];
    private temaiListItems: TeMaiLiBaoItem[] = [];

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
    private txtHas: UnityEngine.GameObject;

    private curSelected: number = 0;

    constructor() {
        super(KeyWord.BAR_FUNCTION_MALL);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.MallView;
    }

    protected initElements() {
        MallView.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        MallView.teMaiAltas = ElemFinderMySelf.findAltas(this.elems.getElement('temaiAltas'));

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("currencyTip"));

        this.btnReturn = this.elems.getElement('btnReturn');
        this.mask = this.elems.getElement('mask');
        this.tabGroupList = this.elems.getUIList('tabList');
        // boss列表
        this.list = this.elems.getUIList('list');
        // 当前货币
        this.hasBar = new PriceBar();
        this.hasBar.setComponents(this.elems.getElement('hasBar'));
        this.costBar = new PriceBar();
        this.costBar.setComponents(this.elems.getElement("costBar"));
        this.list.onVirtualItemChange = delegate(this, this.showStoreUI);
        this.btn_recharge = this.elems.getElement("btn_recharge");
        this.btn_buy = this.elems.getElement("btn_buy");
        this.teMaiList = this.elems.getUIList('teMaiList');
        this.titleSc = this.elems.getElement('titleSc');
        this.titleSd = this.elems.getElement('titleSd');
        this.txtHas = this.elems.getElement('txtHas');
        this.imgIcon = this.elems.getElement("imgItem");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(MallView.itemIcon_Normal, this.imgIcon);
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
        //这个限购礼包如同智障一样非要加这里，还得控制功能开启
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JJR_MRXG)) {
            this.TABS = [EnumStoreID.MALL_YUANBAO, EnumStoreID.MALL_YUANBAOBIND, KeyWord.OTHER_FUNCTION_JJR_MRXG];
            this.TabNames = ['钻石商城', '绑钻商城', "每日折扣"];
        }
        else {
            this.TABS = [EnumStoreID.MALL_YUANBAO, EnumStoreID.MALL_YUANBAOBIND];
            this.TabNames = ['钻石商城', '绑钻商城'];
        }

        this.loopWeekDay = G.DataMgr.npcSellData.LoopWeekDay;
        MallView.modelSortingOrder = this.sortingOrder;

        this.tabGroupList.Count = this.TABS.length;
        for (let i = 0; i < this.TABS.length; i++) {
            let item = this.tabGroupList.GetItem(i);
            let normalText = item.findText('normal/Text');
            let selectedText = item.findText('selected/Text');
            let str = this.TabNames[i];
            normalText.text = str;
            selectedText.text = str;
        }

        let openTabIdx = this.TABS.indexOf(this.openStoreId);
        if (this.openStoreId == KeyWord.OTHER_FUNCTION_JJR_MRXG) {
            openTabIdx = 2;
        }
        this.tabGroupList.Selected = openTabIdx;
        this.onTabGroupClick(openTabIdx);
        this.tabGroupList.ScrollByAxialRow(openTabIdx);

        //默认选中第一个商品
        this.onClickList(this.curSelected);
        this.onUpdateMoney();
    }

    protected onClose() {
        G.GuideMgr.processGuideNext(EnumGuide.OverDue, EnumGuide.GuideCommon_None);
        if (MallView.roleAvatar != null) {
            MallView.roleAvatar.destroy();
            MallView.roleAvatar = null;
        }
    }

    open(openStoreId: EnumStoreID = 0, openId: number = 0) {
        if (openStoreId == 0) {
            openStoreId = EnumStoreID.MALL_YUANBAO
        }
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
        if (sellConfig.m_iStoreID == EnumStoreID.Marry && G.DataMgr.heroData.mateName == "") {
            G.TipMgr.addMainFloatTip('没结婚不能购买婚姻商城的商品');
            return;
        }
        G.ModuleMgr.businessModule.directBuy(this.selectedItemData.sellConfig.m_iItemID, this.numInput.num, this.selectedItemData.sellConfig.m_iStoreID, this.m_currencyID, sellConfig.m_ucAmount, false, 0);
    }

    private onNumInputValueChanged(num: number): void {
        // 更新总价
        let price: number = this.getPrice(num, true);
        this.costBar.setPrice(price, 0 == G.ActionHandler.getLackNum(this.m_currencyID, price, false) ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH, null);
        this.hasBar.setPrice(G.DataMgr.getOwnValueByID(this.m_currencyID));
    }

    private initNumInputCount(): void {
        let ceil: number = 0;
        if (null != this.selectedItemData.sellLimitData) {
            ceil = this.selectedItemData.sellLimitData.getRestCount();
        }
        else {
            ceil = MallView.MAX_COUNT;
        }
        //let canBuyCount = Math.floor(G.DataMgr.getOwnValueByID(this.m_currencyID) / this.getPrice(1, true));
        //ceil = Math.min(canBuyCount > 0 ? canBuyCount : 1, ceil);
        this.numInput.setRange(1, ceil, 1, this.numInput.num);
    }

    private onClickBtnMax(): void {
        this.numInput.num = this.numInput.maxNum;
    }

    private onClickList(index: number): void {
        this.list.Selected = index;
        this.curSelected = index;
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
                this.txtCanGet.text = uts.format("限购：{0}个", TextFieldUtil.getColorText(restCnt.toString(), restCnt > 0 ? Color.GREEN : Color.RED));
            } else {
                this.txtCanGet.text = uts.format("不限购");
            }
            this.onUpdateMoneyShow();
        }
    }


    private onTabGroupClick(index: number): void {
        this.txtHas.SetActive(false);
        G.AudioMgr.playBtnClickSound();
        let storeID = this.TABS[index];
        if (storeID == KeyWord.OTHER_FUNCTION_JJR_MRXG) {
            this.curLimitId = G.DataMgr.npcSellData.getMallLimitMallId();
        }
        let isDiffTab = storeID != this.curStoreId;
        this.curStoreId = storeID;
        let listObj = this.list.gameObject;
        let teMaiListObj = this.teMaiList.gameObject;
        this.list.SetSlideAppearRefresh();
        if (this.curStoreId == EnumStoreID.Mall_TeMai) {
            if (listObj.activeSelf && !teMaiListObj.activeSelf) {
                listObj.SetActive(false);
                teMaiListObj.SetActive(true);
            }
            this.updateTehuiStoreData();
        } else {
            if (!listObj.activeSelf && teMaiListObj.activeSelf) {
                listObj.SetActive(true);
                teMaiListObj.SetActive(false);
            }
            this._updateStoreData(storeID, isDiffTab);
            if (isDiffTab) {
                this.list.ScrollTop();
            }
        }
        //默认选中第一个商品
        this.onClickList(0);
        // 更新货币
        if (storeID == KeyWord.OTHER_FUNCTION_JJR_MRXG)
            this.m_currencyID = G.DataMgr.npcSellData.getExcIDByStoreID(this.curLimitId);
        else
            this.m_currencyID = G.DataMgr.npcSellData.getExcIDByStoreID(storeID);
        this.onUpdateMoneyShow();
    }

    private showStoreUI(item: ListItem) {
        let mallItem = item.data.mallItem as MallItem;
        let data = this.mallItemDatas[item.Index];
        if (!item.data.mallItem) {
            mallItem = new MallItem();
            mallItem.setComponents(item.gameObject, MallView.itemIcon_Normal);
            item.data.mallItem = mallItem;
        }
        mallItem.update(data);
    }


    //分为展示普通商品和特卖商品
    private _updateStoreData(storeId: EnumStoreID, isDiffTab: boolean): void {
        let npcSellData: NPCSellData = G.DataMgr.npcSellData;
        if (storeId == KeyWord.OTHER_FUNCTION_JJR_MRXG) {
            //限购礼包数据特殊处理
            this.mallItemDatas = npcSellData.getMallLimitList();
            this.curLimitId = npcSellData.getMallLimitMallId();
        }
        else {
            this.mallItemDatas = npcSellData.getMallListByType(storeId);
        }
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

    /**刷新特卖商店数据*/
    private updateTehuiStoreData() {
        let npcSellData: NPCSellData = G.DataMgr.npcSellData;
        this.mallItemDatas = npcSellData.getMallListByType(EnumStoreID.Mall_TeMai);
        let datas: MarketItemData[] = [];
        for (let i = 0; i < this.mallItemDatas.length; i++) {
            let data = this.mallItemDatas[i];
            if (data.sellConfig.m_iSaleCondVal == this.loopWeekDay) {
                datas.push(data);
            }
        }
        this.mallItemDatas = datas;
        this.teMaiList.Count = this.mallItemDatas.length;
        for (let i = 0; i < this.mallItemDatas.length; i++) {
            let obj = this.teMaiList.GetItem(i).gameObject;
            let data = this.mallItemDatas[i];
            let item = this.getTeMaiListItem(i, obj);
            item.update(data);
        }
    }


    private getTeMaiListItem(index: number, obj: UnityEngine.GameObject): TeMaiLiBaoItem {
        if (index < this.temaiListItems.length) {
            return this.temaiListItems[index];
        } else {
            let item = new TeMaiLiBaoItem();
            item.setCommonpents(obj);
            this.temaiListItems.push(item);
            return item;
        }
    }

    private getPrice(num: number, isDiscount: boolean = true): number {
        let id = this.curStoreId;
        if (id == KeyWord.OTHER_FUNCTION_JJR_MRXG)
            id = this.curLimitId;
        let price: number = G.DataMgr.npcSellData.getPriceByID(this.selectedItemData.sellConfig.m_iItemID, 0, id, this.m_currencyID, num, false, false, isDiscount);
        return price;
    }

    private onClickReturnBtn() {
        this.close();
    }


    onUpdateMoneyShow(): void {
        let price = this.getPrice(this.numInput.num, true);
        this.costBar.setCurrencyID(this.m_currencyID, true);
        this.costBar.setPrice(price, 0 == G.ActionHandler.getLackNum(this.m_currencyID, price, false) ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH, null);
        this.hasBar.setCurrencyID(this.m_currencyID, true);
        this.hasBar.setPrice(G.DataMgr.getOwnValueByID(this.m_currencyID));



    }

    onSellLimitDataChange() {
        if (this.curStoreId == EnumStoreID.Mall_TeMai) {
            this.updateTehuiStoreData();
        } else {
            this._updateStoreData(this.curStoreId, false);
        }

        this.selectedItemData = this.mallItemDatas[this.curSelected];
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
                this.txtCanGet.text = uts.format("限购：{0}个", TextFieldUtil.getColorText(restCnt.toString(), restCnt > 0 ? Color.GREEN : Color.RED));
            } else {
                this.txtCanGet.text = uts.format("不限购");
            }
            this.onUpdateMoneyShow();
        }
    }

}