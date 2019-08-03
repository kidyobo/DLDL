//----------------------------------------------
//            NGUI: Next-Gen UI kit
// Copyright © 2011-2015 Tasharen Entertainment
//----------------------------------------------
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

/// <summary>
/// Simple example script of how a button can be scaled visibly when the mouse hovers over it or it gets pressed.
/// </summary>
[AddComponentMenu("Component/UI/Effect/UIButtonScale"), DisallowMultipleComponent]
[RequireComponent(typeof(RectTransform))]
public class UIButtonScale : MonoBehaviour, IPointerUpHandler, IPointerDownHandler
{
    public GameObject tweenTarget;
    public Vector3 pressed = new Vector3(0.8f, 0.8f, 0.8f);
    public float duration = 0.15f;

    [Range(0, 1)]
    public float backDeltaFactor = 0.6f;

    Vector3 mScale;

    private float nextDuration = 0;

    public static AnimationCurve DownCurve = null;
    public AnimationCurve downCurve = null;

    public bool useCurve = true;
    public static AnimationCurve UpCurve = null;
    public AnimationCurve upCurve = null;

    void Start()
    {
        if (tweenTarget == null)
        {
            tweenTarget = gameObject;
        }
        mScale = tweenTarget.transform.localScale;
    }

    void OnDisable()
    {
        if (tweenTarget != null)
        {
            TweenScale tc = tweenTarget.GetComponent<TweenScale>();

            if (tc != null)
            {
                tc.value = mScale;
                tc.enabled = false;
            }
        }
    }

    [DonotWrap]
    public void OnPointerDown(PointerEventData eventData)
    {
        if (enabled)
        {
            if (tweenTarget != null)
            {
                this.CancelInvoke();
                TweenScale tween = TweenScale.Begin(tweenTarget, duration, Vector3.Scale(mScale, pressed));
                if(this.useCurve)
                {
                    tween.animationCurve = this.downCurve == null ? this.downCurve : UIButtonScale.DownCurve;
                }
            }
        }
    }
    [DonotWrap]
    public void OnPointerUp(PointerEventData eventData)
    {
        if (enabled)
        {
            if (tweenTarget != null)
            {
                var oldTween = tweenTarget.GetComponent<TweenScale>();
                if (oldTween.enabled)
                {
                    if (oldTween.tweenFactor < backDeltaFactor)
                    {
                        nextDuration = backDeltaFactor * this.duration;
                        this.Invoke("BackLateCall", (backDeltaFactor - oldTween.tweenFactor) * this.duration);
                    }
                    else
                    {
                        nextDuration = oldTween.tweenFactor * this.duration;
                        BackLateCall();
                    }
                }
                else
                {
                    nextDuration = duration;
                    BackLateCall();
                }
            }
        }
    }

    void BackLateCall()
    {
        TweenScale tween = TweenScale.Begin(tweenTarget, nextDuration, mScale);
        if(this.useCurve)
        {
            tween.animationCurve = this.upCurve == null ? this.upCurve : UIButtonScale.UpCurve;
        }
    }
}