using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FFTweenRotationRound : FFTweenBase
{
    public Vector3 speed;
    private Transform t;
    private Quaternion defaultQ;
    protected override void FFEnable()
    {
        if (t == null)
        {
            t = transform;
            defaultQ = t.localRotation;
        }
        else
        {
            t.localRotation = defaultQ;
        }
    }

    protected override void FFUpdate(float eval)
    {
        t.localRotation = Quaternion.Euler(defaultQ.eulerAngles + speed * eval);
    }
}