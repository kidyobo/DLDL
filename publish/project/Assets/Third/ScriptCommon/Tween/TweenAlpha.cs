//----------------------------------------------
//            NGUI: Next-Gen UI kit
// Copyright © 2011-2015 Tasharen Entertainment
//----------------------------------------------

using UnityEngine;
using UnityEngine.UI;
/// <summary>
/// Tween the object's alpha. Works with both UI widgets as well as renderers.
/// </summary>

[AddComponentMenu("UIExtend/Tween/Tween Alpha")]
public class TweenAlpha : UITweener
{
    [Range(0f, 1f)] public float from = 1f;
    [Range(0f, 1f)] public float to = 1f;

    bool mCached = false;
    CanvasGroup mGroup;
    Graphic mGra;

    [System.Obsolete("Use 'value' instead")]
    public float alpha { get { return this.value; } set { this.value = value; } }

    void Cache()
    {
        mCached = true;
        mGroup = GetComponent<CanvasGroup>();
        if (mGroup == null)
        {
            mGra = GetComponent<Graphic>();
        }
    }

    /// <summary>
    /// Tween's current value.
    /// </summary>

    public float value
    {
        get
        {
            if (!mCached) Cache();
            if (mGra != null) return mGra.color.a;
            return mGroup != null ? mGroup.alpha : 1;
        }
        set
        {
            if (!mCached) Cache();
            else if (mGra != null)
            {
                Color c = mGra.color;
                c.a = value;
                mGra.color = c;
            }
            else if (mGroup != null)
            {
                mGroup.alpha = value;
            }
        }
    }

    /// <summary>
    /// Tween the value.
    /// </summary>

    protected override void OnUpdate(float factor, bool isFinished) { value = Mathf.Lerp(from, to, factor); }

    /// <summary>
    /// Start the tweening operation.
    /// </summary>

    static public TweenAlpha Begin(GameObject go, float duration, float alpha)
    {
        TweenAlpha comp = UITweener.Begin<TweenAlpha>(go, duration);
        comp.from = comp.value;
        comp.to = alpha;

        if (duration <= 0f)
        {
            comp.Sample(1f, true);
            comp.enabled = false;
        }
        return comp;
    }

    public override void SetStartToCurrentValue() { from = value; }
    public override void SetEndToCurrentValue() { to = value; }
}