import { Constants } from "System/constants/Constants";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { EnumSceneResultId, SceneResultView } from "System/pinstance/result/SceneResultView";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { IconItem } from "System/uilib/IconItem";
import { List, ListItem } from "System/uilib/List";
import { NestedSubForm } from "System/uilib/NestedForm";
import { DataFormatter } from "System/utils/DataFormatter";
import { RegExpUtil } from "System/utils/RegExpUtil";

export class SceneResultPvpPanel extends NestedSubForm {

    private textName: UnityEngine.UI.Text;
    private textPassTime: UnityEngine.UI.Text;
    private textDeadTimes: UnityEngine.UI.Text;
    private textKillExp: UnityEngine.UI.Text;
    private textPassExp: UnityEngine.UI.Text;

    private rewardList: List;
    private rewardIcons: IconItem[] = [];

    private btnExit: UnityEngine.GameObject;
    private textExitLabel: UnityEngine.UI.Text;
    private btnNext: UnityEngine.GameObject;
    private textNextLabel: UnityEngine.UI.Text;

    private resultInfo: Protocol.SceneResultPass;
    private countDownSec: number = 0;

    constructor() {
        super(EnumSceneResultId.pvp);
    }

    protected resPath(): string {
        return UIPathData.SceneResultPvpView;
    }

    protected initElements() {
        this.textName = this.elems.getText('name');
        this.textPassTime = this.elems.getText('passTime');
        this.textDeadTimes = this.elems.getText('deadTimes');
        this.textKillExp = this.elems.getText('killExp');
        this.textPassExp = this.elems.getText('passExp');

        this.rewardList = this.elems.getUIList('rewardList');

        this.btnExit = this.elems.getElement('btnExit');
        this.textExitLabel = this.elems.getText('textExitLabel');

        this.btnNext = this.elems.getElement('btnNext');
        this.textNextLabel = this.elems.getText('textNextLabel');
    }

    protected initListeners() {
        this.addClickListener(this.btnExit, this.onBtnExitClick);
        this.addClickListener(this.btnNext, this.onBtnNextClick);
    }

    protected onOpen() {
        this.textName.text = RegExpUtil.xlsDesc2Html(this.resultInfo.m_szText);
        this.textPassTime.text = DataFormatter.second2hhmmss(this.resultInfo.m_uiTime);
        this.textDeadTimes.text = this.resultInfo.m_uiDeadCnt.toString();
        this.textKillExp.text = DataFormatter.cutWan(this.resultInfo.m_uiKillExp);
        this.textPassExp.text = DataFormatter.cutWan(this.resultInfo.m_uiPassExp);

        let rewardCnt: number = this.resultInfo.m_stThingList.m_astThing.length;
        if (rewardCnt == 0) {
            this.rewardList.Count = 0;
        }
        else {
            let rewardItem: ListItem, iconItem: IconItem;
            let oldIconCnt = this.rewardIcons.length;
            for (let i: number = 0; i < rewardCnt; i++) {
                let thing = this.resultInfo.m_stThingList.m_astThing[i];

                rewardItem = this.rewardList.GetItem(i);
                if (i < oldIconCnt) {
                    iconItem = this.rewardIcons[i];
                }
                else {
                    this.rewardIcons[i] = iconItem = new IconItem();
                    iconItem.setUsuallyIcon(rewardItem.gameObject);
                }
                iconItem.updateById(thing.m_uiThingID, thing.m_uiThingNum);
                iconItem.updateIcon();
            }
        }

        let showExit: boolean = this.resultInfo.m_ucShowExit != Macros.SCENERESULT_BUT_NONE;
        let showNext: boolean = this.resultInfo.m_ucShowNext != Macros.SCENERESULT_BUT_NONE;
        let showTwo: boolean = showExit && showNext;
        this.btnExit.gameObject.SetActive(showExit);
        this.btnNext.gameObject.SetActive(showNext);

        this.textExitLabel.text = '退出';
        this.textNextLabel.text = '继续';
        if (this.resultInfo.m_ucShowExit == Macros.SCENERESULT_BUT_SHOW_TIMER || this.resultInfo.m_ucShowNext == Macros.SCENERESULT_BUT_SHOW_TIMER) {
            // 按钮显示倒计时
            this.countDownSec = Constants.ResultCountDownMin + Math.round(Math.random() * (Constants.ResultCountDownMax - Constants.ResultCountDownMin));
            this.addTimer("1", 1000, this.countDownSec, this.onBtnTimer);
            this.updateBtnTime(this.countDownSec);
        } else {
            this.removeTimer("1");
        }

        G.AudioMgr.playSound('sound/ui/uisound_16.mp3');
    }

    protected onClose() {
    }

    open(result: Protocol.SceneResultPass) {
        this.resultInfo = result;
        super.open();
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onBtnTimer(timer: Game.Timer) {
        let leftTime = this.countDownSec - timer.CallCount;
        if (this.countDownSec <= 0) {
            if (this.resultInfo.m_ucShowExit == Macros.SCENERESULT_BUT_SHOW_TIMER) {
                this.onBtnExitClick();
            } else if (this.resultInfo.m_ucShowNext == Macros.SCENERESULT_BUT_SHOW_TIMER) {
                this.onBtnNextClick();
            }
        } else {
            this.updateBtnTime(leftTime);
        }
    }

    private updateBtnTime(leftTime: number) {
        let label: UnityEngine.UI.Text;
        if (this.resultInfo.m_ucShowExit == Macros.SCENERESULT_BUT_SHOW_TIMER) {
            this.textExitLabel.text = uts.format('退出({0})', leftTime);
        } else if (this.resultInfo.m_ucShowNext == Macros.SCENERESULT_BUT_SHOW_TIMER) {
            this.textNextLabel.text = uts.format('继续({0})', leftTime);
        }
    }

    private onBtnExitClick() {
        G.ModuleMgr.pinstanceModule.onClickQuitPinstance(true);
        G.Uimgr.closeForm(SceneResultView);
    }

    private onBtnNextClick() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getClickMenuRequest(G.DataMgr.sceneData.curPinstanceID, 1));
        G.Uimgr.closeForm(SceneResultView);
    }
}