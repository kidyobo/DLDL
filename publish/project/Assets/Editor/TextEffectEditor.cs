using UnityEngine;
using UnityEditor;
using System.IO;
using UnityEngine.UI;

public class TextEffectEditor : EditorWindow
{
    [MenuItem("UI整理/替换文本描边为SoftShadow")]
    static void DoIt()
    {
        EditorWindow.GetWindow(typeof(TextEffectEditor));
    }

    public static string prefabPath = Application.dataPath + @"/AssetSources/ui";

    Color effectColor = Color.black;
    float distanceX = 0;
    float distanceY = -0.8f;
    float blurSpread = 0.2f;
    bool onlyInitialCharacters = false;

    void OnGUI()
    {
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Effect Color", GUILayout.Width(100f));
        effectColor = EditorGUILayout.ColorField(effectColor, GUILayout.MinWidth(280f));
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Effect Distance", GUILayout.Width(100f));
        EditorGUILayout.LabelField("X", GUILayout.Width(20f));
        distanceX = EditorGUILayout.FloatField(distanceX, GUILayout.MinWidth(80f));
        EditorGUILayout.LabelField("Y", GUILayout.Width(20f));
        distanceY = EditorGUILayout.FloatField(distanceY, GUILayout.MinWidth(80f));
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Blur Spread", GUILayout.Width(100f));
        blurSpread = EditorGUILayout.FloatField(blurSpread, GUILayout.MinWidth(280f));
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.BeginHorizontal();
        onlyInitialCharacters = EditorGUILayout.Toggle("Only Initial Characters", onlyInitialCharacters);
        EditorGUILayout.EndHorizontal();
        if (GUILayout.Button("修改"))
        {
            if(!onlyInitialCharacters || EditorUtility.DisplayDialog("注意", "勾选 Only Initial Charaters 可能会导致UI报错，是否继续？", "继续", "取消"))
                ReplaceTextStroke();
        }
    }

    public void ReplaceTextStroke()
    {
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
                    bool hasActiveOutline = false;
                    Outline[] ols = t.GetComponents<Outline>();
                    for (int k = ols.Length - 1; k >= 0; k--)
                    {
                        Outline ol = ols[k];
                        if (ol.enabled)
                        {
                            hasActiveOutline = true;
                        }
                        DestroyImmediate(ol, true);
                    }
                    Shadow[] sds = t.GetComponents<Shadow>();
                    for (int k = sds.Length - 1; k >= 0; k--)
                    {
                        Shadow sd = sds[k];
                        if (sd.enabled)
                        {
                            hasActiveOutline = true;
                        }
                        DestroyImmediate(sd, true);
                    }
                    if (hasActiveOutline)
                    {
                        Debug.Log(t.name);
                        SoftShadow[] sss = t.GetComponents<SoftShadow>();
                        SoftShadow theSS;
                        if (sss.Length > 0)
                        {
                            theSS = sss[0];
                            if (!theSS.enabled)
                            {
                                theSS.enabled = true;
                            }
                        }
                        else
                        {
                            theSS = t.gameObject.AddComponent<SoftShadow>();
                        }
                        theSS.effectColor = effectColor;
                        theSS.effectDistance = new Vector2(distanceX, distanceY);
                        theSS.blurSpread = blurSpread;
                        theSS.onlyInitialCharactersDropShadow = onlyInitialCharacters;
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
            EditorUtility.DisplayProgressBar("Hold on", "正在保存" + changedCount + "个更改", 1);
            AssetDatabase.SaveAssets();
        }        
        EditorUtility.ClearProgressBar();
    }
}