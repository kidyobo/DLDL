﻿// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "Game/Effect/Water"
{
	Properties{
		_MainTex("texture", 2D) = "black"{}
		_Alpha("Alpha", Range(0,1)) = 1
	}
		SubShader{
		Tags{ "QUEUE" = "Transparent" "IGNOREPROJECTOR" = "true" "RenderType" = "Opaque" }
		Cull Off
		Lighting Off
		Blend SrcAlpha OneMinusSrcAlpha
		LOD 100
		Pass{
		ZTest Greater
		ZWrite Off
		Cull Back
		CGPROGRAM
#pragma vertex vert
#pragma fragment frag
#include "UnityCG.cginc"
		sampler2D _MainTex;
	fixed4 _MainTex_ST;
	fixed _Alpha;
	struct vIn {
		half4 vertex:POSITION;
		float2 texcoord:TEXCOORD0;
		fixed4 color : COLOR;
	};
	struct vOut {
		half4 pos:SV_POSITION;
		float2 uv:TEXCOORD0;
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
		half4 col = tex2D(_MainTex, i.uv);
		col.a *= 0.2;
		return col;
	}
		ENDCG
	}

		Pass{
		ZTest LEqual
		CGPROGRAM
#pragma vertex vert
#pragma fragment frag
#include "UnityCG.cginc"
		sampler2D _MainTex;
	fixed4 _MainTex_ST;
	fixed _Alpha;
	struct vIn {
		half4 vertex:POSITION;
		float2 texcoord:TEXCOORD0;
		fixed4 color : COLOR;
	};
	struct vOut {
		half4 pos:SV_POSITION;
		float2 uv:TEXCOORD0;
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
		half4 col = tex2D(_MainTex, i.uv);
		col.a *= _Alpha;
		return col;
	}
		ENDCG
	}
		}
}