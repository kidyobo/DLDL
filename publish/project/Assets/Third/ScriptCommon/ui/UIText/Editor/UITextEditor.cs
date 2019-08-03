using UnityEngine;
using UnityEditor;
[CustomEditor(typeof(UIText), true)]
public class UITextEditor : UnityEditor.UI.TextEditor
{
    UIText t;
    protected override void OnEnable()
    {
        base.OnEnable();
        t = target as UIText;
    }
    public override void OnInspectorGUI()
    {
        GUI.changed = false;
        GUILayout.Space(6f);
        GUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("altas:", GUILayout.Width(50f));
        UITextAltas value = (UITextAltas)EditorGUILayout.ObjectField(t.altas, typeof(UITextAltas), true, GUILayout.Width(150f));
        GUILayout.EndHorizontal();

        if (GUI.changed)
        {
            t.altas = value;
            UnityEditor.EditorUtility.SetDirty(this);
        }
        if (t.needRebuildTexture)
        {
            t.SendMessage("LateProcess");
            t.SetAllDirty();
        }
        base.OnInspectorGUI();
    }
}