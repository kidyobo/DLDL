import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ElemFinder } from 'System/uilib/UiUtility'
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

/**1.5倍领取日环任务完成奖励对话框。*/
export class SingleDailyRewardView extends CommonForm {

    private readonly AutoCloseTimerKey = '1';

    /**奖励列表*/
    private list: List;
    private items: IconItem[] = [];
    private itemDatas: RewardIconItemData[] = [];

    private btn1: UnityEngine.GameObject;
    private labelBtn1: UnityEngine.UI.Text;

    private btn1p5: UnityEngine.GameObject;
    private labelBtn1p5: UnityEngine.UI.Text;

    private toggle: UnityEngine.UI.ActiveToggle;

    private mask: UnityEngine.GameObject;
    private txtDes: UnityEngine.UI.Text;

    private questId = 0;
    private callback: (is1p5: boolean, noPromp: boolean) => boolean;
    private defaultAt1p5 = false;
    private countDownSeconds = 10;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.SingleDailyRewardView;
    }

    protected initElements(): void {
        this.mask = this.elems.getElement('mask');
        this.btn1 = this.elems.getElement('btn1');
        this.btn1p5 = this.elems.getElement('btn1p5');
        this.list = this.elems.getUIList('list');
        this.toggle = this.elems.getActiveToggle('toggle');
        this.toggle.gameObject.SetActive(false);
        this.labelBtn1 = ElemFinder.findText(this.btn1, 'Text');
        this.labelBtn1p5 = ElemFinder.findText(this.btn1p5, 'Text');
        this.txtDes = this.elems.getText("txtDes");
    }

    protected initListeners(): void {
        this.addClickListener(this.btn1, this.onClickBtn1);
        this.addClickListener(this.btn1p5, this.onClickBtn1p5);
    }

    protected onOpen() {
        let cfg = QuestData.getConfigByQuestID(this.questId);

        this.list.Count = cfg.m_ucRewardThingNumber + 1;
        let oldItemCnt = this.items.length;
        let icon: IconItem;
        let itemData: RewardIconItemData;
        for (let i = 0; i < cfg.m_ucRewardThingNumber + 1; i++) {
            if (i < oldItemCnt) {
                icon = this.items[i];
                itemData = this.itemDatas[i];
            } else {
                this.items.push(icon = new IconItem());
                icon.setTipFrom(TipFrom.normal);
                icon.setUsuallyIcon(this.list.GetItem(i).gameObject);
                this.itemDatas.push(itemData = new RewardIconItemData());
            }
            if (i < cfg.m_ucRewardThingNumber) {
                let r = cfg.m_astRewardThingConfig[i];
                icon.updateById(r.m_iThingID, r.m_iValue);
            } else {
                icon.updateById(KeyWord.EXPERIENCE_THING_ID, QuestData.getLoopQuestExtraExp(cfg));
            }
            icon.updateIcon();
        }

        this.defaultAt1p5 = G.DataMgr.vipData.hasPrivilege(KeyWord.VIP_PARA_LOOP_QUEST_REWARD);
        if (this.defaultAt1p5) {
            UIUtils.setButtonClickAble(this.btn1, false);
            this.labelBtn1.text = '1倍';
            this.labelBtn1p5.text = '1.5倍(10)';
            this.txtDes.text = "尊敬的特权用户，您可领取1.5倍经验奖励";

        } else {
            this.labelBtn1.text = '1倍(10)';
            this.labelBtn1p5.text = '1.5倍';
            this.txtDes.text = "充值任意金额激活白银特权，可领取1.5倍奖励";
        }

        this.addTimer(this.AutoCloseTimerKey, 1000, 10, this.onAutoTimer);
    }

    protected onClose() {

    }

    open(questId: number, callback: (is1p5: boolean, noPromp: boolean) => boolean) {
        this.questId = questId;
        this.callback = callback;
        super.open();
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onAutoTimer(timer: Game.Timer) {
        this.countDownSeconds -= timer.CallCountDelta;
        if (this.countDownSeconds <= 0) {
            if (null != this.callback) {
                this.callback(this.defaultAt1p5, this.toggle.isOn);
            }
            this.close();
        } else {
            if (this.defaultAt1p5) {
                this.labelBtn1.text = '1倍';
                this.labelBtn1p5.text = uts.format('1.5倍({0})', this.countDownSeconds);
            } else {
                this.labelBtn1.text = uts.format('1倍({0})', this.countDownSeconds);
                this.labelBtn1p5.text = '1.5倍';
            }
        }
    }

    private onClickBtn1() {
        if (null != this.callback) {
            this.callback(false, this.toggle.isOn);
        }
        this.close();
    }

    private onClickBtn1p5() {
        if (null != this.callback) {
            let canClose = this.callback(true, this.toggle.isOn);
            if (canClose) {
                this.close();
            }
        }
    }
}