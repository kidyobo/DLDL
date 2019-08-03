import { Global as G } from "System/global"
import { Macros } from 'System/protocol/Macros'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { FloatShowType } from 'System/floatTip/FloatTip'
import { CommonForm, UILayer, GameObjectGetSet, TextGetSet } from 'System/uilib/CommonForm'

export class ActionBar {
    //ui
    private experienceBar: GameObjectGetSet;
    private tweenSlider0: Tween.TweenScale;
    private tweenSlider1: Tween.TweenScale;
    private tweenSlider2: Tween.TweenScale;
    private expBarText: TextGetSet;
    private randomPos: GameObjectGetSet;
    private startPoint: GameObjectGetSet;
    private endPoint: GameObjectGetSet;
    private btn_exp: GameObjectGetSet;
    private starObjs: GameObjectGetSet[] = [];
    private jingyanEffect: GameObjectGetSet;
    private xingxingEffect: GameObjectGetSet;
    //data
    private startPos: UnityEngine.Vector2 = new UnityEngine.Vector2(0, 0);
    private starNum = 0;
    private tweenSliderSpendTime = 0.4;
    private besizerSpeed = 9;
    private maxStars = 18;
    private angele = 20;
    private maxExp = 0;
    private curExp = 0;
    private barWidth = 1334;
    private maxShowStarValue = 50000;
    private delayExpDelta = 0;
    private delayIsLvUp: boolean = false;
    private isPlayingStarEffect: boolean = false;
    private isPlayingTweenAnimation: boolean = false;
    private isFinshCreatStars: boolean = false;
    private delayReportTimer: Game.Timer;
    private stateIndex: number = 0;
    private expAnimDelta: number = 0;


    setBar(expArea: GameObjectGetSet, starsArea: GameObjectGetSet) {
        let rectUiManger = ElemFinderMySelf.findRectTransForm(G.Uimgr.gameObject);
        let uiWidth = rectUiManger.sizeDelta.x;
        if (G.ScreenScaleMgr.NeedAgainSetScreenScale) {
            this.barWidth = uiWidth - G.ScreenScaleMgr.indentWidth;
        } else {
            this.barWidth = uiWidth;
        }
        this.experienceBar = new GameObjectGetSet(ElemFinder.findObject(expArea.gameObject, 'bar'));
        this.expBarText = new TextGetSet(ElemFinder.findText(expArea.gameObject, "expText"));
        this.endPoint = new GameObjectGetSet(ElemFinder.findObject(expArea.gameObject, 'end/endPoint'));
        this.jingyanEffect = new GameObjectGetSet(ElemFinder.findObject(this.endPoint.gameObject, 'jingyan_Effect'));
        this.jingyanEffect.SetActive(false);
        this.expBarText.gameObject.SetActive(false);
        //星星
        this.xingxingEffect = new GameObjectGetSet(ElemFinder.findObject(starsArea.gameObject, 'xingxing_Effect'));
        this.startPoint = new GameObjectGetSet(ElemFinder.findObject(starsArea.gameObject, 'startPoint'));
        this.randomPos = new GameObjectGetSet(ElemFinder.findObject(starsArea.gameObject, 'randomPos'));
        //经验按钮
        this.btn_exp = new GameObjectGetSet(ElemFinder.findObject(expArea.gameObject, 'btn_exp'));
        Game.UITouchListener.Get(this.btn_exp.gameObject).onTouchBegin = delegate(this, this.onTouchBegin);
        Game.UITouchListener.Get(this.btn_exp.gameObject).onTouchEnd = delegate(this, this.onTouchEnd);
    }

    private onTouchBegin() {
        this.expBarText.gameObject.SetActive(true);
    }

    private onTouchEnd() {
        this.expBarText.gameObject.SetActive(false);
    }

    onExpChange(expDelta: number, isLvUp: boolean) {
        if (this.isPlayingStarEffect || this.isPlayingTweenAnimation) {
            //当正在飘星星动画合读条时,来了新的经验,这种情况只能先缓存延迟处理
            this.stateIndex++;
            if (this.stateIndex == 10) {
                //累加10次状态还没清掉的话,强制清掉吧
                this.isPlayingStarEffect = false;
                this.isPlayingTweenAnimation = false;
                this.stateIndex = 0;
            }
            this.delayExpDelta += expDelta;
            if (isLvUp) {
                this.delayIsLvUp = true;
            }
            if (this.delayReportTimer == null) {
                this.delayReportTimer = new Game.Timer('delay', 500, 0, delegate(this, this.delayPlayEffect));
            }
            return;
        };
        this.playEffect(expDelta, isLvUp);
    }

    private delayPlayEffect() {
        if (this.isPlayingStarEffect || this.isPlayingTweenAnimation) return;
        this.stateIndex = 0;
        //此时说明该次延迟结束,可以进行下次了
        this.playEffect(this.delayExpDelta, this.delayIsLvUp);
        if (this.delayReportTimer != null) {
            this.delayReportTimer.Stop();
            this.delayReportTimer = null;
            this.delayExpDelta = 0;
            this.delayIsLvUp = false;
        }
    }


    private playEffect(expDelta: number, isLvUp: boolean) {
        let data = G.DataMgr.heroData;
        this.curExp = data.getProperty(Macros.EUAI_CUREXP);
        this.maxExp = G.DataMgr.roleAttributeData.getConfig(data.level).m_uiExperience;
        this.expBarText.text = this.curExp + "/" + this.maxExp + '(' + Math.floor(this.curExp / this.maxExp * 100) + '%)';
        if (expDelta > 0) {
            if (expDelta >= this.maxShowStarValue) {
                //经验获得超过50000才飘星星
                this.playStarEffect(isLvUp);
            } else if (this.expAnimDelta > 1000) {
                //经验获得大于1000在播进度条,节省性能
                this.playExpAnimation(isLvUp);
            } else {
                //其他情况就先累加经验,只刷新显示值即可
                this.expAnimDelta += expDelta;
            }
        }
        else {
            let endValue = this.curExp / this.maxExp;
            Game.Tools.SetLocalScale(this.experienceBar.transform as UnityEngine.RectTransform, endValue, 1, 1);
        }
    }

    private playStarEffect(isLvUp: boolean) {
        this.isPlayingStarEffect = true;
        let oldScaleX = this.experienceBar.transform.localScale.x;
        let endX = oldScaleX * this.barWidth;
        this.endPoint.rectTransform.anchoredPosition = G.getCacheV2(endX, 0);
        this.starNum = 0;
        this.besizerSpeed = 9;
        this.jingyanEffect.SetActive(true);
        for (let i = 0; i < this.maxStars; i++) {
            let obj: GameObjectGetSet;
            if (this.starObjs[i] == null) {
                obj = new GameObjectGetSet(UnityEngine.UnityObject.Instantiate(this.xingxingEffect.gameObject, this.startPoint.transform, true) as UnityEngine.GameObject);
                this.starObjs.push(obj);
            }
            else {
                obj = this.starObjs[i];
                obj.rectTransform.anchoredPosition = this.startPos;
            }

            // if (this.isFinshCreatStars) {
            //     obj = this.starObjs[i];
            //     obj.rectTransform.anchoredPosition = this.startPos;
            // } else {
            //     obj = new GameObjectGetSet(UnityEngine.UnityObject.Instantiate(this.xingxingEffect.gameObject, this.startPoint.transform, true) as UnityEngine.GameObject);
            // }

            obj.SetActive(true);
            let x = 150 - Math.random() * 300;
            let y = 200 - Math.random() * 300;
            this.randomPos.rectTransform.anchoredPosition = new UnityEngine.Vector2(x, y);
            let tween1 = Tween.TweenPosition.Begin(obj.gameObject, 0.6, this.randomPos.transform.position, true);
            tween1.onFinished = delegate(this, this.onTweenOneOver, obj, isLvUp);
        }
    }

    private onTweenOneOver(obj: GameObjectGetSet, isLvUp: boolean) {
        let endX = this.endPoint.rectTransform.anchoredPosition.x;
        let angele: number = 0;
        if (obj.rectTransform.anchoredPosition.x < endX) {
            angele = -this.angele;
        } else {
            angele = this.angele;
        }
        //经过实验,每次速度增加0.2效果较好
        this.besizerSpeed = this.besizerSpeed + 0.2;
        Game.Tools.AddBesizer(obj.gameObject, this.besizerSpeed, angele, this.endPoint.gameObject, delegate(this, this.onTweenBesizerOver, obj, isLvUp));
    }

    private onTweenBesizerOver(obj: GameObjectGetSet, isLvUp: boolean) {
        this.starNum++;
        obj.SetActive(false);
        // if (!this.isFinshCreatStars) {
        //     this.starObjs.push(obj);
        // }
        if (this.starNum == this.maxStars) {
            this.isPlayingStarEffect = false;
            // this.isFinshCreatStars = true;
            this.jingyanEffect.SetActive(false);
            this.playExpAnimation(isLvUp);
        }
    }

    private playExpAnimation(isLvUp: boolean) {
        this.isPlayingTweenAnimation = true;
        let oldScaleX = this.experienceBar.transform.localScale.x;
        if (isLvUp && oldScaleX < 1) {
            //说明升级了(先tween到1,在从0 tween到现在的值)
            this.tweenSliderSpendTime = 1 - oldScaleX;
            this.tweenSlider0 = Tween.TweenScale.Begin(this.experienceBar.gameObject, this.tweenSliderSpendTime, G.getCacheV3(1, 1, 1));
            this.tweenSlider0.onFinished = delegate(this, this.tweenSliderOver0);
        } else {
            //没有升级
            let endValue = this.curExp / this.maxExp;
            if (endValue == oldScaleX) {
                //不知什么情况会出现这种情况,可能延迟导致,tweenFinsh就进不去了,主动清一下状态
                this.clearAnimateState();
                return;
            }
            this.tweenSliderSpendTime = endValue - oldScaleX;
            this.tweenSlider1 = Tween.TweenScale.Begin(this.experienceBar.gameObject, this.tweenSliderSpendTime, G.getCacheV3(endValue, 1, 1));
            this.tweenSlider1.onFinished = delegate(this, this.tweenOverEnd1);
        }
    }

    private tweenSliderOver0() {
        let endValue = this.curExp / this.maxExp;
        this.tweenSliderSpendTime = endValue;
        Game.Tools.SetLocalScale(this.experienceBar.transform as UnityEngine.RectTransform, 0, 1, 1);
        this.tweenSlider2 = Tween.TweenScale.Begin(this.experienceBar.gameObject, this.tweenSliderSpendTime, G.getCacheV3(endValue, 1, 1));
        this.tweenSlider2.onFinished = delegate(this, this.tweenOverEnd2);
    }

    private tweenOverEnd1() {
        this.clearAnimateState();
    }

    private tweenOverEnd2() {
        this.clearAnimateState();
    }

    private clearAnimateState() {
        this.isPlayingTweenAnimation = false;
        this.expAnimDelta = 0;
    }

    /**
     * 关闭特效显示（在未激活状态下 c#里的协程不执行，导致动画暂停了，手动关闭）
     */
    public clearAnimateStateForMainView() {
        this.isPlayingTweenAnimation = false;
        this.expAnimDelta = 0;

        let count = this.starObjs.length;

        for (let i = 0; i < count; i++) {
            this.starObjs[i].SetActive(false);
        }
        this.jingyanEffect.SetActive(false);
    }
}
