using UnityEngine;
using UnityEditor;
using System;
public class FFEffectShaderAddtive : ShaderGUI
{
    public override void OnGUI(MaterialEditor materialEditor, MaterialProperty[] properties)
    {
        // render the default gui
        base.OnGUI(materialEditor, properties);

        Material targetMat = materialEditor.target as Material;
        var _MASK_ON = Array.IndexOf(targetMat.shaderKeywords, "_MASK_ON") != -1;
        var _CUTMASK_ON = Array.IndexOf(targetMat.shaderKeywords, "_CUTMASK_ON") != -1;
		var _FLIP_CUTMASK_ON = Array.IndexOf(targetMat.shaderKeywords, "_FLIP_CUTMASK_ON") != -1;
        var _FLOW_ON = Array.IndexOf(targetMat.shaderKeywords, "_FLOW_ON") != -1;

        EditorGUI.BeginChangeCheck();
        _MASK_ON = EditorGUILayout.Toggle("叠加遮罩", _MASK_ON);
        _CUTMASK_ON = EditorGUILayout.Toggle("裁剪遮罩", _CUTMASK_ON);
		_FLIP_CUTMASK_ON = EditorGUILayout.Toggle("裁剪遮罩翻转", _FLIP_CUTMASK_ON);
        _FLOW_ON = EditorGUILayout.Toggle("流动", _FLOW_ON);
        if (EditorGUI.EndChangeCheck())
        {
            if (_MASK_ON)
                targetMat.EnableKeyword("_MASK_ON");
            else
                targetMat.DisableKeyword("_MASK_ON");

            if (_CUTMASK_ON)
                targetMat.EnableKeyword("_CUTMASK_ON");
            else
                targetMat.DisableKeyword("_CUTMASK_ON");

			if (_FLIP_CUTMASK_ON)
				targetMat.EnableKeyword("_FLIP_CUTMASK_ON");
			else
				targetMat.DisableKeyword("_FLIP_CUTMASK_ON");

            if (_FLOW_ON)
                targetMat.EnableKeyword("_FLOW_ON");
            else
                targetMat.DisableKeyword("_FLOW_ON");
        }
    }
}