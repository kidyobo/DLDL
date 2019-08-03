import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { IconItem } from 'System/uilib/IconItem'
import { PriceBar } from 'System/business/view/PriceBar'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { GroupList } from 'System/uilib/GroupList'
import { ElemFinder } from 'System/uilib/UiUtility'
import { TipFrom } from 'System/tip/view/TipsView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { NumInput } from 'System/uilib/NumInput'
import { KeyWord } from 'System/constants/KeyWord'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'

export class ZhuFuZhaoHuiView extends CommonForm {

    //UI组件
    private ruleText: UnityEngine.UI.Text;
    private yuanShiImage: UnityEngine.UI.Image;
    private shuaiJianImage: UnityEngine.UI.Image;
    private yuanshiImageRect: UnityEngine.RectTransform;
    private shuaiJianImageRect: UnityEngine.RectTransform;
    private yuanBaoText: UnityEngine.UI.Text;
    private btn_zhaohui: UnityEngine.GameObject;
    private canZhuiHuiZuFuText: UnityEngine.UI.Text;
    //添加按钮相关
    private numInput: NumInput;
    private btn_max: UnityEngine.GameObject;
    //参数 
    private openId: number = 0;
    private stageMaxValue: number = 0;
    private shuaiJianValue: number = 0;
    private currentValue: number = 0;
    private canZhuiHuiMaxValue: number = 0;
    //价格
    private yuanBaoPriceBar: PriceBar;
    private yuanBaoObj: UnityEngine.GameObject;
    private inputValue: number = 0;

    /**宝物用*/
    private m_selectedId: number = 0;

    private isFirstOpen: boolean = true;

    private readonly priceValue = G.DataMgr.constData.getValueById(KeyWord.PARAM_HERO_SUB_LUCKY_FILL_PRICE) / 100;

    constructor() {
        super(0);
    }


    layer(): UILayer {
        return UILayer.Second;
    }


    protected resPath(): string {
        return UIPathData.ZhuFuZhaoHuiView;
    }


    protected initElements(): void {
        this.ruleText = this.elems.getText("ruleText");
        this.yuanShiImage = this.elems.getImage("yuanshiImage");
        this.shuaiJianImage = this.elems.getImage("shuaijianImage");
        this.yuanBaoObj = this.elems.getElement("yuanbaoIcon");
        this.yuanBaoText = this.elems.getText("yuanbaoText");
        this.btn_zhaohui = this.elems.getElement("btnBuy");
        this.yuanshiImageRect = this.yuanShiImage.gameObject.transform as UnityEngine.RectTransform;
        this.shuaiJianImageRect = this.shuaiJianImage.gameObject.transform as UnityEngine.RectTransform;
        this.canZhuiHuiZuFuText = this.elems.getText("canZhuiHuiZhuFu");
        //添加按钮相关
        this.btn_max = this.elems.getElement("btnMax");
        //钻石
        this.yuanBaoPriceBar = new PriceBar();
        this.yuanBaoPriceBar.setComponents(this.yuanBaoObj);
        this.yuanBaoPriceBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID);
        //增加减少
        this.numInput = new NumInput();
        this.numInput.setComponents(this.elems.getElement('numInput'));
        this.numInput.onValueChanged = delegate(this, this.onNumInputValueChanged);
    }


    protected initListeners(): void {
        this.addClickListener(this.elems.getElement("btn_return"), this.close);
        this.addClickListener(this.elems.getElement("mask"), this.close);
        this.addClickListener(this.btn_zhaohui, this.onClickBtnZhuiHui);
        this.addClickListener(this.btn_max, this.onClickBtnMax);
    }


    /**id为祝福系统的id,stageMaxValue为当前阶最大祝福值,shuaiJianValue为衰减的值,currentValue为衰减后的值*/
    open(id: number = 0, stageMaxValue: number, shuaiJianValue: number, currentValue: number, faqiId: number = 0) {
        this.openId = id;
        this.m_selectedId = faqiId;
        this.stageMaxValue = stageMaxValue;
        this.updateView(shuaiJianValue, currentValue);
        G.DataMgr.fabaoData.zhuiHuiFaQiId = faqiId;
        super.open();
    }


    protected onOpen() {
        this.updatePanel();
    }


    protected onClose() {

    }


    /**刷新面板*/
    updateView(shuaiJianValue: number, currentValue: number) {
        this.shuaiJianValue = shuaiJianValue;
        this.currentValue = currentValue;

        if (this.currentValue + this.shuaiJianValue >= this.stageMaxValue) {
            this.canZhuiHuiMaxValue = this.stageMaxValue - this.currentValue;
        } else {
            this.canZhuiHuiMaxValue = this.shuaiJianValue;
        }
        if (!this.isFirstOpen) {
            this.updatePanel();
        }
    }


    private updatePanel() {
        this.numInput.setRange(1, this.canZhuiHuiMaxValue, 1, this.numInput.num);
        this.numInput.num = this.canZhuiHuiMaxValue;
        let coin = Math.ceil(this.priceValue * this.canZhuiHuiMaxValue);
        this.yuanBaoPriceBar.setPrice(coin);
        this.canZhuiHuiZuFuText.text = uts.format("当前可追回祝福值:{0}", this.canZhuiHuiMaxValue);
        let value1 = this.currentValue / this.stageMaxValue;
        let value2: number = 0;
        if (this.shuaiJianValue + this.currentValue >= this.stageMaxValue) {
            value2 = 1;
        } else {
            value2 = (this.shuaiJianValue + this.currentValue) / this.stageMaxValue;
        }
        this.shuaiJianImageRect.localScale = new UnityEngine.Vector3(value1, 1, 1);
        this.yuanshiImageRect.localScale = new UnityEngine.Vector3(value2, 1, 1);
        this.yuanBaoText.text = uts.format("拥有钻石:{0}", G.DataMgr.heroData.gold);
        this.isFirstOpen = false;
    }


    private onClickBtnZhuiHui() {
        if (this.openId == KeyWord.OTHER_FUNCTION_MAGICCUBE) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMagicCubeLuckyRequest(Macros.MAGICCUBE_LUCKY_FILL, this.inputValue));
        }
        else if (this.openId == KeyWord.BAR_FUNCTION_JIUXING) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getJiuXingRequest(Macros.JIUXING_LUCKY_FILL, this.inputValue));
            ;
        }
        else if (this.openId == KeyWord.BAR_FUNCTION_FAQI) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFaqiRequest(this.m_selectedId, Macros.FAQI_OP_LUCKY_FILL, this.inputValue));
        }
        else {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHeroSubLuckyRequest(this.openId, 2, this.inputValue));
        }

    }


    private onNumInputValueChanged(num: number): void {
        // 更新总价
        this.inputValue = num;
        if (this.inputValue > this.canZhuiHuiMaxValue) {
            this.inputValue = this.canZhuiHuiMaxValue;
        }
        let coin = Math.ceil(this.priceValue * this.inputValue);
        this.yuanBaoPriceBar.setPrice(coin);
    }



    private onClickBtnMax() {
        this.numInput.num = this.canZhuiHuiMaxValue;
    }


}