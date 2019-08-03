import { Global as G } from 'System/global'
import { ElemFinder } from 'System/uilib/UiUtility'

enum EnumDicePhase {
    none = 0, 
    roll, 
    result, 
}

export class Dice {
    /**摇色子的时间，毫秒*/
    rollTime: number = 1500;
    /**展示结果的时间，毫秒*/
    displayResultTime: number = 1000;

    private diceRoot: UnityEngine.GameObject;

    private imgResult: UnityEngine.UI.Image;
    private altasDice: Game.UGUIAltas;

    private effRequest: Game.AssetRequest;
    private effAnimObj: UnityEngine.GameObject;

    /**骰子结果*/
    private m_result: number = -1;
    /**是否可以播放骰子特效*/
    private canPlayEff: boolean = false;
    private m_overTime: number = -1;

    /**掷骰子滚动定时器*/
    private rollTimer: Game.Timer;
    /**展示阶段，1表示滚动，2表示展示结果*/
    private displayPhase: EnumDicePhase = EnumDicePhase.none;

    private callback: () => void;

    setComponents(go: UnityEngine.GameObject, callback: () => void) {
        this.imgResult = ElemFinder.findImage(go, 'imgResult');
        this.altasDice = ElemFinder.findObject(go, 'altasDice').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.diceRoot = go;
        this.callback = callback;
        this.setResult(0);
    }

    dispose() {
        if (this.effRequest != null) {
            this.effRequest.Abort();
            this.effRequest = null;
        }
        this.callback = null;
    }

    setResult(result: number) {
        this.m_result = result;
        //if (result <= 0) {
        //    this.imgResult.gameObject.SetActive(false);
        //}
    }

    go(result: number, needEff: boolean) {
        this.m_result = result;
        if (needEff) {
            // 播放摇色子特效
            this.canPlayEff = true;
            if (null != this.effAnimObj) {
                this.effAnimObj.SetActive(true);
            } else {
                if (null == this.effRequest) {
                    this.effRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Normal1, 'effect/sequenceAnim/dice.prefab');
                    Game.ResLoader.BeginAssetRequest(this.effRequest, delegate(this, this.onDiceAnimLoaded));
                }
            }

            this.displayPhase = EnumDicePhase.roll;
            this.m_overTime = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000) + this.rollTime;
            if (null == this.rollTimer) {
                this.rollTimer = new Game.Timer("dice",100,0, delegate(this, this.onRollTimer));
            } 
        }
        else {
            this._showResult();
        }
    }

    private onRollTimer(timer: Game.Timer) {
        let now = Math.round(UnityEngine.Time.realtimeSinceStartup * 1000);
        if (now > this.m_overTime && this.m_result != 0) {
            if (EnumDicePhase.roll == this.displayPhase) {
                // 显示结果
                this._showResult();
                this._removeRollEffect();
                // 展示1s后自动消失
                this.displayPhase = EnumDicePhase.result;
                this.m_overTime = now + this.displayResultTime;
            } else if (EnumDicePhase.result == this.displayPhase) {
                this._removeTimer();
                this.displayPhase = EnumDicePhase.none;
                this.m_result = -1;
                if (null != this.callback) {
                    this.callback();
                }
            } 
        }
    }

    private _showResult(): void {
        this.imgResult.sprite = this.altasDice.Get(this.m_result.toString());
    }

    private _removeTimer(): void {
        if (null != this.rollTimer) {
            this.rollTimer.Stop();
            this.rollTimer = null;
        }
    }

    private _removeRollEffect() {
        if (null != this.effAnimObj) {
            this.effAnimObj.SetActive(false);
        }
        this.canPlayEff = false;
    }

    private onDiceAnimLoaded(request: Game.AssetRequest) {
        this.effRequest = null;
        if (request.error != null) {
            uts.logWarning("loadGameObject加载失败:" + "  error:" + request.error);
            return;
        }
        this.effAnimObj = request.mainAsset.Instantiate(this.diceRoot.transform, false);
        if (this.canPlayEff) {
            this.effAnimObj.SetActive(true);
        }
    }

    get isRollCompleted(): boolean {
        return this.displayPhase == EnumDicePhase.none;
    }

    reset(): void {
        this.m_result = 0;
        this.m_overTime = -1;
        this._removeTimer();
        this._removeRollEffect();
    }
}