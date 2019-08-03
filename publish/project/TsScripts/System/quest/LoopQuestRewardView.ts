import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { IconItem } from 'System/uilib/IconItem'
import { QuestData } from 'System/data/QuestData'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { TipFrom } from 'System/tip/view/TipsView'
import { DropPlanData } from 'System/data/DropPlanData'

/**领取环任务完成奖励对话框。*/
export class LoopQuestRewardView extends CommonForm {
    /**双倍领取花费10钻石*/
    private readonly DoubleCost = 10;

    private readonly AutoCloseTimerKey = '1';

    /**奖励列表*/
    private list: List;
    private items: IconItem[] = [];
    private itemDatas: RewardIconItemData[] = [];

    private btnNoTip: UnityEngine.GameObject;
    private btnDouble: UnityEngine.GameObject;

    private mask: UnityEngine.GameObject;

    private openQuestType = 0;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.LoopQuestRewardView;
    }

    protected initElements(): void {
        this.mask = this.elems.getElement('mask');
        this.btnNoTip = this.elems.getElement('btnNoTip');
        this.btnDouble = this.elems.getElement('btnDouble');
        this.list = this.elems.getUIList('list');
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onClickMask);
        this.addClickListener(this.btnNoTip, this.onClickBtnNoTip);
        this.addClickListener(this.btnDouble, this.onClickBtnDouble);
    }

    protected onOpen() {
        let dropId = 0;
        if (KeyWord.QUEST_TYPE_DAILY == this.openQuestType) {
            dropId = Macros.QUEST_DAILY_EXTRA_REWARD_ID;
        } else if (KeyWord.QUEST_TYPE_GUILD_DAILY == this.openQuestType) {
            dropId = Macros.QUEST_GUILD_EXTRA_REWARD_ID;
        }
        let dropCfg = DropPlanData.getDropPlanConfig(dropId);
        this.list.Count = dropCfg.m_ucDropThingNumber;
        let oldItemCnt = this.items.length;
        let icon: IconItem;
        let itemData: RewardIconItemData;
        for (let i = 0; i < dropCfg.m_ucDropThingNumber; i++) {
            if (i < oldItemCnt) {
                icon = this.items[i];
                itemData = this.itemDatas[i];
            } else {
                this.items.push(icon = new IconItem());
                icon.setTipFrom(TipFrom.normal);
                icon.setUsuallyIcon(this.list.GetItem(i).gameObject);
                this.itemDatas.push(itemData = new RewardIconItemData());
            }
            icon.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
            icon.updateIcon();
        }

        this.addTimer(this.AutoCloseTimerKey, 30000, 1, this.onAutoCloseTimer);
    }

    protected onClose() {

    }

    open(questType: number) {
        this.openQuestType = questType;
        super.open();
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onAutoCloseTimer(timer: Game.Timer) {
        this.close();
    }

    private onClickBtnNoTip() {
        G.DataMgr.questData.noTipLoopRewardsMap[this.openQuestType] = true;
        G.ViewCacher.mainView.taskTrackList.updateView(false);
        this.close();
    }

    private onClickBtnDouble() {
        if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.DoubleCost, true)) {
            let opType = 0;
            if (KeyWord.QUEST_TYPE_DAILY == this.openQuestType) {
                opType = Macros.DAY_QUEST_DAILY;
            } else if (KeyWord.QUEST_TYPE_GUILD_DAILY == this.openQuestType) {
                opType = Macros.DAY_QUEST_GUILD;
            }
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDailyOperateRequest(opType));
            this.close();
        }
    }

    private onClickMask() {
        this.close();
    }
}
