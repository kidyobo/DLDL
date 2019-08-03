import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { TabForm } from "System/uilib/TabForm"
import { UIPathData } from "System/data/UIPathData"
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ThingData } from 'System/data/thing/ThingData'
import { LeiChongFanLiView } from 'System/activity/kfhd/LeiChongFanLiView'
import { LeiJiChongZhiView } from 'System/activity/fanLiDaTing/LeiJiChongZhiView'
import { KfhdTeHuiLiBaoPanel } from 'System/activity/kfhd/KfhdTeHuiLiBaoPanel'
import { JjrMrxgPanel } from 'System/jinjieri/JjrMrxgPanel'
import { WzsdPanel } from 'System/activity/fanLiDaTing/WzsdPanel'
import { JjrRewardsPanel } from 'System/jinjieri/JjrRewardsPanel'
import { KfhdData } from 'System/data/KfhdData'
import { VipDailyRewardPanel } from 'System/vip/VipDailyRewardPanel'
import { VipData } from 'System/data/VipData'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'
import { XiaoFeiFanliPanel } from 'System/activity/fanLiDaTing/XiaoFeiFanliPanel'
import { SevenLeiChongView } from 'System/activity/kfhd/SevenLeiChongView'
import { LianChongChuPanel } from 'System/activity/kfhd/LianChongChuPanel'
import { LianChongZhongPanel } from 'System/activity/kfhd/LianChongZhongPanel'
import { LianChongGaoPanel } from 'System/activity/kfhd/LianChongGaoPanel'
import { LianChongBasePanel } from 'System/activity/kfhd/LianChongBasePanel'
import { KaifuActivityData } from 'System/data/KaifuActivityData'


//该面板为其他子面板的父面板
export class AfterSevenDayActView extends TabForm {

    private readonly titltStrs: string[] = ["创世套装","伙伴羁绊"];

    private openTabId: number = 0;
    private subValue: number = 0;
    private week: number = 0;


    private txtTitle: UnityEngine.UI.Text;

    constructor() {
        super(KeyWord.ACT_FUNCTION_7DAYACT, LianChongChuPanel, LianChongZhongPanel, LianChongGaoPanel, SevenLeiChongView, WzsdPanel);
    }

    layer(): UILayer {
        return UILayer.Normal; 
    }

    protected resPath(): string {
        return UIPathData.AfterSevenDayActView;
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.elems.getElement("btnReturn"), this.onBtnReturn);
        this.addClickListener(this.elems.getElement("mask"), this.onBtnReturn);
        this.txtTitle = this.elems.getText("txtTitle");
    }


    open(openTabId: number = 0, subValue: number = 0) {
        this.openTabId = openTabId;
        this.subValue = subValue;
        super.open();
    }


    protected onOpen() {

        //现在只有这一个标题
        let titileStr = "";
        let today = G.SyncTime.getDateAfterStartServer();
        let limitTaoZhuangConfig = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.OTHER_FUNCTION_7DAYACT_TAOZHUANG);
        let limitPetJiPanConfig = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.OTHER_FUNCTION_7DAYACT_PETJIPAN);
        if (today >= limitTaoZhuangConfig.m_ucStartDate && today <= limitTaoZhuangConfig.m_ucEndDate) {
            titileStr = this.titltStrs[0];
        } else if (today >= limitPetJiPanConfig.m_ucStartDate && today <= limitPetJiPanConfig.m_ucEndDate) {
            titileStr = this.titltStrs[1];
        } else {
            titileStr = this.titltStrs[1];
        }
        this.txtTitle.text = titileStr;

        let openSvrDay = G.SyncTime.getDateAfterStartServer() % KaifuActivityData.WeekDayCount;
        // 判断页签显示与否
        let cnt = this.tabIds.length;
        for (let i = 0; i < cnt; i++) {
            let isShow = G.DataMgr.funcLimitData.isFuncAvailable(this.tabIds[i]);
            let funcId = this.tabIds[i];
            if (isShow) {
                if (funcId == KeyWord.OTHER_FUNCTION_KFLIANCHONGCHU ||
                    funcId == KeyWord.OTHER_FUNCTION_KFLIANCHONGZHONG ||
                    funcId == KeyWord.OTHER_FUNCTION_KFLIANCHONGGAO) {
                    //连冲返利
                    let type = LianChongBasePanel.panelKeyWords.indexOf(this.tabIds[i]) + 1;
                    this.week = G.DataMgr.kaifuActData.kfLCFLInfo.m_iWeek;
                    this.week = this.week > KaifuActivityData.MaxWeekLianChongFanLi ? 0 : this.week;
                    let startEndTimeArroy = G.DataMgr.kaifuActData.getStartAndEndTime(this.week, type);
                    openSvrDay = openSvrDay == 0 ? KaifuActivityData.WeekDayCount : openSvrDay;
                    let inStartAndEndTime = openSvrDay >= startEndTimeArroy[0] && openSvrDay <= startEndTimeArroy[1];
                    isShow = inStartAndEndTime || (funcId == KeyWord.OTHER_FUNCTION_KFLIANCHONGCHU && openSvrDay >= startEndTimeArroy[0]);
                }
                else if ( KeyWord.OTHER_FUNCTION_7DAYLEICHONG == funcId) {
                    //7日累充后7天
                    isShow = (G.SyncTime.getDateAfterStartServer() > KaifuActivityData.WeekDayCount);
                }
                else if (KeyWord.OTHER_FUNCTION_WZSD == funcId)
                {
                    //五折商店8到14天
                    isShow = (G.SyncTime.getDateAfterStartServer() > 7 && G.SyncTime.getDateAfterStartServer() <= 21);
                }
            } 
            this.tabGroup.GetToggle(i).gameObject.SetActive(isShow);
        }

        //打开指定tab页
        this.switchTabFormById(this.openTabId, this.subValue);


        //刷新小红点
        this.update7DayTipMark();

    }
    protected onClose() {

    }



    private onBtnReturn(): void {
        this.close();
    }



    //////////////////////////连充返利/////////////////////////

    onUpdateLCFLPanel() {
        let currentForm = this.getCurrentTab();
        if (currentForm != null && currentForm.isOpened) {
            let view = currentForm as LianChongBasePanel;
            if (view.updateView) {
                view.updateView();
            }
        }
        this.updateLCFLTipMark();
    }

    private updateLCFLTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_KFLIANCHONGCHU, G.DataMgr.kaifuActData.canShowTipMarkByType(this.week, 1));
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_KFLIANCHONGZHONG, G.DataMgr.kaifuActData.canShowTipMarkByType(this.week, 2));
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_KFLIANCHONGGAO, G.DataMgr.kaifuActData.canShowTipMarkByType(this.week, 3));
    }


    //////////////////////////////////////////7日累充值//////////////////////////
    onUpdate7DayLeiChongPanel() {
        //  this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_XIAOFEIFANLI, G.DataMgr.kaifuActData.isShowXFFLTipMark());
        let view = this.getTabFormByID(KeyWord.OTHER_FUNCTION_7DAYLEICHONG) as SevenLeiChongView;
        if (view != null && view.isOpened) {
            view.updateView();
        }
        this.update7DayTipMark();
    }

    private update7DayTipMark() {
        this.setTabTipMarkById(KeyWord.OTHER_FUNCTION_7DAYLEICHONG, TipMarkUtil.sevenDayLeiChongReward(false));
    }

    /////////////////////////////五折商店//////////////////////////////////////
    onSellLimitDataChange()
    {
        let wzsdPanel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_WZSD) as WzsdPanel;
        if (wzsdPanel.isOpened)
        {
            wzsdPanel.onSellLimitDataChange();
        } 
    }


}
export default AfterSevenDayActView;