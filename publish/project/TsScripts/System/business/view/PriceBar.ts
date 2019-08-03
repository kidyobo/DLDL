import { Global as G } from 'System/global'
import { ElemFinder } from 'System/uilib/UiUtility'
import { CurrencyIcon } from 'System/uilib/CurrencyIcon'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { ThingData } from 'System/data/thing/ThingData'
import { TipFrom } from 'System/tip/view/TipsView'

export class PriceBar {

    /**普通模式。*/
    static COLOR_NORMAL: number = 0;

    /**充足模式。*/
    static COLOR_ENOUGH: number = 1;

    /**不足模式。*/
    static COLOR_NOTENOUGH: number = 2;

    /**自定义模式。*/
    static COLOR_CUSTOMER: number = 3;

    /**货币图标。*/
    private icon: CurrencyIcon;

    private numText: UnityEngine.UI.Text;

    /**货币ID。*/
    private m_currencyID: number = 0;

    private m_num: number = 0;

    private useWan = false;

    /**标记是否可以点击*/
    private isOnClick = true;

    setComponents(go: UnityEngine.GameObject) {
        this.icon = new CurrencyIcon();
        this.icon.setComponents(go);
        this.numText = ElemFinder.findText(go, 'text');

        Game.UIClickListener.Get(go).onClick = delegate(this, this.onClick);
    }

    /**
	* 设置货币ID。
	* @param value 货币ID。
	* @param bindSensitive 对于铜钱和钻石的图标显示，是否绑定与否敏感。默认为false，即不管
	* 传入的是绑定铜钱ID还是非绑定铜钱ID都将采用非绑定铜钱图标进行显示。仅与图标显示有关。
	*
	*/
    setCurrencyID(value: number, bindSensitive = false, useWan = false): void {
        this.useWan = useWan;
        if (this.m_currencyID != value) {
            // 货币图标和tip
            this.m_currencyID = value;
            this.icon.setCurrencyID(value, bindSensitive);
        }
    }

    /**
	* 设置价格数量。
	* @param num 价格数量。
	* @param colorType 价格颜色类型。
	* @param format 当使用自定义模式时，需要指定文本的格式，支持uint（颜色值）和TextFormat。
	*
	*/
    setPrice(num: number, colorType: number = PriceBar.COLOR_NORMAL, customerColor: string = null): void {
        this.m_num = num;
        let color: string = customerColor;
        if (null == color) {
            if (PriceBar.COLOR_NORMAL == colorType) {
                if (GameIDUtil.isYuanbaoID(this.m_currencyID)) {
                    color = Color.YUANBAO;
                }
                else {
                    color = Color.WHITE;
                }
            }
            else if (PriceBar.COLOR_ENOUGH == colorType) {
                color = Color.GREEN;
            }
            else if (PriceBar.COLOR_NOTENOUGH == colorType) {
                color = Color.RED;
            }
        }

        this.numText.text = DataFormatter.cutWan(num);
        this.numText.color = Color.toUnityColor(color);
    }

    onClick() {
        if (!this.isOnClick) return;

        if (GameIDUtil.isSpecialID(this.m_currencyID)) {
            // 文本tip
            let textTipData = new TextTipData();
            textTipData.setTipData(CurrencyIcon.getTipStr(this.m_currencyID));
            G.ViewCacher.tipsView.open(textTipData, TipFrom.normal);
        } else {
            let itemTipData = new ItemTipData();
            itemTipData.setTipData(ThingData.getThingConfig(this.m_currencyID), null);
            G.ViewCacher.tipsView.open(itemTipData, TipFrom.normal);
        }
    }

    get num(): number {
        return this.m_num;
    }

    get currency(): number {
        return this.m_currencyID;
    }

    closeOnClick() {
        this.isOnClick = false;
    }
}