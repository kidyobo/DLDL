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
import { HuigouItemData } from 'System/jishou/HuigouItemData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'

export class HuigouConfirmBuyView extends CommonForm {

    /**打开时要显示的商品。*/
    private m_data: HuigouItemData;

    private btnClose: UnityEngine.GameObject;
    /**商品Item。*/
    private iconItem: IconItem;
    private textName: UnityEngine.UI.Text;
    private textLimit: UnityEngine.UI.Text;
    private textNumber: UnityEngine.UI.Text;

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
        return UIPathData.HuigouConfirmBuyView;
    }
    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.btnClose = this.elems.getElement('btnClose');

        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement('icon'));
        this.iconItem.setTipFrom(TipFrom.normal);

        this.textName = this.elems.getText('textName');
        this.textLimit = this.elems.getText('textLimit');
        this.textNumber = this.elems.getText('textNumber');

        this.singlePriceBar = new PriceBar();
        this.singlePriceBar.setComponents(this.elems.getElement('singlePrice'));
        this.totalCostBar = new PriceBar();
        this.totalCostBar.setComponents(this.elems.getElement('totalCost'));

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

    open(m_data: HuigouItemData) {
        this.m_data = m_data;
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
            this.numInput.num = this.m_data.has;
        }
    }

    /**
     * 点击确定按钮事件的响应函数。
     * @param event
     * 
     */
    private _onClickBtnOk(): void {
        if (this.m_data.has == 0) {
            G.TipMgr.addMainFloatTip("物品数量不足");
            return;
        }
        if (this.m_data.buy < this.m_data.limitCount) {
            let id = this.m_data.itemID;
            let num = this.numInput.num
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHuigouStoreRequest(id, num));
            this.close();
        }
    }

    private _onNumInputChange(num: number): void {
        // 更新总价
        let price: number = num * this.m_data.price;
        // let color = 0 == G.ActionHandler.getLackNum(this.m_data.exChangeID, price, false) ? PriceBar.COLOR_ENOUGH : PriceBar.COLOR_NOTENOUGH;
        let color = PriceBar.COLOR_ENOUGH;
        this.singlePriceBar.setPrice(this.m_data.price, color, null);
        this.totalCostBar.setPrice(price, color, null);
    }

    /**更新购买信息*/
    private updateSellInfo(): void {
        let config: GameConfig.ThingConfigM = this.m_data.config;
        let limit = this.m_data.limitCount;
        if (null != config) {
            this.iconItem.updateByItemConfig(config);
            this.iconItem.updateIcon();

            // 更新名称
            let exID = this.m_data.exChangeID;
            this.singlePriceBar.setCurrencyID(exID, true);
            this.totalCostBar.setCurrencyID(exID, true);

            this.textName.text = uts.format("{0} {1}", TextFieldUtil.getColorText(config.m_szName, Color.getColorById(config.m_ucColor)),
                TextFieldUtil.getColorText(uts.format("(拥有：{0}个)", this.m_data.has), Color.GOLD));
            // this.textName.color = Color.toUnityColor(Color.getColorById(config.m_ucColor));
            let num = limit - this.m_data.buy;
            let str = TextFieldUtil.getColorText(num.toString(), num == 0 ? Color.RED : Color.GREEN);
            this.textNumber.text = uts.format("限售数量：{0}个", str);

            let heroData = G.DataMgr.heroData;
            let stageHuangJin = heroData.getPrivilegeState(KeyWord.VIPPRI_2);//黄金特权
            let stageZuanShi = heroData.getPrivilegeState(KeyWord.VIPPRI_3);//钻石特权
            if (stageZuanShi >= 0) {
                this.textLimit.text = uts.format("出售上限：{0}个", limit);
            } else if (stageHuangJin >= 0) {
                this.textLimit.text = uts.format("出售上限：{0}个 {1}", limit,
                    TextFieldUtil.getColorText(uts.format("(开启{0}上限增至{1}个)",
                        TextFieldUtil.getPrivilegeText(KeyWord.VIPPRI_3), this.m_data.zsCount), Color.GOLD));
            } else {
                this.textLimit.text = uts.format("出售上限：{0}个 {1}", limit,
                    TextFieldUtil.getColorText(uts.format("(开启{0}上限增至{1}个)",
                        TextFieldUtil.getPrivilegeText(KeyWord.VIPPRI_2), this.m_data.hjCount), Color.GOLD));
            }
        }
        else {
            this.textName.text = '--';
            this.textName.color = Color.toUnityColor(Color.TONGQIAN);
            this.iconItem.reset();
        }

        //最大值判断
        let has = this.m_data.has;
        let buy = this.m_data.buy;
        let max: number;
        if (has <= limit - buy) {
            max = has;
        } else if (has > limit - buy) {
            max = limit - buy;
        }
        this.numInput.setRange(1, max, 1, 1);
    }
}