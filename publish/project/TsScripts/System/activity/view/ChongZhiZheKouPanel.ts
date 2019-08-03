import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { List, ListItem } from 'System/uilib/List'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { IconItem } from 'System/uilib/IconItem'
import { DataFormatter } from 'System/utils/DataFormatter'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { MessageBoxConst } from 'System/tip/TipManager'
import { TipFrom } from 'System/tip/view/TipsView'
import { ElemFinder } from 'System/uilib/UiUtility'
import { BagView } from 'System/bag/view/BagView'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIUtils } from 'System/utils/UIUtils'
import { VipView, VipTab } from "System/vip/VipView";
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'



export class ChongZhiZheKouPanel extends TabSubForm {

   

    private txtActivityTime: UnityEngine.UI.Text;
    private txtContent: UnityEngine.UI.Text;

    private btnGet: UnityEngine.GameObject;
    private btnGoto: UnityEngine.GameObject;
    private bigEffect: UnityEngine.GameObject;
   // private txtBtn: UnityEngine.UI.Text;
    private txtCurCost: UnityEngine.UI.Text;
    private txtCount: UnityEngine.UI.Text;

    private endTime: number = 0;
    private zeroTime: number = 0;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_CHONGZHIZHEKOU);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.ChongZhiZheKouPanel;
    }

    protected initElements() {

        this.txtActivityTime = this.elems.getText("txtActivityTime");
        this.txtContent = this.elems.getText("txtContent");

        this.btnGet = this.elems.getElement("btnGet");
        this.btnGoto = this.elems.getElement("btnGoto");
        this.bigEffect = this.elems.getElement("bigEffect");
        this.txtCurCost = this.elems.getText("txtCurCost");
        this.txtCount = this.elems.getText("txtCount");

    }

    protected initListeners() {

        this.addClickListener(this.btnGet, this.onClickGet); 
        this.addClickListener(this.btnGoto, this.onClickGoToPay);
        this.addClickListener(this.elems.getElement("btnRule"), this.onClickBtnRule);
    }


    protected onOpen() {
        this.endTime = G.DataMgr.activityData.getActivityEndTime(Macros.ACTIVITY_ID_HJXN_CHARGE)
        this.updateZeroTime();
        this.addTimer("leichong", 1000, 0, this.onTimerZero);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HJXN_CHARGE , Macros.ACTIVITY_HJXN_CHARGE_PANNEL));

    }

    private onClickBtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(435), '活动规则');
    }

    private onClickGet() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_HJXN_CHARGE, Macros.ACTIVITY_HJXN_CHARGE_REWARD));
    }

    private onClickGoToPay() {
        G.Uimgr.createForm<VipView>(VipView).open(VipTab.ChongZhi);
    }


    private updateZeroTime(): void {
        this.zeroTime = this.endTime - G.SyncTime.getCurrentTime() / 1000;
        this.onTimerZero();
    }

    private onTimerZero(): void {
        this.zeroTime--;
        if (this.zeroTime > 0) {
            this.txtActivityTime.text = "活动结束倒计时：" + TextFieldUtil.getColorText(DataFormatter.second2day(this.zeroTime), Color.GREEN);
        }
        else {
            this.txtActivityTime.text = "";
        }
    }


    updatePanel() {
        let activityData = G.DataMgr.activityData;
        this.txtCurCost.text = "当前活动累充：" + TextFieldUtil.getColorText(activityData.getChongZhiZheKouValue.toString(), Color.GREEN);
       

        this.txtCount.text = "可领取次数：" + TextFieldUtil.getColorText(activityData.isCZZKCanGetRewardCount().toString(), Color.GREEN);

        let canGet = activityData.isCZZKCanGetRewardCount()>0;
        this.btnGet.SetActive(canGet);
        this.btnGoto.SetActive(!canGet);
        this.bigEffect.SetActive(canGet);
    }
}

