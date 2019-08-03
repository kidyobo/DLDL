import { CachingModel, CachingLayer, CachingSystem } from 'System/CachingSystem'
import { Global as G } from "System/global";
import { IPool, ObjectPool } from "Common/pool/ObjectPool"
import { TypeCacher } from "System/TypeCacher"
export class EffectPlayer {
    static count: number = 0;
    public static pool: { [key: string]: EffectPlayer[] } = {};
    static play(pos: UnityEngine.Vector3, lookAtPos: UnityEngine.Vector3, effectName: string, destroyInSeconds: number, playerSkill: boolean, countnumber: boolean): void {
        let settingData = G.DataMgr.settingData;
        if (playerSkill && settingData.HideSelfSkillEffect) {
            return;
        }
        if (countnumber) {
            if (settingData.HideSkillEffects) {
                return;
            }
            else if (EffectPlayer.count > 10) {
                return;
            }
        }
        let group = EffectPlayer.pool[effectName];
        if (!group) {
            group = EffectPlayer.pool[effectName] = [];
        }
        let effect: EffectPlayer = null;
        for (let e of group) {
            if (!e.isPlaying) {
                effect = e;
                break;
            }
        }
        if (effect == null) {
            effect = new EffectPlayer();
            effect.effectName = effectName;
            group.push(effect);
        }
        effect.pos = pos;
        effect.lookAtPos = lookAtPos;
        effect.destroyInSeconds = destroyInSeconds;
        effect.play();
    }

    private obj: UnityEngine.GameObject;
    private trans: UnityEngine.Transform;
    public pos: UnityEngine.Vector3;
    public lookAtPos: UnityEngine.Vector3;
    public effectName: string;
    public destroyInSeconds: number;
    private cost: number = 0;
    private niceInvoker: Game.NiceInvoker;
    private isPlaying = false;
    public static objnum = 0;
    private thisobjnum = 0;
    constructor() {
        this.niceInvoker = Game.NiceInvoker.Get(G.EffectRootObj);
        this.thisobjnum = ++EffectPlayer.objnum;
        this.niceInvoker.SetCall(this.thisobjnum, delegate(this, this.onPlayEnd));
        // uts.log("EffectPlayer.objnum：" + EffectPlayer.objnum);
    }
    public play() {
        EffectPlayer.count++;
        this.isPlaying = true;
        if (this.obj == null) {
            this.cost = UnityEngine.Time.realtimeSinceStartup;
            let effectAssetRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Normal1, uts.format("effect/{0}.prefab", this.effectName));
            Game.ResLoader.BeginAssetRequest(effectAssetRequest, delegate(this, this.onLoadEffect));
        }
        else {
            this.cost = 0;
            this.loadEffect();
        }
    }
    private onLoadEffect(request: Game.AssetRequest) {
        if (request.error != null) {
            uts.logWarning("effect加载失败:" + "  error:" + request.error);
            this.loadEffect();
            return;
        }
        this.cost = UnityEngine.Time.realtimeSinceStartup - this.cost;
        let obj = request.mainAsset.Instantiate(G.EffectRoot, true);
        //在obj内部缓存下transform对象
        this.trans = obj.transform;
        this.obj = obj;
        this.loadEffect();
    }
    private loadEffect() {
        if (this.cost > 1) {
            this.onPlayEnd();
        }
        else {
            if (this.obj != null) {
                Game.Tools.SetGameObjectLocalPosition(this.obj, this.pos);
                if (this.lookAtPos != null && this.lookAtPos.x != this.pos.x &&
                    this.lookAtPos.z != this.pos.z) {
                    let t = this.trans as UnityEngine.Transform;
                    t.LookAt(this.lookAtPos);
                }
                this.obj.SetActive(true);
                this.niceInvoker.Call(this.thisobjnum, this.destroyInSeconds);
            }
            else {
                this.onPlayEnd();
            }
        }
    }
    private onPlayEnd() {
        EffectPlayer.count--;
        if (this.obj) {
            this.obj.SetActive(false);
        }
        this.isPlaying = false;
    }
}