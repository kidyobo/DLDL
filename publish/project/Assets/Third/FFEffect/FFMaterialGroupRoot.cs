using System.Collections;
using System.Collections.Generic;
using UnityEngine;
[DefaultExecutionOrder(-2)]
public class FFMaterialGroupRoot : MonoBehaviour
{
    Dictionary<int, Dictionary<int, Material>> mats = new Dictionary<int, Dictionary<int, Material>>();
    public Material GetMaterial(Material shareMat, int index)
    {
        if (shareMat == null)
        {
            return null;
        }
        Dictionary<int, Material> dic;
        var key = shareMat.GetInstanceID();
        if (!mats.TryGetValue(key, out dic))
        {
            dic = mats[key] = new Dictionary<int, Material>();
        }
        Material mat;
        if (!dic.TryGetValue(index, out mat))
        {
            mat = dic[index] = new Material(shareMat);
        }
        return mat;
    }
    public void OnDestroy()
    {
        foreach (var pair in mats)
        {
            foreach (var pair2 in pair.Value)
            {
                GameObject.Destroy(pair2.Value);
            }
        }
    }
}