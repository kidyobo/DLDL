using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using System;

[AddComponentMenu("UI/Effects/Gradient")]
public class Gradient : BaseMeshEffect
{
    [SerializeField]
    private Color32 topColor = Color.white;

    [SerializeField]
    private Color32 bottomColor = Color.black;

    [Range(0.05f, 0.95f)]
    [SerializeField]
    private float position = 0.5f;
    [Range(0, 1)]
    [SerializeField]
    private float smoothDegree = 0.5f;

    public override void ModifyMesh(VertexHelper vh)
    {
        if (!IsActive())
        {
            return;
        }
         
        var count = vh.currentVertCount;
        var vertexList = new List<UIVertex>(count);
        for (int i = 0; i < count; i++)
        {
            UIVertex v = new UIVertex();
            vh.PopulateUIVertex(ref v, i);
            vertexList.Add(v);
        }
        vh.Clear();
        var midColor = Color32.Lerp(topColor, bottomColor, smoothDegree);
        //将顶点分割
        for (int i = 0; i < count; i += 4)
        {
            UIVertex v1 = vertexList[i];
            UIVertex v2 = vertexList[i + 1];
            UIVertex v3 = vertexList[i + 2];
            UIVertex v4 = vertexList[i + 3];

            v1.color = topColor;
            v2.color = topColor;
            v3.color = bottomColor;
            v4.color = bottomColor;

            UIVertex v5 = v1;
            v5.position = Vector3.Lerp(v1.position, v4.position, position);
            v5.uv0 = Vector2.Lerp(v1.uv0, v4.uv0, position);

            UIVertex v6 = v2;
            v6.position = Vector3.Lerp(v2.position, v3.position, position);
            v6.uv0 = Vector2.Lerp(v2.uv0, v3.uv0, position);
            v5.color = midColor;
            v6.color = midColor;

            var newVertexList = new List<UIVertex>(4);
            newVertexList.Add(v1);
            newVertexList.Add(v2);
            newVertexList.Add(v6);
            newVertexList.Add(v5);
            vh.AddUIVertexQuad(newVertexList.ToArray());
            newVertexList = new List<UIVertex>(4);
            newVertexList.Add(v5);
            newVertexList.Add(v6);
            newVertexList.Add(v3);
            newVertexList.Add(v4);
            vh.AddUIVertexQuad(newVertexList.ToArray());
        }
    }
}