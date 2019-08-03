import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ThingData } from 'System/data/thing/ThingData'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { IconItem } from 'System/uilib/IconItem'
import { UIUtils } from 'System/utils/UIUtils'
import { TipFrom } from 'System/tip/view/TipsView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { List, ListItem } from 'System/uilib/List'
import { ConfirmCheck } from 'System/tip/TipManager'
import { BagView } from 'System/bag/view/BagView'
import { MessageBoxConst } from 'System/tip/TipManager'
import { CommonForm, UILayer } from "System/uilib/CommonForm";



export class SpringLeiJiChongZhiView extends TabSubForm {

    private cjhdLeiJiChongZhitem: cjhdLeiJiChongZhiItem[] = [];

    private configs: Protocol.LoginChargeActCfg_Server[] = [];
    private cfgs: Protocol.SpringChargeActRsp;
    /**活动时间*/
    protected txtActivityTime: UnityEngine.UI.Text;
    protected endTime: number;
    protected zeroTime: number = 0;
    private isActivityOpen = false;
    protected txtContent: UnityEngine.UI.Text;
    protected list: List;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_LEIJICHONGZHI);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.cjhdLeiJiChongZhiView;
    }

    protected initElements() {
        this.list = this.elems.getUIList("list");
        this.txtActivityTime = this.elems.getText("txtActivityTime");
        this.txtContent = this.elems.getText("txtContent");


    }

    protected initListeners() {

    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SPRING_CHARGE, Macros.ACTIVITY_SPRING_CHARGE_PANEL));
        this.isActivityOpen = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_SPRING_CHARGE);
        this.cfgs = G.DataMgr.activityData.newYearData.cjinfo;

        this.onCountDownTimer();
        this.addTimer("1", 1000, 0, this.onCountDownTimer);
        this.updatePanel();
    }

    private onCountDownTimer() {
        let activityData = G.DataMgr.activityData;
        let oldActivityOpen = this.isActivityOpen;
        this.isActivityOpen = activityData.isActivityOpen(Macros.ACTIVITY_ID_SPRING_CHARGE);
        if (oldActivityOpen != this.isActivityOpen) {
            this.updatePanel();
        }
        if (this.isActivityOpen) {
            let status = activityData.getActivityStatus(Macros.ACTIVITY_ID_SPRING_CHARGE);
            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            let time = Math.max(0, status.m_iEndTime - now);
            this.txtActivityTime.text = uts.format('活动剩余时间：{0}',TextFieldUtil.getColorText(DataFormatter.second2day(time).toString(),Color.GREEN));
        } else {
            this.txtActivityTime.text = '活动剩余时间：已结束';
        }
    }

    updatePanel(): void {

        if (this.cfgs == null) return;
        this.list.Count = this.cfgs.m_ucItemCount;
        this.txtContent.text = uts.format("累计充值：{0}钻石",TextFieldUtil.getColorText( this.cfgs.m_iChargeValue.toString(),Color.GREEN));

        for (let i = 0; i < this.list.Count; i++) {
            if (this.cjhdLeiJiChongZhitem[i] == null) {
                let item = this.list.GetItem(i);
                this.cjhdLeiJiChongZhitem[i] = new cjhdLeiJiChongZhiItem();
                this.cjhdLeiJiChongZhitem[i].setComponent(item.gameObject, this.cfgs.m_stGetCfgList[i].m_iItemCount);
            }
            this.cjhdLeiJiChongZhitem[i].update(this.cfgs.m_stGetCfgList[i], this.isActivityOpen);
        }

    }

}

class cjhdLeiJiChongZhiItem {

    private config: Protocol.LoginChargeActCfg_Server;
    /**条件说明*/
    protected txtCondition: UnityEngine.UI.Text;
    /**奖励列表*/
    private rewardList: List;
    /**领取按钮*/
    protected btnGetReward: UnityEngine.GameObject;
    /**前往达成*/
    protected btnGoto: UnityEngine.GameObject;
    /**按钮文本*/
    protected txtBtn: UnityEngine.UI.Text;
    /**图标*/
    protected iconItems: IconItem[] = [];

    private isEnd: boolean = true;

    setComponent(go: UnityEngine.GameObject, count: number) {
        this.txtCondition = ElemFinder.findText(go, "conditionbg/txtCondition");
        this.txtBtn = ElemFinder.findText(go, "btnGetReward/txtBtn");
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, "rewardList"));
        this.btnGetReward = ElemFinder.findObject(go, "btnGetReward");
        this.btnGoto = ElemFinder.findObject(go, "btnGoto");
        this.rewardList.Count = count;

        for (let i = 0; i < this.rewardList.Count; i++) {
            if (this.iconItems[i] == null) {
                let item = this.rewardList.GetItem(i);
                this.iconItems[i] = new IconItem();
                this.iconItems[i].setTipFrom(TipFrom.normal);
                this.iconItems[i].setUsuallyIcon(item.gameObject);
            }
        }

        Game.UIClickListener.Get(this.btnGetReward).onClick = delegate(this, this.onClickGetReward);
        Game.UIClickListener.Get(this.btnGoto).onClick = delegate(this, this.toGoTo);
    }

    update(config: Protocol.LoginChargeActCfg_Server, isEnd: boolean) {
        this.isEnd = isEnd;
        this.config = config;

        for (let i = 0, len = config.m_iItemCount; i < len; i++) {
            let thingData = config.m_stItemList[i];
            this.iconItems[i].updateById(thingData.m_iID, thingData.m_iCount);
            this.iconItems[i].updateIcon();


            this.txtCondition.text = uts.format("{0}钻石", config.m_iCondition1);
            this.btnGetReward.SetActive(true);
            this.btnGoto.SetActive(false);
            this.isBtnActivie(config, isEnd);
        }
    }

    public isBtnActivie(cgf: Protocol.LoginChargeActCfg_Server, isEnd: boolean) {
        let info = G.DataMgr.activityData.newYearData.cjinfo
        if (null != info) {

            let btnStatus = (1 << (cgf.m_iID - 1) & info.m_uiChargeRewardFlag) > 0;
            if (btnStatus) {
                this.txtBtn.text = "已领取";
                UIUtils.setButtonClickAble(this.btnGetReward, false);
            } else {
                if (info.m_iChargeValue >= cgf.m_iCondition1) {
                    this.txtBtn.text = "可领取";
                    UIUtils.setButtonClickAble(this.btnGetReward, true);
                }
                else {
                    this.btnGetReward.SetActive(false);
                    this.btnGoto.SetActive(true);
                }
            }
            if (isEnd == false) {
                UIUtils.setButtonClickAble(this.btnGetReward, false);

            }
        }

    }

    private onClickGetReward() {
        if (G.DataMgr.thingData.isBagFull) {
            G.TipMgr.showConfirm(G.DataMgr.langData.getLang(96), ConfirmCheck.noCheck, '前往背包|取消', delegate(this, this.onGoToBag));
        } else {
            this.toDoGetRewrad();
        }
    }
    private onGoToBag(state: MessageBoxConst = 0, isCheckSelected: boolean = true) {
        if (MessageBoxConst.yes == state) {
            G.Uimgr.createForm<BagView>(BagView).open();
        }
    }

    dispose() {
        this.rewardList.dispose();
    }

    protected toDoGetRewrad() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SPRING_CHARGE, Macros.ACTIVITY_SPRING_CHARGE_REWARD, KeyWord.ACTIVITY_SPRING_CHARGE, this.config.m_iID));

    }

    protected toGoTo() {
        G.ActionHandler.go2Pay();
    }

}

