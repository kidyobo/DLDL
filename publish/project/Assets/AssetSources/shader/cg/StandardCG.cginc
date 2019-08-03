#pragma fragmentoption ARB_precision_hint_fastest

#include "UnityCG.cginc"
sampler2D _MainTex;

#if _NOISE_ON
sampler2D _MaskTex;
sampler2D _NoiseTex;
half _Scroll2X;
half _Scroll2Y;
float4 _NoiseTex_ST;
#endif

#if _LIGHT_ON
sampler2D _LightTex;
half _LightScale;
#endif

#if _RIM_ON
half4 _RimColor;
#endif

#if _CLIPALPHA
half _CutoffValue;
#endif

#if _DISSOLVE_ON
float _DissolveAmount;
sampler2D _DisolveGuide;
float4 _DisolveGuide_ST;
sampler2D _BurnRamp;
#endif

struct v2f
{
	float4 pos : SV_POSITION;
	half2 uv : TEXCOORD0;
	UNITY_FOG_COORDS(1)
#if _LIGHT_ON || _RIM_ON
	half3 normalVS: TEXCOORD2;
#endif

#if _RIM_ON
	half3 viewDir : TEXCOORD3;
#endif
#if _NOISE_ON
	half2 uvEffect : TEXCOORD4;
#endif
};

v2f vert(appdata_base v)
{
	v2f o;
	o.pos = UnityObjectToClipPos(v.vertex);
	o.uv = v.texcoord;
#if _NOISE_ON
	o.uvEffect = TRANSFORM_TEX(v.texcoord.xy, _NoiseTex) + frac(float2(_Scroll2X, _Scroll2Y) * _Time.x);
#endif
	
#if _LIGHT_ON || _RIM_ON
	o.normalVS = mul(UNITY_MATRIX_IT_MV, float4(v.normal, 0)).xyz;
#endif

#if _RIM_ON
	float3 worldPos = mul(unity_ObjectToWorld, v.vertex).xyz * 1.0;
	o.viewDir = mul(UNITY_MATRIX_V, float4(_WorldSpaceCameraPos.xyz - worldPos,0)).xyz;
#endif
	UNITY_TRANSFER_FOG(o, o.pos);
	return o;
}

fixed4 frag(v2f i) : COLOR0
{
	fixed4 color=tex2D(_MainTex,i.uv);

#if _CLIPALPHA
	clip(color.a - _CutoffValue);
#endif
#if _LIGHT_ON
	half2 uv = normalize(i.normalVS).xy * 0.5 + 0.5;
	fixed4 light = tex2D(_LightTex,uv);
	color.rgb *= light.rgb * _LightScale;
#endif

#if _RIM_ON
	half rim = 1 - saturate(dot(normalize(i.viewDir), normalize(i.normalVS)));
	rim = rim*_RimColor.a;
	color.rgb += _RimColor.rgb * rim;
#endif

#if _NOISE_ON
	fixed3 Mask = tex2D(_MaskTex, i.uv);
	fixed3 noise = Mask.g*tex2D(_NoiseTex, i.uvEffect).rgb;
	color.rgb += noise;
#endif

#if _DISSOLVE_ON
	float2 uv_DisolveGuide = i.uv * _DisolveGuide_ST.xy + _DisolveGuide_ST.zw;
	float temp_output_73_0 = ((-0.6 + ((1.0 - _DissolveAmount) - 0.0) * (0.6 - -0.6) / (1.0 - 0.0)) + tex2D(_DisolveGuide, uv_DisolveGuide).r);
	float clampResult113 = clamp((-4.0 + (temp_output_73_0 - 0.0) * (4.0 - -4.0) / (1.0 - 0.0)), 0.0, 1.0);
	float temp_output_130_0 = (1.0 - clampResult113);
	float2 appendResult115 = float2(temp_output_130_0, 0.0);
	color.rgb = color.rgb + (temp_output_130_0 * tex2D(_BurnRamp, appendResult115));
	clip(temp_output_73_0 - 0.5);
#endif

	UNITY_APPLY_FOG(i.fogCoord, color);
	return color;
}