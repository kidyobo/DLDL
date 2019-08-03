using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Text;
/// <summary>
/// 资源加载类
/// </summary>
public class ResLoader : MonoBehaviour
{
#if PUBLISH
    /// <summary>
    /// 储存资源下载路径和版本信息
    /// </summary>
    static Dictionary<string, ResInfo> assetbundlePathDictionaryBackup = null;
    readonly public static bool isPublish = true;
#else
    readonly public static bool isPublish = false;
#endif
    /// <summary>
    /// 储存用于加载的资源字典
    /// </summary>
    static readonly Dictionary<string, Asset> assets = new Dictionary<string, Asset>(2048);
    /// <summary>
    /// 储存资源下载路径和版本信息
    /// </summary>
    static Dictionary<string, ResInfo> assetbundlePathDictionary = null;
    /// <summary>
    /// AB包MD5配置表名称
    /// </summary>
    public static readonly string assetbundlePathConfigName = "assetbundleconfiglist.ab";
    /// <summary>
    /// 当前AB资源总版本号
    /// </summary>
    public static int assetbundleVersion
    {
        get;
        private set;
    }
    public static bool isRemote = false;
    /// <summary>
    /// 当前实例对象
    /// </summary>
    static ResLoader handle = null;
    private static int maxQueueCount = (int)AssetPriority.High3 + 1;
    private static Queue<AssetRequest>[] loadQueueList = new Queue<AssetRequest>[maxQueueCount];
    private static Queue<AssetRequest> downloadQueue = new Queue<AssetRequest>();
    private static AssetRequest[] loadingRequestList = new AssetRequest[maxQueueCount];
    private static AssetRequest downloadingRequest = null;

    private static Queue<DownloadRequest>[] downloadList = new Queue<DownloadRequest>[maxQueueCount];
    private static DownloadRequest[] downloadRequestList = new DownloadRequest[maxQueueCount];

    public static bool isCleaning
    {
        private set;
        get;
    }
    public static bool clearAllAssetsOnLoad = false;

    public static readonly Dictionary<string, UrlAsset> urlAssets = new Dictionary<string, UrlAsset>(16);
    public static readonly List<UrlAsset> urlAssetsNoCache = new List<UrlAsset>(16);
    static ResLoader()
    {
        for (int i = 0; i < maxQueueCount; i++)
        {
            loadQueueList[i] = new Queue<AssetRequest>();
            downloadList[i] = new Queue<DownloadRequest>();
        }
    }
    void Awake()
    {
        AssetWriterThread.Init();
        handle = this;
        ClearAll(clearAllAssetsOnLoad, clearAllAssetsOnLoad);
    }
    void OnDestroy()
    {
        AssetWriterThread.Destroy();
    }

    /// <summary>
    /// 判断一个资源是否存在
    /// </summary>
    /// <param name="path">资源路径</param>
    /// <returns></returns>
    public static bool Exist(string path)
    {
#if PUBLISH
        path = GetNewPathExt(path);
        return assetbundlePathDictionary.ContainsKey(path);
#else
        return System.IO.File.Exists(AssetCaching.GetUrl(path, null)) || System.IO.Directory.Exists(AssetCaching.GetUrl(path, null));
#endif
    }

    /// <summary>
    /// 判断一个资源是否已经下载到本地
    /// </summary>
    /// <param name="path">资源路径</param>
    /// <returns></returns>
    public static bool IsDownloaded(string path)
    {
#if PUBLISH
        path = GetNewPathExt(path);
        ResInfo info = null;
        if (assetbundlePathDictionary.TryGetValue(path, out info))
        {
            return info.localCached;
        }
        return false;
#else
        return Exist(path);
#endif
    }

    public static void PrintAllAssets()
    {
        foreach (KeyValuePair<string, Asset> pair in assets)
        {
            Debug.Log(pair.ToString());
        }
    }
    /// <summary>
    /// 获取一个新的路径
    /// </summary>
    /// <param name="path">旧的路径</param>
    [DonotWrap]
    public static string GetNewPathExt(string path)
    {
        if (path == null)
        {
            return null;
        }
#if PUBLISH
        if (path.StartsWith("raw"))
        {
            return path;
        }
        else
        {
            var index = path.IndexOf('.');
            if (index >= 0)
            {
                var builder = new System.Text.StringBuilder();
                builder.Append(path.Substring(0, index).ToLower());
                builder.Append(".ab");
                path = builder.ToString();
            }
            else
            {
                var builder = new System.Text.StringBuilder();
                builder.Append(path.ToLower());
                builder.Append(".ab");
                path = builder.ToString();
            }
        }
#endif
        return path;
    }
    static ResInfo CreateRequestInfo(DownloadRequest request, string url)
    {
        ResInfo checkPair = null;
#if PUBLISH
        if (assetbundlePathDictionary.TryGetValue(url, out checkPair))
        {
            //检查依赖性的加载
            var dependencies = checkPair.dependencies;
            for (int j = 0, jLength = dependencies.Length; j < jLength; j++)
            {
                string dependencyUrl = dependencies[j];
                //关联的资源默认会修改为自动释放
                var dep = CreateRequestInfo(request, dependencyUrl);
                if (dep == null)
                {
                    return dep;
                }
            }
            request.AddNewRequest(checkPair);
        }
#else
        if (Exist(url))
        {
            checkPair = new ResInfo();
        }
#endif
        return checkPair;
    }
    static Asset CreateRequestAsset(AssetRequest request, string url)
    {
        Asset asset = null;
        assets.TryGetValue(url, out asset);
        if (asset == null)
        {
            ResInfo checkPair = null;
#if PUBLISH
            if (assetbundlePathDictionary.TryGetValue(url, out checkPair))
            {
                asset = new Asset(checkPair);
                assets[url] = asset;
                //检查依赖性的加载
                var dependencies = checkPair.dependencies;
                for (int j = 0, jLength = dependencies.Length; j < jLength; j++)
                {
                    string dependencyUrl = dependencies[j];
                    //关联的资源默认会修改为自动释放
                    Asset dependencyAsset = CreateRequestAsset(request, dependencyUrl);
                    if (dependencyAsset == null)
                    {
                        return null;
                    }
                    asset.linkedAssetBundleList.Add(dependencyAsset);
                    dependencyAsset.linkedAssetList.Add(asset);
                }
                request.AddNewRequest(asset);
            }
#else
            if (Exist(url))
            {
                checkPair = new ResInfo(url, null, 0, null, 0, (byte)(url.StartsWith("raw") ? 2 : 0));
                asset = new Asset(checkPair);
                assets[url] = asset;
                request.AddNewRequest(asset);
            }
#endif
        }
        else
        {
            asset.ResetCollect(asset.autoCollect);
            //检查依赖性的加载
            var dependencies = asset.info.dependencies;
            if (dependencies != null)
            {
                for (int j = 0, jLength = dependencies.Length; j < jLength; j++)
                {
                    string dependencyUrl = dependencies[j];
                    //关联的资源默认会修改为自动释放
                    CreateRequestAsset(request, dependencyUrl);
                }
            }
            request.AddNewRequest(asset);
        }
        return asset;
    }

    static AssetRequest CreateAssetRequestInternal(AssetPriority priority, bool multiLoad, params string[] abList)
    {
        AssetRequest request = new AssetRequest(priority, multiLoad);
        for (int i = 0, length = abList == null ? 0 : abList.Length; i < length; i++)
        {
            var url = abList[i];
            if (string.IsNullOrEmpty(url))
            {
                request.noAssetError = "资源路径不合法";
                break;
            }
            else
            {
                url = GetNewPathExt(url);
                var asset = CreateRequestAsset(request, url);
                request.SetMainAsset(asset);
                if (asset == null)
                {
                    request.noAssetError = "资源路径不存在：" + url;
                    break;
                }
            }
        }

        return request;
    }

    /// <summary>
    /// 载入游戏资源配置表
    /// </summary>
    /// <param name="onlyLocal">true只从本地加载，false会从网络加载</param>
    /// <param name="callback">加载的回调函数</param>
    [DonotWrap]
    public static void LoadConfig(bool onlyLocal, System.Action<string> callback, System.Action<float> updateCallback)
    {
        isRemote = !onlyLocal;
#if PUBLISH
        handle.StartCoroutine(UpdateConfigs(onlyLocal, callback, updateCallback));
#else
        callback(null);
#endif

    }

    /// <summary>
    /// 创建一个资源到内存的请求
    /// </summary>
    public static AssetRequest CreateAssetsRequest(AssetPriority priority, string[] abList)
    {
        var request = CreateAssetRequestInternal(priority, true, abList);
        return request;
    }

    /// <summary>
    /// 创建一个资源下载请求
    /// </summary>
    public static DownloadRequest CreateDownloadRequest(AssetPriority priority, string[] abList, bool containDownloaded)
    {
        DownloadRequest request = new DownloadRequest(priority, containDownloaded);
        for (int i = 0, length = abList == null ? 0 : abList.Length; i < length; i++)
        {
            var url = abList[i];
            if (string.IsNullOrEmpty(url))
            {
                request.LoadNextOver("资源路径不合法");
            }
            else
            {
                url = GetNewPathExt(url);
                var res = CreateRequestInfo(request, url);
                if (res == null)
                {
                    request.noAssetError = "资源路径不存在：" + url;
                    break;
                }
            }
            if (request.error != null)
            {
                break;
            }
        }
        return request;
    }

    /// <summary>
    /// 创建一个资源请求
    /// </summary>
    /// <param name="callback">是否仅下载资源</param>
    /// <param name="pathList">资源路径列表</param>
    public static AssetRequest CreateAssetRequest(AssetPriority priority, string path)
    {
        var request = CreateAssetRequestInternal(priority, false, path);
        return request;
    }

    public static bool BeginAssetRequest(AssetRequest request, System.Action<AssetRequest> callback)
    {
        if (request.isLoading)
        {
            return false;
        }
        if (request.isDone || request.noAssetError != null)
        {
            if (callback != null)
            {
                callback(request);
            }
        }
        else
        {
            request.BeginLoad(callback);
            if (request.hasDownloadAsset)
            {
                if (isRemote)
                {
                    var index = (int)request.priority;
                    downloadQueue.Enqueue(request);
                    DownloadNewAssetCheck();
                }
                else
                {
                    request.LoadNextOver(0, "并没有从网络获取配置表，无法下载资源。");
                    request.EndLoad();
                }
            }
            else
            {
                var index = (int)request.priority;
                loadQueueList[index].Enqueue(request);
                LoadNewAssetCheck(index);
            }
        }
        return true;
    }

    public static bool BeginDownloadRequest(DownloadRequest request, System.Action<DownloadRequest> callback)
    {
        if (request.isDone || request.noAssetError != null)
        {
            if (callback != null)
            {
                callback(request);
            }
        }
        else
        {
            request.BeginLoad(callback);
            if (isRemote)
            {
                var index = (int)request.priority;
                downloadList[index].Enqueue(request);
                DownloadNewCheck(index);
            }
            else
            {
                request.LoadNextOver("并没有从网络获取配置表，无法下载资源。");
                request.EndLoad();
            }
        }
        return true;
    }

    /// <summary>
    /// 创建一个资源请求
    /// </summary>
    /// <param name="callback">是否仅下载资源</param>
    /// <param name="pathList">资源路径列表</param>
    public static UrlAssetRequest CreateUrlAssetRequest(UrlAssetType urlAssetType, string url, bool cache)
    {
        var request = new UrlAssetRequest(url, urlAssetType, cache);
        UrlAsset asset = null;
        urlAssets.TryGetValue(url, out asset);
        if (asset != null)
        {
            request.EndLoad(null, asset);
        }
        return request;
    }

    public static bool BeginUrlAssetRequest(UrlAssetRequest request, System.Action<UrlAssetRequest> callback)
    {
        if (request.isLoading)
        {
            return false;
        }
        if (request.mainAsset != null)
        {
            if (callback != null)
            {
                callback(request);
            }
        }
        else
        {
            request.BeginLoad(callback);
            handle.StartCoroutine(LoadUrlAsset(request));
        }
        return true;
    }

    public static string GetAssetLocalPath(string path)
    {
        if (path == null)
        {
            return null;
        }
#if !PUBLISH
        return AssetCaching.GetUrl(path, null);
#else
        path = GetNewPathExt(path);
        ResInfo info = null;
        if (assetbundlePathDictionary.TryGetValue(path, out info))
        {
            if (!info.localCached)
            {
                return null;
            }
            var builder = new StringBuilder();
#if UNITY_STANDALONE || UNITY_EDITOR
            builder.Append("file:///");
#else
            builder.Append("file://");
#endif
            if (info.isBuildin)
            {
                builder.Append(AssetCaching.streamingAssetsPath);
            }
            else
            {
                builder.Append(AssetCaching.persistentDataPath);
            }
            builder.Append("/");
            builder.Append(path);
            return builder.ToString();
        }
        return null;
#endif
    }

    /// <summary>
    /// 根据路径同步加载指定资源
    /// </summary>
    /// <param name="path">路径名称(Assets目录下资源，包括打包后的结构)</param>
    public static Asset LoadAsset(string path)
    {
        if (path == null)
        {
            return null;
        }
        path = GetNewPathExt(path);
        Asset asset = null;
        assets.TryGetValue(path, out asset);
        if (asset == null)
        {
            return null;
        }
        else
        {
            asset.ResetCollect(asset.autoCollect);
            return asset;
        }
    }
    public static void LoadTextFromFullUrl(string url, System.Action<string, string> callback)
    {
        handle.StartCoroutine(LoadFromFullUrl(url, callback));
    }
    public static void LoadTextFromFullUrlByPost(string url, string post, System.Action<string, string> callback)
    {
        handle.StartCoroutine(LoadFromFullUrlByPost(url, post, callback));
    }

    static void LoadNewAssetCheck(int index)
    {
        var loadQueue = loadQueueList[index];
        if (loadingRequestList[index] == null)
        {
            while (loadQueue.Count > 0)
            {
                var request = loadQueue.Dequeue();
                if (request.hasCallback)
                {
                    loadingRequestList[index] = request;
                    handle.StartCoroutine(LoadAssetsCoroutine(request));
                    break;
                }
            }
        }
    }

    static void DownloadNewAssetCheck()
    {
        if (downloadingRequest == null)
        {
            while (downloadQueue.Count > 0)
            {
                var request = downloadQueue.Dequeue();
                if (request.hasCallback)
                {
                    downloadingRequest = request;
                    handle.StartCoroutine(DownloadAssetsCoroutine(request));
                    break;
                }
            }
        }
    }
    static void DownloadNewCheck(int index)
    {
        var downloadQueue = downloadList[index];
        if (downloadRequestList[index] == null)
        {
            while (downloadQueue.Count > 0)
            {
                var request = downloadQueue.Dequeue();
                if (request.hasCallback)
                {
                    downloadRequestList[index] = request;
                    handle.StartCoroutine(DownloadRequest(request));
                    break;
                }
            }
        }
    }

    static IEnumerator LoadAssetsCoroutine(AssetRequest request)
    {
        //var time = UnityEngine.Time.realtimeSinceStartup;
        if (request.multiLoad)
        {
            for (int i = request.loadCount, len = request.maxCount; i < len; i++)
            {
                var asset = request.requestList[i];
                handle.StartCoroutine(LoadAssetCoroutine(i, request, asset));
            }
            while (!request.isDone)
            {
                if (request.error != null || !request.hasCallback)
                {
                    break;
                }
                yield return 1;
            }
        }
        else
        {
            for (int i = request.loadCount, len = request.maxCount; i < len; i++)
            {
                var asset = request.requestList[i];
                yield return LoadAssetCoroutine(i, request, asset);
                if (request.error != null || !request.hasCallback)
                {
                    break;
                }
            }
        }
        //Debug.Log("cost:" + (UnityEngine.Time.realtimeSinceStartup - time) + "  request.maxCount:" + request.maxCount + "   main:" + request.mainAsset.path);
        request.EndLoad();
        var index = (int)request.priority;
        loadingRequestList[index] = null;
        LoadNewAssetCheck(index);
    }

    static IEnumerator LoadAssetCoroutine(int index, AssetRequest request, Asset asset)
    {
        while (asset.info.isDownloadOrLoad || !asset.isDependencyReady)
        {
            yield return 1;
        }
        if (asset.loaded)
        {
            request.LoadNextOver(index, null);
            yield break;
        }
        asset.info.isDownloadOrLoad = true;
#if PUBLISH
        WWWCaching wwwCaching = null;
        if (asset.info.isBuildin)
        {
            wwwCaching = WWWCaching.LoadFromBuildin(request.priority, asset.path, asset.info.raw);
        }
        else
        {
            wwwCaching = WWWCaching.LoadFromCache(request.priority, asset.path, asset.info.raw);
        }
        request.LoadNextBegin(index, wwwCaching);
        yield return wwwCaching;
        if (wwwCaching.error != null)
        {
            if (wwwCaching.error.StartsWith("Couldn't read"))
            {
                wwwCaching.Dispose();
                Debug.LogWarning("asset:" + asset.path + " Couldn't read." + " isRemote:" + isRemote);
                asset.info.Update(false);
                AssetCaching.SetFileDownloaded(asset.info.tagPos, asset.info.GetNewTag());
            }
            request.LoadNextOver(index, wwwCaching.error);
        }
        else
        {
            //错误处理，可能从包外加载一个已经被删除的资源，这里要进行回滚操作
            if (wwwCaching.useWWWLoad)
            {
                asset.OnLoad(wwwCaching.GetWWWBytes());
                request.LoadNextOver(index, null);
            }
            else
            {
                if (wwwCaching.assetBundle == null)
                {
                    wwwCaching.Dispose();
                    Debug.LogWarning("asset:" + asset.path + " already been deleted but still try to load from file." + " isRemote:" + isRemote);
                    asset.info.Update(false);
                    AssetCaching.SetFileDownloaded(asset.info.tagPos, asset.info.GetNewTag());
                    //这里取消标记，下次启动会重新获取文件
                    request.LoadNextOver(index, "file miss");
                }
                else
                {
                    var bundle = wwwCaching.assetBundle;
                    asset.OnLoad(bundle);
                    if (bundle.isStreamedSceneAssetBundle)
                    {
                    }
                    else
                    {
                        var assetRequest = bundle.LoadAllAssetsAsync();
                        assetRequest.priority = (int)wwwCaching.priority;
                        yield return assetRequest;
                        asset.OnLoad(assetRequest.asset);
                    }
                    asset.MarkLoaded();
                    wwwCaching.assetBundle = null;
                    request.LoadNextOver(index, null);
                }
            }
        }
        wwwCaching.Dispose();
#else
        var url = asset.info.url;
        request.LoadNextBegin(index, null);
        if (!Exist(url))
        {
            request.LoadNextOver(index, "资源不存在  " + url);
        }
        else
        {
            request.LoadNextOver(index, null);
            Object obj = UnityEditor.AssetDatabase.LoadAssetAtPath<Object>(AssetCaching.GetUrl(url, null));
            if (url.StartsWith("raw"))
            {
                asset.OnLoad((obj as TextAsset).bytes);
            }
            else
            {
                asset.OnLoad(obj);
            }
        }
        asset.MarkLoaded();
#endif
        asset.info.isDownloadOrLoad = false;
    }
    static IEnumerator DownloadAssetsCoroutine(AssetRequest request)
    {
        for (int i = request.loadCount, len = request.maxCount; i < len; i++)
        {
            var asset = request.requestList[i];
            var info = asset.info;
            if (info.isBuildin || info.downloaded)
            {
                continue;
            }
            if (info.isDownloadOrLoad)
            {
                yield return 10;
                while (info.isDownloadOrLoad)
                {
                    yield return 10;
                }
                if (info.downloaded)
                {
                    continue;
                }
                else
                {
                    request.LoadNextOver(i, "download failed");
                    break;
                }
            }
            //正在下载的资源要打上标记，否则会引起异常
            info.isDownloadOrLoad = true;
            var wwwCaching = WWWCaching.Download(request.priority, info.url, info.hashCode, info.size, info.raw ? AssetDecompressType.None : AssetDecompressType.Lzma);
            yield return wwwCaching;
            if (wwwCaching.error != null)
            {
                request.LoadNextOver(i, wwwCaching.error);
                wwwCaching.Dispose();
            }
            else
            {
                wwwCaching.Dispose();

                info.Update(true);
                AssetCaching.SetFileDownloaded(info.tagPos, info.GetNewTag());
            }
            info.isDownloadOrLoad = false;
            if (request.error != null)
            {
                break;
            }
            if (!request.hasCallback)
            {
                break;
            }
        }

        if (request.error != null || !request.hasCallback)
        {
            request.EndLoad();
        }
        else
        {
            loadQueueList[(int)request.priority].Enqueue(request);
        }
        downloadingRequest = null;
        DownloadNewAssetCheck();
        LoadNewAssetCheck((int)request.priority);
    }

    static IEnumerator DownloadRequest(DownloadRequest request)
    {
        for (int i = request.loadCount, len = request.maxCount; i < len; i++)
        {
            var info = request.requestList[i];
            if (info.isBuildin || info.downloaded)
            {
                request.LoadNextOver(null);
                continue;
            }
            if (info.isDownloadOrLoad)
            {
                yield return 10;
                while (info.isDownloadOrLoad)
                {
                    yield return 10;
                }
                if (info.downloaded)
                {
                    request.LoadNextOver(null);
                    continue;
                }
                else
                {
                    request.LoadNextOver("download failed");
                    break;
                }
            }
            //正在下载的资源要打上标记，否则会引起异常
            info.isDownloadOrLoad = true;
            var wwwCaching = WWWCaching.Download(request.priority, info.url, info.hashCode, info.size, info.raw ? AssetDecompressType.None : AssetDecompressType.Lzma);
            request.LoadNextBegin(wwwCaching);
            yield return wwwCaching;
            if (wwwCaching.error != null)
            {
                request.LoadNextOver(wwwCaching.error);
                wwwCaching.Dispose();
            }
            else
            {
                request.LoadNextOver(null);
                wwwCaching.Dispose();

                info.Update(true);
                AssetCaching.SetFileDownloaded(info.tagPos, info.GetNewTag());
            }
            info.isDownloadOrLoad = false;
            if (request.error != null)
            {
                break;
            }
            if (!request.hasCallback)
            {
                break;
            }
        }
        request.EndLoad();
        var index = (int)request.priority;
        downloadRequestList[index] = null;
        DownloadNewCheck(index);
    }
#if PUBLISH
    /// <summary>
    /// 检查版本
    /// </summary>
    static IEnumerator UpdateConfigs(bool onlyFromCache, System.Action<string> callback, System.Action<float> updateCallback)
    {
        AssetCaching.OnDestroy();
        bool updateAB = false;
        byte[] assetbundlePathBytes = null;
        bool getDiffData = false;
        if (onlyFromCache)
        {
            assetbundleVersion = AssetCaching.GetVersion();
            var assetbundlePathWWW = WWWCaching.LoadFromCache(AssetPriority.High1, assetbundlePathConfigName, true);
            yield return assetbundlePathWWW;
            if (!string.IsNullOrEmpty(assetbundlePathWWW.error))
            {
                ClearConfigStatus();
                callback("onlyFromCache break");
                yield break;
            }
            assetbundlePathBytes = assetbundlePathWWW.GetWWWBytes();
            assetbundlePathWWW.Dispose();
        }
        else
        {
            var localABVersion = assetbundleVersion;
            bool tishen = false;

            WWW tishenVer = new WWW(AssetCaching.GetUrl("tishen.txt?v=" + System.DateTime.Now.Ticks, null));
            yield return tishenVer;
            if (string.IsNullOrEmpty(tishenVer.error))
            {
                string[] vers = tishenVer.text.Trim().Split(',');
                tishen = System.Array.IndexOf<string>(vers, Application.version) >= 0;
                tishenVer.Dispose();
            }

            if (!tishen)
            {
                //验证版本号
                WWW versionWWW = new WWW(AssetCaching.GetUrl("version.txt?v=" + System.DateTime.Now.Ticks, null));
                yield return versionWWW;
                if (string.IsNullOrEmpty(versionWWW.error))
                {
                    int newVersion = 0;
                    int.TryParse(versionWWW.text, out newVersion);
                    assetbundleVersion = newVersion;
                    versionWWW.Dispose();
                }
                else
                {
                    ClearConfigStatus();
                    callback(versionWWW.error + "<url>:" + versionWWW.url);
                    yield break;
                }
                updateAB = assetbundleVersion > localABVersion;
            }
            if (updateAB)
            {
                Debug.Log("update version " + localABVersion + " to " + assetbundleVersion);
                if (localABVersion > 0 && (assetbundleVersion - localABVersion) <= 10)
                {
                    //下载assetbundle和其他资源的配置表
                    WWW diffWWW = new WWW(AssetCaching.GetUrl("vupdates/" + assetbundleVersion + "/" + localABVersion + ".ab", null));
                    while (!diffWWW.isDone)
                    {
                        updateCallback(diffWWW.progress);
                        yield return 1;
                    }
                    //如果更新出错，无论如何都去下载全量的配置表
                    if (string.IsNullOrEmpty(diffWWW.error))
                    {
                        assetbundlePathBytes = AssetCaching.DecompressLZMA(diffWWW.bytes);
                        if (assetbundlePathBytes != null)
                        {
                            getDiffData = true;
                        }
                        else
                        {
                            Debug.LogWarning("diff analysis error");
                        }
                    }
                    else
                    {
                        Debug.LogWarning("downloaddiff error:" + diffWWW.error + "  url:" + diffWWW.url);
                    }
                }
                if (!getDiffData)
                {
                    //下载assetbundle和其他资源的配置表
                    WWW www = new WWW(AssetCaching.GetUrl(assetbundlePathConfigName, assetbundleVersion.ToString()));
                    while (!www.isDone)
                    {
                        updateCallback(www.progress);
                        yield return 1;
                    }
                    //Debug.Log("downloadconfig size:" + www.size);
                    if (!string.IsNullOrEmpty(www.error))
                    {
                        ClearConfigStatus();
                        callback(www.error + "<url>:" + www.url);
                        yield break;
                    }
                    //解压到内存
                    assetbundlePathBytes = AssetCaching.DecompressLZMA(www.bytes);
                    www.Dispose();
                    if (assetbundlePathBytes == null)
                    {
                        ClearConfigStatus();
                        callback("config error");
                        yield break;
                    }
                }
            }
            if (updateAB)
            {
                //清理所有资源，因为有更新
                yield return ClearAllAssets(true);
            }
        }
        //assetbundle
        if (assetbundlePathBytes != null)
        {
            if (updateAB)
            {
                string error = null;
                if (getDiffData)
                {
                    error = AssetCaching.ReadABConfigDataWithDiff(ref assetbundlePathDictionary, assetbundlePathBytes);
                }
                else
                {
                    assetbundlePathDictionary = AssetCaching.ReadABConfigData(assetbundlePathBytes, assetbundlePathDictionary);
                    if (assetbundlePathDictionary == null)
                    {
                        ClearConfigStatus();
                        callback("网络下载的二进制数据无法被解析");
                        yield break;
                    }
                    //把文件从内存写入到磁盘
                    var writer = new AssetWriter(AssetDecompressType.None, assetbundlePathBytes, assetbundlePathConfigName, false, AssetPriority.High1);
                    writer.Close();
                    error = writer.error;
                }
                if (error != null)
                {
                    ClearConfigStatus();
                    callback("写入配置数据失败:" + error);
                    yield break;
                }
                else
                {
                    AssetCaching.SetVersion(assetbundleVersion);
                }
            }
            else
            {
                assetbundlePathDictionary = AssetCaching.ReadABConfigData(assetbundlePathBytes);
                if (assetbundlePathDictionary == null)
                {
                    ClearConfigStatus();
                    callback("本地配置文件被破坏或者不完整");
                    yield break;
                }
                if (onlyFromCache)
                {
                    assetbundlePathDictionaryBackup = assetbundlePathDictionary;
                }
                else
                {
                    assetbundlePathDictionaryBackup = null;
                }
            }
        }
        callback(null);
    }
#endif
    static IEnumerator LoadFromFullUrl(string url, System.Action<string, string> callback)
    {
        WWW www = new WWW(url);
        yield return www;
        if (!string.IsNullOrEmpty(www.error))
        {
            callback(www.error + "<url>:" + www.url, null);
        }
        else
        {
            var bytes = www.bytes;
            var str = System.Text.Encoding.UTF8.GetString(bytes, 0, bytes.Length);
            callback(null, str);
        }
        www.Dispose();
    }

    static IEnumerator LoadFromFullUrlByPost(string url, string postData, System.Action<string, string> callback)
    {
        Dictionary<string, string> headers = new Dictionary<string, string>();
        headers.Add("Conten-Type", "application/x-www-form-urlencoded");
        byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(postData);
        WWW www = new WWW(url, byteArray, headers);
        yield return www;
        if (!string.IsNullOrEmpty(www.error))
        {
            callback(www.error, null);
        }
        else
        {
            var bytes = www.bytes;
            var str = System.Text.Encoding.UTF8.GetString(bytes, 0, bytes.Length);
            callback(null, str);
        }
        www.Dispose();
    }


    static IEnumerator LoadUrlAsset(UrlAssetRequest request)
    {
        WWW www = new WWW(request.url);
        yield return www;
        if (!string.IsNullOrEmpty(www.error))
        {
            request.EndLoad(www.error + "<url>:" + www.url, null);
        }
        else
        {
            if (request.hasCallback)
            {
                var asset = new UrlAsset();
                switch (request.urlAssetType)
                {
                    case UrlAssetType.Bytes:
                        asset.bytes = www.bytes;
                        break;
                    case UrlAssetType.Text:
                        var bytes = www.bytes;
                        asset.text = System.Text.Encoding.UTF8.GetString(bytes, 0, bytes.Length);
                        break;
                    case UrlAssetType.Texture:
                        asset.texture = www.texture;
                        break;
                }
                request.EndLoad(null, asset);
            }
        }
        www.Dispose();
        if (request.mainAsset != null)
        {
            if (request.cache)
            {
                urlAssets[request.url] = request.mainAsset;
            }
            else
            {
                urlAssetsNoCache.Add(request.mainAsset);
            }
        }
    }

    /// <summary>
    /// 立即释放制定路径的资源
    /// </summary>
    /// <param name="path">路径名称</param>
    public static bool ReleaseAsset(string path)
    {
        path = GetNewPathExt(path);
        Asset asset = null;
        assets.TryGetValue(path, out asset);
        if (asset == null)
        {
            Debug.LogError("无法释放资源：" + path + " 该资源不存在");
            return false;
        }
        else
        {
            return ResLoader.ReleaseAsset(asset);
        }
    }
    /// <summary>
    /// 立即释放制定路径的资源
    /// </summary>
    /// <param name="path">路径名称</param>
    public static bool ReleaseAsset(Asset asset)
    {
        //Debug.Log("资源自动释放内存："+asset.path);
        assets.Remove(asset.path);
        asset.Unload();
        return true;
    }
    /// <summary>
    /// 释放所有资源
    /// </summary>
    static void ClearAll(bool clearConfig, bool clearAssets)
    {
        isCleaning = true;
        handle.StopAllCoroutines();
        if (clearConfig)
        {
            ClearConfigStatus();
        }
        AssetCaching.OnDestroy();
        handle.StartCoroutine(ClearAllAssets(clearAssets));
    }
    static IEnumerator ClearAllAssets(bool clearAssets)
    {
        foreach (var requestQueue in loadQueueList)
        {
            foreach (var request in requestQueue)
            {
                request.Dispose();
            }
            requestQueue.Clear();
        }

        for (int i = 0; i < loadingRequestList.Length; i++)
        {
            if (loadingRequestList[i] != null)
            {
                loadingRequestList[i].Dispose();
                loadingRequestList[i] = null;
            }
        }

        foreach (var request in downloadQueue)
        {
            request.Dispose();
        }
        downloadQueue.Clear();
        if (downloadingRequest != null)
        {
            downloadingRequest.Dispose();
            downloadingRequest = null;
        }

        foreach (var requestQueue in downloadList)
        {
            foreach (var request in requestQueue)
            {
                request.Dispose();
            }
            requestQueue.Clear();
        }

        for (int i = 0; i < downloadRequestList.Length; i++)
        {
            if (downloadRequestList[i] != null)
            {
                downloadRequestList[i].Dispose();
                downloadRequestList[i] = null;
            }
        }

        if (clearAssets)
        {
            //卸载全部资源的时候，要逐步卸载关联，否则会引起错误
            List<Asset> unloadAbleList = new List<Asset>(assets.Count);
            foreach (KeyValuePair<string, Asset> pair in assets)
            {
                var asset = pair.Value;
                if (asset.unloadAble)
                {
                    asset.Unload();
                }
                else
                {
                    unloadAbleList.Add(asset);
                }
            }
            while (unloadAbleList.Count > 0)
            {
                int unloadCount = 0;
                for (int i = unloadAbleList.Count - 1; i >= 0; i--)
                {
                    var asset = unloadAbleList[i];
                    if (asset.unloadAble)
                    {
                        asset.Unload();
                        unloadAbleList.RemoveAt(i);
                        unloadCount++;
                    }
                }
                if (unloadCount == 0)
                {
                    break;
                }
            }
            assets.Clear();
            foreach (var asset in unloadAbleList)
            {
                assets[asset.path] = asset;
                if (asset.operatingCount > 0)
                {
                    Debug.LogWarning("资源引用错误，请检查逻辑" + asset.path);
                }
            }
        }
        yield return clearMemory(true);
        isCleaning = false;
    }


    static void ClearConfigStatus()
    {
#if PUBLISH
        assetbundlePathDictionary = assetbundlePathDictionaryBackup;
        assetbundleVersion = AssetCaching.GetVersion();
#endif
    }

    /// <summary>
    /// 释放内存
    /// </summary>
    public static void ClearMemoryInternal(bool unloadRes)
    {
        handle.StartCoroutine(clearMemory(unloadRes));
    }

    /// <summary>
    /// 释放内存
    /// </summary>
    public static void ClearMemory(float timeDelta, bool triggerGC)
    {
        if (isCleaning)
        {
            return;
        }
        List<Asset> releaseAssets = new List<Asset>();
        while (true)
        {
            foreach (Asset asset in assets.Values)
            {
                if (asset.Collect(timeDelta))
                {
                    releaseAssets.Add(asset);
                }
            }
            for (int i = 0, length = releaseAssets.Count; i < length; i++)
            {
                //Debug.Log("资源卸载："+ releaseAssets[i].path);
                ResLoader.ReleaseAsset(releaseAssets[i]);
            }
            if (triggerGC && releaseAssets.Count > 0)
            {
                releaseAssets.Clear();
            }
            else
            {
                break;
            }
        }

        if (urlAssets.Count > 0)
        {
            List<string> unloads = new List<string>();
            foreach (var pair in urlAssets)
            {
                if (pair.Value.Unload(timeDelta))
                {
                    unloads.Add(pair.Key);
                }
            }
            for (int i = 0; i < unloads.Count; i++)
            {
                urlAssets.Remove(unloads[i]);
            }
        }
        if (urlAssetsNoCache.Count > 0)
        {
            for (int i = urlAssetsNoCache.Count - 1; i >= 0; i--)
            {
                if (urlAssetsNoCache[i].Unload(timeDelta))
                {
                    urlAssetsNoCache.RemoveAt(i);
                }
            }
        }

        if (triggerGC)
        {
            ClearMemoryInternal(true);
        }
    }

    static IEnumerator clearMemory(bool unloadRes)
    {
        if (unloadRes)
        {
            AsyncOperation async = Resources.UnloadUnusedAssets();
            yield return async;
            System.GC.Collect();
        }
        else
        {
            yield return 1;
            System.GC.Collect();
        }
    }

    public static string[] GetAllAssetBundleNameList()
    {
        if (assetbundlePathDictionary == null)
        {
            return null;
        }
        var nameList = new string[assetbundlePathDictionary.Keys.Count];
        assetbundlePathDictionary.Keys.CopyTo(nameList, 0);
        return nameList;
    }

    public static string[] GetAssetBundleNameList(string[] list)
    {
        if (assetbundlePathDictionary == null || list == null)
        {
            return null;
        }
        List<string>[] pathList = new List<string>[list.Length];
        for (int i = 0, len = list.Length; i < len; i++)
        {
            pathList[i] = new List<string>(1024);
        }
        foreach (string name in assetbundlePathDictionary.Keys)
        {
            for (int i = 0, len = list.Length; i < len; i++)
            {
                var path = list[i];
                if (name.StartsWith(path))
                {
                    pathList[i].Add(name);
                    break;
                }
            }
        }
        int count = 0;
        for (int i = 0, len = list.Length; i < len; i++)
        {
            count += pathList[i].Count;
        }
        string[] finalList = new string[count];
        int index = 0;
        for (int i = 0, len = list.Length; i < len; i++)
        {
            var p = pathList[i];
            for (int j = 0, c = p.Count; j < c; j++)
            {
                finalList[index + j] = p[j];
            }
            index += p.Count;
        }
        return finalList;
    }
    public static string[] ValidStringList(string[] strList)
    {
        var len = strList.Length;
        List<string> newList = new List<string>(len);
        for (int i = 0; i < len; i++)
        {
            var str = strList[i];
            if (ResLoader.Exist(str))
            {
                newList.Add(str);
            }
        }
        return newList.ToArray();
    }
}