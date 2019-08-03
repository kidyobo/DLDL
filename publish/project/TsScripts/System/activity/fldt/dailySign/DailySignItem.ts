import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { UIUtils } from 'System/utils/UIUtils'
import { Global as G } from 'System/global'
import { DataFormatter } from 'System/utils/DataFormatter'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { DailySignData } from 'System/data/activities/DailySignData'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { Macros } from 'System/protocol/Macros'
import { VipView } from 'System/vip/VipView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { EnumEffectRule } from 'System/constants/GameEnum'
import { FuLiDaTingView } from 'System/activity/fldt/FuLiDaTingView'
export class DailySignItem extends ListItemCtrl {

    /**天数显示文本*/
    private dayText: UnityEngine.UI.Text = null;
    /**当天数据的存放*/
    private dayData: number = 0;
    /**今天为改月的第几天*/
    private todayTimeInThisMonth: number = 0;
    /**对应的天数*/
    private day: number = 0;
    /**已经签到过标记*/
    private hasSign: UnityEngine.GameObject = null;
    /**签到按钮*/
    private btn_sign: UnityEngine.GameObject = null;
    /**补签按钮*/
    private btn_buQian: UnityEngine.GameObject = null;
    /**每天奖励icon*/
    private dailyRewardIcon: UnityEngine.GameObject = null;
    /**签到item索引*/
    private signItem: UnityEngine.GameObject;

    private iconItem: IconItem;
    private fulidatingView: FuLiDaTingView;
    constructor() {
        super();
    }


    setComponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        this.signItem = go;
        this.dayText = go.transform.Find("day").GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
        this.hasSign = go.transform.Find("back/hasSign").gameObject;
        this.btn_sign = go.transform.Find("signBt").gameObject;
        this.btn_buQian = go.transform.Find("buqianBt").gameObject;

        this.dailyRewardIcon = go.transform.Find("back/icon").gameObject;
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(itemIcon_Normal, this.dailyRewardIcon);
        this.iconItem.setTipFrom(TipFrom.normal);

        Game.UIClickListener.Get(this.btn_sign).onClick = delegate(this, this.onClickSignBt);
        Game.UIClickListener.Get(this.btn_buQian).onClick = delegate(this, this.onClickBuQianBt);
    }

    updateData(data: number, day: number, todayTimeInThisMonth: number) {
        this.dayData = data;
        this.day = day + 1;
        this.todayTimeInThisMonth = todayTimeInThisMonth;
    }


    update() {
        this.dayText.text = DataFormatter.toHanNumStr(this.day) + "天";
        //按位存储,1签过,0未签
        if (this.dayData == 1) {
            //已经签到过了,显示签过图标
            this.setSignIconActive(true, false, false);
        } else if (this.dayData == 0) {
            //还没有签到
            if (this.day < this.todayTimeInThisMonth) {
                //显示补签按钮
                this.setSignIconActive(false, false, true);
            } else if (this.day == this.todayTimeInThisMonth) {
                //今天显示签到按钮
                this.setSignIconActive(false, true, false);
            } else {
                //还未到签到天数
                this.setSignIconActive(false, false, false);
            }
        }
        let dailyGiftData = G.DataMgr.activityData.dailySignData.getDailyGiftData(this.day);
        let itemData = new RewardIconItemData();
        itemData.id = dailyGiftData.gifts[0].m_iThingID;
        itemData.number = dailyGiftData.gifts[0].m_iThingNumber;
        itemData.state = dailyGiftData.state;

        if (this.dayData == 1) {
            this.iconItem.effectRule = EnumEffectRule.none;
            this.iconItem.updateById(itemData.id);
        } else {
            this.iconItem.effectRule = EnumEffectRule.normal;
            this.iconItem.updateByRewardIconData(itemData);
        }
        this.iconItem.updateIcon();
    }


    private setSignIconActive(hasSignActtive: boolean, signBtActive: boolean, buQianActive: boolean) {
        this.hasSign.SetActive(hasSignActtive);
        this.btn_sign.SetActive(signBtActive);
        this.btn_buQian.SetActive(buQianActive);
    }


    /**点击签到*/
    private onClickSignBt(): void {
        if (G.DataMgr.activityData.dailySignData.isTodaySigned(this.day)) {
            G.TipMgr.addMainFloatTip('您今天已经签到过了。');
            return;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SIGN, Macros.SIGN_IN_REQ, this.day));
    }


    /**
    * 点击补签按钮事件的响应函数。
    * @param event
    *
    */
    private onClickBuQianBt(): void {
        this.fulidatingView = G.Uimgr.getForm<FuLiDaTingView>(FuLiDaTingView);
        if (G.DataMgr.activityData.dailySignData.remainSignTimes > 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SIGN, Macros.SIGN_IN_REQ, this.day));
        }
        else {
            let str: string = '您本月的免费补签次数已耗尽';
            if (G.DataMgr.heroData.curVipLevel < Macros.MAX_VIP_LEVEL) {
                str += ',白银VIP等级越高,每月补签次数很多!';
            }
            G.TipMgr.showConfirm(str, ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmClick));
        }
    }


    private onConfirmClick(state: MessageBoxConst, isCheckSelected: boolean) {
        if (MessageBoxConst.yes == state) {
            if (G.DataMgr.heroData.curVipLevel < Macros.MAX_VIP_LEVEL) {
                this.fulidatingView.close();
                G.Uimgr.createForm<VipView>(VipView).open();
            }
        }
    }



}