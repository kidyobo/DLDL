import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { EnumGuildFuncSubTab } from 'System/guild/view/GuildFuncPanel'
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
import { EnumGuildJingPaiSubTab } from 'System/guild/view/GuildJingPaiPanel'
import { DataFormatter } from 'System/utils/DataFormatter'
import { GuildJingPaiConfirmView } from 'System/guild/view/GuildJingPaiConfirmView'
import { UIUtils } from 'System/utils/UIUtils'
import { GuildView } from 'System/guild/view/GuildView'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { VipView, VipTab } from 'System/vip/VipView';
import { GuildAuctionInfoNode } from "System/ItemPanels/GuildAuctionInfoNode"


class GuildJingPaiItem {


    private bg1: UnityEngine.GameObject;
    private icon: UnityEngine.GameObject;

    private txtName: UnityEngine.UI.Text;
    /**竞拍价*/
    private txtPrice: UnityEngine.UI.Text;
    private txtPriceName: UnityEngine.UI.Text;
    /**已经竞拍*/
    private txtHasBuy: UnityEngine.UI.Text;
    /**一口价*/
    private txtYKJ: UnityEngine.UI.Text;
    private txtTime: UnityEngine.UI.Text;
    private txtSource: UnityEngine.UI.Text;
    private btnIgnore: UnityEngine.GameObject;

    private flagAuction: UnityEngine.GameObject;
    private flagBuy: UnityEngine.GameObject;



    private iconItem: IconItem;

    private type: number = 0;
    private leftTime: number = 0;
    private timeCheck: boolean = false;
    private data: Protocol.PaiMaiItemOne;

    setcomponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        this.bg1 = ElemFinder.findObject(go, "bg1");

        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtPrice = ElemFinder.findText(go, "moneyMin/txtPrice");
        this.txtPriceName = ElemFinder.findText(go, "moneyMin/name");
        this.txtHasBuy = ElemFinder.findText(go, "txtHasBuy");
        this.flagAuction = ElemFinder.findObject(go, "flagAuction");
        this.flagBuy = ElemFinder.findObject(go, "flagBuy");
        this.txtYKJ = ElemFinder.findText(go, "moneyMax/txtYKJ");
        this.txtTime = ElemFinder.findText(go, "txtTime");
        this.txtSource = ElemFinder.findText(go, "txtSource");
        this.btnIgnore = ElemFinder.findObject(go, "btnIgnore");
        this.icon = ElemFinder.findObject(go, "icon");

        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(itemIcon_Normal, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);

        Game.UIClickListener.Get(this.btnIgnore).onClick = delegate(this, this.onClickIgnore);
        //  this.btnIgnore.SetActive(false);
    }

    update(index: number, data: Protocol.PaiMaiItemOne, type: number) {
        //标记规则 标签两个“已卖出”“已竞拍”  竞价文字：正常白色 已经竞价的绿色 竞价被超了红色

        this.type = type;
        this.data = data;
        //this.btnIgnore.SetActive(false);
        //this.txtSource.gameObject.SetActive(true);
        //图标 名称
        this.iconItem.updateById(data.m_iItemID, data.m_iItemCount);
        this.iconItem.updateIcon();
        let thingConfig = ThingData.getThingConfig(data.m_iItemID);
        if (thingConfig) {
            this.txtName.text = TextFieldUtil.getColorText(thingConfig.m_szName, Color.getColorById(thingConfig.m_ucColor));
        }
        //价格
        let priceStr = data.m_iCurPrice.toString();
        let sellStatusStr: string;
        if (type == Macros.GUILD_PAIMAI_BUY_GUILD || type == EnumGuildJingPaiSubTab.world) {
            if (data.m_stRoleID.m_uiUin == 0) {
                this.txtPriceName.text = "底价";
            }
            else {
                this.txtPriceName.text = "竞价";
            }
        }
        else {
            this.txtPriceName.text = "竞价";
        }
        switch (data.m_ucStatus) {
            //case Macros.GUILD_PAIMAI_ITEM_CS_STATUS_SELL:
            //    sellStatusStr = TextFieldUtil.getColorText("已卖出", Color.GREY);
            //    break;
            case Macros.GUILD_PAIMAI_ITEM_CS_STATUS_DONE:
                sellStatusStr = TextFieldUtil.getColorText("已卖出", Color.GREY);
                this.flagBuy.SetActive(true);
                this.flagAuction.SetActive(false);
                break;
            case Macros.GUILD_PAIMAI_ITEM_CS_STATUS_SELF:
                sellStatusStr = "已出价";
                priceStr = TextFieldUtil.getColorText(priceStr, Color.GREEN);
                this.flagBuy.SetActive(false);
                this.flagAuction.SetActive(true);
                break;
            case Macros.GUILD_PAIMAI_ITEM_CS_STATUS_SELFDONE:
                sellStatusStr = "已拍到";
                this.flagBuy.SetActive(true);
                this.flagAuction.SetActive(false);
                priceStr = TextFieldUtil.getColorText(priceStr, Color.GREEN);
                break;
            //case Macros.GUILD_PAIMAI_ITEM_CS_STATUS_FAIL:
            //    break;
            //case Macros.GUILD_PAIMAI_ITEM_CS_STATUS_SELFMORE:
            //    sellStatusStr = "自身竞价超越";
            //    break;
            case Macros.GUILD_PAIMAI_ITEM_CS_STATUS_OTHERMORE:
                sellStatusStr = TextFieldUtil.getColorText("被他人超越", Color.GREY);
                this.flagBuy.SetActive(true);
                this.flagAuction.SetActive(false);
                priceStr = TextFieldUtil.getColorText(priceStr, Color.RED);
                break;
            case Macros.GUILD_PAIMAI_ITEM_CS_STATUS_OTHERBUY:
                sellStatusStr = "被他人拍下";
                this.flagBuy.SetActive(true);
                this.flagAuction.SetActive(false);
                break;

            case Macros.GUILD_PAIMAI_ITEM_CS_STATUS_OTHERSUPERBUY:
                sellStatusStr = TextFieldUtil.getColorText("被他人一口价", Color.GREY);
                this.flagBuy.SetActive(true);
                this.flagAuction.SetActive(false);
                this.updateIgnoreBtnStatus(true);
                break;

            case Macros.GUILD_PAIMAI_ITEM_CS_STATUS_SELFSUPERBUY:
                sellStatusStr = TextFieldUtil.getColorText("一口价买下", Color.GREY);
                this.flagBuy.SetActive(true);
                this.flagAuction.SetActive(false);
                priceStr = TextFieldUtil.getColorText(priceStr, Color.GREEN);
                this.updateIgnoreBtnStatus(true);
                break;
            default:
                sellStatusStr = "";
                this.flagBuy.SetActive(false);
                this.flagAuction.SetActive(false);
                break;
        }
        this.txtPrice.text = priceStr;

        this.txtHasBuy.text = sellStatusStr;
        this.txtYKJ.text = data.m_iMaxPrice.toString();
        this.leftTime = data.m_uiTime - Math.floor(G.SyncTime.getCurrentTime() / 1000);
        if (this.leftTime > 0) {
            this.timeCheck = true;
        } else {
            this.txtTime.text = "已到期";
        }

        let sourceStr: string = data.m_szGuildName;
        if (sourceStr == null || sourceStr == "") {
            let actConfig = G.DataMgr.activityData.getActivityConfig(data.m_iActID);
            sourceStr = actConfig.m_szName;
        }
        this.txtSource.text = sourceStr;
    }


    private updateIgnoreBtnStatus(show: boolean) {
        //this.btnIgnore.SetActive(show);
        //this.txtSource.gameObject.SetActive(!show);
    }


    updateTime() {
        if (this.timeCheck) {
            this.leftTime--;
            if (this.leftTime > 0) {
                this.txtTime.text = DataFormatter.second2hhmmss(this.leftTime);
            } else {
                this.txtTime.text = "已到期";
                this.stopTime();
            }
        }
    }

    private stopTime() {
        this.timeCheck = false;
    }




    private onClickIgnore() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQueryRequest(Macros.GUILD_PAIMAI_INGORE, this.data.m_iIngoreID));
    }


}


export abstract class GuildJingPaiSubBasePanel extends TabSubForm {

    protected noObjectPanel: UnityEngine.GameObject;
    protected leftPanel: UnityEngine.GameObject;
    protected rightPanel: UnityEngine.GameObject;

    protected list: List;
    protected btnRule: UnityEngine.GameObject;
    protected btnAdd: UnityEngine.GameObject;
    //protected btnJinPai: UnityEngine.GameObject;
    //protected btnYiKouJia: UnityEngine.GameObject;
    protected txtMoney: UnityEngine.UI.Text;
    protected itemIcon_Normal: UnityEngine.GameObject;


    protected btnTip: UnityEngine.GameObject;

    protected guildJingPaiItems: GuildJingPaiItem[] = [];

    protected paiMaiList: Protocol.PaiMaiItemOne[];
    protected curSelectData: Protocol.PaiMaiItemOne;
    protected macrosType: number = 0;

    /**是否是我的拍卖列表*/
    protected isMineList: boolean = false;
    private oldSelectIndex: number = -1;

    private guildAuctionInfoNode: GuildAuctionInfoNode;

    protected resPath(): string {
        return UIPathData.GuildJingPaiSubPanel;
    }

    protected initElements() {
        this.noObjectPanel = this.elems.getElement("noObjectPanel");
        this.leftPanel = this.elems.getElement("leftPanel");
        this.rightPanel = this.elems.getElement("rightPanel");

        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.list = this.elems.getUIList("list");
        this.btnTip = this.elems.getElement("btnTip");


        this.btnRule = this.elems.getElement("btnRule");
        this.btnAdd = this.elems.getElement("btnAdd");
        //this.btnJinPai = this.elems.getElement("btnJinPai");
        //this.btnYiKouJia = this.elems.getElement("btnYiKouJia");
        this.txtMoney = this.elems.getText("txtMoney");

        this.guildAuctionInfoNode = new GuildAuctionInfoNode();
        this.guildAuctionInfoNode.setComponents(this.elems.getUiElements("rightPanel"), this.itemIcon_Normal);
    }

    protected initListeners() {
        this.addClickListener(this.btnRule, this.onClickRule);
        this.addClickListener(this.btnAdd, this.onClickAdd);
        //this.addClickListener(this.btnJinPai, this.onClickJingPai);
        //this.addClickListener(this.btnYiKouJia, this.onClickYiKouJia);
        this.addClickListener(this.btnTip, this.onClickTip);

        this.addListClickListener(this.list, this.onClickListItem);

        this.guildAuctionInfoNode.onClickPriceCall = delegate(this, this.onClickJingPai);
        this.guildAuctionInfoNode.onClickFixedPriceCall = delegate(this, this.onClickYiKouJia);

    }

    protected onOpen() {
        this.guildAuctionInfoNode.setPriceButtonState(false);
        this.guildAuctionInfoNode.setFixedPriceButtonState(false);

        //UIUtils.setButtonClickAble(this.btnJinPai, false);
        //UIUtils.setButtonClickAble(this.btnYiKouJia, false);
        this.addTimer("1", 1000, 0, this.onTimer);
    }


    private onTimer() {
        for (let item of this.guildJingPaiItems) {
            item.updateTime();
        }
        this.guildAuctionInfoNode.updateTimer();
    }


    protected onClose() {
    }

    private onClickTip() {
        G.Uimgr.getForm<GuildView>(GuildView).open(KeyWord.OTHER_FUNCTION_GUILD_JINGPAI, EnumGuildJingPaiSubTab.source);
    }

    updatePanel(): void {
        //每次购买后刷新，清空状态
        //this.list.Selected = -1;

        this.guildAuctionInfoNode.setPriceButtonState(false);
        this.guildAuctionInfoNode.setFixedPriceButtonState(false);
        //UIUtils.setButtonClickAble(this.btnJinPai, false);
        //UIUtils.setButtonClickAble(this.btnYiKouJia, false);

        this.txtMoney.text = G.DataMgr.heroData.gold.toString();
        let paiMaiCount = 0;
        if (this.id == EnumGuildJingPaiSubTab.guild) {
            let data = G.DataMgr.guildData.m_stPaiMaiOpenGuild;
            paiMaiCount = data.m_iCount;
            this.paiMaiList = data.m_stList;
            this.macrosType = Macros.GUILD_PAIMAI_BUY_GUILD;
        } else if (this.id == EnumGuildJingPaiSubTab.world) {
            let data = G.DataMgr.guildData.m_stPaiMaiOpenWorld;
            paiMaiCount = data.m_iCount;
            this.paiMaiList = data.m_stList;
            this.macrosType = Macros.GUILD_PAIMAI_BUY_WORLD;
        }
        else if (this.id == EnumGuildJingPaiSubTab.mine) {
            let data = G.DataMgr.guildData.m_stPaiMaiSelf;
            paiMaiCount = data.m_iCount;
            this.paiMaiList = data.m_stList;
            this.macrosType = Macros.GUILD_PAIMAI_SELF;
            //删除自己一口价的
            for (let i = data.m_iCount - 1; i >= 0; i--) {
                if (data.m_stList[i].m_ucStatus == Macros.GUILD_PAIMAI_ITEM_CS_STATUS_SELFSUPERBUY) {
                    paiMaiCount--;
                    data.m_stList.splice(i, 1);
                }
            }
        }//查看详情

        this.paiMaiList.sort(this.sortPaiMaiData);

        this.list.Count = paiMaiCount;
        for (let i = 0; i < this.list.Count; i++) {
            if (this.guildJingPaiItems[i] == null) {
                let item = this.list.GetItem(i).gameObject;
                this.guildJingPaiItems[i] = new GuildJingPaiItem();
                this.guildJingPaiItems[i].setcomponents(item, this.itemIcon_Normal);
            }

            this.guildJingPaiItems[i]

            this.guildJingPaiItems[i].update(i, this.paiMaiList[i], this.macrosType);
        }

        this.noObjectPanel.SetActive(this.list.Count == 0);
        this.leftPanel.SetActive(this.list.Count != 0);
        this.rightPanel.SetActive(this.list.Count != 0);

        if (paiMaiCount >= 1) {
            this.onClickListItem(0);
            this.list.ScrollByAxialRow(0);
        }
        else {
            this.list.Selected = -1;
        }
    }

    private sortPaiMaiData(a: Protocol.PaiMaiItemOne, b: Protocol.PaiMaiItemOne): number {
        if (b.m_ucStatus != a.m_ucStatus) {
            return b.m_ucStatus - a.m_ucStatus;
        } else if (a.m_iItemID != b.m_iItemID) {
            return a.m_iItemID - b.m_iItemID;
        } else {
            return a.m_iCurPrice - b.m_iCurPrice;
        }
    }





    private onClickListItem(index: number) {
        this.list.Selected = index;
        this.curSelectData = this.paiMaiList[index];

        //UIUtils.setButtonClickAble(this.btnJinPai, hasMoney >= price && this.curSelectData.m_ucStatus != Macros.GUILD_PAIMAI_ITEM_CS_STATUS_OTHERSUPERBUY);
        //UIUtils.setButtonClickAble(this.btnYiKouJia, hasMoney >= maxPrice && this.curSelectData.m_ucStatus != Macros.GUILD_PAIMAI_ITEM_CS_STATUS_OTHERSUPERBUY);

        let hasMoney = G.DataMgr.heroData.gold;
        let maxPrice = this.curSelectData.m_iMaxPrice;
        let price = 0;
        if (this.curSelectData.m_stRoleID.m_uiUin == 0)
            price = this.curSelectData.m_iCurPrice;
        else
            price = this.curSelectData.m_iCurPrice + Math.floor(maxPrice * 0.1);

        let status = (this.curSelectData.m_ucStatus != Macros.GUILD_PAIMAI_ITEM_CS_STATUS_OTHERSUPERBUY &&
            this.curSelectData.m_ucStatus != Macros.GUILD_PAIMAI_ITEM_CS_STATUS_SELFSUPERBUY && hasMoney >= price)

        this.guildAuctionInfoNode.setPriceButtonState(status);
        this.guildAuctionInfoNode.setFixedPriceButtonState(status);

        //UIUtils.setButtonClickAble(this.btnJinPai, status);
        //UIUtils.setButtonClickAble(this.btnYiKouJia, status);

        this.guildAuctionInfoNode.updateNode(this.curSelectData);

        //if (this.oldSelectIndex != index && this.isMineList) {
        //    this.guildJingPaiItems[index].updateIgnoreBtnStatus(true);
        //    if (this.oldSelectIndex >= 0)
        //        this.guildJingPaiItems[this.oldSelectIndex].updateIgnoreBtnStatus(false);
        //    this.oldSelectIndex = index;
        //}


    }

    /**
     * 前往充值
     */
    protected onClickAdd() {
        // G.Uimgr.createForm<PayView>(PayView).open(KeyWord.OTHER_FUNCTION_GUILD_JINGPAI, this.id);
        G.Uimgr.createForm<VipView>(VipView).open(VipTab.ChongZhi, -1, KeyWord.OTHER_FUNCTION_GUILD_JINGPAI, this.id);
    }

    protected onClickJingPai() {
        G.Uimgr.createForm<GuildJingPaiConfirmView>(GuildJingPaiConfirmView).open(this.macrosType, this.curSelectData);
    }


    protected onClickYiKouJia() {
        G.Uimgr.createForm<GuildJingPaiConfirmView>(GuildJingPaiConfirmView).open(this.macrosType, this.curSelectData, true);
    }

    // protected abstract onClickRule();

    protected onClickRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(415), '玩法说明');
    }
}