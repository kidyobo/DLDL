Shader "Game/ModelBurn(模型溶解)"
{
	Properties
	{
		_MainTex("贴图(RGBA)", 2D) = "grey" {}
		_MaskTex("遮罩(标记特效区域)", 2D) = "white" {}
		_LightTex("环绕光 (RGB)", 2D) = "grey" {}
		_LightScale("环绕光缩放", float) = 2
		_RimColor("环绕颜色", Color) = (1,1,1,1)
		_CutoffValue("透明度裁切值", Range(0,1)) = 0.5
		_NoiseTex("流光(RGB)", 2D) = "white" {}
		_Scroll2X("X速率", Float) = 1.0
		_Scroll2Y("Y速率", Float) = 0.0
		[HideInInspector]_RGBOffset("颜色叠加", vector) = (0,0,0,0)
		[HideInInspector]_Alpha("Alpha", Range(0,1)) = 1

		_DisolveGuide("Disolve Guide", 2D) = "white" {}
		_BurnRamp("Burn Ramp", 2D) = "white" {}
		_DissolveAmount("Dissolve Amount", Range(0 , 1)) = 0

	}
		SubShader
	{
		Tags{ "QUEUE" = "Transparent+1" "IGNOREPROJECTOR" = "true" "RenderType" = "Opaque" }
		Blend SrcAlpha OneMinusSrcAlpha
		LOD 200
		Pass
	{
		CGPROGRAM
#pragma vertex vert
#pragma fragment frag
#pragma multi_compile_fog
#pragma multi_compile _DUMMY _LIGHT_ON
#pragma multi_compile _DUMMY _HURT_ON
#pragma multi_compile _DUMMY _RIM_ON
#pragma multi_compile _DUMMY _CLIPALPHA
#pragma multi_compile _TRANSLUCENT
#pragma multi_compile _DISSOLVE_ON
#include "Assets/AssetSources/shader/cg/StandardCG.cginc"
		ENDCG
	}
	}
		CustomEditor "ModelStandardShaderGUI"
}
