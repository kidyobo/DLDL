export class TimeInterval {
    private lastTime: number = -0x7fffffff;
    private interval: number = 0;
    public constructor(intervalSecond: number) {
        this.interval = intervalSecond;
    }
    public get isCome(): boolean {
        let now = UnityEngine.Time.realtimeSinceStartup;
        if (now - this.lastTime < this.interval) {
            return false;
        }
        else {
            this.lastTime = now;
            return true;
        }
    }
}