import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
export class LoadingAnimPlayer {
    private _isRunning = false;
    public get isRunning() {
        return this._isRunning;
    }
    private assetRequest: Game.AssetRequest;
    private playingObj: UnityEngine.GameObject;
    private hasSetJump: boolean = false;
    private onloadovercallback: () => void;
    private onplayovercallback: () => void;
    runAnim(id: number, onloadovercallback: () => void, onplayovercallback: () => void): boolean {
        this.onloadovercallback = onloadovercallback;
        this.onplayovercallback = onplayovercallback;
        this._isRunning = true;
        this.hasSetJump = false;
        if (this.assetRequest) {
            this.assetRequest.Abort();
        }
        if (this.playingObj) {
            UnityEngine.GameObject.DestroyImmediate(this.playingObj);
            this.playingObj = null;
        }
        G.Uimgr.setLockerActive(true);
        this.assetRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.High2, uts.format("ui/fading/{0}.prefab", id));
        Game.ResLoader.BeginAssetRequest(this.assetRequest, delegate(this, this.onAnimLoad, id));
        return true;
    }
    private onAnimLoad(request: Game.AssetRequest, id: number) {
        G.Uimgr.setLockerActive(false);
        this.assetRequest = null;
        if (this.onloadovercallback) {
            let c = this.onloadovercallback;
            this.onloadovercallback = null;
            c();
        }
        if (request.error != null) {
            uts.logWarning("镜头动画加载错误:" + request.error);
            return;
        }
        this.playingObj = request.mainAsset.Instantiate(null, true);
        UnityEngine.GameObject.DontDestroyOnLoad(this.playingObj);
        let jump = Game.Tools.GetChild(this.playingObj, "jump");
        if (jump) {
            jump.SetActive(false);
            Game.UIClickListener.Get(jump).onClick = delegate(this, this.endPlay);
        }
        this.setJumpAble(this.hasSetJump);
        let anim = this.playingObj.GetComponentInChildren(UnityEngine.Animator.GetType()) as UnityEngine.Animator;
        //获取动画长度
        let length = Game.Tools.GetAnimLength(anim, id.toString());
        Game.Invoker.BeginInvoke(this.playingObj, "play", length, delegate(this, this.onPlayEnd));
    }
    private onPlayEnd() {
        Game.Invoker.BeginInvoke(this.playingObj, "forcenext", 3, delegate(this, this.endPlay));
        this._isRunning = false;
        if (this.onplayovercallback) {
            let c = this.onplayovercallback;
            this.onplayovercallback = null;
            c();
        }
    }
    private endPlay() {
        this._isRunning = false;
        if (this.playingObj) {
            UnityEngine.GameObject.DestroyImmediate(this.playingObj);
            this.playingObj = null;
        }
    }
    public setJumpAble(value: boolean) {
        if (value != this.hasSetJump) {
            this.hasSetJump = value;
            if (this.playingObj) {
                let jump = Game.Tools.GetChild(this.playingObj, "jump");
                if (jump) {
                    jump.SetActive(value);
                }
            }
        }
    }
}