using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FFTweenPosition : FFTweenBase
{

    public Vector3 from;
    public Vector3 to;
    private Transform t;
    protected override void FFEnable()
    {
        if (t == null)
        {
            t = transform;
        }
        t.localPosition = from;
    }

    protected override void FFUpdate(float eval)
    {
        t.localPosition = Vector3.LerpUnclamped(from, to, eval);
    }
#if UNITY_EDITOR
    void OnDrawGizmosSelected()
    {
        Vector3 newfrom = transform.parent ? transform.parent.TransformPoint(from) : from;
        Vector3 newto = transform.parent ? transform.parent.TransformPoint(to) : to;
        Gizmos.color = Color.yellow;
        Gizmos.DrawLine(newfrom, newto);

        Gizmos.color = Color.green;
        Gizmos.DrawSphere(newfrom, 0.1f);

        Gizmos.color = Color.red;
        Gizmos.DrawSphere(newto, 0.1f);
    }
#endif
}
