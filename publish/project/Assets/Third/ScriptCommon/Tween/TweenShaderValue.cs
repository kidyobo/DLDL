//----------------------------------------------
//            NGUI: Next-Gen UI kit
// Copyright © 2011-2015 Tasharen Entertainment
//----------------------------------------------

using UnityEngine;
using UnityEngine.UI;
/// <summary>
/// Tween the object's local scale.
/// </summary>

[AddComponentMenu("UIExtend/Tween/Tween Shader Value")]
public class TweenShaderValue : UITweener
{
    public float from = 1f;
    public float to = 1f;

    Material[] materials;
    string tweenName;
    float _value;

    public float value
    {
        get { return _value; }
        set
        {
            _value = value;
            if (materials != null)
            {
                for (int i = 0; i < materials.Length; i++)
                {
                    materials[i].SetFloat(tweenName, _value);
                }
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

    static public TweenShaderValue Begin(GameObject go, float time, Material[] materials, string tweenName, float fromValue, float endValue)
    {
        TweenShaderValue comp = UITweener.Begin<TweenShaderValue>(go, time);
        comp.from = fromValue;
        comp.to = endValue;
        comp.tweenName = tweenName;
        comp.materials = materials;
        if (time <= 0f)
        {
            comp.Sample(1f, true);
            comp.enabled = false;
        }
        return comp;
    }
    static public TweenShaderValue BeginSingle(GameObject go, float time, Material material, string tweenName, float fromValue, float endValue)
    {
        TweenShaderValue comp = UITweener.Begin<TweenShaderValue>(go, time);
        comp.from = fromValue;
        comp.to = endValue;
        comp.tweenName = tweenName;
        comp.materials = new Material[] { material };
        if (time <= 0f)
        {
            comp.Sample(1f, true);
            comp.enabled = false;
        }
        return comp;
    }
    static public TweenShaderValue BeginWithSkin(GameObject go, float time, string tweenName, float fromValue, float endValue)
    {
        TweenShaderValue comp = UITweener.Begin<TweenShaderValue>(go, time);
        comp.from = fromValue;
        comp.to = endValue;
        comp.tweenName = tweenName;
        var skinList = go.GetComponentsInChildren<SkinnedMeshRenderer>(true);
        comp.materials = new Material[skinList.Length];
        for (int i = 0; i < skinList.Length; i++)
        {
            comp.materials[i] = skinList[i].material;
        }
        if (time <= 0f)
        {
            comp.Sample(1f, true);
            comp.enabled = false;
        }
        return comp;
    }
    static public TweenShaderValue BeginWithMesh(GameObject go, float time, string tweenName, float fromValue, float endValue)
    {
        TweenShaderValue comp = UITweener.Begin<TweenShaderValue>(go, time);
        comp.from = fromValue;
        comp.to = endValue;
        comp.tweenName = tweenName;
        var skinList = go.GetComponentsInChildren<MeshRenderer>(true);
        comp.materials = new Material[skinList.Length];
        for (int i = 0; i < skinList.Length; i++)
        {
            comp.materials[i] = skinList[i].material;
        }
        if (time <= 0f)
        {
            comp.Sample(1f, true);
            comp.enabled = false;
        }
        return comp;
    }
    static public TweenShaderValue BeginWithRenderer(GameObject go, float time, string tweenName, float fromValue, float endValue)
    {
        TweenShaderValue comp = UITweener.Begin<TweenShaderValue>(go, time);
        comp.from = fromValue;
        comp.to = endValue;
        comp.tweenName = tweenName;
        var skinList = go.GetComponentsInChildren<Renderer>(true);
        comp.materials = new Material[skinList.Length];
        for (int i = 0; i < skinList.Length; i++)
        {
            comp.materials[i] = skinList[i].material;
        }
        comp.SetCurrentValueToStart();
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