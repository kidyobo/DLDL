export class TimeoutFlag {
    private flag = false;
    private timer: Game.Timer = null;
    start(timeoutMS: number) {
        this.stopTimer();
        this.timer = new Game.Timer('timeoutflag', timeoutMS, 1, delegate(this, this.onTimer));
        this.flag = true;
    }
    stop() {
        this.stopTimer();
        this.flag = false;
    }
    get value(): boolean {
        return this.flag;
    }
    private onTimer() {
        this.flag = false;
    }
    private stopTimer() {
        if (this.timer && !this.timer.Dead) this.timer.Stop();
    }
}