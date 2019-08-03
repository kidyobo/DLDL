import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { KeyWord } from 'System/constants/KeyWord'
import { List, ListItem } from 'System/uilib/List'
import { Global as G } from 'System/global'
import { PayView } from 'System/pay/PayView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { UIUtils } from 'System/utils/UIUtils'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Color } from 'System/utils/ColorUtil'


class JbpItemData {
    index: number;
    config: Protocol.CSJBPItem[];
    rewardStatus: number = 1;
    itemCount: number = 0;
    m_iCondition1: number = 0;
    m_iID: number = 0;
}


class JbpItem extends ListItemCtrl {

    private m_mcNames: UnityEngine.UI.Text;
    private m_rewardList: List;
    private m_btnReward: UnityEngine.GameObject;
    private btnName: UnityEngine.UI.Text;
    private data: JbpItemData;

    setComponents(go: UnityEngine.GameObject) {
        this.m_mcNames = ElemFinder.findText(go, 'numText');
        this.m_rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, 'rewardList'));
        this.m_btnReward = ElemFinder.findObject(go, 'btn_get');
        this.btnName = ElemFinder.findText(this.m_btnReward, 'Text');
        Game.UIClickListener.Get(this.m_btnReward).onClick = delegate(this, this._onMouseClock);
    }


    update(data: JbpItemData, charge:number,index: number) {
        this.data = data;
        this.m_mcNames.text = charge  +'钻石';
        this.m_rewardList.Count = this.data.itemCount;
        for (let i = 0; i < this.data.itemCount; i++) {
            let iconItem = new IconItem();
            iconItem.setTipFrom(TipFrom.normal);
            iconItem.setUsuallyIcon(this.m_rewardList.GetItem(i).gameObject);
            let thing = this.data.config[i];
            iconItem.updateById(thing.m_iID, thing.m_iCount);
            iconItem.updateIcon();
        }
        if (Macros.GOD_LOAD_AWARD_CANT_GET == this.data.rewardStatus || 0 == this.data.rewardStatus) {
            // 不可领取
            UIUtils.setButtonClickAble(this.m_btnReward, false);
            this.btnName.text = '领取奖励';
        }
        else if (Macros.GOD_LOAD_AWARD_WAIT_GET == this.data.rewardStatus) {
            // 可领取
            UIUtils.setButtonClickAble(this.m_btnReward, true);
            this.btnName.text = '领取奖励';
        }
        else if (Macros.GOD_LOAD_AWARD_DONE_GET == this.data.rewardStatus) {
            // 已领取
            UIUtils.setButtonClickAble(this.m_btnReward, false);
            this.btnName.text = '已领取';
        }
    }


    private _onMouseClock(): void {
        if (Macros.GOD_LOAD_AWARD_WAIT_GET == this.data.rewardStatus) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_JU_BAO_PENG, Macros.ACTIVITY_JBP_GET_REWARD, this.data.m_iID));
        }
    }

}



export class JuBaoPenView extends CommonForm {

    /**充值按钮*/
    private m_btnCharge: UnityEngine.GameObject;
    /**充值进度*/
    private m_mcProgress: UnityEngine.UI.Slider;
    /**活动时间*/
    private m_tfTime: UnityEngine.UI.Text;
    /**充值数量tip*/
    //private m_chargeTipData: TextTipData;
    /**礼包总数量*/
    private m_giftCount: number = 7;
    private m_rewardList: List;
    private tfInfo: UnityEngine.UI.Text;

    private listData: JbpItemData[];

    private max_rewardNum: number = 11;

    private hasRechargeText: UnityEngine.UI.Text;



    constructor() {
        super(KeyWord.ACT_FUNCTION_JBP);
    }

    open() {
        super.open();
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.JuBaoPenView;
    }

    protected initElements() {
        this.m_btnCharge = this.elems.getElement('btn_recharge');
        this.m_mcProgress = this.elems.getSlider('slider');
        this.m_tfTime = this.elems.getText('timeText');
        this.tfInfo = this.elems.getText('tfText');
        this.m_rewardList = this.elems.getUIList('list');
        this.hasRechargeText = this.elems.getText('rechargeText');
    }

    protected initListeners() {
        this.addClickListener(this.m_btnCharge, this._onClickCharge);
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_JU_BAO_PENG, Macros.ACTIVITY_JBP_OPEN_PANEL));
        this.addTimer('checkTimer', 1000, 0, this._onTime);
    }

    protected onClose() {
        this.removeTimer('checkTimer');
    }


    /////////////////////////// 事件处理 //////////////////////////
    private _onClickCharge(): void {
        G.ActionHandler.go2Pay();
    }



    /**更新聚宝盆奖励配置*/
    updateListData(response: Protocol.JBPOneStatus) {
        if (this.listData == null) {
            this.listData = [];
        }
        if (this.listData.length == this.max_rewardNum) {
            return;
        }
        let data = new JbpItemData();
        data.config = response.m_stItemList;
        data.itemCount = response.m_iItemCount;
        data.m_iCondition1 = response.m_iCondition1;
        data.m_iID = response.m_uiCfgID;
        this.listData.push(data);
    }


    ///////////////////////////////////////// 面板显示 //////////////////////////////////////

    updateView(): void {
        let jbpData: Protocol.JBPOpenPanelInfo = G.DataMgr.activityData.jbpStatusValue;
        if (null == jbpData) {
            return;
        }
        //刷新充值进度
        let chargePos: number = 0;
        let maxCharge: number = 0;
        this.m_rewardList.Count = this.max_rewardNum;
        for (let i = 0; i < this.listData.length; i++) {
            if (this.listData[i].m_iCondition1 <= jbpData.m_ulAccCharge) {
                chargePos = Math.min(this.listData.length - 1, i + 1);
            }
            this.listData[i].rewardStatus = jbpData.m_stData[i].m_ucStatus;
            maxCharge = Math.max(maxCharge, this.listData[i].m_iCondition1);
        }
        //刷出item数据
        for (let i = 0; i < this.max_rewardNum; i++) {
            let item = new JbpItem();
            item.setComponents(this.m_rewardList.GetItem(i).gameObject);
            item.update(this.listData[i],this.listData[i].m_iCondition1 ,i);
        }
        //更新充值
        if (jbpData.m_ulAccCharge >= maxCharge) {
            this.tfInfo.text = '';
        }
        else {
            let nextCond: number = 0;
            let overW: number = 0;
            let overCharge: number = 0;
            //已经达到最低条件
            if (chargePos < this.listData.length) {
                nextCond = this.listData[chargePos].m_iCondition1;
                this.tfInfo.text = '继续充值' + TextFieldUtil.getYuanBaoText(nextCond - jbpData.m_ulAccCharge) + '可获得下阶段大礼包';
            }
            else {
                nextCond = maxCharge;
                this.tfInfo.text = '';
            }
            let lastCharge: number = 0;
            if (chargePos > 0) {
                lastCharge = this.listData[chargePos - 1].m_iCondition1;
            }
        }
        this.hasRechargeText.text = '已累计充值:' + TextFieldUtil.getColorText(jbpData.m_ulAccCharge.toString(), Color.YUANBAO) + '钻石';
        this.m_mcProgress.value = jbpData.m_ulAccCharge / maxCharge;
    }


    private _onTime(info: Game.Timer): void {
        let jbpData = G.DataMgr.activityData.jbpStatusValue;
        if (jbpData!=null) {
            let curTime = G.SyncTime.getCurrentTime() / 1000;
            let time = Math.max(0, (jbpData.m_uiLeftTime - curTime) % (24 * 3600));
            this.m_tfTime.text = "活动剩余时间:" + TextFieldUtil.getColorText(DataFormatter.second2hhmmss(time),Color.GREEN);
        }
    }



}
