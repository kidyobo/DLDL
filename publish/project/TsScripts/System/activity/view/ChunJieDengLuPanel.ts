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
import { NewYearBasePanel, NewYearRewardBase } from 'System/activity/view/NewYearBasePanel';
import { VipView, VipTab } from 'System/vip/VipView';
import { ElemFinder } from 'System/uilib/UiUtility'
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { List, ListItem } from 'System/uilib/List'

export class ChunJieDengLuPanel extends CommonForm {

    protected txtActivityTime: UnityEngine.UI.Text;
    protected newYearVipItem: ChunJieLoginItem[] = [];
    protected list: List;

    private isActivityOpen = false;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_DENGRUJIANGLI);
    }

    protected resPath(): string {
        return UIPathData.ChunJieDengLu;
    }

    protected initElements() {
        super.initElements();
        this.list = this.elems.getUIList("list");
        this.txtActivityTime = this.elems.getText("txtActivityTime");

    }

    protected initListeners() {

    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SPRING_LOGIN, Macros.ACTIVITY_SPRING_LOGIN_PANEL));
        //super.onOpen();
        this.isActivityOpen = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_SPRING_LOGIN);
        this.onCountDownTimer();
        this.addTimer("1", 1000, 0, this.onCountDownTimer);
        this.updatePanel();
    }



    updatePanel(): void {
        let info = G.DataMgr.activityData.newYearData.cjLoginInfo;
        if (info == null) return;
        let data = info.m_stGetCfgList;
        this.list.Count = info.m_ucItemCount;
        for (let i = 0; i < this.list.Count; i++) {
            if (this.newYearVipItem[i] == null) {
                let item = this.list.GetItem(i);
                this.newYearVipItem[i] = new ChunJieLoginItem();
                this.newYearVipItem[i].setComponent(item.gameObject, data[i].m_iItemCount);
            }
            this.newYearVipItem[i].update(data[i]);
        }
    }


    private onCountDownTimer() {
        let activityData = G.DataMgr.activityData;
        let oldActivityOpen = this.isActivityOpen;
        this.isActivityOpen = activityData.isActivityOpen(Macros.ACTIVITY_ID_SPRING_LOGIN);
        if (oldActivityOpen != this.isActivityOpen) {
            this.updatePanel();
        }
        if (this.isActivityOpen) {
            let status = activityData.getActivityStatus(Macros.ACTIVITY_ID_SPRING_LOGIN);
            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            let time = Math.max(0, status.m_iEndTime - now);
            this.txtActivityTime.text = uts.format('活动剩余时间：{0}', DataFormatter.second2day(time));
        } else {
            this.txtActivityTime.text = '活动剩余时间：已结束';
        }
    }
}

class ChunJieLoginItem extends NewYearRewardBase {

    private config: Protocol.LoginChargeActCfg_Server;
    private titleLogin: UnityEngine.GameObject;

    setComponent(go: UnityEngine.GameObject, count: number) {
        this.titleLogin = ElemFinder.findObject(go, "bg/titleLogin");
        super.setComponent(go, count);
    }

    update(config: Protocol.LoginChargeActCfg_Server) {

        this.titleVip.SetActive(false);
        this.titleLeiChong.SetActive(false);
        this.titleStage.SetActive(false);
        this.titleLogin.SetActive(true);

        this.config = config;

        for (let i = 0, len = config.m_iItemCount; i < len; i++) {
            this.iconItems[i].updateById(config.m_stItemList[i].m_iID, config.m_stItemList[i].m_iCount);
            this.iconItems[i].updateIcon();
        }

        this.txtCondition.text = uts.format("第{0}天", config.m_iCondition2);

        this.btnGetReward.SetActive(true);
        this.btnGoto.SetActive(false);

        let info = G.DataMgr.activityData.newYearData.cjLoginInfo;
        let btnStatus = (1 << (config.m_iID - 1) & info.m_uiLoginRewardFlag) > 0;
        if (btnStatus) {
            this.txtBtn.text = "已领取";
            UIUtils.setButtonClickAble(this.btnGetReward, false);
        } else {
            if (info.m_iLoginDay >= config.m_iCondition2) {
                this.txtBtn.text = "可领取";
                UIUtils.setButtonClickAble(this.btnGetReward, true);

            }
            else {
                this.txtBtn.text = "未达成";
                UIUtils.setButtonClickAble(this.btnGetReward, false);
            }
        }
    }

    dispose() {
        super.dispose();
    }

    protected toDoGetRewrad() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_SPRING_LOGIN, Macros.ACTIVITY_SPRING_LOGIN_REWARD, KeyWord.ACTIVITY_SPRING_LOGIN, this.config.m_iID));
    }

    protected toGoTo() {
        G.Uimgr.createForm<VipView>(VipView).open(VipTab.Reward);
    }

}

