using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TweenFov : UITweener {
    public float from = 1f;
    public float to = 1f;
    Camera c;

    public float value { get { return c.fieldOfView; } set { c.fieldOfView = value; } }

    /// <summary>
    /// Tween the value.
    /// </summary>

    protected override void OnUpdate(float factor, bool isFinished) { value = Mathf.LerpUnclamped(from, to, factor); }
    /// <summary>
    /// Start the tweening operation.
    /// </summary>

    static public TweenFov Begin(Camera c, float time,float from, float to)
    {
        TweenFov comp = UITweener.Begin<TweenFov>(c.gameObject, time);
        comp.c = c;
        comp.from = from;
        comp.to = to;
        if (time <= 0f)
        {
            comp.Sample(1f, true);
            comp.enabled = false;
        }
        return comp;
    }

    [ContextMenu("Set 'From' to current value")]
    public override void SetStartToCurrentValue() { from = value; }

    [ContextMenu("Set 'To' to current value")]
    public override void SetEndToCurrentValue() { to = value; }

    [ContextMenu("Assume value of 'From'")]
    void SetCurrentValueToStart() { value = from; }

    [ContextMenu("Assume value of 'To'")]
    void SetCurrentValueToEnd() { value = to; }
}