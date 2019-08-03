Shader "Game/ModelStandard"
{	
	Properties
	{
		_MainTex ("贴图(RGBA)", 2D) = "grey" {}
		_MaskTex("遮罩(标记特效区域)", 2D) = "white" {}
		_LightTex("环绕光 (RGB)", 2D) = "grey" {}
		_LightScale("环绕光缩放", float) = 2
		_RimColor("环绕颜色", Color) = (1,1,1,1)
		_CutoffValue("透明度裁切值", Range(0,1)) = 0.5
		_NoiseTex("流光(RGB)", 2D) = "white" {}
		_Scroll2X("X速率", Float) = 1.0
		_Scroll2Y("Y速率", Float) = 0.0
	}
	SubShader
	{
		Tags{ "QUEUE" = "AlphaTest+100" "IGNOREPROJECTOR" = "true" "RenderType" = "Opaque" }
		LOD 200
		Pass
		{
			
			CGPROGRAM
				#pragma vertex vert
				#pragma fragment frag
				#pragma multi_compile_fog
				#pragma multi_compile _DUMMY _LIGHT_ON
				#pragma multi_compile _DUMMY _RIM_ON
				#pragma multi_compile _DUMMY _CLIPALPHA
				#pragma multi_compile _DUMMY _NOISE_ON
				#include "Assets/AssetSources/shader/cg/StandardCG.cginc"
			ENDCG
		}
	}
	        FallBack "Diffuse"
			CustomEditor "ModelStandardShaderGUI"
}
