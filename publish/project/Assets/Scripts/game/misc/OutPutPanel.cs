using Assets.Scripts.game.ui;
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

enum PanelType
{
    LOGGER = 0,
    ERRLOGGER,
    PROFILER,
    MAX,
}

class OneOutputPanel
{
    private const string refreshkey = "setcontent";
    private const string scrollkey = "scrollbottom";
    private GameObject go;
    private RectTransform rect;
    private List<Text> texts;
    public OneOutputPanel(GameObject go)
    {
        this.go = go;
        rect = go.GetComponent<RectTransform>();
        texts = new List<Text>();
        texts.Add(go.transform.Find("text").GetComponent<Text>());
    }
    public void SetCanDrag(bool canDrag)
    {
        var image = go.GetComponentInParent<Image>();
        image.raycastTarget = canDrag;
    }
    public void SetContent(int index, string msg, bool autoScrollBottom)
    {
        if (index == texts.Count)
        {
            GameObject textgo = texts[texts.Count - 1].gameObject;
            GameObject newtextgo = GameObject.Instantiate(textgo, textgo.transform.parent, false);
            newtextgo.name = "text";
            texts.Add(newtextgo.GetComponent<Text>());
        }

        texts[index].text = msg;
        Invoker.EndInvoke(go, refreshkey);
        Invoker.BeginInvoke(go, refreshkey, 0.1f, () =>
        {
            LayoutRebuilder.MarkLayoutForRebuild(rect);
        });

        Invoker.EndInvoke(go, scrollkey);
        if (autoScrollBottom)
        {
            Invoker.BeginInvoke(go, scrollkey, 1.0f, () =>
            {
                ScrollBottom();
            });
        }
    }
    private void ScrollBottom()
    {
        var sr = rect.GetComponentInParent<ScrollRect>();
        if (sr != null)
            sr.verticalNormalizedPosition = 0;
    }
}

class TouchPassword
{
    private int[] touchpsw = new int[] { 4, 4, 4 };
    private int[] inputPassword = null;
    private int inputPos = 0;
    private float lastTouchTime = 0;
    private int lastCount = 0;

    public TouchPassword()
    {
        inputPassword = new int[touchpsw.Length];
    }

    public bool CheckShow()
    {
        int curCount = getTouchCount();
        if (curCount == lastCount)
        {
            return false;
        }

        lastCount = curCount;
        if (curCount == 0)
        {
            return false;
        }

        if ((Time.realtimeSinceStartup - lastTouchTime) > 3f)
        {
            inputPos = 0;
        }
        inputPassword[inputPos++] = curCount;
        lastTouchTime = Time.realtimeSinceStartup;

        if (inputPos < inputPassword.Length)
        {
            return false;
        }

        for (int i = 0; i < inputPos; i++)
        {
            if (touchpsw[i] != inputPassword[i])
            {
                inputPos = 0;
                return false;
            }
        }
        inputPos = 0;

        return true;
    }

    private int getTouchCount()
    {
        var touches = Input.touches;
        for (int i = 0; i < touches.Length; i++)
        {
            if (touches[i].phase != TouchPhase.Moved)
                return 0;
        }
        return touches.Length;
    }
}

class ClickPassword
{
    private static int clickpsw = 8;
    private float lastClickTime = 0;
    private int curClickTimes = 0;

    public bool CheckShow()
    {
        if (!hasValidClick())
            return false;

        if ((Time.realtimeSinceStartup - lastClickTime) > 1f)
        {
            curClickTimes = 1;
            lastClickTime = Time.realtimeSinceStartup;
        }
        else
        {
            curClickTimes++;
            lastClickTime = Time.realtimeSinceStartup;
            if (curClickTimes == clickpsw)
            {
                curClickTimes = 0;
                return true;
            }
        }
        return false;
    }


    private bool hasValidClick()
    {
        var touches = Input.touches;
        if (touches.Length != 1)
            return false;
        var touche = touches[0];
        if (touche.phase == TouchPhase.Ended && touche.position.x < 30 && touche.position.y < 30)
        {
            return true;
        }
        return false;
    }
}

class InputPassword
{
    private const string psw = "fygame@666";

    private bool pswok = true;
    private float showpswtime = Time.realtimeSinceStartup;

    private ElementsMapper elems = null;
    private TouchPassword touchPassword = null;
    private ClickPassword clickPassword = null;    

    public InputPassword(ElementsMapper elems)
    {
        this.elems = elems;
        touchPassword = new TouchPassword();
        clickPassword = new ClickPassword();
        elems.GetElement<Button>("btnConfirm").onClick.AddListener(onConfirmPsw);
        elems.GetElement("pswpanel").AddComponent<UIClickListener>().onClick = onCancelPsw;

        elems.GetElement("pswpanel").SetActive(false);
        elems.GetElement("frame").SetActive(false);
#if !OPEN_OUTPUTPANEL
        elems.GetElement("btnShow").SetActive(false);
        pswok = false;
#endif
    }

    public bool CheckShow()
    {
        if (pswok)
            return pswok;
        if (!touchPassword.CheckShow() && !clickPassword.CheckShow())
            return false;

        // show psw input
        elems.GetElement("pswpanel").SetActive(true);
        showpswtime = Time.realtimeSinceStartup;
        return true;
    }

    public void ShowLog()
    {
        elems.GetElement("btnShow").SetActive(true);
        elems.GetElement("pswpanel").SetActive(false);
        elems.GetElement("frame").SetActive(true);
        pswok = true;
    }

    private void onConfirmPsw()
    {
        if (elems.GetElement<InputField>("psw").text == psw)
        {
            ShowLog();
        }
        elems.GetElement("pswpanel").SetActive(false);
    }
    private void onCancelPsw()
    {
        if (Time.realtimeSinceStartup - showpswtime > 2f)
        {
            elems.GetElement("pswpanel").SetActive(false);
        }
    }
}

class OutPutPanel : Singleton<OutPutPanel>
{
    private bool inited = false;

    private int tabType = (int)PanelType.LOGGER;
    private ElementsMapper elems = null;
    private GameObject frame = null;
    private ActiveToggleGroup tabs = null;
    private OneOutputPanel[] panels = new OneOutputPanel[(int)PanelType.MAX];

    private bool canDrag = false;

    private object locker = new object();

    private List<string> logs = new List<string>();
    private const int MaxOneLogLen = 5000;
    private const int MaxLogsCnt = 4;

    private List<string> errlogs = new List<string>();
    private int errorTimes = 3;

    private bool loggerDirty = false;
    private bool errorHappened = false;

    private IntervalChecker intervalChecker = new IntervalChecker(0.1f);
    private InputPassword inputPassword = null;

    public void ShowLog()
    {
        if (!inited)
            return;
        
        if (inputPassword != null)
        {
            inputPassword.ShowLog();
        }
    }

    public bool canProfiler
    {
        get { return inited && frame != null && frame.activeSelf && tabType == (int)PanelType.PROFILER; }
    }

    public void Register()
    {
        Application.logMessageReceived += SysLogHandler;
    }

    public void UnRegister()
    {
        Application.logMessageReceived -= SysLogHandler;
    }

    public void PreLoadUIRes()
    {
        if (inited == true) return;

        var obj = Resources.Load<GameObject>("outputPanel");
        var prefab = GameObject.Instantiate(obj);
        prefab.name = "outputPanel";
        GameObject.DontDestroyOnLoad(prefab);
        initElems();
    }

    public void Update()
    {
        if (!inited) return;
        if (!frame.activeSelf)
        {
            if (inputPassword != null)
            {
                inputPassword.CheckShow();
            }
            return;
        }

        if (!intervalChecker.check()) return;

        if (tabType == (int)PanelType.PROFILER)
        {
            SetProfilerContent(Profiler.ins.Dump());
        }
        else
        {
            lock (locker)
            {
                SetLogContents(tabType);
            }
        }
    }

    public void log(string message)
    {
        log(message, "", LogType.Log);
    }

    public void logWarning(string message)
    {
        log(message, "", LogType.Warning);
    }

    public void log(string message, string stackTrace, LogType type)
    {
        if (!inited)
        {
            if (type == LogType.Log)
                Debug.Log(message);
            else if (type == LogType.Warning)
                Debug.LogWarning(message);
            return;
        }
        lock (locker)
        {
            string s = formatLog(message, stackTrace, type);
            PushLog(s);
            PushErrLog(type, s);
            loggerDirty = true;
        }
    }

    private void initElems()
    {
        elems = GameObject.Find("/outputPanel").GetComponent<ElementsMapper>();

        tabs = elems.GetElement<ActiveToggleGroup>("tabs");
        frame = elems.GetElement("frame");

        // get panels
        panels[(int)PanelType.LOGGER] = new OneOutputPanel(elems.GetElement("logPanel"));
        panels[(int)PanelType.ERRLOGGER] = new OneOutputPanel(elems.GetElement("errlogPanel"));
        panels[(int)PanelType.PROFILER] = new OneOutputPanel(elems.GetElement("profilerPanel"));

        // add listener
        elems.GetElement<Button>("btnShow").onClick.AddListener(OnShowPanels);
        elems.GetElement<Button>("btnHide").onClick.AddListener(OnHidePanels);
        elems.GetElement<Button>("btnDumpMem").onClick.AddListener(OnMemDump);
        elems.GetElement<Button>("btnResetProfiler").onClick.AddListener(OnResetProfiler);
        elems.GetElement<Slider>("profilerLevel").onValueChanged.AddListener(OnProfilerLevel);
        elems.GetElement<Toggle>("canDrag").onValueChanged.AddListener(OnCanDrag);
        tabs.onValueChanged = OnTabChange;
        tabs.Selected = tabType;

        // init logs
        logs.Add("");
        errlogs.Add("");

        // init candrag ui state
        elems.GetElement<Toggle>("canDrag").isOn = canDrag;
        SetPanelsCanDrag(canDrag);

        inited = true;
        if (errorHappened)
        {
            errorHappen();
        }

        inputPassword = new InputPassword(elems);
    }

    private string formatLog(string message, string stackTrace, LogType type)
    {
        DateTime now = DateTime.Now;
        string s;
        string stime = String.Format("\n<size=14>[{0}:{1}:{2}.{3}]</size>", now.Hour, now.Minute, now.Second, now.Millisecond);
        if (type == LogType.Error || type == LogType.Exception || type == LogType.Assert)
        {
            s = String.Format("{0}<color=red>{1}</color>", stime, message);
            if (!errorHappened)
            {
                errorHappen();
                errorHappened = true;
            }
        }
        else if (type == LogType.Warning)
        {
            s = String.Format("{0}<color=yellow>{1}</color>", stime, message);
        }
        else
        {
            s = String.Format("{0}<color=white>{1}</color>", stime, message);
        }
        return s;
    }

    private void errorHappen()
    {
        if (inited)
        {
            // 将按钮变红
            var backTran = elems.GetElement("btnShow").transform.Find("back") as RectTransform;
            backTran.SetSizeWithCurrentAnchors(RectTransform.Axis.Horizontal, 55);
            backTran.SetSizeWithCurrentAnchors(RectTransform.Axis.Vertical, 30);
            backTran.GetComponent<Image>().color = new Color(1, 0, 0);
            elems.GetElement("btnHide").GetComponent<Image>().color = new Color(1, 0, 0);
        }
    }

    private void OnShowPanels()
    {
        frame.SetActive(true);
    }

    private void OnHidePanels()
    {
        frame.SetActive(false);
    }

    private void OnTabChange(int tabType)
    {
        this.tabType = tabType;
        if (tabType == (int)PanelType.LOGGER || tabType == (int)PanelType.ERRLOGGER)
        {
            loggerDirty = true;
            SetLogContents(tabType);
        }
    }

    private void OnMemDump()
    {
        log(Uts.Core.Dump());
    }

    private void OnResetProfiler()
    {
        Profiler.Ins.Reset();
    }

    private void OnProfilerLevel(float val)
    {
        Profiler.Ins.SetLevel((int)val);
    }

    private void OnCanDrag(bool on)
    {
        SetPanelsCanDrag(on);
    }

    private void SetProfilerContent(string s)
    {
        if (s == null) return;

        var panel = panels[(int)PanelType.PROFILER];
        panel.SetContent(0, s, false);
    }

    private void SetContent(int type, string msg)
    {
        var panel = panels[type];
        panel.SetContent(0, msg, canDrag);
    }

    private void SetLogContents(int type)
    {
        if (!loggerDirty) return;

        bool autoScrollBottom = !canDrag;
        var curlogs = tabType == (int)PanelType.LOGGER ? logs : errlogs;
        var panel = panels[type];
        for (int i = 0, n = curlogs.Count; i < n; i++)
        {
            panel.SetContent(i, curlogs[i], autoScrollBottom);
        }
        loggerDirty = false;
    }

    private void SetPanelsCanDrag(bool canDrag)
    {
        this.canDrag = canDrag;
        for (int i = 0, n = panels.Length; i < n; i++)
        {
            panels[i].SetCanDrag(canDrag);
        }
    }

    private void PushLog(string log)
    {
        string curlog = logs[logs.Count - 1];
        if ((curlog.Length + log.Length) < MaxOneLogLen)
        {
            logs[logs.Count - 1] = curlog + log;
        }
        else
        {
            if (logs.Count == MaxLogsCnt)
                logs.RemoveAt(0);
            logs.Add(log);
        }
    }

    private void PushErrLog(LogType type, string log)
    {
        if (type == LogType.Assert || type == LogType.Error || type == LogType.Exception)
        {
            if (errorTimes-- > 0)
            {
                errlogs[0] = errlogs[0] + log;
            }
        }
    }

    private void SysLogHandler(string message, string stackTrace, LogType type)
    {
        log(message, stackTrace, type);
    }
}

