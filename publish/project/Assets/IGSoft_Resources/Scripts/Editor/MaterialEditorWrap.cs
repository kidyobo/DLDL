using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections;
using System.Collections.Generic;

public class MaterialEditorWrap : MaterialEditor
{

    string[] emptyNames = new string[] { };
    protected void DrawDefaultGUI()
    {
        DrawDefaultGUI(emptyNames);
    }

    protected void DrawDefaultGUI(string[] argHiddenNames)
    {
        serializedObject.Update();
        var theShader = serializedObject.FindProperty("m_Shader");
        if (isVisible && !theShader.hasMultipleDifferentValues && theShader.objectReferenceValue != null)
        {
            EditorGUIUtility.labelWidth = Screen.width - 120;
            EditorGUIUtility.fieldWidth = 80;


            EditorGUI.BeginChangeCheck();
            Shader shader = theShader.objectReferenceValue as Shader;

            for (int i = 0; i < ShaderUtil.GetPropertyCount(shader); i++)
            {
                ShaderPropertyImpl(shader, i, argHiddenNames);
            }

            if (EditorGUI.EndChangeCheck())
                PropertiesChanged();
        }
    }

    void ShaderPropertyImpl(Shader shader, int propertyIndex, string[] argHiddenNames)
    {

        int i = propertyIndex;
        string label = ShaderUtil.GetPropertyDescription(shader, i);
        string propertyName = ShaderUtil.GetPropertyName(shader, i);

        if (((IList)argHiddenNames).Contains(propertyName)) return;
        Material mat = target as Material;
        MaterialProperty p = GetMaterialProperty(new Object[] { mat }, propertyName);
        switch (ShaderUtil.GetPropertyType(shader, i))
        {
            case ShaderUtil.ShaderPropertyType.Range: // float ranges
                {
                    GUILayout.BeginHorizontal();
                    RangeProperty(p, label);
                    GUILayout.EndHorizontal();

                    break;
                }
            case ShaderUtil.ShaderPropertyType.Float: // floats
                {
                    FloatProperty(p, label);
                    break;
                }
            case ShaderUtil.ShaderPropertyType.Color: // colors
                {
                    ColorProperty(p, label);
                    break;
                }
            case ShaderUtil.ShaderPropertyType.TexEnv: // textures
                {
                    GUILayout.Space(8);
                    TextureProperty(p, label);
                    GUILayout.Space(8);
                    break;
                }
            case ShaderUtil.ShaderPropertyType.Vector: // vectors
                {
                    VectorProperty(p, label);
                    break;
                }
            default:
                {
                    GUILayout.Label("ARGH" + label + " : " + ShaderUtil.GetPropertyType(shader, i));
                    break;
                }
        }
    }
}