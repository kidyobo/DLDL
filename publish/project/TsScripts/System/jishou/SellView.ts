import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { ThingData } from 'System/data/thing/ThingData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { UIPathData } from "System/data/UIPathData"
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { JishouItemData } from "System/jishou/JishouItemData"
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { IconItem } from 'System/uilib/IconItem'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Color } from 'System/utils/ColorUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { List, ListItem } from 'System/uilib/List'
import { Macros } from 'System/protocol/Macros'
import { BagItemData } from 'System/bag/BagItemData'
import { BagView } from 'System/bag/view/BagView'
import { GameIDUtil } from "System/utils/GameIDUtil"
import { NumInput } from 'System/uilib/NumInput'
import { UIUtils } from 'System/utils/UIUtils'
import { EnumEffectRule } from 'System/constants/GameEnum'
import { TabSubForm } from 'System/uilib/TabForm'
import { AuctionTreeData } from 'System/jishou/AuctionTreeData'
import { ConfirmCheck } from "System/tip/TipManager"
import { MessageBoxConst } from "System/tip/TipManager"




class SellItem extends ListItemCtrl {
    /**物品名称*/
    private txtName: UnityEngine.UI.Text;
    private txtPrice: UnityEngine.UI.Text;
    private btnCancel: UnityEngine.GameObject;
    private icon: UnityEngine.GameObject;
    private iconItem: IconItem;


    setComponents(go: UnityEngine.GameObject, icon: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, 'txtName');
        this.txtPrice = ElemFinder.findText(go, 'txtPrice');
        this.btnCancel = ElemFinder.findObject(go, 'btnCancel');
        this.icon = ElemFinder.findObject(go, 'icon');
        if (this.iconItem == null) {
            this.iconItem = new IconItem();
            this.iconItem.effectRule = EnumEffectRule.none;
            this.iconItem.setUsualIconByPrefab(icon, this.icon);
            this.iconItem.setTipFrom(TipFrom.normal);
        }
    }

    update(data: JishouItemData) {
        Game.UIClickListener.Get(this.btnCancel).onClick = delegate(this, this.onClickBtnCancel, data);
        this.iconItem.updateByThingItemData(data.data);
        this.iconItem.updateIcon();
        if (data.data.config != null) {
            let colorName = Color.getColorById(data.data.config.m_ucColor);
            this.txtName.text = TextFieldUtil.getColorText(data.data.config.m_szName, colorName);
        }
        else {
            this.txtName.text = TextFieldUtil.getColorText("十万铜钱", Color.TONGQIAN);

        }
        let str = TextFieldUtil.getColorText(uts.format("{0}钻石", data.price.toString()), Color.ORANGE);
        this.txtPrice.text = uts.format("价格 {0}", str);
    }

    private onClickBtnCancel(data: JishouItemData) {
        G.TipMgr.showConfirm('您确定要下架该物品吗？', ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onClickConfirmBtn, data));


    }

    private onClickConfirmBtn(stage: MessageBoxConst, isCheckSelected: boolean, data: JishouItemData) {
        if (MessageBoxConst.yes == stage) {
            if (data.id as Protocol.PSBID) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPPStoreCancelMyRequestMsg(data.id as Protocol.PSBID, 1, 0));
            }
        }
    }

}


export class SellView extends TabSubForm {

    private m_npcID: number = 0;

    private m_listData1: JishouItemData[];
    private m_otherSellListData: JishouItemData[];

    private m_totalPage: number = 0;

    private m_currentPage: number = 0;
    private txtSellNum: UnityEngine.UI.Text;

    private sell: UnityEngine.GameObject;
    private name: UnityEngine.UI.Text;
    private lv: UnityEngine.UI.Text;
    private mask: UnityEngine.GameObject;
    private notThingTip: UnityEngine.UI.Text;
    private sellNum: UnityEngine.UI.Text;
    private sellList: List;
    private otherSellList: List;


    ////////背包相关////////////////
    /** 背包开始的格子数量 */
    private readonly DEFAULT_CAPACITY: number = 70;
    /** 背包最大格子数量 */
    private readonly MAX_CAPACITY: number = 160;
    /**背包全部Item的父物体*/
    private bagList: List;
    private listDataBag: BagItemData[];
    private bagiconItems: IconItem[] = [];
    private bagSelectIndex: number = 0;
    /**背包（全部，装备，材料，其他 tab）*/
    private tabBagGroup: UnityEngine.UI.ActiveToggleGroup = null;
    /**非绑定的物品*/
    private notBandThingItem: ThingItemData[];

    private selectIconItem: IconItem;

    private m_npcId: number = 0;

    /**数量输入*/
    private numInput: NumInput;

    /**数量输入*/
    private priceInput: NumInput;

    /**确定交易所*/
    private m_btnSell: UnityEngine.GameObject;
    private m_tfBtnSell: UnityEngine.UI.Text;

    /**最大数量。*/
    static MAX_COUNT: number = 99;
    private otherSellMaxCount: number = 10;
    private btnMax: UnityEngine.GameObject;
    private MAX_SELLCOUNT: number = 12;
    private txtToalCost: UnityEngine.UI.Text;
    /**即将上架的物品*/
    private willSellThing: ThingItemData;
    private btnSell: UnityEngine.GameObject;
    private btnCancleSell: UnityEngine.GameObject;
    private noThingBg: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;

    private bagIconItems: IconItem[] = [];
    private jishouItem: SellItem[] = [];
    private otherJishouItem: SellItem[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_SALE);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.SellView;
    }

    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.mask = this.elems.getElement("mask");
        this.sellList = this.elems.getUIList("sellList");
        this.otherSellList = this.elems.getUIList('otherSellList');
        this.tabBagGroup = this.elems.getToggleGroup('tabBagGroup');
        this.bagList = this.elems.getUIList("bagList");
        this.selectIconItem = new IconItem();
        this.selectIconItem.setTipFrom(TipFrom.normal);
        //this.selectIconItem.effectRule = EnumEffectRule.none;
        this.selectIconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement("selectIcon"));

        this.numInput = new NumInput();
        this.numInput.setComponents(this.elems.getElement('numInput'));
        this.numInput.onValueChanged = delegate(this, this.onNumInputValueChanged);
        this.btnMax = this.elems.getElement('btnMax');
        this.btnSell = this.elems.getElement('btnSell');
        this.btnCancleSell = this.elems.getElement('btnCancleSell');

        this.priceInput = new NumInput();
        this.priceInput.setComponents(this.elems.getElement('priceInput'));
        this.priceInput.onValueChanged = delegate(this, this.onPriceInputValueChanged);
        //总价
        this.txtToalCost = this.elems.getText("txtToalCost");
        this.sell = this.elems.getElement('sell');
        this.notThingTip = this.elems.getText('notThingTip');
        this.name = this.elems.getText('name');
        this.lv = this.elems.getText('lv');
        this.sellNum = this.elems.getText('sellNum');
        this.noThingBg = this.elems.getElement('noThingBg');
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onBtnCancleSellClick);
        // this.addClickListener(this.elems.getElement("btnReturn"), this.onClickBtnMask);
        this.addClickListener(this.btnMax.gameObject, this.onClickBtnMax);
        this.addClickListener(this.btnSell.gameObject, this.onBtnSellClick);
        this.addClickListener(this.btnCancleSell, this.onBtnCancleSellClick);
        this.addListClickListener(this.bagList, this.onBagItemClick);
        this.addToggleGroupListener(this.tabBagGroup, this.onBagTab);

        this.bagList.onVirtualItemChange = delegate(this, this.showBagUI);
    }


    open(data: ThingItemData = null) {
        this.willSellThing = data;
        super.open();
    }

    protected onOpen() {
        if (this.willSellThing != null) {
            this.selectIconItem.updateByThingItemData(this.willSellThing);
            this.selectIconItem.updateIcon();
            this.initNumInputCount(this.willSellThing);
            this.initPriceInputCount();
            UIUtils.setButtonClickAble(this.btnSell, true);
        } else {
            this.resetview();
        }
        this._sendMyStoreRequest();
    }

    private resetview(): void {
        //单价，数量，总价钱重置
        this.numInput.num = 1;
        this.priceInput.num = 1;
        this.txtToalCost.text = "1";
        //清空上架图标的显示
        this.selectIconItem.updateByThingItemData(null);
        this.selectIconItem.updateIcon();
        UIUtils.setButtonClickAble(this.btnSell, false);
        //背包位置置顶
        this.bagList.ScrollTop();
        //默认选择第一个页（全部）
        this.tabBagGroup.Selected = 0;
        //得到背包全部页数据
        this.bagList.SetSlideAppearRefresh();
        this.getBagData(0);
    }

    protected onClose() {
        if (this.sell.activeSelf) {
            this.sell.SetActive(false);
        }
    }

    private onClickBtnMask() {
        this.close();
    }


    onMyStoreQueryResponse(msg: Protocol.PPStoreDispMy_Response): void {
        let response: Protocol.PPStoreDispMy_Response = msg;

        if (response.m_ushResultID == 0) {
            let numItem: number = response.m_stPSBInfoList.m_ucPSBNumber;
            //自测试使用改为10
            if (this.m_listData1 == null) {
                this.m_listData1 = new Array<JishouItemData>();
            }
            this.m_listData1.length = numItem;
            this.sellList.Count = numItem;
            this.noThingBg.SetActive(numItem == 0);
            this.sellNum.text = uts.format('出售商品:{0}/{1}', numItem, this.MAX_SELLCOUNT);
            let psbInfo: Protocol.PSBInfo;
            for (let i: number = 0; i < numItem; i++) {
                psbInfo = response.m_stPSBInfoList.m_astPSBInfo[i];
                if (this.m_listData1[i] == null) {
                    this.m_listData1[i] = new JishouItemData();
                    this.m_listData1[i].data = new ThingItemData();
                    this.m_listData1[i].data.data = {} as Protocol.ContainerThingInfo;
                }

                this.m_listData1[i].id = psbInfo.m_stID;
                this.m_listData1[i].price = psbInfo.m_iEachPrice;

                this.m_listData1[i].data.config = ThingData.getThingConfig(psbInfo.m_stAccessoryInfo.m_iThingID);

                this.m_listData1[i].data.data.m_iThingID = psbInfo.m_stAccessoryInfo.m_iThingID;
                this.m_listData1[i].data.data.m_iNumber = psbInfo.m_stAccessoryInfo.m_iThingNumber;
                this.m_listData1[i].data.data.m_stThingProperty = psbInfo.m_stAccessoryInfo.m_stAccessoryThing.m_stAccessoryThing.m_stThingProp;
                this.m_listData1[i].page = response.m_iPageNo;

                if (this.jishouItem[i] == null) {
                    this.jishouItem[i] = new SellItem();
                    let item = this.sellList.GetItem(i);
                    this.jishouItem[i].setComponents(item.gameObject, this.itemIcon_Normal);
                }


                this.jishouItem[i].update(this.m_listData1[i]);
            }
            this.m_totalPage = response.m_iTotalPages;

        }
        else {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_ushResultID));
        }
    }

    onCanelResponse(msg: Protocol.PPStoreCancelMy_Response): void {
        let response: Protocol.PPStoreCancelMy_Response = msg;

        if (response.m_ushResultID == 0) {
            this._sendMyStoreRequest();
            G.TipMgr.addMainFloatTip('下架成功');
        }
        else {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_ushResultID));
        }
    }



    private _sendMyStoreRequest(): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPPStoreDispMyRequestMsg(1, this.m_npcID));
    }

    onUpdateList(msg: Protocol.PPStoreSell_Response): void {
        this._sendMyStoreRequest();
        this._onSellReponse(msg);

    }

    protected _processOpenParam(param: number = null): void {
        this.m_npcID = param;
        this._sendMyStoreRequest();
    }


    updataView(type: number) {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.getBagData(0);
        }
    }


    /**
 * 背包切换，全部，装备，技能，材料，其他显示
 * @param index
 */
    private onBagTab(index: number): void {
        this.bagSelectIndex = index;
        this.bagList.ScrollTop();
        this.bagList.SetSlideAppearRefresh();
        this.getBagData(index);
    }

    /**
   * 背包数据处理  
   */
    private getBagData(tabIndex: number): void {
        this.notBandThingItem = [];
        let tabKey: number = tabIndex;
        let otherThingItem: ThingItemData[];
        let isBinding: boolean;
        let rawDatas: { [position: number]: ThingItemData } = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_BAG);
        let rawObj: ThingItemData;
        //表示默认的全部显示tabKey == 0
        if (tabKey == 0) {
            for (let i = 0; i < G.DataMgr.thingData.bagCapacity; i++) {
                rawObj = rawDatas[i];
                if (null != rawObj) {
                    isBinding = GameIDUtil.isBingThingByContainerInfo(rawObj.config.m_iID, rawObj.data);
                    if (!isBinding && rawObj.config.m_ucAuctionClass1 > 0) {
                        this.notBandThingItem.push(rawObj);
                    }
                }
            }
        }
        else {
            //其他页签紧凑显示，不可拖动
            let itemPosList: number[] = new Array<number>();
            otherThingItem = [];
            for (let posStr in rawDatas) {
                // 进行过滤
                rawObj = rawDatas[posStr];
                //物品类型         
                if (tabIndex == rawObj.config.m_iBagClass) {
                    itemPosList.push(parseInt(posStr));
                    isBinding = GameIDUtil.isBingThingByContainerInfo(rawObj.config.m_iID, rawObj.data);
                    if (!isBinding && rawObj.config.m_ucAuctionClass1 > 0) {
                        this.notBandThingItem.push(rawObj);
                    }
                }
            }
        }

        let equipCnt = this.notBandThingItem.length;
        // 显示完整的行数
        let showEquipCnt = equipCnt;
        if (showEquipCnt < 42) {
            // 最少显示7行,1行6个
            showEquipCnt = 42;
        } else {
            showEquipCnt = Math.ceil(equipCnt / 6) * 6;
        }

        this.bagList.Count = showEquipCnt;

        this.bagList.Refresh();

    }
    private _sortByPosition(a: number, b: number): number {
        return a - b;
    }


    private showBagUI(item: ListItem): void {
        let iconItem = item.data.iconItem as IconItem;
        let bagItem = this.notBandThingItem[item.Index];
        if (!item.data.iconItem) {
            let parent = item.findObject('bagBg');
            iconItem = new IconItem();
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, parent);
            iconItem.isCompareAllPetEquip = true;
            iconItem.effectRule = EnumEffectRule.none;
            item.data.iconItem = iconItem;
        }
        iconItem.updateByThingItemData(bagItem);
        iconItem.updateIcon();
    }


    private onBagItemClick(index: number) {
        if (this.notBandThingItem[index] != null) {
            this.selectIconItem.updateByThingItemData(this.notBandThingItem[index]);
            this.selectIconItem.updateIcon();
            this.willSellThing = this.notBandThingItem[index];
            this.initNumInputCount(this.notBandThingItem[index]);
            this.initPriceInputCount();
            //this.btnSell.interactable = true;
            //UIUtils.setGrey(this.btnSell.gameObject, false);
            let colorValue = (this.willSellThing.config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING) ? G.DataMgr.equipStrengthenData.getWingEquipColor(this.willSellThing.config, this.willSellThing.data) : this.willSellThing.config.m_ucColor;
            let colorName = Color.getColorById(colorValue);
            this.name.text = TextFieldUtil.getColorText(this.willSellThing.config.m_szName, colorName);
            if (GameIDUtil.isHunguEquipID(this.willSellThing.config.m_iID)) {
                this.lv.text = KeyWord.getDesc(KeyWord.GROUP_DOULUO_TITLE_TYPE, this.willSellThing.config.m_ucHunLiLevel) + "使用";
            }
            else {
                this.lv.text = '等级' + this.willSellThing.config.m_ucRequiredLevel.toString();
            }
            UIUtils.setButtonClickAble(this.btnSell, true);
            this.sell.SetActive(true);
            let class1: number = this.notBandThingItem[index].config.m_ucAuctionClass1;
            let class2: number = this.notBandThingItem[index].config.m_ucAuctionClass2;
            let classID = AuctionTreeData.getClassId(class1, class2);
            let cost: number = Math.floor(G.DataMgr.constData.getValueById(KeyWord.ROLE_LEVEL_LIMIT));

            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPPStoreSortRequestMsg(classID, 1, Macros.PPSTORESORT_REQUEST_TYPE_PRICE, Macros.PPSTORESORT_REQUEST_ASC, '', 0, cost, 0, this.m_npcId));

        }
    }


    ///////////////////////////////////////////

    private onNumInputValueChanged(num: number): void {
        // 更新总价
        this.txtToalCost.text = (this.numInput.num * this.priceInput.num).toString();
        let custodialFeesProp: number = G.DataMgr.constData.getValueById(KeyWord.CONSIGNMENT_CUSTODIAL_FEES_PROP) as number;
        let custodialFeesMax: number = G.DataMgr.constData.getValueById(KeyWord.CONSIGNMENT_CUSTODIAL_FEES_MAX) as number;
    }

    private onPriceInputValueChanged(num: number): void {
        // 更新总价
        this.txtToalCost.text = (this.numInput.num * this.priceInput.num).toString();
        let custodialFeesProp: number = G.DataMgr.constData.getValueById(KeyWord.CONSIGNMENT_CUSTODIAL_FEES_PROP) as number;
        let custodialFeesMax: number = G.DataMgr.constData.getValueById(KeyWord.CONSIGNMENT_CUSTODIAL_FEES_MAX) as number;
    }

    private initNumInputCount(data: ThingItemData): void {
        let ceil: number = 0
        if (null != data) {
            ceil = data.data.m_iNumber;
        }
        else {
            ceil = 0;
        }
        this.numInput.setRange(1, ceil, 1);
    }

    private initPriceInputCount(): void {
        let ceil: number = 999999;

        this.priceInput.setRange(1, ceil, 1, this.priceInput.num);
    }

    private onBtnSellClick(): void {
        let data: ThingItemData = this.willSellThing;
        if (data != null) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPPStoreSell_RequestMsg(data.data.m_iThingID, data.data.m_usPosition, this.numInput.num, this.priceInput.num, 36, this.m_npcId));
        }
        this.sell.SetActive(false);
    }

    private onBtnCancleSellClick() {
        this.sell.SetActive(false);
    }

    private _onSellReponse(msg: Protocol.PPStoreSell_Response): void {
        let response: Protocol.PPStoreSell_Response = msg;
        if (response.m_ushResultID == 0) {
            this.priceInput.num = 1;
            this.numInput.setRange();
            this.priceInput.setRange();
            this.selectIconItem.updateByThingItemData(null);
            this.selectIconItem.updateIcon();
            //this.btnSell.interactable = false;
            //UIUtils.setGrey(this.btnSell.gameObject, true);
            UIUtils.setButtonClickAble(this.btnSell, false);
            G.TipMgr.addMainFloatTip('上架成功');
        }
        else {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_ushResultID));
        }
    }

    _onSellQueryResponse(msg: Protocol.PPStoreQuery_Response): void {

        let response: Protocol.PPStoreQuery_Response = msg;
        let count: number = 0;
        if (response.m_ushResultID == 0) {
            let numItem: number = response.m_stPSDInfoList.m_ucPSDNumber;
            numItem = numItem >= this.otherSellMaxCount ? this.otherSellMaxCount : numItem;
            //自测试使用改为10
            if (this.m_otherSellListData == null) {
                this.m_otherSellListData = new Array<JishouItemData>();
            }
            this.m_otherSellListData.length = numItem;
            this.otherSellList.Count = numItem;
            let psbInfo: Protocol.PSDInfo;

            for (let i: number = 0; i < numItem; i++) {
                psbInfo = response.m_stPSDInfoList.m_astPSDInfo[i];
                if (this.willSellThing.config.m_iID != psbInfo.m_stAccessoryInfo.m_iThingID) {
                    continue;
                }
                count++;
                if (this.m_otherSellListData[i] == null) {
                    this.m_otherSellListData[i] = new JishouItemData();
                    this.m_otherSellListData[i].data = new ThingItemData();
                    this.m_otherSellListData[i].data.data = {} as Protocol.ContainerThingInfo;
                }

                this.m_otherSellListData[i].id = psbInfo.m_stID;
                this.m_otherSellListData[i].price = psbInfo.m_iEachPrice;

                this.m_otherSellListData[i].data.config = ThingData.getThingConfig(psbInfo.m_stAccessoryInfo.m_iThingID);

                this.m_otherSellListData[i].data.data.m_iThingID = psbInfo.m_stAccessoryInfo.m_iThingID;
                this.m_otherSellListData[i].data.data.m_iNumber = psbInfo.m_stAccessoryInfo.m_iThingNumber;
                this.m_otherSellListData[i].data.data.m_stThingProperty = psbInfo.m_stAccessoryInfo.m_stAccessoryThing.m_stAccessoryThing.m_stThingProp;
                this.m_otherSellListData[i].page = response.m_iPageNo;

                if (this.otherJishouItem[count - 1] == null) {
                    this.otherJishouItem[count - 1] = new SellItem();
                    let item = this.otherSellList.GetItem(count - 1);
                    this.otherJishouItem[count - 1].setComponents(item.gameObject, this.itemIcon_Normal);
                }


                this.otherJishouItem[count - 1].update(this.m_otherSellListData[i]);
            }
            this.m_totalPage = response.m_iTotalPages;

        }
        else {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_ushResultID));
        }
        if (count == 0) {
            this.notThingTip.gameObject.SetActive(true);
            this.otherSellList.Count = 0;
        } else {
            this.otherSellList.Count = count;
            this.notThingTip.gameObject.SetActive(false);
        }


    }

    private onClickBtnMax(): void {
        this.numInput.num = this.numInput.maxNum;
    }

}
