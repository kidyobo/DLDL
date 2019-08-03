using UnityEngine;
using UnityEditor;
using System;
public class ModelStandardShaderGUI : ShaderGUI
{
    public override void OnGUI(MaterialEditor materialEditor, MaterialProperty[] properties)
    {
        // render the default gui
        base.OnGUI(materialEditor, properties);

        Material targetMat = materialEditor.target as Material;

        var dirLight= Array.IndexOf(targetMat.shaderKeywords, "_LIGHT_ON") != -1;
        var clip = Array.IndexOf(targetMat.shaderKeywords, "_CLIPALPHA") != -1;
        var rim = Array.IndexOf(targetMat.shaderKeywords, "_RIM_ON") != -1;
        var uvEffect = Array.IndexOf(targetMat.shaderKeywords, "_NOISE_ON") != -1;

        EditorGUI.BeginChangeCheck();
        dirLight = EditorGUILayout.Toggle("环绕光", dirLight);
        clip = EditorGUILayout.Toggle("透明裁切", clip);
        rim = EditorGUILayout.Toggle("环绕颜色", rim);
        uvEffect = EditorGUILayout.Toggle("UV特效", uvEffect);
        if (EditorGUI.EndChangeCheck())
        {
            if (dirLight)
                targetMat.EnableKeyword("_LIGHT_ON");
            else
                targetMat.DisableKeyword("_LIGHT_ON");

            if (clip)
                targetMat.EnableKeyword("_CLIPALPHA");
            else
                targetMat.DisableKeyword("_CLIPALPHA");

            if (rim)
                targetMat.EnableKeyword("_RIM_ON");
            else
                targetMat.DisableKeyword("_RIM_ON");

            if (uvEffect)
                targetMat.EnableKeyword("_NOISE_ON");
            else
                targetMat.DisableKeyword("_NOISE_ON");
        }
        if (GUILayout.Button("应用溶解设置到所有怪物材质球"))
        {
            var targetMat_DissolveMap = targetMat.GetTexture("_DissolveMap");
            var targetMat_ColorFactor = targetMat.GetFloat("_ColorFactor");
            var targetMat_DissolveEdge = targetMat.GetFloat("_DissolveEdge");
            var targetMat_DissolveColor = targetMat.GetColor("_DissolveColor");
            var targetMat_DissolveEdgeColor = targetMat.GetColor("_DissolveEdgeColor");

            var allFiles = AssetDatabase.FindAssets("t:Material", new string[] { "Assets/AssetSources/model/monster", "Assets/AssetSources/model/boss" });
            var index = 0;
            var count = allFiles.Length;
            foreach (var file in allFiles)
            {
                bool change = false;
                index++;
                EditorUtility.DisplayProgressBar("修改材质球", string.Format("正在生成第{0}/{1}个文件", index, count), index / (float)count);
                var path = AssetDatabase.GUIDToAssetPath(file);
                var mat = AssetDatabase.LoadAssetAtPath<Material>(path);
                if (mat.shader != null && mat.shader.name == "Game/ModelStandard" || mat.shader.name == "Game/ModelStandard(透明渲染)")
                {
                    var _DissolveMap = mat.GetTexture("_DissolveMap");
                    var _ColorFactor = mat.GetFloat("_ColorFactor");
                    var _DissolveEdge = mat.GetFloat("_DissolveEdge");
                    var _DissolveColor = mat.GetColor("_DissolveColor");
                    var _DissolveEdgeColor = mat.GetColor("_DissolveEdgeColor");
                    if (targetMat_DissolveMap != _DissolveMap)
                    {
                        mat.SetTexture("_DissolveMap", targetMat_DissolveMap);
                        change = true;
                    }
                    if (targetMat_ColorFactor != _ColorFactor)
                    {
                        mat.SetFloat("_ColorFactor", targetMat_ColorFactor);
                        change = true;
                    }
                    if (targetMat_DissolveEdge != _DissolveEdge)
                    {
                        mat.SetFloat("_DissolveEdge", targetMat_DissolveEdge);
                        change = true;
                    }
                    if (targetMat_DissolveColor != _DissolveColor)
                    {
                        mat.SetColor("_DissolveColor", targetMat_DissolveColor);
                        change = true;
                    }
                    if (targetMat_DissolveEdgeColor != _DissolveEdgeColor)
                    {
                        mat.SetColor("_DissolveEdgeColor", targetMat_DissolveEdgeColor);
                        change = true;
                    }
                    if (change)
                    {
                        EditorUtility.SetDirty(mat);
                    }
                }
            }
            EditorUtility.ClearProgressBar();
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh(ImportAssetOptions.Default);
        }
    }
}