using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using UnityEditor;
using UnityEngine;

namespace kingsly
{
    /// <summary>
    /// UI选择记录
    /// </summary>
    public class UISelectOperation : EditorWindow
    {
        [MenuItem("斗罗大陆/UI快速选择")]
        static void MyTools()
        {
            EditorWindow window = GetWindow(typeof(UISelectOperation));
            window.titleContent = new GUIContent("UI快速选择");
            window.minSize = new Vector2(300, 300);
            window.Show();
        }
        private void OnEnable()
        {
            autoRepaintOnSceneChange = true;
        }
        private void OnDestroy()
        {
            //释放内存
            System.GC.Collect();
            Resources.UnloadUnusedAssets();
        }
        //自动选择和手动选择按钮切换
        bool autoSelectGoInScene = true;

        List<string> uiLayerTypes = new List<string>();
        int uiLayerTypesIndex = 2;

        //uiManager直接子物体
        List<GameObject> uiMFirstChilds = new List<GameObject>();

        //保存父物体名称(运行时父列表)
        List<string> parentNameList = new List<string>();
        //保存子物体名称(运行时子列表)
        List<string> childNameList = new List<string>();

        //配合处理滚动条
        Vector2 scrollPosition;
        /// <summary>
        /// UIManager下的父物体
        /// </summary>
        GameObject parentGoInScene = null;

        /**运行时UIManager*/
        static GameObject runTime_UIManager;
        //场景中的uiManager
        GameObject uiManager = null;

    //以下方法为运行游戏是，禁用掉UIManager
    [RuntimeInitializeOnLoadMethod]
        static void SetUIManager()
        {
            runTime_UIManager = GameObject.Find("UiManager");
            if (runTime_UIManager)
            {
                runTime_UIManager.SetActive(false);
            }
        }


        
        public void OnGUI()
        {

            if (Application.isPlaying)//游戏运行时
            {
                ClearList();
                EditorGUILayout.Space();
                if (GUILayout.Button(autoSelectGoInScene ? "手动选择(此按钮一般不用)" : "自动选择", GUILayout.Height(25)))
                {
                    autoSelectGoInScene = !autoSelectGoInScene;
                }
                if (autoSelectGoInScene)//自动选择
                {
                    if (uiManager == null)
                    {
                      uiManager  = GameObject.Find("UiManager");
                    }
                    if (uiManager && uiManager.scene.name == "DontDestroyOnLoad")
                    {
                        uiLayerTypes.Clear();
                        uiMFirstChilds.Clear();
                        //---start----显示UI层-------
                        foreach (Transform child in uiManager.transform)
                        {
                            string name = child.name;
                            if (name.Contains(".") && child.childCount > 0 && Util.HasChildActive(child.gameObject))
                            {
                                uiLayerTypes.Add(name.Substring(name.IndexOf(".") + 1));
                                uiMFirstChilds.Add(child.gameObject);
                            }
                        }
                        EditorGUILayout.Space();
                        uiLayerTypesIndex = GUILayout.Toolbar(uiLayerTypesIndex < uiMFirstChilds.Count ? uiLayerTypesIndex : 0, uiLayerTypes.ToArray(), GUILayout.Height(25));
                        //---end------显示UI层-------
                        //滚动条开始
                        scrollPosition = GUILayout.BeginScrollView(scrollPosition);
                        EditorGUILayout.Space();
                        if (uiMFirstChilds.Count > 0)
                            foreach (Transform child in uiMFirstChilds[uiLayerTypesIndex < uiMFirstChilds.Count ? uiLayerTypesIndex : 0].GetComponentsInChildren<Transform>())
                            {
                                string childName = child.name;
                                if (!childName.Contains(".") && ((childName.EndsWith("View") || childName.EndsWith("Panel") || childName.EndsWith("MessageBox")) || childName.Contains("FuBenDaTing")))
                                {
                                    AddName2List(child.gameObject, childName);
                                }
                            }
                        //滚动条结束
                        GUILayout.EndScrollView();
                    }
                }
                else//手动选择
                {
                    EditorGUILayout.Space();
                    GameObject[] selectGo = Selection.gameObjects;
                    for (int i = 0; i < selectGo.Length; i++)
                    {
                        string childName = selectGo[i].name;
                        if (childName == "mask" || childName == "content" || childName == "panelRoot")
                        {
                            continue;
                        }
                        AddName2List(selectGo[i], childName);
                    }
                }
            }
            else//编辑器模式
            {
                if (runTime_UIManager&& !runTime_UIManager.activeSelf)
                {
                    runTime_UIManager.SetActive(true);
                }
                autoSelectGoInScene = true;
                ClearList();
                //滚动条开始
                scrollPosition = GUILayout.BeginScrollView(scrollPosition);
                Util.ShowUIManager();
                ResultShow(parentNameList, true);
                ResultShow(childNameList, false);
                //滚动条结束
                GUILayout.EndScrollView();
            }
        }

        private void ClearList()
        {
            GUILayout.BeginHorizontal();
            if (GUILayout.Button("清空父列表", GUILayout.Height(25)))
            {
                if (parentNameList.Count > 0)
                    parentNameList.Clear();

            }
            if (GUILayout.Button("清空子列表", GUILayout.Height(25)))
            {
                if (childNameList.Count > 0)
                    childNameList.Clear();
            }
            if (GUILayout.Button("清空两列表", GUILayout.Height(25)))
            {
                if (parentNameList.Count > 0)
                    parentNameList.Clear();
                if (childNameList.Count > 0)
                    childNameList.Clear();
            }
            GUILayout.EndHorizontal();
        }
      
        private void AddName2List(GameObject ListItem, string childName)
        {
            GUILayout.BeginHorizontal();
            if (GUILayout.Button(childName, GUILayout.Height(25)))
            {
                Util.FocusSceneWindow();
                Selection.activeObject = ListItem;
                SceneView sv = SceneView.lastActiveSceneView;
                sv.AlignViewToObject(ListItem.transform);
                Util.FocusSceneHierarchyWindow();
            }

            if (!parentNameList.Contains(childName))
            {
                if (GUILayout.Button("父列表+", GUILayout.Height(25), GUILayout.Width(60)))
                {
                    parentNameList.Add(childName);
                }
            }
            else
            {
                GUI.backgroundColor = Color.green * 1.8f;
                if (GUILayout.Button("父列表—", GUILayout.Height(25), GUILayout.Width(60)))
                {
                    parentNameList.Remove(childName);
                }
                GUI.backgroundColor = Color.gray * 2f; // 恢复背景默认颜色
            }
            if (!childNameList.Contains(childName))
            {
                GUI.backgroundColor = Color.gray * 1.6f;
                if (GUILayout.Button("子列表+", GUILayout.Height(25), GUILayout.Width(60)))
                {
                    childNameList.Add(childName);
                }
                GUI.backgroundColor = Color.gray * 2f; // 恢复背景默认颜色
            }
            else
            {
                GUI.backgroundColor = Color.green;
                if (GUILayout.Button("子列表—", GUILayout.Height(25), GUILayout.Width(60)))
                {
                    childNameList.Remove(childName);
                }
                GUI.backgroundColor = Color.gray * 2f; // 恢复背景默认颜色
            }
            GUILayout.EndHorizontal();
            EditorGUILayout.Space();
        }


        private void ResultShow(List<string> list, bool isParent)
        {
            int count = list.Count;
            if (count > 0)
            {
                EditorGUILayout.Space(); EditorGUILayout.Space();
                for (int k = 0; k < count; k++)
                {
                    string key = list[k];
                    GUILayout.BeginHorizontal();
                    GameObject goPrefab = Util.GetObjectByPath(Util.UIPath1 + key + ".prefab") as GameObject;
                    if (!goPrefab)
                        goPrefab = Util.GetObjectByPath(Util.UIPath2 + key + ".prefab") as GameObject;
                    if (goPrefab)
                    {

                        if (isParent)
                        {
                            if (parentGoInScene && parentGoInScene.name == key)
                            {
                                GUI.backgroundColor = Color.green;
                            }
                        }
                        if (GUILayout.Button(key, GUILayout.Height(25)))
                        {
                            Util.FocusSceneWindow();
                            if (GameObject.Find(key) && goPrefab)
                            {
                                Selection.activeGameObject = GameObject.Find(key);
                                SceneView sv = SceneView.lastActiveSceneView;
                                sv.AlignViewToObject(GameObject.Find(key).transform);
                                Util.FocusSceneHierarchyWindow();
                            }
                        }
                        if (GUILayout.Button("预制", GUILayout.Height(25), GUILayout.Width(60)))
                        {
                            Selection.activeGameObject = goPrefab;
                        }
                        if (!GameObject.Find(key))
                        {
                            if (GUILayout.Button("场景+", GUILayout.Height(25), GUILayout.Width(60)))
                            {
                                GameObject uimanager = GameObject.Find("UiManager");
                                if (!uimanager)
                                {
                                    uimanager = Util.InstantiatePrefab(Util.GetObjectByPath(Util.UIManagerPrefabPath) as GameObject);
                                }
                                GameObject childGoInScene;
                                if (isParent)
                                {
                                    parentGoInScene = Util.InstantiatePrefab(goPrefab);
                                    Util.SetParent(parentGoInScene, uimanager);
                                    Selection.activeGameObject = parentGoInScene;
                                }
                                else
                                {
                                    childGoInScene = Util.InstantiatePrefab(goPrefab);
                                    GameObject panelRoot = null;
                                    if (parentGoInScene)
                                    {
                                        int len = parentGoInScene.transform.childCount;
                                        for (int i = len - 1; i >= 0; i--)
                                        {
                                            Transform child = parentGoInScene.transform.GetChild(i);
                                            if (child.name == "panelRoot")
                                            {
                                                panelRoot = child.gameObject;
                                                break;
                                            }
                                            if (panelRoot == null)
                                            {
                                                int len2 = child.transform.childCount;
                                                for (int j = len2 - 1; j >= 0; j--)
                                                {
                                                    Transform child2 = child.transform.GetChild(j);
                                                    if (child2.name == "panelRoot")
                                                    {
                                                        panelRoot = child2.gameObject;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        Util.SetParent(childGoInScene, panelRoot ?? parentGoInScene);
                                    }
                                    else
                                    {
                                        Util.SetParent(childGoInScene, uimanager);
                                    }
                                    Selection.activeGameObject = childGoInScene;
                                }
                                Util.FocusSceneHierarchyWindow();
                            }
                        }
                        else
                        {
                            GUI.backgroundColor = Color.green;
                            if (GUILayout.Button("场景—", GUILayout.Height(25), GUILayout.Width(60)))
                            {
                                DestroyImmediate(GameObject.Find(key));
                            }
                        }
                        GUI.backgroundColor = Color.gray * 1.8f; // 恢复背景默认颜色
                    }
                    GUILayout.EndHorizontal();
                }
            }
        }
    }
}

