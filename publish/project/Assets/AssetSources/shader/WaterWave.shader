Shader "Game/Effect/WaterWave"
{
	Properties
	{
		_MainTex("texture", 2D) = "black"{}
		_distanceFactor("_distanceFactor",float) = 4
		_timeFactor("_timeFactor",float) = 20
		_totalFactor("_totalFactor",float) = 3
		_waveWidth("_waveWidth",float) = 0.6
		_waveSpeed("_waveSpeed",float) = 1
	}

		CGINCLUDE
#include "UnityCG.cginc"  
	uniform sampler2D _MainTex;
	uniform float _distanceFactor;
	uniform float _timeFactor;
	uniform float _totalFactor;
	uniform float _waveWidth;
	uniform float _curWaveDis;
	uniform float _waveSpeed;
	uniform float _x;
	uniform float _y;
	fixed4 frag(v2f_img i) :SV_Target
	{
		float2 dv = float2(_x, _y) - i.uv;
		dv = dv * float2(_ScreenParams.x / _ScreenParams.y, 1);
		float dis = sqrt(dv.x * dv.x + dv.y * dv.y);
		float sinFactor = sin(dis * _distanceFactor + _Time.y * _timeFactor) * _totalFactor * 0.01;
		float discardFactor = clamp(_waveWidth - abs(_curWaveDis*_waveSpeed - dis), 0, 1);
		float2 dv1 = normalize(dv);
		float2 offset = dv1  * sinFactor * discardFactor;
		float2 uv = offset + i.uv;
		return tex2D(_MainTex, uv);
	}
		ENDCG
		SubShader {
		Pass{
			ZTest Always
			Cull Off
			ZWrite Off
			Fog{Mode off}
			CGPROGRAM
			#pragma vertex vert_img
			#pragma fragment frag
			#pragma fragmentoption ARB_precision_hint_fastest
			ENDCG
		}
	}
	Fallback off
}