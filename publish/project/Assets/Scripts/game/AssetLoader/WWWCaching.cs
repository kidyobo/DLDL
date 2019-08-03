using System;
using System.IO;
using UnityEngine;
using System.Text;

/// <summary>
/// 类似WWW的操作类，可自动缓存游戏对象
/// </summary>
public class WWWCaching : CustomYieldInstruction
{
    public override bool keepWaiting
    {
        get
        {
            if (this.disposed)
            {
                return false;
            }
            if (status == CachingStatus.Download)
            {
                if (www.isDone)
                {
                    string e = www.error;
                    if (string.IsNullOrEmpty(e) && size > 0 && size != www.size && decompressType == AssetDecompressType.None)
                    {
                        e = "文件下载不完整" + " local:" + size + "  server:" + www.size + " url:" + www.url;
                    }
                    if (string.IsNullOrEmpty(e))
                    {
                        writer = new AssetWriter(decompressType, www.bytes, fileName, true, priority);
                        status = CachingStatus.Caching;
                    }
                    else
                    {
                        this.error = e + " url:" + www.url;
                        status = CachingStatus.Completed;
                    }
                }
            }
            else if (status == CachingStatus.Caching)
            {
                if (writer.isDone)
                {
                    if (www != null)
                    {
                        www.Dispose();
                        www = null;
                    }
                    if (writer.error == null)
                    {
                        if (readOperation)
                        {
                            LoadAssetInternal();
                            status = CachingStatus.Read;
                        }
                        else
                        {
                            status = CachingStatus.Completed;
                        }
                    }
                    else
                    {
                        this.error = writer.error;
                        status = CachingStatus.Completed;
                    }
                    writer.Close();
                    writer = null;
                }
            }
            else if (status == CachingStatus.Read)
            {
                //从磁盘加载
                if (useWWWLoad)
                {
                    if (www.isDone)
                    {
                        if (!string.IsNullOrEmpty(www.error))
                        {
                            this.error = www.error;
                        }
                        status = CachingStatus.Completed;
                    }
                }
                else
                {
                    if (abRequest == null)
                    {
                        if (www.isDone)
                        {
                            if (!string.IsNullOrEmpty(www.error))
                            {
                                this.error = www.error;
                                status = CachingStatus.Completed;
                            }
                            else
                            {
                                var bytes = www.bytes;
                                //需要修改bytes
                                if (AssetCaching.buildinKey != null) EncryptAB.decrypt(bytes, AssetCaching.buildinKey);

                                assetBundle = AssetBundle.LoadFromMemory(bytes);
                                status = CachingStatus.Completed;
                            }
                        }
                    }
                    else
                    {
                        if (abRequest.isDone)
                        {
                            assetBundle = abRequest.assetBundle;
                            abRequest = null;
                            status = CachingStatus.Completed;
                        }
                    }
                }
            }

            if (status == CachingStatus.Completed)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    }
    /// <summary>
    /// 嵌套的WWW对象
    /// </summary>
    private WWW www = null;
    /// <summary>
    /// 嵌套的WWW对象
    /// </summary>
    private AssetBundleCreateRequest abRequest = null;
    public AssetBundle assetBundle = null;
    private AssetDecompressType decompressType = AssetDecompressType.None;
    private int size;
    public bool useWWWLoad
    {
        private set;
        get;
    }

    private bool readOperation = false;

    private string hashCode = null;
    public bool willDownload
    {
        get
        {
            return hashCode != null;
        }
    }
    private string fileName = null;
    public bool disposed
    {
        private set;
        get;
    }
    private bool buildinRead = false;

    private AssetWriter writer = null;
    /// <summary>
    /// 获取操作进度
    /// </summary>
    public float progress
    {
        get
        {
            if (status == CachingStatus.Completed)
            {
                return 1;
            }
            if (hashCode != null)
            {
                //资源如果有下载的，忽略加载的时间
                return www == null ? 1 : www.progress;
            }
            else
            {
                //非下载模式
                if (useWWWLoad)
                {
                    return www.progress;
                }
                else
                {
                    return abRequest == null ? 0 : abRequest.progress;
                }
            }
        }
    }
    /// <summary>
    /// 操作错误信息
    /// </summary>
    public string error
    {
        private set;
        get;
    }
    /// <summary>
    /// 操作优先级
    /// </summary>
    public AssetPriority priority
    {
        private set;
        get;
    }
    private CachingStatus status = CachingStatus.Completed;

    //下载和缓存加载的构造函数
    private WWWCaching(AssetPriority priority, string fileName, string hashCode, bool readOperation, bool buildinRead, bool useWWWLoad)
    {
        this.priority = priority;
        this.hashCode = hashCode;
        this.fileName = fileName;
        this.readOperation = readOperation;
        this.buildinRead = buildinRead;
        if (useWWWLoad)
        {
            this.useWWWLoad = true;
        }
        if (hashCode != null)
        {
            status = CachingStatus.Download;
            this.www = new WWW(AssetCaching.GetUrl(fileName, hashCode));
            this.www.threadPriority = AssetCaching.ConvertUnityPriority(priority);
        }
        else if (readOperation)
        {
            status = CachingStatus.Read;
            LoadAssetInternal();
        }
    }
#if DEVELOP
    static StreamWriter textWriter = null;
#endif
    /// <summary>
    /// 从网络上下载一个资源到本地
    /// </summary>
    public static WWWCaching Download(AssetPriority priority, string fileName, string hashCode,int size, AssetDecompressType decompressType)
    {
#if DEVELOP
        if (textWriter == null)
        {
            var builder = new StringBuilder();
            builder.Append(AssetCaching.persistentDataPath);
            builder.Append("/");
            builder.Append("downloadRecord.txt");
            var path = builder.ToString();
            if (!File.Exists(path))
            {
                File.WriteAllText(path, "");
                textWriter = File.AppendText(path);
            }
            else
            {
                textWriter = File.AppendText(path);
            }
            textWriter.AutoFlush = true;
        }
        textWriter.WriteLine(fileName);
#endif
        WWWCaching caching = new WWWCaching(priority, fileName, hashCode, false, false, false);
        caching.decompressType = decompressType;
        caching.size = size;
        return caching;
    }
    /// <summary>
    /// 从本地缓存获取一个资源到内存
    /// </summary>
    public static WWWCaching LoadFromCache(AssetPriority priority, string fileName, bool useWWWLoad)
    {
        WWWCaching caching = new WWWCaching(priority, fileName, null, true, false, useWWWLoad);
        return caching;
    }
    /// <summary>
    /// 从包内获取一个资源到内存
    /// </summary>
    public static WWWCaching LoadFromBuildin(AssetPriority priority, string fileName, bool useWWWLoad)
    {
        WWWCaching caching = new WWWCaching(priority, fileName, null, true, true, useWWWLoad);
        return caching;
    }

    /// <summary>
    /// 从网络获取一个资源到内存
    /// </summary>
    public static WWWCaching LoadFromDownload(AssetPriority priority, string fileName, string hashCode, int size, bool assetBundleUseWWW, AssetDecompressType decompressType)
    {
        WWWCaching caching = new WWWCaching(priority, fileName, hashCode, true, false, assetBundleUseWWW);
        caching.decompressType = decompressType;
        caching.size = size;
        return caching;
    }

    void LoadAssetInternal()
    {
        var builder = new StringBuilder();
        if (useWWWLoad || (buildinRead && AssetCaching.buildinKey != null))
        {
            if (buildinRead)
            {
#if UNITY_STANDALONE || UNITY_EDITOR
                builder.Append("file:///");
#elif UNITY_IPHONE
                builder.Append("file://");
#endif
                builder.Append(AssetCaching.streamingAssetsPath);
            }
            else
            {
#if UNITY_STANDALONE || UNITY_EDITOR
                builder.Append("file:///");
#else
                builder.Append("file://");
#endif
                builder.Append(AssetCaching.persistentDataPath);
            }
            builder.Append("/");
            if (buildinRead && AssetCaching.buildinKey != null)
            {
                fileName = GetNewFileName(fileName);
            }
            builder.Append(fileName);
            this.www = new WWW(builder.ToString());
            this.www.threadPriority = AssetCaching.ConvertUnityPriority(priority);
        }
        else
        {
            if (buildinRead)
            {
                builder.Append(AssetCaching.streamingAssetsPath);
            }
            else
            {
                builder.Append(AssetCaching.persistentDataPath);
            }
            builder.Append("/");
            builder.Append(fileName);
            abRequest = AssetBundle.LoadFromFileAsync(builder.ToString());
            abRequest.priority = (int)priority;
        }
    }


    public static string GetNewFileName(string fileName)
    {
        string newFileName = "";
        string[] list = fileName.Split('/');
        if (list.Length > 0)
        {
            int length = list.Length - 1;
            string last = list[length];
            for (int i = 0; i < length; i++)
            {
                newFileName = newFileName + (game.Config.gameid + "lan" + list[i] + AssetCaching.buildinKey) + "/";
            }
            string[] lastList = last.Split('.');
            if (lastList.Length >= 2)
            {
                newFileName = newFileName + (AssetCaching.buildinKey + lastList[0] + "Om" + game.Config.gameid) + "." + lastList[1];
            }
            else
            {
                newFileName = newFileName + last;
            }
        }
        if (newFileName == "")
        {
            newFileName = fileName;
        }
        return newFileName;
    }




    public void Dispose()
    {
        if (this.status != CachingStatus.Completed)
        {
            this.status = CachingStatus.Completed;
            this.error = "canceled";
        }
        if (abRequest != null)
        {
            while (!abRequest.isDone) { }
            assetBundle = abRequest.assetBundle;
            abRequest = null;
        }

        if (writer != null)
        {
            writer.Close();
            writer = null;
        }
        if (assetBundle != null)
        {
            assetBundle.Unload(true);
            assetBundle = null;
        }
        if (www != null)
        {
            www.Dispose();
            www = null;
        }
        disposed = true;
    }

    public byte[] GetWWWBytes()
    {
        var bytes = this.www.bytes;
        if (buildinRead && AssetCaching.buildinKey != null)
        {
            //需要修改bytes
            EncryptAB.decrypt(bytes, AssetCaching.buildinKey);
            return bytes;
        }
        else
        {
            return bytes;
        }
    }
}
enum CachingStatus
{
    Download,
    Caching,
    Read,
    Completed,
}