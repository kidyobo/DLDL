//----------------------------------------------
//            NGUI: Next-Gen UI kit
// Copyright © 2011-2015 Tasharen Entertainment
//----------------------------------------------

using UnityEngine;

/// <summary>
/// Tween the object's position.
/// </summary>
public class TweenPath : UITweener
{
    private Vector3[] path;
    public Vector3[] wholePath
    {
        get
        {
            return path;
        }
    }
    private int index = 0;
    public int pathIndex
    {
        get
        {
            return this.index;
        }
    }
    private Vector3 from;
    private Vector3 to;
    public Vector3 To
    {
        get
        {
            return this.to;
        }
    }
    /// <summary>
    /// 跳跃高度，0表示不跳跃。
    /// </summary>
    float jumpHeight;
    private float speed = 1;
    public float Speed
    {
        set
        {
            if (speed != value)
            {
                speed = value;
                duration = value;
                this.UpdateDirection(from, to);
            }
        }
        get
        {
            return speed;
        }
    }
    GameObject rotateObj = null;

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
            return cachedTransform.position;
        }
        set
        {
            if (jumpHeight == 0)
            {
                cachedTransform.position = ThreeDTools.GetNavYValue(value.x, value.z);
            }
            else
            {
                cachedTransform.position = value;
            }
        }
    }

    private float approachDistanceInWorld = 0;
    private float destXInPixel = 0;
    private float destYInPixel = 0;
    public AnimationCurve jumpHeightCurve = null;
    public AnimationCurve jumpMoveCurve = null;
    /// <summary>
    /// Event delegates called when the animation approach destination.
    /// </summary>
    [HideInInspector]
    public System.Action<float> onApproach = null;
    /// <summary>
    /// Tween the value.
    /// </summary>

    protected override void OnUpdate(float factor, bool isFinished)
    {
        Vector3 cache = Vector3.zero;
        if (0 != jumpHeight)
        {
            var heightFactor = jumpHeightCurve == null ? factor : jumpHeightCurve.Evaluate(factor);
            float yOffset = jumpHeight * heightFactor;
            if (isFinished)
            {
                yOffset = 0;
            }

            if (null != rotateObj)
            {
                rotateObj.transform.localPosition = new Vector3(0, yOffset, 0);
            }
            var moveFactor = jumpMoveCurve == null ? factor : jumpMoveCurve.Evaluate(factor);
            cache = from * (1f - moveFactor) + to * moveFactor;
        }
        else
        {
            cache = from * (1f - factor) + to * factor;
        }
        if (isFinished)
        {
            int pathLen = path.Length;
            if (++index >= pathLen)
            {
                var p = path[pathLen - 1];
                cache = ThreeDTools.GetNavYValue(p.x, p.z);
            }
            else
            {
                this.from = this.to;
                this.to = ThreeDTools.GetNavYValue(path[index].x, path[index].z);
                this.UpdateDirection(from, to);

                this.tweenFactor = 0;
                this.enabled = true;
            }
        }
        value = cache;
        if (!isFinished && null != this.onApproach && this.approachDistanceInWorld > 0)
        {
            float x = cache.x;
            float y = cache.z;
            float distance = Mathf.Sqrt(Mathf.Pow(x - this.destXInPixel, 2) + Mathf.Pow(y - this.destYInPixel, 2));
            if (distance <= this.approachDistanceInWorld)
            {
                var cacheApproach = this.onApproach;
                this.onApproach = null;
                cacheApproach(distance);
            }
        }
    }

    /// <summary>
    /// Start the tweening operation.
    /// </summary>

    static public TweenPath Begin(GameObject moveObj, GameObject rotateObj, float speed, Vector3[] path, float jumpHeight, float delay, float approachDistanceInWorld)
    {
        TweenPath comp = UITweener.Begin<TweenPath>(moveObj, speed);
        comp.index = 0;
        comp.from = comp.value;
        comp.path = path;
        comp.speed = speed;
        comp.rotateObj = rotateObj;
        comp.jumpHeight = jumpHeight;
        comp.delay = delay;
        comp.timeScaled = false;
        comp.approachDistanceInWorld = approachDistanceInWorld;
        Vector3 dest = path[path.Length - 1];
        comp.destXInPixel = dest.x;
        comp.destYInPixel = dest.z;
        var length = path.Length;
        if (length > 0)
        {
            comp.to = ThreeDTools.GetNavYValue(path[0].x, path[0].z);
            comp.UpdateDirection(comp.from, comp.to);
        }
        if (length == 0 || speed <= 0f)
        {
            comp.Sample(1f, true);
            comp.enabled = false;
        }
        return comp;
    }

    void UpdateDirection(Vector3 from, Vector3 to)
    {
        var direction = to - from;
        direction.y = 0;
        this.duration = direction.magnitude * speed;
        Vector3 pos = this.value;
        to.y = pos.y;
        var forward = to - pos;
        if (rotateObj != null && forward != Vector3.zero)
        {
            TweenRotation tween = TweenRotation.Begin(rotateObj, Vector3.Angle(rotateObj.transform.forward, forward) / 720, Quaternion.LookRotation(forward));
            tween.quaternionLerp = true;
        }
    }

    [ContextMenu("Set 'From' to current value")]
    public override void SetStartToCurrentValue() { from = value; }

    [ContextMenu("Set 'To' to current value")]
    public override void SetEndToCurrentValue() { to = value; }
}