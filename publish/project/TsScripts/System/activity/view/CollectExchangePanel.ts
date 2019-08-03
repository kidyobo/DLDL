import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { IconItem } from 'System/uilib/IconItem'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { DataFormatter } from 'System/utils/DataFormatter'
import { Color } from 'System/utils/ColorUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { SyncTime } from 'System/net/SyncTime'
import { TabSubForm } from 'System/uilib/TabForm'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { CollectExchangeItemData } from 'System/data/vo/CollectExchangeItemData'
import { EnumRewardState } from 'System/constants/GameEnum'

class CollectCellItem extends ListItemCtrl {
    private icon: IconItem;

    private plusGo: UnityEngine.GameObject;
    private equalGo: UnityEngine.GameObject;
    private textCount: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        this.icon = new IconItem();
        this.icon.setTipFrom(TipFrom.normal);
        let iconGo = ElemFinder.findObject(go, 'icon');
        this.icon.setUsualIconByPrefab(itemIcon_Normal, iconGo);

        this.plusGo = ElemFinder.findObject(go, 'plus');
        this.equalGo = ElemFinder.findObject(go, 'equal');
        this.textCount = ElemFinder.findText(iconGo, 'textCount');
    }

    update(cfg: GameConfig.CEItem, frame: number, materialOwnNum: number) {
        this.icon.updateById(cfg.m_uiID, cfg.m_uiCount);
        this.icon.updateIcon();
        if (materialOwnNum >= 0) {
            let color = materialOwnNum >= cfg.m_uiCount ? Color.GREEN : Color.RED;
            this.textCount.text = TextFieldUtil.getColorText( materialOwnNum + '/' + cfg.m_uiCount,color);
            this.textCount.gameObject.SetActive(true);
        } else {
            this.textCount.gameObject.SetActive(false);
        }

        if (1 == frame) {
            // 显示加号
            this.plusGo.SetActive(true);
            this.equalGo.SetActive(false);
        } else if (2 == frame) {
            // 显示等号
            this.plusGo.SetActive(false);
            this.equalGo.SetActive(true);
        } else {
            this.plusGo.SetActive(false);
            this.equalGo.SetActive(false);
        }
    }
}

class CollectExchangeLiItem extends ListItemCtrl {

    private textCount: UnityEngine.UI.Text;

    private list: List;
    private items: CollectCellItem[] = [];

    private btnGet: UnityEngine.GameObject;
    private btnLabel: UnityEngine.UI.Text;
    private reminToggle: UnityEngine.UI.ActiveToggle;

    private id = 0;

    setComponents(go: UnityEngine.GameObject) {
        this.textCount = ElemFinder.findText(go, 'textCount');

        this.list = ElemFinder.getUIList(ElemFinder.findObject(go, 'list'));
        this.btnGet = ElemFinder.findObject(go, 'btnGet');
        this.btnLabel = ElemFinder.findText(this.btnGet, 'Text');
        this.reminToggle = ElemFinder.findActiveToggle(go, 'reminToggle');
        Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onClickBtnGet);
        Game.UIClickListener.Get(this.reminToggle.gameObject).onClick = delegate(this, this.onClickReminToggle);
    }

    update(data: CollectExchangeItemData, isActivityOpen: boolean, itemIcon_Normal: UnityEngine.GameObject) {
        this.id = data.cfg.m_iID;
        let SelectData = G.DataMgr.activityData.CollectExchangeInfo.m_uiWarnSelect;
        this.reminToggle.isOn = 0 == (SelectData & 1 << data.cfg.m_iID - 1);
        let thingData = G.DataMgr.thingData;
        let caiLiaoList = data.cfg.m_stCaiLiaoList;
        let cnt = caiLiaoList.length + 1;
        this.list.Count = cnt;

        let oldItemCnt = this.items.length;
        let item: CollectCellItem;
        for (let i = 0; i < cnt; i++) {
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new CollectCellItem());
                item.setComponents(this.list.GetItem(i).gameObject, itemIcon_Normal);
            }

            if (i < cnt - 1) {
                item.update(caiLiaoList[i], i < cnt - 2 ? 1 : 2, thingData.getThingNum(caiLiaoList[i].m_uiID, 0, true));
            } else {
                item.update(data.cfg.m_stJiangLiList[0], 3, -1);
            }
        }

        // 剩余次数
        this.textCount.text = uts.format('可领取：{0}/{1}次', data.exchangeCount, data.cfg.m_uiTime);

        let state = data.rewardState;
        if (EnumRewardState.HasGot == state) {
            this.btnLabel.text = '已领取';
            UIUtils.setButtonClickAble(this.btnGet, false);
        } else if (EnumRewardState.NotGot == state) {
            this.btnLabel.text = '领取奖励';
            UIUtils.setButtonClickAble(this.btnGet, isActivityOpen);
        } else {
            this.btnLabel.text = '未达成';
            UIUtils.setButtonClickAble(this.btnGet, false);
        }
    }

    private onClickBtnGet() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLLECT_EXCHANGE, Macros.ACTIVITY_SJDH_START, this.id));
    }

    private onClickReminToggle() {
       
        let data: number = G.DataMgr.activityData.CollectExchangeInfo.m_uiWarnSelect;
        data ^= (1 << this.id - 1);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLLECT_EXCHANGE, Macros.ACTIVITY_SJDH_WARN, data));
       
    }
}

export class CollectExchangePanel extends TabSubForm {

    private list: List;
    private items: CollectExchangeLiItem[] = [];

    private itemIcon_Normal: UnityEngine.GameObject;

    private textCountDown: UnityEngine.UI.Text;

    private btnRule: UnityEngine.GameObject;
    

    private isActivityOpen = false;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_COLLECT_EXCHANGE);
    }

    protected resPath(): string {
        return UIPathData.KfhdJiZiSongHaoLiView;
    }

    protected initElements() {
        // 列表
        this.list = this.elems.getUIList('list');
        this.itemIcon_Normal = this.elems.getElement('itemIcon_Normal');

        this.textCountDown = this.elems.getText('textCountDown');
        this.btnRule = this.elems.getElement('btnRule');
    }

    protected initListeners() {
        this.addClickListener(this.btnRule, this.onClickBtnRule);
    }

    private onClickBtnRule() {
      
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(74), '玩法说明');
    }

    protected onOpen() {
        this.isActivityOpen = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_COLLECT_EXCHANGE);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLLECT_EXCHANGE, Macros.ACTIVITY_SJDH_PANNEL));
        this.onCollectExchangeChanged();
        this.onCountDownTimer();
        this.addTimer("1", 1000, 0, this.onCountDownTimer);
    }

    protected onClose() {
    }

    onCollectExchangeChanged() {
        let activityData = G.DataMgr.activityData;
        let listData = activityData.collectWordDatas;
        let cnt = listData.length;
        this.list.Count = cnt;
        let oldItemCnt = this.items.length;
        let item: CollectExchangeLiItem;
        for (let i = 0; i < cnt; i++) {
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new CollectExchangeLiItem());
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            item.update(listData[i], this.isActivityOpen, this.itemIcon_Normal);
        }
    }

    private onCountDownTimer() {
        let activityData = G.DataMgr.activityData;
        let oldActivityOpen = this.isActivityOpen;
        this.isActivityOpen = activityData.isActivityOpen(Macros.ACTIVITY_ID_COLLECT_EXCHANGE);
        if (oldActivityOpen != this.isActivityOpen) {
            this.onCollectExchangeChanged();
        }
        if (this.isActivityOpen) {
            let status = activityData.getActivityStatus(Macros.ACTIVITY_ID_COLLECT_EXCHANGE);
            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            let time = Math.max(0, status.m_iEndTime - now);
            this.textCountDown.text = uts.format('活动剩余时间：{0}', DataFormatter.second2day(time));
        } else {
            this.textCountDown.text = '活动剩余时间：已结束';
        }
    }
}