using UnityEngine;
using UnityEditor;
using UnityEngine.UI;

public class ChangeFontWindow : EditorWindow
{
    [MenuItem("UI整理/更换字体")]
    public static void Open()
    {
        EditorWindow.GetWindow(typeof(ChangeFontWindow));
    }

    Font toChange;
    static Font toChangeFont;
    FontStyle toFontStyle;
    static FontStyle toChangeFontStyle;
    //int toFontSize = 22;
    //static int toChangeFontSize = 22;

    void OnGUI()
    {
        toChange = (Font)EditorGUILayout.ObjectField(toChange, typeof(Font), true, GUILayout.MinWidth(100f));
        toChangeFont = toChange;
        toFontStyle = (FontStyle)EditorGUILayout.EnumPopup(toFontStyle, GUILayout.MinWidth(100f));
        toChangeFontStyle = toFontStyle;
        //toFontSize = (int)EditorGUILayout.IntField(toFontSize, GUILayout.MinWidth(100f));
        //toChangeFontSize = toFontSize;
        if (GUILayout.Button("更换"))
        {
            Change();
        }
    }

    public static void Change()
    {
        var changeCount = 0;
        var selectObjs = Selection.gameObjects;
        for (int i = 0; i < selectObjs.Length; i++)
        {
            var obj = selectObjs[i];
            var arrayText = obj.GetComponentsInChildren<Text>(true);
            for (int j = 0; j < arrayText.Length; j++)
            {
                var t = arrayText[j];
                if (t)
                {
                    Undo.RecordObject(t, t.gameObject.name);
                    t.font = toChangeFont;
                    t.fontStyle = toChangeFontStyle;
                    //t.fontSize = toChangeFontSize;
                    EditorUtility.SetDirty(t);
                    changeCount++;
                }
            }
        }
        Debug.Log("Succed: " + changeCount);
    }
}
