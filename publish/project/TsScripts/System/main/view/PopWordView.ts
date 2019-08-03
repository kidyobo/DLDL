import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from 'System/data/UIPathData'
import { IconItem } from 'System/uilib/IconItem'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { TipFrom } from 'System/tip/view/TipsView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { EnumMainViewChild } from 'System/main/view/MainView'

export class PopWordView extends CommonForm {
    public effectRoot: UnityEngine.Transform;
    public popWord: UnityEngine.GameObject;
    private popWordPool: PopWord[] = [];
    private width: number;
    private height: number;
    private speed: number = 0;
    private meterSpeed: number = 0;
    private list = [];
    constructor() {
        super(1);
        this.openSound = null;
        this.closeSound = null;
    }

    protected resPath(): string {
        return UIPathData.PopWordView;
    }

    protected initElements() {
        this.effectRoot = this.elems.getElement("effectRoot").transform;

        let size = (this.effectRoot as UnityEngine.RectTransform).rect;
        this.width = size.width;
        this.height = size.height*0.5;
        this.popWord = this.elems.getElement('popWord');
    }
    layer(): UILayer {
        return UILayer.Effect;
    }
    public open(speed: number) {
        this.speed = speed;
        super.open();
    }
    protected initListeners() {
    }
    protected onOpen() {
        this.meterSpeed = this.width / this.speed;
        this.addTimer("check", 100, 0, this.onUpdate);
        //for (let i = 0; i < 5000; i++) {
        //    if (i % 10 == 1) {
        //        this.addPopWord("你好呀", 5);
        //    }
        //    else if (i % 10 == 2) {
        //        this.addPopWord("好多人发弹幕呀", 5);
        //    }
        //    else if (i % 10 == 3) {
        //        this.addPopWord("好多人发弹幕呀，我试试20个字怎么样", 5);
        //    }
        //    else{
        //        this.addPopWord("hello/15/15/15/15/15/15/15/15/15", 5);
        //    }
        //}
    }
    protected onClose() {
        this.list = [];
        Game.Tools.ClearChildren(this.effectRoot);
    }
    private numDelta: number[] = [];
    private lengthDelta: number[] = [];
    private getIndex(current: number) {
        let num = Math.floor(Math.random() * 5);
        if (!this.numDelta[num]) {
            this.numDelta[num] = 0;
            this.lengthDelta[num] = 0;
        }
        if (current - this.numDelta[num] > this.lengthDelta[num]) {
            return num;
        }
        else {
            for (let i = 0; i < 5; i++) {
                if (i == num) {
                    continue;
                }
                if (current - this.numDelta[i] > this.lengthDelta[i]) {
                    return i;
                }
            }
        }
        return -1;
    }
    private onUpdate() {
        if (this.list.length > 0) {
            let current = UnityEngine.Time.realtimeSinceStartup;
            let num = this.getIndex(current);
            if (num>=0) {
                this.numDelta[num] = current;
                let pair = this.list[0];
                this.list.splice(0, 1);
                let info: string = pair.info;
                let vipLevel: number = pair.vipLevel;
                let word: PopWord = null;
                if (this.popWordPool.length > 0) {
                    word = this.popWordPool.pop();
                } else {
                    let obj = UnityEngine.UnityObject.Instantiate(this.popWord, this.effectRoot, false) as UnityEngine.GameObject;
                    word = new PopWord();
                    word.gameObject = obj;
                    word.transform = obj.transform;
                    word.text = ElemFinder.findUIText(obj, 'word');
                    word.vipText = ElemFinder.findText(obj, 'vip');
                }
                word.text.text = info;
                word.vipText.text = vipLevel.toString();
                word.text.ProcessText();
                let wordWidth = word.text.renderWidth;
                this.lengthDelta[num] = (wordWidth + 60) / this.meterSpeed;
                let y = num / 5 * this.height - 20;
                word.transform.localPosition = G.getCacheV3(this.width / 2+60, y, 0);
                let tween = Tween.TweenPosition.Begin(word.gameObject, this.speed, G.getCacheV3(-this.width / 2 - wordWidth, y, 0), false);
                tween.onFinished = delegate(this, this.onWordFloatEnd, word);
            }
        }
    }
    ////////////////////弹幕////////////////////////////
    addPopWord(info: string, vipLevel: number) {
        this.list.push({ info, vipLevel});
    }
    private onWordFloatEnd(word: PopWord) {
        this.popWordPool.push(word);
    }
}
class PopWord {
    public gameObject: UnityEngine.GameObject;
    public transform: UnityEngine.Transform;
    public text: UnityEngine.UI.UIText;
    public vipText: UnityEngine.UI.Text;
}