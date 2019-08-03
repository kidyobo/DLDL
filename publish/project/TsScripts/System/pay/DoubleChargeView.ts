import { EnumRewardState } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { List } from "System/uilib/List";
import { ListItemCtrl } from "System/uilib/ListItemCtrl";
import { ElemFinder } from "System/uilib/UiUtility";
import { UIUtils } from "System/utils/UIUtils";

import { DoubleChargeData } from "./DoubleChargeData";

export class ChargeItem extends ListItemCtrl {
    /**充值多少钻石*/
    private txtyuanbaoNum: UnityEngine.UI.Text;
    /**rmb需要多少*/
    private txtRmb: UnityEngine.UI.Text;
    private data: GameConfig.ChargeGiftConfigM;
    /**钻石背景图*/
    private bg: UnityEngine.UI.Image;
    private _canGetEff: UnityEngine.GameObject;

    private _index: number;

    private _gameObj: UnityEngine.GameObject;

    initItemInfo(go: UnityEngine.GameObject,
        data: GameConfig.ChargeGiftConfigM,
        payBgAltas: Game.UGUIAltas,
        index: number) {
        this.setComponents(go);

        this.data = data;
        this._index = index;
        this._initData(payBgAltas);
    }
    setComponents(go: UnityEngine.GameObject) {
        this._gameObj = go;
        this.txtRmb = ElemFinder.findText(go, "txtRmb");
        this.txtyuanbaoNum = ElemFinder.findText(go, "titleBack1/txtyuanbaoNum");
        this.bg = ElemFinder.findImage(go, "bg");
        this._canGetEff = ElemFinder.findObject(go, 'canGetEff');
        Game.UIClickListener.Get(go).onClick = delegate(this, this._onClickChargeItem, 0);
    }

    private _initData(payBgAltas: Game.UGUIAltas) {
        this.txtRmb.text = "¥" + this.data.m_iChargeRMB;
        this.txtyuanbaoNum.text = this.data.m_iChargeCount.toString();
        this.bg.sprite = payBgAltas.Get("yb" + (this._index + 1));
    }

    update() {
        let status = G.DataMgr.doubleChargeData.StatusList[this._index];
        //刷新状态
        let statusStr = '';
        let clickable = true;
        switch (status) {
            case EnumRewardState.NotReach:
                statusStr = "¥" + this.data.m_iChargeRMB;
                break;
            case EnumRewardState.NotGot:
                statusStr = "可领取";
                break;
            case EnumRewardState.HasGot:
                statusStr = "已领取";
                clickable = false;
                break;
        }

        this.txtRmb.text = statusStr;
        UIUtils.setButtonClickAble(this._gameObj, clickable);
        this._canGetEff.SetActive(status == EnumRewardState.NotGot);
    }

    private _onClickChargeItem() {
        if (G.DataMgr.doubleChargeData.RemainTime <= 0) {
            G.TipMgr.addMainFloatTip('抱歉，您的剩余次数已用完！');
            return;
        }

        let statusList: number[] = G.DataMgr.doubleChargeData.StatusList;
        let curStatus = statusList[this._index];
        if (curStatus == EnumRewardState.HasGot) {
            G.TipMgr.addMainFloatTip('奖励已领取！');
            return;
        }

        if (curStatus == EnumRewardState.NotReach) {
            //充值超过两次，就不让再充了
            let getTime = 0;
            for (let value of statusList) {
                if (value != EnumRewardState.NotReach) getTime++;
            }

            if (getTime >= DoubleChargeData.MAX_REMAIN_TIME) {
                G.TipMgr.addMainFloatTip('抱歉，您的双倍充值次数已用完！');
                return;
            }

            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDefineDoubleChargeRMBRequest(this.data.m_iChargeRMB, true));
            return;
        }

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoubleChargeRewardRequest(this.data.m_iChargeRMB));
    }
}


export class DoubleChargeView extends CommonForm {

    private static _TREASEBOX_NUM = 0;

    private _btnClose: UnityEngine.GameObject;
    private _mask: UnityEngine.GameObject;
    private list: List;

    private _timeTxt: UnityEngine.UI.Text;

    private _chargeItems: ChargeItem[] = [];

    private _bgAltas: Game.UGUIAltas;

    constructor() {
        super(KeyWord.ACT_FUNCTION_DOUBLE_CHARGE);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.DoubleChargeView;
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoubleChargePanelRequest());
    }

    protected onClose() {
        let curChargeRMB = G.DataMgr.doubleChargeData.CurChargeRMB;
        if (curChargeRMB <= 0) return;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDefineDoubleChargeRMBRequest(curChargeRMB, false));
        G.DataMgr.doubleChargeData.CurChargeRMB = 0;
    }

    onCurrencyChange(id: number) {
        if (id != KeyWord.MONEY_YUANBAO_ID) return;

        G.DataMgr.doubleChargeData.CurChargeRMB = 0;

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoubleChargePanelRequest());
    }

    protected initElements(): void {
        this._btnClose = this.elems.getElement("btnClose");
        this._timeTxt = this.elems.getText("timeTxt");
        this._bgAltas = this.elems.getElement('payBgAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this.list = this.elems.getUIList("list");
        let data = G.DataMgr.payData.ShopData;
        DoubleChargeView._TREASEBOX_NUM = data.length;
        this.list.Count = DoubleChargeView._TREASEBOX_NUM;
        for (let i = 0; i < DoubleChargeView._TREASEBOX_NUM; i++) {
            let item = this.list.GetItem(i);
            this._chargeItems[i] = new ChargeItem();
            this._chargeItems[i].initItemInfo(item.gameObject, data[i], this._bgAltas, i);
        }
    }

    protected initListeners(): void {
        this.addClickListener(this._btnClose, this._onClickBtnClose);
    }

    private _onClickBtnClose() {
        this.close();
    }

    updateView(): void {
        for (let i = 0; i < DoubleChargeView._TREASEBOX_NUM; i++) {
            this._chargeItems[i].update();
        }

        this._timeTxt.text = '当前剩余返利次数：' + G.DataMgr.doubleChargeData.RemainTime;
    }
}