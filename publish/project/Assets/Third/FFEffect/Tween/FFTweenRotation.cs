using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FFTweenRotation : FFTweenBase
{

    public Vector3 from;
    public Vector3 to;
    public bool quaternionLerp = true;
    private Transform t;
    protected override void FFEnable()
    {
        if (t == null)
        {
            t = transform;
        }
        t.localRotation = Quaternion.Euler(from);
    }

    protected override void FFUpdate(float eval)
    {
        t.localRotation = quaternionLerp ? Quaternion.Slerp(Quaternion.Euler(from), Quaternion.Euler(to), eval) :
    Quaternion.Euler(new Vector3(
    Mathf.LerpUnclamped(from.x, to.x, eval),
    Mathf.LerpUnclamped(from.y, to.y, eval),
    Mathf.LerpUnclamped(from.z, to.z, eval)));
    }
}