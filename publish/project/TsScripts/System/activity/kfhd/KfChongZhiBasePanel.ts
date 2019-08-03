import { List, ListItem } from "System/uilib/List"
import { TabSubForm } from "System/uilib/TabForm"
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from "System/uilib/UiUtility";
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { IconItem } from "System/uilib/IconItem"
import { TipFrom } from "System/tip/view/TipsView"
import { UIUtils } from "System/utils/UIUtils";
import { Color } from "System/utils/ColorUtil"
import { DataFormatter } from "System/utils/DataFormatter"
import { Global as G } from "System/global"
import { GameObjectGetSet, TextGetSet } from "../../uilib/CommonForm";

export enum KfCzRewardState {
    noReach = 0,
    hasReach = 1,
    allReach = 2,
}

export abstract class KfChongZhiRewardBaseItem {

    protected danBiCzImgObj: GameObjectGetSet;
    protected xunHuanCzImgObj: GameObjectGetSet;
    protected numText: TextGetSet;
    protected rewardList: List;
    protected btnGet: GameObjectGetSet;
    protected btnGetText: TextGetSet;
    protected leftTimeText: TextGetSet;
    protected iconItems: IconItem[] = [];
    protected btnState: number = KfCzRewardState.noReach;
    protected m_id: number = 0;

    setCommponents(item: ListItem) {
        this.danBiCzImgObj = new GameObjectGetSet(item.findObject("backtop/imgDanBi"));
        this.xunHuanCzImgObj = new GameObjectGetSet(item.findObject("backtop/imgXunHuan"));
        this.numText = new TextGetSet(item.findText("txtNum"));
        this.rewardList = item.findUIList("rewardList");
        this.btnGet = new GameObjectGetSet(item.findObject("btnGet"));
        this.btnGetText = new TextGetSet(ElemFinder.findText(this.btnGet.gameObject, "Text"));
        this.leftTimeText = new TextGetSet(item.findText("timeText"));
        Game.UIClickListener.Get(this.btnGet.gameObject).onClick = delegate(this, this.onClickBtnGet);
    }

    protected updateRewardItem(i: number) {
        if (this.iconItems[i] == null) {
            let item = this.rewardList.GetItem(i).gameObject;
            this.iconItems[i] = new IconItem();
            this.iconItems[i].setUsuallyIcon(item);
            this.iconItems[i].setTipFrom(TipFrom.normal);
        }
    }

    protected updateBtnState(rewardTimes: number, doneTimes: number, maxTimes: number) {
        this.leftTimeText.text = uts.format("{0}/{1}", TextFieldUtil.getColorText(rewardTimes.toString(), Color.GREEN), maxTimes);
        if (rewardTimes >= maxTimes) {
            this.btnState = KfCzRewardState.allReach;
            this.btnGetText.text = "已达成";
            UIUtils.setButtonClickAble(this.btnGet.gameObject, false);
        } else {
            UIUtils.setButtonClickAble(this.btnGet.gameObject, true);
            if (doneTimes > rewardTimes) {
                this.btnState = KfCzRewardState.hasReach;
                this.btnGetText.text = "领取";
            } else {
                this.btnState = KfCzRewardState.noReach;
                this.btnGetText.text = "前往达成";
            }
        }
    }
    protected abstract onClickBtnGet();
}



export class KfChongZhiBasePanel extends TabSubForm {

    protected danBiCzImgObj: GameObjectGetSet;
    protected xunHuanCzImgObj: GameObjectGetSet;
    protected rewardList: List;
    protected rechargeCountText: TextGetSet;
    protected leftTimeText: TextGetSet;
    protected canUpdateLeftTime: boolean = false;
    private m_restTime: number = 0;

    protected resPath(): string {
        return UIPathData.KaiFuCzBasePanel;
    }

    protected initElements() {
        this.danBiCzImgObj = new GameObjectGetSet( this.elems.getElement("danbiBack"));
        this.xunHuanCzImgObj = new GameObjectGetSet( this.elems.getElement("xunhuanBack"));
        this.rewardList = this.elems.getUIList("rewardList");
        this.rechargeCountText = new TextGetSet( this.elems.getText("rechargeCount"));
        this.leftTimeText = new TextGetSet( this.elems.getText("leftTime"));
    }

    protected canGetReward(rewardTimes: number, doneTimes: number, maxTimes: number): boolean {
        if (rewardTimes < maxTimes && doneTimes > rewardTimes) {
            return true;
        }
        return false;
    }

    protected initListeners() {

    }
    protected onOpen() {
        this.addTimer("1", 1000, 0, this.onTimer);
    }

    protected onClose() {
        this.canUpdateLeftTime = false;
        this.removeTimer("1");
    }


    protected updateLeftTimeData(isDayReflash: boolean, endDay: number) {
        if (isDayReflash) {
            this.m_restTime = G.SyncTime.getServerZeroLeftTime();
        } else {
            this.m_restTime = G.SyncTime.getServerZeroLeftTime();
            let day = G.SyncTime.getDateAfterStartServer();
            this.m_restTime += (endDay - day) * 86400;
        }
        this.canUpdateLeftTime = true;
    }


    private onTimer(): void {
        if (!this.canUpdateLeftTime) return;
        this.m_restTime--;
        if (this.m_restTime <= 0) {
            this.leftTimeText.text = "活动已经结束";
            this.removeTimer("1");
        }
        else {
            this.leftTimeText.text = "活动剩余时间：" + TextFieldUtil.getColorText(DataFormatter.second2day(this.m_restTime), Color.GREEN);
        }
    }

}

