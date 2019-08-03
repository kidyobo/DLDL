using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraEffect : MonoBehaviour
{
    public System.Action onRenderer = null;
    public Material material = null;
    void Awake()
    {
        this.enabled = false;
    }
    void OnRenderImage(RenderTexture source, RenderTexture destination)
    {
        if (material == null)
        {
            Graphics.Blit(source, destination);
        }
        else
        {
            if (onRenderer != null)
            {
                onRenderer();
            }
            Graphics.Blit(source, destination, material);
        }
    }
}