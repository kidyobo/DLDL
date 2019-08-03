import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { DailySignItem } from 'System/activity/fldt/dailySign/DailySignItem'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { DailySignData } from 'System/data/activities/DailySignData'
import { UIUtils } from 'System/utils/UIUtils'
import { VipView } from 'System/vip/VipView'
import { EnumRewardState, EnumGuide } from 'System/constants/GameEnum'
import { RewardView } from 'System/pinstance/selfChallenge/RewardView'


enum RewardCanGetDay {
    stage1 = 2,
    stage2 = 5,
    stage3 = 10,
    stage4 = 17,
    stage5 = 26,
}

class DailySignBoxItem {

    private imgIcon: UnityEngine.GameObject;
    private imgCan: UnityEngine.GameObject;
    private imgAlready: UnityEngine.GameObject;
    private txtDes: UnityEngine.UI.Text;
    private gameobject: UnityEngine.GameObject;

    setComment(go: UnityEngine.GameObject) {
        this.gameobject = go;

        this.imgIcon = ElemFinder.findObject(go, "imgIcon");
        this.imgCan = ElemFinder.findObject(go, "imgCan");
        this.imgAlready = ElemFinder.findObject(go, "imgAlready");
        this.txtDes = ElemFinder.findText(go, "txtDes");

        this.imgIcon.SetActive(true);
        this.imgCan.SetActive(false);
        this.imgAlready.SetActive(false);
        this.txtDes.gameObject.SetActive(false);
    }

    setGray(yes: boolean) {
        UIUtils.setGrey(this.gameobject, yes);
    }

    /**
     * 设置状态 0可领取 1已领取 2不可领
     * @param index
     */
    setState(state: EnumRewardState, dayNumber: number) {
        // 更新领取状态
        switch (state) {
            case EnumRewardState.NotGot:
                //未领取
                this.imgCan.SetActive(true);
                this.imgAlready.SetActive(false);
                this.txtDes.gameObject.SetActive(false);
                this.setGray(false);
                break;
            case EnumRewardState.HasGot:
                this.imgCan.SetActive(false);
                this.imgAlready.SetActive(true);
                this.txtDes.gameObject.SetActive(false);
                this.setGray(false);
                break;
            case EnumRewardState.NotReach:
                //不可领取
                this.imgCan.SetActive(false);
                this.imgAlready.SetActive(false);
                this.txtDes.gameObject.SetActive(true);
                this.txtDes.text = uts.format("签到{0}天", dayNumber);
                this.setGray(true);
                break;
        }
    }

}

export class DailySignPanel extends TabSubForm {

    /**签到list*/
    private dailyList: List;
    /**签到数据*/
    private m_signData: DailySignData;
    /**签到天数数据的存放*/
    private m_calendarData: number[] = [];
    /**奖励List*/
    private rewardList: UnityEngine.GameObject;
    private rewardItemLists: DailySignBoxItem[] = [];
    private imgSlide: UnityEngine.UI.Image;

    //private m_btnReward: UnityEngine.GameObject;
    //private m_btnRewardText: UnityEngine.UI.Text;
    //private selectedIndex: number = -1;
    /**本月累计签到次数文本*/
    private signDayText: UnityEngine.UI.Text;

    private rewardIcons: UnityEngine.GameObject[] = [];
    private itemIcon_Normal: UnityEngine.GameObject;
    //private max_totalRewards: number = 4;
    private totalIconItems: IconItem[] = [];
    private todayTimeInThisMonth: number = 0;
    private max_totalDays: number = 5;
    private isFirstOpen: boolean = true;
    private dailySignItems: DailySignItem[] = [];
    private selectedStages: UnityEngine.GameObject[] = [];
    private lastSelected: UnityEngine.GameObject = null;
    private hasSignIcons: UnityEngine.GameObject[] = [];

    private needScrollDay: number = 24;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_MRQD);
        this.m_signData = G.DataMgr.activityData.dailySignData;
    }

    protected resPath(): string {
        return UIPathData.DailySignView;
    }

    protected initElements() {
        this.dailyList = ElemFinder.getUIList(this.elems.getElement("dailyList"));
        this.rewardList = this.elems.getElement("rewardList");
        this.imgSlide = this.elems.getImage("imgSlide");
        //this.m_btnReward = this.elems.getElement("getGift");
        //this.m_btnRewardText = ElemFinder.findText(this.m_btnReward, "Text");
        this.signDayText = this.elems.getText("titleDay");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        for (let i = 0; i < this.max_totalDays; i++) {
            let obj = ElemFinder.findObject(this.rewardList, i.toString());
            let rew = new DailySignBoxItem();
            rew.setComment(obj);
            this.rewardItemLists.push(rew);
            Game.UIClickListener.Get(obj).onClick = delegate(this, this.onClickListItem, i);

            //this.rewardIcons.push(obj);
            //Game.UIClickListener.Get(obj).onClick = delegate(this, this.onTabGroupChange, obj);
            //let selectedObj = ElemFinder.findObject(obj, 'selected');
            //selectedObj.SetActive(false);
            //this.selectedStages.push(selectedObj);
            //let hasGetIcon = ElemFinder.findObject(obj, 'hasGetIcon');
            //hasGetIcon.SetActive(false);
            //this.hasSignIcons.push(hasGetIcon);
        }
        //for (let i = 0; i < this.max_totalRewards; i++) {
        //    let iconItem = new IconItem();
        //    let root = ElemFinder.findObject(this.elems.getElement("rewards"), i.toString());
        //    iconItem.setUsualIconByPrefab(this.itemIcon_Normal, root);
        //    iconItem.setTipFrom(TipFrom.normal);
        //    this.totalIconItems.push(iconItem);
        //}
    }

    protected initListeners() {
        //this.addClickListener(this.m_btnReward, this.onClickBtnReward);
    }

    protected onOpen() {
        this.dailySignItems.length = 0;
        let data = this.m_signData.getCalendarData();
        this.dailyList.Count = data.length;
        for (let i = 0; i < data.length; i++) {
            let obj = this.dailyList.GetItem(i).gameObject;
            let dailySignItem: DailySignItem = new DailySignItem();
            dailySignItem.setComponents(obj, this.itemIcon_Normal);
            this.dailySignItems.push(dailySignItem);
        }
        //计算为该月的第几天
        this.todayTimeInThisMonth = this.m_signData.getTodayTimeInThisMonth();
        if (this.m_signData.isReady) {
            this.updateView();
        }
        else {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SIGN, Macros.SIGN_LIST_QRY));
        }
        G.GuideMgr.processGuideNext(EnumGuide.DailySign, EnumGuide.DailySign_OpenDailySign);
    }


    protected onClose() {
        this.isFirstOpen = true;
    }

    ///////////////////////面板显示/////////////////////////////////////
    updateByResp(response: Protocol.DoActivity_Response): void {
        if (Macros.SIGN_LIST_QRY == response.m_ucCommand) //查询签到列表
        {
            this.updateView();
        }
        else if (Macros.SIGN_IN_REQ == response.m_ucCommand) //如果是签到(包含了签到跟补签)
        {
            this.updateView();
        }
        else if (Macros.SIGN_PRIZE_REQ == response.m_ucCommand) //如果是领取奖励
        {
            this.updateView();
            //this.updateContinousSignReward();
            //this.updateHasGetGiftIconStage();
        }
    }


    private updateView(): void {
        //默认dailyList30天,从创角第一天作为签到第一天,经过30天后重新开始计数
        this.m_calendarData = G.DataMgr.activityData.dailySignData.getCalendarData();
        let allSignDay = G.DataMgr.activityData.dailySignData.signCount;
        this.signDayText.text = uts.format("{0}", allSignDay.toString());
        this.updateSignLists();
        for (let i = 0; i < this.m_calendarData.length; i++) {
            let item = this.dailySignItems[i];
            item.updateData(this.m_calendarData[i], i, this.todayTimeInThisMonth);
            item.update();
            if (this.isFirstOpen) {
                if (this.todayTimeInThisMonth > this.needScrollDay) {
                    if (i + 1 == this.todayTimeInThisMonth) {
                        this.dailyList.ScrollByAxialRow(i);
                        this.isFirstOpen = false;
                    }
                }
            }
        }
        //更新累计签到礼包的显示，自动显示可以领取的，没有可以领取的则显示最近的目标
        //this.updateContinousSignReward();
        //刷新已领取标志
        //this.updateHasGetGiftIconStage();
    }

    /**
     * 刷新宝箱列表
     */
    private updateSignLists() {
        let allSignDay = G.DataMgr.activityData.dailySignData.signCount;

        if (allSignDay < RewardCanGetDay.stage1) {
            this.imgSlide.fillAmount = 0;
        } else if (allSignDay >= RewardCanGetDay.stage1 && allSignDay < RewardCanGetDay.stage2) {
            this.imgSlide.fillAmount = 0.2;
        } else if (allSignDay >= RewardCanGetDay.stage2 && allSignDay < RewardCanGetDay.stage3) {
            this.imgSlide.fillAmount = 0.4;
        } else if (allSignDay >= RewardCanGetDay.stage3 && allSignDay < RewardCanGetDay.stage4) {
            this.imgSlide.fillAmount = 0.6;
        } else if (allSignDay >= RewardCanGetDay.stage4 && allSignDay < RewardCanGetDay.stage5) {
            this.imgSlide.fillAmount = 0.8;
        } else {
            this.imgSlide.fillAmount = 1;
        }

        for (let i = 0; i < this.rewardItemLists.length; i++) {
            let giftData = this.m_signData.getGiftData()[i];
            this.rewardItemLists[i].setState(giftData.state, giftData.count);
        }
    }


    /**
     * 点击宝箱
     * @param index
     */
    private onClickListItem(index: number) {
        let giftData = this.m_signData.getGiftData()[index];
        let itemDatas: RewardIconItemData[] = [];
        let len = giftData.gifts.length;
        for (let i = 0; i < len; i++) {
            let item = new RewardIconItemData();
            item.id = giftData.gifts[i].m_iThingID;
            item.number = giftData.gifts[i].m_iThingNumber;
            itemDatas.push(item);
        }
        let desc = uts.format("累计签到{0}天即可领取", giftData.count);

        G.Uimgr.createForm<RewardView>(RewardView).open(itemDatas, desc, giftData.state, delegate(this, this.onClickGetReward, index));
    }

    private onClickGetReward(index: number) {
        let giftData = this.m_signData.getGiftData()[index];
        if (EnumRewardState.NotGot == giftData.state) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SIGN, Macros.SIGN_PRIZE_REQ, giftData.count));
        }
    }

    //private onTabGroupChange(go: UnityEngine.GameObject): void {
    //    let selectedIndex: number = this.rewardIcons.indexOf(go);
    //    this.selectedIndex = selectedIndex;
    //    if (this.lastSelected != null) {
    //        this.lastSelected.SetActive(false);
    //    }
    //    this.selectedStages[selectedIndex].SetActive(true);
    //    this.lastSelected = this.selectedStages[selectedIndex];
    //    // 刷新连续礼包
    //    let giftData = this.m_signData.getGiftData()[this.selectedIndex];
    //    for (let i = 0; i < giftData.gifts.length; i++) {
    //        this.totalIconItems[i].updateById(giftData.gifts[i].m_iThingID, giftData.gifts[i].m_iThingNumber);
    //        this.totalIconItems[i].updateIcon();
    //    }
    //    // 更新领取状态
    //    switch (giftData.state) {
    //        case EnumRewardState.NotGot:
    //            UIUtils.setButtonClickAble(this.m_btnReward, true);
    //            this.m_btnRewardText.text = "领取奖励";
    //            break;
    //        case EnumRewardState.HasGot:
    //            UIUtils.setButtonClickAble(this.m_btnReward, false);
    //            this.m_btnRewardText.text = "已领取";
    //            break;
    //        case EnumRewardState.NotReach:
    //            UIUtils.setButtonClickAble(this.m_btnReward, false);
    //            this.m_btnRewardText.text = "不可领取";
    //            break;
    //    }
    //}


    ///**设置已领取标志*/
    //private updateHasGetGiftIconStage() {
    //    for (let i = 0; i < this.max_totalDays; i++) {
    //        let data = this.m_signData.getGiftData()[i];
    //        this.hasSignIcons[i].SetActive(data.state == EnumRewardState.HasGot);
    //    }
    //}


    ///**更新连续签到领取奖励*/
    //private updateContinousSignReward(): void {
    //    let index: number = 0;
    //    let giftDatas = this.m_signData.getGiftData();
    //    let signedCount: number = this.m_signData.signCount;
    //    for (let i: number = 0; i < DailySignData.GIFT_BAG_NUM; i++) {
    //        let giftData = giftDatas[i];
    //        if (EnumRewardState.NotGot == giftData.state) {
    //            // 可以领取的
    //            index = i;
    //            break;
    //        }
    //        else if (signedCount < giftData.count) {
    //            // 还未达成的目标
    //            index = i;
    //            break;
    //        }
    //    }
    //    this.onTabGroupChange(this.rewardIcons[index]);
    //}


    ///**点击领取奖励按钮*/
    //private onClickBtnReward(): void {
    //    let giftData = this.m_signData.getGiftData()[this.selectedIndex];
    //    if (EnumRewardState.NotGot == giftData.state) {
    //        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SIGN, Macros.SIGN_PRIZE_REQ, giftData.count));
    //    }
    //}
}