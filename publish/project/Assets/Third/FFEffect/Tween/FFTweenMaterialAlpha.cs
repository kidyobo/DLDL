using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FFTweenMaterialAlpha : FFTweenBase
{
    public float from = 1;
    public float to = 0;
    private List<Material> mats;
    private List<Color> originValue;
    public bool includeChildren = false;
    public bool isColorField = true;
    public string matName = "_Color";
    public FFComputeMode mode = FFComputeMode.Multi;
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
                if (isColorField)
                {
                    var color = mats[i].GetColor(matName);
                    originValue.Add(color);
                }
                else
                {
                    var color = new Color();
                    color.a = mats[i].GetFloat(matName);
                    originValue.Add(color);
                }
            }
        }
        for (int i = 0, len = mats.Count; i < len; i++)
        {
            if (isColorField)
            {
                mats[i].SetColor(matName, originValue[i]);
            }
            else
            {
                mats[i].SetFloat(matName, originValue[i].a);
            }
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
                    color.a = value + color.a;
                    break;
                case FFComputeMode.Multi:
                    color.a = value * color.a;
                    break;
                case FFComputeMode.Set:
                    color.a = value;
                    break;
                case FFComputeMode.Sub:
                    color.a = color.a - value;
                    break;
            }
            if (isColorField)
            {
                mats[i].SetColor(matName, color);
            }
            else
            {
                mats[i].SetFloat(matName, color.a);
            }
        }
    }
}