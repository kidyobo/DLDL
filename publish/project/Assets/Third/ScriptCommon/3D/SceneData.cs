using System.Collections;
using System.Collections.Generic;
using UnityEngine;
[DefaultExecutionOrder(-100)]
public class SceneData : MonoBehaviour {
    public static System.Action onAwake = null;
    public static SceneData instance;
    public short width;
    public short height;
    public Vector3 defaultPos;
    public bool enableDepth;
    void Awake()
    {
#if TEST
        if (Camera.main)
        {
            if (enableDepth)
            {
                Camera.main.depthTextureMode = DepthTextureMode.Depth;
            }
            else
            {
                Camera.main.depthTextureMode = DepthTextureMode.None;
            }
        }
#endif
        instance = this;
        if (onAwake != null)
        {
            onAwake();
        }
    }
}
