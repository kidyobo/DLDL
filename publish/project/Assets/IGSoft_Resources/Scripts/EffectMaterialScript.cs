
// by artsyli
// 2014.4.22

#if UNITY_EDITOR 
using UnityEditor;
#endif
using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

using System.Xml;
using System.IO;

public class EffectMaterialScript : MonoBehaviour 
{
	public enum BlendMode
	{
		AlphaBlend,
		Additive
	}

	public enum LayerMode
	{
		Front,
		Middle,
		Back,
		UI
	}

	public enum SeqType
	{
		TimeSequence,
		TimeRandom,
		FixedFrame
	}

	private const float EPSILON = 0.00001f;
	
	public Shader AlphaBlendShader; // Shader.Find("Effect_Mid/Alpha Blend")
	public Shader AdditiveShader;   // Shader.Find("Effect_Mid/Additive")

	// DO NOT USE 'private' !!!
	public Material material = null;

	public BlendMode blend = BlendMode.AlphaBlend;
	public LayerMode layer = LayerMode.Middle;
	public SeqType seqType = SeqType.TimeSequence;

	public bool savematfile = true;

	public Color color = Color.white;
	public float brightness = 1.0f;
	public Texture mainTex = null;
	public float uoffset = 0.0f;
	public float voffset = 0.0f;
	public float uscale = 1.0f;
	public float vscale = 1.0f;
	public float uvrotate = 0.0f;

	public Texture maskTex = null;
	public float maskuoffset = 0.0f;
	public float maskvoffset = 0.0f;
	public float maskuscale = 1.0f;
	public float maskvscale = 1.0f;
	public float maskuvrotate = 0.0f;

	/// <summary>add flow texture
	public Texture flowTex = null;
	public float flowuspeed = 0.0f;
	public float flowvspeed = 0.0f;
	public float flowDelayTime = 0.0f;
	public float flowStopTime = 999f;
	public float flowOffset = -0.5f;
	public float flowRotate = 0;
	public float flowStrengthValue = 0.1f;
	
	public AnimationCurve flowStrengthCurve = new AnimationCurve();
	private float flowElapsedTime;
	private float flowStartTimeAbs;
	private float flowStopTimeAbs;
	private float flowElapsedRate;
	private float flowuoffset = 0;
	private float flowvoffset = 0;
	private float flowStrength = 0.0f;
	private Vector4 flowParam;
	/// </summary>

	public int tileCol = 1;
	public int tileRow = 1;
	public float seqValue = 0.0f;

	public float delay = 0.0f;
	public bool once = false;

	private bool bDelayStart = false;
	private bool bDelayEnd = false;
	private float begintime = 0.0f;

	private float startTime;
	private int tile;

	private bool bUvAnimEnd = false;
	private bool m_bUVInitialized = false;

	private bool m_isInFxMaker = false;

	private bool m_bUseUVTile = true;
	private bool m_bUseUVFlow = true;
#if UNITY_EDITOR
	static private string FXMaterialPath = "Assets/Resources/AutoMaterial/"; 
#endif
    private bool isPause = false;
    
	private string EncodePropertyLess()
	{
		int texsize = 512;
		int size = texsize * 2 + 1;
		byte[] data = new byte[size];
		for(int i = 0; i < size; i++)
			data[i] = 0;

		if(mainTex != null)
		{
			System.Text.Encoding.UTF8.GetBytes(mainTex.name).CopyTo(data, 0);
		}
		if(maskTex != null)
		{
			System.Text.Encoding.UTF8.GetBytes(maskTex.name).CopyTo(data, 256);
		}

		if (flowTex != null)
		{
			System.Text.Encoding.UTF8.GetBytes(flowTex.name).CopyTo(data, 512);
		}
		
		string keyWords = "";
		keyWords += maskTex != null ? "MASK_ON" : "MASK_OFF";
		keyWords += flowTex != null ? "_FLOW_ON" : "_FLOW_OFF";
		
		System.Text.Encoding.UTF8.GetBytes(keyWords).CopyTo(data, 768);

		data[512] = (byte)blend;

		System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
		byte[] _ret = md5.ComputeHash(data);
		return System.BitConverter.ToString(_ret).Replace("-", "");
	}

	private string EncodeProperty()
	{
		int texsize = 256 + 5 * 4;
		int size = texsize * 2 + 3 + 2 + 24;
		byte[] data = new byte[size];
		for(int i = 0; i < size; i++)
			data[i] = 0;

		int iBufIndex = 0;
		if(mainTex != null)
		{
			System.Text.Encoding.UTF8.GetBytes(mainTex.name).CopyTo(data, iBufIndex);
			iBufIndex += 256;
			System.BitConverter.GetBytes(uoffset).CopyTo(data, iBufIndex);
			iBufIndex += 4;
			System.BitConverter.GetBytes(voffset).CopyTo(data, iBufIndex);
			iBufIndex += 4;
			System.BitConverter.GetBytes(uscale).CopyTo(data, iBufIndex);
			iBufIndex += 4;
			System.BitConverter.GetBytes(vscale).CopyTo(data, iBufIndex);
			iBufIndex += 4;
			System.BitConverter.GetBytes(uvrotate).CopyTo(data, iBufIndex);
			iBufIndex += 4;
		}

		iBufIndex = texsize;
		if(maskTex != null)
		{
			System.Text.Encoding.UTF8.GetBytes(maskTex.name).CopyTo(data, iBufIndex);
			iBufIndex += 256;
			System.BitConverter.GetBytes(maskuoffset).CopyTo(data, iBufIndex);
			iBufIndex += 4;
			System.BitConverter.GetBytes(maskvoffset).CopyTo(data, iBufIndex);
			iBufIndex += 4;
			System.BitConverter.GetBytes(maskuscale).CopyTo(data, iBufIndex);
			iBufIndex += 4;
			System.BitConverter.GetBytes(maskvscale).CopyTo(data, iBufIndex);
			iBufIndex += 4;
			System.BitConverter.GetBytes(maskuvrotate).CopyTo(data, iBufIndex);
			iBufIndex += 4;
		}

		iBufIndex = 2 * texsize;
		data[iBufIndex++] = (byte)blend;
		data[iBufIndex++] = (byte)layer;
		data[iBufIndex++] = (byte)seqType;
		data[iBufIndex++] = (byte)tileCol;
		data[iBufIndex++] = (byte)tileRow;

		System.BitConverter.GetBytes(color.a).CopyTo(data, iBufIndex);
		iBufIndex += 4;
		System.BitConverter.GetBytes(color.r).CopyTo(data, iBufIndex);
		iBufIndex += 4;
		System.BitConverter.GetBytes(color.g).CopyTo(data, iBufIndex);
		iBufIndex += 4;
		System.BitConverter.GetBytes(color.b).CopyTo(data, iBufIndex);
		iBufIndex += 4;

		System.BitConverter.GetBytes(brightness).CopyTo(data, iBufIndex);
		iBufIndex += 4;
		System.BitConverter.GetBytes(seqValue).CopyTo(data, iBufIndex);
		iBufIndex += 4;

		System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
		byte[] _ret = md5.ComputeHash(data);
		return System.BitConverter.ToString(_ret).Replace("-", "");
	}

	public EffectMaterialScript()
	{
	}

	void Awake()
	{
		bUvAnimEnd = false;
        isPause = false;

		if(material == null)
		{
			if(blend == BlendMode.AlphaBlend)
				gameObject.GetComponent<Renderer>().material = new Material(AlphaBlendShader); 
			else
				gameObject.GetComponent<Renderer>().material =  new Material(AdditiveShader); 

			material = gameObject.GetComponent<Renderer>().material;
			startTime = Time.realtimeSinceStartup;
			RefreshTexture();
			RefreshParameter();
		}
		else
		{
			material = gameObject.GetComponent<Renderer>().material;
			startTime = Time.realtimeSinceStartup;
			RefreshParameter();
		}
	}

    public void ResetEffectMaterialScript()
    {
        startTime = Time.realtimeSinceStartup;

        bDelayEnd = false;
        bDelayStart = false;
        begintime = 0.0f;
        isPause = false;

        flowElapsedTime = 0;
        flowStartTimeAbs = Time.time + flowDelayTime;
        flowStopTimeAbs = flowStartTimeAbs + flowStopTime;
        flowuoffset = 0;
        flowvoffset = 0;
        flowStrength = 0;
        flowParam = new Vector4(0, 0, 0, 0);
        material.SetVector("_FlowUVParam", flowParam);

        m_bUseUVTile = UseTileAnim();
        m_bUseUVFlow = UseFlowAnim();

        if (material != null)
        {
            material = gameObject.GetComponent<Renderer>().material;
            RefreshParameter();

            if (delay > 0)
            {
                Color src = material.color;
                src.a = 0;
                material.color = src;
            }
        }                
    }

	void Start()
	{
		startTime = Time.realtimeSinceStartup;

		flowElapsedTime = 0;
		flowStartTimeAbs = Time.time + flowDelayTime;
		flowStopTimeAbs = flowStartTimeAbs + flowStopTime;
		flowuoffset = 0;
		flowvoffset = 0;
		flowStrength = 0;
		flowParam = new Vector4(0, 0, 0, 0);
		material.SetVector("_FlowUVParam", flowParam);
		
		m_bUseUVTile = UseTileAnim();
		m_bUseUVFlow = UseFlowAnim();
        isPause = false;
		
		if (material != null)
		{
			if (delay > 0)
			{
				Color src = material.color;
				src.a = 0;
				material.color = src;
			}
		}
        if (m_bUseUVFlow == false && m_bUseUVTile == false && m_isInFxMaker == false)
            this.enabled = false;
    }

	public void UpdateMaterialForce()
	{
		if (gameObject.GetComponent<Renderer>() == null)
		{
			return;
		}
		
		string md5name = EncodePropertyLess();
		string matPath = ("AutoMaterial/" + md5name);
		Material newMat = Resources.Load(matPath, typeof(Material)) as Material;
		if((newMat != null)&&(newMat != gameObject.GetComponent<Renderer>().sharedMaterial))
		{
			gameObject.GetComponent<Renderer>().sharedMaterial = newMat;
			
			material = gameObject.GetComponent<Renderer>().sharedMaterial;
		}
		
	}


	public bool UseTileAnim()
	{
		if (tileCol == 1 && tileRow == 1)
			return false;
		return true;
		
	}
	
	public bool UseFlowAnim()
	{
//		if (flowuspeed * flowuoffset < 0.01f && flowvspeed * flowvspeed < 0.01f && flowTex == null)
//			return false;
		if(flowTex == null)
			return false;
		return true;
	}

	public static bool BuildMaterial(GameObject obj)
	{
		#if UNITY_EDITOR
		EffectMaterialScript[] list = obj.GetComponentsInChildren<EffectMaterialScript>(true);
		int cnt = list.Length;
		if (cnt == 0)
		{
			return false;
		}
		for (int i = 0; i < cnt; i++)
		{
			EffectMaterialScript script = list[i];
			script.CreateMaterialForce();
			//script.enabled = false;
		}
		return true;
#else
        return false;
#endif
    }
    static List<string> m_noMatList = new List<string>();

	#if UNITY_EDITOR
	static void GetDirs(string path, string parent, ref List<string> dirs)
	{
		DirectoryInfo d = new DirectoryInfo(path);
		DirectoryInfo[] infos = d.GetDirectories();
		foreach (DirectoryInfo info in infos)
		{
			string pre = parent.Length > 0 ? parent + "/" : parent;
			dirs.Add(pre + info.Name);
			GetDirs(path + "/" + info.Name, pre + info.Name, ref dirs);
		}
	}
	#endif

	public static void BuildUIEffectIOSMaterials()
	{
		#if UNITY_EDITOR
		m_noMatList.Clear();
		
		string path1 = Application.dataPath;
		path1 += "/Resources/Effect/UI";
		
		List<string> dirs = new List<string>();
		string parent = "";
		
		GetDirs(path1, parent, ref dirs);
		
		for (int i = 0; i < dirs.Count; i++ )
		{
			if (dirs[i].Contains("Character/"))
			{
				continue;
			}
			
			string path = Application.dataPath;
			path += "/Resources/Effect/UI/" + dirs[i] + "/";
			
			string resPath = "Effect/UI/" + dirs[i] + "/";
			DirectoryInfo d = new DirectoryInfo(path);
			
			FileInfo[] allFile = d.GetFiles();
			
			foreach (FileInfo fi in allFile)
			{
				if (fi.Name.ToLower().Contains(".meta") == false && fi.Name.ToLower().Contains(".prefab"))
				{
					string name = fi.Name;
					if (name.Contains(".prefab"))
					{
						name = name.Substring(0, name.Length - 7);
					}
					GameObject prefab = Resources.Load(resPath + name) as GameObject;
					if (prefab != null)
					{
						
						GameObject obj = GameObject.Instantiate(prefab) as GameObject;
						try
						{
							bool flag = BuildMaterial(obj);
							//obj.transform.localPosition = new Vector3(0,0,0);
							if (flag)
							{
								PrefabUtility.ReplacePrefab(obj, prefab, ReplacePrefabOptions.ReplaceNameBased);
							}
							GameObject.DestroyImmediate(obj);
						}
						catch (System.Exception ex)
						{
							Debug.LogError("材质构建失败，对象暂时保留在场景中以供检查：" + ex.Message);
						}
					}
				}
			}
			/*string name = "scence_shine_02";
            GameObject prefab = Resources.Load(resPath + name) as GameObject;
            if (prefab != null)
            {
                GameObject obj = GameObject.Instantiate(prefab) as GameObject;
                BuildMaterial(obj);
                //obj.transform.localPosition = new Vector3(0,0,0);
                PrefabUtility.ReplacePrefab(obj, prefab, ReplacePrefabOptions.ReplaceNameBased);
                GameObject.DestroyImmediate(obj);
            }*/
		}
		
		#endif
	}

	public static void BuildUIEffectMaterials()
	{
		#if UNITY_EDITOR
		m_noMatList.Clear();
		
		string path1 = Application.dataPath;
		path1 += "/Resources/UI";
		
		List<string> dirs = new List<string>();
		string parent = "";
		
		GetDirs(path1, parent, ref dirs);
		
		for (int i = 0; i < dirs.Count; i++ )
		{
			if (dirs[i].Contains("Character/"))
			{
				continue;
			}
			
			string path = Application.dataPath;
			path += "/Resources/UI/" + dirs[i] + "/";
			
			string resPath = "UI/" + dirs[i] + "/";
			DirectoryInfo d = new DirectoryInfo(path);
			
			FileInfo[] allFile = d.GetFiles();
			
			foreach (FileInfo fi in allFile)
			{
				if (fi.Name.ToLower().Contains(".meta") == false && fi.Name.ToLower().Contains(".prefab"))
				{
					string name = fi.Name;
					if (name.Contains(".prefab"))
					{
						name = name.Substring(0, name.Length - 7);
					}
					GameObject prefab = Resources.Load(resPath + name) as GameObject;
					if (prefab != null)
					{
						
						GameObject obj = GameObject.Instantiate(prefab) as GameObject;
						try
						{
							bool flag = BuildMaterial(obj);
							//obj.transform.localPosition = new Vector3(0,0,0);
							if (flag)
							{
								PrefabUtility.ReplacePrefab(obj, prefab, ReplacePrefabOptions.ReplaceNameBased);
							}
							GameObject.DestroyImmediate(obj);
						}
						catch (System.Exception ex)
						{
							Debug.LogError("材质构建失败，对象暂时保留在场景中以供检查：" + ex.Message);
						}
						
					}
				}
			}
			/*string name = "scence_shine_02";
            GameObject prefab = Resources.Load(resPath + name) as GameObject;
            if (prefab != null)
            {
                GameObject obj = GameObject.Instantiate(prefab) as GameObject;
                BuildMaterial(obj);
                //obj.transform.localPosition = new Vector3(0,0,0);
                PrefabUtility.ReplacePrefab(obj, prefab, ReplacePrefabOptions.ReplaceNameBased);
                GameObject.DestroyImmediate(obj);
            }*/
		}
		
		#endif
	}

	public static void BuildAllMaterials()
	{
		#if UNITY_EDITOR
		m_noMatList.Clear();
		
		string path1 = Application.dataPath;
		path1 += "/Resources/Effect/";
		
		List<string> dirs = new List<string>();
		string parent = "";
		
		GetDirs(path1, parent, ref dirs);
		
		for (int i = 0; i < dirs.Count; i++ )
		{
			if (dirs[i].Contains("Character/"))
			{
				continue;
			}
			
			string path = Application.dataPath;
			path += "/Resources/Effect/" + dirs[i] + "/";
			
			string resPath = "Effect/" + dirs[i] + "/";
			DirectoryInfo d = new DirectoryInfo(path);
			
			FileInfo[] allFile = d.GetFiles();
			
			foreach (FileInfo fi in allFile)
			{
				if (fi.Name.ToLower().Contains(".meta") == false && fi.Name.ToLower().Contains(".prefab"))
				{
					string name = fi.Name;
					if (name.Contains(".prefab"))
					{
						name = name.Substring(0, name.Length - 7);
					}
					GameObject prefab = Resources.Load(resPath + name) as GameObject;
					if (prefab != null)
					{
						
						GameObject obj = GameObject.Instantiate(prefab) as GameObject;
						try
						{
							bool flag = BuildMaterial(obj);
							//obj.transform.localPosition = new Vector3(0,0,0);
							if (flag)
							{
								PrefabUtility.ReplacePrefab(obj, prefab, ReplacePrefabOptions.ReplaceNameBased);
							}
							GameObject.DestroyImmediate(obj);
						}
						catch (System.Exception ex)
						{
							Debug.LogError("材质构建失败，对象暂时保留在场景中以供检查：" + ex.Message);
						}
					}
				}
			}
		}
		
		#endif
	}

	#if UNITY_EDITOR
	public void EditorChange(bool bChangeShader, bool bChangeMode)
	{
		if(material == null)
			return;

		if(bChangeShader || bChangeMode || savematfile)
		{
			if(material.name == AlphaBlendShader.name || material.name == AdditiveShader.name)
			{
                DestroyMObject(material);
				material = null;
			}

			CreateMaterial();
		}

		startTime = Time.realtimeSinceStartup;
		RefreshTexture();
		RefreshParameter();

		bDelayStart = false;
		bDelayEnd = false;
		begintime = 0.0f;
	}

	void CreateMaterial()
	{
		if(savematfile)
		{
			string md5name = EncodePropertyLess();
			string matPath = ("AutoMaterial/" + md5name);
			Material newMat = Resources.Load(matPath, typeof(Material)) as Material;
			if(newMat == null)
			{
				if(blend == BlendMode.AlphaBlend)
					newMat = new Material(AlphaBlendShader); 
				else
					newMat = new Material(AdditiveShader);
				
				md5name = EncodePropertyLess();
				matPath = (FXMaterialPath + md5name + ".mat");
				AssetDatabase.CreateAsset(newMat, matPath);
			}
			
			gameObject.GetComponent<Renderer>().sharedMaterial = newMat;
		}
		else
		{
			if(blend == BlendMode.AlphaBlend)
				gameObject.GetComponent<Renderer>().sharedMaterial = new Material(AlphaBlendShader); 
			else
				gameObject.GetComponent<Renderer>().sharedMaterial = new Material(AdditiveShader); 
		}
		
		material = gameObject.GetComponent<Renderer>().sharedMaterial;
	}

	public void CreateMaterialForce()
	{
		if (gameObject.GetComponent<Renderer>() == null)
		{
			return;
		}
		
		string md5name = EncodePropertyLess();
		string matPath = ("AutoMaterial/" + md5name);
		
		Material newMat = AssetDatabase.LoadAssetAtPath("Assets/Resources/" + matPath + ".mat", typeof(Material) ) as Material; //Resources.Load(matPath, typeof(Material)) as Material;
		if (newMat == null)
		{
			if (blend == BlendMode.AlphaBlend)
				newMat = new Material(AlphaBlendShader);
			else if (blend == BlendMode.Additive)
				newMat = new Material(AdditiveShader);
//			if (blend == BlendMode.AlphaBlendZTestOff)
//				newMat = new Material(AlphaBlendShaderZTestOff);
//			else
//				newMat = new Material(AdditiveShaderZTestOff);
			RefreshTexture(newMat);
			RefreshParameter(newMat);
			
			md5name = EncodePropertyLess();
			matPath = (FXMaterialPath + md5name + ".mat");
			AssetDatabase.CreateAsset(newMat, matPath);
		}
		
		gameObject.GetComponent<Renderer>().sharedMaterial = newMat;
		
		material = gameObject.GetComponent<Renderer>().sharedMaterial;
	}
	
	public void EditorEnable()
	{
		if(material == null)
		{
			CreateMaterial();
		}

		startTime = Time.realtimeSinceStartup;
		RefreshTexture();
		RefreshParameter();

		bDelayStart = false;
		bDelayEnd = false;
		begintime = 0.0f;
	}
	#endif
	public void EditorDisable()
	{
	}

	public void ForceUpdate()
	{
		//Update();
	}

	void OnValidate()
	{
	}

	private void RefreshTexture()
	{
		material.SetTexture("_MainTex", mainTex);
		if(maskTex != null)
			material.SetTexture("_MaskTex", maskTex);
		if (flowTex != null)
			material.SetTexture("_FlowTex", flowTex);
	}

	private void RefreshTexture(Material mat)
	{
		if (mat)
		{
			if (mainTex != null)
				mat.SetTexture("_MainTex", mainTex);
			if (maskTex != null)
				mat.SetTexture("_MaskTex", maskTex);
			if (flowTex != null)
				mat.SetTexture("_FlowTex", flowTex);
		}
	}

	private void RefreshParameter()
	{
		if (material)
		{
			RefreshParameter(material);
		}
	}

	private void RefreshParameter(Material mat)
	{
		m_bUseUVTile = UseTileAnim();
		m_bUseUVFlow = UseFlowAnim();

		var keywords = new List<string> { maskTex != null ? "MASK_ON" : "MASK_OFF"};
		keywords.Add(flowTex != null ? "_FLOW_ON" : "_FLOW_OFF");
		//keywords.Add("_SEPARATEALPHA_ON");
		foreach (string s in mat.shaderKeywords) {
			if(s == "_SEPARATEALPHA_ON")
			{
				keywords.Add("_SEPARATEALPHA_ON");
			}
		}
		//mat.shaderKeywords
		mat.shaderKeywords = keywords.ToArray ();
	
//		for (int i = 0; i < material.shaderKeywords.Length; i++)
//		{
//			if (material.shaderKeywords[i] != "MASK_ON" && material.shaderKeywords[i] != "MASK_OFF" && material.shaderKeywords[i] != "_FLOW_OFF" && material.shaderKeywords[i] != "_FLOW_ON")
//				keywords.Add(material.shaderKeywords[i]);
//		}

		mat.color = color;

		Vector4 vec;
		vec.x = uoffset;
		vec.y = voffset;
		vec.z = uscale;
		vec.w = vscale;
		mat.SetVector("_UVParam", vec);
		mat.SetFloat("_Rotate", uvrotate);

		vec.x = maskuoffset;
		vec.y = maskvoffset;
		vec.z = maskuscale;
		vec.w = maskvscale;
		mat.SetVector("_MaskUVParam", vec);
		mat.SetFloat("_MaskRotate", maskuvrotate);
		mat.SetFloat("_Brightness", brightness);
		mat.SetFloat("_FlowRotate", flowRotate);
        mat.SetFloat("_Flow", m_bUseUVFlow ? 1f : 0f);
		switch(layer)
		{
		case LayerMode.Front: 	mat.renderQueue = 3000; break;
		case LayerMode.Middle:	mat.renderQueue = 3001; break;
		case LayerMode.Back:	mat.renderQueue = 3002; break;
		case LayerMode.UI:		mat.renderQueue = 4001; break;
		}
	}

	public void SetUIRenderQueue(int renderQueue)
	{
        if (layer == LayerMode.UI && material)
		{
			material.renderQueue = renderQueue;
		}
	}

	void DestroyMObject(Object obj)
	{
		#if UNITY_EDITOR
		if (UnityEditor.EditorApplication.isPlaying || UnityEditor.EditorApplication.isPaused)
			Object.Destroy(obj);
		else
			Object.DestroyImmediate(obj);
		#else
		Object.Destroy(obj);
		#endif
	}
	
	void OnDestroy()
	{
		if(material != null)
		{
            DestroyMObject(material);
			material = null;
		}
	}
	
	void Update ()
	{
		if(material != null)
		{
			bool bEnable = true;
			if(delay > 0.0f && !bDelayStart)
			{
				if(begintime > delay)
				{
					bDelayStart = true;
					startTime = Time.realtimeSinceStartup;
				}
				else
				{
					begintime =  Time.realtimeSinceStartup - startTime;
					bEnable = false;
				}
			}

			if(bEnable && !bDelayEnd)
			{
				Vector4 vec;
				if(tileCol == 1 && tileRow == 1)
				{
					vec.x = vec.y = 0.0f;
					vec.z = vec.w = 1.0f;
					tile = 0;
				}
				else
				{
					int totalTile = tileCol * tileRow;
					
					if(seqType == SeqType.TimeSequence || seqType == SeqType.TimeRandom)
					{
						if(seqValue <= 0.0f)
							seqValue = EPSILON;
						
						if(Time.realtimeSinceStartup - startTime >= seqValue)
						{
							if(seqType == SeqType.TimeSequence)
							{
								tile++;

								if(once && tile >= totalTile)
									bDelayEnd = true;
							}
							else
							{
								tile = (int)(Random.Range(0.0f, 1.0f) * totalTile);
							}
							tile = tile % totalTile;
							startTime = Time.realtimeSinceStartup;
						}
					}
					else
					{
						tile = (int)seqValue;
						tile = tile % totalTile;
					}
					
					int iRow = tile / tileCol;
					
					// Fixed V direction
					iRow = (tileRow - 1) - iRow;
					
					int iCol = tile % tileCol;
					
					vec.x = iCol / (float)tileCol;
					vec.y = iRow / (float)tileRow;
					vec.z = 1.0f / tileCol;
					vec.w = 1.0f / tileRow;
				}
				material.SetVector("_UVTile", vec);
			}

			Color src = material.color;
			
			float alphaResult = 1;
			
			Color clr = color;



			if (bDelayEnd || !bEnable)
			{
				alphaChanged = true;
				clr.a = 0.0f;
				alphaResult = 0;
				src.a = alphaResult;
				material.color = src;
			}
			else
			{
				if (alphaChanged)//只改变一次//
				{
					src.a = clr.a;
					alphaResult = clr.a;
					src.a = alphaResult;
					material.color = src;
					alphaChanged = false;
				}
			}

//			material.color = clr;
			NewUpdate();
		}
		//
	}

	void NewUpdate()
	{
//		if (isPaused)
//			return;
		
		if (material == null)
			return;
		
		//Profiler.BeginSample("EffectMaterialScript.newUpdate");
		if (m_isInFxMaker)
		{
			EditorUpdate();
		}
		else
		{
			RuntimeUpdate();
		}
		//Profiler.EndSample();
	}

	void EditorUpdate()
	{

		UpdateUVTile();
		
		UpdateFlow();
	}
	
	
	void RuntimeUpdate()
	{
        if (isPause)
        {
            return;
        }
        
		if (m_bUseUVTile)
			UpdateUVTile();
		if (m_bUseUVFlow)
			UpdateFlow();
	}

	void UpdateUVTile()
	{
		bool bEnable = true;
		if (delay > 0.0f && !bDelayStart)
		{
			if (begintime >= delay)
			{
				bDelayStart = true;
				startTime = Time.time;
				material.color = color;
				
			}
			else
			{
				begintime = Time.time - startTime;
				bEnable = false;
			}
		}
		if (bEnable && !bUvAnimEnd)
		{
			
			bool bSetUv = true;
			Vector4 vec = new Vector4(0, 0, 1, 1);
			
			if (tileCol == 1 && tileRow == 1)
			{
				vec.x = vec.y = 0.0f;
				vec.z = vec.w = 1.0f;
				tile = 0;
				if (m_bUVInitialized == true)
					bSetUv = false;
			}
			else
			{
				int totalTile = tileCol * tileRow;
				
				if (seqType == SeqType.TimeSequence || seqType == SeqType.TimeRandom)
				{
					if (seqValue <= 0.0f)
						seqValue = EPSILON;
					
					if (Time.time - startTime >= seqValue)
					{
						if (seqType == SeqType.TimeSequence)
						{
							tile++;
							if (once && tile >= totalTile)
							{
								bUvAnimEnd = true;
								Color clr = color;
								clr.a = 0.0f;
								material.color = color;
							}
						}
						else
						{
							tile = (int)(Random.Range(0.0f, 1.0f) * totalTile);
						}
						
						if (totalTile != 0)
						{
							tile = tile % totalTile;
						}
						startTime = Time.time;// realtimeSinceStartup;
					}
				}
				else
				{
					tile = (int)seqValue;
					tile = tile % totalTile;
				}
				
				if (tileCol > 0)
				{
					int iRow = tile / tileCol;
					
					// Fixed V direction
					iRow = (tileRow - 1) - iRow;
					
					int iCol = tile % tileCol;
					
					vec.x = iCol / (float)tileCol;
					vec.y = iRow / (float)tileRow;
					vec.z = 1.0f / tileCol;
					vec.w = 1.0f / tileRow;
				}
			}
			
			if ((!bUvAnimEnd && bSetUv) || m_isInFxMaker)
			{
				
				material.SetVector("_UVTile", vec);
				
				m_bUVInitialized = true;
			}
		}
	}
	void UpdateFlow()
	{
		if ((flowStartTimeAbs <= Time.time) && (Time.time < flowStopTimeAbs))
		{
			flowElapsedTime += Time.deltaTime;
			flowuoffset += flowuspeed * Time.deltaTime;
			flowvoffset += flowvspeed * Time.deltaTime;
			flowElapsedRate = flowElapsedTime / flowStopTime;
			
			
			flowStrength = flowStrengthCurve.Evaluate(flowElapsedRate) * flowStrengthValue;
			
			
			
			flowParam.x = flowuoffset;
			flowParam.y = flowvoffset;
			flowParam.z = flowStrength;
			flowParam.w = flowOffset;
			
			material.SetVector("_FlowUVParam", flowParam);
			
		}
	}
    
    public void PauseFlow()
    {
        isPause = true;                    
    }

    public void ResumeFlow()
    {
        isPause = false;        
    }

	bool alphaChanged = false;
}


//

