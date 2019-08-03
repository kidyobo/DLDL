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
import { TabSubForm } from 'System/uilib/TabForm'


export class MergeZhiZunDuoBaoPanel extends TabSubForm {

    private tabGroup: UnityEngine.UI.ActiveToggleGroup;

    private rankPanel: UnityEngine.GameObject;
    private joinPanel: UnityEngine.GameObject;

    /**第一名奖励列表*/
    private m_rewardListNo1: List;
    /**第二名奖励列表*/
    private m_rewardListNo2: List;
    /**第三名奖励列表*/
    private m_rewardListNo3: List;
    /**达成奖励列表*/
    private m_rewardListAchive: List;
    /**前十排行*/
    private m_rankList: List;

    /**是否达成参与奖励*/
    private m_tfAchive: UnityEngine.UI.Text;

    /**还需充值钻石*/
    private m_priceBar: PriceBar;
    private priceBarObj: UnityEngine.GameObject;
    private m_tfEndTime: UnityEngine.UI.Text;
    private m_tfMyRank: UnityEngine.UI.Text;
    private m_moveima: UnityEngine.UI.Image;
    private m_tfUp: UnityEngine.UI.Text;
    private chargeText: UnityEngine.UI.Text;

    private btn_rule: UnityEngine.GameObject;
    private listData: ZzzdRewardData[];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HFHD_ZHIZUNDUOBAO);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }


    protected resPath(): string {
        return UIPathData.MergeZhiZunDuoBaoView;
    }


    protected initElements() {

        this.tabGroup = this.elems.getToggleGroup('tabGroup');

        this.rankPanel = this.elems.getElement('rankPanel');
        this.joinPanel = this.elems.getElement('joinPanel');

        this.m_rewardListNo1 = this.elems.getUIList('rewardList1');
        this.m_rewardListNo2 = this.elems.getUIList('rewardList2');
        this.m_rewardListNo3 = this.elems.getUIList('rewardList3');
        this.m_rewardListAchive = this.elems.getUIList('rewardList4');
        this.m_rankList = this.elems.getUIList('rankList');

        this.priceBarObj = this.elems.getElement('currencyBar');

        this.m_tfAchive = this.elems.getText('joinDesText');
        this.m_tfMyRank = this.elems.getText('myRankText');
        this.m_tfUp = this.elems.getText('nextdesText');
        this.chargeText = this.elems.getText('chargeText');

        this.m_tfEndTime = this.elems.getText('timeText');
        this.btn_rule = this.elems.getElement('btnRule');
       
       
    }


    protected initListeners() {
        this.addToggleGroupListener(this.tabGroup, this.onClickTabGroup);
        this.addClickListener(this.btn_rule, this.onClickRuleBt);
    }



    protected onOpen() {
       
        this.m_priceBar = new PriceBar();
        this.m_priceBar.setComponents(this.priceBarObj);
        this.m_priceBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID);
       
        this.addTimer('checkTimer', 1000, 0, this._onTick);
        this.tabGroup.Selected = DuoBaoPanelPag.rankPanel;
        this.onClickTabGroup(DuoBaoPanelPag.rankPanel);

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_HFZZZD_OPEN_PANEL));
    }


    protected onClose() {
        this.removeTimer('checkTimer');
    }


    /////////////////////////////////////点击事件////////////////////////////////////////
    private onClickRuleBt() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(365), '规则介绍');
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

    /////////////////////////////////////刷新面板////////////////////////////////////////
    /**设置奖励数据配置*/
    updateListData(response: Protocol.CrossZZZD_Flash) {
        if (this.listData == null) {
            this.listData = [];
        }
        let item = new ZzzdRewardData();
        item.m_iItemCount = response.m_iItemCount;
        item.m_stItemList = response.m_stItemList;
        item.m_iCondition3 = response.m_iCondition3;
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
    }



    updatePanel(): void {
        let zzzdData: Protocol.ZZZDOpenPanelRsp = G.DataMgr.hfhdData.hfzzdbData;
        if (zzzdData == null) {
            return;
        }
        this.updateRewardList();
        if (zzzdData.m_ucMyRank > 0) {
            this.m_tfMyRank.text = uts.format('我的今日排行:{0}', TextFieldUtil.getColorText(zzzdData.m_ucMyRank.toString(), Color.GREEN));
        }
        else {
            this.m_tfMyRank.text = uts.format('我的今日排行:{0}', TextFieldUtil.getColorText('未上榜', Color.GREEN));
        }

        let rankIndex: number = 0;
        let rankDataList: Protocol.OneZZZDRankInfo[] = zzzdData.m_astChargeList;
        let rankList: ZzzdRankListItemData[];
        if (rankList == null) {
            rankList = new Array<ZzzdRankListItemData>();
        }
        else {
            rankList.length = 0;
        }
        let upgradeCharge: number = 0;
        //第一名
        let itemCount: number = Math.min(zzzdData.m_ucCount, 10);
        for (let i: number = 0; i < itemCount; i++) {
            rankIndex = i + 1;
            if (zzzdData.m_ucMyRank > 1 && zzzdData.m_ucMyRank == rankIndex + 1) {
                upgradeCharge = rankDataList[i].m_uiCharge + 1 - zzzdData.m_uiMyCharge;
            }
            if (rankList.length <= i)
                rankList[i] = new ZzzdRankListItemData();
            rankList[i].name = rankDataList[i].m_stBaseProfile.m_szNickName;
            rankList[i].roleID = rankDataList[i].m_stRoleID;
            rankList[i].rankID = i + 1;
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
        let day: number = G.SyncTime.getDateAfterStartServer();
        let cfgs3 = this.listData[3];
        let cfgs0 = this.listData[0];
        if (cfgs3.m_iCondition3 > zzzdData.m_uiMyCharge) {
            upgradeCharge = cfgs3.m_iCondition3 - zzzdData.m_uiMyCharge;
            this.m_tfUp.text = '可以参与排名';
        }
        else if (cfgs0.m_iCondition3 > zzzdData.m_uiMyCharge && zzzdData.m_ucMyRank == 1) {
            upgradeCharge = cfgs0.m_iCondition3 - zzzdData.m_uiMyCharge;
            this.m_tfUp.text = '才可以参与第一名排名';
        }
        else {
            this.m_tfUp.text = '可以提升排名';
        }
        this.m_priceBar.setPrice(upgradeCharge);
    }


    /**
    * 倒计时tick
    * @param info
    *
    */
    private _onTick(info: Game.Timer): void {
        let endTime: number = G.SyncTime.getServerZeroLeftTime();
        if (endTime <= 0) {
            this.m_tfEndTime.text = uts.format("排名结束倒计时:{0}", TextFieldUtil.getColorText("已结束", Color.GREEN));
        }
        else {
            this.m_tfEndTime.text = uts.format("排名结束倒计时:{0}", TextFieldUtil.getColorText(DataFormatter.second2day(endTime), Color.GREEN));
        }
    }



}