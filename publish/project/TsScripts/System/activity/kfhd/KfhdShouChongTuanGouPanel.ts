import { KfhdBasePanel } from "System/activity/kfhd/KfhdBasePanel";
import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { TipFrom } from "System/tip/view/TipsView";
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { ListItemCtrl } from "System/uilib/ListItemCtrl";
import { ElemFinder } from "System/uilib/UiUtility";
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from "System/utils/UIUtils";
import { KaiFuHuoDongView } from "System/activity/kaifuhuodong/KaiFuHuoDongView";

class KfhdShouChongTuanGouItem extends ListItemCtrl {

    private textCondition: UnityEngine.UI.Text;
    private textPlayer: UnityEngine.UI.Text;

    private list: List;
    private items: IconItem[] = [];

    private btnGet: UnityEngine.GameObject;
    private btnGo: UnityEngine.GameObject;
    private btnLabel: UnityEngine.UI.Text;
    private textCount: UnityEngine.UI.Text;
    private kaifuhuodongView: KaiFuHuoDongView;
    private id = 0;
    private gotoPayView: boolean = false;

    setComponents(go: UnityEngine.GameObject) {
        this.textCondition = ElemFinder.findText(go, 'condition/text');
        this.textPlayer = ElemFinder.findText(go, 'player/text');

        this.list = ElemFinder.getUIList(ElemFinder.findObject(go, 'list'));
        this.btnGet = ElemFinder.findObject(go, 'btnGet');
        this.btnGo = ElemFinder.findObject(go, 'btnGo');
        this.btnLabel = ElemFinder.findText(this.btnGet, 'Text');
        this.textCount = ElemFinder.findText(go, 'textCount');
        this.kaifuhuodongView = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onClickBtnGet);
        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickBtnGo);
    }

    private init(cfg: GameConfig.KFSCTGCfgM) {
        this.id = cfg.m_iID;
        if (cfg.m_iCondition3 == 0) {
            this.textCondition.text = uts.format('第{0}天全服首充达到{1}人',
                TextFieldUtil.getColorText(cfg.m_iCondition1.toString(), Color.GREEN),
                TextFieldUtil.getColorText(cfg.m_iCondition2.toString(), Color.GREEN));
            this.textPlayer.text = uts.format('{0}玩家可领', TextFieldUtil.getColorText('所有', Color.GREEN));
        }
        else if (cfg.m_iCondition3 == 1) {
            this.textCondition.text = uts.format('第{0}天全服首充达到{1}人',
                TextFieldUtil.getColorText(cfg.m_iCondition1.toString(), Color.GREEN),
                TextFieldUtil.getColorText(cfg.m_iCondition2.toString(), Color.GREEN),
                TextFieldUtil.getColorText('任意', Color.GREEN));
            this.textPlayer.text = uts.format('充值{0}钻石可领取', TextFieldUtil.getColorText('任意', Color.GREEN));

        } else {
            this.textCondition.text = uts.format('第{0}天全服首充达到{1}人',
                TextFieldUtil.getColorText(cfg.m_iCondition1.toString(), Color.GREEN),
                TextFieldUtil.getColorText(cfg.m_iCondition2.toString(), Color.GREEN));
            this.textPlayer.text = uts.format('充值{0}钻石可领取', TextFieldUtil.getColorText(cfg.m_iCondition3.toString(), Color.GREEN));
        }

        this.list.Count = cfg.m_iItemCount;
        let oldItemCnt = this.items.length;
        for (let i = 0; i < cfg.m_iItemCount; i++) {
            let icon: IconItem;
            if (i < oldItemCnt) {
                icon = this.items[i];
            } else {
                this.items.push(icon = new IconItem());
                icon.setUsuallyIcon(this.list.GetItem(i).gameObject);
                icon.setTipFrom(TipFrom.normal);
            }

            icon.updateById(cfg.m_stItemList[i].m_iID, cfg.m_stItemList[i].m_iCount);
            icon.updateIcon();
        }
    }

    update(cfg: GameConfig.KFSCTGCfgM, status: number, playerCnt: number) {
        this.init(cfg);
        this.textCount.text = uts.format('首充人数：{0}', playerCnt);
        if (status == Macros.KF_ACT_STATUS_ARIVE) {
            //UIUtils.setButtonClickAble(this.btnGet, true);
            //this.btnLabel.text = '领取奖励';
            this.updataBtnStatus(false, false);
        }
        else if (status == Macros.KF_ACT_STATUS_REWARD) {
            //UIUtils.setButtonClickAble(this.btnGet, false);
            //this.btnLabel.text = '已领取';
            this.updataBtnStatus(false, true);
        } else {
            //UIUtils.setButtonClickAble(this.btnGet, false);
            //this.btnLabel.text = '未达成';
            if (playerCnt >= cfg.m_iCondition2) {
                //UIUtils.setButtonClickAble(this.btnGet, true);
                //this.btnLabel.text = '充值领取';
                //this.gotoPayView = true;
                this.updataBtnStatus(true);
            } else {
                this.updataBtnStatus(true);
                // this.btnLabel.text = '未达成';
            }
        }
    }

    private onClickBtnGet() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFSCTGGetRewardRequest(this.id));
    }

    private onClickBtnGo() {
        this.kaifuhuodongView.close();
        G.ActionHandler.go2Pay();
    }

    private updataBtnStatus(isGo: boolean, hasGet: boolean = true) {
        this.btnGo.SetActive(isGo);
        this.btnGet.SetActive(!isGo);
        this.btnLabel.text = hasGet ? "已领取" : "可领取";
        UIUtils.setButtonClickAble(this.btnGet, !hasGet);
    }

}

export class KfhdShouChongTuanGouPanel extends KfhdBasePanel {

    private readonly TabCnt = 6;

    private tabGroup: UnityEngine.UI.ActiveToggleGroup;

    private list: List;
    private listItems: KfhdShouChongTuanGouItem[] = [];

    private textCountDown: UnityEngine.UI.Text;
    private textTodayPlayers: UnityEngine.UI.Text;
    private textTodayRecharge: UnityEngine.UI.Text;
    private btnRecharge: UnityEngine.GameObject;
    private kaifuhuodongView:KaiFuHuoDongView;
    private zeroTime = 0;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_KFHD_SCTG);
    }

    protected resPath(): string {
        return UIPathData.KfhdShouChongTuanGouView;
    }

    protected initElements() {
        this.tabGroup = this.elems.getToggleGroup('tabGroup');
        for (let i = 0; i < this.TabCnt; i++) {
            this.setTipMark(i, false);
        }

        // 活动列表
        this.list = this.elems.getUIList('list');

        this.textCountDown = this.elems.getText('textCountDown');
        this.textTodayPlayers = this.elems.getText('textTodayPlayers');
        this.textTodayRecharge = this.elems.getText('textTodayRecharge');
        this.btnRecharge = this.elems.getElement('btnRecharge')
    }

    protected initListeners() {
        this.addToggleGroupListener(this.tabGroup, this.onTabGroupChange);
        this.addClickListener(this.btnRecharge, this.onClickBtnRecharge);
    }

    private onTabGroupChange(index: number) {
        let info = G.DataMgr.kfhdData.getGroupBuyInfoData();
        if (null == info) {
            return;
        }
        let condition2s = G.DataMgr.kfhdData.getGroupBuyCondition2(info.m_ucOpenSvrDays);
        let dayMap = G.DataMgr.kfhdData.getGroupBuyConfigs(info.m_ucOpenSvrDays, condition2s[index]);

        let cnt = dayMap.length;
        this.list.Count = cnt;
        let oldItemCnt = this.listItems.length;
        for (let i = 0; i < cnt; i++) {
            let item: KfhdShouChongTuanGouItem;
            if (i < oldItemCnt) {
                item = this.listItems[i];
            } else {
                this.listItems.push(item = new KfhdShouChongTuanGouItem());
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            item.update(dayMap[i], info.m_aucRewardStatus[(dayMap[i].m_iID - 1) % 18], info.m_uiFirstPayerNum);
        }
    }
    open() {
        this.kaifuhuodongView = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        super.open();
    }
    protected onOpen() {
        this.onServerOverDay();
        this.addTimer("1", 1000, 0, this.onCountDownTimer);
    }

    protected onClose() {
    }

    onServerOverDay() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKFSCTGGetInfoRequest());
        this.zeroTime = G.SyncTime.getNextTime(0, 0, 0);
        this.onCountDownTimer();
    }

    private onCountDownTimer() {
        let info = G.DataMgr.kfhdData.getGroupBuyInfoData();
        if (null != info) {
            let leftTime = this.zeroTime - G.SyncTime.getCurrentTime();
            if (leftTime > 0) {
                let time = TextFieldUtil.getColorText(DataFormatter.second2day(Math.floor(leftTime / 1000)), Color.GREEN);
                this.textCountDown.text = uts.format('距离开服第{0}天，剩余{1}', info.m_ucOpenSvrDays, time);
                return;
            }
        }
        this.textCountDown.text = '';
    }



    onShouChongTuanGouChanged(): void {
        let info = G.DataMgr.kfhdData.getGroupBuyInfoData();
        if (info == null) {
            return;
        }

        let selectedIndex = -1;
        let condition2s = G.DataMgr.kfhdData.getGroupBuyCondition2(info.m_ucOpenSvrDays);
        if (condition2s == null)
            return;
        let condition2cnt = condition2s.length;
        for (let i = 0; i < this.TabCnt; i++) {
            let toggle = this.tabGroup.GetToggle(i);
            if (i < condition2cnt) {
                toggle.gameObject.SetActive(true);
                let label = uts.format('{0}人团购', condition2s[i]);
                ElemFinder.findText(toggle.gameObject, 'normal/Text').text = label;
                ElemFinder.findText(toggle.gameObject, 'selected/Text').text = label;

                let showTip = false;
                let dayMap = G.DataMgr.kfhdData.getGroupBuyConfigs(info.m_ucOpenSvrDays, condition2s[i]);
                let count = info.m_aucRewardStatus.length;

                for (let cfg of dayMap) {
                    if (info.m_aucRewardStatus[(cfg.m_iID - 1) % count] == Macros.KF_ACT_STATUS_ARIVE) {
                        showTip = true;
                        break;
                    }
                }
                this.setTipMark(i, showTip);
                if (selectedIndex < 0 && showTip) {
                    selectedIndex = i;
                }
            }
            else {
                toggle.gameObject.SetActive(true);
            }
        }

        if (selectedIndex < 0) {
            selectedIndex = this.tabGroup.Selected;
        }
        if (selectedIndex < 0 || selectedIndex >= condition2cnt) {
            selectedIndex = 0;
        }

        if (selectedIndex != this.tabGroup.Selected) {
            this.tabGroup.Selected = selectedIndex;
        } else {
            this.onTabGroupChange(selectedIndex);
        }

        this.textTodayPlayers.text = uts.format('今日首充人数：{0}人', TextFieldUtil.getColorText(info.m_uiFirstPayerNum.toString(), Color.GREEN));
        this.textTodayRecharge.text = uts.format('今日已累计充值：{0}钻石', TextFieldUtil.getColorText(info.m_uiPayerCharge.toString(), Color.GREEN));
    }

    private setTipMark(index: number, active: boolean) {
        let tipMark = ElemFinder.findObject(this.tabGroup.GetToggle(index).gameObject, 'tipMark');
        tipMark.SetActive(active);
    }

    private onClickBtnRecharge() {
        this.kaifuhuodongView.close();
        G.ActionHandler.go2Pay();
    }
}