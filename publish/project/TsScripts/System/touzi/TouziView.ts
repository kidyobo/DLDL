import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { TabForm } from "System/uilib/TabForm"
import { UIPathData } from "System/data/UIPathData"
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { FightTZPanel } from './FightTZPanel';
import { YuanBaoTZPanel } from './YuanBaoTZPanel';
import { BossTZPanel } from './BossTZPanel';
import { ActivityData } from '../data/ActivityData';
import { VipTab } from '../vip/VipView';

//该面板为其他子面板的父面板
export class TouziView extends TabForm {

    constructor() {
        super(KeyWord.ACT_FUNCTION_TOUZILICAI, YuanBaoTZPanel, FightTZPanel, BossTZPanel);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.TouziView;
    }

    protected initElements(): void {
        super.initElements();
    }

    protected initListeners(): void {
        super.initListeners();
    }

    protected onOpen() {
        G.Uimgr.closeMainView();

        let today = G.SyncTime.getDateAfterStartServer();
        let funcLimitData = G.DataMgr.funcLimitData;
        let idLen = this.tabIds.length;
        for (let i = 0; i < idLen; i++) {
            let funId = this.tabIds[i];
            // 先判断页签功能是否开启
            let isShow = funcLimitData.isFuncEntranceVisible(funId);
            //投资计划的页签
            isShow = this.checkTZStatus(today);
            this.tabGroup.GetToggle(i).gameObject.SetActive(isShow);
        }

        //投资相关
        this.updateTabAngle();
        this.switchTabForm(0);
        this.tabGroup.Selected = 0;
    }

    protected onClose() {
        super.onClose();
        G.Uimgr.openMainView();
    }

    /////////////////////////////投资面板//////////////////////////////////////////
    //VipTab.BossTZ 这些东西在vipview面板里，这个面板是从那里分离出来的。。。
    /**更新小原点显示*/
    private updateTabAngle(): void {
        this.setTabTipMarkById(KeyWord.SEVEN_DAY_FUND_TYPE_1, G.DataMgr.activityData.sevenDayOneTypeCanShowTip(KeyWord.SEVEN_DAY_FUND_TYPE_1));
        this.setTabTipMarkById(KeyWord.SEVEN_DAY_FUND_TYPE_2, G.DataMgr.activityData.sevenDayOneTypeCanShowTip(KeyWord.SEVEN_DAY_FUND_TYPE_2));
        this.setTabTipMarkById(KeyWord.SEVEN_DAY_FUND_TYPE_3, G.DataMgr.activityData.sevenDayOneTypeCanShowTip(KeyWord.SEVEN_DAY_FUND_TYPE_3));
    }

    updateTzPanel() {
        this.updateTabAngle();
        let bossTZView = this.getTabFormByID(KeyWord.SEVEN_DAY_FUND_TYPE_1) as BossTZPanel;
        if (bossTZView.isOpened) {
            bossTZView.updatePanel();
        }

        let yuanBaoTZView = this.getTabFormByID(KeyWord.SEVEN_DAY_FUND_TYPE_2) as YuanBaoTZPanel;
        if (yuanBaoTZView.isOpened) {
            yuanBaoTZView.updatePanel();
        }

        let fightTZView = this.getTabFormByID(KeyWord.SEVEN_DAY_FUND_TYPE_3) as FightTZPanel;
        if (fightTZView.isOpened) {
            fightTZView.updatePanel();
        }
    }

    private checkTZStatus(today: number): boolean {
        let tzjhInfo = G.DataMgr.activityData.sevenDayFundData;
        if (tzjhInfo.m_ucNumber == 0) {
            if (today <= Macros.MAX_JUHSA_ACT_DAY) {
                return true;
            }
        } else {
            if (G.DataMgr.activityData.sevenDayHaveTipMarkCanShow()) {
                return true;
            } else {
                if (today > Macros.MAX_JUHSA_ACT_DAY) {
                    for (let i = 1; i <= ActivityData.sevenDayTypeCount; i++) {
                        let hasTZData = G.DataMgr.activityData.getSevenDayTZDataByType(i);
                        if (hasTZData != null && hasTZData.m_uiGetFlag != 127) {
                            return true;
                        }
                    }
                } else {
                    return true;
                }
            }
        }
        return false;
    }

}
export default TouziView;