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

enum EnumOnlineGiftStatus {
    completed = 1,
    canGet = 2,
    cannotGet = 3,
}

class OnlineGiftItem extends ListItemCtrl {

    private readonly onlineTimes: number[] = [5, 10, 30, 45, 60, 120];
    private rewardList: List;
    private items: IconItem[] = [];

    private btnGetReward: UnityEngine.GameObject;
    private btnLabel: UnityEngine.UI.Text;
    private txtTime: UnityEngine.UI.Text;
    private time: number = 0;

    setComponents(go: UnityEngine.GameObject) {
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, 'rewardList'));
        this.btnGetReward = ElemFinder.findObject(go, 'btnGetReward');
        this.btnLabel = ElemFinder.findText(this.btnGetReward.gameObject, 'Text');
        this.txtTime = ElemFinder.findText(go, 'timebg/txtTime');
        Game.UIClickListener.Get(this.btnGetReward).onClick = delegate(this, this.onClickBtnGetReward);
    }

    init(cfg: GameConfig.GiftBagConfigM, index: number) {
        let rewardCnt = cfg.m_astGiftThing.length;
        this.rewardList.Count = rewardCnt;
        for (let i = 0; i < rewardCnt; i++) {
            let icon = new IconItem();
            icon.setUsuallyIcon(this.rewardList.GetItem(i).gameObject);
            icon.setTipFrom(TipFrom.normal);
            this.items.push(icon);

            let itemData = new RewardIconItemData();
            itemData.id = cfg.m_astGiftThing[i].m_iThingID;
            itemData.number = cfg.m_astGiftThing[i].m_iThingNumber;
            icon.updateByRewardIconData(itemData);
            icon.updateIcon();
        }
        this.txtTime.text = this.onlineTimes[index] + "分钟";
        this.time = this.onlineTimes[index];
    }

    update(status: EnumOnlineGiftStatus) {

        let btnText = ElemFinder.findText(this.btnGetReward, "Text");
        let btnImage = this.btnGetReward.GetComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;
        if (EnumOnlineGiftStatus.completed == status) {
            // 已经全部领完了
            btnText.text = '已领取';
            UIUtils.setGrey(this.btnGetReward, true, false);
            btnImage.raycastTarget = false;
        }
        else if (EnumOnlineGiftStatus.canGet == status) {
            // 已经可以领取了
            btnText.text = '领取奖励';
            UIUtils.setGrey(this.btnGetReward, false, false);
            btnImage.raycastTarget = true;
        }
        else {
            // 不可领取
            btnText.text = '未达成';
            UIUtils.setGrey(this.btnGetReward, true, false);
            btnImage.raycastTarget = false;
        }
    }

    private onClickBtnGetReward() {
        let data = G.DataMgr.activityData.onlineGiftData;
        data.selectedTime = this.time;
        data.onlineTimes.shift();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_ONLINEGIFT, Macros.ONLINEGIFTACT_GET));
    }
}

export class OnlineGiftPanel extends TabSubForm {

    private list: List;
    private items: OnlineGiftItem[] = [];
    private textTime: UnityEngine.UI.Text;
    /**当前累计在线秒数*/
    private onlineSeconds: number = 0;
    private countDownIndx: number = -1;


    constructor() {
        super(KeyWord.OTHER_FUNCTION_ZXJL);
    }

    protected resPath(): string {
        return UIPathData.OnlineGiftView;
    }

    protected initElements() {
        this.list = this.elems.getUIList('list');
        this.textTime = this.elems.getText('textTime');
        let cfgs: GameConfig.GiftBagConfigM[] = G.DataMgr.giftGroupData.getListDataByType(KeyWord.GIFT_TYPE_ONLINEGIFT_GIFT);
        let cnt = cfgs.length;
        this.list.Count = cnt;
        let item: OnlineGiftItem;
        this.countDownIndx = -1;
        for (let i: number = 0; i < cnt; i++) {
            this.items.push(item = new OnlineGiftItem());
            item.setComponents(this.list.GetItem(i).gameObject);
            item.init(cfgs[i], i);
        }
    }

    protected initListeners() {
    }

    protected onOpen() {
        // 拉取在线时间
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_ONLINEGIFT, Macros.ONLINEGIFTACT_SHOW));
        this.addTimer("1", 1000, 0, this.onCountDownTimer);
    }

    protected onClose() {
    }

    updateView(): void {
        let cfgs: GameConfig.GiftBagConfigM[] = G.DataMgr.giftGroupData.getListDataByType(KeyWord.GIFT_TYPE_ONLINEGIFT_GIFT);
        let onlineData: Protocol.OnlineGiftActivityData = G.DataMgr.activityData.onlineGiftData.onlineGiftData;
        let cnt = cfgs.length;
        this.list.Count = cnt;
        this.countDownIndx = -1;

        let showIndex: number = -1;
        for (let i: number = 0; i < cnt; i++) {
            let status = this.checkItem(i);
            if (this.countDownIndx < 0 && EnumOnlineGiftStatus.cannotGet == status) {
                this.countDownIndx = i;
            }

            if (showIndex < 0) {
                if (EnumOnlineGiftStatus.canGet == status) {
                    showIndex = i;
                }
                else if
                (EnumOnlineGiftStatus.cannotGet == status) {
                    showIndex = i;
                }
            }
        }

        //将第一个可领奖励放到前面
        this.list.ScrollByAxialRow(showIndex > 0 ? showIndex : 0);

        let data = G.DataMgr.activityData.onlineGiftData;
        if (data.onlineTimes.length > 0) {
            if (data.selectedTime >= data.onlineTimes[0]) {
                data.onlineTimes.shift();
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_ONLINEGIFT, Macros.ONLINEGIFTACT_GET));
            }
        }
    }

    private checkItem(index: number): EnumOnlineGiftStatus {
        let cfgs: GameConfig.GiftBagConfigM[] = G.DataMgr.giftGroupData.getListDataByType(KeyWord.GIFT_TYPE_ONLINEGIFT_GIFT);
        let onlineData: Protocol.OnlineGiftActivityData = G.DataMgr.activityData.onlineGiftData.onlineGiftData;
        let item = this.items[index];
        let status: EnumOnlineGiftStatus = EnumOnlineGiftStatus.cannotGet;
        if (null != onlineData) {
            if (onlineData.m_ushNextGift <= 0 || cfgs[index].m_iParameter < onlineData.m_ushNextGift) {
                // 已经全部领完了
                status = EnumOnlineGiftStatus.completed;
            }
            else if (onlineData.m_ushOnlineTime >= cfgs[index].m_iParameter * 60) {
                // 已经可以领取了
                status = EnumOnlineGiftStatus.canGet;
            }
            else {
                // 不可领取
                status = EnumOnlineGiftStatus.cannotGet;
            }
        }
        item.update(status);
        return status;
    }

    private onCountDownTimer() {
        // 更新在线
        let onlineSeconds = 0;
        let onlineData: Protocol.OnlineGiftActivityData = G.DataMgr.activityData.onlineGiftData.onlineGiftData;
        if (null != onlineData) {
            let now = UnityEngine.Time.realtimeSinceStartup;
            onlineSeconds = onlineData.m_ushOnlineTime + now - G.DataMgr.activityData.onlineGiftData.updateOnlineGiftAt;
        } else {
            onlineSeconds = 0;
        }
        //两小时以后就不再进行累加时间了
        if (onlineSeconds > 7200) {
            this.removeTimer("1");
            this.textTime.gameObject.SetActive(false);
        } else {
            this.textTime.gameObject.SetActive(true);
            this.textTime.text = uts.format('已累计在线：{0}', DataFormatter.second2hhmmss(onlineSeconds));
        }
        // 检查是否有可以领了的
        if (this.countDownIndx >= 0) {
            this.checkItem(this.countDownIndx);
        }
    }
}