import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ActivityData } from 'System/data/ActivityData'
import { DropPlanData } from 'System/data/DropPlanData'
import { EnumTzjhRule } from 'System/touzi/EnumTzjhRule'
import { Macros } from 'System/protocol/Macros'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { TzjhGetItemData } from 'System/data/TzjhGetItemData'
import { KeyWord } from 'System/constants/KeyWord'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { FixedList } from 'System/uilib/FixedList'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { UIUtils } from 'System/utils/UIUtils'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { Color } from 'System/utils/ColorUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { SpecialCharUtil } from 'System/utils/SpecialCharUtil'
import { PayView } from 'System/pay/PayView'
import { TabForm } from "System/uilib/TabForm"
import { BossTZPanel } from "System/touzi/BossTZPanel"
import { YuanBaoTZPanel } from "System/touzi/YuanBaoTZPanel"
import { FightTZPanel } from "System/touzi/FightTZPanel"
import { EnumGuide } from 'System/constants/GameEnum'





export class TzjhGetView extends TabForm {

    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;
    private openTabId: number = 0;

    constructor() {
        super(KeyWord.ACT_FUNCTION_TOUZILICAI, FightTZPanel, YuanBaoTZPanel, BossTZPanel);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.TzjhGetView;
    }

    protected initElements() {
        super.initElements();
        this.mask = this.elems.getElement("mask");
        this.btnClose = this.elems.getElement("btnClose");
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.mask, this.onClickClose);
        this.addClickListener(this.btnClose, this.onClickClose);
    }

    open(openTabId: number = 0) {
        this.openTabId = openTabId;
        super.open();
    }

    protected onOpen() {
        // 选中指定的页签
        this.switchTabFormById(this.openTabId);
        this.updateTabAngle();

        G.GuideMgr.processGuideNext(EnumGuide.CommonOpenView, EnumGuide.CommonOpenView_OpenView);
    }

    protected onClose() {
        G.GuideMgr.processGuideNext(EnumGuide.CommonOpenView, EnumGuide.GuideCommon_None);
    }

    private onClickClose() {
        this.close();
    }

    /**更新小原点显示*/
    public updateTabAngle(): void {
        this.setTabTipMarkById(KeyWord.SEVEN_DAY_FUND_TYPE_1, G.DataMgr.activityData.sevenDayOneTypeCanShowTip(KeyWord.SEVEN_DAY_FUND_TYPE_1));
        this.setTabTipMarkById(KeyWord.SEVEN_DAY_FUND_TYPE_2, G.DataMgr.activityData.sevenDayOneTypeCanShowTip(KeyWord.SEVEN_DAY_FUND_TYPE_2));
        this.setTabTipMarkById(KeyWord.SEVEN_DAY_FUND_TYPE_3, G.DataMgr.activityData.sevenDayOneTypeCanShowTip(KeyWord.SEVEN_DAY_FUND_TYPE_3));
    }


    updatePanel() {
        this.updateTabAngle();
        let bossTZView = this.getTabFormByID(KeyWord.SEVEN_DAY_FUND_TYPE_1) as BossTZPanel;
        if (bossTZView.isOpened) {
            bossTZView.updatePanel();
        }

        let yuanBaoTZView = this.getTabFormByID(KeyWord.SEVEN_DAY_FUND_TYPE_2) as BossTZPanel;
        if (yuanBaoTZView.isOpened) {
            yuanBaoTZView.updatePanel();
        }

        let fightTZView = this.getTabFormByID(KeyWord.SEVEN_DAY_FUND_TYPE_3) as BossTZPanel;
        if (fightTZView.isOpened) {
            fightTZView.updatePanel();
        }
    }

}
