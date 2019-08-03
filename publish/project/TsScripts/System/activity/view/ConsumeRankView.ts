import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { IconItem } from 'System/uilib/IconItem'
import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { PriceBar } from 'System/business/view/PriceBar'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { UIUtils } from './../../utils/UIUtils';
import { DataFormatter } from 'System/utils/DataFormatter'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'


export class ConsumeRankView extends CommonForm {

    private rankAwardList: List;
    private rankInfoList: List;
    private joinAwardList: List;

    private rankAwardItem: Array<ConsumeRankAwardItem> = [];
    private rankInfoItem: Array<ConsumeRankInfoItem> = [];

    private bntGiftBox: UnityEngine.GameObject;
    private goGetAward: UnityEngine.GameObject;
    private getTipMark: UnityEngine.GameObject;
    private goOpenWard: UnityEngine.GameObject;
  
    private m_priceBar: PriceBar;
    private priceBarObj: UnityEngine.GameObject;
    private txtPay: UnityEngine.UI.Text;
    private txtTime: UnityEngine.UI.Text;  
    private txtSelfNo: UnityEngine.UI.Text;
    private btnRule: UnityEngine.GameObject;

    private goJoinView: UnityEngine.GameObject;
    private btnGetJoin: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.ACT_FUNCTION_CROSS_ZZZD);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.ConsumeRankView;
    }

    protected initElements() {
        this.rankAwardList = this.elems.getUIList('rankList');
        this.rankInfoList = this.elems.getUIList('userList');
        this.joinAwardList = this.elems.getUIList('joinAwardList');

        this.priceBarObj = this.elems.getElement('currencyBar');
        this.m_priceBar = new PriceBar();
        this.m_priceBar.setComponents(this.priceBarObj);
        this.m_priceBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID);

        this.bntGiftBox = this.elems.getElement('bntGiftBox');  
        this.goGetAward = this.elems.getElement('getAward');
        this.goOpenWard = this.elems.getElement('openWard');
        this.getTipMark = this.elems.getElement('tipMark');
        this.btnRule = this.elems.getElement('btnRule');  
            
        this.txtTime = this.elems.getText('txtTime');
        this.txtSelfNo = this.elems.getText('txtSelfNo');
        this.txtPay = this.elems.getText('txtPay');

        this.goJoinView = this.elems.getElement('joinView');
        this.btnGetJoin = this.elems.getElement('btnGetJoin');
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement('returnBtn'), this.close);
        this.addClickListener(this.elems.getElement('mask'), this.close);

        this.addClickListener(this.bntGiftBox, delegate(this, this.setJoinView, true));
        this.addClickListener(this.elems.getElement('joinMask'), delegate(this, this.setJoinView, false));
        this.addClickListener(this.btnGetJoin, this.onGetJoinClick);
        this.addClickListener(this.btnRule, this.onBtnRuleCilck);
    }

    open() {

        super.open();
    }

    protected onOpen() {
        this.goJoinView.SetActive(false);

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_126CROSSCHARGE, Macros.Act126_PANEL));
    }

    updateView() {
        let data = G.DataMgr.consumeRankData.CSAct126Panel;

        //更新奖励排名信息
        let firstInfo = data.m_ucRankCount > 0 ? data.m_stRankList[0] : null;
        this.updateRankAwar(data.m_stCfgList, firstInfo);
        //更新玩家排名信息   
        this.updateRankInfo();
        //自己排名
        this.txtSelfNo.text = data.m_uiMyRank > 0 ? data.m_uiMyRank.toString() : '未上榜';
        //充值更新
        this.updatePay(data);
        //结束倒计时
        this.addTimer('checkTimer', 1000, 0, this._onTick);
        //更新参与奖励
        this.updateJoinView();
    }

    private updateRankAwar(data: Array<Protocol.Act126Cfg_Server>, firstInfo: Protocol.ConsumeActRankInfo) {
        let cfgNum = data.length - 1;

        this.rankAwardList.Count = cfgNum;
        let oldItemCnt = this.rankAwardItem.length;

        for (let i = 0; i < cfgNum; i++) {
            let item: ConsumeRankAwardItem;
            if (i < oldItemCnt) {
                item = this.rankAwardItem[i];
            } else {
                this.rankAwardItem.push(item = new ConsumeRankAwardItem())
                item.setComponents(this.rankAwardList.GetItem(i).gameObject);
            }
            item.update(data[i], i, firstInfo);
        }
    }

    private updateRankInfo() {
        let data = G.DataMgr.consumeRankData.CSAct126Panel;

        this.rankInfoList.Count = data.m_ucRankCount;
        let oldItemCnt = this.rankInfoItem.length;

        for (let i = 0; i < data.m_ucRankCount; i++) {
            let item: ConsumeRankInfoItem;
            if (i < oldItemCnt) {
                item = this.rankInfoItem[i];
            } else {
                this.rankInfoItem.push(item = new ConsumeRankInfoItem())
                item.setComponents(this.rankInfoList.GetItem(i).gameObject);
            }
            item.update(data.m_stRankList[i], i);
        }
    }

    private updatePay(data: Protocol.CSAct126Panel) {
        let cfg = data.m_stCfgList[data.m_iCfgCount - 1];
        let cfg0 = data.m_stCfgList[0];

        let upgradeCharge: number = 0;
        if (cfg.m_iCondition3 > data.m_uiConsume && data.m_uiMyRank > 0) {
            upgradeCharge = cfg.m_iCondition3 - data.m_uiConsume;
            this.txtPay.text = '可以参与排名!';
        }
        else if (cfg0.m_iCondition3 > data.m_uiConsume && data.m_uiMyRank == 1) {
            upgradeCharge = cfg0.m_iCondition3 - data.m_uiConsume;
            this.txtPay.text = '才可以参与第一名排名!';
        }
        else {
            upgradeCharge = data.m_uiDisPre;
            this.txtPay.text = '可以提升排名!';
        }
        this.m_priceBar.setPrice(upgradeCharge);
    }

    updateJoinView() {
        let consumeData = G.DataMgr.consumeRankData;

        let data = consumeData.CSAct126Panel.m_stCfgList[consumeData.CSAct126Panel.m_iCfgCount - 1];
        let statusGet = consumeData.canGetJoinReward();

        this.goGetAward.SetActive(statusGet != 2);
        this.goOpenWard.SetActive(statusGet == 2);
        this.getTipMark.SetActive(statusGet == 1);

        this.joinAwardList.Count = data.m_iItemCount;
        for (let i = 0; i < data.m_iItemCount; i++) {
            let iconItem = new IconItem();
            iconItem.setTipFrom(TipFrom.normal);
            iconItem.setUsuallyIcon(this.joinAwardList.GetItem(i).gameObject);
            iconItem.updateById(data.m_stItemList[i].m_iID, data.m_stItemList[i].m_iCount);
            iconItem.updateIcon();
        }
        UIUtils.setButtonClickAble(this.btnGetJoin, G.DataMgr.consumeRankData.canGetJoinReward() == 1);
    }

    private setJoinView(bOpen: boolean) {
        this.goJoinView.SetActive(bOpen);
    }

    private onGetJoinClick() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_126CROSSCHARGE, Macros.Act126_GET_REWARD));
    }

    private onBtnRuleCilck() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(491), '规则介绍');
    }


    private _onTick(info: Game.Timer): void {
        let activityStatus: Protocol.ActivityStatus = G.DataMgr.activityData.getActivityStatus(Macros.ACTIVITY_ID_126CROSSCHARGE);
        if (activityStatus != null) {
            if (activityStatus.m_ucStatus == Macros.ACTIVITY_STATUS_RUNNING) {
                let leftTime: number = activityStatus.m_iEndTime - G.SyncTime.getCurrentTime() / 1000;
                if (leftTime <= 0) {
                    this.txtTime.text = TextFieldUtil.getColorText('已结束', Color.GREEN);
                }
                else {
                    this.txtTime.text = TextFieldUtil.getColorText(DataFormatter.second2day(leftTime), Color.GREEN);
                }
            }
        }
    }

    protected onClose() {
    }


}

class ConsumeRankAwardItem {
    private readonly Rank_Max: number = 3;
    private rankNo: number;

    private goRankNoList: UnityEngine.GameObject[] = [];
    private awardList: List;
    private txtNick: UnityEngine.UI.Text;
    

    setComponents(go: UnityEngine.GameObject) {
        for (let i = 0; i < this.Rank_Max; i++) {
            this.goRankNoList.push(ElemFinder.findObject(go, 'rankNo/rankNo_' + i.toString()));
        }
        this.awardList = ElemFinder.getUIList(ElemFinder.findObject(go, "awardList"));
        this.txtNick = ElemFinder.findText(go, 'txtNick');
        
    }

    update(data: Protocol.Act126Cfg_Server, rankNo: number, firstInfo: Protocol.ConsumeActRankInfo) {      
        //排名
        for (let i = 0; i < this.goRankNoList.length; i++) {
            this.goRankNoList[i].SetActive(i == rankNo);
        }
        //昵称(第一名才显示)
        if (rankNo == 0 && firstInfo != null) {
            this.txtNick.text = firstInfo.m_szName;
        }
        else {
            this.txtNick.text = '';
        }
        //排名奖励
        this.awardList.Count = data.m_iItemCount;
        for (let i = 0; i < data.m_iItemCount; i++) {
            let iconItem = new IconItem();
            iconItem.setTipFrom(TipFrom.normal);
            iconItem.setUsuallyIcon(this.awardList.GetItem(i).gameObject);
            iconItem.updateById(data.m_stItemList[i].m_iID, data.m_stItemList[i].m_iCount);
            iconItem.updateIcon();
        }
    }
}

class ConsumeRankInfoItem {
    private rankNo: number;

    private goBg: UnityEngine.GameObject;
    private txtRankNo: UnityEngine.UI.Text;
    private txtNick: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject) {
        this.goBg = ElemFinder.findObject(go, 'bg');
        this.txtRankNo = ElemFinder.findText(go, 'txtRankNo');
        this.txtNick = ElemFinder.findText(go, 'txtNick');
    }

    update(data: Protocol.ConsumeActRankInfo, rankNo: number) {
        this.goBg.SetActive(rankNo % 2 == 1);
        this.txtRankNo.text = (rankNo + 1).toString();
        this.txtNick.text = data.m_szName;
    }
}