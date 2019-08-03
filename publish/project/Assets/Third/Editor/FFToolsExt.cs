using UnityEngine;
using System.Collections.Generic;
using UnityEditor;
using System.IO;
using UnityEditor.Animations;
using System.Text.RegularExpressions;
using UnityEngine.AI;
public class FFToolsExt : Editor
{
    #region 模型操作
    [MenuItem("FFTools/动画/切割动画文件")]
    static void SplitModelAnimations()
    {
        var selectFile = Selection.activeObject;
        var filePath = AssetDatabase.GetAssetPath(selectFile);
        SplitModelAnimations(filePath);
        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh(ImportAssetOptions.Default);
    }
    [MenuItem("FFTools/动画/生成动画控制器")]
    static void GenerateModelAnimation()
    {
        var selectFile = Selection.activeObject;
        var filePath = AssetDatabase.GetAssetPath(selectFile);
        GenerateModelAnimation(filePath);
        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh(ImportAssetOptions.Default);
    }
    [MenuItem("FFTools/动画/生成预制体")]
    static void GenerateModelPrefab()
    {
        var selectFile = Selection.activeObject;
        var filePath = AssetDatabase.GetAssetPath(selectFile);
        GenerateModelPrefab(filePath);
        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh(ImportAssetOptions.Default);
    }
    [MenuItem("FFTools/动画/执行所有操作")]
    static void OneAnimation()
    {
        var selectFile = Selection.activeObject;
        var filePath = AssetDatabase.GetAssetPath(selectFile);
        SplitModelAnimations(filePath);
        GenerateModelAnimation(filePath);
        GenerateModelPrefab(filePath);
        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh(ImportAssetOptions.Default);
    }
    static List<List<string>>[] ReadModel(string parentPath, string name)
    {
        //获取配置表文件
        var configPath = parentPath + "/" + name;
        List<List<string>>[] pList = new List<List<string>>[5];
        for (int i = 0; i < 5; i++)
        {
            pList[i] = new List<List<string>>();
        }
        if (File.Exists(configPath))
        {
            var configLines = File.ReadAllLines(configPath);

            foreach (var line in configLines)
            {
                var lineList = new List<string>();
                var strLen = line.Length;
                var start = false;
                var lastIndex = 0;
                for (int i = 0; i < strLen; i++)
                {
                    var c = line[i];
                    if (c == ' ' || c == '-')
                    {
                        if (start)
                        {
                            continue;
                        }
                        else
                        {
                            if (i - lastIndex >= 1)
                            {
                                lineList.Add(line.Substring(lastIndex, i - lastIndex));
                            }
                            lastIndex = i + 1;
                        }
                    }
                    else if (c == '[')
                    {
                        start = true;
                        lastIndex = i + 1;
                    }
                    else if (c == ']')
                    {
                        if (start)
                        {
                            if (i - lastIndex >= 1)
                            {
                                lineList.Add(line.Substring(lastIndex, i - lastIndex));
                                lastIndex = i + 1;
                            }
                            start = false;
                        }
                    }
                    else if (c == '*')
                    {
                        lastIndex = strLen;
                        lineList.Clear();
                        break;
                    }
                }
                if (lastIndex <= strLen - 1)
                {
                    lineList.Add(line.Substring(lastIndex));
                }
                if (lineList.Count > 0 && lineList.Count <= 4)
                {
                    pList[lineList.Count].Add(lineList);
                }
            }
        }
        return pList;
    }

    static void SplitModelAnimations(string filePath)
    {
        var parentPath = Path.GetDirectoryName(filePath);
        List<List<string>>[] config = ReadModel(parentPath, "model.txt");
        var d = config[3];
        var modelPath = parentPath + "/model.FBX";
        if (d.Count > 0)
        {
            //dummy不参与切割动画
            return;
        }
        var assetImport = AssetImporter.GetAtPath(modelPath);
        if (string.IsNullOrEmpty(modelPath) || !(assetImport is ModelImporter))
        {
            modelPath = parentPath + "/model@dummy.FBX";
            assetImport = AssetImporter.GetAtPath(modelPath);
            if (string.IsNullOrEmpty(modelPath) || !(assetImport is ModelImporter))
            {
                Debug.LogError("目录中不存在FBX文件：" + parentPath);
                return;
            }
        }
        bool change = false;
        var modelImport = assetImport as ModelImporter;
        if (modelImport.defaultClipAnimations.Length == 0)
        {
            if (modelImport.importAnimation)
            {
                change = true;
            }
        }
        if (config[4].Count != modelImport.clipAnimations.Length)
        {
            change = true;
        }
        List<ModelImporterClipAnimation> animList = new List<ModelImporterClipAnimation>();
        for (int i = 0, len = config[4].Count; i < len; i++)
        {
            var pList = config[4][i];
            int frameStart = 0;
            int frameEnd = 0;
            if (!int.TryParse(pList[0], out frameStart))
            {
                continue;
            }
            if (!int.TryParse(pList[1], out frameEnd))
            {
                continue;
            }
            ModelImporterClipAnimation anim = new ModelImporterClipAnimation();
            anim.firstFrame = frameStart;
            anim.lastFrame = frameEnd;
            anim.loopTime = pList[2] == "loop";
            anim.name = pList[3];
            animList.Add(anim);
            if (!change)
            {
                var oldAnim = modelImport.clipAnimations[i];
                if (!IsModelImporterClipAnimationSame(oldAnim, anim))
                {
                    change = true;
                }
            }
        }
        if (modelImport.generateSecondaryUV)
        {
            change = true;
        }
        if (config[1].Count != modelImport.extraExposedTransformPaths.Length)
        {
            change = true;
        }

        List<string> pNames = new List<string>();
        for (int i = 0, len = config[1].Count; i < len; i++)
        {
            var pList = config[1][i];
            var inName = pList[0];
            pNames.Add(inName);
            if (!change)
            {
                var oldAnim = modelImport.extraExposedTransformPaths[i];
                if (!oldAnim.Equals(inName))
                {
                    change = true;
                }
            }
        }
        if (change)
        {
            if (modelImport.importAnimation)
            {
                modelImport.importAnimation = false;
            }
            modelImport.clipAnimations = animList.ToArray();
            modelImport.generateSecondaryUV = false;
            modelImport.extraExposedTransformPaths = pNames.ToArray();
            modelImport.SaveAndReimport();
        }
    }
    static bool IsModelImporterClipAnimationSame(ModelImporterClipAnimation m1, ModelImporterClipAnimation m2)
    {
        if (m1.firstFrame != m2.firstFrame)
        {
            return false;
        }
        if (m1.lastFrame != m2.lastFrame)
        {
            return false;
        }
        if (m1.loopTime != m2.loopTime)
        {
            return false;
        }
        if (m1.name != m2.name)
        {
            return false;
        }
        return true;
    }
    static void GenerateModelAnimation(string filePath)
    {
        var parentPath = Path.GetDirectoryName(filePath);
        List<List<string>>[] config = ReadModel(parentPath, "model.txt");
        var d = config[3];
        if (d.Count > 0)
        {
            //dummy不参与动画生成
            return;
        }
        var modelPath = parentPath + "/model.FBX";
        var controllerPath = parentPath + "/anim.anim";

        var assetImport = AssetImporter.GetAtPath(modelPath);
        if (string.IsNullOrEmpty(modelPath) || !(assetImport is ModelImporter))
        {
            modelPath = parentPath + "/model@dummy.FBX";
            assetImport = AssetImporter.GetAtPath(modelPath);
            if (string.IsNullOrEmpty(modelPath) || !(assetImport is ModelImporter))
            {
                Debug.LogError("目录中不存在FBX文件：" + parentPath);
                return;
            }
        }
        var modelImport = assetImport as ModelImporter;
        if (!modelImport.importAnimation || modelImport.defaultClipAnimations.Length == 0)
        {
            return;
        }
        var controller = AssetDatabase.LoadAssetAtPath<AnimatorController>(controllerPath);
        if (controller == null)
        {
            controller = AnimatorController.CreateAnimatorControllerAtPath(controllerPath);
            controller.RemoveLayer(0);
            controller.AddLayer("0");
        }
        var layer = controller.layers[0];
        var stateMachine = layer.stateMachine;

        Dictionary<string, AnimationClip> dic = new Dictionary<string, AnimationClip>();
        var objects = AssetDatabase.LoadAllAssetRepresentationsAtPath(modelPath);
        foreach (var o in objects)
        {
            if (o.GetType() == typeof(AnimationClip))
            {
                dic[o.name] = o as AnimationClip;
            }
        }
        Dictionary<string, AnimatorState> allStates = new Dictionary<string, AnimatorState>();
        foreach (var anim in stateMachine.states)
        {
            allStates.Add(anim.state.name, anim.state);
        }
        foreach (var anim in modelImport.clipAnimations)
        {
            var name = anim.name;
            if (name == "ride_up")
            {
                var checkName = "stand_rideUp";
                if (allStates.ContainsKey(checkName))
                {
                    allStates[checkName].motion = dic[name];
                    allStates.Remove(checkName);
                }
                else
                {
                    var state = stateMachine.AddState(checkName);
                    state.motion = dic["ride_up"];
                }
                checkName = "move_rideUp";
                if (allStates.ContainsKey(checkName))
                {
                    allStates[checkName].motion = dic[name];
                    allStates.Remove(checkName);
                }
                else
                {
                    var state = stateMachine.AddState(checkName);
                    state.motion = dic["ride_up"];
                }
            }
            else if (name == "ride_down")
            {
                var checkName = "stand_rideOff";
                if (allStates.ContainsKey(checkName))
                {
                    allStates[checkName].motion = dic[name];
                    allStates.Remove(checkName);
                }
                else
                {
                    var state = stateMachine.AddState(checkName);
                    state.motion = dic["ride_down"];
                }
                checkName = "move_rideOff";
                if (allStates.ContainsKey(checkName))
                {
                    allStates[checkName].motion = dic[name];
                    allStates.Remove(checkName);
                }
                else
                {
                    var state = stateMachine.AddState(checkName);
                    state.motion = dic["ride_down"];
                }
            }
            else
            {
                if (allStates.ContainsKey(name))
                {
                    allStates[name].motion = dic[name];
                    allStates.Remove(name);
                }
                else
                {
                    var state = stateMachine.AddState(name);
                    state.motion = dic[name];
                }
            }
        }
        foreach (var pair in allStates)
        {
            stateMachine.RemoveState(pair.Value);
        }
        //这里根据类型自动连接
        LinkByPathName(parentPath, stateMachine);
        EditorUtility.SetDirty(controller);
    }

    static void LinkByPathName(string path, AnimatorStateMachine machine)
    {
        Dictionary<string, AnimatorState> stateDic = new Dictionary<string, AnimatorState>();
        foreach (var s in machine.states)
        {
            stateDic[s.state.name] = s.state;
        }
        if (path.Contains("monster"))
        {
            if (!CheckStateExist(stateDic, "stand", "behit", "dead", "attack"))
            {
                Debug.LogWarning("模型目录" + path + " 动画数量不匹配，请检查");
                return;
            }
            machine.defaultState = stateDic["stand"];
            AddTransition(stateDic["behit"], stateDic["stand"]);
            AddTransition(stateDic["attack"], stateDic["stand"]);
        }
        else if (path.Contains("boss"))
        {
            if (!CheckStateExist(stateDic, "stand", "move", "dead", "attack1", "attack2"))
            {
                Debug.LogWarning("模型目录" + path + " 动画数量不匹配，请检查");
                return;
            }
            machine.defaultState = stateDic["stand"];
            AddTransition(stateDic["attack1"], stateDic["stand"]);
            AddTransition(stateDic["attack2"], stateDic["stand"]);
        }
        else if (path.Contains("ride"))
        {
            if (!CheckStateExist(stateDic, "stand", "move"))
            {
                Debug.LogWarning("模型目录" + path + " 动画数量不匹配，请检查");
                return;
            }
            machine.defaultState = stateDic["stand"];
        }
        else if (path.Contains("npc"))
        {
            if (!CheckStateExist(stateDic, "stand", "idle"))
            {
                Debug.LogWarning("模型目录" + path + " 动画数量不匹配，请检查");
                return;
            }
            machine.defaultState = stateDic["stand"];
            AddTransition(stateDic["idle"], stateDic["stand"]);
        }
        else if (path.Contains("pet"))
        {
            if (!CheckStateExist(stateDic, "stand", "stand_fight", "move", "idle", "attack1", "attack2", "show"))
            {
                Debug.LogWarning("模型目录" + path + " 动画数量不匹配，请检查");
                return;
            }
            machine.defaultState = stateDic["stand"];
            AddTransition(stateDic["idle"], stateDic["stand"]);
            AddTransition(stateDic["attack1"], stateDic["stand_fight"]);
            AddTransition(stateDic["attack2"], stateDic["stand_fight"]);
            AddTransition(stateDic["show"], stateDic["stand"]);
        }
        else if (path.Contains("hero"))
        {
            if (!CheckStateExist(stateDic, "stand", "move", "dead", "stand_fight", "attack1", "attack2"
                , "attack3", "skill1", "skill2", "skill3", "skill4", "skill5", "pick", "stand_ride", "move_ride", "stand_rideUp", "stand_rideOff"
                , "enter", "jump1", "jump2", "speed", "fly1", "fly2", "fly3"))
            {
                Debug.LogWarning("模型目录" + path + " 动画数量不匹配，请检查");
                return;
            }
            machine.defaultState = stateDic["stand"];
            AddTransition(stateDic["enter"], stateDic["stand"]);
            AddTransition(stateDic["attack1"], stateDic["stand_fight"]);
            AddTransition(stateDic["attack2"], stateDic["stand_fight"]);
            AddTransition(stateDic["attack3"], stateDic["stand_fight"]);
            AddTransition(stateDic["skill1"], stateDic["stand_fight"]);
            AddTransition(stateDic["skill2"], stateDic["stand_fight"]);
            AddTransition(stateDic["skill3"], stateDic["stand_fight"]);
            AddTransition(stateDic["skill4"], stateDic["stand_fight"]);
            AddTransition(stateDic["skill5"], stateDic["stand_fight"]);

            AddTransition(stateDic["stand_rideUp"], stateDic["stand_ride"]);
            AddTransition(stateDic["stand_rideOff"], stateDic["stand"]);
            AddTransition(stateDic["move_rideUp"], stateDic["move_ride"]);
            AddTransition(stateDic["move_rideOff"], stateDic["move"]);

            AddTransition(stateDic["fly1"], stateDic["fly2"]);
            AddTransition(stateDic["fly3"], stateDic["stand"]);
        }
    }
    static void AddTransition(UnityEditor.Animations.AnimatorState state1, UnityEditor.Animations.AnimatorState state2)
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
    static bool CheckStateExist(Dictionary<string, AnimatorState> stateDic, params string[] names)
    {
        foreach (var s in names)
        {
            if (!stateDic.ContainsKey(s))
            {
                return false;
            }
        }
        return true;
    }

    static void GenerateModelPrefab(string filePath)
    {
        var parentPath = Path.GetDirectoryName(filePath);
        var dummyParentPath = parentPath;
        var matPath = parentPath;
        var modelPath = parentPath + "/model.FBX";
        List<List<string>>[] c = ReadModel(parentPath, "model.txt");
        List<List<string>> effectConfig = c[2];
        var d = c[3];
        if (d.Count > 0)
        {
            var dummy = d[0];
            dummyParentPath = "Assets/AssetSources/" + dummy[0];
            modelPath = dummyParentPath + "/model.FBX";
            matPath = "Assets/AssetSources/" + dummy[2];
        }

        var modelImport = AssetImporter.GetAtPath(modelPath) as ModelImporter;
        if (modelImport == null)
        {
            modelPath = dummyParentPath + "/model@dummy.FBX";
            modelImport = AssetImporter.GetAtPath(modelPath) as ModelImporter;
            if (string.IsNullOrEmpty(modelPath) || !(modelImport is ModelImporter))
            {
                Debug.LogError("目录中不存在FBX文件：" + dummyParentPath);
                return;
            }
            else
            {
                if (d.Count == 0)
                {
                    return;
                }
            }
        }
        string[] allMatList = AssetDatabase.FindAssets("t:Material", new string[] { matPath });
        var source = AssetDatabase.LoadAssetAtPath<GameObject>(modelPath);
        var parentName = Path.GetFileName(parentPath) + ".prefab";
        var files = Directory.GetFiles(parentPath, "*.prefab");
        var prefabPath = parentPath + "/" + parentName;
        if (files.Length > 1 || (files.Length == 1 && Path.GetFileName(files[0]) != parentName))
        {
            foreach (var p in files)
            {
                AssetDatabase.DeleteAsset(p);
            }
        }
        bool removeNode = false;
        GameObject obj = AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath);
        if (obj == null)
        {
            obj = PrefabUtility.CreatePrefab(prefabPath, source);
            removeNode = true;
        }
        else
        {
            List<Transform> tList1 = new List<Transform>();
            List<Transform> tList2 = new List<Transform>();

            tList1.AddRange(source.GetComponentsInChildren<Transform>());
            tList2.AddRange(obj.GetComponentsInChildren<Transform>());
            if (d.Count > 0)
            {
                var dummy = d[0];
                var menpiGroup = dummy[1].Split(',');
                for (int i = tList1.Count - 1; i > 0; i--)
                {
                    var renderer = tList1[i];
                    var name = renderer.name;
                    if (renderer.GetComponent<Renderer>())
                    {
                        bool has = false;
                        foreach (var s in menpiGroup)
                        {
                            if (s == name)
                            {
                                has = true;
                                break;
                            }
                        }
                        if (!has)
                        {
                            tList1.RemoveAt(i);
                        }
                    }
                }
            }

            bool replaceTrans = false;
            if (tList1.Count != tList2.Count)
            {
                replaceTrans = true;
            }
            else
            {
                for (int i = 0; i < tList1.Count; i++)
                {
                    var t1 = tList1[i];
                    var t2 = tList2[i];

                    if (i == 0)
                    {
                        replaceTrans = !CopyComponents(t1, t2, true);
                        if (replaceTrans)
                        {
                            break;
                        }
                    }
                    else
                    {
                        if (t1.name != t2.name)
                        {
                            replaceTrans = true;
                            break;
                        }
                        else
                        {
                            replaceTrans = !CopyComponents(t1, t2, false);
                            if (replaceTrans)
                            {
                                break;
                            }
                        }
                    }
                }
            }
            if (replaceTrans)
            {
                PrefabUtility.ReplacePrefab(source, obj, ReplacePrefabOptions.ReplaceNameBased);
                removeNode = true;
            }
        }
        if (removeNode)
        {
            if (d.Count > 0)
            {
                var rList = obj.GetComponentsInChildren<Renderer>();
                var dummy = d[0];
                var menpiGroup = dummy[1].Split(',');
                for (int i = rList.Length - 1; i >= 0; i--)
                {
                    var renderer = rList[i];
                    var name = renderer.name;
                    bool has = false;
                    foreach (var s in menpiGroup)
                    {
                        if (s == name)
                        {
                            has = true;
                            break;
                        }
                    }
                    if (!has)
                    {
                        GameObject.DestroyImmediate(renderer.gameObject, true);
                    }
                }
            }
        }

        //在当前目录下生成预制体
        if (modelImport.defaultClipAnimations.Length > 0)
        {
            var controllerPath = Path.GetDirectoryName(modelPath) + "/anim.anim";
            var animaorcontroller = AssetDatabase.LoadAssetAtPath<AnimatorController>(controllerPath);
            if (animaorcontroller == null)
            {
                Debug.LogWarning("生成预制体失败，模型目录" + parentPath + " 动画控制器文件不存在，请检查", source);
                return;
            }
            var animator = obj.GetComponent<Animator>();
            animator.runtimeAnimatorController = animaorcontroller;
            animator.cullingMode = AnimatorCullingMode.CullCompletely;
            animator.updateMode = AnimatorUpdateMode.AnimatePhysics;
        }
        var renderers = obj.GetComponentsInChildren<Renderer>();
        //尝试寻找所有的材质球
        if (renderers.Length > allMatList.Length)
        {
            Debug.LogWarning("生成预制体失败，模型目录" + parentPath + " 蒙皮数量和材质球数量不匹配，请检查", obj);
            return;
        }
        for (int i = 0; i < renderers.Length; i++)
        {
            var path = AssetDatabase.GUIDToAssetPath(allMatList[i]);
            var material = AssetDatabase.LoadAssetAtPath<Material>(path);
            var renderer = renderers[i];
            renderer.material = material;
            renderer.receiveShadows = false;
            renderer.lightProbeUsage = UnityEngine.Rendering.LightProbeUsage.Off;
            renderer.reflectionProbeUsage = UnityEngine.Rendering.ReflectionProbeUsage.Off;
            renderer.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            renderer.motionVectorGenerationMode = MotionVectorGenerationMode.ForceNoMotion;
            if (renderer is SkinnedMeshRenderer)
            {
                var skin = renderer as SkinnedMeshRenderer;
                skin.skinnedMotionVectors = false;
            }
        }
        //绑定特效操作
        if (effectConfig.Count > 0)
        {
            var binder = obj.GetComponent<EffectBinder>();
            if (binder == null)
            {
                binder = obj.AddComponent<EffectBinder>();
            }
            List<Transform> tNames = new List<Transform>();
            List<GameObject> pEffects = new List<GameObject>();
            foreach (var pList in effectConfig)
            {
                var tName = pList[0];
                var pName = pList[1];
                Transform t = null;
                if (tName == "null")
                {
                    t = obj.transform;
                }
                else
                {
                    t = obj.transform.Find(tName);
                    if (t == null)
                    {
                        Debug.LogWarning("特效绑定节点:" + tName + "不存在，请检查", obj);
                        return;
                    }
                }
                var asset = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/AssetSources/" + pName);
                if (asset == null)
                {
                    Debug.LogWarning("特效:" + pName + "不存在，请检查", obj);
                }
                tNames.Add(t);
                pEffects.Add(asset);
            }
            binder.effectT = tNames;
            binder.effects = pEffects;
        }
        else
        {
            var binder = obj.GetComponent<EffectBinder>();
            if (binder != null)
            {
                GameObject.DestroyImmediate(binder, true);
            }
        }
        if (obj.transform.rotation != Quaternion.Euler(0, 0, 0))
        {
            obj.transform.rotation = Quaternion.Euler(0, 0, 0);
        }
        if (obj.transform.localPosition != Vector3.zero)
        {
            obj.transform.localPosition = Vector3.zero;
        }
        if (obj.transform.localScale != Vector3.one)
        {
            obj.transform.localScale = Vector3.one;
        }

        EditorUtility.SetDirty(obj);
    }
    static bool CopyComponents(Transform source, Transform target, bool withoutEffectBinder)
    {
        var com1 = source.GetComponents<Component>();
        var com2 = target.GetComponents<Component>();
        if (withoutEffectBinder)
        {
            var list = new List<Component>(com2);
            foreach (var t in list)
            {
                if (t is EffectBinder)
                {
                    list.Remove(t);
                    break;
                }
            }
            com2 = list.ToArray();
        }
        if (com1.Length != com2.Length)
        {
            return false;
        }
        for (int i = 0; i < com1.Length; i++)
        {
            var c1 = com1[i];
            var c2 = com2[i];
            if (c1.GetType() != c2.GetType())
            {
                return false;
            }
            UnityEditorInternal.ComponentUtility.CopyComponent(c1);
            UnityEditorInternal.ComponentUtility.PasteComponentValues(c2);
        }
        return true;
    }
    #endregion

    #region 场景操作

    [MenuItem("FFTools/场景/断开当前场景所有引用(得重新烘培)")]
    public static void BreakAllObjects()
    {
        var currentScene = UnityEngine.SceneManagement.SceneManager.GetActiveScene();
        var objs = currentScene.GetRootGameObjects();
        for (int i = 0; i < objs.Length; i++)
        {
            var rg = objs[i];
            //拷贝rg，并且将所有的信息拷贝
            var newrg = Object.Instantiate<GameObject>(rg, null, true);
            newrg.name = rg.name;
            //var renderers = rg.GetComponentsInChildren<Renderer>(true);
            //var renderers2 = newrg.GetComponentsInChildren<Renderer>(true);
            //复制信息无效，因为真实数据保存在了场景内部，这个只是假象
            //for (int j = 0; j < renderers.Length; j++)
            //{
            //    var renderer1 = renderers[j];
            //    var renderer2 = renderers2[j];
            //    renderer2.lightmapIndex = renderer1.lightmapIndex;
            //    renderer2.lightmapScaleOffset = renderer1.lightmapScaleOffset;
            //    renderer2.realtimeLightmapIndex = renderer1.realtimeLightmapIndex;
            //    renderer2.realtimeLightmapScaleOffset = renderer1.realtimeLightmapScaleOffset;
            //}
            GameObject.DestroyImmediate(rg);
        }
        UnityEditor.SceneManagement.EditorSceneManager.SaveScene(UnityEditor.SceneManagement.EditorSceneManager.GetActiveScene());
    }

    [MenuItem("FFTools/场景/修改错误的模型导入动画控制器")]
    public static void DeleteUselessAnimator()
    {
        var allFiles = AssetDatabase.FindAssets("t:Mesh", new string[] { "Assets/AssetSources/sceneAsset" });
        var count = allFiles.Length;
        foreach (var file in allFiles)
        {
            var path = AssetDatabase.GUIDToAssetPath(file);
            var assetImport = AssetImporter.GetAtPath(path);
            if (string.IsNullOrEmpty(path))
            {
                continue;
            }
            var modelImport = assetImport as ModelImporter;
            if (modelImport.importAnimation && modelImport.clipAnimations.Length == 0)
            {
                modelImport.animationType = ModelImporterAnimationType.None;
                modelImport.SaveAndReimport();
                Debug.LogWarning("文件被修改：" + path, AssetDatabase.LoadAssetAtPath<GameObject>(path));
            }
        }
        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh(ImportAssetOptions.Default);
    }
    [MenuItem("FFTools/场景/删除场景中无用的动画控制器")]
    public static void DeleteUselessAnimatorInScene()
    {
        var currentScene = UnityEngine.SceneManagement.SceneManager.GetActiveScene();
        var objs = currentScene.GetRootGameObjects();
        for (int i = 0; i < objs.Length; i++)
        {
            var rg = objs[i];
            var animators = rg.GetComponentsInChildren<Animator>(true);
            for (int j = 0; j < animators.Length; j++)
            {
                var animator = animators[j];
                if (animator.runtimeAnimatorController == null)
                {
                    Debug.LogWarning("预制体被修改：" + animator.name, animator.gameObject);
                    GameObject.DestroyImmediate(animator);
                }
            }
        }
        UnityEditor.SceneManagement.EditorSceneManager.SaveScene(UnityEditor.SceneManagement.EditorSceneManager.GetActiveScene());
    }
    [MenuItem("FFTools/场景/刷新当前场景数据")]
    public static void RefreshSceneData()
    {
        RefreshSceneData(UnityEditor.SceneManagement.EditorSceneManager.GetActiveScene());
    }
    [MenuItem("FFTools/场景/刷新所有场景数据")]
    public static void RefreshAllSceneData()
    {
        var allFiles = AssetDatabase.FindAssets("t:Scene", new string[] { "Assets/AssetSources/scene" });
        var count = allFiles.Length;
        var index = 0;
        var scenes = new EditorBuildSettingsScene[allFiles.Length];
        foreach (var file in allFiles)
        {
            var path = AssetDatabase.GUIDToAssetPath(file);
            scenes[index] = new EditorBuildSettingsScene(path, true);
            index++;
        }
        var currentScene = UnityEditor.SceneManagement.EditorSceneManager.GetActiveScene();
        var currentPath = currentScene.path;
        EditorBuildSettings.scenes = scenes;
        EditorUtility.ClearProgressBar();
        foreach (var sceneSetting in scenes)
        {
            var name = Path.GetFileNameWithoutExtension(sceneSetting.path);
            if (name.Length == 2)
            {
                continue;
            }
            var scene = UnityEditor.SceneManagement.EditorSceneManager.OpenScene(sceneSetting.path, UnityEditor.SceneManagement.OpenSceneMode.Single);
            if (!RefreshSceneData(scene))
            {
                UnityEngine.Debug.Log(scene.name);
            }
        }
        UnityEditor.SceneManagement.EditorSceneManager.OpenScene(currentPath, UnityEditor.SceneManagement.OpenSceneMode.Single);
        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh(ImportAssetOptions.Default);
    }
    [MenuItem("FFTools/场景/烘培当前场景")]
    public static void BakeScene()
    {
        LightmapEditorSettings.bakeResolution = 5;
        var obj = GameObject.Find("Object/RealtimeLight");
        if (obj != null)
        {
            obj.SetActive(false);
        }
        UnityEditor.Lightmapping.Bake();
        if (obj != null)
        {
            obj.SetActive(true);
        }
        UnityEditor.SceneManagement.EditorSceneManager.SaveScene(UnityEditor.SceneManagement.EditorSceneManager.GetActiveScene());
    }
    [MenuItem("FFTools/场景/烘培所有场景")]
    public static void BakeAllScene()
    {
        var allFiles = AssetDatabase.FindAssets("t:Scene", new string[] { "Assets/AssetSources/scene" });
        var count = allFiles.Length;
        var index = 0;
        var scenes = new EditorBuildSettingsScene[allFiles.Length];
        foreach (var file in allFiles)
        {
            var path = AssetDatabase.GUIDToAssetPath(file);
            scenes[index] = new EditorBuildSettingsScene(path, true);
            index++;
        }
        var currentScene = UnityEditor.SceneManagement.EditorSceneManager.GetActiveScene();
        var currentPath = currentScene.path;
        EditorUtility.ClearProgressBar();
        foreach (var sceneSetting in scenes)
        {
            var name = Path.GetFileNameWithoutExtension(sceneSetting.path);
            if (name.Length == 2)
            {
                continue;
            }
            UnityEditor.SceneManagement.EditorSceneManager.OpenScene(sceneSetting.path, UnityEditor.SceneManagement.OpenSceneMode.Single);
            LightmapEditorSettings.bakeResolution = 5;
            var obj = GameObject.Find("Object/RealtimeLight");
            if (obj != null)
            {
                obj.SetActive(false);
            }
            UnityEditor.Lightmapping.Bake();
            if (obj != null)
            {
                obj.SetActive(true);
            }
            UnityEditor.SceneManagement.EditorSceneManager.SaveScene(UnityEditor.SceneManagement.EditorSceneManager.GetActiveScene());
        }
        UnityEditor.SceneManagement.EditorSceneManager.OpenScene(currentPath, UnityEditor.SceneManagement.OpenSceneMode.Single);
        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh(ImportAssetOptions.Default);
    }
    public static bool RefreshSceneData(UnityEngine.SceneManagement.Scene scene)
    {
        var obj = GameObject.Find("Object");
        if (obj == null)
        {
            Debug.LogError("当前场景找不到Object节点，因此是一个无效场景。");
            return false;
        }
        var smallMap = GameObject.FindObjectOfType<SmallmapCreater>();
        if (smallMap == null)
        {
            Debug.LogError("当前场景找不到smallMap节点，因此是一个无效场景。");
            return false;
        }
        var defaultPos = GameObject.Find("defaultPos");
        if (defaultPos == null)
        {
            Debug.LogError("当前场景找不到defaultPos节点，因此是一个无效场景。");
            return false;
        }
        var looker = GameObject.FindObjectOfType<TestRunner>();
        if (looker == null)
        {
            Debug.LogError("当前场景找不到looker节点，因此是一个无效场景。");
            return false;
        }
        var shadowObj = GameObject.Find("shadow");
        if (shadowObj != null)
        {
            GameObject.DestroyImmediate(shadowObj);
        }
        var pathMesh = GameObject.Find("pathMesh");
        if (pathMesh == null)
        {
            Debug.LogError("当前场景找不到pathMesh节点或者不存在renderer渲染器，因此是一个无效场景。");
            return false;
        }
        pathMesh.layer = LayerMask.NameToLayer("Floor");
        var sceneData = obj.GetComponent<SceneData>();
        if (sceneData == null)
        {
            sceneData = obj.AddComponent<SceneData>();
        }
        var lookerCamera = looker.GetComponentInChildren<Camera>(true);
        if (lookerCamera != null)
        {
            lookerCamera.gameObject.SetActive(false);
        }
        sceneData.width = (short)(smallMap.width * smallMap.cubeScale * 2 * 20);
        sceneData.height = (short)(smallMap.height * smallMap.cubeScale * 2 * 20);
        sceneData.defaultPos = defaultPos.transform.position;
        //生成navmesh
        var t4m = GameObject.Find("Ground");
        if (t4m != null)
        {
            var bbb = t4m.gameObject.GetComponentsInChildren<T4MObjSC>();
            foreach (var a in bbb)
            {
                a.enabled = false;
            }
            var aaa = t4m.gameObject.GetComponentsInChildren<MeshCollider>();
            foreach (var a in aaa)
            {
                a.enabled = false;
            }
        }
        var objs = scene.GetRootGameObjects();
        foreach (var o in objs)
        {
            if (!o.name.Equals("pathMesh"))
            {
                o.SetActive(false);
            }
        }
        pathMesh.isStatic = true;

        var colliders = pathMesh.GetComponentsInChildren<MeshFilter>(true);
        foreach (var c in colliders)
        {
            c.gameObject.layer = LayerMask.NameToLayer("Floor");
            var f = c.gameObject.GetComponent<MeshCollider>();
            if (f == null)
            {
                f = c.gameObject.AddComponent<MeshCollider>();
            }
            f.sharedMesh = c.sharedMesh;
            f.enabled = true;
            var renderer = c.GetComponent<MeshRenderer>();
            if (renderer == null)
            {
                renderer = c.gameObject.AddComponent<MeshRenderer>();
            }
        }

        var renderers = pathMesh.GetComponentsInChildren<MeshRenderer>(true);
        foreach (var r in renderers)
        {
            r.gameObject.isStatic = true;
            r.enabled = true;
        }
        UnityEditor.AI.NavMeshBuilder.BuildNavMesh();
        foreach (var r in renderers)
        {
            r.gameObject.isStatic = false;
            r.enabled = false;
        }
        foreach (var o in objs)
        {
            if (!o.name.Equals("pathMesh"))
            {
                o.SetActive(true);
            }
            else
            {
                pathMesh = o;
            }
        }
        pathMesh.isStatic = false;

        //深度判断
        if (sceneData.enableDepth)
        {
            //将整个Object内部物体材质球order提升
            var all = obj.GetComponentsInChildren<MeshRenderer>(true);
            foreach (var a in all)
            {
                var mats = a.sharedMaterials;
                foreach (var m in mats)
                {
                    if (m.renderQueue <= 2500)
                    {
                        m.renderQueue = 2600;
                        EditorUtility.SetDirty(m);
                    }
                }
            }
            UnityEditor.AssetDatabase.SaveAssets();
        }
        UnityEditor.SceneManagement.EditorSceneManager.SaveScene(UnityEditor.SceneManagement.EditorSceneManager.GetActiveScene());
        return true;
    }
    #endregion

    [MenuItem("FFTools/资源文件名检查")]
    static void Check()
    {
        //实例化r，第二个参数为匹配的要求，这里为忽略大小写
        string pat = @"^[a-zA-Z0-9@_\./-]+$";
        Regex r = new Regex(pat, RegexOptions.IgnoreCase);
        var allFiles = Directory.GetFiles("Assets/AssetSources");
        var errorCount = 0;
        foreach (var path in allFiles)
        {
            if (!path.EndsWith(".meta") && !path.Contains("/altas/"))
            {
                if (!r.IsMatch(path))
                {
                    Debug.LogError("error: 文件名不合法  path=" + path, AssetDatabase.LoadAssetAtPath<Object>(path));
                    errorCount++;
                }
            }
        }
        Debug.Log("检查完毕，一共检查到" + errorCount + "个名称错误的文件");
    }

    [MenuItem("FFTools/创建字体", false, 2)]
    static public void CrateBMFont()
    {
        var selectFile = Selection.activeObject;
        var filePath = AssetDatabase.GetAssetPath(selectFile);
        var parentPath = Path.GetDirectoryName(filePath);
        var dicName = Path.GetFileName(parentPath);
        var configPath = parentPath + "/" + dicName + ".fnt";
        var imagePath = parentPath + "/" + dicName + "_0.tga";
        var matPath = parentPath + "/" + dicName + "_mat.mat";
        var fontPath = parentPath + "/" + dicName + ".fontsettings";

        var textAsset = AssetDatabase.LoadAssetAtPath<TextAsset>(configPath);
        if (textAsset == null)
        {
            Debug.LogWarning("当前目录中不存在fnt配置文件:" + configPath);
            return;
        }
        var fontTexture = AssetDatabase.LoadAssetAtPath<Texture2D>(imagePath);
        if (textAsset == null)
        {
            Debug.LogWarning("当前目录中不存在贴图文件:" + imagePath);
            return;
        }
        var material = AssetDatabase.LoadAssetAtPath<Material>(matPath);
        if (material == null)
        {
            material = new Material(Shader.Find("UI/Default"));
            material.mainTexture = fontTexture;
            AssetDatabase.CreateAsset(material, matPath);
        }

        bool createFont = false;
        var font = AssetDatabase.LoadAssetAtPath<Font>(fontPath);
        if (font == null)
        {
            font = new Font();
            createFont = true;
        }

        BMFont bmFont = new BMFont();
        BMFontReader.Load(bmFont, dicName, textAsset.bytes);
        CharacterInfo[] characterInfo = new CharacterInfo[bmFont.glyphs.Count];
        for (int i = 0; i < bmFont.glyphs.Count; i++)
        {
            BMGlyph bmInfo = bmFont.glyphs[i];
            CharacterInfo info = new CharacterInfo();
            info.index = bmInfo.index;
            info.uvBottomLeft = new Vector2((float)bmInfo.x / (float)bmFont.texWidth, 1 - (float)bmInfo.y / (float)bmFont.texHeight);
            info.uvBottomRight = new Vector2((float)(bmInfo.x + bmInfo.width) / (float)bmFont.texWidth, 1 - (float)bmInfo.y / (float)bmFont.texHeight);
            info.uvTopLeft = new Vector2((float)bmInfo.x / (float)bmFont.texWidth, 1 - (float)(bmInfo.y + bmInfo.height) / (float)bmFont.texHeight);
            info.uvTopRight = new Vector2((float)(bmInfo.x + bmInfo.width) / (float)bmFont.texWidth, 1 - (float)(bmInfo.y + bmInfo.height) / (float)bmFont.texHeight);
            info.minX = bmInfo.offsetX;
            info.minY = bmInfo.offsetY;
            info.glyphWidth = bmInfo.width;
            info.glyphHeight = -bmInfo.height;
            info.advance = bmInfo.advance;
            info.style = FontStyle.Normal;
            characterInfo[i] = info;
        }
        font.characterInfo = characterInfo;
        font.material = material;
        if (createFont)
        {
            AssetDatabase.CreateAsset(font, fontPath);
        }
        EditorUtility.SetDirty(font);
        EditorUtility.SetDirty(material);
        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh(ImportAssetOptions.Default);
    }
    [MenuItem("FFTools/AltasMaker", false, 3)]
    static void AltasMaker()
    {
        EditorWindow.GetWindow<AtlasMaker>(false, "Atlas Maker", true).Show();
    }
}