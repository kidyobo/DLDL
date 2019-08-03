// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "Game/Effect/RadialBlur" {
	Properties
	{
		_MainTex("纹理",2D) = "while"{}
		[HideInInspector]_Level("强度",Range(0,100)) = 10
	}
		SubShader{
		Pass
	{
		CGPROGRAM
#pragma vertex vert  
#pragma fragment frag  
#include "unitycg.cginc"

		sampler2D _MainTex;
	float _Level;

	struct v2f
	{
		fixed4 vertex: POSITION;
		fixed2 uv : TEXCOORD;
	};
	v2f vert(appdata_base v)
	{
		v2f o;
		o.vertex = UnityObjectToClipPos(v.vertex);
		o.uv = v.texcoord;
		return o;
	}
	fixed4 frag(v2f i) :COLOR
	{
		fixed4 c;
	fixed2 center = fixed2(0.5,0.5);
	fixed2 uv = i.uv - center;
	fixed3 c1 = fixed3(0,0,0);
	for (fixed j = 0; j<_Level; j++)
	{
		c1 += tex2D(_MainTex,uv*(1 - 0.01*j) + center).rgb;
	}
	c.rgb = c1 / _Level;
	c.a = 1;
	return c;
	}
		ENDCG
	}
	}
}