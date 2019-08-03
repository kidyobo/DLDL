// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'


// by artsyli

Shader "Effect_Mid/Alpha Blend" 
{
	Properties 
	{
		_Color ("Main Color", Color) = (1, 1, 1, 1)
		_Brightness ("Brightness", Float) = 1.0
        _MainTex ("Base (RGB)", 2D) = "white" {}
        _MaskTex ("Mask Texture (R)", 2D) = "white" {}
        _UVParam ("UV Param", Vector) = (0, 0, 1, 1)
        _UVTile ("UV Tile", Vector) = (0, 0, 1, 1)
        _Rotate ("UV Rotate", Range (0, 360.0)) = 0.0
        _MaskUVParam ("Mask UV Param", Vector) = (0, 0, 1, 1)
        _MaskRotate ("Mask UV Rotate", Range (0, 360.0)) = 0.0
		[Toggle] _Flow ("_Flow", Float) = 0
		_FlowUVParam ("_Flow UV Param", Vector) = (0, 0, 0, 1)
		_FlowTex ("Flow Texture (RG)", 2D) = "black" {}
		_FlowRotate ("FlowRotate", Range (0, 360.0)) = 0.0
		_DarkenDegree("***Do not edit***", Float) = 1
		[KeywordEnum(Off,On)] _SeparateAlpha("_Separate Alpha(Do not edit)", Float) = 0
		_AlphaTex ("Alpha Texture(Do not edit)", 2D) = "white" {}
		_AlphaCtrl("Alpha control ***Do not edit***", Float) = 1
		_LuminosityAmount ("GrayScale Amount", Range(0.0, 1.0)) = 0.0
	}
	SubShader 
	{
		Tags 
		{ 
			"Queue"="Transparent"
			"IgnoreProjector"="True"
			"RenderType"="Transparent" 
		}
		Pass
		{
			Blend SrcAlpha OneMinusSrcAlpha
			Cull Off
			Lighting Off
	        ZWrite Off
//	        ZTest Off
	        Fog { Color (0,0,0,0) }
			Name "Effect"
			CGPROGRAM
		 
			#pragma vertex vert
			#pragma fragment frag
			#pragma multi_compile MASK_OFF MASK_ON
			#pragma multi_compile _SEPARATEALPHA_OFF _SEPARATEALPHA_ON
			#pragma multi_compile _SCALE_OFF  _SCALE_ON
			#pragma multi_compile _FLOW_OFF  _FLOW_ON
			#pragma target 2.0
			#include "UnityCG.cginc"
			
			sampler2D _MainTex;
			float4 _Color;
			float _Brightness;
			float4 _UVParam;
			float4 _UVTile;
			float _Rotate;
			#ifdef MASK_ON
			sampler2D _MaskTex;
			float4 _MaskUVParam;
			float _MaskRotate;
			#endif
			#ifdef _FLOW_ON
			half4 _FlowUVParam;
			sampler2D _FlowTex;
			float _FlowRotate;
			#endif

			fixed _DarkenDegree;
			fixed _AlphaCtrl;
			
			float4 _MainTex_ST;  // build in var
			
			#ifdef _SEPARATEALPHA_ON
			sampler2D _AlphaTex;
			#endif
			
			#ifdef _SCALE_ON
			uniform float4x4 _Camera2World;
			float4 _ScalePosInWorld;
			half _ScaleSize;
			#endif
			fixed _LuminosityAmount;
			
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

			float2 FlowRotate(float2 uv,float uvRotate)
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
			
			struct VS_INPUT
			{
				float4 position : POSITION;
				float4 color : COLOR;
				float2 uv : TEXCOORD0;
			};

			struct VS_OUTPUT
			{
				float4 position : SV_POSITION;
				float4 color : COLOR;
				float4 uv : TEXCOORD0;
				#ifdef _SCALE_ON  
				float2 flowUV : TEXCOORD1;
				#endif
				#ifdef _FLOW_ON  
				float2 flowUV : TEXCOORD1;
				#endif
			};

			VS_OUTPUT vert(VS_INPUT In)
			{
				VS_OUTPUT Out;
				#ifdef _SCALE_OFF
				//In.position.xyz *=unity_Scale.w;
				Out.position = UnityObjectToClipPos(In.position);
				#endif
				
				#ifdef _SCALE_ON

				float4 pos = mul(UNITY_MATRIX_MV, In.position);
				pos = mul(_Camera2World,pos);
				pos.xyz -= _ScalePosInWorld;
				pos.xyz *= _ScaleSize;
				pos.xyz += _ScalePosInWorld;
				Out.position = mul(UNITY_MATRIX_VP, pos);
				#endif
				float2 uv = In.uv.xy * _MainTex_ST.xy + _MainTex_ST.zw;
				Out.uv.xy = CalcUV(uv, _UVParam, _UVTile, _Rotate/57.2957796);
				Out.uv.zw = In.uv;
			#ifdef MASK_ON
				Out.uv.zw = CalcUV(In.uv, _MaskUVParam, float4(0, 0, 1, 1), _MaskRotate/57.2957796);
			#endif

			#ifdef _FLOW_ON
				Out.flowUV.xy=FlowRotate(In.uv,_FlowRotate/57.2957796);
				Out.flowUV.xy = Out.flowUV.xy + _FlowUVParam.xy;
			#endif
				In.color.a *= _AlphaCtrl;
				Out.color = In.color;
				
				return Out;
			}
			
			float4 frag(VS_OUTPUT In) : COLOR 
			{
			#ifdef _FLOW_ON
			fixed4 flow = tex2D(_FlowTex, In.flowUV);
			flow += _FlowUVParam.w;
			fixed4 color = tex2D(_MainTex, In.uv.xy + flow.rg *_FlowUVParam.z);
			#else
			fixed4 color = tex2D(_MainTex, In.uv.xy);
			#endif
			float luminosity = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;  
            color = lerp(color, luminosity, _LuminosityAmount);

				//float4 color = tex2D(_MainTex, In.uv.xy);
			#ifdef _SEPARATEALPHA_ON
				color.a = tex2D(_AlphaTex, In.uv.xy).r;
			#endif
				color *= In.color;
			#ifdef MASK_ON
				color.a *= tex2D(_MaskTex, In.uv.zw).r;
			#endif
				color.rgba *= _Color.rgba;
				color.rgb *= _Brightness * _DarkenDegree;

					
				return color;
			}

			ENDCG
		}
	}
	Fallback off
	CustomEditor "EffectShaderGUI"
}
