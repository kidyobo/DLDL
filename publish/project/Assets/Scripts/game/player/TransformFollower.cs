using UnityEngine;
using System.Collections;

public class TransformFollower : MonoBehaviour
{
    Transform cacheTransform = null;
    /// <summary>
    /// 要跟随的目标
    /// </summary>
    public Transform target;
    /// <summary>
    /// 摄像机变换
    /// </summary>
    public Camera selfCamera = null;
    public Camera targetCamera = null;
    public Vector3 offset = Vector3.zero;
    public bool ignoreX = false;
    public bool ignoreY = false;
    public bool ignoreZ = false;
    void Awake()
    {
        cacheTransform = this.transform;
        LateUpdate();
    }
    // Update is called once per frame
    void LateUpdate()
    {
        if (target == null)
        {
            return;
        }
        Vector3 position = target.position + offset;
        if (selfCamera == null || targetCamera == null)
        {
            if (ignoreX)
            {
                position.x = 0;
            }
            if (ignoreY)
            {
                position.y = 0;
            }
            if (ignoreZ)
            {
                position.z = 0;
            }
            cacheTransform.position = position;
        }
        else
        {
            var cameraPos = targetCamera.WorldToScreenPoint(position);
            if (cameraPos.z <= 0)
            {
                position = new Vector3(-10000, -10000, -10000);
            }
            else
            {
                position = selfCamera.ScreenToWorldPoint(cameraPos);
                if (ignoreX)
                {
                    position.x = 0;
                }
                if (ignoreY)
                {
                    position.y = 0;
                }
                if (ignoreZ)
                {
                    position.z = 0;
                }
            }
            cacheTransform.position = position;
        }
    }
    public void ForceUpdate()
    {
        if (cacheTransform == null)
        {
            cacheTransform = this.transform;
        }
        LateUpdate();
    }
}