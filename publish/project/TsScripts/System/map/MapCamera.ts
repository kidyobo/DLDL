import { Global as G } from "System/global";
export class MapCamera {
    private camera: UnityEngine.Camera;
    public gameObject: UnityEngine.GameObject;
    private waterWaver: Game.CameraEffect;
    private waterWaverTween: UnityEngine.GameObject;
    private material: UnityEngine.Material;
    private radialBlur: Game.RadialBlurRenderer;
    private fov: Tween.TweenFov;

    private cameraDark: Game.CameraEffect;
    private cameraDarkMaterial: UnityEngine.Material;
    private cameraDarkTween: UnityEngine.GameObject;
    constructor(camera: UnityEngine.Camera) {
        this.camera = camera;
        this.gameObject = this.camera.gameObject;
        this.waterWaver = this.gameObject.AddComponent(Game.CameraEffect.GetType()) as Game.CameraEffect;
        this.waterWaver.material = G.MaterialMgr.cameraEffectMat;
        this.waterWaverTween = new UnityEngine.GameObject("waterWaverTween");
        Game.DonotDestroyManager.Add(this.waterWaverTween);

        this.cameraDark = this.gameObject.AddComponent(Game.CameraEffect.GetType()) as Game.CameraEffect;
        this.cameraDark.material = G.MaterialMgr.cameraDarkMaterial;
        this.cameraDarkMaterial = G.MaterialMgr.cameraDarkMaterial;
        this.cameraDark.enabled = false;
        this.cameraDarkTween = new UnityEngine.GameObject("cameraDarkTween");
        Game.DonotDestroyManager.Add(this.cameraDarkTween);

        this.material = this.waterWaver.material
        this.fov = this.gameObject.AddComponent(Tween.TweenFov.GetType()) as Tween.TweenFov;
        this.fov.enabled = false;

        let timescale = this.gameObject.AddComponent(Tween.TweenTimeScale.GetType()) as Tween.TweenTimeScale;
        timescale.enabled = false;
        timescale.timeScaled = false;
        timescale.animationCurve = G.getCurve("TimeScaleCurve");

        this.radialBlur = this.gameObject.AddComponent(Game.RadialBlurRenderer.GetType()) as Game.RadialBlurRenderer;
        this.radialBlur.material = G.MaterialMgr.blurMaterial;
        this.radialBlur.enabled = false;
    }

    public wave() {
        if (this.waterWaver != null) {
            //将伙伴当前位置转换为屏幕坐标
            this.material.SetFloat("_x", 0.5);
            this.material.SetFloat("_y", 0.5);
            this.material.SetFloat("_curWaveDis", 0);
            this.waterWaver.enabled = true;
            Game.Invoker.BeginInvoke(this.gameObject, "1", 4, delegate(this, this.delayDisable));
            Tween.TweenShaderValue.BeginSingle(this.waterWaverTween, 4, this.material, "_curWaveDis", 0, 4);
        }
    }
    private delayDisable() {
        this.waterWaver.enabled = false;
    }

    public beginScreenDarkness() {
        this.cameraDark.enabled = true;
        let t = Tween.TweenShaderValue.BeginSingle(this.cameraDarkTween, 0.9, this.cameraDarkMaterial, "_fadeFactor", 0, 1);
        t.style = Tween.UITweener.Style.Once;
        t.onFinished = delegate(this, this.delayBeginScreenDarkness);
    }
    private delayBeginScreenDarkness() {
        let t = Tween.TweenShaderValue.BeginSingle(this.cameraDarkTween, 1, this.cameraDarkMaterial, "_lightFactor", 0, 0.4);
        t.style = Tween.UITweener.Style.PingPong;
    }

    public endScreenDarkness() {
        let t = Tween.TweenShaderValue.BeginSingle(this.cameraDarkTween, 1.4, this.cameraDarkMaterial, "_fadeFactor", 1, 0);
        t.style = Tween.UITweener.Style.Once;
        t.onFinished = delegate(this, this.delayDisableScreenDarkness);
    }
    private delayDisableScreenDarkness() {
        this.cameraDark.enabled = false;
    }

    public shake(style: number) {
        let follower = G.UnitMgr.heroFollower;
        follower.Shake(Game.QuakeDirection.RightUp, G.getDouble("ShakeTime" + style), G.getDouble("ShakeSize" + style), G.getCurve("ShakeSkill" + style));
    }

    public tweenFovToSkill(style: number) {
        this.fov.animationCurve = G.getCurve("FovSkill" + style);
        Tween.TweenFov.Begin(this.camera, G.getDouble("FovTime" + style), 40, 40 + G.getDouble("FovDelta" + style));
    }

    public tweenFovToJump() {
        this.fov.animationCurve = G.getCurve("JumpFovCurve");
        Tween.TweenFov.Begin(this.camera, G.getDouble("JumpFovTime"), 40, 40 + G.getDouble("JumpFovDelta"));
    }

    public radialBlurForSpeed() {
        this.radialBlur.curve = G.getCurve("RadialBlurCurve");
        this.radialBlur.Tween(G.getDouble("BlurTime"), 0, G.getDouble("BlurSize"));
    }

    public radialBlurSkill(id: number) {
        this.radialBlur.curve = G.getCurve("RadialBlur" + id);
        this.radialBlur.Tween(G.getDouble("BlurTime" + id), 0, G.getDouble("BlurSize" + id));
    }

    public timeScaleBegin() {
        Tween.TweenTimeScale.Begin(this.gameObject, G.getDouble("TimeScaleTime"), 1, 0);
    }

    public get transform() {
        return this.camera.transform;
    }
    setSize(size: number): void {
        this.camera.orthographicSize = size;
    }
    get size(): number {
        return this.camera.orthographicSize;
    }
    public setCameraEnable(value: boolean) {
        this.camera.enabled = value;
    }
}