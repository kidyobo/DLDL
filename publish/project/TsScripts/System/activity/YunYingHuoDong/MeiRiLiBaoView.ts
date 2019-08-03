import { CommonForm, UILayer, TextGetSet, GameObjectGetSet } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { Global as G } from "System/global"
import { Macros } from "System/protocol/Macros"
import { MathUtil } from "System/utils/MathUtil"
import { UIUtils } from "../../utils/UIUtils";
import { KeyWord } from "System/constants/KeyWord"
import { CurrencyTip } from "../../uilib/CurrencyTip";


enum MeiRiLiBaoBtnState {
    Buy = 0,
    CanGet = 1,
    IsGet = 2,
}


class MeiRiLiBaoListItem {
    private index: number;

    private btnGet: UnityEngine.GameObject;
    private btnPay: UnityEngine.GameObject;
    private btnTip: UnityEngine.GameObject;

    private titleText: UnityEngine.UI.Text;
    private maxRewardCount: number = 3;
    private iconItems: IconItem[] = [];
    private txtPay: UnityEngine.UI.Text;
    private moneyNum: number = 0;
    private btnState: number = MeiRiLiBaoBtnState.Buy;
    private m_id: number = 0;
    private freeLevel: number = 1;
    private itemObj: UnityEngine.GameObject;
    private iconItemNormal: UnityEngine.GameObject;

    setCommonpents(item: UnityEngine.GameObject, normalIcon: UnityEngine.GameObject, index: number) {
        this.index = index;
        if (index == this.freeLevel) {
            this.btnGet = ElemFinder.findObject(item, "btnGet");
            this.btnTip = ElemFinder.findObject(item, "btnTip");
            Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onClickBtnGet);
        }
        else {
            this.titleText = ElemFinder.findText(item, "titleText");
            this.btnGet = ElemFinder.findObject(item, "btnGet");
            this.btnPay = ElemFinder.findObject(item, "btnPay");
            this.btnTip = ElemFinder.findObject(item, "btnTip");

            this.txtPay = ElemFinder.findText(this.btnPay, "Text");
            Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onClickBtnGet);
            Game.UIClickListener.Get(this.btnPay).onClick = delegate(this, this.onClickBtnPay);
        }

        this.iconItemNormal = normalIcon;
        this.itemObj = item;
    }

    setItemActive(active: boolean) {
        this.itemObj.SetActive(active);
    }

    update(data: Protocol.ZGLBCfg_Server, index: number) {
        if (index == this.freeLevel) {
            this.m_id = data.m_iID;
            let info = G.DataMgr.kaifuActData.meiRiLiBaoInfo;
            let isGet: boolean = MathUtil.checkPosIsReach(index, info.m_usGetFlag);
            this.btnGet.SetActive(!isGet);
            this.btnTip.SetActive(isGet);
        }
        else {
            this.titleText.text = uts.format("{0}元礼包", data.m_uiCharge / 10);
            this.moneyNum = data.m_uiCharge;
            this.m_id = data.m_iID;
            let length = data.m_uiNum > this.maxRewardCount ? this.maxRewardCount : data.m_uiNum;
            for (let i = 0; i < length; i++) {
                if (this.iconItems[i] == null) {
                    this.iconItems[i] = new IconItem();
                    let root = ElemFinder.findObject(this.itemObj, uts.format("item{0}", i));
                    this.iconItems[i].setUsualIconByPrefab(this.iconItemNormal, root);
                    this.iconItems[i].setTipFrom(TipFrom.normal);
                }
                this.iconItems[i].updateById(data.m_stThingList[i].m_uiID, data.m_stThingList[i].m_uiCount);
                this.iconItems[i].updateIcon();
            }
            let info = G.DataMgr.kaifuActData.meiRiLiBaoInfo;
            if (info != null) {
                let isGet: boolean = MathUtil.checkPosIsReach(index, info.m_usGetFlag);
                if (isGet) {
                    this.setButtonState(2);
                    return;
                }
                let canGet: boolean = MathUtil.checkPosIsReach(index, info.m_usCanFlag);
                if (canGet || index == this.freeLevel) {
                    this.setButtonState(1);
                    return;
                }
                this.setButtonState(0, uts.format("{0}元购买", data.m_uiCharge / 10));
            }
        }

    }

    private onClickBtnGet() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.ZGLB_GET_GIFT, this.m_id));
    }

    private onClickBtnPay() {
        let cfg = G.DataMgr.payData.getCfgByCount(this.moneyNum);
        if (cfg != null) {
            G.ChannelSDK.pay(cfg.m_iProductID);
        } else {
            uts.log(uts.format("额度{0}在充值表里找不到数据", this.moneyNum));
        }
    }


    /**
     * 色画质按钮状态
     * @param state 0购买 1领取 2已领取
     */
    private setButtonState(state: number, name: string = "") {
        this.btnPay.SetActive(state == 0);
        this.btnGet.SetActive(state == 1);
        this.btnTip.SetActive(state == 2);
        if (state == 0) {
            this.txtPay.text = name;
        }
    }
}


export class MeiRiLiBaoView extends CommonForm {

    private itemList: UnityEngine.GameObject;
    private meiRiLiBaoItems: MeiRiLiBaoListItem[] = [];
    private max_count: number = 4;
    private normalIcon: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.ACT_FUNCTION_ZHIGOULIBAO);
    }

    open() {
        super.open();
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.MeiRiLiBaoView;
    }

    protected initElements() {
        this.itemList = this.elems.getElement("list");
        this.normalIcon = this.elems.getElement("itemIcon_Normal");
        for (let i = 0; i < this.max_count; i++) {
            let item = new MeiRiLiBaoListItem();
            let obj = ElemFinder.findObject(this.itemList, uts.format("item{0}", i));
            item.setCommonpents(obj, this.normalIcon, i + 1);
            this.meiRiLiBaoItems.push(item);
        }
    }

    protected initListeners() {

    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getClientPanelSetRequest(Macros.CLIENTPANEL_TYPE_ZGLB, 1));
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.ZGLB_OPEN_PANEL));
        G.Uimgr.closeMainView();
    }

    protected onClose() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getClientPanelSetRequest(Macros.CLIENTPANEL_TYPE_ZGLB, 0));
        G.Uimgr.openMainView();
    }

    updateView() {
        let info = G.DataMgr.kaifuActData.meiRiLiBaoInfo;
        if (info == null) return;
        for (let i = 0; i < info.m_iCfgCount; i++) {
            if (this.meiRiLiBaoItems[i] != null) {
                //ios屏蔽一元充值 目前没有该档位
                if (G.IsIOSPlatForm && info.m_stCfgList[i].m_uiCharge == 10) {
                    this.meiRiLiBaoItems[i].setItemActive(false);
                } else {
                    this.meiRiLiBaoItems[i].setItemActive(true);
                }
                this.meiRiLiBaoItems[i].update(info.m_stCfgList[i], i + 1);
            }
        }
    }
}



