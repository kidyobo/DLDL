import { LuckyExchangeView } from "System/activity/view/LuckyExchangeView";
import { PriceBar } from "System/business/view/PriceBar";
import { KeyWord } from "System/constants/KeyWord";
import { ThingData } from "System/data/thing/ThingData";
import { UIPathData } from "System/data/UIPathData";
import { ActivityRuleView } from "System/diandeng/ActivityRuleView";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { MessageBoxConst } from "System/tip/TipManager";
import { TipFrom } from "System/tip/view/TipsView";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";

export class LuckyWheelView extends CommonForm {
    private poolSizeText: UnityEngine.UI.Text;
    private BT_1: UnityEngine.GameObject;
    private BT_10: UnityEngine.GameObject;
    private BT_50: UnityEngine.GameObject;
    private wheel: UnityEngine.GameObject;
    private list: UnityEngine.Transform;
    private itemIcon_Normal: UnityEngine.GameObject;
    private create = false;
    private m_isCheckSelected: boolean = false;

    private timeLeftText: UnityEngine.UI.Text = null;
    private scoreText: UnityEngine.UI.Text = null;
    private activityEndTime: number = 0;
    private currencyBar: PriceBar;
    private bonusMembers: List = null;
    private m_ucDrawIndex: number = -1;

    private oneTimeGold: UnityEngine.UI.Text;
    private tenTimeGold: UnityEngine.UI.Text;
    private fiftyTimeGold: UnityEngine.UI.Text;

    private tabGroup: UnityEngine.UI.ActiveToggleGroup = null;
    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.LuckyWheelView;
    }

    protected initElements() {
        this.poolSizeText = this.elems.getText("poolSizeText");
        this.BT_1 = this.elems.getElement("BT_1");
        this.BT_10 = this.elems.getElement("BT_10");
        this.BT_50 = this.elems.getElement("BT_50");
        this.wheel = this.elems.getElement("wheel");
        this.list = this.elems.getTransform("list");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal")
        this.timeLeftText = this.elems.getText("timeLeftText");
        this.scoreText = this.elems.getText("scoreText");
        // 当前货币
        this.currencyBar = new PriceBar();
        this.currencyBar.setComponents(this.elems.getElement('currencyBar'));
        this.currencyBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID, true);

        this.oneTimeGold = this.elems.getText("oneTimeGold");
        this.tenTimeGold = this.elems.getText("tenTimeGold");
        this.fiftyTimeGold = this.elems.getText('fiftyTimeGold');

        this.bonusMembers = this.elems.getUIList("bonusMembers");
        this.tabGroup = this.elems.getToggleGroup("tabGroup");
        this.tabGroup.Selected = 0;
    }

    protected initListeners() {
        this.addClickListener(this.BT_1, this.onClick1);
        this.addClickListener(this.BT_10, this.onClick10);
        this.addClickListener(this.BT_50, this.onClick50);
        this.addClickListener(this.elems.getElement("mask"), this.close);
        this.addClickListener(this.elems.getElement("BT_Close"), this.close);
        this.addClickListener(this.elems.getElement("BT_Recharge"), this.onClickRecharge);
        this.addClickListener(this.elems.getElement("BT_Exchange"), this.onClickExchange);
        this.addClickListener(this.elems.getElement("BT_Tip"), this.onClickTip);
        this.addToggleGroupListener(this.tabGroup, this.onUpdateMembers);
    }
    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_XYZP, Macros.XYZP_PANNEL));

        this.oneTimeGold.text = G.DataMgr.constData.getValueById(KeyWord.PARAM_1_DRAW_GOLDEN).toString();
        this.tenTimeGold.text = G.DataMgr.constData.getValueById(KeyWord.PARAM_10_DRAW_GOLDEN).toString();
        this.fiftyTimeGold.text = G.DataMgr.constData.getValueById(KeyWord.PARAM_50_DRAW_GOLDEN).toString();

        this.onUpdateMoney();
        let activityEndTime = G.DataMgr.activityData.getActivityEndTime(Macros.ACTIVITY_ID_XYZP);
        if (activityEndTime <= 0) {
            this.timeLeftText.gameObject.SetActive(false);
        }
        else {
            this.activityEndTime = activityEndTime;
            this.addTimer("end", 1000, 0, this.onTimer);
            this.onTimer();
        }
    }
    protected onClose() {
    }

    private onTimer() {
        let curTime = G.SyncTime.getCurrentTime() / 1000;
        let time = Math.max(0, (this.activityEndTime - curTime));
        this.timeLeftText.text = "活动剩余时间:" + DataFormatter.second2DayDoubleShort(time);
        if (time == 0) {
            this.close();
        }
    }
    private onClick1() {
        this._onClick(1);
    }
    private onClick10() {
        this._onClick(10);
    }
    private onClick50() {
        this._onClick(50);
    }

    private _onClick(num: number) {
        let golden: number = 0;

        if (num == 50) {
            golden = G.DataMgr.constData.getValueById(KeyWord.PARAM_50_DRAW_GOLDEN);
        }
        else if (num == 10) {
            golden = G.DataMgr.constData.getValueById(KeyWord.PARAM_10_DRAW_GOLDEN);
        }
        else if (num == 1) {
            golden = G.DataMgr.constData.getValueById(KeyWord.PARAM_1_DRAW_GOLDEN);
        }

        //if (this.m_isCheckSelected) {
        //    this._onComfirmInfo(MessageBoxConst.yes, this.m_isCheckSelected, num, golden);
        //}
        //else {
        //    let info: string = uts.format("您确定消耗{0}钻石进行抽奖{1}次", golden, num);
        //    G.TipMgr.showConfirm(info, ConfirmCheck.withCheck, '确定|取消', delegate(this, this._onComfirmInfo, num, golden));
        //}
        this._onComfirmInfo(MessageBoxConst.yes, this.m_isCheckSelected, num, golden);
    }
    private _onComfirmInfo(state: MessageBoxConst, isSelected: boolean, num: number, golden: number) {
        if (MessageBoxConst.yes == state) {
            this.m_isCheckSelected = isSelected;
            if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, golden, true)) {
                if (num == 1) {
                    if (this.m_start) {
                        return;
                    }
                    this.m_start = true;
                    this.callTimes = 0;
                    this.playRotateAnim();
                }
                else {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_XYZP, Macros.XYZP_DRAW, num));
                }
            }
        }
    }
    private m_start = false;
    private callTimes: number = -1;
    private rotateSize: number = 0;
    private rotateTarget: number = 0;
    private playRotateAnim() {
        this.rotateSize = this.rotateSize % -360;
        let end = this.rotateTarget != 0;
        if (end) {
            //仅角度小于90度时候停下
            let delta = -this.rotateTarget - (-this.rotateSize);
            if ((delta > 0 && (delta <= 90)) || (delta <= -270)) {

            }
            else {
                end = false;
            }
        }
        if (end) {
            this.rotateSize = this.rotateTarget;
        }
        else {
            this.rotateSize -= 90;
        }
        this.m_ucDrawIndex = -1;
        let tween = Tween.TweenRotation.Begin(this.wheel, 0.1, G.getCacheV3(0, 0, this.rotateSize));
        tween.quaternionLerp = true;

        if (end) {
            this.rotateTarget = 0;
            tween.onFinished = delegate(this, this.onEnd);
        }
        else {
            tween.onFinished = delegate(this, this.onRotateAnimEnd);
        }
    }
    private onRotateAnimEnd() {
        if (this.callTimes >= 0) {
            this.callTimes++;
            if (this.callTimes > 4) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_XYZP, Macros.XYZP_DRAW, 1));
                this.callTimes = -1;
            }
        }
        if (this.m_ucDrawIndex == -1) {
            this.playRotateAnim();
        }
        else {
            this.rotateTarget = -(this.m_ucDrawIndex - 1) * 36 - 18;
            this.playRotateAnim();
        }
    }
    private onEnd() {
        this.m_start = false;
    }

    private onClickTip() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(`1.全服所有玩家每次抽奖系统都将放入20绑定钻石进入总奖池；
2.奖池初始系统注入10w绑钻，低于10w绑钻时系统会自动补足；
3.每次抽奖都可以获得1积分，积分可用于兑换积分奖励；
4.10连、50连抽尊享优惠折扣；
5.转盘积分将在活动关闭后清空，积分要及时兑换噢；`);
    }

    private onClickRecharge() {
        G.ActionHandler.go2Pay();
    }
    private onClickExchange() {
        G.Uimgr.createForm<LuckyExchangeView>(LuckyExchangeView).open();
    }
    public onUpdatePanel(data: Protocol.XYZPpannelRsp) {
        this.poolSizeText.text = data.m_iTotalReward.toString();
        this.onUpdateMembers(this.tabGroup.Selected);

        let configs = data.m_stCfgList;
        for (let i = 0, len = data.m_iCfgCount; i < len; i++) {
            let config = configs[i];
            let item: UnityEngine.GameObject;
            if (this.create) {
                item = this.list.Find((config.m_ucPosition - 1) + "/item").gameObject;
            }
            else {
                let parent = this.list.GetChild(config.m_ucPosition - 1);
                item = UnityEngine.GameObject.Instantiate(this.itemIcon_Normal, parent, false) as UnityEngine.GameObject;
                item.name = "item";
            }
            let iconItem = new IconItem();
            iconItem.setUsuallyIcon(item.gameObject);
            iconItem.setTipFrom(TipFrom.normal);

            iconItem.updateById(config.m_iItem1ID, config.m_iItem1Count);

            iconItem.updateIcon();
        }
        this.create = true;
    }
    private index: number = 1;
    public onUpdateDraw(data: Protocol.XYZPDrawRsp) {
        this.m_ucDrawIndex = data.m_ucDrawIndex;
        this.onUpdateMembers(this.tabGroup.Selected);
    }

    public onUpdateRecord(data: Protocol.XYZPRecordRsp) {
        this.poolSizeText.text = data.m_iTotalReward.toString();
        this.onUpdateMembers(this.tabGroup.Selected);
    }

    public stopAnimIfPlaying() {
        if (this.m_start && this.m_ucDrawIndex < 0) {
            this.m_ucDrawIndex = 4;
        }
    }

    public onUpdateMoney() {
        this.scoreText.text = G.DataMgr.heroData.xyzpBonus.toString();
        this.currencyBar.setPrice(G.DataMgr.getOwnValueByID(KeyWord.MONEY_YUANBAO_ID));
    }

    private onUpdateMembers(index: number) {
        if (index == 0) {
            let members = G.DataMgr.luckyWheelData.members;
            this.bonusMembers.Count = members.length;
            for (let i = 0, len = members.length; i < len; i++) {
                let member = members[i];
                let obj = this.bonusMembers.GetItem(i);
                let name = obj.findText("name");
                let item = obj.findText("item");
                name.text = member.m_szNickName;
                let str = "";
                if (GameIDUtil.isSpecialID(member.m_uiItemID)) {
                    str += KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, member.m_uiItemID);
                }
                else {
                    let thingConfig = ThingData.getThingConfig(member.m_uiItemID);
                    if (thingConfig == null) {
                        uts.logWarning(member.m_uiItemID.toString());
                    }
                    str = TextFieldUtil.getColorText(thingConfig.m_szName, Color.getColorById(thingConfig.m_ucColor));
                }

                if (member.m_uiItemCount > 1) {
                    str += "*" + member.m_uiItemCount;
                }
                if (member.m_ucLevel > 0 && member.m_ucLevel != 4) {
                    str += TextFieldUtil.getColorText(uts.format("({0}等奖)", TextFieldUtil.NUMBER_LIST[member.m_ucLevel]), Color.RED);
                }
                item.text = str;
            }
        }
        else {
            let members = G.DataMgr.luckyWheelData.membersSelf;
            this.bonusMembers.Count = members.length;
            for (let i = 0, len = members.length; i < len; i++) {
                let member = members[i];
                let obj = this.bonusMembers.GetItem(i);
                let name = obj.findText("name");
                let item = obj.findText("item");
                name.text = "您";
                let str = "";
                if (GameIDUtil.isSpecialID(member.m_uiItemID)) {
                    str += KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, member.m_uiItemID);
                }
                else {
                    let thingConfig = ThingData.getThingConfig(member.m_uiItemID);
                    if (thingConfig == null) {
                        uts.logWarning(member.m_uiItemID.toString());
                    }
                    str = TextFieldUtil.getColorText(thingConfig.m_szName, Color.getColorById(thingConfig.m_ucColor));
                }

                if (member.m_uiItemCount > 1) {
                    str += "*" + member.m_uiItemCount;
                }
                if (member.m_ucLevel > 0 && member.m_ucLevel != 4) {
                    str += TextFieldUtil.getColorText(uts.format("({0}等奖)", TextFieldUtil.NUMBER_LIST[member.m_ucLevel]), Color.RED);
                }
                item.text = str;
            }
        }
        this.bonusMembers.ScrollBottom();
    }
}