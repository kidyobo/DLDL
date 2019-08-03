export class SlotMachine {
    private _text: UnityEngine.UI.Text;
    private _textValue: number = 0;
    private get textValue() {
        return this._textValue;
    }
    private set textValue(value: number) {
        if (this._textValue != value) {
            this._textValue = value;
            this._text.text = value.toString();
        }
    }

    /**计时器时间间隔*/
    public deltaTime: number = 50;

    private targetValue = 0;
    private targetDigits: number[] = [];
    private crtDigits: number[] = [];

    private timer: Game.Timer;
    private rollIdx = 0;

    private callback: () => void;

    setComponent(text: UnityEngine.UI.Text, callback: () => void, deltaTime: number = 50) {
        this._text = text;
        text.text = '0';
        this.deltaTime = deltaTime;
        this.callback = callback;
    }

    rollTo(value: number) {
        let crtValue = this.textValue;
        if (value <= crtValue) {
            this.textValue = value;
            return;
        }
        let crtText = crtValue.toString();

        this.targetValue = value;

        let targetStr = value.toString();
        let cnt = targetStr.length;
        let crtCnt = crtText.length;
        this.targetDigits.length = cnt;
        this.crtDigits.length = cnt;
        for (let i = 0; i < cnt; i++) {
            this.targetDigits[i] = parseInt(targetStr.charAt(i));
            if (i < cnt - crtCnt) {
                this.crtDigits[i] = 0;
            } else {
                this.crtDigits[i] = parseInt(crtText.charAt(i - cnt + crtCnt));
            }
        }
        this.rollIdx = cnt - 1;
        this.checkRoll();
    }

    private checkRoll() {
        let crtValue = this.textValue;

        let tmp = -1;
        for (let i = this.rollIdx; i >= 0; i--) {
            if (this.crtDigits[i] != this.targetDigits[i]) {
                tmp = i;
                break;
            }
        }

        if (tmp < 0) {
            // 已经滚到目标值了
            if (null != this.timer) {
                this.timer.Stop();
                this.timer = null;
            }

            if (null != this.callback) {
                this.callback();
            }
            return;
        }

        let dv = this.crtDigits[tmp] + 1;
        if (dv > 9) {
            dv = 0;
        }
        this.crtDigits[tmp] = dv;
        let v = 0;
        let cnt = this.crtDigits.length;
        for (let i = 0; i < cnt; i++) {
            let dv = this.crtDigits[i];
            if (dv > 0) {
                v += dv * Math.pow(10, cnt - i - 1);
            }
        }
        this.textValue = v;

        if (null == this.timer) {
            this.timer = new Game.Timer("slot machine", this.deltaTime, 0, delegate(this, this.onRollTimer));
        }
    }

    private onRollTimer(obj: Game.Timer) {
        this.checkRoll();
    }
}