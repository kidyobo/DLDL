import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { DataFormatter } from 'System/utils/DataFormatter'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { MergeView } from 'System/mergeActivity/MergeView'

export class MergeRewardBase {
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
    /**标题类型*/
    protected titleImg1: UnityEngine.GameObject;
    protected titleImg2: UnityEngine.GameObject;
    protected titleImg3: UnityEngine.GameObject;

    setComponent(go: UnityEngine.GameObject, count: number) {
        this.txtCondition = ElemFinder.findText(go, "conditionbg/txtCondition");
        this.txtBtn = ElemFinder.findText(go, "btnGetReward/txtBtn");
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, "rewardList")); 
        this.btnGetReward = ElemFinder.findObject(go, "btnGetReward");
        this.btnGoto = ElemFinder.findObject(go, "btnGoto");

        this.titleImg1 = ElemFinder.findObject(go, "bg/Image1");
        this.titleImg2 = ElemFinder.findObject(go, "bg/Image2");
        this.titleImg3 = ElemFinder.findObject(go, "bg/Image3");

        this.rewardList.Count = count;
        for (let i = 0; i < this.rewardList.Count; i++) {
            if (this.iconItems[i] == null) {
                let item = this.rewardList.GetItem(i);
                this.iconItems[i] = new IconItem();
                this.iconItems[i].setTipFrom(TipFrom.normal);
                this.iconItems[i].setUsuallyIcon(item.gameObject);
            }
        }
    }

    dispose() {
        this.rewardList.dispose();
    }

}

export abstract class MergePanelBase extends TabSubForm {


    protected list: List;
    protected zeroTime: number = 0;
    protected mergeDay: number = 0;
    /**活动时间*/
    protected txtActivityTime: UnityEngine.UI.Text;
    protected txtContent: UnityEngine.UI.Text;
    protected type1: UnityEngine.GameObject;
    protected type2: UnityEngine.GameObject;
    protected type3: UnityEngine.GameObject;


    protected initElements() {
        this.list = this.elems.getUIList("list");
        this.txtActivityTime = this.elems.getText("txtActivityTime");
        this.txtContent = this.elems.getText("txtContent");
        this.type1 = this.elems.getElement("type1");
        this.type2 = this.elems.getElement("type2");
        this.type3 = this.elems.getElement("type3");

    }

    protected onOpen() {
        this.mergeDay = G.SyncTime.getDateAfterMergeServer();
        this.updateZeroTime();
        this.addTimer("leichong", 1000, 0, this.onTimerZero);
    }

    private updateZeroTime(): void {
        this.zeroTime = G.SyncTime.getServerZeroLeftTime() + (MergeView.MaxActDay - this.mergeDay) * MergeView.ONEDAYSECOND;
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

}