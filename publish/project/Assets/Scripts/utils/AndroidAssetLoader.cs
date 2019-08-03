using System;
using System.IO;
using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class AndroidAssetLoader
{
    public static readonly string splashscreenAssetPath = "splashscreen.jpg";
    public static readonly string loadingPageAssetPath = "loadingpage.jpg";
#if UNITY_ANDROID
    private static string[] assets = null;
    public static bool IsExists(string fname)
    {
        initAssets();
        return Array.IndexOf(assets, fname) >= 0;
    }
    private static void initAssets()
    {
        if (assets != null) return;
        using (var unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
        {
            var currentActivity = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            var assetsMgr = currentActivity.Call<AndroidJavaObject>("getAssets", new object[] { });
            assets = assetsMgr.Call<string[]>("list", new object[] { "" });
        }
    }
#else
    public static bool IsExists(string fname)
    {
        return false;
    }
#endif
    public static IEnumerator LoadImage(string assetName, RawImage backimg)
    {
        string url = streamingPath + "/" + assetName;
        WWW www = new WWW(url);
        yield return www;
        if (string.IsNullOrEmpty(www.error))
        {
            backimg.texture = www.texture;
            backimg.color = new Color(0xff, 0xff, 0xff);
        }
        www.Dispose();
    }
    private static string streamingPath
    {
        get
        {
#if UNITY_ANDROID
            return Application.streamingAssetsPath;
#elif UNITY_IOS
            return "file://" + Application.streamingAssetsPath;
#else
            return "file:///" + Application.streamingAssetsPath;
#endif
        }
    }
}
