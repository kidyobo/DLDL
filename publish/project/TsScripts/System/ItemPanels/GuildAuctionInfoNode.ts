import { ItemIconBasicInfoNode } from "./ItemIconBasicInfoNode"
import { UiElements } from "System/uilib/UiElements";
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIUtils } from 'System/utils/UIUtils'
import { Global as G } from 'System/global'
import { DataFormatter } from 'System/utils/DataFormatter'
import { Color } from "../utils/ColorUtil";
import { TextFieldUtil } from "../utils/TextFieldUtil";


/**工会竞拍 右侧信息界面 */
export class GuildAuctionInfoNode {
    /**标题名字*/
    private txtTitleName: UnityEngine.UI.Text;
    /**基础信息物体*/
    private goItemBasic: UnityEngine.GameObject;
    /**时间*/
    private txtTime: UnityEngine.UI.Text;
    /**竞价*/
    private txtPrice: UnityEngine.UI.Text;
    private imgPrice: UnityEngine.UI.RawImage;
    /**一口价*/
    private txtFixedPrice: UnityEngine.UI.Text;
    private imgFixedPrice: UnityEngine.UI.RawImage;
    private btnPrice: UnityEngine.GameObject;
    private btnFixedPrice: UnityEngine.GameObject;

    private itemIconBasic: ItemIconBasicInfoNode;
    public onClickPriceCall: () => void;
    public onClickFixedPriceCall: () => void;
    private leftTime: number;
    private timeCheck: boolean = false;


    setComponents(elements: UiElements, itemIcon_Normal: UnityEngine.GameObject) {
        this.txtTitleName = elements.getText("txtTitleName");
        this.goItemBasic = elements.getElement("itemBaseInfo");
        this.txtTime = elements.getText("txtTime");

        let price = elements.getElement("price");
        this.txtPrice = ElemFinder.findText(price, "txtPrice");
        this.imgPrice = ElemFinder.findRawImage(price, "moneybg");
        let fixedPrice = elements.getElement("fixedPrice");
        this.txtFixedPrice = ElemFinder.findText(fixedPrice, "txtPrice");
        this.imgFixedPrice = ElemFinder.findRawImage(fixedPrice, "moneybg");

        this.btnPrice = elements.getElement("btnPrice");
        this.btnFixedPrice = elements.getElement("btnFixedPrice");

        this.itemIconBasic = new ItemIconBasicInfoNode();
        this.itemIconBasic.setComponents(this.goItemBasic, itemIcon_Normal);

        Game.UIClickListener.Get(this.btnPrice).onClick = delegate(this, this.onClickPrice);
        Game.UIClickListener.Get(this.btnFixedPrice).onClick = delegate(this, this.onClickFixedPrice);
    }

    updateNode(data: Protocol.PaiMaiItemOne) {
        this.itemIconBasic.updateItemId(data.m_iItemID);
        this.txtPrice.text = data.m_iCurPrice.toString();
        this.txtFixedPrice.text = data.m_iMaxPrice.toString();

        this.leftTime = data.m_uiTime - Math.floor(G.SyncTime.getCurrentTime() / 1000);
        if (this.leftTime > 0) {
            this.timeCheck = true;
        } else {
            this.txtTime.text = "已到期";
        }
    }

    updateNodeFormWorld(data: Protocol.WorldPaiMaiItem) {
        this.itemIconBasic.updateItemId(data.m_iItemID);
        this.txtPrice.text = data.m_iCurPrice.toString();
        this.txtFixedPrice.text = data.m_iMaxPrice.toString();

        this.leftTime = data.m_uiEndTime - Math.floor(G.SyncTime.getCurrentTime() / 1000);
        if (this.leftTime > 0) {
            this.timeCheck = true;
        } else {
            this.txtTime.text = "已到期";
        }
    }

    updateTimer() {
        if (this.timeCheck) {
            this.leftTime--;
            if (this.leftTime > 0) {
                this.txtTime.text =TextFieldUtil.getColorText( DataFormatter.second2hhmmss(this.leftTime),Color.GREEN);
            } else {
                this.txtTime.text = "已到期";
                this.stopTime();
            }
        }
    }

    private stopTime() {
        this.timeCheck = false;
    }

    /**
     * 设置竞价按钮状态
     * @param isable
     */
    setPriceButtonState(isable: boolean) {
        UIUtils.setButtonClickAble(this.btnPrice, isable);
    }

    /**
     * 设置一口价按钮状态
     * @param isable
     */
    setFixedPriceButtonState(isable: boolean) {
        UIUtils.setButtonClickAble(this.btnFixedPrice, isable);
    }

    private onClickPrice(){
        if(this.onClickPriceCall)
            this.onClickPriceCall();
    }

    private onClickFixedPrice(){
        if(this.onClickFixedPriceCall)
            this.onClickFixedPriceCall();
    }
}