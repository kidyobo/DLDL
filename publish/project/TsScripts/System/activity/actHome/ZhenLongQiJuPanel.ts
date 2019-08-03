import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { DataFormatter } from 'System/utils/DataFormatter'
import { GameDesView } from 'System/activity/actHome/GameDesView'
import { ZhenLongQiJuData } from 'System/data/activities/ZhenLongQiJuData'

/**
 * 西洋棋面板
 */
export class ZhenLongQiJuPanel extends TabSubForm {
    private readonly MatchingTimerKey = '1';

    private btnStart: UnityEngine.GameObject;
    private btnRule: UnityEngine.GameObject;

    private matchingGo: UnityEngine.GameObject;
    private textCountDown: UnityEngine.UI.Text;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_ZLQJ);
    }

    protected resPath(): string {
        return UIPathData.ZhenLongQiJuView;
    }

    protected initElements() {
        this.btnStart = this.elems.getElement('btnStart');
        this.btnRule = this.elems.getElement('btnRule');

        this.matchingGo = this.elems.getElement('matchingGo');
        this.matchingGo.SetActive(false);
        this.textCountDown = this.elems.getText('textCountDown');
    }

    protected initListeners() {
        this.addClickListener(this.btnStart, this.onClickBtnStart);
        this.addClickListener(this.btnRule, this.onClickBtnRule);
    }

    protected onOpen() {
        if (G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_ZLQJ)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhenLongQiJuRequest(Macros.CROSS_ZLQJ_PANNEL));
            this.onPanelResp();
        } else {
            this.matchingGo.SetActive(false);
            UIUtils.setButtonClickAble(this.btnStart, false);
        }
    }

    protected onClose() {
    }

    onPanelResp() {
        let zlqjData = G.DataMgr.activityData.zlqjData;
        let panelResp = zlqjData.panelResp;
        if (null != panelResp) {
            if (0 != panelResp.m_iStatus) {
                UIUtils.setButtonClickAble(this.btnStart, false);
                this.matchingGo.SetActive(true);
                this.onMatchingTimer(null);
                this.addTimer(this.MatchingTimerKey, 1000, 0, this.onMatchingTimer);
            } else {
                UIUtils.setButtonClickAble(this.btnStart, panelResp.m_iCount < ZhenLongQiJuData.MaxTakePartTimes);
                if (zlqjData.countDownTime <= 0) {
                    zlqjData.countDownTime = ZhenLongQiJuData.CountDownSeconds;
                }
                this.matchingGo.SetActive(false);
                this.removeTimer(this.MatchingTimerKey);
            }
        } else {
            UIUtils.setButtonClickAble(this.btnStart, false);
        }     
    }

    private onMatchingTimer(timer: Game.Timer) {
        let zlqjData = G.DataMgr.activityData.zlqjData;
        if (zlqjData.countDownTime <= 0) {
            zlqjData.countDownTime = ZhenLongQiJuData.CountDownSeconds;
        }
        zlqjData.countDownTime -= null != timer ? timer.CallCountDelta : 0;
        if (zlqjData.countDownTime < 0) {
            zlqjData.countDownTime = 0;
        }
        this.textCountDown.text = uts.format('正在匹配中({0})...', zlqjData.countDownTime);
    }

    private onClickBtnStart() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhenLongQiJuRequest(Macros.CROSS_ZLQJ_SIGNUP));
    }

    private onClickBtnRule() {
        G.Uimgr.createForm<GameDesView>(GameDesView).open(G.DataMgr.activityData.getActHomeCfg(Macros.ACTIVITY_ID_ZLQJ));
    }
}