using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UrlAsset
{
    public byte[] bytes;
    public string text;
    public Texture2D texture;
    [DonotWrap]
    public double time;
    /// <summary>
    /// 该资源保存的引用列表
    /// </summary>
    private List<GameObject> refList = new List<GameObject>();
    public UrlAsset()
    {
        this.time = Time.realtimeSinceStartup;
    }
    [DonotWrap]
    public bool Unload(double t)
    {
        while (refList.Count > 0)
        {
            var obj = refList[0];
            if (obj.Equals(null))
            {
                refList.RemoveAt(0);
            }
            else
            {
                this.time = Time.realtimeSinceStartup;
                return false;
            }
        }
        if (this.time + t > Time.realtimeSinceStartup)
        {
            return false;
        }
        bytes = null;
        text = null;
        if (texture != null)
        {
            Object.DestroyImmediate(texture);
            texture = null;
        }
        return true;
    }
    public void AddLinkObject(GameObject go)
    {
        refList.Add(go);
    }
}