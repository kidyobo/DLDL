using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public abstract class FFTweenBase : MonoBehaviour
{
    private float startTime;
    private bool canUpdate;
    private bool pingpong = false;
    private float sleepTime = 0;
    private int foreverTimes = 0;
    private float pauseTime;

    public AnimationCurve curve = AnimationCurve.Linear(0, 0, 1, 1);
    public float startDealy = 0;
    public float lifeTime = 1;
    public FFTweenStyle style = FFTweenStyle.Once;
    public System.Action onFinished = null;

    private void OnEnable()
    {
        startTime = Time.time + startDealy;
        canUpdate = true;
        sleepTime = startDealy;
        pingpong = false;
        foreverTimes = 0;
        FFEnable();
    }

    void Update()
    {
        if (sleepTime > 0)
        {
            sleepTime -= Time.deltaTime;
            return;
        }
        var time = Time.time - startTime;
        if (canUpdate)
        {
            var eval = lifeTime <= 0 ? 1 : pingpong ? curve.Evaluate(Mathf.Clamp01((lifeTime - time) / lifeTime)) : curve.Evaluate(Mathf.Clamp01(time / lifeTime));
            FFUpdate(foreverTimes + eval);

            if (time >= lifeTime)
            {
                switch (style)
                {
                    case FFTweenStyle.Once:
                        canUpdate = false;
                        if (onFinished != null)
                        {
                            onFinished();
                        }
                        break;
                    case FFTweenStyle.Loop:
                        startTime = Time.time;
                        break;
                    case FFTweenStyle.PingPong:
                        startTime = Time.time;
                        pingpong = !pingpong;
                        break;
                    case FFTweenStyle.Forever:
                        startTime = Time.time;
                        foreverTimes++;
                        break;
                }
            }
        }
    }
    protected abstract void FFEnable();
    protected abstract void FFUpdate(float eval);

    public void SetToStart()
    {
        this.OnEnable();
    }

    public void Pause()
    {
        this.canUpdate = false;
        this.pauseTime = Time.time;
    }

    public void Resume()
    {
        this.canUpdate = true;
        if (this.pauseTime > 0)
        {
            this.startTime = this.startTime + Time.time - this.pauseTime;
            this.pauseTime = 0;
        }
    }

    public void SetTime(float time)
    {
        if (startTime == 0)
        {
            this.OnEnable();
        }
        if (time >= lifeTime)
        {
            switch (style)
            {
                case FFTweenStyle.Once:
                    time = lifeTime;
                    break;
                case FFTweenStyle.Loop:
                    time = time % lifeTime;
                    break;
                case FFTweenStyle.PingPong:
                    if (((int)(time) % 2) == 1)
                    {
                        pingpong = true;
                    }
                    else
                    {
                        pingpong = false;
                    }
                    time = time % lifeTime;
                    break;
                case FFTweenStyle.Forever:
                    foreverTimes = (int)(time / lifeTime);
                    time = time % lifeTime;
                    break;
            }
        }
        var eval = lifeTime <= 0 ? 1 : pingpong ? curve.Evaluate(Mathf.Clamp01((lifeTime - time) / lifeTime)) : curve.Evaluate(Mathf.Clamp01(time / lifeTime));
        FFUpdate(foreverTimes + eval);
    }
}