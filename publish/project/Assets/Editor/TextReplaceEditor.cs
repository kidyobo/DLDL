using UnityEngine;
using UnityEditor;
using System.IO;
using UnityEngine.UI;
using System.Text.RegularExpressions;

public class TextReplaceEditor : EditorWindow
{
    [MenuItem("UI整理/文字替换")]
    static void DoIt()
    {
        EditorWindow.GetWindow(typeof(TextReplaceEditor));
    }

    protected static string prefabPath = Application.dataPath + @"/AssetSources/ui";
    protected static Regex hzPatt = new Regex(@"[\u4e00-\u9fa5]+");

    string originalText;
    string newText;

    void OnGUI()
    {
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("原文字", GUILayout.Width(100f));
        originalText = EditorGUILayout.TextField(originalText, GUILayout.MinWidth(280f));
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("新文字", GUILayout.Width(100f));
        newText = EditorGUILayout.TextField(newText, GUILayout.MinWidth(280f));
        EditorGUILayout.EndHorizontal();
        if (GUILayout.Button("替换"))
        {
            ReplaceText();
        }
    }

    public void ReplaceText()
    {
        if(string.IsNullOrEmpty(originalText))
        {
            Debug.LogError("需指定原文字");
            return;
        }
        if (string.IsNullOrEmpty(newText))
        {
            Debug.LogError("需指定新文字");
            return;
        }
        if(originalText.Equals(newText))
        {
            return;
        }

        string[] files = Directory.GetFiles(prefabPath, "*.prefab", SearchOption.AllDirectories);
        int changedCount = 0;
        for (int i = 0, len = files.Length; i < len; i++)
        {
            string f = files[i];
            EditorUtility.DisplayProgressBar("Hold on", f, (float)(i + 1) / len);
            
            bool changed = false;
            string sf = f.Substring(f.IndexOf("Assets"));
            GameObject prefab = AssetDatabase.LoadAssetAtPath(sf, typeof(GameObject)) as GameObject;
            Text[] texts = prefab.GetComponentsInChildren<Text>(false);
            if(texts.Length > 0)
            {
                foreach (Text t in texts)
                {
                    string nt = t.text.Replace(originalText, newText);
                    if (!nt.Equals(t.text))
                    {
                        t.text = nt;
                        changed = true;
                    }
                }
            }
            if(changed)
            {
                changedCount++;
                EditorUtility.SetDirty(prefab);
            }
        }
        if (changedCount > 0)
        {
            EditorUtility.DisplayProgressBar("Hold on", "正在保存" + changedCount + "个更改的文件", 1);
            AssetDatabase.SaveAssets();
        }        
        EditorUtility.ClearProgressBar();
        Debug.Log("修改了" + changedCount + "个文件");
    }
}