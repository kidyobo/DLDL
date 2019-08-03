using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FFTweenMaterialFloat : FFTweenBase
{
    public float from = 0;
    public float to = 1;
    private List<float> originValue;
    private List<Material> mats;
    public bool includeChildren = false;
    public string matName = "";
    public FFComputeMode mode = FFComputeMode.Set;
    public List<Renderer> filtlerRenderList = new List<Renderer>();
    public List<string> filtlerRenderIndexList = new List<string>();
    protected override void FFEnable()
    {
        if (mats == null)
        {
            mats = new List<Material>();
            originValue = new List<float>();
            FFMaterialFilter.GetMaterials(this, this.includeChildren, mats, filtlerRenderList, filtlerRenderIndexList);
            for (int i = 0, len = mats.Count; i < len; i++)
            {
                if (!mats[i].HasProperty(matName))
                {
                    Debug.LogWarning("材质球不存在属性:" + matName + " 来源：" + this.gameObject.name, this.gameObject);
                }
                var color = mats[i].GetFloat(matName);
                originValue.Add(color);
            }
        }
        for (int i = 0, len = mats.Count; i < len; i++)
        {
            mats[i].SetFloat(matName, originValue[i]);
        }
    }

    protected override void FFUpdate(float eval)
    {
        var value = Mathf.LerpUnclamped(from, to, eval);
        for (int i = 0, len = mats.Count; i < len; i++)
        {
            var color = originValue[i];
            switch (mode)
            {
                case FFComputeMode.Add:
                    color = value + color;
                    break;
                case FFComputeMode.Multi:
                    color = value * color;
                    break;
                case FFComputeMode.Set:
                    color = value;
                    break;
                case FFComputeMode.Sub:
                    color = color - value;
                    break;
            }
            mats[i].SetFloat(matName, color);
        }
    }
}