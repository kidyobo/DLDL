import { PriceBar } from "System/business/view/PriceBar";
import { EnumMarriage } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { ConfirmCheck, MessageBoxConst } from "System/tip/TipManager";
import { TipFrom } from "System/tip/view/TipsView";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { IconItem } from "System/uilib/IconItem";
import { ElemFinder } from "System/uilib/UiUtility";

class QiuHunData {
    price: number;
    thingId: number;
    thingNum: number;
    moneyId: number;
}

export class QiuHunListItem {

    private iconRoot: UnityEngine.GameObject;
    private iconItem: IconItem;
    private currenyBarObj: UnityEngine.GameObject;
    private currenyBar: PriceBar;
    private toggle: UnityEngine.UI.ActiveToggle;

    setCommonpents(obj: UnityEngine.GameObject) {
        this.iconRoot = ElemFinder.findObject(obj, 'iconRootBack/iconRoot');
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(QiuHunView.iconItem_Normal, this.iconRoot);
        this.iconItem.setTipFrom(TipFrom.normal);
        this.currenyBarObj = ElemFinder.findObject(obj, 'currencyBar');
        this.currenyBar = new PriceBar();
        this.currenyBar.setComponents(this.currenyBarObj);
        this.toggle = ElemFinder.findActiveToggle(obj, 'buyToggle');
        QiuHunView.toggles.push(this.toggle);
    }

    update(data: QiuHunData) {
        this.currenyBar.setCurrencyID(data.moneyId, true);
        this.currenyBar.setPrice(data.price);
        this.iconItem.updateById(data.thingId, data.thingNum);
        this.iconItem.updateIcon();
    }
}


export class QiuHunView extends CommonForm {

    private m_type = Macros.HY_APPLY_MARRY;
    private m_price: number = 0;
    static iconItem_Normal: UnityEngine.GameObject;
    /**求婚按钮*/
    private m_btnQiuHun: UnityEngine.GameObject;
    /**选择的戒指档次*/
    private m_level: number = 0;
    /**目标id*/
    private m_target: Protocol.RoleID;
    private tfNameText: UnityEngine.UI.Text;

    ////////////////////////////新面板相关//////////////////////////////
    static toggles: UnityEngine.UI.ActiveToggle[] = [];
    private qiuHunDatas: QiuHunData[] = [];
    private lists: UnityEngine.GameObject;
    private listItems: QiuHunListItem[] = [];
    private pricesIds: number[] = [KeyWord.PARAM_MARRY_PRICE_1, KeyWord.PARAM_MARRY_PRICE_2, KeyWord.PARAM_MARRY_PRICE_3];
    private thingIds: number[] = [EnumMarriage.RING_1, EnumMarriage.RING_2, EnumMarriage.RING_3];
    private moneyIds: number[] = [KeyWord.MONEY_YUANBAO_BIND_ID, KeyWord.MONEY_YUANBAO_ID, KeyWord.MONEY_YUANBAO_ID];
    private max_rewardTypes: number = 3;
    //第一档话费绑钻
    private firstStageSpendMoney = G.DataMgr.constData.getValueById(KeyWord.PARAM_MARRY_PRICE_1);
    private hasSelectedFirstStage: boolean = false;

    constructor() {
        super(KeyWord.BAR_FUNCTION_XIANYUAN);
        this.openSound = null;
        this.closeSound = null;
    }

    open() {
        super.open();
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.QiuHunView;
    }

    protected initElements() {
        QiuHunView.iconItem_Normal = this.elems.getElement('itemIcon_Normal');
        this.m_btnQiuHun = this.elems.getElement('btn_qiuhun');
        this.tfNameText = this.elems.getText('roleNameText');
        this.lists = this.elems.getElement('list');
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.elems.getElement('btn_close'), this.close);
        this.addClickListener(this.m_btnQiuHun, this._onBtnYesClick);
    }

    protected onOpen() {
        this.initDatas();
        this.updateView();
    }

    protected onClose() {
        QiuHunView.toggles.length = 0;
    }

    //////////////////////////点击事件////////////////////////////////

    /**点击求婚或者接受*/
    private _onBtnYesClick(): void {
        //答应就不用花钱了
        this.setSelectLevel();
        if (this.m_price == 0) {
            G.TipMgr.addMainFloatTip('请至少选择一件求婚礼品');
            return;
        }
        let spendBangYuan: number = 0;
        let spendYuanBao: number = this.m_price;
        if (this.hasSelectedFirstStage) {
            spendBangYuan = this.firstStageSpendMoney;
            spendYuanBao = this.m_price - spendBangYuan;
        }
        if (G.DataMgr.heroData.gold >= spendYuanBao && G.DataMgr.heroData.gold_bind >= spendBangYuan) {
            G.TipMgr.addMainFloatTip('已发送结婚请求,请耐心等候');
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMarryRequest(this.m_type, this.m_target, this.m_level));
            this.close();
        } else {
            G.TipMgr.showConfirm('您的余额不足,请前往充值', ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onClickConfirm));
        }
    }

    private onClickConfirm(state: MessageBoxConst): void {
        if (state == MessageBoxConst.yes) {
            this.close();
            G.ActionHandler.go2Pay();
        }
    }


    private setSelectLevel() {
        let lockFlag: number = 0;
        let temp: number = 1;
        this.m_level = 0;
        this.m_price = 0;
        this.hasSelectedFirstStage = false;
        for (let i = 0; i <= this.max_rewardTypes; i++) {
            if (i != 0) {
                let toggle = QiuHunView.toggles[i - 1];
                let price = G.DataMgr.constData.getValueById(this.pricesIds[i - 1]);
                if (toggle.isOn) {
                    lockFlag += temp;
                    if (price == this.firstStageSpendMoney) {
                        this.hasSelectedFirstStage = true;
                    }
                    this.m_price += price;
                }
            }
            temp *= 2;
        }
        this.m_level = lockFlag;
    }

    ////////////////////////////////////////////////////////////////

    private initDatas() {
        for (let i = 0; i < this.max_rewardTypes; i++) {
            let data = new QiuHunData();
            let price = G.DataMgr.constData.getValueById(this.pricesIds[i]);
            data.price = price;
            data.thingId = this.thingIds[i];
            data.thingNum = 1;
            data.moneyId = this.moneyIds[i];
            this.qiuHunDatas.push(data);
        }
    }

    updateView() {
        for (let i = 0; i < this.qiuHunDatas.length; i++) {
            let listItem = this.getListItem(i);
            listItem.update(this.qiuHunDatas[i]);
        }
        let teamData = G.DataMgr.teamData;
        if (teamData.memberList.length > 0) {
            this.m_target = teamData.memberList[0].m_stRoleID;
            this.tfNameText.text = teamData.memberList[0].m_szNickName;
        }
    }

    private getListItem(index: number): QiuHunListItem {
        if (index < this.listItems.length) {
            return this.listItems[index];
        } else {
            let item = new QiuHunListItem();
            let obj = ElemFinder.findObject(this.lists, index.toString());
            item.setCommonpents(obj);
            this.listItems.push(item);
            return item;
        }
    }

}
