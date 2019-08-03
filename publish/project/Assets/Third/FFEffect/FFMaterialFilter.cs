using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
public class FFMaterialFilter
{
    public static void GetMaterials(FFTweenBase obj, bool includeChildren, List<Material> mats, List<Renderer> renderList, List<string> indexList)
    {
        if (renderList.Count != indexList.Count)
        {
            return;
        }
        if (includeChildren)
        {
            var r = obj.GetComponentsInChildren<Renderer>(false);
            if (r != null)
            {
                for (int i = 0, len = r.Length; i < len; i++)
                {
                    var renderer = r[i];
                    var rmats = renderer.materials;
                    var jlen = rmats.Length;
                    var index = renderList.IndexOf(renderer);
                    for (int j = 0; j < jlen; j++)
                    {
                        var rj = rmats[j];
                        if (index == -1 || indexList[index].IndexOf(j.ToString()) == -1)
                        {
                            if (rj != null)
                            {
                                mats.Add(rj);
                            }
                        }
                    }
                }
            }
        }
        else
        {
            var renderer = obj.GetComponent<Renderer>();
            if (renderer != null)
            {
                var group = obj.GetComponent<FFMaterialGroup>();
                var rmats = group ? renderer.sharedMaterials : renderer.materials;
                var jlen = rmats.Length;
                var index = renderList.IndexOf(renderer);
                for (int j = 0; j < jlen; j++)
                {
                    var rj = rmats[j];
                    if (index == -1 || indexList[index].IndexOf(j.ToString()) == -1)
                    {
                        if (rj != null)
                        {
                            if (group)
                            {
                                mats.Add(group.GetMaterial(j));
                            }
                            else
                            {
                                mats.Add(rj);
                            }
                        }
                    }
                }
            }
        }
    }
}