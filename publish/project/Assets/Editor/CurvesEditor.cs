using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
[CanEditMultipleObjects]
[CustomEditor(typeof(AnimationCurveList), true)]
public class CurvesEditor : Editor
{
    public override void OnInspectorGUI()
    {
        GUILayout.Space(6f);
        this.DrawCommonProperties();
    }

    protected void DrawCommonProperties()
    {
        AnimationCurveList uguiAltas = target as AnimationCurveList;

        GUI.changed = false;
        for (int i = 0; i < uguiAltas.Names.Count; i++)
        {
            GUILayout.BeginHorizontal();
            if (GUILayout.Button("-", GUILayout.Width(50f)))
            {
                uguiAltas.Names.RemoveAt(i);
                uguiAltas.Curves.RemoveAt(i);
                break;
            }
            EditorGUILayout.LabelField("名称", GUILayout.Width(30));
            string key = EditorGUILayout.TextField(uguiAltas.Names[i], GUILayout.Width(120f));
            EditorGUILayout.LabelField("曲线", GUILayout.Width(30));
            AnimationCurve value = EditorGUILayout.CurveField(uguiAltas.Curves[i]);
            GUILayout.EndHorizontal();

            if (GUI.changed)
            {
                uguiAltas.Names[i] = key;
                uguiAltas.Curves[i] = value;
                break;
            }
        }
        GUILayout.BeginHorizontal();
        if (GUILayout.Button("+"))
        {
            uguiAltas.Names.Add("");
            uguiAltas.Curves.Add(new AnimationCurve());
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