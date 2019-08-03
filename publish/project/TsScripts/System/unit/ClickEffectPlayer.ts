import { CachingModel, CachingLayer, CachingSystem } from 'System/CachingSystem'
import { Global as G } from "System/global";
import { IPool, ObjectPool } from "Common/pool/ObjectPool"
import { TypeCacher } from "System/TypeCacher"
import { EffectPlayer } from "System/unit/EffectPlayer"
export class ClickEffectPlayer {
    private selectionAsset: Game.Asset;
    constructor() {
        let request = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Normal1, "effect/other/shubiaodiandi.prefab");
        Game.ResLoader.BeginAssetRequest(request, delegate(this, this.onLoad));
    }
    private onLoad(assetRequest: Game.AssetRequest) {
        if (assetRequest.error != null) {
            uts.logWarning("ClickEffect加载失败:" + "  error:" + assetRequest.error);
            return;
        }
        this.selectionAsset = assetRequest.mainAsset;
        this.selectionAsset.autoCollect = false;
    }
    /*
        指定位置播放一次特效
    */
    play(x: number, y: number, z: number) {
        if (this.selectionAsset == null) {
            return;
        }
        let effect = ClickEffectPlayerCacher.create(this.selectionAsset, x, y, z);
        effect.play();
    }
}
class ClickEffectPlayerCacher implements IPool {
    public static pool = new ObjectPool();
    private obj: UnityEngine.GameObject;
    private niceInvoker: Game.NiceInvoker;
    private thisobjnum = 0;
    constructor(selectionAsset: Game.Asset) {
        this.obj = selectionAsset.Instantiate(G.EffectRoot, false);
        this.niceInvoker = Game.NiceInvoker.Get(G.EffectRootObj);
        this.thisobjnum = ++EffectPlayer.objnum;
        this.niceInvoker.SetCall(this.thisobjnum, delegate(this, this.onLoadEffect));
    }
    public static create(selectionAsset: Game.Asset, x: number, y: number, z: number): ClickEffectPlayerCacher {
        let effect = ClickEffectPlayerCacher.pool.pop() as ClickEffectPlayerCacher;
        if (effect == null) {
            effect = new ClickEffectPlayerCacher(selectionAsset);
        }
        Game.Tools.SetGameObjectLocalPosition(effect.obj, x, y, z);
        effect.obj.SetActive(true);
        return effect;
    }
    public play() {
        this.niceInvoker.Call(this.thisobjnum, 1);
    }
    private onLoadEffect() {
        ClickEffectPlayerCacher.pool.push(this);
    }
    onDestroy() {
    }
}
export default ClickEffectPlayer;