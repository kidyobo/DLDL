import { Global as G } from "System/global"
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"

export class CollectionBar extends CommonForm {

    /**采集slider*/
    private bar: UnityEngine.UI.Image;

    /**采集描述*/
    private collectionDesText: UnityEngine.UI.Text = null;

    /**回调*/
    private m_callback: () => void = null;;

    /**采集全程时间*/
    private m_duration = 0;

    /**是否自动移除*/
    private m_autoRemove = false;

    /**吟唱相关的历史ID，由系统产生，作为每个吟唱过程的唯一标记。1为系统保留，可以匹配所有ID*/     
    private m_id = 1;

    /**吟唱相关的标记ID，由吟唱发起方指定，作为每种吟唱过程的唯一标记*/
    private m_prepareID = 0;

    /**描述文字*/
    private m_desc: string;

    private tweenSlider: Tween.TweenImageFillAmount;

    private speed = 0;
    private time: number = 0;
    startAt = 0;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Base;
    }

    protected resPath(): string {
        return UIPathData.CollectionBar;
    }

    open(prepareID: number, duration: number, callback: () => void = null, desc: string = null, autoRemove: boolean = true) {
        this.m_prepareID = prepareID;
        this.m_duration = duration;
        this.m_desc = desc;
        this.m_autoRemove = autoRemove;
        this.m_callback = callback;
        super.open();
    }

    protected initElements() {
        this.bar = this.elems.getImage('bar');
        this.collectionDesText = this.elems.getText("leftTimetext");
    }


    protected initListeners() {

    }

    protected onOpen() {
        //Game.Tools.SetLocalScale(this.bar.transform as UnityEngine.RectTransform, 0, 1, 1);
        this.time = 0;
        this.bar.fillAmount = 0;
        this.startAt = UnityEngine.Time.realtimeSinceStartup;
        //使用tween实现
        if (this.m_desc != null) {
            this.collectionDesText.text = this.m_desc;
        } else {
            this.collectionDesText.text = "";
        }
        this.speed = this.m_duration / 100;
        //this.addTimer("1", this.speed, 200, this.updateTimer);
        this.addTimer("1", 100, this.speed, this.updateTimer);
        //this.tweenSlider = Tween.TweenScale.Begin(this.bar, this.speed, G.getCacheV3(1, 1, 1));
        //this.tweenSlider.onFinished = delegate(this, this.tweenOver);
    }

    private updateTimer() {
        this.time += 1/this.speed;
        this.bar.fillAmount = this.time;
    }
    protected onClose() {
        this.m_prepareID = 0;
    }

    private tweenOver() {
        if (this.tweenSlider != null) {
            UnityEngine.UnityObject.DestroyImmediate(this.tweenSlider);
            this.tweenSlider = null;
        }
        if (this.m_autoRemove) {
            this.close();
        }
        if (null != this.m_callback) {
            this.m_callback();
        }
    }

    /**
	* 凭行为ID移除采集条，若所持ID与当前采集条ID不符合则无法取消。
	* @param id
	* 
	*/
     cancelByPrepareID(id: number): void {
        if (this.m_prepareID == id || 0 == id) {
            this.close();
        }
    }
       
     get hasShowCollection(): boolean {
         return this._opened;
     }
}