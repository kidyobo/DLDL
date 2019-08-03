using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace kingsly
{
    /// <summary>
    /// 资源被哪些文件引用&替换
    /// </summary>
    public class AssetReferencedAndReplace:EditorWindow
    {
        [MenuItem("斗罗大陆/被引用和替换")]
        static void myTools()
        {
            EditorWindow window = GetWindow(typeof(AssetReferencedAndReplace));
            window.titleContent = new GUIContent("被引用和替换");
            window.minSize = new Vector2(300, 300);
            window.Show();
        }

        private void OnDestroy()
        {
            //释放内存
            System.GC.Collect();
            Resources.UnloadUnusedAssets();
        }

        //匹配类型
        string[] findFileTypeNames = { "预制文件", "模型文件", "材质文件", "动画控制器" };
        string[] findFileTypes = { "*.prefab", "*.FBX", "*.mat", "*.controller" };
        int findFileTypeIndex = 0;

        /*查找路径**/
        string findPath = "/AssetSources/ui";
        bool hasFindPath = false;

        //旧替换的对象
        static Object oldReplaceObject;
        //新替换对象
        static Object replaceObject;
        //查找完成后显示GameObject，方便点击选中
        List<Object> goList = new List<Object>();

        [MenuItem("Assets/设为旧替换文件")]
        static void setOldReplace()
        {
            oldReplaceObject = Selection.objects[0];
        }

        [MenuItem("Assets/设为新替换文件")]
        static void setNewReplace()
        {
            replaceObject = Selection.objects[0];
        }

        private void OnGUI()
        {
            EditorGUILayout.Space();
            EditorGUILayout.ObjectField("当前选中文件：", Selection.activeObject ? Selection.activeObject : null, typeof(Object), false);

            oldReplaceObject = EditorGUILayout.ObjectField("旧替换文件：", oldReplaceObject, typeof(Object), false);
            replaceObject = EditorGUILayout.ObjectField("新替换文件：", replaceObject, typeof(Object), false);
            if (replaceObject != null && goList.Count > 0)
            {
                if (GUILayout.Button("旧文件换为新文件", GUILayout.Height(25)))
                {
                    int count = goList.Count;
                    for (int i = 0; i < count; i++)
                    {
                        foreach (Transform child in (goList[i] as GameObject).GetComponentsInChildren<Transform>(true))
                        {
                            RawImage rawImage = child.gameObject.GetComponent<RawImage>();
                            if (rawImage && rawImage.texture == oldReplaceObject as Texture)
                            {
                                rawImage.texture = replaceObject as Texture;
                            }
                            Image image = child.gameObject.GetComponent<Image>();
                            if (image && image.sprite == oldReplaceObject as Sprite)
                            {
                                image.sprite = replaceObject as Sprite;
                            }
                        }
                        //通知你的编辑器 obj 改变了
                        EditorUtility.SetDirty(goList[i]);
                    }
                    AssetDatabase.SaveAssets();
                    AssetDatabase.Refresh();
                }
            }
            EditorGUILayout.Space();
            findFileTypeIndex = GUILayout.Toolbar(findFileTypeIndex, findFileTypeNames, GUILayout.Height(25));
            EditorGUILayout.Space();

            GUILayout.BeginHorizontal();

            if (hasFindPath)
            {
                findPath = GUILayout.TextArea(findPath, GUILayout.Height(25));
                GUI.backgroundColor = Color.green;
                if (GUILayout.Button("重设查找路径", GUILayout.Height(22), GUILayout.Width(100)))
                {
                    hasFindPath = false;
                }
                GUI.backgroundColor = Color.gray * 2f; // 恢复背景默认颜色
            }
            else//没有设置路径的情况
            {
                string str = AssetDatabase.GetAssetPath(Selection.activeObject);
                if (str != "")
                {
                    str = str.Substring(str.IndexOf("/"));
                    if (str.Contains("."))
                    {
                        str = str.Substring(0, str.LastIndexOf("/"));
                    }
                    str = GUILayout.TextArea(str, GUILayout.Height(25));
                }
                else
                {
                    str = GUILayout.TextArea("/AssetSources/ui", GUILayout.Height(25));
                }
                if (GUILayout.Button("设为查找路径", GUILayout.Height(22), GUILayout.Width(100)))
                {
                    hasFindPath = true;
                    findPath = str;
                }
            }
            GUILayout.EndHorizontal();
            EditorGUILayout.Space();
            if (GUILayout.Button("查找被哪些资源引用", GUILayout.Height(25)))
            {
                if (Selection.activeObject)
                {
                    goList.Clear();
                    Util.FindReferences(findFileTypes[findFileTypeIndex], goList);
                }
            }
            EditorGUILayout.Space();
            //显示结果
            Util.ResultShow(goList);
        }
    }
}

