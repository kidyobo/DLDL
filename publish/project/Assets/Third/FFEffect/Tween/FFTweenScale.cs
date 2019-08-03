using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FFTweenScale : FFTweenBase
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
        t.localScale = from;
    }

    protected override void FFUpdate(float eval)
    {
        t.localScale = Vector3.LerpUnclamped(from, to, eval);
    }
}