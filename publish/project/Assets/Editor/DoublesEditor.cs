using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
[CanEditMultipleObjects]
[CustomEditor(typeof(DoubleDefineList), true)]
public class DoublesEditor : Editor
{
    public override void OnInspectorGUI()
    {
        GUILayout.Space(6f);
        this.DrawCommonProperties();
    }

    protected void DrawCommonProperties()
    {
        DoubleDefineList uguiAltas = target as DoubleDefineList;

        GUI.changed = false;

        for (int i = 0; i < uguiAltas.Names.Count; i++)
        {
            GUILayout.BeginHorizontal();
            if (GUILayout.Button("-", GUILayout.Width(50f)))
            {
                uguiAltas.Names.RemoveAt(i);
                uguiAltas.Values.RemoveAt(i);
                break;
            }
            EditorGUILayout.LabelField("名称", GUILayout.Width(30));
            string key = EditorGUILayout.TextField(uguiAltas.Names[i], GUILayout.Width(120f));
            EditorGUILayout.LabelField("值", GUILayout.Width(15));
            double value = EditorGUILayout.DoubleField(uguiAltas.Values[i]);
            GUILayout.EndHorizontal();

            if (GUI.changed)
            {
                uguiAltas.Names[i] = key;
                uguiAltas.Values[i] = value;
                break;
            }
        }
        GUILayout.BeginHorizontal();
        if (GUILayout.Button("+"))
        {
            uguiAltas.Names.Add("");
            uguiAltas.Values.Add(0);
            GUI.changed = true;
        }

        GUILayout.EndHorizontal();
        if (GUI.changed)
        {
            EditorUtility.SetDirty(uguiAltas);
            EditorUtility.SetDirty(uguiAltas.gameObject);
        }
    }
}