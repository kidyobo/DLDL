using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FFTweenMaterialColor : FFTweenBase
{
    public UnityEngine.Gradient gradient;
    private List<Material> mats;
    private List<Color> originValue;
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
            originValue = new List<Color>();
            FFMaterialFilter.GetMaterials(this, this.includeChildren, mats, filtlerRenderList, filtlerRenderIndexList);
            for (int i = 0, len = mats.Count; i < len; i++)
            {
                if (!mats[i].HasProperty(matName))
                {
                    Debug.LogWarning("材质球不存在属性:" + matName + " 来源：" + this.gameObject.name, this.gameObject);
                }
                var color = mats[i].GetColor(matName);
                originValue.Add(color);
            }
        }
        for (int i = 0, len = mats.Count; i < len; i++)
        {
            mats[i].SetColor(matName, originValue[i]);
        }
    }

    protected override void FFUpdate(float eval)
    {
        var value = gradient.Evaluate(eval);
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
            mats[i].SetColor(matName, color);
        }
    }
}