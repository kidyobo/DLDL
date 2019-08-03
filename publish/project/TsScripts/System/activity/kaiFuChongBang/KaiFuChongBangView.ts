import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { KeyWord } from 'System/constants/KeyWord'
import { List, ListItem } from 'System/uilib/List'
import { FixedList } from 'System/uilib/FixedList'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { Global as G } from "System/global"
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { IconItem } from 'System/uilib/IconItem'
import { Macros } from 'System/protocol/Macros'
import { UIUtils } from 'System/utils/UIUtils'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ZhufuData } from 'System/data/ZhufuData'
import { QmcbRankItem } from 'System/activity/kaiFuChongBang/QmcbRankItem'
import { RankListItemData, SelfChallengeRankView } from 'System/pinstance/selfChallenge/SelfChallengeRankView'
import { TipFrom } from 'System/tip/view/TipsView'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { TabSubForm } from 'System/uilib/TabForm'
import { SevenDayView } from 'System/activity/fldt/sevenDayLogin/SevenDayView'
import { KfhdData } from 'System/data/KfhdData'
import { NPCSellData } from 'System/data/NPCSellData'
import { MarketItemData } from 'System/data/vo/MarketItemData'
import { MeiRiXianGouItem } from 'System/jinjieri/JjrMrxgPanel'
import { FanLiDaTingView } from 'System/activity/fanLiDaTing/FanLiDaTingView'
import { PetData } from "System/data/pet/PetData";
import { JiuXingData } from "System/data/JiuXingData";
import { KaiFuHuoDongView } from "System/activity/kaifuhuodong/KaiFuHuoDongView";
import { GameObjectGetSet, TextGetSet } from 'System/uilib/CommonForm';

class QmcbListItemData {
    day: number;
    type: number;
}

export class QmcbRankItemData {
    state: number;
    config: GameConfig.KFQMCBCfgM;
}



/**刷新开服冲榜groupList数据*/
class QmcbGroupListItem extends ListItemCtrl {
    /**item*/
    private item: UnityEngine.GameObject;
    /**数据*/
    private data: QmcbListItemData;
    /**group名字*/
    private groupNormalName: UnityEngine.UI.Text;
    private groupSelectedName: UnityEngine.UI.Text;
    /**所有名字*/
    private groupNames: string[] = ["等级榜", "强化榜", "坐骑榜", "伙伴榜", "神器榜", "圣印榜", "真迹榜", "宝石榜", "神盾榜", "星环榜"];
    /**已经结束角标*/
    private hasOverJb: UnityEngine.GameObject;
    /**领奖角标*/
    private getJb: UnityEngine.GameObject;

    private RANK_TYPE_INDEX: number[];

    setComponents(go: UnityEngine.GameObject) {
        this.item = go;
        this.groupNormalName = ElemFinder.findText(go, "normal/Text");
        this.groupSelectedName = ElemFinder.findText(go, "selected/Text");
        this.hasOverJb = ElemFinder.findObject(go, "hasOverJb");
        this.getJb = ElemFinder.findObject(go, "canGetJb");
        this.RANK_TYPE_INDEX = G.DataMgr.kaifuActData.getKaifuChongbangType();
    }

    updateData(data: QmcbListItemData) {
        this.data = data;
    }

    update() {
        let data = this.data;
        let name = this.groupNames[this.RANK_TYPE_INDEX.indexOf(data.type)];
        this.groupNormalName.text = name;
        this.groupSelectedName.text = name;

        let today = G.SyncTime.getDateAfterStartServer();
        if (data.day <= today) {
            this.item.SetActive(true);
        }
        else {
            this.item.SetActive(false);
        }
        //设置领奖角标
        let activeSelf = G.DataMgr.kaifuActData.getQuanminRankStatus(data.type);
        if (activeSelf == undefined) {
            activeSelf = false;
        }
        this.getJb.SetActive(activeSelf);
        //添加已结束角标
        if (data.type != KeyWord.RANK_TYPE_LEVEL && this.item.activeSelf == true && this.getJb.activeSelf == false && data.day != today) {
            this.hasOverJb.SetActive(true);
        } else {
            this.hasOverJb.SetActive(false);
        }
    }

}



export class KaiFuChongBangView extends TabSubForm {

    // RANK_TYPE_INDEX: number[] =
    //[KeyWord.RANK_TYPE_LEVEL, KeyWord.RANK_TYPE_STRENGTH, KeyWord.RANK_TYPE_ZQ,
    //    KeyWord.RANK_TYPE_HONGYAN, KeyWord.RANK_TYPE_WH,
    //    KeyWord.RANK_TYPE_FZ, KeyWord.RANK_TYPE_LL, KeyWord.RANK_TYPE_DIAMOND, KeyWord.RANK_TYPE_FAQI, KeyWord.RANK_TYPE_MAGIC];

    private RANK_TYPE_INDEX: number[];

    /**左侧group列表*/
    private m_typeGroup: UnityEngine.UI.ActiveToggleGroup;
    //等级冲榜，伙伴进阶，玄天功比试，魂力排名，坐骑冲榜，魂骨战力榜，装备强化榜
    /**group数据*/
    private m_typeData: QmcbListItemData[] = [];

    /**底部排行结果List*/
    // private m_rankList: List;
    /**先用fixedList替换m_rankList*/
    private m_rankList: FixedList;

    private m_rankData: QmcbRankItemData[] = [];
    private m_restTime: number = 0;
    /**查看排行按钮*/
    private btn_rank: UnityEngine.GameObject;
    private m_myRank: RankListItemData;
    /**我的排名*/
    private m_myRankDta: RankListItemData = new RankListItemData();
    /**现在选择的groupIndex*/
    private nowTabgroupSelected: number = 0;
    /////////////////////开服第一名//////////////////////////////
    private firstPersonPanel: UnityEngine.GameObject;
    /**第一名显示奖励List*/
    private m_rewardList: List;
    /**第一名上的领取奖励按钮*/
    private m_btnGet: UnityEngine.GameObject;
    /**领取奖励按钮文字*/
    private btn_getText: UnityEngine.UI.Text;
    private m_firstConfig: GameConfig.KFQMCBCfgM;
    /**第一名头像*/
    private m_firstRoleIcon: UnityEngine.UI.Image;
    private m_firstRoleNameText: UnityEngine.UI.Text;
    ///////////////////活动描述///////////////////////
    /**活动时间*/
    private actTimeText: UnityEngine.UI.Text;
    /**规则描述*/
    private ruleDes: string = '';
    /**活动剩余时间*/
    private actLeftTimeText: UnityEngine.UI.Text;
    ////////////////////排名面板/////////////////////////
    private m_roleListData: RankListItemData[] = [];
    private iconItems: IconItem[] = [];
    private rankItems: QmcbRankItem[] = [];

    private myRankText: UnityEngine.UI.Text;
    private max_tabCount: number = 8;
    private rewardCount: number = 3;
    private max_rankCount: number = 10;
    private rankDataLength: number = 5 - 3;


    private oneLevelTitle: string = '';
    private twoLevelTitle: string = '';
    private rankData: RankListItemData[] = [];
    private strMyRank: string = '';

    private myLevelText: UnityEngine.UI.Text;


    private selectDay: number = 0;
    private limitList: List;
    private meiRiXianGouItems: MeiRiXianGouItem[] = [];
    private itemIcon_Normal: UnityEngine.GameObject;
    private rewardConfig: GameConfig.KFQMCBCfgM;

    private btnBuy: UnityEngine.GameObject;

    private textOpenTip: UnityEngine.UI.Text;
    private back: UnityEngine.GameObject;
    private tabStrMaps: { [type: number]: string } = {};

    private tabDays: UnityEngine.UI.ActiveToggleGroup;
    private dayTipMarks: UnityEngine.GameObject[] = [];
    private textNormal: TextGetSet[] = [];
    private textSelect: TextGetSet[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_7GOAL_KFCB);
    }


    protected resPath(): string {
        return UIPathData.kaiFuChongBangView;
    }

    protected initElements() {

        this.actTimeText = this.elems.getText("actStartTime");
        this.actLeftTimeText = this.elems.getText("actleftTime");
        this.m_typeGroup = this.elems.getToggleGroup("tabGroup");

        // this.m_rankList = this.elems.getUIList("RankList");
        this.m_rankList = this.elems.getUIFixedList("fixedList")

        this.btn_rank = this.elems.getElement("btn_lookPaihang");
        this.m_rewardList = this.elems.getUIList("rewardList");
        this.m_btnGet = this.elems.getElement("btn_get");
        this.btn_getText = ElemFinder.findText(this.m_btnGet, "Text");
        this.m_firstRoleIcon = this.elems.getImage("headIcon");
        this.m_firstRoleNameText = this.elems.getText("roleName");
        this.firstPersonPanel = this.elems.getElement('firstPreson');
        this.myRankText = this.elems.getText('myRankText');
        this.myLevelText = this.elems.getText('myLevelText');
        for (let i = 0; i < this.max_rankCount; i++) {
            let roleListItem = new RankListItemData();
            this.m_roleListData.push(roleListItem);
        }
        for (let i = 0; i < this.rankDataLength; i++) {
            let item = new QmcbRankItemData();
            this.m_rankData.push(item);
        }
        this.m_rewardList.Count = this.rewardCount;
        for (let i = 0; i < this.rewardCount; i++) {
            let iconItem = new IconItem();
            let obj = this.m_rewardList.GetItem(i).gameObject;
            iconItem.setUsuallyIcon(obj);
            iconItem.setTipFrom(TipFrom.normal);
            this.iconItems.push(iconItem);
        }

        //限购的前2个
        this.limitList = this.elems.getUIList("limitList");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.RANK_TYPE_INDEX = G.DataMgr.kaifuActData.getKaifuChongbangType();

        this.btnBuy = this.elems.getElement('btnBuy');
        this.textOpenTip = this.elems.getText('textOpenTip');
        this.back = this.elems.getElement("back");

        //等级冲榜，伙伴进阶，玄天功比试，魂骨战力榜，坐骑冲榜，，装备强化榜
        this.tabStrMaps[KeyWord.RANK_TYPE_LEVEL] = "等级冲榜";
        this.tabStrMaps[KeyWord.RANK_TYPE_HONGYAN] = "伙伴进阶榜";
        this.tabStrMaps[KeyWord.RANK_TYPE_JIUXING] = "玄天功比试";
        this.tabStrMaps[KeyWord.RANK_TYPE_HUNGU] = "魂骨战力榜";
        this.tabStrMaps[KeyWord.RANK_TYPE_ZQ] = "坐骑冲榜";
        this.tabStrMaps[KeyWord.RANK_TYPE_FZ] = "紫极魔瞳榜";
        this.tabStrMaps[KeyWord.RANK_TYPE_STRENGTH] = "强化冲榜";

        this.tabStrMaps[KeyWord.RANK_TYPE_HUNHUAN] = "魂环冲榜";

        this.tabStrMaps[KeyWord.RANK_TYPE_DIAMOND] = "魔石冲榜";

        this.tabDays = this.elems.getToggleGroup("tabDays");
        //天数tab
        for (let i = 0; i < 7; i++) {
            let dayTipMark = ElemFinder.findObject(this.tabDays.gameObject, i + "/tipMark");
            let obj = ElemFinder.findObject(this.tabDays.gameObject, i.toString());
            let txtNormal = ElemFinder.findText(obj, "normal/Text");
            let txtSelect = ElemFinder.findText(obj, "selected/Text");
            this.textNormal.push(new TextGetSet(txtNormal));
            this.textSelect.push(new TextGetSet(txtSelect));
            this.dayTipMarks.push(dayTipMark);
        }
    }

    protected initListeners() {
        this.addClickListener(this.btn_rank, this.onTfRankClick);
        this.addClickListener(this.m_btnGet, this.onBtnGetClick);
        this.addClickListener(this.elems.getElement('btnRule'), this.onClickBtnRule);
        this.addClickListener(this.btnBuy, this.onClickBtnBuy);
        this.addToggleGroupListener(this.tabDays, this.onTabDayClick);
    }

    open(selectDay: number) {
        this.selectDay = selectDay;
        super.open();
    }

    protected onOpen() {

        if (this.selectDay != 0) {
            let afterOpenDay = G.SyncTime.getDateAfterStartServer();
            this.selectDay = afterOpenDay;
            // 最大登陆时间
            if (this.selectDay > 7) {
                this.selectDay = 7;
            }
        }

        for (let i = 0; i < 7; i++) {
            this.textNormal[i].text = this.tabStrMaps[G.DataMgr.kaifuActData.getKaifuChongbangType()[i]];
            this.textSelect[i].text = this.tabStrMaps[G.DataMgr.kaifuActData.getKaifuChongbangType()[i]];
            this.tabDays.GetToggle(i).isOn = false;
        }
        //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFQMCBGetInfoRequest(this.selectDay, this.RANK_TYPE_INDEX[this.selectDay - 1]));
        //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFQMCBGetRankRequest(this.RANK_TYPE_INDEX[this.selectDay - 1]));
        //if (this.selectDay > G.SyncTime.getDateAfterStartServer()) {
        //    if (this.textOpenTip)
        //        this.textOpenTip.text = this.tabStrMaps[G.DataMgr.kaifuActData.getKaifuChongbangType()[this.selectDay - 1]] + "将于开服第" + this.selectDay + "天开启，敬请期待。";
        //    if (this.back && this.back.activeSelf)
        //        this.back.SetActive(false);
        //} else {
        //    if (this.back && !this.back.activeSelf)
        //        this.back.SetActive(true);
        //    if (this.textOpenTip)
        //        this.textOpenTip.text = "";
        //}
        //this.updateXianGouPanel(this.selectDay);
        this.onTabDayClick(this.selectDay - 1);
        this.updateDaysTipMark();
    }


    protected onClose() {
    }

    private onTabDayClick(index: number) {
        this.tabDays.GetToggle(index).isOn = true;
        this.selectDay = index + 1;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFQMCBGetInfoRequest(this.selectDay, this.RANK_TYPE_INDEX[this.selectDay - 1]));
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFQMCBGetRankRequest(this.RANK_TYPE_INDEX[this.selectDay - 1]));
        if (this.selectDay > G.SyncTime.getDateAfterStartServer()) {
            if (this.textOpenTip)
                this.textOpenTip.text = this.tabStrMaps[G.DataMgr.kaifuActData.getKaifuChongbangType()[this.selectDay - 1]] + "将于开服第" + this.selectDay + "天开启，敬请期待。";
            if (this.back && this.back.activeSelf)
                this.back.SetActive(false);
        } else {
            if (this.back && !this.back.activeSelf)
                this.back.SetActive(true);
            if (this.textOpenTip)
                this.textOpenTip.text = "";
        }
        this.updateXianGouPanel(this.selectDay);
    }

    private updateDaysTipMark() {
        for (let i = 0; i < 7; i++) {
            this.dayTipMarks[i].SetActive(G.DataMgr.kaifuActData.canGetKaiFuChongBang(G.DataMgr.kaifuActData.getKaifuChongbangType()[i]));
        }
    }

    private onClickBtnBuy() {
        this.addToggleGroupListener(this.m_typeGroup, this.onTagChange);
        let openSvrDay = G.SyncTime.getDateAfterStartServer();
        let isShow = openSvrDay <= Macros.MAX_CWACT_OPEN_DAYS;
        if (isShow) {
            G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_JJR_MRXG, 0, 0, KeyWord.OTHER_FUNCTION_JJR_MRXG);
        }
    }

    private onClickBtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(this.ruleDes, '规则介绍');
    }


    private updateTabGroupStage() {
        for (let i = 0; i < this.RANK_TYPE_INDEX.length; i++) {
            this.m_typeData[i] = new QmcbListItemData();
            this.m_typeData[i].type = this.RANK_TYPE_INDEX[i];
        }
        let today: number = G.SyncTime.getDateAfterStartServer();
        let data: QmcbListItemData[] = new Array<QmcbListItemData>();
        for (let i: number = 0; i < this.RANK_TYPE_INDEX.length; i++) {
            this.m_typeData[i].day = G.DataMgr.kaifuActData.getQmRankDayByType(this.RANK_TYPE_INDEX[i]);
            if (this.m_typeData[i].day != 0 && this.m_typeData[i].day == today) {
                //根据时间来开放      
                data.push(this.m_typeData[i]);
            }
        }

        //data.sort(this.sortType);
        //this.m_typeData = data;
        //for (let i = 0; i < this.max_tabCount; i++) {
        //    let obj = this.m_typeGroup.GetToggle(i).gameObject;
        //    if (i < data.length) {
        //        obj.SetActive(true);
        //        let item = new QmcbGroupListItem();
        //        item.setComponents(obj);
        //        item.updateData(data[i]);
        //        item.update();
        //    } else {
        //        obj.SetActive(false);
        //    }
        //}
    }


    /**点击领取奖励按钮*/
    private onBtnGetClick(): void {
        if (this.rewardConfig != null) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFQMCBGetRewardRequest(this.rewardConfig.m_iID));
        }
    }


    /**排序*/
    private sortType(a: QmcbListItemData, b: QmcbListItemData): number {
        if (a.type == KeyWord.RANK_TYPE_LEVEL) {
            return -1;
        }
        if (b.type == KeyWord.RANK_TYPE_LEVEL) {
            return 1;
        }
        return b.day - a.day;
    }

    updateView() {
        //刷新列表数据
        this.updateTabGroupStage();
    }


    /**点击tabgroup*/
    private onTagChange(index: number): void {
        this.nowTabgroupSelected = index;
        let data: QmcbListItemData = this.m_typeData[index];
        if (data != null) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFQMCBGetInfoRequest(data.day, data.type));
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFQMCBGetRankRequest(data.type));
        }
    }


    /**点击查看排行按钮*/
    private onTfRankClick(): void {
        G.Uimgr.createForm<SelfChallengeRankView>(SelfChallengeRankView).open(this.oneLevelTitle, this.twoLevelTitle, this.rankData, this.strMyRank);
    }


    private updateGetStutusAndReturnData(response: Protocol.KFQMCBGetInfo_Response): GameConfig.KFQMCBCfgM {
        for (let i = 0; i < 3; i++) {
            // uts.log(" m_ucState  1.达成，2领取 ----> " + response.m_stRewardInfo[i].m_ucState + "   id  ---> " + response.m_stRewardInfo[i].m_iID);
            if (response.m_stRewardInfo[i].m_ucState == Macros.KF_ACT_STATUS_ARIVE) {
                UIUtils.setButtonClickAble(this.m_btnGet, true);
                this.btn_getText.text = '领取奖励';
                return G.DataMgr.kaifuActData.getQuanMinRankCfgsByID(response.m_stRewardInfo[i].m_iID);
            }

            if (response.m_stRewardInfo[i].m_ucState == Macros.KF_ACT_STATUS_REWARD) {
                UIUtils.setButtonClickAble(this.m_btnGet, false);
                this.btn_getText.text = '已领取';
                return G.DataMgr.kaifuActData.getQuanMinRankCfgsByID(response.m_stRewardInfo[i].m_iID);
            }
        }
        UIUtils.setButtonClickAble(this.m_btnGet, false);
        this.btn_getText.text = '领取奖励';
        return null;
    }


    /**先刷出第一名,在刷出底部List*/
    onGetInfoResponse(response: Protocol.KFQMCBGetInfo_Response): void {
        this.removeTimer("1");
        //更新第一名的人物头像
        let prof = response.m_stFirst.m_cProfession;
        let gender = response.m_stFirst.m_cGender;
        if (prof == 0 || gender == 0) {
            prof = 1;
            gender = 2;
        }
        this.firstPersonPanel.SetActive(true);
        this.m_firstRoleIcon.sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}', prof, gender));

        this.m_firstConfig = G.DataMgr.kaifuActData.getQuanMinRankCfgsByID(response.m_stRewardInfo[0].m_iID);
        this.m_firstRoleNameText.text = response.m_stFirst.m_szNickName;

        let openTime: string;
        openTime = uts.format('活动时间：开服第{0}天', this.m_firstConfig.m_ucDay);
        this.ruleDes = RegExpUtil.xlsDesc2Html(this.m_firstConfig.m_szHdTips);
        this.actTimeText.text = openTime;

        for (let i: number = 0; i < 3; i++) {
            if (i < this.m_firstConfig.m_iItemCount) {
                let thing = this.m_firstConfig.m_stItemList[i];
                this.iconItems[i].updateById(thing.m_uiOne, thing.m_uiTwo);
            }
            else {
                this.iconItems[i].updateById(0);
            }
            this.iconItems[i].updateIcon();
        }
        //前3个排行的奖励
        this.rewardConfig = this.updateGetStutusAndReturnData(response);

        //if (response.m_stRewardInfo[0].m_ucState == Macros.KF_ACT_STATUS_ARIVE) {
        //    UIUtils.setButtonClickAble(this.m_btnGet, true);
        //}
        //else {
        //    UIUtils.setButtonClickAble(this.m_btnGet, false);
        //}
        //if (response.m_stRewardInfo[0].m_ucState == Macros.KF_ACT_STATUS_REWARD) {
        //    this.btn_getText.text = '已领取';
        //}
        //else {
        //    this.btn_getText.text = '领取奖励';
        //}

        //只取2个，剩余3个一道每日目标中
        for (let i = 0; i < 2; i++) {
            this.m_rankData[i].config = G.DataMgr.kaifuActData.getQuanMinRankCfgsByID(response.m_stRewardInfo[i + 1].m_iID);
            this.m_rankData[i].state = response.m_stRewardInfo[i + 1].m_ucState;
        }

        //排序
        let data = this.sortOnArr(this.m_rankData);
        //刷出底部排行显示(第二名后)
        //  this.m_rankList.Count = 0;
        // this.m_rankList.Count = data.length;
        for (let i = 0; i < data.length; i++) {
            let obj = this.m_rankList.GetItem(i + 1).gameObject;
            let rankItem = this.getRankItem(i, obj);
            rankItem.updateData(data[i]);
            rankItem.update();
        }

        let today: number = G.SyncTime.getDateAfterStartServer();
        UIUtils.setButtonClickAble(this.btnBuy, today <= Macros.MAX_CWACT_OPEN_DAYS);

        if (this.m_firstConfig.m_ucDay < today && this.m_firstConfig.m_ucRankType != KeyWord.RANK_TYPE_LEVEL) {
            this.actLeftTimeText.text = '进行中：' + TextFieldUtil.getColorText('已结束', Color.RED);
            this.m_restTime = 0;
        }
        else {
            this.m_restTime = G.SyncTime.getServerZeroLeftTime();
            //等级榜活动持续2天
            if (this.m_firstConfig.m_ucRankType == KeyWord.RANK_TYPE_LEVEL) {
                this.m_restTime += (2 - today) * 86400;
            }
            //this.m_firstConfig.
            this.m_restTime = Math.max(this.m_restTime, 0);
            this.actLeftTimeText.text = '进行中：' + TextFieldUtil.getColorText('剩余时间' + DataFormatter.second2day(this.m_restTime), Color.GREEN);
            this.addTimer("1", 1000, 0, this.onTimer);
        }

    }

    private getRankItem(index: number, obj: UnityEngine.GameObject): QmcbRankItem {
        if (index < this.rankItems.length) {
            return this.rankItems[index];
        } else {
            let rankItem = new QmcbRankItem();
            rankItem.setComponents(obj);
            this.rankItems.push(rankItem);
            return rankItem;
        }
    }

    //数组排序
    private sortOnArr(array: QmcbRankItemData[]): QmcbRankItemData[] {
        let tempArr: QmcbRankItemData[] = new Array<QmcbRankItemData>(0);
        for (let i of array) {
            if (i.state != 1) {
                tempArr.push(i);
            }
        }
        tempArr.sort(this.sortOnState);
        for (let j of array) {
            if (j.state == 1) {
                tempArr.unshift(j);
            }
        }
        return tempArr;
    }

    private sortOnState(a: QmcbRankItemData, b: QmcbRankItemData): number {
        //完成状态一样的按照ID排序
        if (a.state == b.state) {
            return a.config.m_iID - b.config.m_iID;
        }
        else {
            return a.state - b.state;
        }
    }

    private onTimer(): void {
        this.m_restTime--;
        if (this.m_restTime <= 0) {
            this.actLeftTimeText.text = '进行中：' + TextFieldUtil.getColorText('已结束', Color.RED);
            this.removeTimer("1");
        }
        else {
            this.actLeftTimeText.text = '进行中：' + TextFieldUtil.getColorText('剩余时间' + DataFormatter.second2day(this.m_restTime), Color.GREEN);
        }
    }


    /**领取奖励response*/
    onGetRewardResponse(response: Protocol.KFQMCBGetReward_Response): void {
        if (response.m_uiResultID == 0) {

            UIUtils.setButtonClickAble(this.m_btnGet, false);
            this.btn_getText.text = "已领取";

            let canget: boolean = false;
            if (this.m_firstConfig.m_iID == response.m_iID) {
                UIUtils.setButtonClickAble(this.m_btnGet, false);
                this.btn_getText.text = "已领取";
            }
            else {
                for (let i: number = 0; i < 2; i++) {
                    if (this.m_rankData[i].config.m_iID == response.m_iID) {
                        this.m_rankData[i].state = Macros.KF_ACT_STATUS_REWARD;
                    }
                    if (this.m_rankData[i].state == Macros.KF_ACT_STATUS_ARIVE) {
                        canget = true;
                    }
                }
                this.onTagChange(this.nowTabgroupSelected);
            }
            if (!canget) {
                G.DataMgr.kaifuActData.updateQuanminRankInfo(this.m_rankData[0].config.m_ucRankType, false);
                //刷新外部开服冲榜小红点
                G.ActBtnCtrl.update(false);
                this.updateView();
            }
        }
        this.updateDaysTipMark();
    }



    /**拉取排行版具体排名list信息*///伙伴上榜条件 总阶数21阶
    onGetRoleResponse(response: Protocol.KFQMCBGetRoleInfo_Response): void {
        //uts.log("kingsly 7日冲榜 排行数据：" + this.tabStrMaps[response.m_ucRankType] + "--> 响应结果：" + (response.m_uiResultID == 0 ? "成功" : "失败"));
        if (response.m_uiResultID == 0) {
            let data: RankListItemData[] = new Array<RankListItemData>();
            //uts.log("kingsly 7日冲榜 排行数据：" + this.tabStrMaps[response.m_ucRankType] +"-->"+ JSON.stringify(response));
            for (let i: number = 0; i < 10; i++) {
                if (i < response.m_ucCount) {
                    this.m_roleListData[i].rank = i + 1;
                    this.m_roleListData[i].roleName = response.m_astRankList[i].m_stBaseProfile.m_szNickName;
                    if (response.m_ucRankType == KeyWord.RANK_TYPE_YY) {
                        this.m_roleListData[i].value = ZhufuData.getZhufuStage(response.m_astRankList[i].m_llOrder1, KeyWord.HERO_SUB_TYPE_YUYI);
                    }
                    else if (response.m_ucRankType == KeyWord.RANK_TYPE_ZQ) {
                        this.m_roleListData[i].value = ZhufuData.getZhufuStage(response.m_astRankList[i].m_llOrder1, KeyWord.HERO_SUB_TYPE_ZUOQI);
                    }
                    else if (response.m_ucRankType == KeyWord.RANK_TYPE_WH) {
                        this.m_roleListData[i].value = ZhufuData.getZhufuStage(response.m_astRankList[i].m_llOrder1, KeyWord.HERO_SUB_TYPE_WUHUN);
                    }
                    else if (response.m_ucRankType == KeyWord.RANK_TYPE_FZ) {
                        this.m_roleListData[i].value = ZhufuData.getZhufuStage(response.m_astRankList[i].m_llOrder1, KeyWord.HERO_SUB_TYPE_FAZHEN);
                    }
                    else if (response.m_ucRankType == KeyWord.RANK_TYPE_LL) {
                        this.m_roleListData[i].value = ZhufuData.getZhufuStage(response.m_astRankList[i].m_llOrder1, KeyWord.HERO_SUB_TYPE_LEILING);
                    }
                    else if (response.m_ucRankType == KeyWord.RANK_TYPE_MAGIC) {
                        this.m_roleListData[i].value = ZhufuData.getZhufuStage(response.m_astRankList[i].m_llOrder1, KeyWord.OTHER_FUNCTION_MAGICCUBE);
                    }
                    else if (response.m_ucRankType == KeyWord.RANK_TYPE_JIUXING) {
                        let maxLevel = G.DataMgr.jiuXingData.maxLevel;
                        let stage = response.m_astRankList[i].m_llOrder1;
                        if (stage > 0) {
                            if (stage >= maxLevel) {

                                stage = Math.floor(maxLevel / 10);
                            }
                            else {
                                stage = Math.floor((stage - 1) / 10) + 1;
                            }
                        }
                        this.m_roleListData[i].value = stage;
                    } else if (response.m_ucRankType == KeyWord.RANK_TYPE_HONGYAN) {
                        this.m_roleListData[i].value = response.m_astRankList[i].m_llOrder1;
                    } else if (response.m_ucRankType == KeyWord.RANK_TYPE_HUNHUAN) {
                        this.m_roleListData[i].value = response.m_astRankList[i].m_llOrder1 % 100;
                    }
                    else {

                        this.m_roleListData[i].value = response.m_astRankList[i].m_llOrder1;
                    }

                    data.push(this.m_roleListData[i]);
                }
                else {
                    this.m_roleListData[i].roleName = '';
                }
            }
            this.rankData = data;
            //刷出排行榜面板信息
            //排行版面板title
            //   this.oneLevelTitle = this.rankTitles[this.RANK_TYPE_INDEX.indexOf(response.m_ucRankType)] + "排行榜";
            this.oneLevelTitle = KeyWord.getDesc(KeyWord.GROUP_RANKINFO_RANKTYPE, response.m_ucRankType);
            this.twoLevelTitle = G.DataMgr.rankData.getConfigsByType(response.m_ucRankType).m_szKey4;
            //我的排名
            this.m_myRankDta.rank = response.m_ucMyRank;

            if (response.m_ucRankType == KeyWord.RANK_TYPE_YY) {
                //翅膀
                this.m_myRankDta.value = ZhufuData.getZhufuStage(response.m_llMyRankValue, KeyWord.HERO_SUB_TYPE_YUYI);
                let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(KeyWord.HERO_SUB_TYPE_YUYI);
                let stage: number = ZhufuData.getZhufuStage(data.m_ucLevel, KeyWord.HERO_SUB_TYPE_YUYI);
                this.myLevelText.text = '我的翅膀阶级:' + stage;
            }
            else if (response.m_ucRankType == KeyWord.RANK_TYPE_ZQ) {
                //坐骑
                this.m_myRankDta.value = response.m_ucMyRank;
                //this.m_myRankDta.value =ZhufuData.getZhufuStage(response.m_llMyRankValue, KeyWord.HERO_SUB_TYPE_ZUOQI);
                let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(KeyWord.HERO_SUB_TYPE_ZUOQI);
                let stage: number = ZhufuData.getZhufuStage(data.m_ucLevel, KeyWord.HERO_SUB_TYPE_ZUOQI);
                this.myLevelText.text = '我的坐骑阶级:' + stage;
            }
            else if (response.m_ucRankType == KeyWord.RANK_TYPE_WH) {
                //神器
                this.m_myRankDta.value = ZhufuData.getZhufuStage(response.m_llMyRankValue, KeyWord.HERO_SUB_TYPE_WUHUN);
                let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(KeyWord.HERO_SUB_TYPE_WUHUN);
                let stage: number = ZhufuData.getZhufuStage(data.m_ucLevel, KeyWord.HERO_SUB_TYPE_WUHUN);
                this.myLevelText.text = '我的神器阶级:' + stage;
            }
            else if (response.m_ucRankType == KeyWord.RANK_TYPE_FZ) {
                //圣印
                //this.m_myRankDta.value = ZhufuData.getZhufuStage(response.m_llMyRankValue, KeyWord.HERO_SUB_TYPE_FAZHEN);
                this.m_myRankDta.value = response.m_ucMyRank;
                let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(KeyWord.HERO_SUB_TYPE_FAZHEN);
                let stage: number = ZhufuData.getZhufuStage(data.m_ucLevel, KeyWord.HERO_SUB_TYPE_FAZHEN);
                this.myLevelText.text = '我的紫极魔瞳阶级:' + stage;
            }
            else if (response.m_ucRankType == KeyWord.RANK_TYPE_LL) {
                //真迹
                this.m_myRankDta.value = ZhufuData.getZhufuStage(response.m_llMyRankValue, KeyWord.HERO_SUB_TYPE_LEILING);
                let data: Protocol.CSHeroSubSuper = G.DataMgr.zhufuData.getData(KeyWord.HERO_SUB_TYPE_LEILING);
                let stage: number = ZhufuData.getZhufuStage(data.m_ucLevel, KeyWord.HERO_SUB_TYPE_LEILING);
                this.myLevelText.text = '我的真迹阶级:' + stage;
            }
            else if (response.m_ucRankType == KeyWord.RANK_TYPE_LEVEL) {
                //等级
                this.m_myRankDta.value = response.m_ucMyRank;
                this.myLevelText.text = '我的等级:' + G.DataMgr.heroData.level;
            }
            else if (response.m_ucRankType == KeyWord.RANK_TYPE_HONGYAN) {
                //伙伴             
                this.m_myRankDta.value = response.m_ucMyRank;

                let stage = 0;
                if (response.m_llMyRankValue > 0) {
                    stage = response.m_llMyRankValue;
                } else {
                    //没上榜 要前台自己计算
                    let activedPets = G.DataMgr.petData.getActivedPets();
                    let len = activedPets.length;

                    for (let i = 0; i < len; i++) {
                        let m_uiStage = activedPets[i].m_uiStage;

                        if (m_uiStage > 0) {
                            if (m_uiStage >= PetData.MaxStageLevel) {

                                m_uiStage = Math.floor(PetData.MaxStageLevel / 10);
                            }
                            else {
                                m_uiStage = Math.floor((m_uiStage - 1) / 10) + 1;
                            }
                        }
                        stage += m_uiStage;
                    }
                }
                this.myLevelText.text = '我的伙伴总阶数:' + stage;
            }
            else if (response.m_ucRankType == KeyWord.RANK_TYPE_JIUXING) {
                //玄天功
                let maxLevel = G.DataMgr.jiuXingData.maxLevel;
                let stage = G.DataMgr.jiuXingData.level;
                if (stage > 0) {
                    if (stage >= maxLevel) {

                        stage = Math.floor(maxLevel / 10);
                    }
                    else {
                        stage = Math.floor((stage - 1) / 10) + 1;
                    }
                }
                this.m_myRankDta.value = response.m_ucMyRank;
                this.myLevelText.text = '我的玄天功阶级:' + stage;
            } else if (response.m_ucRankType == KeyWord.RANK_TYPE_HUNGU) {
                //魂骨战力
                this.m_myRankDta.value = response.m_ucMyRank;
                if (response.m_llMyRankValue == 0) {
                    this.myLevelText.text = '魂骨战力过低！！！';
                } else {
                    this.myLevelText.text = '我的魂骨战力:' + response.m_llMyRankValue;
                }
            } else if (response.m_ucRankType == KeyWord.RANK_TYPE_HUNHUAN) {
                //魂环激活数量
                this.m_myRankDta.value = response.m_ucMyRank;
                if (response.m_llMyRankValue == 0) {
                    this.myLevelText.text = '我的魂环激活数量：' + G.DataMgr.hunliData.activeHunhuanNum();
                } else {
                    this.myLevelText.text = '我的魂环激活数量:' + response.m_llMyRankValue % 100;
                }
            }
            else if (response.m_ucRankType == KeyWord.RANK_TYPE_STRENGTH) {
                //强化
                this.m_myRankDta.value = response.m_ucMyRank;
                this.myLevelText.text = '我的强化等级:' + response.m_llMyRankValue;
            } else if (response.m_ucRankType == KeyWord.RANK_TYPE_FAQI) {
                //神盾
                this.m_myRankDta.value = response.m_llMyRankValue;
                this.myLevelText.text = '我的神盾阶级:' + response.m_llMyRankValue;
            } else if (response.m_ucRankType == KeyWord.RANK_TYPE_DIAMOND) {
                //魔石
                this.m_myRankDta.value = response.m_llMyRankValue;
                this.myLevelText.text = '我的魔石等级:' + response.m_llMyRankValue;//G.DataMgr.equipStrengthenData.getAllInsertDiamondLevel();
            } else if (response.m_ucMyRank == KeyWord.RANK_TYPE_MAGIC) {
                //星环
                this.m_myRankDta.value = response.m_llMyRankValue;
                this.myLevelText.text = '我的星环阶级:' + response.m_llMyRankValue;
            }
            if (this.m_myRankDta.value == 0 /**|| this.m_myRankDta.value > response.m_ucCount*/) {
                this.strMyRank = "我的排名:未上榜";
                this.myRankText.text = '未上榜';
            } else {
                this.strMyRank = "我的排名:" + this.m_myRankDta.rank;
                this.myRankText.text = this.m_myRankDta.rank.toString();
            }
        }
    }


    onSellLimitDataChange() {
        this.updateXianGouPanel(this.selectDay);
    }

    /**
     * 跟新限购
     * @param day 开服的天数
     */
    private updateXianGouPanel(day: number): void {
        let kfhdData: KfhdData = G.DataMgr.kfhdData;
        if (kfhdData.JJRPanelInfo == null)
            return;
        let npcSellData: NPCSellData = G.DataMgr.npcSellData;

        let pageData: MarketItemData[] = npcSellData.getMallLimitList(day);
        let cnt = 0;
        if (pageData != null) {
            cnt = pageData.length;
        }
        //取前2个物品
        this.limitList.Count = 2;
        for (let i = 0; i < 2; i++) {
            let item = this.limitList.GetItem(i);
            if (this.meiRiXianGouItems[i] == null) {
                this.meiRiXianGouItems[i] = new MeiRiXianGouItem();
                this.meiRiXianGouItems[i].setComponents(item.gameObject, this.itemIcon_Normal);
            }
            this.meiRiXianGouItems[i].update(pageData[i], day == G.SyncTime.getDateAfterStartServer());
        }

    }


}