using UnityEngine;
using System.Collections;

public class RequestBase
{
    public AssetPriority priority
    {
        protected set;
        get;
    }
    protected int _loadCount = 0;
    /// <summary>
    /// 当前已经下载的数量
    /// </summary>
    public int loadCount
    {
        get
        {
            return _loadCount;
        }
    }
    protected string _error = null;
    /// <summary>
    /// 当前请求的错误信息
    /// </summary>
    public string error
    {
        get
        {
            if (noAssetError!=null)
            {
                return noAssetError;
            }
            return this._error;
        }
    }
    [DonotWrap]
    public string noAssetError = null;
    /// <summary>
    /// 当前请求是否已经完成
    /// </summary>
    public bool isDone
    {
        get
        {
            return loadCount == maxCount;
        }
    }
    public virtual int maxCount
    {
        get
        {
            return 0;
        }
    }
    /// <summary>
    /// 资源加载的进度
    /// </summary>
    public float progress
    {
        get
        {
            if (maxSize == 0)
            {
                if (maxCount == 0)
                {
                    return 0;
                }
                else
                {
                    return _loadCount / (float)maxCount;
                }
            }
            return loadSize / (float)_maxSize;
        }
    }
    protected long _baseLoadSize = 0;
    /// <summary>
    /// 当前已经加载的字节数
    /// </summary>
    public virtual long loadSize
    {
        get
        {
            return 0;
        }
    }
    protected long _maxSize = 0;
    /// <summary>
    /// 需要加载的总字节数
    /// </summary>
    public long maxSize
    {
        get
        {
            return _maxSize;
        }
    }
    protected bool _isLoading = false;
    /// <summary>
    /// 是否正在加载
    /// </summary>
    public bool isLoading
    {
        get
        {
            return _isLoading;
        }
    }
    /// <summary>
    /// 终止当前回调
    /// </summary>
    public virtual void Abort()
    {
    }

    [DonotWrap]
    public virtual void Dispose()
    {
    }
}
