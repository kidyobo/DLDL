Shader "Game/Effect/ScreenDark"
{
	Properties
	{
		_MainTex("texture", 2D) = "black"{}
		_MaskTex("mask", 2D) = "black"{}
		_AddColor("_AddColor", Color) = (1,1,1,1)
		_lightFactor("_lightFactor",float) = 1
		_fadeFactor("_fadeFactor",float) = 1
	}

		CGINCLUDE
#include "UnityCG.cginc"  
		uniform sampler2D _MainTex;
		uniform sampler2D _MaskTex;
	uniform float _lightFactor;
	uniform float _fadeFactor;
	uniform half4 _AddColor;
	fixed4 frag(v2f_img i) :SV_Target
	{
		half4 col = tex2D(_MainTex, i.uv)+_AddColor*_fadeFactor;
		half4 maskcol = tex2D(_MaskTex, i.uv);
		half add= (maskcol.r+_lightFactor*maskcol.b)+(1- _fadeFactor);
		if (add > 1) {
			add = 1;
		}
		return col*add;
	}
		ENDCG
		SubShader {
		Pass{
			Cull Off
			ZWrite Off
			Fog{ Mode off }
			CGPROGRAM
			#pragma vertex vert_img
			#pragma fragment frag
			#pragma fragmentoption ARB_precision_hint_fastest
			ENDCG
		}
	}
	Fallback off
}