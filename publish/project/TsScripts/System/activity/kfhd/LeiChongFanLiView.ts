import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { TipFrom } from "System/tip/view/TipsView";
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { ListItemCtrl } from "System/uilib/ListItemCtrl";
import { TabSubForm } from "System/uilib/TabForm";
import { ElemFinder } from "System/uilib/UiUtility";
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { MathUtil } from "System/utils/MathUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from "System/utils/UIUtils";

class KfhdLeiChongJiangLiItem extends ListItemCtrl {

    private textYuanBao: UnityEngine.UI.Text;

    private list: List;
    private items: IconItem[] = [];

    btnGet: UnityEngine.GameObject;
    private btnLabel: UnityEngine.UI.Text;

    btnGo: UnityEngine.GameObject;

    private lv = 0;

    private gotoPayView: boolean = false;

    setComponents(go: UnityEngine.GameObject) {
        this.textYuanBao = ElemFinder.findText(go, 'condition/textYuanBao');

        this.list = ElemFinder.getUIList(ElemFinder.findObject(go, 'list'));
        this.btnGet = ElemFinder.findObject(go, 'btnGet');
        this.btnLabel = ElemFinder.findText(this.btnGet, 'Text');
        this.btnGo = ElemFinder.findObject(go, "btnGo");
        Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onClickBtnGet);
        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickBtnGet);
    }


    init(cfg: GameConfig.KFSCLBCfgM) {
        this.lv = cfg.m_ucLevel;
        this.textYuanBao.text = uts.format('{0}钻石', cfg.m_uiRechargeLimit);
        let rewardThings = cfg.m_stItemList;
        this.list.Count = rewardThings.length;
        for (let i = 0; i < rewardThings.length; i++) {
            let icon = new IconItem();
            icon.setUsuallyIcon(this.list.GetItem(i).gameObject);
            icon.setTipFrom(TipFrom.normal);
            this.items.push(icon);
            icon.updateById(rewardThings[i].m_iID, rewardThings[i].m_iCount);
            icon.updateIcon();
        }
    }

    update(reached: boolean, hasGot: boolean) {
        if (hasGot) {
            this.btnLabel.text = '已领取';
            this.gotoPayView = false;
            UIUtils.setButtonClickAble(this.btnGet, false);
            this.btnGet.SetActive(true);
            this.btnGo.SetActive(false);
        } else if (reached) {
            this.btnLabel.text = '可领取';
            this.gotoPayView = false;
            UIUtils.setButtonClickAble(this.btnGet, true);
            this.btnGet.SetActive(true);
            this.btnGo.SetActive(false);
        } else {
            this.btnLabel.text = "充值领取";
            this.gotoPayView = true;
            UIUtils.setButtonClickAble(this.btnGet, true);
            this.btnGet.SetActive(false);
            this.btnGo.SetActive(true);
        }
    }

    private onClickBtnGet() {
        if (this.gotoPayView) {
            G.ActionHandler.go2Pay();
        } else {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.GET_LJCZ_REWARD, this.lv));
        }
    }
}

/**
 * 开服累充返利
 */
export class LeiChongFanLiView extends TabSubForm {

    private list: List;
    private listItems: KfhdLeiChongJiangLiItem[] = [];

    private textCountDown: UnityEngine.UI.Text;
    private textTime: UnityEngine.UI.Text;
    private textTodayRecharge: UnityEngine.UI.Text;
    private btnRecharge: UnityEngine.GameObject;

    private zeroTime = 0;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_LEICHONGFANLI);
    }

    protected resPath(): string {
        return UIPathData.LeiChongFanLiView;
    }

    protected initElements() {
        // 活动列表
        this.list = this.elems.getUIList('list');

        this.textCountDown = this.elems.getText('textCountDown');
        this.textTime = this.elems.getText('textTime');
        this.textTodayRecharge = this.elems.getText('textTodayRecharge');
        this.btnRecharge = this.elems.getElement('btnRecharge')
    }

    protected initListeners() {
        this.addClickListener(this.btnRecharge, this.onClickBtnRecharge);
    }

    protected onOpen() {
        this.onServerOverDay();
        this.onKfhdRechargeChanged();

        this.textTime.text = G.DataMgr.kfhdData.getActivityBeginToOverTime();
        this.addTimer("1", 1000, 0, this.onCountDownTimer);

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.LJCZ_OPEN_PANEL));
    }

    protected onClose() {
    }

    onServerOverDay() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.LJCZ_OPEN_PANEL));
        this.zeroTime = G.SyncTime.getNextTime(0, 0, 0);
        this.onCountDownTimer();
    }

    private onCountDownTimer() {
        let leftTime = this.zeroTime - G.SyncTime.getCurrentTime();
        if (leftTime > 0) {
            this.textCountDown.text = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(199, DataFormatter.second2day(Math.floor(leftTime / 1000))), Color.DEFAULT_WHITE);
        }
        else {
            this.textCountDown.text = '';
        }
    }

    onKfhdRechargeChanged() {
        let index: number = -1;
        let ljczInfo = G.DataMgr.leiJiRechargeData.ljczInfo;
        let rechargeVal = 0;
        if (null != ljczInfo) {
            rechargeVal = ljczInfo.m_uiLJZCValue;
            let cfgs = G.DataMgr.firstRechargeData.getSclbConfArrByTDL(KeyWord.GIFT_TYPE_LC, ljczInfo.m_iType, ljczInfo.m_iDay);
            let cnt = cfgs.length;
            this.list.Count = cnt;
            let oldItemCnt = this.listItems.length;
            let item: KfhdLeiChongJiangLiItem;
            let firstCanGet = -1;
            for (let i = 0; i < cnt; i++) {
                let cfg = cfgs[i];
                if (i < oldItemCnt) {
                    item = this.listItems[i];
                } else {
                    this.listItems.push(item = new KfhdLeiChongJiangLiItem());
                    item.setComponents(this.list.GetItem(i).gameObject);
                    item.init(cfg);
                }
                let hasGot = MathUtil.checkPosIsReach(cfg.m_ucLevel - 1, ljczInfo.m_usGetBitMap);
                let reached = ljczInfo.m_uiLJZCValue >= cfg.m_uiRechargeLimit;
                item.update(reached, hasGot);
                if (reached && !hasGot && firstCanGet < 0) {
                    firstCanGet = cfg.m_ucLevel - 1;
                }
            }
            if (firstCanGet >= 0) {
                this.list.ScrollByAxialRow(firstCanGet);
            }
        } else {
            this.list.Count = 0;
        }
        this.textTodayRecharge.text = G.DataMgr.langData.getLang(201, rechargeVal);
    }

    private onClickBtnRecharge() {
        G.ActionHandler.go2Pay();
    }
}