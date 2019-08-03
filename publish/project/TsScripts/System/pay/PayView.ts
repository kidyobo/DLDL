import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { GuildView } from "System/guild/view/GuildView";
import { PayData } from 'System/pay/PayData';
import { YuanGuJingPaiView } from 'System/pinstance/boss/YuanGuJingPaiView';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { List } from 'System/uilib/List';
import { ListItemCtrl } from 'System/uilib/ListItemCtrl';
import { ElemFinder } from 'System/uilib/UiUtility';
import { VipTab, VipView } from 'System/vip/VipView';

export class PayItem extends ListItemCtrl {
    /**充值多少钻石*/
    private txtyuanbaoNum: UnityEngine.UI.Text;
    /**rmb需要多少*/
    private txtRmb: UnityEngine.UI.Text;
    /**返利多少绑定钻石*/
    private txtbindyuanbaoNum: UnityEngine.UI.Text;
    private normalImag: UnityEngine.GameObject;
    private data: GameConfig.ChargeGiftConfigM;
    /**钻石背景图*/
    private bg: UnityEngine.UI.Image;
    private normal: UnityEngine.GameObject;
    /**首次充值*/
    private firstCharge: UnityEngine.GameObject;
    private firstImag: UnityEngine.GameObject;
    setComponents(go: UnityEngine.GameObject) {
        this.txtRmb = ElemFinder.findText(go, "txtRmb");
        this.txtyuanbaoNum = ElemFinder.findText(go, "titleBack1/txtyuanbaoNum");
        this.normal = ElemFinder.findObject(go, "titleBack3/normal");
        this.txtbindyuanbaoNum = ElemFinder.findText(go, "titleBack3/txtbindyuanbaoNum");
        this.bg = ElemFinder.findImage(go, "bg");
        this.normalImag = ElemFinder.findObject(go, "titleBack3/bingyuanbaoImg")
        //首次充值
        this.firstCharge = ElemFinder.findObject(go, "titleBack3/firstcharge");
        this.firstImag = ElemFinder.findObject(go, "titleBack3/yuanbaoImg");

        Game.UIClickListener.Get(go).onClick = delegate(this, this.onClickListItem)
    }

    update(data: GameConfig.ChargeGiftConfigM, macros: number, payBgAltas: Game.UGUIAltas, curIndex: number) {
        this.data = data;
        this.txtRmb.text = "￥" + data.m_iChargeRMB;
        this.txtyuanbaoNum.text = data.m_iChargeCount.toString();
        if (G.DataMgr.heroData.curChargeMoney > 0) {
            this.normalImag.SetActive(true);
            this.firstImag.SetActive(false);
            this.firstCharge.SetActive(false);
            this.normal.SetActive(true);
            this.txtbindyuanbaoNum.text = data.m_iPresentCount.toString();
        } else {
            if (curIndex == 0) {
                this.firstCharge.SetActive(true);
                this.normal.SetActive(false);
            } else {
                this.firstCharge.SetActive(false);
                this.normal.SetActive(true);
            }
            this.txtbindyuanbaoNum.text = data.m_iFirstPresentCount.toString();
            this.normalImag.SetActive(false);
            this.firstImag.SetActive(true);
        }
        this.bg.sprite = payBgAltas.Get("yb" + (curIndex + 1));
    }

    private onClickListItem() {
        G.ChannelSDK.pay(this.data.m_iProductID);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.HAPPY_CHARGE_REBATE, 0, 0));
    }

}


export class PayView extends CommonForm {

    private btnReturn: UnityEngine.GameObject;
    private list: List;
    private btnLook: UnityEngine.GameObject;
    private payItems: PayItem[] = [];
    private payBgAltas: Game.UGUIAltas;
    private otherKeyword: number = 0;
    private subKeyword: number = 0;

    constructor() {
        super(VipTab.ChongZhi);//KeyWord.ACT_FUNCTION_CHARGE
    }

    layer(): UILayer {
        return UILayer.Pay;
    }
    protected resPath(): string {
        return UIPathData.PayView;
    }

    open(otherKeyword: number = 0, subKeyword: number = 0) {
        this.otherKeyword = otherKeyword;
        this.subKeyword = subKeyword;
        super.open();
    }

    protected onOpen() {
        this.updatePanel();
        G.DataMgr.payRecepitData.checkLeakRecepit();
    }

    protected onClose() {
        if (this.otherKeyword == KeyWord.OTHER_FUNCTION_GUILD_JINGPAI) {
            G.Uimgr.createForm<GuildView>(GuildView).open(this.otherKeyword, this.subKeyword);
        } else if (this.otherKeyword == KeyWord.OTHER_FUNCTION_WORLDPAIMAI) {
            G.Uimgr.createForm<YuanGuJingPaiView>(YuanGuJingPaiView).open();
        }
    }

    protected initElements(): void {
        this.btnReturn = this.elems.getElement("btn_return");
        this.btnLook = this.elems.getElement("btnLook");
        this.list = this.elems.getUIList("list");
        this.list.clickDelay = 0;
        this.payBgAltas = this.elems.getElement('payBgAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        // 死亡情况下payview置于顶层，这时候有这个按钮很恶心，索性不要了
        this.btnLook.SetActive(false);
    }

    protected initListeners(): void {
        this.addClickListener(this.btnReturn, this.onClickReturn);
        this.addClickListener(this.btnLook, this.onClickLook);
        this.addClickListener(this.elems.getElement('mask'), this.onClickReturn);
    }

    private onClickReturn() {
        this.close();
    }

    private onClickLook() {
        G.Uimgr.createForm<VipView>(VipView).open(VipTab.TeQuan);
    }

    updatePanel() {
        //屏蔽第一个档次
        let data = G.DataMgr.payData.ShopData;
        let count = G.IsIosTiShenEnv ? data.length : data.length - 1;
        this.list.Count = count;
        for (let i = 0; i < count; i++) {
            if (this.payItems[i] == null) {
                let item = this.list.GetItem(i);
                this.payItems[i] = new PayItem();
                this.payItems[i].setComponents(item.gameObject);
            }
            let index = G.IsIosTiShenEnv ? i : i + 1;
            this.payItems[i].update(data[index], PayData.ChargeMacros[index], this.payBgAltas, index);
        }
    }
}