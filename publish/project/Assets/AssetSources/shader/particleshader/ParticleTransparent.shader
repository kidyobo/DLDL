// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "AItoyParticles/ParticleTransparent" 
{
	Properties
	{
		_PushSize			("Push", range(0,0.1)) = 0
		_MainColor 			("MainColor", Color) = (1,1,1,1)
		_Rotate 			("UV Rotate", float) = 0.0
		_MainTex 			("Particle Texture", 2D) = "white" {}

		_AlphaRotate 			("AlphaUV Rotate", float) = 0.0
		_AlphaTex 			("Alpha Texture", 2D) = "white" {}
		
		_Dissolve			("Dissolve",range(0,1)) = 0
		_DissolveBlend		("DissolveBlend", range(0,1)) = 0
		_DissolveTexture	("DissolveTexture", 2D) = "white" {}
		
		_DistortionArgs		("Dissolve,x,y,scale,speed",vector) = (0,0,0.05,0)
		_DistortionTexture 	("扭曲", 2D) = "black" {}
		
		_SphereTex 			("SphereTexture", 2D) = "white" {}
		_SphereMaskTex 		("SphereMaskTexture", 2D) = "white" {}
		
		_ColorMultiplier	("ColorMultiplier",range(1,5)) = 1
		
		_MinX ("Min X", Float) = -10
        _MaxX ("Max X", Float) = 10
        _MinY ("Min Y", Float) = -10
        _MaxY ("Max Y", Float) = 10
		
		[HideInInspector] _SrcFactor ("SrcFactor", Float) = 5
		[HideInInspector] _DstFactor ("DstFactor", Float) = 10
		[HideInInspector] _CullMode ("Cull", int) = 0
		[HideInInspector] _ZTestMode ("ZTest(4)", int) = 4
		[HideInInspector] _ZWrite ("ZWrite", int) = 0
		_FogDensity ("FogDensity", Float) = 0
	}

	Category 
	{
		Tags { "Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent"}
		Blend [_SrcFactor] [_DstFactor]
		Cull [_CullMode]
		Lighting Off
		ZWrite [_ZWrite]
		ZTest [_ZTestMode]
		Fog { mode off   }

		SubShader
		{
			Pass
			{
				CGPROGRAM
				#pragma vertex vert
				#pragma fragment frag
				#pragma multi_compile_particles
				#pragma multi_compile_fog

				#include "UnityCG.cginc"
				
				#pragma multi_compile Dissolve_Off  	Dissolve_On
				#pragma multi_compile Distortion_Off  	Distortion_On
				#pragma multi_compile Sphere_Off  		Sphere_On
				#pragma multi_compile VertexColor_On  	VertexColor_Off
				#pragma multi_compile Clip_Off			Clip_On
			

				sampler2D _MainTex;
				sampler2D _AlphaTex;
				sampler2D _DissolveTexture;
				sampler2D _SphereTex;
				sampler2D _SphereMaskTex;
				
				float4 _DistortionArgs;
				sampler2D _DistortionTexture;
				
				fixed4 _MainColor;
				half _ColorMultiplier;
				half _Dissolve;
				
				float _MinX;
                float _MaxX;
                float _MinY;
                float _MaxY;
				
				uniform float4x4 CUSTOM_MATRIX_P;

				struct v2f 
				{
					float4 vertex : SV_POSITION;
					fixed4 color : TEXCOORD1;
					float4 texcoord : TEXCOORD0;
					float4 alphaUV : TEXCOORD2;
					float3 vpos : TEXCOORD3;
				};
				 
				float4 _MainTex_ST;
				float4 _AlphaTex_ST;
				float4 _DissolveTexture_ST;
				float _PushSize;
				float _Rotate;
				float _AlphaRotate;
				float _DissolveBlend;




			
			half2 RotateUV(half2 uv,half uvRotate)
			{
				half2 outUV;
				half s;
				half c;
				s = sin(uvRotate);
				c = cos(uvRotate);
				
				outUV = uv - half2(0.5f, 0.5f);
				outUV = half2(outUV.x * c - outUV.y * s, outUV.x * s + outUV.y * c);
				outUV = outUV + half2(0.5f, 0.5f);
				return outUV;
			}
			
				v2f vert (appdata_full v)
				{
					v2f o;
					
					float4 tempV = v.vertex; 
					if (_PushSize >0.001)
					{
						tempV.xyz = normalize(v.normal.xyz) * _PushSize;
						tempV.xyz += v.vertex.xyz;
					}
					o.vertex = UnityObjectToClipPos(tempV);

					
					//o.vertex = mul(UNITY_MATRIX_MVP, v.vertex);
					o.color = v.color;

					#if VertexColor_Off
						o.color = 1;
					#endif
					
					o.alphaUV.xy = TRANSFORM_TEX(v.texcoord,_AlphaTex);
					o.alphaUV.zw = TRANSFORM_TEX(v.texcoord,_DissolveTexture);
					o.texcoord.xy = TRANSFORM_TEX(v.texcoord,_MainTex);
					
					o.texcoord.xy = RotateUV(o.texcoord.xy,_Rotate/57.2957796);
					o.alphaUV.xy = RotateUV(o.alphaUV.xy,_AlphaRotate/57.2957796);	
					o.texcoord.zw = float2(0,0);
					#if Sphere_On
						half4 reflectTexCoord = mul( UNITY_MATRIX_MV, half4(v.normal.xyz,0));
						reflectTexCoord.xyz = normalize(reflectTexCoord.xyz);
						o.texcoord.zw = reflectTexCoord.xy * 0.5f + 0.5f;
					#endif
					
					o.vpos = UnityObjectToClipPos(v.vertex);
					
					return o;
				}

				fixed4 frag (v2f i) : SV_Target
				{
					float2 inputUV = i.texcoord.xy;
					
					#if Distortion_On
						half distortion	= tex2D(_DistortionTexture, i.texcoord.xy + _Time.y * _DistortionArgs.w * _DistortionArgs.xy).r * _DistortionArgs.z ;
						inputUV = i.texcoord.xy + distortion * _DistortionArgs.xy ;
					#endif
					
					fixed4 alphaTexColor = tex2D(_AlphaTex, i.alphaUV.xy);
					fixed4 texColor =  tex2D(_MainTex, inputUV);
					texColor.a *= alphaTexColor.r;
					
					fixed4 result = _MainColor * texColor  * i.color;
					
					#if Dissolve_On
						fixed4 alphaDissolve = tex2D(_DissolveTexture, i.alphaUV.zw);
						float t = max(_Dissolve,(1 - i.color.a));
						//result.a *= smoothstep( t,t + 0.05,alphaDissolve.r  * i.color.a * result.a);
						//result.a *= (alphaDissolve.r - _Dissolve - (1-i.color.a)) * i.color.a;
						fixed2 dissolveValues;
						dissolveValues.x = smoothstep( t,t + 0.05,alphaDissolve.r  * i.color.a * result.a);
						dissolveValues.y = (alphaDissolve.r - _Dissolve - (1-i.color.a)) * i.color.a;
						result.a *= lerp(dissolveValues.x,dissolveValues.y,_DissolveBlend);
					#endif
					
					
					#if Sphere_On
						fixed4 sphereColor = tex2D (_SphereTex,i.texcoord.zw);
						fixed4 sphereMaskColor = tex2D(_SphereMaskTex,i.texcoord.zw);
						sphereColor.a = sphereMaskColor.x;
						result *= sphereColor * i.color.a;
					#endif
					
					#if Clip_On
					result.a *= (i.vpos.x >= _MinX );
					result.a *= (i.vpos.x <= _MaxX);
					result.a *= (i.vpos.y >= _MinY );
					result.a *= (i.vpos.y <= _MaxY);
					#endif
				
					//return fixed4(i.alphaUV.zw,1,1);	
					result.rgb *= _ColorMultiplier;
					return result;
				}
				ENDCG 
			}
		}
	}
//Fallback "Mobile/Particles/Alpha Blended"
CustomEditor "ParticleTransparentMaterialEditor"
}
