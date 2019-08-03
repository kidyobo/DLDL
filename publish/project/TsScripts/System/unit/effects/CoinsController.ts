import { Global as G } from "System/global";
import { KeyWord } from 'System/constants/KeyWord'
import { CachingLayer, CachingSystem } from 'System/CachingSystem'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { TopTitleEnum } from 'System/unit/TopTitle/TopTitleEnum'
import { TopTitleContainer } from 'System/unit/TopTitle/TopTitleContainer'

export class CoinsController {
    private readonly GroupCnt = 300;

    private obj: UnityEngine.GameObject;
    private stars: UnityEngine.GameObject;
    private coins: UnityEngine.GameObject[] = [];
    private nameBoard: TopTitleContainer;

    private position: UnityEngine.Vector3;
    private num = 0;

    private assetRequest: Game.AssetRequest = null;
    private tweenPath: Tween.TweenPath;
    private tweenTarget: Tween.TweenTarget;

    private isLoading = false;
    private _active: boolean = true;

    constructor() {
        
    }

    setParams(num: number, position: UnityEngine.Vector3) {
        this.position = position;
        this.num = num;

        if (null != this.obj) {
            this.afterLoaded();
        } else if (!this.isLoading) {
            this.isLoading = true;
            this.assetRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Low3, "effect/other/GoldsWrapper.prefab");
            Game.ResLoader.BeginAssetRequest(this.assetRequest, delegate(this, this.onLoad));
        }
    }

    private onLoad(assetRequest: Game.AssetRequest) {
        this.isLoading = false;
        if (assetRequest.error != null) {
            return;
        }
        this.obj = assetRequest.mainAsset.Instantiate(G.UnitMgr.transform, true);
        let transform = this.obj.transform;
        this.stars = Game.Tools.GetChild(this.obj, 'stars');
        let coin = Game.Tools.GetChild(this.obj, 'coin');
        this.coins.push(coin);

        this.nameBoard = new TopTitleContainer(transform);
        let v3 = G.cacheVec3;
        v3.Set(0, 40 / G.CameraSetting.xMeterScale, 0);
        this.nameBoard.containerRoot.offset = v3;
        this.nameBoard.setTextTopTitleValue(0,TextFieldUtil.getColorText('钻石×' + this.num, Color.NAME_WHITE));
        this.nameBoard.setActive(true);
        this.afterLoaded();
    }

    private afterLoaded() {
        this.setActive(true);

        this.stars.SetActive(false);
        let totalCnt = Math.max(1, Math.round(this.num / this.GroupCnt));

        let transform = this.obj.transform;
        let coinTmpl = this.coins[0];
        for (let i = 1; i < totalCnt; i++) {
            let c = UnityEngine.GameObject.Instantiate(coinTmpl, transform) as UnityEngine.GameObject;
            c.transform.localPosition = G.getCacheV3(Math.random(), 0, Math.random());
            this.coins.push(c);
        }
        let coinsLen = this.coins.length;
        for (let i = 0; i < coinsLen; i++) {
            this.coins[i].SetActive(i < totalCnt);
        }

        transform.position = this.position;

        let tweenPos = UnityEngine.Vector3.op_Subtraction(this.position, G.UnitMgr.hero.getWorldPosition());
        tweenPos = UnityEngine.Vector3.op_Addition(this.position, UnityEngine.Vector3.op_Multiply(tweenPos.normalized, 2));
        let secondPos = UnityEngine.Vector3.op_Addition(tweenPos, UnityEngine.Vector3.op_Multiply(tweenPos.normalized, 0.5));
        
        let path: UnityEngine.Vector3[] = [tweenPos];
        let tweenPath = Tween.TweenPath.Begin(this.obj, null, 0.4, path, 1, 0, 0);
        this.tweenPath = tweenPath;
        tweenPath.onFinished = delegate(this, this.onTweenEnd, secondPos);
    }

    private onTweenEnd(secondPos: UnityEngine.Vector3) {
        let path: UnityEngine.Vector3[] = [secondPos];
        let tweenPath = Tween.TweenPath.Begin(this.obj, null, 0.2, path, 0.5, 0, 0);
        this.tweenPath = tweenPath;
        tweenPath.onFinished = delegate(this, this.onTweenSecondEnd);
    }

    private onTweenSecondEnd() {
        Game.Invoker.BeginInvoke(this.obj, 'd', 2, delegate(this, this.onDisapear));
    }

    private onDisapear() {
        this.nameBoard.setActive(false);
        for (let c of this.coins) {
            c.SetActive(false);
        }
        this.stars.SetActive(true);
        this.tweenTarget = Tween.TweenTarget.Begin(this.obj, 1, G.UnitMgr.hero.model.transform, true);
        this.tweenTarget.method = Tween.UITweener.Method.EaseIn;
        this.tweenTarget.onFinished = delegate(this, this.onTweenPositionEnd);
    }

    private onTweenPositionEnd() {
        this.setActive(false);
        G.UnitMgr.removeDropCoins(this);
    }

    public setActive(value: boolean) {
        if (value != this._active) {
            this._active = value;
            if (this.obj != null) {
                this.obj.SetActive(value);
            }
            if (this.nameBoard != null) {
                this.nameBoard.setActive(value);
            }
        }
    }

    public destroy() {
        if (null != this.obj) {
            UnityEngine.GameObject.Destroy(this.obj);
            this.obj = null;
        }

        if (null != this.nameBoard) {
            this.nameBoard.destroy(false);
            this.nameBoard = null;
        }
        
        if (this.assetRequest != null) {
            this.assetRequest.Abort();
            this.assetRequest = null;
        }

        if (null != this.tweenPath) {
            UnityEngine.GameObject.Destroy(this.tweenPath);
        }

        if (null != this.tweenTarget) {
            UnityEngine.GameObject.Destroy(this.tweenTarget);
        }
    }
}