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
import { HuigouConfirmBuyView } from 'System/jishou/HuigouConfirmBuyView'
import { SellView } from 'System/jishou/SellView'
import { DataFormatter } from 'System/utils/DataFormatter'
import { TabSubForm } from 'System/uilib/TabForm'
import { PriceBar } from 'System/business/view/PriceBar'
import { HuigouItemData } from 'System/jishou/HuigouItemData'
import { EnumStoreID } from "System/constants/GameEnum";



class HuigouItem extends ListItemCtrl {
    /**物品名称*/
    private txtName: UnityEngine.UI.Text;
    private txtLimit: UnityEngine.UI.Text;
    private txtLv: UnityEngine.UI.Text;
    private txtMoney: UnityEngine.UI.Text;
    private btnBuy: UnityEngine.GameObject;
    private icon: UnityEngine.GameObject;
    private iconItem = new IconItem();
    private data: HuigouItemData;
    /**现价*/
    protected xjBar: PriceBar;

    setComponents(go: UnityEngine.GameObject, icon: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, 'txtName');
        this.txtLimit = ElemFinder.findText(go, 'txtLimit');
        this.txtMoney = ElemFinder.findText(go, 'txtMoney');
        this.btnBuy = ElemFinder.findObject(go, 'btnBuy');
        let xjTransform = go.transform.Find('xianjia');
        if (null != xjTransform) {
            this.xjBar = new PriceBar();
            this.xjBar.setComponents(xjTransform.gameObject);
        }
        this.icon = ElemFinder.findObject(go, 'icon');
        this.iconItem.setUsualIconByPrefab(icon, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);
        Game.UIClickListener.Get(this.btnBuy.gameObject).onClick = delegate(this, this.onClickBtnBuy);
    }

    update(data: HuigouItemData) {
        this.data = data;
        let cfg = data.config;
        if (cfg != null) {
            this.iconItem.updateByItemConfig(cfg);
            this.iconItem.updateIcon();

            let colorValue = cfg.m_ucColor;
            let colorName = Color.getColorById(colorValue);
            let has = data.has;
            if (has > 0) {
                //this.txtName.text = uts.format("{0}({1})", TextFieldUtil.getColorText(cfg.m_szName, colorName), 
                //    TextFieldUtil.getColorText(has.toString(), Color.GREEN));
                this.txtName.text = TextFieldUtil.getColorText(cfg.m_szName, colorName);
            } else {
                this.txtName.text = TextFieldUtil.getColorText(cfg.m_szName, colorName);
            }
            let limit = data.limitCount - data.buy;
            this.txtLimit.text = uts.format("限购：{0}", TextFieldUtil.getColorText(limit.toString(), limit > 0 ? Color.GREEN : Color.RED));
        }
        else {
            this.txtName.text = "--";
            this.txtLv.text = "--";
            this.iconItem.reset();
        }
        // 现价
        if (null != this.xjBar) {
            let xianjia = data.price;//价格
            let exID = data.exChangeID;//货币id
            this.xjBar.setCurrencyID(exID, true);
            // let has: number = data.has;
            // if (has < xianjia) {
            //     this.xjBar.setPrice(xianjia, PriceBar.COLOR_CUSTOMER, Color.RED);
            // }
            // else {
            this.xjBar.setPrice(xianjia, PriceBar.COLOR_CUSTOMER, Color.GREEN);
            // }
        }
        // this.txtMoney.text = DataFormatter.toHanNumStr(data.price);
    }

    private onClickBtnBuy() {
        if (this.data.buy >= this.data.limitCount) {
            G.TipMgr.addMainFloatTip("您的出售个数受限");
            return;
        }
        G.Uimgr.createForm<HuigouConfirmBuyView>(HuigouConfirmBuyView).open(this.data);
    }

}

/**
 * 回购面板
 * 
 */
export class HuigouPanel extends TabSubForm {

    private _typeList: JishouData[];

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

    private huigouItems: HuigouItem[] = [];
    private itemIcon_Normal: UnityEngine.GameObject;
    /**所有物品数据 */
    private allListData: HuigouItemData[];
    /**仅显示背包中有的数据 */
    private hasListData: HuigouItemData[];

    private txtVip: UnityEngine.UI.Text;
    private txtClassName: UnityEngine.UI.Text;
    private txtCanBuy: UnityEngine.UI.Text;

    private m_btnShow: UnityEngine.UI.ActiveToggle;

    private openTab = 0;
    constructor() {
        super(KeyWord.OTHER_FUNCTION_BUY_BACK);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.HuigouPanel;
    }

    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.list = this.elems.getUIList("list");
        this.groupList = this.elems.getUIGroupList("groupList");
        this.txtVip = this.elems.getText("txtVip");
        this.txtClassName = this.elems.getText("txtClassName");
        this.txtCanBuy = this.elems.getText("txtCanBuy");
        this.m_btnShow = this.elems.getActiveToggle("btnShow");
    }

    protected initListeners(): void {
        this.groupList.onClickItem = delegate(this, this.onClickGroupItem);
        this.addClickListener(this.m_btnShow.gameObject, this.onClickBtnShow);
        this.addClickListener(this.txtVip.gameObject, this.onClickTxtVip);
    }

    open(openTab = 0) {
        this.openTab = openTab;
        super.open();
    }

    protected onOpen() {
        this.resetValue();
        this.getTitleLabel();
        this.onToggleTabGroup();//默认选择

    }

    protected onClose() {
    }

    private onClickBtnShow() {
        //切换数据
        this.switchListData(!this.m_btnShow.isOn);
    }

    private onClickTxtVip() {
        //跳转vip面板
        G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_PRIVILEGE, 0, 0, 0);
    }

    private resetValue() {
        this.list.Count = 0;
        this.allListData = [];
        this.hasListData = [];
        this.txtClassName.text = "";
        this.m_btnShow.isOn = false;
        this.txtCanBuy.gameObject.SetActive(false);
    }

    private onToggleTabGroup() {
        //tab切换时，重置
        this.groupList.ScrollTop();
        this.firstSelected = 0;
        this.seconedSelected = 0;
        this.groupList.Selected = this.firstSelected;
        let subList = this.groupList.GetSubList(this.firstSelected);
        subList.Selected = this.seconedSelected;
        ////切换tab是默认选择第1个
        this.onClickItem(0);
    }

    /**
    * 1级选择
    */
    private onClickGroupItem(index: number) {
        this.firstSelected = index;
        this.txtClassName.text = this.firsrStr[index];
        // this.onToggleTabGroup();//默认选择
    }
    /**
     * 2级选择
     * @param index
     */
    private onClickItem(index: number) {
        this.seconedSelected = index;
        this.txtClassName.text = this.firsrStr[this.firstSelected] + ">" + this.secondType[index];
        this.updateList();
    }

    /**
     * 得到标题的文本
     */
    private getTitleLabel() {
        this.firsrStr = [];
        this.secondNumber = [];
        this.secondType = {};
        this._typeList = G.DataMgr.auctionTreeData.getHuigouList();
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
            //2级
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

    private updateList(): void {
        let class2: number = this._typeList[this.firstSelected].items[this.seconedSelected].classID;
        let configs = G.DataMgr.auctionTreeData.getHuigouConfigsByClassID(class2);
        this.allListData = [];
        if (!configs) {
            return;
        }
        configs.sort(delegate(this, this.sortConfig));//按表格配置排序

        let heroData = G.DataMgr.heroData;
        let stageHuangJin = heroData.getPrivilegeState(KeyWord.VIPPRI_2);//黄金
        let stageZuanShi = heroData.getPrivilegeState(KeyWord.VIPPRI_3);//钻石
        let level: number//显示月卡等级
        let limitArray: number[] = [];//限购次数数组
        for (let i = 0; i < configs.length; i++) {
            let listData: HuigouItemData = new HuigouItemData;
            listData.classId = configs[i].m_ucExchange2Class;
            listData.itemID = configs[i].m_iItemID;
            listData.config = ThingData.getThingConfig(configs[i].m_iItemID);
            uts.assert(null != listData.config, '物品表没有配置，物品id：' + listData.itemID);
            listData.price = configs[i].m_iExchangeNum;
            listData.exChangeID = configs[i].m_iExchangeID;
            // listData.has = G.DataMgr.thingData.getThingNumInsensitiveToBind(configs[i].m_iItemID);
            listData.seq = configs[i].m_iSequence;
            listData.hjCount = configs[i].m_iPrivilege2Limit;
            listData.zsCount = configs[i].m_iPrivilege3Limit;

            //当前限购次数
            if (stageZuanShi >= 0) {
                level = 2;
                listData.limitCount = configs[i].m_iPrivilege3Limit;
            } else if (stageHuangJin >= 0) {
                level = 1;
                listData.limitCount = configs[i].m_iPrivilege2Limit;
            } else {
                level = 0;
                listData.limitCount = configs[i].m_iNonePrivilegeLimit;
            }

            this.allListData.push(listData);

            if (i == 0) {
                //用于文本显示
                limitArray.push(configs[i].m_iPrivilege2Limit);
                limitArray.push(configs[i].m_iPrivilege3Limit);
            }
        }

        switch (level) {
            case 0:
                this.txtVip.text = uts.format("购买{0}回购个数增至{1}个",
                    TextFieldUtil.getColorText(TextFieldUtil.getPrivilegeText(KeyWord.VIPPRI_2), Color.GREEN), limitArray[level]);
                this.txtVip.gameObject.SetActive(true);
                break;
            case 1:
                this.txtVip.text = uts.format("购买{0}回购个数增至{1}个",
                    TextFieldUtil.getColorText(TextFieldUtil.getPrivilegeText(KeyWord.VIPPRI_3), Color.GREEN), limitArray[level]);
                this.txtVip.gameObject.SetActive(true);
                break;
            case 2:
                this.txtVip.gameObject.SetActive(false);
                break;
        }

        this.onSellLimitDataChange();
    }

    /**
     * 仅显示背包数据和所有数据的切换
     * @param isOn 
     */
    private switchListData(isOn: boolean): void {
        if (isOn) {
            this.showItemUI(this.hasListData);
            if (this.hasListData.length == 0) {
                //背包中没有，则显示提示文本
                this.txtCanBuy.gameObject.SetActive(true);
            } else {
                this.txtCanBuy.gameObject.SetActive(false);
            }
        } else {
            this.showItemUI(this.allListData);
            this.txtCanBuy.gameObject.SetActive(false);
        }
    }

    onSellLimitDataChange() {
        if (!this.allListData || !this.hasListData) {
            return;
        }
        this.hasListData = [];
        let npcSellData = G.DataMgr.npcSellData;
        let thingData = G.DataMgr.thingData;
        for (let i = 0; i < this.allListData.length; i++) {
            let config = this.allListData[i].config;
            let data = npcSellData.getNPCSellLimitDataById(EnumStoreID.HuiGou, config.m_iID);
            if (!data) {
                uts.logWarning("回购商店限购表没配，物品id:" + config.m_iID);
                continue;
            }
            this.allListData[i].buy = data.boughtCount;
            this.allListData[i].has = thingData.getThingNumInsensitiveToBind(config.m_iID);
            if (this.allListData[i].has > 0) {
                //背包中物品数量足够
                this.hasListData.push(this.allListData[i]);
            }
        }

        this.switchListData(this.m_btnShow.isOn);
    }

    private showItemUI(data: HuigouItemData[]) {
        this.list.Count = data.length;
        for (let i = 0; i < data.length; i++) {

            if (this.huigouItems[i] == null) {
                this.huigouItems[i] = new HuigouItem();
                let item = this.list.GetItem(i);
                this.huigouItems[i].setComponents(item.gameObject, this.itemIcon_Normal);
            }
            this.huigouItems[i].update(data[i]);
        }
    }

    private sortConfig(a: GameConfig.NPCStoreBuyBackCfgM, b: GameConfig.NPCStoreBuyBackCfgM): number {
        return a.m_iSequence - b.m_iSequence;
    }
}
















