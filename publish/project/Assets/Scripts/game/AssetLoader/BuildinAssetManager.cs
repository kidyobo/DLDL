using UnityEngine;
using System.Collections.Generic;
using System.Text;
public class BuildinAssetManager : MonoBehaviour
{
    static Dictionary<string, string> abList = new Dictionary<string, string>(1024);
    /// <summary>
    /// 检查Streaming是否已经解压到外部
    /// </summary>
    public static bool isReady
    {
        private set;
        get;
    }
    public static void Reload()
    {
        AssetCaching.DeleteFromCache(ResLoader.assetbundlePathConfigName);
        isReady = false;
        Load();
    }
    /// <summary>
    /// 开始释放包内资源
    /// </summary>
    public static void Load()
    {
        if (isReady)
        {
            return;
        }
#if PUBLISH
        var cache = GameObject.Find("_cache");
        if (cache != null)
        {
            //Debug.LogWarning("已经在执行解压操作了");
            return;
        }
        abList.Clear();
        cache = new GameObject("_cache");
        GameObject.DontDestroyOnLoad(cache);
        var mono = cache.AddComponent<BuildinAssetManager>();
        mono.StartCoroutine(mono.DecompressCoroutine());
#else
        isReady = true;
#endif
    }
    System.Collections.IEnumerator DecompressCoroutine()
    {
        var baseUrl = "";
        var builder = new StringBuilder();
#if UNITY_STANDALONE || UNITY_EDITOR
        builder.Append("file:///");
#elif UNITY_ANDROID

#else
        builder.Append("file://");
#endif
        builder.Append(AssetCaching.streamingAssetsPath);
        builder.Append("/");
        baseUrl = builder.ToString();
        builder.Append("buildin.bytes");
        WWW www = new WWW(builder.ToString());
        yield return www;
        if (!string.IsNullOrEmpty(www.error))
        {
            Debug.LogWarning(www.error);
            www.Dispose();
        }
        else
        {
            //解压操作
            //读取包内资源配置表
            var bytes = www.bytes;
            ByteArray byteArray = new ByteArray(bytes, null);
            byteArray.useLittleEndian = true;
            var length = byteArray.ReadInt32();
            for (int i = 0; i < length; i++)
            {
                var key = byteArray.ReadString();
                var md5 = byteArray.ReadString();
                abList[key] = md5;
            }
            www.Dispose();


            //如果本地没有缓存配置表或者配置表版本低于包内配置表版本，则建立或者覆盖缓存
            int abVersion = 0;
            int abVBuildin = int.Parse(abList[ResLoader.assetbundlePathConfigName]);

            bool assetbundleConfigCached = AssetCaching.IsCached(ResLoader.assetbundlePathConfigName);
            if (assetbundleConfigCached)
            {
                abVersion = AssetCaching.GetVersion();
            }
            if (abVBuildin > abVersion)
            {
                Debug.Log("解压包内资源");
                WWW bundleWWW = new WWW(baseUrl + ResLoader.assetbundlePathConfigName);
                yield return bundleWWW;
                //拷贝标记
                //读取旧的配置表和新的配置表作比较
                Dictionary<string, ResInfo> oldConfig = null;
                if (assetbundleConfigCached)
                {
                    var oldWWW = WWWCaching.LoadFromCache(AssetPriority.High1, ResLoader.assetbundlePathConfigName, true);
                    yield return oldWWW;
                    if (oldWWW.error != null)
                    {
                        Debug.LogWarning(oldWWW.error);
                    }
                    else
                    {
                        oldConfig = AssetCaching.ReadABConfigData(oldWWW.GetWWWBytes());
                    }
                    oldWWW.Dispose();
                }

                //解压到内存
                var configBytes = bundleWWW.bytes;
                if (AssetCaching.buildinKey != null)
                {
                    //需要修改configBytes
                    if (ResLoader.assetbundlePathConfigName.IndexOf("assetbundleconfiglist") < 0)
                    {
                        EncryptAB.decrypt(configBytes, AssetCaching.buildinKey);
                    }

                }


                //解压到内存
                var abBytes = AssetCaching.DecompressLZMA(configBytes);
                AssetCaching.ReadABConfigData(abBytes, oldConfig);
                //把文件从内存写入到磁盘
                var writer = new AssetWriter(AssetDecompressType.None, abBytes, ResLoader.assetbundlePathConfigName, false, AssetPriority.High1);
                writer.Close();
                bundleWWW.Dispose();
                AssetCaching.SetVersion(abVBuildin);
            }

            isReady = true;
            var cache = GameObject.Find("_cache");
            GameObject.Destroy(cache);
        }
    }
    /// <summary>
    /// 获取包内文件的MD5码，如果不存在，则返回null
    /// </summary>
    public static string GetAssetHashCode(string path)
    {
        string hashCode = null;
        abList.TryGetValue(path, out hashCode);
        return hashCode;
    }
}