Shader "Game/Model_WH" {
    Properties {
        _DiffuseMap ("DiffuseMap", 2D) = "white" {}
        _EffectMap ("EffectMap", 2D) = "white" {}
        _RimPower ("RimPower", Float ) = 2
        _AlphaPower ("AlphaPower", Float ) = 2
        [HDR]_RimColor ("RimColor", Color) = (1,0.6827586,0,1)
        [HideInInspector]_Cutoff ("Alpha cutoff", Range(0,1)) = 0.5
    }
    SubShader {
        Tags {
            "IgnoreProjector"="True"
            "Queue"="Transparent+2"
            "RenderType"="Transparent"
        }

        Pass {
            ZWrite On
			ColorMask 0
            }
		
        Pass {
            Name "FORWARD"
            Tags {
                "LightMode"="ForwardBase"
            }
            Blend SrcAlpha OneMinusSrcAlpha
            ZWrite Off
            
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #define UNITY_PASS_FORWARDBASE
            #include "UnityCG.cginc"
            #pragma multi_compile_fwdbase
            #pragma multi_compile_fog
            #pragma only_renderers d3d9 d3d11 glcore gles gles3 metal d3d11_9x 
            #pragma target 3.0
            uniform sampler2D _DiffuseMap; uniform float4 _DiffuseMap_ST;
            uniform float _RimPower;
            uniform sampler2D _EffectMap; uniform float4 _EffectMap_ST;
            uniform float _AlphaPower;
            uniform float4 _RimColor;
            struct VertexInput {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float2 texcoord0 : TEXCOORD0;
            };
            struct VertexOutput {
                float4 pos : SV_POSITION;
                float2 uv0 : TEXCOORD0;
                float4 posWorld : TEXCOORD1;
                float3 normalDir : TEXCOORD2;
                float4 projPos : TEXCOORD3;
                UNITY_FOG_COORDS(4)
            };
            VertexOutput vert (VertexInput v) {
                VertexOutput o = (VertexOutput)0;
                o.uv0 = v.texcoord0;
                o.normalDir = UnityObjectToWorldNormal(v.normal);
                o.posWorld = mul(unity_ObjectToWorld, v.vertex);
                o.pos = UnityObjectToClipPos( v.vertex );
                UNITY_TRANSFER_FOG(o,o.pos);
                o.projPos = ComputeScreenPos (o.pos);
                COMPUTE_EYEDEPTH(o.projPos.z);
                return o;
            }
            float4 frag(VertexOutput i) : COLOR {
                i.normalDir = normalize(i.normalDir);
                float3 viewDirection = normalize(_WorldSpaceCameraPos.xyz - i.posWorld.xyz);
                float3 normalDirection = i.normalDir;
                float partZ = max(0,i.projPos.z - _ProjectionParams.g);
////// Lighting:
////// Emissive:
                float4 node_8103 = _Time;
                float2 node_470 = (i.uv0+node_8103.g*float2(0.1,0.1));
                float4 _EffectMap_var = tex2D(_EffectMap,TRANSFORM_TEX(node_470, _EffectMap));
                float4 _DiffuseMap_var = tex2D(_DiffuseMap,TRANSFORM_TEX(i.uv0, _DiffuseMap));
                float3 emissive = saturate((saturate((_EffectMap_var.rgb+_DiffuseMap_var.rgb))/(1.0-saturate((partZ*(length(pow(1.0-max(0,dot(i.normalDir, viewDirection)),_RimPower))*_RimColor.rgb))))));
                float3 finalColor = emissive;
                fixed4 finalRGBA = fixed4(finalColor,(_DiffuseMap_var.a+length(pow(1.0-max(0,dot(i.normalDir, viewDirection)),_AlphaPower))));
                UNITY_APPLY_FOG(i.fogCoord, finalRGBA);
                return finalRGBA;
            }
            ENDCG
        }
    }
    FallBack "Diffuse"
}
