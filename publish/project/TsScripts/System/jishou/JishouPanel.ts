import { KeyWord } from 'System/constants/KeyWord'
import { TipFrom } from 'System/tip/view/TipsView'
import { UIPathData } from "System/data/UIPathData"
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { ThingData } from 'System/data/thing/ThingData'
import { Macros } from 'System/protocol/Macros'
import { HotItemData } from 'System/jishou/HotItemData'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { JishouItemData } from 'System/jishou/JishouItemData'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'
import { List, ListItem } from 'System/uilib/List'
import { GroupList } from 'System/uilib/GroupList'
import { AuctionTreeData } from 'System/jishou/AuctionTreeData'
import { JishouData } from 'System/jishou/jishouData'
import { JishouConfirmBuyView } from 'System/jishou/JishouConfirmBuyView'
import { SellView } from 'System/jishou/SellView'
import { TabSubForm } from 'System/uilib/TabForm'

class JishouItem extends ListItemCtrl {
    /**物品名称*/
    private txtName: UnityEngine.UI.Text;
    private txtPingzhi: UnityEngine.UI.Text;
    private txtLv: UnityEngine.UI.Text;
    private txtMoney: UnityEngine.UI.Text;
    private moneyLabel: UnityEngine.UI.Text;
    private btnBuy: UnityEngine.GameObject;
    private icon: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;
    private iconItem = new IconItem();
    private data: JishouItemData;

    setComponents(go: UnityEngine.GameObject, icon: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, 'txtName');
        this.txtPingzhi = ElemFinder.findText(go, 'txtPingzhi');
        this.txtLv = ElemFinder.findText(go, 'txtLv');
        this.txtMoney = ElemFinder.findText(go, 'txtMoney');
        this.btnBuy = ElemFinder.findObject(go, 'btnBuy');
        this.icon = ElemFinder.findObject(go, 'icon');
        this.moneyLabel = ElemFinder.findText(go, 'moneyLabel');
        this.bg2 = ElemFinder.findObject(go, 'bg2');
        this.iconItem.setUsualIconByPrefab(icon, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);
        Game.UIClickListener.Get(this.btnBuy.gameObject).onClick = delegate(this, this.onClickBtnBuy);
    }

    update(data: JishouItemData) {
        this.data = data;

        this.iconItem.updateByThingItemData(data.data);
        this.iconItem.updateIcon();
        this.txtPingzhi.gameObject.SetActive(false);
        this.bg2.SetActive(true);
        if (data.data.config != null) {

            let colorValue = (data.data.config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING) ? G.DataMgr.equipStrengthenData.getWingEquipColor(data.data.config, data.data.data) : data.data.config.m_ucColor;
            let colorName = Color.getColorById(colorValue);
            this.txtName.text = TextFieldUtil.getColorText(data.data.config.m_szName, colorName);
            this.txtLv.text = data.data.config.m_ucRequiredLevel.toString();
            let txt = KeyWord.getDesc(KeyWord.GROUP_ITEM_COLOR, data.data.config.m_ucColor);
            let color = Color.getColorById(data.data.config.m_ucColor);
            this.txtPingzhi.text = TextFieldUtil.getColorText(txt, color);
            this.moneyLabel.text = '价格:';
            this.btnBuy.SetActive(true);

        }
        else {
            this.txtName.text = TextFieldUtil.getColorText("十万铜钱", Color.TONGQIAN);
            this.txtLv.text = "--";
            this.txtPingzhi.text = TextFieldUtil.getColorText("--", Color.WHITE);
        }
        let str = TextFieldUtil.getColorText(uts.format("{0}钻石", data.price.toString()), Color.ORANGE);
        this.txtMoney.text = uts.format("价格 {0}", str);
    }

    updateByThingData(thingData: GameConfig.ThingConfigM, count: number, minPrice: number) {
        this.bg2.SetActive(false);
        this.txtPingzhi.gameObject.SetActive(true);
        this.iconItem.updateById(thingData.m_iID, 0);

        this.iconItem.updateIcon();
        let colorValue = thingData.m_ucColor;
        let colorName = Color.getColorById(colorValue);
        this.txtName.text = TextFieldUtil.getColorText(thingData.m_szName, colorName);
        let str = TextFieldUtil.getColorText(uts.format("{0}钻石", minPrice.toString()), Color.ORANGE);
        this.txtMoney.text = uts.format("价格 {0}", str);
        this.txtPingzhi.text = '在售数量' + TextFieldUtil.getColorText(count.toString(), count > 0 ? Color.GREEN : null);
        this.moneyLabel.text = '最低价:';
        this.btnBuy.SetActive(false);
    }


    private onClickBtnBuy() {
        G.Uimgr.createForm<JishouConfirmBuyView>(JishouConfirmBuyView).open(this.data, 0);
    }
}

export enum EnumJiShouTab {
    Market = 0,
    Sell,
}

/**
 * 交易所主面板
 * 
 */
export class JishouPanel extends TabSubForm {
    private m_listData: JishouItemData[] = [];

    /**npcid*/
    private m_npcId: number = 0;

    /**当前类型*/
    private m_class: number = 0;
    /**二级页签的类型*/
    private m_class2: number = 0;

    /**当前页*/
    private m_currentPage: number = 0;

    /**总页数*/
    private m_totalPage: number = 0;

    /**排序项*/
    private m_sortType: number = 0;

    /**升序降序*/
    private m_orderType: number = 0;

    /**当前关键字*/
    private m_keyWord: string;

    /**当前选择颜色*/
    private curSelectColor: number = 0;

    /**当前的大类和小类*/
    private classType1: number = 0;
    private classType2: number = 0;
    private AuctionClassData: GameConfig.ThingConfigM[] = [];
    private curSelectItemIndex: number = 0;
    private oldSelectItemIndex: number = 0;
    private oldSeconedItemIndex: number = 0;
    private oldClassId: number = 0;
    private canClickResponse: boolean = false;
    private itemSummInfoMap: { [id: number]: Protocol.PPStotrItemSumm } = {};
    private newAuctionClassData: GameConfig.ThingConfigM[] = [];

    private hotListData: HotItemData[] = new Array<HotItemData>();

    private _tabColor: number[] = [
        0,
        KeyWord.COLOR_BLUE,
        KeyWord.COLOR_PURPLE,
        KeyWord.COLOR_ORANGE,
        KeyWord.COLOR_GOLD,
        KeyWord.COLOR_RED,
        KeyWord.COLOR_PINK
    ];
    private _typeList: JishouData[];

    // private btnReturn: UnityEngine.GameObject;

    private list: List;
    private groupList: GroupList;

    /**1级选择大类（装备，技能书，进阶材料，其他物品）*/
    private firstSelected: number = 0;
    /**2级选择具体物品*/
    private seconedSelected: number = 0;
    /**1级，大类*/
    private firsrStr: string[] = [];
    /**2级，具体那个物品*/
    private secondNumber: number[];
    private secondType: { [first: number]: string[] } = {};
    private auctionClassData: GameConfig.ThingConfigM[] = [];

    private curDropdownSelect: number = 0;

    private dropDown: UnityEngine.UI.Dropdown;

    private readonly dropTypes: string[] = ["所有品质", "蓝色品质", "紫色品质", "橙色品质", "金色品质", "红色品质", "粉色品质"];
    private readonly dropColorTypes: string[] = [Color.ITEM_GREEN, Color.ITEM_BLUE, Color.ITEM_PURPLE, Color.ITEM_ORANGE, Color.ITEM_GOLD, Color.ITEM_RED, Color.ITEM_PINK];

    ////////////////////////////////////////// 物品颜色 //////////////////////////////////////////

    private btnSouSuo: UnityEngine.GameObject;
    private btnJisou: UnityEngine.GameObject;
    private InputFielName: UnityEngine.UI.InputField;
    private txtHaveMoney: UnityEngine.UI.Text;
    private navigationLabel: UnityEngine.UI.Text;
    private Toggle: UnityEngine.UI.ActiveToggle;

    /**向服务段每100毫秒请求一次*/
    private readonly sendTime: number = 100;
    /**存放多次服务器发来的数据*/
    private allListData: JishouItemData[];

    /**当前发送给服务器的页书索引*/
    private curSendPage: number = 0;

    private jishouItem: JishouItem[] = [];
    private itemIcon_Normal: UnityEngine.GameObject;

    private curClassOneIndex: number = -1;
    private curClassTwoIndex: number = -1;
    private navigationText: string = '';

    private openTab = EnumJiShouTab.Market;
    constructor() {
        super(KeyWord.OTHER_FUNCTION_BACK);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.JishouPanel;
    }

    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        // this.btnReturn = this.elems.getElement("btnReturn");
        this.list = this.elems.getUIList("list");
        this.groupList = this.elems.getUIGroupList("groupList");
        //下拉列表字体添加颜色
        this.dropDown = this.elems.getDropdown('dropdown');
        let colorStrs: string[] = [];
        for (let i = 0; i < this.dropTypes.length; i++) {
            let colorStr = TextFieldUtil.getColorText(this.dropTypes[i], this.dropColorTypes[i]);
            colorStrs.push(colorStr)
        }
        this.dropDown.AddOptions(colorStrs);
        this.btnSouSuo = this.elems.getElement("btnSouSuo");
        this.btnJisou = this.elems.getElement("btnJisou");
        this.InputFielName = this.elems.getInputField("InputFielName");
        this.txtHaveMoney = this.elems.getText("txtHaveMoney");
        this.navigationLabel = this.elems.getText('navigationLabel');
        this.Toggle = this.elems.getActiveToggle('Toggle');
    }

    protected initListeners(): void {
        this.groupList.onClickItem = delegate(this, this.onClickGroupItem);
        this.dropDown.onValueChanged = delegate(this, this.onDropValueChanged);
        this.addClickListener(this.btnSouSuo, this.onBtnSearchClick);
        this.list.onClickItem = delegate(this, this.onClickListItem);
        this.Toggle.onValueChanged = delegate(this, this.showAllJiShou);
    }

    open(openTab = EnumJiShouTab.Market) {
        this.openTab = openTab;
        super.open();
    }

    protected onOpen() {

        //默认
        this.curSelectColor = 0;
        this.m_class = KeyWord.AUCTION_CLASS1_EQUIP;
        this.m_sortType = Macros.PPSTORESORT_REQUEST_TYPE_COLOR;
        this.m_orderType = Macros.PPSTORESORT_REQUEST_DESC;
        this.m_currentPage = 1;
        this.m_class = 0;

        this.init();
        this.updataMoney()
        this.groupList.onClickItem(0);
        this.groupList.Selected = 0;
        this.groupList.GetSubList(0).onClickItem(0);
        this.groupList.GetSubList(0).Selected = 0;
        this.Toggle.isOn = false;
    }

    protected onClose() {
    }


    private onClickBtnReturn() {
        this.close();
    }

    private resetValue() {
        this.list.Count = 0;
        this.allListData = [];
        this.m_currentPage = 0;
        this.curSendPage = 0;
        this.m_totalPage = 0;
    }

    private onDropValueChanged(value: number) {

        this.curDropdownSelect = value;
        this.curSelectColor = this._tabColor[this.curDropdownSelect];

        //点击的时候不搜索了
        //this._sendQueryStoreRequest();
    }



    /**
    * 1级选择
    */
    private onClickGroupItem(index: number) {
        this.resetValue();
        this.groupList.GetSubList(index).Selected = 0;
        this.firstSelected = index;
        this.m_currentPage = 1;
        this.m_keyWord = '';
        this.curSelectColor = this._tabColor[this.curDropdownSelect];
        let data = this._typeList[this.firstSelected];
        //没有子对象
        this.m_class = data.classID;
        this.classType1 = data.classType;
        this.m_sortType = Macros.PPSTORESORT_REQUEST_TYPE_PRICE;
        this.m_orderType = Macros.PPSTORESORT_REQUEST_ASC;

        if (!this.groupList.GetItem(index).Selected) {
            this.navigationLabel.gameObject.SetActive(true);
            this.navigationLabel.text = this.firsrStr[index];
            this.groupList.GetSubList(index).onClickItem(0);
        } else {
            this.navigationLabel.gameObject.SetActive(false);
        }
    }
    /**
     * 2级选择
     * @param index
     */
    private onClickItem(index: number) {
        this.canClickResponse = true;
        this.navigationLabel.text = this.firsrStr[this.firstSelected];
        this.resetValue();
        this.seconedSelected = index;
        this.m_currentPage = 1;
        this.m_keyWord = '';
        this.curSelectColor = this._tabColor[this.curDropdownSelect];
        let data = this._typeList[this.firstSelected].items[this.seconedSelected];
        this.classType2 = data.classType;
        //有子对象
        this.m_class = data.classID;
        this.m_class2 = data.classID;
        this.m_sortType = Macros.PPSTORESORT_REQUEST_TYPE_PRICE;
        this.m_orderType = Macros.PPSTORESORT_REQUEST_ASC;
        this.navigationLabel.text = this.firsrStr[this.firstSelected] + '>' + this.secondType[this.firstSelected][this.seconedSelected];
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPPStoreGetAllThingNumRequestMsg(this.m_class, G.DataMgr.heroData.roleID));
    }

    private onClickListItem(index: number) {
        if (!this.Toggle.isOn) {
            this.curSelectItemIndex = index;
        }
        
        if (this.canClickResponse) {
            let itemId = this.newAuctionClassData[index].m_iID;
            let itemInfo = this.itemSummInfoMap[itemId];
            let count: number = 0;
            let minPrice: number = 0;
            if (itemInfo == null) {
                G.TipMgr.addMainFloatTip('没有该类商品出售');
            }
            else {
                this.resetValue();
                this._sendQueryStoreRequest();
            }
            this.navigationLabel.text = this.firsrStr[this.firstSelected] + '>' + this.secondType[this.firstSelected][this.seconedSelected] + '>' + this.newAuctionClassData[this.curSelectItemIndex].m_szName;
        }
    }

    private init() {
        this.resetValue();
        this.m_keyWord = '';

        this.getTitleLabel();
        this.navigationLabel.gameObject.SetActive(false);
    }

    /**
     * 得到标题的文本
     */
    private getTitleLabel() {
        this.firsrStr = [];
        this.secondNumber = [];
        this.secondType = {};
        this._typeList = AuctionTreeData.getTypeList();
        let firstLen = this._typeList.length;
        let i: number;
        for (i = 0; i < firstLen; i++) {
            this.firsrStr.push(this._typeList[i].self);
            let second = this._typeList[i].items.length;
            this.secondNumber[i] = second;
            for (let j = 0; j < second; j++) {
                if (this.secondType[i] == null) {
                    this.secondType[i] = new Array<string>();
                }
                this.secondType[i].push(this._typeList[i].items[j].self);
            }
        }
        this.createItem(firstLen, this.firsrStr, this.secondType);
    }

    /**
     * 根据文本长度，创建Item
     * @param firstCount
     * @param firstType
     * @param secondType
     */
    private createItem(firstCount: number, firstType: string[], secondType: { [first: number]: string[] }) {
        this.groupList.Count = firstCount;
        for (let i: number = 0; i < firstCount; i++) {
            let labelItem = this.groupList.GetItem(i);
            let labelText = labelItem.findText('catalog/normal/text');
            labelText.text = firstType[i];
            labelText = labelItem.findText('catalog/selected/text');
            labelText.text = firstType[i];
            let subList = this.groupList.GetSubList(i);
            subList.onClickItem = delegate(this, this.onClickItem);
            subList.Count = secondType[i].length;
            for (let j: number = 0; j < subList.Count; j++) {
                let petItem = subList.GetItem(j);
                let petNameText = petItem.findText('txtItem');
                petNameText.text = secondType[i][j];
            }
        }
    }

    private showItemUI(data: JishouItemData[]) {
        this.canClickResponse = false;
        let jishouItemDatas: JishouItemData[] = [];
        let datas: JishouItemData[] = [];
        if (this.curSelectItemIndex >= 0) {
            if (this.newAuctionClassData[this.curSelectItemIndex] == null) return;
            let curSelectItemId = this.newAuctionClassData[this.curSelectItemIndex].m_iID;
            for (let itemData of data) {
                if (itemData.data.config.m_iID == curSelectItemId) {
                    jishouItemDatas.push(itemData);
                }
            }
            datas = jishouItemDatas;
        }
        else {
            datas = data;
        }
        this.list.Count = datas.length;

        for (let i = 0; i < datas.length; i++) {

            if (this.jishouItem[i] == null) {
                this.jishouItem[i] = new JishouItem();
                let item = this.list.GetItem(i);
                this.jishouItem[i].setComponents(item.gameObject, this.itemIcon_Normal);
            }
            this.jishouItem[i].update(datas[i]);
        }
    }

    private showItemUIByConfig() {
        if (this.Toggle.isOn) {
            this.oldSeconedItemIndex = 0;
            this.Toggle.isOn = false;
        }
        this.newAuctionClassData = [];
        this.auctionClassData = G.DataMgr.thingData.getAuctionClassData(this.classType1, this.classType2);
        if (this.auctionClassData == null) return;

        for (let i = 0; i < this.auctionClassData.length; i++) {

            let itemId = this.auctionClassData[i].m_iID;
            let itemInfo = this.itemSummInfoMap[itemId];
            let count: number = 0;
            if (itemInfo != null && itemId == itemInfo.m_iItemID) {
                count = itemInfo.m_iItemNum;
            }
            if (this.auctionClassData[i].m_ucAuctionForceShow == 1 || count > 0) {
                this.newAuctionClassData.push(this.auctionClassData[i]);
            }
        }
        let length: number = this.newAuctionClassData.length;
        this.list.Count = length;
        for (let i = 0; i < length; i++) {
            if (this.jishouItem[i] == null) {
                this.jishouItem[i] = new JishouItem();
                let item = this.list.GetItem(i);
                this.jishouItem[i].setComponents(item.gameObject, this.itemIcon_Normal);
            }

            let itemId = this.newAuctionClassData[i].m_iID;
            let itemInfo = this.itemSummInfoMap[itemId];
            let count: number = 0;
            let minPrice: number = 0;

            if (itemInfo != null && itemId == itemInfo.m_iItemID) {
                count = itemInfo.m_iItemNum;
                minPrice = itemInfo.m_iMinPrice;
            }

            this.jishouItem[i].updateByThingData(this.newAuctionClassData[i], count, minPrice);
        }

    }


    _onBuyResponse(msg: Protocol.PPStoreBuy_Response): void {
        this.init();
        this.updataMoney()
        let response: Protocol.PPStoreBuy_Response = msg;
        if (response.m_ushResultID == 0) {
            this._sendQueryStoreRequest();
        }
        else {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_ushResultID));
        }
    }




    updataMoney(): void {
        this.txtHaveMoney.text = G.DataMgr.heroData.noFlGold.toString();
    }



    private _sendQueryStoreRequest(): void {
        this.curSendPage++;
        if (this.curSendPage > this.m_totalPage && this.m_totalPage != 0) {
            return;
        }

        //角色最高等级限制
        let cost: number = Math.floor(G.DataMgr.constData.getValueById(KeyWord.ROLE_LEVEL_LIMIT));

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPPStoreSortRequestMsg(this.m_class, this.curSendPage, this.m_sortType, this.m_orderType, this.m_keyWord, 0, cost, this.curSelectColor, this.m_npcId));
    }


    _onStoreQueryResponse(msg: Protocol.PPStoreQuery_Response): void {
        this.updataMoney();
        let response: Protocol.PPStoreQuery_Response = msg;
        if (response.m_ushResultID == 0) {
            let numItem: number = response.m_stPSDInfoList.m_ucPSDNumber;
            if (this.m_listData == null) {
                this.m_listData = new Array<JishouItemData>();
            }
            this.m_listData.length = numItem;
            //this.list.Count += numItem;
            for (let i: number = 0; i < this.m_listData.length; i++) {
                let psdInfo: Protocol.PSDInfo = response.m_stPSDInfoList.m_astPSDInfo[i];
                this.m_listData[i] = new JishouItemData();
                this.m_listData[i].data = new ThingItemData();
                this.m_listData[i].data.data = {} as Protocol.ContainerThingInfo;
                this.m_listData[i].id = psdInfo.m_stID;
                this.m_listData[i].price = psdInfo.m_iEachPrice;
                this.m_listData[i].data.config = ThingData.getThingConfig(psdInfo.m_stAccessoryInfo.m_iThingID);
                this.m_listData[i].data.data.m_iThingID = psdInfo.m_stAccessoryInfo.m_iThingID;
                this.m_listData[i].data.data.m_iNumber = psdInfo.m_stAccessoryInfo.m_iThingNumber;
                this.m_listData[i].data.data.m_stThingProperty = psdInfo.m_stAccessoryInfo.m_stAccessoryThing.m_stAccessoryThing.m_stThingProp;
                this.m_listData[i].page = response.m_iPageNo;
                this.allListData.push(this.m_listData[i]);
            }
            this.m_currentPage = response.m_iPageNo;
            this.m_totalPage = response.m_iTotalPages;
            this.showItemUI(this.allListData);
        }
        else {
            G.TipMgr.addMainFloatTip(G.DataMgr.errorData.getErrorStringById(response.m_ushResultID));
        }
        //实现多次请求数据
        if (this.m_currentPage <= this.m_totalPage) {

            this._sendQueryStoreRequest();
        }
    }

    _onStoreGetAllThingNumResponse(msg: Protocol.PPStoreGetAllThingNum_Response) {
        if (msg.m_ushResultID == 0) {
            let listInfo = msg.m_astList.m_astList;
            this.itemSummInfoMap = {};
            for (let data of listInfo) {
                if (data.m_iItemNum > 0) {
                    this.itemSummInfoMap[data.m_iItemID] = data;
                }
            }
            this.showItemUIByConfig();
        }
    }

    private onBtnSearchClick(): void {
        this.resetValue();
        this.m_keyWord = this.InputFielName.text;
        //if (this.m_keyWord == null || this.m_keyWord == "") //判断字符窜是否为空
        //{
        //    G.TipMgr.addMainFloatTip('请输入道具名称') //全局引用
        //}
        //else {
        //    this._sendQueryStoreRequest();
        //}
        this.curSelectItemIndex = -1;
        this._sendQueryStoreRequest();
        this.showItemUI(this.allListData);
        this.navigationLabel.gameObject.SetActive(true);
        this.navigationLabel.text = uts.format('搜索{0}{1}', (this.m_keyWord == null || this.m_keyWord == '') ? '' : '>' + '“' + this.m_keyWord + '”'
            , '>' + '(' + this.dropTypes[this.curDropdownSelect] + ')');
    }


    private showAllJiShou(isOn: boolean) {
        if (isOn) {
            this.init();
            this.oldClassId = this.m_class;
            this.m_class = 0;
            this.oldSelectItemIndex = this.curSelectItemIndex;
            this.oldSeconedItemIndex = this.seconedSelected;
            this.curSelectItemIndex = -1;
            this._sendQueryStoreRequest();
            this.groupList.Selected = -1;
        } else {
            this.m_class = this.oldClassId;
            this.curSelectItemIndex = this.oldSelectItemIndex;
            this.groupList.onClickItem(this.firstSelected);
            this.groupList.Selected = this.firstSelected;
            this.groupList.GetSubList(this.firstSelected).onClickItem(this.oldSeconedItemIndex);
            this.groupList.GetSubList(this.firstSelected).Selected = this.oldSeconedItemIndex;
        }

    }


}
















