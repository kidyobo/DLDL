using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class ThreeDTools
{
    private static Vector3 rayDirection = Vector3.down;
    public static float rayDistance = 1000;
    public static float boxRayDistance = 5f;
    public static int sampleStep = 3;
    public static void PutOnNavMesh(Transform transform, float x, float y, float z)
    {
        transform.position = GetNavYValue(x, z);
    }
    public static void PutOnNavMesh(Transform transform, Vector3 v)
    {
        transform.position = GetNavYValue(v.x, v.z);
    }
    public static void PutOnNavMesh(Transform transform)
    {
        var p = transform.position;
        transform.position = GetNavYValue(p.x, p.z);
    }
    public static Vector3 GetNavYValue(float x, float z)
    {
        RaycastHit hitInfo;
        Vector3 value = new Vector3(x, rayDistance, z);
        if (Physics.Raycast(value, rayDirection, out hitInfo, rayDistance + 100, 1 << 9))
        {
            if (sampleStep > 0)
            {
                return GetNavYValueBySample(hitInfo.point, sampleStep);
            }
            else
            {
                return hitInfo.point;
            }
        }
        //点摄像可能拿不到点，那么就用BoxRay
        if (Physics.BoxCast(value, new Vector3(boxRayDistance, 0.01f, boxRayDistance), rayDirection, out hitInfo, Quaternion.identity, rayDistance + 100, 1 << 9))
        {
            if (sampleStep > 0)
            {
                return GetNavYValueBySample(hitInfo.point, sampleStep);
            }
            else
            {
                return hitInfo.point;
            }
        }
        return GetNavYValueBySample(new Vector3(x, 0, z), 1000);
    }
    public static Vector3 GetNavYValueBySample(Vector3 source, int size)
    {
        UnityEngine.AI.NavMeshHit hit;
        UnityEngine.AI.NavMesh.SamplePosition(source, out hit, size, -1);
        if (hit.hit)
        {
            return hit.position;
        }
        return source;
    }
    public static bool GetCacheNavYValueBySample(Vector3 source, int size, out Vector3 v3)
    {
        UnityEngine.AI.NavMeshHit hit;
        UnityEngine.AI.NavMesh.SamplePosition(source, out hit, size, -1);
        if (hit.hit)
        {
            v3 = hit.position;
            return true;
        }
        v3 = Vector3.zero;
        return false;
    }
}