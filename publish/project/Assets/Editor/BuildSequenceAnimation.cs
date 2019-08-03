//http://www.cnblogs.com/superdo/p/5241130.html
using UnityEngine;
using System.IO;
using System.Collections.Generic;
using UnityEditor;
using UnityEditor.Animations;

class AnimationClipSettings
{
    SerializedProperty m_Property;
    private SerializedProperty Get(string property) { return m_Property.FindPropertyRelative(property); }
    public AnimationClipSettings(SerializedProperty prop) { m_Property = prop; }
    public bool loopTime { get { return Get("m_LoopTime").boolValue; } set { Get("m_LoopTime").boolValue = value; } }
}

public class BuildSequenceAnimation : Editor
{
    //生成出的Prefab的路径
    private static string PrefabPath = "Assets/AssetSources/Effect/SequenceAnim";
    //生成出的AnimationController的路径
    private static string AnimationControllerPath = "Assets/Arts/sequenceAnim/animController";
    //生成出的Animation的路径
    private static string AnimationPath = "Assets/Arts/sequenceAnim/anim";
    

    [MenuItem("FFTools/生成序列图动画", false, 3)]
    private static void AnimMaker()
    {
        EditorWindow.GetWindow<UIAnimMaker>(false, "Sequence animation Maker", true).Show();
    }

    public static void MakeAniamtion(string animationName, Sprite[] sprites, bool loop, float frameTime)
    {
        var clip = BuildAnimationClip(animationName, sprites, loop, frameTime);
        AnimatorController controller = BuildAnimationController(clip, animationName, loop);
        BuildPrefab(animationName, sprites, controller);
        Debug.Log("生成完毕！");
    }

    static AnimationClip BuildAnimationClip(string animationName, Sprite[] sprites, bool loop, float frameTime)
    {
        AnimationClip clip = new AnimationClip();
        EditorCurveBinding curveBinding = new EditorCurveBinding();
        curveBinding.type = typeof(UnityEngine.UI.Image);
        curveBinding.path = "";
        curveBinding.propertyName = "m_Sprite";
        ObjectReferenceKeyframe[] keyFrames = new ObjectReferenceKeyframe[sprites.Length];
        for (int i = 0; i < sprites.Length; i++)
        {
            Sprite sprite = sprites[i];
            Debug.Log("frame[" + i + "] sprite.name:" + sprite.name);
            keyFrames[i] = new ObjectReferenceKeyframe();
            keyFrames[i].time = frameTime * i;
            keyFrames[i].value = sprite;
        }
        clip.frameRate = 1/ frameTime;

        if (loop)
        {
            SerializedObject serializedClip = new SerializedObject(clip);
            AnimationClipSettings clipSettings = new AnimationClipSettings(serializedClip.FindProperty("m_AnimationClipSettings"));
            clipSettings.loopTime = true;
            serializedClip.ApplyModifiedProperties();
        }

        AnimationUtility.SetObjectReferenceCurve(clip, curveBinding, keyFrames);
        AssetDatabase.CreateAsset(clip, AnimationPath + "/" + animationName + ".anim");
        AssetDatabase.SaveAssets();
        return clip;
    }

    static AnimatorController BuildAnimationController(AnimationClip newClip, string name, bool loop)
    {
        AnimatorController animatorController = AnimatorController.CreateAnimatorControllerAtPath(AnimationControllerPath + "/" + name + ".controller");
        AnimatorControllerLayer layer = animatorController.layers[0];
        AnimatorStateMachine sm = layer.stateMachine;

        AnimatorState state = sm.AddState(newClip.name);

        state.motion = newClip;

        AnimatorStateTransition trs = null;
        if (!loop)
        {
            AnimatorState endState = sm.AddState("endState");
            trs = state.AddTransition(endState);
            trs.hasExitTime = true;
            trs.exitTime = 0f;
        }

        AssetDatabase.SaveAssets();
        return animatorController;
    }

    static void BuildPrefab(string animationName, Sprite[] sprites, AnimatorController animatorCountorller)
    {
        GameObject go = new GameObject();
        go.name = animationName;
        go.AddComponent<CanvasRenderer>();

        // add preview sprite
        var image = go.AddComponent<UnityEngine.UI.Image>();
        image.sprite = sprites[0];
        image.raycastTarget = false;
        var trs = go.transform as RectTransform;
        trs.pivot = new Vector2(0.5f, 0.5f);
        trs.sizeDelta = new Vector2(image.sprite.rect.width, image.sprite.rect.height);

        Animator animator = go.AddComponent<Animator>();
        animator.runtimeAnimatorController = animatorCountorller;
        PrefabUtility.CreatePrefab(PrefabPath + "/" + go.name + ".prefab", go);
        DestroyImmediate(go);
    }


    public static string DataPathToAssetPath(string path)
    {
        return path.Substring(path.Replace("\\", "/").IndexOf("Assets/"));
    }
}

public class UIAnimMaker : EditorWindow
{
    private Texture2D atlas;
    private string animName;
    private bool loop = false;
    private string  frameTime= "0.1";

    private void OnGUI()
    {
        ComponentSelector.Draw<Texture2D>("Atlas", this.atlas, new ComponentSelector.OnSelectionCallback(this.OnSelect), true, new GUILayoutOption[]
        {
            GUILayout.MinWidth(100f)
        });
        this.loop = EditorGUILayout.Toggle("循环：", this.loop);
        this.frameTime = EditorGUILayout.TextField("关键帧间隔（秒）:", this.frameTime);
        if (GUILayout.Button("Make animation"))
        {
            var sprites = GetSprites();
            if (sprites.Length == 0)
            {
                ErrorTip();
                return;
            }
            List<Sprite> list = new List<Sprite>(sprites);
            list.Sort((Sprite a, Sprite b) => {
                return string.Compare(a.name, b.name);
            });
            BuildSequenceAnimation.MakeAniamtion(animName, list.ToArray(), loop, ToNumber(frameTime, 0.1f));
        }
    }

    private void OnSelect(Object obj)
    {
        if (this.atlas != obj)
        {
            Selection.activeObject = obj;
        }
        this.atlas = (obj as Texture2D);
        string path = AssetDatabase.GetAssetPath(obj);
        TextureImporter importer = AssetImporter.GetAtPath(path) as TextureImporter;
        string fileName = Path.GetFileName(path);
        if (fileName.IndexOf('.') < 0)
        {
            this.animName = null;
            return;
        }
        this.animName = fileName.Substring(0, fileName.IndexOf('.'));
        if (importer == null || importer.spriteImportMode != SpriteImportMode.Multiple)
        {
            this.atlas = null;
            ErrorTip();
        }
        this.Repaint();
    }

    private Sprite [] GetSprites()
    {
        List<Sprite> sps = new List<Sprite>();
        if (this.atlas != null)
        {
            Object[] arr = AssetDatabase.LoadAllAssetsAtPath(AssetDatabase.GetAssetPath(this.atlas));
            for (int i = 0; i < arr.Length; i++)
            {
                Object obj = arr[i];
                if (obj.GetType() == typeof(Sprite))
                {
                    sps.Add(obj as Sprite);
                }
            }
        }
        return sps.ToArray();
    }

    private void ErrorTip()
    {
        Debug.LogError("请选择包含多个sprite的atlas");
    }

    private float ToNumber(string s, float defaultval)
    {
        float outval;
        if (float.TryParse(s, out outval))
            return outval;
        return defaultval;
    }
}