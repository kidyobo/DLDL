using System.Collections.Generic;
using UnityEngine;

public class FFUVAnimation : FFTweenBase
{
    public int TilesX = 4;
    public int TilesY = 4;
    public int StartFrameOffset;
    public string texName = "_MainTex";

    private int previousIndex;
    private int totalFrames;
    private Vector2 size;
    public bool includeChildren = false;
    private List<Material> mats;
    public List<Renderer> filtlerRenderList = new List<Renderer>();
    public List<string> filtlerRenderIndexList = new List<string>();
    protected override void FFEnable()
    {
        if (mats == null)
        {
            mats = new List<Material>();
            FFMaterialFilter.GetMaterials(this, this.includeChildren, mats, filtlerRenderList, filtlerRenderIndexList);
            totalFrames = TilesX * TilesY;
            size = new Vector2(1f / TilesX, 1f / TilesY);
            for (int i = 0, len = mats.Count; i < len; i++)
            {
                var _mat = mats[i];
                _mat.SetTextureScale(texName, size);
            }
        }
        for (int i = 0, len = mats.Count; i < len; i++)
        {
            var _mat = mats[i];
            _mat.SetTextureOffset(texName, Vector3.zero);
        }
    }

    protected override void FFUpdate(float eval)
    {
        var index = Mathf.FloorToInt(eval * totalFrames);
        //此处防止回到初始帧
        if (this.style < FFTweenStyle.Loop && index >= totalFrames)
        {
            index = totalFrames - 1;
        }
        else
        {
            index = (index + StartFrameOffset) % totalFrames;
        }
        var uIndex = index % TilesX;
        var vIndex = index / TilesX;

        float offsetX = uIndex * size.x;
        float offsetY = (1.0f - size.y) - vIndex * size.y;

        for (int i = 0, len = mats.Count; i < len; i++)
        {
            mats[i].SetTextureOffset(texName, new Vector2(offsetX, offsetY));
        }
    }
}