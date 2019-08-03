using System;
using UnityEngine;
class ExeDwonloader
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
    public void CheckDownload(System.Action nextStep)
    {
        this.nextStep = nextStep;
        string apkinfofile = string.Format("exeinfo_{0}.json", PCStreamingSetting.channelID);
        string url = UrlUtil.Combineurl(game.Config.remoteResUrl, "exe", game.Config.apkpath, apkinfofile);
        ResLoader.LoadTextFromFullUrl(url + "?v=" + System.DateTime.Now.Ticks, OnConfigLoaded);
    }

    private void OnConfigLoaded(string error, string content)
    {
        if (error != null)
        {
            Debug.Log("exe downloader error:"+error);
            nextStep();
            return;
        }

        try
        {
            var data = JsonUtility.FromJson<ApkInfo>(content);
            if (VersionComparer.Compare(Application.version, data.curver.fixver) >= 0)
            {
                nextStep();
                return;
            }

            apkUrl = data.curver.url;
            FixedMessageBox.Show(string.Format("检测到新版本（{0}）安装包需要下载，是否下载？", data.curver.ver), OnMsgBoxConfirm);
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
            Application.OpenURL(apkUrl);
            Application.Quit();
        }
        else
        {
            Application.Quit();
        }
    }
}