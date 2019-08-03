using UnityEngine;
using System.Collections.Generic;

public class DownloadRequest:RequestBase
{
    private System.Action<DownloadRequest> callback = null;
    [DonotWrap]
    public List<ResInfo> requestList = new List<ResInfo>();
    private HashSet<ResInfo> allRequestList = new HashSet<ResInfo>();
    /// <summary>
    /// 需要下载的最大数量
    /// </summary>
    public override int maxCount
    {
        get
        {
            return requestList.Count;
        }
    }
    [DonotWrap]
    public WWWCaching _currentLoadWWW = null;
    /// <summary>
    /// 当前已经下载的字节数
    /// </summary>
    public override long loadSize
    {
        get
        {
            long loadSize = (long)(_currentLoadWWW == null ? 0 : requestList[_loadCount].size * _currentLoadWWW.progress);
            return _baseLoadSize + loadSize;
        }
    }
    [DonotWrap]
    public bool hasCallback
    {
        get
        {
            return this.callback != null;
        }
    }
    private bool containDownloaded = false;
    private HashSet<ResInfo> allDownloaded = new HashSet<ResInfo>();
    [DonotWrap]
    public DownloadRequest(AssetPriority priority,bool containDownloaded)
    {
        this.priority = priority;
        this.containDownloaded = containDownloaded;
    }
    [DonotWrap]
    public void BeginLoad(System.Action<DownloadRequest> callback)
    {
        if (!this._isLoading)
        {
            this._error = null;
            this._isLoading = true;
            this.callback = callback;
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
            this._isLoading = false;
            if (this.callback != null)
            {
                var call = this.callback;
                this.callback = null;
                call(this);
            }
        }
    }
    [DonotWrap]
    public void AddNewRequest(ResInfo info)
    {
        if (info.localCached)
        {
            if (containDownloaded)
            {
                if (allDownloaded.Add(info))
                {
                    this._baseLoadSize += info.size;
                    this._maxSize += info.size;
                }
            }
            return;
        }
        //只添加不重复的元素，因为引用关系的缘故
        if (allRequestList.Add(info))
        {
            this.requestList.Add(info);
            this._maxSize += info.size;
        }
    }
    [DonotWrap]
    public void LoadNextBegin(WWWCaching www)
    {
        this._currentLoadWWW = www;
    }
    [DonotWrap]
    public void LoadNextOver(string error)
    {
        this._currentLoadWWW = null;
        if (maxCount > 0)
        {
            if (error == null)
            {
                var info = requestList[_loadCount];
                _baseLoadSize += info.size;
                _loadCount++;
            }
        }
        this._error = error;
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
        if (this._currentLoadWWW != null)
        {
            this._currentLoadWWW.Dispose();
            this._currentLoadWWW = null;

            var info = requestList[_loadCount];
            if (info.isDownloadOrLoad)
            {
                info.isDownloadOrLoad = false;
            }
        }
    }
    public override string ToString()
    {
        var builder = new System.Text.StringBuilder();
        foreach (var asset in requestList)
        {
            builder.Append(asset.url);
            builder.Append(" ");
        }
        return builder.ToString();
    }
}