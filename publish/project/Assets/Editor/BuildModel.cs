///参考：http://www.cnblogs.com/superdo/p/5241130.html
using UnityEngine;
using System.IO;
using System;
using System.Collections.Generic;
using UnityEditor;
using UnityEditor.Animations;
using System.Text.RegularExpressions;
using System.Text;
using System.Collections;

namespace BuildModel
{
    /// <summary>
    /// 动画片段设置类
    /// </summary>
    class AnimationClipSettings
    {
        SerializedProperty m_Property;
        private SerializedProperty Get(string property) { return m_Property.FindPropertyRelative(property); }
        public AnimationClipSettings(SerializedProperty prop) { m_Property = prop; }
        public bool loopTime { get { return Get("m_LoopTime").boolValue; } set { Get("m_LoopTime").boolValue = value; } }
    }

    class StateInfo
    {
        public string name;
        public string motion;
        public bool isNeccesary;

        public StateInfo(string name)
        {
            this.name = name;
            this.motion = name;
            this.isNeccesary = true;
        }

        public StateInfo(string name, bool isNeccesary)
        {
            this.name = name;
            this.motion = name;
            this.isNeccesary = isNeccesary;
        }

        public StateInfo(string name, string motion)
        {
            this.name = name;
            this.motion = motion;
            this.isNeccesary = true;
        }

        public StateInfo(string name, string motion, bool isNeccesary)
        {
            this.name = name;
            this.motion = motion;
            this.isNeccesary = isNeccesary;
        }
    }

    class TransitionInfo
    {
        public string from;
        public string to;
    }

    class ModelFileSettings
    {
        public static string PrefabRoot = "Assets/AssetSources/model";

        public static string __DefaultState = "__DefaultState";

        public static string BOSS = "boss";
        public static string COLLECTION = "collection";
        public static string DROPTHING = "dropThing";
        public static string FAQI = "faqi";
        public static string GUOYUN = "guoyun";
        public static string HERO = "hero";
        public static string LINGBAO = "lingbao";
        public static string MONSTER = "monster";
        public static string NPC = "npc";
        public static string PET = "pet";
        public static string RIDE = "ride";
        public static string SHENGQI = "shengqi";
        //public static string WEAPON = "weapon";
        public static string WING = "wing";

        public static string[] supportTypes = { BOSS, COLLECTION, DROPTHING, FAQI, GUOYUN,
            HERO, LINGBAO, MONSTER, NPC, PET, RIDE, SHENGQI/*, WEAPON*/, WING };
        public static Dictionary<string, StateInfo[]> stateDict = new Dictionary<string, StateInfo[]>();
        public static Dictionary<string, string[]> textureDict = new Dictionary<string, string[]>();
        public static Dictionary<string, bool> loopDict = new Dictionary<string, bool>();
        public static Dictionary<string, string> defaultStateDict = new Dictionary<string, string>();
        public static Dictionary<string, List<TransitionInfo>> transitionDict = new Dictionary<string, List<TransitionInfo>>();

        public static void InitSettings()
        {
            stateDict.Clear();
            textureDict.Clear();
            loopDict.Clear();
            defaultStateDict.Clear();
            transitionDict.Clear();

            // 动作设置
            StateInfo[] bossActions = { new StateInfo("attack1"), new StateInfo("attack2"), new StateInfo("dead"), new StateInfo("move"), new StateInfo("stand") };
            stateDict.Add(BOSS, bossActions);

            StateInfo[] collectionActions = { };
            stateDict.Add(COLLECTION, collectionActions);
            stateDict.Add(DROPTHING, collectionActions);
            stateDict.Add(SHENGQI, collectionActions);

            StateInfo[] faqiActions = { new StateInfo("idle") };
            stateDict.Add(FAQI, faqiActions);

            StateInfo[] guoyunActions = { new StateInfo("move"), new StateInfo("stand") };
            stateDict.Add(GUOYUN, guoyunActions);
            stateDict.Add(LINGBAO, guoyunActions);
            stateDict.Add(RIDE, guoyunActions);

            StateInfo[] heroActions = { new StateInfo("attack1"), new StateInfo("attack2"), new StateInfo("attack3"), new StateInfo("dead"), new StateInfo("enter"), new StateInfo("idle"),
            new StateInfo("jump1"), new StateInfo("jump2"), new StateInfo("move"), new StateInfo("move_hold"), new StateInfo("move_ride"), new StateInfo("move_rideOff", "rideOff"), new StateInfo("move_rideUp", "rideUp"), new StateInfo("pick"), new StateInfo("skill1"), new StateInfo("skill2"),
            new StateInfo("skill3"), new StateInfo("skill4"), new StateInfo("skill5", false), new StateInfo("speed"), new StateInfo("stand"), new StateInfo("stand_fight"), new StateInfo("stand_hold"), new StateInfo("stand_ride"), new StateInfo("stand_rideOff", "rideOff"), new StateInfo("stand_rideUp", "rideUp") };
            stateDict.Add(HERO, heroActions);

            StateInfo[] monsterActions = { new StateInfo("attack1"), new StateInfo("attack2"), new StateInfo("behit"), new StateInfo("born1"), new StateInfo("born2"), new StateInfo("dead1"), new StateInfo("dead2"), new StateInfo("move"), new StateInfo("stand") };
            stateDict.Add(MONSTER, monsterActions);

            StateInfo[] npcActions = { new StateInfo("idle"), new StateInfo("stand") };
            stateDict.Add(NPC, npcActions);

            StateInfo[] petActions = { new StateInfo("attack1"), new StateInfo("attack2"), new StateInfo("idle"), new StateInfo("move"), new StateInfo("stand") };
            stateDict.Add(PET, petActions);

            StateInfo[] wingActions = { new StateInfo("stand") };
            stateDict.Add(WING, wingActions);

            // 贴图设置
            string[] petTextures = { "$.png", "$_weapon.jpg" };
            textureDict.Add(PET, petTextures);
            string[] commonTextures = { "$.png" };
            foreach (string type in supportTypes)
            {
                if (!textureDict.ContainsKey(type))
                {
                    textureDict.Add(type, commonTextures);
                }
            }

            // 动作循环设置
            loopDict.Add("idle", true);
            loopDict.Add("move", true);
            loopDict.Add("move_hold", true);
            loopDict.Add("move_ride", true);
            loopDict.Add("pick", true);
            loopDict.Add("stand", true);
            loopDict.Add("stand_fight", true);
            loopDict.Add("stand_hold", true);
            loopDict.Add("stand_ride", true);

            // 状态链接设置
            defaultStateDict.Add(BOSS, "stand");
            AddTransitionInfo(BOSS, "attack1", "stand");
            AddTransitionInfo(BOSS, "attack2", "stand");

            defaultStateDict.Add(HERO, "stand");
            AddTransitionInfo(HERO, "enter", "stand");
            AddTransitionInfo(HERO, "idle", "stand");
            AddTransitionInfo(HERO, "move_rideOff", "move");
            AddTransitionInfo(HERO, "move_rideUp", "move_ride");
            AddTransitionInfo(HERO, "attack1", "stand");
            AddTransitionInfo(HERO, "attack2", "stand");
            AddTransitionInfo(HERO, "attack3", "stand");
            AddTransitionInfo(HERO, "skill1", "stand");
            AddTransitionInfo(HERO, "skill2", "stand");
            AddTransitionInfo(HERO, "skill3", "stand");
            AddTransitionInfo(HERO, "skill4", "stand");
            AddTransitionInfo(HERO, "skill5", "stand");
            AddTransitionInfo(HERO, "stand_rideOff", "stand");
            AddTransitionInfo(HERO, "stand_rideUp", "stand_ride");

            defaultStateDict.Add(LINGBAO, "stand");

            defaultStateDict.Add(MONSTER, "stand");
            AddTransitionInfo(MONSTER, "behit", "stand");
            AddTransitionInfo(MONSTER, "born1", "stand");
            AddTransitionInfo(MONSTER, "born2", "stand");
            AddTransitionInfo(MONSTER, "attack1", "stand");
            AddTransitionInfo(MONSTER, "attack2", "stand");

            defaultStateDict.Add(NPC, "stand");
            AddTransitionInfo(NPC, "idle", "stand");

            defaultStateDict.Add(PET, "stand");
            AddTransitionInfo(PET, "idle", "stand");
            AddTransitionInfo(PET, "attack1", "stand");
            AddTransitionInfo(PET, "attack2", "stand");

            defaultStateDict.Add(RIDE, "stand");

            // 表示使用蒙皮中的动画
            defaultStateDict.Add(SHENGQI, __DefaultState);

            defaultStateDict.Add(WING, "stand");
        }

        private static void AddTransitionInfo(string type, string from, string to)
        {
            List<TransitionInfo> t;
            if (!transitionDict.TryGetValue(type, out t))
            {
                t = new List<TransitionInfo>();
                transitionDict.Add(type, t);
            }
            TransitionInfo info = new TransitionInfo();
            info.from = from;
            info.to = to;
            t.Add(info);
        }
    }

    /// <summary>
    /// 序列帧动画制作类，会生成 xxx.anim, xxx.controller, xxx.prefab
    /// </summary>
    class ModelMaker
    {
        public static string Make(string type, string id, string[] textureNames, string srcPath)
        {
            // 加载蒙皮
            string skinFileName = String.Format("{0}.FBX", id);
            string skinFilePath = CombinePath(srcPath, skinFileName);
            GameObject skinGo = AssetDatabase.LoadAssetAtPath<GameObject>(skinFilePath);
            if (null == skinGo)
            {
                return String.Format("skinGo not found: {0}", skinFilePath);
            }
            ModelImporter skinModelImporter = AssetImporter.GetAtPath(skinFilePath) as ModelImporter;

            StateInfo[] standardStates;
            ModelFileSettings.stateDict.TryGetValue(type, out standardStates);
            // 先设置动画循环
            Dictionary<string, AnimationClip> clipDic = new Dictionary<string, AnimationClip>();
            foreach (StateInfo s in standardStates)
            {
                if(clipDic.ContainsKey(s.motion))
                {
                    continue;
                }
                string actionFileName = String.Format("{0}@{1}.FBX", id, s.motion);
                string actionFilePath = CombinePath(srcPath, actionFileName);
                bool isLoop = false;
                if (ModelFileSettings.loopDict.TryGetValue(s.motion, out isLoop))
                {
                    // 动作循环
                    ModelImporter mi = AssetImporter.GetAtPath(actionFilePath) as ModelImporter;
                    ModelImporterClipAnimation[] caArray = mi.defaultClipAnimations;
                    ModelImporterClipAnimation ca = caArray[0];
                    ca.loopTime = true;
                    mi.clipAnimations = caArray;
                    mi.SaveAndReimport();
                }
                // 把动作保存起来
                AnimationClip clip = AssetDatabase.LoadAssetAtPath<AnimationClip>(actionFilePath);
                if (null != clip)
                {
                    clipDic.Add(s.motion, clip);
                }
                else if(s.isNeccesary)
                {
                    return String.Format("加载AnimationClip失败：{0}", s.motion);
                }
            }

            // 检查材质球
            List<Material> materials = new List<Material>();
            string materialFolder = CombinePath(srcPath, "Materials");
            foreach (string textureName in textureNames)
            {
                string texturePath = CombinePath(materialFolder, textureName);
                Texture2D texture = AssetDatabase.LoadAssetAtPath<Texture2D>(texturePath);
                string matName = Regex.Replace(textureName, @"(?<=\.)[png|jpg]*$", "mat", RegexOptions.IgnoreCase);
                string matPath = CombinePath(materialFolder, matName);
                Material material = AssetDatabase.LoadAssetAtPath<Material>(matPath);
                if (null == material)
                {
                    // 没有材质球，直接创建
                    material = new Material(Shader.Find("Game/Model/Standard"));
                    material.mainTexture = texture;
                    AssetDatabase.CreateAsset(material, matPath);
                }
                else
                {
                    // 有材质球，修改
                }
                materials.Add(material);
            }

            // 生成animation controller
            string controllerPath = CombinePath(srcPath, String.Format("{0}.controller", id));
            Debug.Log(controllerPath);
            string defaultStateName;
            if (ModelFileSettings.defaultStateDict.TryGetValue(type, out defaultStateName))
            {
                AnimatorController controller = AssetDatabase.LoadAssetAtPath<AnimatorController>(controllerPath);
                if (controller == null)
                {
                    controller = AnimatorController.CreateAnimatorControllerAtPath(controllerPath);
                    controller.RemoveLayer(0);
                    controller.AddLayer("0");
                }
                AnimatorControllerLayer layer = controller.layers[0];
                AnimatorStateMachine stateMachine = layer.stateMachine;
                // 先把原有的state找出来
                Dictionary<string, AnimatorState> stateDic = new Dictionary<string, AnimatorState>();
                foreach (ChildAnimatorState anim in stateMachine.states)
                {
                    stateDic.Add(anim.state.name, anim.state);
                }

                foreach (StateInfo s in standardStates)
                {
                    // 某些动作是可选的
                    if(clipDic.ContainsKey(s.motion))
                    {
                        AnimatorState state;
                        if (stateDic.ContainsKey(s.name))
                        {
                            state = stateDic[s.name];
                        }
                        else
                        {
                            state = stateMachine.AddState(s.name);
                            stateDic[s.name] = state;
                        }
                        state.motion = clipDic[s.motion];
                    }
                }

                if (ModelFileSettings.__DefaultState == defaultStateName)
                {
                    // 直接用蒙皮里面的动画
                    AnimationClip clip = AssetDatabase.LoadAssetAtPath<AnimationClip>(skinFilePath);
                    AnimatorState state = stateMachine.AddState(clip.name);
                    state.motion = clip;
                }
                else
                {
                    stateMachine.defaultState = stateDic[defaultStateName];
                }

                // 进行连线
                List<TransitionInfo> transitionInfos = new List<TransitionInfo>();
                ModelFileSettings.transitionDict.TryGetValue(type, out transitionInfos);
                foreach (TransitionInfo t in transitionInfos)
                {
                    Debug.Assert(stateDic.ContainsKey(t.from), t.from);
                    Debug.Assert(stateDic.ContainsKey(t.to), t.to);
                    AddTransition(stateDic[t.from], stateDic[t.to]);
                }

                EditorUtility.SetDirty(controller);
            }

            // 生成prefab
            string prefabName = String.Format("{0}.prefab", id);
            string prefabPath = CombinePath(ModelFileSettings.PrefabRoot + "/" + type, prefabName);
            GameObject o = AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath);
            if (null == o)
            {
                // 直接创建
                o = PrefabUtility.CreatePrefab(prefabPath, skinGo);
            }
            else
            {
                // 覆盖
                PrefabUtility.ReplacePrefab(skinGo, o, ReplacePrefabOptions.ReplaceNameBased);
            }

            // 绑定动画控制器
            if (skinModelImporter.defaultClipAnimations.Length > 0)
            {
                var animator = o.GetComponent<Animator>();
                var animaorcontroller = AssetDatabase.LoadAssetAtPath<AnimatorController>(controllerPath);
                animator.runtimeAnimatorController = animaorcontroller;
                animator.cullingMode = AnimatorCullingMode.CullCompletely;
                animator.updateMode = AnimatorUpdateMode.AnimatePhysics;
            }

            // 设置贴图
            Renderer[] renderers = o.GetComponentsInChildren<Renderer>();
            //尝试寻找所有的材质球
            if (renderers.Length > materials.Count)
            {
                return "蒙皮数量和材质球数量不匹配";
            }
            for (int i = 0; i < renderers.Length; i++)
            {
                Renderer renderer = renderers[i];
                renderer.material = materials[i];
                renderer.receiveShadows = false;
                renderer.lightProbeUsage = UnityEngine.Rendering.LightProbeUsage.Off;
                renderer.reflectionProbeUsage = UnityEngine.Rendering.ReflectionProbeUsage.Off;
                renderer.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
                renderer.motionVectorGenerationMode = MotionVectorGenerationMode.ForceNoMotion;
                if (renderer is SkinnedMeshRenderer)
                {
                    SkinnedMeshRenderer skin = renderer as SkinnedMeshRenderer;
                    skin.skinnedMotionVectors = false;
                }
            }

            EditorUtility.SetDirty(o);
            AssetDatabase.Refresh();
            return null;

            //List<Sprite> sprites = new List<Sprite>();
            //var files = Builder.FileUtil.GetFiles(srcPath, @"\.png$", RegexOptions.IgnoreCase);
            //Array.Sort(files, (string a, string b) =>
            //{
            //    return string.Compare(a, b);
            //});
            //foreach (string f in files)
            //{
            //    string file = f.Substring(f.IndexOf("Assets"));
            //    var importer = AssetImporter.GetAtPath(file) as TextureImporter;
            //    if (importer != null)
            //    {
            //        sprites.Add(SpriteClip.Clip(importer, 0));
            //    }
            //}
            //Make("", "", sprites.ToArray(), false, 0);
        }

        private static void LinkStates()
        {

        }

        private static void AddTransition(AnimatorState state1, AnimatorState state2)
        {
            AnimatorStateTransition transition = null;
            if (state1.transitions.Length > 0)
            {
                transition = state1.transitions[0];
                transition.destinationState = state2;
            }
            else
            {
                transition = state1.AddTransition(state2);
            }
            transition.hasExitTime = true;
        }

        private static string CombinePath(string path, string name)
        {
            return Path.Combine(path, name).Replace("\\", "/");
        }

        private static void BuildImageAnimationClip(AnimationClip clip, Sprite[] sprites, float frameTime)
        {
            EditorCurveBinding sizeDelta_x_curveBinding = new EditorCurveBinding();
            sizeDelta_x_curveBinding.type = typeof(RectTransform);
            sizeDelta_x_curveBinding.path = "";
            sizeDelta_x_curveBinding.propertyName = "m_SizeDelta.x";

            EditorCurveBinding sizeDelta_y_curveBinding = new EditorCurveBinding();
            sizeDelta_y_curveBinding.type = typeof(RectTransform);
            sizeDelta_y_curveBinding.path = "";
            sizeDelta_y_curveBinding.propertyName = "m_SizeDelta.y";

            EditorCurveBinding pivot_x_curveBinding = new EditorCurveBinding();
            pivot_x_curveBinding.type = typeof(RectTransform);
            pivot_x_curveBinding.path = "";
            pivot_x_curveBinding.propertyName = "m_Pivot.x";

            EditorCurveBinding pivot_y_curveBinding = new EditorCurveBinding();
            pivot_y_curveBinding.type = typeof(RectTransform);
            pivot_y_curveBinding.path = "";
            pivot_y_curveBinding.propertyName = "m_Pivot.y";

            Keyframe[] sizeDelta_x_keyframes = new Keyframe[sprites.Length];
            Keyframe[] sizeDelta_y_keyframes = new Keyframe[sprites.Length];
            Keyframe[] pivot_x_keyframes = new Keyframe[sprites.Length];
            Keyframe[] pivot_y_keyframes = new Keyframe[sprites.Length];

            for (int i = 0; i < sprites.Length; i++)
            {
                sizeDelta_x_keyframes[i] = new Keyframe(frameTime * i, sprites[i].rect.width);
                sizeDelta_y_keyframes[i] = new Keyframe(frameTime * i, sprites[i].rect.height);

                float x_pivot = sprites[i].pivot.x / sprites[i].rect.width;
                float y_pivot = sprites[i].pivot.y / sprites[i].rect.height;
                pivot_x_keyframes[i] = new Keyframe(frameTime * i, x_pivot);
                pivot_y_keyframes[i] = new Keyframe(frameTime * i, y_pivot);
            }

            AnimationCurve sizeDelta_x_curve = new AnimationCurve(sizeDelta_x_keyframes);
            AnimationCurve sizeDelta_y_curve = new AnimationCurve(sizeDelta_y_keyframes);
            AnimationCurve pivot_x_curve = new AnimationCurve(pivot_x_keyframes);
            AnimationCurve pivot_y_curve = new AnimationCurve(pivot_y_keyframes);

            for (int i = 0; i < sprites.Length; i++)
            {
                AnimationUtility.SetKeyLeftTangentMode(sizeDelta_x_curve, i, AnimationUtility.TangentMode.Constant);
                AnimationUtility.SetKeyRightTangentMode(sizeDelta_x_curve, i, AnimationUtility.TangentMode.Constant);

                AnimationUtility.SetKeyLeftTangentMode(sizeDelta_y_curve, i, AnimationUtility.TangentMode.Constant);
                AnimationUtility.SetKeyRightTangentMode(sizeDelta_y_curve, i, AnimationUtility.TangentMode.Constant);

                AnimationUtility.SetKeyLeftTangentMode(pivot_x_curve, i, AnimationUtility.TangentMode.Constant);
                AnimationUtility.SetKeyRightTangentMode(pivot_x_curve, i, AnimationUtility.TangentMode.Constant);

                AnimationUtility.SetKeyLeftTangentMode(pivot_y_curve, i, AnimationUtility.TangentMode.Constant);
                AnimationUtility.SetKeyRightTangentMode(pivot_y_curve, i, AnimationUtility.TangentMode.Constant);
            }

            AnimationUtility.SetEditorCurve(clip, sizeDelta_x_curveBinding, sizeDelta_x_curve);
            AnimationUtility.SetEditorCurve(clip, sizeDelta_y_curveBinding, sizeDelta_y_curve);
            AnimationUtility.SetEditorCurve(clip, pivot_x_curveBinding, pivot_x_curve);
            AnimationUtility.SetEditorCurve(clip, pivot_y_curveBinding, pivot_y_curve);
        }
    }

    /// <summary>
    /// 可以拖动路径的Label控件
    /// </summary>
    class PathDragLabel
    {
        private static List<bool> dragIns = new List<bool>();
        static public void Begin()
        {
            dragIns.Clear();
        }
        static public void End()
        {
            DragAndDrop.visualMode = dragIns.Find(o => o == true) ? DragAndDropVisualMode.Generic : DragAndDropVisualMode.None;
        }

        private bool inRect = false;
        public string Label(string label, string exlabel, int height)
        {
            Rect dropArea = EditorGUILayout.GetControlRect(new GUILayoutOption[] { GUILayout.ExpandWidth(true), GUILayout.Height(height) });
            GUI.Box(dropArea, label + exlabel, EditorStyles.textField);
            if (Event.current.type == EventType.DragUpdated)
            {
                Event currentEvent = Event.current;
                inRect = dropArea.Contains(currentEvent.mousePosition);
            }

            if (Event.current.type == EventType.DragExited && inRect)
            {
                var path = AssetDatabase.GetAssetPath(DragAndDrop.objectReferences[0]);
                if (Directory.Exists(path))
                    return path;
            }
            dragIns.Add(inRect);
            return label;
        }
    }

    /// <summary>
    /// 序列动画工具界面
    /// </summary>
    public class UIModelMaker : EditorWindow
    {
        private string srcPath = "";
        private string type = "";
        private string id = "";

        private PathDragLabel srcLabel = new PathDragLabel();

        [MenuItem("FFTools/生成模型", false, 5)]
        private static void MakeModel()
        {
            ModelFileSettings.InitSettings();
            EditorWindow.GetWindow<UIModelMaker>(false, "生成模型", true).Show();
        }

        private void OnGUI()
        {
            PathDragLabel.Begin();

            EditorGUILayout.Space();
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField("选择模型文件夹:", GUILayout.Width(146f));
            srcPath = srcLabel.Label(srcPath, "", 16);
            EditorGUILayout.EndHorizontal();

            PathDragLabel.End();

            // 先分析是什么类型的模型
            if (string.IsNullOrEmpty(srcPath))
            {
                EditorGUILayout.Space();
                EditorGUILayout.HelpBox("未选择文件夹", MessageType.Warning);
            }
            else
            {
                string srcPathPre = "Assets/Arts/model/";
                if (!srcPath.StartsWith(srcPathPre))
                {
                    EditorGUILayout.Space();
                    EditorGUILayout.HelpBox("目录不正确，请重新选择！", MessageType.Error);
                    return;
                }
                string srcPathSub = srcPath.Substring(srcPathPre.Length);
                string[] srcParts = srcPathSub.Split('/');
                if (srcParts.Length != 2)
                {
                    EditorGUILayout.Space();
                    EditorGUILayout.HelpBox("目录不正确，请重新选择！", MessageType.Error);
                    return;
                }

                type = srcParts[0];
                id = srcParts[1];

                if (Array.IndexOf(ModelFileSettings.supportTypes, type) < 0)
                {
                    EditorGUILayout.Space();
                    EditorGUILayout.HelpBox("不受支持的类型，请重新选择！", MessageType.Error);
                    return;
                }

                StateInfo[] standardStates;
                ModelFileSettings.stateDict.TryGetValue(type, out standardStates);
                
                // 检查动画文件
                List<string> filesNotFound = new List<string>();
                string skinFilePath = Path.Combine(srcPath, String.Format("{0}.FBX", id));
                if (!File.Exists(skinFilePath))
                {
                    filesNotFound.Add(id);
                }

                foreach (StateInfo s in standardStates)
                {
                    if(!s.isNeccesary)
                    {
                        // 非必需的动作，比如Skill5
                        continue;
                    }
                    string actionFilePath = Path.Combine(srcPath, String.Format("{0}@{1}.FBX", id, s.motion));
                    if (!File.Exists(actionFilePath))
                    {
                        // 没有找到动作文件
                        filesNotFound.Add(s.motion);
                    }
                }

                if (filesNotFound.Count > 0)
                {
                    EditorGUILayout.Space();
                    EditorGUILayout.HelpBox(String.Format("以下FBX文件丢失：{0}", string.Join(",", filesNotFound.ToArray())), MessageType.Error);
                    EditorGUILayout.Space();
                    EditorGUILayout.HelpBox("注意FBX后缀需为大写", MessageType.Info);
                    return;
                }

                // 检查材质球目录
                string materialFolder = Path.Combine(srcPath, "Materials");
                if (!Directory.Exists(materialFolder))
                {
                    EditorGUILayout.Space();
                    EditorGUILayout.HelpBox("缺少Materials目录！", MessageType.Error);
                    return;
                }
                string[] textures;
                ModelFileSettings.textureDict.TryGetValue(type, out textures);
                List<string> realTextures = new List<string>();
                List<string> texturesNotFound = new List<string>();
                foreach (string textureName in textures)
                {
                    string realTexture = textureName.Replace("$", id);
                    string textureFilePath = Path.Combine(srcPath, String.Format("Materials/{0}", realTexture));
                    if (File.Exists(textureFilePath))
                    {
                        realTextures.Add(realTexture);
                    }
                    else
                    {
                        Debug.Log("not found: " + textureFilePath);
                        texturesNotFound.Add(realTexture);
                    }
                }

                if (texturesNotFound.Count > 0)
                {
                    EditorGUILayout.Space();
                    EditorGUILayout.HelpBox(String.Format("以下贴图文件丢失：{0}", string.Join(",", texturesNotFound.ToArray())), MessageType.Error);
                    return;
                }

                EditorGUILayout.Space();
                if (GUILayout.Button("开始制作"))
                {
                    string errMsg = ModelMaker.Make(type, id, realTextures.ToArray(), srcPath);
                    if (null != errMsg)
                    {
                        EditorGUILayout.Space();
                        EditorGUILayout.HelpBox(errMsg, MessageType.Error);
                        Debug.LogError(errMsg);
                    }
                }
            }
        }
    }
}