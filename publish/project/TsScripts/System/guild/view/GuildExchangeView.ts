import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { IconItem } from 'System/uilib/IconItem'
import { ElemFinder } from 'System/uilib/UiUtility'
import { TipFrom } from 'System/tip/view/TipsView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { NumInput } from 'System/uilib/NumInput'
import { KeyWord } from 'System/constants/KeyWord'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { GuildTools } from 'System/guild/GuildTools'

export class GuildExchangeView extends CommonForm {

    /**最大数量。*/
    static readonly MAX_COUNT: number = 100;

    private btnClose: UnityEngine.GameObject;
    private iconItem: IconItem;
    private textName: UnityEngine.UI.Text;
    private textCost: UnityEngine.UI.Text;
    /**数量输入*/
    private numInput: NumInput;
    private btnMax: UnityEngine.GameObject;

    private btnExchange: UnityEngine.GameObject;

    private openItemData: ThingItemData;
    private maxExchangeCnt: number = 0;
    private itemIcon_Normal: UnityEngine.GameObject;
    constructor() {
        super(0);
    }
    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.GuildExchangeView;
    }
    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.btnClose = this.elems.getElement('btnClose');

        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.itemIcon_Normal ,this.elems.getElement('icon'));
        this.iconItem.setTipFrom(TipFrom.normal);

        this.textName = this.elems.getText('textName');
        this.textCost = this.elems.getText('textCost');

        this.numInput = new NumInput();
        this.numInput.setComponents(this.elems.getElement('numInput'));
        this.numInput.onValueChanged = delegate(this, this.onNumInputValueChanged);
        this.btnMax = this.elems.getElement('btnMax');

        this.btnExchange = this.elems.getElement('btnExchange');
    }
    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.elems.getElement('mask'), this.onClickBtnClose);
        this.addClickListener(this.btnMax, this.onClickBtnMax);
        this.addClickListener(this.btnExchange, this.onClickBtnExchange);
    }

    protected onOpen() {
        this.iconItem.updateByThingItemData(this.openItemData);
        this.iconItem.updateIcon();

        this.textName.text = this.openItemData.config.m_szName;
        this.textName.color = Color.toUnityColor(Color.getColorById(this.openItemData.config.m_ucColor));

        if (GameIDUtil.isEquipmentID(this.openItemData.data.m_iThingID)) {
            this.maxExchangeCnt = this.openItemData.data.m_iNumber;
        } else {
            let canBuyCount: number = GuildTools.getCanBuyCount(this.openItemData.data.m_iThingID);
            this.maxExchangeCnt = Math.min(this.openItemData.data.m_iNumber, canBuyCount);
            this.maxExchangeCnt = Math.max(this.maxExchangeCnt, 1);
        }

        this.numInput.setRange(1, this.maxExchangeCnt, 1, 1)
    }

    protected onClose() {
    }

    /**点击最大数量按钮事件的响应函数。*/
    private onClickBtnMax(): void {
        this.numInput.num = this.numInput.maxNum;
    }

    /**点击兑换按钮事件的响应函数。*/
    private onClickBtnExchange(): void {
        GuildTools.doExchange(this.openItemData, this.numInput.num);
    }

    private onNumInputValueChanged(num: number): void {
        // 更新总价
        let needMoney = GuildTools.getDepotBuyMoney(this.openItemData.data.m_iThingID, this.numInput.num);
        this.textCost.text = G.DataMgr.langData.getLang(53, needMoney);
    }

    /**
     * 打开批量购买对话框
     * @param id 物品id
     * @param number 购买数量
     * @param storeID 商店id，0表示默认钻石商城
     * @param excID 货币id，0表示默认钻石
     * @param autoUse 是否自动使用，1表自动使用
     * @param showGetFrom 是否显示获取途径
     * @param onlyOneExcType 是否只显示一种支付方式
     */
    open(itemData: ThingItemData) {
        this.openItemData = itemData;
        super.open();
    }

    private onClickBtnClose() {
        this.close();
    }
}