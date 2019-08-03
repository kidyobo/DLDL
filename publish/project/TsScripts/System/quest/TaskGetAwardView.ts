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
import { TipFrom } from 'System/tip/view/TipsView'/**领取任务奖励对话框。*/
export class TaskGetAwardView extends CommonForm {

    private readonly AutoTimerKey = '1';
    private readonly AutoSeconds = 30;

    /**奖励列表*/
    private list: List;
    private items: IconItem[] = [];
    private itemDatas: RewardIconItemData[] = [];

    private textContent: UnityEngine.UI.Text;
    private btnGet: UnityEngine.GameObject;
    private labelBtnGet: UnityEngine.UI.Text;

    private mask: UnityEngine.GameObject;

    private openQuestId = 0;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.TaskGetAwardView;
    }

    protected initElements(): void {
        this.textContent = this.elems.getText('textContent');
        this.mask = this.elems.getElement('mask');
        this.btnGet = this.elems.getElement('btnGet');
        this.labelBtnGet = this.elems.getText('labelBtnGet');
        this.list = this.elems.getUIList('list');
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onClickMask);
        this.addClickListener(this.btnGet, this.onClickBtnGet);
    }

    protected onOpen() {
        let cfg = QuestData.getConfigByQuestID(this.openQuestId);
        let nodeCfg = cfg.m_astQuestNodeConfig[0];
        this.textContent.text = nodeCfg.m_szWord + '(' + nodeCfg.m_shValue + '/' + nodeCfg.m_shValue + ')';
        this.list.Count = cfg.m_ucRewardThingNumber;
        let oldItemCnt = this.items.length;
        let icon: IconItem;
        let itemData: RewardIconItemData;
        for (let i = 0; i < cfg.m_ucRewardThingNumber; i++) {
            if (i < oldItemCnt) {
                icon = this.items[i];
                itemData = this.itemDatas[i];
            } else {
                this.items.push(icon = new IconItem());
                icon.setTipFrom(TipFrom.normal);
                icon.setUsuallyIcon(this.list.GetItem(i).gameObject);
                this.itemDatas.push(itemData = new RewardIconItemData());
            }
            icon.updateById(cfg.m_astRewardThingConfig[i].m_iThingID, cfg.m_astRewardThingConfig[i].m_iValue);
            icon.updateIcon();
        }
        this.labelBtnGet.text = uts.format('领取({0})', this.AutoSeconds);
        this.addTimer(this.AutoTimerKey, 1000, this.AutoSeconds, this.onAutoTimer);
    }

    protected onClose() {

    }

    open(questId: number) {
        this.openQuestId = questId;
        super.open();
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onAutoTimer(timer: Game.Timer) {
        let leftSeconds = this.AutoSeconds - timer.CallCount;
        if (leftSeconds > 0) {
            this.labelBtnGet.text = uts.format('领取({0})', leftSeconds);
        } else {
            this.onClickBtnGet();
        }
    }

    private onClickBtnGet() {
        G.ModuleMgr.questModule.operateOneQuestRequest(this.openQuestId, QuestData.EQA_Complete);
        this.close();
    }

    private onClickMask() {
        this.close();
    }
}
