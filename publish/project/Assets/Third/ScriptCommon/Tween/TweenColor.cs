//----------------------------------------------
//            NGUI: Next-Gen UI kit
// Copyright © 2011-2015 Tasharen Entertainment
//----------------------------------------------

using UnityEngine;
using UnityEngine.UI;
/// <summary>
/// Tween the object's color.
/// </summary>

[AddComponentMenu("UIExtend/Tween/Tween Color")]
public class TweenColor : UITweener
{
	public Color from = Color.white;
	public Color to = Color.white;

	bool mCached = false;
    Graphic mGra;
    Material mMat;
	SpriteRenderer mSr;

	void Cache ()
	{
		mCached = true;
        mGra = GetComponent<Graphic>();
		if (mGra != null) return;

        mSr = GetComponent<SpriteRenderer>();
		if (mSr != null) return;

        Renderer ren = GetComponent<Renderer>();
        if (ren != null)
		{
			mMat = ren.material;
			return;
		}
	}

	[System.Obsolete("Use 'value' instead")]
	public Color color { get { return this.value; } set { this.value = value; } }

	/// <summary>
	/// Tween's current value.
	/// </summary>

	public Color value
	{
		get
		{
			if (!mCached) Cache();
            if (mGra != null) return mGra.color;
            if (mMat != null) return mMat.color;
			if (mSr != null) return mSr.color;
			return Color.black;
		}
		set
		{
			if (!mCached) Cache();
            if (mGra != null) mGra.color = value;
			else if (mMat != null) mMat.color = value;
			else if (mSr != null) mSr.color = value;
		}
	}

	/// <summary>
	/// Tween the value.
	/// </summary>

	protected override void OnUpdate (float factor, bool isFinished) { value = Color.Lerp(from, to, factor); }

	/// <summary>
	/// Start the tweening operation.
	/// </summary>

	static public TweenColor Begin (GameObject go, float duration, Color color)
	{
#if UNITY_EDITOR
		if (!Application.isPlaying) return null;
#endif
		TweenColor comp = UITweener.Begin<TweenColor>(go, duration);
		comp.from = comp.value;
		comp.to = color;

		if (duration <= 0f)
		{
			comp.Sample(1f, true);
			comp.enabled = false;
		}
		return comp;
	}

	[ContextMenu("Set 'From' to current value")]
	public override void SetStartToCurrentValue () { from = value; }

	[ContextMenu("Set 'To' to current value")]
	public override void SetEndToCurrentValue () { to = value; }

	[ContextMenu("Assume value of 'From'")]
	void SetCurrentValueToStart () { value = from; }

	[ContextMenu("Assume value of 'To'")]
	void SetCurrentValueToEnd () { value = to; }
}
