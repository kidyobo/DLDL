using System;
using System.Reflection;
using UnityEditor;
using UnityEngine;
namespace kingsly
{
    public class Tools
    {
        [MenuItem("Assets/添加到UIManager &z")]
        static void addToHierarchy()
        {
            GameObject uimanager = GameObject.Find("UiManager");
            if (!uimanager)
            {
                uimanager = Util.InstantiatePrefab(Util.GetObjectByPath(Util.UIManagerPrefabPath) as GameObject);
            }
            GameObject instantiateGo = Util.InstantiatePrefab(Selection.activeGameObject);
            Util.SetParent(instantiateGo, uimanager);
            Selection.activeGameObject = instantiateGo;
            Assembly editorAssembly = typeof(EditorWindow).Assembly;
            Type HierarchyWindowType = editorAssembly.GetType("UnityEditor.SceneHierarchyWindow");
            EditorWindow.GetWindow(HierarchyWindowType).Focus();
        }

        [MenuItem("Assets/添加到场景中 &x")]
        static void addToHierarchy1()
        {

            GameObject instantiateGo = Util.InstantiatePrefab(Selection.activeGameObject);
            Selection.activeGameObject = instantiateGo;
            Assembly editorAssembly = typeof(EditorWindow).Assembly;
            Type HierarchyWindowType = editorAssembly.GetType("UnityEditor.SceneHierarchyWindow");
            EditorWindow.GetWindow(HierarchyWindowType).Focus();
        }

        [MenuItem("GameObject/激活物体 &x", false, -100)]
        static void setActiveTrue()
        {
            GameObject[] selectGo = Selection.gameObjects;
            if (selectGo.Length > 0)
            {
                if (!selectGo[0].activeInHierarchy)
                {
                    selectGo[0].SetActive(true);
                }
                else
                {
                    selectGo[0].SetActive(false);
                }
            }
        }
    }
}

