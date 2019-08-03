import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { ConfirmCheck, MessageBoxConst } from "System/tip/TipManager";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { ElemFinder, ElemFinderMySelf } from "System/uilib/UiUtility";
import { UIUtils } from "System/utils/UIUtils";
import { EnumGuide } from 'System/constants/GameEnum'


/**特殊特权面板*/
export class SpecialTeQuanView extends CommonForm {

    private titleText: UnityEngine.UI.Text;

    private btn_buy: UnityEngine.GameObject;
    private showIcon: UnityEngine.UI.Image;
    private desIcon: UnityEngine.UI.Image;//L
    private altas: Game.UGUIAltas;

    private titleStr: { [day: number]: string };
    private desIcons: { [day: number]: string };//L
    private spendPrice: number = 0;
    private btnText: UnityEngine.UI.Text;
    private types: { [day: number]: number };
    private hasJiHuoKa: boolean = false;
    private thingId: number = 0;

    constructor() {
        super(KeyWord.ACT_FUNCTION_SPECIAL_PRI);
    }

    open() {
        super.open();
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.SpecialTeQuanView;
    }

    protected initElements() {
        this.titleText = this.elems.getText('titleText');
        this.desIcon = this.elems.getImage('desIcon');//L

        this.btn_buy = this.elems.getElement('btn_Buy');
        this.btnText = ElemFinder.findText(this.btn_buy, 'Text');
        this.showIcon = this.elems.getImage('showIcon');
        this.altas = ElemFinderMySelf.findAltas(this.elems.getElement('altas'));

        this.titleStr = {};
        this.titleStr[3] = '神兵天降';
        this.titleStr[4] = '凌波微步';
        this.titleStr[5] = '无尽星环';
        this.titleStr[6] = '远古神装';
        this.titleStr[7] = '神的容颜';
        //L
        this.desIcons = {};
        this.desIcons[3] = 'sq';
        this.desIcons[4] = 'zj';
        this.desIcons[5] = 'xh';
        this.desIcons[6] = 'zb';
        this.desIcons[7] = 'yx';
        //L
        this.types = {};
        this.types[3] = 1;
        this.types[4] = 2;
        this.types[5] = 3;
        this.types[6] = 4;
        this.types[7] = 5;
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.elems.getElement('btn_return'), this.close);
        this.addClickListener(this.btn_buy, this.onClickBtnBuy);
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_SPECIAL_LIST, 0));
        let afterStartDay: number = G.SyncTime.getDateAfterStartServer();

        this.desIcon.sprite = this.altas.Get(this.desIcons[afterStartDay]);//L
        this.titleText.text = this.titleStr[afterStartDay];
        this.showIcon.sprite = this.altas.Get(afterStartDay.toString());
        this.showIcon.SetNativeSize();
        let days = G.DataMgr.vipData.getVipSpecialTeQuanOneConfig(KeyWord.SPECPRI_BUY_DAY).m_aiValue;
        let prices = G.DataMgr.vipData.getVipSpecialTeQuanOneConfig(KeyWord.SPECPRI_PRI_PIRCE).m_aiValue;
        for (let i = 0; i < days.length; i++) {
            if (afterStartDay == days[i]) {
                this.spendPrice = prices[i];
                break;
            }
        }
        G.GuideMgr.processGuideNext(EnumGuide.CommonOpenView, EnumGuide.CommonOpenView_OpenView);

    }

    protected onClose() {
        G.GuideMgr.processGuideNext(EnumGuide.CommonOpenView, EnumGuide.GuideCommon_None);

    }

    private onClickBtnBuy() {
        if (this.hasJiHuoKa) {
            let itemList = G.DataMgr.thingData.getBagItemById(this.thingId, false, 1);
            if (itemList != null && itemList.length > 0) {
                let itemData = itemList[0];
                G.ModuleMgr.bagModule.useThing(itemData.config, itemData.data, 1);
                this.close();
            }
        } else {
            if (G.DataMgr.heroData.gold >= this.spendPrice) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getVipOperateRequest(Macros.VIP_OPERATE_SPECIAL_BUY, this.types[G.SyncTime.getDateAfterStartServer()]));
                this.close();
            }
            else {
                G.TipMgr.showConfirm(uts.format('您的钻石不足{0}，请前往充值', this.spendPrice), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onClickConfirm));
            }
        }
    }

    updateView() {
        let vipData = G.DataMgr.vipData;
        let d = G.SyncTime.getDateAfterStartServer();
        let id = vipData.getSpecialPriKeyByDay(d);
        if (vipData.hasBuySpecialPri(id)) {
            this.btnText.text = '已激活';
            UIUtils.setButtonClickAble(this.btn_buy, false);
        } else {
            let itemId = vipData.getSpecialPriItemId(id);
            let items = G.DataMgr.thingData.getBagItemById(itemId, false, 1);
            if (items.length > 0) {
                this.btnText.text = '点击激活';
                UIUtils.setButtonClickAble(this.btn_buy, true);
                this.hasJiHuoKa = true;
                this.thingId = itemId;
            } else {
                this.btnText.text = '立即抢购';
                UIUtils.setButtonClickAble(this.btn_buy, true);
                this.hasJiHuoKa = false;
            }
        }
    }


    private onClickConfirm(state: MessageBoxConst): void {
        if (state == MessageBoxConst.yes) {
            this.close();
            G.ActionHandler.go2Pay();
        }
    }
}