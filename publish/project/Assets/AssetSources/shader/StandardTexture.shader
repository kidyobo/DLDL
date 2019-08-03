// Unlit shader. Simplest possible textured shader.
// - SUPPORTS lightmap
// - no lighting
// - no per-material color

Shader "Game/StandardTexture" {
	Properties{
		_MainTex("Base (RGB)", 2D) = "white" {}
	}

		SubShader{
			Tags { "RenderType" = "Opaque" "QUEUE" = "AlphaTest+100" }
			LOD 100
		Lighting Off
		//ZWrite Off
		// Non-lightmapped
		Pass {
			SetTexture[_MainTex]
		}
	}
}