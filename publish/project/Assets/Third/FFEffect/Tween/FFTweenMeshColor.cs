using System.Collections;
using System.Collections.Generic;
using UnityEngine;
public class FFTweenMeshColor : FFTweenBase
{
    public UnityEngine.Gradient gradient;
    private Mesh mesh;
    private Color[] nowColors;
    protected override void FFEnable()
    {
        if (mesh == null)
        {
            var r = this.GetComponent<MeshFilter>();
            if (!r)
            {
                return;
            }
            mesh = r.mesh;
            if (!mesh)
            {
                return;
            }
            if (!mesh.isReadable)
            {
                Debug.LogWarning("模型不可修改数据，请开启read/write属性", gameObject);
                mesh = null;
                return;
            }
            nowColors = new Color[mesh.vertexCount];
        }
        else
        {
            mesh.colors = null;
        }
    }

    protected override void FFUpdate(float eval)
    {
        if (!mesh)
        {
            return;
        }
        var value = gradient.Evaluate(eval);
        for (int i = 0, len = nowColors.Length; i < len; i++)
        {
            nowColors[i] = value;
        }
        mesh.colors = nowColors;
    }
    void OnDestroy()
    {
        if (mesh != null)
        {
            Mesh.Destroy(mesh);
        }
    }
}