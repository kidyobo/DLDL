using System.Collections.Generic;
using UnityEditor;
using UnityEngine;
namespace kingsly
{
    public class UIEditOperation : EditorWindow
    {
        [MenuItem("斗罗大陆/UI编辑操作")]
        static void myTools()
        {
            EditorWindow window = GetWindow(typeof(UIEditOperation));
            window.titleContent = new GUIContent("UI编辑操作");
            window.minSize = new Vector2(300, 300);
            window.Show();
        }
        private void OnDestroy()
        {
            //释放内存
            System.GC.Collect();
            Resources.UnloadUnusedAssets();
        }
        /**标记父物体,所有操作都是  操作该父物体的子物体*/
        GameObject parentGo;
        /**一级子物体列表*/
        List<GameObject> selectGoList = new List<GameObject>();

        /**这个UI操作需要完善*/
        List<string> childNamesList222 = new List<string>();
        int childNamesListIndex = 0;

        private void OnGUI()
        {
            GUILayout.BeginHorizontal();
            EditorGUILayout.ObjectField("当前标记父物体：", parentGo, typeof(GameObject), false, GUILayout.Height(20));
            if (parentGo)//有标记父物体
            {
                if (GUILayout.Button("重设"))
                {
                    parentGo = Selection.activeGameObject;
                    childNamesList222 = Util.GetAllChildGoNameList(parentGo);
                }
                GUILayout.EndHorizontal();
                EditorGUILayout.Space();
                if (GUILayout.Button("选中 所有一级 子物体", GUILayout.Height(25)))
                {
                    selectGoList = Util.GetFirstChildGoList(parentGo);
                    Selection.objects = selectGoList.ToArray();
                }
                EditorGUILayout.Space(); EditorGUILayout.Space();
                GUILayout.BeginHorizontal();
                GUILayout.Label("匹配名称：");
                childNamesListIndex = EditorGUILayout.Popup(childNamesListIndex, childNamesList222.ToArray());
                GUILayout.EndHorizontal();

                if (GUILayout.Button("选中 等于 匹配名称 子物体", GUILayout.Height(25)))
                {
                    selectGoList = Util.GetAllChildGoByName(parentGo,childNamesList222[childNamesListIndex], false, true);
                    Selection.objects = selectGoList.ToArray();
                }
                if (GUILayout.Button("选中 包含 匹配名称 子物体", GUILayout.Height(25)))
                {
                    selectGoList = Util.GetAllChildGoByName(parentGo,childNamesList222[childNamesListIndex], false, false);
                    Selection.objects = selectGoList.ToArray();
                }
                //if (GUILayout.Button("重命名", GUILayout.Height(25)))
                //{
                //    //soltGos(selectGoList.ToArray());
                //    rename(selectGoList.ToArray());
                //    childNamesList222 = getAllChildGoNameList();
                //}
                Util.FocusSceneHierarchyWindow();
            }
            else//没有标记父物体
            {
                GUILayout.EndHorizontal();
                EditorGUILayout.Space();
                GameObject selectGo = Selection.activeGameObject;
                if (selectGo)
                {
                    GUILayout.BeginHorizontal();
                    EditorGUILayout.ObjectField("当前选择物体：", selectGo, typeof(GameObject), false, GUILayout.Height(20));
                    if (GUILayout.Button("设为标记父物体"))
                    {
                        parentGo = selectGo;
                        childNamesList222 = Util.GetAllChildGoNameList(parentGo);
                    }
                    GUILayout.EndHorizontal();
                    EditorGUILayout.Space();
                }
                else
                {
                    GUILayout.TextArea("请选择一个场景中的物体为标记父物体!!!", GUILayout.Height(25));
                }
            }
        }
    }
}
