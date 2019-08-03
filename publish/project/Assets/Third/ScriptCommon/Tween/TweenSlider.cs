//----------------------------------------------
//            NGUI: Next-Gen UI kit
// Copyright © 2011-2015 Tasharen Entertainment
//----------------------------------------------

using UnityEngine;
using UnityEngine.UI;
/// <summary>
/// Tween the object's local scale.
/// </summary>

[AddComponentMenu("UIExtend/Tween/Tween Slider")]
public class TweenSlider : UITweener
{
    public  float from = 1f;
    public  float to = 1f;

    Slider slider;

    public Slider cachedSlider { get { if (slider == null) slider = this.GetComponent<Slider>(); return slider; } }

    public float value { get { return cachedSlider.value; } set { cachedSlider.value = value; } }

    /// <summary>
    /// Tween the value.
    /// </summary>

    protected override void OnUpdate(float factor, bool isFinished) { value = Mathf.Lerp(from, to, factor); }
    /// <summary>
    /// Start the tweening operation.
    /// </summary>

    static public TweenSlider Begin(GameObject go, float time,float fromValue, float endValue)
    {
        TweenSlider comp = UITweener.Begin<TweenSlider>(go, time);
        comp.from = fromValue;
        comp.to = endValue;
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
