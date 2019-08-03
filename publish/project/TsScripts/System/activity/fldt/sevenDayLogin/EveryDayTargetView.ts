import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { List, ListItem } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { UIUtils } from 'System/utils/UIUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { ThingData } from 'System/data/thing/ThingData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { AchievementData } from 'System/data/AchievementData'
import { SevenDayView } from 'System/activity/fldt/sevenDayLogin/SevenDayView'
import { EnumEffectRule } from 'System/constants/GameEnum'
import { KaiFuHuoDongView } from "System/activity/kaifuhuodong/KaiFuHuoDongView";
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

class EveryDayRewardState {
    data: GameConfig.KFMRMBCfgM;
    state: number = -1;
}


class EveryDayTargetRewardItem {

    private txtCondition: UnityEngine.UI.Text;
    private btnGet: UnityEngine.GameObject;
    private btnGo: UnityEngine.GameObject;
    private rewardList: List;
    private iconItems: IconItem[] = [];
    private txtGo: UnityEngine.UI.Text;
    private data: EveryDayRewardState;
    /**是否跳转*/
    private isGoto: boolean = false;

    setComponents(go: UnityEngine.GameObject) {
        this.btnGet = ElemFinder.findObject(go, "btnGet");
        this.btnGo = ElemFinder.findObject(go, "btnGo");
        this.txtCondition = ElemFinder.findText(go, "desbg/txtCondition");
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, "reward/rewardList"));
        this.txtGo = ElemFinder.findText(go, "btnGet/Text");
        Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onClickGet);
        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickGo);
    }

    update(data: EveryDayRewardState, day: number) {
        this.data = data;
        //this.iconItems = [];
        this.rewardList.Count = data.data.m_stItemList.length;
        for (let i = 0; i < this.rewardList.Count; i++) {
            if (this.iconItems[i] == null) {
                let item = this.rewardList.GetItem(i).gameObject;
                this.iconItems[i] = new IconItem();
                this.iconItems[i].setUsuallyIcon(item);
                this.iconItems[i].showLvTextAndBg = false;
                this.iconItems[i].effectRule = EnumEffectRule.none;
                this.iconItems[i].setTipFrom(TipFrom.normal);
            }
            if (data.data.m_stItemList[i].m_uiTwo > 1) {
                this.iconItems[i].showNumText = true;
            } else {
                this.iconItems[i].showNumText = false;
            }
            this.iconItems[i].updateById(data.data.m_stItemList[i].m_uiOne, data.data.m_stItemList[i].m_uiTwo);
            this.iconItems[i].updateIcon();
        }
        let achiConfig: GameConfig.AchiConfigM = AchievementData.getConfigVo(data.data.m_uiNeedAch);
        this.txtCondition.text = achiConfig.m_szDesc;
        // let cSOneAchiData: Protocol.CSOneAchiData = G.DataMgr.achievementData.getCSOneAchiData(data.data.m_uiNeedAch);
        //每日目标的状态
        //  let status: Protocol.CSKFMRMBOneStatus = G.DataMgr.kaifuActData.getDailyGoalStatus(data.data.m_iID);

        //uts.log(" 描述  " + achiConfig.m_szDesc + "   m_iID  " + this.data.data.m_iID +
        //    "  m_uiNeedAch  " + this.data.data.m_uiNeedAch + "  m_ucDay  " + this.data.data.m_ucDay +
        //    "  （ status.m_ucStatus  0 未达成 1 达成  2已领取） ->  " + this.data.state);

       // uts.log("----------------------");

        if (data.data.m_ucDay <= day) {
            this.btnGet.SetActive(true);
            this.btnGo.SetActive(true);
            if (data.state >= 0) {
                this.btnGo.SetActive(true);
                if (data.state == Macros.KF_ACT_STATUS_NONE) {
                    this.updataBtnStatus(true);
                } else if (data.state == Macros.KF_ACT_STATUS_ARIVE) {
                    this.txtGo.text = "可领取";
                    UIUtils.setButtonClickAble(this.btnGet, true);
                    this.updataBtnStatus(false);
                } else {
                    this.txtGo.text = "已领取";
                    UIUtils.setButtonClickAble(this.btnGet, false);
                    this.updataBtnStatus(false);
                }
            }
            else {
                this.btnGo.SetActive(false);
            }
        }
        else {
            this.btnGet.SetActive(false);
            this.btnGo.SetActive(false);
           
        }

       
    }

    private onClickGet() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFMRMBGetRewardRequest(this.data.data.m_iID));
    }


    private onClickGo() {
        if (G.ActionHandler.executeFunction(this.data.data.m_iFunction)) {
            G.Uimgr.closeForm(SevenDayView);
        }
    }


    private updataBtnStatus(isGo: boolean) {
        this.btnGo.SetActive(isGo);
        this.btnGet.SetActive(!isGo);
    }

}



export class EveryDayTargetView extends TabSubForm {

    /**7天的排行类型*/
    private readonly RANK_TYPE_INDEX1: number[] = [KeyWord.RANK_TYPE_HONGYAN, KeyWord.RANK_TYPE_ZQ, KeyWord.RANK_TYPE_WH,
    KeyWord.RANK_TYPE_LL, KeyWord.RANK_TYPE_FZ, KeyWord.RANK_TYPE_STRENGTH, KeyWord.RANK_TYPE_FAQI];

    private selectDay: number=0;

    private itemIcon_Normal: UnityEngine.GameObject;
    private list: List;
    private everyDayTargetRewardItems: EveryDayTargetRewardItem[] = [];
    private everyDayRewardStates: EveryDayRewardState[] = [];
    private today: number = 0;

    private tabDays: UnityEngine.UI.ActiveToggleGroup;
    private dayTipMarks: UnityEngine.GameObject[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_7GOAL_DAILY);
    }

    protected resPath(): string {
        return UIPathData.EveryDayTargetView;
    }


    protected initElements() {
        this.tabDays = this.elems.getToggleGroup("tabDays");
        //天数tab
        for (let i = 0; i < 7; i++) {
            let dayTipMark = ElemFinder.findObject(this.tabDays.gameObject, i + "/tipMark");
            let obj = ElemFinder.findObject(this.tabDays.gameObject, i.toString());
            this.dayTipMarks.push(dayTipMark);
        }
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.list = this.elems.getUIList("list");
    }

    protected initListeners() {
        this.addToggleGroupListener(this.tabDays, this.onTabDayClick);
    }

    open(selectDay: number) {
        //if (selectDay == undefined) {
        //    selectDay = G.Uimgr.getForm<SevenDayView>(SevenDayView).getSelectDay();
        //}
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
            this.tabDays.GetToggle(i).isOn = false;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFMRMBGetInfoRequest());
        this.today = G.SyncTime.getDateAfterStartServer();
        this.updateDaysTipMark();
        this.onTabDayClick(this.selectDay-1);
    }



    protected onClose() {

    }

    private onTabDayClick(index: number) {
        this.tabDays.GetToggle(index).isOn = true;
        this.selectDay = index + 1;
        //this.getListDayData();
        this.updateEveryDayPanel();
    }

    updateEveryDayTargetPanel() {
        this.updateEveryDayPanel();
        this.updateDaysTipMark();
    }

    private updateDaysTipMark() {
        for (let i = 0; i < 7; i++) {
            this.dayTipMarks[i].SetActive(TipMarkUtil.dailyGoal(i + 1));
        }
    }

    private updateEveryDayPanel() {
        let selectIndex = 0;

        let data = G.DataMgr.kaifuActData.getDailyGoalCfgsByDay(this.selectDay);
        this.everyDayTargetRewardItems = [];
        this.everyDayRewardStates = [];
        this.list.Count = data.length;
        for (let i = 0; i < this.list.Count; i++) {
            if (this.everyDayTargetRewardItems[i] == null) {
                let item = this.list.GetItem(i).gameObject;
                this.everyDayTargetRewardItems[i] = new EveryDayTargetRewardItem();
                this.everyDayTargetRewardItems[i].setComponents(item);
                this.everyDayRewardStates[i] = new EveryDayRewardState();
            }
            //每日目标的状态
            let status: Protocol.CSKFMRMBOneStatus = G.DataMgr.kaifuActData.getDailyGoalStatus(data[i].m_iID);
            this.everyDayRewardStates[i].data = data[i];
            if (status != null) {
                this.everyDayRewardStates[i].state = status.m_ucStatus;
            }
        }

        this.everyDayRewardStates.sort(delegate(this, this.sortStatus));
        for (let i = 0; i < this.list.Count; i++) {

            this.everyDayTargetRewardItems[i].update(this.everyDayRewardStates[i], this.today);
        }
    }

    private sortStatus(a: EveryDayRewardState, b: EveryDayRewardState) {
        let rewardA: Protocol.CSKFMRMBOneStatus = G.DataMgr.kaifuActData.getDailyGoalStatus(a.data.m_iID);
        let statusA = 0;
        if (rewardA != null) {
            if (rewardA.m_ucStatus == Macros.KF_ACT_STATUS_NONE) {
                statusA = 1;
            } else if (rewardA.m_ucStatus == Macros.KF_ACT_STATUS_ARIVE) {
                statusA = 2;
            }
        }

        let rewardB: Protocol.CSKFMRMBOneStatus = G.DataMgr.kaifuActData.getDailyGoalStatus(b.data.m_iID);
        let statusB = 0;
        if (rewardB != null) {
            if (rewardB.m_ucStatus == Macros.KF_ACT_STATUS_NONE) {
                statusB = 1;
            } else if (rewardB.m_ucStatus == Macros.KF_ACT_STATUS_ARIVE) {
                statusB = 2;
            }
        }

        if (statusB != statusA) {
            return statusB - statusA;
        }
        return a.data.m_iID - b.data.m_iID;
    }

}