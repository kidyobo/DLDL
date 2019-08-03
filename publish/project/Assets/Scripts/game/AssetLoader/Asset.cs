using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Text;
public class Asset
{
    /// <summary>
    /// 该资源的详情
    /// </summary>
    [DonotWrap]
    public ResInfo info
    {
        private set;
        get;
    }
    /// <summary>
    /// 该资源的路径
    /// </summary>
    public string path
    {
        get
        {
            return info.url;
        }
    }
    /// <summary>
    /// 资源Asset
    /// </summary>
    public Object source
    {
        private set;
        get;
    }
    /// <summary>
    /// 标识该资源是否已经下载
    /// </summary>
    public bool loaded
    {
        private set;
        get;
    }
    /// <summary>
    /// 只有raw类型的资源才会拥有这个属性
    /// </summary>
    public byte[] bytes
    {
        private set;
        get;
    }
    /// <summary>
    /// 标识该资源是否可以卸载
    /// </summary>
    [DonotWrap]
    public bool unloadAble
    {
        get
        {
            return !loaded || (isUnloadAble && linkedAssetList.Count == 0);
        }
    }
    /// <summary>
    /// 注意，要维持一个资源在内存中，请不要使用这个参数，这个参数的概念是资源不可卸载，包括游戏重新启动
    /// </summary>
    [DonotWrap]
    public bool isUnloadAble = true;
    [DonotWrap]
    public int operatingCount = 0;
    /// <summary>
    /// 资源material
    /// </summary>
    public Material material
    {
        get
        {
            return source as Material;
        }
    }
    /// <summary>
    /// 资源shader
    /// </summary>
    public Shader shader
    {
        get
        {
            return source as Shader;
        }
    }
    /// <summary>
    /// 资源texture
    /// </summary>
    public Texture2D texture
    {
        get
        {
            return source as Texture2D;
        }
    }
    /// <summary>
    /// 资源AudioClip
    /// </summary>
    public AudioClip audioClip
    {
        get
        {
            var clip = source as AudioClip;
            return clip;
        }
    }
    /// <summary>
    /// 资源TextAsset
    /// </summary>
    public TextAsset textAsset
    {
        get
        {
            return source as TextAsset;
        }
    }
    /// <summary>
    /// 资源gameObject
    /// </summary>
    public GameObject gameObject
    {
        get
        {
            return source as GameObject;
        }
    }
    /// <summary>
    /// 资源AssetBundle
    /// </summary>
    private AssetBundle assetBundle;
    [DonotWrap]
    public List<Asset> linkedAssetList = new List<Asset>();
    [DonotWrap]
    public List<Asset> linkedAssetBundleList = new List<Asset>();
    [DonotWrap]
    public bool isDependencyReady
    {
        get
        {
            var len = linkedAssetBundleList.Count;
            if (len > 0)
            {
                for (int i = 0; i < len; i++)
                {
                    if (!linkedAssetBundleList[i].loaded)
                    {
                        return false;
                    }
                }
            }
            return true;
        }
    }
    /// <summary>
    /// 该资源保存的引用列表
    /// </summary>
    private List<GameObject> refList = new List<GameObject>();
    /// <summary>
    /// 回收的当前时间，外部计算使用
    /// </summary>
    private float collectTime = -1;
    //资源的回收时刻
    public float CollectTime
    {
        get
        {
            return collectTime;
        }
    }
    public bool autoCollect = true;

    [DonotWrap]
    public Asset(ResInfo info)
    {
        this.info = info;
    }

    [DonotWrap]
    public void ResetCollect(bool autoCollect)
    {
        this.autoCollect = autoCollect;
        this.collectTime = -1;
    }
    /// <summary>
    /// 载入当前资源
    /// </summary>
    [DonotWrap]
    public void OnLoad(AssetBundle assetBundle)
    {
        this.assetBundle = assetBundle;
    }
    /// <summary>
    /// 载入当前资源
    /// </summary>
    [DonotWrap]
    public void OnLoad(byte[] bytes)
    {
        this.bytes = bytes;
    }

    /// <summary>
    /// 载入当前资源
    /// </summary>
    [DonotWrap]
    public void OnLoad(Object o)
    {
        this.source = o;
    }

    [DonotWrap]
    public void MarkLoaded()
    {
        this.loaded = true;
    }
    /// <summary>
    /// 当asset中存在多个资源时，可以使用load获取内部资源
    /// </summary>
    /// <param name="key">资源名称（不包括打包父路径）</param>
    /// <returns></returns>
    public Object Load(string key)
    {
#if PUBLISH
        if (assetBundle == null)
        {
            return null;
        }
        var builder = new StringBuilder();
        builder.Append("assets/assetsources/");
        builder.Append(key.ToLower());
        Object obj = assetBundle.LoadAsset(builder.ToString());
        if (obj == null)
        {
            Log.logWarning("path:" + key + " 403");
        }
        return obj;
#else
        Object obj = UnityEditor.AssetDatabase.LoadAssetAtPath<Object>(AssetCaching.GetUrl(key, null));
        if (obj == null)
        {
            Log.logWarning("path:" + key + " 403");
        }
        return obj;
#endif
    }
    /// <summary>
    /// 当asset中存在多个资源时，可以使用load获取内部资源所有的子节点
    /// </summary>
    /// <param name="key">资源名称（不包括打包父路径）</param>
    /// <returns></returns>
    public Object LoadSubAsset(string key, System.Type type)
    {
        Object obj = null;
#if PUBLISH
        if (assetBundle == null)
        {
            return null;
        }
        var builder = new StringBuilder();
        builder.Append("assets/assetsources/");
        builder.Append(key.ToLower());
        obj = assetBundle.LoadAsset(builder.ToString(), type);
#else
        obj = UnityEditor.AssetDatabase.LoadAssetAtPath(AssetCaching.GetUrl(key, null), type);
#endif
        if (obj == null)
        {
            Debug.LogWarning("path:" + key + " 403");
            return null;
        }
        else
        {
            return obj;
        }
    }
    /// <summary>
    /// 生成一个GameObject的副本
    /// </summary>
    /// <returns>新的副本对象</returns>
    public GameObject Instantiate(Transform parent, bool worldPositionStay)
    {
        if (source == null)
        {
            return null;
        }
        GameObject obj = null;
        if (source is GameObject)
        {
            obj = GameObject.Instantiate(source, parent, worldPositionStay) as GameObject;
        }
        else
        {
            obj = new GameObject();
            if (parent != null)
            {
                obj.transform.SetParent(parent, worldPositionStay);
            }
        }
        obj.name = source.name;
        refList.Add(obj);
        return obj;
    }
    /// <summary>
    /// 将目标对象作为自己的引用对象(慎重使用)
    /// </summary>
    public void AddLinkObject(GameObject target)
    {
        refList.Add(target);
    }
    /// <summary>
    /// 将目标对象作为自己的引用对象(慎重使用)
    /// </summary>
    public void RemoveLinkObject(GameObject target)
    {
        refList.Remove(target);
    }
    /// <summary>
    /// 检查垃圾回收
    /// </summary>
    /// <returns>该资源是否需要回收</returns>
    [DonotWrap]
    public bool Collect(float time)
    {
        if (operatingCount > 0)
        {
            return false;
        }

        if (!loaded)
        {
            return false;
        }
        while (refList.Count > 0)
        {
            var obj = refList[0];
            if (obj.Equals(null))
            {
                refList.RemoveAt(0);
            }
            else
            {
                return false;
            }
        }
        if (!autoCollect || linkedAssetList.Count > 0)
        {
            return false;
        }
        if (collectTime == -1)
        {
            this.collectTime = Time.realtimeSinceStartup;
        }
        if (this.collectTime >= 0)
        {
            if (this.collectTime + time <= Time.realtimeSinceStartup)
            {
                return true;
            }
        }
        return false;
    }
    /// <summary>
    /// 删除所有引用的perfab
    /// </summary>
    public void DestroyLinkedGameObject()
    {
        if (refList.Count > 0)
        {
            foreach (GameObject obj in refList)
            {
                GameObject.Destroy(obj);
            }
            refList.Clear();
        }
    }
    /// <summary>
    /// 获取perfab
    /// </summary>
    public GameObject GetLinkedGameObject(string name)
    {
        if (name == null)
        {
            return null;
        }
        if (refList.Count > 0)
        {
            foreach (var prefab in refList)
            {
                var obj = prefab as GameObject;
                if (obj.name == name)
                {
                    return obj;
                }
            }
            Log.logWarning("无法获得该名字的prefab");
        }
        return null;
    }
    /// <summary>
    /// 主动释放该资源（立即删除资源)
    /// </summary>
    public void ReleaseImmediate(bool destroyLinkedGameObject)
    {
        if (destroyLinkedGameObject && refList.Count > 0)
        {
            foreach (GameObject obj in refList)
            {
                GameObject.Destroy(obj);
            }
            refList.Clear();
        }
        ResLoader.ReleaseAsset(this);
    }
    /// <summary>
    /// 卸载当前资源
    /// </summary>
    [DonotWrap]
    public void Unload()
    {
        var len = linkedAssetBundleList.Count;
        if (len > 0)
        {
            for (int i = 0; i < len; i++)
            {
                Asset asset = linkedAssetBundleList[i];
                asset.linkedAssetList.Remove(this);
            }
            this.linkedAssetBundleList.Clear();
        }
        if (this.loaded)
        {
            if (this.linkedAssetList.Count > 0)
            {
                var builder = new System.Text.StringBuilder();
                foreach (Asset asset in this.linkedAssetList)
                {
                    asset.linkedAssetBundleList.Remove(this);
                    builder.AppendLine("asset:" + asset.path);
                }
                this.linkedAssetList.Clear();

                Log.logWarning("销毁了一个被其他资源引用的对象，这可能会导致异常，请检查。 path:" + this.path + "\n" + builder.ToString());
            }
        }
        else
        {
            len = linkedAssetList.Count;
            if (len > 0)
            {
                for (int i = 0; i < len; i++)
                {
                    Asset asset = linkedAssetList[i];
                    asset.linkedAssetBundleList.Remove(this);
                }
                this.linkedAssetList.Clear();
            }
        }

        this.refList.Clear();

        if (assetBundle != null)
        {
            assetBundle.Unload(true);
            assetBundle = null;
        }
        source = null;
        this.loaded = false;
    }
    public override string ToString()
    {
        string str = "path:" + this.path;
        return str;
    }
}