// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

// Upgrade NOTE: replaced '_Object2World' with 'unity_ObjectToWorld'

// Shader created with Shader Forge v1.30 
// Shader Forge (c) Neat Corporation / Joachim Holmer - http://www.acegikmo.com/shaderforge/
// Note: Manually altering this data may prevent you from opening it in Shader Forge
/*SF_DATA;ver:1.30;sub:START;pass:START;ps:flbk:,iptp:0,cusa:False,bamd:0,lico:1,lgpr:1,limd:1,spmd:1,trmd:0,grmd:0,uamb:True,mssp:True,bkdf:False,hqlp:False,rprd:False,enco:False,rmgx:True,rpth:0,vtps:0,hqsc:True,nrmq:1,nrsp:0,vomd:0,spxs:False,tesm:0,olmd:1,culm:0,bsrc:0,bdst:1,dpts:2,wrdp:True,dith:0,rfrpo:True,rfrpn:Refraction,coma:15,ufog:True,aust:True,igpj:False,qofs:0,qpre:1,rntp:1,fgom:False,fgoc:False,fgod:False,fgor:False,fgmd:0,fgcr:0.5,fgcg:0.5,fgcb:0.5,fgca:1,fgde:0.01,fgrn:0,fgrf:300,stcl:False,stva:128,stmr:255,stmw:255,stcp:6,stps:0,stfa:0,stfz:0,ofsf:0,ofsu:0,f2p0:False,fnsp:False,fnfb:False;n:type:ShaderForge.SFN_Final,id:4013,x:33035,y:32700,varname:node_4013,prsc:2|emission-9397-OUT;n:type:ShaderForge.SFN_Tex2d,id:6937,x:32236,y:32917,ptovrint:False,ptlb:node_6937,ptin:_node_6937,varname:node_6937,prsc:2,glob:False,taghide:False,taghdr:False,tagprd:False,tagnsco:False,tagnrm:False,tex:3649604cb405382498980f788652c454,ntxv:0,isnm:False;n:type:ShaderForge.SFN_Fresnel,id:9692,x:32099,y:32647,varname:node_9692,prsc:2|EXP-29-OUT;n:type:ShaderForge.SFN_Multiply,id:3478,x:32318,y:32721,varname:node_3478,prsc:2|A-9692-OUT,B-6937-RGB;n:type:ShaderForge.SFN_Add,id:9397,x:32708,y:32785,varname:node_9397,prsc:2|A-9682-OUT,B-6937-RGB;n:type:ShaderForge.SFN_Multiply,id:9682,x:32628,y:32640,varname:node_9682,prsc:2|A-324-RGB,B-307-OUT;n:type:ShaderForge.SFN_Color,id:324,x:32589,y:32395,ptovrint:False,ptlb:node_324,ptin:_node_324,varname:node_324,prsc:2,glob:False,taghide:False,taghdr:False,tagprd:False,tagnsco:False,tagnrm:False,c1:1,c2:0.7255578,c3:0.5147059,c4:1;n:type:ShaderForge.SFN_Multiply,id:307,x:32420,y:32567,varname:node_307,prsc:2|A-6068-OUT,B-3478-OUT;n:type:ShaderForge.SFN_Slider,id:29,x:31738,y:32744,ptovrint:False,ptlb:node_29,ptin:_node_29,varname:node_29,prsc:2,glob:False,taghide:False,taghdr:False,tagprd:False,tagnsco:False,tagnrm:False,min:0,cur:5.012991,max:10;n:type:ShaderForge.SFN_ValueProperty,id:2766,x:31758,y:32520,ptovrint:False,ptlb:node_2766,ptin:_node_2766,varname:node_2766,prsc:2,glob:False,taghide:False,taghdr:False,tagprd:False,tagnsco:False,tagnrm:False,v1:0;n:type:ShaderForge.SFN_Slider,id:6068,x:32020,y:32454,ptovrint:False,ptlb:node_6068,ptin:_node_6068,varname:node_6068,prsc:2,glob:False,taghide:False,taghdr:False,tagprd:False,tagnsco:False,tagnrm:False,min:0,cur:10,max:100;proporder:6937-324-29-6068;pass:END;sub:END;*/

Shader "Shader Forge/fnl_zidan" {
    Properties {
        _node_6937 ("node_6937", 2D) = "white" {}
        _node_324 ("node_324", Color) = (1,0.7255578,0.5147059,1)
        _node_29 ("node_29", Range(0, 10)) = 5.012991
        _node_6068 ("node_6068", Range(0, 100)) = 10
    }
    SubShader {
        Tags {
            "RenderType"="Opaque"
        }
        Pass {
            Name "FORWARD"
            Tags {
                "LightMode"="ForwardBase"
            }
            
            
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #define UNITY_PASS_FORWARDBASE
            #include "UnityCG.cginc"
            #pragma multi_compile_fwdbase_fullshadows
            #pragma multi_compile_fog
            #pragma exclude_renderers gles3 metal d3d11_9x xbox360 xboxone ps3 ps4 psp2 
            #pragma target 3.0
            uniform sampler2D _node_6937; uniform float4 _node_6937_ST;
            uniform float4 _node_324;
            uniform float _node_29;
            uniform float _node_6068;
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
                UNITY_FOG_COORDS(3)
            };
            VertexOutput vert (VertexInput v) {
                VertexOutput o = (VertexOutput)0;
                o.uv0 = v.texcoord0;
                o.normalDir = UnityObjectToWorldNormal(v.normal);
                o.posWorld = mul(unity_ObjectToWorld, v.vertex);
                o.pos = UnityObjectToClipPos(v.vertex );
                UNITY_TRANSFER_FOG(o,o.pos);
                return o;
            }
            float4 frag(VertexOutput i) : COLOR {
                i.normalDir = normalize(i.normalDir);
                float3 viewDirection = normalize(_WorldSpaceCameraPos.xyz - i.posWorld.xyz);
                float3 normalDirection = i.normalDir;
////// Lighting:
////// Emissive:
                float4 _node_6937_var = tex2D(_node_6937,TRANSFORM_TEX(i.uv0, _node_6937));
                float3 emissive = ((_node_324.rgb*(_node_6068*(pow(1.0-max(0,dot(normalDirection, viewDirection)),_node_29)*_node_6937_var.rgb)))+_node_6937_var.rgb);
                float3 finalColor = emissive;
                fixed4 finalRGBA = fixed4(finalColor,1);
                UNITY_APPLY_FOG(i.fogCoord, finalRGBA);
                return finalRGBA;
            }
            ENDCG
        }
    }
    FallBack "Diffuse"
    CustomEditor "ShaderForgeMaterialInspector"
}
