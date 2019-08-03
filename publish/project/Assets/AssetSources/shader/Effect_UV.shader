// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "Game/Effect/UV"
{
	Properties{
		_MainTex("texture", 2D) = "black"{}
		[HideInInspector]_Alpha("Alpha", Range(0,1)) = 1
		_RGBOffset("RGBOffset", vector) = (0,0,0)
		_XSpeed("X Speed",Range(-10,10)) = 0
		_YSpeed("Y Speed",Range(-10,10)) = 0
	}
		SubShader{
		Tags{ "QUEUE" = "Transparent+1" "IGNOREPROJECTOR" = "true" "RenderType" = "Transparent" }
		Cull Off Lighting Off ZWrite Off Fog{ Color(0,0,0,0) }
		Blend SrcAlpha One
		LOD 100
		Pass{
		CGPROGRAM
#pragma vertex vert
#pragma fragment frag
#include "UnityCG.cginc"
		sampler2D _MainTex;
	fixed4 _MainTex_ST;
	fixed _Alpha;
	fixed4 _RGBOffset;
	fixed _XSpeed;
	fixed _YSpeed;
	struct vIn {
		half4 vertex:POSITION;
		fixed2 texcoord : TEXCOORD0;
		fixed4 color : COLOR;
	};
	struct vOut {
		half4 pos:SV_POSITION;
		fixed2 uv : TEXCOORD0;
		fixed4 color : COLOR;
	};
	vOut vert(vIn v) {
		vOut o;
		o.pos = UnityObjectToClipPos(v.vertex);
		o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
		o.color = v.color;
		return o;
	}
	fixed4 frag(vOut i) :COLOR{
		fixed2 value = frac(fixed2(_XSpeed*_Time.y, _YSpeed*_Time.y));
		half4 col = tex2D(_MainTex, i.uv + value)*i.color;
		col.rgb += _RGBOffset.xyz;
		col.a *= _Alpha;
		return col;
	}
		ENDCG
	}
		}
}