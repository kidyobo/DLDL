using UnityEngine;
using UnityEditor;
using System;
public class EffectShaderGUI : ShaderGUI
{
    public override void OnGUI(MaterialEditor materialEditor, MaterialProperty[] properties)
    {
        // render the default gui
        base.OnGUI(materialEditor, properties);

        Material targetMat = materialEditor.target as Material;

        var MASK_ON = Array.IndexOf(targetMat.shaderKeywords, "MASK_ON") != -1;
        var _SEPARATEALPHA_ON = Array.IndexOf(targetMat.shaderKeywords, "_SEPARATEALPHA_ON") != -1;
        var _SCALE_ON = Array.IndexOf(targetMat.shaderKeywords, "_SCALE_ON") != -1;
        var _FLOW_ON = Array.IndexOf(targetMat.shaderKeywords, "_FLOW_ON") != -1;

        EditorGUI.BeginChangeCheck();
        MASK_ON = EditorGUILayout.Toggle("遮罩", MASK_ON);
        _SEPARATEALPHA_ON = EditorGUILayout.Toggle("分离透明通道", _SEPARATEALPHA_ON);
        _SCALE_ON = EditorGUILayout.Toggle("缩放", _SCALE_ON);
        _FLOW_ON = EditorGUILayout.Toggle("流动", _FLOW_ON);
        if (EditorGUI.EndChangeCheck())
        {
            if (MASK_ON)
                targetMat.EnableKeyword("MASK_ON");
            else
                targetMat.DisableKeyword("MASK_ON");

            if (_SEPARATEALPHA_ON)
                targetMat.EnableKeyword("_SEPARATEALPHA_ON");
            else
                targetMat.DisableKeyword("_SEPARATEALPHA_ON");

            if (_SCALE_ON)
                targetMat.EnableKeyword("_SCALE_ON");
            else
                targetMat.DisableKeyword("_SCALE_ON");

            if (_FLOW_ON)
                targetMat.EnableKeyword("_FLOW_ON");
            else
                targetMat.DisableKeyword("_FLOW_ON");
        }
    }
}