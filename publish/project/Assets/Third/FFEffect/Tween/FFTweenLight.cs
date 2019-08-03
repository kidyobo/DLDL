using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FFTweenLight : FFTweenBase
{
    public float from = 0;
    public float to = 1;
    private Light lightc;
    protected override void FFEnable()
    {
        if (lightc == null)
        {
            lightc = GetComponent<Light>();
        }
        lightc.intensity = from;
    }

    protected override void FFUpdate(float eval)
    {
        lightc.intensity = Mathf.LerpUnclamped(from, to, eval);
    }
}