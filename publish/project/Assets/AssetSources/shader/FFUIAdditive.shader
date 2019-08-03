Shader "Game/FFEffect/UI/Additive"
{
	Properties
	{
		[PerRendererData] _MainTex("Sprite Texture", 2D) = "white" {}
		_Color("Tint", Color) = (1,1,1,1)

		[HIDEININSPECTOR]_StencilComp("Stencil Comparison", Float) = 8
		[HIDEININSPECTOR]_Stencil("Stencil ID", Float) = 0
		[HIDEININSPECTOR]_StencilOp("Stencil Operation", Float) = 0
		[HIDEININSPECTOR]_StencilWriteMask("Stencil Write Mask", Float) = 255
		[HIDEININSPECTOR]_StencilReadMask("Stencil Read Mask", Float) = 255

		[HIDEININSPECTOR]_ColorMask("Color Mask", Float) = 15

		[HIDEININSPECTOR][Toggle(UNITY_UI_ALPHACLIP)] _UseUIAlphaClip("Use Alpha Clip", Float) = 0

		_Brightness("_Brightness", Float) = 1.0
	_MaskTex("_MaskTex", 2D) = "white" {}
	_CutMaskTex("_CutMaskTex", 2D) = "white" {}
	_CutMaskValue("_CutMaskValue", Range(0, 1.1)) = 1.1
		_UVParam("_UVParam", Vector) = (0, 0, 1, 1)
		_UVTile("_UVTile", Vector) = (0, 0, 1, 1)
		_Rotate("_Rotate", Range(0, 360.0)) = 0.0
		_MaskUVParam("_MaskUVParam", Vector) = (0, 0, 1, 1)
		_MaskRotate("_MaskRotate", Range(0, 360.0)) = 0.0
		_FlowUVParam("_FlowUVParam", Vector) = (0, 0, 0, 1)
		_FlowTex("_FlowTex", 2D) = "black" {}
	_FlowRotate("_FlowRotate", Range(0, 360.0)) = 0.0
		_LuminosityAmount("_LuminosityAmount", Range(0.0, 1.0)) = 0.0
	}

		SubShader
	{
		Tags
	{
		"Queue" = "Transparent"
		"IgnoreProjector" = "True"
		"RenderType" = "Transparent"
		"PreviewType" = "Plane"
		"CanUseSpriteAtlas" = "True"
	}

		Stencil
	{
		Ref[_Stencil]
		Comp[_StencilComp]
		Pass[_StencilOp]
		ReadMask[_StencilReadMask]
		WriteMask[_StencilWriteMask]
	}

		Cull Off
		Lighting Off
		ZWrite Off
		ZTest[unity_GUIZTestMode]
		Blend SrcAlpha OneMinusSrcAlpha
		ColorMask[_ColorMask]

		Pass
	{
		CGPROGRAM
#pragma vertex vert
#pragma fragment frag

#include "UnityCG.cginc"
#include "UnityUI.cginc"

#pragma multi_compile __ UNITY_UI_ALPHACLIP
#pragma multi_compile _DUMMY _MASK_ON
#pragma multi_compile _DUMMY _CUTMASK_ON
#pragma multi_compile _DUMMY  _SCALE_ON
#pragma multi_compile _DUMMY  _FLOW_ON

		struct appdata_t
	{
		float4 vertex   : POSITION;
		float4 color	: COLOR;
		float2 texcoord : TEXCOORD0;
	};

	struct v2f
	{
		float4 vertex   : SV_POSITION;
		fixed4 color : COLOR;
		half2 texcoord  : TEXCOORD0;
		float4 worldPosition : TEXCOORD1;
#ifdef _FLOW_ON
		float2 flowUV : TEXCOORD2;
#endif
	};

	fixed4 _Color;
	fixed4 _TextureSampleAdd;
	float4 _ClipRect;
	sampler2D _MainTex;

	float _Brightness;
	float4 _UVParam;
	float4 _UVTile;
	float _Rotate;
#ifdef _MASK_ON
	sampler2D _MaskTex;
	float4 _MaskUVParam;
	float _MaskRotate;
#endif

#ifdef _CUTMASK_ON
	sampler2D _CutMaskTex;
	half _CutMaskValue;
#endif

#ifdef _FLOW_ON
	half4 _FlowUVParam;
	sampler2D _FlowTex;
	float _FlowRotate;
#endif


	float4 _MainTex_ST;  // build in var

	fixed _LuminosityAmount;

	//#endif

#ifdef _SCALE_ON
	uniform float4x4 _Camera2World;
	float4 _ScalePosInWorld;
	half _ScaleSize;
#endif
	float2 CalcUV(float2 uv, float4 uvParam, float4 uvTile, float uvRotate)
	{
		float2 outUV;
		float s;
		float c;
		s = sin(uvRotate);
		c = cos(uvRotate);

		outUV = uv - float2(0.5f, 0.5f);
		outUV = float2(outUV.x * c - outUV.y * s, outUV.x * s + outUV.y * c);
		outUV.x *= uvParam.z;
		outUV.y *= uvParam.w;
		outUV = outUV + uvParam.xy + float2(0.5f, 0.5f);

		outUV.x = (outUV.x * uvTile.z) + uvTile.x;
		outUV.y = (outUV.y * uvTile.w) + uvTile.y;

		return outUV;
	}

	float2 FlowRotate(float2 uv, float uvRotate)
	{
		float2 outUV;
		float s;
		float c;
		s = sin(uvRotate);
		c = cos(uvRotate);

		outUV = uv - float2(0.5f, 0.5f);
		outUV = float2(outUV.x * c - outUV.y * s, outUV.x * s + outUV.y * c);
		outUV = outUV + float2(0.5f, 0.5f);
		return outUV;
	}

	v2f vert(appdata_t IN)
	{
		v2f OUT;
		OUT.worldPosition = IN.vertex;
		OUT.texcoord = IN.texcoord;
		OUT.color = IN.color * _Color;
#ifdef _SCALE_ON
		float4 pos = mul(UNITY_MATRIX_MV, IN.vertex);
		pos = mul(_Camera2World, pos);
		pos.xyz -= _ScalePosInWorld;
		pos.xyz *= _ScaleSize;
		pos.xyz += _ScalePosInWorld;
		OUT.vertex = mul(UNITY_MATRIX_VP, pos);
#else
		OUT.vertex = UnityObjectToClipPos(IN.vertex);
#endif
#ifdef UNITY_HALF_TEXEL_OFFSET
		OUT.vertex.xy += (_ScreenParams.zw - 1.0)*float2(-1, 1);
#endif
		float2 uv = IN.texcoord.xy * _MainTex_ST.xy + _MainTex_ST.zw;
		OUT.texcoord.xy = CalcUV(uv, _UVParam, _UVTile, _Rotate / 57.2957796);
#ifdef _FLOW_ON
		OUT.flowUV.xy = FlowRotate(IN.texcoord, _FlowRotate / 57.2957796);
		OUT.flowUV.xy = OUT.flowUV.xy + _FlowUVParam.xy;
#endif
		return OUT;
	}

	fixed4 frag(v2f IN) : SV_Target
	{
#ifdef _FLOW_ON
		fixed4 flow = tex2D(_FlowTex, IN.flowUV);
		flow += _FlowUVParam.w;
		fixed4 color = tex2D(_MainTex, IN.texcoord.xy + flow.rg *_FlowUVParam.z) + _TextureSampleAdd;
#else
		fixed4 color = tex2D(_MainTex, IN.texcoord);
#endif
		color.a *= UnityGet2DClipping(IN.worldPosition.xy, _ClipRect);
#ifdef UNITY_UI_ALPHACLIP
		clip(color.a - 0.001);
#endif

		float luminosity = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
		color = lerp(color, luminosity, _LuminosityAmount);
		color *= IN.color;
#ifdef _CUTMASK_ON
		half mask = tex2D(_CutMaskTex, IN.texcoord).r;
		half m = saturate(_CutMaskValue - mask);
		color.a *= saturate(m*m * 100);
#endif
		color.rgba *= _Color.rgba;
		color.rgb *= _Brightness;
		return color;
	}
		ENDCG
	}
	}
	Fallback off
	CustomEditor "FFEffectShaderAddtive"
}
