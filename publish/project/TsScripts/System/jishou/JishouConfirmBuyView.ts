import { Global as G } from 'System/global'
import { PriceBar } from 'System/business/view/PriceBar'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { IconItem } from 'System/uilib/IconItem'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { TipFrom } from 'System/tip/view/TipsView'
import { NumInput } from 'System/uilib/NumInput'
import { JishouItemData } from 'System/jishou/JishouItemData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { ThingData } from "System/data/thing/ThingData";

export class JishouConfirmBuyView extends CommonForm {
    /**关联的商店ID。*/
    private m_npcID: number = 0;

    /**打开时要显示的商品。*/
    private m_data: JishouItemData;

    private btnClose: UnityEngine.GameObject;
    /**商品Item。*/
    private iconItem: IconItem;
    private textName: UnityEngine.UI.Text;
    /**单价*/
    private singlePriceBar: PriceBar;
    /**总价*/
    private totalCostBar: PriceBar;
    /**数量输入*/
    private numInput: NumInput;
    private btnMax: UnityEngine.GameObject;
    private btnBuy: UnityEngine.GameObject;

    private itemIcon_Normal: UnityEngine.GameObject;
    constructor() {
        super(0);
    }
    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.JishouConfirmBuyView;
    }
    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.btnClose = this.elems.getElement('btnClose');

        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement('icon'));
        this.iconItem.setTipFrom(TipFrom.normal);

        this.textName = this.elems.getText('textName');

        this.singlePriceBar = new PriceBar();
        this.singlePriceBar.setComponents(this.elems.getElement('singlePrice'));
        this.singlePriceBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID, true);


        this.totalCostBar = new PriceBar();
        this.totalCostBar.setComponents(this.elems.getElement('totalCost'));
        this.totalCostBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID, true);

        this.numInput = new NumInput();
        this.numInput.setComponents(this.elems.getElement('numInput'));
        this.numInput.onValueChanged = delegate(this, this._onNumInputChange);
        this.btnMax = this.elems.getElement('btnMax');
        this.btnBuy = this.elems.getElement('btnBuy');


    }
    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.btnMax, this.onClickBtnMax);
        this.addClickListener(this.btnBuy, this._onClickBtnOk);

    }

    open(m_data: JishouItemData, m_npcID: number) {
        this.m_data = m_data;
        this.m_npcID = m_npcID;
        super.open();
    }

    protected onOpen() {
        this.updateSellInfo();
    }

    protected onClose() {
    }

    /**点击最大数量按钮事件的响应函数。*/
    private onClickBtnMax(): void {
        this.numInput.num = this.numInput.maxNum;
    }


    private onClickBtnClose() {
        this.close();
    }


    /**
		 * 点击最大数量按钮事件的响应函数。
		 * @param event
		 * 
		 */
    private _onClickBtnMax(): void {
        if (this.m_data != null) {
            this.numInput.num = this.m_data.data.data.m_iNumber;
        }
    }

    /**
     * 点击确定按钮事件的响应函数。
     * @param event
     * 
     */
    private _onClickBtnOk(): void {

        if (G.DataMgr.heroData.noFlGold >= this.numInput.num * this.m_data.price) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPPStoreBuy_RequestMsg(((this.m_data.id) as Protocol.PSDID), this.numInput.num, this.m_npcID));
            this.close();
        } else {
            G.ModuleMgr.businessModule.queryCharge(uts.format('您的{0}不足{1}，请充值。', KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, KeyWord.MONEY_YUANBAO_ID), this.numInput.num * this.m_data.price));
        }
    }

    private _onNumInputChange(num: number): void {
        // 更新总价
        let price: number = num * this.m_data.price;
        let color = G.DataMgr.heroData.noFlGold >= price ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH;
        this.singlePriceBar.setPrice(this.m_data.price, color, null);
        this.totalCostBar.setPrice(price, color, null);
    }

    /**更新购买信息*/
    private updateSellInfo(): void {
        this.iconItem.updateById(this.m_data.data.data.m_iThingID, 1);
        this.iconItem.updateIcon();
        let config: GameConfig.ThingConfigM = this.m_data.data.config;
        if (null != config) {
            // 更新名称
            this.textName.text = config.m_szName;
            this.textName.color = Color.toUnityColor(Color.getColorById(config.m_ucColor));
        }
        else {
            this.textName.text = '十万铜钱';
            this.textName.color = Color.toUnityColor(Color.TONGQIAN);
        }

        let max: number = this.m_data.data.data.m_iNumber;
        if (max > Macros.PPSTORESORT_MAX_BUY_NUMBER) {
            max = Macros.PPSTORESORT_MAX_BUY_NUMBER;
        }
        this.numInput.setRange(1, max, 1, 1);
    }
}