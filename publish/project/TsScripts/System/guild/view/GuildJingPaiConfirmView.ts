import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { ThingData } from 'System/data/thing/ThingData'
import { IconItem } from 'System/uilib/IconItem'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { UIUtils } from 'System/utils/UIUtils'

/**
 * 日常活动玩法说明
 *
 */
export class GuildJingPaiConfirmView extends CommonForm {

    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;
    private btnJingPai: UnityEngine.GameObject;
    private btnCancel: UnityEngine.GameObject;

    private txtName: UnityEngine.UI.Text;
    private txtPrice: UnityEngine.UI.Text;


    private itemIcon_Normal: UnityEngine.GameObject;
    private icon: UnityEngine.GameObject;
    private iconItem: IconItem;

    private objMyprice: UnityEngine.GameObject;
    private objLeftTime: UnityEngine.GameObject;
    private objYikoujia: UnityEngine.GameObject;

    private txtMyPrice: UnityEngine.UI.Text;
    private txtLeftTime: UnityEngine.UI.Text;
    private txtYiKouJia: UnityEngine.UI.Text;
    private txtTips: UnityEngine.UI.Text;

    private curSelectData: Protocol.PaiMaiItemOne;
    private isYiKouJia: boolean = false;
    private macrosType: number = 0;
    /**我的竞价，最大的10% */
    private myPrice: number = 0;
    private leftTime: number = 0;
    private timeCheck: boolean = false;

    private cneterTip: UnityEngine.GameObject;
    private cneterTip2: UnityEngine.GameObject;
    private txtMaxPrice: UnityEngine.UI.Text;
    private txtTips2: UnityEngine.UI.Text;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.GuildJingPaiConfirmView;
    }


    protected initElements(): void {
        super.initElements();
        this.btnClose = this.elems.getElement("btnClose");
        this.mask = this.elems.getElement("mask");
        this.btnJingPai = this.elems.getElement("btnJingPai");
        this.btnCancel = this.elems.getElement("btnCancel");

        this.txtName = this.elems.getText("txtName");
        this.txtPrice = this.elems.getText('txtPrice');
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.icon = this.elems.getElement("icon");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.icon);
        this.iconItem.setTipFrom(TipFrom.normal);

        this.objMyprice = this.elems.getElement("objMyprice");
        this.objLeftTime = this.elems.getElement("objLeftTime");
        this.objYikoujia = this.elems.getElement("objYikoujia");
        this.txtMyPrice = this.elems.getText("txtMyPrice");
        this.txtLeftTime = this.elems.getText("txtLeftTime");
        this.txtYiKouJia = this.elems.getText("txtYiKouJia");
        this.txtTips = this.elems.getText("txtTips");

        this.cneterTip = this.elems.getElement("cneterTip");
        this.cneterTip2 = this.elems.getElement("cneterTip2");
        this.txtMaxPrice = this.elems.getText("txtMaxPrice");
        this.txtTips2 = this.elems.getText("txtTips2");


    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.mask, this.onCLickMask);
        this.addClickListener(this.btnClose, this.onCLickMask);
        this.addClickListener(this.btnJingPai, this.onClickJingPai);
        this.addClickListener(this.btnCancel, this.onCLickMask);
    }

    open(macrosType: number, data: Protocol.PaiMaiItemOne, isYiKouJia: boolean = false) {
        this.macrosType = macrosType;
        this.curSelectData = data;
        this.isYiKouJia = isYiKouJia;
        super.open();
    }

    protected onOpen() {
        this.updateView();
        this.addTimer("1", 1000, 0, this.onTimer);
    }

    protected onClose() {

    }


    private onTimer() {
        if (this.timeCheck) {
            this.leftTime--;
            if (this.leftTime > 0) {
                this.txtLeftTime.text = DataFormatter.second2hhmmss(this.leftTime);
            } else {
                this.txtLeftTime.text = "已到期";
                this.timeCheck = false;
            }
        }
    }


    private onCLickMask() {
        this.close();
    }


    updateView() {

        if (this.curSelectData == null)
            return;

        this.iconItem.updateById(this.curSelectData.m_iItemID, this.curSelectData.m_iItemCount);
        this.iconItem.updateIcon();
        let thingConfig = ThingData.getThingConfig(this.curSelectData.m_iItemID);
        this.txtName.text = TextFieldUtil.getColorText(thingConfig.m_szName, Color.getColorById(thingConfig.m_ucColor));

        /**我的竞价*/
        this.myPrice = this.curSelectData.m_iCurPrice + (Math.floor(this.curSelectData.m_iMaxPrice * 0.1));
        this.txtPrice.text = this.curSelectData.m_iCurPrice.toString();

        this.objMyprice.SetActive(!this.isYiKouJia);
        this.objLeftTime.SetActive(!this.isYiKouJia);
        this.objYikoujia.SetActive(this.isYiKouJia)

        let str = "一口价购买的物品通过邮件发放\n";

        if (this.isYiKouJia) {
            this.txtYiKouJia.text = uts.format("是否消耗{0}钻石直接购买？", TextFieldUtil.getColorText(this.curSelectData.m_iMaxPrice + "", Color.GREEN));
            this.myPrice = this.curSelectData.m_iMaxPrice;
            this.cneterTip.SetActive(true);
            this.cneterTip2.SetActive(false);
        } else {
            /**我的竞价*/
            // this.myPrice = this.curSelectData.m_iCurPrice + (Math.floor(this.curSelectData.m_iMaxPrice * 0.1));
            if (this.curSelectData.m_stRoleID.m_uiUin == 0)
                this.myPrice = this.curSelectData.m_iCurPrice;
            else
                this.myPrice = this.curSelectData.m_iCurPrice + (Math.floor(this.curSelectData.m_iMaxPrice * 0.1));
                
            if (this.myPrice >= this.curSelectData.m_iMaxPrice) {
                this.cneterTip.SetActive(false);
                this.cneterTip2.SetActive(true);
                this.txtMaxPrice.text = this.curSelectData.m_iMaxPrice.toString();
                this.txtTips2.text = TextFieldUtil.getColorText(str, Color.GREY);
                this.myPrice = this.curSelectData.m_iMaxPrice;
            } else {
                this.cneterTip.SetActive(true);
                this.cneterTip2.SetActive(false);
                str = "竞价成功获得物品、竞价失败返还钻石，\n均通过邮件发放";
                this.txtMyPrice.text = this.myPrice.toString();
            }
            this.leftTime = this.curSelectData.m_uiTime - Math.floor(G.SyncTime.getCurrentTime() / 1000);
            if (this.leftTime > 0) {
                this.timeCheck = true;
            }
        }
        this.txtTips.text = TextFieldUtil.getColorText(str, Color.GREY);
        //  UIUtils.setGrey(this.txtTips.gameObject, true, true);
    }



    private onClickJingPai() {

        if (this.macrosType == Macros.GUILD_PAIMAI_SELF) {
            this.macrosType = G.DataMgr.runtime.curPaiMaiType;
        }

        uts.log("  竞价还是一口价  " + this.macrosType + "  this.curSelectData.m_uiGuildID  " + this.curSelectData.m_uiGuildID +
            "   价格   " + this.myPrice
        );

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQueryRequest(this.macrosType, this.curSelectData.m_uiGuildID, this.curSelectData.m_iID, this.myPrice));
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQueryRequest(Macros.GUILD_PAIMAI_OPEN_GUILD));
        this.close();
    }


    //protected onClickYiKouJia() {
    //    // G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQueryRequest(Macros.GUILD_PAIMAI_BUY_WORLD, this.curSelectData.m_uiGuildID, this.curSelectData.m_iItemID, this.curSelectData.m_iMaxPrice));
    //    G.Uimgr.createForm<GuildJingPaiConfirmView>(GuildJingPaiConfirmView).open(this.curSelectData, true);
    //}



}