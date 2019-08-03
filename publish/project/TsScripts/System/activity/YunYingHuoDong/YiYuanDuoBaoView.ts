import { EnumThingID } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { ActivityRuleView } from "System/diandeng/ActivityRuleView";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { TipFrom } from "System/tip/view/TipsView";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from "System/utils/UIUtils";
import { ElemFinder, ElemFinderMySelf } from "System/uilib/UiUtility";

export class GiftListItem {

    private iconRoot: UnityEngine.GameObject;
    private joinNumText: UnityEngine.UI.Text;
    private iconItem: IconItem;

    setCommonpents(obj: UnityEngine.GameObject) {
        this.iconRoot = ElemFinder.findObject(obj, 'iconRoot');
        this.joinNumText = ElemFinder.findText(obj, 'joinNumText');
        this.iconItem = new IconItem();
        this.iconItem.setTipFrom(TipFrom.normal);
        this.iconItem.setUsualIconByPrefab(YiYuanDuoBaoView.iconItem_Normal, this.iconRoot);
    }

    update(config: Protocol.YYDBGifeOneCfg, data: Protocol.YYDBInfoRsp) {
        let num = config.m_iCondition;
        let str = uts.format("参与{0}人", num);
        this.joinNumText.text = TextFieldUtil.getColorText(str, data.m_ucAllJoinNum >= num ? Color.GREEN : Color.WHITE);
        this.iconItem.updateById(config.m_iThingId, config.m_iThingNum);
        this.iconItem.updateIcon();
    }

}



enum RechargeStage {
    notRecharge = Macros.CHARGE_AWARD_CANT_GET,
    canGetRechargeReward = Macros.CHARGE_AWARD_WAIT_GET,
    hasGetRechargeReward = Macros.CHARGE_AWARD_DONE_GET,
}

enum GiftType {
    joinReward = 0,
}

export enum YiYuanDuoBaoGroupType {
    meiriyiyuanPanel = 0,
    yiyuanduobaoPanel = 1,
}


export class YiYuanDuoBaoView extends CommonForm {

    private menuGroup: UnityEngine.UI.ActiveToggleGroup;
    private duoBaoPanel: UnityEngine.GameObject;
    private meiRiYiYuanPanel: UnityEngine.GameObject;

    ////////////////////充值领取界面相关/////////////////////////////

    private btn_getReward: UnityEngine.GameObject;
    private getImage: UnityEngine.GameObject;
    private hasGetImage: UnityEngine.GameObject;
    private rechargeList: List;
    private yiyuanMark: UnityEngine.GameObject;
    ////////////////////一元夺宝界面/////////////////////////////

    private joinPersonText: UnityEngine.UI.Text;
    private giftList: List;

    private btn_join: UnityEngine.GameObject;
    private hasJoinImage: UnityEngine.GameObject;
    private noJoinImage: UnityEngine.GameObject;

    private joinGiftData: Protocol.YYDBGifeOneCfg;
    private joinIconItem: IconItem;
    static iconItem_Normal: UnityEngine.GameObject;
    private iconRoot: UnityEngine.GameObject;
    private chouJiangData: Protocol.YYDBGifeOneCfg[] = [];

    private m_tfTime: UnityEngine.UI.Text;

    private thingIconItem: IconItem;
    private thingRoot: UnityEngine.GameObject;
    private baoJuanText: UnityEngine.UI.Text;

    private giftListItem: GiftListItem[] = [];
    private openType: YiYuanDuoBaoGroupType;

    constructor() {
        super(KeyWord.ACT_FUNCTION_YIYUANDUOBAO);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }


    protected resPath(): string {
        return UIPathData.YiYuanDuoBaoView;
    }


    protected initElements() {
        this.menuGroup = this.elems.getToggleGroup('tabGroup');
        //每日一元面板
        this.meiRiYiYuanPanel = this.elems.getElement('meiriyiyuanPanel');
        this.btn_getReward = this.elems.getElement('btn_get');
        this.getImage = this.elems.getElement('canget');
        this.hasGetImage = this.elems.getElement('hasget');
        this.rechargeList = this.elems.getUIList('rechargrList');
        this.yiyuanMark = this.elems.getElement('getTipMark');
        //夺宝面板
        this.duoBaoPanel = this.elems.getElement('yiyuanduobaoPanel');
        this.joinPersonText = this.elems.getText('canyuText');
        this.giftList = this.elems.getUIList('giftList');
        this.btn_join = this.elems.getElement('btn_yiyuanduobao');
        this.hasJoinImage = this.elems.getElement('hasJoin');
        this.noJoinImage = this.elems.getElement('noJoin');
        this.iconRoot = this.elems.getElement('canyuRoot');
        this.baoJuanText = this.elems.getText('thingNumText');
        this.m_tfTime = this.elems.getText('leftTimeText');
        YiYuanDuoBaoView.iconItem_Normal = this.elems.getElement('itemIcon_Normal');
        this.joinIconItem = new IconItem();
        this.joinIconItem.setUsualIconByPrefab(YiYuanDuoBaoView.iconItem_Normal, this.iconRoot);
        this.joinIconItem.setTipFrom(TipFrom.normal);
        this.thingRoot = this.elems.getElement('thingRoot');
        this.thingIconItem = new IconItem();
        this.thingIconItem.setUsualIconByPrefab(YiYuanDuoBaoView.iconItem_Normal, this.thingRoot);
        this.thingIconItem.setTipFrom(TipFrom.normal);
    }


    protected initListeners() {
        this.addToggleGroupListener(this.menuGroup, this.onClickMenuGroup);
        this.addClickListener(this.elems.getElement('btn_return'), this.close);
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.btn_getReward, this.onClickBtnGetRecharge);
        this.addClickListener(this.btn_join, this.onClickBtnYiYuanDuoBao);
        this.addClickListener(this.elems.getElement('btn_rule'), this.onClickRuleBt);
    }

    open(type: YiYuanDuoBaoGroupType = -1) {
        this.openType = type;
        super.open();
    }

    protected onOpen() {
        let autoIdx = -1;
        if (this.openType > 0) {
            // 有指定打开哪一个
            autoIdx = this.openType;
        }
        if (autoIdx < 0) {
            let data = G.DataMgr.activityData.kfYiYuanDuoBaoData;
            let index: number = YiYuanDuoBaoGroupType.meiriyiyuanPanel;
            autoIdx = YiYuanDuoBaoGroupType.yiyuanduobaoPanel;
            if (data != null) {
                if (data.m_ucGetStatus == RechargeStage.hasGetRechargeReward) {
                    autoIdx = YiYuanDuoBaoGroupType.yiyuanduobaoPanel;
                } else {
                    let myBaoQuan = G.DataMgr.thingData.getThingNum(EnumThingID.YiYuanDuoBaoQuan);
                    if (myBaoQuan >= 1 && data.m_ucJoinNum == 0) {
                        //有宝券并且本轮没有参加
                        autoIdx = YiYuanDuoBaoGroupType.yiyuanduobaoPanel;
                    } else {
                        autoIdx = YiYuanDuoBaoGroupType.meiriyiyuanPanel;
                    }
                }
            }
        }
        this.menuGroup.Selected = autoIdx;
        this.onClickMenuGroup(autoIdx);

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.YYDB_OPEN_PANEL));
        this.addTimer('checkTimer', 1000, 0, this._onTick);
    }


    protected onClose() {
    }


    /////////////////////////////////////刷新面板////////////////////////////////////////

    updatePanel() {
        let data = G.DataMgr.activityData.kfYiYuanDuoBaoData;
        this.updateRechargePanel(data);
        this.updateDuoBaoPanel(data);
    }

    onContainerChange(type: number) {
        if (type == Macros.CONTAINER_TYPE_ROLE_BAG) {
            this.updateMyBaoQuanNum();
        }
    }

    //////////////////////////////刷新充值领取面板////////////////////////////////////////////

    private updateRechargePanel(data: Protocol.YYDBInfoRsp) {
        if (data.m_ucGetStatus == RechargeStage.notRecharge || data.m_ucGetStatus == RechargeStage.canGetRechargeReward) {
            this.setGetRewardBtStage(true);
        } else if (data.m_ucGetStatus == RechargeStage.hasGetRechargeReward) {
            this.setGetRewardBtStage(false);
        }
        this.yiyuanMark.SetActive(data.m_ucGetStatus == RechargeStage.canGetRechargeReward);
        let config: Protocol.GiftItemInfo[] = [];
        for (let i = 0; i < data.m_stCfgInfo.m_stChargeCfg.length; i++) {
            if (data.m_stCfgInfo.m_stChargeCfg[i].m_iThingID != 0) {
                config.push(data.m_stCfgInfo.m_stChargeCfg[i]);
            }
        }
        this.rechargeList.Count = config.length;
        for (let i = 0; i < config.length; i++) {
            let iconItem = new IconItem();
            iconItem.setTipFrom(TipFrom.normal);
            let obj = this.rechargeList.GetItem(i).gameObject;
            iconItem.setUsuallyIcon(obj);
            iconItem.updateById(config[i].m_iThingID, config[i].m_iThingNumber);
            iconItem.updateIcon();
        }
    }

    private setGetRewardBtStage(active1: boolean) {
        this.getImage.SetActive(active1);
        this.hasGetImage.SetActive(!active1);
        UIUtils.setButtonClickAble(this.btn_getReward, active1);
    }


    //////////////////////////////刷新参与夺宝界面////////////////////////////////////////////

    private updateDuoBaoPanel(data: Protocol.YYDBInfoRsp) {
        //设置奖励数据
        this.joinGiftData = null;
        this.chouJiangData.length = 0;
        for (let i = 0; i < Macros.YYDB_GIFT_CFG_MAX_NUM; i++) {
            if (i == GiftType.joinReward) {
                this.joinGiftData = data.m_stCfgInfo.m_stGiftCfg[i];
            } else {
                this.chouJiangData.push(data.m_stCfgInfo.m_stGiftCfg[i]);
            }
        }
        //全服参与的人数
        this.joinPersonText.text = uts.format('本服已参与{0}人次', data.m_ucAllJoinNum);
        //参与奖展示
        this.joinIconItem.updateById(this.joinGiftData.m_iThingId, this.joinGiftData.m_iThingNum);
        this.joinIconItem.updateIcon();
        //抽奖奖励展示
        let configs = this.chouJiangData;
        this.giftList.Count = configs.length;
        for (let i = 0; i < configs.length; i++) {
            let item = this.getGiftListItem(i, this.giftList.GetItem(i).gameObject);
            item.update(configs[i], data);
        }
        //刷新背包拥有夺宝卷个数
        this.updateMyBaoQuanNum();
        //角色参与本轮夺宝次数
        if (data.m_ucJoinNum > 0) {
            this.hasJoinImage.SetActive(true);
            this.noJoinImage.SetActive(false);
        } else {
            this.hasJoinImage.SetActive(false);
            this.noJoinImage.SetActive(true);
        }
        UIUtils.setButtonClickAble(this.btn_join, data.m_ucJoinNum == 0);
    }


    private getGiftListItem(index: number, obj: UnityEngine.GameObject): GiftListItem {
        if (index < this.giftListItem.length) {
            return this.giftListItem[index];
        } else {
            let item = new GiftListItem();
            item.setCommonpents(obj);
            this.giftListItem.push(item);
            return item;
        }
    }



    private updateMyBaoQuanNum() {
        //拥有宝卷的个数
        let myBaoQuan = G.DataMgr.thingData.getThingNum(EnumThingID.YiYuanDuoBaoQuan);
        this.baoJuanText.text = TextFieldUtil.getColorText(uts.format("一元夺宝券({0}/1)", myBaoQuan), myBaoQuan >= 1 ? Color.GREEN : Color.WHITE);
        UIUtils.setButtonClickAble(this.btn_join, myBaoQuan >= 1);
        this.thingIconItem.updateById(EnumThingID.YiYuanDuoBaoQuan, myBaoQuan);
        this.thingIconItem.updateIcon();
    }


    /////////////////////////////////////点击事件////////////////////////////////////////

    private onClickMenuGroup(index: number) {
        if (index == YiYuanDuoBaoGroupType.yiyuanduobaoPanel) {
            this.duoBaoPanel.SetActive(true);
            this.meiRiYiYuanPanel.SetActive(false);
        } else if (index == YiYuanDuoBaoGroupType.meiriyiyuanPanel) {
            this.duoBaoPanel.SetActive(false);
            this.meiRiYiYuanPanel.SetActive(true);
        }
    }

    /**点击规则按钮*/
    private onClickRuleBt() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(10044), '规则介绍');
    }


    /**点击领取奖励按钮*/
    private onClickBtnGetRecharge() {
        let data = G.DataMgr.activityData.kfYiYuanDuoBaoData;
        if (data.m_ucGetStatus == RechargeStage.notRecharge) {
            G.ActionHandler.go2Pay();
        } else if (data.m_ucGetStatus == RechargeStage.canGetRechargeReward) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.YYDB_GET_GIFT));
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.YYDB_OPEN_PANEL));
        }
    }

    /**参与一元夺宝*/
    private onClickBtnYiYuanDuoBao() {
        if (!this.checkIsNotOpenActivity()) {
            G.TipMgr.addMainFloatTip("活动还没开启");
            return;
        }
        let myBaoQuan = G.DataMgr.thingData.getThingNum(EnumThingID.YiYuanDuoBaoQuan);
        if (myBaoQuan == 0) {
            G.TipMgr.addMainFloatTip("您的夺宝卷不足");
        } else {
            if (G.DataMgr.activityData.kfYiYuanDuoBaoData.m_ucJoinNum == 1) {
                G.TipMgr.addMainFloatTip("每天只可以参与一次夺宝");
                return;
            }
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.YYDB_JOIN));
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.YYDB_OPEN_PANEL));
        }
    }


    private checkIsNotOpenActivity(): boolean {
        let isOpen: boolean = true;
        let todayZeroSecond = Math.floor(G.SyncTime.getTodayZeroTime() / 1000);//当前00：00的时间
        let startTime = todayZeroSecond + 5 * 60;//第二天00：05分的时间
        let curTime = Math.floor(G.SyncTime.getCurrentTime() / 1000);//现在的时间
        //每天00：00-00：05分为空档期 不能报名
        if (curTime > todayZeroSecond && curTime < startTime) {
            isOpen = false;
        }
        if (curTime == startTime) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.YYDB_OPEN_PANEL));
        }
        return isOpen;
    }


    /**倒计时*/
    private _onTick(info: Game.Timer): void {
        if (!this.checkIsNotOpenActivity()) {
            this.m_tfTime.text = TextFieldUtil.getColorText("本轮结束", Color.GREEN);
        } else {
            let endTime: number = G.SyncTime.getServerZeroLeftTime();
            if (endTime <= 0) {
                this.m_tfTime.text = TextFieldUtil.getColorText("本轮结束", Color.GREEN);
            }
            else {
                this.m_tfTime.text = TextFieldUtil.getColorText(DataFormatter.second2day(endTime), Color.GREEN);
            }
        }
    }
}