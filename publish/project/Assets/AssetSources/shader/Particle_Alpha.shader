// Simplified Alpha Blended Particle shader. Differences from regular Alpha Blended Particle one:
// - no Tint color
// - no Smooth particle support
// - no AlphaTest
// - no ColorMask

Shader "Game/Particles/Alpha Blended" {
	Properties{
		_MainTex("Particle Texture", 2D) = "white" {}
	}

		Category{
			Tags { "Queue" = "Transparent+1" "IgnoreProjector" = "True" "RenderType" = "Transparent" }
			Blend SrcAlpha OneMinusSrcAlpha
			Cull Off Lighting Off ZWrite Off

			BindChannels {
				Bind "Color", color
				Bind "Vertex", vertex
				Bind "TexCoord", texcoord
			}

			SubShader{
			Pass{
			CGPROGRAM
		#pragma multi_compile_fog
		#pragma vertex vert
		#pragma fragment frag

		#include "UnityCG.cginc"

			struct appdata_t {
			float4 vertex : POSITION;
			fixed4 color : COLOR;
			float2 texcoord : TEXCOORD0;
		};

		struct v2f {
			float4 vertex : SV_POSITION;
			fixed4 color : COLOR;
			half2 texcoord : TEXCOORD0;
			UNITY_FOG_COORDS(2)
		};

		sampler2D _MainTex;
		float4 _MainTex_ST;

		v2f vert(appdata_t v)
		{
			v2f o;
			o.vertex = UnityObjectToClipPos(v.vertex);
			o.texcoord = TRANSFORM_TEX(v.texcoord, _MainTex);
			o.color = v.color;
			UNITY_TRANSFER_FOG(o, o.vertex);
			return o;
		}

		fixed4 frag(v2f i) : SV_Target
		{
			fixed4 color = tex2D(_MainTex, i.texcoord)*i.color;
		UNITY_APPLY_FOG(i.fogCoord, color);
		return color;
		}
		ENDCG
		}
		}
	}
}
