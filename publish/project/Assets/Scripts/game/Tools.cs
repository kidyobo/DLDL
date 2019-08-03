using UnityEngine;
using UnityEngine.UI;
//工具类，提供一些常用的静态方法
public static class Tools
{
    public static int version = 8;
    static public void ClearChildren(Transform trans)
    {
        for (int i = trans.childCount - 1; i >= 0; i--)
        {
#if UNITY_EDITOR
            GameObject.DestroyImmediate(trans.GetChild(i).gameObject);
#else
            GameObject.Destroy(trans.GetChild(i).gameObject);
#endif
        }
    }

    static public string GetHierarchy(GameObject obj)
    {
        System.Text.StringBuilder b = new System.Text.StringBuilder();
        var p = obj.transform;
        b.Append(p.name);
        while (p.parent != null)
        {
            b.Append("/" + p.parent.name);
            p = p.parent;
        }
        return b.ToString();
    }

    public static void SetSortingOrder(GameObject root, int order)
    {
        var renderers = root.GetComponentsInChildren<Renderer>(true);
        var max = renderers.Length;
        for (int idx = 0; idx < max; idx++)
        {
            var renderer = renderers[idx];
            if (renderer != null)
            {
                renderer.sortingOrder = order;
            }
        }
    }
    public static void SetRendererLayer(GameObject root, int layer)
    {
        var renderers = root.GetComponentsInChildren<Renderer>(true);
        var max = renderers.Length;
        for (int idx = 0; idx < max; idx++)
        {
            var renderer = renderers[idx];
            if (renderer != null)
            {
                renderer.gameObject.layer = layer;
            }
        }
    }

    public static void GetLocalPosition(Transform transform, out Vector3 v)
    {
        v = transform.localPosition;
    }
    public static void GetPosition(Transform transform, out Vector3 v)
    {
        v = transform.position;
    }
    public static void SetGameObjectPosition(GameObject gameObject, Vector3 v)
    {
        gameObject.transform.position = v;
    }
    public static void SetGameObjectLocalPosition(GameObject gameObject, Vector3 v)
    {
        gameObject.transform.localPosition = v;
    }
    public static void GetGameObjectLocalPosition(GameObject gameObject, out Vector3 v)
    {
        v = gameObject.transform.localPosition;
    }
    public static void GetGameObjectPosition(GameObject gameObject, out Vector3 v)
    {
        v = gameObject.transform.position;
    }

    public static void SetGameObjectPosition(GameObject gameObject, float x, float y, float z)
    {
        gameObject.transform.position = new Vector3(x, y, z);
    }
    public static void SetGameObjectLocalPosition(GameObject gameObject, float x, float y, float z)
    {
        gameObject.transform.localPosition = new Vector3(x, y, z);
    }
    public static void SetLocalPosition(Transform transform, float x, float y, float z)
    {
        transform.localPosition = new Vector3(x, y, z);
    }
    public static void SetPosition(Transform transform, float x, float y, float z)
    {
        transform.position = new Vector3(x, y, z);
    }

    public static void SetLocalPosition(Transform transform, Vector3 v3)
    {
        transform.localPosition = v3;
    }
    public static void SetPosition(Transform transform, Vector3 v3)
    {
        transform.position = v3;
    }

    public static void GetLocalRotation(Transform transform, out Quaternion v)
    {
        v = transform.localRotation;
    }
    public static void GetRotation(Transform transform, out Quaternion v)
    {
        v = transform.rotation;
    }
    public static void SetLocalRotation(Transform transform, Vector3 v)
    {
        transform.localRotation = Quaternion.Euler(v);
    }
    public static void SetLocalRotation(Transform transform, float x, float y, float z)
    {
        transform.localRotation = Quaternion.Euler(x, y, z);
    }
    public static void SetRotation(Transform transform, Vector3 v)
    {
        transform.rotation = Quaternion.Euler(v);
    }
    public static void SetRotation(Transform transform, float x, float y, float z)
    {
        transform.rotation = Quaternion.Euler(x, y, z);
    }

    // RectTransform help api
    public static void GetAnchoredPosition(RectTransform transform, out Vector2 v)
    {
        v = transform.anchoredPosition;
    }
    public static void SetAnchoredPosition(RectTransform transform, float x, float y)
    {
        transform.anchoredPosition = new Vector2(x, y);
    }
    public static void GetAnchoredPosition3D(RectTransform transform, out Vector3 v)
    {
        v = transform.anchoredPosition3D;
    }
    public static void SetAnchoredPosition3D(RectTransform transform, float x, float y, float z)
    {
        transform.anchoredPosition3D = new Vector3(x, y, z);
    }
    public static void GetRectSize(RectTransform transform, out Vector2 v)
    {
        v = transform.rect.size;
    }
    public static void GetAnchorMax(RectTransform transform, out Vector2 v)
    {
        v = transform.anchorMax;
    }
    public static void SetAnchorMax(RectTransform transform, float x, float y)
    {
        transform.anchorMax = new Vector2(x, y);
    }
    public static void GetAnchorMin(RectTransform transform, out Vector2 v)
    {
        v = transform.anchorMin;
    }
    public static void SetAnchorMin(RectTransform transform, float x, float y)
    {
        transform.anchorMin = new Vector2(x, y);
    }
    public static void GetOffsetMax(RectTransform transform, out Vector2 v)
    {
        v = transform.offsetMax;
    }
    public static void SetOffsetMax(RectTransform transform, float x, float y)
    {
        transform.offsetMax = new Vector2(x, y);
    }
    public static void GetOffsetMin(RectTransform transform, out Vector2 v)
    {
        v = transform.offsetMin;
    }
    public static void SetOffsetMin(RectTransform transform, float x, float y)
    {
        transform.offsetMin = new Vector2(x, y);
    }
    public static void GetPivot(RectTransform transform, out Vector2 v)
    {
        v = transform.pivot;
    }
    public static void SetPivot(RectTransform transform, float x, float y)
    {
        transform.pivot = new Vector2(x, y);
    }
    public static void GetSizeDelta(RectTransform transform, out Vector2 v)
    {
        v = transform.sizeDelta;
    }
    public static void SetSizeDelta(RectTransform transform, float x, float y)
    {
        transform.sizeDelta = new Vector2(x, y);
    }
    public static void GetGameObjectAnchoredPosition(GameObject gameObject, out Vector2 v)
    {
        v = (gameObject.transform as RectTransform).anchoredPosition;
    }
    public static void SetGameObjectAnchoredPosition(GameObject gameObject, float x, float y)
    {
        (gameObject.transform as RectTransform).anchoredPosition = new Vector2(x, y);
    }
    public static void GetGameObjectAnchoredPosition3D(GameObject gameObject, out Vector3 v)
    {
        v = (gameObject.transform as RectTransform).anchoredPosition3D;
    }
    public static void SetGameObjectAnchoredPosition3D(GameObject gameObject, float x, float y, float z)
    {
        (gameObject.transform as RectTransform).anchoredPosition3D = new Vector3(x, y, z);
    }
    public static void GetGameObjectRectSize(GameObject gameObject, out Vector2 v)
    {
        v = (gameObject.transform as RectTransform).rect.size;
    }
    public static void GetGameObjectAnchorMax(GameObject gameObject, out Vector2 v)
    {
        v = (gameObject.transform as RectTransform).anchorMax;
    }
    public static void SetGameObjectAnchorMax(GameObject gameObject, float x, float y)
    {
        (gameObject.transform as RectTransform).anchorMax = new Vector2(x, y);
    }
    public static void GetGameObjectAnchorMin(GameObject gameObject, out Vector2 v)
    {
        v = (gameObject.transform as RectTransform).anchorMin;
    }
    public static void SetGameObjectAnchorMin(GameObject gameObject, float x, float y)
    {
        (gameObject.transform as RectTransform).anchorMin = new Vector2(x, y);
    }
    public static void GetGameObjectOffsetMax(GameObject gameObject, out Vector2 v)
    {
        v = (gameObject.transform as RectTransform).offsetMax;
    }
    public static void SetGameObjectOffsetMax(GameObject gameObject, float x, float y)
    {
        (gameObject.transform as RectTransform).offsetMax = new Vector2(x, y);
    }
    public static void GetGameObjectOffsetMin(GameObject gameObject, out Vector2 v)
    {
        v = (gameObject.transform as RectTransform).offsetMin;
    }
    public static void SetGameObjectOffsetMin(GameObject gameObject, float x, float y)
    {
        (gameObject.transform as RectTransform).offsetMin = new Vector2(x, y);
    }
    public static void GetGameObjectPivot(GameObject gameObject, out Vector2 v)
    {
        v = (gameObject.transform as RectTransform).pivot;
    }
    public static void SetGameObjectPivot(GameObject gameObject, float x, float y)
    {
        (gameObject.transform as RectTransform).pivot = new Vector2(x, y);
    }
    public static void GetGameObjectSizeDelta(GameObject gameObject, out Vector2 v)
    {
        v = (gameObject.transform as RectTransform).sizeDelta;
    }
    public static void SetGameObjectSizeDelta(GameObject gameObject, float x, float y)
    {
        (gameObject.transform as RectTransform).sizeDelta = new Vector2(x, y);
    }

    public static void SetGameObjectLocalRotation(GameObject gameObject, Vector3 v)
    {
        gameObject.transform.localRotation = Quaternion.Euler(v);
    }
    public static void SetGameObjectLocalRotation(GameObject gameObject, float x, float y, float z)
    {
        gameObject.transform.localRotation = Quaternion.Euler(new Vector3(x, y, z));
    }
    public static void SetGameObjectRotation(GameObject gameObject, Vector3 v)
    {
        gameObject.transform.rotation = Quaternion.Euler(v);
    }
    public static void SetLocalScale(Transform transform, float x, float y, float z)
    {
        transform.localScale = new Vector3(x, y, z);
    }
    public static void SetLocalScale(Transform transform, Vector3 v)
    {
        transform.localScale = v;
    }
    public static void GetLocalScale(Transform transform, out Vector3 v)
    {
        v = transform.localScale;
    }
    public static void GetGameObjectLocalScale(GameObject gameObject, out Vector3 v)
    {
        v = gameObject.transform.localScale;
    }
    public static void SetGameObjectLocalScale(GameObject gameObject, float x, float y, float z)
    {
        gameObject.transform.localScale = new Vector3(x, y, z);
    }
    public static void GetForward(Transform transform, out Vector3 v)
    {
        v = transform.forward;
    }
    public static void SetGameObjectLocalScale(GameObject gameObject, Vector3 v)
    {
        gameObject.transform.localScale = v;
    }
    public static void GetRenderBounds(Renderer renderer, out Bounds v)
    {
        v = renderer.bounds;
    }
    public static void GetRenderBoundsSize(Renderer renderer, out Vector3 v)
    {
        v = renderer.bounds.size;
    }
    public static void GetMaterialColor(Material material, out Color v)
    {
        v = material.color;
    }
    public static string Md5(string str)
    {
        var md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
        var md5bytes = md5.ComputeHash(System.Text.UTF8Encoding.UTF8.GetBytes(str));
        return System.BitConverter.ToString(md5bytes).Replace("-", "").ToLower();
    }
    public static void SetGameObjectParent(GameObject parent, GameObject child, bool worldStay)
    {
        child.transform.SetParent(parent.transform, worldStay);
    }
    public static void SetParent(Transform parent, GameObject child, bool worldStay)
    {
        child.transform.SetParent(parent, worldStay);
    }
    public static void NormalizeGameObject(GameObject gameObject, bool position, bool rotation, bool scale)
    {
        var transform = gameObject.transform;
        if (position)
        {
            transform.localPosition = Vector3.zero;
        }
        if (rotation)
        {
            transform.localRotation = Quaternion.identity;
        }
        if (scale)
        {
            transform.localScale = Vector3.one;
        }
    }
    public static void NormalizeTransform(Transform transform, bool position, bool rotation, bool scale)
    {
        if (position)
        {
            transform.localPosition = Vector3.zero;
        }
        if (rotation)
        {
            transform.localRotation = Quaternion.identity;
        }
        if (scale)
        {
            transform.localScale = Vector3.one;
        }
    }
    public static GameObject GetChild(GameObject gameObject, string name)
    {
        Transform t = gameObject.transform.Find(name);
        if (t == null)
            return null;
        return t.gameObject;
    }
    public static GameObject GetChild(Transform transform, string name)
    {
        Transform t = transform.Find(name);
        if (t == null)
            return null;
        return t.gameObject;
    }
    public static Component GetChildElement(GameObject gameObject, System.Type type, string name)
    {
        Transform t = gameObject.transform.Find(name);
        if (t == null)
            return null;
        Component component = t.GetComponent(type);
        return component;
    }
    public static Component GetChildElement(Transform transform, System.Type type, string name)
    {
        Transform t = transform.Find(name);
        if (t == null)
            return null;
        Component component = t.GetComponent(type);
        return component;
    }
    public static void CopyRectTransformSize(GameObject a, GameObject b)
    {
        (a.transform as RectTransform).sizeDelta = (b.transform as RectTransform).sizeDelta;
    }
    public static GameObject Instantiate(GameObject prefab, GameObject parent, bool worldPositionStays)
    {
        return GameObject.Instantiate(prefab, parent.transform, worldPositionStays) as GameObject;
    }
    public static void GetVector2GroupItem(Vector2[] vList, int index, out Vector2 v)
    {
        v = vList[index];
    }
    public static void GetVector3GroupItem(Vector3[] vList, int index, out Vector3 v)
    {
        v = vList[index];
    }
    public static bool isAnimatorPlaying(Animator animator, int layer, string name)
    {
        if (animator.isActiveAndEnabled)
        {
            var info = animator.GetCurrentAnimatorStateInfo(layer);
            return info.IsName(name);
        }
        return false;
    }
    public static Component AddBesizer(GameObject obj, float speed, float angle, GameObject target, System.Action onFinished)
    {
        var besizer = obj.GetComponent<Besizer>();
        if (besizer == null)
        {
            besizer = obj.AddComponent<Besizer>();
        }
        besizer.speed = speed;
        besizer.angelmodu = angle;
        besizer.target = target;
        besizer.onFinished = onFinished;
        besizer.Play();
        return besizer;
    }
    public static Component Add2DRectMask(GameObject obj)
    {
        return obj.AddComponent<RectMask2D>();
    }
    public static Component AddGraphicRaycaster(GameObject obj)
    {
        return obj.AddComponent<GraphicRaycaster>();
    }
    public static Component GetGraphicRaycaster(GameObject obj)
    {
        return obj.GetComponent<GraphicRaycaster>();
    }
    public static void ChangeScene(string name)
    {
        UnityEngine.SceneManagement.SceneManager.LoadScene(name);
    }
    public static float TotalMemorySize
    {
        get
        {
            return UnityEngine.Profiling.Profiler.GetTotalReservedMemoryLong();
        }
    }
    public static void Vibrate()
    {
#if !UNITY_STANDALONE_WIN
        Handheld.Vibrate();
#endif
    }
    public static void PlayMovie(string path)
    {
#if !UNITY_STANDALONE_WIN
        Handheld.PlayFullScreenMovie(path, Color.black, FullScreenMovieControlMode.Hidden);
#endif
    }
    public static void AddUIRaycaster(GameObject gameObject)
    {
        gameObject.AddComponent<UIRaycaster>();
    }
    public static void SetBuglyUserId(string userid)
    {
        BuglyAgent.SetUserId(userid);
    }
    public static void ShowLogPanel()
    {
        OutPutPanel.ins.ShowLog();
    }
    public static int DumpCacheCount()
    {
        return 0;
    }
    public static bool AndroidAssetIsExists(string assetName)
    {
        return AndroidAssetLoader.IsExists(assetName);
    }
    public static string[] BytesToStringArray(byte[] bytes)
    {
        var str = System.Text.Encoding.UTF8.GetString(bytes, 0, bytes.Length);
        var stringList = str.Split(new char[] { '\n' }, System.StringSplitOptions.RemoveEmptyEntries);
        return stringList;
    }
    public static float GetAnimLength(Animator animator, string animName)
    {
        var clips = animator.runtimeAnimatorController.animationClips;
        for (int i = 0; i < clips.Length; i++)
        {
            var clip = clips[i];
            if (clip.name.Equals(animName))
            {
                return clip.length;
            }
        }
        return -1;
    }
    public static int GetComponentLayer(Component com)
    {
        return com.gameObject.layer;
    }
}