using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class FFUVScroll : FFTweenBase
{
    public Vector2 speed = new Vector2(1.0f, 0.0f);
    public bool includeChildren = false;
    public string texName = "_MainTex";
    Vector2 uvOffset = Vector2.zero;
    private List<Material> mats;
    public List<Renderer> filtlerRenderList = new List<Renderer>();
    public List<string> filtlerRenderIndexList = new List<string>();
    protected override void FFEnable()
    {
        if (mats == null)
        {
            mats = new List<Material>();
            FFMaterialFilter.GetMaterials(this, this.includeChildren, mats, filtlerRenderList, filtlerRenderIndexList);
        }
        uvOffset = Vector2.zero;
        for (int i = 0, len = mats.Count; i < len; i++)
        {
            mats[i].SetTextureOffset(texName, uvOffset);
        }
    }

    protected override void FFUpdate(float eval)
    {
        uvOffset = speed * eval;
        for (int i = 0, len = mats.Count; i < len; i++)
        {
            mats[i].SetTextureOffset(texName, uvOffset);
        }
    }
}