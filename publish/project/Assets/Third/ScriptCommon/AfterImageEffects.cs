using UnityEngine;
using System.Collections;
using System.Collections.Generic;
/// <summary>  
/// 残影特效  
/// </summary>  
public class AfterImageEffects : MonoBehaviour
{
    //残影的生存时间  
    public float life = 1;
    //生成残影的间隔时间  
    public float interval = 0.2f;
    public Material material;
    public bool autoDisable = false;
    private SkinnedMeshRenderer r;
    public bool useOriginalTexture = true;
    public AnimationCurve animationCurve = null;

    private float _time = 0;
    private List<AfterImage> _list;
    private int layer = 0;
    void Awake()
    {
        this.layer = gameObject.layer;
        _list = new List<AfterImage>();
    }
    void Update()
    {
        //生成残影  
        if (autoDisable)
        {
            if (_list.Count == 0)
            {
                this.enabled = false;
            }
        }
        else if (r != null)
        {
            _time += Time.deltaTime;
            if (_time >= interval)
            {
                _time = 0;

                Mesh mesh = new Mesh();
                r.BakeMesh(mesh);

                Material material = new Material(this.material == null ? r.material : this.material);
                if (useOriginalTexture)
                {
                    material.mainTexture = r.material.mainTexture;
                }
                _list.Add(new AfterImage(
                mesh,
                material,
                r.transform.localToWorldMatrix,
                Time.realtimeSinceStartup));
            }
        }

        //刷新残影，根据生存时间销毁已过时的残影  
        for (int i = _list.Count - 1; i >= 0; i--)
        {
            var image = _list[i];

            float delta = Time.realtimeSinceStartup - image.startTime;

            if (delta > life)
            {
                _list.RemoveAt(i);
                image.Destroy();
                continue;
            }
            var alpha = image.fixedAlpha * (1 - (animationCurve == null ? (delta / life) : animationCurve.Evaluate(delta / life)));
            image.material.SetFloat("_Alpha", alpha);
            Graphics.DrawMesh(image.mesh, image.matrix, image.material, layer);
        }
    }
    void OnDestroy()
    {
        this.ClearImages();
    }
    void OnDisable()
    {
        this.ClearImages();
    }

    public void SetRenderer(SkinnedMeshRenderer r)
    {
        this.r = r;
    }

    private void ClearImages()
    {
        if (_list.Count > 0)
        {
            for (int i = _list.Count - 1; i >= 0; i--)
            {
                var image = _list[i];
                image.Destroy();
            }
            _list.Clear();
        }
    }
    class AfterImage
    {
        //残影网格  
        public Mesh mesh;
        //残影纹理  
        public Material material;
        //残影位置  
        public Matrix4x4 matrix;
        //残影启动时间  
        public float startTime;
        public float fixedAlpha = 1;

        public AfterImage(Mesh mesh, Material material, Matrix4x4 matrix, float startTime)
        {
            this.mesh = mesh;
            this.material = material;
            this.matrix = matrix;
            this.startTime = startTime;
            fixedAlpha = material.GetFloat("_Alpha");
        }

        public void Destroy()
        {
            Object.Destroy(mesh);
            Object.Destroy(material);
        }
    }
}