import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { BuffData } from 'System/data/BuffData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { List } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'
import { PayView } from 'System/pay/PayView'
import { TipFrom } from 'System/tip/view/TipsView'
import { ThingData } from 'System/data/thing/ThingData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { GuildJingPaiConfirmView } from 'System/guild/view/GuildJingPaiConfirmView'
import { UIUtils } from 'System/utils/UIUtils'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { UILayer, CommonForm } from 'System/uilib/CommonForm'
import { YuanGuPaiMaiConfirmView } from 'System/pinstance/boss/YuanGuPaiMaiConfirmView'
import { BossView } from 'System/pinstance/boss/BossView'
import { CompareUtil } from 'System/utils/CompareUtil'
import { VipView, VipTab } from 'System/vip/VipView';
import { GuildAuctionInfoNode } from '../../ItemPanels/GuildAuctionInfoNode';
import { CurrencyTip } from 'System/uilib/CurrencyTip'


class YuanGuJingPaiItem {

    //private bg1: UnityEngine.GameObject;
    //private bg2: UnityEngine.GameObject;
    private icon: UnityEngine.GameObject;

    private txtName: UnityEngine.UI.Text;
    /**竞拍价*/
    private txtPrice: UnityEngine.UI.Text;
    private txtPriceName: UnityEngine.UI.Text;
    /**已经竞拍*/
    private txtHasBuy: UnityEngine.GameObject;
    /**一口价*/
    private txtYKJ: UnityEngine.UI.Text;
    private txtTime: UnityEngine.UI.Text;
    //private txtSource: UnityEngine.UI.Text;



    private iconItem: IconItem;

    private isMyPaiMai: boolean = false;
    private leftTime: number = 0;
    private timeCheck: boolean = false;
    private data: Protocol.WorldPaiMaiItem;

    setcomponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        //this.bg1 = ElemFinder.findObject(go, "bg1");
        //this.bg2 = ElemFinder.findObject(go, "bg2");

        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtPrice = ElemFinder.findText(go, "moneyMin/txtPrice");
        this.txtPriceName = ElemFinder.findText(go, "moneyMin/name");
        this.txtHasBuy = ElemFinder.findObject(go, "txtHasBuy");
        this.txtYKJ = ElemFinder.findText(go, "moneyMax/txtYKJ");
        this.txtTime = ElemFinder.findText(go, "txtTime");
        //this.txtSource = ElemFinder.findText(go, "txtSource");


        this.icon = ElemFinder.findObject(go, "icon");

        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(itemIcon_Normal, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);

    }

    update(index: number, data: Protocol.WorldPaiMaiItem, isMyPaiMai: boolean) {
        this.isMyPaiMai = isMyPaiMai;
        this.data = data;
        //this.bg1.SetActive(index % 2 == 0);
        //this.bg2.SetActive(index % 2 == 1);

        //this.txtSource.gameObject.SetActive(true);
        //图标 名称
        this.iconItem.updateById(data.m_iItemID, data.m_iItemCount);
        this.iconItem.updateIcon();
        let thingConfig = ThingData.getThingConfig(data.m_iItemID);
        if (thingConfig) {
            this.txtName.text = TextFieldUtil.getColorText(thingConfig.m_szName, Color.getColorById(thingConfig.m_ucColor));
        }
        //价格
        this.txtPrice.text = data.m_iCurPrice.toString();

        this.txtYKJ.text = data.m_iMaxPrice.toString();
        let thingCfg = ThingData.getThingConfig(data.m_iItemID);
        //this.txtSource.text = TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_ITEM_COLOR, thingCfg.m_ucColor), Color.getColorById(thingCfg.m_ucColor));


        this.leftTime = data.m_uiEndTime - Math.floor(G.SyncTime.getCurrentTime() / 1000);
        if (this.leftTime > 0) {
            this.timeCheck = true;
        } else {
            this.txtTime.text = "已到期";
        }

        if (CompareUtil.isRoleIDEqual(data.m_stRoleID, G.DataMgr.heroData.roleID) && !isMyPaiMai) {

            // this.txtHasBuy.text = "已竞拍";
            this.txtHasBuy.SetActive(true);
        } else {
            // this.txtHasBuy.text = "";
            this.txtHasBuy.SetActive(false);
        }

        if (!isMyPaiMai) {
            //世界拍卖
            if (data.m_stRoleID.m_uiUin == 0) {
                this.txtPriceName.text = "底价";
            }
            else {
                this.txtPriceName.text = "竞价";
            }
        }
        else{
            this.txtPriceName.text = "竞价";
        }
    }


    private updateIgnoreBtnStatus(show: boolean) {
        //this.txtSource.gameObject.SetActive(!show);
    }


    updateTime() {
        if (this.timeCheck) {
            this.leftTime--;
            if (this.leftTime > 0) {
                this.txtTime.text = TextFieldUtil.getColorText(DataFormatter.second2hhmmss(this.leftTime), Color.GREEN);
            } else {
                this.txtTime.text = "已到期";
                this.stopTime();
            }
        }
    }

    private stopTime() {
        this.timeCheck = false;
    }



}


export class YuanGuJingPaiView extends CommonForm {
    private currencyTip: CurrencyTip;

    /**拍卖关联的活动id*/
    static readonly ACTIDMACROS = Macros.ACTIVITY_ID_XZFM;
    /**上轮最大记录只显示5个*/
    private readonly MAXRECRODNUM = 5;

    /**是否是竞拍 | 我的竞拍*/
    private togJP: UnityEngine.UI.ActiveToggle;
    private btnMyAuction: UnityEngine.GameObject;
    private btnWorldAuction: UnityEngine.GameObject;
    private selectedAuction: UnityEngine.GameObject;
    private txtSelectedAuction: UnityEngine.UI.Text;
    private isMyAuction: boolean;

    private itemIcon_Normal: UnityEngine.GameObject;
    private rolebg: UnityEngine.GameObject;
    private btnJinPai: UnityEngine.GameObject;
    private btnYiKouJia: UnityEngine.GameObject;

    private txtMyGet: UnityEngine.UI.Text;
    private txtMoney: UnityEngine.UI.Text;

    private getList: List;
    private list: List;

    private YuanGuJingPaiItem: YuanGuJingPaiItem[] = [];
    protected curSelectData: Protocol.WorldPaiMaiItem;
    private worldPaiMaiItemList: Protocol.WorldPaiMaiItem[] = [];
    private curSelectIndex: number = -1;

    private rightNode: UnityEngine.GameObject;
    private itemAuctionInfoNode: GuildAuctionInfoNode;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_WORLDPAIMAI);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.YuanGuJingPaiView;
    }

    protected initElements() {
        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("currencyTip"));

        this.togJP = this.elems.getActiveToggle("togJP");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.rolebg = this.elems.getElement("rolebg");
        this.btnJinPai = this.elems.getElement("btnJinPai");
        this.btnYiKouJia = this.elems.getElement("btnYiKouJia");

        this.txtMyGet = this.elems.getText("txtMyGet");
        this.txtMoney = this.elems.getText("txtMoney");

        this.getList = this.elems.getUIList("getList");
        this.list = this.elems.getUIList("list");

        this.btnMyAuction = this.elems.getElement("btnMyAuction");
        this.btnWorldAuction = this.elems.getElement("btnWorldAuction");
        this.selectedAuction = this.elems.getElement("selectedAuction");
        this.txtSelectedAuction = this.elems.getText("txtSelectedAuction");

        this.rightNode = this.elems.getElement("rightPanel");
        this.itemAuctionInfoNode = new GuildAuctionInfoNode();
        this.itemAuctionInfoNode.setComponents(this.elems.getUiElements("rightPanel"), this.itemIcon_Normal);

    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement('btnClose'), this.close);
        this.addClickListener(this.elems.getElement('mask'), this.close);
        //this.addClickListener(this.elems.getElement('btnTip'), this.close);
        this.addClickListener(this.elems.getElement('btnRule'), this.onClickRule);
        this.addClickListener(this.elems.getElement('btnAdd'), this.onClickAdd);
        this.addClickListener(this.elems.getElement('btnReturn'), this.onClickReturnBossView);

        // this.addClickListener(this.btnJinPai, this.onClickJingPai);
        // this.addClickListener(this.btnYiKouJia, this.onClickYiKouJia);

        this.togJP.onValueChanged = delegate(this, this.onTogValueChange);

        this.addListClickListener(this.list, this.onClickItem);

        this.addClickListener(this.btnMyAuction, this.onClickMyAuction);
        this.addClickListener(this.btnWorldAuction, this.onClickWorldAuction);

        this.itemAuctionInfoNode.onClickPriceCall = delegate(this, this.onClickJingPai);
        this.itemAuctionInfoNode.onClickFixedPriceCall = delegate(this, this.onClickYiKouJia);
    }

    /**我的竞拍 */
    private onClickMyAuction() {
        this.isMyAuction = true;
        this.selectedAuction.transform.position = this.btnMyAuction.transform.position;
        this.updatePanel();
        this.txtSelectedAuction.text = "我的竞拍";
    }

    /**世界竞拍 */
    private onClickWorldAuction() {
        this.isMyAuction = false;
        this.selectedAuction.transform.position = this.btnWorldAuction.transform.position;
        this.updatePanel();
        this.txtSelectedAuction.text = "世界竞拍";
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWorldPaiMaiPanelRequest(YuanGuJingPaiView.ACTIDMACROS));
        this.addTimer("1", 1000, 0, this.onTimer);

        // UIUtils.setButtonClickAble(this.btnJinPai, false);
        // UIUtils.setButtonClickAble(this.btnYiKouJia, false);
        this.itemAuctionInfoNode.setPriceButtonState(false);
        this.itemAuctionInfoNode.setFixedPriceButtonState(false);
        this.onMoneyChange();
    }


    protected onClose() {
        this.curSelectIndex = -1;
    }

    private onTogValueChange(isOn: boolean) {
        this.updatePanel();
    }

    updatePanel() {

        ////每次购买后刷新，清空状态
        //this.list.Selected = -1;
        //UIUtils.setButtonClickAble(this.btnJinPai, false);
        //UIUtils.setButtonClickAble(this.btnYiKouJia, false);
        this.itemAuctionInfoNode.setPriceButtonState(false);
        this.itemAuctionInfoNode.setFixedPriceButtonState(false);

        if (this.curSelectIndex >= 0) {
            this.curSelectData = this.worldPaiMaiItemList[this.curSelectIndex];
        }

        this.txtMoney.text = G.DataMgr.heroData.gold.toString();

        let monsterData = G.DataMgr.monsterData;

        let isMyPaiMai: boolean = false;
        if (this.isMyAuction) {
            //我的竞拍
            this.worldPaiMaiItemList = monsterData.getMyWorldPaiMaiItemList();
            isMyPaiMai = true;
        } else {
            //世界拍卖
            this.worldPaiMaiItemList = monsterData.getWorldPaiMaiItemList();
            isMyPaiMai = false;
        }

        if (this.worldPaiMaiItemList == null || this.worldPaiMaiItemList.length == 0) {
            this.list.Count = 0;
            this.rolebg.SetActive(true);
            this.rightNode.SetActive(false);
        } else {
            this.rolebg.SetActive(false);
            this.rightNode.SetActive(true);
            this.worldPaiMaiItemList.sort(delegate(this, this.sortPaiMai));

            this.list.Count = this.worldPaiMaiItemList.length;
            for (let i = 0; i < this.list.Count; i++) {
                let item = this.list.GetItem(i).gameObject;
                if (this.YuanGuJingPaiItem[i] == null) {
                    this.YuanGuJingPaiItem[i] = new YuanGuJingPaiItem();
                    this.YuanGuJingPaiItem[i].setcomponents(item, this.itemIcon_Normal);
                }
                this.YuanGuJingPaiItem[i].update(i, this.worldPaiMaiItemList[i], isMyPaiMai);
            }
            this.onClickItem(0);
        }

        let record = monsterData.worldPaiMaiActRecord;
        this.getList.Count = record.m_iRoleCount > this.MAXRECRODNUM ? this.MAXRECRODNUM : record.m_iRoleCount;
        for (let i = 0; i < this.getList.Count; i++) {
            let item = this.getList.GetItem(i);
            let txtName = item.findText("txtName");
            let txtGet = item.findText("txtGet");
            txtName.text = record.m_stRoleList[i].m_szNickName;
            txtGet.text = TextFieldUtil.getColorText(record.m_stRoleList[i].m_iGetMoney.toString(), Color.GREEN);
        }


        let myRecord = monsterData.getMyPaiMaiRecord();
        let str = TextFieldUtil.getColorText("我的收益：", Color.ORANGE);
        if (myRecord) {
            str += TextFieldUtil.getColorText(myRecord.m_iGetMoney.toString(), Color.GREEN);
        }
        else {
            str += TextFieldUtil.getColorText("0", Color.GREEN);
        }
        this.txtMyGet.text = str;

    }

    private sortPaiMai(a: Protocol.WorldPaiMaiItem, b: Protocol.WorldPaiMaiItem) {
        let stateA = 0;
        if (CompareUtil.isRoleIDEqual(a.m_stRoleID, G.DataMgr.heroData.roleID)) {
            stateA = 1;
        } else {
            stateA = 2;
        }

        let stateB = 0;
        if (CompareUtil.isRoleIDEqual(b.m_stRoleID, G.DataMgr.heroData.roleID)) {
            stateB = 1;
        } else {
            stateB = 2;
        }

        if (stateA != stateB) {
            return stateA - stateB;
        }

        return a.m_iItemFlowID - b.m_iItemFlowID;
    }


    private onTimer() {

        if (this.YuanGuJingPaiItem == null)
            return;

        for (let item of this.YuanGuJingPaiItem) {
            item.updateTime();
        }
        this.itemAuctionInfoNode.updateTimer();

    }


    private onClickReturnBossView() {
        G.Uimgr.createForm<BossView>(BossView).open(KeyWord.ACT_FUNCTION_XZFM);
    }

    private onClickJingPai() {
        G.Uimgr.createForm<YuanGuPaiMaiConfirmView>(YuanGuPaiMaiConfirmView).open(YuanGuJingPaiView.ACTIDMACROS, this.curSelectData);
    }


    private onClickYiKouJia() {
        G.Uimgr.createForm<YuanGuPaiMaiConfirmView>(YuanGuPaiMaiConfirmView).open(YuanGuJingPaiView.ACTIDMACROS, this.curSelectData, true);
    }

    protected onClickRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(445), '玩法说明');
    }
    /**
     * 前往充值
     */
    private onClickAdd() {
        // G.Uimgr.createForm<PayView>(PayView).open(KeyWord.OTHER_FUNCTION_WORLDPAIMAI);
        G.Uimgr.createForm<VipView>(VipView).open(VipTab.ChongZhi, -1, KeyWord.OTHER_FUNCTION_WORLDPAIMAI);
    }


    private onClickItem(index: number) {
        this.curSelectIndex = index;
        this.list.Selected = index;
        this.curSelectData = this.worldPaiMaiItemList[index];
        let hasMoney = G.DataMgr.heroData.gold;
        let maxPrice = this.curSelectData.m_iMaxPrice;
        let price = 0;
        if (this.curSelectData.m_stRoleID.m_uiUin == 0)
            price = this.curSelectData.m_iCurPrice;
        else
            price = this.curSelectData.m_iCurPrice + Math.floor(maxPrice * 0.1);
        // UIUtils.setButtonClickAble(this.btnJinPai, hasMoney >= price );
        // UIUtils.setButtonClickAble(this.btnYiKouJia, hasMoney >= maxPrice);

        this.itemAuctionInfoNode.setPriceButtonState(hasMoney >= price);
        this.itemAuctionInfoNode.setFixedPriceButtonState(hasMoney >= maxPrice);

        //UIUtils.setButtonClickAble(this.btnJinPai, status);
        //UIUtils.setButtonClickAble(this.btnYiKouJia, status);

        this.itemAuctionInfoNode.updateNodeFormWorld(this.curSelectData);
    }

    onMoneyChange() {
        this.currencyTip.updateMoney();
    }

}