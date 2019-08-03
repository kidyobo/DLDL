import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { List, ListItem } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { KaifuSignItemData } from 'System/data/vo/KaifuSignItemData'
import { UIUtils } from 'System/utils/UIUtils'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { ThingData } from 'System/data/thing/ThingData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { MathUtil } from "System/utils/MathUtil"
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { PayView } from 'System/pay/PayView'
import { MallView } from 'System/business/view/MallView'
import { EnumStoreID } from 'System/constants/GameEnum'
import { DataFormatter } from 'System/utils/DataFormatter'
import { VipTab, VipView } from "System/vip/VipView"


class QMHQRewardItem {
    private txtCondition: UnityEngine.UI.Text;
    private txtBtnLabel: UnityEngine.UI.Text;
    private btnGet: UnityEngine.GameObject;
    private rewardList: List;
    private iconItems: IconItem[] = [];
    private data: GameConfig.HiPointConfigConfigM;

    setComponents(go: UnityEngine.GameObject) {
        this.txtCondition = ElemFinder.findText(go, "titlebg/txtCondition");
        this.txtBtnLabel = ElemFinder.findText(go, "btnGet/txtBtnLabel");
        this.btnGet = ElemFinder.findObject(go, "btnGet");
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, "reward/rewardList"));

        Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onClickGet);
    }

    update(data: GameConfig.HiPointConfigConfigM) {
        this.data = data;
        this.txtCondition.text = uts.format("{0} 嗨点可领取", TextFieldUtil.getColorText(data.m_icCondition.toString(), Color.GREEN));
        //奖励的图标列表
        this.rewardList.Count = data.m_iItemCount;
        for (let i = 0; i < this.rewardList.Count; i++) {
            if (this.iconItems[i] == null) {
                let item = this.rewardList.GetItem(i).gameObject;
                this.iconItems[i] = new IconItem();
                this.iconItems[i].setTipFrom(TipFrom.normal);
                this.iconItems[i].setUsuallyIcon(item);
            }
            this.iconItems[i].updateById(data.m_stRewordList[i].m_iItemID, data.m_stRewordList[i].m_iItemCount);
            this.iconItems[i].updateIcon();
        }

        let qMHDActPanelInfo = G.DataMgr.activityData.qMHDActPanelInfo;
        if (!qMHDActPanelInfo) {
            UIUtils.setButtonClickAble(this.btnGet, false);
            this.txtBtnLabel.text = "未达成";
            return;
        }

        let hasGet = MathUtil.checkPosIsReach(data.m_iID - 1, qMHDActPanelInfo.m_uiBitFlag);
        if (hasGet) {
            UIUtils.setButtonClickAble(this.btnGet, false);
            this.txtBtnLabel.text = "已领取";
        } else if (qMHDActPanelInfo.m_uiHDDegree >= data.m_icCondition) {
            UIUtils.setButtonClickAble(this.btnGet, true);
            this.txtBtnLabel.text = "可领取";
        } else {
            UIUtils.setButtonClickAble(this.btnGet, false);
            this.txtBtnLabel.text = "未达成";
        }
    }


    private onClickGet() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_QMHD, Macros.ACTIVITY_QMHD_REWARD, this.data.m_iID));
    }


}


class QMHQConditionData {
    cfg: GameConfig.AllPeopleHiConfigM;
    hasCompleteCount: number = 0;
    allCount = 0;
    /**已经完成*/
    hasOver: boolean = false;
}


class QMHQConditionItem {

    private btnGoto: UnityEngine.GameObject;
    private imgIcon: UnityEngine.UI.Image; 
    private txtCondition: UnityEngine.UI.Text; 
    private txtTime: UnityEngine.UI.Text;
    private txtCanGet: UnityEngine.UI.Text;

    private data: GameConfig.AllPeopleHiConfigM;
    private atals: Game.UGUIAltas;

    setComponents(go: UnityEngine.GameObject, atals: Game.UGUIAltas) {
        this.atals = atals;
        this.btnGoto = ElemFinder.findObject(go, "btnGoto");
        this.imgIcon = ElemFinder.findImage(go, "imgIcon"); 
        this.txtCondition = ElemFinder.findText(go, "txtCondition");
        this.txtCanGet = ElemFinder.findText(go, "txtCanGet");
        this.txtTime = ElemFinder.findText(go, "txtTime");
        Game.UIClickListener.Get(this.btnGoto).onClick = delegate(this, this.onClickGoto);

    }

    update(data: QMHQConditionData) {
        this.data = data.cfg;
        this.txtCondition.text = uts.format(RegExpUtil.xlsDesc2Html(this.data.m_iKeywordsDesc), this.data.m_uiTimes);
        this.txtTime.text = data.hasCompleteCount + "/" + data.allCount;
        this.txtCanGet.text = uts.format("获得嗨点{0}", TextFieldUtil.getColorText(this.data.m_ucGiveAct.toString(), Color.GREEN));
        UIUtils.setButtonClickAble(this.btnGoto, data.hasCompleteCount < data.allCount);
        this.imgIcon.sprite = this.atals.Get(this.data.m_iID.toString());
    }


    private onClickGoto() {

        let type = this.data.m_ucType;
        if (type == KeyWord.ACT_QMHD_TOATLE_CHARGE) {
            G.Uimgr.createForm<VipView>(VipView).open(VipTab.ChongZhi);
        }
        else if (type == KeyWord.ACT_QMHD_SHANGCHENG_CONSUME) {
            //消费
            G.Uimgr.createForm<MallView>(MallView).open(this.data.m_iFuncID);
        }


        else {
            G.ActionHandler.executeFunction(this.data.m_iFuncID);
        }

    }

}

export class QuanMingHaiQiPanel extends TabSubForm {

    private txtTime: UnityEngine.UI.Text;
    private txtNum: UnityEngine.UI.Text;
    private txtTodayHas: UnityEngine.UI.Text;
    private txtAllNum: UnityEngine.UI.Text;

    /**左侧的奖励list*/
    private leftList: List;
    /**右侧的完成条件list*/
    private rigthList: List;
    private atals: Game.UGUIAltas;

    private qMHQRewardItems: QMHQRewardItem[] = [];
    private qMHQConditionItems: QMHQConditionItem[] = [];

    private qMHQConditionDatas: QMHQConditionData[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_QUANMING_HAIQI);
    }

    protected resPath(): string {
        return UIPathData.QuanMingHaiQiPanel;
    }


    protected initElements() {
        this.txtTime = this.elems.getText("txtTime");
        this.txtNum = this.elems.getText("txtNum");
        this.txtTodayHas = this.elems.getText("txtTodayHas");
        this.txtAllNum = this.elems.getText("txtAllNum");

        this.leftList = this.elems.getUIList("leftList");
        this.rigthList = this.elems.getUIList("rigthList");

        this.atals = this.elems.getUGUIAtals("atals");
    }

    protected initListeners() {

    }


    protected onOpen() {

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_QMHD, Macros.ACTIVITY_QMHD_PANEL));       
        this.onCountDownTimer();
        this.addTimer("1", 1000, 0, this.onCountDownTimer);
    }


    protected onClose() {

    }

    private onCountDownTimer() {
        let activityData = G.DataMgr.activityData;
        let isActivityOpen = activityData.isActivityOpen(Macros.ACTIVITY_ID_QMHD);
        if (isActivityOpen) {
            let status = activityData.getActivityStatus(Macros.ACTIVITY_ID_QMHD);
            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            let time = Math.max(0, status.m_iEndTime - now);
            this.txtTime.text = uts.format('活动剩余时间：{0}', DataFormatter.second2day(time));
        } else {
            this.txtTime.text = '活动剩余时间：已结束';
        }
    }

    updatePanel() {
        this.qMHQConditionDatas = [];
        let activityData = G.DataMgr.activityData;
        let rewardCfgs = activityData.hiPointRewardCfgs;
        //左侧的奖励列表
        this.leftList.Count = rewardCfgs.length;
        for (let i = 0; i < this.leftList.Count; i++) {
            if (this.qMHQRewardItems[i] == null) {
                let item = this.leftList.GetItem(i).gameObject;
                this.qMHQRewardItems[i] = new QMHQRewardItem();
                this.qMHQRewardItems[i].setComponents(item);
            }
            this.qMHQRewardItems[i].update(rewardCfgs[i]);
        }

        //右侧的条件列表
        let conditionCfgs = activityData.allPeopleHiCfgs;
        let qMHDActPanelInfo = activityData.qMHDActPanelInfo;

        for (let i = 0; i < conditionCfgs.length; i++) {
            let tmpData = new QMHQConditionData();
            let cfg = conditionCfgs[i];
            tmpData.cfg = cfg;
            if (cfg.m_ucType == KeyWord.ACT_QMHD_TOATLE_CHARGE) {
                //充值
                tmpData.hasCompleteCount = qMHDActPanelInfo && qMHDActPanelInfo.m_iChargeValue >= cfg.m_uiTimes ? 1 : 0;
                tmpData.allCount = 1;
               
            }
            else if (cfg.m_ucType == KeyWord.ACT_QMHD_TOATLE_SONSUME) {
                //消费
                tmpData.hasCompleteCount = qMHDActPanelInfo && qMHDActPanelInfo.m_iConsumeValue >= cfg.m_uiTimes ? 1 : 0;
                tmpData.allCount  = 1;
            } else {
                tmpData.hasCompleteCount = activityData.getQMHDCount(cfg.m_iID);
                tmpData.allCount = cfg.m_uiTimes;
            }
            tmpData.hasOver = tmpData.hasCompleteCount >= tmpData.allCount;
            this.qMHQConditionDatas.push(tmpData);
        }


        this.qMHQConditionDatas.sort(delegate(this,this.sortConditionCfg))

        this.rigthList.Count =  this.qMHQConditionDatas.length;
        for (let i = 0; i < this.rigthList.Count; i++) {
            if (this.qMHQConditionItems[i] == null) {
                let item = this.rigthList.GetItem(i).gameObject;
                this.qMHQConditionItems[i] = new QMHQConditionItem();
                this.qMHQConditionItems[i].setComponents(item, this.atals);
            }
            this.qMHQConditionItems[i].update(this.qMHQConditionDatas[i]);

        }

      
        let num = 0;
        let str = "";
        if (qMHDActPanelInfo) {
            num = qMHDActPanelInfo.m_uiHDDegree;
            str = uts.format("充值金额: {0}       消费金额: {1}  ",
                TextFieldUtil.getColorText(qMHDActPanelInfo.m_iChargeValue.toString(), Color.GREEN),
                TextFieldUtil.getColorText(qMHDActPanelInfo.m_iConsumeValue.toString(), Color.GREEN));
        }
        this.txtAllNum.text = uts.format("嗨点: {0}", TextFieldUtil.getColorText(num.toString(), Color.GREEN));
        this.txtNum.text = str;
       
        
    }


    private sortConditionCfg(a: QMHQConditionData, b: QMHQConditionData) {

        let statusA = 0;
        if (!a.hasOver) {
            statusA = 2;
        }

        let statusB = 0;
        if (!b.hasOver) {
            statusB = 2;
        }

        if (statusB != statusA) {
            return statusB - statusA;
        }

        return a.cfg.m_iID - b.cfg.m_iID;
    }

}