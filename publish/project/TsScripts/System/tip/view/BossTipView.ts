import { Global as G } from 'System/global'
import { UIPathData } from "System/data/UIPathData"
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { TypeCacher } from "System/TypeCacher"
import { NPCQuestState } from 'System/constants/GameEnum'
import { KeyWord } from "System/constants/KeyWord"
import { Macros } from "System/protocol/Macros"
import { ElemFinder } from 'System/uilib/UiUtility'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { TipFrom } from 'System/tip/view/TipsView'


export class BossTipView extends CommonForm {

    private content: UnityEngine.GameObject = null;
    private root: UnityEngine.GameObject = null;
  
    /**monsterId*/
    private monsterId: number = 100143;
    private explain: string = '';

    private startPos: UnityEngine.Vector3;
    private endPos: UnityEngine.Vector3;
    private time: number = 6;
 
    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Base;
    }

    protected resPath(): string {
        return UIPathData.BossTipView;
    }

    protected initElements() {
        this.content = this.elems.getElement('content');
        this.root = this.elems.getElement('parent');
      
        this.startPos = this.elems.getTransform('start').localPosition;
        this.endPos = this.elems.getTransform('end').localPosition;
    }

    protected initListeners() {

    }

    open() {
       
        super.open();
    }

    protected onOpen() {

        this.content.transform.localPosition = this.startPos;
       

    }

    updatePanel(monsterId: number, str: string) {
        this.monsterId = monsterId;
        this.explain = str;
        let obj = UnityEngine.GameObject.Instantiate(this.content, this.root.transform, true) as UnityEngine.GameObject;
        obj.SetActive(true);
        let tweenPos = Tween.TweenPosition.Begin(obj, 0.25, this.endPos);
        tweenPos.method = Tween.UITweener.Method.EaseIn;

        let bossHeadImg = ElemFinder.findRawImage(obj,'head');
        G.ResourceMgr.loadImage(bossHeadImg, uts.format('images/head/{0}.png', this.monsterId));

        let taskContentText = ElemFinder.findText(obj,'textContent');
        taskContentText.text = this.explain;
        let countDownTimer: Game.Timer
        if (null == countDownTimer) {
            countDownTimer = new Game.Timer("1", 6 * 1000, 1, delegate(this, this.onCountDownTimer,obj));
        } else {
            countDownTimer.ResetTimer(6 * 1000, 1, delegate(this, this.onCountDownTimer,obj));
        }
    }

    private onCountDownTimer(timer: Game.Timer, obj: UnityEngine.GameObject) {
            let tweenAlpha = Tween.TweenAlpha.Begin(obj, 0.5, 0);
            tweenAlpha.onFinished = delegate(this, this.onFinished, obj);
    }

    private onFinished(obj: UnityEngine.GameObject) {
        if (obj != null) {
            UnityEngine.GameObject.Destroy(obj);

        }
    }

    protected onClose() {
        this.close();
    }
}