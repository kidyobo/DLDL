using UnityEngine;
using UnityEngine.Rendering;
using System.Collections;
using System.Collections.Generic;
using UnityEditor;
	
public class ParticleTransparentMaterialEditor : MaterialEditorWrap
{

	static Dictionary<string,int[]> blendModelDict = new Dictionary<string, int[]>
	{
		{"Blend",new int[]{(int)BlendMode.SrcAlpha,(int)BlendMode.OneMinusSrcAlpha}},
		{"Add",new int[]{(int)BlendMode.SrcAlpha,(int)BlendMode.One}},
		{"Multiply",new int[]{(int)BlendMode.Zero,(int)BlendMode.SrcColor}},
		{"MultiplyAdd",new int[]{(int)BlendMode.One,(int)BlendMode.OneMinusSrcAlpha}},
	};
	List<string> hiddenNames = new List<string> ();

	public override void OnInspectorGUI ()
	{
		if (!isVisible) return;

		Material targetMat = target as Material;

		EditorGUI.BeginChangeCheck ();

		GUILayout.BeginHorizontal ();

		foreach(string key in blendModelDict.Keys)
		{
			if(GUILayout.Button(key))
			{
				targetMat.SetInt("_SrcFactor",blendModelDict[key][0]);
				targetMat.SetInt("_DstFactor",blendModelDict[key][1]);
			}
		}
		GUILayout.EndHorizontal ();


		int srcIndex = System.Convert.ToInt32( EditorGUILayout.EnumPopup ("SrcFactor",(BlendMode)targetMat.GetInt ("_SrcFactor")));
		int dstIndex = System.Convert.ToInt32( EditorGUILayout.EnumPopup ("DstFactor",(BlendMode)targetMat.GetInt ("_DstFactor")));

		int zTestMode = System.Convert.ToInt32( EditorGUILayout.EnumPopup ("ZTest",(CompareFunction)targetMat.GetInt ("_ZTestMode")));
		int cullMode = System.Convert.ToInt32( EditorGUILayout.EnumPopup ("Cull",(CullMode)targetMat.GetInt ("_CullMode")));

		bool zWriteEnabled = EditorGUILayout.Toggle ("ZWrite",targetMat.GetInt ("_ZWrite") == 1);


		string[] keyWords = targetMat.shaderKeywords;

		bool dissolveEnabled = ((IList)keyWords).Contains("Dissolve_On");
		dissolveEnabled = EditorGUILayout.Toggle ("Dissolve",dissolveEnabled);

		bool sphereEnabled = ((IList)keyWords).Contains("Sphere_On");
		sphereEnabled = EditorGUILayout.Toggle ("Sphere",sphereEnabled);

		bool distortionEnabled = ((IList)keyWords).Contains("Distortion_On");
		distortionEnabled = EditorGUILayout.Toggle ("扭曲",distortionEnabled);

		bool vertexColorEnabled = ((IList)keyWords).Contains("VertexColor_Off");
		vertexColorEnabled = EditorGUILayout.Toggle ("关闭顶点色(多用于非粒子)",vertexColorEnabled);



		int renderQueue = targetMat.renderQueue;
		renderQueue = EditorGUILayout.IntField ("RenderQueue", renderQueue);

		if (EditorGUI.EndChangeCheck())
		{
			targetMat.renderQueue = renderQueue;
			targetMat.SetInt("_SrcFactor",srcIndex);
			targetMat.SetInt("_DstFactor",dstIndex);
			targetMat.SetInt("_CullMode",cullMode);
			targetMat.SetInt("_ZTestMode",zTestMode);
			targetMat.SetInt("_ZWrite",zWriteEnabled ? 1 : 0);


			List<string> keywords = new List<string> { 
				dissolveEnabled ? "Dissolve_On" : "Dissolve_Off",
				sphereEnabled ? "Sphere_On" : "Sphere_Off",
				distortionEnabled ? "Distortion_On" : "Distortion_Off",
				vertexColorEnabled ? "VertexColor_Off" : "VertexColor_On"
			};
			targetMat.shaderKeywords = keywords.ToArray ();

			EditorUtility.SetDirty (targetMat);
		}
		hiddenNames.Clear();

		//base.OnInspectorGUI ();

		hiddenNames.Add("_SrcFactor");
		hiddenNames.Add("_DstFactor");
		hiddenNames.Add("_CullMode");
		hiddenNames.Add("_ZTestMode");
		hiddenNames.Add ("_ZWrite");

		if(((IList)targetMat.shaderKeywords).Contains("Dissolve_Off"))
		{
			hiddenNames.Add("_DissolveTexture");
			hiddenNames.Add("_Dissolve");
			hiddenNames.Add("_DissolveBlend");
		}

		if(((IList)targetMat.shaderKeywords).Contains("Sphere_Off"))
		{
			hiddenNames.Add("_SphereTex");
			hiddenNames.Add("_SphereMaskTex");
		}

		if(((IList)targetMat.shaderKeywords).Contains("Distortion_Off"))
		{
			hiddenNames.Add("_DistortionArgs");
			hiddenNames.Add("_DistortionTexture");
		}

		DrawDefaultGUI(hiddenNames.ToArray());
	}
}