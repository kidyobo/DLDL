using System.Collections;
using System.Collections.Generic;
using UnityEngine;
[DefaultExecutionOrder(-1)]
public class FFMaterialGroup : MonoBehaviour
{
    public FFMaterialGroupRoot root;
    public int index = 0;
    /// <summary>
    /// 同个index的sortingFudge必须是相同的，否则会乱
    /// </summary>
    public int sortingFudge = 0;
    Material[] mats;
    void Awake()
    {
        if (root == null)
        {
            Debug.LogWarning("必须指定一个root", gameObject);
            DestroyImmediate(this);
            return;
        }
        var render = this.GetComponent<Renderer>();
        var len = render ? render.sharedMaterials.Length : 0;
        if (!render || len == 0)
        {
            Debug.LogWarning("只能控制拥个材质的模型", gameObject);
            DestroyImmediate(this);
            return;
        }
        mats = new Material[len];
        for (int i = 0; i < len; i++)
        {
            var old = render.sharedMaterials[i];
            var mat = mats[i] = root.GetMaterial(old, index);
            if (sortingFudge > 0 && mat)
            {
                mat.renderQueue = old.renderQueue + sortingFudge;
            }
        }
        render.materials = mats;
    }
    public Material GetMaterial(int index)
    {
        if (index >= mats.Length)
        {
            return null;
        }
        return mats[index];
    }
}