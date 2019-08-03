import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { List } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { TabSubForm } from 'System/uilib/TabForm'


class HongBaoYouLiItem extends ListItemCtrl {
    private cannotOpen: UnityEngine.GameObject;
    private canOpen: UnityEngine.GameObject;
    private opened: UnityEngine.GameObject;

    private toOpenEffect: UnityEngine.GameObject;
    private openEffect: UnityEngine.GameObject;

    private yuanbao: UnityEngine.GameObject;
    private textYuanBao: UnityEngine.UI.Text;

    private day = 0;
    private isClicked = false;

    constructor(day: number) {
        super();
        this.day = day;
    }

    setComponents(go: UnityEngine.GameObject) {
        this.cannotOpen = ElemFinder.findObject(go, 'cannotOpen');
        let txtDay = ElemFinder.findText(go, "cannotOpen/txtday");
        txtDay.text = uts.format("第{0}天", this.day);

        this.canOpen = ElemFinder.findObject(go, 'canOpen');
        this.opened = ElemFinder.findObject(go, 'opened');

        this.toOpenEffect = ElemFinder.findObject(this.canOpen, 'hongbaodaikai');
        this.toOpenEffect.SetActive(false);
        this.openEffect = ElemFinder.findObject(this.opened, 'hongbaoopen');
        this.openEffect.SetActive(false);

        this.yuanbao = ElemFinder.findObject(go, 'bg');
        this.textYuanBao = ElemFinder.findText(this.yuanbao, 'textYuanBao');
        Game.Tools.AddUIRaycaster(this.canOpen);
        Game.UIClickListener.Get(this.canOpen).onClick = delegate(this, this.onClickBtnOpen);
    }

    update(consume: number, showYuanBao: boolean, canOpen: boolean, isOpened: boolean) {
        this.yuanbao.SetActive(showYuanBao);
        if (showYuanBao) {
            this.textYuanBao.text = consume.toString();
        }
        this.cannotOpen.SetActive(!canOpen);
        if (canOpen && !isOpened && consume > 0) {
            this.canOpen.SetActive(true);
            this.toOpenEffect.SetActive(consume > 0);
        } else {
            this.canOpen.SetActive(false);
        }
        this.opened.SetActive(isOpened);

        if (this.isClicked && isOpened) {
            this.isClicked = false;
            this.openEffect.SetActive(true);
            Game.Invoker.BeginInvoke(this.openEffect, '1', 1, delegate(this, this.onOpenEffect));
        }
    }

    private onOpenEffect() {
        this.openEffect.SetActive(false);
    }

    private onClickBtnOpen() {
        this.isClicked = true;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KFXFFL_GET, this.day));
    }
}

export class HongBaoYouLiView extends TabSubForm {
    private readonly HongBaoCnt = 7;
    private readonly TickKey = '1';

    /**红包item数组*/
    private list: List;
    private items: HongBaoYouLiItem[] = [];
    private textYuanBao: UnityEngine.UI.Text;
    private textTime: UnityEngine.UI.Text;
    private btnRule: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HONGBAOYOULI);
    }


    protected resPath(): string {
        return UIPathData.HongBaoYouLiView;
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KFXFFL_OPEN));
    }

    protected onClose() {
    }

    protected initElements(): void {
        this.list = this.elems.getUIList("list");
        this.list.Count = this.HongBaoCnt;
        for (let i = 0; i < this.HongBaoCnt; i++) {
            let go = this.list.GetItem(i);
            let item = new HongBaoYouLiItem(i + 1);
            item.setComponents(go.gameObject);
            this.items.push(item);
        }

        this.textYuanBao = this.elems.getText('textYuanBao');
        this.textTime = this.elems.getText('textTime');
        this.btnRule = this.elems.getElement('btnRule');

    }

    protected initListeners(): void {
        this.addClickListener(this.btnRule, this.onClickBtnRule);
    }

    updateView() {
        let info = G.DataMgr.kaifuActData.hongBaoYouLiInfo;
        let d = G.SyncTime.getDateAfterStartServer();
        let cnt = 0;
        if (null != info) {
            cnt = info.m_ucNumber;
        }
        let accConsume = 0;
        for (let i = 0; i < this.HongBaoCnt; i++) {
            let consume = 0;
            let hasGot = false;
            if (i < cnt) {
                hasGot = 0 != (info.m_ucGet & (1 << i));
            }
            if (d >= i + 1) {
                consume = info.m_aiConsume[i];
                accConsume += consume;
            }
            this.items[i].update(consume, d >= i + 1, d > this.HongBaoCnt, hasGot);
        }
        this.textYuanBao.text = TextFieldUtil.getColorText(uts.format("{0}钻石", accConsume.toString()), Color.ORANGE);

        this.onTickTiemr(null);
        if (d <= this.HongBaoCnt) {
            // 前7天，显示倒计时
            this.addTimer(this.TickKey, 1000, 0, this.onTickTiemr);
        } else {
            this.removeTimer(this.TickKey);
        }
    }

    private onTickTiemr(timer: Game.Timer) {
        let s = G.SyncTime.getServerZeroLeftTime();
        let d = G.SyncTime.getDateAfterStartServer();
        if (d <= this.HongBaoCnt) {
            s += (this.HongBaoCnt - d) * 86400;
            this.textTime.text = '距离可返利还有：' + TextFieldUtil.getColorText(DataFormatter.second2day(s), Color.GREEN);
        } else {
            this.textTime.text = '点开红包可领取返利';
            this.removeTimer(this.TickKey);
        }
    }

    private onClickBtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(364), '规则介绍');
    }

    private onClickBtnReturn() {
        this.close();
    }
}