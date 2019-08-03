using System;
using UnityEngine;
using System.Text;

public class ResInfo
{
    public bool raw = false;
    public string hashCode;
    public int size;
    public string url;
    public string[] dependencies;
    public bool downloaded;
    public bool isDownloadOrLoad = false;
    public int tagPos = 0;

    private bool getBuildinHashCode = false;
    private bool _isBuildin = false;
    public bool localCached
    {
        get
        {
            return downloaded || isBuildin;
        }
    }
    public static bool IsSame(ResInfo a, ResInfo b)
    {
        if (a.url != b.url)
        {
            return false;
        }
        if (a.raw != b.raw)
        {
            return false;
        }
        if (a.size != b.size)
        {
            return false;
        }
        if (a.hashCode != b.hashCode)
        {
            return false;
        }
        if ((a.dependencies == null ? 0 : a.dependencies.Length) != (b.dependencies == null ? 0 : b.dependencies.Length))
        {
            return false;
        }
        for (int i = 0, len = a.dependencies == null ? 0 : a.dependencies.Length; i < len; i++)
        {
            if (a.dependencies[i] != b.dependencies[i])
            {
                return false;
            }
        }
        return true;
    }
    /// <summary>
    /// 是否是包内资源
    /// </summary>
    public bool isBuildin
    {
        get
        {
            if (!getBuildinHashCode)
            {
                getBuildinHashCode = true;
                _isBuildin = BuildinAssetManager.GetAssetHashCode(url) == this.hashCode;
            }
            return _isBuildin;
        }
    }
    public ResInfo()
    {
    }
    public ResInfo(string url, string hashCode, int size, string[] dependencies, int tagPos, byte tag)
    {
        this.url = url;
        this.hashCode = hashCode;
        this.size = size;
        this.dependencies = dependencies;
        this.tagPos = tagPos;
        this.UpdateTag(tag);
    }
    public void Update(bool downloaded)
    {
        this.downloaded = downloaded;
    }
    public byte GetNewTag()
    {
        return (byte)((this.downloaded ? 1 : 0) | (this.raw ? 2 : 0));
    }
    public void UpdateTag(byte tag)
    {
        this.downloaded = (tag & 1) == 1;
        this.raw = (tag & 2) == 2;
    }
}