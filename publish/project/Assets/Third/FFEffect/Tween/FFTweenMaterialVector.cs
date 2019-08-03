using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FFTweenMaterialVector : FFTweenBase
{
    public Vector4 from;
    public Vector4 to;
    private List<Material> mats;
    private List<Vector4> originValue;
    public bool includeChildren = false;
    public string matName = "_Color";
    public FFComputeMode mode = FFComputeMode.Set;
    public List<Renderer> filtlerRenderList = new List<Renderer>();
    public List<string> filtlerRenderIndexList = new List<string>();
    protected override void FFEnable()
    {
        if (mats == null)
        {
            mats = new List<Material>();
            originValue = new List<Vector4>();
            FFMaterialFilter.GetMaterials(this, this.includeChildren, mats, filtlerRenderList, filtlerRenderIndexList);
            for (int i = 0, len = mats.Count; i < len; i++)
            {
                if (!mats[i].HasProperty(matName))
                {
                    Debug.LogWarning("材质球不存在属性:" + matName + " 来源：" + this.gameObject.name, this.gameObject);
                }
                var color = mats[i].GetVector(matName);
                originValue.Add(color);
            }
        }
        for (int i = 0, len = mats.Count; i < len; i++)
        {
            mats[i].SetVector(matName, originValue[i]);
        }
    }

    protected override void FFUpdate(float eval)
    {
        var value = Vector4.LerpUnclamped(from, to, eval);
        for (int i = 0, len = mats.Count; i < len; i++)
        {
            var color = originValue[i];
            switch (mode)
            {
                case FFComputeMode.Add:
                    color = value + color;
                    break;
                case FFComputeMode.Multi:
                    color = new Vector4(value.x * color.x, value.y * color.y, value.z * color.z, value.w * color.w);
                    break;
                case FFComputeMode.Set:
                    color = value;
                    break;
                case FFComputeMode.Sub:
                    color = color - value;
                    break;
            }
            mats[i].SetVector(matName, color);
        }
    }
}