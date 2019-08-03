using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UrlAssetRequest
{
    public UrlAssetType urlAssetType
    {
        private set;
        get;
    }
    public UrlAsset mainAsset
    {
        private set;
        get;
    }
    public string url
    {
        private set;
        get;
    }
    public string error
    {
        private set;
        get;
    }
    public bool isDone
    {
        private set;
        get;
    }
    public bool cache
    {
        private set;
        get;
    }
    [DonotWrap]
    public bool isLoading = false;
    private System.Action<UrlAssetRequest> callback = null;
    [DonotWrap]
    public bool hasCallback
    {
        get
        {
            return this.callback != null;
        }
    }
    [DonotWrap]
    public UrlAssetRequest(string url, UrlAssetType t,bool cache)
    {
        this.url = url;
        this.urlAssetType = t;
        this.cache = cache;
    }
    [DonotWrap]
    public void BeginLoad(System.Action<UrlAssetRequest> callback)
    {
        this.callback = callback;
        isLoading = true;
    }
    /// <summary>
    /// 调用回调函数
    /// </summary>
    [DonotWrap]
    public void EndLoad(string error,UrlAsset asset)
    {
        this.isDone = true;
        isLoading = false;
        this.mainAsset = asset;
        this.error = error;
        if (this.callback != null)
        {
            var call = this.callback;
            this.callback = null;
            call(this);
        }
    }
    /// <summary>
    /// 终止当前回调
    /// </summary>
    public void Abort()
    {
        if (callback != null)
        {
            callback = null;
        }
    }
}
public enum UrlAssetType
{
    Bytes,
    Text,
    Texture,
}