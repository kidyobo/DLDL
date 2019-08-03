// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'


// by artsyli

Shader "Game/FFEffect/Additive" 
{
	Properties 
	{
		_Color ("_Color", Color) = (1, 1, 1, 1)
		_Brightness ("_Brightness", Float) = 1.0
        _MainTex ("_MainTex", 2D) = "white" {}
        _UVParam ("_UVParam", Vector) = (0, 0, 1, 1)
        _UVTile ("_UVTile", Vector) = (0, 0, 1, 1)
        _Rotate ("_Rotate", Range (0, 360.0)) = 0.0
		_LuminosityAmount ("_LuminosityAmount", Range(0.0, 1.0)) = 0.0

        _MaskTex ("_MaskTex", 2D) = "white" {}
        _MaskUVParam ("_MaskUVParam", Vector) = (0, 0, 1, 1)
        _MaskRotate ("_MaskRotate", Range (0, 360.0)) = 0.0

		_FlowTex ("_FlowTex", 2D) = "black" {}
        _FlowUVParam ("_FlowUVParam", Vector) = (0, 0, 0, 1)
		_FlowRotate ("_FlowRotate", Range (0, 360.0)) = 0.0

		_CutMaskTex("_CutMaskTex", 2D) = "white" {}
		_CutMaskValue("_CutMaskValue", Range(0, 1.1)) = 1.1
		_CutMaskRotate ("_CutMaskRotate", Range (0, 360.0)) = 0.0
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
			Blend SrcAlpha One
			Cull Off
			Lighting Off
	        ZWrite Off
//	        ZTest Off
	        Fog { Color (0,0,0,0) }
			Name "Effect"
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			#pragma multi_compile _DUMMY _MASK_ON
			#pragma multi_compile _DUMMY _CUTMASK_ON
			#pragma multi_compile _DUMMY  _FLIP_CUTMASK_ON
			#pragma multi_compile _DUMMY  _FLOW_ON

			#pragma target 2.0
			#include "UnityCG.cginc"
			
			sampler2D _MainTex;
			
			float4 _Color;
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
			float _CutMaskRotate;
#endif

#ifdef _FLOW_ON
			half4 _FlowUVParam;
			sampler2D _FlowTex;
			float _FlowRotate;
#endif

			
			float4 _MainTex_ST;  // build in var
			
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
			    #ifdef _FLOW_ON
				    float2 flowUV : TEXCOORD1;
				#endif
				#ifdef _CUTMASK_ON
				    float2 cutMaskUV : TEXCOORD2;
				#endif
			};

			VS_OUTPUT vert(VS_INPUT In)
			{
				VS_OUTPUT Out;
				Out.position = UnityObjectToClipPos(In.position);
				float2 uv = In.uv.xy * _MainTex_ST.xy + _MainTex_ST.zw;
				Out.uv.xy = CalcUV(uv, _UVParam, _UVTile, _Rotate/57.2957796);
				Out.uv.zw = In.uv;
			#ifdef _MASK_ON
				Out.uv.zw = CalcUV(In.uv, _MaskUVParam, float4(0, 0, 1, 1), _MaskRotate/57.2957796);
			#endif
			#ifdef _FLOW_ON
			    Out.flowUV.xy=FlowRotate(In.uv,_FlowRotate/57.2957796);
				Out.flowUV.xy = Out.flowUV.xy + _FlowUVParam.xy;
			#endif
			#ifdef _CUTMASK_ON
				Out.cutMaskUV.xy =FlowRotate(In.uv,_CutMaskRotate/57.2957796);
			#endif
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
			//return fixed4(1,0,0,1);
				color *= In.color;
			#ifdef _MASK_ON
				color.a *= tex2D(_MaskTex, In.uv.zw).r;
			#endif
#ifdef _CUTMASK_ON
#ifdef _FLIP_CUTMASK_ON
				half mask = 1-tex2D(_CutMaskTex, In.cutMaskUV).r;
#else
				half mask = tex2D(_CutMaskTex, In.cutMaskUV).r;
#endif
				half m = saturate(_CutMaskValue - mask);
				color.a *= saturate(m*m * 100);
#endif
				color.rgba *= _Color.rgba;
				color.rgb *= _Brightness ;
				return color;
			}

			ENDCG
		}
	}
	Fallback off
	CustomEditor "FFEffectShaderAddtive"
}
