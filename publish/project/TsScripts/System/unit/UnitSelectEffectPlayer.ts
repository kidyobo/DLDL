import { CachingModel, CachingLayer, CachingSystem } from 'System/CachingSystem'
import { Global as G } from "System/global";
import { IPool, ObjectPool } from "Common/pool/ObjectPool"
import { TypeCacher } from "System/TypeCacher"
export class UnitSelectEffectPlayer {
    private follower_red: Game.TransformFollower;
    private follower_blue: Game.TransformFollower;
    private _redtarget: UnityEngine.Transform;
    private set redtarget(value: UnityEngine.Transform) {
        if (this._redtarget != value) {
            this._redtarget = value;
            this.follower_red.target = value;
        }
    }
    private _bluetarget: UnityEngine.Transform;
    private set bluetarget(value: UnityEngine.Transform) {
        if (this._bluetarget != value) {
            this._bluetarget = value;
            this.follower_blue.target = value;
        }
    }

    public initialize() {
        let selectionAsset = Game.ResLoader.LoadAsset("effect/other/xuanzhong_red.prefab");
        selectionAsset.autoCollect = false;
        let selectionEffect = selectionAsset.Instantiate(G.EffectRoot, false);
        this.follower_red = selectionEffect.AddComponent(Game.TransformFollower.GetType()) as Game.TransformFollower;
        this.follower_red.target = G.EffectRoot;
        this.follower_red.offset = G.getCacheV3(0, 0.001, 0);

        selectionAsset = Game.ResLoader.LoadAsset("effect/other/xuanzhong_blue.prefab");
        selectionAsset.autoCollect = false;
        selectionEffect = selectionAsset.Instantiate(G.EffectRoot, false);
        this.follower_blue = selectionEffect.AddComponent(Game.TransformFollower.GetType()) as Game.TransformFollower;
        this.follower_blue.target = G.EffectRoot;
        this.follower_blue.offset = G.getCacheV3(0, 0.001, 0);
    }
    public selectTarget(target: UnityEngine.Transform, isFriend: boolean) {
        if (isFriend) {
            this.bluetarget = target ? target : G.EffectRoot;;
            this.redtarget = G.EffectRoot;
        }
        else {
            this.bluetarget = G.EffectRoot;
            this.redtarget = target ? target : G.EffectRoot;;
        }
    }
}