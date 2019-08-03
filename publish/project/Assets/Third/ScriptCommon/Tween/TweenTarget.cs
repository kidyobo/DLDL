//----------------------------------------------
//            NGUI: Next-Gen UI kit
// Copyright © 2011-2015 Tasharen Entertainment
//----------------------------------------------

using UnityEngine;

/// <summary>
/// Tween the object's position to the moving target's position.
/// </summary>

[AddComponentMenu("UIExtend/Tween/Tween Target")]
public class TweenTarget : UITweener
{
    public Vector3 from;
    public Transform targetTrans;

    [HideInInspector]
    public bool worldSpace = false;

    Transform mTrans;

    public Transform cachedTransform { get { if (mTrans == null) mTrans = transform; return mTrans; } }

    [System.Obsolete("Use 'value' instead")]
    public Vector3 position { get { return this.value; } set { this.value = value; } }

    /// <summary>
    /// Tween's current value.
    /// </summary>

    public Vector3 value
    {
        get
        {
            return worldSpace ? cachedTransform.position : cachedTransform.localPosition;
        }
        set
        {
            if (worldSpace) cachedTransform.position = value;
            else cachedTransform.localPosition = value;
        }
    }

    /// <summary>
    /// Tween the value.
    /// </summary>

    protected override void OnUpdate(float factor, bool isFinished)
    {
        if (worldSpace)
        {
            cachedTransform.position = from * (1f - factor) + targetTrans.position * factor;
        }
        else
        {
            cachedTransform.localPosition = from * (1f - factor) + targetTrans.localPosition * factor;
        }
    }

    /// <summary>
    /// Start the tweening operation.
    /// </summary>

    static public TweenTarget Begin(GameObject go, float duration, Transform targetTrans)
    {
        TweenTarget comp = UITweener.Begin<TweenTarget>(go, duration);
        comp.from = comp.value;
        comp.targetTrans = targetTrans;

        if (duration <= 0f)
        {
            comp.Sample(1f, true);
            comp.enabled = false;
        }
        return comp;
    }

    /// <summary>
    /// Start the tweening operation.
    /// </summary>

    static public TweenTarget Begin(GameObject go, float duration, Transform targetTrans, bool worldSpace)
    {
        TweenTarget comp = UITweener.Begin<TweenTarget>(go, duration);
        comp.worldSpace = worldSpace;
        comp.from = comp.value;
        comp.targetTrans = targetTrans;

        if (duration <= 0f)
        {
            comp.Sample(1f, true);
            comp.enabled = false;
        }
        return comp;
    }

    [ContextMenu("Set 'From' to current value")]
    public override void SetStartToCurrentValue() { from = value; }

    //[ContextMenu("Set 'To' to current value")]
    public override void SetEndToCurrentValue() { }

    [ContextMenu("Assume value of 'From'")]
    void SetCurrentValueToStart() { value = from; }

    //[ContextMenu("Assume value of 'To'")]
    void SetCurrentValueToEnd() { }
}
