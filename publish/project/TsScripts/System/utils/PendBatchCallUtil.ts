
export class PendBatchCall {
    private static timers: { [index: string]: Game.Timer } = {};
    static pendBatchCall(key: string, delayTimeMs: number, callback:(...args)=>void) {
        let timer = this.timers[key];
        if (timer && !timer.Dead) {
            timer.Stop();
        }
        this.timers[key] = new Game.Timer(key, delayTimeMs, 1, delegate(this, this.onTimer, callback))
    }
    private static onTimer(timer:Game.Timer, callback) {
        callback();
    }
}