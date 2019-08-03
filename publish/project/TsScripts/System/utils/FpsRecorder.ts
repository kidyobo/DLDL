import { JavaCaller } from "./JavaCaller";
import { Global } from "../global";

export class FpsRecorder {
    private static fpscom: Game.FPS = null;
    private static fpss: Array<number> = [];
    private static readonly maxsize = 120;
    private static readonly intervalS = 5;
    static startRecord(fpscom: Game.FPS) {
        this.fpscom = fpscom;
        new Game.Timer('FpsRecorder', this.intervalS * 1000, 0, delegate(this, this.onRecord));
    }
    static copyToClipboard() {
        if (!Global.IsAndroidPlatForm) return;
        let s = 'time\tfps\n';
        for (let i=0, n=this.fpss.length; i<n; i++) {
            s += i*this.intervalS + '\t' + this.fpss[i] + '\n';
        }
        let clipboard = JavaCaller.getJavaObject('com.fy.utils.Clipboard',  null, 'getInstance');
        JavaCaller.comCallRetInt(clipboard, 'copyText', s);
    }
    private static onRecord(timer: Game.Timer) {
        this.fpss.push(this.fpscom.fps);
        if (this.fpss.length >= 2 * this.maxsize) {
            this.fpss.splice(0, this.fpss.length - this.maxsize);
        }
    }
}