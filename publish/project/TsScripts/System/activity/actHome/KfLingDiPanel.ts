import { RewardView } from "System/pinstance/selfChallenge/RewardView";
import { RewardIconItemData } from "System/data/vo/RewardIconItemData";
import { DropPlanData } from "System/data/DropPlanData";
import { EnumDurationType, EnumRewardState } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { KfLingDiData } from "System/data/KfLingDiData";
import { UIPathData } from "System/data/UIPathData";
import { ActivityRuleView } from "System/diandeng/ActivityRuleView";
import { Global as G } from "System/global";
import { GuildView } from "System/guild/view/GuildView";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { ConfirmCheck, MessageBoxConst } from "System/tip/TipManager";
import { TabSubForm } from "System/uilib/TabForm";
import { ElemFinder } from "System/uilib/UiUtility";
import { Color } from "System/utils/ColorUtil";
import { RegExpUtil } from "System/utils/RegExpUtil";
import { SpecialCharUtil } from "System/utils/SpecialCharUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { List, ListItem } from 'System/uilib/List'

import { KfLingDiEntranceView } from "./KfLingDiEntranceView";
import { KfLingDiRewardView } from "./KfLingDiRewardView";
import { CityChooseView } from 'System/guild/view/CityChooseView'

/**
 *跨服领地战面板
 */
export class KfLingDiPanel extends TabSubForm {
    private static readonly _CITY_NAME_TXT_PATH: string = 'cityName/cityNameTxt';
    private static readonly _GUILD_NAME_TXT_PATH: string = 'guildNameTxt';
    private static readonly _LEADER_NAME_TXT_PATH: string = 'leaderNameTxt';
    private static readonly _STATUS_NAME_TXT_PATH: string = 'cityStatusTxt';
    private static readonly _BG1_PATH: string = 'bg1';
    private static readonly _ZHANLING_IMG_PATH: string = 'zhanlingImg';


    private _cityBtnList: UnityEngine.GameObject[];
    private _treasureBtnList: UnityEngine.GameObject[];
    private _btnRule: UnityEngine.GameObject;
    private _btnReward: UnityEngine.GameObject;
    private _progressBar: UnityEngine.GameObject;
    private _rewardLinkTxt: UnityEngine.UI.Text;
    private _curScoreTxt: UnityEngine.UI.Text;
    private _myScoreTxt: UnityEngine.UI.Text;
    private _openTimeTxt: UnityEngine.UI.Text;
    private btnChoose: UnityEngine.GameObject;

    private isListActive: boolean = false;
    constructor() {
        super(KeyWord.ACT_FUNCTION_ZZHC);
    }


    protected resPath(): string {
        return UIPathData.KfLingDiPanel;
    }

    protected initElements() {
        //初始化城市按钮
        this._cityBtnList = [];
        for (let i = 0; i < KfLingDiData.CITY_COUNT; i++) {
            let btn = this.elems.getElement('city' + i);
            this._cityBtnList.push(btn);
        }

        this._treasureBtnList = [];
        for (let i = 0; i < KfLingDiData.TREASURE_BOX_COUNT; i++) {
            let btn = this.elems.getElement('treasure' + (i + 1));
            let scoreTxt = ElemFinder.findText(btn, 'textValue');
            scoreTxt.text = KfLingDiData.REWARD_SCORE_GROUP[i].toString();
            this._treasureBtnList.push(btn);
        }

        this._openTimeTxt = this.elems.getText('openTimeTxt');
        this._myScoreTxt = this.elems.getText('myScoreTxt');
        this._curScoreTxt = this.elems.getText('curScoreTxt');
        this._rewardLinkTxt = this.elems.getText('rewardLinkTxt');
        this._rewardLinkTxt.text = TextFieldUtil.getColorText('领取占领奖励', Color.GREEN);

        this._btnReward = this.elems.getElement('btnReward');
        this._btnRule = this.elems.getElement('btnRule');

        this._progressBar = this.elems.getElement('progress');
        this.btnChoose = this.elems.getElement('btnChoose');
    }

    protected initListeners() {
        for (let i = 0; i < KfLingDiData.CITY_COUNT; i++) {
            let btn = this._cityBtnList[i];
            this.addClickListener(btn, delegate(this, this._onClickBtnCity, i + 1));
        }

        this.addClickListener(this._btnReward, this._onClickBtnReward);
        this.addClickListener(this._btnRule, this._onClickBtnRule);
        this.addClickListener(this._rewardLinkTxt.gameObject, this._onClickRewardLinkTxt);

        for (let i = 0; i < KfLingDiData.TREASURE_BOX_COUNT; i++) {
            this.addClickListener(this._treasureBtnList[i], delegate(this, this._onClickBtnTreasure, KfLingDiData.REWARD_TYPE_GROUP[i]));
        }

        this.addClickListener(this.btnChoose, this.onClickBtnChoose);
    }

    private onClickBtnChoose() {
        G.Uimgr.createForm<CityChooseView>(CityChooseView).open();

    }

    private _onClickRewardLinkTxt() {
        if (G.DataMgr.heroData.guildId <= 0) {
            G.TipMgr.addMainFloatTip('您暂未创建宗门！');
            return;
        }

        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_GUILD_SHENSHOU, true)) return;

        G.Uimgr.createForm<GuildView>(GuildView).open(KeyWord.OTHER_FUNCTION_GUILD_SHENSHOU);
    }

    private _onClickBtnRule() {
        let content = G.DataMgr.langData.getLang(KfLingDiData.RULE_ID);
        content = RegExpUtil.xlsDesc2Html(content);
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(content);
    }
    private _onClickBtnReward() {
        G.Uimgr.createForm<KfLingDiRewardView>(KfLingDiRewardView).open();
    }

    private _onClickBtnTreasure(type: number) {
        let status = G.DataMgr.kfLingDiData.RewardStatus[type - 1];
        if (status == EnumRewardState.HasGot) {
            G.TipMgr.addMainFloatTip('您已经领取过该奖励了！');
            return;
        }

        if (!G.DataMgr.thingData.isBagEnough(true)) return;

        let cfg = DropPlanData.getDropPlanConfig(KfLingDiData.REWARD_ID_GROUP[type - 1]);
        let itemDatas: RewardIconItemData[] = [];
        for (let i = 0; i < cfg.m_ucDropThingNumber; i++) {
            let item = new RewardIconItemData();
            let itemInfo = cfg.m_astDropThing[i];
            item.id = itemInfo.m_iDropID;
            item.number = itemInfo.m_uiDropNumber;
            itemDatas.push(item);
        }

        G.Uimgr.createForm<RewardView>(RewardView).open(itemDatas, '可获得：', status, delegate(this, this._sendGetRewardMsg, type));
    }

    private _sendGetRewardMsg(type: number) {
        let rewardStatus = G.DataMgr.kfLingDiData.RewardStatus[type - 1];
        if (rewardStatus == EnumRewardState.NotGot) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfLingDiRewardRequest(type));
            return;
        }

        G.TipMgr.showConfirm('您的积分不足！', ConfirmCheck.noCheck, '确定');
    }

    /**
     * @description 点击城市按钮事件
     * @private
     * @param {number} id
     * @returns
     */
    private _onClickBtnCity(id: number) {
        if ((id == KfLingDiData.MAIN_CITY_ID && !G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_ZZHCMAIN)) ||
            id != KfLingDiData.MAIN_CITY_ID && !G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_ZZHCSUB)) {
            G.TipMgr.addMainFloatTip('该活动尚未开启！');
            return;
        }

        G.Uimgr.createForm<KfLingDiEntranceView>(KfLingDiEntranceView).open(id);
    }

    protected onOpen() {
        this.btnChoose.gameObject.SetActive(G.DataMgr.heroData.isManager);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfLingDiPanelRequest());

        //需要知道宗门成员的加入时间
        if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_ZZHCMAIN) ||
            G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_ZZHCSUB)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.fetchGuildMembers());
        }
    }

    protected onClose() {
    }

    onPanelResp() {
        this._updateCity();
        this._updateMyReward();
        this._updateOpenTimeTxt();
    }

    private _updateOpenTimeTxt() {
        let openTimeStr = uts.format('开服第{0}天开启', SpecialCharUtil.getHanNum(KfLingDiData.ACTIVITY_FIRST_OPEN_DAY));
        if (G.SyncTime.getDateAfterStartServer() > KfLingDiData.ACTIVITY_FIRST_OPEN_DAY) {
            let actDays: number[] = G.DataMgr.activityData.getActivityDays(Macros.ACTIVITY_ID_ZZHCSUB);
            let weekStr: string = SpecialCharUtil.getWeekName(actDays);
            openTimeStr = uts.format("领地战每{0}开启", TextFieldUtil.getColorText(weekStr, Color.GREEN));
        }
        this._openTimeTxt.text = openTimeStr;
    }

    private _updateCity() {
        let cityInfo = G.DataMgr.kfLingDiData.PanelInfo.m_stCityData;

        //主城
        let mainCityGB = this._cityBtnList[0];
        let mainCityInfo = cityInfo.m_stRankList[0];
        let isMainCityOpen = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_ZZHCMAIN);
        let isSubCityOpen = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_ZZHCSUB);

        let mainCityNameTxt = ElemFinder.findText(mainCityGB, KfLingDiPanel._CITY_NAME_TXT_PATH);
        let guildNameTxt = ElemFinder.findText(mainCityGB, KfLingDiPanel._GUILD_NAME_TXT_PATH);
        let leaderNameTxt = ElemFinder.findText(mainCityGB, KfLingDiPanel._LEADER_NAME_TXT_PATH);
        let cityStatusTxt = ElemFinder.findText(mainCityGB, KfLingDiPanel._STATUS_NAME_TXT_PATH);
       

        mainCityNameTxt.text = TextFieldUtil.getColorText(mainCityInfo.m_szCityName, Color.GOLD);
        guildNameTxt.text = TextFieldUtil.getColorText(mainCityInfo.m_szName, Color.GREEN);
        let leaderNameStr = cityInfo.m_stRankList[KfLingDiData.MAIN_CITY_ID - 1].m_stLeaderRole.m_stBaseProfile.m_szNickName;
        leaderNameTxt.text = TextFieldUtil.getColorText(leaderNameStr, Color.GREEN);
        let statusInfo = this._getStatusStr(isMainCityOpen, mainCityInfo.m_szName, true);
        cityStatusTxt.text = TextFieldUtil.getColorText(statusInfo.str, statusInfo.color);

       

        //副城
        for (let i = 0; i < KfLingDiData.CITY_COUNT; i++) {
            if (i == 0) continue;
            let subCity = this._cityBtnList[i];

            let subCityNameTxt = ElemFinder.findText(subCity, KfLingDiPanel._CITY_NAME_TXT_PATH);
            let subCityStatusTxt = ElemFinder.findText(subCity, KfLingDiPanel._STATUS_NAME_TXT_PATH);
            let bg1 = ElemFinder.findImage(subCity, KfLingDiPanel._BG1_PATH);
            let zhanlingImg = ElemFinder.findObject(subCity, KfLingDiPanel._ZHANLING_IMG_PATH);
            let subCityInfo = cityInfo.m_stRankList[i];


            subCityNameTxt.text = TextFieldUtil.getColorText(subCityInfo.m_szCityName, Color.GOLD);
            let statusInfo = this._getStatusStr(isSubCityOpen, subCityInfo.m_szName, false);
            subCityStatusTxt.text = TextFieldUtil.getColorText(statusInfo.str, statusInfo.color);


            let data = G.DataMgr.kfLingDiData
            if (data != null) {
                if (data.PanelInfo.m_iRecommondCityID == i+1) {
                    bg1.gameObject.SetActive(false);
                    zhanlingImg.gameObject.SetActive(true);
                }
                else {
                    bg1.gameObject.SetActive(true);
                    zhanlingImg.gameObject.SetActive(false);
                }
            }

        }
    }

    private _getStatusStr(isActOpen: boolean, ownerName: string, isMainCity: boolean): { str, color } {
        let statusStr = '';
        let color = '';
        let actID = isMainCity ? Macros.ACTIVITY_ID_ZZHCMAIN : Macros.ACTIVITY_ID_ZZHCSUB;
        let timeDurationType = G.DataMgr.activityData.getTimeDurationType(actID, 6);
        let hasSubCityOwener = !isMainCity && ownerName != null && ownerName != '';
        switch (true) {
            case !this._isTodayOpen():
                if (hasSubCityOwener) {
                    color = Color.GREEN;
                    statusStr = '占领宗门：\n' + ownerName;
                    break;
                }

                color = Color.GREY;
                statusStr = '未到活动日';
                break;

            case timeDurationType == EnumDurationType.Before:
                color = Color.WHITE;
                statusStr = G.DataMgr.activityData.getTodayOpenTime(actID, 6) + '开启';
                break;

            case timeDurationType == EnumDurationType.InDuration:
                if (hasSubCityOwener) {
                    color = Color.GREEN;
                    statusStr = '占领宗门：\n' + ownerName;
                    break;
                }

                color = Color.RED;
                statusStr = '可争夺';
                break;

            case timeDurationType == EnumDurationType.After:
                if (hasSubCityOwener) {
                    color = Color.GREEN;
                    statusStr = '占领宗门：\n' + ownerName;
                    break;
                }

                color = Color.GREY;
                statusStr = '活动已结束';
                break;
        }

        return { str: statusStr, color: color };
    }

    private _isTodayOpen(): boolean {
        let startSvrDay = G.SyncTime.getDateAfterStartServer();
        if (startSvrDay == KfLingDiData.ACTIVITY_FIRST_OPEN_DAY) return true;

        let openDays = G.DataMgr.activityData.getActivityDays(Macros.ACTIVITY_ID_ZZHCMAIN);
        let weekDay = G.SyncTime.tmpDate.getDay();
        for (let i = 0; i < openDays.length; i++) {
            if (weekDay == openDays[i]) return true;
        }
        return false;
    }

    private _updateMyReward() {
        let panelInfo = G.DataMgr.kfLingDiData.PanelInfo;

        this._myScoreTxt.text = TextFieldUtil.getColorText('当前积分：' +
            panelInfo.m_iScore, Color.GOLD);

        //进度条
        let scoreGroup = KfLingDiData.REWARD_SCORE_GROUP;
        let i = scoreGroup.length - 1;
        for (i; i >= 0; i--) {
            if (panelInfo.m_iScore >= scoreGroup[i]) break;
        }
        let perNum = 1 / scoreGroup.length * (i + 1);
        Game.Tools.SetGameObjectLocalScale(this._progressBar, perNum, 1, 1);

        //宝箱
        this.updateTreasureBox();
    }

    updateTreasureBox() {
        for (let i = 0; i < KfLingDiData.TREASURE_BOX_COUNT; i++) {
            let btn = this._treasureBtnList[i];
            let notReachGB = ElemFinder.findObject(btn, 'noReach');
            let reachedGB = ElemFinder.findObject(btn, 'reached');
            let hasGetGB = ElemFinder.findObject(btn, 'opened');

            let status = G.DataMgr.kfLingDiData.RewardStatus[i];
            notReachGB.SetActive(status == EnumRewardState.NotReach);
            reachedGB.SetActive(status == EnumRewardState.NotGot);
            hasGetGB.SetActive(status == EnumRewardState.HasGot);
        }
    }
}