using System.IO;
using System;
using UnityEngine;
using System.Text;
using System.Collections.Generic;
/// <summary>
/// 管理本地缓存
/// </summary>
public class AssetCaching
{
    public static int version = 2;
    public static string buildinKey = null;
    private static string _persistentDataPath = null;
    public static string persistentDataPath
    {
        get
        {
            if (_persistentDataPath == null)
            {
#if UNITY_STANDALONE&&!UNITY_EDITOR
                _persistentDataPath = Path.Combine(Application.dataPath, "GameAssets");
#else
                _persistentDataPath = Application.persistentDataPath;
#endif
            }
            return _persistentDataPath;
        }
    }
    private static string _streamingAssetsPath = null;
    public static string streamingAssetsPath
    {
        get
        {
            if (_streamingAssetsPath == null)
            {
                _streamingAssetsPath = Application.streamingAssetsPath;
            }
            return _streamingAssetsPath;
        }
    }
#if PUBLISH
    /// <summary>
    /// 平台字符串
    /// </summary>
#if UNITY_STANDALONE_WIN
    static readonly string platformStr = "windows";
#elif UNITY_STANDALONE_OSX
    static readonly string platformStr = "mac";
#elif UNITY_STANDALONE_LINUX
    static readonly string platformStr = "linux";
#elif UNITY_ANDROID
    static readonly string platformStr = "android";
#elif UNITY_IOS
    static readonly string platformStr = "ios";
#endif
    /// <summary>
    /// 远程资源根目录
    /// </summary>
    readonly static string remoteAssetBundleRoot = game.Config.remoteResUrl + "assets/" + platformStr;
#else
    readonly static string remoteAssetBundleRoot = "Assets/AssetSources";
#endif
    public static string GetUrl(string url, string hashCode)
    {
        var builder = new StringBuilder();
        builder.Append(remoteAssetBundleRoot);
        builder.Append("/");
        if (hashCode == null)
        {
            builder.Append(url);
        }
        else
        {
            builder.Append(AppendHash(url, hashCode));
        }
        return builder.ToString();
    }
    /// <summary>
    /// 清理本地缓存
    /// </summary>
    public static void CleanCache()
    {
        if (!Application.isPlaying)
        {
            var files = Directory.GetFiles(persistentDataPath);
            foreach (string file in files)
            {
                File.Delete(file);
            }
        }
        var pathList = Directory.GetDirectories(persistentDataPath);
        for (int i = 0, length = pathList.Length; i < length; i++)
        {
            var files = Directory.GetFiles(pathList[i]);
            foreach (string file in files)
            {
                File.Delete(file);
            }
            Directory.Delete(pathList[i], true);
        }
    }
    /// <summary>
    /// 从本地缓存中删除一个文件
    /// </summary>
    /// <param name="url"></param>
    public static void DeleteFromCache(string url)
    {
        var builder = new StringBuilder();
        builder.Append(persistentDataPath);
        builder.Append("/");
        builder.Append(url);
        var path = builder.ToString();
        if (File.Exists(path))
        {
            File.Delete(path);
        }
    }

    /// <summary>
    /// 从本地缓存判断一个文件实际是否存在
    /// </summary>
    /// <param name="url"></param>
    public static bool IsCached(string url)
    {
        var builder = new StringBuilder();
        builder.Append(persistentDataPath);
        builder.Append("/");
        builder.Append(url);
        var path = builder.ToString();
        return File.Exists(path);
    }

    public static byte[] DecompressLZMA(byte[] bytes)
    {
        try
        {
            SevenZip.Compression.LZMA.Decoder coder = new SevenZip.Compression.LZMA.Decoder();
            MemoryStream input = new MemoryStream(bytes);
            ByteArray byteArray = new ByteArray(input, null);
            // Read the decoder properties
            byte[] properties = byteArray.ReadBytes(5);
            long fileLength = byteArray.ReadInt64();
            byte[] b = new byte[fileLength];
            MemoryStream output = new MemoryStream(b);
            // Decompress the file.
            coder.SetDecoderProperties(properties);
            coder.Code(input, output, bytes.Length, fileLength, null);
            byteArray.Dispose();
            output.Close();
            return b;
        }
        catch (Exception e)
        {
            Debug.LogError(e.Message);
            return null;
        }
    }
    private static FileStream abFileStream = null;
    public static void SetFileDownloaded(int offset, byte value)
    {
        try
        {
            if (abFileStream == null)
            {
                OnInit();
            }
            abFileStream.Position = offset;
            abFileStream.WriteByte(value);
            abFileStream.Flush();
        }
        catch (Exception e)
        {
            Debug.LogWarning("SetFileDownloaded:" + e.Message);
        }
    }

    public static void OnInit()
    {
        if (abFileStream == null)
        {
            var builder = new StringBuilder();
            builder.Append(persistentDataPath);
            builder.Append("/");
            builder.Append(ResLoader.assetbundlePathConfigName);
            abFileStream = new FileStream(builder.ToString(), FileMode.Open, FileAccess.Write);
        }
    }

    public static void OnDestroy()
    {
        if (abFileStream != null)
        {
            abFileStream.Close();
            abFileStream = null;
        }
    }

    public static Dictionary<string, ResInfo> ReadABConfigData(byte[] bytes, Dictionary<string, ResInfo> oldCheck = null)
    {
        var config = new Dictionary<string, ResInfo>(4096);
        ByteArray reader = new ByteArray(bytes, null);
        reader.useLittleEndian = true;
        int version = 0;
        try
        {
            version = reader.ReadInt32();
            if (version == AssetCaching.version)
            {
                var length = reader.ReadInt32();
                for (int i = 0; i < length; i++)
                {
                    var path = reader.ReadString();
                    var hashCode = reader.ReadString();
                    var size = reader.ReadInt32();
                    var tagPos = (int)reader.ReadPosition;
                    var tag = reader.ReadByte();
                    var dependenciesLen = reader.ReadByte();
                    var dependencies = new string[dependenciesLen];
                    for (int j = 0; j < dependenciesLen; j++)
                    {
                        dependencies[j] = reader.ReadString();
                    }
                    if (oldCheck != null)
                    {
                        ResInfo old;
                        if (oldCheck.TryGetValue(path, out old))
                        {
                            if (old.downloaded && old.hashCode == hashCode)
                            {
                                tag = (byte)(tag | 1);
                                bytes[tagPos] = tag;
                            }
                        }
                    }
                    var info = new ResInfo(path, hashCode, size, dependencies, tagPos, tag);
                    config[path] = info;
                }
                reader.Dispose();
                return config;
            }
            return null;
        }
        catch (System.Exception e)
        {
            Debug.LogWarning("版本文件内容异常，可能是写入不正确:" + "  version:" + version + " message:" + e.Message);
            reader.Dispose();
            return null;
        }
    }
    public static string ReadABConfigDataWithDiff(ref Dictionary<string, ResInfo> oldCheck, byte[] bytes)
    {
        try
        {
            ByteArray reader = new ByteArray(bytes, null);
            reader.useLittleEndian = true;
            var addListCount = reader.ReadInt32();
            for (int i = 0; i < addListCount; i++)
            {
                var path = reader.ReadString();
                var hashCode = reader.ReadString();
                var size = reader.ReadInt32();
                var tag = reader.ReadByte();
                var dependenciesLen = reader.ReadByte();
                var dependencies = new string[dependenciesLen];
                for (int j = 0; j < dependenciesLen; j++)
                {
                    dependencies[j] = reader.ReadString();
                }
                oldCheck[path] = new ResInfo(path, hashCode, size, dependencies, 0, tag);
            }
            var modifyListCount = reader.ReadInt32();
            for (int i = 0; i < modifyListCount; i++)
            {
                var path = reader.ReadString();
                var hashCode = reader.ReadString();
                var size = reader.ReadInt32();
                var tag = reader.ReadByte();
                var dependenciesLen = reader.ReadByte();
                var dependencies = new string[dependenciesLen];
                for (int j = 0; j < dependenciesLen; j++)
                {
                    dependencies[j] = reader.ReadString();
                }
                ResInfo old = oldCheck[path];
                if (old.downloaded && old.hashCode == hashCode)
                {
                    tag = (byte)(tag | 1);
                }
                oldCheck[path] = new ResInfo(path, hashCode, size, dependencies, 0, tag);
            }
            var deleteListCount = reader.ReadInt32();
            for (int i = 0; i < deleteListCount; i++)
            {
                var path = reader.ReadString();
                oldCheck.Remove(path);
            }
            reader.Dispose();
            string error = null;
            //将配置表写入磁盘，然后重新读取
            var newbytes = WriteMD5ConfigFile(oldCheck, ref error);
            if (newbytes == null)
            {
                return error;
            }
            else
            {
                oldCheck = ReadABConfigData(newbytes);
                return null;
            }
        }
        catch (Exception e)
        {
            return "ReadABConfigDataWithDiff " + e.Message;
        }
    }
    static byte[] WriteMD5ConfigFile(Dictionary<string, ResInfo> buildFiles,ref string error)
    {
        try
        {
            var builder = new StringBuilder();
            builder.Append(persistentDataPath);
            builder.Append("/");
            builder.Append(ResLoader.assetbundlePathConfigName);
            var abFileStream = new FileStream(builder.ToString(), FileMode.Create, FileAccess.Write);
            ByteArray byteArray = new ByteArray(null, abFileStream);
            byteArray.useLittleEndian = true;
            byteArray.WriteInt32(AssetCaching.version);
            byteArray.WriteInt32(buildFiles.Count);
            foreach (KeyValuePair<string, ResInfo> pair in buildFiles)
            {
                var info = pair.Value;
                byteArray.WriteString(pair.Key);
                byteArray.WriteString(info.hashCode.ToString());
                byteArray.WriteInt32(info.size);
                byteArray.WriteByte(info.GetNewTag());
                var length = info.dependencies == null ? 0 : info.dependencies.Length;
                byteArray.WriteByte((byte)length);
                for (int i = 0; i < length; i++)
                {
                    byteArray.WriteString(info.dependencies[i]);
                }
            }
            byteArray.Dispose();
            byteArray = null;
            abFileStream = null;
            return File.ReadAllBytes(builder.ToString());
        }
        catch (Exception e)
        {
            error = "merge error:" + e.Message;
            return null;
        }
    }
    public static int GetVersion()
    {
        var builder = new StringBuilder();
        builder.Append(persistentDataPath);
        builder.Append("/version.txt");
        int version = 0;
        try
        {
            var vText = File.ReadAllText(builder.ToString());
            int.TryParse(vText, out version);
            return version;
        }
        catch (System.Exception e)
        {
            Debug.LogWarning("首次启动或者版本文件被删除" + e.Message);
            return 0;
        }
    }
    public static void SetVersion(int value)
    {
        var builder = new StringBuilder();
        builder.Append(persistentDataPath);
        builder.Append("/version.txt");
        try
        {
            File.WriteAllText(builder.ToString(), value.ToString(), Encoding.UTF8);
        }
        catch (System.Exception e)
        {
            Debug.LogWarning(e.Message);
        }
    }
    public static string AppendHash(string url, string hash)
    {
        var builder = new StringBuilder();
        if (url.StartsWith("raw"))
        {
            var subIndex = url.IndexOf('.');
            builder.Append(url.Substring(0, subIndex));
            builder.Append("_");
            builder.Append(hash);
            builder.Append(url.Substring(subIndex));
        }
        else
        {
            builder.Append(url.Substring(0, url.Length - 3));
            builder.Append("_");
            builder.Append(hash);
            builder.Append(".ab");
        }
        return builder.ToString();
    }
    public static UnityEngine.ThreadPriority ConvertUnityPriority(AssetPriority priority)
    {
        if (priority <= AssetPriority.Low3)
        {
            return ThreadPriority.Low;
        }
        if (priority <= AssetPriority.BelowNormal3)
        {
            return ThreadPriority.BelowNormal;
        }
        if (priority <= AssetPriority.Normal3)
        {
            return ThreadPriority.Normal;
        }
        return ThreadPriority.High;
    }
}