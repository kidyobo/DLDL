using System;
using UnityEngine;

class ApkDownloader
{
    [System.Serializable]
    class ApkInfo
    {
        public ApkVer curver = new ApkVer();
    }
    [System.Serializable]
    class ApkVer
    {
        public string fixver = "";
        public string ver = "";
        public string url = "";
        public string size = "0";
    }

    private System.Action nextStep = null;
    private string apkUrl = "";
    private int apkSize = 100 * 1024 * 1024;
    public void CheckDownload(System.Action nextStep)
    {
        this.nextStep = nextStep;
        if (ResLoader.isPublish && Application.platform == RuntimePlatform.Android)
        {
            string apkinfofile = "apkinfo.json";
#if TEST_APK
            apkinfofile = "test_" + apkinfofile;
#endif
            string url = UrlUtil.Combineurl(game.Config.remoteResUrl, "apk", game.Config.apkpath, apkinfofile);
            ResLoader.LoadTextFromFullUrl(url + "?v=" + System.DateTime.Now.Ticks, OnConfigLoaded);
        }
        else
        {
            nextStep();
        }
    }

    private void OnConfigLoaded(string error, string content)
    {
        if (error != null)
        {
            nextStep();
            return;
        }

        try
        {
            var data = JsonUtility.FromJson<ApkInfo>(content);
            Log.log("Application.version:" + Application.version + ", data.curver.fixver:" + data.curver.fixver + ", data.curver.ver:" + data.curver.ver);
            if (VersionComparer.Compare(Application.version, data.curver.fixver) >= 0)
            {
                nextStep();
                return;
            }

            apkUrl = data.curver.url;
            float size;
            if (float.TryParse(data.curver.size, out size))
            {
                apkSize = (int)(size * 1024 * 1024);
            }
            FixedMessageBox.Show(string.Format("检测到新版本（{0}）安装包需要下载，共{1}MB，是否下载？", data.curver.ver, data.curver.size), OnMsgBoxConfirm);
        }
        catch (Exception e)
        {
            Debug.LogWarning(e.ToString() + ", content:" + (content == null ? "" : content));
            nextStep();
            return;
        }
    }

    private void OnMsgBoxConfirm(bool confirmed)
    {
        if (confirmed)
        {
            SystemSDK.JavaCaller("com.fy.utils.apkdownloader.DownLoader", null, "getInstance", "Call", "download", typeof(Boolean), new object[] { apkUrl, apkSize.ToString() });
        }
        else
        {
#if DEVELOP
            nextStep();
#else
            Application.Quit();
#endif
        }
    }
}

