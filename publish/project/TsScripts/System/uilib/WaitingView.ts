import { CommonForm,UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"

export class WaitingView extends CommonForm {
    private readonly TimerKeyCountDown = '1';

    private textInfo: UnityEngine.UI.Text;
    private openInfo: string;
    private openCountDown = 0;
    private callback: () => void;
    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.MessageBox;
    }
    protected resPath(): string {
        return UIPathData.WaitingView;
    }
    protected initElements() {
        this.textInfo = this.elems.getText("textInfo");
    }
    protected initListeners() {
    }

    open(info: string, countDown = 0, callback: () => void = null) {
        uts.log('open waiting view!');
        this.openInfo = info;
        this.openCountDown = countDown;
        this.callback = callback;
        super.open();
    }
    protected onOpen() {
        this.updateView();
    }

    protected onClose() {
        this.removeTimer(this.TimerKeyCountDown);
        this.callback = null;
    }

    private onCountDownTiemr(timer: Game.Timer) {
        let left = this.openCountDown - timer.CallCount;
        if (left > 0) {
            this.textInfo.text = uts.format(this.openInfo, left);
        } else {
            let callback = this.callback;
            if (null != callback) {
                this.close();
                callback();
            }
        }        
    }

    setInfo(info: string, countDown: number = 0) {
        if (!this.isOpened) {
            return;
        }
        this.openInfo = info;
        this.openCountDown = countDown;
        this.updateView();
    }

    private updateView() {
        if (this.openCountDown > 0) {
            this.textInfo.text = uts.format(this.openInfo, this.openCountDown);
            this.addTimer(this.TimerKeyCountDown, 1000, this.openCountDown, this.onCountDownTiemr);
        } else {
            this.textInfo.text = this.openInfo;
            this.removeTimer(this.TimerKeyCountDown);
        }
    }
}