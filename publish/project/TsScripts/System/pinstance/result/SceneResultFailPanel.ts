import { Constants } from "System/constants/Constants";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { EnumSceneResultId, SceneResultView } from "System/pinstance/result/SceneResultView";
import { Macros } from "System/protocol/Macros";
import { NestedSubForm } from "System/uilib/NestedForm";
import { RegExpUtil } from "System/utils/RegExpUtil";
import { MainView } from "System/main/view/MainView";

export class SceneResultFailPanel extends NestedSubForm {

    private textDesc: UnityEngine.UI.Text;

    private btnExit: UnityEngine.GameObject;
    private textExitLabel: UnityEngine.UI.Text;
    private mask: UnityEngine.GameObject;
    private resultInfo: Protocol.SceneResultFail;
    private countDownSec: number = 0;

    constructor() {
        super(EnumSceneResultId.fail);
    }

    protected resPath(): string {
        return UIPathData.SceneResultFailView;
    }

    protected initElements() {
        this.textDesc = this.elems.getText('desc');
        this.mask = this.elems.getElement('mask');
        this.btnExit = this.elems.getElement('btnExit');
        this.textExitLabel = this.elems.getText('textExitLabel');
    }

    protected initListeners() {
        //this.addClickListener(this.btnExit, this.onBtnExitClick);
        this.addClickListener(this.mask, this.onBtnExitClick);
    }

    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        this.textDesc.text = RegExpUtil.xlsDesc2Html(this.resultInfo.m_szText);

        this.textExitLabel.text = '点击空白处关闭';
        if (this.resultInfo.m_ucShowExit == Macros.SCENERESULT_BUT_SHOW_TIMER) {
            // 按钮显示倒计时
            // this.countDownSec = Constants.ResultCountDownMin + Math.round(Math.random() * (Constants.ResultCountDownMax - Constants.ResultCountDownMin));
            // this.addTimer("1", 1000, this.countDownSec, this.onBtnTimer);
            this.updateBtnTime(this.countDownSec);
        } else {
            this.removeTimer("1");
        }
        G.AudioMgr.playSound('sound/ui/uisound_16.mp3');
    }

    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
    }

    open(result: Protocol.SceneResultFail) {
        this.resultInfo = result;
        super.open();
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onBtnTimer(timer: Game.Timer) {
        let leftTime = this.countDownSec - timer.CallCount;
        if (leftTime <= 0) {
            this.onBtnExitClick();
        } else {
            this.updateBtnTime(leftTime);
        }
    }

    private updateBtnTime(leftTime: number) {
        this.textExitLabel.text = "点击空白处关闭";
        // this.textExitLabel.text = uts.format('点击空白处关闭({0})', leftTime);
    }

    private onBtnExitClick() {
        G.ModuleMgr.pinstanceModule.onClickQuitPinstance(true);
        G.Uimgr.closeForm(SceneResultView);
    }
}