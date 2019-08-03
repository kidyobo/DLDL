using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FFTweenBezierPosition : FFTweenBase
{
    public Vector3 from;
    public Vector3 to;
    public AnimationCurve jointCurve = AnimationCurve.Linear(0, 0, 1, 0);
    public Vector3 jointDirection = new Vector3(0, 10, 0);
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
        Vector3 targetPos = Vector3.LerpUnclamped(from, to, eval) + jointDirection * jointCurve.Evaluate(eval);
        t.localPosition = targetPos;
    }
#if UNITY_EDITOR
    void OnDrawGizmosSelected()
    {
        Vector3 newfrom = transform.parent ? transform.parent.TransformPoint(from) : from;
        Vector3 newto = transform.parent ? transform.parent.TransformPoint(to) : to;
        Gizmos.color = Color.yellow;
        Gizmos.DrawLine(newfrom, newto);
        Gizmos.color = Color.blue;
        Gizmos.DrawLine(newfrom, newfrom + jointDirection);

        Gizmos.color = Color.green;
        Gizmos.DrawSphere(newfrom, 0.1f);

        Gizmos.color = Color.red;
        Gizmos.DrawSphere(newto, 0.1f);
    }
#endif
}