#if UNITY_EDITOR
using UnityEngine;
using System;
using System.Collections.Generic;
using Assets.Scripts.game.camera;
/// <summary>
/// 这里填写要wrap的文件列表，注意，枚举类型也会被自动wrap到 module名字.Enum文件下
/// </summary>
/// 
namespace Uts
{
    public class WrapFiles
    {
        // 不wrap的成员列表
        public static List<string> memberFilter = new List<string>
        {
            "AnimationClip.averageDuration",
            "AnimationClip.averageAngularSpeed",
            "AnimationClip.averageSpeed",
            "AnimationClip.apparentSpeed",
            "AnimationClip.isLooping",
            "AnimationClip.isAnimatorMotion",
            "AnimationClip.isHumanMotion",
            "Application.CaptureScreenshot",
            "AnimatorOverrideController.PerformOverrideClipListCleanup",
            "Caching.SetNoBackupFlag",
            "Caching.ResetNoBackupFlag",
            "Light.areaSize",
            "Security.GetChainOfTrustValue",
            "Texture2D.alphaIsTransparency",
            "WWW.movie",
            "WebCamTexture.MarkNonReadable",
            "WebCamTexture.isReadable",
            "Graphic.OnRebuildRequested",
            "Text.OnRebuildRequested",
            "Application.ExternalEval",
            "Resources.LoadAssetAtPath",
            "Input.IsJoystickPreconfigured",
            "String.Chars",
            "MonoBehaviour.runInEditMode",
            "Light.lightmapBakeType",
            "RenderTexture.vrUsage",
            "RenderTexture.VRTextureUsage",
            "MediaPlayer.GetPlatformOptions",
            "MediaPlayer.GetPlatformOptionsVariable",
            "MediaPlayer.SaveFrameToPng",
        };

        // 使用js内部类处理（给结构体用的）
        public static Dictionary<string, string> structObjects = new Dictionary<string, string>
        {
            { "UnityEngine.Vector2", "JsStructs.vector2" },
            { "UnityEngine.Vector3", "JsStructs.vector3" },
        };

        public static BindType[] binds = new BindType[]
        {
            //基本类型
            _GT("UnityEngine",typeof(UnityEngine.Object),"UnityObject"),
            _GT("UnityEngine",typeof(Type)),
            _GT("UnityEngine",typeof(Component)),
            _GT("UnityEngine",typeof(Behaviour)),
            _GT("UnityEngine",typeof(MonoBehaviour)),
            _GT("UnityEngine",typeof(Collider)),
            _GT("UnityEngine",typeof(Texture)),
            _GT("UnityEngine",typeof(Renderer)),
            _GT("UnityEngine",typeof(PlayerPrefs)),
            _GT("UnityEngine",typeof(Sprite)),
            _GT("UnityEngine",typeof(AnimationCurve)),
            _GT("UnityEngine",typeof(AsyncOperation)),
            _GT("UnityEngine",typeof(UnityEngine.AI.NavMesh)),
            _GT("UnityEngine",typeof(UnityEngine.AI.NavMeshHit)),
            _GT("UnityEngine",typeof(UnityEngine.AI.NavMeshPath)),
            //3D
            _GT("UnityEngine",typeof(BoxCollider)),
            _GT("UnityEngine",typeof(TextAsset)),
            _GT("UnityEngine",typeof(Shader)),
            _GT("UnityEngine",typeof(Material)),
            _GT("UnityEngine",typeof(Texture2D)),
            _GT("UnityEngine",typeof(RenderTexture)),
            _GT("UnityEngine",typeof(MeshRenderer)),
            _GT("UnityEngine",typeof(SkinnedMeshRenderer)),
            _GT("UnityEngine",typeof(ParticleSystemRenderer)),
            _GT("UnityEngine",typeof(GameObject)),
            _GT("UnityEngine",typeof(Transform)),
            _GT("UnityEngine",typeof(Animator)),
            _GT("UnityEngine",typeof(Camera)),
            _GT("UnityEngine",typeof(RectTransform)),
            _GT("UnityEngine",typeof(ParticleSystem)),
            //Audio
            _GT("UnityEngine",typeof(AudioSource)),
            _GT("UnityEngine",typeof(AudioClip)),
            //2D
            _GT("UnityEngine",typeof(UnityEngine.EventSystems.PointerEventData)),
            _GT("UnityEngine",typeof(UnityEngine.Canvas)),
            _GT("UnityEngine",typeof(UnityEngine.CanvasGroup)),

            _GT("UnityEngine",typeof(UnityEngine.EventSystems.UIBehaviour)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.Graphic)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.MaskableGraphic)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.Selectable)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.Text)),
            _GT("UnityEngine.UI",typeof(UIText)),
            _GT("UnityEngine.UI",typeof(UITextUrl)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.Image)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.RawImage)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.ActiveToggle)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.ActiveToggleGroup)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.Slider)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.ScrollRect)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.Scrollbar)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.Dropdown)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.InputField)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.LayoutElement)),
            _GT("UnityEngine.UI",typeof(UnityEngine.UI.LayoutRebuilder)),
            //静态内部类
            _GT("UnityEngine",typeof(Application)),
            _GT("UnityEngine",typeof(Resolution)),
            _GT("UnityEngine",typeof(Screen)),
            _GT("UnityEngine",typeof(Time)),
            _GT("UnityEngine",typeof(RectTransformUtility)),
            _GT("UnityEngine",typeof(SystemInfo)),
            _GT("UnityEngine",typeof(Graphics)),
            _GT("UnityEngine",typeof(Light)),
            _GT("UnityEngine",typeof(QualitySettings)),
            _GT("UnityEngine",typeof(UnityEngine.SceneManagement.SceneManager)),
            //结构体
            _GT("UnityEngine",typeof(Color)),
            _GT("UnityEngine",typeof(Color32)),
            _GT("UnityEngine",typeof(Vector2)),
            _GT("UnityEngine",typeof(Vector3)),
            _GT("UnityEngine",typeof(Vector4)),
            _GT("UnityEngine",typeof(Bounds)),
            _GT("UnityEngine",typeof(Quaternion)),
            _GT("UnityEngine",typeof(Rect)),
            _GT("UnityEngine",typeof(RectOffset)),
            _GT("UnityEngine",typeof(Keyframe)),
            //Java
            _GT("UnityEngine",typeof(AndroidJavaObject)),
            _GT("UnityEngine",typeof(AndroidJavaClass)),
            //Tween
            _GT("Tween",typeof(UITweener)),
            _GT("Tween",typeof(TweenAlpha)),
            _GT("Tween",typeof(TweenShaderValue)),
            _GT("Tween",typeof(TweenColor)),
            _GT("Tween",typeof(TweenPath)),
            _GT("Tween",typeof(TweenPosition)),
            _GT("Tween",typeof(TweenTarget)),
            _GT("Tween",typeof(TweenRotation)),
            _GT("Tween",typeof(TweenScale)),
            _GT("Tween",typeof(TweenSlider)),
            _GT("Tween",typeof(TweenImageFillAmount)),
            _GT("Tween",typeof(TweenFov)),
            _GT("Tween",typeof(TweenTimeScale)),
            //Listener
            _GT("Game",typeof(UIClickListener)),
            _GT("Game",typeof(UIDragListener)),
            _GT("Game",typeof(UITouchListener)),
            _GT("Game",typeof(InputListener)),
            _GT("Game",typeof(UnitStateListener)),
            _GT("Game",typeof(JoystickListener)),
            _GT("Game",typeof(UIPointerDownListener)),
            _GT("Game",typeof(UIPointerUpListener)),
            _GT("Game",typeof(UIPointerExitListener)),
            _GT("Game",typeof(UIButtonScale)),
            _GT("Game",typeof(UnityEngine.UI.FyScrollRect)),

            //自建类型
            _GT("Game",typeof(ArrayHelper)),
            _GT("Game",typeof(ByteArray)),
            _GT("Game",typeof(UnitFollower)),
            _GT("Game",typeof(ParticleFollower)),
            _GT("Game",typeof(ResLoader)),
            _GT("Game",typeof(UrlAssetRequest)),
            _GT("Game",typeof(UrlAsset)),
            _GT("Game",typeof(Asset)),
            _GT("Game",typeof(RequestBase)),
            _GT("Game",typeof(AssetRequest)),
            _GT("Game",typeof(DownloadRequest)),
            _GT("Game",typeof(RangeLoader)),
            _GT("Game",typeof(TileMap)),
            _GT("Game",typeof(Tools)),
            _GT("Game",typeof(ElementsMapper)),
            _GT("Game",typeof(MapViewportChecker)),
            _GT("Game",typeof(TransformFollower)),
            _GT("Game",typeof(Timer)),
            _GT("Game",typeof(Profiler)),
            _GT("Game",typeof(SpecialAnimationPlayer)),
            _GT("Game",typeof(Invoker)),
            _GT("Game",typeof(UGUIAltas)),
            _GT("Game",typeof(SystemSDK)),
            _GT("Game",typeof(FixedMessageBox)),
            _GT("Game",typeof(BuildDefines)),
            _GT("Game",typeof(AfterImageEffects)),
            _GT("Game",typeof(CameraEffect)),
            _GT("Game",typeof(IosSdk)),
            _GT("Game",typeof(ItemAppearEffect)),
            //管理器
            _GT("Game",typeof(DonotDestroyManager)),
            _GT("Game",typeof(game.Config)),
            _GT("Game",typeof(Log)),
            _GT("Game",typeof(CustomBehaviour)),
            _GT("Game",typeof(Game.UIFixedList)),
            _GT("Game",typeof(Game.UIList)),
            _GT("Game",typeof(Game.UIListItem)),
            _GT("Game",typeof(Game.UIGroupList)),
            _GT("Game",typeof(Game.UIGroupListItem)),
            _GT("Game",typeof(Game.UIPolygon)),
            _GT("Game",typeof(DynCaller)),
            _GT("Game",typeof(MemValueRegister)),
            _GT("Game",typeof(PCStreamingSetting)),
            _GT("Game",typeof(EffectBinder)),
            _GT("Game",typeof(Barcode)),
            //3D
            _GT("Game",typeof(ThreeDTools)),
            _GT("Game",typeof(SceneData)),
            _GT("Game",typeof(FPS)),
            _GT("Game",typeof(ModelMaterialPreset)),
            _GT("Game",typeof(AnimationCurveList)),
            _GT("Game",typeof(DoubleDefineList)),
            _GT("Game",typeof(ColorDefineList)),
            _GT("Game",typeof(RadialBlurRenderer)),
            _GT("Game",typeof(CameraRec)),
            _GT("Game",typeof(NiceInvoker)),
        };

        public static BindType _GT(string modelName, Type t, string alias = null)
        {
            return new BindType(modelName, t, alias);
        }
    }
}
#endif