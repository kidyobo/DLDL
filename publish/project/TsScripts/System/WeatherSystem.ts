import { Global as G } from "System/global";
import { TypeCacher } from "System/TypeCacher"
export enum Weather {
    None,
    Rain,
    Snow,
    Flower,
    Leaf,
    Other,
}
export class WeatherSystem {
    private static assetRequest: Game.AssetRequest = null;
    private static lastWeather: Weather = Weather.None;
    private static lastPrefab: UnityEngine.GameObject = null;

    private static particles: UnityEngine.ParticleSystem[] = null;
    private static thunder: Thunder = null;
    public static change(weather: Weather) {
        if (weather == this.lastWeather) {
            this.setParams();
            return;
        }
        this.particles = null;
        this.lastWeather = weather;

        if (this.assetRequest != null) {
            this.assetRequest.Abort();
            this.assetRequest = null;
        }
        if (this.lastPrefab != null) {
            UnityEngine.GameObject.Destroy(this.lastPrefab);
            this.lastPrefab = null;
        }
        if (this.thunder) {
            this.thunder.destroy();
            this.thunder = null;
        }
        switch (weather) {
            case Weather.Rain:
                this.assetRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Low3, "effect/weather/rain.prefab");
                this.thunder = new Thunder();
                break;
            case Weather.Snow:
                this.assetRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Low3, "effect/weather/snow.prefab");
                break;
            default:
                break;
        }
        if (this.assetRequest != null) {
            Game.ResLoader.BeginAssetRequest(this.assetRequest, delegate(this, this.onLoad));
        }
    }

    private static onLoad(assetRequest: Game.AssetRequest) {
        if (assetRequest.error != null) {
            uts.logError("加载天气错误：" + assetRequest.error);
            return;
        }
        let mainCamera = G.getMainCamera();
        let obj = assetRequest.mainAsset.Instantiate(mainCamera.transform, false);
        let tran = obj.transform;
        this.particles = tran.GetComponentsInChildren(TypeCacher.ParticleSystem) as UnityEngine.ParticleSystem[];

        this.lastPrefab = obj;
        this.setParams();
    }

    public static setActive(value: boolean) {
        if (this.lastPrefab != null) {
            this.lastPrefab.SetActive(false);
        }
    }

    private static setParams() {
        if (this.lastPrefab == null) {
            return;
        }
        this.lastPrefab.transform.localPosition = G.getCacheV3(0, G.MapCamera.size, 0);

        let len = Game.ArrayHelper.GetArrayLength(this.particles);
        for (let i = 0; i < len; i++) {
            let p = Game.ArrayHelper.GetArrayValue(this.particles, i) as UnityEngine.ParticleSystem;
            p.Simulate(1);
            p.Play();
        }
    }
}
class Thunder {
    private light: Game.CameraEffect;
    private material: UnityEngine.Material;
    private timer: Game.Timer = null;
    private tweenShader: Tween.TweenShaderValue;
    constructor() {
        this.light = G.MapCamera.gameObject.AddComponent(Game.CameraEffect.GetType()) as Game.CameraEffect;
        this.light.material = G.MaterialMgr.rainEffectMat;
        this.material = this.light.material;
        this.material.SetFloat("_lightFactor", 1);
        this.light.enabled = true;
        let currentCurve = new UnityEngine.AnimationCurve();
        currentCurve.AddKey(0, 1);
        currentCurve.AddKey(0.15, 0.5);
        currentCurve.AddKey(0.3, 1);
        currentCurve.AddKey(0.6, 0);
        this.tweenShader = G.Root.AddComponent(Tween.TweenShaderValue.GetType()) as Tween.TweenShaderValue;
        this.tweenShader.enabled = false;
        this.tweenShader.animationCurve = currentCurve;
        this.timer = new Game.Timer("rainLight", 8000 + Math.random() * 10000, 0, delegate(this, this.lightCall));
    }
    destroy() {
        if (this.light != null) {
            UnityEngine.GameObject.DestroyImmediate(this.tweenShader);
            UnityEngine.GameObject.Destroy(this.light);
            this.tweenShader = null;
            this.light = null;
            this.timer.Stop();
            this.timer = null;
        }
    }
    private lightCall() {
        Tween.TweenShaderValue.BeginSingle(G.Root, 0.6, this.material, "_lightFactor", 1, 2);
        G.AudioMgr.playSound("sound/weather/thunder1.mp3");
    }
}