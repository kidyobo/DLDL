import { UIUtils } from './../../utils/UIUtils';
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from 'System/data/UIPathData'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { KeyWord } from 'System/constants/KeyWord'
import { List, ListItem } from 'System/uilib/List'
import { Global as G } from 'System/global'
import { PriceBar } from 'System/business/view/PriceBar'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { PetData } from 'System/data/pet/PetData'
import { UnitCtrlType, GameIDType, SceneID } from 'System/constants/GameEnum'
import { ThingData } from 'System/data/thing/ThingData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { ZzzdRankListItemData, DuoBaoPanelPag, ZzzdRewardData } from 'System/activity/YunYingHuoDong/ZhiZunDuoBaoView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'


export class KuaFuZhiZunDuoBaoView extends CommonForm {

    /**是否达成参与奖励*/
    private m_tfAchive: UnityEngine.UI.Text;
    /**第一名奖励列表*/
    private m_rewardListNo1: List;
    /**第二名奖励列表*/
    private m_rewardListNo2: List;
    /**第三名奖励列表*/
    private m_rewardListNo3: List;
    /**达成奖励列表*/
    private m_rewardListAchive: List;

    /**排名顺序*/
    private readonly rankNum: number = 3;
    private ranksTxt: UnityEngine.UI.Text[] = [];

    /**前十排行*/
    private m_rankList: List;
    /**还需充值钻石*/
    private m_priceBar: PriceBar;
    private priceBarObj: UnityEngine.GameObject;
    private m_tfEndTime: UnityEngine.UI.Text;
    private m_tfMyRank: UnityEngine.UI.Text;
    private m_moveima: UnityEngine.UI.Image;
    private m_tfUp: UnityEngine.UI.Text;
    private chargeText: UnityEngine.UI.Text;

    private tabGroup: UnityEngine.UI.ActiveToggleGroup;
    private rankPanel: UnityEngine.GameObject;
    private joinPanel: UnityEngine.GameObject;


    private btn_rule: UnityEngine.GameObject;
    private title_benFu: UnityEngine.GameObject;
    private title_kuaFu: UnityEngine.GameObject;
    private title_kaiFu: UnityEngine.GameObject;

    private listData: ZzzdRewardData[];

    private currencyTip:CurrencyTip;
    private btnget:UnityEngine.GameObject;
    private btngetText:UnityEngine.UI.Text;
    private getTipMark:UnityEngine.GameObject;
    constructor() {
        super(KeyWord.ACT_FUNCTION_CROSS_ZZZD);
    }


    open() {
        super.open();
    }


    layer(): UILayer {
        return UILayer.Normal;
    }


    protected resPath(): string {
        return UIPathData.ZhiZunDuoBaoView;
    }


    protected initElements() {

        this.m_tfAchive = this.elems.getText('joinDesText');
        this.m_rewardListNo1 = this.elems.getUIList('rewardList1');
        this.m_rewardListNo2 = this.elems.getUIList('rewardList2');
        this.m_rewardListNo3 = this.elems.getUIList('rewardList3');
        this.m_rewardListAchive = this.elems.getUIList('rewardList4');
        this.m_rankList = this.elems.getUIList('rankList');
        this.priceBarObj = this.elems.getElement('currencyBar');
        this.m_tfEndTime = this.elems.getText('timeText');
        this.m_tfMyRank = this.elems.getText('myRankText');
        this.m_tfUp = this.elems.getText('nextdesText');
        this.rankPanel = this.elems.getElement('rankPanel');
        this.joinPanel = this.elems.getElement('joinPanel');
        this.tabGroup = this.elems.getToggleGroup('tabGroup');
        this.btn_rule = this.elems.getElement('btnRule');
        this.title_benFu = this.elems.getElement('title_benFu');
        this.title_kuaFu = this.elems.getElement('title_kuaFu');
        this.chargeText = this.elems.getText('chargeText');
        this.title_kaiFu = this.elems.getElement('title_kaifu');
        this.currencyTip = new CurrencyTip();
        this.btnget = this.elems.getElement('btnget');
        this.getTipMark = ElemFinder.findObject(this.tabGroup.GetToggle(1).gameObject,'tipMark')
        this.btngetText = ElemFinder.findText(this.btnget,'Text')
        this.currencyTip.setComponents(this.elems.getElement("CurrencyTip"));
        for (let i = 0; i < this.rankNum; i++) {
            this.ranksTxt.push(this.elems.getText('txtRankNum' + i.toString()));
        }
    }

   
    protected initListeners() {
        this.addClickListener(this.elems.getElement('btn_return'), this.close);
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.btnget, this.onClickGet);
        this.addToggleGroupListener(this.tabGroup, this.onClickTabGroup);
        this.addClickListener(this.btn_rule, this.onClickRuleBt);
    }



    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        this.title_benFu.SetActive(false);
        this.title_kuaFu.SetActive(true);
        this.title_kaiFu.SetActive(false);
        this.m_priceBar = new PriceBar();
        this.m_priceBar.setComponents(this.priceBarObj);
        this.m_priceBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CROSS_ZZZD, Macros.CZJXZD_OPEN_PANNEL));
        this.addTimer('checkTimer', 1000, 0, this._onTick);
        this.tabGroup.Selected = DuoBaoPanelPag.rankPanel;
        this.onClickTabGroup(DuoBaoPanelPag.rankPanel);
        this.onUpdateMoney();
    }


    protected onClose() {
        this.removeTimer('checkTimer');
        G.ViewCacher.mainView.setViewEnable(true);
    }
    onUpdateMoney() {
        if (this.currencyTip != null) {
            this.currencyTip.updateMoney();
        }
    }

    private onClickGet(){
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_CROSS_ZZZD, Macros.CZJXZD_REWARD));
    }
    ////////////////////////点击事件/////////////////////////////////
    private onClickRuleBt() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(197), '规则介绍');
    }

    private onClickTabGroup(index: number) {
        if (index == DuoBaoPanelPag.rankPanel) {
            this.rankPanel.SetActive(true);
            this.joinPanel.SetActive(false);
        } else if (index == DuoBaoPanelPag.joinPanel) {
            this.rankPanel.SetActive(false);
            this.joinPanel.SetActive(true);
        }
    }

    ////////////////////////刷新面板////////////////////////////////////////
    /**设置奖励数据配置*/
    updateListData(response: Protocol.CrossZZZD_Flash) {
        if (this.listData == null) {
            this.listData = [];
        }
        let item = new ZzzdRewardData();
        item.m_iItemCount = response.m_iItemCount;
        item.m_stItemList = response.m_stItemList;
        item.m_iCondition3 = response.m_iCondition3;

        if (response.m_iCondition1 == response.m_iCondition2) {
            item.m_iRank = uts.format('第{0}名', response.m_iCondition1);
        }
        else {
            item.m_iRank = uts.format('第{0}-{1}名', response.m_iCondition1, response.m_iCondition2);
        }

        this.listData.push(item);
    }

    private updateRewardList() {
        this._setRewardList(this.m_rewardListNo1, 0);
        this._setRewardList(this.m_rewardListNo2, 1);
        this._setRewardList(this.m_rewardListNo3, 2);
        this._setRewardList(this.m_rewardListAchive, 3);
    }

    private _setRewardList(list: List, index: number): void {
        let cfg = this.listData[index];
        //刷出奖励数据
        list.Count = cfg.m_iItemCount;
        for (let i = 0; i < cfg.m_iItemCount; i++) {
            let iconItem = new IconItem();
            iconItem.setTipFrom(TipFrom.normal);
            iconItem.setUsuallyIcon(list.GetItem(i).gameObject);
            iconItem.updateById(cfg.m_stItemList[i].m_iID, cfg.m_stItemList[i].m_iCount);
            iconItem.updateIcon();
        }
        if (index == 3) {
            this.m_tfAchive.text = uts.format('充值{0}钻石即可达成', cfg.m_iCondition3);
        }

        //排名范围
        if (index != 3) {
            this.ranksTxt[index].text = cfg.m_iRank;
        }
    }


    updatePanel(): void {

        let czzzzdData: Protocol.CZActOpenPannel = G.DataMgr.activityData.czzzzdData;
        if (czzzzdData == null) {
            return;
        }
        this.updateRewardList();
        if (czzzzdData.m_uiMyRank > 0) {
            this.m_tfMyRank.text = uts.format('我的排行:{0}', TextFieldUtil.getColorText(czzzzdData.m_uiMyRank.toString(), Color.GREEN));
        }
        else {
            this.m_tfMyRank.text = uts.format('我的排行:{0}', TextFieldUtil.getColorText('未上榜', Color.GREEN));
        }
        let rankIndex: number = 0;
        let rankDataList: Protocol.CZActRankInfo[] = czzzzdData.m_stRankList;
        let rankList: ZzzdRankListItemData[];
        if (rankList == null) {
            rankList = new Array<ZzzdRankListItemData>();
        }
        else {
            rankList.length = 0;
        }
        let upgradeCharge: number = 0;
        //第一名
        let itemCount: number = Math.min(czzzzdData.m_ucRankCount, 10);
        for (let i: number = 0; i < itemCount; i++) {
            rankIndex = i + 1;
            if (rankList.length <= i) {
                rankList[i] = new ZzzdRankListItemData();
                rankList[i].name = rankDataList[i].m_szName;
                rankList[i].roleID.m_uiSeq = rankDataList[i].m_uiSeq;
                rankList[i].roleID.m_uiUin = rankDataList[i].m_uiUin;
                rankList[i].rankID = i + 1;
            }
        }
        //刷出rankList数据
        this.m_rankList.Count = rankList.length;
        for (let i = 0; i < rankList.length; i++) {
            let item = this.m_rankList.GetItem(i).gameObject;
            let nameText = ElemFinder.findText(item, 'name');
            let rankNumText = ElemFinder.findText(item, 'num');
            rankNumText.text = (i + 1).toString();
            nameText.text = rankList[i].name;
            let lanBack = ElemFinder.findObject(item, 'backLan');
            let shenBack = ElemFinder.findObject(item, 'backShen');
            let hiddle: boolean = (i % 2 == 0);
            lanBack.SetActive(hiddle);
            shenBack.SetActive(!hiddle);
        }
        this.chargeText.text = '再充值';
        let cfg = this.listData[3];
        let cfg0 = this.listData[0];
        if (cfg.m_iCondition3 > czzzzdData.m_uiCharge && czzzzdData.m_uiMyRank > 0) {
            upgradeCharge = cfg.m_iCondition3 - czzzzdData.m_uiCharge;
            this.m_tfUp.text = '可以参与排名';
        }
        else if (cfg0.m_iCondition3 > czzzzdData.m_uiCharge && czzzzdData.m_uiMyRank == 1) {
            upgradeCharge = cfg0.m_iCondition3 - czzzzdData.m_uiCharge;
            this.m_tfUp.text = '才可以参与第一名排名';
        }
        else {
            upgradeCharge = czzzzdData.m_uiDisPre;
            this.m_tfUp.text = '可以提升排名';
        }
        this.m_priceBar.setPrice(upgradeCharge);
        let canget = G.DataMgr.activityData.isGetJojinReward&&G.DataMgr.firstRechargeData.scValue.m_uiSCValue == 1000
        UIUtils.setButtonClickAble(this.btnget,canget);
        this.getTipMark.SetActive(canget);
        if (G.DataMgr.activityData.isGetJojinReward) {
            this.btngetText.text = '领取奖励';
        }else{
            this.btngetText.text = '已领取';
        }
    }


    /**
    * 倒计时tick
    * @param info
    *
    */
    private _onTick(info: Game.Timer): void {
        let activityStatus: Protocol.ActivityStatus = G.DataMgr.activityData.getActivityStatus(Macros.ACTIVITY_ID_CROSS_ZZZD);
        if (activityStatus != null) {
            if (activityStatus.m_ucStatus == Macros.ACTIVITY_STATUS_RUNNING) {
                let leftTime: number = activityStatus.m_iEndTime - G.SyncTime.getCurrentTime() / 1000;
                if (leftTime <= 0) {
                    this.m_tfEndTime.text = uts.format('排名结束倒计时:{0}', TextFieldUtil.getColorText('已结束', Color.GREEN));
                }
                else {
                    this.m_tfEndTime.text = uts.format('排名结束倒计时:{0}', TextFieldUtil.getColorText(DataFormatter.second2day(leftTime), Color.GREEN));
                }
            }
        }
    }





}