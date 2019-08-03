import { TabSubForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { List, ListItem } from 'System/uilib/List'
import { GroupList, GroupListItem } from 'System/uilib/GroupList'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { Global as G } from 'System/global'
import { MonsterData } from 'System/data/MonsterData'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { UnitUtil } from "System/utils/UnitUtil"
import { TipFrom } from 'System/tip/view/TipsView'
import { IconItem } from 'System/uilib/IconItem'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { MessageBoxConst } from "System/tip/TipManager"
import { ConfirmCheck } from "System/tip/TipManager"
import { BossView } from "System/pinstance/boss/BossView"
import { PayView } from 'System/pay/PayView'
import { UIUtils } from 'System/utils/UIUtils'
import { BossBaseItem } from 'System/pinstance/boss/BossBasePanel'
import { EnumKfhdBossType, EnumKfhdBossStatus } from 'System/constants/GameEnum'
import { DropPlanData } from 'System/data/DropPlanData'
import { Constants } from 'System/constants/Constants'
import { VipTab, VipView } from "System/vip/VipView"
import { TextFieldUtil } from 'System/utils/TextFieldUtil'

export class BossHomeData {
    headIconId: number;
    bossName: string;
    refreshTime: number;
    isDead: boolean;
    rewardsId: number[];
    modelId: string;
    bossLv: number;
    modelFloder: number;
    floor: number;
    lowestVipLv: number;
    isOpen: boolean;
    bossId: number;
    dropThingId: number;
    fight: number;
}

class BossHomeListItem {

    private timer: Game.Timer = null;
    private data: BossHomeData;
    private textStatus: UnityEngine.UI.Text;
    private bossHead: UnityEngine.UI.RawImage;
    private rewardList: UnityEngine.GameObject;
    private iconItems: IconItem[] = [];
    private rewItems: UnityEngine.GameObject[] = [];
    //private lvText: UnityEngine.UI.Text;
    private txtFight: UnityEngine.UI.Text;
    //private nameImage: UnityEngine.UI.Image;
    private name: UnityEngine.UI.Text;
    private max_ShowThingNum: number = 3;
    private max_rewCount: number = 3;

    //private toggleFollow: UnityEngine.UI.ActiveToggle;

    setCommonPents(obj: UnityEngine.GameObject) {
        this.bossHead = ElemFinder.findRawImage(obj, 'ctn/bossHead');
        this.textStatus = ElemFinder.findText(obj, 'textStatus');
        this.rewardList = ElemFinder.findObject(obj, 'rewardList');
        //this.lvText = ElemFinder.findText(obj, 'ctn/level');
        this.txtFight = ElemFinder.findText(obj, 'ctn/txtFight');
        //this.nameImage = ElemFinder.findImage(obj, 'ctn/nameImage');
        this.name = ElemFinder.findText(obj, 'ctn/name');
        for (let i = 0; i < this.max_rewCount; i++) {
            this.rewItems[i] = ElemFinder.findObject(obj, 'rewardList/item' + i.toString());
        }

        //this.toggleFollow = ElemFinder.findActiveToggle(obj, "toggleFollow");
        //this.toggleFollow.onValueChanged = delegate(this, this.onToggleValueChanged);
    }

    updateBossHome(data: BossHomeData, dropId: number) {
        this.data = data;
        G.ResourceMgr.loadImage(this.bossHead, uts.format('images/vipBossHead/{0}.png', this.data.headIconId));
        //this.lvText.text = this.data.bossLv.toString();
        this.txtFight.text = uts.format("推荐战力：{0}", TextFieldUtil.getColorText(this.data.fight.toString(), G.DataMgr.heroData.fight >= this.data.fight ? Color.GREEN : Color.RED));
        //this.nameImage.sprite = BossHomePanel.BossNameAltas.Get(this.data.bossName);
        this.name.text = uts.format("{0}级 {1}", this.data.bossLv, this.data.bossName);
        //this.nameImage.SetNativeSize();
        //this.updateFollowed();
        let dropCfg = DropPlanData.getDropPlanConfig(dropId);
        if (dropCfg != null) {
            let thingData = dropCfg.m_astDropThing;
            let listCount: number = thingData.length > this.max_ShowThingNum ? this.max_ShowThingNum : thingData.length;
            //this.rewardList.Count = listCount;
            for (let i = 0; i < listCount; i++) {
                let iconItem: IconItem;
                if (i < this.iconItems.length) {
                    iconItem = this.iconItems[i];
                } else {
                    iconItem = new IconItem();
                    iconItem.setTipFrom(TipFrom.normal);
                    iconItem.setUsualIconByPrefab(BossHomePanel.iconItemNormal, ElemFinder.findObject(this.rewItems[i], 'iconRoot'));
                    this.iconItems.push(iconItem);
                }
                iconItem.updateByDropThingCfg(thingData[i]);
                iconItem.updateIcon();
            }
        } else {
            uts.log(uts.format('id{0}在掉落方案表找不到配置', this.data.dropThingId));
        }
        if (!this.data.isOpen) {
            this.textStatus.text = TextFieldUtil.getColorText("未开启", Color.RED);
            return;
        }
        if (this.timer != null) {
            for (let i = 0; i < BossHomePanel.timers.length; i++) {
                if (this.timer == BossHomePanel.timers[i]) {
                    this.timer.Stop();
                    BossHomePanel.timers.splice(i, 1);
                    break;
                }
            }
        }
        this.timer = new Game.Timer(this.data.bossId.toString(), 0, 0, delegate(this, this.onTickTimer));
        BossHomePanel.timers.push(this.timer);
    }

    //private onToggleValueChanged(isOn: boolean) {
    //    if (this.data.bossId > 0) {
    //        if (G.DataMgr.deputySetting.canFollowBoss(this.data.bossId)) {
    //            G.DataMgr.deputySetting.followBoss(this.data.bossId, isOn);
    //            this.updateFollowed();
    //        }
    //    }
    //}

    //private updateFollowed() {
    //    if (G.SyncTime.getDateAfterStartServer() >= Constants.BossFollowMinDay) {
    //        let bFollowed = G.DataMgr.deputySetting.isBossFollowed(this.data.bossId);
    //        this.toggleFollow.isOn = bFollowed;
    //        this.toggleFollow.gameObject.SetActive(true);
    //    }
    //    else {
    //        this.toggleFollow.gameObject.SetActive(false);
    //    }
    //}

    private onTickTimer() {
        //let isDead = this.data.isDead;
        let refreshTime = this.data.refreshTime;
        let leftSecond = refreshTime - Math.round(G.SyncTime.getCurrentTime() / 1000);
        if (leftSecond > 0) {
            if (leftSecond < 0) {
                leftSecond = 0;
            }
            this.textStatus.text = DataFormatter.second2hhmmss(leftSecond);
            this.textStatus.color = Color.toUnityColor('FF4444');
        } else {
            this.textStatus.text = '已刷新';
            this.textStatus.color = Color.toUnityColor('A3FF20');
            if (this.timer != null) {
                this.timer.Stop();
            }
        }
    }
}


export class BossHomePanel extends TabSubForm {

    private bossGroup: UnityEngine.UI.ActiveToggleGroup;
    private btnGo: UnityEngine.GameObject;
    private rewardList: List;
    //private rewardList2: List;
    private bossList: List;
    private modelCtn: UnityEngine.GameObject;
    private btnGoText: UnityEngine.UI.Text;
    static iconItemNormal: UnityEngine.GameObject;
    static BossNameAltas: Game.UGUIAltas;
    private tipText: UnityEngine.UI.Text;
    private tipMarks: UnityEngine.GameObject[] = [];
    private SurplusTime: UnityEngine.UI.Text;
    private addTimeBtn: UnityEngine.GameObject;


    private rewardListItems: IconItem[] = [];
    private rewardListItems2: IconItem[] = [];
    static timers: Game.Timer[] = [];


    private openBossId: number = 0;
    private tagCount: number = 5;
    //private costIds: number[] = [KeyWord.PARAM_HOME_BOSS_PRICE_1, KeyWord.PARAM_HOME_BOSS_PRICE_2,
    //KeyWord.PARAM_HOME_BOSS_PRICE_3, KeyWord.PARAM_HOME_BOSS_PRICE_4];
    private maxFloor: number = 5;
    private listDatas: { [ceng: number]: BossHomeData[] } = {};
    private selectedBossData: BossHomeData = null;
    private groupListData: BossHomeData[] = [];
    private costMoney: { [floor: number]: number } = {};
    private bossListItems: BossHomeListItem[] = [];
    static maxShowDropThingNum: number = 2;
    private readonly MaxWeek: number = 4;
    private readonly gropMaxBossCount: number = 8;
    private readonly weekMaxDropIdCnt = 32;
    private curWeek: number = 1;
    private curIndex: number = -1;
    private ticketEndTime = 0;
    private endtime = 0;
    private isNeedAddTime: boolean = false;
    private isCoseTicket: boolean = false;
    private txtTitle: UnityEngine.UI.Text;

    //private rareDropMinId = 60130201;
    private rareDropMinId = 60130401
    private layerDropMinId = 60130301;
    private layerCanyuDropMinId = 60140101;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_ZYCM_HOME_BOSS);
    }


    protected resPath(): string {
        return UIPathData.BossHomePanel;
    }

    protected initElements() {
        this.bossGroup = this.elems.getToggleGroup('toggleGroup');
        this.btnGo = this.elems.getElement('btnGo');
        this.rewardList = this.elems.getUIList('rewardList');
        //this.rewardList2 = this.elems.getUIList('rewardList2');
        this.modelCtn = this.elems.getElement('modelCtn');
        this.btnGoText = ElemFinder.findText(this.btnGo, 'Text');
        this.bossList = this.elems.getUIList('bossList');
        this.SurplusTime = this.elems.getText('SurplusTime');
        this.addTimeBtn = this.elems.getElement('addTimeBtn');
        for (let i = 0; i < this.tagCount; i++) {
            this.costMoney[i + 1] = (G.DataMgr.fmtData._BossHomeCostDic[i + 1].m_iPrice);
        }
        BossHomePanel.iconItemNormal = this.elems.getElement('itemIcon_Normal');
        BossHomePanel.BossNameAltas = ElemFinderMySelf.findAltas(this.elems.getElement('nameAltas'));
        this.tipText = this.elems.getText('tipText');
        for (let i = 0; i < this.maxFloor; i++) {
            let tipMark = ElemFinder.findObject(this.bossGroup.GetToggle(i).gameObject, 'tipMark');
            this.tipMarks.push(tipMark);
        }
        this.txtTitle = this.elems.getText("txtTitle");
    }

    protected initListeners() {
        this.addToggleGroupListener(this.bossGroup, this.onClickBossListGroup);
        this.addClickListener(this.btnGo, this.onClickBtnGo);
        this.addClickListener(this.elems.getElement('btnRecord'), this.onClickBtnTip);
        this.addClickListener(this.addTimeBtn, this.onClickAddTimeBtn);
    }


    open(openBossId: number = 0) {
        this.openBossId = openBossId;
        super.open();
    }


    private onClickBtnTip() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(444), '玩法说明');
    }

    protected onOpen() {
        this.updateView();
    }


    protected onClose() {
        for (let i = 0; i < BossHomePanel.timers.length; i++) {
            BossHomePanel.timers[i].Stop();
        }
        BossHomePanel.timers = [];
    }


    private onClickBtnGo() {
        this.isNeedAddTime = false;
        if (this.selectedBossData == null) {
            return;
        }
        //let costMoney_Bind = this.costMoney[this.selectedBossData.floor];
        let costMoney_Gold = this.costMoney[this.curIndex + 1];
        let lowestVipLv = this.selectedBossData.lowestVipLv;
        let heroVipLv = G.DataMgr.heroData.curVipLevel;
        let ticketData = G.DataMgr.fmtData._BossHomeCostDic[this.selectedBossData.floor];
        let ticketsId = ticketData.m_iTicketID;
        let ticketNum = G.DataMgr.thingData.getThingNum(ticketsId);
        let costTickNum = ticketData.m_iTicketNum;

        if (heroVipLv < lowestVipLv && G.DataMgr.heroData.gold < costMoney_Gold && ticketNum <= 0 && this.endtime <= 0) {
            G.TipMgr.showConfirm(uts.format("您的VIP等级达不到{0}级,且钻石不足,是否前往充值", lowestVipLv),
                ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onGoToPayView));
            return;
        }


        //等级不足且没有体验时间了
        if (heroVipLv < lowestVipLv && this.endtime <= 0) {
            let des: string = '';
            if (ticketNum >= costTickNum) {
                des = uts.format('您当前拥有本层体验券{0}张，是否消耗{1}张体验券增加1小时体验时长', ticketNum, costTickNum);

            }
            else {
                if (this.curIndex == 0) {
                    if (G.DataMgr.activityData.bossHomeBugTicketNumber > 0) {
                        G.TipMgr.addMainFloatTip("今日已无法购买挑战时间");
                        return;
                    }
                    des = uts.format("您的VIP等级达不到{0}级,是否消耗{1}钻石增加1小时体验时长", lowestVipLv, costMoney_Gold);
                } else {
                    G.TipMgr.showConfirm(uts.format("您的VIP等级达不到{0}级,是否前往充值", lowestVipLv),
                        ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onGoToPayView));
                    return;
                }

            }
            this.isNeedAddTime = true;
            G.TipMgr.showConfirm(des, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onGotoHomeBossConfirm));
            return;
        }
        this.onGotoHomeBossConfirm(MessageBoxConst.yes, false);
    }



    private onGoToPayView(stage: MessageBoxConst, isCheckSelected: boolean) {
        if (MessageBoxConst.yes == stage) {
            G.Uimgr.createForm<VipView>(VipView).open(VipTab.ChongZhi);
        }
    }


    private onGotoHomeBossConfirm(stage: MessageBoxConst, isCheckSelected: boolean) {

        if (MessageBoxConst.yes == stage) {
            if (this.isNeedAddTime) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HOME_BOSS_ACT, Macros.ACTIVITY_HOME_BOSS_ADDTIME, this.curIndex + 1));
                G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_HOMEBOSS, Macros.ACTIVITY_ID_HOME_BOSS_ACT, this.selectedBossData.floor);
            }
            else {
                G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_HOMEBOSS, Macros.ACTIVITY_ID_HOME_BOSS_ACT, this.selectedBossData.floor);
                this.isNeedAddTime = false;
            }
            G.DataMgr.runtime.curBossHomeLayer = this.selectedBossData.floor;
            G.Uimgr.closeForm(BossView);
        }
    }


    updateView() {
        this.setListData();
        let selected: number = 0;
        if (this.openBossId > 0 && this.curIndex < 0) {
            this.onClickBossListGroup(this.openBossId);
            this.bossGroup.Selected = this.openBossId;
        }
        else {
            if (this.curIndex == -1)
                this.curIndex = 0;
            this.onClickBossListGroup(this.curIndex);
            this.bossGroup.Selected = this.curIndex;
        }

        for (let i = 0; i < this.maxFloor; i++) {
            this.tipMarks[i].SetActive(G.DataMgr.activityData.getHasBossRefreshByFloor(i + 1));
        }
    }

    private setListData() {
        G.DataMgr.activityData.setBossHomeDataInit();
        this.listDatas = G.DataMgr.activityData.bossHomeListData;
    }


    private onClickBossListGroup(index: number) {
        //this.curWeek = G.SyncTime.getWeekAfterSatrtServer();
        this.curIndex = index;
        //if (this.curWeek >= this.MaxWeek) {
        //    this.curWeek = this.MaxWeek;
        //}
        let floor: number = index + 1;
        this.bossList.ScrollByAxialRow(0);
        this.groupListData = this.listDatas[floor];
        this.bossList.Count = this.groupListData.length;
        for (let i = 0; i < this.groupListData.length; i++) {
            let item = this.getBossListItem(i, this.bossList.GetItem(i).gameObject);
            item.updateBossHome(this.groupListData[i], this.rareDropMinId + (this.curWeek - 1) * this.weekMaxDropIdCnt + index * this.gropMaxBossCount + i);
        }
        if (this.groupListData.length > 0) {
            this.selectedBossData = this.groupListData[0];
            this.updatePanel();
        }
    }


    private getBossListItem(index: number, obj: UnityEngine.GameObject) {
        let item: BossHomeListItem;
        if (index < this.bossListItems.length) {
            item = this.bossListItems[index];
        } else {
            item = new BossHomeListItem();
            item.setCommonPents(obj);
            this.bossListItems.push(item);
        }
        return item;
    }


    private updatePanel() {
        if (this.selectedBossData == null) {
            return;
        }
        if (this.selectedBossData.isOpen) {
            this.btnGoText.text = uts.format("VIP{0}以上进入", this.selectedBossData.lowestVipLv);
            UIUtils.setButtonClickAble(this.btnGo, true);
        } else {
            this.btnGoText.text = '6点开启';
            UIUtils.setButtonClickAble(this.btnGo, false);
        }
        this.txtTitle.text = uts.format("VIP{0}专属", this.selectedBossData.lowestVipLv);

        let lowestVipLv = this.selectedBossData.lowestVipLv;
        let heroVipLv = G.DataMgr.heroData.curVipLevel;
        if (heroVipLv >= lowestVipLv) {
            this.tipText.text = "";
            this.SurplusTime.gameObject.SetActive(false);
            this.addTimeBtn.SetActive(false);
        }
        else {
            if (this.curIndex == 0) {
                this.SurplusTime.gameObject.SetActive(true);
                this.addTimeBtn.SetActive(true);
                let costMoney_Gold = this.costMoney[this.curIndex + 1];
                this.tipText.text = uts.format("VIP等级不足可花费{0}钻石购买体验时间进入", TextFieldUtil.getColorText(costMoney_Gold.toString(), Color.GREEN));
            } else {
                this.SurplusTime.gameObject.SetActive(false);
                this.addTimeBtn.SetActive(false);
                this.tipText.text = "";
            }
        }
        this.ticketEndTime = G.DataMgr.activityData.bossHomeTicketTime[this.curIndex];
        if (this.ticketEndTime == null)
            this.ticketEndTime = 0;
        this.onCountDownTimer();
        this.addTimer("1", 1000, 0, this.onCountDownTimer);


        //let costMoney_Bind = this.costMoney[this.selectedBossData.floor];

        //let dropCfg = DropPlanData.getDropPlanConfig(this.layerDropMinId + this.groupListData.length * (this.curWeek - 1) + this.curIndex);
        let dropCfg = DropPlanData.getDropPlanConfig(this.layerDropMinId + this.groupListData.length / 2 * (this.curWeek - 1) + this.curIndex);
        if (dropCfg != null) {
            let thingData = dropCfg.m_astDropThing;
            let count = thingData.length;
            this.rewardList.Count = count;
            for (let i = 0; i < count; i++) {
                let iconItem: IconItem;
                if (i < this.rewardListItems.length) {
                    iconItem = this.rewardListItems[i];
                } else {
                    iconItem = new IconItem();
                    iconItem.setUsuallyIcon(this.rewardList.GetItem(i).gameObject);
                    iconItem.setTipFrom(TipFrom.normal);
                    this.rewardListItems.push(iconItem);
                }
                iconItem.updateByDropThingCfg(thingData[i]);
                iconItem.updateIcon();
            }
        }

        //let canYuDropCfg = DropPlanData.getDropPlanConfig(this.layerCanyuDropMinId + this.curIndex);
        //if (canYuDropCfg != null)
        //{
        //    let thingDataCanyu = canYuDropCfg.m_astDropThing;
        //    let count = thingDataCanyu.length;
        //    this.rewardList2.Count = count;
        //    for (let i = 0; i < count; i++) {
        //        let iconItem: IconItem;
        //        if (i < this.rewardListItems2.length) {
        //            iconItem = this.rewardListItems2[i];
        //        } else {
        //            iconItem = new IconItem();
        //            iconItem.setUsuallyIcon(this.rewardList2.GetItem(i).gameObject);
        //            iconItem.setTipFrom(TipFrom.normal);
        //            this.rewardListItems2.push(iconItem);
        //        }
        //        iconItem.updateByDropThingCfg(thingDataCanyu[i]);
        //        iconItem.updateIcon();
        //    }
        //}
    }

    private onCountDownTimer() {
        let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        this.endtime = this.ticketEndTime - now;
        if (this.endtime <= 0) {
            this.endtime = 0;
            this.removeTimer('1');
        }
        else {
            this.endtime--;
        }
        this.SurplusTime.text = uts.format('剩余时长:{0}', TextFieldUtil.getColorText(DataFormatter.second2hhmmss(this.endtime), Color.GREEN));
    }

    private onClickAddTimeBtn() {
        if (G.DataMgr.activityData.bossHomeBugTicketNumber > 0) {
            G.TipMgr.addMainFloatTip("今日已无法购买挑战时间");
        } else {//没有购买
            let ticketData = G.DataMgr.fmtData._BossHomeCostDic[this.selectedBossData.floor];
            let ticketsId = ticketData.m_iTicketID;
            let ticketNum = G.DataMgr.thingData.getThingNum(ticketsId);

            let des: string = "";
            if (ticketNum > 0) {
                des = uts.format("您当前拥有本层体验券{0}张，是否消耗1张体验券增加1小时体验时长", ticketNum);
                this.isCoseTicket = true;
            }
            else {
                des = uts.format('您的VIP等级不足，是否花费{0}钻石购买1小时体验时长？', this.costMoney[this.curIndex + 1]);
                this.isCoseTicket = false;
            }

            G.TipMgr.showConfirm(des, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onGotoHomeBossConfirm2));
        }
    }

    private onGotoHomeBossConfirm2(stage: MessageBoxConst, isCheckSelected: boolean) {
        if (MessageBoxConst.yes == stage) {
            if (this.isCoseTicket) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HOME_BOSS_ACT, Macros.ACTIVITY_HOME_BOSS_ADDTIME, this.curIndex + 1));
            }
            else {
                if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.costMoney[this.curIndex + 1], true)) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HOME_BOSS_ACT, Macros.ACTIVITY_HOME_BOSS_ADDTIME, this.curIndex + 1));
                }
            }
        }
    }
}









