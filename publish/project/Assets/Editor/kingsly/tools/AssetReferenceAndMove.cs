using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

namespace kingsly
{
    /// <summary>
    /// 引用了哪些资源 和 移动这些资源到指定路径
    /// </summary>
    public class AssetReferenceAndMove: EditorWindow
    {
        [MenuItem("斗罗大陆/引用和移动")]
        static void MyTools()
        {
            EditorWindow window = GetWindow(typeof(AssetReferenceAndMove));
            window.titleContent = new GUIContent("引用和移动");
            window.minSize = new Vector2(300, 300);
            window.Show();
        }

        private void OnDestroy()
        {
            //释放内存
            System.GC.Collect();
            Resources.UnloadUnusedAssets();
        }

        readonly string[] funcTypeName ={ "查找引用","启用移动" };
        int funcTtpeIndex = 0;
        static Object findReferenceObject;
        static string[] dependPaths;

        /*移动路径**/
        string moveToPath = "";
        bool hasmoveToPath = false;
        bool showMoveBtn = false;

        [MenuItem("Assets/设为查找引用对象")]
        static void SetFindReferenceObject()
        {
            dependPaths = null;
            findReferenceObject = Selection.objects[0];
        }
        private void OnGUI()
        {
            EditorGUILayout.Space();
            //EditorGUILayout.ObjectField("当前选中文件：", Selection.activeObject ? Selection.activeObject : null, typeof(Object), false);
            findReferenceObject = EditorGUILayout.ObjectField("查找引用对象：", findReferenceObject, typeof(Object), false);
            if (findReferenceObject != null)
            {
                EditorGUILayout.Space();
                funcTtpeIndex = GUILayout.Toolbar(funcTtpeIndex, funcTypeName,GUILayout.Height(25));
                switch (funcTtpeIndex)
                {
                    case 0:
                        showMoveBtn=false;
                        break;
                    case 1:
                        EditorGUILayout.Space();
                        GUILayout.BeginHorizontal();
                        showMoveBtn = true;
                        if (hasmoveToPath)
                        {
                            moveToPath = GUILayout.TextArea(moveToPath, GUILayout.Height(25));
                            GUI.backgroundColor = Color.green;
                            if (GUILayout.Button("重设移动路径", GUILayout.Height(22), GUILayout.Width(100)))
                            {
                                hasmoveToPath = false;
                                moveToPath = "";
                            }
                            GUI.backgroundColor = Color.gray * 2f; // 恢复背景默认颜色
                        }
                        else//没有设置路径的情况
                        {
                            string str = AssetDatabase.GetAssetPath(Selection.activeObject);
                            if (str != "")
                            {
                                //str = str.Substring(str.IndexOf("/"));
                                if (str.Contains("."))
                                {
                                    str = str.Substring(0, str.LastIndexOf("/"));
                                }
                                str = GUILayout.TextArea(str, GUILayout.Height(25));
                            }
                            else
                            {
                                str = GUILayout.TextArea("", GUILayout.Height(25));
                            }
                            if (GUILayout.Button("设为移动路径", GUILayout.Height(22), GUILayout.Width(100)))
                            {
                                hasmoveToPath = true;
                                moveToPath = str;
                            }
                        }
                        GUILayout.EndHorizontal();
                        break;

                }
                EditorGUILayout.Space();
                if (GUILayout.Button("查找引用了哪些资源", GUILayout.Height(25)))
                {
                    string strPath = AssetDatabase.GetAssetPath(findReferenceObject);
                    string[] depend = AssetDatabase.GetDependencies(strPath);

                    dependPaths = depend;
                    Debug.Log("引用对象路径：" + strPath);
                }
                EditorGUILayout.Space();
                if (dependPaths != null && dependPaths.Length > 0)
                {
                    Util.AssetReferenceResultShow(dependPaths, moveToPath,showMoveBtn);
                }
             
            }
        }
    }
}

