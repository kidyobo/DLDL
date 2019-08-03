using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text.RegularExpressions;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace kingsly
{
    public class Util 
    {
        public const string UIManagerPrefabPath = "Assets/AssetSources/ui\\UiManager.prefab";
        public const string UIPath1 = "Assets/AssetSources/ui/delaySystem\\";
        public const string UIPath2 = "Assets/AssetSources/ui/system\\";
        public const string subStr = "/Assets";

        /// <summary>
        /// 这个变量配合处理滚动条
        /// </summary>
        static Vector2 scrollPosition;
        /// <summary>
        /// 根据path拿到Object
        /// </summary>
        public static Object GetObjectByPath(string path)
        {
            Object obj = AssetDatabase.LoadAssetAtPath(path, typeof(Object));
            return obj ? obj : null;
        }


        public static void ResultShow(List<Object> goList)
        {
            int length = goList.Count;
            if (length > 0)
            {

                scrollPosition = GUILayout.BeginScrollView(scrollPosition);
                EditorGUILayout.Space(); EditorGUILayout.Space();
                for (int i = 0; i < length; i++)
                {
                    GUILayout.BeginHorizontal();
                    if (goList[i].GetType() == typeof(GameObject))
                    {

                        GameObject goInScene = GameObject.Find(goList[i].name);
                        if (GUILayout.Button(goList[i].name, GUILayout.Height(25)))
                        {
                            Selection.activeGameObject = goInScene;
                            SceneView sv = SceneView.lastActiveSceneView;
                            sv.AlignViewToObject(goInScene.transform);
                            FocusSceneHierarchyWindow();
                        }
                        if (GUILayout.Button("预制", GUILayout.Height(25), GUILayout.Width(60)))
                        {
                            Selection.activeGameObject = goList[i] as GameObject;
                        }
                        if (!goInScene)
                        {
                            if (GUILayout.Button("场景+", GUILayout.Height(25), GUILayout.Width(60)))
                            {
                                GameObject uimanager = GameObject.Find("UiManager");
                                if (!uimanager)
                                {
                                    uimanager = InstantiatePrefab(GetObjectByPath(UIManagerPrefabPath) as GameObject);
                                }
                                GameObject instantiateGo = InstantiatePrefab(goList[i] as GameObject);
                                SetParent(instantiateGo, uimanager);

                                Selection.activeGameObject = instantiateGo;
                                FocusSceneHierarchyWindow();
                            }
                        }
                        else
                        {
                            GUI.backgroundColor = Color.green;
                            if (GUILayout.Button("场景—", GUILayout.Height(25), GUILayout.Width(60)))
                            {
                               UnityEngine.Object.DestroyImmediate(goInScene);
                            }
                        }
                        GUI.backgroundColor = Color.gray * 2f; // 恢复背景默认颜色
                    }
                    else//不是GameObject 的情况 ，比如 图片等资源
                    {
                        if (GUILayout.Button(goList[i].name, GUILayout.Height(25)))
                        {
                            GUI.backgroundColor = Color.green;
                            Selection.activeObject = goList[i];
                        }
                    }
                    GUILayout.EndHorizontal();
                }
                GUILayout.EndScrollView();
            }
        }
        /// <summary>
        /// 配合处理按钮颜色
        /// </summary>
        static int selectIndx = -1;
        static int selectMoveIndx = -1;
        static int fileTypeIndex=0;
        static int fileTypeIndexFlag = 0;

        private static List<string> fileTypes = new List<string>();
        /// <summary>
        /// 显示资源引用结果
        /// </summary>
        /// <param name="paths">显示的所有引用的资源的路径</param>
        /// <param name="moveToPath">指定的移动路径</param>
        public static void AssetReferenceResultShow(string[] paths, string moveToPath,bool showMoveBtn=false)
        {

           
            List<string> listS = new List<string>(paths);
            listS.Sort();
            int len = listS.Count;
            EditorGUILayout.Space();
            fileTypes.Clear();
            foreach (string str in paths)
            {
                string type =   str.Substring(str.IndexOf("."));
                if (!fileTypes.Contains(type))
                {
                    fileTypes.Add(type);
                }
            }
            fileTypeIndex = GUILayout.Toolbar(fileTypeIndex, fileTypes.ToArray(), GUILayout.Height(25));
            if (fileTypeIndexFlag != fileTypeIndex)
            {
                fileTypeIndexFlag = fileTypeIndex;
                selectIndx = -1;
                selectMoveIndx = -1;
            }
            EditorGUILayout.Space();
            scrollPosition = GUILayout.BeginScrollView(scrollPosition);
            EditorGUILayout.Space(); EditorGUILayout.Space();
            int count = 0;
  
            for (int i = 0; i < len; i++)
            {
                if (listS[i].Contains(fileTypes[fileTypeIndex]))
                {
                    GUILayout.BeginHorizontal();
                    GUILayout.TextArea(listS[i], GUILayout.Height(22));
                    if (selectIndx == i)
                    {
                        GUI.backgroundColor = Color.green; 
                    }
                    if (GUILayout.Button("转到", GUILayout.Height(20), GUILayout.Width(60)))
                    {
                        selectIndx = i;
                        Debug.Log(listS[i]);
                        Selection.activeObject = GetObjectByPath(listS[i]);
                    }
                    GUI.backgroundColor = Color.gray * 2f; // 恢复背景默认颜色

                    if (moveToPath != "" && showMoveBtn) {
                        if (selectMoveIndx == i)
                        {
                            GUI.backgroundColor = Color.green;
                        }
                        if (GUILayout.Button("移动", GUILayout.Height(20), GUILayout.Width(60)))
                        {
                            selectMoveIndx = i;
                            string isSuccess = AssetDatabase.MoveAsset(listS[i], moveToPath + listS[i].Substring(listS[i].LastIndexOf("/")));
                            if (isSuccess == "")
                            {
                                Debug.Log("移动成功！！！");
                                count++;
                            }
                            else
                            {
                                Debug.Log("移动失败！！！");
                            }

                        }
                        GUI.backgroundColor = Color.gray * 2f; // 恢复背景默认颜色
                    }

                    GUILayout.EndHorizontal();
                }
            }
            if (count > 0)
                AssetDatabase.Refresh();
            GUILayout.EndScrollView();
        }

        /// <summary>
        /// 查找引用
        /// </summary>
        /// <param name="findPath">默认为： "/AssetSources/ui"</param>
        /// <param name="fileType">查找文件类型，如： "*.prefab", "*.FBX", "*.mat", "*.controller"</param>
        public static void FindReferences(string fileType, List<Object> resultList, string findPath= "/AssetSources/ui")
        {
            EditorSettings.serializationMode = SerializationMode.ForceText;
            string path = AssetDatabase.GetAssetPath(Selection.activeObject);

            if (!string.IsNullOrEmpty(path))
            {
                string guid = AssetDatabase.AssetPathToGUID(path);

                string[] files = Directory.GetFiles(Application.dataPath + findPath, fileType, SearchOption.AllDirectories);

                int startIndex = 0;
                EditorApplication.update = delegate ()
                {
                    if (files.Length <= 0) return;
                    string file = files[startIndex];
                    bool isCancel = EditorUtility.DisplayCancelableProgressBar("匹配资源中", file, startIndex / (float)files.Length);
                    if (Regex.IsMatch(File.ReadAllText(file), guid))
                    {
                        string path1 = file.Substring(file.IndexOf(subStr) + 1);
                        Object obj = GetObjectByPath(path1) as Object;
                        if (obj != null)
                        {
                            resultList.Add(obj);
                        }
                    }

                    startIndex++;
                    if (isCancel || startIndex >= files.Length)
                    {
                        EditorUtility.ClearProgressBar();
                        EditorApplication.update = null;
                        startIndex = 0;
                        EditorWindow.GetWindow<AssetReferencedAndReplace>().ShowNotification(new GUIContent("匹配结束!!!"));
                    }

                };
            }
        }
        /// <summary>
        /// 是否有一级子物体显示
        /// </summary>
        public static bool HasChildActive(GameObject go)
        {
            foreach (Transform child in go.transform)
            {
                if (child.gameObject.activeInHierarchy)
                {
                    return true;
                }
            }
            return false;
        }
        /// <summary>
        /// 设置子物体到父物体下
        /// </summary>
        public static void SetParent(GameObject child, GameObject parent)
        {
            if (child && parent)
            {
                child.transform.SetParent(parent.transform, false);
            }
        }

        /// <summary>
        /// 编辑模式加载go到场景中
        /// </summary>
        public static GameObject InstantiatePrefab(GameObject go)
        {
            return PrefabUtility.InstantiatePrefab(go) as GameObject;
        }
        /// <summary>
        /// 把焦点聚焦到Hierarchy窗口
        /// </summary>
        public static void FocusSceneHierarchyWindow()
        {
            Assembly editorAssembly = typeof(EditorWindow).Assembly;
            System.Type HierarchyWindowType = editorAssembly.GetType("UnityEditor.SceneHierarchyWindow");
            EditorWindow.GetWindow(HierarchyWindowType).Focus();
        }
        /// <summary>
        /// 焦点转到Scene窗口
        /// </summary>
        public static void FocusSceneWindow()
        {
            Assembly editorAssembly = typeof(EditorWindow).Assembly;
            System.Type SceneWindowType = editorAssembly.GetType("UnityEditor.SceneView");
            EditorWindow.GetWindow(SceneWindowType).Focus();
        }

        static GameObject uimanager = null;
        static GameObject UIMPrefab = null;

        public static int SelectIndx
        {
            get
            {
                return selectMoveIndx;
            }

            set
            {
                selectMoveIndx = value;
            }
        }

        /// <summary>
        /// 显示UIManager
        /// </summary>
        public static void ShowUIManager()
        {
            EditorGUILayout.Space();
            GUILayout.BeginHorizontal();
            GUI.backgroundColor = Color.gray * 1.6f;
            if(uimanager==null)
            uimanager = GameObject.Find("UiManager");
            if(UIMPrefab==null)
             UIMPrefab = GetObjectByPath(UIManagerPrefabPath) as GameObject;

            if (GUILayout.Button("UIManager", GUILayout.Height(25)))
            {
                FocusSceneWindow();
                if (uimanager)
                {
                    SceneView sv = SceneView.lastActiveSceneView;
                    sv.AlignViewToObject(uimanager.transform);
                    Selection.activeGameObject = uimanager;
                    FocusSceneHierarchyWindow();
                }
            }
            if (GUILayout.Button("预制", GUILayout.Height(25), GUILayout.Width(60)))
            {
                Selection.activeGameObject = UIMPrefab;
            }
            if (!uimanager)
            {
                if (GUILayout.Button("场景+", GUILayout.Height(25), GUILayout.Width(60)))
                {
                    GameObject instantiateGo = Util.InstantiatePrefab(UIMPrefab);
                    Selection.activeGameObject = instantiateGo;
                    FocusSceneHierarchyWindow();
                }
            }
            else
            {
                GUI.backgroundColor = Color.gray * 1.9f; // 恢复背景默认颜色
                if (GUILayout.Button("场景—", GUILayout.Height(25), GUILayout.Width(60)))
                {
                    Object.DestroyImmediate(uimanager);
                }
            }
            GUILayout.EndHorizontal();
            GUI.backgroundColor = Color.gray * 2f; // 恢复背景默认颜色
        }

        /// <summary>
        /// 获取所有子物体（包括子孙物体）的名称 
        /// includeParent = false 不包含其父物体
        /// </summary>
        /// <param name="includeParent"></param>
        /// <returns></returns>
        public static List<string> GetAllChildGoNameList(GameObject parentGo, bool includeParent = false)
        {
            List<string> goList = new List<string>();
            foreach (Transform child in parentGo.GetComponentsInChildren<Transform>(true))
            {
                if (!includeParent && child.name == parentGo.name)
                {
                    continue;
                }
                goList.Add(child.name);
            }
            return goList;
        }

        /// <summary>
        /// 获取一级子物体
        /// </summary>
        /// <param name="parentGo">父物体</param>
        /// <returns>一级子物体列表</returns>
        public static List<GameObject> GetFirstChildGoList(GameObject parentGo)
        {
            List<GameObject> goList = new List<GameObject>();
            foreach (Transform child in parentGo.transform)
            {
                goList.Add(child.gameObject);
            }
            return goList;
        }

        /// <summary>
        /// 根据名字获取子物体列表
        /// </summary>
        /// <param name="parentGo">父物体</param>
        /// <param name="name">名字</param>
        /// <param name="includeParent">是否包含父物体</param>
        /// <param name="isEquals"></param>
        /// <returns>名字匹配的子物体 列表</returns>
        public static List<GameObject> GetAllChildGoByName(GameObject parentGo,string name, bool includeParent = false, bool isEquals = true)
        {
            List<GameObject> goList = new List<GameObject>();
            foreach (Transform child in parentGo.GetComponentsInChildren<Transform>(true))
            {

                if (!includeParent && child.name == parentGo.name)
                {
                    continue;
                }
                if (isEquals)
                {
                    if (child.name == name)
                        goList.Add(child.gameObject);
                }
                else
                {
                    if (child.name.Contains(name))
                    {
                        goList.Add(child.gameObject);
                    }
                }
            }
            return goList;
        }

        /// <summary>
        /// 冒泡排序
        /// 暂时不用，放在这里备份
        /// </summary>
        /// <param name="gos"></param>
        private void SoltGos(GameObject[] gos)
        {
            int i, j;  //先定义一下要用的变量
            GameObject temp;
            for (i = 0; i < gos.Length - 1; i++)
            {
                var iii = gos[i].GetComponent<RectTransform>().GetSiblingIndex();
                for (j = i + 1; j < gos.Length; j++)
                {
                    var jjj = gos[j].GetComponent<RectTransform>().GetSiblingIndex();
                    if (iii > jjj) //如果第二个小于第一个数
                    {
                        //交换两个数的位置，在这里你也可以单独写一个交换方法，在此调用就行了
                        temp = gos[i]; //把大的数放在一个临时存储位置
                        gos[i] = gos[j]; //然后把小的数赋给前一个，保证每趟排序前面的最小
                        gos[j] = temp; //然后把临时位置的那个大数赋给后一个
                    }
                }
            }
        }


        /// <summary>
        /// 查找丢失的引用，暂时放在这里备份
        /// </summary>
        /// <param name="path">如："/AssetSources/ui/system/"</param>
        /// <param name="resultList"></param>


        private void FindMissingReference(string path, List<Object> resultList)
        {
            string fullPath = Application.dataPath + path;
            //获得指定路径下面的所有资源文件
            if (Directory.Exists(fullPath))
            {//存在这个路径
                DirectoryInfo dirInfo = new DirectoryInfo(fullPath);
                FileInfo[] files = dirInfo.GetFiles("*.prefab", SearchOption.AllDirectories);
                int len = files.Length;
                for (int i = 0; i < len; i++)
                {
                    GameObject obj = AssetDatabase.LoadAssetAtPath("Assets" + path + files[i].Name, typeof(GameObject)) as GameObject;
                    //这是批量修改
                    if (null != obj)
                        foreach (Transform child in obj.GetComponentsInChildren<Transform>())
                        {
                            if (!child.gameObject.activeSelf) continue;
                            Image image = child.GetComponent<Image>();
                            if (null != image && image.enabled == true)
                            {
                                SerializedObject so = new SerializedObject(image);//生成一个组件对应的SerializedObject对象 用于遍历这个组件的所有属性
                                var iter = so.GetIterator();//拿到迭代器
                                while (iter.NextVisible(true))//如果有下一个属性
                                {
                                    //如果这个属性类型是引用类型的
                                    if (iter.propertyType == SerializedPropertyType.ObjectReference)
                                    {
                                        //引用对象是null 并且 引用ID不是0 说明丢失了引用
                                        if (iter.objectReferenceValue == null && iter.objectReferenceInstanceIDValue != 0)
                                        {
                                            if (!resultList.Contains(obj)) { resultList.Add(obj); }
                                        }
                                    }
                                }
                            }
                        }
                }
            }
        }

        /// <summary>
        /// 选中场景中丢失引用的物体，暂时放在这里备份
        /// </summary>
        /// <param name="parent"></param>
        /// <param name="resultList">这个list可以定义一个临时的</param>
        private void FindMissingReferenceInScene(GameObject parent, List<Object> resultList)
        {
            foreach (Transform child in parent.GetComponentsInChildren<Transform>())
            {
                if (!child.gameObject.activeSelf) continue;
                Image image = child.GetComponent<Image>();
                if (null != image && image.enabled == true)
                {
                    SerializedObject so = new SerializedObject(image);//生成一个组件对应的SerializedObject对象 用于遍历这个组件的所有属性
                    var iter = so.GetIterator();//拿到迭代器
                    while (iter.NextVisible(true))//如果有下一个属性
                    {
                        //如果这个属性类型是引用类型的
                        if (iter.propertyType == SerializedPropertyType.ObjectReference)
                        {
                            //引用对象是null 并且 引用ID不是0 说明丢失了引用
                            if (iter.objectReferenceValue == null && iter.objectReferenceInstanceIDValue != 0)
                            {
                                if (!resultList.Contains(child.gameObject))
                                    resultList.Add(child.gameObject);
                            }
                        }
                    }
                }
            }
            Selection.objects = resultList.ToArray();
        }
    }
}

