

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



export abstract class NewYearBasePanel extends TabSubForm {

    protected list: List;
    protected zeroTime: number = 0;
    protected mergeDay: number = 0;
    /**活动时间*/
    protected txtActivityTime: UnityEngine.UI.Text;
    protected txtContent: UnityEngine.UI.Text;
    protected type1: UnityEngine.GameObject;
    protected type2: UnityEngine.GameObject;
    protected type3: UnityEngine.GameObject;

    protected endTime: number;

    /**条件说明*/
    protected txtCondition: UnityEngine.UI.Text;
    /**奖励列表*/
    protected rewardList: List;
    /**领取按钮*/
    protected btnGetReward: UnityEngine.GameObject;
    /**前往达成*/
    protected btnGoto: UnityEngine.GameObject;
    /**按钮文本*/
    protected txtBtn: UnityEngine.UI.Text;

    protected iconGame: UnityEngine.GameObject;

    protected titleOnline: UnityEngine.GameObject;
    protected titleLeiXiao: UnityEngine.GameObject;
    protected titleLeiChong: UnityEngine.GameObject;

    private oldItem: number = 0;
    private iconItem: IconItem[] = [];
    constructor(id) {
        super(id);
    }

    protected initElements() {
        this.list = this.elems.getUIList("list");
        this.txtActivityTime = this.elems.getText("txtActivityTime");
        this.txtContent = this.elems.getText("txtContent");

    }

    protected initListeners() {

    }


    protected onOpen() {
       // this.endTime = G.DataMgr.activityData.getActivityEndTime(Macros.ACTIVITY_ID_HJXN)

        this.updateZeroTime();
        this.addTimer("leichong", 1000, 0, this.onTimerZero);
    }

    protected updatePanel() {

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

}

export abstract class NewYearRewardBase {
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

    protected titleVip: UnityEngine.GameObject;
    protected titleStage: UnityEngine.GameObject;
    protected titleLeiChong: UnityEngine.GameObject;

    setComponent(go: UnityEngine.GameObject, count: number) {
        this.txtCondition = ElemFinder.findText(go, "conditionbg/txtCondition");
        this.txtBtn = ElemFinder.findText(go, "btnGetReward/txtBtn");
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, "rewardList"));
        this.btnGetReward = ElemFinder.findObject(go, "btnGetReward");
        this.btnGoto = ElemFinder.findObject(go, "btnGoto");
        this.titleVip = ElemFinder.findObject(go, "bg/titleVip");
        this.titleStage = ElemFinder.findObject(go, "bg/titleStage");
        this.titleLeiChong = ElemFinder.findObject(go, "bg/titleLeiChong");

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

    protected abstract toDoGetRewrad();

    protected abstract toGoTo();
}