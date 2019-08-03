import { ElemFinder } from 'System/uilib/UiUtility'



export class ScrollSlot {

    /**最大滚动次数*/
    private readonly MaxScrollCount = 20;

    private imgNum: UnityEngine.UI.Image;
    private numAtals: Game.UGUIAltas;

    /**计时器时间间隔*/
    public deltaTime: number = 50;
    private timer: Game.Timer;
    private callback: () => void = null;
  
    private startNum = 0;
    private step: number = 0;
    /**是否接近目标数字*/
    private isApproachTargetNum: boolean = false;
    private targetNum: number = -1;


   


    setCommponent(go: UnityEngine.GameObject, numAtals: Game.UGUIAltas) {
        this.numAtals = numAtals;
        this.imgNum = ElemFinder.findImage(go, "imgNum");
    }

    /**
     * 假滚动到设置点，开始发协议
     * @param callback
     */
    startScroll(callback: () => void = null) {
        this.reset();
        this.callback = callback;
        if (null == this.timer) {
            this.timer = new Game.Timer("slot", this.deltaTime, 0, delegate(this, this.onRollTimer));
        }
    }

    /**
     * 收到协议后，滚动到具体数字
     * @param num
     */
    scrollTo(num: number) {
        this.targetNum = num;
        this.isApproachTargetNum = true;
    }


    stopScroll() {
        this.stopTimer();
        this.reset();
    }

    private onRollTimer(obj: Game.Timer) {
        this.startNum++;
        this.startNum = this.startNum % 10;
        this.imgNum.sprite = this.numAtals.Get(this.startNum.toString());

        this.step++;
        if (this.step >= this.MaxScrollCount && this.callback) {
            this.callback();
        }

        if (this.isApproachTargetNum) {
            if (this.startNum == this.targetNum) {
                this.stopTimer();
            }
        }
    }

    private stopTimer() {
        if (this.timer != null) {
            this.timer.Stop();
            this.timer = null;
        }
        this.targetNum = -1;
        this.isApproachTargetNum = false;
        this.step = 0;
    }

    private reset() {
        this.targetNum = -1;
        this.isApproachTargetNum = false;
        this.startNum = 0;
        this.step = 0;
    }

}