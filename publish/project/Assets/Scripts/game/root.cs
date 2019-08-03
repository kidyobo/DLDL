using System.IO;
using System.Text.RegularExpressions;
using UnityEngine;
using UnityEngine.UI;
public class root : MonoBehaviour
{
    public string RootScript = "root";
    [DonotWrap]
    public static TimerContainer timerContainer = new TimerContainer();

    private static Text loadingText = null;
    private Timer updateTimer = null;
    private DownloadRequest updateRequest = null;
    private string[] tsbyteList = null;
    private int retryCount = 0;
    private string imageName = "";

    void Start()
    {
        BuglyAgent.EnableExceptionHandler();
        this.gameObject.AddComponent<ResLoader>();
        BuildinAssetManager.Load();
        CheckDecompress();
    }

    void CheckDecompress()
    {
        if (BuildinAssetManager.isReady)
        {
            CheckCleanOver();
        }
        else
        {
            Invoke("CheckDecompress", 0.1f);
        }
    }
    void CheckCleanOver()
    {
        if (ResLoader.isCleaning)
        {
            Invoke("CheckCleanOver", 0.1f);
        }
        else
        {
            StartGame();
        }
    }

    void StartGame()
    {
        ResLoader.LoadConfig(true, this.onLoadConfigLocal, null);
    }
    void onLoadConfigLocal(string error)
    {
        if (error == null)
        {
            imageName = string.Format("channel/loadingPage/{0}/0.png", game.Config.gameid);
            if (!ResLoader.Exist(imageName))
            {
                imageName = "images/loadingPage/0.png";
            }
            var oldLoading = GameObject.Find("LoadingView");
            if (oldLoading)
            {
                this.CheckApkDownLoad();
            }
            else
            {
                LoadLoadingView();
            }
        }
        else
        {
            Debug.LogWarning("加载配置表出错：" + error);
            this.Invoke("ReLoad", 0.5f);
        }
    }

    void LoadLoadingView()
    {
        //加载加载界面和固定提示框界面，这里必须相关资源本地是否已经存在，否则先打开包内资源
        var assetRequest = ResLoader.CreateAssetsRequest(AssetPriority.High1, new string[] { "ui/LoadingView.prefab", "ui/FixedMessageBox.prefab", imageName });
        ResLoader.BeginAssetRequest(assetRequest, this.onLoadLoadingView);
    }
    void onLoadLoadingView(AssetRequest request)
    {
        if (request.error != null)
        {
            Debug.LogWarning(request.error);
            this.Invoke("ReLoad", 0.5f);
            return;
        }
        var loadingAsset = ResLoader.LoadAsset("ui/LoadingView.prefab");
        var fixedAsset = ResLoader.LoadAsset("ui/FixedMessageBox.prefab");
        loadingAsset.autoCollect = false;
        loadingAsset.isUnloadAble = false;
        var obj = loadingAsset.Instantiate(null, false);
        var mapper = obj.GetComponent<ElementsMapper>();
        loadingText = mapper.GetElement("text").GetComponent<Text>();

        var backImg = mapper.GetElement("background").GetComponent<RawImage>();
        if (AndroidAssetLoader.IsExists(AndroidAssetLoader.loadingPageAssetPath))
        {
            backImg.color = new Color(0, 0, 0);
            StartCoroutine(AndroidAssetLoader.LoadImage(AndroidAssetLoader.loadingPageAssetPath, backImg));
        }
        else
        {
            var imageAsset = ResLoader.LoadAsset(imageName);
            if (imageAsset != null)
            {
                backImg.texture = imageAsset.texture;
                imageAsset.autoCollect = false;
                imageAsset.isUnloadAble = false;
            }
        }

        GameObject.DontDestroyOnLoad(obj);
        fixedAsset.autoCollect = false;
        fixedAsset.isUnloadAble = false;

        this.CheckApkDownLoad();
    }

    void ReLoad()
    {
        ResLoader.clearAllAssetsOnLoad = true;
        AssetCaching.OnDestroy();
        BuildinAssetManager.Reload();
        UnityEngine.SceneManagement.SceneManager.LoadScene("root");
    }
    void CheckApkDownLoad()
    {
        loadingText.text = "欢迎来到斗罗大陆...";
        if (!MemValueRegister.GetBool("skipcheckdownload"))
        {
            if (Application.platform == RuntimePlatform.Android)
            {
                new ApkDownloader().CheckDownload(CheckNecessaryAsset);
            }
            else if (Application.platform == RuntimePlatform.WindowsPlayer)
            {
                new ExeDwonloader().CheckDownload(CheckNecessaryAsset);
            }
            else
            {
                CheckNecessaryAsset();
            }
        }
        else
        {
            CheckNecessaryAsset();
        }
    }

    void CheckNecessaryAsset()
    {
        retryCount++;
        //必须开启该选项，否则资源不会下载
        //检查loading和代码的更新，这部分并不提示玩家,如果有更新会直接使用流量~
        //获取最新配置表
        ResLoader.LoadConfig(false, this.onGetConfig, this.onUpdateProgress);
    }
    void onUpdateProgress(float progress)
    {
        if (Application.platform == RuntimePlatform.IPhonePlayer)
        {
            loadingText.text = "请稍后,正在读取本地场景资源中....";
        }
        else {
            loadingText.text = string.Format("请稍候，正在进入游戏({0}%)", Mathf.FloorToInt(progress * 100));
        }
    }
    void onGetConfig(string error)
    {
        if (error != null)
        {
            Debug.LogWarning("加载更新列表失败：" + error);
            if (retryCount < 3)
            {
                this.Invoke("CheckNecessaryAsset", 0.1f);
            }
            else
            {
                //错误提示
                FixedMessageBox.Show("加载更新列表失败，是否重试", this.onConfirmCheckNecessaryAsset);
            }
            return;
        }
        retryCount = 0;
        this.OnCheckStart();
    }
    void onConfirmCheckNecessaryAsset(bool confirm)
    {
        retryCount = 0;
        if (confirm)
        {
            this.Invoke("CheckNecessaryAsset", 0.1f);
        }
        else
        {
            Application.Quit();
        }
    }

    void OnCheckStart()
    {
        //检查启动资源的更新
        var request = ResLoader.CreateDownloadRequest(AssetPriority.High1, new string[] { "ui/LoadingView.prefab", "ui/FixedMessageBox.prefab", imageName }, false);
        if (request.maxCount > 0)
        {
            this.updateTimer = new Timer("", 30, 0, this.onUpdateLoadingProgress);
            this.updateRequest = request;
        }
        ResLoader.BeginDownloadRequest(request, this.OnCheckEnd);
    }
    void onUpdateLoadingProgress(Timer timer)
    {
        loadingText.text = string.Format("请稍候，正在加载启动画面({0}%)", Mathf.FloorToInt(this.updateRequest.progress * 100));
    }

    void onConfirmDownload(bool confirm)
    {
        if (confirm)
        {
            this.Invoke("OnCheckStart", 0.1f);
        }
        else
        {
            Application.Quit();
        }
    }
    void OnCheckEnd(DownloadRequest request)
    {
        if (this.updateTimer != null)
        {
            this.updateTimer.Stop();
            this.updateTimer = null;
        }
        this.updateRequest = null;
        if (request.error != null)
        {
            Debug.LogWarning("加载启动画面出错：" + request.error);
            //错误提示
            FixedMessageBox.Show("加载启动画面失败，是否重试", this.onConfirmDownload);
            return;
        }
        if (request.maxCount > 0)
        {
            var loadingAsset = ResLoader.LoadAsset("ui/LoadingView.prefab");
            loadingAsset.isUnloadAble = true;

            var oldLoading = GameObject.Find("LoadingView");
            GameObject.Destroy(oldLoading);
            var fixedAsset = ResLoader.LoadAsset("ui/FixedMessageBox.prefab");
            fixedAsset.isUnloadAble = true;
            //重启
            ResLoader.clearAllAssetsOnLoad = true;
            UnityEngine.SceneManagement.SceneManager.LoadScene("root");
        }
        else
        {
            this.CheckScriptUpdate();
        }
    }

    void CheckScriptUpdate()
    {
        tsbyteList = ResLoader.GetAssetBundleNameList(new string[] { "tsbytes/" });
        //检查首包资源的更新
        var request = ResLoader.CreateDownloadRequest(AssetPriority.High1, tsbyteList, false);
        if (request.maxCount > 0)
        {
            this.updateTimer = new Timer("", 30, 0, this.onUpdateTSProgress);
            this.updateRequest = request;
        }
        ResLoader.BeginDownloadRequest(request, this.LoadScript);
    }
    void onUpdateTSProgress(Timer timer)
    {
        loadingText.text = string.Format("请稍候，正在加载启动文件({0}%)", Mathf.FloorToInt(this.updateRequest.progress * 100));
    }

    void LoadScript(DownloadRequest r)
    {
        if (this.updateTimer != null)
        {
            this.updateTimer.Stop();
            this.updateTimer = null;
        }
        this.updateRequest = null;
        if (r.error != null)
        {
            Debug.LogWarning("加载启动文件出错：" + r.error);
            //错误提示
            FixedMessageBox.Show("加载启动文件失败，是否重试", this.onConformScript);
            return;
        }
        var tsrequest = ResLoader.CreateAssetsRequest(AssetPriority.High1, tsbyteList);
        ResLoader.BeginAssetRequest(tsrequest, this.onLoadScript);
        tsbyteList = null;
    }
    void onConformScript(bool confirm)
    {
        if (confirm)
        {
            this.Invoke("CheckScriptUpdate", 0.1f);
        }
        else
        {
            Application.Quit();
        }
    }
    void onLoadScript(AssetRequest request)
    {
        if (request.error != null)
        {
            Debug.LogWarning("加载tsbytes出错：" + request.error);
            CheckScriptUpdate();
            return;
        }

#if PUBLISH
        string basePath = "tsbytes/";
        string ext = ".bytes";
#else
        string basePath = "TsScripts/.dist/";
        string ext = ".js";
#endif
        Debug.Log("start init uts.");
        Uts.Core.Init(basePath, ext);
        Debug.Log("start load script.");
        Uts.Native.jvm_evalstring_s(Uts.Core.env.ptr,
            "define.used = false; require('" + RootScript + "'); if(define.used) define.require('" + RootScript + "');",
            RootScript);
        Debug.Log("load script end.");
    }

    void FixedUpdate()
    {
        Profiler.Ins.Push("FixedUpdate");
        Uts.Core.Update();
        Profiler.Ins.Pop();

        timerContainer.Update();
        OutPutPanel.ins.Update();
        HandleQuitKey();
    }
#if UNITY_STANDALONE_WIN
    void OnGUI()
    {
        if (Input.anyKeyDown)
        {
            Event e = Event.current;
            var code = e.keyCode;
            if (e.isKey && code != KeyCode.None)
            {
                if (SystemSDK.onKeyDown != null)
                {
                    SystemSDK.onKeyDown(code);
                }
            }
        }
    }
#endif
    void HandleQuitKey()
    {
#if UNITY_ANDROID
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            if (SystemSDK.onPressQuitKey != null)
            {
                SystemSDK.onPressQuitKey();
            }
        }
#endif
    }

    void OnDestroy()
    {
        SystemSDK.Destroy(); // 必须放在首位，内部会回调ts的onDestroy
        AssetCaching.OnDestroy();
        timerContainer.Clear();
        Uts.Core.Destroy();
    }

    void OnApplicationPause(bool pause)
    {
        Uts.Core.OnApplicationPause(pause);

        if (SystemSDK.onApplicationPause != null)
        {
            SystemSDK.onApplicationPause(pause);
        }
    }

    void onSdkMessage(string msgJson)
    {
        int type = GetMsgType(msgJson);
        if (SystemSDK.onMessage != null)
        {
            Log.log("Send to ts");
            SystemSDK.onMessage(msgJson);
        }
        if (SystemSDK.onCsMessage != null)
        {
            SystemSDK.onCsMessage(type, msgJson);
        }
        if (type == SdkMsgType.DESTROY)
        {
            OnDestroy();
        }
    }

    static private Regex msgTypeRe = new Regex(@"""msgtype""\s*:\s*(\d+)");
    int GetMsgType(string msg)
    {
        var m = msgTypeRe.Match(msg);
        if (m == null || m.Groups.Count != 2)
            return 0;
        return int.Parse(m.Groups[1].Value);
    }
}