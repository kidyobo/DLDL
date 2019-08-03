//----------------------------------------------
//            NGUI: Next-Gen UI kit
// Copyright © 2011-2015 Tasharen Entertainment
//----------------------------------------------

using UnityEngine;
using UnityEngine.UI;
/// <summary>
/// Tween the object's local scale.
/// </summary>

[AddComponentMenu("UIExtend/Tween/Tween Image Value")]
public class TweenImageFillAmount : UITweener
{
    public float from = 1f;
    public float to = 1f;


    Image image;

    public Image cachedImage { get { if (image == null) image = this.GetComponent<Image>(); return image; } }

    public float value { get { return cachedImage.fillAmount; } set { cachedImage.fillAmount = value; } }


    /// <summary>
    /// Tween the value.
    /// </summary>

    protected override void OnUpdate(float factor, bool isFinished) { value = Mathf.Lerp(from, to, factor); }
    /// <summary>
    /// Start the tweening operation.
    /// </summary>

    static public TweenImageFillAmount Begin(GameObject go, float time, float value)
    {
        TweenImageFillAmount comp = UITweener.Begin<TweenImageFillAmount>(go, time);
        comp.from = comp.value;
        comp.to = value;
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
