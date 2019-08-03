using UnityEngine;
public class RadialBlurRenderer : MonoBehaviour
{
    //模糊程度，不能过高  
    public float blurFactor = 1.0f;
    public bool ceilToInt = true;
    public Material material = null;
    public AnimationCurve curve;
    private float from;
    private float to;
    private float _time;
    private float time;
    public string keyName = "_Level";
    void Awake()
    {
        this.enabled = false;
    }
    void OnRenderImage(RenderTexture source, RenderTexture destination)
    {
        if (material == null || blurFactor == 0)
        {
            Graphics.Blit(source, destination);
        }
        else
        {
            if (ceilToInt)
            {
                material.SetInt(keyName, Mathf.CeilToInt(blurFactor));
            }
            else
            {
                material.SetFloat(keyName, blurFactor);
            }
            Graphics.Blit(source, destination, material);
        }
    }
    void Update()
    {
        if (_time < time)
        {
            _time += Time.deltaTime;
            blurFactor = Mathf.LerpUnclamped(from, to, curve != null ? curve.Evaluate(_time / time) : _time / time);
            if (_time >= time)
            {
                this.enabled = false;
            }
        }
    }
    public void Tween(float time, float from, float to)
    {
        this.from = from;
        this.to = to;
        _time = 0;
        this.time = time;
        blurFactor = from;
        if (!this.enabled)
        {
            this.enabled = true;
        }
    }
}