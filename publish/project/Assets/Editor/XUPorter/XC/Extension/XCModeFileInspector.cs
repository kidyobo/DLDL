using UnityEngine;
using System.Collections;

namespace UnityEditor.XCodeEditor
{
    [CustomEditor(typeof(Object)), CanEditMultipleObjects]
    public class ModsInspector : Editor
    {
        bool isprojmodsbackup = false;
        bool isprojmods = false;
        XCModFileData data;

        void OnEnable()
        {
            string path = AssetDatabase.GetAssetPath(target);
            if (path.EndsWith(".projmods"))
            {
                isprojmods = true;
            }
            if (path.EndsWith(".projmods.backup"))
            {
                isprojmodsbackup = true;
            }
        }
        public override void OnInspectorGUI()
        {
            base.OnInspectorGUI();
            if (isprojmodsbackup)
            {
                GUI.enabled = true;
                if (GUILayout.Button("还原projmods"))
                {
                    string path =AssetDatabase.GetAssetPath(target);
                    AssetDatabase.MoveAsset(path, path.Replace(".backup", ""));
                    AssetDatabase.Refresh();
                    isprojmodsbackup = false;
                    OnEnable();
                    return;
                }
            }

            if (isprojmods)
            {
                if (data == null)
                {
                    data = XCModFileData.Load(AssetDatabase.GetAssetPath(target));
                }
                GUI.enabled = true;

                if (GUILayout.Button("Backup"))
                {
                    string path = AssetDatabase.GetAssetPath(target);
                    AssetDatabase.MoveAsset(path, path + ".backup");
                    data = null;
                    AssetDatabase.Refresh();
                    isprojmods = false;
                    OnEnable();
                    return;
                }

                data.group = EditorGUILayout.TextField("Group", data.group);

                DrawArrayList("Libs:", data.libs);
                DrawArrayList("Frameworks:", data.frameworks);
                DrawArrayList("Header paths:", data.headerpaths);
                DrawArrayList("Files:", data.files);
                DrawArrayList("Folders:", data.folders);
                DrawArrayList("Linker flags:", data.linker_flags);
                DrawArrayList("Excludes:", data.excludes);

                if (GUILayout.Button("Save"))
                {
                    data.Save();
                }
                if (GUILayout.Button("Refresh"))
                {
                    data = null;
                    AssetDatabase.Refresh();
                    return;
                }
            }
        }



        void DrawArrayList(string name,ArrayList list)
        {
            EditorGUILayout.BeginVertical("Box");
            EditorGUILayout.LabelField(name);
            for (int i = 0; i < list.Count; i++)
            {
                EditorGUI.indentLevel++;
                EditorGUILayout.BeginHorizontal();
                if (GUILayout.Button("-", GUILayout.Width(20f)))
                {
                    list.RemoveAt(i);
                    return;
                }
                list[i] = EditorGUILayout.TextField(list[i] as string);
                EditorGUILayout.EndVertical();
                EditorGUI.indentLevel--;
            }
            if (GUILayout.Button("+", GUILayout.Width(20f)))
            {
                list.Add("");
            }
            EditorGUILayout.EndVertical();
        }
    }
}