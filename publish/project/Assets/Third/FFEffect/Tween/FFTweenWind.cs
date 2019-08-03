using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FFTweenWind : FFTweenBase
{
    public float from = 0;
    public float to = 1;
    private WindZone windZone;
    protected override void FFEnable()
    {
        if (windZone == null)
        {
            windZone = GetComponent<WindZone>();
        }
        windZone.windMain = from;
    }

    protected override void FFUpdate(float eval)
    {
        windZone.windMain = Mathf.LerpUnclamped(from, to, eval);
    }
}
