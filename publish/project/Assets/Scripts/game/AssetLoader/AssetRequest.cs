using UnityEngine;
using System.Collections.Generic;
/// <summary>
/// 资源异步请求回调函数
/// </summary>
public class AssetRequest : RequestBase
{
    private System.Action<AssetRequest> callback = null;
    [DonotWrap]
    public List<Asset> requestList = new List<Asset>();
    [DonotWrap]
    public List<WWWCaching> wwwList = new List<WWWCaching>();
    [DonotWrap]
    private List<Asset> allRequestListCopy = new List<Asset>();
    public Asset mainAsset
    {
        private set;
        get;
    }
    /// <summary>
    /// 需要加载的最大数量
    /// </summary>
    public override int maxCount
    {
        get
        {
            return requestList.Count;
        }
    }
    /// <summary>
    /// 当前已经加载的字节数
    /// </summary>
    public override long loadSize
    {
        get
        {
            var totalSize = _baseLoadSize;
            for (int i = 0, len = wwwList.Count; i < len; i++)
            {
                var www = wwwList[i];
                if (www != null)
                {
                    var asset = requestList[i];
                    totalSize += (long)(asset.info.size * www.progress);
                }
            }
            return totalSize;
        }
    }
    public bool hasDownloadAsset
    {
        private set;
        get;
    }
    [DonotWrap]
    public bool hasCallback
    {
        get
        {
            return this.callback != null;
        }
    }
    public bool multiLoad
    {
        private set;
        get;
    }
    [DonotWrap]
    public AssetRequest(AssetPriority prority,bool multiLoad)
    {
        this.priority = prority;
        this.multiLoad = multiLoad;
    }

    [DonotWrap]
    public void BeginLoad(System.Action<AssetRequest> callback)
    {
        if (!this._isLoading)
        {
            this._error = null;
            this._isLoading = true;
            this.callback = callback;
            for (int i = 0, len = allRequestListCopy.Count; i < len; i++)
            {
                allRequestListCopy[i].operatingCount++;
            }
        }
        else
        {
            Debug.LogWarning("无法启动一个已经在加载的request");
        }
    }

    /// <summary>
    /// 调用回调函数
    /// </summary>
    [DonotWrap]
    public void EndLoad()
    {
        if (this._isLoading)
        {
            for (int i = 0, len = allRequestListCopy.Count; i < len; i++)
            {
                allRequestListCopy[i].operatingCount--;
            }
            if (this.callback != null)
            {
                var call = this.callback;
                this.callback = null;
                call(this);
            }
            this._isLoading = false;
        }
    }
    [DonotWrap]
    public void SetMainAsset(Asset asset)
    {
        this.mainAsset = asset;
    }

    [DonotWrap]
    public void AddNewRequest(Asset asset)
    {
        //只添加不重复的元素，因为引用关系的缘故
        if (!allRequestListCopy.Contains(asset))
        {
            allRequestListCopy.Add(asset);
            if (asset.loaded)
            {
                return;
            }
            this.requestList.Add(asset);
            this.wwwList.Add(null);
            this._maxSize += asset.info.size;
            if (!asset.info.localCached)
            {
                this.hasDownloadAsset = true;
            }
        }
    }
    [DonotWrap]
    public void LoadNextBegin(int index, WWWCaching www)
    {
        this.wwwList[index] = www;
    }
    [DonotWrap]
    public void LoadNextOver(int index, string error)
    {
        if (maxCount > 0)
        {
            this.wwwList[index] = null;
            if (error == null)
            {
                var asset = requestList[index];
                _baseLoadSize += asset.info.size;
                _loadCount++;
            }
        }
        if (this._error == null)
        {
            this._error = error;
        }
    }

    /// <summary>
    /// 终止当前回调
    /// </summary>
    public override void Abort()
    {
        if (callback != null)
        {
            callback = null;
        }
    }
    [DonotWrap]
    public override void Dispose()
    {
        this.Abort();
        this.EndLoad();
        for (int i = 0, len = wwwList.Count; i < len; i++)
        {
            var www = wwwList[i];
            if (www != null)
            {
                www.Dispose();
                var asset = requestList[i];
                if (asset.info.isDownloadOrLoad)
                {
                    asset.info.isDownloadOrLoad = false;
                }
            }
        }
        wwwList.Clear();
        requestList.Clear();
        allRequestListCopy.Clear();
    }
    public override string ToString()
    {
        var builder = new System.Text.StringBuilder();
        foreach (var asset in requestList)
        {
            builder.Append("\"");
            builder.Append(asset.path);
            builder.Append("\",");
            builder.AppendLine();
        }
        return builder.ToString();
    }
}