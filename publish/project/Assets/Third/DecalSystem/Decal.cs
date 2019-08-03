using UnityEngine;
using System.Collections.Generic;

[RequireComponent(typeof(MeshFilter))]
[RequireComponent(typeof(MeshRenderer))]
public class Decal : MonoBehaviour
{
    public Material material;
    public float maxAngle = 90.0f;
    public float pushDistance = 0.009f;
    public LayerMask affectedLayers = -1;
    private GameObject[] affectedObjects;
    public GameObject[] affectedObjectsView
    {
        get
        {
            return affectedObjects;
        }
    }

    private Matrix4x4 oldMatrix;
    private Mesh builtMesh = null;
    private Material builtMaterial = null;
    void Awake()
    {
        MeshRenderer renderer = this.GetComponent<MeshRenderer>();
        if (builtMaterial != this.material)
        {
            renderer.sharedMaterial = this.material;
            builtMaterial = this.material;
        }
    }

    void OnDrawGizmosSelected()
    {
        Gizmos.matrix = transform.localToWorldMatrix;
        Gizmos.DrawWireCube(Vector3.zero, Vector3.one);
    }

    public Bounds GetBounds()
    {
        Vector3 size = transform.lossyScale;
        Vector3 min = -size / 2f;
        Vector3 max = size / 2f;

        Vector3[] vts = new Vector3[] {
            new Vector3(min.x, min.y, min.z),
            new Vector3(max.x, min.y, min.z),
            new Vector3(min.x, max.y, min.z),
            new Vector3(max.x, max.y, min.z),

            new Vector3(min.x, min.y, max.z),
            new Vector3(max.x, min.y, max.z),
            new Vector3(min.x, max.y, max.z),
            new Vector3(max.x, max.y, max.z),
        };

        for (int i = 0; i < 8; i++)
        {

            vts[i] = transform.TransformDirection(vts[i]);
        }

        min = max = vts[0];
        for (int i = 0, len = vts.Length; i < len; i++)
        {
            var v = vts[i];
            min = Vector3.Min(min, v);
            max = Vector3.Max(max, v);
        }

        return new Bounds(transform.position, max - min);
    }

    // Update is called once per frame
    void Update()
    {
        var matrix = transform.localToWorldMatrix;
        bool hasChanged = oldMatrix != matrix;
        oldMatrix = matrix;
        if (hasChanged)
        {
            Build();
        }
    }

    public void Build()
    {
        MeshFilter filter = this.GetComponent<MeshFilter>();
        MeshRenderer renderer = this.GetComponent<MeshRenderer>();
        if (builtMaterial != this.material)
        {
            renderer.sharedMaterial = this.material;
            builtMaterial = this.material;
        }
        if (this.material == null)
        {
            filter.sharedMesh = null;
            return;
        }
        affectedObjects = GetAffectedObjects(this.GetBounds(), this.affectedLayers);

        for (int i = 0, len = affectedObjects.Length; i < len; i++)
        {
            var v = affectedObjects[i];
            DecalBuilder.BuildDecalForObject(this, v);
        }

        DecalBuilder.Push(this.pushDistance);
        var mesh = DecalBuilder.CreateMesh();
        if (mesh != null)
        {
            if (builtMesh != null)
            {
                Object.DestroyImmediate(builtMesh);
            }
            mesh.name = "_mesh";
            filter.sharedMesh = mesh;
            builtMesh = mesh;
        }
    }

    void OnDestroy()
    {
        if (builtMesh != null)
        {
            Object.DestroyImmediate(builtMesh);
            builtMesh = null;
        }
    }

    private static bool IsLayerContains(LayerMask mask, int layer)
    {
        if (layer < 8)
        {
            return (mask.value & 1 << (layer - 1)) != 0;
        }
        return (mask.value & 1 << (layer - 3)) != 0;
    }
    private static GameObject[] GetAffectedObjects(Bounds bounds, LayerMask affectedLayers)
    {
        Collider[] clist = (Collider[])GameObject.FindObjectsOfType<Collider>();
        List<GameObject> objects = new List<GameObject>();
        for (int i = 0, len = clist.Length; i < len; i++)
        {
            var r = clist[i];
            if (!r.enabled) continue;
            if (!IsLayerContains(affectedLayers, r.gameObject.layer)) continue;
            if (r.GetComponent<Decal>() != null) continue;

            if (bounds.Intersects(r.bounds))
            {
                objects.Add(r.gameObject);
            }
        }
        return objects.ToArray();
    }
}