// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "Game/Effect/Addtive"
{
	Properties{
		_MainTex("texture", 2D) = "black"{}
		_Alpha("Alpha", Range(0,1)) = 1
		_RGBOffset("RGBOffset", vector) = (1,1,1)
	}
		SubShader{
		Tags{ "QUEUE" = "Transparent+1" "IGNOREPROJECTOR" = "true" "RenderType" = "Transparent" }
		ZWrite Off
		Cull Off
		Lighting Off
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
	struct vIn {
		half4 vertex:POSITION;
		fixed2 texcoord : TEXCOORD0;
	};
	struct vOut {
		half4 pos:SV_POSITION;
		fixed2 uv : TEXCOORD0;
	};
	vOut vert(vIn v) {
		vOut o;
		o.pos = UnityObjectToClipPos(v.vertex);
		o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
		return o;
	}
	fixed4 frag(vOut i) :COLOR{
		half4 col = tex2D(_MainTex, i.uv);
		col.rgb *= _RGBOffset.xyz;
		col.a *=_Alpha;
		return col;
	}
		ENDCG
	}
	}
}