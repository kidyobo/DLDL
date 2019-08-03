Shader "Game/Effect/RainLight"
{
	Properties
	{
		_MainTex("texture", 2D) = "black"{}
		_lightFactor("_lightFactor",float) = 1
	}

		CGINCLUDE
#include "UnityCG.cginc"  
		uniform sampler2D _MainTex;
	uniform float _lightFactor;
	fixed4 frag(v2f_img i) :SV_Target
	{
		half4 col = tex2D(_MainTex, i.uv)*_lightFactor;
		return col;
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